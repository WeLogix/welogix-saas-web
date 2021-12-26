import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Card, DatePicker, Table, Form, Select, Tag, Input, message } from 'antd';
import Summary from 'client/components/Summary';
import FullscreenModal from 'client/components/FullscreenModal';
import { showTransferInModal, loadEntryTransRegs, loadVtransferRegDetails, saveVirtualTransfer } from 'common/reducers/cwmShFtz';
import { format } from 'client/common/i18n/helpers';
import messages from '../../../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.cwmShFtz.transInModal.visible,
    ownerCusCode: state.cwmShFtz.transInModal.ownerCusCode,
    transRegs: state.cwmShFtz.transRegs,
    defaultWhse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    portionRegs: state.cwmShFtz.batchout_regs,
    loginId: state.account.loginId,
    loginName: state.account.username,
    unit: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    country: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currency: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    submitting: state.cwmShFtz.submitting,
  }),
  {
    showTransferInModal,
    loadEntryTransRegs,
    loadVtransferRegDetails,
    saveVirtualTransfer,
  }
)
export default class TransferSelfModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    ownerCusCode: '',
    relDateRange: [],
    entryRegNo: '',
    regDetails: [],
    transRegs: [],
  }
  componentWillMount() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({
        scrollY: (window.innerHeight - 460),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.transRegs !== this.props.transRegs) {
      this.setState({ transRegs: nextProps.transRegs });
    }
    if (nextProps.visible && nextProps.ownerCusCode && nextProps.visible !== this.props.visible) {
      this.props.loadEntryTransRegs({
        whseCode: nextProps.defaultWhse.code,
        ownerCusCode: nextProps.ownerCusCode,
      });
      this.setState({ ownerCusCode: nextProps.ownerCusCode });
    }
  }
  msg = key => formatMsg(this.props.intl, key);
  entryRegColumns = [{
    title: 'ASN编号',
    dataIndex: 'asn_no',
    width: 180,
  }, {
    title: '进区凭单号',
    width: 200,
    dataIndex: 'ftz_ent_no',
  }, {
    title: '货主',
    dataIndex: 'owner_name',
  }, {
    title: '进库日期',
    dataIndex: 'ftz_ent_date',
    render: o => o && moment(o).format('YYYY.MM.DD'),
    width: 200,
  }, {
    title: '添加',
    width: 80,
    fixed: 'right',
    render: (o, record) => !record.added && <Button type="primary" size="small" icon="plus" onClick={() => this.handleAddReg(record)} />,
  }]

  regDetailColumns = [{
    title: '货号',
    dataIndex: 'product_no',
    width: 150,
    render: o => o && <Button>{o}</Button>,
  }, {
    title: '备案料号',
    dataIndex: 'ftz_cargo_no',
    width: 180,
    render: o => o && <Button>{o}</Button>,
  }, {
    title: '入库明细ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 120,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '规格型号',
    dataIndex: 'model',
    width: 150,
  }, {
    title: '原产国',
    dataIndex: 'country',
    width: 150,
    render: (o) => {
      const country = this.props.country.filter(cur => cur.value === o)[0];
      const text = country ? `${country.value}| ${country.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
    render: (o) => {
      const unit = this.props.unit.filter(cur => cur.value === o)[0];
      const text = unit ? `${unit.value}| ${unit.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '剩余数量',
    width: 100,
    dataIndex: 'stock_qty',
  }, {
    title: '剩余毛重',
    width: 100,
    dataIndex: 'stock_grosswt',
  }, {
    title: '剩余净重',
    width: 100,
    dataIndex: 'stock_netwt',
  }, {
    title: '剩余金额',
    width: 100,
    dataIndex: 'stock_amount',
  }, {
    title: '币制',
    width: 100,
    dataIndex: 'currency',
    render: (o) => {
      const currency = this.props.currency.filter(cur => cur.value === o)[0];
      const text = currency ? `${currency.value}| ${currency.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '删除',
    width: 80,
    fixed: 'right',
    render: (o, record) => <Button type="danger" size="small" ghost icon="minus" onClick={() => this.handleDelDetail(record)} />,
  }]
  handleAddReg = (row) => {
    this.props.loadVtransferRegDetails({ preFtzEntNo: row.pre_ftz_ent_no }).then((result) => {
      if (!result.error) {
        const entNo = row.pre_ftz_ent_no;
        const regDetails = this.state.regDetails.filter(reg =>
          reg.pre_ftz_ent_no !== entNo).concat(result.data);
        const transRegs = this.state.transRegs.map(pr =>
          (pr.pre_ftz_ent_no === entNo ? { ...pr, added: true } : pr));
        this.setState({ regDetails, transRegs });
      }
    });
  }
  handleDelDetail = (detail) => {
    const regDetails = this.state.regDetails.filter(reg => reg.id !== detail.id);
    const transRegs = this.state.transRegs.map(pr =>
      (pr.pre_ftz_ent_no === detail.pre_ftz_ent_no ? { ...pr, added: false } : pr));
    this.setState({ regDetails, transRegs });
  }
  handleCancel = () => {
    this.setState({
      ownerCusCode: '', transRegs: [], regDetails: [], relDateRange: [],
    });
    this.props.showTransferInModal({ visible: false });
  }
  handleOwnerChange = (ownerCusCode) => {
    this.setState({ ownerCusCode });
  }
  handleEntryNoChange = (ev) => {
    this.setState({ entryRegNo: ev.target.value });
  }
  handleRelRangeChange = (relDateRange) => {
    this.setState({ relDateRange });
  }
  handleFilterQuery = () => {
    const { ownerCusCode, entryRegNo, relDateRange } = this.state;
    this.props.loadEntryTransRegs({
      ownerCusCode,
      whseCode: this.props.defaultWhse.code,
      ftzEntNo: entryRegNo,
      start_date: relDateRange.length === 2 ? relDateRange[0].valueOf() : undefined,
      end_date: relDateRange.length === 2 ? relDateRange[1].valueOf() : undefined,
    });
  }
  handleSaveTrans = () => {
    if (!this.state.ownerCusCode) {
      message.error('货主未选定');
      return;
    }
    const detailIds = [];
    this.state.regDetails.forEach((regd) => {
      detailIds.push(regd.id);
    });
    const owner = this.props.owners.filter(own =>
      own.customs_code === this.state.ownerCusCode).map(own => ({
      partner_id: own.id,
      tenant_id: own.partner_tenant_id,
      customs_code: own.customs_code,
      name: own.name,
    }))[0];
    this.props.saveVirtualTransfer({
      detailIds,
      owner,
      whseCode: this.props.defaultWhse.code,
      ftzWhseCode: this.props.defaultWhse.ftz_whse_code,
      loginId: this.props.loginId,
    }).then((result) => {
      if (!result.error) {
        this.handleCancel();
        this.props.reload();
      } else {
        message.error(result.error.message);
      }
    });
  }

  render() {
    const { submitting, visible } = this.props;
    const {
      entryRegNo, relDateRange, transRegs, ownerCusCode, regDetails,
    } = this.state;
    const extraForm = (
      <Form layout="inline">
        <FormItem label="货主">
          <Select onChange={this.handleOwnerChange} placeholder="请选择货主" style={{ width: 200 }} value={ownerCusCode}>
            {this.props.owners.map(data => (
              <Option key={data.customs_code} value={data.customs_code}>
                {data.partner_code}{data.partner_code ? '|' : ''}{data.name}
              </Option>))}
          </Select>
        </FormItem>
        <FormItem label="进区凭单号">
          <Input value={entryRegNo} onChange={this.handleEntryNoChange} />
        </FormItem>
        <FormItem label="入库日期">
          <RangePicker onChange={this.handleRelRangeChange} value={relDateRange} />
        </FormItem>
        <Button type="primary" ghost onClick={this.handleFilterQuery}>查找</Button>
      </Form>);
    const stat = regDetails.reduce((acc, regd) => ({
      total_qty: acc.total_qty + regd.stock_qty,
      total_amount: acc.total_amount + regd.stock_amount,
      total_netwt: acc.total_netwt + regd.stock_netwt,
    }), {
      total_qty: 0,
      total_amount: 0,
      total_netwt: 0,
    });
    const detailStatForm = (
      <Summary>
        <Summary.Item label="总数量">{stat.total_qty}</Summary.Item>
        <Summary.Item label="总净重" addonAfter="KG">{stat.total_netwt.toFixed(3)}</Summary.Item>
        <Summary.Item label="总金额">{stat.total_amount.toFixed(3)}</Summary.Item>
      </Summary>
    );
    return (
      <FullscreenModal
        title={this.msg('新建监管库存转移')}
        onCancel={this.handleCancel}
        onSave={this.handleSaveTrans}
        saveDisabled={regDetails.length === 0}
        saveLoading={submitting}
        visible={visible}
      >
        <Card title="入库单" extra={extraForm} bodyStyle={{ padding: 0 }} >
          <div className="table-panel table-fixed-layout">
            <Table
              size="middle"
              columns={this.entryRegColumns}
              dataSource={transRegs}
              rowKey="ftz_ent_no"
              scroll={{
                x: this.entryRegColumns.reduce((acc, cur) =>
                acc + (cur.width ? cur.width : 240), 0),
                y: this.state.scrollY,
            }}
            />
          </div>
        </Card>
        <Card title="入库单明细" extra={detailStatForm} bodyStyle={{ padding: 0 }} >
          <div className="table-panel table-fixed-layout">
            <Table
              size="middle"
              columns={this.regDetailColumns}
              dataSource={regDetails}
              rowKey="id"
              scroll={{
                x: this.regDetailColumns.reduce((acc, cur) =>
                acc + (cur.width ? cur.width : 240), 0),
                y: this.state.scrollY,
              }}
            />
          </div>
        </Card>
      </FullscreenModal>
    );
  }
}
