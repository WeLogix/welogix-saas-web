import React, { Component } from 'react';
import { Alert, Modal, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePermitModelModal, addPermitModel, loadPermitModels } from 'common/reducers/cmsPermit';
import { intlShape, injectIntl } from 'react-intl';

import { formatMsg } from '../message.i18n';


const FormItem = Form.Item;
@injectIntl
@connect(
  state => ({
    visible: state.cmsPermit.permitModelModal.visible,
  }),
  { togglePermitModelModal, addPermitModel, loadPermitModels }
)
export default class PermitModelModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    permitId: PropTypes.number.isRequired,
  }
  state = {
    model: '',
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.togglePermitModelModal(false);
    this.setState({
      model: '',
    });
  }
  handleChange = (e) => {
    this.setState({
      model: e.target.value,
    });
  }
  handleOk = () => {
    const { permitId, modelSeq } = this.props;
    const { model } = this.state;
    if (!model) {
      message.info('型号不能为空');
    } else {
      this.props.addPermitModel(permitId, model, modelSeq).then((result) => {
        if (!result.error) {
          this.props.loadPermitModels(permitId);
          this.handleCancel();
        }
      });
    }
  }
  render() {
    const { visible } = this.props;
    const { model } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal title={this.msg('addModel')} visible={visible} onCancel={this.handleCancel} onOk={this.handleOk}>
        <Alert message="若无特定型号可填写星号: *" type="info" />
        <FormItem label={this.msg('model')} {...formItemLayout}>
          <Input value={model} placeholder="例: MODEL-1234XXX (X代表字母、数字或空白)" onChange={this.handleChange} />
        </FormItem>
      </Modal>
    );
  }
}
