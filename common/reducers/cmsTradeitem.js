import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/cms/tradeitem/', [
  'LOAD_REPOS', 'LOAD_REPOS_SUCCEED', 'LOAD_REPOS_FAIL',
  'LOAD_REPO', 'LOAD_REPO_SUCCEED', 'LOAD_REPO_FAIL',
  'OPEN_ADD_MODEL', 'CLOSE_ADD_MODEL',
  'CREATE_REPO', 'CREATE_REPO_SUCCEED', 'CREATE_REPO_FAIL',
  'DELETE_REPO', 'DELETE_REPO_SUCCEED', 'DELETE_REPO_FAIL',
  'LOAD_TRADE_ITEMS', 'LOAD_TRADE_ITEMS_SUCCEED', 'LOAD_TRADE_ITEMS_FAIL',
  'CREATE_ITEM', 'CREATE_ITEM_SUCCEED', 'CREATE_ITEM_FAIL',
  'LOAD_ITEM_EDIT', 'LOAD_ITEM_EDIT_SUCCEED', 'LOAD_ITEM_EDIT_FAIL',
  'ITEM_EDITED_SAVE', 'ITEM_EDITED_SAVE_SUCCEED', 'ITEM_EDITED_SAVE_FAIL',
  'DELETE_ITEMS', 'DELETE_ITEMS_SUCCEED', 'DELETE_ITEMS_FAIL',
  'LOAD_BODY_ITEM', 'LOAD_BODY_ITEM_SUCCEED', 'LOAD_BODY_ITEM_FAIL',
  'TOGGLE_HISTITEM', 'TOGGLE_HISTITEM_SUCCEED', 'TOGGLE_HISTITEM_FAIL',
  'LOAD_REPO_USERS', 'LOAD_REPO_USERS_SUCCEED', 'LOAD_REPO_USERS_FAIL',
  'ADD_REPO_USER', 'ADD_REPO_USER_SUCCEED', 'ADD_REPO_USER_FAIL',
  'DELETE_REPO_USER', 'DELETE_REPO_USER_SUCCEED', 'DELETE_REPO_USER_FAIL',
  'LOAD_TRDIHISTORY', 'LOAD_TRDIHISTORY_SUCCEED', 'LOAD_TRDIHISTORY_FAIL',
  'SHOW_LINKSLAVE',
  'LOAD_LINKEDSLAVES', 'LOAD_LINKEDSLAVES_SUCCEED', 'LOAD_LINKEDSLAVES_FAIL',
  'LOAD_OWNSLAVES', 'LOAD_OWNSLAVES_SUCCEED', 'LOAD_OWNSLAVES_FAIL',
  'LINK_MASTERSLAVE', 'LINK_MASTERSLAVE_SUCCEED', 'LINK_MASTERSLAVE_FAIL',
  'UNLINK_MASTERSLAVE', 'UNLINK_MASTERSLAVE_SUCCEED', 'UNLINK_MASTERSLAVE_FAIL',
  'SAVE_REPOITM', 'SAVE_REPOITM_SUCCEED', 'SAVE_REPOITM_FAIL',
  'SAVE_REPOFKITM', 'SAVE_REPOFKITM_SUCCEED', 'SAVE_REPOFKITM_FAIL',
  'SWITCH_REPOMD', 'SWITCH_REPOMD_SUCCEED', 'SWITCH_REPOMD_FAIL',
  'SWITCH_REPVK', 'SWITCH_REPVK_SUCCEED', 'SWITCH_REPVK_FAIL',
  'REPLICA_MASTERSLAVE', 'REPLICA_MASTERSLAVE_SUCCEED', 'REPLICA_MASTERSLAVE_FAIL',
  'LOAD_WSSTAT', 'LOAD_WSSTAT_SUCCEED', 'LOAD_WSSTAT_FAIL',
  'LOAD_WSTASKLIST', 'LOAD_WSTASKLIST_SUCCEED', 'LOAD_WSTASKLIST_FAIL',
  'LOAD_WSTASK', 'LOAD_WSTASK_SUCCEED', 'LOAD_WSTASK_FAIL',
  'DEL_WSTASK', 'DEL_WSTASK_SUCCEED', 'DEL_WSTASK_FAIL',
  'LOAD_TEITEMS', 'LOAD_TEITEMS_SUCCEED', 'LOAD_TEITEMS_FAIL',
  'LOAD_TCITEMS', 'LOAD_TCITEMS_SUCCEED', 'LOAD_TCITEMS_FAIL',
  'LOAD_WSLITEMS', 'LOAD_WSLITEMS_SUCCEED', 'LOAD_WSLITEMS_FAIL',
  'LOAD_WSITEM', 'LOAD_WSITEM_SUCCEED', 'LOAD_WSITEM_FAIL',
  'SAVE_WSITEM', 'SAVE_WSITEM_SUCCEED', 'SAVE_WSITEM_FAIL',
  'DEL_WSLITEMS', 'DEL_WSLITEMS_SUCCEED', 'DEL_WSLITEMS_FAIL',
  'RESOLV_WSLITEMS', 'RESOLV_WSLITEMS_SUCCEED', 'RESOLV_WSLITEMS_FAIL',
  'SUBMIT_AUDIT', 'SUBMIT_AUDIT_SUCCEED', 'SUBMIT_AUDIT_FAIL',
  'AUDIT_ITEMS', 'AUDIT_ITEMS_SUCCEED', 'AUDIT_ITEMS_FAIL',
  'TOGGLE_APPLY_CERTS_MODAL', 'TOGGLE_ITEM_DIFF_MODAL', 'TOGGLE_CONFIRM_CHANGES_MODAL',
  'TOGGLE_CONFIRM_FORK_MODAL',
  'UPDATE_ITEM_APPL_CERT', 'UPDATE_ITEM_APPL_CERT_SUCCEED', 'UPDATE_ITEM_APPL_CERT_FAIL',
  'LOAD_PERMITS', 'LOAD_PERMITS_SUCCEED', 'LOAD_PERMITS_FAIL',
  'CHANGE_ITEM_MASTER', 'NOTIFY_FORM_CHANGED',
  'GET_MASTER_TRADE_ITEM', 'GET_MASTER_TRADE_ITEM_SUCCEED', 'GET_MASTER_TRADE_ITEM_FAIL',
  'UPDATE_REPOINF', 'UPDATE_REPOINF_SUCCEED', 'UPDATE_REPOINF_FAIL',
  'GET_WORKITEMSUG', 'GET_WORKITEMSUG_SUCCEED', 'GET_WORKITEMSUG_FAIL',
  'ADOPT_ITEMSUG', 'ADOPT_ITEMSUG_SUCCEED', 'ADOPT_ITEMSUG_FAIL',
  'TOGGLE_MATCH_RULE_MODAL', 'TOGGLE_EXPORT_DOCK_PANEL',
  'EXPORT_REPO_AUDIT', 'EXPORT_REPO_AUDIT_SUCCEED', 'EXPORT_REPO_AUDIT_FAIL',
]);

