import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message } from 'antd';
import { toggleNewFeeGroupModal, addFeeGroup } from 'common/reducers/bssSetting';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssSetting.visibleNewFeeGModal,
    feeGroups: state.bssSetting.feeGroupslist.data,
  }),
  { toggleNewFeeGroupModal, addFeeGroup }
)
@Form.create()
export default class NewFeeGroupModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleNewFeeGroupModal(false);
  }
  handleOk = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const repeat = this.props.feeGroups.filter(gp =>
          gp.fee_group_code === values.fee_group_code)[0];
        if (repeat) {
          message.error('费用分组代码已存在，请勿重复添加', 6);
        } else {
          this.props.addFeeGroup({
            groupCode: values.fee_group_code,
            groupName: values.fee_group_name,
          }).then((result) => {
            if (result.error) {
              message.error(result.error.message, 5);
            } else {
              this.props.toggleNewFeeGroupModal(false);
              this.props.reload();
            }
          });
        }
      }
    });
  }

  render() {
    const { visible, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newFeeGroup')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label="分组代码" {...formItemLayout} >
            {getFieldDecorator('fee_group_code', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label="分组名称" {...formItemLayout}>
            {getFieldDecorator('fee_group_name', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
