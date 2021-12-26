import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message } from 'antd';
import { closeEfModal } from 'common/reducers/cmsDelegation';
import { fillEntryId } from 'common/reducers/cmsManifest';
import { validateEntryId } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsDelegation.visibleEfModal,
    entryHeadId: state.cmsDelegation.efModal.entryHeadId,
    decUnifiedNo: state.cmsDelegation.efModal.decUnifiedNo,
    submiting: state.cmsManifest.fillNoSubmiting,
  }),
  { closeEfModal, fillEntryId, validateEntryId }
)

@Form.create()
export default class FillCustomsNoModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    entryHeadId: PropTypes.number.isRequired,
    reload: PropTypes.func,
  }
  state = {
    entryNo: '',
    decUnifiedNo: '',
  }
  handleCancel = () => {
    this.props.closeEfModal();
    this.props.form.resetFields();
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        if (!values.entry_id && !values.dec_unified_no) {
          message.error('统一编号和海关编号必填一项');
          return;
        }
        this.props.fillEntryId({
          entryHeadId: this.props.entryHeadId,
          entryNo: values.entry_id,
          decUnifiedNo: values.dec_unified_no,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.handleCancel();
            if (this.props.reload) {
              this.props.reload();
            }
          }
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  checkDecUnifiedNo = (rule, value, callback) => {
    if (value === this.state.decUnifiedNo) {
      callback();
      return;
    }
    if (!value) {
      callback();
    } else if (String(value).trim().length >= 18) {
      if (String(value).trim().length > 18) {
        callback('统一编号须由I+17位数字组成');
      } else {
        this.props.validateEntryId(null, value).then((result) => {
          if (!result.error) {
            const returnValue = result.data.hwDecUnifiedNo;
            this.setState({ decUnifiedNo: returnValue });
            this.props.form.setFieldsValue({ dec_unified_no: returnValue });
            callback();
          } else if (result.error.message.key === 'decunifiedno_nonalphanum') {
            callback('统一编号须由I+17位数字组成');
          } else {
            callback();
          }
        });
      }
    } else {
      callback();
    }
  }
  checkEntryNo = (rule, value, callback) => {
    if (value === this.state.entryNo) {
      callback();
      return;
    }
    if (!value) {
      callback();
    } else if (String(value).trim().length >= 18) {
      if (String(value).trim().length > 18) {
        callback('海关编号须由18位数字/大写字母组成');
      } else {
        this.props.validateEntryId(value).then((result) => {
          if (!result.error) {
            const returnValue = result.data.hwEntryNo;
            this.setState({ entryNo: returnValue });
            this.props.form.setFieldsValue({ entry_id: returnValue });
            callback();
          } else if (result.error.message.key === 'entryid_exist') {
            callback('海关编号已存在');
          } else if (result.error.message.key === 'entryid_nonalphanum') {
            callback('海关编号须由18位数字/大写字母组成');
          } else {
            callback();
          }
        });
      }
    } else {
      callback();
    }
  }
  render() {
    const {
      visible, decUnifiedNo, form: { getFieldDecorator, getFieldValue }, submiting,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('entryNoFillModalTitle')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okButtonProps={{ disabled: submiting }}
        cancelButtonProps={{ disabled: submiting }}
      >
        <Form>
          <FormItem label="统一编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} hasFeedback={getFieldValue('dec_unified_no')} >
            {getFieldDecorator('dec_unified_no', {
              rules: [{ validator: this.checkDecUnifiedNo }],
              initialValue: decUnifiedNo,
            })(<Input placeholder="请输入18位统一编号" />)}
          </FormItem>
          <FormItem label="海关编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} hasFeedback={getFieldValue('entry_id')} >
            {getFieldDecorator('entry_id', {
              rules: [{ validator: this.checkEntryNo }],
            })(<Input placeholder="请输入18位海关编号" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
