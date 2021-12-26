import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Table, Modal, Input, Button } from 'antd';
import { loadNonDepartmentMembers, saveDepartMember, toggleMemberModal } from 'common/reducers/personnel';
import { loadDeptAndMembers } from 'common/reducers/account';
import { formatMsg } from '../message.i18n';

const { Search } = Input;

@injectIntl
@connect(
  state => ({
    departments: state.personnel.departments,
    visible: state.personnel.memberModal.visible,
    deptId: state.personnel.memberFilters.dept_id,
  }),
  {
    loadNonDepartmentMembers, saveDepartMember, toggleMemberModal, loadDeptAndMembers,
  }
)
export default class AddMemberModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    deptId: PropTypes.oneOfType([PropTypes.oneOf([undefined]), PropTypes.number.isRequired]),
    loadNonDepartmentMembers: PropTypes.func.isRequired,
    saveDepartMember: PropTypes.func.isRequired,
    toggleMemberModal: PropTypes.func.isRequired,
  }
  state = {
    allMembers: [],
    members: [],
    searchValue: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible && nextProps.deptId !== undefined) {
      this.props.loadNonDepartmentMembers(nextProps.deptId).then((result) => {
        if (!result.error) {
          this.setState({ allMembers: result.data, members: result.data });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleMemberModal(false);
  }
  handleAddMember = (userId) => {
    this.props.saveDepartMember(this.props.deptId, userId).then((result) => {
      if (!result.error) {
        const members = this.state.members.filter(mem => mem.user_id !== userId);
        const allMembers = this.state.allMembers.filter(mem => mem.user_id !== userId);
        this.setState({ members, allMembers });
        this.props.loadDeptAndMembers();
      }
    });
  }
  handleSearchChange = (ev) => {
    this.setState({ searchValue: ev.target.value });
  }
  handleMemberSearch = (searched) => {
    if (searched) {
      const members = this.state.allMembers.filter(mem => mem.name.indexOf(searched) >= 0);
      this.setState({ members });
    } else {
      this.setState({ members: this.state.allMembers });
    }
  }
  columns = [{
    dataIndex: 'name',
    width: '90%',
  }, {
    width: '10%',
    render: (_, row) => <Button onClick={() => this.handleAddMember(row.user_id)}>添加</Button>,
  }]
  render() {
    const { members, searchValue } = this.state;
    const { visible } = this.props;
    return (
      <Modal maskClosable={false} visible={visible} title={this.msg('addDeptMember')} onCancel={this.handleCancel} footer={null} destroyOnClose>
        <Search
          placeholder={this.msg('searchMember')}
          onSearch={this.handleMemberSearch}
          value={searchValue}
          onChange={this.handleSearchChange}
          style={{ marginBottom: 8 }}
        />
        <Table
          size="small"
          dataSource={members}
          columns={this.columns}
          showHeader={false}
          scroll={{ y: 500 }}
          pagination={false}
          rowKey="user_id"
        />
      </Modal>
    );
  }
}
