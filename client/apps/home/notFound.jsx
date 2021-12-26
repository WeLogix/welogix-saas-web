import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import ExceptionState from 'client/components/ExceptionState';
import { formatMsg } from './message.i18n';

@injectIntl
@connectNav({
  depth: 3,
})
export default class NotFound extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleBackClick = () => {
    this.context.router.goBack();
  }
  render() {
    return (
      <ExceptionState
        exceptionCode="404"
        imageUrl="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg"
        description={this.msg('notFoundDesc')}
        onClick={this.handleBackClick}
        actionText={this.msg('goBack')}
      />
    );
  }
}
