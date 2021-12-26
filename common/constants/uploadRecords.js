exports.UPLOAD_BATCH_OBJECT = {
  SCOF_INVOICE: 'scof_invoices',
  SCOF_ORDER: 'scof_orders',
  CMS_EXPENSE: 'cms_delegation_expense',
  TMS_EXPENSE: 'tms_expense',
  SCOF_PURCHASE_ORDER: 'scof_purchase_order',
  SCOF_CUSTOMER: 'scof_customer',
  SCOF_SUPPLIER: 'scof_supplier',
  SCOF_VENDOR: 'scof_vendor',
  SCOF_CONTACT: 'scof_contact',
  CWM_SKU: 'cwm_sku',
  CMS_TAX: 'cms_tax',
  CMS_PERMIT: 'cms_permit',
};

// 系统预设归档类型
exports.ARCHIVE_TYPE = [
  { value: -1, text: '合同' },
  { value: -2, text: '发票' },
  { value: -3, text: '箱单' },
  { value: -4, text: '单证' },
  { value: -5, text: '报关单' },
  { value: -6, text: '其它' }, // 暂存老数据
];
