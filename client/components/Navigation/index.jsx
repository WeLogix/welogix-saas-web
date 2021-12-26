import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { setNavTitle } from 'common/reducers/navbar';
import { LogixIcon } from 'client/components/FontIcon';
import NavLink from '../NavLink';
import './style.less';

const { Sider } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

function isInclusivePath(pathTarget, pathSource) {
  let pathA = pathSource;
  if (pathA.charAt(pathA.length - 1) !== '/') {
    pathA = `${pathA}/`;
  }
  let pathB = pathTarget;
  if (pathB.charAt(pathB.length - 1) !== '/') {
    pathB = `${pathB}/`;
  }
  // '/a/' 只判断相等情况
  return pathA === pathB ||
    (pathA.split('/').length > 3 && pathB.indexOf(pathA) === 0);
}

@connect(
  state => ({
    navTitle: state.navbar.navTitle,
  }),
  { setNavTitle }
)
export default class Navigation extends PureComponent {
  static propTypes = {
    navTitle: PropTypes.shape({
      depth: PropTypes.number.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      single: PropTypes.bool,
      bottom: PropTypes.bool,
      key: PropTypes.string.isRequired,
      path: PropTypes.string,
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      sublinks: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        group: PropTypes.string,
      })),
    })).isRequired,
    appMenus: PropTypes.arrayOf(PropTypes.shape({
      app_name: PropTypes.string,
      url: PropTypes.string,
    })),
  }
  state = {
    selectedKeys: [],
    openedKey: [],
    collapsed: true,
  };

  componentWillMount() {
    this.setOpenSelectedKeys(this.props.location.pathname);
    if (typeof window !== 'undefined' && window.localStorage) {
      const menuSider = window.localStorage.getItem('menuSider');
      if (menuSider !== null) {
        const { collapsed } = JSON.parse(menuSider);
        this.setState({ collapsed });
        this.props.setNavTitle({ collapsed });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setOpenSelectedKeys(nextProps.location.pathname);
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
    this.props.setNavTitle({
      collapsed,
    });
    if (window.localStorage) {
      let menuSider = window.localStorage.getItem('menuSider');
      if (menuSider) {
        menuSider = { ...JSON.parse(menuSider), collapsed };
      } else {
        menuSider = { collapsed };
      }
      window.localStorage.setItem('menuSider', JSON.stringify(menuSider));
    }
  }
  setOpenSelectedKeys(path) {
    for (let i = 0; i < this.props.links.length; i++) {
      const link = this.props.links[i];
      if (link.single) {
        if (isInclusivePath(path, link.path)) {
          this.setState({
            openedKey: [],
            selectedKeys: [link.key],
          });
          return;
        }
      } else {
        for (let j = 0; j < link.sublinks.length; j++) {
          const sublink = link.sublinks[j];
          if (isInclusivePath(path, sublink.path)) {
            this.setState({
              openedKey: [link.key],
              selectedKeys: [sublink.key],
            });
            return;
          }
        }
      }
    }
  }
  handleMenuSelect = ({ selectedKeys }) => {
    this.setState({ selectedKeys });
  }
  handleClick = (ev) => {
    // keyPath ['subkey', 'menukey']
    this.setState({
      openedKey: ev.keyPath.slice(1),
    });
  }
  handleAppClick = (url) => {
    const win = window.open(url, '_blank');
    win.focus();
  }
  renderLink(link) {
    const bottomMenuItem = link.bottom ? 'bottom-menu-item' : '';
    if (link.single) {
      return (
        <MenuItem key={link.key} disabled={link.disabled} className={bottomMenuItem}>
          <NavLink to={link.path}>
            <LogixIcon type={link.icon} />
            <span className="nav-text">{link.text}</span>
          </NavLink>
        </MenuItem>
      );
    }
    const subMenuItems = link.sublinks.map(sub => (
      <MenuItem key={sub.key} disabled={sub.disabled}>
        <NavLink to={sub.path}>
          {sub.icon && <LogixIcon type={sub.icon} />}
          <span className="nav-text">{sub.text}</span>
        </NavLink>
      </MenuItem>));
    return (
      <SubMenu
        key={link.key}
        disabled={link.disabled}
        className={this.state.openedKey[0] === link.key ? 'ant-menu-submenu-selected' : ''}
        title={<div><LogixIcon type={link.icon} /><span className="nav-text">{link.text}</span></div>}
      >
        { subMenuItems }
      </SubMenu>
    );
  }
  renderNavMenu() {
    const { appMenus } = this.props;
    const links = [];
    this.props.links.filter(l => !l.invisible).forEach((linkItem) => {
      if (linkItem.group) {
        const linkGroup = links.find(item => item.group === linkItem.group);
        if (linkGroup) {
          linkGroup.links.push(linkItem);
        } else {
          links.push({ group: linkItem.group, links: [linkItem] });
        }
      } else {
        links.push(linkItem);
      }
    });
    return (<Menu
      mode="inline"
      theme="dark"
      onSelect={this.handleMenuSelect}
      selectedKeys={this.state.selectedKeys}
      onClick={this.handleClick}
    >
      {
        links.map((item) => {
          if (item.group) {
            return (
              <MenuItemGroup key={item.group} title={<span style={{ color: 'grey', fontSize: 12 }}>{item.group}</span>}>
                {item.links.map(linkItem => this.renderLink(linkItem))}
              </MenuItemGroup>
            );
          }
            return this.renderLink(item);
        })
      }
      {
        appMenus.map((app) => {
          if (app.single) {
            return (
              <MenuItem key={app.key} disabled={app.disabled}>
                <NavLink onChange={() => this.handleAppClick(app.path)}>
                  <LogixIcon type={app.icon} />
                  <span className="nav-text">{app.text}</span>
                </NavLink>
              </MenuItem>
            );
          }
          const subMenuItems = appMenus[0].sublinks.map(sub => (
            <MenuItem key={sub.key} disabled={sub.disabled}>
              <NavLink onChange={() => this.handleAppClick(sub.path)}>
                {sub.icon && <LogixIcon type={sub.icon} />}
                <span className="nav-text">{sub.text}</span>
              </NavLink>
            </MenuItem>));
          return (
            <SubMenu
              key={app.key}
              disabled={app.disabled}
              className={this.state.openedKey[0] === app.key ? 'ant-menu-submenu-selected' : ''}
              title={<div><LogixIcon type={app.icon} /><span className="nav-text">{app.text}</span></div>}
            >
              { subMenuItems }
            </SubMenu>
          );
        })
      }
    </Menu>);
  }
  render() {
    const { childContent, navTitle } = this.props;
    return (
      <Layout className="ant-layout-wrapper">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          width={176}
          className="left-sider"
          style={{ display: navTitle.depth === 3 ? 'none' : 'block' }}
        >
          {this.renderNavMenu()}
        </Sider>
        <Layout>
          {childContent}
        </Layout>
      </Layout>
    );
  }
}
