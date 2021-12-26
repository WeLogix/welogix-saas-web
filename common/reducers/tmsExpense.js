import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/tms/expense/', [
  'EXP_LOAD', 'EXP_LOAD_SUCCEED', 'EXP_LOAD_FAIL',
  'SUBMIT_EXPENSES', 'SUBMIT_EXPENSES_SUCCEED', 'SUBMIT_EXPENSES_FAIL',
  'CONFIRM_EXPENSES', 'CONFIRM_EXPENSES_SUCCEED', 'CONFIRM_EXPENSES_FAIL',
  'REJECT_EXPENSES', 'REJECT_EXPENSES_SUCCEED', 'REJECT_EXPENSES_FAIL',
  'CURRENCY_LOAD', 'CURRENCY_LOAD_SUCCEED', 'CURRENCY_LOAD_FAIL',
  'LOAD_BUYER_SELLER_EXPENSES', 'LOAD_BUYER_SELLER_EXPENSES_SUCCEED', 'LOAD_BUYER_SELLER_EXPENSES_FAIL',
  'FEE_UPDATE', 'FEE_UPDATE_SUCCEED', 'FEE_UPDATE_FAIL',
  'FEE_DELETE', 'FEE_DELETE_SUCCEED', 'FEE_DELETE_FAIL',
  'LOAD_EXP_DETAILS', 'LOAD_EXP_DETAILS_SUCCEED', 'LOAD_EXP_DETAILS_FAIL',
  'UNBIILING_BY_BATCHUPLOAD', 'UNBIILING_BY_BATCHUPLOAD_SUCCEED', 'UNBIILING_BY_BATCHUPLOAD_FAIL',
  'INPUTQTY_CALC', 'INPUTQTY_CALC_SUCCEED', 'INPUTQTY_CALC_FAIL',
  'UPDATE_AP_FEE', 'UPDATE_AP_FEE_SUCCEED', 'UPDATE_AP_FEE_FAIL',
  'CREATE_AP_FEE', 'CREATE_AP_FEE_SUCCEED', 'CREATE_AP_FEE_FAIL',
  'TOGGLE_FEE_CAT_MODAL', 'TOGGLE_FEES_WRITE_IN_MODAL',
  'GET_EXPENSES_BILLING_GROUPFEES', 'GET_EXPENSES_BILLING_GROUPFEES_SUCCEED', 'GET_EXPENSES_BILLING_GROUPFEES_FAIL',
  'GET_BILLING_FEES_BY_BIZ_NO', 'GET_BILLING_FEES_BY_BIZ_NO_SUCCEED', 'GET_BILLING_FEES_BY_BIZ_NO_FAIL',
  'UPDATE_FEE_AND_EXPENSE', 'UPDATE_FEE_AND_EXPENSE_SUCCEED', 'UPDATE_FEE_AND_EXPENSE_FAIL',
]);

