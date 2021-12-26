import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/taxes/', [
  'LOAD_TAXES', 'LOAD_TAXES_SUCCEED', 'LOAD_TAXES_FAIL',
]);

const initialState = {
  loading: false,
  taxList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  listFilter: {
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_TAXES:
      return { ...state, listFilter: JSON.parse(action.params.filter), loading: true };
    case actionTypes.LOAD_TAXES_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_TAXES_SUCCEED:
      return { ...state, taxList: { ...action.result.data }, loading: false };
    default:
      return state;
  }
}

export function loadTaxesList({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TAXES,
        actionTypes.LOAD_TAXES_SUCCEED,
        actionTypes.LOAD_TAXES_FAIL,
      ],
      endpoint: 'v1/cms/customs/decltax',
      method: 'get',
      params: { pageSize, current, filter: JSON.stringify(filter) },
    },
  };
}
