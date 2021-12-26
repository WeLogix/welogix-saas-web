import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Empty } from 'antd';
import { Chart, Axis, Tooltip, Geom, Legend, Coord, Guide, Label } from 'bizcharts';
import DataSet from '@antv/data-set';

import { formatMsg } from '../analytics/message.i18n';

const { Html, Arc } = Guide;

const GeomColors = ['#01DF01', '#41a2fc', '#54ca76', '#fad248', '#FF4500'];
const subGeomColors = ['#0000FF', '#40E0D0', '#9400D3', '#045FB4', '#FF8000'];

function genData(
  chartGraph, chartData, chartAxisXs,
  allFields, chartParams
) {
  let dv = [];
  for (let i = 0; i < chartData.length; i++) {
    const chartResItem = { ...chartData[i] };
    if (chartResItem.y_secondary) {
      chartResItem.suby_value = chartResItem.y_value;
      chartResItem.y_value = undefined;
    }
    for (let j = 0; j < chartAxisXs.length; j++) {
      const xAxis = chartAxisXs[j];
      const xKey = `x${j + 1}`;
      const objectMetaField = allFields.find(field => field.bm_field === xAxis.field);
      if (objectMetaField) {
        const paramOptions = chartParams[objectMetaField.bmf_param_type];
        if (paramOptions && paramOptions.length > 0) {
          const option = paramOptions.find(op => String(op.value) === String(chartResItem[`${xKey}_value`]));
          if (option) {
            chartResItem[`${xKey}_value`] = option.text;
          }
        }
        chartResItem[xKey] = objectMetaField.bmf_label_name;
      }
    }
    dv.push(chartResItem);
  }
  if (chartGraph === 'pie') {
    const { DataView } = DataSet;
    dv = new DataView().source(dv).transform({
      type: 'percent',
      field: 'y_value',
      dimension: 'x1_value',
      as: 'percent',
    });
  }
  return dv;
}

