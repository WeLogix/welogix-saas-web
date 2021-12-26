import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Input, Form, Select } from 'antd';
import { toggleCarrierModal, addCarrier, loadCarriers, updateCarrier } from 'common/reducers/cwmWarehouse';
import { PARTNER_ROLES, PARTNER_BUSINESSE_TYPES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.name = msg('name');
  fieldLabelMap.code = msg('code');
  fieldLabelMap.customs_code = msg('customs');
  fieldLabelMap.owner_partner_id = msg('relatedOwner');
}

@injectIntl
@connect(
  state => ({
    whseOwners: state.cwmWarehouse.whseOwners,
    visible: state.cwmWarehouse.carrierModal.visible,
    carrier: state.cwmWarehouse.carrierModal.carrier,
    partners: state.partner.partners.filter(pt =>
      (pt.role === PARTNER_ROLES.VEN || pt.role === PARTNER_ROLES.OWN) &&
      pt.business_type.indexOf(PARTNER_BUSINESSE_TYPES.transport) !== -1),
  }),
  {
    toggleCarrierModal, addCarrier, loadCarriers, updateCarrier,
  }
)

@Form.create()

export default class SuppliersModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible && nextProps.carrier.id) {
      this.props.form.setFieldsValue(nextProps.carrier);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleCarrierModal(false);
    this.props.form.resetFields();
  }
  handleAdd = () => {
    const {
      whseCode, whseOwners, carrier,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const ownerTenantId = whseOwners.find(owner =>
          owner.owner_partner_id === values.owner_partner_id).owner_tenant_id;
        if (carrier.id) {
          const fields = Object.keys(values);
          const contentLog = [];
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (carrier[field] !== values[field] &&
              !(!carrier[field] && !values[field])) {
              if (field === 'owner_partner_id') {
                const value = whseOwners.find(owner => owner.owner_partner_id === values[field]) &&
                  whseOwners.find(owner => owner.owner_partner_id === values[field]).owner_name;
                const oldValue =
                  whseOwners.find(owner => owner.owner_partner_id === carrier[field]) &&
                  whseOwners.find(owner => owner.owner_partner_id === carrier[field]).owner_name;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${carrier[field] || ''}] 改为 [${values[field] || ''}]`);
              }
            }
          }
          this.props.updateCarrier(values, carrier.id, whseCode, contentLog.length > 0 ? `修改承运人[${carrier.code}]信息, ${contentLog.join(';')}` : '').then(() => {
            this.props.loadCarriers(whseCode);
            this.props.toggleCarrierModal(false);
            this.props.form.resetFields();
          });
        } else {
          this.props.addCarrier(values, whseCode, ownerTenantId).then((result) => {
            if (!result.error) {
              this.props.loadCarriers(whseCode);
              this.props.toggleCarrierModal(false);
              this.props.form.resetFields();
            }
          });
        }
      }
    });
  }
  handleSelect = (value) => {
    const { partners, form } = this.props;
    const carrier = partners.find(partner => partner.name === value);
    form.setFieldsValue({
      name: carrier.name,
      code: carrier.partner_unique_code,
      customs_code: carrier.customs_code,
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, whseOwners, partners, carrier,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }; return (
      <Modal maskClosable={false} title={`${carrier && carrier.id ? '编辑' : '添加'}承运人`} visible={visible} onCancel={this.handleCancel} onOk={this.handleAdd}>
        <Form layout="horizontal">
          {visible && <FormItem label={fieldLabelMap.name} required {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true }],
              initialValue: carrier.name,
            })(<Select mode="combobox" style={{ width: '100%' }} onSelect={this.handleSelect}>
              {partners.map(partner =>
                (<Option value={partner.name} key={partner.name}>{partner.name}</Option>))}
            </Select>)}
          </FormItem>}
          <FormItem label={fieldLabelMap.code} {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.customs_code} {...formItemLayout}>
            {getFieldDecorator('customs_code')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.owner_partner_id} {...formItemLayout}>
            {getFieldDecorator('owner_partner_id', {
              rules: [{ required: true }],
            })(<Select
              id="select"
              showSearch
              placeholder=""
              optionFilterProp="children"
              notFoundContent=""
            >
              {
                  whseOwners.map(pt => (
                    <Option
                      searched={`${pt.owner_code}${pt.owner_name}`}
                      value={pt.owner_partner_id}
                      key={pt.owner_partner_id}
                    >
                      {pt.owner_code ? `${pt.owner_code} | ${pt.owner_name}` : pt.owner_name}
                    </Option>))
                }
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
