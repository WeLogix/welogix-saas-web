import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../../message.i18n';

const messages = defineMessages({
  copOrSeqNo: {
    id: 'cwm.blbook.cop.or.seq.no',
    defaultMessage: '内部/统一编号',
  },
  copManualNo: {
    id: 'cwm.blbook.cop.manual.no',
    defaultMessage: '企业内部编号',
  },
  blbookNo: {
    id: 'cwm.blbook.blbook.no',
    defaultMessage: '账册编号',
  },
  blbookType: {
    id: 'cwm.blbook.blbook.type',
    defaultMessage: '账册类型',
  },
  blbookStatus: {
    id: 'cwm.blbook.blbook.status',
    defaultMessage: '账册状态',
  },
  ownerName: {
    id: 'cwm.blbook.owner.name',
    defaultMessage: '企业名称',
  },
  blbookExpirayDate: {
    id: 'cwm.blbook.blbook.expiray.date',
    defaultMessage: '有效结束日期',
  },
  revoke: {
    id: 'cwm.blbook.revoke',
    defaultMessage: '撤销变更',
  },
  viewSentMsg: {
    id: 'cwm.blbook.view.sent.msg',
    defaultMessage: '查看发送报文',
  },
  viewRecMsg: {
    id: 'cwm.blbook.view.rec.msg',
    defaultMessage: '查看回执报文',
  },
  pendinng: {
    id: 'cwm.blbook.pendinng',
    defaultMessage: '未备案',
  },
  declaring: {
    id: 'cwm.blbook.declaring',
    defaultMessage: '申报中',
  },
  approved: {
    id: 'cwm.blbook.approved',
    defaultMessage: '审核通过',
  },
  revising: {
    id: 'cwm.blbook.revising',
    defaultMessage: '变更中',
  },
  searchPlaceholder: {
    id: 'cwm.blbook.search.placeholder',
    defaultMessage: '账册编号/企业名称',
  },
  blbookDetail: {
    id: 'cwm.blbook.blbook.detail',
    defaultMessage: '账册明细',
  },
  blbookHead: {
    id: 'cwm.blbook.blbook.head',
    defaultMessage: '账册表头',
  },
  blbookGoods: {
    id: 'cwm.blbook.blbook.goods',
    defaultMessage: '账册表体',
  },
  confirmCancel: {
    id: 'cwm.blbook.confirm.cancel',
    defaultMessage: '确认取消',
  },
  continueEdit: {
    id: 'cwm.blbook.continue.edit',
    defaultMessage: '继续编辑',
  },
  createBlbook: {
    id: 'cwm.blbook.create.blbook',
    defaultMessage: '新建账册',
  },
  createUnRegistBook: {
    id: 'cwm.blbook.create.unregist.book',
    defaultMessage: '创建未备案账册',
  },
  createRegistBook: {
    id: 'cwm.blbook.create.regist.book',
    defaultMessage: '添加已备案账册',
  },
  preBlbookNo: {
    id: 'cwm.blbook.pre.blbook.no',
    defaultMessage: '预录入统一编号',
  },
  masterCustoms: {
    id: 'cwm.blbook.master.customs',
    defaultMessage: '主管海关',
  },
  kikBlbookNo: {
    id: 'cwm.blbook.kik.blbook.no',
    defaultMessage: '关联账册号',
  },
  owner: {
    id: 'cwm.blbook.operator',
    defaultMessage: '经营单位',
  },
  declarer: {
    id: 'cwm.blbook.declarer',
    defaultMessage: '申报企业',
  },
  cusCode: {
    id: 'cwm.blbook.cus.code',
    defaultMessage: '海关编码',
  },
  sccCode: {
    id: 'cwm.blbook.scc.code',
    defaultMessage: '社会信用代码',
  },
  declarerName: {
    id: 'cwm.blbook.declarer.name',
    defaultMessage: '企业名称',
  },
  declarerCompanyType: {
    id: 'cwm.blbook.declarer.company.type',
    defaultMessage: '申报单位类型',
  },
  declarerType: {
    id: 'cwm.blbook.declarer.type',
    defaultMessage: '申报类型',
  },
  bwlType: {
    id: 'cwm.blbook.bwl.type',
    defaultMessage: '区域场所类别',
  },
  ftzWhseCode: {
    id: 'cwm.blbook.warehouse.ftz.code',
    defaultMessage: '仓库备案代码',
  },
  warehouse: {
    id: 'cwm.blbook.warehouse',
    defaultMessage: '仓库',
  },
  warehouseinfo: {
    id: 'cwm.blbook.warehouse.info',
    defaultMessage: '仓库信息',
  },
  warehouseName: {
    id: 'cwm.blbook.warehouse.name',
    defaultMessage: '仓库名称',
  },
  businessType: {
    id: 'cwm.blbook.business.type',
    defaultMessage: '企业类型',
  },
  warehouseAddress: {
    id: 'cwm.blbook.warehouse.address',
    defaultMessage: '仓库地址',
  },
  warehouseArea: {
    id: 'cwm.blbook.warehouse.area',
    defaultMessage: '仓库面积',
  },
  warehouseVol: {
    id: 'cwm.blbook.warehouse.vol',
    defaultMessage: '仓库容积',
  },
  contact: {
    id: 'cwm.blbook.contact',
    defaultMessage: '联系人',
  },
  userOrgTel: {
    id: 'cwm.blbook.user.org.tel',
    defaultMessage: '联系电话',
  },
  blbookAccounting: {
    id: 'cwm.blbook.blbook.accounting',
    defaultMessage: '记账模式',
  },
  blbookTaxRebate: {
    id: 'cwm.blbook.blbook.tax.rebate',
    defaultMessage: '退税标志',
  },
  blbookDeclDate: {
    id: 'cwm.blbook.blbook.decl.date',
    defaultMessage: '申报日期',
  },
  blbookApprovedDate: {
    id: 'cwm.blbook.blbook.approved.date',
    defaultMessage: '备案批准日期',
  },
  blbookAlterDate: {
    id: 'cwm.blbook.blbook.alter.date',
    defaultMessage: '变更批准日期',
  },
  inputter: {
    id: 'cwm.blbook.inputter',
    defaultMessage: '录入单位',
  },
  inputterCusCode: {
    id: 'cwm.blbook.inputter.cus.code',
    defaultMessage: '录入单位代码',
  },
  inputterSccCode: {
    id: 'cwm.blbook.inputter.scc.code',
    defaultMessage: '录入单位社会信用代码',
  },
  inputterName: {
    id: 'cwm.blbook.inputter.name',
    defaultMessage: '录入单位名称',
  },
  blbookUsage: {
    id: 'cwm.blbook.usage',
    defaultMessage: '账册用途',
  },
  prdtItemNo: {
    id: 'cwm.blbook.prdt.item.no',
    defaultMessage: '备案序号',
  },
  productNo: {
    id: 'cwm.blbook.product.no',
    defaultMessage: '商品货号',
  },
  hscode: {
    id: 'cwm.blbook.hscode',
    defaultMessage: '商品编号',
  },
  ciqcode: {
    id: 'cwm.blbook.ciqcode',
    defaultMessage: '检验检疫编码',
  },
  gName: {
    id: 'cwm.blbook.g.name',
    defaultMessage: '中文品名',
  },
  gModel: {
    id: 'cwm.blbook.g.model',
    defaultMessage: '规格型号',
  },
  country: {
    id: 'cwm.blbook.country',
    defaultMessage: '产销国(地区)',
  },
  gUnit: {
    id: 'cwm.blbook.g.unit',
    defaultMessage: '申报计量单位',
  },
  unit1: {
    id: 'cwm.blbook.unit1',
    defaultMessage: '法定计量单位',
  },
  unit2: {
    id: 'cwm.blbook.unit2',
    defaultMessage: '法二计量单位',
  },
  decPrice: {
    id: 'cwm.blbook.dec.price',
    defaultMessage: '单价',
  },
  currency: {
    id: 'cwm.blbook.currency',
    defaultMessage: '币制',
  },
  blbgInvalid: {
    id: 'cwm.blbook.blbg.invalid',
    defaultMessage: '禁用标志',
  },
  blbgExpirayDate: {
    id: 'cwm.blbook.blbg.expiray.date',
    defaultMessage: '有效日期',
  },
  blbgFreeupDate: {
    id: 'cwm.blbook.blbg.freeup.date',
    defaultMessage: '赠补日期',
  },
  importPanelTitle: {
    id: 'cwm.blbook.import.panel.title',
    defaultMessage: '账册表体数据导入',
  },
  docksearchPlaceholder: {
    id: 'cwm.blbook.dock.search.placeholder',
    defaultMessage: '商品货号/商品编号',
  },
  importUnregConfirm: {
    id: 'cwm.blbook.import.unreg.confirmr',
    defaultMessage: '导入备案确认',
  },
  importUnregBlbookGoods: {
    id: 'cwm.blbook.import.unreg.blbook.goods',
    defaultMessage: '导入未备案项',
  },
  correlateRepo: {
    id: 'cwm.blbook.correlate.repo',
    defaultMessage: '关联物料库',
  },
  unRegSearchPlaceholder: {
    id: 'cwm.blbook.unreg.search.placeholder',
    defaultMessage: '序号/料号/商品编号/品名',
  },
  exportUnregBlbookGoods: {
    id: 'cwm.blbook.export.unreg.blbook.goods',
    defaultMessage: '导出未备案项',
  },
  invtNo: {
    id: 'cwm.blbook.goods.invtno',
    defaultMessage: '记账清单编号',
  },
  invtSeqNo: {
    id: 'cwm.blbook.goods.invt.seqno',
    defaultMessage: '记账清单序号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
