import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/events/', [
  'TOGGLE_EVENTS_MODAL',
  'CREATE_PREF', 'CREATE_PREF_SUCCEED', 'CREATE_PREF_FAIL',
  'GET_PREF_EVENT_FEES', 'GET_PREF_EVENT_FEES_SUCCEED', 'GET_PREF_EVENT_FEES_FAIL',
  'GET_FEE_EVENT_MAP', 'GET_FEE_EVENT_MAP_SUCCEED', 'GET_FEE_EVENT_MAP_FAIL',
]);

const initialState = {
  eventsModal: {
    visible: false,
    event: '',
    feeCodes: [],
  },
  feeEventMap: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_EVENTS_MODAL:
      return {
        ...state,
        eventsModal: {
          ...state.eventsModal,
          visible: action.data.visible,
          event: action.data.event,
        },
      };
    case actionTypes.GET_PREF_EVENT_FEES_SUCCEED:
      return {
        ...state,
        eventsModal: {
          ...state.eventsModal,
          feeCodes: action.result.data.map(item => item.fee_code),
        },
      };
    case actionTypes.GET_FEE_EVENT_MAP_SUCCEED: {
      return { ...state, feeEventMap: action.result.data };
    }
    default:
      return state;
  }
}

export function toggleEventsModal(visible, event) {
  return {
    type: actionTypes.TOGGLE_EVENTS_MODAL,
    data: { visible, event },
  };
}

export function createPrefEventFee(event, feeCodes) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_PREF,
        actionTypes.CREATE_PREF_SUCCEED,
        actionTypes.CREATE_PREF_FAIL,
      ],
      endpoint: 'pref/eventfee/create',
      method: 'post',
      data: { event, feeCodes },
    },
  };
}

export function getPrefEventFees(event) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_PREF_EVENT_FEES,
        actionTypes.GET_PREF_EVENT_FEES_SUCCEED,
        actionTypes.GET_PREF_EVENT_FEES_FAIL,
      ],
      endpoint: 'v1/pref/event/fees',
      method: 'get',
      params: { event },
    },
  };
}

export function getFeeEventMap() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_FEE_EVENT_MAP,
        actionTypes.GET_FEE_EVENT_MAP_SUCCEED,
        actionTypes.GET_FEE_EVENT_MAP_FAIL,
      ],
      endpoint: 'v1/pref/feecode/eventmap',
      method: 'get',
    },
  };
}

