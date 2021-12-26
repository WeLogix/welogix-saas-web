import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Form, Tabs, Collapse, Row, Col, Select } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import FlowNodePanel from './compose/flowNodePanel';
import FlowTriggerTable from './compose/flowTriggerTable';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
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
@connect(
  state => ({
    bookList: state.cwmBlBook.blBooksByType,
    partners: state.partner.partners,
  }),
  { getBlBookNosByType }
)
@Form.create()
export default class FlowPtsPanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
    partners: PropTypes.arrayOf().isRequired,
    bookList: PropTypes.arrayOf().isRequired,
    onFormInit: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const model = this.props.node.get('model');
    if (model && model.owner_partner_id) {
      this.props.getBlBookNosByType(null, ['EML', 'EMS'], model.owner_partner_id);
    }
    this.props.onFormInit(this.props.form);
  }
  msg = formatMsg(this.props.intl)
  handleSelect = (selectKey) => {
    this.props.getBlBookNosByType(null, ['EML', 'EMS'], selectKey);
  }
  render() {
    const {
      form, node, graph, partners, bookList,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const model = node.get('model');
    const partnerId = getFieldValue('owner_partner_id') || model.owner_partner_id;
    if (partnerId) {
      const ownerTenantId = partners.find(pt => pt.id === partnerId).partner_tenant_id;
      model.owner_tenant_id = ownerTenantId;
    }
    return (
      <Form layout="horizontal" className="form-layout-compact">
        <Card bodyStyle={{ padding: 0 }}>
          <FlowNodePanel form={form} node={node} graph={graph} />
        </Card>

        <Card bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey="invt">
            <TabPane tab={this.msg('inventory')} key="invt">
              <Collapse bordered={false} defaultActiveKey={['properties', 'events']}>
                <Panel header={this.msg('bizProperties')} key="properties">
                  <Row gutter={16}>
                    <Col sm={24} lg={12}>
                      <FormItem label={this.msg('owner')} {...formItemLayout}>
                        {getFieldDecorator('owner_partner_id', {
                          initialValue: model.owner_partner_id,
                          rules: [{ required: true }],
                        })(<Select
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          onSelect={this.handleSelect}
                        >
                          {partners.map(pt =>
                            <Option key={pt.id} value={pt.id}>{pt.id}|{pt.name}</Option>)}
                        </Select>)}
                      </FormItem>
                    </Col>
                    <Col sm={24} lg={12}>
                      {partnerId && <FormItem label={this.msg('bookNo')} {...formItemLayout}>
                        {getFieldDecorator('book_no', {
                          initialValue: model.book_no,
                        })(<Select
                          showSearch
                          allowClear
                          optionFilterProp="children"
                        >
                          {bookList.map(bk => (
                            <Option key={bk.blbook_no} value={bk.blbook_no}>
                              {bk.blbook_type}||{bk.blbook_no}</Option>)) }
                        </Select>)}
                      </FormItem>}
                    </Col>
                  </Row>
                </Panel>
                <Panel header={this.msg('bizEvents')} key="events">
                  <FlowTriggerTable kind={model.kind} bizObj="ptsInventory" />
                </Panel>
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>
      </Form>);
  }
}
