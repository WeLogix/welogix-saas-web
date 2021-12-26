import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Layout, Form, Menu } from 'antd';
import { BSS_CUSTOMER_BILL_STATUS, PARTNER_ROLES, TENANT_ASPECT } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { toggleNewBillModal, reloadBillList } from 'common/reducers/bssBill';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import BuyerBillTable from './buyerBillTable';
import CreateBillModal from '../modals/createBillModal';
import AddToDraft from '../modals/addToDraftModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    aspect: state.account.aspect,
    listFilter: state.bssBill.listFilter,
    partners: state.partner.partners,
    allBillTemplates: state.bssBillTemplate.billTemplates,
    importPanelVisible: false,
  }),
  {
    toggleNewBillModal, loadPartners, reloadBillList,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssCustomerBill',
})
@Form.create()
export default class BillList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    view: 'pending',
  }
  componentDidMount() {
    if (this.props.aspect === TENANT_ASPECT.ENT) {
      this.props.loadPartners({ role: [PARTNER_ROLES.VEN] });
    } else {
      this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.VEN] });
    }
  }
  msg = formatMsg(this.props.intl)
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.props.reloadBillList(filter);
  }
  handleCreate = () => {
    this.props.toggleNewBillModal(true, { byStatements: false });
  }

  render() {
    const { listFilter } = this.props;
    const { view } = this.state;
    const dropdownMenu = {
      selectedMenuKey: listFilter.status || 'all',
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems: Object.keys(BSS_CUSTOMER_BILL_STATUS).map(st => ({
        elementKey: BSS_CUSTOMER_BILL_STATUS[st].key,
        icon: BSS_CUSTOMER_BILL_STATUS[st].icon,
        name: BSS_CUSTOMER_BILL_STATUS[st].text,
      })),
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          showCollab={false}
          extra={
            <Menu mode="horizontal" selectedKeys={[view]} onClick={this.handleViewMenuClick}>
              <Menu.Item key="pending">未出账单</Menu.Item>
              <Menu.Item key="released">
                已出账单
              </Menu.Item>
              <Menu.Item key="cleared">已核销账单</Menu.Item>
            </Menu>
          }
        >
          <PageHeader.Actions>
            <Button type="primary" icon="plus" onClick={this.handleCreate}>
              {this.msg('createBill')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <BuyerBillTable />
        </PageContent>
        <CreateBillModal />
        <AddToDraft />
      </Layout>
    );
  }
}
