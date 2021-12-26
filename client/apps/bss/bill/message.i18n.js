import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  bill: {
    id: 'bss.bill',
    defaultMessage: '账单管理',
  },
  createBill: {
    id: 'bss.bill.create',
    defaultMessage: '新建账单',
  },
  buyerBill: {
    id: 'bss.bill.buyer.bill',
    defaultMessage: '客户账单',
  },
  sellerBill: {
    id: 'bss.bill.seller.bill',
    defaultMessage: '服务商账单',
  },
  offlineBill: {
    id: 'bss.bill.type.offline.bill',
    defaultMessage: '线下账单',
  },
  forwardProposedBill: {
    id: 'bss.bill.type.forward.proposed.bill',
    defaultMessage: '正向账单',
  },
  backwardProposedBill: {
    id: 'bss.bill.type.backward.proposed.bill',
    defaultMessage: '反向账单',
  },
  expense: {
    id: 'bss.bill.expense',
    defaultMessage: '费用',
  },
  pendingExpense: {
    id: 'bss.bill.pending.expense',
    defaultMessage: '未入账费用',
  },
  processingBills: {
    id: 'bss.bill.processing',
    defaultMessage: '结算中的账单',
  },
  billStatus: {
    id: 'bss.bill.status',
    defaultMessage: '账单状态',
  },
  statusDraft: {
    id: 'bss.bill.status.draft',
    defaultMessage: '草稿',
  },
  statusReconciling: {
    id: 'bss.bill.status.reconciling',
    defaultMessage: '待对账',
  },
  statusInvoicing: {
    id: 'bss.bill.status.invoicing',
    defaultMessage: '待开票',
  },
  statusWriteOff: {
    id: 'bss.bill.status.write.off',
    defaultMessage: '未核销',
  },
  writtenOffBills: {
    id: 'bss.bill.written.off',
    defaultMessage: '核销完成',
  },
  searchTips: {
    id: 'bss.bill.search.tips',
    defaultMessage: '账单名称',
  },
  billTemplates: {
    id: 'bss.bill.templates',
    defaultMessage: '账单模板',
  },
  billStatementTemplateList: {
    id: 'bss.bill.staetment.template.list',
    defaultMessage: '账单模板',
  },
  newBillTemplate: {
    id: 'bss.bill.template.create',
    defaultMessage: '新建账单模板',
  },
  templateSearchTips: {
    id: 'bss.bill.template.search.tips',
    defaultMessage: '模板名称/结算对象名称',
  },
  publicBillTemplate: {
    id: 'bss.public.bill.template',
    defaultMessage: '全局模板',
  },
  newBill: {
    id: 'bss.bill.create',
    defaultMessage: '新建账单',
  },
  billName: {
    id: 'bss.bill.name',
    defaultMessage: '账单名称',
  },
  settledAmount: {
    id: 'bss.bill.settledAmount',
    defaultMessage: '账单结算金额',
  },
  billDuration: {
    id: 'bss.bill.bill.duration',
    defaultMessage: '账期',
  },
  pleaseInputBillName: {
    id: 'bss.bill.pleaseInputBillName',
    defaultMessage: '账单名称必填',
  },
  pleaseSelectBillType: {
    id: 'bss.bill.pleaseSelectBillType',
    defaultMessage: '账单类型必选',
  },
  pleaseSelectPartner: {
    id: 'bss.bill.pleaseSelectPartner',
    defaultMessage: '结算对象必选',
  },
  pleaseSelectBillTemplate: {
    id: 'bss.bill.pleaseSelectBillTemplate',
    defaultMessage: '账单模板必选',
  },
  pleaseSelectBillDate: {
    id: 'bss.bill.pleaseSelectBillDate',
    defaultMessage: '账期时间必选',
  },
  paymentDays: {
    id: 'bss.bill.paymentDays',
    defaultMessage: '账期',
  },
  byOrderDate: {
    id: 'bss.bill.by.order.date',
    defaultMessage: '按订单日期',
  },
  byClosedDate: {
    id: 'bss.bill.by.closed.date',
    defaultMessage: '按结单日期',
  },
  feeName: {
    id: 'bss.bill.fee.name',
    defaultMessage: '费用名称',
  },
  feeCodes: {
    id: 'bss.bill.fee.codes',
    defaultMessage: '费用项',
  },
  addFee: {
    id: 'bss.bill.fee.add',
    defaultMessage: '添加费用',
  },
  billType: {
    id: 'bss.bill.type',
    defaultMessage: '账单类型',
  },
  requestInvoice: {
    id: 'bss.bill.invoice.request',
    defaultMessage: '开票申请',
  },
  customerName: {
    id: 'bss.bill.invoice.customer',
    defaultMessage: '客户名称',
  },
  amount: {
    id: 'bss.bill.invoice.amount',
    defaultMessage: '金额',
  },
  invoiceAmount: {
    id: 'bss.bill.invoice.invoiceAmount',
    defaultMessage: '开票金额',
  },
  invoiceType: {
    id: 'bss.bill.invoice.type',
    defaultMessage: '开票类型',
  },
  noninvoiceAmount: {
    id: 'bss.bill.invoice.noninvoiceAmount',
    defaultMessage: '待开票金额',
  },
  invoicingAmount: {
    id: 'bss.bill.invoice.invoicingAmount',
    defaultMessage: '待确认开票金额',
  },
  invoicedAmount: {
    id: 'bss.bill.invoice.invoicedAmount',
    defaultMessage: '已开票金额',
  },
  taxAmount: {
    id: 'bss.bill.invoice.taxAmount',
    defaultMessage: '税金',
  },
  taxRate: {
    id: 'bss.bill.invoice.taxRate',
    defaultMessage: '税率',
  },
  taxIncluded: {
    id: 'bss.bill.invoice.tax.included',
    defaultMessage: '含税',
  },
  totalInvoiceAmount: {
    id: 'bss.bill.invoice.totalInvoiceAmount',
    defaultMessage: '价税合计',
  },
  pleaseInputInvoiceAmount: {
    id: 'bss.bill.invoice.pleaseInputInvoiceAmount',
    defaultMessage: '请填写开票金额',
  },
  pleaseSelectInvoiceType: {
    id: 'bss.bill.invoice.pleaseSelectInvoiceType',
    defaultMessage: '请选择开票类型',
  },
  addToNew: {
    id: 'bss.bill.statements.to.new',
    defaultMessage: '添加到新建账单',
  },
  addToDraft: {
    id: 'bss.bill.statements.to.draft',
    defaultMessage: '添加到草稿账单',
  },
  billableStatementSearchTips: {
    id: 'bss.bill.billable.statement.search.tips',
    defaultMessage: '货运编号/订单追踪号',
  },
  feeParams: {
    id: 'bss.bill.template.fee.params',
    defaultMessage: '费用参数',
  },
  errorMessage: {
    id: 'bss.bill.template.fee.error.message',
    defaultMessage: '费用名称已存在',
  },
  pleaseSelectReconcileType: {
    id: 'bss.bill.send.pleaseSelectReconcileType',
    defaultMessage: '请选择对账方式',
  },
  email: {
    id: 'bss.bill.send.email',
    defaultMessage: '发送邮件',
  },
  reconcileType: {
    id: 'bss.bill.send.reconcileType',
    defaultMessage: '对账方式',
  },
  reconcileOnline: {
    id: 'bss.bill.reconcileOnline',
    defaultMessage: '线上对账',
  },
  reconcileOffline: {
    id: 'bss.bill.reconcileOffline',
    defaultMessage: '线下对账',
  },
  importSellerBill: {
    id: 'bss.bill.seller.bill.import',
    defaultMessage: '导入服务商账单',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
