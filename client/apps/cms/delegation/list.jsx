import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Button, DatePicker, Icon, Layout, Menu, Tag, message } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import UserAvatar from 'client/components/UserAvatar';
import { MemberSelect, TenantSelect, PartnerSelect } from 'client/components/ComboSelect';
import SearchBox from 'client/components/SearchBox';
import {
  CMS_DELEGATION_STATUS, CMS_DELEGATION_MANIFEST, DECL_TYPE, CMS_DELG_TODO,
  TRANS_MODE, PARTNER_ROLES, PARTNER_BUSINESSE_TYPES, DATE_FORMAT,
} from 'common/constants';
import connectNav from 'client/common/decorators/connect-nav';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import RowAction from 'client/components/RowAction';
import { LogixIcon } from 'client/components/FontIcon';
import { loadDelegationList, ensureManifestMeta, toggleExchangeDocModal, toggleQuarantineModal, updateDelegation } from 'common/reducers/cmsDelegation';
import { toggleReviewDeclsModal } from 'common/reducers/cmsManifest';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import { loadPartners } from 'common/reducers/partner';
import ExchangeDocModal from './modals/exchangeDocModal';
import QuarantineModal from './modals/quarantineModal';
import { formatMsg } from './message.i18n';
import ReviewDeclsModal from '../common/modal/reviewDeclsModal';

