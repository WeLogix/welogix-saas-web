import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/delegation/', [
  'EXP_PANE_LOAD', 'EXP_PANE_LOAD_SUCCEED', 'EXP_PANE_LOAD_FAIL',
  'DECL_EXPS_LOAD', 'DECL_EXPS_LOAD_SUCCEED', 'DECL_EXPS_LOAD_FAIL',
  'EXP_LOAD', 'EXP_LOAD_SUCCEED', 'EXP_LOAD_FAIL',
  'SUBMIT_EXPENSES', 'SUBMIT_EXPENSES_SUCCEED', 'SUBMIT_EXPENSES_FAIL',
  'CONFIRM_EXPENSES', 'CONFIRM_EXPENSES_SUCCEED', 'CONFIRM_EXPENSES_FAIL',
  'REJECT_EXPENSES', 'REJECT_EXPENSES_SUCCEED', 'REJECT_EXPENSES_FAIL',
  'CLOSE_ADVFEE_MODAL',
  // 'CLOSE_IN_MODAL', 'OPEN_IN_MODAL',
  'CURRENCY_LOAD', 'CURRENCY_LOAD_SUCCEED', 'CURRENCY_LOAD_FAIL',
  // 'LOAD_SUBTABLE', 'LOAD_SUBTABLE_SUCCEED', 'LOAD_SUBTABLE_FAIL',
  'CLOSE_MARK_MODAL', 'OPEN_MARK_MODAL',
  // 'MARK_SAVE', 'MARK_SAVE_SUCCEED', 'MARK_SAVE_FAIL',
  'CLOSE_CERT_MODAL', 'OPEN_CERT_MODAL',
  // 'EXP_CERT_LOAD', 'EXP_CERT_LOAD_SUCCEED', 'EXP_CERT_LOAD_FAIL',
  'CERT_FEES_SAVE', 'CERT_FEES_SAVE_SUCCEED', 'CERT_FEES_SAVE_FAIL',
  // 'OPEN_DECL_INPUT_MODAL', 'CLOSE_DECL_INPUT_MODAL',
  'LOAD_ADVPARTIES', 'LOAD_ADVPARTIES_SUCCEED', 'LOAD_ADVPARTIES_FAIL',
  'LOAD_BUYER_SELLER_EXPENSES', 'LOAD_BUYER_SELLER_EXPENSES_SUCCEED', 'LOAD_BUYER_SELLER_EXPENSES_FAIL',
  /*
  'SHOW_PREVIEWER', 'SHOW_PREVIEWER_SUCCEED', 'SHOW_PREVIEWER_FAILED',
  'HIDE_PREVIEWER', */
  'LOAD_DELGADVFEES', 'LOAD_DELGADVFEES_SUCCEED', 'LOAD_DELGADVFEES_FAIL',
  'COMPUTE_DELGADVFEES', 'COMPUTE_DELGADVFEES_SUCCEED', 'COMPUTE_DELGADVFEES_FAIL',
  'LOAD_DECLADVPARTIES', 'LOAD_DECLADVPARTIES_SUCCEED', 'LOAD_DECLADVPARTIES_FAIL',
  'COMPUTE_DECLADVFEES', 'COMPUTE_DECLADVFEES_SUCCEED', 'COMPUTE_DECLADVFEES_FAIL',
  'CERT_PANEL_LOAD', 'CERT_PANEL_LOAD_SUCCEED', 'CERT_PANEL_LOAD_FAIL',
  'SET_ADV_MODAL_VISIBLE', 'SET_ADV_TEMP_MODAL_VISIBLE',
  'ADV_EXP_IMPORT', 'ADV_EXP_IMPORT_SUCCEED', 'ADV_EXP_IMPORT_FAIL',
  'SAVE_IMPT_ADVFEES', 'SAVE_IMPT_ADVFEES_SUCCEED', 'SAVE_IMPT_ADVFEES_FAIL',
  'FEE_UPDATE', 'FEE_UPDATE_SUCCEED', 'FEE_UPDATE_FAIL',
  'FEE_DELETE', 'FEE_DELETE_SUCCEED', 'FEE_DELETE_FAIL',
  'LOAD_EXP_DETAILS', 'LOAD_EXP_DETAILS_SUCCEED', 'LOAD_EXP_DETAILS_FAIL',
  'EXP_TOTAL_LOAD', 'EXP_TOTAL_LOAD_SUCCEED', 'EXP_TOTAL_LOAD_FAIL',
  'UNBIILING_BY_BATCHUPLOAD', 'UNBIILING_BY_BATCHUPLOAD_SUCCEED', 'UNBIILING_BY_BATCHUPLOAD_FAIL',
  'INPUTQTY_CALC', 'INPUTQTY_CALC_SUCCEED', 'INPUTQTY_CALC_FAIL',
  'UPDATE_AP_FEE', 'UPDATE_AP_FEE_SUCCEED', 'UPDATE_AP_FEE_FAIL',
  'CREATE_AP_FEE', 'CREATE_AP_FEE_SUCCEED', 'CREATE_AP_FEE_FAIL',
  'UPDATE_EVENT_FEE_CLEAR', 'TOGGLE_FEE_CAT_MODAL', 'TOGGLE_FEES_WRITE_IN_MODAL',
  'GET_EXPENSES_BILLING_GROUPFEES', 'GET_EXPENSES_BILLING_GROUPFEES_SUCCEED', 'GET_EXPENSES_BILLING_GROUPFEES_FAIL',
  'GET_BILLING_FEES_BY_BIZ_NO', 'GET_BILLING_FEES_BY_BIZ_NO_SUCCEED', 'GET_BILLING_FEES_BY_BIZ_NO_FAIL',
  'TOGGLE_QUOTE_SWITCH_MODAL',
  'GET_PARTNER_QUOTES', 'GET_PARTNER_QUOTES_SUCCEED', 'GET_PARTNER_QUOTES_FAIL',
  'SWITCH_EXP_QUOTE', 'SWITCH_EXP_QUOTE_SUCCEED', 'SWITCH_EXP_QUOTE_FAIL',
  'CHANGE_LIST_FILTER',
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
  wholeExpenseList: [],
  declexps: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
    fields: [],
  },
  sorter: {},
  recvableListFilter: {
    status: 'billing',
    mode: 'receivable',
    dateSearchField: 'created_date',
  },
  payableListFilter: {
    status: 'submitted',
    mode: 'payable',
    dateSearchField: 'created_date',
  },
  // showInputModal: false,
  currencies: [],
  expFeesMap: {},
  // showMarkModal: false,
  saved: false,
  // showCertModal: false,
  // certExp: {},
  // declInModal: {
  // },
  // declAdvanceParties: [],
  showDeclInputModal: false,
  advanceParties: [],
  /*
  previewer: {
    customs: {
      provider: '',
      data: [],
    },
    ciq: {
      provider: '',
      data: [],
    },
    cert: {
      provider: '',
      data: [],
    },
    visible: false,
  }, */
  advanceFeeModal: {
    visible: false,
    fees: [],
  },
  /* certPanel: {
    fees: [],
  }, */
  visibleAdvModal: false,
  advImport: {
    tableTitle: { title: [], dataIndex: [] },
    statistics: {},
    advbodies: [],
    ptAdvbodies: [],
    quoteInv: null,
  },
  advImportParams: {
    importMode: 'pay',
    partner: {},
    calculateAll: false,
  },
  advImpTempVisible: false,
  delgExpenses: {
    receive: {},
    pays: [],
  },
  bills: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  addSpeModal: {
    visible: false,
    feeCodes: [],
    expenseNo: '',
    expenseType: '',
  },
  expenseReloadType: '',
  eventFeeClear: {
    status: false,
    events: [],
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
  quoteSwitchModal: {
    visible: false,
    expenseNo: '',
    quotes: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.EXP_PANE_LOAD:
      return { ...state, expenses: initialState.expenses, expensesLoading: true };
    case actionTypes.EXP_PANE_LOAD_FAIL:
      return { ...state, expenses: initialState.expenses, expensesLoading: false };
    case actionTypes.EXP_PANE_LOAD_SUCCEED:
      return {
        ...state,
        expenses: { ...state.expenses, ...action.result.data },
        expensesLoading: false,
      };
    case actionTypes.EXP_LOAD: {
      let field;
      const listFilter = JSON.parse(action.params.filter);
      const sorter = JSON.parse(action.params.sorter);
      if (listFilter.mode === 'receivable') {
        field = 'recvableListFilter';
      } else {
        field = 'payableListFilter';
      }
      return {
        ...state, expensesLoading: true, [field]: listFilter, sorter,
      };
    }
    case actionTypes.EXP_LOAD_SUCCEED: {
      return { ...state, expensesList: action.result.data, expensesLoading: false };
    }
    case actionTypes.EXP_TOTAL_LOAD: {
      return { ...state, wholeExpenseList: [] };
    }
    case actionTypes.EXP_TOTAL_LOAD_SUCCEED: {
      return { ...state, wholeExpenseList: action.result.data };
    }
    case actionTypes.DECL_EXPS_LOAD:
      return { ...state, declexps: { ...state.declexps, loading: true }, saved: false };
    case actionTypes.DECL_EXPS_LOAD_SUCCEED:
      return { ...state, declexps: { ...state.declexps, ...action.result.data, loading: false } };
    case actionTypes.CURRENCY_LOAD_SUCCEED:
      return { ...state, currencies: action.result.data };
    case actionTypes.CLOSE_IN_MODAL:
      return { ...state, showInputModal: false };
      /*
    case actionTypes.OPEN_IN_MODAL:
      return { ...state, showInputModal: true };
    case actionTypes.CLOSE_MARK_MODAL:
      return { ...state, showMarkModal: false };
    case actionTypes.OPEN_MARK_MODAL:
      return { ...state, showMarkModal: true };
    case actionTypes.CLOSE_CERT_MODAL:
      return { ...state, showCertModal: false };
    case actionTypes.OPEN_CERT_MODAL:
      return { ...state, showCertModal: true };
    case actionTypes.LOAD_SUBTABLE: {
      const expFeesMap = { ...state.expFeesMap };
      expFeesMap[action.params.delgNo] = {};
      expFeesMap[action.params.delgNo].loading = true;
      return { ...state, expFeesMap };
    }
    case actionTypes.LOAD_SUBTABLE_SUCCEED: {
      const expFeesMap = { ...state.expFeesMap };
      expFeesMap[action.params.delgNo] = action.result.data;
      expFeesMap[action.params.delgNo].loading = false;
      return { ...state, expFeesMap };
    }
    case actionTypes.LOAD_SUBTABLE_FAIL: {
      const expFeesMap = { ...state.expFeesMap };
      expFeesMap[action.params.delgNo] = {};
      expFeesMap[action.params.delgNo].loading = false;
      return { ...state, expFeesMap };
    }
    case actionTypes.MARK_SAVE_SUCCEED:
      return { ...state, saved: true };
    case actionTypes.EXP_CERT_LOAD_SUCCEED:
      return { ...state, certExp: action.result.data };
    case actionTypes.OPEN_DECL_INPUT_MODAL:
      return { ...state, declInModal: action.data, showDeclInputModal: true };
    case actionTypes.CLOSE_DECL_INPUT_MODAL:
      return { ...state, declInModal: initialState.declInModal, showDeclInputModal: false };
    */
    case actionTypes.CLOSE_ADVFEE_MODAL:
      return { ...state, advanceFeeModal: { ...state.advanceFeeModal, visible: false } };
    case actionTypes.LOAD_ADVPARTIES_SUCCEED:
      return {
        ...state,
        advanceParties: action.result.data,
        advanceFeeModal: {
          ...state.advanceFeeModal,
          visible: true,
          direction: action.params.direction,
          delg_no: action.params.delgNo,
        },
      };
      /*
    case actionTypes.SHOW_PREVIEWER:
      return { ...state, previewer: {
        ...state.previewer,
        visible: action.visible } };
    case actionTypes.SHOW_PREVIEWER_SUCCEED:
      return { ...state, previewer: {
        ...state.previewer,
        visible: action.visible,
        ...action.result.data } };
    case actionTypes.HIDE_PREVIEWER:
      return { ...state, previewer: { ...state.previewer, visible: action.visible } };
      */
    case actionTypes.LOAD_BUYER_SELLER_EXPENSES:
      return { ...state, expensesLoading: true };
    case actionTypes.LOAD_BUYER_SELLER_EXPENSES_SUCCEED:
      return {
        ...state, delgExpenses: action.result.data, expensesLoading: false,
      };
    case actionTypes.LOAD_EXPS_TABS_FAIL:
      return { ...state, expensesLoading: false };
    case actionTypes.LOAD_DELGADVFEES_SUCCEED:
      return { ...state, advanceFeeModal: { ...state.advanceFeeModal, fees: action.result.data } };
    case actionTypes.COMPUTE_DELGADVFEES_SUCCEED:
      return { ...state, saved: true };
    case actionTypes.LOAD_DECLADVPARTIES_SUCCEED:
      return { ...state, declAdvanceParties: action.result.data };
    case actionTypes.COMPUTE_DECLADVFEES_SUCCEED:
      return { ...state, saved: true };
    case actionTypes.CERT_PANEL_LOAD_SUCCEED:
      return { ...state, certPanel: action.result.data };
    case actionTypes.SET_ADV_MODAL_VISIBLE:
      return { ...state, visibleAdvModal: action.data };
    case actionTypes.ADV_EXP_IMPORT:
      return { ...state, advImportParams: action.payload };
    case actionTypes.ADV_EXP_IMPORT_SUCCEED:
      return { ...state, advImport: action.result.data };
    case actionTypes.SET_ADV_TEMP_MODAL_VISIBLE:
      return { ...state, advImpTempVisible: action.data };
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
    case actionTypes.LOAD_EXP_DETAILS:
      return { ...state, expenseReloadType: '' };
    case actionTypes.UPDATE_EVENT_FEE_CLEAR: {
      return {
        ...state,
        eventFeeClear: {
          status: action.data.status,
          events: action.data.events,
        },
      };
    }
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
    case actionTypes.TOGGLE_QUOTE_SWITCH_MODAL:
      return {
        ...state,
        quoteSwitchModal: {
          ...state.quoteSwitchModal,
          visible: action.data.visible,
          expenseNo: action.data.expenseNo,
          quotes: !action.data.visible ? [] : state.quoteSwitchModal.quotes,
        },
      };
    case actionTypes.GET_PARTNER_QUOTES_SUCCEED:
      return {
        ...state,
        quoteSwitchModal: {
          ...state.quoteSwitchModal,
          quotes: action.result.data,
        },
      };
    case actionTypes.CHANGE_LIST_FILTER: {
      let field;
      const params = action.data;
      if (params.mode === 'receivable') {
        field = 'recvableListFilter';
      } else {
        field = 'payableListFilter';
      }
      return { ...state, [field]: { ...state[field], [params.filterField]: params.filterValue } };
    }
    default:
      return state;
  }
}

