import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Icon, Progress, Statistic, Tooltip } from 'antd';
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import Tile from 'client/components/Tile';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

const { MiniBar } = Charts;
const { Container } = Tile;

@injectIntl
@connect(state => ({
  stats: state.saasBase.cwmStats,
  privileges: state.account.privileges,
}))

export default class OutboundTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      inbounds: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'shipping', action: 'view',
  })
  render() {
    const { stats, startDate, endDate } = this.props;
    const { viewPermission } = this;
    const visitData = [];
    for (let i = 0; i < stats.dayGroupOutboundNum.length; i++) {
      const item = stats.dayGroupOutboundNum[i];
      visitData.push({
        x: item.created_time,
        y: item.count,
      });
    }
    return (
      <Container title={this.msg('outboundStats')}>
        <Tile
          title={this.msg('发货订单')}
          icon={(
            <img
              alt="indicator"
              src={`${__CDN__}/assets/img/icon-outbound.svg`}
            />
          )}
          link={viewPermission ? `/cwm/shipping/order?startDate=${startDate}&endDate=${endDate}#pending` : null}
        >
          <Statistic title={this.msg('toRelease')} value={stats.pendingSoNum} />
        </Tile>
        <Tile
          wide
          title={this.msg('库存分配')}
          link={viewPermission ? `/cwm/shipping/order?startDate=${startDate}&endDate=${endDate}#toAllocate` : null}
          contentCol={2}
          footer={<Tooltip title={`${stats.unpreallocNum} ${this.msg('unpreallocNum')} / ${stats.toAllocateOutbNum} ${this.msg('toAllocate')}`}>
            <Progress
              percent={((stats.unpreallocNum) / stats.toAllocateOutbNum) * 100}
              showInfo={false}
              strokeColor="#faad14"
            />
          </Tooltip>}
        >
          <Statistic title={this.msg('toAllocate')} value={stats.toAllocateOutbNum} />
          <Statistic title={this.msg('unpreallocNum')} value={stats.unpreallocNum} />
        </Tile>
        <Tile
          wide
          title={this.msg('出库作业')}
          contentCol={3}
          footer={<Tooltip title={`${stats.toPickOutbNum} ${this.msg('toPick')} / ${stats.toShipOutbNum} ${this.msg('toShip')} / ${stats.CompleteOutbNum} ${this.msg('outboundCompleted')}`}>
            <Progress
              percent={((stats.toPickOutbNum + stats.toShipOutbNum) / stats.outboundNum) * 100}
              successPercent={(stats.toShipOutbNum / stats.outboundNum) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Link to={viewPermission ? `/cwm/shipping/order?startDate=${startDate}&endDate=${endDate}#toPick` : null}>
            <Statistic title={this.msg('toPick')} value={stats.toPickOutbNum} />
          </Link>
          <Link to={viewPermission ? `/cwm/shipping/order?startDate=${startDate}&endDate=${endDate}#toShip` : null}>
            <Statistic title={this.msg('toShip')} value={stats.toShipOutbNum} />
          </Link>
          <Link to={viewPermission ? `/cwm/shipping/order?startDate=${startDate}&endDate=${endDate}#outboundCompleted` : null}>
            <Statistic title={this.msg('outboundCompleted')} value={stats.CompleteOutbNum} />
          </Link>
        </Tile>
        <Tile
          wide
          title={this.msg('monthlyOutbound')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          link={viewPermission ? '/cwm/shipping/order' : null}
          contentHeight={90}
        >
          <MiniBar
            color="#52c41a"
            height={80}
            data={visitData}
          />
        </Tile>
      </Container>
    );
  }
}
