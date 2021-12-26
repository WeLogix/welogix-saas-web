import React from 'react';
import CustomsInpsectionTip from 'client/components/customsInpsectionTip';
import RowAction from 'client/components/RowAction';

export const HscodeColumns = handlers => [{
  title: '商品编号',
  dataIndex: 'hscode',
  width: 120,
}, {
  title: '检验检疫',
  dataIndex: 'ciqcode',
  align: 'center',
  width: 400,
  render: (o, record) => {
    if (record.ciqcode && record.ciqname) {
      return `${record.ciqcode} | ${record.ciqname}`;
    }
    return <RowAction icon="ellipsis" onClick={handlers.handleCiqPanelView} row={record} />;
  },
}, {
  title: '商品名称',
  dataIndex: 'product_name',
  width: 200,
}, {
  title: '商品描述',
  dataIndex: 'product_remark',
  width: 400,
}, {
  title: '申报要素',
  dataIndex: 'declared_elements',
  width: 400,
}, {
  title: '法定第一单位',
  dataIndex: 'first_unit',
  width: 120,
}, {
  title: '法定第二单位',
  dataIndex: 'second_unit',
  width: 120,
}, {
  title: '最惠国进口税率',
  dataIndex: 'mfn_rates',
  width: 130,
}, {
  title: '普通进口税率',
  dataIndex: 'general_rates',
  width: 120,
}, {
  title: '暂定进口税率',
  dataIndex: 'provisional_rates',
  width: 120,
}, {
  title: '消费税率',
  dataIndex: 'gst_rates',
  width: 100,
}, {
  title: '出口关税率',
  dataIndex: 'export_rates',
  width: 120,
}, {
  title: '出口退税率',
  dataIndex: 'export_rebate_rates',
  width: 120,
}, {
  title: '增值税率',
  dataIndex: 'vat_rates',
  width: 100,
}, {
  title: '海关监管条件',
  dataIndex: 'customs',
  width: 250,
  render: col => (<CustomsInpsectionTip str={col} type="customs" />),
}, {
  title: '检验检疫类别',
  dataIndex: 'inspection',
  width: 250,
  render: col => (<CustomsInpsectionTip str={col} type="inspection" />),
}];

