import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  delgManifest: {
    id: 'cms.delegation.manifest',
    defaultMessage: '委托制单',
  },
  clearanceSetting: {
    id: 'cms.delegation.manifest.setting',
    defaultMessage: '制单设置',
  },
  searchPlaceholder: {
    id: 'cms.delegation.search.placeholder',
    defaultMessage: '委托编号/提运单号/订单追踪号',
  },
  filterImport: {
    id: 'cms.delegation.filter.import',
    defaultMessage: '进口',
  },
  filterExport: {
    id: 'cms.delegation.filter.export',
    defaultMessage: '出口',
  },
  allDelegation: {
    id: 'cms.delegation.all',
    defaultMessage: '全部委托',
  },
  pending: {
    id: 'cms.delegation.stage.pending',
    defaultMessage: '接单',
  },
  exchange: {
    id: 'cms.delegation.stage.exchange',
    defaultMessage: '换单',
  },
  processing: {
    id: 'cms.delegation.stage.processing',
    defaultMessage: '制单',
  },
  reviewPending: {
    id: 'cms.delegation.stage.review.pending',
    defaultMessage: '待复核',
  },
  declaring: {
    id: 'cms.delegation.stage.declaring',
    defaultMessage: '申报',
  },
  releasing: {
    id: 'cms.delegation.stage.releasing',
    defaultMessage: '放行',
  },
  client: {
    id: 'cms.delegation.client',
    defaultMessage: '进出口企业',
  },
  delgTime: {
    id: 'cms.delegation.time',
    defaultMessage: '委托日期',
  },
  acptTime: {
    id: 'cms.delegation.acpttime',
    defaultMessage: '接单日期',
  },
  invoiceNo: {
    id: 'cms.delegation.invoice.no',
    defaultMessage: '发票号',
  },
  orderNo: {
    id: 'cms.delegation.order.no',
    defaultMessage: '订单追踪号',
  },
  voyageNo: {
    id: 'cms.delegation.voyage.no',
    defaultMessage: '船名/航次',
  },
  flightNo: {
    id: 'cms.delegation.flight.no',
    defaultMessage: '航班号',
  },
  delgInternalNo: {
    id: 'cms.delegation.internal.no',
    defaultMessage: '外部编号',
  },
  delgPieces: {
    id: 'cms.delegation.pieces',
    defaultMessage: '总件数',
  },
  delgWeight: {
    id: 'cms.delegation.weight',
    defaultMessage: '总毛重',
  },
  ciqType: {
    id: 'cms.delegation.ciq.type',
    defaultMessage: '涉检类型',
  },
  operatedBy: {
    id: 'cms.delegation.opertated.by',
    defaultMessage: '制单人员',
  },
  declareWay: {
    id: 'cms.delegation.declareWay',
    defaultMessage: '报关类型',
  },
  billNo: {
    id: 'cms.delegation.billNo',
    defaultMessage: '子业务编号',
  },
  compEntryId: {
    id: 'cms.delegation.comp.entryId',
    defaultMessage: '企业报关单编号',
  },
  auth: {
    id: 'cms.delegation.auth',
    defaultMessage: '授权',
  },
  delgRecall: {
    id: 'cms.delegation.recall',
    defaultMessage: '撤回',
  },
  downloadCert: {
    id: 'cms.delegation.downloadCert',
    defaultMessage: '下载单据',
  },
  exchangeSeaDoc: {
    id: 'cms.delegation.exchange.sea.doc',
    defaultMessage: '换单',
  },
  createManifest: {
    id: 'cms.delegation.manifest.create',
    defaultMessage: '创建清单',
  },
  viewManifest: {
    id: 'cms.delegation.manifest.view',
    defaultMessage: '查看清单',
  },
  editManifest: {
    id: 'cms.delegation.manifest.edit',
    defaultMessage: '编辑清单',
  },
  trackDecl: {
    id: 'cms.delegation.track.decl',
    defaultMessage: '通关追踪',
  },
  entryNoFillModalTitle: {
    id: 'cms.delegation.modal.entrynofill.title',
    defaultMessage: '填写报关单号',
  },
  successfulOperation: {
    id: 'cms.delegation.modal.successful.operation',
    defaultMessage: '操作成功',
  },
  startMaking: {
    id: 'cms.delegation.modal.start.making',
    defaultMessage: '开始制单',
  },
  makeConfirm: {
    id: 'cms.delegation.modal.make.confirm',
    defaultMessage: '已接受报关委托，开始制单？',
  },
  delgSaveConfirm: {
    id: 'cms.delegation.delgsave.confirm',
    defaultMessage: '确认保存接单？',
  },
  lastActTime: {
    id: 'cms.delegation.last.act.time',
    defaultMessage: '最后更新时间',
  },
  clrStatus: {
    id: 'cms.delegation.clr.status',
    defaultMessage: '通关状态',
  },
  processDate: {
    id: 'cms.delegation.process.date',
    defaultMessage: '更新时间',
  },
  acceptSaveMessage: {
    id: 'cms.delegation.edit.message.accept',
    defaultMessage: '确定保存接单?',
  },
  delgTo: {
    id: 'cms.delegation.list.delgTo',
    defaultMessage: '委托',
  },
  createdEvent: {
    id: 'cms.delegation.event.created',
    defaultMessage: '创建',
  },
  acceptedEvent: {
    id: 'cms.delegation.event.accepted',
    defaultMessage: '接单',
  },
  processedEvent: {
    id: 'cms.delegation.event.processed',
    defaultMessage: '制单',
  },
  declaredEvent: {
    id: 'cms.delegation.event.declared',
    defaultMessage: '申报',
  },
  releasedEvent: {
    id: 'cms.delegation.event.released',
    defaultMessage: '放行',
  },
  declaredPart: {
    id: 'cms.delegation.declaredPart',
    defaultMessage: '部分申报',
  },
  releasedPart: {
    id: 'cms.delegation.releasedPart',
    defaultMessage: '部分放行',
  },
  intlArrivalDate: {
    id: 'cms.delegation.intl.arrival.date',
    defaultMessage: '实际到港日',
  },
  exchangeDate: {
    id: 'cms.delegation.exchange.date',
    defaultMessage: '换单日',
  },
  deliveryOrderNo: {
    id: 'cms.delegation.delivery.orderno',
    defaultMessage: '提货单号(D/O)',
  },
  tmplSearchPlaceholder: {
    id: 'cms.delegation.template.search.placeholder',
    defaultMessage: '客户名称/客户代码',
  },
  unrelatedImport: {
    id: 'cms.forms.table.import.unrelated',
    defaultMessage: '直接导入',
  },
  relatedImport: {
    id: 'cms.forms.table.import.related',
    defaultMessage: '关联归类库导入',
  },
  manifestHeader: {
    id: 'cms.manifest.header',
    defaultMessage: '报关清单表头',
  },
  manifestDetails: {
    id: 'cms.manifest.details',
    defaultMessage: '报关清单明细',
  },
  generateCDP: {
    id: 'cms.manifest.generate.cdp',
    defaultMessage: '生成报关建议书',
  },
  saveAsTemplate: {
    id: 'cms.manifest.saveas.template',
    defaultMessage: '保存为模板',
  },
  relationCodeSearch: {
    id: 'cms.manifest.form.relation.code.search',
    defaultMessage: '代码搜索',
  },
  importBody: {
    id: 'cms.manifest.table.import',
    defaultMessage: '导入清单',
  },
  relatedCustomers: {
    id: 'cms.app.settings.related.customers',
    defaultMessage: '关联客户',
  },
  addRelatedCustomers: {
    id: 'cms.app.settings.add.related.customers',
    defaultMessage: '添加关联客户',
  },
  belongToTempalte: {
    id: 'cms.app.settings.bill.templates.belongto',
    defaultMessage: '所属模版',
  },
  mustHaveBillTemplates: {
    id: 'cms.app.settings.bill.templates.must',
    defaultMessage: '制单规则不能为空',
  },
  mustHaveEntQualifTypeCode: {
    id: 'cms.app.settings.bill.template.entqualiftypecode.must',
    defaultMessage: '企业资质类别不能为空',
  },
  whetherNeedPdf: {
    id: 'cms.ciq.licence.wether.need.pdf',
    defaultMessage: '是否带入PDF',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
