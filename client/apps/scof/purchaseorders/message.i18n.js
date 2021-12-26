import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  purchaseOrders: {
    id: 'sof.purchase.orders',
    defaultMessage: '采购订单',
  },
  customer: {
    id: 'sof.purchase.orders.customer',
    defaultMessage: '购买方',
  },
  customerCntry: {
    id: 'sof.purchase.orders.customer.cntry',
    defaultMessage: '购买方国别',
  },
  supplier: {
    id: 'sof.purchase.orders.supplier',
    defaultMessage: '供应商',
  },
  supplierCntry: {
    id: 'sof.purchase.orders.supplier.cntry',
    defaultMessage: '供应商国别',
  },
  classifyCd: {
    id: 'sof.purchase.orders.classify.cd',
    defaultMessage: '产品大类',
  },
  poWhseCode: {
    id: 'sof.purchase.orders.whse.cd',
    defaultMessage: '仓库代码',
  },
  trxnMode: {
    id: 'sof.purchase.orders.trxnMode',
    defaultMessage: '成交方式',
  },
  transMode: {
    id: 'sof.purchase.orders.transMode',
    defaultMessage: '运输方式',
  },
  productNo: {
    id: 'sof.purchase.orders.productNo',
    defaultMessage: '产品货号',
  },
  gName: {
    id: 'sof.purchase.orders.gName',
    defaultMessage: '产品名称',
  },
  innerCode: {
    id: 'sof.purchase.order.innerCode',
    defaultMessage: '内部代码',
  },
  virtualWhse: {
    id: 'sof.purchase.orders.virtualWhse',
    defaultMessage: '库别',
  },
  brand: {
    id: 'sof.purchase.orders.brand',
    defaultMessage: '品牌',
  },
  copController: {
    id: 'sof.purchase.orders.copcontroller',
    defaultMessage: '产品负责人',
  },
  orderQty: {
    id: 'sof.purchase.orders.orderQty',
    defaultMessage: '订单数量',
  },
  wtUnit: {
    id: 'sof.purchase.orders.wtUnit',
    defaultMessage: '净重单位',
  },
  invoiceNo: {
    id: 'sof.purchase.orders.invoiceNo',
    defaultMessage: '关联发票号',
  },
  shippingDate: {
    id: 'sof.purchase.orders.shippingDate',
    defaultMessage: '发货日期',
  },
  poSearchPlaceholder: {
    id: 'sof.purchase.orders.searchPlaceholder',
    defaultMessage: '采购订单号/货号',
  },
  batchImportPurchaseOrders: {
    id: 'sof.purchase.orders.batch.import',
    defaultMessage: '导入采购订单',
  },

  poNoIsRequired: {
    id: 'sof.purchase.orders.status.poNoIsRequired',
    defaultMessage: '采购订单号必填',
  },
  productNoIsRequired: {
    id: 'sof.purchase.orders.status.productNoIsRequired',
    defaultMessage: '货号必填',
  },
  qtyIsRequired: {
    id: 'sof.purchase.orders.status.qtyIsRequired',
    defaultMessage: '订单数量必填',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
