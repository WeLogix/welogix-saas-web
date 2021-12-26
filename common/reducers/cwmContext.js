import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/context/', [
  'LOAD_WHCONTEXT', 'LOAD_WHCONTEXT_SUCCEED', 'LOAD_WHCONTEXT_FAIL',
  'LOAD_WHSE', 'LOAD_WHSE_SUCCEED', 'LOAD_WHSE_FAIL',
  'SWITCH_DEFWHSE',
  'SEARCH_WHSE', 'SEARCH_WHSE_SUCCEED', 'SEARCH_WHSE_FAIL',
]);

const initialState = {
  loaded: false,
  whses: [],
  defaultWhse: {},
  whseAttrs: {
    owners: [],
    receivers: [],
    suppliers: [],
    carriers: [],
    brokers: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_WHCONTEXT_SUCCEED: {
      let defWhse = state.defaultWhse;
      if (action.payload.whseId && defWhse.id === action.payload.whseId) {
        [defWhse] = action.result.data.filter(whse => whse.id === action.payload.whseId);
      }
      return {
        ...state, whses: action.result.data, defaultWhse: defWhse || {}, loaded: true,
      };
    }
    case actionTypes.SWITCH_DEFWHSE:
      return { ...state, defaultWhse: state.whses.filter(wh => wh.code === action.data)[0] || {} };
    case actionTypes.LOAD_WHSE_SUCCEED:
      return { ...state, whseAttrs: action.result.data };
    case actionTypes.SEARCH_WHSE_SUCCEED:
      return { ...state, whses: action.result.data, loaded: true };
    default:
      return state;
  }
}

export function loadWhseContext(whseId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHCONTEXT,
        actionTypes.LOAD_WHCONTEXT_SUCCEED,
        actionTypes.LOAD_WHCONTEXT_FAIL,
      ],
      endpoint: 'v1/cwm/context/warehouses',
      method: 'get',
      payload: { whseId },
    },
  };
}

export function switchDefaultWhse(whno) {
  return {
    type: actionTypes.SWITCH_DEFWHSE,
    data: whno,
  };
}

export function loadWhse(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHSE,
        actionTypes.LOAD_WHSE_SUCCEED,
        actionTypes.LOAD_WHSE_FAIL,
      ],
      endpoint: 'v1/cwm/context/warehouse',
      method: 'get',
      params: { whse_code: whseCode },
    },
  };
}

export function searchWhse(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEARCH_WHSE,
        actionTypes.SEARCH_WHSE_SUCCEED,
        actionTypes.SEARCH_WHSE_FAIL,
      ],
      endpoint: 'v1/cwm/search/whse',
      method: 'get',
      params: { data },
    },
  };
}
