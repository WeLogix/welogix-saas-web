import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Select, Input, Modal, message } from 'antd';
import { toggleAccountModal, createAccountsetAccount, updateAccountsetAccount } from 'common/reducers/bssSetting';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssSetting.accountModal.visible,
    account: state.bssSetting.accountModal.account,
    currencies: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    allAccountSubjects: state.bssSetting.allAccountSubjects,
    currentAccountSet: state.bssSetting.currentAccountSet,
  }),
  {
    toggleAccountModal,
    createAccountsetAccount,
    updateAccountsetAccount,
  },
)
@Form.create()
export default class AccountModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    accountType: PropTypes.oneOf(['cash', 'bank']),
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleAccountModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        if (this.props.account.id) {
          this.props.updateAccountsetAccount(
            values,
            this.props.account.id
          ).then((result) => {
            if (!result.error) {
              this.handleCancel();
              message.success(this.msg('savedSucceed'));
            }
          });
        } else {
          this.props.createAccountsetAccount({
            ...values,
            accounting_set_id: this.props.currentAccountSet.id,
            account_type: this.props.accountType === 'cash' ? 1 : 2,
          }).then((result) => {
            if (!result.error) {
              this.handleCancel();
              message.success(this.msg('savedSucceed'));
            }
          });
        }
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, currencies, allAccountSubjects, account, accountType,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={accountType === 'cash' ? this.msg('cashAccount') : this.msg('bankAccount')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        width={550}
      >
        <Form ayout="horizontal" className="form-layout-compact">
          <FormItem label={this.msg('code')} {...formItemLayout}>
            {getFieldDecorator('code', {
               initialValue: account.code,
            })(<Input />)}
          </FormItem>
          <FormItem label={accountType === 'bank' ? this.msg('bankName') : this.msg('accountName')} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: account.name,
              rules: [{ required: true, message: this.msg('pleaseInputAccountName') }],
            })(<Input />)}
          </FormItem>
          {accountType === 'bank' && <FormItem label={this.msg('bankAccountNo')} {...formItemLayout}>
            {getFieldDecorator('bank_account', {
               initialValue: account.bank_account,
               rules: [{ required: true, message: this.msg('pleaseInputBankAccountNo') }],
            })(<Input />)}
          </FormItem>}
          <FormItem label={this.msg('currency')} {...formItemLayout}>
            {getFieldDecorator('currency', {
               initialValue: account.currency,
            })(<Select>
              {currencies.map(curr => (
                <Option key={curr.value} value={curr.value}>{curr.text}</Option>
              ))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('subjects')} {...formItemLayout}>
            {getFieldDecorator('subject_no', {
              initialValue: account.subject_no,
            })(<Select>
              {allAccountSubjects.map(subject => (
                <Option
                  key={subject.subject_no}
                  value={subject.subject_no}
                >
                  {subject.subject_name}
                </Option>
              ))}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