/*
export function showPreviewer(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SHOW_PREVIEWER,
        actionTypes.SHOW_PREVIEWER_SUCCEED,
        actionTypes.SHOW_PREVIEWER_FAILED,
      ],
      endpoint: 'v1/cms/expense/previewer',
      method: 'get',
      params,
      visible: true,
      origin: 'mongo',
    },
  };
}

export function hideDock(delgNo) {
  return {
    type: actionTypes.HIDE_PREVIEWER,
    delgNo,
    visible: false,
  };
} */

export function loadRevenueCost(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXP_PANE_LOAD,
        actionTypes.EXP_PANE_LOAD_SUCCEED,
        actionTypes.EXP_PANE_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/expense/revenuecost',
      method: 'get',
      params: { delgNo },
    },
  };
}
/*
export function loadPanelCert(delgNo, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CERT_PANEL_LOAD,
        actionTypes.CERT_PANEL_LOAD_SUCCEED,
        actionTypes.CERT_PANEL_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/expense/load/certPanel',
      method: 'get',
      params: { delgNo, tenantId },
      origin: 'mongo',
    },
  };
}

export function loadDeclExps(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DECL_EXPS_LOAD,
        actionTypes.DECL_EXPS_LOAD_SUCCEED,
        actionTypes.DECL_EXPS_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/expense/decl/load',
      method: 'get',
      params,
      origin: 'mongo',
    },
  };
}
*/

