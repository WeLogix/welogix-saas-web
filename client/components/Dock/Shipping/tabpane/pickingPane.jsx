import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag } from 'antd';
import { loadPickDetails } from 'common/reducers/cwmOutbound';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  pickDetails: state.cwmOutbound.pickDetails,
  pickDetailTotalCount: state.cwmOutbound.pickDetailStat.pickDetailTotalCount,
  pickDetailLoading: state.cwmOutbound.pickDetailStat.pickDetailLoading,
}), { loadPickDetails })
export default class PickingPane extends React.Component {
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
    this.props.loadPickDetails(this.props.outboundNo, current, pageSize).then(() => {
      this.setState({
        pagination: { pageSize, current },
      });
    });
  }
  msg = formatMsg(this.props.intl)
  pickColumns = [{
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '产品序列号',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 100,
  }, {
    title: '库位',
    dataIndex: 'location',
    width: 100,
    render: o => o && <Tag>{o}</Tag>,
  }, {
    title: '分配数量',
    dataIndex: 'alloc_qty',
    width: 100,
  }, {
    title: '拣货数量',
    dataIndex: 'picked_qty',
    width: 100,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 200,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    render: o => o && <Tag>{o}</Tag>,
  }]
  render() {
    const { pickDetails } = this.props;
    const rowKey = 'id';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.pickColumns}
          dataSource={pickDetails}
          showToolbar={false}
          scrollOffset={360}
          loading={this.props.pickDetailLoading}
          pagination={{
            showSizeChanger: true,
            total: this.props.pickDetailTotalCount,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
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
