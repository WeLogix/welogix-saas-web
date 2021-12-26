import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/scof/flow/', [
  'TOGGLE_FLOW_LIST',
  'LOAD_ESTABVENDORS', 'LOAD_ESTABVENDORS_SUCCEED', 'LOAD_ESTABVENDORS_FAIL',
  'OPEN_CREATE_FLOW_MODAL', 'CLOSE_CREATE_FLOW_MODAL',
  'OPEN_SUBFLOW_AUTHMODAL', 'CLOSE_SUBFLOW_AUTHMODAL',
  'CREATE_SUBFLOW', 'CREATE_SUBFLOW_SUCCEED', 'CREATE_SUBFLOW_FAIL',
  'DEL_SUBFLOW', 'DEL_SUBFLOW_SUCCEED', 'DEL_SUBFLOW_FAIL',
  'OPEN_ADD_TRIGGER_MODAL', 'CLOSE_ADD_TRIGGER_MODAL',
  'LOAD_FLOWLIST', 'LOAD_FLOWLIST_SUCCEED', 'LOAD_FLOWLIST_FAIL',
  'LOAD_CMSBIZPARAMS', 'LOAD_CMSBIZPARAMS_SUCCEED', 'LOAD_CMSBIZPARAMS_FAIL',
  'LOAD_TMSBIZPARAMS', 'LOAD_TMSBIZPARAMS_SUCCEED', 'LOAD_TMSBIZPARAMS_FAIL',
  'LOAD_CWMBIZPARAMS', 'LOAD_CWMBIZPARAMS_SUCCEED', 'LOAD_CWMBIZPARAMS_FAIL',
  'LOAD_WHSESUPLS', 'LOAD_WHSESUPLS_SUCCEED', 'LOAD_WHSESUPLS_FAIL',
  'CWMSUPPLIER_MODAL',
  'LOAD_CMS_QUOTES', 'LOAD_CMS_QUOTES_SUCCEED', 'LOAD_CMS_QUOTES_FAIL',
  'SAVE_FLOW', 'SAVE_FLOW_SUCCEED', 'SAVE_FLOW_FAIL',
  'DEL_FLOW', 'DEL_FLOW_SUCCEED', 'DEL_FLOW_FAIL',
  'RELOAD_FLOWLIST', 'RELOAD_FLOWLIST_SUCCEED', 'RELOAD_FLOWLIST_FAIL',
  'LOAD_GRAPH', 'LOAD_GRAPH_SUCCEED', 'LOAD_GRAPH_FAIL',
  'LOAD_GRAPHITEM', 'LOAD_GRAPHITEM_SUCCEED', 'LOAD_GRAPHITEM_FAIL',
  'SAVE_GRAPH', 'SAVE_GRAPH_SUCCEED', 'SAVE_GRAPH_FAIL',
  'LOAD_PTFLOWS', 'LOAD_PTFLOWLIST_SUCCEED', 'LOAD_PTFLOWLIST_FAIL',
  'SET_NODE_ACTIONS', 'EMPTY_FLOWS',
  'LOAD_FLTRACK', 'LOAD_FLTRACK_SUCCEED', 'LOAD_FLTRACK_FAIL',
  'LOAD_SCVTRACK', 'LOAD_SCVTRACK_SUCCEED', 'LOAD_SCVTRACK_FAIL',
  'LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO', 'LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO_SUCCEED', 'LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO_FAIL',
  'TOGGLE_ADD_LINE_MODAL',
  'ADD_LINE_AND_PUBLISH', 'ADD_LINE_AND_PUBLISH_SUCCEED', 'ADD_LINE_AND_PUBLISH_FAIL',
  'NEED_LOAD_TARIFF',
  'IS_LINE_IN_TARIFF', 'IS_LINE_IN_TARIFF_SUCCEED', 'IS_LINE_IN_TARIFF_FAIL',
  'TOGGLE_ADD_LOCATION_MODAL',
  'SEARCH_RATE_ENDS', 'SEARCH_RATE_ENDS_SUCCEED', 'SEARCH_RATE_ENDS_FAIL',
  'TOGGLE_FLOW_DESIGNER',
  'TOGGLE_FLOW_STATUS', 'TOGGLE_FLOW_STATUS_SUCCEED', 'TOGGLE_FLOW_STATUS_FAIL',
  'UPDATE_FLOW_INFO', 'UPDATE_FLOW_INFO_SUCCEED', 'UPDATE_FLOW_INFO_FAIL', 'ClONE_FLOW', 'ClONE_FLOW_SUCCEED', 'ClONE_FLOW_FAIL', 'TOGGLE_RELOAD', 'LOAD_FLOW', 'LOAD_FLOW_SUCCEED', 'LOAD_FLOW_FAIL',
]);