const initialState = {
  submitting: false,
  reposLoading: false,
  tradeItemsLoading: false,
  listFilter: {
    status: 'master',
    search: undefined,
    sortField: '',
    sortOrder: '',
    /*
    modifyDates: {
      start: new Date().setDate(1),
      end: new Date()
    },
    */
  },
  tradeItemlist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  visibleAddModal: false,
  repos: [],
  repoUsers: [],
  itemData: {},
  itemHistory: [],
  bodyItem: {},
  repo: { id: null },
  repoLoading: false,
  linkSlaveModal: {
    visible: false,
    masterRepo: {},
    slaves: [],
  },
  workspaceStat: {
    task: {}, emerge: {}, conflict: {}, invalid: {}, pending: {},
  },
  wsStatReload: false,
  workspaceLoading: false,
  workspaceTaskList: [],
  workspaceTask: { id: '' },
  taskEmergeList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  taskConflictList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  workspaceItemList: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  workspaceListFilter: { repoId: null, status: '', name: '' },
  workspaceItem: {},
  workItemSuggestions: [],
  applyCertsModal: {
    visible: false,
    data: {},
  },
  itemDiffModal: {
    visible: false,
    master: {},
    data: {},
  },
  confirmChangesModal: {
    visible: false,
    data: {},
  },
  confirmForkModal: {
    visible: false,
    data: {},
  },
  formChanged: false,
  itemMasterChanges: [],
  matchRuleModal: {
    visible: false,
    repo: {},
  },
  exportAuditPanelVisible: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_REPOS:
      return { ...state, reposLoading: true };
    case actionTypes.LOAD_REPOS_SUCCEED:
      return {
        ...state, repos: action.result.data, reposLoading: false,
      };
    case actionTypes.LOAD_REPOS_FAIL:
      return { ...state, reposLoading: false };
    case actionTypes.LOAD_REPO:
      return { ...state, repoLoading: true };
    case actionTypes.LOAD_REPO_SUCCEED:
      return { ...state, repo: action.result.data, repoLoading: false };
    case actionTypes.LOAD_REPO_FAIL:
      return { ...state, repoLoading: false };
    case actionTypes.OPEN_ADD_MODEL:
      return { ...state, visibleAddModal: true };
    case actionTypes.CLOSE_ADD_MODEL:
      return { ...state, visibleAddModal: false };
    case actionTypes.LOAD_TRADE_ITEMS:
      return {
        ...state,
        tradeItemsLoading: true,
        itemData: initialState.itemData,
        listFilter: JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_TRADE_ITEMS_SUCCEED:
      return { ...state, tradeItemlist: action.result.data, tradeItemsLoading: false };
    case actionTypes.LOAD_TRADE_ITEMS_FAIL:
      return { ...state, tradeItemsLoading: false };
    case actionTypes.LOAD_TRDIHISTORY_SUCCEED:
      return { ...state, itemHistory: action.result.data };
    case actionTypes.LOAD_ITEM_EDIT_SUCCEED:
      return { ...state, itemData: action.result.data.tradeitem };
    case actionTypes.LOAD_BODY_ITEM_SUCCEED:
      return { ...state, bodyItem: action.result.data };
    case actionTypes.LOAD_REPO_USERS_SUCCEED:
      return { ...state, repoUsers: action.result.data };
    case actionTypes.SHOW_LINKSLAVE:
      return { ...state, linkSlaveModal: { ...state.linkSlaveModal, ...action.data } };
    case actionTypes.LOAD_OWNSLAVES_SUCCEED:
      return { ...state, linkSlaveModal: { ...state.linkSlaveModal, slaves: action.result.data } };
    case actionTypes.SWITCH_REPOMD_SUCCEED:
      return {
        ...state,
        repos: state.repos.map(rep =>
          (rep.id === action.data.repoId ? { ...rep, mode: action.result.data } : rep)),
      };
    case actionTypes.SWITCH_REPVK_SUCCEED:
      return {
        ...state,
        repos: state.repos.map(rep =>
          (rep.id === action.data.repoId ? { ...rep, keep_version: action.data.keep } : rep)),
      };
    case actionTypes.LOAD_WSSTAT_SUCCEED:
      return { ...state, workspaceStat: action.result.data, wsStatReload: false };
    case actionTypes.LOAD_WSTASKLIST:
    case actionTypes.LOAD_WSTASK:
    case actionTypes.DEL_WSTASK:
      return { ...state, workspaceLoading: true };
    case actionTypes.LOAD_WSTASKLIST_FAIL:
    case actionTypes.LOAD_WSTASK_FAIL:
    case actionTypes.DEL_WSTASK_FAIL:
      return { ...state, workspaceLoading: false };
    case actionTypes.LOAD_WSLITEMS:
      return {
        ...state,
        workspaceLoading: true,
        workspaceListFilter: action.params.filter && JSON.parse(action.params.filter),
      };
    case actionTypes.LOAD_WSLITEMS_FAIL:
      return { ...state, workspaceLoading: false };
    case actionTypes.LOAD_WSLITEMS_SUCCEED:
      return { ...state, workspaceLoading: false, workspaceItemList: action.result.data };
    case actionTypes.LOAD_WSTASKLIST_SUCCEED:
      return { ...state, workspaceLoading: false, workspaceTaskList: action.result.data };
    case actionTypes.LOAD_WSTASK_SUCCEED:
      return { ...state, workspaceLoading: false, workspaceTask: action.result.data };
    case actionTypes.LOAD_WSITEM_SUCCEED:
      return { ...state, workspaceItem: action.result.data };
    case actionTypes.DEL_WSTASK_SUCCEED: {
      const workspaceStat = { ...state.workspaceStat };
      workspaceStat.task.count -= 1;
      return { ...state, workspaceLoading: false, workspaceStat };
    }
    case actionTypes.SAVE_WSITEM:
    case actionTypes.REPLICA_MASTERSLAVE:
    case actionTypes.SAVE_REPOITM:
    case actionTypes.SAVE_REPOFKITM:
    case actionTypes.DEL_WSLITEMS:
    case actionTypes.SUBMIT_AUDIT:
    case actionTypes.AUDIT_ITEMS:
      return { ...state, submitting: true };
    case actionTypes.SAVE_WSITEM_SUCCEED:
    case actionTypes.SAVE_WSITEM_FAIL:
    case actionTypes.REPLICA_MASTERSLAVE_SUCCEED:
    case actionTypes.REPLICA_MASTERSLAVE_FAIL:
    case actionTypes.SAVE_REPOITM_SUCCEED:
    case actionTypes.SAVE_REPOITM_FAIL:
    case actionTypes.SAVE_REPOFKITM_SUCCEED:
    case actionTypes.SAVE_REPOFKITM_FAIL:
    case actionTypes.DEL_WSLITEMS_FAIL:
    case actionTypes.SUBMIT_AUDIT_FAIL:
    case actionTypes.AUDIT_ITEMS_FAIL:
      return { ...state, submitting: false };
    case actionTypes.LOAD_TEITEMS_SUCCEED:
      return { ...state, taskEmergeList: action.result.data };
    case actionTypes.LOAD_TCITEMS_SUCCEED:
      return { ...state, taskConflictList: action.result.data };
    case actionTypes.DEL_WSLITEMS_SUCCEED: {
      const { totalCount, pageSize, current } = state.workspaceItemList;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, action.data.itemIds.length);
      return {
        ...state,
        workspaceItemList: { ...state.workspaceItemList, current: currentPage },
        submitting: false,
        wsStatReload: true,
      };
    }
    case actionTypes.SUBMIT_AUDIT_SUCCEED:
    case actionTypes.AUDIT_ITEMS_SUCCEED:
      return { ...state, submitting: false, wsStatReload: true };
    case actionTypes.TOGGLE_APPLY_CERTS_MODAL:
      return {
        ...state,
        applyCertsModal: {
          ...state.applyCertsModal,
          visible: action.visible,
          data: action.data,
        },
      };
    case actionTypes.TOGGLE_ITEM_DIFF_MODAL:
      return {
        ...state,
        itemDiffModal: {
          ...state.itemDiffModal,
          visible: action.visible,
          master: action.master,
          data: action.data,
        },
      };
    case actionTypes.TOGGLE_CONFIRM_CHANGES_MODAL:
      return {
        ...state,
        confirmChangesModal: {
          ...state.confirmChangesModal,
          visible: action.visible,
          data: action.data,
        },
      };
    case actionTypes.TOGGLE_CONFIRM_FORK_MODAL:
      return {
        ...state,
        confirmForkModal: {
          ...state.confirmForkModal,
          visible: action.visible,
          data: action.data,
        },
      };
    case actionTypes.CHANGE_ITEM_MASTER:
      return {
        ...state,
        itemMasterChanges: action.changes,
      };
    case actionTypes.NOTIFY_FORM_CHANGED:
      return {
        ...state,
        formChanged: action.changed,
      };
    case actionTypes.UPDATE_REPOINF_SUCCEED: {
      const newState = { ...state };
      if (newState.repo && newState.repo.id === action.data.repoId) {
        newState.repo = { ...state.repo, ...action.data.repoInfo };
      }
      newState.repos = state.repos.map(rep => (rep.id === action.data.repoId ?
        { ...rep, ...action.data.repoInfo } : rep));
      return newState;
    }
    case actionTypes.GET_WORKITEMSUG_SUCCEED:
      return { ...state, workItemSuggestions: action.result.data };
    case actionTypes.ADOPT_ITEMSUG_SUCCEED: {
      const suggItem = action.result.data;
      const workspaceItem = { ...state.workspaceItem };
      Object.keys(suggItem).forEach((sugKey) => {
        if (!workspaceItem[sugKey]) {
          workspaceItem[sugKey] = suggItem[sugKey];
        }
      });
      return { ...state, workspaceItem };
    }
    case actionTypes.TOGGLE_MATCH_RULE_MODAL:
      return {
        ...state,
        matchRuleModal: {
          ...state.matchRuleModal,
          ...action.data,
        },
      };
    case actionTypes.TOGGLE_EXPORT_DOCK_PANEL:
      return { ...state, exportAuditPanelVisible: action.data.visible };
    case actionTypes.EXPORT_REPO_AUDIT:
      return { ...state, submitting: true };
    case actionTypes.EXPORT_REPO_AUDIT_SUCCEED:
    case actionTypes.EXPORT_REPO_AUDIT_FAIL:
      return { ...state, submitting: false };
    default:
      return state;
  }
}

