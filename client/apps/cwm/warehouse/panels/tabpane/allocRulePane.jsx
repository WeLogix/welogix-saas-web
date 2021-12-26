import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Divider, Button, Form, Radio, Input, Switch, Tooltip, Icon, message, Select } from 'antd';
import { updateWhOwnerControl } from 'common/reducers/cwmWarehouse';
import { ALLOC_MATCH_FIELDS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { Group: InputGroup } = Input;
const RadioGroup = Radio.Group;

const PRECED_LABEL_MAP = {
  1: '先进先出',
  2: '同库位优先',
};

function AllocMatchFieldForm(props) {
  const {
    label, field, onChange, formItemLayout, setting, countries,
  } = props;
  function handleChange(key, value) {
    const newSetting = { ...setting };
    newSetting[key] = value;
    onChange(field, newSetting);
  }
  if (!setting) {
    return null;
  }
  return (
    <FormItem {...formItemLayout} label={label}>
      <InputGroup compact>
        <Select
          style={{ width: 80 }}
          value={setting.enabled}
          onChange={checked => handleChange('enabled', checked)}
        >
          <Option value={false}>禁用</Option>
          <Option value>启用</Option>
        </Select>
        {field === 'country' ? (
          <Select
            showSearch
            optionFilterProp="children"
            value={setting.eigen}
            disabled={!setting.enabled}
            onSelect={val => handleChange('eigen', val)}
            style={{ width: 'calc(100% - 80px)' }}
            placeholder="输入特征值"
            allowClear
          >
            {countries.map(country => (<Option key={country.cntry_co} value={country.cntry_co}>
              {country.cntry_co}|{country.cntry_name_cn}
            </Option>))}
          </Select>
        ) : <Input
          value={setting.eigen}
          style={{ width: 'calc(100% - 80px)' }}
          onChange={ev => handleChange('eigen', ev.target.value)}
          disabled={!setting.enabled}
          placeholder="输入特征值"
        />}
      </InputGroup>
    </FormItem>);
}

@injectIntl
@connect(
  state => ({
    countries: state.saasParams.latest.country,
    ownerAlloc: state.cwmWarehouse.allocRulePane.ownerAllocRule,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  { updateWhOwnerControl }
)
export default class AllocRulePane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ownerAlloc: PropTypes.shape({
      id: PropTypes.number.isRequired,
      alloc_rule: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string })),
      alloc_preced: PropTypes.number,
      owner_code: PropTypes.string.isRequired,
    }),
  }
  state = {
    allocRule: {},
    allocPreced: 1,
  }
  componentDidMount() {
    this.handleAllocSetting(this.props.ownerAlloc);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.handleAllocSetting(nextProps.ownerAlloc);
    }
  }
  msg = formatMsg(this.props.intl)
  handleAllocSetting = (ownerAlloc) => {
    const allocRules = ownerAlloc.alloc_rule;
    const allocRuleState = {};
    allocRules.forEach((rule) => {
      allocRuleState[rule.key] = { enabled: true, eigen: rule.eigen };
    });
    ALLOC_MATCH_FIELDS.forEach((amf) => {
      if (!allocRuleState[amf.field]) {
        allocRuleState[amf.field] = { enabled: false };
      }
    });
    this.setState({ allocRule: allocRuleState, allocPreced: ownerAlloc.alloc_preced || 1 });
  }
  handleSettingChange = (field, setting) => {
    const allocRuleState = { ...this.state.allocRule };
    allocRuleState[field] = setting;
    this.setState({ allocRule: allocRuleState });
  }
  handleAllocPrecedChange = (radev) => {
    this.setState({ allocPreced: radev.target.value });
  }
  handleCancel = () => {
    this.setState({ allocRule: {} });
    this.props.onClose();
  }

  handleSubmit = () => {
    const rules = [];
    const originRules = this.props.ownerAlloc.alloc_rule;
    Object.keys(this.state.allocRule).forEach((rulekey) => {
      if (this.state.allocRule[rulekey].enabled) {
        rules.push({ key: rulekey, eigen: this.state.allocRule[rulekey].eigen });
      }
    });
    const fieldLabelMap = {};
    ALLOC_MATCH_FIELDS.forEach((field) => {
      fieldLabelMap[field.field] = field.label;
    });
    const fields = rules.map(rule => rule.key);
    const contentLog = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const oldValue = originRules.find(item => item.key === field) &&
        originRules.find(item => item.key === field).eigen;
      const value = rules.find(item => item.key === field) &&
        rules.find(item => item.key === field).eigen;
      if (oldValue !== value &&
        !(!oldValue && !value)) {
        contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
      }
    }
    const allocControl = { alloc_rule: JSON.stringify(rules) };
    if (this.state.allocPreced !== this.props.ownerAlloc.alloc_preced) {
      const oldPreced = PRECED_LABEL_MAP[String(this.props.ownerAlloc.alloc_preced || 1)];
      const newPreced = PRECED_LABEL_MAP[String(this.state.allocPreced)];
      contentLog.push(`自动配货顺序由 [${oldPreced}] 改为 [${newPreced}]`);
      allocControl.alloc_preced = this.state.allocPreced;
    }
    this.props.updateWhOwnerControl(
      this.props.ownerAlloc.id,
      allocControl,
      this.props.defaultWhse.code,
      contentLog.length > 0 ? `修改配货规则, 货主[${this.props.ownerAlloc.owner_code}], ${contentLog.join(';')}` : '',
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handleCancel();
      }
    });
  }
  render() {
    const { allocRule, allocPreced } = this.state;
    const { countries } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form>
        <FormItem {...formItemLayout} label="优先策略">
          <RadioGroup onChange={this.handleAllocPrecedChange} value={allocPreced}>
            <Radio key="fifo" value={1}>
              {PRECED_LABEL_MAP['1']}
            </Radio>
            <Radio key="locprior" value={2}>
              {PRECED_LABEL_MAP['2']}
            </Radio>
          </RadioGroup>
        </FormItem>
        <Divider orientation="left">匹配限制条件</Divider>
        <FormItem {...formItemLayout} label="库别">
          <Switch checked />
          <Tooltip title="出库库别须与库存库别完全一致(空库别只对应库别为空的库存)">
            <Icon type="info-circle-o" />
          </Tooltip>
        </FormItem>
        {ALLOC_MATCH_FIELDS.map(amf => (
          <AllocMatchFieldForm
            field={amf.field}
            formItemLayout={formItemLayout}
            label={amf.label}
            onChange={this.handleSettingChange}
            setting={allocRule[amf.field]}
            key={amf.field}
            countries={countries}
          />
        ))}
        <div className="ant-modal-footer" style={{ width: '100%', backgroundColor: 'white' }}>
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </div>
      </Form>
    );
  }
}
