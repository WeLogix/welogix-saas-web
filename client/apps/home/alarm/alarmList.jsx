import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import moment from 'moment';
import { Avatar, Card, List } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { Ellipsis } from 'ant-design-pro';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../message.i18n';

function getAvatar(alert) {
  if (alert.category === 'CLS') {
    return <Avatar src="https://static-cdn.welogix.cn/images/icon-hscode.png" shape="square" />;
  } else if (alert.category === 'PRC') {
    return <Avatar src="https://static-cdn.welogix.cn/images/icon-price.png" />;
  } else if (alert.category === 'tmsShipment') {
    return <Avatar src="https://static-cdn.welogix.cn/images/icon-usd.png" />;
  } else if (alert.category === 'cwmReceiving') {
    return <Avatar src="https://static-cdn.welogix.cn/images/icon-usd.png" />;
  } else if (alert.category === 'cwmShipping') {
    return <Avatar src="https://static-cdn.welogix.cn/images/icon-usd.png" />;
  }
  return <Avatar icon="file-text" />;
}

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
  }),
  { }
)
export default class AlarmList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    // this.props.loadRecentActivities(10, { user: this.props.loginId });
  }
  msg = formatMsg(this.props.intl)
  handleAlert = (alert) => {
    if (alert && alert.link) {
      this.context.router.push(alert.link);
    }
  }
  render() {
    const alerts = [
      {
        id: 2345,
        title: '相同货号商品归类不一致',
        category: 'CLS',
        content: '220条货号中文品名不一致 规范申报要素不一致',
        created_date: '2018-12-24T08:09:02.000Z',
        link: '/clearance/tradeitem/workspace/conflicts',
      },
      {
        id: 2346,
        title: '进口单价异常',
        category: 'PRC',
        content: '',
        created_date: '2018-12-24T08:09:02.000Z',
      },
      {
        id: 2347,
        title: '进口申报大额税金预警',
        category: 'PRC',
        content: '',
        created_date: '2018-12-22T08:09:02.000Z',
      },
      {
        id: 2348,
        title: '进口商品监管证件缺失',
        category: 'CRT',
        content: '',
        created_date: '2018-12-17T08:09:02.000Z',
      },
      {
        id: 2349,
        title: '资质证书近效期/余量不足',
        category: 'CRT',
        content: '',
        created_date: '2018-12-07T08:09:02.000Z',
      },
      {
        id: 2350,
        title: '税则变更商品归类失效',
        category: 'CLS',
        content: '',
        created_date: '2018-11-17T08:09:02.000Z',
      },
    ];
    return (
      <List
        itemLayout="horizontal"
        dataSource={alerts}
        renderItem={alert => (
          <Card
            hoverable
            size="small"
            className="list-item-card"
            key={alert.id}
            // onClick={() => this.handleReadMessage(item)}
          >
            <RowAction icon="close" onClick={this.handleAlert} row={alert} />
            <Card.Meta
              avatar={getAvatar(alert)}
              title={alert.title}
              description={<Ellipsis lines={2}>{alert.content || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
            />
          </Card>
          )}
      />
    );
  }
}
