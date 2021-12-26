import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/shipping/', [
  'HIDE_DOCK', 'SHOW_DOCK', 'CHANGE_DOCK_TAB',
  'ADD_SO', 'ADD_SO_SUCCEED', 'ADD_SO_FAIL',
  'LOAD_SOS', 'LOAD_SOS_SUCCEED', 'LOAD_SOS_FAIL',
  'GET_SO', 'GET_SO_SUCCEED', 'GET_SO_FAIL',
  'UPDATE_SO', 'UPDATE_SO_SUCCEED', 'UPDATE_SO_FAIL',
  'RELEASE_SO', 'RELEASE_SO_SUCCEED', 'RELEASE_SO_FAIL',
  'LOAD_WAVES', 'LOAD_WAVES_SUCCEED', 'LOAD_WAVES_FAIL',
  'CREATE_WAVES', 'CREATE_WAVES_SUCCEED', 'CREATE_WAVES_FAIL',
  'BATCH_RELEASE', 'BATCH_RELEASE_SUCCEED', 'BATCH_RELEASE_FAIL',
  'LOAD_WAVE_ORDERS', 'LOAD_WAVE_ORDERS_SUCCEED', 'LOAD_WAVE_ORDERS_FAIL',
  'CANCEL_WAVE', 'CANCEL_WAVE_SUCCEED', 'CANCEL_WAVE_FAIL',
  'REMOVE_WAVE_ORDERS', 'REMOVE_WAVE_ORDERS_SUCCEED', 'REMOVE_WAVE_ORDERS_FAIL',
  'SHOW_ADD_TO_WAVE', 'HIDE_ADD_TO_WAVE', 'SHOW_CREATE_WAVE', 'HIDE_CREATE_WAVE',
  'ADD_TO_WAVE', 'ADD_TO_WAVE_SUCCEED', 'ADD_TO_WAVE_FAIL',
  'LOAD_SHFTZ_RELEASE', 'LOAD_SHFTZ_RELEASE_SUCCEED', 'LOAD_SHFTZ_RELEASE_FAIL',
  'GET_SO_UUID', 'GET_SO_UUID_SUCCEED', 'GET_SO_UUID_FAIL',
  'CANCEL_OUTBOUND', 'CANCEL_OUTBOUND_SUCCEED', 'CANCEL_OUTBOUND_FAIL',
  'CLOSE_OUTBOUND', 'CLOSE_OUTBOUND_SUCCEED', 'CLOSE_OUTBOUND_FAIL',
  'SHOW_ASN_SELECT', 'HIDE_ASN_SELECT', 'CLEAR_SO', 'SET_SO_DETAILS',
  'UPDATE_SOHEAD', 'UPDATE_SOHEAD_SUCCEED', 'UPDATE_SOHEAD_FAIL',
  'ADD_SO_DETAIL', 'ADD_SO_DETAIL_SUCCEED', 'ADD_SO_DETAIL_FAIL',
  'EDIT_SO_DETAIL', 'EDIT_SO_DETAIL_SUCCEED', 'EDIT_SO_DETAIL_FAIL',
  'DELETE_SO_DETAILS', 'DELETE_SO_DETAILS_SUCCEED', 'DELETE_SO_DETAILS_FAIL',
  'LOAD_PREALLOCCOMPLETE_SOS', 'LOAD_PREALLOCCOMPLETE_SOS_SUCCEED', 'LOAD_PREALLOCCOMPLETE_SOS_FAIL',
  'SHOW_WHOLE_WAVE', 'HIDE_WHOLE_WAVE',
]);

const initialState = {
  submitting: false,
  dock: {
    visible: false,
    tabKey: null,
    order: {
      so_no: '',
      outboundNo: '',
      status: 0,
      uuid: '',
    },
  },
  dockLoading: false,
  solist: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    loading: true,
    loaded: true,
  },
  soFilters: {
    scenario: 'myOwn',
    ownerCode: 'all',
    receiverCode: 'all',
    carrierCode: 'all',
  },
  soHead: {},
  soDetails: [],
  wave: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    loading: true,
  },
  waveFilters: { ownerCode: '' },
  addToMoveModal: {
    visible: false,
    ownerId: '',
    ids: [],
  },
  createMaveModal: {
    visible: false,
    ids: [],
    filters: { ownerCode: '' },
  },
  preallocSoList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    loading: true,
  },
  waveHead: {},
  waveOrders: {
    totalCount: 0,
    data: [],
    loading: true,
  },
  waveReload: false,
  asnSelectModal: {
    visible: false,
  },
  waveSoListModal: {
    waveNo: '',
    visible: false,
  },
};

