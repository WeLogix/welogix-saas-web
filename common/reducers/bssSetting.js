import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/bss/settings/', [
  'VISIBLE_NEW_GROUP_MODAL',
  'LOAD_FEE_GROUPS', 'LOAD_FEE_GROUPS_SUCCEED', 'LOAD_FEE_GROUPS_FAIL',
  'ADD_FEE_GROUP', 'ADD_FEE_GROUP_SUCCEED', 'ADD_FEE_GROUP_FAIL',
  'DELETE_FEE_GROUP', 'DELETE_FEE_GROUP_SUCCEED', 'DELETE_FEE_GROUP_FAIL',
  'ALTER_FEE_GROUP_NAME', 'ALTER_FEE_GROUP_NAME_SUCCEED', 'ALTER_FEE_GROUP_NAME_FAIL',
  'VISIBLE_NEW_ELEMENT_MODAL',
  'LOAD_FEE_ELEMENTS', 'LOAD_FEE_ELEMENTS_SUCCEED', 'LOAD_FEE_ELEMENTS_FAIL',
  'LOAD_ALL_FEE_GROUPS', 'LOAD_ALL_FEE_GROUPS_SUCCEED', 'LOAD_ALL_FEE_GROUPS_FAIL',
  'LOAD_PARENT_FEE_ELEMENTS', 'LOAD_PARENT_FEE_ELEMENTS_SUCCEED', 'LOAD_PARENT_FEE_ELEMENTS_FAIL',
  'LOAD_ALL_FEE_ELEMENTS', 'LOAD_ALL_FEE_ELEMENTS_SUCCEED', 'LOAD_ALL_FEE_ELEMENTS_FAIL',
  'ADD_FEE_ELEMENT', 'ADD_FEE_ELEMENT_SUCCEED', 'ADD_FEE_ELEMENT_FAIL',
  'ALTER_FEE_ELEMENT', 'ALTER_FEE_ELEMENT_SUCCEED', 'ALTER_FEE_ELEMENT_FAIL',
  'DELETE_FEE_ELEMENT', 'DELETE_FEE_ELEMENT_SUCCEED', 'DELETE_FEE_ELEMENT_FAIL',
  'VISIBLE_NEW_Rate_MODAL',
  'TOGGLE_ADD_SPECIAL_MODAL',
  'CHANGE_FEE_ELEMENT_GROUP', 'CHANGE_FEE_ELEMENT_GROUP_SUCCEED', 'CHANGE_FEE_ELEMENT_GROUP_FAIL',
  'ADD_SPECIAL', 'ADD_SPECIAL_SUCCESS', 'ADD_SPECIAL_FAIL',
  'LOAD_ACCOUNTSETS', 'LOAD_ACCOUNTSETS_SUCCESS', 'LOAD_ACCOUNTSETS_FAIL',
  'TOGGLE_ACCOUNTSET_MODAL', 'SWITCH_ACCOUNT_SET',
  'CREATE_ACCOUNTSET', 'CREATE_ACCOUNTSET_SUCCESS', 'CREATE_ACCOUNTSET_FAIL',
  'UPDATE_ACCOUNTSET', 'UPDATE_ACCOUNTSET_SUCCESS', 'UPDATE_ACCOUNTSET_FAIL',
  'TOGGLE_ACCOUNT_MODAL', 'TOGGLE_SUBJECT_MODAL',
  'LOAD_ALL_ACCOUNT_SUBJECTS', 'LOAD_ALL_ACCOUNT_SUBJECTS_SUCCESS', 'LOAD_ALL_ACCOUNT_SUBJECTS_FAIL',
  'CREATE_ACCOUNTSET_ACCOUNT', 'CREATE_ACCOUNTSET_ACCOUNT_SUCCESS', 'CREATE_ACCOUNTSET_ACCOUNT_FAIL',
  'LOAD_ACCOUNTS', 'LOAD_ACCOUNTS_SUCCESS', 'LOAD_ACCOUNTS_FAIL',
  'UPDATE_ACCOUNT', 'UPDATE_ACCOUNT_SUCCESS', 'UPDATE_ACCOUNT_FAIL',
  'DELETE_ACCOUNT', 'DELETE_ACCOUNT_SUCCESS', 'DELETE_ACCOUNT_FAIL',
  'LOAD_ACCOUNT_SUBJECTS', 'LOAD_ACCOUNT_SUBJECTS_SUCCESS', 'LOAD_ACCOUNT_SUBJECTS_FAIL',
  'CREATE_ACCOUNT_SUBJECT', 'CREATE_ACCOUNT_SUBJECT_SUCCESS', 'CREATE_ACCOUNT_SUBJECT_FAIL',
  'DELETE_ACCOUNT_SUBJECT', 'DELETE_ACCOUNT_SUBJECT_SUCCESS', 'DELETE_ACCOUNT_SUBJECT_FAIL',
  'UPDATE_ACCOUNT_SUBJECT', 'UPDATE_ACCOUNT_SUBJECT_SUCCESS', 'UPDATE_ACCOUNT_SUBJECT_FAIL',
]);

