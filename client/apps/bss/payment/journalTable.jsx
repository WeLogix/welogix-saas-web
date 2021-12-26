import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
// import { LogixIcon } from 'client/components/FontIcon';
import { loadAudits, confirmAudits, redoAudits } from 'common/reducers/bssAudit';
import SearchBox from 'client/components/SearchBox';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

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
    loadAudits, confirmAudits, redoAudits,
  }
)
export default class JournalTable extends React.Component {
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
    title: '收付款单号',
    dataIndex: 'payment_no',
    width: 150,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: '凭证字号',
    width: 150,
    dataIndex: 'voucher_no',
  }, {
    title: '日期',
    dataIndex: 'paid_date',
    width: 120,
    render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
  }, {
    title: '往来单位',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '收入金额',
    width: 150,
    dataIndex: 'income_amount',
  }, {
    title: '支出金额',
    dataIndex: 'expense_amount',
    align: 'right',
    width: 150,
  }, {
    title: '余额',
    dataIndex: 'balance_amount',
    align: 'right',
    width: 150,
  }, {
    dataIndex: 'SPACER_COL',
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
    remotes: this.props.auditslist,
  })

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

  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleAuditsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleAuditsLoad(1, filter);
  }
  handleDetail = (row) => {
    const link = `/bss/receivable/${row.sof_order_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { auditslist, loading } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = auditslist;
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
    return (
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

    );
  }
}
