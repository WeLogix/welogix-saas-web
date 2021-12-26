import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  toRelease: {
    id: 'cwm.dashboard.stats.to.release',
    defaultMessage: '待释放',
  },
  inboundStats: {
    id: 'cwm.dashboard.stats.inbound',
    defaultMessage: '入库',
  },
  monthlyInbound: {
    id: 'cwm.dashboard.stats.inbound.monthly',
    defaultMessage: '月入库订单量',
  },
  asnPending: {
    id: 'cwm.dashboard.stats.asn.pending',
    defaultMessage: '待释放ASN',
  },
  toReceive: {
    id: 'cwm.dashboard.stats.inbound.to.receive',
    defaultMessage: '收货',
  },
  toPutAway: {
    id: 'cwm.dashboard.stats.inbound.to.putAway',
    defaultMessage: '上架',
  },
  inboundCompleted: {
    id: 'cwm.dashboard.stats.inbound.complete',
    defaultMessage: '入库完成',
  },
  outboundStats: {
    id: 'cwm.dashboard.stats.outbound',
    defaultMessage: '出库',
  },
  monthlyOutbound: {
    id: 'cwm.dashboard.stats.outbound.monthly',
    defaultMessage: '当月出库订单量',
  },
  soPending: {
    id: 'cwm.dashboard.stats.so.pending',
    defaultMessage: '待释放SO',
  },
  toAllocate: {
    id: 'cwm.dashboard.stats.outbound.to.allocate',
    defaultMessage: '待分配',
  },
  toPick: {
    id: 'cwm.dashboard.stats.outbound.to.pick',
    defaultMessage: '待拣货',
  },
  toShip: {
    id: 'cwm.dashboard.stats.outbound.to.ship',
    defaultMessage: '待发货',
  },
  unpreallocNum: {
    id: 'cwm.dashboard.stats.outbound.unpreallocNum',
    defaultMessage: '预配不足',
  },
  outboundCompleted: {
    id: 'cwm.dashboard.stats.outbound.completed',
    defaultMessage: '已出库',
  },
  tasksTotal: {
    id: 'cwm.dashboard.stats.tasks.total',
    defaultMessage: '总量',
  },
  tasksCompleted: {
    id: 'cwm.dashboard.stats.tasks.completed',
    defaultMessage: '完成量',
  },
  receipts: {
    id: 'cwm.dashboard.stats.tasks.receipts',
    defaultMessage: '收货',
  },
  putaways: {
    id: 'cwm.dashboard.stats.tasks.putaways',
    defaultMessage: '上架',
  },
  pickings: {
    id: 'cwm.dashboard.stats.tasks.pickings',
    defaultMessage: '拣货',
  },
  shipments: {
    id: 'cwm.dashboard.stats.tasks.shipments',
    defaultMessage: '发货',
  },
  replenishments: {
    id: 'cwm.dashboard.stats.tasks.replenishments',
    defaultMessage: '补货',
  },
  bondedStats: {
    id: 'cwm.dashboard.stats.bonded',
    defaultMessage: '保税监管',
  },
  entry: {
    id: 'cwm.dashboard.stats.bonded.entry',
    defaultMessage: '进区备案',
  },
  normalRelease: {
    id: 'cwm.dashboard.stats.bonded.normal',
    defaultMessage: '普通出库',
  },
  portionRelease: {
    id: 'cwm.dashboard.stats.bonded.portion',
    defaultMessage: '分拨出库',
  },
  toSync: {
    id: 'cwm.dashboard.stats.bonded.to.sync',
    defaultMessage: '待同步',
  },
  toClear: {
    id: 'cwm.dashboard.stats.bonded.to.clear',
    defaultMessage: '待清关',
  },
  toExit: {
    id: 'cwm.dashboard.stats.bonded.to.exit',
    defaultMessage: '待出区',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
