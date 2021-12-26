import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/blbook/', [
  'SHOW_CREATE_BOOK_MODAL',
  'CREATE_BOOK', 'CREATE_BOOK_SUCCEED', 'CREATE_BOOK_FAIL',
  'LOAD_BOOKS', 'LOAD_BOOKS_SUCCEED', 'LOAD_BOOKS_FAIL',
  'LOAD_BOOK_HEAD', 'LOAD_BOOK_HEAD_SUCCEED', 'LOAD_BOOK_HEAD_FAIL',
  'UPDATE_BOOKS_HEAD', 'UPDATE_BOOKS_HEAD_SUCCEED', 'UPDATE_BOOKS_HEAD_FAIL',
  'DELETE_BOOKS', 'DELETE_BOOKS_SUCCEED', 'DELETE_BOOKS_FAIL',
  'LOAD_BOOK_GOODS_LIST', 'LOAD_BOOK_GOODS_LIST_SUCCEED', 'LOAD_BOOK_GOODS_LIST_FAIL',
  'CREATE_BOOK_GOODS', 'CREATE_BOOK_GOODS_SUCCEED', 'CREATE_BOOK_GOODS_FAIL',
  'UPDATE_BOOK_GOODS', 'UPDATE_BOOK_GOODS_SUCCEED', 'UPDATE_BOOK_GOODS_FAIL',
  'DELETE_BOOK_GOODS', 'DELETE_BOOK_GOODS_SUCCEED', 'DELETE_BOOK_GOODS_FAIL',
  'CREATE_BOOK_UCONSUM', 'CREATE_BOOK_UCONSUM_SUCCEED', 'CREATE_BOOK_UCONSUM_FAIL',
  'UPDATE_BOOK_UCONSUM', 'UPDATE_BOOK_UCONSUM_SUCCEED', 'UPDATE_BOOK_UCONSUM_FAIL',
  'LOAD_UCONSUM_LIST', 'LOAD_UCONSUM_LIST_SUCCEED', 'LOAD_UCONSUM_LIST_FAIL',
  'DELETE_BOOK_UCONSUM', 'DELETE_BOOK_UCONSUM_SUCCEED', 'DELETE_BOOK_UCONSUM_FAIL',
]);

const initialState = {
  bookList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    bookListLoading: true,
  },
  formChanged: false,
  listFilters: {
    ownerCode: 'all',
  },
  bookData: {},
  createBookModal: {
    visible: false,
  },
  endProductList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    endProductListLoading: true,
  },
  materailsList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    materailsListLoading: true,
  },
  endProductListFilters: {},
  materailsListFilters: {},
  uConsumList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    uConsumListLoading: true,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_CREATE_BOOK_MODAL:
      return { ...state, createBookModal: { ...state.createBookModal, visible: action.data } };
    case actionTypes.LOAD_BOOKS:
      return {
        ...state,
        listFilters: JSON.parse(action.params.filters),
        bookList: { ...state.bookList, bookListLoading: true },
      };
    case actionTypes.LOAD_BOOKS_SUCCEED:
      return { ...state, bookList: { ...action.result.data, bookListLoading: false } };
    case actionTypes.LOAD_BOOK_HEAD_SUCCEED:
      return { ...state, bookData: action.result.data };
    case actionTypes.UPDATE_BOOKS_HEAD_SUCCEED:
      return { ...state, blBookData: { ...state.blBookData, ...action.data } };
    case actionTypes.LOAD_BOOK_GOODS_LIST: {
      const { prdGoodsMark } = action.params;
      if (prdGoodsMark === 'I') {
        return {
          ...state,
          materailsListFilters: action.params.filters ? JSON.parse(action.params.filters) : {},
          materailsList: { ...state.materailsList, materailsListLoading: true },
        };
      }
      return {
        ...state,
        endProductListFilters: action.params.filters ? JSON.parse(action.params.filters) : {},
        endProductList: { ...state.endProductList, endProductListLoading: true },
      };
    }
    case actionTypes.LOAD_BOOK_GOODS_LIST_SUCCEED: {
      const { prdGoodsMark } = action.params;
      if (prdGoodsMark === 'I') {
        return {
          ...state,
          materailsList: { ...action.result.data, materailsListLoading: false },
        };
      }
      return {
        ...state,
        endProductList: { ...action.result.data, endProductListLoading: false },
      };
    }
    case actionTypes.LOAD_UCONSUM_LIST:
      return {
        ...state,
        uConsumList: { ...state.uConsumList, uConsumListLoading: true },
      };
    case actionTypes.LOAD_UCONSUM_LIST_SUCCEED:
      return {
        ...state,
        uConsumList: { ...action.result.data, uConsumListLoading: false },
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

export function createBook(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BOOK,
        actionTypes.CREATE_BOOK_SUCCEED,
        actionTypes.CREATE_BOOK_FAIL,
      ],
      endpoint: 'v1/pts/book/newbook',
      method: 'post',
      data: params,
    },
  };
}

