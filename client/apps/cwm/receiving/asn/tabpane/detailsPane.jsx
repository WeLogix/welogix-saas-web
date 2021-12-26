import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { intlShape, injectIntl } from 'react-intl';
import { showDetailModal, setAsnDetails, deleteAsnDetails } from 'common/reducers/cwmReceive';
import ExcelUploader from 'client/components/ExcelUploader';
import AddDetailModal from '../modal/addDetailModal';
import { formatMsg } from '../../message.i18n';


@injectIntl
@connect(
  state => ({
    asnDetails: state.cwmReceive.asnDetails,
    loginId: state.account.loginId,
    units: state.saasParams.latest.unit.map(un => ({
      code: un.unit_code,
      name: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      code: curr.curr_code,
      name: curr.curr_name,
    })),
    asnHead: state.cwmReceive.asnHead,
  }),
  {
    showDetailModal, setAsnDetails, deleteAsnDetails,
  }
)
export default class ASNDetailsPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldValue: PropTypes.func }).isRequired,
    detailEnable: PropTypes.bool.isRequired,
  }
  state = {
    selectedRowKeys: [],
    editRecord: {},
    edit: false,
  };
  msg = formatMsg(this.props.intl)
  showDetailModal = () => {
    this.setState({
      edit: false,
      editRecord: {},
    });
    this.props.showDetailModal();
  }
  handleDelete = (row) => {
    const { asnHead } = this.props;
    let asnDetails = [...this.props.asnDetails];
    asnDetails.splice(row.index, 1);
    if (asnHead.asn_no) {
      asnDetails = asnDetails.map((item, index) => ({ ...item, asn_seq_no: index + 1 }));
      this.props.deleteAsnDetails([row.asn_seq_no], asnHead.asn_no).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
    this.props.setAsnDetails(asnDetails);
  }
  handleEdit = (row) => {
    this.setState({
      editRecord: row,
      edit: true,
    });
    this.props.showDetailModal();
  }
  asnDetailsUploaded = (data) => {
    const asnDetails = [...this.props.asnDetails];
    this.props.setAsnDetails(asnDetails.concat(data));
  }
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    const { asnDetails, asnHead } = this.props;
    const deleteDetails = asnDetails.filter((temporary, index) =>
      selectedRowKeys.findIndex(key => key === index) !== -1);
    let newAsnDetails = asnDetails.filter((temporary, index) =>
      selectedRowKeys.findIndex(key => key === index) === -1);
    this.setState({
      selectedRowKeys: [],
    });
    if (asnHead.asn_no) {
      newAsnDetails = newAsnDetails.map((item, index) => ({ ...item, asn_seq_no: index + 1 }));
      this.props.deleteAsnDetails(
        deleteDetails.map(item => item.asn_seq_no),
        asnHead.asn_no
      ).then((result) => {
        if (!result.error) {
          message.success(this.msg('deletedSucceed'));
        }
      });
    }
    this.props.setAsnDetails(newAsnDetails);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleTemplateDownload = () => {
    window.open(`${XLSX_CDN}/ASN明细导入模板_20170901.xlsx`);
  }
  render() {
    const {
      asnDetails, detailEnable, form, units, currencies,
    } = this.props;
    const ownerPartnerId = form.getFieldValue('owner_partner_id');
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const columns = [{
      title: '行号',
      dataIndex: 'seq_no',
      width: 50,
      align: 'center',
      render: (col, row) => row.index + 1,
    }, {
      title: '货号',
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
      width: 100,
      dataIndex: 'unit',
      align: 'center',
      render: (un) => {
        const unitParam = units.find(unit => unit.code === un);
        if (unitParam) {
          return unitParam.name;
        }
        return un;
      },
    }, {
      title: '采购订单号',
      dataIndex: 'po_no',
      width: 150,
    }, {
      title: '集装箱号',
      dataIndex: 'container_no',
      width: 150,
    }, {
      title: '库别',
      dataIndex: 'virtual_whse',
      width: 150,
    }, {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      align: 'right',
    }, {
      title: '币制',
      width: 100,
      dataIndex: 'currency',
      align: 'center',
      render: (o) => {
        const currency = currencies.find(curr => Number(curr.code) === Number(o));
        if (currency) {
          return <span>{currency.name}</span>;
        }
        return o;
      },
    }, {
      dataIndex: 'SPACER_COL',
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
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={asnDetails.map((item, index) => ({ ...item, index }))}
        rowKey="index"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <Button type="primary" icon="plus-circle-o" disabled={detailEnable ? '' : 'disabled'} onClick={this.showDetailModal}>添加</Button>
          <ExcelUploader
            endpoint={`${API_ROOTS.default}v1/cwm/asn/details/import`}
            formData={{
              data: JSON.stringify({
                loginId: this.props.loginId,
                ownerPartnerId,
              }),
            }}
            onUploaded={this.asnDetailsUploaded}
          >
            <Button icon="upload" disabled={detailEnable ? '' : 'disabled'}>导入</Button>
          </ExcelUploader>
          <Button icon="download" onClick={this.handleTemplateDownload} style={{ marginLeft: 8 }}>模版下载</Button>
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
      </DataPane>
    );
  }
}
