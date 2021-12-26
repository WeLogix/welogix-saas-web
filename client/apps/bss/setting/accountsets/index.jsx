import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Card, Layout, Tabs, Form, Empty, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import { toggleAccountSetModal, loadAllAccountSubjects, loadAccountSetAccounts } from 'common/reducers/bssSetting';
import AccountSetSelect from '../../common/accountSetSelect';
import SetPane from './tabpane/setPane';
import AccountPane from './tabpane/accountPane';
import CreateAccountSetModal from './modal/createAccountSetModal';
import AccountModal from './modal/accountModal';
import BSSSettingMenu from '../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    currentAccountSet: state.bssSetting.currentAccountSet,
    accountSets: state.bssSetting.accountSets,
  }),
  {
    toggleAccountSetModal, loadAllAccountSubjects, loadAccountSetAccounts,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
@Form.create()
export default class AccountSets extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    accountType: '',
  }
  componentDidMount() {
    if (this.props.currentAccountSet.id) {
      this.props.loadAllAccountSubjects(this.props.currentAccountSet.id);
      this.props.loadAccountSetAccounts(this.props.currentAccountSet.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentAccountSet.id &&
      nextProps.currentAccountSet.id !== this.props.currentAccountSet.id) {
      this.props.loadAllAccountSubjects(nextProps.currentAccountSet.id);
      this.props.loadAccountSetAccounts(nextProps.currentAccountSet.id);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCreateAccountSet = () => {
    this.props.toggleAccountSetModal(true);
  }
  handleAccountSetChange = (value) => {
    const { form: { setFieldsValue }, accountSets, currentAccountSet } = this.props;
    if (value === currentAccountSet.id) {
      return;
    }
    const accountset = accountSets.find(set => set.id === value);
    setFieldsValue({
      company_unique_code: accountset.company_unique_code,
      company_name: accountset.company_name,
      vat_cat: accountset.vat_cat,
    });
    message.info(this.msg('accountSetChanged'));
  }
  hanldeTabChange = (value) => {
    if (value === 'cashAccount') {
      this.setState({
        accountType: 'cash',
      });
    } else if (value === 'bankAccount') {
      this.setState({
        accountType: 'bank',
      });
    }
  }
  render() {
    const { form, accountSets } = this.props;
    const { accountType } = this.state;
    return (
      <Layout>
        <BSSSettingMenu currentKey="accountSets" openKey="paramPrefs" />
        <Layout>
          <PageHeader breadcrumb={[<AccountSetSelect onChange={this.handleAccountSetChange} />]}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.handleCreateAccountSet}>
                {this.msg('newAccountSet')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <Card bodyStyle={{ padding: 0 }}>
              {accountSets.length > 0 ? <Tabs onChange={this.hanldeTabChange} defaultActiveKey="setInfo">
                <TabPane tab={this.msg('setInfo')} key="setInfo">
                  <SetPane form={form} />
                </TabPane>
                <TabPane tab={this.msg('cashAccount')} key="cashAccount">
                  <AccountPane
                    accountType="cash"
                  />
                </TabPane>
                <TabPane tab={this.msg('bankAccount')} key="bankAccount">
                  <AccountPane
                    accountType="bank"
                  />
                </TabPane>
              </Tabs> : <Empty />}
            </Card>
            <CreateAccountSetModal />
            <AccountModal accountType={accountType} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
