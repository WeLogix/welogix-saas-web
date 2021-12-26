import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Button, message } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { intlShape, injectIntl } from 'react-intl';
import { toggleDetailModal, setTemporary, splitInvoice, getInvoice, batchDeleteInvDetails } from 'common/reducers/sofInvoice';
import ExcelUploader from 'client/components/ExcelUploader';
import Summary from 'client/components/Summary';
import SearchBox from 'client/components/SearchBox';
import { createFilename } from 'client/util/dataTransform';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import DetailModal from '../modal/detailModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    invoiceHead: state.sofInvoice.invoiceHead,
    invoiceDetails: state.sofInvoice.invoiceDetails,
    currencies: state.saasParams.latest.currency,
    countries: state.saasParams.latest.country,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    invDetailLoading: state.sofInvoice.invDetailLoading,
  }),
  {
    toggleDetailModal,
    setTemporary,
    splitInvoice,
    getInvoice,
    batchDeleteInvDetails,
  }
)
export default class DetailsPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldValue: PropTypes.func }).isRequired,
    invoiceNo: PropTypes.string,
    type: PropTypes.oneOf(['create', 'edit', 'view']),
  }
  state = {
    searchVal: '',
    selectedRowKeys: [],
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.invoiceDetails.length === 0 && nextProps.invoiceDetails.length !== 0) {
      const newInvoiceDetails = nextProps.invoiceDetails.map((td, index) => ({
        ...td, disabled: true, index,
      }));
      this.props.setTemporary(newInvoiceDetails);
    }
  }
  componentWillUnmount() {
    this.props.setTemporary([]);
  }
  msg = formatMsg(this.props.intl)
  handleDelete = (row) => {
    const newInvoiceDetails = this.props.invoiceDetails.filter(td => td.id !== row.id)
      .map((td, idx) => ({ ...td, index: idx }));
    this.setState({
      selectedRowKeys: [],
    });
    this.handleCalculate(newInvoiceDetails);
    this.props.setTemporary(newInvoiceDetails);
    if (this.props.type === 'edit') {
      this.props.batchDeleteInvDetails(
        [{
          id: row.id,
          po_no: row.po_no,
          gt_netwt: row.gt_netwt,
          gt_qty_pcs: row.gt_qty_pcs,
          gt_amount: row.gt_amount,
          gt_recv_qty: row.gt_recv_qty,
          gt_shipped_qty: row.gt_shipped_qty,
          seqNo: row.index + 1,
        }],
        this.props.invoiceNo
      ).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
  }
  handleEdit = (row) => {
    this.props.toggleDetailModal(true, row);
  }
  invoiceDetailsUploaded = (data) => {
    const { invoiceDetails } = this.props;
    const newInvoiceDetails = invoiceDetails.concat(data).map((td, index) => ({
      ...td, disabled: true, index,
    }));
    this.handleCalculate(newInvoiceDetails);
    this.props.setTemporary(newInvoiceDetails);
  }
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    const { invoiceDetails, type } = this.props;
    const newInvoiceDetails = invoiceDetails.filter(invDetail =>
      selectedRowKeys.findIndex(key => key === invDetail.id) === -1)
      .map((td, index) => ({ ...td, index }));
    this.setState({
      selectedRowKeys: [],
    });
    this.handleCalculate(newInvoiceDetails);
    this.props.setTemporary(newInvoiceDetails);
    if (type === 'edit') {
      const deleteInvDetails = invoiceDetails.filter(invDetail =>
        selectedRowKeys.findIndex(key => key === invDetail.id) !== -1);
      this.props.batchDeleteInvDetails(
        deleteInvDetails.map(detail => ({
          id: detail.id,
          po_no: detail.po_no,
          gt_netwt: detail.gt_netwt,
          gt_qty_pcs: detail.gt_qty_pcs,
          gt_amount: detail.gt_amount,
          gt_recv_qty: detail.gt_recv_qty,
          gt_shipped_qty: detail.gt_shipped_qty,
          seqNo: detail.index + 1,
        })),
        this.props.invoiceNo
      ).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
  }
  handleCalculate = (invoiceDetails) => {
    const { form } = this.props;
    const totalQty = invoiceDetails.reduce((prev, next) => prev +
      Number(next.gt_qty_pcs || 0), 0);
    const totalAmount = invoiceDetails.reduce((prev, next) => prev +
      Number(next.gt_amount || 0), 0);
    const totalNetWt = invoiceDetails.reduce((prev, next) => prev +
      Number(next.gt_net_wt || 0), 0);
    form.setFieldsValue({
      total_qty: totalQty,
      total_amount: totalAmount,
      total_net_wt: totalNetWt,
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleExport = () => {
    const { invoiceNo } = this.props;
    window.open(`${API_ROOTS.default}v1/scof/invoice/details/${createFilename(`${invoiceNo}`)}.xlsx?invoiceNo=${invoiceNo}`);
  }
  handleInvDetailSearch = (searchVal) => {
    this.setState({ searchVal });
  }
  toggleDetailModal = () => {
    this.props.toggleDetailModal(true);
  }
  handleSplitChange = (e, record) => {
    const invoiceDetails = [...this.props.invoiceDetails];
    const changedOne = invoiceDetails.find(td => td.id === record.id);
    if (e.target.value > changedOne.gt_qty_pcs) {
      changedOne.splitQty = changedOne.gt_qty_pcs;
    } else {
      changedOne.splitQty = e.target.value;
    }
    this.props.setTemporary(invoiceDetails);
  }
  handleSplit = () => {
    const invoiceDetails = [...this.props.invoiceDetails];
    const splitDetails = invoiceDetails.filter(td => !td.disabled);
    this.props.splitInvoice(this.props.invoiceNo, splitDetails).then((result) => {
      if (!result.error) {
        this.setState({ selectedRowKeys: [] });
        this.props.getInvoice(this.props.invoiceNo).then((re) => {
          if (!re.error) {
            const newInvoiceDetails =
            re.data.details.map(de => ({ ...de, disabled: true }));
            this.props.setTemporary(newInvoiceDetails);
          }
        });
      }
    });
  }
  columns = [{
    title: '序号',
    dataIndex: 'index',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: o => o + 1,
  }, {
    title: '采购订单号',
    dataIndex: 'po_no',
    width: 150,
  }, {
    title: '货号',
    dataIndex: 'gt_product_no',
    width: 150,
  }, {
    title: '中文品名',
    dataIndex: 'gt_name_cn',
    width: 150,
  }, {
    title: '英文品名',
    dataIndex: 'gt_name_en',
    width: 150,
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'gt_qty_pcs',
    align: 'right',
    render: o => <span className="text-emphasis">{o}</span>,
  /*
  }, {
    title: '拆分数量',
    dataIndex: 'splitQty',
    width: 100,
    align: 'right',
    render: (o, record) => (record.disabled ? '' : (<Input
      size="small"
      value={o}
      onChange={_ => this.handleSplitChange(_, record)}
      style={{ textAlign: 'right' }}
    />)),
  */
  }, {
    title: '计量单位',
    dataIndex: 'gt_unit_pcs',
    width: 100,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.find(un => un.value === o);
      if (unit) {
        return unit.text;
      }
      return '';
    },
  }, {
    title: '发货数量',
    width: 100,
    dataIndex: 'gt_shipped_qty',
    align: 'right',
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.gt_qty_pcs) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: '收货数量',
    width: 100,
    dataIndex: 'gt_recv_qty',
    align: 'right',
    render: (o, record) => {
      if (o === 0) {
        return null;
      } else if (o > 0 && o !== record.gt_qty_pcs) {
        return <span className="text-error">{o}</span>;
      }
      return o;
    },
  }, {
    title: this.msg('status'),
    dataIndex: 'gt_ship_recv_status',
    width: 100,
    render: (srStatus) => {
      if (srStatus === 4) {
        return <Badge status="success" text={this.msg('received')} />;
      } else if (srStatus === 3) {
        return <Badge status="warning" text={this.msg('exceptionalReceived')} />;
      } else if (srStatus === 2) {
        return <Badge status="processing" text={this.msg('shipped')} />;
      } else if (srStatus === 1) {
        return <Badge status="warning" text={this.msg('exceptionalShipped')} />;
      }
      return <Badge status="default" text={this.msg('toShip')} />;
    },
  }, {
    title: '单价',
    dataIndex: 'gt_unit_price',
    width: 100,
    align: 'right',
  }, {
    title: '总价',
    dataIndex: 'gt_amount',
    width: 100,
    align: 'right',
  }, {
    title: '币制',
    dataIndex: 'gt_currency',
    align: 'center',
    width: 100,
    render: (o) => {
      const currency = this.props.currencies.find(curr => curr.curr_code === o);
      if (currency) {
        return currency.curr_name;
      }
      return o;
    },
  }, {
    title: '原产国',
    dataIndex: 'gt_origin_country',
    width: 100,
    render: (o) => {
      const country = this.props.countries.find(coun => coun.cntry_co === o);
      if (country) {
        return country.cntry_name_cn;
      }
      return o;
    },
  }, {
    title: '净重',
    dataIndex: 'gt_netwt',
    width: 100,
  }, {
    title: '毛重',
    dataIndex: 'gt_grosswt',
    width: 100,
  }, {
    title: '箱号',
    dataIndex: 'gt_carton_no',
    width: 100,
  }, {
    title: '托盘号',
    dataIndex: 'gt_pallet_no',
    width: 100,
  }, {
    title: '成分/原料/组分',
    dataIndex: 'gt_stuff',
    width: 100,
  }, {
    title: '产品有效期',
    dataIndex: 'gt_expiry_date',
    width: 100,
  }, {
    title: '产品保质期(天)',
    dataIndex: 'gt_warranty_days',
    width: 100,
  }, {
    title: '货物规格',
    dataIndex: 'gt_product_spec',
    width: 100,
  }, {
    title: '货物型号',
    dataIndex: 'gt_product_model',
    width: 100,
  }, {
    title: '生产日期',
    dataIndex: 'gt_produce_date',
    width: 100,
  }, {
    title: '境外生产企业',
    dataIndex: 'intl_oversea_entity',
    width: 100,
  }, {
    title: '货物品牌',
    dataIndex: 'cop_brand',
    width: 100,
  }, {
    title: '生产批次',
    dataIndex: 'gt_external_lot_no',
    width: 100,
  }, {
    title: this.msg('containerNo'),
    dataIndex: 'gt_container_no',
    width: 100,
  }, {
    title: '操作',
    width: 80,
    fixed: 'right',
    render: (o, record) => this.props.type !== 'view' && (
      <span>
        <PrivilegeCover module="scof" feature="invoice" action="edit">
          <RowAction onClick={this.handleEdit} icon="edit" row={record} />
        </PrivilegeCover>
        <PrivilegeCover module="scof" feature="invoice" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={this.handleDelete} icon="delete" row={record} />
        </PrivilegeCover>
      </span>
    ),
  }]
  render() {
    const {
      invoiceDetails, form, invoiceHead, invDetailLoading,
    } = this.props;
    const { searchVal } = this.state;
    const dataSourceDetails = invoiceDetails.filter((det) => {
      if (searchVal) {
        const regex = new RegExp(searchVal);
        return regex.test(det.po_no) || regex.test(det.gt_product_no);
      }
      return true;
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      onSelect: (record, selected) => {
        const invDetails = [...this.props.invoiceDetails];
        const selectOne = invDetails.find(td => td.id === record.id);
        if (selected) {
          selectOne.disabled = false;
        } else {
          selectOne.disabled = true;
        }
        this.props.setTemporary(invDetails);
      },
      onSelectAll: (selected) => {
        const invDetails =
      [...this.props.invoiceDetails].map(td => ({ ...td, disabled: !selected }));
        let selectedRowKeys = [];
        if (selected) {
          selectedRowKeys = invDetails.map(td => td.index);
        }
        this.setState({ selectedRowKeys });
        this.props.setTemporary(invDetails);
      },
    };
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        dataSource={dataSourceDetails}
        rowKey="id"
        loading={invDetailLoading}
      >
        {this.props.type !== 'view' && [<DataPane.Toolbar>
          <SearchBox value={searchVal} placeholder={this.msg('invDetailSearchPH')} onSearch={this.handleInvDetailSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <PrivilegeCover module="scof" feature="invoice" action="edit">
              <Button onClick={this.handleSplit}>拆分发票</Button>
            </PrivilegeCover>
            <PrivilegeCover module="scof" feature="invoice" action="delete">
              <Button type="danger" onClick={this.handleBatchDelete} icon="delete" />
            </PrivilegeCover>
          </DataPane.BulkActions>
          <DataPane.Extra>
            <PrivilegeCover module="scof" feature="invoice" action="edit">
              <ExcelUploader
                endpoint={`${API_ROOTS.default}v1/scof/invoice/details/import`}
                formData={{
              data: JSON.stringify({
              }),
            }}
                onUploaded={this.invoiceDetailsUploaded}
              >
                <Button icon="upload">{this.msg('import')}</Button>
              </ExcelUploader>
            </PrivilegeCover>
            <Button icon="download" onClick={this.handleExport} style={{ marginLeft: 8 }}>导出</Button>
            <PrivilegeCover module="scof" feature="invoice" action="create">
              <Button type="primary" icon="plus-circle-o" onClick={this.toggleDetailModal}>{this.msg('add')}</Button>
            </PrivilegeCover>
          </DataPane.Extra>
        </DataPane.Toolbar>,
          <DetailModal headForm={form} type={this.props.type} />,
          <Summary>
            <Summary.Item label={this.msg('statsSumQty')}>{form.getFieldValue('total_qty') || invoiceHead.total_qty}</Summary.Item>
            <Summary.Item label={this.msg('statsSumAmount')}>{form.getFieldValue('total_amount') || invoiceHead.total_amount}</Summary.Item>
            <Summary.Item label={this.msg('statsSumNetWt')}>{form.getFieldValue('total_net_wt') || invoiceHead.total_net_wt}</Summary.Item>
          </Summary>]}
      </DataPane>
    );
  }
}
