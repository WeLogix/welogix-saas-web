import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import ExceptionState from 'client/components/ExceptionState';
import { formatMsg } from './message.i18n';


@injectIntl
@connectNav({
  depth: 3,
})
export default class Forbidden extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    return <ExceptionState description={this.msg('msgForbidden')} actionText={this.msg('goHome')} />;
  }
}