export function loadRepos() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REPOS,
        actionTypes.LOAD_REPOS_SUCCEED,
        actionTypes.LOAD_REPOS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repos/load',
      method: 'get',
    },
  };
}

export function loadRepo(repoId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REPO,
        actionTypes.LOAD_REPO_SUCCEED,
        actionTypes.LOAD_REPO_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/load',
      method: 'get',
      params: { repoId },
    },
  };
}

export function openAddModal() {
  return {
    type: actionTypes.OPEN_ADD_MODEL,
  };
}

export function closeAddModal() {
  return {
    type: actionTypes.CLOSE_ADD_MODEL,
  };
}

export function createRepo(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_REPO,
        actionTypes.CREATE_REPO_SUCCEED,
        actionTypes.CREATE_REPO_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/create',
      method: 'post',
      data: datas,
    },
  };
}

export function deleteRepo(repoId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_REPO,
        actionTypes.DELETE_REPO_SUCCEED,
        actionTypes.DELETE_REPO_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/delete',
      method: 'post',
      data: { repoId },
    },
  };
}

export function loadTradeItems(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRADE_ITEMS,
        actionTypes.LOAD_TRADE_ITEMS_SUCCEED,
        actionTypes.LOAD_TRADE_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/items/load',
      method: 'get',
      params,
    },
  };
}

