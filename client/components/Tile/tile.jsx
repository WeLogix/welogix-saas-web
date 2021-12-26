/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';
import { Card } from 'antd';
import './style.less';


export default class Tile extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    status: PropTypes.oneOf(['default', 'processing', 'warning', 'error', 'success']),
    wide: PropTypes.bool,
    subTitle: PropTypes.string,
    link: PropTypes.string,
    onClick: PropTypes.func,
    onReload: PropTypes.func,
    contentCol: PropTypes.number,
    contentRow: PropTypes.number,
    contentHeight: PropTypes.number,
    icon: PropTypes.node,
    footer: PropTypes.node,
  }
  static defaultProps = {
    wide: false,
  }
  renderContent() {
    const {
      children, contentHeight, contentRow, icon,
    } = this.props;
    let contentClass = 'welo-tile-content-flex';
    if (contentHeight) {
      contentClass = 'welo-tile-content-fixed';
    } else if (contentRow) {
      contentClass = 'welo-tile-content-block';
    }
    return (<div className="welo-tile-content" style={{ height: contentHeight || 90 }}>
      <div className={contentClass}>
        {children}
      </div>
      {icon && <span className="welo-tile-icon">{icon}</span>}
    </div>);
  }
  render() {
    const {
      subTitle, children, footer, timestamp, size, status, wide, link,
      onClick, onReload, contentHeight, contentCol, contentRow, icon, ...rest
    } = this.props;
    const classes = classNames('welo-tile', {
      'welo-tile-wide': wide,
      'welo-tile-lg': size === 'large',
      'welo-tile-sm': size === 'small',
      'welo-tile-default': !status || status === 'default',
      'welo-tile-processing': status === 'processing',
      'welo-tile-warning': status === 'warning',
      'welo-tile-error': status === 'error',
      'welo-tile-success': status === 'success',
      'welo-tile-col-2': contentCol === 2,
      'welo-tile-col-3': contentCol === 3,
      'welo-tile-col-4': contentCol === 4,
      'welo-tile-row-2': contentRow === 2,
    });
    return (
      <div className={classes}>
        <Card size="small" onClick={onClick} {...rest}>
          {subTitle && <div className="welo-tile-sub-title">{subTitle}</div>}
          {link ?
            <Link to={link}>
              {this.renderContent()}
            </Link> : this.renderContent()}
          {footer &&
            <div className="welo-tile-footer">
              {timestamp && <a className="welo-tile-timestamp" onClick={onReload}>{moment(timestamp).fromNow()}</a>}
              {footer}
            </div>}
        </Card>
      </div>
    );
  }
}
