import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Form, Input, Switch, Col, Row, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { } from 'common/reducers/hubIntegration';
import { formatMsg } from '../../message.i18n';
import DeclConfigPanel from '../panel/declConfigPanel';
import MsgPathConfigPanel from '../panel/msgPathConfigPanel';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@injectIntl
@Form.create()
export default class ParamsForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    onSave: PropTypes.func.isRequired,
  }
  state = {
    activeTabKey: 'decl',
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const { app } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSave({ ...values, uuid: app.uuid });
      }
    });
  }
  handleTabChange = (tabKey) => {
    this.setState({ activeTabKey: tabKey });
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, app } = this.props;
    if (!app.uuid) {
      return null;
    }
    let thirdPartySendEnabled = getFieldValue('enable_third_party');
    if (thirdPartySendEnabled === undefined) {
      thirdPartySendEnabled = !!app.enable_third_party;
    }
    return (
      <Form>
        <Row gutter={16}>
          <Col span={4}>
            <FormItem label={this.msg('enableThirdParty')}>
              {getFieldDecorator('enable_third_party', {
                initialValue: !!app.enable_third_party,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={20}>
            <FormItem label={this.msg('thirdPartyUrl')}>
              {getFieldDecorator('third_party_url', {
                initialValue: app.third_party_url,
                rules: [{ required: thirdPartySendEnabled, message: this.msg('parameterRequired') }],
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Divider dashed />
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label={this.msg('agentSccCode')}>
              {getFieldDecorator('agent_scc_code', {
                initialValue: app.agent_scc_code,
                rules: [{
                  required: true,
                  len: 18,
                  message: this.msg('agentSccCodeShouldBe18'),
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('agentCusCode')}>
              {getFieldDecorator('agent_cus_code', {
                initialValue: app.agent_cus_code,
                rules: [{
                  required: !thirdPartySendEnabled,
                  len: 10,
                  message: this.msg('agentCusCodeShouldBe10'),
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={this.msg('agentName')}>
              {getFieldDecorator('agent_name', {
                initialValue: app.agent_name,
                rules: [{
                  required: !thirdPartySendEnabled,
                  message: this.msg('shouldBeRequired'),
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('swIcCardNo')}>
              {getFieldDecorator('sw_ic_card_no', {
                initialValue: app.sw_ic_card_no,
                rules: [{
                  required: !thirdPartySendEnabled,
                  message: this.msg('shouldBeRequired'),
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('swClientNo')}>
              {getFieldDecorator('sw_client_id', {
                initialValue: app.sw_client_id,
                rules: [{
                  required: !thirdPartySendEnabled,
                  len: 10,
                  message: this.msg('shouldBeRequired'),
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('appId')}>
              <Input value={app.dev_app_id} disabled />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('swQueue')}>
              {getFieldDecorator('sw_queue', {
            initialValue: app.sw_queue,
          })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label={this.msg('installPath')}>
              {getFieldDecorator('swclient_installpath', {
            initialValue: app.swclient_installpath || 'C:\\\\WeloSW',
          })(<Input />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <Tabs activeKey={this.state.activeTabKey} onChange={this.handleTabChange}>
              <TabPane tab={this.msg('goodsDecl')} key="decl">
                <DeclConfigPanel app={app} form={this.props.form} />
              </TabPane>
              <TabPane tab={this.msg('sasbl')} key="sasbl">
                <MsgPathConfigPanel
                  app={app}
                  form={this.props.form}
                  boxFields={{
                    inbox: 'sas_inbox',
                    outbox: 'sas_outbox',
                    sentbox: 'sas_sentbox',
                    failbox: 'sas_failbox',
                  }}
                />
              </TabPane>
              <TabPane tab={this.msg('ptsEms')} key="ptsEms">
                <MsgPathConfigPanel
                  app={app}
                  form={this.props.form}
                  boxFields={{
                    inbox: 'nems_inbox',
                    outbox: 'nems_outbox',
                    sentbox: 'nems_sentbox',
                    failbox: 'nems_failbox',
                  }}
                />
              </TabPane>
              <TabPane tab={this.msg('ptsEml')} key="ptsEml">
                <MsgPathConfigPanel
                  app={app}
                  form={this.props.form}
                  boxFields={{
                    inbox: 'npts_inbox',
                    outbox: 'npts_outbox',
                    sentbox: 'npts_sentbox',
                    failbox: 'npts_failbox',
                  }}
                />
              </TabPane>
            </Tabs>
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
