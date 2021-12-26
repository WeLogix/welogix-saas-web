import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, message, DatePicker, Tag, Select, Menu, Icon, Tooltip, Modal } from 'antd';
import { PASSPORT_BIZTYPE, SW_JG2_SENDTYPE, SASBL_REG_TYPES, SASBL_DECTYPE } from 'common/constants';
import UserAvatar from 'client/components/UserAvatar';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { showCreateBatDeclModal, loadPassportList, showSendSwJG2File, toggleSasDeclMsgModal, revertRegSend, delDisSasblReg } from 'common/reducers/cwmSasblReg';
import { showTransferInModal } from 'common/reducers/cwmShFtz';
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
    filters: state.cwmSasblReg.passportFilters,
    passportList: state.cwmSasblReg.passportList,
    reload: state.cwmSasblReg.bdreload,
    loading: state.cwmSasblReg.bdLoading,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  {
    toggleBizDock,
    showTransferInModal,
    showCreateBatDeclModal,
    loadPassportList,
    showSendSwJG2File,
    toggleSasDeclMsgModal,
    revertRegSend,
    delDisSasblReg,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class PassportRegList extends React.Component {
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
    this.handlePassportListLoad(this.props.passportList.current, null, filters);
  }
  componentWillReceiveProps(nextprops) {
    const { supType, ieType } = nextprops.params;
    const whseCode = nextprops.whse && nextprops.whse.code;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handlePassportListLoad(1, whseCode, filters);
    } else if (supType !== this.props.params.supType || ieType !== this.props.params.ieType) {
      this.handlePassportListLoad(1, null, filters);
    }
    if (nextprops.reload && nextprops.reload !== this.props.reload) {
      this.handlePassportListLoad(1, null, filters);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handlePassportListLoad(1, null, filters);
  }
  showAddStockIoModal = () => this.props.showAddStockIoModal(true)
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    width: 180,
    dataIndex: 'pre_sasbl_seqno',
    render: (o, record) => o || record.cop_pass_no,
  }, {
    title: this.msg('passportNo'),
    width: 240,
    dataIndex: 'pass_no',
  }, {
    title: this.msg('bindType'),
    width: 100,
    dataIndex: 'pass_bindtype',
    render: (o) => {
      switch (o) {
        case 1:
          return this.msg('oneCarManyOrders');
        case 2:
          return this.msg('oneCarOneOrders');
        case 3:
          return this.msg('manyCarsOneOrders');
        default:
          return '';
      }
    },
  }, {
    title: this.msg('rltRegNo'),
    width: 200,
    dataIndex: 'pass_rlt_regno',
    render: (o, record) => {
      if (record.pass_bindtype === 1) {
        return <Tooltip title={o} overlayStyle={{ width: 185 }}>{o}</Tooltip>;
      }
      return o;
    },
  }, {
    title: this.msg('decType'),
    dataIndex: 'pass_dectype',
    width: 80,
    render: (o) => {
      const decType = SASBL_DECTYPE.filter(dec => dec.value === o)[0];
      return decType ? decType.text : '';
    },
  }, {
    title: this.msg('invtStatus'),
    width: 150,
    dataIndex: 'pass_status',
    render: (o, record) => <SasblRegStatus sasblReg={record} statusCode={o} />,
  }, {
    title: this.msg('ioflag'),
    dataIndex: 'pass_ioflag',
    width: 100,
    render: (o) => {
      if (o === 1) {
        return <Tag color="blue">{this.msg('sasIn')}</Tag>;
      }
      return <Tag color="blue">{this.msg('sasOut')}</Tag>;
    },
  }, {
    title: this.msg('passportBiztype'),
    dataIndex: 'pass_biztype',
    width: 150,
    render: (o) => {
      const type = PASSPORT_BIZTYPE.find(obj => obj.value === o);
      if (type) {
        return type.text;
      }
      return '';
    },
  }, {
    title: this.msg('checkPointPassed'),
    width: 120,
    dataIndex: '-',
  }, {
    title: this.msg('areaOwner'),
    width: 140,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('declDate'),
    width: 140,
    dataIndex: 'pp_decl_date',
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
      if (record.pass_status === 1) {
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
      } else if (record.pass_status === 3) {
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
    fetcher: params => this.props.loadPassportList(params),
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
    remotes: this.props.passportList,
  })
  handlePassportListLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, passportList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    newfilter.ioFlag = this.context.router.params.ieType;
    this.props.loadPassportList({
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
  handleSendMsg = (row) => {
    this.props.showSendSwJG2File({
      visible: true,
      copNo: row.cop_pass_no,
      agentCode: row.declarer_scc_code,
      regType: 'pass',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: row.pass_dectype,
    });
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_pass_no, sasRegType: key });
    } else if (key === 'back') {
      this.props.revertRegSend(record.cop_pass_no, 'pass').then((result) => {
        if (!result.error) {
          this.handlePassportListLoad();
        }
      });
    } else if (key === 'deldis') {
      let actionType;
      let text;
      if (record.invt_status === 1) {
        actionType = 'del';
        text = this.msg('deleteConfirmTitle');
      } else if (record.invt_status === 3) {
        actionType = 'dis';
        text = this.msg('disableConfirmTitle');
      }
      Modal.confirm({
        title: `${text}${this.msg('passport')}《${record.cop_pass_no}》`,
        content: this.msg('deleteConfirmContent'),
        onOk: () => {
          this.props.delDisSasblReg(record.cop_pass_no, 'pass', actionType).then((result) => {
            if (!result.error) {
              this.handlePassportListLoad();
              message.success(this.msg('操作成功'));
            } else {
              message.error(result.error.message, 10);
            }
          });
        },
      });
    }
  }
  handleDetail = (row) => {
    const link = `/cwm/sasbl/passport/${this.props.params.supType}/${this.props.params.ieType}/${row.cop_pass_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.handlePassportListLoad(1, null, filters);
  }
  handlepassSearch = (passSearch) => {
    const filters = { ...this.props.filters, passSearch };
    this.handlePassportListLoad(1, null, filters);
  }
  handleInvtSearch = (invtSearch) => {
    const filters = { ...this.props.filters, invtSearch };
    this.handlePassportListLoad(1, null, filters);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, passStatus: key };
    this.handlePassportListLoad(1, null, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleCreateBatchDecl = () => {
    this.props.showCreateBatDeclModal({ visible: true });
  }
  render() {
    const {
      passportList, filters, loading, owners,
    } = this.props;
    const { ieType, supType } = this.props.params;
    let dateVal = [];
    if (filters.startDate && filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = passportList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.passSearch} placeholder={this.msg('passListPlaceHolder')} onSearch={this.handlepassSearch} />
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
        >{[data.partner_code, data.name].filter(p => p).join(' | ')}
        </Option>))}
      </Select>
      <RangePicker
        onChange={this.handleOnDateChange}
        value={dateVal}
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'pendinng', icon: 'file-unknown', name: this.msg('pendinng') },
      { elementKey: 'declaring', icon: 'file-sync', name: this.msg('declaring') },
      { elementKey: 'approved', icon: 'file-done', name: this.msg('approved') },
      { elementKey: 'cancelled', icon: 'file-done', name: this.msg('canceled') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.passStatus,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    const iePrefix = ieType === 'e' ? this.msg('sasOut') : this.msg('sasIn');
    const sasblRegType = SASBL_REG_TYPES.find(item => item.value === supType);
    const bizPrefix = sasblRegType ? sasblRegType.ftztext : '';
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[bizPrefix, iePrefix, this.msg('passport')]}
          dropdownMenu={dropdownMenu}
        />
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
            rowClassName={record => (record.pass_status === -1 ? 'table-row-disabled' : '')}
            loading={loading}
          />
        </PageContent>
        <SendSwJG2FileModal reload={this.handlePassportListLoad} />
        <SasDeclMsgModal reload={this.handlePassportListLoad} />
      </Layout>
    );
  }
}
