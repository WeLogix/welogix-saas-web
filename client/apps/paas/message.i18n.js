import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  paas: {
    id: 'paas',
    defaultMessage: '平台能力',
  },
  paasOverview: {
    id: 'paas.overview',
    defaultMessage: '概览',
  },
  sysIntegrated: {
    id: 'paas.stats.sys.integrated',
    defaultMessage: '已集成接口',
  },
  appsDeveloped: {
    id: 'paas.stats.apps.developed',
    defaultMessage: '已扩展应用',
  },
  bizDomain: {
    id: 'paas.menu.biz.domain',
    defaultMessage: '业务领域',
  },
  bizObjTailor: {
    id: 'paas.menu.biz.tailor',
    defaultMessage: '业务定制',
  },
  objectMeta: {
    id: 'paas.menu.biz.object.meta',
    defaultMessage: '业务元数据',
  },
  dataAdapters: {
    id: 'paas.menu.adapters',
    defaultMessage: '数据适配器',
  },
  templates: {
    id: 'paas.menu.templates',
    defaultMessage: '自定义模板',
  },
  exportTempl: {
    id: 'paas.menu.templates.export',
    defaultMessage: '数据导出模板',
  },
  printTempl: {
    id: 'paas.menu.templates.print',
    defaultMessage: '打印模板',
  },
  bizExport: {
    id: 'paas.menu.templates.biz.export',
    defaultMessage: '导出模板',
  },
  noticeTempl: {
    id: 'paas.menu.templates.notice',
    defaultMessage: '通知模板',
  },
  paramPrefs: {
    id: 'paas.menu.param.prefs',
    defaultMessage: '参数配置',
  },
  shipmentParams: {
    id: 'paas.menu.param.prefs.shipment',
    defaultMessage: '货运参数',
  },
  customsParams: {
    id: 'paas.menu.param.prefs.customs',
    defaultMessage: '通关参数',
  },
  feeParams: {
    id: 'paas.menu.param.prefs.fees',
    defaultMessage: '费用参数',
  },
  currencies: {
    id: 'paas.menu.param.prefs.currencies',
    defaultMessage: '币制汇率',
  },
  taxes: {
    id: 'paas.menu.param.prefs.taxes',
    defaultMessage: '开票税率',
  },
  flowRule: {
    id: 'paas.menu.flow.rule',
    defaultMessage: '流程规则',
  },
  bizFlow: {
    id: 'paas.menu.biz.flow',
    defaultMessage: '业务流程',
  },
  approvalFlow: {
    id: 'paas.menu.approval.flow',
    defaultMessage: '审批流程',
  },
  alertRule: {
    id: 'paas.menu.alert.rule',
    defaultMessage: '风控规则',
  },
  dataPlatform: {
    id: 'paas.menu.data.platform',
    defaultMessage: '数据中台',
  },
  dataHub: {
    id: 'paas.menu.data.hub',
    defaultMessage: '数据接入',
  },
  dataQC: {
    id: 'paas.menu.data.qc',
    defaultMessage: '数据质量',
  },
  dataSubject: {
    id: 'paas.menu.data.subject',
    defaultMessage: '数据主题',
  },
  dataV: {
    id: 'paas.menu.data.v',
    defaultMessage: '数据可视',
  },
  openPlatform: {
    id: 'paas.menu.open.platform',
    defaultMessage: '开放平台',
  },
  integration: {
    id: 'paas.menu.open.integration',
    defaultMessage: '集成',
  },
  openDev: {
    id: 'paas.menu.open.dev',
    defaultMessage: '开发',
  },
  openOps: {
    id: 'paas.menu.open.ops',
    defaultMessage: '运维',
  },
  openApiDocs: {
    id: 'paas.menu.open.api.docs',
    defaultMessage: 'API文档',
  },
  templateName: {
    id: 'paas.menu.templates.templateName',
    defaultMessage: '模板名称',
  },
  bizObject: {
    id: 'paas.flow.biz.object',
    defaultMessage: '业务对象',
  },
  cmsDelegation: {
    id: 'paas.flow.biz.cms.delegation',
    defaultMessage: '报关委托',
  },
  cmsDeclManifest: {
    id: 'paas.flow.biz.cms.decl.manifest',
    defaultMessage: '报关清单',
  },
  cmsCustomsDecl: {
    id: 'paas.flow.biz.cms.customs.decl',
    defaultMessage: '报关单',
  },
  tmsShipment: {
    id: 'paas.flow.biz.tms.shipment',
    defaultMessage: '运单',
  },
  cwmRecAsn: {
    id: 'paas.flow.biz.cwm.rec.asn',
    defaultMessage: '收货通知ASN',
  },
  cwmShippingOrder: {
    id: 'paas.flow.biz.cwm.shipping.order',
    defaultMessage: '出库订单',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
