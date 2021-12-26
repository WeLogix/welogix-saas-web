import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Icon, Input, Select } from 'antd';
import { toggleContacterModal, addContacter, editContacter } from 'common/reducers/partner';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.partner.contacterModal.visible,
    contacter: state.partner.contacterModal.contacter,
    partners: state.partner.partners,
  }),
  {
    toggleContacterModal,
    addContacter,
    editContacter,
  }
)
@Form.create()
export default class ContacterModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    addContacter: PropTypes.func.isRequired,
    editContacter: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleContacterModal(false);
  }
  handleOk = () => {
    const { form, contacter } = this.props;
    form.validateFields((errs, formValues) => {
      if (!errs) {
        const prom = contacter.id ?
          this.props.editContacter(formValues, contacter.id) :
          this.props.addContacter(formValues);
        prom.then((result) => {
          if (!result.error) {
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, contacter, partners,
    } = this.props;
    if (!visible) return null;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        width={680}
        maskClosable={false}
        visible={visible}
        title={contacter.id ? '编辑联系人' : '新建联系人'}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        destroyOnClose
      >
        <Form layout="horizontal" className="form-layout-compact">
          <FormItem
            {...formItemLayout}
            label={this.msg('contacterName')}
          >
            {getFieldDecorator('contacter_name', {
              initialValue: contacter.contacter_name,
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('company')}
          >
            {getFieldDecorator('partner_id', {
              initialValue: contacter.partner_id,
            })(<Select allowClear showSearch optionFilterProp="children">
              {partners.map(pt =>
                (<Option key={pt.partner_id} value={pt.partner_id}>
                  {[pt.partner_code, pt.name].filter(f => f).join('|')}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('department')}
          >
            {getFieldDecorator('department', {
              initialValue: contacter.department,
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('position')}
          >
            {getFieldDecorator('position', {
              initialValue: contacter.position,
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('cellphoneNum')}
          >
            {getFieldDecorator('cellphone_num', {
              initialValue: contacter.cellphone_num,
            })(<Input type="tel" prefix={<Icon type="shake" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('phone')}
          >
            {getFieldDecorator('phone_num', {
              initialValue: contacter.phone_num,
            })(<Input type="tel" prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('email')}
            hasFeedback
          >
            {getFieldDecorator('email', {
              initialValue: contacter.email,
              rules: [{ type: 'email' }],
            })(<Input type="email" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('fax')}
          >
            {getFieldDecorator('fax', {
              initialValue: contacter.fax,
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('remark')}
          >
            {getFieldDecorator('remark', {
              initialValue: contacter.remark,
            })(<Input.TextArea />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
