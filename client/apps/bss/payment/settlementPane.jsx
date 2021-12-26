/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import RowAction from 'client/components/RowAction';
import DataGrid from 'client/components/DataGrid';
import { intlShape, injectIntl } from 'react-intl';
import { getSettlement, setSettlements, setPaymentDetails } from 'common/reducers/bssPayment';
import { BSS_INV_TYPE } from 'common/constants';
import OrderSelect from '../common/orderSelect';
import { formatMsg } from '../common/message.i18n';

@injectIntl
@connect(
  state => ({
    settlements: state.bssPayment.settlements,
    paymentDetails: state.bssPayment.paymentDetails,
  }),
  { getSettlement, setSettlements, setPaymentDetails },
)
export default class SettlementPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    paymentType: PropTypes.number,
    disabled: PropTypes.bool,
  };
  msg = formatMsg(this.props.intl);
  columns = [
    {
      title: this.msg('seqNo'),
      dataIndex: 'settlemtIndex',
      width: 45,
      align: 'center',
      className: 'table-col-seq',
      render: o => o + 1,
    },
    {
      title: this.msg('invoiceDate'),
      dataIndex: 'invoice_date',
      width: 200,
      render: invDate => invDate && moment(invDate).format('YYYY-MM-DD'),
    },
    {
      title: this.msg('settlementNo'),
      dataIndex: 'settlement_no',
      width: 200,
      render: (o, record) => {
        if (this.props.paymentType === 1 || this.props.disabled) {
          return o || null;
        }
        return (<OrderSelect
          index={record.settlemtIndex}
          handleSelect={this.handleSelect}
          bizType="settlement"
          value={o}
        />);
      },
    },
    {
      title: this.msg('invoiceType'),
      dataIndex: 'invoice_type',
      width: 150,
      render: (o) => {
        const invType = BSS_INV_TYPE.find(type => type.value === o);
        return invType ? invType.text : null;
      },
    },
    {
      title: this.msg('invoiceNo'),
      dataIndex: 'invoice_no',
      width: 100,
    },
    {
      title: this.msg('invoiceAmount'),
      dataIndex: 'invoice_amount',
      width: 150,
      align: 'right',
    },
    {
      dataIndex: 'SPACER_COL',
    },
    {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'ops-col',
      width: 70,
      fixed: 'right',
      render: (o, record) => {
        if (this.props.paymentType === 1 || this.props.disabled) {
          return null;
        }
        return (
          <span>
            <RowAction
              shape="circle"
              icon="plus-circle"
              onClick={this.handleAddRow}
              tooltip={this.msg('add')}
              row={record}
            />
            <RowAction
              shape="circle"
              icon="close-circle"
              onClick={() => this.handleDelRow(record.settlemtIndex)}
              tooltip={this.msg('delete')}
              row={record}
            />
          </span>
        );
      },
    },
  ];
  handleSelect = (field, value, index) => {
    this.props.getSettlement(value, index);
  }
  handleAddRow = () => {
    const settlements = [...this.props.settlements];
    settlements.push({ settlemtIndex: settlements.length });
    this.props.setSettlements(settlements);
  }
  handleDelRow = (settlemtIndex) => {
    const settlements = [...this.props.settlements];
    if (settlements.length === 1) {
      return;
    }
    const index = settlements.findIndex(item => item.settlemtIndex === settlemtIndex);
    const settlemt = settlements[index];
    if (settlemt.settlement_no) {
      let paymentDetails = [...this.props.paymentDetails];
      paymentDetails = paymentDetails.filter(detail =>
        detail.settlement_no !== settlemt.settlement_no);
      this.props.setPaymentDetails(paymentDetails);
    }
    settlements.splice(index, 1);
    this.props.setSettlements(settlements.map((item, idx) => ({ ...item, settlemtIndex: idx })));
  }
  render() {
    const { settlements } = this.props;
    return (
      <DataGrid
        form={this.props.form}
        columns={this.columns}
        dataSource={settlements}
        rowKey="id"
      />
    );
  }
}
