import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { loadOrderContainers } from 'common/reducers/sofOrders';
import { CMS_CNTNR_SPEC_CUS } from 'common/constants';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(state => ({
  order: state.sofOrders.dock.order,
  containers: state.sofOrders.containers,
}), { loadOrderContainers })
export default class ContainersPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    order: PropTypes.shape({
      shipmt_order_no: PropTypes.string,
    }).isRequired,
  }
  componentDidMount() {
    this.props.loadOrderContainers(this.props.order.shipmt_order_no, true);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '集装箱号',
    dataIndex: 'container_no',
    width: 200,
  }, {
    title: '集装箱规格',
    dataIndex: 'container_type',
    width: 200,
    render: (o) => {
      if (o) {
        const type = CMS_CNTNR_SPEC_CUS.find(cntnr => cntnr.value === o);
        if (type) {
          return type.text;
        }
      }
      return '';
    },
  }, {
    title: '是否拼箱',
    dataIndex: 'is_lcl',
    render: o => (o ? '是' : '否'),
  }]
  render() {
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={this.props.containers}
          rowKey="id"
          showToolbar={false}
          scrollOffset={360}
        />
      </div>
    );
  }
}
