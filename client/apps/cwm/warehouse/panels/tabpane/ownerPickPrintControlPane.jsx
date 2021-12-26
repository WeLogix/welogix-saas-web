import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Row, Col, Form, Tooltip, Icon, Select, Input, Switch, message, Checkbox } from 'antd';
import { PICK_PRINT_FIELDS } from 'common/constants';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { updateWhOwnerControl, toggleRecShipDock } from 'common/reducers/cwmWarehouse';
import DragItem from '../DragItem';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const initColumnRule = {};
PICK_PRINT_FIELDS.forEach((amf) => {
  initColumnRule[amf.field] = { enabled: false, text: amf.text };
});

@WithDragDropContext
@injectIntl
@connect(
  state => ({
    ownerAuthId: state.cwmWarehouse.recShipAttrsDock.whOwnerAuth.id,
    ownerCode: state.cwmWarehouse.recShipAttrsDock.whOwnerAuth.owner_code,
    printRuleJson: state.cwmWarehouse.recShipAttrsDock.whOwnerAuth.pick_print,
  }),
  { updateWhOwnerControl, toggleRecShipDock }
)
export default class OwnerPickPrintControlPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    printRuleJson: PropTypes.string,
  }
  state = {
    pickColumnRule: initColumnRule,
    pickOrder: [],
    printRemain: false,
    printBilling: false,
  }
  componentDidMount() {
    if (this.props.printRuleJson) {
      this.handlePrintSetting(JSON.parse(this.props.printRuleJson));
    }
  }
  msg = formatMsg(this.props.intl)
  handlePrintSetting = (printRule) => {
    const columnRule = {};
    const columns = (printRule.columns || []);
    columns.forEach((rule) => {
      columnRule[rule.key] = { enabled: true, text: rule.text, column: rule.column };
    });
    let disableFieldColumn = columns.length + 1;
    PICK_PRINT_FIELDS.forEach((amf) => {
      if (!columnRule[amf.field]) {
        columnRule[amf.field] = { enabled: false, text: amf.text, column: disableFieldColumn };
        disableFieldColumn += 1;
      }
    });
    this.setState({
      pickColumnRule: columnRule,
      pickOrder: printRule.pick_order,
      printRemain: printRule.print_remain,
      printBilling: printRule.print_whsebilling,
    });
  }
  handleSettingChange = (field, key, newValue) => {
    const columnRule = { ...this.state.pickColumnRule };
    columnRule[field] = { ...columnRule[field], [key]: newValue };
    const fieldQueue = Object.keys(columnRule)
      .map(fieldName => ({ ...columnRule[fieldName], fieldName }));
    this.setState({ pickColumnRule: this.handleSortField(fieldQueue) });
  }
  handlePrintColumnChange = (field, newColumn) => {
    const columnValue = parseInt(newColumn, 10);
    if (!Number.isNaN(columnValue)) {
      const columnRule = { ...this.state.pickColumnRule };
      let switchField;
      Object.keys(columnRule).forEach((rulekey) => {
        if (Number(columnRule[rulekey].column) === columnValue) {
          switchField = columnRule[rulekey];
        }
      });
      if (switchField) {
        switchField.column = Number(columnRule[field].column);
        columnRule[field].column = columnValue;
      }
      this.setState({ pickColumnRule: columnRule });
    }
  }
  handlePrintRemainCheck = (checked) => {
    this.setState({ printRemain: checked });
  }
  handleBillingCheck = (checked) => {
    this.setState({ printBilling: checked });
  }
  handlePickOrderChange = (order) => {
    this.setState({ pickOrder: order });
  }
  handleCancel = () => {
    this.setState({ pickColumnRule: {}, printRemain: false, pickOrder: null });
  }
  handleSubmit = () => {
    const {
      pickColumnRule, pickOrder, printRemain, printBilling,
    } = this.state;
    const control = {};
    const columns = [];
    Object.keys(pickColumnRule).forEach((rulekey) => {
      const rule = pickColumnRule[rulekey];
      if (rule.enabled) {
        columns.push({ key: rulekey, text: rule.text, column: rule.column });
      }
    });
    columns.sort((ra, rb) => ra.column - rb.column);
    for (let i = 0; i < columns.length; i++) {
      const rule = columns[i];
      if (rule.column < 1 || rule.column > columns.length) {
        message.error(`列序号必须在1与${columns.length}之间`);
        return;
      }
    }
    if (!pickOrder || pickOrder.length === 0) {
      message.error('排序字段至少选一个');
      return;
    }
    control.pick_print = JSON.stringify({
      columns,
      pick_order: pickOrder,
      print_remain: printRemain,
      print_whsebilling: printBilling,
    });
    this.props.updateWhOwnerControl(
      this.props.ownerAuthId,
      control,
      this.props.whseCode,
      `编辑控制属性, 货主[${this.props.ownerCode}]`,
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        this.props.toggleRecShipDock(false);
        this.setState({
          pickColumnRule: {},
          pickOrder: null,
          printRemain: false,
          printBilling: false,
        });
      }
    });
  }
  handlePickPrintChange = (newPickPrint) => {
    const control = { ...this.state.control };
    control.pick_print = JSON.stringify(newPickPrint);
    this.setState({ control });
  }
  handleSwapItem = (dragIndex, hoverIndex) => {
    const { pickColumnRule } = this.state;
    const fieldNames = Object.keys(pickColumnRule);
    const fieldQueue = fieldNames.map((fieldName) => {
      const ruleObj = pickColumnRule[fieldName];
      if (ruleObj.column === dragIndex) {
        return { ...ruleObj, column: hoverIndex, fieldName };
      } else if (ruleObj.column === hoverIndex) {
        return { ...ruleObj, column: dragIndex, fieldName };
      }
      return { ...ruleObj, fieldName };
    });

    this.setState({ pickColumnRule: this.handleSortField(fieldQueue) });
  }
  /** @param {{fieldName:string,column:number}[]} fieldQueue */
  handleSortField = (fieldQueue) => {
    const newPickColumnRule = {};
    const enabledObjs = fieldQueue.filter(obj => obj.enabled);
    enabledObjs.sort((a, b) => a.column - b.column);
    const unEnabledObjs = fieldQueue.filter(obj => !obj.enabled);
    enabledObjs.concat(unEnabledObjs).forEach((obj, index) => {
      newPickColumnRule[obj.fieldName] = {
        enabled: obj.enabled,
        text: obj.text,
        column: index + 1,
      };
    });
    return newPickColumnRule;
  }
  render() {
    const {
      pickColumnRule, pickOrder, printRemain, printBilling,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    PICK_PRINT_FIELDS.sort((left, right) => {
      if (pickColumnRule[left.field] && pickColumnRule[right.field]) {
        return pickColumnRule[left.field].column - pickColumnRule[right.field].column;
      } else if (pickColumnRule[left.field]) {
        return 1;
      } else if (pickColumnRule[right.field]) {
        return -1;
      }
      return 1;
    });
    return (
      <Form>
        <FormItem {...formItemLayout} label="是否打印计价单">
          <Switch checked={printBilling} onChange={this.handleBillingCheck} />
        </FormItem>
        <FormItem {...formItemLayout} label="打印库位余量列">
          <Switch checked={printRemain} onChange={this.handlePrintRemainCheck} />
        </FormItem>
        <FormItem {...formItemLayout} wrapperCol={{ span: 11 }} label="拣货单显示列">
          <Row>
            <Col span={4}>
              <Checkbox checked disabled />
            </Col>
            <Col span={20}>
              <Input value="项号" readOnly disabled />
            </Col>
          </Row>
          {PICK_PRINT_FIELDS.map((amf) => {
            const setting = pickColumnRule[amf.field];
            if (!setting) {
              return null;
            }

          const content = (<Row>
            <Col span={4}>
              <Checkbox checked={setting.enabled} onChange={event => this.handleSettingChange(amf.field, 'enabled', event.target.checked)} />
            </Col>
            <Col span={20}>
              <Input value={setting.text} readOnly={!setting.enabled} disabled={!setting.enabled} onChange={ev => this.handleSettingChange(amf.field, 'text', ev.target.value)} />
            </Col>
          </Row>);
          return setting.enabled ? (<DragItem
            id={setting.bm_field}
            key={setting.bm_field}
            index={setting.column}
            checked={setting.checked}
            content={content}
            swapItem={this.handleSwapItem}
            onChange={this.handleCheckBoxChange}
            onFixed={this.fixedColumns}
            fixed={setting.fixed}
          />) : content;
          })}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<span>拣货列表排序
            <Tooltip title="以选择字段先后顺序排序">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>}
        >
          <Select mode="multiple" value={pickOrder} onChange={this.handlePickOrderChange}>
            {PICK_PRINT_FIELDS.filter(ppf => ppf.field !== 'name').map(ppf => <Option value={ppf.field} key={ppf.field}>{ppf.text}</Option>)}
          </Select>
        </FormItem>
        <div className="ant-modal-footer" style={{ width: '100%', backgroundColor: 'white' }}>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
        </div>
      </Form>
    );
  }
}

