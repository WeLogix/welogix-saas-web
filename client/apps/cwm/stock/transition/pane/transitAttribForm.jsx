import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Form, Row, Input, InputNumber, Col, DatePicker, Select, Switch } from 'antd';
import LocationSelect from 'client/apps/cwm/common/locationSelect';
import { loadOwnerUndoneMovements } from 'common/reducers/cwmMovement';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    ownerMovements: state.cwmMovement.ownerMovements,
    suppliers: state.cwmContext.whseAttrs.suppliers,
  }),
  { loadOwnerUndoneMovements }
)
export default class TransitAttribForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    batched: PropTypes.bool.isRequired,
  }
  state = {
    target_location: null,
    // movement_no: null,
  }
  componentDidMount() {
    if (this.props.detail && this.props.detail.owner_partner_id) {
      this.props.loadOwnerUndoneMovements(
        this.props.detail.owner_partner_id,
        this.props.detail.whse_code,
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    const { detail } = this.props;
    if (nextProps.detail && nextProps.detail !== detail && nextProps.detail.owner_partner_id) {
      this.props.loadOwnerUndoneMovements(
        nextProps.detail.owner_partner_id,
        nextProps.detail.whse_code,
      );
      this.setState({
        target_location: null,
        // movement_no: null,
      });
    }
  }
  handleLocationSelect = (value) => { this.setState({ target_location: value }); this.props.onChange({ key: 'target_location', value }); }
  handleMovementNoChange = (value) => {
    // this.setState({ movement_no: value });
    this.props.onChange({ key: 'movement_no', value });
  }
  render() {
    const {
      batched, detail, form: { getFieldDecorator }, ownerMovements,
    } = this.props;
    const suppliers = this.props.suppliers.filter(sup =>
      sup.owner_partner_id === detail.owner_partner_id);
    return (
      <div>
        <Row gutter={16} className="form-row">
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              <Input value={detail.owner_name} disabled />
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="SKU">
              <span>{detail.product_sku}</span>
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              <span>{detail.product_no}</span>
            </FormItem>
          </Col>
        </Row>
        {!batched &&
        <Row gutter={16} className="form-row">
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="??????">
              <Input value={detail.location} disabled />
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              <Switch disabled checkedChildren="??????" unCheckedChildren="?????????" checked={!!detail.bonded} />
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              <Switch disabled checked={!!detail.portion} />
            </FormItem>
          </Col>
        </Row>}
        <Row gutter={16} className="form-row">
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('transaction_no')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="??????">
              {getFieldDecorator('name', {
                initialValue: detail.name,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="?????????">
              {getFieldDecorator('external_lot_no', {
                initialValue: detail.external_lot_no,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="?????????">
              {getFieldDecorator('serial_no', {
                initialValue: detail.serial_no,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="??????">
              {getFieldDecorator('virtual_whse', {
                initialValue: detail.virtual_whse,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('damage_level', {
                initialValue: detail.damage_level,
              })(<Select style={{ width: '100%' }}>
                <Option value={0}>??????</Option>
                <Option value={1}>????????????</Option>
                <Option value={2}>??????</Option>
                <Option value={3}>??????</Option>
                <Option value={4}>????????????</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('expiry_date', {
                initialValue: detail.expiry_date && moment(detail.expiry_date),
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="?????????">
              {getFieldDecorator('supplier', {
                initialValue: detail.supplier,
              })(<Select style={{ width: '100%' }} allowClear showSearch optionFilterProp="children">
                {suppliers.map(sup =>
                  <Option value={sup.name} key={sup.name}>{sup.name}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16} className="form-row">
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????1">
              {getFieldDecorator('attrib_1_string', {
                initialValue: detail.attrib_1_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????2">
              {getFieldDecorator('attrib_2_string', {
                initialValue: detail.attrib_2_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????3">
              {getFieldDecorator('attrib_3_string', {
                initialValue: detail.attrib_3_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????4">
              {getFieldDecorator('attrib_4_string', {
                initialValue: detail.attrib_4_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????5">
              {getFieldDecorator('attrib_5_string', {
                initialValue: detail.attrib_5_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????6">
              {getFieldDecorator('attrib_6_string', {
                initialValue: detail.attrib_6_string,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????7">
              {getFieldDecorator('attrib_7_date', {
                initialValue: detail.attrib_7_date && moment(detail.attrib_7_date),
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????8">
              {getFieldDecorator('attrib_8_date', {
                initialValue: detail.attrib_8_date && moment(detail.attrib_8_date),
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          {!batched && <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('split', {
                initialValue: undefined,
              })(<InputNumber min={1} max={detail.avail_qty - 1} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>}
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('reason', {
                initialValue: '',
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="????????????">
              <LocationSelect
                onChange={this.handleLocationSelect}
                onSelect={this.handleLocationSelect}
                value={this.state.target_location}
              />
            </FormItem>
          </Col>
          {this.state.target_location && <Col lg={{ span: 12 }} xl={{ span: 8 }}>
            <FormItem {...formItemLayout} label="???????????????">
              <Select
                allowClear
                showSearch
                onSelect={this.handleMovementNoChange}
              >
                {ownerMovements.map(oum =>
                  <Option key={oum.movement_no} value={oum.movement_no}>{oum.movement_no}</Option>)}
              </Select>
            </FormItem>
          </Col>}
        </Row>
      </div>
    );
  }
}
