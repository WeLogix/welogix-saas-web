import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import DockPanel from 'client/components/DockPanel';
import { showPartnerModal } from 'common/reducers/partner';
import { PARTNER_ROLES, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { formatMsg } from 'client/apps/scof/partner/message.i18n';
import MasterPane from './tabpanes/masterPane';
import ContractPane from './tabpanes/contractPane';
import TeamPane from './tabpanes/teamPane';
import LogsPane from '../common/logsPane';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.saasDockPool.ssoPartner.visible,
    partner: state.saasDockPool.ssoPartner.customer,
  }),
  { showPartnerModal },
)
export default class PartnerDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    partner: PropTypes.shape({ partner_code: PropTypes.string }).isRequired,
    onDockClose: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCustomerEdit = () => {
    const editPartner = { ...this.props.partner };
    if (editPartner.role === PARTNER_ROLES.OWN) {
      editPartner.role = PARTNER_ROLES.CUS;
    }
    this.props.showPartnerModal('edit', editPartner);
  }

  render() {
    const { partner, visible } = this.props;
    let label = '';
    if (partner.role === PARTNER_ROLES.CUS || partner.role === PARTNER_ROLES.OWN) {
      label = this.msg('customer');
    } else if (this.props.partner.role === PARTNER_ROLES.SUP) {
      label = this.msg('supplier');
    } else if (this.props.partner.role === PARTNER_ROLES.VEN) {
      label = this.msg('vendor');
    }
    return (
      <DockPanel
        label={label}
        title={partner.name}
        size="large"
        visible={visible}
        onClose={this.props.onDockClose}
        onEdit={this.handleCustomerEdit}
      >
        <Tabs defaultActiveKey="masterInfo">
          <TabPane tab={this.msg('masterInfo')} key="masterInfo" >
            <MasterPane partner={partner} />
          </TabPane>
          <TabPane tab={this.msg('合同信息')} key="contract" >
            <ContractPane partner={partner} />
          </TabPane>
          <TabPane tab={this.msg('serviceTeam')} key="team" >
            <TeamPane partner={partner} />
          </TabPane>
          <TabPane tab={this.msg('logs')} key="logs" >
            <LogsPane
              billNo={String(partner.id)}
              bizObject={SCOF_BIZ_OBJECT_KEY.SAAS_PARTNER.key}
            />
          </TabPane>
        </Tabs>
      </DockPanel>);
  }
}
