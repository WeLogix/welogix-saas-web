import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { showUserPanel } from 'common/reducers/saasUser';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    avatar: state.account.profile.avatar,
    name: state.account.profile.name,
  }),
  {
    showUserPanel,
  }
)
export default class UserIcon extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleShowUserPanel = () => {
    this.props.showUserPanel();
  }
  render() {
    const { avatar, name } = this.props;
    return (
      <div onClick={this.handleShowUserPanel}>
        <Badge overflowCount={99}>
          {avatar ? <Avatar src={avatar} /> : <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{name && name.slice(0, 1)}</Avatar>}
        </Badge>
      </div>
    );
  }
}
