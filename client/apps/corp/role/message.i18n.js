import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  createRole: {
    id: 'corp.role.create.role',
    defaultMessage: '新建角色',
  },
  configPrivileges: {
    id: 'corp.role.config.privileges',
    defaultMessage: '配置权限',
  },
  roleInfo: {
    id: 'corp.role.info',
    defaultMessage: '角色信息',
  },
  isManagerLevel: {
    id: 'corp.role.is.manager.level',
    defaultMessage: '管理层',
  },
  privilege: {
    id: 'corp.role.privilege',
    defaultMessage: '权限',
  },
  featureName: {
    id: 'corp.role.feature.name',
    defaultMessage: '功能',
  },
  allFull: {
    id: 'corp.role.full',
    defaultMessage: '完全控制',
  },
  actionName: {
    id: 'corp.role.action.name',
    defaultMessage: '授权操作',
  },
  roleName: {
    id: 'corp.role.name',
    defaultMessage: '角色名称',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
