import React, { Component } from 'react';
import { loadPartnerList } from 'common/reducers/partner';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Layout, Table, Tabs, Button, Tag } from 'antd';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import { setCurrentPartner, toggleCreateTeamModal } from 'common/reducers/saasCollab';
import SidePanel from 'client/components/SidePanel';
import { PARTNER_ROLES } from 'common/constants';
import ServiceTeamPane from './tabpane/serviceTeamPane';
import CollabFlowPane from './tabpane/collabFlowPane';
import AuthBizObjPane from './tabpane/authBizObjPane';
import CreateTeammodal from './modal/createTeamModal';
import PaaSMenu from '../../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  partnerlist: state.partner.partnerlist,
  partnerFilter: state.partner.partnerFilter,
  currentPartner: state.saasCollab.currentPartner,
}), {
  loadPartnerList,
  setCurrentPartner,
  toggleCreateTeamModal,
})

export default class collabEmpower extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    searchValue: '',
    tabKey: 'serviceTeam',
  }
  componentDidMount() {
    this.handleLoadPartners(1, null, null);
  }
  componentWillReceiveProps(nextProps) {
    // 初次加载将第一个合作伙伴置为active
    if (nextProps.partnerlist.data.length > 0 && this.props.partnerlist.data.length === 0) {
      this.props.setCurrentPartner(nextProps.partnerlist.data[0]);
    }
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    dataIndex: 'name',
    key: 'name',
    render: (o, record) => (<span className="menu-sider-item">
      <Tag>{this.msg(record.role)}</Tag> { [record.partner_code, record.name].filter(f => f).join('|') }
    </span>),
  }]
  handleLoadPartners = (currentPage, currentSize, currentFilter) => {
    const { partnerlist: { pageSize, current }, partnerFilter } = this.props;
    const pageSizeArg = currentSize || pageSize;
    const currentArg = currentPage || current;
    const filtersArg = currentFilter || partnerFilter;
    this.props.loadPartnerList(null, pageSizeArg, currentArg, JSON.stringify(filtersArg));
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadPartners(page, pageSize, null);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.partnerFilter, name: value };
    this.handleLoadPartners(1, null, filter);
  }
  handleRowClick = (record) => {
    if (record.id !== this.props.currentPartner.id) {
      this.props.setCurrentPartner(record);
    }
  }
  handleTabChange = (key) => {
    this.setState({ tabKey: key });
  }
  render() {
    const { currentPartner, partnerlist } = this.props;
    const { searchValue, tabKey } = this.state;
    return (
      <Layout>
        <PaaSMenu currentKey="manage" openKey="collab" />
        <Layout>
          <SidePanel width={320}>
            <div className="left-sider-panel">
              <div className="toolbar">
                <SearchBox
                  value={searchValue}
                  onSearch={this.handleSearch}
                  placeholder={this.msg('search')}
                  width="100%"
                />
              </div>
              <div className="list-body">
                <Table
                  size="middle"
                  columns={this.columns}
                  dataSource={partnerlist.data}
                  pagination={{
                    current: partnerlist.current,
                    defaultPageSize: 15,
                    total: partnerlist.totalCount,
                    onChange: this.handlePageChange,
                  }}
                  rowClassName={record => ((record.id === currentPartner.id) ? 'table-row-selected' : '')}
                  rowKey="id"
                  onRow={record => ({
                    onClick: () => {
                      this.handleRowClick(record);
                    },
                  })}
                />
              </div>
            </div>
          </SidePanel>
          <Layout>
            <PageHeader title={currentPartner.name} />
            <Content className="page-content">
              <Card bodyStyle={{ padding: 0 }}>
                <Tabs
                  activeKey={tabKey}
                  onChange={this.handleTabChange}
                  tabBarExtraContent={
                    tabKey === 'serviceTeam' &&
                    (<Button
                      type="primary"
                      style={{ marginTop: 4 }}
                      onClick={this.props.toggleCreateTeamModal}
                      disabled={currentPartner.role !== PARTNER_ROLES.CUS}
                    >
                      {this.msg('add')}
                    </Button>)
                  }
                >
                  <TabPane tab={this.msg('serviceTeam')} key="serviceTeam">
                    <ServiceTeamPane />
                  </TabPane>
                  <TabPane tab={this.msg('collabFlow')} key="collabFlow">
                    <CollabFlowPane />
                  </TabPane>
                  {currentPartner.partner_tenant_id !== -1 &&
                        currentPartner.role !== PARTNER_ROLES.OWN &&
                        <TabPane tab={this.msg('authorizeBizObj')} key="authorizeBizObj">
                          <AuthBizObjPane />
                        </TabPane>}
                </Tabs>
              </Card>
              <CreateTeammodal />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
