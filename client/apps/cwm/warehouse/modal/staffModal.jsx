import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Transfer } from 'antd';
import { hideStaffModal, addStaff, loadStaffs } from 'common/reducers/cwmWarehouse';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.cwmWarehouse.staffModal.visible,
    loginId: state.account.loginId,
    tenantUsers: state.account.userMembers.filter(f => f.tenant_id === state.account.tenantId),
  }),
  {
    hideStaffModal, addStaff, loadStaffs,
  }
)

export default class ServiceTeamModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    tenantUsers: PropTypes.arrayOf(PropTypes.shape({
      user_id: PropTypes.number,
      name: PropTypes.string,
    })),
    selectedUserIds: PropTypes.arrayOf(PropTypes.number),
  }
  state = {
    targetKeys: [],
    selectedKeys: [],
  }
  componentWillMount() {
    const { selectedUserIds } = this.props;
    this.setState({
      targetKeys: selectedUserIds,
    });
  }
  componentWillReceiveProps(nextProp) {
    const { selectedUserIds } = nextProp;
    if (selectedUserIds !== this.props.selectedUserIds) {
      this.setState({
        targetKeys: selectedUserIds,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideStaffModal();
  }
  filterOption = (inputValue, option) => {
    const reg = new RegExp(inputValue);
    return reg.test(option.name);
  }
  handleChange = (keys) => {
    this.setState({ targetKeys: keys });
  }
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...targetSelectedKeys, ...sourceSelectedKeys] });
  }
  handleAdd = () => {
    const { whseCode, loginId, tenantUsers } = this.props;
    const { targetKeys } = this.state;
    const staffs = tenantUsers.filter(user => targetKeys.find(key => key === user.user_id));
    this.props.addStaff(whseCode, staffs, loginId).then((result) => {
      if (!result.error) {
        this.props.hideStaffModal();
        this.props.loadStaffs(whseCode);
      }
    });
  }
  render() {
    const { visible, tenantUsers } = this.props;
    const { targetKeys, selectedKeys } = this.state;
    return (
      <Modal maskClosable={false} visible={visible} title="添加员工" onCancel={this.handleCancel} onOk={this.handleAdd} width={640}>
        <Transfer
          dataSource={tenantUsers}
          titles={['所有成员', '添加员工']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          filterOption={this.filterOption}
          render={item => (<span>
            <div style={{ width: '45%', display: 'inline-block' }}>{item.name}</div>
          </span>)}
          rowKey={item => item.user_id}
          showSearch
          listStyle={{
            width: 260,
            height: 400,
          }}
        />
      </Modal>
    );
  }
}
