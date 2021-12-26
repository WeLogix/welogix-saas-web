import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/ciqindecl/', [
  'SAVE_ENT_QUALIF', 'SAVE_ENT_QUALIF_SUCCEED', 'SAVE_ENT_QUALIF_FAIL',
  'LOAD_ENT_QUALIF', 'LOAD_ENT_QUALIF_SUCCEED', 'LOAD_ENT_QUALIF_FAIL',
  'DELETE_ENT_QUALIF', 'DELETE_ENT_QUALIF_SUCCEED', 'DELETE_ENT_QUALIF_FAIL',
  'LOAD_CIQ_USER_LIST', 'LOAD_CIQ_USER_LIST_SUCCEED', 'LOAD_CIQ_USER_LIST_FAIL',
  'SAVE_CIQ_USER_LIST', 'SAVE_CIQ_USER_LIST_SUCCEED', 'SAVE_CIQ_USER_LIST_FAIL',
  'DELETE_CIQ_USER_LIST', 'DELETE_CIQ_USER_LIST_SUCCEED', 'DELETE_CIQ_USER_LIST_FAIL',
  'LOAD_CIQ_APPL_CERT', 'LOAD_CIQ_APPL_CERT_SUCCEED', 'LOAD_CIQ_APPL_CERT_FAIL',
  'OVERWRITE_CIQ_APPL_CERT', 'OVERWRITE_CIQ_APPL_CERT_SUCCEED', 'OVERWRITE_CIQ_APPL_CERT_FAIL',
  'LOAD_OTHER_PACK', 'LOAD_OTHER_PACK_SUCCEED', 'LOAD_OTHER_PACK_FAIL',
  'OVERWRITE_OTHER_PACK', 'OVERWRITE_OTHER_PACK_SUCCEED', 'OVERWRITE_OTHER_PACK_FAIL',
]);

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export function loadEntQualifs(delgNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ENT_QUALIF,
        actionTypes.LOAD_ENT_QUALIF_SUCCEED,
        actionTypes.LOAD_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/entqualifs',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function saveEntQualif(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_ENT_QUALIF,
        actionTypes.SAVE_ENT_QUALIF_SUCCEED,
        actionTypes.SAVE_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/save/entqualif',
      method: 'post',
      data,
    },
  };
}

export function deleteEntQualif(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ENT_QUALIF,
        actionTypes.DELETE_ENT_QUALIF_SUCCEED,
        actionTypes.DELETE_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/del/entqualif',
      method: 'post',
      data,
    },
  };
}

export function loadCiqUserList(delgNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CIQ_USER_LIST,
        actionTypes.LOAD_CIQ_USER_LIST_SUCCEED,
        actionTypes.LOAD_CIQ_USER_LIST_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/userlist',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function saveCiqUser(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_CIQ_USER_LIST,
        actionTypes.SAVE_CIQ_USER_LIST_SUCCEED,
        actionTypes.SAVE_CIQ_USER_LIST_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/save/user',
      method: 'post',
      data,
    },
  };
}

export function deleteCiqUsers(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CIQ_USER_LIST,
        actionTypes.DELETE_CIQ_USER_LIST_SUCCEED,
        actionTypes.DELETE_CIQ_USER_LIST_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/del/users',
      method: 'post',
      data,
    },
  };
}

export function loadCiqApplCert(delgNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CIQ_APPL_CERT,
        actionTypes.LOAD_CIQ_APPL_CERT_SUCCEED,
        actionTypes.LOAD_CIQ_APPL_CERT_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/applcert',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

// 删除+新建，用新数据覆盖旧数据
export function overwriteCiqApplCert(delgNo, preEntrySeqNo, applCerts, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.OVERWRITE_CIQ_APPL_CERT,
        actionTypes.OVERWRITE_CIQ_APPL_CERT_SUCCEED,
        actionTypes.OVERWRITE_CIQ_APPL_CERT_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/overwrite/applcert',
      method: 'post',
      data: {
        delgNo, preEntrySeqNo, applCerts, opContent,
      },
    },
  };
}

export function loadOtherPack(delgNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_OTHER_PACK,
        actionTypes.LOAD_OTHER_PACK_SUCCEED,
        actionTypes.LOAD_OTHER_PACK_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/otherpack',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function overwriteOtherPack(delgNo, preEntrySeqNo, otherPacks, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.OVERWRITE_OTHER_PACK,
        actionTypes.OVERWRITE_OTHER_PACK_SUCCEED,
        actionTypes.OVERWRITE_OTHER_PACK_FAIL,
      ],
      endpoint: 'v1/cms/ciqindecl/overwrite/otherpack',
      method: 'post',
      data: {
        delgNo, preEntrySeqNo, otherPacks, opContent,
      },
    },
  };
}
