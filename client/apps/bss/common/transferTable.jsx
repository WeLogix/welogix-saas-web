import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
// import { LogixIcon } from 'client/components/FontIcon';
import { loadTransfer } from 'common/reducers/bssSettlement';
import SearchBox from 'client/components/SearchBox';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    transferList: state.bssSettlement.transferList,
    listFilter: state.bssSettlement.listFilter,
    loading: state.bssSettlement.loading,
    reload: state.bssSettlement.reload,
  }),
  {
    loadTransfer,
  }
)
export default class TransferTable extends React.Component {
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
    this.handleTransferLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.handleFeesLoad(1, nextProps.listFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('paymentStatus'),
    width: 100,
    dataIndex: 'status',
    align: 'center',
    filters: [{
      text: '未支付',
      value: 'unpaid',
    }, {
      text: '支付中',
      value: 'paying',
    }, {
      text: '已支付',
      value: 'paid',
    }],
  }, {
    title: '收款状态',
    width: 100,
    dataIndex: 'status',
    align: 'center',
    filters: [{
      text: '未支付',
      value: 'unpaid',
    }, {
      text: '支付中',
      value: 'paying',
    }, {
      text: '已支付',
      value: 'paid',
    }],
  }, {
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    width: 120,
  }, {
    title: this.msg('invoiceType'),
    dataIndex: 'invoice_type',
    width: 100,
  }, {
    title: '开票单位',
    width: 150,
    dataIndex: 'invoicing_party',
  }, {
    title: '票据抬头',
    width: 150,
    dataIndex: 'invoice_title',
  }, {
    title: '结算单位',
    width: 150,
    dataIndex: 'billing_party',
  }, {
    title: '费用名称',
    dataIndex: 'fee_name',
    width: 100,
  }, {
    title: '代付金额',
    dataIndex: 'receivable_amount',
    align: 'right',
    width: 120,
  }, {
    title: '加计税额',
    dataIndex: 'additional_tax',
    align: 'right',
    width: 120,
  }, {
    title: '代收金额',
    dataIndex: 'receivable_amount',
    align: 'right',
    width: 120,
  }, {
    title: '结算单据日期',
    dataIndex: 'order_date',
    width: 120,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '核销日期',
    dataIndex: 'settled_date',
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
    render: () => null,
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadTransfer(params),
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
      params.filter = filter;
      return params;
    },
    remotes: this.props.transferList,
  })

  handleTransferLoad = (currentPage, filter) => {
    const { listFilter, transferList: { pageSize, current } } = this.props;
    this.props.loadTransfer({
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
    this.handleTransferLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleTransferLoad(1, filter);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { transferList, loading } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = transferList;
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
        rowKey="sof_order_no"
        loading={loading}
      />

    );
  }
}
