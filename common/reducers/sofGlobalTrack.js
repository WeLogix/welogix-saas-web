import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/sof/gbtracking/', [
  'LOAD_TRDS', 'LOAD_TRDS_SUCCEED', 'LOAD_TRDS_FAIL',
  'UPDATE_TRD', 'UPDATE_TRD_SUCCEED', 'UPDATE_TRD_FAIL',
  'RESET_FOLLOWFILTER',
]);

const initialState = {
  followList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  followListLoading: false,
  followSorter: {
    field: 'created_date', order: 'descend',
  },
  followFilter: { granularity: 'inv_no', owner: 'all' },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_TRDS:
      return {
        ...state,
        followSorter: JSON.parse(action.params.sorter),
        followFilter: JSON.parse(action.params.filter),
        followListLoading: true,
      };
    case actionTypes.LOAD_TRDS_SUCCEED:
      return { ...state, followList: action.result.data, followListLoading: false };
    case actionTypes.LOAD_TRDS_FAIL:
      return { ...state, followListLoading: false };
    case actionTypes.RESET_FOLLOWFILTER:
      return { ...state, followFilter: initialState.followFilter };
    default:
      return state;
  }
}

export function loadTrackFollowList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRDS,
        actionTypes.LOAD_TRDS_SUCCEED,
        actionTypes.LOAD_TRDS_FAIL,
      ],
      endpoint: 'v1/sof/globaltrack/followlist',
      method: 'get',
      params,
    },
  };
}

export function updateTrackFollowDetail(idKey, field, value) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_TRD,
        actionTypes.UPDATE_TRD_SUCCEED,
        actionTypes.UPDATE_TRD_FAIL,
      ],
      endpoint: 'v1/sof/globaltrack/update/followdetail',
      method: 'post',
      data: {
        field, value, idKey,
      },
    },
  };
}

export function resetFollowFilter() {
  return {
    type: actionTypes.RESET_FOLLOWFILTER,
  };
}