function findParentSubject(accountSubjects, parentSubjectNo) {
  const rootSubject = accountSubjects.find(sbj =>
    parentSubjectNo.indexOf(sbj.subject_no) === 0);
  let parentSubject = null;
  let subjects = [rootSubject];
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    if (subject.subject_no === parentSubjectNo) {
      parentSubject = subject;
      break;
    } else if (parentSubjectNo.indexOf(subject.subject_no) === 0) {
      subjects = subject.children;
      i = -1;
    }
  }
  return parentSubject;
}

const initialState = {
  visibleNewFeeGModal: false,
  feeGroupslist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  gplistFilter: {
    code: '',
  },
  feeElementlist: {
    totalCount: 0,
    current: 1,
    pageSize: 20,
    data: [],
  },
  ellistFilter: {
    code: '',
  },
  gpLoading: false,
  elLoading: false,
  visibleNewElementModal: {
    visible: false,
  },
  allFeeGroups: [],
  parentFeeElements: [],
  allFeeElements: [],
  expenseReloadType: '',
  addSpeModal: {
    visible: false,
    feeCodes: [],
    expenseNo: '',
    expenseType: '',
    tabName: '',
  },
  accountSets: [],
  currentAccountSet: {},
  accountSetModal: {
    visible: false,
  },
  accountModal: {
    visible: false,
    account: {},
  },
  allAccountSubjects: [],
  accountSetAccounts: [],
  accountSubjects: [],
  subjectModal: {
    visible: false,
    subject: {},
  },
  subjectLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.VISIBLE_NEW_GROUP_MODAL:
      return { ...state, visibleNewFeeGModal: action.data };
    case actionTypes.LOAD_FEE_GROUPS:
      return {
        ...state,
        gplistFilter: JSON.parse(action.params.filter),
        gpLoading: true,
      };
    case actionTypes.LOAD_FEE_GROUPS_SUCCEED:
      return { ...state, gpLoading: false, feeGroupslist: action.result.data };
    case actionTypes.LOAD_FEE_ELEMENTS:
      return {
        ...state,
        ellistFilter: JSON.parse(action.params.filter),
        elLoading: true,
      };
    case actionTypes.LOAD_FEE_ELEMENTS_SUCCEED:
      return { ...state, elLoading: false, feeElementlist: action.result.data };
    case actionTypes.LOAD_ALL_FEE_GROUPS_SUCCEED:
      return { ...state, allFeeGroups: action.result.data };
    case actionTypes.ALTER_FEE_GROUP_NAME_SUCCEED:
      return {
        ...state,
        feeGroupslist: {
          ...state.feeGroupslist,
          data: state.feeGroupslist.data.map((fg) => {
            if (fg.id === action.data.id) {
              return { ...fg, fee_group_name: action.data.groupName };
            }
            return fg;
          }),
        },
      };
    case actionTypes.LOAD_PARENT_FEE_ELEMENTS_SUCCEED:
      return { ...state, parentFeeElements: action.result.data };
    case actionTypes.LOAD_ALL_FEE_ELEMENTS_SUCCEED:
      return { ...state, allFeeElements: action.result.data };
    case actionTypes.VISIBLE_NEW_ELEMENT_MODAL:
      return {
        ...state,
        visibleNewElementModal: {
          visible: action.data.visible,
          parentFeeCode: action.data.feeElemData.feeCode,
          parentFeeType: action.data.feeElemData.feeType,
          parentFeeGroup: action.data.feeElemData.feeGroup,
          parentApportionRule: action.data.feeElemData.apportionRule,
        },
      };
    case actionTypes.ADD_SPECIAL_SUCCESS:
      return { ...state, expenseReloadType: state.addSpeModal.expenseType };
    case actionTypes.TOGGLE_ADD_SPECIAL_MODAL:
      return {
        ...state,
        addSpeModal: {
          ...state.addSpeModal,
          visible: action.data.visible,
          feeCodes: action.data.feeCodes,
          expenseNo: action.data.expenseNo,
          expenseType: action.data.expenseType,
          tabName: action.data.tabName,
        },
      };
    case actionTypes.TOGGLE_ACCOUNTSET_MODAL:
      return { ...state, accountSetModal: { visible: action.data.visible } };
    case actionTypes.LOAD_ACCOUNTSETS_SUCCESS:
      return {
        ...state,
        accountSets: action.result.data,
        currentAccountSet: action.result.data[0] || {},
      };
    case actionTypes.CREATE_ACCOUNTSET_SUCCESS:
      return {
        ...state,
        currentAccountSet: action.result.data,
        accountSets: [...state.accountSets, action.result.data],
      };
    case actionTypes.UPDATE_ACCOUNTSET_SUCCESS: {
      const accountSets = [...state.accountSets];
      const index = accountSets.findIndex(set => set.id === action.data.id);
      accountSets[index] = { ...state.accountSets[index], ...action.data.data };
      return {
        ...state,
        accountSets,
        currentAccountSet: { ...state.currentAccountSet, ...action.data.data },
      };
    }
    case actionTypes.SWITCH_ACCOUNT_SET:
      return {
        ...state,
        currentAccountSet: state.accountSets.filter(set => set.id === action.data.id)[0] || {},
      };
    case actionTypes.TOGGLE_ACCOUNT_MODAL:
      return {
        ...state,
        accountModal: { visible: action.data.visible, account: action.data.account },
      };
    case actionTypes.LOAD_ALL_ACCOUNT_SUBJECTS_SUCCESS:
      return { ...state, allAccountSubjects: action.result.data };
    case actionTypes.CREATE_ACCOUNTSET_ACCOUNT_SUCCESS:
      return {
        ...state,
        accountSetAccounts:
        [...state.accountSetAccounts, { ...action.data.data, id: action.result.data }],
      };
    case actionTypes.LOAD_ACCOUNTS_SUCCESS:
      return { ...state, accountSetAccounts: action.result.data };
    case actionTypes.UPDATE_ACCOUNT_SUCCESS: {
      const accountSetAccounts = [...state.accountSetAccounts];
      const index = accountSetAccounts.findIndex(item => item.id === action.data.id);
      accountSetAccounts[index] = { ...accountSetAccounts[index], ...action.data.data };
      return { ...state, accountSetAccounts };
    }
    case actionTypes.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        accountSetAccounts:
        [...state.accountSetAccounts].filter(item => item.id !== action.data.id),
      };
    case actionTypes.LOAD_ACCOUNT_SUBJECTS:
      return { ...state, subjectLoading: true };
    case actionTypes.LOAD_ACCOUNT_SUBJECTS_SUCCESS:
      return { ...state, accountSubjects: action.result.data, subjectLoading: false };
    case actionTypes.LOAD_ACCOUNT_SUBJECTS_FAIL:
      return { ...state, subjectLoading: false };
    case actionTypes.TOGGLE_SUBJECT_MODAL:
      return {
        ...state,
        subjectModal: {
          visible: action.data.visible,
          subject: action.data.subject,
        },
      };
    case actionTypes.CREATE_ACCOUNT_SUBJECT_SUCCESS: {
      const accountSubjects = [...state.accountSubjects];
      const result = action.result.data;
      const parentSubject = findParentSubject(accountSubjects, result.parent_subject_no);
      if (parentSubject.children) {
        parentSubject.children.push(result);
      } else {
        parentSubject.children = [result];
      }
      return { ...state, accountSubjects };
    }
    case actionTypes.DELETE_ACCOUNT_SUBJECT_SUCCESS: {
      const accountSubjects = [...state.accountSubjects];
      const { parentSubjectNo } = action.data;
      const parentSubject = findParentSubject(accountSubjects, parentSubjectNo);
      const index = parentSubject.children.findIndex(sbj => sbj.subject_no === parentSubjectNo);
      parentSubject.children.splice(index, 1);
      if (parentSubject.children.length === 0) {
        parentSubject.children = undefined;
      }
      return { ...state, accountSubjects };
    }
    case actionTypes.UPDATE_ACCOUNT_SUBJECT_SUCCESS: {
      const accountSubjects = [...state.accountSubjects];
      if (!action.data.data.parent_subject_no) {
        const subject = accountSubjects.find(sbj => sbj.id === action.data.subjectId);
        subject.status = action.data.data.status;
      } else {
        const parentSubject = findParentSubject(
          accountSubjects,
          action.data.data.parent_subject_no
        );
        const index = parentSubject.children.findIndex(sbj =>
          sbj.id === action.data.subjectId);
        parentSubject.children[index] = { ...parentSubject.children[index], ...action.data.data };
      }
      return { ...state, accountSubjects };
    }
    default:
      return state;
  }
}

