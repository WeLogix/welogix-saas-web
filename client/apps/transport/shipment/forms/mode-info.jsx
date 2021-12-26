import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { Row, Col, Form, Select, InputNumber, DatePicker } from 'antd';
import { format } from 'client/common/i18n/helpers';
import { setConsignFields } from 'common/reducers/shipment';
import { PRESET_TRANSMODES, COURIERS } from 'common/constants';
import InputItem from './input-item';
import messages from '../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const { Option } = Select;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

@connect(
  state => ({
    transitModes: state.shipment.formRequire.transitModes,
    vehicleTypes: state.shipment.formRequire.vehicleTypes,
    vehicleLengths: state.shipment.formRequire.vehicleLengths,
    containerPackagings: state.shipment.formRequire.containerPackagings,
    fieldDefaults: {
      transit_time: state.shipment.formData.transit_time,
      pickup_est_date: state.shipment.formData.pickup_est_date,
      deliver_est_date: state.shipment.formData.deliver_est_date,
      vehicle_type_id: state.shipment.formData.vehicle_type_id,
      vehicle_length_id: state.shipment.formData.vehicle_length_id,
      container: state.shipment.formData.container,
      container_no: state.shipment.formData.container_no,
      courier_no: state.shipment.formData.courier_no,
      courier_code: state.shipment.formData.courier_code,
      transport_mode_id: state.shipment.formData.transport_mode_id,
      transport_mode_code: state.shipment.formData.transport_mode_code,
      package: state.shipment.formData.package,
    },
  }),
  { setConsignFields }
)
export default class ModeInfo extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    transitModes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      mode_code: PropTypes.string,
      mode_name: PropTypes.string,
    })).isRequired,
    vehicleTypes: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number,
      text: PropTypes.string,
    })).isRequired,
    vehicleLengths: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number,
      text: PropTypes.string,
    })).isRequired,
    fieldDefaults: PropTypes.shape({
      container: PropTypes.string,
      container_no: PropTypes.string,
      courier_code: PropTypes.string,
      courier_no: PropTypes.string,
      deliver_est_date: PropTypes.string,
      package: PropTypes.string,
      pickup_est_date: PropTypes.string,
      transit_time: PropTypes.number,
      transport_mode_code: PropTypes.string,
      transport_mode_id: PropTypes.number,
      vehicle_length_id: PropTypes.number,
      vehicle_type_id: PropTypes.number,
    }).isRequired,
    formhoc: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    setConsignFields: PropTypes.func.isRequired,
    vertical: PropTypes.bool,
    containerPackagings: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    type: PropTypes.string,
    formItemLayout: PropTypes.shape({
      labelCol: PropTypes.shape({
        span: PropTypes.number,
      }),
      wrapperCol: PropTypes.shape({
        span: PropTypes.number,
      }),
    }),
  }
  msg = (key, values) => formatMsg(this.props.intl, key, values)
  handlePickupChange = (pickupDt) => {
    if (pickupDt) {
      const transitTime = this.props.formhoc.getFieldValue('transit_time') || 0;
      const deliverDate = new Date(pickupDt.valueOf() + (transitTime * ONE_DAY_MS));
      this.props.formhoc.setFieldsValue({
        deliver_est_date: moment(deliverDate),
      });
    }
  }
  handleTransitChange = (value) => {
    const pickupDt = this.props.formhoc.getFieldValue('pickup_est_date');
    if (pickupDt && typeof value === 'number') {
      const deliverDate = new Date(pickupDt.valueOf() + (value * ONE_DAY_MS));
      this.props.formhoc.setFieldsValue({
        deliver_est_date: moment(deliverDate),
      });
    }
  }
  handleDeliveryChange = (deliverDt) => {
    if (deliverDt) {
      const transitTime = this.props.formhoc.getFieldValue('transit_time') || 0;
      const pickupDt = new Date(deliverDt.valueOf() - (transitTime * ONE_DAY_MS));
      this.props.formhoc.setFieldsValue({
        pickup_est_date: moment(pickupDt, 'YYYY-MM-DD'),
      });
    }
  }
  handleModeChange = (id) => {
    const modes = this.props.transitModes.filter(tm => tm.id === id);
    if (modes.length !== 1) {
      return;
    }
    this.props.setConsignFields({
      transport_mode_id: id,
      transport_mode_code: modes[0].mode_code,
      transport_mode: modes[0].mode_name,
    });
  }
  handleCourierChange = (value) => {
    const courier = COURIERS.find(item => item.code === value);
    this.props.setConsignFields({
      courier: courier.name,
    });
  }
  render() {
    const {
      transitModes, vehicleTypes, vehicleLengths, containerPackagings,
      formhoc: { getFieldDecorator },
      fieldDefaults: {
        pickup_est_date: pickupDt, transit_time: transitTime,
        deliver_est_date: deliverDt, vehicle_type_id: vehicleTypeId,
        vehicle_length_id: vehicleLengthId, container, container_no: containerNo,
        transport_mode_code: modeCode, transport_mode_id: modeId, courier_no: courierNo,
        courier_code: courierCode,
      },
      vertical,
      type,
      formItemLayout,
    } = this.props;
    const modeEditCols = [];
    if (modeCode === PRESET_TRANSMODES.ftl) {
      // 整车,修改车型,车长
      modeEditCols.push(
        <Col key="vehicle_type" sm={24} md={8}>
          <FormItem label={this.msg('vehicleType')} required {...formItemLayout}>
            {getFieldDecorator('vehicle_type_id', {
 initialValue: vehicleTypeId,
              rules: [{
                required: true, message: this.msg('vehicleTypeMust'), type: 'number',
              }],
})(<Select
  style={{ width: '100%' }}
>
  {vehicleTypes.map(vt => <Option value={vt.value} key={`${vt.text}${vt.value}`}>{vt.text}</Option>)}
</Select>)}
          </FormItem>
        </Col>,
        <Col key="vehicle_length" sm={24} md={8}>
          <FormItem label={this.msg('vehicleLength')} required {...formItemLayout}>
            {getFieldDecorator('vehicle_length_id', {
 initialValue: vehicleLengthId,
              rules: [{
                required: true, message: this.msg('vehicleLengthMust'), type: 'number',
              }],
})(<Select
  style={{ width: '100%' }}
>
  {vehicleLengths.map(vl => <Option value={vl.value} key={`${vl.text}${vl.value}`}>{vl.text}</Option>)}
</Select>)}
          </FormItem>
        </Col>
      );
    } else if (modeCode === PRESET_TRANSMODES.ctn) {
      // 集装箱,修改箱号
      modeEditCols.push(
        <Col key="container" sm={24} md={8} >
          <FormItem label={this.msg('container')} required {...formItemLayout}>
            {getFieldDecorator('container', {
 initialValue: container,
              rules: [{
                required: true, message: this.msg('containerMust'), type: 'string',
              }],
})(<Select
  style={{ width: '100%' }}
>
  {containerPackagings.map(ct => <Option value={ct.key} key={ct.key}>{ct.value}</Option>)}
</Select>)}
          </FormItem>
        </Col>,
        <Col key="container_no" sm={24} md={8}>
          <InputItem
            labelName={this.msg('containerNo')}
            field="container_no"
            formItemLayout={formItemLayout}
            formhoc={this.props.formhoc}
            fieldProps={{ initialValue: containerNo }}
          />
        </Col>
      );
    } else if (modeCode === PRESET_TRANSMODES.exp) {
      // 快递公司
      modeEditCols.push(
        <Col key="courier_code" sm={24} md={8} >
          <FormItem label={this.msg('courierCompany')} {...formItemLayout}>
            {getFieldDecorator('courier_code', { initialValue: courierCode })(<Select
              style={{ width: '100%' }}
              onChange={this.handleCourierChange}
            >
              {COURIERS.map(c => <Option value={c.code} key={c.code}>{c.name}</Option>)}
            </Select>)}
          </FormItem>
        </Col>,
        <Col key="courier_no" sm={24} md={8}>
          <InputItem
            labelName={this.msg('courierNo')}
            field="courier_no"
            formItemLayout={formItemLayout}
            formhoc={this.props.formhoc}
            fieldProps={{ initialValue: courierNo }}
          />
        </Col>
      );
    }
    let content = '';
    if (vertical && type === 'transMode') {
      content = (<div>{ modeEditCols }</div>);
    } else if (vertical && type === 'schedule') {
      content = (
        <div>
          <FormItem label={this.msg('pickupEstDate')} required {...formItemLayout}>
            {getFieldDecorator('pickup_est_date', {
                  onChange: this.handlePickupChange,
                  rules: [{
                    required: true, message: this.msg('deliveryDateMust'), type: 'object',
                  }],
                  initialValue: pickupDt && moment(new Date(pickupDt), 'YYYY-MM-DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label={this.msg('shipmtTransit')} required {...formItemLayout}>
            {getFieldDecorator('transit_time', {
                  onChange: this.handleTransitChange,
                  rules: [{
                    required: true, message: this.msg('tranistTimeMust'), type: 'number',
                  }],
                  initialValue: transitTime,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
          </FormItem>
          <FormItem label={this.msg('deliveryEstDate')} required {...formItemLayout}>
            {getFieldDecorator('deliver_est_date', {
                  onChange: this.handleDeliveryChange,
                  rules: [{
                    required: true, message: this.msg('deliveryDateMust'), type: 'object',
                  }],
                  initialValue: deliverDt && moment(new Date(deliverDt), 'YYYY-MM-DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
          </FormItem>
        </div>
      );
    } else {
      content = (
        <div>
          <Row gutter={16}>
            <Col sm={24} md={8}>
              <FormItem label={this.msg('pickupEstDate')} required {...formItemLayout}>
                {getFieldDecorator('pickup_est_date', {
                  onChange: this.handlePickupChange,
                  rules: [{
                    required: true, message: this.msg('deliveryDateMust'), type: 'object',
                  }],
                  initialValue: pickupDt && moment(new Date(pickupDt), 'YYYY-MM-DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label={this.msg('shipmtTransit')} required {...formItemLayout}>
                {getFieldDecorator('transit_time', {
                  onChange: this.handleTransitChange,
                  rules: [{
                    required: true, message: this.msg('tranistTimeMust'), type: 'number',
                  }],
                  initialValue: transitTime,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label={this.msg('deliveryEstDate')} required {...formItemLayout}>
                {getFieldDecorator('deliver_est_date', {
                  onChange: this.handleDeliveryChange,
                  rules: [{
                    required: true, message: this.msg('deliveryDateMust'), type: 'object',
                  }],
                  initialValue: deliverDt && moment(new Date(deliverDt), 'YYYY-MM-DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label={this.msg('transitModeInfo')} required {...formItemLayout}>
                {getFieldDecorator('transport_mode_id', {
                  rules: [{
                    type: 'number',
                    required: true,
                    message: this.msg('transitModeMust'),
                  }],
                  initialValue: modeId,
                  onChange: this.handleModeChange,
                })(<Select
                  style={{ width: '100%' }}
                >
                  {transitModes.map(tm => <Option value={tm.id} key={`${tm.mode_code}${tm.id}`}>{tm.mode_name}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            {modeEditCols}
          </Row>
        </div>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}