const initialState = {
  listCollapsed: false,
  graphLoading: false,
  visibleFlowModal: false,
  visibleTriggerModal: false,
  needLoadTariff: false,
  triggerModal: {
    key: '',
    name: '',
    actions: [],
  },
  partnerFlows: [],
  flowList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  flowProviderModal: {
    visible: false,
    flow: {},
  },
  flowListLoading: false,
  reloadFlowList: false,
  submitting: false,
  listFilter: { name: '', ownerPartnerId: 'all', status: true },
  trackingFields: [],
  currentFlow: { id: 0, name: '', main_flow_id: 0 },
  flowGraph: {
    providerFlows: [], nodes: [], edges: [], tracking: {},
  },
  vendorTenants: [],
  nodeActions: [],
  cmsParams: {
    bizDelegation: { declPorts: [], partners: [] },
    bizManifest: { trades: [], agents: [], templates: [] },
  },
  tmsParams: {
    consigners: [], consignees: [], transitModes: [], packagings: [],
  },
  cwmParams: { whses: [], suppliers: [] },
  cwmSupplierModal: {
    visible: false,
    whseCode: null,
    ownerPid: null,
  },
  addLineModal: {
    visible: false,
    line: {},
    tariff: {},
  },
  addLocationModal: {
    visible: false,
    partnerId: -1,
    partnerName: '',
    type: 0,
    tariffId: '',
  },
  flowDesigner: {
    visible: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_FLOW_LIST:
      return { ...state, listCollapsed: !state.listCollapsed };
    case actionTypes.LOAD_FLOW_SUCCEED:
      return { ...state, currentFlow: action.result.data };
    case actionTypes.LOAD_ESTABVENDORS_SUCCEED:
      return { ...state, vendorTenants: action.result.data };
    case actionTypes.OPEN_CREATE_FLOW_MODAL:
      return { ...state, visibleFlowModal: true };
    case actionTypes.CLOSE_CREATE_FLOW_MODAL:
      return { ...state, visibleFlowModal: false };
    case actionTypes.OPEN_SUBFLOW_AUTHMODAL:
      return {
        ...state,
        flowProviderModal: {
          ...state.flowProviderModal,
          flow: action.data,
          visible: true,
        },
      };
    case actionTypes.CLOSE_SUBFLOW_AUTHMODAL:
      return { ...state, flowProviderModal: initialState.flowProviderModal };
    case actionTypes.CREATE_SUBFLOW:
    case actionTypes.DEL_SUBFLOW:
    case actionTypes.SAVE_FLOW:
      return { ...state, submitting: true };
    case actionTypes.CREATE_SUBFLOW_FAIL:
    case actionTypes.DEL_SUBFLOW_FAIL:
    case actionTypes.SAVE_FLOW_FAIL:
      return { ...state, submitting: false };
    case actionTypes.SAVE_FLOW_SUCCEED:
      return {
        ...state, reloadFlowList: true, submitting: false, currentFlow: action.result.data,
      };
    case actionTypes.CREATE_SUBFLOW_SUCCEED: {
      const providerFlows = [...state.flowGraph.providerFlows];
      providerFlows.push({ id: action.result.data.id, tenant_id: action.result.data.tenant_id });
      return { ...state, submitting: false, flowGraph: { ...state.flowGraph, providerFlows } };
    }
    case actionTypes.DEL_SUBFLOW_SUCCEED: {
      const providerFlows = state.flowGraph.providerFlows.filter(pf =>
        pf.id !== action.result.data.id);
      return { ...state, submitting: false, flowGraph: { ...state.flowGraph, providerFlows } };
    }
    case actionTypes.OPEN_ADD_TRIGGER_MODAL:
      return { ...state, visibleTriggerModal: true, triggerModal: action.data };
    case actionTypes.CLOSE_ADD_TRIGGER_MODAL:
      return { ...state, visibleTriggerModal: false };
    case actionTypes.LOAD_CMSBIZPARAMS_SUCCEED:
      return { ...state, cmsParams: { ...state.cmsParams, ...action.result.data } };
    case actionTypes.LOAD_TMSBIZPARAMS_SUCCEED:
      return { ...state, tmsParams: action.result.data };
    case actionTypes.LOAD_CWMBIZPARAMS_SUCCEED:
      return { ...state, cwmParams: { ...state.cwmParams, ...action.result.data } };
    case actionTypes.LOAD_WHSESUPLS_SUCCEED:
      return { ...state, cwmParams: { ...state.cwmParams, suppliers: action.result.data } };
    case actionTypes.CWMSUPPLIER_MODAL:
      return { ...state, cwmSupplierModal: action.data };
    case actionTypes.LOAD_FLOWLIST:
      return { ...state, flowListLoading: true, listFilter: JSON.parse(action.params.filter) };
    case actionTypes.LOAD_FLOWLIST_FAIL:
      return { ...state, flowListLoading: false };
    case actionTypes.LOAD_FLOWLIST_SUCCEED: {
      const flowList = action.result.data;
      return {
        ...state, flowListLoading: false, flowList,
      };
    }
    case actionTypes.ClONE_FLOW_SUCCEED:
      return { ...state, currentFlow: { id: action.result.data.newFlowId } };
    case actionTypes.RELOAD_FLOWLIST:
      return { ...state, flowListLoading: true, listFilter: JSON.parse(action.params.filter) };
    case actionTypes.RELOAD_FLOWLIST_FAIL:
      return { ...state, flowListLoading: false };
    case actionTypes.RELOAD_FLOWLIST_SUCCEED:
      return {
        ...state, flowListLoading: false, reloadFlowList: false, flowList: action.result.data,
      };
    case actionTypes.LOAD_GRAPH:
      return { ...state, graphLoading: true };
    case actionTypes.LOAD_GRAPH_SUCCEED:
      return { ...state, flowGraph: action.result.data, graphLoading: false };
    case actionTypes.LOAD_GRAPH_FAIL:
      return { ...state, graphLoading: false };
    case actionTypes.SAVE_GRAPH_SUCCEED: {
      let reload = false;
      const flow = state.currentFlow;
      if (action.data.trackingId) {
        reload = true;
        flow.tracking_id = action.data.trackingId;
      }
      return { ...state, reloadFlowList: reload, currentFlow: flow };
    }
    case actionTypes.SET_NODE_ACTIONS:
      return { ...state, nodeActions: action.data };
    case actionTypes.LOAD_PTFLOWLIST_SUCCEED:
      return { ...state, partnerFlows: action.result.data };
    case actionTypes.EMPTY_FLOWS:
      return { ...state, partnerFlows: [], cmsParams: initialState.cmsParams };
    case actionTypes.LOAD_FLTRACK_SUCCEED:
      return { ...state, trackingFields: action.result.data };
    case actionTypes.TOGGLE_ADD_LINE_MODAL:
      return { ...state, addLineModal: { ...state.addLineModal, ...action.data } };
    case actionTypes.LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO_SUCCEED:
      return { ...state, needLoadTariff: false };
    case actionTypes.NEED_LOAD_TARIFF:
      return { ...state, needLoadTariff: action.data };
    case actionTypes.TOGGLE_ADD_LOCATION_MODAL:
      return { ...state, addLocationModal: { ...state.addLocationModal, ...action.data } };
    case actionTypes.TOGGLE_FLOW_DESIGNER:
      return {
        ...state,
        flowDesigner: {
          ...state.flowDesigner,
          visible: action.data.visible,
        },
        currentFlow: action.data.currentFlow || initialState.currentFlow,
      };
    case actionTypes.TOGGLE_RELOAD:
      return { ...state, reloadFlowList: !state.reloadFlowList };
    case actionTypes.UPDATE_FLOW_INFO_SUCCEED:
      return { ...state, currentFlow: { ...state.currentFlow, ...action.data.flowData } };
    default:
      return state;
  }
}

