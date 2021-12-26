import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import classNames from 'classnames';
import './style.less';

const { Content } = Layout;

@connect(
  state => ({
    pinned: state.navbar.pageDrwopdownPinned,
  }),
  {
  }
)
export default class PageContent extends Component {
  static propTypes = {
    children: PropTypes.node,
    pinned: PropTypes.bool,
    readonly: PropTypes.bool,
    deleted: PropTypes.bool,
    prefixCls: PropTypes.string,
  }
  static defaultProps = {
    prefixCls: 'page-content',
  }
  render() {
    const {
      prefixCls, pinned, readonly, deleted, className, children,
    } = this.props;
    const classes = classNames(prefixCls, {
      [`${prefixCls}-with-pinned-dropdown`]: pinned,
      [`${prefixCls}-readonly`]: readonly,
      [`${prefixCls}-deleted`]: deleted,
    }, className);
    return (
      <Content className={classes} key="main">{children}</Content>
    );
  }
}
Content.props = {
  children: PropTypes.node,
};
