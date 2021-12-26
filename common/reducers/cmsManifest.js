import { CMS_DECL_STATUS } from 'common/constants';
import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/cms/manifest/', [
  'LOAD_MANIFESTH', 'LOAD_MANIFESTH_SUCCEED', 'LOAD_MANIFESTH_FAIL',
  'LOAD_MANIFTEMP', 'LOAD_MANIFTEMP_SUCCEED', 'LOAD_MANIFTEMP_FAIL',
  'LOAD_MANIFEST_BODYLIST', 'LOAD_MANIFEST_BODYLIST_SUCCEED', 'LOAD_MANIFEST_BODYLIST_FAIL',
  'LOAD_BILLBODY_TOTALVALUE', 'LOAD_BILLBODY_TOTALVALUE_SUCCEED', 'LOAD_BILLBODY_TOTALVALUE_FAIL',
  'LOAD_CUSTOMS_DECL', 'LOAD_CUSTOMS_DECL_SUCCEED', 'LOAD_CUSTOMS_DECL_FAIL',
  'LOAD_MENTITY', 'LOAD_MENTITY_SUCCEED', 'LOAD_MENTITY_FAIL',
  'ADD_BILLBODY', 'ADD_BILLBODY_SUCCEED', 'ADD_BILLBODY_FAIL',
  'DEL_BILLBODY', 'DEL_BILLBODY_SUCCEED', 'DEL_BILLBODY_FAIL',
  'EDIT_BILLBODY', 'EDIT_BILLBODY_SUCCEED', 'EDIT_BILLBODY_FAIL',
  'SAVE_MANIFHL',
  'SAVE_MANIFEST_HEAD', 'SAVE_MANIFEST_HEAD_SUCCEED', 'SAVE_MANIFEST_HEAD_FAIL',
  'OPEN_MS_MODAL', 'CLOSE_MS_MODAL',
  'SUBMIT_MERGESPLIT', 'SUBMIT_MERGESPLIT_SUCCEED', 'SUBMIT_MERGESPLIT_FAIL',
  'RESET_BILL', 'RESET_BILL_SUCCEED', 'RESET_BILL_FAIL',
  'OPEN_AMOUNT_MODAL', 'CLOSE_AMOUNT_MODAL', 'SHOW_NETWTDIV_MODAL',
  'LOAD_CERT_MARKS', 'LOAD_CERT_MARKS_SUCCEED', 'LOAD_CERT_MARKS_FAIL',
  'SAVE_CERT_MARK', 'SAVE_CERT_MARK_SUCCEED', 'SAVE_CERT_MARK_FAIL',
  'UPDATE_CERT_MARK', 'UPDATE_CERT_MARK_SUCCEED', 'UPDATE_CERT_MARK_FAIL',
  'DELETE_CERT_MARK', 'DELETE_CERT_MARK_SUCCEED', 'DELETE_CERT_MARK_FAIL',
  'LOAD_DOCU_MARKS', 'LOAD_DOCU_MARKS_SUCCEED', 'LOAD_DOCU_MARKS_FAIL',
  'SAVE_DOCU_MARK', 'SAVE_DOCU_MARK_SUCCEED', 'SAVE_DOCU_MARK_FAIL',
  'UPDATE_DOCU_MARK', 'UPDATE_DOCU_MARK_SUCCEED', 'UPDATE_DOCU_MARK_FAIL',
  'DELETE_DOCU_MARK', 'DELETE_DOCU_MARK_SUCCEED', 'DELETE_DOCU_MARK_FAIL',
  'LOAD_CONTAINERS', 'LOAD_CONTAINERS_SUCCEED', 'LOAD_CONTAINERS_FAIL',
  'LOAD_COPGOODSNOLIST', 'LOAD_COPGOODSNOLIST_SUCCEED', 'LOAD_COPGOODSNOLIST_FAIL',
  'SAVE_CONTAINER', 'SAVE_CONTAINER_SUCCEED', 'SAVE_CONTAINER_FAIL',
  'UPDATE_CONTAINER', 'UPDATE_CONTAINER_SUCCEED', 'UPDATE_CONTAINER_FAIL',
  'DELETE_CONTAINER', 'DELETE_CONTAINER_SUCCEED', 'DELETE_CONTAINER_FAIL',
  'SAVE_ENTRY_HEAD', 'SAVE_ENTRY_HEAD_SUCCEED', 'SAVE_ENTRY_HEAD_FAIL',
  'REDO_MANIFEST', 'REDO_MANIFEST_SUCCEED', 'REDO_MANIFEST_FAIL',
  'REFRESH_RELBODIES', 'REFRESH_RELBODIES_SUCCEED', 'REFRESH_RELBODIES_FAIL',
  'REFRESH_MANUALBODIES', 'REFRESH_MANUALBODIES_SUCCEED', 'REFRESH_MANUALBODIES_FAIL',
  'DELETE_SELECTED_BODIES', 'DELETE_SELECTED_BODIES_SUCCEED', 'DELETE_SELECTED_BODIES_FAIL',
  'RESET_BILLBODY', 'RESET_BILLBODY_SUCCEED', 'RESET_BILLBODY_FAIL',
  'OPEN_RULE_MODAL', 'CLOSE_RULE_MODAL',
  'SAVE_BILL_RULES', 'SAVE_BILL_RULES_SUCCEED', 'SAVE_BILL_RULES_FAIL',
  'RESET_BILLHEAD', 'RESET_BILLHEAD_SUCCEED', 'RESET_BILLHEAD_FAIL',
  'LOCK_MANIFEST', 'LOCK_MANIFEST_SUCCEED', 'LOCK_MANIFEST_FAIL',
  'SET_STEP_VISIBLE', 'BILL_HEAD_CHANGE',
  'FILL_ENTRYNO', 'FILL_ENTRYNO_SUCCEED', 'FILL_ENTRYNO_FAIL',
  'LOAD_BILL_TEMPLATES', 'LOAD_BILL_TEMPLATES_SUCCEED', 'LOAD_BILL_TEMPLATES_FAIL',
  'CREATE_BILL_TEMPLATE', 'CREATE_BILL_TEMPLATE_SUCCEED', 'CREATE_BILL_TEMPLATE_FAIL',
  'DELETE_TEMPLATE', 'DELETE_TEMPLATE_SUCCEED', 'DELETE_TEMPLATE_FAIL',
  'TOGGLE_BILL_TEMPLATE',
  'LOAD_BILL_TEMPLATE_USERS', 'LOAD_BILL_TEMPLATE_USERS_SUCCEED', 'LOAD_BILL_TEMPLATE_USERS_FAIL',
  'ADD_BILL_TEMPLATE_USER', 'ADD_BILL_TEMPLATE_USER_SUCCEED', 'ADD_BILL_TEMPLATE_USER_FAIL',
  'DELETE_BILL_TEMPLATE_USER', 'DELETE_BILL_TEMPLATE_USER_SUCCEED', 'DELETE_BILL_TEMPLATE_USER_FAIL',
  'SAVE_TEMPLATE_DATA', 'SAVE_TEMPLATE_DATA_SUCCEED', 'SAVE_TEMPLATE_DATA_FAIL',
  'COUNT_FIELDS_CHANGE', 'SAVE_TMPLHL',
  'LOAD_FORM_VALS', 'LOAD_FORM_VALS_SUCCEED', 'LOAD_FORM_VALS_FAIL',
  'SAVE_GENERATED_TEMPLATE', 'SAVE_GENERATED_TEMPLATE_SUCCEED', 'SAVE_GENERATED_TEMPLATE_FAIL',
  'VALIDATE_NAME', 'VALIDATE_NAME_SUCCEED', 'VALIDATE_NAME_FAIL',
  'SHOW_SEND_DECLS_MODAL', 'SHOW_EDIT_BODY_MODAL',
  'VALIDATE_BILL_DATAS', 'VALIDATE_BILL_DATAS_SUCCEED', 'VALIDATE_BILL_DATAS_FAIL',
  'LOAD_BDSTAT', 'LOAD_BDSTAT_SUCCEED', 'LOAD_BDSTAT_FAIL',
  'LOAD_BILL_META', 'LOAD_BILL_META_SUCCEED', 'LOAD_BILL_META_FAIL',
  'CHANGE_TEMP_INFO', 'CHANGE_TEMP_INFO_SUCCEED', 'CHANGE_TEMP_INFO_FAIL',
  'SHOW_DECL_ELEMENTS_MODAL', 'HIDE_DECL_ELEMENTS_MODAL',
  'UPDATE_BILLBODY', 'UPDATE_BILLBODY_SUCCEED', 'UPDATE_BILLBODY_FAIL',
  'SHOW_MANIFEST_RULES_CLONE_MODAL', 'HIDE_MANIFEST_RULES_CLONE_MODAL',
  'CLONE_MANIFEST_RULES', 'CLONE_MANIFEST_RULES_SUCCEED', 'CLONE_MANIFEST_RULES_FAIL',
  'TOTAL_PRICE_DIVID', 'TOTAL_PRICE_DIVID_SUCCEED', 'TOTAL_PRICE_DIVID_FAIL',
  'DIVID_TOTNW', 'DIVID_TOTNW_SUCCEED', 'DIVID_TOTNW_FAIL',
  'GROSSWT_DIVID', 'GROSSWT_DIVID_SUCCEED', 'GROSSWT_DIVID_FAIL',
  'AGG_NETWT', 'AGG_NETWT_SUCCEED', 'AGG_NETWT_FAIL',
  'SEARCH_BILLBODY_RECORD', 'SEARCH_BILLBODY_RECORD_SUCCEED', 'SEARCH_BILLBODY_RECORD_FAIL',
  'TOGGLE_CONTAINERS_MODAL',
  'SEND_ROLLBACK', 'SEND_ROLLBACK_SUCCEED', 'SEND_ROLLBACK_FAIL',
  'LOAD_DECL_BODY_GOODSLIMITS', 'LOAD_DECL_BODY_GOODSLIMITS_SUCCEED', 'LOAD_DECL_BODY_GOODSLIMITS_FAIL',
  'UPDATE_CUEHEAD', 'UPDATE_CUEHEAD_SUCCEED', 'UPDATE_CUEHEAD_FAIL',
  'SAVE_DEC_BODY', 'SAVE_DEC_BODY_SUCCEED', 'SAVE_DEC_BODY_FAIL',
  'SAVE_REVISE_DECL_BODY', 'TOGGLE_CMS_PERMIT_MODAL', 'TOGGLE_REVIEW_DECLS_MODAL',
  'LOAD_REVIEW_INFO', 'LOAD_REVIEW_INFO_SUCCEED', 'LOAD_REVIEW_INFO_FAIL', 'ON_REVIEW_FORM_CHANGE',
]);

