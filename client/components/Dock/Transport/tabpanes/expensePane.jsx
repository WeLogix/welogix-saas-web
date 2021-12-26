import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Row, Col, Card, Table, Collapse, Badge } from 'antd';
import { EXPENSE_CATEGORIES } from 'common/constants';
import { showAdvanceModal, showSpecialChargeModal } from 'common/reducers/transportBilling';
import { loadShipmtCharges } from 'common/reducers/shipment';
import { formatMsg } from '../message.i18n';

// const Column = Table.Column;
const { Panel } = Collapse;
// const { CheckableTag } = Tag;
const categoryKeys = EXPENSE_CATEGORIES.filter(ec => ec.key !== 'all').map(ec => ec.key);


@injectIntl
@connect(state => ({
  shipmt: state.shipment.previewer.shipmt,
  previewer: state.shipment.previewer,
  allCostFees: state.shipment.allCostFees,
  revenueFees: state.shipment.revenueFees,
}), {
  showAdvanceModal,
  showSpecialChargeModal,
  loadShipmtCharges,
})
export default class ExpensePanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    // tenantId: PropTypes.number.isRequired,
    shipmt: PropTypes.shape().isRequired,
    previewer: PropTypes.shape().isRequired,
    showAdvanceModal: PropTypes.func.isRequired,
    showSpecialChargeModal: PropTypes.func.isRequired,
    loadShipmtCharges: PropTypes.func.isRequired,
    allCostFees: PropTypes.arrayOf().isRequired,
    revenueFees: PropTypes.arrayOf().isRequired,
  }
  state = {
    checkedExpCates: categoryKeys,
  }
  componentDidMount() {
    this.handleLoad(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewer.visible && (nextProps.previewer.dispatch.id !==
      this.props.previewer.dispatch.id || !nextProps.previewer.loaded)) {
      this.handleLoad(nextProps);
    }
  }
  handleLoad = (props) => {
    this.props.loadShipmtCharges({
      shipmtNo: props.shipmt.shipmt_no,
    });
  }
  // handleReload = () => {
  //   this.handleLoad(this.props);
  // }
  msg = formatMsg(this.props.intl)
  currency = (number) => {
    if (!number) return null;
    if (typeof number === 'string') return number;
    return number.toFixed(2);
  }
  feeColumns = [{
    title: this.msg('name'),
    dataIndex: 'name',
    width: 160,
    render: (col, record) => {
      if (record.type === 'serverCharge') {
        return (<Badge status="success" text={col} />);
      } else if (record.type === 'advanceCharge') {
        return (<Badge status="warning" text={col} />);
      } else if (record.type === 'specialCharge') {
        return (<Badge status="error" text={col} />);
      }
      return col;
    },
  }, {
    title: this.msg('feeRemark'),
    dataIndex: 'remark',
    width: 180,
  }, {
    title: this.msg('amount'),
    dataIndex: 'amount',
    width: 80,
    render: this.currency,
  }, {
    title: this.msg('taxFee'),
    dataIndex: 'tax_fee',
    width: 80,
    render: this.currency,
  }, {
    title: this.msg('totalFee'),
    dataIndex: 'total_fee',
    width: 80,
    render: this.currency,
  }]
  paramColumns = [{
    title: this.msg('distance'),
    dataIndex: 'distance',
    render: col => (col ? `${col} 公里` : ''),
  }, {
    title: this.msg('totalWeight'),
    dataIndex: 'total_weight',
    render: col => (col ? `${col} ${this.msg('kilogram')}` : ''),
  }, {
    title: this.msg('totalVolume'),
    dataIndex: 'total_volume',
    render: col => (col ? `${col} ${this.msg('cubicMeter')}` : ''),
  }]
  handleRevenueMenuClick = (e) => {
    const { shipmt, previewer: { dispatch, upstream, downstream } } = this.props;
    const dispId = dispatch.id === downstream.id ? upstream.id : dispatch.id;
    const parentDispId = dispatch.id === downstream.id ? upstream.id : -1;
    if (e.key === 'advanceCharge') {
      this.props.showAdvanceModal({
        visible: true,
        dispId,
        shipmtNo: shipmt.shipmt_no,
        transModeCode: shipmt.transport_mode_code,
        goodsType: shipmt.goods_type,
        type: 1,
      });
    } else if (e.key === 'specialCharge') {
      this.props.showSpecialChargeModal({
        visible: true,
        dispId,
        shipmtNo: shipmt.shipmt_no,
        parentDispId,
        spTenantId: dispatch.sp_tenant_id,
        type: 1,
      });
    }
  }
  handleExpenseMenuClick = (e) => {
    const { shipmt, previewer: { dispatch, upstream, downstream } } = this.props;
    const dispId = dispatch.id === downstream.id ? downstream.id : -1;
    const parentDispId = dispatch.id === downstream.id ? upstream.id : -1;
    if (e.key === 'advanceCharge') {
      this.props.showAdvanceModal({
        visible: true,
        dispId,
        shipmtNo: shipmt.shipmt_no,
        transModeCode: shipmt.transport_mode_code,
        goodsType: shipmt.goods_type,
        type: -1,
      });
    } else if (e.key === 'specialCharge') {
      this.props.showSpecialChargeModal({
        visible: true,
        dispId,
        shipmtNo: shipmt.shipmt_no,
        parentDispId,
        spTenantId: dispatch.sp_tenant_id,
        type: -1,
      });
    }
  }
  assembleChargeItems = (serviceCharges, index) => ({
    type: 'serviceCharges',
    key: `serviceCharges${index}`,
    name: serviceCharges.fee_name,
    remark: serviceCharges.remark,
    amount: serviceCharges.base_amount,
    tax_fee: (serviceCharges.tax_fee || 0),
    total_fee: serviceCharges.sum_amount,
  })
  transAdvanceCharge = (advanceCharge, index) => ({
    type: 'advanceCharge',
    key: `advanceCharge${index}`,
    name: advanceCharge.fee_name,
    remark: advanceCharge.remark,
    amount: advanceCharge.base_amount,
    tax_fee: (advanceCharge.tax_fee || 0),
    total_fee: advanceCharge.sum_amount,
  })
  transSpecialCharge = (specialCharge, index) => ({
    type: 'specialCharge',
    key: `specialCharge${index}`,
    name: '特殊费用',
    remark: specialCharge.remark,
    amount: specialCharge.base_amount,
    tax_fee: 0,
    total_fee: specialCharge.sum_amount,
  })
  calculateTotalCharge = (charges) => {
    const totalCharge = {
      key: 'totalCharge',
      name: '合计',
      remark: '',
      amount: 0,
      tax_fee: 0,
      total_fee: 0,
    };
    charges.forEach((charge) => {
      if (typeof charge.amount === 'number') totalCharge.amount += charge.amount;
      if (typeof charge.tax_fee === 'number') totalCharge.tax_fee += charge.tax_fee;
    });
    totalCharge.total_fee = totalCharge.amount + totalCharge.tax_fee;
    return totalCharge;
  }
  // handleCateTagChange = (tag, checked) => {
  //   if (checked) {
  //     if (tag === 'all') {
  //       this.setState({
  //         checkedExpCates: categoryKeys,
  //       });
  //     } else {
  //       this.setState({
  //         checkedExpCates: [...this.state.checkedExpCates, tag],
  //       });
  //     }
  //   } else {
  //     this.setState({
  //       checkedExpCates: this.state.checkedExpCates.filter(ec => ec !== tag),
  //     });
  //   }
  // }

  render() {
    const {
      intl, shipmt, revenueFees, allCostFees,
    } = this.props;
    const { checkedExpCates } = this.state;
    const revenueds = [];
    const expenseds = [];
    let revenue = 0;
    let expense = 0;
    if (revenueFees) {
      revenueFees.forEach((rev) => {
        revenue += rev.base_amount;
        if (checkedExpCates.indexOf('SC') >= 0 && rev.fee_type === 'SC') {
          revenueds.push(this.assembleChargeItems(rev));
        }
        if (checkedExpCates.indexOf('AP') >= 0 && rev.fee_type === 'AP') {
          revenueds.push(this.transAdvanceCharge(rev));
        }
        if (checkedExpCates.indexOf('SP') >= 0 && rev.fee_type === 'SP') {
          revenueds.push(this.transSpecialCharge(rev));
        }
      });
      revenueds.push(this.calculateTotalCharge(revenueds));
    }
    if (allCostFees) {
      allCostFees.forEach((rev) => {
        expense += rev.base_amount;
        if (checkedExpCates.indexOf('SC') >= 0 && rev.fee_type === 'SC') {
          expenseds.push(this.assembleChargeItems(rev));
        }
        if (checkedExpCates.indexOf('AP') >= 0 && rev.fee_type === 'AP') {
          expenseds.push(this.transAdvanceCharge(rev));
        }
        if (checkedExpCates.indexOf('SP') >= 0 && rev.fee_type === 'SP') {
          expenseds.push(this.transSpecialCharge(rev));
        }
      });
      expenseds.push(this.calculateTotalCharge(expenseds));
    }
    const profit = revenue - expense;
    let profitColor = '#87D068';
    if (profit === 0) {
      profitColor = '#666';
    } else if (profit < 0) {
      profitColor = '#f50';
    }
    // const checkedTags = EXPENSE_CATEGORIES.map((ec) => {
    //   let checked = false;
    //   if (ec.key === 'all') {
    //     checked = checkedExpCates.length + 1 === EXPENSE_CATEGORIES.length;
    //   } else {
    //     checked = checkedExpCates.indexOf(ec.key) !== -1;
    //   }
    //   const tagProps = {};
    //   if (checked) {
    //     tagProps.style = { backgroundColor: ec.color };
    //   }
    //   return (
    //     <CheckableTag
    //       key={ec.key}
    //       checked={checked}
    //       {...tagProps}
    //       onChange={chked => this.handleCateTagChange(ec.key, chked)}
    //     >{ec.text}
    //     </CheckableTag>);
    // });
    const paramDataSource = [{
      key: 0,
      distance: shipmt.distance,
      total_weight: shipmt.total_weight,
      total_volume: shipmt.total_volume,
    }];
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 16 }} >
          <Row>
            <Col span={8}>
              <h5>收入</h5>
              <div style={{ color: '#2DB7F5', fontSize: '18px' }}>{
                intl.formatNumber(revenue.toFixed(2), { style: 'currency', currency: 'cny' })
              }
              </div>
            </Col>
            <Col span={8}>
              <h5>成本</h5>
              <div style={{ color: '#2DB7F5', fontSize: '18px' }}>{
                intl.formatNumber(expense.toFixed(2), { style: 'currency', currency: 'cny' })
              }
              </div>
            </Col>
            <Col span={8}>
              <h5>盈亏</h5>
              <div style={{ color: profitColor, fontSize: '18px' }}>{
                intl.formatNumber(profit.toFixed(2), { style: 'currency', currency: 'cny' })
              }
              </div>
            </Col>
          </Row>
        </Card>
        {/* <div className="pane-header">
          {checkedTags}
          {dispatch.status >= SHIPMENT_TRACK_STATUS.intransit &&
          <div style={{ float: 'right' }}>
            <Dropdown overlay={
              <Menu selectedKeys={[]} onClick={this.handleRevenueMenuClick}>
                <Menu.Item key="advanceCharge">代垫费用</Menu.Item>
                <Menu.Item key="specialCharge">特殊费用</Menu.Item>
              </Menu>
            }
            >
              <a >
                <Icon type="down-circle-o" /> 记录应收 <Icon type="down" />
              </a>
            </Dropdown>
            <Dropdown overlay={
              <Menu selectedKeys={[]} onClick={this.handleExpenseMenuClick}>
                <Menu.Item key="advanceCharge">代垫费用</Menu.Item>
                <Menu.Item key="specialCharge">特殊费用</Menu.Item>
              </Menu>
            }
            >
              <a style={{ marginLeft: 30 }}>
                <Icon type="up-circle-o" /> 记录应付 <Icon type="down" />
              </a>
            </Dropdown>
          </div>}
        </div> */}
        <Card bodyStyle={{ padding: 0 }} >
          <Collapse bordered={false} defaultActiveKey={['revenue', 'cost']}>
            <Panel header={this.msg('revenueDetail')} key="revenue" className="table-panel">
              <Table size="small" columns={this.feeColumns} pagination={false} dataSource={revenueds} />
            </Panel>
            <Panel header={this.msg('costDetail')} key="cost" className="table-panel">
              <Table size="small" columns={this.feeColumns} pagination={false} dataSource={expenseds} />
            </Panel>
            <Panel header="计费参数" key="params" className="table-panel">
              <Table size="small" columns={this.paramColumns} pagination={false} dataSource={paramDataSource} />
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
