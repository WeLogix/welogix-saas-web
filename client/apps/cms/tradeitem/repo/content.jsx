import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import { Button, Form, Layout, Radio, Icon, Popconfirm, Popover, Select, Tag, Tooltip, message, Checkbox, Dropdown, Menu, Drawer } from 'antd';
import { CMS_TRADE_REPO_PERMISSION, LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { getElementByHscode } from 'common/reducers/cmsHsCode';
import { showDeclElementsModal } from 'common/reducers/cmsManifest';
import {
  loadRepo, getLinkedSlaves, loadTradeItems, deleteItems, replicaMasterSlave, updateRepoInfo,
  toggleHistoryItemsDecl, toggleItemDiffModal, getMasterTradeItem,
} from 'common/reducers/cmsTradeitem';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ExportDataPanel from 'client/components/ExportDataPanel';
import LogsPane from 'client/components/Dock/common/logsPane';
import { toggleExportPanel, loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import { toggleBizObjLogsPanel } from 'common/reducers/operationLog';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import DeclElementsModal from '../../common/modal/declElementsModal';
import ItemDiffModal from '../workspace/modal/itemDiffModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    listFilter: state.cmsTradeitem.listFilter,
    tradeItemlist: state.cmsTradeitem.tradeItemlist,
    repo: state.cmsTradeitem.repo,
    tradeItemsLoading: state.cmsTradeitem.tradeItemsLoading,
    submitting: state.cmsTradeitem.submitting,
    adaptors: state.hubDataAdapter.modelAdaptors,
    units: state.saasParams.latest.unit,
    currencies: state.saasParams.latest.currency,
    tradeCountries: state.saasParams.latest.country,
    visible: state.operationLog.bizObjLogPanel.visible,
  }),
  {
    loadTradeItems,
    deleteItems,
    loadRepo,
    getLinkedSlaves,
    replicaMasterSlave,
    getElementByHscode,
    showDeclElementsModal,
    toggleHistoryItemsDecl,
    toggleItemDiffModal,
    getMasterTradeItem,
    toggleExportPanel,
    loadModelAdaptors,
    updateRepoInfo,
    toggleBizObjLogsPanel,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
  title: 'tradeItemRepo',
})
export default class RepoContent extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tradeItemlist: PropTypes.shape({ pageSize: PropTypes.number }).isRequired,
    repo: PropTypes.shape({ creator_tenant_id: PropTypes.number.isRequired }),
    listFilter: PropTypes.shape({ status: PropTypes.string }).isRequired,
    tradeItemsLoading: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    linkedSlaves: [],
    masterReplica: {
      visible: false,
      source: '',
      slave: null,
    },
    fork: false,
    history: false,
    importPanelVisible: false,
  }
  componentDidMount() {
    this.props.loadRepo(this.props.params.repoId);
    this.props.loadTradeItems({
      repoId: this.props.params.repoId,
      filter: JSON.stringify(this.props.listFilter),
      pageSize: this.props.tradeItemlist.pageSize,
      currentPage: this.props.tradeItemlist.current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.repo && nextProps.repo !== this.props.repo) {
      if (nextProps.repo.mode === 'master') {
        this.props.getLinkedSlaves(nextProps.params.repoId).then((result) => {
          if (!result.error) {
            this.setState({ linkedSlaves: result.data });
          }
        });
      }
      this.props.loadModelAdaptors(
        nextProps.repo.owner_partner_id,
        [LINE_FILE_ADAPTOR_MODELS.CMS_TRADEITEM.key]
      );
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    dataIndex: 'mark',
    width: 40,
    align: 'center',
    render: (o, record) => {
      if (record.pre_classify_end_date && moment().isAfter(moment(record.pre_classify_end_date))) {
        return (<Popover content="到期失效" placement="right">
          <Icon type="disconnect" className="text-danger" />
        </Popover>);
      }
      if (record.decl_status === 1) {
        return (<Popover content="可用于保税库存出库申报的归类历史数据" placement="right">
          <Icon type="clock-circle-o" className="text-info" />
        </Popover>);
      }
      return (!record.stage ?
        <Popover content="归类主数据" placement="right">
          <Icon type="check-circle-o" className="text-success" />
        </Popover> :
        <Popover content={`分支标识:${record.src_product_no}`} placement="right">
          <Icon type="exclamation-circle-o" className="text-warning" />
        </Popover>);
    },
  }, {
    title: this.msg('copProductNo'),
    dataIndex: 'cop_product_no',
    width: 200,
  /*
  }, {
    title: this.msg('copCode'),
    dataIndex: 'cop_code',
    width: 150,
  */
  }, {
    title: this.msg('itemType'),
    dataIndex: 'item_type',
    width: 60,
    render: o => (o === 'FP' ? <Tag>成品</Tag> : <Tag>料件</Tag>),
  /*
  }, {
    title: this.msg('enName'),
    dataIndex: 'en_name',
    width: 200,
  */
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: this.msg('ciqCode'),
    dataIndex: 'ciqcode',
    width: 100,
    render: cc => (cc ? <span>{cc}</span> :
      (<Tooltip title="检验检疫未填">
        <Tag color="red" />
      </Tooltip>)),
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 200,
  }, {
    title: this.msg('gModel'),
    dataIndex: 'g_model',
    width: 300,
    onCellClick: record => record.cop_product_no && this.handleShowDeclElementModal(record),
    render: o => <a role="presentation">{o}</a>,
  }, {
    title: this.msg('gUnit'),
    dataIndex: 'g_unit_1',
    width: 100,
    align: 'center',
    render: (o, record) => {
      const gUnitCode = record.g_unit_1 || record.g_unit_2 || record.g_unit_3;
      if (gUnitCode) {
        const unit = this.props.units.filter(cur => cur.unit_code === gUnitCode)[0];
        return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
      }
      return null;
    },
  /*
  }, {
    title: this.msg('gUnit1'),
    dataIndex: 'g_unit_1',
    width: 100,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  }, {
    title: this.msg('gUnit2'),
    dataIndex: 'g_unit_2',
    width: 100,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  }, {
    title: this.msg('gUnit3'),
    dataIndex: 'g_unit_3',
    width: 100,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  }, {
    title: this.msg('unit1'),
    dataIndex: 'unit_1',
    width: 130,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  }, {
    title: this.msg('unit2'),
    dataIndex: 'unit_2',
    width: 130,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  }, {
    title: this.msg('fixedQty'),
    dataIndex: 'fixed_qty',
    width: 120,
  }, {
    title: this.msg('fixedUnit'),
    dataIndex: 'fixed_unit',
    width: 130,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.unit_code === o)[0];
      return unit ? `${unit.unit_code}| ${unit.unit_name}` : o;
    },
  */
  }, {
    title: this.msg('preClassifyStartDate'),
    dataIndex: 'pre_classify_start_date ',
    width: 120,
    render: (o, record) => {
      if (record.pre_classify_start_date) {
        return moment(record.pre_classify_start_date).format('YYYY.MM.DD');
      }
      return '--';
    },
  }, {
    title: this.msg('preClassifyEndDate'),
    dataIndex: 'pre_classify_end_date ',
    width: 120,
    render: (o, record) => {
      if (record.pre_classify_end_date) {
        return moment(record.pre_classify_end_date).format('YYYY.MM.DD');
      }
      return '--';
    },
  }, {
    title: this.msg('unitNetWt'),
    dataIndex: 'unit_net_wt',
    width: 120,
  /*
  }, {
    title: this.msg('origCountry'),
    dataIndex: 'origin_country',
    width: 120,
    render: (o) => {
      const country = this.props.tradeCountries.filter(cur => cur.cntry_co === o)[0];
      return country ? `${country.cntry_co}| ${country.cntry_name_cn}` : o;
    },
  }, {
    title: this.msg('unitPrice'),
    dataIndex: 'unit_price',
    width: 120,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    width: 120,
    render: (o) => {
      const currency = this.props.currencies.filter(cur => cur.curr_code === o)[0];
      return currency ? `${currency.curr_code}| ${currency.curr_name}` : o;
    },
  }, {
    title: this.msg('customsControl'),
    dataIndex: 'customs_control',
    width: 120,
  }, {
    title: this.msg('inspQuarantine'),
    dataIndex: 'inspection_quarantine',
    width: 120,
  }, {
    title: this.msg('applCertCode'),
    dataIndex: 'appl_cert_code',
    width: 150,
  }, {
    title: this.msg('preClassifyNo'),
    dataIndex: 'pre_classify_no',
    width: 120,
  */
  }, {
    title: this.msg('branchCount'),
    dataIndex: 'branch_count',
    width: 60,
    align: 'center',
    render: (branch, row) => {
      if (branch > 0) {
        return <Tooltip title="查看分支版本"><a onClick={() => this.handleViewBranch(row.cop_product_no)}>{branch}</a></Tooltip>;
      }
      return null;
    },
  }, {
    title: this.msg('versionedCount'),
    dataIndex: 'versioned_count',
    width: 60,
    align: 'center',
    render: (versioned, row) => {
      if (versioned > 0) {
        return <Tooltip title="查看保留版本"><a onClick={() => this.handleViewVersions(row.cop_product_no)}>{versioned}</a></Tooltip>;
      }
      return null;
    },
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
    width: 180,
  }, {
    title: this.msg('lastUpdatedDate'),
    dataIndex: 'modify_date',
    width: 150,
    render: cd => cd && moment(cd).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 150,
    render: cd => cd && moment(cd).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 90,
    fixed: 'right',
    render: (o, record) => {
      if (this.props.repo.permission === CMS_TRADE_REPO_PERMISSION.edit) {
        if (this.props.listFilter.status === 'master') {
          if (this.props.repo.mode === 'slave') {
            return (<PrivilegeCover module="clearance" feature="compliance" action="edit">
              <RowAction onClick={this.handleItemFork} icon="fork" tooltip={this.msg('forkItem')} row={record} />
            </PrivilegeCover>);
          }
          return (
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <RowAction onClick={this.handleItemEdit} icon="edit" tooltip={this.msg('edit')} row={record} />
              <RowAction onClick={this.handleItemFork} icon="fork" tooltip={this.msg('forkItem')} row={record} />
            </PrivilegeCover>
          );
        }
        if (record.decl_status === 1) {
          return (
            <span>
              <RowAction onClick={this.handleItemDiff} icon="swap" tooltip={this.msg('diff')} row={record} />
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                <RowAction onClick={() => this.handleHistoryToggle([record.id], 'disable')} icon="pause-circle-o" tooltip="禁用" row={record} />
              </PrivilegeCover>
            </span>
          );
        }
        return (
          <span>
            <RowAction onClick={this.handleItemDiff} icon="swap" tooltip={this.msg('diff')} row={record} />
            <PrivilegeCover module="clearance" feature="compliance" action="delete">
              <RowAction confirm="确定删除?" onConfirm={this.handleItemDelete} icon="delete" tooltip={this.msg('delete')} row={record} />
            </PrivilegeCover>
          </span>
        );
      }
      return <span />;
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadTradeItems(params),
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
        repoId: this.props.params.repoId,
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
      };
      const filter = this.props.listFilter;
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.tradeItemlist,
  })
  handleViewBranch = (productNo) => {
    const filter = { ...this.props.listFilter, status: 'branch', search: productNo };
    this.handleItemListLoad(1, filter);
  }
  handleViewVersions = (productNo) => {
    const filter = {
      ...this.props.listFilter, status: 'versioned', search: productNo,
    };
    this.handleItemListLoad(1, filter);
  }
  handleItemAdd = () => {
    const { params: { repoId } } = this.props;
    const link = `/clearance/tradeitem/repo/${repoId}/item/add`;
    this.context.router.push(link);
  }
  handleItemEdit = (record) => {
    const { params: { repoId } } = this.props;
    const link = `/clearance/tradeitem/repo/${repoId}/item/edit/${record.id}`;
    this.context.router.push(link);
  }
  handleItemFork = (record) => {
    const { params: { repoId } } = this.props;
    const link = `/clearance/tradeitem/repo/${repoId}/item/fork/${record.id}`;
    this.context.router.push(link);
  }
  handleItemDelete = (row) => {
    this.props.deleteItems({ repoId: this.props.params.repoId, ids: [row.id] }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleItemListLoad();
      }
    });
  }
  handleItemDiff = (record) => {
    const { params: { repoId } } = this.props;
    let master = null;
    this.props.getMasterTradeItem(repoId, record.cop_product_no).then((result) => {
      if (!result.error) {
        master = result.data;
        this.props.toggleItemDiffModal(true, master, record);
      }
    });
  }
  handleItemListLoad = (currentPage, filter) => {
    const { listFilter, tradeItemlist: { pageSize, current } } = this.props;
    this.props.loadTradeItems({
      repoId: this.props.params.repoId,
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      currentPage: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleShowDeclElementModal = (record) => {
    this.props.getElementByHscode(record.hscode).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          record.id, record.g_model,
          true,
          record.g_name
        );
      }
    });
  }
  handleDeleteSelected = () => {
    const selectedIds = this.state.selectedRowKeys;
    this.props.deleteItems({
      repoId: this.props.params.repoId,
      ids: selectedIds,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleItemListLoad();
      }
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleFilterChange = (ev) => {
    if (ev.target.value === this.props.listFilter.status) {
      return;
    }
    const filter = { ...this.props.listFilter, status: ev.target.value };
    if (filter.status === 'master') {
      filter.search = '';
    }
    this.handleItemListLoad(1, filter);
    this.handleDeselectRows();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleSearch = (value) => {
    if (this.props.listFilter.search !== value) {
      const filter = { ...this.props.listFilter, search: value };
      this.handleItemListLoad(1, filter);
    }
  }
  handleModifyRangeChange = (dateRanges, dateRangeStr) => {
    if (dateRangeStr[0] && dateRangeStr[1]) {
      const filter = {
        ...this.props.listFilter,
        modifyDates: {
          start: dateRangeStr[0],
          end: dateRangeStr[1],
        },
      };
      this.handleItemListLoad(1, filter);
    }
  }
  handleHistoryToggle = (itemIds, action) => {
    const { params } = this.props;
    this.props.toggleHistoryItemsDecl(params.repoId, itemIds, action).then((result) => {
      if (!result.error) {
        this.handleItemListLoad();
        this.handleDeselectRows();
      }
    });
  }
  handleExportSelected = () => {
    this.props.toggleExportPanel(true);
  }
  handleReplicaSource = (ev) => {
    const masterReplica = { ...this.state.masterReplica };
    masterReplica.source = ev.target.value;
    this.setState({ masterReplica });
  }
  handleReplicaSlave = (slave) => {
    const masterReplica = { ...this.state.masterReplica };
    masterReplica.slave = slave;
    this.setState({ masterReplica });
  }
  handleMasterReplicaVisibleChange = (visible) => {
    const masterReplica = { ...this.state.masterReplica };
    masterReplica.visible = visible;
    this.setState({ masterReplica });
  }
  handleMasterSlaveReplica = () => {
    this.props.replicaMasterSlave({
      masterRepo: this.props.params.repoId,
      slaveRepo: this.state.masterReplica.slave,
      source: this.state.masterReplica.source,
    }).then((result) => {
      if (!result.error) {
        if (this.state.masterReplica.source === 'slave') {
          message.info('同步任务已创建', 10);
        } else if (this.state.masterReplica.source === 'master') {
          message.info('主库已开始向从库同步物料归类', 10);
        }
        this.setState({ masterReplica: { visible: false, source: '', slave: null } });
      }
    });
  }
  handleTradeItemExport = () => {
    this.props.toggleExportPanel(true);
  }
  handleForkChange = (e) => {
    this.setState({
      fork: e.target.checked,
    });
  }
  handleHistoryChange = (e) => {
    this.setState({
      history: e.target.checked,
    });
  }
  handleUploaded = () => {
    this.setState({
      importPanelVisible: false,
    });
    this.handleItemListLoad();
  }
  handleImport = () => {
    this.setState({
      importPanelVisible: true,
    });
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'log') {
      this.props.toggleBizObjLogsPanel(true, this.props.params.repoId, 'cmsRepo');
    }
  }
  handleClosePane = () => {
    this.props.toggleBizObjLogsPanel(false);
  }
  render() {
    const {
      tradeItemlist, repo, listFilter, submitting, tenantId, visible,
    } = this.props;
    const { linkedSlaves, masterReplica } = this.state;
    // const { modifyDates } = listFilter;
    const selectedRows = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    let bulkActions = null;
    if (repo.permission === CMS_TRADE_REPO_PERMISSION.edit && selectedRows.length > 0) {
      bulkActions = [
        <Button icon="export" onClick={this.handleExportSelected} key="selexport">
        批量导出
        </Button>,
        <PrivilegeCover module="clearance" feature="compliance" action="delete">
          <Popconfirm title="是否删除所有选择项？" onConfirm={() => this.handleDeleteSelected()} key="seldel">
            <Button type="danger" icon="delete">
                批量删除
            </Button>
          </Popconfirm>
        </PrivilegeCover>,
      ];
      if (listFilter.status === 'versioned') {
        bulkActions.push(<PrivilegeCover module="clearance" feature="compliance" action="edit">
          <Button key="version" icon="pause-circle-o" style={{ marginLeft: 8 }} onClick={() => this.handleHistoryToggle(selectedRows, 'disable')}>批量禁用</Button>
        </PrivilegeCover>);
      }
    }
    this.dataSource.remotes = tradeItemlist;
    const toolbarActions = (<span>
      <SearchBox value={listFilter.search} placeholder="编码/名称/描述/申报要素" onSearch={this.handleSearch} key="searchbar" />
      <RadioGroup
        value={listFilter.status}
        onChange={this.handleFilterChange}
      >
        <RadioButton value="master"><Icon type="check-circle-o" /> {this.msg('tradeItemMaster')}</RadioButton>
        <RadioButton value="branch"><Icon type="exclamation-circle-o" /> {this.msg('tradeItemBranch')}</RadioButton>
        <RadioButton value="versioned"><Icon type="clock-circle-o" /> {this.msg('tradeItemHistory')}</RadioButton>
      </RadioGroup>
      {/* <RangePicker format="YYYY/MM/DD" value={[moment(modifyDates.start),
        moment(modifyDates.end)]} onChange={this.handleModifyRangeChange} /> */}
    </span>);
    let { columns } = this;
    if (listFilter.status !== 'master') {
      columns = columns.filter(col => !(col.dataIndex === 'branch_count' || col.dataIndex === 'versioned_count'));
    }
    let repoName = repo.owner_name;
    if (tenantId === repo.owner_tenant_id) {
      repoName = repo.creator_name;
    }
    return (
      <Layout>
        <PageHeader title={repoName}>
          <PageHeader.Actions>
            {listFilter.status === 'versioned' &&
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Button key="version" icon="pause-circle-o" onClick={() => this.handleHistoryToggle(null, 'disable')}>全部禁用</Button>
            </PrivilegeCover>}
            <Button icon="export" onClick={this.handleTradeItemExport}>
              {this.msg('export')}
            </Button>
            {!repo.master_repo_id &&
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Tooltip title="根据导出文件批量修改除商品编码/中文品名/规格型号外其他栏位属性">
                <Button icon="upload" onClick={this.handleImport}>更新数据</Button>
              </Tooltip>
            </PrivilegeCover>}
            { repo.mode === 'master' &&
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Popover
                placement="left"
                title="选择从库与同步方式"
                content={<Form>
                  <FormItem label="从库">
                    <Select
                      allowClear
                      showSearch
                      onChange={this.handleReplicaSlave}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      value={masterReplica.slave}
                    >{linkedSlaves.map(slv =>
                      (<Option key={slv.creator_name} value={String(slv.id)}>
                        {slv.creator_name}</Option>))}
                    </Select>
                  </FormItem>
                  <FormItem label="同步源">
                    <RadioGroup onChange={this.handleReplicaSource} value={masterReplica.source}>
                      <RadioButton value="master">主库</RadioButton>
                      <RadioButton value="slave">从库</RadioButton>
                    </RadioGroup>
                  </FormItem>
                  <Button type="primary" onClick={this.handleMasterSlaveReplica}>确定</Button>
                </Form>}
                trigger="click"
                visible={masterReplica.visible}
                onVisibleChange={this.handleMasterReplicaVisibleChange}
              >
                <Button loading={submitting}>同步数据</Button>
              </Popover>
            </PrivilegeCover>}
            {!repo.master_repo_id &&
            <PrivilegeCover module="clearance" feature="compliance" action="create">
              <Button type="primary" icon="plus-circle-o" onClick={this.handleItemAdd}>{this.msg('add')}</Button>
            </PrivilegeCover>}
            <Dropdown overlay={<Menu onClick={this.handleMenuClick}><Menu.Item key="log"><Icon type="bars" /> 操作记录</Menu.Item></Menu>}>
              <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
            </Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            loading={this.props.tradeItemsLoading}
            rowKey="id"
            columns={columns}
            dataSource={this.dataSource}
          />
          <DeclElementsModal onOk={null} />
          <ItemDiffModal />
          <ExportDataPanel
            type={LINE_FILE_ADAPTOR_MODELS.CMS_TRADEITEM.key}
            exportTypeOpt={{
              use_modify_date: true,
              filter_disabled_reason: tradeItemlist.totalCount > 100000 ? '归类库导出记录不能超过10万条' : undefined,
            }}
            formData={{
              fork: this.state.fork,
              history: this.state.history,
              repoId: this.props.params.repoId,
              filters: {
                selIds: this.state.selectedRowKeys.length > 0
                ? this.state.selectedRowKeys : undefined,
                search: listFilter.search,
              },
            }}
          >
            <Checkbox checked={this.state.fork} onChange={this.handleForkChange}>分支版本</Checkbox>
            <Checkbox
              checked={this.state.history}
              onChange={this.handleHistoryChange}
            >历史版本</Checkbox>
          </ExportDataPanel>
          <ImportDataPanel
            title={this.msg('batchImportTradeItems')}
            visible={this.state.importPanelVisible}
            adaptors={this.props.adaptors}
            endpoint={`${API_ROOTS.default}v1/cms/tradeitem/master/importitem`}
            formData={{}}
            onClose={() => { this.setState({ importPanelVisible: false }); }}
            onUploaded={this.handleUploaded}
            template={`${API_ROOTS.default}v1/cms/tradeitem/download/template/商品归类导入模板.xlsx`}
          />
          <Drawer
            visible={visible}
            onClose={this.handleClosePane}
            title={<span>操作记录</span>}
            width={900}
          >
            <LogsPane />
          </Drawer>
        </Content>
      </Layout>
    );
  }
}
