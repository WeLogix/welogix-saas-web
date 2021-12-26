import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import NavLink from 'client/components/NavLink';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from './message.i18n';

const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;

@injectIntl
@connect(state => ({
  privileges: state.account.privileges,
}))
export default class CorpSiderMenu extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    currentKey: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { privileges, currentKey, openKey } = this.props;
    const corpSettingMenus = [];
    if (hasPermission(privileges, { module: 'corp', feature: 'info' })) {
      corpSettingMenus.push(<Menu.Item key="info">
        <NavLink to="/corp/info">
          <LogixIcon type="icon-corp" />{this.msg('corpInfo')}
        </NavLink>
      </Menu.Item>);
    }
    if (hasPermission(privileges, { module: 'corp', feature: 'member' })) {
      corpSettingMenus.push(<Menu.Item key="members">
        <NavLink to="/corp/members">
          <LogixIcon type="icon-org" />{this.msg('corpDeptMember')}
        </NavLink>
      </Menu.Item>);
    }
    if (hasPermission(privileges, { module: 'corp', feature: 'role' })) {
      corpSettingMenus.push(<Menu.Item key="role">
        <NavLink to="/corp/role">
          <LogixIcon type="icon-privilege" />{this.msg('corpRole')}
        </NavLink>
      </Menu.Item>);
    }
    return (
      <Sider className="menu-sider">
        <Menu mode="inline" selectedKeys={[currentKey]} defaultOpenKeys={openKey ? [openKey] : []}>
          <Menu.Item key="overview">
            <NavLink to="/corp/overview">
              <LogixIcon type="icon-overview" />{this.msg('overview')}
            </NavLink>
          </Menu.Item>
          {corpSettingMenus.length > 0 ?
          (<MenuItemGroup key="corpMenu" title={this.msg('corpBasic')}>
            {corpSettingMenus}
          </MenuItemGroup>) : null
          }
          {hasPermission(privileges, { module: 'corp', feature: 'collab' }) ?
            <MenuItemGroup key="corpConnect" title={this.msg('corpConnect')}>
              <Menu.Item key="affiliate">
                <NavLink to="/corp/affiliate">
                  <LogixIcon type="icon-affiliate" />{this.msg('affiliate')}
                </NavLink>
              </Menu.Item>
              <Menu.SubMenu key="collab" title={<span><LogixIcon type="icon-collab" />{this.msg('collabAuth')}</span>} >
                <Menu.Item key="invitation">
                  <NavLink to="/corp/collab/invitation">
                    <Icon type="retweet" />{this.msg('collabInvitation')}
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="empower">
                  <NavLink to="/corp/collab/empower">
                    <Icon type="setting" />{this.msg('collabEmpower')}
                  </NavLink>
                </Menu.Item>
              </Menu.SubMenu>
            </MenuItemGroup> : null}
          {hasPermission(privileges, { module: 'corp', feature: 'log' }) ?
            <MenuItemGroup key="dataMenu" title={this.msg('corpAudit')}>
              <Menu.Item key="trial">
                <NavLink to="/corp/trial">
                  <LogixIcon type="icon-trial" />{this.msg('auditTrial')}
                </NavLink>
              </Menu.Item>
            </MenuItemGroup> : null}
        </Menu>
      </Sider>);
  }
}
