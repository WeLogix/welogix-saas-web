import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Checkbox, DatePicker, Dropdown, Menu, Layout, Select, message, Form, Radio } from 'antd';
import { UPLOAD_BATCH_OBJECT, PARTNER_ROLES, PARTNER_BUSINESSE_TYPES, CMS_EXPENSE_STATUS } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import {
  loadCurrencies, loadAdvanceParties, showAdvModelModal, loadExpenses, toggleFeesWriteInModal,
  confirmExpenses, rejectExpenses, unbillingByBatchupload, toggleFeeSelectModal,
  toggleQuoteSwitchModal, loadTotalExpenseList, changeListFilter,
} from 'common/reducers/cmsExpense';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { loadQuoteModel } from 'common/reducers/cmsQuote';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import connectFetch from 'client/common/decorators/connect-fetch';
import withPrivilege from 'client/common/decorators/withPrivilege';
import connectNav from 'client/common/decorators/connect-nav';
import { createFilename } from 'client/util/dataTransform';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { MemberSelect, PartnerSelect } from 'client/components/ComboSelect';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import UserAvatar from 'client/components/UserAvatar';
import BillingFeeSelectModal from './modals/billingFeeSelectModal';
import BatchFeeWriteInModal from './modals/batchFeeWriteInModal';
import QuoteSwitchModal from './modals/quoteSwitchModal';
import { formatMsg } from './message.i18n';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

