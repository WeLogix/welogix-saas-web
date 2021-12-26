import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Steps, Row, Col, Empty } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import { loadFlowNodeList } from 'common/reducers/saasCollab';
import { formatMsg } from '../../message.i18n';

const { Step } = Steps;

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  tenantName: state.account.tenantName,
  userMembers: state.account.userMembers,
  currentPartner: state.saasCollab.currentPartner,
  flowNodeList: state.saasCollab.flowNodeList,
}), { loadFlowNodeList })
export default class collabFlowPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    const { role, id: partnerId, partner_tenant_id: partnerTenantId } = this.props.currentPartner;
    this.handleFlowListLoad(role, partnerId, partnerTenantId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPartner !== this.props.currentPartner) {
      const { role, id: partnerId, partner_tenant_id: partnerTenantId } = nextProps.currentPartner;
      this.handleFlowListLoad(role, partnerId, partnerTenantId);
    }
  }
  getTenantName = (providerTenantId) => {
    if (providerTenantId === this.props.tenantId) {
      return this.props.tenantName;
    } else if (providerTenantId === this.props.currentPartner.partner_tenant_id) {
      return this.props.currentPartner.name;
    }
    return providerTenantId;
  }
  handleFlowListLoad = (role, partnerId, partnerTenantId) => {
    const params = {};
    if (role === 'CUS' && partnerId) {
      params.partnerId = partnerId;
    } else if (partnerTenantId !== -1) {
      params.partnerTenantId = partnerTenantId;
    }
    this.props.loadFlowNodeList(params);
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { flowNodeList } = this.props;
    return (
      <div>
        {flowNodeList.length > 0 ? (
          this.props.flowNodeList.map(flow => (
            <Card>
              <Row style={{ marginBottom: '10px' }}>
                <Col span={8}>{flow.name}</Col>
                <Col span={8}>
                  负责人:
                  {flow.flow_exec_logins ? (
                    <UserAvatar
                      size="small"
                      loginId={Number(flow.flow_exec_logins.split(',')[0])}
                      showName
                    />
                  ) : (
                    '未设置'
                  )}
                </Col>
                <Col span={8}>状态:{flow.status ? '已启用' : '未启用'}</Col>
              </Row>
              <Steps progressDot>
                {flow.nodes.map(node => (
                  <Step
                    title={node.kind !== 'terminal' ? node.name : '终点'}
                    description={this.getTenantName(node.provider_tenant_id)}
                    status="finish"
                  />
                ))}
              </Steps>
            </Card>
          ))
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}
