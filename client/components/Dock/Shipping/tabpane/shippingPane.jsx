import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { loadShipDetails } from 'common/reducers/cwmOutbound';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(state => ({
  order: state.sofOrders.dock.order,
  shipDetails: state.cwmOutbound.shipDetails,
  shipDetailTotalCount: state.cwmOutbound.shipDetailTotalCount,
  shipDetailLoading: state.cwmOutbound.shipDetailLoading,
}), { loadShipDetails })
export default class InboundPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    pagination: {
      pageSize: 20,
      current: 1,
    },
  }
  componentDidMount() {
    this.handleLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.outboundNo !== this.props.outboundNo) {
      this.handleLoad(1);
    }
  }
  handlePageChange = (current, pageSize) => {
    this.handleLoad(current, pageSize);
  }
  handleLoad = (currentParam, pageSizeParam) => {
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadShipDetails(this.props.outboundNo, current, pageSize)
      .then(() => {
        this.setState({ pagination: { current, pageSize } });
      });
  }
  msg = formatMsg(this.props.intl)
  shipColumns = [{
    title: '装车/配送单号',
    dataIndex: 'waybill',
    width: 150,
  }, {
    title: 'DropID',
    dataIndex: 'drop_id',
    width: 150,
  }, {
    title: '箱号',
    dataIndex: 'packed_no',
    width: 150,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 200,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 100,
  }, {
    title: '发货数量',
    dataIndex: 'shipped_qty',
    width: 100,
  }]
  render() {
    const { shipDetails } = this.props;
    const rowKey = 'id';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.shipColumns}
          dataSource={shipDetails}
          showToolbar={false}
          scrollOffset={360}
          loading={this.props.shipDetailLoading}
          pagination={{
            showSizeChanger: true,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.props.shipDetailTotalCount,
            onChange: this.handlePageChange,
            onShowSizeChange: this.handlePageChange,
            showTotal: total => `共 ${total} 条`,
          }}
          rowKey={rowKey}
        />
      </div>
    );
  }
}
