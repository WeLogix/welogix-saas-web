import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import taxMessages from 'client/apps/cms/tax/message.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  customsDecl: {
    id: 'cms.declaration',
    defaultMessage: '报关申报',
  },
  import: {
    id: 'cms.declaration.import',
    defaultMessage: '进口',
  },
  export: {
    id: 'cms.declaration.export',
    defaultMessage: '出口',
  },
  searchPlaceholder: {
    id: 'cms.declaration.search.placeholder',
    defaultMessage: '报关单号/委托编号/订单追踪号',
  },
  declCDF: {
    id: 'cms.declaration.decl.cdf',
    defaultMessage: '报关单',
  },
  declFTZ: {
    id: 'cms.declaration.decl.ftz',
    defaultMessage: '备案清单',
  },
  declHead: {
    id: 'cms.declaration.decl.head',
    defaultMessage: '报关单表头',
  },
  declBody: {
    id: 'cms.declaration.decl.body',
    defaultMessage: '报关单表体',
  },
  declMsg: {
    id: 'cms.declaration.decl.msg',
    defaultMessage: '报文',
  },
  declSetting: {
    id: 'cms.declaration.decl.setting',
    defaultMessage: '申报设置',
  },
  declNo: {
    id: 'cms.declaration.decl.no',
    defaultMessage: '报关单号/内部编号',
  },
  customsInspect: {
    id: 'cms.declaration.customs.inspect',
    defaultMessage: '查验',
  },
  ieCustoms: {
    id: 'cms.declaration.ie.customs',
    defaultMessage: '进出境关别',
  },
  domesticTrader: {
    id: 'cms.declaration.domestic.trader',
    defaultMessage: '境内收发货人',
  },
  overseaTrader: {
    id: 'cms.declaration.oversea.trader',
    defaultMessage: '境外收发货人',
  },
  brokerSetting: {
    id: 'cms.declaration.broker.setting',
    defaultMessage: '申报单位设置',
  },
  defaultDeclChannel: {
    id: 'cms.declaration.default.channel',
    defaultMessage: '默认申报通道',
  },
  sendDecl: {
    id: 'cms.declaration.decl.sendModal.sendDecl',
    defaultMessage: '发送报关报文',
  },
  agent: {
    id: 'cms.declaration.agent',
    defaultMessage: '申报单位',
  },
  entryNoFillModalTitle: {
    id: 'cms.declaration.modal.entrynofill.title',
    defaultMessage: '回填海关编号',
  },
  ciqNoFillModalTitle: {
    id: 'cms.declaration.modal.ciqnofill.title',
    defaultMessage: '回填检验检疫编号',
  },
  customsClearModalTitle: {
    id: 'cms.declaration.modal.clear.title',
    defaultMessage: '报关单放行确认',
  },
  declCiq: {
    id: 'cms.declaration.decl.ciq',
    defaultMessage: '涉检',
  },
  processDate: {
    id: 'cms.declaration.process.date',
    defaultMessage: '更新时间',
  },
  customsCheck: {
    id: 'cms.declaration.check',
    defaultMessage: '海关查验',
  },
  all: {
    id: 'cms.declaration.filter.all',
    defaultMessage: '全部',
  },
  filterProposed: {
    id: 'cms.declaration.filter.proposed',
    defaultMessage: '报关建议书',
  },
  filterReviewed: {
    id: 'cms.declaration.filter.reviewed',
    defaultMessage: '已复核',
  },
  filterDeclared: {
    id: 'cms.declaration.filter.declared',
    defaultMessage: '已发送',
  },
  filterFinalized: {
    id: 'cms.declaration.filter.entered',
    defaultMessage: '已回执',
  },
  customsReleased: {
    id: 'cms.declaration.status.released',
    defaultMessage: '已放行',
  },
  recallConfirm: {
    id: 'cms.declaration.recall.confirm',
    defaultMessage: '确定取消报关单复核?',
  },
  review: {
    id: 'cms.declaration.filter.review',
    defaultMessage: '复核',
  },
  recall: {
    id: 'cms.declaration.recall',
    defaultMessage: '退回',
  },
  send: {
    id: 'cms.declaration.send',
    defaultMessage: '发送',
  },
  sendDeclMsg: {
    id: 'cms.declaration.send.decl.msg',
    defaultMessage: '申报',
  },
  validateCiq: {
    id: 'cms.declaration.validate.ciq',
    defaultMessage: '检务校验',
  },
  markReleased: {
    id: 'cms.declaration.mark.released',
    defaultMessage: '放行确认',
  },
  viewDeclMsg: {
    id: 'cms.declaration.view.decl',
    defaultMessage: '查看申报报文',
  },
  viewResultMsg: {
    id: 'cms.declaration.view.result',
    defaultMessage: '查看回执报文',
  },
  exchangeRate: {
    id: 'cms.declaration.tabpanes.tax.exchange.rate',
    defaultMessage: '汇率',
  },
  viewProposal: {
    id: 'cms.declaration.op.view.proposal',
    defaultMessage: '建议书',
  },
  viewCDF: {
    id: 'cms.declaration.op.view.cdf',
    defaultMessage: '报关单',
  },
  dutyTax: {
    id: 'cms.declaration.duty.tax',
    defaultMessage: '预估税金',
  },
  estimate: {
    id: 'cms.declaration.estimate',
    defaultMessage: '估算',
  },
  declMod: {
    id: 'cms.declaration.mod',
    defaultMessage: '记录修改/撤销单',
  },
  resend: {
    id: 'cms.declaration.decl.resend',
    defaultMessage: '重新发送',
  },
  revisedDecl: {
    id: 'cms.declaration.revised.decl',
    defaultMessage: '修改单',
  },
  revokedDecl: {
    id: 'cms.declaration.revoked.decl',
    defaultMessage: '撤销单',
  },
  reviseConfirm: {
    id: 'cms.declaration.decl.revise.confirm',
    defaultMessage: '确认修改项',
  },
  revisedDeclList: {
    id: 'cms.declaration.decl.revised.list',
    defaultMessage: '表体修改项',
  },
  reviseSave: {
    id: 'cms.declaration.decl.revise.save',
    defaultMessage: '保存改单内容',
  },
  ep: {
    id: 'cms.declaration.decl.channel.ep',
    defaultMessage: 'EP上海版',
  },
  sw: {
    id: 'cms.declaration.decl.channel.sw',
    defaultMessage: 'SW标准版',
  },
  fileNotFound: {
    id: 'cms.declaration.file.not.found',
    defaultMessage: '报文未找到',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages, ...moduleMessages, ...taxMessages, ...messages,
});
