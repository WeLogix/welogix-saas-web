import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/blbook/', [
  'LOAD_INVT_LIST', 'LOAD_INVT_LIST_SUCCEED', 'LOAD_INVT_LIST_FAIL',
  'LOAD_STOCK_LIST', 'LOAD_STOCK_LIST_SUCCEED', 'LOAD_STOCK_LIST_FAIL',
  'LOAD_INVT_HEAD', 'LOAD_INVT_HEAD_SUCCEED', 'LOAD_INVT_HEAD_FAIL',
  'LOAD_INVT_BODY_LIST', 'LOAD_INVT_BODY_LIST_SUCCEED', 'LOAD_INVT_BODY_LIST_FAIL',
  'UPDATE_INVT_HEAD', 'UPDATE_INVT_HEAD_SUCCEED', 'UPDATE_INVT_HEAD_FAIL',
  'UPDATE_SASBL_BODY', 'UPDATE_SASBL_BODY_SUCCEED', 'UPDATE_SASBL_BODY_FAIL',
  'LOAD_STOCK_HEAD', 'LOAD_STOCK_HEAD_SUCCEED', 'LOAD_STOCK_HEAD_FAIL',
  'UPDATE_STOCK_HEAD', 'UPDATE_STOCK_HEAD_SUCCEED', 'UPDATE_STOCK_HEAD_FAIL',
  'NOTIFY_FORM_CHANGED', 'SHOW_CREATE_BATDECL_MODAL',
  'CREATE_BATCHDECL', 'CREATE_BATCHDECL_SUCCEED', 'CREATE_BATCHDECL_FAIL',
  'LOAD_BATCHDECL_LIST', 'LOAD_BATCHDECL_LIST_SUCCEED', 'LOAD_BATCHDECL_LIST_FAIL',
  'SHOW_ADD_STOCK_IO_MODAL', 'SHOW_CREATE_BIZAPPL_MODAL',
  'LOAD_BATCHDECL_DETAILS', 'LOAD_BATCHDECL_DETAILS_SUCCEED', 'LOAD_BATCHDECL_DETAILS_FAIL',
  'LOAD_BD_STOCKIOLIST', 'LOAD_BD_STOCKIOLIST_SUCCEED', 'LOAD_BD_STOCKIOLIST_FAIL',
  'ADD_OR_RM_BATSTOCK', 'ADD_OR_RM_BATSTOCK_SUCCEED', 'ADD_OR_RM_BATSTOCK_FAIL',
  'GET_BATCHDECL', 'GET_BATCHDECL_SUCCEED', 'GET_BATCHDECL_FAIL',
  'LOAD_BDSTOCKIOS_TO_ADD', 'LOAD_BDSTOCKIOS_TO_ADD_SUCCEED', 'LOAD_BDSTOCKIOS_TO_ADD_FAIL',
  'GET_COPNO_BY_ASNNO', 'GET_COPNO_BY_ASNNO_SUCCEED', 'GET_COPNO_BY_ASNNO_FAIL',
  'ADD_STOCK_TO_BD', 'ADD_STOCK_TO_BD_SUCCEED', 'ADD_STOCK_TO_BD_FAIL',
  'CREATE_PASSPORT', 'CREATE_PASSPORT_SUCCEED', 'CREATE_PASSPORT_FAIL',
  'LOAD_PASSPORT_LIST', 'LOAD_PASSPORT_LIST_SUCCEED', 'LOAD_PASSPORT_LIST_FAIL',
  'LOAD_PASS_HEAD', 'LOAD_PASS_HEAD_SUCCEED', 'LOAD_PASS_HEAD_FAIL',
  'UPDATE_PASS_THEAD', 'UPDATE_PASS_THEAD_SUCCEED', 'UPDATE_PASS_THEAD_FAIL',
  'CREATE_BIZ_APPL', 'CREATE_BIZ_APPL_SUCCEED', 'CREATE_BIZ_APPL_FAIL',
  'LOAD_BIZAPPL_LIST', 'LOAD_BIZAPPL_LIST_SUCCEED', 'LOAD_BIZAPPL_LIST_FAIL',
  'LOAD_BIZAPPL_HEAD', 'LOAD_BIZAPPL_HEAD_SUCCEED', 'LOAD_BIZAPPL_HEAD_FAIL',
  'UPDATE_BIZAPPL_HEAD', 'UPDATE_BIZAPPL_HEAD_SUCCEED', 'UPDATE_BIZAPPL_HEAD_FAIL',
  'LOAD_BIZAPPL_DETAILLIST', 'LOAD_BIZAPPL_DETAILLIST_SUCCEED', 'LOAD_BIZAPPL_DETAILLIST_FAIL',
  'UPDATE_BIZAPPL_DETAIL', 'UPDATE_BIZAPPL_DETAIL_SUCCEED', 'UPDATE_BIZAPPL_DETAIL_FAIL',
  'ADD_BIZAPPL_DETAIL', 'ADD_BIZAPPL_DETAIL_SUCCEED', 'ADD_BIZAPPL_DETAIL_FAIL',
  'BEGIN_BATCHD', 'BEGIN_BATCHD_SUCCEED', 'BEGIN_BATCHD_FAIL',
  'CANCEL_BATCHD', 'CANCEL_BATCHD_SUCCEED', 'CANCEL_BATCHD_FAIL',
  'LOAD_SASBL_INVENTORY_LIST', 'LOAD_SASBL_INVENTORY_LIST_SUCCEED', 'LOAD_SASBL_INVENTORY_LIST_FAIL',
  'SEND_SW_SASFILE', 'SEND_SW_SASFILE_SUCCEED', 'SEND_SW_SASFILE_FAIL',
  'SHOW_SEND_SW_SASFILE_MODAL', 'TOGGLE_SAS_DECL_MSG_MODAL',
  'REVERT_REG', 'REVERT_REG_SUCCEED', 'REVERT_REG_FAIL',
  'LOAD_BIZAPPLY_INFOS', 'LOAD_BIZAPPLY_INFOS_SUCCEED', 'LOAD_BIZAPPLY_INFOS_FAIL',
  'DELDIS_SAS_REG', 'DELDIS_SAS_REG_SUCCEED', 'DELDIS_SAS_REG_FAIL',
  'MANUAL_FILL_PRESASBLNO', 'MANUAL_FILL_PRESASBLNO_SUCCEED', 'MANUAL_FILL_PRESASBLNO_FAIL',
  'TOGGLE_FILL_PRESASBLNO_MODAL',
]);

