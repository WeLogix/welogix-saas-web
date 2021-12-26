import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const initialState = {
  searchPanelVisible: false,
  documentPanelVisible: false,
  panelListLoading: false,
  riskAlarmPanel: {
    bizPanelVisible: false,
    fulPanelVisible: false,
    alarmIndiCount: 0,
    bizAlarmParam: {
      bizNo: undefined,
      bizObject: undefined,
    },
    bizAlarmList: [],
  },
  whetherReload: false,
  documentList: {
    current: 1,
    pageSize: 20,
    totalCount: 0,
    data: [],
  },
  documentFilter: {},
  docFolderModal: {
    visible: false,
    data: {},
  },
  docTaskPanel: {
    visible: false,
  },
  docUploadList: {
    current: 1,
    pageSize: 20,
    totalCount: 0,
    data: [],
  },
  docUploadFilter: {},
};
const actionTypes = createActionTypes('@@welogix/saas/infra/', [
  'SHOW_SEARCH_PANEL', 'HIDE_SEARCH_PANEL',
  'SHOW_DOCUMENT_PANEL', 'HIDE_DOCUMENT_PANEL',
  'TURN_FULRA_PANEL', 'TURN_BIZRA_PANEL', 'PAAS_BIZRA_PARAM',
  'LOAD_ALMCNT', 'LOAD_ALMCNT_SUCCEED', 'LOAD_ALMCNT_FAIL',
  'LOAD_BZALIST', 'LOAD_BZALIST_SUCCEED', 'LOAD_BZALIST_FAIL',
  'DISM_RKALM', 'DISM_RKALM_SUCCEED', 'DISM_RKALM_FAIL',
  'DETCK_RKALM', 'DETCK_RKALM_SUCCEED', 'DETCK_RKALM_FAIL',
  'LOAD_FOLDER_AND_FILE', 'LOAD_FOLDER_AND_FILE_SUCCEED', 'LOAD_FOLDER_AND_FILE_FAIL',
  'TOGGLE_FOLDER_MODAL', 'TOGGLE_PANEL_VISIBLE',
  'CREATE_FOLDER', 'CREATE_FOLDER_SUCCEED', 'CREATE_FOLDER_FAIL',
  'EDIT_FOLDER', 'EDIT_FOLDER_SUCCEED', 'EDIT_FOLDER_FAIL',
  'LOAD_UPLOAD_LIST', 'LOAD_UPLOAD_LIST_SUCCEED', 'LOAD_UPLOAD_LIST_FAIL',
  'DOWNLOAD_OSS_FILE', 'DOWNLOAD_OSS_FILE_SUCCEED', 'DOWNLOAD_OSS_FILE_FAIL',
  'DELETE_OSS_FILES', 'DELETE_OSS_FILES_SUCCEED', 'DELETE_OSS_FILES_FAIL',
  'MOVE_FILE_TO_FOLDER', 'MOVE_FILE_TO_FOLDER_SUCCEED', 'MOVE_FILE_TO_FOLDER_FAIL',
]);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_SEARCH_PANEL: {
      return {
        ...state,
        searchPanelVisible: true,
        documentPanelVisible: false,
        riskAlarmPanel: { ...state.riskAlarmPanel, fulPanelVisible: false },
      };
    }
    case actionTypes.HIDE_SEARCH_PANEL: {
      return { ...state, searchPanelVisible: false };
    }
    case actionTypes.SHOW_DOCUMENT_PANEL: {
      return {
        ...state,
        documentPanelVisible: true,
        searchPanelVisible: false,
        riskAlarmPanel: { ...state.riskAlarmPanel, fulPanelVisible: false },
      };
    }
    case actionTypes.HIDE_DOCUMENT_PANEL: {
      return { ...state, documentPanelVisible: false };
    }
    case actionTypes.TURN_FULRA_PANEL: {
      if (action.data.visible) {
        return {
          ...state,
          riskAlarmPanel: { ...initialState.riskAlarmPanel, fulPanelVisible: true },
          searchPanelVisible: false,
          documentPanelVisible: false,
        };
      }
      return {
        ...state,
        riskAlarmPanel: { ...initialState.riskAlarmPanel, fulPanelVisible: false },
      };
    }
    case actionTypes.TURN_BIZRA_PANEL:
      return {
        ...state,
        riskAlarmPanel: {
          ...state.riskAlarmPanel,
          bizPanelVisible: action.data.visible,
        },
      };
    case actionTypes.PAAS_BIZRA_PARAM:
      return { ...state, riskAlarmPanel: { ...state.riskAlarmPanel, bizAlarmParam: action.data } };
    case actionTypes.LOAD_BZALIST:
      return { ...state, panelListLoading: true };
    case actionTypes.LOAD_BZALIST_SUCCEED:
      return {
        ...state,
        panelListLoading: false,
        riskAlarmPanel: { ...state.riskAlarmPanel, bizAlarmList: action.result.data },
      };
    case actionTypes.LOAD_BZALIST_FAIL:
      return {
        ...state,
        panelListLoading: false,
        riskAlarmPanel: { ...state.riskAlarmPanel, bizAlarmList: [] },
      };
    case actionTypes.LOAD_ALMCNT_SUCCEED: {
      const riskAlarmPanel = { ...state.riskAlarmPanel };
      riskAlarmPanel.alarmIndiCount = action.result.data;
      if (!action.data.bizAlarmParam) {
        if (riskAlarmPanel.bizAlarmParam.bizNo) {
          riskAlarmPanel.bizAlarmParam = initialState.riskAlarmPanel.bizAlarmParam;
        }
        riskAlarmPanel.bizAlarmList = [];
      } else {
        riskAlarmPanel.bizAlarmParam = action.data.bizAlarmParam;
      }
      return { ...state, riskAlarmPanel };
    }
    case actionTypes.DISM_RKALM_SUCCEED:
      return {
        ...state,
        riskAlarmPanel: {
          ...state.riskAlarmPanel,
          alarmIndiCount: 0,
          bizAlarmList: [],
        },
      };
    case actionTypes.TOGGLE_FOLDER_MODAL:
      return { ...state, docFolderModal: action.payload };
    case actionTypes.TOGGLE_PANEL_VISIBLE:
      return { ...state, docTaskPanel: action.payload };
    case actionTypes.LOAD_FOLDER_AND_FILE: {
      const listFilter = JSON.parse(action.params.filter);
      return { ...state, documentFilter: listFilter };
    }
    case actionTypes.LOAD_FOLDER_AND_FILE_SUCCEED:
      return { ...state, documentList: action.result.data, whetherReload: false };
    case actionTypes.LOAD_FOLDER_AND_FILE_FAIL:
      return { ...state, whetherReload: false };
    case actionTypes.LOAD_FOLDER_LIST_FAIL:
      return { ...state, whetherReload: false };
    case actionTypes.LOAD_UPLOAD_LIST: {
      const listFilter = JSON.parse(action.params.filter);
      return { ...state, docUploadFilter: listFilter };
    }
    case actionTypes.LOAD_UPLOAD_LIST_SUCCEED:
      return { ...state, docUploadList: action.result.data };
    case actionTypes.CREATE_FOLDER_SUCCEED:
    case actionTypes.EDIT_FOLDER_SUCCEED:
    case actionTypes.DELETE_OSS_FILES_SUCCEED:
      return { ...state, whetherReload: true };
    default:
      return state;
  }
}

