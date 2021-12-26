import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/resources/', [
  'LOAD_TRADE_UNITS', 'LOAD_TRADE_UNITS_SUCCEED', 'LOAD_TRADE_UNITS_FAIL',
  'LOAD_OVERSEA_UNITS', 'LOAD_OVERSEA_UNITS_SUCCEED', 'LOAD_OVERSEA_UNITS_FAIL',
  'ADD_TRADE_UNIT', 'ADD_TRADE_UNIT_SUCCEED', 'ADD_TRADE_UNIT_FAIL',
  'ADD_OVERSEA_UNIT', 'ADD_OVERSEA_UNIT_SUCCEED', 'ADD_OVERSEA_UNIT_FAIL',
  'UPDATE_TRADE_UNIT', 'UPDATE_TRADE_UNIT_SUCCEED', 'UPDATE_TRADE_UNIT_FAIL',
  'UPDATE_OVERSEA_UNIT', 'UPDATE_OVERSEA_UNIT_SUCCEED', 'UPDATE_OVERSEA_UNIT_FAIL',
  'DELETE_TRADE_UNIT', 'DELETE_TRADE_UNIT_SUCCEED', 'DELETE_TRADE_UNIT_FAIL',
  'DELETE_OVERSEA_UNIT', 'DELETE_OVERSEA_UNIT_SUCCEED', 'DELETE_OVERSEA_UNIT_FAIL',
  'TOGGLE_TRADE_UNIT', 'TOGGLE_OVERSEA_UNIT', 'SET_RES_TABKEY', 'SET_CUSTOMER',
  'TOGGLE_UNIT_RULE_SET',
  'LOAD_BUSINESS_UNITS_USERS', 'LOAD_BUSINESS_UNITS_USERS_SUCCEED', 'LOAD_BUSINESS_UNITS_USERS_FAIL',
  'ADD_TRADE_USER', 'ADD_TRADE_USER_SUCCEED', 'ADD_TRADE_USER_FAIL',
  'DELETE_TRADE_USER', 'DELETE_TRADE_USER_SUCCEED', 'DELETE_TRADE_USER_FAIL',
  'LOAD_BROKERS', 'LOAD_BROKERS_SUCCEED', 'LOAD_BROKERS_FAIL',
]);

const initialState = {
  whetherLoadTradeUnit: true,
  whetherLoadOverseaUnit: true,
  tradeUnits: [],
  overseaUnits: [],
  tradeUnitModal: {
    visible: false,
    operation: 'add', // add/edit
    businessUnit: {},
  },
  overseaUnitModal: {
    visible: false,
    operation: 'add',
    businessUnit: {},
  },
  customer: {},
  tabkey: 'rules',
  unitRuleSetModal: {
    visible: false,
    relationId: null,
  },
  businessUnitUsers: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_TRADE_UNITS_SUCCEED:
      return {
        ...state, tradeUnits: action.result.data, whetherLoadTradeUnit: false,
      };
    case actionTypes.LOAD_OVERSEA_UNITS_SUCCEED:
      return {
        ...state, overseaUnits: action.result.data, whetherLoadOverseaUnit: false,
      };
    case actionTypes.ADD_TRADE_UNIT_SUCCEED:
    case actionTypes.UPDATE_TRADE_UNIT_SUCCEED:
    case actionTypes.DELETE_TRADE_UNIT_SUCCEED: {
      return { ...state, whetherLoadTradeUnit: true };
    }
    case actionTypes.ADD_OVERSEA_UNIT_SUCCEED:
    case actionTypes.UPDATE_OVERSEA_UNIT_SUCCEED:
    case actionTypes.DELETE_OVERSEA_UNIT_SUCCEED: {
      return { ...state, whetherLoadOverseaUnit: true };
    }
    case actionTypes.TOGGLE_TRADE_UNIT: {
      return { ...state, tradeUnitModal: { ...state.tradeUnitModal, ...action.data } };
    }
    case actionTypes.TOGGLE_OVERSEA_UNIT: {
      return { ...state, overseaUnitModal: { ...state.overseaUnitModal, ...action.data } };
    }
    case actionTypes.SET_RES_TABKEY:
      return { ...state, tabkey: action.data.key };
    case actionTypes.SET_CUSTOMER:
      return { ...state, customer: action.data.customer };
    case actionTypes.TOGGLE_UNIT_RULE_SET:
      return { ...state, unitRuleSetModal: { ...state.unitRuleSetModal, ...action.data } };
    case actionTypes.LOAD_BUSINESS_UNITS_USERS_SUCCEED:
      return { ...state, businessUnitUsers: action.result.data };
    default:
      return state;
  }
}

