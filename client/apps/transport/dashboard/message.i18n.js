import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';

const messages = defineMessages({
  dashboard: {
    id: 'transport.dashboard',
    defaultMessage: '工作台',
  },
  total: {
    id: 'transport.dashboard.log.type.total',
    defaultMessage: '总票数',
  },
  atOrigin: {
    id: 'transport.dashboard.log.type.atOrigin',
    defaultMessage: '未启运',
  },
  overtime: {
    id: 'transport.dashboard.log.type.overtime',
    defaultMessage: '超时',
  },
  intransit: {
    id: 'transport.dashboard.log.type.intransit',
    defaultMessage: '在途',
  },
  exception: {
    id: 'transport.dashboard.log.type.exception',
    defaultMessage: '异常',
  },
  arrival: {
    id: 'transport.dashboard.log.type.arrival',
    defaultMessage: '到达',
  },
  accepted: {
    id: 'transport.dashboard.log.type.accepted',
    defaultMessage: '已受理',
  },
  sent: {
    id: 'transport.dashboard.log.type.sent',
    defaultMessage: '已调度',
  },
  pickedup: {
    id: 'transport.dashboard.log.type.pickedup',
    defaultMessage: '已提货',
  },
  delivered: {
    id: 'transport.dashboard.log.type.delivered',
    defaultMessage: '已送货',
  },
  completed: {
    id: 'transport.dashboard.log.type.completed',
    defaultMessage: '已完成',
  },
  departurePlace: {
    id: 'transport.dashboard.log.departure.place',
    defaultMessage: '出发地',
  },
  shipmtEstPickupDate: {
    id: 'transport.dashboard.log.est.pickup.date',
    defaultMessage: '计划提货',
  },
  arrivalPlace: {
    id: 'transport.dashboard.log.arrival.place',
    defaultMessage: '到达地',
  },
  shipmtActPickupDate: {
    id: 'transport.dashboard.log.act.pickup.date',
    defaultMessage: '实际提货',
  },
  shipmtEstDeliveryDate: {
    id: 'transport.dashboard.log.est.delivery.date',
    defaultMessage: '计划到达',
  },
  shipmtPrmDeliveryDate: {
    id: 'transport.dashboard.log.promise.delivery.date',
    defaultMessage: '承诺到达',
  },
  shipmtActDeliveryDate: {
    id: 'transport.dashboard.log.act.delivery.date',
    defaultMessage: '实际到达',
  },
  shipmtStatus: {
    id: 'transport.dashboard.log.shipmt.status',
    defaultMessage: '当前状态',
  },
  srName: {
    id: 'transport.dashboard.log.shipmt.srName',
    defaultMessage: '客户',
  },
  shipmtMode: {
    id: 'transport.dashboard.log.shipment.mode',
    defaultMessage: '运输模式',
  },
  pendingShipmt: {
    id: 'transport.dashboard.log.pending.shipment',
    defaultMessage: '待接单',
  },
  acceptedShipmt: {
    id: 'transport.dashboard.log.accepted.shipment',
    defaultMessage: '待调度',
  },
  dispatchedShipmt: {
    id: 'transport.dashboard.log.dispatched.shipment',
    defaultMessage: '待提货',
  },
  intransitShipmt: {
    id: 'transport.dashboard.log.intransit.shipment',
    defaultMessage: '运输中',
  },
  deliveredShipmt: {
    id: 'transport.dashboard.log.delivered.shipment',
    defaultMessage: '已送货',
  },

  toLocateShipmt: {
    id: 'transport.dashboard.log.toLocate.shipment',
    defaultMessage: '待上报位置',
  },
  toDeliverShipmt: {
    id: 'transport.dashboard.log.toDelivered.shipment',
    defaultMessage: '待送货',
  },
  toUploadPod: {
    id: 'transport.dashboard.log.toUploadPod.shipment',
    defaultMessage: '回单待上传',
  },
  toAuditPod: {
    id: 'transport.dashboard.log.toAuditPod.shipment',
    defaultMessage: '回单待审核',
  },
  toConfirm: {
    id: 'transport.dashboard.log.toConfirm.shipment',
    defaultMessage: '短信确认',
  },
  proofOfDelivery: {
    id: 'transport.dashboard.log.proof.delivery',
    defaultMessage: '回单',
  },
  todoAccept: {
    id: 'transport.dashboard.todo.accept',
    defaultMessage: '计划',
  },
  todoTrack: {
    id: 'transport.dashboard.todo.track',
    defaultMessage: '跟踪',
  },
  todoPod: {
    id: 'transport.dashboard.todo.pod',
    defaultMessage: '回单',
  },
  todoBilling: {
    id: 'transport.dashboard.todo.billing',
    defaultMessage: '账单',
  },
  all: {
    id: 'transport.dashboard.todo.accept.all',
    defaultMessage: '全部',
  },
  toAccept: {
    id: 'transport.dashboard.todo.accept.toAccept',
    defaultMessage: '待接单',
  },
  toDispatch: {
    id: 'transport.dashboard.todo.accept.toDispatch',
    defaultMessage: '待分配',
  },
  prompt: {
    id: 'transport.dashboard.todo.accept.prompt',
    defaultMessage: '客户催促',
  },
  export: {
    id: 'transport.dashboard.export',
    defaultMessage: '导出',
  },
});

export default messages;
export const formatMsg = formati18n(messages);
