import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/warehouse/', [
  'ADD_WAREHOUSE', 'ADD_WAREHOUSE_SUCCEED', 'ADD_WAREHOUSE_FAIL',
  'EDIT_WAREHOUSE', 'EDIT_WAREHOUSE_SUCCEED', 'EDIT_WAREHOUSE_FAIL',
  'UPDATE_WHSE', 'UPDATE_WHSE_SUCCEED', 'UPDATE_WHSE_FAIL',
  'HIDE_WHSE_OWNERS_MODAL', 'SHOW_WHSE_OWNERS_MODAL',
  'LOAD_WHSE_OWNERS', 'LOAD_WHSE_OWNERS_SUCCEED', 'LOAD_WHSE_OWNERS_FAIL',
  'ADD_WHSE_OWNERS', 'ADD_WHSE_OWNERS_SUCCEED', 'ADD_WHSE_OWNERS_FAIL',
  'SAVE_OWNER_CODE', 'SAVE_OWNER_CODE_SUCCEED', 'SAVE_OWNER_CODE_FAIL',
  'UPDATE_WHOWNCONTROL', 'UPDATE_WHOWNCONTROL_SUCCEED', 'UPDATE_WHOWNCONTROL_FAIL',
  'SHOW_STAFF_MODAL', 'HIDE_STAFF_MODAL',
  'ADD_STAFF', 'ADD_STAFF_SUCCEED', 'ADD_STAFF_FAIL',
  'LOAD_STAFFS', 'LOAD_STAFFS_SUCCEED', 'LOAD_STAFFS_FAIL',
  'CHNAGE_STAFF_STATUS', 'CHNAGE_STAFF_STATUS_SUCCEED', 'CHNAGE_STAFF_STATUS_FAIL',
  'DELETE_STAFF', 'DELETE_STAFF_SUCCEED', 'DELETE_STAFF_FAIL',
  'ADD_RECEIVER', 'ADD_RECEIVER_SUCCEED', 'ADD_RECEIVER_FAIL',
  'LOAD_RECEIVERS', 'LOAD_RECEIVERS_SUCCEED', 'LOAD_RECEIVERS_FAIL',
  'DELETE_RECEIVER', 'DELETE_RECEIVER_SUCCEED', 'DELETE_RECEIVER_FAIL',
  'UPDATE_RECEIVER', 'UPDATE_RECEIVER_SUCCEED', 'UPDATE_RECEIVER_FAIL',
  'TOGGLE_RECEIVER_MODAL',
  'UPDATE_RECEIVER_STATUS', 'UPDATE_RECEIVER_STATUS_SUCCEED', 'UPDATE_RECEIVER_STATUS_FAIL',
  'LOAD_SUPPLIERS', 'LOAD_SUPPLIERS_SUCCEED', 'LOAD_SUPPLIERS_FAIL',
  'TOGGLE_SUPPLIER_MODAL',
  'ADD_SUPPLIER', 'ADD_SUPPLIER_SUCCEED', 'ADD_SUPPLIER_FAIL',
  'UPDATE_SUPPLIER_STATUS', 'UPDATE_SUPPLIER_STATUS_SUCCEED', 'UPDATE_SUPPLIER_STATUS_FAIL',
  'DELETE_SUPPLIER', 'DELETE_SUPPLIER_SUCCEED', 'DELETE_SUPPLIER_FAIL',
  'UPDATE_SUPPLIER', 'UPDATE_SUPPLIER_SUCCEED', 'UPDATE_SUPPLIER_FAIL',
  'LOAD_CARRIERS', 'LOAD_CARRIERS_SUCCEED', 'LOAD_CARRIERS_FAIL',
  'TOGGLE_CARRIER_MODAL',
  'ADD_CARRIER', 'ADD_CARRIER_SUCCEED', 'ADD_CARRIER_FAIL',
  'UPDATE_CARRIER_STATUS', 'UPDATE_CARRIER_STATUS_SUCCEED', 'UPDATE_CARRIER_STATUS_FAIL',
  'DELETE_CARRIER', 'DELETE_CARRIER_SUCCEED', 'DELETE_CARRIER_FAIL',
  'UPDATE_CARRIER', 'UPDATE_CARRIER_SUCCEED', 'UPDATE_CARRIER_FAIL',
  'LOAD_BROKERS', 'LOAD_BROKERS_SUCCEED', 'LOAD_BROKERS_FAIL', 'TOGGLE_BROKER_MODAL',
  'ADD_BROKER', 'ADD_BROKER_SUCCEED', 'ADD_BROKER_FAIL',
  'UPDATE_BROKER_STATUS', 'UPDATE_BROKER_STATUS_SUCCEED', 'UPDATE_BROKER_STATUS_FAIL',
  'DELETE_BROKER', 'DELETE_BROKER_SUCCEED', 'DELETE_BROKER_FAIL',
  'AUTHORIZE_BROKER', 'AUTHORIZE_BROKER_SUCCEED', 'AUTHORIZE_BROKER_FAIL',
  'LOAD_BRKP', 'LOAD_BRKP_SUCCEED', 'LOAD_BRKP_FAIL',
  'TOGGLE_REC_SHIP_DOCK', 'TOGGLE_ALLOC_SKU_RULE_PANEL',
]);

