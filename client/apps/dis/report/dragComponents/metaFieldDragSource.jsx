import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LogixIcon } from 'client/components/FontIcon';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';

const cardSource = {
  beginDrag(props) {
    const {
      bmf_default_name: defaultLabel,
      bmf_label_name: label,
      bm_field: field,
      bmf_data_type: dataType,
      bmf_param_type: paramType,
      bmf_groupable: groupable,
    } = props.field;
    return {
      label: label || defaultLabel,
      field,
      dataType,
      paramType,
      groupable,
      bizObject: props.bizObject,
      source: 'fromObject',
    };
  },
};

@DragSource(ItemTypes.OBJ_FIELD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class MetaFieldDragSource extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    field: PropTypes.shape({
      bmf_label_name: PropTypes.string,
      bmf_groupable: PropTypes.number,
      bmf_default_name: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      isDragging, connectDragSource,
      field: {
        bmf_label_name: label, bmf_data_type: bmdt,
        bmf_groupable: groupable, bmf_default_name: defaultLabel,
      },
    } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    return connectDragSource(<div className="drag-item" style={{ opacity }}>
      <LogixIcon type={`icon-${bmdt.toLowerCase()}`} style={{ color: '#08c' }} theme="twoTone" />
      {label || defaultLabel}{groupable ? <LogixIcon type="icon-groupby" style={{ position: 'absolute', right: 4 }} /> : ''}
    </div>);
  }
}
