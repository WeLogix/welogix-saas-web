import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cms/manifest/template', [
  'ADD_ENT_QUALIF', 'ADD_ENT_QUALIF_SUCCEED', 'ADD_ENT_QUALIF_FAIL',
  'LOAD_ENT_QUALIF', 'LOAD_ENT_QUALIF_SUCCEED', 'LOAD_ENT_QUALIF_FAIL',
  'UPDATE_ENT_QUALIF', 'UPDATE_ENT_QUALIF_SUCCEED', 'UPDATE_ENT_QUALIF_FAIL',
  'DELETE_ENT_QUALIF', 'DELETE_ENT_QUALIF_SUCCEED', 'DELETE_ENT_QUALIF_FAIL',
  'ADD_CIQ_USER', 'ADD_CIQ_USER_SUCCEED', 'ADD_CIQ_USER_FAIL',
  'LOAD_CIQ_USERLIST', 'LOAD_CIQ_USERLIST_SUCCEED', 'LOAD_CIQ_USERLIST_FAIL',
  'UPDATE_CIQ_USER', 'UPDATE_CIQ_USER_SUCCEED', 'UPDATE_CIQ_USER_FAIL',
  'DELETE_CIQ_USER', 'DELETE_CIQ_USER_SUCCEED', 'DELETE_CIQ_USER_FAIL',
]);

const initialState = {
  templateEntQualifs: [],
  templateUserList: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_ENT_QUALIF_SUCCEED:
      return { ...state, templateEntQualifs: action.result.data };
    case actionTypes.ADD_ENT_QUALIF_SUCCEED: {
      const templateEntQualifs = state.templateEntQualifs.concat({
        id: action.result.data,
        ent_qualif_type_code: action.data.ent_qualif_type_code,
        ent_qualif_no: action.data.ent_qualif_no,
        template_id: action.data.template_id,
      });
      return { ...state, templateEntQualifs };
    }
    case actionTypes.UPDATE_ENT_QUALIF_SUCCEED: {
      const templateEntQualifs = state.templateEntQualifs.map((item) => {
        if (item.id === action.data.qualifId) {
          return {
            ...item,
            ent_qualif_type_code: action.data.data.ent_qualif_type_code,
            ent_qualif_no: action.data.data.ent_qualif_no,
            template_id: action.data.data.template_id,
          };
        }
        return item;
      });
      return { ...state, templateEntQualifs };
    }
    case actionTypes.DELETE_ENT_QUALIF_SUCCEED: {
      return {
        ...state,
        templateEntQualifs: state.templateEntQualifs.filter(item => item.id !== action.data.id),
      };
    }
    case actionTypes.LOAD_CIQ_USERLIST_SUCCEED:
      return { ...state, templateUserList: action.result.data };
    case actionTypes.ADD_CIQ_USER_SUCCEED: {
      const templateUserList = state.templateUserList.concat({
        id: action.result.data,
        user_org_person: action.data.user_org_person,
        user_org_tel: action.data.user_org_tel,
        template_id: action.data.template_id,
      });
      return { ...state, templateUserList };
    }
    case actionTypes.UPDATE_CIQ_USER_SUCCEED: {
      const templateUserList = state.templateUserList.map((item) => {
        if (item.id === action.data.decUserId) {
          return {
            ...item,
            user_org_person: action.data.data.user_org_person,
            user_org_tel: action.data.data.user_org_tel,
            template_id: action.data.data.template_id,
          };
        }
        return item;
      });
      return { ...state, templateUserList };
    }
    case actionTypes.DELETE_CIQ_USER_SUCCEED: {
      return {
        ...state,
        templateUserList: state.templateUserList.filter(item => item.id !== action.data.id),
      };
    }
    default:
      return state;
  }
}

export function addEntQualif(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ENT_QUALIF,
        actionTypes.ADD_ENT_QUALIF_SUCCEED,
        actionTypes.ADD_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/entqualif/add',
      method: 'post',
      data,
    },
  };
}

export function loadEntQualifList(templateIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ENT_QUALIF,
        actionTypes.LOAD_ENT_QUALIF_SUCCEED,
        actionTypes.LOAD_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/entqualif/list',
      method: 'post',
      data: { templateIds },
    },
  };
}

export function updateEntQualif(data, qualifId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ENT_QUALIF,
        actionTypes.UPDATE_ENT_QUALIF_SUCCEED,
        actionTypes.UPDATE_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/entqualif/update',
      method: 'post',
      data: { data, qualifId },
    },
  };
}

export function deleteEntQualif(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ENT_QUALIF,
        actionTypes.DELETE_ENT_QUALIF_SUCCEED,
        actionTypes.DELETE_ENT_QUALIF_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/entqualif/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function addCiqUser(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_CIQ_USER,
        actionTypes.ADD_CIQ_USER_SUCCEED,
        actionTypes.ADD_CIQ_USER_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/ciquser/add',
      method: 'post',
      data,
    },
  };
}

export function loadCiqUserList(templateIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CIQ_USERLIST,
        actionTypes.LOAD_CIQ_USERLIST_SUCCEED,
        actionTypes.LOAD_CIQ_USERLIST_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/ciquser/list',
      method: 'post',
      data: { templateIds },
    },
  };
}

export function updateCiqUser(data, decUserId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CIQ_USER,
        actionTypes.UPDATE_CIQ_USER_SUCCEED,
        actionTypes.UPDATE_CIQ_USER_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/ciquser/update',
      method: 'post',
      data: { data, decUserId },
    },
  };
}

export function deleteCiqUser(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CIQ_USER,
        actionTypes.DELETE_CIQ_USER_SUCCEED,
        actionTypes.DELETE_CIQ_USER_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/ciquser/delete',
      method: 'post',
      data: { id },
    },
  };
}
