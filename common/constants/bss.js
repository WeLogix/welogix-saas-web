export const BSS_FEE_TYPE = [
  {
    key: 'SC',
    text: '服务费',
    tag: 'green',
  }, {
    key: 'AP',
    text: '代垫费',
    tag: 'blue',
  }, {
    key: 'SP',
    text: '特殊费用',
    tag: 'red',
  },
];

export const BSS_FEE_ALLOC_RULE = [
  {
    key: 'CD',
    text: '按明细项数平均分摊',
  }, {
    key: 'QT',
    text: '按明细数量加权分摊',
  }, {
    key: 'WT',
    text: '按明细重量加权分摊',
  },
];

export const BSS_BILL_CATEGORY = [
  {
    key: 'buyerBill',
    text: '客户账单',
  }, {
    key: 'sellerBill',
    text: '服务商账单',
  },
];

export const BSS_BILL_TYPE = {
  FPB: {
    key: 'FPB',
    text: '正向账单',
  },
  BPB: {
    key: 'BPB',
    text: '逆向账单',
  },
  OFB: {
    key: 'OFB',
    text: '线下账单',
  },
  IPB: {
    key: 'IPB',
    text: '导入账单',
  },
};

export const BSS_VENDOR_BILL_STATUS = {
  RECONCILING: {
    key: 'reconciling',
    value: 2,
    text: '对账',
  },
  INVOICING: {
    key: 'invoicing',
    value: 4,
    text: '确认',
  },

};
export const BSS_CUSTOMER_BILL_STATUS = {
  DRAFT: {
    key: 'draft',
    value: 1,
    text: '草稿',
  },
  RECONCILING: {
    key: 'reconciling',
    value: 2,
    text: '对账',
  },
  INVOICING: {
    key: 'invoicing',
    value: 4,
    text: '开票',
  },
};

export const BSS_BILL_STATUS = {
  DRAFT: {
    key: 'draft',
    value: 1,
    text: '草稿',
  },
  RECONCILING: {
    key: 'reconciling',
    value: 2,
    text: '对账',
  },
  INVOICING: {
    key: 'invoicing',
    value: 4,
    text: '开票',
  },
  WRITTENOFF: {
    key: 'Written-Off',
    value: 5,
    text: '核销',
  },
};

export const SETTLE_TYPE = {
  owner: 1,
  vendor: 2,
};

export const BSS_PAYMENT_METHOD = [
  {
    key: 'TRANSFER',
    text: '银行转账',
    value: 1,
  }, {
    key: 'CHEQUE',
    text: '银行支票',
    value: 2,
  }, {
    key: 'NOTE',
    text: '银行本票',
    value: 3,
  }, {
    key: 'DRAFT',
    text: '银行汇票',
    value: 4,
  }, {
    key: 'CASH',
    text: '现金',
    value: 5,
  },
];

export const BSS_BILL_TEMPLATE_PROPS = [
  {
    fee_uid: 'bill_obj',
    key: 'bill_obj',
    label: '计费业务对象',
    fee_name: '计费业务对象',
    type: 'PARAM',
    options: [
      {
        bizObj: 'SHIPMENT',
        label: '货运订单',
      }, {
        bizObj: 'INVOICE',
        label: '商业发票',
      }, {
        bizObj: 'DECL',
        label: '报关单',
      },
    ],
  }, {
    fee_uid: 'customs_entry_nos',
    key: 'customs_entry_nos',
    label: '报关单号',
    fee_name: '报关单号',
    type: 'PARAM',
  }, {
    fee_uid: 'decl_sheet_qty',
    key: 'decl_sheet_qty',
    label: '联单数',
    fee_name: '联单数',
    type: 'PARAM',
  }, {
    fee_uid: 'trade_amount',
    key: 'trade_amount',
    label: '货值',
    fee_name: '货值',
    type: 'PARAM',
  },
];

export const BSS_SETTING = [
  {
    key: 'fees',
    link: '/bss/setting/fees',
  },
  {
    key: 'billTemplates',
    link: '/bss/setting/billtemplates',
  },
  {
    key: 'currencies',
    link: '/bss/setting/currencies',
  },
  {
    key: 'taxes',
    link: '/bss/setting/taxes',
  },
  {
    key: 'accountSets',
    link: '/bss/setting/accountsets',
  },
  {
    key: 'subjects',
    link: '/bss/setting/subjects',
  },
  {
    key: 'payTypes',
    link: '/bss/setting/paytypes',
  },
];

export const BSS_ACCOUNT_SET_VAT_TAX = [{
  text: '一般纳税人',
  value: 1,
}, {
  text: '小规模纳税人',
  value: 2,
}];

export const BSS_ACCOUNT_SUBJECT_TYPE = [{
  text: '资产',
  value: 1,
}, {
  text: '负债',
  value: 2,
}, {
  text: '权益',
  value: 3,
}, {
  text: '成本',
  value: 4,
}, {
  text: '损益',
  value: 5,
}];

export const BSS_BIZ_TYPE = [{
  text: '货运',
  value: 1,
  key: 'SHIPMENT',
}, {
  text: '报关单',
  value: 2,
  key: 'CUSDECL',
}, {
  text: '采购订单',
  value: 3,
  key: 'PO',
}, {
  text: '运输单',
  value: 4,
  key: 'TRANS',
}];

export const BSS_INV_TYPE = [{
  text: '增值税专用发票',
  value: 1,
  key: 'VAT_S',
}, {
  text: '增值税普通发票',
  value: 2,
  key: 'VAT_N',
}, {
  text: '海关专用缴款书',
  value: 3,
  key: 'TAX',
}];

export const BSS_PRESET_PAYEE = [{
  key: 'CENTRAL_TREASURY',
  text: '中央金库',
}, {
  key: 'OTHER_PAYEE',
  text: '其他收款方',
}];

export const BSS_PRESET_FEE = [{
  fee_name: '进口增值税',
  fee_code: 'VAT',
}, {
  fee_name: '进口关税',
  fee_code: 'DUTY',
}, {
  fee_name: '进口消费税',
  fee_code: 'GST',
}];

export const BSS_INVOICE_STATUS = [{
  value: 0,
  text: '未取票',
  key: 'pending',
}, {
  value: 1,
  text: '已取票',
  key: 'invoiced',
}, {
  value: 2,
  text: '已过账',
  key: 'posted',
}, {
  value: 3,
  text: '已作废',
  key: 'invalid',
}];
