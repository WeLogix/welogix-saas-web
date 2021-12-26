import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import AddressColumn from '../../common/addressColumn';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  subShipmts: state.transportDispatch.consolidationModal.subShipmts,
}))
export default class SubShpmtPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('shipmtNo'),
    dataIndex: 'shipmt_no',
    width: 120,
  }, {
    title: this.msg('shipRequirement'),
    dataIndex: 'sr_name',
    width: 200,
  }, {
    title: this.msg('consignerPlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
  }, {
    title: this.msg('consigneePlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
  }, {
    title: this.msg('shipPickupDate'),
    dataIndex: 'pickup_est_date',
    width: 90,
    render: (o, record) => moment(record.pickup_est_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('transitTime'),
    dataIndex: 'transit_time',
    width: 90,
  }, {
    title: this.msg('shipDeliveryDate'),
    dataIndex: 'deliver_est_date',
    width: 90,
    render: (o, record) => moment(record.deliver_est_date).format('YYYY.MM.DD'),
  }]
  msg = formatMsg(this.props.intl)
  render() {
    const { subShipmts } = this.props;
    return (
      <DataTable
        columns={this.columns}
        dataSource={subShipmts}
        rowKey="shipmt_no"
      />
    );
  }
}
