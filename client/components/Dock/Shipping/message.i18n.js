import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from 'client/apps/cwm/message.i18n';
import shippingMessages from 'client/apps/cwm/shipping/message.i18n';

const messages = defineMessages({
  shippingOrder: {
    id: 'component.dock.so',
    defaultMessage: '出库订单',
  },
  tabFTZ: {
    id: 'component.dock.so.tab.ftz',
    defaultMessage: '保税清单',
  },
  tabSODetails: {
    id: 'component.dock.so.tab.so.details',
    defaultMessage: '出货明细',
  },
  tabPicking: {
    id: 'component.dock.so.tab.picking',
    defaultMessage: '拣货',
  },
  tabPacking: {
    id: 'component.dock.so.tab.packing',
    defaultMessage: '装箱',
  },
  tabShipping: {
    id: 'component.dock.so.tab.shipping',
    defaultMessage: '发货',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages,
  ...moduleMessages,
  ...shippingMessages,
  ...messages,
});
