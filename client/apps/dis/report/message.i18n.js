import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  createReport: {
    id: 'dis.report.create',
    defaultMessage: '新建报表',
  },
  renameReport: {
    id: 'dis.report.rename',
    defaultMessage: '报表重命名',
  },
  createCategory: {
    id: 'dis.report.create.category',
    defaultMessage: '新建报表分类',
  },
  subscribe: {
    id: 'dis.report.subscribe',
    defaultMessage: '订阅',
  },
  searchTips: {
    id: 'dis.report.search.tips',
    defaultMessage: '搜索报表',
  },
  reportConfig: {
    id: 'dis.report.config',
    defaultMessage: '报表配置',
  },
  previewReport: {
    id: 'dis.report.preview',
    defaultMessage: '预览报表',
  },
  dataRange: {
    id: 'dis.report.range',
    defaultMessage: '数据范围',
  },
  dataCols: {
    id: 'dis.report.cols',
    defaultMessage: '报表数据列',
  },
  deleteCol: {
    id: 'dis.report.col.delete',
    defaultMessage: '删除列',
  },
  resetCol: {
    id: 'dis.report.col.reset',
    defaultMessage: '重置列',
  },
  colStats: {
    id: 'dis.report.col.stats',
    defaultMessage: '统计',
  },
  colCount: {
    id: 'dis.report.col.count',
    defaultMessage: '计数',
  },
  colSum: {
    id: 'dis.report.col.sum',
    defaultMessage: '合计值',
  },
  colAvg: {
    id: 'dis.report.col.avg',
    defaultMessage: '平均值',
  },
  colSort: {
    id: 'dis.report.col.sort',
    defaultMessage: '排序',
  },
  colAsc: {
    id: 'dis.report.col.asc',
    defaultMessage: '正序',
  },
  colDesc: {
    id: 'dis.report.col.desc',
    defaultMessage: '倒序',
  },
  searchFields: {
    id: 'dis.report.object.fields.search',
    defaultMessage: '搜索字段',
  },
  groupFields: {
    id: 'dis.report.filter.groupFields',
    defaultMessage: '分组字段',
  },
  settle: {
    id: 'dis.report.filter.settle',
    defaultMessage: '应用',
  },
  reportCategory: {
    id: 'dis.report.category',
    defaultMessage: '报表分类',
  },
  reportCategoryName: {
    id: 'dis.report.category.name',
    defaultMessage: '分类名称',
  },
  pleaseInputReportCategoryName: {
    id: 'dis.report.input.category.name',
    defaultMessage: '请输入分类名称',
  },
  moveToCategory: {
    id: 'dis.report.moveto.category',
    defaultMessage: '移动到分类',
  },
  renameCategory: {
    id: 'dis.report.rename.category',
    defaultMessage: '分类重命名',
  },
  reportCategoryShouldNotBeEmpty: {
    id: 'dis.report.category.shouldNotBeEmpty',
    defaultMessage: '报表类别不能为空',
  },
  bizObject: {
    id: 'dis.report.bizObject',
    defaultMessage: '业务对象',
  },
  selectBizObject: {
    id: 'dis.report.select.biz.object',
    defaultMessage: '请选择业务对象',
  },
  reportObjectShouldNotBeEmpty: {
    id: 'dis.report.bizObject.shouldNotBeEmpty',
    defaultMessage: '业务对象不能为空',
  },
  reportName: {
    id: 'dis.report.name',
    defaultMessage: '报表名称',
  },
  rptDwSubject: {
    id: 'dis.report.dwsubject',
    defaultMessage: '报表数据主题',
  },
  reportNameShouldNotBeEmpty: {
    id: 'dis.report.name.shouldNotBeEmpty',
    defaultMessage: '报表名称不能为空',
  },
  exportPreviewReport: {
    id: 'dis.report.preview.export',
    defaultMessage: '导出预览报表',
  },
  noCategory: {
    id: 'dis.report.no.category',
    defaultMessage: '未分类',
  },
  applyPreview: {
    id: 'dis.report.settle.apply.preview',
    defaultMessage: '数据预览',
  },
  textFields: {
    id: 'dis.report.biz.object.textFields',
    defaultMessage: '文本字段',
  },
  numberFields: {
    id: 'dis.report.biz.object.numberFields',
    defaultMessage: '数字字段',
  },
  dateFields: {
    id: 'dis.report.biz.object.dateFields',
    defaultMessage: '日期字段',
  },
  paramFields: {
    id: 'dis.report.biz.object.paramFields',
    defaultMessage: '选择项字段',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
