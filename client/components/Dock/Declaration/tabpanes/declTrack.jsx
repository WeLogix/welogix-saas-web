import React from 'react';
import moment from 'moment';
import { Card, Timeline, Empty } from 'antd';
import { CMS_DECL_STATUS, INSPECT_STATUS } from 'common/constants';

export default function declTrackPane(props) {
  const { head } = props;
  const TimelineItems = [];
  if (head.status >= CMS_DECL_STATUS.sent.value) {
    TimelineItems.push(<Timeline.Item key="sent">
      <div>发送申报</div>
      <div>{head.d_date && moment(head.d_date).format('YYYY/MM/DD HH:mm')}</div>
    </Timeline.Item>);
    if (head.customs_inspect >= INSPECT_STATUS.inspecting.value ||
      head.ciq_quality_inspect >= INSPECT_STATUS.inspecting.value) {
      TimelineItems.push(<Timeline.Item key="sent">
        <div>查验下达</div>
        <div>{head.customs_inspect_date && moment(head.customs_inspect_date).format('YYYY/MM/DD HH:mm')}</div>
      </Timeline.Item>);
    }
    if ((head.customs_inspect === INSPECT_STATUS.finish.value
      && head.ciq_quality_inspect !== INSPECT_STATUS.inspecting.value) ||
      (head.ciq_quality_inspect === INSPECT_STATUS.finish.value
      && head.customs_inspect !== INSPECT_STATUS.inspecting.value)) {
      TimelineItems.push(<Timeline.Item key="sent">
        <div>商检查验通过</div>
        <div>{head.customs_inspect_end_date && moment(head.customs_inspect_end_date).format('YYYY/MM/DD HH:mm')}</div>
      </Timeline.Item>);
    }
    if (head.status >= CMS_DECL_STATUS.released.value) {
      TimelineItems.push(<Timeline.Item key="sent">
        <div>报关单放行</div>
        <div>{head.clear_date && moment(head.clear_date).format('YYYY/MM/DD HH:mm')}</div>
      </Timeline.Item>);
    }
  }
  return (
    <div className="pane-content tab-pane">
      <Card
        bordered={false}
        bodyStyle={{ padding: 16, paddingTop: 32 }}
      >
        {TimelineItems.length > 0 ? <Timeline>{TimelineItems}</Timeline> : <Empty description="暂无追踪记录" />}
      </Card>
    </div>
  );
}
