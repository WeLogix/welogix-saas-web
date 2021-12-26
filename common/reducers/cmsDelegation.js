import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/delegation/', [
  'LOAD_ACCEPT', 'LOAD_ACCEPT_SUCCEED', 'LOAD_ACCEPT_FAIL',
  'ENSURE_MANIFESTMETA', 'ENSURE_MANIFESTMETA_SUCCEED', 'ENSURE_MANIFESTMETA_FAIL',
  'OPEN_EF_MODAL', 'CLOSE_EF_MODAL',
  'TOGGLE_EXCHANGE_DOC_MODAL', 'TOGGLE_QUARANTINE_MODAL',
  'UPDATE_ARR_DATE', 'UPDATE_ARR_DATE_SUCCEED', 'UPDATE_ARR_DATE_FAIL',
  'UPDATE_QUARANTINE_AMOUNT', 'UPDATE_QUARANTINE_AMOUNT_SUCCEED', 'UPDATE_QUARANTINE_AMOUNT_FAIL',
  'UPDATE_DELEGATION', 'UPDATE_DELEGATION_SUCCEED', 'UPDATE_DELEGATION_FAIL',
]);

const initialState = {
  delegationsReload: false,
  delegationlist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
    sortField: '',
    sortOrder: '',
    scenario: 'all',
    filterNo: '',
    clientView: { tenantIds: [], partnerIds: [] },
    acptDate: [],
  },
  visibleEfModal: false,
  efModal: {
    entryHeadId: -1,
    decUnifiedNo: '',
    // billSeqNo: '',
    // delgNo: '',
  },
  exchangeDocModal: {
    visible: false,
    exchangeInfo: {
      delg_no: '',
      bl_wb_no: '',
      swb_no: '',
    },
  },
  quarantineModal: {
    visible: false,
    exchangeInfo: {
      delg_no: '',
      bl_wb_no: '',
      quarantineInspect: false,
    },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_ACCEPT:
      return {
        ...state,
        delegationlist: { ...state.delegationlist, loading: true },
        delegationsReload: false,
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_ACCEPT_SUCCEED: {
      return { ...state, delegationlist: { ...action.result.data, loading: false } };
    }
    case actionTypes.LOAD_ACCEPT_FAIL:
      return { ...state, delegationlist: { ...state.delegationlist, loading: false } };
    case actionTypes.OPEN_EF_MODAL:
      return { ...state, visibleEfModal: true, efModal: action.data };
    case actionTypes.CLOSE_EF_MODAL:
      return { ...state, visibleEfModal: false, efModal: initialState.efModal };
    case actionTypes.TOGGLE_EXCHANGE_DOC_MODAL:
      return {
        ...state,
        exchangeDocModal: {
          ...state.exchangeDocModal,
          visible: action.data.visible,
          exchangeInfo: action.data.exchangeInfo,
        },
      };
    case actionTypes.TOGGLE_QUARANTINE_MODAL:
      return {
        ...state,
        quarantineModal: {
          ...state.quarantineModal,
          visible: action.data.visible,
          exchangeInfo: action.data.exchangeInfo,
        },
      };
    case actionTypes.UPDATE_DELEGATION_SUCCEED: {
      const list = [...state.delegationlist.data];
      const index = list.findIndex(item => item.delg_no === action.data.delgNo);
      if (index !== -1) {
        list[index] = { ...list[index], ...action.data.change };
      }
      return { ...state, delegationlist: { ...state.delegationlist, data: list } };
    }
    default:
      return state;
  }
}

export function toggleExchangeDocModal(visible, exchangeInfo) {
  return {
    type: actionTypes.TOGGLE_EXCHANGE_DOC_MODAL,
    data: { visible, exchangeInfo },
  };
}

export function toggleQuarantineModal(visible, exchangeInfo) {
  return {
    type: actionTypes.TOGGLE_QUARANTINE_MODAL,
    data: { visible, exchangeInfo },
  };
}

export function loadDelegationList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ACCEPT,
        actionTypes.LOAD_ACCEPT_SUCCEED,
        actionTypes.LOAD_ACCEPT_FAIL,
      ],
      endpoint: 'v1/cms/delegations',
      method: 'get',
      params,
    },
  };
}

export function ensureManifestMeta(delger) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENSURE_MANIFESTMETA,
        actionTypes.ENSURE_MANIFESTMETA_SUCCEED,
        actionTypes.ENSURE_MANIFESTMETA_FAIL,
      ],
      endpoint: 'v1/cms/manifest/meta',
      method: 'post',
      data: delger,
    },
  };
}

export function openEfModal({ entryHeadId, decUnifiedNo }) {
  return {
    type: actionTypes.OPEN_EF_MODAL,
    data: { entryHeadId, decUnifiedNo },
  };
}

export function closeEfModal() {
  return {
    type: actionTypes.CLOSE_EF_MODAL,
  };
}

export function updateQuarantineInspect(inspected, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_QUARANTINE_AMOUNT,
        actionTypes.UPDATE_QUARANTINE_AMOUNT_SUCCEED,
        actionTypes.UPDATE_QUARANTINE_AMOUNT_FAIL,
      ],
      endpoint: 'v1/cms/delegation/quarantine/inspect',
      method: 'post',
      data: {
        inspected, delgNo,
      },
    },
  };
}

export function updateDelegation(change, delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_DELEGATION,
        actionTypes.UPDATE_DELEGATION_SUCCEED,
        actionTypes.UPDATE_DELEGATION_FAIL,
      ],
      endpoint: 'v1/cms/delegation/base/info/save',
      method: 'post',
      data: { change, delgNo },
    },
  };
}
