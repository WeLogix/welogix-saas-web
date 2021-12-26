import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  dwObjectTitle: {
    id: 'paas.dwobject.title',
    defaultMessage: '对象名称',
  },
  bmdtText: {
    id: 'paas.dwobject.dt.text',
    defaultMessage: '文本',
  },
  bmdtHyperlink: {
    id: 'paas.dwobject.dt.hyperlink',
    defaultMessage: '超链接',
  },
  bmdtNumber: {
    id: 'paas.dwobject.dt.number',
    defaultMessage: '数字',
  },
  bmdtDate: {
    id: 'paas.dwobject.dt.date',
    defaultMessage: '日期',
  },
  bmdtDatetime: {
    id: 'paas.dwobject.dt.datetime',
    defaultMessage: '日期时间',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
