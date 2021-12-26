import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/tms/quote/', [
  'QUOTE_FEES_LOAD', 'QUOTE_FEES_LOAD_SUCCEED', 'QUOTE_FEES_LOAD_FAIL',
  'FEES_ADD', 'FEES_ADD_SUCCEED', 'FEES_ADD_FAIL',
  'FEE_UPDATE', 'FEE_UPDATE_SUCCEED', 'FEE_UPDATE_FAIL',
  'FEES_DELETE', 'FEES_DELETE_SUCCEED', 'FEES_DELETE_FAIL',
]);

const initialState = {
  quoteNo: '',
  quoteFees: [],
  quotesList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  quoteFeesLoading: false,
  quoteFeesReload: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.QUOTE_FEES_LOAD:
      return { ...state, quoteFeesReload: false, quoteFeesLoading: true };
    case actionTypes.QUOTE_FEES_LOAD_SUCCEED:
      return { ...state, quoteFeesLoading: false, quoteFees: action.result.data };
    case actionTypes.QUOTE_FEES_LOAD_FAIL:
      return { ...state, quoteFeesLoading: false };
    default:
      return state;
  }
}

export function loadQuoteFees(quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUOTE_FEES_LOAD,
        actionTypes.QUOTE_FEES_LOAD_SUCCEED,
        actionTypes.QUOTE_FEES_LOAD_FAIL,
      ],
      endpoint: 'v1/tms/quote/fees',
      method: 'get',
      params: { quoteNo },
    },
  };
}

export function updateFee(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEE_UPDATE,
        actionTypes.FEE_UPDATE_SUCCEED,
        actionTypes.FEE_UPDATE_FAIL,
      ],
      endpoint: 'v1/tms/quote/fee/update',
      method: 'post',
      data,
    },
  };
}

export function addFee(feeCodes, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEES_ADD,
        actionTypes.FEES_ADD_SUCCEED,
        actionTypes.FEES_ADD_FAIL,
      ],
      endpoint: 'v1/tms/quote/fee/adds',
      method: 'post',
      data: { feeCodes, quoteNo },
    },
  };
}

export function deleteFee(feeCodes, quoteNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FEES_DELETE,
        actionTypes.FEES_DELETE_SUCCEED,
        actionTypes.FEES_DELETE_FAIL,
      ],
      endpoint: 'v1/tms/quote/fee/deletes',
      method: 'post',
      data: { feeCodes, quoteNo },
    },
  };
}
