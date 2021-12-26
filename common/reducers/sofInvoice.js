import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { PARTNER_ROLES } from 'common/constants';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/sof/invoice/', [
  'LOAD_INVOICES', 'LOAD_INVOICES_SUCCEED', 'LOAD_INVOICES_FAIL',
  'ADD_SOF_INVOICE', 'ADD_SOF_INVOICE_SUCCEED', 'ADD_SOF_INVOICE_FAIL',
  'TOGGLE_DETAIL_MODAL', 'ADD_TEMPORARY', 'SET_TEMPORARY',
  'GET_INVOICE', 'GET_INVOICE_SUCCEED', 'GET_INVOICE_FAIL',
  'UPDATE_SOF_INVOICE', 'UPDATE_SOF_INVOICE_SUCCEED', 'UPDATE_SOF_INVOICE_FAIL',
  'CLEAR_INVOICE', 'SET_RECORDS_RELOAD',
  'DELETE_SOF_INVOICE', 'DELETE_SOF_INVOICE_SUCCEED', 'DELETE_SOF_INVOICE_FAIL',
  'SPLIT_SOF_INVOICE', 'SPLIT_SOF_INVOICE_SUCCEED', 'SPLIT_SOF_INVOICE_FAIL',
  'BATCH_DELETE_INVOICES', 'BATCH_DELETE_INVOICES_SUCCEED', 'BATCH_DELETE_INVOICES_FAIL',
  'BATCH_DELETE_BY_UPLOADNO', 'BATCH_DELETE_BY_UPLOADNO_SUCCEED', 'BATCH_DELETE_BY_UPLOADNO_FAIL',
  'LOAD_INVOICE_CATEGORIES', 'LOAD_INVOICE_CATEGORIES_SUCCEED', 'LOAD_INVOICE_CATEGORIES_FAIL',
  'LOAD_INVOICE_BUYER_SELLERS', 'LOAD_INVOICE_BUYER_SELLERS_SUCCEED', 'LOAD_INVOICE_BUYER_SELLERS_FAIL',
  'TOGGLE_SHIP_RECV_PANEL', 'SET_CONFIRM_RECORDS_RELOAD',
  'GET_CONFIRM_GLOBALDETAILS', 'GET_CONFIRM_GLOBALDETAILS_SUCCEED', 'GET_CONFIRM_GLOBALDETAILS_FAIL',
  'CONFIRM_RECORDS_LOAD', 'CONFIRM_RECORDS_LOAD_SUCCEED', 'CONFIRM_RECORDS_LOAD_FAIL',
  'BATCH_DELETE_INVOICE_DETAILS', 'BATCH_DELETE_INVOICE_DETAILS_SUCCEED', 'BATCH_DELETE_INVOICE_DETAILS_FAIL',
  'ADD_INVOICE_DETAIL', 'ADD_INVOICE_DETAIL_SUCCEED', 'ADD_INVOICE_DETAIL_FAIL',
  'UPDATE_INVOICE_DETAIL', 'UPDATE_INVOICE_DETAIL_SUCCEED', 'UPDATE_INVOICE_DETAIL_FAIL',
]);

