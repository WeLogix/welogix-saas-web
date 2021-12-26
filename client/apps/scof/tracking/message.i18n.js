import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  any: {
    id: 'sof.tracking.filter.any',
    defaultMessage: '不限',
  },
  searchPlaceholder: {
    id: 'sof.tracking.search.placeholder',
    defaultMessage: '搜索',
  },
  importTrackingFollow: {
    id: 'sof.tracking.import.follow',
    defaultMessage: '导入跟踪表',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
