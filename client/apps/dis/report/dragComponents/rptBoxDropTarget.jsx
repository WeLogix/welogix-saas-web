import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './itemTypes';

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const dropSource = {
  drop(props, monitor) {
    // Obtain the dragged item
    const item = monitor.getItem();
    if (item.source === 'fromObject') {
      props.handleDrop({
        label: item.label,
        field: item.field,
        dataType: item.dataType,
        paramType: item.paramType,
        oldField: props.field,
        oldBizObject: props.bizObject,
        bizObject: item.bizObject,
        groupable: item.groupable,
      });
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
export default class dropInput extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.children !== this.props.children;
  // }
  render() {
    const {
      isOver, canDrop, connectDropTarget, children, extra,
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
        {content}
      </span>
      {extra}
    </span>);
  }
}
