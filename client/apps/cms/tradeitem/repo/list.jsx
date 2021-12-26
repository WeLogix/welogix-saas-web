import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Switch, Button, Form, Icon, Menu, Modal, Layout, Select, Tag, Tooltip } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import {
  loadRepos, openAddModal, deleteRepo, switchRepoMode, switchRepoVersionKeep, showLinkSlaveModal,
  unlinkMasterSlave, toggleMatchRuleModal, toggleRepoAuditPanel,
} from 'common/reducers/cmsTradeitem';
import { loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import SidePanel from 'client/components/SidePanel';
import ImportDataPanel from 'client/components/ImportDataPanel';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { CMS_TRADE_REPO_MODE, CMS_TRADE_REPO_PERMISSION, LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import ModuleMenu from '../menu';
import AddRepoModal from './modal/addRepoModal';
import RepoUsersCard from './modal/repoUserCard';
import LinkSlaveModal from './modal/linkSlaveModal';
import MatchRuleModal from './modal/matchRuleModal';
import ExportRepoAuditPanel from './modal/exportRepoAuditPanel';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    isManager: state.account.isManager,
    repos: state.cmsTradeitem.repos,
    reposLoading: state.cmsTradeitem.reposLoading,
    adaptors: state.hubDataAdapter.modelAdaptors,
    privileges: state.account.privileges,
  }),
  {
    loadRepos,
    openAddModal,
    deleteRepo,
    switchRepoMode,
    switchRepoVersionKeep,
    showLinkSlaveModal,
    unlinkMasterSlave,
    toggleMatchRuleModal,
    toggleRepoAuditPanel,
    loadModelAdaptors,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmTradeItem',
})
export default class RepoList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    filter: { name: '' },
    authAction: { repo: {}, doing: false },
    comparisonImportPanel: {
      visible: false,
      endpoint: `${API_ROOTS.default}v1/cms/tradeitem/task/import/comparison`,
      repo_id: null,
    },
  }
  msg = formatMsg(this.props.intl);
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'compliance', action: 'edit',
  })
  deletePermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'compliance', action: 'delete',
  })
  repoColumns = [{
    title: this.msg('repoOwner'),
    dataIndex: 'owner_name',
    key: 'owner_name',
    width: 300,
    render: (o, repo) => [repo.owner_code, repo.owner_name].filter(f => f).join('|'),
  }, {
    title: this.msg('数据导入'),
    dataIndex: 'import_data',
    width: 100,
    align: 'center',
    render: (o, repo) => {
      const creator = repo.creator_tenant_id === this.props.tenantId;
      const menuItems = [];
      if (creator && this.editPermission) {
        menuItems.push(<Menu.Item key="matchRules">
          <a onClick={() =>
            this.props.toggleMatchRuleModal(true, { id: repo.id, match_rule: repo.match_rule })}
          ><Icon type="tool" /> 设置匹配规则</a>
        </Menu.Item>);
      }
      let menu;
      if (menuItems.length > 0) {
        menu = (<Menu>{menuItems}</Menu>);
      }
      return [
        <PrivilegeCover module="clearance" feature="compliance" action="edit">
          <RowAction icon="import" onClick={this.handleRepoImportData} row={repo} />
        </PrivilegeCover>,
        menu && <RowAction row={repo} overlay={menu} />,
      ];
    },
  }, {
    title: this.msg('归类统计'),
    dataIndex: 'classified_num',
    width: 120,
    render: (o, repo) => <RowAction icon="line-chart" label={o} onClick={this.handleRepoStats} row={repo} />,
  }, {
    title: this.msg('库模式'),
    dataIndex: 'mode',
    width: 150,
    align: 'center',
    render: (o, repo) => {
      const repoMode = Object.values(CMS_TRADE_REPO_MODE).filter(md => (md.key === o))[0];
      const creator = repo.creator_tenant_id === this.props.tenantId;
      const menuItems = [];
      let linkIcon;
      if (creator) {
        let masterSlaveLinked = false;
        if (repo.mode === CMS_TRADE_REPO_MODE.SLAVE.key && !repo.master_repo_id) {
          linkIcon = <Icon type="disconnect" />;
        } else if (repo.mode === CMS_TRADE_REPO_MODE.SLAVE.key && repo.master_repo_id) {
          masterSlaveLinked = true;
          linkIcon = <Icon type="link" />;
        } else if (repo.mode === CMS_TRADE_REPO_MODE.MASTER.key && repo.children) {
          masterSlaveLinked = true;
        }
        if (!masterSlaveLinked && this.editPermission) {
          menuItems.push(<Menu.Item key="reposwitch">
            <a onClick={() => this.handleRepoModeSwitch(repo)}><Icon type="swap" /> 切换库模式</a>
          </Menu.Item>);
        }
        if (repo.mode === CMS_TRADE_REPO_MODE.MASTER.key && this.editPermission) {
          menuItems.push(<Menu.Item key="addslave">
            <a onClick={() => this.handleLinkSlave(repo)}><Icon type="link" /> 关联从库</a>
          </Menu.Item>);
        }
      } else if (repo.owner_tenant_id === this.props.tenantId && this.deletePermission) {
        menuItems.push(<Menu.Item key="remslave">
          <a onClick={() => this.handleUnlinkSlave(repo.id)}><Icon type="disconnect" /> 删除关联</a>
        </Menu.Item>);
      }
      let menu;
      if (menuItems.length > 0) {
        menu = (<Menu>{menuItems}</Menu>);
      }
      return [
        <Tag color={repoMode.tag}>
          {repoMode.text} {linkIcon}
        </Tag>,
        menu && <RowAction row={repo} overlay={menu} />,
      ];
    },
  }, {
    title: <Tooltip title="选择启用时,保留HS编码或名称修改前历史归类版本,用于出库申报">{this.msg('历史版本')}</Tooltip>,
    dataIndex: 'keep_version',
    width: 100,
    align: 'center',
    render: (keep, repo) => {
      if (repo.permission === CMS_TRADE_REPO_PERMISSION.edit) {
        return (<Switch
          size="small"
          checked={keep}
          disabled={!!repo.master_repo_id || !this.editPermission}
          onChange={checked => this.handleVersionKeepChange(repo.id, checked)}
          checkedChildren="保留"
          unCheckedChildren="关闭"
        />);
      }
      return null;
    },
  }, {
    title: this.msg('使用权限'),
    dataIndex: 'permission',
    width: 150,
    align: 'center',
    render: (perm, repo) => {
      const creator = repo.creator_tenant_id === this.props.tenantId;
      const menuItems = [];
      if (creator && this.editPermission) {
        menuItems.push(<Menu.Item key="auth">
          <a onClick={() => this.handleRepoUserAuth(repo)}><Icon type="key" /> 授权使用单位</a>
        </Menu.Item>);
      }
      let menu;
      if (menuItems.length > 0) {
        menu = (<Menu>{menuItems}</Menu>);
      }
      let permTag = <Tag>只读</Tag>;
      if (perm === CMS_TRADE_REPO_PERMISSION.edit && this.editPermission) {
        permTag = repo.creator_tenant_id === this.props.tenantId ? (<Tag color="green">完全控制</Tag>) : (<Tag color="blue">可读写</Tag>);
      }
      return [
        permTag,
        menu && <RowAction row={repo} overlay={menu} />,
      ];
    },
  }, {
    title: this.msg('repoCreator'),
    dataIndex: 'creator_name',
    width: 200,
  }, {
    title: this.msg('最后更新时间'),
    dataIndex: 'last_modified_date',
    width: 150,
    render: (o, repo) => repo.last_modified_date && moment(repo.last_modified_date).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('创建日期'),
    dataIndex: 'created_date',
    width: 150,
    render: (o, repo) => repo.created_date && moment(repo.created_date).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (_, repo) => {
      const creator = repo.creator_tenant_id === this.props.tenantId;
      const menuItems = [];
      if (creator && this.props.isManager && this.deletePermission) {
        menuItems.push(<Menu.Item key="repodel">
          <a onClick={() => this.handleDeleteRepo(repo)}><Icon type="delete" /> 删除</a>
        </Menu.Item>);
      }
      let menu;
      if (menuItems.length > 0) {
        menu = (<Menu>{menuItems}</Menu>);
      }
      return (<span>
        <RowAction onClick={this.handleEnter} icon="folder" label={this.msg('manageData')} row={repo} />
        {menu && <RowAction overlay={menu} />}
      </span>);
    },
  },
  ];
  handleEnter = (repo) => {
    const link = `/clearance/tradeitem/repo/${repo.id}`;
    this.context.router.push(link);
  }
  handleRepoUserAuth = (authRepo) => {
    this.setState({ authAction: { doing: true, repo: authRepo } });
  }
  handleAuthAcOk = () => {
    this.setState({ authAction: { doing: false, repo: {} } });
  }
  handleRepoModeSwitch = (repo) => {
    const self = this;
    const targetMode = repo.mode === 'single' ? '主从库模式' : '独立库模式';
    Modal.confirm({
      title: `确定切换为【${targetMode}】?`,
      onOk() {
        self.props.switchRepoMode(repo.id);
      },
      onCancel() {
      },
    });
  }
  handleDeleteRepo = (repo) => {
    const self = this;
    Modal.confirm({
      title: `确定删除物料库【${repo.owner_name}】所有信息?`,
      onOk() {
        self.props.deleteRepo(repo.id).then((result) => {
          if (!result.error) {
            self.handleRepoReload();
          }
        });
      },
      okText: this.msg('delete'),
      okType: 'danger',
      onCancel() {
      },
    });
  }
  handleVersionKeepChange = (repoId, keep) => {
    this.props.switchRepoVersionKeep(repoId, keep);
  }
  handleAddRepo = () => {
    this.props.openAddModal();
  }
  handleLinkSlave = (masterRepo) => {
    this.props.showLinkSlaveModal({ masterRepo, visible: true });
  }
  handleUnlinkSlave = (slaveRepo) => {
    this.props.unlinkMasterSlave(slaveRepo).then((result) => {
      if (!result.error) {
        this.handleRepoReload();
      }
    });
  }
  handleRepoReload = () => {
    this.props.loadRepos();
  }
  handleRepoSearch = (ownerName) => {
    const filter = { ...this.state.filter, name: ownerName };
    this.setState({ filter });
  }
  handleTradeItemExport = () => {
    this.props.toggleRepoAuditPanel(true);
  }
  handleRepoImportData = (repo) => {
    this.setState({
      comparisonImportPanel: { ...this.state.comparisonImportPanel, visible: true },
    });
    this.handleCompareImptRepoSelect(repo.id);
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
  render() {
    const { reposLoading } = this.props;
    const { authAction, filter, comparisonImportPanel } = this.state;
    const repos = this.props.repos.filter(rep =>
      !filter.name || new RegExp(filter.name).test(rep.owner_name));
    const toolbarActions = <span><SearchBox value={filter.name} placeholder={this.msg('searchRepoPlaceholder')} onSearch={this.handleRepoSearch} /></span>;
    return (
      <Layout>
        <SidePanel width={200}>
          <ModuleMenu currentKey="repoList" />
        </SidePanel>
        <Layout>
          <PageHeader title={this.msg('repoList')}>
            <PageHeader.Actions>
              <Button icon="export" onClick={this.handleTradeItemExport}>
                {this.msg('exportRepoAudit')}
              </Button>
              <PrivilegeCover module="clearance" feature="compliance" action="create">
                <Button type="primary" icon="plus" onClick={this.handleAddRepo} >
                  {this.msg('addRepo')}
                </Button>
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={toolbarActions}
              dataSource={repos}
              pagination={{
                showTotal: total => `共 ${total} 条`,
                showSizeChanger: true,
                defaultPageSize: 20,
              }}
              columns={this.repoColumns}
              rowKey="id"
              loading={reposLoading}
            />
          </Content>
          <AddRepoModal />
          <Modal
            width={680}
            title="授权使用单位"
            visible={authAction.doing}
            maskClosable={false}
            onCancel={this.handleAuthAcOk}
          >
            <RepoUsersCard repo={authAction.repo} />
          </Modal>
          <LinkSlaveModal reload={this.handleRepoReload} />
          <MatchRuleModal />
          <ExportRepoAuditPanel />
          <ImportDataPanel
            title="对比导入"
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
