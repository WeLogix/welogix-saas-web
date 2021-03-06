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
          notification.success({ message: '????????????', description: '???????????????????????????' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '??????', description: '?????????????????????????????????????????????' });
        }
      } else {
        let errorInfo = result.error.message;
        if (errorInfo.key === 'blbook-exist') {
          const errorProductNos = errorInfo.productNoList.slice(0, 100);
          errorInfo = `??????${errorProductNos.join(',')}??????????????????????????????????????????????????????`;
        }
        notification.error({ message: '??????', description: errorInfo });
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
          notification.success({ message: '????????????', description: '???????????????????????????' });
        } else if (result.data.feedback === 'noop') {
          notification.info({ message: '??????', description: '?????????????????????????????????????????????' });
        }
      } else {
        let errorInfo = result.error.message;
        if (errorInfo.key === 'blbook-exist') {
          const errorProductNos = errorInfo.productNoList.slice(0, 100);
          errorInfo = `??????${errorProductNos.join(',')}??????????????????????????????????????????????????????`;
        }
        notification.error({ message: '??????', description: errorInfo });
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
          <PageHeader title={this.msg('taskConflict')} tip={this.msg('??????????????????????????????????????????????????????????????????????????????????????????????????????')}>
            <PageHeader.Actions>
              <WsItemExportButton {...this.state.filter} onUploaded={this.handleReload} />
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                {conflictStat.master && <Button type="primary" loading={submitting} ghost icon="cloud-upload-o" onClick={this.handleMasterAudit}>????????????</Button>}
                <Button type="primary" icon="arrow-up" loading={submitting} onClick={this.handleLocalAudit}>????????????</Button>
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
