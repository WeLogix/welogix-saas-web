import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { TENANT_ASPECT, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { loadBuyerSellerExpenses, loadCurrencies } from 'common/reducers/cmsExpense';
import { addDelegationSpecialFee } from 'common/reducers/bssSetting';
import { getFeeEventMap } from 'common/reducers/cmsPrefEvents';
import LogsPane from 'client/components/Dock/common/logsPane';
import FeesPane from './tabpane/feesPane';
import AddSpeModal from './modals/addSpeModal';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    aspect: state.account.aspect,
    delgExpenses: state.cmsExpense.delgExpenses,
    expensesLoading: state.cmsExpense.expensesLoading,
  }),
  {
    addDelegationSpecialFee, getFeeEventMap, loadBuyerSellerExpenses, loadCurrencies,
  }
)
export default class RecvablePayableExpenses extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    delgNo: PropTypes.string.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { delgNo } = this.props;
    this.props.loadBuyerSellerExpenses({ delgNo });
    this.props.loadCurrencies();
    this.props.getFeeEventMap();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      aspect, delgExpenses, expensesLoading,
    } = this.props;
    if (!delgExpenses.receive && delgExpenses.pays.length === 0) {
      return <div className="ant-table-placeholder">未设置报价或报价中没有关联的费用项</div>;
    }
    const { location } = this.context.router;
    let defaultActiveKey;
    if (location.query.from === 'receivable') {
      if (aspect === TENANT_ASPECT.LSP) {
        defaultActiveKey = 'receivable';
      }
    } else if (location.query.from === 'payable') {
      if (delgExpenses.pays.length === 0) {
        if (aspect === TENANT_ASPECT.LSP) {
          defaultActiveKey = 'receivable';
        }
      } else {
        defaultActiveKey = `payable-${delgExpenses.pays[0].seller_partner_id}`;
      }
    } else if (aspect === TENANT_ASPECT.LSP) {
      defaultActiveKey = 'receivable';
    } else if (delgExpenses.pays.length > 0) {
      defaultActiveKey = `payable-${delgExpenses.pays[0].seller_partner_id}`;
    }
    return (
      <Tabs defaultActiveKey={defaultActiveKey}>
        {aspect === TENANT_ASPECT.LSP && delgExpenses.receive &&
        <TabPane tab="应收明细" key="receivable" >
          <FeesPane
            type="receivable"
            loading={expensesLoading}
            expense={delgExpenses.receive}
            tabName="应收明细"
            delgNo={this.props.delgNo}
          />
        </TabPane> }
        {delgExpenses.pays.map(pay =>
          (<TabPane
            tab={delgExpenses.pays.length === 1 ? '应付明细' : `应付明细-${pay.seller_name}`}
            key={`payable-${pay.seller_partner_id}`}
          >
            <FeesPane
              type="payable"
              loading={expensesLoading}
              expense={pay}
              tabName={delgExpenses.pays.length === 1 ? '应付明细' : `应付明细-${pay.seller_name}`}
              delgNo={this.props.delgNo}
            />
          </TabPane>))}
        <TabPane tab={this.msg('logs')} key="logs">
          <LogsPane
            billNo={this.props.delgNo}
            bizObject={SCOF_BIZ_OBJECT_KEY.CMS_EXPENSE.key}
          />
        </TabPane>
        <AddSpeModal addSpecialFee={this.props.addDelegationSpecialFee} />
      </Tabs>
    );
  }
}
