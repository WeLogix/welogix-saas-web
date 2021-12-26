import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'cms.dashboard',
    defaultMessage: '工作台',
  },
  monthlyDeclStats: {
    id: 'cms.dashboard.stats.monthly.decl',
    defaultMessage: '报关概况',
  },
  total: {
    id: 'cms.dashboard.stats.total',
    defaultMessage: '总票数',
  },
  totalValue: {
    id: 'cms.dashboard.stats.total.value',
    defaultMessage: '总货值',
  },
  importDecl: {
    id: 'cms.dashboard.stats.import.decl',
    defaultMessage: '进口报关',
  },
  customsDecl: {
    id: 'cms.dashboard.stats.customs.decl',
    defaultMessage: '报关',
  },
  sumExport: {
    id: 'cms.dashboard.stats.sum.export',
    defaultMessage: '出口/出境',
  },
  sumExportValue: {
    id: 'cms.dashboard.stats.sum.export.value',
    defaultMessage: '出口货值',
  },
  processing: {
    id: 'cms.dashboard.stats.status.processing',
    defaultMessage: '制单',
  },
  declared: {
    id: 'cms.dashboard.stats.status.declared',
    defaultMessage: '申报',
  },
  released: {
    id: 'cms.dashboard.stats.status.released',
    defaultMessage: '放行',
  },
  inspected: {
    id: 'cms.dashboard.stats.status.inspected',
    defaultMessage: '查验',
  },
  inspectedRate: {
    id: 'cms.dashboard.stats.status.inspected.rate',
    defaultMessage: '查验率',
  },
  caught: {
    id: 'cms.dashboard.stats.status.caught',
    defaultMessage: '查获',
  },
  caughtRate: {
    id: 'cms.dashboard.stats.status.caught.rate',
    defaultMessage: '查获率',
  },
  revised: {
    id: 'cms.dashboard.stats.status.revised',
    defaultMessage: '删改单',
  },
  revisedRate: {
    id: 'cms.dashboard.stats.status.revised.rate',
    defaultMessage: '删改单率',
  },
  classificationStats: {
    id: 'cms.dashboard.stats.classification',
    defaultMessage: '归类统计',
  },
  repoCount: {
    id: 'cms.dashboard.stats.classification.repo.count',
    defaultMessage: '企业归类库',
  },
  classifiedItems: {
    id: 'cms.dashboard.stats.classification.classified.items',
    defaultMessage: '已归类',
  },
  pendingItems: {
    id: 'cms.dashboard.stats.classification.pending.items',
    defaultMessage: '归类待定',
  },
  unclassifiedItems: {
    id: 'cms.dashboard.stats.classification.unclassified.items',
    defaultMessage: '未归类',
  },
  taxStats: {
    id: 'cms.dashboard.stats.tax',
    defaultMessage: '税金统计',
  },
  totalPaid: {
    id: 'cms.dashboard.stats.tax.total.paid',
    defaultMessage: '缴税总额',
  },
  duty: {
    id: 'cms.dashboard.stats.tax.duty',
    defaultMessage: '关税',
  },
  VAT: {
    id: 'cms.dashboard.stats.tax.VAT',
    defaultMessage: '增值税',
  },
  comsuTax: {
    id: 'cms.dashboard.stats.tax.comsuTax',
    defaultMessage: '消费税',
  },
  totalWithdrawn: {
    id: 'cms.dashboard.stats.tax.total.withdrawn',
    defaultMessage: '退税总额',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
