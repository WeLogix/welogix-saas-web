import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  repoList: {
    id: 'cms.tradeitem.repo.list',
    defaultMessage: '归类库列表',
  },
  repoOwner: {
    id: 'cms.tradeitem.repo.owner',
    defaultMessage: '所属企业',
  },
  repoCreator: {
    id: 'cms.tradeitem.repo.creator',
    defaultMessage: '创建企业',
  },
  ownRepo: {
    id: 'cms.tradeitem.own.repo',
    defaultMessage: '所属归类库',
  },
  single: {
    id: 'cms.tradeitem.repo.single',
    defaultMessage: '单',
  },
  master: {
    id: 'cms.tradeitem.repo.master',
    defaultMessage: '主',
  },
  slave: {
    id: 'cms.tradeitem.repo.slave',
    defaultMessage: '从',
  },
  workspace: {
    id: 'cms.tradeitem.workspace',
    defaultMessage: '归类工作区',
  },
  taskList: {
    id: 'cms.tradeitem.workspace.task.list',
    defaultMessage: '归类任务列表',
  },
  taskNew: {
    id: 'cms.tradeitem.workspace.new',
    defaultMessage: '新商品归类',
  },
  taskConflict: {
    id: 'cms.tradeitem.workspace.conflict',
    defaultMessage: '归类冲突',
  },
  taskInvalid: {
    id: 'cms.tradeitem.workspace.invalid',
    defaultMessage: '归类失效',
  },
  taskReview: {
    id: 'cms.tradeitem.workspace.review',
    defaultMessage: '待审核',
  },
  hscodeCustoms: {
    id: 'cms.tradeitem.hscode.customs',
    defaultMessage: '海关税则',
  },
  hscodeQuery: {
    id: 'cms.tradeitem.hscode.query',
    defaultMessage: 'HS编码查询',
  },
  importHscodeItems: {
    id: 'cms.tradeitem.hscodeitems.import',
    defaultMessage: '对比导入',
  },
  importHsunit: {
    id: 'cms.tradeitem.hscode.gunit.import',
    defaultMessage: '导入申报单位',
  },
  hscodeSpecial: {
    id: 'cms.tradeitem.hscode.special',
    defaultMessage: '特殊HS编码',
  },
  hscodeChanges: {
    id: 'cms.tradeitem.hscode.changes',
    defaultMessage: '税则变更',
  },
  config: {
    id: 'cms.tradeitem.config',
    defaultMessage: '资源配置',
  },
  tradeItemMaster: {
    id: 'cms.tradeitem.master',
    defaultMessage: '主数据',
  },
  tradeItemBranch: {
    id: 'cms.tradeitem.branch',
    defaultMessage: '分支版本',
  },
  tradeItemHistory: {
    id: 'cms.tradeitem.history',
    defaultMessage: '历史版本',
  },
  tradeItemHistoryAll: {
    id: 'cms.tradeitem.history.all',
    defaultMessage: '全部',
  },
  tradeItemHistoryVersioned: {
    id: 'cms.tradeitem.history.versioned',
    defaultMessage: '可用',
  },
  tradeItemHistoryDisabled: {
    id: 'cms.tradeitem.history.disabled',
    defaultMessage: '禁用',
  },
  searchRepoPlaceholder: {
    id: 'cms.tradeitem.searchRepoPlaceholder',
    defaultMessage: '输入客户名称搜索',
  },
  filterUnclassified: {
    id: 'cms.tradeitem.filter.unclassified',
    defaultMessage: '未归类',
  },
  filterPending: {
    id: 'cms.tradeitem.filter.pending',
    defaultMessage: '归类待定',
  },
  filterClassified: {
    id: 'cms.tradeitem.filter.classified',
    defaultMessage: '已归类',
  },
  tabClassification: {
    id: 'cms.tradeitem.tab.classification',
    defaultMessage: '物料信息',
  },
  itemProperties: {
    id: 'cms.tradeitem.tab.item.properties',
    defaultMessage: '物料属性',
  },
  itemClassification: {
    id: 'cms.tradeitem.tab.item.classification',
    defaultMessage: '归类信息',
  },
  itemTaxes: {
    id: 'cms.tradeitem.tab.item.taxes',
    defaultMessage: '税率信息',
  },
  tabPermit: {
    id: 'cms.tradeitem.tab.permit',
    defaultMessage: '资质证书',
  },
  tabHistory: {
    id: 'cms.tradeitem.tab.history',
    defaultMessage: '历史记录',
  },
  linkSlave: {
    id: 'cms.tradeitem.model.slave.link',
    defaultMessage: '添加关联从库',
  },
  authUserName: {
    id: 'cms.tradeitem.modal.auth.username',
    defaultMessage: '企业名称',
  },
  copProductNo: {
    id: 'cms.tradeitem.col.cop.product.no',
    defaultMessage: '商品货号',
  },
  srcProductNo: {
    id: 'cms.tradeitem.col.src.product.no',
    defaultMessage: '分支标识',
  },
  itemType: {
    id: 'cms.tradeitem.col.item.type',
    defaultMessage: '类型',
  },
  copCode: {
    id: 'cms.tradeitem.col.cop.code',
    defaultMessage: '内部代码',
  },
  copBU: {
    id: 'cms.tradeitem.col.cop.bu',
    defaultMessage: '所属BU',
  },
  copController: {
    id: 'cms.tradeitem.col.cop.controller',
    defaultMessage: '产品负责人',
  },
  copItemGroup: {
    id: 'cms.tradeitem.col.cop.itemgroup',
    defaultMessage: '产品大类',
  },
  copBrand: {
    id: 'cms.tradeitem.col.cop.brand',
    defaultMessage: '品牌',
  },
  processingMethod: {
    id: 'cms.tradeitem.col.processing.method',
    defaultMessage: '工艺/原理',
  },
  materialIngredient: {
    id: 'cms.tradeitem.col.material.ingredient',
    defaultMessage: '材质/成分',
  },
  functionality: {
    id: 'cms.tradeitem.col.cop.functionality',
    defaultMessage: '功能',
  },
  usage: {
    id: 'cms.tradeitem.col.cop.usage',
    defaultMessage: '用途',
  },
  efficiency: {
    id: 'cms.tradeitem.col.cop.efficiency',
    defaultMessage: '能效',
  },
  markPass: {
    id: 'cms.tradeitem.form.mark.pass',
    defaultMessage: '标记直接通过',
  },
  hscode: {
    id: 'cms.tradeitem.col.hscode',
    defaultMessage: '商品编号',
  },
  gName: {
    id: 'cms.tradeitem.col.g.name',
    defaultMessage: '中文品名',
  },
  confidence: {
    id: 'cms.tradeitem.col.confidence',
    defaultMessage: '归类确信度',
  },
  enName: {
    id: 'cms.tradeitem.col.en.description',
    defaultMessage: '英文品名',
  },
  gModel: {
    id: 'cms.tradeitem.col.gmodel',
    defaultMessage: '规范申报要素',
  },
  branchCount: {
    id: 'cms.tradeitem.branch.count',
    defaultMessage: '分支',
  },
  versionedCount: {
    id: 'cms.tradeitem.versioned.count',
    defaultMessage: '保留',
  },
  preHscode: {
    id: 'cms.tradeitem.col.prehscode',
    defaultMessage: '原商品编码',
  },
  preGName: {
    id: 'cms.tradeitem.col.pregname',
    defaultMessage: '原中文品名',
  },
  preGModel: {
    id: 'cms.tradeitem.col.pregmodel',
    defaultMessage: '原规范申报要素',
  },
  element: {
    id: 'cms.tradeitem.col.element',
    defaultMessage: '申报要素',
  },
  gUnit: {
    id: 'cms.tradeitem.col.g.unit',
    defaultMessage: '成交单位',
  },
  gUnit1: {
    id: 'cms.tradeitem.col.g.unit1',
    defaultMessage: '成交单位一',
  },
  gUnit2: {
    id: 'cms.tradeitem.col.g.unit2',
    defaultMessage: '成交单位二',
  },
  gUnit3: {
    id: 'cms.tradeitem.col.g.unit3',
    defaultMessage: '成交单位三',
  },
  unit1: {
    id: 'cms.tradeitem.col.unit1',
    defaultMessage: '法一计量单位',
  },
  unit2: {
    id: 'cms.tradeitem.col.unit2',
    defaultMessage: '法二计量单位',
  },
  fixedQty: {
    id: 'cms.tradeitem.fixed.qty',
    defaultMessage: '固定值',
  },
  fixedUnit: {
    id: 'cms.tradeitem.fixed.unit',
    defaultMessage: '固值单位',
  },
  origCountry: {
    id: 'cms.tradeitem.col.origin.country',
    defaultMessage: '产销国',
  },
  specialNo: {
    id: 'cms.tradeitem.col.special.no',
    defaultMessage: '特殊货号标记',
  },
  unitNetWt: {
    id: 'cms.tradeitem.col.unit.netwt',
    defaultMessage: '单个净重',
  },
  customsControl: {
    id: 'cms.tradeitem.col.customs.control',
    defaultMessage: '海关监管条件',
  },
  inspQuarantine: {
    id: 'cms.tradeitem.col.inspection.quarantine',
    defaultMessage: '检验检疫',
  },
  unitPrice: {
    id: 'cms.tradeitem.col.unit.price',
    defaultMessage: '单价',
  },
  currency: {
    id: 'cms.tradeitem.col.currency',
    defaultMessage: '币制',
  },
  customsPermit: {
    id: 'cms.tradeitem.customs.permit',
    defaultMessage: '海关监管条件',
  },
  ciqPermit: {
    id: 'cms.tradeitem.ciq.permit',
    defaultMessage: '检验检疫条件',
  },
  applCertCode: {
    id: 'cms.tradeitem.appl.certcode',
    defaultMessage: '所需单证',
  },
  preClassifyNo: {
    id: 'cms.tradeitem.col.pre.classify.no',
    defaultMessage: '预归类编号',
  },
  preClassifyStartDate: {
    id: 'cms.tradeitem.col.pre.classify.start.date',
    defaultMessage: '预归类日期',
  },
  preClassifyEndDate: {
    id: 'cms.tradeitem.col.pre.classify.end.date',
    defaultMessage: '到期日期',
  },
  extendAttrib: {
    id: 'cms.tradeitem.repoitem.extend.attrib',
    defaultMessage: '扩展属性',
  },
  attrib1: {
    id: 'cms.tradeitem.repoitem.attrib1',
    defaultMessage: '扩展属性1',
  },
  attrib2: {
    id: 'cms.tradeitem.repoitem.attrib2',
    defaultMessage: '扩展属性2',
  },
  attrib3: {
    id: 'cms.tradeitem.repoitem.attrib3',
    defaultMessage: '扩展属性3',
  },
  attrib4: {
    id: 'cms.tradeitem.repoitem.attrib4',
    defaultMessage: '扩展属性4',
  },
  attrib5: {
    id: 'cms.tradeitem.repoitem.attrib5',
    defaultMessage: '扩展属性5',
  },
  attrib6: {
    id: 'cms.tradeitem.repoitem.attrib6',
    defaultMessage: '扩展属性6',
  },
  specialSplit: {
    id: 'cms.tradeitem.special.split',
    defaultMessage: '独立拆分',
  },
  mfnRates: {
    id: 'cms.tradeitem.tax.mfn.rates',
    defaultMessage: '最惠国税率',
  },
  generalRates: {
    id: 'cms.tradeitem.tax.general.rates',
    defaultMessage: '普通进口税率',
  },
  provisionalRates: {
    id: 'cms.tradeitem.tax.provisionnal.rates',
    defaultMessage: '暂定进口税率',
  },
  vatRates: {
    id: 'cms.tradeitem.tax.vat.rates',
    defaultMessage: '增值税率',
  },
  gstRates: {
    id: 'cms.tradeitem.tax.gst.rates',
    defaultMessage: '消费税率',
  },
  exportRates: {
    id: 'cms.tradeitem.tax.export.rates',
    defaultMessage: '出口关税率',
  },
  exportRebateRates: {
    id: 'cms.tradeitem.tax.export.rebate.rates',
    defaultMessage: '出口退税率',
  },
  specialMerge: {
    id: 'cms.tradeitem.special.merge',
    defaultMessage: '货号合并',
  },
  specialCiq: {
    id: 'cms.tradeitem.special.ciq',
    defaultMessage: '特殊类别',
  },
  addRepo: {
    id: 'cms.tradeitem.repo.add',
    defaultMessage: '新增归类库',
  },
  manageData: {
    id: 'cms.tradeitem.repo.manage.data',
    defaultMessage: '数据管理',
  },
  newComparisonImport: {
    id: 'cms.tradeitem.task.new.comparison.import',
    defaultMessage: '新建对比导入',
  },
  diff: {
    id: 'cms.tradeitem.op.diff',
    defaultMessage: '对比',
  },
  forkItem: {
    id: 'cms.tradeitem.op.fork',
    defaultMessage: '建立归类分支',
  },
  exportAllClassify: {
    id: 'cms.tradeitem.op.export.allclassify',
    defaultMessage: '导出',
  },
  batchImportTradeItems: {
    id: 'cms.tradeitem.op.import.batchImportTradeItems',
    defaultMessage: '批量导入物料',
  },
  repoRule: {
    id: 'cms.tradeitem.repo.rulePanel',
    defaultMessage: '物料库规则设置',
  },
  comparisonRule: {
    id: 'cms.tradeitem.repo.rulePanel.comparison',
    defaultMessage: '物料对比匹配',
  },
  repoRuleExactMatch: {
    id: 'cms.tradeitem.repo.rulePanel.exact.match',
    defaultMessage: '精确匹配',
  },
  repoRuleFuzzyMatch: {
    id: 'cms.tradeitem.repo.rulePanel.fuzzy.match',
    defaultMessage: '模糊匹配(生成归类建议)',
  },
  repoMatchSuggestKey: {
    id: 'cms.tradeitem.repo.rulePanel.suggest.key',
    defaultMessage: '模糊匹配项',
  },
  copProductName: {
    id: 'cms.tradeitem.repo.rulePanel.fuzzy.cop.productName',
    defaultMessage: '品名描述',
  },
  adoptAdvice: {
    id: 'cms.tradeitem.tempitem.adopt.advice',
    defaultMessage: '采纳建议',
  },
  ciqCode: {
    id: 'cms.tradeitem.hscode.ciq.code',
    defaultMessage: '检验检疫编码',
  },
  ciqName: {
    id: 'cms.tradeitem.hscode.ciq.name',
    defaultMessage: '检验检疫名称',
  },
  exportRepoAudit: {
    id: 'cms.tradeitem.export.repo.audit',
    defaultMessage: '导出已审核数据',
  },
  timeQuantum: {
    id: 'cms.tradeitem.export.time.quantum',
    defaultMessage: '查询时间段',
  },
  selectRepos: {
    id: 'cms.tradeitem.export.repo.select',
    defaultMessage: '选择归类库',
  },
  exportOptions: {
    id: 'cms.tradeitem.export.options',
    defaultMessage: '导出选项',
  },
  addCategory: {
    id: 'cms.tradeitem.hscode.addCategory',
    defaultMessage: '添加分类',
  },
  hscodeRange: {
    id: 'cms.tradeitem.hscode.range',
    defaultMessage: 'HsCode范围',
  },
  categoryName: {
    id: 'cms.tradeitem.hscode.category.name',
    defaultMessage: '分类名称',
  },
  judgmentRule: {
    id: 'cms.tradeitem.hscode.judgment.rule',
    defaultMessage: '判断规则',
  },
  selectRuleType: {
    id: 'cms.tradeitem.hscode.select.rule',
    defaultMessage: '选择类别',
  },
  requiredFieldsConfig: {
    id: 'cms.tradeitem.hscode.required.fields.config',
    defaultMessage: '必填项配置',
  },
  dangerFlag: {
    id: 'cms.tradeitem.hscode.required.dangerFlag',
    defaultMessage: '危险品信息',
  },
  declWay: {
    id: 'cms.tradeitem.hscode.declway',
    defaultMessage: '报关类型',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
