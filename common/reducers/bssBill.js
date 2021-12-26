import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/bss/bill', [
  'LOAD_BILLS', 'LOAD_BILLS_SUCCEED', 'LOAD_BILLS_FAIL',
  'LOAD_ORDER_STATEMENTS', 'LOAD_ORDER_STATEMENTS_SUCCEED', 'LOAD_ORDER_STATEMENTS_FAIL',
  'RELOAD_BILL_LIST',
  'TOGGLE_NEW_BILL_MODAL',
  'CREATE_BILL', 'CREATE_BILL_SUCCEED', 'CREATE_BILL_FAIL',
  'LOAD_BILL_STATISTICS', 'LOAD_BILL_STATISTICS_SUCCEED', 'LOAD_BILL_STATISTICS_FAIL',
  'SEND_BILL', 'SEND_BILL_SUCCEED', 'SEND_BILL_FAIL',
  'DELETE_BILL', 'DELETE_BILL_SUCCEED', 'DELETE_BILL_FAIL',
  'RECALL_BILL', 'RECALL_BILL_SUCCEED', 'RECALL_BILL_FAIL',
  'ACCEPT_BILL', 'ACCEPT_BILL_SUCCEED', 'ACCEPT_BILL_FAIL',
  'GET_BRSTATEMENTS', 'GET_BRSTATEMENTS_SUCCEED', 'GET_BRSTATEMENTS_FAIL',
  'GET_BILLFT', 'GET_BILLFT_SUCCEED', 'GET_BILLFT_FAIL',
  'ADJUST_BILLSTATMENT', 'ADJUST_BILLSTATMENT_SUCCEED', 'ADJUST_BILLSTATMENT_FAIL',
  'LOAD_BILL_HEAD', 'LOAD_BILL_HEAD_SUCCEED', 'LOAD_BILL_HEAD_FAIL',
  'UPDATE_RECONCILE_FEE', 'UPDATE_RECONCILE_FEE_SUCCEED', 'UPDATE_RECONCILE_FEE_FAIL',
  'RECONCILE_STATEMENT', 'RECONCILE_STATEMENT_SUCCEED', 'RECONCILE_STATEMENT_FAIL',
  'REJECT_BILL', 'REJECT_BILL_SUCCEED', 'REJECT_BILL_FAIL',
  'GET_DRAFT_BILL', 'GET_DRAFT_BILL_SUCCEED', 'GET_DRAFT_BILL_FAIL',
  'TOGGLE_ADDTO_DRAFT_MODAL', 'TOGGLE_RECONCILE_MODAL_MODAL',
  'ADD_ORDERS_TO_DRAFT_BILL', 'ADD_ORDERS_TO_DRAFT_BILL_SUCCEED', 'ADD_ORDERS_TO_DRAFT_BILL_FAIL',
  'WRITEOFF_BILL', 'WRITEOFF_BILL_SUCCEED', 'WRITEOFF_BILL_FAIL',
  'GET_RECONCILE_IPBSTATEMENTS', 'GET_RECONCILE_IPBSTATEMENTS_SUCCEED', 'GET_RECONCILE_IPBSTATEMENTS_FAIL',
  'UPDATE_IMPORT_BILL', 'UPDATE_IMPORT_BILL_SUCCEED', 'UPDATE_IMPORT_BILL_FAIL',
]);

