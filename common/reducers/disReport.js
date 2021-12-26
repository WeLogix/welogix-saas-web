import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/dis/report/', [
  'TOGGLE_CREATE_REPORT_MODAL',
  'CREATE_REPORT', 'CREATE_REPORT_SUCCEED', 'CREATE_REPORT_FAIL',
  'DEL_REPORT', 'DEL_REPORT_SUCCEED', 'DEL_REPORT_FAIL',
  'LOAD_REPORTS', 'LOAD_REPORTS_SUCCEED', 'LOAD_REPORTS_FAIL',
  'GET_REPORT_CONFIG', 'GET_REPORT_CONFIG_SUCCEED', 'GET_REPORT_CONFIG_FAIL',
  'SAVE_REPORT_CONFIG', 'SAVE_REPORT_CONFIG_SUCCEED', 'SAVE_REPORT_CONFIG_FAIL',
  'GET_REPORT_DATA', 'GET_REPORT_DATA_SUCCEED', 'GET_REPORT_DATA_FAIL',
  'PREVIEW_REPORT', 'PREVIEW_REPORT_SUCCEED', 'PREVIEW_REPORT_FAIL',
  'SET_DELETE_SQLATTR_IDS', 'SET_REPORT_EDITED',
  'TOGGLE_CREATE_REPORT_CATEGORY_MODAL',
  'CREATE_REPORT_CATEGORY', 'CREATE_REPORT_CATEGORY_SUCCEED', 'CREATE_REPORT_CATEGORY_FAIL',
  'LOAD_REPORTS_CATEGORY', 'LOAD_REPORTS_CATEGORY_SUCCEED', 'LOAD_REPORTS_CATEGORY_FAIL',
  'CHANGE_REPORT_CATEGORY', 'CHANGE_REPORT_CATEGORY_SUCCEED', 'CHANGE_REPORT_CATEGORY_FAIL',
  'DELE_CATEGORY', 'DELE_CATEGORY_SUCCEED', 'DELE_CATEGORY_FAIL',
  'RENAME_CATEGORY', 'RENAME_CATEGORY_SUCCEED', 'RENAME_CATEGORY_FAIL',
  'RENAME_REPORT', 'RENAME_REPORT_SUCCEED', 'RENAME_REPORT_FAIL',
  'EXPORT_RPTBUF', 'EXPORT_RPTBUF_SUCCEED', 'EXPORT_RPTBUF_FAIL',
]);

