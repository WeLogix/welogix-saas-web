import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Icon, Menu, Layout, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { PartnerSelect } from 'client/components/ComboSelect';
import ToolbarAction from 'client/components/ToolbarAction';
import { toggleContacterModal, loadContacterList, deleteContacter, loadPartners, batchDelUploadContacter } from 'common/reducers/partner';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { PARTNER_ROLES, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { createFilename } from 'client/util/dataTransform';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import ContacterModal from '../modal/contacterModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    contacterList: state.partner.contacterList,
    listFilter: state.partner.contacterFilter,
    reloadFlag: state.partner.whetherReloadContacters,
    partners: state.partner.partners,
    privileges: state.account.privileges,
  }),
  {
    toggleContacterModal,
    loadContacterList,
    deleteContacter,
    loadPartners,
    setUploadRecordsReload,
    togglePanelVisible,
    batchDelUploadContacter,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofContacts',
})
export default class ContactList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    contacterList: PropTypes.shape({ totalCount: PropTypes.number }).isRequired,
    loadContacterList: PropTypes.func.isRequired,
    deleteContacter: PropTypes.func.isRequired,
    toggleContacterModal: PropTypes.func.isRequired,
  }
  state = {
    importPanelVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    selectedMenuKey: 'all',
  }
  componentDidMount() {
    this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP, PARTNER_ROLES.VEN] });
    this.handleTableLoad();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadFlag && nextProps.reloadFlag !== this.props.reloadFlag) {
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
  columns = [{
    title: this.msg('contacterName'),
    dataIndex: 'contacter_name',
    width: 100,
  }, {
    title: this.msg('company'),
    dataIndex: 'partner_id',
    width: 300,
    render: (o) => {
      const partner = this.props.partners.find(f => f.id === o);
      return partner && partner.name;
    },
  }, {
    title: this.msg('department'),
    dataIndex: 'department',
    width: 50,
  }, {
    title: this.msg('position'),
    dataIndex: 'position',
    width: 50,
  }, {
    title: this.msg('cellphoneNum'),
    dataIndex: 'cellphone_num',
    width: 150,
  }, {
    title: this.msg('phone'),
    dataIndex: 'phone_num',
    width: 150,
  }, {
    title: this.msg('email'),
    dataIndex: 'email',
    width: 150,
  }, {
    title: this.msg('fax'),
    dataIndex: 'fax',
    width: 150,
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
    width: 200,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    width: 90,
    className: 'table-col-ops',
    fixed: 'right',
    render: (o, row) => (<span>
      <PrivilegeCover module="scof" feature="partner" action="edit">
        <RowAction onClick={this.handleEditContacter} icon="edit" tooltip={this.msg('edit')} row={row} />
      </PrivilegeCover>
      <PrivilegeCover module="scof" feature="partner" action="delete">
        <RowAction danger confirm={this.msg('confirmOp')} onConfirm={this.handleDeleteContacter} icon="delete" tooltip={this.msg('delete')} row={row} />
      </PrivilegeCover>
    </span>),
  }];
  handleTableLoad = (page, size, paramFilter) => {
    const { contacterList: { pageSize, current }, listFilter } = this.props;
    const currentPage = page || current;
    const currentSize = size || pageSize;
    const currentFilter = paramFilter || listFilter;
    this.props.loadContacterList(currentPage, currentSize, currentFilter);
  }
  handleAddContacter = () => {
    if (!this.createPermission) {
      message.warn('暂无新建权限', 3);
      return;
    }
    this.props.toggleContacterModal(true);
  }
  handleEditContacter = (row) => {
    this.props.toggleContacterModal(true, row);
  }
  handleDeleteContacter = (row) => {
    this.props.deleteContacter(row.id);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, filterField: value };
    this.handleTableLoad(1, null, filter);
  }
  handleCompanyChange = (value) => {
    const filter = { ...this.props.listFilter, partnerId: value };
    this.handleTableLoad(1, null, filter);
  }
  handleExport = () => {
    window.open(`${API_ROOTS.default}v1/scof/partners/contact/export/${createFilename('contacters')}.xlsx`);
  }
  handleGenTemplate = () => {
    const params = { mode: 'template' };
    window.open(`${API_ROOTS.default}v1/scof/partners/contact/export/${createFilename('contacter_template')}.xlsx?params=${
      JSON.stringify(params)}`);
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
  handleUploadContacterDel = (uploadNo, uploadReloadAfterDel) => {
    this.props.batchDelUploadContacter(uploadNo).then((result) => {
      if (!result.error) {
        uploadReloadAfterDel();
        this.handleTableLoad();
      }
    });
  }
  handleUploaded = () => {
    this.handleTableLoad();
    this.props.setUploadRecordsReload(true);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  }
  handlePageChange = (page, size) => {
    this.handleTableLoad(page, size);
  }
  render() {
    const { contacterList, listFilter, partners } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      selectedRows: this.state.selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };
    const pagination = {
      current: contacterList.current,
      total: contacterList.totalCount,
      pageSize: contacterList.pageSize,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      showTotal: total => `共 ${total} 条`,
    };
    const toolbarActions = (<span>
      <SearchBox
        placeholder="联系人姓名/联系方式"
        onSearch={this.handleSearch}
        value={listFilter.filterField}
      />
      <PartnerSelect
        selectedPartner={listFilter.partnerId}
        onPartnerChange={this.handleCompanyChange}
        showCus
        showSup
        showVen
        paramPartners={partners}
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
            <ToolbarAction primary icon="plus" label={this.msg('create')} dropdown={dropdown} onClick={this.handleAddContacter} />
            <ToolbarAction icon="export" label={this.msg('export')} onClick={this.handleExport} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            dataSource={contacterList.data}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            rowKey="id"
            pagination={pagination}
          />
        </PageContent>
        <ImportDataPanel
          title={this.msg('batchImportContacters')}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cooperation/partner/contact/import`}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleUploaded}
          onGenTemplate={this.handleGenTemplate}
        />
        <ContacterModal />
        <UploadLogsPanel
          onUploadBatchDelete={this.handleUploadContacterDel}
          type={UPLOAD_BATCH_OBJECT.SCOF_CONTACT}
          formData={{}}
        />
      </Layout>
    );
  }
}