const initialState = {
  invtFilters: {
    invt_status: 'all',
    partnerId: 'all',
  },
  invtList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  invtData: {},
  sasblBodyList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  listLoading: true,
  stockFilters: {
    partnerId: 'all',
    stock_status: 'all',
  },
  stockList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  batchDeclList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  batchDeclFilters: {
    partnerId: 'all',
    bdStatus: 'all',
  },
  bdLoading: false,
  bdreload: false,
  stockData: {},
  bapplFilters: {
    bappl_status: 'all',
  },
  formChanged: false,
  createBatModal: {
    visible: false,
  },
  addStockIoModal: {
    visible: false,
    // ioFlag: '', bd_ioflag
    // partnerId: , owner_partner_id
    // applyNo: , sasbl_apply_no
    // batchDeclNo: , batdecl_no
  },
  addStockIoModalLoading: false,
  bdAddStockFilters: {
    stockNo: '',
  },
  detailReload: false,
  batchDecl: [],
  stockIoList: [],
  bdDetails: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  passportList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  passportFilters: {
    partnerId: 'all',
    passStatus: 'all',
  },
  passportLoading: false,
  passportreload: false,
  bdDetailFilters: {
    search: '',
  },
  bdStockFilters: {
    search: '',
  },
  passHeadData: {},
  createBizApplModal: {
    visible: false,
  },
  bizApplList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  bizApplFilters: {
    partnerId: 'all',
    applStatus: 'all',
  },
  bizApplLoading: false,
  bizApplreload: false,
  bizApplHeadData: {},
  bizApplDetailList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  bndInvtFilters: {
    blbook_no: 'all',
  },
  sasInventoryList: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
  },
  bizApplDetailsLoading: false,
  ioboundHead: null,
  sendSwJG2FileModal: {
    copNo: null,
    visible: false,
    agentCode: null,
    regType: null,
    sendFlag: null,
    decType: 0,
    sending: false,
    sent: false,
  },
  msgModal: {
    visible: false,
    sasDecl: {},
  },
  bizApplyInfoList: [],
  preSasblNoModal: {
    visible: false,
    sasblreg: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_CREATE_BATDECL_MODAL:
      return { ...state, createBatModal: { ...state.createBatModal, ...action.data } };
    case actionTypes.SHOW_ADD_STOCK_IO_MODAL:
      return { ...state, addStockIoModal: { ...state.addStockIoModal, ...action.data } };
    case actionTypes.SHOW_CREATE_BIZAPPL_MODAL:
      return { ...state, createBizApplModal: { ...state.createBizApplModal, ...action.data } };
    case actionTypes.LOAD_INVT_LIST:
      return {
        ...state,
        invtFilters: JSON.parse(action.params.filters),
        listLoading: true,
      };
    case actionTypes.LOAD_INVT_LIST_SUCCEED:
      return {
        ...state,
        listLoading: false,
        invtList: { ...state.invtList, ...action.result.data },
      };
    case actionTypes.LOAD_BD_STOCKIOLIST:
      return {
        ...state,
        addStockIoModalLoading: true,
        bdAddStockFilters: JSON.parse(action.params.filters),
      };
    case actionTypes.LOAD_BD_STOCKIOLIST_SUCCEED:
      return {
        ...state,
        addStockIoModalLoading: false,
        stockIoList: action.result.data,
      };
    case actionTypes.LOAD_STOCK_LIST:
      return {
        ...state,
        stockFilters: JSON.parse(action.params.filters),
        listLoading: true,
      };
    case actionTypes.LOAD_STOCK_LIST_SUCCEED:
      return {
        ...state,
        listLoading: false,
        stockList: { ...state.stockList, ...action.result.data },
      };
    case actionTypes.LOAD_BATCHDECL_LIST:
      return {
        ...state, bdLoading: true,
      };
    case actionTypes.LOAD_BATCHDECL_LIST_FAIL:
      return {
        ...state, bdLoading: false,
      };
    case actionTypes.LOAD_BATCHDECL_LIST_SUCCEED:
      return {
        ...state,
        bdLoading: false,
        bdreload: false,
        batchDeclFilters: JSON.parse(action.params.filters),
        batchDeclList: { ...state.batchDeclList, ...action.result.data },
      };
    case actionTypes.LOAD_BATCHDECL_DETAILS_SUCCEED:
      return {
        ...state,
        bdDetailFilters: JSON.parse(action.params.filters),
        bdDetails: { ...state.bdDetails, ...action.result.data },
      };
    case actionTypes.CREATE_BATCHDECL_SUCCEED:
      return { ...state, bdreload: true };
    case actionTypes.LOAD_INVT_HEAD_SUCCEED:
      return {
        ...state,
        invtData: action.result.data.invt,
        ioboundHead: action.result.data.iobound,
      };
    case actionTypes.LOAD_STOCK_HEAD_SUCCEED:
      return {
        ...state,
        stockData: action.result.data.stock,
        ioboundHead: action.result.data.iobound,
      };
    case actionTypes.LOAD_INVT_BODY_LIST:
      return {
        ...state,
        listLoading: true,
      };
    case actionTypes.LOAD_INVT_BODY_LIST_SUCCEED:
      return {
        ...state,
        sasblBodyList: action.result.data,
        listLoading: false,
      };
    case actionTypes.LOAD_BIZAPPL_DETAILLIST:
      return {
        ...state,
        bizApplDetailsLoading: true,
      };
    case actionTypes.LOAD_BIZAPPL_DETAILLIST_SUCCEED:
      return {
        ...state,
        bizApplDetailList: action.result.data,
        bizApplDetailsLoading: false,
      };
    case actionTypes.NOTIFY_FORM_CHANGED:
      return {
        ...state,
        formChanged: action.changed,
      };
    case actionTypes.GET_BATCHDECL_SUCCEED:
      return {
        ...state,
        detailReload: false,
        batchDecl: action.result.data,
      };
    case actionTypes.ADD_OR_RM_BATSTOCK_SUCCEED:
      return {
        ...state, detailReload: true,
      };
    case actionTypes.LOAD_PASSPORT_LIST:
      return {
        ...state,
        passportLoading: true,
        passportFilters: JSON.parse(action.params.filters),
      };
    case actionTypes.LOAD_PASSPORT_LIST_SUCCEED:
      return {
        ...state,
        passportList: action.result.data,
        passportLoading: false,
      };
    case actionTypes.LOAD_PASSPORT_LIST_FAIL:
      return { ...state, passportLoading: false };
    case actionTypes.LOAD_PASS_HEAD_SUCCEED:
      return { ...state, passHeadData: action.result.data };
    case actionTypes.LOAD_BIZAPPL_HEAD_SUCCEED:
      return { ...state, bizApplHeadData: action.result.data };
    case actionTypes.LOAD_BIZAPPL_LIST:
      return {
        ...state,
        bizApplLoading: true,
        bizApplFilters: JSON.parse(action.params.filters),
      };
    case actionTypes.LOAD_BIZAPPL_LIST_SUCCEED:
      return {
        ...state,
        bizApplList: action.result.data,
        bizApplLoading: false,
      };
    case actionTypes.LOAD_BIZAPPL_LIST_FAIL:
      return { ...state, passportLoading: false };
    case actionTypes.BEGIN_BATCHD_SUCCEED:
      return { ...state, batchDecl: { ...state.batchDecl, bd_status: 2 } };
    case actionTypes.CANCEL_BATCHD_SUCCEED:
      return { ...state, batchDecl: { ...state.batchDecl, bd_status: 1 } };
    case actionTypes.LOAD_SASBL_INVENTORY_LIST:
      return {
        ...state,
        bndInvtFilters: JSON.parse(action.params.filters),
        listLoading: true,
      };
    case actionTypes.LOAD_SASBL_INVENTORY_LIST_SUCCEED:
      return {
        ...state,
        listLoading: false,
        sasInventoryList: { ...state.sasInventoryList, ...action.result.data },
      };
    case actionTypes.SHOW_SEND_SW_SASFILE_MODAL:
      return { ...state, sendSwJG2FileModal: { ...state.sendSwJG2FileModal, ...action.data } };
    case actionTypes.TOGGLE_SAS_DECL_MSG_MODAL:
      return {
        ...state,
        msgModal: {
          ...state.msgModal,
          visible: action.data.visible,
          sasDecl: action.data.sasDecl,
        },
      };
    case actionTypes.LOAD_BIZAPPLY_INFOS_SUCCEED:
      return {
        ...state,
        bizApplyInfoList: action.result.data,
      };
    case actionTypes.SEND_SW_SASFILE:
      return {
        ...state, sendSwJG2FileModal: { ...state.sendSwJG2FileModal, sending: true },
      };
    case actionTypes.SEND_SW_SASFILE_FAIL:
      return {
        ...state, sendSwJG2FileModal: { ...state.sendSwJG2FileModal, sending: false },
      };
    case actionTypes.SEND_SW_SASFILE_SUCCEED:
      return {
        ...state, sendSwJG2FileModal: { ...state.sendSwJG2FileModal, sending: false, sent: true },
      };
    case actionTypes.TOGGLE_FILL_PRESASBLNO_MODAL:
      return {
        ...state,
        preSasblNoModal: {
          visible: action.data.visible,
          sasblreg: action.data.sasblreg,
        },
      };
    default:
      return state;
  }
}

