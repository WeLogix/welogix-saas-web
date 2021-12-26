export const RELATION_TYPES = [
  { key: 'trade', value: '收发货人' },
  { key: 'owner_consumer', value: '消费使用单位' },
  { key: 'owner_producer', value: '生产销售单位' },
  { key: 'agent', value: '申报单位' },
];

export const I_E_TYPES = [
  { key: 'I', value: '进口' },
  { key: 'E', value: '出口' },
];

export const DECL_TYPE = [
  {
    key: 'IMPT', value: '进口报关', ftz: false, tagc: 'blue',
  },
  {
    key: 'IBND', value: '进境备案', ftz: true, tagc: 'blue',
  },
  // { key: 'IMTR', value: '进口转关提前报关', ftz: false },
  // { key: 'IBTR', value: '进境转关提前备案', ftz: true },
  {
    key: 'EXPT', value: '出口报关', ftz: false, tagc: 'green',
  },
  {
    key: 'EBND', value: '出境备案', ftz: true, tagc: 'green',
  },
  // { key: 'EXTR', value: '出口转关提前报关', ftz: false },
  // { key: 'EBTR', value: '出境转关提前备案', ftz: true },
];

export const DECL_I_TYPE = [
  { key: 'IMPT', value: '进口报关' },
  { key: 'IBND', value: '进境备案' },
  { key: 'IMTR', value: '进口转关提前报关' },
  { key: 'IBTR', value: '进境转关提前备案' },
];

export const DECL_E_TYPE = [
  { key: 'EXPT', value: '出口报关' },
  { key: 'EBND', value: '出境备案' },
  { key: 'EXTR', value: '出口转关提前报关' },
  { key: 'EBTR', value: '出境转关提前备案' },
];

export const SOURCE_CHOOSE = {
  item: { key: '0', value: '企业物料表' },
  import: { key: '1', value: '导入数据' },
};

export const CIQ_SUP_STATUS = [
  { value: 0, text: '待供应商接单' },
  { value: 1, text: '待供应商报检' },
  { value: 4, text: '已完成' },
];

export const FORMULA_PARAMS = [
  { value: 'shipmt_qty', text: '货运数量' },
  { value: 'decl_qty', text: '报关单数量' },
  { value: 'ciq_qty', text: '报检单数量' },
  { value: 'decl_sheet_qty', text: '联单数量' },
  { value: 'decl_item_qty', text: '品项数量' },
  { value: 'trade_item_qty', text: '料件数量' },
  { value: 'trade_amount', text: '货值金额' },
];

export const BILLING_CASCADER = [
  {
    label: '自动',
    key: 'auto',
    value: 'auto',
    children: [
      { key: '$formula', value: '$formula', label: '按自定义公式' },
      { key: 'shipmt_qty', value: 'shipmt_qty', label: '按货运数量' },
      { key: 'decl_qty', value: 'decl_qty', label: '按报关单数量' },
      { key: 'ciq_qty', value: 'ciq_qty', label: '按报检单数量' },
      { key: 'decl_sheet_qty', value: 'decl_sheet_qty', label: '按联单数量' },
      { key: 'decl_item_qty', value: 'decl_item_qty', label: '按品名数量' },
      { key: 'trade_item_qty', value: 'trade_item_qty', label: '按料件数量' },
      { key: 'trade_amount', value: 'trade_amount', label: '按货值金额' },
    ],
  },
  {
    label: '手动',
    key: 'man',
    value: 'man',
    children: [
      { key: '$input', value: '$input', label: '输入计费参数' },
      { key: '$manual', value: '$manual', label: '输入费用金额' },
    ],
  },
];

export const CMS_EXPENSE_STATUS = { // '1计费中 2 已计费未提交 3 已提交 4 已确认'
  billing: 1,
  pending: 2,
  submitted: 3,
  confirmed: 4,
};

export const CERTS = [
  { value: 'jdz', text: '机电证' },
  { value: 'zgz', text: '重工证' },
  { value: 'xkz', text: '许可证' },
  { value: '3cmlwjd', text: '3C目录外鉴定' },
  { value: 'm3csq', text: '免3C申请' },
  { value: 'nxjd', text: '能效鉴定' },
  { value: 'mnxsq', text: '免能效申请' },
  { value: 'xc', text: '消磁' },
];

