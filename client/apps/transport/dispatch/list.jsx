import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Layout, message, Select, Modal, Alert } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import connectFetch from 'client/common/decorators/connect-fetch';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import {
  loadTable,
  doSend,
  doReturn,
  segmentCancelRequest,
  segmentCancelCheckRequest,
  loadExpandList,
  loadShipmtsGrouped,
  loadShipmtsGroupedSub,
  loadSegRq,
  removeGroupedSubShipmt,
  changeDockStatus,
  toggleConsolidationModal,
} from 'common/reducers/transportDispatch';
import { LogixIcon } from 'client/components/FontIcon';
import { SHIPMENT_TRACK_STATUS, SHIPMENT_VEHICLE_CONNECT, TRANS_MODE_INDICATOR } from 'common/constants';
import { loadShipmtDetail, setConsignFields } from 'common/reducers/shipment';
import SearchBox from 'client/components/SearchBox';
import Condition from './condition';
import DispatchDock from './dispatchDock';
import SegmentDock from './segmentDock';
import ShipmtnoColumn from '../common/shipmtnoColumn';
import AddressColumn from '../common/addressColumn';
import RevokeModal from '../common/modal/revokeModal';
import MyShipmentsSelect from '../common/myShipmentsSelect';
import ShipmentAdvanceModal from '../tracking/modals/shipment-advance-modal';
import CreateSpecialCharge from '../tracking/modals/create-specialCharge';
import CustomerSelect from '../common/customerSelect';
import ConsolidationModal from './modal/consolidationModal';
import { formatMsg } from './message.i18n';

const { Option } = Select;

function fetch({ state, dispatch, cookie }) {
  return dispatch(loadSegRq(cookie, {
    tenantId: state.account.tenantId,
  }));
}
function mergeFilters(curFilters, name, value) {
  const newFilters = {};
  Object.keys(curFilters).forEach((key) => {
    if (key !== name) {
      newFilters[key] = curFilters[key];
    }
  });
  if (value !== null && value !== undefined && value !== '') {
    newFilters[name] = value;
  }
  return newFilters;
}

