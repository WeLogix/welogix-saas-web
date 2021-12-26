import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { changePassword } from 'common/reducers/account';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

@injectIntl
@connect(
  () => ({
  }),
  { changePassword }
)
@Form.create()
export default class ChangePassword extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    changePassword: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl);
  oldPwdRules = {
    validate: [{
      rules: [
        { required: true, whitespace: true, message: this.msg('pwdRequired') },
      ],
      trigger: ['onBlur', 'onChange'],
    }],
  }

  pwdRules = {
    rules: [{
      required: true, whitespace: true, min: 6, message: this.msg('newPwdRule'),
    }, {
      validator: (rule, value, callback) => {
        if (value) {
          if (value === this.props.form.getFieldValue('oldPwd')) {
            callback(this.msg('samePwd'));
          } else {
            this.props.form.validateFields(['confirmPwd']);
            callback();
          }
        } else {
          callback();
        }
      },
    }],
  }

  confirmPwdRules = {
    rules: [{
      required: true, whitespace: true, message: this.msg('pwdRequired'),
    }, {
      validator: (rule, value, callback) => {
        if (value && value !== this.props.form.getFieldValue('newPwd')) {
          callback(this.msg('pwdUnmatch'));
        } else {
          callback();
        }
      },
    }],
  }

  handlePasswordChange = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.changePassword(values.oldPwd, values.newPwd).then((result) => {
          if (result.error) {
            message.error(result.error.message);
          } else {
            this.context.router.goBack();
          }
        });
      } else {
        this.forceUpdate();
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }

  render() {
    const { form: { getFieldDecorator, getFieldError } } = this.props;
    return (
      <Form
        layout="horizontal"
        onSubmit={this.handlePasswordChange}
      >
        <FormItem
          {...formItemLayout}
          label={this.msg('oldPwd')}
          help={this.oldPwdRules && getFieldError('oldPwd')}
          hasFeedback
          required
        >
          {getFieldDecorator('oldPwd', this.oldPwdRules)(<Input type="password" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={this.msg('newPwd')}
          help={this.oldPwdRules && getFieldError('newPwd')}
          hasFeedback
          required
        >
          {getFieldDecorator('newPwd', this.pwdRules)(<Input type="password" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={this.msg('confirmPwd')}
          help={this.oldPwdRules && getFieldError('confirmPwd')}
          hasFeedback
          required
        >
          {getFieldDecorator('confirmPwd', this.confirmPwdRules)(<Input type="password" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button htmlType="submit" size="large" type="primary">{this.msg('ok')}</Button>
        </FormItem>
      </Form>
    );
  }
}
