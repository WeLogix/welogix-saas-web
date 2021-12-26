import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, Menu } from 'antd';
import PageContent from 'client/components/PageContent';
import PageHeader from 'client/components/PageHeader';
import ToolbarAction from 'client/components/ToolbarAction';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import PayingTable from './payingTable';
import IncomingTable from './incomingTable';
import JournalTable from './journalTable';
import AccountSetSelect from '../common/accountSetSelect';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    auditslist: state.bssAudit.auditslist,
    listFilter: state.bssAudit.listFilter,
    loading: state.bssAudit.loading,
  }),
  {
    loadPartners,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssPayment',
})
export default class PaymentList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    view: 'paying',
  }
  componentDidMount() {
    this.props.loadPartners({ role: PARTNER_ROLES.CUS });
  }
  msg = formatMsg(this.props.intl)
  handleViewMenuClick = (ev) => {
    this.setState({ view: ev.key });
  }

  render() {
    const { view } = this.state;
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[
            <AccountSetSelect onChange={this.handleWhseChange} />,
          ]}
          extra={<Menu
            mode="horizontal"
            selectedKeys={[view]}
            onClick={this.handleViewMenuClick}
          >
            <Menu.Item key="paying">付款</Menu.Item>
            <Menu.Item key="incoming">收款</Menu.Item>
            <Menu.Item key="cashJournal">现金日记账</Menu.Item>
            <Menu.Item key="bankJournal">银行日记账</Menu.Item>
          </Menu>}
        >
          <PageHeader.Actions>
            <ToolbarAction
              primary
              icon="upload"
              onClick={this.handleRequestPayment}
              label={this.msg('银行对账单')}
            />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          {view === 'paying' && <PayingTable />}
          {view === 'incoming' && <IncomingTable />}
          {view === 'cashJournal' && <JournalTable />}
          {view === 'bankJournal' && <JournalTable />}
        </PageContent>
      </Layout>
    );
  }
}
