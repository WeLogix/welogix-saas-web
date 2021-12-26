import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/paas/integration/', [
  'LOAD_INSTALLED', 'LOAD_INSTALLED_SUCCEED', 'LOAD_INSTALLED_FAIL',
  'UPDATE_APPSTATUS', 'UPDATE_APPSTATUS_SUCCEED', 'UPDATE_APPSTATUS_FAIL',
  'INSTALL_EASI', 'INSTALL_EASI_SUCCEED', 'INSTALL_EASI_FAIL',
  'LOAD_EASI', 'LOAD_EASI_SUCCEED', 'LOAD_EASI_FAIL',
  'UPDATE_EASI', 'UPDATE_EASI_SUCCEED', 'UPDATE_EASI_FAIL',
  'DEL_APP', 'DEL_APP_SUCCEED', 'DEL_APP_FAIL',
  'LOAD_ARC', 'LOAD_ARC_SUCCEED', 'LOAD_ARC_FAIL',
  'INSTALL_ARC', 'INSTALL_ARC_SUCCEED', 'INSTALL_ARC_FAIL',
  'UPDATE_ARC', 'UPDATE_ARC_SUCCEED', 'UPDATE_ARC_FAIL',
  'LOAD_SHFTZ', 'LOAD_SHFTZ_SUCCEED', 'LOAD_SHFTZ_FAIL',
  'INSTALL_SHFTZ', 'INSTALL_SHFTZ_SUCCEED', 'INSTALL_SHFTZ_FAIL',
  'UPDATE_SHFTZ', 'UPDATE_SHFTZ_SUCCEED', 'UPDATE_SHFTZ_FAIL',
  'LOAD_FTZ_WHSESUPV', 'LOAD_FTZ_WHSESUPV_SUCCEED', 'LOAD_FTZ_WHSESUPV_FAIL',
  'INSTALL_SFEXPRESS', 'INSTALL_SFEXPRESS_SUCCEED', 'INSTALL_SFEXPRESS_FAIL',
  'LOAD_SFEXPRESS', 'LOAD_SFEXPRESS_SUCCEED', 'LOAD_SFEXPRESS_FAIL',
  'UPDATE_SFEXPRESS', 'UPDATE_SFEXPRESS_SUCCEED', 'UPDATE_SFEXPRESS_FAIL',
  'TOGGLE_INSTALL_APP_MODAL',
  'UPDATE_INTE_BASIC_INFO', 'UPDATE_INTE_BASIC_INFO_SUCCEED', 'UPDATE_INTE_BASIC_INFO_FAIL',
  'INSTALL_SINGLE_WINDOW', 'INSTALL_SINGLE_WINDOW_SUCCEED', 'INSTALL_SINGLE_WINDOW_FAIL',
  'LOAD_SINGLE_WINDOW', 'LOAD_SINGLE_WINDOW_SUCCEED', 'LOAD_SINGLE_WINDOW_FAIL',
  'UPDATE_SINGLE_WINDOW', 'UPDATE_SINGLE_WINDOW_SUCCEED', 'UPDATE_SINGLE_WINDOW_FAIL',
  'LOAD_SINGLE_WINDOWS', 'LOAD_SINGLE_WINDOWS_SUCCEED', 'LOAD_SINGLE_WINDOWS_FAIL',
  'LOAD_CLIENT_LOG', 'LOAD_CLIENT_LOG_SUCCEED', 'LOAD_CLIENT_LOG_FAIL',
  'TOGGLE_PANEL_VISIBLE',
  'GET_EASIPASS_LIST', 'GET_EASIPASS_LIST_SUCCEED', 'GET_EASIPASS_LIST_FAIL',
]);

