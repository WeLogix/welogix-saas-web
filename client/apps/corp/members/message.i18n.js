import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  members: {
    id: 'corp.members.member',
    defaultMessage: '成员',
  },
  allMembers: {
    id: 'corp.members.all',
    defaultMessage: '全部成员',
  },
  unassignedMembers: {
    id: 'corp.members.unassigned',
    defaultMessage: '未分配部门的成员',
  },
  disabledMembers: {
    id: 'corp.members.inactive',
    defaultMessage: '已停用的成员',
  },
  createMember: {
    id: 'corp.members.create.member',
    defaultMessage: '新建成员',
  },
  editMember: {
    id: 'corp.members.edit.member',
    defaultMessage: '编辑成员',
  },
  searchMember: {
    id: 'corp.members.search.member',
    defaultMessage: '搜索成员',
  },
  fullName: {
    id: 'corp.members.list.fullname',
    defaultMessage: '姓名',
  },
  username: {
    id: 'corp.members.list.username',
    defaultMessage: '用户名',
  },
  phone: {
    id: 'corp.members.phone',
    defaultMessage: '手机号',
  },
  email: {
    id: 'corp.members.email',
    defaultMessage: '电子邮件',
  },
  department: {
    id: 'corp.members.list.department',
    defaultMessage: '部门',
  },
  mainDepartment: {
    id: 'corp.members.list.main.department',
    defaultMessage: '主属部门',
  },
  subDepartment: {
    id: 'corp.members.list.sub.department',
    defaultMessage: '附属部门',
  },
  createDept: {
    id: 'corp.members.create.dept',
    defaultMessage: '新建部门',
  },
  editDept: {
    id: 'corp.members.edit.dept',
    defaultMessage: '编辑部门',
  },
  deleteDept: {
    id: 'corp.members.delete.dept',
    defaultMessage: '删除部门',
  },
  deptName: {
    id: 'corp.members.department.name',
    defaultMessage: '部门名称',
  },
  parentDept: {
    id: 'corp.members.parent.department',
    defaultMessage: '上级部门',
  },
  role: {
    id: 'corp.members.list.role',
    defaultMessage: '角色',
  },
  systemRole: {
    id: 'corp.members.list.role.system',
    defaultMessage: '预设角色',
  },
  customRole: {
    id: 'corp.members.list.role.custom',
    defaultMessage: '自定义角色',
  },
  status: {
    id: 'corp.members.list.status',
    defaultMessage: '状态',
  },
  accountNormal: {
    id: 'corp.members.normal',
    defaultMessage: '正常',
  },
  accountDisabled: {
    id: 'corp.members.disabled',
    defaultMessage: '停用',
  },
  accountEnabled: {
    id: 'corp.members.enabled',
    defaultMessage: '启用',
  },
  leaveDept: {
    id: 'corp.members.move.out',
    defaultMessage: '移出该部门',
  },
  incharge: {
    id: 'corp.members.incharge',
    defaultMessage: '设为负责人',
  },
  removeIncharge: {
    id: 'corp.members.remove.incharge',
    defaultMessage: '取消负责人',
  },
  tenantOwner: {
    id: 'corp.tenant.role.owner',
    defaultMessage: '系统管理员',
  },
  tenantManager: {
    id: 'corp.tenant.role.manager',
    defaultMessage: '企业管理人员',
  },
  tenantMember: {
    id: 'corp.tenant.role.member',
    defaultMessage: '普通成员',
  },
  tenantAnalyst: {
    id: 'corp.tenant.role.analyst',
    defaultMessage: '统计人员',
  },
  tenantBilling: {
    id: 'corp.tenant.role.billing',
    defaultMessage: '结算人员',
  },
  opCol: {
    id: 'corp.members.list.op.col',
    defaultMessage: '操作',
  },
  searchPlaceholder: {
    id: 'corp.members.list.searchPlaceholder',
    defaultMessage: '搜索姓名/手机号/邮箱',
  },
  affiliatedOrganizations: {
    id: 'corp.members.list.affiliated',
    defaultMessage: '所属组织',
  },
  addDeptMember: {
    id: 'corp.members.add.dept.member',
    defaultMessage: '添加到部门',
  },
  user: {
    id: 'corp.members.edit.user',
    defaultMessage: '用户',
  },
  fullNamePlaceholder: {
    id: 'corp.members.edit.fullname.placeholder',
    defaultMessage: '请输入真实姓名',
  },
  fullNameMessage: {
    id: 'corp.members.edit.fullname.message',
    defaultMessage: '2位以上中英文',
  },
  password: {
    id: 'corp.members.edit.password',
    defaultMessage: '登录密码',
  },
  passwordPlaceholder: {
    id: 'corp.members.edit.password.placeholder',
    defaultMessage: '首次登录时会提示更改密码',
  },
  passwordMessage: {
    id: 'corp.members.edit.password.message',
    defaultMessage: '至少6位字符',
  },
  phonePlaceholder: {
    id: 'corp.members.edit.phone.placeholder',
    defaultMessage: '可作登录帐号使用',
  },
  emailPlaceholder: {
    id: 'corp.members.edit.email.placeholder',
    defaultMessage: '绑定后可作登录帐号使用',
  },
  nonTenantEdit: {
    id: 'corp.members.edit.nonTenant',
    defaultMessage: '未选择所属租户,无法修改',
  },
  userSearchPlaceHolder: {
    id: 'corp.members.userSearchPlaceHolder',
    defaultMessage: '姓名/用户名/手机',
  },
  confirmDelDept: {
    id: 'corp.members.confirmDelDept',
    defaultMessage: '是否确认删除该部门',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
