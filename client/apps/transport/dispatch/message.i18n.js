import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  shipNo: {
    id: 'transport.dispatch.ship.no',
    defaultMessage: '运输编号',
  },
  spDispLoginName: {
    id: 'transport.dispatch.ship.spDispLoginName',
    defaultMessage: '调度人员',
  },
  refCustomerNo: {
    id: 'transport.dispatch.ref.customer.no',
    defaultMessage: '订单追踪号',
  },
  shipNoCount: {
    id: 'transport.dispatch.ship.no_count',
    defaultMessage: '运单数',
  },
  originShipNo: {
    id: 'transport.dispatch.ship.origin_no',
    defaultMessage: '原始运单号',
  },
  segmentShipNo: {
    id: 'transport.dispatch.ship.segment_no',
    defaultMessage: '分段运运单号',
  },
  shipRequirement: {
    id: 'transport.dispatch.ship.requirement',
    defaultMessage: '托运客户',
  },
  shipSp: {
    id: 'transport.dispatch.ship.sp',
    defaultMessage: '承运商',
  },
  shipVehicle: {
    id: 'transport.dispatch.ship.vehicle',
    defaultMessage: '分配车辆',
  },
  shipPickupDate: {
    id: 'transport.dispatch.pickup.date',
    defaultMessage: '提货日期',
  },
  shipConsigner: {
    id: 'transport.dispatch.ship.consigner',
    defaultMessage: '发货方',
  },
  consignerPlace: {
    id: 'transport.dispatch.consigner.place',
    defaultMessage: '起运地',
  },
  consignerAddr: {
    id: 'transport.dispatch.consigner.addr',
    defaultMessage: '发货地址',
  },
  shipDeliveryDate: {
    id: 'transport.dispatch.delivery.date',
    defaultMessage: '送货日期',
  },
  shipConsignee: {
    id: 'transport.dispatch.ship.consignee',
    defaultMessage: '收货方',
  },
  consigneePlace: {
    id: 'transport.dispatch.consignee.place',
    defaultMessage: '目的地',
  },
  consigneeAddr: {
    id: 'transport.dispatch.consignee.addr',
    defaultMessage: '收货地址',
  },
  routePlace: {
    id: 'transport.dispatch.route.place',
    defaultMessage: '途经地',
  },
  routeAddr: {
    id: 'transport.dispatch.route.addr',
    defaultMessage: '途经地址',
  },
  shipMode: {
    id: 'transport.dispatch.shipment.mode',
    defaultMessage: '运输方式',
  },
  packageNum: {
    id: 'transport.dispatch.shipment.packageNum',
    defaultMessage: '件数',
  },
  shipWeight: {
    id: 'transport.dispatch.shipment.weight',
    defaultMessage: '重量',
  },
  shipVolume: {
    id: 'transport.dispatch.shipment.volume',
    defaultMessage: '体积',
  },
  shipAcceptTime: {
    id: 'transport.dispatch.shipment.accept.time',
    defaultMessage: '接单时间',
  },
  shipmtOP: {
    id: 'transport.dispatch.shipment.op',
    defaultMessage: '操作',
  },
  shipmtBOP: {
    id: 'transport.dispatch.shipment.bop',
    defaultMessage: '批量操作',
  },
  shipPod: {
    id: 'transport.dispatch.shipment.pod',
    defaultMessage: '回单',
  },
  shipFreightCharge: {
    id: 'transport.dispatch.shipment.freightcharge',
    defaultMessage: '运费',
  },
  shipDispTime: {
    id: 'transport.dispatch.shipment.dispatchedtime',
    defaultMessage: '分配时间',
  },
  shipSendTime: {
    id: 'transport.dispatch.shipment.sendtime',
    defaultMessage: '发送时间',
  },
  ownFleet: {
    id: 'transport.dispatch.own.fleet',
    defaultMessage: '我的车队',
  },
  filterProvince: {
    id: 'transport.dispatch.filter.province',
    defaultMessage: '省',
  },
  filterCity: {
    id: 'transport.dispatch.filter.city',
    defaultMessage: '城市',
  },
  filterDistrict: {
    id: 'transport.dispatch.filter.district',
    defaultMessage: '区县',
  },
  filterPlace: {
    id: 'transport.dispatch.filter.place',
    defaultMessage: '提货地',
  },
  filterConsignor: {
    id: 'transport.dispatch.filter.consignor',
    defaultMessage: '发货方',
  },
  filterAddr: {
    id: 'transport.dispatch.filter.addr',
    defaultMessage: '收货地',
  },
  filterConsignee: {
    id: 'transport.dispatch.filter.consignee',
    defaultMessage: '收货方',
  },
  filterTitle: {
    id: 'transport.dispatch.filter.title',
    defaultMessage: '按条件汇总',
  },
  filterTitleSubLine: {
    id: 'transport.dispatch.filter.title.subline',
    defaultMessage: '按线路汇总',
  },
  filterTitleConsignor: {
    id: 'transport.dispatch.filter.title.consignor',
    defaultMessage: '按发货汇总',
  },
  filterTitleConsignee: {
    id: 'transport.dispatch.filter.title.consignee',
    defaultMessage: '按到货汇总',
  },
  infoTitle: {
    id: 'transport.dispatch.info.title',
    defaultMessage: '已按从省到城市线路汇总',
  },
  filterTextConsignor: {
    id: 'transport.dispatch.filter.text.consignor',
    defaultMessage: '发货',
  },
  filterTextConsignee: {
    id: 'transport.dispatch.filter.text.consignee',
    defaultMessage: '到货',
  },
  btnTextOk: {
    id: 'transport.dispatch.btn.text.ok',
    defaultMessage: '确定',
  },
  btnTextCancel: {
    id: 'transport.dispatch.btn.text.cancel',
    defaultMessage: '取消',
  },
  btnTextOriginShipments: {
    id: 'transport.dispatch.btn.text.origin',
    defaultMessage: '显示被分段的运单',
  },
  btnTextReturnList: {
    id: 'transport.dispatch.btn.text.returnlist',
    defaultMessage: '返回列表',
  },
  btnTextDispatch: {
    id: 'transport.dispatch.btn.text.dispatch',
    defaultMessage: '分配',
  },
  btnChargeCompute: {
    id: 'transport.dispatch.btn.charge.compute',
    defaultMessage: '计算运费',
  },
  btnTextBatchDispatch: {
    id: 'transport.dispatch.btn.text.batch_dispatch',
    defaultMessage: '批量分配',
  },
  btnTextSegment: {
    id: 'transport.dispatch.btn.text.segment',
    defaultMessage: '分段',
  },
  dispConsolidation: {
    id: 'transport.dispatch.consolidation',
    defaultMessage: '拼单',
  },
  btnTextBatchSegment: {
    id: 'transport.dispatch.btn.text.batch_segment',
    defaultMessage: '批量分段',
  },
  btnTextSegmentCancel: {
    id: 'transport.dispatch.btn.text.segmentcancel',
    defaultMessage: '取消分段',
  },
  btnTextBatchSend: {
    id: 'transport.dispatch.btn.text.batch_send',
    defaultMessage: '批量发送',
  },
  btnTextSend: {
    id: 'transport.dispatch.btn.text.send',
    defaultMessage: '发送',
  },
  btnTextReturn: {
    id: 'transport.dispatch.btn.text.return',
    defaultMessage: '退回',
  },
  btnTextRemove: {
    id: 'transport.dispatch.btn.text.remove',
    defaultMessage: '移出',
  },
  btnTextExport: {
    id: 'transport.dispatch.btn.text.export',
    defaultMessage: '导出',
  },
  rdTextWaiting: {
    id: 'transport.dispatch.rd.text.waiting',
    defaultMessage: '待分配',
  },
  rdTextDispatching: {
    id: 'transport.dispatch.rd.text.dispatching',
    defaultMessage: '待发送',
  },
  rdTextDispatched: {
    id: 'transport.dispatch.rd.text.dispatched',
    defaultMessage: '已发送',
  },
  tabTextCarrier: {
    id: 'transport.dispatch.tab.text.carrier',
    defaultMessage: '选择承运商',
  },
  carrierSearchPlaceholder: {
    id: 'transport.dispatch.tab.carrier.search.placeholder',
    defaultMessage: '查找承运商名称',
  },
  vehicleSearchPlaceholder: {
    id: 'transport.dispatch.tab.vehicle.search.placeholder',
    defaultMessage: '查找车牌号',
  },
  tabTextVehicle: {
    id: 'transport.dispatch.tab.text.vehicle',
    defaultMessage: '选择车辆',
  },
  searchPlaceholder: {
    id: 'transport.dispatch.search.placeholder',
    defaultMessage: '搜索运单号',
  },
  editConsolidation: {
    id: 'transport.dispatch.consolidation.edit',
    defaultMessage: '编辑/调度主运单',
  },
  transInfo: {
    id: 'transport.dispatch.consolidation.tab.transInfo',
    defaultMessage: '物流信息',
  },
  subShipmtsInfo: {
    id: 'transport.dispatch.consolidation.tab.subShipmtsInfo',
    defaultMessage: '子运单信息',
  },
  shipmtNo: {
    id: 'transport.dispatch.consolidation.shipmtNo',
    defaultMessage: '运输编号',
  },
  mainShipmtNo: {
    id: 'transport.dispatch.consolidation.mainShipmtNo',
    defaultMessage: '主运单号',
  },
  goodsType: {
    id: 'transport.dispatch.consolidation.goodsType',
    defaultMessage: '货物类型',
  },
  expeditedType: {
    id: 'transport.dispatch.consolidation.expeditedType',
    defaultMessage: '加急状态',
  },
  pickupEstDate: {
    id: 'transport.dispatch.consolidation.pickupEstDate',
    defaultMessage: '预计提货日期',
  },
  pleaseSelectPickupPreDate: {
    id: 'transport.dispatch.consolidation.pleaseSelectPickupEstDate',
    defaultMessage: '请选择预计提货日期',
  },
  transitTime: {
    id: 'transport.dispatch.consolidation.transitTime',
    defaultMessage: '时效(天)',
  },
  pleaseInputAging: {
    id: 'transport.dispatch.consolidation.pleaseInputTransitTime',
    defaultMessage: '请填写时效',
  },
  deliverEstDate: {
    id: 'transport.dispatch.consolidation.deliverEstDate',
    defaultMessage: '预计送货日期',
  },
  pleaseSelectDeliverPreDate: {
    id: 'transport.dispatch.consolidation.pleaseSelectDeliverEstDate',
    defaultMessage: '请选择预计送货日期',
  },
  transMode: {
    id: 'transport.dispatch.consolidation.transMode',
    defaultMessage: '运输方式',
  },
  pleaseSelectTransMode: {
    id: 'transport.dispatch.consolidation.pleaseSelectTransMode',
    defaultMessage: '请选择运输方式',
  },
  totalCount: {
    id: 'transport.dispatch.consolidation.totalCount',
    defaultMessage: '总数量',
  },
  totalWeight: {
    id: 'transport.dispatch.consolidation.totalQty',
    defaultMessage: '总重量',
  },
  totalVolume: {
    id: 'transport.dispatch.consolidation.totalVolume',
    defaultMessage: '总体积',
  },
  relateShipmtNo: {
    id: 'transport.dispatch.relateShipmtNo',
    defaultMessage: '关联主运单号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