const initialState = {
  manifestLoading: false,
  customsDeclLoading: false,
  template: {},
  billtemplates: [],
  whetherReloadBillList: true, // 设定状态判断是否需要更新表体数据(增加+删除+修改等操作之后)
  billBodyList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  billBodyListMask: false,
  billDeclStat: {
    bodyCount: 0,
    containerCount: 0,
    certCount: 0,
  },
  formRequire: {
    tradeModes: [],
    transModes: [],
    customs: [],
  },
  billbodyListFilter: {
    procuct_no: '',
  },
  billMeta: {
    entries: [],
    manifestPermit: false,
  },
  billHead: {},
  entryHead: { status: -1, id: 0 },
  entryBodies: [],
  manifestEntity: {
    traders: [],
    agents: [],
    overseaEntity: [],
  },
  cdfGenerating: false,
  visibleMSModal: false,
  visibleAmtModal: false,
  visibleRuleModal: false,
  visibleStepModal: false,
  visNetwtDivModal: false,
  certMarks: [],
  certParams: [],
  docuMarks: [],
  containers: [],
  copGoodsNoList: [],
  templates: [],
  billRule: {},
  billHeadFieldsChangeTimes: 0,
  addTemplateModal: {
    visible: false,
    templateName: '',
  },
  visibleAddModal: false,
  templateUsers: [],
  formData: {},
  changeTimes: 0,
  templateValLoading: false,
  sendDeclsModal: {
    visible: false,
    delgNo: '',
    agentCode: '',
    agentCustCo: '',
  },
  editBodyVisible: false,
  declBodyModal: {
    delg_no: '',
    declBody: {},
    isCDF: false,
  },
  billDetails: [],
  declElementsModal: {
    visible: false,
    element: '',
    gModel: '',
    id: '',
    disabled: false,
    name: '',
    saveFn: null,
  },
  manifestRulesCloneModal: {
    visible: false,
    templateId: '',
    ietype: '',
  },
  billBodyTotalValue: {
    totGrossWt: 0,
    totWetWt: 0,
    totTrade: 0,
    totPcs: 0,
    tradeCurrGroup: {},
  },
  containersModal: {
    visible: false,
    containerRecord: {},
    gNoList: [],
  },
  whetherReloadDeclContainer: false, // 是否加载集装箱信息
  declBodyGoodsLimits: [],
  originDeclBodyList: [],
  revisedDeclBodyList: [],
  cmsPermitModal: {
    permitRecord: {},
    visible: false,
    uploadedFn: () => {},
  },
  reviewDeclsModal: {
    visible: false,
    reviewInfo: {
      delg_no: '',
    },
  },
  reviewInfo: {
    delgNo: '',
    manifestInfo: {},
    declInfo: [],
  },
  whetherSubmitReviewForm: false,
  fillNoSubmiting: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_MANIFESTH:
      return { ...state, manifestLoading: true, billMeta: initialState.billMeta };
    case actionTypes.LOAD_MANIFESTH_FAILED:
      return { ...state, manifestLoading: false };
    case actionTypes.LOAD_MANIFESTH_SUCCEED: {
      return {
        ...state,
        billHead: action.result.data.head,
        billMeta: action.result.data.meta,
        billRule: action.result.data.billRule || initialState.billRule,
        manifestLoading: false,
      };
    }
    case actionTypes.LOAD_MANIFTEMP_SUCCEED:
      return { ...state, templates: action.result.data };
    case actionTypes.LOAD_MENTITY_SUCCEED:
      return { ...state, manifestEntity: action.result.data };
    case actionTypes.RESET_BILL_SUCCEED:
      return {
        ...state,
        billHead: action.result.data.head,
        billMeta: { ...state.billMeta, entries: [] },
      };
    case actionTypes.RESET_BILLHEAD_SUCCEED:
      return { ...state, billHead: action.result.data.head };
    case actionTypes.LOAD_MANIFEST_BODYLIST:
      return {
        ...state,
        whetherReloadBillList: false,
        billBodyListMask: true,
        billbodyListFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_MANIFEST_BODYLIST_SUCCEED:
      return {
        ...state,
        billBodyList: action.result.data,
        billBodyListMask: false,
      };
    case actionTypes.LOAD_BILLBODY_TOTALVALUE_SUCCEED:
      return { ...state, billBodyTotalValue: action.result.data };
    case actionTypes.SAVE_DEC_BODY_SUCCEED: {
      const bodylist = state.entryBodies.map((item) => {
        if (item.id === action.data.bodyId) {
          return {
            ...item,
            danger_name: action.data.body.danger_name,
            danger_flag: action.data.body.danger_flag,
            danger_pack_spec: action.data.body.danger_pack_spec,
            danger_pack_type: action.data.body.danger_pack_type,
            danger_uncode: action.data.body.danger_uncode,
            stuff: action.data.body.stuff,
            expiry_date: action.data.body.expiry_date,
            warranty_days: action.data.body.warranty_days,
            oversea_manufcr_name: action.data.body.oversea_manufcr_name,
            brand: action.data.body.brand,
            produce_date_str: action.data.body.produce_date_str,
            g_ciq_model: action.result.data.g_ciq_model,
            manufcr_regno: action.data.body.manufcr_regno,
            manufcr_regname: action.data.body.manufcr_regname,
            product_models: action.data.body.product_models,
            external_lot_no: action.data.body.external_lot_no,
            goods_attr: action.data.body.goods_attr,
            g_model: action.data.body.g_model,
          };
        }
        return item;
      });
      return {
        ...state,
        entryBodies: bodylist,
      };
    }
    case actionTypes.ADD_BILLBODY_SUCCEED:
    case actionTypes.EDIT_BILLBODY_SUCCEED:
    case actionTypes.TOTAL_PRICE_DIVID_SUCCEED:
    case actionTypes.GROSSWT_DIVID_SUCCEED:
    case actionTypes.DIVID_TOTNW_SUCCEED:
      return { ...state, whetherReloadBillList: true };
    case actionTypes.AGG_NETWT_SUCCEED:
      return { ...state, billHead: { ...state.billHead, net_wt: action.result.data } };
    case actionTypes.LOAD_CUSTOMS_DECL:
      return {
        ...state,
        customsDeclLoading: true,
        billMeta: { ...state.billMeta, ...initialState.billMeta },
      };
    case actionTypes.LOAD_CUSTOMS_DECL_FAILED:
      return { ...state, customsDeclLoading: false };
    case actionTypes.LOAD_CUSTOMS_DECL_SUCCEED:
      return {
        ...state,
        entryHead: action.result.data.head,
        entryBodies: action.result.data.hbodies,
        originDeclBodyList: action.result.data.hbodies,
        revisedDeclBodyList: [],
        billMeta: { ...state.billMeta, ...action.result.data.meta },
        customsDeclLoading: false,
      };
    case actionTypes.SAVE_MANIFEST_HEAD_SUCCEED:
      return {
        ...state,
        billHead: { ...state.billHead, ...action.data.head },
        billHeadFieldsChangeTimes: 0,
      };
    case actionTypes.SAVE_MANIFHL:
      return { ...state, billHead: { ...state.billHead, ...action.data } };

    case actionTypes.SUBMIT_MERGESPLIT:
    case actionTypes.VALIDATE_BILL_DATAS:
      return { ...state, cdfGenerating: true };
    case actionTypes.VALIDATE_BILL_DATAS_SUCCEED:
      return { ...state, cdfGenerating: false, whetherReloadBillList: true };
    case actionTypes.VALIDATE_BILL_DATAS_FAIL:
    case actionTypes.SUBMIT_MERGESPLIT_FAIL:
      return { ...state, cdfGenerating: false };
    case actionTypes.SAVE_ENTRY_HEAD_SUCCEED:
      return {
        ...state,
        billHeadFieldsChangeTimes: 0,
        entryHead: { ...state.entryHead, ...action.data.head },
      };
    case actionTypes.OPEN_MS_MODAL:
      return { ...state, visibleMSModal: true };
    case actionTypes.CLOSE_MS_MODAL:
      return { ...state, visibleMSModal: false };
    case actionTypes.OPEN_AMOUNT_MODAL:
      return { ...state, visibleAmtModal: true };
    case actionTypes.CLOSE_AMOUNT_MODAL:
      return { ...state, visibleAmtModal: false };
    case actionTypes.SHOW_NETWTDIV_MODAL:
      return { ...state, visNetwtDivModal: action.data.visible };
    case actionTypes.OPEN_RULE_MODAL:
      return { ...state, visibleRuleModal: true };
    case actionTypes.CLOSE_RULE_MODAL:
      return { ...state, visibleRuleModal: false };
    case actionTypes.SET_STEP_VISIBLE:
      return { ...state, visibleStepModal: action.data };
    case actionTypes.SUBMIT_MERGESPLIT_SUCCEED:
      return {
        ...state,
        billMeta: { ...state.billMeta, entries: action.result.data },
        cdfGenerating: false,
      };
    case actionTypes.REDO_MANIFEST_SUCCEED:
      return { ...state, billMeta: { ...state.billMeta, entries: [] } };
    case actionTypes.LOAD_CERT_MARKS_SUCCEED:
      return {
        ...state,
        certMarks: action.result.data,
      };
    case actionTypes.LOAD_DOCU_MARKS_SUCCEED:
      return { ...state, docuMarks: action.result.data };
    case actionTypes.LOAD_CONTAINERS_SUCCEED:
      return { ...state, containers: action.result.data, whetherReloadDeclContainer: false };
    case actionTypes.LOAD_COPGOODSNOLIST_SUCCEED:
      return { ...state, copGoodsNoList: action.result.data };
    case actionTypes.SAVE_CONTAINER_SUCCEED:
    case actionTypes.UPDATE_CONTAINER_SUCCEED:
    case actionTypes.DELETE_CONTAINER_SUCCEED:
      return { ...state, whetherReloadDeclContainer: true };
    case actionTypes.SAVE_BILL_RULES_SUCCEED:
      return { ...state, billRule: { ...state.billRule, ...action.payload.rules } };
    case actionTypes.LOCK_MANIFEST_SUCCEED:
      return {
        ...state,
        billHead: {
          ...state.billHead,
          locking_login_id: action.data.loginId,
          locking_name: action.data.loginName,
        },
      };
    case actionTypes.BILL_HEAD_CHANGE:
      return { ...state, billHeadFieldsChangeTimes: state.billHeadFieldsChangeTimes + 1 };
    case actionTypes.FILL_ENTRYNO:
      return { ...state, fillNoSubmiting: true };
    case actionTypes.FILL_ENTRYNO_SUCCEED: {
      const { entryNo, decUnifiedNo } = action.data;
      const newEntryHead = { ...state.entryHead };
      if (entryNo) newEntryHead.entry_id = entryNo;
      if (decUnifiedNo) newEntryHead.dec_unified_no = decUnifiedNo;
      return { ...state, entryHead: newEntryHead, fillNoSubmiting: false };
    }
    case actionTypes.FILL_ENTRYNO_FAIL:
      return { ...state, fillNoSubmiting: false };
    case actionTypes.LOAD_BILL_TEMPLATES_SUCCEED:
      return { ...state, billtemplates: action.result.data };
    case actionTypes.CREATE_BILL_TEMPLATE_SUCCEED: {
      const retData = action.result.data;
      if (retData.i_e_type === 0) {
        retData.ietype = 'import';
      } else if (retData.i_e_type === 1) {
        retData.ietype = 'export';
      }
      return {
        ...state,
        billtemplates: state.billtemplates.concat({
          ...action.data,
          id: retData.id,
          modify_date: retData.modify_date,
          permission: retData.permission,
        }),
      };
    }
    case actionTypes.CLONE_MANIFEST_RULES_SUCCEED: {
      const billtemplate =
      state.billtemplates.find(f => f.id === action.data.templateId);
      return {
        ...state,
        billtemplates: state.billtemplates.concat({
          ...billtemplate,
          template_name: action.data.name,
          id: action.result.data,
          modify_date: new Date(),
        }),
      };
    }
    case actionTypes.DELETE_TEMPLATE_SUCCEED:
      return {
        ...state,
        billtemplates: state.billtemplates.filter(f => f.id !== action.data.id),
      };
    case actionTypes.TOGGLE_BILL_TEMPLATE: {
      return {
        ...state,
        addTemplateModal: { ...state.addTemplateModal, ...action.data },
      };
    }
    case actionTypes.LOAD_BILL_TEMPLATE_USERS_SUCCEED:
      return { ...state, templateUsers: action.result.data };
    case actionTypes.COUNT_FIELDS_CHANGE:
      return { ...state, changeTimes: state.changeTimes + 1 };
    case actionTypes.LOAD_FORM_VALS:
      return { ...state, templateValLoading: true };
    case actionTypes.LOAD_FORM_VALS_SUCCEED: {
      const retData = action.result.data.template;
      if (retData.i_e_type === 0) {
        retData.ietype = 'import';
      } else if (retData.i_e_type === 1) {
        retData.ietype = 'export';
      }
      return {
        ...state,
        template: { ...state.template, ...retData },
        formData: action.result.data.formData || {},
        templateUsers: action.result.data.users,
        templateValLoading: false,
      };
    }
    case actionTypes.LOAD_FORM_VALS_FAIL:
      return { ...state, templateValLoading: false };
    case actionTypes.SAVE_TMPLHL:
      return { ...state, formData: { ...state.formData, ...action.data } };
    case actionTypes.SHOW_SEND_DECLS_MODAL:
      return { ...state, sendDeclsModal: { ...state.sendDeclsModal, ...action.data } };
    case actionTypes.SHOW_EDIT_BODY_MODAL:
      return {
        ...state,
        editBodyVisible: action.data.visible,
        declBodyModal: action.data.declInfo || initialState.declBodyModal,
      };
    case actionTypes.LOAD_BDSTAT_SUCCEED:
      return { ...state, billDeclStat: action.result.data };
    case actionTypes.LOAD_BILL_META_SUCCEED:
      return { ...state, billMeta: { ...state.billMeta, ...action.result.data.meta } };
    case actionTypes.CHANGE_TEMP_INFO_SUCCEED:
      return { ...state, template: { ...state.template, ...action.data.change } };
    case actionTypes.SHOW_DECL_ELEMENTS_MODAL:
      return {
        ...state,
        declElementsModal: {
          ...state.declElementsModal,
          visible: true,
          element: action.element,
          id: action.id,
          gModel: action.gModel,
          disabled: action.disabled,
          name: action.name,
          saveFn: action.saveFn,
        },
      };
    case actionTypes.HIDE_DECL_ELEMENTS_MODAL:
      return { ...state, declElementsModal: initialState.declElementsModal };
    case actionTypes.SHOW_MANIFEST_RULES_CLONE_MODAL:
      return {
        ...state,
        manifestRulesCloneModal: {
          ...state.manifestRulesCloneModal,
          visible: true,
          templateId: action.templateId,
          ietype: action.ietype,
        },
      };
    case actionTypes.HIDE_MANIFEST_RULES_CLONE_MODAL:
      return {
        ...state,
        manifestRulesCloneModal: { ...state.manifestRulesCloneModal, visible: false },
      };
    case actionTypes.TOGGLE_CONTAINERS_MODAL: {
      return {
        ...state,
        containersModal: action.data,
      };
    }
    case actionTypes.SEND_ROLLBACK_SUCCEED:
      return {
        ...state,
        entryHead: {
          ...state.entryHead,
          status: CMS_DECL_STATUS.reviewed.value,
          sent_status: 4,
        },
      };
    case actionTypes.LOAD_DECL_BODY_GOODSLIMITS_SUCCEED: {
      return {
        ...state,
        declBodyGoodsLimits: action.result.data,
      };
    }
    case actionTypes.UPDATE_CUEHEAD_SUCCEED:
      return { ...state, entryHead: { ...state.entryHead, ...action.data.head } };
    case actionTypes.SAVE_REVISE_DECL_BODY: {
      const declBodies = [...state.originDeclBodyList];
      const revisedDeclBodyList = [...state.revisedDeclBodyList];
      const index = declBodies.findIndex(body => body.id === action.data.changeData.id);
      const declBody = declBodies.find(body => body.id === action.data.changeData.id);
      declBodies[index] = Object.assign({}, declBody, action.data.changeData);
      const revisedIndex = revisedDeclBodyList.findIndex(body =>
        body.id === action.data.changeData.id);
      if (revisedIndex !== -1) {
        revisedDeclBodyList[revisedIndex] = action.data.changeData;
      } else {
        revisedDeclBodyList.push(action.data.changeData);
      }
      return {
        ...state, entryBodies: declBodies, revisedDeclBodyList,
      };
    }
    case actionTypes.TOGGLE_CMS_PERMIT_MODAL:
      return { ...state, cmsPermitModal: action.data };
    case actionTypes.TOGGLE_REVIEW_DECLS_MODAL:
      return { ...state, reviewDeclsModal: action.data };
    case actionTypes.LOAD_REVIEW_INFO:
      return { ...state, whetherSubmitReviewForm: false };
    case actionTypes.LOAD_REVIEW_INFO_SUCCEED:
      return { ...state, reviewInfo: action.result.data };
    case actionTypes.ON_REVIEW_FORM_CHANGE:
      return { ...state, whetherSubmitReviewForm: action.data };
    case actionTypes.DELETE_SELECTED_BODIES_SUCCEED: {
      const { totalCount, pageSize, current } = state.billBodyList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, action.data.length);
      return { ...state, billBodyList: { ...state.billBodyList, current: currentPage } };
    }
    case actionTypes.DEL_BILLBODY_SUCCEED: {
      const { totalCount, pageSize, current } = state.billBodyList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, 1);
      return {
        ...state,
        billBodyList: { ...state.billBodyList, current: currentPage },
        whetherReloadBillList: true,
      };
    }
    default:
      return state;
  }
}

