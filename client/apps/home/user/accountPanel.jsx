import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Drawer, Icon, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideAccountPanel } from 'common/reducers/saasUser';
import Profile from './tabpane/profile';
import Password from './tabpane/password';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.saasUser.accountVisible,
    loginId: state.account.loginId,
    locale: state.saasUser.locale,
  }),
  { hideAccountPanel }
)
export default class AccountPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,

  }
  msg = formatMsg(this.props.intl)

  render() {
    const { visible } = this.props;
    return (
      <Drawer
        width={480}
        visible={visible}
        onClose={this.props.hideAccountPanel}
        title={<span>{this.msg('userAccount')}</span>}
      >
        <Tabs defaultActiveKey="profile">
          <TabPane
            tab={<span><Icon type="profile" />{this.msg('profile')}</span>}
            key="profile"
          >
            <Profile />
          </TabPane>
          <TabPane
            tab={<span><Icon type="key" />{this.msg('changePassword')}</span>}
            key="password"
          >
            <Password />
          </TabPane>
        </Tabs>
      </Drawer>
    );
  }
}
