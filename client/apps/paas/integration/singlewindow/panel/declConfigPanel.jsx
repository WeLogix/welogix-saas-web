import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col, Row } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
export default class DeclConfigPanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { form: { getFieldDecorator }, app } = this.props;
    return (
      <Form>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label={this.msg('inBox')}>
              {getFieldDecorator('inbox', {
            initialValue: app.inbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('outBox')}>
              {getFieldDecorator('outbox', {
            initialValue: app.outbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('sentBox')}>
              {getFieldDecorator('sentbox', {
            initialValue: app.sentbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('failBox')}>
              {getFieldDecorator('failbox', {
            initialValue: app.failbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('edocInBox')}>
              {getFieldDecorator('edoc_inbox', {
            initialValue: app.edoc_inbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('edocOutBox')}>
              {getFieldDecorator('edoc_outbox', {
            initialValue: app.edoc_outbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('edocSentBox')}>
              {getFieldDecorator('edoc_sentbox', {
            initialValue: app.edoc_sentbox,
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('edocFailBox')}>
              {getFieldDecorator('edoc_failbox', {
            initialValue: app.edoc_failbox,
          })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
