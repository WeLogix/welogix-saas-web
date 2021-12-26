import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/dis/analyticsList/', [
  'TOGGLE_CREATE_ANALYTIC_MODAL',
  'CREATE_ANALYTIC', 'CREATE_ANALYTIC_SUCCEED', 'CREATE_ANALYTIC_FAIL',
  'RENAME_ANALYTIC', 'RENAME_ANALYTIC_SUCCEED', 'RENAME_ANALYTIC_FAIL',
  'DELETE_ANALYTIC', 'DELETE_ANALYTIC_SUCCEED', 'DELETE_ANALYTIC_FAIL',
  'LOAD_ANALYTICS', 'LOAD_ANALYTICS_SUCCEED', 'LOAD_ANALYTICS_FAIL',
  'LOAD_DMFIELDS', 'LOAD_DMFIELDS_SUCCEED', 'LOAD_DMFIELDS_FAIL',
  'GET_CHART', 'GET_CHART_SUCCEED', 'GET_CHART_FAIL',
  'TOGGLE_REF_REPORT_MODAL', 'REMOVE_REF_REPORT',
  'GET_SEARCHED_REPORTS', 'GET_SEARCHED_REPORTS_SUCCEED', 'GET_SEARCHED_REPORTS_FAIL',
  'GET_REPORT_WHERE_CLAUSES', 'GET_REPORT_WHERE_CLAUSES_SUCCEED', 'GET_REPORT_WHERE_CLAUSES_FAIL',
  'SAVE_ANALYTICS_CONFIG', 'SAVE_ANALYTICS_CONFIG_SUCCEED', 'SAVE_ANALYTICS_CONFIG_FAIL',
  'SET_ANALYTICS_EDITED',
  'GET_CHART_WHERE_CLAUSES', 'GET_CHART_WHERE_CLAUSES_SUCCEED', 'GET_CHART_WHERE_CLAUSES_FAIL',
  'CREATE_COUNT_FIELDS', 'CREATE_COUNT_FIELDS_SUCCEED', 'CREATE_COUNT_FIELDS_FAIL',
  'GET_COUNT_FIELDS', 'GET_COUNT_FIELDS_SUCCEED', 'GET_COUNT_FIELDS_FAIL',
  'UPDATE_COUNT_FIELDS', 'UPDATE_COUNT_FIELDS_SUCCEED', 'UPDATE_COUNT_FIELDS_FAIL',
  'DELETE_COUNT_FIELDS', 'DELETE_COUNT_FIELDS_SUCCEED', 'DELETE_COUNT_FIELDS_FAIL',
  'GET_COUNT_FIELDS_WHERE_CLAUSES', 'GET_COUNT_FIELDS_WHERE_CLAUSES_SUCCEED', 'GET_COUNT_FIELDS_WHERE_CLAUSES_FAIL',
  'TOGGLE_CREATE_METRIC_MODAL',
  'CREATE_Y_FORMULA_METRIC', 'CREATE_Y_FORMULA_METRIC_SUCCEED', 'CREATE_Y_FORMULA_METRIC_FAIL',
  'GET_CHART_DATA', 'GET_CHART_DATA_SUCCEED', 'GET_CHART_DATA_FAIL',
  'LOAD_CHARTFL', 'LOAD_CHARTFL_SUCCEED', 'LOAD_CHARTFL_FAIL',
]);

