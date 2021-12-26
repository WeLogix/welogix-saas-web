import React from 'react';
import { Tabs } from 'antd';
import DockPanel from 'client/components/DockPanel';
import AllocRulePane from './tabpane/allocRulePane';
import SkuRulePane from './tabpane/skuRulePane';

const { TabPane } = Tabs;

export default function AllocSkuRulePanel(props) {
  const { visible, onClose } = props;
  return (
    <DockPanel
      title="配货及SKU规则"
      visible={visible}
      bodyStyle={{ backgroundColor: 'white' }}
      onClose={onClose}
    >
      <Tabs defaultActiveKey="alloc" style={{ backgroundColor: '#fff' }} >
        <TabPane tab="配货原则" key="alloc">
          <AllocRulePane visible={visible} onClose={onClose} />
        </TabPane>
        <TabPane tab="SKU规则" key="sku">
          <SkuRulePane visible={visible} onClose={onClose} />
        </TabPane>
      </Tabs>
    </DockPanel>
  );
}
