import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import { updateAccountSet } from 'common/reducers/bssSetting';
import FormPane from 'client/components/FormPane';
import { BSS_ACCOUNT_SET_VAT_TAX } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(state => ({
  currentAccountSet: state.bssSetting.currentAccountSet,
}), {
  updateAccountSet,
})
export default class AccountSetPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
    }),
  }

  msg = formatMsg(this.props.intl);
  handleSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.updateAccountSet(values, this.props.currentAccountSet.id).then((result) => {
          if (!result.error) {
            message.success(this.msg('savedSucceed'));
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, currentAccountSet,
    } = this.props;
    return (
      <FormPane>
        <Row gutter={16}>
          <Col sm={24} lg={8}>
            <FormItem label={this.msg('单位名称')}>
              {getFieldDecorator('company_name', {
                initialValue: currentAccountSet.company_name,
                rules: [{ required: true, message: this.msg('parameterRequired') }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={8}>
            <FormItem label={this.msg('统一社会信用代码')}>
              {getFieldDecorator('company_unique_code', {
                initialValue: currentAccountSet.company_unique_code,
                rules: [{ required: true, message: this.msg('parameterRequired') }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={8}>
            <FormItem label={this.msg('增值税种类')}>
              {getFieldDecorator('vat_cat', {
                initialValue: currentAccountSet.vat_cat,
                rules: [{ required: true, message: this.msg('parameterRequired') }],
              })(<Select>
                {BSS_ACCOUNT_SET_VAT_TAX.map(item => (
                  <Option key={item.value} value={item.value}>{item.text}</Option>
                ))}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              <Button type="primary" icon="save" onClick={this.handleSave}>
                {this.msg('save')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </FormPane>
    );
  }
}
