import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/upload/records/', [
  'LOAD_TENANT_FIELDS', 'LOAD_TENANT_FIELDS_SUCCEED', 'LOAD_TENANT_FIELDS_FAIL',
  'UPDATE_META', 'UPDATE_META_SUCCEED', 'UPDATE_META_FAIL',
  'LOAD_DWOBJM', 'LOAD_DWOBJM_SUCCEED', 'LOAD_DWOBJM_FAIL',
  'LOAD_TENANT_BMOBJ', 'LOAD_TENANT_BMOBJ_SUCCEED', 'LOAD_TENANT_BMOBJ_FAIL',
  'UPSERT_TENANT_BMOBJ', 'UPSERT_TENANT_BMOBJ_SUCCEED', 'UPSERT_TENANT_BMOBJ_FAIL',
  'TOGGLE_TRANSFER_MODAL',
  'LOAD_SOURCE_BMOBJ', 'LOAD_SOURCE_BMOBJ_SUCCEED', 'LOAD_SOURCE_BMOBJ_FAIL',
]);

const initialState = {
  dwObjectList: {
    loading: false,
    metaList: [],
  },
  fieldsLoading: false,
  bmObjs: [],
  transferModal: {
    visible: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_DWOBJM:
      return { ...state, dwObjectList: { ...state.dwObjectList, loading: true } };
    case actionTypes.LOAD_DWOBJM_SUCCEED:
      return { ...state, dwObjectList: { metaList: action.result.data, loading: false } };
    case actionTypes.LOAD_DWOBJM_FAIL:
      return { ...state, dwObjectList: { ...state.dwObjectList, loading: false } };
    case actionTypes.LOAD_TENANT_FIELDS:
      return {
        ...state, fieldsLoading: true,
      };
    case actionTypes.LOAD_TENANT_FIELDS_SUCCEED:
      return {
        ...state, fieldsLoading: false,
      };
    case actionTypes.LOAD_TENANT_FIELDS_FAIL:
      return {
        ...state, fieldsLoading: false,
      };
    case actionTypes.LOAD_TENANT_BMOBJ_SUCCEED:
      return { ...state, bmObjs: action.result.data };
    case actionTypes.TOGGLE_TRANSFER_MODAL:
      return { ...state, transferModal: { ...state.transferModal, ...action.data } };
    default:
      return state;
  }
}

export function loadDwObjectMeta() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DWOBJM,
        actionTypes.LOAD_DWOBJM_SUCCEED,
        actionTypes.LOAD_DWOBJM_FAIL,
      ],
      endpoint: 'v1/paas/dwobject/meta',
      method: 'get',
    },
  };
}

export function loadObjectFields(objName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TENANT_FIELDS,
        actionTypes.LOAD_TENANT_FIELDS_SUCCEED,
        actionTypes.LOAD_TENANT_FIELDS_FAIL,
      ],
      endpoint: 'v1/paas/object/fields',
      method: 'get',
      params: { objName },
    },
  };
}

export function updateOrCreateObjectFields(changedInfo, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_META,
        actionTypes.UPDATE_META_SUCCEED,
        actionTypes.UPDATE_META_FAIL,
      ],
      endpoint: 'v1/paas/object/updatefields',
      method: 'post',
      data: { changedInfo, id },
    },
  };
}

export function loadTenantBMFields(object) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TENANT_BMOBJ,
        actionTypes.LOAD_TENANT_BMOBJ_SUCCEED,
        actionTypes.LOAD_TENANT_BMOBJ_FAIL,
      ],
      endpoint: 'v1/paas/object/bmfields',
      method: 'get',
      params: { object },
    },
  };
}

export function upsertTenantBMObj(fields, targetObj, fromSubject) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPSERT_TENANT_BMOBJ,
        actionTypes.UPSERT_TENANT_BMOBJ_SUCCEED,
        actionTypes.UPSERT_TENANT_BMOBJ_FAIL,
      ],
      endpoint: 'v1/paas/object/transferbmfields',
      method: 'post',
      data: { fields, targetObj, fromSubject },
    },
  };
}

export function toggleColumnSettingModal(visible) {
  return {
    type: actionTypes.TOGGLE_TRANSFER_MODAL,
    data: { visible },
  };
}

export function loadSourceDwFields(targetObj, fromFlatTable) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SOURCE_BMOBJ,
        actionTypes.LOAD_SOURCE_BMOBJ_SUCCEED,
        actionTypes.LOAD_SOURCE_BMOBJ_FAIL,
      ],
      endpoint: 'v1/paas/object/sourcefields',
      method: 'get',
      params: { targetObj, fromFlatTable },
    },
  };
}
