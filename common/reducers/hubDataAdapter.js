import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/saas/lineadaptor/', [
  'LOAD_ADAPTORS', 'LOAD_ADAPTORS_SUCCEED', 'LOAD_ADAPTORS_FAIL',
  'LOAD_MLADAPTORS', 'LOAD_MLADAPTORS_SUCCEED', 'LOAD_MLADAPTORS_FAIL',
  'LOAD_ADAPTOR', 'LOAD_ADAPTOR_SUCCEED', 'LOAD_ADAPTOR_FAIL',
  'ADD_ADAPTOR', 'ADD_ADAPTOR_SUCCEED', 'ADD_ADAPTOR_FAIL',
  'UPDATE_COLFD', 'UPDATE_COLFD_SUCCEED', 'UPDATE_COLFD_FAIL',
  'UPDATE_COLDEF', 'UPDATE_COLDEF_SUCCEED', 'UPDATE_COLDEF_FAIL',
  'DEL_ADAPTOR', 'DEL_ADAPTOR_SUCCEED', 'DEL_ADAPTOR_FAIL',
  'SHOW_ADAPTOR_MODAL', 'HIDE_ADAPTOR_MODAL',
  'SHOW_ADAPTOR_DETAIL_MODAL', 'HIDE_ADAPTOR_DETAIL_MODAL',
  'UPDATE_ADAPTOR', 'UPDATE_ADAPTOR_SUCCEED', 'UPDATE_ADAPTOR_FAIL',
  'PREVIEW_CONVERTED', 'PREVIEW_CONVERTED_SUCCEED', 'PREVIEW_CONVERTED_FAIL',
  'EXPORT_SAAS_BIZ_FILE', 'EXPORT_SAAS_BIZ_FILE_SUCCEED', 'EXPORT_SAAS_BIZ_FILE_FAIL',
  'TOGGLE_EXPORT_PANEL', 'TOGGLE_BIZ_EXPORT_TEMPLATE_MODAL',
  'CREATE_BIZ_EXPORT_TEMPLATE', 'CREATE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'CREATE_BIZ_EXPORT_TEMPLATE_FAIL',
  'LOAD_BIZ_EXPORT_TEMPLATES', 'LOAD_BIZ_EXPORT_TEMPLATES_SUCCEED', 'LOAD_BIZ_EXPORT_TEMPLATES_FAIL',
  'UPDATE_BIZ_EXPORT_TEMPLATE', 'UPDATE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'UPDATE_BIZ_EXPORT_TEMPLATE_FAIL',
  'DELETE_BIZ_EXPORT_TEMPLATE', 'DELETE_BIZ_EXPORT_TEMPLATE_SUCCEED', 'DELETE_BIZ_EXPORT_TEMPLATE_FAIL',
  'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ', 'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_SUCCEED', 'LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_FAIL',
]);

const initState = {
  loadingAdaptors: false,
  adaptorList: {
    data: [],
    pageSize: 20,
    current: 1,
  },
  modelAdaptors: [],
  loadingAdaptor: false,
  adaptor: { name: '', columns: [] },
  adaptorModal: {
    visible: false,
  },
  adaptorDetailModal: {
    visible: false,
  },
  filter: {},

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
  exportListFilter: {},
  saasExportAdapter: [],
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.LOAD_ADAPTORS:
      return { ...state, loadingAdaptors: true, filter: JSON.parse(action.params.filter) };
    case actionTypes.LOAD_ADAPTORS_SUCCEED:
      return { ...state, loadingAdaptors: false, adaptorList: action.result.data };
    case actionTypes.LOAD_ADAPTORS_FAIL:
      return { ...state, loadingAdaptors: false };
    case actionTypes.LOAD_MLADAPTORS_SUCCEED:
      return { ...state, modelAdaptors: action.result.data };
    case actionTypes.LOAD_ADAPTOR:
      return { ...state, loadingAdaptors: true, adaptor: initState.adaptor };
    case actionTypes.LOAD_ADAPTOR_SUCCEED:
      return { ...state, loadingAdaptors: false, adaptor: action.result.data };
    case actionTypes.LOAD_ADAPTOR_FAIL:
      return { ...state, loadingAdaptors: false };
    case actionTypes.SHOW_ADAPTOR_MODAL:
      return { ...state, adaptorModal: { ...state.adaptorModal, visible: true } };
    case actionTypes.HIDE_ADAPTOR_MODAL:
      return { ...state, adaptorModal: { ...state.adaptorModal, visible: false } };
    case actionTypes.SHOW_ADAPTOR_DETAIL_MODAL:
      return { ...state, adaptorDetailModal: { ...state.adaptorDetailModal, visible: true } };
    case actionTypes.HIDE_ADAPTOR_DETAIL_MODAL:
      return { ...state, adaptorDetailModal: { ...state.adaptorDetailModal, visible: false } };
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
    case actionTypes.LOAD_BIZ_EXPORT_TEMPLATES:
      return { ...state, exportListFilter: JSON.parse(action.params.filter) };
    case actionTypes.LOAD_BIZ_EXPORT_TEMPLATES_SUCCEED:
      return { ...state, adapterList: { ...action.result.data } };
    case actionTypes.LOAD_BIZ_EXPORT_TEMPLATE_BY_BIZOBJ_SUCCEED:
      return { ...state, saasExportAdapter: action.result.data };
    default:
      return state;
  }
}

