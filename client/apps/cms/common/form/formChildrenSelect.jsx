import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

// PureComponent if setFieldsValue but props not change, will not rerender
export default function FormChildrenSearchSelect(props) {
  const {
    label, col, field, required, disabled, noMarginBottom, dropdownWidth,
    getFieldDecorator, rules, formData, options = [],
    placeholder, mode, onChange,
  } = props;
  const initialValue = formData && formData[field];
  let disabledValue = initialValue;
  if (mode === 'multiple') {
    disabledValue = initialValue.map((iv) => {
      const mopt = options.filter(opt => opt.value === iv)[0];
      if (mopt) {
        return mopt.title || mopt.text;
      }
      return '';
    }).filter(tt => tt).join(',');
  } else {
    const filterOpt = options.filter(opt => opt.value === initialValue)[0];
    if (filterOpt) {
      disabledValue = filterOpt.title || filterOpt.text;
    }
  }
  const style = noMarginBottom ? { marginBottom: 0 } : null;
  const dropdownStyle = dropdownWidth ? { width: dropdownWidth } : null;
  return (
    <FormItem
      labelCol={{ span: col }}
      wrapperCol={{ span: 24 - col }}
      colon={false}
      label={label}
      required={required}
      style={style}
    >
      { disabled ? <Input disabled value={disabledValue} /> :
        getFieldDecorator(field, {
          rules, initialValue,
        })(<Select
          mode={mode}
          showSearch
          showArrow
          allowClear
          optionFilterProp="search"
          placeholder={placeholder}
          dropdownMatchSelectWidth={!dropdownStyle}
          dropdownStyle={dropdownStyle}
          onChange={onChange}
          optionLabelProp="title"
        >
          {
          options.map(opt => (
            <Option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              title={opt.title || opt.text}
              search={opt.search || opt.text}
            >
              {opt.text}
            </Option>))
        }
        </Select>)}
    </FormItem>
  );
}

FormChildrenSearchSelect.propTypes = {
  label: PropTypes.string,
  col: PropTypes.number,
  field: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
  getFieldDecorator: PropTypes.func.isRequired,
  formData: PropTypes.shape({}),
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
  noMarginBottom: PropTypes.bool,
  dropdownWidth: PropTypes.number,
};
