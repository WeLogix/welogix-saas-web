import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Select, message, Tag } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import Summary from 'client/components/Summary';
import UserAvatar from 'client/components/UserAvatar';
import { BSS_BILL_TYPE, PARTNER_ROLES, BSS_BILL_STATUS } from 'common/constants';
import { loadBills, loadBillStatistics, sendBill, deleteBills, writeOffBill, recallBill, toggleReconcileModal } from 'common/reducers/bssBill';
import BillTypeTag from '../common/billTypeTag';
import ReconcileModal from '../modals/reconcileModal';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

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
    toggleReconcileModal,
  }
)
export default class VendorBills extends React.Component {
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
    this.handleBillsLoad(1, { clientPid: 'all', status: 'all', bill_type: 'sellerBill' });
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
      showTotal: total => `??? ${total} ???`,
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
    remotes: this.props.billlist,
  });
  columns = [{
    title: '????????????',
    dataIndex: 'bill_title',
    width: 200,
  }, {
    title: '????????????',
    dataIndex: 'order_begin_date',
    width: 100,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '????????????',
    dataIndex: 'order_end_date',
    width: 100,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: '?????????',
    width: 150,
    dataIndex: 'seller_name',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'flow_name',
  }, {
    title: '??????',
    dataIndex: 'bill_status',
    width: 80,
    align: 'center',
    render: (o) => {
      const status = Object.values(BSS_BILL_STATUS).filter(st => st.value === o)[0];
      const text = status ? status.text : o;
      return <Tag>{text}</Tag>;
    },
  }, {
    title: '????????????',
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
    title: '????????????',
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
    title: '???????????????',
    dataIndex: 'invoiced_amount',
    width: 150,
    align: 'right',
  }, {
    title: '???????????????',
    dataIndex: 'non_writtenoff_amount',
    width: 150,
    align: 'right',
  }, {
    title: '????????????',
    dataIndex: 'order_count',
    width: 100,
    align: 'center',
  }, {
    title: '????????????',
    dataIndex: 'bill_type',
    width: 100,
    render: o => <BillTypeTag billType={o} msg={this.msg} />,
  }, {
    title: '???????????????',
    dataIndex: 'last_updated_by',
    width: 80,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '??????????????????',
    dataIndex: 'last_updated_date',
    width: 150,
    render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
    sorter: (a, b) => new Date(a.received_date).getTime() - new Date(b.received_date).getTime(),
  }, {
    title: '?????????',
    dataIndex: 'created_by',
    width: 80,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '????????????',
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
        if (record.bill_type === BSS_BILL_TYPE.BPB.key) {
          return [
            <RowAction icon="swap" onClick={this.handleCheck} label="??????" row={record} key="check" />,
            <RowAction icon="rollback" onClick={this.handleWithdraw} tooltip="??????" row={record} key="withdraw" />,
          ];
        } else if (record.bill_type === BSS_BILL_TYPE.IPB.key) {
          return [
            <RowAction icon="swap" onClick={this.handleCheck} label="??????" row={record} key="check" />,
            <RowAction onDelete={this.handleDelete} row={record} key="delete" />,
          ];
        }
        return [
          <RowAction icon="eye-o" onClick={this.handleDetail} label={this.msg('view')} row={record} key="view" />,
          <RowAction onDelete={this.handleDelete} row={record} key="delete" />,
        ];
      } else if (record.bill_status >= BSS_BILL_STATUS.INVOICING.value) {
        return <RowAction icon="eye-o" onClick={this.handleDetail} label={this.msg('view')} row={record} />;
      }
      return null;
    },
  }]
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
  handleDelete = (row) => {
    this.props.deleteBills([row.bill_no]).then((result) => {
      if (!result.error) {
        this.handleBillsLoad(1);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/bss/bill/vendor/${row.bill_no}`;
    this.context.router.push(link);
  }
  handleCheck = (row) => {
    const link = `/bss/bill/vendor/reconcile/${row.bill_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      loading, billlist, billStat,
    } = this.props;
    this.dataSource.remotes = billlist;
    const partners = this.props.partners.filter(pt => pt.role === PARTNER_ROLES.VEN);
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <Select
        showSearch
        placeholder="?????????"
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">???????????????</Option>
        {partners.map(data => (
          <Option key={String(data.id)} value={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
          </Option>))
        }
      </Select>
      <RangePicker
        ranges={{ ??????: [moment(), moment()], ??????: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const totCol = (
      <Summary>
        <Summary.Item label="??????????????????">{(billStat.init_account_amount + billStat.init_other_amount).toFixed(2)}</Summary.Item>
        <Summary.Item label="??????????????????">{(billStat.account_amount + billStat.other_amount).toFixed(2)}</Summary.Item>
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
      <ReconcileModal reload={this.handleBillsLoad} key="reconcilemodal" />,
    ];
  }
}
