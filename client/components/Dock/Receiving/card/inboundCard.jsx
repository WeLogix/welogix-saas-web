import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Card, Tabs, Select } from 'antd';
import DataTable from 'client/components/DataTable';
import { loadInboundProductDetails, loadInboundPutaways } from 'common/reducers/cwmReceive';

const { TabPane } = Tabs;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    totalCount: state.cwmReceive.inboundPutaways.totalCount,
    loading: state.cwmReceive.inboundPutaways.loading,
    inboundProducts: state.cwmReceive.inboundProducts,
    inboundPutaways: state.cwmReceive.inboundPutaways.list,
    productsTotalCount: state.cwmReceive.productsTotalCount,
    inbProductLoading: state.cwmReceive.inbProductLoading,
  }),
  { loadInboundProductDetails, loadInboundPutaways }
)

export default class InboundCard extends Component {
  static propTypes = {
    inboundNo: PropTypes.string.isRequired,
  }
  state = {
    putawayPagination: {
      pageSize: 20,
      current: 1,
    },
    recDetailsPagination: {
      pageSize: 20,
      current: 1,
    },
  }
  componentDidMount() {
    this.handleRecDetailsLoad(1);
    this.handleInboundPutawaysLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.inboundNo !== this.props.inboundNo) {
      this.handleRecDetailsLoad(1);
      this.handleInboundPutawaysLoad(1);
    }
  }
  handleRecDetailsPageChange = (current, pageSize) => {
    this.handleRecDetailsLoad(current, pageSize);
  }
  handleRecDetailsLoad = (currentParam, pageSizeParam) => {
    const current = currentParam || this.state.recDetailsPagination.current;
    const pageSize = pageSizeParam || this.state.recDetailsPagination.pageSize;
    this.props.loadInboundProductDetails(this.props.inboundNo, current, pageSize)
      .then((result) => {
        if (!result.error) {
          this.setState({
            recDetailsPagination: { current, pageSize },
          });
        }
      });
  }
  handlePutawayPageChange = (current, pageSize) => {
    this.handleInboundPutawaysLoad(current, pageSize);
  }
  handleInboundPutawaysLoad = (currentParam, pageSizeParam) => {
    const current = currentParam || this.state.putawayPagination.current;
    const pageSize = pageSizeParam || this.state.putawayPagination.pageSize;
    this.props.loadInboundPutaways(this.props.inboundNo, current, pageSize)
      .then((result) => {
        if (!result.error) {
          this.setState({
            putawayPagination: { current, pageSize },
          });
        }
      });
  }
  inboundColumns = [{
    title: '????????????',
    dataIndex: 'product_no',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'expect_qty',
    width: 100,
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '????????????',
    dataIndex: 'received_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (record.received_qty === record.expect_qty) {
        return (<span className="text-success">{o}</span>);
      } else if (record.received_qty < record.expect_qty) {
        return (<span className="text-warning">{o}</span>);
      } else if (record.received_qty > record.expect_qty) {
        return (<span className="text-error">{o}</span>);
      }
      return null;
    },
  }, {
    title: '????????????',
    dataIndex: 'damage_level',
    width: 120,
    render: damage => (
      <Select size="small" className="readonly" value={damage} style={{ width: 100 }} disabled>
        <Option value={0}>??????</Option>
        <Option value={1}>????????????</Option>
        <Option value={2}>??????</Option>
        <Option value={3}>??????</Option>
        <Option value={4}>????????????</Option>
      </Select>),
  }]

  putawayColumns = [{
    title: '????????????',
    dataIndex: 'product_no',
    width: 120,
  }, {
    title: 'SKU',
    dataIndex: 'product_sku',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'inbound_qty',
    width: 180,
    align: 'right',
  }, {
    title: '????????????',
    dataIndex: 'putaway_location',
    width: 120,
  }]
  render() {
    const {
      inboundPutaways, inboundProducts, loading, totalCount,
      productsTotalCount, inbProductLoading,
    } = this.props;
    return (
      <Card bodyStyle={{ padding: 0 }} >
        <Tabs defaultActiveKey="inbound">
          <TabPane tab="????????????" key="inbound">
            <div className="table-panel table-fixed-layout">
              <DataTable
                cardView={false}
                showToolbar={false}
                noSetting
                columns={this.inboundColumns}
                dataSource={inboundProducts}
                loading={inbProductLoading}
                pagination={{
                    showSizeChanger: true,
                    total: productsTotalCount,
                    current: this.state.recDetailsPagination.current,
                    pageSize: this.state.recDetailsPagination.pageSize,
                    onChange: this.handleRecDetailsPageChange,
                    onShowSizeChange: this.handleRecDetailsPageChange,
                    showTotal: total => `??? ${total} ???`,
                  }}
                scrollOffset={454}
              />
            </div>
          </TabPane>
          <TabPane tab="????????????" key="putaway" >
            <div className="table-panel table-fixed-layout">
              <DataTable
                cardView={false}
                showToolbar={false}
                noSetting
                columns={this.putawayColumns}
                dataSource={inboundPutaways}
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    current: this.state.putawayPagination.current,
                    pageSize: this.state.putawayPagination.pageSize,
                    total: totalCount,
                    onChange: this.handlePutawayPageChange,
                    onShowSizeChange: this.handlePutawayPageChange,
                    showTotal: total => `??? ${total} ???`,
                  }}
                scrollOffset={454}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}
