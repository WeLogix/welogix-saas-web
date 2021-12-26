import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Select, Input, Modal, message, Radio } from 'antd';
import { toggleSubjectModal, createAccountSubject, updateAccountSubject } from 'common/reducers/bssSetting';
import { BSS_ACCOUNT_SUBJECT_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssSetting.subjectModal.visible,
    subject: state.bssSetting.subjectModal.subject,
    currentAccountSet: state.bssSetting.currentAccountSet,
  }),
  {
    toggleSubjectModal, createAccountSubject, updateAccountSubject,
  },
)
@Form.create()
export default class AccountModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleSubjectModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { subject, currentAccountSet } = this.props;
        if (!subject.id) {
          this.props.createAccountSubject({
            subject_no: `${subject.parentSubjectNo}${values.subject_no}`,
            subject_name: values.subject_name,
            subject_type: subject.subjectType,
            status: values.status,
            subject_balance: subject.subjectBalance,
            parent_subject_no: subject.parentSubjectNo,
            accounting_set_id: currentAccountSet.id,
            mnemonic_code: values.mnemonic_code,
          }).then((result) => {
            if (!result.error) {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
            } else {
              message.error(result.error.message);
            }
          });
        } else {
          this.props.updateAccountSubject({
            subject_no: `${subject.parentSubjectNo || ''}${values.subject_no}`,
            subject_name: values.subject_name,
            status: values.status,
            mnemonic_code: values.mnemonic_code,
            parent_subject_no: subject.parentSubjectNo,
          }, subject.id).then((result) => {
            if (!result.error) {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
            }
          });
        }
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, subject,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={subject.id ? this.msg('editSubject') : this.msg('newSubject')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        width={550}
      >
        <Form ayout="horizontal" className="form-layout-compact">
          <FormItem label={this.msg('subjectNo')} {...formItemLayout}>
            {getFieldDecorator('subject_no', {
              initialValue: subject.parentSubjectNo ?
                subject.subjectNo.slice(subject.parentSubjectNo.length) : subject.subjectNo,
              rules: [{ required: true, message: this.msg('pleaseInputSubjectNo') }],
          })(<Input disabled={!subject.parentSubjectNo} addonBefore={subject.parentSubjectNo} />)}
          </FormItem>
          <FormItem label={this.msg('subjectName')} {...formItemLayout}>
            {getFieldDecorator('subject_name', {
               initialValue: subject.subjectName,
               rules: [{ required: true, message: this.msg('pleaseInputSubjectName') }],
            })(<Input disabled={!subject.parentSubjectNo} />)}
          </FormItem>
          <FormItem label={this.msg('mnemonicCode')} {...formItemLayout}>
            {getFieldDecorator('mnemonic_code', {
               initialValue: subject.mnemonicCode,
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('subjectType')} {...formItemLayout}>
            <Select disabled value={subject.subjectType}>
              {BSS_ACCOUNT_SUBJECT_TYPE.map(type => (
                <Option key={type.value} value={type.value}>{type.text}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label={this.msg('subjectBalance')} {...formItemLayout}>
            <RadioGroup disabled value={subject.subjectBalance}>
              <Radio value={1}>{this.msg('debit')}</Radio>
              <Radio value={2}>{this.msg('credit')}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label={this.msg('subjectStatus')} {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: subject.subjectStatus,
            })(<RadioGroup>
              <Radio value={0}>禁用</Radio>
              <Radio value={1}>正常</Radio>
            </RadioGroup>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
