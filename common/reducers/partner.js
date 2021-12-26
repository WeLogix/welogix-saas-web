import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/partner/', [
  'LOAD_PARTNERLIST', 'LOAD_PARTNERLIST_SUCCEED', 'LOAD_PARTNERLIST_FAIL',
  'LOAD_PARTNERS', 'LOAD_PARTNERS_SUCCEED', 'LOAD_PARTNERS_FAIL',
  'ADD_PARTNER', 'ADD_PARTNER_SUCCEED', 'ADD_PARTNER_FAIL',
  'CHECK_PARTNER', 'CHECK_PARTNER_SUCCEED', 'CHECK_PARTNER_FAIL',
  'EDIT_PARTNER', 'EDIT_PARTNER_SUCCEED', 'EDIT_PARTNER_FAIL',
  'CHANGE_PARTNER_STATUS', 'CHANGE_PARTNER_STATUS_SUCCEED', 'CHANGE_PARTNER_STATUS_FAIL',
  'DELETE_PARTNER', 'DELETE_PARTNER_SUCCEED', 'DELETE_PARTNER_FAIL',
  'INVITE_PARTNER',
  'SHOW_VENDOR_MODAL', 'HIDE_VENDOR_MODAL',
  'LOAD_PARTNER_BY_ID', 'LOAD_PARTNER_BY_ID_SUCCEED', 'LOAD_PARTNER_BY_ID_FAIL',
  'BATCH_DELETE_BY_UPLOADNO', 'BATCH_DELETE_BY_UPLOADNO_SUCCEED', 'BATCH_DELETE_BY_UPLOADNO_FAIL',
  'LOAD_CONTACTERLIST', 'LOAD_CONTACTERLIST_SUCCEED', 'LOAD_CONTACTERLIST_FAIL',
  'ADD_CONTACTER', 'ADD_CONTACTER_SUCCEED', 'ADD_CONTACTER_FAIL',
  'EDIT_CONTACTER', 'EDIT_CONTACTER_SUCCEED', 'EDIT_CONTACTER_FAIL',
  'DELETE_CONTACTER', 'DELETE_CONTACTER_SUCCEED', 'DELETE_CONTACTER_FAIL',
  'BATCH_DELETE_CONTACTER_BY_UPLOADNO', 'BATCH_DELETE_CONTACTER_BY_UPLOADNO_SUCCEED', 'BATCH_DELETE_CONTACTER_BY_UPLOADNO_FAIL',
  'TOGGLE_CONTACTER_MODAL',
]);

const initialState = {
  loading: true,
  loaded: true,
  partnerlist: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  partnerFilter: {
    name: undefined,
  },
  partners: [],
  partnerModal: {
    visible: false,
    operation: 'add',
    partner: { role: '' },
  },
  contacterList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  contacterFilter: {
    filterField: undefined,
    partnerId: undefined,
  },
  contacterModal: {
    visible: false,
    contacter: {},
  },
  whetherReloadContacters: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PARTNERLIST:
      return {
        ...state, loading: true, loaded: true, partnerFilter: JSON.parse(action.params.filters),
      };
    case actionTypes.LOAD_PARTNERLIST_SUCCEED:
      return {
        ...state, loading: false, partnerlist: action.result.data,
      };
    case actionTypes.LOAD_PARTNERLIST_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_PARTNERS:
      return { ...state, loaded: true };
    case actionTypes.LOAD_PARTNERS_SUCCEED:
      return { ...state, partners: action.result.data };
    case actionTypes.CHANGE_PARTNER_STATUS_SUCCEED:
    case actionTypes.DELETE_PARTNER_SUCCEED:
    case actionTypes.INVITE_PARTNER:
    case actionTypes.ADD_PARTNER_SUCCEED:
    case actionTypes.EDIT_PARTNER_SUCCEED:
      return { ...state, loaded: false };
    case actionTypes.SHOW_VENDOR_MODAL: {
      return {
        ...state,
        partnerModal: {
          visible: true,
          ...action.data,
        },
      };
    }
    case actionTypes.HIDE_VENDOR_MODAL: {
      return {
        ...state,
        partnerModal: initialState.partnerModal,
      };
    }
    case actionTypes.ADD_CONTACTER_SUCCEED:
    case actionTypes.EDIT_CONTACTER_SUCCEED:
    case actionTypes.DELETE_CONTACTER_SUCCEED:
      return { ...state, whetherReloadContacters: true };
    case actionTypes.LOAD_CONTACTERLIST:
      return { ...state, contacterFilter: JSON.parse(action.params.filter) };
    case actionTypes.LOAD_CONTACTERLIST_SUCCEED:
      return { ...state, whetherReloadContacters: false, contacterList: action.result.data };
    case actionTypes.LOAD_CONTACTERLIST_FAIL:
      return { ...state, whetherReloadContacters: false };
    case actionTypes.TOGGLE_CONTACTER_MODAL:
      return { ...state, contacterModal: action.data };
    default:
      return state;
  }
}

