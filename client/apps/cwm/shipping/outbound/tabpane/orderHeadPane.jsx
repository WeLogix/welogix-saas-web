import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, DatePicker } from 'antd';
import { updateRealExpressNo } from 'common/reducers/cwmOutbound';
import FormPane from 'client/components/FormPane';
import EditableCell from 'client/components/EditableCell';
import { formatMsg } from '../../message.i18n';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const formItemSpan2Layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  colon: false,
};

@injectIntl
@connect(state => ({
  defaultWhse: state.cwmContext.defaultWhse,
  outboundHead: state.cwmOutbound.outboundFormHead,
}), {
  updateRealExpressNo,
})
@Form.create()
export default class ShppingOrderHeadPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
  }
  msg = formatMsg(this.props.intl);
  handleSaveExpressNo = (value) => {
    const { outboundHead } = this.props;
    const contentLog = `出库单${outboundHead.outbound_no} "快递单号"由[${outboundHead.real_express_no || ''}]改为[${value}]]`;
    this.props.updateRealExpressNo(
      value,
      outboundHead.so_no,
      contentLog,
      outboundHead.cust_order_no
    );
  }
  render() {
    const {
      form: { getFieldDecorator },
      outboundHead,
    } = this.props;
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('货主')} {...formItemLayout}>
                {getFieldDecorator('owner_name', {
                            initialValue: outboundHead.owner_name,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('订单追踪号')} {...formItemLayout}>
                {getFieldDecorator('cust_order_no', {
                            initialValue: outboundHead.cust_order_no,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('快递单号')} {...formItemLayout}>
                {getFieldDecorator('real_express_no', {
                            initialValue: outboundHead.real_express_no,
                          })(<EditableCell onSave={this.handleSaveExpressNo} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('生成快递单号日期')} {...formItemLayout}>
                {getFieldDecorator('blbook_decl_date', {
                            initialValue: outboundHead.blbook_decl_date && moment(outboundHead.blbook_decl_date, 'YYYY/MM/DD'),
                          })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('收货人')} {...formItemLayout}>
                {getFieldDecorator('receiver_name', {
                            initialValue: outboundHead.receiver_name,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('联系电话')} {...formItemLayout}>
                {getFieldDecorator('receiver_phone', {
                            initialValue: outboundHead.receiver_phone,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.msg('收货地址')} {...formItemSpan2Layout}>
                {getFieldDecorator('receiver_address', {
                            initialValue: outboundHead.receiver_address,
                          })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('创建日期')} {...formItemLayout}>
                {getFieldDecorator('created_date', {
                            initialValue: outboundHead.created_date && moment(outboundHead.created_date, 'YYYY/MM/DD'),
                          })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('出库时间')} {...formItemLayout}>
                {getFieldDecorator('completed_date', {
                            initialValue: outboundHead.completed_date && moment(outboundHead.completed_date, 'YYYY/MM/DD'),
                          })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
