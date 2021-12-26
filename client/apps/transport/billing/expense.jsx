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
  shipmtExpenses: state.tmsExpense.shipmtExpenses,
}))
@connectNav({
  depth: 3,
  moduleName: 'transport',
  title: 'expenseDetail',
})
export default class ExpenseDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    shipmtExpenses: PropTypes.shape({
      decl_qty: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      params, shipmtExpenses,
    } = this.props;
    return (
      <Layout>
        <PageHeader breadcrumb={[params.shipmtNo]} />
        <Layout>
          <SidePanel top collapsed onCollapseChange={this.handleCollapseChange}>
            <DescriptionList col={4}>
              <Description term="重量">{shipmtExpenses.load_wt}</Description>
              <Description term="体积">{shipmtExpenses.load_vol}</Description>
              <Description term="应收账款">{shipmtExpenses.account_receivale}</Description>
              <Description term="其他应收款">{shipmtExpenses.other_receivable}</Description>
              <Description term="应付账款">{shipmtExpenses.account_payable}</Description>
              <Description term="其他应付款">{shipmtExpenses.other_payable}</Description>
            </DescriptionList>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <RecvablePayableExpenses shipmtNo={params.shipmtNo} />
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
