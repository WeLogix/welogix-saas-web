import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import cwmSasblMessage from '../../cwm/sasbl/message.i18n';

const messages = defineMessages({
  importInventory: {
    id: 'pts.impExp.invt.import',
    defaultMessage: '进口核注清单',
  },
  exportInventory: {
    id: 'pts.impExp.invt.export',
    defaultMessage: '出口核注清单',
  },
  importMaterails: {
    id: 'pts.impExp.import.materails',
    defaultMessage: '进口料件',
  },
  exportEndProduct: {
    id: 'pts.impExp.export.endProduct',
    defaultMessage: '出口成品/料件',
  },
});

export default messages;
export const formatMsg = formati18n({ ...messages, ...globalMessages, ...cwmSasblMessage });