/** 载入流程列表 */
export function loadFlowList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOWLIST,
        actionTypes.LOAD_FLOWLIST_SUCCEED,
        actionTypes.LOAD_FLOWLIST_FAIL,
      ],
      endpoint: 'v1/scof/list/flows',
      method: 'get',
      params,
    },
  };
}

export function loadPartnerFlowList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PTFLOWS,
        actionTypes.LOAD_PTFLOWLIST_SUCCEED,
        actionTypes.LOAD_PTFLOWLIST_FAIL,
      ],
      endpoint: 'v1/scof/partner/flows',
      method: 'get',
      params,
    },
  };
}

export function reloadFlowList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RELOAD_FLOWLIST,
        actionTypes.RELOAD_FLOWLIST_SUCCEED,
        actionTypes.RELOAD_FLOWLIST_FAIL,
      ],
      endpoint: 'v1/scof/list/flows',
      method: 'get',
      params,
    },
  };
}

export function toggleFlowList() {
  return {
    type: actionTypes.TOGGLE_FLOW_LIST,
  };
}

export function loadVendorTenants() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ESTABVENDORS,
        actionTypes.LOAD_ESTABVENDORS_SUCCEED,
        actionTypes.LOAD_ESTABVENDORS_FAIL,
      ],
      endpoint: 'v1/cooperation/partner/vendor/tenants',
      method: 'get',
    },
  };
}

