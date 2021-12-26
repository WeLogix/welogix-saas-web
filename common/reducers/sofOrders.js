import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';
import { genCurrentPageAfterDel } from '../validater';

const actionTypes = createActionTypes('@@welogix/crm/orders/', [
  'LOAD_FORM_REQUIRES', 'LOAD_FORM_REQUIRES_SUCCEED', 'LOAD_FORM_REQUIRES_FAIL',
  'LOAD_ORDERS', 'LOAD_ORDERS_SUCCEED', 'LOAD_ORDERS_FAIL',
  'LOAD_OADAPTOR', 'LOAD_OADAPTOR_SUCCEED', 'LOAD_OADAPTOR_FAIL',
  'LOAD_ORDER', 'LOAD_ORDER_SUCCEED', 'LOAD_ORDER_FAIL',
  'VALIDATE_ORDER', 'VALIDATE_ORDER_SUCCEED', 'VALIDATE_ORDER_FAIL',
  'SUBMIT_ORDER', 'SUBMIT_ORDER_SUCCEED', 'SUBMIT_ORDER_FAIL',
  'SET_CLIENT_FORM', 'HIDE_DOCK', 'SHOW_DOCK', 'CHANGE_DOCK_TAB',
  'REMOVE_ORDER', 'REMOVE_ORDER_SUCCEED', 'REMOVE_ORDER_FAIL',
  'EDIT_ORDER', 'EDIT_ORDER_SUCCEED', 'EDIT_ORDER_FAIL',
  'ACCEPT_ORDER', 'ACCEPT_ORDER_SUCCEED', 'ACCEPT_ORDER_FAIL',
  'LOAD_DOCKORDER', 'LOAD_DOCKORDER_SUCCEED', 'LOAD_DOCKORDER_FAIL',
  'LOAD_ORDPRODUCTS', 'LOAD_ORDPRODUCTS_SUCCEED', 'LOAD_ORDPRODUCTS_FAILED',
  'LOAD_FLOWNODE', 'LOAD_FLOWNODE_SUCCEED', 'LOAD_FLOWNODE_FAILED',
  'LOAD_ORDERPROG', 'LOAD_ORDERPROG_SUCCEED', 'LOAD_ORDERPROG_FAILED',
  'LOAD_ORDER_NODES', 'LOAD_ORDER_NODES_SUCCEED', 'LOAD_ORDER_NODES_FAIL',
  'LOAD_ORDER_NODES_TRIGGERS', 'LOAD_ORDER_NODES_TRIGGERS_SUCCEED', 'LOAD_ORDER_NODES_TRIGGERS_FAIL',
  'CANCEL_ORDER', 'CANCEL_ORDER_SUCCEED', 'CANCEL_ORDER_FAIL',
  'CLOSE_ORDER', 'CLOSE_ORDER_SUCCEED', 'CLOSE_ORDER_FAIL',
  'LOAD_FLOWASN', 'LOAD_FLOWASN_SUCCEED', 'LOAD_FLOWASN_FAIL',
  'LOAD_FLOWSO', 'LOAD_FLOWSO_SUCCEED', 'LOAD_FLOWSO_FAIL',
  'MANUAL_ENTFI', 'MANUAL_ENTFI_SUCCEED', 'MANUAL_ENTFI_FAIL',
  'ATTACHMENT_UPLOAD', 'ATTACHMENT_UPLOAD_SUCCEED', 'ATTACHMENT_UPLOAD_FAIL',
  'LOAD_ATTACHMENTS', 'LOAD_ATTACHMENTS_SUCCEED', 'LOAD_ATTACHMENTS_FAIL',
  'LOAD_INVOICES', 'LOAD_INVOICES_SUCCEED', 'LOAD_INVOICES_FAIL',
  'REMOVE_ORDER_INVOICE', 'REMOVE_ORDER_INVOICE_SUCCEED', 'REMOVE_ORDER_INVOICE_FAIL',
  'ADD_ORDER_CONTAINER', 'ADD_ORDER_CONTAINER_SUCCEED', 'ADD_ORDER_CONTAINER_FAIL',
  'LOAD_ORDER_CONTAINERS', 'LOAD_ORDER_CONTAINERS_SUCCEED', 'LOAD_ORDER_CONTAINERS_FAIL',
  'ORDER_CONTAINER_REMOVE', 'ORDER_CONTAINER_REMOVE_SUCCEED', 'ORDER_CONTAINER_REMOVE_FAIL',
  'LOAD_ORDER_INVOICES', 'LOAD_ORDER_INVOICES_SUCCEED', 'LOAD_ORDER_INVOICES_FAIL',
  'ADD_ORDER_INVOICES', 'ADD_ORDER_INVOICES_SUCCEED', 'ADD_ORDER_INVOICES_FAIL',
  'LOAD_ORDDETAILS', 'LOAD_ORDDETAILS_SUCCEED', 'LOAD_ORDDETAILS_FAIL',
  'LOAD_SDSTAT', 'LOAD_SDSTAT_SUCCEED', 'LOAD_SDSTAT_FAIL',
  'BATCH_DELETE_BY_UPLOADNO', 'BATCH_DELETE_BY_UPLOADNO_SUCCEED', 'BATCH_DELETE_BY_UPLOADNO_FAIL',
  'BATCH_START', 'BATCH_START_SUCCEED', 'BATCH_START_FAIL',
  'BATCH_DELETE', 'BATCH_DELETE_SUCCEED', 'BATCH_DELETE_FAIL',
  'TOGGLE_INVOICE_MODAL', 'TOGGLE_FLOW_POPOVER',
  'GET_SHIPMT_ORDER_NO', 'GET_SHIPMT_ORDER_NO_SUCCEED', 'GET_SHIPMT_ORDER_NO_FAIL',
  'LOAD_INVOICE_NO_LIST', 'LOAD_INVOICE_NO_LIST_SUCCEED', 'LOAD_INVOICE_NO_LIST_FAIL',
]);

