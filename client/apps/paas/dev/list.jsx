import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Badge, Button, Card, Icon, Layout, List, message } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';
import { toggleAppCreateModal, loadDevApps, deleteDevApp } from 'common/reducers/hubDevApp';
import RowAction from 'client/components/RowAction';
import PaaSMenu from '../menu';
import AppCreateModal from './modal/appCreateModal';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    apps: state.hubDevApp.apps,
    pageSize: state.hubDevApp.apps.pageSize,
    filter: state.hubDevApp.filter,
  }),
  { toggleAppCreateModal, loadDevApps, deleteDevApp }
)
export default class DevAppList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadDevApps({
      pageSize: this.props.apps.pageSize,
      current: 1,
      filter: JSON.stringify({}),
    });
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('appName'),
    dataIndex: 'app_name',
  }, {
    title: this.msg('scope'),
    dataIndex: 'scope',
  }, {
    title: this.msg('apiKey'),
    width: 400,
    dataIndex: 'api_key',
  }, {
    title: this.msg('apiSecret'),
    dataIndex: 'api_secret',
    width: 400,
  }, {
    title: this.msg('opCol'),
    width: 100,
    render: () => (
      <span>
        <a href="#">修改</a>
        <span className="ant-divider" />
        <a href="#"><Icon type="delete" /></a>
      </span>
    ),
  }];

  handleCancel = () => {
    this.context.router.goBack();
  }
  handleConfig = (appId) => {
    this.context.router.push(`/paas/dev/${appId}`);
  }
  handleCreateApp = () => {
    this.props.toggleAppCreateModal(true);
  }
  handleDeleteApp = (id) => {
    this.props.deleteDevApp(id).then((result) => {
      if (!result.error) {
        message.info(this.msg('deletedSucceed'));
        this.props.loadDevApps({
          pageSize: this.props.apps.pageSize,
          current: this.props.apps.current,
          filter: JSON.stringify({}),
        });
      } else {
        message.error(result.error.message, 5);
      }
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.props.loadDevApps({
      pageSize: this.props.apps.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
  }
  handleOpenApiDocs = () => {
    window.open('https://docs.welogix.cn');
  }
  render() {
    const { apps, filter } = this.props;
    const pagination = {
      hideOnSinglePage: true,
      size: 'small',
      pageSize: Number(apps.pageSize),
      current: Number(apps.current),
      total: apps.total,
      showTotal: total => `共 ${total} 条`,
      onChange: (page, pageSize) => {
        this.props.loadDevApps({
          pageSize,
          current: page,
          filter: JSON.stringify(filter),
        });
      },
    };
    return (
      <Layout>
        <PaaSMenu currentKey="dev" />
        <Layout>
          <PageHeader title={this.msg('openDev')}>
            <PageHeader.Actions>
              <Button icon="book" onClick={this.handleOpenApiDocs}>{this.msg('apiDocs')}</Button>
              <Button type="primary" icon="plus" onClick={this.handleCreateApp}>
                {this.msg('create')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <Card
              size="small"
              title={<SearchBox placeholder={this.msg('searchTip')} onSearch={this.handleSearch} />}
            >
              <List
                grid={{ gutter: 16, column: 4 }}
                split={false}
                dataSource={this.props.apps.data}
                pagination={pagination}
                renderItem={item => (
                  <List.Item key={item.app_id}>
                    <Card
                      hoverable
                      className="list-item-card"
                    >
                      <RowAction onDelete={() => this.handleDeleteApp(item.id)} row={item} />
                      <Card.Meta
                        avatar={item.app_logo ? <Avatar size="large" shape="square" src={item.app_logo} /> : <Avatar size="large" icon="code" />}
                        title={item.app_name}
                        description={<Ellipsis lines={1}>{item.app_desc || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                        onClick={() => this.handleConfig(item.app_id)}
                      />
                      <div style={{ marginTop: 8 }}>
                        {item.status ? <Badge status="success" text="已上线" /> : <Badge status="default" text="未上线" />}
                      </div>
                    </Card>
                  </List.Item>
                  )}
              />
            </Card>
          </Content>
          <AppCreateModal />
        </Layout>
      </Layout>
    );
  }
}
