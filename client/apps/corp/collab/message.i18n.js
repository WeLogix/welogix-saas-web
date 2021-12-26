import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  create: {
    id: 'network.collab.create',
    defaultMessage: '创建通知模版',
  },
  templateName: {
    id: 'network.collab.templateName',
    defaultMessage: '模版名称',
  },
  sender: {
    id: 'network.collab.sender',
    defaultMessage: '发送方',
  },
  title: {
    id: 'network.collab.title',
    defaultMessage: '标题',
  },
  dropdown: {
    id: 'network.collab.dropdown',
    defaultMessage: '下拉菜单',
  },
  partnerName: {
    id: 'network.partner.name',
    defaultMessage: '合作伙伴',
  },
  partnerCode: {
    id: 'network.partner.code',
    defaultMessage: '客户代码',
  },
  partnerType: {
    id: 'network.partner.type',
    defaultMessage: '关系',
  },
  tenantType: {
    id: 'network.tenant.type',
    defaultMessage: '类型',
  },
  activate: {
    id: 'network.business.activate',
    defaultMessage: '申请开通',
  },
  revoke: {
    id: 'network.business.revoke',
    defaultMessage: '撤回',
  },
  invite: {
    id: 'network.send.invite',
    defaultMessage: '邀请协作',
  },
  searchPlaceholder: {
    id: 'network.search.placeholder',
    defaultMessage: '搜索合作伙伴',
  },
  newPartner: {
    id: 'network.table.new.partner',
    defaultMessage: '添加合作伙伴',
  },
  invitationSent: {
    id: 'network.invitation.sent',
    defaultMessage: '已发送协作邀请',
  },
  invitationRevoked: {
    id: 'network.invitation.revoked',
    defaultMessage: '已撤回协作邀请',
  },
  acceptFailed: {
    id: 'network.invitation.accept.failed',
    defaultMessage: '接受邀请失败',
  },
  rejectFailed: {
    id: 'network.invitation.reject.failed',
    defaultMessage: '拒绝邀请失败',
  },
  inviteYouToBe: {
    id: 'network.invitation.you.tobe',
    defaultMessage: '邀请你成为',
  },
  provider: {
    id: 'network.invitation.provider',
    defaultMessage: '服务商',
  },
  recvDate: {
    id: 'network.invitation.recvDate',
    defaultMessage: '收到日期',
  },
  newInvitation: {
    id: 'network.invitation.new',
    defaultMessage: '新邀请',
  },
  invitationAccepted: {
    id: 'network.invitation.accepted',
    defaultMessage: '已接受',
  },
  invitationRejected: {
    id: 'network.invitation.rejected',
    defaultMessage: '已拒绝',
  },
  invitationDue: {
    id: 'network.invitation.due',
    defaultMessage: '待定',
  },
  invitationCannceleed: {
    id: 'network.invitation.cancelled',
    defaultMessage: '已取消',
  },
  accept: {
    id: 'network.accept',
    defaultMessage: '接受',
  },
  reject: {
    id: 'network.reject',
    defaultMessage: '拒绝',
  },
  selectProviderType: {
    id: 'network.provider.select.type',
    defaultMessage: '请选择供应商类型',
  },
  invitationCodePlaceholder: {
    id: 'network.invitation.code.placeholder',
    defaultMessage: '输入邀请码',
  },
  retrieve: {
    id: 'network.invitation.retrieve',
    defaultMessage: '提取',
  },
  setProviderType: {
    id: 'network.provider.setType',
    defaultMessage: '设置供应商类型',
  },
  cancelInvitationFail: {
    id: 'network.invitation.cancel.failed',
    defaultMessage: '取消邀请失败',
  },
  inviteThemToBe: {
    id: 'network.invitation.them.tobe',
    defaultMessage: '邀请对方成为',
  },
  sentDate: {
    id: 'network.invitation.sentDate',
    defaultMessage: '发出日期',
  },
  serviceTeam: {
    id: 'corp.collab.empower.service.team',
    defaultMessage: '服务团队',
  },
  collabFlow: {
    id: 'corp.collab.empower.collab.flow',
    defaultMessage: '协作流程',
  },
  authorizeBizObj: {
    id: 'corp.collab.empower.authorize.bizobj',
    defaultMessage: '授权业务对象',
  },
  addTeam: {
    id: 'corp.collab.empower.add.team',
    defaultMessage: '添加团队',
  },
  transMode: {
    id: 'corp.collab.empower.transMode',
    defaultMessage: '运输方式',
  },
  declareWay: {
    id: 'corp.collab.empower.declareWay',
    defaultMessage: '报关类型',
  },
  tradeMode: {
    id: 'corp.collab.empower.tradeMode',
    defaultMessage: '监管方式',
  },
  createdDate: {
    id: 'corp.collab.empower.created.date',
    defaultMessage: '创建时间',
  },
  invoiceDate: {
    id: 'corp.collab.empower.invoice.date',
    defaultMessage: '发票日期',
  },
  ownBy: {
    id: 'corp.collab.empower.ownby',
    defaultMessage: '负责人',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
