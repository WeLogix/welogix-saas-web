import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, Layout, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import UserAvatar from 'client/components/UserAvatar';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import {
  toggleCollectInvoiceModal, loadBillInvoices,
  toggleInvoiceModal,
} from 'common/reducers/bssInvoice';
import { toggleVoucherModal } from 'common/reducers/bssVoucher';
import SearchBox from 'client/components/SearchBox';
import InvoiceModal from '../modal/invoiceModal';
import VoucherModal from '../../voucher/modal/voucherModal';
import AccountSetSelect from '../../common/accountSetSelect';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    outputInvoiceList: state.bssInvoice.outputInvoiceList,
    listFilter: state.bssInvoice.outputListFilter,
    loading: state.bssInvoice.loading,
  }),
  {
    loadPartners,
    toggleCollectInvoiceModal,
    loadBillInvoices,
    toggleInvoiceModal,
    toggleVoucherModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssOutputInvoice',
})
export default class InvoicingList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    extraVisible: false,
  }
  componentDidMount() {
    this.props.loadPartners({ role: PARTNER_ROLES.CUS });
    this.handleBillInvoiceLoad(1);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('status'),
    dataIndex: 'status',
    width: 80,
  }, {
    title: this.msg('invoiceNo'),
    width: 120,
    dataIndex: 'invoice_no',
  }, {
    title: this.msg('voucherNo'),
    width: 120,
    dataIndex: 'voucher_no',
    render: o => <a onClick={this.handleVoucher}>{o}</a>,
  }, {
    title: this.msg('buyer'),
    width: 200,
    dataIndex: 'buyer',
  }, {
    title: this.msg('invoiceType'),
    width: 150,
    dataIndex: 'invoice_type',
    render: (o) => {
      if (o === 'VAT_S') {
        return '增值税专用发票';
      } else if (o === 'VAT_N') {
        return '增值税普通发票';
      }
      return '';
    },
  }, {
    title: this.msg('金额'),
    dataIndex: 'amount',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('taxRate'),
    dataIndex: 'tax_rate',
    align: 'right',
    width: 80,
  }, {
    title: this.msg('税额'),
    dataIndex: 'tax_amount',
    align: 'right',
    width: 150,
  }, {
    title: this.msg('价税合计'),
    dataIndex: 'total_invoice_amount',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('invoicedBy'),
    dataIndex: 'invoiced_by',
    width: 100,
    render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('invoicedDate'),
    dataIndex: 'invoiced_date',
    width: 120,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
  }, {
    title: this.msg('requestedBy'),
    dataIndex: 'requested_by',
    width: 100,
    render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('requestedDate'),
    dataIndex: 'requested_date',
    width: 120,
    render: recdate => recdate && moment(recdate).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => <RowAction icon="check-circle-o" onClick={this.handleConfirm} label={this.msg('confirm')} row={record} />,
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBillInvoices(params),
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
    remotes: this.props.outputInvoiceList,
  })
  handleVoucher = () => {
    this.props.toggleVoucherModal(true);
  }
  handleCollect = () => {
    this.props.toggleCollectInvoiceModal(true);
  }
  handleBillInvoiceLoad = (currentPage, filter) => {
    const { listFilter, outputInvoiceList: { pageSize, current } } = this.props;
    this.props.loadBillInvoices({
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
    this.handleBillInvoiceLoad(1, filter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleBillInvoiceLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleBillInvoiceLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filters = { ...this.props.listFilter, clientPid: value };
    this.handleBillInvoiceLoad(1, filters);
  }
  handleConfirmAudits = (sofOrderNos) => {
    this.props.confirmAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleBillInvoiceLoad(1);
      }
    });
  }
  handleConfirm = (row) => {
    this.props.toggleInvoiceModal(true, {
      bill_no: row.bill_no,
      id: row.id,
      invoice_amount: row.invoice_amount,
      buyer_name: row.buyer_name,
      invoice_type: row.invoice_type,
      total_invoice_amount: row.total_invoice_amount,
    });
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
    this.props.returnBillInvoice({
      id: row.id,
      invoiceAmount: row.invoice_amount,
      billNo: row.bill_no,
    }).then((result) => {
      if (!result.error) {
        this.handleBillInvoiceLoad();
      }
    });
  }
  handleBatchReturn = () => {
    const sofOrderNos = this.state.selectedRowKeys;
    this.props.redoAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleBillInvoiceLoad(1);
      }
    });
  }
  handleEdit = (row) => {
    this.props.toggleInvoiceEditModal(true, {
      id: row.id,
      bill_no: row.bill_no,
      invoice_amount: row.invoice_amount,
      invoice_type: row.invoice_type,
      tax_rate: row.tax_rate,
      tax_amount: row.tax_amount,
      total_invoice_amount: row.total_invoice_amount,
      tax_included: row.tax_included,
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  toggleExtra = () => {
    this.setState({ extraVisible: !this.state.extraVisible });
  }
  render() {
    const { outputInvoiceList, loading, partners } = this.props;
    const { status, clientPid } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = outputInvoiceList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        value={clientPid}
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
      { elementKey: 'applied', icon: 'upload', name: this.msg('开票申请') },
      { elementKey: 'invoiced', icon: 'file', name: this.msg('statusInvoiced') },
      { elementKey: 'paymentReceived', icon: 'check-square-o', name: this.msg('statusPaymentReceived') },
    ];
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[
            <AccountSetSelect onChange={this.handleWhseChange} />,
          ]}
          dropdownMenu={dropdownMenu}
          showScope={false}
          showCollab={false}
        />
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            rowKey="invoice_request_no"
            loading={loading}
          />
        </PageContent>
        <InvoiceModal mode="output" action="confirm" />
        <VoucherModal />
      </Layout>
    );
  }
}
