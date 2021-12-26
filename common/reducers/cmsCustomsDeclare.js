import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/declaration/', [
  'LOAD_CUSTOMS_DECLS', 'LOAD_CUSTOMS_DECLS_SUCCEED', 'LOAD_CUSTOMS_DECLS_FAIL',
  'LOAD_DECLHEAD', 'LOAD_DECLHEAD_SUCCEED', 'LOAD_DECLHEAD_FAIL',
  'SET_INSPECT', 'SET_INSPECT_SUCCEED', 'SET_INSPECT_FAIL',
  'DELETE_DECL', 'DELETE_DECL_SUCCEED', 'DELETE_DECL_FAIL',
  'SET_REVIEWED', 'SET_REVIEWED_SUCCEED', 'SET_REVIEWED_FAIL',
  'CHECK_REVIEW', 'CHECK_REVIEW_SUCCEED', 'CHECK_REVIEW_FAIL',
  'SHOW_SEND_DECL_MODAL', 'CLEAN_CUSTOMSRES',
  'SEND_DECL', 'SEND_DECL_SUCCEED', 'SEND_DECL_FAIL',
  'LOAD_CLEARANCE_RESULTS', 'LOAD_CLEARANCE_RESULTS_SUCCEED', 'LOAD_CLEARANCE_RESULTS_FAIL',
  'OPEN_DECL_RELEASED_MODAL', 'CLOSE_DECL_RELEASED_MODAL',
  'CLEAR_CUSTOMS', 'CLEAR_CUSTOMS_SUCCEED', 'CLEAR_CUSTOMS_FAIL',
  'SEND_MUTI_DECL', 'SEND_MUTI_DECL_SUCCEED', 'SEND_MUTI_DECL_FAIL',
  'SHOW_BATCH_SEND_MODAL', 'SHOW_BATCH_SEND_MODAL_SUCCEED', 'SHOW_BATCH_SEND_MODAL_FAIL',
  'CLOSE_BATCH_SEND_MODAL', 'SHOW_DECL_LOG', 'HIDE_DECL_LOG',
  'LOAD_PESEND_RECORDS', 'LOAD_PESEND_RECORDS_SUCCEED', 'LOAD_PESEND_RECORDS_FAIL',
  'LOAD_SEND_RECORDS', 'LOAD_SEND_RECORDS_SUCCEED', 'LOAD_SEND_RECORDS_FAIL',
  'LOAD_RETURN_RECORDS', 'LOAD_RETURN_RECORDS_SUCCEED', 'LOAD_RETURN_RECORDS_FAIL',
  'SHOW_DECL_MSG_DOCK', 'HIDE_DECL_MSG_DOCK', 'TOGGLE_DECL_MSG_MODAL',
  'VALIDATE_ENTRY_ID', 'VALIDATE_ENTRY_ID_SUCCEED', 'VALIDATE_ENTRY_ID_FAIL',
  'UPLOAD_DECL', 'UPLOAD_DECL_SUCCEED', 'UPLOAD_DECL_FAIL',
  'GET_DECL_TAX', 'GET_DECL_TAX_SUCCEED', 'GET_DECL_TAX_FAIL',
  'TOGGLE_INSPECT_MODAL', 'TOGGLE_DECL_MOD_MODAL',
  'MOD_DECL', 'MOD_DECL_SUCCEED', 'MOD_DECL_FAIL',
  'CONFIRM_REVISE', 'CONFIRM_REVISE_SUCCEED', 'CONFIRM_REVISE_FAIL',
  'GET_REVISE_DECL', 'GET_REVISE_DECL_SUCCEED', 'GET_REVISE_DECL_FAIL',
  'ROLLBACK_REVISED_REVOKED_DECL', 'ROLLBACK_REVISED_REVOKED_DECL_SUCCEED', 'ROLLBACK_REVISED_REVOKED_DECL_FAIL',
  'TOGGLE_RETURN_MSG_PANEL',
  'VALIDATE_DECL_CIQ_INFO', 'VALIDATE_DECL_CIQ_INFO_SUCCEED', 'VALIDATE_DECL_CIQ_INFO_FAIL',
  'SAVE_CIQ_NO', 'SAVE_CIQ_NO_SUCCEED', 'SAVE_CIQ_NO_FAIL', 'TOGGLE_CIQNO_MODAL',
]);

