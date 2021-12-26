import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  receivable: {
    id: 'bss.receivable',
    defaultMessage: '费用审批',
  },
  statusSubmitted: {
    id: 'bss.receivable.status.submitted',
    defaultMessage: '待审批',
  },
  statusWarning: {
    id: 'bss.receivable.status.warning',
    defaultMessage: '异常费用',
  },
  statusConfirmed: {
    id: 'bss.receivable.status.confirmed',
    defaultMessage: '已确认',
  },
  confirmAll: {
    id: 'bss.receivable.confirm.all',
    defaultMessage: '一键确认',
  },
  searchTips: {
    id: 'bss.receivable.search.tips',
    defaultMessage: '货运编号/客户编号',
  },
  feeCode: {
    id: 'bss.receivable.fee.code',
    defaultMessage: '费用代码',
  },
  feeName: {
    id: 'bss.receivable.fee.name',
    defaultMessage: '费用名称',
  },
  feeType: {
    id: 'bss.receivable.fee.type',
    defaultMessage: '费用类型',
  },
  baseAmount: {
    id: 'bss.receivable.fee.baseAmount',
    defaultMessage: '计费金额',
  },
  diffAmount: {
    id: 'bss.receivable.fee.diffAmount',
    defaultMessage: '调整金额',
  },
  settledAmount: {
    id: 'bss.receivable.fee.settledAmount',
    defaultMessage: '结算金额',
  },
  settledName: {
    id: 'bss.receivable.fee.settledName',
    defaultMessage: '结算方',
  },
  bizExpenseNo: {
    id: 'bss.receivable.fee.bizExpenseNo',
    defaultMessage: '业务编号',
  },
  orderDate: {
    id: 'bss.receivable.orderdDate',
    defaultMessage: '订单日期',
  },
  closeDate: {
    id: 'bss.receivable.closeDate',
    defaultMessage: '结单日期',
  },
  receivableAmount: {
    id: 'bss.receivable.receivableAmount',
    defaultMessage: '应收金额',
  },
  payableAmount: {
    id: 'bss.receivable.payableAmount',
    defaultMessage: '应付金额',
  },
  profitAmount: {
    id: 'bss.receivable.profitAmount',
    defaultMessage: '利润',
  },
  grossProfitRatio: {
    id: 'bss.receivable.grossProfitRatio',
    defaultMessage: '毛利率',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
