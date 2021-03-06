const GLOBAL_TRACK_COLUMNS = [{
  field: 'po_no',
  label: '采购订单号',
  tbody: true,
  primary: true,
  globalKey: true,
}, {
  field: 'inv_no',
  label: '发票号',
  tbody: true,
  primary: true,
}, {
  field: 'gt_invoice_date',
  label: '发票日期',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_product_no',
  label: '货号',
  tbody: true,
}, {
  field: 'gt_inner_code',
  label: '内部代码',
  tbody: true,
}, {
  field: 'gt_supplier',
  label: '供应商名称或代码',
  tbody: true,
}, {
  field: 'gt_attrib_1_string',
  label: '扩展属性1',
  tbody: true,
}, {
  field: 'gt_attrib_2_string',
  label: '扩展属性2',
  tbody: true,
}, {
  field: 'gt_attrib_3_string',
  label: '扩展属性3',
  tbody: true,
}, {
  field: 'gt_attrib_4_string',
  label: '扩展属性4',
  tbody: true,
}, {
  field: 'gt_attrib_5_string',
  label: '扩展属性5',
  tbody: true,
}, {
  field: 'gt_attrib_6_string',
  label: '扩展属性6',
  tbody: true,
}, {
  field: 'gt_attrib_7_date',
  label: '扩展属性7',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_8_date',
  label: '扩展属性8',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_9_date',
  label: '扩展属性9',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_10_date',
  label: '扩展属性10',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_11_date',
  label: '扩展属性11',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_12_date',
  label: '扩展属性12',
  datatype: 'DATE',
  tbody: true,
}, {
  field: 'gt_attrib_13_string',
  label: '扩展属性13',
  tbody: true,
}, {
  field: 'gt_attrib_14_string',
  label: '扩展属性14',
  tbody: true,
}, {
  field: 'gt_attrib_15_string',
  label: '扩展属性15',
  tbody: true,
}, {
  field: 'gt_attrib_16_string',
  label: '扩展属性16',
  tbody: true,
}, {
  field: 'gt_attrib_17_string',
  label: '扩展属性17',
  tbody: true,
}, {
  field: 'gt_attrib_18_string',
  label: '扩展属性18',
  tbody: true,
}, {
  field: 'cust_order_no',
  label: '货运编号',
  tbody: true,
  primary: true,
}, {
  field: 'entry_id',
  label: '报关单号',
  tbody: true,
  primary: true,
}, {
  field: 'cop_currency',
  label: '导入币制',
  tbody: true,
}, {
  field: 'cop_brand_code',
  label: '品牌代码',
  tbody: true,
}, {
  field: 'cop_brand',
  label: '品牌',
  tbody: true,
}, {
  field: 'cop_item_group',
  label: '产品大类',
  tbody: true,
}, {
  field: 'cop_controller',
  label: '产品负责人',
  tbody: true,
}, {
  field: 'cop_weight_unit',
  label: '重量单位',
  tbody: true,
}, {
  field: 'gt_container_no',
  label: '集装箱号',
  tbody: true,
}, {
  field: 'gt_decl_g_no',
  label: '报关单项号',
  tbody: true,
}, {
  field: 'gt_trxn_mode',
  label: '成交方式',
  tbody: true,
}, {
  field: 'gt_hscode',
  label: '商品编号',
  tbody: true,
}, {
  field: 'gt_name_en',
  label: '英文名称',
  tbody: true,
}, {
  field: 'gt_name_cn',
  label: '中文名称',
  tbody: true,
}, {
  field: 'gt_g_desc',
  label: '描述',
  tbody: true,
}, {
  field: 'gt_qty_pcs',
  label: '个数数量',
  tbody: true,
}, {
  field: 'gt_unit_pcs',
  label: '个数单位',
  tbody: true,
}, {
  field: 'gt_grosswt',
  label: '毛重',
  tbody: true,
}, {
  field: 'gt_netwt',
  label: '净重',
  tbody: true,
}, {
  field: 'gt_origin_country',
  label: '原产国地',
  tbody: true,
}, {
  field: 'gt_currency',
  label: '申报币制',
  tbody: true,
}, {
  field: 'gt_amount',
  label: '申报金额',
  tbody: true,
}, {
  field: 'gt_unit_price',
  label: '单价',
  tbody: true,
}, {
  field: 'gt_freight',
  label: '运费',
  tbody: true,
}, {
  field: 'gt_freight_currency',
  label: '运费币制',
  tbody: true,
}, {
  field: 'gt_manual_no',
  label: '备案号',
  tbody: true,
}, {
  field: 'gt_prdt_item_no',
  label: '备案序号',
  tbody: true,
}, {
  field: 'gt_g_model',
  label: '规范申报',
  tbody: true,
}, {
  field: 'gt_dest_country',
  label: '目的国别',
  tbody: true,
}, {
  field: 'gt_g_qty',
  label: '成交数量',
  tbody: true,
}, {
  field: 'gt_g_unit',
  label: '成交单位',
  tbody: true,
}, {
  field: 'gt_qty_1',
  label: '法一数量',
  tbody: true,
}, {
  field: 'gt_unit_1',
  label: '法一单位',
  tbody: true,
}, {
  field: 'gt_qty_2',
  label: '法二数量',
  tbody: true,
}, {
  field: 'gt_unit_2',
  label: '法二单位',
  tbody: true,
}, {
  field: 'gt_duty_mode',
  label: '征免性质',
  tbody: true,
}, {
  field: 'gt_version_no',
  label: '版本号',
  tbody: true,
}, {
  field: 'gt_processing_fees',
  label: '工缴费',
  tbody: true,
}, {
  field: 'gt_district_code',
  label: '境内目的地/货源地',
  tbody: true,
}, {
  field: 'gt_district_region',
  label: '目的地/产地行政区划代码',
  tbody: true,
}, {
  field: 'gt_orig_place_code',
  label: '原产地区',
  tbody: true,
}, {
  field: 'gt_purpose',
  label: '用途',
  tbody: true,
}, {
  field: 'gt_goods_attr',
  label: '货物属性',
  tbody: true,
}, {
  field: 'gt_danger_flag',
  label: '非危险化学品',
  tbody: true,
}, {
  field: 'gt_danger_uncode',
  label: 'UN编码',
  tbody: true,
}, {
  field: 'gt_danger_name',
  label: '危险品名称',
  tbody: true,
}, {
  field: 'gt_danger_pack_type',
  label: '危包类别',
  tbody: true,
}, {
  field: 'gt_danger_pack_spec',
  label: '危包规格',
  tbody: true,
}, {
  field: 'gt_whse_code',
  label: '仓库代码',
  tbody: true,
}, {
  field: 'gt_serial_no',
  label: '序列号',
  tbody: true,
}, {
  field: 'gt_owner',
  label: '客户代码或名称',
  tbody: true,
}, {
  field: 'gt_owner_country',
  label: '客户国别',
  tbody: true,
}, {
  field: 'gt_supplier_country',
  label: '供应商国别',
  tbody: true,
}, {
  field: 'gt_virtual_whse',
  label: '库别',
  tbody: true,
}, {
  field: 'gt_external_lot_no',
  label: '批次号',
  tbody: true,
}, {
  field: 'gt_cust_order_no_in',
  label: '入库单号',
  tbody: true,
}, {
  field: 'gt_ftz_ent_no',
  label: '监管入库单号',
  tbody: true,
}, {
  field: 'gt_stuff',
  label: '成分/原料/组分',
  tbody: true,
}, {
  field: 'gt_expiry_date',
  label: '产品有效期',
  tbody: true,
}, {
  field: 'gt_warranty_days',
  label: '产品保质期(天)',
  tbody: true,
}, {
  field: 'gt_product_spec',
  label: '货物规格',
  tbody: true,
}, {
  field: 'intl_oversea_entity',
  label: '境外生产企业',
  tbody: true,
}, {
  field: 'gt_product_model',
  label: '货物型号',
  tbody: true,
}, {
  field: 'gt_produce_date',
  label: '生产日期',
  tbody: true,
}];

