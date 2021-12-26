import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  statusApplied: {
    id: 'bss.invoice.status.applied',
    defaultMessage: '开票申请',
  },
  statusInvoiced: {
    id: 'bss.invoice.status.invoiced',
    defaultMessage: '已开具',
  },
  statusPaymentReceived: {
    id: 'bss.invoice.status.payment.received',
    defaultMessage: '已核销',
  },
  inputInvoice: {
    id: 'bss.invoice.input',
    defaultMessage: '进项发票',
  },
  outputInvoice: {
    id: 'bss.invoice.output',
    defaultMessage: '销项发票',
  },
  cspInvoice: {
    id: 'bss.invoice.customs.special.payment',
    defaultMessage: '海关专用缴款书',
  },
  requestOutputInvoice: {
    id: 'bss.invoice.output.request',
    defaultMessage: '申请开票',
  },
  confirmOutputInvoice: {
    id: 'bss.invoice.output.confirm',
    defaultMessage: '开票确认',
  },
  confirmInputInvoice: {
    id: 'bss.invoice.input.confirm',
    defaultMessage: '发票认证',
  },
  searchTips: {
    id: 'bss.invoice.search.tips',
    defaultMessage: '开票申请号/账单号/发票号',
  },
  invoiceRequestNo: {
    id: 'bss.invoice.invoiceRequestNo',
    defaultMessage: '开票申请号',
  },
  customerName: {
    id: 'bss.invoice.customerName',
    defaultMessage: '客户名称',
  },
  billName: {
    id: 'bss.invoice.billName',
    defaultMessage: '账单号',
  },
  invoiceType: {
    id: 'bss.invoice.type',
    defaultMessage: '票据类型',
  },
  invoiceNo: {
    id: 'bss.invoice.no',
    defaultMessage: '发票号',
  },
  invoiceAmount: {
    id: 'bss.invoice.amount',
    defaultMessage: '开票金额',
  },
  taxAmount: {
    id: 'bss.invoice.taxAmount',
    defaultMessage: '税额',
  },
  taxRate: {
    id: 'bss.invoice.taxRate',
    defaultMessage: '税率',
  },
  taxIncluded: {
    id: 'bss.invoice.tax.included',
    defaultMessage: '含税',
  },
  totalInvoiceAmount: {
    id: 'bss.invoice.totalInvoiceAmount',
    defaultMessage: '价税合计',
  },
  invoicedDate: {
    id: 'bss.invoice.invoicedDate',
    defaultMessage: '开票日期',
  },
  confirmBillInvoice: {
    id: 'bss.invoice.confirmBillInvoice',
    defaultMessage: '开票确认',
  },
  editBillInvoice: {
    id: 'bss.invoice.editBillInvoice',
    defaultMessage: '修改开票申请',
  },
  taxpayerId: {
    id: 'bss.invoice.taxpayerId',
    defaultMessage: '纳税人识别号',
  },
  pleaseInputInvoiceNo: {
    id: 'bss.invoice.pleaseInputInvoiceNo',
    defaultMessage: '请输入发票号',
  },
  pleaseSelectInvoicedDate: {
    id: 'bss.invoice.pleaseSelectInvoicedDate',
    defaultMessage: '请选择开票日期',
  },
  invoicedBy: {
    id: 'bss.invoice.invoicedBy',
    defaultMessage: '开票人',
  },
  ensureReturn: {
    id: 'bss.invoice.ensureReturn',
    defaultMessage: '确认退回?',
  },
  requestDate: {
    id: 'bss.invoice.requestDate',
    defaultMessage: '申请日期',
  },
  requestBy: {
    id: 'bss.invoice.requestBy',
    defaultMessage: '申请人',
  },
  buyer: {
    id: 'bss.invoice.buyer',
    defaultMessage: '购买方',
  },
  seller: {
    id: 'bss.invoice.seller',
    defaultMessage: '销售方',
  },
  identificationNo: {
    id: 'bss.invoice.identificationNo',
    defaultMessage: '纳税识别号',
  },
  invoiceCode: {
    id: 'bss.invoice.invoiceCode',
    defaultMessage: '发票代码',
  },
  invoiceEdit: {
    id: 'bss.invoice.invoiceEdit',
    defaultMessage: '编辑发票',
  },
  pleaseSelectBuyer: {
    id: 'bss.invoice.pleaseSelectBuyer',
    defaultMessage: '请选择购买方',
  },
  pleaseSelectConfirmBy: {
    id: 'bss.invoice.pleaseSelectConfirmBy',
    defaultMessage: '请选择复核人',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
