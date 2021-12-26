import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Alert, Icon, Layout } from 'antd';
import { locationShape } from 'react-router';
import io from 'socket.io-client';
import { toggleAlert } from 'common/reducers/navbar';
import { loadDeptAndMembers } from 'common/reducers/account';
import NotificationPanel from './home/notification/notificationPanel';
import UserPanel from './home/user/userPanel';
import AlarmPanel from './home/alarm/alarmPanel';
import BizRiskAlarmPanel from './home/alarm/bizRiskAlarmPanel';
import DocumentPanel from './home/document/documentPanel';
import SearchPanel from './home/search/searchPanel';
import DockBridgePool from '../components/Dock/dockBridgePool';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    hasAlert: state.navbar.hasAlert,
  }),
  { toggleAlert, loadDeptAndMembers }
)
export default class Wrapper extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    children: PropTypes.node.isRequired,
    location: locationShape.isRequired,
  }
  static childContextTypes = {
    location: locationShape.isRequired,
  }
  state = {
    alertMsg: null,
  }
  getChildContext() {
    return { location: this.props.location };
  }
  componentDidMount() {
    this.props.loadDeptAndMembers();
    if (!this.socket) {
      this.socket = io(`${API_ROOTS.notify}sysinfo`);
      this.socket.on('connect', () => {
        this.socket.on('cihook', (data) => {
          if (data.message === 'new-web-version') {
            this.props.toggleAlert(true);
            this.setState({
              alertMsg: <a href={window.location.href}><Icon type="reload" /> {this.msg('versionUpdate')}</a>,
            });
          }
        });
      });
      if (__DEV__) {
        this.socket.on('connect_error', () => {
          this.socket.close();
        });
      }
    }
  }
  componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { hasAlert } = this.props;
    const { alertMsg } = this.state;
    return (
      <Layout className="welo-layout-wrapper">
        {hasAlert &&
        <Alert type="info" message={alertMsg} banner closable showIcon={false} onClose={() => this.props.toggleAlert(false)} />}
        {this.props.children}
        <NotificationPanel />
        <UserPanel />
        <DockBridgePool />
        <AlarmPanel />
        <BizRiskAlarmPanel />
        <DocumentPanel />
        <SearchPanel />
      </Layout>
    );
  }
}