export function loadContainers(delgNo, preEntrySeqNo = '') {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CONTAINERS,
        actionTypes.LOAD_CONTAINERS_SUCCEED,
        actionTypes.LOAD_CONTAINERS_FAIL,
      ],
      endpoint: 'v1/cms/decl/containers',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function loadCopGoodsNoList(delgNo, preEntrySeqNo = '') {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_COPGOODSNOLIST,
        actionTypes.LOAD_COPGOODSNOLIST_SUCCEED,
        actionTypes.LOAD_COPGOODSNOLIST_FAIL,
      ],
      endpoint: 'v1/cms/decl/copGoodsNoList',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function saveContainer(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_CONTAINER,
        actionTypes.SAVE_CONTAINER_SUCCEED,
        actionTypes.SAVE_CONTAINER_FAIL,
      ],
      endpoint: 'v1/cms/decl/container/save',
      method: 'post',
      data: datas,
    },
  };
}

export function updateContainer(datas, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CONTAINER,
        actionTypes.UPDATE_CONTAINER_SUCCEED,
        actionTypes.UPDATE_CONTAINER_FAIL,
      ],
      endpoint: 'v1/cms/decl/container/update',
      method: 'post',
      data: { datas, id },
    },
  };
}

export function delContainer(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CONTAINER,
        actionTypes.DELETE_CONTAINER_SUCCEED,
        actionTypes.DELETE_CONTAINER_FAIL,
      ],
      endpoint: 'v1/cms/decl/container/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function loadCertMarks(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CERT_MARKS,
        actionTypes.LOAD_CERT_MARKS_SUCCEED,
        actionTypes.LOAD_CERT_MARKS_FAIL,
      ],
      endpoint: 'v1/cms/decl/certMark',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

