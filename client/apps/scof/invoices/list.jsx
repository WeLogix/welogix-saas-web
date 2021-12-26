import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Icon, Form, Menu, Layout, Radio, Select, Tag, DatePicker, message } from 'antd';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import UserAvatar from 'client/components/UserAvatar';
import ToolbarAction from 'client/components/ToolbarAction';
import { MemberSelect, TenantSelect, PartnerSelect } from 'client/components/ComboSelect';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ExportDataPanel from 'client/components/ExportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { loadInvoices, batchDeleteInvoices, batchDeleteByUploadNo, loadInvoiceCategories, loadInvoiceBuyerSellers, toggleShipRecvPanel, setConfirmRecordsReload } from 'common/reducers/sofInvoice';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { toggleExportPanel, loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import { PARTNER_ROLES, LINE_FILE_ADAPTOR_MODELS, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
// import { createFilename } from 'client/util/dataTransform';
import ShipRecvPanel from './panel/shipRecvPanel';
import { formatMsg } from './message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

function fetchData({ state, dispatch }) {
  const promises = [];
  promises.push(dispatch(loadInvoices({
    filter: JSON.stringify({
      ...state.sofInvoice.filter, searchText: '', startDate: '', endDate: '',
    }),
    pageSize: state.sofInvoice.invoiceList.pageSize,
    current: state.sofInvoice.invoiceList.current,
    sorter: JSON.stringify({}),
  })));
  promises.push(dispatch(loadInvoiceCategories()));
  promises.push(dispatch(loadInvoiceBuyerSellers()));
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    filter: state.sofInvoice.filter,
    sorter: state.sofInvoice.sorter,
    invoiceList: state.sofInvoice.invoiceList,
    currencies: state.saasParams.latest.currency,
    loading: state.sofInvoice.loading,
    adaptors: state.hubDataAdapter.modelAdaptors,
    uploadRecords: state.uploadRecords.uploadRecords,
    invoiceCategories: state.sofInvoice.invoiceCategories,
    owners: state.sofInvoice.buyers,
    suppliers: state.sofInvoice.sellers,
    tenantId: state.account.tenantId,
    privileges: state.account.privileges,
  }),
  {
    loadInvoices,
    loadModelAdaptors,
    batchDeleteInvoices,
    batchDeleteByUploadNo,
    setUploadRecordsReload,
    togglePanelVisible,
    toggleExportPanel,
    toggleBizDock,
    toggleShipRecvPanel,
    setConfirmRecordsReload,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofInvoice',
})
export default class InvoiceList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    importPanelVisible: false,
    confirmPanelVisible: false,
    confirmMode: '',
    selectedRows: [],
    selectedRowKeys: [],
    ownerPartnerId: '',
  }
  componentDidMount() {
    this.props.loadModelAdaptors('', [LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE.key, LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE_CONFIRM.key]);
    const locHash = this.props.location.hash;
    if (locHash === '#import') {
      this.handleImport();
    } else if (locHash === '#shipped') {
      this.setState({
        confirmPanelVisible: true,
        confirmMode: 'ship',
      });
    } else if (locHash === '#received') {
      this.setState({
        confirmPanelVisible: true,
        confirmMode: 'recv',
      });
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'invoice', action: 'edit',
  });
  createPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'invoice', action: 'create',
  });
  dataSource = new DataTable.DataSource({
    fetcher: params =>
      this.handleReload(params.current, params.pageSize, params.filter, params.sorter),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: Number(resolve(result.totalCount, result.current, result.pageSize)),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: Number(result.pageSize),
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: this.props.filter,
        sorter: {
          field: sorter.field,
          order: sorter.order,
        },
      };
      return params;
    },
    remotes: this.props.invoiceList,
  })
  handleDetail = (row) => {
    this.context.router.push(`/scof/invoices/edit/${row.invoice_no}`);
  }
  handleUpdateDateChange = (data, dataString) => {
    const filter = { ...this.props.filter, startDate: dataString[0], endDate: dataString[1] };
    this.handleReload(1, null, filter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.handleReload(1, null, filter);
  }
  handleReload = (currentPage, pageSize, filter, sorter) => {
    const newSorter = sorter || this.props.sorter;
    this.props.loadInvoices({
      filter: JSON.stringify(filter),
      pageSize: pageSize || this.props.invoiceList.pageSize,
      current: currentPage || this.props.invoiceList.current,
      sorter: JSON.stringify({
        field: newSorter.field,
        order: newSorter.order,
      }),
    });
  }
  handleImport = () => {
    if (!this.editPermission) {
      message.warn(this.msg('noEitpermission'), 3);
      return;
    }
    this.setState({
      importPanelVisible: true,
    });
  }
  handleSelect = (value) => {
    const filter = { ...this.props.filter, partner: value };
    this.handleReload(1, null, filter);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  handleInvoicesUploaded = () => {
    const { filter } = this.props;
    this.handleReload(null, null, filter);
    // this.setState({
    //  importPanelVisible: false,
    // });
    this.props.setUploadRecordsReload(true);
  }
  handleDeleteInvoice = (row) => {
    this.props.batchDeleteInvoices(row.invoice_no).then((result) => {
      if (!result.error) {
        this.handleDeselectRows();
        const { filter } = this.props;
        this.handleReload(1, null, filter);
        message.info(this.msg('deletedSucceed'), 5);
      }
    });
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  handleConfirmMenuClick = (ev) => {
    if (ev.key === 'ship' || ev.key === 'recv') {
      this.setState({
        confirmPanelVisible: true,
        confirmMode: ev.key,
      });
    } else if (ev.key === 'logs') {
      this.props.toggleShipRecvPanel(true);
    }
  }
  handleOverlayMenuClick = (ev) => {
    if (ev.key === 'create') {
      this.context.router.push('/scof/invoices/create');
    } else if (ev.key === 'export') {
      this.props.toggleExportPanel(true);
    }
  }
  removeInvoiceByBatchUpload = (uploadNo, uploadLogReload) => {
    const { filter } = this.props;
    this.props.batchDeleteByUploadNo(uploadNo).then((result) => {
      if (!result.error) {
        uploadLogReload();
        this.handleReload(null, null, filter);
      }
    });
  }
  handleImportPartnerChange = (partnerId) => {
    this.props.loadModelAdaptors(
      partnerId,
      [LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE.key]
    );
    this.setState({
      ownerPartnerId: partnerId,
    });
  }
  handleShiprecvPartnerChange = (partnerId) => {
    this.props.loadModelAdaptors(
      partnerId,
      [LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE_CONFIRM.key]
    );
  }
  handleInvDock = (row) => {
    this.props.toggleBizDock('sofCommInv', { inv_no: row.invoice_no });
  }
  handleInvConfirmUploaded = () => {
    const { filter } = this.props;
    this.handleReload(null, null, filter, {
      field: 'last_updated_by',
      order: 'descend',
    });
    // this.setState({
    //  confirmPanelVisible: false,
    // });
    this.props.setConfirmRecordsReload(true);
  }
  handleUnionTenantSelect = (value) => {
    const filter = { ...this.props.filter };
    const { tenantId } = this.props;
    if (tenantId === value) {
      filter.unionTenant = '';
    } else {
      filter.unionTenant = value;
    }
    this.handleReload(1, null, filter);
  }
  columns = [{
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    width: 180,
    render: (invno, row) => <RowAction onClick={this.handleInvDock} label={invno} row={row} href />,
  }, {
    title: this.msg('blNo'),
    dataIndex: 'bl_awb_no',
    width: 150,
  }, {
    title: this.msg('shipmentNo'),
    dataIndex: 'sof_order_no',
    width: 150,
  }, {
    title: this.msg('invoiceDate'),
    dataIndex: 'invoice_date',
    key: 'invoice_date',
    render: o => o && moment(o).format('YYYY-MM-DD'),
    sorter: true,
    width: 150,
  }, {
    title: this.msg('invoicePayDate'),
    dataIndex: 'payment_date',
    render: o => o && moment(o).format('YYYY-MM-DD'),
    width: 150,
  }, {
    title: this.msg('poNoCount'),
    dataIndex: 'po_no_count',
    align: 'right',
    width: 80,
    render: pocount => (pocount > 0 ? pocount : ''),
  }, {
    title: this.msg('totalQty'),
    dataIndex: 'total_qty',
    align: 'right',
    width: 120,
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: this.msg('shippedQty'),
    dataIndex: 'total_shipped_qty',
    align: 'right',
    width: 120,
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.total_qty) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: this.msg('recvQty'),
    dataIndex: 'total_recv_qty',
    align: 'right',
    width: 120,
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.total_qty) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: this.msg('status'),
    dataIndex: 'invoice_status',
    width: 100,
    render: (o) => {
      switch (o) {
        case 0:
          return <Badge status="default" text={this.msg('toShip')} />;
        case 1:
          return <Badge status="warning" text={this.msg('exceptionalShipped')} />;
        case 2:
          return <Badge status="processing" text={this.msg('shipped')} />;
        case 3:
          return <Badge status="warning" text={this.msg('exceptionalReceived')} />;
        case 4:
          return <Badge status="success" text={this.msg('received')} />;
        default:
          return null;
      }
    },
  }, {
    title: this.msg('totalNetWt'),
    dataIndex: 'total_net_wt',
    align: 'right',
    width: 150,
  }, {
    title: this.msg('totalAmount'),
    dataIndex: 'total_amount',
    align: 'right',
    width: 150,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    width: 100,
    render: (o) => {
      const curr = this.props.currencies.find(cur => cur.curr_code === o);
      if (curr) {
        return curr.curr_name;
      }
      return o;
    },
  }, {
    title: this.msg('owner'),
    dataIndex: 'owner_name',
    width: 200,
  }, {
    title: this.msg('supplier'),
    dataIndex: 'supplier_name',
    width: 200,
  }, {
    title: this.msg('lastUpdatedDate'),
    dataIndex: 'last_updated_date',
    width: 140,
    render: date => date && moment(date).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 110,
    render: date => date && moment(date).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('createdBy'),
    dataIndex: 'created_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    width: 60,
    className: 'table-col-ops',
    fixed: 'right',
    render: (o, record) => {
      if (this.props.filter.unionTenant && this.props.filter.unionTenant !== this.props.tenantId) {
        return (<PrivilegeCover module="scof" feature="invoice" action="edit">
          <RowAction onClick={this.handleDetail} icon="eye-o" tooltip="编辑" row={record} />
        </PrivilegeCover>);
      }
      return [
        (<PrivilegeCover module="scof" feature="invoice" action="edit">
          <RowAction onClick={this.handleDetail} icon="edit" tooltip="编辑" row={record} />
        </PrivilegeCover>),
        (<PrivilegeCover module="scof" feature="invoice" action="delete">
          <RowAction onDelete={this.handleDeleteInvoice} row={record} />
        </PrivilegeCover>),
      ];
    },
  }];
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.filter, scenario: key };
    this.handleReload(1, null, filter);
  }
  handleDeptChange = (value) => {
    const filter = { ...this.props.filter, own_dept_id: value, own_by: null };
    this.handleReload(1, null, filter);
  }
  handleMemberChange = (value) => {
    const filter = { ...this.props.filter, own_dept_id: null, own_by: value };
    this.handleReload(1, null, filter);
  }
  render() {
    const {
      invoiceList, loading, filter, sorter, adaptors, owners, suppliers,
    } = this.props;
    const columns = [...this.columns];
    const invoiceAdaptors = adaptors.filter(adpt =>
      adpt.biz_model === LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE.key);
    const confirmAdaptors = adaptors.filter(adpt =>
      adpt.biz_model === LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE_CONFIRM.key);
    const invoiceDateCol = columns.filter(col => col.dataIndex === 'invoice_date')[0];
    if (sorter.field === 'invoice_date') {
      invoiceDateCol.sortOrder = sorter.order;
    } else {
      invoiceDateCol.sortOrder = false;
    }
    columns.splice(9, 0, {
      title: this.msg('category'),
      dataIndex: 'invoice_category',
      width: 120,
      filters: this.props.invoiceCategories.map(cate => ({
        text: cate.category, value: cate.category,
      })),
      onFilter: (value, record) =>
        record.invoice_category && record.invoice_category.indexOf(value) !== -1,
    });
    let dateVal = [];
    if (filter.startDate && filter.endDate) {
      dateVal = [moment(filter.startDate, 'YYYY-MM-DD'), moment(filter.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = invoiceList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      selectedRows: this.state.selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      getCheckboxProps: record => ({
        disabled: !!record.parent_id,
      }),
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const confirmMenu = (
      <Menu onClick={this.handleConfirmMenuClick}>
        {this.editPermission && [
          <Menu.Item key="ship"><Icon type="logout" /> {this.msg('confirmShip')}</Menu.Item>,
          <Menu.Item key="recv"><Icon type="login" /> {this.msg('confirmRecv')}</Menu.Item>,
          <Menu.Divider />,
        ]}
        <Menu.Item key="logs"><Icon type="schedule" /> {this.msg('shipRecvLogs')}</Menu.Item>
      </Menu>
    );
    const overlayMenu = (
      <Menu onClick={this.handleOverlayMenuClick}>
        {this.createPermission && <Menu.Item key="create"><Icon type="plus" /> {this.msg('create')}</Menu.Item>}
        <Menu.Item key="export"><Icon type="export" /> {this.msg('export')}</Menu.Item>
      </Menu>
    );
    const toolbarActions = (<span>
      <SearchBox
        value={filter.searchText}
        placeholder={this.msg('searchPlaceholder')}
        onSearch={this.handleSearch}
      />
      <PartnerSelect
        selectedPartner={filter.partner}
        onPartnerChange={this.handleSelect}
        showCus
        showSup
        paramPartners={owners.concat(suppliers.filter(owner => owner.role !== PARTNER_ROLES.OWN))}
      />
      <MemberSelect
        memberDisabled={filter.scenario === 'myOwn'}
        selectMembers={filter.own_by}
        selectDepts={filter.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        onChange={this.handleUpdateDateChange}
        value={dateVal}
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const bulkActions = (<span>
      <ToolbarAction icon="download" onClick={this.handleExport} label={this.msg('export')} />
    </span>);
    const dropdownMenu = {
      selectedMenuKey: filter.scenario,
      onMenuClick: this.handleFilterMenuClick,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          title={<TenantSelect
            selectedTenant={filter.unionTenant}
            onTenantSelected={this.handleUnionTenantSelect}
          />}
        >
          <PageHeader.Actions>
            <ToolbarAction primary icon="upload" label={this.msg('import')} dropdown={menu} onClick={this.handleImport} />
            <ToolbarAction icon="check-circle" label={this.msg('confirmShipRecv')} overlay={confirmMenu} />
            <ToolbarAction overlay={overlayMenu} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={columns}
            loading={loading}
            rowKey="invoice_no"
          />
        </PageContent>
        <ImportDataPanel
          title={this.msg('batchImportInvoices')}
          visible={this.state.importPanelVisible}
          adaptors={invoiceAdaptors}
          endpoint={`${API_ROOTS.default}v1/scof/invoices/import`}
          formData={{ ownerPartnerId: this.state.ownerPartnerId }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleInvoicesUploaded}
          template={`${XLSX_CDN}/发票导入模板.xlsx`}
        >
          <Form.Item label={this.msg('customer')}>
            <Select
              placeholder="请选择客户"
              showSearch
              allowClear
              optionFilterProp="children"
              onChange={this.handleImportPartnerChange}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 360 }}
            >
              {owners.map(data => (<Option key={data.id} value={data.id}>
                <Tag>{this.msg(data.role)}</Tag>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
              </Option>))}
            </Select>
          </Form.Item>
        </ImportDataPanel>
        <ImportDataPanel
          title={this.msg('confirmShipRecv')}
          visible={this.state.confirmPanelVisible}
          adaptors={confirmAdaptors}
          endpoint={`${API_ROOTS.default}v1/scof/invoice/importconfirm`}
          formData={{ confirmMode: this.state.confirmMode }}
          onClose={() => { this.setState({ confirmPanelVisible: false }); }}
          onUploaded={this.handleInvConfirmUploaded}
        >
          <Form.Item>
            <Radio.Group value={this.state.confirmMode} buttonStyle="solid">
              <Radio.Button value="ship" disabled={this.state.confirmMode === 'recv'}>
                {this.msg('confirmShip')}
              </Radio.Button>
              <Radio.Button value="recv" disabled={this.state.confirmMode === 'ship'}>
                {this.msg('confirmRecv')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={this.msg('customer')}>
            <Select
              placeholder="请选择客户"
              showSearch
              allowClear
              optionFilterProp="children"
              onChange={this.handleShiprecvPartnerChange}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 360 }}
            >
              {owners.map(data => (<Option key={data.id} value={data.id}>
                <Tag>{this.msg(data.role)}</Tag>{[data.partner_code, data.name].filter(dn => dn).join(' | ')}
              </Option>))}
            </Select>
          </Form.Item>
        </ImportDataPanel>
        <ExportDataPanel
          type={LINE_FILE_ADAPTOR_MODELS.SCOF_INVOICE.key}
          formData={{}}
        />
        <UploadLogsPanel
          onUploadBatchDelete={this.removeInvoiceByBatchUpload}
          type={UPLOAD_BATCH_OBJECT.SCOF_INVOICE}
        />
        <ShipRecvPanel />
      </Layout>
    );
  }
}
