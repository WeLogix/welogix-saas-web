import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Statistic } from 'antd';
import Tile from 'client/components/Tile';
import { LogixIcon } from 'client/components/FontIcon';
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

export default class PartnerTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stats: PropTypes.shape({
      totalOrders: PropTypes.number,
    }),
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'partner', action: 'view',
  })
  render() {
    const { stats } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('partner')}>
        <Tile
          title={this.msg('客户')}
          icon={<LogixIcon type="icon-customer" />}
          link={viewPermission ? '/scof/customers' : null}
        >
          <Statistic value={stats.cusCount} />
        </Tile>
        <Tile
          title={this.msg('供应商')}
          icon={<LogixIcon type="icon-supplier" />}
          link={viewPermission ? '/scof/suppliers' : null}
        >
          <Statistic value={stats.supCount} />
        </Tile>
        <Tile
          title={this.msg('服务商')}
          icon={<LogixIcon type="icon-vendor" />}
          link={viewPermission ? '/scof/vendors' : null}
        >
          <Statistic value={stats.venCount} />
        </Tile>
      </Container>
    );
  }
}
