import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Icon, Layout, Menu, Modal, message, Tag, Button } from 'antd';
import DataTable from 'client/components/DataTable';
import ToolbarAction from 'client/components/ToolbarAction';
import RowAction from 'client/components/RowAction';
import PageHeader from 'client/components/PageHeader';
import UserAvatar from 'client/components/UserAvatar';
import SearchBox from 'client/components/SearchBox';
import connectNav from 'client/common/decorators/connect-nav';
import {
  toggleReportCreateModal, loadReports, delReport,
  toggleReportCatCreateModal, loadReportCategories, renameCategory,
  deleCategory,
} from 'common/reducers/disReport';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import CreateReportModal from './modal/createReportModal';
import ReportCategoryModal from './modal/reportCategoryModal';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { confirm } = Modal;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    reportListLoading: state.disReport.reportListLoading,
    reportList: state.disReport.reportList,
    reportListFilter: state.disReport.reportListFilter,
    reportListReload: state.disReport.reportListReload,
    categoryList: state.disReport.categoryList,
    privileges: state.account.privileges,
  }),
  {
    toggleReportCreateModal,
    toggleReportCatCreateModal,
    loadReports,
    delReport,
    loadReportCategories,
    deleCategory,
    renameCategory,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'dis',
  title: 'featDisReport',
})
export default class ReportList extends React.Component {
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
    this.handleReportsLoad();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reportListReload && nextProps.reportListReload !== this.props.reportListReload) {
      this.handleReportsLoad(1, null, nextProps.reportListFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'dis', feature: 'report', action: 'edit',
  });
  deletePermission = hasPermission(this.props.privileges, {
    module: 'dis', feature: 'report', action: 'delete',
  });
  columns = [{
    title: this.msg('reportCategory'),
    dataIndex: 'rpt_category_name',
    width: 220,
    render: (o, record) => (o ? <span><Icon type="folder" theme="twoTone" twoToneColor="#52c41a" style={{ fontSize: 18 }} /> {o}</span> : (!record.rpt_category_id && <Tag color="#ccc">{this.msg('noCategory')}</Tag>)),
  }, {
    title: this.msg('reportName'),
    dataIndex: 'rpt_name',
    width: 500,
    render: (o, record) => (record.rpt_name && <span>
      <Icon type="layout" theme="twoTone" style={{ fontSize: 18 }} /> <RowAction href label={o} onClick={this.handleViewReport} row={record} />
      </span>),
  }, {
    title: this.msg('lastUpdatedBy'),
    dataIndex: 'last_updated_by',
    width: 150,
    render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('lastUpdatedDate'),
    dataIndex: 'last_updated_date',
    width: 150,
    render: createdate => createdate && moment(createdate).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 90,
    render: (o, record) => {
      if (record.rpt_name !== undefined) {
        const menus = [];
        if (this.editPermission) {
          menus.push(
            <Menu.Item key="moveTo"><Icon type="drag" />{this.msg('moveTo')}</Menu.Item>,
            <Menu.Item key="rename"><Icon type="edit" />{this.msg('rename')}</Menu.Item>
          );
        }
        if (this.deletePermission) {
          menus.push(<Menu.Item key="delete"><Icon type="delete" />{this.msg('delete')}</Menu.Item>);
        }
        let menuEntry;
        if (menus.length > 0) {
          menuEntry = (<Menu onClick={ev => this.handleRptOpMenuClick(ev.key, record)}>
            {menus}
          </Menu>);
        }
        return (<span>
          <PrivilegeCover module="dis" feature="report" action="edit">
            <RowAction icon="setting" onClick={this.handleReportConfig} tooltip={this.msg('reportConfig')} row={record} />
          </PrivilegeCover>
          {menuEntry && <RowAction overlay={menuEntry} />}
        </span>);
      }
      return (<span>
        <PrivilegeCover module="dis" feature="report" action="edit">
          <RowAction
            icon="edit"
            onClick={() => this.props.toggleReportCatCreateModal(true, 'rename', { categoryId: record.id, oldCatName: record.rpt_category_name })}
            tooltip={this.msg('rename')}
            row={record}
          />
        </PrivilegeCover>
        <PrivilegeCover module="dis" feature="report" action="delete">
          <RowAction onDelete={this.handleDeleCategory} delConfirm="分类将被删除，但原本属于该类的报表仍将保留" row={record} />
        </PrivilegeCover>
      </span>);
    },
  }]
  handleRenameCategory = (id, name) => {
    this.props.renameCategory(id, name)
      .then((result) => {
        if (!result.error) {
          message.info(this.msg('opSucceed'));
          this.handleReportsLoad(1);
        }
      });
  }
  handleReportsLoad = (currentPage, pageSize, filter) => {
    const { reportListFilter, reportList } = this.props;
    this.props.loadReports({
      filter: filter || reportListFilter,
      pageSize: pageSize || reportList.pageSize,
      current: currentPage || reportList.current,
    });
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.handleReportsLoad(params.current, params.pageSize, null),
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
      return params;
    },
    remotes: this.props.reportList,
  })
  handleViewReport = (record) => {
    if (record.rpt_name) {
      this.context.router.push(`/dis/report/view/${record.id}`);
    }
  }
  handleCreateReport = () => {
    this.props.toggleReportCreateModal(true);
  }
  handleCreateReportCategory = () => {
    this.props.toggleReportCatCreateModal(true, 'create');
  }
  handleReportConfig = ({ id }) => {
    this.context.router.push(`/dis/report/edit/${id}`);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.reportListFilter, searchText: value };
    this.handleReportsLoad(1, null, filter);
  }
  handleRptOpMenuClick = (evkey, rpt) => {
    if (evkey === 'delete') {
      const self = this;
      confirm({
        title: '确认删除此报表吗?',
        content: '报表的配置信息将被删除，但对应业务数据仍将保留',
        okText: this.msg('delete'),
        okType: 'danger',
        cancelText: this.msg('nope'),
        onOk() {
          self.props.delReport(rpt.id).then((result) => {
            if (!result.error) {
              message.info(self.msg('deletedSucceed'));
            }
          });
        },
        onCancel() {
        },
      });
    } else if (evkey === 'moveTo') {
      this.props.toggleReportCatCreateModal(true, 'change', { rptObjs: [rpt], catId: rpt.rpt_category_id });
    } else if (evkey === 'rename') {
      this.props.toggleReportCatCreateModal(true, 'renameRpt', { rptId: rpt.id, oldRptName: rpt.rpt_name });
    }
  }
  handleBatchMove = () => {
    const { selectedRowKeys } = this.state;
    const { reportList: { data } } = this.props;
    let allRptObjs = data.filter(obj => obj.id > 0);
    for (let i = 0; i < data.length; i++) {
      if (data[i].children) {
        allRptObjs = allRptObjs.concat(data[i].children);
      }
    }
    const rptObjs = selectedRowKeys
      .map(id => allRptObjs.find(rpt => rpt.id === id))
      .filter(obj => obj);
    this.props.toggleReportCatCreateModal(true, 'change', { rptObjs, catId: null });
    this.handleDeselectRows();
  }
  handleRptCreateMenuClick = () => {
  }
  handleDeleCategory = (category) => {
    this.props.deleCategory(Math.abs(category.id)).then((result) => {
      if (!result.error) {
        message.info(this.msg('deletedSucceed'));
        this.handleReportsLoad(1);
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { reportListLoading, reportList, reportListFilter } = this.props;
    const { selectedRowKeys } = this.state;
    this.dataSource.remotes = reportList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (keys) => {
        this.setState({ selectedRowKeys: keys.filter(key => key > 0) });
      },
    };
    const toolbarActions = <span><SearchBox value={reportListFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} /></span>;
    const bulkActions = (
      <PrivilegeCover module="dis" feature="report" action="edit">
        <Button
          disabled={selectedRowKeys.length < 2}
          icon="drag"
          onClick={this.handleBatchMove}
        >
          批量移动到
        </Button>
      </PrivilegeCover>);
    return (
      <Layout>
        <PageHeader>
          <PageHeader.Actions>
            <PrivilegeCover module="dis" feature="report" action="create">
              <ToolbarAction
                primary
                icon="plus"
                label={this.msg('createReport')}
                onClick={this.handleCreateReport}
                dropdown={<Menu onClick={this.handleRptCreateMenuClick}>
                  <Menu.Item key="newCategory" onClick={this.handleCreateReportCategory}>
                    <Icon type="folder-add" /> {this.msg('createCategory')}
                  </Menu.Item>
                </Menu>}
              />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            bulkActions={bulkActions}
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={reportListLoading}
            defaultExpandAllRows
          />
          <CreateReportModal />
          <ReportCategoryModal />
        </Content>
      </Layout>
    );
  }
}