export function loadExpenses(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXP_LOAD,
        actionTypes.EXP_LOAD_SUCCEED,
        actionTypes.EXP_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/billing/expenses',
      method: 'get',
      params,
    },
  };
}

export function changeListFilter(filterField, filterValue, mode) {
  return {
    type: actionTypes.CHANGE_LIST_FILTER,
    data: { filterField, filterValue, mode },
  };
}

export function loadTotalExpenseList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXP_TOTAL_LOAD,
        actionTypes.EXP_TOTAL_LOAD_SUCCEED,
        actionTypes.EXP_TOTAL_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/billing/expense/wholelist',
      method: 'get',
      params,
    },
  };
}

export function submitExpenses(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_EXPENSES,
        actionTypes.SUBMIT_EXPENSES_SUCCEED,
        actionTypes.SUBMIT_EXPENSES_FAIL,
      ],
      endpoint: 'v1/cms/billing/expenses/submit',
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
      endpoint: 'v1/cms/billing/expenses/confirm',
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
      endpoint: 'v1/cms/billing/expenses/reject',
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

export function loadBuyerSellerExpenses({ delgNo }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BUYER_SELLER_EXPENSES,
        actionTypes.LOAD_BUYER_SELLER_EXPENSES_SUCCEED,
        actionTypes.LOAD_BUYER_SELLER_EXPENSES_FAIL,
      ],
      endpoint: 'v1/cms/billing/delg/buyer/seller/expenses',
      method: 'get',
      params: { delgNo },
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
      endpoint: 'v1/cms/billing/expense/fees',
      method: 'get',
      params: expenseInfo,
    },
  };
}

