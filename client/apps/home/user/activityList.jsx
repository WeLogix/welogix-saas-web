import React from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadRecentActivities } from 'common/reducers/operationLog';
import Activity from 'client/components/Activity';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    recentActivities: state.operationLog.userActivities,
  }),
  { loadRecentActivities }
)
export default class ActivityList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    this.props.loadRecentActivities(20, { user: this.props.loginId });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      recentActivities,
    } = this.props;
    return (
      <List
        className="welo-task-list"
        itemLayout="horizontal"
        dataSource={recentActivities}
        renderItem={activity => (
          <Activity
            activity={activity}
          />
        )}
      />
    );
  }
}
