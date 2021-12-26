import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/saas/invoicing/kind/', [
  'LOAD_INVOICING_KIND', 'LOAD_INVOICING_KIND_SUCCEED', 'LOAD_INVOICING_KIND_FAIL',
  'CREATE_INVOICING_KIND', 'CREATE_INVOICING_KIND_SUCCEED', 'CREATE_INVOICING_KIND_FAIL',
  'TOGGLE_CREATE_MODAL',
  'UPDATE_INVOICING_KIND', 'UPDATE_INVOICING_KIND_SUCCEED', 'UPDATE_INVOICING_KIND_FAIL',
  'DELETE_INVOICING_KIND', 'DELETE_INVOICING_KIND_SUCCEED', 'DELETE_INVOICING_KIND_FAIL',
  'LOAD_ALL_INVOICING_KINDS', 'LOAD_ALL_INVOICING_KINDS_SUCCEED', 'LOAD_ALL_INVOICING_KINDS_FAIL',
]);

const initialState = {
  saasInvoicingKindList: {
    current: 1,
    pageSize: 20,
    totalCount: 0,
    data: [],
  },
  createModal: {
    visible: false,
    record: {},
  },
  allInvoicingKinds: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_INVOICING_KIND_SUCCEED:
      return {
        ...state,
        saasInvoicingKindList: {
          ...action.result.data,
        },
      };
    case actionTypes.TOGGLE_CREATE_MODAL:
      return {
        ...state,
        createModal: { visible: action.data.visible, record: action.data.record },
      };
    case actionTypes.LOAD_ALL_INVOICING_KINDS_SUCCEED:
      return {
        ...state, allInvoicingKinds: action.result.data,
      };
    default:
      return state;
  }
}

export function loadInvoicingKinds({ pageSize, current }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICING_KIND,
        actionTypes.LOAD_INVOICING_KIND_SUCCEED,
        actionTypes.LOAD_INVOICING_KIND_FAIL,
      ],
      endpoint: 'v1/saas/invoicing/kinds/load',
      method: 'get',
      params: { pageSize, current },
    },
  };
}

export function toggleCreateModal(visible, record = {}) {
  return {
    type: actionTypes.TOGGLE_CREATE_MODAL,
    data: { visible, record },
  };
}

export function createInvoicingKind(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_INVOICING_KIND,
        actionTypes.CREATE_INVOICING_KIND_SUCCEED,
        actionTypes.CREATE_INVOICING_KIND_FAIL,
      ],
      endpoint: 'v1/saas/invoicing/kinds/create',
      method: 'post',
      data: { data },
    },
  };
}

export function updateInvoicingKind(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_INVOICING_KIND,
        actionTypes.UPDATE_INVOICING_KIND_SUCCEED,
        actionTypes.UPDATE_INVOICING_KIND_FAIL,
      ],
      endpoint: 'v1/saas/invoicing/kind/update',
      method: 'post',
      data: { data },
    },
  };
}

export function deleteInvoicingKind(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_INVOICING_KIND,
        actionTypes.DELETE_INVOICING_KIND_SUCCEED,
        actionTypes.DELETE_INVOICING_KIND_FAIL,
      ],
      endpoint: 'v1/saas/invoicing/kind/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function loadAllInvoicingKinds() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALL_INVOICING_KINDS,
        actionTypes.LOAD_ALL_INVOICING_KINDS_SUCCEED,
        actionTypes.LOAD_ALL_INVOICING_KINDS_FAIL,
      ],
      endpoint: 'v1/saas/all/invoicing/kinds/load',
      method: 'get',
    },
  };
}
