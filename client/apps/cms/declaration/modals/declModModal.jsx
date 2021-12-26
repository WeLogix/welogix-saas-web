import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Select, DatePicker, Form, Modal, Input, message } from 'antd';
import { CMS_DECL_MOD_TYPE } from 'common/constants';
import { toggleDeclModModal, modDecl } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.cmsCustomsDeclare.declModModal.visible,
    declEntry: state.cmsCustomsDeclare.declModModal.customs,
  }),
  { toggleDeclModModal, modDecl }
)
@Form.create()
export default class DeclModModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  handleCancel = () => {
    this.props.toggleDeclModModal(false);
  }
  handleOk = () => {
    const { declEntry } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.modDecl(
          this.props.declEntry.preEntrySeqNo,
          {
            reviseType: values.revise_type,
            reviseReason: values.revise_reason,
            reviseDate: values.revise_datetime,
          }
        ).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
            message.success('操作成功');
            if (values.revise_type === '1' || values.revise_type === '3') {
              const link = `/clearance/declaration/${declEntry.preEntrySeqNo}`;
              this.context.router.push(link);
            }
          } else {
            message.error('操作失败');
          }
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible, declEntry, form: { getFieldDecorator, getFieldValue } } = this.props;
    const reviseType = getFieldValue('revise_type');
    let reviseReasonLabel = '';
    if (reviseType === '2' || reviseType === '4') {
      reviseReasonLabel = '删单原因';
    } else {
      reviseReasonLabel = '改单原因';
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('declMod')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="海关编号" {...formItemLayout}>
            {getFieldDecorator('entry_id', {
              initialValue: declEntry.entryId,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="删改单业务类型" {...formItemLayout}>
            {getFieldDecorator('revise_type', {
              rules: [{ required: true, message: '业务类型必选' }],
            })(<Select
              allowClear
              style={{ width: '100%' }}
            >
              {CMS_DECL_MOD_TYPE.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={reviseReasonLabel} {...formItemLayout}>
            {getFieldDecorator('revise_reason', {
              rules: [{ required: true, message: `${reviseReasonLabel}必填` }],
            })(<Input />)}
          </FormItem>
          <FormItem label="操作日期" {...formItemLayout}>
            {getFieldDecorator('revise_datetime', {
            })(<DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
