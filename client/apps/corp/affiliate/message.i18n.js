import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  unionBu: {
    id: 'corp.affiliate.unionBu',
    defaultMessage: '所属事业单元',
  },
  bu: {
    id: 'corp.affiliate.bu',
    defaultMessage: '事业单元',
  },
  buName: {
    id: 'corp.affiliate.bu.name',
    defaultMessage: '名称',
  },
  joinedDate: {
    id: 'corp.affiliate.joinedDate',
    defaultMessage: '加入时间',
  },
  HQTenant: {
    id: 'corp.affiliate.HQTenant',
    defaultMessage: '集团总部',
  },
  ENTTenant: {
    id: 'corp.affiliate.ENTTenant',
    defaultMessage: '集团成员',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
