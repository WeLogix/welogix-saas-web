import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { notification, Button, Layout } from 'antd';
import PageHeader from 'client/components/PageHeader';
import SidePanel from 'client/components/SidePanel';
import connectNav from 'client/common/decorators/connect-nav';
import { loadWorkspaceItems, submitAudit } from 'common/reducers/cmsTradeitem';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import ModuleMenu from '../menu';
import WsItemExportButton from './exportButton';
import ConflictItemTable from './conflictItemTable';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    submitting: state.cmsTradeitem.submitting,
    workspaceItemList: state.cmsTradeitem.workspaceItemList,
    conflictStat: state.cmsTradeitem.workspaceStat.conflict,
  }),
  { loadWorkspaceItems, submitAudit }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmTradeItem',
})
export default class ConflictItemsList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    filter: { status: 'conflict' },
  }
  componentDidMount() {
    this.handleReload();
  }
  msg = formatMsg(this.props.intl)
  handleReload = () => {
    this.props.loadWorkspaceItems({
      pageSize: this.props.workspaceItemList.pageSize,
      current: this.props.workspaceItemList.current,
      filter: JSON.stringify(this.state.filter),
    });
  }
  handleLocalAudit = () => {
    this.props.submitAudit({ auditor: 'local', status: 'conflict' }).then((result) => {
      if (!result.error) {
        if (result.data.feedback === 'submmitted') {
          this.context.router.push('/clearance/tradeitem/workspace/pendings');
        } else if (result.data.feedback === 'reload') {
          const filter = { status: 'conflict' };
          this.props.loadWorkspaceItems({
            pageSize: this.props.workspaceItemList.pageSize,
            current: 1,
            filter: JSON.stringify(this.state.filter),
          });
          this.setState({ filter });
          notification.success({ message: '操作成功', description: '已提交至本库待审核' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '提示', description: '暂无已解决的归类冲突项目可提交' });
        }
      } else {
        let errorInfo = result.error.message;
        if (errorInfo.key === 'blbook-exist') {
          const errorProductNos = errorInfo.productNoList.slice(0, 100);
          errorInfo = `货号${errorProductNos.join(',')}对应账册存在可用项，提交前请禁用该项`;
        }
        notification.error({ message: '错误', description: errorInfo });
      }
    });
  }
  handleMasterAudit = () => {
    this.props.submitAudit({ auditor: 'master', status: 'conflict' }).then((result) => {
      if (!result.error) {
        if (result.data.feedback === 'reload') {
          const filter = { status: 'conflict' };
          this.props.loadWorkspaceItems({
            pageSize: this.props.workspaceItemList.pageSize,
            current: 1,
            filter: JSON.stringify(this.state.filter),
          });
          this.setState({ filter });
          notification.success({ message: '操作成功', description: '已提交至主库待审核' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '提示', description: '暂无已解决的归类冲突项目可提交' });
        }
      } else {
        let errorInfo = result.error.message;
        if (errorInfo.key === 'blbook-exist') {
          const errorProductNos = errorInfo.productNoList.slice(0, 100);
          errorInfo = `货号${errorProductNos.join(',')}对应账册存在可用项，提交前请禁用该项`;
        }
        notification.error({ message: '错误', description: errorInfo });
      }
    });
  }
  render() {
    const { workspaceItemList, conflictStat, submitting } = this.props;
    const { filter } = this.state;
    return (
      <Layout>
        <SidePanel width={200}>
          <ModuleMenu currentKey="conflict" />
        </SidePanel>
        <Layout>
          <PageHeader title={this.msg('taskConflict')} tip={this.msg('导入数据比对后发现商品编号、中文品名、规范申报要素任一存在差异的数据')}>
            <PageHeader.Actions>
              <WsItemExportButton {...this.state.filter} onUploaded={this.handleReload} />
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                {conflictStat.master && <Button type="primary" loading={submitting} ghost icon="cloud-upload-o" onClick={this.handleMasterAudit}>提交主库</Button>}
                <Button type="primary" icon="arrow-up" loading={submitting} onClick={this.handleLocalAudit}>整批提交</Button>
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <ConflictItemTable
              loadConflictItems={this.props.loadWorkspaceItems}
              conflictList={workspaceItemList}
              listFilter={filter}
              withRepo
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
