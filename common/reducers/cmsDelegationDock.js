import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/delegation/', [
  'HIDE_PREVIEWER', 'SHOW_PREVIEWER', 'SET_PREW_TABKEY',
  'LOAD_CUSTOMSPANEL', 'LOAD_CUSTOMSPANEL_SUCCEED', 'LOAD_CUSTOMSPANEL_FAILED',
  'UPDATE_BLNO', 'UPDATE_BLNO_SUCCEED', 'UPDATE_BLNO_FAIL',
  'LOAD_BASIC_INFO', 'LOAD_BASIC_INFO_SUCCEED', 'LOAD_BASIC_INFO_FAILED',
  'SAVE_BASE_INFO', 'SAVE_BASE_INFO_SUCCEED', 'SAVE_BASE_INFO_FAIL',
  'TAX_PANE_LOAD', 'TAX_PANE_LOAD_SUCCEED', 'TAX_PANE_LOAD_FAIL',
  'TAX_RECALCULATE', 'TAX_RECALCULATE_SUCCEED', 'TAX_RECALCULATE_FAIL',
  'LOAD_DELG_MIFT_LIST', 'LOAD_DELG_MIFT_LIST_SUCCEED', 'LOAD_DELG_MIFT_LIST_FAIL',
  'LOAD_DELG_CUS_DECLS', 'LOAD_DELG_CUS_DECLS_SUCCEED', 'LOAD_DELG_CUS_DECLS_FAIL',
  'LOAD_DELG_DECL_RELATES', 'LOAD_DELG_DECL_RELATES_SUCCEED', 'LOAD_DELG_DECL_RELATES_FAIL',
]);

const initialState = {
  tabKey: 'masterInfo',
  basicPreviewLoading: false,
  customsPanelLoading: false,
  previewKey: '',
  previewer: {
    visible: false,
    delegation: {},
    // files: [],
    delgDispatch: {},
  },
  cusdeclList: [],
  shipmtOrderNo: '',
  manifestBodyList: {
    pageSize: 20,
    current: 1,
    data: [],
    totalCount: 0,
  },
  taxTots: [],
  taxMaps: {},
  delgDeclRelates: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_PREVIEWER:
      return {
        ...state,
        previewer: { ...state.previewer, visible: true },
        previewKey: action.payload.previewKey,
        tabKey: action.payload.tabKey,
      };
    case actionTypes.LOAD_BASIC_INFO:
      return { ...state, basicPreviewLoading: true };
    case actionTypes.LOAD_BASIC_INFO_FAILED:
      return { ...state, basicPreviewLoading: false };
    case actionTypes.LOAD_BASIC_INFO_SUCCEED: {
      return {
        ...state,
        previewer: { ...state.previewer, ...action.result.data },
        basicPreviewLoading: false,
        tabKey: action.payload.tabKey,
      };
    }
    case actionTypes.HIDE_PREVIEWER:
      return { ...state, previewer: { ...state.previewer, visible: false } };
    case actionTypes.SET_PREW_TABKEY:
      return { ...state, tabKey: action.data };
    case actionTypes.SAVE_BASE_INFO_SUCCEED: {
      const delg = { ...state.previewer.delegation, ...action.payload.change };
      return { ...state, previewer: { ...state.previewer, delegation: delg } };
    }
    case actionTypes.TAX_PANE_LOAD_SUCCEED:
      return {
        ...state,
        taxTots: action.result.data.taxTots,
        taxMaps: action.result.data.taxG,
      };
    case actionTypes.LOAD_DELG_MIFT_LIST_SUCCEED:
      return {
        ...state,
        manifestBodyList: action.result.data,
      };
    case actionTypes.LOAD_DELG_CUS_DECLS_SUCCEED:
      return {
        ...state,
        cusdeclList: action.result.data,
      };
    case actionTypes.LOAD_DELG_DECL_RELATES_SUCCEED:
      return { ...state, delgDeclRelates: action.result.data };
    default:
      return state;
  }
}

export function showPreviewer(previewKey, tabKey) {
  return {
    type: actionTypes.SHOW_PREVIEWER,
    payload: { previewKey, tabKey },
  };
}

export function loadBasicInfo(delgNo, tabKey) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BASIC_INFO,
        actionTypes.LOAD_BASIC_INFO_SUCCEED,
        actionTypes.LOAD_BASIC_INFO_FAILED,
      ],
      endpoint: 'v1/cms/delegate/previewer/basicInfo',
      method: 'get',
      params: { delgNo },
      payload: { tabKey },
    },
  };
}

export function loadDelgManifestList({ delgNo, pageSize, current }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DELG_MIFT_LIST,
        actionTypes.LOAD_DELG_MIFT_LIST_SUCCEED,
        actionTypes.LOAD_DELG_MIFT_LIST_FAIL,
      ],
      endpoint: 'v1/cms/manifest/limited/bodylist',
      method: 'get',
      params: { delgNo, pageSize, current },
    },
  };
}

export function loadDelgCusDecls({ delgNo }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DELG_CUS_DECLS,
        actionTypes.LOAD_DELG_CUS_DECLS_SUCCEED,
        actionTypes.LOAD_DELG_CUS_DECLS_FAIL,
      ],
      endpoint: 'v1/cms/delegation/load/cusdecls',
      method: 'get',
      params: { delgNo },
    },
  };
}

export function setPreviewTabkey(tabkey) {
  return {
    type: actionTypes.SET_PREW_TABKEY,
    data: tabkey,
  };
}

export function hideDock() {
  return {
    type: actionTypes.HIDE_PREVIEWER,
  };
}

export function exchangeBlNo(delgNo, changeInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BLNO,
        actionTypes.UPDATE_BLNO_SUCCEED,
        actionTypes.UPDATE_BLNO_FAIL,
      ],
      endpoint: 'v1/cms/delegation/exchange',
      method: 'post',
      data: { delgNo, changeInfo },
    },
  };
}

export function saveBaseInfo(change, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_BASE_INFO,
        actionTypes.SAVE_BASE_INFO_SUCCEED,
        actionTypes.SAVE_BASE_INFO_FAIL,
      ],
      endpoint: 'v1/cms/delegation/base/info/save',
      method: 'post',
      data: { change, delgNo },
      payload: { change },
    },
  };
}

export function loadPaneTax(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TAX_PANE_LOAD,
        actionTypes.TAX_PANE_LOAD_SUCCEED,
        actionTypes.TAX_PANE_LOAD_FAIL,
      ],
      endpoint: 'v1/cms/declare/tax/paneload',
      method: 'get',
      params: { delgNo },
    },
  };
}

export function taxRecalculate(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TAX_RECALCULATE,
        actionTypes.TAX_RECALCULATE_SUCCEED,
        actionTypes.TAX_RECALCULATE_FAIL,
      ],
      method: 'post',
      endpoint: 'v1/cms/declare/tax/recalculate',
      data: { delgNo },
    },
  };
}

export function loadDelgDeclRelates(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DELG_DECL_RELATES,
        actionTypes.LOAD_DELG_DECL_RELATES_SUCCEED,
        actionTypes.LOAD_DELG_DECL_RELATES_FAIL,
      ],
      endpoint: 'v1/cms/delegation/relate/decl',
      method: 'get',
      params: { delgNo },
    },
  };
}
