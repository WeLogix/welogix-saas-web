import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Col, Row, Tooltip, Form, Input, Radio, Button, Table, Select, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { readWaybillLogo, orderExpress, toggleSFExpressModal, loadExpressInfo, addZD } from 'common/reducers/cwmOutbound';
import FullscreenModal from 'client/components/FullscreenModal';
import RowAction from 'client/components/RowAction';
import Cascader from 'client/components/RegionCascader';
import { WaybillDef, TrigeminyListDef } from '../print/sfWaybill';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EXPRESS_TYPES = [
  { text: '顺丰标快', value: '1' },
  { text: '顺丰特惠', value: '2' },
  { text: '顺丰次晨', value: '5' },
  { text: '顺丰即日', value: '6' },
  { text: '重货快运', value: '18' },
  { text: '物流普运', value: '13' },
];

const PAY_METHODS = [
  { text: '寄付月结', value: '1' },
  { text: '到付', value: '2' },
  { text: '第三方付', value: '3' },
];

const ADDED_SERVICES = [
  { text: '代收货款', value: 'COD' },
  { text: '保价', value: 'INSURE' },
];

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    reload: state.cwmOutbound.outboundReload,
    waybill: state.cwmOutbound.waybill,
    visible: state.cwmOutbound.SFExpressModal.visible,
    config: state.cwmOutbound.SFExpressModal.config,
    outboundHead: state.cwmOutbound.outboundFormHead,
  }),
  {
    readWaybillLogo,
    orderExpress,
    toggleSFExpressModal,
    loadExpressInfo,
    addZD,
  }
)
export default class SFExpressModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    toggleSFExpressModal: PropTypes.func.isRequired,
    loadExpressInfo: PropTypes.func.isRequired,
    addZD: PropTypes.func.isRequired,
    config: PropTypes.shape({ order_no: PropTypes.string }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  // 第一单：顺丰标快--寄付月结--保价；
  // 第二单：顺丰特惠--到付--签回单；
  // 第三单：顺丰次晨--第三方付--代收货款；
  // 第四单：顺丰即日--寄付月结--子母件；
  // 第五单：重货快运--寄付月结；
  // 第六单：物流普运--寄付月结
  state = {
    mailnoLoading: false,
    sonMailnoLoading: false,

    receiver_phone: '',
    receiver_address: '',
    receiver_contact: '',
    receiver_province: '',
    receiver_city: '',
    receiver_district: '',
    receiver_street: '',
    receiver_region_code: null,

    sender_phone: '',
    sender_address: '',
    sender_contact: '',
    sender_province: '',
    sender_city: '',
    sender_district: '',
    sender_street: '',
    sender_region_code: null,

    express_type: '2',
    pay_method: '3',
    insure_value: 0,
    weight: 0,
    custid: '',
    product_name: '',
    product_qty: 0,
    parcel_quantity: 1,
    need_return_tracking_no: '0',
    added_services: '',
    cod_value: 0,
    cod_card_id: '',

    mailno: '',
    return_tracking_no: '',
    origincode: '',
    destcode: '',
    filter_result: '',
    remark: '',
  }
  componentDidMount() {
    this.props.readWaybillLogo();
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.loadExpressInfo(nextProps);
    }
  }
  loadExpressInfo = (props) => {
    this.props.loadExpressInfo(props.config.order_no).then((result) => {
      this.setState({ mailnoLoading: false, sonMailnoLoading: false });
      if (result.data) {
        this.setState({ ...result.data });
      } else {
        this.setState({
          ...this.props.config,
          product_qty: this.props.outboundHead.total_qty,
        });
      }
    });
  }
  handleAddZD = () => {
    this.setState({ sonMailnoLoading: true });
    const { config, loginId } = this.props;
    this.props.addZD({ orderNo: config.order_no, loginId, expressNum: 1 }).then(() => {
      this.loadExpressInfo(this.props);
    });
  }
  msg = formatMsg(this.props.intl)
  handleWaybillPrint = (courierNo, courierNoSon, seq, type) => {
    const expressType = EXPRESS_TYPES.find(item => item.value === this.state.express_type).text;
    const payMethod = PAY_METHODS.find(item => item.value === this.state.pay_method).text;
    const expressInfo = {
      cust_order_no: this.props.outboundHead.cust_order_no,
      express_type: expressType,
      pay_method: payMethod,
      insure_value: Number(this.state.insure_value),
      weight: this.state.weight,
      custid: this.state.custid,
      product_name: this.state.product_name,
      product_qty: this.state.product_qty,
      parcel_quantity: this.state.parcel_quantity,
      need_return_tracking_no: this.state.need_return_tracking_no,
      added_services: this.state.added_services,

      sender_phone: this.state.sender_phone,
      sender_address: this.state.sender_address,
      sender_contact: this.state.sender_contact,
      sender_province: this.state.sender_province,
      sender_city: this.state.sender_city,
      sender_district: this.state.sender_district,
      sender_street: this.state.sender_street,
      sender_region_code: this.state.sender_region_code,

      receiver_phone: this.state.receiver_phone,
      receiver_address: this.state.receiver_address,
      receiver_contact: this.state.receiver_contact,
      receiver_province: this.state.receiver_province,
      receiver_city: this.state.receiver_city,
      receiver_district: this.state.receiver_district,
      receiver_street: this.state.receiver_street,
      receiver_region_code: this.state.receiver_region_code,

      mailno: this.state.mailno,
      return_tracking_no: this.state.return_tracking_no,
      origincode: this.state.origincode,
      destcode: this.state.destcode,
      filter_result: this.state.filter_result,
      remark: this.state.remark,
    };
    // podWaybillDef
    // const docDefinition = podWaybillDef({
    //   ...this.props.waybill,
    //   courierNo,
    //   courierNoSon,
    //   expressNum,
    //   seq,
    //   whseInfo,
    // });
    let docDefinition = null;
    if (type === 2) {
      docDefinition = WaybillDef({
        ...this.props.waybill,
        courierNo,
        courierNoSon,
        seq,
        expressInfo,
      });
      window.pdfMake.fonts = {
        selfFont: {
          normal: 'msyh.ttf',
          bold: 'msyh.ttf',
          italics: 'frutigel.ttf',
        },
      };
    } else {
      docDefinition = TrigeminyListDef({
        ...this.props.waybill,
        courierNo,
        courierNoSon,
        seq,
        expressInfo,
      });
      window.pdfMake.fonts = {
        selfFont: {
          normal: 'msyh.ttf',
          bold: 'msyh.ttf',
          italics: 'frutigel.ttf',
        },
      };
    }

    window.pdfMake.createPdf(docDefinition).open();
  }
  orderExpress = () => {
    this.setState({ mailnoLoading: true });
    const { config } = this.props;
    const expressInfo = {
      express_type: this.state.express_type,
      pay_method: this.state.pay_method,
      insure_value: Number(this.state.insure_value),
      weight: this.state.weight,
      custid: this.state.custid,
      product_name: this.state.product_name,
      product_qty: this.state.product_qty,
      parcel_quantity: this.state.parcel_quantity,
      need_return_tracking_no: this.state.need_return_tracking_no,
      added_services: this.state.added_services,

      sender_phone: this.state.sender_phone,
      sender_address: this.state.sender_address,
      sender_contact: this.state.sender_contact,
      sender_province: this.state.sender_province,
      sender_city: this.state.sender_city,
      sender_district: this.state.sender_district,
      sender_street: this.state.sender_street,
      sender_region_code: this.state.sender_region_code,

      receiver_phone: this.state.receiver_phone,
      receiver_address: this.state.receiver_address,
      receiver_contact: this.state.receiver_contact,
      receiver_province: this.state.receiver_province,
      receiver_city: this.state.receiver_city,
      receiver_district: this.state.receiver_district,
      receiver_street: this.state.receiver_street,
      receiver_region_code: this.state.receiver_region_code,
    };
    this.props.orderExpress({
      orderNo: config.order_no,
      expressInfo,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      }
      this.loadExpressInfo(this.props);
    });
  }
  handleReceiverRegionChange = (value) => {
    this.setState({
      receiver_region_code: value[0],
      receiver_province: value[1],
      receiver_city: value[2],
      receiver_district: value[3],
      receiver_street: value[4],
    });
  }
  handleSenderRegionChange = (value) => {
    this.setState({
      sender_region_code: value[0],
      sender_province: value[1],
      sender_city: value[2],
      sender_district: value[3],
      sender_street: value[4],
    });
  }
  render() {
    const { mailno } = this.state;
    const courierNo = mailno ? mailno.split(',') : [];
    const dataSource = courierNo.map((item, index) => {
      if (index === 0) {
        return {
          courier_no: item,
        };
      }
      return {
        courier_no: item,
      };
    });
    const columns = [{
      width: 40,
      render: (col, row, index) => index + 1,
    }, {
      dataIndex: 'courier_no',
      render: (col, row, index) => {
        if (index === 0) {
          return <Tooltip title="母单号"><strong>{col}</strong></Tooltip>;
        }
        return <Tooltip title="子单号">{col}</Tooltip>;
      },
    }, {
      width: 180,
      render: (col, row, index) => (
        <span>
          <RowAction icon="printer" label="二联单" onClick={() => this.handleWaybillPrint(courierNo[0], row.courier_no, index + 1, 2)} />
          <RowAction icon="printer" label="三联单" onClick={() => this.handleWaybillPrint(courierNo[0], row.courier_no, index + 1, 3)} />
        </span>),
    }];
    const receiverRegionValues = [this.state.receiver_province, this.state.receiver_city,
      this.state.receiver_district, this.state.receiver_street];
    const senderRegionValues = [this.state.sender_province, this.state.sender_city,
      this.state.sender_district, this.state.sender_street];
    return (
      <FullscreenModal
        title={this.msg('顺丰快递单打印')}
        onClose={() => this.props.toggleSFExpressModal(false)}
        visible={this.props.visible}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card title="订单信息" >
              <Row className="form-row">
                <Col span={12}>
                  <FormItem label="快递类型" {...formItemLayout} required>
                    <Select
                      placeholder="快递类型"
                      value={this.state.express_type}
                      onChange={value => this.setState({ express_type: value })}
                      style={{ width: '100%' }}
                    >
                      {EXPRESS_TYPES.map(item =>
                        (<Option key={item.value} value={item.value}>{item.text}</Option>))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem label="签单返还" {...formItemLayout}>
                    <RadioGroup
                      value={this.state.need_return_tracking_no}
                      onChange={e => this.setState({ need_return_tracking_no: e.target.value })}
                      style={{ fontSize: 13 }}
                    >
                      <RadioButton value="0">否</RadioButton>
                      <RadioButton value="1">是</RadioButton>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="付款方式" {...formItemLayout} required>
                    <Select
                      placeholder="付款方式"
                      value={this.state.pay_method}
                      onChange={value => this.setState({ pay_method: value })}
                      style={{ width: '100%' }}
                    >
                      {PAY_METHODS.map(item =>
                        (<Option key={item.value} value={item.value}>{item.text}</Option>))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="包裹数" {...formItemLayout} required>
                    <Input
                      value={this.state.parcel_quantity}
                      type="number"
                      onChange={e => this.setState({ parcel_quantity: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="月结卡号" {...formItemLayout}>
                    <Input
                      value={this.state.custid}
                      onChange={e => this.setState({ custid: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="托寄物" {...formItemLayout}>
                    <Input
                      value={this.state.product_name}
                      onChange={e => this.setState({ product_name: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="重量" {...formItemLayout}>
                    <Input
                      value={this.state.weight}
                      onChange={e => this.setState({ weight: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="总件数" {...formItemLayout}>
                    <Input value={this.state.product_qty} type="number" onChange={e => this.setState({ product_qty: e.target.value })} />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="增值服务" {...formItemLayout}>
                    <Select
                      placeholder="增值服务"
                      mode="tags"
                      value={this.state.added_services ? this.state.added_services.split(',') : []}
                      onChange={value => this.setState({ added_services: value.join(',') })}
                      style={{ width: '100%' }}
                    >
                      {ADDED_SERVICES.map(item =>
                        (<Option key={item.value} value={item.value}>{item.text}</Option>))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {this.state.added_services.indexOf('INSURE') >= 0 &&
                  <FormItem label="保价金额" {...formItemLayout} required>
                    <Input
                      value={this.state.insure_value}
                      type="number"
                      onChange={e => this.setState({ insure_value: e.target.value })}
                    />
                  </FormItem>
                }
                </Col>
                {this.state.added_services.indexOf('COD') >= 0 &&
                <Col span={12}>
                  <FormItem label="代收货款额" {...formItemLayout} required>
                    <Input
                      value={this.state.cod_value}
                      onChange={e => this.setState({ cod_value: e.target.value })}
                    />
                  </FormItem>
                </Col>
            }
                {this.state.added_services.indexOf('COD') >= 0 &&
                <Col span={12}>
                  <FormItem label="代收货款卡号" {...formItemLayout} required>
                    <Input
                      value={this.state.cod_card_id}
                      onChange={e => this.setState({ cod_card_id: e.target.value })}
                    />
                  </FormItem>
                </Col>
            }
              </Row>
              <Row className="form-row">
                <Col span={12}>
                  <FormItem label="收货人" {...formItemLayout} required>
                    <Input
                      value={this.state.receiver_contact}
                      placeholder="收货人"
                      onChange={e => this.setState({ receiver_contact: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="电话" {...formItemLayout} required>
                    <Input
                      value={this.state.receiver_phone}
                      placeholder="电话"
                      onChange={e => this.setState({ receiver_phone: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="地址" {...formItemLayout} required>
                    <Cascader
                      defaultRegion={receiverRegionValues}
                      onChange={this.handleReceiverRegionChange}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="详细地址" {...formItemLayout} required>
                    <Input
                      value={this.state.receiver_address}
                      onChange={e => this.setState({ receiver_address: e.target.value })}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row className="form-row">
                <Col span={12}>
                  <FormItem label="发货人" {...formItemLayout} required>
                    <Input
                      value={this.state.sender_contact}
                      placeholder="发货人"
                      onChange={e => this.setState({ sender_contact: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="电话" {...formItemLayout} required>
                    <Input
                      value={this.state.sender_phone}
                      placeholder="电话"
                      onChange={e => this.setState({ sender_phone: e.target.value })}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="地址" {...formItemLayout} required>
                    <Cascader
                      defaultRegion={senderRegionValues}
                      onChange={this.handleSenderRegionChange}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="详细地址" {...formItemLayout} required>
                    <Input
                      value={this.state.sender_address}
                      onChange={e => this.setState({ sender_address: e.target.value })}
                    />
                  </FormItem>
                </Col>
              </Row>

            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="快递单号"
              extra={<Button type="primary" onClick={this.orderExpress} loading={this.state.mailnoLoading}>获取单号</Button>}

            >
              <Table dataSource={dataSource} columns={columns} showHeader={false} size="small" pagination={false} />
              <br />
              {mailno &&
                <Button
                  type="dashed"
                  icon="plus"
                  style={{ width: '100%' }}
                  onClick={this.handleAddZD}
                  loading={this.state.sonMailnoLoading}
                >增加子单号
                </Button>}
            </Card>
          </Col>
        </Row>
      </FullscreenModal>
    );
  }
}
