import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import { Alert, Button, notification, Menu, Icon } from 'antd';
import { CWM_OUTBOUND_STATUS, ALLOC_MATCH_FIELDS, ALLOC_ERROR_MESSAGE_DESC } from 'common/constants';
import {
  openAllocatingModal, loadOutboundProductDetails, loadDetailsBySerials, batchAutoAlloc,
  cancelProductsAlloc, loadWholeOutboundProductDetails, manualPreAlloc, cancelPreAlloc,
  loadAutoAllocTaskStatus,
} from 'common/reducers/cwmOutbound';
import { toggleStockPanel } from 'common/reducers/cwmInventoryStock';
import RowAction from 'client/components/RowAction';
import Summary from 'client/components/Summary';
import { LogixIcon } from 'client/components/FontIcon';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import { string2Bytes } from 'client/util/dataTransform';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import AllocatingModal from '../modal/allocatingModal';
import StockPanel from './../../../common/panel/stockPanel';
import { formatMsg } from '../../message.i18n';

const ALLOC_RULE_OPTIONS = {};
ALLOC_MATCH_FIELDS.forEach((amf) => { ALLOC_RULE_OPTIONS[amf.field] = amf.label; });

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    loginName: state.account.username,
    outboundHead: state.cwmOutbound.outboundFormHead,
    outboundProducts: state.cwmOutbound.outboundProducts,
    outboundPrdStat: state.cwmOutbound.outboundPrdStat,
    wholeOutboundProducts: state.cwmOutbound.wholeOutboundProducts,
    productsLoading: state.cwmOutbound.productsLoading,
    productsFilter: state.cwmOutbound.productsFilter,
    reload: state.cwmOutbound.outboundReload,
    units: state.saasParams.latest.unit.map(un => ({
      code: un.unit_code,
      name: un.unit_name,
    })),
    submitting: state.cwmOutbound.submitting,
  }),
  {
    openAllocatingModal,
    loadOutboundProductDetails,
    loadWholeOutboundProductDetails,
    batchAutoAlloc,
    cancelProductsAlloc,
    loadDetailsBySerials,
    manualPreAlloc,
    cancelPreAlloc,
    toggleStockPanel,
    loadAutoAllocTaskStatus,
  }
)
export default class OrderDetailsPane extends React.Component {
  static propTypes = {
    outboundProducts: PropType.arrayOf(PropType.shape({ seq_no: PropType.number.isRequired })),
  }
  state = {
    selectedRowKeys: [],
    ButtonStatus: null,
    detailEditable: false,
    pagination: {
      pageSize: 20,
      current: 1,
    },
  }
  componentDidMount() {
    this.handleReload();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.handleReload();
    }
  }
  msg = formatMsg(this.props.intl)
  handlePageChange = (current, pageSize) => {
    this.handleReload(null, current, pageSize, true);
  }
  handleReload = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.productsFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadOutboundProductDetails(
      this.props.outboundNo, this.props.waveNo, current, pageSize,
      JSON.stringify(filter)
    )
      .then((result) => {
        if (!result.error) {
          this.setState({ pagination: { current, pageSize } });
        }
      });
    if (!onlyLoadList) {
      this.props.loadWholeOutboundProductDetails(this.props.outboundNo, this.props.waveNo);
      this.handleDeselectRows();
    }
  }
  handleShowStockPanel = (row) => {
    this.props.toggleStockPanel(true, {
      product_no: row.product_no,
      virtual_whse: row.virtual_whse,
    });
  }
  columns = [{
    dataIndex: 'PREFIX_COL',
    width: 40,
    align: 'center',
    render: (o, record) => record.product_no &&
      <RowAction shape="circle" onClick={this.handleShowStockPanel} icon="file-search" tooltip="????????????+????????????" row={record} />,
  }, {
    title: '??????',
    dataIndex: 'seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 200,
  }, {
    title: '????????????',
    dataIndex: 'name',
    width: 200,
  }, {
    title: '??????',
    dataIndex: 'virtual_whse',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'order_qty',
    width: 100,
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '????????????',
    dataIndex: 'prealloc_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (!record.product_no) {
        return <span />;
      }
      if (record.prealloc_qty === record.order_qty) {
        return (<span className="text-success">{o}</span>);
      } else if (record.alloc_qty === 0 && record.prealloc_qty < record.order_qty) {
        return (<span className="text-warning">{o}</span>);
      }
      return <span>{o}</span>;
    },
  }, {
    title: '????????????',
    dataIndex: 'alloc_qty',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (!record.order_qty) {
        if (record.alloc_qty) {
          return (<span className="text-success">{o}</span>);
        }
        return <span />;
      }
      if (record.alloc_qty === record.order_qty) {
        return (<span className="text-success">{o}</span>);
      } else if (record.alloc_qty < record.order_qty) {
        return (<span className="text-warning">{o}</span>);
      }
      return <span />;
    },
  }, {
    title: '????????????',
    dataIndex: 'unit',
    width: 100,
    align: 'center',
    render: (o) => {
      const eunit = this.props.units.find(unit => unit.code === o);
      if (eunit) {
        return eunit.name;
      }
      return o;
    },
  }, {
    title: '????????????',
    dataIndex: 'asn_cust_order_no',
    width: 200,
  }, {
    title: '?????????',
    dataIndex: 'external_lot_no',
    width: 200,
  }, {
    title: '???????????????',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '?????????',
    dataIndex: 'supplier',
    width: 200,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '??????',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 130,
    fixed: 'right',
    render: (o, record) => {
      const completed = this.props.outboundHead.status === CWM_OUTBOUND_STATUS.COMPLETED.value;
      // ??????????????????????????????
      if (!completed && record.product_no && record.prealloc_qty < record.order_qty &&
        record.alloc_qty === 0) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction onClick={this.handleManualPreAlloc} icon="block" label="?????????" row={record} />
          {record.prealloc_qty > 0 &&
          <RowAction onClick={this.handleCancelPreAlloc} icon="close-square" tooltip="???????????????" row={record} />}
        </PrivilegeCover>);
      }
      // ?????????????????????????????????????????? ????????????????????????
      if (!completed && record.alloc_qty < record.order_qty) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction onClick={this.handleSKUAutoAllocate} icon="thunderbolt" label="????????????" row={record} disabled={this.props.submitting || this.props.outboundHead.is_allocing} />
          {record.product_no &&
          <RowAction
            overlay={<Menu onClick={ev => this.handleRowMenuClick(ev, record)}>
              <Menu.Item key="manualalloc" disabled={record.status === -1}><Icon type="select" />????????????</Menu.Item>
              {!this.props.waveNo && record.prealloc_qty === record.order_qty && <Menu.Item key="cancel-prealloc"><Icon type="close-square" />???????????????</Menu.Item>}
            </Menu>}
            row={record}
          />}
        </PrivilegeCover>);
      }
      return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
        {record.product_no && record.alloc_qty > 0 && <RowAction onClick={this.handleAllocDetails} icon="eye-o" label="????????????" row={record} />}
        {(!completed && record.alloc_qty === 0) && <RowAction onClick={this.handleSKUAutoAllocate} icon="thunderbolt" label="????????????" row={record} disabled={this.props.submitting || this.props.outboundHead.is_allocing} />}
        {!completed && record.picked_qty < record.alloc_qty &&
        <RowAction onClick={this.handleSKUCancelAllocate} icon="close-circle-o" tooltip="????????????" row={record} disabled={this.props.submitting} />}
      </PrivilegeCover>);
    },
  }]
  handleRowMenuClick = (ev, row) => {
    if (ev.key === 'manualalloc') {
      this.handleManualAlloc(row);
    } else if (ev.key === 'cancel-prealloc') {
      this.handleCancelPreAlloc(row);
    }
  }
  handleAutoAllocPoll = () => {
    this.pollTimer = setInterval(() => { // ????????????????????????
      this.props.loadAutoAllocTaskStatus(this.props.outboundNo, this.props.waveNo)
        .then((result) => {
          if (!result.error && !result.data.isAllocing && this.pollTimer) {
            clearInterval(this.pollTimer);
          }
        });
    }, 3000);
  }
  handleSKUAutoAllocate = (row) => {
    const rowkey = this.props.waveNo ? [row.id] : [row.seq_no];
    this.props.batchAutoAlloc(
      row.outbound_no,
      this.props.waveNo,
      rowkey,
      this.props.loginId,
      this.props.loginName,
      this.props.outboundHead.cust_order_no
    ).then((result) => {
      if (!result.error) {
        this.handleAutoAllocPoll();
      } else {
        notification.error({
          message: result.error.message,
        });
      }
    });
  }
  handleBatchAutoAlloc = () => {
    this.props.batchAutoAlloc(
      this.props.outboundNo,
      this.props.waveNo,
      this.state.selectedRowKeys,
      this.props.loginId, this.props.loginName, this.props.outboundHead.cust_order_no
    ).then((result) => {
      if (!result.error) {
        this.handleAutoAllocPoll();
      } else {
        notification.error({
          message: result.error.message,
        });
      }
    });
  }
  handleOutboundAutoAlloc = () => {
    this.props.batchAutoAlloc(
      this.props.outboundNo,
      this.props.waveNo,
      null,
      this.props.loginId,
      this.props.loginName,
      this.props.outboundHead.cust_order_no,
    ).then((result) => {
      if (!result.error) {
        this.handleAutoAllocPoll();
      } else {
        notification.error({
          message: result.error.message,
        });
      }
    });
  }
  handleManualPreAlloc = (row) => {
    const { outboundHead } = this.props;
    const seqNos = row ? [row.seq_no] : null;
    this.props.manualPreAlloc(outboundHead.so_no, seqNos).then((result) => {
      if (!result.error) {
        const lackArr = result.data;
        if (lackArr.length > 0) {
          notification.warn({
            message: '????????????',
            description: `????????????????????????:${lackArr.join(',')}`,
          });
        } else {
          notification.success({
            message: '????????????',
            description: `${seqNos ? '' : '??????'}???????????????`,
          });
        }
      }
      this.handleReload();
    });
  }
  handleCancelPreAlloc = (row) => {
    const { outboundHead } = this.props;
    const seqNos = row ? [row.seq_no] : null;
    this.props.cancelPreAlloc(outboundHead.so_no, seqNos).then((result) => {
      if (!result.error) {
        notification.success({
          message: '????????????',
          description: `${seqNos ? '' : '??????'}??????????????????`,
        });
      }
      this.handleReload();
    });
  }
  handleManualAlloc = (row) => {
    this.setState({ detailEditable: true });
    this.props.openAllocatingModal({ outboundNo: row.outbound_no, outboundProduct: row });
  }
  handleAllocDetails = (row) => {
    this.setState({ detailEditable: false });
    this.props.openAllocatingModal({ outboundNo: row.outbound_no, outboundProduct: row });
  }
  handleSKUCancelAllocate = (row) => {
    const rowkey = this.props.waveNo ? [row.id] : [row.seq_no];
    this.props.cancelProductsAlloc(
      row.outbound_no,
      this.props.waveNo,
      rowkey,
      this.props.outboundHead.cust_order_no,
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
  handleAllocBatchCancel = () => {
    this.props.cancelProductsAlloc(
      this.props.outboundNo,
      this.props.waveNo,
      this.state.selectedRowKeys,
      this.props.outboundHead.cust_order_no,
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
  handleUnAllocInfoExport = (unAllocPrds, serialInfos) => {
    const { outboundHead, units } = this.props;
    const csvData = unAllocPrds.map((dv) => {
      const out = {};
      const unit = units.find(unt => unt.code === dv.unit);
      out['?????????'] = outboundHead.cust_order_no;
      out['??????'] = dv.product_no;
      out['??????'] = dv.name;
      out['????????????'] = dv.order_qty;
      out['????????????'] = dv.alloc_qty;
      out['????????????'] = unit ? unit.name : '';
      out['??????'] = dv.virtual_whse;
      out['???????????????'] = dv.po_no;
      out['?????????'] = dv.external_lot_no;
      out['?????????'] = dv.serial_no;
      out['?????????'] = dv.supplier;
      if (!dv.product_no) {
        const serialStock = serialInfos.filter(seri => seri.serial_no === dv.serial_no)[0];
        if (serialStock) {
          if (serialStock.stock_qty > 0) {
            out['???????????????'] = '?????????';
            if (serialStock.alloc_qty === serialStock.stock_qty) {
              out['???????????????'] = '?????????/?????????';
            }
          } else {
            out['???????????????'] = '?????????';
          }
          outboundHead.alloc_rules.filter(alc => alc.key !== 'serial_no').forEach((alc) => {
            if (alc.eigen) {
              out[`${alc.eigen}/${ALLOC_RULE_OPTIONS[alc.key]}`] = serialStock[alc.key] || '???';
            } else {
              out[ALLOC_RULE_OPTIONS[alc.key]] = serialStock[alc.key];
            }
          });
        } else {
          out['???????????????'] = '?????????';
        }
      }
      return out;
    });
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
    const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
    wb.Sheets.Sheet1 = XLSX.utils.json_to_sheet(csvData);
    FileSaver.saveAs(
      new window.Blob([string2Bytes(XLSX.write(wb, wopts))], { type: 'application/octet-stream' }),
      `${outboundHead.cus_order_no || outboundHead.outbound_no}_nonallocates_${Date.now()}.xlsx`
    );
  }
  handleExportUnAllocs = () => {
    const { wholeOutboundProducts } = this.props;
    const unAllocPrds = wholeOutboundProducts
      .filter(dv => !dv.alloc_qty || dv.alloc_qty < dv.order_qty);
    const onlySerialNos = unAllocPrds.filter(dv => !dv.product_no && dv.serial_no)
      .map(dv => dv.serial_no);
    if (onlySerialNos.length > 0) {
      const { outboundHead } = this.props;
      this.props.loadDetailsBySerials(
        JSON.stringify(onlySerialNos),
        outboundHead.owner_partner_id,
        outboundHead.whse_code
      ).then((result) => {
        if (!result.error) {
          this.handleUnAllocInfoExport(unAllocPrds, result.data);
        }
      });
    } else {
      this.handleUnAllocInfoExport(unAllocPrds);
    }
  }
  handleSearch = (search) => {
    const filter = { ...this.props.productsFilter, search };
    this.handleReload(filter, 1, null, true);
    this.handleDeselectRows();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleSelRowsChange = (selectedRowKeys, selectedRows) => {
    let status = null;
    const unallocated = selectedRows.find(item =>
      (!item.alloc_qty || item.alloc_qty < item.order_qty));
    const allocated = selectedRows.find(item =>
      ((!item.order_qty && item.alloc_qty) ||
            item.alloc_qty === item.order_qty) && item.alloc_qty > item.picked_qty);
    if (unallocated && !allocated) {
      status = 'alloc';
    } else if (!unallocated && allocated) {
      status = 'unalloc';
    }
    // ??????????????????????????????(??????????????????),????????????????????????????????????????????????????????????????????????????????????
    this.setState({
      selectedRowKeys,
      ButtonStatus: status,
    });
  }
  render() {
    const {
      outboundHead, outboundProducts, submitting, productsLoading,
      wholeOutboundProducts, productsFilter, outboundPrdStat,
    } = this.props;
    const { outboundProductsTotalCount, allocatedNum, orderSerialNoNum } = outboundPrdStat;
    const { ButtonStatus } = this.state;
    const isWave = !!this.props.waveNo;
    if (isWave) {
      this.columns.splice(0, 0, {
        title: 'SO??????',
        dataIndex: 'so_no',
        width: 180,
      });
    }
    let unPreAllocMsg;
    let unPreAllocPrds = [];
    if (outboundHead.total_prealloc_qty < outboundHead.total_qty) {
      unPreAllocPrds = wholeOutboundProducts.filter(op => op.product_no && op.alloc_qty === 0 &&
         op.prealloc_qty < op.order_qty);
      if (unPreAllocPrds.length > 0) {
        const seqNos = unPreAllocPrds.map(op => op.seq_no).join(',');
        unPreAllocMsg = <div>??????????????????: {seqNos}</div>;
      }
    }
    let unAllocMsg;
    const partialUnAllocProducts = wholeOutboundProducts.filter(wp => wp.alloc_status === 1);
    if (partialUnAllocProducts.length > 0) {
      const seqNos = partialUnAllocProducts.map(op => op.seq_no).join(',');
      unAllocMsg = <div>?????????????????????: {seqNos}</div>;
      const noqtyPrds = partialUnAllocProducts.filter(uaprd => !uaprd.product_no);
      let allocHintMsg = null;
      if (noqtyPrds.length > 0) { // ????????????????????????????????????,??????????????????
        allocHintMsg = `????????????${outboundHead.alloc_rules.filter(aoc => aoc.eigen).map(aoc => aoc.eigen).concat('???????????????????????????ID').join('???')}`;
      }
      if (allocHintMsg) {
        unAllocMsg = <div>?????????????????????: {seqNos}<br />{allocHintMsg}</div>;
      }
    }
    // }
    const alertMsg = [unPreAllocMsg, unAllocMsg].filter(f => f);
    const rowKey = isWave ? 'id' : 'seq_no';
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleSelRowsChange,
      selections: [{
        key: 'all-data',
        text: '???????????????',
        onSelect: () => {
          const selRows = wholeOutboundProducts;
          const selectedRowKeys = wholeOutboundProducts.map(item => item[rowKey]);
          this.handleSelRowsChange(selectedRowKeys, selRows);
        },
      }, {
        key: 'opposite-data',
        text: '???????????????',
        onSelect: () => {
          const selRows = wholeOutboundProducts.filter(item =>
            !this.state.selectedRowKeys.find(item1 => item1 === item[rowKey]));
          const selectedRowKeys = selRows.map(item => item[rowKey]);
          this.handleSelRowsChange(selectedRowKeys, selRows);
        },
      }],
    };
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={outboundProducts}
        rowKey={rowKey}
        loading={productsLoading}
        pagination={{
          ...this.state.pagination,
          total: outboundProductsTotalCount,
          showSizeChanger: true,
          showTotal: total => `??? ${total} ???`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={productsFilter.search} placeholder="??????/?????????" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              {(ButtonStatus === 'alloc') && (<Button loading={submitting || outboundHead.is_allocing} onClick={this.handleBatchAutoAlloc}>
                <LogixIcon type="icon-check-all" />??????????????????
              </Button>)}
              {ButtonStatus === 'unalloc' && (<Button loading={submitting} onClick={this.handleAllocBatchCancel} icon="close">
                ??????????????????
              </Button>)}
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>
            {partialUnAllocProducts.length > 0 && wholeOutboundProducts.length > 0 &&
              <Button type="primary" onClick={this.handleExportUnAllocs}>??????????????????</Button>
            }
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              <span>
                { (outboundHead.status === CWM_OUTBOUND_STATUS.CREATED.value ||
                      outboundHead.status === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) &&
                      <Button
                        loading={submitting || outboundHead.is_allocing}
                        type="primary"
                        icon="thunderbolt"
                        onClick={this.handleOutboundAutoAlloc}
                      >{isWave ? '??????????????????' : '??????????????????'}</Button>}
                {outboundHead.total_prealloc_qty + outboundHead.total_alloc_qty <
                  outboundHead.total_qty && outboundHead.total_qty > 0 &&
                  <Button loading={submitting} icon="block" onClick={() => this.handleManualPreAlloc()}>???????????????</Button>}
                {/* <Button loading={submitting}
                   type="primary" onClick={this.handleCancelPreAlloc}>?????????????????????</Button> */}
              </span>
            </PrivilegeCover>
          </DataPane.Actions>
          {!!alertMsg.length && <Alert message={alertMsg} type="warning" showIcon />}
        </DataPane.Toolbar>
        <AllocatingModal
          shippingMode={this.state.shippingMode}
          editable={this.state.detailEditable}
          waveNo={this.props.waveNo}
        />
        <StockPanel />
        <Summary>
          <Summary.Item label="????????????">{outboundHead.total_qty}</Summary.Item>
          <Summary.Item label="????????????">{allocatedNum}</Summary.Item>
          <Summary.Item label="???????????????">{orderSerialNoNum}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
