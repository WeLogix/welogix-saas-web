import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Icon, Layout, Popover, Select, Tag, Tooltip, notification } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SidePanel from 'client/components/SidePanel';
import { loadWorkspaceItems, submitAudit, toggleItemDiffModal } from 'common/reducers/cmsTradeitem';
import connectNav from 'client/common/decorators/connect-nav';
import { CMS_TRADE_REPO_PERMISSION } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import ModuleMenu from '../menu';
import ItemDiffModal from './modal/itemDiffModal';
import WsItemExportButton from './exportButton';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;


@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    tenantName: state.account.tenantName,
    loginId: state.account.loginId,
    loginName: state.account.username,
    repos: state.cmsTradeitem.repos.filter(rep =>
      rep.permission === CMS_TRADE_REPO_PERMISSION.edit),
    workspaceLoading: state.cmsTradeitem.workspaceLoading,
    workspaceItemList: state.cmsTradeitem.workspaceItemList,
    listFilter: state.cmsTradeitem.workspaceListFilter,
    invalidStat: state.cmsTradeitem.workspaceStat.invalid,
  }),
  { loadWorkspaceItems, submitAudit, toggleItemDiffModal }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmTradeItem',
})
export default class InvalidItemsList extends React.Component {
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
    this.handleReload(null, null, { status: 'invalid' });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('标记'),
    dataIndex: 'status',
    width: 45,
    align: 'center',
    fixed: 'left',
    render: (status, item) => {
      let tooltip = '';
      if (status === -1 || status === -2) {
        tooltip = '税则已删除商品编码';
      } else if (status === -3 || status === -4) {
        tooltip = '税则已变更申报要素';
      }
      let iconInfo = { type: 'disconnect', color: '#f5222d' };
      if (item.classified) {
        iconInfo = { type: 'link', color: '#52c41a' };
      }
      return (<Popover content={tooltip} placement="right">
        <Icon type={iconInfo.type} style={{ fontSize: 16, color: iconInfo.color }} />
      </Popover>);
    },
  }, {
    title: this.msg('repoOwner'),
    dataIndex: 'repo_owner_name',
    width: 200,
  }, {
    title: this.msg('copProductNo'),
    dataIndex: 'cop_product_no',
    width: 150,
    render: (o, record) => {
      const pn = o === record.src_product_no ? o :
      <Popover content={record.src_product_no}>{o}</Popover>;
      if (record.rejected) {
        let reason = '';
        if (record.reason) {
          reason = `: ${record.reason}`;
        }
        return (
          <Tooltip title={`审核拒绝${reason}`}>
            <Tag color="grey">{pn}</Tag>
          </Tooltip>);
      }
      return <span>{pn}</span>;
    },
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 200,
    render: (gname) => {
      if (!gname) {
        return <Tag color="red" />;
      }
      return gname;
    },
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
    width: 120,
    render: (hscode) => {
      if (!hscode) {
        return (
          <Tooltip title="错误的商品编码">
            <Tag color="red">{hscode}</Tag>
          </Tooltip>
        );
      }
      return <span>{hscode}</span>;
    },
  }, {
    title: this.msg('preHscode'),
    dataIndex: 'item_hscode',
    width: 120,
    render: (itemhscode, record) => (record.status === -1 || record.status === -2 ?
      <Tooltip title="最新税则已删除该税号"><Tag color="red"><span className="text-line-through">{itemhscode}</span></Tag></Tooltip> : <span>{itemhscode}</span>),
  }, {
    title: this.msg('gModel'),
    dataIndex: 'g_model',
    width: 400,
    render: (model) => {
      if (!model) {
        return <Tag color="red" />;
      }
      return model;
    },
  }, {
    title: this.msg('preGModel'),
    dataIndex: 'item_g_model',
    width: 400,
    render: (pregmodel, record) => (record.status === -3 || record.status === -4 ?
      <Tooltip title="最新税则已修改此税号的申报要素"><Tag color="red">{pregmodel}</Tag></Tooltip> : <span>{pregmodel}</span>),
  }, {
    title: this.msg('repoCreator'),
    dataIndex: 'contribute_tenant_name',
    width: 200,
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 140,
    fixed: 'right',
    render: (_, record) => (<span>
      <PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.handleItemEdit} icon="edit" label={this.msg('modify')} row={record} />
      </PrivilegeCover>
      <RowAction onClick={this.handleItemDiff} icon="swap" tooltip={this.msg('diff')} row={record} />
    </span>),
  }]
  handleItemEdit = (record) => {
    const link = `/clearance/tradeitem/workspace/item/${record.id}`;
    this.context.router.push(link);
  }
  handleItemDiff = (record) => {
    this.props.toggleItemDiffModal(true, {
      hscode: record.item_hscode,
      g_name: record.item_g_name,
      element: record.item_element,
      g_model: record.item_g_model,
    }, record);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, name: value };
    this.props.loadWorkspaceItems({
      pageSize: this.props.workspaceItemList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
  }
  handleRepoSelect = (repoId) => {
    const filter = { ...this.props.listFilter, repoId };
    this.props.loadWorkspaceItems({
      pageSize: this.props.workspaceItemList.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
  }
  handleReload = (pageSize, current, filter) => {
    let newfilter = this.props.listFilter;
    if (filter) {
      newfilter = { ...newfilter, ...filter };
    }
    this.props.loadWorkspaceItems({
      pageSize: pageSize || this.props.workspaceItemList.pageSize,
      current: current || this.props.workspaceItemList.current,
      filter: JSON.stringify(newfilter),
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleLocalAudit = () => {
    this.props.submitAudit({ auditor: 'local', status: 'invalid' }).then((result) => {
      if (!result.error) {
        if (result.data.feedback === 'submmitted') {
          this.context.router.push('/clearance/tradeitem/workspace/pendings');
        } else if (result.data.feedback === 'reload') {
          this.props.loadWorkspaceItems({
            pageSize: this.props.workspaceItemList.pageSize,
            current: 1,
            filter: JSON.stringify(this.props.listFilter),
          });
          notification.info({ message: '提示', description: '归类已提交审核' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '提示', description: '没有归类可提交审核' });
        }
      }
    });
  }
  handleMasterAudit = () => {
    this.props.submitAudit({ auditor: 'master', status: 'invalid' }).then((result) => {
      if (!result.error) {
        if (result.data.feedback === 'reload') {
          this.props.loadWorkspaceItems({
            pageSize: this.props.workspaceItemList.pageSize,
            current: 1,
            filter: JSON.stringify(this.props.listFilter),
          });
          notification.success({ message: '操作成功', description: '已提交至待审核' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '提示', description: '暂无已解决的失效归类项目可提交' });
        }
      }
    });
  }
  render() {
    const {
      workspaceLoading, workspaceItemList, repos, invalidStat, listFilter,
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
        const newfilters = { ...listFilter, ...tblfilters[0] };
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
        optionFilterProp="children"
        placeholder="所属归类库"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        onChange={this.handleRepoSelect}
        allowClear
        value={listFilter.repoId && String(listFilter.repoId)}
        suffixIcon={<Icon type="database" />}
      >
        {repos.map(rep =>
          (<Option value={String(rep.id)} key={rep.owner_name}>
            <Tag>{this.msg(rep.mode)}</Tag>
            {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
          </Option>))}
      </Select>
      <SearchBox value={this.props.listFilter.name} placeholder={this.msg('商品货号/HS编码/品名')} onSearch={this.handleSearch} />
    </span>);
    return (
      <Layout>
        <SidePanel width={200}>
          <ModuleMenu currentKey="invalid" />
        </SidePanel>
        <Layout>
          <PageHeader title={this.msg('taskInvalid')}>
            <PageHeader.Actions>
              <WsItemExportButton {...listFilter} onUploaded={this.handleReload} />
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                {invalidStat.master && <Button type="primary" icon="save" onClick={this.handleMasterAudit}>提交主库</Button>}
                <Button type="primary" icon="arrow-up" onClick={this.handleLocalAudit}>整批提交</Button>
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
              rowSelection={rowSelection}
              rowKey="id"
              loading={workspaceLoading}
              locale={{ emptyText: '当前没有失效的商品归类' }}
            />
          </Content>
          <ItemDiffModal />
        </Layout>
      </Layout>
    );
  }
}
