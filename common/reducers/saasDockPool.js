// import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/saas/bizdockpool/', [
  'TOGGLE_DOCK',
]);

const initialState = {
  sofCommInv: {
    visible: false,
    inv_no: '',
  },
  ssoPartner: {
    visible: false,
    customer: {},
  },
  cwmBlBook: {
    visible: false,
    blBook: {},
  },
  cmsDeclaration: {
    visible: false,
    preEntrySeqNo: '',
  },
  // 'sofshipment',
  // 'cmsdelegation',
  // 'cwmasn',
  // 'cwmso',
  // 'tmsfreight',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_DOCK: {
      const { dockBiz, bizInfo } = action.payload;
      const retState = { ...state };
      let dockFound = false;
      Object.keys(state).forEach((dk) => {
        if (dk === dockBiz) {
          if (bizInfo) {
            retState[dk] = { visible: !state[dk].visible, ...bizInfo };
          } else {
            retState[dk] = initialState[dk];
          }
          dockFound = true;
        } else {
          retState[dk] = initialState[dk];
        }
      });
      if (dockFound) {
        return retState;
      }
      return state;
    }
    default:
      return state;
  }
}

export function toggleBizDock(dockBiz, bizInfo) {
  return {
    type: actionTypes.TOGGLE_DOCK,
    payload: { dockBiz, bizInfo },
  };
}
