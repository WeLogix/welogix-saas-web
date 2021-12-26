import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  adapter: {
    id: 'paas.adapter',
    defaultMessage: '数据适配器',
  },
  importAdapter: {
    id: 'paas.adapter.import',
    defaultMessage: '导入适配',
  },
  exportAdapter: {
    id: 'paas.adapter.export',
    defaultMessage: '导出适配',
  },
  searchTip: {
    id: 'paas.adapter.search.tip',
    defaultMessage: '搜索适配器',
  },
  create: {
    id: 'paas.adapter.create',
    defaultMessage: '新建',
  },
  createAdapter: {
    id: 'paas.adapter.create.adapter',
    defaultMessage: '新建数据适配器',
  },
  config: {
    id: 'paas.adapter.config',
    defaultMessage: '配置',
  },
  configAdapter: {
    id: 'paas.adapter.config.adapter',
    defaultMessage: '配置数据适配器',
  },
  save: {
    id: 'paas.adapter.save',
    defaultMessage: '保存',
  },
  adapterName: {
    id: 'paas.adapter.name',
    defaultMessage: '适配器名称',
  },
  adapterFileFormat: {
    id: 'paas.adapter.file.format',
    defaultMessage: '文件类型',
  },
  csvDelimiter: {
    id: 'paas.adapter.csv.delimiter',
    defaultMessage: 'CSV分隔符',
  },
  adapterBizModel: {
    id: 'paas.adapter.biz.model',
    defaultMessage: '适配数据对象',
  },
  relatedPartner: {
    id: 'paas.adapter.related.partner',
    defaultMessage: '关联客户',
  },
  relatedFlows: {
    id: 'paas.adapter.related.flows',
    defaultMessage: '关联流程',
  },
  exampleFileMaxColumns: {
    id: 'paas.adapter.related.examplefile.columns',
    defaultMessage: '示例文件列数',
  },
  profile: {
    id: 'paas.adapter.profile',
    defaultMessage: '基本信息',
  },
  params: {
    id: 'paas.adapter.params',
    defaultMessage: '参数设置',
  },
  startLine: {
    id: 'paas.adapter.params.start.line',
    defaultMessage: '起始行',
  },
  more: {
    id: 'paas.adapter.more',
    defaultMessage: '更多',
  },
  loading: {
    id: 'paas.adapter.loading',
    defaultMessage: '加载中...',
  },
  preview: {
    id: 'paas.adapter.preview',
    defaultMessage: '效果预览',
  },
  previewFailed: {
    id: 'paas.adapter.previewFailed',
    defaultMessage: '预览失败',
  },
  ignored: {
    id: 'paas.adapter.ignored',
    defaultMessage: '该行将被忽略',
  },
  createBizExportTemplate: {
    id: 'paas.menu.templates.biz.export.create',
    defaultMessage: '新建导出模板',
  },
  headFields: {
    id: 'paas.menu.templates.headFields',
    defaultMessage: '表头默认字段',
  },
  bodyFields: {
    id: 'paas.menu.templates.bodyFields',
    defaultMessage: '表体默认字段',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
