import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  dev: {
    id: 'paas.dev',
    defaultMessage: '自建应用',
  },
  searchTip: {
    id: 'paas.dev.search.tip',
    defaultMessage: '搜索自建应用',
  },
  create: {
    id: 'paas.dev.create',
    defaultMessage: '新建应用',
  },
  delete: {
    id: 'paas.dev.delete',
    defaultMessage: '删除应用',
  },
  apiDocs: {
    id: 'paas.dev.api.docs',
    defaultMessage: 'API文档',
  },
  online: {
    id: 'paas.dev.online',
    defaultMessage: '上线',
  },
  offline: {
    id: 'paas.dev.offline',
    defaultMessage: '下线',
  },
  appLogo: {
    id: 'paas.dev.app.logo',
    defaultMessage: '图标',
  },
  appName: {
    id: 'paas.dev.app.name',
    defaultMessage: '名称',
  },
  appDesc: {
    id: 'paas.dev.app.desc',
    defaultMessage: '描述',
  },
  appId: {
    id: 'paas.dev.app.id',
    defaultMessage: 'Client ID',
  },
  appSecret: {
    id: 'paas.dev.app.secret',
    defaultMessage: 'Client Secret/密钥',
  },
  openapiConfig: {
    id: 'paas.dev.app.openapi.config',
    defaultMessage: 'OpenAPI 参数',
  },
  callbackUrl: {
    id: 'paas.dev.app.callback.url',
    defaultMessage: '回调地址',
  },
  hookUrl: {
    id: 'paas.dev.app.hook.url',
    defaultMessage: '触发调用地址',
  },
  homeEntranceUrl: {
    id: 'paas.dev.home.entrance.url',
    defaultMessage: '「首页」应用入口地址',
  },
  sofEntranceUrl: {
    id: 'paas.dev.sof.entrance.url',
    defaultMessage: '「订单中心」导航入口地址',
  },
  cmsEntranceUrl: {
    id: 'paas.dev.cms.entrance.url',
    defaultMessage: '「关务管理」导航入口地址',
  },
  bwmEntranceUrl: {
    id: 'paas.dev.bwm.entrance.url',
    defaultMessage: '「保税仓储」导航入口地址',
  },
  tmsEntranceUrl: {
    id: 'paas.dev.tms.entrance.url',
    defaultMessage: '「运输管理」导航入口地址',
  },
  bssEntranceUrl: {
    id: 'paas.dev.bss.entrance.url',
    defaultMessage: '「结算中心」导航入口地址',
  },
  grantedOpetrators: {
    id: 'paas.dev.bss.granted.opetrators',
    defaultMessage: '授权执行人员',
  },
  appType: {
    id: 'paas.dev.app.type',
    defaultMessage: '应用类型',
  },
  personResponsible: {
    id: 'paas.dev.app.personResponsible',
    defaultMessage: '负责人',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
