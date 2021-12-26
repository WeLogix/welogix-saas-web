import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  apps: {
    id: 'home.apps',
    defaultMessage: '应用服务',
  },
  paas: {
    id: 'home.paas',
    defaultMessage: '平台能力',
  },
  admin: {
    id: 'home.admin',
    defaultMessage: '企业控制台',
  },
  changeLog: {
    id: 'home.changelog',
    defaultMessage: '更新公告',
  },
  notFound: {
    id: 'home.not.found',
    defaultMessage: '未找到该页',
  },
  notFoundDesc: {
    id: 'home.not.found.desc',
    defaultMessage: '抱歉，你访问的页面不存在',
  },
  notification: {
    id: 'home.notification',
    defaultMessage: '通知提醒',
  },
  allMsg: {
    id: 'home.notification.all',
    defaultMessage: '全部通知',
  },
  unread: {
    id: 'home.notification.unread',
    defaultMessage: '未读通知',
  },
  notifType: {
    id: 'home.notification.type',
    defaultMessage: '通知类型',
  },
  notifPriority: {
    id: 'home.notification.priority',
    defaultMessage: '优先级',
  },
  markAllRead: {
    id: 'home.notification.mark.all.read',
    defaultMessage: '标记所有为已读',
  },
  deleteAllRead: {
    id: 'home.notification.delete.all.read',
    defaultMessage: '删除所有已读通知',
  },
  riskLevel: {
    id: 'home.alarm.risklevel',
    defaultMessage: '风险等级',
  },
  detectedRisks: {
    id: 'home.alarm.risk.detectedrisk',
    defaultMessage: '已检测风险项',
  },
  dismissAll: {
    id: 'home.alarm.risk.dismissall',
    defaultMessage: '忽略全部',
  },
  allRisks: {
    id: 'home.alarm.riskall',
    defaultMessage: '全部风险项',
  },
  newRisks: {
    id: 'home.alarm.risknew',
    defaultMessage: '未处理风险',
  },
  triggerDetect: {
    id: 'home.alarm.risk.triggerdetect',
    defaultMessage: '触发检测',
  },
  preference: {
    id: 'home.preference',
    defaultMessage: '偏好设置',
  },
  preferenceLanguage: {
    id: 'home.preference.language',
    defaultMessage: '语言',
  },
  labelChooseLanguage: {
    id: 'home.preference.language.label.choose',
    defaultMessage: '选择界面语言',
  },
  preferenceNotification: {
    id: 'home.preference.notification',
    defaultMessage: '通知',
  },
  labelDesktopPush: {
    id: 'home.preference.notification.label.desktop.push',
    defaultMessage: '桌面通知',
  },
  descDesktopPush: {
    id: 'home.preference.notification.desc.desktop.push',
    defaultMessage: '开启后，有新消息时浏览器会向你推送动态通知',
  },
  activities: {
    id: 'home.activities',
    defaultMessage: '我的操作',
  },
  alarms: {
    id: 'home.alarms',
    defaultMessage: '风险报警',
  },
  documents: {
    id: 'home.documents',
    defaultMessage: '文件资料',
  },
  helpcenter: {
    id: 'home.help.center',
    defaultMessage: '帮助中心',
  },
  wxService: {
    id: 'home.wx.service',
    defaultMessage: '关注微信服务号',
  },
  emptyActivities: {
    id: 'home.activities.empty',
    defaultMessage: '没有最近的动态',
  },
  myExecutedTasks: {
    id: 'home.my.executed.tasks',
    defaultMessage: '我执行的任务',
  },
  myCreatedTasks: {
    id: 'home.my.created.tasks',
    defaultMessage: '我创建的任务',
  },
  myRecentActivities: {
    id: 'home.my.recent.activities',
    defaultMessage: '我的工作流',
  },
  userAccount: {
    id: 'home.user.account',
    defaultMessage: '帐号设置',
  },
  userPreference: {
    id: 'home.user.preference',
    defaultMessage: '偏好设置',
  },
  userLogout: {
    id: 'home.user.logout',
    defaultMessage: '退出登录',
  },
  logoutConfirm: {
    id: 'home.user.logout.confirm',
    defaultMessage: '您确定要退出吗？',
  },
  loggingOut: {
    id: 'home.user.logging.out',
    defaultMessage: '正在退出...',
  },
  profile: {
    id: 'home.user.profile',
    defaultMessage: '个人信息',
  },
  fullName: {
    id: 'home.user.full.name',
    defaultMessage: '姓名',
  },
  phone: {
    id: 'home.user.phone',
    defaultMessage: '手机号',
  },
  email: {
    id: 'home.user.email',
    defaultMessage: '电子邮件',
  },
  changePassword: {
    id: 'home.user.change.password',
    defaultMessage: '修改密码',
  },
  pwdRequired: {
    id: 'home.user.password.required',
    defaultMessage: '请输入密码',
  },
  newPwdRule: {
    id: 'home.user.password.new.rule',
    defaultMessage: '请输入至少6位新密码',
  },
  pwdUnmatch: {
    id: 'home.user.password.unmatch',
    defaultMessage: '新密码两次输入不一致',
  },
  samePwd: {
    id: 'home.user.password.same',
    defaultMessage: '新旧密码不能相同',
  },
  oldPwd: {
    id: 'home.user.password.old',
    defaultMessage: '旧密码',
  },
  newPwd: {
    id: 'home.user.password.new',
    defaultMessage: '新密码',
  },
  confirmPwd: {
    id: 'home.user.password.confirm',
    defaultMessage: '确认新密码',
  },
});
export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
