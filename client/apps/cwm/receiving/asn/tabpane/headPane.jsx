import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Divider, Input, Select, DatePicker, Card, Col, Radio, Row } from 'antd';
import { CWM_ASN_TYPES, CWM_SHFTZ_IN_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import moment from 'moment';
import { getSuppliers } from 'common/reducers/cwmReceive';
import { toggleSupplierModal } from 'common/reducers/cwmWarehouse';
import FormPane from 'client/components/FormPane';
import WhseSuppliersModal from '../../../warehouse/modal/whseSuppliersModal';
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
    suppliers: state.cwmReceive.suppliers,
    asnHead: state.cwmReceive.asnHead,
  }),
  { getSuppliers, toggleSupplierModal }
)
export default class ASNHeadPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    handleOwnerChange: PropTypes.func,
  }
  componentDidMount() {
    const { asnHead } = this.props;
    if (this.props.defaultWhse.code && asnHead && asnHead.owner_partner_id > 0) {
      this.props.getSuppliers(this.props.defaultWhse.code, this.props.asnHead.owner_partner_id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.asnHead !== this.props.asnHead) {
      const { asnHead } = nextProps;
      if (asnHead) {
        this.props.getSuppliers(this.props.defaultWhse.code, asnHead.owner_partner_id);
      }
    }
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
  handleBondedChange = (ev) => {
    if (ev.target.value === 0) {
      this.props.form.setFieldsValue({ reg_type: null });
    }
  }
  handleSelect = (value) => {
    this.props.getSuppliers(this.props.defaultWhse.code, value);
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, owners, asnHead, defaultWhse,
    } = this.props;
    return (
      <FormPane descendant>
        <Card>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('ownerPartner')} {...formItemLayout}>
                {getFieldDecorator('owner_partner_id', {
                  rules: [{ required: true, message: '请选择货主' }],
                  initialValue: asnHead && asnHead.owner_partner_id,
                })(<Select placeholder="选择货主" onSelect={this.handleSelect}>
                  {owners.map(owner => (<Option value={owner.id} key={owner.id}>
                    {owner.name}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('vendor')} {...formItemLayout}>
                {getFieldDecorator('supplier_name', {
                  initialValue: asnHead && asnHead.supplier_name,
                })(<Select
                  allowClear
                  showSearch
                  showArrow
                  optionFilterProp="search"
                  disabled={this.props.form.getFieldValue('owner_partner_id') === null || this.props.form.getFieldValue('owner_partner_id') === undefined}
                  notFoundContent={<a onClick={() => this.props.toggleSupplierModal(true)}>
                      + 添加供货商</a>}
                >
                  {this.props.suppliers.map(supplier => <Option search={`${supplier.name}${supplier.code}`} value={supplier.name} key={supplier.name}>{supplier.name}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('custOrderNo')} {...formItemLayout}>
                {getFieldDecorator('cust_order_no', {
                  initialValue: asnHead && asnHead.cust_order_no,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('asnType')} {...formItemLayout}>
                {getFieldDecorator('asn_type', {
                  initialValue: asnHead ? asnHead.asn_type : CWM_ASN_TYPES[0].value,
                })(<Select placeholder={this.msg('asnType')}>
                  {CWM_ASN_TYPES.map(cat => (<Option value={cat.value} key={cat.value}>
                    {cat.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('expectReceiveDate')} {...formItemLayout}>
                {getFieldDecorator('expect_receive_date', {
                  rules: [{ type: 'object', required: true, message: '收货日期必填' }],
                  initialValue: (asnHead && asnHead.expect_receive_date) ?
                  moment(new Date(asnHead.expect_receive_date)) : moment(new Date()),
                })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Divider dashed />
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('bonded')} {...formItemLayout}>
                {getFieldDecorator('bonded', {
                  initialValue: asnHead ? asnHead.bonded : 0,
                })(<RadioGroup onChange={this.handleBondedChange}>
                  <RadioButton value={0}>非保税</RadioButton>
                  <RadioButton value={1} disabled={!defaultWhse.bonded}>保税</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('regType')} {...formItemLayout}>
                {getFieldDecorator('reg_type', {
                    rules: [{ required: getFieldValue('bonded') === 1, message: 'Please select reg_type!' }],
                    initialValue: asnHead && asnHead.bonded_intype,
                  })(<Select disabled={getFieldValue('bonded') !== 1}>
                    {defaultWhse.ftz_type === 'SHFTZ' && CWM_SHFTZ_IN_REGTYPES.map(cabr =>
                      (<Option value={cabr.value} key={cabr.value}>
                        {cabr.ftztext}
                      </Option>))}
                    {defaultWhse.ftz_type === 'SASBL' && SASBL_REG_TYPES.map(cabr =>
                      (<Option value={cabr.value} key={cabr.value}>
                        {cabr.ftztext}
                      </Option>))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('transferInBills')} {...formItemLayout}>
                {getFieldDecorator('transfer_in_bills', {
                    initialValue: asnHead && asnHead.transfer_in_bills,
                  })(<Input disabled={getFieldValue('reg_type') !== CWM_SHFTZ_IN_REGTYPES[2].value} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <WhseSuppliersModal whseCode={defaultWhse.code} ownerPartnerId={this.props.form.getFieldValue('owner_partner_id')} />
      </FormPane>
    );
  }
}
