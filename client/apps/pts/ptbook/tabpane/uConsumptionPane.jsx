import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, message, notification } from 'antd';
import DataPane from 'client/components/DataPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import RowAction from 'client/components/RowAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import { createFilename } from 'client/util/dataTransform';
import { loadBookUConsumList, deleteBookUConsum } from 'common/reducers/ptsBook';
import SearchBox from 'client/components/SearchBox';
import { MODIFY_MARK, PTS_BOOK_TYPE } from 'common/constants';
import ToolbarAction from 'client/components/ToolbarAction';
import UConsumDetailsModal from '../modals/uConsumDetailsModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    bookHead: state.ptsBook.bookData,
    uConsumList: state.ptsBook.uConsumList,
    uConsumListLoading: state.ptsBook.uConsumList.uConsumListLoading,
  }),
  { loadBookUConsumList, deleteBookUConsum }
)

export default class UConsumptionPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bookHead: PropTypes.shape({
      blbook_no: PropTypes.string.isRequired,
    }),
  }
  state = {
    selectedRowKeys: [],
    visibleUconsumDetailsModal: false,
    searchFields: '',
    importPanelVisible: false,
  };
  componentDidMount() {
    this.handleLoadBodyList();
  }
  getColumns() {
    const { bookHead } = this.props;
    const isManualBook = bookHead.blbook_type === PTS_BOOK_TYPE.MBOOK;
    const columns = [
      {
        title: this.msg('goodsSeqno'),
        dataIndex: 'goods_seqno',
        width: 80,
        align: 'center',
        className: 'table-col-seq',
      }, {
        title: this.msg('endProductSeqNo'),
        dataIndex: 'end_product_seq_no',
        width: 80,
      }, {
        title: this.msg('endProductNo'),
        dataIndex: 'end_product_no',
        width: 100,
      }, {
        title: this.msg('endProductHscode'),
        dataIndex: 'end_product_hscode',
        width: 100,
      }, {
        title: this.msg('endProductName'),
        dataIndex: 'end_product_name',
        width: 140,
      }, {
        title: this.msg('materialsSeqNo'),
        dataIndex: 'materials_seq_no',
        width: 80,
      }, {
        title: this.msg('materialsProductNo'),
        dataIndex: 'materials_product_no',
        width: 100,
      }, {
        title: this.msg('materialsHscode'),
        dataIndex: 'materials_hscode',
        width: 100,
      }, {
        title: this.msg('materialsName'),
        dataIndex: 'materials_name',
        width: 140,
      }, {
        title: this.msg('uconsumptionNo'),
        dataIndex: 'uconsumption_no',
        width: 100,
      }, {
        title: this.msg('uconsumptionQty'),
        dataIndex: 'uconsumption_qty',
        width: 80,
      }, {
        title: this.msg('netUseQty'),
        dataIndex: 'net_use_qty',
        width: 80,
      }, {
        title: this.msg('tangibleLossRate'),
        dataIndex: 'tangible_loss_rate',
        width: 100,
      }, {
        title: this.msg('intangibleLossRate'),
        dataIndex: 'intangible_loss_rate',
        width: 100,
      }, {
        title: this.msg('uconsumDeclStatus'),
        dataIndex: 'uconsum_decl_status',
        width: 100,
        render: (o) => {
          if (o === '1') {
            return '未申报';
          } else if (o === '2') {
            return '已申报';
          }
          return '已确定';
        },
      }, {
        title: this.msg('bondMaterialsRate'),
        dataIndex: 'bond_materials_rate',
        width: 100,
      }, {
        title: this.msg('modifyMark'),
        dataIndex: 'modify_mark',
        width: 100,
        render: (o) => {
          const mark = MODIFY_MARK.find(mk => mk.value === o);
          return mark ? mark.text : '';
        },
      }, {
        title: this.msg('modifyTimes'),
        dataIndex: 'modify_times',
        width: 100,
      }, {
        title: this.msg('uconsumExpiryDate'),
        dataIndex: 'uconsum_expiry_date',
        width: 100,
        render: exp => exp && moment(exp).format('YYYY-MM-DD'),
      }, {
        title: this.msg('opCol'),
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        fixed: 'right',
        width: 90,
        render: (o, record) => (!this.props.readonly && <span>
          (<PrivilegeCover module="cwm" feature="bookHead" action="edit">
            <RowAction onClick={this.handleEditGoods} icon="edit" row={record} tooltip={this.msg('edit')} />
          </PrivilegeCover>
          <PrivilegeCover module="cwm" feature="blbook" action="delete">
            <RowAction confirm={this.msg('deleteConfirm')} onConfirm={this.handleDeleteRow} row={record} icon="delete" tooltip={this.msg('delete')} />
          </PrivilegeCover></span>),
      },
    ];
    if (isManualBook) {
      const manualBookColumns = [...columns];
      manualBookColumns.splice(-2, 1, {
        title: this.msg('uconsumExecFlag'),
        dataIndex: 'uconsum_exec_flag',
        width: 100,
        render: (o) => {
          if (o === '2') {
            return '停用';
          }
          return '运行';
        },
      });
    }
    return columns;
  }
  msg = formatMsg(this.props.intl);
  handleShowGoodsModal = (mode, record) => {
    this.setState({
      visibleUconsumDetailsModal: true,
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
    this.setState({ visibleUconsumDetailsModal: false });
    this.handleLoadBodyList();
  }
  msg = formatMsg(this.props.intl)
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleDeleteRow = (record) => {
    this.props.deleteBookUConsum([record.id]).then((result) => {
      if (!result.error) {
        message.success('删除成功');
        this.handleLoadBodyList();
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleBatchDelete = () => {
    const idList = this.state.selectedRowKeys;
    this.props.deleteBookUConsum(idList).then((result) => {
      if (!result.error) {
        message.success('删除成功');
        this.handleDeselectRows();
        this.handleLoadBodyList();
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleLoadBodyList = (page, pageSize, searchFields) => {
    const { uConsumList, bookHead } = this.props;
    const currentPage = page || uConsumList.current;
    const currentSize = pageSize || uConsumList.pageSize;
    const currentSearchFields = searchFields || this.state.searchFields;
    this.props.loadBookUConsumList({
      bookNo: bookHead.blbook_no,
      pageSize: currentSize,
      current: currentPage,
      searchFields: currentSearchFields,
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBodyList(page, pageSize);
  }
  handleSearch = (value) => {
    this.setState({ searchFields: value });
    this.handleLoadBodyList(1, null, value);
  }
  handleImportUConsums = () => {
    this.setState({ importPanelVisible: true });
  }
  handleExportUConsums = () => {
    const { bookHead, uConsumList } = this.props;
    if (uConsumList.data.length > 0) {
      const params = { bookNo: bookHead.blbook_no };
      window.open(`${API_ROOTS.default}v1/pts/book/uconsums/export/${bookHead.blbook_no}单耗.xlsx?params=${
        JSON.stringify(params)}`);
    } else {
      message.warning('无可导出项');
    }
  }
  handleBookUConsumsUploaded = (data) => {
    if (!data) {
      notification.success({
        message: '导入成功',
        description: '数据已全部导入',
        key: 'continue-edit',
        duration: 0,
      });
    } else {
      const {
        noValid, repeatPrdtItemNo, invalidSeqNo,
      } = data;
      const errorInfo = [];
      if (noValid.length > 0) {
        errorInfo.push(`第${noValid.join(',')}行，缺少必填字段`);
      }
      if (repeatPrdtItemNo.length > 0) {
        errorInfo.push(`第${repeatPrdtItemNo.join(',')}行，数据库已存在，需要更新请选择重复覆盖`);
      }
      if (invalidSeqNo.length > 0) {
        errorInfo.push(`第${invalidSeqNo.join(',')}行，对应序号的料件或成品在表体中不存在。`);
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
    const params = { mode: 'downTemplate' };
    window.open(`${API_ROOTS.default}v1/pts/book/uconsums/export/${createFilename('unit_cousumption')}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  render() {
    const {
      uConsumList, uConsumListLoading, bookHead,
      form: { getFieldDecorator },
    } = this.props;
    const columns = this.getColumns();
    const { visibleUconsumDetailsModal, mode, editInfo } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: uConsumList.current,
      pageSize: uConsumList.pageSize,
      total: uConsumList.totalCount,
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
        dataSource={uConsumList ? uConsumList.data : []}
        indentSize={0}
        rowKey="id"
        loading={uConsumListLoading}
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox value={this.state.searchFields} placeholder={this.msg('序号/料号/品名')} onSearch={this.handleSearch} />
          <DataPane.Actions>
            <PrivilegeCover module="cwm" feature="blbook" action="edit">
              <Button type="primary" onClick={this.handleCreateNewGoods}>{this.msg('create')}</Button>
              <Button onClick={this.handleImportUConsums} icon="import">导入单耗</Button>
              <Button onClick={this.handleExportUConsums} icon="export">导出单耗</Button>
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
        <UConsumDetailsModal
          visible={visibleUconsumDetailsModal}
          onModalClose={this.handleGoodsModalClose}
          blBookInfo={{}}
          getFieldDecorator={getFieldDecorator}
          mode={mode}
          editInfo={editInfo}
        />
        <ImportDataPanel
          adaptors={null}
          title="导入单耗"
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/pts/book/uconsums/import`}
          formData={{
            bookNo: bookHead.blbook_no,
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleBookUConsumsUploaded}
          onGenTemplate={this.handleGenImprotTemplate}
        />
      </DataPane>
    );
  }
}

