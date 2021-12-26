import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Transfer } from 'antd';
import { addServiceTeamMembers, toggleTeamUserModal } from 'common/reducers/saasCollab';
import { formatMsg } from 'client/apps/scof/partner/message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.saasCollab.teamUserModal.visible,
    teamId: state.saasCollab.teamUserModal.teamId,
    selectedLoginIds: state.saasCollab.teamUserModal.selectedLoginIds,
    tenantUsers: state.account.userMembers.filter(f => f.tenant_id === state.account.tenantId),
  }),
  {
    toggleTeamUserModal, addServiceTeamMembers,
  }
)
export default class TeamModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    tenantUsers: PropTypes.arrayOf(PropTypes.shape({ user_id: PropTypes.number })),
    toggleTeamUserModal: PropTypes.func.isRequired,
    partner: PropTypes.shape({ id: PropTypes.number }).isRequired,
    selectedLoginIds: PropTypes.arrayOf(PropTypes.number),
  }
  state = {
    targetKeys: [],
    selectedKeys: [],
  }
  componentDidMount() {
    this.setState({ targetKeys: this.props.selectedLoginIds });
  }
  componentWillReceiveProps(nextProp) {
    if (nextProp.selectedLoginIds !== this.props.selectedLoginIds) {
      this.setState({ targetKeys: nextProp.selectedLoginIds });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleTeamUserModal(false);
  }
  handleAdd = () => {
    this.props.addServiceTeamMembers(this.props.teamId, this.state.targetKeys).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  filterOption = (inputValue, option) => {
    const reg = new RegExp(inputValue);
    return reg.test(option.name);
  }
  handleChange = (keys) => {
    this.setState({ targetKeys: keys });
  }
  handleSelectChange = (sourceselectedUserIds, targetselectedUserIds) => {
    this.setState({ selectedKeys: [...targetselectedUserIds, ...sourceselectedUserIds] });
  }
  render() {
    const { visible, tenantUsers } = this.props;
    const { targetKeys, selectedKeys } = this.state;
    return (
      <Modal maskClosable={false} visible={visible} title={this.msg('addToServiceTeam')} onCancel={this.handleCancel} onOk={this.handleAdd} width={600}>
        <Transfer
          dataSource={tenantUsers}
          titles={[this.msg('allMembers'), this.msg('serviceTeam')]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          filterOption={this.filterOption}
          render={item => (<span>
            <div style={{ width: '45%', display: 'inline-block' }}>{item.name}</div>
          </span>)}
          rowKey={item => item.login_id}
          showSearch
          listStyle={{ height: 400, width: 240 }}
        />
      </Modal>
    );
  }
}
