import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  payableSettlement: {
    id: 'bss.payable.settlement',
    defaultMessage: '应付结算单',
  },
  payableItems: {
    id: 'bss.payable.items',
    defaultMessage: '结算明细',
  },
  clearing: {
    id: 'bss.payable.clearing',
    defaultMessage: '核销记录',
  },
  statusWarning: {
    id: 'bss.payable.status.warning',
    defaultMessage: '异常费用',
  },
  statusConfirmed: {
    id: 'bss.payable.status.confirmed',
    defaultMessage: '已确认',
  },
  confirmAll: {
    id: 'bss.payable.confirm.all',
    defaultMessage: '一键确认',
  },
  searchTips: {
    id: 'bss.payable.search.tips',
    defaultMessage: '票据号码/业务编号',
  },
  baseAmount: {
    id: 'bss.payable.fee.baseAmount',
    defaultMessage: '计费金额',
  },
  diffAmount: {
    id: 'bss.payable.fee.diffAmount',
    defaultMessage: '调整金额',
  },
  settledAmount: {
    id: 'bss.payable.fee.settledAmount',
    defaultMessage: '结算金额',
  },
  settledName: {
    id: 'bss.payable.fee.settledName',
    defaultMessage: '结算方',
  },
  bizExpenseNo: {
    id: 'bss.payable.fee.bizExpenseNo',
    defaultMessage: '业务编号',
  },
  orderDate: {
    id: 'bss.payable.orderdDate',
    defaultMessage: '订单日期',
  },
  closeDate: {
    id: 'bss.payable.closeDate',
    defaultMessage: '结单日期',
  },
  receivableAmount: {
    id: 'bss.payable.receivableAmount',
    defaultMessage: '应收金额',
  },
  payableAmount: {
    id: 'bss.payable.payableAmount',
    defaultMessage: '应付金额',
  },
  profitAmount: {
    id: 'bss.payable.profitAmount',
    defaultMessage: '利润',
  },
  grossProfitRatio: {
    id: 'bss.payable.grossProfitRatio',
    defaultMessage: '毛利率',
  },
  pleaseSelectBusinessPartner: {
    id: 'bss.payable.pleaseSelectBusinessPartner',
    defaultMessage: '请选择往来单位',
  },
  bizType: {
    id: 'bss.payable.bizType',
    defaultMessage: '业务单据类别',
  },
  pleaseSelectBizType: {
    id: 'bss.payable.pleaseSelectBizType',
    defaultMessage: '请选择业务单据类别',
  },
  pleaseSelectInvoiceDate: {
    id: 'bss.payable.pleaseSelectInvoiceDate',
    defaultMessage: '请选择单据日期',
  },
  invoiceTitle: {
    id: 'bss.payable.invoiceTitle',
    defaultMessage: '票据抬头',
  },
  paymentMethod: {
    id: 'bss.payable.paymentMethod',
    defaultMessage: '支付方式',
  },
  paymentAmount: {
    id: 'bss.payable.paymentAmount',
    defaultMessage: '付款金额',
  },
  accountingSet: {
    id: 'bss.payable.accountingSet',
    defaultMessage: '结算账套',
  },
  invoicedBy: {
    id: 'bss.payable.invoicedBy',
    defaultMessage: '制单人',
  },
  pleaseSelectInvoicedBy: {
    id: 'bss.payable.pleaseSelectInvoicedBy',
    defaultMessage: '请选择制单人',
  },
  pleaseSelectInvType: {
    id: 'bss.payable.pleaseSelectInvType',
    defaultMessage: '请选择票据类型',
  },
  invoiceStatus: {
    id: 'bss.payable.settlement.invoiceStatus',
    defaultMessage: '票据状态',
  },
  paymentStatus: {
    id: 'bss.payable.settlement.paymentStatus',
    defaultMessage: '付款状态',
  },
  clearDate: {
    id: 'bss.payable.fee.clearDate',
    defaultMessage: '核销日期',
  },
  custOrderNo: {
    id: 'bss.payable.fee.custOrderNo',
    defaultMessage: '订单追踪号',
  },
  sofOrderNo: {
    id: 'bss.payable.fee.sofOrderNo',
    defaultMessage: '货运编号',
  },
  declEntryNo: {
    id: 'bss.payable.fee.declEntryNo',
    defaultMessage: '报关单号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