const initialState = {
  whseOwnersModal: {
    visible: false,
  },
  ownerControlModal: {
    visible: false,
    whOwnerAuth: {},
  },
  ownerPickPrintModal: {
    visible: false,
    printRule: {},
  },
  skuRuleModalVisible: false,
  skuRuleModal: {
    ownerAuthId: 0,
    sku_rule: {},
  },
  warehouseList: [],
  whseOwners: [],
  staffModal: {
    visible: false,
  },
  staffs: [],
  receivers: [],
  receiverModal: {
    visible: false,
    receiver: {},
  },
  suppliers: [],
  supplierModal: {
    visible: false,
    supplier: {},
  },
  carriers: [],
  carrierModal: {
    visible: false,
    carrier: {},
  },
  brokers: [],
  brokerModal: {
    visible: false,
    broker: {},
  },
  brokerPartners: [],
  recShipAttrsDock: {
    visible: false,
    whseCode: '',
    whOwnerAuth: {},
  },
  allocRulePane: {
    visible: false,
    ownerAllocRule: {},
    skuRule: {},
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_WHSE_OWNERS_MODAL:
      return { ...state, whseOwnersModal: { ...state.whseOwnersModal, visible: true } };
    case actionTypes.HIDE_WHSE_OWNERS_MODAL:
      return { ...state, whseOwnersModal: { ...state.whseOwnersModal, visible: false } };
    case actionTypes.LOAD_WHSE_OWNERS_SUCCEED:
      return { ...state, whseOwners: action.result.data };
    case actionTypes.SHOW_STAFF_MODAL:
      return { ...state, staffModal: { visible: true } };
    case actionTypes.HIDE_STAFF_MODAL:
      return { ...state, staffModal: { visible: false } };
    case actionTypes.LOAD_STAFFS_SUCCEED:
      return { ...state, staffs: action.result.data };
    case actionTypes.TOGGLE_RECEIVER_MODAL:
      return { ...state, receiverModal: { ...state.receiverModal, ...action.data } };
    case actionTypes.LOAD_RECEIVERS_SUCCEED:
      return { ...state, receivers: action.result.data };
    case actionTypes.LOAD_SUPPLIERS_SUCCEED:
      return { ...state, suppliers: action.result.data };
    case actionTypes.TOGGLE_SUPPLIER_MODAL:
      return { ...state, supplierModal: { ...state.supplierModal, ...action.data } };
    case actionTypes.LOAD_CARRIERS_SUCCEED:
      return { ...state, carriers: action.result.data };
    case actionTypes.TOGGLE_CARRIER_MODAL:
      return { ...state, carrierModal: { ...state.carrierModal, ...action.data } };
    case actionTypes.LOAD_BROKERS_SUCCEED:
      return { ...state, brokers: action.result.data };
    case actionTypes.TOGGLE_BROKER_MODAL:
      return { ...state, brokerModal: { ...state.brokerModal, ...action.data } };
    case actionTypes.LOAD_BRKP_SUCCEED:
      return { ...state, brokerPartners: action.result.data };
    case actionTypes.UPDATE_WHOWNCONTROL_SUCCEED:
      return {
        ...state,
        whseOwners: state.whseOwners.map((whow) => {
          if (whow.id === action.data.ownerAuthId) {
            return { ...whow, ...action.data.control };
          }
          return whow;
        }),
      };
    case actionTypes.TOGGLE_REC_SHIP_DOCK:
      return { ...state, recShipAttrsDock: action.data };
    case actionTypes.TOGGLE_ALLOC_SKU_RULE_PANEL:
      return { ...state, allocRulePane: action.data };
    default:
      return state;
  }
}

