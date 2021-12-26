import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Collapse, Tooltip, Card, Col, Skeleton, message } from 'antd';
import InfoItem from 'client/components/InfoItem';
import { hideDock, manualEnterFlowInstance, toggleFlowPopover } from 'common/reducers/sofOrders';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import { NODE_BIZ_OBJECTS, TRANS_MODE, DECL_I_TYPE, DECL_E_TYPE } from 'common/constants';
import { LogixIcon } from 'client/components/FontIcon';
import UserAvatar from 'client/components/UserAvatar';
import NodeProgress from './nodeProgress';
import NodeAction from './nodeAction';


const { Panel } = Collapse;

@connect(
  () => ({}),
  {
    showPreviewer, hideDock, manualEnterFlowInstance, toggleFlowPopover,
  }
)

export default class CMSNodeCard extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      uuid: PropTypes.string,
      kind: PropTypes.oneOf(['import', 'export']),
      name: PropTypes.string.isRequired,
      decl_way_code: PropTypes.string,
      trans_mode: PropTypes.string,
      bl_wb_no: PropTypes.string,
      in_degree: PropTypes.number.isRequired,
    }),
    collapsed: PropTypes.bool,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  triggerStepMap = {
    [NODE_BIZ_OBJECTS[this.props.node.kind][0].triggers[0].key]: 0,
    [NODE_BIZ_OBJECTS[this.props.node.kind][1].triggers[1].key]: 1,
    [NODE_BIZ_OBJECTS[this.props.node.kind][0].triggers[1].key]: 2,
    [NODE_BIZ_OBJECTS[this.props.node.kind][0].triggers[3].key]: 3,
  }
  handlePreview = (No) => {
    this.props.toggleFlowPopover(false);
    if (No) {
      this.props.showPreviewer(No, 'shipment');
      this.props.hideDock();
    }
  }
  handleManifest = () => {
    this.props.toggleFlowPopover(false);
    this.props.hideDock();
    const link = `/clearance/delegation/manifest/${this.props.node.biz_no}`;
    this.context.router.push(link);
  }
  handleNodeEnterTrigger = () => {
    const { node: { uuid, kind } } = this.props;
    this.props.manualEnterFlowInstance(uuid, kind).then((result) => {
      if (!result.error) {
        this.props.toggleFlowPopover(false);
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  }
  render() {
    const {
      collapsed,
      node: {
        kind, decl_way_code: declWayCode, trans_mode: transMode,
        uuid, biz_no: bizno, person_id: personId,
      },
    } = this.props;
    const active = bizno !== undefined;
    const declWayMap = kind === 'import' ? DECL_I_TYPE : DECL_E_TYPE;
    const declWayItem = declWayMap.find(item => item.key === declWayCode);
    const tm = TRANS_MODE.filter(item => item.value === transMode)[0];
    const extra = [];
    extra.push(<NodeAction
      key="manual"
      node={this.props.node}
      manualEnterFlowInstance={this.handleNodeEnterTrigger}
    />);
    if (bizno) {
      extra.push(<Tooltip title="进入详情" key="detail">
        <Button type="primary" size="small" shape="circle" icon="right" onClick={this.handleManifest} />
      </Tooltip>);
    }
    const activeKey = collapsed ? '' : 'node-content';
    return (
      <Card
        title={bizno ? <a onClick={() => this.handlePreview(bizno)}>{bizno}</a> : <span className="text-disabled">尚未创建</span>}
        size="small"
        extra={extra}
        style={{ width: 600 }}
        bodyStyle={{ padding: 0 }}
        className="node-card"
      >
        <Collapse defaultActiveKey={[activeKey]}>
          <Panel
            showArrow={false}
            header={<NodeProgress
              node={{ uuid, biz_no: bizno }}
              bizObjects={[NODE_BIZ_OBJECTS[kind][0].key, NODE_BIZ_OBJECTS[kind][1].key]}
              triggerMap={this.triggerStepMap}
              stepDesc={['接单', '制单', '申报', '放行']}
            />}
            key="node-content"
          >
            <Skeleton loading={!active} paragraph={{ rows: 1 }}>
              <Col span={8}>
                <InfoItem
                  label="执行者"
                  field={<UserAvatar size="small" loginId={personId} showName />}
                />
              </Col>
              <Col span={8}>
                <InfoItem
                  label="运输方式"
                  addonBefore={tm && <LogixIcon type={tm.icon} />}
                  field={tm && tm.text}
                />
              </Col>
              <Col span={8}>
                <InfoItem
                  label="报关类型"
                  field={declWayItem && declWayItem.value}
                  placeholder="添加报关类型"
                />
              </Col>
            </Skeleton>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
