import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import AddressColumn from '../../../../apps/transport/common/addressColumn';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  subShipmts: state.shipment.previewer.shipmt.children,
}))
export default class SubShipmentsPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('shipmtNo'),
    dataIndex: 'shipmt_no',
    width: 120,
  }, {
    title: this.msg('shipRequirement'),
    dataIndex: 'customer_name',
    width: 200,
  }, {
    title: this.msg('transMode'),
    dataIndex: 'transport_mode',
    width: 120,
  }, {
    title: this.msg('totalCount'),
    dataIndex: 'total_count',
    width: 120,
  }, {
    title: this.msg('totalWeight'),
    dataIndex: 'total_weight',
    width: 120,
  }, {
    title: this.msg('totalVolume'),
    dataIndex: 'total_volume',
    width: 120,
  }, {
    title: this.msg('shipPickupDate'),
    dataIndex: 'pickup_est_date',
    width: 90,
    render: (o, record) => moment(record.pickup_est_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('shipConsigner'),
    dataIndex: 'consigner_name',
    width: 120,
  }, {
    title: this.msg('consignerPlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
  }, {
    title: this.msg('consignerAddr'),
    dataIndex: 'consigner_addr',
    width: 120,
  }, {
    title: this.msg('shipDeliveryDate'),
    dataIndex: 'deliver_est_date',
    width: 90,
    render: (o, record) => moment(record.deliver_est_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('consigneePlace'),
    width: 250,
    render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
  }, {
    title: this.msg('transitTime'),
    dataIndex: 'transit_time',
    width: 90,
  }, {
    title: this.msg('shipConsignee'),
    dataIndex: 'consignee_name',
    width: 120,
  }, {
    title: this.msg('consigneeAddr'),
    dataIndex: 'consignee_addr',
    width: 120,
  }]

  render() {
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={this.props.subShipmts}
          showToolbar={false}
          scrollOffset={360}
        />
      </div>
    );
  }
}