function fetchData({ state, dispatch }) {
  const promises = [];
  promises.push(dispatch(loadExpenses({
    filter: JSON.stringify(state.cmsExpense.payableListFilter),
    sorter: JSON.stringify(state.cmsExpense.sorter),
    pageSize: state.cmsExpense.expensesList.pageSize,
    current: state.cmsExpense.expensesList.current,
  })));
  promises.push(dispatch(loadPartners({
    role: PARTNER_ROLES.VEN,
    businessType: PARTNER_BUSINESSE_TYPES.clearance,
  })));
  promises.push(dispatch(loadTotalExpenseList({
    filter: JSON.stringify(state.cmsExpense.payableListFilter),
  })));
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    expensesList: state.cmsExpense.expensesList,
    payableListFilter: state.cmsExpense.payableListFilter,
    sorter: state.cmsExpense.sorter,
    partners: state.partner.partners,
    expensesLoading: state.cmsExpense.expensesLoading,
    wholeExpenseList: state.cmsExpense.wholeExpenseList,
  }),
  {
    loadCurrencies,
    showPreviewer,
    loadAdvanceParties,
    showAdvModelModal,
    loadQuoteModel,
    togglePanelVisible,
    setUploadRecordsReload,
    loadExpenses,
    confirmExpenses,
    rejectExpenses,
    unbillingByBatchupload,
    toggleFeesWriteInModal,
    toggleFeeSelectModal,
    toggleQuoteSwitchModal,
    changeListFilter,
    loadTotalExpenseList,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmExpense',
})
@Form.create()
@withPrivilege({ module: 'clearance', feature: 'billing' })
export default class PayableExpenseList extends Component {
  static propTypes = {
    tenantId: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
    payableListFilter: PropTypes.shape({ status: PropTypes.string }).isRequired,
    partners: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    importPanelVisible: false,
  }
  msg = formatMsg(this.props.intl)
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadExpenses(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filter, sorter) => {
      const filters = {
        ...this.props.payableListFilter,
      };
      const sorters = {};
      if (Object.keys(sorter).length !== 0) {
        sorters.field = sorter.field;
        sorters.order = sorter.order;
      }
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      params.sorter = JSON.stringify(sorters);
      params.filter = JSON.stringify(filters);
      return params;
    },
    remotes: this.props.expensesList,
  })

  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.payableListFilter, status: key };
    this.handleExpensesLoad(1, filter);
  }
  handlePreview = (delgNo) => {
    this.props.showPreviewer(delgNo, 'shipment');
  }
  handleSwitchQuote = (row) => {
    this.props.toggleQuoteSwitchModal(
      true,
      {
        expenseNo: row.expense_no,
      }
    );
  }
  handleExpensesLoad = (currentPage, filter) => {
    const { payableListFilter, expensesList: { pageSize, current }, sorter } = this.props;
    this.props.loadExpenses({
      sorter: JSON.stringify(sorter),
      filter: JSON.stringify(filter || payableListFilter),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
    this.props.loadTotalExpenseList({
      filter: JSON.stringify(filter || payableListFilter),
    });
  }
  handleImportExpense = () => {
    this.setState({
      importPanelVisible: true,
    });
  }
  toggleImportFeesModal = () => {
    this.setState({ importFeesModalVisible: !this.state.importFeesModalVisible });
  }
  handleDateChange = (data, dataString) => {
    let searchField;
    if (data.length === 0) {
      searchField = 'created_date';
    } else {
      searchField = this.props.payableListFilter.dateSearchField;
    }
    const filter = {
      ...this.props.payableListFilter,
      startDate: dataString[0],
      endDate: dataString[1],
      dateSearchField: searchField,
    };
    this.handleExpensesLoad(1, filter);
  }
  handleGenTemplate = () => {
    this.props.loadQuoteModel(this.props.tenantId);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleDetail = (row) => {
    const link = `/clearance/billing/fees/${row.delg_no}?from=payable`;
    this.context.router.push(link);
  }
  handleGenTemplate = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const params = { ...this.props.form.getFieldsValue(), mode: 'payable' };
        window.open(`${API_ROOTS.default}v1/cms/billing/expenses/export/${createFilename('delegation_expenses')}.xlsx?params=${
          JSON.stringify(params)}`);
      }
    });
  }
  handleSelectedExport = () => {
    const expenseNos = this.state.selectedRowKeys;
    const params = { expenseNos, mode: 'payable' };
    window.open(`${API_ROOTS.default}v1/cms/billing/expenses/export/${createFilename('delegation_expenses')}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  handleBatchConfirm = () => {
    const expenseNos = this.state.selectedRowKeys;
    this.props.confirmExpenses({
      expNos: expenseNos,
    }).then((result) => {
      if (!result.error) {
        this.handleExpensesLoad(1);
      }
    });
  }
  handleAllConfirm = () => {
    this.props.confirmExpenses({
      expNos: null,
    }).then((result) => {
      if (!result.error) {
        this.handleExpensesLoad(1);
      }
    });
  }
  handleBatchReject = () => {
    const expenseNos = this.state.selectedRowKeys;
    this.props.rejectExpenses({
      expenseNos,
    }).then((result) => {
      if (!result.error) {
        this.handleExpensesLoad(1);
      }
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.payableListFilter, search: value };
    this.handleExpensesLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filter = { ...this.props.payableListFilter, partnerId: value };
    this.handleExpensesLoad(1, filter);
  }
  handleDateSearchFieldChange = (e) => {
    const { startDate, endDate } = this.props.payableListFilter;
    if (startDate && endDate) {
      const dateSearchField = e.target.value;
      const filter = {
        ...this.props.payableListFilter,
        dateSearchField,
      };
      this.handleExpensesLoad(1, filter);
    } else {
      this.props.changeListFilter('dateSearchField', e.target.value, 'payable');
    }
  }
  toggleFeeSelectModal = () => {
    this.props.toggleFeeSelectModal(true);
  }
  toggleFeesWriteInModal = () => {
    this.props.toggleFeesWriteInModal(true);
  }
  showImportLogs = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  expensesUploaded = () => {
    this.handleExpensesLoad(1);
    this.setState({
      importPanelVisible: false,
    });
  }
  removeExpenseByBatchUpload = (uploadNo, uploadLogReload) => {
    this.props.unbillingByBatchupload(uploadNo).then((result) => {
      if (!result.error) {
        uploadLogReload();
        this.handleExpensesLoad(1);
      }
    });
  }
  render() {
    const {
      expensesList, partners, form: { getFieldDecorator },
      expensesLoading, wholeExpenseList, sorter, payableListFilter,
    } = this.props;
    // 有多列需要排序时antd在判断排序状态时出现问题 需要放在render里面定义columns
    const columns = [
      {
        title: this.msg('delgOrderNo'),
        dataIndex: 'delg_no',
        width: 160,
        render: (o, record) => (
          <a onClick={() => this.handlePreview(o)}>
            {record.cust_order_no || o}
          </a>),
      }, {
        title: this.msg('sellerName'),
        dataIndex: 'seller_name',
        width: 160,
      },
      {
        title: this.msg('flowName'),
        dataIndex: 'flow_name',
        width: 160,
      }, {
        title: this.msg('cusDeclNo'),
        dataIndex: 'customs_entry_nos',
        width: 160,
      }, {
        title: this.msg('payableTotal'),
        dataIndex: 'payable_total',
        align: 'right',
        width: 100,
        render: (o, record) => <span className="text-emphasis">{(record.payable_account_sum + record.payable_other_sum).toFixed(2)}</span>,
      }, {
        title: this.msg('quoteNo'),
        dataIndex: 'quote_no',
        width: 150,
        render: (o, record) => {
          if (record.exp_status <= CMS_EXPENSE_STATUS.pending) {
            return <a onClick={() => this.handleSwitchQuote(record)}>{o}</a>;
          }
          return o;
        },
      }, {
        title: this.msg('declQty'),
        dataIndex: 'decl_qty',
        align: 'center',
        width: 70,
      }, {
        title: this.msg('declSheetQty'),
        dataIndex: 'decl_sheet_qty',
        align: 'center',
        width: 70,
      }, {
        title: this.msg('declItemQty'),
        dataIndex: 'decl_item_qty',
        align: 'center',
        width: 70,
      }, {
        title: this.msg('tradeItemQty'),
        dataIndex: 'trade_item_qty',
        align: 'center',
        width: 70,
      }, {
        title: this.msg('tradeAmount'),
        dataIndex: 'trade_amount',
        align: 'right',
        width: 100,
      }, {
        title: this.msg('expStatus'),
        dataIndex: 'exp_status',
        width: 100,
      }, {
        title: this.msg('orderStartDate'),
        dataIndex: 'created_date',
        key: 'created_date',
        width: 120,
        sorter: true,
        sortOrder: sorter.field === 'created_date' && sorter.order,
        render: o => o && moment(o).format('MM.DD HH:mm'),
      }, {
        title: this.msg('cleanTime'),
        dataIndex: 'clean_time',
        key: 'clean_time',
        width: 140,
        sorter: true,
        sortOrder: sorter.field === 'clean_time' && sorter.order,
        render: o => o && moment(o).format('MM.DD HH:mm'),
      }, {
        title: this.msg('lastActT'),
        dataIndex: 'last_updated_date',
        key: 'last_updated_date',
        width: 120,
        sorter: true,
        sortOrder: sorter.field === 'last_updated_date' && sorter.order,
        render: o => o && moment(o).format('MM.DD HH:mm'),
      }, {
        title: this.msg('billingStaff'),
        dataIndex: 'created_by',
        width: 120,
        render: lid => <UserAvatar size="small" loginId={lid} showName />,
      }, {
        title: this.msg('confirmStaff'),
        dataIndex: 'confirmed_by',
        width: 120,
        render: lid => <UserAvatar size="small" loginId={lid} showName />,
      }, {
        dataIndex: 'SPACER_COL',
      }, {
        title: this.msg('opCol'),
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        fixed: 'right',
        width: 120,
        render: (o, record) => {
          if (record.exp_status < 3) {
            return <RowAction icon="form" onClick={this.handleDetail} label="应付明细" row={record} />;
          }
          return <RowAction icon="eye-o" onClick={this.handleDetail} label="应付明细" row={record} />;
        },
      },
    ];
    const {
      status, search, startDate, endDate, dateSearchField,
    } = this.props.payableListFilter;
    let dateValue = [];
    if (startDate && endDate) {
      dateValue = [moment(startDate), moment(endDate)];
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      selections: [{
        key: 'all-data',
        text: '选择全部项',
        onSelect: () => {
          const selectedRowKeys = wholeExpenseList.map(item => item.expense_no);
          this.setState({
            selectedRowKeys,
          });
        },
      }, {
        key: 'opposite-data',
        text: '反选全部项',
        onSelect: () => {
          const expenseNos = wholeExpenseList.map(item => item.expense_no);
          const selectedRowKeys = expenseNos.filter(item =>
            !this.state.selectedRowKeys.find(item1 => item1 === item));
          this.setState({
            selectedRowKeys,
          });
        },
      }],
    };
    const menu = (
      <Menu onClick={this.showImportLogs}>
        <Menu.Item key="logs">{this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const writeInMenu = (
      <Menu onClick={this.toggleFeesWriteInModal}>
        <Menu.Item key="exchange">换单相关费用</Menu.Item>
        <Menu.Item key="inspect">查验相关费用</Menu.Item>
        <Menu.Item key="licence" disabled>办证相关费用</Menu.Item>
      </Menu>
    );
    const dateSearchFieldRadio = (
      <Radio.Group
        onChange={this.handleDateSearchFieldChange}
        value={dateSearchField}
      >
        <Radio value="created_date">订单开始时间</Radio>
        <Radio value="clean_time">报关单放行时间</Radio>
      </Radio.Group>
    );
    const toolbarActions = (<span>
      <SearchBox value={search} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
      <PartnerSelect
        selectedPartner={payableListFilter.partnerId}
        onPartnerChange={this.handleClientSelectChange}
        showVen
        paramPartners={partners}
      />
      <MemberSelect
        memberDisabled={payableListFilter.scenario === 'myOwn'}
        selectMembers={payableListFilter.own_by}
        selectDepts={payableListFilter.own_dept_id}
        onDeptChange={this.handleDeptChange}
        onMemberChange={this.handleMemberChange}
      />
      <RangePicker
        value={dateValue}
        onChange={this.handleDateChange}
        renderExtraFooter={() => dateSearchFieldRadio}
      />
    </span>);
    const bulkActions = (<span>
      {(status === 'submitted') &&
      <ToolbarAction icon="check" confirm={this.msg('confirmOp')} onConfirm={this.handleBatchConfirm} label={this.msg('confirm')} />}
      {(status === 'submitted') &&
      <ToolbarAction icon="close" confirm={this.msg('confirmOp')} onConfirm={this.handleBatchReject} label={this.msg('reject')} />}
      <ToolbarAction icon="download" onClick={this.handleSelectedExport} label={this.msg('export')} />
    </span>);
    this.dataSource.remotes = expensesList;
    const dropdownMenuItems = [
      { elementKey: 'all', name: this.msg('all') },
      { elementKey: 'submitted', icon: 'upload', name: this.msg('statusSubmitted') },
      { elementKey: 'confirmed', icon: 'check-square-o', name: this.msg('statusConfirmed') },
    ];
    const dropdownMenu = {
      selectedMenuKey: status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
          extra={<Menu
            mode="horizontal"
            // selectedKeys={[view]}
            onClick={this.handleViewMenuClick}
          >
            <Menu.Item key="delegations">按委托计费</Menu.Item>
            <Menu.Item key="declarations">按报关单计费</Menu.Item>
            <Menu.Item key="feeItems">费用项明细</Menu.Item>
          </Menu>}
        >
          <PageHeader.Actions>
            <ToolbarAction
              icon="check"
              confirm={this.msg('confirmOp')}
              onConfirm={this.handleAllConfirm}
              label={this.msg('confirmAll')}
              disabled={status !== 'submitted'}
            />
            <Dropdown.Button icon="edit" overlay={writeInMenu} onClick={this.toggleFeeSelectModal}>
              {this.msg('writeInFees')}
            </Dropdown.Button>
            <Dropdown.Button icon="upload" onClick={this.handleImportExpense} overlay={menu}>
              {this.msg('importFees')}
            </Dropdown.Button>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            bulkActions={bulkActions}
            columns={columns}
            dataSource={this.dataSource}
            rowKey="expense_no"
            loading={expensesLoading}
            bordered
          />
        </PageContent>
        <ImportDataPanel
          title={this.msg('importFees')}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cms/billing/expense/import`}
          formData={{ mode: 'payable' }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.expensesUploaded}
          onGenTemplate={this.handleGenTemplate}
        >
          <FormItem label={this.msg('sellerName')}>
            {getFieldDecorator('partnerId', {
                  rules: [{ required: true, message: '服务商必选' }],
                })(<Select
                  placeholder="请选择服务商"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                  style={{ width: '100%' }}
                >
                  {partners.map(pt => (
                    <Option value={String(pt.id)} key={String(pt.id)}>
                      {pt.partner_code ? `${pt.partner_code} | ${pt.name}` : pt.name}
                    </Option>))
                  }
                </Select>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('withExpenseFees', {
                })(<Checkbox style={{ width: '100%' }}>模板包含待计费数据</Checkbox>)}
          </FormItem>
        </ImportDataPanel>
        <UploadLogsPanel
          onUploadBatchDelete={this.removeExpenseByBatchUpload}
          type={UPLOAD_BATCH_OBJECT.CMS_EXPENSE}
        />
        <BillingFeeSelectModal type="payable" />
        <BatchFeeWriteInModal type="payable" reload={this.handleExpensesLoad} />
        <QuoteSwitchModal reload={this.handleExpensesLoad} />
      </Layout>
    );
  }
}
