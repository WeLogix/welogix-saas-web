import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleNewExRateModal } from 'common/reducers/bssExRateSettings';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import TenantExChangeRate from './tenantExchangeRate';
import CustomsExchangeRate from './customsExchangeRate';
import BSSSettingMenu from '../menu';
import CurrencyModal from './modals/currencyModal';
import CustomsExchangeHistoryModal from './modals/customsExchangeHistoryModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    visible: state.bssExRateSettings.visibleExRateModal,
    exRateList: state.bssExRateSettings.exRateList,
    currencies: state.saasParams.latest.currency,
  }),
  {
    toggleNewExRateModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
export default class Currencies extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    currentTab: 'customsExRates',
  }
  msg = formatMsg(this.props.intl)
  handleCreateExRate = () => {
    this.props.toggleNewExRateModal(true);
  }
  handleTabChange = (key) => {
    this.setState({ currentTab: key });
  }
  render() {
    const { currentTab } = this.state;
    const menus = [
      {
        key: 'customsExRates',
        menu: this.msg('customsExRates'),
        default: true,
      },
      {
        key: 'copExRates',
        menu: this.msg('copExRates'),
      },
    ];
    return (
      <Layout>
        <BSSSettingMenu currentKey="currencies" openKey="paramPrefs" />
        <Layout>
          <PageHeader menus={menus} onTabChange={this.handleTabChange}>
            <PageHeader.Actions>
              {currentTab === 'copExRates' && <Button type="primary" icon="plus" onClick={this.handleCreateExRate}>
                {this.msg('addCopExRate')}
              </Button>}
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            {currentTab === 'copExRates' && <TenantExChangeRate />}
            {currentTab === 'customsExRates' && <CustomsExchangeRate />}
          </Content>
          <CurrencyModal reload={this.handleRateLoad} />
          <CustomsExchangeHistoryModal />
        </Layout>
      </Layout>
    );
  }
}
