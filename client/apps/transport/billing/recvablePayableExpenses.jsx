import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { TENANT_ASPECT } from 'common/constants';
import { loadBuyerSellerExpenses, loadCurrencies } from 'common/reducers/tmsExpense';
import { getFeeEventMap } from 'common/reducers/cmsPrefEvents';
import { addFreightSpecialFee } from 'common/reducers/bssSetting';
import FeesPane from './tabpane/feesPane';
import AddSpeModal from '../../cms/billing/modals/addSpeModal';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    aspect: state.account.aspect,
    shipmtExpenses: state.tmsExpense.shipmtExpenses,
    expensesLoading: state.tmsExpense.expensesLoading,
  }),
  {
    getFeeEventMap, addFreightSpecialFee, loadBuyerSellerExpenses, loadCurrencies,
  }
)
export default class RecvablePayableExpenses extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    shipmtNo: PropTypes.string.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { shipmtNo } = this.props;
    this.props.loadBuyerSellerExpenses({ shipmtNo });
    this.props.loadCurrencies();
    this.props.getFeeEventMap();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      aspect, shipmtExpenses, expensesLoading,
    } = this.props;
    if (!shipmtExpenses.receive && shipmtExpenses.pays.length === 0) {
      return <div className="ant-table-placeholder">未设置报价或报价中没有关联的费用项</div>;
    }
    const { location } = this.context.router;
    let defaultActiveKey;
    if (location.query.from === 'receivable') {
      if (aspect === TENANT_ASPECT.LSP) {
        defaultActiveKey = 'receivable';
      }
    } else if (location.query.from === 'payable') {
      if (shipmtExpenses.pays.length === 0) {
        if (aspect === TENANT_ASPECT.LSP) {
          defaultActiveKey = 'receivable';
        }
      } else {
        defaultActiveKey = `payable-${shipmtExpenses.pays[0].seller_partner_id}`;
      }
    } else if (aspect === TENANT_ASPECT.LSP) {
      defaultActiveKey = 'receivable';
    } else if (shipmtExpenses.pays.length > 0) {
      defaultActiveKey = `payable-${shipmtExpenses.pays[0].seller_partner_id}`;
    }
    return (
      <Tabs defaultActiveKey={defaultActiveKey}>
        {aspect === TENANT_ASPECT.LSP && shipmtExpenses.receive &&
        <TabPane tab="应收明细" key="receivable" >
          <FeesPane
            type="receivable"
            loading={expensesLoading}
            expense={shipmtExpenses.receive}
          />
        </TabPane> }
        {shipmtExpenses.pays.map(pay =>
          (<TabPane
            tab={shipmtExpenses.pays.length === 1 ? '应付明细' : `应付明细-${pay.seller_name}`}
            key={`payable-${pay.seller_partner_id}`}
          >
            <FeesPane
              type="payable"
              loading={expensesLoading}
              expense={pay}
            />
          </TabPane>))}
        <AddSpeModal addSpecialFee={this.props.addFreightSpecialFee} />
      </Tabs>
    );
  }
}
