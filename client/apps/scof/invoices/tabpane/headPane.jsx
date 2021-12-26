import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Form, Input, Select, DatePicker, Col, Row } from 'antd';
import moment from 'moment';
import FormPane from 'client/components/FormPane';
import { loadInvoiceBuyerSellers } from 'common/reducers/sofInvoice';
import { WRAP_TYPE } from 'common/constants';
import { formatMsg } from '../message.i18n';

const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};

@injectIntl
@connect(
  state => ({
    trxModes: state.saasParams.latest.trxnMode,
    invoiceHead: state.sofInvoice.invoiceHead,
    owners: state.sofInvoice.buyers,
    suppliers: state.sofInvoice.sellers,
  }),
  { loadInvoiceBuyerSellers }
)
export default class CommInvoiceHeadPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    handlePackageSelect: PropTypes.func.isRequired,
    packageType: PropTypes.string,
    editable: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['edit', 'view']),
  }
  componentDidMount() {
    this.props.loadInvoiceBuyerSellers();
  }
  handleSelect = (value) => {
    this.props.handlePackageSelect(value);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      form: { getFieldDecorator }, invoiceHead, suppliers, owners, trxModes, packageType,
      editable, type,
    } = this.props;
    const disabled = type === 'view';
    return (
      <FormPane descendant hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('invoiceNo')} {...formItemLayout}>
                {getFieldDecorator('invoice_no', {
                rules: [{ type: 'string', required: true, message: 'Please select time!' }],
                initialValue: invoiceHead && invoiceHead.invoice_no,
              })(<Input disabled={!editable} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('invoiceDate')} {...formItemLayout}>
                {getFieldDecorator('invoice_date', {
                initialValue: (invoiceHead && invoiceHead.invoice_date) &&
                moment(new Date(invoiceHead.invoice_date)),
              })(<DatePicker disabled={disabled} format={dateFormat} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('owner')} {...formItemLayout}>
                {getFieldDecorator('owner_partner_id', {
                initialValue: invoiceHead.owner_partner_id,
              })(<Select
                allowClear
                showSearch
                showArrow
                optionFilterProp="children"
                disabled={disabled}
              >
                {owners.map(data => (<Option key={data.id} value={data.id}>{[data.partner_code, data.name].filter(pt => pt).join('|')}</Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('supplier')} {...formItemLayout}>
                {getFieldDecorator('supplier_partner_id', {
                initialValue: invoiceHead.supplier_partner_id,
              })(<Select
                allowClear
                showSearch
                showArrow
                optionFilterProp="children"
                disabled={disabled}
              >
                {suppliers.map(data => (<Option key={data.id} value={data.id}>{[data.partner_code, data.name].filter(pt => pt).join('|')}</Option>))}
              </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('blNo')} {...formItemLayout}>
                {getFieldDecorator('bl_awb_no', {
                initialValue: invoiceHead && invoiceHead.bl_awb_no,
              })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('category')} {...formItemLayout}>
                {getFieldDecorator('invoice_category', {
                initialValue: invoiceHead && invoiceHead.invoice_category,
              })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('wrapQtyType')} {...formItemLayout}>
                <InputGroup compact>
                  {getFieldDecorator('package_number', {
                  initialValue: invoiceHead && invoiceHead.package_number,
                })(<Input
                  type="number"
                  style={{ width: '50%' }}
                  disabled={disabled}
                />)}
                  <Select
                    style={{ width: '50%' }}
                    placeholder={this.msg('selectPackage')}
                    onSelect={this.handleSelect}
                    value={packageType}
                    disabled={disabled}
                  >
                    {WRAP_TYPE.map(wt => (<Option value={wt.value} key={wt.value}>
                      {wt.text}</Option>))}
                  </Select>
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('tradeMode')} {...formItemLayout}>
                {getFieldDecorator('trade_mode', {
                initialValue: invoiceHead && invoiceHead.trade_mode,
              })(<Select disabled={disabled}>
                {trxModes.map(mode =>
                  (<Option key={mode.trx_mode} vaule={mode.trx_mode}>
                    {mode.trx_mode} | {mode.trx_spec}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('totalQty')} {...formItemLayout}>
                {getFieldDecorator('total_qty', {
                initialValue: invoiceHead && invoiceHead.total_qty,
              })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('totalAmount')} {...formItemLayout}>
                {getFieldDecorator('total_amount', {
                initialValue: invoiceHead && invoiceHead.total_amount,
              })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('totalNetWt')} {...formItemLayout}>
                {getFieldDecorator('total_net_wt', {
                initialValue: invoiceHead && invoiceHead.total_net_wt,
              })(<Input
                type="number"
                addonAfter="KG"
                disabled
              />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('grossWeight')} {...formItemLayout}>
                {getFieldDecorator('total_grosswt', {
                initialValue: invoiceHead && invoiceHead.total_grosswt,
              })(<Input
                type="number"
                addonAfter="KG"
                disabled={disabled}
              />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('invoicePayDate')} {...formItemLayout}>
                {getFieldDecorator('payment_date', {
                  initialValue: invoiceHead && invoiceHead.payment_date
                  && moment(invoiceHead.payment_date),
              })(<DatePicker disabled={disabled} format={dateFormat} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={`${this.msg('invAttr')}1`} {...formItemLayout}>
                {getFieldDecorator('inv_attr1_str', {
                initialValue: invoiceHead && invoiceHead.inv_attr1_str,
              })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={`${this.msg('invAttr')}2`} {...formItemLayout}>
                {getFieldDecorator('inv_attr2_str', {
                initialValue: invoiceHead && invoiceHead.inv_attr2_str,
              })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={`${this.msg('invAttr')}3`} {...formItemLayout}>
                {getFieldDecorator('inv_attr3_str', {
                initialValue: invoiceHead && invoiceHead.inv_attr3_str,
              })(<Input disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
