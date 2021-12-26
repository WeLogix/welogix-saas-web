import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Select, Checkbox, Modal, Icon, Input, Button, Form, Tabs, message } from 'antd';
import { connect } from 'react-redux';
import { showOpenApiConfigModal, updateDevAppSetting, genOAuthToken } from 'common/reducers/hubDevApp';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.hubDevApp.openapiConfigModal.visible,
    app: state.hubDevApp.app,
    flows: state.scofFlow.partnerFlows,
    partners: state.partner.partners,
    userMembers: state.account.userMembers,
  }),
  {
    showOpenApiConfigModal, updateDevAppSetting, genOAuthToken, loadPartners, loadPartnerFlowList,
  }
)
@Form.create()
export default class AppOpenApiModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    orderCreate: { enabled: false, customer_partner_id: null, flow_id: null },
    invoiceCreate: { enabled: false, owner_partner_id: null, own_by: null },
    token: null,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      let customerPartnerId;
      if (nextProps.app.openapi) {
        const openapi = JSON.parse(nextProps.app.openapi);
        let orderCreateApi = openapi['order.create'];
        if (orderCreateApi) {
          orderCreateApi.enabled = true;
          customerPartnerId = orderCreateApi.customer_partner_id;
        } else {
          orderCreateApi = { enabled: false };
        }
        let invoiceCreateApi = openapi['invoice.create'];
        if (invoiceCreateApi) {
          invoiceCreateApi.enabled = true;
        } else {
          invoiceCreateApi = { enabled: false };
        }
        this.setState({
          orderCreate: {
            enabled: orderCreateApi.enabled,
            customer_partner_id: orderCreateApi.customer_partner_id,
            flow_id: orderCreateApi.flow_id,
          },
          invoiceCreate: {
            enabled: invoiceCreateApi.enabled,
            owner_partner_id: invoiceCreateApi.owner_partner_id,
            own_by: invoiceCreateApi.own_by,
          },
        });
      }
      this.setState({ token: nextProps.app.access_token });
      this.props.loadPartners({ role: PARTNER_ROLES.CUS });
      this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
    }
  }
  msg = formatMsg(this.props.intl);
  handleOrderCreateCheck =(ev) => {
    let orderCreate = { ...this.state.orderCreate };
    orderCreate.enabled = ev.target.checked;
    if (!orderCreate.enabled) {
      orderCreate = { enabled: false };
    }
    this.setState({ orderCreate });
  }
  handleOrderCustomerChange = (customerPartnerId) => {
    const orderCreate = { ...this.state.orderCreate };
    orderCreate.customer_partner_id = customerPartnerId;
    this.setState({ orderCreate });
    this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
  }
  handleFlowChange = (flowId) => {
    const orderCreate = { ...this.state.orderCreate };
    orderCreate.flow_id = flowId;
    this.setState({ orderCreate });
  }
  handleOAuthTokenGen = () => {
    const { app } = this.props;
    this.props.genOAuthToken(app.app_id, app.app_secret).then((result) => {
      if (!result.error) {
        message.success('授权Token生成成功');
        this.setState({ token: result.data.access_token });
      }
    });
  }
  handleInvoiceCreateCheck = (ev) => {
    let invoiceCreate = { ...this.state.invoiceCreate };
    invoiceCreate.enabled = ev.target.checked;
    if (!invoiceCreate.enabled) {
      invoiceCreate = { enabled: false };
    }
    this.setState({ invoiceCreate });
  }
  handleInvoicePartnerChange = (partnerId) => {
    const invoiceCreate = { ...this.state.invoiceCreate };
    invoiceCreate.owner_partner_id = partnerId;
    this.setState({ invoiceCreate });
  }
  handleOwnerChange = (loginId) => {
    const invoiceCreate = { ...this.state.invoiceCreate };
    invoiceCreate.own_by = loginId;
    this.setState({ invoiceCreate });
  }
  handleCancel = () => {
    this.props.showOpenApiConfigModal(false);
    this.setState({ orderCreate: { enabled: false }, token: null });
  }
  handleOk = () => {
    const { orderCreate, invoiceCreate } = this.state;
    const { app } = this.props;
    const openapi = {};
    if (orderCreate.enabled) {
      if (!orderCreate.flow_id) {
        message.error('请配置订单创建流程参数');
        return;
      }
      openapi['order.create'] = {
        customer_partner_id: orderCreate.customer_partner_id,
        flow_id: orderCreate.flow_id,
      };
    }
    if (invoiceCreate.enabled) {
      if (!invoiceCreate.own_by) {
        message.error('请配置发票导入负责人');
        return;
      }
      openapi['invoice.create'] = {
        owner_partner_id: invoiceCreate.owner_partner_id,
        own_by: invoiceCreate.own_by,
      };
    }
    this.props.updateDevAppSetting({ openapi: JSON.stringify(openapi) }, app.id).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  render() {
    const {
      visible, partners, flows, userMembers,
    } = this.props;
    const { orderCreate, invoiceCreate, token } = this.state;
    return (
      <Modal
        title="OPENAPI配置"
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        destroyOnClose
        width={800}
        style={{ top: 24 }}
        bodyStyle={{ padding: 0 }}
        maskClosable={false}
      >
        <Tabs
          defaultActiveKey="info"
          tabPosition="left"
          style={{ height: 640 }}
        >
          <TabPane tab={<span><Icon type="profile" />订单创建接口</span>} key="info">
            <Form layout="vertical">
              <FormItem>
                <Checkbox checked={orderCreate.enabled} onChange={this.handleOrderCreateCheck}>
                是否启用
                </Checkbox>
              </FormItem>
              <FormItem label="订单客户参数">
                <Select
                  value={orderCreate.customer_partner_id}
                  disabled={!orderCreate.enabled}
                  showSearch
                  allowClear
                  onChange={this.handleOrderCustomerChange}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                >
                  {partners.map(data => (<Option key={data.id} value={data.id}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}</Option>))}
                </Select>
              </FormItem>
              <FormItem label="货运流程参数" required>
                <Select
                  value={orderCreate.flow_id}
                  disabled={!orderCreate.enabled}
                  showSearch
                  allowClear
                  onChange={this.handleFlowChange}
                >
                  {flows.map(data => <Option key={data.id} value={data.id}>{data.name}</Option>)}
                </Select>
              </FormItem>
              <FormItem label="授权Token">
                <Input disabled value={token} />
              </FormItem>
              <FormItem>
                {!token &&
                <Button icon="key" onClick={this.handleOAuthTokenGen}>{this.msg('generate')}</Button>}
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab={<span><Icon type="profile" />发票导入接口</span>} key="invoice">
            <Form layout="vertical">
              <FormItem>
                <Checkbox checked={invoiceCreate.enabled} onChange={this.handleInvoiceCreateCheck}>
                是否启用
                </Checkbox>
              </FormItem>
              <FormItem label={this.msg('customer')}>
                <Select
                  value={invoiceCreate.owner_partner_id}
                  disabled={!invoiceCreate.enabled}
                  showSearch
                  allowClear
                  onChange={this.handleInvoicePartnerChange}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                >
                  {partners.map(data => (<Option key={data.id} value={data.id}>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}</Option>))}
                </Select>
              </FormItem>
              <FormItem label={this.msg('personResponsible')} required>
                <Select
                  value={invoiceCreate.own_by}
                  disabled={!invoiceCreate.enabled}
                  showSearch
                  allowClear
                  onChange={this.handleOwnerChange}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                >
                  {userMembers.map(data =>
                    (<Option key={data.login_id} value={data.login_id}>{data.name}</Option>))}
                </Select>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