@connectFetch()(fetch)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    loginName: state.account.username,
    avatar: state.account.profile.avatar,
    shipmentlist: state.transportDispatch.shipmentlist,
    filters: { ...state.transportDispatch.filters, loginId: state.account.loginId },
    loading: state.transportDispatch.loading,
    expandList: state.transportDispatch.expandList,
    cond: state.transportDispatch.cond,
    loaded: state.transportDispatch.loaded,
  }),
  {
    loadTable,
    doReturn,
    doSend,
    segmentCancelRequest,
    segmentCancelCheckRequest,
    loadExpandList,
    loadShipmtsGrouped,
    loadShipmtsGroupedSub,
    removeGroupedSubShipmt,
    loadShipmtDetail,
    changeDockStatus,
    toggleConsolidationModal,
    setConsignFields,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsDispatch',
})
@withPrivilege({ module: 'transport', feature: 'dispatch' })
export default class DispatchList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    loginName: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    filters: PropTypes.shape({ shipmt_no: PropTypes.string }).isRequired,
    loading: PropTypes.bool.isRequired,
    shipmentlist: PropTypes.shape({ pageSize: PropTypes.number }).isRequired,
    loadTable: PropTypes.func.isRequired,
    doSend: PropTypes.func.isRequired,
    doReturn: PropTypes.func.isRequired,
    segmentCancelRequest: PropTypes.func.isRequired,
    segmentCancelCheckRequest: PropTypes.func.isRequired,
    loadShipmtsGroupedSub: PropTypes.func.isRequired,
    loadShipmtsGrouped: PropTypes.func.isRequired,
    removeGroupedSubShipmt: PropTypes.func.isRequired,
    loadExpandList: PropTypes.func.isRequired,
    loadShipmtDetail: PropTypes.func.isRequired,
    changeDockStatus: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
  }
  state = {
    selectedRowKeys: [],
    advancedSearchVisible: false,
    scrollOffset: 276,
    advSearchCollapsed: true,
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.loaded && !nextProps.loading) {
      const { filters } = this.props;
      this.handleStatusChange(filters.status);
    }
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadTable(null, params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        tenantId: this.props.tenantId,
        pageSize: pagination.pageSize,
        current: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        filters: JSON.stringify(this.props.filters),
      };
      return params;
    },
    remotes: this.props.shipmentlist,
  })

  msg = formatMsg(this.props.intl)
  commonCols = [{
    title: this.msg('packageNum'),
    dataIndex: 'total_count',
    width: 60,
  }, {
    title: this.msg('shipWeight'),
    dataIndex: 'total_weight',
    width: 60,
  }, {
    title: this.msg('shipVolume'),
    dataIndex: 'total_volume',
    width: 60,
  }, {
    title: this.msg('shipPickupDate'),
    dataIndex: 'pickup_est_date',
    width: 90,
    render: (o, record) => moment(record.pickup_est_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('shipConsigner'),
    dataIndex: 'consigner_name',
    width: 120,
  }, {
    title: this.msg('consignerPlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
  }, {
    title: this.msg('consignerAddr'),
    dataIndex: 'consigner_addr',
    width: 140,
  }, {
    title: this.msg('shipDeliveryDate'),
    dataIndex: 'deliver_est_date',
    width: 90,
    render: (o, record) => moment(record.deliver_est_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('shipConsignee'),
    dataIndex: 'consignee_name',
    width: 120,
  }, {
    title: this.msg('consigneePlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
  }, {
    title: this.msg('consigneeAddr'),
    dataIndex: 'consignee_addr',
    width: 140,
  }];
  buildCols(sub) {
    const { status, origin } = this.props.filters;
    const s = status;
    let t = this.msg('shipNo');
    let fixedRight = 'right';
    if (origin) {
      t = this.msg('originShipNo');
      fixedRight = false;
    }
    if (sub === 'sub') {
      t = this.msg('segmentShipNo');
      fixedRight = false;
    }
    if (sub === 'merge') {
      fixedRight = false;
    }
    let cols = [{
      title: t,
      dataIndex: 'shipmt_no',
      width: 220,
      render: (o, record) => {
        if (!sub) {
          return (
            <ShipmtnoColumn
              shipmtNo={record.shipmt_no}
              shipment={record}
              onClick={this.handleShipmtPreview}
            />
          );
        }
        return (<span>{o}</span>);
      },
    }, {
      title: this.msg('refCustomerNo'),
      dataIndex: 'ref_external_no',
      width: 110,
    }];
    if (s === 'waiting') {
      cols.push({
        title: this.msg('shipRequirement'),
        dataIndex: 'sr_name',
        width: 200,
      }, {
        title: this.msg('shipMode'),
        dataIndex: 'transport_mode_code',
        width: 100,
        render: (o, record) => {
          const mode = TRANS_MODE_INDICATOR.filter(ts => ts.value === o)[0];
          return mode ? <span><LogixIcon type={`icon-${mode.icon}`} /> {mode.text}</span>
            : <span>{record.transport_mode}</span>;
        },
      });
      cols = cols.concat(this.commonCols);
      cols.push({
        title: this.msg('shipAcceptTime'),
        dataIndex: 'acpt_time',
        width: 100,
        render: (text, record) => (record.acpt_time ?
          moment(record.acpt_time).format('MM-DD HH:mm') : ' '),
      }, {
        title: this.msg('spDispLoginName'),
        dataIndex: 'sp_disp_login_name',
        width: 80,
      }, {
        title: this.msg('shipmtOP'),
        width: 100,
        fixed: fixedRight,
        dataIndex: 'OPS_COL',
        render: (o, record) => {
          if (!record.parent_no) {
            if (sub === 'merge') {
              return (<span><a role="presentation" onClick={() => this.handleRemoveShipmt(record)}>
                {this.msg('btnTextRemove')}
              </a>
              </span>);
            }
            if (origin) {
              if (record.segmented === 1 && sub !== 'sub') {
                return (<span>
                  <a role="presentation" onClick={ev => this.handleSegmentCancelConfirm(record, ev)}>
                    {this.msg('btnTextSegmentCancel')}
                  </a>
                </span>);
              }
              return (<span />);
            }
            return (
              <PrivilegeCover module="transport" feature="dispatch" action="create">
                <span>
                  <a role="presentation" onClick={ev => this.handleDispatchDockShow(record, ev)}>
                    {this.msg('btnTextDispatch')}
                  </a>
                  <span className="ant-divider" />
                  <a role="presentation" onClick={ev => this.handleSegmentDockShow(record, ev)}>
                    {this.msg('btnTextSegment')}
                  </a>
                </span>
              </PrivilegeCover>
            );
          }
          return <span />;
        },
      });
    } else if (s === 'dispatching' || s === 'dispatched') {
      cols.push({
        title: this.msg('shipSp'),
        dataIndex: 'sp_name',
        width: 180,
        render: (o, record) => {
          if (record.sp_name) {
            // const spSpan = <TrimSpan text={record.sp_name} maxLen={10} />;
            if (record.sp_tenant_id > 0) {
              // todo pure css circle
              return (
                <span>
                  <i className="zmdi zmdi-circle mdc-text-green" />
                  {record.sp_name}
                </span>
              );
            } else if (record.sp_tenant_id === -1) {
              return (
                <span>
                  <i className="zmdi zmdi-circle mdc-text-grey" />
                  {record.sp_name}
                </span>
              );
            }
            return record.sp_name;
          }
          return this.msg('ownFleet');
        },
      }, {
        title: this.msg('shipVehicle'),
        dataIndex: 'task_vehicle',
        width: 80,
      });
      cols = cols.concat(this.commonCols);
      let timetitle = this.msg('shipDispTime');
      if (s === 'dispatched') {
        timetitle = this.msg('shipSendTime');
      }
      cols.push({
        title: timetitle,
        dataIndex: 'disp_time',
        width: 100,
        render: (text, record) => (record.disp_time ?
          moment(record.disp_time).format('MM-DD HH:mm') : ' '),
      }, {
        title: this.msg('spDispLoginName'),
        dataIndex: 'sp_disp_login_name',
        width: 80,
      }, {
        title: this.msg('shipmtOP'),
        width: 100,
        fixed: fixedRight,
        dataIndex: 'OPS_COL',
        render: (o, record) => {
          if (s === 'dispatched') { // record is downstream dispatch
            if (record.status < SHIPMENT_TRACK_STATUS.intransit && ( // 线下承运商和线下车队直接退回
              (record.sp_tenant_id === 0 && record.vehicle_connect_type ===
                SHIPMENT_VEHICLE_CONNECT.disconnected) ||
              record.sp_tenant_id === -1 || (record.status ===
              SHIPMENT_TRACK_STATUS.unaccepted))) { // 线上承运商未接单可退回
              return (
                <PrivilegeCover module="transport" feature="dispatch" action="edit">
                  <span>
                    <a role="presentation" onClick={ev => this.handleShipmtReturn(record, ev)}>
                      {this.msg('btnTextReturn')}
                    </a>
                  </span>
                </PrivilegeCover>
              );
            }
            return (<span />);
          }
          if (!record.parent_no) { // 接单 源运单有parent_no 不分配,  分段运单存在parent_no 需要分配TODO
            return (
              <PrivilegeCover module="transport" feature="dispatch" action="edit">
                <span>
                  <a role="presentation" onClick={ev => this.handleShipmtSend(record, ev)}>
                    {this.msg('btnTextSend')}
                  </a>
                  <span className="ant-divider" />
                  <a role="presentation" onClick={ev => this.handleShipmtReturn(record, ev)}>
                    {this.msg('btnTextReturn')}
                  </a>
                </span>
              </PrivilegeCover>
            );
          }
          return <span />;
        },
      });
    }

    return cols;
  }

  buildConditionCols() {
    const cols = [{
      title: this.msg('shipNoCount'),
      dataIndex: 'count',
      width: 100,
    }, {
      title: this.msg('shipConsigner'),
      dataIndex: 'consigner_name',
      width: 180,
    }, {
      title: this.msg('consignerPlace'),
      width: 250,
      render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
    }, {
      title: this.msg('consignerAddr'),
      dataIndex: 'consigner_addr',
      width: 200,
    }, {
      title: this.msg('shipConsignee'),
      dataIndex: 'consignee_name',
      width: 180,
    }, {
      title: this.msg('consigneePlace'),
      width: 250,
      render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
    }, {
      title: this.msg('consigneeAddr'),
      dataIndex: 'consignee_addr',
      width: 200,
    }, {
      title: this.msg('shipmtOP'),
      width: 100,
      dataIndex: 'OPS_COL',
      render: (o, record) => (
        <PrivilegeCover module="transport" feature="dispatch" action="create">
          <span>
            <a role="presentation" onClick={ev => this.handleCondDispatchDockShow(record, ev)}>
              {this.msg('btnTextDispatch')}
            </a>
            <span className="ant-divider" />
            <a role="presentation" onClick={ev => this.handleCondSegmentDockShow(record, ev)}>
              {this.msg('btnTextSegment')}
            </a>
          </span>
        </PrivilegeCover>
      ),
    }];

    return cols;
  }

  handleSelectionClear = () => {
    this.setState({ selectedRowKeys: [] });
  }

  msgWrapper = s => this.msg(s)

  handleShipmtPreview = (row) => {
    const { status } = this.props.filters;
    let sourceType = 'sp';
    if (status === 'dispatched') sourceType = 'sr';
    else sourceType = 'sp';
    this.props.loadShipmtDetail(row.shipmt_no, this.props.tenantId, sourceType, 'masterInfo', row).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }

  handleStatusChange = (key) => {
    const { shipmentlist, tenantId, filters } = this.props;
    const tmp = Object.assign({}, filters);
    tmp.status = key;
    tmp.origin = 0;

    this.props.loadTable(null, {
      tenantId,
      filters: JSON.stringify(tmp),
      pageSize: shipmentlist.pageSize,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handlePanelHeaderChange();
      }
    });
  }

  handleTableLoad = (newFilters) => {
    const { shipmentlist, tenantId, filters } = this.props;
    const tmp = Object.assign({}, filters);

    this.props.loadTable(null, {
      tenantId,
      filters: JSON.stringify(newFilters || tmp),
      pageSize: shipmentlist.pageSize,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handlePanelHeaderChange();
      }
    });
  }

  handlePanelHeaderChange() {
    const { status, origin } = this.props.filters;
    const { type } = this.props.cond;
    const panelHeader = [];
    if (type !== 'none') {
      let str = '已经按线路汇总';
      if (type === 'consigner') {
        str = '已经按发货汇总';
      } else if (type === 'consignee') {
        str = '已经按到货汇总';
      }
      const tmp = (<div className="dispatch-condition-head">
        <Button onClick={this.handleOriginShipmtsReturn}>
          <span>{this.msg('btnTextReturnList')}</span>
          <Icon type="eye-o" />
        </Button>
        <Alert message={str} type="info" showIcon />
      </div>);
      panelHeader.push(tmp);
    } else if (origin) {
      panelHeader.push(
        (<span className="ant-divider" style={{ width: '0px' }} />),
        (<Button onClick={this.handleOriginShipmtsReturn}><span>{this.msg('btnTextReturnList')}</span><Icon type="eye-o" /></Button>)
      );
    } else if (status === 'waiting') {
      panelHeader.push(
        (<Condition msg={this.msgWrapper} onConditionChange={this.handleConditionChange} />),
        (<Button onClick={this.handleOriginShipmts}><span>{this.msg('btnTextOriginShipments')}</span><Icon type="eye" /></Button>)
      );
    } else if (status === 'dispatched') {
      panelHeader.push(
        (<Select defaultValue="0" style={{ width: 90 }} onChange={this.handleDayChange}>
          <Option value="0">最近七天</Option>
          <Option value="1">最近一月</Option>
        </Select>),
        (<Button onClick={this.handleExportDispShipmts} icon="export"><span>{this.msg('btnTextExport')}</span></Button>)
      );
    }

    this.setState({ /* panelHeader, */ selectedRowKeys: [] });
    this.props.changeDockStatus({ dispDockShow: false, segDockShow: false, shipmts: [] });
  }

  handleSearch = (searchVal) => {
    const filters = mergeFilters(this.props.filters, 'shipmt_no', searchVal);
    this.handleTableLoad(filters);
  }

  handleAdvancedSearch = (searchVals) => {
    let { filters } = this.props;
    Object.keys(searchVals).forEach((key) => {
      filters = mergeFilters(filters, key, searchVals[key]);
    });
    this.handleTableLoad(filters);
    this.showAdvancedSearch(false);
  }
  handleCustomerChange = (srPartnerId, srTenantId) => {
    let value;
    if (srPartnerId !== -1) {
      value = srPartnerId;
    }
    let filters = mergeFilters(this.props.filters, 'sr_partner_id', value);
    filters = mergeFilters(this.props.filters, 'sr_tenant_id', srTenantId);
    this.handleTableLoad(filters);
  }

  handleDispatchDockShow(shipmt, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!shipmt.children) {
      this.setState({ selectedRowKeys: [shipmt.key] });
    }
    this.props.changeDockStatus({ dispDockShow: true, shipmts: [shipmt] });
  }

  handleBatchDockShow(type) {
    const { shipmentlist } = this.props;
    const { selectedRowKeys } = this.state;
    const shipmts = [];
    shipmentlist.data.forEach((s) => {
      if (selectedRowKeys.indexOf(s.key) > -1) {
        shipmts.push(s);
      }
    });
    if (type === 'dispatch') {
      this.props.changeDockStatus({ dispDockShow: true, shipmts });
    } else {
      this.props.changeDockStatus({ segDockShow: true, shipmts });
    }
  }

  handleSegmentDockShow(shipmt, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!shipmt.children) {
      this.setState({ selectedRowKeys: [shipmt.key] });
    }
    this.props.changeDockStatus({ segDockShow: true, shipmts: [shipmt] });
  }

  handleSegmentCancelConfirm = (shipmt, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { tenantId } = this.props;
    this.props.segmentCancelCheckRequest(null, {
      tenantId,
      shipmtNo: shipmt.shipmt_no,
    }).then((rs) => {
      if (!rs.data) {
        message.error(`${shipmt.shipmt_no}-分段运单中已存在预分配，不能取消分段，必须分配退回后才能操作！`, 5);
      } else {
        Modal.confirm({
          content: `确定取消对运单编号为【${shipmt.shipmt_no}】的分段？`,
          okText: this.msg('btnTextOk'),
          cancelText: this.msg('btnTextCancel'),
          onOk: () => {
            this.props.segmentCancelRequest(null, {
              tenantId,
              shipmtNo: shipmt.shipmt_no,
            }).then((result) => {
              if (result.error) {
                message.error(result.error.message, 5);
              } else {
                this.handleOriginShipmts();
              }
            });
          },
        });
      }
    });
  }

  handleShipmtBatchSend() {
    const { shipmentlist } = this.props;
    const { selectedRowKeys } = this.state;
    const count = selectedRowKeys.length;
    const list = [];
    shipmentlist.data.forEach((s) => {
      if (selectedRowKeys.indexOf(s.key) > -1) {
        list.push({
          dispId: s.key,
          shipmtNo: s.shipmt_no,
          parentId: s.parent_id,
          sp_tenant_id: s.sp_tenant_id,
          sr_name: s.sr_name,
          status: s.status,
          consigner_province: s.consigner_province,
          consigner_city: s.consigner_city,
          consigner_district: s.consigner_district,
          consignee_province: s.consignee_province,
          consignee_city: s.consignee_city,
          consignee_district: s.consignee_district,
        });
      }
    });

    Modal.confirm({
      title: '确认批量发送运单',
      content: `将已选定的${count}个运单发送给承运商？`,
      okText: this.msg('btnTextOk'),
      cancelText: this.msg('btnTextCancel'),
      onOk: () => {
        if (count === 0) {
          return;
        }
        const {
          tenantId, loginId, avatar, loginName,
        } = this.props;
        this.props.doSend(null, {
          tenantId,
          loginId,
          avatar,
          loginName,
          list: JSON.stringify(list),
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            this.handleStatusChange('dispatching');
          }
        });
      },
    });
  }

  handleShipmtSend(shipmt, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let msg = `将【${shipmt.shipmt_no}】运单发送给【${shipmt.sp_name}】？`;
    if (!shipmt.sp_tenant_id && shipmt.task_id > 0) {
      msg = `将【${shipmt.shipmt_no}】运单发送给【${shipmt.task_vehicle}】？`;
    }
    Modal.confirm({
      title: '确认发送运单',
      content: msg,
      okText: this.msg('btnTextOk'),
      cancelText: this.msg('btnTextCancel'),
      onOk: () => {
        const {
          tenantId, loginId, avatar, loginName,
        } = this.props;
        this.props.doSend(null, {
          tenantId,
          loginId,
          avatar,
          loginName,
          list: JSON.stringify([{
            dispId: shipmt.key,
            shipmtNo: shipmt.shipmt_no,
            sp_tenant_id: shipmt.sp_tenant_id,
            sr_name: shipmt.sr_name,
            status: shipmt.status,
            consigner_province: shipmt.consigner_province,
            consigner_city: shipmt.consigner_city,
            consigner_district: shipmt.consigner_district,
            consignee_province: shipmt.consignee_province,
            consignee_city: shipmt.consignee_city,
            consignee_district: shipmt.consignee_district,
            parentId: shipmt.parent_id,
          }]),
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            this.handleStatusChange('dispatching');
          }
        });
      },
    });
  }

  handleShipmtReturn(shipmt, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const { status } = this.props.filters;
    let msg = `将预分配给【${shipmt.sp_name}】的【${shipmt.shipmt_no}】运单退回吗？`;
    if (!shipmt.sp_tenant_id && shipmt.task_id > 0) {
      msg = `将预分配给【${shipmt.task_vehicle}】的【${shipmt.shipmt_no}】运单退回吗？`;
    }

    Modal.confirm({
      title: '确认退回运单',
      content: msg,
      okText: this.msg('btnTextOk'),
      cancelText: this.msg('btnTextCancel'),
      onOk: () => {
        const { tenantId } = this.props;
        this.props.doReturn(null, {
          tenantId,
          dispId: shipmt.key,
          parentId: shipmt.parent_id,
          shipmtNo: shipmt.shipmt_no,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            this.handleStatusChange(status);
          }
        });
      },
    });
  }

  handleDayChange = () => {

  }

  handleExportDispShipmts = () => {

  }

  handleConditionChange = (condition) => {
    const { tenantId, shipmentlist } = this.props;
    this.props.loadShipmtsGrouped(null, {
      tenantId,
      filters: JSON.stringify(condition),
      pageSize: shipmentlist.pageSize,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handlePanelHeaderChange();
      }
    });
  }

  handleOriginShipmtsReturn = () => {
    this.handleStatusChange('waiting');
  }

  handleOriginShipmts = () => {
    const { shipmentlist, tenantId, filters } = this.props;
    const tmp = Object.assign({}, filters);
    tmp.origin = 1;

    this.props.loadTable(null, {
      tenantId,
      filters: JSON.stringify(tmp),
      pageSize: shipmentlist.pageSize,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handlePanelHeaderChange();
      }
    });
  }

  handleExpandList = (row) => {
    const { tenantId } = this.props;
    if (!this.props.expandList[row.shipmt_no]) {
      this.props.loadExpandList(null, {
        tenantId,
        shipmtNo: row.shipmt_no,
        srTenantId: row.sr_tenant_id,
        spTenantId: row.sp_tenant_id,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        }
      });
    }
    const ccols = this.buildCols('sub');

    return (<DataTable
      columns={ccols}
      pagination={false}
      dataSource={this.props.expandList[row.shipmt_no] || []}
      size="small"
    />);
  }

  handleRemoveShipmt = (row) => {
    this.props.removeGroupedSubShipmt(row.parentKey, row.shipmt_no);
  }

  genFilters(row) {
    const { type, consignerStep, consigneeStep } = this.props.cond;
    const filters = {};
    let cer = false;
    let cee = false;
    if (type === 'subline') {
      cer = true;
      cee = true;
    } else if (type === 'consigner') {
      cer = true;
    } else {
      cee = true;
    }
    if (cer) {
      switch (consignerStep) {
        case 20:
          filters.consigner_province = row.consigner_province;
          filters.consigner_city = row.consigner_city;
          break;
        case 40:
          filters.consigner_district = row.consigner_district;
          break;
        case 60:
          filters.consigner_addr = row.consigner_addr;
          break;
        case 80:
          filters.consigner_addr = row.consigner_addr;
          filters.consigner_name = row.consigner_name;
          break;
        default:
          filters.consigner_province = row.consigner_province;
          break;
      }
    }
    if (cee) {
      switch (consigneeStep) {
        case 20:
          filters.consignee_province = row.consignee_province;
          filters.consignee_city = row.consignee_city;
          break;
        case 40:
          filters.consignee_district = row.consignee_district;
          break;
        case 60:
          filters.consignee_addr = row.consignee_addr;
          break;
        case 80:
          filters.consignee_addr = row.consignee_addr;
          filters.consignee_name = row.consignee_name;
          break;
        default:
          filters.consignee_province = row.consignee_province;
          break;
      }
    }
    return filters;
  }

  handleCondDispatchDockShow = (row, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { tenantId } = this.props;
    const filters = this.genFilters(row);
    if (!this.props.expandList[row.key]) {
      this.props.loadShipmtsGroupedSub(null, {
        tenantId,
        filters: JSON.stringify(filters),
        shipmtNo: row.key,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        } else {
          this.props.changeDockStatus({ dispDockShow: true, shipmts: result.data });
        }
      });
    } else {
      this.props.changeDockStatus({ dispDockShow: true, shipmts: this.props.expandList[row.key] });
    }
  }

  handleCondSegmentDockShow = (row, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { tenantId } = this.props;
    const filters = this.genFilters(row);
    if (!this.props.expandList[row.key]) {
      this.props.loadShipmtsGroupedSub(null, {
        tenantId,
        filters: JSON.stringify(filters),
        shipmtNo: row.key,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        } else {
          this.props.changeDockStatus({ segDockShow: true, shipmts: result.data });
        }
      });
    } else {
      this.props.changeDockStatus({ segDockShow: true, shipmts: this.props.expandList[row.key] });
    }
  }

  handleConditionExpandList = (row) => {
    const filters = this.genFilters(row);
    const { tenantId } = this.props;
    if (!this.props.expandList[row.key]) {
      this.props.loadShipmtsGroupedSub(null, {
        tenantId,
        filters: JSON.stringify(filters),
        shipmtNo: row.key,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        }
      });
    }
    const ccols = this.buildCols('merge');

    return (<DataTable
      columns={ccols}
      pagination={false}
      dataSource={this.props.expandList[row.key] || []}
      size="small"
    />);
  }

  toggleAdvancedSearch = () => {
    this.setState({
      advancedSearchVisible: !this.state.advancedSearchVisible,
      advSearchCollapsed: !this.state.advSearchCollapsed,
    });
  }
  showAdvancedSearch = (advancedSearchVisible) => {
    this.setState({ advancedSearchVisible });
  }
  handleCollapseChange = (collapsed) => {
    const scrollOffset = collapsed ? 395 : 258;
    this.setState({ scrollOffset, advSearchCollapsed: !collapsed });
  }
  handleConsolidation = () => {
    const { selectedRowKeys } = this.state;
    const records = this.props.shipmentlist.data.filter(data =>
      selectedRowKeys.find(key => key === data.key));
    this.props.toggleConsolidationModal(true, records.map(re => ({
      shipmt_no: re.shipmt_no,
      sr_name: re.sr_name,
      consigner_province: re.consigner_province,
      consigner_city: re.consigner_city,
      consigner_district: re.consigner_district,
      consigner_street: re.consigner_street,
      consigner_addr: re.consigner_addr,
      consigner_region_code: re.consigner_region_code,
      consignee_province: re.consignee_province,
      consignee_city: re.consignee_city,
      consignee_district: re.consignee_district,
      consignee_street: re.consignee_street,
      consignee_addr: re.consignee_addr,
      consignee_region_code: re.consignee_region_code,
      pickup_est_date: re.pickup_est_date,
      deliver_est_date: re.deliver_est_date,
      consigner_name: re.consigner_name,
      transit_time: re.transit_time,
      total_count: re.total_count,
      total_volume: re.total_volume,
      total_weight: re.total_weight,
    })));
    this.props.setConsignFields({
      transport_mode_id: '',
      transport_mode_code: '',
      transit_time: 0,
      deliver_est_date: '',
      pickup_est_date: '',
    });
  }
  render() {
    const { shipmentlist, loading, filters } = this.props;
    this.dataSource.remotes = shipmentlist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: (record) => {
        const shipmt = shipmentlist.data.find(item => item.key === record.key);
        if (shipmt && shipmt.children) {
          return { disabled: true };
        }
        if (record.parent_no) {
          return { disabled: true };
        }
        return { disabled: false };
      },
    };
    const { status, origin } = this.props.filters;
    const { type } = this.props.cond;
    let cols = this.buildCols();

    const toolbarActions = (<span>
      <SearchBox placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} value={filters.shipmt_no} />
      <CustomerSelect onChange={this.handleCustomerChange} />
      <MyShipmentsSelect onChange={this.handleAdvancedSearch} />
    </span>);
    let bulkBtns = null;
    if (status === 'waiting') {
      bulkBtns = (
        <span>
          <Button type="default" onClick={() => { this.handleBatchDockShow('dispatch'); }}>
            {this.msg('btnTextBatchDispatch')}
          </Button>
          <Button onClick={() => this.handleBatchDockShow()}>
            {this.msg('btnTextBatchSegment')}
          </Button>
          <Button onClick={this.handleConsolidation} type="primary" >
            {this.msg('dispConsolidation')}
          </Button>
        </span>
      );
    } else if (status === 'dispatching') {
      bulkBtns = (
        <Button type="default" onClick={() => this.handleShipmtBatchSend()}>
          {this.msg('btnTextBatchSend')}
        </Button>
      );
    }
    let tb = (<DataTable
      toolbarActions={toolbarActions}
      bulkActions={bulkBtns}
      selectedRowKeys={this.state.selectedRowKeys}
      rowSelection={rowSelection}
      columns={cols}
      loading={loading}
      dataSource={this.dataSource}
      scrollOffset={this.state.scrollOffset}
    />);
    if (origin) {
      tb = (<DataTable
        toolbarActions={toolbarActions}
        bulkActions={bulkBtns}
        selectedRowKeys={this.state.selectedRowKeys}
        expandedRowRender={this.handleExpandList}
        columns={cols}
        loading={loading}
        dataSource={this.dataSource}
        scrollOffset={this.state.scrollOffset}
      />);
    }
    if (type !== 'none') {
      cols = this.buildConditionCols();
      tb = (<DataTable
        toolbarActions={toolbarActions}
        bulkActions={bulkBtns}
        selectedRowKeys={this.state.selectedRowKeys}
        expandedRowRender={this.handleConditionExpandList}
        columns={cols}
        loading={loading}
        dataSource={this.dataSource}
        scrollOffset={this.state.scrollOffset}
      />);
    }
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems: [
        { elementKey: 'waiting', name: this.msg('rdTextWaiting') },
        { elementKey: 'dispatching', name: this.msg('rdTextDispatching') },
        { elementKey: 'dispatched', name: this.msg('rdTextDispatched') },
      ],
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} />
        <PageContent>
          {tb}
        </PageContent>
        <DispatchDock />
        <SegmentDock />
        <RevokeModal reload={this.handleTableLoad} />
        <ShipmentAdvanceModal />
        <CreateSpecialCharge />
        <ConsolidationModal reload={this.handleTableLoad} />
      </Layout>
    );
  }
}
