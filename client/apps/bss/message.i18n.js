import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'bss.module.dashboard',
    defaultMessage: '工作台',
  },
  income: {
    id: 'bss.module.income',
    defaultMessage: '收入',
  },
  receivable: {
    id: 'bss.module.receivable',
    defaultMessage: '应收结算',
  },
  customerBill: {
    id: 'bss.module.customer.bill',
    defaultMessage: '客户账单',
  },
  claimPayment: {
    id: 'bss.module.payment.claim',
    defaultMessage: '收款认领',
  },
  expense: {
    id: 'bss.module.expense',
    defaultMessage: '支出',
  },
  vendorBill: {
    id: 'bss.module.vendor.bill',
    defaultMessage: '服务商账单',
  },
  payable: {
    id: 'bss.module.payable',
    defaultMessage: '应付结算',
  },
  applyPayment: {
    id: 'bss.module.payment.apply',
    defaultMessage: '付款申请',
  },
  accounting: {
    id: 'bss.module.accounting',
    defaultMessage: '会计',
  },
  invoice: {
    id: 'bss.module.invoice',
    defaultMessage: '发票管理',
  },
  outputInvoice: {
    id: 'bss.module.invoice.output',
    defaultMessage: '销项发票',
  },
  inputInvoice: {
    id: 'bss.module.invoice.input',
    defaultMessage: '进项发票',
  },
  payment: {
    id: 'bss.module.payment',
    defaultMessage: '收付款管理',
  },
  voucher: {
    id: 'bss.module.accounting.voucher',
    defaultMessage: '凭证管理',
  },
  settlementSetting: {
    id: 'bss.module.settlement.setting',
    defaultMessage: '结算设置',
  },
  createSettlement: {
    id: 'bss.module.create.settlement',
    defaultMessage: '新建结算单',
  },
  approval: {
    id: 'bss.module.approval',
    defaultMessage: '审批',
  },
  voucherEntries: {
    id: 'bss.module.voucher.entries',
    defaultMessage: '凭证分录',
  },
  expenseFeeCode: {
    id: 'bss.module.fee.code',
    defaultMessage: '支出代码',
  },
  expenseFeeName: {
    id: 'bss.module.fee.name',
    defaultMessage: '支出名称',
  },
  expenseFeeType: {
    id: 'bss.module.fee.type',
    defaultMessage: '支出类型',
  },
  amount: {
    id: 'bss.module.fee.amount',
    defaultMessage: '金额',
  },
  taxRate: {
    id: 'bss.module.fee.taxRate',
    defaultMessage: '税率%',
  },
  taxAmount: {
    id: 'bss.module.fee.taxAmount',
    defaultMessage: '税额',
  },
  includedAmount: {
    id: 'bss.module.fee.includedAmount',
    defaultMessage: '价税合计',
  },
  paymentMethod: {
    id: 'bss.module.paymentMethod',
    defaultMessage: '支付方式',
  },
  paymentAmount: {
    id: 'bss.module.paymentAmount',
    defaultMessage: '付款金额',
  },
  businessPartner: {
    id: 'bss.module.businessPartner',
    defaultMessage: '往来单位',
  },
  voucherDate: {
    id: 'bss.payable.fee.voucherDate',
    defaultMessage: '单据日期',
  },
  payeeBankName: {
    id: 'bss.payable.payeeBankName',
    defaultMessage: '对方开户银行',
  },
  payeeAccountNo: {
    id: 'bss.payable.payeeAccountNo',
    defaultMessage: '对方银行账号',
  },
  settlementNo: {
    id: 'bss.payable.settlementNo',
    defaultMessage: '结算单号',
  },
  invoiceType: {
    id: 'bss.payable.invoiceType',
    defaultMessage: '票据类型',
  },
  invoiceNo: {
    id: 'bss.payable.invoiceNo',
    defaultMessage: '票据号码',
  },
  invoiceDate: {
    id: 'bss.payable.invoiceDate',
    defaultMessage: '发票日期',
  },
  invoiceAmount: {
    id: 'bss.payable.invoiceAmount',
    defaultMessage: '结算金额',
  },
  paymentNo: {
    id: 'bss.payment.no',
    defaultMessage: '付款单号',
  },
  voucherNo: {
    id: 'bss.module.voucherNo',
    defaultMessage: '凭证单号',
  },
  confirmedBy: {
    id: 'bss.module.confirmedBy',
    defaultMessage: '复核人 ',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
