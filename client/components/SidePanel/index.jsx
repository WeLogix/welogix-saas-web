import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSidePanelState } from 'common/reducers/navbar';
import { Card, Layout, Tooltip } from 'antd';
import './style.less';

const { Sider } = Layout;
@connect(
  state => ({
    collapsed: state.navbar.sidePanelInfo.topPanelCollapsed,
    topPanelHeight: state.navbar.sidePanelInfo.topPanelHeight,
    pinned: state.navbar.pageDrwopdownPinned,
  }),
  { toggleSidePanelState }
)
export default class SidePanel extends React.Component {
  static propTypes = {
    top: PropTypes.bool,
    collapsed: PropTypes.bool,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    children: PropTypes.node,
    onCollapseChange: PropTypes.func,
  }
  static defaultProps = {
    width: 300,
    top: false,
  }
  state = {}
  componentDidMount() {
    const { top, collapsed } = this.props;
    if (top && !collapsed) {
      this.props.toggleSidePanelState(false, this.wrapperDiv.offsetHeight);
    }
  }
  componentDidUpdate() {
    if (this.wrapperDiv && this.props.top) {
      if (this.wrapperDiv.offsetHeight !== this.props.topPanelHeight) {
        this.props.toggleSidePanelState(null, this.wrapperDiv.offsetHeight);
      }
    }
  }
  componentWillUnmount() {
    this.props.toggleSidePanelState(false);
  }
  toggle = () => {
    const { onCollapseChange, collapsed } = this.props;
    this.props.toggleSidePanelState(!collapsed);
    if (onCollapseChange) {
      onCollapseChange(!this.props.collapsed);
    }
  }
  render() {
    const {
      children, width, top, collapsed, pinned,
    } = this.props;
    return (
      top ?
        <div
          ref={(div) => { this.wrapperDiv = div; }}
          className={`welo-top-panel ${collapsed ? 'collapsed' : ''}`}
        >
          <div className="welo-top-panel-content">
            <Card bodyStyle={{ padding: 0 }}>
              {children}
            </Card>
          </div>
          <Tooltip title={collapsed ? '展开' : '收起'} placement="bottom" mouseEnterDelay={1.5} mouseLeaveDelay={0}>
            <a className="welo-top-panel-trigger-wrapper" onClick={this.toggle}>
              <i className={`panel-trigger ${collapsed ? 'down' : 'up'}`} />
            </a>
          </Tooltip>
        </div> :
        <Sider
          width={width}
          collapsible
          collapsedWidth={0}
          collapsed={collapsed || pinned}
          breakpoint="xl"
          className="welo-side-panel"
        >
          <div className="welo-side-panel-inner">
            {children}
          </div>
          <Tooltip title={collapsed ? '展开' : '收起'} placement="right" mouseEnterDelay={1.5} mouseLeaveDelay={0}>
            <a className="welo-side-panel-trigger-wrapper" onClick={this.toggle}>
              <i className={`panel-trigger ${collapsed ? 'right' : 'left'}`} />
            </a>
          </Tooltip>
        </Sider>
    );
  }
}
