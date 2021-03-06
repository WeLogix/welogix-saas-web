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
        fieldVal = value; // 0. ??????
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
      message.error('??????????????????');
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
      message.error('???????????????????????????');
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
      message.error('??????????????????????????????????????????');
      return;
    }
    let boundError = false;
    if (highLimit >= 0) {
      if (highLimit <= mediumLimit || highLimit <= lowLimit) {
        message.error('???????????????????????????????????????');
        boundError = true;
      }
    }
    if (mediumLimit >= 0) {
      if (mediumLimit <= lowLimit) {
        message.error('???????????????????????????????????????');
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
          <Button type="ghost" icon="plus" onClick={this.handleNewExceptRule} disabled={!!editRiskRule}>??????????????????????????????</Button>
        }
      >
        <Tabs activeKey={currTabKey} onChange={this.handleTabChange}>
          <TabPane tab={this.msg('uniformRule')} key="uniform" disabled={checkNonCurrTabDisable && currTabKey !== 'uniform'}>
            <Form>
              <Row gutter={16}>
                <Col sm={24} lg={12}>
                  <FormItem label={this.msg('ruleDesc')}>
                    <Input defaultValue="??????????????????????????????????????????" disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={12}>
                  <FormItem label={this.msg('bizObject')}>
                    <Input defaultValue={this.msg('cmsDeclManifest')} disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('???????????????????????????')}>
                    <Input defaultValue="|(?????????????????? - ????????????) / ???????????? * 100%|" disabled />
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('??????????????????')} required>
                    <Row>
                      <Col span={10}>
                        <Input
                          addonBefore="??????"
                          value={uniformRule.ref_timelimit}
                          onChange={ev => this.handleUniformRuleEdit('ref_timelimit', ev.target.value, 'int')}
                          addonAfter={
                            <Select
                              style={{ width: 100 }}
                              value={uniformRule.ref_timelevel}
                              onChange={val => this.handleUniformRuleEdit('ref_timelevel', val)}
                            >
                              <Option key="times" value="t">???</Option>
                              <Option key="days" value="d">???</Option>
                              <Option key="weeks" value="w">???</Option>
                              <Option key="months" value="m">???</Option>
                              <Option key="quarters" value="q">???</Option>
                              <Option key="years" value="y">???</Option>
                            </Select>}
                        />
                      </Col>
                      <Col span={14}>
                        <Select showSearch value={uniformRule.statmethod} onChange={val => this.handleUniformRuleEdit('statmethod', val)}>
                          <Option key="median" value={1}>?????????</Option>
                          <Option key="avg" value={2}>???????????????</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col sm={24} lg={24}>
                  <FormItem label={this.msg('????????????')}>
                    <Row>
                      <Col span={3}><Input value="?????????" /></Col>
                      <Col span={8}><Input
                        addonBefore="??????"
                        value={uniformRule.high_thresh < 0 ? '' : uniformRule.high_thresh}
                        onChange={ev => this.handleUniformRuleEdit('high_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="??????????????????" value={uniformRule.high_alarm} onChange={val => this.handleUniformRuleEdit('high_alarm', val)}>
                          <Option key="notification" value={1}>??????</Option>
                          <Option key="pendtask" value={2}>??????</Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}><Input value="????????????" /></Col>
                      <Col span={8}><Input
                        addonBefore="??????"
                        value={uniformRule.medium_thresh < 0 ? '' : uniformRule.medium_thresh}
                        onChange={ev => this.handleUniformRuleEdit('medium_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="??????????????????" value={uniformRule.medium_alarm} onChange={val => this.handleUniformRuleEdit('medium_alarm', val)}>
                          <Option key="notification" value={1}>??????</Option>
                          <Option key="pendtask" value={2}>??????</Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}><Input value="?????????" /></Col>
                      <Col span={8}><Input
                        addonBefore="??????"
                        value={uniformRule.low_thresh < 0 ? '' : uniformRule.low_thresh}
                        onChange={ev => this.handleUniformRuleEdit('low_thresh', ev.target.value, 'float')}
                        addonAfter="%"
                      /></Col>
                      <Col span={8}>
                        <Select allowClear placeholder="??????????????????" value={uniformRule.low_alarm} onChange={val => this.handleUniformRuleEdit('low_alarm', val)}>
                          <Option key="notification" value={1}>??????</Option>
                          <Option key="pendtask" value={2}>??????</Option>
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
             <TabPane tab={`??????${idx + 1}`} key={exceptKey} disabled={checkNonCurrTabDisable && currTabKey !== exceptKey}>
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
                     <FormItem label={this.msg('??????????????????')} required>
                       <Row>
                         <Col span={10}>
                           <Input
                             addonBefore="??????"
                             value={excptRule.ref_timelimit}
                             onChange={ev => this.handleExceptRuleEdit(idx, 'ref_timelimit', ev.target.value, 'int')}
                             addonAfter={<Select
                               style={{ width: 100 }}
                               value={excptRule.ref_timelevel}
                               onChange={val => this.handleExceptRuleEdit(idx, 'ref_timelevel', val)}
                             >
                               <Option key="times" value="t">???</Option>
                               <Option key="days" value="d">???</Option>
                               <Option key="weeks" value="w">???</Option>
                               <Option key="months" value="m">???</Option>
                               <Option key="quarters" value="q">???</Option>
                               <Option key="years" value="y">???</Option>
                             </Select>}
                           />
                         </Col>
                         <Col span={14}>
                           <Select showSearch value={excptRule.statmethod} onChange={val => this.handleExceptRuleEdit(idx, 'statmethod', val)}>
                             <Option key="median" value={1}>?????????</Option>
                             <Option key="avg" value={2}>???????????????</Option>
                           </Select>
                         </Col>
                       </Row>
                     </FormItem>
                   </Col>
                   <Col sm={24} lg={24}>
                     <FormItem label={this.msg('????????????')}>
                       <Row>
                         <Col span={3}><Input value="?????????" /></Col>
                         <Col span={8}><Input
                           addonBefore="??????"
                           value={excptRule.high_thresh < 0 ? '' : excptRule.high_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'high_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="??????????????????" value={excptRule.high_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'high_alarm', val)}>
                             <Option key="notification" value={1}>??????</Option>
                             <Option key="pendtask" value={2}>??????</Option>
                           </Select>
                         </Col>
                       </Row>
                       <Row>
                         <Col span={3}><Input value="????????????" /></Col>
                         <Col span={8}><Input
                           addonBefore="??????"
                           value={excptRule.medium_thresh < 0 ? '' : excptRule.medium_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'medium_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="??????????????????" value={excptRule.medium_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'medium_alarm', val)}>
                             <Option key="notification" value={1}>??????</Option>
                             <Option key="pendtask" value={2}>??????</Option>
                           </Select>
                         </Col>
                       </Row>
                       <Row>
                         <Col span={3}><Input value="?????????" /></Col>
                         <Col span={8}><Input
                           addonBefore="??????"
                           value={excptRule.low_thresh < 0 ? '' : excptRule.low_thresh}
                           onChange={ev => this.handleExceptRuleEdit(idx, 'low_thresh', ev.target.value, 'float')}
                           addonAfter="%"
                         /></Col>
                         <Col span={8}>
                           <Select allowClear placeholder="??????????????????" value={excptRule.low_alarm} onChange={val => this.handleExceptRuleEdit(idx, 'low_alarm', val)}>
                             <Option key="notification" value={1}>??????</Option>
                             <Option key="pendtask" value={2}>??????</Option>
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
