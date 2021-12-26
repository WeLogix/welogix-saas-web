import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Tabs, Card, Form, Input, Select, Col, Row, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadPartners } from 'common/reducers/partner';
import { loadUnitpricePolicyList, updateUpRiskPolicy, addUpRiskPolicy, removeUpRiskPolicy } from 'common/reducers/paasRisk';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    unitpricePolicy: state.paasRisk.unitpricePolicy,
    submitting: state.paasRisk.submitting,
    partners: state.partner.partners,
  }),
  {
    loadPartners, loadUnitpricePolicyList, updateUpRiskPolicy, addUpRiskPolicy, removeUpRiskPolicy,
  }
)
export default class UnitPricePolicy extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    unitpricePolicy: PropTypes.shape({
      uniform: PropTypes.shape({
        id: PropTypes.number.isRequired,
        ref_timelimit: PropTypes.number.isRequired,
        ref_timelevel: PropTypes.string.isRequired,
      }),
      exceptList: PropTypes.arrayOf(PropTypes.shape({
        owner_partner_id: PropTypes.arrayOf(PropTypes.number),
      })),
    }),
  }
  state = {
    editRiskRule: undefined,
    currTabKey: 'uniform',
  }
  componentDidMount() {
    this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.OWN] });
    this.props.loadUnitpricePolicyList();
  }
  msg = formatMsg(this.props.intl)
  handleEditRuleChange = (editRiskRule, ruleField, value, format) => {
    const editRule = { ...editRiskRule };
    let fieldVal = value;
    if (value) {
      if (format === 'int') {
        fieldVal = parseInt(fieldVal, 10);
      } else if (format === 'float') {
        fieldVal = parseFloat(fieldVal);
      }
      if (Number.isNaN(fieldVal) || fieldVal !== Number(value)) {
        fieldVal = undefined;
      } else {
        fieldVal = value; // 0. 保留
      }
    } else if (format) {
      fieldVal = undefined;
    }
    editRule[ruleField] = fieldVal;
    this.setState({ editRiskRule: editRule });
  }
  handleUniformRuleEdit = (ruleField, value, format) => {
    let editRule = this.state.editRiskRule;
    if (!editRule) {
      editRule = this.props.unitpricePolicy.uniform;
    }
    this.handleEditRuleChange(editRule, ruleField, value, format);
  }
  handleExceptRuleEdit = (exceptIdx, ruleField, value, format) => {
    let editRule = this.state.editRiskRule;
    if (!editRule) {
      editRule = this.props.unitpricePolicy.exceptList[exceptIdx];
    }
    this.handleEditRuleChange(editRule, ruleField, value, format);
  }
  handleNewExceptRule = () => {
    const newRiskRule = {
      owner_partner_id: [],
      ref_timelimit: 0,
      ref_timelevel: 't',
      statmethod: 1,
    };
    const currTabKey = `except${this.props.unitpricePolicy.exceptList.length + 1}`;
    this.setState({ editRiskRule: newRiskRule, currTabKey });
  }
  handleExceptSave = () => {
    const { editRiskRule } = this.state;
    if (!editRiskRule) {
      return;
    }
    if (!editRiskRule.owner_partner_id || editRiskRule.owner_partner_id.length === 0) {
      message.error('特殊客户必选');
      return;
    }
    this.handleUniformSave();
  }
  handleUniformSave = () => {
    const editRiskRule = { ...this.state.editRiskRule };
    if (!editRiskRule) {
      return;
    }
    if (!editRiskRule.ref_timelevel || !editRiskRule.ref_timelimit) {
      message.error('基准单价取值未填写');
      return;
    }
    let highLimit = parseFloat(editRiskRule.high_thresh);
    if (Number.isNaN(highLimit) && highLimit !== Number(editRiskRule.high_thresh)) {
      highLimit = -1;
    }
    let mediumLimit = parseFloat(editRiskRule.medium_thresh);
    if (Number.isNaN(mediumLimit) && mediumLimit !== Number(editRiskRule.medium_thresh)) {
      mediumLimit = -2;
    }
    let lowLimit = parseFloat(editRiskRule.low_thresh);
    if (Number.isNaN(lowLimit) && lowLimit !== Number(editRiskRule.low_thresh)) {
      lowLimit = -3;
    }
    if (highLimit < 0 && mediumLimit < 0 && lowLimit < 0) {
      message.error('高中低风险浮动率至少填写一项');
      return;
    }
    let boundError = false;
    if (highLimit >= 0) {
      if (highLimit <= mediumLimit || highLimit <= lowLimit) {
        message.error('高风险浮动率须大于中低风险');
        boundError = true;
      }
    }
    if (mediumLimit >= 0) {
      if (mediumLimit <= lowLimit) {
        message.error('中等风险浮动率须大于低风险');
        boundError = true;
      }
    }
    if (boundError) {
      return;
    }

    editRiskRule.high_thresh = highLimit;
    editRiskRule.medium_thresh = mediumLimit;
    editRiskRule.low_thresh = lowLimit;
    let prom;
    if (editRiskRule.id) {
      prom = this.props.updateUpRiskPolicy(editRiskRule);
    } else {
      prom = this.props.addUpRiskPolicy(editRiskRule);
    }
    prom.then((result) => {
      if (!result.error) {
        this.setState({ editRiskRule: undefined });
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleRuleDel = (policyId) => {
    if (!policyId) {
      this.setState({ editRiskRule: undefined, currTabKey: 'uniform' });
      return;
    }
    this.props.removeUpRiskPolicy(policyId).then((result) => {
      if (!result.error) {
        this.setState({ editRiskRule: undefined, currTabKey: 'uniform' });
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleTabChange = (tabKey) => {
    this.setState({ currTabKey: tabKey });
  }
  render() {
    const { unitpricePolicy, partners, submitting } = this.props;
    const { editRiskRule, currTabKey } = this.state;
    let uniformRule = unitpricePolicy.uniform;
    let exceptRuleList = unitpricePolicy.exceptList;
    let checkNonCurrTabDisable = false;
    if (editRiskRule) {
      checkNonCurrTabDisable = true;
      if (currTabKey === 'uniform') {
        uniformRule = editRiskRule;
      } else if (!editRiskRule.id) {
        exceptRuleList = exceptRuleList.concat(editRiskRule);
      } else {
        exceptRuleList = exceptRuleList.map((ecr) => {
          if (ecr.id === editRiskRule.id) {
            return editRiskRule;
          }
          return ecr;
        });
      }
    }
    return (
      <Card
        title={this.msg('decPriceRisk')}
        extra={
          <Button type="ghost" icon="plus" onClick={this.handleNewExceptRule} disabled={!!editRiskRule}>添加特殊客户风控参数</Button>
        }
      >
        <Tabs activeKey={currTabKey} onChange={this.handleTabChange}>
          <TabPane tab={this.msg('uniformRule')} key="uniform" disabled={checkNonCurrTabDisable && currTabKey !== 'uniform'}>
            <Form>
              <Row gutter={16}>
                <Col sm={24} lg={12}>
                  <FormItem label={this.msg('ruleDesc')}>
                    <Input defaultValue="申报单价超出允许浮动率时报警" disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={12}>
                  <FormItem label={this.msg('bizObject')}>
                    <Input defaultValue={this.msg('cmsDeclManifest')} disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('单价浮动率计算公式')}>
                    <Input defaultValue="|(当次申报单价 - 基准单价) / 基准单价 * 100%|" disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('基准单价取值')} required>
                    <Row>
                      <Col span={10}>
                        <Input
                          addonBefore="最近"
                          value={uniformRule.ref_timelimit}
                          onChange={ev => this.handleUniformRuleEdit('ref_timelimit', ev.target.value, 'int')}
                          addonAfter={
                            <Select
                              style={{ width: 100 }}
                              value={uniformRule.ref_timelevel}
                              onChange={val => this.handleUniformRuleEdit('ref_timelevel', val)}
                            >
                              <Option key="times" value="t">次</Option>
                              <Option key="days" value="d">日</Option>
                              <Option key="weeks" value="w">周</Option>
                              <Option key="months" value="m">月</Option>
                              <Option key="quarters" value="q">季</Option>
                              <Option key="years" value="y">年</Option>
                            </Select>}
                        />
                      </Col>
                      <Col span={14}>
                        <Select showSearch value={uniformRule.statmethod} onChange={val => this.handleUniformRuleEdit('statmethod', val)}>
                          <Option key="median" value={1}>中位数</Option>
                          <Option key="avg" value={2}>算数平均数</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('风险级别')}>
                    <Row>
                      <Col span={3}><Input value="高风险" /></Col>
                      <Col span={8}><Input
                        addonBefore="大于"
                        value={uniformRule.high_thresh < 0 ? '' : uniformRule.high_thresh}
                        onChange={ev => this.handleUniformRuleEdit('high_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="报警提示方式" value={uniformRule.high_alarm} onChange={val => this.handleUniformRuleEdit('high_alarm', val)}>
                          <Option key="notification" value={1}>通知</Option>
                          <Option key="pendtask" value={2}>待办</Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}><Input value="中等风险" /></Col>
                      <Col span={8}><Input
                        addonBefore="大于"
                        value={uniformRule.medium_thresh < 0 ? '' : uniformRule.medium_thresh}
                        onChange={ev => this.handleUniformRuleEdit('medium_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="报警提示方式" value={uniformRule.medium_alarm} onChange={val => this.handleUniformRuleEdit('medium_alarm', val)}>
                          <Option key="notification" value={1}>通知</Option>
                          <Option key="pendtask" value={2}>待办</Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}><Input value="低风险" /></Col>
                      <Col span={8}><Input
                        addonBefore="大于"
                        value={uniformRule.low_thresh < 0 ? '' : uniformRule.low_thresh}
                        onChange={ev => this.handleUniformRuleEdit('low_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="报警提示方式" value={uniformRule.low_alarm} onChange={val => this.handleUniformRuleEdit('low_alarm', val)}>
                          <Option key="notification" value={1}>通知</Option>
                          <Option key="pendtask" value={2}>待办</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem>
                    <Button type="primary" icon="save" loading={submitting} disabled={!editRiskRule} onClick={this.handleUniformSave}>{this.msg('save')}</Button>
                    {!!uniformRule.id &&
                    <Button icon="del" loading={submitting} style={{ marginLeft: 5 }} disabled={unitpricePolicy.exceptList.length > 0} onClick={() => this.handleRuleDel(uniformRule.id)}>
                      {this.msg('delete')}</Button>
                    }
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          {exceptRuleList.map((excptRule, idx) => {
            const exceptKey = `except${idx + 1}`;
           return (
             <TabPane tab={`特例${idx + 1}`} key={exceptKey} disabled={checkNonCurrTabDisable && currTabKey !== exceptKey}>
               <Form>
                 <Row gutter={16}>
                   <Col sm={24} lg={24}>
                     <FormItem label={this.msg('customer')} required>
                       <Select
                         allowClear
                         showSearch
                         optionFilterProp="children"
                         dropdownMatchSelectWidth={false}
                         dropdownStyle={{ width: 360, maxHeight: 400, overflow: 'auto' }}
                         value={excptRule.owner_partner_id}
                         onChange={owner => this.handleExceptRuleEdit(idx, 'owner_partner_id', owner)}
                         style={{ width: '100%' }}
                         mode="multiple"
                       >
                         {partners.map(data => (<Option key={data.id} value={data.id}>
                           {[data.partner_code, data.name].filter(dd => dd).join(' | ')}
                         </Option>))}
                       </Select>
                     </FormItem>
                   </Col>
                   <Col sm={24} lg={24}>
                     <FormItem label={this.msg('基准单价取值')} required>
                       <Row>
                         <Col span={10}>
                           <Input
                             addonBefore="最近"
                             value={excptRule.ref_timelimit}
                             onChange={ev => this.handleExceptRuleEdit(idx, 'ref_timelimit', ev.target.value, 'int')}
                             addonAfter={<Select
                               style={{ width: 100 }}
                               value={excptRule.ref_timelevel}
                               onChange={val => this.handleExceptRuleEdit(idx, 'ref_timelevel', val)}
                             >
                               <Option key="times" value="t">次</Option>
                               <Option key="days" value="d">日</Option>
                               <Option key="weeks" value="w">周</Option>
                               <Option key="months" value="m">月</Option>
                               <Option key="quarters" value="q">季</Option>
                               <Option key="years" value="y">年</Option>
                             </Select>}
                           />
                         </Col>
                         <Col span={14}>
                           <Select showSearch value={excptRule.statmethod} onChange={val => this.handleExceptRuleEdit(idx, 'statmethod', val)}>
                             <Option key="median" value={1}>中位数</Option>
                             <Option key="avg" value={2}>算数平均数</Option>
                           </Select>
                         </Col>
                       </Row>
                     </FormItem>
                   </Col>
                   <Col sm={24} lg={24}>
                     <FormItem label={this.msg('风险级别')}>
                       <Row>
                         <Col span={3}><Input value="高风险" /></Col>
                         <Col span={8}><Input
                           addonBefore="大于"
                           value={excptRule.high_thresh < 0 ? '' : excptRule.high_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'high_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="报警提示方式" value={excptRule.high_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'high_alarm', val)}>
                             <Option key="notification" value={1}>通知</Option>
                             <Option key="pendtask" value={2}>待办</Option>
                           </Select>
                         </Col>
                       </Row>
                       <Row>
                         <Col span={3}><Input value="中等风险" /></Col>
                         <Col span={8}><Input
                           addonBefore="大于"
                           value={excptRule.medium_thresh < 0 ? '' : excptRule.medium_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'medium_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="报警提示方式" value={excptRule.medium_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'medium_alarm', val)}>
                             <Option key="notification" value={1}>通知</Option>
                             <Option key="pendtask" value={2}>待办</Option>
                           </Select>
                         </Col>
                       </Row>
                       <Row>
                         <Col span={3}><Input value="低风险" /></Col>
                         <Col span={8}><Input
                           addonBefore="大于"
                           value={excptRule.low_thresh < 0 ? '' : excptRule.low_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'low_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="报警提示方式" value={excptRule.low_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'low_alarm', val)}>
                             <Option key="notification" value={1}>通知</Option>
                             <Option key="pendtask" value={2}>待办</Option>
                           </Select>
                         </Col>
                       </Row>
                     </FormItem>
                   </Col>
                   <Col span={24}>
                     <FormItem>
                       <Button type="primary" icon="save" loading={submitting} disabled={!editRiskRule} onClick={this.handleExceptSave}>{this.msg('save')}</Button>
                       <Button icon="del" loading={submitting} onClick={() => this.handleRuleDel(excptRule.id)} style={{ marginLeft: 5 }}>
                         {this.msg('delete')}</Button>
                     </FormItem>
                   </Col>
                 </Row>
               </Form>
             </TabPane>);
          })
          }
        </Tabs>
      </Card>
    );
  }
}
