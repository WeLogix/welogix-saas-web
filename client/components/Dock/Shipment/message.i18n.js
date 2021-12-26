import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from 'client/apps/scof/message.i18n';
import shipmentsMessages from 'client/apps/scof/shipments/message.i18n';


const messages = defineMessages({
  flowInfo: {
    id: 'component.dock.flow.info',
    defaultMessage: '货运流程',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages, ...moduleMessages, ...shipmentsMessages, ...messages,
});
