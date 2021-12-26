import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Form, Col, Row, Select } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import FlowTriggerTable from '../compose/flowTriggerTable';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Panel } = Collapse;
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
  bizManifest: state.scofFlow.cmsParams.bizManifest,
  partners: state.scofFlow.cmsParams.bizDelegation.partners,
}))
export default class CMSDeclManifestPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
  }
  msg = formatMsg(this.props.intl)
  renderPermit = (permit) => {
    if (!permit) return [];
    return Array.isArray(permit) ? permit : permit.split(',').map(f => Number(f));
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, model, bizManifest: { templates },
      partners, tenantId, tenantSccCode, tenantName,
    } = this.props;
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
    return (
      <Collapse bordered={false} defaultActiveKey={['properties', 'events']}>
        <Panel header={this.msg('bizProperties')} key="properties">
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('manifestTemplate')} {...formItemLayout}>
                {getFieldDecorator('manifest_template', {
                  initialValue: model.manifest_template,
                })(<Select allowClear disabled={!provider}>
                  {
                      templates.map(tmp => <Option value={tmp.id} key={tmp.id}>{tmp.name}</Option>)
                    }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="关联导入" {...formItemLayout}>
                {getFieldDecorator('correl', {
                  initialValue: model.correl || null, // 兼容为0的老数据
                })(<Select allowClear disabled={!provider}>
                  <Option value={1} key="1">关联物料库导入</Option>
                  <Option value={2} key="2">关联账册导入</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('manifestPermit')} {...formItemLayout}>
                {getFieldDecorator('manifest_tenants', {
                  initialValue: this.renderPermit(model.manifest_tenants),
                })(<Select allowClear mode="multiple">
                  {cmsDelgRoles.map(f =>
                    <Option value={f.tenantId} key={f.tenantId}>{[f.code, f.name].filter(a => a).join('|')}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel header={this.msg('bizEvents')} key="events">
          <FlowTriggerTable kind={model.kind} bizObj="cmsManifest" />
        </Panel>
      </Collapse>
    );
  }
}
