import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Row, Col, Button, DatePicker, Select } from 'antd';
import moment from 'moment';
import RegionCascader from 'client/components/RegionCascader';

import connectFetch from 'client/common/decorators/connect-fetch';
import { loadFormRequire } from 'common/reducers/shipment';
import { GOODSTYPES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

function fetchData({ state, dispatch, cookie }) {
  return dispatch(loadFormRequire(cookie, state.account.tenantId));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    transitModes: state.shipment.formRequire.transitModes,
  }),
  { }
)
@Form.create()
export default class AdvancedSearchBar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onSearch: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      consignerRegion: [],
      consigneeRegion: [],
    };
  }
  componentDidMount() {
    this.initializeFieldsValue();
  }
  msg = formatMsg(this.props.intl)
  initializeFieldsValue = () => {
    if (window.localStorage) {
      const fieldsValue = JSON.parse(window.localStorage.tmsAdvancedSearchFieldsValue || '{"viewStatus":"all"}');
      this.handleSearch(fieldsValue.consigner_region, fieldsValue.consignee_region, fieldsValue);
      delete fieldsValue.consigner_region;
      delete fieldsValue.consignee_region;
      if (fieldsValue.pickup_est_date && fieldsValue.pickup_est_date.length > 0) {
        fieldsValue.pickup_est_date =
        [moment(fieldsValue.pickup_est_date[0]), moment(fieldsValue.pickup_est_date[1])];
      } else {
        delete fieldsValue.pickup_est_date;
      }
      if (fieldsValue.pickup_act_date && fieldsValue.pickup_act_date.length > 0) {
        fieldsValue.pickup_act_date =
        [moment(fieldsValue.pickup_act_date[0]), moment(fieldsValue.pickup_act_date[1])];
      } else {
        delete fieldsValue.pickup_act_date;
      }
      if (fieldsValue.deliver_est_date && fieldsValue.deliver_est_date.length > 0) {
        fieldsValue.deliver_est_date =
        [moment(fieldsValue.deliver_est_date[0]), moment(fieldsValue.deliver_est_date[1])];
      } else {
        delete fieldsValue.deliver_est_date;
      }
      if (fieldsValue.deliver_act_date && fieldsValue.deliver_act_date.length > 0) {
        fieldsValue.deliver_act_date =
        [moment(fieldsValue.deliver_act_date[0]), moment(fieldsValue.deliver_act_date[1])];
      } else {
        delete fieldsValue.deliver_act_date;
      }
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  saveFieldsValue = (fieldsValue) => {
    if (window.localStorage) {
      window.localStorage.tmsAdvancedSearchFieldsValue =
      JSON.stringify({ ...JSON.parse(window.localStorage.tmsAdvancedSearchFieldsValue || '{"viewStatus":"all"}'), ...fieldsValue });
    }
  }
  handleResetFields = () => {
    this.setState({ consignerRegion: [], consigneeRegion: [] });
    this.props.form.resetFields();
    const fieldsValue = this.props.form.getFieldsValue();
    fieldsValue.consigner_region = [];
    fieldsValue.consignee_region = [];
    this.handleShowFieldsLabel(fieldsValue);
  }
  handleCloseTag = (names) => {
    if (names[0] === 'consigner_region') {
      this.handleSearch([], this.state.consigneeRegion);
    } else if (names[0] === 'consignee_region') {
      this.handleSearch(this.state.consignerRegion, []);
    } else {
      this.props.form.resetFields(names);
      this.handleSearch(this.state.consignerRegion, this.state.consigneeRegion);
    }
  }
  handleSearch = (consignerRegion, consigneeRegion, fv) => {
    const fieldsValue = fv || this.props.form.getFieldsValue();
    fieldsValue.consigner_region = consignerRegion;
    fieldsValue.consignee_region = consigneeRegion;
    this.saveFieldsValue(fieldsValue);
    const result = {};
    Object.keys(fieldsValue).forEach((key) => {
      if (typeof fieldsValue[key] === 'object') {
        result[key] = JSON.stringify(fieldsValue[key]);
      } else {
        result[key] = fieldsValue[key];
      }
    });
    this.props.onSearch(result);
    this.setState({ consignerRegion, consigneeRegion });
    this.handleShowFieldsLabel(fieldsValue);
  }
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    this.handleSearch(this.state.consignerRegion, this.state.consigneeRegion);
  }

  handleShowFieldsLabel = (fieldsValue) => {
    const fields = [];
    Object.keys(fieldsValue).forEach((key) => {
      if (fieldsValue[key] && fieldsValue[key] !== '' && fieldsValue[key] !== false && fieldsValue[key] !== null && fieldsValue[key].length !== 0 && key !== 'viewStatus') {
        fields.push({
          key,
          value: fieldsValue[key],
          label: this.msg(key),
        });
      }
    });
  }
  handleConsignerRegionValue = (region) => {
    region.shift();
    this.setState({ consignerRegion: region });
  }
  handleConsigneeRegionValue = (region) => {
    region.shift();
    this.setState({ consigneeRegion: region });
  }
  format = (item) => {
    if (item.key === 'transport_mode') {
      return `${item.label}: ${item.value}`;
    } else if (item.key === 'pickup_est_date' ||
      item.key === 'pickup_act_date' ||
      item.key === 'deliver_est_date' ||
      item.key === 'deliver_act_date') {
      const { value } = item;
      const startDate = `${moment(value[0]).format('YYYY-MM-DD')} 00:00:00`;
      const endDate = `${moment(value[1]).format('YYYY-MM-DD')} 23:59:59`;
      return `${item.label}: ${startDate}~${endDate}`;
    } else if (item.key === 'consigner_region' ||
      item.key === 'consignee_region') {
      const value = [...item.value];
      return `${item.label}: ${value.join('-')}`;
    }
    return item.label;
  }
  render() {
    const { transitModes, form: { getFieldDecorator } } = this.props;
    return (
      <Form className="form-layout-compact" onSubmit={this.handleSubmit}>
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem
              label="出发地"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              <RegionCascader
                defaultRegion={this.state.consignerRegion}
                onChange={this.handleConsignerRegionValue}
              />
            </FormItem>
            <FormItem
              label="到达地"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              <RegionCascader
                defaultRegion={this.state.consigneeRegion}
                onChange={this.handleConsigneeRegionValue}
              />
            </FormItem>
            {/* <FormItem
              label="加急状态"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('expedited_type', {
                initialValue: '',
                })(<Select style={{ width: '100%' }}>
                  {EXPEDITED_TYPES.map(type =>
                    <Option key={type.value} value={type.value}>{type.text}</Option>)}
                </Select>)}
            </FormItem> */}
          </Col>
          <Col sm={8}>
            <FormItem
              label="预计提货时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('pickup_est_date', { initialValue: '' })(<RangePicker style={{ width: '100%' }} />)
                }

            </FormItem>
            <FormItem
              label="预计送达时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('deliver_est_date', { initialValue: '' })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
              label="实际提货时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('pickup_act_date', { initialValue: '' })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem
              label="实际送货时间"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('deliver_act_date', { initialValue: '' })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
              label="货物类型"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('goods_type', {
                initialValue: '',
                })(<Select style={{ width: '100%' }} >
                  {GOODSTYPES.map(type =>
                    <Option key={type.value} value={type.value}>{type.text}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
              label="运输模式"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
            >
              {getFieldDecorator('transport_mode', { initialValue: '' })(<Select style={{ width: '100%' }} >
                {transitModes.map(tm =>
                  <Option value={tm.mode_name} key={tm.mode_code}>{tm.mode_name}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>搜索</Button>
            <Button onClick={() => this.handleResetFields()} style={{ marginLeft: 8 }}>清除条件</Button>
            <a onClick={this.props.toggle}>收起</a>
          </Col>
        </Row>
      </Form>

    );
  }
}
