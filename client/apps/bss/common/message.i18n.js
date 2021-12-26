import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  accountSet: {
    id: 'bss.common.account.set',
    defaultMessage: '账套',
  },
  feeCode: {
    id: 'bss.common.fee.code',
    defaultMessage: '费用代码',
  },
  feeName: {
    id: 'bss.common.fee.name',
    defaultMessage: '费用名称',
  },
  feeType: {
    id: 'bss.common.fee.type',
    defaultMessage: '费用类型',
  },
  baseAmount: {
    id: 'bss.common.fee.baseAmount',
    defaultMessage: '计费金额',
  },
  diffAmount: {
    id: 'bss.common.fee.diffAmount',
    defaultMessage: '调整金额',
  },
  settledAmount: {
    id: 'bss.common.fee.settledAmount',
    defaultMessage: '结算金额',
  },
  settledName: {
    id: 'bss.common.fee.settledName',
    defaultMessage: '结算方',
  },
  bizType: {
    id: 'bss.common.fee.biz.type',
    defaultMessage: '业务单据类型',
  },
  bizNo: {
    id: 'bss.common.fee.bizNo',
    defaultMessage: '业务编号',
  },
  orderDate: {
    id: 'bss.common.orderdDate',
    defaultMessage: '订单日期',
  },
  closeDate: {
    id: 'bss.common.closeDate',
    defaultMessage: '结单日期',
  },
  receivableAmount: {
    id: 'bss.common.receivableAmount',
    defaultMessage: '应收金额',
  },
  payableAmount: {
    id: 'bss.common.payableAmount',
    defaultMessage: '应付金额',
  },
  profitAmount: {
    id: 'bss.common.profitAmount',
    defaultMessage: '利润',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
