import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Col, DatePicker, Form, Modal, Row, Select, Input, Tabs } from 'antd';
import { toggleCspInvoiceModal, getInvoiceDetails } from 'common/reducers/bssInvoice';
import { BSS_PRESET_PAYEE } from 'common/constants';
import VoucherEntryPane from '../../common/voucherEntryPane';
import FeeItemPane from '../../common/feeItemPane';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssInvoice.cspInvoiceModal.visible,
    record: state.bssInvoice.cspInvoiceModal.record,
    invoiceFees: state.bssInvoice.invoiceFees,
  }),
  { toggleCspInvoiceModal, getInvoiceDetails },
)
@Form.create()
export default class CSPInvoiceModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    mode: PropTypes.oneOf(['input', 'output']),
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
    this.props.toggleCspInvoiceModal(false);
  };
  handleOk = () => {
    this.props.confirmBillInvoice([this.props.record.id]);
  };
  render() {
    const {
      visible,
      form: { getFieldDecorator },
      record,
      mode,
      action,
      invoiceFees,
    } = this.props;
    return (
      <Modal
        width={1000}
        maskClosable={false}
        title={this.msg('cspInvoice')}
        visible={visible}
        okText={this.msg('confirmInputInvoice')}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        style={{ top: 64 }}
      >
        <Form layout="horizontal" className="grid-form">
          <Row>
            <Col span={12}>
              <FormItem label={this.msg('缴款单位')} {...formItemLayout}>
                {getFieldDecorator('seller_name', {
                  initialValue: record.seller_name,
                  rules: [{ required: mode === 'output', message: this.msg('pleaseInputInvoiceAmount') }],
                })(<Select disabled showSearch optionFilterProp="children">
                  {BSS_PRESET_PAYEE.map(item => (
                    <Option key={item.key} value={item.key}>{item.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.msg('填发日期')} {...formItemLayout}>
                {getFieldDecorator('invoice_date', {
                  initialValue: record.invoice_date && moment(record.invoice_date),
                  rules: [{ required: true, message: this.msg('pleaseSelectInvoicedDate') }],
                })(<DatePicker disabled style={{ width: '100%' }} />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label={this.msg('invoiceNo')} {...formItemLayout}>
                {getFieldDecorator('invoice_no', {
                  initialValue: record.invoice_no,
                  rules: [{ required: (mode === 'input' || action === 'confirm'), message: this.msg('pleaseInputInvoiceNo') }],
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.msg('taxAmount')} {...formItemLayout}>
                {getFieldDecorator('tax_amount', {
                  initialValue: record.tax_amount,
                })(<Input disabled suffix="元" />)}
              </FormItem>
            </Col>
          </Row>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="details">
              <TabPane tab="缴款项目" key="details">
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
        </Form>
      </Modal>
    );
  }
}
