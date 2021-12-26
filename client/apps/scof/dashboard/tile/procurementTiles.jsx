import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
// import moment from 'moment';
import { Statistic } from 'antd';
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

export default class ProcurementTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      totalOrders: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'invoice', action: 'view',
  })
  render() {
    const { stats } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('procurement')}>
        <Tile
          title={this.msg('导入PO')}
          icon={<LogixIcon type="icon-import-alt" />}
          link={viewPermission ? '/scof/purchaseorders#import' : null}
        />
        <Tile
          title={this.msg('采购订单项')}
          icon={<LogixIcon type="icon-items" />}
          link={viewPermission ? '/scof/purchaseorders' : null}
        >
          <Statistic title="未发货数量" value={stats.unshipedPoNum} />
        </Tile>
        <Tile
          title={this.msg('上传供应商发票')}
          icon={<LogixIcon type="icon-upload-doc" />}
          link={viewPermission ? '/scof/invoices#import' : null}
        />
        <Tile
          title={this.msg('发票概况')}
          subTitle={this.msg('未到货金额')}
          link={viewPermission ? '/scof/invoices' : null}
          contentRow={3}
        >
          {stats.invAmount.map(amount =>
            (<StatsBar title={amount.currency} value={amount.total_amount} />))}
        </Tile>
        <Tile
          title={this.msg('发货通知')}
          icon={<LogixIcon type="icon-shipped" />}
          link={viewPermission ? '/scof/invoices#shipped' : null}
        />
        <Tile
          title={this.msg('到货确认')}
          icon={<LogixIcon type="icon-received" />}
          link={viewPermission ? '/scof/invoices#received' : null}
        />
        {/*
          <Tile
          wide
          title={this.msg('采购订单履行')}
          subTitle={`${moment(startDate).format('YYYY/MM/DD')}
          ~ ${moment(endDate).format('MM/DD')}`}
          extra={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          link={viewPermission ? '/scof/shipments' : null}
          contentCol={4}
          footer={<Tooltip title={`${stats.completed} 已完成 /
           ${stats.processing} 进行中 / ${stats.pending} 待处理`}>
            <Progress
              percent={((stats.processing + stats.completed) / stats.totalOrders) * 100}
              successPercent={(stats.completed / stats.totalOrders) * 100}
              showInfo={false}
            />
          </Tooltip>}
        >
          <Statistic title={this.msg('订单量')} value={stats.totalOrders} />
          <Statistic title={this.msg('发票量')} value={stats.pending} />
          <Statistic title={this.msg('发货量')} value={stats.processing} />
          <Statistic title={this.msg('到货量')} value={stats.completed} />
        </Tile>
        */}
      </Container>
    );
  }
}
