import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Button } from 'antd';
import { removeOrderInvoice, loadOrderInvoices, toggleInvoiceModal } from 'common/reducers/sofOrders';
import { loadInvoiceCategories } from 'common/reducers/sofInvoice';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import Summary from 'client/components/Summary';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import InvoiceModal from '../modal/invoiceModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    currencies: state.saasParams.latest.currency,
    formData: state.sofOrders.formData,
    invoices: state.sofOrders.invoices,
    reload: state.sofOrders.orderInvoicesReload,
  }),
  {
    removeOrderInvoice,
    loadOrderInvoices,
    loadInvoiceCategories,
    toggleInvoiceModal,
  }
)
export default class InvoicePane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  state = {
    invNoSearch: '',
  }
  componentDidMount() {
    this.props.loadOrderInvoices(this.props.formData.shipmt_order_no);
    // this.props.loadInvoiceCategories();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.props.loadOrderInvoices(this.props.formData.shipmt_order_no);
    }
  }
  msg = formatMsg(this.props.intl)
  handleToggleInvoiceModal = () => {
    this.props.toggleInvoiceModal(
      true,
      { owner_partner_id: this.props.formData.customer_partner_id }
    );
  }
  handleRemove = (row) => {
    this.props.removeOrderInvoice(
      row.invoice_no,
      this.props.formData.shipmt_order_no,
      this.props.cust_order_no
    );
  }
  handleSearch = (search) => {
    this.setState({ invNoSearch: search });
  }
  invoiceColumns = [{
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    width: 200,
  }, {
    title: this.msg('blNo'),
    dataIndex: 'bl_awb_no',
    width: 180,
  }, {
    title: this.msg('invoiceDate'),
    dataIndex: 'invoice_date',
    render: o => o && moment(o).format('YYYY/MM/DD'),
    width: 150,
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
    title: this.msg('totalAmount'),
    dataIndex: 'total_amount',
    width: 150,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    width: 150,
    render: (o) => {
      const currency = this.props.currencies.find(curr => Number(curr.curr_code) === Number(o));
      if (currency) {
        return currency.curr_name;
      }
      return o;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 45,
    fixed: 'right',
    render: (o, record) => !this.props.disabled &&
      (<PrivilegeCover module="scof" feature="shipments" action="delete">
        <RowAction confirm={this.msg('deleteConfirm')} onConfirm={this.handleRemove} icon="minus-circle-o" tooltip={this.msg('delete')} row={record} />
      </PrivilegeCover>),
  }];
  render() {
    const { disabled } = this.props;
    const statWt = this.props.invoices.reduce((acc, det) => ({
      total_qty: acc.total_qty + det.total_qty,
      total_amount: acc.total_amount + det.total_amount,
      total_net_wt: acc.total_net_wt + det.total_net_wt,
    }), { total_qty: 0, total_amount: 0, total_net_wt: 0 });
    const { invNoSearch } = this.state;
    let invList = this.props.invoices;
    if (invNoSearch) {
      invList = invList.filter((inv) => {
        const regex = new RegExp(this.state.invNoSearch);
        return regex.test(inv.invoice_no);
      });
    }
    return (
      <DataPane
        columns={this.invoiceColumns}
        dataSource={invList}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <SearchBox placeholder="发票号" onSearch={this.handleSearch} value={invNoSearch} />
          <DataPane.Extra>
            <PrivilegeCover module="scof" feature="shipments" action="create">
              <Button disabled={disabled} type="primary" ghost icon="plus-circle-o" onClick={this.handleToggleInvoiceModal}>{this.msg('add')}</Button>
            </PrivilegeCover>
          </DataPane.Extra>
        </DataPane.Toolbar>
        <InvoiceModal />
        <Summary>
          <Summary.Item label={this.msg('statsSumQty')} >{statWt.total_qty}</Summary.Item>
          <Summary.Item label={this.msg('statsSumAmount')} >{statWt.total_amount.toFixed(3)}</Summary.Item>
          <Summary.Item label={this.msg('statsSumNetWt')} >{statWt.total_net_wt.toFixed(5)}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
