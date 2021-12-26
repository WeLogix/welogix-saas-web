import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Layout, Table, Tabs, Form } from 'antd';
import { loadPartners } from 'common/reducers/partner';
import { PARTNER_ROLES, PARTNER_BUSINESSE_TYPES } from 'common/constants';
import { setResTabkey, setCustomer } from 'common/reducers/cmsResources';
import { loadBillTemplates } from 'common/reducers/cmsManifest';
import connectNav from 'client/common/decorators/connect-nav';
import connectFetch from 'client/common/decorators/connect-fetch';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import TradersPane from './tabpane/tradersPane';
import OverseaEntityPane from './tabpane/overseaEntityPane';
import ManifestRulesPane from './tabpane/manifestRulesPane';
import DocuTemplatesPane from './tabpane/docuTemplatesPane';
import EntQualifPane from './tabpane/entQualifPane';
import CiqUserListPane from './tabpane/ciqUserListPane';
import { formatMsg } from '../message.i18n';


const { Content, Sider } = Layout;

const { TabPane } = Tabs;

function fetchData({ dispatch }) {
  return dispatch(loadPartners({
    role: PARTNER_ROLES.CUS,
    businessType: PARTNER_BUSINESSE_TYPES.clearance,
  }));
}
@connectFetch()(fetchData)
@injectIntl
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmSettings',
})
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    customers: state.partner.partners,
    tabkey: state.cmsResources.tabkey,
    customer: state.cmsResources.customer,
  }),
  { setResTabkey, setCustomer, loadBillTemplates }
)
@Form.create()
export default class ClientsList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tabkey: PropTypes.string.isRequired,
  }
  state = {
    collapsed: false,
    currentPage: 1,
    customers: [],
    searchValue: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.customers !== this.props.customers && !this.props.customer.id) {
      const customer = nextProps.customers.length === 0 ? {} : nextProps.customers[0];
      this.handleRowClick(customer);
    }
    this.setState({
      customers: nextProps.customers,
    });
  }
  handleRowClick = (record) => {
    this.props.setCustomer(record);
    this.props.loadBillTemplates(record.id);
  }
  handleTabChange = (tabkey) => {
    this.props.setResTabkey(tabkey);
  }
  handleSearch = (value) => {
    let { customers } = this.props;
    if (value) {
      customers = this.props.customers.filter((item) => {
        const reg = new RegExp(value);
        return reg.test(item.name) || reg.test(item.partner_code);
      });
    }
    this.setState({ customers, currentPage: 1, searchValue: value });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { customer } = this.props;
    const columns = [{
      dataIndex: 'name',
      key: 'name',
      render: (o, record) => (<span className="menu-sider-item">
        { [record.partner_code, record.name].filter(f => f).join('|') }
      </span>),
    }];
    return (
      <Layout>
        <Sider
          width={320}
          className="menu-sider"
          key="sider"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          collapsedWidth={0}
        >
          <div className="left-sider-panel">
            <div className="toolbar">
              <SearchBox value={this.state.searchValue} onSearch={this.handleSearch} placeholder={this.msg('search')} width="100%" />
            </div>
            <div className="list-body">
              <Table
                size="middle"
                columns={columns}
                dataSource={this.state.customers}
                showHeader={false}
                pagination={{
                  current: this.state.currentPage,
                  defaultPageSize: 15,
                  onChange: this.handlePageChange,
                }}
                rowClassName={record => (record.id === customer.id ? 'table-row-selected' : '')}
                rowKey="id"
                onRow={record => ({
                  onClick: () => { this.handleRowClick(record); },
                })}
              />
            </div>
          </div>
        </Sider>
        <Layout>
          <PageHeader title={customer.name} />
          <Content className="page-content">
            <Card bodyStyle={{ padding: 0 }}>
              <Tabs activeKey={this.props.tabkey} onChange={this.handleTabChange}>
                <TabPane tab="制单规则" key="rules">
                  <ManifestRulesPane />
                </TabPane>
                <TabPane tab="境内收发货人" key="traders">
                  <TradersPane />
                </TabPane>
                <TabPane tab="境外收发货人" key="oversea">
                  <OverseaEntityPane />
                </TabPane>
                <TabPane tab="企业资质" key="entQualif">
                  <EntQualifPane />
                </TabPane>
                <TabPane tab="使用单位联系人" key="ciqUser">
                  <CiqUserListPane />
                </TabPane>
                <TabPane tab="随附单据模板" key="templates">
                  <DocuTemplatesPane />
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
