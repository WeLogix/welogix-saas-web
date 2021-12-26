import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { appendFormAcitonTypes, formReducer, isFormDataLoadedC, loadFormC, assignFormC, clearFormC } from './form-common';

const actionTypes = createActionTypes('@@welogix/personnel/', [
  'LOAD_DEPARTMENTS', 'LOAD_DEPARTMENTS_SUCCEED', 'LOAD_DEPARTMENTS_FAIL',
  'CREATE_DEPT', 'CREATE_DEPT_SUCCEED', 'CREATE_DEPT_FAIL',
  'UPDATE_DEPT', 'UPDATE_DEPT_SUCCEED', 'UPDATE_DEPT_FAIL',
  'DELETE_DEPT', 'DELETE_DEPT_SUCCEED', 'DELETE_DEPT_FAIL',
  'SWITCH_STATUS', 'SWITCH_STATUS_SUCCEED', 'SWITCH_STATUS_FAIL',
  'SUBMIT_MEMBER', 'SUBMIT_MEMBER_SUCCEED', 'SUBMIT_MEMBER_FAIL',
  'DEL_MEMBER', 'DEL_MEMBER_SUCCEED', 'DEL_MEMBER_FAIL',
  'EDIT_MEMBER', 'EDIT_MEMBER_SUCCEED', 'EDIT_MEMBER_FAIL',
  'GET_MEMBER', 'GET_MEMBER_SUCCEED', 'GET_MEMBER_FAIL',
  'LOAD_MEMBERS', 'LOAD_MEMBERS_SUCCEED', 'LOAD_MEMBERS_FAIL',
  'LOAD_ROLES', 'LOAD_ROLES_SUCCEED', 'LOAD_ROLES_FAIL',
  'SAVE_DEPM', 'SAVE_DEPM_SUCCEED', 'SAVE_DEPM_FAIL',
  'LOAD_NONDEPTM', 'LOAD_NONDEPTM_SUCCEED', 'LOAD_NONDEPTM_FAIL',
  'TOGGLE_USER_MODAL', 'TOGGLE_MEMBER_MODAL',
  'LOAD_DEPARTMENT_MEMBERS', 'LOAD_DEPARTMENT_MEMBERS_SUCCEED', 'LOAD_DEPARTMENT_MEMBERS_FAIL',
  'REMOVE_DEPM', 'REMOVE_DEPM_SUCCEED', 'REMOVE_DEPM_FAIL', 'TOGGLE_DEPARTMENT_MODAL',
  'SETTOHEAD_DEPM', 'SETTOHEAD_DEPM_SUCCEED', 'SETTOHEAD_DEPM_FAIL',
]);
appendFormAcitonTypes('@@welogix/personnel/', actionTypes);

