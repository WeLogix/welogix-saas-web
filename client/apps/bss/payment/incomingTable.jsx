import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { togglePaymentReceiptModal } from 'common/reducers/bssPayment';
import PaymentReceiptModal from './modal/paymentReceiptModal';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    incomingList: state.bssPayment.incomingList,
    listFilter: state.bssPayment.incomingListFilter,
    loading: state.bssPayment.incomingList.loading,
  }),
  {
    togglePaymentReceiptModal,
  }
)
export default class IncomingTable extends React.Component {
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
    // this.handleAuditsLoad(1);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '收款单号',
    dataIndex: 'sof_order_no',
    width: 150,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: '状态',
    width: 120,
    dataIndex: 'status', // 待认领 已认领 已过账
  }, {
    title: '往来单位',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '收款金额',
    width: 150,
    dataIndex: 'profit_amount',
  }, {
    title: '收款银行账号',
    dataIndex: 'payment_type',
    align: 'right',
    width: 150,
  }, {
    title: '收款时间',
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
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (<span>
      <RowAction icon="pay-circle" onClick={this.handleReceive} label={this.msg('pay')} row={record} />
    </span>),

  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadAudits(params),
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
    remotes: this.props.incomingList,
  })

  handleAuditsLoad = (currentPage, filter) => {
    const { listFilter, incomingList: { pageSize, current } } = this.props;
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

  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleAuditsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleAuditsLoad(1, filter);
  }
  handleReceive = () => {
    this.props.togglePaymentReceiptModal(true, 'confirm');
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { incomingList, loading } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = incomingList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = status === 'submitted' && (<span>
      <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>付款申请</Button>
    </span>);
    return [
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
        key="datatable"
      />,
      <PaymentReceiptModal key="modal" />,
    ];
  }
}
