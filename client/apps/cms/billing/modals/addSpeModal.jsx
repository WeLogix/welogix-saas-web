import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Input, Modal, Form, Select } from 'antd';
import { loadAllFeeGroups, toggleAddSpecialModal } from 'common/reducers/bssSetting';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssSetting.addSpeModal.visible,
    allFeeGroups: state.bssSetting.allFeeGroups,
    feeCodes: state.bssSetting.addSpeModal.feeCodes,
    expenseNo: state.bssSetting.addSpeModal.expenseNo,
    tabName: state.bssSetting.addSpeModal.tabName,
  }),
  { toggleAddSpecialModal, loadAllFeeGroups }
)
@Form.create()
export default class AddSpeModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    expenseNo: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
    feeCodes: PropTypes.arrayOf(PropTypes.string),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadAllFeeGroups();
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleAddSpecialModal(false, {});
  }
  handleOk = () => {
    const { expenseNo, tabName } = this.props;
    this.props.form.validateFields((errors, formValues) => {
      if (!errors) {
        this.props.addSpecialFee({
          fee_code: formValues.fee_code,
          fee_name: formValues.fee_name,
          amount: parseFloat(formValues.orig_amount),
          fee_group: formValues.fee_group,
          remark: formValues.remark,
        }, expenseNo, `"${tabName}"添加特殊费用[${formValues.fee_code || 'SPF'}]`).then((result) => {
          if (!result.error) {
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, allFeeGroups, feeCodes,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newSpecialFee')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div>
          <FormItem label={this.msg('feeCode')} {...formItemLayout}>
            {getFieldDecorator('fee_code', {
            })(<Select
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {feeCodes.map(code => <Option key={code.code} value={code.code}>{`${code.code}|${code.name}`}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('speName')} {...formItemLayout}>
            {getFieldDecorator('fee_name', {
              initialValue: '特殊费用',
              rules: [{ required: true, message: '费用名称必填' }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('origAmount')} {...formItemLayout}>
            {getFieldDecorator('orig_amount', {
              rules: [{ required: true, message: '费用金额必填' }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('feeGroup')} {...formItemLayout}>
            {getFieldDecorator('fee_group', {
            })(<Select showSearch optionFilterProp="children" style={{ width: '100%' }}>
              {allFeeGroups.map(data =>
              (<Option key={data.fee_group_code} value={data.fee_group_code}>
                {`${data.fee_group_code}|${data.fee_group_name}`}
              </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('remark')} {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '必须备注原因' }],
            })(<Input />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

