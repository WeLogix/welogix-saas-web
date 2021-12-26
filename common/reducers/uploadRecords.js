import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/upload/records/', [
  'UPLOAD_RECORDS_LOAD', 'UPLOAD_RECORDS_LOAD_SUCCEED', 'UPLOAD_RECORDS_LOAD_FAIL',
  'SET_RECORDS_RELOAD', 'TOGGLE_PANEL_VISIBLE',
  'LOAD_UPLOADPRG', 'LOAD_UPLOADPRG_SUCCEED', 'LOAD_UPLOADPRG_FAIL',
  'SET_UPLOADPROG',
  'LOAD_EXPTHISTRY', 'LOAD_EXPTHISTRY_SUCCEED', 'LOAD_EXPTHISTRY_FAIL',
]);

const initialState = {
  uploadProgress: 0,
  uploadRecords: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    reload: false,
  },
  filter: {},
  visible: false,
  exportHistoryList: [],
  listLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPLOAD_RECORDS_LOAD:
      return {
        ...state,
        uploadRecords: { ...state.uploadRecords, reload: false },
        filter: JSON.parse(action.params.filter),
      };
    case actionTypes.UPLOAD_RECORDS_LOAD_SUCCEED:
      return { ...state, uploadRecords: action.result.data };
    case actionTypes.SET_RECORDS_RELOAD: {
      return { ...state, uploadRecords: { ...state.uploadRecords, reload: action.reload } };
    }
    case actionTypes.TOGGLE_PANEL_VISIBLE: {
      let newUploadItems = state.uploadRecords;
      if (action.visible) {
        newUploadItems = { ...state.uploadRecords, reload: true };
      }
      return {
        ...state,
        visible: action.visible,
        filter: action.visible ? state.filter : {},
        uploadRecords: newUploadItems,
      };
    }
    case actionTypes.LOAD_UPLOADPRG_SUCCEED: {
      return {
        ...state,
        uploadProgress: action.result.data,
      };
    }
    case actionTypes.SET_UPLOADPROG:
      return { ...state, uploadProgress: action.data.progress };
    case actionTypes.LOAD_EXPTHISTRY:
      return { ...state, listLoading: true, exportHistoryList: [] };
    case actionTypes.LOAD_EXPTHISTRY_SUCCEED:
      return { ...state, listLoading: false, exportHistoryList: action.result.data };
    case actionTypes.LOAD_EXPTHISTRY_FAIL:
      return { ...state, listLoading: false };
    default:
      return state;
  }
}

export function loadUploadRecords({
  pageSize, current, type, filter,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPLOAD_RECORDS_LOAD,
        actionTypes.UPLOAD_RECORDS_LOAD_SUCCEED,
        actionTypes.UPLOAD_RECORDS_LOAD_FAIL,
      ],
      endpoint: 'v1/upload/records/load',
      method: 'get',
      params: {
        pageSize, current, type, filter,
      },
    },
  };
}

export function loadUploadProgress(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UPLOADPRG,
        actionTypes.LOAD_UPLOADPRG_SUCCEED,
        actionTypes.LOAD_UPLOADPRG_FAIL,
      ],
      endpoint: 'v1/upload/progress',
      method: 'get',
      params: {
        uploadNo,
      },
    },
  };
}

export function setUploadProgress(progress) {
  return {
    type: actionTypes.SET_UPLOADPROG,
    data: { progress },
  };
}

export function setUploadRecordsReload(reload) {
  return {
    type: actionTypes.SET_RECORDS_RELOAD,
    reload,
  };
}

export function togglePanelVisible(visible) {
  return {
    type: actionTypes.TOGGLE_PANEL_VISIBLE,
    visible,
  };
}

export function loadExportHistory(exportKey) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_EXPTHISTRY,
        actionTypes.LOAD_EXPTHISTRY_SUCCEED,
        actionTypes.LOAD_EXPTHISTRY_FAIL,
      ],
      endpoint: 'v1/saas/export/uploadhistory',
      method: 'get',
      params: { exportKey },
    },
  };
}
