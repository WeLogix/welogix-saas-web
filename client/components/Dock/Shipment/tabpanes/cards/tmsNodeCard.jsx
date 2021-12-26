import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Card, Col, Skeleton, message } from 'antd';
import InfoItem from 'client/components/InfoItem';
import UserAvatar from 'client/components/UserAvatar';
import { hideDock, manualEnterFlowInstance, toggleFlowPopover } from 'common/reducers/sofOrders';
import { loadShipmtDetail } from 'common/reducers/shipment';
import { NODE_BIZ_OBJECTS } from 'common/constants';
import NodeProgress from './nodeProgress';
import NodeAction from './nodeAction';

const { Panel } = Collapse;

@connect(
  state => ({
    tenantId: state.account.tenantId,
  }),
  {
    loadShipmtDetail, hideDock, manualEnterFlowInstance, toggleFlowPopover,
  }
)
export default class TMSNodeCard extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string.isRequired,
      consignee_name: PropTypes.string,
      consigner_name: PropTypes.string,
      trs_mode: PropTypes.string,
      in_degree: PropTypes.number.isRequired,
      pod: PropTypes.bool,
    }),
    collapsed: PropTypes.bool,
  }
  triggerStepMap = {
    [NODE_BIZ_OBJECTS.tms[0].triggers[1].key]: 0,
    [NODE_BIZ_OBJECTS.tms[0].triggers[2].key]: 1,
    [NODE_BIZ_OBJECTS.tms[0].triggers[3].key]: 2,
    [NODE_BIZ_OBJECTS.tms[0].triggers[4].key]: 3,
    [NODE_BIZ_OBJECTS.tms[0].triggers[5].key]: 4,
  }
  handleShipmtPreview = (No) => {
    this.props.toggleFlowPopover(false);
    if (No) {
      this.props.loadShipmtDetail(No, this.props.tenantId, 'sr', 'order').then((result) => {
        if (result.error) {
          message.error(result.error.message);
        } else {
          this.props.hideDock();
        }
      });
    }
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
        consigner_name: consignerName, consignee_name: consigneeName, kind,
        pod, uuid, biz_no: bizno, person_id: personId,
      },
    } = this.props;
    const extra = [];
    extra.push(<NodeAction
      key="manual"
      node={this.props.node}
      manualEnterFlowInstance={this.handleNodeEnterTrigger}
    />);
    const steps = [
      '接单',
      '调度',
      '提货',
      '送货',
    ];
    if (pod) {
      steps.push('回单');
    }
    const active = bizno !== undefined;
    const activeKey = collapsed ? '' : 'node-content';
    return (
      <Card
        title={bizno ? <a onClick={() => this.handleShipmtPreview(bizno)}>{bizno}</a> : <span className="text-disabled">尚未创建</span>}
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
              bizObjects={[NODE_BIZ_OBJECTS[kind][0].key]}
              triggerMap={this.triggerStepMap}
              stepDesc={steps}
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
                <InfoItem label="发货方" field={consignerName} />
              </Col>
              <Col span={8}>
                <InfoItem label="收货方" field={consigneeName} />
              </Col>
            </Skeleton>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
