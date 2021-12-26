import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/corp/manage', [
  'SET_PARTNER', 'TOGGLE_CREATE_TEAM_MODAL', 'TOGGLE_TEAM_USER_MODAL',
  'ADD_SERVICE_TEAM', 'ADD_SERVICE_TEAM_SUCCEED', 'ADD_SERVICE_TEAM_FAIL',
  'DEL_SERVICE_TEAM', 'DEL_SERVICE_TEAM_SUCCEED', 'DEL_SERVICE_TEAM_FAIL',
  'EDIT_TEAM_NAME', 'EDIT_TEAM_NAME_SUCCEED', 'EDIT_TEAM_NAME_FAIL',
  'EDIT_TEAM_STAFF', 'EDIT_TEAM_STAFF_SUCCEED', 'EDIT_TEAM_STAFF_FAIL',
  'LOAD_TEAM_INFO', 'LOAD_TEAM_INFO_SUCCEED', 'LOAD_TEAM_INFO_FAIL',
  'ADD_SERVICETEAM_MEMBERS', 'ADD_SERVICETEAM_MEMBERS_SUCCEED', 'ADD_SERVICETEAM_MEMBERS_FAIL',
  'LOAD_FLOW_NODE_LIST', 'LOAD_FLOW_NODE_LIST_SUCCEED', 'LOAD_FLOW_NODE_LIST_FAIL',
  'LOAD_BIZ_AUTH_CONFIG', 'LOAD_BIZ_AUTH_CONFIG_SUCCEED', 'LOAD_BIZ_AUTH_CONFIG_FAIL',
  'UPSERT_BIZ_AUTH_CONFIG', 'UPSERT_BIZ_AUTH_CONFIG_SUCCEED', 'UPSERT_BIZ_AUTH_CONFIG_FAIL',
]);

const initialState = {
  currentPartner: {},
  createModalVisible: false,
  serviceTeams: [],
  whetherReloadTeams: false,
  teamUserModal: {
    visible: false,
    teamId: '',
    selectedLoginIds: [],
  },
  operators: [],
  flowNodeList: [],
  bizAuths: [],
  bizAuthLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_PARTNER:
      return { ...state, currentPartner: action.payload, whetherReloadTeams: true };
    case actionTypes.TOGGLE_CREATE_TEAM_MODAL:
      return { ...state, createModalVisible: !state.createModalVisible };
    case actionTypes.TOGGLE_TEAM_USER_MODAL:
      return { ...state, teamUserModal: action.payload };
    case actionTypes.ADD_SERVICE_TEAM_SUCCEED:
    case actionTypes.ADD_SERVICETEAM_MEMBERS_SUCCEED:
    case actionTypes.DEL_SERVICE_TEAM_SUCCEED:
      return { ...state, whetherReloadTeams: true };
    case actionTypes.LOAD_TEAM_INFO_SUCCEED: {
      const serviceTeams = action.result.data;
      const operators = serviceTeams.reduce((a, b) => a.concat(b.users), []);
      return {
        ...state, serviceTeams, operators, whetherReloadTeams: false,
      };
    }
    case actionTypes.LOAD_TEAM_INFO_FAIL:
      return { ...state, whetherReloadTeams: false };
    case actionTypes.LOAD_FLOW_NODE_LIST_SUCCEED:
      return { ...state, flowNodeList: action.result.data };
    case actionTypes.LOAD_BIZ_AUTH_CONFIG_SUCCEED:
      return { ...state, bizAuths: action.result.data };
    case actionTypes.UPSERT_BIZ_AUTH_CONFIG:
      return { ...state, bizAuthLoading: true };
    case actionTypes.UPSERT_BIZ_AUTH_CONFIG_SUCCEED:
    case actionTypes.UPSERT_BIZ_AUTH_CONFIG_FAIL:
      return { ...state, bizAuthLoading: false };
    default:
      return state;
  }
}

export function setCurrentPartner(partner) {
  return {
    type: actionTypes.SET_PARTNER,
    payload: partner,
  };
}

