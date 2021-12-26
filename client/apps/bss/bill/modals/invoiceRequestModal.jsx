import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Col, Checkbox, Form, Modal, Row, Select, Input } from 'antd';
import { toggleInvoiceRequestModal, createBillInvoice } from 'common/reducers/bssInvoice';
import { loadAllInvoicingKinds } from 'common/reducers/saasInvoicingKind';
import { formatMsg } from '../message.i18n';


const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssInvoice.invoiceRequestModal.visible,
    billInfo: state.bssInvoice.invoiceRequestModal.billInfo,
    invoicingKinds: state.saasInvoicingKind.allInvoicingKinds,
  }),
  { toggleInvoiceRequestModal, createBillInvoice, loadAllInvoicingKinds }
)
@Form.create()
export default class InvoiceRequestModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadAllInvoicingKinds();
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleInvoiceRequestModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { billInfo } = this.props;
        const { taxIncluded } = this.props.form.getFieldValue('tax_included');
        const invoice = this.props.invoicingKinds.find(kind =>
          kind.invoicing_code === values.invoice_type);
        this.props.createBillInvoice({
          billNo: billInfo.bill_no,
          billnoName: values.billno_name,
          noninvoiceAmount: values.noninvoice_amount,
          invoiceAmount: parseFloat(values.invoice_amount),
          taxRate: values.tax_rate,
          taxAmount: values.tax_amount,
          invoiceType: invoice.invoice_cat,
          totalInvoiceAmount: values.total_invoice_amount,
          remark: values.remark,
          taxIncluded,
        }).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
          }
        });
      }
    });
  }
  handleCalculateInvoice = (taxRate, invoiceAmount, taxIncluded) => {
    let taxInc;
    if (taxIncluded === undefined) {
      taxInc = this.props.form.getFieldValue('tax_included');
    } else {
      taxInc = taxIncluded;
    }
    const data = {};
    const taxRatePercent = taxRate * 0.01;
    if (taxInc) {
      data.tax_amount =
      parseFloat(((invoiceAmount / (1 + taxRatePercent)) * taxRatePercent).toFixed(2));
      data.total_invoice_amount = invoiceAmount;
    } else {
      data.tax_amount = parseFloat((invoiceAmount * taxRatePercent).toFixed(2));
      data.total_invoice_amount = invoiceAmount + data.tax_amount;
    }
    return data;
  }
  handleInvoiceAmountChange = (e) => {
    const invoiceAmount = parseFloat(e.target.value);
    const noninvoiceAmount = this.props.billInfo.noninvoice_amount;
    const invoicingAmount = this.props.billInfo.invoicing_amount;
    const newNoninvoiceAmount = noninvoiceAmount - invoiceAmount;
    const taxRate = parseFloat(this.props.form.getFieldValue('tax_rate'));
    if (Number.isNaN(invoiceAmount)) {
      this.props.form.setFieldsValue({
        invoicing_amount: invoicingAmount,
        noninvoice_amount: noninvoiceAmount,
        tax_amount: '',
        total_invoice_amount: '',
      });
    } else if (Number.isNaN(taxRate)) {
      this.props.form.setFieldsValue({
        invoicing_amount: invoiceAmount + invoicingAmount,
        noninvoice_amount: newNoninvoiceAmount,
      });
    } else {
      const formData = this.handleCalculateInvoice(taxRate, invoiceAmount);
      formData.invoicing_amount = invoiceAmount + invoicingAmount;
      formData.noninvoice_amount = newNoninvoiceAmount;
      this.props.form.setFieldsValue(formData);
    }
  }
  handleTaxRateChange = (e) => {
    const taxRate = parseFloat(e.target.value);
    const invoiceAmount = parseFloat(this.props.form.getFieldValue('invoice_amount'));
    if (!Number.isNaN(taxRate) && !Number.isNaN(invoiceAmount)) {
      const formData = this.handleCalculateInvoice(taxRate, invoiceAmount);
      this.props.form.setFieldsValue(formData);
    } else {
      this.props.form.setFieldsValue({
        tax_amount: '',
        total_invoice_amount: '',
      });
    }
  }
  handleInvoiceTypeSelect = (invoicingCode) => {
    const invoice = this.props.invoicingKinds.find(kind => kind.invoicing_code === invoicingCode);
    this.props.form.setFieldsValue({
      tax_rate: invoice.tax_rate,
    });
    const invoiceAmount = parseFloat(this.props.form.getFieldValue('invoice_amount'));
    if (!Number.isNaN(invoiceAmount)) {
      const formData = this.handleCalculateInvoice(invoice.tax_rate, invoiceAmount);
      this.props.form.setFieldsValue(formData);
    }
  }
  handleTaxIncludeChange = (e) => {
    const taxIncluded = e.target.checked;
    const invoiceAmount = parseFloat(this.props.form.getFieldValue('invoice_amount'));
    const taxRate = parseFloat(this.props.form.getFieldValue('tax_rate'));
    if (!Number.isNaN(invoiceAmount) && !Number.isNaN(taxRate)) {
      const formData = this.handleCalculateInvoice(taxRate, invoiceAmount, taxIncluded);
      this.props.form.setFieldsValue(formData);
    }
  }
  validateInvoiceAmount = (rule, value, callback) => {
    if (value && value > this.props.billInfo.noninvoice_amount) {
      callback('开票金额不得大于待开票金额');
    } else {
      callback();
    }
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, billInfo, invoicingKinds,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('requestInvoice')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form ayout="horizontal" className="form-layout-compact">
          <FormItem label={this.msg('customerName')} {...formItemLayout} >
            <Input disabled value={billInfo.buyer_name} />
          </FormItem>
          <FormItem label={this.msg('billName')} {...formItemLayout}>
            {getFieldDecorator('billno_name', {
              initialValue: billInfo.bill_title,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={this.msg('settledAmount')} {...formItemLayout}>
            <Input disabled value={billInfo.account_amount + billInfo.other_amount} />
          </FormItem>
          <FormItem label={this.msg('noninvoiceAmount')} {...formItemLayout}>
            {getFieldDecorator('noninvoice_amount', {
              initialValue: billInfo.noninvoice_amount,
            })(<Input disabled type="number" />)}
          </FormItem>
          {/*
            <FormItem label={this.msg('invoicingAmount')} {...formItemLayout}>
            {getFieldDecorator('invoicing_amount', {
              initialValue: billInfo.invoicing_amount,
            })(<Input disabled type="number" />)}
          </FormItem>
          <FormItem label={this.msg('invoicedAmount')} {...formItemLayout}>
            {getFieldDecorator('invoiced_amount', {
              initialValue: billInfo.invoiced_amount,
            })(<Input disabled type="number" />)}
          </FormItem>
          */}
          <FormItem label={this.msg('invoiceAmount')} {...formItemLayout} >
            <Row gutter={8}>
              <Col span={18}>
                {getFieldDecorator('invoice_amount', {
                  rules: [
                    { required: true, message: this.msg('pleaseInputInvoiceAmount') },
                    { validator: this.validateInvoiceAmount },
                  ],
                })(<Input onChange={this.handleInvoiceAmountChange} type="number" />)}
              </Col>
              <Col span={6}>
                {getFieldDecorator('tax_included', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox onChange={this.handleTaxIncludeChange}>{this.msg('taxIncluded')}</Checkbox>)}
              </Col>
            </Row>
          </FormItem>
          <FormItem label={this.msg('invoiceType')} {...formItemLayout} >
            {getFieldDecorator('invoice_type', {
              rules: [{ required: true, message: this.msg('pleaseSelectInvoiceType') }],
            })(<Select
              onSelect={this.handleInvoiceTypeSelect}
            >
              {invoicingKinds.map(kind =>
                (<Option key={kind.invoicing_code} value={kind.invoicing_code}>
                  {kind.invoicing_type}</Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('taxAmount')} {...formItemLayout} >
            <Row gutter={8}>
              <Col span={8}>
                {getFieldDecorator('tax_rate')(<Input
                  placeholder={this.msg('taxRate')}
                  onChange={this.handleTaxRateChange}
                  addonAfter="%"
                  type="number"
                />)}
              </Col>
              <Col span={16}>
                {getFieldDecorator('tax_amount')(<Input disabled />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem label={this.msg('totalInvoiceAmount')} {...formItemLayout} >
            {getFieldDecorator('total_invoice_amount')(<Input disabled />)}
          </FormItem>
          <FormItem label={this.msg('remark')} {...formItemLayout} >
            {getFieldDecorator('remark')(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
