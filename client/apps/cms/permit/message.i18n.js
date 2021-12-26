import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  permit: {
    id: 'cms.permit',
    defaultMessage: '资质证书',
  },
  filterValid: {
    id: 'cms.permit.filter.valid',
    defaultMessage: '当前有效',
  },
  filterExpiring: {
    id: 'cms.permit.filter.expiring',
    defaultMessage: '即将失效',
  },
  filterInvalid: {
    id: 'cms.permit.filter.invalid',
    defaultMessage: '已失效',
  },
  filterIncomplete: {
    id: 'cms.permit.filter.incomplete',
    defaultMessage: '未完整',
  },
  filterDiscarded: {
    id: 'cms.permit.filter.discarded',
    defaultMessage: '已废弃',
  },
  infoTab: {
    id: 'cms.permit.tab.info',
    defaultMessage: '基本信息',
  },
  itemsTab: {
    id: 'cms.permit.tab.items',
    defaultMessage: '匹配关联',
  },
  usageTab: {
    id: 'cms.permit.tab.usage',
    defaultMessage: '使用记录',
  },
  editTab: {
    id: 'cms.permit.tab.edit',
    defaultMessage: '操作记录',
  },
  addPermit: {
    id: 'cms.permit.add',
    defaultMessage: '添加证书',
  },
  permitOwner: {
    id: 'cms.permit.owner',
    defaultMessage: '所属企业',
  },
  permitFile: {
    id: 'cms.permit.file',
    defaultMessage: '证书文件',
  },
  permitCategory: {
    id: 'cms.permit.category',
    defaultMessage: '标准',
  },
  customsPermit: {
    id: 'cms.permit.category.customs',
    defaultMessage: '海关监管证件',
  },
  ciqPermit: {
    id: 'cms.permit.category.ciq',
    defaultMessage: '检验检疫证件',
  },
  permitType: {
    id: 'cms.permit.type',
    defaultMessage: '证书类型',
  },
  permitStatus: {
    id: 'cms.permit.status',
    defaultMessage: '状态',
  },
  permitNo: {
    id: 'cms.permit.no',
    defaultMessage: '证书编号',
  },
  usageControl: {
    id: 'cms.permit.usage.control',
    defaultMessage: '次数管控',
  },
  maxUsage: {
    id: 'cms.permit.max.usage',
    defaultMessage: '总次数',
  },
  availUsage: {
    id: 'cms.permit.avail.usage',
    defaultMessage: '剩余次数',
  },
  expiryControl: {
    id: 'cms.permit.expiry.control',
    defaultMessage: '有效期管控',
  },
  startDate: {
    id: 'cms.permit.start.date',
    defaultMessage: '发证日期',
  },
  stopDate: {
    id: 'cms.permit.stop.date',
    defaultMessage: '到期日期',
  },
  valid: {
    id: 'cms.permit.status.valid',
    defaultMessage: '有效',
  },
  invalid: {
    id: 'cms.permit.status.invalid',
    defaultMessage: '失效',
  },
  save: {
    id: 'cms.permit.action.save',
    defaultMessage: '保存',
  },
  cancel: {
    id: 'cms.permit.action.cancel',
    defaultMessage: '取消',
  },
  turnOn: {
    id: 'cms.permit.action.turnOn',
    defaultMessage: '开启',
  },
  close: {
    id: 'cms.permit.action.close',
    defaultMessage: '关闭',
  },
  check: {
    id: 'cms.permit.action.check',
    defaultMessage: '预览',
  },
  update: {
    id: 'cms.permit.action.update',
    defaultMessage: '上传',
  },
  updateSuccess: {
    id: 'cms.permit.action.updateSuccess',
    defaultMessage: '更新成功',
  },
  detail: {
    id: 'cms.permit.detail',
    defaultMessage: '详情',
  },
  relPartner: {
    id: 'cms.permit.relPartner',
    defaultMessage: '选择关联货主',
  },
  model: {
    id: 'cms.permit.item.model',
    defaultMessage: '型号系列',
  },
  productNo: {
    id: 'cms.permit.item.productNo',
    defaultMessage: '商品货号',
  },
  manage: {
    id: 'cms.permit.item.manage',
    defaultMessage: '关联管理',
  },
  automaticMatch: {
    id: 'cms.permit.item.automaticMatch',
    defaultMessage: '自动匹配',
  },
  hscode: {
    id: 'cms.permit.item.hscode',
    defaultMessage: 'HS编码',
  },
  gName: {
    id: 'cms.permit.item.name',
    defaultMessage: '中文品名',
  },
  customsControl: {
    id: 'cms.permit.item.customsControl',
    defaultMessage: '海关监管条件',
  },
  inspectionQuarantine: {
    id: 'cms.permit.item.inspectionQuarantine',
    defaultMessage: '检验检疫条件',
  },
  addModel: {
    id: 'cms.permit.addModel',
    defaultMessage: '新增型号系列',
  },
  relProductNos: {
    id: 'cms.permit.relProductNos',
    defaultMessage: '关联商品货号',
  },
  productNoManage: {
    id: 'cms.pertmit.productNoManage',
    defaultMessage: '关联商品货号管理',
  },
  usageCount: {
    id: 'cms.permit.usageCount',
    defaultMessage: '使用次数',
  },
  usageDate: {
    id: 'cms.permit.usageDate',
    defaultMessage: '使用时间',
  },
  usageObject: {
    id: 'cms.permit.usageObject',
    defaultMessage: '使用对象',
  },
  ensureDelete: {
    id: 'cms.permit.action.ensureDelete',
    defaultMessage: '确定删除?',
  },
  no: {
    id: 'cms.permit.seq.no',
    defaultMessage: '序号',
  },
  editTime: {
    id: 'cms.permit.edit.time',
    defaultMessage: '操作时间',
  },
  editer: {
    id: 'cms.permit.editer',
    defaultMessage: '操作人',
  },
  editContent: {
    id: 'cms.permit.edit.content',
    defaultMessage: '操作内容',
  },
  editPermit: {
    id: 'cms.permit.edit',
    defaultMessage: '证书编辑',
  },
  tradeMode: {
    id: 'cms.permit.rule.tradeMode',
    defaultMessage: '监管方式',
  },
  remissionMode: {
    id: 'cms.permit.rule.remissionMode',
    defaultMessage: '征免性质',
  },
  trxnMode: {
    id: 'cms.permit.rule.trxnMode',
    defaultMessage: '成交方式',
  },
  ieType: {
    id: 'cms.permit.rule.ieType',
    defaultMessage: '报关类型',
  },
  declWayIMPT: {
    id: 'cms.permit.rule.declway.impt',
    defaultMessage: '进口',
  },
  declWayEXPT: {
    id: 'cms.permit.rule.declway.expt',
    defaultMessage: '出口',
  },
  declWayIBND: {
    id: 'cms.permit.rule.declway.ibnd',
    defaultMessage: '进境',
  },
  declWayEBND: {
    id: 'cms.permit.rule.declway.ebnd',
    defaultMessage: '出境',
  },
  query: {
    id: 'cms.permit.query',
    defaultMessage: '查询',
  },
  reset: {
    id: 'cms.permit.reset',
    defaultMessage: '重置',
  },
  discard: {
    id: 'cms.permit.discard',
    defaultMessage: '作废',
  },
  reActivate: {
    id: 'cms.permit.reActivate',
    defaultMessage: '重新启用',
  },
  ocr: {
    id: 'cms.permit.ocr',
    defaultMessage: '自动识别',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
