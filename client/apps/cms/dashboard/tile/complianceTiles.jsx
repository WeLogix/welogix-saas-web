import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Statistic } from 'antd';
import Tile from 'client/components/Tile';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

const { Container } = Tile;

@injectIntl
@connect(state => ({
  stats: state.saasBase.cmsStat,
  privileges: state.account.privileges,
}))

export default class ComplianceTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'compliance', action: 'view',
  })
  handleOpen = (link) => {
    this.context.router.push(link);
  }
  render() {
    const { stats } = this.props;
    return (
      <Container title={this.msg('compliance')}>
        <Tile
          wide
          title={this.msg('tradeItem')}
          contentCol={3}
        >
          <Link to="/clearance/tradeitem/workspace/emerges">
            <Statistic title={this.msg('未归类')} value={stats.unclassified} />
          </Link>
          <Link to="/clearance/tradeitem/workspace/conflicts">
            <Statistic title={this.msg('归类冲突')} value={stats.conflict} />
          </Link>
          <Link to="/clearance/tradeitem/workspace/invalids">
            <Statistic title={this.msg('归类失效')} value={stats.invalid} />
          </Link>
        </Tile>
        <Tile
          wide
          title={this.msg('permit')}
          contentCol={3}
        >
          <Link to="/clearance/permit#incomplete">
            <Statistic title={this.msg('缺失')} value={stats.permitsDeficiency} />
          </Link>
          <Link to="/clearance/permit#expiring">
            <Statistic title={this.msg('临近失效')} value={stats.permitsTobeEffectless} />
          </Link>
          <Link to="/clearance/permit#expired">
            <Statistic title={this.msg('已失效')} value={stats.permitsEffectless} />
          </Link>
        </Tile>
      </Container>
    );
  }
}