/*
export function loadSubTable(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SUBTABLE,
        actionTypes.LOAD_SUBTABLE_SUCCEED,
        actionTypes.LOAD_SUBTABLE_FAIL,
      ],
      endpoint: 'v1/cms/expense/subtable/load',
      method: 'get',
      params,
      origin: 'mongo',
    },
  };
}

export function saveMarkstate(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MARK_SAVE,
        actionTypes.MARK_SAVE_SUCCEED,
        actionTypes.MARK_SAVE_FAIL,
      ],
      endpoint: 'v1/cms/expense/statement/mark',
      method: 'post',
      data: { params },
      origin: 'mongo',
    },
  };
}

export function closeInModal() {
  return {
    type: actionTypes.CLOSE_IN_MODAL,
  };
}

export function openInModal() {
  return {
    type: actionTypes.OPEN_IN_MODAL,
  };
}
*/

export function closeAdvanceFeeModal() {
  return {
    type: actionTypes.CLOSE_ADVFEE_MODAL,
  };
}

/*
export function closeMarkModal() {
  return {
    type: actionTypes.CLOSE_MARK_MODAL,
  };
}

export function openMarkModal() {
  return {
    type: actionTypes.OPEN_MARK_MODAL,
  };
}

export function closeCertModal() {
  return {
    type: actionTypes.CLOSE_CERT_MODAL,
  };
}

export function openCertModal() {
  return {
    type: actionTypes.OPEN_CERT_MODAL,
  };
}

export function openDeclInputModal(row) {
  return {
    type: actionTypes.OPEN_DECL_INPUT_MODAL,
    data: row,
  };
}
export function closeDeclInputModal() {
  return {
    type: actionTypes.CLOSE_DECL_INPUT_MODAL,
  };
}

export function loadCertFees(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXP_CERT_LOAD,
        actionTypes.EXP_CERT_LOAD_SUCCEED,
        actionTypes.EXP_CERT_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/expense/certfees',
      method: 'get',
      params,
      origin: 'mongo',
    },
  };
}

export function saveCertFees(disps, params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CERT_FEES_SAVE,
        actionTypes.CERT_FEES_SAVE_SUCCEED,
        actionTypes.CERT_FEES_SAVE_FAIL,
      ],
      endpoint: 'v1/cms/expense/update/certfees',
      method: 'post',
      data: { disps, params },
      origin: 'mongo',
    },
  };
}
*/

