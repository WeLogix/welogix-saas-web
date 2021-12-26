import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Tag, message, notification } from 'antd';
import ImportDataPanel from 'client/components/ImportDataPanel';
import DataPane from 'client/components/DataPane';
import { createFilename } from 'client/util/dataTransform';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import RowAction from 'client/components/RowAction';
import { loadBookGoodsList, deleteBookGoods } from 'common/reducers/ptsBook';
import SearchBox from 'client/components/SearchBox';
import ToolbarAction from 'client/components/ToolbarAction';
import { CUSTOMS_EXEC_MARK, MODIFY_MARK, PTS_BOOK_TYPE } from 'common/constants';
import BookGoodsModal from '../modals/bookGoodsModal';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  state => ({
    endProductFilters: state.ptsBook.endProductListFilters,
    materailsFilters: state.ptsBook.materailsListFilters,
    endProductList: state.ptsBook.endProductList,
    materailsList: state.ptsBook.materailsList,
    endProductListLoading: state.ptsBook.endProductList.endProductListLoading,
    materailsListLoading: state.ptsBook.materailsList.materailsListLoading,
    bookHead: state.ptsBook.bookData,
    exemptions: state.saasParams.latest.exemptionWay,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      value: curr.curr_code,
      text: curr.curr_name,
    })),
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
  }),
  { loadBookGoodsList, deleteBookGoods }
)

