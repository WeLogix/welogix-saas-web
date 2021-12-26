import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import FileSaver from 'file-saver';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, Select, Button, Menu, Badge, Tag, notification, DatePicker, Icon, message } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import UserAvatar from 'client/components/UserAvatar';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import connectNav from 'client/common/decorators/connect-nav';
import { CWM_REG_STATUS, CWM_SO_OUTBOUND_STATUS, CWM_OUTBOUND_STATUS, CWM_SHFTZ_OUT_REGTYPES, LINE_FILE_ADAPTOR_MODELS, SASBL_REG_TYPES, CWM_SO_STATUS } from 'common/constants';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { loadModelAdaptors, toggleExportPanel } from 'common/reducers/hubDataAdapter';
import {
  loadSos, showDock, releaseSo, showAddToWave, batchRelease, cancelWave,
  removeWaveOrders, showCreateWave, loadWaveOrders, showWaveSoListModal,
} from 'common/reducers/cwmShippingOrder';
import { exportNormalExitBySo, openShippingModal } from 'common/reducers/cwmOutbound';
import ExportDataPanel from 'client/components/ExportDataPanel';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { MemberSelect } from 'client/components/ComboSelect';
import WhseSelect from '../../common/whseSelect';
import AddToWaveModal from './modal/addToWaveModal';
import CreateWaveModal from './modal/createWaveModal';
import WaveSoListModal from './modal/waveSoListModal';
import ShippingModal from '../outbound/modal/shippingModal';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    receivers: state.cwmContext.whseAttrs.receivers,
    carriers: state.cwmContext.whseAttrs.carriers,
    loginId: state.account.loginId,
    filters: state.cwmShippingOrder.soFilters,
    solist: state.cwmShippingOrder.solist,
    loading: state.cwmShippingOrder.solist.loading,
    tenantName: state.account.tenantName,
    adaptors: state.hubDataAdapter.modelAdaptors,
  }),
  {
    loadSos,
    switchDefaultWhse,
    showDock,
    releaseSo,
    showAddToWave,
    batchRelease,
    exportNormalExitBySo,
    openShippingModal,
    loadModelAdaptors,
    toggleExportPanel,
    cancelWave,
    removeWaveOrders,
    showCreateWave,
    loadWaveOrders,
    showWaveSoListModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShipping',
})
export default class ShippingOrderList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    createWaveEnable: true,
    importPanelVisible: false,
    expandedRowKeys: [],
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
    } else if (locHash === '#toAllocate') {
      filters.scenario = 'prealloc';
    } else if (locHash === '#toPick') {
      filters.scenario = 'allocated';
    } else if (locHash === '#toShip') {
      filters.scenario = 'picked';
    } else if (locHash === '#outboundCompleted') {
      filters.scenario = 'shipped';
    } else {
      filters.scenario = 'all';
    }
    this.props.loadSos({
      whseCode: this.props.defaultWhse.code,
      pageSize: this.props.solist.pageSize,
      current: this.props.solist.current,
      filters,
    });
    this.props.loadModelAdaptors('', [LINE_FILE_ADAPTOR_MODELS.CWM_SHIPPING_ORDER.key]);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.solist.loaded && !nextProps.solist.loading) {
      this.handleReload();
    }
    if (nextProps.filters.scenario !== this.props.filters.scenario) {
      this.setState({ expandedRowKeys: [] });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: 'SO编号',
    width: 220,
    dataIndex: 'so_no',
    render: (o, record) => (
      <a onClick={() => this.handlePreview(o, record.outbound_no)}>
        {o}
      </a>),
  }, {
    title: this.msg('shippingCustOrderNo'),
    dataIndex: 'cust_order_no',
    width: 160,
  }, {
    title: '波次',
    dataIndex: 'wave_no',
    width: 180,
    render: (o, record) => {
      if (record.showMore) {
        return (<a onClick={() => this.handleShowWaveSoListModal(record.waveNo)}>查看波次内全部订单
        </a>);
      }
      return o;
    },
  }, {
    title: '货主',
    width: 200,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('outboundStatus'),
    dataIndex: 'status',
    width: 120,
    render: (soStatus, row) => {
      if (soStatus === CWM_SO_OUTBOUND_STATUS.PENDING.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PENDING.badge}
          text={CWM_SO_OUTBOUND_STATUS.PENDING.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.CREATED.value) {
        if (row.total_prealloc_qty < row.total_qty && !row.wave_no) {
          return (<Badge
            // status={CWM_SO_OUTBOUND_STATUS.UNPREALLOC.badge}
            // text={CWM_SO_OUTBOUND_STATUS.UNPREALLOC.text}
            status="warning"
            text="预配不足"
          />);
        }
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PREALLOC.badge}
          // text={CWM_SO_OUTBOUND_STATUS.PREALLOC.text}
          text="预配完成"
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.ALLOCATING.badge}
          text={CWM_SO_OUTBOUND_STATUS.ALLOCATING.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.ALL_ALLOC.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.PARTIAL_PICKED.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.ALLOCATED.badge}
          text={CWM_SO_OUTBOUND_STATUS.ALLOCATED.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.ALL_PICKED.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.PACKED.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.SHIPPING.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PICKED.badge}
          text={CWM_SO_OUTBOUND_STATUS.PICKED.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.COMPLETED.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.SHIPPED.badge}
          text={CWM_SO_OUTBOUND_STATUS.SHIPPED.text}
        />);
      }
      return null;
    },
  }, {
    title: this.msg('bondType'),
    width: 120,
    dataIndex: 'bonded',
    render: (bonded, record) => {
      if (!record.so_no) {
        return null;
      }
      if (bonded === 1) {
        const regtype = CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES).filter(sbr =>
          sbr.value === record.bonded_outtype)[0];
        if (regtype) {
          return (<Tag color={regtype.tagcolor}>{regtype.ftztext || '保税'}</Tag>);
        }
      } else if (bonded === -1) {
        return (<Tag>不限</Tag>);
      } else {
        return (<Tag>非保税</Tag>);
      }
      return null;
    },
  }, {
    title: this.msg('regStatus'),
    dataIndex: 'reg_status',
    width: 120,
    render: (o, record) => {
      const regStatus = Object.values(CWM_REG_STATUS).filter(st => st.value === o)[0];
      const isSasbl = SASBL_REG_TYPES.filter(sbr =>
        sbr.value === record.bonded_outtype)[0];
      if (regStatus) {
        return (<span>
          <Badge status={regStatus.badge} text={regStatus.text} />
          {!isSasbl && <RowAction shape="circle" onClick={this.handleSupervision} icon="link" tooltip="查看海关备案" row={record} key="reg" />}
        </span>);
      }
      return null;
    },
  }, {
    title: '收货人',
    dataIndex: 'receiver_name',
    width: 180,
  }, {
    title: '出库时间',
    dataIndex: 'shipped_date',
    width: 140,
    render: o => o && moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建时间',
    width: 140,
    dataIndex: 'created_date',
    render: o => moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '执行人员',
    dataIndex: 'exec_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
    width: 80,
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (record.wave_no) {
        if (!record.so_no) { // 波次订单
          return (<span>
            <RowAction onClick={this.handleWave} icon="eye-o" label="查看波次" row={record} key="view" />
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              {record.outbound_status <= CWM_OUTBOUND_STATUS.CREATED.value && <RowAction
                overlay={
                  <Menu onClick={() => this.handleCancelWave(record.wave_no)}>
                    <Menu.Item key="cancel">{this.msg('取消波次')}</Menu.Item>
                  </Menu>}
              />}
            </PrivilegeCover>
          </span>);
        } else if (record.outbound_status < CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) { // 波次子订单
          return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
            <RowAction onClick={this.handleDeleteSoFromWave} icon="close" label="移出波次" row={record} />
          </PrivilegeCover>);
        } else if (record.outbound_status === CWM_OUTBOUND_STATUS.COMPLETED.value) {
          return (<RowAction onClick={this.handleOutbound} icon="eye-o" label="出库详情" row={record} key="view" />);
        } else if (record.outbound_status >= CWM_OUTBOUND_STATUS.ALL_PICKED.value) {
          return (<RowAction onClick={this.handleOutbound} icon="form" label="出库操作" row={record} key="op" />);
        }
        return null;
      }
      if (record.status === CWM_SO_STATUS.PENDING.value) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction icon="play-circle-o" label="释放" row={record} onClick={this.handleReleaseSO} />
          <RowAction onClick={this.handleEditSO} tooltip="修改" icon="edit" row={record} />
        </PrivilegeCover>);
      }
      const outbndActions = [];
      if (record.status === CWM_SO_STATUS.COMPLETED.value) {
        outbndActions.push(<RowAction onClick={this.handleOutbound} icon="eye-o" label="出库详情" row={record} key="view" />);
      } else if (record.outbound_no) {
        outbndActions.push(<RowAction onClick={this.handleOutbound} icon="form" label="出库操作" row={record} key="op" />);
      }
      return outbndActions;
    },
  }]
  handleSupervision = (row) => {
    const link = row.bonded_outtype === 'transfer' ? `/cwm/supervision/shftz/transfer/out/${row.so_no}`
      : `/cwm/supervision/shftz/release/${row.bonded_outtype}/${row.so_no}`;
    this.context.router.push(link);
  }
  handlePreview = (soNo, outboundNo) => {
    this.props.showDock(soNo, outboundNo);
  }
  handleReleaseSO = (record) => {
    this.props.releaseSo(record.so_no).then((result) => {
      if (!result.error) {
        notification.success({
          message: '操作成功',
          description: `${record.so_no} 已释放`,
        });
        this.handleReload();
      }
    });
  }
  handleBatchRelease = () => {
    const { selectedRows } = this.state;
    const soNos = selectedRows.map(row => row.so_no);
    const { loginId } = this.props;
    this.props.batchRelease(soNos, loginId).then((result) => {
      if (!result.error) {
        notification.success({
          message: '操作成功',
          description: `${soNos.join(',')} 已释放`,
        });
        this.handleReload();
        this.setState({
          selectedRowKeys: [],
        });
      }
    });
  }
  handleBatchShip = () => {
    this.props.openShippingModal();
  }
  handleReload = () => {
    this.props.loadSos({
      whseCode: this.props.defaultWhse.code,
      pageSize: this.props.solist.pageSize,
      current: this.props.solist.current,
      filters: this.props.filters,
    }).then((result) => {
      if (!result.error) {
        this.setState({
          selectedRowKeys: [],
        });
      }
    });
  }
  handleCreateSO = () => {
    this.context.router.push('/cwm/shipping/order/create');
  }
  handleEditSO = (row) => {
    const link = `/cwm/shipping/order/${row.so_no}`;
    this.context.router.push(link);
  }
  handleOutbound = (row) => {
    const link = `/cwm/shipping/outbound/${row.outbound_no}`;
    this.context.router.push(link);
  }
  handleWave = (row) => {
    const link = `/cwm/shipping/wave/${row.wave_no}`;
    this.context.router.push(link);
  }
  handleCancelWave = (waveNo) => {
    this.props.cancelWave(waveNo).then((result) => {
      if (!result.error) {
        notification.success({
          message: '波次取消成功',
        });
        this.handleReload();
      } else {
        notification.error({
          message: '取消失败',
          description: result.data,
        });
      }
    });
  }
  handleDeleteSoFromWave = (row) => {
    this.props.removeWaveOrders([row.so_no], row.wave_no).then((result) => {
      if (!result.error) {
        notification.success({
          message: '移除成功',
        });
        this.handleReload();
      } else {
        notification.error({
          message: '移除失败',
          description: result.data,
        });
      }
    });
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, scenario: key };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleOwnerChange = (value) => {
    const filters = { ...this.props.filters, ownerCode: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadModelAdaptors(`${value === 'all' ? '' : value}`, [LINE_FILE_ADAPTOR_MODELS.CWM_SHIPPING_ORDER.key], true);
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleDeptChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: value, exec_by: null };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleMemberChange = (value) => {
    const filters = { ...this.props.filters, own_dept_id: null, exec_by: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleReceiverChange = (value) => {
    const filters = { ...this.props.filters, receiverCode: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleCarrierChange = (value) => {
    const filters = { ...this.props.filters, carrierCode: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, name: value };
    const whseCode = this.props.defaultWhse.code;
    this.props.loadSos({
      whseCode,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleWhseChange = (value) => {
    const { filters } = this.props;
    this.props.loadSos({
      whseCode: value,
      pageSize: this.props.solist.pageSize,
      current: 1,
      filters,
    });
  }
  handleShowAddToWaveModal = () => {
    const { selectedRows, selectedRowKeys } = this.state;
    const sameOwnerSet = new Set(selectedRows.map(row => row.owner_partner_id));
    if (sameOwnerSet.size === 1) {
      this.props.showAddToWave(selectedRows[0].owner_partner_id, selectedRowKeys);
    } else {
      message.warning('出库单必须为相同货主');
    }
  }
  handleShowCreateWaveModal = () => {
    const { selectedRows, selectedRowKeys } = this.state;
    const sameOwnerSet = new Set(selectedRows.map(row => row.owner_partner_id));
    if (sameOwnerSet.size === 1) {
      this.props.showCreateWave(selectedRowKeys);
    } else {
      message.warning('出库单必须为相同货主');
    }
  }
  handleShowWaveSoListModal = (waveNo) => {
    this.props.showWaveSoListModal(waveNo);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleRowExpand = (expandStatus, row) => {
    const { expandedRowKeys } = this.state;
    if (expandStatus) {
      this.props.loadWaveOrders(row.wave_no, 5);
      this.setState({ expandedRowKeys: expandedRowKeys.concat(row.id) });
    } else {
      this.setState({ expandedRowKeys: expandedRowKeys.filter(rk => rk !== row.id) });
    }
  }
  handleDropDownMenuClick = (ev) => {
    if (ev.key === 'createWave') {
      this.props.showCreateWave(null);
    }
  }
  handleExportExitVoucher = () => {
    const { selectedRows } = this.state;
    this.props.exportNormalExitBySo(selectedRows.map(sr => sr.so_no)).then((resp) => {
      if (!resp.error) {
        let xlsxno = selectedRows.slice(0, 2).map(sr => sr.so_no).join('_');
        if (selectedRows.length > 2) {
          xlsxno = `${xlsxno}等`;
        }
        FileSaver.saveAs(
          new window.Blob([Buffer.from(resp.data)], { type: 'application/octet-stream' }),
          `${xlsxno}_出区凭单.xlsx`
        );
      } else {
        notification.error({
          message: '导出失败',
          description: resp.error.message,
        });
      }
    });
  }
  handleExport = () => {
    this.props.toggleExportPanel(true);
  }
  render() {
    const {
      defaultWhse, owners, filters, loading,
    } = this.props;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    let columns = [...this.columns];
    if (filters.scenario === 'inWave' || filters.scenario === 'prealloc' || filters.scenario === 'allocating' || filters.scenario === 'allocated') {
      const newColumns = Array.from(columns);
      newColumns[1] = {
        title: 'SO编号',
        width: 220,
        dataIndex: 'so_no',
        render: (o, record) => (
          <a onClick={() => this.handlePreview(o, record.outbound_no)}>
            {o}
          </a>),
      };
      newColumns[2] = {
        title: '订单追踪号',
        dataIndex: 'cust_order_no',
        width: 160,
      };
      newColumns[0] = {
        title: '波次',
        dataIndex: 'wave_no',
        width: 180,
        render: (o, record) => {
          if (record.showMore) {
            return (<a onClick={() => this.handleShowWaveSoListModal(record.waveNo)}>查看波次内全部订单
            </a>);
          }
          return o;
        },
      };
      columns = newColumns;
    }
    if (!defaultWhse.bonded) {
      columns = columns.filter(col => !(col.dataIndex === 'bonded' || col.dataIndex === 'reg_status'));
    }
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadSos(params),
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
      remotes: this.props.solist,
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        /* 暂不限制创建波次的条件
        for (let i = 0; i < selectedRows.length; i++) {
          if (selectedRows[i].bonded) {
            this.setState({
              createWaveEnable: false,
            });
            break;
          }
          if (i > 0) {
            if (selectedRows[i].receiver_code !== selectedRows[i - 1].receiver_code &&
              selectedRows[i].carrier_code !== selectedRows[i - 1].carrier_code) {
              this.setState({
                createWaveEnable: false,
              });
              break;
            }
          }
        }
        */
        let { createWaveEnable } = this.state;
        for (let i = 0; i < selectedRows.length; i++) {
          const row = selectedRows[i];
          if (row.wave_no || row.status !== CWM_SO_STATUS.OUTBOUND.value ||
            row.outbound_status !== CWM_SO_OUTBOUND_STATUS.PENDING.value ||
            row.total_prealloc_qty !== row.total_qty) {
            createWaveEnable = false;
            break;
          } else {
            createWaveEnable = true;
          }
        }
        this.setState({ selectedRowKeys, selectedRows, createWaveEnable });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={filters.name} placeholder={this.msg('soPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.ownerCode}
        onChange={this.handleOwnerChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部货主</Option>
        {owners.map(owner => (<Option key={owner.id} value={owner.id}>{owner.name}</Option>))}
      </Select>
      {/*
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.receiverCode}
        onChange={this.handleReceiverChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部收货人</Option>
        {
            receivers.filter(receiver => (filters.ownerCode !== 'all' ?
            filters.ownerCode === receiver.owner_partner_id : true))
            .map(receiver => (
              <Option key={receiver.code} value={receiver.code}>{receiver.name}</Option>))
          }
      </Select>
      <span />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.carrierCode}
        onChange={this.handleCarrierChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部承运人</Option>
        {
            carriers.filter(carrier =>
              (filters.ownerCode !== 'all' ? filters.ownerCode === carrier.owner_partner_id : true))
            .map(carrier => (
              <Option key={carrier.code} value={carrier.code}>{carrier.name}</Option>))
          }
        </Select>
      */}
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
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const bulkActions = (<PrivilegeCover module="cwm" feature="shipping" action="edit">
      {filters.scenario === 'pending' && <Button onClick={this.handleBatchRelease}>释放</Button>}
      {filters.scenario === 'tbdexit' && <Button onClick={this.handleBatchShip}>批量发货</Button>}
      {(filters.scenario === 'partial' || filters.scenario === 'completed') && <Button onClick={this.handleExportExitVoucher}>导出出区凭单</Button>}
      {this.state.createWaveEnable &&
        <Button onClick={this.handleShowCreateWaveModal}>创建波次</Button>}
      {this.state.createWaveEnable && <Button onClick={this.handleShowAddToWaveModal}>加入波次</Button>}
    </PrivilegeCover>
    );
    const dropdownMenuItems = [
      {
        elementKey: 'inWave',
        name: this.msg('shippingWave'),
      },
      {
        elementKey: 'outboundStatus',
        title: this.msg('outboundStatus'),
        elements: Object.keys(CWM_SO_OUTBOUND_STATUS).map(decl => ({
          name: CWM_SO_OUTBOUND_STATUS[decl].text, elementKey: CWM_SO_OUTBOUND_STATUS[decl].key,
        })),
      },
    ];
    if (defaultWhse.bonded) {
      dropdownMenuItems.push({
        elementKey: 'regStatus',
        title: this.msg('regStatus'),
        elements: Object.keys(CWM_REG_STATUS).map(decl => ({
          name: CWM_REG_STATUS[decl].text, elementKey: CWM_REG_STATUS[decl].key,
        })).concat({
          elementKey: 'tbdexit',
          name: this.msg('statusTbdExitable'),
        }),
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
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              <ToolbarAction icon="upload" label={this.msg('import')} onClick={() => { this.setState({ importPanelVisible: true }); }} />
            </PrivilegeCover>
            <PrivilegeCover module="cwm" feature="shipping" action="create">
              <ToolbarAction
                primary
                icon="plus"
                label={this.msg('create')}
                onClick={this.handleCreateSO}
                dropdown={<Menu onClick={this.handleDropDownMenuClick}>
                  <Menu.Item key="createWave"><Icon type="plus" /> {this.msg('创建波次')}</Menu.Item>
                </Menu>}
              />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataSource}
            rowKey="id"
            toolbarActions={toolbarActions}
            loading={loading}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            onExpand={this.handleRowExpand}
            rowClassName={record => record.wave_no && 'table-row-group'}
            indentSize={0}
            expandedRowKeys={this.state.expandedRowKeys}
          />
        </PageContent>
        <ImportDataPanel
          visible={this.state.importPanelVisible}
          adaptors={this.props.adaptors}
          endpoint={`${API_ROOTS.default}v1/cwm/shipping/import/orders`}
          formData={{
              tenantName: this.props.tenantName,
              loginId: this.props.loginId,
              whseCode: defaultWhse.code,
              whseName: defaultWhse.name,
            }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleReload}
          template={`${XLSX_CDN}/SO批量导入模板.xlsx`}
        />
        <ExportDataPanel
          type={LINE_FILE_ADAPTOR_MODELS.CWM_SHIPPING_ORDER.key}
          formData={{
            whseCode: defaultWhse.code,
            filters: {
              ...filters,
              selSoIds: this.state.selectedRowKeys.length > 0 ?
              this.state.selectedRowKeys : undefined,
            },
          }}
        />
        <AddToWaveModal reload={this.handleReload} />
        <CreateWaveModal reload={this.handleReload} />
        <ShippingModal shipMode="batchSo" selectedRows={this.state.selectedRows.map(sr => sr.so_no)} onShipped={this.handleReload} />
        <WaveSoListModal viewOutbound={this.handleOutbound} />
      </Layout>
    );
  }
}