export function loadTradeUnits(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRADE_UNITS,
        actionTypes.LOAD_TRADE_UNITS_SUCCEED,
        actionTypes.LOAD_TRADE_UNITS_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_units',
      method: 'get',
      params,
    },
  };
}

export function loadOverseaUnits(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_OVERSEA_UNITS,
        actionTypes.LOAD_OVERSEA_UNITS_SUCCEED,
        actionTypes.LOAD_OVERSEA_UNITS_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_units',
      method: 'get',
      params,
    },
  };
}

export function addTradeUnit(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_TRADE_UNIT,
        actionTypes.ADD_TRADE_UNIT_SUCCEED,
        actionTypes.ADD_TRADE_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/add',
      method: 'post',
      data,
    },
  };
}

export function addOverseaUnit(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_OVERSEA_UNIT,
        actionTypes.ADD_OVERSEA_UNIT_SUCCEED,
        actionTypes.ADD_OVERSEA_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/add',
      method: 'post',
      data,
    },
  };
}

export function updateTradeUnit(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_TRADE_UNIT,
        actionTypes.UPDATE_TRADE_UNIT_SUCCEED,
        actionTypes.UPDATE_TRADE_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/update',
      method: 'post',
      data,
    },
  };
}

export function updateOverseaUnit(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_OVERSEA_UNIT,
        actionTypes.UPDATE_OVERSEA_UNIT_SUCCEED,
        actionTypes.UPDATE_OVERSEA_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/update',
      method: 'post',
      data,
    },
  };
}

export function deleteTradeUnit(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_TRADE_UNIT,
        actionTypes.DELETE_TRADE_UNIT_SUCCEED,
        actionTypes.DELETE_TRADE_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function deleteOverseaUnit(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_OVERSEA_UNIT,
        actionTypes.DELETE_OVERSEA_UNIT_SUCCEED,
        actionTypes.DELETE_OVERSEA_UNIT_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_unit/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function toggleTradeUnitModal(visible, operation, businessUnit = {}) {
  return {
    type: actionTypes.TOGGLE_TRADE_UNIT,
    data: { visible, operation, businessUnit },
  };
}

export function toggleOverseaUnitModal(visible, operation, businessUnit = {}) {
  return {
    type: actionTypes.TOGGLE_OVERSEA_UNIT,
    data: { visible, operation, businessUnit },
  };
}

export function setResTabkey(key) {
  return {
    type: actionTypes.SET_RES_TABKEY,
    data: { key },
  };
}

export function setCustomer(customer) {
  return {
    type: actionTypes.SET_CUSTOMER,
    data: { customer },
  };
}

export function toggleUnitRuleSetModal(visible, relationId) {
  return {
    type: actionTypes.TOGGLE_UNIT_RULE_SET,
    data: { visible, relationId },
  };
}

export function loadBusinessUnitUsers(relationId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BUSINESS_UNITS_USERS,
        actionTypes.LOAD_BUSINESS_UNITS_USERS_SUCCEED,
        actionTypes.LOAD_BUSINESS_UNITS_USERS_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_units/users/get',
      method: 'get',
      params: { relationId },
    },
  };
}

export function loadBrokers({ role, businessType, excludeOwn }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BROKERS,
        actionTypes.LOAD_BROKERS_SUCCEED,
        actionTypes.LOAD_BROKERS_FAIL,
      ],
      endpoint: 'v1/cooperation/partners',
      method: 'post',
      data: { role, businessType, excludeOwn },
    },
  };
}

export function addTradeUser(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_TRADE_USER,
        actionTypes.ADD_TRADE_USER_SUCCEED,
        actionTypes.ADD_TRADE_USER_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_units/user/add',
      method: 'post',
      data,
    },
  };
}

export function deleteTradeUser(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_TRADE_USER,
        actionTypes.DELETE_TRADE_USER_SUCCEED,
        actionTypes.DELETE_TRADE_USER_FAIL,
      ],
      endpoint: 'v1/cms/resources/business_units/user/delete',
      method: 'post',
      data: { id },
    },
  };
}
