import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, Icon, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { loadAudits, confirmAudits, redoAudits } from 'common/reducers/bssAudit';
import { toggleInvoiceModal } from 'common/reducers/bssInvoice';
import SearchBox from 'client/components/SearchBox';
import InvoiceModal from '../invoice/modal/invoiceModal';
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
    loadAudits, confirmAudits, redoAudits, toggleInvoiceModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssReceivable',
})
export default class ShipmentTable extends React.Component {
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
    title: '状态',
    width: 80,
    dataIndex: 'status',
    align: 'center',
    filters: [{
      text: '正常',
      value: 'open',
    }, {
      text: '冻结',
      value: 'blocked',
    }, {
      text: '争议',
      value: 'disputed',
    }, {
      text: '已核销',
      value: 'cleared',
    }],
  }, {
    title: '账单',
    // dataIndex: 'bill_no',
    dataIndex: 'cust_order_no',
    width: 80,
    align: 'center',
    render: o => o && <Icon type="check" />,
    filters: [{
      text: '未入账单',
      value: 'pending',
    }, {
      text: '已入账单',
      value: 'billed',
    }],
  }, {
    title: '开票',
    dataIndex: 'invoice_no',
    width: 80,
    align: 'center',
    render: o => o && <Icon type="check" />,
    filters: [{
      text: '未开票',
      value: 'pending',
    }, {
      text: '已开票',
      value: 'invoiced',
    }],
  }, {
    title: '收款',
    dataIndex: 'payment_no',
    width: 80,
    align: 'center',
    render: o => o && <Icon type="check" />,
    filters: [{
      text: '未支付',
      value: 'pending',
    }, {
      text: '已支付',
      value: 'paid',
    }],
  }, {
    title: '结算单号',
    dataIndex: 'batch_no',
    width: 120,
  }, {
    title: '客户',
    width: 150,
    dataIndex: 'owner_name',
  }, {
    title: '货运编号',
    dataIndex: 'sof_order_no',
    width: 180,
  }, {
    title: '流程',
    width: 150,
    dataIndex: 'flow_name',
  }, {
    title: '金额',
    dataIndex: 'receivable_amount',
    align: 'right',
    width: 120,
  }, {
    title: '币制',
    dataIndex: 'currency',
    width: 50,
  }, {
    title: '对应成本',
    dataIndex: 'payable_amount',
    align: 'right',
    width: 120,
  }, {
    title: '预计利润',
    dataIndex: 'profit_amount',
    align: 'right',
    width: 120,
    render: o => ((o < 0) ? <span className="text-error">{o}</span> : o),
  }, {
    title: '毛利率%',
    dataIndex: 'gross_profit_ratio',
    align: 'right',
    width: 100,
    render: (o) => {
      if (o) {
        return o < 0 ? <span className="text-error">{o.toFixed(1)}</span> : o.toFixed(1);
      }
      return null;
    },
  }, {
    title: '订单日期',
    dataIndex: 'order_date',
    width: 120,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '结单日期',
    dataIndex: 'settled_date',
    width: 120,
    render: recdate => recdate && moment(recdate).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 90,
    render: (o, record) => {
      if (record.status === 1) {
        return (<span>
          <RowAction icon="stop" onClick={this.handleConfirm} tooltip={this.msg('block')} row={record} />
          <RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />
        </span>);
      } else if (record.status === 2) {
        return (<span>
          <RowAction icon="close-circle-o" onClick={this.handleReturn} tooltip={this.msg('return')} row={record} />
          <RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />
        </span>);
      }
      return (<RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />);
    },
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
  handleClientSelectChange = (ev) => {
    const filters = { ...this.props.listFilter, clientPid: ev.key };
    this.handleAuditsLoad(1, filters);
  }
  handleInvoiceRequest = () => {
    this.props.toggleInvoiceModal(true, {});
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
      <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>加入账单</Button>
      <Button icon="check-circle-o" onClick={this.handleInvoiceRequest}>申请开票</Button>
    </span>);
    return [
      <DataTable
        toolbarActions={toolbarActions}
        toolbarExtra={<Button icon="security-scan">审计</Button>}
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
      <InvoiceModal mode="output" action="request" reload={this.handleBillsLoad} key="requestmodal" />,
    ];
  }
}
