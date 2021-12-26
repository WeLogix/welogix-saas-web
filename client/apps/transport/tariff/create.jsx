import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import connectFetch from 'client/common/decorators/connect-fetch';
import withPrivilege from 'client/common/decorators/withPrivilege';
import { loadFormParams } from 'common/reducers/transportTariff';
import { format } from 'client/common/i18n/helpers';
import Main from './Main';
import messages from './message.i18n';

const formatMsg = format(messages);

function fetchData({ dispatch, state }) {
  return dispatch(loadFormParams(state.account.tenantId));
}

@connectFetch()(fetchData)
@injectIntl
@connectNav({
  depth: 3,
  title: 'featTmsTariff',
  moduleName: 'transport',
})
@withPrivilege({ module: 'transport', feature: 'tariff', action: 'create' })
export default class TariffCreate extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = (key, values) => formatMsg(this.props.intl, key, values)
  render() {
    return (
      <Main type="create" />
    );
  }
}
