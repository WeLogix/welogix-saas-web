import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Col, Form, Input, Select, Switch } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadServiceTeamList } from 'common/reducers/saasCollab';
import UserAvatar from 'client/components/UserAvatar';
import FlowTriggerTable from './flowTriggerTable';
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
@connect(
  state => ({
    tenantId: state.account.tenantId,
    tenantName: state.account.tenantName,
    userMembers: state.account.userMembers,
    partnerId: state.scofFlow.currentFlow.customer_partner_id,
    serviceTeam: state.saasCollab.operators,
    customerPartners: state.partner.partners,
    vendorTenants: state.scofFlow.vendorTenants,
    providerFlows: state.scofFlow.flowGraph.providerFlows,
    mainFlow: !state.scofFlow.currentFlow.main_flow_id,
  }),
  { loadServiceTeamList }
)
export default class FlowNodePanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    serviceTeam: PropTypes.arrayOf(PropTypes.shape({
      lid: PropTypes.number.isRequired, name: PropTypes.string.isRequired,
    })),
  }
  componentDidMount() {
    this.props.loadServiceTeamList({ partnerId: this.props.partnerId });
  }
  getUserName = (loginId) => {
    const user = this.props.userMembers.find(f => f.login_id === loginId);
    return user && user.name;
  }
  msg = formatMsg(this.props.intl)
  handleResponsiblerSelect = (lid) => {
    const person = this.props.serviceTeam.filter(st => st.lid === lid)[0];
    if (person) {
      this.props.graph.update(this.props.node, { person: person.name });
    }
  }
  handleProviderChange = (provider) => {
    this.props.graph.update(this.props.node, { provider_tenant_id: provider });
    if (this.props.onProviderChange) {
      this.props.onProviderChange(provider);
    }
  }
  render() {
    const {
      form: { getFieldDecorator }, // customerPartners,
      node, serviceTeam, tenantId, tenantName,
      vendorTenants, providerFlows, mainFlow,
    } = this.props;
    const model = node.get('model');
    const flowDemandProvider = [];
    if (mainFlow) {
      // let demanderName;
      // const demander = customerPartners.filter(cusp => cusp.id === model.demander_partner_id)[0];
      // if (!demander) {
      //   demanderName = tenantName;
      // } else {
      //   demanderName = demander.name;
      // }
      const providers = providerFlows.map(pf => ({
        id: pf.tenant_id,
        name: vendorTenants.filter(vt => vt.partner_tenant_id === pf.tenant_id)[0].name,
      })).concat({ id: tenantId, name: tenantName });
      // <FormItem label={this.msg('nodeDemander')} key="demander" {...formItemLayout}>
        //  <Input readOnly defaultValue={demanderName} />
        // </FormItem>,
      flowDemandProvider.push(<FormItem label={this.msg('nodeProvider')} key="provider" {...formItemLayout}>
        {getFieldDecorator('provider_tenant_id', {
          initialValue: model.provider_tenant_id,
          onChange: this.handleProviderChange,
            })(<Select allowClear showSearch>
              {providers.map(st => <Option key={st.id} value={st.id}>{st.name}</Option>)}
            </Select>)}
      </FormItem>);
    }
    const provider = model.provider_tenant_id === tenantId;
    return (
      <Collapse bordered={false} defaultActiveKey={['properties', 'events']} style={{ marginTop: 2 }} >
        <Panel header={this.msg('nodeProperties')} key="properties" className="form-layout-compact">
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('nodeName')} {...formItemLayout}>
              {getFieldDecorator('name', {
              initialValue: model.name,
              rules: [{ required: true, message: '名称必填' }],
            })(<Input />)}
            </FormItem>
          </Col>
          <Col sm={24} lg={12}><FormItem label={this.msg('multiBizInstance')} {...formItemLayout}>
            {getFieldDecorator('multi_bizobj', {
          initialValue: model.multi_bizobj,
          valuePropName: 'checked',
        })(<Switch />)}
          </FormItem></Col>
          <Col sm={24} lg={12}>
            {flowDemandProvider}
          </Col>
          <Col sm={24} lg={12}>
            <FormItem label={this.msg('nodeExecutor')} {...formItemLayout}>
              {getFieldDecorator('person_id', {
              initialValue: provider ? model.person_id : null,
              rules: [{ required: true }],
            })(<Select
              onChange={this.handleResponsiblerSelect}
              allowClear
              showSearch
              disabled={!provider}
            >
              {serviceTeam.map(st =>
                (<Option key={st.lid} value={st.lid}>
                  <UserAvatar size="small" loginId={st.lid} showName />
                </Option>))}
            </Select>)}
            </FormItem>
          </Col>
        </Panel>
        <Panel header={this.msg('nodeEvents')} key="events">
          <FlowTriggerTable kind={model.kind} />
        </Panel>
      </Collapse>
    );
  }
}
