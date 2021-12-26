import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  dashboard: {
    id: 'cms.module.dashboard',
    defaultMessage: '工作台',
  },
  clearance: {
    id: 'cms.module.group.clearance',
    defaultMessage: '通关',
  },
  delegation: {
    id: 'cms.module.delegation',
    defaultMessage: '委托制单',
  },
  customsDecl: {
    id: 'cms.module.customs.decl',
    defaultMessage: '报关申报',
  },
  clearanceSetting: {
    id: 'cms.module.clearance.setting',
    defaultMessage: '通关设置',
  },
  compliance: {
    id: 'cms.module.group.compliance',
    defaultMessage: '合规',
  },
  tradeItem: {
    id: 'cms.module.compliance.trade.item',
    defaultMessage: '商品归类',
  },
  permit: {
    id: 'cms.module.compliance.permit',
    defaultMessage: '资质证书',
  },
  taxExpense: {
    id: 'cms.module.group.tax.expense',
    defaultMessage: '税费',
  },
  billing: {
    id: 'cms.module.billing',
    defaultMessage: '费用管理',
  },
  expenseBilling: {
    id: 'cms.module.billing.expense',
    defaultMessage: '支出计费',
  },
  revenueBilling: {
    id: 'cms.module.billing.revenue',
    defaultMessage: '营收计费',
  },
  quote: {
    id: 'cms.module.billing.quote',
    defaultMessage: '报价费率',
  },
  declTax: {
    id: 'cms.module.decl.tax',
    defaultMessage: '税金管理',
  },
  goodsType: {
    id: 'cms.delegation.goodstype',
    defaultMessage: '货物类型',
  },
  declManifest: {
    id: 'cms.module.decl.manifest',
    defaultMessage: '报关清单',
  },
  cusDecl: {
    id: 'cms.module.cus.decl',
    defaultMessage: '报关单',
  },
  delgNo: {
    id: 'cms.module.delegation.no',
    defaultMessage: '委托编号',
  },
  delgOrderNo: {
    id: 'cms.module.delg.order.no',
    defaultMessage: '委托编号/订单追踪号',
  },
  preEntrySeqNo: {
    id: 'cms.delegation.preEntry.no',
    defaultMessage: '统一编号',
  },
  declChannel: {
    id: 'cms.declaration.channel',
    defaultMessage: '申报通道',
  },
  declType: {
    id: 'cms.declaration.type',
    defaultMessage: '单证类型',
  },
  epClientList: {
    id: 'cms.declaration.ep.client.list',
    defaultMessage: '协同客户端',
  },
  swClientList: {
    id: 'cms.declaration.sw.client.list',
    defaultMessage: '导入客户端',
  },
  sendMultiDecls: {
    id: 'cms.manifest.customs.send.multi.decls',
    defaultMessage: '批量发送申报',
  },
  // 报关单通用字段
  preEntryId: {
    id: 'cms.module.common.pre.entry.id',
    defaultMessage: '预录入编号',
  },
  formEntryId: {
    id: 'cms.module.common.entry.id',
    defaultMessage: '海关编号',
  },
  declStatus: {
    id: 'cms.module.common.decl.status',
    defaultMessage: '报关状态',
  },
  declPort: {
    id: 'cms.module.common.decl.port',
    defaultMessage: '申报地海关',
  },
  entryType: {
    id: 'cms.module.common.entry.type',
    defaultMessage: '报关单类型',
  },
  billType: {
    id: 'cms.module.common.bill.type',
    defaultMessage: '备案清单类型',
  },
  iport: {
    id: 'cms.module.common.iport',
    defaultMessage: '进口口岸',
  },
  eport: {
    id: 'cms.module.common.eport',
    defaultMessage: '出口口岸',
  },
  entryCustoms: {
    id: 'cms.module.common.entry.customs',
    defaultMessage: '进境关别',
  },
  exitCustoms: {
    id: 'cms.module.common.exit.customs',
    defaultMessage: '出境关别',
  },
  idate: {
    id: 'cms.module.common.idate',
    defaultMessage: '进口日期',
  },
  edate: {
    id: 'cms.module.common.edate',
    defaultMessage: '出口日期',
  },
  ddate: {
    id: 'cms.module.common.ddate',
    defaultMessage: '申报日期',
  },
  transMode: {
    id: 'cms.module.common.transMode',
    defaultMessage: '运输方式',
  },
  transModeName: {
    id: 'cms.module.common.transModeName',
    defaultMessage: '运输工具名称',
  },
  voyageNo: {
    id: 'cms.module.common.voyage.no',
    defaultMessage: '航次号',
  },
  ladingWayBill: {
    id: 'cms.module.common.ladingWayBill',
    defaultMessage: '提运单号',
  },
  tradeCo: {
    id: 'cms.module.common.trade_co',
    defaultMessage: '境内收货人统一社会编码',
  },
  tradeCustco: {
    id: 'cms.module.common.trade_custco',
    defaultMessage: '境内收货人海关编码',
  },
  tradeName: {
    id: 'cms.module.common.trade_name',
    defaultMessage: '境内收货人名称',
  },
  traderCiqcode: {
    id: 'cms.module.common.trader_ciqcode',
    defaultMessage: '境内收货人检验检疫代码',
  },
  agentCode: {
    id: 'cms.module.common.agent_code',
    defaultMessage: '申报单位统一社会编码',
  },
  agentCustco: {
    id: 'cms.module.common.agent_custco',
    defaultMessage: '申报单位海关编码',
  },
  agentCiqcode: {
    id: 'cms.module.common.agent_ciqcode',
    defaultMessage: '申报单位检验检疫代码',
  },
  overseaEntityAeocode: {
    id: 'cms.module.common.oversea_entity_aeocode',
    defaultMessage: '境外发货人AEO代码',
  },
  ownerCode: {
    id: 'cms.module.common.owner_code',
    defaultMessage: '消费使用单位统一社会编码',
  },
  ownerCustco: {
    id: 'cms.module.common.owner_custco',
    defaultMessage: '消费使用单位海关编码',
  },
  ownerName: {
    id: 'cms.module.common.owner_name',
    defaultMessage: '消费使用单位名称',
  },
  ownerCiqcode: {
    id: 'cms.module.common.owner_ciqcode',
    defaultMessage: '消费使用单位检验检疫代码',
  },
  customsCode: {
    id: 'cms.module.common.customs.code',
    defaultMessage: '海关编码',
  },
  aeoCode: {
    id: 'cms.module.common.customs.aeo',
    defaultMessage: 'AEO编码',
  },
  scc: {
    id: 'cms.module.common.customs.scc',
    defaultMessage: '统一社会信用代码',
  },
  relationName: {
    id: 'cms.module.common.relation.name',
    defaultMessage: '企业名称',
  },
  enCopName: {
    id: 'cms.module.common.en.cop.name',
    defaultMessage: '企业英文名称',
  },
  domesticSender: {
    id: 'cms.module.common.domestic.sender',
    defaultMessage: '境内发货人',
  },
  domesticReceiver: {
    id: 'cms.module.common.domestic.receiver',
    defaultMessage: '境内收货人',
  },
  overseaSender: {
    id: 'cms.module.common.oversea.sender',
    defaultMessage: '境外发货人',
  },
  overseaReceiver: {
    id: 'cms.module.common.oversea.receiver',
    defaultMessage: '境外收货人',
  },
  forwardName: {
    id: 'cms.module.common.forward.name',
    defaultMessage: '收发货人',
  },
  domesticEntityNameEn: {
    id: 'cms.module.common.domestic.nameEn',
    defaultMessage: '境内收发货人名称（外文)',
  },
  overseaEntityName: {
    id: 'cms.module.common.oversea.name',
    defaultMessage: '境外收发货人名称（中文)',
  },
  overseaSenderAddr: {
    id: 'cms.module.common.oversea.addr',
    defaultMessage: '境外发货人地址',
  },
  unloadDate: {
    id: 'cms.module.common.unload.date',
    defaultMessage: '卸货日期',
  },
  ownerConsumeName: {
    id: 'cms.module.common.owner.consume.name',
    defaultMessage: '消费使用单位',
  },
  ownerProduceName: {
    id: 'cms.module.common.owner.produce.name',
    defaultMessage: '生产销售单位',
  },
  agentName: {
    id: 'cms.module.common.agent.name',
    defaultMessage: '申报单位',
  },
  tradeMode: {
    id: 'cms.module.common.trade.name',
    defaultMessage: '监管方式',
  },
  rmModeName: {
    id: 'cms.module.common.rm.mode.name',
    defaultMessage: '征免性质',
  },
  emsNo: {
    id: 'cms.module.common.ems.no',
    defaultMessage: '备案号',
  },
  tradeCountry: {
    id: 'cms.module.common.trade.country',
    defaultMessage: '贸易国(地区)',
  },
  departCountry: {
    id: 'cms.module.common.depart.country',
    defaultMessage: '启运国(地区)',
  },
  destinateCountry: {
    id: 'cms.module.common.destinate.country',
    defaultMessage: '抵运国(地区)',
  },
  licenseNo: {
    id: 'cms.module.common.license.no',
    defaultMessage: '许可证号',
  },
  trxMode: {
    id: 'cms.module.common.trx.mode',
    defaultMessage: '成交方式',
  },
  contractNo: {
    id: 'cms.module.common.contract.no',
    defaultMessage: '合同协议号',
  },
  containerNo: {
    id: 'cms.module.common.container.no',
    defaultMessage: '集装箱号',
  },
  usage: {
    id: 'cms.module.common.usage',
    defaultMessage: '用途',
  },
  storagePlace: {
    id: 'cms.module.common.storage.place',
    defaultMessage: '货物存放地点',
  },
  originPort: {
    id: 'cms.module.common.origin.port',
    defaultMessage: '启运港',
  },
  callingPort: {
    id: 'cms.module.common.calling.port',
    defaultMessage: '经停港',
  },
  iDestinatePort: {
    id: 'cms.module.common.idest.port',
    defaultMessage: '装货港',
  },
  eDestinatePort: {
    id: 'cms.module.common.edest.port',
    defaultMessage: '指运港',
  },
  entryPort: {
    id: 'cms.module.common.entry.port',
    defaultMessage: '入境口岸',
  },
  exitPort: {
    id: 'cms.module.common.exit.port',
    defaultMessage: '离境口岸',
  },
  iDistrict: {
    id: 'cms.module.common.idistrict',
    defaultMessage: '境内目的地',
  },
  eDistrict: {
    id: 'cms.module.common.edistrict',
    defaultMessage: '境内货源地',
  },
  freightCharge: {
    id: 'cms.module.common.freightCharge',
    defaultMessage: '运费',
  },
  insurance: {
    id: 'cms.module.common.insurance',
    defaultMessage: '保费',
  },
  sundry: {
    id: 'cms.module.common.sundry',
    defaultMessage: '杂费',
  },
  packCount: {
    id: 'cms.module.common.pack.count',
    defaultMessage: '件数',
  },
  packType: {
    id: 'cms.module.common.pack.type',
    defaultMessage: '包装种类',
  },
  otherPack: {
    id: 'cms.module.common.other.pack',
    defaultMessage: '其他包装',
  },
  other: {
    id: 'cms.module.common.other',
    defaultMessage: '其他',
  },
  grossWeight: {
    id: 'cms.module.common.gross.wt',
    defaultMessage: '毛重',
  },
  netWeight: {
    id: 'cms.module.common.net.wt',
    defaultMessage: '净重',
  },
  certMark: {
    id: 'cms.module.common.cert.mark',
    defaultMessage: '随附单证及编号',
  },
  markNotes: {
    id: 'cms.module.common.mark.notes',
    defaultMessage: '标记唛码及备注',
  },
  markNo: {
    id: 'cms.module.common.mark.no',
    defaultMessage: '标记唛码',
  },
  notes: {
    id: 'cms.module.common.notes',
    defaultMessage: '备注',
  },
  paymentRoyalty: {
    id: 'cms.module.common.payment.royalty',
    defaultMessage: '支付特许权使用费确认',
  },
  priceEffect: {
    id: 'cms.module.common.price.effect',
    defaultMessage: '价格影响确认',
  },
  specialRelation: {
    id: 'cms.module.common.special.relation',
    defaultMessage: '特殊关系确认',
  },
  cusRemark: {
    id: 'cms.module.common.cus.remark',
    defaultMessage: '业务事项',
  },
  declPersonnelName: {
    id: 'cms.module.common.decl.personnel.name',
    defaultMessage: '报关人员',
  },
  declPersonnelCode: {
    id: 'cms.module.common.decl.personnel.code',
    defaultMessage: '报关人员证号',
  },
  declPersonnelPhone: {
    id: 'cms.module.common.decl.personnel.phone',
    defaultMessage: '电话',
  },
  orgCode: {
    id: 'cms.module.common.ciq.org.code',
    defaultMessage: '检验检疫受理机关',
  },
  vsaOrgCode: {
    id: 'cms.module.common.ciq.vsa.org.code',
    defaultMessage: '领证机关',
  },
  inspOrgCode: {
    id: 'cms.module.common.ciq.insp.org.code',
    defaultMessage: '口岸检验检疫机关',
  },
  purpOrgCode: {
    id: 'cms.module.common.ciq.purp.org.code',
    defaultMessage: '目的地检验检疫机关',
  },
  entQualif: {
    id: 'cms.module.common.ciq.decl.entQualif',
    defaultMessage: '企业资质',
  },
  entQualifTypeCode: {
    id: 'cms.module.common.ciq.decl.entQualif.code',
    defaultMessage: '企业资质类别',
  },
  entQualifNo: {
    id: 'cms.module.common.ciq.decl.entQualif.no',
    defaultMessage: '企业资质编号',
  },
  entQualifName: {
    id: 'cms.module.common.ciq.decl.entQualif.name',
    defaultMessage: '资质名称',
  },
  specDeclFlag: {
    id: 'cms.module.common.ciq.decl.spec.flag',
    defaultMessage: '特殊业务标识',
  },
  correlNo: {
    id: 'cms.module.common.ciq.decl.correl.no',
    defaultMessage: '关联号码',
  },
  correlReasonFlag: {
    id: 'cms.module.common.ciq.decl.correl.reason.flag',
    defaultMessage: '关联理由',
  },
  applCert: {
    id: 'cms.module.common.ciq.decl.cert',
    defaultMessage: '所需单证',
  },
  certNeeded: {
    id: 'cms.module.common.ciq.decl.cert.needed',
    defaultMessage: '检验检疫签证申报要素',
  },
  BLno: {
    id: 'cms.module.common.ciq.decl.bl.no',
    defaultMessage: 'B/L号',
  },
  departDate: {
    id: 'cms.module.common.ciq.decl.depart.date',
    defaultMessage: '启运日期',
  },
  originBox: {
    id: 'cms.module.common.ciq.decl.origin.box',
    defaultMessage: '原箱运输',
  },
  declUser: {
    id: 'cms.module.common.ciq.decl.user',
    defaultMessage: '使用人',
  },
  userOrgPerson: {
    id: 'cms.module.common.ciq.decl.user.person',
    defaultMessage: '使用单位联系人',
  },
  userOrgTel: {
    id: 'cms.module.common.ciq.decl.user.tel',
    defaultMessage: '联系电话',
  },
  wrapType: {
    id: 'cms.module.common.decl.wrap.type',
    defaultMessage: '包装材料种类',
  },
  wrapName: {
    id: 'cms.module.common.decl.wrap.name',
    defaultMessage: '包装材料名称',
  },
  wrapQty: {
    id: 'cms.module.common.decl.wrap.qty',
    defaultMessage: '包装件数',
  },
  raDeclNo: {
    id: 'cms.module.common.relate.decl.no',
    defaultMessage: '关联报关单',
  },
  raManualNo: {
    id: 'cms.module.common.relate.manual.no',
    defaultMessage: '关联备案',
  },
  storeNo: {
    id: 'cms.module.common.store.no',
    defaultMessage: '保税/监管场所',
  },
  yardCode: {
    id: 'cms.module.common.yard.code',
    defaultMessage: '货场代码',
  },
  itemDeclDetail: {
    id: 'cms.module.common.item.decl.detail',
    defaultMessage: '商品申报详情',
  },
  itemNo: {
    id: 'cms.module.common.item.number',
    defaultMessage: '项号',
  },
  seqNo: {
    id: 'cms.module.common.seq.number',
    defaultMessage: '序号',
  },
  copGNo: {
    id: 'cms.module.common.cop.gno',
    defaultMessage: '商品货号',
  },
  emGNo: {
    id: 'cms.module.common.em.gno',
    defaultMessage: '备案序号',
  },
  entryInNo: {
    id: 'cms.module.common.entry.no.in',
    defaultMessage: '进口报关单号',
  },
  codeT: {
    id: 'cms.module.common.codet',
    defaultMessage: '商品编号',
  },
  ciqCode: {
    id: 'cms.module.common.ciqCode',
    defaultMessage: '检验检疫编码',
  },
  gName: {
    id: 'cms.module.common.gname',
    defaultMessage: '商品名称',
  },
  enName: {
    id: 'cms.module.common.en.name',
    defaultMessage: '英文品名',
  },
  gDesc: {
    id: 'cms.module.common.desc',
    defaultMessage: '描述',
  },
  gModel: {
    id: 'cms.module.common.gmodel',
    defaultMessage: '规格型号',
  },
  element: {
    id: 'cms.module.common.element',
    defaultMessage: '申报要素',
  },
  quantity: {
    id: 'cms.module.common.quantity',
    defaultMessage: '成交数量',
  },
  qty1: {
    id: 'cms.module.common.qty1',
    defaultMessage: '法一数量',
  },
  qty2: {
    id: 'cms.module.common.qty2',
    defaultMessage: '法二数量',
  },
  unit1: {
    id: 'cms.module.common.unit1',
    defaultMessage: '法一单位',
  },
  unit2: {
    id: 'cms.module.common.unit2',
    defaultMessage: '法二单位',
  },
  unit: {
    id: 'cms.module.common.unit',
    defaultMessage: '成交计量单位',
  },
  qtyPcs: {
    id: 'cms.module.common.qty.pcs',
    defaultMessage: '数量(个数)',
  },
  unitPcs: {
    id: 'cms.module.common.unit.pcs',
    defaultMessage: '单位(个数)',
  },
  origCountry: {
    id: 'cms.module.common.origCountry',
    defaultMessage: '原产国(地区)',
  },
  origPlaceCode: {
    id: 'cms.module.common.origPlaceCode',
    defaultMessage: '原产地区',
  },
  destCountry: {
    id: 'cms.module.common.destCountry',
    defaultMessage: '最终目的国(地区)',
  },
  decPrice: {
    id: 'cms.module.common.dec.price',
    defaultMessage: '申报价格',
  },
  unitPrice: {
    id: 'cms.module.common.unit.price',
    defaultMessage: '单价',
  },
  totalPrice: {
    id: 'cms.module.common.total.price',
    defaultMessage: '总价',
  },
  currency: {
    id: 'cms.module.common.currency',
    defaultMessage: '币制',
  },
  domesticDest: {
    id: 'cms.module.common.domestic.dest',
    defaultMessage: '境内目的地',
  },
  domesticOrig: {
    id: 'cms.module.common.domestic.orig',
    defaultMessage: '境内货源地',
  },
  regionDest: {
    id: 'cms.module.common.region.dest',
    defaultMessage: '目的地',
  },
  regionOrig: {
    id: 'cms.module.common.region.orig',
    defaultMessage: '产地',
  },
  exemptionWay: {
    id: 'cms.module.common.exemptionway',
    defaultMessage: '征免方式',
  },
  versionNo: {
    id: 'cms.module.common.version.no',
    defaultMessage: '成品单耗版本号',
  },
  productNo: {
    id: 'cms.module.common.product.no',
    defaultMessage: '货号',
  },
  processingFees: {
    id: 'cms.module.common.processing.fees',
    defaultMessage: '工缴费',
  },
  stuff: {
    id: 'cms.module.common.ciq.goods.stuff',
    defaultMessage: '成分/原料/组分',
  },
  expiryDate: {
    id: 'cms.module.common.ciq.goods.expiry.date',
    defaultMessage: '产品有效期',
  },
  prodQgp: {
    id: 'cms.module.common.ciq.goods.prod.qgp',
    defaultMessage: '产品保质期(天)',
  },
  overseaManufacture: {
    id: 'cms.module.common.ciq.goods.oversea.manufacture',
    defaultMessage: '境外生产企业',
  },
  ciqProductNo: {
    id: 'cms.module.common.ciq.goods.productno',
    defaultMessage: '货物型号',
  },
  goodsBrand: {
    id: 'cms.module.common.goods.brand',
    defaultMessage: '货物品牌',
  },
  produceDate: {
    id: 'cms.module.common.ciq.goods.produce.date',
    defaultMessage: '生产日期',
  },
  productBatchLot: {
    id: 'cms.module.common.ciq.goods.batchlot',
    defaultMessage: '生产批次',
  },
  manufcrRegNo: {
    id: 'cms.module.common.ciq.goods.manufacture.regno',
    defaultMessage: '生产单位注册号',
  },
  manufcrRegName: {
    id: 'cms.module.common.ciq.goods.manufacture.regname',
    defaultMessage: '生产单位名称',
  },
  nonDangerChemical: {
    id: 'cms.module.common.ciq.goods.non.danger.chemical',
    defaultMessage: '非危险化学品',
  },
  dangUnCode: {
    id: 'cms.module.common.ciq.goods.dang.uncode',
    defaultMessage: 'UN编码',
  },
  dangName: {
    id: 'cms.module.common.ciq.goods.dang.name',
    defaultMessage: '危险货物名称',
  },
  dangPackType: {
    id: 'cms.module.common.ciq.goods.dang.pack.type',
    defaultMessage: '危包类别',
  },
  dangPackSpec: {
    id: 'cms.module.common.ciq.goods.dang.pack.spec',
    defaultMessage: '危包规格',
  },
  dangerInfo: {
    id: 'cms.module.common.ciq.goods.danger.info',
    defaultMessage: '危险货物信息',
  },
  appCertCode: {
    id: 'cms.module.common.ciq.goods.appCertCode',
    defaultMessage: '证书代码',
  },
  appCertName: {
    id: 'cms.module.common.ciq.goods.appCertName',
    defaultMessage: '证书名称',
  },
  applOri: {
    id: 'cms.module.common.ciq.goods.applOri',
    defaultMessage: '正本数量',
  },
  applCopyQuan: {
    id: 'cms.module.common.ciq.goods.applCopyQuan',
    defaultMessage: '副本数量',
  },
  goodsLicence: {
    id: 'cms.module.common.ciq.goods.licence',
    defaultMessage: '产品资质',
  },
  goodsSpec: {
    id: 'cms.module.common.ciq.goods.spec',
    defaultMessage: '货物规格',
  },
  goodsSpecHint: {
    id: 'cms.module.common.ciq.goods.spec.hint',
    defaultMessage: '检验检疫货物规格',
  },
  goodsAttr: {
    id: 'cms.module.common.ciq.goods.attr',
    defaultMessage: '货物属性',
  },
  goodsPurpose: {
    id: 'cms.module.common.ciq.goods.purpose',
    defaultMessage: '用途',
  },
  freightFee: {
    id: 'cms.module.common.freight.fees',
    defaultMessage: '运费',
  },
  efficiency: {
    id: 'cms.module.common.efficiency',
    defaultMessage: '能效',
  },
  customs: {
    id: 'cms.forms.customs',
    defaultMessage: '海关监管条件',
  },
  inspection: {
    id: 'cms.forms.inspection',
    defaultMessage: '检验检疫类别',
  },
  containers: {
    id: 'cms.module.common.containers',
    defaultMessage: '集装箱',
  },
  containerId: {
    id: 'cms.module.common.container.id',
    defaultMessage: '集装箱号',
  },
  goodsContaWt: {
    id: 'cms.module.common.goods.conta.wt',
    defaultMessage: '集装箱自重KG',
  },
  copDelgGNo: {
    id: 'cms.module.common.cop.delg.gno',
    defaultMessage: '商品货号关系',
  },
  copDeclGNo: {
    id: 'cms.module.common.cop.delc.gno',
    defaultMessage: '商品项号关系',
  },
  goodsNo: {
    id: 'cms.module.common.goods.no',
    defaultMessage: '商品项号关系',
  },
  containerMd: {
    id: 'cms.module.common.container.md',
    defaultMessage: '集装箱规格',
  },
  lclFlag: {
    id: 'cms.module.common.lcl.flag',
    defaultMessage: '拼箱标识',
  },
  conatinersModal: {
    id: 'cms.module.common.containers.modal',
    defaultMessage: '集装箱设置',
  },
  attachedCerts: {
    id: 'cms.module.common.attached.certs',
    defaultMessage: '随附单证',
  },
  certSpec: {
    id: 'cms.module.common.cert.spec',
    defaultMessage: '单证类型',
  },
  certNum: {
    id: 'cms.module.common.cert.num',
    defaultMessage: '单证编号',
  },
  attachedDocs: {
    id: 'cms.declaration.attached.docs',
    defaultMessage: '随附单据',
  },
  docuSpec: {
    id: 'cms.declaration.edocu.spec',
    defaultMessage: '单据类型',
  },
  docuCode: {
    id: 'cms.declaration.edocu.code',
    defaultMessage: '单据编码',
  },
  formatType: {
    id: 'cms.declaration.edocu.format',
    defaultMessage: '格式类型',
  },
  relFile: {
    id: 'cms.declaration.rel.file',
    defaultMessage: '关联文件',
  },
  fileName: {
    id: 'cms.declaration.edocu.file',
    defaultMessage: '文件名称',
  },
  cooRel: {
    id: 'cms.declaration.tabpanes.coo.rel',
    defaultMessage: '原产地对应关系',
  },
  licenceType: {
    id: 'cms.module.common.licence.type',
    defaultMessage: '许可证类别',
  },
  licenceNo: {
    id: 'cms.module.common.licence.no',
    defaultMessage: '许可证编号',
  },
  wrtofDetailNo: {
    id: 'cms.module.common.wrtof.detail.no',
    defaultMessage: '核销货物序号',
  },
  wrtofQty: {
    id: 'cms.module.common.wrtof.qty',
    defaultMessage: '核销数量',
  },
  vinNo: {
    id: 'cms.module.common.vin.no',
    defaultMessage: 'VIN序号',
  },
  billLadDate: {
    id: 'cms.module.common.bill.date',
    defaultMessage: '提/运单日期',
  },
  qualityGuranteePeriod: {
    id: 'cms.module.common.quality.gurantee.period',
    defaultMessage: '质量保质期',
  },
  vinCode: {
    id: 'cms.module.common.vin.code',
    defaultMessage: '车辆识别代码',
  },
  motorNo: {
    id: 'cms.module.common.motor.no',
    defaultMessage: '发动机号或电机号',
  },
  invoiceNum: {
    id: 'cms.module.common.invoice.num',
    defaultMessage: '发票所列数量',
  },
  productNameEn: {
    id: 'cms.module.common.product.name.en',
    defaultMessage: '英文品名',
  },
  proNo: {
    id: 'cms.module.common.pro.no',
    defaultMessage: '型号(英文)',
  },
  chassisNo: {
    id: 'cms.module.common.chassis.no',
    defaultMessage: '底盘(车架)号',
  },
  pricePerUnit: {
    id: 'cms.module.common.price.unit',
    defaultMessage: '单价',
  },
  licenceVIN: {
    id: 'cms.module.common.licence.vin',
    defaultMessage: '编辑许可证VIN',
  },
  vinInfo: {
    id: 'cms.module.common.vin.info',
    defaultMessage: 'VIN信息',
  },
  reviewDecls: {
    id: 'cms.module.common.review.decls',
    defaultMessage: '复核申报信息',
  },
  declAmount: {
    id: 'cms.module.common.decl.amount',
    defaultMessage: '汇总申报总价',
  },
  declTotal: {
    id: 'cms.module.common.decl.total',
    defaultMessage: '总额',
  },
  feeCurr: {
    id: 'cms.module.common.shipfee.curr',
    defaultMessage: '运费币制',
  },
  feeMark: {
    id: 'cms.module.common.shipfee.mark',
    defaultMessage: '运费类型',
  },
  feeRate: {
    id: 'cms.module.common.shipfee.rate',
    defaultMessage: '运费金额',
  },
  insurCurr: {
    id: 'cms.module.common.insurfee.curr',
    defaultMessage: '保费币制',
  },
  insurMark: {
    id: 'cms.module.common.insurfee.mark',
    defaultMessage: '保费类型',
  },
  insurRate: {
    id: 'cms.module.common.insurfee.rate',
    defaultMessage: '保费金额',
  },
  otherCurr: {
    id: 'cms.module.common.otherfee.curr',
    defaultMessage: '杂费币制',
  },
  otherMark: {
    id: 'cms.module.common.otherfee.mark',
    defaultMessage: '杂费类型',
  },
  otherRate: {
    id: 'cms.module.common.otherfee.rate',
    defaultMessage: '杂费金额',
  },
  reviewed: {
    id: 'cms.module.common.reviewed',
    defaultMessage: '复核成功',
  },
  relManifestRule: {
    id: 'cms.module.common.rel.manifest.rule',
    defaultMessage: '关联制单规则',
  },
  mergePrinciple: {
    id: 'cms.module.common.merge.principle',
    defaultMessage: '归并原则',
  },
  splitPrinciple: {
    id: 'cms.module.common.split.principle',
    defaultMessage: '拆分原则',
  },
  sortPrinciple: {
    id: 'cms.module.common.sort.principle',
    defaultMessage: '排序原则',
  },
  ciqPrinciple: {
    id: 'cms.module.common.ciq.principle',
    defaultMessage: '检务原则',
  },
  conditionalMerge: {
    id: 'cms.module.common.conditional.merge',
    defaultMessage: '条件归并:',
  },
  productName: {
    id: 'cms.module.common.product.name',
    defaultMessage: '中文品名',
  },
  productCode: {
    id: 'cms.module.common.product.code',
    defaultMessage: '商品货号',
  },
  nonMerge: {
    id: 'cms.module.common.non.merge',
    defaultMessage: '不归并:',
  },
  splitPerCount: {
    id: 'cms.module.common.split.per.count',
    defaultMessage: '拆分品项数',
  },
  splitSplCopGNo: {
    id: 'cms.module.common.split.special.splcopgno',
    defaultMessage: '特殊货号独立报关',
  },
  specialHscodeDeclare: {
    id: 'cms.module.common.split.special.hscode',
    defaultMessage: '特殊商品编号独立报关',
  },
  customOnTop: {
    id: 'cms.module.common.sort.custom.ontop',
    defaultMessage: '海关监管项置顶',
  },
  totalPriceOnTop: {
    id: 'cms.module.common.sort.totalprice.ontop',
    defaultMessage: '最大金额项优先',
  },
  hsCodeAscSort: {
    id: 'cms.module.common.sort.hscode.asc',
    defaultMessage: '商品编号升序',
  },
  priceDescSort: {
    id: 'cms.module.common.sort.price.desc',
    defaultMessage: '申报金额降序',
  },
  docuTemplate: {
    id: 'cms.module.common.docu.template',
    defaultMessage: '单据模板',
  },
  mergeSpecialHscode: {
    id: 'cms.module.common.merge.special.hscode',
    defaultMessage: '特殊商品编号合并',
  },
  mergeSpecialNo: {
    id: 'cms.module.common.merge.special.productno',
    defaultMessage: '特殊商品货号合并',
  },
  mergeWithMultiProductCount: {
    id: 'cms.module.common.merge.gmodel.productlen',
    defaultMessage: '多货号合并时规范申报替换\\{型号\\}为"等"加货号数量',
  },
  specialHscodeSort: {
    id: 'cms.module.common.split.special.hscode.sort',
    defaultMessage: '特殊商品编号分类:',
  },
  dutyModeSplit: {
    id: 'cms.module.common.split.dutymode',
    defaultMessage: '不同征免方式独立报关',
  },
  currencySplit: {
    id: 'cms.module.common.split.currency',
    defaultMessage: '不同币制独立报关',
  },
  byCiqDeclSplit: {
    id: 'cms.module.common.split.ciq.decl',
    defaultMessage: '报检独立报关',
  },
  byApplCertSplit: {
    id: 'cms.module.common.split.appl.cert',
    defaultMessage: '报检出证独立报关',
  },
  containerNoSplit: {
    id: 'cms.module.common.split.containerno',
    defaultMessage: '不同集装箱号独立报关',
  },
  exportPreferSplit: {
    id: 'cms.module.common.split.exportprefer',
    defaultMessage: '不同出口享惠独立报关',
  },
  inspectOnTop: {
    id: 'cms.module.common.sort.inspect.ontop',
    defaultMessage: '检验检疫项优先',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
