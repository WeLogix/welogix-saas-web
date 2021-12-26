import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/permit/', [
  'ADD_PERMIT', 'ADD_PERMIT_SUCCEED', 'ADD_PERMIT_FAIL',
  'LOAD_PERMITS', 'LOAD_PERMITS_SUCCEED', 'LOAD_PERMITS_FAIL',
  'LOAD_PERMIT', 'LOAD_PERMIT_SUCCEED', 'LOAD_PERMIT_FAIL',
  'UPDATE_PERMIT', 'UPDATE_PERMIT_SUCCEED', 'UPDATE_PERMIT_FAIL',
  'TOGGLE_PERMIT_ITEM_MODAL', 'TOGGLE_TRADE_ITEM_MODAL',
  'ADD_PERMIT_MODEL', 'ADD_PERMIT_MODEL_SUCCEED', 'ADD_PERMIT_MODEL_FAIL',
  'LOAD_PERMIT_MODELS', 'LOAD_PERMIT_MODELS_SUCCEED', 'LOAD_PERMIT_MODELS_FAIL',
  'LOAD_TRADE_ITEMS', 'LOAD_TRADE_ITEMS_SUCCEED', 'LOAD_TRADE_ITEMS_FAIL',
  'ADD_PERMIT_TRADE_ITEMS', 'ADD_PERMIT_TRADE_ITEMS_SUCCEED', 'ADD_PERMIT_TRADE_ITEMS_FAIL',
  'AUTOMATIC_MATCH', 'AUTOMATIC_MATCH_SUCCESS', 'AUTOMATIC_MATCH_FAIL',
  'LOAD_PERMITS_BY_TRADE_ITEM', 'LOAD_PERMITS_BY_TRADE_ITEM_SUCCEED', 'LOAD_PERMITS_BY_TRADE_ITEM_FAIL',
  'TOGGLE_ITEM_PERMIT_MODAL',
  'LOAD_MODEL_ITEMS', 'LOAD_MODEL_ITEMS_SUCCEED', 'LOAD_MODEL_ITEMS_FAIL',
  'DELETE_MODEL_ITEM', 'DELETE_MODEL_ITEM_SUCCEED', 'DELETE_MODEL_ITEM_FAIL',
  'LOAD_PERMIT_USELOG', 'LOAD_PERMIT_USELOG_SUCCEED', 'LOAD_PERMIT_USELOG_FAIL',
  'DISCARD_PERMIT', 'DISCARD_PERMIT_SUCCEED', 'DISCARD_PERMIT_FAIL',
  'REACTIVATE_PERMIT', 'REACTIVATE_PERMIT_SUCCEED', 'REACTIVATE_PERMIT_FAIL',
  'RESET_TRADE_ITEM_LIST', 'UPDATE_LOCAL_PERMIT',
]);

