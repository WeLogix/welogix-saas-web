import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, Select, Radio, Row, Col, message } from 'antd';
import { toggleCreateMetricModal } from 'common/reducers/disAnalytics';
import { YMetricEditor, checkFormula, insertOperatorField, useAggreate, getParentAggr, expNodesToCharNodes } from './YMetricEditor';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;

const twoLineLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const oneLineLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const formItemStyle = { marginBottom: 5 };

@injectIntl
@connect(
  state => ({
    axis: state.disAnalytics.createMetricModal.axis,
    xFieldsCount: state.disAnalytics.createMetricModal.xFieldsCount,
    visible: state.disAnalytics.createMetricModal.visible,
    dwSubjectField: state.disAnalytics.dwSubjectField,
    chartUid: state.disAnalytics.createMetricModal.chartUid,
    chartSubject: state.disAnalytics.currentChart.dana_chart_subject,
    countFields: state.disAnalytics.countFields,
  }),
  {
    toggleCreateMetricModal,
  }
)
export default class CreateYFormulaMetricModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    onYFormulaAxisChange: PropTypes.func.isRequired,
    subAxisy: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    axisy: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    cursorPosition: 0,
    formData: {},
    formulaEdited: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      const { axis, xFieldsCount } = nextProps;
      const formData = {
        ...axis,
        dana_metric_formula: [],
      };
      if (axis.dana_metric_formula) {
        formData.dana_metric_formula = axis.dana_metric_formula;
      } else if (axis.dana_metric_aggreate === 'uniq' && axis.dana_axisy_metricuid) {
        formData.dana_metric_formula.push({ content: axis.dana_axisy_metricuid, type: 'metricvar' });
        formData.dana_axisy_metricuid = undefined;
      } else if (axis.field) {
        if (xFieldsCount) {
          formData.dana_metric_formula.push({ content: 'SUM', offset: 1, type: 'function' });
        }
        formData.dana_metric_formula.push({ content: axis.field, type: 'variable' });
      }
      this.setState({ formData });
    }
    if (nextProps.visible !== this.props.visible) {
      this.setState({ formulaEdited: false });
    }
  }
  handleInsertField = (value) => { // 同算符
    const {
      cursorPosition,
      formData,
      formData: { dana_metric_formula: formulaExprNodes },
    } = this.state;
    const [type, content] = value.split('|');
    const warnMessage = insertOperatorField({
      itemQueueParam: formulaExprNodes,
      cursorPosition,
      content,
      type,
    });
    if (warnMessage) {
      message.warn(warnMessage, 1);
    } else {
      this.setState({
        cursorPosition: cursorPosition + 1,
        formData: { ...formData, dana_metric_formula: formulaExprNodes },
      });
    }
  }
  handleUseAggreate = (aggrType) => {
    const {
      cursorPosition,
      formData,
      formData: { dana_metric_formula: formulaExprNodes },
    } = this.state;
    const warnMessage = useAggreate({
      itemQueueParam: formulaExprNodes,
      cursorPosition,
      content: aggrType,
      type: 'function',
    });
    if (warnMessage) {
      message.warn(warnMessage, 1);
      return;
    }
    this.setState({
      cursorPosition: cursorPosition + 1,
      formData: { ...formData, dana_metric_formula: formulaExprNodes },
    });
    this.setState({ cursorPosition: cursorPosition + 1 });
  }
  handleCancel = () => {
    this.props.toggleCreateMetricModal(false);
  }
  handleOk = () => {
    const {
      axis, subAxisy, axisy,
    } = this.props;
    const {
      formulaEdited,
      formData,
      formData: { dana_metric_formula: formulaExprNodes },
    } = this.state;
    if (!formData.name) {
      message.warn('请输入度量名称', 1);
      return;
    }
    const axisArr = formData.axisType === 'subAxisy' ? subAxisy : axisy;
    if (axisArr.findIndex(ax => ax.name === formData.name) !== -1 &&
      axisArr.findIndex(ax => ax.name === formData.name) !== formData.index
    ) {
      message.warn('该名称已存在', 1);
      return;
    }
    if (formulaExprNodes.length === 0) {
      message.warn('请输入计算规则', 1);
      return;
    }
    if (axis.dana_metric_formula === null && !formulaEdited) {
      this.props.toggleCreateMetricModal(false);
    } else {
      const { passed } = checkFormula(formulaExprNodes);
      if (passed) {
        const formCommit = {
          ...axis,
          dana_axisy_secondary: formData.axisType === 'subAxisy',
          dana_metric_formula: formulaExprNodes,
          name: formData.name,
          dana_axisy_num_percent: formData.dana_axisy_num_percent,
          dana_axisy_num_precision: formData.dana_axisy_num_precision,
          dana_metric_aggreate: formData.dana_metric_aggreate === 'uniq' ? undefined : formData.dana_metric_aggreate,
          dana_axisy_metricuid: formData.dana_axisy_metricuid,
        };
        this.props.onYFormulaAxisChange(formCommit, axis.axisType, axis.index, formulaEdited);
        this.props.toggleCreateMetricModal(false);
      }
    }
  }
  msg = formatMsg(this.props.intl)
  fieldOptions = []
  aggrOptions = []
  collectFieldOpts = (ele) => {
    this.fieldOptions.push(ele);
  }
  collectAggrOpts = (ele) => {
    this.aggrOptions.push(ele);
  }
  handleFormValueChange = field => (val) => {
    this.setState({ formData: { ...this.state.formData, [field]: val } });
  }
  handleFormEvChange = field => (event, transform) => {
    let newEvVal = event.target.value;
    if (transform === 'number') {
      newEvVal = !newEvVal ? parseInt(newEvVal, 10) : 0;
    }
    this.setState({ formData: { ...this.state.formData, [field]: newEvVal } });
  }
  hanldeFormulaChange = (newFormulaNodes) => {
    const { formData } = this.state;
    this.setState({
      formData: { ...formData, dana_metric_formula: newFormulaNodes },
      formulaEdited: true,
    });
  }
  render() {
    const {
      visible, dwSubjectField, chartSubject, countFields,
    } = this.props;
    const { cursorPosition, formData } = this.state;
    const formulaExprNodes = formData.dana_metric_formula;
    let aggAvailable = false;
    if (visible && (formulaExprNodes.length > 0)) {
      const charObjQueue = expNodesToCharNodes(formulaExprNodes);
      const parentAggr = getParentAggr({
        itemQueue: formulaExprNodes,
        charObjQueue,
        cursorPosition,
      });
      const leftCharObj = charObjQueue[cursorPosition - 1];
      const rightCharObj = charObjQueue[cursorPosition];
      aggAvailable = !parentAggr &&
        ((leftCharObj && formulaExprNodes[leftCharObj.itemIndex].type === 'variable') ||
        (rightCharObj && formulaExprNodes[rightCharObj.itemIndex].type === 'variable'));
    }
    if (!dwSubjectField[chartSubject]) {
      return null;
    }
    const { measureFields } = dwSubjectField[chartSubject];
    return (
      <Modal
        maskClosable={false}
        title={this.msg('addCalcMeasure')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={650}
      >
        <Form>
          <FormItem label={this.msg('metricName')} {...twoLineLayout} style={formItemStyle} required>
            <Input
              value={formData.name}
              onChange={this.handleFormEvChange('name')}
            />
          </FormItem>
          <Row>
            <Col span={10}>
              <FormItem label={this.msg('pickAField')} {...twoLineLayout} style={formItemStyle}>
                <div ref={(div) => { this.fieldSelect = div; }}>
                  <Select
                    showSearch
                    onChange={this.handleInsertField}
                    optionFilterProp="labelName"
                    allowClear
                    value={undefined}
                  >
                    <OptGroup label="计数字段">
                      {countFields.map(cf => (<Option key={`${cf.dana_metric_uid}`} value={`metricvar|${cf.dana_metric_uid}`}>
                        <div ref={this.collectFieldOpts} style={{ width: '100%', display: 'inline-block' }}>
                          {cf.dana_metric_name}
                        </div>
                      </Option>))}
                    </OptGroup>
                    <OptGroup label="度量字段">
                      {measureFields.map(mf => (<Option key={`${mf.bm_object}.${mf.bm_field}`} value={`variable|${mf.bm_field}`}>
                        <div ref={this.collectFieldOpts} style={{ width: '100%', display: 'inline-block' }}>
                          {mf.bmf_label_name}
                        </div>
                      </Option>))}
                    </OptGroup>
                  </Select>
                </div>
              </FormItem>
            </Col>
            <Col span={10} offset={4}>
              <FormItem label={this.msg('pickAggreate')} {...twoLineLayout} style={formItemStyle}>
                <div ref={(div) => { this.aggrSelect = div; }}>
                  <Select
                    disabled={!aggAvailable}
                    onChange={this.handleUseAggreate}
                    value={undefined}
                  >
                    <Option value="SUM">
                      <div ref={this.collectAggrOpts} style={{ width: '100%', display: 'inline-block' }}>
                        去重求和
                      </div>
                    </Option>
                    <Option value="AVG">
                      <div ref={this.collectAggrOpts} style={{ width: '100%', display: 'inline-block' }}>
                        平均值
                      </div>
                    </Option>
                    <Option value="MAX">
                      <div ref={this.collectAggrOpts} style={{ width: '100%', display: 'inline-block' }}>
                        最大值
                      </div>
                    </Option>
                    <Option value="MIN">
                      <div ref={this.collectAggrOpts} style={{ width: '100%', display: 'inline-block' }}>
                        最小值
                      </div>
                    </Option>
                  </Select>
                </div>
              </FormItem>
            </Col>
          </Row>
          <YMetricEditor
            visible={visible}
            formulaExprNodes={formulaExprNodes}
            cursorPosition={cursorPosition}
            writeCursorPosition={val => this.setState({ cursorPosition: val })}
            writeYMetricFormula={this.hanldeFormulaChange}
            selectEles={{
              fieldSelect: this.fieldSelect,
              aggrSelect: this.aggrSelect,
              aggrOptions: this.aggrOptions,
              fieldOptions: this.fieldOptions,
            }}
            measureFields={measureFields}
          />
          <FormItem label={this.msg('resultFormat')} {...oneLineLayout} style={formItemStyle}>
            <RadioGroup
              value={formData.dana_axisy_num_percent}
              onChange={this.handleFormEvChange('dana_axisy_num_percent')}
            >
              <Radio value={0}>数值型</Radio>
              <Radio value={1}>百分比(%)</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label={this.msg('intOrFloat')} {...oneLineLayout} style={formItemStyle}>
            <Select
              key="select"
              onChange={this.handleFormValueChange('dana_axisy_num_precision')}
              style={{ width: 140 }}
              value={formData.dana_axisy_num_precision === 0 ?
                formData.dana_axisy_num_precision : 1}
            >
              <Option value={0}>整数</Option>
              <Option value={1}>保留小数位</Option>
            </Select>
            {formData.dana_axisy_num_precision > 0 ? <Input
              key="input"
              type="number"
              addonAfter="位"
              onChange={this.handleFormEvChange('dana_axisy_num_precision', 'number')}
              value={formData.dana_axisy_num_precision}
              style={{ width: 100, marginLeft: 15 }}
            /> : null}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
