import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/payment/', [
  'TOGGLE_PAYMENT_REQUEST_MODAL', 'TOGGLE_PAYMENT_RECEIPT_MODAL',
  'LOAD_PAYMENTS', 'LOAD_PAYMENTS_SUCCEED', 'LOAD_PAYMENTS_FAIL',
  'CREATE_PAYMENTS', 'CREATE_PAYMENTS_SUCCEED', 'CREATE_PAYMENTS_FAIL',
  'SET_PAYMENT_DETAILS', 'SET_SETTLEMENTS',
  'GET_SETTLEMENT', 'GET_SETTLEMENT_SUCCEED', 'GET_SETTLEMENT_FAIL',
  'DELETE_PAYMENT', 'DELETE_PAYMENT_SUCCEED', 'DELETE_PAYMENT_FAIL',
  'GET_PAYMENT', 'GET_PAYMENT_SUCCEED', 'GET_PAYMENT_FAIL',
  'LOAD_PAYING_LIST', 'LOAD_PAYING_LIST_SUCCEED', 'LOAD_PAYING_LIST_FAIL',
  'CONFIRM_PAYMENT', 'CONFIRM_PAYMENT_SUCCEED', 'CONFIRM_PAYMENT_FAIL',
  'UPDATE_PAYMENT', 'UPDATE_PAYMENT_SUCCEED', 'UPDATE_PAYMENT_FAIL',
  'UPDATE_PAYMENT_HEAD', 'UPDATE_PAYMENT_HEAD_SUCCEED', 'UPDATE_PAYMENT_HEAD_FAIL',
]);

const initialState = {
  applyListFilter: {
    status: 'pending',
  },
  applyList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    loading: false,
    data: [],
  },
  claimListFilter: {
    status: 'pending',
  },
  claimList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    loading: false,
    data: [{ id: 1 }],
  },
  payingListFilter: {
    status: 'pending',
  },
  payingList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    loading: false,
    data: [],
  },
  paymentRequestModal: {
    visible: false,
    mode: 'view',
    record: {},
  },
  incomingListFilter: {
    status: 'pending',
  },
  incomingList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    loading: false,
    data: [{ id: 1 }],
  },
  paymentReceiptModal: {
    visible: false,
    record: {},
  },
  paymentPayModal: {
    visible: false,
  },
  paymentDetails: [{ feeIndex: 0 }],
  settlements: [{ settlemtIndex: 0 }],
  reload: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_PAYMENT_REQUEST_MODAL:
      return {
        ...state,
        paymentRequestModal: {
          ...state.paymentRequestModal,
          visible: action.data.visible,
          mode: action.data.mode,
          record: action.data.record,
        },
      };
    case actionTypes.TOGGLE_PAYMENT_RECEIPT_MODAL:
      return {
        ...state,
        paymentReceiptModal: { ...state.paymentReceiptModal, visible: action.data },
      };
    case actionTypes.TOGGLE_PAYMENT_PAY_MODAL:
      return {
        ...state,
        paymentPayModal: { ...state.paymentPayModal, visible: action.data },
      };
    case actionTypes.LOAD_PAYMENTS:
      return {
        ...state,
        applyListFilter: JSON.parse(action.params.filter),
        applyList: { ...state.applyList, loading: true },
        reload: false,
      };
    case actionTypes.LOAD_PAYMENTS_SUCCEED:
      return {
        ...state,
        applyList: { ...state.applyList, ...action.result.data, loading: false },
      };
    case actionTypes.LOAD_PAYMENTS_FAIL:
      return { ...state, applyList: { ...state.applyList, loading: false } };
    case actionTypes.SET_PAYMENT_DETAILS:
      return {
        ...state,
        paymentDetails: action.data.paymentDetails,
      };
    case actionTypes.GET_SETTLEMENT_SUCCEED: {
      const settlements = [...state.settlements];
      let paymentDetails = [...state.paymentDetails].filter(detail => detail.settlement_no);
      const record = settlements[action.params.settlemtIndex];
      settlements[action.params.settlemtIndex] = action.result.data.settlement;
      if (record.settlement_no) {
        paymentDetails = paymentDetails.filter(detail =>
          detail.settlement_no !== record.settlement_no);
      }
      paymentDetails = paymentDetails.concat(action.result.data.bssFees);
      return {
        ...state,
        settlements: settlements.map((settlement, index) =>
          ({ ...settlement, settlemtIndex: index })),
        paymentDetails: paymentDetails.map((detail, index) =>
          ({
            ...detail,
            feeIndex: index,
            biz_type: detail.biz_type || action.result.data.settlement.biz_type,
          })),
      };
    }
    case actionTypes.SET_SETTLEMENTS: {
      return {
        ...state,
        settlements: action.data.settlements,
      };
    }
    case actionTypes.GET_PAYMENT_SUCCEED:
      return {
        ...state,
        settlements: action.result.data.settlements.map((settlement, index) =>
          ({ ...settlement, settlemtIndex: index })),
        paymentDetails: action.result.data.bssFees.map((detail, index) =>
          ({ ...detail, feeIndex: index })),
      };
    case actionTypes.LOAD_PAYING_LIST:
      return {
        ...state,
        payingListFilter: JSON.parse(action.params.filter),
        payingList: { ...state.payingList, loading: true },
        reload: false,
      };
    case actionTypes.LOAD_PAYING_LIST_SUCCEED:
      return {
        ...state,
        payingList: { ...state.payingList, ...action.result.data, loading: false },
      };
    case actionTypes.LOAD_PAYING_LIST_FAIL:
      return { ...state, payingList: { ...state.payingList, loading: false } };
    case actionTypes.CREATE_PAYMENTS_SUCCEED:
    case actionTypes.DELETE_PAYMENT_SUCCEED:
    case actionTypes.UPDATE_PAYMENT_HEAD_SUCCEED:
    case actionTypes.CONFIRM_PAYMENT_SUCCEED:
      return { ...state, reload: true };
    default:
      return state;
  }
}

