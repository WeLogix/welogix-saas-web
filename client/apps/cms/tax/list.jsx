import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Layout, Tag, Dropdown, Icon, Menu, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import currencyFormatter from 'currency-formatter';
import { CMS_TAX_PAY_STATUS, UPLOAD_BATCH_OBJECT } from 'common/constants';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { loadTaxesList } from 'common/reducers/cmsDeclTax';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import TaxPayTable from './taxPayTable';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    taxList: state.cmsDeclTax.taxList,
    filter: state.cmsDeclTax.listFilter,
    trxnModes: state.saasParams.latest.trxnMode,
    loading: state.cmsDeclTax.loading,
    privileges: state.account.privileges,
  }),
  {
    loadTaxesList, togglePanelVisible, setUploadRecordsReload,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmDeclTax',
})
export default class TaxList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    // selectedRowKeys: [],
    importPanelVisible: false,
  }
  componentDidMount() {
    let filters = this.props.listFilter;
    const locHash = this.props.location.hash;
    if (locHash === '#estimated') {
      filters = { ...filters, status: '4' };
    } else if (locHash === '#unpaid') {
      filters = { ...filters, status: '1' };
    } else if (locHash === '#processing') {
      filters = { ...filters, status: '2' };
    } else if (locHash === '#paid') {
      filters = { ...filters, status: '3' };
    } else {
      filters = { ...filters, status: 'all' };
    }
    this.handleReload(1, filters);
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'declTax', action: 'edit',
  })
  columns = [{
    title: this.msg('entryId'),
    dataIndex: 'entry_id',
    width: 200,
    render: (entryId, row) => entryId || row.pre_entry_seq_no,
  }, {
    title: this.msg('taxStatus'),
    dataIndex: 'pay_status',
    width: 120,
    render: (o) => {
      const status = Object.values(CMS_TAX_PAY_STATUS).filter(st => st.value === o)[0];
      return status && <Tag color={status.tag}>{status.text}</Tag>;
    },
  }, {
    title: this.msg('payerEntity'),
    dataIndex: 'payer_entity',
    width: 150,
  }, {
    title: this.msg('dutiableTradeTotal'),
    dataIndex: 'dutiable_trade_total',
    width: 150,
    align: 'right',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('dutyTax'),
    dataIndex: 'duty_tax',
    width: 150,
    align: 'right',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualDutyTax'),
    dataIndex: 'actual_duty_tax',
    width: 120,
    align: 'right',
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('vatTax'),
    dataIndex: 'vat_tax',
    width: 150,
    align: 'right',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualVatTax'),
    dataIndex: 'actual_vat_tax',
    width: 120,
    align: 'right',
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('gstTax'),
    dataIndex: 'gst_tax',
    width: 150,
    align: 'right',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualGstTax'),
    dataIndex: 'actual_gst_tax',
    width: 120,
    align: 'right',
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('antiDumpingDuty'),
    dataIndex: 'anti_dumping_duty',
    width: 150,
    align: 'right',
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('delayedDeclarationFee'),
    dataIndex: 'delayed_declaration_fee',
    width: 120,
    align: 'right',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('ieDate'),
    dataIndex: 'i_e_date',
    width: 120,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: this.msg('paidDate'),
    dataIndex: 'paid_date',
    width: 120,
  }, {
    dataIndex: 'SPACER_COL',
  }]
  handleDeselectRows = () => {
    // this.setState({ selectedRowKeys: [] });
  }
  handleReload = (currentPage, filter) => {
    this.props.loadTaxesList({
      filter: filter || this.props.filter,
      pageSize: this.props.taxList.pageSize,
      current: currentPage || this.props.taxList.current,
    });
  }
  handleMenuClick = () => {
    this.props.togglePanelVisible(true);
  }
  handleTaxComparisonUpload = () => {
    this.handleReload();
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.handleReload(1, filter);
  }
  handleFilterMenuClick = (value) => {
    const status = value === 'all' ? null : value;
    const filter = { ...this.props.filter, status };
    this.handleReload(1, filter);
  }
  handleImport = () => {
    if (!this.editPermission) {
      message.warn(this.msg('noEitpermission'), 3);
      return;
    }
    this.setState({ importPanelVisible: true });
  }
  render() {
    const { loading, taxList } = this.props;
    /*
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      fixed: false,
    };
    */
    const toolbarActions = (<span>
      <SearchBox
        placeholder={this.msg('searchPlaceholder')}
        onSearch={this.handleSearch}
        value={this.props.filter.searchText}
        key="search"
      />
    </span>);
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadTaxesList(params),
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
          filter: this.props.filter,
        };
        return params;
      },
      remotes: taxList,
    });
    const dropdownMenuItems = [
    ].concat(Object.keys(CMS_TAX_PAY_STATUS).map(key => ({
      icon: CMS_TAX_PAY_STATUS[key].icon,
      name: CMS_TAX_PAY_STATUS[key].text,
      elementKey: String(CMS_TAX_PAY_STATUS[key].value),
    })));
    const dropdownMenu = {
      selectedMenuKey: this.props.filter.status || 'all',
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="logs" ><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <Dropdown.Button
              overlay={menu}
              onClick={this.handleImport}
            >
              <Icon type="upload" />{this.msg('import')}
            </Dropdown.Button>
            <ToolbarAction icon="reload" tooltip={this.msg('refresh')} onClick={() => this.handleReload()} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            columns={this.columns}
            dataSource={dataSource}
            rowKey="pre_entry_seq_no"
            expandedRowRender={(record) => {
              if (record.pay_status && record.pay_status !== 4) {
                return <TaxPayTable entryId={record.entry_id} payment={record.payment} />;
              }
              return <span>{this.msg('noTaxPayment')}</span>;
            }}
            expandRowByClick
            loading={loading}
            bordered
            noSetting
          />
          <ImportDataPanel
            title={this.msg('batchImportTaxes')}
            visible={this.state.importPanelVisible}
            endpoint={`${API_ROOTS.default}v1/cms/customs/decltax/importcomparison`}
            formData={{}}
            onClose={() => { this.setState({ importPanelVisible: false }); }}
            onUploaded={this.handleTaxComparisonUpload}
            template={`${XLSX_CDN}/税费单导入模板.xlsx`}
          />
          <UploadLogsPanel
            type={UPLOAD_BATCH_OBJECT.CMS_TAX}
            formData={{}}
          />
        </PageContent>
      </Layout>
    );
  }
}
