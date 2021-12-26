import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form, Checkbox, message, Row, Col } from 'antd';
import { updateWhOwnerControl } from 'common/reducers/cwmWarehouse';
import { SKU_REQUIRED_PROPS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@injectIntl
@connect(
  state => ({
    skuRulePane: state.cwmWarehouse.allocRulePane,
    skuRule: state.cwmWarehouse.allocRulePane.skuRule,
  }),
  { updateWhOwnerControl }
)
export default class SkuRulePane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    skuRulePane: PropTypes.shape({
      ownerAuthId: PropTypes.number.isRequired,
      sku_rule: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string })),
    }),
  }
  state = {
    skuRule: {
      requiredProps: [],
    },
  }
  componentDidMount() {
    this.handleRuleParse(this.props.skuRule.sku_rule);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.handleRuleParse(nextProps.skuRule.sku_rule);
    }
  }
  msg = formatMsg(this.props.intl)
  handleRuleParse = (skuRule) => {
    const ruleState = {
      requiredProps: skuRule.required_props,
    };
    this.setState({ skuRule: ruleState });
  }
  handlePropsRequireChange= (checkedVals) => {
    const ruleState = { ...this.state.skuRule };
    ruleState.requiredProps = checkedVals;
    this.setState({ skuRule: ruleState });
  }
  handleCancel = () => {
    this.setState({ skuRule: { } });
    this.props.onClose();
  }
  handleSubmit = () => {
    const rule = {
      required_props: this.state.skuRule.requiredProps,
    };
    this.props.updateWhOwnerControl(
      this.props.skuRule.ownerAuthId,
      { sku_rule: JSON.stringify(rule) }
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.handleCancel();
      }
    });
  }
  renderCheckBox = obj => (<Col span={8}>
    <Checkbox value={obj.value}>{obj.label}</Checkbox>
  </Col>)
  render() {
    const { skuRule } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form>
        <FormItem {...formItemLayout} label="必填属性">
          <CheckboxGroup
            style={{ width: '80%' }}
            value={skuRule.requiredProps}
            onChange={this.handlePropsRequireChange}
          >
            <Row style={{ height: '40px', lineHeight: '40px', marginBottom: '10px' }}>
              {SKU_REQUIRED_PROPS.slice(0, 3).map(this.renderCheckBox)}
            </Row>
            <Row>
              {SKU_REQUIRED_PROPS.slice(3).map(this.renderCheckBox)}
            </Row>
          </CheckboxGroup>
        </FormItem>
        <div className="ant-modal-footer" style={{ width: '100%', backgroundColor: 'white' }}>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
        </div>
      </Form>
    );
  }
}
