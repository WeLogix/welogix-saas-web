import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Form, Input, Select, Row, Col } from 'antd';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    owners: state.cwmContext.whseAttrs.owners,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  { }
)
@Form.create()
export default class QueryForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    onSearch: PropTypes.func.isRequired,
    filter: PropTypes.shape({ ownerCode: PropTypes.string }),
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultWhse !== this.props.defaultWhse) {
      this.props.form.resetFields();
    }
  }
  msg = formatMsg(this.props.intl);
  handleFormReset = () => {
    this.props.form.resetFields();
  }
  handleStockSearch = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const formData = this.props.form.getFieldsValue();
        this.props.onSearch(formData);
      }
    });
  }
  render() {
    const { form: { getFieldDecorator }, owners, filter } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const responsive = {
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 6 },
    };
    return (
      <Form className="form-layout-compact">
        <Row gutter={16}>
          <Col {...responsive}>
            <FormItem {...formItemLayout} label={this.msg('owner')}>
              {getFieldDecorator('ownerCode', {
                initialValue: filter.ownerCode,
                rules: [{ required: true }],
              })(<Select showSearch optionFilterProp="children" allowClear>
                {owners.map(owner =>
                  (<Option value={owner.customs_code} key={owner.id}>{owner.name}</Option>))}
              </Select>)}
            </FormItem>
          </Col>
          <Col {...responsive}>
            <FormItem {...formItemLayout} label={this.msg('ftzEntNo')}>
              {getFieldDecorator('entNo')(<Input />)}
            </FormItem>
          </Col>
          <Col {...responsive}>
            <FormItem {...formItemLayout} label={this.msg('ftzRelNo')}>
              {getFieldDecorator('relNo')(<Input />)}
            </FormItem>
          </Col>
          <Col {...responsive}>
            <span style={{ float: 'right' }}>
              <Button type="primary" onClick={this.handleStockSearch}>{this.msg('inquiry')}</Button>
              <Button onClick={this.handleFormReset}>{this.msg('reset')}</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}
