import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Button, Layout, Select, Tag, message } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { openBatchDeclModal, loadBatchApplyList, batchDelgCancel } from 'common/reducers/cwmShFtz';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import PageHeader from 'client/components/PageHeader';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { format } from 'client/common/i18n/helpers';
import BatchDeclModal from './modal/batchDeclModal';
import messages from '../../message.i18n';

const formatMsg = format(messages);
const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    batchlist: state.cwmShFtz.batchApplyList,
    listFilter: state.cwmShFtz.listFilter,
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners.filter(owner => owner.portion_enabled),
    loading: state.cwmShFtz.loading,
    userMembers: state.account.userMembers,
  }),
  {
    openBatchDeclModal, switchDefaultWhse, loadBatchApplyList, batchDelgCancel,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class BatchDeclList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    listFilter: PropTypes.shape({ status: PropTypes.string.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { listFilter } = this.props;
    let { status, ownerView } = listFilter;
    if (['manifesting', 'pending', 'sent', 'applied', 'cleared', 'all'].filter(stkey => stkey === status).length === 0) {
      status = 'manifesting';
    }
    if (ownerView !== 'all' && this.props.owners.filter(owner => listFilter.ownerView === owner.customs_code).length === 0) {
      ownerView = 'all';
    }
    const filter = {
      ...listFilter, status, ownerView, filterNo: '',
    };
    this.handleBatchApplyLoad(1, null, filter);
  }
  msg = key => formatMsg(this.props.intl, key);
  columns = [{
    title: '??????????????????',
    dataIndex: 'batch_decl_no',
    width: 180,
  }, {
    title: '?????????????????????',
    dataIndex: 'portion_rel_count',
    width: 120,
  }, {
    title: '??????',
    dataIndex: 'status',
    width: 120,
    render: (st) => {
      switch (st) {
        case 'manifest':
          return (<Badge status="default" text="????????????" />);
        case 'generated':
          return (<Badge status="default" text="???????????????" />);
        case 'processing':
          return (<Badge status="processing" text="???????????????" />);
        case 'applied':
          return (<Badge status="processing" text="????????????" />);
        case 'cleared':
          return (<Badge status="success" text="?????????" />);
        default:
          return '';
      }
    },
  }, {
    title: '??????????????????',
    dataIndex: 'ftz_apply_no',
    width: 220,
    render: (fan, row) => <span className="text-emphasis">{fan || row.pre_entry_seq_no}</span>,
  }, {
    title: '????????????',
    dataIndex: 'cus_decl_no',
    width: 200,
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: '??????',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '????????????',
    dataIndex: 'broker_name',
    width: 150,
  }, {
    title: '??????????????????',
    width: 150,
    dataIndex: 'delg_no',
  }, {
    title: '????????????',
    dataIndex: 'apply_type',
    width: 140,
    render: (o) => {
      switch (o) {
        case '0':
          return <Tag>?????????????????????</Tag>;
        case '1':
          return <Tag>????????????????????????</Tag>;
        case '2':
          return <Tag>?????????????????????</Tag>;
        default:
          return '';
      }
    },
  }, {
    title: '?????????',
    dataIndex: 'supplier',
    width: 100,
  }, {
    title: '????????????',
    dataIndex: 'trxn_mode',
    width: 80,
  }, {
    title: '??????',
    dataIndex: 'currency',
    width: 80,
  }, {
    title: '????????????',
    width: 120,
    dataIndex: 'created_date',
    render: o => o && `${moment(o).format('YYYY.MM.DD')}`,
  }, {
    title: '????????????',
    width: 120,
    dataIndex: 'decl_date',
    render: o => o && `${moment(o).format('YYYY.MM.DD')}`,
  }, {
    title: '????????????',
    width: 120,
    dataIndex: 'clear_date',
    render: o => o && `${moment(o).format('YYYY.MM.DD')}`,
  }, {
    title: '????????????',
    dataIndex: 'created_by',
    width: 80,
    render: o => this.props.userMembers.find(member => member.login_id === o) &&
    this.props.userMembers.find(member => member.login_id === o).name,
  }, {
    title: '????????????',
    width: 120,
    dataIndex: 'created_time',
    render: (o, record) => record.created_date && `${moment(record.created_date).format('MM.DD HH:mm')}`,
  }, {
    title: '??????',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => record.batch_decl_no && (<span>
      <RowAction onClick={this.handleDetail} icon="eye-o" label="??????" row={record} />
      <PrivilegeCover module="cwm" feature="supervision" action="delete">
        {record.status === 'manifest' &&
        <RowAction confirm="???????????????????" onConfirm={this.handleDelgCancel} icon="close-circle-o" tooltip="??????????????????" row={record} />}
      </PrivilegeCover>
    </span>),
  }]

  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBatchApplyList(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        whseCode: this.props.whse.code,
      };
      const filter = { ...this.props.listFilter };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.batchlist,
  })
  handleBatchApplyLoad = (currentPage, whsecode, filter) => {
    const { listFilter, whse, batchlist: { pageSize, current } } = this.props;
    this.props.loadBatchApplyList({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      currentPage: currentPage || current,
      whseCode: whsecode || whse.code,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleBatchDeclLoad = () => {
    this.handleBatchApplyLoad(1, null, { ...this.props.listFilter, status: 'manifesting' });
  }
  handleStatusChange = (value) => {
    if (value === this.props.listFilter.status) {
      return;
    }
    const filter = { ...this.props.listFilter, status: value };
    this.handleBatchApplyLoad(1, this.props.whse.code, filter);
  }
  handleCreateBatchDecl = () => {
    const { listFilter, owners } = this.props;
    const ownerCusCode = listFilter.ownerView !== 'all' ? listFilter.ownerView : (owners[0] && owners[0].customs_code);
    this.props.openBatchDeclModal({ ownerCusCode });
  }
  handleDelgCancel = (row) => {
    this.props.batchDelgCancel(row).then((result) => {
      if (!result.error) {
        this.handleBatchApplyLoad();
      }
    });
  }
  handleDelgManifest = (row) => {
    const link = '/clearance/delegation/manifest/';
    this.context.router.push(`${link}${row.delg_no}`);
  }
  handleDetail = (row) => {
    const link = `/cwm/supervision/shftz/decl/batch/${row.batch_decl_no}`;
    this.context.router.push(link);
  }
  handleWhseChange = (value) => {
    this.props.switchDefaultWhse(value);
    message.info('?????????????????????');
    this.handleBatchApplyLoad(1, value);
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.listFilter, filterNo: searchVal };
    this.handleBatchApplyLoad(1, this.props.whse.code, filters);
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.listFilter, ownerView: value };
    this.handleBatchApplyLoad(1, this.props.whse.code, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { listFilter, owners, batchlist } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = batchlist;
    const dropdownMenuItems = [
      { name: '????????????', elementKey: 'all' },
      { elementKey: 'manifesting', icon: 'file-unknown', name: '????????????' },
      { elementKey: 'applying', icon: 'file-sync', name: '????????????' },
      { elementKey: 'cleared', icon: 'file-done', name: '?????????' },
    ];
    const dropdownMenu = {
      selectedMenuKey: listFilter.status,
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems,
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.filterNo} placeholder={this.msg('batchSearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={listFilter.ownerView}
        onChange={this.handleOwnerSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all">????????????</Option>
        {owners.map(data => (<Option
          key={data.customs_code}
          value={data.customs_code}
          search={`${data.partner_code}${data.name}`}
        >{data.name}
        </Option>))}
      </Select>
    </span>);
    return (
      <Layout id="page-layout">
        <PageHeader title={this.msg('ftzBatchDecl')} dropdownMenu={dropdownMenu}>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreateBatchDecl}>
                {this.msg('create')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource={this.dataSource}
            rowKey="id"
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            loading={this.props.loading}
          />
        </Content>
        <BatchDeclModal reload={this.handleBatchDeclLoad} />
      </Layout>
    );
  }
}
