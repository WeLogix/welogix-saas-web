import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  createBizObject: {
    id: 'paas.data.subject.create',
    defaultMessage: '新建数据主题',
  },
  model: {
    id: 'paas.data.subject.model',
    defaultMessage: '数据模型',
  },
  dimension: {
    id: 'paas.data.subject.model.dimension',
    defaultMessage: '维度',
  },
  measure: {
    id: 'paas.data.subject.model.measure',
    defaultMessage: '度量',
  },
  fieldType: {
    id: 'paas.data.subject.model.field.type',
    defaultMessage: '类型',
  },
  fieldName: {
    id: 'paas.data.subject.model.field.name',
    defaultMessage: '名称',
  },
  dwd: {
    id: 'paas.data.subject.dwd',
    defaultMessage: '宽表数据',
  },

});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
