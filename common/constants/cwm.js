exports.CWM_SKU_PACKS = [{
  value: '00',
  text: '单件(散装)',
}, {
  value: '01',
  text: '内包装(包/盒/袋等)',
}, {
  value: '02',
  text: '木箱',
}, {
  value: '03',
  text: '纸箱',
}, {
  value: '04',
  text: '托盘',
}];

exports.CWM_ASN_TYPES = [{
  value: '1',
  text: '普通入库',
}, {
  value: '2',
  text: '调拨入库',
}, {
  value: '3',
  text: '退货入库',
}, {
  value: '4',
  text: '整进整出',
}];

exports.CWM_SHFTZ_IN_REGTYPES = [{
  value: 'entry',
  text: '先报关后入库',
  ftztext: '进境入库',
  tagcolor: 'blue',
}, {
  value: 'export',
  text: '先入库后报关',
  ftztext: '视同出口',
  tagcolor: 'green',
}, {
  value: 'transfer',
  text: '不报关',
  ftztext: '区内转入',
  tagcolor: 'cyan',
}];

exports.CWM_ASN_INBOUND_STATUS = {
  PENDING: {
    key: 'pending',
    value: 0,
    text: '待处理',
    badge: 'default',
  },
  RECEIVING: {
    key: 'receiving',
    value: 1,
    text: '收货',
    badge: 'processing',
  },
  PUTTING: {
    key: 'putting',
    value: 2,
    text: '上架',
    badge: 'processing',
  },
  COMPLETED: {
    key: 'completed',
    value: 3,
    text: '已入库',
    badge: 'success',
  },
};

exports.CWM_ASN_STATUS = {
  PENDING: {
    key: 'pending',
    value: 0,
    text: '未处理',
    badge: 'default',
  },
  INBOUND: {
    key: 'inbound',
    value: 1,
    text: '入库中',
    badge: 'processing',
  },
  DISCREPANT: {
    key: 'partial',
    value: 2,
    text: '收货差异',
    badge: 'warning',
  },
  COMPLETED: {
    key: 'completed',
    value: 3,
    text: '入库完成',
    badge: 'success',
  },
};

exports.CWM_INBOUND_STATUS = {
  CREATED: {
    value: 0,
    step: 0,
  },
  PARTIAL_RECEIVED: {
    value: 1,
    step: 1,
  },
  ALL_RECEIVED: {
    value: 2,
    step: 1,
  },
  PARTIAL_PUTAWAY: {
    value: 3,
    step: 2,
  },
  COMPLETED: {
    value: 5,
    step: 3,
  },
};

exports.CWM_SHFTZ_APIREG_STATUS = {
  pending: 0,
  processing: 1,
  completed: 2,
};

exports.CWM_REG_STATUS = {
  PENDING: {
    key: 'regPending',
    value: 0,
    text: '未备案',
    badge: 'default',
  },
  PROCESSING: {
    key: 'regProcessing',
    value: 1,
    text: '申报中',
    badge: 'processing',
  },
  COMPLETED: {
    key: 'regCompleted',
    value: 2,
    text: '审批通过',
    badge: 'success',
  },
};

exports.CWM_SO_OUTBOUND_STATUS = {
  PENDING: {
    key: 'pending',
    value: 0,
    text: '待处理',
    badge: 'default',
  },
  PREALLOC: {
    key: 'prealloc',
    value: 1,
    text: '预分配',
    badge: 'processing',
  },
  ALLOCATING: {
    key: 'allocating',
    value: 2,
    text: '分配中',
    badge: 'processing',
  },
  ALLOCATED: {
    key: 'allocated',
    value: 3,
    text: '待拣货',
    badge: 'processing',
  },
  PICKED: {
    key: 'picked',
    value: 4,
    text: '待发货',
    badge: 'processing',
  },
  SHIPPED: {
    key: 'shipped',
    value: 5,
    text: '已出库',
    badge: 'success',
  },
};

exports.CWM_SO_STATUS = {
  PENDING: {
    key: 'pending',
    value: 0,
    text: '待处理',
    badge: 'default',
  },
  OUTBOUND: {
    key: 'outbound',
    value: 1,
    text: '分配拣货',
    badge: 'processing',
  },
  PARTIAL: {
    key: 'partial',
    value: 2,
    text: '装箱发货',
    badge: 'processing',
  },
  COMPLETED: {
    key: 'completed',
    value: 3,
    text: '已出库',
    badge: 'success',
  },
};