export function loadInvtList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVT_LIST,
        actionTypes.LOAD_INVT_LIST_SUCCEED,
        actionTypes.LOAD_INVT_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/invt/list',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}
export function loadInvtHead(copInvtregNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVT_HEAD,
        actionTypes.LOAD_INVT_HEAD_SUCCEED,
        actionTypes.LOAD_INVT_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/invt/head',
      method: 'get',
      params: { copInvtregNo, whseCode },
    },
  };
}

export function notifyFormChanged(changed) {
  return {
    type: actionTypes.NOTIFY_FORM_CHANGED,
    changed,
  };
}

export function loadBodyList({
  copSasblNo, blType, pageSize, current,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVT_BODY_LIST,
        actionTypes.LOAD_INVT_BODY_LIST_SUCCEED,
        actionTypes.LOAD_INVT_BODY_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bodylist',
      method: 'get',
      params: {
        copSasblNo, blType, pageSize, current,
      },
    },
  };
}

export function updateInvtHead(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_INVT_HEAD,
        actionTypes.UPDATE_INVT_HEAD_SUCCEED,
        actionTypes.UPDATE_INVT_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/update/invt/head',
      method: 'post',
      data,
    },
  };
}

export function updateSasblBody(data, contentLog, copSasblNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SASBL_BODY,
        actionTypes.UPDATE_SASBL_BODY_SUCCEED,
        actionTypes.UPDATE_SASBL_BODY_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/update/body/detail',
      method: 'post',
      data: { data, contentLog, copSasblNo },
    },
  };
}