export function deleteItems(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ITEMS,
        actionTypes.DELETE_ITEMS_SUCCEED,
        actionTypes.DELETE_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/delete/items',
      method: 'post',
      data,
    },
  };
}

export function loadTradeItem(itemId, action) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ITEM_EDIT,
        actionTypes.LOAD_ITEM_EDIT_SUCCEED,
        actionTypes.LOAD_ITEM_EDIT_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/editItem/load',
      method: 'get',
      params: { itemId, action },
    },
  };
}

export function itemEditedSave(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ITEM_EDITED_SAVE,
        actionTypes.ITEM_EDITED_SAVE_SUCCEED,
        actionTypes.ITEM_EDITED_SAVE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/edited/save',
      method: 'post',
      data: datas,
    },
  };
}

export function createTradeItem(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_ITEM,
        actionTypes.CREATE_ITEM_SUCCEED,
        actionTypes.CREATE_ITEM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/create',
      method: 'post',
      data: datas,
    },
  };
}

export function loadTradeItemHistory(repoId, copProdNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TRDIHISTORY,
        actionTypes.LOAD_TRDIHISTORY_SUCCEED,
        actionTypes.LOAD_TRDIHISTORY_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/classify/history',
      method: 'get',
      params: { repoId, copProdNo },
    },
  };
}