const initialState = {
  loading: false,
  submitting: false,
  selectedIndex: -1,
  departments: [],
  formData: {
    key: -1,
  },
  memberlist: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  memberFilters: {
    dept_id: undefined,
  },
  memberModal: {
    visible: false,
  },
  departmentMembers: [],
  roles: [],
  userModal: {
    visible: false,
    pid: '',
  },
  departmentModal: {
    visible: false,
    data: {},
  },
  whetherLoadMembers: false,
  whetherLoadDepts: false,
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_MEMBERS:
      return { ...state, loading: true, memberFilters: JSON.parse(action.params.filters) };
    case actionTypes.LOAD_MEMBERS_SUCCEED:
      return {
        ...state, loading: false, memberlist: action.result.data, whetherLoadMembers: false,
      };
    case actionTypes.LOAD_MEMBERS_FAIL:
      return { ...state, loading: false, whetherLoadMembers: false };
    case actionTypes.LOAD_DEPARTMENTS_SUCCEED:
      return {
        ...state, departments: action.result.data, whetherLoadDepts: false,
      };
    case actionTypes.SWITCH_STATUS_SUCCEED: {
      const memberlist = { ...state.memberlist };
      memberlist.data[action.index].status = action.data.status;
      return { ...state, memberlist };
    }
    case actionTypes.SUBMIT_MEMBER:
    case actionTypes.EDIT_MEMBER:
      return { ...state, submitting: true };
    case actionTypes.SUBMIT_MEMBER_FAIL:
      return { ...state, submitting: false };
    case actionTypes.EDIT_MEMBER_SUCCEED:
      return {
        ...state,
        submitting: false,
        whetherLoadMembers: true,
        whetherLoadDepts: true,
      };
    case actionTypes.SUBMIT_MEMBER_SUCCEED:
      return {
        ...state,
        submitting: false,
        whetherLoadMembers: true,
      };
    case actionTypes.SAVE_DEPM_SUCCEED:
      return { ...state, whetherLoadMembers: true };
    case actionTypes.TOGGLE_MEMBER_MODAL:
      return {
        ...state,
        memberModal: {
          ...state.memeberModal,
          visible: action.visible,
        },
      };
    case actionTypes.LOAD_ROLES_SUCCEED:
      return { ...state, roles: action.result.data };
    case actionTypes.TOGGLE_USER_MODAL:
      return {
        ...state,
        userModal: {
          ...state.userModal,
          visible: action.visible,
          pid: action.pid,
        },
      };
    case actionTypes.TOGGLE_DEPARTMENT_MODAL:
      return {
        ...state,
        departmentModal: {
          ...state.departmentModal,
          visible: action.visible,
          data: action.data,
        },
      };
    case actionTypes.CREATE_DEPT_SUCCEED:
    case actionTypes.UPDATE_DEPT_SUCCEED:
    case actionTypes.DELETE_DEPT_SUCCEED:
      return { ...state, whetherLoadDepts: true };
    case actionTypes.REMOVE_DEPM_SUCCEED:
    case actionTypes.SETTOHEAD_DEPM_SUCCEED:
      return { ...state, whetherLoadDepts: true, whetherLoadMembers: true };
    default:
      return formReducer(
        actionTypes, state, action, { key: null },
        'memberlist'
      ) || state;
  }
}

export function getMember(loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_MEMBER,
        actionTypes.GET_MEMBER_SUCCEED,
        actionTypes.GET_MEMBER_FAIL,
      ],
      endpoint: 'v1/personnel/member',
      method: 'get',
      params: { loginId },
    },
  };
}

export function loadMembers(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MEMBERS,
        actionTypes.LOAD_MEMBERS_SUCCEED,
        actionTypes.LOAD_MEMBERS_FAIL,
      ],
      endpoint: 'v1/personnel/members',
      method: 'get',
      params,
    },
  };
}

export function loadDepartments() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DEPARTMENTS,
        actionTypes.LOAD_DEPARTMENTS_SUCCEED,
        actionTypes.LOAD_DEPARTMENTS_FAIL,
      ],
      endpoint: 'v1/personnel/departments',
      method: 'get',
    },
  };
}

export function loadDepartmentMembers(departmentId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DEPARTMENT_MEMBERS,
        actionTypes.LOAD_DEPARTMENT_MEMBERS_SUCCEED,
        actionTypes.LOAD_DEPARTMENT_MEMBERS_FAIL,
      ],
      endpoint: 'v1/personnel/department/members',
      method: 'get',
      params: { departmentId },
    },
  };
}

export function createDepartment(name, parentId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_DEPT,
        actionTypes.CREATE_DEPT_SUCCEED,
        actionTypes.CREATE_DEPT_FAIL,
      ],
      endpoint: 'v1/personnel/add/department',
      method: 'post',
      data: { name, parentId },
    },
  };
}

export function updateDepartment(name, parentId, deptId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_DEPT,
        actionTypes.UPDATE_DEPT_SUCCEED,
        actionTypes.UPDATE_DEPT_FAIL,
      ],
      endpoint: 'v1/personnel/update/department',
      method: 'post',
      data: { name, parentId, deptId },
    },
  };
}

