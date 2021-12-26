import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Icon, Timeline, message } from 'antd';
import RowAction from 'client/components/RowAction';
import { LogixIcon } from 'client/components/FontIcon';
import RptBoxDropTarget from '../dragComponents/rptBoxDropTarget';
import '../index.less';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(state => ({
  reportObjectMeta: state.disReport.reportObjectMeta,
}))
export default class GroupBox extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    groupByFields: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string,
      label: PropTypes.string,
    })).isRequired,
    handleGroupFieldsChange: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleDrop = ({
    label, field, oldField, bizObject, groupable,
  }) => {
    if (!groupable) {
      message.warn('该字段无法作为分组字段', 5);
      return;
    }
    const groupByFields = [...this.props.groupByFields];
    if (groupByFields.find(item => item.field === field && item.bizObject === bizObject)) {
      message.info('该字段已存在');
      return;
    }
    let index;
    if (oldField) {
      index = groupByFields.findIndex(item => item.field === oldField);
    } else {
      index = groupByFields.length;
    }
    groupByFields[index] = { label, field, bizObject };
    this.props.handleGroupFieldsChange(groupByFields);
  }
  handleDeleteGroupField = (index) => {
    const groupByFields = [...this.props.groupByFields];
    groupByFields.splice(index, 1);
    this.props.handleGroupFieldsChange(groupByFields);
  }
  render() {
    const { groupByFields, reportObjectMeta } = this.props;
    let fields = [];
    const objNames = Object.keys(reportObjectMeta);
    for (let i = 0, len = objNames.length; i < len; i++) {
      const objName = objNames[i];
      fields = fields.concat(reportObjectMeta[objName]);
    }
    return (
      <div className="filter-group">
        <Timeline>
          <Timeline.Item dot={<Icon type="down-square" theme="outlined" />}>
            <span className="filter-symbol"><LogixIcon type="icon-groupby" style={{ color: '#1890ff' }} /> {this.msg('groupFields')}</span>
          </Timeline.Item>
          {groupByFields.map((gf, index) => {
            const objField = fields.find(field => field.bm_field === gf.field);
            return (<Timeline.Item color="gray" key={gf.field}>
              <RptBoxDropTarget
                // name={gf.label || (objField &&
                //   (objField.bmf_label_name || objField.bmf_default_name))}
                field={gf.field}
                handleDrop={this.handleDrop}
              >
                {gf.label || (objField && (objField.bmf_label_name || objField.bmf_default_name))}
              </RptBoxDropTarget>
              {gf.field && <RowAction icon="delete" onClick={() => this.handleDeleteGroupField(index)} />}
            </Timeline.Item>);
          })}

          <Timeline.Item color="gray">
            <RptBoxDropTarget handleDrop={this.handleDrop} />
          </Timeline.Item>
        </Timeline>
      </div>
    );
  }
}
