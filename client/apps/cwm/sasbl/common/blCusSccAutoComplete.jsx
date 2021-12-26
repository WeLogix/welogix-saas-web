import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, AutoComplete, Input, Form } from 'antd';

const FormItem = Form.Item;

export default class BlCusSccAutoComplete extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }),
    rules: PropTypes.arrayOf(PropTypes.shape({
      required: PropTypes.bool,
    })),
    readonly: PropTypes.bool,
    cusCodeField: PropTypes.string.isRequired,
    sccCodeField: PropTypes.string.isRequired,
    nameField: PropTypes.string.isRequired,
    dataList: PropTypes.arrayOf(PropTypes.shape({
      customs_code: PropTypes.string,
      uscc_code: PropTypes.string,
      name: PropTypes.string,
    })),
    onChange: PropTypes.func,
  }
  handleOptionChange = (value) => {
    const {
      dataList, form: { setFieldsValue },
      cusCodeField, sccCodeField, nameField,
    } = this.props;
    if (value === undefined || value === '') {
      setFieldsValue({
        [cusCodeField]: '',
        [sccCodeField]: '',
        [nameField]: '',
      });
      if (this.props.onChange) {
        this.props.onChange();
      }
    } else {
      const compOpt = dataList.filter(rel => rel.uscc_code === value ||
        rel.customs_code === value)[0];
      if (compOpt) {
        setFieldsValue({
          [cusCodeField]: compOpt.customs_code,
          [sccCodeField]: compOpt.uscc_code,
          [nameField]: compOpt.name,
        });
        if (this.props.onChange) {
          this.props.onChange(compOpt.customs_code, compOpt.uscc_code, compOpt.name);
        }
      }
    }
  }
  render() {
    const {
      readonly, dataList, formData, form: { getFieldDecorator },
      cusCodeField, sccCodeField, nameField,
    } = this.props;
    const cusCodeValue = (formData && formData[cusCodeField]) || '';
    const sccCodeValue = (formData && formData[sccCodeField]) || '';
    const nameValue = (formData && formData[nameField]) || '';
    const proRules = this.props.rules;
    const customsCompList = dataList.filter(data => data.customs_code).map(cus => ({
      value: cus.customs_code,
      text: `${cus.customs_code}|${cus.name}`,
    }));
    const sccCompList = dataList.filter(data => data.uscc_code).map(cus => ({
      value: cus.uscc_code,
      text: `${cus.uscc_code}|${cus.name}`,
    }));
    return (
      <Row gutter={2}>
        <Col span={6}>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(cusCodeField, {
              rules: proRules,
              initialValue: cusCodeValue,
            })(<AutoComplete
              allowClear
              disabled={readonly}
              style={{ width: '100%' }}
              dataSource={customsCompList}
              onChange={this.handleOptionChange}
              onSelect={this.handleOptionChange}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 420 }}
              optionLabelProp="value"
              optionFilterProp="children"
            />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(sccCodeField, {
              rules: proRules,
              initialValue: sccCodeValue,
            })(<AutoComplete
              allowClear
              disabled={readonly}
              style={{ width: '100%' }}
              dataSource={sccCompList}
              onChange={this.handleOptionChange}
              onSelect={this.handleOptionChange}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 420 }}
              optionLabelProp="value"
              optionFilterProp="children"
            />)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(nameField, {
              rules: proRules,
              initialValue: nameValue,
            })(<Input disabled={readonly} />)}
          </FormItem>
        </Col>
      </Row>);
  }
}
