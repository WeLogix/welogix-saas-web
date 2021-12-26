import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/pts/inventory/', [
  'NOTIFY_FORM_CHANGED',
  'LOAD_PTS_INVT_LIST', 'LOAD_PTS_INVT_LIST_SUCCEED', 'LOAD_PTS_INVT_LIST_FAIL',
  'LOAD_PTS_INVT_HEAD', 'LOAD_PTS_INVT_HEAD_SUCCEED', 'LOAD_PTS_INVT_HEAD_FAIL',
  'UPDATE_PTS_INVT_HEAD', 'UPDATE_PTS_INVT_HEAD_SUCCEED', 'UPDATE_PTS_INVT_HEAD_FAIL',
  'LOAD_INVT_BODY_LIST', 'LOAD_INVT_BODY_LIST_SUCCEED', 'LOAD_INVT_BODY_LIST_FAIL',
  'UPDATE_INVT_BODY', 'UPDATE_INVT_BODY_SUCCEED', 'UPDATE_INVT_BODY_FAIL',
]);

const initialState = {
  invtFilters: {
    invt_status: 'all',
    partnerId: 'all',
  },
  invtList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  invtListLoading: true,
  invtData: {},
  formChanged: false,
  invtBodyList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  bodylistLoading: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PTS_INVT_LIST:
      return {
        ...state,
        invtFilters: JSON.parse(action.params.filters),
        invtListLoading: true,
      };
    case actionTypes.LOAD_PTS_INVT_LIST_SUCCEED:
      return {
        ...state,
        invtListLoading: false,
        invtList: { ...state.invtList, ...action.result.data },
      };
    case actionTypes.LOAD_PTS_INVT_HEAD_SUCCEED:
      return {
        ...state,
        invtData: action.result.data,
      };
    case actionTypes.NOTIFY_FORM_CHANGED:
      return {
        ...state,
        formChanged: action.changed,
      };
    case actionTypes.LOAD_INVT_BODY_LIST:
      return {
        ...state,
        bodylistLoading: true,
      };
    case actionTypes.LOAD_INVT_BODY_LIST_SUCCEED:
      return {
        ...state,
        invtBodyList: action.result.data,
        bodylistLoading: false,
      };
    default:
      return state;
  }
}

export function loadPtsInvtList({
  ieType, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PTS_INVT_LIST,
        actionTypes.LOAD_PTS_INVT_LIST_SUCCEED,
        actionTypes.LOAD_PTS_INVT_LIST_FAIL,
      ],
      endpoint: 'v1/pts/impexp/invtlist',
      method: 'get',
      params: {
        ieType, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadPtsInvtHead(copInvtregNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PTS_INVT_HEAD,
        actionTypes.LOAD_PTS_INVT_HEAD_SUCCEED,
        actionTypes.LOAD_PTS_INVT_HEAD_FAIL,
      ],
      endpoint: 'v1/pts/impexp/invthead',
      method: 'get',
      params: { copInvtregNo },
    },
  };
}

export function notifyFormChanged(changed) {
  return {
    type: actionTypes.NOTIFY_FORM_CHANGED,
    changed,
  };
}

export function updatePtsInvtHead(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PTS_INVT_HEAD,
        actionTypes.UPDATE_PTS_INVT_HEAD_SUCCEED,
        actionTypes.UPDATE_PTS_INVT_HEAD_FAIL,
      ],
      endpoint: 'v1/pts/impexp/updinvthead',
      method: 'post',
      data,
    },
  };
}

export function loadInvtBodyList({
  copInvtNo, pageSize, current,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVT_BODY_LIST,
        actionTypes.LOAD_INVT_BODY_LIST_SUCCEED,
        actionTypes.LOAD_INVT_BODY_LIST_FAIL,
      ],
      endpoint: 'v1/pts/impexp/invtgoodslist',
      method: 'get',
      params: {
        copInvtNo, pageSize, current,
      },
    },
  };
}

export function updateInvtBody(data, contentLog, copInvtNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_INVT_BODY,
        actionTypes.UPDATE_INVT_BODY_SUCCEED,
        actionTypes.UPDATE_INVT_BODY_FAIL,
      ],
      endpoint: 'v1/pts/impexp/updateinvtgoods',
      method: 'post',
      data: { data, contentLog, copInvtNo },
    },
  };
}