exports.LINE_FILE_ADAPTOR_MODELS = {
  SOF_ORDER: {
    key: 'SOF.ORDER',
    name: '货运订单Shipment模板',
    exportName: '货运订单',
    columns: [{
      field: 'cust_code',
      label: '客户代码',
      exportField: 'customer_name',
      exportLabel: '客户名称',
      thead: true,
    }, {
      field: 'cust_shipmt_transfer',
      label: '进出口标识',
      thead: true,
    }, {
      field: 'cust_shipmt_pieces',
      label: '件数',
      thead: true,
    }, {
      field: 'cust_shipmt_wrap_type',
      label: '包装',
      thead: true,
    }, {
      field: 'cust_shipmt_weight',
      label: '总毛重',
      thead: true,
    }, {
      field: 'cust_shipmt_volume',
      label: 'CBM',
      thead: true,
    }, {
      field: 'cust_shipmt_expedited',
      label: '是否紧急',
      thead: true,
    }, {
      field: 'cust_shipmt_goods_type',
      label: '货物类型',
      thead: true,
    }, {
      field: 'cust_receiver_code',
      label: '收货方代码',
      thead: true,
    }, {
      field: 'cust_receiver_name',
      label: '收货方名称',
      thead: true,
    }, {
      field: 'cust_receiver_contact',
      label: '收货方联系人',
      thead: true,
    }, {
      field: 'cust_receiver_address',
      label: '收件详细地址',
      thead: true,
    }, {
      field: 'cust_receiver_tel',
      label: '收货方联系电话',
      thead: true,
    }, {
      field: 'cust_receiver_mobile',
      label: '收货方手机号',
      thead: true,
    }, {
      field: 'cust_remark',
      label: '备注',
      thead: true,
    }, {
      field: 'cust_shipmt_trans_mode',
      label: '运输方式',
      thead: true,
    }, {
      field: 'bl_mawb',
      label: '提运单/主运单',
      exportField: 'cust_shipmt_mawb',
      exportLabel: '主运单号',
      thead: true,
    }, {
      field: 'swb_hawb',
      label: '海运单/分运单',
      exportField: 'cust_shipmt_hawb',
      exportLabel: '分运单号',
      thead: true,
    }, {
      field: 'cust_shipmt_vessel',
      label: '船名/航班号',
      thead: true,
    }, {
      field: 'cust_shipmt_voy',
      label: '航次',
      thead: true,
    }, {
      field: 'cust_shipmt_forwarder',
      label: '货运代理',
      thead: true,
    }, {
      field: 'cust_shipmt_freight',
      label: '运费',
      thead: true,
    }, {
      field: 'cust_shipmt_freight_currency',
      label: '运费币制',
      thead: true,
    }, {
      field: 'cust_shipmt_insur_fee',
      label: '保费',
      thead: true,
    }, {
      field: 'cust_shipmt_insur_currency',
      label: '保费币制',
      thead: true,
    }, {
      field: 'cust_shipmt_misc_fee',
      label: '杂费',
      thead: true,
    }, {
      field: 'cust_shipmt_misc_currency',
      label: '杂费币制',
      thead: true,
    }].concat(GLOBAL_TRACK_COLUMNS),
  },
  SCOF_INVOICE: {
    key: 'SCOF_INVOICE',
    name: '商业发票Invoice模板',
    exportName: '商业发票',
    columns: [{
      field: 'invoice_category',
      label: '发票类别',
      thead: true,
    }, {
      field: 'bl_awb_no',
      label: '提运单号',
      thead: true,
    }, {
      field: 'supplier',
      label: '供应商名称或代码',
      thead: true,
    }, {
      field: 'buyer',
      label: '购买方',
      thead: true,
    }, {
      field: 'seller',
      label: '销售方',
      thead: true,
    }, {
      field: 'total_grosswt',
      label: '总毛重',
      thead: true,
    }, {
      field: 'package_number',
      label: '件数',
      thead: true,
    }, {
      field: 'package_type',
      label: '包装',
      thead: true,
    }, {
      field: 'payment_date',
      label: '付款日期',
      thead: true,
    }, {
      field: 'inv_attr1_str',
      label: '发票属性1',
      thead: true,
    }, {
      field: 'inv_attr2_str',
      label: '发票属性2',
      thead: true,
    }, {
      field: 'inv_attr3_str',
      label: '发票属性3',
      thead: true,
    }, {
      field: 'inv_attr4_str',
      label: '发票属性4',
      thead: true,
    }, {
      field: 'inv_attr5_str',
      label: '发票属性5',
      thead: true,
    }, {
      field: 'inv_attr6_str',
      label: '发票属性6',
      thead: true,
    }].concat(GLOBAL_TRACK_COLUMNS),
  },
  SCOF_PURCHASE_ORDER: {
    key: 'SCOF_PURCHASE_ORDER',
    name: '采购订单PO模板',
    exportName: '采购订单PO',
    columns: GLOBAL_TRACK_COLUMNS.concat([{
      field: 'intl_traf_mode',
      label: '运输方式',
      tbody: true,
    }, {
      field: 'sup_est_shipping_time',
      label: '供应商预计发货日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'sup_shipping_time',
      label: '供应商实际发货日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'sup_est_recv_time',
      label: '供应商预计到货日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'sup_recv_time',
      label: '供应商修改到货日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'owner_recv_time',
      label: '实际收货日期',
      datatype: 'DATE',
      tbody: true,
    }]),
  },
  SOF_GLOBALTRACK: {
    key: 'SOF_GLOBALTRACK',
    name: '状态跟踪模板',
    exportName: '状态跟踪表',
    columns: [{
      field: 'po_no',
      label: '采购订单号',
      primary: true,
      width: 150,
    }, {
      field: 'inv_no',
      label: '发票号',
      primary: true,
      // editable: true,
      width: 150,
    }, {
      field: 'cust_order_no',
      label: '货运编号',
      primary: true,
      width: 150,
    }, {
      field: 'gt_amount',
      label: '总金额',
      width: 150,
    }, {
      field: 'gt_currency',
      label: '币制',
      width: 150,
    }, {
      field: 'intl_bl_mawb',
      label: '总提单号',
      width: 150,
    }, {
      field: 'intl_swb_hawb',
      label: '分提单号',
      primary: true,
      width: 150,
    }, {
      field: 'intl_traf_mode',
      label: '运输方式',
      width: 150,
    }, {
      field: 'intl_dept_port',
      label: '起运港',
      width: 150,
    }, {
      field: 'intl_dest_port',
      label: '目的港',
      width: 150,
    }, {
      field: 'gt_trxn_mode',
      label: '成交方式',
      width: 150,
    }, {
      field: 'entry_id',
      label: '报关单号',
      primary: true,
      width: 180,
    }, {
      field: 'sup_est_shipping_time',
      label: '预计发货日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'sup_shipping_time',
      label: '发货日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'sup_est_recv_time',
      label: '预计到货日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'sup_recv_time',
      label: '修改到货日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'owner_recv_time',
      label: '到货日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'intl_depart_time',
      label: '离港日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'intl_est_arrival_time',
      label: '预计到港日',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'intl_arrival_time',
      label: '到港日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'cms_manifest_time',
      label: '制单日期',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_manifest_by',
      label: '报关制单人',
      width: 150,
    }, {
      field: 'cms_reviewed_time',
      label: '复核日期',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_reviewed_by',
      label: '复核人',
      width: 150,
    }, {
      field: 'cms_exchangedoc_time',
      label: '抽单日期',
      datatype: 'DATE',
      editable: true,
      width: 150,
    }, {
      field: 'cms_decl_time',
      label: '申报日期',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_taxpaid_time',
      label: '付税日期',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_cus_inspection_time',
      label: '海关查验时间',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_ciq_inspection_time',
      label: '商检查验时间',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_cus_inspection_fintime',
      label: '海关查验完成时间',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_ciq_inspection_fintime',
      label: '商检查验完成时间',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_clear_time',
      label: '放行日期',
      datatype: 'DATE',
      width: 150,
    }, {
      field: 'cms_broker',
      label: '代理报关公司',
      // editable: true,
      width: 150,
    }, {
      field: 'gt_attrib_1_string',
      label: '扩展属性1',
    }, {
      field: 'gt_attrib_2_string',
      label: '扩展属性2',
    }, {
      field: 'gt_attrib_3_string',
      label: '扩展属性3',
    }, {
      field: 'gt_attrib_4_string',
      label: '扩展属性4',
    }, {
      field: 'gt_attrib_5_string',
      label: '扩展属性5',
    }, {
      field: 'gt_attrib_6_string',
      label: '扩展属性6',
    }, {
      field: 'gt_attrib_7_date',
      label: '扩展属性7',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_8_date',
      label: '扩展属性8',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_9_date',
      label: '扩展属性9',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_10_date',
      label: '扩展属性10',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_11_date',
      label: '扩展属性11',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_12_date',
      label: '扩展属性12',
      datatype: 'DATE',
      editable: true,
    }, {
      field: 'gt_attrib_13_string',
      label: '扩展属性13',
    }, {
      field: 'gt_attrib_14_string',
      label: '扩展属性14',
    }, {
      field: 'gt_attrib_15_string',
      label: '扩展属性15',
    }, {
      field: 'gt_attrib_16_string',
      label: '扩展属性16',
    }, {
      field: 'gt_attrib_17_string',
      label: '扩展属性17',
    }, {
      field: 'gt_attrib_18_string',
      label: '扩展属性18',
    }],
  },
  CWM_ASN: {
    key: 'CWM_ASN',
    name: '收货通知ASN模板',
    exportName: '收货通知ASN',
    columns: [{
      field: 'asn_no',
      label: 'ASN编号',
      thead: true,
    }, {
      field: 'owner_name',
      label: '货主',
      thead: true,
    }, {
      field: 'supplier_name',
      label: '供应商',
      exportField: 'supplier',
      tbody: true,
    }, {
      field: 'bonded',
      label: '保税监管',
      thead: true,
    }, {
      field: 'bonded_intype',
      label: '监管状态',
      thead: true,
    }, {
      field: 'cust_order_no',
      label: '入库订单追踪号',
      thead: true,
      primary: true,
    }, {
      field: 'attrib_1_string',
      label: '扩展属性1',
      tbody: true,
    }, {
      field: 'attrib_2_string',
      label: '扩展属性2',
      tbody: true,
    }, {
      field: 'attrib_3_string',
      label: '扩展属性3',
      tbody: true,
    }, {
      field: 'attrib_4_string',
      label: '扩展属性4',
      tbody: true,
    }, {
      field: 'serial_no',
      label: '序列号',
      tbody: true,
    }, {
      field: 'po_no',
      label: '采购订单号',
      tbody: true,
    }, {
      field: 'invoice_no',
      label: '发票号',
      tbody: true,
      primary: true,
    }, {
      field: 'product_no',
      label: '货号',
      tbody: true,
    }, {
      field: 'name',
      label: '名称',
      tbody: true,
    }, {
      field: 'product_sku',
      label: '货品SKU',
      tbody: true,
    }, {
      field: 'unit_price',
      label: '单价',
      tbody: true,
    }, {
      field: 'virtual_whse',
      label: '库别',
      tbody: true,
    }, {
      field: 'CBM',
      label: 'volume',
      tbody: true,
    }, {
      field: 'external_lot_no',
      label: '外部批次号',
      tbody: true,
    }, {
      field: 'stock_qty',
      label: '库存数量',
      tbody: true,
    }],
  },
  CWM_SHIPPING_ORDER: {
    key: 'CWM_SHIPPING_ORDER',
    name: '出库订单SO模板',
    exportName: '出库订单',
    columns: [{
      field: 'owner_code',
      label: '客户代码',
      exportField: 'owner_name',
      exportLabel: '货主',
      thead: true,
    }, {
      field: 'cust_order_no',
      label: '订单追踪号',
      thead: true,
      primary: true,
    }, {
      field: 'created_date',
      label: '订单创建日期',
      thead: true,
      datatype: 'DATE',
    }, {
      field: 'total_qty',
      label: '订单数量',
      thead: true,
    }, {
      field: 'real_express_no',
      label: '快递单号',
      thead: true,
    }, {
      field: 'express_date',
      label: '快递单获取日期',
      thead: true,
      datatype: 'DATE',
    }, {
      field: 'product_no',
      label: '商品货号',
      tbody: true,
    }, {
      field: 'name',
      label: '品名',
      tbody: true,
    }, {
      field: 'virtual_whse',
      label: '库别',
      tbody: true,
    }, {
      field: 'po_no',
      label: '采购订单号',
      tbody: true,
    }, {
      field: 'asn_cust_order_no',
      label: '入库订单追踪号',
      tbody: true,
    }, {
      field: 'attrib_1_string',
      label: '扩展属性1',
      tbody: true,
    }, {
      field: 'attrib_2_string',
      label: '扩展属性2',
      tbody: true,
    }, {
      field: 'attrib_3_string',
      label: '扩展属性3',
      tbody: true,
    }, {
      field: 'attrib_4_string',
      label: '扩展属性4',
      tbody: true,
    }, {
      field: 'attrib_5_string',
      label: '扩展属性5',
      tbody: true,
    }, {
      field: 'attrib_6_string',
      label: '扩展属性6',
      tbody: true,
    }, {
      field: 'external_lot_no',
      label: '批次号',
      tbody: true,
    }, {
      field: 'serial_no',
      label: '产品序列号',
      tbody: true,
    }, {
      field: 'receiver_name',
      label: '收货方',
      thead: true,
    }, {
      field: 'receiver_contact',
      label: '联系人',
      thead: true,
    }, {
      field: 'receiver_address',
      label: '收件详细地址',
      thead: true,
    }, {
      field: 'receiver_phone',
      label: '联系电话',
      thead: true,
    }, {
      field: 'receiver_number',
      label: '手机号',
      thead: true,
    }, {
      field: 'receiver_post_code',
      label: '邮政编码',
      thead: true,
    }, {
      field: 'expect_shipping_date',
      label: '要求出货日期',
      thead: true,
    }, {
      field: 'bonded',
      label: '保税类型',
      thead: true,
    }, {
      field: 'amount',
      label: '金额',
      tbody: true,
    }, {
      field: 'CBM',
      label: 'volume',
      tbody: true,
    }, {
      field: 'bonded_outtype',
      label: '监管方式',
      thead: true,
    }, {
      field: 'supplier',
      label: '供货商',
    }, {
      field: 'so_type',
      label: 'SO类型',
      thead: true,
    }, {
      field: 'outbound_qty',
      label: '出库数量',
      tbody: true,
    }],
  },
  CMS_TRADEITEM: {
    key: 'CMS_TRADEITEM',
    name: '商品归类模板',
    exportName: '商品归类',
    columns: [{
      field: 'repo_owner_name',
      label: '库拥有租户',
      tbody: true,
    }, {
      field: 'cop_product_no',
      label: '商品货号',
      tbody: true,
    }, {
      field: 'item_type',
      label: '料件类型',
      tbody: true,
    }, {
      field: 'special_mark',
      label: '特殊货号标记',
      tbody: true,
    }, {
      field: 'hscode',
      label: '商品编号',
      tbody: true,
    }, {
      field: 'g_name',
      label: '品名',
      tbody: true,
    }, {
      field: 'en_name',
      label: '英文品名',
      tbody: true,
    }, {
      field: 'g_desc',
      label: '描述',
      tbody: true,
    }, {
      field: 'g_model',
      label: '中文规格型号',
      tbody: true,
    }, {
      field: 'element',
      label: '申报要素',
      tbody: true,
    }, {
      field: 'g_unit_1',
      label: '成交单位一',
      tbody: true,
    }, {
      field: 'g_unit_2',
      label: '成交单位二',
      tbody: true,
    }, {
      field: 'g_unit_3',
      label: '成交单位三',
      tbody: true,
    }, {
      field: 'unit_1',
      label: '法一单位',
      tbody: true,
    }, {
      field: 'unit_2',
      label: '法二单位',
      tbody: true,
    }, {
      field: 'fixed_qty',
      label: '固定值',
      tbody: true,
    }, {
      field: 'fixed_unit',
      label: '固值单位',
      tbody: true,
    }, {
      field: 'origin_country',
      label: '原产国',
      tbody: true,
    }, {
      field: 'unit_net_wt',
      label: '单个净重',
      tbody: true,
    }, {
      field: 'customs_control',
      label: '海关监管条件',
      tbody: true,
    }, {
      field: 'inspection_quarantine',
      label: '检验检疫',
      tbody: true,
    }, {
      field: 'appl_cert_code',
      label: '检验检疫出具证书类型',
      tbody: true,
    }, {
      field: 'unit_price',
      label: '单价',
      tbody: true,
    }, {
      field: 'pre_classify_no',
      label: '预归类编号',
      tbody: true,
    }, {
      field: 'pre_classify_start_date',
      label: '预归类意见书的启用日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'pre_classify_end_date',
      label: '预归类意见书的到期日期',
      datatype: 'DATE',
      tbody: true,
    }, {
      field: 'remark',
      label: '备注',
      tbody: true,
    }, {
      field: 'proc_method',
      label: '工艺/原理',
      tbody: true,
    }, {
      field: 'material_ingred',
      label: '材质/成分',
      tbody: true,
    }, {
      field: 'functionality',
      label: '功能',
      tbody: true,
    }, {
      field: 'usage',
      label: '用途',
      tbody: true,
    }, {
      field: 'goods_attr',
      label: '货物属性',
      tbody: true,
    }, {
      field: 'efficiency',
      label: '能效',
      tbody: true,
    }, {
      field: 'danger_flag',
      label: '非危险化学品',
      tbody: true,
    }, {
      field: 'danger_uncode',
      label: 'UN编码',
      tbody: true,
    }, {
      field: 'danger_name',
      label: '危险货物名称',
      tbody: true,
    }, {
      field: 'danger_pack_type',
      label: '危包类别',
      tbody: true,
    }, {
      field: 'danger_pack_spec',
      label: '危包规格',
      tbody: true,
    }, {
      field: 'cop_code',
      label: '内部代码',
      tbody: true,
    }, {
      field: 'cop_bu',
      label: '所属BU',
      tbody: true,
    }, {
      field: 'cop_brand',
      label: '品牌',
      tbody: true,
    }, {
      field: 'cop_item_group',
      label: '产品大类',
      tbody: true,
    }, {
      field: 'cop_controller',
      label: '产品负责人',
      tbody: true,
    }, {
      field: 'attrib1',
      label: '扩展属性1',
      tbody: true,
    }, {
      field: 'attrib2',
      label: '扩展属性2',
      tbody: true,
    }, {
      field: 'attrib3',
      label: '扩展属性3',
      tbody: true,
    }, {
      field: 'attrib4',
      label: '扩展属性4',
      tbody: true,
    }, {
      field: 'attrib5',
      label: '扩展属性5',
      tbody: true,
    }, {
      field: 'attrib6',
      label: '扩展属性6',
      tbody: true,
    }, {
      field: 'id',
      label: 'itemId',
      tbody: true,
    }],
  },
  CMS_MANIFEST_BODY: {
    key: 'CMS_MANIFEST_BODY',
    name: '清单表体模板',
    columns: [{
      field: 'product_no',
      label: '商品货号',
    }, {
      field: 'prdt_item_no',
      label: '项号',
    }, {
      field: 'hscode',
      label: '商品编号',
    }, {
      field: 'g_name',
      label: '商品名称',
    }, {
      field: 'en_name',
      label: '英文品名',
    }, {
      field: 'g_desc',
      label: '描述',
    }, {
      field: 'g_model',
      label: '规格型号',
    }, {
      field: 'element',
      label: '申报要素',
    }, {
      field: 'g_qty',
      label: '成交数量',
    }, {
      field: 'g_unit',
      label: '成交计量单位',
    }, {
      field: 'unit_price',
      label: '申报单价',
    }, {
      field: 'amount',
      label: '申报总价',
    }, {
      field: 'currency',
      label: '币制',
    }, {
      field: 'qty_1',
      label: '法定第一数量',
    }, {
      field: 'unit_1',
      label: '法定第一单位',
    }, {
      field: 'qty_2',
      label: '法定第二数量',
    }, {
      field: 'unit_2',
      label: '法定第二单位',
    }, {
      field: 'duty_mode',
      label: '征免方式',
    }, {
      field: 'dest_country',
      label: '目的国',
    }, {
      field: 'orig_country',
      label: '原产国',
    }, {
      field: 'qty_pcs',
      label: '数量(个数)',
    }, {
      field: 'unit_pcs',
      label: '单位(个数)',
    }, {
      field: 'net_wt',
      label: '净重(千克)',
    }, {
      field: 'gross_wt',
      label: '毛重(千克)',
    }, {
      field: 'version_no',
      label: '版本号',
    }, {
      field: 'processing_fees',
      label: '工缴费',
    }, {
      field: 'district_code',
      label: '境内目的地',
    }, {
      field: 'district_region',
      label: '目的地',
    }, {
      field: 'container_no',
      label: '集装箱号',
    }],
  },
  SCOF_INVOICE_CONFIRM: {
    key: 'SCOF_INVOICE_CONFIRM',
    name: '收发货确认模版',
    columns: [{
      field: 'po_no',
      label: 'globalNo',
      primary: true,
      globalKey: true,
    }, {
      field: 'confirm_qty',
      label: '确认数量',
    }, {
      field: 'gt_pallet_no',
      label: '托盘号',
    }, {
      field: 'gt_carton_no',
      label: '箱号',
    }],
  },
};

