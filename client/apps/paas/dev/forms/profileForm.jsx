import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import AvatarUploader from 'client/components/AvatarUploader';
import { updateBasicInfo, deleteDevApp, toggleStatus, getApp } from 'common/reducers/hubDevApp';
import AppOpenApiModal from '../modal/openapiConfigModal';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;

@injectIntl
@Form.create()
@connect(
  state => ({
    users: state.account.userMembers,
  }),
  {
    updateBasicInfo, deleteDevApp, toggleStatus, getApp,
  }
)
export default class ProfileForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    app: PropTypes.shape({
      app_id: PropTypes.string.isRequired,
    }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleDeleteApp = (id) => {
    const me = this;
    confirm({
      title: '确认删除此应用吗?',
      content: '删除应用后将不可恢复',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        me.props.deleteDevApp(id).then((result) => {
          if (!result.error) {
            me.context.router.push('/paas/dev');
          }
        });
      },
      onCancel() {
      },
    });
  }
  handleSave = () => {
    const data = this.props.form.getFieldsValue();
    this.props.updateBasicInfo(
      this.props.app.app_id, data.app_logo, data.app_desc,
      data.app_name, data.grantedOpetrators, data.app_type
    );
  }
  afterUpload = (url) => {
    this.props.form.setFieldsValue({
      app_logo: url,
    });
  }
  toggleStatus = (status) => {
    const { app } = this.props;
    this.props.toggleStatus(status, app.id, app.app_id).then((result) => {
      if (!result.error) {
        this.props.getApp(app.app_id);
      }
    });
  }
  render() {
    const { form: { getFieldDecorator }, app, users } = this.props;
    return (
      <Form>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label={this.msg('appLogo')}>
              {getFieldDecorator('app_logo', {
                initialValue: app.app_logo,
              })(<AvatarUploader url={app.app_logo} afterUpload={this.afterUpload} />)}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label={this.msg('appName')}>
              {getFieldDecorator('app_name', {
                initialValue: app.app_name,
                rules: [{ required: true, message: this.msg('parameterRequired') }],
              })(<Input />)}
            </FormItem>
            <FormItem label={this.msg('grantedOpetrators')}>
              {getFieldDecorator('grantedOpetrators', {
                initialValue: app.loginIds,
              })(<Select
                mode="multiple"
                showSearch
                optionFilterProp="children"
              >
                {users.map(op =>
                  (<Option value={op.login_id} key={op.login_id}>{op.name}</Option>))}
              </Select>)}
            </FormItem>
            <FormItem label={this.msg('appType')}>
              {getFieldDecorator('app_type', {
                initialValue: app.app_type || 'BASE_APP',
              })(<Select
                showSearch
                optionFilterProp="children"
              >
                <Option value="BASE_APP" key="BASE_APP">默认类型</Option>
                <Option value="SW_WEBEXT" key="SW_WEBEXT">单一窗口抓取数据</Option>
              </Select>)}
            </FormItem>
            <FormItem label={this.msg('appDesc')}>
              {getFieldDecorator('app_desc', {
                initialValue: app.app_desc,
              })(<Input.TextArea placeholder="简要描述一下应用" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Button type="primary" icon="save" style={{ marginRight: 8 }} onClick={this.handleSave}>{this.msg('save')}</Button>
          {app.status === 0 ? <Button onClick={() => this.toggleStatus(true)} icon="play-circle">{this.msg('online')}</Button> :
          <Button onClick={() => this.toggleStatus(false)} icon="pause-circle-o">{this.msg('offline')}</Button>}
        </Row>
        <AppOpenApiModal />
      </Form>
    );
  }
}
