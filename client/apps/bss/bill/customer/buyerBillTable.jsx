import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Select, Modal, message, Tag } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import Summary from 'client/components/Summary';
import { PARTNER_ROLES, BSS_BILL_TYPE, BSS_BILL_STATUS } from 'common/constants';
import { loadBills, loadBillStatistics, sendBill, deleteBills, writeOffBill, recallBill, toggleReconcileModal } from 'common/reducers/bssBill';
import { toggleInvoiceModal } from 'common/reducers/bssInvoice';
import InvoiceModal from '../../invoice/modal/invoiceModal';
import ReconcileModal from '../modals/reconcileModal';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    billlist: state.bssBill.billlist,
    listFilter: state.bssBill.listFilter,
    loading: state.bssBill.loading,
    partners: state.partner.partners,
    billReload: state.bssBill.billReload,
    billStat: state.bssBill.billStat,
  }),
  {
    loadBills,
    loadBillStatistics,
    sendBill,
    deleteBills,
    writeOffBill,
    recallBill,
    toggleInvoiceModal,
    toggleReconcileModal,
  }
)
export default class BuyerBills extends React.Component {
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
    this.handleBillsLoad(1, { clientPid: 'all', status: 'all', bill_type: 'buyerBill' });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billReload) {
      this.handleBillsLoad(1, nextProps.listFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBills(params),
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
        bill_type: 'buyerBill',
      };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.billlist,
  });
  columns = [{
    title: '客户',
    width: 150,
    dataIndex: 'buyer_name',
  }, {
    title: '业务流程',
    width: 100,
    dataIndex: 'flow_name',
  }, {
    title: '账单开始日',
    dataIndex: 'order_start_date',
    width: 100,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '账单结束日',
    dataIndex: 'order_end_date',
    width: 100,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '状态',
    dataIndex: 'bill_status',
    width: 80,
    align: 'center',
    render: (o) => {
      const status = Object.values(BSS_BILL_STATUS).filter(st => st.value === o)[0];
      const text = status ? status.text : o;
      return <Tag>{text}</Tag>;
    },
  }, {
    title: '行项目数',
    dataIndex: 'order_count',
    width: 100,
    align: 'center',
  }, {
    title: '账单金额',
    dataIndex: 'total_amount',
    width: 150,
    align: 'right',
    render: (o, record) => {
      if (record.bill_status > 2) {
        return record.account_amount + record.other_amount;
      }
      return record.init_account_amount + record.init_other_amount;
    },
  }, {
    title: '争议金额',
    dataIndex: 'adjusted_amount',
    width: 150,
    align: 'right',
    render: (o, record) => {
      if ((record.account_amount + record.other_amount)) {
        return (record.account_amount + record.other_amount) -
        (record.init_account_amount + record.init_other_amount);
      }
      return '--';
    },
  }, {
    title: '已开票金额',
    dataIndex: 'invoiced_amount',
    width: 150,
    align: 'right',
  }, {
    title: '最后更新时间',
    dataIndex: 'last_updated_date',
    width: 150,
    render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
    sorter: (a, b) => new Date(a.received_date).getTime() - new Date(b.received_date).getTime(),
  }, {
    title: '创建日期',
    dataIndex: 'created_date',
    width: 120,
    render: createdate => createdate && moment(createdate).format('MM.DD HH:mm'),
    sorter: (a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    fixed: 'right',
    className: 'table-col-ops',
    width: 130,
    render: (o, record) => {
      if (record.bill_status === BSS_BILL_STATUS.DRAFT.value) {
        return [
          <RowAction icon="play-circle" onClick={this.handleSendEmail} label={this.msg('release')} row={record} key="release" />,
          <RowAction onEdit={this.handleDetail} onDelete={this.handleDelete} row={record} key="detail" />,
        ];
      } else if (record.bill_status === BSS_BILL_STATUS.RECONCILING.value) {
        if (record.bill_type === BSS_BILL_TYPE.FPB.key) {
          return [
            <RowAction icon="swap" onClick={this.handleCheck} label="对账" row={record} key="check" />,
            <RowAction icon="rollback" onClick={this.handleWithdraw} tooltip="撤回" row={record} key="withdraw" />,
          ];
        } else if (record.bill_type === BSS_BILL_TYPE.IPB.key) {
          return [
            <RowAction icon="swap" onClick={this.handleCheck} label="对账" row={record} key="check" />,
            <RowAction onDelete={this.handleDelete} row={record} key="delete" />,
          ];
        }
        return [
          <RowAction icon="eye-o" onClick={this.handleDetail} label={this.msg('view')} row={record} key="view" />,
          <RowAction onDelete={this.handleDelete} row={record} key="delete" />,
        ];
      } else if (record.bill_status >= BSS_BILL_STATUS.INVOICING.value) {
        return [<RowAction icon="eye-o" onClick={this.handleDetail} label={this.msg('view')} row={record} key="view" />,
          <RowAction icon="red-envelope" onClick={this.handleInvoiceRequest} label="开票" row={record} key="invoice" />,
        ];
      }
      /*
      const overlay = (<Menu onClick={({ key }) => this.handleMenuClick(key, record)}>
        <Menu.Item key="edit">{this.msg('edit')}</Menu.Item>
        <Menu.Item key="delete">{this.msg('delete')}</Menu.Item>
      </Menu>);
      if (record.bill_type === BSS_BILL_TYPE.OFB.key) {
        if (record.bill_status === 1) {
          return (<span>
            <RowAction icon="share-alt" onClick={this.handleSendEmail} label="转发" row={record} />
            <RowAction overlay={overlay} />
          </span>);
        } else if (record.bill_status === 2) {
          return (<span>
            <RowAction icon="swap" onClick={this.handleCheck} label="对账" row={record} />
            <RowAction icon="mail" onClick={this.handleSendEmail} tooltip="发送账单" row={record} />
          </span>);
        } else if (record.bill_status === 4) {
          return (<span>
            {record.noninvoice_amount > 0 &&
            <RowAction icon="red-envelope"
            onClick={this.handleInvoiceRequest} label="开票" row={record} />}
            <RowAction icon="eye-o" onClick={this.handleDetail} tooltip="查看" row={record} />
          </span>);
        }
      } else if (record.bill_status === 1) {
        return (<span>
          <RowAction icon="mail" onClick={this.handleSend} label="发送" row={record} />
          <RowAction overlay={overlay} />
        </span>);
      } else if (record.bill_status === 2) {
        return (<span>
          <RowAction icon="swap" onClick={this.handleCheck} label="对账" row={record} />
          <RowAction icon="mail"
          onClick={this.handleSwitchReconcileType} tooltip="修改对账方式" row={record} />
        </span>);
      } else if (record.bill_status === 3) {
        return (<RowAction icon="close" onClick={this.handleRecall} label="撤销" row={record} />);
      } else if (record.bill_status === 4 && record.tenant_id === this.props.tenantId) {
        return (<span>
          {record.noninvoice_amount > 0 &&
          <RowAction icon="red-envelope"
          onClick={this.handleInvoiceRequest} label="开票" row={record} />}
          <RowAction icon="eye-o" onClick={this.handleDetail} tooltip="查看" row={record} />
        </span>);
      } else {
        return <RowAction icon="eye-o" onClick={this.handleDetail} tooltip="查看" row={record} />;
      }
      */
      return null;
    },
  }]
  handleInvoiceRequest = (row) => {
    this.props.toggleInvoiceModal(true, {
      bill_no: row.bill_no,
      buyer_name: row.buyer_name,
      bill_title: row.bill_title,
      account_amount: row.account_amount,
      other_amount: row.other_amount,
      noninvoice_amount: row.noninvoice_amount,
      invoicing_amount: row.invoicing_amount,
      invoiced_amount: row.invoiced_amount,
    });
  }
  handleRecall = (row) => {
    this.props.recallBill({ bill_no: row.bill_no }).then((result) => {
      if (!result.error) {
        this.handleBillsLoad(1);
      }
    });
  }
  handleWriteOff = (row) => {
    this.props.writeOffBill({ bill_no: row.bill_no }).then((result) => {
      if (!result.error) {
        this.handleBillsLoad(1);
      }
    });
  }
  handleBillsLoad = (currentPage, filter) => {
    const { listFilter, billlist: { pageSize, current } } = this.props;
    const filters = filter || listFilter;
    this.props.loadBillStatistics({ filter: JSON.stringify(filters) });
    this.props.loadBills({
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
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleBillsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleBillsLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filter = { ...this.props.listFilter, clientPid: value };
    this.handleBillsLoad(1, filter);
  }
  handleSend = (row) => {
    this.props.toggleReconcileModal(true, { billType: row.bill_type, billNo: row.bill_no });
  }
  handleSendEmail = (row) => {
    // todo: send email
    this.props.toggleReconcileModal(
      true,
      {
        billType: row.bill_type,
        billNo: row.bill_no,
      }
    );
  }
  handleSwitchReconcileType = (row) => {
    this.props.toggleReconcileModal(
      true,
      {
        billType: row.bill_type,
        billNo: row.bill_no,
        reconcileType: row.reconcile_type,
      }
    );
  }
  handleMenuClick = (key, row) => {
    if (key === 'edit') {
      this.handleDetail(row);
    } else if (key === 'delete') {
      const self = this;
      confirm({
        title: this.msg('deleteConfirm'),
        onOk() {
          self.handleDelete(row);
        },
        onCancel() {},
      });
    }
  }
  handleDelete = (row) => {
    this.props.deleteBills([row.bill_no]).then((result) => {
      if (!result.error) {
        this.handleBillsLoad(1);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/bss/bill/customer/${row.bill_no}`;
    this.context.router.push(link);
  }
  handleCheck = (row) => {
    const link = `/bss/bill/customer/reconcile/${row.bill_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      loading, billlist, billStat,
    } = this.props;
    const partners = this.props.partners.filter(pt => pt.role === PARTNER_ROLES.CUS);
    this.dataSource.remotes = billlist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox
        value={this.props.listFilter.searchText}
        placeholder={this.msg('searchTips')}
        onSearch={this.handleSearch}
      />
      <Select
        showSearch
        placeholder="客户"
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部客户</Option>
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
        <Summary.Item label="账单金额合计">{(billStat.init_account_amount + billStat.init_other_amount).toFixed(2)}</Summary.Item>
        <Summary.Item label="确认金额合计">{(billStat.account_amount + billStat.other_amount).toFixed(2)}</Summary.Item>
      </Summary>
    );
    return [
      <DataTable
        toolbarActions={toolbarActions}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        columns={this.columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="bill_no"
        loading={loading}
        total={totCol}
        key="table"
      />,
      <InvoiceModal mode="output" action="request" reload={this.handleBillsLoad} key="requestmodal" />,
      <ReconcileModal reload={this.handleBillsLoad} key="reconcilemodal" />,
    ];
  }
}
