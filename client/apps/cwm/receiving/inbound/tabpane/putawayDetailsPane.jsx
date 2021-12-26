import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Tag, Button, Modal, message, Dropdown, Icon, Menu } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import ImportDataPanel from 'client/components/ImportDataPanel';
import Summary from 'client/components/Summary';
import { createFilename } from 'client/util/dataTransform';
import { loadInboundPutaways, showPuttingAwayModal, undoReceives, expressPutaways, viewSuBarPutawayModal, loadWholeInboundPutaways, markReloadInbound } from 'common/reducers/cwmReceive';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SKUPopover from '../../../common/popover/skuPopover';
import TraceIdPopover from '../../../common/popover/traceIdPopover';
import PuttingAwayModal from '../modal/puttingAwayModal';
import SuBarPutawayModal from '../modal/suBarPutawayModal';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    loginName: state.account.username,
    inboundHead: state.cwmReceive.inboundFormHead,
    inboundPutaways: state.cwmReceive.inboundPutaways.list,
    putawayFilter: state.cwmReceive.inboundPutaways.filter,
    totalCount: state.cwmReceive.inboundPutaways.totalCount,
    loading: state.cwmReceive.inboundPutaways.loading,
    reload: state.cwmReceive.inboundReload,
    submitting: state.cwmReceive.submitting,
    wholePutawayDetails: state.cwmReceive.wholePutawayDetails,
    wholePutawayLoading: state.cwmReceive.wholePutawayLoading,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    loadInboundPutaways,
    showPuttingAwayModal,
    undoReceives,
    expressPutaways,
    viewSuBarPutawayModal,
    loadWholeInboundPutaways,
    markReloadInbound,
  }
)
export default class PutawayDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    inboundNo: PropTypes.string.isRequired,
    inboundHead: PropTypes.shape({ owner_partner_id: PropTypes.number }).isRequired,
  }
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    importPanelVisible: false,
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
  msg =formatMsg(this.props.intl)
  handleLoad = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.putawayFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadInboundPutaways(this.props.inboundNo, current, pageSize, JSON.stringify(filter))
      .then((result) => {
        if (!result.error) {
          this.setState({ pagination: { current, pageSize } });
        }
      });
    if (!onlyLoadList) {
      this.props.loadWholeInboundPutaways(this.props.inboundNo, filter);
      this.handleDeselectRows();
    }
  }
  columns = [{
    title: '序号',
    dataIndex: 'seqno',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '容器编号',
    dataIndex: 'convey_no',
    width: 150,
  }, {
    title: '追踪ID',
    dataIndex: 'trace_id',
    width: 200,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: '序列号',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 100,
    align: 'left',
  }, {
    title: '货品',
    dataIndex: 'product_sku',
    width: 220,
    render: o => (<SKUPopover ownerPartnerId={this.props.inboundHead.owner_partner_id} sku={o} />),
  }, {
    title: '收货数量',
    width: 100,
    dataIndex: 'inbound_qty',
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '收货库位',
    dataIndex: 'receive_location',
    width: 150,
    render: o => (o && <Tag>{o}</Tag>),
  }, {
    title: '上架库位',
    dataIndex: 'putaway_location',
    width: 150,
    render: o => (o && <Tag color="green">{o}</Tag>),
    /*  }, {
    title: '目标库位',
    dataIndex: 'target_location',
    width: 120, */
  }, {
    title: '中文品名',
    width: 200,
    dataIndex: 'name',
  }, {
    title: '上架人员',
    width: 100,
    dataIndex: 'put_by',
  }, {
    title: '上架时间',
    width: 100,
    dataIndex: 'put_date',
    render: allocateDt => allocateDt && moment(allocateDt).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (!record.result) { // 上架明细的状态 0 未上架 1 已上架
        return (<PrivilegeCover module="cwm" feature="receiving" action="edit">
          <RowAction onClick={this.handlePutAway} icon="check-circle-o" label="上架确认" row={record} />
          <RowAction onClick={this.handleUndoReceive} icon="close-circle-o" tooltip="取消收货" row={record} />
        </PrivilegeCover>);
      }
      return null;
    },
  }]
  handleExpressPutAway = () => {
    const { props } = this;
    Modal.confirm({
      title: '是否确认上架完成?',
      content: '默认将收货库位设为最终储存库位，确认上架后不能操作取消收货',
      onOk() {
        return props.expressPutaways(props.loginId, props.loginName, props.inboundNo);
      },
      onCancel() {},
      okText: '确认上架',
    });
  }
  handlePutAway = (row) => {
    let details = [row];
    if (row.children && row.children.length > 0) {
      details = details.concat(row.children);
    }
    this.props.showPuttingAwayModal(details);
  }
  handleSuBarcodePutaway = () => {
    this.props.viewSuBarPutawayModal({
      visible: true,
      inboundNo: this.props.inboundNo,
    });
  }
  handleBatchPutAways = () => {
    this.props.showPuttingAwayModal(this.state.selectedRows);
  }
  handleUndoReceive = (row) => {
    this.props.undoReceives(
      this.props.inboundNo,
      this.props.loginId, [row.trace_id]
    ).then((result) => {
      if (!result.error) {
        message.success('操作成功');
        this.handleLoad();
      } else {
        message.error('操作失败');
      }
    });
  }
  handleBatchUndoReceives = () => {
    this.props.undoReceives(
      this.props.inboundNo, this.props.loginId,
      this.state.selectedRows.map(sr => sr.trace_id)
    ).then((result) => {
      if (!result.error) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  }
  handleSearch = (search) => {
    const filter = { ...this.props.putawayFilter, search };
    this.handleLoad(filter, 1);
    this.handleDeselectRows();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  handleMoreMenuClick = (e) => {
    if (e.key === 'import') {
      this.setState({
        importPanelVisible: true,
      });
    } else {
      window.open(`${API_ROOTS.default}v1/cwm/export/putaway/details/${createFilename('putaway')}.xlsx?inboundNo=${this.props.inboundNo}`);
    }
  }
  handleUploadPutaway = () => {
    this.setState({ importPanelVisible: false });
    this.props.markReloadInbound();
  }
  render() {
    const {
      inboundHead, inboundPutaways, loading, submitting, wholePutawayDetails, wholePutawayLoading,
    } = this.props;
    const serialNoCount = new Set(wholePutawayDetails.filter(ibp => ibp.serial_no)
      .map(ibp => ibp.serial_no)).size; // 去重
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      selections: [{
        key: 'all-data',
        text: '选择全部项',
        onSelect: () => {
          const fDataSource = wholePutawayDetails.filter(item => !(item.result === 1));
          const selectedRowKeys = fDataSource.map(item => item.id);
          this.setState({
            selectedRowKeys,
            selectedRows: fDataSource,
          });
        },
      }, {
        key: 'opposite-data',
        text: '反选全部项',
        onSelect: () => {
          // 在当前页中: result不等于1 & 未被选中的
          const fDataSource = wholePutawayDetails.filter(item => !(item.result === 1) &&
            !this.state.selectedRowKeys.find(item1 => item1 === item.id));
          const selectedRowKeys = fDataSource.map(item => item.id);
          this.setState({
            selectedRowKeys,
            selectedRows: fDataSource,
          });
        },
      }],
      getCheckboxProps: record => ({
        disabled: record.result === 1,
      }),
    };
    let { columns } = this;
    if (inboundHead.rec_mode === 'scan') {
      columns = columns.filter(col => col.dataIndex !== '_OPS_');
    }
    const moreMenu = (
      <Menu onClick={this.handleMoreMenuClick}>
        <Menu.Item key="export"><Icon type="download" /> 导出待上架明细</Menu.Item>
        <Menu.Item key="import"><Icon type="upload" /> 导入已上架记录</Menu.Item>
      </Menu>
    );
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={inboundPutaways}
        rowKey="id"
        loading={this.props.loading}
        pagination={{
          ...this.state.pagination,
          total: this.props.totalCount,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={this.props.putawayFilter.search} placeholder="货号/序列号" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              <Button onClick={this.handleBatchPutAways} icon="check">
              批量上架确认
              </Button>
              <Button loading={submitting} onClick={this.handleBatchUndoReceives} icon="rollback">
              批量取消收货
              </Button>
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>

            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              {inboundHead.rec_mode === 'manual' &&
                wholePutawayDetails.filter(ds =>
                  ds.receive_location && ds.result === 0).length > 0 &&
                  <Button loading={submitting || loading} icon="check" onClick={this.handleExpressPutAway}>
                  快捷上架
                  </Button>
              }
              {inboundHead.rec_mode === 'manual' && wholePutawayDetails.filter(ds => ds.result === 0).length > 0 &&
                <Dropdown overlay={moreMenu}>
                  <Button icon="file-excel">导入上架确认</Button>
                </Dropdown>}
              {inboundHead.rec_mode === 'manual' && inboundHead.su_setting.enabled &&
                wholePutawayDetails.filter(ds => ds.serial_no && ds.result === 0).length > 0 &&
                <Button type="primary" icon="barcode" onClick={this.handleSuBarcodePutaway} disabled={wholePutawayLoading}>
                条码上架
                </Button>
              }
            </PrivilegeCover>
          </DataPane.Actions>
        </DataPane.Toolbar>
        <PuttingAwayModal inboundNo={this.props.inboundNo} />
        <SuBarPutawayModal />
        <ImportDataPanel
          adaptors={null}
          title="上架导入"
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cwm/putaway/details/import`}
          formData={{
                inboundNo: this.props.inboundNo,
                whseCode: this.props.defaultWhse.code,
                loginName: this.props.loginName,
              }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleUploadPutaway}
        />
        <Summary>
          <Summary.Item label="序列号总数">{serialNoCount}</Summary.Item>
          <Summary.Item label="总预期数量">{inboundHead.total_expect_qty}</Summary.Item>
          <Summary.Item label="总实收数量">{inboundHead.total_received_qty}</Summary.Item>
          <Summary.Item label="总立方数">{inboundHead.total_received_vol}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
