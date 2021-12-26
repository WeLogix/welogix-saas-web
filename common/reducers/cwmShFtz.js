import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/shftz/', [
  'SHOW_TRANSFER_IN_MODAL',
  'OPEN_BATCH_DECL_MODAL', 'CLOSE_BATCH_DECL_MODAL',
  'OPEN_NORMAL_DECL_MODAL', 'CLOSE_NORMAL_DECL_MODAL',
  'OPEN_NORMAL_REL_REG_MODAL', 'CLOSE_NORMAL_REL_REG_MODAL',
  'ENTRY_REG_LOAD', 'ENTRY_REG_LOAD_SUCCEED', 'ENTRY_REG_LOAD_FAIL',
  'ENTRY_DETAILS_LOAD', 'ENTRY_DETAILS_LOAD_SUCCEED', 'ENTRY_DETAILS_LOAD_FAIL',
  'ENTRY_BODY_LOAD', 'ENTRY_BODY_LOAD_SUCCEED', 'ENTRY_BODY_LOAD_FAIL',
  'ENTRY_TOTAL_VALUE_LOAD', 'ENTRY_TOTAL_VALUE_LOAD_SUCCEED', 'ENTRY_TOTAL_VALUE_LOAD_FAIL',
  'INBOUND_TOTAL_VALUE_LOAD', 'INBOUND_TOTAL_VALUE_LOAD_SUCCEED', 'INBOUND_TOTAL_VALUE_LOAD_FAIL',
  'REL_REG_TOTAL_VALUE_LOAD', 'REL_REG_TOTAL_VALUE_LOAD_SUCCEED', 'REL_REG_TOTAL_VALUE_LOAD_FAIL',
  'REL_NORMAL_TOTAL_VALUE_LOAD', 'REL_NORMAL_TOTAL_VALUE_LOAD_SUCCEED', 'REL_NORMAL_TOTAL_VALUE_LOAD_FAIL',
  'SPLIT_CUSED', 'SPLIT_CUSED_SUCCEED', 'SPLIT_CUSED_FAIL',
  'LOAD_VTDETAILS', 'LOAD_VTDETAILS_SUCCEED', 'LOAD_VTDETAILS_FAIL',
  'RELEASE_REG_LOAD', 'RELEASE_REG_LOAD_SUCCEED', 'RELEASE_REG_LOAD_FAIL',
  'LOAD_NSOREG', 'LOAD_NSOREG_SUCCEED', 'LOAD_NSOREG_FAIL',
  'LOAD_NENREG', 'LOAD_NENREG_SUCCEED', 'LOAD_NENREG_FAIL',
  'LOAD_NEDREG', 'LOAD_NEDREG_SUCCEED', 'LOAD_NEDREG_FAIL',
  'LOAD_SORELD', 'LOAD_SORELD_SUCCEED', 'LOAD_SORELD_FAIL',
  'LOAD_NENTD', 'LOAD_NENTD_SUCCEED', 'LOAD_NENTD_FAIL',
  'NEW_NRER', 'NEW_NRER_SUCCEED', 'NEW_NRER_FAIL',
  'NEW_NRSO', 'NEW_NRSO_SUCCEED', 'NEW_NRSO_FAIL',
  'OPEN_NTFO_MODAL', 'CLOSE_NTFO_MODAL',
  'NEW_TRSO', 'NEW_TRSO_SUCCEED', 'NEW_TRSO_FAIL',
  'PRODUCT_CARGO_LOAD', 'PRODUCT_CARGO_LOAD_SUCCEED', 'PRODUCT_CARGO_LOAD_FAIL',
  'UPDATE_CARGO_RULE', 'UPDATE_CARGO_RULE_SUCCEED', 'UPDATE_CARGO_RULE_FAIL',
  'SELECT_CARGO_OWNER',
  'SYNC_SKU', 'SYNC_SKU_SUCCEED', 'SYNC_SKU_FAIL',
  'UPDATE_ERFIELD', 'UPDATE_ERFIELD_SUCCEED', 'UPDATE_ERFIELD_FAIL',
  'REFRSH_RFTZC', 'REFRSH_RFTZC_SUCCEED', 'REFRSH_RFTZC_FAIL',
  'FILE_ERS', 'FILE_ERS_SUCCEED', 'FILE_ERS_FAIL',
  'QUERY_ERI', 'QUERY_ERI_SUCCEED', 'QUERY_ERI_FAIL',
  'PAIR_ERP', 'PAIR_ERP_SUCCEED', 'PAIR_ERP_FAIL',
  'REL_DETAILS_LOAD', 'REL_DETAILS_LOAD_SUCCEED', 'REL_DETAILS_LOAD_FAIL',
  'REL_BODY_LOAD', 'REL_BODY_LOAD_SUCCEED', 'REL_BODY_LOAD_FAIL',
  'UPDATE_RRFIELD', 'UPDATE_RRFIELD_SUCCEED', 'UPDATE_RRFIELD_FAIL',
  'FILE_RSO', 'FILE_RSO_SUCCEED', 'FILE_RSO_FAIL',
  'FILE_RTS', 'FILE_RTS_SUCCEED', 'FILE_RTS_FAIL',
  'FILE_RPO', 'FILE_RPO_SUCCEED', 'FILE_RPO_FAIL',
  'QUERY_POI', 'QUERY_POI_SUCCEED', 'QUERY_POI_FAIL',
  'FILE_CARGO', 'FILE_CARGO_SUCCEED', 'FILE_CARGO_FAIL',
  'CONFIRM_CARGO', 'CONFIRM_CARGO_SUCCEED', 'CONFIRM_CARGO_FAIL',
  'LOAD_BALIST', 'LOAD_BALIST_SUCCEED', 'LOAD_BALIST_FAIL',
  'LOAD_PORS', 'LOAD_PORS_SUCCEED', 'LOAD_PORS_FAIL',
  'LOAD_PTDS', 'LOAD_PTDS_SUCCEED', 'LOAD_PTDS_FAIL',
  'BEGIN_BD', 'BEGIN_BD_SUCCEED', 'BEGIN_BD_FAIL',
  'BEGIN_NC', 'BEGIN_NC_SUCCEED', 'BEGIN_NC_FAIL',
  'LOAD_NDLIST', 'LOAD_NDLIST_SUCCEED', 'LOAD_NDLIST_FAIL',
  'LOAD_NDELG', 'LOAD_NDELG_SUCCEED', 'LOAD_NDELG_FAIL',
  'LOAD_DRDETAILS', 'LOAD_DRDETAILS_SUCCEED', 'LOAD_DRDETAILS_FAIL',
  'LOAD_DRSTAT', 'LOAD_DRSTAT_SUCCEED', 'LOAD_DRSTAT_FAIL',
  'LOAD_APPLD', 'LOAD_APPLD_SUCCEED', 'LOAD_APPLD_FAIL',
  'LOAD_SINGLE_APPLD', 'LOAD_SINGLE_APPLD_SUCCEED', 'LOAD_SINGLE_APPLD_FAIL',
  'FILE_BA', 'FILE_BA_SUCCEED', 'FILE_BA_FAIL',
  'MAKE_BAL', 'MAKE_BAL_SUCCEED', 'MAKE_BAL_FAIL',
  'CHECK_ENRSTU', 'CHECK_ENRSTU_SUCCEED', 'CHECK_ENRSTU_FAIL',
  'CANCEL_RER', 'CANCEL_RER_SUCCEED', 'CANCEL_RER_FAIL',
  'EDIT_GNAME', 'EDIT_GNAME_SUCCEED', 'EDIT_GNAME_FAIL',
  'EDIT_REL_WT', 'EDIT_REL_WT_SUCCEED', 'EDIT_REL_WT_FAIL',
  'TRANSFER_TO_OWN', 'TRANSFER_TO_OWN_SUCCEED', 'TRANSFER_TO_OWN_FAIL',
  'QUERY_OWNTRANF', 'QUERY_OWNTRANF_SUCCEED', 'QUERY_OWNTRANF_FAIL',
  'ENTRY_TRANS_LOAD', 'ENTRY_TRANS_LOAD_SUCCEED', 'ENTRY_TRANS_LOAD_FAIL',
  'LOAD_ETIDS', 'LOAD_ETIDS_SUCCEED', 'LOAD_ETIDS_FAIL',
  'VIRTUAL_TRANS_SAVE', 'VIRTUAL_TRANS_SAVE_SUCCEED', 'VIRTUAL_TRANS_SAVE_FAIL',
  'VIRTUAL_TRANS_DELETE', 'VIRTUAL_TRANS_DELETE_SUCCEED', 'VIRTUAL_TRANS_DELETE_FAIL',
  'CANCEL_BD', 'CANCEL_BD_SUCCEED', 'CANCEL_BD_FAIL',
  'CANCEL_NC', 'CANCEL_NC_SUCCEED', 'CANCEL_NC_FAIL',
  'LOAD_MANIFTEMP', 'LOAD_MANIFTEMP_SUCCEED', 'LOAD_MANIFTEMP_FAIL',
  'LOAD_BATCH_DECL', 'LOAD_BATCH_DECL_SUCCEED', 'LOAD_BATCH_DECL_FAIL',
  'LOAD_ASNENT', 'LOAD_ASNENT_SUCCEED', 'LOAD_ASNENT_FAIL',
  'EXPORT_NEBREL', 'EXPORT_NEBREL_SUCCEED', 'EXPORT_NEBREL_FAIL',
  'CLEAR_NMREL', 'CLEAR_NMREL_SUCCEED', 'CLEAR_NMREL_FAIL',
  'UPDATE_CIQDECNO', 'UPDATE_CIQDECNO_SUCCEED', 'UPDATE_CIQDECNO_FAIL',
  'UPDATE_REG_DETAIL_BY_ENTGNO', 'UPDATE_REG_DETAIL_BY_ENTGNO_SUCCEED', 'UPDATE_REG_DETAIL_BY_ENTGNO_FAIL',
]);