export function getItemForBody(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BODY_ITEM,
        actionTypes.LOAD_BODY_ITEM_SUCCEED,
        actionTypes.LOAD_BODY_ITEM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/load/item/forBody',
      method: 'get',
      params,
    },
  };
}

export function getHscodeForBody(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BODY_HSCODE,
        actionTypes.LOAD_BODY_HSCODE_SUCCEED,
        actionTypes.LOAD_BODY_HSCODE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/load/hscode/forBody',
      method: 'get',
      params,
    },
  };
}

export function toggleHistoryItemsDecl(repoId, itemIds, action, historyId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TOGGLE_HISTITEM,
        actionTypes.TOGGLE_HISTITEM_SUCCEED,
        actionTypes.TOGGLE_HISTITEM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/history/decl/toggle',
      method: 'post',
      data: {
        itemIds, action, repoId, historyId,
      },
    },
  };
}

export function loadRepoUsers(repoId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_REPO_USERS,
        actionTypes.LOAD_REPO_USERS_SUCCEED,
        actionTypes.LOAD_REPO_USERS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repoUsers',
      method: 'get',
      params: { repoId },
    },
  };
}

export function addRepoUser(repoId, partnerTenantId, name, permission) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_REPO_USER,
        actionTypes.ADD_REPO_USER_SUCCEED,
        actionTypes.ADD_REPO_USER_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repoUser/add',
      method: 'post',
      data: {
        repoId, partnerTenantId, name, permission,
      },
    },
  };
}

