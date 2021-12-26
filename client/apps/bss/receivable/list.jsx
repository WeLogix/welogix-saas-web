import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Icon, Layout, Menu, message } from 'antd';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import SidePanel from 'client/components/SidePanel';
import SearchBox from 'client/components/SearchBox';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { loadAudits, confirmAudits, redoAudits } from 'common/reducers/bssAudit';
import { formatMsg } from './message.i18n';
import LineItemTable from './lineItemTable';
import ShipmentTable from './shipmentTable';

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    auditslist: state.bssAudit.auditslist,
    listFilter: state.bssAudit.listFilter,
    loading: state.bssAudit.loading,
  }),
  {
    loadPartners, loadAudits, confirmAudits, redoAudits,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssReceivable',
})
export default class ReceivableList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    view: 'shipments',
    selectedRowKeys: [],
    selectedCustomer: null,
  }
  componentDidMount() {
    this.props.loadPartners({ role: PARTNER_ROLES.CUS });
    this.handleAuditsLoad(1);
  }
  msg = formatMsg(this.props.intl)

  handleAuditsLoad = (currentPage, filter) => {
    const { listFilter, auditslist: { pageSize, current } } = this.props;
    this.props.loadAudits({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
  }
  handleViewMenuClick = (ev) => {
    this.setState({ view: ev.key });
  }
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.handleAuditsLoad(1, filter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleAuditsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleAuditsLoad(1, filter);
  }
  handleCustomerFilter = (ev) => {
    const filters = { ...this.props.listFilter, clientPid: ev.key };
    if (ev.key === 'all') {
      this.setState({ selectedCustomer: null });
    } else {
      this.setState({ selectedCustomer: ev.key });
    }
    this.handleAuditsLoad(1, filters);
  }
  handleConfirmAudits = (sofOrderNos) => {
    this.props.confirmAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleConfirm = (row) => {
    const sofOrderNos = [row.sof_order_no];
    this.handleConfirmAudits(sofOrderNos);
  }
  handleBatchConfirm = () => {
    const sofOrderNos = this.state.selectedRowKeys;
    this.handleConfirmAudits(sofOrderNos);
  }
  handleAllConfirm = () => {
    const sofOrderNos = null;
    this.handleConfirmAudits(sofOrderNos);
  }
  handleReturn = (row) => {
    this.props.redoAudits([row.sof_order_no]).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleBatchReturn = () => {
    const sofOrderNos = this.state.selectedRowKeys;
    this.props.redoAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/bss/receivable/${row.sof_order_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { partners } = this.props;
    const { status } = this.props.listFilter;
    const { view } = this.state;
    const dropdownMenuItems = [
      {
        elementKey: 'gStatus',
        title: '结算状态',
        elements: [
          { elementKey: 'all', name: this.msg('全部项') },
          { elementKey: 'submitted', name: this.msg('未清项') },
          { elementKey: 'confirmed', name: this.msg('已清项') },
        ],
      },
      {
        elementKey: 'gException',
        title: '异常处理',
        elements: [
          { elementKey: 'blocked', name: this.msg('冻结') },
          { elementKey: 'disputed', name: this.msg('争议') },
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
          showScope={false}
          showCollab={false}
          extra={<Menu
            mode="horizontal"
            selectedKeys={[view]}
            onClick={this.handleViewMenuClick}
          >
            <Menu.Item key="shipments">按货运汇总</Menu.Item>
            <Menu.Item key="orders" disabled>按销售订单汇总</Menu.Item>
            <Menu.Item key="items">结算明细项</Menu.Item>
          </Menu>}
        />
        <Layout>
          <SidePanel width={280}>
            <SearchBox
              placeholder={this.msg('')}
              size="large"
              borderless
              onSearch={this.handleSearch}
            />
            <Menu
              selectedKeys={[this.state.selectedCustomer]}
              mode="inline"
              onClick={this.handleCustomerFilter}
              style={{ marginBottom: 0 }}
            >
              {this.state.selectedCustomer &&
                <Menu.Item key="all" className=""><Icon type="rollback" style={{ color: '#1890ff' }} /> 取消选择客户</Menu.Item>}
              {partners.map(data => (
                <Menu.Item key={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
                </Menu.Item>))
              }
            </Menu>
          </SidePanel>
          <PageContent>
            {view === 'items' && <LineItemTable />}
            {view === 'shipments' && <ShipmentTable />}
          </PageContent>
        </Layout>
      </Layout>
    );
  }
}
