import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Layout, message, DatePicker, Button } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { SASBL_REG_TYPES, SASBL_BAT_DECL_STATUS } from 'common/constants';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import {
  loadStockioList,
  showCreateBatDeclModal,
  getBatchDeclList,
} from 'common/reducers/cwmSasblReg';
import CreateBatchDeclModal from './modals/createBatchDeclModal';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    whse: state.cwmContext.defaultWhse,
    filters: state.cwmSasblReg.batchDeclFilters,
    batchDeclList: state.cwmSasblReg.batchDeclList,
    reload: state.cwmSasblReg.bdreload,
    loading: state.cwmSasblReg.bdLoading,
  }),
  {
    loadStockioList,
    toggleBizDock,
    showCreateBatDeclModal,
    getBatchDeclList,
    showPreviewer,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class BatDeclRegList extends React.Component {
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
    const { supType, ieType } = this.props.params;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    this.handleBatchDeclListLoad(null, null, filters);
  }
  componentWillReceiveProps(nextprops) {
    const { supType, ieType } = nextprops.params;
    const whseCode = nextprops.whse && nextprops.whse.code;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handleBatchDeclListLoad(1, whseCode, filters);
    } else if (supType !== this.props.params.supType || ieType !== this.props.params.ieType) {
      this.handleBatchDeclListLoad(1, null, filters);
    }
    if (nextprops.reload && nextprops.reload !== this.props.reload) {
      this.handleBatchDeclListLoad(1, null, filters);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleBatchDeclListLoad(1, null, filters);
  }
  showAddStockIoModal = () => this.props.showAddStockIoModal(true)
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('batchNo'),
    width: 180,
    dataIndex: 'batdecl_no',
  }, {
    title: this.msg('stockioCount'),
    width: 100,
    dataIndex: 'bd_stockio_count',
  }, {
    title: this.msg('ownerName'),
    dataIndex: 'owner_name',
    width: 200,
  }, {
    title: this.msg('bdStatus'),
    dataIndex: 'bd_status',
    width: 100,
    render: (o) => {
      const bdStatus = SASBL_BAT_DECL_STATUS.filter(bd => bd.value === o)[0];
      if (bdStatus) {
        return <Badge status={bdStatus.badge} color={bdStatus.tagcolor} text={bdStatus.text} />;
      }
      return '';
    },
  }, {
    title: this.msg('InvtregNo'),
    width: 180,
    dataIndex: 'invt_no',
  }, {
    title: this.msg('rltDelgNo'),
    dataIndex: 'rlt_delg_no',
    width: 160,
    render: o => (
      <a onClick={() => this.handleDelgDockOpen(o)}>
        {o}
      </a>),
  }, {
  //   title: this.msg('relEntryNo'),
  //   width: 180,
  //   dataIndex: 'rlt_entry_no',
  // }, {
  //   title: this.msg('entryNo'),
  //   width: 180,
  //   dataIndex: 'entry_no',
  // }, {
    title: this.msg('declarer'),
    width: 150,
  }, {
    title: this.msg('delgNo'),
    dataIndex: 'delg_no',
    width: 140,
    render: o => (
      <a onClick={() => this.handleDelgDockOpen(o)}>
        {o}
      </a>),
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 140,
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('createdBy'),
    dataIndex: 'created_by',
    width: 140,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => record.bd_status > 0 && (record.bd_status >= 2 ?
      <RowAction onClick={this.handleDetail} icon="eye-o" label={this.msg('view')} row={record} /> :
      <RowAction onClick={this.handleDetail} icon="form" label={this.msg('edit')} row={record} />),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.getBatchDeclList(params),
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
        whseCode: this.props.whse.code,
      };
      const filters = { ...this.props.filters };
      params.filters = filters;
      return params;
    },
    remotes: this.props.batchDeclList,
  })
  handleBatchDeclListLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, batchDeclList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    newfilter.ioFlag = this.context.router.params.ieType;
    this.props.getBatchDeclList({
      filters: newfilter,
      pageSize,
      currentPage: currentPage || current,
      whseCode: whsecode || whse.code,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/cwm/sasbl/batdecl/${this.props.params.supType}/${this.props.params.ieType}/${row.batdecl_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.handleBatchDeclListLoad(1, null, filters);
  }
  handleStockSearch = (stockSearch) => {
    const filters = { ...this.props.filters, stockSearch };
    this.handleBatchDeclListLoad(1, null, filters);
  }
  handleInvtSearch = (invtSearch) => {
    const filters = { ...this.props.filters, invtSearch };
    this.handleBatchDeclListLoad(1, null, filters);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, bdStatus: key };
    this.handleBatchDeclListLoad(1, null, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleCreateBatchDecl = () => {
    const { supType } = this.context.router.params;
    this.props.showCreateBatDeclModal({ visible: true, supType });
  }
  handleDelgDockOpen = (delgNo) => {
    this.props.showPreviewer(delgNo);
  }
  render() {
    const {
      batchDeclList, filters, loading, params: { ieType, supType },
    } = this.props;
    let dateVal = [];
    if (filters.startDate && filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = batchDeclList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.stockSearch} placeholder={this.msg('stockNo')} onSearch={this.handleStockSearch} />
      <SearchBox value={this.props.filters.invtSearch} placeholder={this.msg('batListSearchPlaceHolder')} onSearch={this.handleInvtSearch} />
      <RangePicker
        onChange={this.handleOnDateChange}
        value={dateVal}
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
      />
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'undelg', icon: 'file-unknown', name: this.msg('undelg') },
      { elementKey: 'delged', icon: 'file-sync', name: this.msg('delged') },
      { elementKey: 'manifested', icon: 'file-sync', name: this.msg('manifested') },
      { elementKey: 'declared', icon: 'file-done', name: this.msg('declared') },
      { elementKey: 'released', icon: 'file-done', name: this.msg('released') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.bdStatus,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    const iePrefix = ieType === 'e' ? this.msg('sasOut') : this.msg('sasIn');
    const sasblRegType = SASBL_REG_TYPES.find(item => item.value === supType);
    const bizPrefix = sasblRegType ? sasblRegType.ftztext : '';
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[bizPrefix, iePrefix, this.msg('batchDecl')]}
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreateBatchDecl}>
                {this.msg('newBatchDecl')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            indentSize={0}
            rowKey="id"
            loading={loading}
          />
          <CreateBatchDeclModal />
        </PageContent>
      </Layout>
    );
  }
}
