import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Layout, Icon, Input, Select, Tag, message, notification } from 'antd';
import { CMS_TRADE_REPO_PERMISSION } from 'common/constants';
import { loadWorkspaceItems, auditItems } from 'common/reducers/cmsTradeitem';
import connectNav from 'client/common/decorators/connect-nav';
import RowAction from 'client/components/RowAction';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import SidePanel from 'client/components/SidePanel';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import ModuleMenu from '../menu';
import makeColumns from './commonCols';

import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { Content } = Layout;


@injectIntl
@connect(
  state => ({
    repos: state.cmsTradeitem.repos.filter(rep =>
      rep.permission === CMS_TRADE_REPO_PERMISSION.edit),
    workspaceLoading: state.cmsTradeitem.workspaceLoading,
    workspaceItemList: state.cmsTradeitem.workspaceItemList,
    workspaceListFilter: state.cmsTradeitem.workspaceListFilter,
  }),
  { loadWorkspaceItems, auditItems }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmTradeItem',
})
export default class PendingItemsList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    refuseReason: '',
  }
  componentDidMount() {
    this.handleReload(1, null, { name: '', repoId: '', status: 'pending' });
  }
  msg = formatMsg(this.props.intl)
  columns = makeColumns({
    msg: this.msg,
    withRepo: true,
    audit: true,
  }).concat([{
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 200,
    fixed: 'right',
    render: (_, record) => (
      <PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.handleItemPass} icon="check-circle-o" label={this.msg('approve')} row={record} />
        <RowAction
          popover={<div>
            <Input onChange={this.handleRefuseReason} value={this.state.refuseReason} placeholder="原因" style={{ width: 150 }} />
            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.handleItemRefused(record)}>确定</Button>
          </div>}
          icon="close-circle-o"
          label={this.msg('reject')}
        />
        <RowAction onClick={this.handleItemEdit} icon="edit" tooltip={this.msg('modify')} row={record} />
      </PrivilegeCover>),
  }])
  handleItemEdit = (record) => {
    const link = `/clearance/tradeitem/workspace/item/${record.id}`;
    this.context.router.push(link);
  }
  handleItemPass = (row) => {
    this.props.auditItems([row.id], { action: 'pass' }).then((result) => {
      if (result.error) {
        notification.error({ message: 'Error', description: result.error.message });
        return;
      }
      message.success('已加入归类库');
      this.handleReload(1);
    });
  }
  handleRefuseReason = (ev) => {
    this.setState({ refuseReason: ev.target.value });
  }
  handleItemRefused = (row) => {
    this.props.auditItems([row.id], { action: 'refuse', reason: this.state.refuseReason }).then((result) => {
      if (result.error) {
        notification.error({ message: 'Error', description: result.error.message });
        return;
      }
      this.handleReload(1);
    });
    this.setState({ refuseReason: '' });
  }
  handleBatchPass = (batchSrc) => {
    const { workspaceListFilter } = this.props;
    let batchIds = batchSrc;
    if (batchSrc === 'selected') {
      batchIds = this.state.selectedRowKeys.slice(0, 10000);
    }
    this.props.auditItems(batchIds, { action: 'pass', repoId: workspaceListFilter.repoId }).then((result) => {
      if (result.error) {
        notification.error({ message: 'Error', description: result.error.message });
        return;
      }
      if (result.data && result.data.key === 'limit-10k') {
        message.success('前1万条记录已加入归类库');
      } else {
        message.success('已加入归类库');
      }
      this.handleReload(1);
    });
  }
  handleBatchRefuse = (batchSrc) => {
    const { workspaceListFilter } = this.props;
    let batchIds = batchSrc;
    if (batchSrc === 'selected') {
      batchIds = this.state.selectedRowKeys.slice(0, 10000);
    }
    this.props.auditItems(batchIds, {
      action: 'refuse',
      repoId: workspaceListFilter.repoId,
    }).then((result) => {
      if (result.error) {
        notification.error({ message: 'Error', description: result.error.message });
        return;
      }
      if (result.data && result.data.key === 'limit-10k') {
        message.success('前1万条记录已拒绝');
      } else {
        message.success('当前记录已拒绝');
      }
      this.handleReload(1);
    });
  }
  handleReload = (current, pageSize, filter) => {
    this.props.loadWorkspaceItems({
      pageSize: pageSize || this.props.workspaceItemList.pageSize,
      current: current || this.props.workspaceItemList.current,
      filter: JSON.stringify(filter || this.props.workspaceListFilter),
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.workspaceListFilter, name: value };
    this.handleReload(1, null, filter);
  }
  handleRepoSelect = (repoId) => {
    const filter = { ...this.props.workspaceListFilter, repoId };
    this.handleReload(1, null, filter);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      workspaceLoading, workspaceItemList, workspaceListFilter, repos,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadWorkspaceItems(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination, tblfilters) => {
        const newfilters = { ...workspaceListFilter, ...tblfilters[0] };
        const params = {
          pageSize: pagination.pageSize,
          current: pagination.current,
          filter: JSON.stringify(newfilters),
        };
        return params;
      },
      remotes: workspaceItemList,
    });
    const toolbarActions = (<span>
      <Select
        showSearch
        placeholder="所属归类库"
        optionFilterProp="children"
        allowClear
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        onChange={this.handleRepoSelect}
        value={workspaceListFilter.repoId ? String(workspaceListFilter.repoId) : undefined}
        suffixIcon={<Icon type="database" />}
      >
        {repos.map(rep =>
          (<Option value={String(rep.id)} key={rep.owner_name}>
            <Tag>{this.msg(rep.mode)}</Tag>
            {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
          </Option>))}
      </Select>
      <SearchBox placeholder={this.msg('商品货号/HS编码/品名')} onSearch={this.handleSearch} value={workspaceListFilter.name} />
    </span>);
    const bulkActions = (<PrivilegeCover module="clearance" feature="compliance" action="edit">
      <Button onClick={() => this.handleBatchPass('selected')}>批量通过</Button>
      <Button onClick={() => this.handleBatchRefuse('selected')}>批量拒绝</Button>
    </PrivilegeCover>);
    return (
      <Layout>
        <SidePanel width={200}>
          <ModuleMenu currentKey="pending" />
        </SidePanel>
        <Layout>
          <PageHeader title={this.msg('taskReview')}>
            <PageHeader.Actions>
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                <Button icon="close-circle-o" onClick={() => this.handleBatchRefuse(null)}>全部拒绝</Button>
                <Button icon="check-circle-o" onClick={() => this.handleBatchPass(null)}>全部通过</Button>
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={toolbarActions}
              selectedRowKeys={this.state.selectedRowKeys}
              onDeselectRows={this.handleDeselectRows}
              columns={this.columns}
              dataSource={dataSource}
              bulkActions={bulkActions}
              rowSelection={rowSelection}
              rowKey="id"
              loading={workspaceLoading}
              locale={{ emptyText: '当前没有待审核的归类' }}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
