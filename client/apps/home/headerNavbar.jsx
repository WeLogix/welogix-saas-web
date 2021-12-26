import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerShape } from 'react-router';
import classNames from 'classnames';
import { Menu, Popover, Icon, Tooltip } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { showUserPanel } from 'common/reducers/saasUser';
import { logout } from 'common/reducers/account';
import { goBackNav } from 'common/reducers/navbar';
import ModuleMenu from 'client/components/ModuleMenu';
import NavLink from 'client/components/NavLink';
import { LogixIcon } from 'client/components/FontIcon';
import NotificationIcon from './notification/notificationIcon';
import SearchIcon from './search/searchIcon';
import DocumentIcon from './document/documentIcon';
import UserIcon from './user/userIcon';
import RiskAlarmIndicator from './alarm/riskAlarmIndicator';
import CollabIndicator from './task/collabIndicator';
import { formatMsg } from './message.i18n';
import './navbar.less';

const MenuItem = Menu.Item;

@injectIntl
@connect(
  state => ({
    navTitle: state.navbar.navTitle,
    hasAlert: state.navbar.hasAlert,
  }),
  {
    logout, goBackNav, showUserPanel,
  }
)
export default class HeaderNavbar extends React.Component {
  static propTypes = {
    compact: PropTypes.bool,
    intl: intlShape.isRequired,
    navTitle: PropTypes.shape({
      depth: PropTypes.number.isRequired,
      stack: PropTypes.number.isRequired,
      moduleName: PropTypes.string,
    }).isRequired,
    logout: PropTypes.func.isRequired,
    theme: PropTypes.string,
  }
  static contextTypes = {
    router: routerShape.isRequired,
  }
  static defaultProps = {
    compact: false,
    theme: 'light',
  }
  handleShowUserPanel = () => {
    this.props.showUserPanel();
  }
  handleLogout = () => {
    this.props.logout().then((result) => {
      if (!result.error) {
        window.location.href = '/login';
      }
    });
  }
  handleGoAccount = () => {
    window.open('/account/profile');
  }
  handleHelpCenter = () => {
    window.open('https://www.yuque.com/welogix/help');
  }
  handleGoDepth2 = () => {
    this.context.router.go(-this.props.navTitle.stack);
  }
  handleGoBack = () => {
    this.context.router.goBack();
    this.props.goBackNav();
    // router.goBack on initial login next *TODO* history index
  }
  // msg = (descriptor, values) => formatMsg(this.props.intl, descriptor, values);
  msg = formatMsg(this.props.intl)
  render() {
    const { compact, navTitle } = this.props;
    const helpPopoverContent = (
      <Menu selectable={false}>
        <MenuItem>
          <a role="presentation" onClick={this.handleHelpCenter}>
            <Icon type="bulb" />
            <span>{this.msg('helpcenter')}</span>
          </a>
        </MenuItem>
        <MenuItem>
          <Icon type="qrcode" />
          <span>{this.msg('wxService')}</span>
        </MenuItem>
        <li className="qrcode"><img src="https://static-cdn.welogix.cn/images/qrcode.jpg" width="128" alt="qrcode" /></li>
      </Menu>
    );
    const { moduleName, collapsed } = navTitle;
    let brandNav = (<span className="navbar-brand" />);
    const appMenu = (<Menu mode="horizontal" selectable={false} key="menu">
      {!compact &&
        <MenuItem key="alarm">
          <RiskAlarmIndicator />
        </MenuItem>}
      {!compact &&
        <MenuItem key="document">
          <DocumentIcon />
        </MenuItem>}
      {!compact &&
        <MenuItem>
          <NotificationIcon />
        </MenuItem>}
      {!compact &&
        <MenuItem>
          <Popover
            content={helpPopoverContent}
            placement="bottomRight"
            trigger="click"
            overlayClassName="navbar-popover"
          >
            <div><Icon type="question-circle-o" /></div>
          </Popover>
        </MenuItem>}
      <MenuItem>
        <UserIcon />
      </MenuItem>
    </Menu>);
    const navRight = [];
    if (navTitle.depth === 1) { // 首页
      navRight.push(appMenu);
    } else if (navTitle.depth === 2) { // 模块主页面
      brandNav = navTitle.dropDown ? <span className="navbar-brand" /> : (
        <NavLink to="/">
          <Popover
            content={<ModuleMenu />}
            placement="rightTop"
            trigger="hover"
            overlayClassName="apps-popover"
          >
            <div className={`module-${moduleName}`}>
              <div className={`navbar-toggle ${collapsed ? 'collapsed' : ''}`}>
                <LogixIcon type="icon-grid" />
                {!collapsed && <span>{this.msg(`module${moduleName.toUpperCase()}`)}</span>}
              </div>
            </div>
          </Popover>
        </NavLink>
      );
      navRight.push(appMenu);
    } else if (navTitle.depth === 3) { // 详情页面
      brandNav = [(
        <Tooltip placement="bottomLeft" arrowPointAtCenter mouseEnterDelay={2} title={this.msg('back')} key="back" >
          <a role="presentation" className="navbar-anchor" key="back" onClick={this.handleGoBack}>
            <Icon type="arrow-left" />
          </a>
        </Tooltip>)];
      navRight.push(<CollabIndicator key="collab" />);
      if (navTitle.jumpOut && this.props.navTitle.stack > 1) {
        navRight.push(<Tooltip placement="bottomLeft" arrowPointAtCenter mouseEnterDelay={2} title={this.msg('close')} key="close" >
          <a role="presentation" className="navbar-anchor navbar-anchor-close" key="close" onClick={this.handleGoDepth2}>
            <Icon type="close" />
          </a>
        </Tooltip>);
      }
    }
    const classes = classNames('layout-header', 'navbar', {
      'navbar-light': this.props.theme === 'light',
      'navbar-fixed-top': !this.props.hasAlert,
    });
    const spacerClasses = classNames('navbar-spacer', {
      'navbar-spacer-hidden': this.props.hasAlert,
    });
    return [
      <nav className={classes} key="nav">
        <div className="navbar-left">
          {brandNav}
          {navTitle.depth !== 1 && !navTitle.dropDown &&
            <div className="navbar-title">
              {this.msg(navTitle.title)}
            </div>}
        </div>
        {navTitle.depth !== 3 && !compact &&
          <div className="navbar-search">
            <SearchIcon />
          </div>}
        {navTitle.depth === 3 && !compact &&
          <div className="navbar-center">
            <RiskAlarmIndicator detailLevel />
          </div>}
        <div className="nav navbar-right">
          {navRight}
        </div>
      </nav>,
      <div className={spacerClasses} key="spacer" />,
    ];
  }
}
