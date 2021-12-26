import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'tms.module.dashboard',
    defaultMessage: '工作台',
  },
  planning: {
    id: 'tms.module.planning',
    defaultMessage: '运输计划',
  },
  dispatch: {
    id: 'tms.module.dispatch',
    defaultMessage: '调度分配',
  },
  tracking: {
    id: 'tms.module.tracking',
    defaultMessage: '在途追踪',
  },
  billingExpense: {
    id: 'tms.module.billing.expense',
    defaultMessage: '费用管理',
  },
  receivableExpense: {
    id: 'tms.module.billing.expense.receivale',
    defaultMessage: '应收费用',
  },
  payableExpense: {
    id: 'tms.module.billing.expense.payable',
    defaultMessage: '应付费用',
  },
  tariff: {
    id: 'tms.module.billing.tariff',
    defaultMessage: '报价费率',
  },
  analytics: {
    id: 'tms.module.analytics',
    defaultMessage: '报表',
  },
  analyticsKPI: {
    id: 'tms.module.analytics.kpi',
    defaultMessage: 'KPI分析',
  },
  settings: {
    id: 'tms.module.settings',
    defaultMessage: '设置',
  },
  devApps: {
    id: 'tms.module.dev.apps',
    defaultMessage: '更多应用',
  },
  settingsResources: {
    id: 'tms.module.settings.resources',
    defaultMessage: '资源设置',
  },
  settingsTransParam: {
    id: 'tms.module.settings.transparam',
    defaultMessage: '运输参数',
  },
  transNo: {
    id: 'tms.module.trans.no',
    defaultMessage: '运输编号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
