import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Badge, Card, Drawer, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { getShipRecvConfirmRecords, toggleShipRecvPanel, getConfirmGlobalDetails } from 'common/reducers/sofInvoice';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  confirmRecordLists: state.sofInvoice.confirmRecordLists,
  filter: state.sofInvoice.confirmListFilter,
  shipRecvPanelvisible: state.sofInvoice.shipRecvPanelvisible,
  confirmGlobalDetails: state.sofInvoice.confirmGlobalDetails,
  confirmRecordReload: state.sofInvoice.confirmRecordReload,
  shipRecvLoading: state.sofInvoice.shipRecvLoading,
}), {
  getShipRecvConfirmRecords, toggleShipRecvPanel, getConfirmGlobalDetails,
})
export default class ShipRecvPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    childrenDrawer: false,
    confirmDetailType: '',
    normalSearch: '',
    exceptionSearch: '',
  };
  componentDidMount() {
    this.handleReload();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.confirmRecordReload &&
      nextProps.confirmRecordReload !== this.props.confirmRecordReload) {
      this.handleReload();
    }
  }
  msg = formatMsg(this.props.intl)
  handleReload = (filter) => {
    const { pageSize, current } = this.props.confirmRecordLists;
    this.props.getShipRecvConfirmRecords({
      pageSize,
      current,
      filter: JSON.stringify(filter || this.props.filter),
    });
  }
  handleDownload = (row) => {
    window.open(row.file_cdn_path);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, search: value };
    this.handleReload(filter);
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.getShipRecvConfirmRecords(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: Number(resolve(result.totalCount, result.current, result.pageSize)),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: Number(result.pageSize),
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: JSON.stringify(this.props.filter),
      };
      return params;
    },
    remotes: this.props.confirmRecordLists,
  });
  columns = [{
    title: this.msg('taskId'),
    dataIndex: 'id',
    width: 100,
    render: (o, record) =>
      (<a onClick={() => this.handleConfirmDetailListView(o, record.type)}>{o}</a>),
  }, {
    title: this.msg('uploadFilename'),
    dataIndex: 'task_name',
    render: filename => filename && decodeURI(filename),
  }, {
    title: this.msg('taskCount'),
    dataIndex: 'task_count',
    width: 100,
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 150,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    fixed: 'right',
    className: 'table-col-ops',
    width: 88,
    render: (o, record) => (<span>
      {record.file_cdn_path && <RowAction icon="download" onClick={this.handleDownload} tooltip={this.msg('download')} row={record} />}
    </span>),
  },
  ];
  handleClose = () => {
    this.props.toggleShipRecvPanel(false);
  }
  handleConfirmDetailListView = (taskId, type) => {
    this.setState({
      childrenDrawer: true,
      confirmDetailType: type,
    });
    this.props.getConfirmGlobalDetails(taskId);
  };

  handleChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  handleDetailSearch = (value, type) => {
    this.setState({
      [type]: value,
    });
  }
  globalDetailsColumns = [{
    title: this.msg('globalNo'),
    dataIndex: 'global_no',
    width: 150,
  }, {
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    width: 120,
  }, {
    title: this.msg('expectQty'),
    dataIndex: 'gt_expect_qty',
    width: 100,
    align: 'right',
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: this.msg('shippedQty'),
    dataIndex: 'gt_shipped_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.gt_expect_qty) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: this.msg('recvQty'),
    dataIndex: 'gt_recv_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.gt_expect_qty) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: this.msg('palletNo'),
    dataIndex: 'gt_pallet_no',
    width: 100,
  }, {
    title: this.msg('cartonNo'),
    dataIndex: 'gt_carton_no',
    width: 100,
  }]
  render() {
    const {
      shipRecvPanelvisible, confirmRecordLists, confirmGlobalDetails, shipRecvLoading,
    } = this.props;
    this.dataSource.remotes = confirmRecordLists;
    const { confirmDetailType, normalSearch, exceptionSearch } = this.state;
    let completed = confirmGlobalDetails.filter(detail =>
      detail.gt_shipped_qty === detail.gt_expect_qty);
    let uncompleted = confirmGlobalDetails.filter(detail =>
      detail.gt_shipped_qty !== detail.gt_expect_qty);
    let drawerTitle = this.msg('shipConfirmDetails');
    if (confirmDetailType === 'recv') {
      completed = confirmGlobalDetails.filter(detail =>
        detail.gt_recv_qty === detail.gt_expect_qty);
      uncompleted = confirmGlobalDetails.filter(detail =>
        detail.gt_recv_qty !== detail.gt_expect_qty);
      drawerTitle = this.msg('receiveConfirmDetails');
    }
    if (normalSearch) {
      completed = completed.filter(item =>
        (item.global_no && item.global_no.indexOf(normalSearch) !== -1) ||
        (item.invoice_no && item.invoice_no.indexOf(normalSearch) !== -1) ||
        (item.gt_pallet_no && item.gt_pallet_no.indexOf(normalSearch) !== -1) ||
        (item.gt_carton_no && item.gt_carton_no.indexOf(normalSearch) !== -1));
    }
    if (exceptionSearch) {
      uncompleted = uncompleted.filter(item =>
        (item.global_no && item.global_no.indexOf(exceptionSearch) !== -1) ||
        (item.invoice_no && item.invoice_no.indexOf(exceptionSearch) !== -1) ||
        (item.gt_pallet_no && item.gt_pallet_no.indexOf(exceptionSearch) !== -1) ||
        (item.gt_carton_no && item.gt_carton_no.indexOf(exceptionSearch) !== -1));
    }
    return (
      <Drawer
        title={this.msg('shipRecvLogs')}
        width={960}
        visible={shipRecvPanelvisible}
        onClose={this.handleClose}
      >
        <DataTable
          size="middle"
          columns={this.columns}
          dataSource={this.dataSource}
          scrollOffset={260}
          rowKey="id"
          toolbarActions={
            <SearchBox value={this.props.filter.searchText} placeholder="导入文件名" onSearch={this.handleSearch} />
          }
          onRow={record => ({
            onClick: () => { this.handleConfirmDetailListView(record.id, record.type); },
          })}
          noSetting
          bordered
        />
        <Drawer
          title={drawerTitle}
          width={720}
          visible={this.state.childrenDrawer}
          onClose={this.handleChildrenDrawerClose}
        >
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="normal">
              <TabPane tab={this.msg('normal')} key="normal">
                <DataTable
                  cardView={false}
                  columns={this.globalDetailsColumns}
                  dataSource={completed}
                  noSetting
                  rowKey="global_no"
                  toolbarActions={
                    <SearchBox value={normalSearch} onSearch={value => this.handleDetailSearch(value, 'normalSearch')} />
                  }
                  scrollOffset={310}
                  loading={shipRecvLoading}
                  pagination={{
                    defaultPageSize: 20,
                  }}
                />
              </TabPane>
              <TabPane tab={<Badge count={uncompleted.length}>{this.msg('exception')}</Badge>} key="exception">
                <DataTable
                  cardView={false}
                  columns={this.globalDetailsColumns}
                  dataSource={uncompleted}
                  noSetting
                  rowKey="global_no"
                  toolbarActions={
                    <SearchBox value={exceptionSearch} onSearch={value => this.handleDetailSearch(value, 'exceptionSearch')} />
                  }
                  scrollOffset={310}
                  loading={shipRecvLoading}
                  pagination={{
                    defaultPageSize: 20,
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Drawer>
      </Drawer>
    );
  }
}
