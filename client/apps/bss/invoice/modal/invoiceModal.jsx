import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Col, DatePicker, Form, Modal, Row, Select, Input, Tabs } from 'antd';
import { toggleInvoiceModal, editBillInvoice, getInvoiceDetails, confirmBillInvoice } from 'common/reducers/bssInvoice';
import { MemberSelect } from 'client/components/ComboSelect';
import { PARTNER_ROLES, BSS_INV_TYPE, BSS_PRESET_PAYEE } from 'common/constants';
import FeeItemPane from '../../common/feeItemPane';
import VoucherEntryPane from '../../common/voucherEntryPane';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    visible: state.bssInvoice.invoiceModal.visible,
    record: state.bssInvoice.invoiceModal.record,
    invoicingKinds: state.saasInvoicingKind.allInvoicingKinds,
    action: state.bssInvoice.invoiceModal.action,
    invoiceFees: state.bssInvoice.invoiceFees,
  }),
  {
    toggleInvoiceModal,
    editBillInvoice,
    getInvoiceDetails,
    confirmBillInvoice,
  },
)
@Form.create()
export default class InvoiceModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    mode: PropTypes.oneOf(['input', 'output']),
    action: PropTypes.oneOf(['request', 'confirm', 'edit', '']),
    reload: PropTypes.func,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.id && nextProps.record.id !== this.props.record.id) {
      this.props.getInvoiceDetails(nextProps.record.id);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleInvoiceModal(false);
  };
  handleOk = () => {
    const {
      form: { validateFields, isFieldTouched }, action, record, partners,
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        let prom;
        if (action === 'edit') {
          const invoiceHead = {};
          const fields = Object.keys(values);
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (isFieldTouched(field)) {
              invoiceHead[field] = values[field];
            }
          }
          if (values.invoice_confirm_by !== record.invoice_confirm_by) {
            invoiceHead.invoice_confirm_by = values.invoice_confirm_by;
          }
          if (invoiceHead.seller_partner_id) {
            const seller = partners.find(p => p.id === invoiceHead.seller_partner_id);
            invoiceHead.buyer_tenant_id = seller.partner_tenant_id;
            invoiceHead.buyer_name = seller.name;
          }
          prom = this.props.editBillInvoice(invoiceHead, record.id);
        } else if (action === 'confirm') {
          prom = this.props.confirmBillInvoice([record.id]);
        }
        prom.then((result) => {
          if (!result.error) {
            this.handleCancel();
          }
        });
      }
    });
  };
  handleMemberChange = (value, field) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      [field]: value,
    });
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator, getFieldsValue },
      record,
      mode,
      action,
      partners,
      invoiceFees,
    } = this.props;
    let okText;
    if (mode === 'output') {
      if (action === 'request') {
        okText = this.msg('requestOutputInvoice');
      } else if (action === 'confirm') {
        okText = this.msg('confirmOutputInvoice');
      }
    } else if (mode === 'input') {
      if (action === 'confirm') {
        okText = this.msg('confirmInputInvoice');
      }
    }
    const formData = getFieldsValue();
    const buyer = partners.find(p => p.id === formData.buyer_partner_id || record.buyer_partner_id);
    const seller = partners.find(p => p.id === formData.seller_partner_id ||
      record.seller_partner_id);
    return (
      <Modal
        width={1200}
        maskClosable={false}
        title={this.msg('invoiceEdit')}
        visible={visible}
        okText={okText}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        style={{ top: 64 }}
      >
        <Form layout="horizontal" className="grid-form">
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('buyer')} {...formItemLayout}>
                {getFieldDecorator('buyer_partner_id', {
                  initialValue: record.buyer_partner_id,
                  rules: [{ required: mode === 'output', message: this.msg('pleaseSelectBuyer') }],
                })(<Select showSearch optionFilterProp="children">
                  {partners.filter(p =>
                  p.role === PARTNER_ROLES.CUS || p.role === PARTNER_ROLES.OWN).map(data => (
                    <Option key={data.id} value={data.id}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
                    </Option>))
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('identificationNo')} {...formItemLayout}>
                <Input value={buyer && buyer.partner_unique_code} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('invoiceDate')} {...formItemLayout}>
                {getFieldDecorator('invoice_date', {
                  initialValue: record.invoice_date && moment(record.invoice_date),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('invoiceType')} {...formItemLayout}>
                {getFieldDecorator('invoice_type', {
                  initialValue: record.invoice_type,
                })(<Select
                  disabled={record.invoice_type === BSS_INV_TYPE[2].value}
                  showSearch
                  optionFilterProp="children"
                >
                  {BSS_INV_TYPE.map(invType => (
                    <Option key={invType.key} value={invType.value}>{invType.text}</Option>
                  ))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('invoiceCode')} {...formItemLayout}>
                {getFieldDecorator('invoice_code', {
                  initialValue: record.invoice_code,
                })(<Input disabled={action === 'request'} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('invoiceNo')} {...formItemLayout}>
                {getFieldDecorator('invoice_no', {
                  initialValue: record.invoice_no,
                  rules: [{ required: (mode === 'input' || action === 'confirm'), message: this.msg('pleaseInputInvoiceNo') }],
                })(<Input disabled={action === 'request'} />)}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label={this.msg('amount')} {...formItemLayout}>
                {getFieldDecorator('invoice_amount', {
                  initialValue: record.invoice_amount - record.tax_amount,
                })(<Input disabled={record.invoice_type === BSS_INV_TYPE[2].value} suffix="元" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('taxAmount')} {...formItemLayout}>
                {getFieldDecorator('tax_amount', {
                  initialValue: record.tax_amount,
                })(<Input suffix="元" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('includedAmount')} {...formItemLayout}>
                {getFieldDecorator('invoice_amount', {
                  initialValue: record.invoice_amount,
                  rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                })(<Input suffix="元" />)}
              </FormItem>
            </Col>
          </Row>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="details">
              <TabPane tab="发票明细" key="details">
                <FeeItemPane
                  feeItems={invoiceFees.map((item, index) => ({ ...item, feeIndex: index }))}
                  disabled
                />
              </TabPane>
              <TabPane tab="记账凭证" key="voucherEntries" disabled={action === 'request'}>
                <VoucherEntryPane form={this.props.form} />
              </TabPane>
            </Tabs>
          </Card>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('seller')} {...formItemLayout}>
                {getFieldDecorator(record.invoice_type === BSS_INV_TYPE[2].value ? 'seller_name' : 'seller_partner_id', {
                  initialValue: record.seller_partner_id || record.seller_name,
                })(<Select disabled={mode === 'input'} showSearch optionFilterProp="children">
                  {record.invoice_type === BSS_INV_TYPE[2].value ?
                    BSS_PRESET_PAYEE.map(item => (
                      <Option key={item.key} value={item.key}>{item.text}</Option>)) :
                    partners.filter(p => p.role === PARTNER_ROLES.VEN).map(p => (
                      <Option key={p.id} value={p.id}>{p.name}</Option>
                    ))
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('identificationNo')} {...formItemLayout}>
                <Input value={seller && seller.partner_unique_code} disabled />
              </FormItem>
            </Col>
            {mode === 'output' &&
            <Col span={8}>
              <FormItem label={this.msg('invoicedBy')} {...formItemLayout}>
                {getFieldDecorator('invoiced_by', {
                  initialValue: record.invoiced_by,
                  rules: [{ required: (action === 'confirm'), message: this.msg('pleaseInputInvoiceAmount') }],
                })(<Input disabled={action === 'request'} />)}
              </FormItem>
            </Col>}
            {mode === 'input' &&
            <Col span={8}>
              <FormItem label={this.msg('confirmedBy')} {...formItemLayout}>
                {getFieldDecorator('invoice_confirm_by', {
                  initialValue: record.invoice_confirm_by,
                  rules: [{ required: true, message: this.msg('pleaseSelectConfirmBy') }],
                })(<MemberSelect
                  memberOnly
                  style={{ width: '100%' }}
                  selectMembers={String(formData.invoice_confirm_by || '')}
                  onMemberChange={value => this.handleMemberChange(value, 'invoice_confirm_by')}
                  selectMode="single"
                />)}
              </FormItem>
            </Col>}
          </Row>
        </Form>
      </Modal>
    );
  }
}