export function loadAdaptors(ownerPid, models, pageSize, current, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ADAPTORS,
        actionTypes.LOAD_ADAPTORS_SUCCEED,
        actionTypes.LOAD_ADAPTORS_FAIL,
      ],
      endpoint: 'v1/saas/linefile/adaptors',
      method: 'get',
      params: {
        ownerPid, models: JSON.stringify(models), pageSize, current, filter: JSON.stringify(filter),
      },
    },
  };
}

export function loadModelAdaptors(ownerPid, models, flowId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MLADAPTORS,
        actionTypes.LOAD_MLADAPTORS_SUCCEED,
        actionTypes.LOAD_MLADAPTORS_FAIL,
      ],
      endpoint: 'v1/saas/linefile/model/adaptors',
      method: 'get',
      params: {
        ownerPid, models: JSON.stringify(models), flowId,
      },
    },
  };
}

export function loadAdaptor(code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ADAPTOR,
        actionTypes.LOAD_ADAPTOR_SUCCEED,
        actionTypes.LOAD_ADAPTOR_FAIL,
      ],
      endpoint: 'v1/saas/linefile/adaptor',
      method: 'get',
      params: { code },
    },
  };
}

export function updateAdaptor(code, adaptorValues) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ADAPTOR,
        actionTypes.UPDATE_ADAPTOR_SUCCEED,
        actionTypes.UPDATE_ADAPTOR_FAIL,
      ],
      endpoint: 'v1/saas/linefile/adaptor/update',
      method: 'post',
      data: { code, values: adaptorValues },
    },
  };
}

export function addAdaptor(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ADAPTOR,
        actionTypes.ADD_ADAPTOR_SUCCEED,
        actionTypes.ADD_ADAPTOR_FAIL,
      ],
      endpoint: 'v1/saas/linefile/create/adaptor',
      method: 'post',
      data,
    },
  };
}

export function updateColumnField(columnId, field) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_COLFD,
        actionTypes.UPDATE_COLFD_SUCCEED,
        actionTypes.UPDATE_COLFD_FAIL,
      ],
      endpoint: 'v1/saas/linefile/update/col/field',
      method: 'post',
      data: { columnId, field },
    },
  };
}

export function updateColumnDefault(defaultId, defaultFields, adaptorCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_COLDEF,
        actionTypes.UPDATE_COLDEF_SUCCEED,
        actionTypes.UPDATE_COLDEF_FAIL,
      ],
      endpoint: 'v1/saas/linefile/update/col/default',
      method: 'post',
      data: { defaultId, defaultFields, adaptorCode },
    },
  };
}

export function delAdaptor(code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_ADAPTOR,
        actionTypes.DEL_ADAPTOR_SUCCEED,
        actionTypes.DEL_ADAPTOR_FAIL,
      ],
      endpoint: 'v1/saas/linefile/del/adaptor',
      method: 'post',
      data: { code },
    },
  };
}

export function showAdaptorModal() {
  return {
    type: actionTypes.SHOW_ADAPTOR_MODAL,
  };
}

export function hideAdaptorModal() {
  return {
    type: actionTypes.HIDE_ADAPTOR_MODAL,
  };
}

export function showAdaptorDetailModal() {
  return {
    type: actionTypes.SHOW_ADAPTOR_DETAIL_MODAL,
  };
}

export function hideAdaptorDetailModal() {
  return {
    type: actionTypes.HIDE_ADAPTOR_DETAIL_MODAL,
  };
}

export function previewColumnConverter(converter, values, index) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PREVIEW_CONVERTED,
        actionTypes.PREVIEW_CONVERTED_SUCCEED,
        actionTypes.PREVIEW_CONVERTED_FAIL,
      ],
      endpoint: 'v1/saas/linefile/previewconverter',
      method: 'get',
      params: { converter, values, index },
    },
  };
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