export const { CANCEL_OUTBOUND_SUCCEED, CLOSE_OUTBOUND_SUCCEED } = actionTypes;
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_SO:
    case actionTypes.UPDATE_SO:
      return { ...state, submitting: true };
    case actionTypes.ADD_SO_SUCCEED:
    case actionTypes.ADD_SO_FAIL:
    case actionTypes.UPDATE_SO_SUCCEED:
    case actionTypes.UPDATE_SO_FAIL:
      return { ...state, submitting: false };
    case actionTypes.HIDE_DOCK:
      return { ...state, dock: { ...state.dock, visible: false } };
    case actionTypes.SHOW_DOCK:
      return {
        ...state,
        dock: {
          ...state.dock,
          visible: true,
          order: {
            ...state.dock.order, so_no: action.soNo, outboundNo: action.outboundNo, status: 0,
          },
        },
      };
    case actionTypes.CHANGE_DOCK_TAB:
      return { ...state, dock: { ...state.dock, tabKey: action.data.tabKey } };
    case actionTypes.LOAD_SOS:
      return {
        ...state,
        soFilters: JSON.parse(action.params.filters),
        solist: { ...state.solist, loading: true },
      };
    case actionTypes.LOAD_SOS_SUCCEED:
      return { ...state, solist: { ...action.result.data, loading: false, loaded: true } };
    case actionTypes.LOAD_WAVES:
      return {
        ...state,
        waveFilters: JSON.parse(action.params.filters),
        wave: { ...state.wave, loading: true },
      };
    case actionTypes.LOAD_WAVES_SUCCEED:
      return { ...state, wave: { ...action.result.data, loading: false } };
    case actionTypes.SHOW_ADD_TO_WAVE:
      return {
        ...state,
        addToMoveModal: {
          ...state.addToMoveModal,
          visible: true,
          ownerCode: action.data.ownerCode,
          ids: action.data.ids,
        },
      };
    case actionTypes.SHOW_CREATE_WAVE:
      return {
        ...state,
        createMaveModal: {
          ...state.createMaveModal,
          visible: true,
          ids: action.data,
        },
      };
    case actionTypes.HIDE_ADD_TO_WAVE:
      return { ...state, addToMoveModal: { ...state.addToMoveModal, visible: false } };
    case actionTypes.HIDE_CREATE_WAVE:
      return { ...state, createMaveModal: { ...state.createMaveModal, filters: { ownerCode: '' }, visible: false } };
    case actionTypes.LOAD_WAVE_ORDERS:
      return {
        ...state,
        waveOrders: { ...state.waveOrders, loading: true },
      };
    case actionTypes.LOAD_WAVE_ORDERS_SUCCEED: {
      const { waveNo, pageSize } = action.params;
      const returnData = {
        ...state,
        waveOrders: { ...action.result.data, loading: false },
        waveReload: false,
      };
      if (pageSize) {
        const soListData = [...state.solist.data];
        const index = soListData.findIndex(wv => wv.wave_no === waveNo);
        const wave = { ...soListData[index] };
        wave.children = action.result.data.data;
        if (action.result.data.totalCount > action.result.data.data.length) {
          wave.children.push({ showMore: true, waveNo });
        }
        soListData[index] = wave;
        returnData.solist = { ...state.solist, data: soListData };
      }
      return returnData;
    }
    case actionTypes.LOAD_WAVE_ORDERS_FAIL:
      return { ...state, waveReload: false };
    case actionTypes.REMOVE_WAVE_ORDERS_SUCCEED:
      return { ...state, waveReload: true };
    case actionTypes.GET_SO_UUID_SUCCEED:
      return {
        ...state,
        dock: {
          ...state.dock,
          order: { ...state.dock.order, uuid: action.result.data.flow_instance_uuid },
        },
      };
    case actionTypes.CANCEL_OUTBOUND_SUCCEED:
      return {
        ...state,
        dock: { ...state.dock, visible: false },
        solist: { ...state.solist, loaded: false },
      };
    case actionTypes.CLOSE_OUTBOUND_SUCCEED:
      return {
        ...state,
        dock: { ...state.dock, visible: false },
        solist: { ...state.solist, loaded: false },
        dockLoading: false,
      };
    case actionTypes.SHOW_ASN_SELECT:
      return { ...state, asnSelectModal: { ...state.asnSelectModal, visible: true } };
    case actionTypes.HIDE_ASN_SELECT:
      return { ...state, asnSelectModal: { ...state.asnSelectModal, visible: false } };
    case actionTypes.GET_SO:
    case actionTypes.CLOSE_OUTBOUND:
      return { ...state, dockLoading: true };
    case actionTypes.GET_SO_SUCCEED:
      return {
        ...state,
        dockLoading: false,
        soHead: action.result.data.soHead,
        soDetails: action.result.data.soBody,
      };
    case actionTypes.GET_SO_FAIL:
    case actionTypes.CLOSE_OUTBOUND_FAIL:
      return { ...state, dockLoading: false };
    case actionTypes.CLEAR_SO:
      return { ...state, soHead: {}, soDetails: [] };
    case actionTypes.SET_SO_DETAILS:
      return { ...state, soDetails: action.data };
    case actionTypes.SHOW_WHOLE_WAVE:
      return { ...state, waveSoListModal: { visible: true, waveNo: action.waveNo } };
    case actionTypes.HIDE_WHOLE_WAVE:
      return { ...state, waveSoListModal: { visible: false } };
    case actionTypes.LOAD_PREALLOCCOMPLETE_SOS:
      return {
        ...state,
        createMaveModal: { ...state.createMaveModal, filters: JSON.parse(action.params.filters) },
        preallocSoList: { ...state.preallocSoList, loading: true },
      };
    case actionTypes.LOAD_PREALLOCCOMPLETE_SOS_SUCCEED:
      return { ...state, preallocSoList: { ...action.result.data, loading: false } };
    case actionTypes.ADD_SO_DETAIL_SUCCEED: {
      const newData = action.data.details.map(f => ({ ...f, unsaved: false }));
      const soDetails = state.soDetails.concat(newData);
      return { ...state, soDetails };
    }
    default:
      return state;
  }
}

