import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input } from 'antd';

const FormItem = Form.Item;
/* eslint react/forbid-prop-types:0 */
export default function FormInput(props) {
  const {
    outercol, label, col, field, required, readOnly, hasFeedback, type = 'text', disabled, noMarginBottom,
    placeholder, getFieldDecorator, rules, addonBefore, addonAfter, fieldProps, formData = {},
  } = props;
  const initialValue = formData && formData[field] && String(formData[field]);
  const style = noMarginBottom ? { marginBottom: 0 } : null;
  return (
    <Col span={outercol}>
      <FormItem
        labelCol={{ span: col }}
        wrapperCol={{ span: 24 - col }}
        colon={false}
        label={label}
        hasFeedback={hasFeedback}
        required={required}
        style={style}
      >
        {disabled ?
          <Input
            type={type}
            disabled
            value={initialValue}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
          /> :
            getFieldDecorator(field, { rules, initialValue, ...fieldProps })(<Input
              type={type}
              readOnly={readOnly}
              placeholder={placeholder}
              addonBefore={addonBefore}
              addonAfter={addonAfter}
            />)}
      </FormItem>
    </Col>
  );
}
FormInput.propTypes = {
  outercol: PropTypes.number,
  label: PropTypes.string,
  col: PropTypes.number,
  field: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  hasFeedback: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rules: PropTypes.array,
  addonBefore: PropTypes.string,
  addonAfter: PropTypes.node,
  fieldProps: PropTypes.object,
  getFieldDecorator: PropTypes.func.isRequired,
  formData: PropTypes.object,
  noMarginBottom: PropTypes.bool,
};