const initialState = {
  listFilter: {
    scenario: 'all',
    clientView: { tenantIds: [], partnerIds: [] },
    filterDate: [],
    declareType: '',
    name: '',
    sortField: '',
    sortOrder: '',
  },
  customslist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  decl_heads: [],
  sendDeclModal: {
    defaultDecl: { channel: '', dectype: '', appuuid: '' },
    visible: false,
    ietype: '',
    preEntrySeqNo: '',
    delgNo: '',
    agentCustCo: '',
    agentCode: '',
    ieDate: '',
  },
  batchSendModal: {
    visible: false,
    sendDecls: [],
    sendAgents: [],
    easilist: {},
    agentSwclientMap: {},
    ietype: 0,
  },
  visibleClearModal: false,
  clearFillModal: {
    entryNo: '',
    preEntrySeqNo: '',
  },
  declSubmitting: false,
  customsResults: [],
  customsResultsLoading: false,
  sendRecords: {
    totalCount: 0,
    pageSize: 10,
    current: 1,
    data: [],
  },
  returnRecords: {
    totalCount: 0,
    pageSize: 10,
    current: 1,
    data: [],
  },
  declMsgDock: {
    visible: false,
  },
  declLogPanel: {
    visible: false,
  },
  inspectModal: {
    visible: false,
    customs: {},
  },
  declModModal: {
    visible: false,
    customs: {},
  },
  revisedBodies: [],
  declMsgModal: {
    visible: false,
    fileName: '',
    fileType: '',
  },
  returnMsgPanel: {
    visible: false,
    returnFile: '',
    entryId: '',
  },
  ciqNoModal: {
    visible: false,
    data: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_CUSTOMS_DECLS:
      return { ...state, customslist: { ...state.customslist, loading: true } };
    case actionTypes.LOAD_CUSTOMS_DECLS_SUCCEED:
      return {
        ...state,
        customslist: { ...state.customslist, loading: false, ...action.result.data },
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_CUSTOMS_DECLS_FAIL:
      return { ...state, customslist: { ...state.customslist, loading: false } };
    case actionTypes.LOAD_DECLHEAD_SUCCEED:
      return { ...state, decl_heads: action.result.data };
    case actionTypes.SHOW_SEND_DECL_MODAL:
      return { ...state, sendDeclModal: { ...state.sendDeclModal, ...action.data } };
    case actionTypes.LOAD_CLEARANCE_RESULTS:
      return { ...state, customsResultsLoading: true };
    case actionTypes.LOAD_CLEARANCE_RESULTS_SUCCEED:
      return { ...state, customsResultsLoading: false, customsResults: action.result.data };
    case actionTypes.LOAD_CLEARANCE_RESULTS_FAIL:
      return { ...state, customsResultsLoading: false };
    case actionTypes.CLEAN_CUSTOMSRES:
      return { ...state, customsResults: [] };
    case actionTypes.OPEN_DECL_RELEASED_MODAL:
      return { ...state, visibleClearModal: true, clearFillModal: action.data };
    case actionTypes.CLOSE_DECL_RELEASED_MODAL:
      return { ...state, visibleClearModal: false, clearFillModal: initialState.clearFillModal };
    case actionTypes.SHOW_BATCH_SEND_MODAL_SUCCEED:
      return {
        ...state,
        batchSendModal: {
          ...state.batchSendModal,
          visible: true,
          ietype: action.data.ietype,
          ...action.result.data,
        },
      };
    case actionTypes.CLOSE_BATCH_SEND_MODAL:
      return { ...state, batchSendModal: initialState.batchSendModal };
    case actionTypes.LOAD_SEND_RECORDS_SUCCEED:
      return { ...state, sendRecords: { ...action.result.data } };
    case actionTypes.LOAD_RETURN_RECORDS_SUCCEED:
      return { ...state, returnRecords: { ...action.result.data } };
    case actionTypes.SHOW_DECL_MSG_DOCK:
      return { ...state, declMsgDock: { ...state.declMsgDock, visible: true } };
    case actionTypes.HIDE_DECL_MSG_DOCK:
      return { ...state, declMsgDock: { ...state.declMsgDock, visible: false } };
    case actionTypes.SHOW_DECL_LOG:
      return { ...state, declLogPanel: { ...state.declLogPanel, visible: true } };
    case actionTypes.HIDE_DECL_LOG:
      return { ...state, declLogPanel: { ...state.declLogPanel, visible: false } };
    case actionTypes.TOGGLE_INSPECT_MODAL:
      return {
        ...state,
        inspectModal: {
          ...state.inspectModal, visible: action.data.visible, customs: action.data.customs,
        },
      };
    case actionTypes.TOGGLE_DECL_MOD_MODAL:
      return {
        ...state,
        declModModal: {
          ...state.declModModal, visible: action.data.visible, customs: action.data.customs,
        },
      };
    case actionTypes.GET_REVISE_DECL_SUCCEED:
      return {
        ...state,
        revisedBodies: action.result.data,
      };
    case actionTypes.TOGGLE_DECL_MSG_MODAL:
      return {
        ...state,
        declMsgModal: {
          ...state.declMsgModal,
          visible: action.visible,
          fileName: action.fileName,
          fileType: action.fileType,
        },
      };
    case actionTypes.CLEAR_CUSTOMS:
      return { ...state, declSubmitting: true };
    case actionTypes.CLEAR_CUSTOMS_SUCCEED:
    case actionTypes.CLEAR_CUSTOMS_FAIL:
      return { ...state, declSubmitting: false };
    case actionTypes.TOGGLE_RETURN_MSG_PANEL:
      return { ...state, returnMsgPanel: action.data };
    case actionTypes.TOGGLE_CIQNO_MODAL:
      return { ...state, ciqNoModal: action.data };
    default:
      return state;
  }
}

export function setInspect(id, inspectInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SET_INSPECT,
        actionTypes.SET_INSPECT_SUCCEED,
        actionTypes.SET_INSPECT_FAIL,
      ],
      endpoint: 'v1/cms/declare/set/inspect',
      method: 'post',
      data: { id, inspectInfo },
    },
  };
}

