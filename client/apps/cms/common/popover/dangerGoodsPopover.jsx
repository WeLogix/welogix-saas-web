import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, Button, Form, Input, Row, Select, Icon } from 'antd';
import { CIQ_DANGER_PACK_TYPE } from 'common/constants';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
export default class DangerGoodsPopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    goodsDanger: PropTypes.shape({ danger_flag: PropTypes.oneOf(['0', '1']) }).isRequired,
    disabled: PropTypes.bool,
  }
  state = {
    visible: false,
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.controlVisible && nextProps.controlVisible !== this.props.controlVisible) {
      this.setState({ visible: false });
    }
  }
  msg = formatMsg(this.props.intl)
  handleVisibleToggle= () => {
    this.setState({
      visible: !this.state.visible,
    });
  }
  render() {
    const { form: { getFieldDecorator }, goodsDanger, disabled } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const content = (
      <Form className="form-layout-compact">
        <FormItem {...formItemLayout} colon={false} label={this.msg('nonDangerChemical')}>
          {getFieldDecorator('danger_flag', {
            initialValue: goodsDanger.danger_flag,
          })(<Select disabled={disabled} style={{ width: '100%' }} allowClear>
            <Option key="1" value="1">非危险化学品</Option>
            <Option key="0" value="0">危险化学品</Option>
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('dangUnCode')}>
          {getFieldDecorator('danger_uncode', {
            initialValue: goodsDanger.danger_uncode,
          })(<Input disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('dangName')}>
          {getFieldDecorator('danger_name', {
            initialValue: goodsDanger.danger_name,
          })(<Input disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('dangPackType')}>
          {getFieldDecorator('danger_pack_type', {
            initialValue: goodsDanger.danger_pack_type,
          })(<Select disabled={disabled} style={{ width: '100%' }} allowClear>
            {CIQ_DANGER_PACK_TYPE.map(type =>
              <Option key={type.value} value={type.value}>{type.text}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('dangPackSpec')}>
          {getFieldDecorator('danger_pack_spec', {
            initialValue: goodsDanger.danger_pack_spec,
          })(<Input disabled={disabled} />)}
        </FormItem>
        <Row style={{ textAlign: 'right' }}>
          <Button onClick={this.handleVisibleToggle} style={{ marginRight: 8 }}>{this.msg('cancel')}</Button>
          {!disabled && <Button type="primary" onClick={this.handleVisibleToggle}>{this.msg('ok')}</Button>}
        </Row>
      </Form>
    );
    return (
      <Popover
        title={this.msg('dangerInfo')}
        content={content}
        trigger="click"
        visible={this.state.visible}
        placement="topRight"
        overlayStyle={{ width: 360 }}
      >
        <Button block onClick={this.handleVisibleToggle}>{this.msg('dangerInfo')}<Icon type="ellipsis" /></Button>
      </Popover>
    );
  }
}
