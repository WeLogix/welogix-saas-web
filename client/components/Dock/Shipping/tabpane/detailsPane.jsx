import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(state => ({
  loginId: state.account.loginId,
  order: state.sofOrders.dock.order,
  defaultWhse: state.cwmContext.defaultWhse,
}), { })
export default class SODetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    soBody: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '行号',
    dataIndex: 'so_seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 200,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 200,
  }, {
    title: '订单数量',
    width: 100,
    dataIndex: 'order_qty',
    align: 'right',
  }, {
    title: '计量单位',
    dataIndex: 'unit_name',
    align: 'center',
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
  }, {
    title: '产品序列号',
    dataIndex: 'serial_no',
  }]
  render() {
    const { soBody } = this.props;
    const rowKey = 'so_seq_no';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={soBody}
          showToolbar={false}
          scrollOffset={360}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
          }}
          rowKey={rowKey}
        />
      </div>
    );
  }
}
