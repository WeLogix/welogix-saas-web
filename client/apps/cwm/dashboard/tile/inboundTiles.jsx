import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Icon, Progress, Statistic, Tooltip } from 'antd';
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import Tile from 'client/components/Tile';
// import { LogixIcon } from 'client/components/FontIcon';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';


const { MiniBar } = Charts;
const { Container } = Tile;

@injectIntl
@connect(state => ({
  stats: state.saasBase.cwmStats,
  privileges: state.account.privileges,
}))

export default class InboundTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      inboundNum: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'receiving', action: 'view',
  })
  render() {
    const { stats, startDate, endDate } = this.props;
    const { viewPermission } = this;
    const visitData = [];
    for (let i = 0; i < stats.dayGroupInboundNum.length; i++) {
      const item = stats.dayGroupInboundNum[i];
      visitData.push({
        x: item.created_time,
        y: item.count,
      });
    }
    return (
      <Container title={this.msg('inboundStats')}>
        <Tile
          title={this.msg('收货通知')}
          status="warning"
          icon={(
            <img
              alt="indicator"
              src={`${__CDN__}/assets/img/icon-inbound.svg`}
            />
          )}
          link={viewPermission ? `/cwm/receiving/asn?startDate=${startDate}&endDate=${endDate}#pending` : null}
        >
          <Statistic title={this.msg('toRelease')} value={stats.pendingAsnNum} />
        </Tile>
        <Tile
          wide
          title={this.msg('入库作业')}
          contentCol={3}
          footer={<Tooltip title={`${stats.toRecvInbNum} 待收货 / ${stats.toPutawayInbNum} 待上架 / ${stats.completeInbNum} 已入库`}>
            <Progress
              percent={((stats.completeInbNum + stats.toPutawayInbNum) / stats.inboundNum) * 100}
              successPercent={(stats.completeInbNum / stats.inboundNum) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Link to={viewPermission ? `/cwm/receiving/asn?startDate=${startDate}&endDate=${endDate}#receiving` : null}>
            <Statistic value={stats.toRecvInbNum} title="待收货" />
          </Link>
          <Link to={viewPermission ? `/cwm/receiving/asn?startDate=${startDate}&endDate=${endDate}#putting` : null}>
            <Statistic value={stats.toPutawayInbNum} title="待上架" />
          </Link>
          <Link to={viewPermission ? `/cwm/receiving/asn?startDate=${startDate}&endDate=${endDate}#completed` : null}>
            <Statistic value={stats.completeInbNum} title="已入库" />
          </Link>
        </Tile>
        <Tile
          wide
          title={this.msg('monthlyInbound')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          link={viewPermission ? '/cwm/receiving/asn' : null}
          contentHeight={90}
        >
          <MiniBar
            height={80}
            data={visitData}
          />
        </Tile>
      </Container>
    );
  }
}
