import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';

const messages = defineMessages({
  dashboard: {
    id: 'pts.dashboard',
    defaultMessage: '工作台',
  },
  orderStats: {
    id: 'pts.dashboard.shipment.stats',
    defaultMessage: '订单统计',
  },
  totalOrders: {
    id: 'pts.dashboard.shipment.total',
    defaultMessage: '订单总量',
  },
  pending: {
    id: 'pts.dashboard.shipment.pending',
    defaultMessage: '待处理',
  },
  processing: {
    id: 'pts.dashboard.shipment.processing',
    defaultMessage: '进行中',
  },
  urgent: {
    id: 'pts.dashboard.shipment.urgent',
    defaultMessage: '紧急',
  },
  completed: {
    id: 'pts.dashboard.shipment.completed',
    defaultMessage: '已完成',
  },
});

export default messages;
export const formatMsg = formati18n(messages);