const initialState = {
  createAnalyticsModal: {
    visible: false,
    chartInfo: {
      chart_uid: '',
      chart_name: '',
    },
  },
  analyticsList: {
    totalCount: 0,
    pageSize: 20,
    chartPageSize: 9,
    current: 1,
    data: [],
  },
  createMetricModal: {
    visible: false,
    cursorPosition: 0,
    axis: {},
  },
  listFilter: {},
  whetherUpdate: false,
  loading: false,
  dwSubjectField: {
    /*
     * DWD_CDS: {
    dimensionFields: [],
    measureFields: [],
    plainFields: [],
  dwObjectMeta: {},
  }
  */
  },
  currentChart: {},
  chartAxisXs: [],
  chartAxisYs: [],
  quoteReportModal: {
    visible: false,
    reportList: [],
  },
  whereClauses: [],
  edited: false,
  addCountFieldsModal: {
    visible: false,
  },
  countFields: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_CREATE_ANALYTIC_MODAL:
      return {
        ...state,
        createAnalyticsModal: action.data,
      };
    case actionTypes.TOGGLE_CREATE_METRIC_MODAL: {
      const { axis, xFieldsCount } = action.data;
      return {
        ...state,
        createMetricModal: {
          ...state.createMetricModal,
          visible: action.data.visible,
          formulaEdited: false,
          xFieldsCount,
          axis: {
            ...action.data.axis,
            name: axis.dana_metric_aggreate === 'uniq' ? '' : axis.name,
            dana_axisy_num_percent: axis.dana_axisy_num_percent || 0,
            dana_axisy_num_precision: axis.dana_axisy_num_precision ?
              Number(axis.dana_axisy_num_precision) : 0,
          },
        },
      };
    }
    case actionTypes.CREATE_ANALYTIC_SUCCEED:
    case actionTypes.DELETE_ANALYTIC_SUCCEED:
      return { ...state, whetherUpdate: true };
    case actionTypes.LOAD_ANALYTICS:
      return {
        ...state,
        loading: true,
        whetherUpdate: false,
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_ANALYTICS_SUCCEED:
      return {
        ...state,
        loading: false,
        analyticsList: { ...state.analyticsList, ...action.result.data },
      };
    case actionTypes.LOAD_ANALYTICS_FAIL:
      return { ...state, loading: false };
    case actionTypes.RENAME_ANALYTIC_SUCCEED: {
      const newData = state.analyticsList.data.map((item) => {
        if (item.dana_chart_uid === action.data.chartUid) {
          return { ...item, dana_chart_name: action.data.chartName };
        }
        return item;
      });
      return { ...state, analyticsList: { ...state.analyticsList, data: newData } };
    }
    case actionTypes.LOAD_DMFIELDS_SUCCEED: {
      const newSubjectDw = { ...state.dwSubjectField };
      const dwObjectFieldMap = {};
      const { dimensionFields, measureFields, plainFields } = action.result.data;
      dimensionFields.concat(measureFields).concat(plainFields).forEach((dwf) => {
        const dwdFs = dwObjectFieldMap[dwf.bm_object] || [];
        dwdFs.push(dwf);
        dwObjectFieldMap[dwf.bm_object] = dwdFs;
      });
      newSubjectDw[action.params.chartSubject] = {
        dimensionFields,
        measureFields,
        plainFields,
        dwObjectMeta: dwObjectFieldMap,
      };
      return { ...state, dwSubjectField: newSubjectDw };
    }
    case actionTypes.GET_CHART_SUCCEED:
      return {
        ...state,
        currentChart: action.result.data.chart,
        chartAxisXs: action.result.data.axisx,
        chartAxisYs: action.result.data.axisy,
        edited: false,
      };
    case actionTypes.TOGGLE_REF_REPORT_MODAL:
      return {
        ...state,
        quoteReportModal: { ...state.quoteReportModal, visible: action.data.visible },
      };
    case actionTypes.GET_SEARCHED_REPORTS_SUCCEED:
      return {
        ...state,
        quoteReportModal: { ...state.quoteReportModal, reportList: action.result.data },
      };
    case actionTypes.GET_REPORT_WHERE_CLAUSES_SUCCEED:
      return {
        ...state,
        currentChart: { ...state.currentChart, dana_chart_report_ref: action.params.reportId },
      };
    case actionTypes.REMOVE_REF_REPORT:
      return {
        ...state,
        currentChart: { ...state.currentChart, dana_chart_report_ref: '' },
      };
    case actionTypes.SET_ANALYTICS_EDITED:
      return { ...state, edited: action.data.edited };
    case actionTypes.GET_CHART_WHERE_CLAUSES_SUCCEED:
      return {
        ...state,
        whereClauses: action.result.data.map(data => data.filter(item => !item.dana_metric_uid)),
      };
    case actionTypes.GET_COUNT_FIELDS_SUCCEED:
      return {
        ...state,
        countFields: action.result.data,
      };
    case actionTypes.SAVE_ANALYTICS_CONFIG_SUCCEED:
      return {
        ...state,
        edited: false,
        currentChart: {
          ...state.currentChart,
          ...action.data.chartView,
        },
      };
    case actionTypes.GET_CHART_DATA_SUCCEED: {
      if (!action.data.chartUid) {
        return {
          ...state,
          chartAxisXs: action.data.axisXs.map(x => ({
            id: x.id,
            field: x.dana_axisx_dimension,
            name: x.dana_axisx_name,
            dana_axisx_time_level: x.dana_axisx_time_level,
          })),
          chartAxisYs: action.data.axisYs.map(y => ({
            id: y.id,
            dana_axisy_secondary: y.dana_axisy_secondary,
            dana_axisy_num_percent: y.dana_axisy_num_percent,
            dana_axisy_num_format: y.dana_axisy_num_format,
            dana_axisy_num_precision: y.dana_axisy_num_precision,
            name: y.dana_axisy_name,
            dana_axisy_metricuid: y.dana_axisy_metricuid,
            field: y.dana_metric_field,
            dana_metric_formula: y.dana_metric_formula,
            dana_metric_aggreate: y.dana_metric_aggreate,
          })),
          currentChart: {
            ...state.currentChart,
            dana_chart_limit: action.data.chart.dana_chart_limit,
            dana_chart_sortorder: action.data.chart.dana_chart_sortorder,
            dana_chart_barchart: JSON.stringify({ view: action.data.chart.dana_chart_barchart }),
            dana_chart_graph: action.data.chart.dana_chart_graph,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
}

export function toggleCreateAnalyticsModal(visible, chartInfo) {
  return {
    type: actionTypes.TOGGLE_CREATE_ANALYTIC_MODAL,
    data: { visible, chartInfo },
  };
}

export function toggleCreateMetricModal(visible, axis = {}, xFieldsCount) {
  return {
    type: actionTypes.TOGGLE_CREATE_METRIC_MODAL,
    data: { visible, axis, xFieldsCount },
  };
}

export function createAnalytics(chartName, chartSubject) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_ANALYTIC,
        actionTypes.CREATE_ANALYTIC_SUCCEED,
        actionTypes.CREATE_ANALYTIC_FAIL,
      ],
      endpoint: 'v1/dis/analytics/createchart',
      method: 'post',
      data: { chartName, chartSubject },
    },
  };
}

export function renameAnalytics(chartName, chartUid, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RENAME_ANALYTIC,
        actionTypes.RENAME_ANALYTIC_SUCCEED,
        actionTypes.RENAME_ANALYTIC_FAIL,
      ],
      endpoint: 'v1/dis/analytics/renamechart',
      method: 'post',
      data: { chartName, chartUid, opContent },
    },
  };
}