export const INSPECT_STATUS = {
  uninspect: { value: 0, text: '未查验' },
  inspecting: { value: 1, text: '查验中' },
  finish: { value: 2, text: '已查验' },
};

export const TRANS_MODE = [
  {
    value: '2', text: '水路运输', icon: 'icon-boat', desc: '',
  },
  {
    value: '5', text: '航空运输', icon: 'icon-plane', desc: '',
  },
  {
    value: '3', text: '铁路运输', icon: 'icon-train', desc: '',
  },
  {
    value: '4', text: '公路运输', icon: 'icon-truck', desc: '',
  },
  {
    value: '9', text: '其他运输', icon: 'border-outer', desc: '其他境内流转货物，包括特殊监管区域内货物之间的流转、调拨货物，特殊监管区域、保税监管场所之间相互流转货物，特殊监管区域外的加工贸易余料结转、深加工结转、内销等货物',
  },
  {
    value: '0', text: '非保税区', icon: 'border-outer', desc: '境内非保税区运入保税区货物和保税区退区货物',
  },
  {
    value: '1', text: '监管仓库', icon: 'border-outer', desc: '境内存入出口监管仓库和出口监管仓库退仓货物',
  },
  {
    value: '7', text: '保税区', icon: 'border-outer', desc: '保税区运往境内非保税区货物',
  },
  {
    value: '8', text: '保税仓库', icon: 'border-outer', desc: '保税仓库转内销货物',
  },
  {
    value: 'W', text: '物流中心', icon: 'border-outer', desc: '从境内保税物流中心外运入中心或从中心运往境内中心外的货物',
  },
  {
    value: 'X', text: '物流园区', icon: 'border-outer', desc: '从境内保税物流园区外运入园区或从园区内运往境内园区外的货物',
  },
  {
    value: 'Y', text: '保税港区/综合保税区', icon: 'border-outer', desc: '保税港区、综合保税区与境内（区外）（非特殊区域、保税监管场所）之间进出的货物',
  },
  {
    value: 'Z', text: '出口加工区', icon: 'border-outer', desc: '出口加工区与境内（区外）（非特殊区域、保税监管场所）之间进出的货物',
  },
  {
    value: 'H', text: '边境特殊', icon: 'border-outer', desc: '境内运入深港西部通道港方口岸区的货物',
  },
];

export const INVOICE_TYPE = [
  { value: 'VatSpecial', text: '增值税专用发票' },
  { value: 'VatGeneral', text: '增值税普通发票' },
];

export const CMS_DELEGATION_STATUS = {
  unaccepted: 0, // 未接单
  accepted: 1, // 已接单
  processing: 2, // 制单中
  declaring: 3, // 申报中
  released: 4, // 已放行
  completed: 5, // 已完成
};

export const CMS_DELEGATION_MANIFEST = {
  uncreated: 0, // 未制单
  created: 1, // 制单中
  manifested: 2, // 已生成报关建议书（制单完成）
  reviewed: 3, // 已复核
};

export const CMS_BILLING_STATUS = {
  1: '创建未发送',
  2: '已发送,待对方对账',
  3: '待对账',
  4: '已修改,待对方对账',
  5: '接受',
  6: '已开票',
  7: '已核销',
};

export const CLAIM_DO_AWB = {
  notClaimDO: {
    key: 0,
    value: '无需换单',
  },
  claimDO: {
    key: 1,
    value: '需要换单',
  },
  notClaimAWB: {
    key: 0,
    value: '无需抽单',
  },
  claimAWB: {
    key: 1,
    value: '需要抽单',
  },
};

export const CMS_DUTY_TAXTYPE = [
  { value: 0, text: '供应商增票' },
  { value: 1, text: '供应商普票' },
  { value: 2, text: '我方增票' },
  { value: 3, text: '我方普票' },
  { value: 4, text: '客户增票' },
];

export const clearingOption = {
  clearSup: {
    key: 1,
    value: '与最终供应商结算',
  },
  clearAppoint: {
    key: 2,
    value: '与指定者结算',
  },
};

export const CMS_QUOTE_PERMISSION = {
  viewable: 1,
  editable: 2,
};

