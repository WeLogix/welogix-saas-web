import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import { Layout, Tabs, Form } from 'antd';
import { searchWhse, loadWhseContext } from 'common/reducers/cwmContext';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { SCOF_BIZ_OBJECT_KEY, PARTNER_ROLES } from 'common/constants';
import LogsPane from 'client/components/Dock/common/logsPane';
import ToolbarAction from 'client/components/ToolbarAction';
import { loadPartners } from 'common/reducers/partner';
import WhseSelect from '../common/whseSelect';
import OwnersPane from './tabpane/ownersPane';
import SuppliersPane from './tabpane/suppliersPane';
import ReceiversPane from './tabpane/receiversPane';
import CarriersPane from './tabpane/carriersPane';
import ZoneLocationPane from './tabpane/zoneLocationPane';
import BrokersPane from './tabpane/brokersPane';
import SupervisionPane from './tabpane/supervisionPane';
import WhseInfoPane from './tabpane/whseInfoPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

const { TabPane } = Tabs;

@injectIntl
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSettings',
})
@connect(
  state => ({
    whses: state.cwmContext.whses,
    tenantId: state.account.tenantId,
    warehouse: state.cwmContext.defaultWhse,
  }),
  {
    searchWhse,
    loadWhseContext,
    loadPartners,
  }
)
@Form.create()
export default class WarehouseList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    activeWhseTab: 'basic',
  }
  componentDidMount() {
    this.props.loadPartners({
      role: [PARTNER_ROLES.VEN, PARTNER_ROLES.CUS],
    });
  }
  componentWillUnmount() {
    this.props.loadWhseContext();
  }
  msg = formatMsg(this.props.intl)
  handleWhseWizard = () => {
    this.context.router.push('/cwm/warehouse/wizard');
  }
  handleTabChange = (key) => {
    this.setState({ activeWhseTab: key });
  }
  handleSearchWhse = (value) => {
    this.props.searchWhse(value);
  }
  render() {
    const { activeWhseTab } = this.state;
    const { warehouse } = this.props;
    const tabs = [];
    tabs.push(<TabPane tab="基本信息" key="basic">
      <WhseInfoPane
        warehouse={warehouse}
        editable={warehouse.wh_ent_tenant_id === this.props.tenantId}
      />
    </TabPane>);
    if (warehouse.wh_ent_tenant_id === this.props.tenantId) {
      tabs.push(<TabPane tab="货主" key="owners">
        <OwnersPane
          whseCode={warehouse.code}
          whseName={warehouse.name}
          whseTenantId={warehouse.wh_ent_tenant_id}
          warehouse={warehouse}
        />
      </TabPane>);
      tabs.push(<TabPane tab="供货商" key="suppliers">
        <SuppliersPane whseCode={warehouse.code} whseTenantId={warehouse.wh_ent_tenant_id} />
      </TabPane>);
      tabs.push(<TabPane tab="收货人" key="receivers">
        <ReceiversPane whseCode={warehouse.code} whseTenantId={warehouse.wh_ent_tenant_id} />
      </TabPane>);
      tabs.push(<TabPane tab="承运人" key="carriers">
        <CarriersPane whseCode={warehouse.code} whseTenantId={warehouse.wh_ent_tenant_id} />
      </TabPane>);
      tabs.push(<TabPane tab="库区/库位" key="location">
        <ZoneLocationPane warehouse={warehouse} />
      </TabPane>);
      /*
      tabs.push(<TabPane tab="员工" key="staffs">
        <StaffsPane whseCode={warehouse.code} whseTenantId={warehouse.wh_ent_tenant_id} />
      </TabPane>);
      */
      if (warehouse.bonded) {
        tabs.push(<TabPane tab="报关企业" key="brokers">
          <BrokersPane whseCode={warehouse.code} whseTenantId={warehouse.wh_ent_tenant_id} />
        </TabPane>);
      }
      if (warehouse.bonded) {
        tabs.push(<TabPane tab="海关监管" key="supervision">
          <SupervisionPane
            warehouse={warehouse}
          />
        </TabPane>);
      }
      tabs.push(<TabPane tab={this.msg('logs')} key="logs">
        <LogsPane billNo={warehouse.code} bizObject={SCOF_BIZ_OBJECT_KEY.CWM_WHSE.key} />
      </TabPane>);
    }
    return (
      <Layout>
        <Layout>
          <PageHeader breadcrumb={[<WhseSelect />]}>
            <PageHeader.Actions>
              <PrivilegeCover module="cwm" feature="settings" action="create">
                <ToolbarAction
                  primary
                  icon="plus"
                  label="添加仓库"
                  onClick={this.handleWhseWizard}
                />
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs activeKey={activeWhseTab} onChange={this.handleTabChange}>
                {tabs}
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
