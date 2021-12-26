import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Col, Form, Input, Row } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { showOpenApiConfigModal } from 'common/reducers/hubDevApp';
import AppOpenApiModal from '../modal/openapiConfigModal';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@Form.create()
@connect(
  () => ({}),
  {
    showOpenApiConfigModal,
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
  handleConfigOpenapi = () => {
    this.props.showOpenApiConfigModal(true);
  }
  render() {
    const { form: { getFieldDecorator }, app } = this.props;
    return (
      <Form>
        <Row gutter={16}>
          <Col span={10}>
            <FormItem label={this.msg('appId')}>
              {getFieldDecorator('app_id', {
                initialValue: app.app_id,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label={this.msg('appSecret')}>
              <Input disabled value={app.app_secret} />
            </FormItem>
          </Col>
          <Button icon="setting" style={{ marginLeft: 8 }} onClick={this.handleConfigOpenapi}>{this.msg('openapiConfig')}</Button>
        </Row>
        <AppOpenApiModal />
      </Form>
    );
  }
}
