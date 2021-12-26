import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Checkbox, DatePicker, Dropdown, Icon, Menu, Layout, Select, message, Form } from 'antd';
import { UPLOAD_BATCH_OBJECT, PARTNER_ROLES, PARTNER_BUSINESSE_TYPES } from 'common/constants';
import {
  loadExpenses, confirmExpenses, toggleFeeSelectModal,
  unbillingByBatchupload, rejectExpenses,
} from 'common/reducers/tmsExpense';
import { loadPartners } from 'common/reducers/partner';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { loadShipmtDetail } from 'common/reducers/shipment';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import { createFilename } from 'client/util/dataTransform';
import PageHeader from 'client/components/PageHeader';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import SidePanel from 'client/components/SidePanel';
import BillingFeeSelectModal from './modals/billingFeeSelectModal';
import BatchFeeWriteInModal from './modals/batchFeeWriteInModal';
import { formatMsg } from './message.i18n';
import AddressColumn from '../common/addressColumn';

const FormItem = Form.Item;
const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

function fetchData({ state, dispatch }) {
  const promises = [];
  promises.push(dispatch(loadExpenses({
    filter: JSON.stringify(state.tmsExpense.payableListFilter),
    pageSize: state.tmsExpense.expensesList.pageSize,
    current: state.tmsExpense.expensesList.current,
  })));
  promises.push(dispatch(loadPartners({
    role: PARTNER_ROLES.VEN,
    businessType: PARTNER_BUSINESSE_TYPES.transport,
  })));
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    expensesList: state.tmsExpense.expensesList,
    payableListFilter: state.tmsExpense.payableListFilter,
    partners: state.partner.partners,
    expensesLoading: state.tmsExpense.expensesLoading,
  }),
  {
    loadShipmtDetail,
    togglePanelVisible,
    setUploadRecordsReload,
    loadExpenses,
    confirmExpenses,
    rejectExpenses,
    unbillingByBatchupload,
    toggleFeeSelectModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsPayable',
})
@Form.create()
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
  columns = [
    {
      title: this.msg('shipmtNo'),
      dataIndex: 'shipmt_no',
      width: 160,
      render: o => (
        <a onClick={() => this.handleShipmtPreview(o)}>
          {o}
        </a>),
    }, {
      title: this.msg('custOrderNo'),
      dataIndex: 'cust_order_no',
      width: 160,
    }, {
      title: this.msg('sellerName'),
      dataIndex: 'seller_name',
      width: 160,
    }, {
      title: this.msg('departurePlace'),
      width: 250,
      render: (o, record) => <AddressColumn shipment={record} consignType="consigner" />,
    }, {
      title: this.msg('arrivalPlace'),
      width: 250,
      render: (o, record) => <AddressColumn shipment={record} consignType="consignee" />,
    }, {
      title: this.msg('loadWt'),
      dataIndex: 'load_wt',
      align: 'right',
      width: 100,
    }, {
      title: this.msg('loadVol'),
      dataIndex: 'load_vol',
      align: 'right',
      width: 100,
    }, {
      title: this.msg('accountPayable'),
      dataIndex: 'payable_account_sum',
      align: 'right',
      width: 100,
      render: o => (o ? o.toFixed(2) : ''),
    }, {
      title: this.msg('otherPayable'),
      dataIndex: 'payable_other_sum',
      align: 'right',
      width: 100,
      render: o => (o ? o.toFixed(2) : ''),
    }, {
      title: this.msg('sumSvcCharge'),
      dataIndex: 'sum_svc_charge',
      align: 'right',
      width: 100,
      render: o => (o ? o.toFixed(2) : ''),
    }, {
      title: this.msg('sumAdvCharge'),
      dataIndex: 'sum_adv_charge',
      align: 'right',
      width: 100,
      render: o => (o ? o.toFixed(2) : ''),
    }, {
      title: this.msg('sumSpcCharge'),
      dataIndex: 'sum_spc_charge',
      align: 'right',
      width: 100,
      render: o => (o ? o.toFixed(2) : ''),
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      fixed: 'right',
      width: 120,
      className: 'table-col-ops',
      render: (o, record) => {
        if (record.exp_status < 3) {
          return <RowAction icon="form" onClick={this.handleDetail} label="应收明细" row={record} />;
        }
        return <RowAction icon="eye-o" onClick={this.handleDetail} label="应收明细" row={record} />;
      },
    },
  ];
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
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      params.filter = JSON.stringify(this.props.payableListFilter);
      return params;
    },
    remotes: this.props.expensesList,
  })

  handleFilterMenuClick = (ev) => {
    const filter = { ...this.props.payableListFilter, status: ev.key };
    this.handleExpensesLoad(1, filter);
  }
  handleShipmtPreview = (shipmtNo) => {
    this.props.loadShipmtDetail(shipmtNo, this.props.tenantId, 'sr', 'masterInfo').then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleExpensesLoad = (currentPage, filter) => {
    const { payableListFilter, expensesList: { pageSize, current } } = this.props;
    this.props.loadExpenses({
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
    const filter = {
      ...this.props.payableListFilter, startDate: dataString[0], endDate: dataString[1],
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
    const link = `/transport/billing/expense/${row.shipmt_no}/fees?from=payable`;
    this.context.router.push(link);
  }
  handleGenTemplate = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const params = { ...this.props.form.getFieldsValue(), mode: 'payable' };
        window.open(`${API_ROOTS.default}v1/tms/billing/expenses/export/${createFilename('delegation_expenses')}.xlsx?params=${
          JSON.stringify(params)}`);
      }
    });
  }
  handleSelectedExport = () => {
    const expenseNos = this.state.selectedRowKeys;
    const params = { expenseNos, mode: 'payable' };
    window.open(`${API_ROOTS.default}v1/tms/billing/expenses/export/${createFilename('delegation_expenses')}.xlsx?params=${
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
    const filter = { ...this.props.payableListFilter, searchText: value };
    this.handleExpensesLoad(1, filter);
  }
  handleClientSelectChange = (value) => {
    const filter = { ...this.props.payableListFilter, partnerId: value };
    this.handleExpensesLoad(1, filter);
  }
  toggleFeeSelectModal = () => {
    this.props.toggleFeeSelectModal(true);
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
      expensesList, partners, form: { getFieldDecorator }, expensesLoading,
    } = this.props;
    const { status, searchText } = this.props.payableListFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const menu = (
      <Menu onClick={this.showImportLogs}>
        <Menu.Item key="logs">{this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const toolbarActions = (<span>
      <SearchBox value={searchText} placeholder={this.msg('tmsSearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        onChange={this.handleClientSelectChange}
        value={this.props.payableListFilter.partnerId}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部</Option>
        {partners.map(data => (<Option key={String(data.id)} value={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}</Option>))}
      </Select>
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateChange}
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
    return (
      <Layout>
        <SidePanel width={160}>
          <Menu mode="inline" selectedKeys={[status]} onClick={this.handleFilterMenuClick}>
            <Menu.Item key="all">
              {this.msg('allPayable')}
            </Menu.Item>
            <Menu.ItemGroup key="status" title={this.msg('status')}>
              <Menu.Item key="submitted">
                <Icon type="upload" /> {this.msg('statusSubmitted')}
              </Menu.Item>
              <Menu.Item key="confirmed">
                <Icon type="check-square-o" /> {this.msg('statusConfirmed')}
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </SidePanel>
        <Layout>
          <PageHeader>
            <PageHeader.Actions>
              <ToolbarAction
                icon="check"
                confirm={this.msg('confirmOp')}
                onConfirm={this.handleAllConfirm}
                label={this.msg('confirmAll')}
                disabled={status !== 'submitted'}
              />
              <ToolbarAction
                icon="edit"
                onClick={this.toggleFeeSelectModal}
                label={this.msg('writeInFees')}
              />
              <Dropdown.Button icon="upload" onClick={this.handleImportExpense} overlay={menu}>
                {this.msg('importFees')}
              </Dropdown.Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={toolbarActions}
              rowSelection={rowSelection}
              selectedRowKeys={this.state.selectedRowKeys}
              onDeselectRows={this.handleDeselectRows}
              bulkActions={bulkActions}
              columns={this.columns}
              dataSource={this.dataSource}
              rowKey="expense_no"
              loading={expensesLoading}
              bordered
            />
          </Content>
          <ImportDataPanel
            title={this.msg('importFees')}
            visible={this.state.importPanelVisible}
            endpoint={`${API_ROOTS.default}v1/tms/billing/expense/import`}
            formData={{ mode: 'payable' }}
            onClose={() => { this.setState({ importPanelVisible: false }); }}
            onUploaded={this.expensesUploaded}
            onGenTemplate={this.handleGenTemplate}
          >
            <FormItem label={this.msg('sellerName')}>
              {getFieldDecorator('partnerId', {
                  rules: [{ required: true, message: '承运商必选' }],
                })(<Select
                  placeholder="请选择承运商"
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
            type={UPLOAD_BATCH_OBJECT.TMS_EXPENSE}
          />
        </Layout>
        <BillingFeeSelectModal type="payable" />
        <BatchFeeWriteInModal type="payable" reload={this.handleExpensesLoad} />
      </Layout>
    );
  }
}
