import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Tag, Icon } from 'antd';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import Summary from 'client/components/Summary';
import { loadPackDetails, loadWholePackDetails } from 'common/reducers/cwmOutbound';
import printTotalPackingListPdf from '../print/printTotalPackingList';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    reload: state.cwmOutbound.outboundReload,
    outboundHead: state.cwmOutbound.outboundFormHead,
    packDetails: state.cwmOutbound.packDetails,
    packDetailFilter: state.cwmOutbound.packDetailFilter,
    totalCount: state.cwmOutbound.packDetailTotalCount,
    packDetailLoading: state.cwmOutbound.packDetailLoading,
    wholePackDetails: state.cwmOutbound.wholePackDetails,
  }),
  { loadPackDetails, loadWholePackDetails }
)
export default class PackingDetailsPane extends React.Component {
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
  handlePageChange = (current, pageSize) => {
    this.handleLoad(null, current, pageSize, true);
  }
  msg = formatMsg(this.props.intl)
  handleLoad = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.packDetailFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;

    this.props.loadPackDetails(this.props.outboundNo, current, pageSize, JSON.stringify(filter))
      .then(() => {
        this.setState({ pagination: { current, pageSize } });
      });
    if (!onlyLoadList) {
      this.props.loadWholePackDetails(this.props.outboundNo);
    }
  }
  handleSearch = (search) => {
    const filter = { ...this.props.packDetailFilter, search };
    this.handleLoad(filter, 1, null, true);
  }
  columns = [{
    title: '箱号',
    dataIndex: 'packed_no',
    width: 150,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 200,
  }, {
    title: '装箱数量',
    dataIndex: 'chkpacked_qty',
    width: 100,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '序列号',
    dataIndex: 'serial_no',
    width: 150,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 150,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 150,
    render: o => o && <Tag>{o}</Tag>,
  }, {
    title: '复核装箱人员',
    width: 100,
    dataIndex: 'chkpacked_by',
    render: o => o && <div><Icon type="user" />{o}</div>,
  }, {
    title: '复核装箱时间',
    width: 100,
    dataIndex: 'chkpacked_date',
    render: o => o && moment(o).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }]
  handleTotalPackingListPrint = () => {
    const { outboundHead, wholePackDetails } = this.props;
    const packedNos = Array.from(new Set(wholePackDetails.filter(pd => pd.packed_no)
      .map(pd => pd.packed_no)));
    printTotalPackingListPdf(outboundHead, packedNos);
  }
  render() {
    const {
      outboundHead, packDetails, packDetailLoading, wholePackDetails, packDetailFilter,
    } = this.props;
    const { pagination } = this.state;
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
        dataSource={packDetails}
        rowKey="id"
        loading={packDetailLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: this.props.totalCount,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={packDetailFilter.search} placeholder="货号/序列号" onSearch={this.handleSearch} />
          <DataPane.Actions>
            {wholePackDetails.length > 0 && wholePackDetails.length > 0 &&
            <Button icon="printer" onClick={this.handleTotalPackingListPrint} >
            打印总箱单
            </Button>}
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
