import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Ellipsis } from 'ant-design-pro';
import ListContentLayout from 'client/components/ListContentLayout';
import { selectCargoOwner, saveEditPermission } from 'common/reducers/cwmShFtz';
import { SHFTZ_ENTRY_MENU, SHFTZ_EXIT_MENU, SHFTZ_TRANSFER_MENU, SHFTZ_STOCK_MENU } from 'common/constants';
import WhseSelect from '../../common/whseSelect';
import { formatMsg } from './message.i18n';


@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    whses: state.cwmContext.whses,
    whse: state.cwmContext.defaultWhse,
    listFilter: state.cwmShFtz.listFilter,
    owners: state.cwmContext.whseAttrs.owners,
    navTitle: state.navbar.navTitle,
  }),
  { selectCargoOwner, saveEditPermission }
)
export default class SHFTZWrapper extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    menuStack: [[]],
    currentKey: 'bondedEntry',
    owners: this.props.owners.filter(owner => owner.portion_enabled),
  }
  componentWillMount() {
    const menuLinks = SHFTZ_ENTRY_MENU.children.concat(SHFTZ_EXIT_MENU.children)
      .concat(SHFTZ_TRANSFER_MENU.children).concat(SHFTZ_STOCK_MENU.children);
    this.setState({ menuLinks });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.owners !== this.props.owners) {
      const owners = nextProps.owners.filter(owner => owner.portion_enabled);
      this.setState({ owners });
    }
    this.initSasblMenus();
  }
  msg = formatMsg(this.props.intl);
  initSasblMenus() {
    const menuStack = [[]];
    const cargoMenu = {
      key: 'cargo',
      title: this.msg('ftzCargoReg'),
      icon: 'gold',
      children: [
        {
          key: 'cargoReg',
          title: this.msg('ftzBondedEntryReg'),
          type: 'table',
          columns: [{
            dataIndex: 'name',
            key: 'code',
            render: (o, record) =>
              (<span>
                <div>{record.customs_code}</div>
                <Ellipsis length={14}>{record.name}</Ellipsis>
              </span>),
          }],
          dataSource: this.state.owners,
          onRowClick: row => this.handleRowClick(row),
        },
      ],
    };
    menuStack[0].push(
      SHFTZ_ENTRY_MENU,
      SHFTZ_EXIT_MENU,
      SHFTZ_TRANSFER_MENU,
      SHFTZ_STOCK_MENU,
      cargoMenu,
    );
    this.setState({ menuStack });
  }
  handleWhseChange = () => {
    this.context.router.push('/cwm/supervision/shftz/entry');
  }
  handleRowClick = (row) => {
    this.props.selectCargoOwner(row);
    this.context.router.push('/cwm/supervision/shftz/cargo');
  }
  handleMenuClick = (ev) => {
    const currentMenu = this.state.menuLinks.find(menu => menu.key === ev.key);
    if (currentMenu) {
      this.setState({
        currentKey: currentMenu.key,
      });
      this.context.router.push(currentMenu.link);
    }
  }
  render() {
    // const filterOwners = this.props.owners.filter(item => item.portion_enabled);
    return (
      <ListContentLayout
        extra={<WhseSelect bonded onChange={this.handleWhseChange} disabled />}
        collapsed={this.props.navTitle.depth === 3}
        stack={this.state.menuStack}
        listWidth={200}
        onMenuClick={this.handleMenuClick}
        defaultSelectedKey={this.state.currentKey}
        defaultOpenKeys={['ENTRY', 'EXIT', 'TRANSFER']}
      >
        {this.props.children}
      </ListContentLayout>);
  }
}
