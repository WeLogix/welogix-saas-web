import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Select, Input } from 'antd';
import { toggleBizExportTemplateModal, createBizExportTemplate, loadBizExportTemplates, updateBizExportTemplate } from 'common/reducers/hubDataAdapter';
import { LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const impModels = Object.values(LINE_FILE_ADAPTOR_MODELS);
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.hubDataAdapter.templateModal.visible,
    bizExportAdapter: state.hubDataAdapter.templateModal.bizExportAdapter,
    pageSize: state.hubDataAdapter.adapterList.pageSize,
    current: state.hubDataAdapter.adapterList.current,
  }),
  {
    toggleBizExportTemplateModal,
    createBizExportTemplate,
    loadBizExportTemplates,
    updateBizExportTemplate,
  }
)
@Form.create()
export default class CreateModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleBizExportTemplateModal(false);
    this.props.form.resetFields();
  }
  handleAddBizExportTemplate = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        if (this.props.bizExportAdapter.id) {
          this.props.updateBizExportTemplate({
            model: values.biz_model,
            headFields: values.head_fields,
            bodyFields: values.body_fields,
            id: this.props.bizExportAdapter.id,
          }).then((result) => {
            if (!result.error) {
              this.handleCancel();
              this.props.loadBizExportTemplates({
                pageSize: this.props.pageSize,
                current: this.props.current,
                filter: {},
              });
            }
          });
        } else {
          this.props.createBizExportTemplate({
            name: values.name,
            model: values.biz_model,
            headFields: values.head_fields,
            bodyFields: values.body_fields,
          }).then((result) => {
            if (!result.error) {
              this.handleCancel();
              this.props.loadBizExportTemplates({
                pageSize: this.props.pageSize,
                current: this.props.current,
                filter: {},
              });
            }
          });
        }
      }
    });
  }
  render() {
    const { form: { getFieldDecorator }, visible, bizExportAdapter } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let thead = [];
    let tbody = [];
    const bizModel = this.props.form.getFieldValue('biz_model');
    if (bizModel) {
      const { columns } = impModels.find(model => model.key === bizModel);
      thead = columns.filter(column => column.thead);
      tbody = columns.filter(column => column.tbody);
    } else if (bizExportAdapter.biz_model) {
      const { columns } = impModels.find(model => model.key === bizExportAdapter.biz_model);
      thead = columns.filter(column => column.thead);
      tbody = columns.filter(column => column.tbody);
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createBizExportTemplate')}
        onOk={this.handleAddBizExportTemplate}
        onCancel={this.handleCancel}
        visible={visible}
        destroyOnClose
      >
        <Form layout="horizontal">
          <FormItem label={this.msg('templateName')} {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: this.msg('nameRequired') }],
              initialValue: bizExportAdapter ? bizExportAdapter.name : '',
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('adapterBizModel')} {...formItemLayout}>
            {getFieldDecorator('biz_model', {
              rules: [{ required: true, message: this.msg('bizModelRequired') }],
              initialValue: bizExportAdapter ? bizExportAdapter.biz_model : '',
            })(<Select
              disabled={!!this.props.bizExportAdapter.id}
            >
              {impModels.map(mod =>
                <Option key={mod.key} value={mod.key}>{mod.name}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('headFields')} {...formItemLayout}>
            {getFieldDecorator('head_fields', {
              initialValue: bizExportAdapter.head_fields ? bizExportAdapter.head_fields.split(',') : [],
            })(<Select
              allowClear
              mode="multiple"
              onChange={this.handleTheadSelect}
              maxTagCount={5}
            >
              {thead.map(head =>
                <Option value={head.field} key={head.field}>{head.label}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('bodyFields')} {...formItemLayout}>
            {getFieldDecorator('body_fields', {
            initialValue: bizExportAdapter.body_fields ? bizExportAdapter.body_fields.split(',') : [],
            })(<Select
              allowClear
              mode="multiple"
              onChange={this.handleTbodySelect}
              maxTagCount={5}
            >
              {tbody.map(body =>
                <Option value={body.field} key={body.field}>{body.label}</Option>)}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
