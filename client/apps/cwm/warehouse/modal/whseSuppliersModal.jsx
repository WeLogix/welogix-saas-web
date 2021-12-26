import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Input, Form, Select } from 'antd';
import { toggleSupplierModal, addSupplier, loadSuppliers, updateSupplier, loadwhseOwners } from 'common/reducers/cwmWarehouse';
import { getSuppliers } from 'common/reducers/cwmReceive';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.name = msg('name');
  fieldLabelMap.code = msg('code');
  fieldLabelMap.customs_code = msg('customs');
  fieldLabelMap.ftz_whse_code = msg('ftzWhseCodeCustomCode');
  fieldLabelMap.owner_partner_id = msg('relatedOwner');
}

@injectIntl
@connect(
  state => ({
    whseOwners: state.cwmWarehouse.whseOwners,
    visible: state.cwmWarehouse.supplierModal.visible,
    supplier: state.cwmWarehouse.supplierModal.supplier,
  }),
  {
    toggleSupplierModal, addSupplier, loadSuppliers, updateSupplier, loadwhseOwners, getSuppliers,
  }
)

@Form.create()
export default class SuppliersModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    ownerPartnerId: PropTypes.number,
  }
  componentDidMount() {
    this.props.loadwhseOwners(this.props.whseCode);
    createFieldLabelMap(this.msg);
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleSupplierModal(false);
    this.props.form.resetFields();
  }
  handleAdd = () => {
    const {
      whseCode, supplier, ownerPartnerId, whseOwners,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (supplier.id) {
          const fields = Object.keys(values);
          const contentLog = [];
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (supplier[field] !== values[field] &&
              !(!supplier[field] && !values[field])) {
              if (field === 'owner_partner_id') {
                const value = whseOwners.find(owner => owner.owner_partner_id === values[field]) &&
                  whseOwners.find(owner => owner.owner_partner_id === values[field]).owner_name;
                const oldValue =
                  whseOwners.find(owner => owner.owner_partner_id === supplier[field]) &&
                  whseOwners.find(owner => owner.owner_partner_id === supplier[field]).owner_name;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${supplier[field] || ''}] 改为 [${values[field] || ''}]`);
              }
            }
          }
          this.props.updateSupplier(values, supplier.id, whseCode, contentLog.length > 0 ? `修改供货商[${supplier.code}]信息, ${contentLog.join(';')}` : '').then((result) => {
            if (!result.error) {
              this.props.loadSuppliers(whseCode);
              this.handleCancel();
            }
          });
        } else {
          this.props.addSupplier(values, whseCode).then((result) => {
            if (!result.error) {
              this.props.loadSuppliers(whseCode);
              if (ownerPartnerId) {
                this.props.getSuppliers(whseCode, ownerPartnerId);
              }
              this.handleCancel();
            }
          });
        }
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, whseOwners, ownerPartnerId, supplier,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }; return (
      <Modal maskClosable={false} title={`${supplier && supplier.id ? '编辑' : '添加'}供货商`} visible={visible} onCancel={this.handleCancel} onOk={this.handleAdd}>
        <Form layout="horizontal">
          <FormItem label={fieldLabelMap.name} {...formItemLayout}>
            {getFieldDecorator('name', { rules: [{ required: true }], initialValue: supplier.name })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.code} {...formItemLayout}>
            {getFieldDecorator('code', { rules: [{ required: true }], initialValue: supplier.code })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.customs_code} {...formItemLayout}>
            {getFieldDecorator('customs_code', { initialValue: supplier.customs_code })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.ftz_whse_code} {...formItemLayout}>
            {getFieldDecorator('ftz_whse_code', { initialValue: supplier.ftz_whse_code })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.owner_partner_id} {...formItemLayout}>
            {getFieldDecorator('owner_partner_id', {
              initialValue: ownerPartnerId,
              rules: [{ required: true }],
            })(<Select
              id="select"
              showSearch
              placeholder=""
              optionFilterProp="children"
              notFoundContent=""
              disabled={!!ownerPartnerId}
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
