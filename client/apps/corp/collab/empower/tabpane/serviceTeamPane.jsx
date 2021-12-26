import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Divider, Tooltip, Tag, Button, Menu, Icon, Modal, message } from 'antd';
import { loadServiceTeamList, updateServiceTeam, toggleTeamUserModal, delServiceTeam } from 'common/reducers/saasCollab';
import EditableCell from 'client/components/EditableCell';
import RowAction from 'client/components/RowAction';
import DataTable from 'client/components/DataTable';
import { PARTNER_ROLES } from 'common/constants';
import TeamModal from '../modal/teamModal';
import { formatMsg } from '../../message.i18n';


@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  departments: state.account.departments,
  userDeptRel: state.account.userDeptRel,
  userMembers: state.account.userMembers,
  currentPartner: state.saasCollab.currentPartner,
  serviceTeams: state.saasCollab.serviceTeams,
  whetherReloadTeams: state.saasCollab.whetherReloadTeams,
}), {
  loadServiceTeamList,
  updateServiceTeam,
  toggleTeamUserModal,
  delServiceTeam,
})

export default class ServiceTeamPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherReloadTeams && !this.props.whetherReloadTeams) {
      const { role, id: partnerId, partner_tenant_id: partnerTenantId } = nextProps.currentPartner;
      const stCls = {};
      if (role === PARTNER_ROLES.CUS) {
        stCls.partnerId = partnerId;
      } else if (partnerTenantId !== -1) {
        stCls.partnerTenantId = partnerTenantId;
      }
      this.props.loadServiceTeamList(stCls);
    }
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('teamName'),
    dataIndex: 'team_name',
    width: 150,
    render: (val, row) => (<EditableCell
      field="team_name"
      value={val}
      onSave={name => this.handleUpdateTeamName(row, name)}
      disabled={this.props.tenantId !== row.created_tenant_id}
    />),
  }, {
    title: this.msg('teamUsers'),
    render: (val, row) => {
      const { tenantId, userMembers } = this.props;
      const ourStaff = [];
      const otherStaff = [];
      row.users.forEach((f) => {
        const teamUser = userMembers.find(h => h.login_id === f.lid);
        if (teamUser) {
          const newUser = {
            ...f,
            phone: teamUser.phone,
            name: teamUser.name,
          };
          if (f.tid === tenantId) {
            ourStaff.push(newUser);
          } else {
            otherStaff.push(newUser);
          }
        }
      });
      return [
        <div style={{ padding: 10, whiteSpace: 'normal' }}>
          <span>{this.msg('ourStaff')}:</span>
          {ourStaff.map((user) => {
            const { departments, userDeptRel } = this.props;
            const deptIds = userDeptRel.filter(f => f.login_id === user.lid)
              .map(f => f.dept_id);
            const relDepts = departments.filter(f => deptIds.includes(f.id)).map(f => f.name);
            return (<Tooltip
              title={[
                <div>所属部门:{relDepts.join(',')}</div>,
                <div>联系方式:{user.phone}</div>,
              ]}
              key={user.lid}
            >
              <Tag key={user.lid} style={{ margin: '0 5px' }}>{user.name}</Tag>
            </Tooltip>);
          })}
          <Button shape="circle" icon="plus" size="small" onClick={() => this.handleEditTeamUser(row)} />
        </div>,
        <Divider style={{ margin: 0 }} />,
        <div style={{ padding: 10 }}>
          <span>{this.msg('otherStaff')}:</span>
          {otherStaff.map(user => (<Tooltip
            title={<span>联系方式:{user.phone}</span>}
            key={user.lid}
          >
            <Tag key={user.lid} style={{ margin: '0 5px' }}>{user.name}</Tag>
          </Tooltip>))}
        </div>,
      ];
    },
  }, {
    title: this.msg('opCol'),
    width: 100,
    // fixed: 'right',
    render: (o, row) => (
      <RowAction
        overlay={<Menu onClick={({ key }) => this.handleRowMenuClick(key, row)}>
          <Menu.Item key="delete" disabled={this.props.tenantId !== row.created_tenant_id}>
            <a><Icon type="delete" />{this.msg('delete')}</a>
          </Menu.Item>
        </Menu>}
        row={row}
      />),
  }]
  handleRowMenuClick = (key, row) => {
    if (key === 'delete') {
      this.handleRemoveTeam(row);
    }
  }
  handleRemoveTeam = (row) => {
    if (row.team_id === row.owner_partner_id.toString()) {
      message.warn('默认团队不能删除', 3);
    } else {
      Modal.confirm({
        title: '确定删除服务团队?',
        onOk: () => this.props.delServiceTeam(row.team_id),
        onCancel: () => {},
      });
    }
  }
  handleUpdateTeamName = (row, name) => {
    this.props.updateServiceTeam(row.team_id, { team_name: name });
  }
  handleEditTeamUser = (row) => {
    const selectedLoginIds = row.users.filter(f => f.tid === this.props.tenantId)
      .map(f => f.lid);
    this.props.toggleTeamUserModal(true, row.team_id, selectedLoginIds);
  }
  render() {
    const { serviceTeams } = this.props;
    return [
      <DataTable size="middle" columns={this.columns} dataSource={serviceTeams} noSetting cardView={false} showToolbar={false} rowKey="id" />,
      <TeamModal />,
    ];
  }
}
