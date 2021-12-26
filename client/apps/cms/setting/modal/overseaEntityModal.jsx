
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'react-redux';
import { toggleOverseaUnitModal, addOverseaUnit, updateOverseaUnit } from 'common/reducers/cmsResources';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

@connect(state => ({
  tenantId: state.account.tenantId,
  loginId: state.account.loginId,
  loginName: state.account.username,
  visible: state.cmsResources.overseaUnitModal.visible,
  businessUnit: state.cmsResources.overseaUnitModal.businessUnit,
  operation: state.cmsResources.overseaUnitModal.operation,
  customer: state.cmsResources.customer,
}), { toggleOverseaUnitModal, addOverseaUnit, updateOverseaUnit })

@Form.create()
export default class OverseaEntityModal extends React.Component {
  static propTypes = {
    tenantId: PropTypes.number.isRequired,
    loginId: PropTypes.number.isRequired,
    loginName: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    operation: PropTypes.string, // add  edit
    businessUnit: PropTypes.shape(PropTypes.string),
    addOverseaUnit: PropTypes.func.isRequired,
    updateOverseaUnit: PropTypes.func.isRequired,
    toggleOverseaUnitModal: PropTypes.func.isRequired,
    customer: PropTypes.shape(PropTypes.string).isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.businessUnit !== this.props.businessUnit) {
      const { businessUnit } = nextProps;
      this.props.form.setFieldsValue({
        name: businessUnit.comp_name || '',
        nameEn: businessUnit.comp_name_en || '',
        addr: businessUnit.comp_entity_addr || '',
        aeoCode: businessUnit.aeo_code || '',
      });
    }
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const values = this.props.form.getFieldsValue();
        if (this.props.operation === 'edit') {
          this.props.updateOverseaUnit({
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
          this.props.addOverseaUnit({
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
    this.props.toggleOverseaUnitModal(false);
  }
  render() {
    const { form: { getFieldDecorator }, businessUnit, visible } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="境外收发货人"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="收发货人外文名称">
            {getFieldDecorator('nameEn', {
              // rules: [{ required: true, message: '外文名称必填' }],
              initialValue: businessUnit.comp_name_en || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="AEO编码">
            {getFieldDecorator('aeoCode', {
              // rules: [{ required: true, message: 'AEO编码必填' }],
              initialValue: businessUnit.aeo_code || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="中文名称">
            {getFieldDecorator('name', {
              // rules: [{ required: true, message: '企业名称必填' }],
              initialValue: businessUnit.comp_name || '',
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="地址">
            {getFieldDecorator('addr', {
              // rules: [{ required: true, message: '收发货人地址必填' }],
              initialValue: businessUnit.comp_entity_addr || '',
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