export function saveCertMark(datas, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_CERT_MARK,
        actionTypes.SAVE_CERT_MARK_SUCCEED,
        actionTypes.SAVE_CERT_MARK_FAIL,
      ],
      endpoint: 'v1/cms/decl/certMark/save',
      method: 'post',
      data: { datas, opContent },
    },
  };
}

export function updateCertMark(datas, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CERT_MARK,
        actionTypes.UPDATE_CERT_MARK_SUCCEED,
        actionTypes.UPDATE_CERT_MARK_FAIL,
      ],
      endpoint: 'v1/cms/decl/certMark/update',
      method: 'post',
      data: { datas, opContent },
    },
  };
}

export function delCertMark(datas, opContent = '') {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CERT_MARK,
        actionTypes.DELETE_CERT_MARK_SUCCEED,
        actionTypes.DELETE_CERT_MARK_FAIL,
      ],
      endpoint: 'v1/cms/decl/certMark/delete',
      method: 'post',
      data: { datas, opContent },
    },
  };
}

export function loadDocuMarks(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DOCU_MARKS,
        actionTypes.LOAD_DOCU_MARKS_SUCCEED,
        actionTypes.LOAD_DOCU_MARKS_FAIL,
      ],
      endpoint: 'v1/cms/manifest/docuMark',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

