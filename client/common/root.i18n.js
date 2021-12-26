import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';

const messages = defineMessages({
  brand: {
    id: 'root.brand',
    defaultMessage: '微骆',
  },
  stdTenant: {
    id: 'root.tenant.std',
    defaultMessage: '标准版',
  },
  entTenant: {
    id: 'root.tenant.ent',
    defaultMessage: '企业版',
  },
  allianceTenant: {
    id: 'root.tenant.affiliate',
    defaultMessage: '集团版',
  },
  goHome: {
    id: 'root.go.home',
    defaultMessage: '返回首页',
  },
  goBack: {
    id: 'root.go.back',
    defaultMessage: '返回',
  },
  helpdesk: {
    id: 'root.helpdesk',
    defaultMessage: '帮助中心',
  },
  onlinecs: {
    id: 'root.onlinecs',
    defaultMessage: '在线客服',
  },
  desc: {
    id: 'root.desc',
    defaultMessage: '描述',
  },
  all: {
    id: 'root.all',
    defaultMessage: '全部',
  },
  more: {
    id: 'root.more',
    defaultMessage: '更多',
  },
  help: {
    id: 'root.help',
    defaultMessage: '帮助',
  },
  status: {
    id: 'root.status',
    defaultMessage: '状态',
  },
  scope: {
    id: 'root.scope',
    defaultMessage: '范围',
  },
  opEnable: {
    id: 'root.op.enable',
    defaultMessage: '启用',
  },
  opDisable: {
    id: 'root.op.disable',
    defaultMessage: '停用',
  },
  todo: {
    id: 'root.todo',
    defaultMessage: '待办',
  },
  opCol: {
    id: 'root.op.col',
    defaultMessage: '操作',
  },
  extraMenu: {
    id: 'root.extra.menu',
    defaultMessage: '更多菜单',
  },
  views: {
    id: 'root.views',
    defaultMessage: '视图',
  },
  tableView: {
    id: 'root.views.table.view',
    defaultMessage: '表格视图',
  },
  boardView: {
    id: 'root.views.board.view',
    defaultMessage: '看板视图',
  },
  jumpTo: {
    id: 'root.jump.to',
    defaultMessage: '跳转到',
  },
  moveTo: {
    id: 'root.move.to',
    defaultMessage: '移动到',
  },
  clickToCopy: {
    id: 'root.click.to.copy',
    defaultMessage: '点击复制',
  },
  modifyNotAllowed: {
    id: 'root.modify.not.allowed',
    defaultMessage: '不允许修改',
  },
  comingSoon: {
    id: 'root.msg.coming.soon',
    defaultMessage: '即将上线',
  },
  msgForbidden: {
    id: 'root.msg.forbidden',
    defaultMessage: '抱歉，你无权访问该页面',
  },
  customizeListColumns: {
    id: 'root.customoze.list.columns',
    defaultMessage: '定制列表项',
  },
  settings: {
    id: 'root.settings',
    defaultMessage: '设置',
  },
  yes: {
    id: 'root.yes',
    defaultMessage: '是',
  },
  nope: {
    id: 'root.nope',
    defaultMessage: '否',
  },
  nonCnName: {
    id: 'root.non.cnname',
    defaultMessage: '外文',
  },
  cnName: {
    id: 'root.cn.name',
    defaultMessage: '中文',
  },
  ok: {
    id: 'root.ok',
    defaultMessage: '确定',
  },
  cancel: {
    id: 'root.cancel',
    defaultMessage: '取消',
  },
  adjust: {
    id: 'root.adjust',
    defaultMessage: '调整',
  },
  back: {
    id: 'root.back',
    defaultMessage: '返回',
  },
  edit: {
    id: 'root.actions.edit',
    defaultMessage: '编辑',
  },
  rename: {
    id: 'root.actions.rename',
    defaultMessage: '重命名',
  },
  view: {
    id: 'root.actions.view',
    defaultMessage: '查看',
  },
  modify: {
    id: 'root.actions.modify',
    defaultMessage: '修改',
  },
  clone: {
    id: 'root.actions.clone',
    defaultMessage: '复制',
  },
  config: {
    id: 'root.actions.config',
    defaultMessage: '配置',
  },
  release: {
    id: 'root.actions.release',
    defaultMessage: '释放',
  },
  shipmtAccept: {
    id: 'root.actions.accept.order',
    defaultMessage: '接单',
  },
  assign: {
    id: 'root.actions.assign',
    defaultMessage: '分配',
  },
  delete: {
    id: 'root.actions.delete',
    defaultMessage: '删除',
  },
  add: {
    id: 'root.actions.add',
    defaultMessage: '添加',
  },
  remove: {
    id: 'root.actions.remove',
    defaultMessage: '移出',
  },
  create: {
    id: 'root.actions.create',
    defaultMessage: '新建',
  },
  import: {
    id: 'root.actions.import',
    defaultMessage: '导入',
  },
  export: {
    id: 'root.actions.export',
    defaultMessage: '导出',
  },
  save: {
    id: 'root.actions.save',
    defaultMessage: '保存',
  },
  sendMsg: {
    id: 'root.actions.send.msg',
    defaultMessage: '发送报文',
  },
  rollbackSent: {
    id: 'root.actions.rollback.sent',
    defaultMessage: '回退重发',
  },
  resendMsg: {
    id: 'root.actions.resend.msg',
    defaultMessage: '重发报文',
  },
  saveAs: {
    id: 'root.actions.save.as',
    defaultMessage: '另存为...',
  },
  savedSucceed: {
    id: 'root.actions.saved.succeed',
    defaultMessage: '保存成功',
  },
  deletedSucceed: {
    id: 'root.deleted.succeed',
    defaultMessage: '删除成功',
  },
  opSucceed: {
    id: 'root.actions.op.succeed',
    defaultMessage: '操作成功',
  },
  close: {
    id: 'root.actions.close',
    defaultMessage: '关闭',
  },
  refresh: {
    id: 'root.actions.refresh',
    defaultMessage: '刷新',
  },
  search: {
    id: 'root.actions.search',
    defaultMessage: '搜索',
  },
  advSearch: {
    id: 'root.actions.adv.search',
    defaultMessage: '高级搜索',
  },
  query: {
    id: 'root.actions.query',
    defaultMessage: '查询',
  },
  reset: {
    id: 'root.actions.reset',
    defaultMessage: '重置',
  },
  collapse: {
    id: 'root.actions.collapse',
    defaultMessage: '收起',
  },
  setting: {
    id: 'root.actions.setting',
    defaultMessage: '设置',
  },
  submit: {
    id: 'root.actions.submit',
    defaultMessage: '提交',
  },
  confirm: {
    id: 'root.actions.confirm',
    defaultMessage: '确认',
  },
  download: {
    id: 'root.actions.download',
    defaultMessage: '下载',
  },
  print: {
    id: 'root.actions.print',
    defaultMessage: '打印',
  },
  empty: {
    id: 'root.actions.empty',
    defaultMessage: '清空',
  },
  accept: {
    id: 'root.actions.accept',
    defaultMessage: '接受',
  },
  reject: {
    id: 'root.actions.reject',
    defaultMessage: '拒绝',
  },
  return: {
    id: 'root.actions.return',
    defaultMessage: '退回',
  },
  approve: {
    id: 'root.actions.approve',
    defaultMessage: '通过',
  },
  revoke: {
    id: 'root.actions.revoke',
    defaultMessage: '撤销',
  },
  withdraw: {
    id: 'root.actions.withdraw',
    defaultMessage: '撤回',
  },
  gbActionAuth: {
    id: 'root.actions.auth',
    defaultMessage: '授权',
  },
  gbActionUnAuth: {
    id: 'root.actions.unauth',
    defaultMessage: '取消授权',
  },
  gbProgress: {
    id: 'root.common.progresss',
    defaultMessage: '进度',
  },
  batchImport: {
    id: 'root.batch.import',
    defaultMessage: '批量导入',
  },
  viewImportLogs: {
    id: 'root.batch.import.logs',
    defaultMessage: '数据导入历史',
  },
  batchDelete: {
    id: 'root.batch.delete',
    defaultMessage: '批量删除',
  },
  deleteConfirm: {
    id: 'root.delete.confirm',
    defaultMessage: '确定删除?',
  },
  resetConfrim: {
    id: 'root.reset.confirm',
    defaultMessage: '确定重置?',
  },
  discardConfirm: {
    id: 'root.discard.confirm',
    defaultMessage: '放弃修改的内容?',
  },
  confirmOp: {
    id: 'root.confirm.op',
    defaultMessage: '确定操作?',
  },
  completed: {
    id: 'root.completed',
    defaultMessage: '完成',
  },
  error: {
    id: 'root.error',
    defaultMessage: '错误',
  },
  seqNo: {
    id: 'root.seq.no',
    defaultMessage: '序号',
  },
  remark: {
    id: 'root.remark',
    defaultMessage: '备注',
  },
  flow: {
    id: 'root.flow',
    defaultMessage: '流程',
  },
  createdBy: {
    id: 'root.created.by',
    defaultMessage: '创建者',
  },
  createdDate: {
    id: 'root.created.date',
    defaultMessage: '创建日期',
  },
  lastUpdatedBy: {
    id: 'root.last.updated.by',
    defaultMessage: '最近更新者',
  },
  lastUpdatedDate: {
    id: 'root.last.updated.date',
    defaultMessage: '最近更新时间',
  },
  nextStep: {
    id: 'root.next.step',
    defaultMessage: '下一步',
  },
  total: {
    id: 'root.pagination.total',
    defaultMessage: '共',
  },
  items: {
    id: 'root.pagination.items',
    defaultMessage: '条',
  },
  rangeDateToday: {
    id: 'root.range.today',
    defaultMessage: '今日',
  },
  rangeDateMonth: {
    id: 'root.range.month',
    defaultMessage: '当月',
  },
  masterInfo: {
    id: 'root.tab.master.info',
    defaultMessage: '主信息',
  },
  detailsInfo: {
    id: 'root.tab.details.info',
    defaultMessage: '详细信息',
  },
  attachment: {
    id: 'root.tab.attachment',
    defaultMessage: '附件',
  },
  team: {
    id: 'root.tab.team',
    defaultMessage: '协作团队',
  },
  logs: {
    id: 'root.tab.logs',
    defaultMessage: '操作记录',
  },
  basicInfo: {
    id: 'root.tab.master.basic.info',
    defaultMessage: '基本信息',
  },
  extendedInfo: {
    id: 'root.tab.master.extended.info',
    defaultMessage: '扩展信息',
  },
  orderInfo: {
    id: 'root.tab.master.order.info',
    defaultMessage: '订单信息',
  },
  relShipment: {
    id: 'root.tab.master.rel.shipment',
    defaultMessage: '关联货运',
  },
  sysInfo: {
    id: 'root.tab.master.sys.info',
    defaultMessage: '系统信息',
  },
  affiliateHQ: {
    id: 'root.affiliate.hq',
    defaultMessage: '集团总部',
  },
  affiliateENT: {
    id: 'root.affiliate.ent',
    defaultMessage: '集团成员',
  },
  customer: {
    id: 'root.partnership.customer',
    defaultMessage: '客户',
  },
  supplier: {
    id: 'root.partnership.supplier',
    defaultMessage: '供应商',
  },
  vendor: {
    id: 'root.partnership.vendor',
    defaultMessage: '服务商',
  },
  member: {
    id: 'root.tenant.member',
    defaultMessage: '成员',
  },
  department: {
    id: 'root.tenant.department',
    defaultMessage: '部门',
  },
  owner: {
    id: 'root.partnership.owner',
    defaultMessage: '货主',
  },
  CUS: {
    id: 'root.partnership.cus',
    defaultMessage: '客',
  },
  SUP: {
    id: 'root.partnership.sup',
    defaultMessage: '供',
  },
  VEN: {
    id: 'root.partnership.ven',
    defaultMessage: '服',
  },
  OWN: {
    id: 'root.partnership.own',
    defaultMessage: '自',
  },
  forwarder: {
    id: 'root.partnership.forwarder',
    defaultMessage: '货运代理',
  },
  broker: {
    id: 'root.partnership.broker',
    defaultMessage: '报关代理',
  },
  shipmentNo: {
    id: 'root.shipment.no',
    defaultMessage: '货运编号',
  },
  relShipmentNo: {
    id: 'root.rel.shipment.no',
    defaultMessage: '关联货运编号',
  },
  custOrderNo: {
    id: 'root.cust.order.no',
    defaultMessage: '订单追踪号',
  },
  bizObjectGlobalDetail: {
    id: 'root.biz.object.global.detail',
    defaultMessage: '货品明细',
  },
  bizObjectShipment: {
    id: 'root.biz.object.shipment',
    defaultMessage: '货运信息',
  },
  bizObjectCommInv: {
    id: 'root.biz.object.comminv',
    defaultMessage: '商业发票',
  },
  bizObjectGdCus: {
    id: 'root.biz.object.gdcus',
    defaultMessage: '报关单表头',
  },
  bizObjectGdCusItem: {
    id: 'root.biz.object.gdcusitem',
    defaultMessage: '报关清单表体',
  },
  bizObjectGdIo: {
    id: 'root.biz.object.gdio',
    defaultMessage: '出入库',
  },
  bizObjectGdAlcFee: {
    id: 'root.biz.object.gdalcfee',
    defaultMessage: '料号级分摊费用',
  },
  bizObjectGdAlcTax: {
    id: 'root.biz.object.gdalctax',
    defaultMessage: '料号级分摊税金',
  },
  bizObjectDelegation: {
    id: 'root.biz.object.delegation',
    defaultMessage: '报关委托',
  },
  entryId: {
    id: 'root.biz.object.customs.decl.entryId',
    defaultMessage: '报关单号',
  },
  bizObjectCustomsDecl: {
    id: 'root.biz.object.customs.decl',
    defaultMessage: '报关单',
  },
  bizObjectCustomsDeclDetail: {
    id: 'root.biz.object.customs.decl.detail',
    defaultMessage: '报关单表体',
  },
  bizObjectCdsTax: {
    id: 'root.biz.object.cds.tax',
    defaultMessage: '报关单级税金',
  },
  bizObjectAsn: {
    id: 'root.biz.object.asn',
    defaultMessage: '收货通知',
  },
  bizObjectInbound: {
    id: 'root.biz.object.inbound',
    defaultMessage: '入库单',
  },
  bizObjectInboundDetail: {
    id: 'root.biz.object.inbound.detail',
    defaultMessage: '入库明细',
  },
  bizObjectEntryReg: {
    id: 'root.biz.object.entry.reg',
    defaultMessage: '保税进区备案',
  },
  bizObjectSo: {
    id: 'root.biz.object.so',
    defaultMessage: '出库订单',
  },
  bizObjectOutbound: {
    id: 'root.biz.object.outbound',
    defaultMessage: '出库单',
  },
  bizObjectOutboundDetail: {
    id: 'root.biz.object.outbound.detail',
    defaultMessage: '出库明细',
  },
  bizObjectReleaseReg: {
    id: 'root.biz.object.release.reg',
    defaultMessage: '保税出区备案',
  },
  moduleSCOF: {
    id: 'root.module.sof',
    defaultMessage: '订单中心',
  },
  moduleBSS: {
    id: 'root.module.bss',
    defaultMessage: '结算中心',
  },
  moduleDIS: {
    id: 'root.module.dis',
    defaultMessage: '数据智能',
  },
  moduleTRANSPORT: {
    id: 'root.module.transport',
    defaultMessage: '运输管理',
  },
  moduleCLEARANCE: {
    id: 'root.module.clearance',
    defaultMessage: '关务管理',
  },
  moduleCWM: {
    id: 'root.module.cwm',
    defaultMessage: '保税仓储',
  },
  modulePTS: {
    id: 'root.module.pts',
    defaultMessage: '加工贸易',
  },
  moduleCorp: {
    id: 'root.module.corp',
    defaultMessage: '企业控制台',
  },
  featCorpOverview: {
    id: 'root.feature.corp.overview',
    defaultMessage: '概况',
  },
  featCorpInfo: {
    id: 'root.feature.corp.info',
    defaultMessage: '企业信息',
  },
  featCorpPersonnel: {
    id: 'root.feature.corp.personnel',
    defaultMessage: '部门与成员',
  },
  featCorpRole: {
    id: 'root.feature.corp.role',
    defaultMessage: '角色权限',
  },
  featCorpAffiliate: {
    id: 'root.feature.corp.affiliate',
    defaultMessage: '集团联盟',
  },
  featCorpCollab: {
    id: 'root.feature.corp.collab',
    defaultMessage: '协作关系',
  },
  featCorpAudit: {
    id: 'root.feature.corp.audit',
    defaultMessage: '审计日志',
  },
  featSofDashboard: {
    id: 'root.feature.sof.dashboard',
    defaultMessage: '工作台',
  },
  featSofShipments: {
    id: 'root.feature.sof.shipments',
    defaultMessage: '货运管理',
  },
  featSofPurchaseOrder: {
    id: 'root.feature.sof.purchase.order',
    defaultMessage: '采购订单',
  },
  featSofSalesOrder: {
    id: 'root.feature.sof.sales.order',
    defaultMessage: '销售订单',
  },
  featSofInvoice: {
    id: 'root.feature.sof.invoice',
    defaultMessage: '商业发票',
  },
  featSofTracking: {
    id: 'root.feature.sof.tracking',
    defaultMessage: '状态跟踪',
  },
  featSofPartners: {
    id: 'root.feature.sof.partners',
    defaultMessage: '合作伙伴管理',
  },
  featSofCustomers: {
    id: 'root.feature.sof.customers',
    defaultMessage: '客户',
  },
  featSofSuppliers: {
    id: 'root.feature.sof.suppliers',
    defaultMessage: '供应商',
  },
  featSofVendors: {
    id: 'root.feature.sof.vendors',
    defaultMessage: '服务商',
  },
  featSofContacts: {
    id: 'root.feature.sof.contacts',
    defaultMessage: '联系人',
  },
  featCdmDashboard: {
    id: 'root.feature.clearance.dashboard',
    defaultMessage: '工作台',
  },
  featCdmDelegation: {
    id: 'root.feature.clearance.delegation',
    defaultMessage: '委托制单',
  },
  featCdmCustoms: {
    id: 'root.feature.clearance.customs',
    defaultMessage: '报关申报',
  },
  featCdmCompliance: {
    id: 'root.feature.clearance.compliance',
    defaultMessage: '合规资料',
  },
  featCdmTradeItem: {
    id: 'root.feature.clearance.trade.item',
    defaultMessage: '商品归类',
  },
  tradeItemRepo: {
    id: 'root.feature.clearance.trade.repo',
    defaultMessage: '归类库',
  },
  featCdmPermit: {
    id: 'root.feature.clearance.permit',
    defaultMessage: '资质证书',
  },
  featCdmDeclTax: {
    id: 'root.feature.clearance.decltax',
    defaultMessage: '税金管理',
  },
  featCdmBilling: {
    id: 'root.feature.clearance.billing',
    defaultMessage: '费用',
  },
  featCdmRevenue: {
    id: 'root.feature.clearance.revenue',
    defaultMessage: '营收计费',
  },
  featCdmExpense: {
    id: 'root.feature.clearance.expense',
    defaultMessage: '支出计费',
  },
  featCdmQuote: {
    id: 'root.feature.clearance.quote',
    defaultMessage: '报价费率',
  },
  featCdmSettings: {
    id: 'root.feature.clearance.setting',
    defaultMessage: '通关设置',
  },
  featTmsDashboard: {
    id: 'root.feature.tms.dashboard',
    defaultMessage: '工作台',
  },
  featTmsPlanning: {
    id: 'root.feature.tms.planning',
    defaultMessage: '运输计划',
  },
  featTmsDispatch: {
    id: 'root.feature.tms.dispatch',
    defaultMessage: '调度分配',
  },
  featTmsTracking: {
    id: 'root.feature.tms.tracking',
    defaultMessage: '在途追踪',
  },
  featTransportResources: {
    id: 'root.feature.transport.resources',
    defaultMessage: '资源',
  },
  featTmsTariff: {
    id: 'root.feature.tms.tariff',
    defaultMessage: '报价费率',
  },
  featTmsReceivable: {
    id: 'root.feature.tms.receivable',
    defaultMessage: '应收费用',
  },
  featTmsPayable: {
    id: 'root.feature.tms.payable',
    defaultMessage: '应付费用',
  },
  featCwmDashboard: {
    id: 'root.feature.cwm.dashboard',
    defaultMessage: '工作台',
  },
  featCwmReceiving: {
    id: 'root.feature.cwm.receiving',
    defaultMessage: '入库',
  },
  featCwmStock: {
    id: 'root.feature.cwm.stock',
    defaultMessage: '在库',
  },
  featCwmStockInventory: {
    id: 'root.feature.cwm.stock.inventory',
    defaultMessage: '库存余量',
  },
  featCwmStockTransition: {
    id: 'root.feature.cwm.stock.transition',
    defaultMessage: '库存调整',
  },
  featCwmStockMovement: {
    id: 'root.feature.cwm.stock.movement',
    defaultMessage: '库存移动',
  },
  featCwmStockTransaction: {
    id: 'root.feature.cwm.stock.transaction',
    defaultMessage: '库存流水',
  },
  featCwmShipping: {
    id: 'root.feature.cwm.shipping',
    defaultMessage: '出库',
  },
  featCwmInboundQuery: {
    id: 'root.feature.cwm.inbound.query',
    defaultMessage: '入库查询',
  },
  featCwmOutboundQuery: {
    id: 'root.feature.cwm.outbound.query',
    defaultMessage: '出库查询',
  },
  featCwmStockQuery: {
    id: 'root.feature.cwm.stock.query',
    defaultMessage: '库存查询',
  },
  featCwmShftz: {
    id: 'root.feature.cwm.shftz.supervision',
    defaultMessage: '上海自贸区保税监管',
  },
  featCwmSasbl: {
    id: 'root.feature.cwm.sasbl',
    defaultMessage: '金二保税物流',
  },
  featCwmBlBook: {
    id: 'root.feature.cwm.blbook',
    defaultMessage: '物流账册',
  },
  featCwmSKU: {
    id: 'root.feature.cwm.product',
    defaultMessage: 'SKU管理',
  },
  featCwmSettings: {
    id: 'root.feature.cwm.setting',
    defaultMessage: '仓库设置',
  },
  featBssDashboard: {
    id: 'root.feature.bss.board',
    defaultMessage: '工作台',
  },
  featBssPayable: {
    id: 'root.feature.bss.payable',
    defaultMessage: '应付结算',
  },
  featBssReceivable: {
    id: 'root.feature.bss.receivable',
    defaultMessage: '应收结算',
  },
  featBssVendorBill: {
    id: 'root.feature.bss.vendor.bill',
    defaultMessage: '服务商账单',
  },
  featBssCustomerBill: {
    id: 'root.feature.bss.customer.bill',
    defaultMessage: '客户账单',
  },
  featBssBillTemplate: {
    id: 'root.feature.bss.bill.template',
    defaultMessage: '账单模板',
  },
  featBssOutputInvoice: {
    id: 'root.feature.bss.invoice.input',
    defaultMessage: '销项发票',
  },
  featBssInputInvoice: {
    id: 'root.feature.bss.invoice.output',
    defaultMessage: '进项发票',
  },
  featBssPayment: {
    id: 'root.feature.bss.payment',
    defaultMessage: '收付款管理',
  },
  featBssClaimPayment: {
    id: 'root.feature.bss.payment.claim',
    defaultMessage: '收款认领',
  },
  featBssApplyPayment: {
    id: 'root.feature.bss.payment.apply',
    defaultMessage: '付款申请',
  },
  featBssVoucher: {
    id: 'root.feature.bss.voucher',
    defaultMessage: '凭证管理',
  },
  featBssSetting: {
    id: 'root.feature.bss.setting',
    defaultMessage: '结算设置',
  },
  featActionView: {
    id: 'root.feature.action.view',
    defaultMessage: '查看',
  },
  featActionEdit: {
    id: 'root.feature.action.edit',
    defaultMessage: '编辑',
  },
  featDisDashboard: {
    id: 'root.feature.dis.dashboard',
    defaultMessage: '数据看板',
  },
  featDisReport: {
    id: 'root.feature.dis.report',
    defaultMessage: '自助报表',
  },
  featDisAnalytics: {
    id: 'root.feature.dis.analytics',
    defaultMessage: '分析图表',
  },
  featPtsDashboard: {
    id: 'root.feature.pts.dashboard',
    defaultMessage: '工作台',
  },
  featPtsPTBook: {
    id: 'root.feature.pts.ptbook',
    defaultMessage: '加贸手/账册',
  },
  featPtsImpExp: {
    id: 'root.feature.pts.impexp',
    defaultMessage: '进出口料件/成品',
  },
  featActionCreate: {
    id: 'root.feature.action.create',
    defaultMessage: '创建',
  },
  featActionDelete: {
    id: 'root.feature.action.delete',
    defaultMessage: '删除',
  },
  featActionImport: {
    id: 'root.feature.action.import',
    defaultMessage: '导入',
  },
  featActionAudit: {
    id: 'root.feature.action.audit',
    defaultMessage: '审核',
  },
  devApps: {
    id: 'root.module.dev.apps',
    defaultMessage: '更多应用',
  },
  templateSetting: {
    id: 'root.feature.action.template.setting',
    defaultMessage: '模版设置',
  },
  todayEarlier: {
    id: 'root.date.today.earlier',
    defaultMessage: '早于当日',
  },
  today: {
    id: 'root.date.today',
    defaultMessage: '当日零点',
  },
  todayLater: {
    id: 'root.date.today.later',
    defaultMessage: '晚于当日',
  },
  day: {
    id: 'root.date.timeUnit.day',
    defaultMessage: '天',
  },
  hour: {
    id: 'root.date.timeUnit.hour',
    defaultMessage: '小时',
  },
  minute: {
    id: 'root.date.timeUnit.minute',
    defaultMessage: '分钟',
  },
  unknownSize: {
    id: 'root.file.size.unknown',
    defaultMessage: '未知大小',
  },
  myOwn: {
    id: 'root.isolation.myOwn',
    defaultMessage: '我负责的',
  },
  myJoined: {
    id: 'root.isolation.myJoined',
    defaultMessage: '我参与团队的',
  },
  myDept: {
    id: 'root.isolation.myDept',
    defaultMessage: '我所在部门的',
  },
  noEitpermission: {
    id: 'root.no.edit.permission',
    defaultMessage: '暂无编辑权限',
  },
  teamName: {
    id: 'corp.collab.empower.team.name',
    defaultMessage: '团队名称',
  },
  teamUsers: {
    id: 'corp.collab.empower.team.users',
    defaultMessage: '人员',
  },
  ourStaff: {
    id: 'corp.collab.empower.our.staff',
    defaultMessage: '我方人员',
  },
  otherStaff: {
    id: 'corp.collab.empower.other.staff',
    defaultMessage: '对方人员',
  },
});
export default messages;
export const formatMsg = formati18n(messages);
