import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadReconIPBStatements, updateImportBill, loadBillHead } from 'common/reducers/bssBill';
import EditableCell from 'client/components/EditableCell';
import { formatMsg } from './message.i18n';


@injectIntl
@connect(
  state => ({
    importReconcileFees: state.bssBill.importReconcileFees,
    importStatementKey: state.bssBill.importStatementKey,
    billTemplateFees: state.bssBill.billTemplateFees,
  }),
  { loadReconIPBStatements, updateImportBill, loadBillHead }
)
export default class ImportBillReconcile extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    billNo: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadReconIPBStatements(this.props.billNo);
  }
  msg = formatMsg(this.props.intl)
  handleEdit = (feeAmount, feeId) => {
    this.props.updateImportBill({
      feeAmount,
      feeId,
    }).then((result) => {
      if (!result.error) {
        this.props.loadReconIPBStatements(this.props.billNo);
        this.props.loadBillHead(this.props.billNo);
      }
    });
  }
  render() {
    const { importReconcileFees, importStatementKey, billTemplateFees } = this.props;
    const columns = [{
      title: importStatementKey,
      dataIndex: 'cust_order_no',
      width: 120,
      align: 'center',
    }].concat(billTemplateFees.map(fee => ({
      title: fee.fee_name,
      children: [{
        title: '计算值',
        dataIndex: `${fee.fee_uid}-1`,
        width: 100,
        align: 'center',
      }, {
        title: '导入值',
        dataIndex: fee.fee_uid,
        width: 100,
        align: 'center',
        render: (o, record) => (<EditableCell
          editable={this.props.editable}
          value={o}
          onSave={value => this.handleEdit(value, record.id)}
        />),
      }],
    })));
    const reconcileStFees = [];
    for (let i = 0; i < importReconcileFees.length; i++) {
      const fee = importReconcileFees[i];
      let statementFee =
      reconcileStFees.filter(item => item.cust_order_no === fee.cust_order_no)[0];
      if (!statementFee) {
        statementFee = {
          cust_order_no: fee.cust_order_no,
          id: fee.id,
        };
        reconcileStFees.push(statementFee);
      }
      if (fee.bill_no !== this.props.billNo) {
        statementFee[`${fee.fee_uid}-1`] = fee.fee_amount;
      } else {
        statementFee[fee.fee_uid] = fee.fee_amount;
      }
    }
    return (
      <Table
        size="middle"
        columns={columns}
        bordered
        dataSource={reconcileStFees}
        rowKey="id"
      />
    );
  }
}
