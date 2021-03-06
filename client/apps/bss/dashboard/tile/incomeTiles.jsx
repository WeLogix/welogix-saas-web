import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Progress, Statistic, Tooltip } from 'antd';
import Tile from 'client/components/Tile';
import { LogixIcon } from 'client/components/FontIcon';
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

export default class IncomeTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      totalOrders: PropTypes.number,
    }),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }
  componentDidMount() {
    if (window.localStorage) {
      const fv = {
        progress: 'all',
        transfer: 'all',
        partnerId: '',
        orderType: null,
        expedited: 'all',
        creator: 'all',
        loginId: this.props.loginId,
        startDate: '',
        endDate: '',
      };
      window.localStorage.scofOrderLists = JSON.stringify(fv);
    }
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'shipments', action: 'view',
  })
  handleLinkClick = (type) => {
    const { startDate, endDate } = this.props;
    if (window.localStorage && window.localStorage.scofOrderLists) {
      let fv = JSON.parse(window.localStorage.scofOrderLists);
      fv.startDate = startDate;
      fv.endDate = endDate;
      if (type === 'totalOrders') {
        fv = { ...fv, progress: 'all' };
      } else if (type === 'pending') {
        fv = { ...fv, progress: 'pending' };
      } else if (type === 'processing') {
        fv = { ...fv, progress: 'active' };
      } else if (type === 'urgent') {
        fv = { ...fv, expedited: 'expedited' };
      } else if (type === 'completed') {
        fv = { ...fv, progress: 'completed' };
      }
      window.localStorage.scofOrderLists = JSON.stringify(fv);
    }
  }
  render() {
    const { stats, startDate, endDate } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('income')}>
        <Tile
          title={this.msg('?????????????????????')}
          icon={<LogixIcon type="icon-items" />}
          link={viewPermission ? '/scof/purchaseorders' : null}
        >
          <Statistic title="Open Items" value="1.36M" />
        </Tile>
        <Tile
          title={this.msg('?????????')}
          icon={<LogixIcon type="icon-items" />}
          link={viewPermission ? '/scof/purchaseorders' : null}
        >
          <Statistic title="Open Items" value="33.6%" />
        </Tile>
        <Tile
          wide
          title={this.msg('??????????????????')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="????????????"><Icon type="info-circle-o" /></Tooltip>}
          link={viewPermission ? '/scof/shipments' : null}
          contentCol={4}
          footer={<Tooltip title={`${stats.completed} ????????? / ${stats.processing} ????????? / ${stats.pending} ?????????`}>
            <Progress
              percent={((stats.processing + stats.completed) / stats.totalOrders) * 100}
              successPercent={(stats.completed / stats.totalOrders) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Statistic title={this.msg('?????????')} value={stats.totalOrders} />
          <Statistic title={this.msg('??????')} value={stats.pending} />
          <Statistic title={this.msg('?????????')} value={stats.processing} />
          <Statistic title={this.msg('?????????')} value={stats.completed} />
        </Tile>
        <Tile
          title={this.msg('??????')}
          contentRow={2}
        >
          <Link to="/scof/shipments#urgent&pending">
            <StatsBar title="?????????" value={stats.urgentPending} percent={(stats.urgentPending / stats.urgent) * 100} strokeColor="#f5222d" />
          </Link>
          <Link to="/scof/shipments#urgent&processing">
            <StatsBar title="?????????" value={stats.urgentProcessing} percent={(stats.urgentProcessing / stats.urgent) * 100} strokeColor="#faad14" />
          </Link>
        </Tile>
        <Tile
          title={this.msg('??????????????????')}
          icon={<LogixIcon type="icon-upload-doc" />}
          link={viewPermission ? '/scof/invoices#upload' : null}
        />
        <Tile
          title={this.msg('??????????????????')}
          icon={<LogixIcon type="icon-received" />}
          link={viewPermission ? '/scof/invoices#received' : null}
        />
        <Tile
          title={this.msg('????????????')}
          contentRow={2}
        >
          <Link to="/scof/shipments#urgent&pending">
            <StatsBar title="?????????" value={stats.urgentPending} percent={(stats.urgentPending / stats.urgent) * 100} strokeColor="#f5222d" />
          </Link>
          <Link to="/scof/shipments#urgent&processing">
            <StatsBar title="?????????" value={stats.urgentProcessing} percent={(stats.urgentProcessing / stats.urgent) * 100} strokeColor="#faad14" />
          </Link>
        </Tile>

      </Container>
    );
  }
}
