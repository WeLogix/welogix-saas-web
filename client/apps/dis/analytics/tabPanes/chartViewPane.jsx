import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Button, Select, Form, Radio, Tooltip, message } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import { setAnalyticsEdited, loadDwDataList } from 'common/reducers/disAnalytics';
import ChartViewer from '../../common/chartViewer';

import { formatMsg } from '../../analytics/message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
@connect(
  state => ({
    currentChart: state.disAnalytics.currentChart,
    chartAxisXs: state.disAnalytics.chartAxisXs,
    chartAxisYs: state.disAnalytics.chartAxisYs,
  }),
  {
    setAnalyticsEdited, loadDwDataList,
  },
)
export default class ChartViewPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }),
    axisyList: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    axisxList: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    axissubyList: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    whereClauses: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
    }))),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    chartResData: [],
  }
  componentDidMount() {
    this.props.loadDwDataList({
      chartUid: this.props.chartUid,
    }).then((result) => {
      if (!result.error) {
        this.setState({ chartResData: result.data });
      }
    });
  }
  msg = formatMsg(this.props.intl);
  handleChartGraphChange = () => {
    this.props.setAnalyticsEdited(true);
  }
  hanldeBarchartChange = () => {
    this.props.setAnalyticsEdited(true);
  }
  handleOrderChange = () => {
    this.props.setAnalyticsEdited(true);
  }
  handleLimitChange = () => {
    this.props.setAnalyticsEdited(true);
  }
  handleApply = () => {
    const {
      axisxList, axisyList, axissubyList, currentChart,
      form: { getFieldsValue }, whereClauses,
    } = this.props;
    const formData = getFieldsValue();
    const whereConfs = [];
    for (let i = 0; i < whereClauses.length; i++) {
      const lists = whereClauses[i];
      for (let j = 0; j < lists.length; j++) {
        const field = lists[j];
        whereConfs.push({
          dana_metric_uid: field.dana_metric_uid,
          rpt_object: field.rpt_object,
          rpt_wherecls_seq: i,
          rpt_obj_field: field.rpt_obj_field,
          rpt_field_cmpop: field.rpt_field_cmpop,
          rpt_field_cmpvalue: field.rpt_field_cmpvalue,
          rpt_cmpvalue_source: field.rpt_cmpvalue_source,
        });
      }
    }
    this.props.loadDwDataList({
      chart: {
        dana_chart_subject: currentChart.dana_chart_subject,
        dana_chart_limit: formData.dana_chart_limit === 'all' ? '' : formData.dana_chart_limit,
        dana_chart_sortorder: formData.dana_chart_sortorder === 'default' ? '' : formData.dana_chart_sortorder,
        dana_chart_barchart: formData.dana_chart_barchart,
        dana_chart_graph: formData.dana_chart_graph,
        dana_chart_report_ref: currentChart.dana_chart_report_ref,
        dana_chart_uid: currentChart.dana_chart_uid,
      },
      axisXs: axisxList.filter(axis => axis.name).map((axis, index) => ({
        id: axis.id,
        dana_axisx_dimension: axis.field,
        dana_axisx_time_level: axis.dana_axisx_time_level,
        dana_axisx_dimension_seq: index,
        dana_axisx_name: axis.name,
      })),
      axisYs: axisyList.concat(axissubyList).filter(axis => axis.name).map(axis => ({
        id: axis.id,
        dana_axisy_secondary: axis.dana_axisy_secondary,
        dana_axisy_num_percent: axis.dana_axisy_num_percent,
        dana_axisy_num_format: axis.dana_axisy_num_format,
        dana_axisy_num_precision: axis.dana_axisy_num_precision,
        dana_axisy_name: axis.name,
        dana_axisy_metricuid: axis.dana_axisy_metricuid,
        dana_metric_field: axis.field,
        dana_metric_formula: axis.dana_metric_formula,
        dana_metric_aggreate: axis.dana_metric_aggreate,
      })),
      whereConfs,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      } else {
        this.setState({ chartResData: result.data });
      }
    });
  }
  render() {
    const {
      currentChart, form: { getFieldDecorator, getFieldValue },
      axisyList, axissubyList, axisxList, chartAxisYs, chartAxisXs,
    } = this.props;
    const { chartResData } = this.state;
    const dimensionFieldsCount = axisxList.filter(x => x.name).length;
    const axisyFieldsCount = axisyList.filter(y => y.name).length;
    const subAxisyFieldsCount = axissubyList.filter(y => y.name).length;
    const chartGraph = getFieldValue('dana_chart_graph');
    const barchartType = getFieldValue('dana_chart_barchart') || 'stacked';
    let barchartConf = { view: 'stacked' };
    if (currentChart.dana_chart_barchart) {
      barchartConf = JSON.parse(currentChart.dana_chart_barchart);
    }
    const chartViewSettle = (<Form layout="inline">
      <FormItem>
        {getFieldDecorator('dana_chart_graph', {
          rules: [{ required: true }],
          initialValue: currentChart.dana_chart_graph,
        })(<RadioGroup onChange={this.handleChartGraphChange}>
          <Tooltip title="柱状图">
            <RadioButton disabled={!(dimensionFieldsCount === 1 || (dimensionFieldsCount === 2 && (axisyFieldsCount === 1 || subAxisyFieldsCount === 1)))} value="bar"><LogixIcon type="icon-barchart" /></RadioButton>
          </Tooltip>
          <Tooltip title="折线图">
            <RadioButton disabled={!(dimensionFieldsCount === 1 && axisyFieldsCount >= 1)} value="line"><LogixIcon type="icon-line-chart" /></RadioButton>
          </Tooltip>
          <Tooltip title="饼图">
            <RadioButton disabled={!(dimensionFieldsCount === 1 && axisyFieldsCount === 1 && subAxisyFieldsCount === 0)} value="pie"><LogixIcon type="icon-piechart" /></RadioButton>
          </Tooltip>
          <Tooltip title="仪表盘">
            <RadioButton disabled={!(dimensionFieldsCount === 0 && axisyFieldsCount === 1)} value="gauge"><LogixIcon type="icon-gauge" /></RadioButton>
          </Tooltip>
          <Tooltip title="统计表">
            <RadioButton disabled={!(dimensionFieldsCount === 0)} value="table"><LogixIcon type="icon-table" /></RadioButton>
          </Tooltip>
          <Tooltip title="KPI">
            <RadioButton disabled={!(dimensionFieldsCount === 0 && axisyFieldsCount >= 1 && axisyFieldsCount <= 4)} value="kpi"><LogixIcon type="icon-KPI" /></RadioButton>
          </Tooltip>
        </RadioGroup>)}
      </FormItem>
      {chartGraph === 'bar' &&
      <FormItem label="柱状图配置">
        {getFieldDecorator('dana_chart_barchart', {
          initialValue: barchartConf.view,
        })(<Select style={{ width: 100 }} onChange={this.hanldeBarchartChange}>
          <Option key="stacked" value="stacked">堆叠</Option>
          <Option key="multiset" value="multiset">并列</Option>
        </Select>)}
      </FormItem>}
      <FormItem label="排序">
        {getFieldDecorator('dana_chart_sortorder', {
          initialValue: currentChart.dana_chart_sortorder || 'default',
        })(<Select style={{ width: 100 }} onChange={this.handleOrderChange}>
          <Option key="default" value="default">默认</Option>
          <Option key="asc" value="asc">升序</Option>
          <Option key="desc" value="desc">降序</Option>
        </Select>)}
      </FormItem>
      <FormItem label="数据显示">
        {getFieldDecorator('dana_chart_limit', {
          initialValue: currentChart.dana_chart_limit || '10',
        })(<Select style={{ width: 100 }} onChange={this.handleLimitChange}>
          <Option key="10" value="10">前10条</Option>
          <Option key="5" value="5">前5条</Option>
          <Option key="all" value="all">全部</Option>
        </Select>)}
      </FormItem>
    </Form>);
    return (
      <Card
        size="small"
        title={chartViewSettle}
        extra={<Button type="primary" onClick={this.handleApply}>{this.msg('apply')}</Button>}
      >
        <ChartViewer
          chart={{
            dana_chart_barchart: barchartType,
            dana_chart_graph: currentChart.dana_chart_graph,
            dana_chart_subject: currentChart.dana_chart_subject,
          }}
          chartAxisYs={chartAxisYs}
          chartAxisXs={chartAxisXs}
          chartParams={this.props.chartParams}
          chartData={chartResData}
        />
      </Card>
    );
  }
}
