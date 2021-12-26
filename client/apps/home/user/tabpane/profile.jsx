import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import AvatarUploader from 'client/components/AvatarUploader';
import { updateProfile } from 'common/reducers/account';
import { validatePhone } from 'common/validater';
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

function FormInput(props) {
  const {
    label, hasFeedback, required, placeholder,
    addonAfter, getFieldDecorator, field, rules, fieldProps,
  } = props;
  return (
    <FormItem
      {...formItemLayout}
      label={label}
      hasFeedback={hasFeedback}
      required={required}
    >
      {
        getFieldDecorator(field, { rules, ...fieldProps })(<Input type="text" addonAfter={addonAfter} placeholder={placeholder} />)
      }
    </FormItem>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  hasFeedback: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  addonAfter: PropTypes.string,
  field: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
  getFieldDecorator: PropTypes.func.isRequired,
  fieldProps: PropTypes.shape({ initialValue: PropTypes.string }),
};

@injectIntl
@connect(
  state => ({
    profile: state.account.profile,
    role: state.account.role_name,
    tenantId: state.account.tenantId,
    parentTenantId: state.account.parentTenantId,
    code: state.account.code,
  }),
  { updateProfile }
)
@Form.create()
export default class MyProfile extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
    profile: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string,
    }).isRequired,
    role: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    tenantId: PropTypes.number.isRequired,
    parentTenantId: PropTypes.number.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    avatar: this.props.profile.avatar,
  }
  msg = formatMsg(this.props.intl);
  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const profile = {
          ...this.props.profile,
          ...this.props.form.getFieldsValue(),
          avatar: this.state.avatar,
          role: this.props.role,
        };
        this.props.updateProfile(profile, this.props.code, this.props.tenantId).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('个人信息更新成功');
            // this.context.router.goBack();
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
  handleAvatarChange = (url) => {
    this.setState({
      avatar: url,
    });
  }
  render() {
    const { intl, profile, form: { getFieldDecorator } } = this.props;
    return (
      <Form
        layout="horizontal"
        onSubmit={this.handleSubmit}
      >
        <FormItem {...tailFormItemLayout} style={{ marginBottom: 32 }}>
          <AvatarUploader url={this.state.avatar} afterUpload={this.handleAvatarChange} />
        </FormItem>
        <FormInput
          label={this.msg('fullName')}
          field="name"
          rules={
            [{ required: true, min: 2, message: this.msg('fullNameMessage') }]
          }
          fieldProps={{ initialValue: profile.name }}
          hasFeedback
          getFieldDecorator={getFieldDecorator}
        />
        <FormInput
          label={this.msg('phone')}
          field="phone"
          hasFeedback
          rules={[{
            validator: (rule, value, callback) => validatePhone(value, callback, intl),
          }]}
          fieldProps={{ initialValue: profile.phone }}
          getFieldDecorator={getFieldDecorator}
        />
        <FormInput
          label={this.msg('email')}
          field="email"
          getFieldDecorator={getFieldDecorator}
          rules={[{ type: 'email', message: this.msg('emailError') }]}
          fieldProps={{ initialValue: profile.email }}
        />
        <FormItem {...tailFormItemLayout}>
          <Button size="large" htmlType="submit" type="primary">{this.msg('save')}</Button>
        </FormItem>
      </Form>
    );
  }
}