const initialState = {
  loaded: true,
  loading: false,
  orderSaving: false,
  dock: {
    visible: false,
    tabKey: null,
    order: {},
    flow: {},
    flowPopoverVisible: false,
    orderProductLoading: false,
    orderProductListFilter: {
    },
    orderProductList: {
      totalCount: 0,
      current: 1,
      pageSize: 20,
      data: [],
    },
  },
  orderDetails: {
    data: [],
    totalCount: 0,
    current: 1,
    pageSize: 20,
  },
  orderDetailReload: false,
  shipmentDetailStat: {
    total_qty: 0,
    total_amount: 0,
    total_net_wt: 0,
  },
  orderDetailListFilter: {},
  dockInstMap: {},
  formData: {
    shipmt_order_no: '',
    shipmt_order_mode: '',
    customer_name: '',
    customer_tenant_id: null,
    customer_partner_id: null,
    customer_partner_code: '',
    cust_shipmt_trans_mode: '',
    cust_shipmt_mawb: '',
    cust_shipmt_hawb: '',
    cust_shipmt_bill_lading: '',
    cust_shipmt_bill_lading_no: '',
    cust_shipmt_vessel: '',
    cust_shipmt_voy: '',
    cust_shipmt_pieces: null,
    cust_shipmt_weight: null,
    cust_shipmt_volume: null,
    cust_shipmt_expedited: '0',
    cust_shipmt_goods_type: 0,
    cust_shipmt_wrap_type: null,
    ccb_need_exchange: 0,
    subOrders: [],
  },
  originFormData: {},
  formRequires: {
    orderTypes: [],
    packagings: [],
    transitModes: [],
    goodsTypes: [],
    consignerLocations: [],
    consigneeLocations: [],
    containerPackagings: [],
    declPorts: [],
    customsBrokers: [],
    ciqBrokers: [],
  },
  orders: {
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    reload: false,
  },
  orderFilters: {
    scenario: 'all', progress: 'all', transfer: 'all', orderType: null, expedited: 'all',
  },
  orderListReload: false,
  orderBizObjects: [],
  containers: [],
  invoices: [],
  orderInvoicesReload: false,
  invoicesModal: {
    visible: false,
    totalCount: 0,
    pageSize: 20,
    current: 1,
    data: [],
    filter: {
      // buyer: '', seller: '', category: '', status: 'unshipped',
    },
    invnolist: [],
  },
  shipmtOrderNos: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_FORM_REQUIRES_SUCCEED:
      return { ...state, formRequires: action.result.data };
    case actionTypes.SET_CLIENT_FORM: {
      const { index, orderInfo } = action.data;
      if (index === -1) {
        return { ...state, formData: { ...state.formData, ...orderInfo } };
      } else if (index === -2) {
        return { ...state, formData: initialState.formData };
      }
      const subOrders = [...state.formData.subOrders];
      subOrders.splice(index, 1, orderInfo);
      return { ...state, formData: { ...state.formData, subOrders } };
    }
    case actionTypes.LOAD_ORDERS:
      return { ...state, loading: true, orderFilters: JSON.parse(action.params.filters) };
    case actionTypes.LOAD_ORDERS_SUCCEED:
      return {
        ...state, orders: action.result.data, loading: false, orderListReload: false,
      };
    case actionTypes.LOAD_ORDER_SUCCEED:
      return { ...state, formData: action.result.data, originFormData: action.result.data };
    case actionTypes.SUBMIT_ORDER:
    case actionTypes.EDIT_ORDER:
      return { ...state, orderSaving: true };
    case actionTypes.EDIT_ORDER_SUCCEED:
    case actionTypes.EDIT_ORDER_FAIL:
    case actionTypes.SUBMIT_ORDER_SUCCEED:
    case actionTypes.SUBMIT_ORDER_FAIL:
      return { ...state, orderSaving: false };
    case actionTypes.LOAD_DOCKORDER_SUCCEED: {
      return {
        ...state,
        dock: {
          ...state.dock,
          tabKey: action.tabKey,
          order: action.result.data.order || {},
          flow: action.result.data.flow || {},
        },
        orderBizObjects: [],
      };
    }
    case actionTypes.LOAD_ORDPRODUCTS:
      return {
        ...state,
        dock: {
          ...state.dock,
          orderProductLoading: true,
          orderProductList: initialState.dock.orderProductList,
          orderProductListFilter: JSON.parse(action.params.filters),
        },
      };
    case actionTypes.LOAD_ORDPRODUCTS_SUCCEED:
      return {
        ...state,
        dock: {
          ...state.dock,
          orderProductLoading: false,
          orderProductList: action.result.data,
        },
      };
    case actionTypes.LOAD_ORDDETAILS:
      return {
        ...state, orderDetailListFilter: JSON.parse(action.params.filters),
      };
    case actionTypes.LOAD_ORDDETAILS_SUCCEED:
      return {
        ...state, orderDetails: action.result.data, orderDetailReload: false,
      };
    case actionTypes.LOAD_ORDPRODUCTS_FAILED:
      return { ...state, dock: { ...state.dock, orderProductLoading: false } };
    case actionTypes.LOAD_SDSTAT_SUCCEED:
      return { ...state, shipmentDetailStat: action.result.data };
    case actionTypes.HIDE_DOCK: {
      return { ...state, dock: { ...state.dock, visible: false } };
    }
    case actionTypes.SHOW_DOCK:
      return {
        ...state,
        dock: {
          ...state.dock,
          visible: true,
          order: {
            ...state.dock.order, shipmt_order_no: action.orderNo,
          },
        },
      };
    case actionTypes.CHANGE_DOCK_TAB:
      return { ...state, dock: { ...state.dock, tabKey: action.data.tabKey } };
    case actionTypes.LOAD_ORDER_NODES_SUCCEED: {
      const dockInstMap = {};
      action.result.data.forEach((inst) => { dockInstMap[inst.uuid] = {}; });
      return { ...state, orderBizObjects: action.result.data, dockInstMap };
    }
    case actionTypes.LOAD_FLOWSO_SUCCEED:
    case actionTypes.LOAD_FLOWASN_SUCCEED:
      return {
        ...state,
        dockInstMap: {
          ...state.dockInstMap,
          [action.params.uuid]: action.result.data,
        },
      };
    case actionTypes.LOAD_ORDER_CONTAINERS_SUCCEED:
      return { ...state, containers: action.result.data };
    case actionTypes.LOAD_ORDER_INVOICES_SUCCEED:
      return { ...state, invoices: action.result.data };
    case actionTypes.ADD_ORDER_INVOICES_SUCCEED:
    case actionTypes.REMOVE_ORDER_INVOICE_SUCCEED:
      return {
        ...state,
        orderDetailReload: true,
        orderInvoicesReload: true,
      };
    case actionTypes.LOAD_INVOICES:
      return {
        ...state,
        invoicesModal: {
          ...state.invoicesModal,
          filter: JSON.parse(action.params.filter),
        },
      };
    case actionTypes.LOAD_INVOICES_SUCCEED:
      return { ...state, invoicesModal: { ...state.invoicesModal, ...action.result.data } };
    case actionTypes.TOGGLE_INVOICE_MODAL:
      return {
        ...state,
        invoicesModal: {
          ...state.invoicesModal,
          visible: action.data.visible,
          filter: action.data.filters || initialState.invoicesModal.filter,
        },
      };
    case actionTypes.TOGGLE_FLOW_POPOVER:
      return {
        ...state,
        dock: {
          ...state.dock,
          flowPopoverVisible: action.data.visible,
        },
      };
    case actionTypes.LOAD_ORDER_INVOICES:
      return { ...state, orderInvoicesReload: false };
    case actionTypes.ACCEPT_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (ord.shipmt_order_no === action.data.shipmtOrderNo) {
              return { ...ord, order_status: 6 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.ACCEPT_ORDER_SUCCEED:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (ord.shipmt_order_no === action.data.shipmtOrderNo) {
              return { ...ord, order_status: 2 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.ACCEPT_ORDER_FAIL:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (ord.shipmt_order_no === action.data.shipmtOrderNo) {
              return { ...ord, order_status: 1 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.BATCH_START:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (action.data.orderNos.indexOf(ord.shipmt_order_no) !== -1) {
              return { ...ord, order_status: 6 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.BATCH_START_SUCCEED:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (action.data.orderNos.indexOf(ord.shipmt_order_no) !== -1) {
              return { ...ord, order_status: 2 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.BATCH_START_FAIL:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (action.data.orderNos.indexOf(ord.shipmt_order_no) !== -1) {
              return { ...ord, order_status: 1 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.CANCEL_ORDER_SUCCEED:
      return {
        ...state,
        orderListReload: true,
      };
    case actionTypes.CLOSE_ORDER_SUCCEED:
      return {
        ...state,
        orders: {
          ...state.orders,
          data: state.orders.data.map((ord) => {
            if (action.data.order_no === ord.shipmt_order_no) {
              return { ...ord, order_status: 4 };
            }
            return ord;
          }),
        },
      };
    case actionTypes.REMOVE_ORDER_SUCCEED: {
      const { totalCount, pageSize, current } = state.orders;
      const currentPage =
        genCurrentPageAfterDel(pageSize, current, totalCount, 1);
      return { ...state, orders: { ...state.orders, current: currentPage } };
    }
    case actionTypes.GET_SHIPMT_ORDER_NO_SUCCEED:
      return { ...state, shipmtOrderNos: action.result.data };
    case actionTypes.LOAD_INVOICE_NO_LIST_SUCCEED:
      return {
        ...state,
        invoicesModal: {
          ...state.invoicesModal,
          invnolist: action.result.data,
        },
      };
    default:
      return state;
  }
}

export function loadFormRequires(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FORM_REQUIRES,
        actionTypes.LOAD_FORM_REQUIRES_SUCCEED,
        actionTypes.LOAD_FORM_REQUIRES_FAIL,
      ],
      endpoint: 'v1/crm/requires',
      method: 'get',
      params,
    },
  };
}

export function loadOrders({
  pageSize, current, filters,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDERS,
        actionTypes.LOAD_ORDERS_SUCCEED,
        actionTypes.LOAD_ORDERS_FAIL,
      ],
      endpoint: 'v1/crm/orders',
      method: 'get',
      params: {
        pageSize, current, filters: JSON.stringify(filters),
      },
    },
  };
}

export function loadOrderAdaptor(code) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_OADAPTOR,
        actionTypes.LOAD_OADAPTOR_SUCCEED,
        actionTypes.LOAD_OADAPTOR_FAIL,
      ],
      endpoint: 'v1/saas/linefile/adaptor',
      method: 'get',
      params: { code },
    },
  };
}

export function loadOrder(shipmtOrderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER,
        actionTypes.LOAD_ORDER_SUCCEED,
        actionTypes.LOAD_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order',
      method: 'get',
      params: { shipmtOrderNo },
    },
  };
}

