import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/payable/', [
  'TOGGLE_SETTLEMENT_MODAL', 'TOGGLE_PAYMENT_RECEIPT_MODAL',
  'SET_SETTLEMENT_DETAILS', 'SET_SETTLE_LIST_FILTER',
  'BIZORDER_SEARCH', 'BIZORDER_SEARCH_SUCCEED', 'BIZORDER_SEARCH_FAIL',
  'CREATE_SETTLEMENT', 'CREATE_SETTLEMENT_SUCCEED', 'CREATE_SETTLEMENT_FAIL',
  'LOAD_SETTLEMENTS', 'LOAD_SETTLEMENTS_SUCCEED', 'LOAD_SETTLEMENTS_FAIL',
  'DELETE_SETTLEMENT', 'DELETE_SETTLEMENT_SUCCEED', 'DELETE_SETTLEMENT_FAIL',
  'LOAD_BSS_FEES', 'LOAD_BSS_FEES_SUCCEED', 'LOAD_BSS_FEES_FAIL',
  'LOAD_TRANSFER', 'LOAD_TRANSFER_SUCCEED', 'LOAD_TRANSFER_FAIL',
  'GET_SETTLEMENT', 'GET_SETTLEMENT_SUCCEED', 'GET_SETTLEMENT_FAIL',
  'UPDATE_SETTLEMENT', 'UPDATE_SETTLEMENT_SUCCEED', 'UPDATE_SETTLEMENT_FAIL',
]);

const initialState = {
  settlementList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  bssFeeList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  transferList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
    status: 'open',
    invoice_status: [],
    payment_status: [],
  },
  settlementModal: {
    visible: false,
    record: {},
  },
  paymentReceiptModal: {
    visible: false,
  },
  reload: false,
  loading: false,
  settlementDetails: [{ feeIndex: 0 }],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SETTLEMENT_MODAL:
      return {
        ...state,
        settlementModal: {
          ...state.settlementModal,
          visible: action.data.visible,
          record: action.data.record,
        },
      };
    case actionTypes.TOGGLE_PAYMENT_RECEIPT_MODAL:
      return {
        ...state,
        paymentReceiptModal: { ...state.paymentReceiptModal, visible: action.data },
      };
    case actionTypes.SET_SETTLEMENT_DETAILS:
      return {
        ...state,
        settlementDetails: action.data.settlementDetails,
      };
    case actionTypes.LOAD_SETTLEMENTS:
      return {
        ...state,
        listFilter: JSON.parse(action.params.filter),
        reload: false,
        loading: true,
      };
    case actionTypes.LOAD_SETTLEMENTS_SUCCEED:
      return {
        ...state,
        settlementList: { ...state.settlementList, ...action.result.data },
        loading: false,
      };
    case actionTypes.LOAD_SETTLEMENTS_FAIL:
      return { ...state, loading: false };
    case actionTypes.CREATE_SETTLEMENT_SUCCEED:
      return { ...state, reload: true };
    case actionTypes.DELETE_SETTLEMENT_SUCCEED:
      return { ...state, reload: true };
    case actionTypes.SET_SETTLE_LIST_FILTER:
      return { ...state, reload: true, listFilter: action.data.filter };
    case actionTypes.LOAD_BSS_FEES:
      return {
        ...state,
        listFilter: JSON.parse(action.params.filter),
        reload: false,
        loading: true,
      };
    case actionTypes.LOAD_BSS_FEES_SUCCEED:
      return {
        ...state,
        bssFeeList: { ...state.bssFeeList, ...action.result.data },
        loading: false,
      };
    case actionTypes.LOAD_BSS_FEES_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_TRANSFER:
      return {
        ...state,
        listFilter: JSON.parse(action.params.filter),
        reload: false,
        loading: true,
      };
    case actionTypes.LOAD_TRANSFER_SUCCEED:
      return {
        ...state,
        transferList: { ...state.transferList, ...action.result.data },
        loading: false,
      };
    case actionTypes.LOAD_TRANSFER_FAIL:
      return { ...state, loading: false };
    case actionTypes.GET_SETTLEMENT_SUCCEED:
      return {
        ...state,
        settlementDetails: action.result.data.bssFees.map((detail, index) =>
          ({ ...detail, feeIndex: index })),
      };
    case actionTypes.UPDATE_SETTLEMENT_SUCCEED:
      return { ...state, reload: true };
    default:
      return state;
  }
}