export function loadDeclHead(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DECLHEAD,
        actionTypes.LOAD_DECLHEAD_SUCCEED,
        actionTypes.LOAD_DECLHEAD_FAIL,
      ],
      endpoint: 'v1/cms/declare/get/declheads',
      method: 'get',
      params: { delgNo },
    },
  };
}

export function loadCustomsDecls(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CUSTOMS_DECLS,
        actionTypes.LOAD_CUSTOMS_DECLS_SUCCEED,
        actionTypes.LOAD_CUSTOMS_DECLS_FAIL,
      ],
      endpoint: 'v1/cms/decl/customs',
      method: 'get',
      params,
    },
  };
}

export function deleteDecl(declId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_DECL,
        actionTypes.DELETE_DECL_SUCCEED,
        actionTypes.DELETE_DECL_FAIL,
      ],
      endpoint: 'v1/cms/declare/delete',
      method: 'post',
      data: { declId },
    },
  };
}

export function setDeclReviewed(declIds, status, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SET_REVIEWED,
        actionTypes.SET_REVIEWED_SUCCEED,
        actionTypes.SET_REVIEWED_FAIL,
      ],
      endpoint: 'v1/cms/declare/set/reviewed',
      method: 'post',
      data: { declIds, status, opContent },
    },
  };
}

// 复核人员退回操作
export function rejectManifestReview(declIds, reason) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHECK_REVIEW,
        actionTypes.CHECK_REVIEW_SUCCEED,
        actionTypes.CHECK_REVIEW_FAIL,
      ],
      endpoint: 'v1/cms/declare/reject/review',
      method: 'post',
      data: { declIds, reason },
    },
  };
}

