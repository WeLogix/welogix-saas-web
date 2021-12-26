import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Icon } from 'antd';
import { DEFAULT_MODULES } from 'common/constants';
import { LogixIcon } from 'client/components/FontIcon';
import NavLink from 'client/components//NavLink';
import { formatMsg } from './message.i18n';

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};
const plusStyle = {
  fontSize: 38,
  color: '#eee',
  lineHeight: '88px',
};

@injectIntl
@connect(state => ({
  enabledmods: state.account.modules.map(app => app.id),
  homeApps: state.account.apps.home,
}))
export default class AppLaunchCard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    enabledmods: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  msg = formatMsg(this.props.intl)
  render() {
    const { enabledmods } = this.props;
    return (
      <Card className="launch-panel">
        {
          enabledmods.map((appKey) => {
            const app = DEFAULT_MODULES[appKey];
            if (app) {
              return (
                <Card.Grid style={gridStyle} key={appKey}>
                  <NavLink to={`${app.url}/`}>
                    <Card.Meta
                      avatar={<LogixIcon type={`icon-${app.cls}`} />}
                      title={this.msg(app.text)}
                    />
                  </NavLink>
                </Card.Grid>);
            }
            return null;
          })
        }
        <Card.Grid style={gridStyle} key="appstore">
          <Icon type="plus" style={plusStyle} />
        </Card.Grid>
      </Card>);
  }
}
