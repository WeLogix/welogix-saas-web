import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Tag, Icon, Button, notification } from 'antd';
import RowAction from 'client/components/RowAction';
import { LogixIcon } from 'client/components/FontIcon';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import Summary from 'client/components/Summary';
import { openPickingModal, openShippingModal, loadPickDetails, cancelPicked, loadOutboundHead, showSubarPickChkModal, cancelTraceAlloc, loadWholePickDetails } from 'common/reducers/cwmOutbound';
import { CWM_SO_TYPES, CWM_OUTBOUND_STATUS, ALLOC_ERROR_MESSAGE_DESC } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PickingModal from '../modal/pickingModal';
import ShippingModal from '../modal/shippingModal';
import SuBarPickChkpackModal from '../modal/suBarPickChkpackModal';
import SKUPopover from '../../../common/popover/skuPopover';
import TraceIdPopover from '../../../common/popover/traceIdPopover';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    reload: state.cwmOutbound.outboundReload,
    pickDetails: state.cwmOutbound.pickDetails,
    pickDetailFilter: state.cwmOutbound.pickDetailFilter,
    pickDetailLoading: state.cwmOutbound.pickDetailLoading,
    pickDetailStat: state.cwmOutbound.pickDetailStat,
    wholePickDetails: state.cwmOutbound.wholePickDetails,
    outboundHead: state.cwmOutbound.outboundFormHead,
    submitting: state.cwmOutbound.submitting,
  }),
  {
    openPickingModal,
    openShippingModal,
    loadPickDetails,
    loadWholePickDetails,
    cancelPicked,
    loadOutboundHead,
    cancelTraceAlloc,
    showSubarPickChkModal,
  }
)
export default class PickingDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    outboundNo: PropTypes.string.isRequired,
    outboundHead: PropTypes.shape({
      shipping_mode: PropTypes.string,
      owner_partner_id: PropTypes.number.isRequired,
    }).isRequired,
  }
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    currentStep: null,
    batchPickedUnShipped: false,
    operationMode: null,
    pagination: {
      pageSize: 20,
      current: 1,
    },

  }
  componentDidMount() {
    this.handleLoad(null, 1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && this.props.reload !== nextProps.reload) {
      this.handleLoad();
      this.handleDeselectRows();
    }
  }
  msg = formatMsg(this.props.intl)
  handlePageChange = (current, pageSize) => {
    this.handleLoad(null, current, pageSize, true);
  }
  handleLoad = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.pickDetailFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadPickDetails(
      this.props.outboundNo,
      this.props.waveNo,
      current,
      pageSize,
      JSON.stringify(filter)
    ).then(() => {
      this.setState({ pagination: { current, pageSize } });
    });
    if (!onlyLoadList) {
      this.props.loadWholePickDetails(this.props.outboundNo, this.props.waveNo);
      this.handleDeselectRows();
    }
  }
  handleSearch = (search) => {
    const filter = { ...this.props.putawayFilter, search };
    this.handleLoad(filter, 1, null, true);
    this.handleDeselectRows();
  }
  columns = [{
    title: '??????',
    dataIndex: 'seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 200,
    render: o => o &&
    <SKUPopover ownerPartnerId={this.props.outboundHead.owner_partner_id} sku={o} />,
  }, {
    title: '??????',
    dataIndex: 'location',
    width: 150,
    render: o => o && <Tag>{o}</Tag>,
  }, {
    title: '????????????',
    dataIndex: 'alloc_qty',
    width: 100,
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '????????????',
    dataIndex: 'picked_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (record.picked_qty === record.alloc_qty) {
        return (<span className="text-success">{o}</span>);
      } else if (record.picked_qty < record.alloc_qty) {
        return (<span className="text-warning">{o}</span>);
      }
      return null;
    },
  }, {
    title: '????????????',
    dataIndex: 'shipped_qty',
    width: 100,
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: 'CBM',
    dataIndex: 'volume',
    width: 100,
    align: 'right',
    render: vol => vol && (<span className="text-emphasis">{vol}</span>),
  }, {
    title: '??????ID',
    dataIndex: 'trace_id',
    width: 200,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: '????????????',
    dataIndex: 'bonded',
    width: 80,
    align: 'center',
    render: bonded => (bonded ? <Tag color="blue">??????</Tag> : <Tag>?????????</Tag>),
  }, {
    title: '????????????',
    dataIndex: 'portion',
    width: 100,
    align: 'center',
    render: portion => (portion ? <Tag color="green">????????????</Tag> : <Tag>????????????</Tag>),
  }, {
    title: '??????',
    dataIndex: 'virtual_whse',
    width: 100,
  }, {
    title: '?????????',
    dataIndex: 'external_lot_no',
    width: 120,
  }, {
    title: '?????????',
    dataIndex: 'serial_no',
    width: 100,
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'alloc_by',
    render: o => (o && <div><Icon type="user" />{o}</div>),
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'alloc_date',
    render: o => (o && <div>{moment(o).format('MM.DD HH:mm')}</div>),
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'picked_by',
    render: o => (o && <div><Icon type="user" />{o}</div>),
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'picked_date',
    render: o => (o && <div>{moment(o).format('MM.DD HH:mm')}</div>),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '??????',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      const { outboundHead, submitting } = this.props;
      if (outboundHead.shipping_mode === 'manual') {
        switch (record.status) { // ????????????????????? 2 ????????? 4 ????????? 6 ?????????
          case 2: // ?????????
            return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
              {outboundHead.so_type !== CWM_SO_TYPES[3].value &&
              <RowAction onClick={() => this.handleConfirmPicked(record.id, record.location, record.alloc_qty, record.sku_pack_qty, record.trace_id, record.seq_no)} icon="check-circle-o" label="????????????" row={record} />}
              <RowAction onClick={this.handleCancelAllocated} icon="close-circle-o" tooltip="????????????" row={record} disabled={submitting} />
            </PrivilegeCover>);
          case 3: // ????????????
            return (
              <PrivilegeCover module="cwm" feature="shipping" action="edit">
                <RowAction onClick={() => this.handleConfirmPicked(record.id, record.location, record.alloc_qty - record.picked_qty, record.sku_pack_qty, record.trace_id)} icon="check-circle-o" label="????????????" row={record} />
                {record.picked_qty > record.shipped_qty && !this.props.waveNo &&
                <RowAction onClick={() => this.handleConfirmShipped(record.id, record.picked_qty - record.shipped_qty, record.sku_pack_qty, record.seq_no)} icon="check-circle-o" label="????????????????????????" row={record} />}
                <RowAction onClick={() => this.handleCancelPicked(record.id, record.picked_qty, record.picked_qty / record.sku_pack_qty, record.seq_no)} icon="close-circle-o" tooltip="????????????" row={record} disabled={submitting} />
              </PrivilegeCover>
            );
          case 4: // ?????????
            return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
              {record.picked_qty < record.alloc_qty &&
                <RowAction onClick={() => this.handleConfirmPicked(record.id, record.location, record.alloc_qty - record.picked_qty, record.sku_pack_qty, record.trace_id)} icon="check-circle-o" label="????????????" row={record} />}
              {!this.props.waveNo && <RowAction onClick={() => this.handleConfirmShipped(record.id, record.picked_qty - record.shipped_qty, record.sku_pack_qty, record.seq_no)} icon="check-circle-o" label="????????????" row={record} />}
              <RowAction onClick={() => this.handleCancelPicked(record.id, record.picked_qty, record.picked_qty / record.sku_pack_qty, record.seq_no)} icon="close-circle-o" tooltip="????????????" row={record} disabled={submitting} />
            </PrivilegeCover>);
          case 5: // ???????????????
            return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
              {!this.props.waveNo && <RowAction onClick={() => this.handleConfirmShipped(record.id, record.picked_qty, record.sku_pack_qty, record.seq_no)} icon="check-circle-o" label="????????????" row={record} />}
            </PrivilegeCover>);
          default:
            return (record.picked_qty < record.alloc_qty ?
              <PrivilegeCover module="cwm" feature="shipping" action="edit">
                <RowAction onClick={() => this.handleConfirmPicked(record.id, record.location, record.alloc_qty - record.picked_qty, record.sku_pack_qty, record.trace_id)} icon="check-circle-o" label="????????????" row={record} />
              </PrivilegeCover> : null);
        }
      } else if (outboundHead.shipping_mode === 'scan') {
        switch (record.status) { // ????????????????????? 2 ????????? 4 ????????? 6 ?????????
          case 2: // ?????????
            return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
              <RowAction onClick={this.handleCancelAllocated} label="????????????" row={record} disabled={submitting} />
            </PrivilegeCover>);
          case 3: // ????????????
            return (
              <PrivilegeCover module="cwm" feature="shipping" action="edit">
                <RowAction onClick={() => this.handleCancelPicked(record.id, record.picked_qty, record.picked_qty / record.sku_pack_qty, record.seq_no)} icon="close-circle-o" tooltip="????????????" disabled={submitting} row={record} />
              </PrivilegeCover>
            );
          default:
            break;
        }
      }
      return null;
    },
  }]
  handleCancelAllocated = (row) => {
    const { loginId } = this.props;
    this.props.cancelTraceAlloc(
      this.props.outboundNo,
      this.props.waveNo,
      [row.id],
      loginId
    ).then((result) => {
      if (result.error) {
        let msg = result.error.message;
        if (ALLOC_ERROR_MESSAGE_DESC[result.error.message]) {
          msg = ALLOC_ERROR_MESSAGE_DESC[result.error.message];
        }
        notification.error({
          message: msg,
        });
      }
    });
  }
  handleCancelPicked = (id, pickedQty, pickedPackQty, seqNo) => {
    const data = {
      id,
      picked_qty: pickedQty,
      picked_pack_qty: pickedPackQty,
      seq_no: seqNo,
    };
    this.props.cancelPicked(this.props.outboundNo, this.props.waveNo, [data]);
  }
  handleConfirmPicked = (id, location, allocQty, skuPackQty, traceId, seqNo) => {
    this.props.openPickingModal(id, location, allocQty, skuPackQty, traceId, seqNo);
    this.setState({
      operationMode: 'single',
    });
  }
  handleWaveConfirmPicked = (id, location, allocQty, skuPackQty, traceId, seqNo) => {
    this.props.openPickingModal(id, location, allocQty, skuPackQty, traceId, seqNo);
    this.setState({
      operationMode: 'waveBatch',
    });
  }
  handleConfirmShipped = (id, pickedQty, pickedPackQty, seqNo) => {
    this.props.openShippingModal(id, pickedQty, pickedPackQty, seqNo);
    this.setState({
      operationMode: 'single',
    });
  }
  handleBatchConfirmPicked = () => {
    this.props.openPickingModal();
    this.setState({
      operationMode: 'batch',
    });
  }
  handleBatchConfirmShipped = () => {
    this.props.openShippingModal();
    this.setState({
      operationMode: 'batch',
    });
  }
  handleBatchCancelPicked = () => {
    const { selectedRows } = this.state;
    const list = [];
    for (let i = 0; i < selectedRows.length; i++) {
      const data = {};
      data.id = selectedRows[i].id;
      data.picked_qty = selectedRows[i].picked_qty;
      data.picked_pack_qty = selectedRows[i].picked_qty / selectedRows[i].sku_pack_qty;
      data.seq_no = selectedRows[i].seq_no;
      list.push(data);
    }
    this.props.cancelPicked(this.props.outboundNo, this.props.waveNo, list);
  }
  handleAllocBatchCancel = () => {
    this.props.cancelTraceAlloc(
      this.props.outboundNo,
      this.props.waveNo,
      this.state.selectedRowKeys,
      this.props.loginId
    ).then((result) => {
      if (result.error) {
        let msg = result.error.message;
        if (ALLOC_ERROR_MESSAGE_DESC[result.error.message]) {
          msg = ALLOC_ERROR_MESSAGE_DESC[result.error.message];
        }
        notification.error({
          message: msg,
        });
      }
    });
  }
  handleSuPickChk = () => {
    this.props.showSubarPickChkModal({ visible: true });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRows: [], selectedRowKeys: [] });
  }
  handleSelectRowsChange = (selectedRowKeys, selectedRows) => {
    let status = null;
    const allocated = selectedRows.filter(item => item.status ===
      CWM_OUTBOUND_STATUS.ALL_ALLOC.value);
    const picked = selectedRows.filter(item => item.status ===
      CWM_OUTBOUND_STATUS.ALL_PICKED.value);
    if (allocated && allocated.length === selectedRows.length) {
      status = 'allAllocated';
    } else if (picked && picked.length === selectedRows.length) {
      status = 'allPicked';
    }
    const batchPickedUnShipped = selectedRows.filter(item => item.picked_qty > 0
      && item.picked_qty > item.shipped_qty).length > 0;
    this.setState({
      selectedRowKeys, selectedRows, currentStep: status, batchPickedUnShipped,
    });
  }
  render() {
    const {
      pickDetails, outboundHead, submitting, pickDetailLoading,
      wholePickDetails, pickDetailFilter, pickDetailStat, waveNo,
    } = this.props;
    if (waveNo) {
      this.columns.splice(0, 0, {
        title: 'SO??????',
        dataIndex: 'so_no',
        width: 180,
      });
    }
    const { pickSerialNoCount, pickDetailTotalCount, pickTotalVolume } = pickDetailStat;
    const { currentStep, batchPickedUnShipped, pagination } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleSelectRowsChange,
      selections: [{
        key: 'all-data',
        text: '???????????????',
        onSelect: () => {
          const selectedRowKeys = wholePickDetails.map(item => item.id);
          this.handleSelectRowsChange(selectedRowKeys, wholePickDetails);
        },
      }, {
        key: 'opposite-data',
        text: '???????????????',
        onSelect: () => {
          const fDataSource = wholePickDetails.filter(item =>
            !this.state.selectedRowKeys.find(item1 => item1 === item.id));
          const selectedRowKeys = fDataSource.map(item => item.id);
          this.handleSelectRowsChange(selectedRowKeys, fDataSource);
        },
      }],
    };
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={pickDetails}
        rowKey="id"
        loading={pickDetailLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pickDetailTotalCount,
          showSizeChanger: true,
          showTotal: total => `??? ${total} ???`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={pickDetailFilter.search} placeholder="??????/?????????" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              {outboundHead.shipping_mode === 'manual'
                  && outboundHead.so_type !== CWM_SO_TYPES[3].value
                  && currentStep === 'allAllocated' && <Button onClick={this.handleBatchConfirmPicked}>
                    <LogixIcon type="icon-check-all" />??????????????????
                  </Button>
              }
              {currentStep === 'allAllocated' && <Button onClick={this.handleAllocBatchCancel} icon="close" loading={submitting}>
                ??????????????????
              </Button>}
              {outboundHead.shipping_mode === 'manual'
              && outboundHead.so_type !== CWM_SO_TYPES[3].value
              && batchPickedUnShipped && <Button onClick={this.handleBatchConfirmShipped}>
                <LogixIcon type="icon-check-all" />??????????????????
              </Button>}
              {outboundHead.shipping_mode === 'manual'
              && outboundHead.so_type !== CWM_SO_TYPES[3].value
              && currentStep === 'allPicked' && <Button loading={submitting} onClick={this.handleBatchCancelPicked} icon="close">
                ??????????????????
              </Button>}
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              {outboundHead.shipping_mode === 'manual' && outboundHead.su_setting.enabled &&
              <Button type="primary" icon="barcode" onClick={this.handleSuPickChk} disabled={wholePickDetails.length === 0}>
              ??????????????????
              </Button>}
              { this.props.waveNo &&
              outboundHead.status >= CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value &&
                <Button loading={submitting} type="primary" onClick={this.handleWaveConfirmPicked}>??????????????????</Button>}
            </PrivilegeCover>
          </DataPane.Actions>
        </DataPane.Toolbar>
        <PickingModal
          pickMode={this.state.operationMode}
          selectedRows={this.state.selectedRows}
          outboundNo={this.props.outboundNo}
          waveNo={this.props.waveNo}
        />
        <ShippingModal
          shipMode={this.state.operationMode}
          selectedRows={this.state.selectedRows}
          outboundNo={this.props.outboundNo}
        />
        <SuBarPickChkpackModal
          outboundNo={this.props.outboundNo}
          suSetting={outboundHead.su_setting}
        />
        <Summary>
          <Summary.Item label="????????????">{outboundHead.total_qty}</Summary.Item>
          <Summary.Item label="????????????">{outboundHead.total_alloc_qty}</Summary.Item>
          <Summary.Item label="????????????">{outboundHead.total_picked_qty}</Summary.Item>
          <Summary.Item label="???????????????">{pickSerialNoCount}</Summary.Item>
          {pickTotalVolume > 0 && <Summary.Item label="?????????">{pickTotalVolume.toFixed(5)}</Summary.Item>}
        </Summary>
      </DataPane>
    );
  }
}