const initialState = {
  createReportModal: {
    visible: false,
  },
  createReportCatModal: {
    visible: false,
  },
  categoryList: [],
  reportList: {
    current: 1,
    pageSize: 20,
    data: [],
    totalCount: 0,
  },
  reportListFilter: { },
  reportListLoading: false,
  reportListReload: false,
  currentReport: {},
  whereClauseFieldsLists: [
    [{ field: null, compareCondition: null, value: null }],
  ],
  configLoading: false,
  groupByFields: [{ field: null, bizObject: null }],
  sqlAttributes: [],
  reportObjectMeta: {},
  deleteSqlAttrIds: [],
  previewList: [],
  previewAttrbs: [],
  previewed: false,
  previewListLoading: false,
  reportData: {
    rptDataListLoading: false,
    attributes: [],
    dataList: {
      current: 1,
      pageSize: 20,
      data: [],
      totalCount: 0,
    },
  },
  edited: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_CREATE_REPORT_MODAL:
      return {
        ...state,
        createReportModal: {
          visible: action.data.visible,
        },
      };
    case actionTypes.TOGGLE_CREATE_REPORT_CATEGORY_MODAL:
      return {
        ...state,
        createReportCatModal: {
          ...state.createReportCatModal,
          visible: action.data.visible,
          rptInfo: action.data.rptInfo,
          mode: action.data.mode,
        },
      };
    case actionTypes.LOAD_REPORTS_CATEGORY_SUCCEED:
      return {
        ...state,
        categoryList: action.result.data,
      };
    case actionTypes.LOAD_REPORTS:
      return {
        ...state,
        reportListFilter: JSON.parse(action.params.filter),
        reportListLoading: true,
        reportListReload: false,
      };
    case actionTypes.LOAD_REPORTS_SUCCEED:
      return { ...state, reportList: action.result.data, reportListLoading: false };
    case actionTypes.LOAD_REPORTS_FAIL:
      return { ...state, reportListLoading: false };
    case actionTypes.CREATE_REPORT_SUCCEED:
    case actionTypes.DEL_REPORT_SUCCEED: {
      const { totalCount, pageSize, current } = state.reportList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, 1);
      return {
        ...state,
        reportList: { ...state.reportList, current: currentPage },
        reportListReload: true,
      };
    }
    case actionTypes.GET_REPORT_CONFIG:
      return {
        ...state,
        configLoading: true,
        deleteSqlAttrIds: [],
        edited: false,
        previewList: [],
        previewAttrbs: [],
        previewed: false,
      };
    case actionTypes.GET_REPORT_CONFIG_SUCCEED:
      return {
        ...state,
        currentReport: action.result.data.report,
        configLoading: false,
        reportObjectMeta: action.result.data.objFields,
      };
    case actionTypes.GET_REPORT_CONFIG_FAIL:
      return { ...state, configLoading: false };
    case actionTypes.GET_REPORT_DATA:
      return {
        ...state,
        reportData: {
          ...state.reportData,
          pageSize: action.data.pageSize,
          current: action.data.current,
          rptDataListLoading: true,
        },
      };
    case actionTypes.GET_REPORT_DATA_SUCCEED:
      return {
        ...state,
        reportData: {
          ...state.reportData,
          attributes: action.result.data.attributes,
          dataList: action.result.data.dataList,
          rptDataListLoading: false,
        },
      };
    case actionTypes.GET_REPORT_DATA_FAIL:
      return {
        ...state,
        reportData: {
          ...state.reportData,
          rptDataListLoading: false,
        },
      };
    case actionTypes.PREVIEW_REPORT:
      return {
        ...state,
        previewListLoading: true,
      };
    case actionTypes.PREVIEW_REPORT_SUCCEED:
      return {
        ...state,
        previewList: action.result.data,
        previewAttrbs: action.data.objAttrs,
        previewListLoading: false,
        previewed: true,
      };
    case actionTypes.PREVIEW_REPORT_FAIL:
      return {
        ...state,
        previewList: [],
        previewAttrbs: [],
        previewListLoading: false,
      };
    case actionTypes.SET_DELETE_SQLATTR_IDS:
      return { ...state, deleteSqlAttrIds: state.deleteSqlAttrIds.concat([action.data.id]) };
    case actionTypes.SAVE_REPORT_CONFIG_SUCCEED:
    case actionTypes.SAVE_REPORT_CONFIG_FAIL:
      return { ...state, deleteSqlAttrIds: [] };
    case actionTypes.SET_REPORT_EDITED:
      return { ...state, edited: action.data.edited, previewed: false };
    case actionTypes.CHANGE_REPORT_CATEGORY_SUCCEED:
      return { ...state, reportListReload: true };
    case actionTypes.RENAME_CATEGORY_SUCCEED:
      return {
        ...state,
        reportList: {
          ...state.reportList,
          data: state.reportList.data.map((obj) => {
            if (obj.children && (Math.abs(obj.id) === action.params.id)) {
              return { ...obj, rpt_category_name: action.params.name };
            }
            return obj;
          }),
        },
      };
    case actionTypes.RENAME_REPORT_SUCCEED:
      return {
        ...state,
        reportList: {
          ...state.reportList,
          data: state.reportList.data.map((obj) => {
            if (obj.children) {
              const rptIndex = obj.children.findIndex(rpt => rpt.id === action.params.rptId);
              if (rptIndex >= 0) {
                return {
                  ...obj,
                  children: obj.children.map((rpt, index) => {
                    if (index === rptIndex) {
                      return { ...rpt, rpt_name: action.params.newRptName };
                    }
                    return rpt;
                  }),
                };
              }
            } else if (obj.id === action.params.rptId) {
              return { ...obj, rpt_name: action.params.newRptName };
            }
            return obj;
          }),
        },
      };
    default:
      return state;
  }
}

export function toggleReportCreateModal(visible) {
  return {
    type: actionTypes.TOGGLE_CREATE_REPORT_MODAL,
    data: { visible },
  };
}

export function toggleReportCatCreateModal(visible, mode, rptInfo = {}) {
  return {
    type: actionTypes.TOGGLE_CREATE_REPORT_CATEGORY_MODAL,
    data: { visible, mode, rptInfo },
  };
}

export function createReport({
  rptObject, rptCategoryId, rptName, rptDesc, rptSubject,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_REPORT,
        actionTypes.CREATE_REPORT_SUCCEED,
        actionTypes.CREATE_REPORT_FAIL,
      ],
      endpoint: 'v1/dis/report/create',
      method: 'post',
      data: {
        rptObject, rptCategoryId, rptName, rptDesc, rptSubject,
      },
    },
  };
}

export function createReportCategory(rptCategoryName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_REPORT_CATEGORY,
        actionTypes.CREATE_REPORT_CATEGORY_SUCCEED,
        actionTypes.CREATE_REPORT_CATEGORY_FAIL,
      ],
      endpoint: 'v1/dis/report/category/create',
      method: 'post',
      data: { rptCategoryName },
    },
  };
}