const initialState = {
  submitting: false,
  batchDeclModal: {
    visible: false,
    ownerCusCode: '',
  },
  transInModal: {
    visible: false,
    ownerCusCode: '',
  },
  normalDeclModal: {
    visible: false,
    ownerCusCode: '',
  },
  normalRelRegModal: {
    visible: false,
  },
  newTransfOutModal: { visible: false },
  batchout_regs: [],
  entryList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  normalSources: [],
  releaseList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  normalDelgList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  batchApplyList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  normalDecl: {},
  declRelRegs: [],
  declRelDetails: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  declRelFilter: {},
  cargolist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  cargoRule: {},
  cargoOwner: {},
  loading: false,
  listFilter: {
    status: 'all',
    type: 'all',
    filterNo: '',
    ownerView: 'all',
  },
  entry_asn: { },
  entry_regs: [], // details: [{ pageSize, current, totalCount, data, merged, filterNo }]
  rel_so: { outbound_no: '', outbound_status: -1 },
  rel_regs: [],
  batch_decl: {},
  batch_applies: [],
  transRegs: [],
  billTemplates: [],
  singleRegStat: {
    total_qty: 0,
    total_net_wt: 0,
    total_amount: 0,
    total_gross_wt: 0,
    total_freight: 0,
  },
  multiRegStats: [], // 进境入库/普通出库 同一单拆单后各备案的总量数据
  batchDecls: [], // 分拨出库集中报关
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_TRANSFER_IN_MODAL:
      return { ...state, transInModal: { ...state.transInModal, ...action.data } };
    case actionTypes.OPEN_BATCH_DECL_MODAL:
      return {
        ...state,
        batchDeclModal: {
          ...state.batchDeclModal,
          visible: true,
          ...action.data,
        },
      };
    case actionTypes.CLOSE_BATCH_DECL_MODAL:
      return { ...state, batchDeclModal: { ...state.batchDeclModal, visible: false } };
    case actionTypes.OPEN_NORMAL_DECL_MODAL:
      return {
        ...state,
        normalDeclModal: {
          ...state.normalDeclModal,
          visible: true,
          ...action.data,
        },
      };
    case actionTypes.CLOSE_NORMAL_DECL_MODAL:
      return { ...state, normalDeclModal: { ...state.normalDeclModal, visible: false } };
    case actionTypes.OPEN_NORMAL_REL_REG_MODAL:
      return {
        ...state,
        normalRelRegModal: {
          ...state.normalRelRegModal,
          visible: true,
          ...action.data,
        },
      };
    case actionTypes.CLOSE_NORMAL_REL_REG_MODAL:
      return { ...state, normalRelRegModal: { ...state.normalRelRegModal, visible: false } };
    case actionTypes.OPEN_NTFO_MODAL:
      return { ...state, newTransfOutModal: { ...state.newTransfOutModal, visible: true } };
    case actionTypes.CLOSE_NTFO_MODAL:
      return { ...state, newTransfOutModal: { ...state.newTransfOutModal, visible: false } };
    case actionTypes.SELECT_CARGO_OWNER:
      return { ...state, cargoOwner: action.owner };
    case actionTypes.ENTRY_REG_LOAD:
      return { ...state, loading: true };
    case actionTypes.ENTRY_REG_LOAD_SUCCEED:
      return {
        ...state,
        entryList: action.result.data,
        listFilter: JSON.parse(action.params.filter),
        loading: false,
      };
    case actionTypes.ENTRY_REG_LOAD_FAIL:
      return { ...state, loading: false };
    case actionTypes.ENTRY_DETAILS_LOAD:
      return { ...state, entry_asn: {}, entry_regs: [] };
    case actionTypes.ENTRY_DETAILS_LOAD_SUCCEED:
      return {
        ...state,
        entry_asn: action.result.data.entry_asn,
        entry_regs: action.result.data.entry_regs,
      };
    case actionTypes.ENTRY_BODY_LOAD: {
      const { preFtzEntNo, filter } = action.params;
      const entryRegs = state.entry_regs.map((f) => {
        if (f.pre_ftz_ent_no === preFtzEntNo) {
          return {
            ...f, filter: JSON.parse(filter),
          };
        }
        return f;
      });
      return { ...state, entry_regs: entryRegs };
    }
    case actionTypes.ENTRY_BODY_LOAD_SUCCEED: {
      const { preFtzEntNo } = action.params;
      const entryRegs = state.entry_regs.map((f) => {
        if (f.pre_ftz_ent_no === preFtzEntNo) {
          return {
            ...f, details: action.result.data,
          };
        }
        return f;
      });
      return { ...state, entry_regs: entryRegs };
    }
    case actionTypes.ENTRY_TOTAL_VALUE_LOAD_SUCCEED:
    case actionTypes.REL_REG_TOTAL_VALUE_LOAD_SUCCEED:
    case actionTypes.LOAD_DRSTAT_SUCCEED: {
      const reviveData = action.result.data;
      const singleRegStat = {
        total_qty: reviveData.total_qty || 0,
        total_net_wt: reviveData.total_net_wt || 0,
        total_amount: reviveData.total_amount || 0,
        total_gross_wt: reviveData.total_gross_wt || 0,
        total_freight: reviveData.total_freight || 0,
      };
      return { ...state, singleRegStat };
    }
    case actionTypes.INBOUND_TOTAL_VALUE_LOAD_SUCCEED:
    case actionTypes.REL_NORMAL_TOTAL_VALUE_LOAD_SUCCEED:
      return {
        ...state,
        multiRegStats: action.result.data,
      };
    case actionTypes.LOAD_VTDETAILS_SUCCEED: {
      const entryAsn = action.result.data;
      const { filter } = action.params;
      entryAsn.filter = JSON.parse(filter);
      return { ...state, entry_asn: entryAsn };
    }
    case actionTypes.RELEASE_REG_LOAD:
      return { ...state, loading: true };
    case actionTypes.RELEASE_REG_LOAD_SUCCEED:
      return {
        ...state,
        releaseList: action.result.data,
        listFilter: JSON.parse(action.params.filter),
        loading: false,
      };
    case actionTypes.RELEASE_REG_LOAD_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_NSOREG_SUCCEED:
    case actionTypes.LOAD_NENREG_SUCCEED:
    case actionTypes.LOAD_NEDREG_SUCCEED:
      return { ...state, normalSources: action.result.data };
    case actionTypes.PRODUCT_CARGO_LOAD:
      return { ...state, listFilter: JSON.parse(action.params.filter), loading: true };
    case actionTypes.PRODUCT_CARGO_LOAD_SUCCEED:
      return {
        ...state,
        cargolist: action.result.data.list,
        cargoRule: action.result.data.rule,
        loading: false,
      };
    case actionTypes.UPDATE_ERFIELD_SUCCEED: {
      const { preFtzEntNo, field, value } = action.data;
      const result = action.result.data;
      const entryRegs = state.entry_regs.map((f) => {
        if (f.pre_ftz_ent_no === preFtzEntNo) {
          let regStatus = f.reg_status;
          if (!action.data.noEntStatus && result.status >= 0) {
            regStatus = result.status;
          }
          return {
            ...f, [field]: value, reg_status: regStatus, ...result,
          };
        }
        return f;
      });
      return { ...state, entry_regs: entryRegs };
    }
    case actionTypes.REL_DETAILS_LOAD_SUCCEED:
      return { ...state, rel_so: action.result.data.rel_so, rel_regs: action.result.data.rel_regs };
    case actionTypes.REL_BODY_LOAD: {
      const { preEntrySeqNo, filter } = action.params;
      const relRegs = state.rel_regs.map((f) => {
        if (f.pre_entry_seq_no === preEntrySeqNo) {
          const parseFilter = JSON.parse(filter);
          if (parseFilter.normalDetType === 0) { // 普通出库备案明细
            return { ...f, filingFilter: parseFilter };
          } else if (parseFilter.normalDetType === 1) { // 普通出库出区明细
            return { ...f, exitFilter: parseFilter };
          }
          return { ...f, filter: parseFilter }; // 区内转出/分拨出库明细
        }
        return f;
      });
      return { ...state, rel_regs: relRegs };
    }
    case actionTypes.REL_BODY_LOAD_SUCCEED: {
      const { preEntrySeqNo, filter } = action.params;
      const relRegs = state.rel_regs.map((f) => {
        if (f.pre_entry_seq_no === preEntrySeqNo) {
          const parseFilter = JSON.parse(filter);
          if (parseFilter.normalDetType === 0) { // 普通出库备案明细
            return { ...f, filingDetails: action.result.data };
          } else if (parseFilter.normalDetType === 1) { // 普通出库出区明细
            return { ...f, exitDetails: action.result.data };
          }
          return { ...f, details: action.result.data }; // 区内转出/分拨出库明细
        }
        return f;
      });
      return { ...state, rel_regs: relRegs };
    }
    case actionTypes.UPDATE_RRFIELD_SUCCEED:
      return {
        ...state,
        rel_regs: state.rel_regs.map((rr) => {
          if (rr.pre_entry_seq_no === action.data.pre_entry_seq_no) {
            return { ...rr, ...action.result.data };
          }
          return rr;
        }),
      };
    case actionTypes.CLEAR_NMREL_SUCCEED:
      return {
        ...state,
        rel_regs: state.rel_regs.map((rr) => {
          if (rr.pre_entry_seq_no === action.data.preEntrySeqNo) {
            return { ...rr, cus_decl_no: action.data.cusDeclNo, status: 6 };
          }
          return rr;
        }),
      };
    case actionTypes.FILE_RSO:
    case actionTypes.FILE_RTS:
    case actionTypes.FILE_BA:
    case actionTypes.MAKE_BAL:
    case actionTypes.CHECK_ENRSTU:
    case actionTypes.CANCEL_RER:
    case actionTypes.SYNC_SKU:
    case actionTypes.FILE_RPO:
    case actionTypes.UPDATE_CARGO_RULE:
    case actionTypes.FILE_ERS:
    case actionTypes.QUERY_ERI:
    case actionTypes.PAIR_ERP:
    case actionTypes.QUERY_POI:
    case actionTypes.FILE_CARGO:
    case actionTypes.CONFIRM_CARGO:
    case actionTypes.BEGIN_BD:
    case actionTypes.BEGIN_NC:
    case actionTypes.TRANSFER_TO_OWN:
    case actionTypes.QUERY_OWNTRANF:
    case actionTypes.VIRTUAL_TRANS_SAVE:
    case actionTypes.NEW_NRER:
    case actionTypes.NEW_NRSO:
    case actionTypes.NEW_TRSO:
      return { ...state, submitting: true };
    case actionTypes.FILE_RSO_FAIL:
    case actionTypes.FILE_RTS_FAIL:
    case actionTypes.FILE_BA_FAIL:
    case actionTypes.MAKE_BAL_FAIL:
    case actionTypes.CHECK_ENRSTU_FAIL:
    case actionTypes.CANCEL_RER_FAIL:
    case actionTypes.SYNC_SKU_SUCCESS:
    case actionTypes.SYNC_SKU_FAIL:
    case actionTypes.FILE_RPO_FAIL:
    case actionTypes.UPDATE_CARGO_RULE_SUCCEED:
    case actionTypes.UPDATE_CARGO_RULE_FAIL:
    case actionTypes.FILE_ERS_SUCCEED:
    case actionTypes.FILE_ERS_FAIL:
    case actionTypes.QUERY_ERI_SUCCEED:
    case actionTypes.QUERY_ERI_FAIL:
    case actionTypes.PAIR_ERP_SUCCEED:
    case actionTypes.PAIR_ERP_FAIL:
    case actionTypes.QUERY_POI_SUCCEED:
    case actionTypes.QUERY_POI_FAIL:
    case actionTypes.FILE_CARGO_SUCCEED:
    case actionTypes.FILE_CARGO_FAIL:
    case actionTypes.CONFIRM_CARGO_SUCCEED:
    case actionTypes.CONFIRM_CARGO_FAIL:
    case actionTypes.BEGIN_BD_SUCCEED:
    case actionTypes.BEGIN_BD_FAIL:
    case actionTypes.BEGIN_NC_SUCCEED:
    case actionTypes.BEGIN_NC_FAIL:
    case actionTypes.TRANSFER_TO_OWN_SUCCEED:
    case actionTypes.TRANSFER_TO_OWN_FAIL:
    case actionTypes.QUERY_OWNTRANF_SUCCEED:
    case actionTypes.QUERY_OWNTRANF_FAIL:
    case actionTypes.VIRTUAL_TRANS_SAVE_SUCCEED:
    case actionTypes.VIRTUAL_TRANS_SAVE_FAIL:
    case actionTypes.NEW_NRER_SUCCEED:
    case actionTypes.NEW_NRER_FAIL:
    case actionTypes.NEW_NRSO_SUCCEED:
    case actionTypes.NEW_NRSO_FAIL:
    case actionTypes.NEW_TRSO_SUCCEED:
    case actionTypes.NEW_TRSO_FAIL:
      return { ...state, submitting: false };
    case actionTypes.FILE_RSO_SUCCEED:
    case actionTypes.FILE_RTS_SUCCEED:
    case actionTypes.FILE_RPO_SUCCEED:
      return {
        ...state,
        submitting: false,
        rel_regs: state.rel_regs.map(rr =>
          ({
            ...rr,
            status: action.result.data.status,
            ftz_rel_no: action.result.data.preSeqEnts[rr.pre_entry_seq_no],
          })),
      };
    case actionTypes.LOAD_NDLIST:
      return { ...state, listFilter: JSON.parse(action.params.filter), loading: true };
    case actionTypes.LOAD_NDLIST_SUCCEED:
      return { ...state, loading: false, normalDelgList: action.result.data };
    case actionTypes.LOAD_NDLIST_FAIL:
      return { ...state, loading: false };
    case actionTypes.CANCEL_BD:
    case actionTypes.CANCEL_NC:
      return { ...state, loading: true };
    case actionTypes.CANCEL_BD_SUCCEED:
    case actionTypes.CANCEL_BD_FAIL:
    case actionTypes.CANCEL_NC_SUCCEED:
    case actionTypes.CANCEL_NC_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_BALIST:
      return { ...state, listFilter: JSON.parse(action.params.filter), loading: true };
    case actionTypes.LOAD_BALIST_SUCCEED:
      return { ...state, loading: false, batchApplyList: action.result.data };
    case actionTypes.LOAD_BALIST_FAIL:
      return { ...state, loading: false };
    case actionTypes.LOAD_PORS_SUCCEED:
      return { ...state, batchout_regs: action.result.data };
    case actionTypes.LOAD_NDELG_SUCCEED:
      return { ...state, normalDecl: action.result.data };
    case actionTypes.LOAD_DRDETAILS:
      return {
        ...state,
        declRelFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_DRDETAILS_SUCCEED:
      return {
        ...state,
        declRelRegs: action.result.data.rel_regs,
        declRelDetails: action.result.data.details,
      };
    case actionTypes.LOAD_APPLD_SUCCEED:
      return {
        ...state,
        batch_decl: action.result.data.batch_decl,
        batch_applies: action.result.data.batch_applies,
      };
    case actionTypes.LOAD_SINGLE_APPLD: {
      const { preEntrySeqNo, filter } = action.params;
      const batchApplies = state.batch_applies.map((f) => {
        if (f.pre_entry_seq_no === preEntrySeqNo) {
          const parseFilter = JSON.parse(filter);
          return { ...f, filter: parseFilter };
        }
        return f;
      });
      return { ...state, batch_applies: batchApplies };
    }
    case actionTypes.LOAD_SINGLE_APPLD_SUCCEED: {
      const { preEntrySeqNo } = action.params;
      const batchApplies = state.batch_applies.map((f) => {
        if (f.pre_entry_seq_no === preEntrySeqNo) {
          return { ...f, details: action.result.data };
        }
        return f;
      });
      return { ...state, batch_applies: batchApplies };
    }
    case actionTypes.FILE_BA_SUCCEED:
      return {
        ...state,
        batch_decl: { ...state.batch_decl, status: 'processing' },
        batch_applies: state.batch_applies.map(ba => ({
          ...ba,
          ftz_apply_no: action.result.data.preEntApplyMap[ba.pre_entry_seq_no],
        })),
        submitting: false,
      };
    case actionTypes.MAKE_BAL_SUCCEED:
      return { ...state, batch_decl: { ...state.batch_decl, status: 'applied' }, submitting: false };
    case actionTypes.CHECK_ENRSTU_SUCCEED:
      return {
        ...state,
        entry_asn: { ...state.entry_asn, ...action.result.data },
        submitting: false,
      };
    case actionTypes.CANCEL_RER_SUCCEED:
      return {
        ...state,
        submitting: false,
        rel_regs: state.rel_regs.map(rr => ({ ...rr, status: action.result.data.status })),
      };
    case actionTypes.ENTRY_TRANS_LOAD_SUCCEED:
      return { ...state, transRegs: action.result.data };
    case actionTypes.LOAD_MANIFTEMP_SUCCEED:
      return { ...state, billTemplates: action.result.data };
    case actionTypes.LOAD_BATCH_DECL_SUCCEED: {
      return { ...state, batchDecls: action.result.data };
    }
    case actionTypes.UPDATE_REG_DETAIL_BY_ENTGNO_SUCCEED: {
      const { preFtzEntWhere, updateInfo } = action.data;
      const newEntryRegs = state.entry_regs.map((entryReg) => {
        if (entryReg.pre_ftz_ent_no === preFtzEntWhere.pre_ftz_ent_no) {
          const newEntryRegDetData = entryReg.details.data.map((detail) => {
            if (detail.ent_g_no === preFtzEntWhere.ent_g_no) {
              return { ...detail, ...updateInfo };
            }
            return detail;
          });
          return { ...entryReg, details: { ...entryReg.details, data: newEntryRegDetData } };
        } else if (entryReg.details.data.find(edd => edd.id === preFtzEntWhere.id)) {
          const newEntrRegData = entryReg.details.data.map((edd) => {
            if (edd.id === preFtzEntWhere.id) {
              return { ...edd, ...updateInfo };
            }
            return edd;
          });
          return { ...entryReg, details: { ...entryReg.details, data: newEntrRegData } };
        }
        return entryReg;
      });
      return { ...state, entry_regs: newEntryRegs };
    }
    default:
      return state;
  }
}

