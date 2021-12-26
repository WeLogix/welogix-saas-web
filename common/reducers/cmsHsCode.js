import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/hscode/', [
  'LOAD_HSCODES', 'LOAD_HSCODES_SUCCEED', 'LOAD_HSCODES_FAIL',
  'LOAD_HSCODE_CATEGORIES', 'LOAD_HSCODE_CATEGORIES_SUCCEED', 'LOAD_HSCODE_CATEGORIES_FAIL',
  'ADD_HSCODE_CATEGORY', 'ADD_HSCODE_CATEGORY_SUCCEED', 'ADD_HSCODE_CATEGORY_FAIL',
  'REMOVE_HSCODE_CATEGORY', 'REMOVE_HSCODE_CATEGORY_SUCCEED', 'REMOVE_HSCODE_CATEGORY_FAIL',
  'UPDATE_HSCODE_CATEGORY', 'UPDATE_HSCODE_CATEGORY_SUCCEED', 'UPDATE_HSCODE_CATEGORY_FAIL',
  'LOAD_CATEGORY_HSCODE', 'LOAD_CATEGORY_HSCODE_SUCCEED', 'LOAD_CATEGORY_HSCODE_FAIL',
  'ADD_CATEGORY_HSCODE', 'ADD_CATEGORY_HSCODE_SUCCEED', 'ADD_CATEGORY_HSCODE_FAIL',
  'REMOVE_CATEGORY_HSCODE', 'REMOVE_CATEGORY_HSCODE_SUCCEED', 'REMOVE_CATEGORY_HSCODE_FAIL',
  'GET_ELEMENT_BY_HSCODE', 'GET_ELEMENT_BY_HSCODE_SUCCEED', 'GET_ELEMENT_BY_HSCODE_FAIL',
  'LOADLF_HSCODE', 'LOADLF_HSCODE_SUCCEED', 'LOADLF_HSCODE_FAIL',
  'LOAD_HSCQL', 'LOAD_HSCQL_SUCCEED', 'LOAD_HSCQL_FAIL',
  'SHOW_CIQ_PANEL', 'TOGGLE_CATEGORY_MODAL',
  'LOAD_CIQ_CODE_LIST', 'LOAD_CIQ_CODE_LIST_SUCCEED', 'LOAD_CIQ_CODE_LIST_FAIL',
]);

const initialState = {
  ciqPanel: {
    ciqcdList: [],
    visible: false,
    ciqInfo: {
      hscode: '',
    },
  },
  hscodes: {
    data: [],
    pageSize: 20,
    current: 1,
    totalCount: 0,
    searchText: '',
  },
  hscodeCategories: [],
  categoryHscodesLoading: true,
  categoryHscodes: {
    data: [],
    pageSize: 20,
    current: 1,
    totalCount: 0,
  },
  categoryHsListFilter: {
    categoryId: -1,
    search: '',
  },
  fuzzyHscodes: [],
  hsCiqList: [],
  categoryModal: {
    visible: false,
    hscodeCategory: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_HSCODES_SUCCEED:
      return { ...state, hscodes: { ...state.hscodes, ...action.result.data } };
    case actionTypes.LOAD_HSCODE_CATEGORIES:
      return { ...state, categoryHscodesLoading: true };
    case actionTypes.LOAD_HSCODE_CATEGORIES_SUCCEED:
      return {
        ...state,
        hscodeCategories: action.result.data.categories,
        categoryHscodesLoading: false,
      };
    case actionTypes.LOAD_HSCODE_CATEGORIES_FAIL:
      return { ...state, categoryHscodesLoading: false };
    case actionTypes.ADD_HSCODE_CATEGORY_SUCCEED: {
      const hscodeCategories = [...state.hscodeCategories];
      hscodeCategories.push(action.result.data);
      return { ...state, hscodeCategories };
    }
    case actionTypes.REMOVE_HSCODE_CATEGORY_SUCCEED:
      return {
        ...state,
        hscodeCategories:
        state.hscodeCategories.filter(item => item.id !== action.data.id),
      };
    case actionTypes.UPDATE_HSCODE_CATEGORY_SUCCEED: {
      const hscodeCategories = state.hscodeCategories.map((item) => {
        if (item.id === action.data.id) {
          return { ...item, ...action.data.category };
        }
        return item;
      });
      return { ...state, hscodeCategories };
    }
    case actionTypes.LOAD_CATEGORY_HSCODE:
      return { ...state, categoryHsListFilter: JSON.parse(action.params.listFilter) };
    case actionTypes.LOAD_CATEGORY_HSCODE_SUCCEED:
      return { ...state, categoryHscodes: { ...state.categoryHscodes, ...action.result.data } };
    case actionTypes.LOADLF_HSCODE_SUCCEED:
      return { ...state, fuzzyHscodes: action.result.data };
    case actionTypes.LOAD_HSCQL_SUCCEED:
      return { ...state, hsCiqList: action.result.data };
    case actionTypes.SHOW_CIQ_PANEL: {
      return {
        ...state,
        ciqPanel: {
          visible: action.data.visible,
          hscode: action.data.ciqInfo ?
            action.data.ciqInfo.hscode : initialState.ciqPanel.ciqInfo.hscode,
        },
      };
    }
    case actionTypes.LOAD_CIQ_CODE_LIST_SUCCEED:
      return {
        ...state,
        ciqPanel: { ...state.ciqPanel, ciqcdList: action.result.data },
      };
    case actionTypes.TOGGLE_CATEGORY_MODAL:
      return { ...state, categoryModal: { ...state.categoryModal, ...action.data } };
    default:
      return state;
  }
}
export function loadCiqCodeList(hscode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CIQ_CODE_LIST,
        actionTypes.LOAD_CIQ_CODE_LIST_SUCCEED,
        actionTypes.LOAD_CIQ_CODE_LIST_FAIL,
      ],
      endpoint: 'v1/saas/hscode/hsciqs',
      method: 'get',
      params: { hscode },
    },
  };
}

