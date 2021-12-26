import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Checkbox, Form, Row, Col, Input, Select, InputNumber } from 'antd';
import FormPane from 'client/components/FormPane';
import { loadAllInvoicingKinds } from 'common/reducers/saasInvoicingKind';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@injectIntl
@connect(state => ({
  formData: state.cmsQuote.quoteData,
  invoicingKinds: state.saasInvoicingKind.allInvoicingKinds,
}), { loadAllInvoicingKinds })
export default class SettingPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  componentDidMount() {
    this.props.loadAllInvoicingKinds();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      form: { getFieldDecorator }, formData, readOnly, invoicingKinds,
    } = this.props;
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('quoteNo')} {...formItemLayout}>
                {getFieldDecorator('quote_no', {
                  rules: [{ required: true }],
                  initialValue: formData.quote_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('quoteName')} {...formItemLayout}>
                {getFieldDecorator('quote_name', {
                  rules: [{ required: true }],
                  initialValue: formData.quote_name,
                })(<Input disabled={readOnly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('buyerName')} {...formItemLayout}>
                {getFieldDecorator('buyer_name', {
                  rules: [{ required: true }],
                  initialValue: formData.buyer_name,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sellerName')} {...formItemLayout}>
                {getFieldDecorator('seller_name', {
                  rules: [{ required: true }],
                  initialValue: formData.seller_name,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('advanceTaxType')} {...formItemLayout}>
                {getFieldDecorator('invoicing_code', {
                  initialValue: formData.invoicing_code,
                  rules: [{ required: true, message: '开票类型必选' }],
                })(<Select style={{ width: '100%' }} disabled={readOnly}>
                  {invoicingKinds.map(kind =>
                (<Option key={kind.invoicing_code} value={kind.invoicing_code}>
                  {kind.invoicing_type}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('cusItemPerSheet')} {...formItemLayout}>
                {getFieldDecorator('cus_item_per_sheet', {
                  initialValue: Number(formData.cus_item_per_sheet),
                  rules: [{ required: true, message: '品项数必填' }],
                })(<InputNumber style={{ width: '100%' }} disabled={readOnly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('ciqItemPerSheet')} {...formItemLayout}>
                {getFieldDecorator('ciq_item_per_sheet', {
                  initialValue: Number(formData.ciq_item_per_sheet),
                  rules: [{ required: true, message: '品项数必填' }],
                })(<InputNumber style={{ width: '100%' }} disabled={readOnly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('specialFeeAllowed')} {...formItemLayout}>
                {getFieldDecorator('special_fee_allowed', {
                  valuePropName: 'checked',
                  initialValue: formData.special_fee_allowed || false,
                })(<Checkbox disabled={readOnly} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
