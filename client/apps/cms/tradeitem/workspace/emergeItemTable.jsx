import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { notification, Icon, Select, Tag } from 'antd';
import { CMS_TRADE_REPO_PERMISSION } from 'common/constants';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { delWorkspaceItem } from 'common/reducers/cmsTradeitem';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import makeColumns from './commonCols';
import { formatMsg } from '../message.i18n';

const { Option } = Select;


@injectIntl
@connect(
  state => ({
    loading: state.cmsTradeitem.workspaceLoading,
    repos: state.cmsTradeitem.repos.filter(rep =>
      rep.permission === CMS_TRADE_REPO_PERMISSION.edit),
  }),
  { delWorkspaceItem }
)
export default class EmergeItemTable extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    withRepo: PropTypes.bool,
    loadEmergeItems: PropTypes.func.isRequired,
    listFilter: PropTypes.shape({
      taskId: PropTypes.number,
      repoId: PropTypes.number,
      name: PropTypes.string,
    }),
    cardView: PropTypes.bool,
    scrollOffset: PropTypes.number,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    emergeSelRowKeys: [],
    emergeFilter: Object.assign({ status: 'emerge', repoId: null, name: '' }, this.props.listFilter),
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.listFilter !== this.props.listFilter && (
      nextProps.listFilter.repoId !== this.props.listFilter.repoId ||
      nextProps.listFilter.name !== this.props.listFilter.name ||
      nextProps.listFilter.taskId !== this.props.listFilter.taskId)
    ) {
      this.setState({ emergeFilter: Object.assign(this.state.emergeFilter, nextProps.listFilter) });
    }
  }
  msg = formatMsg(this.props.intl)
  emergeDataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadEmergeItems(params),
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
      const newfilters = { ...this.state.emergeFilter, ...tblfilters[0] };
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: JSON.stringify(newfilters),
      };
      return params;
    },
    remotes: this.props.emergeList,
  })
  emergeColumns = makeColumns({
    msg: this.msg,
    withRepoItem: false,
    withRepo: this.props.withRepo,
  }).concat({
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 140,
    fixed: 'right',
    render: (_, record) => (<span>
      <PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.handleItemEdit} icon="edit" label={this.msg('modify')} row={record} />
      </PrivilegeCover>
      <PrivilegeCover module="clearance" feature="compliance" action="delete">
        <RowAction confirm={this.msg('deleteConfirm')} onConfirm={this.handleItemDel} icon="delete" row={record} />
      </PrivilegeCover>
    </span>),
  })
  handleItemEdit = (record) => {
    const link = `/clearance/tradeitem/workspace/item/${record.id}`;
    this.context.router.push(link);
  }
  handleItemDel = (record) => {
    this.props.delWorkspaceItem([record.id]).then((result) => {
      if (!result.error) {
        this.props.loadEmergeItems({
          pageSize: this.props.emergeList.pageSize,
          current: this.props.emergeList.current,
          filter: JSON.stringify(this.state.emergeFilter),
        });
      } else {
        notification.error({ title: 'Error', description: result.error.message });
      }
    });
  }
  handleRepoSelect = (repoId) => {
    const filter = { ...this.state.emergeFilter, repoId };
    this.props.loadEmergeItems({
      pageSize: this.props.emergeList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
    this.setState({ emergeFilter: filter });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.emergeFilter, name: value };
    this.props.loadEmergeItems({
      pageSize: this.props.emergeList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
    this.setState({ emergeFilter: filter });
  }
  handleRowDeselect= () => {
    this.setState({ emergeSelRowKeys: [] });
  }
  render() {
    const {
      loading, emergeList, withRepo, repos, cardView, scrollOffset,
    } = this.props;
    const { emergeSelRowKeys } = this.state;
    this.emergeDataSource.remotes = emergeList;
    const emergeSelRows = {
      selectedRowKeys: emergeSelRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ emergeSelRowKeys: selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      {withRepo && <Select
        showSearch
        placeholder="所属归类库"
        optionFilterProp="children"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        allowClear
        onChange={this.handleRepoSelect}
        suffixIcon={<Icon type="database" />}
      >
        {repos.map(rep =>
          (<Option value={String(rep.id)} key={rep.owner_name}>
            <Tag>{this.msg(rep.mode)}</Tag>
            {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
          </Option>))}
      </Select>}
      <SearchBox value={this.state.emergeFilter.name} placeholder={this.msg('商品货号/HS编码/品名')} onSearch={this.handleSearch} />
    </span>);
    return (
      <DataTable
        selectedRowKeys={emergeSelRowKeys}
        onDeselectRows={this.handleRowDeselect}
        loading={loading}
        columns={this.emergeColumns}
        dataSource={this.emergeDataSource}
        rowSelection={emergeSelRows}
        rowKey="id"
        locale={{ emptyText: '当前没有新的商品货号' }}
        toolbarActions={toolbarActions}
        cardView={cardView}
        scrollOffset={scrollOffset}
      />
    );
  }
}

