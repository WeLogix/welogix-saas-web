import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Icon, Layout, Tag, Select, Menu, Modal, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { LogixIcon } from 'client/components/FontIcon';
import connectNav from 'client/common/decorators/connect-nav';
import { loadPermits, discardPermit, reactivatePermit } from 'common/reducers/cmsPermit';
import { loadPartners } from 'common/reducers/partner';
import { PARTNER_ROLES, PARTNER_BUSINESSE_TYPES, CIQ_GOODS_LIMITS_TYPE, UPLOAD_BATCH_OBJECT } from 'common/constants';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import SearchBox from 'client/components/SearchBox';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from './message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  (state) => {
    const certParams = state.saasParams.latest.certMark
      .map(f => ({ value: f.cert_code, text: f.cert_spec }));
    return {
      tenantId: state.account.tenantId,
      loginId: state.account.loginId,
      permitList: state.cmsPermit.permitList,
      loading: state.cmsPermit.permitList.loading,
      clients: state.partner.partners,
      certParams,
      certType: certParams.concat(CIQ_GOODS_LIMITS_TYPE),
      privileges: state.account.privileges,
    };
  },
  {
    loadPermits,
    loadPartners,
    discardPermit,
    reactivatePermit,
    setUploadRecordsReload,
    togglePanelVisible,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmPermit',
})