export function toggleNewFeeGroupModal(visible) {
  return {
    type: actionTypes.VISIBLE_NEW_GROUP_MODAL,
    data: visible,
  };
}

export function loadFeeGroups(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FEE_GROUPS,
        actionTypes.LOAD_FEE_GROUPS_SUCCEED,
        actionTypes.LOAD_FEE_GROUPS_FAIL,
      ],
      endpoint: 'v1/bss/fee/groups/load',
      method: 'get',
      params,
    },
  };
}

export function addFeeGroup(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_FEE_GROUP,
        actionTypes.ADD_FEE_GROUP_SUCCEED,
        actionTypes.ADD_FEE_GROUP_FAIL,
      ],
      endpoint: 'v1/bss/fee/group/add',
      method: 'post',
      data,
    },
  };
}

export function deleteFeeGroup(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_FEE_GROUP,
        actionTypes.DELETE_FEE_GROUP_SUCCEED,
        actionTypes.DELETE_FEE_GROUP_FAIL,
      ],
      endpoint: 'v1/bss/fee/group/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function alterFeeGroupName(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ALTER_FEE_GROUP_NAME,
        actionTypes.ALTER_FEE_GROUP_NAME_SUCCEED,
        actionTypes.ALTER_FEE_GROUP_NAME_FAIL,
      ],
      endpoint: 'v1/bss/fee/group/name/alter',
      method: 'post',
      data,
    },
  };
}

