import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, Layout, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import PageContent from 'client/components/PageContent';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import SearchBox from 'client/components/SearchBox';
import { togglePaymentReceiptModal, loadPayments } from 'common/reducers/bssPayment';
import PaymentReceiptModal from '../modal/paymentReceiptModal';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    claimList: state.bssPayment.claimList,
    listFilter: state.bssPayment.claimListFilter,
    loading: state.bssPayment.claimList.loading,
  }),
  {
    togglePaymentReceiptModal, loadPayments,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssClaimPayment',
})
export default class ClaimPaymentList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '收款单号',
    dataIndex: 'sof_order_no',
    width: 150,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: '往来单位',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '收款金额',
    width: 150,
    dataIndex: 'profit_amount',
  }, {
    title: '未核销金额',
    width: 150,
    dataIndex: 'profit_amount',
  }, {
    title: '收款日期',
    dataIndex: 'payable_amount',
    align: 'right',
    width: 150,
  }, {
    title: '认领人',
    dataIndex: 'applied_by',
    width: 150,
  }, {
    title: '认领时间',
    dataIndex: 'apply_date',
    width: 120,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '状态',
    width: 150,
    dataIndex: 'approval_status',
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (<span>
      <RowAction icon="check-circle-o" onClick={this.handleClaim} label={this.msg('claim')} row={record} />
    </span>),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadPayments(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      const filter = {
        ...this.props.listFilter,
      };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.claimList,
  })

  handleAuditsLoad = (currentPage, filter) => {
    const { listFilter, claimList: { pageSize, current } } = this.props;
    this.props.loadPayments({
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
  handleFilterMenuClick = (ev) => {
    const filter = { ...this.props.listFilter, status: ev.key };
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
  handleClientSelectChange = (value) => {
    const filters = { ...this.props.listFilter, clientPid: value };
    this.handleAuditsLoad(1, filters);
  }

  handleClaim = () => {
    this.props.togglePaymentReceiptModal(true);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { claimList, loading, partners } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = claimList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部</Option>
        {partners.map(data => (
          <Option key={String(data.id)} value={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
          </Option>))
        }
      </Select>
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = (<span>
      {(status === 'submitted') && <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>批量确认</Button>}
      {(status === 'confirmed') && <Button icon="close-circle-o" onClick={this.handleBatchReturn}>取消确认</Button>}
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'pending', icon: 'upload', name: this.msg('待认领') },
      { elementKey: 'claimed', icon: 'file', name: this.msg('已认领') },
      { elementKey: 'cleared', icon: 'check-square-o', name: this.msg('已核销') },
    ];
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showScope={false} showCollab={false} />
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            rowKey="sof_order_no"
            loading={loading}
          />
        </PageContent>
        <PaymentReceiptModal />
      </Layout>
    );
  }
}
