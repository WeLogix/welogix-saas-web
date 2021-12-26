import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const initialState = {
  unionTenants: [],
  buModal: {
    visible: false,
  },
  unionBus: [],
};
const actionTypes = createActionTypes('@@welogix/saas/affiliate', [
  'GET_UNION', 'GET_UNION_SUCCEED', 'GET_UNION_FAIL',
  'TOGGLE_BU_MODAL',
  'CREATE_BU', 'CREATE_BU_SUCCEED', 'CREATE_BU_FAIL',
  'LOAD_UNION_BU', 'LOAD_UNION_BU_SUCCEED', 'LOAD_UNION_BU_FAIL',
  'UPDATE_UNION_BU', 'UPDATE_UNION_BU_SUCCEED', 'UPDATE_UNION_BU_FAIL',
  'DELETE_UNION_BU', 'DELETE_UNION_BU_SUCCEED', 'DELETE_UNION_BU_FAIL',
  'SET_UNION_BU', 'SET_UNION_BU_SUCCEED', 'SET_UNION_BU_FAIL',
]);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_UNION_SUCCEED:
      return { ...state, unionTenants: action.result.data };
    case actionTypes.TOGGLE_BU_MODAL:
      return { ...state, buModal: { visible: action.data.visible } };
    case actionTypes.LOAD_UNION_BU_SUCCEED:
      return { ...state, unionBus: action.result.data };
    case actionTypes.CREATE_BU_SUCCEED: {
      const unionBus = [...state.unionBus];
      unionBus.push(action.result.data);
      return { ...state, unionBus };
    }
    case actionTypes.UPDATE_UNION_BU_SUCCEED: {
      const unionBus = [...state.unionBus];
      const index = unionBus.findIndex(bu => bu.id === action.data.buId);
      unionBus[index].bu_name = action.data.buName;
      return { ...state, unionBus };
    }
    case actionTypes.DELETE_UNION_BU_SUCCEED: {
      const unionBus = [...state.unionBus];
      const index = unionBus.findIndex(bu => bu.id === action.data.buId);
      unionBus.splice(index, 1);
      return { ...state, unionBus };
    }
    case actionTypes.SET_UNION_BU_SUCCEED: {
      const unionTenants = [...state.unionTenants];
      const index = unionTenants.findIndex(ut => ut.tenant_id === action.data.unionTenantId);
      unionTenants[index].union_bu_id = action.data.buId;
      return { ...state, unionTenants };
    }
    default:
      return state;
  }
}

export function getUnionTenants(unionId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_UNION,
        actionTypes.GET_UNION_SUCCEED,
        actionTypes.GET_UNION_FAIL,
      ],
      endpoint: 'v1/tenant/union/tenants',
      method: 'get',
      params: { unionId },
    },
  };
}

export function togglebuModal(visible) {
  return {
    type: actionTypes.TOGGLE_BU_MODAL,
    data: { visible },
  };
}

export function createBu(buName, unionId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BU,
        actionTypes.CREATE_BU_SUCCEED,
        actionTypes.CREATE_BU_FAIL,
      ],
      endpoint: 'v1/tennat/union/createbu',
      method: 'post',
      data: { buName, unionId },
    },
  };
}

export function getUnionBuList(unionId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UNION_BU,
        actionTypes.LOAD_UNION_BU_SUCCEED,
        actionTypes.LOAD_UNION_BU_FAIL,
      ],
      endpoint: 'v1/tenant/union/bulist',
      method: 'get',
      params: { unionId },
    },
  };
}

export function updateUnionBu(buId, buName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_UNION_BU,
        actionTypes.UPDATE_UNION_BU_SUCCEED,
        actionTypes.UPDATE_UNION_BU_FAIL,
      ],
      endpoint: 'v1/tenant/union/updatebu',
      method: 'post',
      data: { buId, buName },
    },
  };
}

export function deleteUnionBu(buId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_UNION_BU,
        actionTypes.DELETE_UNION_BU_SUCCEED,
        actionTypes.DELETE_UNION_BU_FAIL,
      ],
      endpoint: 'v1/tenant/union/deletebu',
      method: 'post',
      data: { buId },
    },
  };
}

export function setUnionBu(buId, unionTenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SET_UNION_BU,
        actionTypes.SET_UNION_BU_SUCCEED,
        actionTypes.SET_UNION_BU_FAIL,
      ],
      endpoint: 'v1/tenant/union/setunionbu',
      method: 'post',
      data: { buId, unionTenantId },
    },
  };
}
