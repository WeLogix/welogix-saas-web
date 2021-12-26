import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Icon, Select, Tag, notification } from 'antd';
import { CMS_TRADE_REPO_PERMISSION } from 'common/constants';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { delWorkspaceItem, resolveWorkspaceItem, toggleItemDiffModal } from 'common/reducers/cmsTradeitem';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import makeColumns from './commonCols';
import ItemDiffModal from './modal/itemDiffModal';
import { formatMsg } from '../message.i18n';

const { Option } = Select;


@injectIntl
@connect(
  state => ({
    loading: state.cmsTradeitem.workspaceLoading,
    repos: state.cmsTradeitem.repos.filter(rep =>
      rep.permission === CMS_TRADE_REPO_PERMISSION.edit),
  }),
  { delWorkspaceItem, resolveWorkspaceItem, toggleItemDiffModal }
)
export default class ConflictItemTable extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    withRepo: PropTypes.bool,
    loadConflictItems: PropTypes.func.isRequired,
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
    conflictSelRowKeys: [],
    allSel: false,
    conflictFilter: Object.assign({ status: 'conflict' }, this.props.listFilter),
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.listFilter !== this.props.listFilter && (
      nextProps.listFilter.repoId !== this.props.listFilter.repoId ||
      nextProps.listFilter.name !== this.props.listFilter.name ||
      nextProps.listFilter.taskId !== this.props.listFilter.taskId)
    ) {
      this.setState({
        conflictFilter: Object.assign(this.state.conflictFilter, nextProps.listFilter),
      });
    }
    if (nextProps.conflictList !== this.props.conflictList) {
      if (this.state.allSel) {
        this.setState({
          conflictSelRowKeys:
          nextProps.conflictList.data.filter(cl => cl.classified).map(cl => cl.id),
        });
      }
    }
  }
  msg = formatMsg(this.props.intl)
  conflictDataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadConflictItems(params),
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
      const newfilters = { ...this.state.conflictFilter, ...tblfilters[0] };
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: JSON.stringify(newfilters),
      };
      return params;
    },
    remotes: this.props.conflictList,
  })
  conflictColumns = makeColumns({
    msg: this.msg,
    withRepoItem: true,
    withRepo: this.props.withRepo,
  }).concat([{
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 160,
    fixed: 'right',
    render: (_, record) => {
      const standard = record.classified && record.status === 2;
      const staged = record.classified && record.status === 4;
      return (<span>
        <RowAction onClick={this.handleItemDiff} icon="swap" label={this.msg('diff')} row={record} />
        <PrivilegeCover module="clearance" feature="compliance" action="edit">
          <RowAction key="standard" action="standard" onClick={this.handleConflictResolve} icon="pushpin-o" row={record} tooltip="设为主数据" disabled={standard} />
          <RowAction key="stage" action="stage" onClick={this.handleConflictResolve} icon="fork" row={record} tooltip="保留为分支版本" disabled={staged} />
          <RowAction onClick={this.handleItemEdit} icon="edit" row={record} />
        </PrivilegeCover>
        <PrivilegeCover module="clearance" feature="compliance" action="delete">
          <RowAction confirm={this.msg('deleteConfirm')} onConfirm={this.handleItemDel} icon="delete" row={record} />
        </PrivilegeCover>
      </span>);
    },
  }])
  handleItemEdit = (record) => {
    const link = `/clearance/tradeitem/workspace/item/${record.id}`;
    this.context.router.push(link);
  }
  handleItemDel = (record) => {
    this.props.delWorkspaceItem([record.id]).then((result) => {
      if (!result.error) {
        this.props.loadConflictItems({
          pageSize: this.props.conflictList.pageSize,
          current: this.props.conflictList.current,
          filter: JSON.stringify(this.state.conflictFilter),
        });
      } else {
        notification.error({ message: 'Error', description: result.error.message });
      }
    });
  }
  handleItemDiff = (record) => {
    this.props.toggleItemDiffModal(true, {
      hscode: record.item_hscode,
      g_name: record.item_g_name,
      element: record.item_element,
      g_model: record.item_g_model,
    }, record);
  }
  handleConflictResolve = (item, index, props) => {
    this.props.resolveWorkspaceItem([item.id], props.action).then((result) => {
      if (!result.error) {
        this.props.loadConflictItems({
          pageSize: this.props.conflictList.pageSize,
          current: this.props.conflictList.current,
          filter: JSON.stringify(this.state.conflictFilter),
        });
      } else {
        notification.error({ message: 'Error', description: result.error.message });
      }
    });
  }
  handleBatchMakeStandard = () => {
    const itemIds = this.state.allSel ? null : this.state.conflictSelRowKeys;
    this.props.resolveWorkspaceItem(itemIds, 'standard').then((result) => {
      if (!result.error) {
        this.props.loadConflictItems({
          pageSize: this.props.conflictList.pageSize,
          current: this.props.conflictList.current,
          filter: JSON.stringify(this.state.conflictFilter),
        });
      } else {
        notification.error({ message: 'Error', description: result.error.message });
      }
    });
    this.handleRowDeselect();
  }
  handleBatchMakeStage = () => {
    const itemIds = this.state.allSel ? null : this.state.conflictSelRowKeys;
    this.props.resolveWorkspaceItem(itemIds, 'stage').then((result) => {
      if (!result.error) {
        this.props.loadConflictItems({
          pageSize: this.props.conflictList.pageSize,
          current: this.props.conflictList.current,
          filter: JSON.stringify(this.state.conflictFilter),
        });
      } else {
        notification.error({ message: 'Error', description: result.error.message });
      }
    });
    this.handleRowDeselect();
  }
  handleRepoSelect = (repoId) => {
    const filter = { ...this.state.conflictFilter, repoId };
    this.props.loadConflictItems({
      pageSize: this.props.conflictList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
    this.setState({ conflictFilter: filter });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.conflictFilter, name: value };
    this.props.loadConflictItems({
      pageSize: this.props.conflictList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
    this.setState({ conflictFilter: filter });
  }
  handleRowDeselect= () => {
    this.setState({ conflictSelRowKeys: [], allSel: false });
  }
  render() {
    const {
      loading, withRepo, repos, conflictList, cardView, scrollOffset,
    } = this.props;
    const { conflictSelRowKeys } = this.state;
    this.conflictDataSource.remotes = conflictList;
    const conflictSelRows = {
      selectedRowKeys: conflictSelRowKeys,
      onChange: (selectedRowKeys) => {
        let { allSel } = this.state;
        if (selectedRowKeys.length === 0) {
          allSel = false;
        }
        this.setState({ conflictSelRowKeys: selectedRowKeys, allSel });
      },
      getCheckboxProps: record => ({
        disabled: !record.classified,
      }),
      hideDefaultSelections: true,
      selections: [{
        key: 'selall',
        text: '全选',
        onSelect: (selRowKeys) => {
          this.setState({ conflictSelRowKeys: selRowKeys, allSel: true });
        },
      }, {
        key: 'unselall',
        text: '取消全选',
        onSelect: () => {
          this.setState({ conflictSelRowKeys: [], allSel: false });
        },
      }],
    };
    const toolbarActions = (<span>
      {withRepo && <Select
        showSearch
        placeholder={this.msg('ownRepo')}
        optionFilterProp="children"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        allowClear
        onChange={this.handleRepoSelect}
        suffixIcon={<Icon type="database" />}
      >
        {repos.map(rep => (<Option value={String(rep.id)} key={rep.owner_name}>
          <Tag>{this.msg(rep.mode)}</Tag>
          {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
        </Option>))}
      </Select>}
      <SearchBox value={this.state.conflictFilter.name} placeholder={this.msg('商品货号/HS编码/品名')} onSearch={this.handleSearch} />
    </span>);
    const bulkActions = (<PrivilegeCover module="clearance" feature="compliance" action="edit">
      <Button icon="pushpin-o" onClick={this.handleBatchMakeStandard}>批量设为标准值</Button>
      <Button icon="fork" onClick={this.handleBatchMakeStage}>批量保留为分支</Button>
    </PrivilegeCover>);
    return (
      <div>
        <DataTable
          selectedRowKeys={conflictSelRowKeys}
          onDeselectRows={this.handleRowDeselect}
          loading={loading}
          columns={this.conflictColumns}
          dataSource={this.conflictDataSource}
          rowSelection={conflictSelRows}
          rowKey="id"
          locale={{ emptyText: '当前没有冲突的商品归类' }}
          toolbarActions={toolbarActions}
          bulkActions={bulkActions}
          cardView={cardView}
          scrollOffset={scrollOffset}
        />
        <ItemDiffModal />
      </div>
    );
  }
}