export function removeOrder({
  tenantId, loginId, username, shipmtOrderNo,
}) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_ORDER,
        actionTypes.REMOVE_ORDER_SUCCEED,
        actionTypes.REMOVE_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/remove',
      method: 'post',
      data: {
        tenantId, loginId, username, shipmtOrderNo,
      },
    },
  };
}

export function setClientForm(index, orderInfo) {
  return {
    type: actionTypes.SET_CLIENT_FORM,
    data: { index, orderInfo },
  };
}

export function validateOrder(formData) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.VALIDATE_ORDER,
        actionTypes.VALIDATE_ORDER_SUCCEED,
        actionTypes.VALIDATE_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/validate',
      method: 'post',
      data: { formData },
    },
  };
}

export function submitOrder(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.SUBMIT_ORDER,
        actionTypes.SUBMIT_ORDER_SUCCEED,
        actionTypes.SUBMIT_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/submit',
      method: 'post',
      data,
    },
  };
}

export function editOrder(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.EDIT_ORDER,
        actionTypes.EDIT_ORDER_SUCCEED,
        actionTypes.EDIT_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/edit',
      method: 'post',
      data,
    },
  };
}

export function acceptOrder(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ACCEPT_ORDER,
        actionTypes.ACCEPT_ORDER_SUCCEED,
        actionTypes.ACCEPT_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/accept',
      method: 'post',
      data,
    },
  };
}

