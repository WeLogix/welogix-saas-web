import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { List, Button, Spin } from 'antd';
import { loadChangeLogs } from 'common/reducers/saasBase';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    changeLogs: state.saasBase.changeLogs.posts,
    hasMore: state.saasBase.changeLogs.hasMore,
    page: state.saasBase.changeLogs.page,
    loading: state.saasBase.clogLoading,
  }),
  { loadChangeLogs }
)
export default class ChangeLogList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };
  componentDidMount() {
    this.props.loadChangeLogs(1);
  }
  handleLoadMore = () => {
    this.props.loadChangeLogs(this.props.page + 1);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      changeLogs, loading, hasMore,
    } = this.props;
    const loadMore = hasMore ? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
        }}
      >
        {loading && <Spin />}
        {!loading && <Button onClick={this.handleLoadMore}>{this.msg('loadingMore')}</Button>}
      </div>
    ) : null;
    return (
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="vertical"
        loadMore={loadMore}
        dataSource={changeLogs}
        renderItem={item => (
          <List.Item
            extra={moment(item.updated_at).fromNow()}
          >
            <List.Item.Meta
              title={<a href={`https://www.yuque.com/${item.yuque_urlpath}`} target="_blank">{item.title}</a>} //eslint-disable-line
            />
          </List.Item>
        )}
      />
    );
  }
}