export function changeDockTab(tabKey) {
  return {
    type: actionTypes.CHANGE_DOCK_TAB,
    data: { tabKey },
  };
}

export function hideDock() {
  return {
    type: actionTypes.HIDE_DOCK,
  };
}

export function showDock(soNo, outboundNo) {
  return {
    type: actionTypes.SHOW_DOCK,
    soNo,
    outboundNo,
  };
}

export function createSO(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SO,
        actionTypes.ADD_SO_SUCCEED,
        actionTypes.ADD_SO_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/so/add',
      method: 'post',
      data,
    },
  };
}

export function loadSos({
  whseCode, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SOS,
        actionTypes.LOAD_SOS_SUCCEED,
        actionTypes.LOAD_SOS_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/sos/load',
      method: 'get',
      params: {
        whseCode, pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function getSo(soNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SO,
        actionTypes.GET_SO_SUCCEED,
        actionTypes.GET_SO_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/so/get',
      method: 'get',
      params: { soNo },
    },
  };
}

export function updateSoHead(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SO,
        actionTypes.UPDATE_SO_SUCCEED,
        actionTypes.UPDATE_SO_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/so/head/update',
      method: 'post',
      data,
    },
  };
}

export function releaseSo(soNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RELEASE_SO,
        actionTypes.RELEASE_SO_SUCCEED,
        actionTypes.RELEASE_SO_FAIL,
      ],
      endpoint: 'v1/cwm/release/so',
      method: 'post',
      data: { soNo },
    },
  };
}

export function batchRelease(soNos) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_RELEASE,
        actionTypes.BATCH_RELEASE_SUCCEED,
        actionTypes.BATCH_RELEASE_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/batch/release',
      method: 'post',
      data: { soNos },
    },
  };
}

export function loadWaves({
  whseCode, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WAVES,
        actionTypes.LOAD_WAVES_SUCCEED,
        actionTypes.LOAD_WAVES_FAIL,
      ],
      endpoint: 'v1/cwm/waves',
      method: 'get',
      params: {
        whseCode, pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function createWave(ids, custOrderNo, tenantName, whseCode, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_WAVES,
        actionTypes.CREATE_WAVES_SUCCEED,
        actionTypes.CREATE_WAVES_FAIL,
      ],
      endpoint: 'v1/cwm/create/waves',
      method: 'post',
      data: {
        ids, custOrderNo, tenantName, whseCode, loginId,
      },
    },
  };
}

export function loadWaveOrders(waveNo, pageSize) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WAVE_ORDERS,
        actionTypes.LOAD_WAVE_ORDERS_SUCCEED,
        actionTypes.LOAD_WAVE_ORDERS_FAIL,
      ],
      endpoint: 'v1/cwm/wave/orders',
      method: 'get',
      params: {
        waveNo, pageSize,
      },
    },
  };
}

export function cancelWave(waveNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_WAVE,
        actionTypes.CANCEL_WAVE_SUCCEED,
        actionTypes.CANCEL_WAVE_FAIL,
      ],
      endpoint: 'v1/cwm/cancel/wave',
      method: 'post',
      data: { waveNo },
    },
  };
}

