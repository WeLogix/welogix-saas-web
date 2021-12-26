import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Col, DatePicker, Form, Row, Select, Input, Tabs, message } from 'antd';
import { toggleSettlementModal, createSettlement, setSettlementDetails, getSettlement, updateSettlement } from 'common/reducers/bssSettlement';
import { BSS_PAYMENT_METHOD, BSS_BIZ_TYPE, BSS_INV_TYPE, BSS_PRESET_PAYEE } from 'common/constants';
import FullscreenModal from 'client/components/FullscreenModal';
import { LogixIcon } from 'client/components/FontIcon';
import { MemberSelect, PartnerSelect } from 'client/components/ComboSelect';
import AccountSetSelect from '../../common/accountSetSelect';
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
const formItemSpan2Layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssSettlement.settlementModal.visible,
    record: state.bssSettlement.settlementModal.record,
    partners: state.partner.partners,
    currentAccountSet: state.bssSetting.currentAccountSet,
    settlementDetails: state.bssSettlement.settlementDetails,
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
  }),
  {
    toggleSettlementModal,
    createSettlement,
    setSettlementDetails,
    getSettlement,
    updateSettlement,
  },
)
@Form.create()
export default class SettlementModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.settlement_no && !this.props.record.settlement_no) {
      this.props.getSettlement(nextProps.record.settlement_no);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleSettlementModal(false);
    this.props.setSettlementDetails([{ feeIndex: 0 }]);
  };
  handleOk = () => {
    const { settlementDetails, form: { validateFields }, currentAccountSet } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const { partners, tenantId, record } = this.props;
        const settlementHead = { ...values };
        if (settlementHead.seller_partner_id) {
          const seller = partners.find(p => p.id === settlementHead.seller_partner_id);
          settlementHead.seller_tenant_id = seller.partner_tenant_id;
          settlementHead.seller_name = seller.name;
        }
        const buyer = partners.find(p => p.partner_tenant_id === tenantId);
        settlementHead.buyer_tenant_id = tenantId;
        settlementHead.buyer_name = buyer.name;
        settlementHead.buyer_partner_id = buyer.id;
        settlementHead.accounting_set_id = currentAccountSet.id;
        if (record.id) {
          this.props.updateSettlement(
            record.settlement_no,
            settlementHead,
            settlementDetails
          ).then((result) => {
            if (!result.error) {
              this.handleCancel();
              message.success(this.msg('savedSucceed'));
            }
          });
        } else {
          this.props.createSettlement(
            settlementHead,
            settlementDetails
          ).then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
        }
      }
    });
  };
  handlePartnerChange = (value) => {
    const { partners, form: { setFieldsValue } } = this.props;
    const vendor = partners.find(item => item.id === value);
    if (vendor) {
      setFieldsValue({
        seller_partner_id: vendor.id,
      });
    }
  }
  handleInvTypeChange = (value) => {
    const { form: { setFieldsValue }, settlementDetails } = this.props;
    if (value === BSS_INV_TYPE[2].value) {
      let taxAmount = 0;
      settlementDetails.forEach((detail) => {
        const pd = { ...detail };
        taxAmount += pd.tax || 0;
        pd.base_amount = null;
        pd.fee_code = null;
        pd.fee_name = null;
        pd.fee_type = null;
        pd.included_amount = null;
      });
      setFieldsValue({
        biz_type: BSS_BIZ_TYPE[1].value,
        seller_name: BSS_PRESET_PAYEE[0].key,
        invoice_amount: taxAmount,
      });
    }
  }
  handleMemberChange = (value) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      created_by: value,
    });
  }
  handlePaymentMethodChange = (value) => {
    const { form: { setFieldsValue } } = this.props;
    if (!value) {
      setFieldsValue({
        payee_account_no: null,
        payee_bank_name: null,
        payment_amount: null,
      });
    }
  }
  handleBizTypeChange = (value) => {
    const { form: { getFieldsValue } } = this.props;
    const bizType = getFieldsValue(['biz_type']);
    if (bizType && bizType !== value) {
      const settlementDetails = this.props.settlementDetails.map(detail => ({
        ...detail,
        biz_type: value,
        biz_no: null,
      }));
      this.props.setSettlementDetails(settlementDetails);
    }
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator, getFieldsValue },
      record,
      currentAccountSet,
      settlementDetails,
      loginId,
    } = this.props;
    const formData = getFieldsValue();
    return (
      <FullscreenModal
        maskClosable={false}
        title={this.msg('payableSettlement')}
        visible={visible}
        onSave={this.handleOk}
        onClose={this.handleCancel}
        destroyOnClose
      >
        <Form layout="horizontal" className="grid-form">
          <Card size="small">
            <Row>
              <Col span={6}>
                {formData.invoice_type === 3 ?
                  <FormItem label={this.msg('businessPartner')} {...formItemLayout}>
                    {getFieldDecorator('seller_name', {
                      initialValue: record.seller_name,
                      rules: [{ required: true, message: this.msg('pleaseSelectBusinessPartner') }],
                    })(<Select>
                      {BSS_PRESET_PAYEE.map(item => (
                        <Option key={item.key} value={item.key}>{item.text}</Option>
                      ))}
                    </Select>)}
                  </FormItem> :
                  <FormItem label={this.msg('businessPartner')} {...formItemLayout}>
                    {getFieldDecorator('seller_partner_id', {
                      initialValue: record.seller_partner_id,
                      rules: [{ required: true, message: this.msg('pleaseSelectBusinessPartner') }],
                    })(<PartnerSelect
                      paramPartners={this.props.partners}
                      showVen
                      selectedPartner={formData.seller_partner_id}
                      onPartnerChange={this.handlePartnerChange}
                      style={{ width: '100%' }}
                    />)}
                  </FormItem>}
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('bizType')} {...formItemLayout}>
                  {getFieldDecorator('biz_type', {
                    initialValue: record.biz_type,
                    rules: [{ required: true, message: this.msg('pleaseSelectBizType') }],
                  })(<Select
                    disabled={formData.invoice_type === BSS_INV_TYPE[2].value}
                    showSearch
                    optionFilterProp="children"
                    onChange={this.handleBizTypeChange}
                  >
                    {BSS_BIZ_TYPE.map(bizType => (
                      <Option value={bizType.value} key={bizType.key}>{bizType.text}</Option>
                    ))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoiceDate')} {...formItemLayout}>
                  {getFieldDecorator('invoice_date', {
                    initialValue: record.invoice_date && moment(record.invoice_date),
                    rules: [{ required: true, message: this.msg('pleaseSelectInvoiceDate') }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('settlementNo')} {...formItemLayout}>
                  {getFieldDecorator('settlement_no', {
                    initialValue: record.settlement_no,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoiceType')} {...formItemLayout}>
                  {getFieldDecorator('invoice_type', {
                    initialValue: record.invoice_type,
                    rules: [{ required: true, message: this.msg('pleaseSelectInvType') }],
                  })(<Select onChange={this.handleInvTypeChange} showSearch optionFilterProp="children">
                    {BSS_INV_TYPE.map(invType => (
                      <Option key={invType.key} value={invType.value}>{invType.text}</Option>
                    ))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoiceNo')} {...formItemLayout}>
                  {getFieldDecorator('invoice_no', {
                    initialValue: record.invoice_no,
                  })(<Input onChange={this.handleInvoiceAmountChange} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoiceTitle')} {...formItemLayout}>
                  {getFieldDecorator('invoice_title', {
                    initialValue: record.invoice_title || currentAccountSet.company_name,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoiceAmount')} {...formItemLayout}>
                  {getFieldDecorator('invoice_amount', {
                    initialValue: record.invoice_amount,
                    rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                  })(<Input prefix={<LogixIcon type="icon-rmb" />} type="number" suffix="元" disabled />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="payableItems" tabBarExtraContent={<Button>{this.msg('import')}</Button>}>
              <TabPane tab={this.msg('payableItems')} key="payableItems">
                <FeeItemPane
                  form={this.props.form}
                  invType={formData.invoice_type}
                  bizType={formData.biz_type}
                  feeItems={settlementDetails}
                  onFeeItemChange={this.props.setSettlementDetails}
                />
              </TabPane>
              <TabPane tab={this.msg('voucherEntries')} key="voucherEntries">
                <VoucherEntryPane form={this.props.form} />
              </TabPane>
            </Tabs>
          </Card>
          {!record.id && <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('paymentMethod')} {...formItemLayout}>
                  {getFieldDecorator('payment_method', {
                    initialValue: record.payment_method,
                  })(<Select onChange={this.handlePaymentMethodChange} allowClear showSearch optionFilterProp="children">
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
                  })(<Input disabled={!formData.payment_method} prefix={<LogixIcon type="icon-rmb" />} suffix="元" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('payeeBankName')} {...formItemLayout}>
                  {getFieldDecorator('payee_bank_name', {
                    initialValue: record.payee_bank_name,
                  })(<Select disabled={!formData.payment_method} showSearch optionFilterProp="children">
                    <Option key="BOC" value="BOC">中国银行</Option>
                    <Option key="CMB" value="CMB">招商银行</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('payeeAccountNo')} {...formItemLayout}>
                  {getFieldDecorator('payee_account_no', {
                    initialValue: record.payee_account_no,
                  })(<Input disabled={!formData.payment_method} />)}
                </FormItem>
              </Col>
            </Row>
          </Card>}
          <Card size="small">
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('accountingSet')} {...formItemLayout}>
                  <AccountSetSelect />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('invoicedBy')} {...formItemLayout}>
                  {getFieldDecorator('created_by', {
                    initialValue: record.created_by ? String(record.created_by) : String(loginId),
                    rules: [{ required: true, message: this.msg('pleaseSelectInvoicedBy') }],
                  })(<MemberSelect
                    onMemberChange={this.handleMemberChange}
                    memberOnly
                    disabled
                    selectMode="single"
                    selectMembers={formData.created_by || String(loginId)}
                    style={{ width: '100%' }}
                  />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('remark')} {...formItemSpan2Layout}>
                  {getFieldDecorator('remark', {
                    initialValue: record.remark,
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
