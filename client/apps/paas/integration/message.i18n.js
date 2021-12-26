import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  searchTip: {
    id: 'paas.integration.search.tip',
    defaultMessage: '搜索已集成接口',
  },
  sysInterface: {
    id: 'paas.integration.sys.interface',
    defaultMessage: '系统接口',
  },
  appName: {
    id: 'paas.integration.app.name',
    defaultMessage: '接口名称',
  },
  appAmberRoadCTM: {
    id: 'paas.integration.app.arctm',
    defaultMessage: 'AmberRoad CTM',
  },
  appEasipassEDI: {
    id: 'paas.integration.app.easipass',
    defaultMessage: '单一窗口上海版',
  },
  appSHFTZ: {
    id: 'paas.integration.app.shftz',
    defaultMessage: '上海自贸区监管',
  },
  appSFExpress: {
    id: 'paas.integration.app.sfexpress',
    defaultMessage: '顺丰快递',
  },
  interfaceConfig: {
    id: 'paas.integration.interface.config',
    defaultMessage: '接口配置',
  },
  integrationName: {
    id: 'paas.integration.name',
    defaultMessage: '接口名称',
  },
  integrationAppType: {
    id: 'paas.integration.app',
    defaultMessage: '接口类型',
  },
  incomingStatus: {
    id: 'paas.integration.incoming.status',
    defaultMessage: '接口输入状态',
  },
  outgoingStatus: {
    id: 'paas.integration.outgoing.status',
    defaultMessage: '接口输出状态',
  },
  enableThirdParty: {
    id: 'paas.integration.forward.third.party',
    defaultMessage: '转发第三方',
  },
  thirdPartyUrl: {
    id: 'paas.integration.third.party.url',
    defaultMessage: '第三方报文接收URL',
  },
  install: {
    id: 'paas.integration.install',
    defaultMessage: '安装',
  },
  viewClientLogs: {
    id: 'paas.integration.view.clent.logs',
    defaultMessage: '客户端运行日志',
  },
  clientStatus: {
    id: 'paas.integration.client.status',
    defaultMessage: '客户端运行状态',
  },
  clientOffline: {
    id: 'paas.integration.client.offline',
    defaultMessage: '未启动',
  },
  clientOnline: {
    id: 'paas.integration.client.online',
    defaultMessage: '运行中',
  },
  logLevel: {
    id: 'paas.integration.log.level',
    defaultMessage: '日志类别',
  },
  logHostName: {
    id: 'paas.integration.log.host.Name',
    defaultMessage: '主机名',
  },
  clientLogs: {
    id: 'paas.integration.client.logs',
    defaultMessage: '客户端日志',
  },
  logCreatedDate: {
    id: 'paas.integration.log.create.date',
    defaultMessage: '生成日期',
  },
  logContent: {
    id: 'paas.integration.log.content',
    defaultMessage: '日志记录',
  },
  logLevelTrace: {
    id: 'paas.integration.log.level.trace',
    defaultMessage: '追踪',
  },
  logLevelDebug: {
    id: 'paas.integration.log.level.debug',
    defaultMessage: '调试',
  },
  logLevelInfo: {
    id: 'paas.integration.log.level.info',
    defaultMessage: '运行',
  },
  logLevelWarn: {
    id: 'paas.integration.log.level.warn',
    defaultMessage: '警告',
  },
  logLevelError: {
    id: 'paas.integration.log.level.error',
    defaultMessage: '错误',
  },
  logLevelFatal: {
    id: 'paas.integration.log.level.fatal',
    defaultMessage: '崩溃',
  },
  downloadSwclientInstall: {
    id: 'paas.integration.download.swclient.install',
    defaultMessage: '下载客户端安装包',
  },
  enable: {
    id: 'paas.integration.enable',
    defaultMessage: '启用',
  },
  disable: {
    id: 'paas.integration.disable',
    defaultMessage: '停用',
  },
  installApp: {
    id: 'paas.integration.install.app',
    defaultMessage: '安装接口',
  },
  deleteApp: {
    id: 'paas.integration.delete.app',
    defaultMessage: '删除接口',
  },
  integrationNameRequired: {
    id: 'paas.integration.name.required',
    defaultMessage: '接口名称必填',
  },
  parameterRequired: {
    id: 'paas.integration.paramter.required',
    defaultMessage: '接口参数必填',
  },
  epSendTradeCode: {
    id: 'paas.integration.easipass.sendTradeCode',
    defaultMessage: '发送方协同ID号',
  },
  epRecvTradeCode: {
    id: 'paas.integration.easipass.recvTradeCode',
    defaultMessage: '接收方协同ID号',
  },
  epUserCode: {
    id: 'paas.integration.easipass.epUserCode',
    defaultMessage: '接收方用户ID(多个逗号分隔)',
  },
  agentCustCode: {
    id: 'paas.integration.easipass.agent.custcode',
    defaultMessage: '申报单位十位编码',
  },
  FTPserver: {
    id: 'paas.integration.easipass.ftp.server',
    defaultMessage: 'FTP地址',
  },
  FTPusername: {
    id: 'paas.integration.easipass.ftp.username',
    defaultMessage: '用户名',
  },
  FTPpassword: {
    id: 'paas.integration.easipass.ftp.password',
    defaultMessage: '密码',
  },
  sendDirectory: {
    id: 'paas.integration.easipass.ftp.send.directory',
    defaultMessage: '发送目录',
  },
  recvDirectory: {
    id: 'paas.integration.easipass.ftp.recv.directory',
    defaultMessage: '接收目录',
  },
  AmberRoadCTMParam: {
    id: 'paas.integration.arctm.title.params',
    defaultMessage: 'AmberRoad CTM参数',
  },
  customerNo: {
    id: 'paas.integration.arctm.customerNo',
    defaultMessage: 'CTM客户',
  },
  username: {
    id: 'paas.integration.arctm.username',
    defaultMessage: '用户名',
  },
  password: {
    id: 'paas.integration.arctm.password',
    defaultMessage: '密码',
  },
  hookUrl: {
    id: 'paas.integration.arctm.hook.url',
    defaultMessage: '输入接口',
  },
  webserviceCDFUrl: {
    id: 'paas.integration.arctm.webservice.cdf.url',
    defaultMessage: 'CDF回执发送地址',
  },
  webservice305Url: {
    id: 'paas.integration.arctm.webservice.305.url',
    defaultMessage: '时间状态回执发送地址',
  },
  apiConfig: {
    id: 'paas.integration.shftz.api.config',
    defaultMessage: '监管接口配置',
  },
  ftzserver: {
    id: 'paas.integration.shftz.host.url',
    defaultMessage: '监管接口地址',
  },
  config: {
    id: 'paas.integration.config',
    defaultMessage: '配置',
  },
  sfexpressUrl: {
    id: 'paas.integration.sfexpress.url',
    defaultMessage: 'HTTP服务url',
  },
  sfexpressCheckword: {
    id: 'paas.integration.sfexpress.checkword',
    defaultMessage: '密钥',
  },
  sfexpressAccesscode: {
    id: 'paas.integration.sfexpress.accesscode',
    defaultMessage: '接入编码',
  },
  sfexpressCustid: {
    id: 'paas.integration.sfexpress.custid',
    defaultMessage: '月结卡号',
  },
  appEnabled: {
    id: 'paas.integration.msg.app.enabled',
    defaultMessage: '已启用',
  },
  appDisabled: {
    id: 'paas.integration.msg.app.disabled',
    defaultMessage: '已停用',
  },
  appDeleted: {
    id: 'paas.integration.msg.app.deleted',
    defaultMessage: '应用已删除',
  },
  appSingleWindow: {
    id: 'paas.integration.app.appSingleWindow',
    defaultMessage: '单一窗口标准版',
  },
  swQueue: {
    id: 'paas.integration.appSingleWindow.swQueue',
    defaultMessage: '队列名称',
  },
  installPath: {
    id: 'paas.integration.appSingleWindow.installpath',
    defaultMessage: '安装目录',
  },
  inBox: {
    id: 'paas.integration.appSingleWindow.inBox',
    defaultMessage: '回执文件/异常情况说明文件',
  },
  outBox: {
    id: 'paas.integration.appSingleWindow.outBox',
    defaultMessage: '待发送文件目录',
  },
  sentBox: {
    id: 'paas.integration.appSingleWindow.sentBox',
    defaultMessage: '发送完毕文件目录',
  },
  failBox: {
    id: 'paas.integration.appSingleWindow.failBox',
    defaultMessage: '服务器端校验失败文件',
  },
  edocInBox: {
    id: 'paas.integration.appSingleWindow.edocInBox',
    defaultMessage: '随附单据回执文件/异常情况说明文件',
  },
  edocOutBox: {
    id: 'paas.integration.appSingleWindow.edocOutBox',
    defaultMessage: '随附单据待发送文件目录',
  },
  edocSentBox: {
    id: 'paas.integration.appSingleWindow.edocSentBox',
    defaultMessage: '随附单据发送完毕文件目录',
  },
  edocFailBox: {
    id: 'paas.integration.appSingleWindow.edocFailBox',
    defaultMessage: '随附单据服务器端校验失败文件',
  },
  agentSccCode: {
    id: 'paas.integration.appSingleWindow.agentSccCode',
    defaultMessage: '申报单位统一编码',
  },
  agentCusCode: {
    id: 'paas.integration.appSingleWindow.agentCusCode',
    defaultMessage: '申报单位海关编码',
  },
  agentName: {
    id: 'paas.integration.appSingleWindow.agentName',
    defaultMessage: '申报单位名称',
  },
  swIcCardNo: {
    id: 'paas.integration.appSingleWindow.swIcCardNo',
    defaultMessage: '操作人IC卡号',
  },
  goodsDecl: {
    id: 'paas.integration.appSingleWindow.goodsDecl',
    defaultMessage: '货物申报',
  },
  sasbl: {
    id: 'paas.integration.appSingleWindow.sasbl',
    defaultMessage: '特殊区域/保税物流',
  },
  ptsEms: {
    id: 'paas.integration.appSingleWindow.pts.ems',
    defaultMessage: '加工贸易账册',
  },
  ptsEml: {
    id: 'paas.integration.appSingleWindow.pts.eml',
    defaultMessage: '加工贸易手册',
  },
  swClientNo: {
    id: 'paas.integration.appSingleWindow.swClientNo',
    defaultMessage: '海关单一窗口客户端编号',
  },
  agentSccCodeShouldBe18: {
    id: 'paas.integration.appSingleWindow.agentSccCodeShouldBe18',
    defaultMessage: '申报单位统一编码为18位',
  },
  agentCusCodeShouldBe10: {
    id: 'paas.integration.appSingleWindow.agentCusCodeShouldBe10',
    defaultMessage: '申报单位海关编码为10位',
  },
  shouldBeRequired: {
    id: 'paas.integration.appSingleWindow.shouldBeRequired',
    defaultMessage: '该项需填写',
  },
  ctmCustomerOrgCode: {
    id: 'paas.integration.ctm.orgcode',
    defaultMessage: '客户CTM ORG Code',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
