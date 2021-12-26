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

export default class ExpenseTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      totalOrders: PropTypes.number,
    }),
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
    module: 'scof', feature: 'invoice', action: 'view',
  })
  render() {
    const { stats } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('expense')}>
        <Tile
          title={this.msg('导入服务商账单')}
          icon={<LogixIcon type="icon-import-alt" />}
          link={viewPermission ? '/scof/purchaseorders#import' : null}
        />
        <Tile
          title={this.msg('管理应付费用项')}
          icon={<LogixIcon type="icon-items" />}
          link={viewPermission ? '/scof/purchaseorders' : null}
        >
          <Statistic title="Open Items" value="1.36M" />
        </Tile>
        <Tile
          title={this.msg('服务商应付余额')}
          icon={<LogixIcon type="icon-upload-doc" />}
          link={viewPermission ? '/scof/invoices#upload' : null}
        />
        <Tile
          title={this.msg('创建付款凭证')}
          icon={<LogixIcon type="icon-shipped" />}
          link={viewPermission ? '/scof/invoices#shipped' : null}
        />
        <Tile
          title={this.msg('待审批付款')}
          subTitle={this.msg('未到货金额')}
          link={viewPermission ? '/scof/invoices' : null}
          contentRow={3}
        >
          <StatsBar title="USD" value="45.3M" percent={(stats.urgentPending / stats.urgent) * 100} />
          <StatsBar title="JPY" value={stats.urgentProcessing} percent={(stats.urgentProcessing / stats.urgent) * 100} />
        </Tile>
        <Tile
          title={this.msg('付款确认')}
          icon={<LogixIcon type="icon-received" />}
          link={viewPermission ? '/scof/invoices#received' : null}
        />
      </Container>
    );
  }
}