export function loadBooks({
  pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BOOKS,
        actionTypes.LOAD_BOOKS_SUCCEED,
        actionTypes.LOAD_BOOKS_FAIL,
      ],
      endpoint: 'v1/pts/booklist',
      method: 'get',
      params: {
        pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadBookHead(bookId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BOOK_HEAD,
        actionTypes.LOAD_BOOK_HEAD_SUCCEED,
        actionTypes.LOAD_BOOK_HEAD_FAIL,
      ],
      endpoint: 'v1/pts/bookhead',
      method: 'get',
      params: { bookId },
    },
  };
}

export function updateBookHead(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BOOKS_HEAD,
        actionTypes.UPDATE_BOOKS_HEAD_SUCCEED,
        actionTypes.UPDATE_BOOKS_HEAD_FAIL,
      ],
      endpoint: 'v1/pts/book/updatehead',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function deleteBook(copManualNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BOOKS,
        actionTypes.DELETE_BOOKS_SUCCEED,
        actionTypes.DELETE_BOOKS_FAIL,
      ],
      endpoint: 'v1/pts/book/delbook',
      method: 'get',
      params: { copManualNo },
    },
  };
}

export function loadBookGoodsList({
  blBookNo, pageSize, current, filters, prdGoodsMark,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BOOK_GOODS_LIST,
        actionTypes.LOAD_BOOK_GOODS_LIST_SUCCEED,
        actionTypes.LOAD_BOOK_GOODS_LIST_FAIL,
      ],
      endpoint: 'v1/pts/book/goods',
      method: 'get',
      params: {
        blBookNo, pageSize, current, filters: JSON.stringify(filters || {}), prdGoodsMark,
      },
    },
  };
}

export function createBookGoods(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BOOK_GOODS,
        actionTypes.CREATE_BOOK_GOODS_SUCCEED,
        actionTypes.CREATE_BOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/pts/book/newgoods',
      method: 'post',
      data,
    },
  };
}

export function updateBookGoods(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BOOK_GOODS,
        actionTypes.UPDATE_BOOK_GOODS_SUCCEED,
        actionTypes.UPDATE_BOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/pts/book/updategoods',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function deleteBookGoods(idList) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BOOK_GOODS,
        actionTypes.DELETE_BOOK_GOODS_SUCCEED,
        actionTypes.DELETE_BOOK_GOODS_FAIL,
      ],
      endpoint: 'v1/pts/book/delgoods',
      method: 'post',
      data: { idList },
    },
  };
}

export function createBookUConsum(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BOOK_UCONSUM,
        actionTypes.CREATE_BOOK_UCONSUM_SUCCEED,
        actionTypes.CREATE_BOOK_UCONSUM_FAIL,
      ],
      endpoint: 'v1/pts/book/newuconsums',
      method: 'post',
      data,
    },
  };
}

export function updateBookUConsum(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BOOK_UCONSUM,
        actionTypes.UPDATE_BOOK_UCONSUM_SUCCEED,
        actionTypes.UPDATE_BOOK_UCONSUM_FAIL,
      ],
      endpoint: 'v1/pts/book/updateuconsum',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function loadBookUConsumList({
  bookNo, pageSize, current, searchFields,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_UCONSUM_LIST,
        actionTypes.LOAD_UCONSUM_LIST_SUCCEED,
        actionTypes.LOAD_UCONSUM_LIST_FAIL,
      ],
      endpoint: 'v1/pts/book/uconsumlist',
      method: 'get',
      params: {
        bookNo, pageSize, current, searchFields,
      },
    },
  };
}

export function deleteBookUConsum(idList) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BOOK_UCONSUM,
        actionTypes.DELETE_BOOK_UCONSUM_SUCCEED,
        actionTypes.DELETE_BOOK_UCONSUM_FAIL,
      ],
      endpoint: 'v1/pts/book/deluconsum',
      method: 'post',
      data: { idList },
    },
  };
}
