import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/transition/', [
  'LOAD_STOCK_QUERY', 'LOAD_STOCK_QUERY_SUCCEED', 'LOAD_STOCK_QUERY_FAIL',
  'LOAD_STOCKQUERY_STAT', 'LOAD_STOCKQUERY_STAT_SUCCEED', 'LOAD_STOCKQUERY_STAT_FAIL',
  'LOAD_SOS_QUERY', 'LOAD_SOS_QUERY_SUCCEED', 'LOAD_SOS_QUERY_FAIL',
]);

const initialState = {
  queryLoading: false,
  ownerTransitionList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  queryFilter: {
    status: 'all',
  },
  ownerTransitionStat: {
    stock_qty: null,
    avail_qty: null,
    alloc_qty: null,
    frozen_qty: null,
    bonded_qty: null,
    nonbonded_qty: null,
  },
  soFilters: {
    status: 'all',
  },
  soQueryList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    loading: true,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_STOCK_QUERY:
      return {
        ...state,
        queryLoading: true,
        queryFilter: action.params.filter ?
          JSON.parse(action.params.filter) : state.queryFilter,
      };
    case actionTypes.LOAD_STOCK_QUERY_SUCCEED:
      return {
        ...state,
        queryLoading: false,
        ownerTransitionList: action.result.data,
      };
    case actionTypes.LOAD_STOCK_QUERY_FAIL:
      return {
        ...state,
        queryLoading: false,
      };
    case actionTypes.LOAD_STOCKQUERY_STAT_SUCCEED:
      return { ...state, ownerTransitionStat: action.result.data };
    case actionTypes.LOAD_SOS_QUERY:
      return {
        ...state,
        soFilters: action.params.filters ?
          JSON.parse(action.params.filters) : state.soFilters,
        soQueryList: { ...state.soQueryList, loading: true },
      };
    case actionTypes.LOAD_SOS_QUERY_SUCCEED:
      return {
        ...state,
        soQueryList: { ...action.result.data, loading: false },
      };
    default:
      return state;
  }
}

export function loadStockQuery(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STOCK_QUERY,
        actionTypes.LOAD_STOCK_QUERY_SUCCEED,
        actionTypes.LOAD_STOCK_QUERY_FAIL,
      ],
      endpoint: 'v1/cwm/superowner/stockquery',
      method: 'get',
      params,
    },
  };
}

export function loadStockQueryStat(filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STOCKQUERY_STAT,
        actionTypes.LOAD_STOCKQUERY_STAT_SUCCEED,
        actionTypes.LOAD_STOCKQUERY_STAT_FAIL,
      ],
      endpoint: 'v1/cwm/superowner/stockstat',
      method: 'get',
      params: { filter },
    },
  };
}

export function loadQuerySos(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SOS_QUERY,
        actionTypes.LOAD_SOS_QUERY_SUCCEED,
        actionTypes.LOAD_SOS_QUERY_FAIL,
      ],
      endpoint: 'v1/cwm/superowner/soquery',
      method: 'get',
      params: { ...params, owner: true },
    },
  };
}
