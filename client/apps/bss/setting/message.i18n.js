import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  fees: {
    id: 'bss.setting.fees',
    defaultMessage: '费用参数',
  },
  feeItems: {
    id: 'bss.setting.fees.items',
    defaultMessage: '费用元素',
  },
  feeGroups: {
    id: 'bss.setting.fees.groups',
    defaultMessage: '费用分组',
  },
  feeEvents: {
    id: 'bss.setting.fees.events',
    defaultMessage: '费用与事件关联',
  },
  feePermits: {
    id: 'bss.setting.fees.permits',
    defaultMessage: '费用与监管条件',
  },
  newFeeGroup: {
    id: 'bss.setting.new.fees.groups',
    defaultMessage: '新建费用分组',
  },
  newFeeElement: {
    id: 'bss.setting.new.fees.element',
    defaultMessage: '新建费用元素',
  },
  groupsSearchTip: {
    id: 'bss.setting.fee.group.search',
    defaultMessage: '分组代码/分组名称',
  },
  elementsSearchTip: {
    id: 'bss.setting.fee.element.search',
    defaultMessage: '费用代码/费用名称',
  },
  newChildFeeElement: {
    id: 'bss.setting.new.child.fees.element',
    defaultMessage: '新建子费用元素',
  },
  currencies: {
    id: 'bss.setting.currencies',
    defaultMessage: '币制汇率',
  },
  customsExRates: {
    id: 'bss.setting.currencies.customs.exchange.rates',
    defaultMessage: '海关汇率',
  },
  copExRates: {
    id: 'bss.setting.currencies.cop.exchange.rates',
    defaultMessage: '企业汇率',
  },
  addCopExRate: {
    id: 'bss.setting.currencies.add.cop.rate',
    defaultMessage: '添加企业汇率',
  },
  exchangeRates: {
    id: 'bss.setting.currencies.exchange.rates',
    defaultMessage: '汇率',
  },
  taxes: {
    id: 'bss.setting.taxes',
    defaultMessage: '开票税率',
  },
  taxRates: {
    id: 'bss.setting.tax.rates',
    defaultMessage: '税率(%)',
  },
  createTax: {
    id: 'bss.setting.tax.create',
    defaultMessage: '创建开票税率',
  },
  invoicingCode: {
    id: 'bss.setting.tax.invoicingCode',
    defaultMessage: '开票代码',
  },
  invoicingType: {
    id: 'bss.setting.tax.invoicingType',
    defaultMessage: '开票类别',
  },
  invoiceCategory: {
    id: 'bss.setting.tax.invoiceCategory',
    defaultMessage: '发票种类',
  },
  pleaseInputInvoicingCode: {
    id: 'bss.setting.tax.pleaseInputInvoicingCode',
    defaultMessage: '请填写开票代码',
  },
  pleaseInputinvoicingType: {
    id: 'bss.setting.tax.pleaseInputinvoicingType',
    defaultMessage: '请填写开票类别',
  },
  pleaseSelectInvoiceCategory: {
    id: 'bss.setting.tax.pleaseSelectInvoiceCategory',
    defaultMessage: '请选择发票种类',
  },
  pleaseInputTaxRate: {
    id: 'bss.setting.tax.pleaseInputTaxRate',
    defaultMessage: '请填写开票税率',
  },
  publishDate: {
    id: 'bss.setting.currency.publishDate',
    defaultMessage: '发布日期',
  },
  effectDate: {
    id: 'bss.setting.currency.effectDate',
    defaultMessage: '生效日期',
  },
  currCode: {
    id: 'bss.setting.currency.currCode',
    defaultMessage: '币种',
  },
  billTemplates: {
    id: 'bss.setting.bill.templates',
    defaultMessage: '账单模板',
  },
  accountSets: {
    id: 'bss.setting.account.sets',
    defaultMessage: '账套与账户',
  },
  subjects: {
    id: 'bss.setting.account.subjects',
    defaultMessage: '会计科目',
  },
  payTypes: {
    id: 'bss.setting.pay.types',
    defaultMessage: '结算类别',
  },
  newAccountSet: {
    id: 'bss.setting.accountset.new',
    defaultMessage: '新建账套',
  },
  companyName: {
    id: 'bss.setting.accountset.company.name',
    defaultMessage: '单位名称',
  },
  pleaseInputCompanyName: {
    id: 'bss.setting.accountset.company.pleaseInputCompanyName',
    defaultMessage: '请输入单位名称',
  },
  companyUniqueCode: {
    id: 'bss.setting.accountset.company.scc',
    defaultMessage: '统一社会信用代码',
  },
  pleaseInputCompanyUniqueCode: {
    id: 'bss.setting.accountset.company.pleaseInputCorrectCompanyUniqueCode',
    defaultMessage: '请输入正确的统一社会信用代码',
  },
  vatTax: {
    id: 'bss.setting.accountset.vatTax',
    defaultMessage: '增值税种类',
  },
  pleaseSelectVatTax: {
    id: 'bss.setting.accountset.pleaseSelectVatTax',
    defaultMessage: '请选择增值税种类',
  },
  setInfo: {
    id: 'bss.setting.accountset.setInfo',
    defaultMessage: '账套信息',
  },
  cashAccount: {
    id: 'bss.setting.accountset.cashAccount',
    defaultMessage: '现金账户',
  },
  bankAccount: {
    id: 'bss.setting.accountset.bankAccount',
    defaultMessage: '银行账户',
  },
  accountName: {
    id: 'bss.setting.cashAccount.accountName',
    defaultMessage: '账户名称',
  },
  pleaseInputAccountName: {
    id: 'bss.setting.cashAccount.pleaseInputAccountName',
    defaultMessage: '请输入账户名称',
  },
  code: {
    id: 'bss.setting.account.code',
    defaultMessage: '代码',
  },
  currency: {
    id: 'bss.setting.account.currency',
    defaultMessage: '币制',
  },
  bankName: {
    id: 'bss.setting.bank.name',
    defaultMessage: '开户行',
  },
  bankAccountNo: {
    id: 'bss.setting.bankAccount.no',
    defaultMessage: '银行账号',
  },
  accountSetChanged: {
    id: 'bss.setting.accountSet.changed',
    defaultMessage: '账套已切换',
  },
  pleaseInputBankAccountNo: {
    id: 'bss.setting.cashAccount.pleaseInputBankAccount',
    defaultMessage: '请输入银行账号',
  },
  subjectNo: {
    id: 'bss.setting.subject.no',
    defaultMessage: '科目编码',
  },
  subjectName: {
    id: 'bss.setting.subject.name',
    defaultMessage: '科目名称',
  },
  subjectType: {
    id: 'bss.setting.subject.type',
    defaultMessage: '科目分类',
  },
  mnemonicCode: {
    id: 'bss.setting.subject.mnemonicCode',
    defaultMessage: '助记码',
  },
  subjectBalance: {
    id: 'bss.setting.subject.subjectBalance',
    defaultMessage: '余额方向',
  },
  newSubject: {
    id: 'bss.setting.subject.new',
    defaultMessage: '新建会计科目',
  },
  editSubject: {
    id: 'bss.setting.subject.edit',
    defaultMessage: '编辑会计科目',
  },
  debit: {
    id: 'bss.setting.subject.subjectBalance.debit',
    defaultMessage: '借',
  },
  credit: {
    id: 'bss.setting.subject.subjectBalance.credit',
    defaultMessage: '贷',
  },
  subjectStatus: {
    id: 'bss.setting.subject.subjectStatus',
    defaultMessage: '科目状态',
  },
  pleaseInputSubjectNo: {
    id: 'bss.setting.subject.pleaseInputSubjectNo',
    defaultMessage: '请输入科目编码',
  },
  pleaseInputSubjectName: {
    id: 'bss.setting.subject.pleaseInputSubjectName',
    defaultMessage: '请输入科目名称',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
