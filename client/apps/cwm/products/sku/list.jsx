import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Drawer, Layout, message, Dropdown, Menu, Icon } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import SidePanel from 'client/components/SidePanel';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import connectNav from 'client/common/decorators/connect-nav';
import { setCurrentOwner, syncTradeItemSkus, loadOwnerSkus, delSku, openApplyPackingRuleModal, batchDelUploadSku } from 'common/reducers/cwmSku';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { UPLOAD_BATCH_OBJECT } from 'common/constants';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import WhseSelect from '../../common/whseSelect';
import PackingRulePane from './panes/packingRulePane';
import ApplyPackingRuleModal from './modal/applyPackingRuleModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    owner: state.cwmSku.owner,
    loading: state.cwmSku.loading,
    syncing: state.cwmSku.skuSyncing,
    skulist: state.cwmSku.list,
    listFilter: state.cwmSku.listFilter,
    sortFilter: state.cwmSku.sortFilter,
    loginId: state.account.loginId,
    privileges: state.account.privileges,
  }),
  {
    setCurrentOwner,
    syncTradeItemSkus,
    loadOwnerSkus,
    switchDefaultWhse,
    delSku,
    openApplyPackingRuleModal,
    togglePanelVisible,
    setUploadRecordsReload,
    batchDelUploadSku,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSKU',
})
export default class CWMSkuList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    owners: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      partner_code: PropTypes.string,
      name: PropTypes.string,
    })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    collapsed: false,
    packingRuleVisible: false,
    selectedRowKeys: [],
    tableOwners: [],
    importPanelVisible: false,
  }
  componentDidMount() {
    if (!this.props.owner.id) {
      this.props.setCurrentOwner(this.props.owners[0] || {});
    }
    if (this.props.owner.id) {
      this.props.loadOwnerSkus({
        owner_partner_id: this.props.owner.id,
        filter: JSON.stringify(this.props.listFilter),
        sorter: JSON.stringify(this.props.sortFilter),
        pageSize: this.props.skulist.pageSize,
        current: this.props.skulist.current,
      });
    }
    this.setState({ tableOwners: this.props.owners });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.owners !== this.props.owners) {
      this.props.setCurrentOwner(nextProps.owners[0] || {});
      this.setState({ tableOwners: nextProps.owners });
    }
    if (nextProps.owner.id !== this.props.owner.id) {
      this.props.loadOwnerSkus({
        owner_partner_id: nextProps.owner.id || 0,
        filter: JSON.stringify(nextProps.listFilter),
        sorter: JSON.stringify(nextProps.sortFilter),
        pageSize: nextProps.skulist.pageSize,
        current: 1,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  ownerColumns = [{
    dataIndex: 'name',
    key: 'owner_name',
    render: (name, row) => (<span className="menu-sider-item">{row.partner_code ? `${row.partner_code} | ${row.name}` : row.name}</span>),
  }]
  columns = [{
    title: 'SKU',
    dataIndex: 'sku',
    width: 200,
  }, {
    title: this.msg('productNo'),
    width: 180,
    dataIndex: 'product_no',
  }, {
    title: this.msg('category'),
    width: 120,
    dataIndex: 'category',
  }, {
    title: this.msg('hscode'),
    width: 150,
    dataIndex: 'hscode',
  }, {
    title: this.msg('descCN'),
    dataIndex: 'desc_cn',
    width: 120,
  }, {
    title: this.msg('skuPack'),
    dataIndex: 'sku_pack_unit_name',
    width: 120,
  }, {
    title: this.msg('perSKUQty'),
    dataIndex: 'sku_pack_qty',
    width: 120,
  }, {
    title: this.msg('lastModifiedDate'),
    dataIndex: 'last_updated_date',
    width: 150,
    render: col => col && moment(col).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 150,
    render: col => col && moment(col).format('YYYY.MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 90,
    fixed: 'right',
    render: (_, row) => (
      <span>
        <PrivilegeCover module="cwm" feature="products" action="edit">
          <RowAction onClick={this.handleEditSku} icon="edit" tooltip="修改" row={row} />
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="products" action="delete">
          <RowAction onDelete={this.handleRemove} row={row} />
        </PrivilegeCover>
      </span>),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadOwnerSkus(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        owner_partner_id: this.props.owner.id,
        pageSize: pagination.pageSize,
        current: pagination.current,
        sorter: JSON.stringify({
          field: sorter.field,
          order: sorter.order === 'descend' ? 'DESC' : 'ASC',
        }),
        filter: JSON.stringify(this.props.listFilter),
      };
      return params;
    },
    remotes: this.props.skulist,
  })
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  togglePackingRule = () => {
    this.setState({
      packingRuleVisible: !this.state.packingRuleVisible,
    });
  }
  handleEditSku = (sku) => {
    const link = `/cwm/products/sku/edit/${sku.id}`;
    this.context.router.push(link);
  }
  handleRemove = (row) => {
    this.props.delSku(row.id).then((result) => {
      if (!result.errors) {
        message.info(`${row.sku}已删除`);
        this.props.loadOwnerSkus({
          owner_partner_id: this.props.owner.id,
          filter: JSON.stringify(this.props.listFilter),
          sorter: JSON.stringify(this.props.sortFilter),
          pageSize: this.props.skulist.pageSize,
          current: this.props.skulist.current,
        });
      }
    });
  }
  handleOwnerSearch = (value) => {
    if (value) {
      const towners = this.state.tableOwners.filter(to =>
        to.partner_code.indexOf(value) > 0 || to.name.indexOf(value) > 0);
      this.setState({ tableOwners: towners });
      if (towners.length === 0) {
        this.props.setCurrentOwner({});
      } else if (towners[0].id !== this.props.owner.id) {
        this.props.setCurrentOwner(towners[0]);
      }
    } else {
      this.setState({ tableOwners: this.props.owners });
      this.props.setCurrentOwner(this.props.owners[0] || {});
    }
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, sku: value };
    this.props.loadOwnerSkus({
      owner_partner_id: this.props.owner.id,
      filter: JSON.stringify(filter),
      sorter: JSON.stringify(this.props.sortFilter),
      pageSize: this.props.skulist.pageSize,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleTradeItemsSync = () => {
    this.props.syncTradeItemSkus(this.props.owner.id, this.props.loginId)
      .then((result) => {
        if (result.error) {
          if (result.error.message === 'NO_OWNER_REPO') {
            message.error('该客户暂无商品归类库');
          }
        } else {
          this.props.loadOwnerSkus({
            owner_partner_id: this.props.owner.id,
            filter: JSON.stringify(this.props.listFilter),
            sorter: JSON.stringify(this.props.sortFilter),
            pageSize: this.props.skulist.pageSize,
            current: 1,
          });
        }
      });
  }
  handleCreateBtnClick = () => {
    this.context.router.push('/cwm/products/sku/create');
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'export') {
      window.open(`${API_ROOTS.default}v1/cwm/sku/export/${this.props.owner.name}-skuList.xlsx?ownerId=${this.props.owner.id}`);
    } else if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  handleUploadSkuDel = (uploadNo, uploadReloadAfterDel) => {
    this.props.batchDelUploadSku(uploadNo).then((result) => {
      if (!result.error) {
        uploadReloadAfterDel();
        this.handleTableLoad();
      }
    });
  }
  handleOwnerSelect = (ev) => {
    const selectedOwner = this.state.tableOwners.find(owner => owner.id === Number(ev.key));
    this.props.setCurrentOwner(selectedOwner);
  }
  handleApplyPackingRule = () => {
    this.props.openApplyPackingRuleModal();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  skuUploaded = () => {
    this.props.loadOwnerSkus({
      owner_partner_id: this.props.owner.id,
      filter: JSON.stringify(this.props.listFilter),
      sorter: JSON.stringify(this.props.sortFilter),
      pageSize: this.props.skulist.pageSize,
      current: 1,
    });
    this.props.setUploadRecordsReload(true);
  }
  handleImport = () => {
    const editPermission = hasPermission(this.props.privileges, {
      module: 'cwm', feature: 'products', action: 'edit',
    });
    if (editPermission) {
      this.setState({ importPanelVisible: true });
    } else {
      message.warn('暂无权限', 3);
    }
  }
  render() {
    const {
      skulist, whse, owner, loading, syncing,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = skulist;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.sku} placeholder={this.msg('productSearchPlaceholder')} onSearch={this.handleSearch} />
    </span>);
    const bulkActions = (<PrivilegeCover module="cwm" feature="products" action="edit">
      <Button onClick={this.handleApplyPackingRule}>采用包装规则</Button>
    </PrivilegeCover>);
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="export" ><Icon type="download" />{this.msg('productExport')}</Menu.Item>
        <Menu.Item key="logs" ><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <Layout id="page-layout">
          <PageHeader breadcrumb={[<WhseSelect />]}>
            {owner.id >= 0 && (
              <PageHeader.Actions>
                {whse.bonded === 1 && (
                  <PrivilegeCover module="cwm" feature="products" action="edit">
                    <Button icon="sync" onClick={this.handleTradeItemsSync} loading={syncing}>
                      {this.msg('syncTradeItems')}
                    </Button>
                  </PrivilegeCover>
                )}
                <Dropdown.Button overlay={menu} disabled={syncing} onClick={this.handleImport}>
                  <Icon type="upload" />
                  {this.msg('productImport')}
                </Dropdown.Button>
                <PrivilegeCover module="cwm" feature="products" action="create">
                  <Button
                    type="primary"
                    icon="plus"
                    onClick={this.handleCreateBtnClick}
                    disabled={syncing}
                  >
                    {this.msg('createSKU')}
                  </Button>
                </PrivilegeCover>
                <PrivilegeCover module="cwm" feature="products" action="edit">
                  <Button onClick={this.togglePackingRule}>
                    包装规则
                  </Button>
                </PrivilegeCover>
              </PageHeader.Actions>
            )}
          </PageHeader>
          <Layout>
            <SidePanel width={280}>
              <SearchBox
                placeholder={this.msg('')}
                size="large"
                borderless
                onSearch={this.handleSearch}
              />
              <Menu
                selectedKeys={[String(this.props.owner.id)]}
                mode="inline"
                onClick={this.handleOwnerSelect}
                style={{ marginBottom: 0 }}
              >
                {this.state.tableOwners.map(data => (
                  <Menu.Item key={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
                  </Menu.Item>))
                }
              </Menu>
            </SidePanel>
            <Content className="page-content" key="main">
              <DataTable
                columns={this.columns}
                dataSource={this.dataSource}
                rowSelection={rowSelection}
                rowKey="id"
                scroll={{ x: 1400 }}
                loading={loading}
                toolbarActions={toolbarActions}
                bulkActions={bulkActions}
                selectedRowKeys={this.state.selectedRowKeys}
                onDeselectRows={this.handleDeselectRows}
              />
            </Content>
          </Layout>
        </Layout>
        <Drawer
          title="包装规则"
          visible={this.state.packingRuleVisible}
          onClose={this.togglePackingRule}
          width={400}
        >
          <PackingRulePane />
        </Drawer>
        <ImportDataPanel
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cwm/sku/import`}
          formData={{
            ownerId: owner.id,
            ownerTenantId: owner.partner_tenant_id,
            name: owner.name,
            loginId: this.props.loginId,
          }}
          onClose={() => {
            this.setState({ importPanelVisible: false });
          }}
          onUploaded={this.skuUploaded}
          template={`${XLSX_CDN}/sku导入模板.xlsx`}
        />
        <UploadLogsPanel
          onUploadBatchDelete={this.handleUploadSkuDel}
          type={UPLOAD_BATCH_OBJECT.CWM_SKU}
          formData={{}}
        />
        <ApplyPackingRuleModal />
      </Layout>
    );
  }
}
