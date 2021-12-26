import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { toggleSettlementModal, loadSettlements, deleteSettlement } from 'common/reducers/bssSettlement';
import { togglePaymentRequestModal } from 'common/reducers/bssPayment';
import { BSS_INVOICE_STATUS, BSS_INV_TYPE, BSS_BIZ_TYPE, BSS_PRESET_PAYEE } from 'common/constants';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import PaymentRequestModal from '../payment/modal/paymentRequestModal';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    settlementList: state.bssSettlement.settlementList,
    listFilter: state.bssSettlement.listFilter,
    loading: state.bssSettlement.loading,
    userMembers: state.account.userMembers,
    reload: state.bssSettlement.reload,
    privileges: state.account.privileges,
  }),
  {
    togglePaymentRequestModal, toggleSettlementModal, loadSettlements, deleteSettlement,
  }
)
export default class PayableSettlementTable extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    this.handleSettlementsLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && !this.props.reload) {
      this.handleSettlementsLoad(1, nextProps.listFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadSettlements(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filter) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        filter: {
          ...this.props.listFilter,
          ...filter,
        },
      };
      return params;
    },
    remotes: this.props.settlementList,
  })
  handleSettlementsLoad = (currentPage, filter) => {
    const { listFilter, settlementList: { pageSize, current } } = this.props;
    this.props.loadSettlements({
      filter: filter || listFilter,
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
  }

  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleSettlementsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleSettlementsLoad(1, filter);
  }
  handleEditSettlement = (row) => {
    this.props.toggleSettlementModal(true, row);
  }
  handleRequestPayment = () => {
    this.props.togglePaymentRequestModal(true, 'edit');
  }
  handleDelete = (row) => {
    this.props.deleteSettlement(row.id);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  editPermission = hasPermission(this.props.privileges, {
    module: 'bss', feature: 'payment', action: 'edit',
  })
  render() {
    const { settlementList, loading, listFilter } = this.props;
    const columns = [{
      title: this.msg('invoiceStatus'),
      width: 100,
      dataIndex: 'invoice_status',
      align: 'center',
      filters: BSS_INVOICE_STATUS,
      filteredValue: listFilter.invoice_status.map(status => String(status)),
      render: (o) => {
        const status = BSS_INVOICE_STATUS.find(invs => invs.value === o);
        return status ? status.text : null;
      },
    }, {
      title: this.msg('paymentStatus'),
      dataIndex: 'payment_status',
      width: 100,
      align: 'center',
      filteredValue: listFilter.payment_status.map(status => String(status)),
      filters: [{
        text: '未支付',
        value: 0,
      }, {
        text: '支付中',
        value: 1,
      }, {
        text: '已支付',
        value: 2,
      }],
      render: (o) => {
        if (o === 0) {
          return '未支付';
        } else if (o === 1) {
          return '支付中';
        }
        return '已支付';
      },
    }, {
      title: this.msg('settlementNo'),
      dataIndex: 'settlement_no',
      width: 150,
      render: (o, record) =>
        (<a onClick={this.editPermission && record.payment_status === 0 ?
          () => this.handleEditSettlement(record) : null}
        >{o}</a>),
    }, {
      title: this.msg('paymentNo'),
      dataIndex: 'payment_no',
      width: 150,
    }, {
      title: this.msg('businessPartner'),
      width: 150,
      dataIndex: 'seller_name',
      render: (o) => {
        const presetPayee = BSS_PRESET_PAYEE.find(payee => payee.key === o);
        return presetPayee ? presetPayee.text : o;
      },
    }, {
      title: this.msg('invoiceType'),
      dataIndex: 'invoice_type',
      width: 120,
      render: (o) => {
        const invType = BSS_INV_TYPE.find(type => type.value === o);
        return invType ? invType.text : null;
      },
    }, {
      title: this.msg('invoiceNo'),
      dataIndex: 'invoice_no',
      width: 120,
    }, {
      title: this.msg('invoiceAmount'),
      dataIndex: 'invoice_amount',
      align: 'right',
      width: 120,
    }, {
      title: this.msg('bizType'),
      dataIndex: 'biz_type',
      width: 100,
      render: (o) => {
        const bizType = BSS_BIZ_TYPE.find(type => type.value === o);
        return bizType ? bizType.text : null;
      },
    }, {
      title: this.msg('invoicedBy'),
      dataIndex: 'created_by',
      width: 120,
      render: (o) => {
        const member = this.props.userMembers.find(user => user.login_id === o);
        return member ? member.name : null;
      },
    }, {
      title: this.msg('invoiceDate'),
      dataIndex: 'invoice_date',
      width: 120,
      render: invoiceDate => invoiceDate && moment(invoiceDate).format('YYYY.MM.DD'),
    }, {
      title: this.msg('voucher'),
      dataIndex: 'voucher_no',
      width: 150,
    }, {
      title: this.msg('clearDate'),
      dataIndex: 'post_date',
      width: 120,
      render: recdate => recdate && moment(recdate).format('MM.DD HH:mm'),
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      fixed: 'right',
      width: 60,
      render: (o, record) =>
        record.invoice_status < BSS_INVOICE_STATUS[2].value &&
        record.payment_status === 0 &&
        <RowAction onDelete={this.handleDelete} row={record} />,
    }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = settlementList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = (<span>
      <Button icon="check-circle-o" onClick={this.handleRequestPayment}>付款申请</Button>
    </span>);
    return [
      <DataTable
        toolbarActions={toolbarActions}
        bulkActions={bulkActions}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        columns={columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="id"
        loading={loading}
        key="datatable"
      />,
      <PaymentRequestModal key="modal" />,
    ];
  }
}
