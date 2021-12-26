import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/rate/settings/', [
  'VISIBLE_NEW_Rate_MODAL',
  'LOAD_EXCHANGE_RATES', 'LOAD_EXCHANGE_RATES_SUCCEED', 'LOAD_EXCHANGE_RATES_FAIL',
  'LOAD_PARAMS', 'LOAD_PARAMS_SUCCEED', 'LOAD_PARAMS_FAIL',
  'ADD_EXCHANGE_RATE', 'ADD_EXCHANGE_RATE_SUCCEED', 'ADD_EXCHANGE_RATE_FAIL',
  'DELETE_EXCHANGE_RATE', 'DELETE_EXCHANGE_RATE_SUCCEED', 'DELETE_EXCHANGE_RATE_FAIL',
  'ALTER_EXCHANGE_RATE', 'ALTER_EXCHANGE_RATE_SUCCEED', 'ALTER_EXCHANGE_RATE_FAIL',
  'LOAD_CUSTOMS_EXCHANGE', 'LOAD_CUSTOMS_EXCHANGE_SUCCEED', 'LOAD_CUSTOMS_EXCHANGE_FAIL',
  'TOGGLE_CUS_EXCHANGE_HISTORY_MODAL',
  'LOAD_CUS_CURR_EXCHANGE_HISTORY', 'LOAD_CUS_CURR_EXCHANGE_HISTORY_SUCCEED', 'LOAD_CUS_CURR_EXCHANGE_HISTORY_FAIL',
]);

const initialState = {
  visibleExRateModal: false,
  loading: false,
  exRateList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  currencies: [],
  customsExchangeList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  customsExchangeHistoryModal: {
    visible: false,
    currCode: '',
    currName: '',
    data: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.VISIBLE_NEW_Rate_MODAL:
      return { ...state, visibleExRateModal: action.data };
    case actionTypes.LOAD_EXCHANGE_RATES:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LOAD_EXCHANGE_RATES_SUCCEED:
      return {
        ...state,
        loading: false,
        exRateList: action.result.data,
      };
    case actionTypes.LOAD_PARAMS_SUCCEED:
      return { ...state, currencies: action.result.data };
    case actionTypes.LOAD_CUSTOMS_EXCHANGE_SUCCEED:
      return { ...state, customsExchangeList: { ...action.result.data } };
    case actionTypes.TOGGLE_CUS_EXCHANGE_HISTORY_MODAL:
      return {
        ...state,
        customsExchangeHistoryModal: {
          ...state.customsExchangeHistoryModal,
          visible: action.data.visible,
          currCode: action.data.currCode,
          currName: action.data.currName,
        },
      };
    case actionTypes.LOAD_CUS_CURR_EXCHANGE_HISTORY_SUCCEED:
      return {
        ...state,
        customsExchangeHistoryModal: {
          ...state.customsExchangeHistoryModal,
          data: action.result.data,
        },
      };
    default:
      return state;
  }
}

export function toggleNewExRateModal(visible) {
  return {
    type: actionTypes.VISIBLE_NEW_Rate_MODAL,
    data: visible,
  };
}

export function loadExRates(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_EXCHANGE_RATES,
        actionTypes.LOAD_EXCHANGE_RATES_SUCCEED,
        actionTypes.LOAD_EXCHANGE_RATES_FAIL,
      ],
      endpoint: 'v1/bss/exchange/rate/load',
      method: 'get',
      params,
    },
  };
}

export function loadParams() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PARAMS,
        actionTypes.LOAD_PARAMS_SUCCEED,
        actionTypes.LOAD_PARAMS_FAIL,
      ],
      endpoint: 'v1/bss/exchange/rate/params/load',
      method: 'get',
    },
  };
}

export function addExRate(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_EXCHANGE_RATE,
        actionTypes.ADD_EXCHANGE_RATE_SUCCEED,
        actionTypes.ADD_EXCHANGE_RATE_FAIL,
      ],
      endpoint: 'v1/bss/exchange/rate/add',
      method: 'post',
      data,
    },
  };
}

export function deleteExRate(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_EXCHANGE_RATE,
        actionTypes.DELETE_EXCHANGE_RATE_SUCCEED,
        actionTypes.DELETE_EXCHANGE_RATE_FAIL,
      ],
      endpoint: 'v1/bss/exchange/rate/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function alterExRateVal(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ALTER_EXCHANGE_RATE,
        actionTypes.ALTER_EXCHANGE_RATE_SUCCEED,
        actionTypes.ALTER_EXCHANGE_RATE_FAIL,
      ],
      endpoint: 'v1/bss/exchange/rate/alter',
      method: 'post',
      data,
    },
  };
}

export function loadCustomsExchangeList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CUSTOMS_EXCHANGE,
        actionTypes.LOAD_CUSTOMS_EXCHANGE_SUCCEED,
        actionTypes.LOAD_CUSTOMS_EXCHANGE_FAIL,
      ],
      endpoint: 'v1/bss/customs/exchange/list',
      method: 'get',
      params,
    },
  };
}

export function toggleCusExchangeHistoryModal(visible, currCode, currName) {
  return {
    type: actionTypes.TOGGLE_CUS_EXCHANGE_HISTORY_MODAL,
    data: { visible, currCode, currName },
  };
}

export function loadCusCurrExchangeHistory(currCode, date) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CUS_CURR_EXCHANGE_HISTORY,
        actionTypes.LOAD_CUS_CURR_EXCHANGE_HISTORY_SUCCEED,
        actionTypes.LOAD_CUS_CURR_EXCHANGE_HISTORY_FAIL,
      ],
      endpoint: 'v1/bss/customs/currency/exchange/history',
      method: 'get',
      params: { currCode, date },
    },
  };
}
