import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Select, Input, Tag, message } from 'antd';
import { toggleCreateModal, createInvoicingKind } from 'common/reducers/saasInvoicingKind';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.saasInvoicingKind.createModal.visible,
  }),
  {
    toggleCreateModal, createInvoicingKind,
  }
)
@Form.create()
export default class CreateModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  handleCancel = () => {
    this.props.toggleCreateModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.createInvoicingKind({
          invoicingCode: values.invoicing_code,
          invoicingType: values.invoicing_type,
          invoiceCat: values.invoice_cat,
          taxRate: values.tax_rate,
        }).then((result) => {
          if (!result.error) {
            this.handleCancel();
            this.props.reload();
          } else {
            message.error(result.error.message);
          }
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createTax')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('invoiceCategory')} {...formItemLayout} >
            {getFieldDecorator('invoice_cat', {
              rules: [{ required: true, message: this.msg('pleaseSelectInvoiceCategory') }],
              })(<Select
                optionFilterProp="children"
              >
                <Option key="VAT_S" value="VAT_S"><Tag color="green">增值税专用发票</Tag></Option>
                <Option key="VAT_N" value="VAT_N"><Tag>增值税普通发票</Tag></Option>
              </Select>)}
          </FormItem>
          <FormItem label={this.msg('taxRates')} {...formItemLayout} >
            {getFieldDecorator('tax_rate', {
              rules: [{ required: true, message: this.msg('pleaseInputTaxRate') }],
              })(<Input
                addonAfter="%"
                type="number"
              />)}
          </FormItem>
          <FormItem label={this.msg('invoicingType')} {...formItemLayout} >
            {getFieldDecorator('invoicing_type', {
              rules: [{ required: true, message: this.msg('pleaseInputinvoicingType') }],
              })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('invoicingCode')} {...formItemLayout} >
            {getFieldDecorator('invoicing_code', {
              rules: [{ required: true, message: this.msg('pleaseInputInvoicingCode') }],
              })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
