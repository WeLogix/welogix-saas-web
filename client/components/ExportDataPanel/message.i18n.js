import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';

const messages = defineMessages({
  export: {
    id: 'component.export.data.panel.export',
    defaultMessage: '导出',
  },
  dataObjects: {
    id: 'component.export.data.panel.data.objects',
    defaultMessage: '导出数据对象',
  },
  exportOptions: {
    id: 'component.export.data.panel.options',
    defaultMessage: '导出选项',
  },
  allData: {
    id: 'component.export.data.panel.all.data',
    defaultMessage: '全部',
  },
  specificPeriod: {
    id: 'component.export.data.panel.specific.period',
    defaultMessage: '指定创建时间段',
  },
  specificModifyRange: {
    id: 'component.export.data.panel.specific.modifyrange',
    defaultMessage: '指定更新时间段',
  },
  pageListFilter: {
    id: 'component.export.data.panel.listFilter',
    defaultMessage: '指定页面过滤状态',
  },
  headerFields: {
    id: 'component.export.data.panel.header.fields',
    defaultMessage: '表头字段',
  },
  bodyFields: {
    id: 'component.export.data.panel.body.fields',
    defaultMessage: '表体字段',
  },
  exportFormat: {
    id: 'component.export.data.panel.export.format',
    defaultMessage: '导出文件格式',
  },
  pleaseSelectFields: {
    id: 'component.export.data.panel.warning.pleaseSelectFields',
    defaultMessage: '请选择导出字段',
  },
  pleaseSelectexportTemplate: {
    id: 'component.export.data.panel.pleaseSelectexportTemplate',
    defaultMessage: '请选择导出模板',
  },
});
export default messages;
export const formatMsg = formati18n(messages);