export function delReport(rptId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_REPORT,
        actionTypes.DEL_REPORT_SUCCEED,
        actionTypes.DEL_REPORT_FAIL,
      ],
      endpoint: 'v1/dis/report/delrpt',
      method: 'post',
      data: { rptId },
    },
  };
}

export function loadReports({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REPORTS,
        actionTypes.LOAD_REPORTS_SUCCEED,
        actionTypes.LOAD_REPORTS_FAIL,
      ],
      endpoint: 'v1/dis/reports/load',
      method: 'get',
      params: {
        pageSize, current, filter: JSON.stringify(filter),
      },
    },
  };
}

export function loadReportCategories() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REPORTS_CATEGORY,
        actionTypes.LOAD_REPORTS_CATEGORY_SUCCEED,
        actionTypes.LOAD_REPORTS_CATEGORY_FAIL,
      ],
      endpoint: 'v1/dis/reports/categorylist',
      method: 'get',
    },
  };
}

export function getReportConfig(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_REPORT_CONFIG,
        actionTypes.GET_REPORT_CONFIG_SUCCEED,
        actionTypes.GET_REPORT_CONFIG_FAIL,
      ],
      endpoint: 'v1/dis/report/config/get',
      method: 'get',
      params: { id },
    },
  };
}

export function deleCategory(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELE_CATEGORY,
        actionTypes.DELE_CATEGORY_SUCCEED,
        actionTypes.DELE_CATEGORY_FAIL,
      ],
      endpoint: 'v1/dis/reports/delcategory',
      method: 'del',
      params: { id },
    },
  };
}

export function renameCategory(id, name) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RENAME_CATEGORY,
        actionTypes.RENAME_CATEGORY_SUCCEED,
        actionTypes.RENAME_CATEGORY_FAIL,
      ],
      endpoint: 'v1/dis/reports/renamecategory',
      method: 'post',
      params: { id, name },
    },
  };
}

export function renameReport(rptId, newRptName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RENAME_REPORT,
        actionTypes.RENAME_REPORT_SUCCEED,
        actionTypes.RENAME_REPORT_FAIL,
      ],
      endpoint: 'v1/dis/reports/renamereport',
      method: 'post',
      params: { rptId, newRptName },
    },
  };
}

export function saveReportConfig(
  reportId,
  bizObjectConfig,
  whereClauseFieldsLists,
  deleteSqlAttrIds,
  contentLog,
) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_REPORT_CONFIG,
        actionTypes.SAVE_REPORT_CONFIG_SUCCEED,
        actionTypes.SAVE_REPORT_CONFIG_FAIL,
      ],
      endpoint: 'v1/dis/report/config/save',
      method: 'post',
      data: {
        reportId,
        bizObjectConfig,
        whereClauseFieldsLists,
        deleteSqlAttrIds,
        contentLog,
      },
    },
  };
}

export function getReportViewData({
  pageSize, current, reportId, reportConfigWhereClause,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_REPORT_DATA,
        actionTypes.GET_REPORT_DATA_SUCCEED,
        actionTypes.GET_REPORT_DATA_FAIL,
      ],
      endpoint: 'v1/dis/report/viewdata',
      method: 'post',
      data: {
        pageSize, current, reportId, reportConfigWhereClause,
      },
    },
  };
}

export function previewReport({
  reportConfig, reportConfigWhereClause, objAttrs,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PREVIEW_REPORT,
        actionTypes.PREVIEW_REPORT_SUCCEED,
        actionTypes.PREVIEW_REPORT_FAIL,
      ],
      endpoint: 'v1/dis/report/preview',
      method: 'post',
      data: {
        reportConfig, reportConfigWhereClause, objAttrs,
      },
    },
  };
}

export function changeReportCategory(rptIds, categoryId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHANGE_REPORT_CATEGORY,
        actionTypes.CHANGE_REPORT_CATEGORY_SUCCEED,
        actionTypes.CHANGE_REPORT_CATEGORY_FAIL,
      ],
      endpoint: 'v1/dis/reports/categorymove',
      method: 'post',
      data: {
        rptIds, categoryId,
      },
    },
  };
}

export function setDeleteSqlAttrIds(id) {
  return {
    type: actionTypes.SET_DELETE_SQLATTR_IDS,
    data: { id },
  };
}

export function setRptEdited(edited) {
  return {
    type: actionTypes.SET_REPORT_EDITED,
    data: { edited },
  };
}

export function createRptExportBuf(rptParam) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXPORT_RPTBUF,
        actionTypes.EXPORT_RPTBUF_SUCCEED,
        actionTypes.EXPORT_RPTBUF_FAIL,
      ],
      endpoint: 'v1/dis/report/exportrptbuf',
      method: 'post',
      data: rptParam,
    },
  };
}