export function deleteRepoUser(repoUserId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_REPO_USER,
        actionTypes.DELETE_REPO_USER_SUCCEED,
        actionTypes.DELETE_REPO_USER_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repoUser/delete',
      method: 'post',
      data: { repoUserId },
    },
  };
}

export function comparedCancel(datas) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COMPARED_CANCEL,
        actionTypes.COMPARED_CANCEL_SUCCEED,
        actionTypes.COMPARED_CANCEL_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/compared/datas/cancel',
      method: 'post',
      data: datas,
    },
  };
}

export function showLinkSlaveModal({ visible, masterRepo, slaves }) {
  return {
    type: actionTypes.SHOW_LINKSLAVE,
    data: { visible, masterRepo, slaves },
  };
}

export function getLinkedSlaves(masterRepo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_LINKEDSLAVES,
        actionTypes.LOAD_LINKEDSLAVES_SUCCEED,
        actionTypes.LOAD_LINKEDSLAVES_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/linked/slaves',
      method: 'get',
      params: { masterRepo },
    },
  };
}

export function getUnlinkSlavesByOwner(ownerTenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_OWNSLAVES,
        actionTypes.LOAD_OWNSLAVES_SUCCEED,
        actionTypes.LOAD_OWNSLAVES_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/unlinked/slaves',
      method: 'get',
      params: { ownerTenantId },
    },
  };
}

export function linkMasterSlaves(masterRepo, slaveRepos) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LINK_MASTERSLAVE,
        actionTypes.LINK_MASTERSLAVE_SUCCEED,
        actionTypes.LINK_MASTERSLAVE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/link/slave',
      method: 'post',
      data: { masterRepo, slaveRepos },
    },
  };
}

export function unlinkMasterSlave(slaveRepo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UNLINK_MASTERSLAVE,
        actionTypes.UNLINK_MASTERSLAVE_SUCCEED,
        actionTypes.UNLINK_MASTERSLAVE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/unlink/slave',
      method: 'post',
      data: { slaveRepo },
    },
  };
}

