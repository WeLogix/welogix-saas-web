import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Select, Input, Tag } from 'antd';
import { loadAdaptors, addAdaptor, showAdaptorModal, hideAdaptorModal } from 'common/reducers/hubDataAdapter';
import { uuidWithoutDash } from 'client/common/uuid';
import { LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { formatMsg } from '../message.i18n';

const impModels = Object.values(LINE_FILE_ADAPTOR_MODELS);
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.hubDataAdapter.adaptorModal.visible,
    customers: state.partner.partners,
    pageSize: state.hubDataAdapter.adaptorList.pageSize,
    current: state.hubDataAdapter.adaptorList.current,
  }),
  {
    showAdaptorModal, hideAdaptorModal, addAdaptor, loadAdaptors,
  }
)
@Form.create()
export default class AdaptorModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideAdaptorModal();
    this.props.form.resetFields();
  }
  handleAddAdaptor = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const customer = this.props.customers.find(cus => cus.id === values.partner_id);
        const ownerTid = customer && customer.partner_tenant_id;
        this.props.addAdaptor({
          code: uuidWithoutDash(),
          name: values.name,
          model: values.biz_model,
          file_columns: values.file_columns,
          ownerPid: values.partner_id,
          ownerTid,
        }).then((result) => {
          if (!result.error) {
            this.handleCancel();
            this.props.loadAdaptors('', '', this.props.pageSize, this.props.current);
          }
        });
      }
    });
  }
  handleReload = (ownerPid) => {
    this.props.loadAdaptors(ownerPid, this.props.impModels.map(impm => impm.key));
  }

  render() {
    const { form: { getFieldDecorator }, visible, customers } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createAdapter')}
        onOk={this.handleAddAdaptor}
        onCancel={this.handleCancel}
        visible={visible}
        destroyOnClose
      >
        <Form layout="horizontal">
          <FormItem label={this.msg('adapterName')} {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: this.msg('nameRequired') }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('adapterBizModel')} {...formItemLayout}>
            {getFieldDecorator('biz_model', {
              rules: [{ required: true, message: this.msg('bizModelRequired') }],
            })(<Select>
              {impModels.map(mod =>
                <Option key={mod.key} value={mod.key}>{mod.name}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('relatedPartner')} {...formItemLayout}>
            {getFieldDecorator('partner_id', {
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
            >
              {customers.map(cus =>
                (<Option value={cus.id} key={cus.id}><Tag>{this.msg(cus.role)}</Tag>
                  {[cus.partner_code, cus.name].filter(cu => cu).join(' | ')}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('exampleFileMaxColumns')} {...formItemLayout}>
            {getFieldDecorator('file_columns')(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
