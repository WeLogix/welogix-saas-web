import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/blbook/', [
  'SHOW_CREATE_BOOK_MODAL', // 第一行
  'CREATE_BL_BOOK', 'CREATE_BL_BOOK_SUCCEED', 'CREATE_BL_BOOK_FAIL',
  'LOAD_BL_BOOK_HEAD', 'LOAD_BL_BOOK_HEAD_SUCCEED', 'LOAD_BL_BOOK_HEAD_FAIL',
  'LOAD_BL_BOOK_GOODS_LIST', 'LOAD_BL_BOOK_GOODS_LIST_SUCCEED', 'LOAD_BL_BOOK_GOODS_LIST_FAIL',
  'LOAD_BL_BOOKS', 'LOAD_BL_BOOKS_SUCCEED', 'LOAD_BL_BOOKS_FAIL',
  'GET_BOOKS_BY_TYPE', 'GET_BOOKS_BY_TYPE_SUCCEED', 'GET_BOOKS_BY_TYPE_FAIL',
  'CREATE_BL_BOOK_GOODS', 'CREATE_BL_BOOK_GOODS_SUCCEED', 'CREATE_BL_BOOK_GOODS_FAIL',
  'UPDATE_BL_BOOK_GOODS', 'UPDATE_BL_BOOK_GOODS_SUCCEED', 'UPDATE_BL_BOOK_GOODS_FAIL',
  'UPDATE_BL_BOOKS_HEAD', 'UPDATE_BL_BOOKS_HEAD_SUCCEED', 'UPDATE_BL_BOOKS_HEAD_FAIL',
  'GET_REGISTERED_BLBOOK', 'GET_REGISTERED_BLBOOK_SUCCEED', 'GET_REGISTERED_BLBOOK_FAIL',
  'DELETE_BL_BOOKS', 'DELETE_BL_BOOKS_SUCCEED', 'DELETE_BL_BOOKS_FAIL',
  'NOTIFY_FORM_CHANGED', 'GET_PARTNER_BLBOOKS', 'GET_PARTNER_BLBOOKS_SUCCEED',
  'LOAD_UNREG_GOODS_LIST', 'LOAD_UNREG_GOODS_LIST_SUCCEED', 'LOAD_UNREG_GOODS_LIST_FAIL',
  'SYNC_REPO_ITEM', 'SYNC_REPO_ITEM_SUCCEED', 'SYNC_REPO_ITEM_FAIL',
  'DELETE_UNREG_BLBOOK_GOODS', 'DELETE_UNREG_BLBOOK_GOODS_SUCCEED', 'DELETE_UNREG_BLBOOK_GOODS_FAIL',
  'LOAD_WHOLE_UNREG_LIST', 'LOAD_WHOLE_UNREG_LIST_SUCCEED', 'LOAD_WHOLE_UNREG_LIST_FAIL',
  'GET_PARTNER_BLBOOKS_FAIL',
  'GET_BLBOOK_RELATED_INFO', 'GET_BLBOOK_RELATED_INFO_SUCCEED', 'GET_BLBOOK_RELATED_INFO_FAIL',
  'BLBG_INVALID_CHANGE', 'BLBG_INVALID_CHANGE_SUCCEED', 'BLBG_INVALID_CHANGE_FAIL',
  'GET_BLBOOK_RELATED_BY_TASK', 'GET_BLBOOK_RELATED_BY_TASK_SUCCEED', 'GET_BLBOOK_RELATED_BY_TASK_FAIL',
  'GET_BOOKGOODS_BY_ITEMNO', 'GET_BOOKGOODS_BY_ITEMNO_SUCCEED', 'GET_BOOKGOODS_BY_ITEMNO_FAIL',
]);

