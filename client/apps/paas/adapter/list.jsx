import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, notification } from 'antd';
import { PARTNER_ROLES, LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import moment from 'moment';
import UserAvatar from 'client/components/UserAvatar';
import { loadPartners } from 'common/reducers/partner';
import { loadAdaptors, loadAdaptor, showAdaptorDetailModal, delAdaptor, showAdaptorModal } from 'common/reducers/hubDataAdapter';
import DataTable from 'client/components/DataTable';
import ExcelUploader from 'client/components/ExcelUploader';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { intlShape, injectIntl } from 'react-intl';
import AdaptorModal from './modal/adaptorModal';
import AdaptorDetailModal from './modal/adaptorDetailModal';
import PaaSMenu from '../menu';
import { formatMsg } from './message.i18n';
import { LogixIcon } from '../../../components/FontIcon';

const { Content } = Layout;
const impModels = Object.values(LINE_FILE_ADAPTOR_MODELS);

@injectIntl
@connect(
  state => ({
    adaptors: state.hubDataAdapter.adaptorList,
    loading: state.hubDataAdapter.loadingAdaptors,
    customers: state.partner.partners,
    pageSize: state.hubDataAdapter.adaptorList.pageSize,
    current: state.hubDataAdapter.adaptorList.current,
    filter: state.hubDataAdapter.filter,
  }),
  {
    showAdaptorModal, loadAdaptors, loadPartners, loadAdaptor, showAdaptorDetailModal, delAdaptor,
  }
)

export default class LineFileAdapterList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadAdaptors('', '', this.props.pageSize, 1, this.props.filter);
    this.props.loadPartners({
      role: [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP],
    });
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.context.router.goBack();
  }
  handleEditBtnClick = (edit) => {
    this.props.showAdaptorDetailModal();
    this.props.loadAdaptor(edit.code);
  }
  handleDel = (record) => {
    this.props.delAdaptor(record.code).then((result) => {
      if (result.error) {
        notification.error({ description: result.error.message });
      } else {
        this.handleReload();
      }
    });
  }
  handleUploaded = () => {
    this.handleReload();
  }
  handleCreateAdapter = () => {
    this.props.showAdaptorModal();
  }
  handleReload = () => {
    const { pageSize, current, filter } = this.props;
    this.props.loadAdaptors('', '', pageSize, current, filter);
  }
  handleSearch = (value) => {
    const { pageSize, current } = this.props;
    const filter = { ...this.props.filter, searchText: value };
    this.props.loadAdaptors('', '', pageSize, current, filter);
  }
  columns = [{
    title: this.msg('adapterName'),
    width: 200,
    dataIndex: 'name',
  }, {
    title: this.msg('adapterBizModel'),
    width: 180,
    dataIndex: 'biz_model',
    render: (o) => {
      const bizModel = impModels.find(model => model.key === o);
      return bizModel && bizModel.name;
    },
  }, {
    title: this.msg('adapterFileFormat'),
    width: 100,
    dataIndex: 'file_format',
    align: 'center',
    render: o => o && <LogixIcon type={`icon-file-${o.toLowerCase().slice(0, 3)}`} />,
  }, {
    title: this.msg('relatedPartner'),
    width: 250,
    dataIndex: 'owner_partner_id',
    render: (o) => {
      const partner = this.props.customers.find(customer => customer.id === o);
      return partner && partner.name;
    },
  }, {
    title: this.msg('lastUpdatedDate'),
    width: 150,
    dataIndex: 'last_updated_date',
    render: recdate => recdate && moment(recdate).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('lastUpdatedBy'),
    width: 100,
    dataIndex: 'last_updated_by',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('createdDate'),
    width: 100,
    dataIndex: 'created_date',
    render: recdate => recdate && moment(recdate).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 120,
    render: (o, record) => {
      let action = null;
      if (record.active) {
        action = <RowAction onClick={this.handleEditBtnClick} icon="setting" tooltip={this.msg('config')} row={record} />;
      } else {
        action = (<ExcelUploader
          endpoint={`${API_ROOTS.default}v1/saas/line/file/upload/example`}
          formData={{ data: JSON.stringify({ code: record.code }) }}
          onUploaded={this.handleUploaded}
        >
          <RowAction icon="cloud-upload-o" tooltip="上传至少有两行示例内容的Excel文件" />
        </ExcelUploader>);
      }
      return [action, <RowAction onDelete={this.handleDel} row={record} />];
    },
  }]
  handlePageChange = (page, pageSize) => {
    this.props.loadAdaptors('', '', pageSize, page, this.props.filter);
  }
  handleTabChange = (tabKey) => {
    if (tabKey === 'exportAdapter') {
      this.context.router.push('/paas/adapter/export');
    }
  }
  render() {
    const { adaptors, loading } = this.props;
    const pagination = {
      pageSize: Number(adaptors.pageSize),
      current: Number(adaptors.current),
      total: adaptors.total,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      onShowSizeChange: this.handlePageChange,
      onChange: this.handlePageChange,
    };
    const menus = [
      {
        key: 'importAdapter',
        menu: this.msg('importAdapter'),
        default: true,
      },
      {
        key: 'exportAdapter',
        menu: this.msg('exportAdapter'),
      },
    ];
    const toolbarActions = (<span>
      <SearchBox placeholder={this.msg('searchTip')} onSearch={this.handleSearch} />
    </span>);
    return (
      <Layout>
        <PaaSMenu currentKey="adapter" openKey="bizObject" />
        <Layout>
          <PageHeader menus={menus} onTabChange={this.handleTabChange}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.handleCreateAdapter}>
                {this.msg('create')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={toolbarActions}
              columns={this.columns}
              dataSource={adaptors.data}
              indentSize={0}
              rowKey="code"
              pagination={pagination}
              loading={loading}
              noSetting
            />
          </Content>
          <AdaptorModal />
          <AdaptorDetailModal reload={this.handleReload} />
        </Layout>
      </Layout>
    );
  }
}
