import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Layout, Menu } from 'antd';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import ToolbarAction from 'client/components/ToolbarAction';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { toggleSettlementModal, setSettleListFilter } from 'common/reducers/bssSettlement';
import { formatMsg } from './message.i18n';
import SettlementTable from './settlementTable';
import LineItemTable from './lineItemTable';
import ShipmentTable from './shipmentTable';
import ClearingTable from './clearingTable';
import TransferTable from '../common/transferTable';
import SettlementModal from './modal/settlementModal';


@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    listFilter: state.bssSettlement.listFilter,
    loading: state.bssSettlement.loading,
  }),
  {
    loadPartners, toggleSettlementModal, setSettleListFilter,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssPayable',
})
export default class PayableLineItems extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    view: 'settlement',
  }
  componentDidMount() {
    this.props.loadPartners({ role: PARTNER_ROLES.VEN });
  }
  msg = formatMsg(this.props.intl)

  handleViewMenuClick = (ev) => {
    this.setState({ view: ev.key });
  }
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.props.setSettleListFilter(filter);
  }
  handleCreate = () => {
    // this.context.router.push('/bss/payable/create');
    this.props.toggleSettlementModal(true);
  }
  render() {
    const { status } = this.props.listFilter;
    const { view } = this.state;
    const dropdownMenuItems = [
      {
        elementKey: 'gStatus',
        title: '结算状态',
        elements: [
          { elementKey: 'open', name: this.msg('未核销') },
          { elementKey: 'cleared', name: this.msg('已核销') },
        ],
      },
    ];
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          showCollab={false}
          extra={
            <Menu mode="horizontal" selectedKeys={[view]} onClick={this.handleViewMenuClick}>
              <Menu.Item key="settlement">{this.msg('payableSettlement')}</Menu.Item>
              <Menu.Item key="payableItems">{this.msg('payableItems')}</Menu.Item>
              <Menu.Item key="transfer">代收代付</Menu.Item>
              <Menu.Item key="shipment">货运汇总表</Menu.Item>
              <Menu.Item key="order" disabled>
                订单汇总表
              </Menu.Item>
              <Menu.Item key="clearing">{this.msg('clearing')}</Menu.Item>
            </Menu>
          }
        >
          <PageHeader.Actions>
            <ToolbarAction
              primary
              icon="plus"
              onClick={this.handleCreate}
              label={this.msg('createSettlement')}
            />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          {view === 'settlement' && <SettlementTable />}
          {view === 'payableItems' && <LineItemTable />}
          {view === 'transfer' && <TransferTable />}
          {view === 'shipment' && <ShipmentTable />}
          {view === 'clearing' && <ClearingTable />}
        </PageContent>
        <SettlementModal />
      </Layout>
    );
  }
}
