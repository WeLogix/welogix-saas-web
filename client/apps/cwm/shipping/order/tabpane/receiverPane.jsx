/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Col, Row, Select, Input, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import Cascader from 'client/components/RegionCascader';
import { loadReceivers } from 'common/reducers/cwmWarehouse';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    receivers: state.cwmWarehouse.receivers,
    soHead: state.cwmShippingOrder.soHead,
  }),
  { loadReceivers }
)
export default class ReceiverPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    selectedOwner: PropTypes.number.isRequired,
    onRegionChange: PropTypes.func.isRequired,
  }
  componentWillMount() {
    this.props.loadReceivers(this.props.defaultWhse.code, this.props.defaultWhse.wh_ent_tenant_id);
  }
  msg = formatMsg(this.props.intl)
  handleRegionChange = (value) => {
    const [code, province, city, district, street] = value;
    const region = Object.assign({}, {
      region_code: code, province, city, district, street,
    });
    this.props.onRegionChange({
      receiver_province: region.province,
      receiver_city: region.city,
      receiver_district: region.district,
      receiver_street: region.street,
      receiver_region_code: region.region_code,
    });
  }
  handleSelect = (value) => {
    const receiver = this.props.receivers.find(item => item.name === value);
    if (receiver) {
      this.props.form.setFieldsValue({
        receiver_code: receiver.code,
        receiver_name: receiver.name,
        receiver_contact: receiver.contact,
        receiver_address: receiver.address,
        receiver_post_code: receiver.post_code,
        receiver_phone: receiver.phone,
        receiver_number: receiver.number,
      });
      this.props.onRegionChange({
        receiver_province: receiver.province,
        receiver_city: receiver.city,
        receiver_district: receiver.district,
        receiver_street: receiver.street,
        receiver_region_code: receiver.region_code,
      });
    }
  }
  render() {
    const {
      form: { getFieldDecorator }, soHead, receivers, selectedOwner, region,
    } = this.props;
    const rcvs = receivers.filter(item => item.owner_partner_id === selectedOwner);
    const regionValues = [region.receiver_province,
      region.receiver_city, region.receiver_district, region.receiver_street];
    return (
      <div style={{ padding: 24 }}>
        <Row>
          <Col span={6}>
            <FormItem label={this.msg('receiverName')}>
              <InputGroup compact>
                {getFieldDecorator('receiver_name', {
                  rules: [{ message: 'Please select customer!' }],
                  initialValue: soHead && soHead.receiver_name,
                })(<Select mode="combobox" placeholder="选择收货人" onSelect={this.handleSelect} style={{ width: '50%' }}>
                  {rcvs.map(item => (<Option value={item.name}>{item.name}</Option>))}
                </Select>)}
                {getFieldDecorator('receiver_code', {
                  initialValue: soHead && soHead.receiver_code,
                })(<Input style={{ width: '50%' }} placeholder={this.msg('receiverCode')} />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col span={6} offset={2}>
            <FormItem label={this.msg('receiverContact')}>
              {getFieldDecorator('receiver_contact', {
                initialValue: soHead && soHead.receiver_contact,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={6} offset={2}>
            <FormItem label={this.msg('contactWay')}>
              <InputGroup compact>
                {getFieldDecorator('receiver_phone', {
                  initialValue: soHead && soHead.receiver_phone,
                })(<Input style={{ width: '50%' }} prefix={<Icon type="phone" />} placeholder={this.msg('phone')} />)}
                {getFieldDecorator('receiver_number', {
                  initialValue: soHead && soHead.receiver_number,
                })(<Input style={{ width: '50%' }} prefix={<Icon type="mobile" />} placeholder={this.msg('number')} />)}
              </InputGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormItem label={this.msg('region')}>
              <Cascader defaultRegion={regionValues} onChange={this.handleRegionChange} />
            </FormItem>
          </Col>
          <Col span={6} offset={2}>
            <FormItem label={this.msg('address')}>
              {getFieldDecorator('receiver_address', {
                initialValue: soHead && soHead.receiver_address,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={6} offset={2}>
            <FormItem label={this.msg('postCode')}>
              {getFieldDecorator('receiver_post_code', {
                initialValue: soHead && soHead.receiver_post_code,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
