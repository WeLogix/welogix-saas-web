import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/sof/purchase/orders', [
  'LOAD_PURCHASE_ORDERS', 'LOAD_PURCHASE_ORDERS_SUCCEED', 'LOAD_PURCHASE_ORDERS_FAIL',
  'LOAD_ALLPOM', 'LOAD_ALLPOM_SUCCEED', 'LOAD_ALLPOM_FAIL',
  'GET_PURCHASE_ORDER', 'GET_PURCHASE_ORDER_SUCCEED', 'GET_PURCHASE_ORDER_FAIL',
  'UPDATE_PURCHASE_ORDER', 'UPDATE_PURCHASE_ORDER_SUCCEED', 'UPDATE_PURCHASE_ORDER_FAIL',
  'BATCH_DELETE_PURCHASE_ORDER', 'BATCH_DELETE_PURCHASE_ORDER_SUCCEED', 'BATCH_DELETE_PURCHASE_ORDER_FAIL',
  'BATCH_DELETE_BY_UPLOADNO', 'BATCH_DELETE_BY_UPLOADNO_SUCCEED', 'BATCH_DELETE_BY_UPLOADNO_FAIL',
  'IMPORT_PURCHASE_ORDERS', 'IMPORT_PURCHASE_ORDERS_SUCCEED', 'IMPORT_PURCHASE_ORDERS_FAIL',
]);

const initialState = {
  purchaseOrderList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  poMetaList: [],
  filter: { scenario: 'all' },
  purchaseOrder: {},
  poListLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PURCHASE_ORDERS:
      return { ...state, filter: JSON.parse(action.params.filter), poListLoading: true };
    case actionTypes.LOAD_PURCHASE_ORDERS_SUCCEED:
      return { ...state, purchaseOrderList: action.result.data, poListLoading: false };
    case actionTypes.LOAD_PURCHASE_ORDERS_FAIL:
      return { ...state, poListLoading: false };
    case actionTypes.LOAD_ALLPOM_SUCCEED:
      return { ...state, poMetaList: action.result.data };
    case actionTypes.GET_PURCHASE_ORDER_SUCCEED:
      return { ...state, purchaseOrder: action.result.data };
    case actionTypes.BATCH_DELETE_PURCHASE_ORDER_SUCCEED: {
      const { totalCount, pageSize, current } = state.purchaseOrderList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, action.data.ids.length);
      return { ...state, purchaseOrderList: { ...state.purchaseOrderList, current: currentPage } };
    }
    default:
      return state;
  }
}

export function loadPurchaseOrders({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PURCHASE_ORDERS,
        actionTypes.LOAD_PURCHASE_ORDERS_SUCCEED,
        actionTypes.LOAD_PURCHASE_ORDERS_FAIL,
      ],
      endpoint: 'v1/scof/purchase/orders',
      method: 'get',
      params: { pageSize, current, filter },
    },
  };
}

export function loadAllPoMeta({ filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALLPOM,
        actionTypes.LOAD_ALLPOM_SUCCEED,
        actionTypes.LOAD_ALLPOM_FAIL,
      ],
      endpoint: 'v1/scof/po/pometalist',
      method: 'get',
      params: { filter },
    },
  };
}


export function importPurchaseOrders(formData, file) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.IMPORT_PURCHASE_ORDERS,
        actionTypes.IMPORT_PURCHASE_ORDERS_SUCCEED,
        actionTypes.IMPORT_PURCHASE_ORDERS_FAIL,
      ],
      endpoint: 'v1/scof/purchase/orders/import',
      method: 'post',
      data: { formData, file },
    },
  };
}
export function getPurchaseOrder(poNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_PURCHASE_ORDER,
        actionTypes.GET_PURCHASE_ORDER_SUCCEED,
        actionTypes.GET_PURCHASE_ORDER_FAIL,
      ],
      endpoint: 'v1/scof/purchase/order/get',
      method: 'get',
      params: { poNo },
    },
  };
}

export function updatePurchaseOrder(id, data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PURCHASE_ORDER,
        actionTypes.UPDATE_PURCHASE_ORDER_SUCCEED,
        actionTypes.UPDATE_PURCHASE_ORDER_FAIL,
      ],
      endpoint: 'v1/scof/purchase/order/update',
      method: 'post',
      data: { id, data, contentLog },
    },
  };
}

export function batchDeletePurchaseOrders(ids) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_PURCHASE_ORDER,
        actionTypes.BATCH_DELETE_PURCHASE_ORDER_SUCCEED,
        actionTypes.BATCH_DELETE_PURCHASE_ORDER_FAIL,
      ],
      endpoint: 'v1/scof/purchase/order/batch/delete',
      method: 'post',
      data: { ids },
    },
  };
}

export function batchDeleteByUploadNo(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_BY_UPLOADNO,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_SUCCEED,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_FAIL,
      ],
      endpoint: 'v1/sof/purchase/order/batch/delete/by/uploadno',
      method: 'post',
      data: { uploadNo },
    },
  };
}
