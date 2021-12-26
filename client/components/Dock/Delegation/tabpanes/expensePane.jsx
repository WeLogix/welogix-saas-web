import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Spin, Card, Collapse, Table } from 'antd';
import { loadRevenueCost } from 'common/reducers/cmsExpense';
import { EXPENSE_CATEGORIES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Column } = Table;
const { Panel } = Collapse;
const categoryKeys = EXPENSE_CATEGORIES.filter(ec => ec.key !== 'all').map(ec => ec.key);

@injectIntl
@connect(
  state => ({
    expensesLoading: state.cmsExpense.expensesLoading,
    expenses: state.cmsExpense.expenses,
    delgNo: state.cmsDelegationDock.previewer.delegation.delg_no,
  }),
  { loadRevenueCost }
)
export default class ExpensePane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    expenses: PropTypes.shape({
      revenue: PropTypes.arrayOf(PropTypes.shape({ fee_name: PropTypes.string.isRequired })),
      allcost: PropTypes.arrayOf(PropTypes.shape({
        vendor: PropTypes.string.isRequired,
        fees: PropTypes.arrayOf(PropTypes.shape({ fee_name: PropTypes.string.isRequired })),
      })),
      parameters: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    delgNo: PropTypes.string.isRequired,
  }
  state = {
    checkedExpCates: categoryKeys,
  }
  componentDidMount() {
    this.props.loadRevenueCost(this.props.delgNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.delgNo !== this.props.delgNo) {
      nextProps.loadRevenueCost(nextProps.delgNo);
    }
  }
  msg = formatMsg(this.props.intl)
  columnFields = [{
    title: this.msg('feeName'),
    dataIndex: 'fee_name',
    key: 'fee_name',
    render: (text, row) => {
      const categ = EXPENSE_CATEGORIES.filter(ec => ec.key === row.fee_type)[0];
      return <span>{text}{categ && <span className="ant-badge-status-dot" style={{ backgroundColor: categ.color }} />}</span>;
    },
  }, {
    title: this.msg('feeRemark'),
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: this.msg('feeVal'),
    dataIndex: 'orig_amount',
    key: 'orig_amount',
  }, {
    title: this.msg('taxFee'),
    dataIndex: 'tax',
    key: 'tax',
  }, {
    title: this.msg('totalFee'),
    dataIndex: 'sum_amount',
    key: 'sum_amount',
  }]
  renderCostFeeName = (text, row) => {
    if (row.key === 'vendor') {
      return {
        children: text,
        props: {
          colSpan: 5,
        },
      };
    }
    const categ = EXPENSE_CATEGORIES.filter(ec => ec.key === row.fee_type)[0];
    return <span>{text}{categ && <span className="ant-badge-status-dot" style={{ backgroundColor: categ.color }} />}</span>;
  }
  renderCostFeeColumn = (text, row) => {
    const col = { children: text, props: { } };
    if (row.key === 'vendor') {
      col.props.colSpan = 0;
    }
    return col;
  }
  renderParamName = (text, row) => row.seller_name || row.buyer_name;
  render() {
    const { expenses: { revenue, allcost, parameters }, expensesLoading } = this.props;
    const { checkedExpCates } = this.state;
    const revenueFees = revenue.filter(rev => checkedExpCates.indexOf(rev.fee_type) !== -1);
    if (revenueFees.length > 0) {
      const totalFee = revenueFees.reduce((res, bsf) => ({
        orig_amount: res.orig_amount + parseFloat(bsf.orig_amount) || 0,
        tax: res.tax + parseFloat(bsf.tax) || 0,
        sum_amount: res.sum_amount + parseFloat(bsf.sum_amount) || 0,
      }), {
        orig_amount: 0,
        tax: 0,
        sum_amount: 0,
      });
      revenueFees.push({
        fee_name: '合计',
        orig_amount: totalFee.orig_amount.toFixed(2),
        tax: totalFee.tax.toFixed(2),
        sum_amount: totalFee.sum_amount.toFixed(2),
      });
    }
    let costFees = allcost.reduce((res, cost) =>
      res.concat({ key: 'vendor', fee_name: cost.vendor }).concat(cost.fees.filter(ct =>
        checkedExpCates.indexOf(ct.fee_type) !== -1)), []);
    /*
      if (allcost.length === 1) {
        costFees = costFees.filter(cd => cd.key !== 'vendor');
      } */
    if (costFees.filter(cf => cf.key !== 'vendor').length > 0) {
      const totalCost = costFees.filter(cf => cf.key !== 'vendor').reduce((res, cfe) => ({
        orig_amount: res.orig_amount + parseFloat(cfe.orig_amount) || 0,
        tax: res.tax + parseFloat(cfe.tax) || 0,
        sum_amount: res.sum_amount + parseFloat(cfe.sum_amount) || 0,
      }), {
        orig_amount: 0,
        tax: 0,
        sum_amount: 0,
      });
      costFees.push({
        fee_name: '合计',
        orig_amount: totalCost.orig_amount.toFixed(2),
        tax: totalCost.tax.toFixed(2),
        sum_amount: totalCost.sum_amount.toFixed(2),
      });
    } else {
      costFees = [];
    }
    return (
      <div className="pane-content tab-pane">
        <Spin spinning={expensesLoading}>
          <Card bodyStyle={{ padding: 0 }} >
            <Collapse bordered={false} defaultActiveKey={['revenue', 'cost']}>
              <Panel header={this.msg('receivable')} key="revenue" className="table-panel">
                <Table
                  size="small"
                  columns={this.columnFields}
                  dataSource={revenueFees}
                  rowKey="fee_name"
                  pagination={false}
                />
              </Panel>
              <Panel header={this.msg('payable')} key="cost" className="table-panel">
                <Table size="small" dataSource={costFees} rowKey="fee_name" pagination={false}>
                  <Column title={this.msg('feeName')} dataIndex="fee_name" render={this.renderCostFeeName} />
                  <Column title={this.msg('feeRemark')} dataIndex="remark" render={this.renderCostFeeColumn} />
                  <Column title={this.msg('feeVal')} dataIndex="orig_amount" render={this.renderCostFeeColumn} />
                  <Column title={this.msg('taxFee')} dataIndex="tax" render={this.renderCostFeeColumn} />
                  <Column title={this.msg('totalFee')} dataIndex="sum_amount" render={this.renderCostFeeColumn} />
                </Table>
              </Panel>
              <Panel header="计费参数" key="params" className="table-panel">
                <Table size="small" pagination={false} dataSource={parameters}>
                  <Column title="计费对象" dataIndex="name" render={this.renderParamName} />
                  <Column title="运单数量" dataIndex="shipmt_qty" />
                  <Column title="报关单数量" dataIndex="decl_qty" />
                  <Column title="报关单联数" dataIndex="decl_sheet_qty" />
                  <Column title="品名数量" dataIndex="decl_item_qty" />
                  <Column title="料件数量" dataIndex="trade_item_qty" />
                  <Column title="货值" dataIndex="trade_amount" />
                  {/* <Column title="办证数量" dataIndex="cert_qty" /> */}
                </Table>
              </Panel>
            </Collapse>
          </Card>
        </Spin>
      </div>
    );
  }
}
