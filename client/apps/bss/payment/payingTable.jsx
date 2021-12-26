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
import { togglePaymentRequestModal, loadPayingList } from 'common/reducers/bssPayment';
import { BSS_PAYMENT_METHOD } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PaymentRequestModal from './modal/paymentRequestModal';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    payingList: state.bssPayment.payingList,
    listFilter: state.bssPayment.payingListFilter,
    loading: state.bssPayment.payingList.loading,
    userMembers: state.account.userMembers,
    reload: state.bssPayment.reload,
  }),
  {
    loadPayingList, togglePaymentRequestModal,
  }
)
export default class PayingTable extends React.Component {
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
    this.handlePayingListLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && !this.props.reload) {
      this.handlePayingListLoad();
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('paymentNo'),
    dataIndex: 'payment_no',
    width: 150,
  }, {
    title: this.msg('businessPartner'),
    width: 180,
    dataIndex: 'payee',
  }, {
    title: this.msg('paymentType'),
    dataIndex: 'payment_type',
    width: 150,
    render: (o) => {
      if (o === 1) {
        return o === 1 ? this.msg('advancePayment') : this.msg('accountPayable');
      }
      return this.msg('accountPayable');
    },
  }, {
    title: this.msg('paymentMethod'),
    dataIndex: 'payment_method',
    width: 150,
    render: (o) => {
      const paymentMethod = BSS_PAYMENT_METHOD.find(method => method.value === o);
      return paymentMethod ? paymentMethod.text : null;
    },
  }, {
    title: this.msg('paymentAmount'),
    width: 150,
    dataIndex: 'payment_amount',
  }, {
    title: this.msg('requestBy'),
    dataIndex: 'request_by',
    width: 150,
    render: (o) => {
      const requestBy = this.props.userMembers.find(user => user.login_id === o);
      return requestBy ? requestBy.name : null;
    },
  }, {
    title: this.msg('requestDate'),
    dataIndex: 'created_date',
    width: 120,
    render: createdDate => createdDate && moment(createdDate).format('YYYY.MM.DD'),
  }, {
    title: this.msg('approvalBy'),
    width: 120,
    dataIndex: 'approval_by',
    render: (o) => {
      const approvalBy = this.props.userMembers.find(user => user.login_id === o);
      return approvalBy ? approvalBy.name : null;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (<span>
      <PrivilegeCover module="bss" feature="payment" action="edit">
        <RowAction icon="pay-circle" onClick={this.handlePay} label={this.msg('pay')} row={record} />
      </PrivilegeCover>
    </span>),

  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadPayingList(params),
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
      const filter = {
        ...this.props.listFilter,
      };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.payingList,
  })

  handlePayingListLoad = (currentPage, filter) => {
    const { listFilter, payingList: { pageSize, current } } = this.props;
    this.props.loadPayingList({
      filter: JSON.stringify(filter || listFilter),
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
    this.handlePayingListLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handlePayingListLoad(1, filter);
  }
  handlePay = (record) => {
    this.props.togglePaymentRequestModal(true, 'confirm', record);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { payingList, loading } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = payingList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = status === 'submitted' && (<span>
      <Button icon="check-circle-o">付款申请</Button>
    </span>);
    return [
      <DataTable
        toolbarActions={toolbarActions}
        bulkActions={bulkActions}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        columns={this.columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="sof_order_no"
        loading={loading}
        key="table"
      />,
      <PaymentRequestModal key="modal" />,
    ];
  }
}
