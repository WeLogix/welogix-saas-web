import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, message, Tag } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { LogixIcon } from 'client/components/FontIcon';
import { loadTable, revokeOrReject, delDraft, acceptDispShipment, returnShipment } from
  'common/reducers/transport-acceptance';
import { loadShipmtDetail } from 'common/reducers/shipment';
import { SHIPMENT_SOURCE, SHIPMENT_EFFECTIVES, SHIPMENT_TRACK_STATUS, TRANS_MODE_INDICATOR } from 'common/constants';
import ShipmentAdvanceModal from 'client/apps/transport/tracking/modals/shipment-advance-modal';
import CreateSpecialCharge from 'client/apps/transport/tracking/modals/create-specialCharge';
import RevokeModal from '../common/modal/revokeModal';
import ShipmtnoColumn from '../common/shipmtnoColumn';
import AddressColumn from '../common/addressColumn';
import DispatchDock from '../dispatch/dispatchDock';
import SegmentDock from '../dispatch/segmentDock';
import CustomerSelect from '../common/customerSelect';
import CreatorSelect from '../common/creatorSelect';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

function TransitTimeLabel(props) {
  const { time, tformat } = props;
  let msg;
  if (time === 0) {
    msg = tformat('transitTimeToday');
  } else if (time) {
    msg = `${time}${tformat('day')}`;
  } else {
    msg = '';
  }
  return <span>{msg}</span>;
}

// function isCompleteShipment(shipmt) {
//   return shipmt.consigner_name && shipmt.consignee_province &&
//       shipmt.deliver_est_date && shipmt.pickup_est_date;
// }

