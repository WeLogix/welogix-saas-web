import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Input, Modal, message, Form, Radio, Select } from 'antd';
import { toggleQuoteCreateModal, createQuote, cloneQuote } from 'common/reducers/cmsQuote';
import { QUOTE_TYPE, PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@injectIntl
@connect(
  state => ({
    visible: state.cmsQuote.visibleCreateModal,
    originQuoteData: state.cmsQuote.quoteCreateModal,
    partners: state.partner.partners,
  }),
  {
    toggleQuoteCreateModal, createQuote, cloneQuote,
  }
)
@Form.create()
export default class CreateQuoteModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    partners: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleQuoteCreateModal(false, null);
  }
  handleOk = () => {
    const { form, originQuoteData } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        if (values.quote_name === originQuoteData.quote_name) {
          form.setFields({
            quote_name: {
              value: `${originQuoteData.quote_name}-复制`,
              errors: null,
            },
          });
        }
        const field = form.getFieldsValue();
        const quote = {
          quote_partner_id: Number(field.partnerId),
          quote_type: field.quote_type,
          quote_name: field.quote_name,
        };
        let prom = null;
        if (originQuoteData.origin_quote_no) {
          prom = this.props.cloneQuote({
            ...quote,
            origin_quote_no: originQuoteData.origin_quote_no,
          });
        } else {
          prom = this.props.createQuote(quote);
        }
        prom.then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.toggleQuoteCreateModal(false, null);
            const { quoteNo } = result.data;
            this.context.router.push(`/clearance/billing/quote/${quoteNo}`);
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, originQuoteData,
    } = this.props;
    const titleMsg = originQuoteData.origin_quote_no ? 'cloneQuote' : 'createQuote';
    const { form } = this.props;
    const quoteType = form.getFieldValue('quote_type') || this.props.originQuoteData.quote_type;
    let partnerList = [];
    let partnerLabel = '';
    let partnerId = '';
    const { partners } = this.props;
    if (quoteType === 'sales') {
      partnerList = partners.filter(pt => pt.role === PARTNER_ROLES.CUS);
      partnerLabel = this.msg('client');
      partnerId = originQuoteData.buyer_partner_id ? String(originQuoteData.buyer_partner_id) : '';
    } else if (quoteType === 'cost') {
      partnerList = partners.filter(pt => pt.role === PARTNER_ROLES.VEN);
      partnerLabel = this.msg('provider');
      partnerId = originQuoteData.seller_partner_id ? String(originQuoteData.seller_partner_id) : '';
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg(titleMsg)}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div>
          <FormItem label={this.msg('quoteType')} {...formItemLayout}>
            {getFieldDecorator('quote_type', {
              rules: [{ required: true, message: '报价类型必选' }],
              initialValue: originQuoteData.quote_type,
            })(<RadioGroup>
              {
                QUOTE_TYPE.map(qt =>
                  <RadioButton value={qt.value} key={qt.value}>{qt.text}</RadioButton>)
              }
            </RadioGroup>)}
          </FormItem>
          <FormItem label={partnerLabel} {...formItemLayout}>
            {getFieldDecorator('partnerId', {
              rules: [{ required: true, message: '必选' }],
              initialValue: partnerId,
            })(<Select
              showSearch
              showArrow
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {
                partnerList.map(pt => (
                  <Option
                    value={String(pt.id)}
                    key={String(pt.id)}
                  >{pt.partner_code ? `${pt.partner_code} | ${pt.name}` : pt.name}
                  </Option>))
              }
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('quoteName')} {...formItemLayout}>
            {getFieldDecorator('quote_name', {
              rules: [{ required: true, message: '报价名称必填' }],
              initialValue: originQuoteData.quote_name,
            })(<Input />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

