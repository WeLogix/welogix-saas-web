import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  receiving: {
    id: 'cwm.receiving',
    defaultMessage: '入库',
  },
  save: {
    id: 'cwm.receiving.save',
    defaultMessage: '保存',
  },
  cancel: {
    id: 'cwm.receiving.cancel',
    defaultMessage: '取消',
  },
  regStatus: {
    id: 'cwm.receiving.reg.status',
    defaultMessage: '备案状态',
  },
  receivingASN: {
    id: 'cwm.receiving.asn',
    defaultMessage: '收货通知ASN',
  },
  allASN: {
    id: 'cwm.receiving.asn.all',
    defaultMessage: '全部收货通知',
  },
  createASN: {
    id: 'cwm.receiving.asn.create',
    defaultMessage: '新建收货通知',
  },
  inboundStatus: {
    id: 'cwm.receiving.inbound.status',
    defaultMessage: '入库状态',
  },
  inboundListSearchPlaceholder: {
    id: 'cwm.receiving.list.placeholder',
    defaultMessage: 'SKU号或序列号或流水号',
  },
  warehouse: {
    id: 'cwm.receiving.warehouse',
    defaultMessage: '仓库',
  },
  inboundNo: {
    id: 'cwm.receiving.inboundNo',
    defaultMessage: '入库单号',
  },
  inboundDate: {
    id: 'cwm.receiving.inboundDate',
    defaultMessage: '入库日期',
  },
  sku: {
    id: 'cwm.receiving.sku',
    defaultMessage: 'SKU',
  },
  actualQty: {
    id: 'cwm.receiving.actual.qty',
    defaultMessage: '入库数量',
  },
  postQty: {
    id: 'cwm.receiving.postqty',
    defaultMessage: '库存数量',
  },
  lotserialNo: {
    id: 'cwm.receiving.lot.serialno',
    defaultMessage: '批次号/序列号',
  },
  vendor: {
    id: 'cwm.receiving.vendor',
    defaultMessage: '供货商',
  },
  unitPrice: {
    id: 'cwm.receiving.unit.price',
    defaultMessage: '单价',
  },
  manufexpiryDate: {
    id: 'cwm.receiving.manuf.expiry.date',
    defaultMessage: '生产/失效日期',
  },
  asnPlaceholder: {
    id: 'cwm.receiving.asn.search.place.holder',
    defaultMessage: '搜索ASN编号/订单追踪号',
  },
  inboundPlaceholder: {
    id: 'cwm.receiving.asn.inbound.search.place.holder',
    defaultMessage: '搜索ASN编号/订单追踪号',
  },
  tabASN: {
    id: 'cwm.receiving.dock.tab.asn',
    defaultMessage: '收货通知',
  },
  tabFTZ: {
    id: 'cwm.receiving.dock.tab.ftz',
    defaultMessage: '海关备案',
  },
  tabInbound: {
    id: 'cwm.receiving.dock.tab.inbound',
    defaultMessage: '入库信息',
  },
  orderQty: {
    id: 'cwm.receiving.asn.detail.orderQty',
    defaultMessage: '订单数量',
  },
  virtualWhse: {
    id: 'cwm.receiving.asn.detail.virtualWhse',
    defaultMessage: '库别',
  },
  containerNo: {
    id: 'cwm.receiving.asn.detail.containerNo',
    defaultMessage: '集装箱号',
  },
  amount: {
    id: 'cwm.receiving.asn.detail.amount',
    defaultMessage: '金额',
  },
  totalAmount: {
    id: 'cwm.receiving.asn.detail.totalAmount',
    defaultMessage: '总价',
  },
  currency: {
    id: 'cwm.receiving.asn.detail.currency',
    defaultMessage: '币制',
  },
  unit: {
    id: 'cwm.receiving.asn.detail.unit',
    defaultMessage: '计量单位',
  },
  ownerPartner: {
    id: 'cwm.receiving.asn.head.ownerPartner',
    defaultMessage: '货主',
  },
  expectReceiveDate: {
    id: 'cwm.receiving.asn.head.expectReceiveDate',
    defaultMessage: '预计到货日期',
  },
  asnType: {
    id: 'cwm.receiving.asn.head.asnType',
    defaultMessage: 'ASN类型',
  },
  bonded: {
    id: 'cwm.receiving.asn.head.bonded',
    defaultMessage: '保税类型',
  },
  regType: {
    id: 'cwm.receiving.asn.head.regType',
    defaultMessage: '保税备案类型',
  },
  transferInBills: {
    id: 'cwm.receiving.asn.head.transferInBills',
    defaultMessage: '进区凭单号',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
