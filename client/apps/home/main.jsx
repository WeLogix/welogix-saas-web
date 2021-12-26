import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Badge, Card, Icon, Menu, Layout, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import HeaderNavbar from 'client/apps/home/headerNavbar';
import NavLink from 'client/components/NavLink';
import { LogixIcon } from 'client/components/FontIcon';
import connectNav from 'client/common/decorators/connect-nav';
import { updateChangelogMemberviewed } from 'common/reducers/account';
import AppLaunchCard from './appLaunchCard';
import ChangeLogList from './changeLogList';
import { formatMsg } from './message.i18n';
import './style.less';

const { Header, Content } = Layout;
const MenuItem = Menu.Item;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    isManager: state.account.isManager,
    changelogViewed: state.account.changelogViewed,
    logo: state.corpDomain.logo,
    name: state.corpDomain.name,
    tenantId: state.account.tenantId,
    tenantName: state.account.tenantName,
    loginId: state.account.loginId,
    username: state.account.profile.name,
    email: state.account.profile.email,
    phone: state.account.profile.phone,
    unionId: state.account.unionId,
    tenantLevel: state.account.tenantLevel,
  }),
  { updateChangelogMemberviewed }
)
@connectNav({
  depth: 1,
})
export default class Home extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };
  componentDidMount() {
    if (typeof window.daovoice === 'function') {
      window.daovoice('init', {
        app_id: 'dcb1ac4c',
        user_id: this.props.loginId,
        name: this.props.username,
        email: this.props.email,
        phone: this.props.phone,
        company: {
          company_name: this.props.tenantName, // 必填,公司
          company_id: this.props.tenantId, // 可选，公司唯一标识
        },
      });
      window.daovoice('update');
      const daoContainer = document.getElementById('daodream-launcher');
      if (daoContainer) {
        daoContainer.style.visibility = 'visible';
      }
    }
  }
  componentWillUnmount() {
    if (typeof window.daovoice === 'function') {
      window.daovoice('hide');
      const daoContainer = document.getElementById('daodream-launcher');
      if (daoContainer) {
        daoContainer.style.visibility = 'hidden';
      }
    }
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (key) => {
    if (key === 'changeLog' && !this.props.changelogViewed) {
      this.props.updateChangelogMemberviewed();
    }
  }
  render() {
    const {
      logo, name, isManager, changelogViewed,
    } = this.props;
    const tenantMenus = [
      <MenuItem key="saas">
        <LogixIcon type="icon-saas" /> {this.msg('apps')}
      </MenuItem>,
    ];
    if (isManager) {
      tenantMenus.push(<MenuItem key="admin">
        <NavLink to="/corp">
          <LogixIcon type="icon-control" /> {this.msg('admin')}
        </NavLink>
      </MenuItem>);
    }
    if (isManager) {
      tenantMenus.push(<MenuItem key="paas">
        <NavLink to="/paas">
          <LogixIcon type="icon-paas" /> {this.msg('paas')}
        </NavLink>
      </MenuItem>);
    }
    return (
      <Layout>
        <Header>
          <HeaderNavbar />
        </Header>
        <Content id="module-layout">
          <div className="home-header home-header-bg">
            <div className="tenant-info">
              <div className="tenant-logo">
                {logo ? <Avatar shape="square" size={64} src={logo} /> : <Avatar shape="square" size={64}><LogixIcon type="icon-corp" /></Avatar>}
              </div>
              <h2 className="tenant-name">{name}</h2>
            </div>
          </div>
          <div className="home-nav" >
            <Menu defaultSelectedKeys={['saas']} mode="horizontal">
              {tenantMenus}
            </Menu>
          </div>
          <div className="layout-fixed-width home-body" key="body">
            <div style={{ marginTop: 24, marginBottom: 8 }}>
              <AppLaunchCard />
            </div>
            <Card bodyStyle={{ padding: 8 }}>
              <Tabs onChange={this.handleTabChange}>
                <TabPane tab={<Badge dot={!changelogViewed}><Icon type="notification" /> {this.msg('changeLog')}</Badge>} key="changeLog"><ChangeLogList /></TabPane>
              </Tabs>
            </Card>
          </div>
        </Content>
      </Layout>);
  }
}
