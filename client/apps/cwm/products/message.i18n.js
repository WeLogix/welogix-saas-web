import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  products: {
    id: 'cwm.products',
    defaultMessage: '货品',
  },
  productsSku: {
    id: 'cwm.products.sku',
    defaultMessage: 'SKU管理',
  },
  syncTradeItems: {
    id: 'cwm.products.sku.sync.tradeitems',
    defaultMessage: '同步商品归类库',
  },
  productImport: {
    id: 'cwm.products.import',
    defaultMessage: '导入',
  },
  productExport: {
    id: 'cwm.products.export',
    defaultMessage: '导出',
  },
  save: {
    id: 'cwm.products.save',
    defaultMessage: '保存',
  },
  cancel: {
    id: 'cwm.products.cancel',
    defaultMessage: '取消',
  },
  createSKU: {
    id: 'cwm.products.sku.create',
    defaultMessage: '新建SKU',
  },
  productSearchPlaceholder: {
    id: 'cwm.products.search.placeholder',
    defaultMessage: 'SKU或商品货号',
  },
  ownerSearch: {
    id: 'cwm.products.owner.search',
    defaultMessage: '货主名称或编号',
  },
  productNo: {
    id: 'cwm.products.productno',
    defaultMessage: '货号',
  },
  hscode: {
    id: 'cwm.products.hscode',
    defaultMessage: '商品编号',
  },
  descCN: {
    id: 'cwm.products.sku.cn.desc',
    defaultMessage: '中文品名',
  },
  descEN: {
    id: 'cwm.products.sku.en.desc',
    defaultMessage: '英文品名',
  },
  category: {
    id: 'cwm.products.product.category',
    defaultMessage: '商品分类',
  },
  measureUnit: {
    id: 'cwm.products.product.measure.unit',
    defaultMessage: '计量单位',
  },
  unitPrice: {
    id: 'cwm.products.product.unit.price',
    defaultMessage: '单价',
  },
  currency: {
    id: 'cwm.products.product.currency',
    defaultMessage: '币制',
  },
  alias1: {
    id: 'cwm.products.product.alias1',
    defaultMessage: '别名1',
  },
  alias2: {
    id: 'cwm.products.product.alias2',
    defaultMessage: '别名2',
  },
  alias3: {
    id: 'cwm.products.product.alias3',
    defaultMessage: '别名3',
  },
  skuPack: {
    id: 'cwm.products.sku.pack',
    defaultMessage: 'SKU包装',
  },
  perSKUQty: {
    id: 'cwm.products.sku.per.qty',
    defaultMessage: '每SKU包装数量',
  },
  length: {
    id: 'cwm.products.sku.length',
    defaultMessage: '长',
  },
  width: {
    id: 'cwm.products.sku.width',
    defaultMessage: '宽',
  },
  height: {
    id: 'cwm.products.sku.height',
    defaultMessage: '高',
  },
  unitCBM: {
    id: 'cwm.products.sku.unit.cbm',
    defaultMessage: '体积',
  },
  grossWeight: {
    id: 'cwm.products.sku.gross.weight',
    defaultMessage: '毛重',
  },
  netWeight: {
    id: 'cwm.products.sku.net.weight',
    defaultMessage: '净重',
  },
  tareWeight: {
    id: 'cwm.products.sku.tare.weight',
    defaultMessage: '皮重',
  },
  packingCode: {
    id: 'cwm.products.sku.packingCode',
    defaultMessage: '包装代码',
  },
  innerPackQty: {
    id: 'cwm.products.sku.innerPackQty',
    defaultMessage: '内包装量',
  },
  boxPackQty: {
    id: 'cwm.products.sku.boxPackQty',
    defaultMessage: '装箱量',
  },
  palletBoxQty: {
    id: 'cwm.products.sku.palletBoxQty',
    defaultMessage: '码盘量',
  },
  traceConvey: {
    id: 'cwm.products.sku.traceConvey',
    defaultMessage: '库内追踪',
  },
  defaultInboundConvey: {
    id: 'cwm.products.sku.defaultInboundConvey',
    defaultMessage: '默认上架包装',
  },
  defaultReplenishConvey: {
    id: 'cwm.products.sku.defaultReplenishConvey',
    defaultMessage: '默认补货包装',
  },
  defaultOutboundConvey: {
    id: 'cwm.products.sku.defaultOutboundConvey',
    defaultMessage: '默认发货包装',
  },
  defaultAsnTagUnit: {
    id: 'cwm.products.sku.defaultAsnTagUnit',
    defaultMessage: '默认ASN收货单位',
  },
  defaultSoTagUnit: {
    id: 'cwm.products.sku.defaultSoTagUnit',
    defaultMessage: '默认SO发货单位',
  },
  lastModifiedDate: {
    id: 'cwm.products.last.modified',
    defaultMessage: '最后更新时间',
  },
  createdDate: {
    id: 'cwm.products.created.date',
    defaultMessage: '创建时间',
  },
  opCol: {
    id: 'cwm.products.product.opCol',
    defaultMessage: '操作',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
