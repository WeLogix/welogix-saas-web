import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';


@injectIntl
export default class ASNDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    asnBody: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '行号',
    dataIndex: 'asn_seq_no',
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
    width: 100,
    dataIndex: 'unit_name',
    align: 'center',
  }, {
    title: '采购订单号',
    width: 200,
    dataIndex: 'po_no',
  }]
  render() {
    const { asnBody } = this.props;
    const rowKey = 'id';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={asnBody}
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
