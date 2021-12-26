import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
// import moment from 'moment';
import { Card, Timeline } from 'antd';
import { loadOrderNodes } from 'common/reducers/sofOrders';
import { LogixIcon } from 'client/components/FontIcon';
import CMSNodeCard from './cards/cmsNodeCard';
import TMSNodeCard from './cards/tmsNodeCard';
import CWMInboundNodeCard from './cards/cwmInboundNodeCard';
import CWMOutboundNodeCard from './cards/cwmOutboundNodeCard';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    shipmtOrderNo: state.sofOrders.dock.order.shipmt_order_no,
    orderFlow: state.sofOrders.dock.flow,
    bizObjects: state.sofOrders.orderBizObjects,
  }),
  { loadOrderNodes }
)
export default class FlowPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bizObjects: PropTypes.arrayOf(PropTypes.shape({ kind: PropTypes.oneOf(['import', 'export', 'cwmrec', 'tms', 'cwmship']) })).isRequired,
    shipmtOrderNo: PropTypes.string.isRequired,
  }
  componentDidMount() {
    const { shipmtOrderNo } = this.props;
    this.props.loadOrderNodes(shipmtOrderNo);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { orderFlow } = this.props;
    if (!orderFlow) {
      return null;
    }
    return (
      <div className="pane-content tab-pane">
        <Card title={orderFlow.name}>
          <Timeline>
            {
                this.props.bizObjects.map((item) => {
                  switch (item.kind) {
                    case 'import':
                    return (
                      <Timeline.Item dot={<LogixIcon type="icon-import" />} key={item.uuid}>
                        <CMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (<Timeline.Item dot={<LogixIcon type="icon-import" />} key={subitem.biz_no}>
                            <CMSNodeCard node={subitem} />
                          </Timeline.Item>))}
                      </Timeline.Item>
                    );
                    case 'export':
                    return (
                      <Timeline.Item dot={<LogixIcon type="icon-export" />} key={item.uuid}>
                        <CMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (<Timeline.Item dot={<LogixIcon type="icon-export" />} key={subitem.biz_no}>
                            <CMSNodeCard node={subitem} />
                          </Timeline.Item>))}
                      </Timeline.Item>
                    );
                    case 'tms':
                    return (
                      <Timeline.Item dot={<LogixIcon type="icon-truck" />} key={item.uuid}>
                        <TMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (<Timeline.Item dot={<LogixIcon type="icon-truck" />} key={subitem.biz_no}>
                            <TMSNodeCard node={subitem} />
                          </Timeline.Item>))}
                      </Timeline.Item>
                    );
                    case 'cwmrec':
                    return (
                      <Timeline.Item dot={<LogixIcon type="icon-receiving" />} key={item.uuid}>
                        <CWMInboundNodeCard node={item} />
                        {item.children.map(subitem =>
                          (<Timeline.Item dot={<LogixIcon type="icon-receiving" />} key={subitem.biz_no}>
                            <CWMInboundNodeCard node={subitem} />
                          </Timeline.Item>))}
                      </Timeline.Item>
                    );
                    case 'cwmship':
                    return (
                      <Timeline.Item dot={<LogixIcon type="icon-shipping" />} key={item.uuid}>
                        <CWMOutboundNodeCard node={item} />
                        {item.children.map(subitem =>
                          (<Timeline.Item dot={<LogixIcon type="icon-shipping" />} key={subitem.biz_no}>
                            <CWMOutboundNodeCard node={subitem} />
                          </Timeline.Item>))}
                      </Timeline.Item>
                    );
                    default:
                    return null;
                }
              })
            }
          </Timeline>
        </Card>
      </div>);
  }
}
