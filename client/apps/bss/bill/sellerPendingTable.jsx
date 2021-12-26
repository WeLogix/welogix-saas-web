import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { DatePicker, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import Summary from 'client/components/Summary';
import ToolbarAction from 'client/components/ToolbarAction';
import { PARTNER_ROLES } from 'common/constants';
import { loadBillableStatementStat } from 'common/reducers/bssStatement';
import { loadBillableStatements, toggleAddToDraftModal, toggleNewBillModal } from 'common/reducers/bssBill';
import CreateBillModal from './modals/createBillModal';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    orderStatementlist: state.bssBill.orderStatementlist,
    listFilter: state.bssBill.listFilter,
    loading: state.bssBill.loading,
    reload: state.bssBill.billReload,
    statementStat: state.bssStatement.statementStat,
    partners: state.partner.partners,
  }),
  {
    toggleAddToDraftModal,
    loadBillableStatements,
    loadBillableStatementStat,
    toggleNewBillModal,
  }
)
export default class SellerPendingTable extends React.Component {
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
    const filter = { ...this.props.listFilter, bill_type: 'sellerBill' };
    this.handleOrdersLoad(1, filter);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.handleOrdersLoad(1, nextProps.listFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '货运编号',
    dataIndex: 'sof_order_no',
    width: 150,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: '订单追踪号',
    width: 180,
    dataIndex: 'cust_order_no',
  }, {
    title: '服务商',
    dataIndex: 'vendor_name',
    width: 200,
  }, {
    title: '流程',
    width: 150,
    dataIndex: 'flow_name',
  }, {
    title: '应付金额',
    dataIndex: 'buyer_settled_amount',
    width: 150,
    align: 'right',
  }, {
    title: '订单日期',
    dataIndex: 'order_date',
    width: 120,
    render: ordate => ordate && moment(ordate).format('YYYY.MM.DD'),
  }, {
    title: '结单日期',
    dataIndex: 'settled_date',
    width: 120,
    render: ordate => ordate && moment(ordate).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 60,
    render: (o, record) => (<RowAction icon="folder-add" onClick={this.handleAddToDraft} tooltip={this.msg('加入草稿账单')} row={record} />),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBillableStatements(params),
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
        bill_type: 'sellerBill',
      };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.orderStatementlist,
  })
  handleOrdersLoad = (currentPage, filter) => {
    const { listFilter, orderStatementlist: { pageSize, current } } = this.props;
    const filters = filter || listFilter;
    this.props.loadBillableStatements({
      filter: JSON.stringify(filters),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
    this.props.loadBillableStatementStat({ filter: JSON.stringify(filters) });
  }
  addToDraft = (partnerId, statementsIds) => {
    this.props.toggleAddToDraftModal(true, partnerId, statementsIds);
  }
  handleAddToDraft = (row) => {
    this.addToDraft(row.owner_partner_id, [row.id]);
  }
  handleBatchAddToDraft = () => {
    const statementsIds = this.state.selectedRowKeys;
    const { clientPid } = this.props.listFilter;
    this.addToDraft(clientPid, statementsIds);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleOrdersLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleOrdersLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filters = { ...this.props.listFilter, clientPid: value };
    this.handleOrdersLoad(1, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleBatchCreate = () => {
    const { selectedRowKeys } = this.state;
    this.props.toggleNewBillModal(true, {
      statements: selectedRowKeys,
      byStatements: true,
    });
  }
  render() {
    const {
      loading, orderStatementlist, statementStat, listFilter,
    } = this.props;
    const partners = this.props.partners.filter(pt => pt.role === PARTNER_ROLES.VEN);
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = orderStatementlist;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('billableStatementSearchTips')} onSearch={this.handleSearch} />
      <Select
        showSearch
        placeholder="服务商"
        optionFilterProp="children"
        value={listFilter.clientPid}
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部服务商</Option>
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
    const totCol = (
      <Summary>
        <Summary.Item label="未入账单金额合计">{statementStat.total_amount}</Summary.Item>
      </Summary>
    );
    const bulkActions = (<span>
      {this.props.listFilter.clientPid !== 'all' &&
      <ToolbarAction primary icon="plus" onClick={this.handleBatchCreate} label={this.msg('addToNew')} />}
      {this.props.listFilter.clientPid !== 'all' &&
      <ToolbarAction icon="folder-add" onClick={this.handleBatchAddToDraft} label={this.msg('addToDraft')} />}
    </span>);
    return (
      <DataTable
        toolbarActions={toolbarActions}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        bulkActions={bulkActions}
        columns={this.columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="id"
        loading={loading}
        total={totCol}
      >
        <CreateBillModal />
      </DataTable>
    );
  }
}
