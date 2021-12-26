import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import { Icon, Select, Input, message, Button } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import ItemTypes from './itemTypes';

const { Option } = Select;

const dropSource = {
  drop(props, monitor) {
    // Obtain the dragged item
    const item = monitor.getItem();
    const { axis: { field, bizObject }, axisType } = props;
    if ((item.axisType === 'axisx' && axisType === 'axisx') ||
    (item.axisType === 'axisy' && (axisType === 'axisy' || axisType === 'subAxisy'))) {
      props.handleDrop({
        label: item.label,
        field: item.field,
        dataType: item.dataType,
        oldField: field,
        oldBizObject: bizObject,
        bizObject: item.bizObject,
        index: props.index,
        axisType,
        metricUid: item.metricUid,
      });
    } else {
      message.warn('请移动到相应坐标轴');
    }
  },
};

@DropTarget(ItemTypes.OBJ_FIELD, dropSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
}))
export default class AxisDropItem extends Component {
  static propTypes = {
    onToggleCreateMetricModal: PropTypes.func,
  };
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.children !== this.props.children;
  // }
  handleTimeLevelChange = (value) => {
    const { index } = this.props;
    this.props.handleTimeLevelChange(index, value);
  }
  render() {
    const {
      isOver, canDrop, connectDropTarget, children, extra, index, axis, axisType,
    } = this.props;
    let content = '拖拽字段到此区域';
    let className = 'drop-area';
    if (children) {
      content = children;
      className = typeof content === 'string' ? 'drop-area-fill' : '';
    }
    const isActive = canDrop && isOver;
    let backgroundColor;
    if (isActive) {
      backgroundColor = '#e1edfa';
    } else if (canDrop) {
      backgroundColor = '#ffffff';
    }
    return connectDropTarget(<span>
      <span className={className} style={{ backgroundColor }} >
        {(axisType === 'axisx' && (axis.dataType === 'DATE' || axis.dana_axisx_time_level)) && <Input addonBefore={
          <Select defaultValue={axis.dana_axisx_time_level || 'YEAR'} onChange={this.handleTimeLevelChange}>
            <Option value="YEAR">年</Option>
            <Option value="QUARTER">季</Option>
            <Option value="MONTH">月</Option>
            <Option value="DAY">日</Option>
          </Select>
          }
        />}
        {children && axisType !== 'axisx' && <Input addonBefore={
          <Button onClick={this.props.onToggleCreateMetricModal}>
            <LogixIcon type="icon-function" />
          </Button>
          }
        />}
        {<span title={children} style={{ paddingLeft: 8 }}>{content}</span>}
        {children && <Icon type="close" style={{ cursor: 'pointer' }} onClick={() => this.props.handleDelete(index, axisType)} />}
      </span>
      {extra}
    </span>);
  }
}
