import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Table, Tag } from 'antd';
import { CMS_TAX_PAY_STATUS } from 'common/constants';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  customs: state.saasParams.latest.customs,
}))
export default class TaxPayTable extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('序号'),
    dataIndex: 'tax_seq_no',
    width: 50,
  }, {
    title: this.msg('支付银行'),
    dataIndex: 'tax_pay_bank',
    width: 190,
  }, {
    title: this.msg('税费种类'),
    dataIndex: 'tax_name',
    width: 100,
  }, {
    title: this.msg('支付金额'),
    dataIndex: 'tax_actual_paid',
    width: 150,
    render: o => o && o.toFixed(2),
  }, {
    title: this.msg('支付状态'),
    dataIndex: 'tax_paystatus',
    width: 100,
    render: (o) => {
      const status = Object.values(CMS_TAX_PAY_STATUS).filter(st => st.value === o)[0];
      return status && <Tag color={status.tag}>{status.text}</Tag>;
    },
  }, {
    title: this.msg('申报关区'),
    dataIndex: 'tax_customs_master',
    width: 140,
    render: (o) => {
      const declPort = this.props.customs
        .find(f => f.customs_code === o || f.customs_name === o);
      return declPort ? declPort.customs_name : o;
    },
  }, {
    title: this.msg('税单生成时间'),
    dataIndex: 'tax_gen_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD HH:mm'),
  }, {
    title: this.msg('缴款期限'),
    dataIndex: 'tax_due_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD HH:mm'),
  }, {
    title: this.msg('税单支付时间'),
    dataIndex: 'tax_pay_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD HH:mm'),
  }, {
    title: this.msg('银行扣款日期'),
    dataIndex: 'tax_charge_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: this.msg('汇总征税标志'),
    dataIndex: 'tax_ext1_mark',
    width: 100,
  }, {
    dataIndex: 'SPACER_COL',
  }];

  render() {
    return (
      <Card bodyStyle={{ padding: 0 }} style={{ marginBottom: 0 }}>
        <Table
          size="middle"
          columns={this.columns}
          dataSource={this.props.payment}
          rowKey="tax_vouchno"
          pagination={false}
        />
      </Card>
    );
  }
}

