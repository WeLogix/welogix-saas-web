import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
// import moment from 'moment';
import { Popover, Timeline } from 'antd';
import { toggleFlowPopover } from 'common/reducers/sofOrders';
import { LogixIcon } from 'client/components/FontIcon';
import CMSNodeCard from './tabpanes/cards/cmsNodeCard';
import TMSNodeCard from './tabpanes/cards/tmsNodeCard';
import CWMInboundNodeCard from './tabpanes/cards/cwmInboundNodeCard';
import CWMOutboundNodeCard from './tabpanes/cards/cwmOutboundNodeCard';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    shipmtOrderNo: state.sofOrders.dock.order.shipmt_order_no,
    orderFlow: state.sofOrders.dock.flow,
    bizObjects: state.sofOrders.orderBizObjects,
  }),
  { toggleFlowPopover }
)
export default class FlowOverlay extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bizObjects: PropTypes.arrayOf(PropTypes.shape({ kind: PropTypes.oneOf(['import', 'export', 'cwmrec', 'tms', 'cwmship']) })).isRequired,
  }

  msg = formatMsg(this.props.intl)
  render() {
    const { orderFlow } = this.props;
    if (!orderFlow) {
      return null;
    }
    return (
      <Timeline style={{ marginTop: 24 }}>
        {
                this.props.bizObjects.map((item) => {
                  switch (item.kind) {
                    case 'import':
                    return (
                      <Timeline.Item dot={<Popover placement="left" content="进口申报" ><LogixIcon type="icon-import" /></Popover>} key={item.uuid}>
                        <h4>{item.name}</h4>
                        <CMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (
                            <CMSNodeCard node={subitem} key={subitem.biz_no} collapsed />
                          ))}
                      </Timeline.Item>
                    );
                    case 'export':
                    return (
                      <Timeline.Item dot={<Popover placement="left" content="出口申报" ><LogixIcon type="icon-export" /></Popover>} key={item.uuid}>
                        <h4>{item.name}</h4>
                        <CMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (
                            <CMSNodeCard node={subitem} key={subitem.biz_no} />
                          ))}
                      </Timeline.Item>
                    );
                    case 'tms':
                    return (
                      <Timeline.Item dot={<Popover placement="left" content="运输" ><LogixIcon type="icon-truck" /></Popover>} key={item.uuid}>
                        <h4>{item.name}</h4>
                        <TMSNodeCard node={item} />
                        {item.children.map(subitem =>
                          (
                            <TMSNodeCard node={subitem} key={subitem.biz_no} />
                          ))}
                      </Timeline.Item>
                    );
                    case 'cwmrec':
                    return (
                      <Timeline.Item dot={<Popover placement="left" content="收货入库" ><LogixIcon type="icon-receiving" /></Popover>} key={item.uuid}>
                        <h4>{item.name}</h4>
                        <CWMInboundNodeCard node={item} />
                        {item.children.map(subitem =>
                          (
                            <CWMInboundNodeCard node={subitem} key={subitem.biz_no} />
                          ))}
                      </Timeline.Item>
                    );
                    case 'cwmship':
                    return (
                      <Timeline.Item dot={<Popover placement="left" content="发货出库" ><LogixIcon type="icon-shipping" /></Popover>} key={item.uuid}>
                        <h4>{item.name}</h4>
                        <CWMOutboundNodeCard node={item} />
                        {item.children.map(subitem =>
                          (
                            <CWMOutboundNodeCard node={subitem} key={subitem.biz_no} />
                          ))}
                      </Timeline.Item>
                    );
                    default:
                    return null;
                }
              })
            }
      </Timeline>
    );
  }
}
