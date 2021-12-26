import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/hub/devapp/', [
  'TOGGLE_APP_CREATE_MODAL', 'SHOW_OACMODAL',
  'CREATE_APP', 'CREATE_APP_SUCCEED', 'CREATE_APP_FAIL',
  'LOAD_DEV_APPS', 'LOAD_DEV_APPS_SUCCEED', 'LOAD_DEV_APPS_FAIL',
  'GET_APP', 'GET_APP_SUCCEED', 'GET_APP_FAIL',
  'UPDATE_BASIC_INFO', 'UPDATE_BASIC_INFO_SUCCEED', 'UPDATE_BASIC_INFO_FAIL',
  'DELETE_DEV_APP', 'DELETE_DEV_APP_SUCCEED', 'DELETE_DEV_APP_FAIL',
  'UPDATE_CALLBACK_URL', 'UPDATE_CALLBACK_URL_SUCCEED', 'UPDATE_CALLBACK_URL_FAIL',
  'TOGGLE_STATUS', 'TOGGLE_STATUS_SUCCEED', 'TOGGLE_STATUS_FAIL',
  'UPDATE_HOOK_URL', 'UPDATE_HOOK_URL_SUCCEED', 'UPDATE_HOOK_URL_FAIL',
  'UPDATE_ENTRANCE_URL', 'UPDATE_ENTRANCE_URL_SUCCEED', 'UPDATE_ENTRANCE_URL_FAIL',
  'UPDATE_DEVAPPSETT', 'UPDATE_DEVAPPSETT_SUCCEED', 'UPDATE_DEVAPPSETT_FAIL',
  'GEN_OAUTHTK', 'GEN_OAUTHTK_SUCCEED', 'GEN_OAUTHTK_FAIL',
]);

const initialState = {
  appCreateModal: {
    visible: false,
  },
  openapiConfigModal: {
    visible: false,
  },
  app: {},
  apps: {
    data: [],
    pageSize: 20,
    current: 1,
  },
  filter: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_APP_CREATE_MODAL:
      return { ...state, appCreateModal: { ...state.appCreateModal, visible: action.visible } };
    case actionTypes.SHOW_OACMODAL:
      return { ...state, openapiConfigModal: { ...state.openapiConfigModal, ...action.data } };
    case actionTypes.GET_APP_SUCCEED:
      return { ...state, app: action.result.data };
    case actionTypes.LOAD_DEV_APPS_SUCCEED:
      return { ...state, apps: action.result.data };
    case actionTypes.UPDATE_DEVAPPSETT_SUCCEED:
      return { ...state, app: { ...state.app, ...action.data.setting } };
    case actionTypes.GEN_OAUTHTK_SUCCEED:
      return { ...state, app: { ...state.app, access_token: action.result.data.access_token } };
    default:
      return state;
  }
}

export function toggleAppCreateModal(visible) {
  return {
    type: actionTypes.TOGGLE_APP_CREATE_MODAL,
    visible,
  };
}

export function showOpenApiConfigModal(visible) {
  return {
    type: actionTypes.SHOW_OACMODAL,
    data: { visible },
  };
}

export function createApp(appName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_APP,
        actionTypes.CREATE_APP_SUCCEED,
        actionTypes.CREATE_APP_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/create',
      method: 'post',
      data: { appName },
    },
  };
}

export function loadDevApps({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DEV_APPS,
        actionTypes.LOAD_DEV_APPS_SUCCEED,
        actionTypes.LOAD_DEV_APPS_FAIL,
      ],
      endpoint: 'v1/hub/dev/apps/load',
      method: 'get',
      params: { pageSize, current, filter },
    },
  };
}

export function getApp(appId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_APP,
        actionTypes.GET_APP_SUCCEED,
        actionTypes.GET_APP_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/get',
      method: 'get',
      params: { appId },
    },
  };
}

export function updateBasicInfo(appId, appLogo, appDesc, appName, grantedOpetrators, appType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BASIC_INFO,
        actionTypes.UPDATE_BASIC_INFO_SUCCEED,
        actionTypes.UPDATE_BASIC_INFO_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/basic/info/update',
      method: 'post',
      data: {
        appId, appLogo, appDesc, appName, grantedOpetrators, appType,
      },
    },
  };
}

export function deleteDevApp(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_DEV_APP,
        actionTypes.DELETE_DEV_APP_SUCCEED,
        actionTypes.DELETE_DEV_APP_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function updateCallbackUrl(url, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CALLBACK_URL,
        actionTypes.UPDATE_CALLBACK_URL_SUCCEED,
        actionTypes.UPDATE_CALLBACK_URL_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/callback/url/update',
      method: 'post',
      data: { url, id },
    },
  };
}

export function toggleStatus(status, id, appId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TOGGLE_STATUS,
        actionTypes.TOGGLE_STATUS_SUCCEED,
        actionTypes.TOGGLE_STATUS_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/status/toggle',
      method: 'post',
      data: { status, id, appId },
    },
  };
}

export function updateHookUrl(url, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_HOOK_URL,
        actionTypes.UPDATE_HOOK_URL_SUCCEED,
        actionTypes.UPDATE_HOOK_URL_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/hook/url/update',
      method: 'post',
      data: { url, id },
    },
  };
}

export function updateEntranceUrl(urls, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ENTRANCE_URL,
        actionTypes.UPDATE_ENTRANCE_URL_SUCCEED,
        actionTypes.UPDATE_ENTRANCE_URL_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/entrance/url/update',
      method: 'post',
      data: { urls, id },
    },
  };
}

export function updateDevAppSetting(setting, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_DEVAPPSETT,
        actionTypes.UPDATE_DEVAPPSETT_SUCCEED,
        actionTypes.UPDATE_DEVAPPSETT_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/update/setting',
      method: 'post',
      data: { setting, id },
    },
  };
}

export function genOAuthToken(appid, appSecret) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GEN_OAUTHTK,
        actionTypes.GEN_OAUTHTK_SUCCEED,
        actionTypes.GEN_OAUTHTK_FAIL,
      ],
      endpoint: 'v1/hub/dev/app/gen/oauth/token',
      method: 'post',
      data: { appid, appSecret },
    },
  };
}
