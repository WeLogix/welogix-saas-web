// import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/voucher/', [
  'TOGGLE_VOUCHER_MODAL',
]);

// data为mock数据
const initialState = {
  voucherList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    loading: false,
    data: [
      {
        id: 1,
        amount: 1000,
      },
    ],
  },
  listFilter: {
    status: 'open',
  },
  voucherModal: {
    visible: false,
    record: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_VOUCHER_MODAL:
      return {
        ...state,
        voucherModal: { visible: action.data.visible, record: action.data.record },
      };
    default:
      return state;
  }
}

export function toggleVoucherModal(visible, record = {}) {
  return {
    type: actionTypes.TOGGLE_VOUCHER_MODAL,
    data: { visible, record },
  };
}