export function sendDecl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEND_DECL,
        actionTypes.SEND_DECL_SUCCEED,
        actionTypes.SEND_DECL_FAIL,
      ],
      endpoint: 'v1/cms/declare/send',
      method: 'post',
      data,
    },
  };
}

export function sendMutiDecl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEND_MUTI_DECL,
        actionTypes.SEND_MUTI_DECL_SUCCEED,
        actionTypes.SEND_MUTI_DECL_FAIL,
      ],
      endpoint: 'v1/cms/declare/muti/send',
      method: 'post',
      data,
    },
  };
}

export function showSendDeclModal({
  visible,
  ietype, preEntrySeqNo = '', delgNo = '', agentCustCo, defaultDecl, agentCode, ieDate,
}) {
  return {
    type: actionTypes.SHOW_SEND_DECL_MODAL,
    data: {
      visible, ietype, preEntrySeqNo, delgNo, agentCustCo, defaultDecl, agentCode, ieDate,
    },
  };
}

export function loadClearanceResults(entryId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CLEARANCE_RESULTS,
        actionTypes.LOAD_CLEARANCE_RESULTS_SUCCEED,
        actionTypes.LOAD_CLEARANCE_RESULTS_FAIL,
      ],
      endpoint: 'v1/cms/customs/results',
      method: 'get',
      params: { entryId },
    },
  };
}

export function clearClearanceResults() {
  return { type: actionTypes.CLEAN_CUSTOMSRES };
}

export function openDeclReleasedModal(entryNo, preEntrySeqNo, delgNo, ietype) {
  return {
    type: actionTypes.OPEN_DECL_RELEASED_MODAL,
    data: {
      preEntrySeqNo, entryNo, delgNo, ietype,
    },
  };
}

export function closeDeclReleasedModal() {
  return {
    type: actionTypes.CLOSE_DECL_RELEASED_MODAL,
  };
}

export function setDeclReleased(clearInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CLEAR_CUSTOMS,
        actionTypes.CLEAR_CUSTOMS_SUCCEED,
        actionTypes.CLEAR_CUSTOMS_FAIL,
      ],
      endpoint: 'v1/cms/customs/clear',
      method: 'post',
      data: clearInfo,
    },
  };
}

export function showBatchSendModal(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SHOW_BATCH_SEND_MODAL,
        actionTypes.SHOW_BATCH_SEND_MODAL_SUCCEED,
        actionTypes.SHOW_BATCH_SEND_MODAL_FAIL,
      ],
      endpoint: 'v1/cms/customs/decl/loadbatchsend',
      method: 'post',
      data,
    },
  };
}

export function closeBatchSendModal() {
  return {
    type: actionTypes.CLOSE_BATCH_SEND_MODAL,
  };
}

export function loadSendRecords({ searchText, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SEND_RECORDS,
        actionTypes.LOAD_SEND_RECORDS_SUCCEED,
        actionTypes.LOAD_SEND_RECORDS_FAIL,
      ],
      endpoint: 'v1/cms/send/records/load',
      method: 'get',
      params: { searchText, current, pageSize },
    },
  };
}

export function loadReturnRecords({ preEntrySeqNo, current, pageSize }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_RETURN_RECORDS,
        actionTypes.LOAD_RETURN_RECORDS_SUCCEED,
        actionTypes.LOAD_RETURN_RECORDS_FAIL,
      ],
      endpoint: 'v1/cms/return/records/load',
      method: 'get',
      params: { preEntrySeqNo, current, pageSize },
    },
  };
}

export function loadLatestSendRecord(searchText) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PESEND_RECORDS,
        actionTypes.LOAD_PESEND_RECORDS_SUCCEED,
        actionTypes.LOAD_PESEND_RECORDS_FAIL,
      ],
      endpoint: 'v1/cms/send/records/load',
      method: 'get',
      params: { searchText, current: 1, pageSize: 1 },
    },
  };
}

export function showDeclMsgDock() {
  return {
    type: actionTypes.SHOW_DECL_MSG_DOCK,
  };
}

export function hideDeclMsgDock() {
  return {
    type: actionTypes.HIDE_DECL_MSG_DOCK,
  };
}

