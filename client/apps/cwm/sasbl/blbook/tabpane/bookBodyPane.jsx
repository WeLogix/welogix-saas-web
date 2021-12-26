import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, notification, Tag } from 'antd';
import moment from 'moment';
import DataPane from 'client/components/DataPane';
import { createFilename } from 'client/util/dataTransform';
import ImportDataPanel from 'client/components/ImportDataPanel';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import RowAction from 'client/components/RowAction';
import { loadBlBookGoodsList } from 'common/reducers/cwmBlBook';
import SearchBox from 'client/components/SearchBox';
import BlBookGoodsModal from '../modals/blBookGoodsModal';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  state => ({
    blBook: state.cwmBlBook.blBookData,
    filters: state.cwmBlBook.goodslistFilters,
    blBookGoodsList: state.cwmBlBook.blBookGoodsList,
    blBookGoodsListLoading: state.cwmBlBook.blBookGoodsList.blBookGoodsListLoading,
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
  { loadBlBookGoodsList }
)

export default class BLBookBodyPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    importPanelVisible: false,
    visibleBlBookGoodsModal: false,
  };
  componentDidMount() {
    this.handleLoadBodyList();
  }
  getColumns() {
    const { countries, units, currencies } = this.props;
    const columns = [
      {
        title: this.msg('prdtItemNo'),
        dataIndex: 'prdt_item_no',
        width: 80,
        align: 'center',
        className: 'table-col-seq',
      }, {
        title: this.msg('productNo'),
        dataIndex: 'product_no',
        width: 120,
      }, {
        title: this.msg('hscode'),
        dataIndex: 'hscode',
        width: 120,
      }, {
        title: this.msg('ciqcode'),
        dataIndex: 'ciqcode',
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
        align: 'center',
        width: 100,
        render: (o, record) => renderCombineData(record.country, countries),
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
      }, {
        title: this.msg('unit2'),
        dataIndex: 'unit_2',
        width: 100,
        render: (o, record) => renderCombineData(record.unit_2, units),
      }, {
        title: this.msg('decPrice'),
        dataIndex: 'dec_price',
        align: 'center',
        width: 80,
      }, {
        title: this.msg('currency'),
        dataIndex: 'currency',
        align: 'center',
        width: 80,
        render: (o, record) => renderCombineData(record.currency, currencies),
      }, {
        title: this.msg('blbgInvalid'),
        dataIndex: 'blbg_invalid',
        align: 'center',
        width: 100,
        render: (o, record) => (record.blbg_invalid === 1 ? <span>是</span> : <span>否</span>),
      }, {
        title: this.msg('blbgExpirayDate'),
        dataIndex: 'blbg_expiray_date',
        width: 100,
        render: exp => exp && moment(exp).format('YYYY-MM-DD'),
        sorter: (a, b) => new Date(a.blbg_expiray_date).getTime() -
         new Date(b.blbg_expiray_date).getTime(),
      }, {
        title: this.msg('blbgFreeupDate'),
        dataIndex: 'blbg_freeup_date',
        width: 100,
        render: fre => fre && moment(fre).format('YYYY-MM-DD'),
        sorter: (a, b) => new Date(a.blbg_freeup_date).getTime() -
        new Date(b.blbg_freeup_date).getTime(),
      }, {
        title: this.msg('invtNo'),
        dataIndex: 'invt_no',
        width: 180,
      }, {
        title: this.msg('invtSeqNo'),
        dataIndex: 'invt_seq_no',
        width: 100,
      }, {
        title: this.msg('remark'),
        dataIndex: 'remark',
        width: 100,
      }, {
        dataIndex: 'SPACER_COL',
      }, {
        title: this.msg('opCol'),
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        fixed: 'right',
        width: 90,
        render: (o, record) => (!this.props.readonly &&
          (<PrivilegeCover module="cwm" feature="blbook" action="edit">
            <RowAction onClick={this.handleEditGoods} icon="edit" row={record} tooltip={this.msg('edit')} />
          </PrivilegeCover>)
        ),
      },
    ];
    return columns;
  }
  msg = formatMsg(this.props.intl);
  handleImportBlBook = () => {
    this.setState({
      importPanelVisible: true,
    });
  }
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
  handleblBookGoodsUploaded = (data) => {
    if (!data) {
      notification.success({
        message: '导入成功',
        description: '数据已全部导入',
        key: 'continue-edit',
        duration: 0,
      });
    } else {
      const {
        blbookNoErr, expirayDateLess, noValid, nonFreeUpDate, repeatProNoGoodsByValid,
        hscodeOutScope, repoConflicts, repoNonexists, nonRepoUser, skipCount,
        repeatNos, discontinuityNos,
      } = data;
      const errInfo = [];
      if (repeatNos || discontinuityNos) {
        const errorMsg = [];
        if (repeatNos.length > 0) {
          errorMsg.push(`项号${repeatNos.join(',')}重复，`);
        }
        if (discontinuityNos.length > 0) {
          errorMsg.push(`项号${discontinuityNos.join(',')}错误，导入明细项号应该连续增加`);
        }
        notification.error({
          message: '导入终止',
          description: errorMsg,
          key: 'importInfo',
          duration: 0,
        });
        return;
      }
      if (repoConflicts.length !== 0 || repoNonexists.length !== 0 || nonRepoUser.length) {
        errInfo.push('导入已终止。');
        if (nonRepoUser.length > 0) {
          errInfo.push(`请先创建与${nonRepoUser[0]}，对应的归类库。`);
        }
        if (repoConflicts.length > 0) {
          errInfo.push(`货号${repoConflicts.join(',')}，与归类库冲突，归类冲突待解决。`);
        }
        if (repoNonexists.length > 0) {
          errInfo.push(`货号${repoNonexists.join(',')}，归类库中不存在，归类任务待完成`);
        }
        notification.error({
          message: '导入终止',
          description: errInfo,
          key: 'importInfo',
          duration: 0,
        });
        return;
      }
      if (skipCount > 0) {
        errInfo.push(`导入终止。存在${skipCount}条无效行。`);
        if (blbookNoErr.length > 0) {
          errInfo.push(`第${blbookNoErr.join(',')}行，账册编号错误。`);
        }
        if (expirayDateLess.length > 0) {
          errInfo.push(`第${expirayDateLess.join(',')}行，有效日期小于增补日期。`);
        }
        if (noValid.length > 0) {
          errInfo.push(`第${noValid.join(',')}行，缺少必要字段。`);
        }
        if (nonFreeUpDate.length > 0) {
          errInfo.push(`第${nonFreeUpDate.join(',')}行，缺少增补日期。`);
        }
        if (repeatProNoGoodsByValid.length > 0) {
          errInfo.push(`第${repeatProNoGoodsByValid.join(',')}行，表体中已存在相同货号的未禁用项。`);
        }
        if (hscodeOutScope.length > 0) {
          errInfo.push(`第${hscodeOutScope.join(',')}行，HS编码超出IK账册范围。`);
        }
      }
      notification.info({
        message: '导入完成',
        description: errInfo,
        key: 'importInfo',
        duration: 0,
      });
    }
    this.setState({ importPanelVisible: false });
    this.handleLoadBodyList();
  }
  msg = formatMsg(this.props.intl)
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleGenTemplate = () => {
    const params = { mode: 'downTemplate' };
    window.open(`${API_ROOTS.default}v1/cwm/blbook/body/export/${createFilename('blbook_goods')}.xlsx?params=${
      JSON.stringify(params)}`);
  }
  handleLoadBodyList = (page, pageSize, paramFilter) => {
    const { blBookGoodsList, blBook, filters } = this.props;
    const currentPage = page || blBookGoodsList.current;
    const currentSize = pageSize || blBookGoodsList.pageSize;
    const currentFilter = paramFilter || filters;
    this.props.loadBlBookGoodsList({
      blBookNo: blBook.blbook_no,
      pageSize: currentSize,
      current: currentPage,
      filters: currentFilter,
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBodyList(page, pageSize);
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, searchFields: value };
    this.handleLoadBodyList(1, null, filters);
  }
  handleExportBlBook = () => {
    const blBookNo = this.props.blBook.blbook_no;
    const idList = this.state.selectedRowKeys;
    const params = { blBookNo, status: 1 };
    if (idList.length > 0) {
      params.idList = idList;
    }
    window.open(`${API_ROOTS.default}v1/cwm/blbook/body/export/账册${blBookNo}全部明细.xlsx?params=${
      JSON.stringify(params)}`);
  }
  render() {
    const {
      blBook, blBookGoodsList, blBookGoodsListLoading,
      form: { getFieldDecorator }, readonly, filters,
    } = this.props;
    const columns = this.getColumns();
    const { visibleBlBookGoodsModal, mode, editInfo } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
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
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        dataSource={blBookGoodsList ? blBookGoodsList.data : []}
        indentSize={0}
        rowKey="id"
        loading={blBookGoodsListLoading}
        pagination={pagination}
      >
        {!readonly ?
          (<DataPane.Toolbar>
            <SearchBox value={filters.searchFields} placeholder={this.msg('序号/料号/商品编号/品名')} onSearch={this.handleSearch} />
            <PrivilegeCover module="cwm" feature="blbook" action="edit">
              <Button onClick={this.handleImportBlBook}>{this.msg('导入已备案数据')}</Button>
            </PrivilegeCover>
            <Button onClick={this.handleExportBlBook}>{this.msg('导出已备案明细')}</Button>
          </DataPane.Toolbar>) :
          (<DataPane.Toolbar>
            <SearchBox value={filters.searchFields} placeholder={this.msg('序号/料号/商品编号/品名')} onSearch={this.handleSearch} />
          </DataPane.Toolbar>)
        }
        <ImportDataPanel
          adaptors={null}
          title={this.msg('importPanelTitle')}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cwm/blbook/body/import`}
          formData={{
            blBookNo: blBook.blbook_no,
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleblBookGoodsUploaded}
          onGenTemplate={this.handleGenTemplate}
        />
        <BlBookGoodsModal
          visible={visibleBlBookGoodsModal}
          onModalClose={this.handleGoodsModalClose}
          blBookInfo={{}}
          getFieldDecorator={getFieldDecorator}
          mode={mode}
          editInfo={editInfo}
        />
      </DataPane>
    );
  }
}

