import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Layout, Menu } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import NavLink from 'client/components/NavLink';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from './message.i18n';

const { SubMenu } = Menu;
const { Sider } = Layout;

@injectIntl
export default class PaaSMenu extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    currentKey: PropTypes.string,
    openKey: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    openKeys: [],
  }
  componentDidMount() {
    this.setState({ openKeys: [this.props.openKey] });
  }
  msg = formatMsg(this.props.intl);
  openSubMenu = (ev) => {
    this.setState({ openKeys: [ev.key] });
  }
  render() {
    return (
      <Sider className="menu-sider">
        <Menu
          mode="inline"
          selectedKeys={[this.props.currentKey]}
          openKeys={this.state.openKeys}
        >
          <Menu.Item key="home">
            <NavLink to="/paas">
              <Icon type="home" /> {this.msg('paasOverview')}
            </NavLink>
          </Menu.Item>
          <Menu.ItemGroup title={this.msg('bizDomain')}>
            <SubMenu key="bizObject" title={<span><Icon type="build" /> {this.msg('bizObjTailor')}</span>} onTitleClick={this.openSubMenu}>
              <Menu.Item key="objectMeta">
                <NavLink to="/paas/object">
                  {this.msg('objectMeta')}
                </NavLink>
              </Menu.Item>
              <Menu.Item key="adapter">
                <NavLink to="/paas/adapter">
                  {this.msg('dataAdapters')}
                </NavLink>
              </Menu.Item>
              <Menu.Item key="templates">
                <NavLink to="/paas/templates">
                  {this.msg('templates')}
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="flowRule" title={<span><Icon type="deployment-unit" /> {this.msg('flowRule')}</span>} onTitleClick={this.openSubMenu}>
              <Menu.Item key="bizFlow">
                <NavLink to="/paas/flow">
                  {this.msg('bizFlow')}
                </NavLink>
              </Menu.Item>
              <Menu.Item key="approvalFlow" disabled>
                <NavLink to="/paas/approval">
                  {this.msg('approvalFlow')}
                </NavLink>
              </Menu.Item>
              <Menu.Item key="alertRule">
                <NavLink to="/paas/risk">
                  {this.msg('alertRule')}
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu.ItemGroup>
          <Menu.ItemGroup title={this.msg('dataPlatform')}>
            <Menu.Item key="dataHub" disabled>
              <NavLink to="/paas/data/hub">
                <LogixIcon type="icon-hub" /> {this.msg('dataHub')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="dataQC" disabled>
              <NavLink to="/paas/data/qc">
                <LogixIcon type="icon-qc" /> {this.msg('dataQC')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="dataSubject">
              <NavLink to="/paas/data/subject">
                <LogixIcon type="icon-dw" />{this.msg('dataSubject')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="dataV" disabled>
              <NavLink to="/paas/data/v">
                <LogixIcon type="icon-datav" /> {this.msg('dataV')}
              </NavLink>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title={this.msg('openPlatform')}>
            <Menu.Item key="integration">
              <NavLink to="/paas/integration">
                <Icon type="api" /> {this.msg('integration')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="dev">
              <NavLink to="/paas/dev">
                <Icon type="code" /> {this.msg('openDev')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="ops" disabled>
              <NavLink to="/paas/ops">
                <Icon type="experiment" /> {this.msg('openOps')}
              </NavLink>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>);
  }
}
