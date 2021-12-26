import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  report: {
    id: 'dis.module.report',
    defaultMessage: '自助报表',
  },
  dashboard: {
    id: 'dis.module.dashboard',
    defaultMessage: '数据看板',
  },
  analytics: {
    id: 'dis.module.analytics',
    defaultMessage: '分析图表',
  },
  viewRptExportFile: {
    id: 'dis.common.view.rpt.export',
    defaultMessage: '查看报表导出文件列表',
  },
  rptExportFiles: {
    id: 'dis.common.rpt.export.files',
    defaultMessage: '导出文件列表',
  },
  addCondition: {
    id: 'dis.report.filter.condition.add',
    defaultMessage: '添加筛选器',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