export function openCreateFlowModal() {
  return {
    type: actionTypes.OPEN_CREATE_FLOW_MODAL,
  };
}

export function closeCreateFlowModal() {
  return {
    type: actionTypes.CLOSE_CREATE_FLOW_MODAL,
  };
}

export function openSubFlowAuthModal(flow) {
  return {
    type: actionTypes.OPEN_SUBFLOW_AUTHMODAL,
    data: flow,
  };
}

export function closeSubFlowAuthModal() {
  return {
    type: actionTypes.CLOSE_SUBFLOW_AUTHMODAL,
  };
}

export function createProviderFlow(flowId, providerTenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_SUBFLOW,
        actionTypes.CREATE_SUBFLOW_SUCCEED,
        actionTypes.CREATE_SUBFLOW_FAIL,
      ],
      endpoint: 'v1/scof/create/provider/flow',
      method: 'post',
      data: { flowId, providerTenantId },
    },
  };
}

export function deleteProviderFlow(subFlowId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_SUBFLOW,
        actionTypes.DEL_SUBFLOW_SUCCEED,
        actionTypes.DEL_SUBFLOW_FAIL,
      ],
      endpoint: 'v1/scof/del/provider/flow',
      method: 'post',
      data: { subFlowId },
    },
  };
}

export function saveFlow(flow) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_FLOW,
        actionTypes.SAVE_FLOW_SUCCEED,
        actionTypes.SAVE_FLOW_FAIL,
      ],
      endpoint: 'v1/scof/create/flow',
      method: 'post',
      data: flow,
    },
  };
}

export function deleteFlow(flowId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_FLOW,
        actionTypes.DEL_FLOW_SUCCEED,
        actionTypes.DEL_FLOW_FAIL,
      ],
      endpoint: 'v1/scof/del/flow',
      method: 'post',
      data: { flow_id: flowId },
    },
  };
}

export function openAddTriggerModal(trigger) {
  return {
    type: actionTypes.OPEN_ADD_TRIGGER_MODAL,
    data: trigger,
  };
}

export function closeAddTriggerModal() {
  return {
    type: actionTypes.CLOSE_ADD_TRIGGER_MODAL,
  };
}

export function loadCmsBizParams(partnerId, ietype) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CMSBIZPARAMS,
        actionTypes.LOAD_CMSBIZPARAMS_SUCCEED,
        actionTypes.LOAD_CMSBIZPARAMS_FAIL,
      ],
      endpoint: 'v1/scof/flow/cms/params',
      method: 'get',
      params: { partnerId, ietype },
    },
  };
}