const initialState = {
  billlist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  orderStatementlist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
    status: 'all',
    clientPid: 'all',
  },
  loading: false,
  createBillModal: {
    visible: false,
    statements: [],
    byStatements: false,
  },
  billReload: false,
  billStat: {
    init_account_amount: 0,
    init_other_amount: 0,
    account_amount: 0,
    other_amount: 0,
  },
  billHead: {},
  billStatements: [],
  billTemplateFees: [],
  billTemplateProps: [],
  statementFees: [],
  reconcileStatementReload: false,
  billHeadReload: false,
  draftModal: {
    visibleAddToDraftModal: false,
    statementsIds: [],
    partnerId: null,
  },
  reconcileModal: {
    visible: false,
    billType: '',
    billNo: '',
    reconcileType: '',
  },
  importReconcileFees: [],
  importStatementKey: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_BILLS:
      return {
        ...state,
        billReload: false,
        listLoading: true,
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_BILLS_SUCCEED:
      return { ...state, listLoading: false, billlist: action.result.data };
    case actionTypes.LOAD_BILLS_FAIL:
      return { ...state, listLoading: false };
    case actionTypes.LOAD_ORDER_STATEMENTS:
      return {
        ...state,
        billReload: false,
        listFilter: JSON.parse(action.params.filter),
        loading: true,
      };
    case actionTypes.LOAD_ORDER_STATEMENTS_SUCCEED:
      return { ...state, loading: false, orderStatementlist: action.result.data };
    case actionTypes.LOAD_ORDER_STATEMENTS_FAIL:
      return { ...state, loading: false };
    case actionTypes.TOGGLE_NEW_BILL_MODAL:
      return {
        ...state,
        createBillModal: {
          ...state.createBillModal,
          visible: action.data.visible,
          statements: action.data.statements,
          byStatements: action.data.byStatements,
        },
      };
    case actionTypes.RELOAD_BILL_LIST:
      return {
        ...state,
        billReload: true,
        listFilter: { ...state.listFilter, ...action.data.filter },
      };
    case actionTypes.LOAD_BILL_STATISTICS:
      return { ...state, billReload: false, listFilter: JSON.parse(action.params.filter) };
    case actionTypes.LOAD_BILL_STATISTICS_SUCCEED:
      return { ...state, billStat: action.result.data };
    case actionTypes.LOAD_BILL_HEAD:
      return { ...state, billHeadReload: false };
    case actionTypes.LOAD_BILL_HEAD_SUCCEED:
      return { ...state, billHead: action.result.data };
    case actionTypes.ADJUST_BILLSTATMENT_SUCCEED:
      return {
        ...state,
        billHeadReload: true,
        statementFees: state.statementFees.map((fee) => {
          if (fee.id === action.data.data.id) {
            return {
              ...fee,
              seller_settled_amount: fee.seller_settled_amount + action.data.data.delta,
            };
          }
          return fee;
        }),
      };
    case actionTypes.RECONCILE_STATEMENT_SUCCEED:
      return { ...state, billHeadReload: true, reconcileStatementReload: true };
    case actionTypes.CREATE_BILL_SUCCEED:
      return { ...state, billReload: true };
    case actionTypes.GET_BRSTATEMENTS:
      return { ...state, reconcileStatementReload: false };
    case actionTypes.GET_BRSTATEMENTS_SUCCEED:
      return { ...state, billStatements: action.result.data };
    case actionTypes.GET_BRSTATEMENTS_FAIL:
      return { ...state, billStatements: [] };
    case actionTypes.GET_BILLFT_SUCCEED:
      return {
        ...state,
        billTemplateFees: action.result.data.billTemplateFees,
        billTemplateProps: action.result.data.billTemplateProps,
        statementFees: action.result.data.statements,
      };
    case actionTypes.UPDATE_RECONCILE_FEE_SUCCEED:
      return { ...state, reconcileStatementReload: true, billHeadReload: true };
    case actionTypes.TOGGLE_ADDTO_DRAFT_MODAL:
      return {
        ...state,
        draftModal: {
          ...state.draftModal,
          visibleAddToDraftModal: action.data.visible,
          statementsIds: action.data.statementsIds,
          partnerId: action.data.partnerId,
        },
      };
    case actionTypes.ADD_ORDERS_TO_DRAFT_BILL_SUCCEED:
      return { ...state, billReload: true };
    case actionTypes.TOGGLE_RECONCILE_MODAL_MODAL:
      return {
        ...state,
        reconcileModal: {
          visible: action.data.visible,
          billType: action.data.billType,
          billNo: action.data.billNo,
          reconcileType: action.data.reconcileType,
        },
      };
    case actionTypes.GET_RECONCILE_IPBSTATEMENTS_SUCCEED:
      return {
        ...state,
        importReconcileFees: action.result.data.fees,
        importStatementKey: action.result.data.importStatementKey,
        billTemplateFees: action.result.data.billTemplateFees,
      };
    case actionTypes.DELETE_BILL_SUCCEED: {
      const { totalCount, pageSize, current } = state.billlist;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, 1);
      return { ...state, billlist: { ...state.billlist, current: currentPage } };
    }
    default:
      return state;
  }
}

export function toggleNewBillModal(visible, { statements, byStatements }) {
  return {
    type: actionTypes.TOGGLE_NEW_BILL_MODAL,
    data: { visible, statements, byStatements },
  };
}

export function reloadBillList(filter) {
  return {
    type: actionTypes.RELOAD_BILL_LIST,
    data: { filter },
  };
}

export function loadBillableStatements(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_STATEMENTS,
        actionTypes.LOAD_ORDER_STATEMENTS_SUCCEED,
        actionTypes.LOAD_ORDER_STATEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/billable/statements',
      method: 'get',
      params,
    },
  };
}

export function loadBills(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILLS,
        actionTypes.LOAD_BILLS_SUCCEED,
        actionTypes.LOAD_BILLS_FAIL,
      ],
      endpoint: 'v1/bss/bills/load',
      method: 'get',
      params,
    },
  };
}

export function loadBillStatistics(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_STATISTICS,
        actionTypes.LOAD_BILL_STATISTICS_SUCCEED,
        actionTypes.LOAD_BILL_STATISTICS_FAIL,
      ],
      endpoint: 'v1/bss/bill/statistics',
      method: 'get',
      params,
    },
  };
}

export function createBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BILL,
        actionTypes.CREATE_BILL_SUCCEED,
        actionTypes.CREATE_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/new',
      method: 'post',
      data,
    },
  };
}

export function sendBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEND_BILL,
        actionTypes.SEND_BILL_SUCCEED,
        actionTypes.SEND_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/send',
      method: 'post',
      data,
    },
  };
}