export function loadPartnerList(role, pageSize, current, filters) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PARTNERLIST,
        actionTypes.LOAD_PARTNERLIST_SUCCEED,
        actionTypes.LOAD_PARTNERLIST_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/list',
      method: 'get',
      params: {
        role, filters, pageSize, current,
      },
    },
  };
}

export function loadPartners(ptParam) { // role businessType excludeOwn
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PARTNERS,
        actionTypes.LOAD_PARTNERS_SUCCEED,
        actionTypes.LOAD_PARTNERS_FAIL,
      ],
      endpoint: 'v1/cooperation/partners',
      method: 'post',
      data: ptParam || {},
    },
  };
}

export function addPartner(partnerInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_PARTNER,
        actionTypes.ADD_PARTNER_SUCCEED,
        actionTypes.ADD_PARTNER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/add',
      method: 'post',
      data:
        partnerInfo,
    },
  };
}

export function checkPartner(partnerInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHECK_PARTNER,
        actionTypes.CHECK_PARTNER_SUCCEED,
        actionTypes.CHECK_PARTNER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/check',
      method: 'post',
      data: partnerInfo,
    },
  };
}

export function editPartner(partnerId, partnerInfo, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_PARTNER,
        actionTypes.EDIT_PARTNER_SUCCEED,
        actionTypes.EDIT_PARTNER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/edit',
      method: 'post',
      id: partnerId,
      data: { partnerId, partnerInfo, contentLog },
    },
  };
}

export function changePartnerStatus(id, status) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHANGE_PARTNER_STATUS,
        actionTypes.CHANGE_PARTNER_STATUS_SUCCEED,
        actionTypes.CHANGE_PARTNER_STATUS_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/change_status',
      method: 'post',
      data: { id, status },
    },
  };
}

export function deletePartner(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_PARTNER,
        actionTypes.DELETE_PARTNER_SUCCEED,
        actionTypes.DELETE_PARTNER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function invitePartner(id) {
  return {
    type: actionTypes.INVITE_PARTNER,
    id,
  };
}

export function showPartnerModal(operation = '', partner = {}) {
  return { type: actionTypes.SHOW_VENDOR_MODAL, data: { operation, partner } };
}

export function hidePartnerModal() {
  return { type: actionTypes.HIDE_VENDOR_MODAL };
}

export function loadPartnerById(partnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PARTNER_BY_ID,
        actionTypes.LOAD_PARTNER_BY_ID_SUCCEED,
        actionTypes.LOAD_PARTNER_BY_ID_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/byid',
      method: 'get',
      params: { partnerId },
    },
  };
}

export function batchDelUploadPartner(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_BY_UPLOADNO,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_SUCCEED,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/uploadbatchdelete',
      method: 'post',
      data: { uploadNo },
    },
  };
}

export function loadContacterList(current, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CONTACTERLIST,
        actionTypes.LOAD_CONTACTERLIST_SUCCEED,
        actionTypes.LOAD_CONTACTERLIST_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/contact/load',
      method: 'get',
      params: { pageSize, current, filter: JSON.stringify(filter) },
    },
  };
}

export function addContacter(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_CONTACTER,
        actionTypes.ADD_CONTACTER_SUCCEED,
        actionTypes.ADD_CONTACTER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/contact/add',
      method: 'post',
      data,
    },
  };
}

export function editContacter(data, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_CONTACTER,
        actionTypes.EDIT_CONTACTER_SUCCEED,
        actionTypes.EDIT_CONTACTER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/contact/edit',
      method: 'post',
      data: { data, id },
    },
  };
}

export function deleteContacter(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CONTACTER,
        actionTypes.DELETE_CONTACTER_SUCCEED,
        actionTypes.DELETE_CONTACTER_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/contact/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function batchDelUploadContacter(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_CONTACTER_BY_UPLOADNO,
        actionTypes.BATCH_DELETE_CONTACTER_BY_UPLOADNO_SUCCEED,
        actionTypes.BATCH_DELETE_CONTACTER_BY_UPLOADNO_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/contact/uploadbatchdelete',
      method: 'post',
      data: { uploadNo },
    },
  };
}

export function toggleContacterModal(visible, contacter = {}) {
  return {
    type: actionTypes.TOGGLE_CONTACTER_MODAL,
    data: { visible, contacter },
  };
}
