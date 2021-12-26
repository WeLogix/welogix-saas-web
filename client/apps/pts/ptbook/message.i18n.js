import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  createBook: {
    id: 'pts.ptbook.create.book',
    defaultMessage: '创建手/账册',
  },
  createManualBook: {
    id: 'pts.ptbook.create.manual.book',
    defaultMessage: '加工贸易手册',
  },
  createEBook: {
    id: 'pts.ptbook.create.e.book',
    defaultMessage: '加工贸易账册',
  },
  bookSearchPlaceholder: {
    id: 'pts.ptbook.book.search.placeholder',
    defaultMessage: '手/账册编号/内部编号',
  },
  unReg: {
    id: 'pts.ptbook.unReg',
    defaultMessage: '未备案',
  },
  registed: {
    id: 'pts.ptbook.registed',
    defaultMessage: '已备案',
  },
  eBookNo: {
    id: 'pts.ptbook.e.book.no',
    defaultMessage: '账册编号',
  },
  preBlbookNo: {
    id: 'pts.ptbook.pre.blbook.no',
    defaultMessage: '预录入统一编号',
  },
  copManualNo: {
    id: 'pts.ptbook.cop.manual.no',
    defaultMessage: '企业内部编号',
  },
  bookType: {
    id: 'pts.ptbook.book.type',
    defaultMessage: '手/账册类型',
  },
  bookNo: {
    id: 'pts.ptbook.book.no',
    defaultMessage: '手/账册编号',
  },
  manualBookNo: {
    id: 'pts.ptbook.manual.book.no',
    defaultMessage: '手册编号',
  },
  bookStatus: {
    id: 'pts.ptbook.book.status',
    defaultMessage: '备案状态',
  },
  ownerName: {
    id: 'pts.ptbook.owner.name',
    defaultMessage: '经营单位',
  },
  expirayDate: {
    id: 'pts.ptbook.blbook.expiray.date',
    defaultMessage: '结束有效期',
  },
  bookHead: {
    id: 'pts.ptbook.book.head',
    defaultMessage: '表头',
  },
  materails: {
    id: 'pts.ptbook.book.materails',
    defaultMessage: '料件',
  },
  endproduct: {
    id: 'pts.ptbook.book.endproduct',
    defaultMessage: '成品',
  },
  uconsumption: {
    id: 'pts.ptbook.book.uconsumption',
    defaultMessage: '单损耗',
  },
  uconsumExecFlag: {
    id: 'pts.ptbook.book.uconsum.exec.flag',
    defaultMessage: '企业执行标志',
  },
  uconsumExpiryDate: {
    id: 'pts.ptbook.book.uconsum.expiry.date',
    defaultMessage: '单耗有效期',
  },
  modifyTimes: {
    id: 'pts.ptbook.book.modify.times',
    defaultMessage: '变更次数',
  },
  modifyMark: {
    id: 'pts.ptbook.book.modify.mark',
    defaultMessage: '修改标志',
  },
  bondMaterialsRate: {
    id: 'pts.ptbook.book.bond.materials.rate',
    defaultMessage: '保税料件比例',
  },
  uconsumDeclStatus: {
    id: 'pts.ptbook.book.uconsum.decl.status',
    defaultMessage: '单耗申报状态',
  },
  uconsumptionDeclCode: {
    id: 'pts.ptbook.book.uconsumption.decl.code',
    defaultMessage: '单耗申报环节',
  },
  intangibleLossRate: {
    id: 'pts.ptbook.book.intangible.loss.rate',
    defaultMessage: '无形损耗率',
  },
  tangibleLossRate: {
    id: 'pts.ptbook.book.tangible.loss.rate',
    defaultMessage: '有形损耗率',
  },
  netUseQty: {
    id: 'pts.ptbook.book.net.use.qty',
    defaultMessage: '净耗',
  },
  uconsumptionQty: {
    id: 'pts.ptbook.book.uconsumption.qty',
    defaultMessage: '单耗',
  },
  uconsumptionNo: {
    id: 'pts.ptbook.book.uconsumption.no',
    defaultMessage: '单耗版本号',
  },
  materialsName: {
    id: 'pts.ptbook.book.materials.name',
    defaultMessage: '料件商品名称',
  },
  materialsHscode: {
    id: 'pts.ptbook.book.materials.hscode',
    defaultMessage: '料件商品编码',
  },
  materialsProductNo: {
    id: 'pts.ptbook.book.materials.product.no',
    defaultMessage: '料件料号',
  },
  materialsSeqNo: {
    id: 'pts.ptbook.book.materials.seqno',
    defaultMessage: '料件序号',
  },
  endProductName: {
    id: 'pts.ptbook.book.end.product.name',
    defaultMessage: '成品商品名称',
  },
  endProductHscode: {
    id: 'pts.ptbook.book.end.product.hscode',
    defaultMessage: '成品商品编码',
  },
  endProductNo: {
    id: 'pts.ptbook.book.end.product.no',
    defaultMessage: '成品料号',
  },
  endProductSeqNo: {
    id: 'pts.ptbook.book.end.product.seqno',
    defaultMessage: '成品序号',
  },
  goodsSeqno: {
    id: 'pts.ptbook.book.goods.seqno',
    defaultMessage: '序号',
  },
  manufcr: {
    id: 'pts.ptbook.book.manufcr',
    defaultMessage: '加工单位',
  },
  declarer: {
    id: 'pts.ptbook.book.declarer',
    defaultMessage: '申报单位',
  },
  typing: {
    id: 'pts.ptbook.book.typing',
    defaultMessage: '录入单位',
  },
  declarerType: {
    id: 'pts.ptbook.book.declarer.type',
    defaultMessage: '申报类型',
  },
  declarerCompanyType: {
    id: 'pts.ptbook.book.declarer.company.type',
    defaultMessage: '申报单位类型',
  },
  InputDate: {
    id: 'pts.ptbook.book.input.date',
    defaultMessage: '录入日期',
  },
  approvalno: {
    id: 'pts.ptbook.book.approvalno',
    defaultMessage: '批准证编号',
  },
  masterCustoms: {
    id: 'pts.ptbook.book.master.customs',
    defaultMessage: '主管海关',
  },
  declDate: {
    id: 'pts.ptbook.book.decl.date',
    defaultMessage: '申报时间',
  },
  manufcrAreaCode: {
    id: 'pts.ptbook.book.manufcr.area.code',
    defaultMessage: '加工企业地区',
  },
  impContractNo: {
    id: 'pts.ptbook.book.imp.contract.no',
    defaultMessage: '进口合同号',
  },
  expContractNo: {
    id: 'pts.ptbook.book.exp.contract.no',
    defaultMessage: '出口合同号',
  },
  bookTradeMode: {
    id: 'pts.ptbook.book.trade.mode',
    defaultMessage: '监管方式',
  },
  impCurrency: {
    id: 'pts.ptbook.book.imp.currency',
    defaultMessage: '进口币制',
  },
  expCurrency: {
    id: 'pts.ptbook.book.exp.currency',
    defaultMessage: '出口币制',
  },
  remissionMode: {
    id: 'pts.ptbook.book.remission.mode',
    defaultMessage: '征免性质',
  },
  processType: {
    id: 'pts.ptbook.book.process.ype',
    defaultMessage: '加工种类',
  },
  iEPort: {
    id: 'pts.ptbook.book.i.e.port',
    defaultMessage: '进出口岸',
  },
  standBank: {
    id: 'pts.ptbook.book.stand.bank',
    defaultMessage: '台账银行',
  },
  declSource: {
    id: 'pts.ptbook.book.decl.source',
    defaultMessage: '申报来源标志',
  },
  processRatio: {
    id: 'pts.ptbook.book.process.ratio',
    defaultMessage: '加工生产能力',
  },
  pauseIEMark: {
    id: 'pts.ptbook.book.pause.i.e.mark',
    defaultMessage: '暂停进出口标志',
  },
  blbookContact: {
    id: 'pts.ptbook.book.blbook.contact',
    defaultMessage: '联系人',
  },
  blbookTel: {
    id: 'pts.ptbook.book.blbook.tel',
    defaultMessage: '联系电话',
  },
  netwkArchivesNo: {
    id: 'pts.ptbook.book.netwk.archives.no',
    defaultMessage: '联网企业档案库编号',
  },
  impTotalAmount: {
    id: 'pts.ptbook.book.imp.total.amount',
    defaultMessage: '实际进口总金额',
  },
  expTotalAmount: {
    id: 'pts.ptbook.book.exp.total.amount',
    defaultMessage: '实际出口总金额',
  },
  maxTurnoverAmount: {
    id: 'pts.ptbook.book.max.turnover.amount',
    defaultMessage: '最大周转金额',
  },
  materialsCount: {
    id: 'pts.ptbook.book.materials.count',
    defaultMessage: '料件项数',
  },
  endproductCount: {
    id: 'pts.ptbook.book.endproduct.count',
    defaultMessage: '成品项数',
  },
  lastWrittenoffDate: {
    id: 'pts.ptbook.book.last.writtenoff.date',
    defaultMessage: '最近核销日期',
  },
  ucnsVersionMark: {
    id: 'pts.ptbook.book.ucns.version.mark',
    defaultMessage: '单耗版本号控制标志',
  },
  maxImpAmount: {
    id: 'pts.ptbook.book.max.imp.amount',
    defaultMessage: '最大进口金额',
  },
  writtenoffCycle: {
    id: 'pts.ptbook.book.writtenoff.cycle',
    defaultMessage: '核销周期',
  },
  approvedDate: {
    id: 'pts.ptbook.book.approved.date',
    defaultMessage: '备案批准日期',
  },
  alterDate: {
    id: 'pts.ptbook.book.alter.date',
    defaultMessage: '变更批准日期',
  },
  writtenoffType: {
    id: 'pts.ptbook.book.writtenoff.type',
    defaultMessage: '核销类型',
  },
  bookExecFlag: {
    id: 'pts.ptbook.book.exec.flag',
    defaultMessage: '账册执行标志',
  },
  bookUsage: {
    id: 'pts.ptbook.book.usage',
    defaultMessage: '账册用途',
  },
  productNo: {
    id: 'pts.ptbook.product.no',
    defaultMessage: '料号',
  },
  product_no: {
    id: 'pts.ptbook.product_no',
    defaultMessage: '料号',
  },
  hscode: {
    id: 'pts.ptbook.hscode',
    defaultMessage: '商品编码',
  },
  gName: {
    id: 'pts.ptbook.g.name',
    defaultMessage: '商品品名',
  },
  gModel: {
    id: 'pts.ptbook.g.model',
    defaultMessage: '规格',
  },
  gUnit: {
    id: 'pts.ptbook.g.unit',
    defaultMessage: '申报计量单位',
  },
  unit1: {
    id: 'pts.ptbook.unit1',
    defaultMessage: '法定计量单位',
  },
  unit2: {
    id: 'pts.ptbook.unit2',
    defaultMessage: '法定第二计量单位',
  },
  decPrice: {
    id: 'pts.ptbook.dec.price',
    defaultMessage: '申报单价',
  },
  currency: {
    id: 'pts.ptbook.currency',
    defaultMessage: '币制',
  },
  declGQty: {
    id: 'pts.ptbook.decl.g.qty',
    defaultMessage: '申报数量',
  },
  dutyMode: {
    id: 'pts.ptbook.duty.mode',
    defaultMessage: '征免方式',
  },
  declTotalAmount: {
    id: 'pts.ptbook.decl.total.amount',
    defaultMessage: '申报总价',
  },
  productAttr: {
    id: 'pts.ptbook.product.attr',
    defaultMessage: '商品属性',
  },
  country: {
    id: 'pts.ptbook.country',
    defaultMessage: '产销国(地区)',
  },
  qtyControlMark: {
    id: 'pts.ptbook.qty.control.mark',
    defaultMessage: '数量控制标志',
  },
  writtenoffCycleInitQty: {
    id: 'pts.ptbook.writtenoff.cycle.init.qty',
    defaultMessage: '期初数量',
  },
  approveMaxQty: {
    id: 'pts.ptbook.approve.max.qty',
    defaultMessage: '批准最大余数数量',
  },
  uconsumDoubt: {
    id: 'pts.ptbook.uconsum.doubt',
    defaultMessage: '单耗质疑标志',
  },
  consultFlag: {
    id: 'pts.ptbook.consult.flag',
    defaultMessage: '磋商标志',
  },
  customsExecMark: {
    id: 'pts.ptbook.customs.exec.mark',
    defaultMessage: '海关执行标志',
  },
  mainAuxMark: {
    id: 'pts.ptbook.main.aux.mark',
    defaultMessage: '主辅料标记',
  },
  viewSentMsg: {
    id: 'pts.ptbook.sent.msg',
    defaultMessage: '查看发送报文',
  },
  viewRecMsg: {
    id: 'pts.ptbook.rec.msg',
    defaultMessage: '查看回执报文',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
