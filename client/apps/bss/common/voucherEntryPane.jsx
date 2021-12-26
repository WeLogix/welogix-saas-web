/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataGrid from 'client/components/DataGrid';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
  }),
  { }
)
export default class VoucherEntryPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [
    {
      title: this.msg('摘要'),
      dataIndex: 'digest',
      width: 150,
      editable: true,
    },
    {
      title: this.msg('会计科目'),
      dataIndex: 'subject',
      width: 200,
      editable: true,
    },
    {
      title: this.msg('借方金额'),
      dataIndex: 'debit_amount',
      width: 150,
      align: 'right',
      editable: true,
    },
    {
      title: this.msg('贷方金额'),
      dataIndex: 'credit_amount',
      width: 150,
      align: 'right',
      editable: true,
    },
  ];
  render() {
    return (
      <DataGrid
        form={this.props.form}
        columns={this.columns}
        dataSource={[{ id: 1 }, { id: 2 }]} // mock
        rowKey="id"
      />
    );
  }
}
