import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import SidePanel from 'client/components/SidePanel';
import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import DescriptionList from 'client/components/DescriptionList';
import RecvablePayableExpenses from './recvablePayableExpenses';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { Description } = DescriptionList;

@injectIntl
@connect(state => ({
  delgExpenses: state.cmsExpense.delgExpenses,
}))
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
export default class ExpenseDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    delgExpenses: PropTypes.shape({
      decl_qty: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      params, delgExpenses,
    } = this.props;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('expenseDetail'), params.delgNo]} />
        <Layout>
          <SidePanel top collapsed onCollapseChange={this.handleCollapseChange}>
            <DescriptionList col={4}>
              <Description term="拼单数">{delgExpenses.decl_qty}</Description>
              <Description term="联单数">{delgExpenses.decl_sheet_qty}</Description>
              <Description term="品项数">{delgExpenses.decl_item_qty}</Description>
              <Description term="料号数">{delgExpenses.trade_item_qty}</Description>
              <Description term="应收账款">{delgExpenses.account_receivale}</Description>
              <Description term="其他应收款">{delgExpenses.other_receivable}</Description>
              <Description term="应付账款">{delgExpenses.account_payable}</Description>
              <Description term="其他应付款">{delgExpenses.other_payable}</Description>
            </DescriptionList>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <RecvablePayableExpenses delgNo={params.delgNo} />
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
