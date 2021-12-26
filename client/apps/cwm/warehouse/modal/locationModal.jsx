import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, Radio, message } from 'antd';
import { addLocation, hideLocationModal, updateLocation } from 'common/reducers/cwmWhseLocation';
import { CWM_LOCATION_TYPES, CWM_LOCATION_STATUS } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.location = msg('locationCode');
  fieldLabelMap.type = msg('locationType');
  fieldLabelMap.status = msg('locationStatus');
}

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    visible: state.cwmWhseLocation.locationModal.visible,
    editLocation: state.cwmWhseLocation.editLocation,
  }),
  {
    hideLocationModal, addLocation, updateLocation,
  }
)
@Form.create()
export default class AddLocationModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    zoneCode: PropTypes.string,
    reload: PropTypes.func.isRequired,
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideLocationModal();
  }
  handleSubmit = () => {
    const {
      whseCode, zoneCode, editLocation, loginId, form,
    } = this.props;
    form.validateFields((err, formData) => {
      if (!err) {
        const { type, status, location } = formData;
        if (editLocation.id) {
          const contentLog = [];
          ['type', 'status', 'location'].forEach((field) => {
            if (editLocation[field] !== formData[field] &&
          !(!editLocation[field] && !formData[field])) {
              if (field === 'type') {
                const value = CWM_LOCATION_TYPES.find(item => item.value === formData[field]) &&
              CWM_LOCATION_TYPES.find(item => item.value === formData[field]).text;
                const oldValue = CWM_LOCATION_TYPES.find(item =>
                  item.value === editLocation[field]) &&
              CWM_LOCATION_TYPES.find(item => item.value === editLocation[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'status') {
                const value = CWM_LOCATION_STATUS.find(item => item.value === formData[field]) &&
              CWM_LOCATION_STATUS.find(item => item.value === formData[field]).text;
                const oldValue = CWM_LOCATION_STATUS.find(item =>
                  item.value === editLocation[field]) &&
              CWM_LOCATION_STATUS.find(item => item.value === editLocation[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${editLocation[field] || ''}] 改为 [${formData[field] || ''}]`);
              }
            }
          });
          this.props.updateLocation(type, status, location, editLocation.id, contentLog.length > 0 ? `编辑库位[${editLocation.location}], ${contentLog.join(';')}` : '').then((result) => {
            if (!result.error) {
              message.info('保存成功');
              this.props.hideLocationModal();
            } else {
              message.error(result.error.message);
            }
          });
        } else {
          this.props.addLocation(
            whseCode, zoneCode, location,
            type, status, loginId
          ).then((result) => {
            if (!result.error) {
              message.info('创建成功');
              this.props.hideLocationModal();
            } else {
              message.error(result.error.message);
            }
          });
        }
      }
    });
  }
  render() {
    const { editLocation, form: { getFieldDecorator } } = this.props;
    const title = editLocation && editLocation.location ? '编辑库位' : '创建库位';
    return (
      <Modal
        maskClosable={false}
        title={title}
        onCancel={this.handleCancel}
        visible={this.props.visible}
        onOk={this.handleSubmit}
      >
        <Form>
          <FormItem {...formItemLayout} label={fieldLabelMap.location}>
            {getFieldDecorator('location', {
                rules: [{ required: true }],
                initialValue: editLocation.location,
              })(<Input />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabelMap.type}>
            {getFieldDecorator('type', {
              rules: [{ required: true }],
              initialValue: editLocation.type,
            })(<Select>
              {CWM_LOCATION_TYPES.map(item => (<Option key={item.value} value={item.value}>
                {item.text}
              </Option>))}
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabelMap.status}>
            {getFieldDecorator('status', {
              rules: [{ required: true }],
              initialValue: editLocation.status,
            })(<RadioGroup>
              {CWM_LOCATION_STATUS.map(item => (<RadioButton key={item.value} value={item.value}>
                {item.text}
              </RadioButton>))}
            </RadioGroup>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
