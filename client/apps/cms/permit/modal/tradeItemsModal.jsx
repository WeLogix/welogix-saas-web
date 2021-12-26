import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'react-redux';
import { toggleTradeItemModal, loadTradeItems, addPermitTradeItem, loadPermitModels, loadModelItems, resetTradeItemList } from 'common/reducers/cmsPermit';
import DataTable from 'client/components/DataTable';
// import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';

import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    visible: state.cmsPermit.tradeItemModal.visible,
    currentPermit: state.cmsPermit.currentPermit,
    tradeItemList: state.cmsPermit.tradeItemList,
    pageSize: state.cmsPermit.tradeItemList.pageSize,
    currentPage: state.cmsPermit.tradeItemList.current,
    loading: state.cmsPermit.tradeItemList.loading,
    modelItems: state.cmsPermit.modelItems,
    itemPermitModal: state.cmsPermit.itemPermitModal,
  }),
  {
    toggleTradeItemModal,
    loadTradeItems,
    addPermitTradeItem,
    loadPermitModels,
    loadModelItems,
    resetTradeItemList,
  }
)
export default class TradeItemsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    searchText: '',
    selectedRowKeys: [],
    selectedRows: [],
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('no'),
    width: 45,
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('productNo'),
    dataIndex: 'cop_product_no',
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
  }]
  handleCancel = () => {
    this.props.toggleTradeItemModal(false);
    this.props.resetTradeItemList();
    this.setState({
      searchText: '',
    });
  }
  handleInputChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }
  handleSearch = (value) => {
    const { pageSize, currentPage } = this.props;
    this.props.loadTradeItems({
      ownerPartnerId: this.props.currentPermit.owner_partner_id,
      searchText: value,
      pageSize,
      currentPage,
    });
  }
  handleOk = () => {
    const {
      modelItems, itemPermitModal: { permitId, permitModel, modelSeq },
    } = this.props;
    const { selectedRows } = this.state;
    this.props
      .addPermitTradeItem(permitId, permitModel, modelSeq, selectedRows)
      .then((result) => {
        if (!result.error) {
          this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          });
          this.props.loadModelItems({
            permitId,
            modelSeq,
            pageSize: modelItems.pageSize,
            current: modelItems.current,
          });
          this.props.loadPermitModels(permitId);
          this.handleCancel();
        }
      });
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadTradeItems(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        ownerPartnerId: this.props.currentPermit.owner_partner_id,
        searchText: this.state.searchText,
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
      };
      return params;
    },
    remotes: this.props.tradeItemList,
  })
  render() {
    this.dataSource.remotes = this.props.tradeItemList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };
    return (
      <Modal
        title={this.msg('relProductNos')}
        width={800}
        visible={this.props.visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        destroyOnClose
      >
        <DataTable
          size="middle"
          noSetting
          columns={this.columns}
          dataSource={this.dataSource}
          rowkey="cop_product_no"
          loading={this.props.loading}
          rowSelection={rowSelection}
          toolbarActions={
            <Input.Search
              placeholder="商品货号/HS编码/中文品名"
              onSearch={this.handleSearch}
              value={this.state.searchText}
              onChange={this.handleInputChange}
            />
          }
        />
      </Modal>
    );
  }
}
