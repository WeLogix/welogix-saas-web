import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, message } from 'antd';
import { CMS_HSCODE_BRAND_TYPE, CMS_HSCODE_EXPORT_PREFER } from 'common/constants';
import { hideDeclElementsModal } from 'common/reducers/cmsManifest';
import { dbcsByteLength } from 'common/validater';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(
  state => ({
    visible: state.cmsManifest.declElementsModal.visible,
    element: state.cmsManifest.declElementsModal.element,
    gModel: state.cmsManifest.declElementsModal.gModel,
    disabled: state.cmsManifest.declElementsModal.disabled,
    id: state.cmsManifest.declElementsModal.id,
    saveFn: state.cmsManifest.declElementsModal.saveFn,
  }),
  { hideDeclElementsModal }
)
@Form.create()
export default class DeclElementsModal extends Component {
  static propTypes = {
    onOk: PropTypes.func,
  }
  state = {
    model: '',
    others: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      let others = '';
      if (nextProps.gModel && nextProps.element) {
        const modelParts = nextProps.gModel.split('|');
        const elemParts = nextProps.element.split(';');
        if (modelParts.length >= elemParts.length) {
          others = modelParts[elemParts.length - 1];
        }
      }
      this.setState({
        model: nextProps.gModel,
        others,
      });
    }
  }
  handleOk = () => {
    const { id, disabled } = this.props;
    if (!disabled) {
      this.props.form.validateFields((err) => {
        if (!err) {
          const gmodelStr = this.state.model.replace(/\|+$/, '');
          const gmodelByteLen = dbcsByteLength(gmodelStr);
          if (gmodelByteLen > 255) {
            message.error('规范申报长度超过255字节');
            return;
          }
          const element = this.props.element ? this.props.element.split(';') : [];
          const gtinIdx = element.findIndex(elem => elem.indexOf('GTIN') >= 0);
          const casIdx = element.findIndex(elem => elem.indexOf('CAS') >= 0);
          const gmodelParts = gmodelStr.split('|');
          const gtin = gmodelParts[gtinIdx];
          if (gtin && !/^\d{8}$|^\d{12}$|^\d{13}$/.test(gtin)) {
            message.error('GIN必须是8位或12位或13位数字');
            return;
          }
          const cas = gmodelParts[casIdx];
          if (cas && !/^[\d-]+$/.test(cas)) {
            message.error('CAS不符合规则');
            return;
          }
          if (this.props.saveFn) {
            this.props.saveFn(gmodelStr);
          } else if (this.props.onOk) {
            this.props.onOk(gmodelStr, id);
          }
          this.handleCancel();
        }
      });
    } else {
      this.handleCancel();
    }
  }
  handleCancel = () => {
    this.props.hideDeclElementsModal();
    this.props.form.resetFields();
  }
  handleInputChange = (value, item) => {
    const data = this.props.form.getFieldsValue();
    const values = [];
    Object.keys(data).forEach((key) => {
      if (key === item) {
        values.push(value);
      } else {
        values.push(data[key]);
      }
    });
    if (this.state.others) {
      values.push(this.state.others);
    }
    const model = values.join('|').replace(/\|+$/, '');
    this.setState({ model });
  }
  handleOthersChange = (e) => {
    let { model } = this.state;
    if (model) {
      const values = model.split('|');
      values.splice(-1, 1, e.target.value);
      model = values.join('|');
    } else {
      model = '';
      const element = this.props.element ? this.props.element.split(';') : [];
      for (let i = 0; i < element.length; i++) {
        model += '|';
      }
      model += `|${e.target.value}`;
    }
    this.setState({
      model,
      others: e.target.value,
    });
  }
  render() {
    const { form: { getFieldDecorator }, visible, disabled } = this.props;
    if (!visible) {
      return null;
    }
    const { model, others } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const element = this.props.element ? this.props.element.split(';').slice(0, -1) : [];
    const gtinIdx = element.findIndex(elem => elem.indexOf('GTIN') >= 0);
    const casIdx = element.findIndex(elem => elem.indexOf('CAS') >= 0);
    const afterGtinCasIdx = gtinIdx > casIdx ? gtinIdx + 1 : casIdx + 1;
    const gModel = this.props.gModel ? this.props.gModel.split('|') : [];
    const gmodelByteLen = dbcsByteLength(model);
    // TODO REFRACTOR item 不作为field id ([] 符号selector问题), getFieldsValue更新总值, 传入参数变更
    return (
      <Modal
        maskClosable={false}
        title="规范申报"
        width={800}
        style={{ top: 24 }}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form className="form-layout-compact">
          <FormItem>
            <TextArea value={model} disabled autosize />
            <span className={gmodelByteLen > 255 ? 'text-error' : 'text-success'}>{gmodelByteLen}</span> / 255
          </FormItem>
          {element.map((item, index) => {
              if (item && index === 0) {
                return (
                  <FormItem {...formItemLayout} label={item} key={item}>
                    {getFieldDecorator(item, {
                      initialValue: gModel[0] || '',
                      rules: [{ required: true }],
                    })(<Select
                      disabled={disabled}
                      onChange={value => this.handleInputChange(value, item)}
                    >
                      {CMS_HSCODE_BRAND_TYPE.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.value} | {type.text}
                        </Option>))}
                    </Select>)}
                  </FormItem>
                );
              } else if (item && index === 1) {
                return (
                  <FormItem {...formItemLayout} label={item} key={item}>
                    {getFieldDecorator(item, {
                      initialValue: gModel[1] || '',
                      rules: [{ required: true }],
                    })(<Select
                      disabled={disabled}
                      onChange={value => this.handleInputChange(value, item)}
                    >
                      {CMS_HSCODE_EXPORT_PREFER.map(prefer => (
                        <Option key={prefer.value} value={prefer.value}>
                          {prefer.value} | {prefer.text}
                        </Option>))}
                    </Select>)}
                  </FormItem>
                );
              } else if (item && index >= 2) {
                return (
                  <FormItem {...formItemLayout} label={item} key={item}>
                    {getFieldDecorator(item, {
                      initialValue: gModel[index] || '',
                      rules: [{
 required: item.indexOf('GTIN') >= 0 || item.indexOf('CAS') >= 0 ? !!element[afterGtinCasIdx] : true,
                        message: '申报要素不能为空',
                      }],
                    })(<Input
                      disabled={disabled}
                      onChange={e => this.handleInputChange(e.target.value, item)}
                    />)}
                  </FormItem>
                );
              }
              return '';
            })}
          <FormItem {...formItemLayout} label="其他">
            <Input value={others} disabled={disabled} onChange={this.handleOthersChange} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
