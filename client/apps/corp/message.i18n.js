import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  corpAdmin: {
    id: 'corp.admin',
    defaultMessage: '企业控制台',
  },
  overview: {
    id: 'corp.overview',
    defaultMessage: '概览',
  },
  corpBasic: {
    id: 'corp.basic',
    defaultMessage: '基础',
  },
  corpInfo: {
    id: 'corp.info',
    defaultMessage: '企业信息',
  },
  corpSubscription: {
    id: 'corp.subscription',
    defaultMessage: '订购信息',
  },
  corpDeptMember: {
    id: 'corp.org.dept.member',
    defaultMessage: '部门与成员',
  },
  corpRole: {
    id: 'corp.role',
    defaultMessage: '角色权限',
  },
  corpConnect: {
    id: 'corp.connect',
    defaultMessage: '互联',
  },
  affiliate: {
    id: 'corp.connect.affiliate',
    defaultMessage: '集团联盟',
  },
  collabAuth: {
    id: 'corp.connect.collab.license',
    defaultMessage: '协作授权',
  },
  collabInvitation: {
    id: 'corp.connect.collab.invitation',
    defaultMessage: '协作邀请',
  },
  collabEmpower: {
    id: 'corp.connect.collab.manage',
    defaultMessage: '协作管理',
  },
  corpAudit: {
    id: 'corp.audit',
    defaultMessage: '审计',
  },
  auditTrial: {
    id: 'corp.audit.trial',
    defaultMessage: '审计日志',
  },
  recycle: {
    id: 'corp.audit.recycle',
    defaultMessage: '数据回收',
  },
  usageMeter: {
    id: 'corp.usage.meter',
    defaultMessage: '用量',
  },
  controlPanel: {
    id: 'corp.control.panel',
    defaultMessage: '控制面板',
  },
  updateSuccess: {
    id: 'corp.info.updateSuccess',
    defaultMessage: '更新成功',
  },
  formValidateErr: {
    id: 'corp.info.form.validate.error',
    defaultMessage: '表单检验存在错误',
  },
  companyName: {
    id: 'corp.info.companyName',
    defaultMessage: '企业名称',
  },
  companyNameTip: {
    id: 'corp.info.companyName.tip',
    defaultMessage: '请与营业执照名称一致',
  },
  companyNameRequired: {
    id: 'corp.info.companyName.required',
    defaultMessage: '公司名称必填',
  },
  companyShortName: {
    id: 'corp.info.companyShortName',
    defaultMessage: '企业简称',
  },
  shortNameMessage: {
    id: 'corp.info.shortName.message',
    defaultMessage: '公司简称必须2位以上中英文',
  },
  corpUUID: {
    id: 'corp.info.uuid',
    defaultMessage: '企业帐号ID',
  },
  corpType: {
    id: 'corp.info.type',
    defaultMessage: '企业类型',
  },
  enterpriseCode: {
    id: 'corp.info.enterprise.code',
    defaultMessage: '统一社会信用代码',
  },
  tenantLevel: {
    id: 'corp.info.tenant.level',
    defaultMessage: '租户级别',
  },
  companyAbout: {
    id: 'corp.info.company.about',
    defaultMessage: '企业简介',
  },

  basicInfo: {
    id: 'corp.info.basic',
    defaultMessage: '基本信息',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