@injectIntl
@connect(state => ({
  dwSubjectField: state.disAnalytics.dwSubjectField,
}))
export default class ChartViewer extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    chart: PropTypes.shape({
      dana_chart_barchart: PropTypes.string,
      dana_chart_graph: PropTypes.string,
      dana_chart_subject: PropTypes.string,
    }),
    chartAxisYs: PropTypes.arrayOf(PropTypes.shape({
      dana_metric_field: PropTypes.string,
    })),
    chartParams: PropTypes.shape({
      certMark: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      ciqOrganization: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      cnport: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      cnregion: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      country: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      currency: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      customs: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      district: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      origPlace: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      port: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      remissionMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      tradeMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      transMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      trxnMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      unit: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      exemptionWay: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      wrapType: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      vendor: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      supplier: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      intlTransMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      invShipRecv: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      inspectResultKind: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      paasFlow: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
    }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  onG2Instance = (g2Inst) => {
    this.chart = g2Inst;
    setTimeout(() => {
      this.chart.forceFit();
    }, 0);
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      chart, chartAxisYs, chartData, chartAxisXs, dwSubjectField, chartParams,
      thumbnailMode,
    } = this.props;
    if (!dwSubjectField[chart.dana_chart_subject]) {
      return <Empty />;
    }
    const barchartType = chart.dana_chart_barchart;
    const chartGraph = chart.dana_chart_graph;
    const { dimensionFields, measureFields } = dwSubjectField[chart.dana_chart_subject];
    const axisyFields = chartAxisYs.filter(axis => !axis.dana_axisy_secondary);
    const subAxisyFields = chartAxisYs.filter(axis => axis.dana_axisy_secondary);
    const dv = genData(
      chartGraph, chartData, chartAxisXs,
      dimensionFields.concat(measureFields), chartParams, thumbnailMode
    );
    const GeomProps = { enabled: false };
    const LineGeomProps = { enabled: false };
    const subGeomProps = { enabled: false };
    const LegendProps = { enabled: false };
    const AxisYProps = { enabled: false, name: 'y_value' };
    const AxisXProps = { enabled: false, name: 'x1_value' };
    const CoordProps = { enabled: false, radius: 0.75 };
    const TooltipProps = { enabled: false };
    const GuideProps = { enabled: false };
    const ArcProps = { enabled: false };
    const LabelProps = { enabled: false };
    const HtmlProps = { enabled: false };
    // yyyy-mm-dd 默认转成scale timeCat 数字类型显示问题
    // https://github.com/alibaba/BizCharts/issues/447  https://github.com/alibaba/BizCharts/issues/613
    const ChartProps = {
      enabled: false,
      animate: false,
      forceFit: true,
      padding: 'auto',
      data: dv,
      onGetG2Instance: this.onG2Instance,
    };
    if (chartGraph === 'bar') {
      ChartProps.enabled = dv.length > 0;
      AxisXProps.enabled = true;
      AxisYProps.enabled = true;
      GeomProps.enabled = true;
      GeomProps.type = 'interval';
      GeomProps.position = 'x1_value*y_value';
      if (barchartType) {
        GeomProps.adjust = [{ marginRatio: 1 / 32 }];
        if (barchartType === 'stacked') {
          GeomProps.adjust[0].type = 'stack';
        } else {
          GeomProps.adjust[0].type = 'dodge';
        }
        if (axisyFields.length > 1) {
          GeomProps.color = ['y'];
        } else if (barchartType === 'stacked' || chartAxisXs.length === 1) {
          GeomProps.color = ['x1_value'];
        } else {
          GeomProps.color = ['x2_value'];
        }
      }
      TooltipProps.crosshairs = { type: 'y' };
      TooltipProps.enabled = true;
      if (!thumbnailMode) {
        LegendProps.enabled = true;
      } else {
        AxisXProps.label = null;
        AxisYProps.label = null;
      }
    } else if (chartGraph === 'line') {
      ChartProps.enabled = dv.length > 0;
      AxisYProps.enabled = true;
      AxisXProps.enabled = true;
      GeomProps.enabled = true;
      GeomProps.type = 'line';
      GeomProps.position = 'x1_value*y_value';
      GeomProps.size = 2;
      GeomProps.color = ['y'];
      LineGeomProps.enabled = true;
      LineGeomProps.type = 'point';
      LineGeomProps.position = 'x1_value*y_value';
      LineGeomProps.size = 4;
      LineGeomProps.shape = 'circle';
      LineGeomProps.color = 'y';
      LineGeomProps.style = {
        stroke: '#fff',
        lineWidth: 1,
      };
      TooltipProps.enabled = true;
      TooltipProps.crosshairs = { type: 'y' };
      if (!thumbnailMode) {
        LegendProps.enabled = true;
      } else {
        AxisXProps.label = null;
        AxisYProps.label = null;
      }
    } else if (chartGraph === 'pie') {
      ChartProps.enabled = true;
      AxisXProps.enabled = true;
      AxisYProps.enabled = true;
      GeomProps.enabled = true;
      GeomProps.type = 'intervalStack';
      GeomProps.position = 'percent';
      GeomProps.color = ['x1_value'];
      GeomProps.tooltip = ['x1_value*percent',
        (item, percent) => ({
          name: item,
          value: `${(percent * 100).toFixed(2)}%`,
        })];
      GeomProps.style = {
        lineWidth: 1,
        stroke: '#fff',
      };
      CoordProps.enabled = true;
      CoordProps.type = 'theta';
      TooltipProps.enabled = true;
      TooltipProps.showTitle = false;
      TooltipProps.itemTpl = '<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>';
      if (!thumbnailMode) {
        LegendProps.enabled = true;
        LabelProps.enabled = true;
        LabelProps.content = 'percent';
        LabelProps.formatter = (val, item) => `${item.point.x1_value}:${(val * 100).toFixed(2)}%`;
      } else {
        AxisXProps.label = null;
        LabelProps.enabled = false;
      }
    } else if (chartGraph === 'gauge') {
      ChartProps.enabled = dv.length > 0;
      const gaugeData = dv[0] || { y: '', y_value: 0, max_y_value: 100 };
      if (!gaugeData.max_y_value) {
        gaugeData.max_y_value = 100;
      }
      ChartProps.scale = {
        y_value: {
          min: 0,
          max: gaugeData.max_y_value,
          tickInterval: gaugeData.max_y_value / 10,
          nice: false,
        },
      };
      GeomProps.enabled = true;
      GeomProps.type = 'point';
      GeomProps.position = 'y_value*1';
      GeomProps.shape = 'pointer';
      GeomProps.color = ['#1890FF'];
      GeomProps.active = false;
      AxisYProps.enabled = true;
      AxisYProps.line = null;
      AxisXProps.enabled = true;
      AxisXProps.name = '1';
      AxisXProps.visible = false;
      CoordProps.enabled = true;
      CoordProps.type = 'polar';
      CoordProps.startAngle = (-9 / 8) * Math.PI;
      CoordProps.endAngle = (1 / 8) * Math.PI;
      GuideProps.enabled = true;
      ArcProps.enabled = true;
      ArcProps.props = [
        {
          zIndex: 0,
          start: [0, 0.965],
          end: [gaugeData.max_y_value, 0.965],
          style: {
            stroke: '#CBCBCB',
            lineWidth: 18,
          },
        },
        {
          zIndex: 1,
          start: [0, 0.965],
          end: [gaugeData.y_value, 0.965],
          style: {
            stroke: '#1890FF',
            lineWidth: 18,
          },
        },
      ];
      HtmlProps.enabled = true;
      HtmlProps.position = ['50%', '95%'];
      HtmlProps.html = () => (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;">${gaugeData.y}</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${gaugeData.y_value}%</p></div>`);
    }
    if (!thumbnailMode && (chartGraph === 'bar' || chartGraph === 'line')) {
      TooltipProps.htmlContent = (title, items) => {
        const itemTpls = items.map((item, index) => {
          const data = item.point;
          const axis = chartAxisYs.find(y => y.name === item.name);
          let value;
          if (axis.dana_axisy_secondary) {
            value = data._origin.suby_value;
          } else {
            value = data._origin.y_value;
          }
          if (axis.dana_axisy_num_percent) {
            value = `${value}%`;
          }
          return `<li data-index=${index}><span style="background-color:${data.color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>${data._origin.y}: ${value}</li>`;
        });
        return `<div class="g2-tooltip"><div class="g2-tooltip-title" style="margin-bottom: 4px;">${title}</div><ul class="g2-tooltip-list">${itemTpls.join('')}</ul></div>`;
      };
      if (subAxisyFields.length > 0) {
        GeomProps.color = ['y', (value) => {
          const index = axisyFields.findIndex(axis => axis.name === value);
          if (index !== -1) {
            return GeomColors[index];
          }
          return null;
        }];
        subGeomProps.enabled = true;
        subGeomProps.type = chartGraph === 'line' ? 'interval' : 'line';
        subGeomProps.position = 'x1_value*suby_value';
        subGeomProps.color = ['y', (value) => {
          const index = subAxisyFields.findIndex(axis => axis.name === value);
          if (index !== -1) {
            return subGeomColors[index];
          }
          return null;
        }];
        if (chartGraph === 'line') {
          subGeomProps.adjust = [
            {
              type: 'dodge',
              marginRatio: 1 / 32,
            },
          ];
        }
        if (LegendProps.enabled) {
          LegendProps.custom = true;
          LegendProps.allowAllCanceled = true;
          LegendProps.items = axisyFields.map((axis, index) => ({
            value: axis.name,
            marker: chartGraph === 'line' ? {
              symbol: 'hyphen', stroke: GeomColors[index], radius: 5, lineWidth: 3,
            } : { symbol: 'square', fill: GeomColors[index], radius: 5 },
          })).concat(subAxisyFields.map((axis, index) => ({
            value: axis.name,
            marker: chartGraph === 'line' ? {
              symbol: 'square', fill: subGeomColors[index], radius: 5,
            } : {
              symbol: 'hyphen', stroke: subGeomColors[index], radius: 5, lineWidth: 3,
            },
          })));
          LegendProps.onClick = (ev) => {
            const { item: { value } } = ev;
            const geoms = this.chart.getAllGeoms();
            for (let i = 0; i < geoms.length; i++) {
              const geom = geoms[i];
              geom.getShapes().forEach((shape) => {
                const legend = shape;
                if ((shape.name === 'point' && shape._cfg.origin._origin.y === value) ||
              (shape.name === 'line' && shape._cfg.origin[0]._origin.y === value) ||
              (shape.name === 'interval' && shape._cfg.origin._origin.y === value)) {
                  legend._cfg.visible = !legend._cfg.visible;
                  legend.get('canvas').draw();
                }
              });
            }
          };
        }
      }
    }
    if (ChartProps.enabled) {
      if (thumbnailMode) {
        ChartProps.height = 123;
      }
      return (<Chart {...ChartProps} >
        {GeomProps.enabled && <Geom {...GeomProps} >
          {LabelProps.enabled && (<Label {...LabelProps} />)}
        </Geom>}
        {AxisYProps.enabled && <Axis {...AxisYProps} />}
        {AxisXProps.enabled && <Axis {...AxisXProps} />}
        {LineGeomProps.enabled && <Geom {...LineGeomProps} />}
        {subGeomProps.enabled && <Geom {...subGeomProps} />}
        {LegendProps.enabled && <Legend {...LegendProps} />}
        {CoordProps.enabled && <Coord {...CoordProps} />}
        {TooltipProps.enabled && <Tooltip {...TooltipProps} />}
        {GuideProps.enabled && <Guide {...GuideProps}>
          {ArcProps.enabled && ArcProps.props.map(item => (
            <Arc {...item} />
          ))}
          {HtmlProps.enabled && <Html {...HtmlProps} />}
        </Guide>}
      </Chart>);
    }
    return <Empty />;
  }
}
