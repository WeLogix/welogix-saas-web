/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class ValueTaxChart extends React.Component {
  render() {
    const data = [
      {
        name: '增值税',
        一月: 86 * 1830,
        二月: 28 * 1730,
        三月: 78 * 1830,
        四月: 81 * 2030,
        五月: 97 * 1230,
        六月: 120 * 1730,
        七月: 146 * 1830,
        八月: 152 * 1530,
        九月: 137 * 1330,
        十月: 325373.41,
        十一月: 205100.44,
        十二月: 225100.44,
      },
      {
        name: '关税',
        一月: 86 * 2590,
        二月: 28 * 2390,
        三月: 78 * 2990,
        四月: 81 * 2490,
        五月: 97 * 2690,
        六月: 120 * 2720,
        七月: 146 * 2930,
        八月: 152 * 2730,
        九月: 137 * 1790,
        十月: 325373.41,
        十一月: 359343.41,
        十二月: 379373.41,
      },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      // 展开字段集
      key: '月份',
      // key字段
      value: '月缴税金', // value字段
    });
    return (
      <div>
        <Chart height={360} data={dv} forceFit>
          <Legend />
          <Axis name="月份" />
          <Axis name="月缴税金" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="月份*月缴税金"
            color="name"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ValueTaxChart;
