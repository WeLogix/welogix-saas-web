import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Mention, Switch, Card, Row, Col, Form, Radio, Select } from 'antd';
import { SOURCE_CHOOSE, CIQ_GOODS_ATTRS, CIQ_GOODS_USETO } from 'common/constants';
import FormPane from 'client/components/FormPane';
import FormControlSearchSelect from 'client/apps/cms/common/form/formLimitSelect';
import { formatMsg } from '../../../message.i18n';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Nav } = Mention;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@injectIntl
@connect(state => ({
  exemptions: state.saasParams.latest.exemptionWay,
  tradeCountries: state.saasParams.latest.country.map(tc => ({
    value: tc.cntry_co,
    text: tc.cntry_name_cn,
  })),
  districts: state.saasParams.latest.district.map(dt => ({
    value: dt.district_code,
    text: dt.district_name,
  })),
  cnregions: state.saasParams.latest.cnregion.map(cn => ({
    value: cn.region_code,
    text: cn.region_name,
  })),
}))
export default class ImportRulesPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({ rule_g_name: PropTypes.string }).isRequired,
  }
  state = {
    suggestions: [],
  }
  msg = formatMsg(this.props.intl)
  formulaParams = [
    { value: 'g_model', text: '规格型号' },
    { value: 'remark', text: '备注' },
    { value: 'cop_product_no', text: '商品货号' },
    { value: 'null', text: '空' },
  ];
  handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = this.formulaParams.filter(item =>
      item.value.toLowerCase().indexOf(searchValue) !== -1);
    const suggestions = filtered.map(suggestion =>
      (<Nav value={suggestion.value} data={suggestion}>
        <span>{suggestion.text} - {suggestion.value} </span>
      </Nav>));
    this.setState({ suggestions });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, formData, ietype, exemptions, tradeCountries,
      districts, cnregions,
    } = this.props;
    const specialCode = getFieldValue('set_special_code') || formData.set_special_code;
    return (
      <FormPane >
        <FormItem>{getFieldDecorator('set_special_code', {
          initialValue: formData.set_special_code,
          valuePropName: 'checked',
        })(<Switch checkedChildren="启用" unCheckedChildren="关闭" />)}
        </FormItem>
        <Card >
          <Row gutter={20}>
            <Col sm={24} lg={12}>
              <FormItem label="商品名称" {...formItemLayout} >
                {getFieldDecorator('rule_g_name', { initialValue: formData.rule_g_name })(<RadioGroup disabled={!specialCode} >
                  <RadioButton value={SOURCE_CHOOSE.import.key}>
                    {SOURCE_CHOOSE.import.value}
                  </RadioButton>
                  <RadioButton value={SOURCE_CHOOSE.item.key}>
                    {SOURCE_CHOOSE.item.value}
                  </RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="币制" {...formItemLayout} >
                {getFieldDecorator('rule_currency', { initialValue: formData.rule_currency })(<RadioGroup disabled={!specialCode} >
                  <RadioButton value={SOURCE_CHOOSE.import.key}>
                    {SOURCE_CHOOSE.import.value}
                  </RadioButton>
                  <RadioButton value={SOURCE_CHOOSE.item.key}>
                    {SOURCE_CHOOSE.item.value}
                  </RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} lg={12}>
              <FormItem label="原产国" {...formItemLayout} >
                {getFieldDecorator('rule_orig_country', { initialValue: formData.rule_orig_country })(<RadioGroup disabled={!specialCode} >
                  <RadioButton value={SOURCE_CHOOSE.import.key}>
                    {SOURCE_CHOOSE.import.value}
                  </RadioButton>
                  <RadioButton value={SOURCE_CHOOSE.item.key}>
                    {SOURCE_CHOOSE.item.value}
                  </RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="净重" {...formItemLayout} >
                {getFieldDecorator('rule_net_wt', { initialValue: formData.rule_net_wt })(<RadioGroup disabled={!specialCode} >
                  <RadioButton value={SOURCE_CHOOSE.import.key}>
                    {SOURCE_CHOOSE.import.value}
                  </RadioButton>
                  <RadioButton value={SOURCE_CHOOSE.item.key}>
                    {SOURCE_CHOOSE.item.value}
                  </RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} lg={12}>
              <FormItem label="最终目的国" {...formItemLayout} >
                {getFieldDecorator('rule_dest_country', { initialValue: formData.rule_dest_country })(<Select
                  showSearch
                  showArrow
                  allowClear
                  optionFilterProp="children"
                  style={{ width: '50%' }}
                >
                  { tradeCountries.map(data => (
                    <Option key={data.value} value={data.value} >
                      {data.value}|{data.text}
                    </Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="征免方式" {...formItemLayout} >
                {getFieldDecorator('rule_duty_mode', { initialValue: formData.rule_duty_mode })(<Select
                  showSearch
                  showArrow
                  allowClear
                  optionFilterProp="children"
                  style={{ width: '50%' }}
                >
                  { exemptions.map(data => (
                    <Option key={data.value} value={data.value} >
                      {data.value}|{data.text}
                    </Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} lg={12}>
              <FormControlSearchSelect
                col={6}
                field="rule_district_code"
                label={ietype === 'import' ? this.msg('domesticDest') : this.msg('domesticOrig')}
                formData={formData}
                getFieldDecorator={getFieldDecorator}
                options={districts.map(dt => ({
                value: dt.value,
                text: `${dt.value} | ${dt.text}`,
              }))}
              />
            </Col>
            <Col sm={24} lg={12}>
              <FormControlSearchSelect
                col={6}
                field="rule_district_region"
                label={ietype === 'import' ? this.msg('regionDest') : this.msg('regionOrig')}
                formData={formData}
                getFieldDecorator={getFieldDecorator}
                options={cnregions.map(dt => ({
                value: dt.value,
                text: `${dt.value} | ${dt.text}`,
              }))}
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} lg={12}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('goodsAttr')}>
                {getFieldDecorator('rule_goods_attr', {
                initialValue: formData.rule_goods_attr,
              })(<Select showSearch showArrow optionFilterProp="children" mode="multiple" style={{ width: '100%' }}>
                {CIQ_GOODS_ATTRS.map(ep => (
                  <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('goodsPurpose')}>
                {getFieldDecorator('rule_purpose', {
                initialValue: formData.rule_purpose,
              })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {CIQ_GOODS_USETO.map(ep => (
                  <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
              </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col>
              <FormItem label="成交计量单位" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} >
                {getFieldDecorator('rule_gunit_num', { initialValue: formData.rule_gunit_num })(<RadioGroup disabled={!specialCode} >
                  <Radio value="g_unit_1">成交单位一</Radio>
                  <Radio value="g_unit_2">成交单位二</Radio>
                  <Radio value="g_unit_3">成交单位三</Radio>
                </RadioGroup>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col>
              <FormItem label="规格型号" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} >
                {getFieldDecorator('rule_element', {
                    initialValue: Mention.toContentState(formData.rule_element),
                  })(<Mention
                    suggestions={this.state.suggestions}
                    prefix="$"
                    onSearchChange={this.handleSearch}
                    placeholder="示例(固定值+备注)：String + $remark"
                    multiLines
                    style={{ width: '100%', height: '100%' }}
                  />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
