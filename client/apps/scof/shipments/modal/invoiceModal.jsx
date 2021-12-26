import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, InputNumber } from 'antd';
import { loadInvoices, addOrderInvoices, toggleInvoiceModal, loadInvNoList } from 'common/reducers/sofOrders';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    formData: state.sofOrders.formData,
    invoiceCategories: state.sofInvoice.invoiceCategories,
    list: state.sofOrders.invoicesModal.data,
    filter: state.sofOrders.invoicesModal.filter,
    visible: state.sofOrders.invoicesModal.visible,
    pageSize: state.sofOrders.invoicesModal.pageSize,
    current: state.sofOrders.invoicesModal.current,
    totalCount: state.sofOrders.invoicesModal.totalCount,
    invnolist: state.sofOrders.invoicesModal.invnolist,
  }),
  {
    loadInvoices,
    addOrderInvoices,
    toggleInvoiceModal,
    loadInvNoList,
  }
)
export default class InvoiceModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    coefficient: '',
    selectedRowKeys: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      this.handleReload(nextProps.filter, 1);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    width: 180,
  }, {
    title: this.msg('blNo'),
    dataIndex: 'bl_awb_no',
    width: 180,
  }, {
    title: this.msg('poNoCount'),
    dataIndex: 'po_no_count',
    align: 'right',
    width: 100,
  }, {
    title: this.msg('totalQty'),
    dataIndex: 'total_qty',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('totalNetWt'),
    dataIndex: 'total_net_wt',
    align: 'right',
    width: 120,
  }, {
    title: this.msg('status'),
    dataIndex: 'status',
  }]
  handleReload = (filter, currentPage, pageSize, invNosReload = true) => {
    const newFilter = filter || this.props.filter;
    if (invNosReload) {
      this.props.loadInvNoList({ filter: newFilter }).then((result) => {
        if (!result.error) {
          this.setState({
            selectedRowKeys: [],
          });
        }
      });
    }
    this.props.loadInvoices({
      pageSize: pageSize || this.props.pageSize,
      current: currentPage || this.props.current,
      filter: newFilter,
    });
  }
  handleCancel = () => {
    this.props.toggleInvoiceModal(false);
    this.setState({
      coefficient: '',
    });
  }
  handleOk = () => {
    const { selectedRowKeys, coefficient } = this.state;
    this.props.addOrderInvoices(
      selectedRowKeys,
      this.props.formData.shipmt_order_no, coefficient
    ).then((result) => {
      if (!result.error) {
        this.handleReload();
      }
    });
    this.handleCancel();
  }
  handleCoefficientChange = (value) => {
    this.setState({
      coefficient: value,
    });
  }
  handleInvSearch = (search) => {
    const newFilter = { ...this.props.filter, search };
    this.handleReload(newFilter, 1);
  }
  handleBlSearch = (blsearch) => {
    const newFilter = { ...this.props.filter, blsearch };
    this.handleReload(newFilter, 1);
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.handleReload('', params.current, params.pageSize, false),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      return params;
    },
    remotes: this.props.list,
  })
  render() {
    const {
      visible, pageSize, current, totalCount, // buyers, sellers, invoiceCategories,
      filter: listFilter, list, invnolist,
    } = this.props;
    this.dataSource.remotes = {
      data: list, pageSize, current, totalCount,
    };
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      selections: [{
        key: 'all-data',
        text: '选择全部项',
        onSelect: () => {
          const selectedRowKeys = invnolist.map(item => item.invoice_no);
          this.setState({ selectedRowKeys });
        },
      }, {
        key: 'opposite-data',
        text: '反选全部项',
        onSelect: () => {
          const selRows = invnolist.filter(item =>
            !this.state.selectedRowKeys.find(key => key === item.invoice_no));
          const selectedRowKeys = selRows.map(row => row.invoice_no);
          this.setState({ selectedRowKeys });
        },
      }],
    };
    const toolbarActions = [];
    toolbarActions.push(<SearchBox placeholder={this.msg('invoiceNo')} onSearch={this.handleInvSearch} value={listFilter.search} key="invSearch" />);
    toolbarActions.push(<SearchBox placeholder={this.msg('blNo')} onSearch={this.handleBlSearch} value={listFilter.blsearch} key="blSearch" />);
    toolbarActions.push(<InputNumber placeholder={this.msg('coefficient')} value={this.state.coefficient} onChange={this.handleCoefficientChange} style={{ width: 120 }} key="coefficient" />);
    return (
      <Modal
        title={this.msg('selInvoices')}
        width={960}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        destroyOnClose
        style={{ top: 24 }}
      >
        <DataTable
          columns={this.columns}
          dataSource={this.dataSource}
          rowSelection={rowSelection}
          rowKey="invoice_no"
          noSetting
          toolbarActions={toolbarActions}
          scrollOffset={374}
        />
      </Modal>
    );
  }
}
