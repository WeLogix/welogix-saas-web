import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/paas/bizexport/', [
  'EXPORT_SAAS_BIZ_FILE', 'EXPORT_SAAS_BIZ_FILE_SUCCEED', 'EXPORT_SAAS_BIZ_FILE_FAIL',
  'TOGGLE_EXPORT_PANEL', 'TOGGLE_BIZ_EXPORT_TEMPLATE_MODAL',
  'CREATE_BIZ_EXPORT_TEMPLATE', 'CREATE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'CREATE_BIZ_EXPORT_TEMPLATE_FAIL',
  'LOAD_BIZ_EXPORT_TEMPLATES', 'LOAD_BIZ_EXPORT_TEMPLATES_SUCCEED', 'LOAD_BIZ_EXPORT_TEMPLATES_FAIL',
  'UPDATE_BIZ_EXPORT_TEMPLATE', 'UPDATE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'UPDATE_BIZ_EXPORT_TEMPLATE_FAIL',
  'DELETE_BIZ_EXPORT_TEMPLATE', 'DELETE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'DELETE_BIZ_EXPORT_TEMPLATE_FAIL',
  'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ', 'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_SUCCEED', 'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_FAIL',
]);

const initialState = {
  visible: false,
  exporting: false,
  templateModal: {
    visible: false,
    bizExportAdapter: {},
  },
  adapterList: {
    data: [],
    pageSize: 10,
    current: 1,
  },
  filter: {},
  saasExportAdapter: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_EXPORT_PANEL:
      return { ...state, visible: action.visible };
    case actionTypes.EXPORT_SAAS_BIZ_FILE:
      return { ...state, exporting: true };
    case actionTypes.EXPORT_SAAS_BIZ_FILE_SUCCEED:
    case actionTypes.EXPORT_SAAS_BIZ_FILE_FAIL:
      return { ...state, exporting: false };
    case actionTypes.TOGGLE_BIZ_EXPORT_TEMPLATE_MODAL:
      return {
        ...state,
        templateModal: { ...state.templateModal, ...action.data },
      };
    case actionTypes.LOAD_BIZ_EXPORT_TEMPLATES_SUCCEED:
      return { ...state, adapterList: { ...action.result.data } };
    case actionTypes.LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_SUCCEED:
      return { ...state, saasExportAdapter: action.result.data };
    default:
      return state;
  }
}

export function exportSaasBizFile({
  type, thead, tbody, formData,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXPORT_SAAS_BIZ_FILE,
        actionTypes.EXPORT_SAAS_BIZ_FILE_SUCCEED,
        actionTypes.EXPORT_SAAS_BIZ_FILE_FAIL,
      ],
      endpoint: 'v1/saas/bizexport',
      method: 'post',
      data: {
        type,
        thead,
        tbody,
        formData,
      },
    },
  };
}

export function toggleExportPanel(visible) {
  return {
    type: actionTypes.TOGGLE_EXPORT_PANEL,
    visible,
  };
}

export function toggleBizExportTemplateModal(visible, bizExportAdapter = {}) {
  return {
    type: actionTypes.TOGGLE_BIZ_EXPORT_TEMPLATE_MODAL,
    data: { visible, bizExportAdapter },
  };
}

export function createBizExportTemplate({
  name, model, headFields, bodyFields,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BIZ_EXPORT_TEMPLATE,
        actionTypes.CREATE_BIZ_EXPORT_TEMPLATE_SUCCEED,
        actionTypes.CREATE_BIZ_EXPORT_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/hub/biz/export/template/create',
      method: 'post',
      data: {
        name, model, headFields, bodyFields,
      },
    },
  };
}

export function updateBizExportTemplate({
  model, headFields, bodyFields, id,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BIZ_EXPORT_TEMPLATE,
        actionTypes.UPDATE_BIZ_EXPORT_TEMPLATE_SUCCEED,
        actionTypes.UPDATE_BIZ_EXPORT_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/hub/biz/export/template/update',
      method: 'post',
      data: {
        model, headFields, bodyFields, id,
      },
    },
  };
}

export function loadBizExportTemplates({ pageSize, current, filter = {} }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATES,
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATES_SUCCEED,
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATES_FAIL,
      ],
      endpoint: 'v1/hub/biz/export/templates/load',
      method: 'get',
      params: { pageSize, current, filter: JSON.stringify(filter) },
    },
  };
}

export function deleteBizExportTemplate(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BIZ_EXPORT_TEMPLATE,
        actionTypes.DELETE_BIZ_EXPORT_TEMPLATE_SUCCEED,
        actionTypes.DELETE_BIZ_EXPORT_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/hub/biz/export/template/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function loadBizExportTemplatesByBizObject(bizObject) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ,
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_SUCCEED,
        actionTypes.LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_FAIL,
      ],
      endpoint: 'v1/hub/load/biz/export/template/by/bizobj',
      method: 'get',
      params: { bizObject },
    },
  };
}
