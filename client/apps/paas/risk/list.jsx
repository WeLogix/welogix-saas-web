import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import SidePanel from 'client/components/SidePanel';
// import RowAction from 'client/components/RowAction';

// import { LogixIcon } from 'client/components/FontIcon';
import { PAAS_RISK_POLICIES } from 'common/constants';
import PaaSMenu from '../menu';
import UnitPricePolicy from './policy/unitPricePolicy';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  () => ({}),
  { }
)
export default class RadarRuleList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    menuKey: PAAS_RISK_POLICIES[0].key,
  }
  msg = formatMsg(this.props.intl)

  handleMenuClick = ({ key }) => {
    this.setState({ menuKey: key });
  }

  render() {
    const { menuKey } = this.state;
    return (
      <Layout>
        <PaaSMenu currentKey="alertRule" openKey="flowRule" />
        <Layout>
          <PageHeader title={this.msg('alertRule')} />
          <Layout>
            <SidePanel width={200}>
              <Menu
                mode="inline"
                onClick={this.handleMenuClick}
                openKeys={['cusDeclRisk']}
                selectedKeys={[menuKey]}
              >
                <Menu.ItemGroup title="风控策略">
                  <Menu.SubMenu key="cusDeclRisk" title="海关合规风控">
                    {
                        PAAS_RISK_POLICIES.map(policy =>
                          <Menu.Item key={policy.key}>{policy.name}</Menu.Item>)
                      }
                  </Menu.SubMenu>
                </Menu.ItemGroup>
              </Menu>
            </SidePanel>
            <Content className="page-content" key="main">
              {menuKey === PAAS_RISK_POLICIES[0].key && <UnitPricePolicy />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
