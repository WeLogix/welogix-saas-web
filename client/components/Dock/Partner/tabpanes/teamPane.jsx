import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Divider, Tooltip, Tag } from 'antd';
import { loadServiceTeamList } from 'common/reducers/saasCollab';
import DataTable from 'client/components/DataTable';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from 'client/apps/scof/partner/message.i18n';

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    departments: state.account.departments,
    userDeptRel: state.account.userDeptRel,
    userMembers: state.account.userMembers,
    serviceTeams: state.saasCollab.serviceTeams,
  }),
  { loadServiceTeamList },
)
export default class TeamPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    const { role, id: partnerId, partner_tenant_id: partnerTenantId } = this.props.partner;
    this.handleServiceTeamLoad(role, partnerId, partnerTenantId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.partner.id && this.props.partner.id !== nextProps.partner.id) {
      const { role, id: partnerId, partnerTenantId } = nextProps.partner;
      this.handleServiceTeamLoad(role, partnerId, partnerTenantId);
    }
  }
  handleServiceTeamLoad = (role, partnerId, partnerTenantId) => {
    const stCls = {};
    if (role === PARTNER_ROLES.CUS) {
      stCls.partnerId = partnerId;
    } else if (partnerTenantId !== -1) {
      stCls.partnerTenantId = partnerTenantId;
    }
    this.props.loadServiceTeamList(stCls);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('teamName'),
    dataIndex: 'team_name',
    width: 100,
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
            const deptIds = userDeptRel.filter(f => f.login_id === user.login_id)
              .map(f => f.dept_id);
            const relDepts = departments.filter(f => deptIds.includes(f.id)).map(f => f.name);
            return (<Tooltip
              title={[
                <div>所属部门:{relDepts.join(',')}</div>,
                <div>联系方式:{user.phone}</div>,
              ]}
              key={row.id}
            >
              <Tag key={user.lid} style={{ margin: '0 5px' }}>{user.name}</Tag>
            </Tooltip>);
          })}
        </div>,
        <Divider style={{ margin: 0 }} />,
        <div style={{ padding: 10 }}>
          <span>{this.msg('otherStaff')}:</span>
          {otherStaff.map(user => (<Tooltip
            title={<span>联系方式:{user.phone}</span>}
            key={row.id}
          >
            <Tag key={user.lid} style={{ margin: '0 5px' }}>{user.name}</Tag>
          </Tooltip>))}
        </div>,
      ];
    },
  }]
  render() {
    const { serviceTeams } = this.props;
    return (
      <div className="pane-content tab-pane">
        <DataTable size="middle" columns={this.columns} dataSource={serviceTeams} noSetting showToolbar={false} rowKey="id" />
      </div>
    );
  }
}