export function loadStockioList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STOCK_LIST,
        actionTypes.LOAD_STOCK_LIST_SUCCEED,
        actionTypes.LOAD_STOCK_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/stockio/list',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function getBatchDeclList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BATCHDECL_LIST,
        actionTypes.LOAD_BATCHDECL_LIST_SUCCEED,
        actionTypes.LOAD_BATCHDECL_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecllist',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadStockHead(copStockNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STOCK_HEAD,
        actionTypes.LOAD_STOCK_HEAD_SUCCEED,
        actionTypes.LOAD_STOCK_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/stock/head',
      method: 'get',
      params: { copStockNo, whseCode },
    },
  };
}

export function updateStockHead(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_STOCK_HEAD,
        actionTypes.UPDATE_STOCK_HEAD_SUCCEED,
        actionTypes.UPDATE_STOCK_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/update/stock/head',
      method: 'post',
      data,
    },
  };
}

export function getSasblCopNo(number, type, bizType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_COPNO_BY_ASNNO,
        actionTypes.GET_COPNO_BY_ASNNO_SUCCEED,
        actionTypes.GET_COPNO_BY_ASNNO_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/copno',
      method: 'get',
      params: { number, type, bizType },
    },
  };
}

export function createBatchDecl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BATCHDECL,
        actionTypes.CREATE_BATCHDECL_SUCCEED,
        actionTypes.CREATE_BATCHDECL_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/newbatdecl',
      method: 'post',
      data,
    },
  };
}

