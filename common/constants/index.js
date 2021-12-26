const ACCOUNT_STATUS = {
  normal: {
    id: 0,
    name: 'normal',
    text: 'accountNormal',
  },
  blocked: {
    id: 1,
    name: 'blocked',
    text: 'accountDisabled',
  },
};

const TENANT_ASPECT = {
  ENT: 0, // 进出口货主企业
  LSP: 1, // 物流服务商
};
const TENANT_LEVEL = [
  {
    key: 'SUB',
    value: 0,
    text: '分支级租户',
    color: '',
  },
  {
    key: 'COP',
    value: 1,
    text: '企业级租户',
    color: '#2db7f5',
  },
  {
    key: 'GHQ',
    value: 4,
    text: '总部级租户',
    color: '#722ed1',
  },
];
const PARTNER_TENANT_TYPE = ['TENANT_BRANCH', 'TENANT_ENTERPRISE', 'TENANT_EXT', 'TENANT_OFFLINE'];

const INVITATION_STATUS = {
  NEW_SENT: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELED: 3, // 取消邀请
};

export const PARTNER_ROLES = {
  OWN: 'OWN',
  DCUS: 'DCUS',
  CUS: 'CUS',
  SUP: 'SUP',
  VEN: 'VEN',
};

export const PARTNER_BUSINESSES = {
  CCB: 'CCB',
  TRS: 'TRS',
  FWD: 'FWD',
};

export const PARTNER_BUSINESSE_TYPES = {
  clearance: 'clearance',
  transport: 'transport',
  warehousing: 'warehousing',
};
export const DATA_SCOPE = [
  {
    elementKey: 'all',
    name: '全部',
  },
  {
    elementKey: 'myOwn',
    name: '我负责的',
  },
  {
    elementKey: 'myJoined',
    name: '我参与团队的',
  },
  {
    elementKey: 'myDept',
    name: '我所属部门的',
  },
];
export const DATA_COLLAB = [
  {
    elementKey: 'myUndone',
    icon: 'form',
    name: '待处理任务的',
  },
  {
    elementKey: 'myDone',
    icon: 'check-square',
    name: '已完成任务的',
  },
];

export const KPI_CHART_COLORS = ['#CB809A', '#26B68E', '#109FDE', '#FFCE3B', '#8AC9D2', '#CB809A'];

const CHINA_CODE = 'CN';
const MAX_STANDARD_TENANT = 10;


export {
  TENANT_LEVEL,
  TENANT_ASPECT,
  INVITATION_STATUS,
  MAX_STANDARD_TENANT,
  PARTNER_TENANT_TYPE,
  CHINA_CODE,
  ACCOUNT_STATUS,
};

export const PROMPT_TYPES = {
  promptAccept: 'promptAccept',
  promptDispatch: 'promptDispatch',
  promptDriverPickup: 'promptDriverPickup',
  promptSpPickup: 'promptSpPickup',
  promptDriverPod: 'promptDriverPod',
  promptSpPod: 'promptSpPod',
};

export const BUSINESS_TYPES = [
  { label: '报关', value: 'clearance' },
  { label: '仓储', value: 'warehousing' },
  { label: '运输', value: 'transport' },
];

export const DATE_FORMAT = 'YYYY/MM/DD';

export * from './module';
export * from './role';
export * from './transport';
export * from './expense';
export * from './cms';
export * from './cmsciq';
export * from './flow';
export * from './sof';
export * from './cwm';
export * from './lineAdaptor';
export * from './operationLog';
export * from './paas';
export * from './bss';
export * from './uploadRecords';
export * from './tmsExpense';
export * from './sasbl';
export * from './pts';
