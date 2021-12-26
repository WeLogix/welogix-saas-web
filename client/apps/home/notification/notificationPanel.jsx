import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Badge, Card, Drawer, Dropdown, Icon, List, Menu } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { hideNotificationDock, loadMessages, deleteAllRead, markMessageRead } from 'common/reducers/notification';
import { NOTIFICATION_STATUS, NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES } from 'common/constants';
import RowAction from 'client/components/RowAction';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.notification.dockVisible,
    messages: state.notification.messages,
    loading: state.notification.loading,
  }),
  {
    hideNotificationDock, loadMessages, deleteAllRead, markMessageRead,
  }
)
export default class NotificationPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    messages: PropTypes.shape({ status: PropTypes.number }).isRequired,
    loadMessages: PropTypes.func.isRequired,
    deleteAllRead: PropTypes.func.isRequired,
    markMessageRead: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedStatus: 'unread',
    selectedType: 'typeAll',
    selectedPriority: 'priorityAll',
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.handleLoad();
    }
  }
  msg = formatMsg(this.props.intl)

  handleMsgReadMark = (msgItem) => {
    let markItem;
    if (msgItem) {
      if (msgItem.status === NOTIFICATION_STATUS.read.key) {
        return;
      }
      markItem = msgItem.id;
    }
    this.props.markMessageRead(markItem);
  }
  handleMsgDel = (msgItem) => {
    this.props.deleteAllRead(msgItem && msgItem.id);
  }
  handleMenuClick = ({ key, keyPath }) => {
    if (key === 'allMsg' || key === 'unread') {
      this.setState({ selectedStatus: key });
      this.handleLoad(key);
    } else if (keyPath[1] === 'type') {
      this.setState({ selectedType: keyPath[0] });
      this.handleLoad(null, key);
    } else if (keyPath[1] === 'priority') {
      this.setState({ selectedPriority: keyPath[0] });
      this.handleLoad(null, null, key);
    } else if (key === 'markAllRead') {
      this.handleMsgReadMark();
    } else if (key === 'deleteAllRead') {
      this.handleMsgDel();
    }
  }
  handleLoad = (msgStatus, msgFrom, msgPriority) => {
    const { selectedStatus, selectedType, selectedPriority } = this.state;
    let reqStatus = msgStatus || selectedStatus;
    if (reqStatus === 'allMsg') {
      reqStatus = undefined;
    }
    let reqFrom = msgFrom || selectedType;
    reqFrom = NOTIFICATION_TYPES.find(ntt => ntt.key === reqFrom);
    if (reqFrom) {
      reqFrom = reqFrom.value;
    }
    let reqPriority = msgPriority || selectedPriority;
    reqPriority = NOTIFICATION_PRIORITIES.find(ntp => ntp.key === reqPriority);
    if (reqPriority) {
      reqPriority = reqPriority.value;
    }
    this.props.loadMessages({
      pageSize: this.props.messages.pageSize,
      currentPage: this.props.messages.currentPage,
      status: reqStatus,
      from: reqFrom,
      priority: reqPriority,
    });
  }
  render() {
    const { messages, visible, loading } = this.props;
    const { selectedStatus, selectedType, selectedPriority } = this.state;
    const menu = (
      <Menu
        multiple
        onClick={this.handleMenuClick}
        selectedKeys={[selectedStatus, selectedType, selectedPriority]}
      >
        <Menu.Item key="allMsg">
          {this.msg('allMsg')}
        </Menu.Item>
        <Menu.Item key="unread">
          {this.msg('unread')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.SubMenu key="type" title={this.msg('notifType')}>
          {
            NOTIFICATION_TYPES.map(type => <Menu.Item key={type.key}>{type.text}</Menu.Item>)
          }
        </Menu.SubMenu>
        <Menu.SubMenu key="priority" title={this.msg('notifPriority')}>
          {
            NOTIFICATION_PRIORITIES.map(priority =>
              <Menu.Item key={priority.key}>{priority.key !== 'priorityAll' && <Badge status={priority.badge} />}{priority.text}</Menu.Item>)
          }
        </Menu.SubMenu>
        <Menu.Divider />
        <Menu.Item key="markAllRead">
          {this.msg('markAllRead')}
        </Menu.Item>
        <Menu.Item key="deleteAllRead">
          {this.msg('deleteAllRead')}
        </Menu.Item>
      </Menu>
    );
    return (
      <Drawer
        width={680}
        visible={visible}
        onClose={this.props.hideNotificationDock}
        title={<span><Icon type="bell" /> {this.msg('notification')}</span>}
      >
        <List
          header={<Dropdown overlay={menu}>
            <a>
              {this.msg(selectedStatus)}
              {selectedType !== 'typeAll' && ` - ${NOTIFICATION_TYPES.find(type => type.key === selectedType).text}`}
              {selectedPriority !== 'priorityAll' && ` - ${NOTIFICATION_PRIORITIES.find(priority => priority.key === selectedPriority).text}`}
              <Icon type="down" />
            </a>
          </Dropdown>}
          split={false}
          dataSource={messages.data}
          loading={loading}
          layout="vertical"
          className="notification-list"
          // pagination={pagination}
          renderItem={(item) => {
            const statusClass = item.status === NOTIFICATION_STATUS.read.key ? 'read' : 'unread';
            const priority = NOTIFICATION_PRIORITIES.find(pri => pri.value === item.priority);
            const fromType = NOTIFICATION_TYPES.find(type => type.value === item.fromtype);
            return (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  size="small"
                  className={`list-item-card ${statusClass} ${priority && priority.badge}`}
                  onClick={() => this.handleMsgReadMark(item)}
                >
                  <RowAction icon="close" onClick={this.handleMsgDel} row={item} />
                  <Card.Meta
                    avatar={fromType ? <Avatar style={{ backgroundColor: fromType.color }}><LogixIcon type={fromType.icon} /></Avatar> : <Avatar icon="info" />}
                    title={item.title}
                    description={<Ellipsis lines={1}>{item.content || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                  />
                  <span className="timestamp">{item.created_date && moment(item.created_date).fromNow()}</span>
                </Card>
              </List.Item>
            );
          }}
        />
      </Drawer>
    );
  }
}
