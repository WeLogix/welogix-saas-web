import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Icon, notification } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { countUnreadMsg, showNotificationDock } from 'common/reducers/notification';
import io from 'socket.io-client';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  loginId: state.account.loginId,
  unreadMessagesNum: state.notification.unreadMessage.count,
  incomingOne: state.notification.unreadMessage.incomingOne,
}), {
  showNotificationDock, countUnreadMsg,
})
export default class NotificationIcon extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loginId: PropTypes.number.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { loginId } = this.props;
    if (('Notification' in window) && Notification.permission !== 'granted') {
      Notification.requestPermission((status) => {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
    }

    if (!this.socket) {
      this.socket = io(`${API_ROOTS.notify}notify`);
      this.socket.on('connect', () => {
        this.socket.emit('login', { login_id: loginId });
      });
      let unreadRequesting = false;
      this.socket.on('loginrt', (data) => {
        if (!unreadRequesting && data === 'new-msg') {
          unreadRequesting = true;
          setTimeout(() => {
            this.props.countUnreadMsg(true).then(() => {
              unreadRequesting = false;
            });
          }, 10000); // 10s内只查一次
        }
      });
      if (__DEV__) {
        this.socket.on('connect_error', () => {
          if (this.socket) {
            this.socket.close();
          }
        });
      }
    }
    this.props.countUnreadMsg();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.incomingOne && nextProps.incomingOne !== this.props.incomingOne) {
      const { title, content } = nextProps.incomingOne;
      if (('Notification' in window) && Notification.permission === 'granted') {
        const n = new Notification(title, {
          body: content,
        });
        n.onclick = () => {
          n.close();
        };
      } else {
        notification.open({
          message: title,
          description: content,
          duration: 10,
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
  handleShowDock = () => {
    this.props.showNotificationDock();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { unreadMessagesNum } = this.props;
    return (
      <div onClick={this.handleShowDock}>
        <Badge count={unreadMessagesNum} overflowCount={99}>
          <Icon type="bell" />
        </Badge>
      </div>
    );
  }
}