export default class PermitList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    certs: this.props.certType,
    importPanelVisible: false,
  }
  componentDidMount() {
    this.props.loadPartners({
      role: PARTNER_ROLES.CUS,
      businessTypes: PARTNER_BUSINESSE_TYPES.clearance,
    });
    let filters = this.props.permitList.filter;
    const locHash = this.props.location.hash;
    if (locHash === '#incomplete') {
      filters = { ...filters, status: '-1' };
    } else if (locHash === '#expiring') {
      filters = { ...filters, status: '2' };
    } else if (locHash === '#expired') {
      filters = { ...filters, status: '0' };
    } else {
      filters = { ...filters, status: 'all' };
    }
    this.handleLoad(1, null, filters);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('permitOwner'),
    width: 250,
    dataIndex: 'owner_partner_id',
    render: (o) => {
      const owner = this.props.clients.find(cl => cl.id === o);
      return owner && owner.name;
    },
  }, {
    title: this.msg('permitCategory'),
    width: 60,
    dataIndex: 'permit_category',
    align: 'center',
    render: o => <LogixIcon type={`icon-${o}`} />,
  }, {
    title: this.msg('permitType'),
    width: 200,
    dataIndex: 'permit_code',
    render: (o) => {
      const cert = this.props.certType.find(f => f.value === o);
      return cert && cert.text;
    },
  }, {
    title: this.msg('permitNo'),
    dataIndex: 'permit_no',
    width: 200,
  }, {
    title: this.msg('permitStatus'),
    width: 100,
    dataIndex: 'status',
    render: (o) => {
      switch (o) {
        case -2:
          return <Tag color="gray">{this.msg('filterDiscarded')}</Tag>;
        case -1:
          return <Tag color="red">{this.msg('filterIncomplete')}</Tag>;
        case 0:
          return <Tag color="red">{this.msg('filterInvalid')}</Tag>;
        case 1:
          return <Tag color="green">{this.msg('filterValid')}</Tag>;
        case 2:
          return <Tag color="orange">{this.msg('filterExpiring')}</Tag>;
        default:
          return o;
      }
    },
  }, {
    title: this.msg('permitFile'),
    dataIndex: 'permit_file',
    width: 100,
    align: 'center',
    render: (o, record) => {
      if (o && o !== '') {
        return <RowAction icon="file-pdf" onClick={this.handleViewPDF} row={record} />;
      }
      return <span />;
    },
  }, {
    title: this.msg('usageControl'),
    width: 100,
    dataIndex: 'usage_control',
    align: 'center',
    render: o => (o ? <Tag color="#87d068">{this.msg('turnOn')}</Tag> : <Tag>{this.msg('close')}</Tag>),
  }, {
    title: this.msg('maxUsage'),
    width: 100,
    dataIndex: 'max_usage',
    align: 'right',
  }, {
    title: this.msg('availUsage'),
    width: 100,
    dataIndex: 'ava_usage',
    align: 'right',
  }, {
    title: this.msg('expiryControl'),
    width: 120,
    dataIndex: 'expiry_control',
    align: 'center',
    render: o => (o ? <Tag color="#87d068">{this.msg('turnOn')}</Tag> : <Tag>{this.msg('close')}</Tag>),
  }, {
    title: this.msg('startDate'),
    dataIndex: 'start_date',
    width: 150,
    align: 'center',
    render: (o, record) => (record.start_date ? moment(record.start_date).format('YYYY.MM.DD') : '-'),
  }, {
    title: this.msg('stopDate'),
    dataIndex: 'stop_date',
    width: 150,
    align: 'center',
    render: (o, record) => (record.stop_date ? moment(record.stop_date).format('YYYY.MM.DD') : '-'),
  }, {
    title: this.msg('opCol'),
    width: 100,
    fixed: 'right',
    render: (o, record) => (
      <PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.handleDetail} icon="form" label={this.msg('detail')} row={record} />
        {(record.status !== -1 && record.status !== 0) &&
        <RowAction
          overlay={<Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
            {(record.status === 1 || record.status === 2) &&
            <Menu.Item key="discard">
              <a><Icon type="close-square" />{this.msg('discard')}</a>
            </Menu.Item>}
            {(record.status === -2) &&
            <Menu.Item key="reActivate">
              <a><Icon type="down-square" />{this.msg('reActivate')}</a>
            </Menu.Item>}
          </Menu>}
          row={record}
        />}
      </PrivilegeCover>),
  }]
  handleAdd = () => {
    this.context.router.push('/clearance/permit/add');
  }
  handleDetail = (row) => {
    this.context.router.push(`/clearance/permit/${row.id}`);
  }
  handleViewPDF = (record) => {
    if (record) window.open(record.permit_file);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleSearch = () => {
    const values = this.props.form.getFieldsValue();
    const filter = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        filter[key] = values[key];
      }
    });
    this.handleLoad(1, null, filter);
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleLoad = (page, size, paramFilter) => {
    const { pageSize, current, filter } = this.props.permitList;
    const currentPage = page || current;
    const currentSize = size || pageSize;
    const currentFilter = paramFilter || filter;
    this.props.loadPermits(currentPage, currentSize, currentFilter);
  }
  handlePageChange = (page, size) => {
    this.handleLoad(page, size);
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'discard') {
      this.handleDiscardPermit(record);
    } else if (key === 'reActivate') {
      this.handleReActivatePermit(record);
    }
  }
  handleDiscardPermit = (record) => {
    const self = this;
    Modal.confirm({
      title: '确定废弃证书?',
      onOk() {
        self.props.discardPermit(record.id).then((result) => {
          if (!result.error) {
            self.handleLoad();
          }
        });
      },
      onCancel() {
      },
    });
  }
  handleReActivatePermit = (record) => {
    this.props.reactivatePermit(record.id).then((result) => {
      if (!result.error) {
        this.handleLoad();
      }
    });
  }
  handleStatusChange = (value) => {
    const filter = { ...this.props.permitList.filter, status: value };
    this.handleLoad(1, null, filter);
  }
  handleOwnerChange = (value) => {
    const filter = { ...this.props.permitList.filter, owner_partner_id: value };
    this.handleLoad(1, null, filter);
  }
  handlePermitCodeChange = (value) => {
    const filter = { ...this.props.permitList.filter, permit_code: value };
    this.handleLoad(1, null, filter);
  }
  handlepermitCategoryChange = (value) => {
    let certs = this.props.certType;
    if (value === 'customs') {
      certs = this.props.certParams;
    } else if (value === 'ciq') {
      certs = CIQ_GOODS_LIMITS_TYPE;
    }
    this.setState({
      certs,
    });
    const filter = { ...this.props.permitList.filter, permit_category: value };
    this.handleLoad(1, null, filter);
  }
  handlePermitNoChange = (value) => {
    const filter = { permit_no: value };
    this.handleLoad(1, null, filter);
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  handleImport = () => {
    const editPermission = hasPermission(this.props.privileges, {
      module: 'clearance', feature: 'compliance', action: 'edit',
    });
    if (editPermission) {
      this.setState({
        importPanelVisible: true,
      });
    } else {
      message.warn(this.msg('noEitpermission'), 5);
    }
  }
  handleUploaded = () => {
    this.handleLoad();
    this.props.setUploadRecordsReload(true);
  }
  handleGenTemplate = () => {
    window.open(`${API_ROOTS.default}v1/cms/permit/download/permit_template.xlsx?`);
  }
  render() {
    const {
      loading, clients, permitList,
    } = this.props;
    const listFilter = permitList.filter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: false,
      total: permitList.totalCount,
      current: permitList.current,
      pageSize: permitList.pageSize,
      showTotal: total => `共 ${total} 条`,
      onChange: this.handlePageChange,
    };
    const dropdownMenuItems = [
      { name: this.msg('all'), elementKey: 'all' },
      { icon: 'file-protect', name: this.msg('filterValid'), elementKey: '1' },
      { icon: 'file-exclamation', name: this.msg('filterExpiring'), elementKey: '2' },
      { icon: 'file-unknown', name: this.msg('filterIncomplete'), elementKey: '-1' },
      { icon: 'file', name: this.msg('filterInvalid'), elementKey: '0' },
      { icon: 'delete', name: this.msg('filterDiscarded'), elementKey: '-2' },
    ];
    const dropdownMenu = {
      selectedMenuKey: listFilter.status || 'all',
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems,
    };
    const toolbarActions = (<span>
      <Select
        showSearch
        allowClear
        placeholder={this.msg('permitOwner')}
        optionFilterProp="children"
        onChange={this.handleOwnerChange}
        value={listFilter.owner_partner_id}
        style={{ width: 200 }}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        {clients.map(data => (<Option key={data.id} value={data.id}>
          {[data.partner_code, data.name].filter(f => f).join('|')}
        </Option>))}
      </Select>
      <Select
        showSearch
        allowClear
        placeholder={this.msg('permitCategory')}
        optionFilterProp="children"
        onChange={this.handlepermitCategoryChange}
        value={listFilter.permit_category}
        style={{ width: 200 }}
      >
        <Option key="customs" value="customs">{this.msg('customsPermit')}</Option>
        <Option key="ciq" value="ciq">{this.msg('ciqPermit')}</Option>
      </Select>
      <Select
        showSearch
        allowClear
        placeholder={this.msg('permitType')}
        optionFilterProp="children"
        onChange={this.handlePermitCodeChange}
        value={listFilter.permit_code}
        style={{ width: 200 }}
      >
        {this.state.certs.map(data => (<Option key={data.value} value={data.value}>
          {[data.value, data.text].filter(f => f).join('|')}
        </Option>))}
      </Select>
      <SearchBox
        placeholder={this.msg('permitNo')}
        onSearch={this.handlePermitNoChange}
        style={{ width: 200 }}
        value={listFilter.permit_no}
      />
    </span>);
    const dropdown = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    return (
      <Layout id="page-layout">
        <PageHeader
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Button type="primary" onClick={this.handleAdd} icon="plus">{this.msg('addPermit')}</Button>
            </PrivilegeCover>
            <ToolbarAction primary icon="upload" label={this.msg('batchImport')} dropdown={dropdown} onClick={this.handleImport} />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={permitList.data}
            rowKey="id"
            loading={loading}
            pagination={pagination}
          />
          <ImportDataPanel
            title="证书关联货号导入"
            visible={this.state.importPanelVisible}
            endpoint={`${API_ROOTS.default}v1/cms/permit/product/import`}
            formData={{}}
            onClose={() => { this.setState({ importPanelVisible: false }); }}
            onUploaded={this.handleUploaded}
            onGenTemplate={this.handleGenTemplate}
          />
          <UploadLogsPanel
            type={UPLOAD_BATCH_OBJECT.CMS_PERMIT}
            formData={{}}
          />
        </PageContent>
      </Layout>
    );
  }
}
