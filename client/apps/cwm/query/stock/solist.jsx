import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, DatePicker } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import ToolbarAction from 'client/components/ToolbarAction';
import connectNav from 'client/common/decorators/connect-nav';
import { CWM_SO_STATUS, LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { showDock } from 'common/reducers/cwmShippingOrder';
import { loadQuerySos } from 'common/reducers/cwmOwnerQuery';
import { toggleExportPanel } from 'common/reducers/hubDataAdapter';
import ExportDataPanel from 'client/components/ExportDataPanel';
import WhseSelect from '../../common/whseSelect';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    filters: state.cwmOwnerQuery.soFilters,
    solist: state.cwmOwnerQuery.soQueryList,
    loading: state.cwmOwnerQuery.soQueryList.loading,
  }),
  {
    loadQuerySos,
    showDock,
    toggleExportPanel,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
})
export default class ShippingOrderQueryList extends React.Component {
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
    const { filters } = this.props;
    if (this.props.defaultWhse.code) {
      this.handleReload(1, {
        ...filters,
        whse_code: this.props.defaultWhse.code,
        pageSize: this.props.solist.pageSize,
        current: this.props.solist.current,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.defaultWhse.code && nextProps.defaultWhse.code) {
      const filter = { ...this.props.filters, whse_code: nextProps.defaultWhse.code };
      this.handleReload(1, filter);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: 'SO编号',
    width: 180,
    dataIndex: 'so_no',
    render: (o, record) => (
      <a onClick={() => this.handlePreview(o, record.outbound_no)}>
        {o}
      </a>),
  }, {
    title: '订单追踪号',
    dataIndex: 'cust_order_no',
    width: 180,
  }, {
    title: '快递单号',
    dataIndex: 'real_express_no',
    width: 180,
  }, {
    title: '收货人',
    dataIndex: 'receiver_name',
    width: 180,
  }, {
    title: '收货地址',
    dataIndex: 'receiver_address',
    width: 180,
  }, {
    title: '联系电话',
    dataIndex: 'receiver_phone',
    width: 180,
  }, {
    title: '生成快递单号日期',
    dataIndex: 'express_date',
    width: 180,
  }, {
    title: '总数量',
    dataIndex: 'total_qty',
    width: 180,
  }]
  handlePreview = (soNo, outboundNo) => {
    this.props.showDock(soNo, outboundNo);
  }
  handleReload = (currentPage, filterParam) => {
    const { filters, solist: { pageSize, current } } = this.props;
    const newFilter = JSON.stringify(filterParam || filters);
    this.props.loadQuerySos({
      pageSize,
      current: currentPage || current,
      filters: newFilter,
    }).then((result) => {
      if (!result.error) {
        this.setState({
          selectedRowKeys: [],
        });
      }
    });
  }
  handleFilterMenuClick = (key) => {
    const filters = { ...this.props.filters, status: key };
    this.handleReload(1, filters);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleDateChange = (data, dataString) => {
    const filters = { ...this.props.filters, startDate: dataString[0], endDate: dataString[1] };
    this.handleReload(1, filters);
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, search: value };
    this.handleReload(1, filters);
  }
  handleWhseChange = (value) => {
    const { filters } = this.props;
    filters.whse_code = value;
    this.handleReload(1, filters);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleExport = () => {
    this.props.toggleExportPanel(true);
  }
  render() {
    const {
      defaultWhse, filters, loading,
    } = this.props;
    let dateVal = [];
    if (filters.endDate) {
      dateVal = [moment(filters.startDate, 'YYYY-MM-DD'), moment(filters.endDate, 'YYYY-MM-DD')];
    }
    const { columns } = this;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadQuerySos(params),
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
          filters: JSON.stringify(newfilters),
        };
        return params;
      },
      remotes: this.props.solist,
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={filters.search} placeholder={this.msg('soPlaceholder')} onSearch={this.handleSearch} />
      <RangePicker
        onChange={this.handleDateChange}
        value={dateVal}
        ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment().startOf('month'), moment()] }}
      />
    </span>);
    const dropdownMenuItems = [
      { icon: 'file-text', name: this.msg('allSO'), elementKey: 'all' },
      { icon: 'file-text', name: CWM_SO_STATUS.PENDING.text, elementKey: CWM_SO_STATUS.PENDING.key },
      { icon: 'file-text', name: CWM_SO_STATUS.OUTBOUND.text, elementKey: CWM_SO_STATUS.OUTBOUND.key },
      { icon: 'file-text', name: CWM_SO_STATUS.COMPLETED.text, elementKey: CWM_SO_STATUS.COMPLETED.key },
    ];
    const dropdownMenu = {
      selectedMenuKey: filters.status,
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems,
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            <WhseSelect onChange={this.handleWhseChange} />,
            this.msg('shippingOrder'),
          ]}
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <ToolbarAction icon="download" label={this.msg('export')} onClick={this.handleExport} />
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <Content className="page-content" key="main">
            <DataTable
              columns={columns}
              rowSelection={rowSelection}
              dataSource={dataSource}
              rowKey="id"
              toolbarActions={toolbarActions}
              scroll={{ x: columns.reduce((acc, cur) => acc + (cur.width ? cur.width : 200), 0) }}
              loading={loading}
              selectedRowKeys={this.state.selectedRowKeys}
              onDeselectRows={this.handleDeselectRows}
            />
          </Content>
        </Layout>
        <ExportDataPanel
          type={LINE_FILE_ADAPTOR_MODELS.CWM_SHIPPING_ORDER.key}
          formData={{
            whseCode: defaultWhse.code,
            owner: true,
            filters: {
              ...filters,
              selSoIds: this.state.selectedRowKeys.length > 0 ?
              this.state.selectedRowKeys : undefined,
            },
          }}
        />
      </Layout>
    );
  }
}
