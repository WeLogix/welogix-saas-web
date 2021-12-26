import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, DatePicker, Menu, Icon, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { MemberSelect, TenantSelect, PartnerSelect } from 'client/components/ComboSelect';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ExportDataPanel from 'client/components/ExportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { loadInvoiceBuyerSellers } from 'common/reducers/sofInvoice';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { loadPurchaseOrders, loadAllPoMeta, batchDeletePurchaseOrders, batchDeleteByUploadNo, importPurchaseOrders } from 'common/reducers/sofPurchaseOrders';
import { loadTenantBMFields, toggleColumnSettingModal } from 'common/reducers/paasBizModelMeta';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { toggleExportPanel, loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import ModelColumnSettingModal from 'client/components/ModelColumnSettingModal';
import { LINE_FILE_ADAPTOR_MODELS, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    filter: state.sofPurchaseOrders.filter,
    purchaseOrderList: state.sofPurchaseOrders.purchaseOrderList,
    poMetaList: state.sofPurchaseOrders.poMetaList,
    uploadRecords: state.uploadRecords.uploadRecords,
    adaptors: state.hubDataAdapter.modelAdaptors,
    buyers: state.sofInvoice.buyers,
    sellers: state.sofInvoice.sellers,
    poListLoading: state.sofPurchaseOrders.poListLoading,
    bmObjFields: state.paasBizModelMeta.bmObjs,
    privileges: state.account.privileges,
  }),
  {
    batchDeletePurchaseOrders,
    setUploadRecordsReload,
    togglePanelVisible,
    loadPurchaseOrders,
    loadAllPoMeta,
    loadInvoiceBuyerSellers,
    toggleExportPanel,
    loadModelAdaptors,
    batchDeleteByUploadNo,
    importPurchaseOrders,
    toggleBizDock,
    toggleColumnSettingModal,
    loadTenantBMFields,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofPurchaseOrder',
})
export default class PurchaseOrderList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    importPanelVisible: false,
    selectedRowKeys: [],
  }
  componentDidMount() {
    this.handleReload(true, null, 1);
    this.props.loadInvoiceBuyerSellers();
    this.props.loadModelAdaptors('', [LINE_FILE_ADAPTOR_MODELS.SCOF_PURCHASE_ORDER.key]);
    this.props.loadTenantBMFields('PO');
    const locHash = this.props.location.hash;
    if (locHash === '#import') {
      this.handleImport();
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'purchaseOrder', action: 'edit',
  });
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadPurchaseOrders(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: Number(resolve(result.totalCount, result.current, result.pageSize)),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: Number(result.pageSize),
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const newfilters = this.props.filter;
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: JSON.stringify(newfilters),
      };
      return params;
    },
    remotes: this.props.purchaseOrderList,
  })
  handleInvDock = (row) => {
    this.props.toggleBizDock('sofCommInv', { inv_no: row.inv_no });
  }
  handleDetail = (row) => {
    this.context.router.push(`/scof/purchaseorders/edit/${row.po_no}`);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, search: value };
    this.handleReload(!value, filter, 1);
  }
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.filter, scenario: key };
    this.handleReload(true, filter, 1);
  }
  handleReload = (noMeta, filter, currentPage, pageSize) => {
    const filterJson = JSON.stringify(filter || this.props.filter);
    this.props.loadPurchaseOrders({
      filter: filterJson,
      pageSize: pageSize || this.props.purchaseOrderList.pageSize,
      current: currentPage || this.props.purchaseOrderList.current,
    });
    if (!noMeta) {
      this.props.loadAllPoMeta({
        filter: filterJson,
      });
    }
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
  handleExport = () => {
    this.props.toggleExportPanel(true);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  purchaseOrdersUploaded = () => {
    const { filter } = this.props;
    this.handleReload(true, filter);
    // this.setState({
    //  importPanelVisible: false,
    // });
    this.props.setUploadRecordsReload(true);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.filter, startDate: dataString[0], endDate: dataString[1] };
    this.handleReload(data.length === 0, filter, 1);
  }
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    this.props.batchDeletePurchaseOrders(selectedRowKeys).then((result) => {
      if (!result.error) {
        this.handleDeselectRows();
        this.handleReload(true, null, 1);
      }
    });
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  removePurchaseByBatchUpload = (uploadNo, uploadLogReload) => {
    this.props.batchDeleteByUploadNo(uploadNo).then((result) => {
      if (!result.error) {
        uploadLogReload();
        this.handleReload(true, null, 1);
      }
    });
  }
  handleShowColumnModal = () => {
    this.props.toggleColumnSettingModal(true);
  }
  render() {
    const {
      purchaseOrderList, poMetaList, poListLoading, filter, bmObjFields, partners,
    } = this.props;
    let poColumns = bmObjFields;
    if (poColumns.length === 0) {
      poColumns = LINE_FILE_ADAPTOR_MODELS.SCOF_PURCHASE_ORDER.columns.map(col => ({
        bm_field: col.field,
        bmf_data_type: col.datatype,
        bmf_label_name: col.label,
      }));
    }
    const columns = poColumns.map((col) => {
      const column = {
        title: col.bmf_label_name || col.bmf_default_name,
        dataIndex: col.bm_field,
        width: 150,
      };
      if (col.bmf_data_type === 'DATE') {
        if (col.bmf_data_hypotype === 'DATETIME') {
          column.render = date => date && moment(date).format('YYYY.MM.DD HH:mm');
        } else {
          column.render = date => date && moment(date).format('YYYY.MM.DD');
        }
      }
      if (col.bm_field === 'gt_owner') {
        column.render = (o) => {
          const customer = this.props.buyers.find(buyer => buyer.id === Number(o));
          if (customer) {
            return `${customer.partner_code}|${customer.name}`;
          }
          return o;
        };
      } else if (col.bm_field === 'gt_supplier') {
        column.render = (o) => {
          const supplier = this.props.sellers.find(seller => seller.id === Number(o));
          if (supplier) {
            return `${supplier.partner_code}|${supplier.name}`;
          }
          return o;
        };
      } else if (col.bm_field === 'inv_no') {
        column.render = (invno, row) => (invno ?
          <RowAction onClick={this.handleInvDock} label={invno} row={row} href />
          : null);
      }
      return column;
    });
    columns.push({
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      width: 60,
      className: 'table-col-ops',
      fixed: 'right',
      render: (o, record) => (<span>
        <RowAction onClick={this.handleDetail} icon="edit" tooltip="编辑" row={record} />
      </span>),
    });
    const dateVal = [];
    if (filter.startDate) {
      dateVal.push(moment(filter.startDate));
      if (filter.endDate) {
        dateVal.push(moment(filter.endDate));
      }
    }
    this.dataSource.remotes = purchaseOrderList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      selections: [{
        key: 'wholelist',
        text: '选择全部项',
        onSelect: () => {
          this.setState({
            selectedRowKeys: poMetaList.map(pml => pml.id),
          });
        },
      }, {
        key: 'oppositelist',
        text: '反选全部项',
        onSelect: () => {
          this.setState({
            selectedRowKeys: poMetaList.filter(pml =>
              !this.state.selectedRowKeys.find(srk => srk === pml.id))
              .map(pml => pml.id),
          });
        },
      }],
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const toolbarActions = (<span>
      <SearchBox
        value={filter.search}
        placeholder={this.msg('poSearchPlaceholder')}
        onSearch={this.handleSearch}
      />
      <PartnerSelect
        selectedPartner={filter.partner}
        onPartnerChange={this.handleSelect}
        showSup
        paramPartners={partners}
      />
      <MemberSelect
        memberDisabled={filter.scenario === 'myOwn'}
        selectMembers={filter.own_by}
        selectDepts={filter.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        onChange={this.handleDateRangeChange}
        value={dateVal}
        format="YYYY-MM-DD"
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const bulkActions = (<span>
      <ToolbarAction icon="download" onClick={this.handleExport} label={this.msg('export')} />
      <PrivilegeCover module="scof" feature="purchaseOrder" action="delete">
        <ToolbarAction danger icon="delete" label={this.msg('delete')} confirm={this.msg('deleteConfirm')} onConfirm={this.handleBatchDelete} />
      </PrivilegeCover>
    </span>);
    const dropdownMenu = {
      selectedMenuKey: filter.scenario,
      onMenuClick: this.handleFilterMenuClick,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          title={<TenantSelect
            selectedTenant={filter.unionTenant}
            onTenantSelected={this.handleUnionTenantSelect}
          />}
          dropdownMenu={dropdownMenu}
          extra={<Menu
            mode="horizontal"
            defaultSelectedKeys={['items']}
          >
            <Menu.Item key="items">按订单项查看</Menu.Item>
            <Menu.Item key="orders">按订单查看</Menu.Item>
          </Menu>}
        >
          <PageHeader.Actions>
            <ToolbarAction primary icon="upload" label={this.msg('import')} dropdown={menu} onClick={this.handleImport} />
            <ToolbarAction icon="export" label={this.msg('export')} onClick={this.handleExport} />
            <ToolbarAction icon="tool" tooltip={this.msg('customizeListColumns')} onClick={this.handleShowColumnModal} />
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={columns}
            loading={poListLoading}
            rowKey="id"
          />
          <ImportDataPanel
            title={this.msg('batchImportPurchaseOrders')}
            visible={this.state.importPanelVisible}
            adaptors={this.props.adaptors}
            endpoint={`${API_ROOTS.default}v1/scof/purchase/orders/import`}
            importAfterSegement={this.props.importPurchaseOrders}
            formData={{ }}
            onClose={() => { this.setState({ importPanelVisible: false }); }}
            onUploaded={this.purchaseOrdersUploaded}
            template={`${XLSX_CDN}/采购订单导入模板.xlsx`}
            chunked
          />
          <ExportDataPanel
            type={LINE_FILE_ADAPTOR_MODELS.SCOF_PURCHASE_ORDER.key}
            formData={{
              filters: {
                ...filter,
                selKeys: this.state.selectedRowKeys.length > 0
                ? this.state.selectedRowKeys : null,
              },
            }}
          />
          <UploadLogsPanel
            onUploadBatchDelete={this.removePurchaseByBatchUpload}
            type={UPLOAD_BATCH_OBJECT.SCOF_PURCHASE_ORDER}
          />
          <ModelColumnSettingModal
            targetObj="PO"
            fromSubject="DWD_GLOBAL"
            title="自定义采购订单列表项"
          />
        </Content>
      </Layout>
    );
  }
}
