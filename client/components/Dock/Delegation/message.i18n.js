import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from 'client/apps/cms/message.i18n';

const messages = defineMessages({
  delegation: {
    id: 'component.dock.delegation',
    defaultMessage: '报关委托',
  },
  client: {
    id: 'component.dock.client',
    defaultMessage: '货主',
  },
  forwarder: {
    id: 'component.dock.forwarder',
    defaultMessage: '货运代理',
  },
  broker: {
    id: 'component.dock.broker',
    defaultMessage: '报关代理',
  },
  docsArchive: {
    id: 'component.dock.docs.archive',
    defaultMessage: '单证归档',
  },
  ciqDispMessage: {
    id: 'component.dock.message.ciq.dispatch',
    defaultMessage: '请选择报检供应商',
  },
  dispatchMessage: {
    id: 'component.dock.message.dispatch',
    defaultMessage: '请选择供应商',
  },
  shipmentNo: {
    id: 'bizdock.tabpanes.delegation.shipment.no',
    defaultMessage: '货运编号',
  },
  orderRefNo: {
    id: 'bizdock.tabpanes.delegation.order.ref.no',
    defaultMessage: '订单追踪号',
  },
  trafName: {
    id: 'bizdock.tabpanes.delegation.traf.name',
    defaultMessage: '运输工具名称',
  },
  blWbNo: {
    id: 'bizdock.tabpanes.delegation.bl.wb.no',
    defaultMessage: '主分运单号',
  },
  pieces: {
    id: 'bizdock.tabpanes.delegation.pieces',
    defaultMessage: '总件数',
  },
  weight: {
    id: 'bizdock.tabpanes.delegation.weight',
    defaultMessage: '总毛重',
  },
  itemNo: {
    id: 'bizdock.tabpanes.delegation.item.no',
    defaultMessage: '项号',
  },
  codeT: {
    id: 'bizdock.tabpanes.delegation.code.t',
    defaultMessage: '商品编号',
  },
  gName: {
    id: 'bizdock.tabpanes.delegation.g.name',
    defaultMessage: '商品名称',
  },
  gModel: {
    id: 'bizdock.tabpanes.delegation.g.model',
    defaultMessage: '规格型号',
  },
  quantity: {
    id: 'bizdock.tabpanes.delegation.quantity',
    defaultMessage: '成交数量',
  },
  unit: {
    id: 'bizdock.tabpanes.delegation.unit',
    defaultMessage: '成交计量单位',
  },
  decPrice: {
    id: 'bizdock.tabpanes.delegation.dec.price',
    defaultMessage: '申报单价',
  },
  decTotal: {
    id: 'bizdock.tabpanes.delegation.dec.total',
    defaultMessage: '申报总价',
  },
  currency: {
    id: 'bizdock.tabpanes.delegation.currency',
    defaultMessage: '币制',
  },
  grosswt: {
    id: 'bizdock.tabpanes.delegation.grosswt',
    defaultMessage: '毛重',
  },
  netwt: {
    id: 'bizdock.tabpanes.delegation.netwt',
    defaultMessage: '净重',
  },
  exemptionWay: {
    id: 'bizdock.tabpanes.delegation.exemption.way',
    defaultMessage: '征免方式',
  },
  destCountry: {
    id: 'bizdock.tabpanes.delegation.dest.country',
    defaultMessage: '最终目的国',
  },
  origCountry: {
    id: 'bizdock.tabpanes.delegation.orig.country',
    defaultMessage: '原产国',
  },
  tradeName: {
    id: 'bizdock.tabpanes.delegation.trade.name',
    defaultMessage: '消费使用单位',
  },
  agentName: {
    id: 'bizdock.tabpanes.delegation.agent.name',
    defaultMessage: '申报单位',
  },
  iePort: {
    id: 'bizdock.tabpanes.delegation.i.e.port',
    defaultMessage: '进口口岸',
  },
  tradeMode: {
    id: 'bizdock.tabpanes.delegation.trade.mode',
    defaultMessage: '监管方式',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
