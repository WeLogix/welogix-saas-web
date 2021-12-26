import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Layout, Select, Tag, message, DatePicker, Menu, Icon } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { BOND_INVT_TYPE, SASBL_REG_STATUS, PARTNER_ROLES, SW_JG2_SENDTYPE } from 'common/constants';
import { showSendSwJG2File, toggleSasDeclMsgModal } from 'common/reducers/cwmSasblReg';
import { loadPtsInvtList } from 'common/reducers/ptsImpExp';
import { loadPartners } from 'common/reducers/partner';
import SendSwJG2FileModal from '../../cwm/sasbl/common/modals/sendSwJG2FileModal';
import SasDeclMsgModal from '../../cwm/sasbl/common/modals/sasDeclMsgModal';
import { formatMsg } from './message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    owners: state.cwmContext.whseAttrs.owners,
    filters: state.ptsImpExp.invtFilters,
    invtList: state.ptsImpExp.invtList,
    listLoading: state.ptsImpExp.listLoading,
  }),
  {
    loadPtsInvtList, loadPartners, showSendSwJG2File, toggleSasDeclMsgModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'pts',
  title: 'featPtsImpExp',
})
export default class InventoryRegList extends React.Component {
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
    this.handleinvtListLoad();
    this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.VEN] });
  }
  componentWillReceiveProps(nextprops) {
    const { ieType } = nextprops.params;
    if (ieType !== this.props.params.ieType && ieType) {
      this.handleinvtListLoad(1, ieType);
    }
  }
  handleOnDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleinvtListLoad(1, null, filters);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('copOrSeqNo'),
    width: 150,
    dataIndex: 'cop_invt_no',
    render: (o, record) => {
      if (record.pre_sasbl_seqno) {
        return (
          <span>{record.pre_sasbl_seqno}</span>
        );
      }
      return record.pre_sasbl_seqno ?
        <span>{record.pre_sasbl_seqno}</span> : <span>{record.cop_invt_no}</span>;
    },
  }, {
    title: this.msg('invtNo'),
    width: 150,
    dataIndex: 'invt_no',
  }, {
    title: this.msg('custOrderNo'),
    width: 150,
    dataIndex: 'cust_order_no',
  }, {
    title: this.msg('blbookNo'),
    dataIndex: 'blbook_no',
    width: 120,
  }, {
    title: this.msg('invtStatus'),
    dataIndex: 'invt_status',
    width: 100,
    render: (o) => {
      const regStatus = SASBL_REG_STATUS.filter(reg => reg.value === o)[0];
      if (regStatus) {
        return <Badge status={regStatus.badge} text={regStatus.text} />;
      }
      return '';
    },
  }, {
    title: this.msg('verifyFlag'),
    width: 100,
    dataIndex: 'verify_flag',
    render: (o) => {
      if (o === 1) {
        return (<Tag color="gray" >未核扣</Tag>);
      } else if (o === 2) {
        return (<Tag color="blue" >预核扣</Tag>);
      } else if (o === 3) {
        return (<Tag color="green" >已核扣</Tag>);
      }
      return '';
    },
  }, {
    title: this.msg('invtBiztype'),
    width: 100,
    dataIndex: 'invt_biztype',
    render: (o) => {
      const bizType = BOND_INVT_TYPE.filter(type => type.value === o)[0];
      return bizType && <Tag color="blue">{bizType.text}</Tag>;
    },
  }, {
    title: this.msg('ownerName'),
    width: 200,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('cusdeclFlag'),
    width: 80,
    dataIndex: 'cusdecl_flag',
    render: (o) => {
      if (o === 1) {
        return '报关';
      }
      if (o === 2) {
        return '非报关';
      }
      return '';
    },
  }, {
    title: this.msg('cusdeclType'),
    width: 100,
    dataIndex: 'cusdecl_type',
    render: (o) => {
      if (o === '1') {
        return '关联报关';
      }
      if (o === '2') {
        return '对应报关';
      }
      return '';
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
            <RowAction onClick={this.handleDetail} icon="form" label="详情" row={record} />
            <RowAction onClick={this.handleInvtSend} icon="mail" tooltip={this.msg('sendMsg')} row={record} />
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
      }
      return (<span>
        <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />
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
    fetcher: params => this.props.loadPtsInvtList(params),
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
        ieType: this.props.params.ieType,
      };
      const filters = { ...this.props.filters };
      params.filters = filters;
      return params;
    },
    remotes: this.props.invtList,
  })
  handleinvtListLoad = (currentPage, ieType, filter) => {
    const { params, filters, invtList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    this.props.loadPtsInvtList({
      filters: newfilter,
      pageSize,
      currentPage: currentPage || current,
      ieType: ieType || params.ieType,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleRowMenuClick = (key, record) => {
    if (key === 'sent' || key === 'rec') {
      this.props.toggleSasDeclMsgModal(true, { copNo: record.cop_invt_no, sasRegType: key });
    }
  }
  handleInvtSend = (row) => {
    this.props.showSendSwJG2File({
      visible: true,
      copNo: row.cop_invt_no,
      agentCode: row.declarer_scc_code,
      regType: 'invt',
      sendFlag: row.sasbl_biztype === 'PTSEMS' ? SW_JG2_SENDTYPE.EMS : SW_JG2_SENDTYPE.EML,
      decType: row.invt_dectype,
    });
  }
  handleDetail = (row) => {
    const { ieType } = this.props.params;
    const link = `/pts/${ieType === 'i' ? 'import' : 'export'}/${this.props.params.ieType}/${row.cop_invt_no}`;
    this.context.router.push(link);
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
  render() {
    const {
      invtList, owners,
      filters, params,
    } = this.props;
    const { ieType } = params;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = invtList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
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
    return (
      <Layout id="page-layout">
        <PageHeader
          title={ieType === 'i' ? this.msg('importMaterails') : this.msg('exportEndProduct')}
          dropdownMenu={dropdownMenu}
        />
        <PageContent>
          <DataTable
            defaultExpandAllRows
            // bulkActions={bulkActions}
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            indentSize={0}
            rowKey="id"
            loading={this.props.listLoading}
          />
        </PageContent>
        <SendSwJG2FileModal reload={this.handleinvtListLoad} />
        <SasDeclMsgModal reload={this.handleinvtListLoad} />
      </Layout>
    );
  }
}
