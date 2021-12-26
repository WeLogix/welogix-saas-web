import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Form, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadCmsBizParams } from 'common/reducers/scofFlow';
import FlowNodePanel from './compose/flowNodePanel';
import DelegationPane from './bizpane/cmsDelegationPane';
import DeclManifestPane from './bizpane/cmsDeclManifestPane';
import CustomsDeclPane from './bizpane/cmsCustomsDeclPane';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    customerPartnerId: state.scofFlow.currentFlow.customer_partner_id,
  }),
  { loadCmsBizParams }
)
@Form.create()
export default class FlowCmsNodePanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
    onFormInit: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.onFormInit(this.props.form);
    const model = this.props.node.get('model');
    this.handleParamsLoad(model, this.props.customerPartnerId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node !== this.props.node) {
      const model = nextProps.node.get('model');
      this.handleParamsLoad(model, nextProps.customerPartnerId);
    }
  }
  handleParamsLoad = (model, customerPartnerId) => {
    this.props.loadCmsBizParams(customerPartnerId, model.kind);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      form, node, graph,
    } = this.props;
    const model = node.get('model');
    return (
      <Form layout="horizontal" className="form-layout-compact">
        <Card bodyStyle={{ padding: 0 }}>
          <FlowNodePanel
            form={form}
            node={node}
            graph={graph}
          />
        </Card>
        <Card bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey="objDelegation">
            <TabPane tab={this.msg('cmsDelegation')} key="objDelegation">
              <DelegationPane form={form} model={model} />
            </TabPane>
            <TabPane tab={this.msg('cmsDeclManifest')} key="objDeclManifest" >
              <DeclManifestPane form={form} model={model} />
            </TabPane>
            <TabPane tab={this.msg('cmsCustomsDecl')} key="objCustomsDecl" >
              <CustomsDeclPane form={form} model={model} />
            </TabPane>
          </Tabs>
        </Card>
      </Form>);
  }
}
