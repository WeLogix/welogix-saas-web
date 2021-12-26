import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  categories: {
    id: 'paas.radar.rule.categories',
    defaultMessage: '分类',
  },
  catCls: {
    id: 'paas.radar.rule.cat.classification',
    defaultMessage: '归类预警',
  },
  catVal: {
    id: 'paas.radar.rule.cat.value',
    defaultMessage: '价格预警',
  },
  catQua: {
    id: 'paas.radar.rule.cat.qualification',
    defaultMessage: '资质预警',
  },
  catKpi: {
    id: 'paas.radar.rule.cat.kpi',
    defaultMessage: 'KPI预警',
  },
  decPriceRisk: {
    id: 'paas.risk.decprice',
    defaultMessage: '申报单价波动',
  },
  uniformRule: {
    id: 'paas.risk.decprice.uniformrule',
    defaultMessage: '统一参数配置',
  },
  ruleDesc: {
    id: 'paas.risk.rule.desc',
    defaultMessage: '规则描述',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