export function loadAdvanceParties(delgNo, tenantId, direction) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ADVPARTIES,
        actionTypes.LOAD_ADVPARTIES_SUCCEED,
        actionTypes.LOAD_ADVPARTIES_FAIL,
      ],
      endpoint: 'v1/cms/expense/load/advanceparties',
      method: 'get',
      params: { delgNo, tenantId, direction },
    },
  };
}

export function loadDelgAdvanceFee(dispIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DELGADVFEES,
        actionTypes.LOAD_DELGADVFEES_SUCCEED,
        actionTypes.LOAD_DELGADVFEES_FAIL,
      ],
      endpoint: 'v1/cms/expense/load/advancefees',
      method: 'get',
      params: { dispids: JSON.stringify(dispIds) },
      origin: 'mongo',
    },
  };
}

export function computeDelgAdvanceFees(feeItems) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COMPUTE_DELGADVFEES,
        actionTypes.COMPUTE_DELGADVFEES_SUCCEED,
        actionTypes.COMPUTE_DELGADVFEES_FAIL,
      ],
      endpoint: 'v1/cms/expense/compute/delg/advancefees',
      method: 'post',
      data: feeItems,
      origin: 'mongo',
    },
  };
}

export function showAdvModelModal(value) {
  return {
    type: actionTypes.SET_ADV_MODAL_VISIBLE,
    data: value,
  };
}