export function saveDocuMark(docEntry, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_DOCU_MARK,
        actionTypes.SAVE_DOCU_MARK_SUCCEED,
        actionTypes.SAVE_DOCU_MARK_FAIL,
      ],
      endpoint: 'v1/cms/manifest/docuMark/save',
      method: 'post',
      data: { docEntry, opContent },
    },
  };
}

export function updateDocuMark(docuUpdate, docuId, preEntrySeqNo, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_DOCU_MARK,
        actionTypes.UPDATE_DOCU_MARK_SUCCEED,
        actionTypes.UPDATE_DOCU_MARK_FAIL,
      ],
      endpoint: 'v1/cms/manifest/docuMark/update',
      method: 'post',
      data: {
        docuUpdate, docuId, preEntrySeqNo, opContent,
      },
    },
  };
}

export function delDocumark(docuId, preEntrySeqNo, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_DOCU_MARK,
        actionTypes.DELETE_DOCU_MARK_SUCCEED,
        actionTypes.DELETE_DOCU_MARK_FAIL,
      ],
      endpoint: 'v1/cms/manifest/docuMark/delete',
      method: 'post',
      data: { docuId, preEntrySeqNo, opContent },
    },
  };
}

export function loadManifestHead(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MANIFESTH,
        actionTypes.LOAD_MANIFESTH_SUCCEED,
        actionTypes.LOAD_MANIFESTH_FAIL,
      ],
      endpoint: 'v1/cms/manifest/head',
      method: 'get',
      params: { billSeqNo },
    },
  };
}

