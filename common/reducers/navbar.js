import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/navbar/', [
  'NAVB_SET_TITLE', 'NAVB_GOBACK', 'TOGGLE_TOPPANEL', 'TOGGLE_PAGE_DROPDOWN', 'TOGGLE_ALERT',
]);

const initialState = {
  navTitle: {
    depth: 1,
    // 第一级为首页,不显示相关导航标题信息
    // 第二级为模块公共信息,显示模块导航栏
    // 第三级为当前编辑页面内容信息与返回图标
    text: '',
    title: null,
    moduleName: '',
    jumpOut: false,
    stack: 0, // depth 3 link jumps
    collapsed: true,
    dropDown: false,
  },
  backed: false,
  sidePanelInfo: {
    topPanelCollapsed: false,
    topPanelHeight: 0,
  },
  pageDrwopdownPinned: false,
  hasAlert: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.NAVB_SET_TITLE: {
      let { stack } = state.navTitle;
      if (state.navTitle.depth === 3 && action.navInfo.depth === 3) {
        if (!state.backed) {
          stack += 1; // 页面回退时stack不变
        }
      } else if (action.navInfo.depth === 2) {
        stack = 1;
      }
      return { ...state, navTitle: { ...state.navTitle, ...action.navInfo, stack }, backed: false };
    }
    case actionTypes.NAVB_GOBACK: {
      return {
        ...state,
        navTitle: { ...state.navTitle, stack: state.navTitle.stack - 1 },
        backed: true,
      };
    }
    case actionTypes.TOGGLE_TOPPANEL: {
      const { collapsed, height } = action.data;
      return {
        ...state,
        sidePanelInfo: {
          topPanelHeight: height,
          topPanelCollapsed: collapsed === null ?
            state.sidePanelInfo.topPanelCollapsed : collapsed,
        },
      };
    }
    case actionTypes.TOGGLE_PAGE_DROPDOWN: {
      const { pinned } = action.data;
      return {
        ...state,
        pageDrwopdownPinned: pinned,
      };
    }
    case actionTypes.TOGGLE_ALERT: {
      const { hasAlert } = action.data;
      return {
        ...state,
        hasAlert,
      };
    }
    default:
      return state;
  }
}

export function setNavTitle(navInfo) {
  return {
    type: actionTypes.NAVB_SET_TITLE,
    navInfo,
  };
}

export function goBackNav() {
  return { type: actionTypes.NAVB_GOBACK };
}

export function toggleSidePanelState(collapsed, height = 0) {
  return {
    type: actionTypes.TOGGLE_TOPPANEL,
    data: { collapsed, height },
  };
}

export function togglePageDropdown(pinned) {
  return {
    type: actionTypes.TOGGLE_PAGE_DROPDOWN,
    data: { pinned },
  };
}

export function toggleAlert(hasAlert) {
  return {
    type: actionTypes.TOGGLE_ALERT,
    data: { hasAlert },
  };
}
