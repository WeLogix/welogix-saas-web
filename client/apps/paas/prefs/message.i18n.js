import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  customsCode: {
    id: 'paas.prefs.customs.code',
    defaultMessage: '关区代码',
  },
  tradeMode: {
    id: 'paas.prefs.customs.trade.mode',
    defaultMessage: '监管方式',
  },
  dutyMode: {
    id: 'paas.prefs.customs.dutymode',
    defaultMessage: '征免方式',
  },
  docuCode: {
    id: 'paas.prefs.customs.docu.code',
    defaultMessage: '监管证件',
  },
  countryCode: {
    id: 'paas.prefs.customs.country.code',
    defaultMessage: '国别(地区)',
  },
  currencyCode: {
    id: 'paas.prefs.customs.currency.code',
    defaultMessage: '币制',
  },
  portsCode: {
    id: 'paas.prefs.customs.ports.code',
    defaultMessage: '港口',
  },
  districtCode: {
    id: 'paas.prefs.customs.district.code',
    defaultMessage: '国内地区',
  },
  customCode: {
    id: 'paas.prefs.custom.code',
    defaultMessage: '代码',
  },
  wrapType: {
    id: 'paas.prefs.custom.wrap.type',
    defaultMessage: '包装种类',
  },
  customCName: {
    id: 'paas.prefs.customs.Chinese.name',
    defaultMessage: '中文名称',
  },
  customName: {
    id: 'paas.prefs.customs.custom.name',
    defaultMessage: '关区名称',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
