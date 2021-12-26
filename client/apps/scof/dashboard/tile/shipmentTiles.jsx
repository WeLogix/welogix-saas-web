import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Progress, Statistic, Tooltip } from 'antd';
import Tile from 'client/components/Tile';
// import { LogixIcon } from 'client/components/FontIcon';
import StatsBar from 'client/components/StatsBar';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

const { Container } = Tile;

@injectIntl
@connect(
  state => ({
    stats: state.saasBase.sofStats,
    loginId: state.account.loginId,
    privileges: state.account.privileges,
  }),
  {}
)

export default class ShipmentTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      totalOrders: PropTypes.number,
    }),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'shipments', action: 'view',
  })
  render() {
    const { stats, startDate, endDate } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('shipment')}>
        <Tile
          wide
          title={this.msg('monthlyShipmentStats')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          contentCol={4}
          footer={<Tooltip title={`${stats.completed} 已完成 / ${stats.processing} 进行中 / ${stats.pending} 待处理`}>
            <Progress
              percent={((stats.processing + stats.completed) / stats.totalOrders) * 100}
              successPercent={(stats.completed / stats.totalOrders) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Link to={viewPermission ? `/scof/shipments?startDate=${startDate}&endDate=${endDate}#all` : null}>
            <Statistic title={this.msg('totalOrders')} value={stats.totalOrders} />
          </Link>
          <Link to={viewPermission ? `/scof/shipments?startDate=${startDate}&endDate=${endDate}#pending` : null}>
            <Statistic title={this.msg('pending')} value={stats.pending} />
          </Link>
          <Link to={viewPermission ? `/scof/shipments?startDate=${startDate}&endDate=${endDate}#processing` : null}>
            <Statistic title={this.msg('processing')} value={stats.processing} />
          </Link>
          <Link to={viewPermission ? `/scof/shipments?startDate=${startDate}&endDate=${endDate}#completed` : null}>
            <Statistic title={this.msg('completed')} value={stats.completed} />
          </Link>
        </Tile>
        <Tile
          title={this.msg('urgentShipments')}
          contentRow={2}
        >
          <Link to="/scof/shipments#urgent&pending">
            <StatsBar title="待处理" value={stats.urgentPending} percent={(stats.urgentPending / stats.urgent) * 100} strokeColor="#f5222d" />
          </Link>
          <Link to="/scof/shipments#urgent&processing">
            <StatsBar title="进行中" value={stats.urgentProcessing} percent={(stats.urgentProcessing / stats.urgent) * 100} strokeColor="#faad14" />
          </Link>
        </Tile>

      </Container>
    );
  }
}