export function advExpImport(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADV_EXP_IMPORT,
        actionTypes.ADV_EXP_IMPORT_SUCCEED,
        actionTypes.ADV_EXP_IMPORT_FAIL,
      ],
      endpoint: 'v1/cms/expense/advance/import',
      method: 'post',
      data,
      payload: {
        importMode: data.importMode,
        partner: data.partner,
        calculateAll: data.calculateAll,
      },
    },
  };
}

export function showAdvImpTempModal(value) {
  return {
    type: actionTypes.SET_ADV_TEMP_MODAL_VISIBLE,
    data: value,
  };
}

export function saveImptAdvFees(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_IMPT_ADVFEES,
        actionTypes.SAVE_IMPT_ADVFEES_SUCCEED,
        actionTypes.SAVE_IMPT_ADVFEES_FAIL,
      ],
      endpoint: 'v1/cms/expense/imported/advancefees/save',
      method: 'post',
      data,
      origin: 'mongo',
    },
  };
}

/* export function loadDeclAdvanceParties(isCiq, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DECLADVPARTIES,
        actionTypes.LOAD_DECLADVPARTIES_SUCCEED,
        actionTypes.LOAD_DECLADVPARTIES_FAIL,
      ],
      endpoint: 'v1/cms/expense/load/decl/advanceparties',
      method: 'get',
      params: { cls: JSON.stringify({ isCiq, delgNo }) },
    },
  };
}

export function computeDeclAdvanceFee(formData) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COMPUTE_DECLADVFEES,
        actionTypes.COMPUTE_DECLADVFEES_SUCCEED,
        actionTypes.COMPUTE_DECLADVFEES_FAIL,
      ],
      endpoint: 'v1/cms/expense/compute/decl/advancefee',
      method: 'post',
      data: formData,
      origin: 'mongo',
    },
  };
} */

