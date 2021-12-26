import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';

const messages = defineMessages({
  shftzSup: {
    id: 'cwm.supervision.shftz',
    defaultMessage: '上海自贸区监管',
  },
  ftzBondedEntryReg: {
    id: 'cwm.supervision.shftz.bonded.entry.reg',
    defaultMessage: '进境入库备案',
  },
  ftzRelNormalReg: {
    id: 'cwm.supervision.shftz.release.normal',
    defaultMessage: '普通出库备案',
  },
  ftzNormalDecl: {
    id: 'cwm.supervision.shftz.normal.decl',
    defaultMessage: '普通出库清关',
  },
  ftzRelPortionReg: {
    id: 'cwm.supervision.shftz.release.portion',
    defaultMessage: '分拨出库备案',
  },
  ftzBatchDecl: {
    id: 'cwm.supervision.shftz.batch.decl',
    defaultMessage: '分拨集中报关',
  },
  ftzTransferIn: {
    id: 'cwm.supervision.shftz.transfer.in',
    defaultMessage: '区内移库转入',
  },
  ftzTransferOut: {
    id: 'cwm.supervision.shftz.transfer.out',
    defaultMessage: '区内移库转出',
  },
  ftzTransferSelf: {
    id: 'cwm.supervision.shftz.transfer.self',
    defaultMessage: '本库转让',
  },
  ftzBondedStock: {
    id: 'cwm.supervision.shftz.bonded.stock',
    defaultMessage: '保税库存',
  },
  ftzNonbondedStock: {
    id: 'cwm.supervision.shftz.nonbonded.stock',
    defaultMessage: '非保监管库存',
  },
  ftzCargoReg: {
    id: 'cwm.supervision.shftz.cargo.reg',
    defaultMessage: '分拨货物备案',
  },
  entrySearchPlaceholder: {
    id: 'cms.supervision.shftz.entry.search.placeholder',
    defaultMessage: 'ASN编号/报关单号/进区凭单号',
  },
  releaseSearchPlaceholder: {
    id: 'cms.supervision.shftz.release.search.placeholder',
    defaultMessage: 'SO编号/报关单号/保税出库单号',
  },
  normalSearchPlaceholder: {
    id: 'cms.supervision.shftz.normal.search.placeholder',
    defaultMessage: '委托单号',
  },
  batchSearchPlaceholder: {
    id: 'cms.supervision.shftz.batch.search.placeholder',
    defaultMessage: '报关单号/申请单号',
  },
  ownerSearchPlaceholder: {
    id: 'cms.supervision.shftz.owner.search.placeholder',
    defaultMessage: '货主海关编码/货主名称',
  },
  productSearchPlaceholder: {
    id: 'cms.supervision.shftz.product.cargo.search.placeholder',
    defaultMessage: '产品货号/产品SKU/原始备件号',
  },
  productNo: {
    id: 'cwm.supervision.shftz.cargo.product.no',
    defaultMessage: '产品货号',
  },
  productSku: {
    id: 'cwm.supervision.shftz.cargo.product.sku',
    defaultMessage: '产品SKU',
  },
  ftzCargoNo: {
    id: 'cwm.supervision.shftz.cargo.orig.no',
    defaultMessage: '备案料号',
  },
  mergePrinciple: {
    id: 'cwm.reg.modal.merge.principle',
    defaultMessage: '归并原则',
  },
  splitPrinciple: {
    id: 'cwm.reg.modal.split.principle',
    defaultMessage: '拆分原则',
  },
  conditionalMerge: {
    id: 'cwm.reg.modal.conditional.merge',
    defaultMessage: '条件归并:',
  },
  productCode: {
    id: 'cwm.reg.modal.product.code',
    defaultMessage: '商品货号',
  },
  nonMerge: {
    id: 'cwm.reg.modal.non.merge',
    defaultMessage: '不归并',
  },
  mergeSpecialHscode: {
    id: 'cwm.reg.modal.merge.special.hscode',
    defaultMessage: '特殊商品编号合并',
  },
  mergeSpecialNo: {
    id: 'cwm.reg.modal.merge.special.productno',
    defaultMessage: '特殊商品货号合并',
  },
  specialHsCategory: {
    id: 'cwm.reg.modal.split.special.hscode.category',
    defaultMessage: '特殊商品编号分类:',
  },
  specialHscodeSplit: {
    id: 'cwm.reg.modal.split.special.hscode',
    defaultMessage: '特殊商品编号独立报关',
  },
  currencySplit: {
    id: 'cwm.reg.modal.split.currency',
    defaultMessage: '不同币制独立报关',
  },
  supplierSplit: {
    id: 'cwm.reg.modal.split.supplier',
    defaultMessage: '不同供货商独立报关',
  },
  txnModeSplit: {
    id: 'cwm.reg.modal.split.txnmode',
    defaultMessage: '不同成交方式独立报关',
  },
  byCiqDeclSplit: {
    id: 'cwm.reg.modal.split.ciq.decl',
    defaultMessage: '报检独立报关',
  },
  byApplCertSplit: {
    id: 'cwm.reg.modal.split.appl.cert',
    defaultMessage: '报检出证独立报关',
  },
  searchPlaceholder: {
    id: 'cwm.reg.detail.search.placeholder',
    defaultMessage: '明细货号/HSCode/品名',
  },
  searchBatchDeclPlaceholder: {
    id: 'cwm.reg.batch.decl.search.placeholder',
    defaultMessage: '报关申请单号/报关单号',
  },
  searchRelDeclPlaceholder: {
    id: 'cwm.rel.decl.search.placeholder',
    defaultMessage: '出库单号/SO编号',
  },
  hscode: {
    id: 'cwm.supervision.shftz.cargo.hscode',
    defaultMessage: '商品编号',
  },
  gname: {
    id: 'cwm.supervision.shftz.cargo.gname',
    defaultMessage: '品名',
  },
  unit: {
    id: 'cwm.supervision.shftz.cargo.unit',
    defaultMessage: '单位',
  },
  country: {
    id: 'cwm.supervision.shftz.cargo.country',
    defaultMessage: '原产国',
  },
  currency: {
    id: 'cwm.supervision.shftz.cargo.currency',
    defaultMessage: '币制',
  },
  cargoType: {
    id: 'cwm.supervision.shftz.cargo.type',
    defaultMessage: '分拨类型',
  },
  opCol: {
    id: 'cwm.supervision.shftz.opCol',
    defaultMessage: '操作',
  },
  create: {
    id: 'cwm.supervision.shftz.create',
    defaultMessage: '新建',
  },
  preCiqdecNo: {
    id: 'cwm.supervision.shftz.preCiqdecNo',
    defaultMessage: '预报检核销编号',
  },
  editSuccess: {
    id: 'cwm.supervision.shftz.edit.success',
    defaultMessage: '编辑成功',
  },
  editFail: {
    id: 'cwm.supervision.shftz.edit.fail',
    defaultMessage: '编辑失败',
  },
});

export default messages;
export const formatMsg = formati18n(messages);
