import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import CommInvoiceDock from './CommInvoice';
import PartnerDock from './Partner';
import ShipmentDock from './Shipment';
import DeclarationDock from './Declaration';
import DelegationDock from './Delegation';
import ReceivingDock from './Receiving';
import ShippingDock from './Shipping';
import TransportDock from './Transport';
import CwmBlBookDock from './BlBook';

@connect(
  () => ({
  }),
  { toggleBizDock },
)
export default class DockBridgePool extends React.Component {
  static propTypes = {
    toggleBizDock: PropTypes.func.isRequired,
  }
  handleCommInvClose = () => {
    this.props.toggleBizDock('sofCommInv');
  }
  handlePartnerClose = () => {
    this.props.toggleBizDock('ssoPartner');
  }
  handleBlBookClose = () => {
    this.props.toggleBizDock('cwmBlBook');
  }
  handleCmsDeclClose = () => {
    this.props.toggleBizDock('cmsDeclaration');
  }
  render() {
    return [
      <CommInvoiceDock key="comminv" onDockClose={this.handleCommInvClose} />,
      <ShipmentDock key="shipment" />,
      <PartnerDock key="partner" onDockClose={this.handlePartnerClose} />,
      <DeclarationDock key="cmsdeclaration" onDockClose={this.handleCmsDeclClose} />,
      <DelegationDock key="cmsdelegation" />,
      <ReceivingDock key="cwmasn" />,
      <ShippingDock key="cwmso" />,
      <TransportDock key="tmsfreight" />,
      <CwmBlBookDock key="cwmblbook" onDockClose={this.handleBlBookClose} />];
  }
}
