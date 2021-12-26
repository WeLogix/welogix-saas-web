import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'sof.module.dashboard',
    defaultMessage: '工作台',
  },
  shipments: {
    id: 'sof.module.shipments',
    defaultMessage: '货运管理',
  },
  invoices: {
    id: 'sof.module.invoices',
    defaultMessage: '商业发票',
  },
  purchaseOrders: {
    id: 'sof.module.purchase.orders',
    defaultMessage: '采购订单',
  },
  salesOrders: {
    id: 'sof.module.sales.orders',
    defaultMessage: '销售订单',
  },
  tracking: {
    id: 'sof.module.tracking',
    defaultMessage: '状态跟踪',
  },
  partner: {
    id: 'sof.module.partner',
    defaultMessage: '业务伙伴',
  },
  customers: {
    id: 'sof.module.partner.customers',
    defaultMessage: '客户',
  },
  suppliers: {
    id: 'sof.module.partner.suppliers',
    defaultMessage: '供应商',
  },
  vendors: {
    id: 'sof.module.partner.vendors',
    defaultMessage: '服务商',
  },
  contacts: {
    id: 'sof.module.partner.contacts',
    defaultMessage: '联系人',
  },
  container: {
    id: 'sof.common.container',
    defaultMessage: '集装箱',
  },
  containerNo: {
    id: 'sof.common.container.no',
    defaultMessage: '集装箱号',
  },
  blNo: {
    id: 'sof.common.bl.no',
    defaultMessage: '提运单号',
  },
  commInvoices: {
    id: 'sof.common.invoices',
    defaultMessage: '关联发票',
  },
  poNo: {
    id: 'sof.common.po.no',
    defaultMessage: '采购订单号',
  },
  shipmentDetails: {
    id: 'sof.common.shipment.details',
    defaultMessage: '装货明细',
  },
  invoiceNo: {
    id: 'sof.common.invoice.no',
    defaultMessage: '商业发票号',
  },
  invoiceDate: {
    id: 'sof.common.invoice.date',
    defaultMessage: '发票日期',
  },
  poNoCount: {
    id: 'sof.common.pono.count',
    defaultMessage: 'PO数',
  },
  orderQty: {
    id: 'sof.common.order.qty',
    defaultMessage: '订单数量',
  },
  unitPrice: {
    id: 'sof.common.unit.price',
    defaultMessage: '单价',
  },
  amount: {
    id: 'sof.common.amount',
    defaultMessage: '总价',
  },
  netWeight: {
    id: 'sof.common.net.weight',
    defaultMessage: '净重',
  },
  totalQty: {
    id: 'sof.common.total.qty',
    defaultMessage: '总数量',
  },
  totalNetWt: {
    id: 'sof.common.total.netwt',
    defaultMessage: '总净重',
  },
  totalGrossWt: {
    id: 'sof.common.total.grosswt',
    defaultMessage: '总毛重',
  },
  totalAmount: {
    id: 'sof.common.total.amount',
    defaultMessage: '总金额',
  },
  currency: {
    id: 'sof.common.currency',
    defaultMessage: '币制',
  },
  statsSumQty: {
    id: 'sof.common.stats.sum.qty',
    defaultMessage: '数量合计',
  },
  statsSumNetWt: {
    id: 'sof.common.stats.sum.netwt',
    defaultMessage: '净重合计',
  },
  statsSumGrossWt: {
    id: 'sof.common.stats.sum.grosswt',
    defaultMessage: '毛重合计',
  },
  statsSumAmount: {
    id: 'sof.common.stats.sum.amount',
    defaultMessage: '金额合计',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
