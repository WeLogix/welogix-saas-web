
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Row, Col, Input, Select, message } from 'antd';
import { loadContainers, saveContainer, updateContainer, toggleContainersModal } from 'common/reducers/cmsManifest';
import { CMS_CNTNR_SPEC_CUS, CMS_CONFIRM } from 'common/constants';
import { formatMsg } from '../../delegation/message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(state => ({
  containersModal: state.cmsManifest.containersModal,
}), {
  loadContainers, saveContainer, updateContainer, toggleContainersModal,
})
@Form.create()
export default class ContainersModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    containersModal: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
    }).isRequired,
    saveContainer: PropTypes.func.isRequired,
    toggleContainersModal: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleContainersModal(false);
    this.props.form.resetFields();
  }
  handleOk = () => {
    const { form, delgNo, preEntrySeqNo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const data = {
          container_id: values.container_id,
          container_wt: values.container_wt,
          container_spec: values.container_spec,
          decl_g_no_list: values.decl_g_no_list,
          lcl_flag: values.lcl_flag,
          delg_no: delgNo,
          pre_entry_seq_no: preEntrySeqNo,
        };
        const { containerRecord } = this.props.containersModal;
        const promise = containerRecord.id ?
          this.props.updateContainer(data, containerRecord.id) : this.props.saveContainer(data);
        promise.then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      containersModal: { visible, containerRecord, gNoList },
      form: { getFieldDecorator },
      preEntrySeqNo,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal width={960} title={this.msg('conatinersModal')} visible={visible} maskClosable={false} onCancel={this.handleCancel} onOk={this.handleOk}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('containerId')}>
                {getFieldDecorator('container_id', {
                  initialValue: containerRecord.container_id || '',
                  rules: [
                    { required: true, message: '集装箱号为必填项' },
                    { pattern: new RegExp(/^[A-Z]{3}U\d{7}$/g), message: '集装箱号格式为3位大写字母+U+7位数字' },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('containerMd')}>
                {getFieldDecorator('container_spec', {
                  initialValue: containerRecord.container_spec || '',
                  rules: [
                    { required: true, message: '集装箱规格为必填项' },
                  ],
                })(<Select allowClear showSearch optionFilterProp="children">
                  {CMS_CNTNR_SPEC_CUS.map(opt =>
                    (<Option value={opt.value} key={opt.value}>{opt.value} | {opt.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('lclFlag')}>
                {getFieldDecorator('lcl_flag', {
                  initialValue: containerRecord.lcl_flag || '',
                  rules: [
                    { required: true, message: '拼箱标识为必填项' },
                  ],
                })(<Select allowClear showSearch optionFilterProp="children">
                  {CMS_CONFIRM.map(opt =>
                    (<Option value={opt.value} key={opt.value}>{opt.value} | {opt.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('goodsContaWt')}>
                {getFieldDecorator('container_wt', {
                  initialValue: containerRecord.container_wt || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label={preEntrySeqNo ? this.msg('copDeclGNo') : this.msg('copDelgGNo')}>
                {getFieldDecorator('decl_g_no_list', {
                  type: 'array',
                  initialValue: containerRecord.decl_g_no_list ?
                    containerRecord.decl_g_no_list.split(',').map(f => parseInt(f, 10)) : [],
                })(<Select allowClear showSearch optionFilterProp="children" mode="multiple">
                  { preEntrySeqNo ?
                    gNoList.map(opt =>
                      (<Option value={opt.g_no} key={opt.g_no}>
                        {opt.g_no} | {opt.hscode} | {opt.g_name}</Option>)) :
                    gNoList.map(opt =>
                      (<Option value={opt.value} key={opt.value}>
                        {opt.value} | {opt.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