export const CMS_FEE_UNIT = [
  { value: '0', text: '[空]' },
  { value: '1', text: '率(%)' },
  { value: '2', text: '单价' },
  { value: '3', text: '总价' },
];

export const CMS_CONFIRM = [
  { value: '0', text: '否' },
  { value: '1', text: '是' },
];

export const CMS_CUS_REMARK = [
  { value: '1', text: '税单无纸化' },
  { value: '2', text: '自主报税', disabled: true },
  { value: '3', text: '水运中转', disabled: true },
  { value: '4', text: '自报自缴', disabled: true },
  { value: '5', text: '担保验放' },
];

export const CMS_ARCHIVE_TYPE = [
  { value: '1', text: '报关资料' },
  { value: '2', text: '海关查验' },
  { value: '3', text: '检验检疫' },
  { value: '4', text: '报关单' },
  { value: '5', text: '税单' },
  { value: '6', text: '价格确认表' },
  { value: '7', text: '报关委托书' },
  { value: '8', text: '其他' },
];

export const CMS_DECL_DOCU = [
  { value: '00000001', text: '发票' },
  { value: '00000002', text: '装箱单' },
  { value: '00000003', text: '提运单' },
  { value: '00000004', text: '合同' },
  { value: '00000008', text: '代理报关委托协议（纸质）' },
  { value: '00000009', text: '原产地证明文件' },
  { value: '00000010', text: '载货清单（舱单）' },
  { value: '10000001', text: '电子代理委托协议' },
  { value: '10000002', text: '减免税货物税款担保证明' },
  { value: '10000003', text: '减免税货物税款担保延期证明' },
  { value: '20000011', text: '兽医(卫生)证书' },
  { value: '20000012', text: '动物检疫证书' },
  { value: '20000013', text: '植物检疫证书' },
  { value: '20000014', text: '装运前检验证书' },
  { value: '20000015', text: '重量证书' },
  { value: '20000016', text: 'TCK检验证书（美国小麦）' },
  { value: '20000017', text: '熏蒸证书' },
  { value: '20000018', text: '放射性物质检测合格证明' },
  { value: '20000019', text: '木材发货检验码单' },
  { value: '20000020', text: '水果预检验证书' },
  { value: '20000021', text: '中转进境确认证明文件（经港澳地区中转入境水果）' },
  { value: '20000022', text: '检测报告' },
  { value: '20000023', text: '危险特性分类鉴别报告' },
  { value: '20000024', text: '型式试验报告' },
  { value: '20000025', text: '动物检疫合格证明（国产原料）；进境货物检疫证明、原产国检验证书（进口原料）' },
  { value: '20000026', text: '微生物检测报告（沙门氏菌、产志贺毒素大肠杆菌、金黄色葡萄球菌、单增李斯特菌）' },
  { value: '20000027', text: '出口水产品成品检验报告' },
  { value: '50000001', text: '企业提供的证明材料' },
  { value: '50000002', text: '企业提供的声明' },
  { value: '50000003', text: '企业提供的标签标识' },
  { value: '50000004', text: '企业提供的其他' },
  { value: '50000005', text: '农业转基因生物安全证书' },
  { value: '50000006', text: '引进种子、苗木检疫审批单' },
  { value: '50000007', text: '远洋自捕水产品的确认通知（文件）和远洋渔业项目确认表、农业部远洋渔业企业资格证书' },
  { value: '50000008', text: '特种设备制造许可证' },
  { value: '50000009', text: '进口化妆品卫生许可批件' },
  { value: '50000010', text: '特殊医学用途配方食品注册证书' },
  { value: '50000011', text: '保健食品注册证书/备案凭证' },
  { value: '50000012', text: '捕捞船舶登记证和捕捞许可证（野生捕捞水生动物）' },
  { value: '50000013', text: '化妆品生产许可证(仅限首次出口时提供)' },
  { value: '50000014', text: '特殊用途销售包装化妆品成品应当提供相应的卫生许可批件或者具有相关资质的机构出具的是否存在安全性风险物质的有关安全性评估资料(仅限首次出口时提供)' },
  { value: '60000001', text: '民用爆炸品进口审批单' },
  { value: '60000002', text: '民用爆炸品出口审批单' },
  { value: '60000003', text: '军品出口许可证' },
  { value: '60000004', text: '人类遗传资源材料出口、出境证明' },
  { value: '60000005', text: '古生物化石出口、出境批件' },
  { value: '60000006', text: '密码出口许可证' },
  { value: '60000007', text: '援外项目任务通知单' },
  { value: '60000008', text: '医疗用毒性药品进出口批件' },
  { value: '60000009', text: '放射性药品进出口批件' },
  { value: '60000010', text: '血液出口批件' },
  { value: '60000011', text: '化学品进出口环境管理登记证明' },
];

