import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Select } from 'antd';
import { toggleFeeSelectModal, getExpenseBillingGroupFees, toggleFeesWriteInModal } from 'common/reducers/cmsExpense';
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
    visible: state.cmsExpense.feeCatModal.visible,
    feeCats: state.cmsExpense.feeCatModal.feeCats,
  }),
  { toggleFeeSelectModal, getExpenseBillingGroupFees, toggleFeesWriteInModal }
)
@Form.create()
export default class BillingFeeSelectModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    type: PropTypes.string.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.getExpenseBillingGroupFees(this.props.type);
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleFeeSelectModal(false);
  }
  handleOk = () => {
    const { feeCats } = this.props;
    const feeCodes = this.props.form.getFieldValue('fee_type');
    const selectFeeCats = feeCats.filter(cat => feeCodes.includes(cat.fee_code));
    this.props.toggleFeesWriteInModal(true, selectFeeCats);
    this.handleCancel();
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, feeCats,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('writeInFees')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <FormItem label={this.msg('feeCat')} {...formItemLayout}>
          {getFieldDecorator('fee_type', {
              rules: [{ required: true, message: this.msg('pleaseSelectFeeType') }],
          })(<Select
            showSearch
            optionFilterProp="children"
            mode="multiple"
            style={{ width: '100%' }}
          >
            {feeCats.map(cat =>
              <Option value={cat.fee_code} key={cat.fee_code}>{cat.fee_name}</Option>)}
          </Select>)}
        </FormItem>
      </Modal>
    );
  }
}