const initialState = {
  loading: false,
  installedAppsList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  sortFilter: {
    field: '',
    order: '',
  },
  listFilter: {},
  currentApp: {
    name: '',
    enabled: -1,
  },
  easipassApp: {},
  arctm: {},
  shftzApp: {},
  sfexpress: {},
  singlewindowApp: {},
  swClientList: [],
  epList: [],
  whseSuppSHFtzApps: [],
  whseSuppSasBLApps: [],
  installAppModal: {
    visible: false,
    type: '',
  },
  clientLogsPanel: {
    appId: null,
    visible: false,
    reload: false,
    clientLogList: {
      totalCount: 0,
      pageSize: 20,
      current: 1,
      data: [],
    },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_INSTALLED:
      return {
        ...state,
        listFilter: JSON.parse(action.params.filter),
        sortFilter: JSON.parse(action.params.sorter),
        loading: true,
      };
    case actionTypes.LOAD_INSTALLED_SUCCEED:
      return {
        ...state,
        loading: false,
        installedAppsList: action.result.data,
        currentApp: initialState.currentApp,
        easipassApp: initialState.easipassApp,
        arctm: initialState.arctm,
        shftzApp: initialState.shftzApp,
        sfexpress: initialState.sfexpress,
        singlewindowApp: initialState.singlewindowApp,
      };
    case actionTypes.LOAD_INSTALLED_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_EASI_SUCCEED:
      return {
        ...state,
        easipassApp: action.result.data,
        currentApp: {
          uuid: action.result.data.uuid,
          name: action.result.data.name,
          enabled: action.result.data.enabled,
        },
      };
    case actionTypes.LOAD_ARC_SUCCEED:
      return {
        ...state,
        arctm: action.result.data,
        currentApp: {
          uuid: action.result.data.uuid,
          name: action.result.data.name,
          enabled: action.result.data.enabled,
        },
      };
    case actionTypes.LOAD_SHFTZ_SUCCEED:
      return {
        ...state,
        shftzApp: action.result.data,
        currentApp: {
          uuid: action.result.data.uuid,
          name: action.result.data.name,
          enabled: action.result.data.enabled,
        },
      };
    case actionTypes.LOAD_SFEXPRESS_SUCCEED:
      return {
        ...state,
        sfexpress: action.result.data,
        currentApp: {
          uuid: action.result.data.uuid,
          name: action.result.data.name,
          enabled: action.result.data.enabled,
        },
      };
    case actionTypes.LOAD_FTZ_WHSESUPV_SUCCEED:
      return { ...state, whseSuppSHFtzApps: action.result.data };
    case actionTypes.UPDATE_APPSTATUS_SUCCEED:
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          enabled: action.result.data.enabled,
        },
      };
    case actionTypes.UPDATE_INTE_BASIC_INFO_SUCCEED:
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          name: action.data.name,
        },
      };
    case actionTypes.TOGGLE_INSTALL_APP_MODAL:
      return {
        ...state,
        installAppModal: {
          ...state.installAppModal,
          visible: action.visible,
          type: action.appType,
        },
      };
    case actionTypes.LOAD_SINGLE_WINDOW_SUCCEED:
      return {
        ...state,
        singlewindowApp: action.result.data,
        currentApp: {
          clientStatus: action.result.data.clientStatus,
          uuid: action.result.data.uuid,
          name: action.result.data.name,
          enabled: action.result.data.enabled,
        },
        clientLogsPanel: {
          ...state.clientLogsPanel,
          appId: action.result.data.dev_app_id,
        },
      };
    case actionTypes.LOAD_SINGLE_WINDOWS_SUCCEED:
      return { ...state, swClientList: action.result.data };
    case actionTypes.TOGGLE_PANEL_VISIBLE: {
      return {
        ...state,
        clientLogsPanel: {
          ...state.clientLogsPanel,
          visible: action.data.visible,
          reload: action.data.visible,
        },
      };
    }
    case actionTypes.LOAD_CLIENT_LOG:
      return {
        ...state,
        clientLogsPanel: {
          ...state.clientLogsPanel,
          reload: false,
        },
      };
    case actionTypes.LOAD_CLIENT_LOG_SUCCEED:
      return {
        ...state,
        clientLogsPanel: {
          ...state.clientLogsPanel,
          clientLogList: action.result.data,
        },
        currentApp: {
          ...state.currentApp,
          clientStatus: action.result.data.clientStatus,
        },
      };
    case actionTypes.GET_EASIPASS_LIST_SUCCEED:
      return { ...state, epList: action.result.data };
    default:
      return state;
  }
}