export function showTransferInModal(data) {
  return {
    type: actionTypes.SHOW_TRANSFER_IN_MODAL,
    data,
  };
}

export function openBatchDeclModal(modalInfo) {
  return {
    type: actionTypes.OPEN_BATCH_DECL_MODAL,
    data: modalInfo,
  };
}

export function closeBatchDeclModal() {
  return {
    type: actionTypes.CLOSE_BATCH_DECL_MODAL,
  };
}

export function openNormalDeclModal(modalInfo) {
  return {
    type: actionTypes.OPEN_NORMAL_DECL_MODAL,
    data: modalInfo,
  };
}

export function closeNormalDeclModal() {
  return {
    type: actionTypes.CLOSE_NORMAL_DECL_MODAL,
  };
}

export function openNormalRelRegModal(modalInfo) {
  return {
    type: actionTypes.OPEN_NORMAL_REL_REG_MODAL,
    data: modalInfo,
  };
}

export function closeNormalRelRegModal() {
  return {
    type: actionTypes.CLOSE_NORMAL_REL_REG_MODAL,
  };
}

export function loadNormalSoRegs(query) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NSOREG,
        actionTypes.LOAD_NSOREG_SUCCEED,
        actionTypes.LOAD_NSOREG_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/src/so',
      method: 'get',
      params: query,
    },
  };
}
export function loadNormalEntryRegs(query) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NENREG,
        actionTypes.LOAD_NENREG_SUCCEED,
        actionTypes.LOAD_NENREG_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/src/reg',
      method: 'get',
      params: query,
    },
  };
}
export function loadNormalEntryDetails(query) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NEDREG,
        actionTypes.LOAD_NEDREG_SUCCEED,
        actionTypes.LOAD_NEDREG_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/src/reg/detail',
      method: 'get',
      params: query,
    },
  };
}