export function loadOrderDetail(shipmtOrderNo, tenantId, tabKey = '') {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_DOCKORDER,
        actionTypes.LOAD_DOCKORDER_SUCCEED,
        actionTypes.LOAD_DOCKORDER_FAIL,
      ],
      endpoint: 'v1/crm/order/detail',
      method: 'get',
      params: { shipmtOrderNo, tenantId },
      tabKey,
    },
  };
}

export function loadOrderProducts(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDPRODUCTS,
        actionTypes.LOAD_ORDPRODUCTS_SUCCEED,
        actionTypes.LOAD_ORDPRODUCTS_FAILED,
      ],
      endpoint: 'v1/sof/order/products',
      method: 'get',
      params,
    },
  };
}

export function changeDockTab(tabKey) {
  return {
    type: actionTypes.CHANGE_DOCK_TAB,
    data: { tabKey },
  };
}

export function hideDock() {
  return {
    type: actionTypes.HIDE_DOCK,
  };
}

export function showDock(orderNo) {
  return {
    type: actionTypes.SHOW_DOCK,
    orderNo,
  };
}

export function loadFlowNodeData(nodeuuid, kind) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOWNODE,
        actionTypes.LOAD_FLOWNODE_SUCCEED,
        actionTypes.LOAD_FLOWNODE_FAILED,
      ],
      endpoint: 'v1/scof/flow/graph/node',
      method: 'get',
      params: { uuid: nodeuuid, kind },
    },
  };
}

