import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import SearchBox from 'client/components/SearchBox';
import { loadOrderDetails, loadShipmentDetailStat } from 'common/reducers/sofOrders';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    orderDetails: state.sofOrders.orderDetails,
    orderDetailReload: state.sofOrders.orderDetailReload,
    shipmentDetailStat: state.sofOrders.shipmentDetailStat,
    orderDetailListFilter: state.sofOrders.orderDetailListFilter,
    currencies: state.saasParams.latest.currency,
    countries: state.saasParams.latest.country,
    units: state.saasParams.latest.unit,
  }),
  { loadOrderDetails, loadShipmentDetailStat }
)
export default class ShipmentDetailsPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    orderNo: PropTypes.string,
  }
  componentDidMount() {
    this.handleTableLoad();
    this.props.loadShipmentDetailStat(this.props.orderNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.orderDetailReload
      && nextProps.orderDetailReload !== this.props.orderDetailReload) {
      this.handleTableLoad(1, null, nextProps.orderDetailListFilter, nextProps.orderNo);
      this.props.loadShipmentDetailStat(nextProps.orderNo);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '序号',
    dataIndex: 'gt_seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '发票号',
    dataIndex: 'inv_no',
    width: 150,
  }, {
    title: '采购订单号',
    dataIndex: 'po_no',
    width: 150,
  }, {
    title: '集装箱号',
    dataIndex: 'gt_container_no',
    width: 150,
  }, {
    title: '托盘号',
    dataIndex: 'gt_pallet_no',
    width: 100,
  }, {
    title: '箱号',
    dataIndex: 'gt_carton_no',
    width: 100,
  }, {
    title: '货号',
    dataIndex: 'gt_product_no',
    width: 150,
  }, {
    title: '商品描述',
    dataIndex: 'gt_name_cn',
    width: 150,
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'gt_qty_pcs',
    align: 'right',
  }, {
    title: '计量单位',
    dataIndex: 'gt_unit_pcs',
    align: 'center',
    render: (o) => {
      const unit = this.props.units.find(un => un.unit_code === o);
      if (unit) {
        return unit.unit_name;
      }
      return '';
    },
  }, {
    title: '单价',
    dataIndex: 'gt_unit_price',
    width: 100,
  }, {
    title: '总价',
    dataIndex: 'gt_amount',
    width: 100,
    align: 'right',
  }, {
    title: '币制',
    dataIndex: 'gt_currency',
    align: 'center',
    width: 100,
    render: (o) => {
      const currency = this.props.currencies.find(curr => curr.curr_code === o);
      if (currency) {
        return currency.curr_name;
      }
      return o;
    },
  }, {
    title: '原产国',
    dataIndex: 'gt_origin_country',
    width: 100,
    render: (o) => {
      const country = this.props.countries.find(coun => coun.cntry_co === o);
      if (country) {
        return country.cntry_name_cn;
      }
      return o;
    },
  }, {
    title: '净重',
    dataIndex: 'gt_netwt',
    width: 100,
  }];
  handleSearch = (search) => {
    const filters = { ...this.props.orderDetailListFilter, search };
    this.handleTableLoad(1, null, filters);
  }
  handleTableLoad = (current, pageSize, filters, newOrderNo) => {
    const { orderNo, orderDetails, orderDetailListFilter } = this.props;
    this.props.loadOrderDetails({
      pageSize: pageSize || orderDetails.pageSize,
      current: current || orderDetails.current,
      orderNo: newOrderNo || orderNo,
      filters: JSON.stringify(filters || orderDetailListFilter),
    });
  }
  render() {
    const {
      pageSize, current, totalCount, data,
    } = this.props.orderDetails;
    const { shipmentDetailStat, orderDetailListFilter } = this.props;
    const pagination = {
      // hideOnSinglePage: true,
      showSizeChanger: true,
      pageSize: Number(pageSize),
      current: Number(current),
      total: totalCount,
      showTotal: total => `共 ${total} 条`,
      onChange: (newCurrent, newPageSize) => {
        this.handleTableLoad(newCurrent, newPageSize);
      },
    };
    return (
      <DataPane
        columns={this.columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox value={orderDetailListFilter.search} placeholder="货号/发票号/采购订单号/中文名称" onSearch={this.handleSearch} />
        </DataPane.Toolbar>
        <Summary>
          <Summary.Item label={this.msg('statsSumQty')} >{shipmentDetailStat.total_qty}</Summary.Item>
          <Summary.Item label={this.msg('statsSumAmount')} >{shipmentDetailStat.total_amount.toFixed(3)}</Summary.Item>
          <Summary.Item label={this.msg('statsSumNetWt')} >{shipmentDetailStat.total_net_wt.toFixed(5)}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