export const CMS_CNTNR_SPEC_CUS = [
  { value: '11', text: '普通2*标准箱（L）' },
  { value: '12', text: '冷藏2*标准箱（L）' },
  { value: '13', text: '罐式2*标准箱（L）' },
  { value: '21', text: '普通标准箱（S）' },
  { value: '22', text: '冷藏标准箱（S）' },
  { value: '23', text: '罐式标准箱（S）' },
  { value: '31', text: '其他标准箱（S）' },
  { value: '32', text: '其他2*标准箱（L）' },
];

export const CMS_GUNIT = [
  { key: 'g_unit_1', value: '成交单位一' },
  { key: 'g_unit_2', value: '成交单位二' },
  { key: 'g_unit_3', value: '成交单位三' },
];

export const DELG_EXEMPTIONWAY = [{
  value: '1',
  text: '照章征税',
}, {
  value: '2',
  text: '折半征税',
}, {
  value: '3',
  text: '全免',
}, {
  value: '4',
  text: '特案',
}, {
  value: '5',
  text: '随征免性质',
}, {
  value: '6',
  text: '保证金',
}, {
  value: '7',
  text: '保函',
}, {
  value: '8',
  text: '折半补税',
}, {
  value: '9',
  text: '全额退税',
}];

export const DELG_SOURCE = {
  consigned: 1, // 委托
  subcontracted: 2, // 分包
};

export const DELG_STATUS = {
  undelg: 0,
  unaccepted: 1,
  undeclared: 2,
  declared: 3,
  finished: 4,
};

export const CMS_DELG_TODO = {
  exchange: {
    value: 1, text: '换单', icon: 'interation',
  },
  processing: {
    value: 2, text: '制单', icon: 'file-sync',
  },
  reviewPending: {
    value: 3, text: '复核', icon: 'audit',
  },
};

export const CMS_DECL_STATUS = {
  proposed: {
    value: 0, text: '建议书', icon: 'file-text', badge: 'default', step: 0, stepDesc: '制单', date: 'created_date',
  },
  reviewed: {
    value: 1, text: '已复核', icon: 'check-square-o', badge: 'processing', step: 1, stepDesc: '复核', date: 'reviewed_date',
  },
  sent: {
    value: 2, text: '已发送', icon: 'export', badge: 'processing', step: 2, stepDesc: '发送', date: 'epsend_date',
  },
  entered: {
    value: 3, text: '回执', icon: 'mail', badge: 'processing', step: 3, stepDesc: '回执', date: 'backfill_date',
  },
  released: {
    value: 4, text: '放行', icon: 'flag', badge: 'success', step: 4, stepDesc: '放行', date: 'clear_date',
  },
  /*
  closed: {
    value: 5, text: '结关', icon: '', badge: 'success', step: 5, stepDesc: '结关', date: 'close_date',
  },
  */
};

export const CMS_DECL_TODO = {
  proposed: {
    value: 0, text: '待复核', icon: 'audit', badge: 'default', step: 0, stepDesc: '制单', date: 'created_date',
  },
  reviewed: {
    value: 1, text: '待发送', icon: 'export', badge: 'processing', step: 1, stepDesc: '复核', date: 'reviewed_date',
  },
};

