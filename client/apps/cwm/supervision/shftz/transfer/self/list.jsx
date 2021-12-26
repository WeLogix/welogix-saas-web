import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Layout, Select, message, Button } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { loadEntryRegDatas, showTransferInModal, deleteVirtualTransfer } from 'common/reducers/cwmShFtz';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import PageHeader from 'client/components/PageHeader';
import { CWM_SHFTZ_APIREG_STATUS } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { format } from 'client/common/i18n/helpers';
import TransferSelfModal from './modal/transferSelfModal';
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
  {
    loadEntryRegDatas, switchDefaultWhse, showTransferInModal, deleteVirtualTransfer,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class SHFTZTransferSelfList extends React.Component {
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
      ...listFilter, status, type: 'vtransfer', ownerView, filterNo: '',
    };
    this.handleEntryListLoad(1, null, filter);
  }
  msg = key => formatMsg(this.props.intl, key);
  columns = [{
    title: '转移编号',
    dataIndex: 'asn_no',
    width: 160,
  }, {
    title: '转出出库单号',
    width: 220,
    dataIndex: 'ftz_rel_no',
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: '转入进库单号',
    width: 220,
    dataIndex: 'ftz_ent_no',
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (o) => {
      if (o === 0) {
        return (<Badge status="default" text="待转出" />);
      } else if (o === 1) {
        return (<Badge status="processing" text="终端处理" />);
      } else if (o === 2) {
        return (<Badge status="success" text="已转入" />);
      }
      return null;
    },
  }, {
    title: '转入货主',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '转出货主',
    width: 180,
    dataIndex: 'sender_name',
  }, {
    title: '转入时间',
    width: 150,
    dataIndex: 'ftz_ent_date',
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '转出时间',
    width: 150,
    dataIndex: 'ftz_rel_date',
    render: reldate => reldate && moment(reldate).format('YYYY.MM.DD HH:mm'),
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
    render: (o, record) =>
      (
        <span>
          {record.status === CWM_SHFTZ_APIREG_STATUS.pending ?
            <RowAction onClick={this.handleDetail} icon="form" label="详情" row={record} /> :
            <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />
            }
          {record.status === CWM_SHFTZ_APIREG_STATUS.pending &&
          <PrivilegeCover module="cwm" feature="supervision" action="delete">
            <RowAction confirm="确认删除?" onConfirm={this.handleVTransDel} icon="delete" tooltip="删除" row={record} />
          </PrivilegeCover>}
        </span>
      ),
  }]
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
  handleVTransDel = (row) => {
    const asnNo = row.asn_no;
    this.props.deleteVirtualTransfer({ asnNo }).then((result) => {
      if (!result.error) {
        this.handleEntryListLoad();
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
  handleDetail = (row) => {
    const link = `/cwm/supervision/shftz/transfer/self/${row.asn_no}`;
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
  handleCreateTransSelf = () => {
    const { listFilter, owners } = this.props;
    const ownerCusCode = listFilter.ownerView !== 'all' ? listFilter.ownerView : (owners[0] && owners[0].customs_code);
    this.props.showTransferInModal({ visible: true, ownerCusCode });
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
      { elementKey: 'pending', icon: 'file-unknown', name: '待转出' },
      { elementKey: 'processing', icon: 'file-sync', name: '终端处理' },
      { elementKey: 'completed', icon: 'file-done', name: '已转入' },
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
          <Option value="all">全部转入货主</Option>
          {owners.map(data => (<Option key={data.customs_code} value={data.customs_code} search={`${data.partner_code}${data.name}`}>{data.name}</Option>))}
        </OptGroup>
      </Select>
    </span>);
    return (
      <Layout id="page-layout">
        <PageHeader title={this.msg('ftzTransferSelf')} dropdownMenu={dropdownMenu}>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreateTransSelf}>新建</Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
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
          <TransferSelfModal reload={this.handleEntryListLoad} />
        </Content>
      </Layout>
    );
  }
}
