import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  billingCenter: {
    id: 'transport.tariff.billing.center',
    defaultMessage: '账务中心',
  },
  transportTariff: {
    id: 'transport.tariff',
    defaultMessage: '价格管理',
  },
  quoteNo: {
    id: 'transport.tariff.quoteNo',
    defaultMessage: '报价编号',
  },
  partnerName: {
    id: 'transport.tariff.partner.name',
    defaultMessage: '合作伙伴',
  },
  tariffType: {
    id: 'transport.tariff.type',
    defaultMessage: '价格类型',
  },
  effectiveDate: {
    id: 'transport.tariff.effective.date',
    defaultMessage: '生效时间',
  },
  publishDate: {
    id: 'transport.tariff.publishDate',
    defaultMessage: '发布时间',
  },
  version: {
    id: 'transport.tariff.version',
    defaultMessage: '版本',
  },
  tariffStatus: {
    id: 'transport.tariff.status',
    defaultMessage: '状态',
  },
  tariffRevisions: {
    id: 'transport.tariff.revisions',
    defaultMessage: '修订次数',
  },
  publisher: {
    id: 'transport.tariff.publisher',
    defaultMessage: '发布者',
  },
  editor: {
    id: 'transport.tariff.editor',
    defaultMessage: ' 最后修订人',
  },
  revisionDate: {
    id: 'transport.tariff.revisionDate',
    defaultMessage: ' 最后修订时间',
  },
  edit: {
    id: 'transport.tariff.edit',
    defaultMessage: '编辑',
  },
  tariffCreate: {
    id: 'transport.tariff.create',
    defaultMessage: '新建价格协议',
  },
  searchPlaceholder: {
    id: 'transport.tariff.search.placeholder',
    defaultMessage: '搜索协议 报价编号/合作伙伴',
  },
  quoteManage: {
    id: 'transport.tariff.quote_manage',
    defaultMessage: '报价管理',
  },
  newQuote: {
    id: 'transport.tariff.new_quote',
    defaultMessage: '新建报价',
  },
  editQuote: {
    id: 'transport.tariff.edit_quote',
    defaultMessage: '修订报价',
  },
  tariffKinds: {
    id: 'transport.tariff.tariff_kinds',
    defaultMessage: '报价类型',
  },
  partners: {
    id: 'transport.tariff.partners',
    defaultMessage: '客户/供应商',
  },
  transMode: {
    id: 'transport.tariff.trans_mode',
    defaultMessage: '运输方式',
  },
  declareWay: {
    id: 'transport.tariff.declare_way',
    defaultMessage: '报关类型',
  },
  serialNo: {
    id: 'transport.tariff.serial_no',
    defaultMessage: '序号',
  },
  feeName: {
    id: 'transport.tariff.fee_name',
    defaultMessage: '费用名称',
  },
  feeCode: {
    id: 'transport.tariff.fee_code',
    defaultMessage: '费用代码',
  },
  feeGroup: {
    id: 'transport.tariff.fee_group',
    defaultMessage: '费用分组',
  },
  feeType: {
    id: 'transport.tariff.fee_type',
    defaultMessage: '费用类型',
  },
  billingCondition: {
    id: 'transport.tariff.billing_condition',
    defaultMessage: '计费条件',
  },
  billingWay: {
    id: 'transport.tariff.billing_way',
    defaultMessage: '计费方式',
  },
  formulaFactor: {
    id: 'transport.tariff.formula_factor',
    defaultMessage: '单价/公式',
  },
  minAmount: {
    id: 'transport.tariff.min_amount',
    defaultMessage: '下限金额',
  },
  maxAmount: {
    id: 'transport.tariff.max_amount',
    defaultMessage: '上限金额',
  },
  defaultInvoiceParty: {
    id: 'transport.tariff.invoice_party',
    defaultMessage: '默认发票抬头',
  },
  defaultInvoiceCat: {
    id: 'transport.tariff.default_invoice_cat',
    defaultMessage: '默认发票种类',
  },
  settle: {
    id: 'transport.tariff.settle',
    defaultMessage: '允许结算',
  },
  splitBillingAllowed: {
    id: 'transport.tariff.split_billing',
    defaultMessage: '允许分次结算',
  },
  feeCategory: {
    id: 'transport.tariff.category',
    defaultMessage: '费用分类',
  },
  feeStyle: {
    id: 'transport.tariff.fee_style',
    defaultMessage: '费用类型',
  },
  chargeMode: {
    id: 'transport.tariff.charge_mode',
    defaultMessage: '计费方式',
  },
  unitPrice: {
    id: 'transport.tariff.unit_quote',
    defaultMessage: '计费单价',
  },
  modifiedCount: {
    id: 'transport.tariff.modified_count',
    defaultMessage: '修订次数',
  },
  modifiedBy: {
    id: 'transport.tariff.modified_by',
    defaultMessage: '最后修订人',
  },
  modifiedTime: {
    id: 'transport.tariff.modified_time',
    defaultMessage: '最后修订时间',
  },
  enabledOp: {
    id: 'transport.tariff.enabledOp',
    defaultMessage: '是否启用',
  },
  operation: {
    id: 'transport.tariff.operation',
    defaultMessage: '操作',
  },
  save: {
    id: 'transport.tariff.save',
    defaultMessage: '保存',
  },
  copy: {
    id: 'transport.tariff.copy',
    defaultMessage: '复制',
  },
  cancel: {
    id: 'transport.tariff.cancel',
    defaultMessage: '取消',
  },
  delete: {
    id: 'transport.tariff.delete',
    defaultMessage: '删除',
  },
  addCosts: {
    id: 'transport.tariff.add_costs',
    defaultMessage: '增加费用项',
  },
  requested: {
    id: 'transport.tariff.requested',
    defaultMessage: '必选',
  },
  remark: {
    id: 'transport.tariff.remark',
    defaultMessage: '加注标签',
  },
  invoiceEn: {
    id: 'transport.tariff.invoiceEn',
    defaultMessage: '是否开票',
  },
  taxRate: {
    id: 'transport.tariff.tax.rate',
    defaultMessage: '开票税率',
  },
  status: {
    id: 'transport.tariff.status',
    defaultMessage: '状态',
  },
  modify: {
    id: 'transport.tariff.modify',
    defaultMessage: '修改',
  },
  enable: {
    id: 'transport.tariff.enable',
    defaultMessage: '启用',
  },
  disable: {
    id: 'transport.tariff.disable',
    defaultMessage: '禁用',
  },
  view: {
    id: 'transport.tariff.view',
    defaultMessage: '查看',
  },
  transModeMeterGoodsType: {
    id: 'transport.tariff.transModeMeterGoodsType',
    defaultMessage: '运输方式/计价方式/货物类型',
  },
  pickupEstDate: {
    id: 'transport.tariff.pickupEstDate',
    defaultMessage: '预计提货日期',
  },
  deliverEstDate: {
    id: 'transport.tariff.deliverEstDate',
    defaultMessage: '预计送货日期',
  },
  createdDate: {
    id: 'transport.tariff.createdDate',
    defaultMessage: '创建日期',
  },
  createdBy: {
    id: 'transport.tariff.createdBy',
    defaultMessage: '创建者',
  },
  lastUpdatedBy: {
    id: 'transport.tariff.updatedBy',
    defaultMessage: '最近更新者',
  },
  lastUpdatedDate: {
    id: 'transport.tariff.updatedDate',
    defaultMessage: '最近更新时间',
  },
});
export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
export const formatGlobalMsg = formati18n(globalMessages);