export function loadOrderProgress(orderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDERPROG,
        actionTypes.LOAD_ORDERPROG_SUCCEED,
        actionTypes.LOAD_ORDERPROG_FAILED,
      ],
      endpoint: 'v1/crm/order/flow/progress',
      method: 'get',
      params: { order_no: orderNo },
    },
  };
}

export function loadOrderNodes(orderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_NODES,
        actionTypes.LOAD_ORDER_NODES_SUCCEED,
        actionTypes.LOAD_ORDER_NODES_FAIL,
      ],
      endpoint: 'v1/scof/order/instance/nodes',
      method: 'get',
      params: { orderNo },
    },
  };
}

export function loadOrderNodesTriggers(uuid, bizObjects, bizno) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_NODES_TRIGGERS,
        actionTypes.LOAD_ORDER_NODES_TRIGGERS_SUCCEED,
        actionTypes.LOAD_ORDER_NODES_TRIGGERS_FAIL,
      ],
      endpoint: 'v1/scof/order/nodes/triggers/load',
      method: 'post',
      data: { uuid, bizObjects, bizno },
    },
  };
}

export function cancelOrder(orderNo, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CANCEL_ORDER,
        actionTypes.CANCEL_ORDER_SUCCEED,
        actionTypes.CANCEL_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/cancel/order',
      method: 'post',
      data: { order_no: orderNo, tenant_id: tenantId },
    },
  };
}

