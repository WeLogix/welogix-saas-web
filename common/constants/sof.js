export const CRM_ORDER_STATUS = {
  created: 1,
  processing: 2,
  closed: 3,
  finished: 4,
  cancelled: 5,
};

export const CRM_ORDER_MODE = {
  clearance: 'clearance',
  transport: 'transport',
};

export const SCOF_ORDER_TRANSFER = [
  {
    value: 'IMP', text: '进口货运', icon: 'login', desc: '货物由境外运输入境',
  },
  {
    value: 'EXP', text: '出口货运', icon: 'logout', desc: '货物由境内运输出境',
  },
  {
    value: 'DOM', text: '国内货运', icon: 'reload', desc: '无实际进出境运输',
  },
];

export const TRANS_MODES = [
  { value: '2', text: '海运', icon: 'icon-boat' },
  { value: '5', text: '空运', icon: 'icon-plane' },
  { value: '4', text: '公路', icon: 'icon-truck' },
  { value: '3', text: '铁路', icon: 'icon-train' },
];

export const WRAP_TYPE_V1 = [{
  text: '木箱',
  value: '1',
  value_v2: '23',
}, {
  text: '纸箱',
  value: '2',
  value_v2: '22',
}, {
  text: '桶装',
  value: '3',
  value_v2: '32',
}, {
  text: '散装',
  value: '4',
  value_v2: '00',
}, {
  text: '托盘',
  value: '5',
  value_v2: '92',
}, {
  text: '包',
  value: '6',
  value_v2: '06',
}, {
  text: '其它',
  value: '7',
  value_v2: '99',
}];

export const WRAP_TYPE = [{
  value: '00',
  text: '散装',
}, {
  value: '01',
  text: '裸装',
}, {
  value: '22',
  text: '纸制或纤维板制盒/箱',
}, {
  value: '23',
  text: '木制或竹藤等植物性材料制盒/箱',
}, {
  value: '29',
  text: '其他材料制盒/箱',
}, {
  value: '32',
  text: '纸制或纤维板制桶',
}, {
  value: '33',
  text: '木制或竹藤等植物性材料制桶',
}, {
  value: '39',
  text: '其他材料制桶',
}, {
  value: '04',
  text: '球状罐类',
}, {
  value: '06',
  text: '包/袋',
}, {
  value: '92',
  text: '再生木托',
}, {
  value: '93',
  text: '天然木托',
}, {
  value: '98',
  text: '植物性铺垫材料',
}, {
  value: '99',
  text: '其他包装',
}];

export const GOODSTYPES = [{
  value: 0,
  text: '普通货',
}, {
  value: 1,
  text: '冷冻品',
}, {
  value: 2,
  text: '危化品',
}];

export const EXPEDITED_TYPES = [{
  value: '0',
  text: '不紧急',
}, {
  value: '1',
  text: '紧急',
}, {
  value: '2',
  text: '非常紧急',
}];

export const INV_SHIPRECV_STATUS = [{
  value: '0', text: '待发货',
}, {
  value: '1', text: '发货异常',
}, {
  value: '2', text: '已发货',
}, {
  value: '3', text: '收货异常',
}, {
  value: '4', text: '已收货',
}];
