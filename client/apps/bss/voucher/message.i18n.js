import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  voucher: {
    id: 'bss.voucher',
    defaultMessage: '记账凭证',
  },
  receivedPayment: {
    id: 'bss.voucher.received',
    defaultMessage: '收款认领',
  },
  voucherVoucher: {
    id: 'bss.voucher.voucher',
    defaultMessage: '付款凭证',
  },
  transferVoucher: {
    id: 'bss.voucher.transter.voucher',
    defaultMessage: '转账凭证',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