const initialState = {
  permitList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
    loading: true,
    filter: {},
  },
  tradeItemList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
    loading: false,
  },
  permitModelModal: {
    visible: false,
  },
  permitItems: [],
  tradeItemModal: {
    visible: false,
  },
  currentPermit: {},
  itemPermitModal: {
    visible: false,
    permitId: null,
    permitModel: '',
    modelSeq: '',
  },
  modelItems: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
    loading: false,
  },
  permitUseLogs: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  whetherLoadUsageLog: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_PERMITS: {
      const filter = JSON.parse(action.params.filter);
      return {
        ...state,
        permitList: {
          ...state.permitList,
          loading: true,
          filter,
        },
      };
    }
    case actionTypes.LOAD_PERMITS_SUCCEED:
      return {
        ...state,
        permitList: {
          ...state.permitList,
          loading: false,
          ...action.result.data,
        },
      };
    case actionTypes.LOAD_PERMITS_FAIL:
      return { ...state, permitList: { ...state.permitList, loading: false } };
    case actionTypes.TOGGLE_PERMIT_ITEM_MODAL:
      return { ...state, permitModelModal: { ...state.permitModelModal, visible: action.visible } };
    case actionTypes.LOAD_PERMIT_MODELS_SUCCEED:
      return { ...state, permitItems: action.result.data };
    case actionTypes.TOGGLE_TRADE_ITEM_MODAL:
      return {
        ...state,
        tradeItemModal: {
          ...state.tradeItemModal,
          visible: action.visible,
        },
      };
    case actionTypes.LOAD_PERMIT_SUCCEED:
      return { ...state, currentPermit: action.result.data };
    case actionTypes.LOAD_TRADE_ITEMS:
      return { ...state, tradeItemList: { ...state.tradeItemList, loading: true } };
    case actionTypes.LOAD_TRADE_ITEMS_SUCCEED:
      return { ...state, tradeItemList: { ...action.result.data, loading: false } };
    case actionTypes.LOAD_TRADE_ITEMS_FAIL:
      return { ...state, tradeItemList: { ...state.tradeItemList, loading: false } };
    case actionTypes.TOGGLE_ITEM_PERMIT_MODAL:
      return {
        ...state,
        itemPermitModal: { ...state.itemPermitModal, ...action.data },
      };
    case actionTypes.LOAD_MODEL_ITEMS:
      return { ...state, modelItems: { ...state.modelItems, loading: true } };
    case actionTypes.LOAD_MODEL_ITEMS_SUCCEED:
      return {
        ...state,
        modelItems: {
          loading: false,
          ...action.result.data,
        },
      };
    case actionTypes.LOAD_MODEL_ITEMS_FAIL:
      return { ...state, modelItems: { ...state.modelItems, loading: false } };
    case actionTypes.UPDATE_PERMIT_SUCCEED:
      return {
        ...state,
        currentPermit: { ...action.data, ...state.currentPermit },
        whetherLoadUsageLog: true,
      };
    case actionTypes.LOAD_PERMIT_USELOG_SUCCEED:
      return { ...state, permitUseLogs: action.result.data, whetherLoadUsageLog: false };
    case actionTypes.RESET_TRADE_ITEM_LIST:
      return {
        ...state,
        tradeItemList: {
          totalCount: 0,
          current: 1,
          pageSize: 20,
          data: [],
          loading: false,
        },
      };
    case actionTypes.UPDATE_LOCAL_PERMIT:
      return {
        ...state,
        currentPermit: action.data ? { ...state.currentPermit, ...action.data }
          : initialState.currentPermit,
      };
    default:
      return state;
  }
}

export function addPermit(newPermit, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_PERMIT,
        actionTypes.ADD_PERMIT_SUCCEED,
        actionTypes.ADD_PERMIT_FAIL,
      ],
      endpoint: 'v1/cms/permit/add',
      method: 'post',
      data: { newPermit, opContent },
    },
  };
}

export function loadPermits(current, pageSize, filter = {}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PERMITS,
        actionTypes.LOAD_PERMITS_SUCCEED,
        actionTypes.LOAD_PERMITS_FAIL,
      ],
      endpoint: 'v1/cms/permits/load',
      method: 'get',
      params: { current, pageSize, filter: JSON.stringify(filter) },
    },
  };
}

export function loadPermit(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PERMIT,
        actionTypes.LOAD_PERMIT_SUCCEED,
        actionTypes.LOAD_PERMIT_FAIL,
      ],
      endpoint: 'v1/cms/permit/load',
      method: 'get',
      params: { id },
    },
  };
}

export function updatePermit(permitId, updateData, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PERMIT,
        actionTypes.UPDATE_PERMIT_SUCCEED,
        actionTypes.UPDATE_PERMIT_FAIL,
      ],
      endpoint: 'v1/cms/permit/update',
      method: 'post',
      data: { permitId, updateData, opContent },
    },
  };
}

export function togglePermitModelModal(visible) {
  return {
    type: actionTypes.TOGGLE_PERMIT_ITEM_MODAL,
    visible,
  };
}

export function addPermitModel(permitId, permitModel, modelSeq) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_PERMIT_MODEL,
        actionTypes.ADD_PERMIT_MODEL_SUCCEED,
        actionTypes.ADD_PERMIT_MODEL_FAIL,
      ],
      endpoint: 'v1/cms/permit/model/add',
      method: 'post',
      data: { permitId, permitModel, modelSeq },
    },
  };
}

export function loadPermitModels(permitId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PERMIT_MODELS,
        actionTypes.LOAD_PERMIT_MODELS_SUCCEED,
        actionTypes.LOAD_PERMIT_MODELS_FAIL,
      ],
      endpoint: 'v1/cms/permit/models/load',
      method: 'get',
      params: { permitId },
    },
  };
}

