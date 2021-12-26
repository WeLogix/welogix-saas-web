import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Select } from 'antd';
import { toggleQuoteSwitchModal, getAvailQuotesByExpense, switchExpQuote } from 'common/reducers/cmsExpense';
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
    visible: state.cmsExpense.quoteSwitchModal.visible,
    quoteSwitchModal: state.cmsExpense.quoteSwitchModal,
  }),
  { toggleQuoteSwitchModal, getAvailQuotesByExpense, switchExpQuote }
)
@Form.create()
export default class QuoteSwitchModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      this.props.getAvailQuotesByExpense(nextProps.quoteSwitchModal.expenseNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleQuoteSwitchModal(false, {});
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.switchExpQuote(
          this.props.quoteSwitchModal.expenseNo,
          values.quote_no,
        ).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, quoteSwitchModal: { quotes },
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('switchQuote')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div>
          <FormItem label={this.msg('quote')} {...formItemLayout}>
            {getFieldDecorator('quote_no', {
            })(<Select
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {quotes.map(quote =>
                (<Option
                  key={quote.quote_no}
                  value={quote.quote_no}
                >
                  {quote.quote_no}|{quote.quote_name}
                </Option>))}
            </Select>)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

