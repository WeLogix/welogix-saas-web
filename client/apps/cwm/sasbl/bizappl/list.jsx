import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, message, DatePicker, Button, Tag, Select, Menu, Icon, Modal } from 'antd';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { PASSPORT_BIZTYPE, SW_JG2_SENDTYPE, SASBL_REG_TYPES, BAPPL_DECTYPE } from 'common/constants';
import UserAvatar from 'client/components/UserAvatar';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { loadStockioList, showCreateBatDeclModal, loadBizApplList, showCreateBizApplModal, revertRegSend, toggleSasDeclMsgModal, showSendSwJG2File, delDisSasblReg } from 'common/reducers/cwmSasblReg';
import { showTransferInModal } from 'common/reducers/cwmShFtz';
import CreateBizApplModal from './modals/createBizApplModal';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import SasDeclMsgModal from '../common/modals/sasDeclMsgModal';
import SasblRegStatus from '../common/sasblRegStatus';
import { formatMsg } from '../message.i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    whse: state.cwmContext.defaultWhse,
    filters: state.cwmSasblReg.bizApplFilters,
    bizApplList: state.cwmSasblReg.bizApplList,
    reload: state.cwmSasblReg.bizApplreload,
    loading: state.cwmSasblReg.bizApplLoading,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  {
    loadStockioList,
    toggleBizDock,
    showTransferInModal,
    showCreateBatDeclModal,
    loadBizApplList,
    showCreateBizApplModal,
    revertRegSend,
    toggleSasDeclMsgModal,
    showSendSwJG2File,
    delDisSasblReg,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class BizApplList extends React.Component {
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
    const { supType, ieType } = this.props.params;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    this.handleBizApplListLoad(this.props.bizApplList.current, null, filters);
  }
  componentWillReceiveProps(nextprops) {
    const { supType, ieType } = nextprops.params;
    const whseCode = nextprops.whse && nextprops.whse.code;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handleBizApplListLoad(1, whseCode, filters);
    } else if (supType !== this.props.params.supType || ieType !== this.props.params.ieType) {
      this.handleBizApplListLoad(1, null, filters);
    }
    if (nextprops.reload && nextprops.reload !== this.props.reload) {
      this.handleBizApplListLoad(1, null, filters);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleBizApplListLoad(1, null, filters);
  }
  handleShowBlBookPanel = (blBookNo) => {
    const blBook = { blbook_no: blBookNo };
    this.props.toggleBizDock('cwmBlBook', { blBook });
  }
  showAddStockIoModal = () => this.props.showAddStockIoModal(true)
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    width: 180,
    dataIndex: 'pre_sasbl_seqno',
    render: (o, record) => o || record.cop_bappl_no,
  }, {
    title: this.msg('sasblApplyNo'),
    width: 180,
    dataIndex: 'bappl_no',
  }, {
    title: this.msg('stockBiztype'),
    dataIndex: 'bappl_biztype',
    width: 120,
    render: (o) => {
      const type = PASSPORT_BIZTYPE.find(obj => obj.value === o);
      if (type) {
        return type.text;
      }
      return '';
    },
  }, {
    title: this.msg('ioflag'),
    dataIndex: 'bappl_ioflag',
    width: 100,
    render: (o) => {
      if (o === 1) {
        return <Tag color="blue">{this.msg('sasIn')}</Tag>;
      }
      return <Tag color="blue">{this.msg('sasOut')}</Tag>;
    },
  }, {
    title: this.msg('decType'),
    dataIndex: 'bappl_dectype',
    width: 80,
    render: (o) => {
      const decType = BAPPL_DECTYPE.filter(dec => dec.value === o)[0];
      return decType ? decType.text : '';
    },
  }, {
    title: this.msg('invtStatus'),
    width: 180,
    dataIndex: 'bappl_status',
    render: (o, record) => <SasblRegStatus sasblReg={record} statusCode={o} />,
  }, {
    title: this.msg('blbookNo'),
    dataIndex: 'blbook_no',
    width: 130,
    render: o => <a onClick={() => this.handleShowBlBookPanel(o)}>{o}</a>,
  }, {
    title: this.msg('areaOwner'),
    width: 200,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('declDate'),
    width: 140,
    dataIndex: 'bappl_decl_date',
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('createdDate'),
    width: 140,
    dataIndex: 'created_date',
    render: dt => dt && moment(dt).format('YYYY.MM.DD'),
  }, {
    title: this.msg('createdBy'),
    width: 140,
    dataIndex: 'created_by',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => {
      if (record.bappl_status === 1) {
        return (
          <span>
            {record.sent_status === 0 ? <RowAction onClick={this.handleDetail} icon="form" tooltip={this.msg('modify')} row={record} /> :
            <RowAction onClick={this.handleDetail} icon="eye-o" tooltip={this.msg('view')} row={record} />}
            {record.sent_status === 0 && <RowAction onClick={this.handleSendMsg} icon="mail" tooltip={this.msg('sendMsg')} row={record} />}
            <RowAction
              overlay={
                <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                  <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                  <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
                  {record.sent_status !== 0 ?
                    <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item> :
                    <Menu.Item key="deldis"><Icon type="delete" />{this.msg('delete')}</Menu.Item>}
                </Menu>}
              row={record}
            />
          </span>
        );
      } else if (record.bappl_status === 3) {
        return (
          <span>
            {record.sent_status === 0 ? <RowAction onClick={this.handleDetail} icon="form" tooltip={this.msg('modify')} row={record} /> :
            <RowAction onClick={this.handleDetail} icon="eye-o" tooltip={this.msg('view')} row={record} />}
            {record.sent_status === 0 && <RowAction onClick={this.handleSendMsg} icon="reload" tooltip={this.msg('resendMsg')} row={record} />}
            <RowAction
              overlay={
                <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                  <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                  <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
                  {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
                  {record.sent_status !== 1 && <Menu.Item key="deldis"><Icon type="stop" />{this.msg('作废')}</Menu.Item>}
                </Menu>}
              row={record}
            />
          </span>
        );
      }
      return (<span>
        <RowAction onClick={this.handleDetail} icon="eye-o" tooltip={this.msg('view')} row={record} />
        <RowAction
          overlay={
            <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
              <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
              <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
            </Menu>}
          row={record}
        />
      </span>);
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBizApplList(params),
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
        currentPage: pagination.current,
        whseCode: this.props.whse.code,
      };
      const filters = { ...this.props.filters };
      params.filters = filters;
      return params;
    },
    remotes: this.props.bizApplList,
  })
  handleBizApplListLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, bizApplList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    newfilter.ioFlag = this.context.router.params.ieType;
    this.props.loadBizApplList({
      filters: newfilter,
      pageSize,
      currentPage: currentPage || current,
      whseCode: whsecode || whse.code,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/cwm/sasbl/bizappl/${this.props.params.supType}/${this.props.params.ieType}/${row.cop_bappl_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_bappl_no, sasRegType: key });
    } else if (key === 'back') {
      this.props.revertRegSend(record.cop_bappl_no, 'bappl').then((result) => {
        if (!result.error) {
          this.handleBizApplListLoad();
        }
      });
    } else if (key === 'deldis') {
      let actionType;
      let text;
      if (record.bappl_status === 1) {
        actionType = 'del';
        text = this.msg('deleteConfirmTitle');
      } else if (record.bappl_status === 3) {
        actionType = 'dis';
        text = this.msg('disableConfirmTitle');
      }
      Modal.confirm({
        title: `${text}${this.msg('bizAppl')}《${record.cop_bappl_no}》`,
        content: this.msg('deleteConfirmContent'),
        onOk: () => {
          this.props.delDisSasblReg(record.cop_bappl_no, 'bappl', actionType).then((result) => {
            if (!result.error) {
              this.handleBizApplListLoad();
              message.success(this.msg('操作成功'));
            } else {
              message.error(result.error.message, 10);
            }
          });
        },
      });
    }
  }
  handleSendMsg = (row) => {
    this.props.showSendSwJG2File({
      visible: true,
      copNo: row.cop_bappl_no,
      agentCode: row.declarer_scc_code,
      regType: 'bappl',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: row.bappl_dectype,
    });
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.handleBizApplListLoad(1, null, filters);
  }
  handleBizApplSearch = (bizApplSearch) => {
    const filters = { ...this.props.filters, bizApplSearch };
    this.handleBizApplListLoad(1, null, filters);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, applStatus: key };
    this.handleBizApplListLoad(1, null, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleShowCreateModal = () => {
    this.props.showCreateBizApplModal({ visible: true });
  }
  render() {
    const {
      bizApplList, filters, loading, owners, params: { ieType, supType },
    } = this.props;
    let dateVal = [];
    if (filters.startDate && filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = bizApplList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.bizApplSearch} placeholder={this.msg('bizApplListPlaceHolder')} onSearch={this.handleBizApplSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.partnerId}
        onChange={this.handleOwnerSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all" >全部区内企业</Option>
        {owners.map(data => (<Option
          key={data.id}
          value={data.id}
        >{data.partner_code && data.partner_code} | {data.name}
        </Option>))}
      </Select>
      <RangePicker
        onChange={this.handleOnDateChange}
        value={dateVal}
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'pending', icon: 'file-unknown', name: this.msg('pendinng') },
      { elementKey: 'revising', icon: 'file-sync', name: this.msg('revising') },
      { elementKey: 'declaring', icon: 'file-sync', name: this.msg('declaring') },
      { elementKey: 'approved', icon: 'file-done', name: this.msg('approved') },
      { elementKey: 'closed', icon: 'file-close', name: this.msg('closed') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.applStatus,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    const iePrefix = ieType === 'e' ? this.msg('sasOut') : this.msg('sasIn');
    const sasblRegType = SASBL_REG_TYPES.find(item => item.value === supType);
    const bizPrefix = sasblRegType ? sasblRegType.ftztext : '';
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[bizPrefix, iePrefix, this.msg('bizAppl')]}
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button type="primary" icon="plus" onClick={this.handleShowCreateModal}>
                {this.msg('newBizAppl')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            indentSize={0}
            rowKey="id"
            rowClassName={record => (record.bappl_status === -1 ? 'table-row-disabled' : '')}
            loading={loading}
          />
        </PageContent>
        <CreateBizApplModal />
        <SendSwJG2FileModal reload={this.handleBizApplListLoad} />
        <SasDeclMsgModal reload={this.handleBizApplListLoad} />
      </Layout>
    );
  }
}
