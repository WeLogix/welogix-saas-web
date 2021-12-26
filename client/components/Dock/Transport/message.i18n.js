import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from 'client/apps/transport/message.i18n';
import shipmentMessages from 'client/apps/transport/shipment/message.i18n';
import dispatchMesages from 'client/apps/transport/dispatch/message.i18n';

const messages = defineMessages({
  normalSign: {
    id: 'component.dock.freight.pod.sign.normal',
    defaultMessage: '正常签收',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages, ...moduleMessages, ...dispatchMesages, ...shipmentMessages, ...messages,
});