function mergeFilters(curFilters, name, value) {
  const merged = curFilters.filter(flt => flt.name !== name);
  if (value !== null && value !== undefined && value !== '') {
    merged.push({
      name,
      value,
    });
  }
  return merged;
}

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    acpterId: state.account.loginId,
    acpterName: state.account.username,
    shipmentlist: state.transportAcceptance.table.shipmentlist,
    filters: state.transportAcceptance.table.filters,
    loading: state.transportAcceptance.table.loading,
    loaded: state.transportAcceptance.table.loaded,
    sortField: state.transportAcceptance.table.sortField,
    sortOrder: state.transportAcceptance.table.sortOrder,
    todos: state.shipment.statistics.todos,
  }),
  {
    loadTable, revokeOrReject, loadShipmtDetail, delDraft, acceptDispShipment, returnShipment,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsPlanning',
})
@withPrivilege({ module: 'transport', feature: 'shipment' })
export default class AcceptList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string })).isRequired,
    sortField: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    shipmentlist: PropTypes.shape({ currentPage: PropTypes.number }).isRequired,
    delDraft: PropTypes.func.isRequired,
    revokeOrReject: PropTypes.func.isRequired,
    loadShipmtDetail: PropTypes.func.isRequired,
    loadTable: PropTypes.func.isRequired,
    returnShipment: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    selectedPartnerIds: [],
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.loaded && !nextProps.loading) {
      this.handleTableLoad();
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
        currentPage: pagination.current,
        sortField: sorter.field || this.props.sortField,
        sortOrder: this.props.sortOrder,
        filters: JSON.stringify(this.props.filters),
      };
      return params;
    },
    remotes: this.props.shipmentlist,
  })
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('shipNo'),
    dataIndex: 'shipmt_no',
    width: 180,
    render: (o, record) => {
      let style;
      if (record.effective === SHIPMENT_EFFECTIVES.cancelled) {
        style = { color: '#999' };
        return (<span style={style} >{record.shipmt_no}</span>);
      }
      return (
        <ShipmtnoColumn
          shipmtNo={record.shipmt_no}
          style={style}
          shipment={record}
          onClick={this.handleShipmtPreview}
        />
      );
    },
  }, {
    title: this.msg('shipRequirement'),
    dataIndex: 'sr_name',
    width: 190,
  }, {
    title: this.msg('refCustomerNo'),
    dataIndex: 'ref_external_no',
    width: 110,
  }, {
    title: this.msg('shipMode'),
    dataIndex: 'transport_mode_code',
    width: 100,
    render: (o, record) => {
      const mode = TRANS_MODE_INDICATOR.filter(ts => ts.value === o)[0];
      return mode ? <span><LogixIcon type={`icon-${mode.icon}`} /> {mode.text}</span>
        : <span>{record.transport_mode}</span>;
    },
  }, {
    title: this.msg('shipPickupDate'),
    dataIndex: 'pickup_est_date',
    width: 100,
    render: (o, record) => (o ? moment(record.pickup_est_date).format('YYYY.MM.DD') : ''),
  }, {
    title: this.msg('shipTransitTime'),
    dataIndex: 'transit_time',
    width: 80,
    render: (o, record) => <TransitTimeLabel time={record.transit_time} tformat={this.msg} />,
  }, {
    title: this.msg('shipDeliveryDate'),
    dataIndex: 'deliver_est_date',
    width: 100,
    render: (o, record) => (o ? moment(record.deliver_est_date).format('YYYY.MM.DD') : ''),
  }, {
    title: this.msg('shipConsignor'),
    dataIndex: 'consigner_name',
    width: 150,
  }, {
    title: this.msg('consignorPlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
  }, {
    title: this.msg('consignorAddr'),
    dataIndex: 'consigner_addr',
    width: 150,
  }, {
    title: this.msg('shipConsignee'),
    dataIndex: 'consignee_name',
    width: 150,
  }, {
    title: this.msg('consigneePlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
  }, {
    title: this.msg('consigneeAddr'),
    dataIndex: 'consignee_addr',
    width: 150,
  }, {
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
    title: this.msg('shipSource'),
    dataIndex: 'source',
    width: 50,
    render: (o, record) => {
      if (record.source === SHIPMENT_SOURCE.consigned) {
        return this.msg('consginSource');
      } else if (record.source === SHIPMENT_SOURCE.subcontracted) {
        return this.msg('subcontractSource');
      }
      return <span />;
    },
  }, {
    title: this.msg('status'),
    dataIndex: 'effective',
    width: 80,
    render: (o) => {
      switch (o) {
        case 0:
          return <Tag>未生效</Tag>;
        case 1:
          return <Tag color="green">已释放</Tag>;
        case -1:
          return <Tag color="red">已取消</Tag>;
        default:
          return '';
      }
    },
  }, {
    title: this.msg('shipCreateDate'),
    dataIndex: 'created_date',
    sorter: true,
    width: 120,
    render: (text, record) => moment(record.created_date).format('MM-DD HH:mm'),
  }, {
    title: this.msg('shipAcceptTime'),
    dataIndex: 'acpt_time',
    sorter: true,
    width: 120,
    render: (text, record) => (record.acpt_time ?
      moment(record.acpt_time).format('MM-DD HH:mm') : ' '),
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 120,
    fixed: 'right',
    render: (o, record) => {
      if (record.status === SHIPMENT_TRACK_STATUS.unaccepted) {
        if (record.effective === SHIPMENT_EFFECTIVES.cancelled) {
          return (<span />);
        } else if (record.source === SHIPMENT_SOURCE.consigned) {
          return (
            <PrivilegeCover module="transport" feature="shipment" action="edit">
              <span>
                <RowAction onClick={this.handleShipmtAccept} icon="play-circle-o" label={this.msg('release')} row={record} />
                <RowAction
                  onEdit={this.handleShipmtEdit}
                  onDelete={() => this.handleShipmtRevoke(record)}
                  row={record}
                />
              </span>
            </PrivilegeCover>
          );
        } else if (record.source === SHIPMENT_SOURCE.subcontracted) {
          return (
            <PrivilegeCover module="transport" feature="shipment" action="edit">
              <RowAction onClick={this.handleShipmtAccept} icon="check-circle-o" label={this.msg('shipmtAccept')} row={record} />
            </PrivilegeCover>
          );
        }
        return null;
      } else if (record.status === SHIPMENT_TRACK_STATUS.accepted) {
        return (
          <PrivilegeCover module="transport" feature="shipment" action="edit">
            <RowAction confirm="退回至未接单状态" onConfirm={() => this.handleReturn(record.disp_id)} icon="close-circle-o" label="退回" />
          </PrivilegeCover>
        );
      }
      return null;
    },
  }]
  handleTableLoad = (filters, current, sortField, sortOrder) => {
    this.props.loadTable(null, {
      tenantId: this.props.tenantId,
      filters: JSON.stringify(filters || this.props.filters),
      pageSize: this.props.shipmentlist.pageSize,
      currentPage: current || this.props.shipmentlist.current,
      sortField: sortField || this.props.sortField,
      sortOrder: sortOrder || this.props.sortOrder,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleSelectionClear = () => {
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleSearch = (searchVal) => {
    const filters = mergeFilters(this.props.filters, 'name', searchVal);
    this.handleTableLoad(filters, 1);
  }
  handleCustomerChange = (srPartnerId, srTenantId) => {
    let value;
    if (srPartnerId !== -1) {
      value = srPartnerId;
    }
    let filters = mergeFilters(this.props.filters, 'sr_partner_id', value);
    filters = mergeFilters(filters, 'sr_tenant_id', srTenantId);
    this.handleTableLoad(filters, 1);
  }
  handleCreatorChange = (fieldsValue) => {
    let filters = mergeFilters(this.props.filters, 'creator', fieldsValue.creator);
    filters = mergeFilters(filters, 'loginId', this.props.loginId);
    this.handleTableLoad(filters, 1);
  }
  handleCreateBtnClick = () => {
    this.context.router.push('/transport/planning/create');
  }
  handleShipmtAccept = (row) => {
    this.props.acceptDispShipment(
      [row.key], this.props.acpterId, this.props.acpterName,
      this.props.acpterId, this.props.acpterName
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
        this.handleSelectionClear();
      }
    });
  }
  handleShipmtEdit = (row) => {
    const link = `/transport/planning/edit/${row.shipmt_no}`;
    this.context.router.push(link);
  }
  handleShipmtsAccept = () => {
    const partnerIds = this.state.selectedPartnerIds;
    for (let i = 0; i < partnerIds.length; i++) {
      for (let j = 0; j < partnerIds.length; j++) {
        if (partnerIds[i] !== partnerIds[j]) {
          message.info('批量接单需选择同一客户');
          return;
        }
      }
    }
    const dispIds = this.state.selectedRowKeys;
    this.props.acceptDispShipment(
      dispIds, this.props.acpterId, this.props.acpterName,
      this.props.acpterId, this.props.acpterName
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
        this.handleSelectionClear();
      }
    });
  }
  handleShipmtRevoke(row) {
    // ev.preventDefault();
    // ev.stopPropagation();
    this.props.revokeOrReject('revoke', row.shipmt_no, row.key);
  }
  // handleShipmtReject(dispId, ev) {
  //   ev.preventDefault();
  //   ev.stopPropagation();
  //   this.props.revokeOrReject('reject', dispId);
  // }
  handleReturn = (dispId) => {
    const { tenantId, loginId, loginName } = this.props;
    const shipmtDispIds = [dispId];
    this.props.returnShipment({
      shipmtDispIds, tenantId, loginId, loginName,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
      }
    });
  }
  handleShipmtDraftDel(shipmtNo, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.delDraft(shipmtNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad(undefined, 1);
      }
    });
  }
  handleShipmtPreview = (row) => {
    this.props.loadShipmtDetail(row.shipmt_no, this.props.tenantId, 'sp', 'masterInfo').then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { shipmentlist, filters, loading } = this.props;
    this.dataSource.remotes = shipmentlist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        const partnerIds = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
          const { partnerId } = shipmentlist.data.find(item =>
            item.key === selectedRowKeys[i]);
          partnerIds.push(partnerId);
        }
        this.setState({
          selectedRowKeys,
          selectedPartnerIds: partnerIds,
        });
      },
    };
    const bulkActions = (
      <PrivilegeCover module="transport" feature="shipment" action="edit">
        <Button type="default" onClick={this.handleShipmtsAccept}>
          批量接单
        </Button>
      </PrivilegeCover>
    );
    const filterSearch = filters.filter(f => f.name === 'name')[0];
    const toolbarActions = (<span>
      <SearchBox value={filterSearch && filterSearch.value} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
      <span />
      <CustomerSelect onChange={this.handleCustomerChange} />
      <span />
      <CreatorSelect onChange={this.handleCreatorChange} onInitialize={this.handleCreatorChange} />
    </span>);

    return (
      <Layout id="page-layout">
        <PageHeader>
          <PageHeader.Actions>
            <Button type="primary" icon="plus" onClick={this.handleCreateBtnClick} disabled>
              {this.msg('shipmtCreate')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            loading={loading}
            dataSource={this.dataSource}
          />
        </Content>
        <RevokeModal reload={this.handleTableLoad} />
        <ShipmentAdvanceModal />
        <CreateSpecialCharge />
        <DispatchDock />
        <SegmentDock />
      </Layout>
    );
  }
}
