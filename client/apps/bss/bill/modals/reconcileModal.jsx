import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Radio, Input } from 'antd';
import { BSS_BILL_TYPE } from 'common/constants';
import { toggleReconcileModal, sendBill } from 'common/reducers/bssBill';
import { formatMsg } from '../message.i18n';


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssBill.reconcileModal.visible,
    billType: state.bssBill.reconcileModal.billType,
    billNo: state.bssBill.reconcileModal.billNo,
    reconcileType: state.bssBill.reconcileModal.reconcileType,
  }),
  {
    toggleReconcileModal, sendBill,
  }
)
@Form.create()
export default class ReconcileModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleReconcileModal(false, {});
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.sendBill({
          bill_no: this.props.billNo,
          reconcile_type: values.reconcile_type,
        }).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, billType, reconcileType,
    } = this.props;
    const formReconcile = this.props.form.getFieldValue('reconcile_type');
    return (
      <Modal
        maskClosable={false}
        title={this.msg('reconcileType')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('billType')} {...formItemLayout}>
            {getFieldDecorator('reconcile_type', {
              rules: [{ required: true, message: this.msg('pleaseSelectReconcileType') }],
              initialValue: reconcileType,
            })(<RadioGroup onChange={this.handleTypeSelect}>
              {billType !== BSS_BILL_TYPE.OFB.key && <RadioButton value="online" key="online">{this.msg('reconcileOnline')}</RadioButton>}
              <RadioButton value="offline" key="offline">{this.msg('reconcileOffline')}</RadioButton>
            </RadioGroup>)}
          </FormItem>
          {!reconcileType && formReconcile === 'offline' &&
          <FormItem label={this.msg('email')} {...formItemLayout}>
            {getFieldDecorator('email', {
            })(<Input />)}
          </FormItem>}
        </Form>
      </Modal>
    );
  }
}
