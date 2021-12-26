import React from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router';
import { connect } from 'react-redux';
import { Button, Collapse, Tooltip, Card, Col, Skeleton, message, Steps } from 'antd';
import InfoItem from 'client/components/InfoItem';
import UserAvatar from 'client/components/UserAvatar';
import { hideDock, getSoFromFlow, manualEnterFlowInstance, toggleFlowPopover } from 'common/reducers/sofOrders';
import { showDock } from 'common/reducers/cwmShippingOrder';
import { CWM_SO_STATUS, CWM_OUTBOUND_STATUS } from 'common/constants';
import NodeAction from './nodeAction';

const { Panel } = Collapse;
const { Step } = Steps;

@connect(
  (state, props) => ({
    tenantId: state.account.tenantId,
    so: state.sofOrders.dockInstMap[props.node.uuid],
  }),
  {
    hideDock, showDock, getSoFromFlow, manualEnterFlowInstance, toggleFlowPopover,
  }
)
export default class CWMOutboundNodeCard extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      uuid: PropTypes.string,
      kind: PropTypes.oneOf(['cwmship']),
      name: PropTypes.string.isRequired,
      in_degree: PropTypes.number.isRequired,
    }),
    collapsed: PropTypes.bool,
  }
  static contextTypes = {
    router: routerShape.isRequired,
  }
  componentWillMount() {
    const { node: { uuid }, tenantId } = this.props;
    this.props.getSoFromFlow(uuid, tenantId);
  }
  componentWillReceiveProps(nextProps) {
    const { node: { uuid }, tenantId } = nextProps;
    if (uuid !== this.props.node.uuid || nextProps.so.so_no !== this.props.so.so_no) {
      this.props.getSoFromFlow(uuid, tenantId);
    }
  }
  handlePreview = (bizno) => {
    this.props.toggleFlowPopover(false);
    this.props.hideDock();
    this.props.showDock(bizno);
  }
  handleOutbound = () => {
    this.props.toggleFlowPopover(false);
    this.props.hideDock();
    this.context.router.push(`/cwm/shipping/outbound/${this.props.so.outbound_no}`);
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
      collapsed, so, node: { biz_no: bizno }, person_id: personId,
    } = this.props;
    if (!so) {
      return null;
    }
    const active = bizno !== undefined;
    const extra = [];
    extra.push(<NodeAction
      key="manual"
      node={this.props.node}
      manualEnterFlowInstance={this.handleNodeEnterTrigger}
    />);
    if (so.outbound_no) {
      extra.push(<Tooltip title="进入详情" key="detail">
        <Button type="primary" size="small" shape="circle" icon="right" onClick={this.handleOutbound} />
      </Tooltip>);
    }
    const steps = [];
    Object.values(CWM_SO_STATUS).forEach((st) => {
      if (st) {
        steps.push(st.text);
      }
    });
    const activeKey = collapsed ? '' : 'node-content';
    let current = 0;
    switch (so.outbound_status) {
      case CWM_OUTBOUND_STATUS.CREATED.value:
      case CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value:
      case CWM_OUTBOUND_STATUS.ALL_ALLOC.value:
      case CWM_OUTBOUND_STATUS.PARTIAL_PICKED.value:
        current = 1;
        break;
      case CWM_OUTBOUND_STATUS.ALL_PICKED.value:
      case CWM_OUTBOUND_STATUS.PACKED.value:
      case CWM_OUTBOUND_STATUS.SHIPPING.value:
        current = 2;
        break;
      case CWM_OUTBOUND_STATUS.COMPLETED.value:
        current = 3;
        break;
      default:
        current = 0;
    }
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
            header={<Steps
              progressDot
              current={current}
              className="node-progress"
            >
              { steps.map(std => <Step title={std} key={std} />) }
            </Steps>}
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
                  label="仓库"
                  field={so.whse_name}
                />
              </Col>
              <Col span={8}>
                <InfoItem
                  label="保税类型"
                  field={so.bonded ? '保税' : '非保税'}
                />
              </Col>
            </Skeleton>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