export const CMS_DECL_TRACK = {
  sent: {
    value: 2, text: '未回执', icon: 'file-exclamation', badge: 'processing', step: 2, stepDesc: '发送', date: 'epsend_date',
  },
  entered: {
    value: 3, text: '已回执', icon: 'file-protect', badge: 'processing', step: 3, stepDesc: '回执', date: 'backfill_date',
  },
  ciq: {
    value: 5, text: '涉检', icon: 'security-scan', badge: 'processing', step: 4, stepDesc: '涉检', date: '',
  },
  inspect: {
    value: 5, text: '查验', icon: 'file-search', badge: 'error', step: 4, stepDesc: '查验', date: 'clear_date',
  },
  released: {
    value: 4, text: '已放行', icon: 'flag', badge: 'success', step: 4, stepDesc: '放行', date: 'clear_date',
  },
  /*
  closed: {
    value: 6, text: '结关', icon: '', badge: 'success', step: 5, stepDesc: '结关', date: 'close_date',
  },
  */
};

export const CMS_DECL_EXCEPTION = {
  revised: {
    value: 9, text: '修改单', icon: 'edit',
  },
  revoked: {
    value: -1, text: '撤销单', icon: 'delete',
  },
};

export const CMS_DECL_CHANNEL = {
  SW: { value: 'sw', text: '单一窗口标准版', disabled: false },
  EP: { value: 'ep', text: '单一窗口上海版', disabled: false },
};

export const CMS_DECL_MOD_TYPE = [
  { value: '1', text: '申请修改' },
  { value: '2', text: '申请撤销' },
  { value: '3', text: '海关修改' },
  { value: '4', text: '海关撤销' },
];

export const ITEMS_STATUS = [
  { value: 0, text: '未归类' },
  { value: 1, text: '归类待定' },
  { value: 2, text: '已归类' },
];

export const CMS_ENTRY_TYPE = [{
  value: '0',
  text: '有纸报关',
}, {
  value: 'D',
  text: '无纸带清单报关',
}, {
  value: 'L',
  text: '有纸带清单报关',
}, {
  value: 'M',
  text: '通关无纸化',
}, {
  value: 'W',
  text: '无纸报关',
}];

export const CMS_BILL_TYPE = [{
  value: '1',
  text: '普通备案清单',
}, {
  value: '2',
  text: '先进区后报关',
}, {
  value: '3',
  text: '分送集报备案清单',
}, {
  value: '4',
  text: '分送集报报关单',
}];

export const CMS_DECL_TYPE = [{
  value: '1',
  text: '有纸进口报关单',
  ietype: 'i',
}, {
  value: '3',
  text: '有纸进境备案清单',
  ietype: 'i',
}, {
  value: '5',
  text: '无纸进口报关单',
  ietype: 'i',
}, {
  value: '7',
  text: '无纸进境备案清单',
  ietype: 'i',
}, {
  value: '9',
  text: '通关无纸进口报关单',
  ietype: 'i',
}, {
  value: 'B',
  text: '通关无纸进境备案清单',
  ietype: 'i',
}, {
  value: '0',
  text: '有纸出口报关单',
  ietype: 'e',
}, {
  value: '2',
  text: '有纸出境备案清单',
  ietype: 'e',
}, {
  value: '4',
  text: '无纸出口报关单',
  ietype: 'e',
}, {
  value: '6',
  text: '无纸出境备案清单',
  ietype: 'e',
}, {
  value: '8',
  text: '通关无纸出口报关单',
  ietype: 'e',
}, {
  value: 'A',
  text: '通关无纸出境备案清单',
  ietype: 'e',
}];

export const TRADE_ITEM_STATUS = {
  unclassified: 0,
  pending: 1,
  classified: 2,
};

export const CMS_TRADE_REPO_MODE = {
  SINGLE: {
    key: 'single', value: 1, text: '独立库', tag: 'blue', icon: 'property-safety',
  },
  MASTER: {
    key: 'master', value: 2, text: '主库', tag: 'green', icon: 'loading',
  },
  SLAVE: {
    key: 'slave', value: 3, text: '从库', tag: 'orange', icon: 'safety-certificate',
  },
};

export const CMS_TRADE_REPO_PERMISSION = {
  edit: 'edit',
  // approval: 'approval',
  view: 'view',
};

export const CMS_BILL_TEMPLATE_PERMISSION = {
  edit: 'edit',
  view: 'view',
};

export const CMS_SPLIT_COUNT = [
  { value: '20', text: '按20品拆分' },
  { value: '50', text: '按50品拆分' },
];

