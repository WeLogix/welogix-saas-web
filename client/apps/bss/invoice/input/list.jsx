import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, DatePicker, Layout, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES, BSS_INV_TYPE, BSS_PRESET_PAYEE } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { loadBillInvoices, toggleInvoiceModal, toggleCspInvoiceModal, confirmBillInvoice } from 'common/reducers/bssInvoice';
import { toggleVoucherModal } from 'common/reducers/bssVoucher';
import SearchBox from 'client/components/SearchBox';
import VoucherModal from '../../voucher/modal/voucherModal';
import InvoiceModal from '../modal/invoiceModal';
import CspInvoiceModal from '../modal/cspInvoiceModal';
import AccountSetSelect from '../../common/accountSetSelect';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    invoiceList: state.bssInvoice.invoiceList,
    listFilter: state.bssInvoice.listFilter,
    loading: state.bssInvoice.loading,
    reload: state.bssInvoice.reload,
    userMembers: state.account.userMembers,
    currentAccountSet: state.bssSetting.currentAccountSet,
  }),
  {
    loadPartners,
    loadBillInvoices,
    toggleVoucherModal,
    confirmBillInvoice,
    toggleInvoiceModal,
    toggleCspInvoiceModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssInputInvoice',
})
export default class InvoiceReceiptList extends React.Component {
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
    this.props.loadPartners({ role: [PARTNER_ROLES.VEN, PARTNER_ROLES.CUS] });
    this.handleBillInvoiceLoad(1, { ...this.props.listFilter, invCategory: 'input', accounting_set_id: this.props.currentAccountSet.id });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && !this.props.reload) {
      this.handleBillInvoiceLoad(1);
    }
    if (nextProps.currentAccountSet.id !== this.props.currentAccountSet.id) {
      this.handleBillInvoiceLoad(1, { ...this.props.listFilter, invCategory: 'input', accounting_set_id: nextProps.currentAccountSet.id });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('invoiceNo'),
    width: 150,
    dataIndex: 'invoice_no',
  }, {
    title: this.msg('voucherNo'),
    width: 150,
    dataIndex: 'voucher_no',
    render: o => <a onClick={this.handleVoucher}>{o}</a>,
  }, {
    title: this.msg('businessPartner'),
    width: 250,
    dataIndex: 'seller_name',
    render: (o) => {
      const presetPayee = BSS_PRESET_PAYEE.find(payee => payee.key === o);
      return presetPayee ? presetPayee.text : o;
    },
  }, {
    title: this.msg('invoiceType'),
    width: 150,
    dataIndex: 'invoice_type',
    render: (o) => {
      const invType = BSS_INV_TYPE.find(type => type.value === o);
      return invType ? invType.text : null;
    },
  }, {
    title: this.msg('invoiceDate'),
    dataIndex: 'invoice_date',
    width: 120,
    render: invoicedDate => invoicedDate && moment(invoicedDate).format('YYYY.MM.DD'),
  }, {
    title: this.msg('taxAmount'),
    dataIndex: 'tax_amount',
    align: 'right',
    width: 150,
  }, {
    title: this.msg('includedAmount'),
    dataIndex: 'invoice_amount',
    width: 120,
  }, {
    title: this.msg('confirmedBy'),
    dataIndex: 'invoice_confirm_by',
    width: 100,
    render: (o) => {
      const confirmedBy = this.props.userMembers.find(user => user.login_id === o);
      return confirmedBy ? confirmedBy.name : null;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (
      <span>
        {record.invoice_status <= 1 &&
        [<RowAction icon="edit" onClick={this.handleEdit} label={this.msg('edit')} row={record} />,
        record.invoice_confirm_by && <RowAction icon="check-circle-o" onClick={this.handleConfirm} label={this.msg('confirm')} row={record} />]}
      </span>
    ),
  }];;
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
    remotes: this.props.invoiceList,
  })
  handleVoucher = () => {
    this.props.toggleVoucherModal(true);
  }
  handleBillInvoiceLoad = (currentPage, filter) => {
    const { listFilter, invoiceList: { pageSize, current } } = this.props;
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
  handleConfirm = (row) => {
    if (row.invoice_type === BSS_INV_TYPE[2].value) {
      this.props.toggleCspInvoiceModal(true, {
        id: row.id,
        invoice_no: row.invoice_no,
        invoice_date: row.invoice_date,
        tax_amount: row.tax_amount,
        seller_name: row.seller_name,
      });
    } else {
      this.props.toggleInvoiceModal(true, 'confirm', {
        id: row.id,
        tax_amount: row.tax_amount,
        invoice_type: row.invoice_type,
        invoice_amount: row.invoice_amount,
        buyer_partner_id: row.buyer_partner_id,
        invoice_date: row.invoice_date,
        invoice_no: row.invoice_no,
        seller_partner_id: row.seller_partner_id,
        seller_name: row.seller_name,
        invoice_confirm_by: row.invoice_confirm_by,
        invoice_code: row.invoice_code,
      });
    }
  }
  handleBatchConfirm = () => {
    const ids = this.state.selectedRowKeys;
    this.props.confirmBillInvoice(ids);
  }
  handleEdit = (row) => {
    this.props.toggleInvoiceModal(true, 'edit', {
      id: row.id,
      tax_amount: row.tax_amount,
      invoice_type: row.invoice_type,
      invoice_amount: row.invoice_amount,
      buyer_partner_id: row.buyer_partner_id,
      invoice_date: row.invoice_date,
      invoice_no: row.invoice_no,
      seller_partner_id: row.seller_partner_id,
      seller_name: row.seller_name,
      invoice_confirm_by: row.invoice_confirm_by,
      invoice_code: row.invoice_code,
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { invoiceList, loading, partners } = this.props;
    const { status, clientPid } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: (record) => {
        if (status === 'unconfirmed') {
          return ({
            disabled: !record.invoice_confirm_by,
          });
        }
        return {};
      },
    };
    this.dataSource.remotes = invoiceList;
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
        {partners.filter(p => p.role === PARTNER_ROLES.VEN).map(data => (
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
      {(status === 'unconfirmed') && <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>批量认证</Button>}
      {(status === 'confirmed') && <Button icon="close-circle-o" onClick={this.handleBatchReturn}>取消确认</Button>}
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'unconfirmed', name: this.msg('未认证') },
      { elementKey: 'posted', name: this.msg('已过账') },
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
            <AccountSetSelect />,
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
            loading={loading}
            rowKey="id"
          />
          <InvoiceModal mode="input" />
          <CspInvoiceModal mode="input" />
        </PageContent>
        <VoucherModal />
      </Layout>
    );
  }
}
