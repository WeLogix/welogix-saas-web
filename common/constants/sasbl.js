exports.SASBL_SASDEC_MENU = {
  key: 'SASDEC',
  icon: 'retweet',
  title: '报关进出',
  type: 'submenu',
  children: [
    {
      key: 'SASDEC_I_INVTREG',
      title: '进区核注清单',
      link: '/cwm/sasbl/invtreg/sasdec/i',
    },
    {
      key: 'SASDEC_I_PASSPORT',
      title: '进区核放单',
      link: '/cwm/sasbl/passport/sasdec/i',
    },
    {
      key: 'SASDEC_E_INVTREG',
      title: '出区核注清单',
      link: '/cwm/sasbl/invtreg/sasdec/e',
    },
    {
      key: 'SASDEC_E_PASSPORT',
      title: '出区核放单',
      link: '/cwm/sasbl/passport/sasdec/e',
    },
  ],
};

exports.SASBL_DISBAT_E_MENU = {
  key: 'DISBAT_E',
  icon: 'build',
  title: '分送集报出区',
  type: 'submenu',
  children: [
    {
      key: 'DISBAT_E_BIZAPPL',
      title: '出区业务申报表',
      link: '/cwm/sasbl/bizappl/disbat/e',
    },
    {
      key: 'DISBAT_E_STOCKIO',
      title: '出区出库单',
      link: '/cwm/sasbl/stockio/disbat/e',
    },
    {
      key: 'DISBAT_E_PASSPORT',
      title: '出区核放单',
      link: '/cwm/sasbl/passport/disbat/e',
    },
    {
      key: 'DISBAT_E_BATDECL',
      title: '出区集中报关',
      link: '/cwm/sasbl/batdecl/disbat/e',
    },
    {
      key: 'DISBAT_E_INVTREG',
      title: '出区核注清单',
      link: '/cwm/sasbl/invtreg/disbat/e',
    },
  ],
};

exports.SASBL_SASTSF_MENU = {
  key: 'SASTSF',
  icon: 'interation',
  title: '区间流转',
  type: 'submenu',
  children: [
    {
      key: 'SASTSF_I_INVTREG',
      title: '进区核注清单',
      link: '/cwm/sasbl/invtreg/sastsf/i',
    },
    {
      key: 'SASTSF_I_PASSPORT',
      title: '进区核放单',
      link: '/cwm/sasbl/passport/sastsf/i',
    },
    {
      key: 'SASTSF_E_INVTREG',
      title: '出区核注清单',
      link: '/cwm/sasbl/invtreg/sastsf/e',
    },
    {
      key: 'SASTSF_E_PASSPORT',
      title: '出区核放单',
      link: '/cwm/sasbl/passport/sastsf/e',
    },
  ],
};

exports.SASBL_BNDINVT_MENU = {
  key: 'BNDINVT',
  icon: 'table',
  title: '保税库存平衡表',
  link: '/cwm/sasbl/bndinvt',
};

exports.SASBL_REG_TYPES = [
  {
    value: 'sasdec',
    ftztext: '报关进出',
    tagcolor: 'blue',
  },
  {
    value: 'disbat',
    ftztext: '分送集报',
    tagcolor: 'cyan',
  },
  {
    value: 'sastsf',
    ftztext: '区间流转',
    tagcolor: 'green',
  },
];

exports.SASBL_BWL_TYPE = [
  { value: 'A', text: '保税物流中心A' },
  { value: 'B', text: '保税物流中心B' },
  { value: 'D', text: '公共保税仓库' },
  { value: 'E', text: '液体保税仓库' },
  { value: 'F', text: '寄售维修保税仓库' },
  { value: 'G', text: '暂为空' },
  { value: 'H', text: '特殊商品保税仓库' },
  { value: 'I', text: '备料保税仓库' },
  { value: 'P', text: '出口配送监管仓' },
  { value: 'J', text: '为国内结转监管仓' },
  { value: 'K', text: '保税区' },
  { value: 'L', text: '出口加工区' },
  { value: 'M', text: '保税物流园区' },
  { value: 'N', text: '保税港区' },
  { value: 'Z', text: '综合保税区' },
  { value: 'Q', text: '跨境工业园区' },
  { value: 'S', text: '特殊区域设备账册' },
];

