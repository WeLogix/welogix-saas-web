import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  allBuyerSeller: {
    id: 'sof.invoices.allbuyerseller',
    defaultMessage: '所有客户/供应商',
  },
  buyer: {
    id: 'sof.invoices.invoice.buyer',
    defaultMessage: '客户',
  },
  supplier: {
    id: 'sof.invoices.invoice.supplier',
    defaultMessage: '供应商',
  },
  wrapQtyType: {
    id: 'sof.invoices.invoice.wrap.qty.type',
    defaultMessage: '件数/包装',
  },
  selectPackage: {
    id: 'sof.invoices.invoice.package.placeholder',
    defaultMessage: '选择包装方式',
  },
  grossWeight: {
    id: 'sof.invoices.invoice.grossWt',
    defaultMessage: '总毛重',
  },
  tradeMode: {
    id: 'sof.invoices.invoice.tradeMode',
    defaultMessage: '成交方式',
  },
  category: {
    id: 'sof.invoices.invoice.category',
    defaultMessage: '发票类别',
  },
  createInvoice: {
    id: 'sof.invoices.create',
    defaultMessage: '新建发票',
  },
  batchImportInvoices: {
    id: 'sof.invoices.batch.import',
    defaultMessage: '批量导入发票',
  },
  confirmShipRecv: {
    id: 'sof.invoices.confirm.ship.recv',
    defaultMessage: '确认收发货',
  },
  confirmShip: {
    id: 'sof.invoices.confirm.ship',
    defaultMessage: '发货状态确认',
  },
  confirmRecv: {
    id: 'sof.invoices.confirm.recv',
    defaultMessage: '收货状态确认',
  },
  shipRecvLogs: {
    id: 'sof.invoices.ship.recv.logs',
    defaultMessage: '收发货历史记录',
  },
  shipRecvLogDetails: {
    id: 'sof.invoices.ship.recv.log.details',
    defaultMessage: '收发货记录详情',
  },
  toShip: {
    id: 'sof.invoices.status.to.ship',
    defaultMessage: '待发货',
  },
  exceptionalShipped: {
    id: 'sof.invoices.status.exceptional.shipped',
    defaultMessage: '发货异常',
  },
  shipped: {
    id: 'sof.invoices.status.shipped',
    defaultMessage: '已发货',
  },
  exceptionalReceived: {
    id: 'sof.purchase.orders.status.exceptional.received',
    defaultMessage: '收货异常',
  },
  received: {
    id: 'sof.purchase.orders.status.received',
    defaultMessage: '已收货',
  },
  searchPlaceholder: {
    id: 'sof.invoices.searchPlaceholder',
    defaultMessage: '发票号',
  },
  invoiceEmpty: {
    id: 'sof.invoices.invoiceEmpty',
    defaultMessage: '暂无发票',
  },
  invDetailSearchPH: {
    id: 'sof.invoices.detail.search.placeholder',
    defaultMessage: '货号/采购订单号',
  },
  commInvoiceDetails: {
    id: 'sof.invoices.details',
    defaultMessage: '发票明细',
  },
  poNo: {
    id: 'sof.invoice.details.poNo',
    defaultMessage: '采购订单号',
  },
  productNo: {
    id: 'sof.invoice.details.productNo',
    defaultMessage: '货号',
  },
  nameCN: {
    id: 'sof.invoice.details.nameCN',
    defaultMessage: '中文品名',
  },
  qtyPcs: {
    id: 'sof.invoice.details.qtyPcs',
    defaultMessage: '订单数量',
  },
  unitPcs: {
    id: 'sof.invoice.details.unitPcs',
    defaultMessage: '计量单位',
  },
  netWt: {
    id: 'sof.invoice.details.netWt',
    defaultMessage: '净重',
  },
  originCountry: {
    id: 'sof.invoice.details.originCountry',
    defaultMessage: '原产国',
  },
  unitPrice: {
    id: 'sof.invoice.details.unitPrice',
    defaultMessage: '单价',
  },
  totalamount: {
    id: 'sof.invoice.details.totalamount',
    defaultMessage: '总价',
  },
  amount: {
    id: 'sof.invoice.details.amount',
    defaultMessage: '金额',
  },
  currency: {
    id: 'sof.invoice.details.currency',
    defaultMessage: '币制',
  },
  packageNumber: {
    id: 'sof.invoice.head.packageNumber',
    defaultMessage: '件数',
  },
  packageType: {
    id: 'sof.invoice.head.packageType',
    defaultMessage: '包装',
  },
  shipConfirmDetails: {
    id: 'sof.invoices.confirm.shipConfirmDetails',
    defaultMessage: '发货确认详情',
  },
  receiveConfirmDetails: {
    id: 'sof.invoices.confirm.receiveConfirmDetails',
    defaultMessage: '收货确认详情',
  },
  normal: {
    id: 'sof.invoices.confirm.normal',
    defaultMessage: '正常',
  },
  exception: {
    id: 'sof.invoices.confirm.exception',
    defaultMessage: '异常',
  },
  taskId: {
    id: 'sof.invoices.confirm.taskId',
    defaultMessage: '任务ID',
  },
  uploadFilename: {
    id: 'sof.invoices.confirm.uploadFilename',
    defaultMessage: '上传文件',
  },
  taskCount: {
    id: 'sof.invoices.confirm.taskCount',
    defaultMessage: '任务数量',
  },
  globalNo: {
    id: 'sof.invoices.confirm.globalNo',
    defaultMessage: '全局追踪码',
  },
  expectQty: {
    id: 'sof.invoices.confirm.expectQty',
    defaultMessage: '订单数量',
  },
  shippedQty: {
    id: 'sof.invoices.confirm.shippedQty',
    defaultMessage: '发货数量',
  },
  recvQty: {
    id: 'sof.invoices.confirm.recvQty',
    defaultMessage: '收货数量',
  },
  palletNo: {
    id: 'sof.invoices.confirm.palletNo',
    defaultMessage: '托盘号',
  },
  cartonNo: {
    id: 'sof.invoices.confirm.cartonNo',
    defaultMessage: '箱号',
  },
  invoicePayDate: {
    id: 'sof.invoice.paydate',
    defaultMessage: '付款日期',
  },
  invAttr: {
    id: 'sof.invoice.extattr',
    defaultMessage: '发票属性',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
