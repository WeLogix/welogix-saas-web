import React from 'react';
import PropTypes from 'prop-types';
import { Card, Drawer, Table } from 'antd';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { toggleStockPanel, toggleAllocatedPanel, loadVirtualWhseStock } from 'common/reducers/cwmInventoryStock';
import RowAction from 'client/components/RowAction';
import AllocatedPanel from './allocatedPanel';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.cwmInventoryStock.stockPanel.visible,
    product: state.cwmInventoryStock.stockPanel.product,
    stock: state.cwmInventoryStock.virtualWhseStock,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    toggleStockPanel,
    toggleAllocatedPanel,
    loadVirtualWhseStock,
  }
)
export default class StockPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const {
        product: { product_no: productNo, virtual_whse: virtualWhse }, defaultWhse: { code },
      } = nextProps;
      this.props.loadVirtualWhseStock(productNo, virtualWhse, code);
    }
  }
  columns = [{
    title: '库存数量',
    dataIndex: 'stock_qty',
    width: 100,
    align: 'center',
    className: 'text-emphasis',
  }, {
    title: '可用数',
    dataIndex: 'avail_qty',
    width: 100,
    align: 'center',
    className: 'text-success',
  }, {
    title: '预配数量',
    dataIndex: 'prealloc_qty',
    width: 100,
    align: 'center',
    render: (o, record) => (<RowAction
      onClick={() => this.handleShowRecords(record, 'preAlllocRecord')}
      label={o}
      row={record}
      disabled={o === 0}
    />),
  }, {
    title: '分配数量',
    dataIndex: 'alloc_qty',
    width: 100,
    align: 'center',
    render: (o, record) => (<RowAction
      onClick={() => this.handleShowRecords(record, 'alllocRecord')}
      label={o}
      row={record}
      disabled={o === 0}
    />),
  }, {
    title: '冻结数量',
    dataIndex: 'frozen_qty',
    width: 100,
    align: 'center',
    className: 'text-error',
  }];
  msg = key => formatMsg(this.props.intl, key);
  handleClose = () => {
    this.props.toggleStockPanel(false);
  }
  handleShowRecords = (row, activeTab) => {
    this.props.toggleAllocatedPanel(true, activeTab, {
      product_no: row.product_no,
      virtual_whse: row.virtual_whse,
    });
  }
  render() {
    const { visible, stock, product } = this.props;
    return (
      <Drawer
        title={<span>
          {product.product_no}
          {product.virtual_whse && <span> / {product.virtual_whse} </span>}
          库存状态
        </span>}
        width={800}
        onClose={this.handleClose}
        visible={visible}
      >
        <Card bodyStyle={{ padding: 0 }}>
          <Table
            size="middle"
            columns={this.columns}
            dataSource={stock ? [stock] : []}
            rowKey="id"
            pagination={false}
          />
        </Card>
        <AllocatedPanel />
      </Drawer>);
  }
}