export function togglePaymentRequestModal(visible, mode, record = {}) {
  return {
    type: actionTypes.TOGGLE_PAYMENT_REQUEST_MODAL,
    data: { visible, mode, record },
  };
}

export function togglePaymentReceiptModal(visible) {
  return {
    type: actionTypes.TOGGLE_PAYMENT_RECEIPT_MODAL,
    data: visible,
  };
}

export function togglePaymentPayModal(visible) {
  return {
    type: actionTypes.TOGGLE_PAYMENT_PAY_MODAL,
    data: visible,
  };
}

export function loadPayments({ filter, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PAYMENTS,
        actionTypes.LOAD_PAYMENTS_SUCCEED,
        actionTypes.LOAD_PAYMENTS_FAIL,
      ],
      endpoint: 'v1/bss/payments',
      method: 'get',
      params: { filter: JSON.stringify(filter), current, pageSize },
    },
  };
}

export function setPaymentDetails(paymentDetails) {
  return {
    type: actionTypes.SET_PAYMENT_DETAILS,
    data: { paymentDetails },
  };
}

export function createPayment({ paymentHead, paymentDetails, settlenos }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_PAYMENTS,
        actionTypes.CREATE_PAYMENTS_SUCCEED,
        actionTypes.CREATE_PAYMENTS_FAIL,
      ],
      endpoint: 'v1/bss/payment/newpayment',
      method: 'post',
      data: { paymentHead, paymentDetails, settlenos },
    },
  };
}

export function getSettlement(settlementNo, settlemtIndex) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SETTLEMENT,
        actionTypes.GET_SETTLEMENT_SUCCEED,
        actionTypes.GET_SETTLEMENT_FAIL,
      ],
      endpoint: 'v1/bss/settlement',
      method: 'get',
      params: { settlementNo, settlemtIndex },
    },
  };
}

export function setSettlements(settlements) {
  return {
    type: actionTypes.SET_SETTLEMENTS,
    data: { settlements },
  };
}

export function deletePayment(paymentNo, paymentType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_PAYMENT,
        actionTypes.DELETE_PAYMENT_SUCCEED,
        actionTypes.DELETE_PAYMENT_FAIL,
      ],
      endpoint: 'v1/bss/payment/delpayment',
      method: 'post',
      data: { paymentNo, paymentType },
    },
  };
}

export function getPayment(paymentNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_PAYMENT,
        actionTypes.GET_PAYMENT_SUCCEED,
        actionTypes.GET_PAYMENT_FAIL,
      ],
      endpoint: 'v1/bss/payment',
      method: 'get',
      params: { paymentNo },
    },
  };
}

export function updatePaymentHead(id, putPayObj) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PAYMENT_HEAD,
        actionTypes.UPDATE_PAYMENT_HEAD_SUCCEED,
        actionTypes.UPDATE_PAYMENT_HEAD_FAIL,
      ],
      endpoint: 'v1/bss/payment/putpaymenthead',
      method: 'post',
      data: { id, putPayObj },
    },
  };
}

export function loadPayingList({ filter, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PAYING_LIST,
        actionTypes.LOAD_PAYING_LIST_SUCCEED,
        actionTypes.LOAD_PAYING_LIST_FAIL,
      ],
      endpoint: 'v1/bss/payment/paylist',
      method: 'get',
      params: { filter: JSON.stringify(filter), current, pageSize },
    },
  };
}

export function confirmPayment(paymentNo, paymentType, paymentInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CONFIRM_PAYMENT,
        actionTypes.CONFIRM_PAYMENT_SUCCEED,
        actionTypes.CONFIRM_PAYMENT_FAIL,
      ],
      endpoint: 'v1/bss/payment/confirmpayment',
      method: 'post',
      data: { paymentNo, paymentType, paymentInfo },
    },
  };
}

export function updatePayment({ newPaymentInfo, paymentDetails, settlenos }, paymentId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PAYMENT,
        actionTypes.UPDATE_PAYMENT_SUCCEED,
        actionTypes.UPDATE_PAYMENT_FAIL,
      ],
      endpoint: 'v1/bss/payment/updatepayment',
      method: 'post',
      data: {
        paymentId, newPaymentInfo, paymentDetails, settlenos,
      },
    },
  };
}