export function loadSoRelDetails(soNo, tbdSo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SORELD,
        actionTypes.LOAD_SORELD_SUCCEED,
        actionTypes.LOAD_SORELD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/load',
      method: 'get',
      params: { soNo, tbdSo },
    },
  };
}

export function loadNormalEntryRegDetails(asnNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NENTD,
        actionTypes.LOAD_NENTD_SUCCEED,
        actionTypes.LOAD_NENTD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/load',
      method: 'get',
      params: { asnNo },
    },
  };
}

export function newNormalRegByEntryReg(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.NEW_NRER,
        actionTypes.NEW_NRER_SUCCEED,
        actionTypes.NEW_NRER_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/createby/entryreg',
      method: 'post',
      data,
    },
  };
}

export function newNormalRegBySo(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.NEW_NRSO,
        actionTypes.NEW_NRSO_SUCCEED,
        actionTypes.NEW_NRSO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/createby/so',
      method: 'post',
      data,
    },
  };
}

export function openNewTransfOutModal() {
  return {
    type: actionTypes.OPEN_NTFO_MODAL,
  };
}

export function closeNewTransfOutModal() {
  return {
    type: actionTypes.CLOSE_NTFO_MODAL,
  };
}

export function selectCargoOwner(owner) {
  return {
    type: actionTypes.SELECT_CARGO_OWNER,
    owner,
  };
}

