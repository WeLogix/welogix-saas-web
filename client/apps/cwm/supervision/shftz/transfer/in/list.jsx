import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Layout, Select, Tag, message } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { loadEntryRegDatas } from 'common/reducers/cwmShFtz';
import { showDock } from 'common/reducers/cwmReceive';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { CWM_SHFTZ_IN_REGTYPES } from 'common/constants';
import { format } from 'client/common/i18n/helpers';
import PageHeader from 'client/components/PageHeader';
import messages from '../../message.i18n';

const formatMsg = format(messages);
const { Content } = Layout;
const { Option } = Select;
const { OptGroup } = Select;

@injectIntl
@connect(
  state => ({
    entryList: state.cwmShFtz.entryList,
    listFilter: state.cwmShFtz.listFilter,
    whses: state.cwmContext.whses,
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    loading: state.cwmShFtz.loading,
    userMembers: state.account.userMembers,
  }),
  { loadEntryRegDatas, switchDefaultWhse, showDock }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class SHFTZTransferInList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    entryList: PropTypes.shape({ current: PropTypes.number }).isRequired,
    listFilter: PropTypes.shape({ status: PropTypes.string }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { listFilter } = this.props;
    let { status } = listFilter;
    if (['all', 'pending', 'processing', 'completed'].filter(stkey => stkey === status).length === 0) {
      status = 'all';
    }
    let { ownerView } = listFilter;
    if (ownerView !== 'all' && this.props.owners.filter(owner => listFilter.ownerView === owner.customs_code).length === 0) {
      ownerView = 'all';
    }
    const filter = {
      ...listFilter, status, type: 'transfer', ownerView, filterNo: '',
    };
    this.handleEntryListLoad(1, null, filter);
  }
  msg = key => formatMsg(this.props.intl, key);
  columns = [{
    title: '保税入库单号',
    width: 200,
    dataIndex: 'ftz_ent_no',
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: '监管类型',
    dataIndex: 'ftz_ent_type',
    width: 100,
    render: (enttype) => {
      const entType = CWM_SHFTZ_IN_REGTYPES.filter(regtype => regtype.value === enttype)[0];
      return entType && <Tag color={entType.tagcolor}>{entType.ftztext}</Tag>;
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (o) => {
      if (o === 0) {
        return (<Badge status="default" text="待转入" />);
      } else if (o === 1) {
        return (<Badge status="processing" text="已接收" />);
      } else if (o === 2) {
        return (<Badge status="success" text="已核对" />);
      }
      return null;
    },
  }, {
    title: 'ASN编号',
    dataIndex: 'asn_no',
    width: 160,
    render: o => (<a onClick={() => this.handlePreview(o)}>{o}</a>),
  }, {
    title: '订单追踪号',
    dataIndex: 'po_no',
    width: 160,
  }, {
    title: '收货单位',
    width: 280,
    dataIndex: 'owner_name',
    render: (o, record) => (record.owner_cus_code ? <span>{`${record.owner_cus_code}|${o}`}</span> : o),
  }, {
    title: '收货仓库号',
    width: 100,
    dataIndex: 'owner_ftz_whse_code',
  }, {
    title: '发货单位',
    width: 280,
    dataIndex: 'sender_name',
    render: (o, record) => (record.sender_cus_code ? <span>{`${record.sender_cus_code}|${o}`}</span> : o),
  }, {
    title: '发货仓库号',
    width: 100,
    dataIndex: 'sender_ftz_whse_code',
  }, {
    title: '进库日期',
    width: 120,
    dataIndex: 'ftz_ent_date',
    render: o => o && moment(o).format('YYYY.MM.DD'),
  }, {
    title: '创建时间',
    width: 120,
    dataIndex: 'created_date',
    render: o => o && moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 80,
    render: o => this.props.userMembers.find(member => member.login_id === o)
    && this.props.userMembers.find(member => member.login_id === o).name,
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => (record.status < 2 ?
      <RowAction onClick={this.handleDetail} icon="form" label="详情" row={record} /> :
      <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />),
  }]
  handlePreview = (asnNo) => {
    this.props.showDock(asnNo);
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadEntryRegDatas(params),
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
    remotes: this.props.entryList,
  })
  handleEntryListLoad = (currentPage, whsecode, filter) => {
    const { whse, listFilter, entryList: { pageSize, current } } = this.props;
    const newfilter = filter || listFilter;
    this.props.loadEntryRegDatas({
      filter: JSON.stringify(newfilter),
      pageSize,
      currentPage: currentPage || current,
      whseCode: whsecode || whse.code,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleStatusChange = (value) => {
    if (value === this.props.listFilter.status) {
      return;
    }
    const filter = { ...this.props.listFilter, status: value };
    this.handleEntryListLoad(1, this.props.whse.code, filter);
  }
  handleCreateBtnClick = () => {
    this.context.router.push('/cwm/ftz/receive/reg');
  }
  handleDetail = (row) => {
    const link = `/cwm/supervision/shftz/transfer/in/${row.pre_ftz_ent_no}`;
    this.context.router.push(link);
  }
  handleWhseChange = (value) => {
    this.props.switchDefaultWhse(value);
    message.info('当前仓库已切换');
    this.handleEntryListLoad(1, value);
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.listFilter, filterNo: searchVal };
    this.handleEntryListLoad(1, this.props.whse.code, filters);
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.listFilter, ownerView: value };
    this.handleEntryListLoad(1, this.props.whse.code, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { entryList, listFilter, owners } = this.props;
    this.dataSource.remotes = entryList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dropdownMenuItems = [
      { name: '全部状态', elementKey: 'all' },
      { elementKey: 'pending', icon: 'file-unknown', name: '待转入' },
      { elementKey: 'processing', icon: 'file-sync', name: '已接收' },
      { elementKey: 'completed', icon: 'file-done', name: '已核对' },
    ];
    const dropdownMenu = {
      selectedMenuKey: listFilter.status,
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems,
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.filterNo} placeholder={this.msg('entrySearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={listFilter.ownerView}
        onChange={this.handleOwnerSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <OptGroup>
          <Option value="all">全部货主</Option>
          {owners.map(data => (<Option key={data.customs_code} value={data.customs_code} search={`${data.partner_code}${data.name}`}>{data.name}</Option>))}
        </OptGroup>
      </Select>
    </span>);
    return (
      <Layout>
        <PageHeader title={this.msg('ftzTransferIn')} dropdownMenu={dropdownMenu} />
        <Content className="page-content" key="main">
          <DataTable
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource={this.dataSource}
            indentSize={8}
            rowKey="id"
            defaultExpandedRowKeys={['1']}
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            loading={this.props.loading}
          />
        </Content>
      </Layout>
    );
  }
}
