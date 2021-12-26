import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import moment from 'moment';
import { Icon, Progress, Statistic, Tooltip } from 'antd';
// import { Charts } from 'ant-design-pro';
import StatsBar from 'client/components/StatsBar';
import Tile from 'client/components/Tile';
import { LogixIcon } from 'client/components/FontIcon';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

// const { MiniProgress } = Charts;
const { Container } = Tile;

@injectIntl
@connect(state => ({
  cmsStat: state.saasBase.cmsStat,
  privileges: state.account.privileges,
}))

export default class InboundTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    cmsStat: PropTypes.shape({
      released: PropTypes.number,
      declared: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'delegation', action: 'view',
  })
  render() {
    const { cmsStat, dateRange: { startDate, endDate } } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('customsDecl')}>
        <Tile
          wide
          title={this.msg('monthlyDeclStats')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')} ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          link={viewPermission ? '/clearance/delegation' : null}
          contentCol={4}
          footer={<Tooltip title={`${cmsStat.released} 已放行 / ${cmsStat.declared} 通关中 / ${cmsStat.processing} 未申报`}>
            <Progress
              percent={((cmsStat.declared + cmsStat.released) / cmsStat.total) * 100}
              successPercent={(cmsStat.released / cmsStat.total) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Statistic title="总票数" value={cmsStat.total} />
          <Statistic title="未申报" value={cmsStat.processing} />
          <Statistic title="通关中" value={cmsStat.declared} />
          <Statistic title="已放行" value={cmsStat.released} />
        </Tile>
        <Tile
          title={this.msg('海运换单')}
          status="warning"
          icon={<LogixIcon type="icon-bol" />}
        >
          <Link to={viewPermission ? `/clearance/delegation?startDate=${startDate}&endDate=${endDate}#exchange` : null}>
            <Statistic title="待换单" value={cmsStat.exchange} />
          </Link>
        </Tile>
        <Tile
          title={this.msg('报关清单')}
          status="processing"
          icon={<LogixIcon type="icon-filing" />}
        >
          <Link to={viewPermission ? `/clearance/delegation?startDate=${startDate}&endDate=${endDate}#manifest` : null}>
            <Statistic title="待制单" value={cmsStat.unfinishManifests} />
          </Link>
        </Tile>
        <Tile
          title={this.msg('报关建议书')}
          status="processing"
          icon={<LogixIcon type="icon-review" />}
        >
          <Link to={viewPermission ? `/clearance/declaration?startDate=${startDate}&endDate=${endDate}#review` : null}>
            <Statistic title="待复核" value={cmsStat.unReviewedDecls} />
          </Link>
        </Tile>
        <Tile
          title={this.msg('查验')}
          link={viewPermission ? `/clearance/declaration?startDate=${startDate}&endDate=${endDate}#inspect` : null}
          contentRow={3}
        >
          <StatsBar title="查验下达" value={cmsStat.inspects} percent={(cmsStat.inspects / cmsStat.declCount) * 100} strokeColor="#faad14" />
          <StatsBar title="放行" value={cmsStat.inspectReleased} percent={(cmsStat.inspectReleased / cmsStat.declCount) * 100} strokeColor="#52c41a" />
          <StatsBar title="查获" value={cmsStat.inspectCaught} percent={(cmsStat.inspectCaught / cmsStat.declCount) * 100} strokeColor="#f5222d" />
        </Tile>
        <Tile
          title={this.msg('删改单')}
          contentRow={2}
        >
          <Link to={`/clearance/declaration?startDate=${startDate}&endDate=${endDate}#revised`}>
            <StatsBar title="修改单" value={cmsStat.declMod} percent={(cmsStat.declMod / cmsStat.declCount) * 100} strokeColor="#faad14" />
          </Link>
          <Link to={`/clearance/declaration?startDate=${startDate}&endDate=${endDate}#revoked`}>
            <StatsBar title="撤销单" value={cmsStat.declDel} percent={(cmsStat.declDel / cmsStat.declCount) * 100} strokeColor="#f5222d" />
          </Link>
        </Tile>
        <Tile
          title={this.msg('税金')}
          contentRow={3}
        >
          <Link to="/clearance/tax#estimated">
            <StatsBar title="预估" value={cmsStat.estimatedTax} percent={(cmsStat.estimatedTax / cmsStat.totalTax) * 100} />
          </Link>
          <Link to="/clearance/tax#unpaid">
            <StatsBar title="待支付" value={cmsStat.unpaidTax} percent={(cmsStat.unpaidTax / cmsStat.totalTax) * 100} strokeColor="#faad14" />
          </Link>
          <Link to="/clearance/tax#paid">
            <StatsBar title="已支付" value={cmsStat.paidTax} percent={(cmsStat.paidTax / cmsStat.totalTax) * 100} strokeColor="#52c41a" />
          </Link>
        </Tile>
        <Tile
          title={this.msg('录入成本费用')}
          icon={<LogixIcon type="icon-bill" />}
          link={viewPermission ? '/clearance/billing/payable' : null}
        />
      </Container>
    );
  }
}