export const CMS_DOCU_TYPE = {
  invoice: 0,
  contract: 1,
  packingList: 2,
};

export const CMS_TRADE_ITEM_TYPE = [
  { value: 'RM', text: '料件' },
  { value: 'FP', text: '成品' },
  { value: '5', text: '设备' },
  { value: '6', text: '半成品' },
  { value: '7', text: '备件' },
  { value: '8', text: '贸易件' },
];

export const SPECIAL_COPNO_TERM = [
  { value: 'A', text: '特殊货号' },
];

export const TRADE_ITEM_APPLY_CERTS = [
  {
    app_cert_code: '11', app_cert_name: '品质证书',
  },
  {
    app_cert_code: '12', app_cert_name: '重量证书',
  },
  {
    app_cert_code: '13', app_cert_name: '数量证书',
  },
  {
    app_cert_code: '14', app_cert_name: '兽医卫生证书',
  },
  {
    app_cert_code: '15', app_cert_name: '健康证书',
  },
  {
    app_cert_code: '16', app_cert_name: '卫生证书',
  },
  {
    app_cert_code: '17', app_cert_name: '动物卫生证书',
  },
  {
    app_cert_code: '18', app_cert_name: '植物检疫证书',
  },
  {
    app_cert_code: '19', app_cert_name: '熏蒸/消毒证书',
  },
  {
    app_cert_code: '20', app_cert_name: '出境货物换证凭单',
  },
  {
    app_cert_code: '21', app_cert_name: '入境货物检验检疫证明',
  },
  {
    app_cert_code: '22', app_cert_name: '出境货物不合格通知单',
  },
  {
    app_cert_code: '23', app_cert_name: '集装箱检验检疫结果单',
  },
  {
    app_cert_code: '99', app_cert_name: '其他证书',
  },
];

export const CMS_HSCODE_BRAND_TYPE = [
  { value: '0', text: '无品牌' },
  { value: '1', text: '境内自主品牌' },
  { value: '2', text: '境内收购品牌' },
  { value: '3', text: '境外品牌（贴牌生产）' },
  { value: '4', text: '境外品牌（其他）' },
];

export const CMS_HSCODE_EXPORT_PREFER = [
  { value: '0', text: '出口货物在最终目的国（地区）不享受优惠关税' },
  { value: '1', text: '出口货物在最终目的国（地区）享受优惠关税' },
  { value: '2', text: '出口货物不能确定在最终目的国（地区）享受优惠关税' },
  { value: '3', text: '不适用于进口报关单' },
];

export const CMS_DOC_TYPE = [
  { value: 'CUS_CERT', text: '海关随附单证' },
  { value: 'CUS_DOCU', text: '海关随附单据' },
  { value: 'CIQ_CERT', text: '国检企业、产品资质证书' },
  { value: 'CIQ_DOCU', text: '国检随附单据' },
  { value: 'CCD', text: '报关单' },
  { value: 'CID', text: '报检单' },
];

export const CMS_EVENTS = [
  { key: 'exchange', text: '换单' },
  { key: 'quarantine', text: '检疫查验' },
  { key: 'quality', text: '质检查验' },
  { key: 'customs', text: '海关查验' },
];

export const INVOICE_CAT = [
  { key: 'VAT_S', value: '增值税专用发票' },
  { key: 'VAT_N', value: '增值税普通发票' },
];

export const INVOICE_PARTY = [
  { key: 1, value: '货主' },
  { key: 2, value: '上游客户' },
  { key: 3, value: '我方' },
  { key: 4, value: '下游服务商' },
];

export const CMS_HS_EFFICIENCY = [{
  value: 'NX', text: '普通能效',
}, {
  value: 'TS', text: '特殊能效',
}];

export const CMS_TAX_PAY_STATUS = {
  ESTIMATED: {
    key: 'estimated', value: 4, text: '预估', tag: '',
  },
  UNPAID: {
    key: 'unpaid', value: 1, text: '未支付', tag: 'red',
  },
  PROCESSING: {
    key: 'processing', value: 2, text: '支付中', tag: 'orange',
  },
  PAID: {
    key: 'paid', value: 3, text: '支付成功', tag: 'green',
  },
};
