import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/cms/delegation/', [
  'VISIBLE_QUOTE_CREATE_MODAL',
  'CREATE_QUOTE', 'CREATE_QUOTE_SUCCEED', 'CREATE_QUOTE_FAIL',
  'QUOTES_LOAD', 'QUOTES_LOAD_SUCCEED', 'QUOTES_LOAD_FAIL',
  'QUOTE_PARAMS_LOAD', 'QUOTE_PARAMS_LOAD_SUCCEED', 'QUOTE_PARAMS_LOAD_FAIL',
  'QUOTE_FEES_LOAD', 'QUOTE_FEES_LOAD_SUCCEED', 'QUOTE_FEES_LOAD_FAIL',
  'QUOTES_DELETE', 'QUOTES_DELETE_SUCCEED', 'QUOTES_DELETE_FAIL',
  'FEES_ADD', 'FEES_ADD_SUCCEED', 'FEES_ADD_FAIL',
  'FEES_COPY', 'FEES_COPY_SUCCEED', 'FEES_COPY_FAIL',
  'FEE_UPDATE', 'FEE_UPDATE_SUCCEED', 'FEE_UPDATE_FAIL',
  'FEES_DELETE', 'FEES_DELETE_SUCCEED', 'FEES_DELETE_FAIL',
  'REVISE_QUOTE_SETTING', 'REVISE_QUOTE_SETTING_SUCCEED', 'REVISE_QUOTE_SETTING_FAIL',
  'PUBLISH_QUOTE', 'PUBLISH_QUOTE_SUCCEED', 'PUBLISH_QUOTE_FAIL',
  'SHOW_PUBLISH_QUOTE_MODAL',
  'RELOAD_QUOTE_FEES',
]);

const initialState = {
  partners: [],
  quoteNo: '',
  quoteData: {},
  quoteFees: [],
  quoteSaving: false,
  quoteRevisions: [],
  quotesList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
    sortField: '',
    sortOrder: '',
    viewStatus: 'clientQuote',
    quoteSearch: '',
    partnerId: 'all',
  },
  quotesLoading: false,
  quoteFeesLoading: false,
  visibleCreateModal: false,
  visibleAddFeeModal: false,
  quoteFeesReload: false,
  quoteCreateModal: {
    origin_quote_no: '', // 保存源报价的quoteNo
    buyer_partner_id: '', // 客户id
    seller_partner_id: '', // 服务商id
    quote_type: '', // sales-客户报价，cost-服务商报价
    quote_name: '',
  },
  publishQuoteModal: {
    visible: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.VISIBLE_QUOTE_CREATE_MODAL:
      return {
        ...state,
        visibleCreateModal: action.data.visible,
        quoteCreateModal: action.data.quoteCreateModal || initialState.quoteCreateModal,
      };
    case actionTypes.QUOTES_LOAD:
      return {
        ...state,
        quotesList: { ...state.quotesList, quotesLoading: false },
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.QUOTES_LOAD_SUCCEED:
      return {
        ...state,
        quotesList: { ...state.quotesList, ...action.result.data, quotesLoading: false },
      };
    case actionTypes.QUOTE_PARAMS_LOAD:
      return { ...state, quoteNo: action.params.quoteNo };
    case actionTypes.QUOTE_PARAMS_LOAD_SUCCEED:
      return { ...state, quoteData: action.result.data };
    case actionTypes.QUOTE_FEES_LOAD:
      return { ...state, quoteFeesReload: false, quoteFeesLoading: true };
    case actionTypes.QUOTE_FEES_LOAD_SUCCEED:
      return { ...state, quoteFeesLoading: false, quoteFees: action.result.data };
    case actionTypes.REVISE_QUOTE_SETTING:
      return { ...state, quoteSaving: true };
    case actionTypes.REVISE_QUOTE_SETTING_FAIL:
      return { ...state, quoteSaving: false };
    case actionTypes.REVISE_QUOTE_SETTING_SUCCEED:
      return {
        ...state,
        quoteData: { ...state.quoteData, ...action.data.data },
        quoteSaving: false,
      };
    case actionTypes.RELOAD_QUOTE_FEES:
      return { ...state, quoteFeesReload: true };
    case actionTypes.SHOW_PUBLISH_QUOTE_MODAL: {
      return { ...state, publishQuoteModal: action.data };
    }
    case actionTypes.QUOTES_DELETE_SUCCEED: {
      const { totalCount, pageSize, current } = state.quotesList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, 1);
      return { ...state, quotesList: { ...state.quotesList, current: currentPage } };
    }
    default:
      return state;
  }
}

