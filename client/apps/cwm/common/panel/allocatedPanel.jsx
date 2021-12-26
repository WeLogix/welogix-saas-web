import React from 'react';
import PropTypes from 'prop-types';
import { Card, Drawer, Tabs, Table } from 'antd';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { toggleAllocatedPanel, loadPreAllocRecords, loadAllocRecords } from 'common/reducers/cwmInventoryStock';
// import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.cwmInventoryStock.allocatedPanel.visible,
    activeTab: state.cwmInventoryStock.allocatedPanel.activeTab,
    stockItem: state.cwmInventoryStock.allocatedPanel.stockItem,
    preAllocRecords: state.cwmInventoryStock.preAllocRecords,
    allocRecords: state.cwmInventoryStock.allocRecords,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    toggleAllocatedPanel,
    loadPreAllocRecords,
    loadAllocRecords,
  }
)
export default class AllocatedPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  state = {
    activeKey: 'preAlllocRecord',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const {
        stockItem: { product_no: productNo, virtual_whse: virtualWhse }, defaultWhse: { code },
      } = nextProps;
      this.props.loadPreAllocRecords(productNo, virtualWhse, code);
      this.props.loadAllocRecords(productNo, virtualWhse, code);
    }
    if (nextProps.activeTab && nextProps.activeTab !== this.props.activeTab) {
      this.setState({ activeKey: nextProps.activeTab });
    }
  }
  columns = [{
    title: '出库订单追踪号',
    width: 160,
    dataIndex: 'cust_order_no',
  }, {
    title: 'SO编号',
    width: 140,
    dataIndex: 'so_no',
  }, {
    title: '行号',
    width: 50,
    dataIndex: 'seq_no',
    align: 'center',
    className: 'table-col-seq',
  }]
  preAllocColumns = this.columns.concat({
    title: '预配数量',
    dataIndex: 'prealloc_qty',
    align: 'center',
    className: 'text-emphasis',
  })
  alllocColumns = this.columns.concat({
    title: '分配数量',
    dataIndex: 'alloc_qty',
    align: 'center',
    className: 'text-emphasis',
  })
  msg = key => formatMsg(this.props.intl, key);
  handleTabChange = (key) => {
    this.setState({ activeKey: key });
  }
  handleClose = () => {
    this.props.toggleAllocatedPanel(false);
  }
  render() {
    const { visible, preAllocRecords, allocRecords } = this.props;
    if (!visible) return null;
    return (<Drawer
      title="库存控制记录"
      placement="right"
      width={680}
      onClose={this.handleClose}
      visible={visible}
    >
      <Card bodyStyle={{ padding: 0 }}>
        <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange}>
          <TabPane tab="预分配记录" key="preAlllocRecord">
            <Table
              size="middle"
              columns={this.preAllocColumns}
              dataSource={preAllocRecords}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="分配记录" key="alllocRecord">
            <Table
              size="middle"
              columns={this.alllocColumns}
              dataSource={allocRecords}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>
    </Drawer>);
  }
}