exports.SASBL_REG_STATUS = [
  {
    value: -1,
    text: '已作废',
    tagcolor: '#333',
    badge: null,
  },
  {
    value: 1,
    text: '未申报',
    tagcolor: null,
    badge: 'default',
  },
  {
    value: 2,
    text: '海关退单',
    tagcolor: null,
    badge: 'error',
  },
  {
    value: 3,
    text: '申报中',
    tagcolor: null,
    badge: 'processing',
  },
  {
    value: 4,
    text: '审批通过',
    tagcolor: null,
    badge: 'success',
  },
  {
    value: 5,
    text: '变更中',
    tagcolor: null,
    badge: 'warning',
  },
  {
    value: 6,
    text: '已集报',
    tagcolor: 'purple',
    badge: null,
  },
  {
    value: 7,
    text: '转人工',
    tagcolor: 'yellow',
    badge: null,
  },
];

exports.SASBL_DECTYPE = [
  {
    value: '1',
    text: '备案',
  },
  {
    value: '2',
    text: '变更',
  },
  {
    value: '3',
    text: '作废',
  },
];

exports.BAPPL_DECTYPE = [
  {
    value: '1',
    text: '备案',
  },
  {
    value: '2',
    text: '变更',
  },
  {
    value: '3',
    text: '结案',
  },
];

exports.BAPPL_BIZTYPE = [
  {
    value: 'A',
    text: '分送集报',
  },
  {
    value: 'B',
    text: '外发加工',
  },
  {
    value: 'C',
    text: '保税展示交易',
  },
  {
    value: 'D',
    text: '设备检测',
  },
  {
    value: 'E',
    text: '设备维修',
  },
  {
    value: 'F',
    text: '模具外发',
  },
  {
    value: 'G',
    text: '简单加工',
  },
  {
    value: 'H',
    text: '其他业务',
  },
  {
    value: 'Y',
    text: '一纳企业进出区',
  },
];

exports.PASSPORT_BIZTYPE = [
  {
    value: '1',
    text: '先入区后报关',
  },
  {
    value: '2',
    text: '一线一体化进出区',
  },
  {
    value: '3',
    text: '二线进出区',
  },
  {
    value: '4',
    text: '非报关进出区',
  },
  {
    value: '5',
    text: '卡口登记货物',
  },
  {
    value: '6',
    text: '空车进出区',
  },
];

exports.SASBL_BATCH_APPLYTYPES = [
  {
    value: 0,
    text: '普通报关申请单',
  },
  {
    value: 1,
    text: '跨关区报关申请单',
  },
  {
    value: 2,
    text: '保展报关申请单',
  },
];

exports.BLBOOK_TYPE = [
  {
    value: 'TW',
    text: '区域物流账册(TW)',
  },
  {
    value: 'L',
    text: '区外物流账册(L)',
  },
];

exports.DECLARER_COMPANY_TYPE = [
  {
    value: '1',
    text: '企业',
  },
  {
    value: '2',
    text: '代理公司',
  },
  {
    value: '3',
    text: '报关行',
  },
];

exports.BLBOOK_PAUSE_MARK = [
  {
    value: '0',
    text: '未开始执行',
  },
  {
    value: '1',
    text: '正常执行',
  },
  {
    value: '2',
    text: '恢复执行',
  },
  {
    value: '3',
    text: '暂停变更',
  },
  {
    value: '9',
    text: '已注销',
  },
];

exports.BLBOOK_STATUS = {
  PENDING: {
    key: 'pending',
    value: 1,
    text: '未备案',
    badge: 'default',
  },
  REVISING: {
    key: 'revising',
    value: 2,
    text: '变更中',
    badge: 'warning',
  },
  DECLARING: {
    key: 'declaring',
    value: 3,
    text: '申报中',
    badge: 'processing',
  },
  APPROVED: {
    key: 'approved',
    value: 4,
    text: '审核通过',
    badge: 'success',
  },
  MANUALING: {
    key: 'manualing',
    value: 7,
    text: '转人工',
    badge: 'processing',
  },
};