export function deleteAnalytics(chartUids) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ANALYTIC,
        actionTypes.DELETE_ANALYTIC_SUCCEED,
        actionTypes.DELETE_ANALYTIC_FAIL,
      ],
      endpoint: 'v1/dis/analytics/delchart',
      method: 'post',
      data: { chartUids },
    },
  };
}

export function loadAnalyticsList(current, pageSize, chartPageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ANALYTICS,
        actionTypes.LOAD_ANALYTICS_SUCCEED,
        actionTypes.LOAD_ANALYTICS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/chartlist',
      method: 'get',
      params: {
        current, pageSize, chartPageSize, filter: JSON.stringify(filter),
      },
    },
  };
}

export function loadDimensionMeasureFields(chartSubject) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DMFIELDS,
        actionTypes.LOAD_DMFIELDS_SUCCEED,
        actionTypes.LOAD_DMFIELDS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/subject/dimensionmetrics',
      method: 'get',
      params: { chartSubject },
    },
  };
}

export function getChart(chartUid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_CHART,
        actionTypes.GET_CHART_SUCCEED,
        actionTypes.GET_CHART_FAIL,
      ],
      endpoint: 'v1/dis/analytics/chart/chartinfo',
      method: 'get',
      params: { chartUid },
    },
  };
}

export function toggleRefReportModal(visible) {
  return {
    type: actionTypes.TOGGLE_REF_REPORT_MODAL,
    data: { visible },
  };
}

export function getSearchedReports(rptSearch, dwSubject) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SEARCHED_REPORTS,
        actionTypes.GET_SEARCHED_REPORTS_SUCCEED,
        actionTypes.GET_SEARCHED_REPORTS_FAIL,
      ],
      endpoint: 'v1/dis/report/rptlist',
      method: 'get',
      params: { rptSearch, dwSubject },
    },
  };
}