export function loadManifestTemplates(ownerPid, ietype) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MANIFTEMP,
        actionTypes.LOAD_MANIFTEMP_SUCCEED,
        actionTypes.LOAD_MANIFTEMP_FAIL,
      ],
      endpoint: 'v1/cms/settings/owner/billtemplates',
      method: 'get',
      params: { owner_partner_id: ownerPid, ietype },
    },
  };
}

export function loadBillBodyList(billSeqNo, current, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MANIFEST_BODYLIST,
        actionTypes.LOAD_MANIFEST_BODYLIST_SUCCEED,
        actionTypes.LOAD_MANIFEST_BODYLIST_FAIL,
      ],
      endpoint: 'v1/cms/manifest/limited/bodylist',
      method: 'get',
      params: {
        delgNo: billSeqNo, current, pageSize, filter,
      },
    },
  };
}

export function loadBillBodyTotalValue(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILLBODY_TOTALVALUE,
        actionTypes.LOAD_BILLBODY_TOTALVALUE_SUCCEED,
        actionTypes.LOAD_BILLBODY_TOTALVALUE_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/totalvalue',
      method: 'get',
      params: { billSeqNo },
    },
  };
}

export function loadBillOrDeclStat(delgNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BDSTAT,
        actionTypes.LOAD_BDSTAT_SUCCEED,
        actionTypes.LOAD_BDSTAT_FAIL,
      ],
      endpoint: 'v1/cms/manifestdecl/stat',
      method: 'get',
      params: { delgNo, preEntrySeqNo },
    },
  };
}

export function loadBillMeta(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_META,
        actionTypes.LOAD_BILL_META_SUCCEED,
        actionTypes.LOAD_BILL_META_FAIL,
      ],
      endpoint: 'v1/cms/manifests/billMeta/load',
      method: 'get',
      params: { billSeqNo },
    },
  };
}

export function loadEntry(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CUSTOMS_DECL,
        actionTypes.LOAD_CUSTOMS_DECL_SUCCEED,
        actionTypes.LOAD_CUSTOMS_DECL_FAIL,
      ],
      endpoint: 'v1/cms/customs/entry',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

export function loadManifestEntity(ownerPid) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MENTITY,
        actionTypes.LOAD_MENTITY_SUCCEED,
        actionTypes.LOAD_MENTITY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/decl/entity',
      method: 'get',
      params: { ownerPid },
    },
  };
}

export function addNewBillBody({
  body, billSeqNo, repoItemId, goodsLimits, opContent, glOpContent,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_BILLBODY,
        actionTypes.ADD_BILLBODY_SUCCEED,
        actionTypes.ADD_BILLBODY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/add',
      method: 'post',
      data: {
        newBody: body, billSeqNo, repoItemId, goodsLimits, opContent, glOpContent,
      },
    },
  };
}

export function delBillBody(bodyId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_BILLBODY,
        actionTypes.DEL_BILLBODY_SUCCEED,
        actionTypes.DEL_BILLBODY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/del',
      method: 'post',
      data: { bodyId },
    },
  };
}

export function editBillBody({
  body, bodyId, repoItemId, goodsLimits, opContent, glOpContent,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_BILLBODY,
        actionTypes.EDIT_BILLBODY_SUCCEED,
        actionTypes.EDIT_BILLBODY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/edit',
      method: 'post',
      data: {
        body, bodyId, repoItemId, goodsLimits, opContent, glOpContent,
      },
    },
  };
}

export function updateBillBody(id, model) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BILLBODY,
        actionTypes.UPDATE_BILLBODY_SUCCEED,
        actionTypes.UPDATE_BILLBODY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/update',
      method: 'post',
      data: { id, model },
    },
  };
}

export function saveBillHeadLocal(headFields) {
  return {
    type: actionTypes.SAVE_MANIFHL,
    data: headFields,
  };
}

export function saveBillHead({
  head, headId, opContent,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_MANIFEST_HEAD,
        actionTypes.SAVE_MANIFEST_HEAD_SUCCEED,
        actionTypes.SAVE_MANIFEST_HEAD_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billhead',
      method: 'post',
      data: { head, headId, opContent },
    },
  };
}

export function openMergeSplitModal() {
  return {
    type: actionTypes.OPEN_MS_MODAL,
  };
}

export function closeMergeSplitModal() {
  return {
    type: actionTypes.CLOSE_MS_MODAL,
  };
}

export function openAmountModal() {
  return {
    type: actionTypes.OPEN_AMOUNT_MODAL,
  };
}

export function closeAmountModal() {
  return {
    type: actionTypes.CLOSE_AMOUNT_MODAL,
  };
}

export function showNetwtDividModal(visible) {
  return {
    type: actionTypes.SHOW_NETWTDIV_MODAL,
    data: { visible },
  };
}

export function openRuleModal() {
  return {
    type: actionTypes.OPEN_RULE_MODAL,
  };
}

export function closeRuleModal() {
  return {
    type: actionTypes.CLOSE_RULE_MODAL,
  };
}

export function submitBillMegeSplit({
  billSeqNo, mergeOpt, splitOpt, sortOpt, ciqOpt, invGen,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_MERGESPLIT,
        actionTypes.SUBMIT_MERGESPLIT_SUCCEED,
        actionTypes.SUBMIT_MERGESPLIT_FAIL,
      ],
      endpoint: 'v1/cms/declare/bill/mergesplit',
      method: 'post',
      data: {
        billSeqNo, mergeOpt, splitOpt, sortOpt, ciqOpt, invGen,
      },
    },
  };
}

export function resetBill(headId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RESET_BILL,
        actionTypes.RESET_BILL_SUCCEED,
        actionTypes.RESET_BILL_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/reset',
      method: 'post',
      data: headId,
    },
  };
}

export function resetBillHead(headId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RESET_BILLHEAD,
        actionTypes.RESET_BILLHEAD_SUCCEED,
        actionTypes.RESET_BILLHEAD_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/reset/head',
      method: 'post',
      data: { headId },
    },
  };
}

export function saveEntryHead(head, headId, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_ENTRY_HEAD,
        actionTypes.SAVE_ENTRY_HEAD_SUCCEED,
        actionTypes.SAVE_ENTRY_HEAD_FAIL,
      ],
      endpoint: 'v1/cms/manifest/entry/head/save',
      method: 'post',
      data: { head, headId, opContent },
    },
  };
}

