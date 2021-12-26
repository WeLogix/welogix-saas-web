import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, message, Select, Card, Icon } from 'antd';
import { createCountFields, getCountFields, updateCountFields, getCountFieldsWhereClauses } from 'common/reducers/disAnalytics';
import FilterBox from '../../common/filterBox';
import DataRangeDropItem from '../dragComponents/dataRangeDropItem';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailFormItemLayout = {
  wrapperCol: { span: 14, offset: 6 },
};

@injectIntl
@connect(
  state => ({
    dwSubjectField: state.disAnalytics.dwSubjectField,
    oldWhereClauses: state.disAnalytics.whereClauses,
    countFieldsList: state.disAnalytics.countFields,
    currentChart: state.disAnalytics.currentChart,
  }),
  {
    createCountFields,
    getCountFields,
    updateCountFields,
    getCountFieldsWhereClauses,
  }
)
@Form.create()
export default class EditCountFieldsCard extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    oldWhereClauses: PropTypes.arrayOf(PropTypes.arrayOf({})),
    countFieldsList: PropTypes.arrayOf(PropTypes.shape({
      dana_chart_uid: PropTypes.string,
      dana_metric_name: PropTypes.string,
      dana_metric_uid: PropTypes.string,
    })),
    currentChart: PropTypes.shape({
      dana_chart_uid: PropTypes.string,
    }).isRequired,
  }
  state = {
    whereClauseFieldsLists: [],
  }
  componentDidMount() {
    const { countFieldInfo } = this.props;
    if (countFieldInfo) {
      this.props.getCountFieldsWhereClauses(countFieldInfo.metric_uid).then((result) => {
        if (!result.error) {
          this.setState({ whereClauseFieldsLists: result.data, countFieldInfo });
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const nextMetricUid = nextProps.countFieldInfo && nextProps.countFieldInfo.metric_uid;
    const currentMeUid = this.props.countFieldInfo && this.props.countFieldInfo.metric_uid;
    if (nextMetricUid && nextMetricUid !== currentMeUid) {
      this.props.getCountFieldsWhereClauses(nextMetricUid).then((result) => {
        if (!result.error) {
          this.setState({
            whereClauseFieldsLists: result.data,
            countFieldInfo: nextProps.countFieldInfo,
          });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCountFieldSaved = (updateCountField) => {
    this.props.onCountFieldEdit(updateCountField);
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const {
          currentChart, countFieldInfo, dwSubjectField, countFieldsList,
        } = this.props;
        const { measureFields } = dwSubjectField[currentChart.dana_chart_subject];
        const { whereClauseFieldsLists } = this.state;
        const measureNameList = measureFields.filter(fd =>
          fd.bmf_label_name).map(fields => fields.bmf_label_name);
        let countNameList;
        if (countFieldInfo) {
          countNameList = countFieldsList.filter(fd =>
            fd.dana_metric_name !== countFieldInfo.dana_metric_name)
            .map(fields => fields.dana_metric_name);
        } else {
          countNameList = countFieldsList.map(fields => fields.dana_metric_name);
        }
        if (measureNameList.concat(countNameList).find(nm => nm === values.count_fields_name)) {
          message.warning('存在相同字段名称');
          return;
        }
        if (!countFieldInfo) {
          this.props.createCountFields(
            currentChart.dana_chart_uid,
            whereClauseFieldsLists,
            values,
          ).then((result) => {
            if (!result.error) {
              message.success('添加成功');
              this.props.getCountFields(currentChart.dana_chart_uid);
              this.handleCountFieldSaved();
            } else {
              message.error(result.error);
            }
          });
        } else {
          this.props.updateCountFields(
            countFieldInfo.metric_uid,
            whereClauseFieldsLists,
            values,
          ).then((result) => {
            if (!result.error) {
              message.success('修改成功');
              this.handleCountFieldSaved({
                dana_metric_uid: countFieldInfo.metric_uid,
                dana_metric_name: values.count_fields_name,
              });
              this.props.getCountFields(currentChart.dana_chart_uid);
            } else {
              message.error(result.error);
            }
          });
        }
      } else {
        message.warning('名称或字段为空');
      }
    });
  }
  handleAddFilterBox = () => {
    const { whereClauseFieldsLists } = this.state;
    whereClauseFieldsLists.push([]);
    this.setState({ whereClauseFieldsLists });
  }
  handleDeleteBox = (index) => {
    const { whereClauseFieldsLists } = this.state;
    whereClauseFieldsLists.splice(index, 1);
    this.setState({ whereClauseFieldsLists });
  }
  handleFilterChange = (filterList, index) => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists[index] = filterList;
    this.setState({
      whereClauseFieldsLists,
    });
  }
  handleFilterDelete = (index) => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists.splice(index, 1);
    this.setState({
      whereClauseFieldsLists: whereClauseFieldsLists.map((list, listIndex) =>
        list.map(item => ({ ...item, rpt_wherecls_seq: listIndex }))),
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      dwSubjectField,
      oldWhereClauses,
      currentChart,
    } = this.props;
    const { whereClauseFieldsLists, countFieldInfo } = this.state;
    const { dimensionFields, dwObjectMeta } = dwSubjectField[currentChart.dana_chart_subject];
    return (
      <Card
        size="small"
        title="自定义计数字段"
        extra={<Icon type="close" onClick={() => this.handleCountFieldSaved()} />}
      >
        <Col span={8}>
          <Form>
            <FormItem label="计数字段名称" {...formItemLayout}>
              {getFieldDecorator('count_fields_name', {
                initialValue: countFieldInfo && countFieldInfo.dana_metric_name,
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
            <FormItem label="选择计数字段" {...formItemLayout}>
              {getFieldDecorator('count_fields', {
                initialValue: countFieldInfo && countFieldInfo.dana_metric_field,
                rules: [{ required: true }],
              })(<Select
                optionFilterProp="children"
                showSearch
                allowClear
              >
                {dimensionFields.map(fd => (<Option
                  key={fd.bm_field}
                  value={fd.bm_field}
                >{fd.bmf_label_name}</Option>))}
              </Select>)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={() => this.handleSubmit()}>{this.msg('save')}</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={16}>
          {whereClauseFieldsLists.length > 0 &&
            whereClauseFieldsLists.map((whereClauseFieldsList, index) => (
              <div className="filter-box">
                <FilterBox
                  whereClauseFieldsList={whereClauseFieldsList}
                  index={index}
                  editable
                  deletable
                  rptParams={this.props.chartParams}
                  handleFilterChange={this.handleFilterChange}
                  handleFilterDelete={this.handleFilterDelete}
                  DropTarget={DataRangeDropItem}
                  reportObjectMeta={dwObjectMeta}
                  oldWhereClauses={oldWhereClauses}
                />
                {(index !== whereClauseFieldsLists.length - 1) &&
                (<div className="divide-line">
                  <span className="divide-text">或(OR)</span>
                </div>)}
              </div>))}
          <Button type="dashed" block onClick={this.handleAddFilterBox}>{this.msg('addCondition')}</Button>
        </Col>
      </Card>
    );
  }
}
