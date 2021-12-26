import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Button, Layout, Select, Tag, message, DatePicker } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { openNormalRelRegModal, loadReleaseRegDatas } from 'common/reducers/cwmShFtz';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { CWM_SHFTZ_OUT_REGTYPES } from 'common/constants';
import { showDock } from 'common/reducers/cwmShippingOrder';
import PageHeader from 'client/components/PageHeader';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import NormalRelRegModal from './modal/normalRelRegModal';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    releaseList: state.cwmShFtz.releaseList,
    listFilter: state.cwmShFtz.listFilter,
    whses: state.cwmContext.whses,
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    loading: state.cwmShFtz.loading,
    userMembers: state.account.userMembers,
  }),
  {
    openNormalRelRegModal, loadReleaseRegDatas, switchDefaultWhse, showDock,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class SHFTZNormalRelRegList extends React.Component {
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
    const { listFilter } = this.props;
    let { status } = listFilter;
    let { ownerView } = listFilter;
    if (ownerView !== 'all' && this.props.owners.filter(owner => listFilter.ownerView === owner.customs_code).length === 0) {
      ownerView = 'all';
    }
    if (window.location.search.indexOf('dashboard') > 0 && window.localStorage && window.localStorage.bondedStatus) {
      const bondedStatus = JSON.parse(window.localStorage.bondedStatus);
      listFilter.startDate = bondedStatus.startDate;
      listFilter.endDate = bondedStatus.endDate;
      const newStatus = bondedStatus.status;
      status = newStatus;
    } else {
      if (['all', 'pending', 'processing', 'completed'].filter(stkey => stkey === status).length === 0) {
        status = 'all';
      }
      listFilter.startDate = null;
      listFilter.endDate = null;
    }
    const filter = {
      ...listFilter, status, type: 'normal', ownerView, filterNo: '',
    };
    this.handleReleaseListLoad(null, null, filter);
  }
  onDateChange = (data, dataString) => {
    const filters = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleReleaseListLoad(1, this.props.whse.code, filters);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '出区提货单号/备案编号',
    dataIndex: 'ftz_rel_no',
    width: 200,
    render: (o, record) => {
      if (o) {
        return (
          <span className="text-emphasis">{o}</span>
        );
      }
      return (
        <span className="text-normal">{record.pre_entry_seq_no}</span>
      );
    },
  }, {
    title: '监管类型',
    dataIndex: 'ftz_rel_type',
    width: 100,
    render: (reltype) => {
      const regtype = CWM_SHFTZ_OUT_REGTYPES.filter(sbr => sbr.value === reltype)[0];
      if (regtype) {
        return (<Tag color={regtype.tagcolor}>{regtype.ftztext}</Tag>);
      }
      return '';
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (o) => {
      switch (o) {
        case 0:
          return (<Badge status="default" text="待备案" />);
        case 1:
          return (<Badge status="processing" text="已发送" />);
        case 2:
          return (<Badge status="processing" text="已备案" />);
        case 3:
          return (<Badge status="processing" text="部分委托" />);
        case 4:
          return (<Badge status="processing" text="全部委托" />);
        case 5:
          return (<Badge status="processing" text="部分清关" />);
        case 6:
          return (<Badge status="processing" text="清关完成" />);
        case 7:
          return (<Badge status="processing" text="部分出区" />);
        case 8:
          return (<Badge status="success" text="出区完成" />);
        default:
          return '';
      }
    },
  }, {
    title: '报关单号',
    dataIndex: 'cus_decl_no',
    width: 160,
    render: o => <span className="text-emphasis">{o}</span>,
  }, {
    title: '货主',
    width: 180,
    dataIndex: 'owner_name',
  }, {
    title: '订单追踪号',
    dataIndex: 'cust_order_no',
    width: 180,
  }, {
    title: '提货单位',
    width: 180,
    dataIndex: 'receiver_name',
  }, {
    title: '关联编号',
    dataIndex: 'so_no',
    width: 160,
    render: (o, record) => <a onClick={() => this.handlePreview(o, record.outbound_no)}>{o}</a>,
  }, {
    title: '运输单位',
    width: 180,
    dataIndex: 'carrier_name',
  }, {
    title: '备案日期',
    width: 120,
    dataIndex: 'ftz_reg_date',
    render: reldate => reldate && moment(reldate).format('YYYY.MM.DD'),
  }, {
    title: '报关日期',
    width: 120,
    dataIndex: 'cus_decl_date',
    render: decldate => decldate && moment(decldate).format('YYYY.MM.DD'),
  }, {
    title: '出区日期',
    width: 120,
    dataIndex: 'exit_date',
    render: reldate => reldate && moment(reldate).format('YYYY.MM.DD'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 80,
    render: o => this.props.userMembers.find(member => member.login_id === o) &&
     this.props.userMembers.find(member => member.login_id === o).name,
  }, {
    title: '创建时间',
    width: 120,
    dataIndex: 'created_date',
    render: (o) => {
      if (o) {
        return `${moment(o).format('MM.DD HH:mm')}`;
      }
      return '';
    },
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    fixed: 'right',
    render: (o, record) => {
      switch (record.status) {
        case 0:
          return <RowAction onClick={this.handleDetail} icon="form" label="详情" row={record} />;
        case 1:
          return <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />;
        case 2:
          return (<span>
            <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />
            <RowAction onClick={this.handleDetail} icon="share-alt" tooltip="委托清关" row={record} />
          </span>);
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          return <RowAction onClick={this.handleDetail} icon="eye-o" label="详情" row={record} />;
        default:
          return '';
      }
    },
  }]
  handlePreview = (soNo, outboundNo) => {
    this.props.showDock(soNo, outboundNo);
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadReleaseRegDatas(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        whseCode: this.props.whse.code,
      };
      const filter = { ...this.props.listFilter };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.releaseList,
  })
  handleCreateNormalRelReg = () => {
    this.props.openNormalRelRegModal();
  }
  handleReleaseListLoad = (currentPage, whsecode, filter) => {
    const { listFilter, whse, releaseList: { pageSize, current } } = this.props;
    const newfilter = filter || listFilter;
    this.props.loadReleaseRegDatas({
      filter: JSON.stringify(newfilter),
      pageSize,
      currentPage: currentPage || current,
      whseCode: whsecode || whse.code,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleNewNormalRelRegLoad = () => {
    this.handleReleaseListLoad(1, this.props.whse.code, { ...this.props.listFilter, status: 'all' });
  }
  handleStatusChange = (value) => {
    if (value === this.props.listFilter.status) {
      return;
    }
    const filter = { ...this.props.listFilter, status: value };
    this.handleReleaseListLoad(1, this.props.whse.code, filter);
  }
  handleDetail = (row) => {
    const link = `/cwm/supervision/shftz/release/${row.ftz_rel_type}/${row.so_no}`;
    this.context.router.push(link);
  }
  handleWhseChange = (value) => {
    this.props.switchDefaultWhse(value);
    message.info('当前仓库已切换');
    this.handleReleaseListLoad(1, value);
  }
  handleSearch = (searchVal) => {
    const filters = { ...this.props.listFilter, filterNo: searchVal };
    this.handleReleaseListLoad(1, this.props.whse.code, filters);
  }
  handleOwnerSelectChange = (value) => {
    const filters = { ...this.props.listFilter, ownerView: value };
    this.handleReleaseListLoad(1, this.props.whse.code, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { releaseList, listFilter, owners } = this.props;
    let dateVal = [];
    if (listFilter.endDate) {
      dateVal = [moment(listFilter.startDate, 'YYYY-MM-DD'), moment(listFilter.endDate, 'YYYY-MM-DD')];
    }
    this.dataSource.remotes = releaseList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dropdownMenuItems = [
      { name: '全部状态', elementKey: 'all' },
      { elementKey: 'pending', icon: 'file-unknown', name: '待备案' },
      { elementKey: 'completed', icon: 'file-sync', name: '已备案' },
      { elementKey: 'delegated', icon: 'file-done', name: '已委托' },
      { elementKey: 'exited', icon: 'file-done', name: '已出区' },
    ];
    const dropdownMenu = {
      selectedMenuKey: listFilter.status,
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems,
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.filterNo} placeholder={this.msg('releaseSearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={listFilter.ownerView}
        onChange={this.handleOwnerSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all">全部货主</Option>
        {owners.map(data => (<Option key={data.customs_code} value={data.customs_code} search={`${data.partner_code}${data.name}`}>{data.name}</Option>))}
      </Select>
      <RangePicker
        onChange={this.onDateChange}
        value={dateVal}
        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
      />
    </span>);
    const bulkActions = (<PrivilegeCover module="cwm" feature="supervision" action="edit">
      {listFilter.status === 'pending' && <Button >批量发送</Button>}
      {listFilter.status === 'pending' && <Button >合并备案</Button>}
      {listFilter.status === 'processing' && <Button >批量同步</Button>}
      {listFilter.status === 'completed' && <Button >批量委托清关</Button>}
      {listFilter.status === 'cleared' && <Button >批量出区确认</Button>}
    </PrivilegeCover>);
    return (
      <Layout id="page-layout">
        <PageHeader title={this.msg('ftzRelNormalReg')} dropdownMenu={dropdownMenu}>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreateNormalRelReg}>
                {this.msg('create')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            rowKey="id"
            loading={this.props.loading}
            indentSize={0}
            defaultExpandAllRows
          />
          <NormalRelRegModal reload={this.handleNewNormalRelRegLoad} />
        </Content>
      </Layout>
    );
  }
}