export function toggleNewFeeElementModal({ visible, feeElemData = {} }) {
  return {
    type: actionTypes.VISIBLE_NEW_ELEMENT_MODAL,
    data: {
      visible, feeElemData,
    },
  };
}

export function loadAllFeeGroups() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALL_FEE_GROUPS,
        actionTypes.LOAD_ALL_FEE_GROUPS_SUCCEED,
        actionTypes.LOAD_ALL_FEE_GROUPS_FAIL,
      ],
      endpoint: 'v1/bss/all/fee/groups/load',
      method: 'get',
    },
  };
}

export function loadFeeElements(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FEE_ELEMENTS,
        actionTypes.LOAD_FEE_ELEMENTS_SUCCEED,
        actionTypes.LOAD_FEE_ELEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/fee/elements/load',
      method: 'get',
      params,
    },
  };
}

export function loadParentFeeElements() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_PARENT_FEE_ELEMENTS,
        actionTypes.LOAD_PARENT_FEE_ELEMENTS_SUCCEED,
        actionTypes.LOAD_PARENT_FEE_ELEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/parent/fee/elements/load',
      method: 'get',
    },
  };
}

export function loadAllFeeElements() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALL_FEE_ELEMENTS,
        actionTypes.LOAD_ALL_FEE_ELEMENTS_SUCCEED,
        actionTypes.LOAD_ALL_FEE_ELEMENTS_FAIL,
      ],
      endpoint: 'v1/bss/all/fee/elements/load',
      method: 'get',
    },
  };
}

