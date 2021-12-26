import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, Select, Tag, message, DatePicker, Button, Icon, Menu, Tooltip, Modal } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { BOND_INVT_TYPE, SW_JG2_SENDTYPE, SASBL_REG_TYPES, SASBL_DECTYPE } from 'common/constants';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { loadInvtList, createPassPort, showSendSwJG2File, toggleSasDeclMsgModal, revertRegSend, delDisSasblReg } from 'common/reducers/cwmSasblReg';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import SasDeclMsgModal from '../common/modals/sasDeclMsgModal';
import SasblRegStatus from '../common/sasblRegStatus';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    filters: state.cwmSasblReg.invtFilters,
    invtList: state.cwmSasblReg.invtList,
    listLoading: state.cwmSasblReg.listLoading,
  }),
  {
    loadInvtList,
    toggleBizDock,
    createPassPort,
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
export default class BondedInventoryRegList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    disabledReasons: '',
  }
  componentDidMount() {
    const { supType, ieType } = this.props.params;
    const filters = { ...this.props.filters, sasbl_biztype: supType, invt_ioflag: ieType };
    this.handleinvtListLoad(1, null, filters);
  }
  componentWillReceiveProps(nextprops) {
    const { supType, ieType } = nextprops.params;
    const whseCode = nextprops.whse && nextprops.whse.code;
    const filters = { ...this.props.filters, sasbl_biztype: supType, invt_ioflag: ieType };
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handleinvtListLoad(1, whseCode, filters);
    } else if (supType !== this.props.params.supType || ieType !== this.props.params.ieType) {
      this.handleinvtListLoad(1, null, filters);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleinvtListLoad(1, null, filters);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    width: 180,
    dataIndex: 'pre_sasbl_seqno',
    render: (o, record) => o || record.cop_invt_no,
  }, {
    title: this.msg('invtNo'),
    width: 180,
    dataIndex: 'invt_no',
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('invtStatus'),
    dataIndex: 'invt_status',
    width: 100,
    render: (o, record) => <SasblRegStatus sasblReg={record} statusCode={o} />,
  }, {
    title: this.msg('verifyFlag'),
    width: 100,
    dataIndex: 'verify_flag',
    render: (o) => {
      if (o === 1) {
        return (<Tag>未核扣</Tag>);
      } else if (o === 2) {
        return (<Tag color="blue" >预核扣</Tag>);
      } else if (o === 3) {
        return (<Tag color="green" >已核扣</Tag>);
      }
      return '';
    },
  }, {
    title: this.msg('blbookNo'),
    dataIndex: 'blbook_no',
    width: 130,
    render: o => <a onClick={() => this.showBlBookPanel(o)}>{o}</a>,
  }, {
    title: this.msg('cusdeclType'),
    width: 90,
    dataIndex: 'cusdecl_type',
    render: (o, record) => {
      if (record.cusdecl_flag === 1) {
        if (o === '1') {
          return '关联报关';
        } else if (o === '2') {
          return '对应报关';
        }
      } else if (record.cusdecl_flag === 2) {
        return '非报关';
      }
      return '';
    },
  }, {
    title: this.msg('entryId'),
    dataIndex: 'entry_no',
    width: 200,
    render: (o, record) => {
      if (record.cusdecl_type === '1') {
        return (<a onClick={() => this.showDeclarationPanel(record.rlt_pre_entry_seq_no)} >
          {record.rlt_entry_no || record.rlt_pre_entry_seq_no}
        </a>);
      }
      return (<a onClick={() => this.showDeclarationPanel(record.pre_entry_seq_no)} >
        {record.entry_no || record.pre_entry_seq_no}
      </a>);
    },
  }, {
    title: this.msg('entryStatus'),
    dataIndex: 'entry_status',
    width: 80,
    render: (o) => {
      if (o === 1) {
        return <Tag color="green">已放行</Tag>;
      } else if (o === 0) {
        return <Tag>未放行</Tag>;
      }
      return '';
    },
  }, {
    title: this.msg('passportUsed'),
    dataIndex: 'passport_used',
    width: 100,
    render: (o) => {
      if (o === 1) {
        return <Tag>未生成</Tag>;
      } else if (o === 2) {
        return <Tag color="orange">部分生成</Tag>;
      } else if (o === 3) {
        return <Tag color="green">完全生成</Tag>;
      }
      return '';
    },
  }, {
    title: this.msg('ownerName'),
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('invtBiztype'),
    width: 100,
    dataIndex: 'invt_biztype',
    render: (o) => {
      const bizType = BOND_INVT_TYPE.filter(type => type.value === o)[0];
      return bizType && <Tag color="blue">{bizType.text}</Tag>;
    },
  }, {
    title: this.msg('decType'),
    dataIndex: 'invt_dectype',
    width: 80,
    render: (o) => {
      const decType = SASBL_DECTYPE.filter(dec => dec.value === o)[0];
      return decType ? decType.text : '';
    },
  }, {
    title: this.msg('invtDeclDate'),
    dataIndex: 'invt_decl_date',
    width: 140,
    render: dt => dt && moment(dt).format('YYYY.MM.DD HH:mm'),
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
      if (record.invt_status === 1) {
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
                    <Menu.Item disabled={record.invt_ioflag === 2} key="deldis"><Icon type="delete" />{this.msg('delete')}</Menu.Item>}
                </Menu>}
              row={record}
            />
          </span>
        );
      } else if (record.invt_status === 3) {
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
    fetcher: params => this.props.loadInvtList(params),
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
    remotes: this.props.invtList,
  })
  handleinvtListLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, invtList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    this.props.loadInvtList({
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
      copNo: row.cop_invt_no,
      agentCode: row.declarer_scc_code,
      regType: 'invt',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: row.invt_dectype,
    });
  }
  handleDetail = (row) => {
    const link = `/cwm/sasbl/invtreg/${this.props.params.supType}/${this.props.params.ieType}/${row.cop_invt_no}`;
    this.context.router.push(link);
  }
  showDeclarationPanel = (preEntrySeqNo) => {
    this.props.toggleBizDock('cmsDeclaration', { preEntrySeqNo });
  }
  showBlBookPanel = (blBookNo) => {
    const blBook = { blbook_no: blBookNo };
    this.props.toggleBizDock('cwmBlBook', { blBook });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.handleinvtListLoad(1, null, filters);
  }
  handleSearch = (search) => {
    const filters = { ...this.props.filters, search };
    this.handleinvtListLoad(1, null, filters);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, invt_status: key };
    this.handleinvtListLoad(1, null, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleCreatePassport = () => {
    const { selectedRowKeys } = this.state;
    const { supType, ieType } = this.props.params;
    const whseCode = this.props.whse.code;
    this.props.createPassPort({
      ioFlag: ieType,
      supType,
      whseCode,
      regType: 'invt',
      regIds: selectedRowKeys,
    }).then((result) => {
      if (!result.error) {
        this.context.router.push(`/cwm/sasbl/passport/${supType}/${ieType}`);
        this.context.router.push(`/cwm/sasbl/passport/${supType}/${ieType}/${result.data}`);
        message.success(this.msg('操作成功'));
      } else {
        message.error(this.msg('创建失败'), 10);
      }
    });
  }
  handleRowSelectionChange = (selectedRowKeyList, selectedRows) => {
    let disabledReasons;
    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      if (row.invt_status !== 4) {
        disabledReasons = '存在审批未通过的核注清单';
        break;
      } else if (row.passport_used === 3) {
        disabledReasons = '存在已生成核放单的核注清单';
        break;
      }
    }
    if (!disabledReasons) {
      const bookNos = Array.from(new Set(selectedRows.map(row => row.blbook_no)));
      if (bookNos.length > 1) {
        disabledReasons = '存在不同物流账册下的出入库单';
      }
    }
    this.setState({
      selectedRowKeys: selectedRowKeyList,
      disabledReasons,
    });
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_invt_no, sasRegType: key });
    } else if (key === 'back') {
      this.props.revertRegSend(record.cop_invt_no, 'invt').then((result) => {
        if (!result.error) {
          this.handleinvtListLoad();
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
      if (record.invt_ioflag === 1) {
        Modal.confirm({
          title: `${text}${this.msg('invtReg')}《${record.cop_invt_no}》`,
          content: this.msg('deleteConfirmContent'),
          onOk: () => {
            this.props.delDisSasblReg(record.cop_invt_no, 'invt', actionType).then((result) => {
              if (!result.error) {
                this.handleinvtListLoad();
                message.success(this.msg('操作成功'));
              } else {
                message.error(result.error.message, 10);
              }
            });
          },
        });
      } else {
        message.error('出区核注清单不可进行该操作', 10);
      }
    }
  }
  render() {
    const {
      invtList, owners,
      filters, params,
    } = this.props;
    const { disabledReasons } = this.state;
    const { supType, ieType } = params;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = invtList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleRowSelectionChange,
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.search} placeholder={this.msg('invtListSearchPlaceHolder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.partnerId}
        onChange={this.handleOwnerSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all" >全部经营单位</Option>
        {owners.map(data => (<Option
          key={data.id}
          value={data.id}
        >{data.name}
        </Option>))}
      </Select>
      <RangePicker
        onChange={this.handleOnDateChange}
        value={dateVal}
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
      />
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'pendinng', icon: 'file-unknown', name: this.msg('pendinng') },
      { elementKey: 'declaring', icon: 'file-sync', name: this.msg('declaring') },
      { elementKey: 'approved', icon: 'file-done', name: this.msg('approved') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.invt_status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    const bulkActions = (<PrivilegeCover module="cwm" feature="supervision" action="create">
      {disabledReasons ? <Tooltip title={disabledReasons}>
        <Button
          disabled
          icon="exclamation"
          onClick={this.handleCreatePassport}
        >
        新建核放单
        </Button>
      </Tooltip> :
      <Button
        icon="check-circle-o"
        onClick={this.handleCreatePassport}
      >
      新建核放单
      </Button>}
    </PrivilegeCover>);
    const iePrefix = ieType === 'e' ? this.msg('sasOut') : this.msg('sasIn');
    const sasblRegType = SASBL_REG_TYPES.find(item => item.value === supType);
    const bizPrefix = sasblRegType ? sasblRegType.ftztext : '';
    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[bizPrefix, iePrefix, this.msg('invtReg')]}
          dropdownMenu={dropdownMenu}
        />
        <PageContent>
          <DataTable
            defaultExpandAllRows
            bulkActions={bulkActions}
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            indentSize={0}
            rowKey="id"
            rowClassName={record => (record.invt_status === -1 ? 'table-row-disabled' : '')}
            loading={this.props.listLoading}
          />
        </PageContent>
        <SendSwJG2FileModal reload={this.handleinvtListLoad} />
        <SasDeclMsgModal reload={this.handleinvtListLoad} />
      </Layout>
    );
  }
}
