import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Card, Dropdown, Icon, Layout, Menu, message, Modal, Tree } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import {
  loadMembers, loadDepartments, delMember, createDepartment, switchStatus, toggleMemberModal,
  toggleUserModal, removeDepartmentMember, toggleDepartmentModal, delDepartment,
  setUserToChargeDept,
} from 'common/reducers/personnel';
import { loadDeptAndMembers } from 'common/reducers/account';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import SidePanel from 'client/components/SidePanel';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { resolveCurrentPageNumber } from 'client/util/react-ant';
import { ACCOUNT_STATUS, PRESET_TENANT_ROLE, PRESET_ROLE_NAME_KEYS } from 'common/constants';
import CorpSiderMenu from '../menu';
import AddMemberModal from './modal/addMemberModal';
import AddUser from './modal/addUserModal';
import EditDepartmentModal from './modal/editDepartmentModal';
import { getDeptTreeData } from './memberDeptUtil';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    personnelist: state.personnel.memberlist,
    filters: state.personnel.memberFilters,
    departments: state.personnel.departments,
    loading: state.personnel.loading,
    whetherLoadMembers: state.personnel.whetherLoadMembers,
    whetherLoadDepts: state.personnel.whetherLoadDepts,
    users: state.account.userMembers,
  }),
  {
    delMember,
    switchStatus,
    loadDepartments,
    createDepartment,
    loadMembers,
    toggleMemberModal,
    toggleUserModal,
    removeDepartmentMember,
    toggleDepartmentModal,
    delDepartment,
    setUserToChargeDept,
    loadDeptAndMembers,
  }
)
@withPrivilege({ module: 'corp', feature: 'member' })
export default class MemberDepartmentView extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    personnelist: PropTypes.shape({ totalCount: PropTypes.number.isRequired }).isRequired,
    filters: PropTypes.shape({ dept_id: PropTypes.number, name: PropTypes.string }).isRequired,
    departments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    loadMembers: PropTypes.func.isRequired,
    switchStatus: PropTypes.func.isRequired,
    delMember: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    selectedHeadKeys: ['all'],
  }
  componentDidMount() {
    this.handleLoadMembers();
    this.props.loadDepartments();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherLoadMembers && !this.props.whetherLoadMembers) {
      this.handleLoadMembers();
    }
    if (nextProps.whetherLoadDepts && !this.props.whetherLoadDepts) {
      this.props.loadDepartments();
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('fullName'),
    dataIndex: 'name',
    width: 100,
    sorter: true,
    render: (o, record) => this.renderColumnText(record.status, record.name),
  }, {
    title: this.msg('username'),
    width: 150,
    render: (o, record) => this.renderColumnText(
      record.status,
      record.username && record.username.split('@')[0]
    ),
  }, {
    title: this.msg('mainDepartment'),
    dataIndex: 'main_dept',
    width: 200,
    render: (o, record) => {
      const dept = this.props.departments.find(f => f.id === o);
      const deptName = dept && dept.name;
      const text = this.renderColumnText(record.status, deptName);
      return text;
    },
  }, {
    title: this.msg('subDepartment'),
    dataIndex: 'sub_dept',
    width: 200,
    render: (o, record) => {
      if (!o) return null;
      const deptIds = o.split(',').map(f => Number(f));
      const deptNames = [];
      this.props.departments.forEach(f => deptIds.includes(f.id) && deptNames.push(f.name));
      const text = this.renderColumnText(record.status, deptNames.join(','));
      return text;
    },
  }, {
    title: this.msg('role'),
    sorter: true,
    dataIndex: 'role_name',
    width: 200,
    render: (role, record) => this.renderColumnText(
      record.status,
      PRESET_ROLE_NAME_KEYS[role] ?
        this.msg(PRESET_ROLE_NAME_KEYS[role].text)
        : role,
    ),
  }, {
    title: this.msg('status'),
    dataIndex: 'status',
    width: 80,
    render: (o, record) => {
      let style = { color: '#51C23A' };
      let acStText = ACCOUNT_STATUS.normal.text;
      if (record.status === ACCOUNT_STATUS.blocked.id) {
        style = { color: '#CCC' };
        acStText = ACCOUNT_STATUS.blocked.text;
      }
      return <span style={style}>{this.msg(acStText)}</span>;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    key: 'OP_COL',
    width: 100,
    fixed: 'right',
    render: (text, record, index) => {
      if (record.role === PRESET_TENANT_ROLE.owner.name) {
        return (
          <PrivilegeCover module="corp" feature="member" action="edit">
            <RowAction icon="edit" tooltip={this.msg('modify')} onClick={() => this.toggleUserModal(record.key)} />
          </PrivilegeCover>
        );
      } else if (record.status === ACCOUNT_STATUS.normal.id) {
        let deptAction = null;
        if (this.props.filters.dept_id) {
          const userDepts = [record.main_dept].concat(record.sub_dept && record.sub_dept.split(','))
            .filter(dpt => dpt).map(dpt => Number(dpt));
          if (userDepts.find(usdp => usdp === this.props.filters.dept_id)) {
            const department = this.props.departments.find(f => f.id ===
              this.props.filters.dept_id);
            const inchargeBy = department && department.incharge_by;
            const rowMenus = [(
              <Menu.Item key="leaveDept">
                <a><Icon type="logout" /> {this.msg('leaveDept')}</a>
              </Menu.Item>
            )];
            if (record.login_id === inchargeBy) {
              rowMenus.unshift(<Menu.Item key="removeIncharge">
                <a><Icon type="close-square" /> {this.msg('removeIncharge')}</a>
              </Menu.Item>);
            } else if (!inchargeBy) {
              rowMenus.unshift(<Menu.Item key="incharge">
                <a><Icon type="crown" /> {this.msg('incharge')}</a>
              </Menu.Item>);
            }
            deptAction = (<RowAction
              overlay={<Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                {rowMenus}
              </Menu>}
              row={record}
            />);
          }
        }
        return (
          <PrivilegeCover module="corp" feature="member" action="edit">
            <RowAction icon="edit" tooltip={this.msg('modify')} onClick={() => this.toggleUserModal(record.key)} />
            <RowAction icon="pause-circle-o" tooltip={this.msg('accountDisabled')} onClick={() => this.handleStatusSwitch(record, index)} />
            {deptAction}
          </PrivilegeCover>
        );
      } else if (record.status === ACCOUNT_STATUS.blocked.id) {
        return (
          <span>
            <PrivilegeCover module="corp" feature="member" action="edit">
              <RowAction icon="play-circle-o" tooltip={this.msg('accountEnabled')} onClick={() => this.handleStatusSwitch(record, index)} />
            </PrivilegeCover>
            <PrivilegeCover module="corp" feature="member" action="delete">
              <RowAction danger icon="delete" tooltip={this.msg('delete')} confirm="确认删除？" onConfirm={() => this.handlePersonnelDel(record)} />
            </PrivilegeCover>
          </span>
        );
      }
      return <span />;
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadMembers(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      // 删除完一页时返回上一页
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        filters: { ...this.props.filters },
      };
      Object.keys(filters).forEach((key) => { params.filters[key] = filters[key][0]; }); // eslint-disable-line
      params.filters = JSON.stringify(params.filters);
      return params;
    },
  })
  rowSelection = {
    selectedRowKeys: this.state.selectedRowKeys,
    onChange: (selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    },
  }
  handleLoadMembers = (paramPage, paramSize, paramFilter) => {
    const { personnelist: { pageSize, current }, filters } = this.props;
    const currPage = paramPage || current;
    const currSize = paramSize || pageSize;
    const currFilter = paramFilter || filters;
    this.props.loadMembers({
      pageSize: currSize,
      current: currPage,
      filters: JSON.stringify(currFilter),
    });
  }
  handleSelectionClear = () => {
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleNavigationTo(to, query) {
    this.context.router.push({ pathname: to, query });
  }
  handleStatusSwitch(personnel, index) {
    this.props.switchStatus(index, personnel.key, personnel.status === ACCOUNT_STATUS.normal.id
      ? ACCOUNT_STATUS.blocked.id : ACCOUNT_STATUS.normal.id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handlePersonnelDel(record) {
    const { personnelist: { totalCount, current, pageSize } } = this.props;
    this.props.delMember(record.key, record.login_id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        const currPage = resolveCurrentPageNumber(totalCount - 1, current, pageSize);
        this.handleLoadMembers(currPage, null, null);
      }
    });
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.filters, name: searchVal };
    this.handleLoadMembers(1, null, filters);
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'leaveDept') {
      this.handleRemoveFromDept(record);
    } else if (key === 'incharge') {
      this.handleInChargeDept(record);
    } else if (key === 'removeIncharge') {
      this.handleInChargeDept();
    }
  }
  handleDeptsMenuClick = ({ key }) => {
    this.setState({ selectedHeadKeys: [key] });
    const filters = { ...this.props.filters, dept_id: null, status: key };
    this.handleLoadMembers(1, null, filters);
  }
  handleDeptsTreeClick = ([key]) => {
    this.setState({ selectedHeadKeys: [key] });
    const filters = { ...this.props.filters, dept_id: Number(key), status: null };
    this.handleLoadMembers(1, null, filters);
  }
  handleMemberDeptMoreClick = (ev, dept) => {
    if (ev.key === 'edit') {
      this.props.toggleDepartmentModal(true, {
        id: dept.id,
        name: dept.name,
        parent_id: dept.parent_dept_id || -1,
      });
    } else if (ev.key === 'delete') {
      Modal.confirm({
        title: this.msg('confirmDelDept'),
        okText: this.msg('ok'),
        cancelText: this.msg('cancel'),
        onOk: () => {
          this.props.delDepartment(dept.id).then((result) => {
            if (!result.error) {
              this.props.loadDeptAndMembers();
            }
          });
        },
      });
    }
  }
  handleAddDepartMember = () => {
    this.props.toggleMemberModal(true);
  }
  toggleUserModal = (key) => {
    this.props.toggleUserModal(true, key);
  }
  handleRemoveFromDept = (user) => {
    const deptId = parseFloat(this.props.filters.dept_id);
    this.props.removeDepartmentMember(user.key, deptId);
    this.props.loadDeptAndMembers();
  }
  handleInChargeDept = (user) => {
    const deptId = parseFloat(this.props.filters.dept_id);
    const loginId = user ? user.login_id : null; // 不传值则为取消负责人
    this.props.setUserToChargeDept(loginId, deptId);
    this.props.loadDeptAndMembers();
  }
  renderColumnText = (status, text) => {
    let style = {};
    if (status === ACCOUNT_STATUS.blocked.id) {
      style = { color: '#CCC' };
    }
    return <span style={style}>{text}</span>;
  }
  render() {
    const {
      personnelist, departments, filters, loading,
    } = this.props;
    const deptTreeData = getDeptTreeData(departments);
    this.dataSource.remotes = personnelist;
    let contentHeadAction;
    let toolbarExtra;
    if (filters.dept_id) {
      const department = departments.find(f => f.id === filters.dept_id) || {};
      const user = this.props.users.find(f => f.login_id === department.incharge_by) || {};
      contentHeadAction = (
        <div>
          <h3>{department.name}</h3>
          <div style={{ display: 'inline-block', lineHeight: '32px', marginTop: 10 }}>负责人: {user.name || '暂未设置'}</div>
        </div>
      );
      toolbarExtra = (
        <PrivilegeCover module="corp" feature="member" action="create"><span>
          {/*         <Button onClick={this.handleAddDepartMember} icon="user-add">
            {this.msg('addDeptMember')}
          </Button>
      */}
          <Dropdown overlay={<Menu onClick={ev => this.handleMemberDeptMoreClick(ev, department)} placement="bottomLeft">
            <Menu.Item key="edit"><Icon type="edit" /> {this.msg('editDept')}</Menu.Item>
            <Menu.Item key="delete"><Icon type="delete" /> {this.msg('deleteDept')}</Menu.Item>
          </Menu>}
          >
            <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
          </Dropdown></span>
        </PrivilegeCover>);
    } else {
      let title = this.msg('allMembers');
      if (filters.status === 'unassigned') title = this.msg('unassignedMembers');
      if (filters.status === 'disabled') title = this.msg('disabledMembers');
      contentHeadAction = (
        <h3>{title}</h3>);
      toolbarExtra = (
        <PrivilegeCover module="corp" feature="member" action="create">
          <Button type="primary" onClick={() => this.toggleUserModal()} icon="plus-circle-o">
            {this.msg('createMember')}
          </Button>
        </PrivilegeCover>
      );
    }
    return (
      <Layout>
        <CorpSiderMenu currentKey="members" />
        <Layout>
          <PageHeader title={this.msg('corpDeptMember')} />
          <Layout>
            <SidePanel width={200}>
              <div className="nav-sider-head">
                <SearchBox
                  value={filters.name}
                  onSearch={this.handleSearch}
                  placeholder={this.msg('userSearchPlaceHolder')}
                />
              </div>
              <Menu
                selectedKeys={this.state.selectedHeadKeys}
                mode="inline"
                onClick={this.handleDeptsMenuClick}
                style={{ marginBottom: 0 }}
              >
                <Menu.ItemGroup key="members" title={this.msg('members')}>
                  <Menu.Item key="all"><Icon type="team" />{this.msg('allMembers')}</Menu.Item>
                  <Menu.Item key="unassigned"><Icon type="question-circle" />{this.msg('unassignedMembers')}</Menu.Item>
                  <Menu.Item key="disabled"><Icon type="stop" />{this.msg('disabledMembers')}</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="depts" title={this.msg('department')} />
              </Menu>
              <PrivilegeCover module="corp" feature="member" action="create">
                <RowAction
                  icon="plus-circle"
                  label={this.msg('createDept')}
                  onClick={() => this.props.toggleDepartmentModal(true)}
                  style={{ marginBottom: 8 }}
                />
              </PrivilegeCover>
              <Tree
                blockNode
                defaultExpandedKeys={['deptTree']}
                selectedKeys={this.state.selectedHeadKeys}
                onSelect={this.handleDeptsTreeClick}
                treeData={deptTreeData}
              />
            </SidePanel>
            <Content className="page-content" key="main">
              <Card bodyStyle={{ padding: 0 }}>
                <DataTable
                  cardView={false}
                  toolbarActions={contentHeadAction}
                  toolbarExtra={toolbarExtra}
                  rowSelection={this.rowSelection}
                  columns={this.columns}
                  loading={loading}
                  dataSource={this.dataSource}
                  scrollOffset={292}
                  noSetting
                />
              </Card>
            </Content>
          </Layout>
          <AddMemberModal />
          <AddUser />
          <EditDepartmentModal />
        </Layout>
      </Layout>
    );
  }
}
