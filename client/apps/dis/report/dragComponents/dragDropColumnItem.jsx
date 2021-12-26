import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Popover, Modal, Checkbox, Tooltip } from 'antd';
import { DropTarget, DragSource } from 'react-dnd';
import { intlShape, injectIntl } from 'react-intl';
import EditableCell from 'client/components/EditableCell';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from '../message.i18n';
import ItemTypes from './itemTypes';

const { confirm } = Modal;
const CheckboxGroup = Checkbox.Group;

const dragSource = {
  beginDrag(props) {
    return {
      source: 'fromRptColumn',
      index: props.index,
    };
  },
};

const dropSource = {
  hover(props, monitor) {
    const dragItem = monitor.getItem();
    const { index: dragIndex, source } = dragItem;
    if (source === 'fromRptColumn') {
      const hoverIndex = props.index;
      if (dragIndex === hoverIndex || !props.attr.name) {
        return;
      }
      props.handleColumnMove(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    }
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    if (item.source !== 'fromRptColumn') {
      props.handleDrop({
        label: item.label,
        field: item.field,
        dataType: item.dataType,
        paramType: item.paramType,
        oldField: props.attr.field,
        oldBizObject: props.attr.oldBizObject,
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
@DragSource(ItemTypes.OBJ_FIELD, dragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@injectIntl
export default class DragDropColumnItem extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    attr: PropTypes.shape({
      name: PropTypes.string,
      dataType: PropTypes.string,
      field: PropTypes.string,
      oldBizObject: PropTypes.string,
    }),
    handleColumnNameChange: PropTypes.func.isRequired,
    // handleColumnMove: PropTypes.func.isRequired,
    // handleDelete: PropTypes.func.isRequired,
    // handleResetColumn: PropTypes.func.isRequired,
    handleSetFormula: PropTypes.func.isRequired,
    handleSetOrderBy: PropTypes.func.isRequired,
    groupByFields: PropTypes.arrayOf(PropTypes.shape({
      column_name: PropTypes.string,
      field: PropTypes.string,
    })),
  };
  msg = formatMsg(this.props.intl)
  handleResetColumn = () => {
    const { index } = this.props;
    const self = this;
    confirm({
      title: this.msg('resetConfirm'),
      okText: this.msg('yes'),
      cancelText: this.msg('nope'),
      onOk() {
        self.props.handleResetColumn(index);
      },
      onCancel() {
      },
    });
  }
  handleDelete = () => {
    const { index } = this.props;
    const self = this;
    confirm({
      title: this.msg('deleteConfirm'),
      okText: this.msg('yes'),
      cancelText: this.msg('nope'),
      onOk() {
        self.props.handleDelete(index);
      },
      onCancel() {
      },
    });
  }
  handleSetFormula = (values) => {
    const value = values.pop(); // 当前选择的值总是会在最后一个
    const { index } = this.props;
    this.props.handleSetFormula(value, index);
  }
  handleSetOrderBy = (values) => {
    const value = values.pop();
    const { index } = this.props;
    this.props.handleSetOrderBy(value, index);
  }
  render() {
    const {
      isOver, canDrop, connectDropTarget, attr: {
        name, dataType, orderBy, field, subQueryField,
      }, connectDragSource, index, handleColumnNameChange, groupByFields,
    } = this.props;
    const formulaValue = subQueryField;
    const sort = orderBy;
    const formulaOptions = [
      { label: this.msg('colCount'), value: `COUNT(DISTINCT ${field})` },
    ];
    if (dataType === 'NUMBER') {
      formulaOptions.push({
        label: this.msg('colSum'),
        value: `sum(${field})`,
        disabled: groupByFields.filter(item => item.field).length === 0,
      }, {
        label: this.msg('colAvg'),
        value: `avg(${field})`,
        disabled: groupByFields.filter(item => item.field).length === 0,
      });
    }
    let content = '拖拽字段到此区域';
    let className = 'report-column-config';
    if (name) {
      content = <EditableCell value={name} btnPosition="bottom" onSave={value => handleColumnNameChange(value, index)} />;
    } else {
      className = 'report-column-config report-column-empty';
    }
    const isActive = canDrop && isOver;
    let backgroundColor;
    if (isActive) {
      backgroundColor = '#e1edfa';
    } else if (canDrop) {
      backgroundColor = '#ffffff';
    }
    if (name) {
      return connectDragSource(connectDropTarget(<span
        className={className}
        style={{ backgroundColor }}
      >
        {name ? <Card
          style={{ width: 170 }}
          actions={[
            <Popover content={<span>
              <CheckboxGroup
                options={formulaOptions}
                value={[formulaValue]}
                onChange={this.handleSetFormula}
              />
            </span>}
            >
              <LogixIcon type="icon-yunsuannengli" />
            </Popover>,
            <Popover content={<span>
              <CheckboxGroup
                options={[
                  { label: this.msg('colAsc'), value: 'asc' },
                  { label: this.msg('colDesc'), value: 'desc' },
                ]}
                value={[sort]}
                onChange={this.handleSetOrderBy}
              />
            </span>}
            >
              <Icon type="sort-descending" />
            </Popover>,
            <Tooltip title={this.msg('reset')}>
              <Icon type="undo" onClick={this.handleResetColumn} />
            </Tooltip>,
            <Tooltip title={this.msg('delete')}>
              <Icon type="delete" onClick={this.handleDelete} />
            </Tooltip>,
           ]}
        >
          {content}
        </Card> : content}
      </span>));
    }
    return connectDropTarget(<span
      className={className}
      style={{ backgroundColor }}
    >
      {content}
    </span>);
  }
}
