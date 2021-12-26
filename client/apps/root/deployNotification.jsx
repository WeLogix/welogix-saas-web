import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import io from 'socket.io-client';

export default class DeployNotification extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (!this.socket) {
      this.socket = io(`${API_ROOTS.notify}sysinfo`);
      this.socket.on('connect', () => {
        this.socket.on('cihook', (data) => {
          if (data.message === 'new-web-version') {
            message.destroy();
            message.warn(
              <span>发现系统版本更新, 请<a href={window.location.href}>点击刷新</a></span>,
              0
            );
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
  render() {
    return null;
  }
}

