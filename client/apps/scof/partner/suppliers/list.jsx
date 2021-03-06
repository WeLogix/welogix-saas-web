import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Icon, Menu, Layout, message } from 'antd';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import CountryFlag from 'client/components/CountryFlag';
import ToolbarAction from 'client/components/ToolbarAction';
import { loadPartnerList, showPartnerModal, changePartnerStatus, deletePartner, batchDelUploadPartner } from 'common/reducers/partner';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { PARTNER_ROLES, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { createFilename } from 'client/util/dataTransform';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import PartnerModal from '../modal/partnerModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    supplierlist: state.partner.partnerlist,
    listFilter: state.partner.partnerFilter,
    loading: state.partner.loading,
    loaded: state.partner.loaded,
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    privileges: state.account.privileges,
  }),
  {
    loadPartnerList,
    changePartnerStatus,
    deletePartner,
    showPartnerModal,
    toggleBizDock,
    togglePanelVisible,
    setUploadRecordsReload,
    batchDelUploadPartner,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofSuppliers',
})
export default class SupplierList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loaded: PropTypes.bool.isRequired,
    supplierlist: PropTypes.shape({ totalCount: PropTypes.number }).isRequired,
    loadPartnerList: PropTypes.func.isRequired,
    deletePartner: PropTypes.func.isRequired,
    showPartnerModal: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  }
  state = {
    importPanelVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    selectedMenuKey: 'all',
  }
  componentDidMount() {
    this.handleTableLoad(null, 1);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.loaded) {
      this.handleTableLoad();
    }
  }
  msg = formatMsg(this.props.intl)
  createPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'partner', action: 'create',
  });
  editPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'partner', action: 'edit',
  });
  dataSource = new DataTable.DataSource({
    fetcher: params => this.handleTableLoad(params.pageSize, params.current),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `??? ${total} ???`,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      return params;
    },
    remotes: this.props.supplierlist,
  })
  columns = [{
    title: this.msg('supplierCode'),
    dataIndex: 'partner_code',
    width: 100,
  }, {
    title: this.msg('supplierName'),
    dataIndex: 'name',
    width: 300,
    render: (o, record) => <a onClick={() => this.handleShowCusPanel(record)}>{o}</a>,
  }, {
    title: this.msg('englishName'),
    dataIndex: 'en_name',
    width: 150,
  }, {
    title: this.msg('country'),
    dataIndex: 'country',
    width: 100,
    render: (country) => {
      const existCntry = this.props.countries.find(cntry => cntry.value === country);
      if (existCntry) {
        return <span><CountryFlag code={existCntry.value} /> {existCntry.text}</span>;
      }
      return country;
    },
  }, {
    title: this.msg('uniqueCode'),
    dataIndex: 'partner_unique_code',
    width: 200,
    render: (o) => {
      if (o) {
        return <span><span className="text-emphasis">{o.slice(0, 18)}</span>{o.slice(18)}</span>;
      }
      return null;
    },
  }, {
    title: this.msg('customsCode'),
    dataIndex: 'customs_code',
    width: 120,
  }, {
    title: this.msg('customsCredit'),
    dataIndex: 'customs_credit',
    width: 100,
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
    width: 100,
  }, {
    title: this.msg('contact'),
    dataIndex: 'contact',
    width: 100,
  }, {
    title: this.msg('phone'),
    dataIndex: 'phone',
    width: 100,
  }, {
    title: this.msg('email'),
    dataIndex: 'email',
    width: 150,
  }, {
    title: this.msg('internalId'),
    dataIndex: 'id',
    width: 100,
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    render: cdt => cdt && moment(cdt).format('YYYY/MM/DD'),
    width: 100,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    width: 90,
    className: 'table-col-ops',
    fixed: 'right',
    render: (_, row) => {
      if (!row.status) {
        return (<span>
          <PrivilegeCover module="scof" feature="partner" action="edit">
            <RowAction onClick={this.handleVendorToggle} icon="play-circle" tooltip={this.msg('opEnable')} row={row} />
          </PrivilegeCover>
          <PrivilegeCover module="scof" feature="partner" action="delete">
            <RowAction danger confirm={this.msg('confirmOp')} onConfirm={this.handleVendorDel} icon="delete" tooltip={this.msg('delete')} row={row} />
          </PrivilegeCover>
        </span>);
      }
      return (<PrivilegeCover module="scof" feature="partner" action="edit">
        <RowAction onClick={this.handleVendorEdit} icon="edit" tooltip={this.msg('edit')} row={row} />
        <RowAction onClick={this.handleVendorToggle} icon="pause-circle-o" tooltip={this.msg('opDisable')} row={row} />
      </PrivilegeCover>);
    },
  }];

  handleTableLoad = (pageSize, current, filters) => {
    const { supplierlist, listFilter } = this.props;
    const pageSizeArg = pageSize || supplierlist.pageSize;
    const currentArg = current || supplierlist.current;
    const filtersArg = filters || listFilter;
    filtersArg.includeOwn = false;
    const filtersJson = JSON.stringify(filtersArg);
    this.props.loadPartnerList(PARTNER_ROLES.SUP, pageSizeArg, currentArg, filtersJson);
  }
  handleVendorAdd = () => {
    if (!this.createPermission) {
      message.warn('??????????????????', 3);
      return;
    }
    this.props.showPartnerModal('add', { role: PARTNER_ROLES.SUP });
  }
  handleShowCusPanel = (customer) => {
    this.props.toggleBizDock('ssoPartner', {
      customer,
    });
  }
  handleVendorEdit = (vendor) => {
    this.props.showPartnerModal('edit', vendor);
  }
  handleVendorToggle = (vendor) => {
    const newstatus = vendor.status === 1 ? 0 : 1;
    this.props.changePartnerStatus(vendor.id, newstatus);
  }
  handleVendorDel = (vendor) => {
    this.props.deletePartner(vendor.id);
  }
  handleSearch = (value) => {
    const filters = { ...this.props.listFilter, name: value };
    this.handleTableLoad(null, null, filters);
  }
  handleExport = () => {
    window.open(`${API_ROOTS.default}v1/scof/partners/export/${createFilename('suppliers')}.xlsx?role=SUP`);
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'impt') {
      this.setState({
        importPanelVisible: true,
      });
    } else if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  handleUploadPartnerDel = (uploadNo, uploadReloadAfterDel) => {
    this.props.batchDelUploadPartner(uploadNo).then((result) => {
      if (!result.error) {
        uploadReloadAfterDel();
        this.handleTableLoad();
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  suppliersUploaded = () => {
    this.handleTableLoad();
    this.props.setUploadRecordsReload(true);
  }
  render() {
    const { supplierlist, listFilter, loading } = this.props;
    this.dataSource.remotes = supplierlist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      selectedRows: this.state.selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };
    const toolbarActions = (<span style={{ width: 500 }}>
      <SearchBox
        placeholder={this.msg('partnerSearchPlaceholder')}
        onSearch={this.handleSearch}
        value={listFilter.name}
      />
    </span>);
    const dropdown = (
      <Menu onClick={this.handleMenuClick}>
        {this.editPermission && <Menu.Item key="impt"><Icon type="upload" /> {this.msg('batchImport')}</Menu.Item>}
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    const dropdownMenu = {
      selectedMenuKey: this.state.selectedMenuKey,
      onMenuClick: this.handleFilterChange,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showCollab={false}>
          <PageHeader.Actions>
            <ToolbarAction primary icon="plus" label={this.msg('create')} dropdown={dropdown} onClick={this.handleVendorAdd} />
            <ToolbarAction icon="export" label={this.msg('export')} onClick={this.handleExport} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            rowKey="id"
            loading={loading}
          />
        </PageContent>
        <ImportDataPanel
          title={this.msg('batchImportSuppliers')}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cooperation/partner/import`}
          formData={{ role: PARTNER_ROLES.SUP }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.suppliersUploaded}
          template={`${XLSX_CDN}/??????????????????.xlsx`}
        />
        <UploadLogsPanel
          onUploadBatchDelete={this.handleUploadPartnerDel}
          type={UPLOAD_BATCH_OBJECT.SCOF_SUPPLIER}
          formData={{}}
        />
        <PartnerModal onOk={this.handleTableLoad} />
      </Layout>
    );
  }
}