export function replicaMasterSlave(replicaInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REPLICA_MASTERSLAVE,
        actionTypes.REPLICA_MASTERSLAVE_SUCCEED,
        actionTypes.REPLICA_MASTERSLAVE_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/masterslave/replica',
      method: 'post',
      data: replicaInfo,
    },
  };
}

export function saveRepoItem(item) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_REPOITM,
        actionTypes.SAVE_REPOITM_SUCCEED,
        actionTypes.SAVE_REPOITM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/itemsave',
      method: 'post',
      data: item,
    },
  };
}

export function saveRepoForkItem(item) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_REPOFKITM,
        actionTypes.SAVE_REPOFKITM_SUCCEED,
        actionTypes.SAVE_REPOFKITM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/fork/itemsave',
      method: 'post',
      data: item,
    },
  };
}

export function switchRepoMode(repoId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SWITCH_REPOMD,
        actionTypes.SWITCH_REPOMD_SUCCEED,
        actionTypes.SWITCH_REPOMD_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/switch/repomode',
      method: 'post',
      data: { repoId },
    },
  };
}

export function switchRepoVersionKeep(repoId, keep) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SWITCH_REPVK,
        actionTypes.SWITCH_REPVK_SUCCEED,
        actionTypes.SWITCH_REPVK_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/switch/versionkeep',
      method: 'post',
      data: { repoId, keep },
    },
  };
}

export function loadWorkspaceStat() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WSSTAT,
        actionTypes.LOAD_WSSTAT_SUCCEED,
        actionTypes.LOAD_WSSTAT_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/stat',
      method: 'get',
    },
  };
}

export function loadWorkspaceTasks(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WSTASKLIST,
        actionTypes.LOAD_WSTASKLIST_SUCCEED,
        actionTypes.LOAD_WSTASKLIST_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/tasks',
      method: 'get',
      params,
    },
  };
}

export function loadWorkspaceTask(taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WSTASK,
        actionTypes.LOAD_WSTASK_SUCCEED,
        actionTypes.LOAD_WSTASK_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/task',
      method: 'get',
      params: { taskId },
    },
  };
}

export function delWorkspaceTask(taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_WSTASK,
        actionTypes.DEL_WSTASK_SUCCEED,
        actionTypes.DEL_WSTASK_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/deltask',
      method: 'post',
      data: { taskId },
    },
  };
}

export function loadTaskConflictItems(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TCITEMS,
        actionTypes.LOAD_TCITEMS_SUCCEED,
        actionTypes.LOAD_TCITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/items',
      method: 'get',
      params,
    },
  };
}

export function loadTaskEmergeItems(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_TEITEMS,
        actionTypes.LOAD_TEITEMS_SUCCEED,
        actionTypes.LOAD_TEITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/items',
      method: 'get',
      params,
    },
  };
}

export function loadWorkspaceItems(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WSLITEMS,
        actionTypes.LOAD_WSLITEMS_SUCCEED,
        actionTypes.LOAD_WSLITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/items',
      method: 'get',
      params,
    },
  };
}

export function loadWorkspaceItem(itemId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WSITEM,
        actionTypes.LOAD_WSITEM_SUCCEED,
        actionTypes.LOAD_WSITEM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/item',
      method: 'get',
      params: { itemId },
    },
  };
}

export function saveWorkspaceItem(item) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_WSITEM,
        actionTypes.SAVE_WSITEM_SUCCEED,
        actionTypes.SAVE_WSITEM_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/itemsave',
      method: 'post',
      data: { item },
    },
  };
}

export function delWorkspaceItem(itemIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DEL_WSLITEMS,
        actionTypes.DEL_WSLITEMS_SUCCEED,
        actionTypes.DEL_WSLITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/delitem',
      method: 'post',
      data: { itemIds },
    },
  };
}

export function resolveWorkspaceItem(itemIds, action) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.RESOLV_WSLITEMS,
        actionTypes.RESOLV_WSLITEMS_SUCCEED,
        actionTypes.RESOLV_WSLITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/conflict/resolve',
      method: 'post',
      data: { itemIds, action },
    },
  };
}

