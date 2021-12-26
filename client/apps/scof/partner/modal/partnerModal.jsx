import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { AutoComplete, Checkbox, Modal, Form, Icon, Input, Select, Col, Button, message } from 'antd';
import { hidePartnerModal, checkPartner, addPartner, editPartner } from 'common/reducers/partner';
import { PARTNER_ROLES, BUSINESS_TYPES } from 'common/constants';
import CountryFlag from 'client/components/CountryFlag';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const fieldLabelMap = {};

function createFieldLabelMap(msg, role) {
  if (role === PARTNER_ROLES.CUS) {
    fieldLabelMap.name = msg('customerName');
    fieldLabelMap.partner_code = msg('customerCode');
  } else if (role === PARTNER_ROLES.VEN) {
    fieldLabelMap.name = msg('vendorName');
    fieldLabelMap.partner_code = msg('vendorCode');
  } else if (role === PARTNER_ROLES.SUP) {
    fieldLabelMap.name = msg('supplierName');
    fieldLabelMap.partner_code = msg('supplierCode');
  }
  fieldLabelMap.country = msg('country');
  fieldLabelMap.display_name = msg('displayName');
  fieldLabelMap.en_name = msg('englishName');
  fieldLabelMap.business_type = msg('businessType');
  fieldLabelMap.partner_unique_code = msg('uniqueCode');
  fieldLabelMap.partnerAddonCode = msg('addonCode');
  fieldLabelMap.customs_code = msg('customsCode');
  fieldLabelMap.contact = msg('contact');
  fieldLabelMap.phone = msg('phone');
  fieldLabelMap.email = msg('email');
  fieldLabelMap.virtual_whse = msg('virtualWhse');
  fieldLabelMap.remark = msg('remark');
}

