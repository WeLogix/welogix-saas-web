import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Popover, Tooltip } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideCollabIndicator, getCollabTaskList } from 'common/reducers/notification';
import TaskList from './taskList';
import { formatMsg } from '../message.i18n';

import './index.less';

@injectIntl
@connect(state => ({
  taskList: state.notification.taskList,
  userMembers: state.account.userMembers,
  collabParams: state.notification.collabParams,
}), {
  hideCollabIndicator, getCollabTaskList,
})
export default class CollabIndicator extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.handleLoadCollabTasks(this.props.collabParams);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.collabParams !== this.props.collabParams) {
      this.handleLoadCollabTasks(nextProps.collabParams);
    }
  }
  componentWillUnmount() {
    this.props.hideCollabIndicator();
  }
  handleVisibleChange = (visible) => {
    if (visible) {
      this.handleLoadCollabTasks(this.props.collabParams);
    }
  }
  handleLoadCollabTasks = (collabParams) => {
    const { bizNo, bizObject } = collabParams;
    if (bizNo) {
      this.props.getCollabTaskList(bizNo, bizObject);
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { taskList } = this.props;
    if (taskList.length === 0) {
      return null;
    }
    const content = <TaskList tasks={taskList} />;
    const executors = Array.from(new Set(taskList.filter(task =>
      task.executor).map(task => task.executor))).map(exec =>
      this.props.userMembers.find(um => um.login_id === exec));
    const createdBy = (taskList[0] && taskList[0].createdBy) ?
      this.props.userMembers.find(um => um.login_id === taskList[0].createdBy).name : '';
    return (<Popover
      placement="topLeft"
      title="协作任务"
      content={content}
      trigger="click"
      overlayStyle={{ width: 540 }}
      onVisibleChange={this.handleVisibleChange}
    >
      <div style={{ marginRight: 24 }}>
        <div className="avatarList">
          <ul>
            {executors.slice(0, 3).map(exec => (<li className="avatarItem">
              <Tooltip title={exec.name}>
                {exec.avatar ?
                  <Avatar src={exec.avatar} /> : <Avatar style={{ backgroundColor: '#40a9ff' }}>{exec.name.slice(0, 1)}</Avatar>}
              </Tooltip>
            </li>))}
            {executors.length > 3 &&
              <li className="avatarItem">
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{`+${executors.length - 3}`}</Avatar>
              </li>}
          </ul>
        </div>
        {createdBy && <Avatar
          style={{ marginLeft: 8 }}
        >{createdBy.slice(0, 1)}</Avatar>}
      </div>
    </Popover>);
  }
}