const initialState = {
  expensesLoading: false,
  expenses: {
    revenue: [],
    allcost: [],
    parameters: [],
  },
  expensesList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  recvableListFilter: {
    partnerId: 'all',
    status: 'billing',
    mode: 'receivable',
  },
  payableListFilter: {
    partnerId: 'all',
    status: 'submitted',
    mode: 'payable',
  },
  currencies: [],
  shipmtExpenses: {
    receive: {},
    pays: [],
  },
  feeCatModal: {
    visible: false,
    feeCats: [],
  },
  feesWriteInModal: {
    visible: false,
    selFeeCodes: [],
    billingFees: [],
    totalSum: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.EXP_LOAD: {
      let field;
      const listFilter = JSON.parse(action.params.filter);
      if (listFilter.mode === 'receivable') {
        field = 'recvableListFilter';
      } else {
        field = 'payableListFilter';
      }
      return { ...state, expensesLoading: true, [field]: listFilter };
    }
    case actionTypes.EXP_LOAD_SUCCEED: {
      return { ...state, expensesList: action.result.data, expensesLoading: false };
    }
    case actionTypes.CURRENCY_LOAD_SUCCEED:
      return { ...state, currencies: action.result.data };
    case actionTypes.LOAD_BUYER_SELLER_EXPENSES:
      return { ...state, expensesLoading: true };
    case actionTypes.LOAD_BUYER_SELLER_EXPENSES_SUCCEED:
      return {
        ...state, shipmtExpenses: action.result.data, expensesLoading: false,
      };
    case actionTypes.FEE_UPDATE:
    case actionTypes.UPDATE_AP_FEE:
    case actionTypes.CREATE_AP_FEE:
      return { ...state, expensesLoading: true };
    case actionTypes.FEE_UPDATE_SUCCEED:
    case actionTypes.FEE_UPDATE_FAIL:
    case actionTypes.UPDATE_AP_FEE_SUCCEED:
    case actionTypes.UPDATE_AP_FEE_FAIL:
    case actionTypes.CREATE_AP_FEE_SUCCEED:
    case actionTypes.CREATE_AP_FEE_FAIL:
      return { ...state, expensesLoading: false };
    case actionTypes.TOGGLE_FEE_CAT_MODAL:
      return {
        ...state,
        feeCatModal: {
          ...state.feeCatModal,
          visible: action.visible,
        },
      };
    case actionTypes.TOGGLE_FEES_WRITE_IN_MODAL:
      return {
        ...state,
        feesWriteInModal: {
          visible: action.data.visible,
          selFeeCodes: action.data.selFeeCodes,
          billingFees: [],
        },
      };
    case actionTypes.GET_EXPENSES_BILLING_GROUPFEES_SUCCEED:
      return {
        ...state,
        feeCatModal: {
          ...state.feeCatModal,
          feeCats: action.result.data,
        },
      };
    case actionTypes.GET_BILLING_FEES_BY_BIZ_NO_SUCCEED:
      return {
        ...state,
        feesWriteInModal: {
          ...state.feesWriteInModal,
          billingFees: state.feesWriteInModal.billingFees.concat(action.result.data.fees),
          totalSum: action.result.data.totalSum,
        },
      };
    default:
      return state;
  }
}
//
export function loadExpenses(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXP_LOAD,
        actionTypes.EXP_LOAD_SUCCEED,
        actionTypes.EXP_LOAD_FAIL,
      ],
      endpoint: 'v1/tms/billing/expense',
      method: 'get',
      params,
    },
  };
}
//
export function submitExpenses(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_EXPENSES,
        actionTypes.SUBMIT_EXPENSES_SUCCEED,
        actionTypes.SUBMIT_EXPENSES_FAIL,
      ],
      endpoint: 'v1/tms/billing/expense/submit',
      method: 'post',
      data,
    },
  };
}

export function confirmExpenses(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CONFIRM_EXPENSES,
        actionTypes.CONFIRM_EXPENSES_SUCCEED,
        actionTypes.CONFIRM_EXPENSES_FAIL,
      ],
      endpoint: 'v1/tms/billing/expense/confirm',
      method: 'post',
      data,
    },
  };
}

export function rejectExpenses(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REJECT_EXPENSES,
        actionTypes.REJECT_EXPENSES_SUCCEED,
        actionTypes.REJECT_EXPENSES_FAIL,
      ],
      endpoint: 'v1/tms/billing/expense/reject',
      method: 'post',
      data,
    },
  };
}

export function loadCurrencies() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CURRENCY_LOAD,
        actionTypes.CURRENCY_LOAD_SUCCEED,
        actionTypes.CURRENCY_LOAD_FAIL,
      ],
      endpoint: 'v1/bss/exchange/currencies',
      method: 'get',
    },
  };
}

export function loadBuyerSellerExpenses({ shipmtNo }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BUYER_SELLER_EXPENSES,
        actionTypes.LOAD_BUYER_SELLER_EXPENSES_SUCCEED,
        actionTypes.LOAD_BUYER_SELLER_EXPENSES_FAIL,
      ],
      endpoint: 'v1/tms/billing/shipmt/buyer/seller/expense',
      method: 'get',
      params: { shipmtNo },
    },
  };
}

