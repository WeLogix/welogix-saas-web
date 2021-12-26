import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Avatar, Card, Drawer, Icon, Modal, Row, Spin, Tabs, Dropdown, Menu } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import { intlShape, injectIntl } from 'react-intl';
import { hideUserPanel, showPreferencePanel, showAccountPanel, changeUserLocale, loadTranslation } from 'common/reducers/saasUser';
import { logout } from 'common/reducers/account';
import { getTasks } from 'common/reducers/notification';
import CircleCard from 'client/components/CircleCard';
import TaskList from '../task/taskList';
import ActivityList from './activityList';
import PreferencePanel from './preferencePanel';
import AccountPanel from './accountPanel';
import { formatMsg } from '../message.i18n';

/**
 * @typedef {'myExecutedTasks'|'myCreatedTasks'|'myRecentActivities'} tabKey
 * @typedef {'pending'|'resolved'|'expired'} status */
const { TabPane } = Tabs;
const renderTabBar = (props, DefaultTabBar) => (
  <Sticky>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
  </Sticky>
);

const TASK_STATUSES = [
  { value: 'pending', label: '待处理' },
  { value: 'resolved', label: '已完成' },
  { value: 'expired', label: '逾期' },
];

@injectIntl
@connect(
  state => ({
    visible: state.saasUser.panelVisible,
    loginId: state.account.loginId,
    locale: state.saasUser.locale,
    avatar: state.account.profile.avatar,
    name: state.account.profile.name,
    myCreatedTasks: state.notification.myCreatedTasks,
    myExecTasks: state.notification.myExecTasks,
    notification: state.notification,
  }),
  {
    changeUserLocale,
    hideUserPanel,
    showPreferencePanel,
    showAccountPanel,
    loadTranslation,
    logout,
    getTasks,
  }
)
export default class UserPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  state = {
    logoutVisible: false,
    loggingOut: false,
    /** @type {tabKey} */
    activeKey: 'myExecutedTasks',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.handleLoadTasks(this.state.activeKey, true);
    }
  }
  msg = formatMsg(this.props.intl)
  handleShowPreference = () => {
    this.props.showPreferencePanel();
  }
  showLogoutModal = () => {
    this.setState({ logoutVisible: true });
  }
  hideLogoutModal = () => {
    this.setState({ logoutVisible: false });
  }
  handleLogout = () => {
    this.setState({ loggingOut: true });
    this.props.hideUserPanel();
    this.props.logout().then((result) => {
      if (!result.error) {
        setTimeout(() => {
          window.location.href = '/login';
          this.setState({
            logoutVisible: false,
          });
        }, 2000);
      }
    });
  }
  handleAfterLoggedOut = () => {
    this.setState({ loggingOut: false });
  }
  handleShowProfile = () => {
    this.props.showAccountPanel();
  }
  /**
   * @description 打开 panel 后, 第一次切到 myCreatedTasks 加载 createdTaskList
   * @param {tabKey} tabName */
  handleChangeTab = (tabName) => {
    this.setState({ activeKey: tabName });
    const { myCreatedTasks, myExecTasks } = this.props;
    if ((tabName === 'myCreatedTasks' && (myCreatedTasks.data.length === 0)) ||
    (tabName === 'myExecutedTasks' && (myExecTasks.data.length === 0))) {
      this.handleLoadTasks(tabName, true);
    }
  }
  /**
   * @description 默认加载下一页 status未完成
   * @param {tabKey} tabName @param {status} status @param {boolean} firstPage */
  handleLoadTasks = (tabName, firstPage, status) => {
    if (tabName === 'myCreatedTasks' && (this.props.myCreatedTasks.hasMore || firstPage)) {
      const { data, status: currStatus } = this.props.myCreatedTasks;
      const lastId = (data.length > 0 && !firstPage) ? data[data.length - 1].id : undefined;
      this.props.getTasks('create', status || currStatus, lastId);
    } else if (tabName === 'myExecutedTasks' && (this.props.myExecTasks.hasMore || firstPage)) {
      const { data, status: currStatus } = this.props.myExecTasks;
      const lastId = (data.length > 0 && !firstPage) ? data[data.length - 1].id : undefined;
      this.props.getTasks('executed', status || currStatus, lastId);
    }
  }
  checkIsArriveBottom = (offset) => {
    const { parentArea } = this;
    if (parentArea) {
      return parentArea.scrollTop + parentArea.clientHeight >= parentArea.scrollHeight - offset;
    }
    return false;
  }
  handleScroll = () => {
    const {
      myCreatedTasks: { loading: creLoading },
      myExecTasks: { loading: exeLoading },
    } = this.props;
    if (creLoading || exeLoading || !this.checkIsArriveBottom(200)) return;
    const { activeKey } = this.state;
    this.handleLoadTasks(activeKey);
  }
  handleRef = (div) => {
    this.parentArea = div.parentElement.parentElement;
  }
  handleChangeStatus = ({ key: status }) => {
    this.handleLoadTasks(this.state.activeKey, true, status);
  }
  /** @type {HTMLDivElement} */
  parentArea = null;
  render() {
    const {
      visible,
      avatar,
      name,
      myExecTasks: { status: exeStatus, data: myExecTasksList },
      myCreatedTasks: { status: createStatus, data: taskCreateList },
    } = this.props;
    const { activeKey, loggingOut, logoutVisible } = this.state;
    const exeStatusObj = TASK_STATUSES.find(obj => obj.value === exeStatus);
    const createStatusObj = TASK_STATUSES.find(obj => obj.value === createStatus);
    const execMenu = (<Menu onClick={this.handleChangeStatus} style={{ width: 90 }}>
      {TASK_STATUSES.slice(0, 2).map(obj => (<Menu.Item key={obj.value}>{obj.label}</Menu.Item>))}
    </Menu>);
    const CreateMenu = (<Menu onClick={this.handleChangeStatus} style={{ width: 90 }}>
      {TASK_STATUSES.map(obj => (<Menu.Item key={obj.value}>{obj.label}</Menu.Item>))}
    </Menu>);
    return (
      <div onScroll={this.handleScroll} >
        <Drawer
          width={680}
          visible={visible}
          onClose={this.props.hideUserPanel}
          title={<span>{avatar ?
            <Avatar src={avatar} /> :
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{name && name.slice(0, 1)}</Avatar>} {name}</span>}
        >
          <div ref={this.handleRef}>
            <Row type="flex">
              <CircleCard size="small" hoverable onClick={this.handleShowProfile}>
                <Card.Meta
                  title={<Icon type="user" />}
                  description={this.msg('userAccount')}
                />
              </CircleCard>
              <CircleCard size="small" hoverable onClick={this.handleShowPreference}>
                <Card.Meta
                  title={<Icon type="tool" />}
                  description={this.msg('userPreference')}
                />
              </CircleCard>
              <CircleCard size="small" hoverable onClick={this.showLogoutModal}>
                <Card.Meta
                  title={<Icon type="poweroff" />}
                  description={this.msg('userLogout')}
                />
              </CircleCard>
            </Row>
            <StickyContainer>
              <Tabs
                activeKey={activeKey}
                renderTabBar={renderTabBar}
                onTabClick={this.handleChangeTab}
              >
                <TabPane
                  tab={<span><Icon type="inbox" />{this.msg('myExecutedTasks')}</span>}
                  key="myExecutedTasks"
                >
                  <p style={{ textAlign: 'right' }}>
                    <Dropdown overlay={execMenu}>
                      <a>{exeStatusObj && exeStatusObj.label} <Icon type="down" /></a>
                    </Dropdown>
                  </p>
                  <TaskList tasks={myExecTasksList} />
                </TabPane>
                <TabPane
                  tab={<span><Icon type="export" />{this.msg('myCreatedTasks')}</span>}
                  key="myCreatedTasks"
                >
                  <p style={{ textAlign: 'right' }}>
                    <Dropdown overlay={CreateMenu}>
                      <a>{createStatusObj && createStatusObj.label} <Icon type="down" /></a>
                    </Dropdown>
                  </p>
                  <TaskList tasks={taskCreateList} editable />
                </TabPane>
                <TabPane
                  tab={<span><Icon type="clock-circle" />{this.msg('myRecentActivities')}</span>}
                  key="myRecentActivities"
                >
                  <ActivityList />
                </TabPane>
              </Tabs>
            </StickyContainer>
            <PreferencePanel />
            <AccountPanel />
            <Modal
              title={this.msg('userLogout')}
              visible={logoutVisible}
              onOk={this.handleLogout}
              confirmLoading={loggingOut}
              onCancel={this.hideLogoutModal}
              closable={false}
              maskClosable={false}
              cancelButtonProps={{
                disabled: loggingOut,
              }}
              afterClose={this.handleAfterLoggedOut}
            >
              <Spin tip={this.msg('loggingOut')} spinning={loggingOut} delay={500}>
                <Alert message={this.msg('logoutConfirm')} type="info" showIcon />
              </Spin>
            </Modal>
          </div>
        </Drawer>
      </div>
    );
  }
}
