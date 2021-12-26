import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Icon, DatePicker, InputNumber, Form, Row, Col, Input, Select, Alert } from 'antd';
import { setClientForm, loadFlowNodeData } from 'common/reducers/sofOrders';
import { loadTariffsByTransportInfo, toggleAddLineModal, isLineIntariff, toggleAddLocationModal } from 'common/reducers/scofFlow';
import { uuidWithoutDash } from 'client/common/uuid';
import { GOODS_TYPES, COURIERS, TARIFF_METER_METHODS } from 'common/constants';
import { format } from 'client/common/i18n/helpers';
import FormPane from 'client/components/FormPane';
import UserAvatar from 'client/components/UserAvatar';
import * as Location from 'client/util/location';
import AddLineModal from 'client/apps/paas/flow/modal/addLineModal';
import AddLocationModal from 'client/apps/paas/flow/modal/addLocationModal';
import messages from '../message.i18n';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const formatMsg = format(messages);

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const quoteNoFieldWarning = {
  validateStatus: 'warning',
  help: '请重新选择报价协议',
};
@injectIntl
@connect(
  state => ({
    formRequires: state.sofOrders.formRequires,
    customerPartnerId: state.sofOrders.formData.customer_partner_id,
    customerName: state.sofOrders.formData.customer_name,
    serviceTeam: state.saasCollab.operators,
    needLoadTariff: state.scofFlow.needLoadTariff,
  }),
  {
    setClientForm,
    loadFlowNodeData,
    loadTariffsByTransportInfo,
    toggleAddLineModal,
    isLineIntariff,
    toggleAddLocationModal,
  }
)
export default class TMSConsignForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    index: PropTypes.number.isRequired,
    operation: PropTypes.oneOf(['view', 'edit', 'create']),
    formData: PropTypes.shape({
      node: PropTypes.shape({ node_uuid: PropTypes.string }),
    }).isRequired,
    setClientForm: PropTypes.func.isRequired,
    customerPartnerId: PropTypes.number,
    customerName: PropTypes.string,
    serviceTeam: PropTypes.arrayOf(PropTypes.shape({
      lid: PropTypes.number.isRequired, name: PropTypes.string.isRequired,
    })),
    shipment: PropTypes.shape({
      cust_shipmt_pieces: PropTypes.string,
      cust_shipmt_weight: PropTypes.string,
      // cust_shipmt_goods_type: PropTypes.string,
      cust_shipmt_wrap_type: PropTypes.string,
    }),
    loadTariffsByTransportInfo: PropTypes.func.isRequired,
    needLoadTariff: PropTypes.bool.isRequired,
    toggleAddLineModal: PropTypes.func.isRequired,
    isLineIntariff: PropTypes.func.isRequired,
    toggleAddLocationModal: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  state = {
    tariffs: [],
    isLineIntariff: true,
    quoteNoField: {
      validateStatus: '',
      help: '',
    },
  }
  componentDidMount() {
    const { formData, formRequires, customerPartnerId } = this.props;
    const { node } = formData;
    if (!node.uuid && node.node_uuid) {
      this.props.loadFlowNodeData(node.node_uuid, node.kind).then((result) => {
        if (!result.error) {
          const nodedata = result.data;
          const consigner = formRequires.consignerLocations.filter(cl =>
            cl.node_id === nodedata.consigner_id)[0];
          const consignee = formRequires.consigneeLocations.filter(cl =>
            cl.node_id === nodedata.consignee_id)[0];
          const transitMode = formRequires.transitModes.filter(tm =>
            tm.mode_code === nodedata.transit_mode)[0];
          this.handleSetClientForm({
            consigner_id: nodedata.consigner_id,
            consigner_name: consigner && consigner.name,
            consigner_byname: consigner && consigner.byname,
            consigner_province: consigner && consigner.province,
            consigner_city: consigner && consigner.city,
            consigner_district: consigner && consigner.district,
            consigner_street: consigner && consigner.street,
            consigner_region_code: consigner && consigner.region_code,
            consigner_addr: consigner && consigner.addr,
            consigner_email: consigner && consigner.email,
            consigner_contact: consigner && consigner.contact,
            consigner_mobile: consigner && consigner.mobile,
            consignee_id: nodedata.consignee_id,
            consignee_name: consignee && consignee.name,
            consignee_byname: consignee && consignee.byname,
            consignee_province: consignee && consignee.province,
            consignee_city: consignee && consignee.city,
            consignee_district: consignee && consignee.district,
            consignee_street: consignee && consignee.street,
            consignee_region_code: consignee && consignee.region_code,
            consignee_addr: consignee && consignee.addr,
            consignee_email: consignee && consignee.email,
            consignee_contact: consignee && consignee.contact,
            consignee_mobile: consignee && consignee.mobile,
            pack_count: null,
            gross_wt: null,
            goods_type: nodedata.goods_type,
            trs_mode_id: transitMode && transitMode.id,
            trs_mode_code: nodedata.transit_mode,
            trs_mode: transitMode && transitMode.mode_name,
            pod: nodedata.pod,
            quote_no: nodedata.quote_no,
            remark: '',
            package: '',
            uuid: uuidWithoutDash(),
            bizObjNeedLoad: false,
          });
          this.props.loadTariffsByTransportInfo(
            customerPartnerId,
            nodedata.transit_mode,
            nodedata.goods_type
          ).then((result1) => {
            this.setState({
              tariffs: result1.data || [],
            });
          });
        }
      });
    } else {
      this.props.loadTariffsByTransportInfo(
        customerPartnerId,
        node.trs_mode_code,
        node.goods_type
      ).then((result1) => {
        this.setState({
          tariffs: result1.data || [],
        });
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.needLoadTariff) {
      const { formData, customerPartnerId } = nextProps;
      const { node } = formData;
      nextProps.loadTariffsByTransportInfo(
        customerPartnerId,
        node.trs_mode_code,
        node.goods_type
      ).then((result1) => {
        this.setState({
          tariffs: result1.data || [],
        }, () => {
          this.handleJudgeLine({ });
        });
      });
    }
  }
  handleLoadTariffs = (props) => {
    const { formData, customerPartnerId } = props;
    const { node } = formData;
    props.loadTariffsByTransportInfo(
      customerPartnerId,
      node.trs_mode_code,
      node.goods_type
    ).then((result1) => {
      this.setState({
        tariffs: result1.data || [],
      });
    });
  }
  msg = key => formatMsg(this.props.intl, key)
  handleSetClientForm = (data) => {
    const { index, formData } = this.props;
    const newData = { ...formData, node: { ...formData.node, ...data } };
    this.props.setClientForm(index, newData);
  }
  handleChange = (key, value) => {
    this.handleSetClientForm({ [key]: value });
    if (key === 'quote_no') {
      this.handleJudgeLine({ quoteNo: value });
      this.setState({
        quoteNoField: {
          validateStatus: '',
          help: '',
        },
      });
    }
  }
  handleJudgeLine = ({ consignerId, consigneeId, quoteNo }) => {
    const { formData, formRequires } = this.props;
    const consigner = formRequires.consignerLocations.find(item =>
      item.node_id === (consignerId || formData.node.consigner_id));
    const consignee = formRequires.consigneeLocations.find(item =>
      item.node_id === (consigneeId || formData.node.consignee_id));
    if ((quoteNo || formData.node.quote_no) && consigner && consignee) {
      const tariff = this.state.tariffs.find(item =>
        item.quoteNo === (quoteNo || formData.node.quote_no));
      const line = {
        source: {
          code: consigner.region_code,
          province: consigner.province,
          city: consigner.city,
          district: consigner.district,
          street: consigner.street,
          name: consigner.byname,
        },
        end: {
          code: consignee.region_code,
          province: consignee.province,
          city: consignee.city,
          district: consignee.district,
          street: consignee.street,
          name: consignee.byname,
        },
      };
      if (tariff) {
        this.props.isLineIntariff({
          tariffId: tariff._id,
          line,
        }).then((result) => {
          if (result.data.isLineIntariff) {
            this.handleTransitChange(result.data.rateEnd.time);
          }
          this.setState({ isLineIntariff: result.data.isLineIntariff });
        });
      }
    }
  }
  handleConsignChange = (key, value) => {
    if (typeof value !== 'string' && value !== undefined && value !== null) {
      return;
    }
    const { formRequires } = this.props;
    const consignForm = {};
    if (key === 'consigner_name') {
      if (!value) {
        consignForm.consigner_id = null;
        consignForm.consigner_name = null;
        consignForm.consigner_byname = null;
        consignForm.consigner_province = null;
        consignForm.consigner_city = null;
        consignForm.consigner_district = null;
        consignForm.consigner_street = null;
        consignForm.consigner_region_code = null;
        consignForm.consigner_addr = null;
        consignForm.consigner_email = null;
        consignForm.consigner_contact = null;
        consignForm.consigner_mobile = null;
      } else {
        consignForm.consigner_name = value;
        const consign = formRequires.consignerLocations.find(item => item.name === value);
        if (consign) {
          consignForm.consigner_id = consign.node_id;
          consignForm.consigner_byname = consign.byname;
          consignForm.consigner_province = consign.province;
          consignForm.consigner_city = consign.city;
          consignForm.consigner_district = consign.district;
          consignForm.consigner_street = consign.street;
          consignForm.consigner_region_code = consign.region_code;
          consignForm.consigner_addr = consign.addr;
          consignForm.consigner_email = consign.email;
          consignForm.consigner_contact = consign.contact;
          consignForm.consigner_mobile = consign.mobile;
          this.handleJudgeLine({ consignerId: consign.node_id });
        } else {
          consignForm.consigner_id = null;
        }
      }
    } else if (key === 'consignee_name') {
      if (!value) {
        consignForm.consignee_id = null;
        consignForm.consignee_name = null;
        consignForm.consignee_byname = null;
        consignForm.consignee_province = null;
        consignForm.consignee_city = null;
        consignForm.consignee_district = null;
        consignForm.consignee_street = null;
        consignForm.consignee_region_code = null;
        consignForm.consignee_addr = null;
        consignForm.consignee_email = null;
        consignForm.consignee_contact = null;
        consignForm.consignee_mobile = null;
      } else {
        consignForm.consignee_name = value;
        const consign = formRequires.consigneeLocations.find(item => item.name === value);
        if (consign) {
          consignForm.consignee_id = consign.node_id;
          consignForm.consignee_byname = consign.byname;
          consignForm.consignee_province = consign.province;
          consignForm.consignee_city = consign.city;
          consignForm.consignee_district = consign.district;
          consignForm.consignee_street = consign.street;
          consignForm.consignee_region_code = consign.region_code;
          consignForm.consignee_addr = consign.addr;
          consignForm.consignee_email = consign.email;
          consignForm.consignee_contact = consign.contact;
          consignForm.consignee_mobile = consign.mobile;
          this.handleJudgeLine({ consigneeId: consign.node_id });
        } else {
          consignForm.consignee_id = null;
        }
      }
    }
    this.handleSetClientForm(consignForm);
  }
  handleShowAddLineModal = () => {
    const { formData, formRequires } = this.props;
    const consigner = formRequires.consignerLocations.find(item =>
      item.node_id === formData.node.consigner_id);
    const consignee = formRequires.consigneeLocations.find(item =>
      item.node_id === formData.node.consignee_id);
    const tariff = this.state.tariffs.find(item => item.quoteNo === formData.node.quote_no);
    if (tariff) {
      const line = {
        source: {
          code: consigner.region_code,
          province: consigner.province,
          city: consigner.city,
          district: consigner.district,
          street: consigner.street,
          name: consigner.byname,
        },
        end: {
          code: consignee.region_code,
          province: consignee.province,
          city: consignee.city,
          district: consignee.district,
          street: consignee.street,
          name: consignee.byname,
        },
      };
      this.props.toggleAddLineModal({
        visible: true,
        tariff,
        line,
      });
    } else {
      this.setState({ isLineIntariff: true, quoteNoField: quoteNoFieldWarning });
    }
  }
  handleShowAddLocationModal = (type) => {
    const { formData } = this.props;
    const tariff = this.state.tariffs.find(item => item.quoteNo === formData.node.quote_no);
    this.props.toggleAddLocationModal({
      visible: true,
      partnerId: this.props.customerPartnerId,
      partnerName: this.props.customerName,
      type,
      tariffId: tariff ? tariff._id : '',
    });
  }
  handleConsignSelect = (key, value) => {
    if (value === -1) {
      if (key === 'consigner_name') {
        this.handleShowAddLocationModal(0);
      } else if (key === 'consignee_name') {
        this.handleShowAddLocationModal(1);
      }
      return;
    }
    const consignForm = {};
    const { formRequires } = this.props;
    if (key === 'consigner_name') {
      const consign = formRequires.consignerLocations.find(item => item.node_id === value);
      if (consign) {
        consignForm.consigner_id = consign.node_id;
        consignForm.consigner_name = consign.name;
        consignForm.consigner_byname = consign.byname;
        consignForm.consigner_province = consign.province;
        consignForm.consigner_city = consign.city;
        consignForm.consigner_district = consign.district;
        consignForm.consigner_street = consign.street;
        consignForm.consigner_region_code = consign.region_code;
        consignForm.consigner_addr = consign.addr;
        consignForm.consigner_email = consign.email;
        consignForm.consigner_contact = consign.contact;
        consignForm.consigner_mobile = consign.mobile;
        this.handleJudgeLine({ consignerId: consign.node_id });
      }
    } else if (key === 'consignee_name') {
      const consign = formRequires.consigneeLocations.find(item => item.node_id === value);
      if (consign) {
        consignForm.consignee_id = consign.node_id;
        consignForm.consignee_name = consign.name;
        consignForm.consignee_byname = consign.byname;
        consignForm.consignee_province = consign.province;
        consignForm.consignee_city = consign.city;
        consignForm.consignee_district = consign.district;
        consignForm.consignee_street = consign.street;
        consignForm.consignee_region_code = consign.region_code;
        consignForm.consignee_addr = consign.addr;
        consignForm.consignee_email = consign.email;
        consignForm.consignee_contact = consign.contact;
        consignForm.consignee_mobile = consign.mobile;
        this.handleJudgeLine({ consigneeId: consign.node_id });
      }
    }
    this.handleSetClientForm(consignForm);
  }
  // handleRegionValueChange = (consignType, region) => {
  //   const [code, province, city, district, street] = region;
  //   const consign = {};
  //   consign[`${consignType}_region_code`] = code;
  //   consign[`${consignType}_province`] = province;
  //   consign[`${consignType}_city`] = city;
  //   consign[`${consignType}_district`] = district;
  //   consign[`${consignType}_street`] = street;
  //   this.handleSetClientForm(consign);
  // }
  handleTransmodeChange = (value) => {
    const { formData, customerPartnerId } = this.props;
    const transportMode = this.props.formRequires.transitModes.find(item => item.id === value);
    this.props.loadTariffsByTransportInfo(
      customerPartnerId,
      transportMode.mode_code,
      formData.node.goods_type
    ).then((result) => {
      this.setState({ tariffs: result.data });
    });
    if (formData.node.quote_no) {
      this.setState({ quoteNoField: quoteNoFieldWarning });
    }
    this.setState({ isLineIntariff: true });
    this.handleSetClientForm({
      trs_mode_id: transportMode.id,
      trs_mode_code: transportMode.mode_code,
      trs_mode: transportMode.mode_name,
      quote_no: '',
    });
  }
  handlePickupChange = (pickupDt) => {
    if (pickupDt) {
      const transitTime = this.props.formData.node.transit_time || 0;
      const deliverDate = new Date(pickupDt.valueOf() + (transitTime * ONE_DAY_MS));
      this.handleSetClientForm({
        pickup_est_date: pickupDt,
        deliver_est_date: moment(deliverDate),
      });
    }
  }
  handleTransitChange = (value) => {
    const pickupDt = this.props.formData.node.pickup_est_date;
    if (typeof value === 'number') {
      if (pickupDt) {
        const deliverDate = new Date(pickupDt.valueOf() + (value * ONE_DAY_MS));
        this.handleSetClientForm({
          deliver_est_date: moment(deliverDate),
          transit_time: value,
        });
      } else {
        this.handleSetClientForm({
          transit_time: value,
        });
      }
    }
  }
  handleDeliveryChange = (deliverDt) => {
    if (deliverDt) {
      const transitTime = this.props.formData.node.transit_time || 0;
      const pickupDt = new Date(deliverDt.valueOf() - (transitTime * ONE_DAY_MS));
      this.handleSetClientForm({
        deliver_est_date: deliverDt,
        pickup_est_date: moment(pickupDt, 'YYYY-MM-DD'),
      });
    }
  }
  handelVehicleTypeSelect = (value) => {
    const vt = this.props.formRequires.vehicleTypes.filter(vht => vht.value === value)[0];
    if (vt) {
      this.handleSetClientForm({
        vehicle_type_id: vt.value,
        vehicle_type: vt.text,
      });
    }
  }
  handelVehicleLengthSelect = (value) => {
    const vl = this.props.formRequires.vehicleLengths.filter(vhl => vhl.value === value)[0];
    if (vl) {
      this.handleSetClientForm({
        vehicle_length_id: vl.value,
        vehicle_length: vl.text,
      });
    }
  }
  handleExpressChange = (value) => {
    const exp = COURIERS.filter(cur => cur.code === value)[0];
    if (exp) {
      this.handleSetClientForm({
        express_code: exp.code,
        express_vendor: exp.name,
      });
    }
  }
  handlePersonChange = (value) => {
    const person = this.props.serviceTeam.filter(st => st.lid === value)[0];
    if (person) {
      this.handleSetClientForm({ person_id: value, person: person.name });
    }
  }
  handleAddedLocation = (location) => {
    if (location.type === 0) {
      this.handleConsignSelect('consigner_name', location.id);
    } else if (location.type === 1) {
      this.handleConsignSelect('consignee_name', location.id);
    }
  }
  handleCommonFieldChange = (filed, value) => {
    if (filed === 'goods_type') {
      const { formData, customerPartnerId } = this.props;
      this.props.loadTariffsByTransportInfo(
        customerPartnerId,
        formData.node.trs_mode_code,
        value
      ).then((result) => {
        this.setState({ tariffs: result.data });
      });
      if (formData.node.quote_no) {
        this.setState({ quoteNoField: quoteNoFieldWarning });
      }
      this.setState({ isLineIntariff: true });
      this.handleSetClientForm({ [filed]: value, quote_no: '' });
    } else {
      this.handleSetClientForm({ [filed]: value });
    }
  }
  handleShipmentRelate = () => {
    const { shipment } = this.props;
    const related = {
      goods_type: shipment.cust_shipmt_goods_type,
      gross_wt: shipment.cust_shipmt_weight,
      volume: shipment.cust_shipmt_volume,
      package: shipment.cust_shipmt_wrap_type,
      pack_count: shipment.cust_shipmt_pieces,
    };
    this.handleSetClientForm(related);
  }
  renderConsign = consign => `${consign.name} | ${Location.renderLoc(consign)} | ${consign.byname || ''} | ${consign.contact || ''}`
  renderTmsTariff = (tariff) => {
    let text = tariff.quoteNo;
    const tms = this.props.formRequires.transitModes.find(tm =>
      tm.id === Number(tariff.transModeCode));
    const meter = TARIFF_METER_METHODS.find(m => m.value === tariff.meter);
    const goodType = GOODS_TYPES.find(m => m.value === tariff.goodsType);
    if (tms) text = `${text}-${tms.mode_name}`;
    if (meter) text = `${text}/${meter.text}`;
    if (goodType) text = `${text}/${goodType.text}`;
    return text;
  }
  render() {
    const {
      formData, serviceTeam, formRequires: {
        consignerLocations, consigneeLocations,
        transitModes,
      }, customerPartnerId, disabled,
    } = this.props;
    const { quoteNoField } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      colon: false,
    };
    const consignLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      colon: false,
    };
    const fullColLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
      colon: false,
    };
    const { node } = formData;
    // todo consigner consignee by customer partner id
    const consigner = consignerLocations.find(item => item.node_id === node.consigner_id);
    const consignee = consigneeLocations.find(item => item.node_id === node.consignee_id);
    const consignerLocation = (consigner && consigner.byname) ? consigner.byname : Location.renderLocation(node, 'consigner_province', 'consigner_city', 'consigner_district', 'consigner_street');
    const consigneeLocation = (consignee && consignee.byname) ? consignee.byname : Location.renderLocation(node, 'consignee_province', 'consignee_city', 'consignee_district', 'consignee_street');

    return (
      <FormPane >
        {
          !this.state.isLineIntariff &&
            <Alert message={<div>发货/收货地址不在报价协议的线路里 <a onClick={this.handleShowAddLineModal}>添加到报价协议</a></div>} type="warning" showIcon />
        }
        <Row gutter={16}>
          <Col sm={12}>
            <FormItem label="起运地" {...consignLayout}>
              <Row>
                <Select
                  allowClear
                  showArrow
                  value={node.consigner_id}
                  onChange={value => this.handleConsignChange('consigner_name', value)}
                  onSelect={value => this.handleConsignSelect('consigner_name', value)}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 400 }}
                  optionFilterProp="children"
                  showSearch
                  notFoundContent={
                    <a onClick={() => this.handleShowAddLocationModal(0)}>+ 添加地址</a>}
                  disabled={disabled}
                >
                  {consignerLocations.filter(cl =>
                        cl.ref_partner_id === customerPartnerId || cl.ref_partner_id === -1)
                          .map(dw => (<Option value={dw.node_id} key={dw.node_id}>
                            {this.renderConsign(dw)}</Option>))
                }
                  <Option value={-1} key={-1}>+ 添加地址</Option>
                </Select>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <InputGroup >
                  <Input value={consignerLocation} readOnly style={{ width: '50%' }} />
                  <Input
                    prefix={<Icon type="environment-o" />}
                    value={node.consigner_addr}
                    onChange={e => this.handleChange('consigner_addr', e.target.value)}
                    placeholder="详细地址"
                    style={{ width: '50%' }}
                    disabled={disabled}
                  />
                </InputGroup>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <InputGroup >
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="user" />}
                    value={node.consigner_contact}
                    onChange={e => this.handleChange('consigner_contact', e.target.value)}
                    placeholder="联系人"
                    disabled={disabled}
                  />
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="mobile" />}
                    value={node.consigner_mobile}
                    type="tel"
                    onChange={e => this.handleChange('consigner_mobile', e.target.value)}
                    placeholder="电话"
                    disabled={disabled}
                  />
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="mail" />}
                    value={node.consigner_email}
                    type="email"
                    onChange={e => this.handleChange('consigner_email', e.target.value)}
                    placeholder="邮箱"
                    disabled={disabled}
                  />
                </InputGroup>
              </Row>
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="目的地" {...consignLayout}>
              <Row>
                <Select
                  allowClear
                  showArrow
                  value={node.consignee_id}
                  onChange={value => this.handleConsignChange('consignee_name', value)}
                  onSelect={value => this.handleConsignSelect('consignee_name', value)}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 400 }}
                  optionFilterProp="children"
                  showSearch
                  notFoundContent={
                    <a onClick={() => this.handleShowAddLocationModal(1)}>+ 添加地址</a>}
                  disabled={disabled}
                >
                  {consigneeLocations.filter(cl =>
                        cl.ref_partner_id === customerPartnerId || cl.ref_partner_id === -1)
                          .map(dw => (<Option value={dw.node_id} key={dw.node_id}>
                            {this.renderConsign(dw)}</Option>))}
                  <Option value={-1} key={-1}>+ 添加地址</Option>
                </Select>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <InputGroup >
                  <Input value={consigneeLocation} readOnly style={{ width: '50%' }} />
                  <Input
                    prefix={<Icon type="environment-o" />}
                    value={node.consignee_addr}
                    onChange={e => this.handleChange('consignee_addr', e.target.value)}
                    placeholder="详细地址"
                    style={{ width: '50%' }}
                    disabled={disabled}
                  />
                </InputGroup>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <InputGroup >
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="user" />}
                    value={node.consignee_contact}
                    onChange={e => this.handleChange('consignee_contact', e.target.value)}
                    placeholder="联系人"
                    disabled={disabled}
                  />
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="mobile" />}
                    value={node.consignee_mobile}
                    type="tel"
                    onChange={e => this.handleChange('consignee_mobile', e.target.value)}
                    placeholder="电话"
                    disabled={disabled}
                  />
                  <Input
                    style={{ width: '33.33%' }}
                    prefix={<Icon type="mail" />}
                    value={node.consignee_email}
                    type="email"
                    onChange={e => this.handleChange('consignee_email', e.target.value)}
                    placeholder="邮箱"
                    disabled={disabled}
                  />
                </InputGroup>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="运输模式" {...formItemLayout} required>
              <Select
                disabled={disabled}
                value={node.trs_mode_id}
                onChange={this.handleTransmodeChange}
              >
                {transitModes.map(tm => <Option value={tm.id} key={`${tm.mode_code}${tm.id}`}>{tm.mode_name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('quoteNo')} validateStatus={quoteNoField.validateStatus} help={quoteNoField.help} {...formItemLayout}>
              <Select disabled={disabled} allowClear value={node.quote_no} onChange={value => this.handleChange('quote_no', value)}>
                {
                  this.state.tariffs && this.state.tariffs.map(t =>
                    <Option value={t.quoteNo} key={t._id}>{this.renderTmsTariff(t)}</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('调度人员')} {...formItemLayout}>
              <Select disabled={disabled} value={node.person_id} onChange={this.handlePersonChange}>
                {serviceTeam.map(st => <Option value={st.lid} key={st.lid}><UserAvatar size="small" loginId={st.lid} showName /></Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('pickupEstDate')} {...formItemLayout}>
              <DatePicker
                style={{ width: '100%' }}
                value={node.pickup_est_date && moment(new Date(node.pickup_est_date), 'YYYY-MM-DD')}
                onChange={this.handlePickupChange}
                disabled={disabled}
              />
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label={this.msg('shipmtTransit')} {...formItemLayout}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                value={node.transit_time}
                onChange={this.handleTransitChange}
                disabled={disabled}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('deliveryEstDate')} {...formItemLayout}>
              <DatePicker
                style={{ width: '100%' }}
                value={node.deliver_est_date && moment(new Date(node.deliver_est_date), 'YYYY-MM-DD')}
                onChange={this.handleDeliveryChange}
                disabled={disabled}
              />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="备注" {...fullColLayout}>
              <Input disabled={disabled} value={node.remark} onChange={e => this.handleCommonFieldChange('remark', e.target.value)} />
            </FormItem>
          </Col>
        </Row>
        <AddLineModal />
        <AddLocationModal onOk={this.handleAddedLocation} />
      </FormPane>
    );
  }
}
