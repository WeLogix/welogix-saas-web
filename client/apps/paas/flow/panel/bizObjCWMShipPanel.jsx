import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Form, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadCwmBizParams } from 'common/reducers/scofFlow';
import FlowNodePanel from './compose/flowNodePanel';
import ShippingPane from './bizpane/cwmShippingPane';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    partnerId: state.scofFlow.currentFlow.customer_partner_id,
  }),
  { loadCwmBizParams }
)
@Form.create()
export default class FlowCwmShippingPanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
    onFormInit: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.loadCwmBizParams(this.props.partnerId);
    this.props.onFormInit(this.props.form);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { form, node, graph } = this.props;
    const model = node.get('model');
    return (
      <Form layout="horizontal" className="form-layout-compact">
        <Card bodyStyle={{ padding: 0 }}>
          <FlowNodePanel form={form} node={node} graph={graph} />
        </Card>
        <Card bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey="cwmShipping">
            <TabPane tab={this.msg('cwmShippingOrder')} key="cwmShipping">
              <ShippingPane form={form} model={model} graph={graph} node={node} />
            </TabPane>
          </Tabs>
        </Card>
      </Form>);
  }
}
