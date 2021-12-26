import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Form, Row, Col, Select } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DECL_CHANNEL, CMS_DECL_TYPE } from 'common/constants';
import FlowTriggerTable from '../compose/flowTriggerTable';
import { formatMsg } from '../../message.i18n';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  tenantSccCode: state.account.code,
  tenantName: state.account.tenantName,
  epList: state.hubIntegration.epList,
  swClients: state.hubIntegration.swClientList,
  partners: state.scofFlow.cmsParams.bizDelegation.partners,
}))
export default class CMSCustomsDeclPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleDeclChannelChange = () => (this.props.form.setFieldsValue({ ep_app_uuid: '' }))
  renderPermit = (permit) => {
    if (!permit) return [];
    return Array.isArray(permit) ? permit : permit.split(',').map(f => Number(f));
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, model, epList, swClients,
      partners, tenantId, tenantSccCode, tenantName,
    } = this.props;
    let cmsDeclTypes = [];
    if (model.kind === 'import') {
      cmsDeclTypes = CMS_DECL_TYPE.filter(cdt => cdt.ietype === 'i');
    } else if (model.kind === 'export') {
      cmsDeclTypes = CMS_DECL_TYPE.filter(cdt => cdt.ietype === 'e');
    }
    const provider = model.provider_tenant_id === tenantId;
    const ownerSccCode = getFieldValue('owner_scc_code');
    const fwdSccCode = getFieldValue('fwd_scc_code');
    const brokerSccCode = getFieldValue('broker_scc_code');
    const cmsDelgRoles = [];
    Array.from(new Set([ownerSccCode, fwdSccCode, brokerSccCode])).forEach((f) => {
      if (f === tenantSccCode) {
        cmsDelgRoles.push({
          tenantId,
          name: tenantName,
          code: null,
        });
      } else {
        const partner = partners.find(a => a.partner_unique_code === f);
        if (partner && partner.tid && partner.tid !== -1) {
          cmsDelgRoles.push({
            tenantId: partner.tid,
            name: partner.name,
            code: partner.partner_code,
          });
        }
      }
    });
    // TODO broker变化时，将申报通道，协同客户端，单证类型等置空
    return (
      <Collapse bordered={false} defaultActiveKey={['properties', 'events']}>
        <Panel header={this.msg('bizProperties')} key="properties">
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('customsDeclChannel')} {...formItemLayout}>
                {getFieldDecorator('dec_channel', {
                  initialValue: model.dec_channel,
                  onChange: this.handleDeclChannelChange,
                })(<Select disabled={!provider}>
                  {Object.keys(CMS_DECL_CHANNEL).map((declChannel) => {
                      const channel = CMS_DECL_CHANNEL[declChannel];
                      return (<Option
                        value={channel.value}
                        key={channel.value}
                        disabled={channel.disabled}
                      >{channel.text}</Option>);
                    })}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('epClient')} {...formItemLayout}>
                {getFieldDecorator('ep_app_uuid', {
                  initialValue: model.ep_app_uuid,
                })(<Select allowClear showSearch optionFilterProp="children" disabled={!provider}>
                  { getFieldValue('dec_channel') === CMS_DECL_CHANNEL.SW.value &&
                  swClients.map(item => (
                    <Option key={item.uuid} value={item.uuid}>
                      {item.name}
                    </Option>))}
                  { getFieldValue('dec_channel') === CMS_DECL_CHANNEL.EP.value &&
                  epList.map(item => (
                    <Option key={item.app_uuid} value={item.app_uuid}>
                      {item.name}
                    </Option>))}
                </Select>)}
              </FormItem>
            </Col>
            { getFieldValue('dec_channel') === CMS_DECL_CHANNEL.EP.value &&
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('customsDeclType')} {...formItemLayout}>
                {getFieldDecorator('ep_dec_type', {
                  initialValue: model.ep_dec_type,
                })(<Select allowClear disabled={!provider}>
                  {cmsDeclTypes.map(item =>
                    (<Option key={item.value} value={item.value}>{item.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            }
          </Row>
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('reviewPermit')} {...formItemLayout}>
                {getFieldDecorator('review_tenants', {
                  initialValue: this.renderPermit(model.review_tenants),
                })(<Select allowClear mode="multiple">
                  {cmsDelgRoles.map(f =>
                    <Option value={f.tenantId} key={f.tenantId}>{[f.code, f.name].filter(a => a).join('|')}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('declPermit')} {...formItemLayout}>
                {getFieldDecorator('decl_tenants', {
                  initialValue: this.renderPermit(model.decl_tenants),
                })(<Select allowClear mode="multiple">
                  {cmsDelgRoles.map(f =>
                    <Option value={f.tenantId} key={f.tenantId}>{[f.code, f.name].filter(a => a).join('|')}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel header={this.msg('bizEvents')} key="events">
          <FlowTriggerTable kind={model.kind} bizObj="cmsCustomsDecl" />
        </Panel>
      </Collapse>
    );
  }
}
