import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Form, Input, Select, Row, Col, Icon, DatePicker, Drawer } from 'antd';
import { CWM_STOCK_SUM_TYPE } from 'common/constants';
import { checkOwnerColumn, checkProductColumn, checkLocationColumn, checkProductLocation, changeSearchType, clearList } from 'common/reducers/cwmInventoryStock';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    filter: state.cwmTransition.listFilter,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  {
    checkOwnerColumn,
    checkProductColumn,
    checkLocationColumn,
    checkProductLocation,
    changeSearchType,
    clearList,
  }
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
        const formData = this.props.form.getFieldsValue();
        this.props.onSearch(formData);
      }
    });
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { form: { getFieldDecorator }, filter } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const responsive = {
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 6 },
    };
    return [
      <Form layout="inline" >
        <FormItem >
          {getFieldDecorator('search_type', {
            initialValue: filter.search_type,
          })(<Select placeholder="汇总方式" onChange={this.handleSearchTypeChange}>
            {CWM_STOCK_SUM_TYPE.map(sumType =>
              (<Option key={sumType.value} value={sumType.value}>{sumType.text}</Option>))}
          </Select>)}
        </FormItem>
        <FormItem >
          {getFieldDecorator('product_no', {
            initialValue: filter.product_no,
          })(<Input placeholder="商品货号/SKU/中文品名" />)}
        </FormItem>
        <FormItem >
          {getFieldDecorator('asn_no', { initialValue: filter.asn_no })(<Input placeholder="ASN/进区凭单号/订单追踪号" />)}
        </FormItem>
        <FormItem >
          {getFieldDecorator('external_lot_no', { initialValue: filter.external_lot_no })(<Input placeholder="批次号" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="search" onClick={this.handleStockSearch}>{this.msg('query')}</Button>
          <a style={{ marginLeft: 8 }} onClick={() => this.toggleAdvSearch(true)}>
            {this.msg('advSearch')} <Icon type="down" />
          </a>
        </FormItem>
      </Form>,
      <Drawer
        title={this.msg('advSearch')}
        placement="top"
        onClose={() => this.toggleAdvSearch(false)}
        visible={this.state.advSearch}
        height={450}
      >
        <Form>
          <Row gutter={16}>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="汇总方式">
                {getFieldDecorator('search_type', {
                  initialValue: filter.search_type,
                })(<Select onChange={this.handleSearchTypeChange}>
                  {CWM_STOCK_SUM_TYPE.map(sumType =>
                    (<Option key={sumType.value} value={sumType.value}>{sumType.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="货品">
                {getFieldDecorator('product_no', {
                  initialValue: filter.product_no,
                })(<Input placeholder="商品货号/SKU/中文品名" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="入库单号">
                {getFieldDecorator('asn_no', { initialValue: filter.asn_no })(<Input placeholder="ASN/进区凭单号/订单追踪号" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="批次号">
                {getFieldDecorator('external_lot_no', { initialValue: filter.external_lot_no })(<Input placeholder="批次号" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="序列号">
                {getFieldDecorator('serial_no', {
                  initialValue: filter.serial_no,
                })(<Input placeholder="序列号" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="追踪ID">
                {getFieldDecorator('trace_id', {
                  initialValue: filter.trace_id,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="库别">
                {getFieldDecorator('virtual_whse', {
                  initialValue: filter.virtual_whse,
                })(<Input placeholder="库别" />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="采购订单号">
                {getFieldDecorator('po_no', {
                  initialValue: filter.po_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="入库日期" >
                {getFieldDecorator('inbound_times', {
                  initialValue: filter.inbound_times,
                })(<RangePicker />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="失效日期" >
                {getFieldDecorator('expiry_date', {
                  initialValue: filter.expiry_date,
                })(<RangePicker />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性1">
                {getFieldDecorator('attrib_1_string', {
                  initialValue: filter.attrib_1_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性2">
                {getFieldDecorator('attrib_2_string', {
                  initialValue: filter.attrib_2_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性3">
                {getFieldDecorator('attrib_3_string', {
                  initialValue: filter.attrib_3_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性4">
                {getFieldDecorator('attrib_4_string', {
                  initialValue: filter.attrib_4_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性5">
                {getFieldDecorator('attrib_5_string', {
                  initialValue: filter.attrib_5_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性6">
                {getFieldDecorator('attrib_6_string', {
                  initialValue: filter.attrib_6_string,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性7">
                {getFieldDecorator('attrib_7_date', {
                  initialValue: filter.attrib_7_date,
                })(<RangePicker />)}
              </FormItem>
            </Col>
            <Col {...responsive}>
              <FormItem {...formItemLayout} label="扩展属性8">
                {getFieldDecorator('attrib_8_date', {
                  initialValue: filter.attrib_8_date,
                })(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" icon="search" onClick={this.handleStockSearch}>{this.msg('query')}</Button>
            <Button icon="reload" onClick={this.handleFormReset} style={{ marginLeft: 8 }}>{this.msg('reset')}</Button>
            <a style={{ marginLeft: 8 }} onClick={() => this.toggleAdvSearch(false)}>
              {this.msg('collapse')} <Icon type="up" />
            </a>
          </Row>
        </Form>
      </Drawer>,
    ];
  }
}
