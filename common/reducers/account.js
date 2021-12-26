import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const initialState = {
  loaded: false, // used by isLoad action
  loggingOut: false,
  loginId: -1,
  username: '',
  code: '',
  customsCode: '',
  subdomain: '',
  tenantId: 0,
  parentTenantId: null,
  aspect: 0,
  categoryId: 0,
  tenantName: '',
  tenantLevel: -1,
  logo: '',
  role_id: '',
  role_name: '',
  isManager: false,
  profile: {
    // name(same as outter username), username(loginName without @), phone, email,
  },
  opencode: '',
  modules: [],
  apps: [],
  privileges: {}, // module_id: true(全部功能) || { feature_id: true || { action_id: true }}
  userMembers: [],
  changelogViewed: false,
  departments: [],
  userDeptRel: [],
  // serviceTeam: [],
};

const actions = [
  'ACC_LOAD', 'ACC_LOAD_SUCCEED', 'ACC_LOAD_FAIL',
  'PWD_CHANGE', 'PWD_CHANGE_SUCCEED', 'PWD_CHANGE_FAIL',
  'PROFILE_UPDATE', 'PROFILE_UPDATE_SUCCEED', 'PROFILE_UPDATE_FAIL',
  'LOGOUT', 'LOGOUT_SUCCEED', 'LOGOUT_FAIL',
  'UPDATE_CHANGELOG_MEMBERVIEWED', 'UPDATE_CHANGELOG_MEMBERVIEWED_SUCCEED', 'UPDATE_CHANGELOG_MEMBERVIEWED_FAIL',
  'LOAD_DEPTMBS', 'LOAD_DEPTMBS_SUCCEED', 'LOAD_DEPTMBS_FAIL',
];
const domain = '@@welogix/account/';
const actionTypes = createActionTypes(domain, actions);

export const { ACC_LOAD_SUCCEED } = actionTypes;
export const { PROFILE_UPDATE_SUCCEED } = actionTypes;
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ACC_LOAD_SUCCEED:
      return { ...state, loaded: true, ...action.result.data };
    case actionTypes.LOAD_DEPTMBS_SUCCEED:
      return { ...state, ...action.result.data };
    case actionTypes.LOGOUT:
      return { ...state, loggingOut: true };
    case actionTypes.LOGOUT_SUCCEED:
    case actionTypes.LOGOUT_FAIL:
      return { ...state, loggingOut: false };
    case actionTypes.PROFILE_UPDATE_SUCCEED:
      return {
        ...state,
        profile: {
          ...state.profile, ...action.data.profile,
        },
      };
    case actionTypes.UPDATE_CHANGELOG_MEMBERVIEWED_SUCCEED:
      return { ...state, changelogViewed: true };
    default:
      return state;
  }
}

export function loadAccount() {
  return {
    [CLIENT_API]: {
      types: [actionTypes.ACC_LOAD, actionTypes.ACC_LOAD_SUCCEED, actionTypes.ACC_LOAD_FAIL],
      endpoint: 'v1/user/account',
      method: 'get',
    },
  };
}


export function loadDeptAndMembers() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DEPTMBS,
        actionTypes.LOAD_DEPTMBS_SUCCEED,
        actionTypes.LOAD_DEPTMBS_FAIL,
      ],
      endpoint: 'v1/tenant/memberdepts',
      method: 'get',
    },
  };
}

export function changePassword(oldPwd, newPwd) {
  return {
    [CLIENT_API]: {
      types: [actionTypes.PWD_CHANGE, actionTypes.PWD_CHANGE_SUCCEED, actionTypes.PWD_CHANGE_FAIL],
      endpoint: 'v1/user/password',
      method: 'put',
      data: { oldPwd, newPwd },
    },
  };
}

export function updateProfile(profile, code, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PROFILE_UPDATE,
        actionTypes.PROFILE_UPDATE_SUCCEED,
        actionTypes.PROFILE_UPDATE_FAIL,
      ],
      endpoint: 'v1/user/profile',
      method: 'put',
      data: { profile, code, tenantId },
    },
  };
}

export function logout() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOGOUT,
        actionTypes.LOGOUT_SUCCEED,
        actionTypes.LOGOUT_FAIL,
      ],
      endpoint: 'v1/logout',
      method: 'post',
    },
  };
}

export function updateChangelogMemberviewed() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CHANGELOG_MEMBERVIEWED,
        actionTypes.UPDATE_CHANGELOG_MEMBERVIEWED_SUCCEED,
        actionTypes.UPDATE_CHANGELOG_MEMBERVIEWED_FAIL,
      ],
      endpoint: 'v1/changelog/memberviewed',
      method: 'post',
    },
  };
}