export function newTransfOutRegBySo(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.NEW_TRSO,
        actionTypes.NEW_TRSO_SUCCEED,
        actionTypes.NEW_TRSO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/transf/out/createby/so',
      method: 'post',
      data,
    },
  };
}

export function loadEntryRegDatas(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENTRY_REG_LOAD,
        actionTypes.ENTRY_REG_LOAD_SUCCEED,
        actionTypes.ENTRY_REG_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/load',
      method: 'get',
      params,
    },
  };
}

export function loadReleaseRegDatas(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RELEASE_REG_LOAD,
        actionTypes.RELEASE_REG_LOAD_SUCCEED,
        actionTypes.RELEASE_REG_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/releasereg/load',
      method: 'get',
      params,
    },
  };
}

// 进境入库，区内入库
export function loadEntryDetails(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENTRY_DETAILS_LOAD,
        actionTypes.ENTRY_DETAILS_LOAD_SUCCEED,
        actionTypes.ENTRY_DETAILS_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/details/load',
      method: 'get',
      params,
    },
  };
}

export function splitCustomEntryDetails(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SPLIT_CUSED,
        actionTypes.SPLIT_CUSED_SUCCEED,
        actionTypes.SPLIT_CUSED_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/details/split/byseq',
      method: 'post',
      data,
    },
  };
}

