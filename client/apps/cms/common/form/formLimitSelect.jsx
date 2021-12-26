import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export default class FormControlSearchSelect extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    col: PropTypes.number,
    field: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
    fieldProps: PropTypes.shape({}),
    getFieldDecorator: PropTypes.func.isRequired,
    formData: PropTypes.shape({}),
    options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    noMarginBottom: PropTypes.bool,
    dropdownWidth: PropTypes.number,
    onChange: PropTypes.func,
  };
  state = {
    selOptions: [],
    selValue: null,
  }
  componentDidMount() {
    if (!this.props.disabled && this.props.options.length > 0) {
      const formValue = this.props.formData[this.props.field];
      const selOptions = this.querySelOption(formValue, this.props.options);
      this.setState({ selOptions });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.disabled && nextProps.options.length > 0) {
      // HOW to nextState selValue getFieldValue ?
      if ((!this.state.selValue && this.state.selOptions.length === 0) ||
        nextProps.formData[nextProps.field] !== this.props.formData[nextProps.field]
      ) {
        const formValue = nextProps.formData[nextProps.field];
        const selOptions = this.querySelOption(formValue, nextProps.options);
        this.setState({ selOptions });
      }
    }
  }
  querySelOption = (formValue, optionsProp) => {
    let selOptions = optionsProp.slice(0, 10);
    if (formValue) {
      const regVal = formValue.toUpperCase();
      selOptions = optionsProp.filter(opt => (
        opt.value.toUpperCase().indexOf(regVal) >= 0 ||
        (opt.search || opt.text).toUpperCase().indexOf(regVal) >= 0)).slice(0, 10);
    }
    return selOptions;
  }
  handleSearch = (value) => {
    const selOptions = this.querySelOption(value, this.props.options);
    this.setState({ selOptions });
  }
  handleSelect =(selValue) => {
    const selOptions = this.querySelOption(selValue, this.props.options);
    this.setState({ selOptions, selValue: selValue || '' });
    if (this.props.onChange) {
      this.props.onChange(selValue);
    }
  }
  render() {
    const {
      label, col, field, required, disabled, noMarginBottom, dropdownWidth,
      getFieldDecorator, rules, fieldProps, formData, options = [],
    } = this.props;
    const { selOptions } = this.state;
    const initialValue = formData && formData[field];
    let constOptVal;
    if (disabled) {
      const filterOpt = options.filter(opt => opt.value === initialValue)[0];
      if (filterOpt) {
        constOptVal = (filterOpt.title || filterOpt.text);
      } else {
        constOptVal = initialValue;
      }
    }
    const style = noMarginBottom ? { marginBottom: 0 } : null;
    const dropdownStyle = dropdownWidth ? { width: dropdownWidth } : null;
    return (
      <FormItem
        labelCol={{ xs: { span: 24 }, sm: { span: col } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 24 - col } }}
        colon={false}
        label={label}
        required={required}
        style={style}
      >
        {disabled ? <Input disabled value={constOptVal} /> :
            getFieldDecorator(field, { rules, initialValue, ...fieldProps })(<Select
              disabled={disabled}
              showSearch
              allowClear
              filterOption={false}
              onSearch={this.handleSearch}
              onSelect={this.handleSelect}
              onChange={this.handleSelect}
              dropdownMatchSelectWidth={!dropdownStyle}
              dropdownStyle={dropdownStyle}
              optionLabelProp="title"
            >
              {
                selOptions.map(opt => (<Option
                  disabled={opt.disabled}
                  value={opt.value}
                  key={opt.value}
                  title={opt.title || opt.text}
                >{opt.text}</Option>))
            }
            </Select>)}
      </FormItem>
    );
  }
}

