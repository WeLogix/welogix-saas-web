import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Button, Layout, Select, Tag, Tooltip, Icon, notification, DatePicker } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import UserAvatar from 'client/components/UserAvatar';
import connectNav from 'client/common/decorators/connect-nav';
import ExportDataPanel from 'client/components/ExportDataPanel';
import { showDock, loadAsnLists, releaseAsn, cancelAsn, closeAsn, batchRelease } from 'common/reducers/cwmReceive';
import { toggleExportPanel } from 'common/reducers/hubDataAdapter';
import { CWM_REG_STATUS, CWM_SHFTZ_APIREG_STATUS, CWM_ASN_INBOUND_STATUS, CWM_SHFTZ_IN_REGTYPES, LINE_FILE_ADAPTOR_MODELS, SASBL_REG_TYPES } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { MemberSelect } from 'client/components/ComboSelect';
import WhseSelect from '../../common/whseSelect';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    tenantName: state.account.tenantName,
    customsCode: state.account.customsCode,
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    filters: state.cwmReceive.asnFilters,
    asnlist: state.cwmReceive.asnlist,
    loading: state.cwmReceive.asnlist.loading,
    owners: state.cwmContext.whseAttrs.owners,
    suppliers: state.cwmContext.whseAttrs.suppliers,
    loginId: state.account.loginId,
  }),
  {
    showDock, loadAsnLists, releaseAsn, cancelAsn, closeAsn, batchRelease, toggleExportPanel,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmReceiving',
})
export default class ReceivingASNList extends React.Component {
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
    const filters = {
      ...this.props.filters, scenario: 'myOwn',
    };
    const { hash: locHash, query } = this.props.location;
    filters.startDate = query.startDate || '';
    filters.endDate = query.endDate || '';
    if (locHash === '#pending') {
      filters.scenario = 'pending';
    } else if (locHash === '#receiving') {
      filters.scenario = 'receiving';
    } else if (locHash === '#putting') {
      filters.scenario = 'putting';
    } else if (locHash === '#completed') {
      filters.scenario = 'completed';
    } else {
      filters.scenario = 'all';
    }
    this.props.loadAsnLists({
      whseCode: this.props.defaultWhse.code,
      pageSize: this.props.asnlist.pageSize,
      current: this.props.asnlist.current,
      filters,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.asnlist.loaded && !nextProps.asnlist.loading) {
      this.handleListReload();
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('asnNo'),
    dataIndex: 'asn_no',
    width: 180,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: this.msg('asnCustOrderNo'),
    width: 220,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('owner'),
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '供货商',
    width: 180,
    dataIndex: 'supplier_name',
  }, {
    title: this.msg('inboundStatus'),
    dataIndex: 'status',
    width: 120,
    render: (o) => {
      const asnStatusKey = Object.keys(CWM_ASN_INBOUND_STATUS).filter(as =>
        CWM_ASN_INBOUND_STATUS[as].value === o)[0];
      if (asnStatusKey) {
        return (<Badge
          status={CWM_ASN_INBOUND_STATUS[asnStatusKey].badge}
          text={CWM_ASN_INBOUND_STATUS[asnStatusKey].text}
        />);
      }
      return '';
    },
  }, {
    title: this.msg('bondType'),
    dataIndex: 'bonded',
    width: 100,
    render: (bonded, record) => {
      if (bonded) {
        const entType =
        CWM_SHFTZ_IN_REGTYPES.concat(SASBL_REG_TYPES).filter(regtype =>
          regtype.value === record.bonded_intype)[0];
        return entType && <Tag color={entType.tagcolor}>{entType.ftztext}</Tag>;
      }
      return (<Tag>非保税</Tag>);
    },
  }, {
    title: this.msg('regStatus'),
    dataIndex: 'reg_status',
    width: 100,
    render: (o, record) => {
      if (record.bonded_intype === 'transfer') {
        switch (o) {
          case CWM_SHFTZ_APIREG_STATUS.pending:
            return (<Badge status="default" text="未接收" />);
          case CWM_SHFTZ_APIREG_STATUS.processing:
            return (<Badge status="processing" text="数据比对" />);
          case CWM_SHFTZ_APIREG_STATUS.completed:
            return (<Badge status="success" text="接收完成" />);
          default:
            return null;
        }
      } else {
        const regStatus = Object.values(CWM_REG_STATUS).filter(st => st.value === o)[0];
        if (regStatus) {
          return (<span>
            <Badge status={regStatus.badge} text={regStatus.text} />
            {/*
            <RowAction shape="circle" onClick={this.handleSupervision}
            icon="link" tooltip="查看海关备案" row={record} key="reg" />
          */}
          </span>);
        }
      }
      return null;
    },
  }, {
    title: <Tooltip title="明细记录数"><Icon type="bars" /></Tooltip>,
    dataIndex: 'total_product_qty',
    width: 50,
    render: dc => (!Number.isNaN(dc) ? dc : null),
  }, {
    title: '预期总数量',
    dataIndex: 'total_expect_qty',
    width: 100,
  }, {
    title: '实收总数量',
    dataIndex: 'total_received_qty',
    width: 100,
  }, {
    title: '上架总数量',
    dataIndex: 'total_putaway_qty',
    width: 100,
  }, {
    title: '收货总体积',
    dataIndex: 'total_received_vol',
    width: 100,
  }, {
    title: '预期到货日期',
    dataIndex: 'expect_receive_date',
    width: 140,
    render: exprecdate => exprecdate && moment(exprecdate).format('YYYY.MM.DD'),
    sorter: (a, b) => new Date(a.expect_receive_date).getTime()
    - new Date(b.expect_receive_date).getTime(),
  }, {
    title: '实际入库时间',
    dataIndex: 'received_date',
    width: 140,
    render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
    sorter: (a, b) => new Date(a.received_date).getTime() - new Date(b.received_date).getTime(),
  }, {
    title: '创建时间',
    dataIndex: 'created_date',
    width: 140,
    render: createdate => createdate && moment(createdate).format('MM.DD HH:mm'),
    sorter: (a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 100,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '执行人员',
    dataIndex: 'exec_by',
    width: 100,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (record.status === CWM_ASN_INBOUND_STATUS.PENDING.value) {
        return (<PrivilegeCover module="cwm" feature="receiving" action="edit">
          <RowAction onClick={this.handleReleaseASN} icon="play-circle-o" label="释放" row={record} />
          <RowAction onClick={this.handleEditASN} icon="edit" tooltip="修改" row={record} />
        </PrivilegeCover>);
      }
      if (record.status === CWM_ASN_INBOUND_STATUS.COMPLETED.value) {
        return <RowAction onClick={() => this.handleInbound(record)} icon="eye-o" label="入库详情" row={record} />;
      }
      return <RowAction onClick={() => this.handleInbound(record)} icon="form" label="入库操作" row={record} />;
    },
  }]
  handlePreview = (asnNo) => {
    this.props.showDock(asnNo);
  }
  handleComplete = (row) => {
    this.props.closeAsn(row.asn_no).then((result) => {
      if (!result.error) {
        this.handleListReload();
      }
    });
  }
  handleCreateASN = () => {
    this.context.router.push('/cwm/receiving/asn/create');
  }
  handleEditASN = (row) => {
    const link = `/cwm/receiving/asn/${row.asn_no}`;
    this.context.router.push(link);
  }
  handleDeleteASN = (row) => {
    this.props.cancelAsn(row.asn_no).then((result) => {
      if (!result.error) {
        this.handleListReload();
      }
    });
  }
  handleListReload = () => {
    const { filters } = this.props;
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: this.props.asnlist.current,
      filters,
    });
  }
  handleReleaseASN = (row) => {
    const whseCode = this.props.defaultWhse.code;
    this.props.releaseAsn(row.asn_no, whseCode).then((result) => {
      if (!result.error) {
        notification.success({
          message: '操作成功',
          description: `${row.asn_no} 已释放`,
        });
        this.handleListReload();
      } else {
        this.handleReleaseError(result.error.message);
      }
    });
  }
  handleBatchRelease = () => {
    const { selectedRowKeys } = this.state;
    this.props.batchRelease(selectedRowKeys).then((result) => {
      if (!result.error) {
        const msg = selectedRowKeys.join(',');
        notification.success({
          message: '操作成功',
          description: `${msg} 已释放`,
        });
        this.handleListReload();
        this.setState({
          selectedRowKeys: [],
        });
      } else {
        this.handleReleaseError(result.error.message);
      }
    });
  }
  handleReleaseError = (errorKey) => {
    if (errorKey === 'release_null_supplier') {
      notification.error({
        message: '释放失败',
        description: 'ASN存在供货商为空',
      });
    } else if (errorKey === 'release_detail_null_qty_no') {
      notification.error({
        message: '释放失败',
        description: 'ASN明细存在数量或货号为空',
      });
    } else {
      notification.error({
        message: '释放失败',
        description: errorKey,
      });
    }
  }
  handleInbound = (row) => {
    const link = `/cwm/receiving/inbound/${row.inbound_no}`;
    this.context.router.push(link);
  }
  handleSupervision = (row) => {
    const link = row.bonded_intype === 'transfer' ? `/cwm/supervision/shftz/transfer/in/${row.asn_no}` : `/cwm/supervision/shftz/entry/${row.asn_no}`;
    this.context.router.push(link);
  }
  handleDisprepancy = () => {
    // TODO
  }
  handleWhseChange = (value) => {
    const { filters } = this.props;
    this.props.loadAsnLists({
      whseCode: value,
      pageSize: this.props.asnlist.pageSize,
      current: this.props.asnlist.current,
      filters,
    });
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, scenario: key };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleOwnerChange = (value) => {
    const filters = { ...this.props.filters, ownerCode: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleSupplierChange = (value) => {
    const filters = { ...this.props.filters, supplierCode: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleDeptChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: value, exec_by: null };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleMemberChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: null, exec_by: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, name: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadAsnLists({
      whseCode,
      pageSize: this.props.asnlist.pageSize,
      current: 1,
      filters,
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleExport = () => {
    this.props.toggleExportPanel(true);
  }
  render() {
    const {
      defaultWhse, owners, suppliers, filters, loading,
    } = this.props;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadAsnLists(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination, tblfilters) => {
        const newfilters = { ...this.props.filters, ...tblfilters[0] };
        const params = {
          whseCode: this.props.defaultWhse.code,
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters: newfilters,
        };
        return params;
      },
      remotes: this.props.asnlist,
    });
    let columns = [...this.columns];
    if (!defaultWhse.bonded) {
      columns = columns.filter(col => !(col.dataIndex === 'bonded' || col.dataIndex === 'reg_status'));
    }
    const toolbarActions = (<span>
      <SearchBox value={filters.name} placeholder={this.msg('asnPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.ownerCode}
        onChange={this.handleOwnerChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部货主</Option>
        {owners.map(owner => (<Option key={owner.id} value={owner.id}>{owner.name}</Option>))}
      </Select>
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.supplierCode}
        onChange={this.handleSupplierChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部供货商</Option>
        {suppliers.filter(supplier => (filters.ownerCode !== 'all' ? filters.ownerCode === supplier.owner_partner_id : true))
            .map(supplier => (
              <Option key={supplier.code} value={supplier.code}>
                {supplier.name}</Option>))}
      </Select>
      <MemberSelect
        memberDisabled={filters.scenario === 'myOwn'}
        selectMembers={filters.exec_by}
        selectDepts={filters.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        onChange={this.handleDateChange}
        value={dateVal}
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
      />
    </span>);
    const bulkActions = filters.scenario === 'pending' && <Button icon="play-circle-o" onClick={this.handleBatchRelease}>批量释放</Button>;
    const dropdownMenuItems = [
      {
        elementKey: 'inboundStatus',
        title: this.msg('inboundStatus'),
        elements: Object.keys(CWM_ASN_INBOUND_STATUS).map(decl => ({
          name: CWM_ASN_INBOUND_STATUS[decl].text, elementKey: CWM_ASN_INBOUND_STATUS[decl].key,
        })),
      },
    ];
    if (defaultWhse.bonded) {
      dropdownMenuItems.push({
        elementKey: 'regStatus',
        title: this.msg('regStatus'),
        elements: Object.keys(CWM_REG_STATUS).map(decl => ({
          name: CWM_REG_STATUS[decl].text, elementKey: CWM_REG_STATUS[decl].key,
        })),
      });
    }
    const dropdownMenu = {
      selectedMenuKey: filters.scenario,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          title={<WhseSelect onChange={this.handleWhseChange} />}
          showCollab={false}
        >
          <PageHeader.Actions>
            <ToolbarAction icon="download" label={this.msg('export')} onClick={this.handleExport} />
            <PrivilegeCover module="cwm" feature="receiving" action="create">
              <ToolbarAction primary icon="plus" label={this.msg('create')} onClick={this.handleCreateASN} />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            rowKey="asn_no"
            loading={loading}
          />
          <ExportDataPanel
            type={LINE_FILE_ADAPTOR_MODELS.CWM_ASN.key}
            formData={{
              whseCode: defaultWhse.code,
              filters: {
                ...filters,
                selAsnNos: this.state.selectedRowKeys.length > 0 ?
                  this.state.selectedRowKeys : undefined,
              },
            }}
          />
        </PageContent>
      </Layout>
    );
  }
}