export function getCountFields(chartUid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_COUNT_FIELDS,
        actionTypes.GET_COUNT_FIELDS_SUCCEED,
        actionTypes.GET_COUNT_FIELDS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/countfields',
      method: 'get',
      params: { chartUid },
    },
  };
}

export function getReportWhereClauses({ reportId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_REPORT_WHERE_CLAUSES,
        actionTypes.GET_REPORT_WHERE_CLAUSES_SUCCEED,
        actionTypes.GET_REPORT_WHERE_CLAUSES_FAIL,
      ],
      endpoint: 'v1/dis/report/rptwhereconfig',
      method: 'get',
      params: { reportId, useDwField: true },
    },
  };
}

export function saveAnalyticsConfig({
  chartUid, dataRange, axisx, axisy, reportRef, chartView,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_ANALYTICS_CONFIG,
        actionTypes.SAVE_ANALYTICS_CONFIG_SUCCEED,
        actionTypes.SAVE_ANALYTICS_CONFIG_FAIL,
      ],
      endpoint: 'v1/dis/analytics/config/save',
      method: 'post',
      data: {
        chartUid, dataRange, axisx, axisy, reportRef, chartView,
      },
    },
  };
}

export function createCountFields(chartUid, filterBoxList, merticInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_COUNT_FIELDS,
        actionTypes.CREATE_COUNT_FIELDS_SUCCEED,
        actionTypes.CREATE_COUNT_FIELDS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/newcountmetric',
      method: 'post',
      data: { chartUid, filterBoxList, merticInfo },
    },
  };
}

export function removeRefReport() {
  return {
    type: actionTypes.REMOVE_REF_REPORT,
  };
}

export function setAnalyticsEdited(edited) {
  return {
    type: actionTypes.SET_ANALYTICS_EDITED,
    data: { edited },
  };
}

export function loadChartWhereClause({ reportId, chartUid, metricUid }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_CHART_WHERE_CLAUSES,
        actionTypes.GET_CHART_WHERE_CLAUSES_SUCCEED,
        actionTypes.GET_CHART_WHERE_CLAUSES_FAIL,
      ],
      endpoint: 'v1/dis/report/rptwhereconfig',
      method: 'get',
      params: {
        reportId, chartUid, metricUid, useDwField: true,
      },
    },
  };
}
export function updateCountFields(metricUid, filterBoxList, merticInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_COUNT_FIELDS,
        actionTypes.UPDATE_COUNT_FIELDS_SUCCEED,
        actionTypes.UPDATE_COUNT_FIELDS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/updatecountmetric',
      method: 'post',
      data: { metricUid, filterBoxList, merticInfo },
    },
  };
}

export function deleteCountFields(metricUid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_COUNT_FIELDS,
        actionTypes.DELETE_COUNT_FIELDS_SUCCEED,
        actionTypes.DELETE_COUNT_FIELDS_FAIL,
      ],
      endpoint: 'v1/dis/analytics/delcountmetric',
      method: 'post',
      data: { metricUid },
    },
  };
}

export function getCountFieldsWhereClauses(metricUid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_COUNT_FIELDS_WHERE_CLAUSES,
        actionTypes.GET_COUNT_FIELDS_WHERE_CLAUSES_SUCCEED,
        actionTypes.GET_COUNT_FIELDS_WHERE_CLAUSES_FAIL,
      ],
      endpoint: 'v1/dis/analytics/count/fields/whereclauses',
      method: 'get',
      params: { metricUid },
    },
  };
}

export function loadDwDataList({
  chartUid, chart, axisXs, axisYs, whereConfs,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_CHART_DATA,
        actionTypes.GET_CHART_DATA_SUCCEED,
        actionTypes.GET_CHART_DATA_FAIL,
      ],
      endpoint: 'v1/dis/analytics/chartData',
      method: 'post',
      data: {
        chartUid, chart, axisXs, axisYs, whereConfs,
      },
    },
  };
}

export function loadChartFromList(chartUid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CHARTFL,
        actionTypes.LOAD_CHARTFL_SUCCEED,
        actionTypes.LOAD_CHARTFL_FAIL,
      ],
      endpoint: 'v1/dis/analytics/chart/chartinfo',
      method: 'get',
      params: { chartUid },
    },
  };
}
