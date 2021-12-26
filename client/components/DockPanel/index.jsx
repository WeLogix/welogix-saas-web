import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert, Badge, Button, Icon, Popover, Spin } from 'antd';
import classNames from 'classnames';
import './style.less';

function noop() {}

export default class DockPanel extends PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    size: PropTypes.string,
    logo: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    mode: PropTypes.string,
    status: PropTypes.oneOf(['default', 'processing', 'warning', 'error', 'success']),
    statusText: PropTypes.string,
    overlay: PropTypes.node,
    extra: PropTypes.node,
    children: PropTypes.node,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    className: PropTypes.string,
    alert: PropTypes.node,
    alertType: PropTypes.string,
    currentDepth: PropTypes.number,
    onForward: PropTypes.func,
    onBackward: PropTypes.func,
  }
  static defaultProps = {
    prefixCls: 'welo-dock-panel',
    alertType: 'info',
    loading: false,
    currentDepth: 1,
  }
  state = {
    depth: this.props.currentDepth,
    overlayVisible: false,
  }
  componentWillUnmount() {
    // window.$(document).unbind('click');
    window.document.removeEventListener('click', null, false);
  }
  handleClose = (e) => {
    (this.props.onClose || noop)(e);
  }
  handleForward = (e) => {
    this.setState({
      depth: this.state.depth + 1,
    });
    (this.props.onForward || noop)(e);
  }
  handleBackward = (e) => {
    this.setState({
      depth: this.state.depth - 1,
    });
    (this.props.onBackward || noop)(e);
  }
  handleVisibleChange = (overlayVisible) => {
    this.setState({ overlayVisible });
  }
  hideOverlay = () => {
    this.setState({
      overlayVisible: false,
    });
  }
  render() {
    const {
      prefixCls, size = '', className, visible, logo, label, title, mode, status, statusText,
      overlay, onEdit, extra, loading, alert, alertType, children, bodyStyle, printBtn,
    } = this.props;
    const sizeCls = ({
      large: 'lg',
      middle: 'md',
      small: 'sm',
    })[size] || '';
    const classes = classNames(prefixCls, {
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-visible`]: visible,
      [`${prefixCls}-inner`]: mode === 'inner',
    }, className);
    const maskClasses = classNames(
      `${prefixCls}-mask`,
      { [`${prefixCls}-mask-hidden`]: (!visible || mode === 'inner') },
    );
    const bodyCls = extra ? `${prefixCls}-body with-header-extra` : `${prefixCls}-body`;
    return (
      <div>
        <div className={maskClasses} onClick={this.handleClose} />
        <div className={classes}>
          <Spin spinning={loading}>
            <div className={`${prefixCls}-head`}>
              <div className={`${prefixCls}-head-wrapper`}>
                <div className={`${prefixCls}-head-title`}>
                  {logo &&
                  <span className={`${prefixCls}-head-title-logo`}><img src={logo} alt="logo" /></span>}
                  {label ? <span>
                    <div className={`${prefixCls}-head-title-label`}>{label}</div>
                    <div className={`${prefixCls}-head-title-text`}>{title}</div>
                  </span> :
                  <h4>{title}</h4>}
                  {status ? <Badge status={status} text={statusText} /> : null}
                </div>
                <div className={`${prefixCls}-head-right`}>
                  {printBtn}
                  {onEdit &&
                    <Button icon="edit" onClick={onEdit} />
                  }
                  {overlay &&
                    <Popover
                      placement="bottomRight"
                      visible={this.state.overlayVisible}
                      onVisibleChange={this.handleVisibleChange}
                      content={<div className={`${prefixCls}-popover`} onClick={this.hideOverlay}>{overlay}</div>}
                      trigger="click"
                      overlayClassName="navbar-popover"
                    >
                      <Button><Icon type="ellipsis" /></Button>
                    </Popover>
                  }
                </div>
                <Button className="ant-drawer-close" icon="close" onClick={this.handleClose} />
              </div>
              {extra ? <div className={`${prefixCls}-head-extra`}>{extra}</div> : null}
            </div>
            <div className={bodyCls} style={bodyStyle}>
              {alert ? <Alert message={alert} type={alertType} /> : null}
              {visible && children}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}
