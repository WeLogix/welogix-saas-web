import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  all: {
    id: 'cms.tax.filter.all',
    defaultMessage: '全部',
  },
  pending: {
    id: 'cms.tax.filter.pending',
    defaultMessage: '待缴税',
  },
  processing: {
    id: 'cms.tax.filter.processing',
    defaultMessage: '缴税处理中',
  },
  paid: {
    id: 'cms.tax.filter.paid',
    defaultMessage: '缴税完成',
  },
  batchImportTaxes: {
    id: 'cms.tax.batchImportTaxes',
    defaultMessage: '批量导入税金',
  },
  searchPlaceholder: {
    id: 'cms.tax.searchPlaceholder',
    defaultMessage: '报关单号/提运单号/内部编号',
  },
  entryId: {
    id: 'cms.tax.entryId',
    defaultMessage: '报关单号',
  },
  preEntrySeqNo: {
    id: 'cms.tax.preEntrySeqNo',
    defaultMessage: '报关内部编号',
  },
  blWbNo: {
    id: 'cms.tax.blWbNo',
    defaultMessage: '提运单号',
  },
  dutiableTradeTotal: {
    id: 'cms.tax.dutiable.trade.total',
    defaultMessage: '完税总价',
  },
  dutyRate: {
    id: 'cms.tax.dutyRate',
    defaultMessage: '关税税率',
  },
  dutyTax: {
    id: 'cms.tax.dutyTax',
    defaultMessage: '预估关税',
  },
  gstRate: {
    id: 'cms.tax.gstRate',
    defaultMessage: '消费税率',
  },
  gstTax: {
    id: 'cms.tax.gstTax',
    defaultMessage: '预估消费税',
  },
  vatRate: {
    id: 'cms.tax.vat.rate',
    defaultMessage: '增值税率',
  },
  vatTax: {
    id: 'cms.tax.vatTax',
    defaultMessage: '预估增值税',
  },
  totalTax: {
    id: 'cms.tax.totalTax',
    defaultMessage: '总税费',
  },
  gName: {
    id: 'cms.tax.gName',
    defaultMessage: '商品名称',
  },
  actualDutyTax: {
    id: 'cms.tax.actualDutyTax',
    defaultMessage: '实际关税',
  },
  actualVatTax: {
    id: 'cms.tax.actualVatTax',
    defaultMessage: '实际增值税',
  },
  actualGstTax: {
    id: 'cms.tax.actualGstTax',
    defaultMessage: '实际消费税',
  },
  antiDumpingDuty: {
    id: 'cms.tax.anti.dumping.duty',
    defaultMessage: '反倾销税',
  },
  deposit: {
    id: 'cms.tax.deposit',
    defaultMessage: '保证金',
  },
  delayedDeclarationFee: {
    id: 'cms.tax.delayedDeclarationFee',
    defaultMessage: '滞报金',
  },
  specialDutyTax: {
    id: 'cms.tax.specialDutyTax',
    defaultMessage: '特别关税',
  },
  counterVailingDuty: {
    id: 'cms.tax.counterVailingDuty',
    defaultMessage: '反补贴税',
  },
  discardTax: {
    id: 'cms.tax.discardTax',
    defaultMessage: '废弃基金税',
  },
  dutyTaxInterest: {
    id: 'cms.tax.dutyTaxInterest',
    defaultMessage: '关税缓息',
  },
  exciseTaxInterest: {
    id: 'cms.tax.exciseTaxInterest',
    defaultMessage: '消费税缓息',
  },
  payerEntity: {
    id: 'cms.tax.payerEntity',
    defaultMessage: '收发货单位',
  },
  ieDate: {
    id: 'cms.tax.ie.date',
    defaultMessage: '进出口日期',
  },
  paidDate: {
    id: 'cms.tax.paidDate',
    defaultMessage: '缴税完成日期',
  },
  origCountry: {
    id: 'cms.tax.orig.country',
    defaultMessage: '原产国',
  },
  tradeTotal: {
    id: 'cms.tax.trade.total',
    defaultMessage: '申报总价',
  },
  exchangeRate: {
    id: 'cms.tax.exchange.rate',
    defaultMessage: '汇率',
  },
  taxStatus: {
    id: 'cms.tax.status',
    defaultMessage: '付税状态',
  },
  noTaxPayment: {
    id: 'cms.tax.no.payment',
    defaultMessage: '暂无税费单，请使用插件同步或导入税费单',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });

