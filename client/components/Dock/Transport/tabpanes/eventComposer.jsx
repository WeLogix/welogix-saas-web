import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Icon, Tabs, Steps } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import { showChangeActDateModal } from 'common/reducers/trackingLandStatus';
import { SHIPMENT_VEHICLE_CONNECT, SHIPMENT_TRACK_STATUS, TMS_SHIPMENT_STATUS_DESC } from 'common/constants';
import PickupDeliverForm from './form/pickupDeliverForm';
import DamageForm from './form/damageForm';
import RejectionForm from './form/rejectionForm';
import ComplaintForm from './form/complaintForm';
import ClaimForm from './form/claimForm';
import TransitForm from './form/transitForm';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
const { Step } = Steps;

@injectIntl
@connect(
  state => ({
    disp: state.shipment.previewer.dispatch,
    shipmt: state.shipment.previewer.shipmt,
  }),
  { showChangeActDateModal }
)
export default class EventComposer extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    disp: PropTypes.shape({ sp_tenant_id: PropTypes.number }).isRequired,
    shipmt: PropTypes.shape({ consigner_province: PropTypes.string }).isRequired,
  }
  state = {
    activeKey: 'transit',
  }
  componentDidMount() {
    this.initializeActiveKey(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.initializeActiveKey(nextProps);
  }
  initializeActiveKey = (props) => {
    const { disp } = props;
    const isOfflineSP = (disp.sp_tenant_id === -1) || (disp.sp_tenant_id === 0 &&
      disp.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected);
    let { activeKey } = this.state;
    if (isOfflineSP) {
      if (disp.status === SHIPMENT_TRACK_STATUS.dispatched) {
        activeKey = 'pickup';
      } else if (disp.status === SHIPMENT_TRACK_STATUS.intransit) {
        activeKey = 'transit';
      } else if (disp.status >= SHIPMENT_TRACK_STATUS.delivered) {
        activeKey = 'damage';
      }
    } else if (disp.status >= SHIPMENT_TRACK_STATUS.delivered) {
      activeKey = 'complaint';
    } else {
      activeKey = 'transit';
    }
    this.setState({ activeKey });
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (activeKey) => {
    this.setState({ activeKey });
  }
  handleShowChangeActDateModal = (type) => {
    this.props.showChangeActDateModal(true, type);
  }
  renderTabs() {
    const { disp, shipmt } = this.props;
    const { activeKey } = this.state;
    const originlocation = {
      province: shipmt.consigner_province,
      city: shipmt.consigner_city,
      district: shipmt.consigner_district,
      address: shipmt.consigner_addr,
    };
    const destLocation = {
      province: shipmt.consignee_province,
      city: shipmt.consignee_city,
      district: shipmt.consignee_district,
      address: shipmt.consignee_addr,
    };
    const isOfflineSP = (disp.sp_tenant_id === -1) ||
    (disp.sp_tenant_id === 0
      && disp.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected);
    const pickupEnabled = disp.status === SHIPMENT_TRACK_STATUS.dispatched && isOfflineSP;
    const transitEnabled = disp.status === SHIPMENT_TRACK_STATUS.intransit;
    const deliverEnabled = disp.status === SHIPMENT_TRACK_STATUS.intransit && isOfflineSP;
    const isDelivered = disp.status > SHIPMENT_TRACK_STATUS.intransit;
    const tabs = [
      <TabPane tab={<span><LogixIcon type="icon-upload" />提货</span>} key="pickup" disabled={!pickupEnabled}>
        <PickupDeliverForm type="pickup" estDate={shipmt.pickup_est_date} location={originlocation} />
      </TabPane>,
      <TabPane tab={<span><LogixIcon type="icon-tracking" />在途事件</span>} key="transit" disabled={!transitEnabled}><TransitForm /></TabPane>,
      <TabPane tab={<span><LogixIcon type="icon-download" />送货</span>} key="deliver" disabled={!deliverEnabled}>
        <PickupDeliverForm type="deliver" estDate={shipmt.deliver_est_date} location={destLocation} />
      </TabPane>,
      <TabPane tab={<span><Icon type="exclamation-circle-o" />货差</span>} key="damage" disabled={!isDelivered}><DamageForm /></TabPane>,
      <TabPane tab={<span><LogixIcon type="icon-pod-reject-o" />拒收</span>} key="reject" disabled={!isDelivered}><RejectionForm /></TabPane>,
      <TabPane tab={<span><LogixIcon type="icon-complain" />投诉</span>} key="complaint"><ComplaintForm /></TabPane>,
      <TabPane tab={<span><LogixIcon type="icon-refund" />索赔</span>} key="claim"><ClaimForm /></TabPane>,
    ];
    return (
      <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
        {tabs}
      </Tabs>
    );
  }
  render() {
    const { disp, shipmt } = this.props;

    let statusDesc = TMS_SHIPMENT_STATUS_DESC;
    if (disp.pod_type === 'none') statusDesc = TMS_SHIPMENT_STATUS_DESC.filter(item => item.status <= 5);
    return (
      <Card bodyStyle={{ padding: 8, paddingBottom: 56 }} >
        {this.renderTabs()}
        <div className="card-footer">
          <Steps progressDot current={disp.status - 2}>
            {statusDesc.map((step) => {
              let desc = step.text;
              if (step.status <= disp.status) {
                if (step.status === SHIPMENT_TRACK_STATUS.intransit) {
                  const act = new Date(disp[step.date]);
                  act.setHours(0, 0, 0, 0);
                  const est = new Date(shipmt.pickup_est_date);
                  est.setHours(0, 0, 0, 0);
                  if (act.getTime() > est.getTime()) {
                    desc = (
                      <span className="mdc-text-red">
                        {step.text} {moment(disp[step.date]).format('YYYY.MM.DD')}
                      </span>);
                  } else {
                    desc = disp[step.date] ? `${step.text} ${moment(disp[step.date]).format('YYYY.MM.DD')}` : step.text;
                  }
                  desc = <span>{desc} <a><Icon type="edit" onClick={() => this.handleShowChangeActDateModal('pickupActDate')} /></a></span>;
                } else if (step.status === SHIPMENT_TRACK_STATUS.delivered) {
                  const act = new Date(disp[step.date]);
                  act.setHours(0, 0, 0, 0);
                  const est = new Date(shipmt.deliver_est_date);
                  est.setHours(0, 0, 0, 0);
                  if (act.getTime() > est.getTime()) {
                    desc = (
                      <span className="mdc-text-red">
                        {step.text} {moment(disp[step.date]).format('YYYY.MM.DD')}
                      </span>);
                  } else {
                    desc = disp[step.date] ? `${step.text} ${moment(disp[step.date]).format('YYYY.MM.DD')}` : step.text;
                  }
                  desc = <span>{desc} <a><Icon type="edit" onClick={() => this.handleShowChangeActDateModal('deliverActDate')} /></a></span>;
                } else {
                  desc = disp[step.date] ? `${step.text} ${moment(disp[step.date]).format('YYYY.MM.DD')}` : step.text;
                }
              }
              return (<Step title={desc} key={step.status} />);
            })}
          </Steps>
        </div>
      </Card>
    );
  }
}
