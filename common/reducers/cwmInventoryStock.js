import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/inventory/stock/', [
  'LOAD_STOCKS', 'LOAD_STOCKS_SUCCEED', 'LOAD_STOCKS_FAIL',
  'CHANGE_SEARCH_TYPE', 'TOGGLE_STOCK_PANEL', 'TOGGLE_ALLOCATED_PANEL',
  'LOAD_PREALLOC_RECORDS', 'LOAD_PREALLOC_RECORDS_SUCCEED', 'LOAD_PREALLOC_RECORDS_FAIL',
  'LOAD_ALLOC_RECORDS', 'LOAD_ALLOC_RECORDS_SUCCEED', 'LOAD_ALLOC_RECORDS_FAIL',
  'LOAD_VIRTUALWHSE_STOCK', 'LOAD_VIRTUALWHSE_STOCK_SUCCEED', 'LOAD_VIRTUALWHSE_STOCK_FAIL',
]);

const initialState = {
  loading: false,
  list: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  sortFilter: {
    field: '',
    order: '',
  },
  listFilter: {
    product_no: null,
    whse_code: '',
    owner: '',
    whse_location: '',
    search_type: 2,
  },
  stockPanel: {
    visible: false,
    product: {},
  },
  allocatedPanel: {
    visible: false,
    activeTab: 'preAlllocRecord',
    stockItem: {},
  },
  preAllocRecords: [],
  allocRecords: [],
  virtualWhseStock: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_STOCKS:
      return {
        ...state,
        loading: true,
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_STOCKS_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_STOCKS_SUCCEED:
      return { ...state, list: action.result.data, loading: false };
    case actionTypes.CHANGE_SEARCH_TYPE:
      return {
        ...state,
        list: initialState.list,
        listFilter: { ...state.listFilter, search_type: action.value },
      };
    case actionTypes.TOGGLE_STOCK_PANEL:
      return { ...state, stockPanel: action.data };
    case actionTypes.TOGGLE_ALLOCATED_PANEL:
      return { ...state, allocatedPanel: action.data };
    case actionTypes.LOAD_PREALLOC_RECORDS_SUCCEED:
      return { ...state, preAllocRecords: action.result.data };
    case actionTypes.LOAD_ALLOC_RECORDS_SUCCEED:
      return { ...state, allocRecords: action.result.data };
    case actionTypes.LOAD_VIRTUALWHSE_STOCK_SUCCEED:
      return { ...state, virtualWhseStock: action.result.data };
    default:
      return state;
  }
}

export function loadStocks(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STOCKS,
        actionTypes.LOAD_STOCKS_SUCCEED,
        actionTypes.LOAD_STOCKS_FAIL,
      ],
      endpoint: 'v1/cwm/inventory/stock',
      method: 'get',
      params,
    },
  };
}

export function changeSearchType(value) {
  return {
    type: actionTypes.CHANGE_SEARCH_TYPE,
    value,
  };
}

export function toggleStockPanel(visible, product = {}) {
  return {
    type: actionTypes.TOGGLE_STOCK_PANEL,
    data: { visible, product },
  };
}

export function toggleAllocatedPanel(visible, activeTab = 'preAlllocRecord', stockItem = {}) {
  return {
    type: actionTypes.TOGGLE_ALLOCATED_PANEL,
    data: { visible, activeTab, stockItem },
  };
}

// 查询预分配记录
export function loadPreAllocRecords(productNo, virtualWhse, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PREALLOC_RECORDS,
        actionTypes.LOAD_PREALLOC_RECORDS_SUCCEED,
        actionTypes.LOAD_PREALLOC_RECORDS_FAIL,
      ],
      endpoint: 'v1/cwm/inventory/prdvirtualwhse/preallocs',
      method: 'get',
      params: { productNo, virtualWhse, whseCode },
    },
  };
}

// 查询分配记录和预分配记录
export function loadAllocRecords(productNo, virtualWhse, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALLOC_RECORDS,
        actionTypes.LOAD_ALLOC_RECORDS_SUCCEED,
        actionTypes.LOAD_ALLOC_RECORDS_FAIL,
      ],
      endpoint: 'v1/cwm/inventory/prdvirtualwhse/allocs',
      method: 'get',
      params: { productNo, virtualWhse, whseCode },
    },
  };
}

export function loadVirtualWhseStock(productNo, virtualWhse, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_VIRTUALWHSE_STOCK,
        actionTypes.LOAD_VIRTUALWHSE_STOCK_SUCCEED,
        actionTypes.LOAD_VIRTUALWHSE_STOCK_FAIL,
      ],
      endpoint: 'v1/cwm/inventory/virtualwhse/stock',
      method: 'get',
      params: { productNo, virtualWhse, whseCode },
    },
  };
}

