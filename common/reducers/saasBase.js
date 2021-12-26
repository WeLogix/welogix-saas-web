import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/saas/base/', [
  'LOAD_CHANGE_LOGS', 'LOAD_CHANGE_LOGS_SUCCEED', 'LOAD_CHANGE_LOGS_FAIL',
  'LOAD_PIST', 'LOAD_PIST_SUCCEED', 'LOAD_PIST_FAIL',
  'LOAD_TENANT_STAT', 'LOAD_TENANT_STAT_SUCCEED', 'LOAD_TENANT_STAT_FAIL',
  'LOAD_ORDER_STATS', 'LOAD_ORDER_STATS_SUCCEED', 'LOAD_ORDER_STATS_FAIL',
  'CMS_STATISTICS', 'CMS_STATISTICS_SUCCEED', 'CMS_STATISTICS_FAIL',
  'LOAD_CWM_STATS', 'LOAD_CWM_STATS_SUCCEED', 'LOAD_CWM_STATS_FAIL',
]);

const initialState = {
  clogLoading: false,
  changeLogs: {
    posts: [],
    page: 1,
    hasMore: false,
  },
  paasStat: {
    exporters: 0,
    plugins: 0,
    dataAdapters: 0,
    devapps: 0,
    flows: 0,
  },
  tenantStat: {
    shipmts: 0,
    invoices: 0,
    decls: 0,
    inbpunds: 0,
    outbounds: 0,
    transports: 0,
  },
  sofStats: {
    totalOrders: 0,
    pending: 0,
    processing: 0,
    urgent: 0,
    completed: 0,
    unshipedPoNum: 0,
    invAmount: [],
    cusCount: 0,
    supCount: 0,
    venCount: 0,
  },
  cmsStat: {
    total: 0,
    processing: 0,
    declared: 0,
    released: 0,
    exchange: 0,
    unfinishManifests: 0,
    unReviewedDecls: 0,
    unclassified: 0,
    conflict: 0,
    invalid: 0,
    permitsDeficiency: 0,
    permitsEffectless: 0,
    permitsTobeEffectless: 0,
    inspects: 0,
    inspectReleased: 0,
    inspectCaught: 0,
    declCount: 0,
    declDel: 0,
    declMod: 0,
    totalTax: 0,
    estimatedTax: 0,
    unpaidTax: 0,
    paidTax: 0,
  },
  cwmStats: {
    inboundNum: 0,
    pendingAsnNum: 0,
    toRecvInbNum: 0,
    toPutawayInbNum: 0,
    completeInbNum: 0,
    outboundNum: 0,
    pendingSoNum: 0,
    unpreallocNum: 0,
    toAllocateOutbNum: 0,
    toPickOutbNum: 0,
    toShipOutbNum: 0,
    CompleteOutbNum: 0,
    entryToSync: 0,
    normalToClear: 0,
    normalToExit: 0,
    portionToSync: 0,
    portionToClear: 0,
    dayGroupInboundNum: [],
    dayGroupOutboundNum: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_CHANGE_LOGS:
      return { ...state, clogLoading: true };
    case actionTypes.LOAD_CHANGE_LOGS_FAIL:
      return { ...state, clogLoading: false };
    case actionTypes.LOAD_CHANGE_LOGS_SUCCEED:
      return {
        ...state,
        changeLogs: {
          posts: action.params.page === 1 ?
            action.result.data.posts : [...state.changeLogs.posts, ...action.result.data.posts],
          hasMore: action.result.data.hasMore,
          page: action.params.page,
        },
        clogLoading: false,
      };
    case actionTypes.LOAD_PIST_SUCCEED:
      return { ...state, paasStat: action.result.data };
    case actionTypes.LOAD_TENANT_STAT_SUCCEED:
      return { ...state, tenantStat: action.result.data };
    case actionTypes.LOAD_ORDER_STATS_SUCCEED:
      return { ...state, sofStats: action.result.data };
    case actionTypes.CMS_STATISTICS_SUCCEED:
      return {
        ...state,
        cmsStat: action.result.data,
      };
    case actionTypes.LOAD_CWM_STATS_SUCCEED:
      return { ...state, cwmStats: action.result.data };
    default:
      return state;
  }
}

export function loadChangeLogs(page) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CHANGE_LOGS,
        actionTypes.LOAD_CHANGE_LOGS_SUCCEED,
        actionTypes.LOAD_CHANGE_LOGS_FAIL,
      ],
      endpoint: 'v1/saas/changelogs',
      method: 'get',
      params: { page },
    },
  };
}

export function loadPaasIndexStat() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PIST,
        actionTypes.LOAD_PIST_SUCCEED,
        actionTypes.LOAD_PIST_FAIL,
      ],
      endpoint: 'v1/saas/paaswidgetstat',
      method: 'get',
    },
  };
}

export function loadTenantUsageStatis(filterData) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TENANT_STAT,
        actionTypes.LOAD_TENANT_STAT_SUCCEED,
        actionTypes.LOAD_TENANT_STAT_FAIL,
      ],
      endpoint: 'v1/saas/tenantstat',
      method: 'get',
      params: { filterData },
    },
  };
}

export function loadSofStatsCard(startDate, endDate) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_STATS,
        actionTypes.LOAD_ORDER_STATS_SUCCEED,
        actionTypes.LOAD_ORDER_STATS_FAIL,
      ],
      endpoint: 'v1/saas/dashboard/sofstat',
      method: 'get',
      params: { startDate, endDate },
    },
  };
}

export function loadCmsStatistics(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CMS_STATISTICS,
        actionTypes.CMS_STATISTICS_SUCCEED,
        actionTypes.CMS_STATISTICS_FAIL,
      ],
      endpoint: 'v1/saas/dashboard/cmsstat',
      method: 'get',
      params,
    },
  };
}

export function loadCwmStatsCard(startDate, endDate, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CWM_STATS,
        actionTypes.LOAD_CWM_STATS_SUCCEED,
        actionTypes.LOAD_CWM_STATS_FAIL,
      ],
      endpoint: 'v1/saas/dashboard/cwmstat',
      method: 'get',
      params: { startDate, endDate, whseCode },
    },
  };
}
