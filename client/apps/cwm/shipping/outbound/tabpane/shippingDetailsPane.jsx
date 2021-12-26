import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import FileSaver from 'file-saver';
import { intlShape, injectIntl } from 'react-intl';
import { notification, Button, Tag, Icon } from 'antd';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import Summary from 'client/components/Summary';
import { loadShipDetails, exportNormalExitBySo, loadWholeShipDetails } from 'common/reducers/cwmOutbound';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    reload: state.cwmOutbound.outboundReload,
    outboundHead: state.cwmOutbound.outboundFormHead,
    shipDetails: state.cwmOutbound.shipDetails,
    wholeShipDetails: state.cwmOutbound.wholeShipDetails,
    shipDetailLoading: state.cwmOutbound.shipDetailLoading,
    shipDetailFilter: state.cwmOutbound.shipDetailFilter,
    totalCount: state.cwmOutbound.shipDetailTotalCount,
  }),
  { loadShipDetails, exportNormalExitBySo, loadWholeShipDetails }
)
export default class ShippingDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    outboundNo: PropTypes.string.isRequired,
  }
  state = {
    pagination: {
      pageSize: 20,
      current: 1,
    },
  }
  componentDidMount() {
    this.handleLoad(null, 1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.handleLoad(null, 1);
    }
  }
  msg = formatMsg(this.props.intl)
  handlePageChange = (current, pageSize) => {
    this.handleLoad(null, current, pageSize, true);
  }
  handleLoad = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.shipDetailFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;

    this.props.loadShipDetails(this.props.outboundNo, current, pageSize, JSON.stringify(filter))
      .then(() => {
        this.setState({ pagination: { current, pageSize } });
      });
    if (!onlyLoadList) {
      this.props.loadWholeShipDetails(this.props.outboundNo);
    }
  }
  handleSearch = (search) => {
    const filter = { ...this.props.shipDetailFilter, search };
    this.handleLoad(filter, 1, null, true);
  }
  handleExportExitVoucher = () => {
    this.props.exportNormalExitBySo(this.props.outboundHead.so_no).then((resp) => {
      if (!resp.error) {
        FileSaver.saveAs(
          new window.Blob([Buffer.from(resp.data)], { type: 'application/octet-stream' }),
          `${this.props.outboundHead.so_no}_出区凭单.xlsx`
        );
      } else {
        notification.error({
          message: '导出失败',
          description: resp.error.message,
        });
      }
    });
  }
  columns = [{
    title: '装车/配送单号',
    dataIndex: 'waybill',
    width: 150,
  }, {
    title: '托盘编号',
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
    title: '发货数量',
    dataIndex: 'shipped_qty',
    width: 100,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 100,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 100,
    render: (o) => {
      if (o) {
        return <Tag>{o}</Tag>;
      }
      return null;
    },
  }, {
    title: '发货人员',
    width: 100,
    dataIndex: 'shipped_by',
    render: (o) => {
      if (o) {
        return (<div><Icon type="user" />{o}</div>);
      }
      return null;
    },
  }, {
    title: '发货时间',
    width: 100,
    dataIndex: 'created_date',
    render: o => o && moment(o).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }]
  render() {
    const {
      outboundHead, shipDetails, shipDetailLoading, wholeShipDetails, shipDetailFilter,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={shipDetails}
        rowKey="id"
        loading={shipDetailLoading}
        pagination={{
          current: this.state.pagination.current,
          pageSize: this.state.pagination.pageSize,
          total: this.props.totalCount,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={shipDetailFilter.search} placeholder="货号/SKU" onSearch={this.handleSearch} />
          <DataPane.Actions>
            {wholeShipDetails.length > 0 &&
            wholeShipDetails.filter(pd => !pd.bonded && pd.ftz_ent_filed_id).length > 0 &&
            <Button type="primary" onClick={this.handleExportExitVoucher}>导出出区凭单</Button>}
          </DataPane.Actions>
        </DataPane.Toolbar>
        <Summary>
          <Summary.Item label="订单总数">{outboundHead.total_qty}</Summary.Item>
          <Summary.Item label="分配总数">{outboundHead.total_alloc_qty}</Summary.Item>
          <Summary.Item label="拣货总数">{outboundHead.total_picked_qty}</Summary.Item>
          <Summary.Item label="发货总数">{outboundHead.total_shipped_qty}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
