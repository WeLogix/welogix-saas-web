import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import expenseMessage from '../../cms/billing/message.i18n';

const messages = defineMessages({
  tmsSearchPlaceholder: {
    id: 'transport.billing.search',
    defaultMessage: '运输编号/订单追踪号',
  },
  billing: {
    id: 'transport.billing',
    defaultMessage: '账单',
  },
  billingCenter: {
    id: 'transport.billing.center',
    defaultMessage: '账务中心',
  },
  billingManagement: {
    id: 'transport.billing.management',
    defaultMessage: '费用管理',
  },
  receivable: {
    id: 'transport.billing.receivable',
    defaultMessage: '应收',
  },
  payable: {
    id: 'transport.billing.payable',
    defaultMessage: '应付',
  },
  createBilling: {
    id: 'transport.billing.createBilling',
    defaultMessage: '创建账单',
  },
  nextStep: {
    id: 'transport.billing.nextStep',
    defaultMessage: '下一步',
  },
  billingName: {
    id: 'transport.billing.billingName',
    defaultMessage: '账单名称',
  },
  save: {
    id: 'transport.billing.save',
    defaultMessage: '保存',
  },
  pickupEstDate: {
    id: 'transport.billing.form.pickupEstDate',
    defaultMessage: '预计提货日期',
  },
  deliverEstDate: {
    id: 'transport.billing.form.deliverEstDate',
    defaultMessage: '预计送货日期',
  },
  pickupActDate: {
    id: 'transport.billing.form.pickupActDate',
    defaultMessage: '实际提货日期',
  },
  deliverActDate: {
    id: 'transport.billing.form.deliverActDate',
    defaultMessage: '实际送货日期',
  },
  namePlaceholder: {
    id: 'transport.billing.form.name.placeholder',
    defaultMessage: '请输入账单名称',
  },
  chooseModel: {
    id: 'transport.billing.form.chooseModel',
    defaultMessage: '范围方式',
  },
  chooseModelPlaceholder: {
    id: 'transport.billing.form.chooseModel.placeholder',
    defaultMessage: '请选择范围方式',
  },
  rangePlaceholder: {
    id: 'transport.billing.form.range.placeholder',
    defaultMessage: '请选择账单周期',
  },
  partner: {
    id: 'transport.billing.form.partner',
    defaultMessage: '合作伙伴',
  },
  partnerPlaceholder: {
    id: 'transport.billing.form.partner.placeholder',
    defaultMessage: '请选择合作伙伴',
  },
  range: {
    id: 'transport.billing.form.range',
    defaultMessage: '账单周期',
  },
  checkBilling: {
    id: 'transport.billing.check',
    defaultMessage: '对账',
  },
  editBilling: {
    id: 'transport.billing.edit',
    defaultMessage: '修改账单',
  },
  viewBilling: {
    id: 'transport.billin.view',
    defaultMessage: '查看账单',
  },
  accept: {
    id: 'transport.billing.accept',
    defaultMessage: '接受',
  },
  export: {
    id: 'transport.billing.export',
    defaultMessage: '导出',
  },
  expense: {
    id: 'transport.billing.expense',
    defaultMessage: '费用',
  },
  exportExcel: {
    id: 'transport.billing.exportExcel',
    defaultMessage: '导出账单Excel',
  },
  custOrderNo: {
    id: 'transport.billing.custOrderNo',
    defaultMessage: '订单追踪号',
  },
  shipmtNo: {
    id: 'transport.billing.shipmtNo',
    defaultMessage: '运输编号',
  },
  departurePlace: {
    id: 'transport.billing.departure_place',
    defaultMessage: '起始地',
  },
  arrivalPlace: {
    id: 'transport.billing.arrival_place',
    defaultMessage: '目的地',
  },
  loadWt: {
    id: 'transport.billing.load_wt',
    defaultMessage: '重量',
  },
  loadVol: {
    id: 'transport.billing.load_vol',
    defaultMessage: '体积',
  },
  sumSvcCharge: {
    id: 'transport.billing.sum_svc_charge',
    defaultMessage: '服务费',
  },
  sumAdvCharge: {
    id: 'transport.billing.sum_adv_charge',
    defaultMessage: '代垫费',
  },
  sumSpcCharge: {
    id: 'transport.billing.sum_spc_charge',
    defaultMessage: '特殊费',
  },
  buyerName: {
    id: 'transport.billing.buyer.name',
    defaultMessage: '客户名称',
  },
  sellerName: {
    id: 'transport.billing.seller.name',
    defaultMessage: '承运商名称',
  },
  invoiceParty: {
    id: 'transport.billing.expense.invoice_party',
    defaultMessage: '发票抬头',
  },
  invoiceCat: {
    id: 'transport.billing.expense.invoice_cat',
    defaultMessage: '发票类型',
  },
  flowName: {
    id: 'transport.modals.expense.flow.name',
    defaultMessage: '流程',
  },
  taxRate: {
    id: 'transport.modals.tax.rate',
    defaultMessage: '税率',
  },
  expenseDetail: {
    id: 'transport.modals.expense.detail',
    defaultMessage: '费用明细',
  },
  createQuote: {
    id: 'transport.billing.quote.create',
    defaultMessage: '新建报价',
  },
  cloneQuote: {
    id: 'transport.billing.quote.clone',
    defaultMessage: '复制报价',
  },
  more: {
    id: 'transport.billing.more',
    defaultMessage: '更多操作',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages, ...expenseMessage });
