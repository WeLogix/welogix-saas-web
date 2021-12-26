import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Col, Row } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
export default class MsgPathConfigPanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    boxFields: PropTypes.shape({
      inbox: PropTypes.string.isRequired,
      outbox: PropTypes.string.isRequired,
      sentbox: PropTypes.string.isRequired,
      failbox: PropTypes.string.isRequired,
    }).isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { form: { getFieldDecorator }, app, boxFields } = this.props;
    return (
      <Form>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label={this.msg('inBox')}>
              {getFieldDecorator(boxFields.inbox, {
            initialValue: app[boxFields.inbox],
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('outBox')}>
              {getFieldDecorator(boxFields.outbox, {
            initialValue: app[boxFields.outbox],
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('sentBox')}>
              {getFieldDecorator(boxFields.sentbox, {
            initialValue: app[boxFields.sentbox],
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('failBox')}>
              {getFieldDecorator(boxFields.failbox, {
            initialValue: app[boxFields.failbox],
          })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