export function loadBatDecl(bdNo, whseCode, ioFlag, filters) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_BATCHDECL,
        actionTypes.GET_BATCHDECL_SUCCEED,
        actionTypes.GET_BATCHDECL_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl',
      method: 'get',
      params: {
        bdNo, whseCode, ioFlag, filters: JSON.stringify(filters),
      },
    },
  };
}

export function createPassPort(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_PASSPORT,
        actionTypes.CREATE_PASSPORT_SUCCEED,
        actionTypes.CREATE_PASSPORT_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/newpassport',
      method: 'post',
      data,
    },
  };
}

export function createBizAppl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BIZ_APPL,
        actionTypes.CREATE_BIZ_APPL_SUCCEED,
        actionTypes.CREATE_BIZ_APPL_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/newbizappl',
      method: 'post',
      data,
    },
  };
}

export function getBatchDeclDetails({
  bdNo, whseCode, pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BATCHDECL_DETAILS,
        actionTypes.LOAD_BATCHDECL_DETAILS_SUCCEED,
        actionTypes.LOAD_BATCHDECL_DETAILS_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/bdetails',
      method: 'get',
      params: {
        bdNo, whseCode, pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function showCreateBizApplModal(data) {
  return {
    type: actionTypes.SHOW_CREATE_BIZAPPL_MODAL,
    data,
  };
}

export function showCreateBatDeclModal(data) {
  return {
    type: actionTypes.SHOW_CREATE_BATDECL_MODAL,
    data,
  };
}

export function showAddStockIoModal(data) {
  return {
    type: actionTypes.SHOW_ADD_STOCK_IO_MODAL,
    data,
  };
}

export function loadBdStockIoList({
  whseCode, stockNo, batdecNo, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BD_STOCKIOLIST,
        actionTypes.LOAD_BD_STOCKIOLIST_SUCCEED,
        actionTypes.LOAD_BD_STOCKIOLIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/stockiolist',
      method: 'get',
      params: {
        whseCode, stockNo, batdecNo, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadBdStockIosToAdd({
  whseCode, ioFlag, partnerId, applyNo, stockNo, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BDSTOCKIOS_TO_ADD,
        actionTypes.LOAD_BDSTOCKIOS_TO_ADD_SUCCEED,
        actionTypes.LOAD_BDSTOCKIOS_TO_ADD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/stockiolist',
      method: 'get',
      params: {
        whseCode, ioFlag, partnerId, applyNo, stockNo, filters: JSON.stringify(filters),
      },
    },
  };
}

export function addOrRmBatStock(copStockNos, bdNo, ioFlag, unBatch) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_OR_RM_BATSTOCK,
        actionTypes.ADD_OR_RM_BATSTOCK_SUCCEED,
        actionTypes.ADD_OR_RM_BATSTOCK_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/addstock',
      method: 'put',
      data: {
        copStockNos, bdNo, ioFlag, unBatch,
      },
    },
  };
}

export function loadPassportList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PASSPORT_LIST,
        actionTypes.LOAD_PASSPORT_LIST_SUCCEED,
        actionTypes.LOAD_PASSPORT_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/passportlist',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadPassHead(copPassNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PASS_HEAD,
        actionTypes.LOAD_PASS_HEAD_SUCCEED,
        actionTypes.LOAD_PASS_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/pass/head',
      method: 'get',
      params: { copPassNo, whseCode },
    },
  };
}

