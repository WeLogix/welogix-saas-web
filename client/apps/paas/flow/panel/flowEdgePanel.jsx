import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, Select, Input } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { NODE_BIZ_OBJECTS } from 'common/constants';
import ConditionTable from './compose/conditionTable';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;


@injectIntl
export default class FlowEdgePanel extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    source: PropTypes.shape({ name: PropTypes.string.isRequired }),
    target: PropTypes.shape({ name: PropTypes.string }),
    onAdd: PropTypes.func.isRequired,
    onDel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      model, source, target, onAdd, onDel, onUpdate,
    } = this.props;
    return (
      <Form layout="horizontal" className="form-layout-compact">
        <Card bodyStyle={{ padding: 16 }}>
          <Col span={12}>
            <FormItem label={this.msg('sourceNode')}>
              <Input value={source.name} readOnly />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={this.msg('targetNode')}>
              <Input value={target.kind !== 'terminal' ? target.name : '终点'} readOnly />
            </FormItem>
          </Col>
          <FormItem label={<span>
            {this.msg('edgeCondition')}:&nbsp;满足以下&nbsp;&nbsp;
            <Select size="small" defaultValue="all" style={{ width: 80 }} >
              <Option value="all">所有</Option>
              <Option value="any">任一</Option>
            </Select>
                &nbsp;&nbsp;条件
          </span>}
          >
            <ConditionTable
              conditions={model.conditions}
              bizObjects={NODE_BIZ_OBJECTS[source.kind]}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDel={onDel}
            />
          </FormItem>
        </Card>
      </Form>);
  }
}
