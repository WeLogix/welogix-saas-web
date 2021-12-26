import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, message, Modal, DatePicker, Select, Alert } from 'antd';
import { showPublishQuoteModal, publishQuote } from 'common/reducers/transportTariff';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.transportTariff.publishTariffModal.visible,
    agreement: state.transportTariff.agreement,
  }),
  { publishQuote, showPublishQuoteModal }
)
@Form.create()
export default class PublishTariffModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    publishQuote: PropTypes.func.isRequired,
    showPublishQuoteModal: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = descriptor => formatMsg(this.props.intl, descriptor)

  handleCancel = () => {
    this.props.showPublishQuoteModal(false);
  }
  handlePublish = () => {
    const formData = this.props.form.getFieldsValue();
    const { quoteNo } = this.props.agreement;
    this.props.publishQuote({
      quoteNo,
      effectiveType: formData.effectiveType,
      effectiveDate: formData.effectiveDate,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('运输报价费率，更新发布');
        this.handleCancel();
      }
    });
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        maskClosable={false}
        title="确认修改"
        onCancel={this.handleCancel}
        onOk={this.handlePublish}
        visible={this.props.visible}
      >
        <Form className="row" >
          <Alert message="输入生效条件：将按照输入的具体生效时间来重新计费" type="info" showIcon />
          <FormItem label="基准日期类型" {...formItemLayout}>
            {getFieldDecorator('effectiveType', {
            })(<Select >
              <Option value="pickupEstDate">{this.msg('pickupEstDate')}</Option>
              <Option value="deliverEstDate">{this.msg('deliverEstDate')}</Option>
            </Select>)}
          </FormItem>
          <FormItem label="生效起始时间" {...formItemLayout}>
            {getFieldDecorator('effectiveDate', {
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />)}
          </FormItem>
          {/* <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('publishCommit', {
            })(<Input.TextArea />)}
          </FormItem> */}
        </Form>
      </Modal>
    );
  }
}
