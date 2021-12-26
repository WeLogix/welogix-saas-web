import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Layout, List } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { loadRoles, switchEnable, toggleRoleModal, deleteRole } from 'common/reducers/role';
import { formatMsg } from './message.i18n';
import CorpSiderMenu from '../menu';
import RoleModal from './modal/roleModal';

const { Content } = Layout;

function fetchData({ state, dispatch }) {
  if (!state.role.loaded) {
    return dispatch(loadRoles({
      tenantId: state.account.tenantId,
      pageSize: state.role.list.pageSize,
      current: state.role.list.current,
    }));
  }
  return null;
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    rolelist: state.role.list,
    loading: state.role.loading,
    tenantId: state.account.tenantId,
  }),
  {
    loadRoles, switchEnable, toggleRoleModal, deleteRole,
  }
)
@connectNav({
  depth: 1,
  moduleName: 'corp',
})
@withPrivilege({ module: 'corp', feature: 'role' })
export default class RoleList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    rolelist: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      current: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
      data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        desc: PropTypes.string,
        status: PropTypes.number.isRequired,
      })),
    }).isRequired,
    switchEnable: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl);
  handleCreate = () => {
    this.props.toggleRoleModal(true);
  }
  handleEnable(role, index) {
    this.props.switchEnable(role, index, true);
  }
  handleDisable(role, index) {
    this.props.switchEnable(role, index, false);
  }
  handleConfig = (role) => {
    this.context.router.push(`/corp/role/edit/${role.id}`);
  }
  handleDelete = (id) => {
    this.props.deleteRole(id).then((result) => {
      if (!result.error) {
        this.props.loadRoles({
          tenantId: this.props.tenantId,
          pageSize: this.props.rolelist.pageSize,
          current: this.props.rolelist.current,
        });
      }
    });
  }
  render() {
    const { rolelist } = this.props;
    return (
      <Layout>
        <CorpSiderMenu currentKey="role" />
        <Layout>
          <PageHeader title={this.msg('corpRole')}>
            <PageHeader.Actions>
              <PrivilegeCover module="corp" feature="role" action="create">
                <Button type="primary" onClick={this.handleCreate} icon="plus-circle-o">
                  {this.msg('createRole')}
                </Button>
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <Card size="small">
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={rolelist.data}
                renderItem={role => (
                  <List.Item key={role.id}>
                    <Card
                      hoverable
                      className="list-item-card"
                    >
                      <RowAction onDelete={() => this.handleDelete(role.id)} row={role} />
                      <Card.Meta
                        title={role.name}
                        description={<Ellipsis lines={1}>{role.desc || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                        onClick={() => this.handleConfig(role)}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
            <RoleModal />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
