import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import { loadShipmtDetail } from 'common/reducers/shipment';
import { loadPodTable, showAuditModal, changePodFilter } from
  'common/reducers/trackingLandPod';
import { format } from 'client/common/i18n/helpers';
import { sendMessage } from 'common/reducers/notification';
import { deliverConfirm } from 'common/reducers/trackingLandStatus';
import SearchBox from 'client/components/SearchBox';
import PodAuditModal from './modals/pod-audit';
import makeColumns from './columnDef';
import MyShipmentsSelect from '../common/myShipmentsSelect';
import CustomerSelect from '../common/customerSelect';
import AdvancedSearchBar from '../common/advanced-search-bar';
import messages from './message.i18n';


const formatMsg = format(messages);

function fetchData({
  state, dispatch, params, cookie,
}) {
  const newfilters = state.trackingLandPod.filters.map((flt) => {
    if (flt.name === 'type') {
      return {
        name: 'type',
        value: params.state,
      };
    }
    return flt;
  });
  if (!newfilters.find(item => item.name === 'loginId')) {
    newfilters.push({
      name: 'loginId',
      value: state.account.loginId,
    });
  }
  return dispatch(loadPodTable(cookie, {
    tenantId: state.account.tenantId,
    filters: JSON.stringify(newfilters),
    pageSize: state.trackingLandPod.shipmentlist.pageSize,
    currentPage: state.trackingLandPod.shipmentlist.current,
  }));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    shipmentlist: state.trackingLandPod.shipmentlist,
    filters: state.trackingLandPod.filters,
    loading: state.trackingLandPod.loading,
    loaded: state.trackingLandPod.loaded,
    carriers: state.shipment.partners,
  }),
  {
    loadPodTable,
    loadShipmtDetail,
    showAuditModal,
    sendMessage,
    changePodFilter,
    deliverConfirm,
  }
)
export default class TrackingPODList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string, value: PropTypes.string,
    })).isRequired,
    loading: PropTypes.bool.isRequired,
    shipmentlist: PropTypes.shape({ current: PropTypes.number }).isRequired,
    showAuditModal: PropTypes.func.isRequired,
    loadShipmtDetail: PropTypes.func.isRequired,
    loadPodTable: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    changePodFilter: PropTypes.func.isRequired,
    deliverConfirm: PropTypes.func.isRequired,
    carriers: PropTypes.arrayOf(PropTypes.shape({ partner_code: PropTypes.string })).isRequired,
  }

  state = {
    selectedRowKeys: [],
    advancedSearchVisible: false,
  }
  componentWillReceiveProps(nextProps) {
    let newfilters;
    if (nextProps.params.state !== this.props.params.state) {
      newfilters = nextProps.filters.map((flt) => {
        if (flt.name === 'type') {
          return {
            name: 'type',
            value: nextProps.params.state,
          };
        }
        return flt;
      });
    } else if (JSON.stringify(this.props.filters) !== JSON.stringify(nextProps.filters)) {
      newfilters = nextProps.filters;
    }
    if (!nextProps.loading && newfilters) {
      this.props.loadPodTable(null, {
        tenantId: nextProps.tenantId,
        filters: JSON.stringify(newfilters),
        pageSize: nextProps.shipmentlist.pageSize,
        currentPage: 1,
        /*
           sortField: state.transportTracking.transit.sortField,
           sortOrder: state.transportTracking.transit.sortOrder,
           */
      });
    }
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadPodTable(null, params),
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
      const newFilters = [...this.props.filters];
      const index = newFilters.findIndex(item => item.name === 'sp_name');
      if (index >= 0) {
        newFilters.splice(index, 1);
      }
      if (filters.sp_name && filters.sp_name.length > 0) {
        newFilters.push({ name: 'sp_name', value: filters.sp_name });
      }
      const params = {
        tenantId: this.props.tenantId,
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'desc' : 'asc',
        filters: JSON.stringify(newFilters),
      };
      return params;
    },
    remotes: this.props.shipmentlist,
  })
  msg = descriptor => formatMsg(this.props.intl, descriptor)
  handleTableLoad = (filters, current/* , sortField, sortOrder */) => {
    this.props.loadPodTable(null, {
      tenantId: this.props.tenantId,
      filters: JSON.stringify(filters || this.props.filters),
      pageSize: this.props.shipmentlist.pageSize,
      currentPage: current || this.props.shipmentlist.current,
      /*
      sortField: sortField || this.props.sortField,
      sortOrder: sortOrder || this.props.sortOrder,
     */
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleDeliverConfirm = (shipmtNo, dispId) => {
    this.props.deliverConfirm(shipmtNo, dispId).then((result) => {
      if (!result.error) {
        this.handleTableLoad();
      } else {
        message.error(result.error.message, 10);
      }
    });
  }
  handleSelectionClear = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleShowAuditModal = (row) => {
    this.props.showAuditModal(row.disp_id, row.parent_id, row.pod_id);
  }
  handleShipmtPreview = (row) => {
    this.props.loadShipmtDetail(row.shipmt_no, this.props.tenantId, 'sr', 'pod').then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }

  handleShipmentViewSelect = (searchVals) => {
    this.props.changePodFilter('viewStatus', searchVals.viewStatus);
  }

  handleSearchInput = (value) => {
    this.props.changePodFilter('shipmt_no', value);
  }

  toggleAdvancedSearch = () => {
    this.setState({ advancedSearchVisible: !this.state.advancedSearchVisible });
  }

  showAdvancedSearch = (advancedSearchVisible) => {
    this.setState({ advancedSearchVisible });
  }

  handleAdvancedSearch = (searchVals) => {
    Object.keys(searchVals).forEach((key) => {
      this.props.changePodFilter(key, searchVals[key]);
    });
    this.showAdvancedSearch(false);
  }

  handleCustomerChange = (srPartnerId, srTenantId) => {
    let value;
    if (srPartnerId !== -1) {
      value = srPartnerId;
    }
    this.props.changePodFilter('sr_partner_id', value);
    this.props.changePodFilter('sr_tenant_id', srTenantId);
  }

  render() {
    const { shipmentlist, filters, loading } = this.props;
    this.dataSource.remotes = shipmentlist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const columns = makeColumns('pod', {
      onShipmtPreview: this.handleShipmtPreview,
      onShowAuditModal: this.handleShowAuditModal,
      tenantId: this.props.tenantId,
      sendMessage: this.props.sendMessage,
      deliverConfirm: this.handleDeliverConfirm,
      carriers: this.props.carriers,
    }, this.msg);
    const shipmtnoFilter = filters.filter(flt => flt.name === 'shipmt_no')[0];
    const toolbarActions = (<span>
      <SearchBox value={shipmtnoFilter && shipmtnoFilter.value} placeholder={this.msg('searchShipmtPH')} onSearch={this.handleSearchInput} />
      <span />
      <CustomerSelect onChange={this.handleCustomerChange} />
      <span />
      <MyShipmentsSelect onChange={this.handleShipmentViewSelect} />
      <span />
      <a onClick={this.toggleAdvancedSearch}>过滤选项</a>
    </span>);
    return (
      <div>
        <AdvancedSearchBar
          visible={this.state.advancedSearchVisible}
          onSearch={this.handleAdvancedSearch}
          toggle={this.toggleAdvancedSearch}
        />
        <DataTable
          toolbarActions={toolbarActions}
          rowSelection={rowSelection}
          columns={columns}
          loading={loading}
          dataSource={this.dataSource}
          scroll={{ x: 2770 }}
          selectedRowKeys={this.state.selectedRowKeys}
          onDeselectRows={this.handleSelectionClear}
        />
        <PodAuditModal />
      </div>
    );
  }
}