export function redoManifest(delgNo, billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REDO_MANIFEST,
        actionTypes.REDO_MANIFEST_SUCCEED,
        actionTypes.REDO_MANIFEST_FAIL,
      ],
      endpoint: 'v1/cms/manifest/redo',
      method: 'post',
      data: { delgNo, billSeqNo },
    },
  };
}

export function refreshRelatedBodies(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REFRESH_RELBODIES,
        actionTypes.REFRESH_RELBODIES_SUCCEED,
        actionTypes.REFRESH_RELBODIES_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/related/refresh',
      method: 'post',
      data: { bill_seq_no: billSeqNo },
    },
  };
}

export function refreshManualBodies(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REFRESH_MANUALBODIES,
        actionTypes.REFRESH_MANUALBODIES_SUCCEED,
        actionTypes.REFRESH_MANUALBODIES_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/manualrefresh',
      method: 'post',
      data: { bill_seq_no: billSeqNo },
    },
  };
}

export function deleteSelectedBodies(bodyIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_SELECTED_BODIES,
        actionTypes.DELETE_SELECTED_BODIES_SUCCEED,
        actionTypes.DELETE_SELECTED_BODIES_FAIL,
      ],
      endpoint: 'v1/cms/manifest/delete/bodies',
      method: 'post',
      data: bodyIds,
    },
  };
}

export function resetBillBody(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RESET_BILLBODY,
        actionTypes.RESET_BILLBODY_SUCCEED,
        actionTypes.RESET_BILLBODY_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/reset/body',
      method: 'post',
      data: { bill_seq_no: billSeqNo },
    },
  };
}

export function saveBillRules(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_BILL_RULES,
        actionTypes.SAVE_BILL_RULES_SUCCEED,
        actionTypes.SAVE_BILL_RULES_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/rules/save',
      method: 'post',
      data: datas,
      payload: { rules: datas.rules },
    },
  };
}

export function setStepVisible(val) {
  return {
    type: actionTypes.SET_STEP_VISIBLE,
    data: val,
  };
}

export function billHeadChange(values) {
  return {
    type: actionTypes.BILL_HEAD_CHANGE,
    data: values,
  };
}

export function lockManifest(locker) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOCK_MANIFEST,
        actionTypes.LOCK_MANIFEST_SUCCEED,
        actionTypes.LOCK_MANIFEST_FAIL,
      ],
      endpoint: 'v1/cms/manifest/lock',
      method: 'post',
      data: locker,
    },
  };
}

export function fillEntryId({
  entryNo, entryHeadId, decUnifiedNo,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILL_ENTRYNO,
        actionTypes.FILL_ENTRYNO_SUCCEED,
        actionTypes.FILL_ENTRYNO_FAIL,
      ],
      endpoint: 'v1/cms/fill/declno',
      method: 'post',
      data: {
        entryNo, entryHeadId, decUnifiedNo,
      },
    },
  };
}

export function loadBillTemplates(customerPartnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_TEMPLATES,
        actionTypes.LOAD_BILL_TEMPLATES_SUCCEED,
        actionTypes.LOAD_BILL_TEMPLATES_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplates/load',
      method: 'get',
      params: { customerPartnerId },
    },
  };
}

export function createBillTemplate(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_BILL_TEMPLATE,
        actionTypes.CREATE_BILL_TEMPLATE_SUCCEED,
        actionTypes.CREATE_BILL_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplate/create',
      method: 'post',
      data: datas,
    },
  };
}

export function deleteTemplate(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_TEMPLATE,
        actionTypes.DELETE_TEMPLATE_SUCCEED,
        actionTypes.DELETE_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplate/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function toggleBillTempModal(visible, operation, templateName) {
  return {
    type: actionTypes.TOGGLE_BILL_TEMPLATE,
    data: { visible, operation, templateName },
  };
}

export function loadBillTemplateUsers(templateId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BILL_TEMPLATE_USERS,
        actionTypes.LOAD_BILL_TEMPLATE_USERS_SUCCEED,
        actionTypes.LOAD_BILL_TEMPLATE_USERS_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplate/users',
      method: 'get',
      params: { templateId },
    },
  };
}

export function addBillTemplateUser(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_BILL_TEMPLATE_USER,
        actionTypes.ADD_BILL_TEMPLATE_USER_SUCCEED,
        actionTypes.ADD_BILL_TEMPLATE_USER_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplate/user/add',
      method: 'post',
      data: datas,
    },
  };
}

export function deleteBillTemplateUser(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BILL_TEMPLATE_USER,
        actionTypes.DELETE_BILL_TEMPLATE_USER_SUCCEED,
        actionTypes.DELETE_BILL_TEMPLATE_USER_FAIL,
      ],
      endpoint: 'v1/cms/settings/billtemplate/user/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function saveTemplateHeadLocal(headFields) {
  return {
    type: actionTypes.SAVE_TMPLHL,
    data: headFields,
  };
}

export function saveTemplateData(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_TEMPLATE_DATA,
        actionTypes.SAVE_TEMPLATE_DATA_SUCCEED,
        actionTypes.SAVE_TEMPLATE_DATA_FAIL,
      ],
      endpoint: 'v1/cms/settings/template/formdata/save',
      method: 'post',
      data: datas,
    },
  };
}

export function countFieldsChange(values) {
  return {
    type: actionTypes.COUNT_FIELDS_CHANGE,
    data: values,
  };
}

export function loadTemplateFormVals(templateId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FORM_VALS,
        actionTypes.LOAD_FORM_VALS_SUCCEED,
        actionTypes.LOAD_FORM_VALS_FAIL,
      ],
      endpoint: 'v1/cms/settings/template/form/values/load',
      method: 'get',
      params: { templateId },
    },
  };
}

export function createGeneratedTemplate(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_GENERATED_TEMPLATE,
        actionTypes.SAVE_GENERATED_TEMPLATE_SUCCEED,
        actionTypes.SAVE_GENERATED_TEMPLATE_FAIL,
      ],
      endpoint: 'v1/cms/settings/template/generated/create',
      method: 'post',
      data: datas,
    },
  };
}

export function validateTempName(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VALIDATE_NAME,
        actionTypes.VALIDATE_NAME_SUCCEED,
        actionTypes.VALIDATE_NAME_FAIL,
      ],
      endpoint: 'v1/cms/settings/template/validate/name',
      method: 'get',
      params,
    },
  };
}

export function showSendDeclsModal({
  visible = true, delgNo = '', agentCode, agentCustCo,
}) {
  return {
    type: actionTypes.SHOW_SEND_DECLS_MODAL,
    data: {
      visible, delgNo, agentCode, agentCustCo,
    },
  };
}

