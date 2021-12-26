import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Icon, Input } from 'antd';
import DataTable from 'client/components/DataTable';
import { loadOrderProducts } from 'common/reducers/sofOrders';
import { formatMsg } from '../message.i18n';

const { Search } = Input;

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  dockVisible: state.sofOrders.dock.visible,
  order: state.sofOrders.dock.order,
  orderProductList: state.sofOrders.dock.orderProductList,
  orderProductListFilter: state.sofOrders.dock.orderProductListFilter,
}), { loadOrderProducts })
export default class ShipmentDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    order: PropTypes.shape({
      shipmt_order_no: PropTypes.string,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
    };
  }
  componentDidMount() {
    this.props.loadOrderProducts({
      orderNo: this.props.order.shipmt_order_no,
      pageSize: this.props.orderProductList.pageSize,
      current: this.props.orderProductList.current,
      filters: JSON.stringify(this.props.orderProductListFilter),
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dockVisible && !this.props.dockVisible) {
      nextProps.loadOrderProducts({
        orderNo: nextProps.order.shipmt_order_no,
        pageSize: nextProps.orderProductList.pageSize,
        current: nextProps.orderProductList.current,
        filters: JSON.stringify(nextProps.orderProductListFilter),
      });
    }
  }
  getColumns() {
    const productColumns = [{
      title: '货号',
      width: 150,
      dataIndex: 'gt_product_no',
      filterDropdown: (
        <Search
          placeholder="搜索货号/发票号/品名"
          onSearch={this.handleSearch}
          enterButton
        />
      ),
      filterIcon: <Icon type="search" style={{ color: this.props.orderProductListFilter.search ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        });
      },
    }, {
      title: '名称',
      dataIndex: 'gt_name_cn',
      width: 160,
    }, {
      title: '英文名称',
      width: 120,
      dataIndex: 'gt_name_en',
    }, {
      title: '数量',
      width: 140,
      dataIndex: 'gt_qty_pcs',
    }, {
      title: '单价',
      width: 140,
      dataIndex: 'gt_unit_price',
    }, {
      title: '金额',
      width: 140,
      dataIndex: 'gt_amount',
    }, {
      title: '净重',
      width: 140,
      dataIndex: 'gt_netwt',
    }, {
      title: '商品编号',
      width: 120,
      dataIndex: 'gt_hscode',
    }, {
      title: '原产国',
      width: 180,
      dataIndex: 'gt_origin_country',
    }, {
      title: '币制',
      width: 140,
      dataIndex: 'gt_currency',
    }, {
      title: '发票号',
      width: 140,
      dataIndex: 'inv_no',
    }, {
      title: '采购订单号',
      width: 140,
      dataIndex: 'po_no',
    }, {
      title: '批次号',
      width: 140,
      dataIndex: 'gt_external_lot_no',
    }, {
      title: '序列号',
      width: 140,
      dataIndex: 'gt_serial_no',
    }, {
      title: '扩展属性1',
      width: 140,
      dataIndex: 'gt_attrib_1_string',
    }, {
      title: '扩展属性2',
      width: 140,
      dataIndex: 'gt_attrib_2_string',
    }, {
      title: '扩展属性3',
      width: 140,
      dataIndex: 'gt_attrib_3_string',
    }, {
      title: '扩展属性4',
      width: 140,
      dataIndex: 'gt_attrib_4_string',
    }];
    return productColumns;
  }
  msg = formatMsg(this.props.intl)
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadOrderProducts(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        orderNo: this.props.order.shipmt_order_no,
        pageSize: pagination.pageSize,
        current: pagination.current,
        filters: JSON.stringify(this.props.orderProductListFilter),
      };
      return params;
    },
    remotes: this.props.orderProductList,
  })
  handleSearch = (search) => {
    const listFilter = { ...this.props.orderProductListFilter, search };
    this.props.loadOrderProducts({
      orderNo: this.props.order.shipmt_order_no,
      pageSize: this.props.orderProductList.pageSize,
      current: this.props.orderProductList.current,
      filters: JSON.stringify(listFilter),
    });
  }
  render() {
    const { orderProductList } = this.props;
    this.dataSource.remotes = orderProductList;
    return (
      <div className="pane-content tab-pane">
        <DataTable
          showToolbar={false}
          columns={this.getColumns()}
          dataSource={this.dataSource}
          rowKey="id"
          scrollOffset={360}
        />
      </div>
    );
  }
}
