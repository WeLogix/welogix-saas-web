import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { intlShape, injectIntl } from 'react-intl';
import { loadDimensionMeasureFields, loadChartFromList, loadDwDataList } from 'common/reducers/disAnalytics';
import ChartViewer from './chartViewer';

@connect(
  state => ({
    dwSubjectField: state.disAnalytics.dwSubjectField,
  }),
  { loadDimensionMeasureFields, loadChartFromList, loadDwDataList }
)
export default class ChartContainer extends Component {
  static propTypes = {
    chartUid: PropTypes.string.isRequired,
    onChartConfigLoad: PropTypes.func,
    thumbnailMode: PropTypes.bool,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    chartResData: [],
    thisChart: {},
    chartAxisXs: [],
    chartAxisYs: [],
  }
  componentDidMount() {
    this.props.loadChartFromList(this.props.chartUid).then((result) => {
      if (!result.error) {
        this.setState({
          thisChart: result.data.chart,
          chartAxisXs: result.data.axisx,
          chartAxisYs: result.data.axisy,
        });
        if (this.props.onChartConfigLoad) {
          this.props.onChartConfigLoad(result.data.chart);
        }
        if (!this.props.dwSubjectField[result.data.chart.dana_chart_subject]) {
          this.props.loadDimensionMeasureFields(result.data.chart.dana_chart_subject);
        }
      }
    });
    this.props.loadDwDataList({
      chartUid: this.props.chartUid,
    }).then((result) => {
      if (!result.error) {
        this.setState({ chartResData: result.data });
      }
    });
  }
  render() {
    const { chartParams, thumbnailMode } = this.props;
    const {
      thisChart, chartAxisXs, chartAxisYs, chartResData,
    } = this.state;
    const viewerChartProp = {
      dana_chart_graph: thisChart.dana_chart_graph,
      dana_chart_subject: thisChart.dana_chart_subject,
    };
    if (thisChart.dana_chart_barchart) {
      viewerChartProp.dana_chart_barchart = JSON.parse(thisChart.dana_chart_barchart).view;
    }
    if (!viewerChartProp.dana_chart_barchart) {
      viewerChartProp.dana_chart_barchart = 'stacked';
    }
    return (
      <ChartViewer
        thumbnailMode={thumbnailMode}
        chart={viewerChartProp}
        chartAxisYs={chartAxisYs}
        chartAxisXs={chartAxisXs}
        chartParams={chartParams}
        chartData={chartResData}
      />);
  }
}
