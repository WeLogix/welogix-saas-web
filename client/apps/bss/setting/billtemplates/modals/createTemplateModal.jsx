import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message, Select } from 'antd';
import { toggleNewTemplateModal, createTemplate } from 'common/reducers/bssBillTemplate';
import { formatMsg } from '../../message.i18n';


const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssBillTemplate.visibleNewTemplateModal,
    partners: state.partner.partners,
  }),
  { toggleNewTemplateModal, createTemplate }
)
@Form.create()
export default class CreateTemplateModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleNewTemplateModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const data = this.props.form.getFieldsValue();
        this.props.createTemplate({
          partnerId: data.partnerId,
          name: data.name,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            this.props.toggleNewTemplateModal(false);
            const link = `/bss/bill/template/${result.data}/fees`;
            this.context.router.push(link);
          }
        });
      }
    });
  }

  render() {
    const { visible, partners, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newBillTemplate')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label="模板名称" {...formItemLayout} >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '模板名称必填' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="结算对象" {...formItemLayout} >
            {getFieldDecorator('partnerId', {
            })(<Select showSearch optionFilterProp="children">
              {partners.map(data => (
                <Option key={String(data.id)} value={String(data.id)}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
                </Option>))
              }
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
