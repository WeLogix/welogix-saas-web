import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'pts.module.dashboard',
    defaultMessage: '工作台',
  },
  analytics: {
    id: 'pts.module.analytics',
    defaultMessage: '分析图表',
  },
  dataShare: {
    id: 'pts.module.data.share',
    defaultMessage: '数据共享',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
