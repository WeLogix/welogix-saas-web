import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';
import { CWM_DAMAGE_LEVEL, CWM_TRANSACTIONS_TYPE } from 'common/constants';
import { formatMsg } from '../message.i18n';

exports.commonTraceColumns = (intl) => {
  const msg = formatMsg(intl);
  return [{
    title: msg('bonded'),
    width: 80,
    dataIndex: 'bonded',
    align: 'center',
    render: bonded => (bonded ? <Tag color="blue">保税</Tag> : <Tag>非保税</Tag>),
    filters: [{ text: '保税', value: 1 }, { text: '非保税', value: 0 }], // todo true "true"
    filterMultiple: false,
  }, {
    title: msg('portion'),
    width: 100,
    dataIndex: 'portion',
    align: 'center',
    render: (portion, record) => {
      if (record.bonded) {
        return portion ? <Tag color="green">分拨料件</Tag> : <Tag>普通保税</Tag>;
      }
      return '-';
    },
    filters: [{ text: '分拨料件', value: 1 }, { text: '普通保税', value: 0 }],
    filterMultiple: false,
  }, {
    title: msg('SKU'),
    dataIndex: 'product_sku',
    width: 160,
    sorter: true,
  }, {
    title: msg('asnCustOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: msg('billLadingNo'),
    width: 150,
    dataIndex: 'bl_wb_no',
  }, {
    title: msg('billLadingMawb'),
    width: 150,
    dataIndex: 'bl_wb_mawb',
  }, {
    title: msg('billLadingHawb'),
    width: 150,
    dataIndex: 'bl_wb_hawb',
  }, {
    title: msg('poNo'),
    width: 150,
    dataIndex: 'po_no',
  }, {
    title: msg('invoiceNo'),
    width: 150,
    dataIndex: 'invoice_no',
  }, {
    title: msg('asnNo'),
    width: 150,
    dataIndex: 'asn_no',
  }, {
    title: msg('lotNo'),
    width: 120,
    dataIndex: 'external_lot_no',
  }, {
    title: msg('serialNo'),
    width: 120,
    dataIndex: 'serial_no',
  }, {
    title: msg('virtualWhse'),
    width: 120,
    dataIndex: 'virtual_whse',
  }, {
    title: msg('supplierName'),
    width: 120,
    dataIndex: 'supplier',
  }, {
    title: msg('damageLevel'),
    width: 120,
    dataIndex: 'damage_level',
    render: dl => (dl || dl === 0) &&
    <Tag color={CWM_DAMAGE_LEVEL[dl].color}>{CWM_DAMAGE_LEVEL[dl].text}</Tag>,
  }, {
    title: msg('expiryDate'),
    width: 120,
    dataIndex: 'expiry_date',
    render: expirydate => expirydate && moment(expirydate).format('YYYY.MM.DD'),
    sorter: true,
  }, {
    title: msg('attrib1'),
    width: 120,
    dataIndex: 'attrib_1_string',
  }, {
    title: msg('attrib2'),
    width: 120,
    dataIndex: 'attrib_2_string',
  }, {
    title: msg('attrib3'),
    width: 120,
    dataIndex: 'attrib_3_string',
  }, {
    title: msg('attrib4'),
    width: 120,
    dataIndex: 'attrib_4_string',
  }, {
    title: msg('attrib5'),
    width: 120,
    dataIndex: 'attrib_5_string',
  }, {
    title: msg('attrib6'),
    width: 120,
    dataIndex: 'attrib_6_string',
  }, {
    title: msg('attrib7'),
    width: 120,
    dataIndex: 'attrib_7_date',
    render: attr7date => attr7date && moment(attr7date).format('YYYY.MM.DD'),
  }, {
    title: msg('attrib8'),
    width: 120,
    dataIndex: 'attrib_8_date',
    render: attr8date => attr8date && moment(attr8date).format('YYYY.MM.DD'),
  }, {
    title: msg('ftzEntNo'),
    width: 120,
    dataIndex: 'ftz_ent_no',
  }, {
    title: msg('cusDeclNo'),
    width: 120,
    dataIndex: 'in_cus_decl_no',
  }, {
    title: msg('ftzEntryId'),
    width: 120,
    dataIndex: 'ftz_ent_filed_id',
  }, {
    title: msg('grossWeight'),
    dataIndex: 'gross_weight',
    align: 'right',
    width: 120,
  }, {
    title: msg('cbm'),
    dataIndex: 'volume',
    align: 'right',
    width: 120,
  }, {
    dataIndex: 'SPACER_COL',
  }];
};

exports.transactionColumns = (/* intl */) => [{
  title: '事务类型',
  width: 80,
  dataIndex: 'type',
  align: 'center',
  render: type => type && <span className="text-emphasis">{CWM_TRANSACTIONS_TYPE[type].text}</span>,
}, {
  title: '变动数量',
  width: 100,
  dataIndex: 'transaction_qty',
  align: 'right',
  render: (text) => {
    if (text > 0) {
      return <span className="text-success">+{text}</span>;
    }
    return <span className="text-warning">{text}</span>;
  },
}, {
  title: '原因',
  width: 100,
  dataIndex: 'reason',
  className: 'text-normal',
}, {
  title: '事务时间',
  width: 150,
  dataIndex: 'transaction_timestamp',
  render: traxTime => traxTime && moment(traxTime).format('YYYY.MM.DD HH:mm'),
}, {
  title: '操作人',
  width: 100,
  dataIndex: 'trxn_login_name',
}, {
  title: '指令单号',
  width: 180,
  dataIndex: 'transaction_no',
}, {
  title: '订单追踪号',
  width: 160,
  dataIndex: 'ref_order_no',
}];
