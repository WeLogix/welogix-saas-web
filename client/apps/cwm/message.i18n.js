import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'cwm.module.dashboard',
    defaultMessage: '工作台',
  },
  whseWork: {
    id: 'cwm.module.group.whseWork',
    defaultMessage: '仓储作业',
  },
  receiving: {
    id: 'cwm.module.receiving',
    defaultMessage: '入库',
  },
  receivingASN: {
    id: 'cwm.module.receiving.asn',
    defaultMessage: '收货通知ASN',
  },
  receivingInbound: {
    id: 'cwm.module.receiving.inbound',
    defaultMessage: '入库单',
  },
  shipping: {
    id: 'cwm.module.shipping',
    defaultMessage: '出库',
  },
  shippingOrder: {
    id: 'cwm.module.shipping.order',
    defaultMessage: '出库订单',
  },
  shippingWave: {
    id: 'cwm.module.shipping.wave',
    defaultMessage: '波次',
  },
  shippingOutbound: {
    id: 'cwm.module.shipping.outbound',
    defaultMessage: '出库单',
  },
  shippingLoad: {
    id: 'cwm.module.shipping.load',
    defaultMessage: '装车单',
  },
  stock: {
    id: 'cwm.module.stock',
    defaultMessage: '在库',
  },
  inventory: {
    id: 'cwm.module.stock.inventory',
    defaultMessage: '库存余量',
  },
  transactions: {
    id: 'cwm.module.stock.transactions',
    defaultMessage: '库存流水',
  },
  movement: {
    id: 'cwm.module.stock.movement',
    defaultMessage: '库存移动',
  },
  transition: {
    id: 'cwm.module.stock.transition',
    defaultMessage: '库存调整',
  },
  counting: {
    id: 'cwm.module.stock.counting',
    defaultMessage: '库存盘点',
  },
  supervisionBonded: {
    id: 'cwm.module.group.customs',
    defaultMessage: '保税监管',
  },
  supervisionSHFTZ: {
    id: 'cwm.module.supervision.shftz',
    defaultMessage: '上海自贸区监管',
  },
  supervisionSASBL: {
    id: 'cwm.module.supervision.sasbl',
    defaultMessage: '金二保税物流',
  },
  blBook: {
    id: 'cwm.module.bl.book',
    defaultMessage: '物流账册',
  },
  whseQuery: {
    id: 'cwm.module.group.query',
    defaultMessage: '仓储查询',
  },
  queryStock: {
    id: 'cwm.module.query.stock',
    defaultMessage: '库存查询',
  },
  queryInbound: {
    id: 'cwm.module.query.inbound',
    defaultMessage: '入库查询',
  },
  queryOutbound: {
    id: 'cwm.module.query.outbound',
    defaultMessage: '出库查询',
  },
  basicSettings: {
    id: 'cwm.module.group.basic',
    defaultMessage: '基础设置',
  },
  products: {
    id: 'cwm.module.products',
    defaultMessage: '货品设置',
  },
  warehouses: {
    id: 'cwm.module.warehouses',
    defaultMessage: '仓库设置',
  },
  devApps: {
    id: 'cwm.module.dev.apps',
    defaultMessage: '更多应用',
  },
  warehouse: {
    id: 'cwm.module.settings.warehouse',
    defaultMessage: '仓库',
  },
  owner: {
    id: 'cwm.module.common.owner',
    defaultMessage: '货主',
  },
  productNo: {
    id: 'cwm.module.common.product.no',
    defaultMessage: '货号',
  },
  descCN: {
    id: 'cwm.module.common.desc.cn',
    defaultMessage: '中文品名',
  },
  SKUCategory: {
    id: 'cwm.module.common.sku.category',
    defaultMessage: '商品分类',
  },
  location: {
    id: 'cwm.module.common.location',
    defaultMessage: '库位',
  },
  inboundDate: {
    id: 'cwm.module.common.inbound.date',
    defaultMessage: '入库日期',
  },
  createdDate: {
    id: 'cwm.module.common.created.date',
    defaultMessage: '创建时间',
  },
  stockingQty: {
    id: 'cwm.module.common.stocking.qty',
    defaultMessage: '入库中数量',
  },
  totalQty: {
    id: 'cwm.module.common.total.qty',
    defaultMessage: '库存数量',
  },
  availQty: {
    id: 'cwm.module.common.avail.qty',
    defaultMessage: '可用数量',
  },
  preAllocQty: {
    id: 'cwm.module.common.pre.alloc.qty',
    defaultMessage: '预配数量',
  },
  allocQty: {
    id: 'cwm.module.common.alloc.qty',
    defaultMessage: '分配数量',
  },
  frozenQty: {
    id: 'cwm.module.common.frozen.qty',
    defaultMessage: '冻结数量',
  },
  bondedQty: {
    id: 'cwm.module.common.bonded.qty',
    defaultMessage: '保税数量',
  },
  nonbondedQty: {
    id: 'cwm.module.common.nonbonded.qty',
    defaultMessage: '非保税数量',
  },
  outboundQty: {
    id: 'cwm.module.common.outbound.qty',
    defaultMessage: '出库数量',
  },
  attrib1: {
    id: 'cwm.module.common.attrib1',
    defaultMessage: '扩展属性1',
  },
  attrib2: {
    id: 'cwm.module.common.attrib2',
    defaultMessage: '扩展属性2',
  },
  attrib3: {
    id: 'cwm.module.common.attrib3',
    defaultMessage: '扩展属性3',
  },
  attrib4: {
    id: 'cwm.module.common.attrib4',
    defaultMessage: '扩展属性4',
  },
  attrib5: {
    id: 'cwm.module.common.attrib5',
    defaultMessage: '扩展属性5',
  },
  attrib6: {
    id: 'cwm.module.common.attrib6',
    defaultMessage: '扩展属性6',
  },
  attrib7: {
    id: 'cwm.module.common.attrib7',
    defaultMessage: '扩展属性7',
  },
  attrib8: {
    id: 'cwm.module.common.attrib8',
    defaultMessage: '扩展属性8',
  },
  grossWeight: {
    id: 'cwm.module.common.gross.weight',
    defaultMessage: '毛重',
  },
  cbm: {
    id: 'cwm.module.common.cbm',
    defaultMessage: '体积',
  },
  traceId: {
    id: 'cwm.module.common.trace.id',
    defaultMessage: '追踪ID',
  },
  asnCustOrderNo: {
    id: 'cwm.shipping.detail.asnCustOrderNo',
    defaultMessage: '入库订单追踪号',
  },
  billLadingNo: {
    id: 'cwm.module.common.bill.ladingno',
    defaultMessage: '提运单号',
  },
  billLadingMawb: {
    id: 'cwm.module.common.bill.lading.mawb',
    defaultMessage: '主运单号',
  },
  billLadingHawb: {
    id: 'cwm.module.common.bill.lading.hawb',
    defaultMessage: '分运单号',
  },
  poNo: {
    id: 'cwm.module.common.po.no',
    defaultMessage: '采购订单号',
  },
  invoiceNo: {
    id: 'cwm.module.common.invoice.no',
    defaultMessage: '发票号',
  },
  asnNo: {
    id: 'cwm.module.common.asn.no',
    defaultMessage: 'ASN编号',
  },
  soNo: {
    id: 'cwm.module.common.so.no',
    defaultMessage: 'SO编号',
  },
  lotNo: {
    id: 'cwm.module.common.lot.no',
    defaultMessage: '批次号',
  },
  serialNo: {
    id: 'cwm.module.common.serial.no',
    defaultMessage: '序列号',
  },
  virtualWhse: {
    id: 'cwm.module.common.virtual.whse',
    defaultMessage: '库别',
  },
  supplierName: {
    id: 'cwm.module.common.supplier.name',
    defaultMessage: '供货商',
  },
  bonded: {
    id: 'cwm.module.common.bonded',
    defaultMessage: '保税',
  },
  portion: {
    id: 'cwm.module.common.portion',
    defaultMessage: '分拨',
  },
  damageLevel: {
    id: 'cwm.module.common.damage.level',
    defaultMessage: '包装情况',
  },
  expiryDate: {
    id: 'cwm.module.common.expiry.date',
    defaultMessage: '失效日期',
  },
  ftzEntNo: {
    id: 'cwm.module.common.ftz.ent.no',
    defaultMessage: '保税入库单号',
  },
  cusDeclNo: {
    id: 'cwm.module.common.cus.decl.no',
    defaultMessage: '报关单号',
  },
  ftzEntryId: {
    id: 'cwm.module.common.ftz.entry.id',
    defaultMessage: '入库明细ID',
  },
  inquiry: {
    id: 'cwm.module.common.inquiry',
    defaultMessage: '查询',
  },
  bondType: {
    id: 'cwm.module.common.bond.type',
    defaultMessage: '保税类型',
  },
  regStatus: {
    id: 'cwm.module.common.reg.status',
    defaultMessage: '备案状态',
  },
  inboundStatus: {
    id: 'cwm.module.common.inbound.status',
    defaultMessage: '入库状态',
  },
  outboundStatus: {
    id: 'cwm.module.common.outbound.status',
    defaultMessage: '出库状态',
  },
  transactionType: {
    id: 'cwm.module.stock.transactionType',
    defaultMessage: '事务',
  },
  transactionQty: {
    id: 'cwm.module.stock.transactionQty',
    defaultMessage: '变动数量',
  },
  transactionTimestamp: {
    id: 'cwm.module.stock.transactionTimestamp',
    defaultMessage: '事务时间',
  },
  divertTraceId: {
    id: 'cwm.module.stock.divertTraceId',
    defaultMessage: '转入追踪ID',
  },
  refOrderNo: {
    id: 'cwm.module.stock.refOrderNo',
    defaultMessage: '客户/系统单号',
  },
  reason: {
    id: 'cwm.module.stock.reason',
    defaultMessage: '原因',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
export const formatGlobalMsg = formati18n(globalMessages);
