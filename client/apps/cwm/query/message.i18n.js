import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import shippingMessages from 'client/apps/cwm/shipping/message.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  stockQuery: {
    id: 'cwm.query.stock',
    defaultMessage: '库存查询',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages, ...moduleMessages, ...messages, ...shippingMessages,
});
