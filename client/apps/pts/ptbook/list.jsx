import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Icon, Layout, Menu, Modal, Select, message, Tag, Tooltip } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import PageHeader from 'client/components/PageHeader';
import UserAvatar from 'client/components/UserAvatar';
import connectNav from 'client/common/decorators/connect-nav';
import { loadPartners } from 'common/reducers/partner';
import { showCreateBookModal, loadBooks, deleteBook } from 'common/reducers/ptsBook';
import { showSendSwJG2File, toggleSasDeclMsgModal, revertRegSend } from 'common/reducers/cwmSasblReg';
import { BLBOOK_STATUS, PARTNER_ROLES, SW_JG2_SENDTYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import CreateBookModal from './modals/createBookModal';
import SendSwJG2FileModal from '../../cwm/sasbl/common/modals/sendSwJG2FileModal';
import SasDeclMsgModal from '../../cwm/sasbl/common/modals/sasDeclMsgModal';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    filters: state.ptsBook.listFilters,
    bookList: state.ptsBook.bookList,
    bookListLoading: state.ptsBook.bookList.bookListLoading,
    partners: state.partner.partners,
  }),
  {
    loadBooks,
    showCreateBookModal,
    deleteBook,
    loadPartners,
    showSendSwJG2File,
    toggleSasDeclMsgModal,
    revertRegSend,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'pts',
  title: 'featPtsPTBook',
})
export default class PTBookList extends React.Component {
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
    this.handleListReload();
    this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.VEN] });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('preBlbookNo'),
    dataIndex: 'pre_blbook_no',
    width: 150,
  }, {
    title: this.msg('copManualNo'),
    dataIndex: 'cop_manual_no',
    width: 150,
  }, {
    title: this.msg('bookType'),
    dataIndex: 'blbook_type',
    width: 140,
    render: (o) => {
      if (o === 'EMS') {
        return <Tag color="blue">加工贸易账册</Tag>;
      }
      return <Tag color="cyan" >加工贸易手册</Tag>;
    },
  }, {
    title: this.msg('bookNo'),
    width: 150,
    dataIndex: 'blbook_no',
  }, {
    title: this.msg('bookStatus'),
    dataIndex: 'blbook_status',
    width: 120,
    render: (o, record) => {
      if (o === 3 && record.sent_status === 2) {
        return (<Tooltip title={record.receipt_err_msg}><Tag color="red">发送失败</Tag></Tooltip>);
      }
      const statusKey = Object.keys(BLBOOK_STATUS).filter(as =>
        BLBOOK_STATUS[as].value === o)[0];
      if (statusKey) {
        return (<Badge
          status={BLBOOK_STATUS[statusKey].badge}
          text={BLBOOK_STATUS[statusKey].text}
        />);
      }
      return '';
    },
  }, {
    title: this.msg('ownerName'),
    dataIndex: 'owner_name',
    width: 200,
  }, {
    title: this.msg('expirayDate'),
    dataIndex: 'blbook_expiray_date',
    width: 120,
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 140,
    render: dt => dt && moment(dt).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('createdBy'),
    dataIndex: 'created_by',
    width: 140,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => {
      switch (record.blbook_status) {
        case BLBOOK_STATUS.PENDING.value: // 未备案
          return (
            <span>
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
                {(record.sent_status === 2 || record.sent_status === 4) && <RowAction onClick={this.handleBookSend} icon="mail" tooltip={this.msg('sendMsg')} row={record} />}
                {record.sent_status === 0 && <RowAction onClick={this.handleBookSend} icon="reload" tooltip={this.msg('resendMsg')} row={record} />}
                <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} />
              </PrivilegeCover>
              <PrivilegeCover module="cwm" feature="blbook" action="delete">
                <RowAction
                  overlay={
                    <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                      <Menu.Item key="delete"><Icon type="delete" />{this.msg('delete')}</Menu.Item>
                    </Menu>}
                  row={record}
                />
              </PrivilegeCover>
            </span>
          );
        case BLBOOK_STATUS.REVISING.value: // 变更中
          return (
            <span>
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
                {(record.sent_status === 2 || record.sent_status === 4) && <RowAction onClick={this.handleBookSend} icon="mail" tooltip={this.msg('sendMsg')} row={record} />}
                {record.sent_status === 0 && <RowAction onClick={this.handleBookSend} icon="reload" tooltip={this.msg('resendMsg')} row={record} />}
                <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} />
              </PrivilegeCover>
              <RowAction
                overlay={
                  <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                    <PrivilegeCover module="cwm" feature="blbook" action="edit">
                      { record.sent_status === 3 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
                    </PrivilegeCover>
                    <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                    <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
                  </Menu>}
                row={record}
              />
            </span>
          );
        case BLBOOK_STATUS.DECLARING.value: // 申报中
          return (
            <span>
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
                <RowAction onClick={this.handleModify} icon="eye-o" tooltip={this.msg('view')} row={record} />
              </PrivilegeCover>
              <RowAction
                overlay={
                  <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                    <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                    <PrivilegeCover module="cwm" feature="blbook" action="edit">
                      { record.sent_status === 3 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
                    </PrivilegeCover>
                  </Menu>}
                row={record}
              />
            </span>
          );
        case BLBOOK_STATUS.APPROVED.value: // 审核通过
          return (
            <span>
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
                <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} />
              </PrivilegeCover>
              <RowAction
                overlay={
                  <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                    <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                    <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
                  </Menu>}
                row={record}
              />
            </span>
          );
        default:
          return '';
      }
    },
  }]
  handleShowCreateBookModal = () => {
    this.props.showCreateBookModal(true);
  }
  handleModify = (row) => {
    const link = `/pts/ptbook/${row.id}`;
    this.context.router.push(link);
  }
  handleBookSend = (row) => {
    this.props.showSendSwJG2File({
      visible: true,
      copNo: row.cop_manual_no,
      agentCode: row.declarer_scc_code,
      regType: 'book',
      sendFlag: row.blbook_type === 'EMS' ? SW_JG2_SENDTYPE.EMS : SW_JG2_SENDTYPE.EML,
      decType: row.declarer_type,
    });
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'delete') {
      Modal.confirm({
        title: this.msg('deleteConfirm'),
        onOk: () => {
          this.handleDelete(record);
        },
      });
    } else if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_manual_no, sasRegType: key });
    } else if (key === 'back') {
      this.props.revertRegSend(record.cop_manual_no, 'book').then((result) => {
        if (!result.error) {
          this.handleListReload();
        }
      });
    } else {
      message.info('功能待开放');
    }
  }
  handleDelete = (record) => {
    this.props.deleteBook(record.cop_manual_no).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('删除成功');
        this.handleListReload();
      }
    });
  }
  handleListReload = (filters, current) => {
    this.props.loadBooks({
      pageSize: this.props.bookList.pageSize,
      current: current || this.props.bookList.current,
      filters: filters || this.props.filters,
    });
  }

  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, blbook_status: key };
    this.handleListReload(filters, 1);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleOwnerChange = (value) => {
    const filters = { ...this.props.filters, ownerCode: value };
    this.handleListReload(filters, 1);
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, searchFields: value };
    this.handleListReload(filters, 1);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      filters, bookListLoading, partners,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadBooks(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination, tblfilters) => {
        const newfilters = { ...this.props.filters, ...tblfilters[0] };
        const params = {
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters: newfilters,
        };
        return params;
      },
      remotes: this.props.bookList,
    });
    const toolbarActions = (<span>
      <SearchBox value={filters.searchFields} placeholder={this.msg('bookSearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        value={filters.ownerCode}
        onChange={this.handleOwnerChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部经营单位</Option>
        {partners.map(pt => (<Option key={pt.id} value={pt.id}>{pt.name}</Option>))}
      </Select>
    </span>);
    return (
      <Layout>
        <PageHeader >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="blbook" action="create">
              <ToolbarAction primary icon="plus" label={this.msg('create')} onClick={this.handleShowCreateBookModal} />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={bookListLoading}
          />
          <CreateBookModal />
          <SendSwJG2FileModal reload={this.handleListReload} />
          <SasDeclMsgModal reload={this.handleListReload} />
        </Content>
      </Layout>
    );
  }
}
