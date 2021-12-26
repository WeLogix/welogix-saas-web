import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Card, Collapse, Checkbox, Dropdown, Icon, Popconfirm, Menu, Timeline } from 'antd';
import { removeShipmtPoint } from 'common/reducers/shipment';
import { SHIPMENT_LOG_CATEGORY, SHIPMENT_TRACK_STATUS } from 'common/constants';
import EventComposer from './eventComposer';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const timeFormat = 'YYYY-MM-DD HH:mm';
const MENUKEYS = ['all', 'operation', 'tracking', 'exception'];

@injectIntl
@connect(
  state => ({
    logs: state.shipment.previewer.logs,
    downstream: state.shipment.previewer.downstream,
  }),
  { removeShipmtPoint }
)
export default class TrackingPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    logs: PropTypes.array.isRequired,
    sourceType: PropTypes.string.isRequired,
  }
  state = {
    selectedKeys: [...MENUKEYS],
  }
  msg = formatMsg(this.props.intl)
  handleSelect = (item) => {
    let { selectedKeys } = this.state;
    const index = selectedKeys.indexOf(item);
    if (index === -1) {
      if (item === 'all') {
        selectedKeys = [...MENUKEYS];
      } else {
        selectedKeys.push(item);
        if (selectedKeys.length === MENUKEYS.length - 1) {
          selectedKeys.push('all');
        }
      }
    } else if (item === 'all') {
      selectedKeys = [];
    } else {
      if (selectedKeys.length === MENUKEYS.length) {
        selectedKeys.splice(selectedKeys.indexOf('all'), 1);
      }
      selectedKeys.splice(selectedKeys.indexOf(item), 1);
    }
    this.setState({
      selectedKeys,
    });
  }
  handleRemovePoint = (pointId, logId) => {
    this.props.removeShipmtPoint(pointId, logId);
  }
  renderTimeLine = (log, index) => {
    const style = { backgroundColor: '#fff' };
    if (log.category === SHIPMENT_LOG_CATEGORY.message) {
      return (
        <Timeline.Item key={index} dot={<Icon type="message" style={style} />}>
          <p>{this.msg(log.type)} {log.content}</p>
          <p>{`${log.tenant_name} ${log.login_name}`}</p>
          <p>{log.created_date && moment(log.created_date).format(timeFormat)}</p>
        </Timeline.Item>
      );
    } else if (log.category === SHIPMENT_LOG_CATEGORY.operation) {
      return (
        <Timeline.Item key={index} dot={<Icon type="retweet" style={style} />}>
          <p>{this.msg(log.type)} {log.content}</p>
          <p>{`${log.tenant_name} ${log.login_name}`}</p>
          <p>{log.created_date && moment(log.created_date).format(timeFormat)}</p>
        </Timeline.Item>
      );
    } else if (log.category === SHIPMENT_LOG_CATEGORY.tracking) { // log.type is tms_tracking_points id
      return (
        <Timeline.Item key={index} dot={<Icon type="environment-o" style={style} />}>
          <p>{log.content}
            {this.props.downstream.status <= SHIPMENT_TRACK_STATUS.intransit && log.type &&
            <Popconfirm title="确定删除这条位置信息？" onConfirm={() => this.handleRemovePoint(Number(log.type), log.id)}>
              <Icon type="close" className="timeline-remove" />
            </Popconfirm>}
          </p>
          <p>{`${log.tenant_name} ${log.login_name}`}</p>
          <p>{log.created_date && moment(log.created_date).format(timeFormat)}</p>
        </Timeline.Item>
      );
    } else if (log.category === SHIPMENT_LOG_CATEGORY.exception) {
      return (
        <Timeline.Item key={index} color="red" dot={<Icon type="exclamation-circle-o" style={style} />}>
          <p>{this.msg(log.type)} {log.content}</p>
          <p>{`${log.tenant_name} ${log.login_name}`}</p>
          <p>{log.created_date && moment(log.created_date).format(timeFormat)}</p>
        </Timeline.Item>
      );
    }
    return (
      <Timeline.Item key={index} color="blue">
        <p>{this.msg(log.type)} {log.content}</p>
        <p>{`${log.tenant_name} ${log.login_name}`}</p>
        <p>{log.created_date && moment(log.created_date).format(timeFormat)}</p>
      </Timeline.Item>
    );
  }
  render() {
    const { logs, sourceType } = this.props;
    const { selectedKeys } = this.state;
    let filteredLogs = logs;
    filteredLogs = logs.filter(log => selectedKeys.indexOf(log.category) >= 0);
    const menu = (
      <Menu>
        <Menu.Item key="all">
          <Checkbox checked={selectedKeys.indexOf('all') >= 0} onChange={() => this.handleSelect('all')}>选择全部</Checkbox>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="operation">
          <Checkbox checked={selectedKeys.indexOf('operation') >= 0} onChange={() => this.handleSelect('operation')}>操作记录</Checkbox>
        </Menu.Item>
        <Menu.Item key="tracking">
          <Checkbox checked={selectedKeys.indexOf('tracking') >= 0} onChange={() => this.handleSelect('tracking')}>追踪事件</Checkbox>
        </Menu.Item>
        <Menu.Item key="exception">
          <Checkbox checked={selectedKeys.indexOf('exception') >= 0} onChange={() => this.handleSelect('exception')}>异常事件</Checkbox>
        </Menu.Item>
      </Menu>
    );
    const timelineHeader = (
      <div>
        <span>追踪记录</span>
        <div className="toolbar-right">
          <Dropdown overlay={menu} onClick={e => e.stopPropagation()}>
            <Button type="ghost">
              <Icon type="filter" /> ({selectedKeys.indexOf('all') >= 0 ? MENUKEYS.length - 1 : selectedKeys.length }/{MENUKEYS.length - 1})
            </Button>
          </Dropdown>
        </div>
      </div>
    );
    return (
      <div className="pane-content tab-pane">
        <EventComposer sourceType={sourceType} />
        <Card bodyStyle={{ padding: 0 }} >
          <Collapse bordered={false} defaultActiveKey={['timeline']}>
            <Panel header={timelineHeader} key="timeline">
              <Timeline>
                {
                  filteredLogs.map(this.renderTimeLine)
                }
              </Timeline>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
