import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'react-redux';
import { toggleTradeUnitModal, addTradeUnit, updateTradeUnit } from 'common/reducers/cmsResources';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

@connect(state => ({
  tenantId: state.account.tenantId,
  loginId: state.account.loginId,
  loginName: state.account.username,
  visible: state.cmsResources.tradeUnitModal.visible,
  businessUnit: state.cmsResources.tradeUnitModal.businessUnit,
  operation: state.cmsResources.tradeUnitModal.operation,
  customer: state.cmsResources.customer,
}), { toggleTradeUnitModal, addTradeUnit, updateTradeUnit })

@Form.create()
export default class TraderModal extends React.Component {
  static propTypes = {
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    loginName: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    operation: PropTypes.string, // add  edit
    businessUnit: PropTypes.shape(PropTypes.string),
    addTradeUnit: PropTypes.func.isRequired,
    updateTradeUnit: PropTypes.func.isRequired,
    toggleTradeUnitModal: PropTypes.func.isRequired,
    customer: PropTypes.shape(PropTypes.string).isRequired,
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const values = this.props.form.getFieldsValue();
        const { code, customsCode } = values;
        if (code === '' && customsCode === '') {
          message.error('社会信用代码和海关编码至少填写一项');
          return;
        }
        if (this.props.operation === 'edit') {
          this.props.updateTradeUnit({
            ...values,
            id: this.props.businessUnit.id,
          }).then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            }
            this.handleCancel();
          });
        } else {
          const {
            tenantId, loginId, loginName, customer, type,
          } = this.props;
          this.props.addTradeUnit({
            ...values,
            type,
            customerPartnerId: customer.id,
            tenantId,
            loginId,
            loginName,
          }).then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            }
            this.handleCancel();
          });
        }
      }
    });
  }
  handleCancel = () => {
    this.props.toggleTradeUnitModal(false);
    this.props.form.resetFields();
  }
  render() {
    const { form: { getFieldDecorator }, businessUnit, visible } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="境内收发货人"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="收发货人中文名称">
            {getFieldDecorator('name', {
              // rules: [{ required: true, message: '企业名称必填' }],
              initialValue: businessUnit.comp_name || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="统一社会信用代码">
            {getFieldDecorator('code', {
              // rules: [{ len: 18, message: '统一社会信用代码必须为18位字符' }],
              initialValue: businessUnit.comp_code || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="海关编码">
            {getFieldDecorator('customsCode', {
              rules: [{ len: 10, message: '海关编码必须为10位字符' }],
              initialValue: businessUnit.customs_code || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="检验检疫编码">
            {getFieldDecorator('ciqCode', {
              rules: [{ max: 10 }],
              initialValue: businessUnit.ciq_code || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="外文名称">
            {getFieldDecorator('nameEn', {
              // rules: [{ required: true, message: '外文名称必填' }],
              initialValue: businessUnit.comp_name_en || '',
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