export function showCiqPanel(visible, ciqInfo) {
  return {
    type: actionTypes.SHOW_CIQ_PANEL,
    data: { visible, ciqInfo },
  };
}

export function loadHscodes(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_HSCODES,
        actionTypes.LOAD_HSCODES_SUCCEED,
        actionTypes.LOAD_HSCODES_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/hscodes',
      method: 'get',
      params,
    },
  };
}

export function loadHsCodeCategories() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_HSCODE_CATEGORIES,
        actionTypes.LOAD_HSCODE_CATEGORIES_SUCCEED,
        actionTypes.LOAD_HSCODE_CATEGORIES_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/categories',
      method: 'get',
    },
  };
}

export function addHsCodeCategory(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_HSCODE_CATEGORY,
        actionTypes.ADD_HSCODE_CATEGORY_SUCCEED,
        actionTypes.ADD_HSCODE_CATEGORY_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/category/add',
      method: 'post',
      data,
    },
  };
}

export function removeHsCodeCategory(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_HSCODE_CATEGORY,
        actionTypes.REMOVE_HSCODE_CATEGORY_SUCCEED,
        actionTypes.REMOVE_HSCODE_CATEGORY_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/category/remove',
      method: 'post',
      data: { id },
    },
  };
}

export function updateHsCodeCategory(id, category) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_HSCODE_CATEGORY,
        actionTypes.UPDATE_HSCODE_CATEGORY_SUCCEED,
        actionTypes.UPDATE_HSCODE_CATEGORY_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/category/update',
      method: 'post',
      data: { id, category },
    },
  };
}

export function loadCategoryHsCode({
  current, pageSize, listFilter,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CATEGORY_HSCODE,
        actionTypes.LOAD_CATEGORY_HSCODE_SUCCEED,
        actionTypes.LOAD_CATEGORY_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/categoryHsCode',
      method: 'get',
      params: {
        current, pageSize, listFilter: JSON.stringify(listFilter),
      },
    },
  };
}

export function addCategoryHsCode(categoryId, hscode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_CATEGORY_HSCODE,
        actionTypes.ADD_CATEGORY_HSCODE_SUCCEED,
        actionTypes.ADD_CATEGORY_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/categoryHscode/add',
      method: 'post',
      data: { categoryId, hscode },
    },
  };
}

export function removeCategoryHsCode(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_CATEGORY_HSCODE,
        actionTypes.REMOVE_CATEGORY_HSCODE_SUCCEED,
        actionTypes.REMOVE_CATEGORY_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/cmsTradeitem/hscode/categoryHscode/remove',
      method: 'post',
      data: { id },
    },
  };
}

export function getElementByHscode(hscode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_ELEMENT_BY_HSCODE,
        actionTypes.GET_ELEMENT_BY_HSCODE_SUCCEED,
        actionTypes.GET_ELEMENT_BY_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/get/element/by/hscode',
      method: 'get',
      params: { hscode },
    },
  };
}

export function loadLimitFuzzyHscodes(hscode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOADLF_HSCODE,
        actionTypes.LOADLF_HSCODE_SUCCEED,
        actionTypes.LOADLF_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/hs/limit/fuzzy/hscodes',
      method: 'get',
      params: { hscode },
    },
  };
}

export function loadHscodeCiqList(hscode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_HSCQL,
        actionTypes.LOAD_HSCQL_SUCCEED,
        actionTypes.LOAD_HSCQL_FAIL,
      ],
      endpoint: 'v1/saas/hscode/hsciqs',
      method: 'get',
      params: { hscode },
    },
  };
}
export function toggleCategoryModal(visible, hscodeCategory = {}) {
  return {
    type: actionTypes.TOGGLE_CATEGORY_MODAL,
    data: { visible, hscodeCategory },
  };
}