export function addFeeElement(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_FEE_ELEMENT,
        actionTypes.ADD_FEE_ELEMENT_SUCCEED,
        actionTypes.ADD_FEE_ELEMENT_FAIL,
      ],
      endpoint: 'v1/bss/fee/element/add',
      method: 'post',
      data,
    },
  };
}

export function alterFeeElement(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ALTER_FEE_ELEMENT,
        actionTypes.ALTER_FEE_ELEMENT_SUCCEED,
        actionTypes.ALTER_FEE_ELEMENT_FAIL,
      ],
      endpoint: 'v1/bss/fee/element/alter',
      method: 'post',
      data,
    },
  };
}

export function deleteFeeElement(code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_FEE_ELEMENT,
        actionTypes.DELETE_FEE_ELEMENT_SUCCEED,
        actionTypes.DELETE_FEE_ELEMENT_FAIL,
      ],
      endpoint: 'v1/bss/fee/element/delete',
      method: 'post',
      data: { code },
    },
  };
}

export function changeFeeElementGroup(feeCode, feeGroup) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHANGE_FEE_ELEMENT_GROUP,
        actionTypes.CHANGE_FEE_ELEMENT_GROUP_SUCCEED,
        actionTypes.CHANGE_FEE_ELEMENT_GROUP_FAIL,
      ],
      endpoint: 'v1/bss/fee/element/group/change',
      method: 'post',
      data: { feeCode, feeGroup },
    },
  };
}

export function toggleAddSpecialModal(visible, {
  feeCodes = [], tabName, expenseNo = '', expenseType = '',
}) {
  return {
    type: actionTypes.TOGGLE_ADD_SPECIAL_MODAL,
    data: {
      visible, feeCodes, expenseNo, expenseType, tabName,
    },
  };
}

export function addDelegationSpecialFee(data, expenseNo, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SPECIAL,
        actionTypes.ADD_SPECIAL_SUCCESS,
        actionTypes.ADD_SPECIAL_FAIL,
      ],
      endpoint: 'v1/cms/expense/special/add',
      method: 'post',
      data: { data, expenseNo, contentLog },
    },
  };
}

export function addFreightSpecialFee(data, expenseNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SPECIAL,
        actionTypes.ADD_SPECIAL_SUCCESS,
        actionTypes.ADD_SPECIAL_FAIL,
      ],
      endpoint: 'v1/tms/expense/special/add',
      method: 'post',
      data: { data, expenseNo },
    },
  };
}

export function toggleAccountSetModal(visible) {
  return {
    type: actionTypes.TOGGLE_ACCOUNTSET_MODAL,
    data: { visible },
  };
}

export function createAccountSet(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_ACCOUNTSET,
        actionTypes.CREATE_ACCOUNTSET_SUCCESS,
        actionTypes.CREATE_ACCOUNTSET_FAIL,
      ],
      endpoint: 'v1/bss/setting/newaccountset',
      method: 'post',
      data,
    },
  };
}

export function loadAccountSets() {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ACCOUNTSETS,
        actionTypes.LOAD_ACCOUNTSETS_SUCCESS,
        actionTypes.LOAD_ACCOUNTSETS_FAIL,
      ],
      endpoint: 'v1/bss/context/accountsets',
      method: 'get',
    },
  };
}

