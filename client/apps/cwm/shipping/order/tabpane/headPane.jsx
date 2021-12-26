import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Divider, Form, Input, Select, DatePicker, Col, Radio, Row } from 'antd';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { CWM_SO_TYPES, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import { getSuppliers } from 'common/reducers/cwmReceive';
import { setSoDetails } from 'common/reducers/cwmShippingOrder';
import FormPane from 'client/components/FormPane';
import { formatMsg } from '../../message.i18n';

const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};

@injectIntl
@connect(
  state => ({
    owners: state.cwmContext.whseAttrs.owners,
    defaultWhse: state.cwmContext.defaultWhse,
    soHead: state.cwmShippingOrder.soHead,
  }),
  { getSuppliers, setSoDetails }
)
export default class SOHeadPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldValue: PropTypes.func.isRequired }).isRequired,
    handleOwnerChange: PropTypes.func,
  }
  state = {
    bonded: 0,
  }
  componentDidMount() {
    this.setState({
      bonded: this.props.soHead.bonded || 0,
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seq'),
    width: 50,
  }, {
    title: this.msg('opCol'),
    width: 80,
  }, {
    title: this.msg('sku'),
    dataIndex: 'sku',
    width: 300,
  }, {
    title: this.msg('unit'),
    width: 60,
    dataIndex: 'unit',
  }, {
    title: this.msg('qty'),
    width: 50,
    dataIndex: 'qty',
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
  }]
  handleBondedChange = (e) => {
    this.setState({
      bonded: e.target.value,
    });
  }
  handleSelect = (value) => {
    this.props.getSuppliers(this.props.defaultWhse.code, value);
  }
  handleSoTypeChange = (value) => {
    const soType = this.props.form.getFieldValue('so_type');
    if ((soType !== '3' && value === '3') || (soType === '3' && value !== '3')) {
      this.props.setSoDetails([]);
    }
    if (value === '4') {
      this.props.form.setFieldsValue({
        bonded: 1,
        reg_type: CWM_SHFTZ_OUT_REGTYPES[0].value,
      });
      this.setState({ bonded: 1 });
    }
  }
  render() {
    const {
      form: { getFieldDecorator }, owners, soHead, defaultWhse,
    } = this.props;
    const { bonded } = this.state;
    return (
      <FormPane descendant>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('ownerPartner')} {...formItemLayout}>
                {getFieldDecorator('owner_partner_id', {
                  rules: [{ required: true, message: '请选择货主' }],
                  initialValue: soHead && soHead.owner_partner_id,
                })(<Select placeholder="选择货主" onSelect={this.handleSelect}>
                  {owners.map(owner => (<Option value={owner.id} key={owner.id}>
                    {owner.name}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('expectShippingDate')} {...formItemLayout}>
                {getFieldDecorator('expect_shipping_date', {
                  rules: [{ type: 'object', required: true, message: '选择出货日期!' }],
                  initialValue: soHead.expect_shipping_date ?
                  moment(new Date(soHead.expect_shipping_date))
                  : moment(new Date()),
                })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('shippingCustOrderNo')} {...formItemLayout}>
                {getFieldDecorator('cust_order_no', {
                  initialValue: soHead && soHead.cust_order_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('soType')} {...formItemLayout}>
                {getFieldDecorator('so_type', {
                  initialValue: soHead ? soHead.so_type : CWM_SO_TYPES[0].value,
                })(<Select placeholder="SO类型" onChange={this.handleSoTypeChange}>
                  {CWM_SO_TYPES.map(cat => (<Option value={cat.value} key={cat.value}>
                    {cat.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Divider dashed />
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('bonded')} {...formItemLayout}>
                {getFieldDecorator('bonded', {
                  initialValue: soHead ? soHead.bonded : bonded,
                })(<RadioGroup onChange={this.handleBondedChange}>
                  { !!defaultWhse.bonded && <RadioButton value={-1}>不限</RadioButton>}
                  <RadioButton value={0}>非保税</RadioButton>
                  { !!defaultWhse.bonded && <RadioButton value={1}>保税</RadioButton> }
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('regType')} {...formItemLayout}>
                {getFieldDecorator('reg_type', {
                  initialValue: soHead && soHead.bonded_outtype,
                  rules: [{ required: bonded > 0, message: '请选择监管方式' }],
                })(<Select disabled={bonded !== 1}>
                  {defaultWhse.ftz_type === 'SHFTZ' && CWM_SHFTZ_OUT_REGTYPES.map(cabr =>
                    (<Option value={cabr.value} key={cabr.value}>{cabr.ftztext || cabr.text}
                    </Option>))}
                  {defaultWhse.ftz_type === 'SASBL' && SASBL_REG_TYPES.map(cabr =>
                      (<Option value={cabr.value} key={cabr.value}>
                        {cabr.ftztext}
                      </Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
