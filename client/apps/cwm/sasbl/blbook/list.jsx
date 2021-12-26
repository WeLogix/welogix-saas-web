import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Icon, Layout, Menu, Modal, Select, message, Tooltip, Tag } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import UserAvatar from 'client/components/UserAvatar';
import connectNav from 'client/common/decorators/connect-nav';
import { showCreateBookModal, loadBlBooks, deleteBlBook } from 'common/reducers/cwmBlBook';
import { showSendSwJG2File, toggleSasDeclMsgModal, revertRegSend } from 'common/reducers/cwmSasblReg';
import { BLBOOK_STATUS, BLBOOK_TYPE, SW_JG2_SENDTYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import CreateBookModal from './modals/createBookModal'; // 2
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import SasDeclMsgModal from '../common/modals/sasDeclMsgModal';
import WhseSelect from '../../common/whseSelect';
import { formatMsg } from './message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    filters: state.cwmBlBook.listFilters,
    blbookList: state.cwmBlBook.blbookList,
    blbookListLoading: state.cwmBlBook.blbookList.blbookListLoading,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  {
    loadBlBooks,
    showCreateBookModal,
    deleteBlBook,
    toggleBizDock,
    toggleSasDeclMsgModal,
    showSendSwJG2File,
    revertRegSend,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmBlBook',
})
export default class BLBookList extends React.Component {
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
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.defaultWhse.code !== nextProps.defaultWhse.code && nextProps.defaultWhse.code) {
      this.handleListReload(nextProps.defaultWhse.code);
    }
  }
  handleBlBookSend = (row) => {
    this.props.showSendSwJG2File({
      visible: true,
      copNo: row.cop_manual_no,
      agentCode: row.declarer_scc_code,
      regType: 'book',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: row.declarer_type,
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    dataIndex: 'cop_manual_no',
    width: 140,
  }, {
    title: this.msg('blbookNo'),
    width: 150,
    dataIndex: 'blbook_no',
    render: (o, record) => <a onClick={() => this.handleShowBlBookPanel(record)}>{o}</a>,
  }, {
    title: this.msg('blbookType'),
    width: 180,
    dataIndex: 'blbook_type',
    render: (o) => {
      const blBookType = BLBOOK_TYPE.filter(type => type.value === o)[0];
      return blBookType && blBookType.text;
    },
  }, {
    title: this.msg('blbookStatus'),
    dataIndex: 'blbook_status',
    width: 120,
    render: (o, record) => {
      const statusKey = Object.keys(BLBOOK_STATUS).filter(as => BLBOOK_STATUS[as].value === o)[0];
      if (record.sent_status === 2) {
        return (<span>
          {statusKey &&
            <Tooltip title={BLBOOK_STATUS[statusKey].text}>
              <Badge status={BLBOOK_STATUS[statusKey].badge} />
            </Tooltip>}
          <Tooltip title={record.receipt_err_msg}><Tag color="red">发送失败</Tag></Tooltip>
        </span>);
      } else if (record.sent_status === 1) {
        return (<span>
          {statusKey &&
            <Tooltip title={BLBOOK_STATUS[statusKey].text}>
              <Badge status={BLBOOK_STATUS[statusKey].badge} />
            </Tooltip>}
          <Tag color="green">发送中</Tag>
        </span>);
      } else if (statusKey) {
        return (<Badge
          status={BLBOOK_STATUS[statusKey].badge}
          text={BLBOOK_STATUS[statusKey].text}
        />);
      }
      return '';
    },
  }, {
    title: this.msg('owner'),
    dataIndex: 'owner_name',
    width: 200,
  }, {
    title: this.msg('remark'),
    dataIndex: 'blbook_note',
    width: 100,
  }, {
    title: this.msg('blbookExpirayDate'),
    dataIndex: 'blbook_expiray_date',
    width: 120,
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('blbookApprovedDate'),
    dataIndex: 'blbook_approved_date',
    width: 120,
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('blbookAlterDate'),
    dataIndex: 'blbook_alter_date',
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
      if (record.blbook_type === 'IK' || record.blbook_type === 'K') {
        if (record.blbook_status === 4) {
          return (
            <span>
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
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
        }
      } else {
        switch (record.blbook_status) {
          case BLBOOK_STATUS.PENDING.value: // 未备案
            return (
              <span>
                <PrivilegeCover module="cwm" feature="blbook" action="edit">
                  {record.sent_status === 0 && <RowAction onClick={this.handleBlBookSend} icon="mail" tooltip={this.msg('sendMsg')} row={record} />}
                  <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} />
                </PrivilegeCover>
                <PrivilegeCover module="cwm" feature="blbook" action="delete">
                  <RowAction
                    overlay={
                      <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                        <Menu.Item key="delete"><Icon type="delete" />{this.msg('delete')}</Menu.Item>
                        {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
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
                  {record.sent_status === 0 && <RowAction onClick={this.handleBlBookSend} icon="mail" tooltip={this.msg('变更申报')} row={record} />}
                  <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} />
                </PrivilegeCover>
                <RowAction
                  overlay={
                    <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                      <PrivilegeCover module="cwm" feature="blbook" action="edit">
                        {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
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
                  {record.sent_status === 0 ? <RowAction onClick={this.handleModify} icon="edit" tooltip={this.msg('modify')} row={record} /> :
                  <RowAction onClick={this.handleModify} icon="eye-o" tooltip={this.msg('view')} row={record} />}
                  {record.sent_status === 0 && <RowAction onClick={this.handleBlBookSend} icon="reload" tooltip={this.msg('resendMsg')} row={record} />}
                </PrivilegeCover>
                <RowAction
                  overlay={
                    <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                      <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                      {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
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
      }
      return '';
    },
  }]
  handleShowCreateBookModal = () => {
    this.props.showCreateBookModal(true);
  }
  handleShowBlBookPanel = (blBook) => {
    this.props.toggleBizDock('cwmBlBook', { blBook });
  }
  handleModify = (row) => {
    const link = `/cwm/blbook/${row.id}`;
    this.context.router.push(link);
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
    this.props.deleteBlBook(record.cop_manual_no).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('删除成功');
        this.handleListReload();
      }
    });
  }
  handleListReload = (whseCode, filters, current) => {
    this.props.loadBlBooks({
      whseCode: whseCode || this.props.defaultWhse.code,
      pageSize: this.props.blbookList.pageSize,
      current: current || this.props.blbookList.current,
      filters: filters || this.props.filters,
    });
  }

  handleWhseChange = (value) => {
    this.handleListReload(value);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, blbook_status: key };
    this.handleListReload(null, filters, 1);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleOwnerChange = (value) => {
    const filters = { ...this.props.filters, ownerCode: value };
    this.handleListReload(null, filters, 1);
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, searchFields: value };
    this.handleListReload(null, filters, 1);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      defaultWhse, owners, filters, blbookListLoading,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadBlBooks(params),
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
          whseCode: this.props.defaultWhse.code,
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters: newfilters,
        };
        return params;
      },
      remotes: this.props.blbookList,
    });
    let { columns } = this;
    if (!defaultWhse.bonded) {
      columns = [...columns];
      columns.splice(6, 1);
    }
    const toolbarActions = (<span>
      <SearchBox value={filters.searchFields} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.ownerCode}
        onChange={this.handleOwnerChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部经营单位</Option>
        {owners.map(owner => (<Option key={owner.id} value={owner.id}>{owner.name}</Option>))}
      </Select>
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'all', name: this.msg('all') },
      { elementKey: 'pendinng', icon: 'file-unknown', name: this.msg('pendinng') },
      { elementKey: 'declaring', icon: 'file-sync', name: this.msg('declaring') },
      { elementKey: 'approved', icon: 'file-done', name: this.msg('approved') },
      { elementKey: 'revising', icon: 'file-exclamation', name: this.msg('revising') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.blbook_status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[
            <WhseSelect onChange={this.handleWhseChange} bonded />,
          ]}
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="blbook" action="create">
              <ToolbarAction primary icon="plus" label={this.msg('create')} onClick={this.handleShowCreateBookModal} />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={blbookListLoading}
          />
          <CreateBookModal />
          <SendSwJG2FileModal reload={this.handleListReload} />
          <SasDeclMsgModal reload={this.handleListReload} />
        </PageContent>
      </Layout>
    );
  }
}