const initialState = {
  blBookData: {},
  blBookGoodsList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    blBookGoodsListLoading: true,
  },
  unRegisterGoodsList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    unRegGoodsListLoading: true,
  },
  wholeUnRegGoodsList: [],
  createBookModal: {
    visible: false,
  },
  registeredBlBookList: [],
  blbookList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    blbookListLoading: true,
  },
  formChanged: false,
  listFilters: {
    blbook_status: 'all', ownerCode: 'all',
  },
  goodslistFilters: { status: 1 },
  unRegGoodslistFilters: { status: 2 },
  blBooksByType: [],
  tradeItemRelGoods: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_CREATE_BOOK_MODAL:
      return { ...state, createBookModal: { ...state.createBookModal, visible: action.data } };
    case actionTypes.LOAD_BL_BOOK_HEAD_SUCCEED:
      return { ...state, blBookData: action.result.data };
    case actionTypes.LOAD_BL_BOOK_GOODS_LIST:
      return {
        ...state,
        goodslistFilters: action.params.filters ? JSON.parse(action.params.filters) : {},
        blBookGoodsList: { ...state.blBookGoodsList, blBookGoodsListLoading: true },
      };
    case actionTypes.LOAD_BL_BOOK_GOODS_LIST_SUCCEED:
      return {
        ...state,
        blBookGoodsList: { ...action.result.data, blBookGoodsListLoading: false },
      };
    case actionTypes.LOAD_UNREG_GOODS_LIST:
      return {
        ...state,
        unRegGoodslistFilters: action.params.filters ? JSON.parse(action.params.filters) : {},
        unRegisterGoodsList: { ...state.unRegisterGoodsList, unRegGoodsListLoading: true },
      };
    case actionTypes.LOAD_UNREG_GOODS_LIST_SUCCEED:
      return {
        ...state,
        unRegisterGoodsList: { ...action.result.data, unRegGoodsListLoading: false },
      };
    case actionTypes.LOAD_WHOLE_UNREG_LIST_SUCCEED:
      return {
        ...state,
        wholeUnRegGoodsList: action.result.data,
      };
    case actionTypes.LOAD_BL_BOOKS:
      return {
        ...state,
        listFilters: JSON.parse(action.params.filters),
        blbookList: { ...state.blbookList, blbookListLoading: true },
      };
    case actionTypes.LOAD_BL_BOOKS_SUCCEED:
      return { ...state, blbookList: { ...action.result.data, blbookListLoading: false } };
    case actionTypes.GET_REGISTERED_BLBOOK_SUCCEED:
      return { ...state, registeredBlBookList: action.result.data };
    case actionTypes.UPDATE_BL_BOOKS_HEAD_SUCCEED:
      return { ...state, blBookData: { ...state.blBookData, ...action.data } };
    case actionTypes.GET_BOOKS_BY_TYPE_SUCCEED:
      return { ...state, blBooksByType: action.result.data };
    case actionTypes.GET_BLBOOK_RELATED_BY_TASK_SUCCEED:
    case actionTypes.GET_BLBOOK_RELATED_INFO_SUCCEED:
      return { ...state, tradeItemRelGoods: action.result.data };
    case actionTypes.BLBG_INVALID_CHANGE_SUCCEED: {
      const { ids, status } = action.data;
      return {
        ...state,
        tradeItemRelGoods: state.tradeItemRelGoods.map((reg) => {
          if (ids.find(id => id === reg.id)) {
            return { ...reg, blbg_invalid: status ? 0 : 1 };
          }
          return reg;
        }),
      };
    }
    case actionTypes.NOTIFY_FORM_CHANGED:
      return {
        ...state,
        formChanged: action.changed,
      };
    default:
      return state;
  }
}

export function showCreateBookModal(visible) {
  return {
    type: actionTypes.SHOW_CREATE_BOOK_MODAL,
    data: visible,
  };
}

export function createBlBook(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BL_BOOK,
        actionTypes.CREATE_BL_BOOK_SUCCEED,
        actionTypes.CREATE_BL_BOOK_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/create/blbook',
      method: 'post',
      data: params,
    },
  };
}

export function loadBlBookHead(blBookId, blBookNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BL_BOOK_HEAD,
        actionTypes.LOAD_BL_BOOK_HEAD_SUCCEED,
        actionTypes.LOAD_BL_BOOK_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/head',
      method: 'get',
      params: { blBookId, blBookNo },
    },
  };
}

export function loadBlBookGoodsList({
  blBookNo, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BL_BOOK_GOODS_LIST,
        actionTypes.LOAD_BL_BOOK_GOODS_LIST_SUCCEED,
        actionTypes.LOAD_BL_BOOK_GOODS_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/blbookbody/goods',
      method: 'get',
      params: {
        blBookNo, pageSize, current, filters: JSON.stringify(filters || {}),
      },
    },
  };
}

export function loadUnRegGoodsList({
  blBookNo, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UNREG_GOODS_LIST,
        actionTypes.LOAD_UNREG_GOODS_LIST_SUCCEED,
        actionTypes.LOAD_UNREG_GOODS_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/blbookbody/goods',
      method: 'get',
      params: {
        blBookNo, pageSize, current, filters: JSON.stringify(filters || {}),
      },
    },
  };
}

export function loadWholeUnRegGoods(blBookNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHOLE_UNREG_LIST,
        actionTypes.LOAD_WHOLE_UNREG_LIST_SUCCEED,
        actionTypes.LOAD_WHOLE_UNREG_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/blbookbody/whole/unreg/goods',
      method: 'get',
      params: { blBookNo },
    },
  };
}

