import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleDetailModal, addTemporary, setTemporary, addInvoiceDetail, updateInvoiceDetail } from 'common/reducers/sofInvoice';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.po_no = msg('poNo');
  fieldLabelMap.gt_product_no = msg('productNo');
  fieldLabelMap.gt_name_cn = msg('nameCN');
  fieldLabelMap.gt_qty_pcs = msg('qtyPcs');
  fieldLabelMap.gt_unit_pcs = msg('unitPcs');
  fieldLabelMap.gt_netwt = msg('netWt');
  fieldLabelMap.gt_origin_country = msg('originCountry');
  fieldLabelMap.gt_unit_price = msg('unitPrice');
  fieldLabelMap.gt_amount = msg('totalamount');
  fieldLabelMap.gt_currency = msg('currency');
}

@injectIntl
@connect(
  state => ({
    visible: state.sofInvoice.detailModal.visible,
    record: state.sofInvoice.detailModal.record,
    currencies: state.saasParams.latest.currency,
    countries: state.saasParams.latest.country,
    invoiceDetails: state.sofInvoice.invoiceDetails,
    invoiceHead: state.sofInvoice.invoiceHead,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
  }),
  {
    toggleDetailModal,
    addTemporary,
    setTemporary,
    addInvoiceDetail,
    updateInvoiceDetail,
  }
)
@Form.create()
export default class DetailModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    headForm: PropTypes.shape({ getFieldValue: PropTypes.func }).isRequired,
    type: PropTypes.oneOf(['create', 'edit']),
  }
  state = {
    amount: '',
    unit: '',
    currency: '',
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nexrProps) {
    if (nexrProps.visible !== this.props.visible && nexrProps.visible) {
      this.setState({
        amount: nexrProps.record.gt_amount,
        unit: nexrProps.record.gt_unit_pcs,
        currency: nexrProps.record.gt_currency,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  submit = () => {
    const { record, invoiceDetails, invoiceHead } = this.props;
    const { unit, currency, amount = 0 } = this.state;
    const totalQty = invoiceDetails.reduce((prev, next) => prev + Number(next.gt_qty_pcs), 0);
    const totalAmount = invoiceDetails.reduce((prev, next) => prev + Number(next.gt_amount), 0);
    const totalNetWt = invoiceDetails.reduce((prev, next) => prev + Number(next.gt_netwt), 0);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!record.index && record.index !== 0) {
          const invcoieDetail = {
            gt_unit_pcs: unit,
            gt_amount: amount,
            gt_currency: currency,
            ...values,
            index: invoiceDetails.length + 1,
          };
          this.props.addTemporary({
            ...invcoieDetail,
            splitQty: values.gt_qty_pcs,
            disabled: true,
          });
          this.props.headForm.setFieldsValue({
            total_qty: totalQty + Number(values.gt_qty_pcs),
            total_amount: totalAmount + Number(amount),
            total_net_wt: totalNetWt + Number(values.gt_netwt),
          });
          if (this.props.type === 'edit') {
            this.props.addInvoiceDetail(
              invcoieDetail,
              invoiceHead.invoice_no,
              invoiceHead.invoice_date,
            ).then((result) => {
              if (!result.error) {
                message.success(this.msg('savedSucceed'));
              }
            });
          }
        } else {
          const details = [...this.props.invoiceDetails];
          const formData = {
            ...values, gt_unit_pcs: unit, gt_amount: amount, gt_currency: currency,
          };
          const { index } = record;
          const origRecord = details[index];
          const data = {
            ...record,
            ...formData,
            splitQty: formData.gt_qty_pcs,
          };
          const headUpdates = {
            total_qty: totalQty + (Number(data.gt_qty_pcs) - Number(origRecord.gt_qty_pcs)),
            total_amount: totalAmount + (Number(amount) - Number(origRecord.gt_amount)),
            total_net_wt: totalNetWt + (Number(data.gt_netwt) - Number(origRecord.gt_netwt)),
          };
          this.props.headForm.setFieldsValue(headUpdates);
          details.splice(index, 1, data);
          this.props.setTemporary(details);
          if (this.props.type === 'edit') {
            ['gt_netwt', 'gt_qty_pcs', 'gt_unit_price'].forEach((field) => {
              const fieldNumVal = Number(formData[field]);
              if (!Number.isNaN(fieldNumVal)) {
                formData[field] = fieldNumVal;
              } else {
                formData[field] = '';
              }
            });
            const contentLog = [];
            const invDetailFields = Object.keys(formData);
            for (let i = 0; i < invDetailFields.length; i++) {
              const field = invDetailFields[i];
              if (origRecord[field] !== formData[field] &&
                !(!origRecord[field] && !formData[field])) {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${origRecord[field] || ''}] 改为 [${formData[field] || ''}]`);
              }
            }
            this.props.updateInvoiceDetail(
              data,
              headUpdates,
              invoiceHead.invoice_no,
              origRecord.id,
              contentLog.length > 0 ? `修改发票明细${index + 1} ${contentLog.join(';')}` : '',
            ).then((result) => {
              if (!result.error) {
                message.success(this.msg('savedSucceed'));
              }
            });
          }
        }
        this.handleCancel();
      }
    });
  }
  handleCancel = () => {
    this.props.toggleDetailModal(false);
    this.setState({
      amount: '',
      unit: '',
      currency: '',
    });
    this.props.form.resetFields();
  }
  handleQtyChange = (e) => {
    const value = parseFloat(e.target.value);
    const unitPrice = this.props.form.getFieldValue('gt_unit_price');
    const { amount } = this.state;
    if (!Number.isNaN(value)) {
      if (!unitPrice && amount) {
        this.props.form.setFieldsValue({ gt_unit_price: (amount / e.target.value).toFixed(2) });
      } else if (unitPrice) {
        this.setState({ amount: (unitPrice * e.target.value).toFixed(2) });
      }
    }
  }
  handlePriceChange = (e) => {
    const orderQty = this.props.form.getFieldValue('gt_qty_pcs');
    if (orderQty) {
      this.setState({ amount: orderQty * e.target.value });
    }
  }
  handleAmountChange = (e) => {
    const orderQty = this.props.form.getFieldValue('gt_qty_pcs');
    this.setState({
      amount: e.target.value,
    });
    if (orderQty) {
      this.props.form.setFieldsValue({ gt_unit_price: (e.target.value / orderQty).toFixed(2) });
    }
  }
  handleUnitChange = (value) => {
    this.setState({
      unit: value,
    });
  }
  handleCurrChange = (value) => {
    this.setState({
      currency: value,
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, record, currencies, countries, units,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal width={800} maskClosable={false} visible={visible} title="货品明细" onOk={this.submit} onCancel={this.handleCancel}>
        <Form layout="horizontal" className="form-layout-compact">
          <FormItem label={fieldLabelMap.po_no} {...formItemLayout}>
            {getFieldDecorator('po_no', {
              initialValue: record.po_no || '',
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.gt_product_no} {...formItemLayout}>
            {getFieldDecorator('gt_product_no', {
              initialValue: record.gt_product_no || '',
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.gt_name_cn} {...formItemLayout}>
            {getFieldDecorator('gt_name_cn', {
              initialValue: record.gt_name_cn || '',
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.gt_qty_pcs} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('gt_qty_pcs', {
                rules: [{ required: true, message: '请输入订单数量' }],
                initialValue: record.gt_qty_pcs || '',
              })(<Input type="number" style={{ width: '70%' }} onChange={this.handleQtyChange} />)}
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.gt_unit_pcs}
                style={{ width: '30%' }}
                onChange={this.handleUnitChange}
                value={this.state.unit}
              >
                {units.map(unit =>
                  (<Option key={unit.value} value={unit.value}>{unit.text}</Option>))}
              </Select>
            </InputGroup>
          </FormItem>
          <FormItem label={fieldLabelMap.gt_netwt} {...formItemLayout}>
            {getFieldDecorator('gt_netwt', {
              initialValue: record.gt_netwt || '',
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.gt_origin_country} {...formItemLayout}>
            {getFieldDecorator('gt_origin_country', {
              initialValue: record.gt_origin_country || '',
            })(<Select
              allowClear
              optionFilterProp="children"
              placeholder={fieldLabelMap.gt_origin_country}
              showSearch
            >
              {countries.map(coun =>
                (<Option value={coun.cntry_co} key={coun.cntry_co}>
                  {coun.cntry_co} | {coun.cntry_name_cn}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('amount')} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('gt_unit_price', {
                initialValue: record.gt_unit_price || '',
              })(<Input placeholder={fieldLabelMap.gt_unit_price} type="number" onChange={this.handlePriceChange} style={{ width: '30%' }} />)}
              <Input placeholder={fieldLabelMap.gt_amount} type="number" value={this.state.amount} onChange={this.handleAmountChange} style={{ width: '30%' }} />
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.gt_currency}
                style={{ width: '40%' }}
                value={this.state.currency}
                onChange={this.handleCurrChange}
              >
                {currencies.map(curr =>
                  (<Option value={curr.curr_code} key={curr.curr_code}>
                    {curr.curr_code} | {curr.curr_name}
                  </Option>))}
              </Select>
            </InputGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