const initialState = {
  invoiceList: {
    current: 1,
    pageSize: 20,
    data: [],
  },
  shipRecvPanelvisible: false,
  confirmRecordLists: {
    current: 1,
    pageSize: 20,
    data: [],
    totalCount: 0,
  },
  confirmRecordReload: false,
  confirmListFilter: {},
  confirmGlobalDetails: [],
  loading: false,
  filter: { scenario: 'all' },
  sorter: {},
  invoiceDetails: [],
  invoiceHead: {},
  detailModal: {
    visible: false,
    record: {},
  },
  invoiceCategories: [],
  sellers: [],
  buyers: [],
  invDetailLoading: false,
  shipRecvLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_INVOICES:
      return {
        ...state,
        filter: JSON.parse(action.params.filter),
        sorter: JSON.parse(action.params.sorter),
        loading: true,
      };
    case actionTypes.LOAD_INVOICES_SUCCEED:
      return { ...state, invoiceList: { ...action.result.data }, loading: false };
    case actionTypes.LOAD_INVOICES_FAIL:
      return { ...state, loading: false };
    case actionTypes.TOGGLE_DETAIL_MODAL:
      return {
        ...state,
        detailModal: {
          ...state.detailModal,
          visible: action.visible,
          record: action.record,
        },
      };
    case actionTypes.ADD_TEMPORARY:
      return { ...state, invoiceDetails: [...state.invoiceDetails, action.record] };
    case actionTypes.SET_TEMPORARY:
      return { ...state, invoiceDetails: action.records };
    case actionTypes.GET_INVOICE:
      return { ...state, invDetailLoading: true };
    case actionTypes.GET_INVOICE_SUCCEED:
      return {
        ...state,
        invoiceDetails: action.result.data.details,
        invoiceHead: action.result.data.head || {},
        invDetailLoading: false,
      };
    case actionTypes.GET_INVOICE_FAIL:
      return { ...state, invDetailLoading: false };
    case actionTypes.CLEAR_INVOICE:
      return { ...state, invoiceDetails: [], invoiceHead: {} };
    case actionTypes.LOAD_INVOICE_CATEGORIES_SUCCEED:
      return { ...state, invoiceCategories: action.result.data };
    case actionTypes.LOAD_INVOICE_BUYER_SELLERS_SUCCEED:
      return {
        ...state,
        buyers: action.result.data.filter(item => item.role === PARTNER_ROLES.CUS
        || item.role === PARTNER_ROLES.OWN),
        sellers: action.result.data.filter(item => item.role === PARTNER_ROLES.SUP
        || item.role === PARTNER_ROLES.OWN),
      };
    case actionTypes.TOGGLE_SHIP_RECV_PANEL:
      return { ...state, shipRecvPanelvisible: action.visible };
    case actionTypes.CONFIRM_RECORDS_LOAD_SUCCEED:
      return { ...state, confirmRecordLists: { ...action.result.data } };
    case actionTypes.CONFIRM_RECORDS_LOAD:
      return {
        ...state,
        confirmRecordReload: false,
        confirmListFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.GET_CONFIRM_RECORDS_SUCCEED:
      return { ...state, confirmGlobalDetails: action.result.data };
    case actionTypes.SET_CONFIRM_RECORDS_RELOAD:
      return { ...state, confirmRecordReload: action.data.reload };
    case actionTypes.GET_CONFIRM_GLOBALDETAILS:
      return { ...state, shipRecvLoading: true };
    case actionTypes.GET_CONFIRM_GLOBALDETAILS_SUCCEED:
      return { ...state, confirmGlobalDetails: action.result.data, shipRecvLoading: false };
    case actionTypes.GET_CONFIRM_GLOBALDETAILS_FAIL:
      return { ...state, shipRecvLoading: false };
    case actionTypes.BATCH_DELETE_INVOICES_SUCCEED: {
      const { totalCount, pageSize, current } = state.invoiceList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, action.data.invoiceNos.length);
      return { ...state, invoiceList: { ...state.invoiceList, current: currentPage } };
    }
    default:
      return state;
  }
}

export function addSofInvoice(head, details) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SOF_INVOICE,
        actionTypes.ADD_SOF_INVOICE_SUCCEED,
        actionTypes.ADD_SOF_INVOICE_FAIL,
      ],
      endpoint: 'v1/sof/invoice/add',
      method: 'post',
      data: { head, details },
    },
  };
}

export function toggleDetailModal(visible, record = {}) {
  return {
    type: actionTypes.TOGGLE_DETAIL_MODAL,
    visible,
    record,
  };
}

export function addTemporary(record) {
  return {
    type: actionTypes.ADD_TEMPORARY,
    record,
  };
}

export function setTemporary(records) {
  return {
    type: actionTypes.SET_TEMPORARY,
    records,
  };
}

export function clearInvoice() {
  return {
    type: actionTypes.CLEAR_INVOICE,
  };
}

export function toggleShipRecvPanel(visible) {
  return {
    type: actionTypes.TOGGLE_SHIP_RECV_PANEL,
    visible,
  };
}

export function loadInvoices({
  pageSize, current, filter, sorter,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICES,
        actionTypes.LOAD_INVOICES_SUCCEED,
        actionTypes.LOAD_INVOICES_FAIL,
      ],
      endpoint: 'v1/sof/invoices/load',
      method: 'get',
      params: {
        pageSize, current, filter, sorter,
      },
    },
  };
}

export function getInvoice(invoiceNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_INVOICE,
        actionTypes.GET_INVOICE_SUCCEED,
        actionTypes.GET_INVOICE_FAIL,
      ],
      endpoint: 'v1/sof/invoice/get',
      method: 'get',
      params: { invoiceNo },
    },
  };
}

