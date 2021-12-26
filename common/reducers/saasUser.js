import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const initialState = {
  panelVisible: false,
  prefVisible: false,
  accountVisible: false,
  loaded: false,
  locale: 'zh',
  messages: {
  },
};
const actionTypes = createActionTypes('@@welogix/saas/user', [
  'TRANSLATION_LOAD', 'TRANSLATION_LOAD_SUCCEED', 'TRANSLATION_LOAD_FAIL',
  'CHANGE_LOCALE', 'CHANGE_LOCALE_SUCCEED', 'CHANGE_LOCALE_FAILED',
  'SHOW_USER_PANEL', 'HIDE_USER_PANEL', 'SHOW_PREFERENCE_PANEL', 'HIDE_PREFERENCE_PANEL',
  'SHOW_ACCOUNT_PANEL', 'HIDE_ACCOUNT_PANEL',
]);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TRANSLATION_LOAD_SUCCEED:
      return {
        ...state,
        locale: action.params.locale,
        messages: action.result.data,
        loaded: true,
      };
    case actionTypes.SHOW_USER_PANEL: {
      return { ...state, panelVisible: true };
    }
    case actionTypes.HIDE_USER_PANEL: {
      return { ...state, panelVisible: false };
    }
    case actionTypes.SHOW_PREFERENCE_PANEL: {
      return { ...state, prefVisible: true };
    }
    case actionTypes.HIDE_PREFERENCE_PANEL: {
      return { ...state, prefVisible: false };
    }
    case actionTypes.SHOW_ACCOUNT_PANEL: {
      return { ...state, accountVisible: true };
    }
    case actionTypes.HIDE_ACCOUNT_PANEL: {
      return { ...state, accountVisible: false };
    }
    default:
      return state;
  }
}

export function loadTranslation(locale) {
  return {
    [CLIENT_API]: {
      types: [actionTypes.TRANSLATION_LOAD, actionTypes.TRANSLATION_LOAD_SUCCEED,
        actionTypes.TRANSLATION_LOAD_FAIL],
      endpoint: 'public/v1/intl/messages',
      method: 'get',
      params: { locale },
      origin: 'self',
    },
  };
}

export function changeUserLocale(loginId, locale) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHANGE_LOCALE,
        actionTypes.CHANGE_LOCALE_SUCCEED,
        actionTypes.CHANGE_LOCALE_FAILED,
      ],
      endpoint: 'v1/user/locale',
      method: 'post',
      data: { loginId, locale },
    },
  };
}

export function showUserPanel() {
  return {
    type: actionTypes.SHOW_USER_PANEL,
  };
}

export function hideUserPanel() {
  return {
    type: actionTypes.HIDE_USER_PANEL,
  };
}

export function showPreferencePanel() {
  return {
    type: actionTypes.SHOW_PREFERENCE_PANEL,
  };
}

export function hidePreferencePanel() {
  return {
    type: actionTypes.HIDE_PREFERENCE_PANEL,
  };
}

export function showAccountPanel() {
  return {
    type: actionTypes.SHOW_ACCOUNT_PANEL,
  };
}

export function hideAccountPanel() {
  return {
    type: actionTypes.HIDE_ACCOUNT_PANEL,
  };
}
