import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  paymentRequest: {
    id: 'bss.payment.request',
    defaultMessage: '付款单',
  },
  receivedPayment: {
    id: 'bss.payment.received',
    defaultMessage: '收款认领',
  },
  createPayment: {
    id: 'bss.payment.create',
    defaultMessage: '新建付款单',
  },
  transferVoucher: {
    id: 'bss.payment.transter.voucher',
    defaultMessage: '转账凭证',
  },
  accountPayable: {
    id: 'bss.payment.accountPayable',
    defaultMessage: '应付款',
  },
  advancePayment: {
    id: 'bss.payment.advancePayment',
    defaultMessage: '预付款',
  },
  paymentType: {
    id: 'bss.payment.type',
    defaultMessage: '付款类型',
  },
  approvalStatus: {
    id: 'bss.payment.approvalStatus',
    defaultMessage: '审批状态',
  },
  approvalBy: {
    id: 'bss.payment.approvalBy',
    defaultMessage: '审批人',
  },
  paymentStatus: {
    id: 'bss.payment.paymentStatus',
    defaultMessage: '支付状态',
  },
  payer: {
    id: 'bss.payment.payer',
    defaultMessage: '付款人',
  },
  paymentDate: {
    id: 'bss.payment.paymentDate',
    defaultMessage: '支付日期',
  },
  requestBy: {
    id: 'bss.payment.requestBy',
    defaultMessage: '申请人',
  },
  requestDate: {
    id: 'bss.payment.requestDate',
    defaultMessage: '申请时间',
  },
  searchTips: {
    id: 'bss.payment.searchTips',
    defaultMessage: '付款单号',
  },
  paymentAccount: {
    id: 'bss.payment.paymentAccount',
    defaultMessage: '付款账户',
  },
  bankReceiptNo: {
    id: 'bss.payment.bankReceiptNo',
    defaultMessage: '银行交易流水号',
  },
  tradeAmount: {
    id: 'bss.payment.tradeAmount',
    defaultMessage: '交易金额',
  },
  cancelApproved: {
    id: 'bss.payment.cancelApproved',
    defaultMessage: '取消审批',
  },
  pay: {
    id: 'bss.payment.pay',
    defaultMessage: '支付',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
