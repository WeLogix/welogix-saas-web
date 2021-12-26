import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import moment from 'moment';
import DataTable from 'client/components/DataTable';
import { Badge, Layout, Button, Card, Form, Row, Col, message, Drawer, Dropdown, Menu, Icon } from 'antd';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import {
  showAddStockIoModal,
  loadBatDecl,
  addOrRmBatStock,
  getBatchDeclDetails,
  loadBdStockIoList,
  cancelSasBatchDecl,
  beginSasBatchDecl,
} from 'common/reducers/cwmSasblReg';
import { toggleBizObjLogsPanel } from 'common/reducers/operationLog';
import { SASBL_BAT_DECL_STATUS } from 'common/constants';
import LogsPane from 'client/components/Dock/common/logsPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import AddStockIoModal from './modals/addStockIoModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    reload: state.cwmSasblReg.detailReload,
    batchDecl: state.cwmSasblReg.batchDecl,
    bdDetails: state.cwmSasblReg.bdDetails,
    stockIoList: state.cwmSasblReg.stockIoList,
    bdDetailFilters: state.cwmSasblReg.bdDetailFilters,
    bdStockFilters: state.cwmSasblReg.bdStockFilters,
    visible: state.operationLog.bizObjLogPanel.visible,
  }),
  {
    showAddStockIoModal,
    loadBatDecl,
    addOrRmBatStock,
    getBatchDeclDetails,
    loadBdStockIoList,
    beginSasBatchDecl,
    cancelSasBatchDecl,
    toggleBizObjLogsPanel,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
@Form.create()
export default class BatDeclRegDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (this.props.defaultWhse.code) {
      this.handleLoadBdStocks();
      this.handleLoadDetails(1);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultWhse.code && (nextProps.defaultWhse !== this.props.defaultWhse)) {
      this.handleLoadBdStocks(nextProps.defaultWhse.code);
      this.handleLoadDetails(1, null, nextProps.defaultWhse.code);
    }
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.handleLoadBdStocks();
      this.handleLoadDetails();
    }
  }
  handleLoadBdStocks = (whseCodeParam, filter) => {
    const whseCode = whseCodeParam || this.props.defaultWhse.code;
    const { batchDeclNo } = this.context.router.params;
    const { bdStockFilters } = this.props;
    const newFilter = { ...bdStockFilters, ...filter };
    this.props.loadBatDecl(batchDeclNo, whseCode);
    this.props.loadBdStockIoList({ batdecNo: batchDeclNo, whseCode, filters: newFilter });
  }
  handleLoadDetails = (currentPage, sizeOfPage, whsecode, filter) => {
    const { batchDeclNo } = this.context.router.params;
    const { bdDetails: { pageSize, current }, detailfilters } = this.props;
    const newfilter = { ...detailfilters, ...filter };
    this.props.getBatchDeclDetails({
      bdNo: batchDeclNo,
      whseCode: whsecode || this.props.defaultWhse.code,
      pageSize: sizeOfPage || pageSize,
      current: currentPage || current,
      filters: newfilter,
    });
  }
  msg = formatMsg(this.props.intl)
  stockIoColumns = [{
    title: this.msg('seqNo'),
    dataIndex: 'INDEX',
    width: 50,
    render: (rf, row, seq) => seq + 1,
  }, {
    title: this.msg('stockNo'),
    dataIndex: 'stock_no',
    width: 180,
    render: (stockno, row) => stockno || row.cop_stock_no,
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('ownerName'),
    dataIndex: 'owner_name',
    width: 150,
  }, {
    title: this.msg('approvedDate'),
    dataIndex: 'stock_decl_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('remove'),
    width: 60,
    dataIndex: 'OP_COL',
    fixed: 'right',
    render: (o, record) => (
      this.props.batchDecl.bd_status === 1 &&
      <PrivilegeCover module="cwm" feature="supervision" action="delete">
        <RowAction danger icon="minus-square" onClick={() => this.handleRemoveStock(record)} />
      </PrivilegeCover>),
  }]

  detailColumns = [{
    title: this.msg('seqNo'),
    dataIndex: 'INDEX',
    width: 50,
    render: (rf, row, seq) => seq + 1,
  }, {
    title: this.msg('prdtItemNo'),
    dataIndex: 'prdt_item_no',
    width: 150,
  }, {
    title: this.msg('sgdProductNo'),
    dataIndex: 'sgd_product_no',
    width: 120,
  }, {
    title: this.msg('sgdName'),
    dataIndex: 'sgd_name',
    width: 120,
  }, {
    title: this.msg('sgdGGty'),
    dataIndex: 'sgd_g_qty',
    width: 120,
  }, {
    title: this.msg('sgdGUnit'),
    dataIndex: 'sgd_g_unit',
    width: 120,
  }, {
    title: this.msg('sgdDecPrice'),
    dataIndex: 'sgd_dec_price',
    width: 120,
  }, {
    title: this.msg('sgdAmount'),
    dataIndex: 'sgd_amount',
    width: 120,
  }, {
    dataIndex: 'SPACER_COL',
  }]
  showAddStockIoModal = () => {
    const {
      owner_partner_id: partnerId, sasbl_apply_no: applyNo,
    } = this.props.batchDecl;
    const data = {
      visible: true,
      ioFlag: this.context.router.params.ieType,
      partnerId,
      applyNo,
      batchDeclNo: this.context.router.params.batchDeclNo,
    };
    this.props.showAddStockIoModal(data);
  }
  handleRemoveStock = (row) => {
    const { ieType, batchDeclNo } = this.context.router.params;
    this.props.addOrRmBatStock([row.cop_stock_no], batchDeclNo, ieType, true)
      .then((result) => {
        if (!result.error) {
          this.handleLoadBdStocks();
          this.handleLoadDetails();
          message.info(this.msg('opSucceed'));
        } else {
          message.error(result.error.message, 10);
        }
      });
  }
  handleBatchDeclBegin = () => {
    const { stockIoList } = this.props;
    if (stockIoList.length > 0) {
      this.props.beginSasBatchDecl(this.context.router.params.batchDeclNo).then((result) => {
        if (!result.error) {
          message.info(this.msg('成功生成委托'), 10);
        } else {
          message.error(result.error.message, 10);
        }
      });
    } else {
      message.info('关联出入库单不可为空', 10);
    }
  }
  handleBatchDeclCancel = () => {
    this.props.cancelSasBatchDecl(this.context.router.params.batchDeclNo).then((result) => {
      if (!result.error) {
        message.info(this.msg('成功取消委托'), 10);
      } else {
        message.error(result.error.message, 10);
      }
    });
  }
  handleStockSearch = (val) => {
    const { bdStockFilters } = this.props;
    this.handleLoadBdStocks(null, { ...bdStockFilters, search: val });
  }
  handleDetailSearch = (val) => {
    const { bdDetailFilters } = this.props;
    this.handleLoadDetails(1, null, null, { ...bdDetailFilters, search: val });
  }
  handleDetailPageChange = (current, pageSize) => {
    // currentPage, whsecode, filter
    this.handleLoadDetails(current, pageSize);
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'log') {
      this.props.toggleBizObjLogsPanel(true, this.context.router.params.batchDeclNo, 'cwmSasbl');
    }
  }
  handleClosePane = () => {
    this.props.toggleBizObjLogsPanel(false);
  }
  render() {
    const {
      batchDecl, stockIoList, bdDetails, visible,
    } = this.props;
    const bdStatus = batchDecl && SASBL_BAT_DECL_STATUS.filter(bd =>
      bd.value === batchDecl.bd_status)[0];
    return (
      <Layout>
        <PageHeader
          title={
            <span>
              <span>{this.msg('batDetail')} / {this.context.router.params.batchDeclNo}</span>
              {bdStatus &&
                <Badge status={bdStatus.badge} color={bdStatus.tagcolor} text={bdStatus.text} />}
            </span>
          }
        >
          <PageHeader.Actions>
            {batchDecl.bd_status === 1 &&
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button icon="file-text" onClick={this.handleBatchDeclBegin}>{this.msg('生成报关委托')}</Button>
            </PrivilegeCover>}
            {batchDecl.bd_status === 2 &&
            <PrivilegeCover module="cwm" feature="supervision" action="delete">
              <Button icon="file-text" onClick={this.handleBatchDeclCancel}>{this.msg('取消报关委托')}</Button>
            </PrivilegeCover>}
            <Dropdown overlay={<Menu onClick={this.handleMenuClick}><Menu.Item key="log"><Icon type="bars" /> 操作记录</Menu.Item></Menu>}>
              <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
            </Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent key="main">
          <Form layout="inline">
            <Row gutter={16}>
              <Col sm={24} md={8} lg={10}>
                <Card
                  extra={<Button disabled={batchDecl.bd_status >= 2} onClick={this.showAddStockIoModal} type="primary">
                    关联出入库单
                  </Button>}
                  title={this.msg('stockIO')}
                  bodyStyle={{ padding: 0, paddingTop: 1 }}
                >
                  <DataTable
                    cardView={false}
                    noSetting
                    toolbarActions={
                      <SearchBox
                        placeholder={this.msg('stockNo')}
                        onSearch={this.handleStockSearch}
                      />
                    }
                    pagination={{
                      showTotal: total => `共 ${total} 条`,
                      showSizeChanger: true,
                      defaultPageSize: 20,
                    }}
                    columns={this.stockIoColumns}
                    dataSource={stockIoList}
                    rowKey="id"
                    scrollOffset={340}
                  />
                </Card>
              </Col>
              <Col sm={24} md={16} lg={14}>
                <Card title={this.msg('stockIoDetail')} bodyStyle={{ padding: 0, paddingTop: 1 }} >
                  <DataTable
                    cardView={false}
                    noSetting
                    toolbarActions={
                      <SearchBox
                        placeholder={this.msg('batStockIoSearchPlaceHolder')}
                        onSearch={this.handleDetailSearch}
                      />
                    }
                    pagination={{
                      total: bdDetails.totalCount,
                      showTotal: total => `共 ${total} 条`,
                      showSizeChanger: true,
                      defaultPageSize: 20,
                      onChange: this.handleDetailPageChange,
                      onShowSizeChange: this.handleDetailPageChange,
                    }}
                    columns={this.detailColumns}
                    dataSource={bdDetails.data}
                    rowKey="id"
                    // rowSelection={rowSelection}
                    scrollOffset={340}
                  />
                </Card>
              </Col>
            </Row>
          </Form>
          <Drawer
            visible={visible}
            onClose={this.handleClosePane}
            title={<span>操作记录</span>}
            width={900}
          >
            <LogsPane />
          </Drawer>
        </PageContent>
        <AddStockIoModal />
      </Layout>
    );
  }
}
