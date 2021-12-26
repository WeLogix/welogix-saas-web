import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Drawer, Form, Input, Select, Row, Col, Icon, DatePicker } from 'antd';
import { DATE_FORMAT } from 'common/constants';
import LocationSelect from 'client/apps/cwm/common/locationSelect';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    filter: state.cwmTransaction.listFilter,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  { }
)
@Form.create()
export default class QueryForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    onSearch: PropTypes.func.isRequired,
  }
  state = {
    advSearch: false,
  };
  handleFormReset = () => {
    this.props.form.resetFields();
  }
  toggleAdvSearch = (visible) => {
    this.setState({
      advSearch: visible,
    });
  }
  handleStockSearch = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.toggleAdvSearch(false);
        const formData = this.props.form.getFieldsValue();
        this.props.onSearch(formData);
      }
    });
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { form: { getFieldDecorator }, owners, filter } = this.props;
    const responsive = {
      md: { span: 8 },
      lg: { span: 6 },
      xl: { span: 4 },
      xxl: { span: 3 },
    };
    return [
      <Form layout="inline" key="compact">
        <FormItem>
          {getFieldDecorator('owner', {
                initialValue: filter.owner,
              })(<Select placeholder="货主" showSearch optionFilterProp="children" allowClear>
                {owners.map(owner =>
                  (<Option value={owner.id} key={owner.id}>{owner.name}</Option>))}
              </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('transaction_time', {
                initialValue: filter.transaction_time,
              })(<RangePicker format={DATE_FORMAT} />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('type', {
                initialValue: filter.type,
              })(<Select placeholder="事务类型" allowClear>
                <Option value="inbound" key="inbound">入库</Option>
                <Option value="outbound" key="outbound">出库</Option>
                <Option value="movement" key="movement">库存移动</Option>
                <Option value="transit" key="transit">转移</Option>
                <Option value="adjust" key="adjust">调整</Option>
              </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('ref_order_no', {
                initialValue: filter.ref_order_no,
              })(<Input placeholder="订单追踪号" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="search" onClick={this.handleStockSearch} />
          <a style={{ marginLeft: 8 }} onClick={() => this.toggleAdvSearch(true)}>
            {this.msg('advSearch')} <Icon type="down" />
          </a>
        </FormItem>
      </Form>,
      <Drawer
        key="advanced"
        title={this.msg('advSearch')}
        placement="top"
        onClose={() => this.toggleAdvSearch(false)}
        visible={this.state.advSearch}
        height="auto"
        closable={false}
        getContainer={() => document.getElementById('welo-data-table')}
      >
        <Form>
          <Row gutter={16}>
            <Col {...responsive}>
              <FormItem label="货主">
                {getFieldDecorator('owner', {
                initialValue: filter.owner,
              })(<Select showSearch optionFilterProp="children" allowClear>
                {owners.map(owner =>
                  (<Option value={owner.id} key={owner.id}>{owner.name}</Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="事务时间">
                {getFieldDecorator('transaction_time', {
                initialValue: filter.transaction_time,
              })(<RangePicker format={DATE_FORMAT} />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="事务类型">
                {getFieldDecorator('type', {
                initialValue: filter.type,
              })(<Select allowClear>
                <Option value="inbound" key="inbound">入库</Option>
                <Option value="outbound" key="outbound">出库</Option>
                <Option value="movement" key="movement">库存移动</Option>
                <Option value="transit" key="transit">转移</Option>
                <Option value="adjust" key="adjust">调整</Option>
              </Select>)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="订单追踪号">
                {getFieldDecorator('ref_order_no', {
                initialValue: filter.ref_order_no,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="货品">
                {getFieldDecorator('product_no', {
                initialValue: filter.product_no,
              })(<Input placeholder="商品货号/SKU" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="指令单号">
                {getFieldDecorator('transaction_no', {
                initialValue: filter.transaction_no,
              })(<Input placeholder="入库/出库/库存移动/批量属性修改关联单号" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="序列号">
                {getFieldDecorator('serial_no', {
                initialValue: filter.serial_no,
              })(<Input placeholder="序列号" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="追踪ID">
                {getFieldDecorator('trace_id', {
                initialValue: filter.trace_id,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="库位">
                {getFieldDecorator('location', {
                initialValue: filter.location,
              })(<LocationSelect />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="库别">
                {getFieldDecorator('virtual_whse', {
                initialValue: filter.virtual_whse,
              })(<Input placeholder="库别" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="包装情况">
                {getFieldDecorator('damage_level', {
                initialValue: filter.damage_level,
              })(<Select style={{ width: '100%' }}>
                <Option value={0}>完好</Option>
                <Option value={1}>轻微擦痕</Option>
                <Option value={2}>中度</Option>
                <Option value={3}>重度</Option>
                <Option value={4}>严重磨损</Option>
              </Select>)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="失效日期" >
                {getFieldDecorator('expiry_date', {
                initialValue: filter.expiry_date,
              })(<RangePicker format={DATE_FORMAT} />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性1">
                {getFieldDecorator('attrib_1_string', {
                initialValue: filter.attrib_1_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性2">
                {getFieldDecorator('attrib_2_string', {
                initialValue: filter.attrib_2_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性3">
                {getFieldDecorator('attrib_3_string', {
                initialValue: filter.attrib_3_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性4">
                {getFieldDecorator('attrib_4_string', {
                initialValue: filter.attrib_4_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性5">
                {getFieldDecorator('attrib_5_string', {
                initialValue: filter.attrib_5_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性6">
                {getFieldDecorator('attrib_6_string', {
                initialValue: filter.attrib_6_string,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性7">
                {getFieldDecorator('attrib_7_date', {
                initialValue: filter.attrib_7_date,
              })(<RangePicker format={DATE_FORMAT} />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem label="扩展属性8">
                {getFieldDecorator('attrib_8_date', {
                initialValue: filter.attrib_8_date,
              })(<RangePicker format={DATE_FORMAT} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="primary" onClick={this.handleStockSearch}>{this.msg('query')}</Button>
            <Button onClick={this.handleFormReset} style={{ marginLeft: 8 }}>{this.msg('reset')}</Button>
            <div style={{ marginTop: 16 }}>
              <a onClick={() => this.toggleAdvSearch(false)}>
                {this.msg('collapse')} <Icon type="up" />
              </a>
            </div>
          </Row>
        </Form>
      </Drawer>,
    ];
  }
}