export function closeOrder(orderNo, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CLOSE_ORDER,
        actionTypes.CLOSE_ORDER_SUCCEED,
        actionTypes.CLOSE_ORDER_FAIL,
      ],
      endpoint: 'v1/crm/close/order',
      method: 'post',
      data: { order_no: orderNo, tenant_id: tenantId },
    },
  };
}

export function getAsnFromFlow(uuid, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOWASN,
        actionTypes.LOAD_FLOWASN_SUCCEED,
        actionTypes.LOAD_FLOWASN_FAIL,
      ],
      endpoint: 'v1/cwm/get/flow/asn',
      method: 'get',
      params: { uuid, tenantId },
    },
  };
}

export function getSoFromFlow(uuid, tenantId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_FLOWSO,
        actionTypes.LOAD_FLOWSO_SUCCEED,
        actionTypes.LOAD_FLOWSO_FAIL,
      ],
      endpoint: 'v1/cwm/get/flow/so',
      method: 'get',
      params: { uuid, tenantId },
    },
  };
}

export function manualEnterFlowInstance(uuid, kind) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.MANUAL_ENTFI,
        actionTypes.MANUAL_ENTFI_SUCCEED,
        actionTypes.MANUAL_ENTFI_FAIL,
      ],
      endpoint: 'v1/sof/order/node/manual/enter',
      method: 'post',
      data: { uuid, kind },
    },
  };
}

export function loadInvoices({ pageSize, current, filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICES,
        actionTypes.LOAD_INVOICES_SUCCEED,
        actionTypes.LOAD_INVOICES_FAIL,
      ],
      endpoint: 'v1/sof/order/allinvoices/load',
      method: 'get',
      params: {
        pageSize, current, filter: JSON.stringify(filter),
      },
    },
  };
}

export function loadInvNoList({ filter }) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_INVOICE_NO_LIST,
        actionTypes.LOAD_INVOICE_NO_LIST_SUCCEED,
        actionTypes.LOAD_INVOICE_NO_LIST_FAIL,
      ],
      endpoint: 'v1/sof/order/allinvoices/invnolist',
      method: 'get',
      params: { filter: JSON.stringify(filter) },
    },
  };
}

export function toggleInvoiceModal(visible, filters) {
  return {
    type: actionTypes.TOGGLE_INVOICE_MODAL,
    data: { visible, filters },
  };
}

export function toggleFlowPopover(visible) {
  return {
    type: actionTypes.TOGGLE_FLOW_POPOVER,
    data: { visible },
  };
}

export function removeOrderInvoice(invoiceNo, shipmtOrderNo, custOrderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.REMOVE_ORDER_INVOICE,
        actionTypes.REMOVE_ORDER_INVOICE_SUCCEED,
        actionTypes.REMOVE_ORDER_INVOICE_FAIL,
      ],
      endpoint: 'v1/sof/order/invoice/remove',
      method: 'post',
      data: { invoiceNo, shipmtOrderNo, custOrderNo },
    },
  };
}

