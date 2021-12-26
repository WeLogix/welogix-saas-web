import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Form, Col, Row, Radio, Select } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CWM_SO_TYPES, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import { loadwhseOwners } from 'common/reducers/cwmWarehouse';
import FlowTriggerTable from '../compose/flowTriggerTable';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Panel } = Collapse;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
  shipParams: state.scofFlow.cwmParams,
  whseOwners: state.cwmWarehouse.whseOwners,
}), { loadwhseOwners })
export default class CWMShippingPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
  }
  componentDidMount() {
    const { model } = this.props;
    if (model.whse_code) {
      this.props.loadwhseOwners(model.whse_code);
    }
  }
  msg = formatMsg(this.props.intl)
  handleSoTypeChange = (soType) => {
    if (soType === CWM_SO_TYPES[3].value) {
      this.props.form.setFieldsValue({
        bonded: 1,
        bonded_reg_type: CWM_SHFTZ_OUT_REGTYPES[0].value,
      });
    }
  }
  handleBondedChange = (ev) => {
    if (ev.target.value !== 1) {
      const { graph, node } = this.props;
      const regType = this.props.form.getFieldValue('bonded_reg_type');
      if (regType) {
        this.props.form.setFieldsValue({
          bonded_reg_type: null,
        });
      }
      graph.update(node, { bonded_reg_type: null });
    }
  }
  handleWhseSelect = (tWhseCode) => {
    const { shipParams } = this.props;
    const selWhse = shipParams.whses.filter(whse => `${whse.wh_ent_tenant_id}-${whse.code}` === tWhseCode)[0];
    if (selWhse) {
      const resetFields = {
        whse_owner_partner_id: null,
      };
      if (!selWhse.bonded) {
        resetFields.bonded = 0;
      }
      this.props.form.setFieldsValue(resetFields);
      this.props.loadwhseOwners(selWhse.code);
    }
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, model, whseOwners, shipParams,
    } = this.props;
    model.t_whse_code = model.t_whse_code || (model.whse_code && `${model.wh_ent_tenant_id}-${model.whse_code}`);
    const tWhseCode = getFieldValue('t_whse_code') || model.t_whse_code;
    const selWhse = shipParams.whses.filter(whse => `${whse.wh_ent_tenant_id}-${whse.code}` === tWhseCode)[0];
    return (
      <Collapse bordered={false} defaultActiveKey={['properties', 'events']}>
        <Panel header={this.msg('bizProperties')} key="properties">
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('cwmWarehouse')} {...formItemLayout}>
                {getFieldDecorator('t_whse_code', {
                  initialValue: model.t_whse_code,
                })(<Select showSearch allowClear optionFilterProp="children" onSelect={this.handleWhseSelect}>
                  {shipParams.whses.map(wh =>
                    <Option key={`${wh.wh_ent_tenant_id}-${wh.code}`} value={`${wh.wh_ent_tenant_id}-${wh.code}`}>{wh.code}|{wh.name}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('owner')} {...formItemLayout}>
                {getFieldDecorator('whse_owner_partner_id', {
                  initialValue: model.whse_owner_partner_id,
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  onChange={this.handleWhseOwnerSelect}
                >
                  {whseOwners.map(whow => (
                    <Option key={whow.owner_partner_id} value={whow.owner_partner_id}>
                      {[whow.owner_code, whow.owner_name].filter(wh => wh).join('|')}</Option>)) }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="SO类型" {...formItemLayout}>
                {getFieldDecorator('so_type', {
                  initialValue: model.so_type,
                })(<Select placeholder="SO类型" allowClear onChange={this.handleSoTypeChange}>
                  {CWM_SO_TYPES.map(cat =>
                    <Option value={cat.value} key={cat.value}>{cat.text}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label="保税类型" {...formItemLayout}>
                {getFieldDecorator('bonded', {
                  initialValue: model.bonded,
                  onChange: this.handleBondedChange,
                })(<RadioGroup buttonStyle="solid">
                  <RadioButton value={0}>非保税</RadioButton>
                  {selWhse && selWhse.bonded ? <RadioButton value={1}>保税</RadioButton> : null}
                  {selWhse && selWhse.bonded ? <RadioButton value={-1}>不限</RadioButton> : null}
                </RadioGroup>)}
              </FormItem>
            </Col>
            {
              !!(getFieldValue('bonded') === 1) &&
              <Col sm={24} lg={12}>
                <FormItem label="保税备案类型" {...formItemLayout}>
                  {getFieldDecorator('bonded_reg_type', {
                    initialValue: model.bonded_reg_type,
                  })(<Select>
                    {(selWhse && selWhse.ftz_type === 'SHFTZ') && CWM_SHFTZ_OUT_REGTYPES.map(cabr =>
                      (<Option value={cabr.value} key={cabr.value}>
                        {cabr.ftztext || cabr.text}
                      </Option>))}
                    {(selWhse && selWhse.ftz_type === 'SASBL') && SASBL_REG_TYPES.map(cabr =>
                      (<Option value={cabr.value} key={cabr.value}>
                        {cabr.ftztext}
                      </Option>))}
                  </Select>)}
                </FormItem>
              </Col>
            }
          </Row>
        </Panel>
        <Panel header={this.msg('bizEvents')} key="events">
          <FlowTriggerTable kind={model.kind} bizObj="cwmShipping" />
        </Panel>
      </Collapse>
    );
  }
}
