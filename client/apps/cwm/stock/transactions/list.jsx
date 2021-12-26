import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, notification, Layout } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { loadTransactions } from 'common/reducers/cwmTransaction';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { createFilename } from 'client/util/dataTransform';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import WhseSelect from '../../common/whseSelect';
import QueryForm from './queryForm';
import TraceIdPopover from '../../common/popover/traceIdPopover';
import { transactionColumns, commonTraceColumns } from '../../common/commonColumns';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    loading: state.cwmTransaction.loading,
    transactionlist: state.cwmTransaction.list,
    listFilter: state.cwmTransaction.listFilter,
    sortFilter: state.cwmTransaction.sortFilter,
  }),
  { loadTransactions, switchDefaultWhse }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmStockTransaction',
})
export default class StockTransactionsList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    transactionlist: PropTypes.shape({ current: PropTypes.number }).isRequired,
    listFilter: PropTypes.shape({ status: PropTypes.string }).isRequired,
    sortFilter: PropTypes.shape({ field: PropTypes.string }).isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    const filter = { ...this.props.listFilter, whse_code: this.props.defaultWhse.code };
    this.handleStockQuery(1, filter);
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('owner'),
    dataIndex: 'owner_name',
    width: 150,
    sorter: true,
  }, {
    title: this.msg('productNo'),
    dataIndex: 'product_no',
    width: 180,
    sorter: true,
  }, {
    title: this.msg('descCN'),
    dataIndex: 'name',
    width: 150,
  }, {
    title: this.msg('location'),
    width: 120,
    dataIndex: 'location',
    sorter: true,
  }, {
    title: this.msg('traceId'),
    width: 200,
    dataIndex: 'trace_id',
    sorter: true,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: this.msg('relatedTraceId'),
    width: 200,
    dataIndex: 'related_trace_id',
    render: (o, record) => record.related_trace_id,
  }].concat(transactionColumns(this.props.intl)).concat(commonTraceColumns(this.props.intl))
  handleWhseChange = (value) => {
    const filter = { ...this.props.listFilter, whse_code: value };
    this.handleStockQuery(1, filter);
  }
  handleStockQuery = (currentPage, filter) => {
    const { sortFilter, listFilter, transactionlist: { pageSize, current } } = this.props;
    this.props.loadTransactions({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      current: currentPage || current,
      sorter: JSON.stringify(sortFilter),
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleSearch = (searchForm) => {
    const filter = {
      ...this.props.listFilter,
      ...searchForm,
      whse_code: this.props.defaultWhse.code,
    };
    this.handleStockQuery(1, filter);
  }
  handleExportExcel = () => {
    const { listFilter, transactionlist, sortFilter } = this.props;
    if (transactionlist.totalCount > 50000) {
      notification.warn({
        message: '导出数量超限',
        description: '导出Excel文件超过5万行,请缩小查询范围',
      });
      return;
    }
    window.open(`${API_ROOTS.default}v1/cwm/transactions/exportTransactionsExcel/${createFilename('transactions')}.xlsx?filters=${
      JSON.stringify(listFilter)}&sorter=${JSON.stringify(sortFilter)}`);
  }
  render() {
    const {
      loading, listFilter,
    } = this.props;
    const { columns } = this;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const dataSource = new DataTable.DataSource({
      fetcher: (params) => {
        this.props.loadTransactions(params);
        this.setState({ selectedRowKeys: [] });
      },
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
          tenantId: this.props.tenantId,
          current: pagination.current,
          pageSize: pagination.pageSize,
          sorter: JSON.stringify({
            field: sorter.field,
            order: sorter.order === 'descend' ? 'DESC' : 'ASC',
          }),
        };
        const filter = { ...listFilter };
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
      remotes: this.props.transactionlist,
    });

    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            <WhseSelect onChange={this.handleWhseChange} />,
          ]}
        >
          <PageHeader.Actions>
            <Button icon="export" onClick={this.handleExportExcel}>
              {this.msg('export')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main" id="page-content">
          <DataTable
            toolbarActions={<QueryForm onSearch={this.handleSearch} />}
            selectedRowKeys={this.state.selectedRowKeys}
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={loading}
          />
        </Content>
      </Layout>
    );
  }
}
