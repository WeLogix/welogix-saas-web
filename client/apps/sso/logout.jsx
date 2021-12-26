import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import QueueAnim from 'rc-queue-anim';
import connectNav from 'client/common/decorators/connect-nav';
import ExceptionState from 'client/components/ExceptionState';
import { formatMsg } from './message.i18n';


@injectIntl
@connectNav({
  depth: 1,
})
export default class Logout extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleRelogin = () => {

  }
  render() {
    return (
      <QueueAnim type={['bottom', 'up']}>
        <ExceptionState description={this.msg('msgForbidden')} actionText={this.msg('reLogin')} onClick={this.handleRelogin} />
      </QueueAnim>
    );
  }
}