exports.CWM_OUTBOUND_ALLOC_STATUS = {
  CREATED: 0,
  ALLOCATED: 2,
  PICKED: 4,
  SHIPPED: 6,
};

exports.CWM_OUTBOUND_PACK_STATUS = {
  NOT_APPLICATED: -1,
  PENDING: 0,
  PARTIAL_PACKED: 1,
  ALL_PACKED: 2,
};

exports.CWM_SO_TYPES = [{
  value: '1',
  text: '普通出库',
}, {
  value: '2',
  text: '调拨出库',
}, {
  value: '3',
  text: '整进整出',
}, {
  value: '4',
  text: '保税转非保', // todo 只能在保税仓库下
}];

exports.CWM_SHFTZ_OUT_REGTYPES = [{
  value: 'normal',
  text: '先报关后出库',
  ftztext: '普通出库',
  tagcolor: 'blue',
}, {
  value: 'portion',
  text: '先出库后报关',
  ftztext: '分拨出库',
  tagcolor: 'green',
}, {
  value: 'transfer',
  text: '不报关',
  ftztext: '区内转出',
  tagcolor: 'cyan',
}, {
  value: 'tbd',
  text: '待定',
  ftztext: '',
}];

exports.CWM_DOCU_TYPE = {
  receiveTaskList: 0, // 入库任务清单
  putawayTaskList: 1, // 上架任务清单
  pickingTaskList: 2, // 拣货任务清单
  packingList: 3, // 装箱单
  loadingList: 4, // 装车单
};

exports.CWM_RULES = {
  PUTAWAY_RULE: {
    key: 'putway',
    text: '上架规则',
  },
  ALLOC_RULE: {
    key: 'alloc',
    text: '分配规则',
  },
  REPLENISH_RULE: {
    key: 'replenish',
    text: '补货规则',
  },
  WAVE_RULE: {
    key: 'wave',
    text: '波次计划规则',
  },
  SEQUENCE_RULE: {
    key: 'sequence',
    text: '流水号规则',
  },
};

exports.CWM_OUTBOUND_STATUS = {
  CREATED: {
    value: 0,
    step: 0,
  },
  PARTIAL_ALLOC: {
    value: 1,
    step: 1,
  },
  ALL_ALLOC: {
    value: 2,
    step: 1,
  },
  PARTIAL_PICKED: {
    value: 3,
    step: 2,
  },
  ALL_PICKED: {
    value: 4,
    step: 2,
  },
  PACKED: {
    value: 5,
    step: 3,
  },
  SHIPPING: {
    value: 6,
    step: 4,
  },
  COMPLETED: {
    value: 7,
    step: 5,
  },
};

exports.CWM_LOCATION_TYPES = [{
  value: '1',
  text: '货架',
}, {
  value: '2',
  text: '窄巷道货架',
}, {
  value: '3',
  text: '重力式货架',
}, {
  value: '4',
  text: '地面平仓',
}];

exports.CWM_LOCATION_STATUS = [{
  value: '5',
  text: '优先出库',
}, {
  value: '1',
  text: '正常',
}, {
  value: '0',
  text: '封存',
}, {
  value: '-1',
  text: '禁用',
}];

exports.CWM_MOVEMENT_STATUS = {
  CREATED: {
    value: 0,
    step: 0,
  },
  COMPLETED: {
    value: 1,
    step: 1,
  },
};

exports.CWM_MOVEMENT_TYPE = [{
  value: 1,
  text: '库内移位',
}, {
  value: 2,
  text: '跨仓移库',
}];

exports.CWM_STOCK_SEARCH_TYPE = [{
  value: 1,
  text: '按货主汇总',
}, {
  value: 2,
  text: '按货品汇总',
}, {
  value: 3,
  text: '按库位汇总',
}, {
  value: 4,
  text: '按货品+库位汇总',
}, {
  value: 5,
  text: '按货品+库别汇总',
}];

exports.CWM_STOCK_SUM_TYPE = [{
  value: 0,
  text: '不汇总',
}, {
  value: 1,
  text: '按序列号汇总',
}, {
  value: 2,
  text: '按货品+库别汇总',
}, {
  value: 3,
  text: '按货品汇总',
}];

