import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { notification, Form, Checkbox, Input, Menu, Icon, Progress, message, Layout, Tooltip, Select, Tag, DatePicker } from 'antd';
import DataTable from 'client/components/DataTable';
import { CRM_ORDER_STATUS, PARTNER_ROLES, LINE_FILE_ADAPTOR_MODELS, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { loadOrders, loadOrderAdaptor, removeOrder, setClientForm, acceptOrder, hideDock, /* loadOrderDetail, */ batchDeleteByUploadNo, acceptOrderBatch, batchDelete } from 'common/reducers/sofOrders';
import { loadRequireOrderTypes } from 'common/reducers/sofOrderPref';
import { loadPartners } from 'common/reducers/partner';
import { emptyFlows, loadPartnerFlowList } from 'common/reducers/scofFlow';
import { toggleExportPanel, loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
import ToolbarAction from 'client/components/ToolbarAction';
import connectNav from 'client/common/decorators/connect-nav';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ExportDataPanel from 'client/components/ExportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { MemberSelect, TenantSelect, PartnerSelect } from 'client/components/ComboSelect';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import OrderNoColumn from './columndef/orderNoColumn';
import ShipmentColumn from './columndef/shipmentColumn';
import ProgressColumn from './columndef/progressColumn';
import { formatMsg } from './message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  loginId: state.account.loginId,
  username: state.account.username,
  loading: state.sofOrders.loading,
  orders: state.sofOrders.orders,
  filters: state.sofOrders.orderFilters,
  orderListReload: state.sofOrders.orderListReload,
  partners: state.partner.partners,
  adaptors: state.hubDataAdapter.modelAdaptors,
  flows: state.scofFlow.partnerFlows,
  orderTypes: state.sofOrderPref.requireOrderTypes,
  uploadRecords: state.uploadRecords.uploadRecords,
  unionId: state.account.unionId,
  tenantLevel: state.account.tenantLevel,
  unionTenants: state.saasTenant.unionTenants,
  privileges: state.account.privileges,
}), {
  loadOrders,
  loadPartners,
  loadOrderAdaptor,
  removeOrder,
  setClientForm,
  acceptOrder,
  emptyFlows,
  loadPartnerFlowList,
  loadModelAdaptors,
  hideDock,
  loadRequireOrderTypes,
  // loadOrderDetail,
  batchDeleteByUploadNo,
  setUploadRecordsReload,
  acceptOrderBatch,
  batchDelete,
  togglePanelVisible,
  toggleExportPanel,
})
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofShipments',
})
export default class ShipmentList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    orders: PropTypes.shape({ shipmt_order_no: PropTypes.string }).isRequired,
    filters: PropTypes.shape({ progress: PropTypes.string, transfer: PropTypes.string }).isRequired,
    loadOrders: PropTypes.func.isRequired,
    removeOrder: PropTypes.func.isRequired,
    setClientForm: PropTypes.func.isRequired,
    acceptOrder: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    importPanel: {
      visible: false,
      cust_order_nodup: true,
      customer_partner_id: undefined,
      flow_id: undefined,
      cust_order_no: null,
      cust_order_no_input: false,
    },
  }
  componentDidMount() {
    const { filters: preFilters } = this.props;
    // if (query.shipmt_order_no) {
    //   this.props.loadOrderDetail(query.shipmt_order_no, this.props.tenantId);
    // }
    this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP] });
    this.props.loadPartnerFlowList({ partnerId: null });
    this.props.loadModelAdaptors(null, [LINE_FILE_ADAPTOR_MODELS.SOF_ORDER.key]);
    this.props.loadRequireOrderTypes();
    const filters = {
      ...preFilters,
      loginId: this.props.loginId,
    };
    const { hash: locHash, query } = this.props.location;
    filters.startDate = query.startDate || '';
    filters.endDate = query.endDate || '';
    if (locHash === '#all' || !locHash) {
      filters.progress = null;
      filters.scenario = 'all';
      filters.expedited = null;
    } else if (locHash === '#pending') {
      filters.progress = 'pending';
      filters.expedited = 'all';
      filters.scenario = null;
    } else if (locHash === '#processing') {
      filters.progress = 'active';
      filters.expedited = 'all';
      filters.scenario = null;
    } else if (locHash === '#completed') {
      filters.progress = 'completed';
      filters.expedited = 'all';
      filters.scenario = null;
    }
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: this.props.orders.current,
      filters,
    });
    this.props.hideDock();
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.location) {
    //   const { query } = this.props.location;
    //   const nextQuery = nextProps.location.query;
    //   if (query.shipmt_order_no !== nextQuery.shipmt_order_no) {
    //     this.props.loadOrderDetail(nextQuery.shipmt_order_no, this.props.tenantId);
    //   }
    // }
    if (nextProps.orderListReload && nextProps.orderListReload !== this.props.orderListReload) {
      this.props.loadOrders({
        pageSize: this.props.orders.pageSize,
        current: this.props.orders.current,
        filters: this.props.filters,
      });
    }
  }
  handleDateRangeChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'shipments', action: 'edit',
  });
  handleImport = () => {
    if (!this.editPermission) {
      message.warn(this.msg('noEitpermission'), 5);
      return;
    }
    this.setState({ importPanel: { visible: true, cust_order_nodup: true } });
  }
  handleCreate = () => {
    this.props.setClientForm(-2, {});
    this.props.emptyFlows();
    this.context.router.push('/scof/shipments/create');
  }
  handleEdit = (row) => {
    this.context.router.push(`/scof/shipments/edit/${row.shipmt_order_no}`);
  }
  handleDelete = (row) => {
    const shipmtOrderNo = row.shipmt_order_no;
    const { tenantId, loginId, username } = this.props;
    this.props.removeOrder({
      tenantId, loginId, username, shipmtOrderNo,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info(this.msg('deletedSucceed'));
        this.handleTableLoad();
      }
    });
  }
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    const { username } = this.props;
    this.props.batchDelete(selectedRowKeys, username).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info(this.msg('deletedSucceed'));
        this.setState({
          selectedRowKeys: [],
        });
        this.handleTableLoad(1);
      }
    });
  }
  handleStart = (row) => {
    const { loginId, username } = this.props;
    const shipmtOrderNo = row.shipmt_order_no;
    this.props.acceptOrder({ loginId, username, shipmtOrderNo }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('货运流程已启动');
      }
    });
  }
  handleBatchStart = () => {
    const { selectedRowKeys } = this.state;
    const { username } = this.props;
    this.props.acceptOrderBatch(selectedRowKeys, username).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('货运流程已启动');
        this.setState({
          selectedRowKeys: [],
        });
        this.handleTableLoad();
      }
    });
  }
  handleTableLoad = (currentPage) => {
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: currentPage || this.props.orders.current,
      filters: this.props.filters,
    });
  }
  handleSearch = (searchValue) => {
    const filters = { ...this.props.filters, order_no: searchValue };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleFilterMenuClick = (key) => {
    let filters;
    switch (key) {
      case 'pending':
      case 'active':
      case 'completed':
        filters = {
          ...this.props.filters, progress: key, expedited: 'all', scenario: null,
        };
        break;
      case 'expedited':
        filters = {
          ...this.props.filters, expedited: key, progress: 'active', scenario: null,
        };
        break;
      case 'all':
      case 'myOwn':
      case 'myJoined':
      case 'myDept':
        filters = {
          ...this.props.filters, expedited: null, progress: null, scenario: key,
        };
        break;
      default:
        break;
    }
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleExpeditedChange = (e) => {
    const filters = { ...this.props.filters, expedited: e.target.value };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleClientSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleUnionTenantSelect = (value) => {
    const filters = { ...this.props.filters };
    const { tenantId } = this.props;
    if (tenantId === value) {
      filters.unionTenant = '';
    } else {
      filters.unionTenant = value;
    }
    this.props.loadOrders({
      tenantId: this.props.tenantId,
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleOrderTypeChange = (value) => {
    const filters = { ...this.props.filters, orderType: value === 'all' ? null : Number(value) };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleDeptChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: value, exec_login_id: null };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleMemberChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: null, exec_login_id: value };
    this.props.loadOrders({
      pageSize: this.props.orders.pageSize,
      current: 1,
      filters,
    });
  }
  handleImportClientChange = (customerPartnerId) => {
    this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
    this.setState({
      importPanel: {
        ...this.state.importPanel,
        partner_id: customerPartnerId,
        flow_id: null,
      },
    });
  }
  handleImportFlowChange = (flowId) => {
    this.props.loadModelAdaptors(
      this.state.importPanel.partner_id,
      [LINE_FILE_ADAPTOR_MODELS.SOF_ORDER.key], flowId
    );
    this.setState({ importPanel: { ...this.state.importPanel, flow_id: flowId } });
  }
  handleImportCustNoChange = (ev) => {
    this.setState({ importPanel: { ...this.state.importPanel, cust_order_no: ev.target.value } });
  }
  handleCustOrderDupCheck = (ev) => {
    this.setState({
      importPanel: {
        ...this.state.importPanel,
        cust_order_nodup: ev.target.checked,
      },
    });
  }
  handleCheckUpload = (msg) => {
    if (!this.state.importPanel.flow_id) {
      if (msg) {
        message.warn('订单导入流程规则未选');
      }
      return false;
    }
    return true;
  }
  handleAdaptorChange = (adaptorCode) => {
    if (adaptorCode) {
      this.props.loadOrderAdaptor(adaptorCode).then((result) => {
        if (!result.error) {
          const adaptor = result.data;
          const noCustOrderNoField = adaptor.columns.filter(col => col.field === 'cust_order_no').length === 0;
          const noCustOrderNoDefault = adaptor.columnDefaults.filter(col => col.field === 'cust_order_no').length === 0;
          this.setState({
            importPanel: {
              ...this.state.importPanel,
              cust_order_no_input: noCustOrderNoField && noCustOrderNoDefault,
            },
          });
        }
      });
    } else {
      this.setState({
        importPanel: {
          ...this.state.importPanel,
          cust_order_no_input: false,
        },
      });
    }
  }
  handleImportClose = () => {
    this.setState({
      importPanel: {
        visible: false,
      },
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleImportMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  removeOrdersByBatchUpload = (uploadNo, uploadLogReload) => {
    this.props.batchDeleteByUploadNo(uploadNo).then((result) => {
      if (!result.error) {
        uploadLogReload();
        this.handleTableLoad(1);
      }
    });
  }
  handleExport = () => {
    this.props.toggleExportPanel(true);
  }
  render() {
    const {
      loading, filters, flows, partners,
    } = this.props;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    const { importPanel } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const menu = (
      <Menu onClick={this.handleImportMenuClick}>
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const columns = [{
      title: '货运编号/客户',
      width: 200,
      render: (o, record) => <OrderNoColumn order={record} />,
    }, {
      dataIndex: 'order_status',
      width: 80,
      render: (o, record) => {
        const percent = record.flow_node_num ?
          Number(((record.finish_num / record.flow_node_num) * 100).toFixed(1)) : 0;
        return (<div style={{ textAlign: 'center' }}><Progress type="circle" percent={percent} width={36} />
          <div className="mdc-text-grey table-font-small">
            <Tooltip title={`创建于${moment(record.created_date).format('YYYY.MM.DD HH:mm')}`} placement="bottom">
              <Icon type="clock-circle-o" /> {moment(record.created_date).fromNow()}
            </Tooltip>
          </div>
        </div>);
      },
    }, {
      title: '货运信息',
      width: 250,
      render: (o, record) => <ShipmentColumn shipment={record} />,
    }, {
      title: '负责人',
      dataIndex: 'exec_login_id',
      width: 100,
      render: lid => <UserAvatar showName size="small" loginId={lid} />,
    }, {
      title: '进度状态',
      render: (o, record) => <ProgressColumn order={record} />,
    }, {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (o, record) => {
        if (record.order_status === CRM_ORDER_STATUS.created) {
          if (filters.unionTenant && filters.unionTenant !== this.props.tenantId) {
            return (<PrivilegeCover module="scof" feature="shipments" action="edit">
              <RowAction onClick={this.handleEdit} row={record} icon="eye-o" />
            </PrivilegeCover>);
          }
          return (
            <PrivilegeCover module="scof" feature="shipments" action="edit">
              {record.flow_node_num > 0 &&
                <RowAction onClick={this.handleStart} label={this.msg('startOrder')} icon="caret-right" row={record} />
              }
              <RowAction onEdit={this.handleEdit} onDelete={this.handleDelete} row={record} />
            </PrivilegeCover>
          );
        }
        return null;
      },
    }];
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadOrders(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination, tblfilters) => {
        const newfilters = { ...this.props.filters, ...tblfilters[0] };
        const params = {
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters: newfilters,
        };
        return params;
      },
      remotes: this.props.orders,
    });
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.order_no} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
      <PartnerSelect
        selectedPartner={filters.partnerId}
        onPartnerChange={this.handleClientSelectChange}
        showCus
        showSup
        paramPartners={partners}
      />
      <MemberSelect
        memberDisabled={filters.scenario === 'myOwn'}
        selectMembers={filters.exec_login_id}
        selectDepts={filters.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        onChange={this.handleDateRangeChange}
        value={dateVal}
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
      />
    </span>
    );
    const bulkActions = (<span>
      {filters.progress === 'pending' &&
      <PrivilegeCover module="scof" feature="shipments" action="edit">
        <ToolbarAction icon="caret-right" onClick={this.handleBatchStart} label={this.msg('startOrder')} />
      </PrivilegeCover>}
      {filters.progress === 'pending' &&
      <PrivilegeCover module="scof" feature="shipments" action="delete">
        <ToolbarAction danger icon="delete" label={this.msg('delete')} confirm={this.msg('deleteConfirm')} onConfirm={this.handleBatchDelete} />
      </PrivilegeCover>}
    </span>);
    const dropdownMenuItems = [
      {
        elementKey: 'status',
        title: this.msg('status'),
        elements: [
          { icon: 'hdd', name: this.msg('statusPending'), elementKey: 'pending' },
          { icon: 'laptop', name: this.msg('statusActive'), elementKey: 'active' },
          { icon: 'exclamation-circle', name: this.msg('statusExpedited'), elementKey: 'expedited' },
          { icon: 'check-square-o', name: this.msg('statusCompleted'), elementKey: 'completed' },
        ],
      },
    ];
    let selectedMenuKey = 'all';
    if (filters.scenario) {
      selectedMenuKey = filters.scenario;
    } else if (filters.expedited && filters.expedited !== 'all') {
      selectedMenuKey = filters.expedited;
    } else {
      selectedMenuKey = filters.progress;
    }
    const dropdownMenu = {
      selectedMenuKey,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          title={<TenantSelect
            selectedTenant={filters.unionTenant}
            onTenantSelected={this.handleUnionTenantSelect}
          />}
        >
          <PageHeader.Actions>
            <ToolbarAction primary icon="upload" label={this.msg('import')} dropdown={menu} onClick={this.handleImport} />
            <PrivilegeCover module="scof" feature="shipments" action="create">
              <ToolbarAction secondary icon="plus" label={this.msg('create')} onClick={this.handleCreate} />
            </PrivilegeCover>
            <ToolbarAction icon="export" label={this.msg('export')} onClick={this.handleExport} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            noSetting
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            dataSource={dataSource}
            columns={columns}
            rowKey="shipmt_order_no"
            loading={loading}
            minWidth={1200}
          />
        </PageContent>
        <ImportDataPanel
          title="订单导入"
          visible={importPanel.visible}
          adaptors={this.props.adaptors}
          onAdaptorChange={this.handleAdaptorChange}
          endpoint={`${API_ROOTS.default}v1/sof/order/import`}
          formData={{
            customer_partner_id: importPanel.partner_id,
            flow_id: importPanel.flow_id,
            cust_order_no: importPanel.cust_order_no,
            cust_order_nodup: importPanel.cust_order_nodup,
          }}
          onClose={this.handleImportClose}
          onBeforeUpload={this.handleCheckUpload}
          onUploaded={(respData) => {
            if (respData.existOrderNos) {
              notification.error({
                message: '客户订单号已存在',
                description: respData.existOrderNos.join(',').slice(0, 100),
                duration: 0,
              });
            }
            this.handleImportClose();
            this.handleTableLoad();
            this.props.setUploadRecordsReload(true);
          }}
          template={`${API_ROOTS.default}v1/sof/order/download/template/订单导入模板.xlsx`}
          customizeOverwrite
        >
          <Form.Item label={this.msg('customer')}>
            <Select
              placeholder="请选择客户"
              showSearch
              allowClear
              optionFilterProp="children"
              value={importPanel.partner_id}
              onChange={this.handleImportClientChange}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 360 }}
            >
              {partners.map(data => (<Option key={data.id} value={data.id}><Tag>{this.msg(data.role)}</Tag>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item label={this.msg('flow')}>
            <Select
              placeholder="流程规则必填"
              showSearch
              allowClear
              value={importPanel.flow_id}
              onChange={this.handleImportFlowChange}
            >
              {flows.map(data => <Option key={data.id} value={data.id}>{data.name}</Option>)}
            </Select>
          </Form.Item>
          {importPanel.cust_order_no_input &&
          <Form.Item label="订单追踪号">
            <Input value={importPanel.cust_order_no} onChange={this.handleImportCustNoChange} />
          </Form.Item>}
          <Form.Item>
            <Checkbox
              onChange={this.handleCustOrderDupCheck}
              checked={importPanel.cust_order_nodup}
            >忽略已存在订单追踪号
            </Checkbox>
          </Form.Item>
        </ImportDataPanel>
        <ExportDataPanel
          type={LINE_FILE_ADAPTOR_MODELS.SOF_ORDER.key}
          formData={{
            filters: {
              ...filters,
              selKeys: this.state.selectedRowKeys.length > 0 ?
              this.state.selectedRowKeys : undefined,
            },
          }}
        />
        <UploadLogsPanel
          onUploadBatchDelete={this.removeOrdersByBatchUpload}
          type={UPLOAD_BATCH_OBJECT.SCOF_ORDER}
          formData={{}}
        />
      </Layout>
    );
  }
}