export function toggleSettlementModal(visible, record = {}) {
  return {
    type: actionTypes.TOGGLE_SETTLEMENT_MODAL,
    data: { visible, record },
  };
}

export function setSettlementDetails(settlementDetails) {
  return {
    type: actionTypes.SET_SETTLEMENT_DETAILS,
    data: { settlementDetails },
  };
}

export function loadPaymentBizOrder(bizNo, bizType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BIZORDER_SEARCH,
        actionTypes.BIZORDER_SEARCH_SUCCEED,
        actionTypes.BIZORDER_SEARCH_FAIL,
      ],
      endpoint: 'v1/bss/settlement/bizorder',
      method: 'post',
      data: { bizNo, bizType },
    },
  };
}

export function createSettlement(settlementHead, settlementDetails) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_SETTLEMENT,
        actionTypes.CREATE_SETTLEMENT_SUCCEED,
        actionTypes.CREATE_SETTLEMENT_FAIL,
      ],
      endpoint: 'v1/bss/settlement/newsettle',
      method: 'post',
      data: { settlementHead, settlementDetails },
    },
  };
}

export function loadSettlements({ filter, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SETTLEMENTS,
        actionTypes.LOAD_SETTLEMENTS_SUCCEED,
        actionTypes.LOAD_SETTLEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/settlements',
      method: 'get',
      params: { filter: JSON.stringify(filter), current, pageSize },
    },
  };
}

export function deleteSettlement(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_SETTLEMENT,
        actionTypes.DELETE_SETTLEMENT_SUCCEED,
        actionTypes.DELETE_SETTLEMENT_FAIL,
      ],
      endpoint: 'v1/bss/settlement/deletesettle',
      method: 'post',
      data: { id },
    },
  };
}

export function setSettleListFilter(filter) {
  return {
    type: actionTypes.SET_SETTLE_LIST_FILTER,
    data: { filter },
  };
}

export function loadBssFees({ filter, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BSS_FEES,
        actionTypes.LOAD_BSS_FEES_SUCCEED,
        actionTypes.LOAD_BSS_FEES_FAIL,
      ],
      endpoint: 'v1/bss/fees',
      method: 'get',
      params: { filter: JSON.stringify(filter), current, pageSize },
    },
  };
}

export function loadTransfer({ filter, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRANSFER,
        actionTypes.LOAD_TRANSFER_SUCCEED,
        actionTypes.LOAD_TRANSFER_FAIL,
      ],
      endpoint: 'v1/bss/transfer',
      method: 'get',
      params: { filter: JSON.stringify(filter), current, pageSize },
    },
  };
}

export function getSettlement(settlementNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SETTLEMENT,
        actionTypes.GET_SETTLEMENT_SUCCEED,
        actionTypes.GET_SETTLEMENT_FAIL,
      ],
      endpoint: 'v1/bss/settlement',
      method: 'get',
      params: { settlementNo },
    },
  };
}

export function updateSettlement(settlementNo, settlementHead, settlementDetails) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SETTLEMENT,
        actionTypes.UPDATE_SETTLEMENT_SUCCEED,
        actionTypes.UPDATE_SETTLEMENT_FAIL,
      ],
      endpoint: 'v1/bss/settlement/updsettle',
      method: 'post',
      data: { settlementNo, settlementHead, settlementDetails },
    },
  };
}
