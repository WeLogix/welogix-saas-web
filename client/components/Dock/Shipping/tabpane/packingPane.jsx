import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag } from 'antd';
import { loadPackDetails } from 'common/reducers/cwmOutbound';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  order: state.sofOrders.dock.order,
  packDetails: state.cwmOutbound.packDetails,
  packDetailLoading: state.cwmOutbound.packDetailLoading,
  packDetailTotalCount: state.cwmOutbound.packDetailTotalCount,
}), { loadPackDetails })
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
    this.handleload(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.outboundNo !== this.props.outboundNo) {
      this.handleload(1);
    }
  }
  handlePageChange = (current, pageSize) => {
    this.handleload(current, pageSize);
  }
  handleload = (currentParam, pageSizeParam) => {
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadPackDetails(this.props.outboundNo, current, pageSize).then(() => {
      this.setState({
        pagination: { pageSize, current },
      });
    });
  }
  msg = formatMsg(this.props.intl)
  packColumns = [{
    title: '箱号',
    dataIndex: 'packed_no',
    width: 150,
  }, {
    title: '产品序列号',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 150,
  }, {
    title: '装箱数量',
    dataIndex: 'chkpacked_qty',
    width: 100,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 200,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 150,
    render: o => o && <Tag>{o}</Tag>,
  }]
  render() {
    const { packDetails } = this.props;
    const rowKey = 'id';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.packColumns}
          dataSource={packDetails}
          showToolbar={false}
          scrollOffset={360}
          loading={this.props.packDetailLoading}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.props.packDetailTotalCount,
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
