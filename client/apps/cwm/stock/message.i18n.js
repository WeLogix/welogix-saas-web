import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  stock: {
    id: 'cwm.stock',
    defaultMessage: '库存',
  },
  stockInventory: {
    id: 'cwm.stock.inventory',
    defaultMessage: '库存余量',
  },
  stockTransition: {
    id: 'cwm.stock.transition',
    defaultMessage: '库存调整',
  },
  stockTransaction: {
    id: 'cwm.stock.transaction',
    defaultMessage: '库存流水',
  },
  stockQuery: {
    id: 'cwm.stock.query',
    defaultMessage: '库存查询',
  },
  allStock: {
    id: 'cwm.stock.all',
    defaultMessage: '全部库存',
  },
  normalStock: {
    id: 'cwm.stock.normal',
    defaultMessage: '正常库存',
  },
  frozenStock: {
    id: 'cwm.stock.frozen',
    defaultMessage: '冻结库存',
  },
  movement: {
    id: 'cwm.stock.movement',
    defaultMessage: '库存移动',
  },
  movementNo: {
    id: 'cwm.stock.movement.no',
    defaultMessage: '移库编号',
  },
  transactionNo: {
    id: 'cwm.stock.movement.transactionNo',
    defaultMessage: '指令单号',
  },
  reason: {
    id: 'cwm.stock.movement.reason',
    defaultMessage: '原因',
  },
  ownerName: {
    id: 'cwm.stock.movement.ownerName',
    defaultMessage: '货主',
  },
  moveType: {
    id: 'cwm.stock.movement.moveType',
    defaultMessage: '库存移动类型',
  },
  status: {
    id: 'cwm.stock.movement.status',
    defaultMessage: '状态',
  },
  done: {
    id: 'cwm.stock.movement.done',
    defaultMessage: '已完成',
  },
  undone: {
    id: 'cwm.stock.movement.undone',
    defaultMessage: '未完成',
  },
  movingMode: {
    id: 'cwm.stock.movement.movingMode',
    defaultMessage: '操作模式',
  },
  completedDate: {
    id: 'cwm.stock.movement.completedDate',
    defaultMessage: '移动时间',
  },
  movementDetails: {
    id: 'cwm.stock.movement.movementDetails',
    defaultMessage: '移库明细',
  },
  cancelMovement: {
    id: 'cwm.stock.movement.cancelMovement',
    defaultMessage: '取消移库',
  },
  scan: {
    id: 'cwm.stock.movement.mode.scan',
    defaultMessage: '无线操作',
  },
  manual: {
    id: 'cwm.stock.movement.mode.manual',
    defaultMessage: '桌面操作',
  },
  createMovement: {
    id: 'cwm.stock.movement.create',
    defaultMessage: '创建库存移动单',
  },
  transitUploadUpdate: {
    id: 'cwm.stock.transit.upload.update',
    defaultMessage: '批量导入调整',
  },
  moveSearchPlaceholder: {
    id: 'cwm.stock.move.search.placeholder',
    defaultMessage: '指令单号/移库编号/原因',
  },
  relatedTraceId: {
    id: 'cwm.stock.transaction.relatedTraceId',
    defaultMessage: '关联追踪ID',
  },
});

export default messages;

export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
