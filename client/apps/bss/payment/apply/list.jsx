import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, DatePicker, Layout, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import ToolbarAction from 'client/components/ToolbarAction';
import PageContent from 'client/components/PageContent';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import connectNav from 'client/common/decorators/connect-nav';
import { PARTNER_ROLES, BSS_PAYMENT_METHOD, BSS_PRESET_PAYEE } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { togglePaymentRequestModal, loadPayments, deletePayment, updatePaymentHead } from 'common/reducers/bssPayment';
import PaymentRequestModal from '../modal/paymentRequestModal';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    applyList: state.bssPayment.applyList,
    listFilter: state.bssPayment.applyListFilter,
    loading: state.bssPayment.applyList.loading,
    userMembers: state.account.userMembers,
    reload: state.bssPayment.reload,
    loginId: state.account.loginId,
  }),
  {
    loadPartners,
    togglePaymentRequestModal,
    loadPayments,
    deletePayment,
    updatePaymentHead,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssApplyPayment',
})
export default class ApplyPaymentList extends React.Component {
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
    this.props.loadPartners({ role: PARTNER_ROLES.VEN });
    this.handlePaymentsLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && !this.props.reload) {
      this.handlePaymentsLoad(1);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('paymentNo'),
    dataIndex: 'payment_no',
    width: 150,
    render: (o, record) => <a onClick={() => this.handleEditPayment(record)}>{o}</a>,
  }, {
    title: this.msg('businessPartner'),
    width: 180,
    dataIndex: 'payee',
    render: (o) => {
      const presetPayee = BSS_PRESET_PAYEE.find(payee => payee.key === o);
      return presetPayee ? presetPayee.text : o;
    },
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
      const method = BSS_PAYMENT_METHOD.find(item => item.value === o);
      return method ? method.text : null;
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
    render: requestDate => requestDate && moment(requestDate).format('YYYY.MM.DD'),
  }, {
    title: this.msg('approvalStatus'),
    width: 100,
    dataIndex: 'approval_status',
    render: (o) => {
      if (o === 0) {
        return '未审批';
      }
      return '已审批';
    },
  }, {
    title: this.msg('approvalBy'),
    width: 120,
    dataIndex: 'approval_by',
    render: (o) => {
      const approvalBy = this.props.userMembers.find(user => user.login_id === o);
      return approvalBy ? approvalBy.name : null;
    },
  }, {
    title: this.msg('paymentStatus'),
    width: 100,
    dataIndex: 'payment_status',
    render: (o) => {
      if (o === 0) {
        return '未支付';
      }
      return '已支付';
    },
  }, {
    title: this.msg('payer'),
    width: 120,
    dataIndex: 'payer',
  }, {
    title: this.msg('paymentDate'),
    dataIndex: 'payment_date',
    width: 120,
    render: payDate => payDate && moment(payDate).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => {
      const actions = [];
      if (record.approval_by === this.props.loginId) {
        if (!record.approval_status) {
          actions.push(<RowAction icon="audit" onClick={this.handleApprovePayment} label={this.msg('approval')} row={record} />);
        }
        if (record.approval_status === 1 && record.payment_status !== 1) {
          actions.push(<RowAction icon="undo" onClick={this.handleCancelApprovedPayment} label={this.msg('cancelApproved')} row={record} />);
        }
      }
      if (record.payment_status === 0) {
        actions.push(<RowAction onDelete={this.handleDelete} row={record} />);
      }
      return actions;
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadPayments(params),
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
      params.filter = {
        ...this.props.listFilter,
      };
      return params;
    },
    remotes: this.props.applyList,
  })

  handlePaymentsLoad = (currentPage, filter) => {
    const { listFilter, applyList: { pageSize, current } } = this.props;
    this.props.loadPayments({
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
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.handlePaymentsLoad(1, filter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handlePaymentsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handlePaymentsLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filters = { ...this.props.listFilter, payee: value };
    this.handlePaymentsLoad(1, filters);
  }

  handleRequestPayment = () => {
    this.props.togglePaymentRequestModal(true, 'new');
  }
  handleEditPayment = (record) => {
    this.props.togglePaymentRequestModal(true, 'edit', record);
  }
  handleApprovePayment = (record) => {
    this.props.togglePaymentRequestModal(true, 'approve', record);
  }
  handleCancelApprovedPayment = (record) => {
    this.props.updatePaymentHead(record.id, { approval_status: false });
  }
  handleDelete = (record) => {
    this.props.deletePayment(record.payment_no, record.payment_type);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { applyList, loading, partners } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = applyList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部</Option>
        {BSS_PRESET_PAYEE.map(item => (
          <Option key={item.key} value={item.key}>{item.text}</Option>
        ))}
        {partners.map(data => (
          <Option key={data.id} value={data.name}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
          </Option>))
        }
      </Select>
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = (<span>
      {(status === 'pending') && <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>审批通过</Button>}
      {(status === 'approved') && <Button icon="close-circle-o" onClick={this.handleBatchReturn}>取消审批</Button>}
    </span>);
    /*
      待审批：支付状态为『未支付』且审批状态为『未审批』
      待支付：支付状态为『未支付』且审批状态为『已审批』
      已支付：支付状态为『已支付』或『已过账』
    */
    const dropdownMenuItems = [
      {
        elementKey: 'gStatus',
        title: '付款状态',
        elements: [
          { elementKey: 'pending', name: this.msg('待审批') },
          { elementKey: 'approved', name: this.msg('待支付') },
          { elementKey: 'paid', name: this.msg('已支付') },
        ],
      },
    ];
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showCollab={false}>
          <PageHeader.Actions>
            <ToolbarAction
              primary
              icon="plus"
              onClick={this.handleRequestPayment}
              label={this.msg('createPayment')}
            />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={loading}
          />
        </PageContent>
        <PaymentRequestModal />
      </Layout>
    );
  }
}
