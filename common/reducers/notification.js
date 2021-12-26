import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/notification/', [
  'LOADCORPMESSAGES', 'LOADCORPMESSAGES_SUCCEED', 'LOADCORPMESSAGES_FAIL',
  'DEL_ALLREAD', 'DEL_ALLREAD_SUCCEED', 'DEL_ALLREAD_FAIL',
  'MARK_MSGREAD', 'MARK_MSGREAD_SUCCEED', 'MARK_MSGREAD_FAIL',
  'COUNT_UNREADMSG', 'COUNT_UNREADMSG_SUCCEED', 'COUNT_UNREADMSG_FAIL',
  'SEND_MESSAGE_SUCCEED', 'SHOW_NOTIFICATION_DOCK', 'HIDE_NOTIFICATION_DOCK',
  'GET_TASKS', 'GET_TASKS_SUCCEED', 'GET_TASKS_FAIL',
  'COLLAB_TASK_LIST', 'COLLAB_TASK_LIST_SUCCEED', 'COLLAB_TASK_LIST_FAIL',
  'TASK_EDIT', 'TASK_EDIT_SUCCEED', 'TASK_EDIT_FAIL',
  'TASK_DELETE', 'TASK_DELETE_SUCCEED', 'TASK_DELETE_FAIL',
  'HIDE_COLLAB_INDICATOR', 'SET_COLLAB_PARAMS',
]);

const initialState = {
  loading: false,
  submitting: false,
  dockVisible: false,
  messages: {
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    data: [],
  },
  myCreatedTasks: {
    hasMore: true,
    status: 'pending',
    data: [],
    loading: false,
  },
  myExecTasks: {
    hasMore: true,
    status: 'pending',
    data: [],
    loading: false,
  },
  unreadMessage: {
    count: 0,
    incomingOne: null,
  },
  sendMessage: {
    count: 0,
  },
  taskList: [],
  collabParams: {},
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOADCORPMESSAGES: {
      return { ...state, loading: true };
    }
    case actionTypes.LOADCORPMESSAGES_FAIL: {
      return { ...state, loading: false };
    }
    case actionTypes.LOADCORPMESSAGES_SUCCEED:
      return { ...state, messages: action.result.data, loading: false };
    case actionTypes.MARK_MSGREAD_SUCCEED: {
      let unreadNum = state.unreadMessage.count;
      const { msgItemId } = action.data;
      if (msgItemId) {
        unreadNum -= 1;
      } else {
        unreadNum = 0;
      }
      const newMessageData = state.messages.data.map((nmd) => {
        if (msgItemId) {
          if (nmd.id === msgItemId) {
            return { ...nmd, status: 1 };
          }
          return nmd;
        }
        return { ...nmd, status: 1 };
      });
      return {
        ...state,
        unreadMessage: { ...state.unreadMessage, count: unreadNum },
        messages: { ...state.messages, data: newMessageData },
      };
    }
    case actionTypes.DEL_ALLREAD_SUCCEED: {
      const newMessageData = state.messages.data.filter((nmd) => {
        if (action.data.msgItemId) {
          return nmd.id !== action.data.msgItemId;
        }
        return nmd.status === 0;
      });
      const unreadNum = newMessageData.filter(nmd => nmd.status === 0).length;
      return {
        ...state,
        unreadMessage: { ...state.unreadMessage, count: unreadNum },
        messages: { ...state.messages, data: newMessageData },
      };
    }
    case actionTypes.COUNT_UNREADMSG_SUCCEED: {
      return { ...state, unreadMessage: action.result.data };
    }
    case actionTypes.SEND_MESSAGE_SUCCEED: {
      return { ...state, sendMessage: { count: state.sendMessage.count + 1, ...action.data } };
    }
    case actionTypes.SHOW_NOTIFICATION_DOCK: {
      return { ...state, dockVisible: true };
    }
    case actionTypes.HIDE_NOTIFICATION_DOCK: {
      return { ...state, dockVisible: false };
    }
    case actionTypes.GET_TASKS:
      return action.params.role === 'create' ? {
        ...state,
        myCreatedTasks: { ...state.myCreatedTasks, status: action.params.status, loading: true },
      } : {
        ...state,
        myExecTasks: { ...state.myExecTasks, status: action.params.status, loading: true },
      };
    case actionTypes.GET_TASKS_SUCCEED: {
      // 如果是首页 则 刷新data, 否则连接data
      const taskResult = {
        hasMore: action.result.data.hasMore,
        loading: false,
      };
      if (action.params.role === 'create') {
        taskResult.data = !action.params.lastId ?
          action.result.data.rows : state.myCreatedTasks.data.concat(action.result.data.rows);
        return {
          ...state,
          myCreatedTasks: {
            ...state.myCreatedTasks,
            ...taskResult,
          },
        };
      }
      taskResult.data = !action.params.lastId ?
        action.result.data.rows : state.myExecTasks.data.concat(action.result.data.rows);
      return {
        ...state,
        myExecTasks: {
          ...state.myExecTasks,
          ...taskResult,
        },
      };
    }
    case actionTypes.COLLAB_TASK_LIST_SUCCEED:
      return {
        ...state,
        taskList: action.result.data,
      };
    case actionTypes.TASK_EDIT_SUCCEED: {
      const { data } = action.result;
      if (state.taskList.length > 0) {
        const taskList = [...state.taskList];
        const index = taskList.findIndex(ta => ta.id === data.id);
        taskList[index] = data;
        return { ...state, taskList };
      }
      let myCreatedTasks = [...state.myCreatedTasks.data];
      if (data.status === 1) {
        if (state.myCreatedTasks.status === 'pending' || state.myCreatedTasks.status === 'expired') {
          myCreatedTasks = myCreatedTasks.filter(task => task.id !== data.id);
        } else if (state.myCreatedTasks.status === 'resolved' && data.executor === data.createdBy) {
          myCreatedTasks.push(data);
        }
      } else {
        const createdIndex = myCreatedTasks.findIndex(ta => ta.id === data.id);
        if (createdIndex !== -1) {
          myCreatedTasks[createdIndex] = data;
        }
      }
      let myExecTasks = [...state.myExecTasks.data];
      if (data.status === 1) {
        if (state.myExecTasks.status === 'pending') {
          myExecTasks = myExecTasks.filter(task => task.id !== data.id);
        } else if (state.myExecTasks.status === 'resolved' && data.executor === data.createdBy) {
          myExecTasks.push(data);
        }
      } else {
        const execIndex = myExecTasks.findIndex(ta => ta.id === action.result.data.id);
        if (execIndex !== -1) {
          myExecTasks[execIndex] = data;
        }
      }
      return {
        ...state,
        myCreatedTasks: {
          ...state.myCreatedTasks,
          data: myCreatedTasks,
        },
        myExecTasks: {
          ...state.myExecTasks,
          data: myExecTasks,
        },
      };
    }
    case actionTypes.TASK_DELETE_SUCCEED: {
      if (state.taskList.length > 0) {
        const taskList = state.taskList.filter(task => task.id !== action.data.taskId);
        return { ...state, taskList };
      }
      const myCreatedTasks = state.myCreatedTasks.data.filter(ta => ta.id !== action.data.taskId);
      const myExecTasks = state.myExecTasks.data.filter(ta => ta.id !== action.data.taskId);
      return {
        ...state,
        myCreatedTasks: {
          ...state.myCreatedTasks,
          data: myCreatedTasks,
        },
        myExecTasks: {
          ...state.myExecTasks,
          data: myExecTasks,
        },
      };
    }
    case actionTypes.HIDE_COLLAB_INDICATOR:
      return { ...state, taskList: [], collabParams: initialState.collabParams };
    case actionTypes.SET_COLLAB_PARAMS:
      return { ...state, collabParams: action.data };
    default:
      return state;
  }
}

