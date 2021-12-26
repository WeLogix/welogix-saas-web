import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Button, Form, Icon, Layout, Progress, Select, Tag, notification } from 'antd';
import { CMS_TRADE_REPO_PERMISSION, LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import UserAvatar from 'client/components/UserAvatar';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { loadWorkspaceTasks, delWorkspaceTask } from 'common/reducers/cmsTradeitem';
import { loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import connectNav from 'client/common/decorators/connect-nav';
import RowAction from 'client/components/RowAction';
import SidePanel from 'client/components/SidePanel';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ModuleMenu from '../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    repos: state.cmsTradeitem.repos.filter(rep =>
      rep.permission === CMS_TRADE_REPO_PERMISSION.edit),
    loading: state.cmsTradeitem.workspaceLoading,
    workspaceTaskList: state.cmsTradeitem.workspaceTaskList,
    adaptors: state.hubDataAdapter.modelAdaptors,
  }),
  { loadWorkspaceTasks, delWorkspaceTask, loadModelAdaptors }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmTradeItem',
})
export default class TradeItemTaskList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    comparisonImportPanel: {
      visible: false,
      endpoint: `${API_ROOTS.default}v1/cms/tradeitem/task/import/comparison`,
      repo_id: null,
    },
  }
  componentDidMount() {
    this.props.loadWorkspaceTasks();
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '任务ID',
    dataIndex: 'id',
    width: 80,
  }, {
    title: '适配器',
    dataIndex: 'adaptor_name',
    width: 100,
  }, {
    title: '新料数',
    dataIndex: 'emerge_count',
    width: 100,
    align: 'center',
    render: count => <Badge count={count} overflowCount={99999} style={{ backgroundColor: '#52c41a' }} />,
  }, {
    title: '冲突数',
    dataIndex: 'conflict_count',
    width: 100,
    align: 'center',
    render: count => <Badge count={count} overflowCount={99999} />,
  }, {
    title: '说明',
    dataIndex: 'title',
    width: 320,
  }, {
    title: '进度',
    dataIndex: 'tc_progress',
    width: 200,
    render: percent => <Progress percent={percent} size="small" />,
  }, {
    title: this.msg('repoOwner'),
    dataIndex: 'repo_owner_name',
    width: 200,
  }, {
    title: this.msg('createdBy'),
    dataIndex: 'created_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    render: crd => moment(crd).format('YYYY-MM-DD HH:mm'),
    width: 150,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 120,
    fixed: 'right',
    render: (_, record) => {
      if (record.tc_progress === 100) {
        return (
          <span>
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <RowAction onClick={this.handleRowClick} icon="form" label={this.msg('处理')} row={record} />
            </PrivilegeCover>
            <PrivilegeCover module="clearance" feature="compliance" action="delete">
              <RowAction onDelete={this.handleTaskDel} row={record} />
            </PrivilegeCover>
          </span>
        );
      }
      return <Icon type="loading" />;
    },
  }]
  handleRowClick = (record) => {
    const link = `/clearance/tradeitem/task/${record.id}`;
    this.context.router.push(link);
  }
  handleTaskDel = (record) => {
    this.props.delWorkspaceTask(record.id).then((result) => {
      if (!result.error) {
        this.props.loadWorkspaceTasks();
      } else {
        notification.error({
          title: '错误',
          description: result.error.message,
        });
      }
    });
  }
  handleRepoSelect = (repoId) => {
    this.props.loadWorkspaceTasks({ repoId });
  }
  handleCompareImportInit = () => {
    this.setState({
      comparisonImportPanel: { ...this.state.comparisonImportPanel, visible: true },
    });
  }
  handleCompareImptRepoSelect = (repoId) => {
    const repo = this.props.repos.filter(rep => rep.id === repoId)[0];
    if (repo) {
      this.setState({
        comparisonImportPanel: { ...this.state.comparisonImportPanel, repo_id: repoId },
      });
      this.props.loadModelAdaptors(
        repo.owner_partner_id,
        [LINE_FILE_ADAPTOR_MODELS.CMS_TRADEITEM.key]
      );
    }
  }
  handleCompareImportEnd = () => {
    this.setState({
      comparisonImportPanel: { ...this.state.comparisonImportPanel, visible: false, repo_id: null },
    });
  }
  handleCompareImportUploaded = () => {
    this.props.loadWorkspaceTasks();
    this.handleCompareImportEnd();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { loading, workspaceTaskList, repos } = this.props;
    const { comparisonImportPanel } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <Select
        showSearch
        optionFilterProp="children"
        placeholder="所属归类库"
        allowClear
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        onChange={this.handleRepoSelect}
        suffixIcon={<Icon type="database" />}
      >
        {repos.map(rep => (<Option value={rep.id} key={rep.owner_name}>
          <Tag>{this.msg(rep.mode)}</Tag>
          {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
        </Option>))}
      </Select>
    </span>);
    return (
      <Layout>
        <SidePanel width={200}>
          <ModuleMenu currentKey="taskList" />
        </SidePanel>
        <Layout>
          <PageHeader title={this.msg('taskList')}>
            <PageHeader.Actions>
              <PrivilegeCover module="clearance" feature="compliance" action="create">
                <Button type="primary" icon="upload" onClick={this.handleCompareImportInit}>{this.msg('newComparisonImport')}</Button>
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={toolbarActions}
              selectedRowKeys={this.state.selectedRowKeys}
              onDeselectRows={this.handleDeselectRows}
              loading={loading}
              columns={this.columns}
              dataSource={workspaceTaskList}
              pagination={{
                showTotal: total => `共 ${total} 条`,
                showSizeChanger: true,
                defaultPageSize: 20,
              }}
              rowSelection={rowSelection}
              rowKey="id"
            />
          </Content>
          <ImportDataPanel
            title="对比导入"
            customizeOverwrite
            visible={comparisonImportPanel.visible}
            endpoint={comparisonImportPanel.endpoint}
            adaptors={this.props.adaptors}
            formData={{ repo_id: comparisonImportPanel.repo_id }}
            onClose={this.handleCompareImportEnd}
            onUploaded={this.handleCompareImportUploaded}
            template={`${API_ROOTS.default}v1/cms/tradeitem/download/template/商品归类导入模板.xlsx`}
          >
            <Form.Item label={this.msg('ownRepo')}>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="请选定导入归类库"
                onChange={this.handleCompareImptRepoSelect}
                optionFilterProp="children"
              >
                {repos.map(rep =>
                  <Option value={rep.id} key={rep.owner_name}>{[rep.owner_code, rep.owner_name].filter(repp => repp).join(' | ')}</Option>)}
              </Select>
            </Form.Item>
          </ImportDataPanel>
        </Layout>
      </Layout>
    );
  }
}