export function toggleInspectModal(visible, customs = {}) {
  return {
    type: actionTypes.TOGGLE_INSPECT_MODAL,
    data: { visible, customs },
  };
}

export function toggleDeclModModal(visible, customs = {}) {
  return {
    type: actionTypes.TOGGLE_DECL_MOD_MODAL,
    data: { visible, customs },
  };
}

export function validateEntryId(entryNo, decUnifiedNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VALIDATE_ENTRY_ID,
        actionTypes.VALIDATE_ENTRY_ID_SUCCEED,
        actionTypes.VALIDATE_ENTRY_ID_FAIL,
      ],
      endpoint: 'v1/cms/validate/entryid',
      method: 'get',
      params: { entryNo, decUnifiedNo },
    },
  };
}

export function showDeclLog() {
  return {
    type: actionTypes.SHOW_DECL_LOG,
  };
}

export function hideDeclLog() {
  return {
    type: actionTypes.HIDE_DECL_LOG,
  };
}

export function getDeclTax(preEntrySeqNo, merged) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_DECL_TAX,
        actionTypes.GET_DECL_TAX_SUCCEED,
        actionTypes.GET_DECL_TAX_FAIL,
      ],
      endpoint: 'v1/cms/decl/tax/get',
      method: 'get',
      params: { preEntrySeqNo, merged },
    },
  };
}

export function modDecl(preEntrySeqNo, reviseData) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MOD_DECL,
        actionTypes.MOD_DECL_SUCCEED,
        actionTypes.MOD_DECL_FAIL,
      ],
      endpoint: 'v1/cms/customs/decl/mod',
      method: 'post',
      data: {
        preEntrySeqNo, reviseData,
      },
    },
  };
}

export function confirmRevise({ head, bodies, originDeclId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CONFIRM_REVISE,
        actionTypes.CONFIRM_REVISE_SUCCEED,
        actionTypes.CONFIRM_REVISE_FAIL,
      ],
      endpoint: 'v1/cms/customs/decl/revise/confirm',
      method: 'post',
      data: {
        head, bodies, originDeclId,
      },
    },
  };
}

export function getRevisedDecl(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_REVISE_DECL,
        actionTypes.GET_REVISE_DECL_SUCCEED,
        actionTypes.GET_REVISE_DECL_FAIL,
      ],
      endpoint: 'v1/cms/customs/revisedecl/entry',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

export function rollbackRevisedRevokedDecl(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ROLLBACK_REVISED_REVOKED_DECL,
        actionTypes.ROLLBACK_REVISED_REVOKED_DECL_SUCCEED,
        actionTypes.ROLLBACK_REVISED_REVOKED_DECL_FAIL,
      ],
      endpoint: 'v1/cms/customs/revisevoke/rollback',
      method: 'post',
      data: { preEntrySeqNo },
    },
  };
}

export function toggleDeclMsgModal(visible, fileName = '', fileType = '') {
  return {
    type: actionTypes.TOGGLE_DECL_MSG_MODAL,
    visible,
    fileName,
    fileType,
  };
}

export function toggleReturnMsgPanel(visible, returnFile = '', entryId = '') {
  return {
    type: actionTypes.TOGGLE_RETURN_MSG_PANEL,
    data: { visible, returnFile, entryId },
  };
}

export function validateReviewedDecl(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VALIDATE_DECL_CIQ_INFO,
        actionTypes.VALIDATE_DECL_CIQ_INFO_SUCCEED,
        actionTypes.VALIDATE_DECL_CIQ_INFO_FAIL,
      ],
      endpoint: 'v1/cms/customs/declvalidate',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

export function saveCiqNo(preEntrySeqNo, ciqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_CIQ_NO,
        actionTypes.SAVE_CIQ_NO_SUCCEED,
        actionTypes.SAVE_CIQ_NO_FAIL,
      ],
      endpoint: 'v1/cms/customs/save/ciqno',
      method: 'post',
      data: {
        preEntrySeqNo, ciqNo,
      },
    },
  };
}

export function toggleCiqNoModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_CIQNO_MODAL,
    data: { visible, data },
  };
}