export function loadCmsQuotes(buyer, seller) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CMS_QUOTES,
        actionTypes.LOAD_CMS_QUOTES_SUCCEED,
        actionTypes.LOAD_CMS_QUOTES_FAIL,
      ],
      endpoint: 'v1/cms/quotes/bybuyerseller',
      method: 'get',
      params: { buyer: JSON.stringify(buyer), seller: JSON.stringify(seller) },
    },
  };
}

// export function loadCmsProviderQuotes(buyer, seller) {
//   return {
//     [CLIENT_API]: {
//       types: [
//         actionTypes.LOAD_PROVDQUOTES,
//         actionTypes.LOAD_PROVDQUOTES_SUCCEED,
//         actionTypes.LOAD_PROVDQUOTES_FAIL,
//       ],
//       endpoint: 'v1/cms/quotes/bybuyerseller',
//       method: 'get',
//       params: { buyer: JSON.stringify(buyer), seller: JSON.stringify(seller) },
//     },
//   };
// }

// export function loadCmsCustomsQuotes(buyer, seller) {
//   return {
//     [CLIENT_API]: {
//       types: [
//         actionTypes.LOAD_CUSTMQUOTES,
//         actionTypes.LOAD_CUSTMQUOTES_SUCCEED,
//         actionTypes.LOAD_CUSTMQUOTES_FAIL,
//       ],
//       endpoint: 'v1/cms/quotes/bybuyerseller',
//       method: 'get',
//       params: { buyer: JSON.stringify(buyer), seller: JSON.stringify(seller) },
//     },
//   };
// }

export function loadTmsBizParams(tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TMSBIZPARAMS,
        actionTypes.LOAD_TMSBIZPARAMS_SUCCEED,
        actionTypes.LOAD_TMSBIZPARAMS_FAIL,
      ],
      endpoint: 'v1/scof/flow/tms/params',
      method: 'get',
      params: { tenantId },
    },
  };
}

export function loadCwmBizParams() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CWMBIZPARAMS,
        actionTypes.LOAD_CWMBIZPARAMS_SUCCEED,
        actionTypes.LOAD_CWMBIZPARAMS_FAIL,
      ],
      endpoint: 'v1/cwm/flow/params',
      method: 'get',
    },
  };
}

export function loadWhseOwnerSuppliers(whseCode, ownerPid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHSESUPLS,
        actionTypes.LOAD_WHSESUPLS_SUCCEED,
        actionTypes.LOAD_WHSESUPLS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/suppliers/load',
      method: 'get',
      params: { whseCode, ownerPid },
    },
  };
}

export function showCwmSupplierModal({ visible, whseCode, ownerPid }) {
  return {
    type: actionTypes.CWMSUPPLIER_MODAL,
    data: { visible, whseCode, ownerPid },
  };
}

export function loadFlowGraph(flowid, mainFlowId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_GRAPH,
        actionTypes.LOAD_GRAPH_SUCCEED,
        actionTypes.LOAD_GRAPH_FAIL,
      ],
      endpoint: 'v1/scof/flow/graph',
      method: 'get',
      params: { id: flowid, main_flow_id: mainFlowId },
    },
  };
}

export function loadFlowGraphItem(model) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_GRAPHITEM,
        actionTypes.LOAD_GRAPHITEM_SUCCEED,
        actionTypes.LOAD_GRAPHITEM_FAIL,
      ],
      endpoint: 'v1/scof/flow/graph/nodeedge',
      method: 'get',
      params: model,
    },
  };
}

export function setNodeActions(actions) {
  return {
    type: actionTypes.SET_NODE_ACTIONS,
    data: actions,
  };
}

export function saveFlowGraph(flowid, nodes, edges, trackingId, trackings) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_GRAPH,
        actionTypes.SAVE_GRAPH_SUCCEED,
        actionTypes.SAVE_GRAPH_FAIL,
      ],
      endpoint: 'v1/scof/flow/update/graph',
      method: 'post',
      data: {
        flowid, nodes, edges, trackings, trackingId,
      },
    },
  };
}

export function emptyFlows() {
  return { type: actionTypes.EMPTY_FLOWS };
}

