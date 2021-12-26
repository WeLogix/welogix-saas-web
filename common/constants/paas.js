export const INTEGRATION_APPS = [
  {
    app_type: 'SW',
    title: '单一窗口标准版',
    category: 'catCus',
    link: '/paas/integration/singlewindow/install',
    description: '中国国际贸易单一窗口标准版导入客户端',
    logo: 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/china-eport.png',
  },
  /*
  {
    app_type: 'QP',
    title: 'QP海关预录入系统',
    category: 'catCus',
    link: '/paas/integration/quickpass/install',
    description: 'QuickPass 海关预录入系统',
  },
  */
  {
    app_type: 'EASIPASS',
    title: '单一窗口上海版',
    category: 'catCus',
    link: '/paas/integration/easipass/install',
    description: '上海国际贸易单一窗口企业数据协同系统接口（亿通EDI）',
    logo: 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/shsw.png',
  },
  {
    app_type: 'SHFTZ',
    title: '上海自贸区监管系统',
    category: 'catSup',
    link: '/paas/integration/shftz/install',
    description: '上海自贸区监管系统',
    logo: 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/shftz.png',
  },
  {
    app_type: 'ARCTM',
    title: 'Amber Road CTM',
    category: 'catEnt',
    link: '/paas/integration/arctm/install',
    description: 'Amber Road 中国贸易管理（CTM）系统',
    logo: 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/amberroad.png',
  },
  {
    app_type: 'SFEXPRESS',
    title: '顺丰速运',
    category: 'catLog',
    link: '/paas/integration/sfexpress/install',
    description: '获取顺丰快递单号以打印快递单',
    logo: 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/sf.png',
  },
];

export const PAAS_DW_OBJECT_MSG = {
  GD_TRADING: {
    title: 'bizObjectGlobalDetail',
  },
  GD_COMMINV: {
    title: 'bizObjectCommInv',
  },
  GD_SHIPMENT: {
    title: 'bizObjectShipment',
  },
  GD_CUSDECL: {
    title: 'bizObjectGdCus',
  },
  GD_CUSDECLITEM: {
    title: 'bizObjectGdCusItem',
  },
  GD_IOBOUND: {
    title: 'bizObjectGdIo',
  },
  GD_ALCFEE: {
    title: 'bizObjectGdAlcFee',
  },
  GD_ALCTAX: {
    title: 'bizObjectGdAlcTax',
  },
  CDS: {
    title: 'bizObjectCustomsDecl',
  },
  CDSDETAIL: {
    title: 'bizObjectCustomsDeclDetail',
  },
  CDSTAX: {
    title: 'bizObjectCdsTax',
  },
};

export const PAAS_PARAM_PREFS = [
  /*
  {
    key: 'shipmentParams',
    link: '/paas/prefs/shipment',
  },
  */
  {
    key: 'customsParams',
    link: '/paas/prefs/customs',
  },
  {
    key: 'feeParams',
    link: '/paas/prefs/fees',
  },
  {
    key: 'currencies',
    link: '/paas/prefs/currencies',
  },
  {
    key: 'taxes',
    link: '/paas/prefs/taxes',
  },
];

export const PAAS_RISK_POLICIES = [
  {
    key: 'decprice',
    name: '进口申报单价波动',
    category: 'catVal',
    desc: '申报单价超出允许浮动率时报警',
    icon: 'https://static-cdn.welogix.cn/images/icon-price.png',
    status: 'error',
  },
  {
    key: 'dechscode',
    name: '商品归类不一致',
    category: 'catCls',
    desc: '中文品名等相同但商品编码不同',
    icon: 'https://static-cdn.welogix.cn/images/icon-hscode.png',
    status: 'error',
  },
  {
    key: 'decpermit',
    name: '证书近效期/余量不足',
    category: 'catQua',
    desc: '资质证书即将失效预警',
    icon: 'https://static-cdn.welogix.cn/images/icon-qualification.png',
    status: 'success',
  },
  {
    key: 'deckpi',
    name: '清关超时预警',
    desc: '清关时效超过预设时间',
    icon: 'https://static-cdn.welogix.cn/images/icon-kpi.png',
    status: 'success',
  },
];

export const NOTIFICATION_STATUS = {
  unread: {
    key: 0,
    value: '未读',
  },
  read: {
    key: 1,
    value: '已读',
  },
  deleted: {
    key: 3,
    value: '已删除',
  },
};
export const NOTIFICATION_TYPES = [
  {
    key: 'typeAll',
    text: '所有类型',
  },
  {
    key: 'typeFlow',
    value: 'FLOW',
    text: '流程',
    icon: 'icon-notif-flow',
    color: '#00a2ae',
  },
  {
    key: 'typeTodo',
    value: 'PENDTASK',
    text: '任务',
    icon: 'icon-notif-task',
    color: '#ffbf00',
  },
  {
    key: 'typeAlert',
    value: 'ALARM',
    text: '报警',
    icon: 'icon-notif-alarm',
    color: '#f56a00',
  },
  {
    key: 'typeApproval',
    value: 'APPROVAL',
    text: '审批',
    icon: 'icon-notif-approval',
    color: '#7265e6',
  },
  {
    key: 'typeProgress',
    value: 'PROGRESS',
    text: '进度',
    icon: 'icon-notif-progress',
    color: '#87d068',
  },
  {
    key: 'typeSystem',
    value: 'SYS',
    text: '系统',
    icon: 'icon-notif-system',
    color: '',
  },
];
export const NOTIFICATION_PRIORITIES = [
  {
    key: 'priorityAll',
    text: '不限',
    badge: '',
  },
  {
    key: 'priorityCritical',
    value: 10,
    text: '紧急',
    badge: 'error',
    tag: '#f5222d',
  },
  {
    key: 'priorityHigh',
    text: '优先',
    value: 5,
    badge: 'warning',
    tag: '#faad14',
  },
  {
    key: 'priorityNormal',
    text: '普通',
    value: 1,
    badge: 'default',
    tag: '',
  },
];
export const RISK_LEVELS = [
  {
    key: 'allLevel',
    text: '不限',
    badge: '',
  },
  {
    key: 'highLevel',
    value: 10,
    text: '高风险',
    badge: 'error',
    tag: '#f5222d',
  },
  {
    key: 'mediumLevel',
    text: '中等风险',
    value: 5,
    badge: 'warning',
    tag: '#faad14',
  },
  {
    key: 'lowLevel',
    text: '低风险',
    value: 1,
    badge: 'default',
    tag: '',
  },
];
export const SW_JG2_SENDTYPE = {
  EMS: 'nems',
  EML: 'npts',
  SAS: 'sas',
};
