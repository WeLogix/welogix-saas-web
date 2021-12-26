import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Col, DatePicker, Form, Input, Row, Switch, message } from 'antd';
import FullscreenModal from 'client/components/FullscreenModal';
import { toggleExchangeDocModal } from 'common/reducers/cmsDelegation';
import { exchangeBlNo } from 'common/reducers/cmsDelegationDock';
import { CMS_EVENTS } from 'common/constants';
import RecvablePayableExpenses from '../../billing/recvablePayableExpenses';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsDelegation.exchangeDocModal.visible,
    exchangeInfo: state.cmsDelegation.exchangeDocModal.exchangeInfo,
  }),
  { toggleExchangeDocModal, exchangeBlNo }
)
@Form.create()
export default class ExchangeDocModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static childContextTypes = {
    feePaneCond: PropTypes.shape({
      queryEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      enabledFeeEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      disallowSrvEdit: PropTypes.bool.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }
  state = {
    exchangedDoc: false,
  }
  getChildContext() {
    this.feePaneCond.enabledFeeEvents = [CMS_EVENTS[0].key];
    return {
      feePaneCond: this.feePaneCond,
    };
  }
  subscription = null
  feePaneCond= {
    queryEvents: [CMS_EVENTS[0].key],
    disallowSrvEdit: true,
    enabledFeeEvents: [],
    subscribe: (f) => { this.subscription = f; },
  }
  handleCancel = () => {
    this.props.toggleExchangeDocModal(false, {});
    this.setState({ exchangedDoc: false });
  }
  handleOk = () => {
    const { delg_no: delgNo } = this.props.exchangeInfo;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.exchangeBlNo(
          delgNo,
          {
            delivery_order_no: values.delivery_order_no,
            bl_date: values.exchange_bl_date,
            exchanged_doc: values.exchanged_doc,
          }
        ).then((result) => {
          if (!result.error) {
            this.handleCancel();
            this.props.reload();
            if (this.state.exchangedDoc) {
              message.success('换单已完成');
            }
          }
        });
      }
    });
  }
  handleExchanged = (checked) => {
    this.setState({ exchangedDoc: checked });
    this.props.form.resetFields();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible } = this.props;
    const { exchangedDoc } = this.state;
    const { form: { getFieldDecorator }, exchangeInfo } = this.props;
    return (
      <FullscreenModal
        title={this.msg('换单')}
        onCancel={this.handleCancel}
        onSave={this.handleOk}
        visible={visible}
      >
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="海运单号(B/L)" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('swb_no', {
              initialValue: exchangeInfo.swb_no,
            })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('deliveryOrderNo')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('bl_wb_no', {
              rules: [{ required: exchangedDoc, message: '提货单号必填' }],
              initialValue: exchangeInfo.bl_wb_no,
            })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('exchangeDate')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('exchange_bl_date', {
              rules: [{ required: true, message: '换单日期必填' }],
              initialValue: exchangeInfo.exchange_bl_date && moment(exchangeInfo.exchange_bl_date),
            })(<DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              showTime
            />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="换单状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('exchanged_doc', {
                initialValue: exchangeInfo.exchanged_doc,
              })(<Switch
                checkedChildren="已完成"
                unCheckedChildren="未完成"
                onChange={this.handleExchanged}
              />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Card bodyStyle={{ padding: 0 }}>
          <RecvablePayableExpenses delgNo={exchangeInfo.delg_no} />
        </Card>
      </FullscreenModal>
    );
  }
}
