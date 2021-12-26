import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message, Select } from 'antd';
import { toggleNewFeeElementModal, addFeeElement } from 'common/reducers/bssSetting';
import { BSS_FEE_TYPE, BSS_FEE_ALLOC_RULE } from 'common/constants';
import { formatMsg } from '../../message.i18n';


const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    elementModal: state.bssSetting.visibleNewElementModal,
  }),
  { toggleNewFeeElementModal, addFeeElement }
)
@Form.create()
export default class NewFeeElementModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleNewFeeElementModal({ visible: false });
  }
  handleOk = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { elementModal } = this.props;
        this.props.addFeeElement({
          parent_fee_code: elementModal.parentFeeCode ? elementModal.parentFeeCode : null,
          fee_code: values.fee_code,
          fee_name: values.fee_name,
          fee_type: values.fee_type,
          fee_group: values.fee_group,
          apportion_rule: values.apportion_rule,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            this.props.toggleNewFeeElementModal({ visible: false });
            this.props.reload();
          }
        });
      }
    });
  }

  render() {
    const { elementModal, feeGroups, form: { getFieldDecorator } } = this.props;
    const title = elementModal.parentFeeCode ? this.msg('newChildFeeElement') : this.msg('newFeeElement');
    const editable = !elementModal.parentFeeCode;
    return (
      <Modal
        maskClosable={false}
        title={title}
        visible={elementModal.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label="费用元素代码" {...formItemLayout} >
            {getFieldDecorator('fee_code', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label="费用元素名称" {...formItemLayout} >
            {getFieldDecorator('fee_name', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label="费用类型" {...formItemLayout} >
            {getFieldDecorator('fee_type', {
              initialValue: elementModal.parentFeeType,
              rules: [{ required: true }],
            })(<Select disabled={!editable} >
              {BSS_FEE_TYPE.filter(ft => ft.key !== 'SP').map(type =>
                <Option key={type.key} value={type.key}>{`${type.key}|${type.text}`}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label="分摊规则" {...formItemLayout} >
            {getFieldDecorator('apportion_rule', {
              initialValue: elementModal.parentApportionRule || 'CD', // 默认平均分摊
              rules: [{ required: true }],
            })(<Select disabled={!editable} >
              {BSS_FEE_ALLOC_RULE.map(type =>
                <Option key={type.key} value={type.key}>{`${type.key}|${type.text}`}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label="所属分组" {...formItemLayout} >
            {getFieldDecorator('fee_group', {
              initialValue: elementModal.parentFeeGroup,
            })(<Select showSearch disabled={!editable} optionFilterProp="children">
              {feeGroups.map(data =>
                <Option key={data.key} value={data.key}>{`${data.key}|${data.text}`}</Option>)}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
