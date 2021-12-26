import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import NavLink from './NavLink';
import { LogixIcon } from './FontIcon';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    corpLogo: state.corpDomain.logo,
    corpName: state.corpDomain.name,
  }),
  { }
)
export default class CorpHeaderBar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    title: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { title, corpName, corpLogo } = this.props;
    return [
      <nav className="navbar navbar-light navbar-fixed-top layout-header" key="navbar">
        <div className="navbar-left">
          <NavLink to="/">
            <Tooltip placement="bottomLeft" arrowPointAtCenter title={this.msg('goHome')} key="back" >
              <div className="navbar-anchor"><LogixIcon type="icon-grid" /></div>
            </Tooltip>
          </NavLink>
          <div className="navbar-title">
            {title}
          </div>
        </div>
        <div className="navbar-corp">
          <span className="logo" style={{ backgroundImage: `url("${corpLogo}")` }} />
          {corpName}
        </div>
      </nav>,
      <div className="navbar-spacer" key="spacer" />,
    ];
  }
}