export function getExpenseDetails(expenseInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_EXP_DETAILS,
        actionTypes.LOAD_EXP_DETAILS_SUCCEED,
        actionTypes.LOAD_EXP_DETAILS_FAIL,
      ],
      endpoint: 'v1/tms/billing/expense/fees',
      method: 'get',
      params: expenseInfo,
    },
  };
}


export function updateFee(data, expenseNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_UPDATE,
        actionTypes.FEE_UPDATE_SUCCEED,
        actionTypes.FEE_UPDATE_FAIL,
      ],
      endpoint: 'v1/tms/expense/fee/update',
      method: 'post',
      data: {
        data, expenseNo,
      },
    },
  };
}

export function deleteFee(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_DELETE,
        actionTypes.FEE_DELETE_SUCCEED,
        actionTypes.FEE_DELETE_FAIL,
      ],
      endpoint: 'v1/tms/expense/fee/delete',
      method: 'post',
      data: { id },
    },
  };
}
//
export function unbillingByBatchupload(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UNBIILING_BY_BATCHUPLOAD,
        actionTypes.UNBIILING_BY_BATCHUPLOAD_SUCCEED,
        actionTypes.UNBIILING_BY_BATCHUPLOAD_FAIL,
      ],
      endpoint: 'v1/tms/expense/unbilling/by/batchupload',
      method: 'post',
      data: { uploadNo },
    },
  };
}

export function updateFeeByInputQty(id, value) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INPUTQTY_CALC,
        actionTypes.INPUTQTY_CALC_SUCCEED,
        actionTypes.INPUTQTY_CALC_FAIL,
      ],
      endpoint: 'v1/tms/expense/fee/calc/inputqty',
      method: 'post',
      data: { id, value },
    },
  };
}

export function updateAPFee(advFee, expenseNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_AP_FEE,
        actionTypes.UPDATE_AP_FEE_SUCCEED,
        actionTypes.UPDATE_AP_FEE_FAIL,
      ],
      endpoint: 'v1/tms/expense/ap/fee/update',
      method: 'post',
      data: {
        advFee, expenseNo,
      },
    },
  };
}

export function copyAPFee(advFee, expenseNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_AP_FEE,
        actionTypes.CREATE_AP_FEE_SUCCEED,
        actionTypes.CREATE_AP_FEE_FAIL,
      ],
      endpoint: 'v1/tms/expense/ap/fee/copy',
      method: 'post',
      data: {
        advFee, expenseNo,
      },
    },
  };
}

//
export function toggleFeeSelectModal(visible) {
  return {
    type: actionTypes.TOGGLE_FEE_CAT_MODAL,
    visible,
  };
}
//
export function toggleFeesWriteInModal(visible, selFeeCodes = []) {
  return {
    type: actionTypes.TOGGLE_FEES_WRITE_IN_MODAL,
    data: { visible, selFeeCodes },
  };
}

export function getExpenseBillingGroupFees(type) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_EXPENSES_BILLING_GROUPFEES,
        actionTypes.GET_EXPENSES_BILLING_GROUPFEES_SUCCEED,
        actionTypes.GET_EXPENSES_BILLING_GROUPFEES_FAIL,
      ],
      endpoint: 'v1/tms/expense/billing/groupfees',
      method: 'get',
      params: { type },
    },
  };
}

export function getBillingFeesByBizNo(bizNo, feeCodes, type, bizType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BILLING_FEES_BY_BIZ_NO,
        actionTypes.GET_BILLING_FEES_BY_BIZ_NO_SUCCEED,
        actionTypes.GET_BILLING_FEES_BY_BIZ_NO_FAIL,
      ],
      endpoint: 'v1/tms/expense/billing/fees/get/by/bizno',
      method: 'post',
      data: {
        bizNo,
        feeCodes,
        type,
        bizType,
      },
    },
  };
}

export function updateLineFreight(dispId, update) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_FEE_AND_EXPENSE,
        actionTypes.UPDATE_FEE_AND_EXPENSE_SUCCEED,
        actionTypes.UPDATE_FEE_AND_EXPENSE_FAIL,
      ],
      endpoint: 'v1/tms/expense/updateLineFreight',
      method: 'post',
      data: { dispId, update },
    },
  };
}
