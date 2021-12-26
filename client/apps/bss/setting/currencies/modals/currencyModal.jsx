import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, message, Select } from 'antd';
import { toggleNewExRateModal, addExRate } from 'common/reducers/bssExRateSettings';
import CountryFlag from 'client/components/CountryFlag';
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
    visible: state.bssExRateSettings.visibleExRateModal,
    currencies: state.saasParams.latest.currency,
  }),
  { toggleNewExRateModal, addExRate }
)
@Form.create()
export default class NewExRateModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleNewExRateModal(false);
  }
  handleOk = () => {
    const data = this.props.form.getFieldsValue();
    this.props.addExRate({
      currency: data.currency,
      base_currency: data.base_currency,
      exchange_rate: data.exchange_rate,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.props.toggleNewExRateModal(false);
        this.props.reload();
      }
    });
  }

  render() {
    const { visible, currencies, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('addCopExRate')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem label="币制" {...formItemLayout} >
            {getFieldDecorator('currency', {
              rules: [{ required: true }],
            })(<Select showSearch optionFilterProp="children">
              {currencies.map(currency =>
                (<Option key={currency.curr_code} value={currency.curr_code}>
                  <CountryFlag code={currency.curr_code} currency /> {currency.curr_name}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label="本币" {...formItemLayout} >
            {getFieldDecorator('base_currency', {
              initialValue: 'CNY',
              rules: [{ required: true }],
            })(<Select showSearch optionFilterProp="children">
              {currencies.map(currency =>
                (<Option key={currency.curr_code} value={currency.curr_code}>
                  <CountryFlag code={currency.curr_code} currency /> {currency.curr_name}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label="汇率" {...formItemLayout} >
            {getFieldDecorator('exchange_rate', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
