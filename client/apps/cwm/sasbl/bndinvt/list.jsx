import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Layout, Select, Tag, message } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { loadSasblInventoryList } from 'common/reducers/cwmSasblReg';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    filters: state.cwmSasblReg.bndInvtFilters,
    sasInventoryList: state.cwmSasblReg.sasInventoryList,
    listLoading: state.cwmSasblReg.listLoading,
    kBlBooks: state.cwmBlBook.blBooksByType,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
  }),
  {
    loadSasblInventoryList,
    getBlBookNosByType,
    toggleBizDock,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class SasblInventoryList extends React.Component {
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
    this.handleListReLoad(1, null, null);
    this.props.getBlBookNosByType(this.props.whse.code, 'K');
  }
  componentWillReceiveProps(nextprops) {
    const whseCode = nextprops.whse && nextprops.whse.code;
    if (whseCode !== this.props.whse.code && whseCode) {
      this.handleListReLoad(1, whseCode, nextprops.filters);
      this.props.getBlBookNosByType(whseCode, 'K');
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('blbookNo'),
    width: 120,
    align: 'center',
    dataIndex: 'blbook_no',
    render: o => <a onClick={() => this.handleShowBlBookPanel(o)}>{o}</a>,
  }, {
    title: this.msg('prdtItemNo'),
    dataIndex: 'prdt_item_no',
    align: 'center',
    width: 80,
  }, {
    title: this.msg('sgdProductNo'),
    dataIndex: 'sgi_product_no',
    width: 80,
  }, {
    title: this.msg('sgdName'),
    dataIndex: 'sgi_name',
    width: 80,
  }, {
    title: this.msg('sgdHscode'),
    width: 80,
    dataIndex: 'sgi_hscode',
  }, {
    title: this.msg('unitPcs'),
    width: 60,
    dataIndex: 'sgi_unit_pcs',
    render: (o) => {
      const { units } = this.props;
      const foundOpts = units.filter(opt => opt.value === o);
      const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : o;
      return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
    },
  }, {
    title: this.msg('increaseQty'),
    width: 80,
    align: 'center',
    dataIndex: 'sgi_entry_qty',
  }, {
    title: this.msg('inUnCountQty'),
    width: 100,
    align: 'center',
    dataIndex: 'sgi_entry_nondec_qty',
  }, {
    title: this.msg('decreaseQty'),
    width: 80,
    align: 'center',
    dataIndex: 'sgi_exit_qty',
  }, {
    title: this.msg('outUnCountQty'),
    width: 100,
    align: 'center',
    dataIndex: 'sgi_exit_nondec_qty',
  }, {
    title: this.msg('idealInventory'),
    width: 80,
    align: 'center',
    dataIndex: 'sgi_whse_stock_qty',
  }, {
    title: this.msg('factInventory'),
    width: 80,
    align: 'center',
    dataIndex: 'stock_qty',
  }, {
    title: this.msg('abnormalQty'),
    width: 80,
    align: 'center',
    render: (o, record) => {
      const difference = record.stock_qty - record.sgi_whse_stock_qty;
      if (difference > 0) {
        return <span className="text-warning">+{difference}</span>;
      } else if (difference < 0) {
        return <span className="text-error">{difference}</span>;
      }
      return <span className="text-success">{0}</span>;
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadSasblInventoryList(params),
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
    remotes: this.props.sasInventoryList,
  })
  handleListReLoad = (currentPage, whsecode, filter) => {
    const { whse, filters, sasInventoryList: { pageSize, current } } = this.props;
    const newfilter = filter || filters;
    this.props.loadSasblInventoryList({
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
  handleShowBlBookPanel = (blBookNo) => {
    const blBook = { blbook_no: blBookNo };
    this.props.toggleBizDock('cwmBlBook', { blBook });
  }
  handleSearch = (search) => {
    const filters = { ...this.props.filters, search };
    this.handleListReLoad(1, null, filters);
  }
  handleBookNoSelectChange = (value) => {
    const filters = { ...this.props.filters, blbook_no: value };
    this.handleListReLoad(1, null, filters);
  }
  render() {
    const {
      sasInventoryList, kBlBooks,
      filters,
    } = this.props;
    const kBookNos = kBlBooks.filter(bl => bl.blbook_no).map(bk => bk.blbook_no);
    this.dataSource.remotes = sasInventoryList;
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.search} placeholder={this.msg('bndinvtSearchPlaceHolder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.blbook_no}
        onChange={this.handleBookNoSelectChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
      >
        <Option value="all" key="all" >全部账册</Option>
        {kBookNos.map(bk =>
          <Option value={bk} key={bk}>{bk}</Option>)}
      </Select>
    </span>);
    return (
      <Layout id="page-layout">
        <PageHeader
          title={this.msg('bndinvt')}
        />
        <PageContent>
          <DataTable
            defaultExpandAllRows
            toolbarActions={toolbarActions}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            indentSize={0}
            rowKey="id"
            loading={this.props.listLoading}
          />
        </PageContent>
      </Layout>
    );
  }
}