export function toggleQuoteCreateModal(visible, quote) {
  return {
    type: actionTypes.VISIBLE_QUOTE_CREATE_MODAL,
    data: {
      visible,
      quoteCreateModal: quote,
    },
  };
}

export function reloadQuoteFees() {
  return {
    type: actionTypes.RELOAD_QUOTE_FEES,
  };
}

export function loadQtModelbyTenantId(tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTE_MODELBY_LOAD,
        actionTypes.QUOTE_MODELBY_LOAD_SUCCEED,
        actionTypes.QUOTE_MODELBY_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/quote/loadModel/byTenantId',
      method: 'get',
      params: { tenantId },
      origin: 'mongo',
    },
  };
}

export function createQuote(quote) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_QUOTE,
        actionTypes.CREATE_QUOTE_SUCCEED,
        actionTypes.CREATE_QUOTE_FAIL,
      ],
      endpoint: 'v1/cms/quote/createQuote',
      method: 'post',
      data: quote,
    },
  };
}

export function cloneQuote(quote) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEES_COPY,
        actionTypes.FEES_COPY_SUCCEED,
        actionTypes.FEES_COPY_FAIL,
      ],
      endpoint: 'v1/cms/quote/fees/clone',
      method: 'post',
      data: quote,
    },
  };
}

export function loadQuoteTable(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTES_LOAD,
        actionTypes.QUOTES_LOAD_SUCCEED,
        actionTypes.QUOTES_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/quote/load',
      method: 'get',
      params,
    },
  };
}

export function loadQuoteParams(quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTE_PARAMS_LOAD,
        actionTypes.QUOTE_PARAMS_LOAD_SUCCEED,
        actionTypes.QUOTE_PARAMS_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/quote/params',
      method: 'get',
      params: { quoteNo },
    },
  };
}

export function loadQuoteFees(quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTE_FEES_LOAD,
        actionTypes.QUOTE_FEES_LOAD_SUCCEED,
        actionTypes.QUOTE_FEES_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/quote/fees',
      method: 'get',
      params: { quoteNo },
    },
  };
}

export function reviseQuoteSetting(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REVISE_QUOTE_SETTING,
        actionTypes.REVISE_QUOTE_SETTING_SUCCEED,
        actionTypes.REVISE_QUOTE_SETTING_FAIL,
      ],
      endpoint: 'v1/cms/quote/setting/revise',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function publishQuote(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PUBLISH_QUOTE,
        actionTypes.PUBLISH_QUOTE_SUCCEED,
        actionTypes.PUBLISH_QUOTE_FAIL,
      ],
      endpoint: 'v1/cms/quote/publish',
      method: 'post',
      data,
    },
  };
}

export function deleteQuotes(quoteNos) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTES_DELETE,
        actionTypes.QUOTES_DELETE_SUCCEED,
        actionTypes.QUOTES_DELETE_FAIL,
      ],
      endpoint: 'v1/cms/quote/batch/delete',
      method: 'post',
      data: { quoteNos },
    },
  };
}

export function updateFee(data, contentLog, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_UPDATE,
        actionTypes.FEE_UPDATE_SUCCEED,
        actionTypes.FEE_UPDATE_FAIL,
      ],
      endpoint: 'v1/cms/quote/fee/update',
      method: 'post',
      data: { data, contentLog, quoteNo },
    },
  };
}

export function addFees(feeCodes, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEES_ADD,
        actionTypes.FEES_ADD_SUCCEED,
        actionTypes.FEES_ADD_FAIL,
      ],
      endpoint: 'v1/cms/quote/fees/add',
      method: 'post',
      data: { feeCodes, quoteNo },
    },
  };
}

export function deleteFees(feeCodes, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEES_DELETE,
        actionTypes.FEES_DELETE_SUCCEED,
        actionTypes.FEES_DELETE_FAIL,
      ],
      endpoint: 'v1/cms/quote/fees/batch/delete',
      method: 'post',
      data: { feeCodes, quoteNo },
    },
  };
}

export function showPublishQuoteModal(visible) {
  return {
    type: actionTypes.SHOW_PUBLISH_QUOTE_MODAL,
    data: { visible },
  };
}
