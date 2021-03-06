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
    title: '??????',
    dataIndex: 'seqno',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '????????????',
    dataIndex: 'convey_no',
    width: 150,
  }, {
    title: '??????ID',
    dataIndex: 'trace_id',
    width: 200,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: '?????????',
    dataIndex: 'serial_no',
    width: 200,
  }, {
    title: '?????????',
    dataIndex: 'external_lot_no',
    width: 100,
    align: 'left',
  }, {
    title: '??????',
    dataIndex: 'product_sku',
    width: 220,
    render: o => (<SKUPopover ownerPartnerId={this.props.inboundHead.owner_partner_id} sku={o} />),
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'inbound_qty',
    align: 'right',
    render: o => (<span className="text-emphasis">{o}</span>),
  }, {
    title: '????????????',
    dataIndex: 'receive_location',
    width: 150,
    render: o => (o && <Tag>{o}</Tag>),
  }, {
    title: '????????????',
    dataIndex: 'putaway_location',
    width: 150,
    render: o => (o && <Tag color="green">{o}</Tag>),
    /*  }, {
    title: '????????????',
    dataIndex: 'target_location',
    width: 120, */
  }, {
    title: '????????????',
    width: 200,
    dataIndex: 'name',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'put_by',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'put_date',
    render: allocateDt => allocateDt && moment(allocateDt).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '??????',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (!record.result) { // ????????????????????? 0 ????????? 1 ?????????
        return (<PrivilegeCover module="cwm" feature="receiving" action="edit">
          <RowAction onClick={this.handlePutAway} icon="check-circle-o" label="????????????" row={record} />
          <RowAction onClick={this.handleUndoReceive} icon="close-circle-o" tooltip="????????????" row={record} />
        </PrivilegeCover>);
      }
      return null;
    },
  }]
  handleExpressPutAway = () => {
    const { props } = this;
    Modal.confirm({
      title: '?????????????????????????',
      content: '???????????????????????????????????????????????????????????????????????????????????????',
      onOk() {
        return props.expressPutaways(props.loginId, props.loginName, props.inboundNo);
      },
      onCancel() {},
      okText: '????????????',
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
        message.success('????????????');
        this.handleLoad();
      } else {
        message.error('????????????');
      }
    });
  }
  handleBatchUndoReceives = () => {
    this.props.undoReceives(
      this.props.inboundNo, this.props.loginId,
      this.state.selectedRows.map(sr => sr.trace_id)
    ).then((result) => {
      if (!result.error) {
        message.success('????????????');
      } else {
        message.error('????????????');
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
      .map(ibp => ibp.serial_no)).size; // ??????
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      selections: [{
        key: 'all-data',
        text: '???????????????',
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
        text: '???????????????',
        onSelect: () => {
          // ???????????????: result?????????1 & ???????????????
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
        <Menu.Item key="export"><Icon type="download" /> ?????????????????????</Menu.Item>
        <Menu.Item key="import"><Icon type="upload" /> ?????????????????????</Menu.Item>
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
          showTotal: total => `??? ${total} ???`,
          onChange: this.handlePageChange,
          onShowSizeChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={this.props.putawayFilter.search} placeholder="??????/?????????" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              <Button onClick={this.handleBatchPutAways} icon="check">
              ??????????????????
              </Button>
              <Button loading={submitting} onClick={this.handleBatchUndoReceives} icon="rollback">
              ??????????????????
              </Button>
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Actions>

            <PrivilegeCover module="cwm" feature="receiving" action="edit">
              {inboundHead.rec_mode === 'manual' &&
                wholePutawayDetails.filter(ds =>
                  ds.receive_location && ds.result === 0).length > 0 &&
                  <Button loading={submitting || loading} icon="check" onClick={this.handleExpressPutAway}>
                  ????????????
                  </Button>
              }
              {inboundHead.rec_mode === 'manual' && wholePutawayDetails.filter(ds => ds.result === 0).length > 0 &&
                <Dropdown overlay={moreMenu}>
                  <Button icon="file-excel">??????????????????</Button>
                </Dropdown>}
              {inboundHead.rec_mode === 'manual' && inboundHead.su_setting.enabled &&
                wholePutawayDetails.filter(ds => ds.serial_no && ds.result === 0).length > 0 &&
                <Button type="primary" icon="barcode" onClick={this.handleSuBarcodePutaway} disabled={wholePutawayLoading}>
                ????????????
                </Button>
              }
            </PrivilegeCover>
          </DataPane.Actions>
        </DataPane.Toolbar>
        <PuttingAwayModal inboundNo={this.props.inboundNo} />
        <SuBarPutawayModal />
        <ImportDataPanel
          adaptors={null}
          title="????????????"
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
          <Summary.Item label="???????????????">{serialNoCount}</Summary.Item>
          <Summary.Item label="???????????????">{inboundHead.total_expect_qty}</Summary.Item>
          <Summary.Item label="???????????????">{inboundHead.total_received_qty}</Summary.Item>
          <Summary.Item label="????????????">{inboundHead.total_received_vol}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
