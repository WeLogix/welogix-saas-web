import React from 'react';
import PropTypes from 'prop-types';
import { TreeSelect, Tooltip, Icon, Select } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from '../message.i18n';
import './style.less';

const { Option } = Select;

@injectIntl
@connect(state => ({
  loginId: state.account.loginId,
  isManager: state.account.isManager,
  userMembers: state.account.userMembers,
  departments: state.account.departments,
  userDeptRel: state.account.userDeptRel,
}))
export default class MemberSelect extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    memberOnly: PropTypes.bool,
    departmentOnly: PropTypes.bool,
    selectMembers: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.string]),
    selectDepts: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.string]),
    maxTagCount: PropTypes.number,
    selectMode: PropTypes.oneOf(['multiple', 'single', undefined]),
  }
  static defaultProps = {
    maxTagCount: 1,
  }
  state = {
    type: 'user',
  }
  componentDidMount() {
    const { selectDepts, selectMembers } = this.props;
    if (selectDepts && selectDepts.length > 0) {
      this.setState({
        type: 'dept',
      });
    } else if (selectMembers && selectMembers.length > 0) {
      this.setState({
        type: 'user',
      });
    }
  }
  getDeptTreeData = () => {
    const {
      loginId, isManager, userDeptRel, departments,
    } = this.props;
    let depts = departments;
    if (!isManager) {
      const deptIds = userDeptRel.filter(f => f.login_id === loginId).map(f => f.dept_id);
      depts = departments.filter(f => deptIds.includes(f.id));
    }
    const treeData = [];
    for (let i = 0, len = depts.length; i < len; i++) {
      const dept = depts[i];
      const parentId = dept.parent_dept_id;
      const parentNode = depts.find(f => f.id === parentId);
      if (!parentNode) treeData.push({ key: dept.id, value: dept.id, title: dept.name });
    }
    let tempData = [...treeData];
    while (tempData.length > 0) {
      const dp = tempData.shift();
      const children = depts.filter(f => f.parent_dept_id === dp.key);
      if (children.length > 0) {
        const transChildren = children.map(f => ({ key: f.id, value: f.id, title: f.name }));
        dp.children = transChildren;
        tempData = tempData.concat(transChildren);
      }
    }
    return treeData;
  }
  getDeptUser = () => {
    const {
      isManager, loginId, userMembers, userDeptRel,
    } = this.props;
    if (!isManager) {
      // 查询所在部门下的所有成员
      const deptIds = userDeptRel.filter(f => f.login_id === loginId).map(f => f.dept_id);
      const userIds = userDeptRel.filter(f => deptIds.includes(f.dept_id)).map(f => f.user_id);
      const userData = userMembers.filter(f => userIds.includes(f.user_id));
      return userData;
    }
    return userMembers;
  }
  msg = formatMsg(this.props.intl)
  hanldeSwitchMode = (type) => {
    this.setState({ type });
  }
  handleMemberChange = (value) => {
    let ownBy = value;
    // 空数组转为undefined
    if (Array.isArray(value) && value.length === 0) {
      ownBy = undefined;
    }
    this.props.onMemberChange(ownBy);
  }
  render() {
    const {
      memberOnly, departmentOnly, selectMembers, selectDepts, style, maxTagCount, selectMode,
    } = this.props;
    let deptTreeData = [];
    let userData = [];
    if (this.state.type === 'dept') {
      deptTreeData = this.getDeptTreeData();
    } else if (this.state.type === 'user') {
      userData = this.getDeptUser();
    }
    return (
      <span className="select-combobox" style={style}>
        <Select
          style={{ width: 38, margin: 0 }}
          value={this.state.type}
          showArrow={false}
          disabled={memberOnly || departmentOnly}
          onChange={this.hanldeSwitchMode}
        >
          {!departmentOnly && <Option key="user"><Tooltip title={this.msg('member')} placement="left"><Icon type="team" /></Tooltip></Option>}
          {!memberOnly && <Option key="dept"><Tooltip title={this.msg('department')} placement="left"><LogixIcon type="icon-org" /></Tooltip></Option>}
        </Select>
        {this.state.type === 'user' ?
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="选择成员"
            maxTagCount={maxTagCount}
            mode={selectMode === 'single' ? '' : 'multiple'}
            onChange={this.handleMemberChange}
            disabled={this.props.memberDisabled}
            value={selectMembers || (selectMode === 'single' ? '' : [])}
            style={{ width: 'calc(100% - 38px)', margin: 0, marginLeft: -1 }}
          >
            {userData.map(f => <Option key={f.login_id}>{f.name}</Option>)}
          </Select>
          :
          <TreeSelect
            allowClear
            multiple
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="选择部门"
            treeDefaultExpandAll
            maxTagCount={1}
            treeData={deptTreeData}
            onChange={this.props.onDeptChange}
            value={selectDepts || []}
            style={{ width: 'calc(100% - 38px)', margin: 0, marginLeft: -1 }}
          />}
      </span>
    );
  }
}
