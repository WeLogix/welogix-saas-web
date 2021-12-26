import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { connect } from 'react-redux';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, message, Input } from 'antd';
import { showAddStockIoModal, loadBdStockIosToAdd, addOrRmBatStock } from 'common/reducers/cwmSasblReg';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.cwmSasblReg.addStockIoModal.visible,
    modalData: state.cwmSasblReg.addStockIoModal,
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    tenantId: state.account.tenantId,
    filters: state.cwmSasblReg.bdAddStockFilters,
    loading: state.cwmSasblReg.addStockIoModalLoading,
  }),
  {
    showAddStockIoModal,
    loadBdStockIosToAdd,
    addOrRmBatStock,
  }
)
@Form.create()
export default class AddStockIoModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    stockList: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const filters = {
        ...this.props.filters,
      };
      this.handleStockioListLoad(nextProps.modalData, filters);
    }
  }
  handleStockioListLoad = (modalParams, filter, stockNo) => {
    const { whse, filters, modalData } = this.props;
    const newfilter = filter || filters;
    this.props.loadBdStockIosToAdd({
      ...modalData,
      ...modalParams,
      filters: newfilter,
      whseCode: whse.code,
      stockNo,
    }).then((result) => {
      if (!result.error) {
        this.setState({ stockList: result.data });
      } else {
        message.error(result.error.message, 10);
      }
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seqNo'),
    width: 45,
    dataIndex: 'index',
    render: (rf, row, seq) => seq + 1,
  }, {
    title: this.msg('stockNo'),
    width: 180,
    dataIndex: 'stock_no',
    render: (o, record) => o || record.cop_stock_no,
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('owner'),
    width: 150,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('stockIoflag'),
    width: 100,
    dataIndex: 'stock_ioflag',
    render: o => (o === 1 ? this.msg('sasIn') : this.msg('sasOut')),
  }, {
    title: this.msg('approvedDate'),
    dataIndex: 'stock_decl_date',
    render: o => o && moment(o.stock_decl_date).format('YYYY.MM.DD'),
  }, {
    title: this.msg('add'),
    width: 40,
    dataIndex: 'OP_COL',
    render: (o, record) => <RowAction icon="plus-square" onClick={this.handleAddStockToBd} row={record} />,
  }]
  handleLoadSearch = (val) => {
    this.handleStockioListLoad({}, null, val);
  }
  handleOk = () => {
    this.props.showAddStockIoModal({ visible: false });
  }
  handleCancel = () => {
    this.props.showAddStockIoModal({ visible: false });
  }
  handleAddStockToBd = (row) => {
    // 1. update 2. reload modal & detail
    const { modalData: { batchDeclNo, ioFlag } } = this.props;
    this.props.addOrRmBatStock([row.cop_stock_no], batchDeclNo, ioFlag)
      .then((result) => {
        if (!result.error) {
          this.handleStockioListLoad({});
          message.info(this.msg('opSucceed'));
        } else {
          message.error(result.error.message, 10);
        }
      });
  }
  render() {
    const {
      visible, modalData, loading,
    } = this.props;
    const { stockList } = this.state;
    // const owner = owners.find(o => o.id === modalData.partnerId);
    const toolbarActions = (<span>
      <Input
        value={modalData.applyNo}
        style={{ width: 200 }}
      />
      <SearchBox value={this.props.filters.stockSearch} placeholder={this.msg('stockNo')} onSearch={this.handleLoadSearch} />
    </span>);
    const dataSource = stockList;
    return (
      <Modal
        maskClosable={this.props.visible}
        title={this.msg('chooseStockIO')}
        width={850}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={visible}
        style={{ top: 24 }}
      >
        <DataTable
          pagination={{
            showTotal: total => `共 ${total} 条`,
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          noSetting
          toolbarActions={toolbarActions}
          // rowSelection={rowSelection}
          // selectedRowKeys={this.state.selectedRowKeys}
          // onDeselectRows={this.handleDeselectRows}
          columns={this.columns}
          dataSource={dataSource}
          indentSize={0}
          rowKey="cop_stock_no"
          loading={loading}
          scrollOffset={380}
        />
      </Modal>
    );
  }
}