export function updateAccountSet(data, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ACCOUNTSET,
        actionTypes.UPDATE_ACCOUNTSET_SUCCESS,
        actionTypes.UPDATE_ACCOUNTSET_FAIL,
      ],
      endpoint: 'v1/bss/setting/updateaccountset',
      method: 'post',
      data: { data, id },
    },
  };
}

export function switchAccountSet(id) {
  return {
    type: actionTypes.SWITCH_ACCOUNT_SET,
    data: { id },
  };
}

export function toggleAccountModal(visible, account = {}) {
  return {
    type: actionTypes.TOGGLE_ACCOUNT_MODAL,
    data: { visible, account },
  };
}

export function loadAllAccountSubjects(accountingSetId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ALL_ACCOUNT_SUBJECTS,
        actionTypes.LOAD_ALL_ACCOUNT_SUBJECTS_SUCCESS,
        actionTypes.LOAD_ALL_ACCOUNT_SUBJECTS_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/subjects',
      method: 'get',
      params: { accountingSetId },
    },
  };
}

export function createAccountsetAccount(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_ACCOUNTSET_ACCOUNT,
        actionTypes.CREATE_ACCOUNTSET_ACCOUNT_SUCCESS,
        actionTypes.CREATE_ACCOUNTSET_ACCOUNT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/new',
      method: 'post',
      data: { data },
    },
  };
}

export function loadAccountSetAccounts(accountingSetId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ACCOUNTS,
        actionTypes.LOAD_ACCOUNTS_SUCCESS,
        actionTypes.LOAD_ACCOUNTS_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/accountlist',
      method: 'get',
      params: { accountingSetId },
    },
  };
}

export function updateAccountsetAccount(data, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ACCOUNT,
        actionTypes.UPDATE_ACCOUNT_SUCCESS,
        actionTypes.UPDATE_ACCOUNT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/update',
      method: 'post',
      data: { data, id },
    },
  };
}

export function deleteAccountsetAccount(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ACCOUNT,
        actionTypes.DELETE_ACCOUNT_SUCCESS,
        actionTypes.DELETE_ACCOUNT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/delaccount',
      method: 'post',
      data: { id },
    },
  };
}

export function loadAccountSubjects(accountingSetId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ACCOUNT_SUBJECTS,
        actionTypes.LOAD_ACCOUNT_SUBJECTS_SUCCESS,
        actionTypes.LOAD_ACCOUNT_SUBJECTS_FAIL,
      ],
      endpoint: 'v1/bss/setting/account/subjects',
      method: 'get',
      params: { accountingSetId },
    },
  };
}

export function toggleSubjectModal(visible, subject = {}) {
  return {
    type: actionTypes.TOGGLE_SUBJECT_MODAL,
    data: { visible, subject },
  };
}

export function createAccountSubject(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_ACCOUNT_SUBJECT,
        actionTypes.CREATE_ACCOUNT_SUBJECT_SUCCESS,
        actionTypes.CREATE_ACCOUNT_SUBJECT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/newsubject',
      method: 'post',
      data: { data },
    },
  };
}

export function deleteAccountSubject(subjectId, parentSubjectNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ACCOUNT_SUBJECT,
        actionTypes.DELETE_ACCOUNT_SUBJECT_SUCCESS,
        actionTypes.DELETE_ACCOUNT_SUBJECT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/delsubject',
      method: 'post',
      data: { subjectId, parentSubjectNo },
    },
  };
}

export function updateAccountSubject(data, subjectId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ACCOUNT_SUBJECT,
        actionTypes.UPDATE_ACCOUNT_SUBJECT_SUCCESS,
        actionTypes.UPDATE_ACCOUNT_SUBJECT_FAIL,
      ],
      endpoint: 'v1/bss/setting/accountset/updatesubject',
      method: 'post',
      data: { data, subjectId },
    },
  };
}
