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

class DeclChart extends React.Component {
  render() {
    const data = [
      {
        name: '进口',
        一月: 86,
        二月: 28,
        三月: 78,
        四月: 81,
        五月: 97,
        六月: 120,
        七月: 146,
        八月: 152,
        九月: 137,
        十月: 109,
        十一月: 125,
        十二月: 134,
      },
      {
        name: '出口',
        一月: 0,
        二月: 0,
        三月: 0,
        四月: 0,
        五月: 0,
        六月: 0,
        七月: 0,
        八月: 5,
        九月: 0,
        十月: 3,
        十一月: 0,
        十二月: 0,
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
      value: '月申报单量', // value字段
    });
    return (
      <div>
        <Chart height={240} data={dv} forceFit>
          <Axis name="月份" />
          <Axis name="月申报单量" />
          <Legend />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="interval"
            position="月份*月申报单量"
            color="name"
            adjust={[
              {
                type: 'dodge',
                marginRatio: 1 / 32,
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default DeclChart;
