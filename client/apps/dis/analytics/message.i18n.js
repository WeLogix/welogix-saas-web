import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  tradeAnalytics: {
    id: 'dis.analytics.trade',
    defaultMessage: '进出口分析',
  },
  cusDeclAnalytics: {
    id: 'dis.analytics.cusdecl',
    defaultMessage: '通关分析',
  },
  configChart: {
    id: 'dis.analytics.config.chart',
    defaultMessage: '配置图表',
  },
  searchFields: {
    id: 'dis.analytics.object.fields.search',
    defaultMessage: '搜索字段',
  },
  dimensionFields: {
    id: 'dis.analytics.object.dimension.fields',
    defaultMessage: '维度字段',
  },
  measureFields: {
    id: 'dis.analytics.object.measure.fields',
    defaultMessage: '度量字段',
  },
  axis: {
    id: 'dis.analytics.setting.axis',
    defaultMessage: '坐标轴',
  },
  dataRange: {
    id: 'dis.analytics.setting.dataRange',
    defaultMessage: '数据范围',
  },
  addMeasure: {
    id: 'dis.analytics.setting.axis.addMeasure',
    defaultMessage: '添加度量',
  },
  addCalcMeasure: {
    id: 'dis.analytics.setting.axis.add.calculate.dimension',
    defaultMessage: '添加计算度量',
  },
  addDimension: {
    id: 'dis.analytics.setting.axis.addDimension',
    defaultMessage: '添加维度',
  },
  reportName: {
    id: 'dis.analytics.quote.report.name',
    defaultMessage: '报表名称',
  },
  defFormula: {
    id: 'dis.analytics.setting.define.formula',
    defaultMessage: '定义计算规则',
  },
  nestedAggreateNotSurpported: {
    id: 'dis.analytics.metric.nested.aggreate.not.surpported',
    defaultMessage: '不支持聚合方式嵌套',
  },
  headAndTailCannotBeOperator: {
    id: 'dis.analytics.metric.head.and.tail.cannot.be.operator',
    defaultMessage: '表达式头尾两端不可为算符',
  },
  dotShouldWrappedByNumber: {
    id: 'dis.analytics.metric.dot.should.wrapped.by.number',
    defaultMessage: '\'.\'两侧必须是数字',
  },
  numberFomatWrong: {
    id: 'dis.analytics.metric.number.fomat.wrong',
    defaultMessage: '数字格式错误',
  },
  emptyInsideAggreate: {
    id: 'dis.analytics.metric.empty.inside.aggreate',
    defaultMessage: '聚合函数内部应有表达式',
  },
  fieldNumberAggreateCannotBeTogether: {
    id: 'dis.analytics.metric.field.number.aggreate.cannot.be.together',
    defaultMessage: '出现连续的字段、数字、聚合函数',
  },
  continuousOperator: {
    id: 'dis.analytics.metric.continuous.operator',
    defaultMessage: '出现连续算符',
  },
  aggreateNotClosed: {
    id: 'dis.analytics.metric.aggreate.not.closed',
    defaultMessage: '【未闭合',
  },
  bracketNotClosed: {
    id: 'dis.analytics.metric.bracket.not.closed',
    defaultMessage: '括号未闭合',
  },
  afterAggreateShouldBeOperator: {
    id: 'dis.analytics.metric.after.aggreate.should.be.operator',
    defaultMessage: '聚合方式或反括号后应跟算符',
  },
  atLeastOneField: {
    id: 'dis.analytics.metric.at.least.one.field',
    defaultMessage: '表达式应至少包含一个字段',
  },
  metricName: {
    id: 'dis.analytics.metric.name',
    defaultMessage: '计算度量名称',
  },
  pickAField: {
    id: 'dis.analytics.metric.pick.a.field',
    defaultMessage: '选择字段',
  },
  pickAggreate: {
    id: 'dis.analytics.metric.pick.aggreate',
    defaultMessage: '选择聚合方式',
  },
  resultFormat: {
    id: 'dis.analytics.metric.result.format',
    defaultMessage: '计算结果值格式',
  },
  intOrFloat: {
    id: 'dis.analytics.metric.int.or.float',
    defaultMessage: '选择数字格式',
  },
  apply: {
    id: 'dis.analytics.setting.apply',
    defaultMessage: '应用',
  },
});
export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
