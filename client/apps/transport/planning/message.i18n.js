import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  shipNo: {
    id: 'transport.acceptance.ship.no',
    defaultMessage: '运输编号',
  },
  shipRequirement: {
    id: 'transport.acceptance.ship.requirement',
    defaultMessage: '托运客户',
  },
  refCustomerNo: {
    id: 'transport.acceptance.ref.customer.no',
    defaultMessage: '订单追踪号',
  },
  shipPickupDate: {
    id: 'transport.acceptance.pickup.date',
    defaultMessage: '提货日期',
  },
  shipTransitTime: {
    id: 'transport.acceptance.ship.transit.time',
    defaultMessage: '运输时效',
  },
  transitTimeToday: {
    id: 'transport.acceptance.transit.time.today',
    defaultMessage: '当日',
  },
  shipDeliveryDate: {
    id: 'transport.acceptance.delivery.date',
    defaultMessage: '送货日期',
  },
  shipConsignor: {
    id: 'transport.acceptance.ship.consignor',
    defaultMessage: '发货方',
  },
  consignorPlace: {
    id: 'transport.acceptance.consignor.place',
    defaultMessage: '始发地',
  },
  consignorAddr: {
    id: 'transport.acceptance.consignor.addr',
    defaultMessage: '发货地址',
  },
  shipConsignee: {
    id: 'transport.acceptance.ship.consignee',
    defaultMessage: '收货方',
  },
  consigneePlace: {
    id: 'transport.acceptance.consignee.place',
    defaultMessage: '目的地',
  },
  consigneeAddr: {
    id: 'transport.acceptance.consignee.addr',
    defaultMessage: '收货地址',
  },
  shipMode: {
    id: 'transport.acceptance.shipment.mode',
    defaultMessage: '运输方式',
  },
  packageNum: {
    id: 'transport.acceptance.shipment.packageNum',
    defaultMessage: '件数',
  },
  shipWeight: {
    id: 'transport.acceptance.shipment.weight',
    defaultMessage: '重量',
  },
  shipVolume: {
    id: 'transport.acceptance.shipment.volume',
    defaultMessage: '体积',
  },
  shipSource: {
    id: 'transport.acceptance.shipment.source',
    defaultMessage: '来源',
  },
  shipCreateDate: {
    id: 'transport.acceptance.shipment.create.date',
    defaultMessage: '创建时间',
  },
  shipAcceptTime: {
    id: 'transport.acceptance.shipment.accept.time',
    defaultMessage: '接单时间',
  },
  searchPlaceholder: {
    id: 'transport.acceptance.search.placeholder',
    defaultMessage: '搜索运输编号',
  },
  unacceptedShipmt: {
    id: 'transport.acceptance.shipment.unaccepted',
    defaultMessage: '未接单',
  },
  acceptedShipmt: {
    id: 'transport.acceptance.shipment.accepted',
    defaultMessage: '已接单',
  },
  draftShipmt: {
    id: 'transport.acceptance.shipment.plane',
    defaultMessage: '运输计划',
  },
  shipmtCreate: {
    id: 'transport.acceptance.shipment.create',
    defaultMessage: '新建运单',
  },
  shipmtDraft: {
    id: 'transport.acceptance.shipment.draft',
    defaultMessage: '运单草稿',
  },
  shipmtEdit: {
    id: 'transport.acceptance.shipment.edit',
    defaultMessage: '编辑运单',
  },
  saveAndAccept: {
    id: 'transport.acceptance.save.accept',
    defaultMessage: '一键接单',
  },
  saveAndAcceptConfirm: {
    id: 'transport.acceptance.save.accept.confirm',
    defaultMessage: '接单后不能再修改，确定？',
  },
  saveAsDraft: {
    id: 'transport.acceptance.save.draft',
    defaultMessage: '暂存为草稿',
  },
  formError: {
    id: 'transport.acceptance.form.error',
    defaultMessage: '运单信息不完整',
  },
  shipmtOpSuccess: {
    id: 'transport.acceptance.op.success',
    defaultMessage: '运单操作成功',
  },
  day: {
    id: 'transport.acceptance.day',
    defaultMessage: '天',
  },
  consginSource: {
    id: 'transport.acceptance.consign.source',
    defaultMessage: '委托',
  },
  subcontractSource: {
    id: 'transport.acceptance.subcontract.source',
    defaultMessage: '分包',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