export default class PTBookGoodsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    selectedRowKeys: [],
    visibleBlBookGoodsModal: false,
    importPanelVisible: false,
  };
  componentDidMount() {
    this.handleLoadBodyList();
  }
  // componentWillReceiveProps(nextProps) {
  // if (this.props.activeKey !== nextProps.activeKey &&
  // (nextProps.activeKey === 'endProduct' || nextProps.activeKey === 'materails')) {
  //   this.handleLoadBodyList(null, null, null, nextProps.activeKey);
  // }
  // }
  getColumns() {
    const {
      countries, units, currencies, activeKey, bookHead, exemptions,
    } = this.props;
    const isManualBook = bookHead.blbook_type === PTS_BOOK_TYPE.MBOOK;
    const columns = [
      {
        title: this.msg('goodsSeqno'),
        dataIndex: 'prdt_item_no',
        width: 60,
        className: 'table-col-seq',
      }, {
        title: this.msg('productNo'),
        dataIndex: 'product_no',
        width: 100,
      }, {
        title: this.msg('hscode'),
        dataIndex: 'hscode',
        width: 120,
      }, {
        title: this.msg('gName'),
        dataIndex: 'g_name',
        width: 100,
      }, {
        title: this.msg('gModel'),
        dataIndex: 'g_model',
        width: 100,
      }, {
        title: this.msg('gUnit'),
        dataIndex: 'g_unit',
        width: 100,
        render: (o, record) => renderCombineData(record.g_unit, units),
      }, {
        title: this.msg('unit1'),
        dataIndex: 'unit_1',
        width: 100,
        render: (o, record) => renderCombineData(record.unit_1, units),
      }];
    if (!isManualBook) {
      columns.push({
        title: this.msg('unit2'),
        dataIndex: 'unit_2',
        width: 100,
        render: (o, record) => renderCombineData(record.unit_2, units),
      });
    }
    columns.push({
      title: this.msg('decPrice'),
      dataIndex: 'dec_price',
      align: 'center',
      width: 80,
    }, {
      title: this.msg('currency'),
      dataIndex: 'currency',
      align: 'center',
      width: 120,
      render: (o, record) => renderCombineData(record.currency, currencies),
    }, {
      title: this.msg('declGQty'),
      dataIndex: 'decl_g_qty',
      align: 'center',
      width: 80,
    });
    if (isManualBook) {
      columns.push({
        title: this.msg('declTotalAmount'),
        dataIndex: 'decl_total_amount',
        align: 'center',
        width: 80,
      }, {
        title: this.msg('country'),
        dataIndex: 'country',
        align: 'center',
        width: 100,
        render: (o, record) => renderCombineData(record.country, countries),
      });
    }
    columns.push({
      title: this.msg('dutyMode'),
      dataIndex: 'duty_mode',
      align: 'center',
      width: 120,
      render: (o, record) => renderCombineData(record.duty_mode, exemptions),
    }, {
      title: this.msg('modifyMark'),
      dataIndex: 'modify_mark',
      align: 'center',
      width: 120,
      render: (o, record) => renderCombineData(record.modify_mark, MODIFY_MARK),
    }, {
      title: this.msg('customsExecMark'),
      dataIndex: 'customs_exec_mark',
      align: 'center',
      width: 140,
      render: (o, record) => renderCombineData(record.customs_exec_mark, CUSTOMS_EXEC_MARK),
    });
    if (!isManualBook) {
      columns.push({
        title: this.msg('uconsumExecFlag'),
        dataIndex: 'etps_exec_flag',
        align: 'center',
        width: 120,
        render: (o) => {
          if (o === '2') {
            return '停用';
          }
          return '运行';
        },
      }, {
        title: this.msg('qtyControlMark'),
        dataIndex: 'qty_control_mark',
        align: 'center',
        width: 120,
        render: (o) => {
          if (o === '1') {
            return '数量控制';
          } else if (o === '2') {
            return '数量不控制';
          }
          return '';
        },
      }, {
        title: this.msg('writtenoffCycleInitQty'),
        dataIndex: 'writtenoff_cycle_init_qty',
        align: 'center',
        width: 80,
      }, {
        title: this.msg('approveMaxQty'),
        dataIndex: 'approve_max_qty',
        align: 'center',
        width: 80,
      });
    }
    columns.push({
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      fixed: 'right',
      width: 90,
      render: (o, record) => (!this.props.readonly && <span>
        <PrivilegeCover module="cwm" feature="blbook" action="edit">
          <RowAction onClick={this.handleEditGoods} icon="edit" row={record} tooltip={this.msg('edit')} />
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="blbook" action="delete">
          <RowAction confirm={this.msg('deleteConfirm')} onConfirm={this.handleDeleteRow} row={record} icon="delete" tooltip={this.msg('delete')} />
        </PrivilegeCover></span>
      ),
    });
    if (activeKey === 'endProduct') {
      const newColumns = [...columns];
      const deleteCount = isManualBook ? 0 : 2;
      newColumns.splice(-2 - deleteCount, deleteCount, {
        title: this.msg('uconsumDoubt'),
        dataIndex: 'uconsum_doubt',
        align: 'center',
        width: 80,
        render: (o) => {
          if (o === '1') {
            return '质疑';
          }
          return '不质疑';
        },
      }, {
        title: this.msg('consultFlag'),
        dataIndex: 'consult_flag',
        align: 'center',
        width: 80,
        render: (o) => {
          if (o === '1') {
            return '磋商中';
          }
          return '未磋商';
        },
      });
      return newColumns;
    }
    return columns;
  }
  msg = formatMsg(this.props.intl);
  handleShowGoodsModal = (mode, record) => {
    this.setState({
      visibleBlBookGoodsModal: true,
      mode,
      editInfo: record,
    });
  }
  handleCreateNewGoods = () => {
    const mode = 'create';
    this.handleShowGoodsModal(mode);
  }
  handleEditGoods = (record) => {
    const mode = 'edit';
    this.handleShowGoodsModal(mode, record);
  }
  handleGoodsModalClose = () => {
    this.setState({ visibleBlBookGoodsModal: false });
    this.handleLoadBodyList();
  }
  msg = formatMsg(this.props.intl)
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleLoadBodyList = (page, pageSize, paramFilter, activeKey) => {
    const {
      bookHead, materailsList, endProductList, materailsFilters, endProductFilters,
    } = this.props;
    let prdGoodsMark = 'I';
    let currentPage = page || materailsList.current;
    let currentSize = pageSize || materailsList.pageSize;
    let currentFilter = paramFilter || materailsFilters;
    const tabKey = activeKey || this.props.activeKey;
    if (tabKey === 'endProduct') {
      prdGoodsMark = 'E';
      currentPage = page || endProductList.current;
      currentSize = pageSize || endProductList.pageSize;
      currentFilter = paramFilter || endProductFilters;
    }
    this.props.loadBookGoodsList({
      blBookNo: bookHead.blbook_no,
      pageSize: currentSize,
      current: currentPage,
      filters: currentFilter,
      prdGoodsMark,
    });
  }
  handleDeleteRow = (record) => {
    this.props.deleteBookGoods([record.id]).then((result) => {
      if (!result.error) {
        message.success('deletedSucceed');
        this.handleLoadBodyList();
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleBatchDelete = () => {
    const idList = this.state.selectedRowKeys;
    this.props.deleteBookGoods(idList).then((result) => {
      if (!result.error) {
        message.success('deletedSucceed');
        this.handleDeselectRows();
        this.handleLoadBodyList();
      } else {
        message.error(result.error.message);
      }
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBodyList(page, pageSize);
  }
  handleSearch = (value) => {
    const { materailsFilters, endProductFilters, activeKey } = this.props;
    let filters = materailsFilters;
    if (activeKey === 'E') {
      filters = endProductFilters;
    }
    const currentFilters = { filters, searchFields: value };
    this.handleLoadBodyList(1, null, currentFilters);
  }
  handleImportGoods = () => {
    this.setState({ importPanelVisible: true });
  }
  handleExportGoods = () => {
    const { bookHead, activeKey } = this.props;
    const params = { bookNo: bookHead.blbook_no, prdGoodsMark: this.props.activeKey === 'endProduct' ? 'E' : 'I' };
    window.open(`${API_ROOTS.default}v1/pts/book/goods/export/${bookHead.blbook_no}${activeKey === 'endProduct' ? '成品' : '料件'}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  handleBookGoodsUploaded = (data) => {
    if (!data) {
      notification.success({
        message: '导入成功',
        description: '数据已全部导入',
        key: 'continue-edit',
        duration: 0,
      });
    } else {
      const {
        noValid, repeatPrdtItemNo, noMainAuxMark,
      } = data;
      const errorInfo = [];
      if (noValid.length > 0) {
        errorInfo.push(`第${noValid.join(',')}行，缺少必填字段`);
      }
      if (repeatPrdtItemNo.length > 0) {
        errorInfo.push(`第${repeatPrdtItemNo.join(',')}行，数据库已存在该序号，需要更新请选择重复覆盖`);
      }
      if (noMainAuxMark.length > 0) {
        errorInfo.push(`第${noMainAuxMark.join(',')}行，主辅料标志必填`);
      }
      notification.success({
        message: '失败',
        description: errorInfo,
        key: 'continue-edit',
        duration: 0,
      });
    }
    this.setState({ importPanelVisible: false });
    this.handleLoadBodyList();
  }
  handleGenImprotTemplate = () => {
    const params = { mode: 'downTemplate', prdGoodsMark: this.props.activeKey === 'endProduct' ? 'E' : 'I' };
    window.open(`${API_ROOTS.default}v1/pts/book/goods/export/${createFilename('book_goods')}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  render() {
    const {
      bookHead, materailsList, endProductList, endProductListLoading, materailsListLoading,
      form: { getFieldDecorator }, activeKey, materailsFilters, endProductFilters,
    } = this.props;
    let goodsList = materailsList;
    let loading = materailsListLoading;
    let filters = materailsFilters;
    if (activeKey === 'endProduct') {
      goodsList = endProductList;
      loading = endProductListLoading;
      filters = endProductFilters;
    }
    const { visibleBlBookGoodsModal, mode, editInfo } = this.state;
    const columns = this.getColumns();
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: goodsList.current,
      pageSize: goodsList.pageSize,
      total: goodsList.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePageChange,
      showTotal: total => `共 ${total} 条`,
    };
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        dataSource={goodsList ? goodsList.data : []}
        indentSize={0}
        rowKey="id"
        loading={loading}
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox value={filters.searchFields} placeholder={this.msg('序号/料号/商品编号/品名')} onSearch={this.handleSearch} />
          <DataPane.Actions>
            <PrivilegeCover module="cwm" feature="blbook" action="edit">
              <Button type="primary" onClick={this.handleCreateNewGoods}>{this.msg('create')}</Button>
              <Button onClick={this.handleImportGoods} icon="import">{`导入${activeKey === 'endProduct' ? '成品' : '料件'}`}</Button>
              <Button onClick={this.handleExportGoods} icon="export">{`导出${activeKey === 'endProduct' ? '成品' : '料件'}`}</Button>
            </PrivilegeCover>
          </DataPane.Actions>
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="cwm" feature="blbook" action="delete">
              <ToolbarAction danger icon="delete" label={this.msg('delete')} confirm={this.msg('deleteConfirm')} onConfirm={this.handleBatchDelete} />
            </PrivilegeCover>
          </DataPane.BulkActions>
        </DataPane.Toolbar>
        <BookGoodsModal
          visible={visibleBlBookGoodsModal}
          onModalClose={this.handleGoodsModalClose}
          blBookInfo={{}}
          getFieldDecorator={getFieldDecorator}
          mode={mode}
          editInfo={editInfo}
          activeKey={activeKey}
        />
        <ImportDataPanel
          adaptors={null}
          title={`导入${activeKey === 'endProduct' ? '成品' : '料件'}`}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/pts/book/goods/import`}
          formData={{
            bookNo: bookHead.blbook_no,
            prdGoodsMark: activeKey === 'endProduct' ? 'E' : 'I',
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleBookGoodsUploaded}
          onGenTemplate={this.handleGenImprotTemplate}
        />
      </DataPane>
    );
  }
}