@injectIntl
@connect(
  state => ({
    visible: state.partner.partnerModal.visible,
    partner: state.partner.partnerModal.partner,
    operation: state.partner.partnerModal.operation,
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
      code: tc.cntry_abbrev,
    })),
  }),
  {
    addPartner, editPartner, checkPartner, hidePartnerModal,
  }
)
@Form.create()
export default class PartnerModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    operation: PropTypes.oneOf(['add', 'edit']),
    addPartner: PropTypes.func.isRequired,
    checkPartner: PropTypes.func.isRequired,
    hidePartnerModal: PropTypes.func.isRequired,
    editPartner: PropTypes.func.isRequired,
    partner: PropTypes.shape({
      id: PropTypes.number,
      role: PropTypes.string.isRequired,
    }).isRequired,
    onOk: PropTypes.func,
  }
  state = {
    companies: [],
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.setState({ companies: [] });
    this.props.hidePartnerModal();
  }
  nameChooseConfirm = (foundName, partnerInfo) => {
    Modal.info({
      title: this.msg('uniqueCodeDuplicated'),
      content: `${foundName} 与 ${partnerInfo.name} 的唯一识别代码重复，可填写附加码加以区分`,
      onOk: () => { },
    });
  }
  handlePartnerErrorMsg = (error, partnerInfo) => {
    const errMsg = error.message;
    if (errMsg.key === 'partner_code_exist') {
      const { partner } = this.props;
      let partnerCodeLabel = '';
      let roleName = '';
      if (partner.role === PARTNER_ROLES.CUS) {
        partnerCodeLabel = 'customerCode';
        roleName = this.msg('customers');
      } else if (partner.role === PARTNER_ROLES.VEN) {
        partnerCodeLabel = 'vendorCode';
        roleName = this.msg('vendors');
      } else if (partner.role === PARTNER_ROLES.SUP) {
        partnerCodeLabel = 'supplierCode';
        roleName = this.msg('suppliers');
      }
      message.error(`${this.msg(partnerCodeLabel)}[${partnerInfo.partnerCode}]已对应${roleName}[${errMsg.conflictName}]`);
    } else {
      message.error(errMsg, 10);
    }
  }
  handleOk = (roleName) => {
    const { form, operation, partner } = this.props;
    form.validateFields((errs, formValues) => {
      if (!errs) {
        const partnerUniqueCode = formValues.partner_unique_code &&
          formValues.partner_unique_code.concat(formValues.partnerAddonCode || '');
        const partnerInfo = {
          ...formValues, role: partner.role, partner_unique_code: partnerUniqueCode,
        };
        if (formValues.business_type.indexOf('clearance') !== -1) {
          partnerInfo.business = 'CCB,FWD';
        }
        partnerInfo.business_type = formValues.business_type.join(',');
        if (operation === 'edit') {
          createFieldLabelMap(this.msg, this.props.partner.role);
          const opLogs = [];
          const fieldsValues = { ...formValues };
          fieldsValues.business_type = fieldsValues.business_type.join(',');
          fieldsValues.partner_unique_code = `${fieldsValues.partner_unique_code}${fieldsValues.partnerAddonCode}`;
          partner.partnerAddonCode =
            partner.partner_unique_code && partner.partner_unique_code.slice(18);
          const fields = Object.keys(fieldsValues);
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (partner[field] !== fieldsValues[field] &&
              !(!partner[field] && !fieldsValues[field])) {
              opLogs.push(`"${fieldLabelMap[field]}"由 [${partner[field] || ''}] 改为 [${fieldsValues[field] || ''}]`);
            }
          }
          this.props.editPartner(partner.id, partnerInfo, opLogs.length > 0 ? `编辑${roleName}信息 ${opLogs.join(';')}` : '').then((result) => {
            if (result.error) {
              this.handlePartnerErrorMsg(result.error, partnerInfo);
            } else {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
              this.props.onOk();
            }
          });
        } else if (formValues.partner_unique_code) {
          const { name } = partnerInfo;
          this.props.checkPartner({
            name,
            partnerCode: partnerInfo.partner_code,
            partnerUniqueCode: partnerInfo.partner_unique_code,
          }).then((result) => {
            if (result.data.partner) {
              this.nameChooseConfirm(result.data.partner.name, partnerInfo);
            } else {
              this.handleAddPartner(partnerInfo);
            }
          });
        } else {
          this.handleAddPartner(partnerInfo);
        }
      }
    });
  }
  handleAddPartner = (partnerInfo) => {
    this.props.addPartner(partnerInfo).then((result1) => {
      if (result1.error) {
        this.handlePartnerErrorMsg(result1.error, partnerInfo);
      } else {
        message.success(this.msg('savedSucceed'));
        this.handleCancel();
        this.props.onOk();
      }
    });
  }
  handleSearchCompany = () => {
    const name = this.props.form.getFieldValue('name');
    if (name && name.length > 1) {
      this.props.getCompanyInfo(name).then((result) => {
        if (result.data.Result) {
          message.success(this.msg('qichachaFoundCorp'));
          this.setState({ companies: result.data.Result });
        } else {
          message.warning(result.data.Message, 5);
        }
      });
    }
  }
  handleQiChaChaName = (value) => {
    const company = this.state.companies.find(item => item.Name === value);
    this.props.form.setFieldsValue({
      name: value, partner_unique_code: company.CreditCode,
    });
  }
  handleUnknownCountry = () => {
    this.props.form.setFieldsValue({
      country: 'ZZZ',
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, visible, partner, operation,
    } = this.props;
    if (!visible) {
      return null;
    }
    const { companies } = this.state;
    const country = getFieldValue('country') || partner.country;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let roleName = '';
    let partnerCodeLabel = '';
    let partnerNameLabel = '';
    if (partner.role === PARTNER_ROLES.CUS) {
      roleName = this.msg('customers');
      partnerCodeLabel = 'customerCode';
      partnerNameLabel = 'customerName';
    } else if (partner.role === PARTNER_ROLES.VEN) {
      roleName = this.msg('vendors');
      partnerCodeLabel = 'vendorCode';
      partnerNameLabel = 'vendorName';
    } else if (partner.role === PARTNER_ROLES.SUP) {
      roleName = this.msg('suppliers');
      partnerCodeLabel = 'supplierCode';
      partnerNameLabel = 'supplierName';
    }
    let title = '';
    if (operation === 'add') {
      title = `${this.msg('create')}${roleName}`;
    } else if (operation === 'edit') {
      title = `${this.msg('edit')}${roleName}${this.msg('profile')}`;
    }
    return (
      <Modal
        width={680}
        maskClosable={false}
        visible={visible}
        title={title}
        onCancel={this.handleCancel}
        onOk={() => this.handleOk(roleName)}
        destroyOnClose
      >
        <Form layout="horizontal" className="form-layout-compact">
          <FormItem
            {...formItemLayout}
            label={this.msg(partnerNameLabel)}
          >
            <Col span={18}>
              {getFieldDecorator('name', {
                  rules: [{
                  required: true,
                  message: this.msg('partnerNameRequired'),
                  }],
                  initialValue: partner.name,
                })(<AutoComplete
                  allowClear
                  onSelect={this.handleQiChaChaName}
                      // onSearch={this.handleSearchCompany}
                  placeholder={this.msg('qichachaCorpSearch')}
                >
                  {companies.map(item => (<AutoComplete.Option value={item.Name} key={item.Name}>
                    {item.Name}</AutoComplete.Option>))}
                </AutoComplete>)}
            </Col>
            <Col span={6}>
              <Button type="primary" ghost icon="search" disabled onClick={this.handleSearchCompany}>
                {this.msg('businessInfo')}
              </Button>
            </Col>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('country')}
          >
            <Col span={18}>
              {getFieldDecorator('country', {
                    initialValue: partner.country || 'CHN',
                    rules: [{
                      required: true,
                      message: this.msg('countryRequired'),
                      }],
                  })(<Select allowClear showSearch placeholder={this.msg('phCountry')}>
                    {this.props.countries.map(cntry =>
                      (<Option key={cntry.value} value={cntry.value}>
                        <CountryFlag code={cntry.value} /> {cntry.value} | {cntry.text}
                      </Option>))}
                  </Select>)}
            </Col>
            <Col span={6}>
              <a onClick={this.handleUnknownCountry}>{this.msg('unknownCountry')}</a>
            </Col>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('displayName')}
          >
            {getFieldDecorator('display_name', { initialValue: partner.display_name })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('englishName')}
          >
            {getFieldDecorator('en_name', { initialValue: partner.en_name })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg(partnerCodeLabel)}
          >
            {getFieldDecorator('partner_code', { initialValue: partner.partner_code })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('businessType')}
          >
            {getFieldDecorator('business_type', {
              initialValue: partner.business_type ? partner.business_type.split(',') : [],
              rules: [{
              required: partner.role === PARTNER_ROLES.VEN,
              message: this.msg('partnerBusinessTypeRequired'),
              }],
            })(<CheckboxGroup options={BUSINESS_TYPES} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('uniqueCode')}
            required={country === 'CHN' || (getFieldValue('business_type') && getFieldValue('business_type').indexOf('clearance') !== -1)}
          >
            <Col span={18}>
              <FormItem hasFeedback>
                {getFieldDecorator('partner_unique_code', {
                initialValue: partner.partner_unique_code
                  && partner.partner_unique_code.slice(0, 18),
                rules: [{
                  required: country === 'CHN' || (getFieldValue('business_type') && getFieldValue('business_type').indexOf('clearance') !== -1),
                  len: 18,
                  message: this.msg('uscCode18len'),
                }],
              })(<Input placeholder={this.msg('uscCode18len')} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('partnerAddonCode', {
                initialValue: partner.partner_unique_code && partner.partner_unique_code.slice(18),
                rules: [{
                  max: 6,
                  message: this.msg('addonCodeLen'),
                }],
              })(<Input placeholder={this.msg('addonCode')} />)}
              </FormItem>
            </Col>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('customsCode')}
            hasFeedback
          >
            {getFieldDecorator('customs_code', {
              initialValue: partner.customs_code,
              rules: [{
                required: getFieldValue('business_type') && getFieldValue('business_type').indexOf('clearance') !== -1,
                len: 10,
                message: this.msg('customsCode10len'),
              }],
            })(<Input placeholder={this.msg('customsCode10len')} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('contact')}
          >
            {getFieldDecorator('contact', {
                  initialValue: partner.contact,
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('phone')}
          >
            {getFieldDecorator('phone', {
                  initialValue: partner.phone,
                })(<Input type="tel" prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={this.msg('email')}
            hasFeedback
          >
            {getFieldDecorator('email', {
                  initialValue: partner.email,
                  rules: [{ type: 'email' }],
                })(<Input type="email" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </FormItem>
          {!(partner.role === PARTNER_ROLES.VEN) &&
          <FormItem
            {...formItemLayout}
            label={this.msg('virtualWhse')}
          >
            {getFieldDecorator('virtual_whse', {
              initialValue: partner.virtual_whse,
                })(<Input />)}
          </FormItem>}
          <FormItem
            {...formItemLayout}
            label={this.msg('remark')}
          >
            {getFieldDecorator('remark', {
              initialValue: partner.remark,
                })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
