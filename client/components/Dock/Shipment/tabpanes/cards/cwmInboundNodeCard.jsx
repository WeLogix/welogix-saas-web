import React from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router';
import { connect } from 'react-redux';
import { Button, Collapse, Tooltip, Card, Col, Skeleton, message, Steps } from 'antd';
import InfoItem from 'client/components/InfoItem';
import UserAvatar from 'client/components/UserAvatar';
import { hideDock, getAsnFromFlow, manualEnterFlowInstance, toggleFlowPopover } from 'common/reducers/sofOrders';
import { showDock } from 'common/reducers/cwmReceive';
import { CWM_ASN_INBOUND_STATUS, CWM_INBOUND_STATUS } from 'common/constants';
import NodeAction from './nodeAction';

const { Panel } = Collapse;
const { Step } = Steps;

@connect(
  (state, props) => ({
    tenantId: state.account.tenantId,
    asn: state.sofOrders.dockInstMap[props.node.uuid],
  }),
  {
    hideDock, showDock, getAsnFromFlow, manualEnterFlowInstance, toggleFlowPopover,
  }
)
export default class CWMInboundNodeCard extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      uuid: PropTypes.string,
      kind: PropTypes.oneOf(['cwmrec']),
      name: PropTypes.string.isRequired,
      in_degree: PropTypes.number.isRequired,
    }),
    collapsed: PropTypes.bool,
  }
  static contextTypes = {
    router: routerShape.isRequired,
  }
  componentDidMount() {
    const { node: { uuid }, tenantId } = this.props;
    this.props.getAsnFromFlow(uuid, tenantId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node.uuid !== this.props.node.uuid ||
      nextProps.asn.asn_no !== this.props.asn.asn_no) {
      const { node: { uuid }, tenantId } = nextProps;
      this.props.getAsnFromFlow(uuid, tenantId);
    }
  }
  handlePreview = (bizno) => {
    this.props.toggleFlowPopover(false);
    this.props.hideDock();
    this.props.showDock(bizno);
  }
  handleInbound = () => {
    this.props.toggleFlowPopover(false);
    this.props.hideDock();
    this.context.router.push(`/cwm/receiving/inbound/${this.props.asn.inbound_no}`);
  }
  handleNodeEnterTrigger = () => {
    const { node: { uuid, kind } } = this.props;
    this.props.manualEnterFlowInstance(uuid, kind).then((result) => {
      if (!result.error) {
        this.props.toggleFlowPopover(false);
        message.success('????????????');
      } else {
        message.error('????????????');
      }
    });
  }
  render() {
    const {
      collapsed, asn, node: { biz_no: bizno }, person_id: personId,
    } = this.props;
    if (!asn) {
      return null;
    }
    const active = bizno !== undefined;
    const extra = [];
    extra.push(<NodeAction
      key="manual"
      node={this.props.node}
      manualEnterFlowInstance={this.handleNodeEnterTrigger}
    />);
    if (asn.inbound_no) {
      extra.push(<Tooltip title="????????????" key="detail">
        <Button type="primary" size="small" shape="circle" icon="right" onClick={this.handleInbound} />
      </Tooltip>);
    }
    const steps = [];
    Object.values(CWM_ASN_INBOUND_STATUS).forEach((st) => {
      if (st) {
        steps.push(st.text);
      }
    });
    const activeKey = collapsed ? '' : 'node-content';
    let current = 0;
    switch (asn.inbound_status) {
      case CWM_INBOUND_STATUS.CREATED.value:
      case CWM_INBOUND_STATUS.PARTIAL_RECEIVED.value:
      case CWM_INBOUND_STATUS.ALL_RECEIVED.value:
        current = 1;
        break;
      case CWM_INBOUND_STATUS.PARTIAL_PUTAWAY.value:
        current = 2;
        break;
      case CWM_INBOUND_STATUS.COMPLETED.value:
        current = 3;
        break;
      default:
        current = 0;
    }
    return (
      <Card
        title={bizno ? <a onClick={() => this.handlePreview(bizno)}>{bizno}</a> : <span className="text-disabled">????????????</span>}
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
                  label="?????????"
                  field={<UserAvatar size="small" loginId={personId} showName />}
                />
              </Col>
              <Col span={8}>
                <InfoItem
                  label="??????"
                  field={asn.whse_name}
                />
              </Col>
              <Col span={8}>
                <InfoItem
                  label="????????????"
                  field={asn.bonded ? '??????' : '?????????'}
                />
              </Col>
            </Skeleton>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