export function loadBlBooks({
  whseCode, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BL_BOOKS,
        actionTypes.LOAD_BL_BOOKS_SUCCEED,
        actionTypes.LOAD_BL_BOOKS_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/blbooklist',
      method: 'get',
      params: {
        whseCode, pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function updateBlBookGoods(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BL_BOOK_GOODS,
        actionTypes.UPDATE_BL_BOOK_GOODS_SUCCEED,
        actionTypes.UPDATE_BL_BOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/update/blbgoods',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function createBlBookGoods(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BL_BOOK_GOODS,
        actionTypes.CREATE_BL_BOOK_GOODS_SUCCEED,
        actionTypes.CREATE_BL_BOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/create/blbgoods',
      method: 'post',
      data,
    },
  };
}

export function getBlBookNosByType(whseCode, bookType, partnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BOOKS_BY_TYPE,
        actionTypes.GET_BOOKS_BY_TYPE_SUCCEED,
        actionTypes.GET_BOOKS_BY_TYPE_FAIL,
      ],
      endpoint: 'v1/paas/book/typebooklist',
      method: 'get',
      params: { whseCode, bookType, partnerId },
    },
  };
}

export function updateBlBookHead(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BL_BOOKS_HEAD,
        actionTypes.UPDATE_BL_BOOKS_HEAD_SUCCEED,
        actionTypes.UPDATE_BL_BOOKS_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/update/blBook/head',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function deleteBlBook(copManualNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BL_BOOKS,
        actionTypes.DELETE_BL_BOOKS_SUCCEED,
        actionTypes.DELETE_BL_BOOKS_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/delete/blbook',
      method: 'get',
      params: { copManualNo },
    },
  };
}

export function notifyFormChanged(changed) {
  return {
    type: actionTypes.NOTIFY_FORM_CHANGED,
    changed,
  };
}

export function loadRegisteredBlBooks(whseCode, ownerPartnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_REGISTERED_BLBOOK,
        actionTypes.GET_REGISTERED_BLBOOK_SUCCEED,
        actionTypes.GET_REGISTERED_BLBOOK_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/registered/blbooks',
      method: 'get',
      params: { whseCode, ownerPartnerId },
    },
  };
}

export function syncRepoItem(blBookNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SYNC_REPO_ITEM,
        actionTypes.SYNC_REPO_ITEM_SUCCEED,
        actionTypes.SYNC_REPO_ITEM_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/kbook/syncrepoitem',
      method: 'post',
      data: { blBookNo },
    },
  };
}

export function deleteUnregBlBookGoods(idList) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_UNREG_BLBOOK_GOODS,
        actionTypes.DELETE_UNREG_BLBOOK_GOODS_SUCCEED,
        actionTypes.DELETE_UNREG_BLBOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/delete/blbook/goods',
      method: 'post',
      data: { idList },
    },
  };
}

export function getTradeItemAndBlbookRelatedInfo(tradeItemId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BLBOOK_RELATED_INFO,
        actionTypes.GET_BLBOOK_RELATED_INFO_SUCCEED,
        actionTypes.GET_BLBOOK_RELATED_INFO_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/tradeitemgoods',
      method: 'get',
      params: { tradeItemId },
    },
  };
}

export function updateBlbookGoodsInvalid(ids, status) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BLBG_INVALID_CHANGE,
        actionTypes.BLBG_INVALID_CHANGE_SUCCEED,
        actionTypes.BLBG_INVALID_CHANGE_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/updateinvalid',
      method: 'post',
      data: { ids, status },
    },
  };
}

export function getBlbookRelatedByTask(taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BLBOOK_RELATED_BY_TASK,
        actionTypes.GET_BLBOOK_RELATED_BY_TASK_SUCCEED,
        actionTypes.GET_BLBOOK_RELATED_BY_TASK_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/tradetaskgoods',
      method: 'get',
      params: { taskId },
    },
  };
}

export function getBookGoodsByPrdtItemNo(bookNo, prdtItemNo, ietype, tradeMode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BOOKGOODS_BY_ITEMNO,
        actionTypes.GET_BOOKGOODS_BY_ITEMNO_SUCCEED,
        actionTypes.GET_BOOKGOODS_BY_ITEMNO_FAIL,
      ],
      endpoint: 'v1/cwm/blbook/goods/byitemno',
      method: 'get',
      params: {
        bookNo, prdtItemNo, ietype, tradeMode,
      },
    },
  };
}

