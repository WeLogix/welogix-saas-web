import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  copOrSeqNo: {
    id: 'cwm.sasbl.cop.seq.no',
    defaultMessage: '内部/统一编号',
  },
  copNo: {
    id: 'cwm.sasbl.cop.no',
    defaultMessage: '企业内部编号',
  },
  invtNo: {
    id: 'cwm.sasbl.invt.no',
    defaultMessage: '清单编号',
  },
  passportHead: {
    id: 'cwm.sasbl.passport.head',
    defaultMessage: '核放单表头',
  },
  passportBody: {
    id: 'cwm.sasbl.passport.body',
    defaultMessage: '核放单表体',
  },
  bizApplHead: {
    id: 'cwm.sasbl.bizAppl.head',
    defaultMessage: '业务申报表头',
  },
  bapplStatus: {
    id: 'cwm.sasbl.bizAppl.status',
    defaultMessage: '申报表状态',
  },
  bizApplBody: {
    id: 'cwm.sasbl.bizAppl.body',
    defaultMessage: '业务申报表体',
  },
  passportDetails: {
    id: 'cwm.sasbl.passport.details',
    defaultMessage: '核放单明细',
  },
  bapplClosedDate: {
    id: 'cwm.sasbl.bappl.closed.date',
    defaultMessage: '结案审批日期',
  },
  bizApplDetails: {
    id: 'cwm.sasbl.bizAppl.details',
    defaultMessage: '业务申报表明细',
  },
  passportNo: {
    id: 'cwm.sasbl.passport.no',
    defaultMessage: '核放单编号',
  },
  passportOut: {
    id: 'cwm.sasbl.passport.out',
    defaultMessage: '出区核放单',
  },
  passportIn: {
    id: 'cwm.sasbl.passport.in',
    defaultMessage: '进区核放单',
  },
  newPassport: {
    id: 'cwm.sasbl.passport.new',
    defaultMessage: '新建核放单',
  },
  newBizAppl: {
    id: 'cwm.sasbl.bizAppl.new',
    defaultMessage: '新建业务申报表',
  },
  bizApplOut: {
    id: 'cwm.sasbl.bizAppl.dis.o',
    defaultMessage: '分送出区业务申报表',
  },
  bizApplin: {
    id: 'cwm.sasbl.bizAppl.dis.i',
    defaultMessage: '分送入区业务申报表',
  },
  blbookNo: {
    id: 'cwm.sasbl.blBook.no',
    defaultMessage: '账册编号',
  },
  rltBlbook: {
    id: 'cwm.sasbl.relate.blBook',
    defaultMessage: '关联账册',
  },
  invtStatus: {
    id: 'cwm.sasbl.invt.status',
    defaultMessage: '数据状态',
  },
  verifyFlag: {
    id: 'cwm.sasbl.verify.flag',
    defaultMessage: '核扣标志',
  },
  invtBiztype: {
    id: 'cwm.sasbl.invt.biztype',
    defaultMessage: '清单类型',
  },
  passportUsed: {
    id: 'cwm.sasbl.passport.used',
    defaultMessage: '生成核放单',
  },
  passportBiztype: {
    id: 'cwm.sasbl.passport.biztype',
    defaultMessage: '核放单类型',
  },
  ownerName: {
    id: 'cwm.sasbl.owner.name',
    defaultMessage: '经营单位名称',
  },
  blwb: {
    id: 'cwm.sasbl.wb',
    defaultMessage: '提运单',
  },
  getInFirst: {
    id: 'cwm.sasbl.passport.getInfirst',
    defaultMessage: '先入区后报关',
  },
  lineOneIo: {
    id: 'cwm.sasbl.passport.lineone.io',
    defaultMessage: '一线一体化进出区',
  },
  lineTwoIo: {
    id: 'cwm.sasbl.passport.linetwo.io',
    defaultMessage: '二线进出区',
  },
  notClrIo: {
    id: 'cwm.sasbl.passport.not.clr.io',
    defaultMessage: '非报关进出区',
  },
  checkpointRegCargo: {
    id: 'cwm.sasbl.passport.checkpoint.reg',
    defaultMessage: '卡口登记货物',
  },
  emptyCar: {
    id: 'cwm.sasbl.passport.empty.car',
    defaultMessage: '空车进出区',
  },
  cusdeclFlag: {
    id: 'cwm.sasbl.cusdecl.flag',
    defaultMessage: '报关标志',
  },
  cusdeclType: {
    id: 'cwm.sasbl.cusdecl.type',
    defaultMessage: '报关类型',
  },
  invtDeclDate: {
    id: 'cwm.sasbl.invt.decl.date',
    defaultMessage: '清单申报日期',
  },
  invtListSearchPlaceHolder: {
    id: 'cwm.sasbl.invt.list.search.place.holder',
    defaultMessage: '核注清单号/统一编号/内部编号/订单追踪号',
  },
  bizApplListPlaceHolder: {
    id: 'cwm.sasbl.bizappl.list.search.place.holder',
    defaultMessage: '出库单编号/预录入统一编号/企业内部编号/申报表编号',
  },
  batStockIoSearchPlaceHolder: {
    id: 'cwm.sasbl.batchdecl.list.search.place.holder',
    defaultMessage: '明细货号/Hscode/品名',
  },
  stockIoDetail: {
    id: 'cwm.sasbl.stockio.detail',
    defaultMessage: '出入库单明细',
  },
  swClientList: {
    id: 'cwm.sasbl.sw.client',
    defaultMessage: '导入客户端',
  },
  swSendFlag: {
    id: 'cwm.sasbl.sw.send.flag',
    defaultMessage: '发送方式',
  },
  sending: {
    id: 'cwm.sasbl.reg.sending',
    defaultMessage: '发送中',
  },
  sendFail: {
    id: 'cwm.sasbl.reg.send.fail',
    defaultMessage: '发送失败',
  },
  sendSuccess: {
    id: 'cwm.sasbl.reg.send.success',
    defaultMessage: '发送成功',
  },
  recvSuccess: {
    id: 'cwm.sasbl.reg.recv.success',
    defaultMessage: '接收成功',
  },
  unknownStatus: {
    id: 'cwm.sasbl.reg.unknown.status',
    defaultMessage: '未知状态',
  },
  statusCode: {
    id: 'cwm.sasbl.reg.status.code',
    defaultMessage: '状态代码',
  },
  sendCode: {
    id: 'cwm.sasbl.reg.send.code',
    defaultMessage: '发送代码',
  },
  pendinng: {
    id: 'cwm.sasbl.pendinng',
    defaultMessage: '未申报',
  },
  revising: {
    id: 'cwm.sasbl.revising',
    defaultMessage: '变更中',
  },
  declaring: {
    id: 'cwm.sasbl.declaring',
    defaultMessage: '申报中',
  },
  closed: {
    id: 'cwm.sasbl.closed',
    defaultMessage: '已结案',
  },
  approved: {
    id: 'cwm.sasbl.approved',
    defaultMessage: '审批通过',
  },
  canceled: {
    id: 'cwm.sasbl.canceled',
    defaultMessage: '已作废',
  },
  batched: {
    id: 'cwm.sasbl.batched',
    defaultMessage: '已集报',
  },
  decType: {
    id: 'cwm.sasbl.dec.type',
    defaultMessage: '申报类型',
  },
  regDecl: {
    id: 'cwm.sasbl.reg.decl',
    defaultMessage: '备案申报',
  },
  delDecl: {
    id: 'cwm.sasbl.del.decl',
    defaultMessage: '作废申报',
  },
  chgDecl: {
    id: 'cwm.sasbl.chg.decl',
    defaultMessage: '变更申报',
  },
  clsDecl: {
    id: 'cwm.sasbl.cls.decl',
    defaultMessage: '结案申报',
  },
  declResult: {
    id: 'cwm.sasbl.decl.result',
    defaultMessage: '申报回执',
  },
  invtReg: {
    id: 'cwm.sasbl.invt.reg',
    defaultMessage: '核注清单',
  },
  passport: {
    id: 'cwm.sasbl.passport',
    defaultMessage: '核放单',
  },
  bizAppl: {
    id: 'cwm.sasbl.biz.appl',
    defaultMessage: '业务申报表',
  },
  invitDetail: {
    id: 'cwm.sasbl.invit.detail',
    defaultMessage: '核注清单明细',
  },
  newBatchDecl: {
    id: 'cwm.sasbl.batchD.new',
    defaultMessage: '新建集报清单',
  },
  batchDecl: {
    id: 'cwm.sasbl.batchD.decl',
    defaultMessage: '集中报关',
  },
  batDetail: {
    id: 'cwm.sasbl.batchD.detail',
    defaultMessage: '集报清单明细',
  },
  batchNo: {
    id: 'cwm.sasbl.batchD.no',
    defaultMessage: '集报清单编号',
  },
  stockioCount: {
    id: 'cwm.sasbl.stockio.count',
    defaultMessage: '出入库单数量',
  },
  confirmCancel: {
    id: 'cwm.sasbl.confirm.cancel',
    defaultMessage: '确认取消？',
  },
  invtHead: {
    id: 'cwm.sasbl.invt.head',
    defaultMessage: '核注清单表头',
  },
  invtBody: {
    id: 'cwm.sasbl.invt.body',
    defaultMessage: '核注清单表体',
  },
  preSasblSeqno: {
    id: 'cwm.sasbl.pre.sasbl.seqno',
    defaultMessage: '预录入统一编号',
  },
  owner: {
    id: 'cwm.sasbl.owner',
    defaultMessage: '经营单位',
  },
  selectOwnerPlease: {
    id: 'cwm.sasbl.select.owner',
    defaultMessage: '请选择经营单位',
  },
  typeInApplyNoPlease: {
    id: 'cwm.sasbl.type.applyno',
    defaultMessage: '请输入申报表编号',
  },
  manufcr: {
    id: 'cwm.sasbl.manufcr',
    defaultMessage: '加工单位',
  },
  declarer: {
    id: 'cwm.sasbl.declarer',
    defaultMessage: '申报单位',
  },
  typing: {
    id: 'cwm.sasbl.typing',
    defaultMessage: '录入单位',
  },
  carNo: {
    id: 'cwm.sasbl.car.no',
    defaultMessage: '承运车牌号/电子车牌',
  },
  carWeight: {
    id: 'cwm.sasbl.car.weight',
    defaultMessage: '车自重',
  },
  carFrameNo: {
    id: 'cwm.sasbl.car.frame',
    defaultMessage: '车架号',
  },
  carFrameWeight: {
    id: 'cwm.sasbl.car.frame.weight',
    defaultMessage: '车架重',
  },
  containerNo: {
    id: 'cwm.sasbl.container.no',
    defaultMessage: '集装箱号',
  },
  containerType: {
    id: 'cwm.sasbl.container.type',
    defaultMessage: '集装箱型',
  },
  containerWeight: {
    id: 'cwm.sasbl.container.weight',
    defaultMessage: '集装箱重',
  },
  prdgoodsMark: {
    id: 'cwm.sasbl.prd.goods,mark',
    defaultMessage: '底账料件成品标志',
  },
  baPrdgoodsMark: {
    id: 'cwm.sasbl.ba.prd.goods,mark',
    defaultMessage: '申报表料件成品标志',
  },
  prdItemNo: {
    id: 'cwm.sasbl.prd.item,no',
    defaultMessage: '底账商品序号',
  },
  typingDate: {
    id: 'cwm.sasbl.typing.date',
    defaultMessage: '录入日期',
  },
  tradeMode: {
    id: 'cwm.sasbl.trade.mode',
    defaultMessage: '监管方式',
  },
  trafMode: {
    id: 'cwm.sasbl.traf.mode',
    defaultMessage: '运输方式',
  },
  iEPort: {
    id: 'cwm.sasbl.i.e.Port',
    defaultMessage: '进出口口岸',
  },
  masterCustoms: {
    id: 'cwm.sasbl.master.customs',
    defaultMessage: '主管海关',
  },
  deptDestCountry: {
    id: 'cwm.sasbl.dept.dest.country',
    defaultMessage: '启运抵运国',
  },
  listType: {
    id: 'cwm.sasbl.list.type',
    defaultMessage: '流转类型',
  },
  invtIochkptStucd: {
    id: 'cwm.sasbl.invt.iochkpt.stucd',
    defaultMessage: '清单进出卡口状态',
  },
  entryType: {
    id: 'cwm.sasbl.entry.type',
    defaultMessage: '报关单类型',
  },
  sasblApplyNo: {
    id: 'cwm.sasbl.apply.no',
    defaultMessage: '申报表编号',
  },
  applySeqNo: {
    id: 'cwm.sasbl.apply.seq.no',
    defaultMessage: '申报表序号',
  },
  bapplRevisedDate: {
    id: 'cwm.sasbl.bappl.revised.date',
    defaultMessage: '变更审批日期',
  },
  bapplApprovedDate: {
    id: 'cwm.sasbl.bappl.approved.date',
    defaultMessage: '备案审批日期',
  },
  bapplValidDate: {
    id: 'cwm.sasbl.sasbl.valid.date',
    defaultMessage: '申报表有效期',
  },
  sasblDectype: {
    id: 'cwm.sasbl.dectype',
    defaultMessage: '申报类型',
  },
  entryStatus: {
    id: 'cwm.sasbl.entry.status',
    defaultMessage: '报关状态',
  },
  bdStatus: {
    id: 'cwm.sasbl.batch.status',
    defaultMessage: '集报状态',
  },
  delgNo: {
    id: 'cwm.sasbl.delg.no',
    defaultMessage: '对应委托编号',
  },
  rltDelgNo: {
    id: 'cwm.sasbl.rlt.delg.no',
    defaultMessage: '关联委托编号',
  },
  entryNo: {
    id: 'cwm.sasbl.entry.no',
    defaultMessage: '对应报关单号',
  },
  corrEntryDeclarer: {
    id: 'cwm.sasbl.corr.entry.declarer',
    defaultMessage: '对应报关单申报单位',
  },
  entryDeclDate: {
    id: 'cwm.sasbl.entry.decl.date',
    defaultMessage: '报关单申报日期',
  },
  rltEntryNo: {
    id: 'cwm.sasbl.rel.entry.no',
    defaultMessage: '关联报关单号',
  },
  rltEntryDeclarer: {
    id: 'cwm.sasbl.rlt.entry.declarer',
    defaultMessage: '关联报关单申报单位',
  },
  rltEntryReceive: {
    id: 'cwm.sasbl.rlt.entry.receive',
    defaultMessage: '关联报关单收发货人',
  },
  rltEntryBizopEtpsProd: {
    id: 'cwm.sasbl.rlt.entry.bizop.etps.prod',
    defaultMessage: '关联报关单生产销售单位',
  },
  rltEntryBizopEtpsConsum: {
    id: 'cwm.sasbl.rlt.entry.bizop.etps.consum',
    defaultMessage: '关联报关单消费使用单位',
  },
  rltInvtNo: {
    id: 'cwm.sasbl.rlt.invt.no',
    defaultMessage: '关联清单编号',
  },
  rltPutrecNo: {
    id: 'cwm.sasbl.rlt.putrec.no',
    defaultMessage: '关联手(账)册备案号',
  },
  goodsSeqno: {
    id: 'cwm.sasbl.goods.seqno',
    defaultMessage: '商品序号',
  },
  goodsMark: {
    id: 'cwm.sasbl.goods.mark',
    defaultMessage: '商品标记',
  },
  goodsRemark: {
    id: 'cwm.sasbl.goods.remark',
    defaultMessage: '商品备注',
  },
  seqNo: {
    id: 'cwm.sasbl.seq.no',
    defaultMessage: '序号',
  },
  prdtItemNo: {
    id: 'cwm.sasbl.prdt.item.no',
    defaultMessage: '备案序号',
  },
  sgdProductNo: {
    id: 'cwm.sasbl.sgd.product.no',
    defaultMessage: '商品料号',
  },
  entryGoodsSeqno: {
    id: 'cwm.sasbl.sgd.entry.seqno',
    defaultMessage: '报关单商品序号',
  },
  sgdHscode: {
    id: 'cwm.sasbl.sgd.hscode',
    defaultMessage: '商品编码',
  },
  sgdName: {
    id: 'cwm.sasbl.sgd.name',
    defaultMessage: '商品名称',
  },
  sgdModel: {
    id: 'cwm.sasbl.sgd.model',
    defaultMessage: '规格型号',
  },
  sgdGUnit: {
    id: 'cwm.sasbl.sgd.g.unit',
    defaultMessage: '申报计量单位',
  },
  sgdUnit1: {
    id: 'cwm.sasbl.sgd.unit1',
    defaultMessage: '法一计量单位',
  },
  sgdUnit2: {
    id: 'cwm.sasbl.sgd.unit2',
    defaultMessage: '法二计量单位',
  },
  sgdOrigCountry: {
    id: 'cwm.sasbl.sgd.orig.country',
    defaultMessage: '原产国/地区',
  },
  sgdDestCountry: {
    id: 'cwm.sasbl.sgd.dest.country',
    defaultMessage: '最终目的国/地区',
  },
  sgdAmount: {
    id: 'cwm.sasbl.sgd.sgd.amount',
    defaultMessage: '申报总价',
  },
  sgdDecPrice: {
    id: 'cwm.sasbl.sgd.dec.price',
    defaultMessage: '申报单价',
  },
  sgdCurrency: {
    id: 'cwm.sasbl.sgd.currency',
    defaultMessage: '币制',
  },
  sgdQty: {
    id: 'cwm.sasbl.sgd.qty',
    defaultMessage: '数量',
  },
  sgdQty1: {
    id: 'cwm.sasbl.sgd.qty1',
    defaultMessage: '法一数量',
  },
  sgdQty2: {
    id: 'cwm.sasbl.sgd.qty2',
    defaultMessage: '法二数量',
  },
  sgdGGty: {
    id: 'cwm.sasbl.sgd.g.gty',
    defaultMessage: '申报数量',
  },
  sgdGrosswt: {
    id: 'cwm.sasbl.sgd.grosswt',
    defaultMessage: '毛重',
  },
  count: {
    id: 'cwm.supervision.count',
    defaultMessage: '数量',
  },
  sgdNetwt: {
    id: 'cwm.sasbl.sgd.netwt',
    defaultMessage: '净重',
  },
  sgdUseTo: {
    id: 'cwm.sasbl.sgd.use.to',
    defaultMessage: '用途代码',
  },
  invtBodyGoodsDetail: {
    id: 'cwm.sasbl.invt.body.goods.detail',
    defaultMessage: '核注清单表体详情',
  },
  editBodyGoodsDetail: {
    id: 'cwm.sasbl.edit.body.goods.detail',
    defaultMessage: '编辑表体明细',
  },
  rltGoodsSeqno: {
    id: 'cwm.sasbl.rlt.goods.seqno',
    defaultMessage: '关联商品序号',
  },
  stockNo: {
    id: 'cwm.sasbl.stock.no',
    defaultMessage: '出入库单编号',
  },
  viewMsg: {
    id: 'cwm.sasbl.view.msg',
    defaultMessage: '查看回执',
  },
  cancelled: {
    id: 'cwm.sasbl.cancelled',
    defaultMessage: '作废申报',
  },
  batListSearchPlaceHolder: {
    id: 'cwm.sasbl.batchlist.search.placeholder',
    defaultMessage: '核注清单编号/报关单号',
  },
  stockSearchPlaceHolder: {
    id: 'cwm.sasbl.stock.search.placeholder',
    defaultMessage: '出入库单号/统一编号/内部编号/申报表编号',
  },
  cosmtnStockOut: {
    id: 'cwm.sasbl.cosmtn.stock.out',
    defaultMessage: '维修出库单',
  },
  chooseStockIO: {
    id: 'cwm.sasbl.choose.stockio',
    defaultMessage: '选择出入库单',
  },
  stockIO: {
    id: 'cwm.sasbl.stockio',
    defaultMessage: '出入库单',
  },
  stockHead: {
    id: 'cwm.sasbl.stock.head',
    defaultMessage: '出入库单表头',
  },
  stockBody: {
    id: 'cwm.sasbl.stock.body',
    defaultMessage: '出入库单表体',
  },
  stockIoflag: {
    id: 'cwm.sasbl.stock.ioflag',
    defaultMessage: '出入库单类型',
  },
  ioflag: {
    id: 'cwm.sasbl.ioflag',
    defaultMessage: '进出标志',
  },
  bindType: {
    id: 'cwm.sasbl.bind.type',
    defaultMessage: '绑定类型',
  },
  areaOwnerName: {
    id: 'cwm.sasbl.area.owner.name',
    defaultMessage: '区内企业名称',
  },
  exhibitionPlace: {
    id: 'cwm.sasbl.area.exhibition.place',
    defaultMessage: '展示地',
  },
  areaOwner: {
    id: 'cwm.sasbl.area.owner',
    defaultMessage: '区内企业',
  },
  outAreaOwner: {
    id: 'cwm.sasbl.out.area.owner',
    defaultMessage: '区外企业',
  },
  outAreaBlBookNo: {
    id: 'cwm.sasbl.out.area.blbook.no',
    defaultMessage: '区外账册号',
  },
  cashDepositNo: {
    id: 'cwm.sasbl.out.area.cashdeposit.no',
    defaultMessage: '保证金征收编号',
  },
  rltRegNo: {
    id: 'cwm.sasbl.relate.regno',
    defaultMessage: '关联单证编号',
  },
  rltGoodsNo: {
    id: 'cwm.sasbl.relate.goods.no',
    defaultMessage: '关联单证商品序号',
  },
  licenceNo: {
    id: 'cwm.sasbl.licence.no',
    defaultMessage: '许可证编号',
  },
  licenceDate: {
    id: 'cwm.sasbl.licence.date',
    defaultMessage: '许可证有效期',
  },
  passportPrenoList: {
    id: 'cwm.sasbl.passport.preno.list',
    defaultMessage: '核放单预录入编号',
  },
  bizApplPrenoList: {
    id: 'cwm.sasbl.bizAppl.preno.list',
    defaultMessage: '申报表预录入编号',
  },
  checkPointPassed: {
    id: 'cwm.sasbl.passport.passed',
    defaultMessage: '是否过卡',
  },
  oneCarManyOrders: {
    id: 'cwm.sasbl.passport.onecar.orders',
    defaultMessage: '一车多票',
  },
  oneCarOneOrders: {
    id: 'cwm.sasbl.passport.onecar.order',
    defaultMessage: '一票一车',
  },
  manyCarsOneOrders: {
    id: 'cwm.sasbl.passport.cars.orders',
    defaultMessage: '一票多车',
  },
  passListPlaceHolder: {
    id: 'cwm.sasbl.passport.list.placeholder',
    defaultMessage: '预录入编号/企业内部编号/区内账册编号',
  },
  centerDeclarerFlag: {
    id: 'cwm.sasbl.center.declarer.flag',
    defaultMessage: '生成集报标志',
  },
  modifyMarkcd: {
    id: 'cwm.sasbl.center.modify.markcd',
    defaultMessage: '修改标志',
  },
  declDate: {
    id: 'cwm.sasbl.decl.date',
    defaultMessage: '申报日期',
  },
  stockBiztype: {
    id: 'cwm.sasbl.stock.biztype',
    defaultMessage: '业务类型',
  },
  InvtregNo: {
    id: 'cwm.sasbl.invtreg.no',
    defaultMessage: '核注清单编号',
  },
  rltInvtregNo: {
    id: 'cwm.sasbl.rlt.invtreg.no',
    defaultMessage: '关联核注清单编号',
  },
  rltStockioNo: {
    id: 'cwm.sasbl.rlt.stockio.no',
    defaultMessage: '关联出入库单编号',
  },
  sioPieces: {
    id: 'cwm.sasbl.sio.pieces',
    defaultMessage: '件数',
  },
  sioWrapType: {
    id: 'cwm.sasbl.sio.wrap.type',
    defaultMessage: '包装',
  },
  sioNetwt: {
    id: 'cwm.sasbl.sio.netwt',
    defaultMessage: '净重',
  },
  sioGrosswt: {
    id: 'cwm.sasbl.sio.grosswt',
    defaultMessage: '毛重',
  },
  sioReplaceMark: {
    id: 'cwm.sasbl.sio.replace.mark',
    defaultMessage: '退货单标志',
  },
  declarerPerson: {
    id: 'cwm.sasbl.declarer.person',
    defaultMessage: '申请人',
  },
  approvedDate: {
    id: 'cwm.sasbl.approved.date',
    defaultMessage: '审批日期',
  },
  undelg: {
    id: 'cwm.sasbl.undelg',
    defaultMessage: '未委托',
  },
  delged: {
    id: 'cwm.sasbl.delged',
    defaultMessage: '已委托',
  },
  manifested: {
    id: 'cwm.sasbl.manifested',
    defaultMessage: '已生成建议书',
  },
  declared: {
    id: 'cwm.sasbl.declared',
    defaultMessage: '已申报',
  },
  released: {
    id: 'cwm.sasbl.released',
    defaultMessage: '已放行',
  },
  sasIn: {
    id: 'cwm.sasbl.in',
    defaultMessage: '进区',
  },
  sasOut: {
    id: 'cwm.sasbl.out',
    defaultMessage: '出区',
  },
  bndinvt: {
    id: 'cwm.sasbl.bndinvt',
    defaultMessage: '保税库存平衡表',
  },
  bndinvtSearchPlaceHolder: {
    id: 'cwm.sasbl.bndinvt.search.placeHolder',
    defaultMessage: '料号/商品编码/品名',
  },
  unitPcs: {
    id: 'cwm.sasbl.unitPcs',
    defaultMessage: '个数单位',
  },
  increaseQty: {
    id: 'cwm.sasbl.increase.qty',
    defaultMessage: '核增数量',
  },
  decreaseQty: {
    id: 'cwm.sasbl.decrease.qty',
    defaultMessage: '核减数量',
  },
  inUnCountQty: {
    id: 'cwm.sasbl.in.un.count.qty',
    defaultMessage: '进区未核注数量',
  },
  outUnCountQty: {
    id: 'cwm.sasbl.out.un.count.qty',
    defaultMessage: '出区未核注数量',
  },
  idealInventory: {
    id: 'cwm.sasbl.ideal.inventory',
    defaultMessage: '理论库存',
  },
  factInventory: {
    id: 'cwm.sasbl.fact.inventory',
    defaultMessage: '实际库存',
  },
  abnormalQty: {
    id: 'cwm.sasbl.abnormal.qty',
    defaultMessage: '异常数量',
  },
  sgdWtFactor: {
    id: 'cwm.sasbl.sgd.wt.factor',
    defaultMessage: '重量比例因子',
  },
  sgdFactor1: {
    id: 'cwm.sasbl.sgd.factor1',
    defaultMessage: '第一比例因子',
  },
  sgdFactor2: {
    id: 'cwm.sasbl.sgd.factor2',
    defaultMessage: '第二比例因子',
  },
  dutyMode: {
    id: 'cwm.sasbl.duty.mode',
    defaultMessage: '征免方式',
  },
  uconsumptionNo: {
    id: 'cwm.sasbl.uconsumption.no',
    defaultMessage: '单耗版本号',
  },
  viewSentMsg: {
    id: 'cwm.sasbl.sent.msg',
    defaultMessage: '查看发送报文',
  },
  viewRecMsg: {
    id: 'cwm.sasbl.rec.msg',
    defaultMessage: '查看回执报文',
  },
  deleteConfirmTitle: {
    id: 'cwm.sasbl.delete.confirm.title',
    defaultMessage: '即将删除',
  },
  disableConfirmTitle: {
    id: 'cwm.supervision.sasbl.delete.confirm.title',
    defaultMessage: '即将作废',
  },
  deleteConfirmContent: {
    id: 'cwm.sasbl.delete.confirm.content',
    defaultMessage: '该操作不可逆! 确认操作后需重新制单！',
  },
  bappl: {
    id: 'cwm.sasbl.type.bappl',
    defaultMessage: '业务申报表',
  },
  pass: {
    id: 'cwm.sasbl.type.pass',
    defaultMessage: '核放单',
  },
  invt: {
    id: 'cwm.sasbl.type.invt',
    defaultMessage: '核注清单',
  },
  stock: {
    id: 'cwm.sasbl.type.stock',
    defaultMessage: '出入库单',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
