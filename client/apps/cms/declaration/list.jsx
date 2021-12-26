import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Icon, Layout, Menu, Tag, Popconfirm, Button, Select, Popover, message, Tooltip } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
import SearchBox from 'client/components/SearchBox';
import { MemberSelect, TenantSelect, PartnerSelect } from 'client/components/ComboSelect';
import connectNav from 'client/common/decorators/connect-nav';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { toggleReviewDeclsModal } from 'common/reducers/cmsManifest';
import {
  loadCustomsDecls, setDeclReviewed, showSendDeclModal,
  toggleInspectModal, toggleDeclModModal, openDeclReleasedModal,
  showBatchSendModal, showDeclMsgDock, toggleDeclMsgModal, toggleCiqNoModal,
} from 'common/reducers/cmsCustomsDeclare';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import { openEfModal } from 'common/reducers/cmsDelegation';
import { loadPartners } from 'common/reducers/partner';
import {
  CMS_DECL_STATUS, CMS_DECL_TODO, CMS_DECL_TRACK, CMS_DECL_EXCEPTION, CMS_DECL_TYPE, PARTNER_ROLES,
  PARTNER_BUSINESSE_TYPES, CMS_DECL_MOD_TYPE, INSPECT_STATUS, CMS_DECL_CHANNEL, DECL_TYPE,
} from 'common/constants';
import BatchSendModal from './modals/batchSendModal';
import FillCustomsNoModal from './modals/fillCustomsNoModal';
import FillCiqNoModal from './modals/fillCiqNoModal';
import InspectModal from './modals/inspectModal';
import DeclReleasedModal from './modals/declReleasedModal';
import SendDeclMsgModal from './modals/sendDeclMsgModal';
import DeclMsgPanel from './panel/declMsgPanel';
import DeclMsgModal from './modals/declMsgModal';
import DeclModModal from './modals/declModModal';
import DeclStatusPopover from '../common/popover/declStatusPopover';
import ReviewDeclsModal from '../common/modal/reviewDeclsModal';
import { formatMsg } from './message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;
const searchIconProps = { type: 'search', theme: undefined };
const declTypeOptions = DECL_TYPE
  .filter(obj => ['IMPT', 'IBND', 'EXPT', 'EBND'].includes(obj.key))
  .map(obj => ({ value: obj.key, text: obj.value }));
const declChannelOptions = Object.keys(CMS_DECL_CHANNEL)
  .map(key => CMS_DECL_CHANNEL[key]);


