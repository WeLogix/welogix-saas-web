import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { createFilename } from 'client/util/dataTransform';
import { loadBlBookGoodsList } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../../../../apps/cwm/sasbl/blbook/message.i18n';


@injectIntl
@connect(
  state => ({
    blBookGoodsList: state.cwmBlBook.blBookGoodsList,
    blBookGoodsListLoading: state.cwmBlBook.blBookGoodsList.blBookGoodsListLoading,
    goodslistFilters: state.cwmBlBook.goodslistFilters,
    blBookData: state.saasDockPool.cwmBlBook.blBook,
  }),
  { loadBlBookGoodsList }
)
export default class BlBookDetailDockPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    const blBookNo = this.props.blBookData.blbook_no;
    if (blBookNo) {
      this.handleLoadBodyList();
    }
  }
  handleBodyGoodsSearch = (searchFields) => {
    if (searchFields) {
      this.handleLoadBodyList(null, null, searchFields);
    } else {
      this.handleLoadBodyList();
    }
  }
  handleLoadBodyList = (page, pageSize, searchFields) => {
    const { blBookGoodsList, blBookData } = this.props;
    const currentPage = page || blBookGoodsList.current;
    const currentSize = pageSize || blBookGoodsList.pageSize;
    this.props.loadBlBookGoodsList({
      blBookNo: blBookData.blbook_no,
      pageSize: currentSize,
      current: currentPage,
      filters: { searchFields },
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBodyList(page, pageSize);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('prdtItemNo'),
    width: 100,
    dataIndex: 'prdt_item_no',
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: this.msg('blbgInvalid'),
    dataIndex: 'blbg_invalid',
    align: 'center',
    width: 100,
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
    width: 150,
  }, {
    title: this.msg('productNo'),
    dataIndex: 'product_no',
    width: 100,
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 100,
  }, {
    title: this.msg('gModel'),
    dataIndex: 'g_model',
    width: 100,
  }, {
    title: this.msg('country'),
    dataIndex: 'country',
    width: 100,
  }, {
    title: this.msg('gUnit'),
    dataIndex: 'g_unit',
    width: 100,
  }, {
    title: this.msg('unit1'),
    dataIndex: 'unit_1',
    width: 100,
  }, {
    title: this.msg('unit2'),
    dataIndex: 'unit_2',
    width: 100,
  }, {
    title: this.msg('decPrice'),
    dataIndex: 'dec_price',
    width: 100,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    width: 100,
  }, {
    title: this.msg('blbgFreeupDate'),
    dataIndex: 'blbg_freeup_date',
    width: 100,
  }, {
    title: this.msg('blbgExpirayDate'),
    dataIndex: 'blbg_expiray_date',
    width: 100,
  }, {
    title: this.msg('remark'),
    dataIndex: 'blbg_note',
    width: 100,
  }]
  handleExport = () => {
    const params = { blBookNo: this.props.blBook.blbook_no };
    window.open(`${API_ROOTS.default}v1/cwm/blbook/body/export/${createFilename('blbook_goods')}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  render() {
    const {
      blBookGoodsList, blBookGoodsListLoading, goodslistFilters,
    } = this.props;
    const pagination = {
      current: blBookGoodsList.current,
      pageSize: blBookGoodsList.pageSize,
      total: blBookGoodsList.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePageChange,
      showTotal: total => `共 ${total} 条`,
    };
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={blBookGoodsList ? blBookGoodsList.data : []}
          toolbarActions={<SearchBox placeholder={this.msg('docksearchPlaceholder')} onSearch={this.handleBodyGoodsSearch} value={goodslistFilters.search} />}
          rowKey="prdt_item_no"
          loading={blBookGoodsListLoading}
          pagination={pagination}
          scrollOffset={296}
        />
      </div>);
  }
}