exports.CWM_DAMAGE_LEVEL = [{
  value: 0,
  text: '包装完好',
  color: '#87d068',
}, {
  value: 1,
  text: '轻微擦痕',
  color: 'green',
}, {
  value: 2,
  text: '中度磨损',
  color: 'orange',
}, {
  value: 3,
  text: '重度磨损',
  color: 'red',
}, {
  value: 4,
  text: '严重破损',
  color: '#f50',
}];

exports.CWM_TRANSACTIONS_TYPE = {
  inbound: { text: '入库' },
  outbound: { text: '出库' },
  transout: { text: '转移出' },
  transin: { text: '转移入' },
  moveout: { text: '移动出' },
  movein: { text: '移动入' },
  adjustout: { text: '调整出' },
  adjustin: { text: '调整入' },
  freezeout: { text: '可用出' },
  freezein: { text: '冻结入' },
  unfreezeout: { text: '可用入' },
  unfreezein: { text: '冻结出' },
};

exports.CWM_SHFTZ_REG_STATUS_INDICATOR = [{
  value: 0,
  text: '待备案',
  tagcolor: 'blue',
  badge: 'warning',
  icon: 'file-unknown',
}, {
  value: 1,
  text: '已发送',
  tagcolor: 'green',
  badge: 'processing',
  icon: 'file-sync',
}, {
  value: 2,
  text: '备案完成',
  tagcolor: 'cyan',
  badge: 'success',
  icon: 'file-done',
}];

exports.CWM_SHFTZ_ENTRY_STATUS = [{
  value: 0,
  text: '待进区',
  tagcolor: 'blue',
  badge: 'default',
  icon: 'file-unknown',
}, {
  value: 1,
  text: '已备案',
  tagcolor: 'green',
  badge: 'processing',
  icon: 'file-sync',
}, {
  value: 2,
  text: '已进区',
  tagcolor: 'cyan',
  badge: 'success',
  icon: 'file-done',
}];

exports.CWM_SHFTZ_TRANSFER_IN_STATUS_INDICATOR = [{
  value: 0,
  text: '待转入',
  tagcolor: 'blue',
  badge: 'warning',
  icon: 'file-unknown',
}, {
  value: 1,
  text: '已接收',
  tagcolor: 'green',
  badge: 'processing',
  icon: 'file-sync',
}, {
  value: 2,
  text: '已核对',
  tagcolor: 'cyan',
  badge: 'success',
  icon: 'file-done',
}];

exports.CWM_SHFTZ_TRANSFER_OUT_STATUS_INDICATOR = [{
  value: 0,
  text: '待转出',
  tagcolor: 'blue',
  badge: 'warning',
}, {
  value: 1,
  text: '已发送',
  tagcolor: 'green',
  badge: 'processing',
}, {
  value: 2,
  text: '已转出',
  tagcolor: 'cyan',
  badge: 'success',
}];

exports.CWM_INBOUND_STATUS_INDICATOR = [{
  value: 0,
  text: '待入库',
  tagcolor: 'blue',
  badge: 'warning',
}, {
  value: 1,
  text: '收货',
  tagcolor: 'green',
  badge: 'processing',
}, {
  value: 2,
  text: '收货',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 3,
  text: '上架',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 4,
  text: '上架',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 5,
  text: '已入库',
  tagcolor: 'cyan',
  badge: 'success',
}];

exports.CWM_OUTBOUND_STATUS_INDICATOR = [{
  value: 0,
  text: '待出库',
  tagcolor: 'blue',
  badge: 'warning',
}, {
  value: 1,
  text: '部分分配',
  tagcolor: 'green',
  badge: 'processing',
}, {
  value: 2,
  text: '全部分配',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 3,
  text: '部分拣货',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 4,
  text: '全部拣货',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 5,
  text: '复核装箱',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 6,
  text: '部分发货',
  tagcolor: 'cyan',
  badge: 'processing',
}, {
  value: 7,
  text: '已出库',
  tagcolor: 'cyan',
  badge: 'success',
}];

exports.DELIVER_TYPES = [{
  name: '客户自提', value: 1,
}, {
  name: '仓库配送', value: 2,
}, {
  name: '第三方配送', value: 3,
}];

exports.WHSE_OPERATION_MODES = {
  scan: { value: 'scan', text: '无线' },
  manual: { value: 'manual', text: '桌面' },
};

