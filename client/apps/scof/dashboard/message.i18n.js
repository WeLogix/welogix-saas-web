import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  procurement: {
    id: 'sof.dashboard.stats.procurement',
    defaultMessage: '采购',
  },
  shipment: {
    id: 'sof.dashboard.stats.shipment',
    defaultMessage: '货运',
  },
  monthlyShipmentStats: {
    id: 'sof.dashboard.stats.shipment.monthly',
    defaultMessage: '货运概况',
  },
  totalOrders: {
    id: 'sof.dashboard.stats.shipment.total',
    defaultMessage: '货运总量',
  },
  pending: {
    id: 'sof.dashboard.stats.pending',
    defaultMessage: '待处理',
  },
  processing: {
    id: 'sof.dashboard.stats.processing',
    defaultMessage: '进行中',
  },
  completed: {
    id: 'sof.dashboard.stats.completed',
    defaultMessage: '已完成',
  },
  urgentShipments: {
    id: 'sof.dashboard.stats.shipment.urgent',
    defaultMessage: '紧急货运',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
