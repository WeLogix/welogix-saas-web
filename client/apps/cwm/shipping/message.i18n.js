import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  shipping: {
    id: 'cwm.shipping',
    defaultMessage: '出库',
  },
  save: {
    id: 'cwm.shipping.save',
    defaultMessage: '保存',
  },
  cancel: {
    id: 'cwm.shipping.cancel',
    defaultMessage: '取消',
  },
  shippingOrder: {
    id: 'cwm.shipping.order',
    defaultMessage: '出库订单',
  },
  shippingCustOrderNo: {
    id: 'cwm.shipping.cust.order.no',
    defaultMessage: '出库订单追踪号',
  },
  allSO: {
    id: 'cwm.shipping.order.all',
    defaultMessage: '全部出库订单',
  },
  wave: {
    id: 'cwm.shipping.order.in.wave',
    defaultMessage: '波次出货订单',
  },
  createSO: {
    id: 'cwm.shipping.order.create',
    defaultMessage: '创建出货订单',
  },
  batchImport: {
    id: 'cwm.shipping.order.batch.import',
    defaultMessage: '批量导入',
  },
  shippingWave: {
    id: 'cwm.shipping.wave',
    defaultMessage: '波次',
  },
  outboundStatus: {
    id: 'cwm.shipping.outbound.status',
    defaultMessage: '出库状态',
  },
  statusTbdExitable: {
    id: 'cwm.shipping.list.so.status.tbd.exitable',
    defaultMessage: '待定可出区',
  },
  soPlaceholder: {
    id: 'cwm.shipping.so.search.placeholder',
    defaultMessage: '搜索SO编号/波次编号/订单追踪号/快递单号',
  },
  wavePlaceholder: {
    id: 'cwm.shipping.wave.search.placeholder',
    defaultMessage: '搜索波次编号',
  },
  outboundPlaceholder: {
    id: 'cwm.shipping.outbound.search.placeholder',
    defaultMessage: '搜索SO编号/订单追踪号',
  },
  outboundListSearchPlaceholder: {
    id: 'cwm.shipping.list.placeholder',
    defaultMessage: 'SKU号或序列号或流水号',
  },
  shippingLoad: {
    id: 'cwm.shipping.load',
    defaultMessage: '装车单',
  },
  tabSO: {
    id: 'cwm.shipping.dock.tab.so',
    defaultMessage: '出库订单',
  },
  tabFTZ: {
    id: 'cwm.shipping.dock.tab.ftz',
    defaultMessage: '海关备案',
  },
  tabOutbound: {
    id: 'cwm.shipping.dock.tab.outbound',
    defaultMessage: '出库信息',
  },
  amount: {
    id: 'cwm.shipping.detail.amount',
    defaultMessage: '金额',
  },
  totalAmount: {
    id: 'cwm.shipping.detail.totalAmount',
    defaultMessage: '总价',
  },
  unitPrice: {
    id: 'cwm.shipping.detail.unitPrice',
    defaultMessage: '单价',
  },
  orderQty: {
    id: 'cwm.shipping.detail.orderQty',
    defaultMessage: '订单数量',
  },
  currency: {
    id: 'cwm.shipping.detail.currency',
    defaultMessage: '币制',
  },
  externalLotNo: {
    id: 'cwm.shipping.detail.externalLotNo',
    defaultMessage: '批次号',
  },
  serialNo: {
    id: 'cwm.shipping.detail.serialNo',
    defaultMessage: '序列号',
  },
  supplier: {
    id: 'cwm.shipping.detail.supplier',
    defaultMessage: '供货商',
  },
  unit: {
    id: 'cwm.shipping.detail.unit',
    defaultMessage: '计量单位',
  },
  ownerPartner: {
    id: 'cwm.shipping.so.head.ownerPartner',
    defaultMessage: '货主',
  },
  expectShippingDate: {
    id: 'cwm.shipping.so.head.expectShippingDate',
    defaultMessage: '要求出货日期',
  },
  soType: {
    id: 'cwm.shipping.so.head.soType',
    defaultMessage: 'SO类型',
  },
  bonded: {
    id: 'cwm.shipping.so.head.bonded',
    defaultMessage: '保税类型',
  },
  regType: {
    id: 'cwm.shipping.so.head.regType',
    defaultMessage: '保税备案类型',
  },
  deliveryType: {
    id: 'cwm.shipping.so.head.deliveryType',
    defaultMessage: '配送方式',
  },
  carrier: {
    id: 'cwm.shipping.so.head.carrier',
    defaultMessage: '承运人',
  },
  receiverName: {
    id: 'cwm.shipping.so.head.receiver.name',
    defaultMessage: '收货人',
  },
  receiverCode: {
    id: 'cwm.shipping.so.head.receiver.code',
    defaultMessage: '收货人代码',
  },
  receiverContact: {
    id: 'cwm.shipping.so.head.receiver.contact',
    defaultMessage: '联系人',
  },
  contactWay: {
    id: 'cwm.shipping.so.head.contactWay',
    defaultMessage: '联系方式',
  },
  phone: {
    id: 'cwm.shipping.so.head.receiver.phone',
    defaultMessage: '电话',
  },
  number: {
    id: 'cwm.shipping.so.head.receiver.number',
    defaultMessage: '手机',
  },
  region: {
    id: 'cwm.shipping.so.head.receiver.region',
    defaultMessage: '省/市/县区',
  },
  address: {
    id: 'cwm.shipping.so.head.receiver.address',
    defaultMessage: '详细地址',
  },
  postCode: {
    id: 'cwm.shipping.so.head.receiver.postCode',
    defaultMessage: '邮政编码',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