export function loadFlowTrackingFields() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLTRACK,
        actionTypes.LOAD_FLTRACK_SUCCEED,
        actionTypes.LOAD_FLTRACK_FAIL,
      ],
      endpoint: 'v1/scv/tracking/flow/fields',
      method: 'get',
    },
  };
}

export function loadScvTrackings(tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SCVTRACK,
        actionTypes.LOAD_SCVTRACK_SUCCEED,
        actionTypes.LOAD_SCVTRACK_FAIL,
      ],
      endpoint: 'v1/scv/tracking/load',
      method: 'get',
      params: { tenantId },
    },
  };
}

export function loadTariffsByTransportInfo(partnerId, transModeCode, goodsType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO,
        actionTypes.LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO_SUCCEED,
        actionTypes.LOAD_TRANSPORT_TRAIFFS_BY_TRANSPORTINFO_FAIL,
      ],
      endpoint: 'v1/scof/transport/tariffs/byTransportInfo',
      origin: 'mongo',
      method: 'get',
      params: { partnerId, transModeCode, goodsType },
    },
  };
}

export function addLineAndPublish(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_LINE_AND_PUBLISH,
        actionTypes.ADD_LINE_AND_PUBLISH_SUCCEED,
        actionTypes.ADD_LINE_AND_PUBLISH_FAIL,
      ],
      endpoint: 'v1/transport/tariff/addLineAndPublish',
      method: 'post',
      data,
      origin: 'mongo',
    },
  };
}

export function isLineIntariff(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.IS_LINE_IN_TARIFF,
        actionTypes.IS_LINE_IN_TARIFF_SUCCEED,
        actionTypes.IS_LINE_IN_TARIFF_FAIL,
      ],
      endpoint: 'v1/transport/tariff/isLineIntariff',
      method: 'post',
      data,
      origin: 'mongo',
    },
  };
}

export function setNeedLoadTariff(data) {
  return { type: actionTypes.NEED_LOAD_TARIFF, data };
}

export function toggleAddLineModal(data) {
  return {
    type: actionTypes.TOGGLE_ADD_LINE_MODAL,
    data,
  };
}

export function toggleAddLocationModal(data) {
  return {
    type: actionTypes.TOGGLE_ADD_LOCATION_MODAL,
    data,
  };
}
export function toggleFlowDesigner(visible, currentFlow) {
  return {
    type: actionTypes.TOGGLE_FLOW_DESIGNER,
    data: { visible, currentFlow },
  };
}

export function searchRateEnds(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEARCH_RATE_ENDS,
        actionTypes.SEARCH_RATE_ENDS_SUCCEED,
        actionTypes.SEARCH_RATE_ENDS_FAIL,
      ],
      endpoint: 'v1/transport/tariff/ratends/search',
      method: 'get',
      params,
      origin: 'mongo',
    },
  };
}

export function toggleFlowStatus(status, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TOGGLE_FLOW_STATUS,
        actionTypes.TOGGLE_FLOW_STATUS_SUCCEED,
        actionTypes.TOGGLE_FLOW_STATUS_FAIL,
      ],
      endpoint: 'v1/scof/flow/status/toggle',
      method: 'post',
      data: { status, id },
    },
  };
}

export function updateFlowInfo(flowId, flowData) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_FLOW_INFO,
        actionTypes.UPDATE_FLOW_INFO_SUCCEED,
        actionTypes.UPDATE_FLOW_INFO_FAIL,
      ],
      endpoint: 'v1/scof/flow/info/update',
      method: 'post',
      data: {
        flowId, flowData,
      },
    },
  };
}

export function cloneFlow(flowId, newFlowName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ClONE_FLOW,
        actionTypes.ClONE_FLOW_SUCCEED,
        actionTypes.ClONE_FLOW_FAIL,
      ],
      endpoint: 'v1/scof/flow/clone',
      method: 'post',
      data: {
        flowId,
        newFlowName,
      },
    },
  };
}

export function loadFlow(flowId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOW,
        actionTypes.LOAD_FLOW_SUCCEED,
        actionTypes.LOAD_FLOW_FAIL,
      ],
      endpoint: 'v1/scof/plainflow',
      method: 'get',
      params: { flowId },
    },
  };
}

export function toggleReload() {
  return {
    type: actionTypes.TOGGLE_RELOAD,
  };
}