export function removeWaveOrders(soNos, waveNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_WAVE_ORDERS,
        actionTypes.REMOVE_WAVE_ORDERS_SUCCEED,
        actionTypes.REMOVE_WAVE_ORDERS_FAIL,
      ],
      endpoint: 'v1/cwm/remove/wave/orders',
      method: 'post',
      data: { soNos, waveNo },
    },
  };
}

export function showAddToWave(ownerCode, ids) {
  return {
    type: actionTypes.SHOW_ADD_TO_WAVE,
    data: { ownerCode, ids },
  };
}

export function showCreateWave(ids) {
  return {
    type: actionTypes.SHOW_CREATE_WAVE,
    data: ids,
  };
}

export function hideCreateWave() {
  return {
    type: actionTypes.HIDE_CREATE_WAVE,
  };
}

export function hideAddToWave() {
  return {
    type: actionTypes.HIDE_ADD_TO_WAVE,
  };
}

export function addToWave(soIdList, waveNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_TO_WAVE,
        actionTypes.ADD_TO_WAVE_SUCCEED,
        actionTypes.ADD_TO_WAVE_FAIL,
      ],
      endpoint: 'v1/cwm/add/to/wave',
      method: 'post',
      data: { soIdList, waveNo },
    },
  };
}

export function loadShftzRelease(soNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SHFTZ_RELEASE,
        actionTypes.LOAD_SHFTZ_RELEASE_SUCCEED,
        actionTypes.LOAD_SHFTZ_RELEASE_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/load',
      method: 'get',
      params: { soNo },
    },
  };
}

export function getSoUuid(soNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SO_UUID,
        actionTypes.GET_SO_UUID_SUCCEED,
        actionTypes.GET_SO_UUID_FAIL,
      ],
      endpoint: 'v1/cwm/get/so/uuid',
      method: 'get',
      params: { soNo },
    },
  };
}

export function cancelOutbound(body) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_OUTBOUND,
        actionTypes.CANCEL_OUTBOUND_SUCCEED,
        actionTypes.CANCEL_OUTBOUND_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/outbound/cancel',
      method: 'post',
      data: body,
    },
  };
}

export function closeOutbound(body) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CLOSE_OUTBOUND,
        actionTypes.CLOSE_OUTBOUND_SUCCEED,
        actionTypes.CLOSE_OUTBOUND_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/outbound/close',
      method: 'post',
      data: body,
    },
  };
}

export function showAsnSelectModal() {
  return {
    type: actionTypes.SHOW_ASN_SELECT,
  };
}

export function hideAsnSelectModal() {
  return {
    type: actionTypes.HIDE_ASN_SELECT,
  };
}

export function clearSO() {
  return {
    type: actionTypes.CLEAR_SO,
  };
}

export function setSoDetails(data) {
  return {
    type: actionTypes.SET_SO_DETAILS,
    data,
  };
}

export function addSoDetails({
  details, whseCode, soNo, bonded, custOrderNo,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SO_DETAIL,
        actionTypes.ADD_SO_DETAIL_SUCCEED,
        actionTypes.ADD_SO_DETAIL_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/detail/add',
      method: 'post',
      data: {
        details, whseCode, soNo, bonded, custOrderNo,
      },
    },
  };
}

export function editSoDetail({
  detail, soNo, seqNo, contentLog, custOrderNo,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_SO_DETAIL,
        actionTypes.EDIT_SO_DETAIL_SUCCEED,
        actionTypes.EDIT_SO_DETAIL_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/detail/edit',
      method: 'post',
      data: {
        detail, soNo, seqNo, contentLog, custOrderNo,
      },
    },
  };
}

export function delSoDetails(seqNos, soNo, custOrderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_SO_DETAILS,
        actionTypes.DELETE_SO_DETAILS_SUCCEED,
        actionTypes.DELETE_SO_DETAILS_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/detail/delete',
      method: 'post',
      data: { seqNos, soNo, custOrderNo },
    },
  };
}

export function showWaveSoListModal(waveNo) {
  return {
    type: actionTypes.SHOW_WHOLE_WAVE,
    waveNo,
  };
}

export function hideWaveSoListModal() {
  return {
    type: actionTypes.HIDE_WHOLE_WAVE,
  };
}

export function loadPreallocCompleteSos({
  whseCode, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PREALLOCCOMPLETE_SOS,
        actionTypes.LOAD_PREALLOCCOMPLETE_SOS_SUCCEED,
        actionTypes.LOAD_PREALLOCCOMPLETE_SOS_FAIL,
      ],
      endpoint: 'v1/cwm/shipping/prealloccomplete/sos',
      method: 'get',
      params: {
        whseCode, pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}
