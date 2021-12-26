import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message } from 'antd';
import { toggleCiqNoModal, saveCiqNo } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsCustomsDeclare.ciqNoModal.visible,
    preEntrySeqNo: state.cmsCustomsDeclare.ciqNoModal.data.preEntrySeqNo,
  }),
  { toggleCiqNoModal, saveCiqNo }
)

@Form.create()
export default class FillCiqNoModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    preEntrySeqNo: PropTypes.string.isRequired,
    reload: PropTypes.func,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleCiqNoModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.saveCiqNo(this.props.preEntrySeqNo, values.ciq_no).then((result) => {
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
  render() {
    const {
      visible, form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('ciqNoFillModalTitle')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="检验检疫编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} >
            {getFieldDecorator('ciq_no', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入检验检疫编号" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