exports.ALLOC_ERROR_MESSAGE_DESC = {
  shftz_rel_no_exist: '出库备案号已存在,请确保终端已删除对应备案号,清除备案单号后重新取消分配',
  shftz_portion_detail_queried: '分拨出库单已提交,无法取消分配',
  shftz_normal_reg_detail_in_decl: '出库明细处于清关中,无法取消分配',
};

exports.ALLOC_MATCH_FIELDS = [{
  field: 'serial_no', label: '序列号',
  /* }, {
  field: 'virtual_whse', label: '库别', */
}, {
  field: 'external_lot_no', label: '批次号',
}, {
  field: 'asn_cust_order_no', label: '入库订单追踪号',
}, {
  field: 'in_cus_decl_no', label: '进库报关单号',
}, {
  field: 'po_no', label: '采购订单号',
}, {
  field: 'supplier', label: '供货商',
}, {
  field: 'ftz_ent_no', label: '监管入库单号',
}, {
  field: 'country', label: '原产国',
}, {
  field: 'attrib_1_string', label: '扩展属性1',
}, {
  field: 'attrib_2_string', label: '扩展属性2',
}, {
  field: 'attrib_3_string', label: '扩展属性3',
}, {
  field: 'attrib_4_string', label: '扩展属性4',
}];

exports.SKU_REQUIRED_PROPS = [{
  value: 'desc_cn', label: '中文品名',
}, {
  value: 'category', label: '商品分类',
}, {
  value: 'cbm', label: '体积',
}, {
  value: 'currency', label: '币制',
}, {
  value: 'hscode', label: '商品编号',
}];

exports.PICK_PRINT_FIELDS = [{
  field: 'product_no', text: '货号', width: 83,
}, {
  field: 'name', text: '产品名称', width: 100,
}, {
  field: 'sku_category', text: '商品分类', width: 60,
}, {
  field: 'location', text: '库位', width: 60,
}, {
  field: 'serial_no', text: '序列号', width: 80,
}, {
  field: 'virtual_whse', text: '库别', width: 50,
}, {
  field: 'external_lot_no', text: '批次号', width: 60,
}, {
  field: 'asn_cust_order_no', text: '入库单号', width: 60,
}, {
  field: 'attrib_1_string', text: '客户属性1', width: 60,
}, {
  field: 'attrib_2_string', text: '客户属性2', width: 40,
}, {
  field: 'attrib_3_string', text: '客户属性3', width: 40,
}, {
  field: 'attrib_4_string', text: '客户属性4', width: 40,
}];

exports.SHFTZ_ENTRY_MENU = {
  key: 'ENTRY',
  icon: 'import',
  title: '进区',
  type: 'submenu',
  children: [
    {
      key: 'bondedEntry',
      title: '进境入库备案',
      link: '/cwm/supervision/shftz/entry',
    },
  ],
};

exports.SHFTZ_EXIT_MENU = {
  key: 'EXIT',
  icon: 'export',
  title: '出区',
  type: 'submenu',
  children: [
    {
      key: 'relNormal',
      title: '普通出库备案',
      link: '/cwm/supervision/shftz/release/normal',
    },
    {
      key: 'normalDecl',
      title: '普通出库清关',
      link: '/cwm/supervision/shftz/decl/normal',
    },
    {
      key: 'relPortion',
      title: '分拨出库备案',
      link: '/cwm/supervision/shftz/release/portion',
    },
    {
      key: 'batchDecl',
      title: '分拨集中报关',
      link: '/cwm/supervision/shftz/decl/batch',
    },
  ],
};

exports.SHFTZ_TRANSFER_MENU = {
  key: 'TRANSFER',
  icon: 'interation',
  title: '区内移库',
  type: 'submenu',
  children: [
    {
      key: 'transferin',
      title: '区内移库转入',
      link: '/cwm/supervision/shftz/transfer/in',
    },
    {
      key: 'transferout',
      title: '区内移库转出',
      link: '/cwm/supervision/shftz/transfer/out',
    },
    {
      key: 'transferself',
      title: '本库转让',
      link: '/cwm/supervision/shftz/transfer/self',
    },
  ],
};

exports.SHFTZ_STOCK_MENU = {
  key: 'STOCK',
  icon: 'file-search',
  title: '监管库存',
  type: 'submenu',
  children: [
    {
      key: 'stock',
      title: '保税库存',
      link: '/cwm/supervision/shftz/stock',
    },
    {
      key: 'nonbonded',
      title: '非保税库存',
      link: '/cwm/supervision/shftz/stock/nonbonded',
    },

  ],
};
