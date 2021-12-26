import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, DatePicker, Select } from 'antd';
import { BSS_BILL_TYPE } from 'common/constants';
import FormPane from 'client/components/FormPane';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  billHead: state.bssBill.billHead,
}), {
})
@Form.create()
export default class BillHeadPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      form: { getFieldDecorator },
      billHead, tenantId,
    } = this.props;
    const accountTitle = tenantId === billHead.seller_tenant_id ? '应收账款' : '应付账款';
    const otherTitle = tenantId === billHead.seller_tenant_id ? '其他应收' : '其他应付';
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('账单名称')} {...formItemLayout}>
                {getFieldDecorator('bill_title', {
                            initialValue: billHead.bill_title,
                          })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('客户')} {...formItemLayout}>
                {getFieldDecorator('buyer_name', {
                            initialValue: billHead.buyer_name,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('服务商')} {...formItemLayout}>
                {getFieldDecorator('seller_name', {
                            initialValue: billHead.seller_name,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('账单类型')} {...formItemLayout}>
                {getFieldDecorator('bill_type', {
                            initialValue: billHead.bill_type,
                          })(<Select disabled>
                            {Object.values(BSS_BILL_TYPE).map(type => (
                              <Option key={type.key} value={type.key}>{type.key} | {type.text}
                              </Option>))
                            }
                          </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('账单起始日期')} {...formItemLayout}>
                {getFieldDecorator('order_begin_date', {
                            initialValue: billHead.order_begin_date && moment(billHead.order_begin_date, 'YYYY/MM/DD'),
                          })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('账单截止日期')} {...formItemLayout}>
                {getFieldDecorator('order_end_date', {
                            initialValue: billHead.order_end_date && moment(billHead.order_end_date, 'YYYY/MM/DD'),
                          })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('流程')} {...formItemLayout}>
                {getFieldDecorator('flow_name', {
                              initialValue: billHead.flow_name,
                            })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('订单总数')} {...formItemLayout}>
                {getFieldDecorator('order_count', {
                            initialValue: billHead.order_count,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={accountTitle} {...formItemLayout}>
                {getFieldDecorator('init_account_amount', {
                            initialValue: billHead.init_account_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={otherTitle} {...formItemLayout}>
                {getFieldDecorator('init_other_amount', {
                            initialValue: billHead.init_other_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('调整金额')} {...formItemLayout}>
                {getFieldDecorator('created_date', {
                            initialValue: (billHead.account_amount + billHead.other_amount) -
                            (billHead.init_account_amount + billHead.init_other_amount),
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('账单金额')} {...formItemLayout}>
                {getFieldDecorator('completed_date', {
                            initialValue: billHead.account_amount + billHead.other_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('未开票金额')} {...formItemLayout}>
                {getFieldDecorator('noninvoice_amount', {
                            initialValue: billHead.noninvoice_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('开票确认金额')} {...formItemLayout}>
                {getFieldDecorator('invoicing_amount', {
                            initialValue: billHead.invoicing_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('已开票金额')} {...formItemLayout}>
                {getFieldDecorator('invoiced_amount', {
                            initialValue: billHead.invoiced_amount,
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('未核销金额')} {...formItemLayout}>
                {getFieldDecorator('nonwrittenoff_amount', {
                            // initialValue:
                            // (billHead.invoiced_amount - billHead.account_writtenoff_amount)
                            // + (billHead.other_amount - billHead.other_writtenoff_amount),
                          })(<Input addonBefore="RMB" disabled />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
