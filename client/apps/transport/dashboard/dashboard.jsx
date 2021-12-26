import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege from 'client/common/decorators/withPrivilege';
import { Col, Layout, Row } from 'antd';
import { changeDockStatus } from 'common/reducers/transportDispatch';
import ShipmentAdvanceModal from 'client/apps/transport/tracking/modals/shipment-advance-modal';
import CreateSpecialCharge from 'client/apps/transport/tracking/modals/create-specialCharge';
import StatsPanel from './panel/statsPanel';
import TodoPanel from './panel/todoPanel';
import DispatchDock from '../dispatch/dispatchDock';
import SegmentDock from '../dispatch/segmentDock';
import { formatMsg } from './message.i18n';


const { Content } = Layout;

@injectIntl
@connect(
  () => ({
  }),
  { changeDockStatus }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsDashboard',
})
@withPrivilege({ module: 'transport', feature: 'dashboard' })
export default class Dashboard extends React.Component {
  static propTypes = {
    changeDockStatus: PropTypes.func.isRequired,
  }
  state = {
    collapsed: true,
  }
  msg = formatMsg(this.props.intl)
  handleDispatchDockClose = () => {
    this.props.changeDockStatus({ dispDockShow: false, shipmts: [] });
  }
  handleSegmentDockClose = () => {
    this.props.changeDockStatus({ segDockShow: false, shipmts: [] });
  }
  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }
  render() {
    return (
      <Layout>
        <Content className="page-content" key="main">
          <Row gutter={16}>
            <Col sm={24} md={24}>
              <StatsPanel />
              <TodoPanel />
            </Col>
          </Row>
        </Content>
        <DispatchDock
          onClose={this.handleDispatchDockClose}
        />
        <SegmentDock
          onClose={this.handleSegmentDockClose}
        />
        <ShipmentAdvanceModal />
        <CreateSpecialCharge />
      </Layout>
    );
  }
}
