import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { notification, Card, Table, Icon, Input, Row, Col, Select, Button, DatePicker, message } from 'antd';
import FullscreenModal from 'client/components/FullscreenModal';
import InfoItem from 'client/components/InfoItem';
import RowAction from 'client/components/RowAction';
import { hideReceiveModal, loadProductDetails, receiveProduct } from 'common/reducers/cwmReceive';
import { CWM_DAMAGE_LEVEL } from 'common/constants';
import QuantityInput from '../../../common/quantityInput';
import LocationPopover from '../../../common/popover/locationPopover';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    visible: state.cwmReceive.receiveModal.visible,
    editable: state.cwmReceive.receiveModal.editable,
    inboundHead: state.cwmReceive.inboundFormHead,
    inboundNo: state.cwmReceive.receiveModal.inboundNo,
    inboundProduct: state.cwmReceive.receiveModal.inboundProduct,
    saveLoading: state.cwmReceive.submitting,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    hideReceiveModal, loadProductDetails, receiveProduct,
  }
)
export default class ReceivingModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    inboundNo: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,
  }
  state = {
    dataSource: [],
    receivedQty: 0,
    receivedPackQty: 0,
    loading: false,
    receivedDate: null,
    disabled: true,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.inboundProduct.asn_seq_no) {
      this.setState({ loading: true });
      this.props.loadProductDetails(
        nextProps.inboundNo,
        nextProps.inboundProduct.asn_seq_no
      ).then((result) => {
        if (!result.error) {
          let dataSource = [];
          if (result.data.length === 0 && nextProps.inboundHead.rec_mode === 'manual') {
            dataSource = [{
              id: `${this.props.productNo}1`,
              inbound_qty: 0,
              inbound_pack_qty: 0,
              location: '',
              damage_level: 0,
              avail: true,
              received_by: nextProps.username,
              priority: null,
            }];
          } else {
            dataSource = result.data.map(data => ({
              id: data.trace_id,
              trace_id: data.trace_id,
              location: data.location,
              damage_level: data.damage_level,
              inbound_qty: Number(data.inbound_qty),
              inbound_pack_qty: Number(data.inbound_pack_qty),
              convey_no: data.convey_no,
              external_lot_no: data.external_lot_no,
              avail: !(data.frozen_qty > 0),
              received_by: data.received_by,
              serial_no: data.serial_no,
              attrib_1_string: data.attrib_1_string,
              attrib_2_string: data.attrib_2_string,
              attrib_3_string: data.attrib_3_string,
              attrib_4_string: data.attrib_4_string,
              virtual_whse: data.virtual_whse,
            }));
          }
          this.setState({
            dataSource,
            receivedQty: nextProps.inboundProduct.received_qty,
            receivedPackQty: nextProps.inboundProduct.received_pack_qty,
            loading: false,
            receivedDate: nextProps.inboundProduct.received_date ?
              nextProps.inboundProduct.received_date : new Date(),
          });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideReceiveModal();
  }
  handleProductPutAway = (index, value, location) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].location = value;
    if (location) {
      dataSource[index].priority = Number(location.status);
    }
    this.setState({ dataSource });
  }
  handleConveyChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].convey_no = value;
    this.setState({ dataSource });
  }
  handleLotNoChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].external_lot_no = value;
    this.setState({ dataSource });
  }
  handleReceiverChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].received_by = value;
    this.setState({ dataSource });
  }
  handleProductReceive = (index, value) => {
    const receivePack = Number(parseFloat(value));
    if (!Number.isNaN(receivePack)) {
      const { inboundProduct } = this.props;
      let { receivedQty, receivedPackQty } = this.state;
      const dataSource = [...this.state.dataSource];
      const remainQty = inboundProduct.expect_qty - receivedQty;
      const remainPackQty = inboundProduct.expect_pack_qty - receivedPackQty;
      const changeQty = (receivePack * inboundProduct.sku_pack_qty) - dataSource[index].inbound_qty;
      const changePackQty = receivePack - dataSource[index].inbound_pack_qty;
      dataSource[index].avail = remainQty >= 0;
      if (remainQty < 0 && changeQty < 0 && changeQty <= remainQty) {
        for (let i = 0; i < dataSource.length; i++) {
          dataSource[i].avail = true;
        }
      }
      if (changeQty > remainQty && remainQty >= 0) {
        dataSource[index].inbound_pack_qty += remainPackQty;
        dataSource[index].inbound_qty += remainQty;
        dataSource.push(Object.assign({}, dataSource[index], {
          inbound_qty: changeQty - remainQty,
          inbound_pack_qty: changePackQty - remainPackQty,
          avail: false,
        }));
        if (dataSource[index].inbound_pack_qty === 0) {
          dataSource.splice(index, 1);
        }
      } else {
        dataSource[index].inbound_pack_qty = receivePack;
        dataSource[index].inbound_qty = receivePack * inboundProduct.sku_pack_qty;
      }
      receivedQty += changeQty;
      receivedPackQty += changePackQty;
      const filterDataSource = dataSource.filter(data => !data.trace_id);
      if (filterDataSource.find(data => data.inbound_pack_qty > 0)) {
        this.setState({
          disabled: false,
        });
      } else {
        this.setState({
          disabled: true,
        });
      }
      this.setState({
        dataSource,
        receivedQty,
        receivedPackQty,
      });
    }
  }
  handleDamageLevelChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].damage_level = value;
    this.setState({ dataSource });
  }
  handleReceivedDateChange = (date) => {
    this.setState({ receivedDate: date.toDate() });
  }
  handleAvailChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].avail = value === 'avail';
    this.setState({ dataSource });
  }
  handleAdd = () => {
    const dataSource = [...this.state.dataSource];
    const newDetail = {
      id: `${this.props.productNo}${dataSource.length + 1}`,
      inbound_qty: 0,
      inbound_pack_qty: 0,
      location: '',
      priority: null,
      damage_level: 0,
      avail: this.props.inboundProduct.expect_qty > this.state.receivedQty,
      received_by: this.props.username,
    };
    dataSource.push(newDetail);
    this.setState({ dataSource });
  }
  handleDeleteDetail = (row) => {
    const dataSource = [...this.state.dataSource];
    let { receivedQty, receivedPackQty } = this.state;
    receivedQty -= dataSource[row.index].inbound_qty;
    receivedPackQty -= dataSource[row.index].inbound_pack_qty;
    dataSource.splice(row.index, 1);
    this.setState({ dataSource, receivedQty, receivedPackQty });
  }
  handleSubmit = () => {
    const dataSource = [...this.state.dataSource];
    if (dataSource.find(data => data.inbound_pack_qty === 0)) {
      message.error('收货数量不能等于零');
      return;
    }
    const notificationkey = 'unexpect-receive';
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
        notification.close(notificationkey);
        this.handleConfirmReceive();
      }}
      >
        确定
      </Button>
    );
    if (this.state.receivedQty > this.props.inboundProduct.expect_qty) {
      notification.warning({
        message: '实收数量大于预期数量',
        description: '确定按超量完成收货?',
        btn,
        key: notificationkey,
      });
    } else if (this.state.receivedQty < this.props.inboundProduct.expect_qty) {
      notification.warning({
        message: '实收数量少于预期数量',
        description: '确定按缺量完成收货?',
        btn,
        key: notificationkey,
      });
    } else {
      this.handleConfirmReceive();
    }
  }
  handleConfirmReceive = () => {
    const {
      loginId, inboundNo, inboundProduct, inboundHead,
    } = this.props;
    this.props.receiveProduct(
      this.state.dataSource.filter(data => !data.trace_id).map(data => ({
        location: data.location,
        damage_level: data.damage_level,
        inbound_qty: data.inbound_qty,
        inbound_pack_qty: data.inbound_pack_qty,
        convey_no: data.convey_no,
        external_lot_no: data.external_lot_no,
        avail: data.avail,
        received_by: data.received_by,
        serial_no: data.serial_no,
        attrib_1_string: data.attrib_1_string,
        attrib_2_string: data.attrib_2_string,
        attrib_3_string: data.attrib_3_string,
        attrib_4_string: data.attrib_4_string,
        virtual_whse: data.virtual_whse,
        priority: data.priority,
      })), inboundNo,
      inboundProduct.asn_seq_no, inboundHead.asn_no, loginId, this.state.receivedDate
    ).then((result) => {
      if (!result.error) {
        message.success('收货确认成功');
        this.props.hideReceiveModal();
      } else {
        message.error('操作失败');
      }
    });
  }
  handleSerialNoChange = (index, value) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index].serial_no = value;
    this.setState({ dataSource });
  }
  handleAttrChange = (index, value, dataIndex) => {
    const dataSource = [...this.state.dataSource];
    dataSource[index][dataIndex] = value;
    this.setState({ dataSource });
  }
  scanColumns = [{
    title: '追踪ID',
    dataIndex: 'trace_id',
    width: 200,
    render: o => (<Input size="small" className="readonly" prefix={<Icon type="qrcode" />} value={o} />),
  }, {
    title: '产品序列号',
    dataIndex: 'serial_no',
    width: 180,
    render: o => (<Input size="small" className="readonly" prefix={<Icon type="barcode" />} value={o} />),
  }, {
    title: '容器编号',
    dataIndex: 'convey_no',
    width: 180,
    render: o => (<Input size="small" className="readonly" value={o} />),
  }, {
    title: '收货数量',
    width: 200,
    dataIndex: 'inbound_qty',
    render: (o, record) => (<QuantityInput
      packQty={record.inbound_pack_qty}
      pcsQty={record.inbound_qty}
    />),
  }, {
    title: '包装情况',
    dataIndex: 'damage_level',
    width: 100,
    render: o => (<Select size="small" value={o} style={{ width: 90 }} disabled>
      <Option value={CWM_DAMAGE_LEVEL[0].value}>{CWM_DAMAGE_LEVEL[0].text}</Option>
      <Option value={CWM_DAMAGE_LEVEL[1].value}>{CWM_DAMAGE_LEVEL[1].text}</Option>
      <Option value={CWM_DAMAGE_LEVEL[2].value}>{CWM_DAMAGE_LEVEL[2].text}</Option>
      <Option value={CWM_DAMAGE_LEVEL[3].value}>{CWM_DAMAGE_LEVEL[3].text}</Option>
      <Option value={CWM_DAMAGE_LEVEL[4].value}>{CWM_DAMAGE_LEVEL[4].text}</Option>
    </Select>),
  }, {
    title: '收货库位',
    dataIndex: 'location',
    width: 150,
    render: o => (<Select size="small" value={o} showSearch style={{ width: 140 }} disabled />),
  }, {
    title: '库存状态',
    dataIndex: 'avail',
    width: 70,
    render: avail => (avail ? '可用' : '冻结'),
  }]

  manualColumns = [{
    title: '追踪ID',
    dataIndex: 'trace_id',
    width: 200,
    render: o => (<Input size="small" className="readonly" prefix={<Icon type="qrcode" />} value={o} disabled />),
  }, {
    title: '序列号',
    width: 150,
    dataIndex: 'serial_no',
    render: (o, row) => <Input size="small" prefix={<Icon type="barcode" />} value={o} onChange={e => this.handleSerialNoChange(row.index, e.target.value)} disabled={!!row.trace_id} />,
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 80,
    render: (lotNo, row) => (
      <Input
        size="small"
        value={lotNo}
        onChange={ev => this.handleLotNoChange(row.index, ev.target.value)}
        disabled={!!row.trace_id}
      />),
  }, {
    title: '容器编号',
    dataIndex: 'convey_no',
    width: 180,
    render: (convey, row) => (
      <Input
        size="small"
        value={convey}
        onChange={ev => this.handleConveyChange(row.index, ev.target.value)}
        disabled={!!row.trace_id}
      />),
  }, {
    title: '收货数量',
    dataIndex: 'inbound_qty',
    width: 220,
    render: (o, record) => (
      <QuantityInput
        size="small"
        packQty={record.inbound_pack_qty}
        pcsQty={o}
        onChange={e => this.handleProductReceive(record.index, e.target.value)}
        disabled={!!record.trace_id}
      />),
  }, {
    title: '包装情况',
    dataIndex: 'damage_level',
    width: 100,
    render: (o, record) => (
      <Select
        size="small"
        value={o}
        onChange={value => this.handleDamageLevelChange(record.index, value)}
        style={{ width: 90 }}
        disabled={!!record.trace_id}
      >
        <Option value={CWM_DAMAGE_LEVEL[0].value}>{CWM_DAMAGE_LEVEL[0].text}</Option>
        <Option value={CWM_DAMAGE_LEVEL[1].value}>{CWM_DAMAGE_LEVEL[1].text}</Option>
        <Option value={CWM_DAMAGE_LEVEL[2].value}>{CWM_DAMAGE_LEVEL[2].text}</Option>
        <Option value={CWM_DAMAGE_LEVEL[3].value}>{CWM_DAMAGE_LEVEL[3].text}</Option>
        <Option value={CWM_DAMAGE_LEVEL[4].value}>{CWM_DAMAGE_LEVEL[4].text}</Option>
      </Select>),
  }, {
    title: '收货库位',
    dataIndex: 'location',
    width: 150,
    render: (o, record) => (
      <LocationPopover
        size="small"
        value={o}
        style={{ width: '95%' }}
        productNo={this.props.inboundProduct.product_no}
        whseCode={this.props.defaultWhse.code}
        disabled={!!record.trace_id}
        index={record.index}
        onChange={this.handleProductPutAway}
      />),
  }, {
    title: '库存状态',
    dataIndex: 'avail',
    width: 80,
    render: (avail, row) => {
      const availStatus = avail ? 'avail' : 'frozen';
      return (<Select
        size="small"
        value={availStatus}
        onChange={value => this.handleAvailChange(row.index, value)}
        style={{ width: '100%' }}
        disabled={!!row.trace_id}
      >
        <Option value="avail">可用</Option>
        <Option value="frozen">冻结</Option>
      </Select>);
    },
  }, {
    title: '库别',
    width: 100,
    dataIndex: 'virtual_whse',
    render: (o, row) => <Input size="small" value={o} onChange={e => this.handleAttrChange(row.index, e.target.value, 'virtual_whse')} disabled={!!row.trace_id} />,
  }, {
    title: '扩展属性1',
    width: 100,
    dataIndex: 'attrib_1_string',
    render: (o, row) => <Input size="small" value={o} onChange={e => this.handleAttrChange(row.index, e.target.value, 'attrib_1_string')} disabled={!!row.trace_id} />,
  }, {
    title: '扩展属性2',
    width: 100,
    dataIndex: 'attrib_2_string',
    render: (o, row) => <Input size="small" value={o} onChange={e => this.handleAttrChange(row.index, e.target.value, 'attrib_2_string')} disabled={!!row.trace_id} />,
  }, {
    title: '扩展属性3',
    width: 100,
    dataIndex: 'attrib_3_string',
    render: (o, row) => <Input size="small" value={o} onChange={e => this.handleAttrChange(row.index, e.target.value, 'attrib_3_string')} disabled={!!row.trace_id} />,
  }, {
    title: '扩展属性4',
    width: 100,
    dataIndex: 'attrib_4_string',
    render: (o, row) => <Input size="small" value={o} onChange={e => this.handleAttrChange(row.index, e.target.value, 'attrib_4_string')} disabled={!!row.trace_id} />,
  }, {
    title: '收货人员',
    dataIndex: 'received_by',
    width: 120,
    render: (o, row) => (
      <Input
        size="small"
        value={o}
        onChange={ev => this.handleReceiverChange(row.index, ev.target.value)}
        disabled={!!row.trace_id}
      />),
  }, {
    title: '操作',
    width: 50,
    fixed: 'right',
    render: (o, record) => (<RowAction disabled={!!record.trace_id} onClick={this.handleDeleteDetail} label={<Icon type="delete" />} row={record} />),
  }]
  render() {
    const {
      inboundProduct, inboundHead, editable, saveLoading, visible,
    } = this.props;
    const {
      receivedQty, receivedPackQty, receivedDate, disabled,
    } = this.state;
    const columns = inboundHead.rec_mode === 'scan' ? this.scanColumns : this.manualColumns;
    let footer;
    if (inboundHead.rec_mode === 'manual' && editable) {
      footer = () => <Button type="dashed" icon="plus" style={{ width: '100%' }} onClick={this.handleAdd} />;
    }
    return (
      <FullscreenModal
        title={editable ? '收货确认' : '收货记录'}
        onClose={!editable && this.handleCancel}
        onCancel={editable && this.handleCancel}
        onSave={editable && this.handleSubmit}
        saveDisabled={disabled}
        saveLoading={saveLoading}
        visible={visible}
      >
        <Card bodyStyle={{ paddingBottom: 16 }} >
          <Row className="info-group-inline">
            <Col sm={12} md={8} lg={4}>
              <InfoItem label="商品货号" field={inboundProduct.product_no} />
            </Col>
            <Col sm={12} md={8} lg={4}>
              <InfoItem label="中文品名" field={inboundProduct.name} />
            </Col>
            <Col sm={12} md={8} lg={5}>
              <InfoItem label="预期数量" field={<QuantityInput packQty={inboundProduct.expect_pack_qty} pcsQty={inboundProduct.expect_qty} disabled />} />
            </Col>
            <Col sm={12} md={8} lg={5}>
              <InfoItem label="现收数量" field={<QuantityInput packQty={receivedPackQty} pcsQty={receivedQty} expectQty={inboundProduct.expect_qty} disabled />} />
            </Col>
            <Col sm={12} md={8} lg={6}>
              <InfoItem
                label="收货时间"
                field={<DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={receivedDate ? moment(receivedDate) : null}
                  onChange={this.handleReceivedDateChange}
                />}
              />
            </Col>
          </Row>
        </Card>
        <Card bodyStyle={{ padding: 0 }} >
          <Table
            size="middle"
            columns={columns}
            dataSource={this.state.dataSource.map((item, index) => ({ ...item, index }))}
            rowKey="index"
            footer={footer}
            loading={this.state.loading}
            scroll={{ x: columns.reduce((acc, cur) => acc + (cur.width ? cur.width : 240), 0) }}
          />
        </Card>
      </FullscreenModal>
    );
  }
}