export function UpdateSofInvoice(head, invoiceNo, invoiceHeadId, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SOF_INVOICE,
        actionTypes.UPDATE_SOF_INVOICE_SUCCEED,
        actionTypes.UPDATE_SOF_INVOICE_FAIL,
      ],
      endpoint: 'v1/sof/invoice/update',
      method: 'post',
      data: {
        head, invoiceNo, invoiceHeadId, contentLog,
      },
    },
  };
}

export function splitInvoice(invoiceNo, splitDetails) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SPLIT_SOF_INVOICE,
        actionTypes.SPLIT_SOF_INVOICE_SUCCEED,
        actionTypes.SPLIT_SOF_INVOICE_FAIL,
      ],
      endpoint: 'v1/sof/invoice/split',
      method: 'post',
      data: { invoiceNo, splitDetails },
    },
  };
}

export function batchDeleteInvoices(invoiceNos) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_INVOICES,
        actionTypes.BATCH_DELETE_INVOICES_SUCCEED,
        actionTypes.BATCH_DELETE_INVOICES_FAIL,
      ],
      endpoint: 'v1/sof/invoices/batch/delete',
      method: 'post',
      data: { invoiceNos },
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
      endpoint: 'v1/sof/invoices/batch/delete/by/uploadno',
      method: 'post',
      data: { uploadNo },
    },
  };
}

export function loadInvoiceCategories() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICE_CATEGORIES,
        actionTypes.LOAD_INVOICE_CATEGORIES_SUCCEED,
        actionTypes.LOAD_INVOICE_CATEGORIES_FAIL,
      ],
      endpoint: 'v1/sof/invoices/categories/load',
      method: 'get',
    },
  };
}

export function loadInvoiceBuyerSellers() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICE_BUYER_SELLERS,
        actionTypes.LOAD_INVOICE_BUYER_SELLERS_SUCCEED,
        actionTypes.LOAD_INVOICE_BUYER_SELLERS_FAIL,
      ],
      endpoint: 'v1/cooperation/partners',
      method: 'post',
      data: {
        role: [PARTNER_ROLES.OWN, PARTNER_ROLES.CUS, PARTNER_ROLES.SUP],
      },
    },
  };
}

export function getShipRecvConfirmRecords({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CONFIRM_RECORDS_LOAD,
        actionTypes.CONFIRM_RECORDS_LOAD_SUCCEED,
        actionTypes.CONFIRM_RECORDS_LOAD_FAIL,
      ],
      endpoint: 'v1/sof/invoices/shiprecvconfirms',
      method: 'get',
      params: { pageSize, current, filter },
    },
  };
}

export function getConfirmGlobalDetails(taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_CONFIRM_GLOBALDETAILS,
        actionTypes.GET_CONFIRM_GLOBALDETAILS_SUCCEED,
        actionTypes.GET_CONFIRM_GLOBALDETAILS_FAIL,
      ],
      endpoint: 'v1/sof/invoice/shiprecv/confirmdetails',
      method: 'get',
      params: { taskId },
    },
  };
}

export function setConfirmRecordsReload(reload) {
  return {
    type: actionTypes.SET_CONFIRM_RECORDS_RELOAD,
    data: { reload },
  };
}

export function batchDeleteInvDetails(details, invoiceNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_INVOICE_DETAILS,
        actionTypes.BATCH_DELETE_INVOICE_DETAILS_SUCCEED,
        actionTypes.BATCH_DELETE_INVOICE_DETAILS_FAIL,
      ],
      endpoint: 'v1/sof/invoice/details/batch/delete',
      method: 'post',
      data: { details, invoiceNo },
    },
  };
}

export function addInvoiceDetail(detail, invoiceNo, invoiceDate) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_INVOICE_DETAIL,
        actionTypes.ADD_INVOICE_DETAIL_SUCCEED,
        actionTypes.ADD_INVOICE_DETAIL_FAIL,
      ],
      endpoint: 'v1/sof/invoice/detail/add',
      method: 'post',
      data: { detail, invoiceNo, invoiceDate },
    },
  };
}

export function updateInvoiceDetail(detail, headUpdates, invoiceNo, id, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_INVOICE_DETAIL,
        actionTypes.UPDATE_INVOICE_DETAIL_SUCCEED,
        actionTypes.UPDATE_INVOICE_DETAIL_FAIL,
      ],
      endpoint: 'v1/sof/invoice/detail/update',
      method: 'post',
      data: {
        detail, headUpdates, invoiceNo, id, contentLog,
      },
    },
  };
}