export function loadInstalledApps(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INSTALLED,
        actionTypes.LOAD_INSTALLED_SUCCEED,
        actionTypes.LOAD_INSTALLED_FAIL,
      ],
      endpoint: 'v1/platform/integration/installed',
      method: 'get',
      params,
    },
  };
}

export function installEasipassApp(easipass) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INSTALL_EASI,
        actionTypes.INSTALL_EASI_SUCCEED,
        actionTypes.INSTALL_EASI_FAIL,
      ],
      endpoint: 'v1/platform/integration/install/easipass',
      method: 'post',
      data: easipass,
    },
  };
}

export function loadEasipassApp(appuuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_EASI,
        actionTypes.LOAD_EASI_SUCCEED,
        actionTypes.LOAD_EASI_FAIL,
      ],
      endpoint: 'v1/platform/integration/easipass',
      method: 'get',
      params: { uuid: appuuid },
    },
  };
}

export function updateEasipassApp(easipass) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_EASI,
        actionTypes.UPDATE_EASI_SUCCEED,
        actionTypes.UPDATE_EASI_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/easipass',
      method: 'post',
      data: easipass,
    },
  };
}

export function updateAppStatus(enabled) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_APPSTATUS,
        actionTypes.UPDATE_APPSTATUS_SUCCEED,
        actionTypes.UPDATE_APPSTATUS_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/app/status',
      method: 'post',
      data: enabled,
    },
  };
}

export function deleteApp(appuuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_APP,
        actionTypes.DEL_APP_SUCCEED,
        actionTypes.DEL_APP_FAIL,
      ],
      endpoint: 'v1/platform/integration/delete',
      method: 'post',
      data: { uuid: appuuid },
    },
  };
}

export function loadArCtmApp(uuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ARC,
        actionTypes.LOAD_ARC_SUCCEED,
        actionTypes.LOAD_ARC_FAIL,
      ],
      endpoint: 'v1/platform/integration/arctm',
      method: 'get',
      params: { uuid },
    },
  };
}

export function installArCtmApp(arctm) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INSTALL_ARC,
        actionTypes.INSTALL_ARC_SUCCEED,
        actionTypes.INSTALL_ARC_FAIL,
      ],
      endpoint: 'v1/platform/integration/install/arctm',
      method: 'post',
      data: arctm,
    },
  };
}

export function updateArCtmApp(arctm) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ARC,
        actionTypes.UPDATE_ARC_SUCCEED,
        actionTypes.UPDATE_ARC_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/arctm',
      method: 'post',
      data: arctm,
    },
  };
}

export function loadShftzApp(uuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SHFTZ,
        actionTypes.LOAD_SHFTZ_SUCCEED,
        actionTypes.LOAD_SHFTZ_FAIL,
      ],
      endpoint: 'v1/platform/integration/shftz',
      method: 'get',
      params: { uuid },
    },
  };
}

export function installShftzApp(shftz) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INSTALL_SHFTZ,
        actionTypes.INSTALL_SHFTZ_SUCCEED,
        actionTypes.INSTALL_SHFTZ_FAIL,
      ],
      endpoint: 'v1/platform/integration/install/shftz',
      method: 'post',
      data: shftz,
    },
  };
}

export function updateShftzApp(shftz) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SHFTZ,
        actionTypes.UPDATE_SHFTZ_SUCCEED,
        actionTypes.UPDATE_SHFTZ_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/shftz',
      method: 'post',
      data: shftz,
    },
  };
}

export function loadShFtzWhseSupervisionApps() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FTZ_WHSESUPV,
        actionTypes.LOAD_FTZ_WHSESUPV_SUCCEED,
        actionTypes.LOAD_FTZ_WHSESUPV_FAIL,
      ],
      endpoint: 'v1/platform/integration/whse/supervisions',
      method: 'get',
    },
  };
}