exports.BOND_INVT_TYPE = [
  {
    value: '0',
    text: '普通清单',
  },
  {
    value: '1',
    text: '集报清单',
  },
  {
    value: '3',
    text: '先入区后报关',
  },
  {
    value: '4',
    text: '简单加工',
  },
  {
    value: '5',
    text: '保税展示交易',
  },
  {
    value: '6',
    text: '区内流转',
  },
  {
    value: '7',
    text: '区港联动',
  },
  {
    value: '8',
    text: '保税电商',
  },
  {
    value: '9',
    text: '一纳成品内销',
  },
];

exports.LIST_TYPE = [
  {
    value: 'A',
    text: '加工贸易深加工结转',
  },
  {
    value: 'B',
    text: '加工贸易余料结转',
  },
  {
    value: 'C',
    text: '不作价设备结转',
  },
  {
    value: 'D',
    text: '区间深加工结转',
  },
  {
    value: 'E',
    text: '区间料件结转',
  },
];

exports.SASBL_DECL_TYPE = [
  {
    value: '1',
    text: '进口报关单',
  },
  {
    value: '2',
    text: '出口报关单',
  },
  {
    value: '3',
    text: '进境备案清单',
  },
  {
    value: '4',
    text: '出境备案清单',
  },
  {
    value: '5',
    text: '进境两单一审备案清单',
  },
  {
    value: '6',
    text: '出境两单一审备案清单',
  },
  {
    value: 'B',
    text: '转关提前进境备案清单',
  },
  {
    value: 'C',
    text: '转关提前出境备案清单',
  },
  {
    value: 'F',
    text: '出口二次转关单',
  },
  {
    value: 'G',
    text: '进口提前/工厂验放报关单',
  },
  {
    value: 'H',
    text: '出口提前/工厂验放报关单',
  },
  {
    value: 'I',
    text: '进口提前/暂时进口报关单',
  },
  {
    value: 'J',
    text: '出口提前/暂时出口报关单',
  },
  {
    value: 'K',
    text: '进口提前/中欧班列报关单',
  },
  {
    value: 'L',
    text: '出口提前/中欧班列报关单',
  },
  {
    value: 'M',
    text: '出口提前/市场采购报关单',
  },
  {
    value: 'N',
    text: '出口提前/空运联程报关单',
  },
  {
    value: 'O',
    text: '进口提前/工厂验放备案清单',
  },
  {
    value: 'P',
    text: '出口提前/工厂验放备案清单',
  },
  {
    value: 'Q',
    text: '进口提前/暂时进口备案清单',
  },
  {
    value: 'R',
    text: '出口提前/暂时出口备案清单',
  },
  {
    value: 'S',
    text: '进口提前/中欧班列备案清单',
  },
  {
    value: 'T',
    text: '出口提前/中欧班列备案清单',
  },
  {
    value: 'U',
    text: '出口提前/市场采购备案清单',
  },
  {
    value: 'V',
    text: '出口提前/空运联程备案清单',
  },
];

exports.SASBL_BAT_DECL_STATUS = [
  {
    value: -1,
    text: '已作废',
    tagcolor: '#333',
    badge: null,
  },
  {
    value: 1,
    text: '未委托',
    tagcolor: null,
    badge: 'default',
  },
  {
    value: 2,
    text: '已委托',
    tagcolor: null,
    badge: 'processing',
  },
  {
    value: 3,
    text: '已制单',
    tagcolor: null,
    badge: 'processing',
  },
  {
    value: 4,
    text: '已申报',
    tagcolor: null,
    badge: 'success',
  },
  {
    value: 5,
    text: '已放行',
    tagcolor: null,
    badge: 'success',
  },
  {
    value: 6,
    text: '查验',
    tagcolor: null,
    badge: 'warning',
  },
];
