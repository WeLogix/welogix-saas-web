import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  search: {
    id: 'component.action.search',
    defaultMessage: '搜索',
  },
  userProfile: {
    id: 'component.user.profile',
    defaultMessage: '个人资料',
  },
  defaultCascaderRegion: {
    id: 'component.region.default.cascader.region',
    defaultMessage: '省/市/区',
  },
  selectCountry: {
    id: 'component.region.select.country',
    defaultMessage: '选择国家或地区',
  },
  appEditorTitle: {
    id: 'component.appEditor.title',
    defaultMessage: '设置开通的应用',
  },
  appEditorNameCol: {
    id: 'component.appEditor.nameCol',
    defaultMessage: '应用名称',
  },
  appEditorSetCol: {
    id: 'component.appEditor.setCol',
    defaultMessage: '开通状态',
  },
  detail: {
    id: 'component.popover.detail',
    defaultMessage: '详情',
  },
  notification: {
    id: 'component.popover.notification',
    defaultMessage: '通知提醒',
  },
  seeAll: {
    id: 'component.popover.notification.seeall',
    defaultMessage: '查看所有通知',
  },
  helpcenter: {
    id: 'component.popover.helpcenter',
    defaultMessage: '帮助中心',
  },
  online: {
    id: 'component.popover.helpcenter.online',
    defaultMessage: '在线客服',
  },
  feedback: {
    id: 'component.popover.helpcenter.feedback',
    defaultMessage: '意见反馈',
  },
  wxService: {
    id: 'component.popover.helpcenter.wx.service',
    defaultMessage: '扫码关注服务号',
  },
  back: {
    id: 'component.nav.back',
    defaultMessage: '返回',
  },
  close: {
    id: 'component.nav.close',
    defaultMessage: '关闭',
  },
  uploadprogress: {
    id: 'component.segment.uploadprogress',
    defaultMessage: '上传进度',
  },
  importprogress: {
    id: 'component.segment.importprogress',
    defaultMessage: '导入进度',
  },
  segmentupload: {
    id: 'component.segment.segmentupload',
    defaultMessage: '文件分段上传',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
