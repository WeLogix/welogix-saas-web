import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { BSS_SETTING } from 'common/constants';
import NavLink from 'client/components/NavLink';
import { formatMsg } from './message.i18n';

const { Sider } = Layout;

@injectIntl
export default class BSSSettingMenu extends React.Component {
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
          {BSS_SETTING.map(pref => (
            <Menu.Item key={pref.key}>
              <NavLink to={pref.link}>{this.msg(pref.key)}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    );
  }
}