@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    customslist: state.cmsCustomsDeclare.customslist,
    listFilter: state.cmsCustomsDeclare.listFilter,
    clients: state.partner.partners,
    customsParam: state.saasParams.latest.customs,
    tradeModes: state.saasParams.latest.tradeMode,
    unionId: state.account.unionId,
    tenantLevel: state.account.tenantLevel,
    unionTenants: state.saasTenant.unionTenants,
    privileges: state.account.privileges,
  }),
  {
    loadCustomsDecls,
    loadPartners,
    openEfModal,
    setDeclReviewed,
    showSendDeclModal,
    showPreviewer,
    openDeclReleasedModal,
    showBatchSendModal,
    toggleInspectModal,
    toggleDeclModModal,
    showDeclMsgDock,
    toggleDeclMsgModal,
    toggleReviewDeclsModal,
    toggleCiqNoModal,
    toggleBizDock,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmCustoms',
})
export default class CustomsDeclList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    showSendDeclModal: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    extraVisible: false,
  }
  componentDidMount() {
    this.props.loadPartners({
      role: [PARTNER_ROLES.CUS, PARTNER_ROLES.DCUS],
      businessType: PARTNER_BUSINESSE_TYPES.clearance,
    });
    const filters = {
      ...this.props.listFilter, filterNo: '', scenario: 'all',
    };
    const { hash: locHash, query } = this.props.location;
    filters.filterDate = (query.startDate && query.endDate) ? [query.startDate, query.endDate] : [];
    if (locHash === '#review') {
      filters.scenario = 'proposed';
    } else if (locHash === '#inspect') {
      filters.scenario = 'inspect';
    } else if (locHash === '#revised') {
      filters.scenario = 'revised';
    } else if (locHash === '#revoked') {
      filters.scenario = 'revoked';
    } else {
      filters.scenario = 'all';
    }
    this.handleTableLoad(this.props.customslist.current, filters);
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'customs', action: 'edit',
  });
  /** @param fieldName: string, @param options: {value,text:string}[] | () => {value,text}[] */
  filterSelectRender = (fieldName, options) => () => {
    let optionList;
    if (options instanceof Function) {
      optionList = options();
    } else {
      optionList = options;
    }
    return (
      <div className="filter-dropdown">
        <Select
          allowClear
          onChange={val => this.handleColFiltersChange(fieldName, val)}
          style={{ width: 150 }}
          value={this.props.listFilter[fieldName]}
        >
          {optionList.map(option => (<Option value={option.value}>{option.text}</Option>))}
        </Select>
      </div>
    );
  }
  filterSearchRender = fieldName => (
    <div className="filter-dropdown">
      <SearchBox
        value={this.props.listFilter[fieldName]}
        onSearch={val => this.handleColFiltersChange(fieldName, val)}
      />
    </div>
  )
  filterIconRender = (fieldName, iconProps = { type: 'filter', theme: 'filled' }) => () =>
    <Icon {...iconProps} style={{ color: this.props.listFilter[fieldName] ? '#1890ff' : undefined }} />
  columns = [{
    title: this.msg('declNo'),
    dataIndex: 'entry_id',
    width: 210,
    render: (entryNO, record) => {
      switch (record.status) {
        case CMS_DECL_STATUS.proposed.value:
        case CMS_DECL_STATUS.reviewed.value:
          return (<a onClick={() => this.props.toggleBizDock('cmsDeclaration', {
            preEntrySeqNo: record.pre_entry_seq_no,
          })}
          >
            {record.pre_entry_seq_no}
          </a>);
        case CMS_DECL_STATUS.sent.value:
        case CMS_DECL_STATUS.entered.value:
        case CMS_DECL_STATUS.released.value: {
          const entryIdEditable = (!record.entry_id || (!record.return_file &&
          (new Date().getTime() - new Date(record.backfill_date).getTime()) < 24 * 3600 * 1000));
          return (
            <span>
              <a onClick={() => this.props.toggleBizDock('cmsDeclaration', {
                preEntrySeqNo: record.pre_entry_seq_no,
              })}
              >
                {entryNO || record.dec_unified_no || record.pre_entry_seq_no}
              </a>
              {entryIdEditable &&
                <PrivilegeCover module="clearance" feature="customs" action="edit" key="entry_no">
                  <RowAction
                    shape="circle"
                    onClick={this.handleDeclNoFill}
                    row={record}
                    label={<Icon type="edit" />}
                    tooltip="回填海关编号"
                  />
                </PrivilegeCover>
              }
            </span>);
        }
        default:
          return <span />;
      }
    },
  }, {
    title: this.msg('delgOrderNo'),
    dataIndex: 'delg_no',
    width: 200,
    render: (o, record) => (
      <a onClick={ev => this.showDelegationDock(record, ev)}>
        {record.order_no || o}
      </a>),
  }, {
    title: '类型',
    dataIndex: 'sheet_type',
    width: 100,
    filterDropdown: this.filterSelectRender('decl_way_code', declTypeOptions),
    filterIcon: this.filterIconRender('decl_way_code'),
    render: (o, record) => {
      let child = <span />;
      if (record.i_e_type === 0) {
        if (o === 'CDF') {
          child = <Tag color="blue">进口报关</Tag>;
        } else if (o === 'FTZ') {
          child = <Tag color="blue">进境备案</Tag>;
        }
      } else if (record.i_e_type === 1) {
        if (o === 'CDF') {
          child = <Tag color="cyan">出口报关</Tag>;
        } else if (o === 'FTZ') {
          child = <Tag color="cyan">出境备案</Tag>;
        }
      }
      let entryDecType = '';
      if (record.pre_entry_dec_type !== null) {
        const decltype = CMS_DECL_TYPE.filter(ty =>
          ty.value === (record.pre_entry_dec_type).toString())[0];
        entryDecType = decltype ? decltype.text : '';
        const content = (
          <div>
            <p>{`${entryDecType}`}</p>
            <p>{`${record.pre_entry_user_info || ''}`}</p>
          </div>
        );
        return <Popover placement="right" content={content}>{child}</Popover>;
      }
      return child;
    },
  }, {
    title: this.msg('packCount'),
    width: 60,
    dataIndex: 'pack_count',
  }, {
    title: this.msg('grossWeight'),
    width: 80,
    dataIndex: 'gross_wt',
  }, {
    title: '项数',
    dataIndex: 'detail_count',
    width: 80,
    align: 'center',
    render: dc => (!Number.isNaN(Number(dc)) && <Tag>{dc}</Tag>),
  }, {
    title: this.msg('declStatus'),
    dataIndex: 'status',
    width: 100,
    render: (o, record) => (<DeclStatusPopover
      entryId={record.entry_id}
      declStatus={o}
      declSent={{
        sent_status: record.sent_status,
        sent_fail_msg: record.sent_fail_msg,
        send_date: record.epsend_date,
      }}
      returnFile={record.return_file}
    />),
  }, {
    title: this.msg('declCiq'),
    dataIndex: 'law_ciq',
    width: 100,
    render: (o, record) =>
      (<span>
        <Tooltip title={record.ciq_no}>{o === 'MUST' ? '是' : '否'} </Tooltip>
        {record.status < CMS_DECL_STATUS.released.value &&
        <PrivilegeCover module="clearance" feature="customs" action="edit">
          <RowAction shape="circle" icon="edit" onClick={() => this.handleToggleCiqNoModal(record.pre_entry_seq_no)} />
        </PrivilegeCover>}
      </span>),
  }, {
    title: this.msg('customsInspect'),
    dataIndex: 'customs_inspect',
    align: 'center',
    width: 140,
    render: (o, record) => {
      if (record.status > CMS_DECL_STATUS.reviewed.value) {
        if (record.customs_inspect === INSPECT_STATUS.inspecting.value ||
          record.ciq_quality_inspect === INSPECT_STATUS.inspecting.value) {
          return <RowAction danger icon="exclamation-circle" label="查验下达" onClick={() => this.handleCusInspect(record)} />;
        } else if ((record.customs_inspect === INSPECT_STATUS.finish.value
            && record.ciq_quality_inspect !== INSPECT_STATUS.inspecting.value) ||
          (record.ciq_quality_inspect === INSPECT_STATUS.finish.value
            && record.customs_inspect !== INSPECT_STATUS.inspecting.value)) {
          return <RowAction success icon="issues-close" label="查验完成" onClick={() => this.handleCusInspect(record)} />;
        }
        // if (record.status < CMS_DECL_STATUS.released.value) {
        return <RowAction silent icon="plus-circle" label="记录查验" onClick={() => this.handleCusInspect(record)} />;
        // }
      }
      return null;
    },
  }, {
    title: this.msg('domesticTrader'),
    dataIndex: 'trade_name',
    width: 180,
    filterDropdown: this.filterSearchRender('trade_name'),
    filterIcon: this.filterIconRender('trade_name', searchIconProps),
  }, {
    title: this.msg('ieCustoms'),
    dataIndex: 'i_e_port',
    width: 120,
    filterDropdown: this.filterSelectRender('i_e_port', () => {
      const { data } = this.props.customslist;
      const portCodes = Array.from(new Set(data.map(obj => obj.i_e_port)));
      return portCodes.map((code) => {
        const cust = this.props.customsParam.find(ct => ct.customs_code === code);
        return cust ? { value: code, text: cust.customs_name } : null;
      }).filter(obj => obj);
    }),
    filterIcon: this.filterIconRender('i_e_port'),
    render: (o) => {
      const cust = this.props.customsParam.filter(ct => ct.customs_code === o)[0];
      if (cust) {
        return cust.customs_name;
      }
      return '';
    },
  }, {
    title: '监管方式',
    dataIndex: 'trade_mode',
    width: 120,
    filterDropdown: this.filterSelectRender('trade_mode', () => {
      const { data } = this.props.customslist;
      const codes = Array.from(new Set(data.map(obj => obj.trade_mode)));
      return codes.map((code) => {
        const obj = this.props.tradeModes.find(tm => tm.trade_mode === code);
        return obj ? { value: code, text: obj.trade_abbr } : null;
      }).filter(obj => obj);
    }),
    filterIcon: this.filterIconRender('trade_mode'),
    render: (o) => {
      const tradeMd = this.props.tradeModes.filter(tm => tm.trade_mode === o)[0];
      if (tradeMd) {
        return tradeMd.trade_abbr;
      }
      return '';
    },
  }, {
    title: '提运单号',
    dataIndex: 'bl_wb_no',
    width: 180,
    filterDropdown: this.filterSearchRender('bl_wb_no'),
    filterIcon: this.filterIconRender('bl_wb_no', searchIconProps),
  }, {
    title: '合同协议号',
    dataIndex: 'contr_no',
    width: 150,
    filterDropdown: this.filterSearchRender('contr_no'),
    filterIcon: this.filterIconRender('contr_no', searchIconProps),
  }, {
    title: '制单时间',
    dataIndex: 'created_date',
    width: 150,
    render: createdt => (createdt ? moment(createdt).format('MM.DD HH:mm') : '-'),
  }, {
    title: '复核人员',
    dataIndex: 'reviewed_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '复核时间',
    dataIndex: 'reviewed_date',
    width: 150,
    render: reviewdt => (reviewdt ? moment(reviewdt).format('MM.DD HH:mm') : '-'),
  }, {
    title: '申报通道',
    dataIndex: 'dec_channel',
    width: 100,
    filterDropdown: this.filterSelectRender('dec_channel', declChannelOptions),
    filterIcon: this.filterIconRender('dec_channel'),
    render: (o, record) => {
      if (o) {
        let entryDecType = '';
        if (record.pre_entry_dec_type !== null) {
          const decltype = CMS_DECL_TYPE.filter(ty =>
            ty.value === (record.pre_entry_dec_type).toString())[0];
          entryDecType = decltype ? decltype.text : '';
          const content = (
            <div>
              <p>{`${entryDecType}`}</p>
              <p>{`${record.pre_entry_user_info || ''}`}</p>
            </div>
          );
          return <Popover placement="right" content={content}><Tag>{this.msg(o)}</Tag></Popover>;
        }
        return <Tag>{this.msg(o)}</Tag>;
      }
      return null;
    },
  }, {
    title: '报文发送时间',
    dataIndex: 'epsend_date',
    width: 120,
    render: sendDate => (sendDate ? moment(sendDate).format('MM.DD HH:mm') : '-'),
  }, {
    title: '回执接收时间',
    dataIndex: 'backfill_date',
    width: 120,
    render: backdt => (backdt ? moment(backdt).format('MM.DD HH:mm') : '-'),
  }, {
    title: '放行时间',
    dataIndex: 'clear_date',
    width: 120,
    render: clearDate => (clearDate ? moment(clearDate).format('MM.DD HH:mm') : '-'),
  }, {
    title: '删改单',
    dataIndex: 'revise_type',
    width: 120,
    render: (o) => {
      const revise = CMS_DECL_MOD_TYPE.find(item => item.value === o);
      if (revise) {
        return revise.text;
      }
      return null;
    },
  }, {
    title: '申报单位',
    dataIndex: 'agent_name',
    width: 180,
    filterDropdown: this.filterSearchRender('agent_name'),
    filterIcon: this.filterIconRender('agent_name', searchIconProps),
  }, {
    title: '申报人员',
    dataIndex: 'epsend_login_id',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 140,
    fixed: 'right',
    render: (o, record) => {
      if (record.status === CMS_DECL_STATUS.proposed.value && record.review_permit) {
        return (
          <span>
            <RowAction onClick={this.handleDetail} icon="form" label={this.msg('viewProposal')} row={record} />
            <PrivilegeCover module="clearance" feature="delegation" action="audit">
              <RowAction onClick={this.handleReview} icon="audit" tooltip={this.msg('review')}row={record} />
            </PrivilegeCover>
          </span>
        );
      }
      if (record.status === CMS_DECL_STATUS.reviewed.value && record.decl_permit) {
        return (
          <span>
            <RowAction onClick={this.handleDetail} icon="eye-o" label={this.msg('viewProposal')} row={record} />
            <PrivilegeCover module="clearance" feature="customs" action="edit" key="send">
              <RowAction onClick={this.handleDeclSend} icon="mail" tooltip={this.msg('sendDeclMsg')} row={record} />
            </PrivilegeCover>
          </span>);
      }
      const spanElems = [];
      if (record.status === CMS_DECL_STATUS.sent.value) {
        spanElems.push(<RowAction
          key="sent"
          overlay={<Menu onClick={ev => this.handleRowMenuClick(ev, record)}>
            <Menu.Item key="declMsg">{this.msg('viewDeclMsg')}</Menu.Item>
            {(record.sent_status === 2 || record.sent_status === 4) && this.editPermission &&
            <Menu.Item key="resend">{this.msg('resend')}</Menu.Item>}
            {record.revise_type === '0' && this.editPermission && [<Menu.Divider key="divider" />, <Menu.Item key="declMod">{this.msg('declMod')}</Menu.Item>]}
          </Menu>}
          row={record}
        />);
      }
      if (record.status >= CMS_DECL_STATUS.entered.value) {
        let revise = [];
        if (record.status < CMS_DECL_STATUS.released.value && record.revise_type === '0' && this.editPermission) {
          revise = [<Menu.Divider key="divider" />, <Menu.Item key="declMod">{this.msg('declMod')}</Menu.Item>];
        }
        const returnItems = [];
        if (!record.return_file) {
          returnItems.push(<Menu.Item key="resultMsg" disabled>{this.msg('viewResultMsg')}</Menu.Item>);
        } else {
          const returnFiles = record.return_file.split(';');
          if (returnFiles.length === 1) {
            returnItems.push(<Menu.Item key="resultMsg">{this.msg('viewResultMsg')}</Menu.Item>);
          } else if (returnFiles.length > 1) {
            returnItems.push(<Menu.SubMenu key="resultMsg" title={<span>{this.msg('viewResultMsg')}</span>}>
              {returnFiles.map(fileName => <Menu.Item key={fileName}>{fileName}</Menu.Item>)}
            </Menu.SubMenu>);
          }
        }
        spanElems.push(<RowAction
          key="return"
          overlay={<Menu onClick={ev => this.handleRowMenuClick(ev, record)}>
            <Menu.Item key="markReleased" disabled={record.status === CMS_DECL_STATUS.released.value || !this.editPermission}>{this.msg('markReleased')}</Menu.Item>
            <Menu.Divider key="divider" />
            <Menu.Item key="declMsg" disabled={!record.sent_file}>{this.msg('viewDeclMsg')}</Menu.Item>
            {returnItems}
            {revise}
          </Menu>}
          row={record}
        />);
      }
      return (<span>
        <RowAction onClick={this.handleDetail} icon="eye-o" label={this.msg('viewCDF')} row={record} />
        {spanElems}
      </span>);
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadCustomsDecls(params),
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
        currentPage: pagination.current,
      };
      const filter = { ...this.props.listFilter };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.customslist,
  })
  handleToggleCiqNoModal = (preEntrySeqNo) => {
    this.props.toggleCiqNoModal(true, { preEntrySeqNo });
  }
  handleTableLoad = (currentPage, filter) => {
    this.props.loadCustomsDecls({
      filter: JSON.stringify(filter || this.props.listFilter),
      pageSize: this.props.customslist.pageSize,
      currentPage: currentPage || this.props.customslist.current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      }
    });
  }
  handleDeclNoFill = (row) => {
    this.props.openEfModal({
      entryHeadId: row.id,
      decUnifiedNo: row.dec_unified_no,
    });
  }
  handleCusInspect = (record) => {
    this.props.toggleInspectModal(
      true,
      {
        id: record.id,
        entryId: record.entry_id,
        delgNo: record.delg_no,
        customsInsDate: record.customs_inspect_date,
        customsInspectEndDate: record.customs_inspect_end_date,
        customsInspect: record.customs_inspect,
        ciqQualityInspect: record.ciq_quality_inspect,
        customsInspectResult: record.customs_inspected_result,
        customsCaughtReason: record.customs_caught_reason,
        customsCaughtResult: record.customs_caught_result,
      }
    );
  }
  handleDetail = (record) => {
    const link = `/clearance/declaration/${record.pre_entry_seq_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  handleFilterChange = (key) => {
    if (key === this.props.listFilter.scenario) {
      return;
    }
    const filter = { ...this.props.listFilter, scenario: key };
    this.handleDeselectRows();
    this.handleTableLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const clientView = { tenantIds: [], partnerIds: [] }; // FIXME should not use two ids
    if (value) {
      const client = this.props.clients.find(clt => clt.id === value);
      if (client.id !== null) {
        clientView.partnerIds.push(client.id);
      } else {
        clientView.tenantIds.push(client.partner_tenant_id);
      }
    }
    const filter = { ...this.props.listFilter, clientView };
    this.handleDeselectRows();
    this.handleTableLoad(1, filter);
  }
  handleDeptChange = (value) => {
    const filter = { ...this.props.listFilter, own_dept_id: value, own_by: null };
    this.handleTableLoad(1, filter);
  }
  handleMemberChange = (value) => {
    const filter = { ...this.props.listFilter, own_dept_id: null, own_by: value };
    this.handleTableLoad(1, filter);
  }
  handleUnionTenantSelect = (value) => {
    const { tenantId } = this.props;
    const filter = { ...this.props.listFilter, acptDate: [] };
    if (tenantId === value) {
      filter.unionTenant = '';
    } else {
      filter.unionTenant = value;
    }
    this.handleTableLoad(1, filter);
  }
  handleDateRangeChange = (value, dateString) => {
    const filters = { ...this.props.listFilter, filterDate: dateString, acptDate: [] };
    this.handleTableLoad(1, filters);
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.listFilter, filterNo: searchVal };
    this.handleTableLoad(1, filters);
  }
  handleColFiltersChange = (fieldName, val) => {
    const filter = { ...this.props.listFilter, [fieldName]: val };
    this.handleTableLoad(1, filter);
  }
  handleReview = (row) => {
    this.props.toggleReviewDeclsModal(true, { delg_no: row.delg_no });
  }
  handleBatchReview = (ids) => {
    const opContent = '批量复核,默认为已复核全部栏位';
    this.props.setDeclReviewed(ids, CMS_DECL_STATUS.reviewed.value, opContent).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
        this.handleTableLoad();
      }
    });
  }
  handleBatchSend= (ids, ietype) => {
    this.props.showBatchSendModal({ ids, ietype });
    this.handleDeselectRows();
  }
  handleRecall = (row) => {
    this.props.setDeclReviewed([row.id], CMS_DECL_STATUS.proposed.value).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
      }
    });
  }
  handleBatchRecall = (ids) => {
    this.props.setDeclReviewed(ids, CMS_DECL_STATUS.proposed.value).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
        this.handleDeselectRows();
      }
    });
  }
  showDeclReleasedModal = (row) => {
    this.props.openDeclReleasedModal(row.entry_id, row.pre_entry_seq_no, row.delg_no, row.i_e_type);
  }
  handleDeclSend = (row) => {
    this.props.showSendDeclModal({
      defaultDecl: {
        channel: row.dec_channel,
        dectype: row.pre_entry_dec_type,
        appuuid: row.ep_app_uuid,
      },
      visible: true,
      ietype: row.i_e_type === 0 ? 'import' : 'export',
      preEntrySeqNo: row.pre_entry_seq_no,
      delgNo: row.delg_no,
      agentCustCo: row.agent_custco,
      agentCode: row.agent_code,
      ieDate: row.i_e_date,
    });
  }
  handleRowMenuClick = (ev, record) => {
    if (ev.key === 'declMod') {
      this.props.toggleDeclModModal(true, {
        entryId: record.entry_id,
        ietype: record.i_e_type,
        billSeqNo: record.bill_seq_no,
        preEntrySeqNo: record.pre_entry_seq_no,
      });
    } else if (ev.key === 'markReleased') {
      this.props.openDeclReleasedModal(
        record.entry_id,
        record.pre_entry_seq_no,
        record.delg_no,
        record.i_e_type
      );
    } else if (ev.key === 'resend') {
      this.handleDeclSend(record);
    } else if (ev.key === 'declMsg') {
      this.props.toggleDeclMsgModal(true, record.sent_file, 'sent');
    } else if (ev.key === 'resultMsg') {
      this.props.toggleDeclMsgModal(true, record.return_file, 'return');
    } else if (ev.keyPath[1] === 'resultMsg') {
      this.props.toggleDeclMsgModal(true, ev.key, 'return');
    }
  }
  handleBrokers = () => {
    this.context.router.push('/clearance/setting/brokers');
  }
  showDelegationDock = (record, ev) => {
    ev.stopPropagation();
    this.props.showPreviewer(record.delg_no, 'shipment');
  }
  showDeclMsgDock = () => {
    this.props.showDeclMsgDock();
  }
  toggleExtra = () => {
    this.setState({ extraVisible: !this.state.extraVisible });
  }
  render() {
    const {
      customslist, listFilter,
    } = this.props;
    // const filterName = this.state.filterName === null ?
    // listFilter.filterNo : this.state.filterName;
    this.dataSource.remotes = customslist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      selectedRows: this.state.selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };
    const { scenario } = this.props.listFilter;
    let dateVal = [];
    if (listFilter.filterDate.length > 0 && listFilter.filterDate[0] !== '') {
      dateVal = [moment(listFilter.filterDate[0]), moment(listFilter.filterDate[1])];
    }
    let bulkActions = '';
    if (this.state.selectedRows.length > 0) {
      if (scenario === 'proposed') {
        bulkActions = (
          <PrivilegeCover module="clearance" feature="customs" action="edit">
            <Button type="default" onClick={() => this.handleBatchReview(this.state.selectedRowKeys)}>
              批量复核
            </Button>
          </PrivilegeCover>);
      } else if (scenario === 'reviewed') {
        const ietype = this.state.selectedRows[0].i_e_type;
        const sameIeType = this.state.selectedRows.filter(sr =>
          sr.i_e_type === ietype).length === this.state.selectedRows.length;
        bulkActions = (
          <span>
            {sameIeType && <PrivilegeCover module="clearance" feature="customs" action="edit">
              <Button type="primary" onClick={() => this.handleBatchSend(this.state.selectedRowKeys, ietype)}>
                批量发送
              </Button>
            </PrivilegeCover>}
            <Popconfirm title="是否退回所有选择项？" onConfirm={() => this.handleBatchRecall(this.state.selectedRowKeys)}>
              <Button>
                批量退回
              </Button>
            </Popconfirm>
          </span>);
      }
    }
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
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
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const dropdownMenuItems = [
      {
        elementKey: 'gTodo',
        title: '复核申报',
        elements: Object.keys(CMS_DECL_TODO).map(decl => ({
          icon: CMS_DECL_TODO[decl].icon, name: CMS_DECL_TODO[decl].text, elementKey: decl,
        })),
      },
      {
        elementKey: 'gTrack',
        title: '通关追踪',
        elements: Object.keys(CMS_DECL_TRACK).map(decl => ({
          icon: CMS_DECL_TRACK[decl].icon, name: CMS_DECL_TRACK[decl].text, elementKey: decl,
        })),
      },
      {
        elementKey: 'gException',
        title: '异常管理',
        elements: Object.keys(CMS_DECL_EXCEPTION).map(decl => ({
          icon: CMS_DECL_EXCEPTION[decl].icon,
          name: CMS_DECL_EXCEPTION[decl].text,
          elementKey: decl,
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
        >
          <PageHeader.Actions>
            <Button icon="mail" onClick={this.showDeclMsgDock}>{this.msg('declMsg')}</Button>
            <Button icon="solution" onClick={this.handleBrokers}>
              {this.msg('broker')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowKey="id"
            loading={customslist.loading}
          />
        </PageContent>
        <FillCustomsNoModal reload={this.handleTableLoad} />
        <FillCiqNoModal reload={this.handleTableLoad} />
        <DeclReleasedModal reload={this.handleTableLoad} />
        <SendDeclMsgModal reload={this.handleTableLoad} />
        <BatchSendModal reload={this.handleTableLoad} />
        <InspectModal reload={this.handleTableLoad} />
        <DeclModModal reload={this.handleTableLoad} />
        <DeclMsgPanel />
        <DeclMsgModal />
        <ReviewDeclsModal reload={this.handleTableLoad} />
      </Layout>
    );
  }
}
