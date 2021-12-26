import React from 'react';
import { Button, Popconfirm } from 'antd';

export default function FlowNodeFooterAction(props) {
  const { node, manualEnterFlowInstance } = props;
  if (node.multi_bizobj && node.in_degree === 0 && node.out_degree > 0 && node.primary) {
    return (
      <Popconfirm title="确定要复制?" onConfirm={manualEnterFlowInstance}>
        <Button size="small" shape="circle" icon="copy" style={{ marginRight: 8 }} />
      </Popconfirm>
    );
  }
  return null;
}