// 本库转让
export function loadVirtualTransferDetails(asnNo, currentPage, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_VTDETAILS,
        actionTypes.LOAD_VTDETAILS_SUCCEED,
        actionTypes.LOAD_VTDETAILS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/virtual/details',
      method: 'get',
      params: {
        asnNo, currentPage, pageSize, filter,
      },
    },
  };
}

// 进境入库、区内转入归并前后明细变更，页码切换，字段查询变化更新对应的备案明细列表
// regType => entry进境入库 transfer区内转入
export function loadEntryBody(preFtzEntNo, currentPage, pageSize, filter, regType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENTRY_BODY_LOAD,
        actionTypes.ENTRY_BODY_LOAD_SUCCEED,
        actionTypes.ENTRY_BODY_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/single/details',
      method: 'get',
      params: {
        preFtzEntNo, currentPage, pageSize, filter, regType,
      },
    },
  };
}

// 进境入库各备案的总量数据
export function loadInboundTotalValue(preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.INBOUND_TOTAL_VALUE_LOAD,
        actionTypes.INBOUND_TOTAL_VALUE_LOAD_SUCCEED,
        actionTypes.INBOUND_TOTAL_VALUE_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/inbound/stat',
      method: 'get',
      params: { preEntrySeqNo },
    },
  };
}

// 区内转入和本库转让的总量数据
export function loadEntryTotalValue(preFtzEntNo, isVirtual = false) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENTRY_TOTAL_VALUE_LOAD,
        actionTypes.ENTRY_TOTAL_VALUE_LOAD_SUCCEED,
        actionTypes.ENTRY_TOTAL_VALUE_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/single/stat',
      method: 'get',
      params: { preFtzEntNo, isVirtual },
    },
  };
}

// 区内转出查询总量数据
export function loadRelTotalValue(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REL_REG_TOTAL_VALUE_LOAD,
        actionTypes.REL_REG_TOTAL_VALUE_LOAD_SUCCEED,
        actionTypes.REL_REG_TOTAL_VALUE_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/reg/single/stat',
      method: 'get',
      params,
    },
  };
}

// 普通出库查询总量数据
export function loadRelNormalTotalValue(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REL_NORMAL_TOTAL_VALUE_LOAD,
        actionTypes.REL_NORMAL_TOTAL_VALUE_LOAD_SUCCEED,
        actionTypes.REL_NORMAL_TOTAL_VALUE_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/normal/stat',
      method: 'get',
      params,
    },
  };
}

export function loadProductCargo(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PRODUCT_CARGO_LOAD,
        actionTypes.PRODUCT_CARGO_LOAD_SUCCEED,
        actionTypes.PRODUCT_CARGO_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/product/cargo/load',
      method: 'get',
      params,
    },
  };
}

export function updateCargoRule(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CARGO_RULE,
        actionTypes.UPDATE_CARGO_RULE_SUCCEED,
        actionTypes.UPDATE_CARGO_RULE_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/product/cargo/rule/update',
      method: 'post',
      data,
    },
  };
}

export function syncProdSKUS(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SYNC_SKU,
        actionTypes.SYNC_SKU_SUCCEED,
        actionTypes.SYNC_SKU_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/product/cargo/skus/sync',
      method: 'post',
      data,
    },
  };
}

export function updateEntryReg(preFtzEntNo, field, value, virtualTransfer, noEntStatus) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ERFIELD,
        actionTypes.UPDATE_ERFIELD_SUCCEED,
        actionTypes.UPDATE_ERFIELD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/field/value',
      method: 'post',
      data: {
        preFtzEntNo, field, value, virtualTransfer, noEntStatus,
      },
    },
  };
}

export function refreshEntryRegFtzCargos(asnNo, preEntrySeqNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REFRSH_RFTZC,
        actionTypes.REFRSH_RFTZC_SUCCEED,
        actionTypes.REFRSH_RFTZC_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/refresh/cargono',
      method: 'post',
      data: { asnNo, preEntrySeqNo },
    },
  };
}

export function fileEntryRegs(asnNo, preEntrySeqNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_ERS,
        actionTypes.FILE_ERS_SUCCEED,
        actionTypes.FILE_ERS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/regs/file',
      method: 'post',
      data: { asnNo, preEntrySeqNo, whse: whseCode },
    },
  };
}

export function queryEntryRegInfos(asnNo, preEntrySeqNo, whseCode, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUERY_ERI,
        actionTypes.QUERY_ERI_SUCCEED,
        actionTypes.QUERY_ERI_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/regs/query',
      method: 'post',
      data: {
        asnNo, preEntrySeqNo, whse: whseCode, ftzWhseCode,
      },
    },
  };
}