export function addWarehouse(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_WAREHOUSE,
        actionTypes.ADD_WAREHOUSE_SUCCEED,
        actionTypes.ADD_WAREHOUSE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/add',
      method: 'get',
      params,
    },
  };
}

export function editWarehouse(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_WAREHOUSE,
        actionTypes.EDIT_WAREHOUSE_SUCCEED,
        actionTypes.EDIT_WAREHOUSE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/edit',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function updateWhse(whse, whseCode, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_WHSE,
        actionTypes.UPDATE_WHSE_SUCCEED,
        actionTypes.UPDATE_WHSE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/update',
      method: 'post',
      data: { whse, whseCode, contentLog },
    },
  };
}

export function showWhseOwnersModal() {
  return {
    type: actionTypes.SHOW_WHSE_OWNERS_MODAL,
  };
}

export function hideWhseOwnersModal() {
  return {
    type: actionTypes.HIDE_WHSE_OWNERS_MODAL,
  };
}

export function loadwhseOwners(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHSE_OWNERS,
        actionTypes.LOAD_WHSE_OWNERS_SUCCEED,
        actionTypes.LOAD_WHSE_OWNERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/owners/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function addWhseOwners(data, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_WHSE_OWNERS,
        actionTypes.ADD_WHSE_OWNERS_SUCCEED,
        actionTypes.ADD_WHSE_OWNERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/owners/add',
      method: 'post',
      data: { owners: data, whseCode },
    },
  };
}

export function saveOwnerCode(ownerCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SAVE_OWNER_CODE,
        actionTypes.SAVE_OWNER_CODE_SUCCEED,
        actionTypes.SAVE_OWNER_CODE_FAIL,
      ],
      endpoint: 'v1/cwm/owner/code/save',
      method: 'post',
      data: { ownerCode },
    },
  };
}

export function updateOwnerAuth(ownerAuthId, authInfo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_OWA,
        actionTypes.UPDATE_OWA_SUCCEED,
        actionTypes.UPDATE_OWA_FAIL,
      ],
      endpoint: 'v1/cwm/whse/owner/updateauth',
      method: 'post',
      data: { ownerAuthId, authInfo },
    },
  };
}

export function updateWhOwnerControl(ownerAuthId, control, whseCode, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_WHOWNCONTROL,
        actionTypes.UPDATE_WHOWNCONTROL_SUCCEED,
        actionTypes.UPDATE_WHOWNCONTROL_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/owner/control',
      method: 'post',
      data: {
        ownerAuthId, control, whseCode, contentLog,
      },
    },
  };
}

export function showStaffModal() {
  return {
    type: actionTypes.SHOW_STAFF_MODAL,
  };
}

export function hideStaffModal() {
  return {
    type: actionTypes.HIDE_STAFF_MODAL,
  };
}