export function loadBizApplHead(copBizApplNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZAPPL_HEAD,
        actionTypes.LOAD_BIZAPPL_HEAD_SUCCEED,
        actionTypes.LOAD_BIZAPPL_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bizapplhead',
      method: 'get',
      params: { copBizApplNo, whseCode },
    },
  };
}

export function updatePasstHead(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_PASS_THEAD,
        actionTypes.UPDATE_PASS_THEAD_SUCCEED,
        actionTypes.UPDATE_PASS_THEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/update/pass/head',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function loadBizApplList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZAPPL_LIST,
        actionTypes.LOAD_BIZAPPL_LIST_SUCCEED,
        actionTypes.LOAD_BIZAPPL_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bizapplist',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function updatebizApplHead(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BIZAPPL_HEAD,
        actionTypes.UPDATE_BIZAPPL_HEAD_SUCCEED,
        actionTypes.UPDATE_BIZAPPL_HEAD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/updateapplhead',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function updateBizApplDetail(data, contentLog, copBapplNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BIZAPPL_DETAIL,
        actionTypes.UPDATE_BIZAPPL_DETAIL_SUCCEED,
        actionTypes.UPDATE_BIZAPPL_DETAIL_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/updateappldetail',
      method: 'post',
      data: { data, contentLog, copBapplNo },
    },
  };
}

export function loadBizApplDetailList({
  copBizApplNo, blType, pageSize, current,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZAPPL_DETAILLIST,
        actionTypes.LOAD_BIZAPPL_DETAILLIST_SUCCEED,
        actionTypes.LOAD_BIZAPPL_DETAILLIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bizappl/detaillist',
      method: 'get',
      params: {
        copBizApplNo, blType, pageSize, current,
      },
    },
  };
}