export function toggleCreateTeamModal() {
  return {
    type: actionTypes.TOGGLE_CREATE_TEAM_MODAL,
  };
}

export function toggleTeamUserModal(visible, teamId = '', selectedLoginIds = []) {
  return {
    type: actionTypes.TOGGLE_TEAM_USER_MODAL,
    payload: { visible, teamId, selectedLoginIds },
  };
}

export function createServiceTeam(partnerId, partnerTenantId, teamName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SERVICE_TEAM,
        actionTypes.ADD_SERVICE_TEAM_SUCCEED,
        actionTypes.ADD_SERVICE_TEAM_FAIL,
      ],
      endpoint: 'v1/collab/empower/newteam',
      method: 'post',
      data: {
        partnerId, partnerTenantId, teamName,
      },
    },
  };
}

export function delServiceTeam(teamId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_SERVICE_TEAM,
        actionTypes.DEL_SERVICE_TEAM_SUCCEED,
        actionTypes.DEL_SERVICE_TEAM_FAIL,
      ],
      endpoint: 'v1/collab/empower/delteam',
      method: 'post',
      data: { teamId },
    },
  };
}

export function updateServiceTeam(teamId, teamUpdate) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_TEAM_NAME,
        actionTypes.EDIT_TEAM_NAME_SUCCEED,
        actionTypes.EDIT_TEAM_NAME_FAIL,
      ],
      endpoint: 'v1/collab/empower/editteam',
      method: 'post',
      data: { teamId, teamUpdate },
    },
  };
}

// 身为客户查询服务商传参partnerTenantId，身为服务商查询客户传参partnerId
export function loadServiceTeamList({ partnerId, partnerTenantId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TEAM_INFO,
        actionTypes.LOAD_TEAM_INFO_SUCCEED,
        actionTypes.LOAD_TEAM_INFO_FAIL,
      ],
      endpoint: 'v1/collab/empower/teamlist',
      method: 'get',
      params: { partnerId, partnerTenantId },
    },
  };
}

export function addServiceTeamMembers(teamId, loginIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SERVICETEAM_MEMBERS,
        actionTypes.ADD_SERVICETEAM_MEMBERS_SUCCEED,
        actionTypes.ADD_SERVICETEAM_MEMBERS_FAIL,
      ],
      endpoint: 'v1/collab/empower/newteammember',
      method: 'post',
      data: { teamId, loginIds },
    },
  };
}

// 身为客户查询服务商传参partnerTenantId，身为服务商查询客户传参partnerId
export function loadFlowNodeList({ partnerId, partnerTenantId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOW_NODE_LIST,
        actionTypes.LOAD_FLOW_NODE_LIST_SUCCEED,
        actionTypes.LOAD_FLOW_NODE_LIST_FAIL,
      ],
      endpoint: 'v1/scof/partner/flownodes',
      method: 'get',
      params: { partnerId, partnerTenantId },
    },
  };
}

export function loadBizAuthConfig({ partnerId, partnerTenantId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZ_AUTH_CONFIG,
        actionTypes.LOAD_BIZ_AUTH_CONFIG_SUCCEED,
        actionTypes.LOAD_BIZ_AUTH_CONFIG_FAIL,
      ],
      endpoint: 'v1/collab/empower/bizauthconfig',
      method: 'get',
      params: { partnerId, partnerTenantId },
    },
  };
}

export function upsertBizAuthConfig(
  partnerId, partnerTenantId, bizObject,
  status, whereCls, bizAuthId,
) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPSERT_BIZ_AUTH_CONFIG,
        actionTypes.UPSERT_BIZ_AUTH_CONFIG_SUCCEED,
        actionTypes.UPSERT_BIZ_AUTH_CONFIG_FAIL,
      ],
      endpoint: 'v1/collab/empower/upsertbizauthconfig',
      method: 'post',
      data: {
        partnerId, partnerTenantId, bizObject, status, whereCls, bizAuthId,
      },
    },
  };
}