export function addStaff(whseCode, staffs, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_STAFF,
        actionTypes.ADD_STAFF_SUCCEED,
        actionTypes.ADD_STAFF_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/add/staffs',
      method: 'post',
      data: { whseCode, staffs, loginId },
    },
  };
}

export function loadStaffs(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_STAFFS,
        actionTypes.LOAD_STAFFS_SUCCEED,
        actionTypes.LOAD_STAFFS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/load/staffs',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function changeStaffStatus(status, id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CHNAGE_STAFF_STATUS,
        actionTypes.CHNAGE_STAFF_STATUS_SUCCEED,
        actionTypes.CHNAGE_STAFF_STATUS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/change/staff/status',
      method: 'post',
      data: { status, id },
    },
  };
}

export function deleteStaff(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_STAFF,
        actionTypes.DELETE_STAFF_SUCCEED,
        actionTypes.DELETE_STAFF_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/delete/staff',
      method: 'post',
      data: { id },
    },
  };
}

export function addReceiver(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_RECEIVER,
        actionTypes.ADD_RECEIVER_SUCCEED,
        actionTypes.ADD_RECEIVER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/receiver/add',
      method: 'post',
      data,
    },
  };
}

export function loadReceivers(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_RECEIVERS,
        actionTypes.LOAD_RECEIVERS_SUCCEED,
        actionTypes.LOAD_RECEIVERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/receiver/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function deleteReceiver(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_RECEIVER,
        actionTypes.DELETE_RECEIVER_SUCCEED,
        actionTypes.DELETE_RECEIVER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/receiver/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function updateReceiver(data, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_RECEIVER,
        actionTypes.UPDATE_RECEIVER_SUCCEED,
        actionTypes.UPDATE_RECEIVER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/receiver/update',
      method: 'post',
      data: { data, contentLog },
    },
  };
}

export function toggleReceiverModal(visible, receiver = {}) {
  return {
    type: actionTypes.TOGGLE_RECEIVER_MODAL,
    data: { visible, receiver },
  };
}

export function changeReceiverStatus(id, status, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_RECEIVER_STATUS,
        actionTypes.UPDATE_RECEIVER_STATUS_SUCCEED,
        actionTypes.UPDATE_RECEIVER_STATUS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/receiver/status/update',
      method: 'post',
      data: { id, status, loginId },
    },
  };
}

export function loadSuppliers(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SUPPLIERS,
        actionTypes.LOAD_SUPPLIERS_SUCCEED,
        actionTypes.LOAD_SUPPLIERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/suppliers/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function toggleSupplierModal(visible, supplier = {}) {
  return {
    type: actionTypes.TOGGLE_SUPPLIER_MODAL,
    data: { visible, supplier },
  };
}

export function addSupplier(data, whseCode, ownerTenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_SUPPLIER,
        actionTypes.ADD_SUPPLIER_SUCCEED,
        actionTypes.ADD_SUPPLIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/supplier/add',
      method: 'post',
      data: {
        data, whseCode, ownerTenantId,
      },
    },
  };
}

export function changeSupplierStatus(id, status, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SUPPLIER_STATUS,
        actionTypes.UPDATE_SUPPLIER_STATUS_SUCCEED,
        actionTypes.UPDATE_SUPPLIER_STATUS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/supplier/status/update',
      method: 'post',
      data: { id, status, loginId },
    },
  };
}

export function deleteSupplier(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_SUPPLIER,
        actionTypes.DELETE_SUPPLIER_SUCCEED,
        actionTypes.DELETE_SUPPLIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/supplier/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function updateSupplier(data, id, whseCode, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_SUPPLIER,
        actionTypes.UPDATE_SUPPLIER_SUCCEED,
        actionTypes.UPDATE_SUPPLIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/supplier/update',
      method: 'post',
      data: {
        data, id, whseCode, contentLog,
      },
    },
  };
}

