import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag, Button } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import { loadBodyList } from 'common/reducers/cwmSasblReg';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SasblRegBodyModal from './modals/sasblRegBodyModal';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  state => ({
    sasblBodyList: state.cwmSasblReg.sasblBodyList,
    bodylistLoading: state.cwmSasblReg.listLoading,
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
  { loadBodyList }
)

export default class InventoryRegBodyPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    visibleNewBodyModal: false,
  };
  componentDidMount() {
    this.handleLoadBodyList();
  }
  msg = formatMsg(this.props.intl);
  handleShowGoodsModal = (record) => {
    this.setState({
      visibleNewBodyModal: true,
      editInfo: record,
    });
  }
  handleEditBody = (record) => {
    this.handleShowGoodsModal(record);
  }
  handleNewBodyModalClose = () => {
    this.setState({ visibleNewBodyModal: false });
    this.handleLoadBodyList();
  }
  msg = formatMsg(this.props.intl)
  handleLoadBodyList = (page, pageSize) => {
    const { sasblBodyList, copSasblNo, blType } = this.props;
    const currentPage = page || sasblBodyList.current;
    const currentSize = pageSize || sasblBodyList.pageSize;
    this.props.loadBodyList({
      copSasblNo,
      blType,
      pageSize: currentSize,
      current: currentPage,
    });
  }
  handleExportDetails = () => {
    const { blType, copSasblNo } = this.props;
    const params = { blType, copSasblNo };
    let fileName;
    if (blType === 'stock') {
      fileName = `出库单${copSasblNo}`;
    } else if (blType === 'invt') {
      fileName = `核注清单${copSasblNo}`;
    }
    window.open(`${API_ROOTS.default}v1/cwm/sasbl/body/export/${fileName}全部明细.xlsx?params=${
      JSON.stringify(params)}`);
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBodyList(page, pageSize);
  }
  handleSearch = () => {}
  render() {
    const {
      sasblBodyList, bodylistLoading, blType, preSasblNo, readonly, units,
      currencies, countries, copSasblNo,
    } = this.props;
    const { visibleNewBodyModal, editInfo } = this.state;
    const columns = [{
      title: this.msg('seqNo'),
      width: 45,
      align: 'center',
      className: 'table-col-seq',
      render: (o, record) => {
        if (record.invt_goods_seqno) {
          return record.invt_goods_seqno;
        } else if (record.stockio_goods_seqno) {
          return record.stockio_goods_seqno;
        }
        return record.pass_goods_seqno;
      },
    }];
    if (blType === 'pass') {
      columns.push({
        title: this.msg('rltGoodsNo'), // 关联单证商品序号
        dataIndex: 'pass_rlt_goods_seqno',
        width: 80,
      });
    } else {
      columns.push({
        title: this.msg('prdtItemNo'),
        dataIndex: 'prdt_item_no',
        width: 100,
      });
    }
    columns.push({
      title: this.msg('sgdProductNo'),
      dataIndex: 'sgd_product_no',
      width: 150,
    });
    if (blType === 'invt' || blType === 'stock') {
      columns.push({
        title: this.msg('entryGoodsSeqno'),
        dataIndex: 'entry_seqno',
        width: 120,
        align: 'center',
      }, {
        title: this.msg('applySeqNo'),
        dataIndex: 'apply_seq_no',
        width: 100,
        align: 'center',
      });
    }
    columns.push({
      title: this.msg('sgdHscode'),
      dataIndex: 'sgd_hscode',
      align: 'center',
      width: 120,
    }, {
      title: this.msg('sgdName'),
      dataIndex: 'sgd_name',
      width: 150,
    });
    if (blType === 'invt' || blType === 'stock') {
      columns.push({
        title: this.msg('sgdModel'),
        dataIndex: 'sgd_model',
        width: 180,
      });
    }
    columns.push({
      title: this.msg('sgdGGty'),
      dataIndex: 'sgd_g_qty',
      align: 'center',
      width: 100,
    }, {
      title: this.msg('sgdGUnit'),
      dataIndex: 'sgd_g_unit',
      width: 100,
      render: (o, record) => renderCombineData(record.sgd_g_unit, units),
    });
    if (blType === 'invt' || blType === 'stock') {
      columns.push({
        title: this.msg('sgdQty1'),
        dataIndex: 'sgd_qty_1',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdUnit1'),
        dataIndex: 'sgd_unit_1',
        align: 'center',
        width: 100,
        render: (o, record) => renderCombineData(record.sgd_unit_1, units),
      }, {
        title: this.msg('sgdQty2'),
        dataIndex: 'sgd_qty_2',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdUnit2'),
        dataIndex: 'sgd_unit_2',
        align: 'center',
        width: 100,
        render: (o, record) => renderCombineData(record.sgd_unit_2, units),
      }, {
        title: this.msg('sgdOrigCountry'),
        dataIndex: 'sgd_orig_country',
        align: 'center',
        width: 100,
        render: (o, record) => renderCombineData(record.sgd_orig_country, countries),
      }, {
        title: this.msg('sgdDestCountry'),
        dataIndex: 'sgd_dest_country',
        align: 'center',
        width: 140,
        render: (o, record) => renderCombineData(record.sgd_dest_country, countries),
      }, {
        title: this.msg('sgdDecPrice'),
        dataIndex: 'sgd_dec_price',
        align: 'right',
        width: 100,
        render: decPrice => decPrice || null,
      }, {
        title: this.msg('sgdAmount'),
        dataIndex: 'sgd_amount',
        align: 'right',
        width: 100,
      }, {
        title: this.msg('sgdCurrency'),
        dataIndex: 'sgd_currency',
        align: 'center',
        width: 120,
        render: (o, record) => renderCombineData(record.sgd_currency, currencies),
      }, {
        title: this.msg('sgdWtFactor'),
        dataIndex: 'sgd_wt_factor',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdFactor1'),
        dataIndex: 'sgd_factor1',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdFactor2'),
        dataIndex: 'sgd_factor2',
        align: 'center',
        width: 100,
      });
    }
    columns.push({
      title: this.msg('sgdGrosswt'),
      dataIndex: 'sgd_grosswt',
      align: 'center',
      width: 100,
    }, {
      title: this.msg('sgdNetwt'),
      dataIndex: 'sgd_netwt',
      align: 'center',
      width: 100,
    });
    if (blType === 'invt' || blType === 'stock') {
      columns.push({
        title: this.msg('modifyMarkcd'),
        dataIndex: 'modify_flag',
        align: 'center',
        width: 100,
      // }, {
      //   title: this.msg('sgdUseTo'),
      //   dataIndex: 'sgd_use_to',
      //   align: 'center',
      //   width: 100,
      }, {
        title: this.msg('dutyMode'),
        dataIndex: 'sgd_duty_mode',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('uconsumptionNo'),
        dataIndex: 'uconsumption_no',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('自动备案序号'),
        dataIndex: 'NO', // ###NO
        align: 'center',
        width: 100,
      });
    }
    if (blType === 'pass') {
      columns.push({
        title: this.msg('remark'), // 备注
        dataIndex: 'sgd_remark',
        width: 100,
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
      render: (o, record) => (!readonly && <PrivilegeCover module="cwm" feature="supervision" action="edit">
        <RowAction onClick={this.handleEditBody} row={record} icon="edit" tooltip={this.msg('edit')} />
      </PrivilegeCover>
      ),
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: sasblBodyList.current,
      pageSize: sasblBodyList.pageSize,
      total: sasblBodyList.totalCount,
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
        dataSource={sasblBodyList ? sasblBodyList.data : []}
        indentSize={0}
        rowKey="id"
        loading={bodylistLoading}
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox onSearch={this.handleSearch} />
          {(blType === 'stock' || blType === 'invt') && <Button icon="download" onClick={this.handleExportDetails}>表体导出</Button>}
        </DataPane.Toolbar>
        <SasblRegBodyModal
          visible={visibleNewBodyModal}
          onModalClose={this.handleNewBodyModalClose}
          editInfo={editInfo}
          blType={blType}
          preSasblNo={preSasblNo}
          copSasblNo={copSasblNo}
        />
      </DataPane>
    );
  }
}

