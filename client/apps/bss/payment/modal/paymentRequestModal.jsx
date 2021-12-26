import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Col, DatePicker, Form, Radio, Row, Select, Input, Tabs, message } from 'antd';
import {
  togglePaymentRequestModal, setPaymentDetails, createPayment, setSettlements, getPayment,
  updatePaymentHead, confirmPayment, updatePayment,
} from 'common/reducers/bssPayment';
import { loadAccountSetAccounts } from 'common/reducers/bssSetting';
import { BSS_PAYMENT_METHOD, BSS_PRESET_PAYEE, PARTNER_ROLES } from 'common/constants';
import FullscreenModal from 'client/components/FullscreenModal';
import { LogixIcon } from 'client/components/FontIcon';
import { MemberSelect } from 'client/components/ComboSelect';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
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
    visible: state.bssPayment.paymentRequestModal.visible,
    mode: state.bssPayment.paymentRequestModal.mode,
    record: state.bssPayment.paymentRequestModal.record,
    partners: state.partner.partners,
    paymentDetails: state.bssPayment.paymentDetails,
    settlements: state.bssPayment.settlements,
    accountSetAccounts: state.bssSetting.accountSetAccounts,
    currentAccountSet: state.bssSetting.currentAccountSet,
    tenantId: state.account.tenantId,
    userMembers: state.account.userMembers,
  }),
  {
    togglePaymentRequestModal,
    setPaymentDetails,
    createPayment,
    loadAccountSetAccounts,
    setSettlements,
    getPayment,
    updatePaymentHead,
    confirmPayment,
    updatePayment,
  },
)
@Form.create()
export default class PaymentRequestModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  componentWillReceiveProps(nextProps) {
    if ((this.props.currentAccountSet.id !== nextProps.currentAccountSet.id)) {
      this.props.loadAccountSetAccounts(nextProps.currentAccountSet.id);
    }
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      if (nextProps.mode === 'new') {
        this.props.setPaymentDetails([{ feeIndex: 0 }]);
        this.props.setSettlements([{ settlemtIndex: 0 }]);
      }
      if (nextProps.mode !== 'new') {
        this.props.getPayment(nextProps.record.payment_no);
      }
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.togglePaymentRequestModal(false);
  };
  handleOk = () => {
    const {
      form: { validateFields, isFieldTouched }, currentAccountSet, settlements, paymentDetails,
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        if (paymentDetails.length === 1 && !paymentDetails[0].biz_type) {
          message.warn('请添加明细');
          return;
        }
        const { partners, tenantId, record } = this.props;
        const paymentHead = { ...values };
        paymentHead.accounting_set_id = currentAccountSet.id;
        const seller = partners.find(p => p.name === paymentHead.payee);
        if (seller) {
          paymentHead.seller_tenant_id = seller.partner_tenant_id;
          paymentHead.seller_partner_id = seller.id;
        }
        const payment = {};
        if (paymentHead.payment_type === 2) {
          payment.settlenos = settlements.map(settlemt => settlemt.settlement_no);
        } else {
          payment.paymentDetails = paymentDetails;
        }
        if (record.id) {
          const newPaymentInfo = {};
          const fields = Object.keys(paymentHead);
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (isFieldTouched(field)) {
              newPaymentInfo[field] = paymentHead[field];
            }
          }
          newPaymentInfo.seller_tenant_id = paymentHead.seller_tenant_id;
          newPaymentInfo.seller_partner_id = paymentHead.seller_partner_id;
          newPaymentInfo.payee = paymentHead.payee;
          newPaymentInfo.request_by = paymentHead.request_by;
          newPaymentInfo.approval_by = paymentHead.approval_by;
          payment.newPaymentInfo = newPaymentInfo;
          this.props.updatePayment(payment, record.id).then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
        } else {
          const buyer = partners.find(p => p.partner_tenant_id === tenantId);
          paymentHead.buyer_tenant_id = tenantId;
          paymentHead.buyer_name = buyer.name;
          paymentHead.buyer_partner_id = buyer.id;
          payment.paymentHead = paymentHead;
          this.props.createPayment(payment).then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
        }
      }
    });
  };
  handleMemberChange = (value, field) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      [field]: value,
    });
  }
  handlePaymentTypeChange = (e) => {
    this.props.setPaymentDetails([{ feeIndex: 0 }]);
    if (e.target.value === 1) {
      this.props.setSettlements([{ settlemtIndex: 0 }]);
    }
  }
  handleApprove = () => {
    const { record } = this.props;
    this.props.updatePaymentHead(record.id, { approval_status: true }).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  confirmPayment = () => {
    const { record, form: { getFieldsValue }, userMembers } = this.props;
    const paymentInfo = getFieldsValue(['payment_account', 'payer', 'bank_receipt_no', 'trade_amount']);
    const user = userMembers.find(um => um.login_id === Number(paymentInfo.payer));
    if (user) {
      paymentInfo.payer = user.name;
    }
    this.props.confirmPayment(record.payment_no, record.payment_type, paymentInfo)
      .then((result) => {
        if (!result.error) {
          this.handleCancel();
        }
      });
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator, getFieldsValue },
      record,
      mode,
      partners,
      paymentDetails,
      accountSetAccounts,
    } = this.props;
    const formData = getFieldsValue();
    let extra = null;
    if (mode === 'approve') {
      extra = <Button onClick={this.handleApprove} type="primary">审批通过</Button>;
    } else if (mode === 'confirm') {
      extra = <Button onClick={this.confirmPayment} type="primary">生成凭证</Button>;
    }
    const activeTab = mode === 'confirm' ? 'voucherEntries' : 'settlements';
    const disabled = record.approval_status || mode === 'approve';
    return (
      <FullscreenModal
        maskClosable={false}
        title={this.msg('paymentRequest')}
        visible={visible}
        onSave={(mode === 'edit' || mode === 'new') && this.handleOk}
        onClose={this.handleCancel}
        extra={extra}
        destroyOnClose
      >
        <Form layout="horizontal" className="grid-form">
          <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('businessPartner')} {...formItemLayout}>
                  {getFieldDecorator('payee', {
                    initialValue: record.payee,
                    rules: [{ required: true, message: this.msg('pleaseSelectBusinessPartner') }],
                  })(<Select disabled={disabled}>
                    {BSS_PRESET_PAYEE.map(item => (
                      <Option key={item.key} value={item.key}>{item.text}</Option>
                    ))}
                    {partners.filter(p => p.role === PARTNER_ROLES.VEN).map(p => (
                      <Option key={p.id} value={p.name}>{p.name}</Option>
                    ))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('paymentType')} {...formItemLayout}>
                  {getFieldDecorator('payment_type', {
                    initialValue: record.payment_type || 2,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<Radio.Group disabled={disabled} onChange={this.handlePaymentTypeChange} buttonStyle="solid">
                    <Radio.Button value={2}>
                      {this.msg('accountPayable')}
                    </Radio.Button>
                    <Radio.Button value={1}>
                      {this.msg('advancePayment')}
                    </Radio.Button>
                  </Radio.Group>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('voucherDate')} {...formItemLayout}>
                  {getFieldDecorator('voucher_date', {
                    initialValue: record.voucher_date && moment(record.voucher_date),
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<DatePicker disabled={disabled} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('paymentNo')} {...formItemLayout}>
                  {getFieldDecorator('payment_no', {
                    initialValue: record.payment_no,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('paymentMethod')} {...formItemLayout}>
                  {getFieldDecorator('payment_method', {
                    initialValue: record.payment_method,
                  })(<Select disabled={disabled} showSearch optionFilterProp="children">
                    {
                    BSS_PAYMENT_METHOD.map(method =>
                      <Option key={method.key} value={method.value}>{method.text}</Option>)
                    }
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('paymentAmount')} {...formItemLayout}>
                  {getFieldDecorator('payment_amount', {
                    initialValue: record.payment_amount,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<Input disabled={disabled} prefix={<LogixIcon type="icon-rmb" />} suffix="元" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('payeeBankName')} {...formItemLayout}>
                  {getFieldDecorator('payee_bank_name', {
                    initialValue: record.payee_bank_name,
                  })(<Select disabled={disabled} showSearch optionFilterProp="children">
                    <Option key="BOC" value="BOC">
                        中国银行
                    </Option>
                    <Option key="CMB" value="CMB">
                        招商银行
                    </Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('payeeAccountNo')} {...formItemLayout}>
                  {getFieldDecorator('payee_account_no', {
                    initialValue: record.payee_account_no,
                  })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey={activeTab}>
              <TabPane tab="核销结算单" key="settlements">
                <SettlementPane
                  form={this.props.form}
                  paymentType={formData.payment_type}
                  disabled={disabled}
                />
              </TabPane>
              <TabPane tab="核销明细" key="feeItems">
                <FeeItemPane
                  form={this.props.form}
                  feeItems={paymentDetails}
                  onFeeItemChange={this.props.setPaymentDetails}
                  paymentType={formData.payment_type}
                  disabled={disabled}
                />
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
                  <AccountSetSelect disabled={disabled} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('requestBy')} {...formItemLayout}>
                  {getFieldDecorator('request_by', {
                    initialValue: record.request_by,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<MemberSelect
                    memberOnly
                    style={{ width: '100%' }}
                    selectMembers={String(formData.request_by || '')}
                    onMemberChange={value => this.handleMemberChange(value, 'request_by')}
                    selectMode="single"
                    memberDisabled={disabled}
                  />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('approvalBy')} {...formItemLayout}>
                  {getFieldDecorator('approval_by', {
                    initialValue: record.approval_by,
                  })(<MemberSelect
                    memberOnly
                    style={{ width: '100%' }}
                    selectMembers={String(formData.approval_by || '')}
                    onMemberChange={value => this.handleMemberChange(value, 'approval_by')}
                    selectMode="single"
                    memberDisabled={disabled}
                  />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('remark')} {...formItemLayout}>
                  {getFieldDecorator('payment_remark', {
                    initialValue: record.payment_remark,
                  })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          {record.approval_status === 1 &&
            <PrivilegeCover module="bss" feature="payment" action="edit">
              <Card size="small">
                <Row>
                  <Col span={6}>
                    <FormItem label={this.msg('paymentAccount')} {...formItemLayout}>
                      {getFieldDecorator('payment_account', {
                        initialValue: record.payment_account,
                      })(<Select>
                        {accountSetAccounts.map(account => (
                          <Option key={account.id} value={account.name}>{account.name}</Option>
                        ))}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label={this.msg('payer')} {...formItemLayout}>
                      {getFieldDecorator('payer', {
                        initialValue: record.payer,
                      })(<MemberSelect
                        memberOnly
                        style={{ width: '100%' }}
                        selectMembers={formData.payer}
                        onMemberChange={value => this.handleMemberChange(value, 'payer')}
                        selectMode="single"
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label={this.msg('bankReceiptNo')} {...formItemLayout}>
                      {getFieldDecorator('bank_receipt_no', {
                        initialValue: record.bank_receipt_no,
                      })(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label={this.msg('tradeAmount')} {...formItemLayout}>
                      {getFieldDecorator('trade_amount', {
                        initialValue: record.trade_amount,
                      })(<Input />)}
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </PrivilegeCover>
          }
        </Form>
      </FullscreenModal>
    );
  }
}
