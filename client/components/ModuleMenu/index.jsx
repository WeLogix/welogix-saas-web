import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Menu } from 'antd';
import { DEFAULT_MODULES } from 'common/constants';
import { LogixIcon } from 'client/components/FontIcon';
import NavLink from 'client/components/NavLink';
import { formatMsg } from '../message.i18n';
import './style.less';

const MenuItem = Menu.Item;

@injectIntl
@connect(state => ({
  enabledmods: state.account.modules,
}))
export default class ModuleMenu extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    enabledmods: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedKeys: [],
  }
  componentWillMount() {
    if (this.context.router.location) {
      const { pathname } = this.context.router.location;
      for (let i = 0; i < this.props.enabledmods.length; i++) {
        const mod = this.props.enabledmods[i];
        const emod = DEFAULT_MODULES[mod.id];
        if (pathname.indexOf(emod.url) === 0) {
          this.setState({ selectedKeys: [mod.id] });
          break;
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.context.router.location) {
      const { pathname } = this.context.router.location;
      for (let i = 0; i < nextProps.enabledmods.length; i++) {
        const mod = nextProps.enabledmods[i];
        const emod = DEFAULT_MODULES[mod.id];
        if (pathname.indexOf(emod.url) === 0) {
          this.setState({ selectedKeys: [mod.id] });
          break;
        }
      }
    }
  }
  msg = formatMsg(this.props.intl)
  handleMenuSelect = ({ selectedKeys }) => {
    this.setState({ selectedKeys });
  }
  render() {
    const { selectedKeys } = this.state;
    return (
      <Menu
        selectedKeys={selectedKeys}
        onSelect={this.handleMenuSelect}
      >
        {
          this.props.enabledmods.map((mod) => {
            const emod = DEFAULT_MODULES[mod.id];
            return (
              <MenuItem key={mod.id}>
                <NavLink to={`${emod.url}/`}>
                  <LogixIcon type={`icon-${emod.cls}`} />
                  {this.msg(emod.text)}
                </NavLink>
              </MenuItem>
            );
          })
        }
      </Menu>);
  }
}