export function updateFee(data, expenseNo, contentLog, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_UPDATE,
        actionTypes.FEE_UPDATE_SUCCEED,
        actionTypes.FEE_UPDATE_FAIL,
      ],
      endpoint: 'v1/cms/expense/fee/update',
      method: 'post',
      data: {
        data, expenseNo, contentLog, delgNo,
      },
    },
  };
}

export function deleteFee(id, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_DELETE,
        actionTypes.FEE_DELETE_SUCCEED,
        actionTypes.FEE_DELETE_FAIL,
      ],
      endpoint: 'v1/cms/expense/fee/delete',
      method: 'post',
      data: { id, contentLog },
    },
  };
}

export function unbillingByBatchupload(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UNBIILING_BY_BATCHUPLOAD,
        actionTypes.UNBIILING_BY_BATCHUPLOAD_SUCCEED,
        actionTypes.UNBIILING_BY_BATCHUPLOAD_FAIL,
      ],
      endpoint: 'v1/cms/expense/unbilling/by/batchupload',
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
      endpoint: 'v1/cms/expense/fee/calc/inputqty',
      method: 'post',
      data: { id, value },
    },
  };
}

export function updateAPFee(advFee, expenseNo, contentLog, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_AP_FEE,
        actionTypes.UPDATE_AP_FEE_SUCCEED,
        actionTypes.UPDATE_AP_FEE_FAIL,
      ],
      endpoint: 'v1/cms/expense/ap/fee/update',
      method: 'post',
      data: {
        advFee, expenseNo, contentLog, delgNo,
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
      endpoint: 'v1/cms/expense/ap/fee/copy',
      method: 'post',
      data: {
        advFee, expenseNo,
      },
    },
  };
}

export function updateEventFeeClear(status, events) {
  return {
    type: actionTypes.UPDATE_EVENT_FEE_CLEAR,
    data: { status, events },
  };
}

export function toggleFeeSelectModal(visible) {
  return {
    type: actionTypes.TOGGLE_FEE_CAT_MODAL,
    visible,
  };
}

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
      endpoint: 'v1/cms/expense/billing/groupfees',
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
      endpoint: 'v1/cms/expense/billing/fees/get/by/bizno',
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

export function toggleQuoteSwitchModal(visible, { expenseNo }) {
  return {
    type: actionTypes.TOGGLE_QUOTE_SWITCH_MODAL,
    data: { visible, expenseNo },
  };
}

export function getAvailQuotesByExpense(expenseNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_PARTNER_QUOTES,
        actionTypes.GET_PARTNER_QUOTES_SUCCEED,
        actionTypes.GET_PARTNER_QUOTES_FAIL,
      ],
      endpoint: 'v1/cms/expense/partner/quotes',
      method: 'get',
      params: { expenseNo },
    },
  };
}

export function switchExpQuote(expenseNo, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SWITCH_EXP_QUOTE,
        actionTypes.SWITCH_EXP_QUOTE_SUCCEED,
        actionTypes.SWITCH_EXP_QUOTE_FAIL,
      ],
      endpoint: 'v1/cms/expense/quote/switch',
      method: 'post',
      data: { expenseNo, quoteNo },
    },
  };
}
