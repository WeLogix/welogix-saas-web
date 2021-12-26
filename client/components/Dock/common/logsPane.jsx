import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Avatar, Card, Empty, Icon, Timeline, Typography } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import { loadBizObjLogs } from 'common/reducers/operationLog';
import './style.less';

const { Paragraph } = Typography;

export function LogItem(props) {
  const {
    timestamp, loginId, content,
  } = props;
  return (
    <div className="log-item">
      <div className="log-item-l">
        <div><Icon type="clock-circle" style={{ color: '#ccc' }} /> {moment(timestamp).format('HH:mm')}</div>
        <div>{moment(timestamp).format('YYYY/MM/DD')}</div>
      </div>
      <div className="log-item-r">
        {loginId ? <UserAvatar size="small" loginId={loginId} showName /> : <Avatar size="small" icon="robot" />}
        <Paragraph ellipsis={{ rows: 2, expandable: true }} className="log-item-r-content">{content}</Paragraph>
      </div>
    </div>
  );
}
LogItem.propTypes = {
  timestamp: PropTypes.string,
  loginId: PropTypes.number,
  content: PropTypes.string,
};

@connect(
  (state, ownProps) => ({
    billNo: ownProps.billNo || state.operationLog.bizObjLogPanel.billNo,
    bizObject: ownProps.bizObject || state.operationLog.bizObjLogPanel.bizObject,
    bizObjLogs: state.operationLog.bizObjLogs,
  }),
  { loadBizObjLogs },
)
export default class LogsPane extends React.Component {
  static propTypes = {
    billNo: PropTypes.string.isRequired,
    bizObject: PropTypes.string.isRequired,
  }
  state = {
    loading: true,
  }
  componentDidMount() {
    if (this.props.billNo) this.props.loadBizObjLogs(this.props.billNo, this.props.bizObject);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billNo && this.props.billNo !== nextProps.billNo) {
      this.props.loadBizObjLogs(nextProps.billNo, nextProps.bizObject);
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }
  render() {
    const { bizObjLogs, billNo } = this.props;
    const logs = bizObjLogs[billNo] || [];
    return (
      <div className="pane-content tab-pane">
        <Card
          bordered={false}
          bodyStyle={{ padding: 16, paddingTop: 32 }}
          loading={this.state.loading}
        >
          {logs.length === 0 ? <Empty description="暂无操作记录" /> :
          <Timeline>
            {logs.map(log =>
              (<Timeline.Item key={log.id}>
                <LogItem
                  timestamp={log.created_date}
                  loginId={log.login_id}
                  content={log.op_content}
                />
              </Timeline.Item>))}
          </Timeline>}
        </Card>
      </div>
    );
  }
}