export function loadMessages(params) {
  return {
    [CLIENT_API]: {
      types: [actionTypes.LOADCORPMESSAGES,
        actionTypes.LOADCORPMESSAGES_SUCCEED,
        actionTypes.LOADCORPMESSAGES_FAIL],
      endpoint: 'v1/notification/messagelist',
      method: 'get',
      params,
    },
  };
}

export function deleteAllRead(msgItemId) {
  return {
    [CLIENT_API]: {
      types: [actionTypes.DEL_ALLREAD,
        actionTypes.DEL_ALLREAD_SUCCEED,
        actionTypes.DEL_ALLREAD_FAIL],
      endpoint: 'v1/notification/message/delread',
      method: 'post',
      data: { msgItemId },
    },
  };
}

export function markMessageRead(msgItemId) {
  return {
    [CLIENT_API]: {
      types: [actionTypes.MARK_MSGREAD,
        actionTypes.MARK_MSGREAD_SUCCEED,
        actionTypes.MARK_MSGREAD_FAIL],
      endpoint: 'v1/notification/message/markread',
      method: 'post',
      data: { msgItemId },
    },
  };
}

export function countUnreadMsg(incoming) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COUNT_UNREADMSG,
        actionTypes.COUNT_UNREADMSG_SUCCEED,
        actionTypes.COUNT_UNREADMSG_FAIL,
      ],
      endpoint: 'v1/notification/unreadmsgnum',
      method: 'get',
      params: { incoming },
    },
  };
}

export function sendMessage(data) {
  return {
    type: actionTypes.SEND_MESSAGE_SUCCEED,
    data,
  };
}

export function showNotificationDock() {
  return {
    type: actionTypes.SHOW_NOTIFICATION_DOCK,
  };
}

export function hideNotificationDock() {
  return {
    type: actionTypes.HIDE_NOTIFICATION_DOCK,
  };
}

export function getTasks(role, status, lastId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_TASKS,
        actionTypes.GET_TASKS_SUCCEED,
        actionTypes.GET_TASKS_FAIL,
      ],
      endpoint: 'v1/notification/pendtasklist',
      method: 'get',
      params: {
        role, status, lastId: lastId || undefined,
      },
    },
  };
}

export function getCollabTaskList(bizNo, bizObjs) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.COLLAB_TASK_LIST,
        actionTypes.COLLAB_TASK_LIST_SUCCEED,
        actionTypes.COLLAB_TASK_LIST_FAIL,
      ],
      endpoint: 'v1/collab/tasklist',
      method: 'post',
      data: { bizNo, bizObjs },
    },
  };
}

export function taskEdit(field, value, taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TASK_EDIT,
        actionTypes.TASK_EDIT_SUCCEED,
        actionTypes.TASK_EDIT_FAIL,
      ],
      endpoint: 'v1/collab/editpendtask',
      method: 'post',
      data: { field, value, taskId },
    },
  };
}

export function deleteTask(taskId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.TASK_DELETE,
        actionTypes.TASK_DELETE_SUCCEED,
        actionTypes.TASK_DELETE_FAIL,
      ],
      endpoint: 'v1/collab/delpendtask',
      method: 'post',
      data: { taskId },
    },
  };
}

export function hideCollabIndicator() {
  return {
    type: actionTypes.HIDE_COLLAB_INDICATOR,
  };
}

export function paasCollabTaskParam(collabBizParam) {
  return {
    type: actionTypes.SET_COLLAB_PARAMS,
    data: collabBizParam,
  };
}
