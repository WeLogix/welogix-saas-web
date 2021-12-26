import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Avatar } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { showAlertPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  navTitle: state.navbar.navTitle,
}), {
  showAlertPanel, setNavTitle,
})
export default class RiskIndicator extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    return (
      <div>
        <Badge dot><Avatar shape="square" icon="warning" style={{ backgroundColor: '#faad14' }} /></Badge>
      </div>
    );
  }
}
