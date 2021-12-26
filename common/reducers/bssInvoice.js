import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/invoice/', [
  'TOGGLE_INVOICE_MODAL', 'TOGGLE_CSP_INVOICE_MODAL',
  'LOAD_INVOICES', 'LOAD_INVOICES_SUCCEED', 'LOAD_INVOICES_FAIL',
  'CREATE_BILL_INVOICE', 'CREATE_BILL_INVOICE_SUCCEED', 'CREATE_BILL_INVOICE_FAIL',
  'LOAD_BILL_INVOICES', 'LOAD_BILL_INVOICES_SUCCEED', 'LOAD_BILL_INVOICES_FAIL',
  'COMFIRM_INVOICE', 'COMFIRM_INVOICE_SUCCEED', 'COMFIRM_INVOICE_FAIL',
  'EDIT_BILL_INVOICE', 'EDIT_BILL_INVOICE_SUCCEED', 'EDIT_BILL_INVOICE_FAIL',
  'RETURN_BILL_INVOICE', 'RETURN_BILL_INVOICE_SUCCEED', 'RETURN_BILL_INVOICE_FAIL',
  'GET_BILL_INVOICE', 'GET_BILL_INVOICE_SUCCEED', 'GET_BILL_INVOICE_FAIL',
]);

const initialState = {
  loading: false,
  invoiceList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
    status: 'unconfirmed',
    clientPid: 'all',
  },
  outputInvoiceList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [
      {
        id: 1,
        voucher_no: '记-001',
      },
    ],
  },
  outputListFilter: {
    status: 'applied',
    clientPid: 'all',
  },
  invoiceModal: {
    visible: false,
    action: '',
    record: {},
  },
  cspInvoiceModal: {
    visible: false,
    record: {},
  },
  invoiceFees: [],
  reload: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_BILL_INVOICES:
      return {
        ...state,
        listFilter: JSON.parse(action.params.filter),
        loading: true,
        reload: false,
      };
    case actionTypes.LOAD_BILL_INVOICES_SUCCEED:
      return { ...state, loading: false, invoiceList: action.result.data };
    case actionTypes.LOAD_BILL_INVOICES_FAIL:
      return { ...state, loading: false };
    case actionTypes.TOGGLE_INVOICE_MODAL:
      return {
        ...state,
        invoiceModal: {
          visible: action.data.visible,
          record: action.data.record,
          action: action.data.action,
        },
      };
    case actionTypes.TOGGLE_CSP_INVOICE_MODAL:
      return {
        ...state,
        cspInvoiceModal: { visible: action.data.visible, record: action.data.record },
      };
    case actionTypes.COMFIRM_INVOICE_SUCCEED:
      return { ...state, reload: true };
    case actionTypes.EDIT_BILL_INVOICE_SUCCEED: {
      const invoiceDate = [...state.invoiceList.data];
      const index = invoiceDate.findIndex(item => item.id === action.data.invId);
      invoiceDate[index] = { ...invoiceDate[index], ...action.data.invoiceHead };
      return { ...state, invoiceList: { ...state.invoiceList, data: invoiceDate } };
    }
    case actionTypes.GET_BILL_INVOICE_SUCCEED:
      return { ...state, invoiceFees: action.result.data };
    default:
      return state;
  }
}

export function createBillInvoice(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BILL_INVOICE,
        actionTypes.CREATE_BILL_INVOICE_SUCCEED,
        actionTypes.CREATE_BILL_INVOICE_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoice/create',
      method: 'post',
      data: { data },
    },
  };
}

export function loadBillInvoices({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_INVOICES,
        actionTypes.LOAD_BILL_INVOICES_SUCCEED,
        actionTypes.LOAD_BILL_INVOICES_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoices/load',
      method: 'get',
      params: { pageSize, current, filter },
    },
  };
}

export function toggleInvoiceModal(visible, action, record = {}) {
  return {
    type: actionTypes.TOGGLE_INVOICE_MODAL,
    data: { visible, action, record },
  };
}

export function toggleCspInvoiceModal(visible, record = {}) {
  return {
    type: actionTypes.TOGGLE_CSP_INVOICE_MODAL,
    data: { visible, record },
  };
}

export function confirmBillInvoice(ids) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COMFIRM_INVOICE,
        actionTypes.COMFIRM_INVOICE_SUCCEED,
        actionTypes.COMFIRM_INVOICE_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoice/confirm',
      method: 'post',
      data: { ids },
    },
  };
}


export function editBillInvoice(invoiceHead, invId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_BILL_INVOICE,
        actionTypes.EDIT_BILL_INVOICE_SUCCEED,
        actionTypes.EDIT_BILL_INVOICE_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoice/edit',
      method: 'post',
      data: { invoiceHead, invId },
    },
  };
}

export function returnBillInvoice({ id, invoiceAmount, billNo }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RETURN_BILL_INVOICE,
        actionTypes.RETURN_BILL_INVOICE_SUCCEED,
        actionTypes.RETURN_BILL_INVOICE_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoice/return',
      method: 'post',
      data: { id, invoiceAmount, billNo },
    },
  };
}

export function getInvoiceDetails(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BILL_INVOICE,
        actionTypes.GET_BILL_INVOICE_SUCCEED,
        actionTypes.GET_BILL_INVOICE_FAIL,
      ],
      endpoint: 'v1/bss/bill/invoicefees',
      method: 'get',
      params: { id },
    },
  };
}
