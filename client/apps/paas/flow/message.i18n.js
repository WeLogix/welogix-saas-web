import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  flowName: {
    id: 'paas.flow.name',
    defaultMessage: '流程名称',
  },
  mustHaveFlowNameHint: {
    id: 'paas.flow.newNameHint',
    defaultMessage: '流程名不能为空',
  },
  copyFlowTitle: {
    id: 'paas.flow.copy',
    defaultMessage: '复制流程',
  },
  copyFlowSucceed: {
    id: 'paas.flow.copySucceed',
    defaultMessage: '复制成功',
  },
  newFlowName: {
    id: 'paas.flow.newName',
    defaultMessage: '新的流程名',
  },
  flowDesigner: {
    id: 'paas.flow.designer',
    defaultMessage: '流程设计器',
  },
  createFlow: {
    id: 'paas.flow.create',
    defaultMessage: '新建流程',
  },
  flowCustomer: {
    id: 'paas.flow.customer',
    defaultMessage: '关联客户',
  },
  flowServiceTeam: {
    id: 'paas.flow.service.team',
    defaultMessage: '服务团队',
  },
  customerTracking: {
    id: 'paas.flow.customer.tracking',
    defaultMessage: '客户追踪表',
  },
  nodeOrdering: {
    id: 'paas.flow.node.ordering',
    defaultMessage: '节点次序',
  },
  flowRelationGraph: {
    id: 'paas.flow.relation.graph',
    defaultMessage: '流程关系图',
  },
  addFlowNode: {
    id: 'paas.flow.node.add',
    defaultMessage: '添加节点',
  },
  addFlowEdge: {
    id: 'paas.flow.edge.add',
    defaultMessage: '添加边界',
  },
  eraseFlowItem: {
    id: 'paas.flow.item.erase',
    defaultMessage: '删除选中元素',
  },
  flowEdge: {
    id: 'paas.flow.graph.edge',
    defaultMessage: '节点边界',
  },
  providerQuoteNo: {
    id: 'paas.flow.biz.cms.provider.quote.no',
    defaultMessage: '服务报价',
  },
  sourceNode: {
    id: 'paas.flow.edge.source',
    defaultMessage: '来源节点',
  },
  targetNode: {
    id: 'paas.flow.edge.target',
    defaultMessage: '目标节点',
  },
  edgeCondition: {
    id: 'paas.flow.edge.condition',
    defaultMessage: '边界条件',
  },
  importFlowNode: {
    id: 'paas.flow.node.import',
    defaultMessage: '进口清关节点',
  },
  exportFlowNode: {
    id: 'paas.flow.node.export',
    defaultMessage: '出口清关节点',
  },
  tmsFlowNode: {
    id: 'paas.flow.node.tms',
    defaultMessage: '运输节点',
  },
  cwmrecFlowNode: {
    id: 'paas.flow.node.cwm.rec',
    defaultMessage: '仓储入库节点',
  },
  cwmshipFlowNode: {
    id: 'paas.flow.node.cwm.ship',
    defaultMessage: '仓储出库节点',
  },
  ptsimpFlowNode: {
    id: 'paas.flow.node.pts.import',
    defaultMessage: '加工贸易进口节点',
  },
  ptsexpFlowNode: {
    id: 'paas.flow.node.pts.export',
    defaultMessage: '加工贸易出口节点',
  },
  terminalFlowNode: {
    id: 'paas.flow.node.terminal',
    defaultMessage: '流程终结点',
  },
  saveFlow: {
    id: 'paas.flow.graph.save',
    defaultMessage: '保存',
  },
  flowSetting: {
    id: 'paas.flow.setting',
    defaultMessage: '流程设置',
  },
  bizObjOperation: {
    id: 'paas.flow.biz.object.operation',
    defaultMessage: '业务操作',
  },
  cwmShippingOrderNormalReg: {
    id: 'paas.flow.biz.cwm.shipping.normalreg',
    defaultMessage: '普通出库',
  },
  declCustoms: {
    id: 'paas.flow.biz.cms.declcustoms',
    defaultMessage: '申报地海关',
  },
  declWay: {
    id: 'paas.flow.biz.cms.declWay',
    defaultMessage: '报关类型',
  },
  transMode: {
    id: 'paas.flow.biz.cms.transMode',
    defaultMessage: '运输方式',
  },
  ownerBrokerQuoteNo: {
    id: 'paas.flow.biz.cms.ownerbroker.quoteno',
    defaultMessage: '货主-报关行报价',
  },
  ownerFwdQuoteNo: {
    id: 'paas.flow.biz.cms.ownerfwd.quoteno',
    defaultMessage: '货主-货代报价',
  },
  fwdBrokerQuoteNo: {
    id: 'paas.flow.biz.cms.fwdbroker.quoteno',
    defaultMessage: '货代-报关行报价',
  },
  ownerDispVisible: {
    id: 'paas.flow.biz.cms.owner.delg.visible',
    defaultMessage: '委托货主可见',
  },
  manifestPermit: {
    id: 'paas.flow.biz.cms.manifest.permit',
    defaultMessage: '制单权限',
  },
  reviewPermit: {
    id: 'paas.flow.biz.cms.review.permit',
    defaultMessage: '复核权限',
  },
  declPermit: {
    id: 'paas.flow.biz.cms.decl.permit',
    defaultMessage: '申报权限',
  },
  manifestTemplate: {
    id: 'paas.flow.biz.cms.manifest.template',
    defaultMessage: '制单规则',
  },
  customsDeclType: {
    id: 'paas.flow.biz.cms.customs.decl.type',
    defaultMessage: '单证类型',
  },
  customsDeclChannel: {
    id: 'paas.flow.biz.cms.customs.decl.channel',
    defaultMessage: '申报通道',
  },
  epClient: {
    id: 'paas.flow.biz.cms.customs.easipass',
    defaultMessage: '导入客户端',
  },
  consigner: {
    id: 'paas.flow.biz.tms.consigner',
    defaultMessage: '发货人',
  },
  consignee: {
    id: 'paas.flow.biz.tms.consignee',
    defaultMessage: '收货人',
  },
  transitMode: {
    id: 'paas.flow.biz.tms.transit.mode',
    defaultMessage: '运输模式',
  },
  cargoType: {
    id: 'paas.flow.biz.tms.cargo.type',
    defaultMessage: '货物类型',
  },
  podType: {
    id: 'paas.flow.biz.tms.pod.type',
    defaultMessage: '回单',
  },
  locationProvince: {
    id: 'paas.flow.biz.tms.location.province',
    defaultMessage: '省/市/区',
  },
  locationAddress: {
    id: 'paas.flow.biz.tms.location.address',
    defaultMessage: '具体地址',
  },
  locationContact: {
    id: 'paas.flow.biz.tms.location.contact',
    defaultMessage: '联系人/电话/邮箱',
  },
  newStartLocation: {
    id: 'paas.flow.biz.tms.newStartLocation',
    defaultMessage: '新起始地',
  },
  cwmWarehouse: {
    id: 'paas.flow.biz.cwm.warehouse',
    defaultMessage: '仓库',
  },
  supplier: {
    id: 'paas.flow.biz.cwm.supplier',
    defaultMessage: '供应商',
  },
  nodeName: {
    id: 'paas.flow.biz.node.name',
    defaultMessage: '节点名称',
  },
  nodeDemander: {
    id: 'paas.flow.biz.node.demander',
    defaultMessage: '服务需求方',
  },
  nodeProvider: {
    id: 'paas.flow.biz.node.provider',
    defaultMessage: '服务提供方',
  },
  nodeExecutor: {
    id: 'paas.flow.biz.node.executor',
    defaultMessage: '节点负责人',
  },
  multiBizInstance: {
    id: 'paas.flow.biz.node.multi.instance',
    defaultMessage: '多业务实例',
  },
  bizProperties: {
    id: 'paas.flow.biz.properites',
    defaultMessage: '业务属性',
  },
  nodeProperties: {
    id: 'paas.flow.node.properites',
    defaultMessage: '节点属性',
  },
  nodeEvents: {
    id: 'paas.flow.node.events',
    defaultMessage: '节点事件',
  },
  bizEvents: {
    id: 'paas.flow.biz.events',
    defaultMessage: '业务事件',
  },
  nodeOnEnter: {
    id: 'paas.flow.biz.node.onenter',
    defaultMessage: '进入节点',
  },
  nodeOnExit: {
    id: 'paas.flow.biz.node.onexit',
    defaultMessage: '离开节点',
  },
  onCreated: {
    id: 'paas.flow.biz.event.created',
    defaultMessage: '已创建',
  },
  onDelgDeclared: {
    id: 'paas.flow.biz.event.cms.declared',
    defaultMessage: '已发送申报',
  },
  onDelgInspected: {
    id: 'paas.flow.biz.event.cms.inspected',
    defaultMessage: '已查验',
  },
  onDelgReleased: {
    id: 'paas.flow.biz.event.cms.released',
    defaultMessage: '已放行',
  },
  onManifestGenerated: {
    id: 'paas.flow.biz.event.cms.manifest.generated',
    defaultMessage: '已生成报关建议书',
  },
  onCustomsReviewed: {
    id: 'paas.flow.biz.event.cms.customs.reviewed',
    defaultMessage: '已复核',
  },
  onShipmtAccepted: {
    id: 'paas.flow.biz.event.tms.shipmt.accepted',
    defaultMessage: '已接单',
  },
  onShipmtDispatched: {
    id: 'paas.flow.biz.event.tms.shipmt.dispatched',
    defaultMessage: '已调度',
  },
  onPickedUp: {
    id: 'paas.flow.biz.event.tms.shipment.pickedup',
    defaultMessage: '已提货',
  },
  onDelivered: {
    id: 'paas.flow.biz.event.tms.shipment.delivered',
    defaultMessage: '已送货',
  },
  onPod: {
    id: 'paas.flow.biz.event.tms.shipment.pod',
    defaultMessage: '已回单',
  },
  onAsnReleased: {
    id: 'paas.flow.biz.event.asn.released',
    defaultMessage: '已释放',
  },
  onAsnInbound: {
    id: 'paas.flow.biz.event.asn.inbound',
    defaultMessage: '收货中',
  },
  onAsnFinished: {
    id: 'paas.flow.biz.event.asn.finished',
    defaultMessage: '已完成',
  },
  onSoReleased: {
    id: 'paas.flow.biz.event.so.released',
    defaultMessage: '已释放',
  },
  onSoOutbound: {
    id: 'paas.flow.biz.event.so.outbound',
    defaultMessage: '出库中',
  },
  onSoFinished: {
    id: 'paas.flow.biz.event.so.finished',
    defaultMessage: '已发货',
  },
  onSoDecl: {
    id: 'paas.flow.biz.event.so.decl',
    defaultMessage: '对应出库清关',
  },
  onSoRltDecl: {
    id: 'paas.flow.biz.event.so.rlt_decl',
    defaultMessage: '关联出库清关',
  },
  onRegFinished: {
    id: 'paas.flow.biz.event.reg.finished',
    defaultMessage: '已备案',
  },
  delgDeclare: {
    id: 'paas.flow.biz.action.delg.declare',
    defaultMessage: '自动申报（仅适用于接口对接模式）',
  },
  manifestCreate: {
    id: 'paas.flow.biz.action.manifest.create',
    defaultMessage: '生成清单',
  },
  manifestGenerate: {
    id: 'paas.flow.biz.action.manifest.generate',
    defaultMessage: '生成报关建议书',
  },
  customsReview: {
    id: 'paas.flow.biz.action.customs.review',
    defaultMessage: '复核',
  },
  customsDeclare: {
    id: 'paas.flow.biz.action.customs.delcare',
    defaultMessage: '发送申报',
  },
  customsRelease: {
    id: 'paas.flow.biz.action.customs.release',
    defaultMessage: '报关单放行',
  },
  shipmtAccept: {
    id: 'paas.flow.biz.action.shipmt.accept',
    defaultMessage: '接单',
  },
  asnRelease: {
    id: 'paas.flow.biz.action.asn.release',
    defaultMessage: '释放',
  },
  soRelease: {
    id: 'paas.flow.biz.action.so.release',
    defaultMessage: '释放',
  },
  triggerActions: {
    id: 'paas.flow.trigger',
    defaultMessage: '事件触发器',
  },
  addTrigger: {
    id: 'paas.flow.trigger.add',
    defaultMessage: '添加触发器',
  },
  triggerMode: {
    id: 'paas.flow.trigger.mode',
    defaultMessage: '触发方式',
  },
  triggerTimer: {
    id: 'paas.flow.trigger.timer',
    defaultMessage: '定时器',
  },
  triggerAction: {
    id: 'paas.flow.trigger.action',
    defaultMessage: '触发动作',
  },
  notifyContent: {
    id: 'paas.flow.notify.content',
    defaultMessage: '通知内容',
  },
  notifyRemind: {
    id: 'paas.flow.notify.remind',
    defaultMessage: '通知提醒',
  },
  notifyTitle: {
    id: 'paas.flow.notify.title',
    defaultMessage: '标题',
  },
  platformMsg: {
    id: 'paas.flow.notify.platformMsg',
    defaultMessage: '平台消息',
  },
  mail: {
    id: 'paas.flow.notify.mail',
    defaultMessage: '邮箱',
  },
  sms: {
    id: 'paas.flow.notify.sms',
    defaultMessage: '短信',
  },
  timerWait: {
    id: 'paas.flow.trigger.timer.wait',
    defaultMessage: '等待',
  },
  instantTrigger: {
    id: 'paas.flow.trigger.instant',
    defaultMessage: '立即触发',
  },
  scheduledTrigger: {
    id: 'paas.flow.trigger.scheduled',
    defaultMessage: '定时触发',
  },
  actionCreate: {
    id: 'paas.flow.trigger.action.create',
    defaultMessage: '创建业务对象',
  },
  actionUpdate: {
    id: 'paas.flow.trigger.action.update',
    defaultMessage: '更新业务状态',
  },
  actionExecute: {
    id: 'paas.flow.trigger.action.execute',
    defaultMessage: '执行业务操作',
  },
  actionNotify: {
    id: 'paas.flow.trigger.action.notify',
    defaultMessage: '发送通知提醒',
  },
  pendtask: {
    id: 'paas.flow.trigger.action.pendtask',
    defaultMessage: '发送待办事项',
  },
  deadline: {
    id: 'paas.flow.trigger.action.deadline',
    defaultMessage: '截止时间',
  },
  priority: {
    id: 'paas.flow.trigger.action.priority',
    defaultMessage: '优先级',
  },
  orderCreator: {
    id: 'paas.flow.trigger.action.creator.orderCreator',
    defaultMessage: '订单创建人',
  },
  executor: {
    id: 'paas.flow.trigger.action.executor',
    defaultMessage: '执行者',
  },
  system: {
    id: 'paas.flow.trigger.action.creator.system',
    defaultMessage: '系统',
  },
  closeEvent: {
    id: 'paas.flow.trigger.action.closeEvent',
    defaultMessage: '关闭事件',
  },
  meantime: {
    id: 'paas.flow.trigger.action.instant.meantime',
    defaultMessage: '时立即',
  },
  timerMinutes: {
    id: 'paas.flow.trigger.action.scheduled.minutes',
    defaultMessage: '分钟',
  },
  deleteConfirm: {
    id: 'paas.flow.trigger.action.confirm.delete',
    defaultMessage: '确定删除该动作',
  },
  design: {
    id: 'paas.flow.list.action.design',
    defaultMessage: '设计',
  },
  authorizedVendor: {
    id: 'paas.flow.authorized.vendor',
    defaultMessage: '已授权提供方',
  },
  providerNotPartner: {
    id: 'paas.flow.erorr.provider.notpartner',
    defaultMessage: '提供方未与本租户建立客户关系',
  },
  inventory: {
    id: 'paas.flow.pts.inventory',
    defaultMessage: '核注清单',
  },
  owner: {
    id: 'paas.flow.pts.owner',
    defaultMessage: '经营单位',
  },
  bookNo: {
    id: 'paas.flow.pts.book.no',
    defaultMessage: '手/账册编号',
  },
  invtCreated: {
    id: 'paas.flow.pts.invt.created',
    defaultMessage: '已创建',
  },
  invtDeclared: {
    id: 'paas.flow.pts.invt.declared',
    defaultMessage: '已申报',
  },
  invtApproved: {
    id: 'paas.flow.pts.invt.approved',
    defaultMessage: '审批通过',
  },
  invtVerificationed: {
    id: 'paas.flow.pts.invt.verificationed',
    defaultMessage: '已核注',
  },
  invtCreate: {
    id: 'paas.flow.pts.invt.create',
    defaultMessage: '创建',
  },
  invtDeclare: {
    id: 'paas.flow.pts.invt.declare',
    defaultMessage: '申报',
  },
  invtApprove: {
    id: 'paas.flow.pts.invt.approve',
    defaultMessage: '审批',
  },
  invtVerification: {
    id: 'paas.flow.pts.invt.verification',
    defaultMessage: '核注',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
