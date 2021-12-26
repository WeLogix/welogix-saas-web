import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Layout } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { loadStockQuery, loadStockQueryStat } from 'common/reducers/cwmOwnerQuery';
import DataTable from 'client/components/DataTable';
import Summary from 'client/components/Summary';
import PageHeader from 'client/components/PageHeader';
import { createFilename } from 'client/util/dataTransform';
import WhseSelect from '../../common/whseSelect';
import QueryForm from './queryForm';
import { commonTraceColumns } from '../../common/commonColumns';
import TraceIdPopover from '../../common/popover/traceIdPopover';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    loading: state.cwmOwnerQuery.queryLoading,
    totalReducedList: state.cwmTransition.totalReducedList,
    sortFilter: state.cwmTransition.sortFilter,
    ownerTransitionStat: state.cwmOwnerQuery.ownerTransitionStat,
    queryFilter: state.cwmOwnerQuery.queryFilter,
    ownerTransitionList: state.cwmOwnerQuery.ownerTransitionList,
  }),
  {
    loadStockQueryStat,
    loadStockQuery,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
})
export default class OwnerStockTransitionList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    queryFilter: PropTypes.shape({ status: PropTypes.string }).isRequired,
    sortFilter: PropTypes.shape({ field: PropTypes.string }).isRequired,
  }
  state = {
    selectedRowKeys: [],
    allSelectedRows: [],
  }
  componentDidMount() {
    if (this.props.defaultWhse.code) {
      const filter = { ...this.props.queryFilter, whse_code: this.props.defaultWhse.code };
      this.handleStockQuery(1, filter);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.defaultWhse.code && nextProps.defaultWhse.code) {
      const filter = { ...this.props.queryFilter, whse_code: nextProps.defaultWhse.code };
      this.handleStockQuery(1, filter);
    }
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('productNo'),
    dataIndex: 'product_no',
    width: 180,
    sorter: true,
  }, {
    title: this.msg('descCN'),
    dataIndex: 'name',
    width: 150,
  }, {
    title: this.msg('SKUCategory'),
    dataIndex: 'sku_category',
    width: 120,
  }, {
    title: this.msg('inboundDate'),
    width: 160,
    dataIndex: 'inbound_timestamp',
    render: inbts => inbts && moment(inbts).format('YYYY.MM.DD HH:mm'),
    sorter: true,
  }, {
    title: this.msg('traceId'),
    width: 200,
    dataIndex: 'trace_id',
    sorter: true,
    render: o => o && <TraceIdPopover traceId={o} />,
  }].concat(commonTraceColumns(this.props.intl))
  handleWhseChange = (value) => {
    const filter = { ...this.props.queryFilter, whse_code: value };
    this.handleStockQuery(1, filter);
  }
  handleStockQuery = (currentPage, filter) => {
    const { queryFilter, ownerTransitionList: { pageSize, current } } = this.props;
    const newFilter = JSON.stringify(filter || queryFilter);
    this.props.loadStockQuery({
      filter: newFilter,
      pageSize,
      current: currentPage || current,
    });
    this.props.loadStockQueryStat(newFilter);
    this.handleDeselectRows();
  }
  handleStatusChange = (value) => {
    const filter = { ...this.props.queryFilter, status: value };
    this.handleStockQuery(1, filter);
  }
  handleSearch = (searchForm) => {
    const filter = {
      ...this.props.queryFilter,
      ...searchForm,
      whse_code: this.props.defaultWhse.code,
    };
    this.handleStockQuery(1, filter);
  }
  handleDeselectRows = () => {
    this.setState({
      selectedRowKeys: [],
      allSelectedRows: [],
    });
  }
  handleExportExcel = () => {
    const { queryFilter, sortFilter } = this.props;
    window.open(`${API_ROOTS.default}v1/cwm/superowner/exportexcel/stock/${createFilename('transition')}.xlsx?filter=${
      JSON.stringify(queryFilter)}&sorter=${JSON.stringify(sortFilter)}`);
  }
  handleRowSelect = (selectedRows) => {
    const selectedRowKeys = selectedRows.map(sr => sr.trace_id);
    this.setState({
      selectedRowKeys,
      allSelectedRows: selectedRows,
    });
  }
  render() {
    const {
      loading, queryFilter, ownerTransitionStat, ownerTransitionList, totalReducedList,
    } = this.props;
    const { allSelectedRows } = this.state;
    const columns = [...this.columns];
    if (queryFilter.status !== 'historystock') {
      columns.splice(
        3, 0,
        {
          title: this.msg('stockingQty'),
          width: 100,
          dataIndex: 'stocking_qty',
          className: 'text-emphasis',
        }, {
          title: this.msg('totalQty'),
          width: 100,
          dataIndex: 'stock_qty',
          align: 'right',
          className: 'text-emphasis',
        }, {
          title: this.msg('availQty'),
          width: 100,
          dataIndex: 'avail_qty',
          align: 'right',
        }, {
          title: this.msg('allocQty'),
          width: 100,
          dataIndex: 'alloc_qty',
          align: 'right',
        }, {
          title: this.msg('frozenQty'),
          width: 100,
          dataIndex: 'frozen_qty',
          align: 'right',
        },
      );
    } else {
      columns.splice(3, 0, {
        title: this.msg('outboundQty'),
        width: 100,
        dataIndex: 'inbound_qty',
        align: 'right',
      });
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selRows) => {
        const selectedRows = allSelectedRows.filter(asr =>
          this.props.ownerTransitionList.data
            .filter(trd => trd.trace_id === asr.trace_id).length === 0)
          .concat(selRows.map(sr => ({
            trace_id: sr.trace_id,
            avail_qty: sr.avail_qty,
            owner_partner_id: sr.owner_partner_id,
          })));
        this.handleRowSelect(selectedRows, selRows.length > 0 ? selRows[0].owner_name : null);
      },
      hideDefaultSelections: true,
      getCheckboxProps: row => ({ disabled: row.avail_qty === 0 }),
    };
    if (totalReducedList.length > 0) {
      rowSelection.selections = [{
        key: 'selectall',
        text: '全部选择',
        onSelect: () => {
          this.handleRowSelect(this.props.totalReducedList, ownerTransitionList.data[0].owner_name);
        },
      }, {
        key: 'unselectall',
        text: '取消选择',
        onSelect: () => {
          this.handleRowSelect([]);
        },
      }];
    }
    const rowKey = 'trace_id'; // selectedRowKeys 有影响
    const dataSource = new DataTable.DataSource({
      fetcher: (params) => { this.props.loadStockQuery(params); },
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination, filters, sorter) => {
        const params = {
          current: pagination.current,
          pageSize: pagination.pageSize,
          sorter: JSON.stringify({
            field: sorter.field,
            order: sorter.order === 'descend' ? 'DESC' : 'ASC',
          }),
        };
        const filter = { ...queryFilter };
        Object.keys(filters).forEach((flt) => {
          if (filters[flt].length > 0) {
            [filter[flt]] = filters[flt];
          } else {
            delete filter[flt];
          }
        });
        params.filter = JSON.stringify(filter);
        return params;
      },
      remotes: ownerTransitionList,
    });
    const dropdownMenuItems = [
      { name: this.msg('all'), elementKey: 'all' },
      { icon: 'check-circle', name: this.msg('当前库存'), elementKey: 'stock' },
      { icon: 'exclamation-circle', name: this.msg('已出库存'), elementKey: 'historystock' },
    ];
    const dropdownMenu = {
      selectedMenuKey: queryFilter.status,
      onMenuClick: this.handleStatusChange,
      dropdownMenuItems,
    };
    const totCol = queryFilter.status !== 'historystock' ? (
      <Summary>
        <Summary.Item label="库存数量">{ownerTransitionStat.stock_qty || 0}</Summary.Item>
        <Summary.Item label="可用数量">{ownerTransitionStat.avail_qty || 0}</Summary.Item>
        <Summary.Item label="分配数量">{ownerTransitionStat.alloc_qty || 0}</Summary.Item>
        <Summary.Item label="冻结数量">{ownerTransitionStat.frozen_qty || 0}</Summary.Item>
        <Summary.Item label="保税数量">{ownerTransitionStat.bonded_qty || 0}</Summary.Item>
        <Summary.Item label="非保税数量">{ownerTransitionStat.nonbonded_qty || 0}</Summary.Item>
      </Summary>
    ) : (
      <Summary>
        <Summary.Item label="出库数量">{ownerTransitionStat.inbound_qty || 0}</Summary.Item>
      </Summary>
    );
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            <WhseSelect onChange={this.handleWhseChange} />,
            this.msg('queryStock'),
          ]}
          dropdownMenu={dropdownMenu}
        >
          <PageHeader.Actions>
            <Button icon="export" onClick={this.handleExportExcel}>
              {this.msg('export')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={<QueryForm onSearch={this.handleSearch} />}
              total={totCol}
              selectedRowKeys={this.state.selectedRowKeys}
              onDeselectRows={this.handleDeselectRows}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={dataSource}
              loading={loading}
              rowKey={rowKey}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
