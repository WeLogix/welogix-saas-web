import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import { loadInvtBodyList } from 'common/reducers/ptsImpExp';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import InvtBodyModal from '../modals/invtBodyModal';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  state => ({
    invtBodyList: state.ptsImpExp.invtBodyList,
    bodylistLoading: state.ptsImpExp.bodylistLoading,
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
  { loadInvtBodyList }
)

export default class PtsInvtBodyPane extends React.Component {
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
    this.handleloadInvtBodyList();
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
    this.handleloadInvtBodyList();
  }
  msg = formatMsg(this.props.intl)
  handleloadInvtBodyList = (page, pageSize) => {
    const { invtBodyList, copInvtNo } = this.props;
    const currentPage = page || invtBodyList.current;
    const currentSize = pageSize || invtBodyList.pageSize;
    this.props.loadInvtBodyList({
      copInvtNo,
      pageSize: currentSize,
      current: currentPage,
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleloadInvtBodyList(page, pageSize);
  }
  render() {
    const {
      invtBodyList, bodylistLoading, readonly, units,
      currencies, countries, copInvtNo,
    } = this.props;
    const { visibleNewBodyModal, editInfo } = this.state;
    const columns = [{
      title: this.msg('seqNo'),
      width: 60,
      align: 'center',
      render: (o, record) => {
        if (record.invt_goods_seqno) {
          return record.invt_goods_seqno;
        } else if (record.stockio_goods_seqno) {
          return record.stockio_goods_seqno;
        }
        return record.pass_goods_seqno;
      },
    }, {
      title: this.msg('prdtItemNo'),
      dataIndex: 'prdt_item_no',
      width: 100,
      align: 'center',
    }, {
      title: this.msg('sgdProductNo'),
      dataIndex: 'sgd_product_no',
      width: 120,
    }, {
      title: this.msg('entryGoodsSeqno'),
      dataIndex: 'entry_seqno',
      width: 120,
      align: 'center',
    }, {
      title: this.msg('applySeqNo'),
      dataIndex: 'apply_seq_no',
      width: 100,
      align: 'center',
    }, {
      title: this.msg('sgdHscode'),
      dataIndex: 'sgd_hscode',
      align: 'center',
      width: 120,
    }, {
      title: this.msg('sgdName'),
      dataIndex: 'sgd_name',
      width: 100,
    }, {
      title: this.msg('sgdModel'),
      dataIndex: 'sgd_model',
      width: 180,
    }, {
      title: this.msg('sgdGUnit'),
      dataIndex: 'sgd_g_unit',
      width: 100,
      render: (o, record) => renderCombineData(record.sgd_g_unit, units),
    }, {
      title: this.msg('sgdUnit1'),
      dataIndex: 'sgd_unit_1',
      align: 'center',
      width: 100,
      render: (o, record) => renderCombineData(record.sgd_unit_1, units),
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
      width: 100,
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
      title: this.msg('sgdQty1'),
      dataIndex: 'sgd_qty_1',
      align: 'center',
      width: 100,
    }, {
      title: this.msg('sgdQty2'),
      dataIndex: 'sgd_qty_2',
      align: 'center',
      width: 100,
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
    }, {
      title: this.msg('sgdGGty'),
      dataIndex: 'sgd_g_qty',
      align: 'center',
      width: 100,
    }, {
      title: this.msg('sgdGrosswt'),
      dataIndex: 'sgd_grosswt',
      align: 'center',
      width: 100,
    }, {
      title: this.msg('sgdNetwt'),
      dataIndex: 'sgd_netwt',
      align: 'center',
      width: 100,
    }, {
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
    }, {
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
    }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: invtBodyList.current,
      pageSize: invtBodyList.pageSize,
      total: invtBodyList.totalCount,
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
        dataSource={invtBodyList ? invtBodyList.data : []}
        indentSize={0}
        rowKey="id"
        loading={bodylistLoading}
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox onSearch={this.handleSearch} />
        </DataPane.Toolbar>
        <InvtBodyModal
          visible={visibleNewBodyModal}
          onModalClose={this.handleNewBodyModalClose}
          editInfo={editInfo}
          copInvtNo={copInvtNo}
        />
      </DataPane>
    );
  }
}

