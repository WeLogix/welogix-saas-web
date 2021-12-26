import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Select, Input, Modal } from 'antd';
import { toggleAccountSetModal, createAccountSet } from 'common/reducers/bssSetting';
import { BSS_ACCOUNT_SET_VAT_TAX } from 'common/constants';
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
    visible: state.bssSetting.accountSetModal.visible,
  }),
  { toggleAccountSetModal, createAccountSet },
)
@Form.create()
export default class AccountSetModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleAccountSetModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.createAccountSet(values).then((result) => {
          if (!result.error) {
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newAccountSet')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        width={550}
      >
        <Form ayout="horizontal" className="form-layout-compact">
          <FormItem label={this.msg('companyName')} {...formItemLayout}>
            {getFieldDecorator('company_name', {
              rules: [{ required: true, message: this.msg('pleaseInputCompanyName') }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('companyUniqueCode')} {...formItemLayout}>
            {getFieldDecorator('company_unique_code', {
              rules: [{ required: true, len: 18, message: this.msg('pleaseInputCorrectCompanyUniqueCode') }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('vatTax')} {...formItemLayout}>
            {getFieldDecorator('vat_cat', {
              rules: [{ required: true, message: this.msg('pleaseSelectVatTax') }],
            })(<Select>
              {BSS_ACCOUNT_SET_VAT_TAX.map(item => (
                <Option key={item.value} value={item.value}>{item.text}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
