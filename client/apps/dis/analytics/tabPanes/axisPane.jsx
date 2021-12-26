import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Row, Typography, message } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import { toggleCreateMetricModal } from 'common/reducers/disAnalytics';
import AxisDropItem from '../dragComponents/axisDropItem';
import CreateYFormulaMetricModal from '../modal/createYFormulaMetricModal';
import { formatMsg } from '../message.i18n';

const { Text } = Typography;

@injectIntl
@connect(
  () => ({
  }),
  { toggleCreateMetricModal },
)
export default class AxisPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onAxisChange: PropTypes.func.isRequired,
    axisy: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    axisx: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    subAxisy: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    subYaxisEnable: PropTypes.bool.isRequired,
    onSubYAxisToggle: PropTypes.func.isRequired,
  }
  getActionAxis = (axisType) => {
    let axis = [];
    if (axisType === 'axisx') {
      axis = [...this.props.axisx];
    } else if (axisType === 'axisy') {
      axis = [...this.props.axisy];
    } else if (axisType === 'subAxisy') {
      axis = [...this.props.subAxisy];
    }
    return axis;
  }
  handleAxisDrop = ({
    index, label, bizObject, field, axisType, dataType, metricUid,
  }) => {
    const axis = this.getActionAxis(axisType);
    if (axis.find(ax => ax.name === label)) {
      message.info('该字段已存在');
      return;
    }
    const measure = axis[index];
    measure.name = label;
    measure.field = field;
    measure.bizObject = bizObject;
    measure.dataType = dataType;
    measure.dana_metric_formula = null;
    if (axisType === 'axisx' && dataType === 'DATE') {
      measure.dana_axisx_time_level = 'YEAR';
    } else if (axisType === 'axisx' && dataType !== 'DATE') {
      measure.dana_axisx_time_level = '';
    }
    if (axisType === 'axisy') {
      measure.dana_axisy_secondary = false;
    } else if (axisType === 'subAxisy') {
      measure.dana_axisy_secondary = true;
    }
    if (metricUid) {
      measure.dana_metric_aggreate = 'uniq';
      measure.dana_axisy_metricuid = metricUid;
    } else {
      measure.dana_metric_aggreate = null;
      measure.dana_axisy_metricuid = null;
    }
    if (index === axis.length - 1 && axis.length < 5) {
      axis.push({});
    }
    this.props.onAxisChange(axisType, axis);
  }
  handleYFormulaChange = (axi, axisType, index) => {
    const axis = this.getActionAxis(axisType); // x y subY
    const fieldPrefix = axisType === 'subAxisy' ? 'subYFormula_' : 'YFormula_';
    axis[index] = { ...axi, field: `${fieldPrefix}${axis.filter(ax => ax.dana_metric_formula).length}` };
    if (index === axis.length - 1 && axis.length < 5) {
      axis.push({});
    }
    this.props.onAxisChange(axisType, axis);
  }
  handleAxisDelete = (index, axisType) => {
    const axis = this.getActionAxis(axisType);
    axis.splice(index, 1);
    if (axis.find(item => item.dana_metric_formula)) {
      let formulaIndex = 0;
      const fieldPrefix = axisType === 'subAxisy' ? 'subYFormula_' : 'YFormula_';
      for (let i = 0; i < axis.length; i++) {
        if (axis[i].dana_metric_formula) {
          axis[i].field = `${fieldPrefix}${formulaIndex}`;
          formulaIndex += 1;
        }
      }
    }
    if (axis[axis.length - 1].name) {
      axis.push({});
    }
    this.props.onAxisChange(axisType, axis);
  }
  handleTimeLevelChange = (index, timeLevel) => {
    const axis = [...this.props.axisx];
    const dimension = axis[index];
    dimension.dana_axisx_time_level = timeLevel;
    this.props.onAxisChange('axisx', axis);
  }
  handleToggleSubYaxis = () => {
    this.props.onSubYAxisToggle();
  }
  toggleCreateMetricModal = axis =>
    this.props.toggleCreateMetricModal(true, axis, this.props.axisx.length - 1)
  msg = formatMsg(this.props.intl);
  render() {
    const { subYaxisEnable } = this.props;
    const axisy = [...this.props.axisy];
    const axisx = [...this.props.axisx];
    const subAxisy = [...this.props.subAxisy];
    return (
      <div className="axis">
        <Row>
          <Text strong style={{ marginRight: 47 }}>X轴</Text> {axisx.map((axis, index) =>
          (<AxisDropItem
            axis={axis}
            handleDrop={this.handleAxisDrop}
            index={index}
            handleDelete={this.handleAxisDelete}
            axisType="axisx"
            handleTimeLevelChange={this.handleTimeLevelChange}
            key={axis.field}
          >
            {axis.name}
          </AxisDropItem>))}
        </Row>
        <Row>
          <Text strong style={{ marginRight: 48 }}>Y轴</Text> {axisy.map((axis, index) =>
          (<AxisDropItem
            axis={axis}
            handleDrop={this.handleAxisDrop}
            index={index}
            handleDelete={this.handleAxisDelete}
            axisType="axisy"
            key={axis.name}
            onToggleCreateMetricModal={() => this.toggleCreateMetricModal({ ...axis, axisType: 'axisy', index })}
          >
            {axis.name}
          </AxisDropItem>))}
          {(axisy.length > 0 && !axisy[axisy.length - 1].name) && <Button type="dashed" onClick={() => this.toggleCreateMetricModal({ axisType: 'axisy', index: axisy.length - 1 })} style={{ marginRight: 8 }}>
            <LogixIcon type="icon-function" />
          </Button>}
          {!subYaxisEnable &&
            <a onClick={this.handleToggleSubYaxis} style={{ marginLeft: 24 }}>启用次坐标</a>}
        </Row>
        {subYaxisEnable &&
        <Row>
          <Text strong style={{ marginRight: 6 }}>Y轴次坐标</Text> {subAxisy.map((axis, index) =>
          (<AxisDropItem
            axis={axis}
            handleDrop={this.handleAxisDrop}
            index={index}
            handleDelete={this.handleAxisDelete}
            axisType="subAxisy"
            key={axis.name}
            onToggleCreateMetricModal={() => this.toggleCreateMetricModal({ ...axis, axisType: 'subAxisy', index })}
          >
            {axis.name}
          </AxisDropItem>))}
          {(subAxisy.length > 0 && !subAxisy[subAxisy.length - 1].name) && <Button type="dashed" onClick={() => this.toggleCreateMetricModal({ axisType: 'subAxisy', index: subAxisy.length - 1 })} style={{ marginRight: 8 }}>
            <LogixIcon type="icon-function" />
          </Button>}
          <a onClick={this.handleToggleSubYaxis} style={{ marginLeft: 24 }}>禁用次坐标</a>
        </Row>}
        <CreateYFormulaMetricModal
          onYFormulaAxisChange={this.handleYFormulaChange}
          subAxisy={subAxisy}
          axisy={axisy}
        />
      </div>
    );
  }
}
