import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Drawer, Layout, Menu, Icon, Tooltip, Dropdown } from 'antd';
import { DATA_SCOPE, DATA_COLLAB } from 'common/constants';
import { togglePageDropdown } from 'common/reducers/navbar';
import Title from './title';
import './style.less';

const { Header } = Layout;

@connect(
  state => ({
    pinned: state.navbar.pageDrwopdownPinned,
  }),
  {
    togglePageDropdown,
  }
)
export default class PageHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.node,
    tip: PropTypes.string,
    extra: PropTypes.node,
    breadcrumb: PropTypes.arrayOf(PropTypes.node),
    menus: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, menu: PropTypes.node })),
    currentKey: PropTypes.string,
    showScope: PropTypes.bool,
    showCollab: PropTypes.bool,
  }
  static defaultProps = {
    showScope: true,
    showCollab: true,
  }
  onChange = (ev) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(ev.key);
    }
  };
  handleDropdownMenu = ({ key }) => {
    const { dropdownMenu } = this.props;
    if (key === 'pin') {
      this.props.togglePageDropdown(true);
      return;
    } else if (key === 'unpin') {
      this.props.togglePageDropdown(false);
      return;
    } else if (key === 'setting') {
      return;
    }
    if (dropdownMenu) {
      dropdownMenu.onMenuClick(key);
    }
  }
  render() {
    const {
      children, title, tip, breadcrumb, menus, currentKey, dropdownMenu, extra,
      pinned, showScope, showCollab,
    } = this.props;
    const defaultTab = menus && (menus.filter(item => item.default)[0] || menus[0]);
    const tb = title ? [title] : (breadcrumb || []);
    let dropdownMenuNode = null;
    let groupMenu = null;
    if (dropdownMenu) {
      const { dropdownMenuItems, selectedMenuKey } = dropdownMenu;
      let currRow = DATA_SCOPE.concat(DATA_COLLAB).find(scope =>
        scope.elementKey === selectedMenuKey);
      if (dropdownMenuItems) {
        for (let i = 0, len = dropdownMenuItems.length; i < len && !currRow; i++) {
          const item = dropdownMenuItems[i];
          if (item.elements) {
            currRow = item.elements.find(element => element.elementKey === selectedMenuKey);
          } else {
            currRow = item.elementKey === selectedMenuKey ? item : null;
          }
        }
      }
      groupMenu =
        (<Menu className="page-header-pop-up" selectedKeys={[selectedMenuKey]} onClick={this.handleDropdownMenu}>
          {
            showScope && DATA_SCOPE.map(scope => (
              <Menu.Item key={scope.elementKey}>
                {scope.name}
              </Menu.Item>
            ))
          }
          {showScope && <Menu.Divider key="d1" />}
          {
            showCollab && DATA_COLLAB.map(collab => (
              <Menu.Item key={collab.elementKey}>
                <Icon type={collab.icon} /> {collab.name}
              </Menu.Item>
            ))
          }
          {showCollab && <Menu.Divider key="d2" />}
          {dropdownMenuItems && dropdownMenuItems.map(item => (
            item.elements && item.elements.length > 0 ?
              <Menu.ItemGroup key={item.elementKey} title={item.title}>
                {item.elements.map(element => (
                  <Menu.Item key={element.elementKey}>
                    {element.name}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup> :
              <Menu.Item key={item.elementKey}>
                {item.icon && <Icon type={item.icon} />} {item.name}
              </Menu.Item>
          ))}
          {dropdownMenuItems && <Menu.Item key="setting" disabled>
            <Icon type="setting" /> 场景设置
          </Menu.Item>}
          {dropdownMenuItems && <Menu.Divider key="d3" />}
          {this.props.pinned ? <Menu.Item key="unpin" className="collapse-trigger">
            <Icon type="menu-fold" /> 隐藏分组栏
          </Menu.Item> : <Menu.Item key="pin">
            <Icon type="pushpin" /> 固定分组栏
          </Menu.Item>}
        </Menu>);
      dropdownMenuNode = (
        <Dropdown overlay={groupMenu} >
          <a className="ant-dropdown-link">
            {currRow && currRow.name}<Icon type="down" />
          </a>
        </Dropdown>
      );
    }
    const headerContent = [
      <Header className="welo-page-header" key="header">
        <div className="welo-page-header-wrapper">
          {(title || breadcrumb) && !pinned &&
            <Title breadcrumb={tb} />
          }
          {dropdownMenuNode}
          {menus && menus.length &&
            <Menu
              onClick={this.onChange}
              defaultSelectedKeys={(currentKey && [currentKey]) || (defaultTab && [defaultTab.key])}
              mode="horizontal"
            >
              {menus.map(item => <Menu.Item key={item.key} >{item.menu}</Menu.Item>)}
            </Menu>
          }
          {tip &&
            <Tooltip placement="right" title={tip}>
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          {extra &&
            <div className="welo-page-header-extra">{extra}</div>
          }
        </div>
        {children}
      </Header>];
    if (dropdownMenu) {
      headerContent.push(<Drawer
        key="dropdown"
        placement="left"
        visible={pinned}
        closable={false}
        mask={false}
        getContainer={() => document.getElementById('page-layout') || document.body}
        width={200}
        height="100%"
        className="pinned-dropdown"
        style={{
          position: 'absolute', zIndex: 20, left: 0, bottom: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {title && <div className="pinned-dropdown-title">{title}</div>}
        {groupMenu}
      </Drawer>);
    }
    return headerContent;
  }
}
