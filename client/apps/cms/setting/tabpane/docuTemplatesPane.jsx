import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DOCU_TYPE } from 'common/constants';
import { toggleInvTempModal, loadInvTemplates, deleteInvTemplate, saveDoctsTempFile, loadTempFile, deleteTempFile } from 'common/reducers/cmsInvoice';
import connectNav from 'client/common/decorators/connect-nav';
import { Button, Icon, Layout, Menu, Popover, Upload, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import withPrivilege from 'client/common/decorators/withPrivilege';
import InvTemplateModal from '../templates/modals/newTemplate';
import { formatMsg } from '../../message.i18n';


const { Content, Sider } = Layout;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    loginName: state.account.username,
    invTemplates: state.cmsInvoice.invTemplates,
    docuType: state.cmsInvoice.docuType,
    customer: state.cmsResources.customer,
    tempFile: state.cmsInvoice.tempFile,
  }),
  {
    toggleInvTempModal,
    loadInvTemplates,
    deleteInvTemplate,
    saveDoctsTempFile,
    loadTempFile,
    deleteTempFile,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
})
@withPrivilege({ module: 'clearance', feature: 'setting', action: 'edit' })
export default class InvoiceTemplate extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    invTemplates: PropTypes.arrayOf(PropTypes.shape({
      template_name: PropTypes.string,
    })).isRequired,
    docuType: PropTypes.number.isRequired,
    customer: PropTypes.shape({ id: PropTypes.number }).isRequired,
    tempFile: PropTypes.shape({ id: PropTypes.number }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    current: JSON.stringify(this.props.docuType),
    excelTemplCount: 0,
    attachments: [],
  }
  componentWillMount() {
    if (this.props.customer.id) {
      this.props.loadTempFile({
        tenantId: this.props.tenantId,
        partnerId: this.props.customer.id,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        } else if (result.data && result.data.id) {
          this.setState({
            excelTemplCount: 1,
            attachments: [{
              uid: -1,
              name: result.data.doc_name,
              url: result.data.url,
              status: 'done',
            }],
          });
        } else {
          this.setState({ excelTemplCount: 0, attachments: [] });
        }
      });
      this.handleListLoad(this.props.docuType);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.customer !== this.props.customer) {
      this.props.loadInvTemplates({
        docuType: this.props.docuType,
        partnerId: nextProps.customer.id,
      });
      this.props.loadTempFile({
        tenantId: this.props.tenantId,
        partnerId: nextProps.customer.id,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 5);
        } else if (result.data && result.data.id) {
          this.setState({
            excelTemplCount: 1,
            attachments: [{
              uid: -1,
              name: result.data.doc_name,
              url: result.data.url,
              status: 'done',
            }],
          });
        } else {
          this.setState({ excelTemplCount: 0, attachments: [] });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleNavigationTo(to, query) {
    this.context.router.push({ pathname: to, query });
  }
  handleListLoad = (type) => {
    this.props.loadInvTemplates({
      docuType: type,
      partnerId: this.props.customer.id,
    });
  }
  handleCreateNew = () => {
    this.props.toggleInvTempModal(true);
  }
  handleEdit = (record) => {
    let type = '';
    if (record.docu_type === CMS_DOCU_TYPE.invoice) {
      type = 'invoice';
    } else if (record.docu_type === CMS_DOCU_TYPE.contract) {
      type = 'contract';
    } else if (record.docu_type === CMS_DOCU_TYPE.packingList) {
      type = 'packinglist';
    }
    this.context.router.push(`/clearance/setting/templates/${type}/${record.id}`);
  }
  handleDelete = (id) => {
    this.props.deleteInvTemplate(id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleListLoad(this.props.docuType);
      }
    });
  }
  handleListChange = (ev) => {
    if (ev.key === this.props.docuType) {
      return;
    }
    this.setState({
      current: ev.key,
    });
    this.handleListLoad(parseInt(ev.key, 10));
  }
  handleImport = (info) => {
    if (info.file.status === 'removed') {
      return;
    }
    if (info.file.status === 'uploading') {
      this.setState({
        attachments: [...this.state.attachments, info.file],
      });
      return;
    }
    if (info.file.response.status !== 200) {
      message.error(info.file.response.msg);
      return;
    }
    const { file } = info;
    const nextFile = {
      uid: file.uid,
      name: file.name,
      url: file.response.data,
      status: 'done',
    };
    this.setState({
      attachments: [nextFile],
    });
    const params = {
      fileId: this.props.tempFile.id || -1,
      doc_name: file.name,
      url: file.response.data,
      tenant_id: this.props.tenantId,
      customer_partner_id: this.props.customer.id,
      customer_name: this.props.customer.name,
      creater_login_id: this.props.loginId,
    };
    this.props.saveDoctsTempFile(params);
  }
  handleRemove = () => {
    this.setState({ attachments: [], excelTemplCount: 0 });
    this.props.deleteTempFile({ fileId: this.props.tempFile.id });
  }
  render() {
    const columns = [{
      title: '模板名称',
      dataIndex: 'template_name',
      key: 'template_name',
    }, {
      title: '修改人',
      dataIndex: 'modify_name',
      key: 'modify_name',
    }, {
      title: '最后更新时间',
      dataIndex: 'last_updated_date',
      key: 'last_updated_date',
    }, {
      title: '操作',
      key: 'opt',
      width: 100,
      render: (_, record) => (
        <span>
          <RowAction icon="edit" onClick={() => this.handleEdit(record)} />
          <RowAction danger icon="delete" confirm="确定删除？" onConfirm={() => this.handleDelete(record.id)} />
        </span>),
    }];
    const excelTemplPopover = (<div style={{ width: 300 }}>
      <Upload
        listType="text"
        fileList={this.state.attachments}
        accept=".xls,.xlsx,.xlsm"
        onRemove={this.handleRemove}
        onChange={this.handleImport}
        action={`${API_ROOTS.default}v1/upload/img/`}
        withCredentials
      >
        <Button>
          <Icon type="upload" /> upload
        </Button>
      </Upload>
    </div>);
    return (
      <Layout className="main-wrapper">
        <Sider className="nav-sider">
          <Menu
            selectedKeys={[this.state.current]}
            mode="inline"
            onClick={this.handleListChange}
          >
            <Menu.Item key={JSON.stringify(CMS_DOCU_TYPE.invoice)}>发票模板</Menu.Item>
            <Menu.Item key={JSON.stringify(CMS_DOCU_TYPE.contract)}>合同模板</Menu.Item>
            <Menu.Item key={JSON.stringify(CMS_DOCU_TYPE.packingList)}>箱单模板</Menu.Item>
          </Menu>
        </Sider>
        <Content className="nav-content">
          <DataTable
            cardView={false}
            toolbarActions={[<Button type="primary" onClick={this.handleCreateNew} icon="plus-circle-o">新增</Button>,
              <Popover placement="bottom" content={excelTemplPopover} trigger="click">
                <Button icon="file-excel">Excel数据模板 {this.state.excelTemplCount}</Button>
              </Popover>]}
            columns={columns}
            dataSource={this.props.invTemplates}
            rowKey="id"
            scrollOffset={340}
          />
          <InvTemplateModal customer={this.props.customer} />
        </Content>
      </Layout>
    );
  }
}