export function addOrderContainer(orderNo, cntnrNo, cntnrSpec, isLcl) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ORDER_CONTAINER,
        actionTypes.ADD_ORDER_CONTAINER_SUCCEED,
        actionTypes.ADD_ORDER_CONTAINER_FAIL,
      ],
      endpoint: 'v1/sof/order/container/add',
      method: 'post',
      data: {
        orderNo, cntnrNo, cntnrSpec, isLcl,
      },
    },
  };
}

export function loadOrderContainers(orderNo, mergeDelg) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_CONTAINERS,
        actionTypes.LOAD_ORDER_CONTAINERS_SUCCEED,
        actionTypes.LOAD_ORDER_CONTAINERS_FAIL,
      ],
      endpoint: 'v1/sof/order/containers',
      method: 'get',
      params: { orderNo, mergeDelg },
    },
  };
}

export function removeOrderContainer(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ORDER_CONTAINER_REMOVE,
        actionTypes.ORDER_CONTAINER_REMOVE_SUCCEED,
        actionTypes.ORDER_CONTAINER_REMOVE_FAIL,
      ],
      endpoint: 'v1/sof/order/container/remove',
      method: 'post',
      data: { id },
    },
  };
}

export function loadOrderInvoices(orderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDER_INVOICES,
        actionTypes.LOAD_ORDER_INVOICES_SUCCEED,
        actionTypes.LOAD_ORDER_INVOICES_FAIL,
      ],
      endpoint: 'v1/sof/order/invoices',
      method: 'get',
      params: { orderNo },
    },
  };
}

export function addOrderInvoices(invoiceNos, orderNo, coefficient) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ORDER_INVOICES,
        actionTypes.ADD_ORDER_INVOICES_SUCCEED,
        actionTypes.ADD_ORDER_INVOICES_FAIL,
      ],
      endpoint: 'v1/sof/order/invoices/add',
      method: 'post',
      data: { invoiceNos, orderNo, coefficient },
    },
  };
}

export function loadOrderDetails(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ORDDETAILS,
        actionTypes.LOAD_ORDDETAILS_SUCCEED,
        actionTypes.LOAD_ORDDETAILS_FAIL,
      ],
      endpoint: 'v1/sof/order/products',
      method: 'get',
      params,
    },
  };
}

export function loadShipmentDetailStat(sofOrderNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_SDSTAT,
        actionTypes.LOAD_SDSTAT_SUCCEED,
        actionTypes.LOAD_SDSTAT_FAIL,
      ],
      endpoint: 'v1/sof/order/productstat',
      method: 'get',
      params: { sofOrderNo },
    },
  };
}

export function batchDeleteByUploadNo(uploadNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE_BY_UPLOADNO,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_SUCCEED,
        actionTypes.BATCH_DELETE_BY_UPLOADNO_FAIL,
      ],
      endpoint: 'v1/sof/order/batch/delete/by/uploadno',
      method: 'post',
      data: { uploadNo },
    },
  };
}

export function acceptOrderBatch(orderNos, username) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_START,
        actionTypes.BATCH_START_SUCCEED,
        actionTypes.BATCH_START_FAIL,
      ],
      endpoint: 'v1/sof/order/batch/accept',
      method: 'post',
      data: { orderNos, username },
    },
  };
}

export function batchDelete(orderNos, username) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.BATCH_DELETE,
        actionTypes.BATCH_DELETE_SUCCEED,
        actionTypes.BATCH_DELETE_FAIL,
      ],
      endpoint: 'v1/sof/order/batch/delete',
      method: 'post',
      data: { orderNos, username },
    },
  };
}

export function getShipmtOrderNo(bizNo) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_SHIPMT_ORDER_NO,
        actionTypes.GET_SHIPMT_ORDER_NO_SUCCEED,
        actionTypes.GET_SHIPMT_ORDER_NO_FAIL,
      ],
      endpoint: 'v1/crm/get/shipmt/order/no',
      method: 'get',
      params: { bizNo },
    },
  };
}
