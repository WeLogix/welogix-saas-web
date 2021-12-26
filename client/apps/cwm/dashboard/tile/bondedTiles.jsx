import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Statistic } from 'antd';
import Tile from 'client/components/Tile';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

const { Container } = Tile;

@injectIntl
@connect(state => ({
  statsCard: state.saasBase.cwmStats,
  defaultWhse: state.cwmContext.defaultWhse,
  privileges: state.account.privileges,
}))

export default class BondedTiles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    statsCard: PropTypes.shape({
      inbounds: PropTypes.number,
    }),
  }
  componentDidMount() {
    if (window.localStorage) {
      const fv = {
        status: 'all', startDate: '', endDate: '',
      };
      window.localStorage.bondedStatus = JSON.stringify(fv);
    }
  }
  msg = formatMsg(this.props.intl)
  viewPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'view',
  })
  handleLinkClick = (type) => {
    const { startDate, endDate } = this.props;
    if (window.localStorage && window.localStorage.bondedStatus && this.viewPermission) {
      let fv = JSON.parse(window.localStorage.bondedStatus);
      fv.startDate = startDate;
      fv.endDate = endDate;
      if (type === 'entryToSync') {
        fv = { ...fv, status: 'processing' };
      } else if (type === 'normalToClear') {
        fv = { ...fv, status: 'completed' };
      } else if (type === 'normalToExit') {
        fv = { ...fv, status: 'cleared' };
      } else if (type === 'portionToSync') {
        fv = { ...fv, status: 'processing' };
      } else if (type === 'portionToClear') {
        fv = { ...fv, status: 'completed' };
      }
      window.localStorage.bondedStatus = JSON.stringify(fv);
    }
  }
  render() {
    const { statsCard } = this.props;
    const { viewPermission } = this;
    return (
      <Container title={this.msg('bondedStats')}>
        <Tile
          title={this.msg('entry')}
          link={viewPermission ? '/cwm/supervision/shftz/entry?from=dashboard' : null}
          onClick={() => this.handleLinkClick('entryToSync')}
        >
          <Statistic value={statsCard.entryToSync} title={this.msg('toSync')} />
        </Tile>
        <Tile
          wide
          title={this.msg('normalRelease')}
          link={viewPermission ? '/cwm/supervision/shftz/release/normal?from=dashboard' : null}
          onClick={() => this.handleLinkClick('normalToClear')}
          contentCol={2}
        >
          <Statistic value={statsCard.normalToClear} title={this.msg('toClear')} />
          <Statistic value={statsCard.normalToExit} title={this.msg('toExit')} />
        </Tile>
        <Tile
          wide
          title={this.msg('portionRelease')}
          link={viewPermission ? '/cwm/supervision/shftz/release/portion?from=dashboard' : null}
          onClick={() => this.handleLinkClick('portionToSync')}
          contentCol={2}
        >
          <Statistic value={statsCard.portionToSync} title={this.msg('toSync')} />
          <Statistic value={statsCard.portionToClear} title={this.msg('toClear')} />
        </Tile>
      </Container>
    );
  }
}