export function installSFExpressApp(easipass) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INSTALL_SFEXPRESS,
        actionTypes.INSTALL_SFEXPRESS_SUCCEED,
        actionTypes.INSTALL_SFEXPRESS_FAIL,
      ],
      endpoint: 'v1/platform/integration/install/sfexpress',
      method: 'post',
      data: easipass,
    },
  };
}

export function loadSFExpressApp(appuuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SFEXPRESS,
        actionTypes.LOAD_SFEXPRESS_SUCCEED,
        actionTypes.LOAD_SFEXPRESS_FAIL,
      ],
      endpoint: 'v1/platform/integration/sfexpress',
      method: 'get',
      params: { uuid: appuuid },
    },
  };
}

export function updateSFExpressApp(easipass) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SFEXPRESS,
        actionTypes.UPDATE_SFEXPRESS_SUCCEED,
        actionTypes.UPDATE_SFEXPRESS_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/sfexpress',
      method: 'post',
      data: easipass,
    },
  };
}

export function toggleInstallAppModal(visible, appType) {
  return {
    type: actionTypes.TOGGLE_INSTALL_APP_MODAL,
    visible,
    appType,
  };
}

export function updateInteBasicInfo({ name, uuid }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_INTE_BASIC_INFO,
        actionTypes.UPDATE_INTE_BASIC_INFO_SUCCEED,
        actionTypes.UPDATE_INTE_BASIC_INFO_FAIL,
      ],
      endpoint: 'v1/platform/integration/basic/info/update',
      method: 'post',
      data: { name, uuid },
    },
  };
}

export function installSinglewindowApp(singlewindow) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INSTALL_SINGLE_WINDOW,
        actionTypes.INSTALL_SINGLE_WINDOW_SUCCEED,
        actionTypes.INSTALL_SINGLE_WINDOW_FAIL,
      ],
      endpoint: 'v1/platform/integration/install/singlewindow',
      method: 'post',
      data: singlewindow,
    },
  };
}

export function loadSingleWindowApp(appuuid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SINGLE_WINDOW,
        actionTypes.LOAD_SINGLE_WINDOW_SUCCEED,
        actionTypes.LOAD_SINGLE_WINDOW_FAIL,
      ],
      endpoint: 'v1/platform/integration/singlewindow',
      method: 'get',
      params: { uuid: appuuid },
    },
  };
}

export function updateSingleWindowApp(singlewindow) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SINGLE_WINDOW,
        actionTypes.UPDATE_SINGLE_WINDOW_SUCCEED,
        actionTypes.UPDATE_SINGLE_WINDOW_FAIL,
      ],
      endpoint: 'v1/platform/integration/update/singlewindow',
      method: 'post',
      data: singlewindow,
    },
  };
}

// 单一窗口标准版导入客户端
export function loadAllSingleWindowApps(agentCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SINGLE_WINDOWS,
        actionTypes.LOAD_SINGLE_WINDOWS_SUCCEED,
        actionTypes.LOAD_SINGLE_WINDOWS_FAIL,
      ],
      endpoint: 'v1/platform/integration/singlewindows',
      method: 'get',
      params: { agentCode },
    },
  };
}

export function toggleClientLogPanel(visible) {
  return {
    type: actionTypes.TOGGLE_PANEL_VISIBLE,
    data: { visible },
  };
}

export function loadClientlogs({
  appId, pageSize, current,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CLIENT_LOG,
        actionTypes.LOAD_CLIENT_LOG_SUCCEED,
        actionTypes.LOAD_CLIENT_LOG_FAIL,
      ],
      endpoint: 'v1/platform/integration/client/logs',
      method: 'get',
      params: {
        appId, pageSize, current,
      },
    },
  };
}

// 单一窗口上海版协同客户端
export function getEasipassList(agentCustCo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_EASIPASS_LIST,
        actionTypes.GET_EASIPASS_LIST_SUCCEED,
        actionTypes.GET_EASIPASS_LIST_FAIL,
      ],
      endpoint: 'v1/platform/integration/easipassList',
      method: 'get',
      params: { agentCustCo },
    },
  };
}