export function putCustomsRegFields(entrySeqNoCls, fields) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHECK_ENRSTU,
        actionTypes.CHECK_ENRSTU_SUCCEED,
        actionTypes.CHECK_ENRSTU_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/reg/put/fields',
      method: 'post',
      data: { entrySeqNoCls, fields },
    },
  };
}

export function pairEntryRegProducts(preFtzEntNo, asnNo, whseCode, ftzWhseCode, loginName) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.PAIR_ERP,
        actionTypes.PAIR_ERP_SUCCEED,
        actionTypes.PAIR_ERP_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/regs/matchpair',
      method: 'post',
      data: {
        preFtzEntNo, asnNo, whse: whseCode, ftzWhseCode, loginName,
      },
    },
  };
}

// 区内转出明细
export function loadRelDetails(soNo, relType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REL_DETAILS_LOAD,
        actionTypes.REL_DETAILS_LOAD_SUCCEED,
        actionTypes.REL_DETAILS_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/reg/details',
      method: 'get',
      params: { so_no: soNo, rel_type: relType },
    },
  };
}

// 更新对应的转出备案明细
export function loadRelBody(preEntrySeqNo, currentPage, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REL_BODY_LOAD,
        actionTypes.REL_BODY_LOAD_SUCCEED,
        actionTypes.REL_BODY_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/reg/single/details',
      method: 'get',
      params: {
        preEntrySeqNo, currentPage, pageSize, filter,
      },
    },
  };
}

export function updateRelReg(preRegNo, field, value) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_RRFIELD,
        actionTypes.UPDATE_RRFIELD_SUCCEED,
        actionTypes.UPDATE_RRFIELD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/field/value',
      method: 'post',
      data: { pre_entry_seq_no: preRegNo, field, value },
    },
  };
}

export function fileRelStockouts(soNo, whseCode, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_RSO,
        actionTypes.FILE_RSO_SUCCEED,
        actionTypes.FILE_RSO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/file/stockouts',
      method: 'post',
      data: { so_no: soNo, whse_code: whseCode, ftzWhseCode },
    },
  };
}

export function fileRelTransfers(soNo, whseCode, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_RTS,
        actionTypes.FILE_RTS_SUCCEED,
        actionTypes.FILE_RTS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/file/transfers',
      method: 'post',
      data: { so_no: soNo, whse_code: whseCode, ftzWhseCode },
    },
  };
}

export function fileRelPortionouts(soNo, whseCode, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_RPO,
        actionTypes.FILE_RPO_SUCCEED,
        actionTypes.FILE_RPO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/file/portionouts',
      method: 'post',
      data: { so_no: soNo, whse_code: whseCode, ftzWhseCode },
    },
  };
}

export function queryPortionoutInfos(soNo, whseCode, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUERY_POI,
        actionTypes.QUERY_POI_SUCCEED,
        actionTypes.QUERY_POI_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/release/portionouts/query',
      method: 'post',
      data: { so_no: soNo, whse: whseCode, ftzWhseCode },
    },
  };
}

export function cancelRelReg(soNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_RER,
        actionTypes.CANCEL_RER_SUCCEED,
        actionTypes.CANCEL_RER_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/reg/cancel',
      method: 'post',
      data: { soNo },
    },
  };
}

export function fileCargos(ownerCusCode, whse, ftzWhseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_CARGO,
        actionTypes.FILE_CARGO_SUCCEED,
        actionTypes.FILE_CARGO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/product/file/cargos',
      method: 'post',
      data: { owner_cus_code: ownerCusCode, whse, ftzWhseCode },
    },
  };
}

export function confirmCargos(ownerCusCode, whse) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CONFIRM_CARGO,
        actionTypes.CONFIRM_CARGO_SUCCEED,
        actionTypes.CONFIRM_CARGO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/product/confirm/cargos',
      method: 'post',
      data: { owner_cus_code: ownerCusCode, whse },
    },
  };
}

export function loadBatchApplyList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BALIST,
        actionTypes.LOAD_BALIST_SUCCEED,
        actionTypes.LOAD_BALIST_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/applies',
      method: 'get',
      params,
    },
  };
}

export function loadBatchOutRegs(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PORS,
        actionTypes.LOAD_PORS_SUCCEED,
        actionTypes.LOAD_PORS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/outregs',
      method: 'get',
      params,
    },
  };
}

export function loadBatchRegDetails(relNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PTDS,
        actionTypes.LOAD_PTDS_SUCCEED,
        actionTypes.LOAD_PTDS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/reg/details',
      method: 'get',
      params: { rel_no: relNo },
    },
  };
}

export function beginBatchDecl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BEGIN_BD,
        actionTypes.BEGIN_BD_SUCCEED,
        actionTypes.BEGIN_BD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/decl/begin',
      method: 'post',
      data,
    },
  };
}

export function batchDelgCancel(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_BD,
        actionTypes.CANCEL_BD_SUCCEED,
        actionTypes.CANCEL_BD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/decl/cancel',
      method: 'post',
      data,
    },
  };
}

export function beginNormalDecl(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BEGIN_NC,
        actionTypes.BEGIN_NC_SUCCEED,
        actionTypes.BEGIN_NC_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/decl/begin',
      method: 'post',
      data,
    },
  };
}

export function cancelBatchNormalClear(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_NC,
        actionTypes.CANCEL_NC_SUCCEED,
        actionTypes.CANCEL_NC_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/decl/cancel',
      method: 'post',
      data,
    },
  };
}

export function loadNormalDelgList(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NDLIST,
        actionTypes.LOAD_NDLIST_SUCCEED,
        actionTypes.LOAD_NDLIST_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/delegations',
      method: 'get',
      params,
    },
  };
}

export function loadNormalDelg(batchNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_NDELG,
        actionTypes.LOAD_NDELG_SUCCEED,
        actionTypes.LOAD_NDELG_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/decl',
      method: 'get',
      params: { batchNo },
    },
  };
}

export function loadDeclRelDetails(batchNo, currentPage = 1, pageSize = 20, filter = '{}') {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DRDETAILS,
        actionTypes.LOAD_DRDETAILS_SUCCEED,
        actionTypes.LOAD_DRDETAILS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/decl/release/details',
      method: 'get',
      params: {
        batchNo, currentPage, pageSize, filter,
      },
    },
  };
}