export function submitAudit(auditAction) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_AUDIT,
        actionTypes.SUBMIT_AUDIT_SUCCEED,
        actionTypes.SUBMIT_AUDIT_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/submit/audit',
      method: 'post',
      data: { auditAction },
    },
  };
}

export function auditItems(itemIds, auditMethod) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.AUDIT_ITEMS,
        actionTypes.AUDIT_ITEMS_SUCCEED,
        actionTypes.AUDIT_ITEMS_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workspace/audit',
      method: 'post',
      data: { itemIds, auditMethod },
    },
  };
}

export function toggleApplyCertsModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_APPLY_CERTS_MODAL,
    visible,
    data,
  };
}

export function toggleItemDiffModal(visible, master = {}, data = {}) {
  return {
    type: actionTypes.TOGGLE_ITEM_DIFF_MODAL,
    visible,
    master,
    data,
  };
}

export function toggleConfirmChangesModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_CONFIRM_CHANGES_MODAL,
    visible,
    data,
  };
}

export function toggleConfirmForkModal(visible, data = {}) {
  return {
    type: actionTypes.TOGGLE_CONFIRM_FORK_MODAL,
    visible,
    data,
  };
}

export function changeItemMaster(changes) {
  return {
    type: actionTypes.CHANGE_ITEM_MASTER,
    changes,
  };
}

export function notifyFormChanged(changed) {
  return {
    type: actionTypes.NOTIFY_FORM_CHANGED,
    changed,
  };
}

export function updateItemApplCert(cert, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ITEM_APPL_CERT,
        actionTypes.UPDATE_ITEM_APPL_CERT_SUCCEED,
        actionTypes.UPDATE_ITEM_APPL_CERT_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/appl/cert/update',
      method: 'post',
      data: { cert: JSON.stringify(cert), id },
    },
  };
}

export function getMasterTradeItem(repoId, copProdNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_MASTER_TRADE_ITEM,
        actionTypes.GET_MASTER_TRADE_ITEM_SUCCEED,
        actionTypes.GET_MASTER_TRADE_ITEM_FAIL,
      ],
      endpoint: 'v1/cms/master/tradeitem/get',
      method: 'get',
      params: { repoId, copProdNo },
    },
  };
}

export function updateRepoInfo(repoId, repoInfoObj) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_REPOINF,
        actionTypes.UPDATE_REPOINF_SUCCEED,
        actionTypes.UPDATE_REPOINF_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repo/update/info',
      method: 'post',
      data: { repoInfo: repoInfoObj, repoId },
    },
  };
}

export function loadWorkItemSuggestions(workItemId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_WORKITEMSUG,
        actionTypes.GET_WORKITEMSUG_SUCCEED,
        actionTypes.GET_WORKITEMSUG_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workitem/suggestions',
      method: 'get',
      params: { workItemId },
    },
  };
}

export function adoptTradeItemSuggest(suggestId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADOPT_ITEMSUG,
        actionTypes.ADOPT_ITEMSUG_SUCCEED,
        actionTypes.ADOPT_ITEMSUG_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/workitem/adopt/suggestion',
      method: 'post',
      data: { suggestId },
    },
  };
}

export function toggleMatchRuleModal(visible, repo = {}) {
  return {
    type: actionTypes.TOGGLE_MATCH_RULE_MODAL,
    data: { visible, repo },
  };
}

export function toggleRepoAuditPanel(visible) {
  return {
    type: actionTypes.TOGGLE_EXPORT_DOCK_PANEL,
    data: { visible },
  };
}

export function exportRepoAudit(startDate, endDate, repoIds) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EXPORT_REPO_AUDIT,
        actionTypes.EXPORT_REPO_AUDIT_SUCCEED,
        actionTypes.EXPORT_REPO_AUDIT_FAIL,
      ],
      endpoint: 'v1/cms/tradeitem/repos/audit/export',
      method: 'post',
      data: { startDate, endDate, repoIds },
    },
  };
}
