import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  allShipments: {
    id: 'sof.shipments.all',
    defaultMessage: '全部货运',
  },
  statusPending: {
    id: 'sof.shipments.status.pending',
    defaultMessage: '待处理',
  },
  statusActive: {
    id: 'sof.shipments.status.active',
    defaultMessage: '执行中',
  },
  statusExpedited: {
    id: 'sof.shipments.status.expedited',
    defaultMessage: '加急订单',
  },
  statusCompleted: {
    id: 'sof.shipments.status.completed',
    defaultMessage: '已完成',
  },
  startOrder: {
    id: 'sof.shipments.start',
    defaultMessage: '开始',
  },
  editOrder: {
    id: 'sof.shipments.order.edit',
    defaultMessage: '编辑订单',
  },
  originCountry: {
    id: 'sof.shipments.origin.country',
    defaultMessage: '启运国(地区)',
  },
  destCountry: {
    id: 'sof.shipments.dest.country',
    defaultMessage: '运抵国(地区)',
  },
  // importPort: {
  //  id: 'sof.shipments.import.port',
  //  defaultMessage: '入境口岸',
  // },
  // exportPort: {
  //  id: 'sof.shipments.export.port',
  //  defaultMessage: '离境口岸',
  // },
  deptPort: {
    id: 'sof.shipments.dept.port',
    defaultMessage: '启运港',
  },
  destPort: {
    id: 'sof.shipments.dest.port',
    defaultMessage: '抵运港',
  },

  allOperators: {
    id: 'sof.orders.allOperators',
    defaultMessage: '全部人员',
  },
  searchPlaceholder: {
    id: 'sof.shipments.search.placeholder',
    defaultMessage: '货运订单号或订单追踪号',
  },
  declareWay: {
    id: 'sof.shipments.delg.declareWay',
    defaultMessage: '报关类型',
  },
  manualNo: {
    id: 'sof.shipments.delg.manualNo',
    defaultMessage: '备案号',
  },
  delgGrossWt: {
    id: 'sof.shipments.delg.grosswt',
    defaultMessage: '毛重',
  },
  packageNum: {
    id: 'sof.shipments.delg.packageNum',
    defaultMessage: '件数',
  },
  transferMode: {
    id: 'sof.shipments.biz.cms.transfer.mode',
    defaultMessage: '运输方式',
  },
  tooltipTransferMode: {
    id: 'sof.shipments.biz.cms.transfer.mode.tooltip',
    defaultMessage: '运输方式',
  },
  declCustoms: {
    id: 'sof.shipments.biz.cms.declcustoms',
    defaultMessage: '申报地海关',
  },
  customsBroker: {
    id: 'sof.shipments.biz.cms.customs.broker',
    defaultMessage: '报关代理',
  },
  quoteNo: {
    id: 'sof.shipments.biz.quote.no',
    defaultMessage: '报价编号',
  },
  delgWeight: {
    id: 'sof.shipments.delg.weight',
    defaultMessage: '总毛重',
  },
  pickupEstDate: {
    id: 'sof.order.shipment.pickup.est.date',
    defaultMessage: '计划提货日期',
  },
  shipmtTransit: {
    id: 'sof.order.shipment.transit.time',
    defaultMessage: '时效(天)',
  },
  deliveryEstDate: {
    id: 'sof.order.shipment.delivery.est.date',
    defaultMessage: '计划送货日期',
  },
  personResponsible: {
    id: 'sof.shipments.responsible.person',
    defaultMessage: '负责人',
  },
  created: {
    id: 'sof.shipments.status.created',
    defaultMessage: '创建',
  },
  processing: {
    id: 'sof.shipments.status.processing',
    defaultMessage: '进行中',
  },
  finished: {
    id: 'sof.shipments.status.finished',
    defaultMessage: '已完成',
  },

  client: {
    id: 'sof.shipments.client',
    defaultMessage: '客户名称',
  },
  expedited: {
    id: 'sof.shipments.expedited',
    defaultMessage: '加急标志',
  },
  transfer: {
    id: 'sof.shipments.transfer',
    defaultMessage: '进出口标志',
  },
  transMode: {
    id: 'sof.shipments.transMode',
    defaultMessage: '运输方式',
  },
  billLading: {
    id: 'sof.shipments.billLading',
    defaultMessage: '提货单号(D/O)',
  },
  mawb: {
    id: 'sof.shipments.mawb',
    defaultMessage: '主运单号',
  },
  billLadingNo: {
    id: 'sof.shipments.billLadingNo',
    defaultMessage: '海运单号(B/L)',
  },
  custShipmtHawb: {
    id: 'sof.shipments.custShipmtHawb',
    defaultMessage: '分运单号',
  },
  flightNo: {
    id: 'sof.shipments.flightNo',
    defaultMessage: '航班号',
  },
  shipNameVoyage: {
    id: 'sof.shipments.shipNameVoyage',
    defaultMessage: '船名航次',
  },
  voyage: {
    id: 'sof.shipments.voyage',
    defaultMessage: '航次号',
  },
  forwarder: {
    id: 'sof.shipments.forwarder',
    defaultMessage: '货运代理',
  },
  freight: {
    id: 'sof.shipments.freight',
    defaultMessage: '运费',
  },
  freightCurrency: {
    id: 'sof.shipments.freightCurrency',
    defaultMessage: '运费币制',
  },
  insurFee: {
    id: 'sof.shipments.insurFee',
    defaultMessage: '保费',
  },
  insurCurrency: {
    id: 'sof.shipments.insurCurrency',
    defaultMessage: '保费币制',
  },
  miscFee: {
    id: 'sof.shipments.miscFee',
    defaultMessage: '杂费',
  },
  miscCurrency: {
    id: 'sof.shipments.miscCurrency',
    defaultMessage: '杂费币制',
  },
  goodsType: {
    id: 'sof.shipments.goodsType',
    defaultMessage: '货物类型',
  },
  pieces: {
    id: 'sof.shipments.pieces',
    defaultMessage: '件数',
  },
  wrapType: {
    id: 'sof.shipments.wrapType',
    defaultMessage: '包装',
  },
  totalGrossWt: {
    id: 'sof.shipments.totalGrossWt',
    defaultMessage: '总毛重',
  },
  extAttr: {
    id: 'sof.shipments.extAttr',
    defaultMessage: '扩展字段',
  },
  custRemark: {
    id: 'sof.shipments.custRemark',
    defaultMessage: '备注',
  },
  flowId: {
    id: 'sof.shipments.flowId',
    defaultMessage: '货运流程',
  },
  refExternalNo: {
    id: 'sof.shipments.previewer.ref.external',
    defaultMessage: '订单追踪号',
  },
  delgDeclare: {
    id: 'sof.shipments.progress.action.delg.declare',
    defaultMessage: '发送申报',
  },
  delgInspect: {
    id: 'sof.shipments.progress.action.delg.inspect',
    defaultMessage: '查验',
  },
  delgRelease: {
    id: 'sof.shipments.progress.action.delg.release',
    defaultMessage: '放行',
  },
  manifestCreate: {
    id: 'sof.shipments.progress.action.manifest.create',
    defaultMessage: '生成清单',
  },
  manifestGenerate: {
    id: 'sof.shipments.progress.action.manifest.generate',
    defaultMessage: '生成报关建议书',
  },
  customsReview: {
    id: 'sof.shipments.progress.action.customs.review',
    defaultMessage: '复核',
  },
  customsDeclare: {
    id: 'sof.shipments.progress.action.customs.delcare',
    defaultMessage: '发送申报',
  },
  customsRelease: {
    id: 'sof.shipments.progress.action.customs.release',
    defaultMessage: '报关单放行',
  },
  shipmtAccept: {
    id: 'sof.shipments.progress.action.shipmt.accept',
    defaultMessage: '接单',
  },
  shipmtDispatch: {
    id: 'sof.shipments.progress.action.shipmt.dispatch',
    defaultMessage: '调度',
  },
  shipmtPickup: {
    id: 'sof.shipments.progress.action.shipmt.pickup',
    defaultMessage: '提货',
  },
  shipmtDeliver: {
    id: 'sof.shipments.progress.action.shipmt.deliver',
    defaultMessage: '交货',
  },
  shipmtPod: {
    id: 'sof.shipments.progress.action.shipmt.pod',
    defaultMessage: '回单',
  },
  asnRelease: {
    id: 'sof.shipments.progress.action.asn.release',
    defaultMessage: '释放',
  },
  asnInbound: {
    id: 'sof.shipments.progress.action.asn.inbound',
    defaultMessage: '收货',
  },
  asnFinish: {
    id: 'sof.shipments.progress.action.asn.finished',
    defaultMessage: '入库',
  },
  soRelease: {
    id: 'sof.shipments.progress.action.so.release',
    defaultMessage: '释放',
  },
  soOutbound: {
    id: 'sof.shipments.progress.action.so.outbound',
    defaultMessage: '出库',
  },
  soFinish: {
    id: 'sof.shipments.progress.action.so.finished',
    defaultMessage: '发货',
  },
  soDecl: {
    id: 'sof.shipments.progress.action.so.decl',
    defaultMessage: '保税清关',
  },
  selInvoices: {
    id: 'sof.shipments.invoice.select',
    defaultMessage: '选择商业发票',
  },
  invoiceStatus: {
    id: 'sof.shipments.invoice.status',
    defaultMessage: '发票状态',
  },
  shipped: {
    id: 'sof.shipments.invoice.shipped',
    defaultMessage: '已发货',
  },
  unshipped: {
    id: 'sof.shipments.invoice.unshipped',
    defaultMessage: '未发货',
  },
  category: {
    id: 'sof.shipments.invoice.category',
    defaultMessage: '发票类别',
  },
  coefficient: {
    id: 'sof.shipments.invoice.coefficient',
    defaultMessage: '金额调整系数',
  },
  owner: {
    id: 'sof.shipments.owner',
    defaultMessage: '经营单位',
  },
  bookNo: {
    id: 'sof.shipments.bookno',
    defaultMessage: '手/账册编号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
