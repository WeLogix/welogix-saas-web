import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'antd';
import EditableCell from 'client/components/EditableCell';

const FormItem = Form.Item;
/* eslint react/forbid-prop-types:0 */
export default function FormEditableItem(props) {
  const {
    outercol, label, col, field, required, hasFeedback, type = 'text', editable, noMarginBottom,
    onSave, formData = {}, options, ...fieldProps
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
        <EditableCell
          type={type}
          field={field}
          value={initialValue}
          onSave={onSave}
          editable={editable}
          options={options}
          {...fieldProps}
        />
      </FormItem>
    </Col>
  );
}
FormEditableItem.propTypes = {
  outercol: PropTypes.number,
  label: PropTypes.string,
  col: PropTypes.number,
  field: PropTypes.string,
  type: PropTypes.string,
  editable: PropTypes.bool,
  required: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  formData: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
  noMarginBottom: PropTypes.bool,
};
