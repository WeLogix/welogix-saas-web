import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from 'client/apps/cms/message.i18n';

const messages = defineMessages({
  declCertDocs: {
    id: 'component.dock.decl.certdocs',
    defaultMessage: '随附单证/据',
  },
  declTrack: {
    id: 'component.dock.decl.track',
    defaultMessage: '通关追踪',
  },
  declBody: {
    id: 'component.dock.decl.body',
    defaultMessage: '表体明细',
  },
  customsInspect: {
    id: 'component.dock.decl.customs.inspect',
    defaultMessage: '查验下达',
  },
  endCustomsInspect: {
    id: 'component.dock.decl.end.customs.inspect',
    defaultMessage: '商检查验通过',
  },
  declTax: {
    id: 'component.dock.decl.tax',
    defaultMessage: '税金',
  },
  ciqInfo: {
    id: 'component.dock.decl.ciq.info',
    defaultMessage: '检验检疫信息',
  },
  docsArchive: {
    id: 'component.dock.decl.archive',
    defaultMessage: '单证归档',
  },
});

export default messages;
export const formatMsg = formati18n({
  ...globalMessages, ...moduleMessages, ...messages,
});
