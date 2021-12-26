import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideDetailModal, addAsnDetail, editAsnDetail, setAsnDetails } from 'common/reducers/cwmReceive';
import { loadProducts, clearProductNos } from 'common/reducers/cwmSku';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.product_no = msg('productNo');
  fieldLabelMap.product_sku = msg('SKU');
  fieldLabelMap.name = msg('descCN');
  fieldLabelMap.order_qty = msg('orderQty');
  fieldLabelMap.virtual_whse = msg('virtualWhse');
  fieldLabelMap.po_no = msg('poNo');
  fieldLabelMap.container_no = msg('containerNo');
  fieldLabelMap.unit_price = msg('unitPrice');
  fieldLabelMap.currency = msg('currency');
  fieldLabelMap.unit = msg('unit');
  fieldLabelMap.amount = msg('totalAmount');
}

@injectIntl
@connect(
  state => ({
    visible: state.cwmReceive.detailModal.visible,
    asnDetails: state.cwmReceive.asnDetails,
    productNos: state.cwmSku.productNos,
    products: state.cwmSku.products,
    units: state.saasParams.latest.unit.map(un => ({
      code: un.unit_code,
      name: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      code: curr.curr_code,
      name: curr.curr_name,
    })),
    asnHead: state.cwmReceive.asnHead,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    hideDetailModal,
    loadProducts,
    clearProductNos,
    addAsnDetail,
    editAsnDetail,
    setAsnDetails,
  }
)
@Form.create()
export default class AddDetailModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    selectedOwner: PropTypes.number,
    units: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    })),
  }
  state = {
    amount: 0,
    skus: [],
    unit: '',
    currency: '',
    country: '',
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible && nextProps.edit) {
      const { product } = nextProps;
      this.setState({
        unit: product.unit,
        currency: product.currency,
        amount: product.amount,
      });
      this.props.form.setFieldsValue({
        unit_price: product.unit_price,
        product_no: product.product_no,
        product_sku: product.product_sku,
        name: product.name,
        order_qty: product.order_qty,
        virtual_whse: product.virtual_whse,
        po_no: product.po_no,
        container_no: product.container_no,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideDetailModal();
    this.setState({
      amount: 0,
      skus: [],
      unit: '',
      currency: '',
    });
    this.props.form.setFieldsValue({
      unit_price: '',
      product_no: '',
      product_sku: '',
      name: '',
      order_qty: '',
      virtual_whse: '',
      po_no: '',
      container_no: '',
    });
    this.props.clearProductNos();
  }
  handleSearch = (value) => {
    if (value.length >= 3) {
      const { selectedOwner } = this.props;
      this.props.loadProducts(value, selectedOwner);
    }
  }
  submit = () => {
    const { product } = this.props;
    const {
      edit, asnHead, defaultWhse, units, currencies,
    } = this.props;
    const {
      unit, amount, currency, country,
    } = this.state;
    const asnDetails = [...this.props.asnDetails];
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!edit) {
          const detail = {
            ...values,
            amount,
            currency,
            unit,
            country,
          };
          if (asnHead.asn_no) {
            detail.asn_seq_no = asnDetails.length + 1;
            this.props.addAsnDetail({
              detail,
              whseCode: defaultWhse.code,
              asnNo: asnHead.asn_no,
              bonded: asnHead.bonded,
            }).then((result) => {
              if (!result.error) {
                message.success(this.msg('savedSucceed'));
              }
            });
          }
          this.props.setAsnDetails([...asnDetails, detail]);
        } else {
          const detail = {
            ...values,
            product_sku: values.product_sku || '',
            unit,
            currency,
            country,
            amount: amount || product.amount,
          };
          asnDetails.splice(product.index, 1, { ...detail, asn_seq_no: product.asn_seq_no });
          this.props.setAsnDetails(asnDetails);
          if (asnHead.asn_no) {
            const fields = Object.keys(detail);
            const contentLog = [];
            ['unit_price', 'order_qty', 'amount'].forEach((field) => {
              const fieldNumVal = Number(detail[field]);
              if (!Number.isNaN(fieldNumVal)) {
                detail[field] = fieldNumVal;
              } else {
                detail[field] = '';
              }
            });
            for (let i = 0; i < fields.length; i++) {
              const field = fields[i];
              if (product[field] !== detail[field] &&
                !(!product[field] && !detail[field])) {
                if (field === 'unit') {
                  const value = units.find(item => item.code === detail[field]) &&
                    units.find(item => item.code === detail[field]).name;
                  const oldValue = units.find(item => item.code === product[field]) &&
                    units.find(item => item.code === product[field]).name;
                  contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
                } else if (field === 'currency') {
                  const value = currencies.find(item => item.code === detail[field]) &&
                    currencies.find(item => item.code === detail[field]).name;
                  const oldValue = currencies.find(item => item.code === product[field]) &&
                    currencies.find(item => item.code === product[field]).name;
                  contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
                } else {
                  contentLog.push(`"${fieldLabelMap[field]}"由 [${product[field] || ''}] 改为 [${detail[field] || ''}]`);
                }
              }
            }
            this.props.editAsnDetail({
              detail,
              asnNo: asnHead.asn_no,
              seqNo: product.asn_seq_no,
              contentLog: contentLog.length > 0 ? `修改ASN明细${product.asn_seq_no}, ${contentLog.join(';')}` : '',
            }).then((result) => {
              if (!result.error) {
                message.success(this.msg('savedSucceed'));
              }
            });
          }
        }
        this.handleCancel();
      }
      this.props.clearProductNos();
    });
  }
  handleQtyChange = (e) => {
    const unitPrice = this.props.form.getFieldValue('unit_price');
    const { amount } = this.state;
    if (!unitPrice && !amount) { return; }
    if (!unitPrice && amount) {
      this.props.form.setFieldsValue({ unit_price: (amount / e.target.value).toFixed(2) });
    }
    if (unitPrice) {
      this.setState({ amount: e.target.value * unitPrice });
    }
  }
  handlePriceChange = (e) => {
    const orderQty = this.props.form.getFieldValue('order_qty');
    if (orderQty) {
      this.setState({ amount: orderQty * e.target.value });
    }
  }
  handleAmountChange = (e) => {
    const orderQty = this.props.form.getFieldValue('order_qty');
    this.setState({
      amount: e.target.value,
    });
    if (orderQty) {
      this.props.form.setFieldsValue({ unit_price: (e.target.value / orderQty).toFixed(2) });
    }
  }
  handleSelect = (value) => {
    const { products } = this.props;
    const filterProducts = products.filter(item => item.product_no === value);
    const skus = filterProducts.map(fp => fp.product_sku);
    const product = filterProducts[0];
    this.setState({
      unit: product.unit,
      currency: product.currency,
      country: product.country,
      skus,
    });
    this.props.form.setFieldsValue({
      unit_price: product.unit_price,
      product_no: product.product_no,
      product_sku: product.product_sku,
      name: product.desc_cn,
    });
  }
  handleUnitChange = (value) => {
    const unit = this.props.units.filter(un => un.code === value)[0];
    if (unit) {
      this.setState({ unit: unit.code });
    }
  }
  handleCurrChange = (value) => {
    const curr = this.props.currencies.filter(cu => cu.code === value)[0];
    if (curr) {
      this.setState({ currency: curr.code });
    }
  }
  handleSelectSku = (value) => {
    const { products } = this.props;
    const product = products.find(p => p.product_sku === value);
    this.setState({
      unit: product.unit,
      currency: product.currency,
    });
    this.props.form.setFieldsValue({
      unit_price: product.unit_price,
      product_no: product.product_no,
      product_sku: product.product_sku,
      name: product.desc_cn,
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, productNos, units, currencies, product,
    } = this.props;
    const {
      skus, unit, currency,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal width={800} maskClosable={false} visible={visible} title="货品明细" onOk={this.submit} onCancel={this.handleCancel}>
        <Form layout="horizontal" className="form-layout-compact">
          <FormItem label={fieldLabelMap.product_no} {...formItemLayout}>
            {getFieldDecorator('product_no', {
              rules: [{ required: true, message: '请输入货号' }],
            })(<Select mode="combobox" placeholder="请至少输入三位货号" onChange={this.handleSearch} style={{ width: '100%' }} onSelect={this.handleSelect}>
              {productNos.map(productNo => (<Option value={productNo} key={productNo}>
                {productNo}</Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={fieldLabelMap.product_sku} {...formItemLayout}>
            {getFieldDecorator('product_sku', {
              initialValue: product.product_sku,
            })(<Select onSelect={this.handleSelectSku} allowClear>
              {skus.map(sku => (<Option value={sku} key={sku}>{sku}</Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={fieldLabelMap.name} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: product.name,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.order_qty} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('order_qty', {
                rules: [{ required: true, message: '请输入订单数量' }],
              })(<Input type="number" style={{ width: '70%' }} onChange={this.handleQtyChange} />)}
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.unit}
                value={unit}
                style={{ width: '30%' }}
                onChange={this.handleUnitChange}
              >
                {units.map(un => (<Option value={un.code} key={un.code}>
                  {un.code} | {un.name}</Option>))}
              </Select>
            </InputGroup>
          </FormItem>
          <FormItem label={fieldLabelMap.virtual_whse} {...formItemLayout}>
            {getFieldDecorator('virtual_whse', {
              initialValue: product.virtual_whse,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.po_no} {...formItemLayout}>
            {getFieldDecorator('po_no', {
              initialValue: product.po_no,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.container_no} {...formItemLayout}>
            {getFieldDecorator('container_no', {
              initialValue: product.container_no,
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('amount')} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('unit_price', {
                initialValue: product.unit_price,
              })(<Input placeholder={fieldLabelMap.unit_price} type="number" onChange={this.handlePriceChange} style={{ width: '30%' }} />)}
              <Input placeholder={this.msg('totalAmount')} type="number" value={this.state.amount || product.amount} onChange={this.handleAmountChange} style={{ width: '30%' }} />
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.currency}
                value={currency}
                style={{ width: '40%' }}
                onChange={this.handleCurrChange}
              >
                {currencies.map(curr => (<Option value={curr.code} key={curr.code}>
                  {curr.code} | {curr.name}</Option>))}
              </Select>
            </InputGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