export function showEditBodyModal(visible, declInfo) {
  return {
    type: actionTypes.SHOW_EDIT_BODY_MODAL,
    data: { visible, declInfo },
  };
}

export function validateBillDatas(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VALIDATE_BILL_DATAS,
        actionTypes.VALIDATE_BILL_DATAS_SUCCEED,
        actionTypes.VALIDATE_BILL_DATAS_FAIL,
      ],
      endpoint: 'v1/cms/manifest/bill/datas/validate',
      method: 'post',
      data: datas,
    },
  };
}

export function changeTempInfo(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHANGE_TEMP_INFO,
        actionTypes.CHANGE_TEMP_INFO_SUCCEED,
        actionTypes.CHANGE_TEMP_INFO_FAIL,
      ],
      endpoint: 'v1/cms/manifest/template/info/change',
      method: 'post',
      data,
    },
  };
}

export function showDeclElementsModal(element, id, gModel, disabled, name, saveFn) {
  return {
    type: actionTypes.SHOW_DECL_ELEMENTS_MODAL,
    element,
    id,
    gModel,
    disabled,
    name,
    saveFn,
  };
}

export function hideDeclElementsModal() {
  return {
    type: actionTypes.HIDE_DECL_ELEMENTS_MODAL,
  };
}

export function showManifestRulesCloneModal(templateId, ietype) {
  return {
    type: actionTypes.SHOW_MANIFEST_RULES_CLONE_MODAL,
    templateId,
    ietype,
  };
}

export function hideManifestRulesCloneModal() {
  return {
    type: actionTypes.HIDE_MANIFEST_RULES_CLONE_MODAL,
  };
}

export function cloneManifestRules(name, templateId, userName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CLONE_MANIFEST_RULES,
        actionTypes.CLONE_MANIFEST_RULES_SUCCEED,
        actionTypes.CLONE_MANIFEST_RULES_FAIL,
      ],
      endpoint: 'v1/cms/setting/manifest/rules/clone',
      method: 'post',
      data: { name, templateId, userName },
    },
  };
}

export function dividTotalAmount(billSeqNo, amount, currency) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TOTAL_PRICE_DIVID,
        actionTypes.TOTAL_PRICE_DIVID_SUCCEED,
        actionTypes.TOTAL_PRICE_DIVID_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/divid/totalamount',
      method: 'post',
      data: { billSeqNo, amount, currency },
    },
  };
}

export function dividTotalNetwt(delgNo, totalNetWt) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DIVID_TOTNW,
        actionTypes.DIVID_TOTNW_SUCCEED,
        actionTypes.DIVID_TOTNW_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/dividnetwt',
      method: 'post',
      data: { delgNo, totalNetWt },
    },
  };
}

export function dividHeadGrosswt(billSeqNo, totGrossWt) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GROSSWT_DIVID,
        actionTypes.GROSSWT_DIVID_SUCCEED,
        actionTypes.GROSSWT_DIVID_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/divid/headgrosswt',
      method: 'post',
      data: { billSeqNo, totGrossWt },
    },
  };
}

export function aggreateHeadNetwt(billSeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.AGG_NETWT,
        actionTypes.AGG_NETWT_SUCCEED,
        actionTypes.AGG_NETWT_FAIL,
      ],
      endpoint: 'v1/cms/manifest/billbody/aggreate/headnetwt',
      method: 'post',
      data: { billSeqNo },
    },
  };
}

export function toggleContainersModal(visible, containerRecord = {}, gNoList = []) {
  return {
    type: actionTypes.TOGGLE_CONTAINERS_MODAL,
    data: { visible, containerRecord, gNoList },
  };
}

export function rollbackSendDecl(preEntrySeqNo, custOrderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SEND_ROLLBACK,
        actionTypes.SEND_ROLLBACK_SUCCEED,
        actionTypes.SEND_ROLLBACK_FAIL,
      ],
      endpoint: 'v1/cms/customs/decl/send/rollback',
      method: 'post',
      data: { preEntrySeqNo, custOrderNo },
    },
  };
}

export function loadDeclBodyGoodsLimits({ delgNo, gNo, declBodyId }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DECL_BODY_GOODSLIMITS,
        actionTypes.LOAD_DECL_BODY_GOODSLIMITS_SUCCEED,
        actionTypes.LOAD_DECL_BODY_GOODSLIMITS_FAIL,
      ],
      endpoint: 'v1/cms/manifest/declbody/goodslimits',
      method: 'get',
      params: { delgNo, gNo, declBodyId },
    },
  };
}

export function updateDeclHead(headFields, entryHeadId, opContent) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CUEHEAD,
        actionTypes.UPDATE_CUEHEAD_SUCCEED,
        actionTypes.UPDATE_CUEHEAD_FAIL,
      ],
      endpoint: 'v1/cms/manifest/entry/head/save',
      method: 'post',
      data: { head: headFields, headId: entryHeadId, opContent },
    },
  };
}
export function saveDecBody({
  body, goodsLimits, bodyId, opContent, glOpContent,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_DEC_BODY,
        actionTypes.SAVE_DEC_BODY_SUCCEED,
        actionTypes.SAVE_DEC_BODY_FAIL,
      ],
      endpoint: 'v1/cms/decl/savebody',
      method: 'post',
      data: {
        body, goodsLimits, bodyId, opContent, glOpContent,
      },
    },
  };
}

export function saveReviseDeclBody(changeData) {
  return {
    type: actionTypes.SAVE_REVISE_DECL_BODY,
    data: { changeData },
  };
}

export function toggleCmsPermitModal(visible, permitRecord = {}, uploadedFn = () => {}) {
  return {
    type: actionTypes.TOGGLE_CMS_PERMIT_MODAL,
    data: { visible, permitRecord, uploadedFn },
  };
}

export function toggleReviewDeclsModal(visible, reviewInfo = {}) {
  return {
    type: actionTypes.TOGGLE_REVIEW_DECLS_MODAL,
    data: { visible, reviewInfo },
  };
}

export function loadReviewInfo(delgNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REVIEW_INFO,
        actionTypes.LOAD_REVIEW_INFO_SUCCEED,
        actionTypes.LOAD_REVIEW_INFO_FAIL,
      ],
      endpoint: 'v1/cms/decl/reviewinfo',
      method: 'get',
      params: { delgNo },
    },
  };
}

// 所有栏位都复核才能提交
export function onReviewFormChange(values) {
  let whetherSubmit = true;
  const arr = Object.values(values);
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    if (item !== true) {
      whetherSubmit = false;
      break;
    }
  }
  return {
    type: actionTypes.ON_REVIEW_FORM_CHANGE,
    data: whetherSubmit,
  };
}
