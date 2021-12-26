import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { WRAP_TYPE_V1, WRAP_TYPE, DELG_EXEMPTIONWAY } from 'common/constants';

const actionTypes = createActionTypes('@@welogix/cms/params/', [
  'LOAD_SPARAMSV1', 'LOAD_SPARAMSV1_SUCCEED', 'LOAD_SPARAMSV1_FAIL',
  'LOAD_SPARAMSV2', 'LOAD_SPARAMSV2_SUCCEED', 'LOAD_SPARAMSV2_FAIL',
]);

const initialState = {
  v1: {
    customs: [],
    tradeMode: [],
    transMode: [],
    trxnMode: [],
    country: [],
    remissionMode: [],
    currency: [],
    port: [],
    district: [],
    unit: [],
    exemptionWay: DELG_EXEMPTIONWAY,
    wrapType: WRAP_TYPE_V1,
  },
  latest: {
    customs: [],
    tradeMode: [],
    transMode: [],
    trxnMode: [],
    country: [],
    remissionMode: [],
    currency: [],
    port: [],
    district: [],
    cnregion: [],
    unit: [],
    ciqOrganization: [],
    cnport: [],
    origPlace: [],
    exemptionWay: DELG_EXEMPTIONWAY,
    wrapType: WRAP_TYPE,
    certMark: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_SPARAMSV1_SUCCEED: {
      const paramTypes = action.data;
      const v1params = { ...state.v1 };
      for (let i = 0; i < action.result.data.length; i++) {
        const resParams = action.result.data[i];
        const paramKey = paramTypes[i];
        v1params[paramKey] = resParams;
      }
      return { ...state, v1: v1params };
    }
    case actionTypes.LOAD_SPARAMSV2_SUCCEED: {
      const paramTypes = action.data;
      const v2params = { ...state.latest };
      for (let i = 0; i < action.result.data.length; i++) {
        const resParams = action.result.data[i];
        const paramKey = paramTypes[i];
        v2params[paramKey] = resParams;
      }
      return { ...state, latest: v2params };
    }
    default:
      return state;
  }
}

export function loadV1SaasParam(types) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SPARAMSV1,
        actionTypes.LOAD_SPARAMSV1_SUCCEED,
        actionTypes.LOAD_SPARAMSV1_FAIL,
      ],
      endpoint: 'v1/saas/ondemand/params',
      method: 'post',
      data: types,
    },
  };
}

export function loadLatestSaasParam(types) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SPARAMSV2,
        actionTypes.LOAD_SPARAMSV2_SUCCEED,
        actionTypes.LOAD_SPARAMSV2_FAIL,
      ],
      endpoint: 'v2/saas/ondemand/params',
      method: 'post',
      data: types,
    },
  };
}
