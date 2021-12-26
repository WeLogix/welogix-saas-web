/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import Task from 'client/components/Task';

export default function TaskList(props) {
  const { tasks } = props;
  return (
    <List
      className="welo-task-list"
      itemLayout="horizontal"
      dataSource={tasks.sort((a, b) => a.status - b.status)}
      renderItem={task => (
        <Task
          task={task}
        />
      )}
    />
  );
}

TaskList.propTypes = {
  maxLen: PropTypes.number,
  text: PropTypes.string,
  tailer: PropTypes.number,
};
