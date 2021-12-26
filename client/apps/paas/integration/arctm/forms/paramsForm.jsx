import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Button, Form, Select, Input, Col, Row, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { updateArCtmApp } from 'common/reducers/hubIntegration';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

const OpenapiHost = API_ROOTS.openapi;

const fixHttpSchema = (url) => {
  if (!url) {
    return '';
  }
  url.trim();
  let schema = 'http';
  let colonPos = 4;
  // https:// http://
  const httpsch = url.slice(0, 4);
  if (httpsch === 'http') {
    const isS = url[4] === 's';
    if (isS) {
      schema = 'https';
      colonPos = 5;
    }
  } else {
    colonPos = url.indexOf(':');
    if (colonPos === -1) {
      colonPos = 0;
    }
  }
  while (url[colonPos] === ':' || url[colonPos] === '/') {
    colonPos += 1;
  }
  const hostPart = url.slice(colonPos);
  return `${schema}://${hostPart}`;
};

@injectIntl
@connect(
  state => ({
    flows: state.scofFlow.partnerFlows,
    partners: state.partner.partners,
  }),
  { updateArCtmApp, loadPartners, loadPartnerFlowList }
)
@Form.create()
export default class ParamsForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({ customer_partner_id: PropTypes.number }),
    partners: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }
  componentDidMount() {
    this.props.loadPartners({ role: PARTNER_ROLES.CUS });
    const customerPartnerId = this.props.formData.customer_partner_id;
    if (customerPartnerId) {
      this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCustomerChange = (customerPartnerId) => {
    this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
  }
  handleHookCopy = (hookUrl) => {
    if (window.clipboardData && window.clipboardData.setData) {
      window.clipboardData.setData('text/plain', hookUrl);
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const textarea = document.createElement('textarea');
      textarea.textContent = hookUrl;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy'); // Security exception may be thrown by some browsers.
      } catch (ex) {
        message.error('接口地址已复制失败');
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
    message.info('接口地址已复制');
    return true;
  }
  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      const customer = this.props.partners.filter(pt => pt.id === values.customer_partner_id)[0];
      const arctm = {
        org_code: values.org_code,
        customer_partner_id: values.customer_partner_id,
        customer_tenant_id: customer && customer.partner_tenant_id,
        customer_name: customer && customer.name,
        user: values.username,
        password: values.password,
        ws_outboundcdf_url: fixHttpSchema(values.ws_outboundcdf_url),
        webservice_305_url: fixHttpSchema(values.webservice_305_url),
        flow_id: values.flow_id,
        uuid: this.props.formData.uuid,
      };
      this.props.updateArCtmApp(arctm).then((result) => {
        if (result.error) {
          if (result.error.message === 'arc-exist') {
            message.error(`${values.org_code}与${values.username}配置已存在`, 10);
          } else {
            message.error(result.error.message, 10);
          }
        } else {
          message.success('保存成功');
        }
      });
    });
  }
  render() {
    const {
      partners, flows, formData, form: { getFieldDecorator },
    } = this.props;
    const hookUrl = `${OpenapiHost}ar/hook/v2`;
    return (
      <Form>
        <Row gutter={16}>
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('ctmCustomerOrgCode')}>
              {getFieldDecorator('org_code', {
                rules: [{ required: true, message: 'CTM客户ORG代码必填' }],
                initialValue: formData.ctm_customer_org_code,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('customerNo')}>
              {getFieldDecorator('customer_partner_id', {
                rules: [{ required: true, message: 'CTM客户必填' }],
                initialValue: formData.customer_partner_id,
              })(<Select optionFilterProp="children" placeholder="选择客户" onChange={this.handleCustomerChange}>
                {partners.map(pt => (<Option key={String(pt.id)} value={pt.id}>
                  {pt.partner_code}|{pt.name}
                </Option>))}
              </Select>)}
            </FormItem>
          </Col>
          <Col sm={24} lg={24}>
            <FormItem label="货运流程参数">
              {getFieldDecorator('flow_id', {
                rules: [{ required: true, message: '客户流程必填' }],
                initialValue: formData.flow_id,
              })(<Select showSearch allowClear>
                {flows.map(data => <Option key={data.id} value={data.id}>{data.name}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('username')}>
              {getFieldDecorator('username', {
                initialValue: formData.user,
                rules: [{ required: true, message: '用户名必填' }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('password')}>
              {getFieldDecorator('password', {
                initialValue: formData.password,
                rules: [{ required: true, message: '密码必填' }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={24}>
            <FormItem label={this.msg('hookUrl')} >
              <Input
                defaultValue={hookUrl}
                addonAfter={<a onClick={() => this.handleHookCopy(hookUrl)}><Icon type="copy" /></a>}
                readOnly
              />
            </FormItem>
          </Col>
          <Col sm={24} lg={24}>
            <FormItem label={this.msg('webserviceCDFUrl')}>
              {getFieldDecorator('ws_outboundcdf_url', {
                rules: [{ required: true, message: 'CDF回执webservice地址必填' }],
                initialValue: formData.ws_outboundcdf_url || 'https://stage.easytms.net/webservice/InboundWebService.aspx',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={24}>
            <FormItem label={this.msg('webservice305Url')}>
              {getFieldDecorator('webservice_305_url', {
                rules: [{ required: true, message: '时间状态回执webservice地址必填' }],
                initialValue: formData.webservice_305_url || 'https://stage.easytms.net/webservice/InboundWebService.aspx',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem>
              <Button type="primary" icon="save" onClick={this.handleSave}>{this.msg('save')}</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
