import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Modal, Button, Tag, Dropdown, Icon, Menu } from 'antd';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import { createFilename } from 'client/util/dataTransform';
import EditableCell from 'client/components/EditableCell';
import ImportDataPanel from 'client/components/ImportDataPanel';
import Summary from 'client/components/Summary';
import { openReceiveModal, viewSuBarcodeScanModal, updateInbProductVol, loadInboundProductDetails, showBatchReceivingModal, expressReceive, markReloadInbound, loadWholeInboundProductDetails } from 'common/reducers/cwmReceive';
import { CWM_INBOUND_STATUS, CWM_DAMAGE_LEVEL, SKU_REQUIRED_PROPS } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SKUPopover from '../../../common/popover/skuPopover';
import ReceivingModal from '../modal/receivingModal';
import BatchReceivingModal from '../modal/batchReceivingModal';
import SuBarcodeScanModal from '../modal/suBarcodeScanModal';
import { formatMsg } from '../../message.i18n';

const SKU_PROPS_MAP = {};
SKU_REQUIRED_PROPS.forEach((amf) => { SKU_PROPS_MAP[amf.value] = amf.label; });

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    inboundHead: state.cwmReceive.inboundFormHead,
    inboundProducts: state.cwmReceive.inboundProducts,
    unRecvablePrds: state.cwmReceive.unRecvablePrds,
    unRecvAsnSeqNos: state.cwmReceive.unRecvAsnSeqNos,
    serialNoCount: state.cwmReceive.serialNoCount,
    total: state.cwmReceive.productsTotalCount,
    reload: state.cwmReceive.inboundReload,
    defaultWhse: state.cwmContext.defaultWhse,
    inbProductFilter: state.cwmReceive.inbProductFilter,
    inbProductLoading: state.cwmReceive.inbProductLoading,
    wholeInbProducts: state.cwmReceive.wholeInbProducts,
    wholeLoading: state.cwmReceive.wholeInbProductsLoading,
  }),
  {
    openReceiveModal,
    viewSuBarcodeScanModal,
    updateInbProductVol,
    loadInboundProductDetails,
    showBatchReceivingModal,
    expressReceive,
    markReloadInbound,
    loadWholeInboundProductDetails,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
})
export default class ReceiveDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    inboundNo: PropTypes.string.isRequired,
    inboundHead: PropTypes.shape({
      owner_partner_id: PropTypes.number,
      rec_mode: PropTypes.oneOf(['scan', 'manual', 'import']),
    }).isRequired,
    onVolChange: PropTypes.func,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
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
    this.handleReload(null, 1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.handleReload(null, 1);
    }
  }
  handlePageChange = (current, pageSize) => {
    this.handleReload(null, current, pageSize, true);
  }
  msg =formatMsg(this.props.intl)
  handleReload = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.inbProductFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;
    this.props.loadInboundProductDetails(
      this.props.inboundNo, current, pageSize,
      JSON.stringify(filter)
    )
      .then((result) => {
        if (!result.error) {
          this.setState({ pagination: { current, pageSize } });
        }
      });
    if (!onlyLoadList) {
      this.props.loadWholeInboundProductDetails(this.props.inboundNo);
      this.handleDeselectRows();
    }
  }

  handleBatchProductReceive = () => {
    this.props.showBatchReceivingModal();
  }
  handleExpressReceived = () => {
    const self = this;
    Modal.confirm({
      title: '是否确认收货完成?',
      content: '默认按预期数量收货，确认收货后可以取消收货退回',
      onOk() {
        return self.props.expressReceive(
          self.props.inboundNo,
          self.props.loginId, self.props.username, new Date()
        );
      },
      onCancel() {},
      okText: '确认收货',
    });
  }
  handleManualReceive = (record) => {
    this.props.openReceiveModal({
      editable: true,
      inboundNo: this.props.inboundNo,
      inboundProduct: record,
    });
  }
  handleReceiveDetails = (record) => {
    this.props.openReceiveModal({
      editable: false,
      inboundNo: this.props.inboundNo,
      inboundProduct: record,
    });
  }
  handleSearch = (search) => {
    const filter = { ...this.props.inbProductFilter, search };
    this.handleReload(filter, 1, null, true);
    this.handleDeselectRows();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  handleUploadPutaway = () => {
    this.setState({ importPanelVisible: false });
    this.props.markReloadInbound();
  }
  handlePrdtVolChange = (inbPrdId, vol) => {
    this.props.updateInbProductVol(inbPrdId, vol);
  }
  handleSuBarcodeScanReceive = () => {
    this.props.viewSuBarcodeScanModal({
      visible: true,
      inboundNo: this.props.inboundNo,
    });
  }
  handleMoreMenuClick = (e) => {
    if (e.key === 'import') {
      this.setState({
        importPanelVisible: true,
      });
    } else {
      window.open(`${API_ROOTS.default}v1/cwm/export/receiving/details/${createFilename('receiving')}.xlsx?inboundNo=${this.props.inboundNo}`);
    }
  }
  handleUnRecvProductExport = () => {
    const { inboundHead, unRecvAsnSeqNos } = this.props;
    const file = `${inboundHead.asn_no}_sku_${moment().format('YYMMDDHHmm')}`;
    window.open(`${API_ROOTS.default}v1/cwm/export/receiving/incomplete/${file}.xlsx?asnNo=${inboundHead.asn_no}&seqNos=${JSON.stringify(unRecvAsnSeqNos)}`);
  }
  columns = [{
    title: '行号',
    dataIndex: 'asn_seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '货品',
    dataIndex: 'product_sku',
    width: 220,
    render: o => (<SKUPopover ownerPartnerId={this.props.inboundHead.owner_partner_id} sku={o} />),
  }, {
    title: '品名',
    width: 150,
    dataIndex: 'name',
  }, {
    title: '类别',
    width: 100,
    dataIndex: 'category',
  }, {
    title: '预期数量',
    width: 100,
    dataIndex: 'expect_qty',
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '收货数量',
    dataIndex: 'received_qty',
    width: 120,
    align: 'right',
    render: (o, record) => {
      if (record.received_qty === record.expect_qty) {
        return (<span className="text-success">{o}</span>);
      } else if (record.received_qty < record.expect_qty) {
        return (<span className="text-warning">{o}</span>);
      } else if (record.received_qty > record.expect_qty) {
        return (<span className="text-error">{o}</span>);
      }
      return null;
    },
  }, {
    title: '批次号',
    width: 100,
    dataIndex: 'external_lot_no',
    align: 'right',
  }, {
    title: '立方数',
    width: 200,
    dataIndex: 'received_vol',
    align: 'right',
    render: (vol, record) =>
      (<EditableCell
        size="small"
        editable={record.received_qty > 0}
        value={vol}
        onSave={value => this.handlePrdtVolChange(record.id, Number(value))}
        style={{ width: '100%' }}
        btnPosition="right"
      />),
  }, {
    title: '包装情况',
    dataIndex: 'damage_level',
    width: 120,
    align: 'center',
    render: dl => (dl || dl === 0) && <Tag color={CWM_DAMAGE_LEVEL[dl].color}>
      {CWM_DAMAGE_LEVEL[dl].text}</Tag>,
  }, {
    title: '采购订单号',
    dataIndex: 'po_no',
    width: 100,
  }, {
    title: '集装箱号',
    dataIndex: 'container_no',
    width: 100,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 100,
  }, {
    title: '收货人员',
    width: 150,
    dataIndex: 'received_by',
    render: o => (o ? o.join(',') : ''),
  }, {
    title: '收货时间',
    width: 100,
    dataIndex: 'received_date',
    render: col => col && moment(col).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => {
      if (this.props.inboundHead.rec_mode === 'scan' ||
        record.sku_incomplete ||
        this.props.inboundHead.status === CWM_INBOUND_STATUS.COMPLETED.value ||
        record.received_qty >= record.expect_qty) {
        return (<RowAction onClick={this.handleReceiveDetails} icon="eye-o" label="收货记录" row={record} />);
      }
      return (<PrivilegeCover module="cwm" feature="receiving" action="edit">
        <RowAction onClick={this.handleManualReceive} icon="check-circle-o" label="收货确认" row={record} />
      </PrivilegeCover>);
    },
  }]
  render() {
    const {
      inboundHead, inboundProducts, total, wholeLoading, wholeInbProducts,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      selections: [{
        key: 'all-data',
        text: '选择全部项',
        onSelect: () => {
          const fDataSource = wholeInbProducts.filter(item => !(item.trace_id_count >= 1));
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
          const fDataSource = wholeInbProducts.filter(item => !(item.trace_id_count >= 1) &&
            !this.state.selectedRowKeys.find(item1 => item1 === item.id));
          const selectedRowKeys = fDataSource.map(item => item.id);
          this.setState({
            selectedRowKeys,
            selectedRows: fDataSource,
          });
        },
      }],
      getCheckboxProps: record => ({
        disabled: record.trace_id.length >= 1 || record.sku_incomplete,
      }),
    };
    const { pagination } = this.state;
    const { unRecvablePrds, unRecvAsnSeqNos, serialNoCount } = this.props;
    let alertMsg;
    if (unRecvablePrds.length > 0) {
      let prdnos = `${unRecvablePrds.join(',')}`;
      if (prdnos.length > 130) {
        prdnos = `${prdnos.slice(0, 130)}...`;
      }
      const props = inboundHead.sku_rule.required_props.map(rp => SKU_PROPS_MAP[rp]).join('/');
      alertMsg = <div>以下货号属性({props})需要补充完整:<br />{prdnos}</div>;
    }
    const moreMenu = (
      <Menu onClick={this.handleMoreMenuClick}>
        <Menu.Item key="export"><Icon type="download" /> 导出待收明细</Menu.Item>
        <Menu.Item key="import"><Icon type="upload" /> 导入实收记录</Menu.Item>
      </Menu>
    );
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={inboundProducts}
        rowKey="id"
        loading={this.props.inbProductLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showTotal: totalCount => `共 ${totalCount} 条`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={this.props.inbProductFilter.search} placeholder="货号/SKU" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              {inboundHead.rec_mode === 'manual' &&
              <Button onClick={this.handleBatchProductReceive}>
              批量收货确认
              </Button>}
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>

            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              {unRecvAsnSeqNos.length > 0 &&
              <Button onClick={this.handleUnRecvProductExport}>
              补充货品属性
              </Button>}
              {inboundHead.rec_mode === 'manual' && inboundHead.status === CWM_INBOUND_STATUS.CREATED.value &&
              <Dropdown overlay={moreMenu}>
                <Button icon="file-excel">导入收货确认</Button>
              </Dropdown>}
              {inboundHead.rec_mode === 'manual' && inboundHead.su_setting.enabled &&
                unRecvablePrds.length === 0 &&
                inboundHead.status !== CWM_INBOUND_STATUS.COMPLETED.value &&
                <Button type="primary" icon="barcode" disabled={wholeLoading} onClick={this.handleSuBarcodeScanReceive}>条码收货</Button>}
            </PrivilegeCover>
          </DataPane.Actions>
          {alertMsg && <Alert message={alertMsg} type="warning" showIcon />}
        </DataPane.Toolbar>
        <ReceivingModal />
        <BatchReceivingModal inboundNo={this.props.inboundNo} data={this.state.selectedRows} />
        <SuBarcodeScanModal />
        <ImportDataPanel
          adaptors={null}
          title="收货确认导入"
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cwm/receiving/details/import`}
          formData={{
              loginId: this.props.loginId,
              loginName: this.props.username,
              inboundNo: this.props.inboundNo,
              whseCode: this.props.defaultWhse.code,
            }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleUploadPutaway}
        />
        <Summary>
          <Summary.Item label="序列号总数">{serialNoCount}</Summary.Item>
          <Summary.Item label="总预期数量">{inboundHead.total_expect_qty}</Summary.Item>
          <Summary.Item label="总实收数量">{inboundHead.total_received_qty}</Summary.Item>
          <Summary.Item label="总立方数">{<EditableCell
            value={inboundHead.total_received_vol}
            // editable={currentStatus < CWM_INBOUND_STATUS.COMPLETED.value}
            onSave={this.props.onVolChange}
            btnPosition="right"
          />}
          </Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
