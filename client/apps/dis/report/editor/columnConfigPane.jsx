import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { message } from 'antd';
import { setDeleteSqlAttrIds } from 'common/reducers/disReport';
import DragDropColumnItem from '../dragComponents/dragDropColumnItem';
import { formatMsg } from '../message.i18n';


@injectIntl
@WithDragDropContext
@connect(state => ({
  reportObjectMeta: state.disReport.reportObjectMeta,
}), {
  setDeleteSqlAttrIds,
})
export default class ColumnConfigPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    sqlAttributes: PropTypes.arrayOf(PropTypes.shape({
      column_name: PropTypes.string,
      field: PropTypes.string,
    })),
    groupByFields: PropTypes.arrayOf(PropTypes.shape({
      column_name: PropTypes.string,
      field: PropTypes.string,
    })),
    handleReportFieldChange: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.groupByFields.length === 0 && this.props.groupByFields &&
      this.props.groupByFields.length !== 0) {
      const sqlAttributes = nextProps.sqlAttributes.map((attr) => {
        const sqlAttr = { ...attr };
        if (sqlAttr.sub_query_field) {
          sqlAttr.sub_query_field = '';
          sqlAttr.update = true;
        }
        return sqlAttr;
      });
      this.props.handleReportFieldChange(sqlAttributes);
    }
  }
  msg = formatMsg(this.props.intl)
  handleDrop = ({
    label, field, oldField, bizObject, oldBizObject,
  }) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    if (sqlAttributes.find(item =>
      item && (item.field === field && item.bizObject === bizObject))) {
      message.info('该列已存在');
      return;
    }
    if (oldField) {
      const index = sqlAttributes.findIndex(item =>
        item.field === oldField && item.bizObject === oldBizObject);
      sqlAttributes.splice(index + 1, 0, { label, field, bizObject });
      for (let i = index + 1; i < sqlAttributes.length; i++) {
        const attr = sqlAttributes[i];
        attr.column_seq = i;
        attr.update = true;
      }
    } else {
      sqlAttributes.splice(sqlAttributes.length - 1, 0, {
        label, field, bizObject, column_seq: sqlAttributes.length - 1, update: true,
      });
    }
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleDelete = (index) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    if (sqlAttributes[index].id) {
      this.props.setDeleteSqlAttrIds(sqlAttributes[index].id);
    }
    sqlAttributes.splice(index, 1);
    for (let i = index; i < sqlAttributes.length; i++) {
      sqlAttributes[i].column_seq -= 1;
      sqlAttributes[i].update = true;
    }
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleResetColumn = (index) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    sqlAttributes[index].order_by = '';
    sqlAttributes[index].sub_query_field = '';
    sqlAttributes[index].update = true;
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleSetFormula = (formula, index) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    if (sqlAttributes[index].sub_query_field === formula) {
      sqlAttributes[index].sub_query_field = '';
    } else {
      sqlAttributes[index].sub_query_field = formula;
    }
    sqlAttributes[index].update = true;
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleSetOrderBy = (sortRule, index) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    if (sqlAttributes[index].order_by === sortRule) {
      sqlAttributes[index].order_by = '';
    } else {
      sqlAttributes[index].order_by = sortRule;
    }
    sqlAttributes[index].update = true;
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleColumnMove = (dragIndex, hoverIndex) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    const attr = sqlAttributes[dragIndex];
    sqlAttributes.splice(dragIndex, 1);
    sqlAttributes.splice(hoverIndex, 0, attr);
    let fromIndex = dragIndex;
    let endIndex = hoverIndex;
    if (dragIndex > hoverIndex) {
      fromIndex = hoverIndex;
      endIndex = dragIndex;
    }
    for (let i = fromIndex; i <= endIndex; i++) {
      const changeOne = sqlAttributes[i];
      changeOne.column_seq = i;
      changeOne.update = true;
    }
    this.props.handleReportFieldChange(sqlAttributes);
  }
  handleColumnNameChange = (value, index) => {
    const sqlAttributes = [...this.props.sqlAttributes];
    sqlAttributes[index].column_name = value;
    sqlAttributes[index].update = true;
    this.props.handleReportFieldChange(sqlAttributes);
  }
  render() {
    const { sqlAttributes, reportObjectMeta, groupByFields } = this.props;
    const reportColumnsConfig = sqlAttributes.map((attr, index) => {
      let objField = {};
      if (reportObjectMeta[attr.bizObject]) {
        objField = reportObjectMeta[attr.bizObject].find(field => field.bm_field === attr.field);
        if (!objField) {
          objField = {};
        }
      }
      const columnName = attr.column_name || attr.label ||
          (objField && (objField.bmf_label_name || objField.bmf_default_name));
      return (<DragDropColumnItem
        dataType={objField.bmf_data_type}
        attr={{
          name: columnName,
          field: attr.field,
          oldBizObject: attr.bizObject,
          dataType: objField.bmf_data_type,
          subQueryField: attr.sub_query_field,
          orderBy: attr.order_by,
        }}
        handleDrop={this.handleDrop}
        handleColumnMove={this.handleColumnMove}
        index={index}
        handleColumnNameChange={this.handleColumnNameChange}
        handleDelete={this.handleDelete}
        handleResetColumn={this.handleResetColumn}
        handleSetFormula={this.handleSetFormula}
        handleSetOrderBy={this.handleSetOrderBy}
        groupByFields={groupByFields}
        key={columnName}
      />);
    });
    return (
      <div className="pane-content-padding columns-container">
        {reportColumnsConfig}
      </div>
    );
  }
}
