import React from 'react';
import { Progress } from 'antd';
import './style.less';


const StatsBar = ({
  title, value, ...rest
}) => (
  <div className="stats-bar">
    <div className="stats-bar-top">
      <div className="stats-bar-title">{title}</div>
      <div className="stats-bar-value">{value}</div>
    </div>
    <Progress {...rest} size="small" showInfo={false} />
  </div>);

export default StatsBar;