export function addBizApplDetail(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_BIZAPPL_DETAIL,
        actionTypes.ADD_BIZAPPL_DETAIL_SUCCEED,
        actionTypes.ADD_BIZAPPL_DETAIL_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bizappl/adddetail',
      method: 'post',
      data,
    },
  };
}

export function beginSasBatchDecl(batchDeclNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BEGIN_BATCHD,
        actionTypes.BEGIN_BATCHD_SUCCEED,
        actionTypes.BEGIN_BATCHD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/begindecl',
      method: 'post',
      data: { batchDeclNo },
    },
  };
}

export function cancelSasBatchDecl(batchDeclNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_BATCHD,
        actionTypes.CANCEL_BATCHD_SUCCEED,
        actionTypes.CANCEL_BATCHD_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/batdecl/canceldecl',
      method: 'post',
      data: { batchDeclNo },
    },
  };
}

export function loadSasblInventoryList({
  whseCode, pageSize, currentPage, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SASBL_INVENTORY_LIST,
        actionTypes.LOAD_SASBL_INVENTORY_LIST_SUCCEED,
        actionTypes.LOAD_SASBL_INVENTORY_LIST_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/inventory/balancelist',
      method: 'get',
      params: {
        whseCode, pageSize, currentPage, filters: JSON.stringify(filters),
      },
    },
  };
}

export function sendSwJG2File({
  copNo, swClientUid, regType, delcFlag, sendFlag,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEND_SW_SASFILE,
        actionTypes.SEND_SW_SASFILE_SUCCEED,
        actionTypes.SEND_SW_SASFILE_FAIL,
      ],
      endpoint: 'v1/paas/swjg2/filesend',
      method: 'post',
      data: {
        copNo, swClientUid, regType, delcFlag, sendFlag,
      },
    },
  };
}

export function revertRegSend(copNo, regType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REVERT_REG,
        actionTypes.REVERT_REG_SUCCEED,
        actionTypes.REVERT_REG_FAIL,
      ],
      endpoint: 'v1/paas/swjg2/revertreg',
      method: 'get',
      params: { copNo, regType },
    },
  };
}

export function showSendSwJG2File({
  visible = true, copNo, agentCode, regType, decType, sendFlag,
}) {
  return {
    type: actionTypes.SHOW_SEND_SW_SASFILE_MODAL,
    data: {
      visible, copNo, agentCode, regType, decType, sendFlag,
    },
  };
}

export function toggleSasDeclMsgModal(visible, sasDecl) {
  return {
    type: actionTypes.TOGGLE_SAS_DECL_MSG_MODAL,
    data: {
      visible,
      sasDecl,
    },
  };
}

export function loadBizApplyInfos(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZAPPLY_INFOS,
        actionTypes.LOAD_BIZAPPLY_INFOS_SUCCEED,
        actionTypes.LOAD_BIZAPPLY_INFOS_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/bizapplinfos',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function delDisSasblReg(copNo, sasRegType, actionType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELDIS_SAS_REG,
        actionTypes.DELDIS_SAS_REG_SUCCEED,
        actionTypes.DELDIS_SAS_REG_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/deldisSasblReg',
      method: 'post',
      data: { copNo, sasRegType, actionType },
    },
  };
}

export function toggleFillPreSasblNoModal(visible, sasblreg) {
  return {
    type: actionTypes.TOGGLE_FILL_PRESASBLNO_MODAL,
    data: {
      visible,
      sasblreg,
    },
  };
}

export function manualFillPreSasblNo(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MANUAL_FILL_PRESASBLNO,
        actionTypes.MANUAL_FILL_PRESASBLNO_SUCCEED,
        actionTypes.MANUAL_FILL_PRESASBLNO_FAIL,
      ],
      endpoint: 'v1/cwm/sasblreg/manual/fillsaspreno',
      method: 'post',
      data,
    },
  };
}
