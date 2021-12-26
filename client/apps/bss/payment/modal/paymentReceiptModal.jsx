import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Col, DatePicker, Form, Radio, Row, Select, Input, Tabs } from 'antd';
import { togglePaymentReceiptModal } from 'common/reducers/bssPayment';
import { BSS_PAYMENT_METHOD } from 'common/constants';
import FullscreenModal from 'client/components/FullscreenModal';
import { LogixIcon } from 'client/components/FontIcon';
import { MemberSelect, PartnerSelect } from 'client/components/ComboSelect';
import AccountSetSelect from '../../common/accountSetSelect';
import SettlementPane from '../settlementPane';
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
    visible: state.bssPayment.paymentReceiptModal.visible,
    mode: state.bssPayment.paymentReceiptModal.mode,
    record: state.bssPayment.paymentReceiptModal.record,
    partners: state.partner.partners,
  }),
  { togglePaymentReceiptModal },
)
@Form.create()
export default class PaymentReceiptModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.togglePaymentReceiptModal(false);
  };
  handleOk = () => {};
  render() {
    const {
      visible,
      form: { getFieldDecorator },
      record,
      mode,
    } = this.props;
    let extra = null;
    if (mode === 'approve') {
      extra = <Button type="primary">审批通过</Button>;
    } else if (mode === 'confirm') {
      extra = <Button type="primary">生成凭证</Button>;
    }
    const activeTab = mode === 'confirm' ? 'voucherEntries' : 'settlements';
    return (
      <FullscreenModal
        maskClosable={false}
        title={this.msg('paymentReceipt')}
        visible={visible}
        onSave={mode === 'edit' && this.handleOk}
        onClose={this.handleCancel}
        extra={extra}
        destroyOnClose
      >
        <Form layout="horizontal" className="grid-form">
          <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('往来单位')} {...formItemLayout}>
                  {getFieldDecorator('payee', {
                    initialValue: record.payee,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<PartnerSelect
                    paramPartners={this.props.partners}
                    showVen
                    style={{ width: '100%' }}
                  />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('收款类型')} {...formItemLayout}>
                  {getFieldDecorator('payment_type', {
                    initialValue: record.payment_type,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<Radio.Group buttonStyle="solid">
                    <Radio.Button value={2}>
                        应收款
                    </Radio.Button>
                    <Radio.Button value={1}>
                        预收款
                    </Radio.Button>
                  </Radio.Group>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('单据日期')} {...formItemLayout}>
                  {getFieldDecorator('voucher_date', {
                    initialValue: record.voucher_date,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('收款单号')} {...formItemLayout}>
                  {getFieldDecorator('payment_no', {
                    initialValue: record.payment_no || 'FK-201904-0001',
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('支付方式')} {...formItemLayout}>
                  {getFieldDecorator('payment_method', {
                    initialValue: record.payment_method,
                  })(<Select showSearch optionFilterProp="children">
                    {
                    BSS_PAYMENT_METHOD.map(method =>
                      <Option key={method.key}>{method.text}</Option>)
                    }
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('收款金额')} {...formItemLayout}>
                  {getFieldDecorator('payment_amount', {
                    initialValue: record.payment_amount,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<Input prefix={<LogixIcon type="icon-rmb" />} suffix="元" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('对方开户银行')} {...formItemLayout}>
                  {getFieldDecorator('payee_account_bank', {
                    initialValue: record.payee_account_bank,
                  })(<Select showSearch optionFilterProp="children">
                    <Option key="VAT_S" value="VAT_S">
                        中国银行
                    </Option>
                    <Option key="VAT_N" value="VAT_N">
                        招商银行
                    </Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('对方银行账号')} {...formItemLayout}>
                  {getFieldDecorator('payee_account_no', {
                    initialValue: record.payee_account_no,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey={activeTab}>
              <TabPane tab="核销结算单" key="settlements">
                <SettlementPane form={this.props.form} />
              </TabPane>
              <TabPane tab="核销明细" key="feeItems">
                <FeeItemPane form={this.props.form} />
              </TabPane>
              <TabPane tab="凭证分录" key="voucherEntries">
                <VoucherEntryPane form={this.props.form} />
              </TabPane>
            </Tabs>
          </Card>
          <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('结算账套')} {...formItemLayout}>
                  {getFieldDecorator('account_set', {
                    initialValue: record.account_set,
                  })(<AccountSetSelect />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('申请人')} {...formItemLayout}>
                  {getFieldDecorator('created_by', {
                    initialValue: record.created_by,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<MemberSelect memberOnly disabled style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('审批人')} {...formItemLayout}>
                  {getFieldDecorator('approved_by', {
                    initialValue: record.approved_by,
                  })(<MemberSelect memberOnly disabled style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('备注')} {...formItemLayout}>
                  {getFieldDecorator('remark', {
                    initialValue: record.remark,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('收款账户')} {...formItemLayout}>
                  {getFieldDecorator('pay_account', {
                    initialValue: record.pay_account,
                  })(<Select />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('收款人')} {...formItemLayout}>
                  {getFieldDecorator('paid_by', {
                    initialValue: record.paid_by,
                  })(<MemberSelect memberOnly disabled style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('银行单据号')} {...formItemLayout}>
                  {getFieldDecorator('bank_voucher_no', {
                    initialValue: record.bank_voucher_no,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </FullscreenModal>
    );
  }
}
