import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
// import { LogixIcon } from 'client/components/FontIcon';
import { loadBssFees } from 'common/reducers/bssSettlement';
import SearchBox from 'client/components/SearchBox';
import { BSS_FEE_TYPE } from 'common/constants';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    bssFeeList: state.bssSettlement.bssFeeList,
    listFilter: state.bssSettlement.listFilter,
    loading: state.bssSettlement.loading,
    reload: state.bssSettlement.reload,
  }),
  {
    loadBssFees,
  }
)
export default class LineItemTable extends React.Component {
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
    this.handleFeesLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.handleFeesLoad(1, nextProps.listFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('settlementNo'),
    dataIndex: 'settlement_no',
    width: 120,
  }, {
    title: this.msg('businessPartner'),
    width: 150,
    dataIndex: 'seller_name',
  }, {
    title: this.msg('expenseFeeCode'),
    dataIndex: 'fee_code',
    width: 150,
  }, {
    title: this.msg('expenseFeeName'),
    dataIndex: 'fee_name',
    width: 100,
  }, {
    title: this.msg('expenseFeeType'),
    dataIndex: 'fee_type',
    width: 100,
    render: (o) => {
      const type = BSS_FEE_TYPE.find(fe => fe.key === o);
      return type ? type.text : null;
    },
  }, {
    title: this.msg('amount'),
    dataIndex: 'base_amount',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('taxRate'),
    dataIndex: 'tax_rate',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('taxAmount'),
    dataIndex: 'tax',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('includedAmount'),
    dataIndex: 'sum_amount',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('sofOrderNo'),
    dataIndex: 'sof_order_no',
    width: 180,
  }, {
    title: this.msg('declEntryNo'),
    dataIndex: 'decl_entry_no',
    width: 180,
  }, {
    title: this.msg('voucherDate'),
    dataIndex: 'voucher_date',
    width: 120,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: this.msg('clearDate'),
    dataIndex: 'cleared_date',
    width: 120,
    render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 60,
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBssFees(params),
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
      params.filter = {
        ...this.props.listFilter,
      };
      return params;
    },
    remotes: this.props.bssFeeList,
  })

  handleFeesLoad = (currentPage, filter) => {
    const { listFilter, bssFeeList: { pageSize, current } } = this.props;
    this.props.loadBssFees({
      filter: filter || listFilter,
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
    this.handleFeesLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleFeesLoad(1, filter);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { bssFeeList, loading } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = bssFeeList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    return (
      <DataTable
        toolbarActions={toolbarActions}
        bulkActions={[]}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        columns={this.columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="id"
        loading={loading}
      />

    );
  }
}
