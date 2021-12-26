exports.CUSTOMS_EXEC_MARK = [{ // 海关执行标志
  value: '1',
  text: '1-正常执行',
}, {
  value: '2',
  text: '2-恢复执行',
}, {
  value: '3',
  text: '3-暂停变更',
}, {
  value: '4',
  text: '4-暂停进出口',
}, {
  value: '5',
  text: '5-暂停进口',
}, {
  value: '6',
  text: '6-暂停出口',
}, {
  value: '7',
  text: '7-全部暂停',
}];

exports.MODIFY_MARK = [{ // 修改标志
  value: '0',
  text: '0-未修改',
}, {
  value: '1',
  text: '1-修改',
}, {
  value: '2',
  text: '2-删除',
}, {
  value: '3',
  text: '3-增加',
}];

exports.PRODUCT_ATTR = [{ // 商品属性
  value: '1',
  text: '1-消耗性物料',
}, {
  value: '2',
  text: '2-深加工结转',
}, {
  value: '3',
  text: '3-区域实质加工',
}, {
  value: '8',
  text: '8-现场自定义',
}, {
  value: '9',
  text: '9-其他录入',
}];

exports.BLBOOK_USAGE = [{ // 账册用途
  value: '1',
  text: '1-一般纳税人',
}, {
  value: '2',
  text: '2-特殊行业',
}, {
  value: '3',
  text: '3-保税维修',
}, {
  value: '4',
  text: '4-委内加工',
}];

exports.PAUSE_I_E_MARK = [{ // 暂停执行标志
  value: '0',
  text: '0-电子口岸申报',
}, {
  value: '1',
  text: '1-正常执行',
}, {
  value: '2',
  text: '2-恢复执行',
}, {
  value: '3',
  text: '3-台帐未开出',
}, {
  value: '4',
  text: '4-台帐未登记',
}, {
  value: '5',
  text: '5-暂停变更',
}, {
  value: '6',
  text: '6-暂停进出口',
}, {
  value: '7',
  text: '7-暂停进口',
}, {
  value: '8',
  text: '8-暂停出口',
}, {
  value: '9',
  text: '9-全部暂停',
}, {
  value: 'A',
  text: 'A-申请注销',
}];

exports.STAND_BANK = [{ // 台账类型
  value: '0',
  text: '0-纸质台账',
}, {
  value: '1',
  text: '1-中国银行',
}, {
  value: '2',
  text: '2-工商银行',
}, {
  value: '3',
  text: '3-光大银行',
}];

exports.PTS_MANUAL_BOOK_TYPE = [{ // 手册业务类型
  value: 'B',
  text: 'B-来料加工',
}, {
  value: 'C',
  text: 'C-进料加工',
}, {
  value: 'D',
  text: 'D-设备手册',
}];

exports.PTS_E_BOOK_TYPE = [{ // 账册业务类型
  value: '1',
  text: '1-E账册',
}, {
  value: '2',
  text: '2-H账册',
}, {
  value: '3',
  text: '3-耗料',
}, {
  value: '4',
  text: '4-工单',
}];

exports.PTS_BOOK_TYPE = {
  MBOOK: 'EML', // 手册
  EBOOK: 'EMS', // 账册
};
