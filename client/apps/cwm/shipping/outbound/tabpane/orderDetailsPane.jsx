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
      <RowAction shape="circle" onClick={this.handleShowStockPanel} icon="file-search" tooltip="查询货号+库别库存" row={record} />,
  }, {
    title: '行号',
    dataIndex: 'seq_no',
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
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 120,
  }, {
    title: '订单数量',
    dataIndex: 'order_qty',
    width: 100,
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '预配数量',
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
    title: '分配数量',
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
    title: '计量单位',
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
    title: '入库单号',
    dataIndex: 'asn_cust_order_no',
    width: 200,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 200,
  }, {
    title: '产品序列号',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '供货商',
    dataIndex: 'supplier',
    width: 200,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 130,
    fixed: 'right',
    render: (o, record) => {
      const completed = this.props.outboundHead.status === CWM_OUTBOUND_STATUS.COMPLETED.value;
      // 预分配不足手动预分配
      if (!completed && record.product_no && record.prealloc_qty < record.order_qty &&
        record.alloc_qty === 0) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction onClick={this.handleManualPreAlloc} icon="block" label="预分配" row={record} />
          {record.prealloc_qty > 0 &&
          <RowAction onClick={this.handleCancelPreAlloc} icon="close-square" tooltip="取消预分配" row={record} />}
        </PrivilegeCover>);
      }
      // 预配成功且未分配完成则可分配 且未放置分配任务
      if (!completed && record.alloc_qty < record.order_qty) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction onClick={this.handleSKUAutoAllocate} icon="thunderbolt" label="自动分配" row={record} disabled={this.props.submitting || this.props.outboundHead.is_allocing} />
          {record.product_no &&
          <RowAction
            overlay={<Menu onClick={ev => this.handleRowMenuClick(ev, record)}>
              <Menu.Item key="manualalloc" disabled={record.status === -1}><Icon type="select" />手动分配</Menu.Item>
              {!this.props.waveNo && record.prealloc_qty === record.order_qty && <Menu.Item key="cancel-prealloc"><Icon type="close-square" />取消预分配</Menu.Item>}
            </Menu>}
            row={record}
          />}
        </PrivilegeCover>);
      }
      return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
        {record.product_no && record.alloc_qty > 0 && <RowAction onClick={this.handleAllocDetails} icon="eye-o" label="分配明细" row={record} />}
        {(!completed && record.alloc_qty === 0) && <RowAction onClick={this.handleSKUAutoAllocate} icon="thunderbolt" label="自动分配" row={record} disabled={this.props.submitting || this.props.outboundHead.is_allocing} />}
        {!completed && record.picked_qty < record.alloc_qty &&
        <RowAction onClick={this.handleSKUCancelAllocate} icon="close-circle-o" tooltip="取消分配" row={record} disabled={this.props.submitting} />}
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
    this.pollTimer = setInterval(() => { // 定时查询任务状态
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
            message: '预配不足',
            description: `未成功预分配行号:${lackArr.join(',')}`,
          });
        } else {
          notification.success({
            message: '操作成功',
            description: `${seqNos ? '' : '订单'}预分配成功`,
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
          message: '操作成功',
          description: `${seqNos ? '' : '订单'}已取消预分配`,
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
      out['订单号'] = outboundHead.cust_order_no;
      out['货号'] = dv.product_no;
      out['名称'] = dv.name;
      out['订货数量'] = dv.order_qty;
      out['分配数量'] = dv.alloc_qty;
      out['计量单位'] = unit ? unit.name : '';
      out['库别'] = dv.virtual_whse;
      out['采购订单号'] = dv.po_no;
      out['批次号'] = dv.external_lot_no;
      out['序列号'] = dv.serial_no;
      out['供应商'] = dv.supplier;
      if (!dv.product_no) {
        const serialStock = serialInfos.filter(seri => seri.serial_no === dv.serial_no)[0];
        if (serialStock) {
          if (serialStock.stock_qty > 0) {
            out['库存序列号'] = '有库存';
            if (serialStock.alloc_qty === serialStock.stock_qty) {
              out['库存序列号'] = '有库存/已分配';
            }
          } else {
            out['库存序列号'] = '入库中';
          }
          outboundHead.alloc_rules.filter(alc => alc.key !== 'serial_no').forEach((alc) => {
            if (alc.eigen) {
              out[`${alc.eigen}/${ALLOC_RULE_OPTIONS[alc.key]}`] = serialStock[alc.key] || '否';
            } else {
              out[ALLOC_RULE_OPTIONS[alc.key]] = serialStock[alc.key];
            }
          });
        } else {
          out['库存序列号'] = '无库存';
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
    // 预配不足允许自动分配(支持部分发货),接口中根据预配数量与分配数量更新库存可用数量还是预配数量
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
        title: 'SO编号',
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
        unPreAllocMsg = <div>预配不足行号: {seqNos}</div>;
      }
    }
    let unAllocMsg;
    const partialUnAllocProducts = wholeOutboundProducts.filter(wp => wp.alloc_status === 1);
    if (partialUnAllocProducts.length > 0) {
      const seqNos = partialUnAllocProducts.map(op => op.seq_no).join(',');
      unAllocMsg = <div>未完成配货行号: {seqNos}</div>;
      const noqtyPrds = partialUnAllocProducts.filter(uaprd => !uaprd.product_no);
      let allocHintMsg = null;
      if (noqtyPrds.length > 0) { // 无货号数量时无法手工分配,分配错误提示
        allocHintMsg = `检查是否${outboundHead.alloc_rules.filter(aoc => aoc.eigen).map(aoc => aoc.eigen).concat('已获取海关入库监管ID').join('或')}`;
      }
      if (allocHintMsg) {
        unAllocMsg = <div>未完成配货行号: {seqNos}<br />{allocHintMsg}</div>;
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
        text: '选择全部项',
        onSelect: () => {
          const selRows = wholeOutboundProducts;
          const selectedRowKeys = wholeOutboundProducts.map(item => item[rowKey]);
          this.handleSelRowsChange(selectedRowKeys, selRows);
        },
      }, {
        key: 'opposite-data',
        text: '反选全部项',
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
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={productsFilter.search} placeholder="货号/序列号" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              {(ButtonStatus === 'alloc') && (<Button loading={submitting || outboundHead.is_allocing} onClick={this.handleBatchAutoAlloc}>
                <LogixIcon type="icon-check-all" />批量自动分配
              </Button>)}
              {ButtonStatus === 'unalloc' && (<Button loading={submitting} onClick={this.handleAllocBatchCancel} icon="close">
                批量取消分配
              </Button>)}
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>
            {partialUnAllocProducts.length > 0 && wholeOutboundProducts.length > 0 &&
              <Button type="primary" onClick={this.handleExportUnAllocs}>导出未配货项</Button>
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
                      >{isWave ? '波次自动分配' : '订单自动分配'}</Button>}
                {outboundHead.total_prealloc_qty + outboundHead.total_alloc_qty <
                  outboundHead.total_qty && outboundHead.total_qty > 0 &&
                  <Button loading={submitting} icon="block" onClick={() => this.handleManualPreAlloc()}>订单预分配</Button>}
                {/* <Button loading={submitting}
                   type="primary" onClick={this.handleCancelPreAlloc}>订单取消预分配</Button> */}
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
          <Summary.Item label="订单总数">{outboundHead.total_qty}</Summary.Item>
          <Summary.Item label="分配总数">{allocatedNum}</Summary.Item>
          <Summary.Item label="序列号总数">{orderSerialNoNum}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
