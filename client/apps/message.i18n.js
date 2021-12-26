import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  loadingMore: {
    id: 'saas.changelog.loadingMore',
    defaultMessage: '加载更多',
  },
  versionUpdate: {
    id: 'saas.version.update',
    defaultMessage: '发现系统已有新的版本, 请点击更新',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
export const formatGlobalMsg = formati18n(globalMessages);
