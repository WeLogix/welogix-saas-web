import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { intlShape, injectIntl } from 'react-intl';
import { showDetailModal } from 'common/reducers/cwmReceive';
import { showAsnSelectModal, setSoDetails, delSoDetails } from 'common/reducers/cwmShippingOrder';
import { CWM_SO_TYPES } from 'common/constants';
import AddDetailModal from '../modal/addDetailModal';
import AsnSelectModal from '../modal/asnSelectModal';
import { formatMsg } from '../../message.i18n';
import SKUPopover from '../../../common/popover/skuPopover';

@injectIntl
@connect(
  state => ({
    soHead: state.cwmShippingOrder.soHead,
    soDetails: state.cwmShippingOrder.soDetails,
    units: state.saasParams.latest.unit.map(un => ({
      code: un.unit_code,
      name: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      code: curr.curr_code,
      name: curr.curr_name,
    })),
  }),
  {
    showDetailModal, showAsnSelectModal, setSoDetails, delSoDetails,
  }
)
export default class SODetailsPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldValue: PropTypes.func.isRequired }).isRequired,
    editable: PropTypes.bool,
    detailEnable: PropTypes.bool.isRequired,
    selectedOwner: PropTypes.number,
  }
  state = {
    selectedRowKeys: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
      showSizeChanger: true,
      onChange: this.handlePageChange,
    },
    editRecord: {},
    edit: false,
  };
  // componentWillReceiveProps(nextProps) {
  //   const { soBody } = nextProps;
  //   if (soBody && (nextProps.soBody !== this.props.soBody)) {
  //     this.props.setSoDetails(soBody);
  //   }
  // }
  msg = formatMsg(this.props.intl)
  handlePageChange = (current) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
      },
    });
  }
  showDetailModal = () => {
    this.setState({
      edit: false,
    });
    this.props.showDetailModal();
  }
  handleDelete = (row) => {
    const { soHead } = this.props;
    let soDetails = [...this.props.soDetails];
    soDetails.splice(row.index, 1);
    if (soHead.so_no && !row.unsaved) {
      soDetails = soDetails.map((item, index) => ({ ...item, so_seq_no: index + 1 }));
      this.props.delSoDetails(
        [row.so_seq_no],
        soHead.so_no,
        soHead.cust_order_no
      ).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
    this.props.setSoDetails(soDetails);
  }
  handleEdit = (row) => {
    this.setState({
      editRecord: row,
      edit: true,
    });
    this.props.showDetailModal();
  }
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    const { soDetails, soHead } = this.props;
    const deleteDetails = soDetails.filter((detail, index) =>
      selectedRowKeys.includes(index) && !detail.unsaved);
    let newDetails = soDetails.filter((detail, index) =>
      !selectedRowKeys.includes(index) || detail.unsaved);
    this.setState({
      selectedRowKeys: [],
    });
    if (soHead.so_no) {
      newDetails = newDetails.map((item, index) => ({ ...item, so_seq_no: index + 1 }));
      this.props.delSoDetails(
        deleteDetails.map(item => item.so_seq_no),
        soHead.so_no,
        soHead.cust_order_no
      ).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
    this.props.setSoDetails(newDetails);
  }
  showAsnSelectModal = () => {
    this.props.showAsnSelectModal();
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const {
      editable, soDetails, detailEnable, units, currencies, form, soHead,
    } = this.props;
    const { pagination } = this.state;
    const soType = form.getFieldValue('so_type') || soHead.so_type;
    const bonded = form.getFieldValue('bonded') !== undefined ? form.getFieldValue('bonded') : soHead.bonded;
    const regType = form.getFieldValue('reg_type') || soHead.bonded_outtype;
    const ownerPartnerId = form.getFieldValue('owner_partner_id') || soHead.owner_partner_id;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const columns = [{
      title: '行号',
      dataIndex: 'so_seq_no',
      width: 50,
      align: 'center',
      render: (col, row, index) => col ||
      (pagination.pageSize * (pagination.current - 1)) + index + 1,
    }, {
      title: '商品货号',
      dataIndex: 'product_no',
      width: 200,
    }, {
      title: '中文品名',
      dataIndex: 'name',
      width: 250,
    }, {
      title: '订单数量',
      width: 100,
      dataIndex: 'order_qty',
      align: 'right',
    }, {
      title: '计量单位',
      dataIndex: 'unit',
      width: 100,
      align: 'center',
      render: (o) => {
        const unit = units.find(item => item.code === o);
        if (unit) return unit.name;
        return '';
      },
    }, {
      title: '库别',
      dataIndex: 'virtual_whse',
      width: 150,
    }, {
      title: 'SKU',
      dataIndex: 'product_sku',
      width: 150,
      render: o => (o ? (<SKUPopover ownerPartnerId={this.props.selectedOwner} sku={o} />) : <span style={{ color: 'red' }}>请设置sku</span>),
    }, {
      title: '入库单号',
      dataIndex: 'asn_cust_order_no',
      width: 150,
    }, {
      title: '批次号',
      dataIndex: 'external_lot_no',
      width: 150,
    }, {
      title: '供货商',
      dataIndex: 'supplier',
      width: 120,
    }, {
      title: '单价',
      dataIndex: 'unit_price',
      width: 100,
      align: 'right',
    }, {
      title: '总价',
      dataIndex: 'amount',
      width: 100,
      align: 'right',
    }, {
      title: '币制',
      width: 100,
      dataIndex: 'currency',
      render: (o) => {
        const currency = currencies.find(curr => Number(curr.code) === Number(o));
        if (currency) {
          return <span>{currency.name}</span>;
        }
        return o;
      },
    }, {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (o, record) => (
        <span>
          <RowAction onClick={this.handleEdit} icon="edit" row={record} />
          <RowAction confirm="确定删除?" onConfirm={this.handleDelete} icon="delete" row={record} />
        </span>
      ),
    }];
    let detailAddDisabled = !editable;
    if (!detailAddDisabled) {
      detailAddDisabled = !detailEnable || soType === CWM_SO_TYPES[2].value;
    }
    let crossAsnDisabled = !editable;
    if (!crossAsnDisabled) {
      crossAsnDisabled = !detailEnable ||
        ((soType !== CWM_SO_TYPES[2].value) && (soType !== CWM_SO_TYPES[3].value));
    }
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={soDetails.map((item, index) => ({ ...item, index }))}
        rowKey="index"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <Button type="primary" icon="plus-circle-o" disabled={detailAddDisabled} onClick={this.showDetailModal}>添加</Button>
          {/* <Button icon="upload" disabled={detailAddDisabled}>导入</Button> */}
          <Button disabled={crossAsnDisabled} onClick={this.showAsnSelectModal}>选择ASN</Button>
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <Button onClick={this.handleBatchDelete} icon="delete" />
          </DataPane.BulkActions>
        </DataPane.Toolbar>
        <AddDetailModal
          product={this.state.editRecord}
          edit={this.state.edit}
          selectedOwner={this.props.selectedOwner}
        />
        <AsnSelectModal
          bonded={bonded}
          regType={regType}
          ownerPartnerId={ownerPartnerId}
          soType={soType}
        />
      </DataPane>
    );
  }
}