export function showSearchPanel() {
  return {
    type: actionTypes.SHOW_SEARCH_PANEL,
  };
}

export function hideSearchPanel() {
  return {
    type: actionTypes.HIDE_SEARCH_PANEL,
  };
}

export function showDocumentPanel() {
  return {
    type: actionTypes.SHOW_DOCUMENT_PANEL,
  };
}

export function hideDocumentPanel() {
  return {
    type: actionTypes.HIDE_DOCUMENT_PANEL,
  };
}

export function turnFullRiskAlarmPanel(visible) {
  return {
    type: actionTypes.TURN_FULRA_PANEL,
    data: { visible },
  };
}

export function turnBizRiskAlarmPanel(visible) {
  return {
    type: actionTypes.TURN_BIZRA_PANEL,
    data: { visible },
  };
}

export function loadAlarmIndiCount(bizAlarmParam) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALMCNT,
        actionTypes.LOAD_ALMCNT_SUCCEED,
        actionTypes.LOAD_ALMCNT_FAIL,
      ],
      endpoint: 'v1/paas/risk/alarmindicount',
      method: 'post',
      data: { bizAlarmParam },
    },
  };
}

export function paasBizRiskAlarmParam(bizAlarmObj) {
  return {
    type: actionTypes.PAAS_BIZRA_PARAM,
    data: bizAlarmObj,
  };
}