export function delDepartment(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_DEPT,
        actionTypes.DELETE_DEPT_SUCCEED,
        actionTypes.DELETE_DEPT_FAIL,
      ],
      endpoint: 'v1/personnel/del/department',
      method: 'get',
      params: { id },
    },
  };
}

export function delMember(pid, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_MEMBER,
        actionTypes.DEL_MEMBER_SUCCEED,
        actionTypes.DEL_MEMBER_FAIL,
      ],
      endpoint: 'v1/personnel/del/member',
      method: 'del',
      data: { pid, loginId },
    },
  };
}

export function editTenantUser(personnel, code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_MEMBER,
        actionTypes.EDIT_MEMBER_SUCCEED,
        actionTypes.EDIT_MEMBER_FAIL,
      ],
      endpoint: 'v1/personnel/edit/member',
      method: 'put',
      data: { personnel, code },
    },
  };
}

export function createTenantUser(personnel, code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_MEMBER,
        actionTypes.SUBMIT_MEMBER_SUCCEED,
        actionTypes.SUBMIT_MEMBER_FAIL,
      ],
      endpoint: 'v1/personnel/new/member',
      method: 'post',
      data: {
        personnel, code,
      },
    },
  };
}
export function isFormDataLoaded(personnelState, persId) {
  return isFormDataLoadedC(persId, personnelState, 'memberlist');
}

export function loadForm(cookie, persId) {
  return loadFormC(cookie, 'v1/personnel/member', { pid: persId }, actionTypes);
}

export function assignForm(personnelState, persId) {
  return assignFormC(persId, personnelState, 'memberlist', actionTypes);
}

export function clearForm() {
  return clearFormC(actionTypes);
}

export function switchStatus(index, pid, status) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SWITCH_STATUS,
        actionTypes.SWITCH_STATUS_SUCCEED,
        actionTypes.SWITCH_STATUS_FAIL,
      ],
      endpoint: 'v1/personnel/member/status',
      method: 'put',
      index,
      data: { status, pid },
    },
  };
}

export function loadRoles() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ROLES,
        actionTypes.LOAD_ROLES_SUCCEED,
        actionTypes.LOAD_ROLES_FAIL,
      ],
      endpoint: 'v1/user/roles',
      method: 'get',
    },
  };
}

export function toggleMemberModal(visible) {
  return {
    type: actionTypes.TOGGLE_MEMBER_MODAL,
    visible,
  };
}

export function loadNonDepartmentMembers(deptId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NONDEPTM,
        actionTypes.LOAD_NONDEPTM_SUCCEED,
        actionTypes.LOAD_NONDEPTM_FAIL,
      ],
      endpoint: 'v1/personnel/nondepartment/members',
      method: 'get',
      params: { deptId },
    },
  };
}

export function saveDepartMember(deptId, userId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_DEPM,
        actionTypes.SAVE_DEPM_SUCCEED,
        actionTypes.SAVE_DEPM_FAIL,
      ],
      endpoint: 'v1/personnel/add/department/member',
      method: 'post',
      data: { deptId, userId },
    },
  };
}

export function toggleUserModal(visible, pid = '') {
  return {
    type: actionTypes.TOGGLE_USER_MODAL,
    visible,
    pid,
  };
}

export function removeDepartmentMember(userId, deptId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_DEPM,
        actionTypes.REMOVE_DEPM_SUCCEED,
        actionTypes.REMOVE_DEPM_FAIL,
      ],
      endpoint: 'v1/personnel/remove/department/member',
      method: 'post',
      data: { deptId, userId },
    },
  };
}

export function toggleDepartmentModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_DEPARTMENT_MODAL,
    visible,
    data,
  };
}

export function setUserToChargeDept(loginId, deptId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SETTOHEAD_DEPM,
        actionTypes.SETTOHEAD_DEPM_SUCCEED,
        actionTypes.SETTOHEAD_DEPM_FAIL,
      ],
      endpoint: 'v1/personnel/dept/member/takecharge',
      method: 'post',
      data: { deptId, loginId },
    },
  };
}