export function loadCarriers(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_CARRIERS,
        actionTypes.LOAD_CARRIERS_SUCCEED,
        actionTypes.LOAD_CARRIERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/carriers/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function toggleCarrierModal(visible, carrier = {}) {
  return {
    type: actionTypes.TOGGLE_CARRIER_MODAL,
    data: { visible, carrier },
  };
}

export function addCarrier(data, whseCode, loginId, ownerTenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_CARRIER,
        actionTypes.ADD_CARRIER_SUCCEED,
        actionTypes.ADD_CARRIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/carrier/add',
      method: 'post',
      data: {
        data, whseCode, loginId, ownerTenantId,
      },
    },
  };
}

export function changeCarrierStatus(id, status, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CARRIER_STATUS,
        actionTypes.UPDATE_CARRIER_STATUS_SUCCEED,
        actionTypes.UPDATE_CARRIER_STATUS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/carrier/status/update',
      method: 'post',
      data: { id, status, loginId },
    },
  };
}

export function deleteCarrier(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_CARRIER,
        actionTypes.DELETE_CARRIER_SUCCEED,
        actionTypes.DELETE_CARRIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/carrier/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function updateCarrier(data, id, whseCode, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_CARRIER,
        actionTypes.UPDATE_CARRIER_SUCCEED,
        actionTypes.UPDATE_CARRIER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/carrier/update',
      method: 'post',
      data: {
        data, id, whseCode, contentLog,
      },
    },
  };
}

export function loadBrokers(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BROKERS,
        actionTypes.LOAD_BROKERS_SUCCEED,
        actionTypes.LOAD_BROKERS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/brokers/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function toggleBrokerModal(visible, broker = {}) {
  return {
    type: actionTypes.TOGGLE_BROKER_MODAL,
    data: { visible, broker },
  };
}

export function addBroker(data, whseCode, loginId, partnerTenantId, partnerCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_BROKER,
        actionTypes.ADD_BROKER_SUCCEED,
        actionTypes.ADD_BROKER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/broker/add',
      method: 'post',
      data: {
        data, whseCode, loginId, partnerTenantId, partnerCode,
      },
    },
  };
}

export function changeBrokerStatus(id, status, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_BROKER_STATUS,
        actionTypes.UPDATE_BROKER_STATUS_SUCCEED,
        actionTypes.UPDATE_BROKER_STATUS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/broker/status/update',
      method: 'post',
      data: { id, status, loginId },
    },
  };
}

export function deleteBroker(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_BROKER,
        actionTypes.DELETE_BROKER_SUCCEED,
        actionTypes.DELETE_BROKER_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/broker/delete',
      method: 'post',
      data: { id },
    },
  };
}

export function loadBrokerPartners(role, businessType) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_BRKP,
        actionTypes.LOAD_BRKP_SUCCEED,
        actionTypes.LOAD_BRKP_FAIL,
      ],
      endpoint: 'v1/cooperation/partners',
      method: 'post',
      data: { role, businessType },
    },
  };
}

export function authorizeBroker(value, whseCode, partnerId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.AUTHORIZE_BROKER,
        actionTypes.AUTHORIZE_BROKER_SUCCEED,
        actionTypes.AUTHORIZE_BROKER_FAIL,
      ],
      endpoint: 'v1/cwm/authorize/broker',
      method: 'post',
      data: { value, whseCode, partnerId },
    },
  };
}

export function toggleRecShipDock(visible, whOwnerAuth) {
  return {
    type: actionTypes.TOGGLE_REC_SHIP_DOCK,
    data: { visible, whOwnerAuth },
  };
}

export function toggleAllocSkuRulePanel(visible, ownerAllocRule, skuRule) {
  return {
    type: actionTypes.TOGGLE_ALLOC_SKU_RULE_PANEL,
    data: { visible, ownerAllocRule, skuRule },
  };
}
