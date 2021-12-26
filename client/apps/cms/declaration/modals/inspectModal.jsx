import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Switch, Row, Col, DatePicker, Form, Input, Select } from 'antd';
import FullscreenModal from 'client/components/FullscreenModal';
import { toggleInspectModal, setInspect } from 'common/reducers/cmsCustomsDeclare';
import { updateEventFeeClear } from 'common/reducers/cmsExpense';
import { INSPECT_STATUS, CMS_EVENTS } from 'common/constants';
import RecvablePayableExpenses from '../../billing/recvablePayableExpenses';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.cmsCustomsDeclare.inspectModal.visible,
    customs: state.cmsCustomsDeclare.inspectModal.customs,
    events: state.cmsExpense.eventFeeClear.events,
  }),
  { toggleInspectModal, setInspect, updateEventFeeClear }
)
@Form.create()
export default class InspectModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static childContextTypes = {
    feePaneCond: PropTypes.shape({
      queryEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      enabledFeeEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      disallowSrvEdit: PropTypes.bool.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }
  state = {
    customsInspect: false,
    qualityInspect: false,
  }
  getChildContext() {
    this.feePaneCond.enabledFeeEvents = [];
    const { customsInspect, qualityInspect } = this.state;
    if (qualityInspect) {
      this.feePaneCond.enabledFeeEvents.push(CMS_EVENTS[2].key);
    }
    if (customsInspect) {
      this.feePaneCond.enabledFeeEvents.push(CMS_EVENTS[3].key);
    }
    return {
      feePaneCond: this.feePaneCond,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      let customsInspect = false;
      let qualityInspect = false;
      if (nextProps.customs.customsInspect !== INSPECT_STATUS.uninspect.value) {
        customsInspect = true;
      }
      if (nextProps.customs.ciqQualityInspect !== INSPECT_STATUS.uninspect.value) {
        qualityInspect = true;
      }
      this.setState({
        customsInspect,
        qualityInspect,
      });
    }
  }
  subscription = null
  feePaneCond= {
    queryEvents: [CMS_EVENTS[2].key, CMS_EVENTS[3].key],
    disallowSrvEdit: true,
    enabledFeeEvents: [],
    subscribe: (f) => { this.subscription = f; },
  }
  handleCancel = () => {
    this.props.toggleInspectModal(false);
    this.setState({
      customsInspect: false,
      qualityInspect: false,
    });
    this.props.updateEventFeeClear(false, []);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const inspectInfo = {
          customsInsDate: values.customs_inspect_date,
          customsInsEndDate: values.customs_inspect_end_date,
          customsInspect: this.state.customsInspect,
          qualityInspect: this.state.qualityInspect,
          customsInspectResult: values.customs_inspected_result,
          customsCaughtReason: values.customs_caught_reason,
          customsCaughtResult: values.customs_caught_result,
        };
        if (!this.props.customs.entryId) {
          inspectInfo.entryId = values.entry_id;
        }
        this.props.setInspect(this.props.customs.id, inspectInfo).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
          }
        });
      }
    });
  }
  handleSwitchCustomsIns = (checked) => {
    this.setState({
      customsInspect: checked,
    });
    const { qualityInspect } = this.state;
    const events = [];
    let status = false;
    if (!checked) {
      events.push(CMS_EVENTS[3].key);
      status = true;
    }
    if (!qualityInspect) {
      events.push(CMS_EVENTS[2].key);
      status = true;
    }
    this.props.updateEventFeeClear(status, events);
    if (this.subscription) {
      this.subscription();
    }
  }
  handleSwitchQualityIns = (checked) => {
    this.setState({
      qualityInspect: checked,
    });
    const { customsInspect } = this.state;
    const events = [];
    let status = false;
    if (!checked) {
      events.push(CMS_EVENTS[2].key);
      status = true;
    }
    if (!customsInspect) {
      events.push(CMS_EVENTS[3].key);
      status = true;
    }
    this.props.updateEventFeeClear(status, events);
    if (this.subscription) {
      this.subscription();
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible, form: { getFieldDecorator, getFieldValue }, customs } = this.props;
    const { customsInspect, qualityInspect } = this.state;
    return (
      <FullscreenModal
        title={this.msg('查验')}
        onCancel={this.handleCancel}
        onSave={this.handleOk}
        visible={visible}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Form>
                <FormItem label="海关编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('entry_id', {
                  initialValue: customs.entryId,
                })(<Input disabled={!!customs.customsInspectEndDate || !!customs.entryId} />)}
                </FormItem>
                <FormItem label="海关查验" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  <Col span={12}>
                    <Switch
                      checkedChildren="是"
                      unCheckedChildren="否"
                      checked={customsInspect}
                      onChange={this.handleSwitchCustomsIns}
                      disabled={!!customs.customsInspectEndDate}
                    />
                  </Col>
                </FormItem>
                <FormItem label="质检查验" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  <Col span={6}>
                    <Switch
                      checkedChildren="是"
                      unCheckedChildren="否"
                      checked={qualityInspect}
                      onChange={this.handleSwitchQualityIns}
                      disabled={!!customs.customsInspectEndDate}
                    />
                  </Col>
                </FormItem>
                <FormItem label="下达日期" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('customs_inspect_date', {
                  initialValue: customs.customsInsDate && moment(customs.customsInsDate),
                })(<DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  disabled={!!customs.customsInspectEndDate}
                />)}
                </FormItem>
                <FormItem label="查验结果" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('customs_inspected_result', {
                  initialValue: customs.customsInspectResult,
                })(<Select
                  disabled={!!customs.customsInspectEndDate}
                >
                  <Option key="released">放行</Option>
                  <Option key="caught">待处理</Option>
                </Select>)}
                </FormItem>
                {getFieldValue('customs_inspected_result') === 'caught' &&
                <FormItem label="待处理原因" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('customs_caught_reason', {
                  initialValue: customs.customsCaughtReason,
                })(<Input
                  disabled={!!customs.customsInspectEndDate}
                />)}
                </FormItem>}
                {getFieldValue('customs_inspected_result') === 'caught' &&
                <FormItem label="处理结果" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('customs_caught_result', {
                  initialValue: customs.customsCaughtResult,
                })(<Input
                  disabled={!!customs.customsInspectEndDate}
                />)}
                </FormItem>}
                <FormItem label="结束日期" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('customs_inspect_end_date', {
                  initialValue: customs.customsInspectEndDate
                  && moment(customs.customsInspectEndDate),
                })(<DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  disabled={!!customs.customsInspectEndDate}
                />)}
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={16}>
            <Card bodyStyle={{ padding: 0 }}>
              <RecvablePayableExpenses delgNo={customs.delgNo} />
            </Card>
          </Col>
        </Row>
      </FullscreenModal>
    );
  }
}
