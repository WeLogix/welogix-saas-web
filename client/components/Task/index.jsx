/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Card, Checkbox, Col, DatePicker, Select, Row, Tag, Typography } from 'antd';
import { taskEdit, deleteTask } from 'common/reducers/notification';
import { MemberSelect } from 'client/components/ComboSelect';
import RowAction from 'client/components/RowAction';
import { NOTIFICATION_PRIORITIES } from 'common/constants';
import UserAvatar from 'client/components/UserAvatar';
import { formatMsg } from '../message.i18n';
import './style.less';

const { Text, Paragraph } = Typography;
const { Option } = Select;
@injectIntl
@connect(state => ({
  loginId: state.account.loginId,
}), {
  taskEdit, deleteTask,
})
export default class Task extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    task: PropTypes.shape({
      title: PropTypes.string,
      status: PropTypes.number,
    }),
  }
  state = {
    expanded: false,
  }
  msg = formatMsg(this.props.intl)
  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }
  handleEditTask = (field, value) => {
    const { id } = this.props.task;
    this.props.taskEdit(field, value, id);
  }
  handleDelete = () => {
    const { id } = this.props.task;
    this.props.deleteTask(id);
  }
  renderTitle(title, status, disabled) {
    const { expanded } = this.state;
    const { loginId, task: { executor } } = this.props;
    const editable = !status && loginId === executor;
    return (<span>
      <Checkbox disabled={!editable} checked={status} onChange={() => this.handleEditTask('ntask_status', 1)} />
      {expanded ?
        <Text editable={disabled ? false : { onChange: value => this.handleEditTask('ntask_title', value) }}>{title}</Text> :
        <a onClick={this.toggle}><Text>{title}</Text></a>}
    </span>);
  }
  renderExtra(disabled) {
    const { deadline, executor } = this.props.task;
    const { expanded } = this.state;
    if (expanded) {
      const actions = (<span>
        {!disabled && <RowAction icon="ellipsis" confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} />}
        <RowAction icon="up" tooltip="收起" onClick={this.toggle} />
      </span>);
      return actions;
    }
    return (<span>{deadline && <Tag>{moment(deadline).format('MM月DD日 截止')}</Tag>}
      <UserAvatar style={{ backgroundColor: '#40a9ff' }} loginId={executor} />
    </span>);
  }

  render() {
    const {
      loginId,
      task: {
        title, priority, status, content, executor, deadline, createdBy,
      },
    } = this.props;
    const { expanded } = this.state;
    const classes = classNames('welo-task', {
      'welo-task-expanded': expanded,
      'welo-task-normal': priority === NOTIFICATION_PRIORITIES[3].value,
      'welo-task-high': priority === NOTIFICATION_PRIORITIES[2].value,
      'welo-task-critical': priority === NOTIFICATION_PRIORITIES[1].value,
      'welo-task-done': status === 1,
    });
    const disabled = status === 1 || loginId !== createdBy;
    return (
      <div className={classes}>
        <Card
          title={this.renderTitle(title, status, disabled)}
          extra={this.renderExtra(disabled)}
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={9}>
              <MemberSelect
                memberOnly
                memberDisabled={disabled}
                selectMode="single"
                selectMembers={executor && String(executor)}
                onMemberChange={value => this.handleEditTask('ntask_recv_by', Number(value))}
              />
            </Col>
            <Col span={10}>
              <DatePicker
                allowClear
                showTime
                placeholder="截止时间"
                style={{ width: '100%' }}
                format="MM月DD日 HH:mm 截止"
                disabled={disabled}
                defaultValue={deadline && moment(deadline)}
                onOk={value => this.handleEditTask('ntask_deadline_date', new Date(value))}
              />
            </Col>
            <Col span={5}>
              <Select
                value={priority}
                showArrow={false}
                style={{ width: '100%' }}
                disabled={disabled}
                onSelect={value => this.handleEditTask('ntask_priority', value)}
              >
                {NOTIFICATION_PRIORITIES.filter(pri => pri.value).map(pri => (
                  <Option key={pri.key} value={pri.value}>
                    <Tag color={pri.tag}>{pri.text}</Tag>
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <div className="welo-task-content-wrapper">
            <Paragraph
              editable={(!status && (loginId === executor || loginId === createdBy)) ? { onChange: value => this.handleEditTask('ntask_content', value) } : false}
            >{content}</Paragraph>
          </div>
        </Card>
      </div>
    );
  }
}