export function loadDeclRelStat(batchNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DRSTAT,
        actionTypes.LOAD_DRSTAT_SUCCEED,
        actionTypes.LOAD_DRSTAT_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/decl/release/stat',
      method: 'get',
      params: { batchNo },
    },
  };
}

// 加载分拨出库的所有报关申请单及明细
export function loadApplyDetails(batchNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_APPLD,
        actionTypes.LOAD_APPLD_SUCCEED,
        actionTypes.LOAD_APPLD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/apply/details',
      method: 'get',
      params: { batchNo },
    },
  };
}

// 更新对应的报关申请单的明细数据
export function loadSingleApplyDetails(preEntrySeqNo, currentPage, pageSize, filter) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SINGLE_APPLD,
        actionTypes.LOAD_SINGLE_APPLD_SUCCEED,
        actionTypes.LOAD_SINGLE_APPLD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/single/apply/details',
      method: 'get',
      params: {
        preEntrySeqNo, currentPage, pageSize, filter,
      },
    },
  };
}

export function fileBatchApply(batchNo, whseCode, ftzWhseCode, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.FILE_BA,
        actionTypes.FILE_BA_SUCCEED,
        actionTypes.FILE_BA_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/decl/file',
      method: 'post',
      data: {
        batchNo, whseCode, ftzWhseCode, loginId,
      },
    },
  };
}

export function makeBatchApplied(batchNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MAKE_BAL,
        actionTypes.MAKE_BAL_SUCCEED,
        actionTypes.MAKE_BAL_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/decl/applied',
      method: 'post',
      data: { batchNo },
    },
  };
}

export function editGname(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_GNAME,
        actionTypes.EDIT_GNAME_SUCCEED,
        actionTypes.EDIT_GNAME_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/gname/edit',
      method: 'post',
      data,
    },
  };
}

export function editReleaseWt(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_REL_WT,
        actionTypes.EDIT_REL_WT_SUCCEED,
        actionTypes.EDIT_REL_WT_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/rel/wt/edit',
      method: 'post',
      data,
    },
  };
}

export function loadEntryTransRegs(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ENTRY_TRANS_LOAD,
        actionTypes.ENTRY_TRANS_LOAD_SUCCEED,
        actionTypes.ENTRY_TRANS_LOAD_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/transferIn/load',
      method: 'get',
      params,
    },
  };
}

// 本库转让明细
export function loadVtransferRegDetails(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ETIDS,
        actionTypes.LOAD_ETIDS_SUCCEED,
        actionTypes.LOAD_ETIDS_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/reg/vtransf/details',
      method: 'get',
      params,
    },
  };
}

export function saveVirtualTransfer(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VIRTUAL_TRANS_SAVE,
        actionTypes.VIRTUAL_TRANS_SAVE_SUCCEED,
        actionTypes.VIRTUAL_TRANS_SAVE_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/virtual/transfer/save',
      method: 'post',
      data,
    },
  };
}

export function deleteVirtualTransfer(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VIRTUAL_TRANS_DELETE,
        actionTypes.VIRTUAL_TRANS_DELETE_SUCCEED,
        actionTypes.VIRTUAL_TRANS_DELETE_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/virtual/transfer/delete',
      method: 'post',
      data,
    },
  };
}

export function transferToOwnWhse(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TRANSFER_TO_OWN,
        actionTypes.TRANSFER_TO_OWN_SUCCEED,
        actionTypes.TRANSFER_TO_OWN_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/transfer/to/ownwhse',
      method: 'post',
      data,
    },
  };
}

export function queryOwnTransferOutIn(query) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.QUERY_OWNTRANF,
        actionTypes.QUERY_OWNTRANF_SUCCEED,
        actionTypes.QUERY_OWNTRANF_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/transfer/ownwhse/query',
      method: 'post',
      data: query,
    },
  };
}

export function loadManifestTemplates(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_MANIFTEMP,
        actionTypes.LOAD_MANIFTEMP_SUCCEED,
        actionTypes.LOAD_MANIFTEMP_FAIL,
      ],
      endpoint: 'v1/cms/settings/owner/billtemplates',
      method: 'get',
      params,
    },
  };
}

export function loadBatchDecl(ftzRelNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BATCH_DECL,
        actionTypes.LOAD_BATCH_DECL_SUCCEED,
        actionTypes.LOAD_BATCH_DECL_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/batch/decl/load',
      method: 'get',
      params: { ftzRelNo },
    },
  };
}

export function loadAsnEntries(asnNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ASNENT,
        actionTypes.LOAD_ASNENT_SUCCEED,
        actionTypes.LOAD_ASNENT_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entry/reg/byasn',
      method: 'get',
      params: { asnNo },
    },
  };
}

export function exportNormalExitByRel(relno) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXPORT_NEBREL,
        actionTypes.EXPORT_NEBREL_SUCCEED,
        actionTypes.EXPORT_NEBREL_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/exit/voucher/exportbyrel',
      method: 'post',
      data: { relno },
    },
  };
}

export function clearNormalRel(preEntrySeqNo, cusDeclNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CLEAR_NMREL,
        actionTypes.CLEAR_NMREL_SUCCEED,
        actionTypes.CLEAR_NMREL_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/normal/release/clear',
      method: 'post',
      data: { preEntrySeqNo, cusDeclNo },
    },
  };
}

export function cwmShFtzDecl(ftzRelDetailId, preCiqDeclNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CIQDECNO,
        actionTypes.UPDATE_CIQDECNO_SUCCEED,
        actionTypes.UPDATE_CIQDECNO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/single/decl/edit/ciqno',
      method: 'put',
      data: { ftzRelDetailId, preCiqDeclNo },
    },
  };
}

export function updateRegDetailByEntGNo(preFtzEntWhere, updateInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_REG_DETAIL_BY_ENTGNO,
        actionTypes.UPDATE_REG_DETAIL_BY_ENTGNO_SUCCEED,
        actionTypes.UPDATE_REG_DETAIL_BY_ENTGNO_FAIL,
      ],
      endpoint: 'v1/cwm/shftz/entryreg/details/update',
      method: 'post',
      data: { preFtzEntWhere, updateInfo },
    },
  };
}