const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    delegationlist: state.cmsDelegation.delegationlist,
    listFilter: state.cmsDelegation.listFilter,
    reload: state.cmsDelegation.delegationsReload,
    clients: state.partner.partners,
    tenantId: state.account.tenantId,
    privileges: state.account.privileges,
  }),
  {
    loadDelegationList,
    showPreviewer,
    ensureManifestMeta,
    toggleExchangeDocModal,
    toggleQuarantineModal,
    loadPartners,
    updateDelegation,
    toggleReviewDeclsModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmDelegation',
})
export default class DelegationList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loadDelegationList: PropTypes.func.isRequired,
    ensureManifestMeta: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    intlArrDate: {},
  }
  componentDidMount() {
    this.props.loadPartners({
      role: [PARTNER_ROLES.CUS, PARTNER_ROLES.DCUS],
      businessType: PARTNER_BUSINESSE_TYPES.clearance,
    });
    const { listFilter } = this.props;
    const filters = {
      ...listFilter, filterNo: '', acptDate: [], scenario: 'all',
    };
    const { hash: locHash, query } = this.props.location;
    filters.acptDate = (query.startDate && query.endDate) ? [query.startDate, query.endDate] : [];
    if (locHash === '#exchange') {
      filters.scenario = 'exchange';
    } else if (locHash === '#manifest') {
      filters.scenario = 'processing';
    } else {
      filters.scenario = 'all';
    }
    this.handleDelgListLoad(this.props.delegationlist.current, filters);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && !this.props.reload) {
      this.handleDelgListLoad();
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'delegation', action: 'edit',
  });
  columns = [{
    title: this.msg('delgNo'),
    dataIndex: 'delg_no',
    width: 180,
    render: (o, record) => (
      <a onClick={ev => this.showDelegationDock(o, record, ev)}>
        {o}
      </a>),
  }, {
    title: this.msg('owner'),
    width: 180,
    dataIndex: 'customer_name',
  }, {
    title: this.msg('orderNo'),
    width: 180,
    dataIndex: 'order_no',
  }, {
    title: this.msg('transMode'),
    width: 100,
    dataIndex: 'trans_mode',
    render: (o) => {
      const mode = TRANS_MODE.filter(ts => ts.value === o)[0];
      return mode ? <span><LogixIcon type={mode.icon} /> {mode.text}</span> : <span />;
    },
  }, {
    title: this.msg('ladingWayBill'),
    width: 200,
    dataIndex: 'bl_wb_no',
  }, {
    title: this.msg('declareWay'),
    width: 100,
    align: 'center',
    dataIndex: 'decl_way_code',
    render: (o) => {
      const type = DECL_TYPE.filter(dl => dl.key === o)[0];
      if (type) {
        return (<Tag color={type.tagc}>{type.value}</Tag>);
      }
      return <span />;
    },
  }, {
    title: this.msg('未归类商品数'),
    width: 100,
    align: 'center',
    dataIndex: 'non_hscode_count',
    render: o => (o ? <Tag color="red">{o}</Tag> : ''),
  }, {
    title: this.msg('status'),
    width: 150,
    dataIndex: 'status',
    render: (o, record) => {
      if (record.status === CMS_DELEGATION_STATUS.unaccepted) {
        return <Badge status="default" text="待接单" />;
      } else if (record.status === CMS_DELEGATION_STATUS.accepted
        || record.status === CMS_DELEGATION_STATUS.processing) {
        if (record.manifested === CMS_DELEGATION_MANIFEST.uncreated) {
          return <span><Badge status="default" text="未录入" /></span>;
        } else if (record.manifested === CMS_DELEGATION_MANIFEST.created) {
          return <span><Badge status="warning" text="未生成建议书" /></span>;
        } else if (record.manifested === CMS_DELEGATION_MANIFEST.manifested) {
          return <span><Badge status="processing" text="已生成建议书" /></span>;
        } else if (record.manifested === CMS_DELEGATION_MANIFEST.reviewed) {
          return <span><Badge status="success" text="已复核" /></span>;
        }
      } else if (record.status === CMS_DELEGATION_STATUS.declaring) {
        if (record.sub_status === 1) {
          return <Badge status="processing" text={this.msg('declaredPart')} />;
        }
        return <Badge status="processing" text="申报中" />;
      } else if (record.status === CMS_DELEGATION_STATUS.released) {
        if (record.sub_status === 1) {
          return <Badge status="success" text={this.msg('releasedPart')} />;
        }
        return <Badge status="success" text="已放行" />;
      }
      return <span />;
    },
  }, {
    title: this.msg('检疫查验'),
    width: 120,
    align: 'center',
    render: (o, record) => {
      if (record.ciq_inspect === 'NL') {
        return <Button size="small" icon="warning" onClick={() => this.handleQuarantine(record)} />;
      } else if (record.ciq_inspect === 'NS') {
        return <Button size="small" onClick={() => this.handleQuarantine(record)}><Badge status="success" text="已查验" /></Button>;
      }
      return null;
    },
  }, {
    title: this.msg('intlArrivalDate'),
    width: 140,
    dataIndex: 'intl_arrival_date',
    render: (intlat, record) => {
      if (record.trans_mode === '2' || record.trans_mode === '5') {
        const delgArrDate = this.state.intlArrDate[record.delg_no];
        let arrDate = intlat;
        let arrDatePickOpen = false;
        if (delgArrDate !== undefined) {
          if (delgArrDate.date !== undefined) {
            arrDate = delgArrDate.date;
          }
          if (delgArrDate.open !== undefined) {
            arrDatePickOpen = delgArrDate.open;
          }
        }
        return (<DatePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YY-MM-DD HH:mm"
          value={arrDate && moment(arrDate)}
          open={arrDatePickOpen}
          onOpenChange={open => this.handleIntlArrPickerOpen(open, record.delg_no)}
          onChange={date => this.handleArrDateChange(date, record.delg_no)}
          onOk={() => this.handleArrDateSave(record.delg_no)}
          style={{ width: '100%' }}
          // disabled={!(record.status < CMS_DELEGATION_STATUS.released
          //  && record.status >= CMS_DELEGATION_STATUS.accepted)}
        />);
      }
      return null;
    },
  }, {
    title: this.msg('制单日期'),
    dataIndex: 'cdf_generated_date',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('报关日期'),
    // dataIndex: 'cus_declared_date',
    dataIndex: 'decl_time',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('放行日期'),
    // dataIndex: 'cus_released_date',
    dataIndex: 'clean_time',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('forwarder'),
    width: 180,
    dataIndex: 'ccb_name',
  }, {
    title: this.msg('broker'),
    width: 180,
    dataIndex: 'broker_name',
  }, {
    title: this.msg('operatedBy'),
    width: 120,
    dataIndex: 'own_by',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('lastActTime'),
    dataIndex: 'last_act_time',
    width: 100,
    render: (o, record) => (record.last_act_time ? moment(record.last_act_time).format('MM.DD HH:mm') : '-'),
  }, {
    dataIndex: 'SPACER_COL',
  }]
  handleIntlArrPickerOpen = (pickerOpen, delgNo) => {
    const intlArrDate = { ...this.state.intlArrDate };
    if (!intlArrDate[delgNo]) {
      intlArrDate[delgNo] = {};
    }
    intlArrDate[delgNo].open = pickerOpen;
    this.setState({ intlArrDate });
  }
  handleArrDateChange = (date, delgNo) => {
    if (date === null && !this.state.intlArrDate[delgNo]) {
      this.handleArrDateSave(delgNo);
    } else {
      const intlArrDate = { ...this.state.intlArrDate };
      if (!intlArrDate[delgNo]) {
        intlArrDate[delgNo] = {};
      }
      intlArrDate[delgNo].date = date ? date.valueOf() : null;
      this.setState({ intlArrDate });
    }
  }
  handleArrDateSave = (delgNo) => {
    const { intlArrDate } = this.state;
    let arrDate = null;
    if (intlArrDate[delgNo]) {
      if (intlArrDate[delgNo].date !== undefined) {
        arrDate = intlArrDate[delgNo].date;
      } else {
        return;
      }
    }
    this.props.updateDelegation({ intl_arrival_date: arrDate }, delgNo).then((result) => {
      if (!result.error) {
        this.setState({ intlArrDate: {} });
        message.info('更新成功');
      } else {
        message.error(result.error.message, 10);
      }
    });
  }
  handleDelgListLoad = (currentPage, filter) => {
    const { listFilter, delegationlist: { pageSize, current } } = this.props;
    this.props.loadDelegationList({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      currentPage: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleFilterChange = (key) => {
    if (key === this.props.listFilter.scenario) {
      return;
    }
    const filter = { ...this.props.listFilter, scenario: key };
    this.setState({ selectedRowKeys: [] });
    this.handleDelgListLoad(1, filter);
  }
  handleManifestCreate = (row) => {
    this.props.ensureManifestMeta({ delg_no: row.delg_no }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        const { bill_seq_no: seqno } = result.data;
        const link = '/clearance/delegation/manifest/';
        this.context.router.push(`${link}${seqno}`);
      }
    });
  }
  handleManifestView = (row) => {
    const link = `/clearance/delegation/manifest/${row.delg_no}`;
    this.context.router.push(link);
  }
  handleExchangeDoc = (record) => {
    this.props.toggleExchangeDocModal(true, {
      delg_no: record.delg_no,
      bl_wb_no: record.bl_wb_no,
      swb_no: record.swb_no,
      exchange_bl_date: record.exchange_bl_date,
    });
  }
  handleQuarantine = (record) => {
    this.props.toggleQuarantineModal(true, {
      delg_no: record.delg_no,
      bl_wb_no: record.bl_wb_no,
      quarantineInspect: !(record.ciq_inspect === 'NL'),
    });
  };
  /*
  handleSearchChange = (ev) => {
    this.setState({ filterName: ev.target.value });
  }
  */
  handleClientSelectChange = (value) => {
    const clientView = { tenantIds: [], partnerIds: [] };
    if (value) {
      const client = this.props.clients.find(clt => clt.id === value);
      if (client.partner_id !== null) {
        clientView.partnerIds.push(client.id);
      } else {
        clientView.tenantIds.push(client.partner_tenant_id);
      }
    }
    const filter = { ...this.props.listFilter, clientView };
    this.handleDelgListLoad(1, filter);
  }
  handleDeptChange = (value) => {
    const filter = { ...this.props.listFilter, own_dept_id: value, own_by: null };
    this.handleDelgListLoad(1, filter);
  }
  handleMemberChange = (value) => {
    const filter = { ...this.props.listFilter, own_dept_id: null, own_by: value };
    this.handleDelgListLoad(1, filter);
  }
  handleUnionTenantSelect = (value) => {
    const filter = { ...this.props.listFilter };
    const { tenantId } = this.props;
    if (tenantId === value) {
      filter.unionTenant = '';
    } else {
      filter.unionTenant = value;
    }
    this.handleDelgListLoad(1, filter);
  }
  handleDateRangeChange = (value, dateString) => {
    const filters = { ...this.props.listFilter, acptDate: dateString };
    this.handleDelgListLoad(1, filters);
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.listFilter, filterNo: searchVal };
    this.handleDelgListLoad(1, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  showDelegationDock = (delgNo, record, ev) => {
    ev.stopPropagation();
    this.props.showPreviewer(delgNo, 'shipment');
  }
  handleReview = (delgNo) => {
    this.props.toggleReviewDeclsModal(true, { delg_no: delgNo });
  }
  render() {
    const {
      delegationlist, listFilter,
    } = this.props;
    // const filterName = this.state.filterName === null ?
    // listFilter.filterNo : this.state.filterName;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadDelegationList(params),
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
          pageSize: pagination.pageSize,
          currentPage: pagination.current,
        };
        const filter = {
          ...this.props.listFilter,
          sortField: sorter.field,
          sortOrder: sorter.order,
        };
        params.filter = JSON.stringify(filter);
        return params;
      },
      remotes: this.props.delegationlist,
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    let dateVal = [];
    if (listFilter.acptDate.length > 0 && listFilter.acptDate[0] !== '') {
      dateVal = [moment(listFilter.acptDate[0]), moment(listFilter.acptDate[1])];
    }
    const toolbarActions = (<span>
      <SearchBox
        placeholder={this.msg('searchPlaceholder')}
        onSearch={this.handleSearch}
        value={this.props.listFilter.filterNo}
      />
      <PartnerSelect
        selectedPartner={listFilter.clientView.partnerIds}
        onPartnerChange={this.handleClientSelectChange}
        showCus
        paramPartners={this.props.clients}
      />
      <MemberSelect
        memberDisabled={listFilter.scenario === 'myOwn'}
        selectMembers={listFilter.own_by}
        selectDepts={listFilter.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        value={dateVal}
        ranges={{ 今日: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
        format={DATE_FORMAT}
      />
    </span>);

    dataSource.remotes = delegationlist;
    let columns = [];
    columns = [...this.columns];
    columns.push({
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      width: 150,
      fixed: 'right',
      render: (o, record) => {
        if (listFilter.scenario === 'exchange') {
          return <RowAction onClick={this.handleExchangeDoc} icon="swap" label={this.msg('exchangeSeaDoc')} row={record} />;
        }
        if (record.status === CMS_DELEGATION_STATUS.accepted) { // 当前租户已接单
          return <RowAction onClick={this.handleManifestCreate} icon="file-add" label={this.msg('createManifest')} row={record} />;
        } else if (record.status === CMS_DELEGATION_STATUS.processing) {
          const manifestOp = [];
          if (!record.manifest_permit || !this.editPermission) {
            manifestOp.push(<RowAction key="view" onClick={this.handleManifestView} icon="eye-o" label={this.msg('viewManifest')} row={record} />);
          } else {
            switch (record.manifested) {
              case CMS_DELEGATION_MANIFEST.created: // 制单中
                manifestOp.push(<RowAction key="edit" onClick={this.handleManifestView} icon="form" label={this.msg('editManifest')} row={record} />);
                break;
              case CMS_DELEGATION_MANIFEST.manifested: // 已生成报关单
                manifestOp.push(<RowAction key="view" onClick={this.handleManifestView} icon="eye-o" label={this.msg('viewManifest')} row={record} />);
                if (record.review_permit && record.sub_status !== 1) { // 有复核权限且未复核
                  manifestOp.push(<RowAction
                    key="more"
                    overlay={<Menu>
                      <Menu.Item key="reviewDecls" onClick={() => this.handleReview(record.delg_no)}><Icon type="audit" /> {this.msg('reviewDecls')}</Menu.Item>
                    </Menu>}
                  />);
                }
                break;
              case CMS_DELEGATION_MANIFEST.reviewed: // 已复核报关单
                manifestOp.push(<RowAction key="view" onClick={this.handleManifestView} icon="eye-o" label={this.msg('viewManifest')} row={record} />);
                break;
              default:
                break;
            }
          }
          return (
            <span>
              <PrivilegeCover module="clearance" feature="delegation" action="view">
                {manifestOp}
              </PrivilegeCover>
            </span>);
        } else if (record.status === CMS_DELEGATION_STATUS.declaring || // 4. 申报
                      record.status === CMS_DELEGATION_STATUS.released) { // 5. 放行
          return (
            <PrivilegeCover module="clearance" feature="delegation" action="view">
              <RowAction onClick={this.handleManifestView} icon="eye-o" label={this.msg('viewManifest')} row={record} />
            </PrivilegeCover>);
        }
        return <span />;
      },
    });
    const dropdownMenuItems = [
      {
        elementKey: 'gTodo',
        title: '场景',
        elements: Object.keys(CMS_DELG_TODO).map(todoKey => ({
          icon: CMS_DELG_TODO[todoKey].icon, name: this.msg(todoKey), elementKey: todoKey,
        })),
      },
    ];
    const dropdownMenu = {
      selectedMenuKey: listFilter.scenario,
      onMenuClick: this.handleFilterChange,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          title={<TenantSelect
            selectedTenant={listFilter.unionTenant}
            onTenantSelected={this.handleUnionTenantSelect}
          />}
        />
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={columns}
            dataSource={dataSource}
            rowKey="delg_no"
            loading={delegationlist.loading}
            onRow={record => ({
              onClick: () => {},
              onDoubleClick: () => { this.handleManifestView(record); },
              onContextMenu: () => {},
              onMouseEnter: () => {},
              onMouseLeave: () => {},
            })}
          />
        </PageContent>
        <ExchangeDocModal reload={this.handleDelgListLoad} />
        <QuarantineModal reload={this.handleDelgListLoad} />
        <ReviewDeclsModal reload={this.handleDelgListLoad} />
      </Layout>

    );
  }
}