export function loadBizAlarmList(bizAlarmParam, alarmStatus, alarmLevel) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BZALIST,
        actionTypes.LOAD_BZALIST_SUCCEED,
        actionTypes.LOAD_BZALIST_FAIL,
      ],
      endpoint: 'v1/paas/risk/bizalarmlist',
      method: 'post',
      data: { bizAlarmParam, alarmStatus, alarmLevel },
    },
  };
}

export function dismissRiskAlarm(riskAlarmId, bizAlarmParam) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DISM_RKALM,
        actionTypes.DISM_RKALM_SUCCEED,
        actionTypes.DISM_RKALM_FAIL,
      ],
      endpoint: 'v1/paas/risk/dismissalarm',
      method: 'post',
      data: { riskAlarmId, bizAlarmParam },
    },
  };
}

export function detectRiskAlarm(bizAlarmParam) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DETCK_RKALM,
        actionTypes.DETCK_RKALM_SUCCEED,
        actionTypes.DETCK_RKALM_FAIL,
      ],
      endpoint: 'v1/paas/risk/detectalarm',
      method: 'post',
      data: { bizAlarmParam },
    },
  };
}

export function loadDocumentList(current, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FOLDER_AND_FILE,
        actionTypes.LOAD_FOLDER_AND_FILE_SUCCEED,
        actionTypes.LOAD_FOLDER_AND_FILE_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attfilelist',
      method: 'get',
      params: { current, pageSize, filter: JSON.stringify(filter) },
    },
  };
}

export function toggleFolderModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_FOLDER_MODAL,
    payload: { visible, data },
  };
}

export function createFolder(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_FOLDER,
        actionTypes.CREATE_FOLDER_SUCCEED,
        actionTypes.CREATE_FOLDER_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attnewfolder',
      method: 'post',
      data,
    },
  };
}

export function editFolder(data, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_FOLDER,
        actionTypes.EDIT_FOLDER_SUCCEED,
        actionTypes.EDIT_FOLDER_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attfolderupdate',
      method: 'post',
      data: { folderUpdate: data, folderId: id },
    },
  };
}

export function toggleDocTaskPanelVisible(visible) {
  return {
    type: actionTypes.TOGGLE_PANEL_VISIBLE,
    payload: { visible },
  };
}

export function loadUploadList(current, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UPLOAD_LIST,
        actionTypes.LOAD_UPLOAD_LIST_SUCCEED,
        actionTypes.LOAD_UPLOAD_LIST_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attfilehistory',
      method: 'get',
      params: { current, pageSize, filter: JSON.stringify(filter) },
    },
  };
}

export function deleteOssFiles(docIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_OSS_FILES,
        actionTypes.DELETE_OSS_FILES_SUCCEED,
        actionTypes.DELETE_OSS_FILES_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attdelete',
      method: 'post',
      data: { docIds },
    },
  };
}

export function moveFileToFolder(parentDocId, docId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MOVE_FILE_TO_FOLDER,
        actionTypes.MOVE_FILE_TO_FOLDER_SUCCEED,
        actionTypes.MOVE_FILE_TO_FOLDER_FAIL,
      ],
      endpoint: 'v1/saas/biz/attachment/attmove',
      method: 'post',
      data: { parentDocId, docId },
    },
  };
}
