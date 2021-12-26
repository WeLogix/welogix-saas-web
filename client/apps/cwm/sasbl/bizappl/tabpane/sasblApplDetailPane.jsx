import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { Button } from 'antd';
import SearchBox from 'client/components/SearchBox';
import { loadBizApplDetailList } from 'common/reducers/cwmSasblReg';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import BizApplBodyModal from '../modals/bizApplBodyModal';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    bizApplDetailList: state.cwmSasblReg.bizApplDetailList,
    bizApplDetailsLoading: state.cwmSasblReg.bizApplDetailsLoading,
  }),
  { loadBizApplDetailList }
)
export default class SasblApplDetailPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    visibleNewBodyModal: false,
    modalStatus: 'add',
  };
  componentDidMount() {
    this.handleLoadBizApplDetailList();
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
    this.setState({ modalStatus: 'edit' });
  }
  handleAddBody = () => {
    this.handleShowGoodsModal({});
    this.setState({ modalStatus: 'add' });
  }
  handleNewBodyModalClose = () => {
    this.setState({ visibleNewBodyModal: false });
    this.handleLoadBizApplDetailList();
  }
  msg = formatMsg(this.props.intl)
  handleLoadBizApplDetailList = (page, pageSize) => {
    const { copBizApplNo } = this.context.router.params;
    const { bizApplDetailList } = this.props;
    const currentPage = page || bizApplDetailList.current;
    const currentSize = pageSize || bizApplDetailList.pageSize;
    this.props.loadBizApplDetailList({
      copBizApplNo,
      pageSize: currentSize,
      current: currentPage,
    });
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadBizApplDetailList(page, pageSize);
  }
  handleSearch = () => {}
  render() {
    const {
      bizApplDetailList, bizApplDetailsLoading, blType, readonly,
    } = this.props;
    const { visibleNewBodyModal, editInfo, modalStatus } = this.state;
    const columns = [
      {
        title: this.msg('seqNo'),
        width: 80,
        align: 'center',
        dataIndex: 'ba_seqno',
      }, {
        title: this.msg('prdtItemNo'),
        dataIndex: 'prdt_item_no',
        width: 120,
      }, {
        title: this.msg('sgdProductNo'),
        dataIndex: 'ba_product_no',
        width: 120,
      }, {
        title: this.msg('sgdHscode'),
        dataIndex: 'ba_hscode',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdName'),
        dataIndex: 'ba_name',
        width: 100,
      }, {
        title: this.msg('sgdModel'),
        dataIndex: 'ba_model',
        width: 150,
      }, {
        title: this.msg('sgdQty'),
        dataIndex: 'ba_qty',
        width: 100,
      }, {
        title: this.msg('sgdGUnit'),
        dataIndex: 'ba_g_unit',
        width: 100,
      }, {
        title: this.msg('sgdUnit1'),
        dataIndex: 'ba_unit_1',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdUnit2'),
        dataIndex: 'ba_unit_2',
        align: 'center',
        width: 100,
      }, {
        title: this.msg('sgdDecPrice'),
        dataIndex: 'ba_dec_price',
        align: 'center',
        width: 120,
      }, {
        title: this.msg('sgdAmount'),
        dataIndex: 'ba_amount',
        align: 'center',
        width: 120,
      }, {
        title: this.msg('sgdCurrency'),
        dataIndex: 'ba_currency',
        align: 'center',
        width: 80,
      }, {
        title: this.msg('备注'),
        dataIndex: 'gds_remark',
        align: 'center',
        width: 80,
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
      },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: bizApplDetailList.current,
      pageSize: bizApplDetailList.pageSize,
      total: bizApplDetailList.totalCount,
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
        dataSource={bizApplDetailList ? bizApplDetailList.data : []}
        indentSize={0}
        rowKey="id"
        loading={bizApplDetailsLoading}
        pagination={pagination}
      >
        <DataPane.Toolbar>
          <SearchBox onSearch={this.handleSearch} />
          <PrivilegeCover module="cwm" feature="supervision" action="create">
            <Button icon="plus-circle-o" onClick={this.handleAddBody} disabled={readonly}>{this.msg('add')}</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
        <BizApplBodyModal
          visible={visibleNewBodyModal}
          onModalClose={this.handleNewBodyModalClose}
          editInfo={editInfo}
          blType={blType}
          modalStatus={modalStatus}
        />
      </DataPane>
    );
  }
}

