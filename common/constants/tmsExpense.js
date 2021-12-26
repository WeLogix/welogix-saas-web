export const TMS_BILLING_CASCADER = [
  {
    label: '自动',
    key: 'auto',
    value: 'auto',
    children: [
      {
        key: '$formula', value: '$formula', label: '按公式计费',
      },
      {
        key: 'freight_rates', value: 'freight_rates', label: '按线路费率',
      },
      {
        key: 'load_qty', value: 'load_qty', label: '按计费数量', formula: true, formula_label: '计费数量',
      },
      {
        key: 'load_wt', value: 'load_wt', label: '按计费重量', formula: true, formula_label: '计费重量',
      },
      {
        key: 'load_vol', value: 'load_vol', label: '按计费体积', formula: true, formula_label: '计费体积',
      },
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

export const TMS_EVENTS = [
  { key: 'load', text: '装车' },
  { key: 'unload', text: '卸车' },
];