export function toggleTradeItemModal(visible) {
  return {
    type: actionTypes.TOGGLE_TRADE_ITEM_MODAL,
    visible,
  };
}

export function loadTradeItems(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRADE_ITEMS,
        actionTypes.LOAD_TRADE_ITEMS_SUCCEED,
        actionTypes.LOAD_TRADE_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/trade/items/load',
      method: 'get',
      params,
    },
  };
}

export function addPermitTradeItem(permitId, permitModel, modelSeq, tradeItems) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_PERMIT_TRADE_ITEMS,
        actionTypes.ADD_PERMIT_TRADE_ITEMS_SUCCEED,
        actionTypes.ADD_PERMIT_TRADE_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/permit/trade/items/add',
      method: 'post',
      data: {
        permitId, permitModel, modelSeq, tradeItems,
      },
    },
  };
}

export function automaticMatch(permitId, permitModel, modelSeq, ownerPartnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.AUTOMATIC_MATCH,
        actionTypes.AUTOMATIC_MATCH_SUCCESS,
        actionTypes.AUTOMATIC_MATCH_FAIL,
      ],
      endpoint: 'v1/cms/permit/automatic/match',
      method: 'post',
      data: {
        permitId, permitModel, modelSeq, ownerPartnerId,
      },
    },
  };
}

export function loadPermitsByTradeItem(tradeItemId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PERMITS_BY_TRADE_ITEM,
        actionTypes.LOAD_PERMITS_BY_TRADE_ITEM_SUCCEED,
        actionTypes.LOAD_PERMITS_BY_TRADE_ITEM_FAIL,
      ],
      endpoint: 'v1/cms/permits/load/by/trade/item',
      method: 'get',
      params: { tradeItemId },
    },
  };
}

export function toggleItemPermitModal(
  visible, permitId = null,
  permitModel = '', modelSeq = '',
) {
  return {
    type: actionTypes.TOGGLE_ITEM_PERMIT_MODAL,
    data: {
      visible, permitId, permitModel, modelSeq,
    },
  };
}

export function loadModelItems({
  permitId, modelSeq, pageSize, current,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MODEL_ITEMS,
        actionTypes.LOAD_MODEL_ITEMS_SUCCEED,
        actionTypes.LOAD_MODEL_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/model/items/load',
      method: 'get',
      params: {
        permitId, modelSeq, pageSize, current,
      },
    },
  };
}

export function deleteModelItem(itemId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_MODEL_ITEM,
        actionTypes.DELETE_MODEL_ITEM_SUCCEED,
        actionTypes.DELETE_MODEL_ITEM_FAIL,
      ],
      endpoint: 'v1/cms/model/item/delete',
      method: 'post',
      data: { itemId },
    },
  };
}

export function discardPermit(permitId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DISCARD_PERMIT,
        actionTypes.DISCARD_PERMIT_SUCCEED,
        actionTypes.DISCARD_PERMIT_FAIL,
      ],
      endpoint: 'v1/cms/permit/discard',
      method: 'post',
      data: { permitId },
    },
  };
}

export function reactivatePermit(permitId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REACTIVATE_PERMIT,
        actionTypes.REACTIVATE_PERMIT_SUCCEED,
        actionTypes.REACTIVATE_PERMIT_FAIL,
      ],
      endpoint: 'v1/cms/permit/reactivate',
      method: 'post',
      data: { permitId },
    },
  };
}

export function loadPermitUsageLogs(permitId, current, pageSize) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PERMIT_USELOG,
        actionTypes.LOAD_PERMIT_USELOG_SUCCEED,
        actionTypes.LOAD_PERMIT_USELOG_FAIL,
      ],
      endpoint: 'v1/cms/permit/usagelog/load',
      method: 'get',
      params: { permitId, current, pageSize },
    },
  };
}

export function resetTradeItemList() {
  return {
    type: actionTypes.RESET_TRADE_ITEM_LIST,
  };
}

export function updateLocalPermit(newPermit) {
  return {
    type: actionTypes.UPDATE_LOCAL_PERMIT,
    data: newPermit,
  };
}