export function deleteBills(billNos) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BILL,
        actionTypes.DELETE_BILL_SUCCEED,
        actionTypes.DELETE_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bills/delete',
      method: 'post',
      data: { billNos },
    },
  };
}

export function recallBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RECALL_BILL,
        actionTypes.RECALL_BILL_SUCCEED,
        actionTypes.RECALL_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/recall',
      method: 'post',
      data,
    },
  };
}

export function loadBillHead(billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_HEAD,
        actionTypes.LOAD_BILL_HEAD_SUCCEED,
        actionTypes.LOAD_BILL_HEAD_FAIL,
      ],
      endpoint: 'v1/bss/bill/head/load',
      method: 'get',
      params: { billNo },
    },
  };
}

export function getBillReconcilingStatements(billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BRSTATEMENTS,
        actionTypes.GET_BRSTATEMENTS_SUCCEED,
        actionTypes.GET_BRSTATEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/bill/reconciling/statements',
      method: 'get',
      params: { billNo },
    },
  };
}

export function getBillFeesAndTemplate(billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BILLFT,
        actionTypes.GET_BILLFT_SUCCEED,
        actionTypes.GET_BILLFT_FAIL,
      ],
      endpoint: 'v1/bss/bill/statementandfees',
      method: 'get',
      params: { billNo },
    },
  };
}

export function acceptBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ACCEPT_BILL,
        actionTypes.ACCEPT_BILL_SUCCEED,
        actionTypes.ACCEPT_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/accept',
      method: 'post',
      data,
    },
  };
}

export function adjustBillStatement(data, billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADJUST_BILLSTATMENT,
        actionTypes.ADJUST_BILLSTATMENT_SUCCEED,
        actionTypes.ADJUST_BILLSTATMENT_FAIL,
      ],
      endpoint: 'v1/bss/bill/statement/adjust',
      method: 'post',
      data: { data, billNo },
    },
  };
}

export function updateStatementReconcileFee(data, billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_RECONCILE_FEE,
        actionTypes.UPDATE_RECONCILE_FEE_SUCCEED,
        actionTypes.UPDATE_RECONCILE_FEE_FAIL,
      ],
      endpoint: 'v1/bss/reconcile/fee/update',
      method: 'post',
      data: { data, billNo },
    },
  };
}

export function reconcileStatement(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RECONCILE_STATEMENT,
        actionTypes.RECONCILE_STATEMENT_SUCCEED,
        actionTypes.RECONCILE_STATEMENT_FAIL,
      ],
      endpoint: 'v1/bss/bill/statement/reconcile',
      method: 'post',
      data: { id },
    },
  };
}

export function rejectBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REJECT_BILL,
        actionTypes.REJECT_BILL_SUCCEED,
        actionTypes.REJECT_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/reject',
      method: 'post',
      data,
    },
  };
}

export function loadDraftBillByPartner(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_DRAFT_BILL,
        actionTypes.GET_DRAFT_BILL_SUCCEED,
        actionTypes.GET_DRAFT_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/partner/drafts',
      method: 'get',
      params,
    },
  };
}

export function toggleAddToDraftModal(visible, partnerId, statementsIds) {
  return {
    type: actionTypes.TOGGLE_ADDTO_DRAFT_MODAL,
    data: { visible, partnerId, statementsIds },
  };
}

export function appendDraftStatements(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ORDERS_TO_DRAFT_BILL,
        actionTypes.ADD_ORDERS_TO_DRAFT_BILL_SUCCEED,
        actionTypes.ADD_ORDERS_TO_DRAFT_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/draft/append/statements',
      method: 'post',
      data,
    },
  };
}

export function writeOffBill(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.WRITEOFF_BILL,
        actionTypes.WRITEOFF_BILL_SUCCEED,
        actionTypes.WRITEOFF_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/writeoff',
      method: 'post',
      data,
    },
  };
}

export function toggleReconcileModal(visible, { billType, billNo, reconcileType }) {
  return {
    type: actionTypes.TOGGLE_RECONCILE_MODAL_MODAL,
    data: {
      visible,
      billType,
      billNo,
      reconcileType,
    },
  };
}

export function loadReconIPBStatements(billNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_RECONCILE_IPBSTATEMENTS,
        actionTypes.GET_RECONCILE_IPBSTATEMENTS_SUCCEED,
        actionTypes.GET_RECONCILE_IPBSTATEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/bill/reconcile/ipbstatements',
      method: 'get',
      params: { billNo },
    },
  };
}

export function updateImportBill({
  feeAmount, feeId,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_IMPORT_BILL,
        actionTypes.UPDATE_IMPORT_BILL_SUCCEED,
        actionTypes.UPDATE_IMPORT_BILL_FAIL,
      ],
      endpoint: 'v1/bss/bill/import/bill/update',
      method: 'post',
      data: {
        feeAmount, feeId,
      },
    },
  };
}
