import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { message, Alert, Modal, Form } from 'antd';
import { closeBatchTransitModal, moveTransit, splitTransit } from 'common/reducers/cwmTransition';
import { format } from 'client/common/i18n/helpers';
import TransitForm from '../pane/transitAttribForm';
import messages from '../../message.i18n';

const formatMsg = format(messages);

@injectIntl
@connect(
  state => ({
    loginName: state.account.username,
    batchTransitModal: state.cwmTransition.batchTransitModal,
    submitting: state.cwmTransition.submitting,
  }),
  { closeBatchTransitModal, moveTransit, splitTransit }
)
@Form.create()
export default class BatchTransitModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    batchTransitModal: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
      detail: PropTypes.shape({ owner_name: PropTypes.string }),
    }),
  }
  formValue = {
    target_location: null,
    movement_no: null,
  }
  msg = key => formatMsg(this.props.intl, key);
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.closeBatchTransitModal({ needReload: false });
    this.formValue = {
      target_location: null,
      movement_no: null,
    };
  }
  handleValueChange = (keyValue) => {
    this.formValue[keyValue.key] = keyValue.value;
  }
  handleSubmit = () => {
    const transit = this.props.form.getFieldsValue();
    const valueChanged = Object.keys(transit).length > 0;
    const { loginName, batchTransitModal } = this.props;
    let transitOp;
    if (this.formValue.target_location) {
      if (this.formValue.movement_no) {
        transitOp = this.props.moveTransit(
          batchTransitModal.traceIds, transit, this.formValue.target_location,
          this.formValue.movement_no, loginName
        );
      } else {
        message.error('库存移动单未选');
      }
    } else if (valueChanged) {
      transitOp = this.props.splitTransit(batchTransitModal.traceIds, transit, loginName);
    }
    if (transitOp) {
      transitOp.then((result) => {
        if (!result.error) {
          const virtualWhseArr = result.data;
          if (virtualWhseArr && virtualWhseArr.length > 0) {
            const virtualWhseStr = `${virtualWhseArr.slice(0, 3).join(',')}${virtualWhseArr.length >= 3 ? '...' : ''}`;
            message.error(`库别${virtualWhseStr}的未预配数量不足, 需要先取消预分配`);
          }
          this.handleCancel();
        } else if (result.error.message === 'invalid-movement') {
          message.error('移库单已删除或已完成');
        } else {
          message.error(result.error.message);
        }
      });
    }
  }
  render() {
    const { form, batchTransitModal, submitting } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="批量转移"
        width={960}
        onCancel={this.handleCancel}
        visible={batchTransitModal.visible}
        onOk={this.handleSubmit}
        okButtonProps={{ loading: submitting }}
        cancelButtonProps={{ loading: submitting }}
        okText="确认转移"
      >
        <Alert message={`已选择${batchTransitModal.traceIds.length}项库存数量`} type="info" />
        <Form>
          <TransitForm
            detail={batchTransitModal.detail}
            form={form}
            batched
            onChange={this.handleValueChange}
          />
        </Form>
      </Modal>
    );
  }
}
