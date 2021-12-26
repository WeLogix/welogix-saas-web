import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/paas/risk/', [
  'LOAD_UPPOLICYLIST', 'LOAD_UPPOLICYLIST_SUCCEED', 'LOAD_UPPOLICYLIST_FAIL',
  'UPD_UPPOLICY', 'UPD_UPPOLICY_SUCCEED', 'UPD_UPPOLICY_FAIL',
  'ADD_UPPOLICY', 'ADD_UPPOLICY_SUCCEED', 'ADD_UPPOLICY_FAIL',
  'REM_UPPOLICY', 'REM_UPPOLICY_SUCCEED', 'REM_UPPOLICY_FAIL',
]);

const initialState = {
  unitpricePolicy: {
    uniform: {
      id: 0,
      ref_timelimit: 0,
      ref_timelevel: 't',
      statmethod: 1,
      high_thresh: undefined,
      high_alarm: undefined,
      medium_thresh: undefined,
      medium_alarm: undefined,
      low_thresh: undefined,
      low_alarm: undefined,
    },
    exceptList: [],
  },
  submitting: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_UPPOLICYLIST_SUCCEED:
      return {
        ...state,
        unitpricePolicy: {
          uniform: action.result.data.uniform || initialState.unitpricePolicy.uniform,
          exceptList: action.result.data.exceptList,
        },
      };
    case actionTypes.UPD_UPPOLICY:
      return { ...state, submitting: true };
    case actionTypes.UPD_UPPOLICY_SUCCEED: {
      if (state.unitpricePolicy.uniform.id === action.data.id) {
        return {
          ...state,
          submitting: false,
          unitpricePolicy: { ...state.unitpricePolicy, uniform: action.data },
        };
      }
      const newExceptList = state.unitpricePolicy.exceptList.map((ecp) => {
        if (ecp.id === action.data.id) {
          return action.data;
        }
        return ecp;
      });
      return {
        ...state,
        submitting: false,
        unitpricePolicy: { ...state.unitpricePolicy, exceptList: newExceptList },
      };
    }
    case actionTypes.UPD_UPPOLICY_FAIL:
      return { ...state, submitting: false };
    case actionTypes.ADD_UPPOLICY:
      return { ...state, submitting: true };
    case actionTypes.ADD_UPPOLICY_SUCCEED: {
      if (!state.unitpricePolicy.uniform.id && !action.data.owner_partner_id) {
        return {
          ...state,
          submitting: false,
          unitpricePolicy: {
            ...state.unitpricePolicy,
            uniform: { ...action.data, id: action.result.data },
          },
        };
      }
      const newExceptList = state.unitpricePolicy.exceptList
        .concat({ ...action.data, id: action.result.data });
      return {
        ...state,
        submitting: false,
        unitpricePolicy: { ...state.unitpricePolicy, exceptList: newExceptList },
      };
    }
    case actionTypes.ADD_UPPOLICY_FAIL:
      return { ...state, submitting: false };
    case actionTypes.REM_UPPOLICY:
      return { ...state, submitting: true };
    case actionTypes.REM_UPPOLICY_SUCCEED: {
      if (state.unitpricePolicy.uniform.id === action.data.policyId) {
        return {
          ...state,
          submitting: false,
          unitpricePolicy: initialState.unitpricePolicy,
        };
      }
      const newExceptList = state.unitpricePolicy.exceptList.filter(ecp => ecp.id !==
action.data.policyId);
      return {
        ...state,
        submitting: false,
        unitpricePolicy: { ...state.unitpricePolicy, exceptList: newExceptList },
      };
    }

    case actionTypes.REM_UPPOLICY_FAIL:
      return { ...state, submitting: false };
    default:
      return state;
  }
}

export function loadUnitpricePolicyList() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UPPOLICYLIST,
        actionTypes.LOAD_UPPOLICYLIST_SUCCEED,
        actionTypes.LOAD_UPPOLICYLIST_FAIL,
      ],
      endpoint: 'v1/paas/risk/unitpricepolicylist',
      method: 'get',
    },
  };
}

export function updateUpRiskPolicy(riskPolicy) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPD_UPPOLICY,
        actionTypes.UPD_UPPOLICY_SUCCEED,
        actionTypes.UPD_UPPOLICY_FAIL,
      ],
      endpoint: 'v1/paas/risk/updunitpricepolicy',
      method: 'post',
      data: riskPolicy,
    },
  };
}

export function addUpRiskPolicy(riskPolicy) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_UPPOLICY,
        actionTypes.ADD_UPPOLICY_SUCCEED,
        actionTypes.ADD_UPPOLICY_FAIL,
      ],
      endpoint: 'v1/paas/risk/addunitpricepolicy',
      method: 'post',
      data: riskPolicy,
    },
  };
}

export function removeUpRiskPolicy(policyId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REM_UPPOLICY,
        actionTypes.REM_UPPOLICY_SUCCEED,
        actionTypes.REM_UPPOLICY_FAIL,
      ],
      endpoint: 'v1/paas/risk/remunitpricepolicy',
      method: 'post',
      data: { policyId },
    },
  };
}
