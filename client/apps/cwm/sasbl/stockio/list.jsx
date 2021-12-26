import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, Select, Tag, message, DatePicker, Menu, Icon, Button, Tooltip } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { SW_JG2_SENDTYPE, SASBL_REG_TYPES, SASBL_DECTYPE } from 'common/constants';
import { loadStockioList, createPassPort, toggleSasDeclMsgModal, showSendSwJG2File, revertRegSend } from 'common/reducers/cwmSasblReg';
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
    filters: state.cwmSasblReg.stockFilters,
    stockList: state.cwmSasblReg.stockList,
    listLoading: state.cwmSasblReg.listLoading,
  }),
  {
    loadStockioList,
    toggleBizDock,
    createPassPort,
    toggleSasDeclMsgModal,
    showSendSwJG2File,
    revertRegSend,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class BondedStockIoList extends React.Component {
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
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    this.handleStockioListLoad(1, null, filters);
  }
  componentWillReceiveProps(nextprops) {
    const { supType, ieType } = nextprops.params;
    const whseCode = nextprops.whse && nextprops.whse.code;
    const filters = { ...this.props.filters, sasbl_biztype: supType, stock_ioflag: ieType };
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handleStockioListLoad(1, whseCode, filters);
    } else if (supType !== this.props.params.supType || ieType !== this.props.params.ieType) {
      this.handleStockioListLoad(1, null, filters);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleStockioListLoad(1, null, filters);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    width: 180,
    dataIndex: 'pre_sasbl_seqno',
    render: (o, record) => o || record.cop_stock_no,
  }, {
    title: this.msg('stockNo'),
    width: 180,
    dataIndex: 'stock_no',
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('decType'),
    dataIndex: 'stock_dectype',
    width: 80,
    render: (o) => {
      const decType = SASBL_DECTYPE.filter(dec => dec.value === o)[0];
      return decType ? decType.text : '';
    },
  }, {
    title: this.msg('invtStatus'),
    dataIndex: 'stock_status',
    width: 100,
    render: (o, record) => <SasblRegStatus sasblReg={record} statusCode={o} />,
  }, {
    title: this.msg('stockIoflag'),
    width: 100,
    dataIndex: 'stock_ioflag',
    align: 'center',
    render: (o) => {
      if (o === 1) {
        return <Tag color="blue">{this.msg('sasIn')}</Tag>;
      }
      return <Tag color="blue">{this.msg('sasOut')}</Tag>;
    },
  }, {
    title: this.msg('sasblApplyNo'),
    dataIndex: 'sasbl_apply_no',
    width: 150,
  }, {
    title: this.msg('passportPrenoList'),
    width: 180,
    dataIndex: 'passport_preno_list',
  }, {
    title: this.msg('areaOwnerName'),
    width: 200,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('declDate'),
    dataIndex: 'stock_decl_date',
    width: 140,
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
      if (record.stock_status === 1) {
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
                  {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
                </Menu>}
              row={record}
            />
          </span>
        );
      } else if (record.stock_status === 3) {
        return (
          <span>
            {record.sent_status === 0 ? <RowAction onClick={this.handleDetail} icon="edit" tooltip={this.msg('modify')} row={record} /> :
            <RowAction onClick={this.handleDetail} icon="eye-o" tooltip={this.msg('view')} row={record} />}
            {record.sent_status === 0 && <RowAction onClick={this.handleSendMsg} icon="reload" tooltip={this.msg('resendMsg')} row={record} />}
            <RowAction
              overlay={
                <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                  <Menu.Item key="sent"><Icon type="eye" />{this.msg('viewSentMsg')}</Menu.Item>
                  <Menu.Item key="rec"><Icon type="eye" />{this.msg('viewRecMsg')}</Menu.Item>
                  {record.sent_status !== 0 && <Menu.Item key="back"><Icon type="rollback" />{this.msg('rollbackSent')}</Menu.Item>}
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
    fetcher: params => this.props.loadStockioList(params),
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
    remotes: this.props.stockList,
  })
  handleStockioListLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, stockList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    this.props.loadStockioList({
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
      copNo: row.cop_stock_no,
      agentCode: row.declarer_scc_code,
      regType: 'stock',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: row.stock_dectype,
    });
  }
  handleDetail = (row) => {
    const link = `/cwm/sasbl/stockio/${this.props.params.supType}/${this.props.params.ieType}/${row.cop_stock_no}`;
    this.context.router.push(link);
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_stock_no, sasRegType: key });
    } else if (key === 'back') {
      this.props.revertRegSend(record.cop_stock_no, 'stock').then((result) => {
        if (!result.error) {
          this.handleStockioListLoad();
        }
      });
    }
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.filters, partnerId: value };
    this.handleStockioListLoad(1, null, filters);
  }
  handleSearch = (search) => {
    const filters = { ...this.props.filters, search };
    this.handleStockioListLoad(1, null, filters);
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, stock_status: key };
    this.handleStockioListLoad(1, null, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleCreatePassPort = () => {
    const { selectedRowKeys } = this.state;
    const { supType, ieType } = this.props.params;
    const whseCode = this.props.whse.code;
    this.props.createPassPort({
      ioFlag: ieType,
      supType,
      whseCode,
      regType: 'stock',
      regIds: selectedRowKeys,
    }).then((result) => {
      if (!result.error) {
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
      if (row.stock_status !== 4) {
        disabledReasons = '存在审批未通过的出入库单';
        break;
      } else if (row.passport_used === 3) {
        disabledReasons = '存在已生成核放单的出入库单';
        break;
      }
    }
    if (!disabledReasons) {
      const applyNos = Array.from(new Set(selectedRows.map(row => row.sasbl_apply_no)));
      if (applyNos.length > 1) {
        disabledReasons = '存在不同申报表下的出入库单';
      }
    }
    this.setState({
      selectedRowKeys: selectedRowKeyList,
      disabledReasons,
    });
  }
  render() {
    const {
      stockList, owners, filters,
    } = this.props;
    const { disabledReasons } = this.state;
    const { supType, ieType } = this.props.params;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = stockList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleRowSelectionChange,
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.search} placeholder={this.msg('stockSearchPlaceHolder')} onSearch={this.handleSearch} />
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
          search={`${data.partner_code}${data.name}`}
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
      { elementKey: 'batched', icon: 'cluster', name: this.msg('batched') },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.stock_status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    // 可用条件: 1 状态全部是approved 2 货主全部一致
    const bulkActions = supType !== 'cosmtn' && (<PrivilegeCover module="cwm" feature="supervision" action="create">
      {disabledReasons ? <Tooltip title={disabledReasons}>
        <Button
          disabled
          icon="exclamation"
          onClick={this.handleCreatePassPort}
        >
          新建核放单
        </Button>
      </Tooltip> :
      <Button
        icon="check-circle-o"
        onClick={this.handleCreatePassPort}
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
          breadcrumb={[bizPrefix, iePrefix, this.msg('stockIO')]}
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
            rowClassName={record => (record.stock_status === -1 ? 'table-row-disabled' : '')}
            loading={this.props.listLoading}
          />
        </PageContent>
        <SendSwJG2FileModal reload={this.handleStockioListLoad} />
        <SasDeclMsgModal reload={this.handleStockioListLoad} />
      </Layout>
    );
  }
}
