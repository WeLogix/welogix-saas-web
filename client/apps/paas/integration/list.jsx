import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Badge, Button, Card, Collapse, Icon, Layout, List, message } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import PageHeader from 'client/components/PageHeader';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { INTEGRATION_APPS } from 'common/constants';
import { loadInstalledApps, deleteApp, updateAppStatus, toggleInstallAppModal } from 'common/reducers/hubIntegration';
import InstallAppModal from './common/installAppModal';
import PaaSMenu from '../menu';
import { formatMsg } from './message.i18n';
import './index.less';

const { Content } = Layout;
const { Panel } = Collapse;

function fetchData({ state, dispatch }) {
  return dispatch(loadInstalledApps({
    tenantId: state.account.tenantId,
    filter: JSON.stringify(state.hubIntegration.listFilter),
    sorter: JSON.stringify(state.hubIntegration.sortFilter),
    pageSize: state.hubIntegration.installedAppsList.pageSize,
    current: 1,
  }));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    listFilter: state.hubIntegration.listFilter,
    sortFilter: state.hubIntegration.sortFilter,
    installedAppsList: state.hubIntegration.installedAppsList,
  }),
  {
    loadInstalledApps, deleteApp, updateAppStatus, toggleInstallAppModal,
  }
)
export default class InstalledAppsList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('integrationName'),
    dataIndex: 'name',
    width: 400,
  }, {
    title: this.msg('integrationAppType'),
    dataIndex: 'app_type',
    render: (app) => {
      if (app === 'EASIPASS') {
        return 'EASIPASS EDI';
      } else if (app === 'ARCTM') {
        return 'AmberRoad CTM';
      } else if (app === 'SHFTZ') {
        return '上海自贸区监管系统';
      } else if (app === 'SFEXPRESS') {
        return '顺丰快递';
      }
      return <span />;
    },
  }]
  handleInstall = (link) => {
    this.context.router.push(link);
  }
  toggleInstallAppModal = (type) => {
    this.props.toggleInstallAppModal(true, type);
  }
  handleAppConfig = (row) => {
    let appType = null;
    if (row.app_type === 'EASIPASS') {
      appType = 'easipass';
    } else if (row.app_type === 'ARCTM') {
      appType = 'arctm';
    } else if (row.app_type === 'SHFTZ') {
      appType = 'shftz';
    } else if (row.app_type === 'SFEXPRESS') {
      appType = 'sfexpress';
    } else if (row.app_type === 'SW') {
      appType = 'singlewindow';
    }
    const link = `/paas/integration/${appType}/config/${row.uuid}`;
    this.context.router.push(link);
  }
  handleSearch = (value) => {
    const {
      listFilter, sortFilter, installedAppsList,
    } = this.props;
    const filter = { ...listFilter, searchText: value };
    this.props.loadInstalledApps({
      filter: JSON.stringify(filter),
      sorter: JSON.stringify(sortFilter),
      pageSize: installedAppsList.pageSize,
      current: 1,
    });
  }
  handleDeleteApp = (uuid) => {
    const {
      listFilter, sortFilter, installedAppsList,
    } = this.props;
    this.props.deleteApp(uuid).then((result) => {
      if (!result.error) {
        message.info(this.msg('deletedSucceed'));
        this.props.loadInstalledApps({
          filter: JSON.stringify(listFilter),
          sorter: JSON.stringify(sortFilter),
          pageSize: installedAppsList.pageSize,
          current: installedAppsList.current,
        });
      } else {
        message.error(result.error.message, 5);
      }
    });
  }
  render() {
    const { installedAppsList } = this.props;
    const pagination = {
      hideOnSinglePage: true,
      size: 'small',
      pageSize: installedAppsList.pageSize,
      current: installedAppsList.current,
      total: installedAppsList.totalCount,
      showTotal: total => `共 ${total} 条`,
      onChange: (page) => {
        this.props.loadInstalledApps({
          tenantId: this.props.tenantId,
          filter: JSON.stringify(this.props.listFilter),
          sorter: JSON.stringify(this.props.sortFilter),
          pageSize: installedAppsList.pageSize,
          current: page,
        });
      },
    };
    return (
      <Layout>
        <PaaSMenu currentKey="integration" />
        <Layout>
          <PageHeader title={<span><Icon type="api" /> {this.msg('integration')}</span>} />
          <Content className="page-content">
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel header={this.msg('sysInterface')} key="1" style={{ backgroundColor: '#f5f5f5' }}>
                <List
                  grid={{
                    gutter: 16, column: 6,
                  }}
                  split={false}
                  dataSource={INTEGRATION_APPS}
                  renderItem={item => (
                    <List.Item>
                      <Card className="app-card" hoverable>
                        <div className="app-logo">
                          <Avatar shape="square" style={{ backgroundColor: '#fff' }} src={item.logo} />
                        </div>
                        <h4 className="app-title">{item.title}</h4>
                        <Button
                          type="primary"
                          ghost
                          icon="plus-circle-o"
                          onClick={() => this.toggleInstallAppModal(item.app_type)}
                        >{this.msg('install')}</Button>
                      </Card>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
            <Card
              size="small"
              title={<SearchBox
                value={this.props.listFilter.searchText}
                placeholder={this.msg('searchTip')}
                onSearch={this.handleSearch}
              />}
            >
              <List
                grid={{ gutter: 16, column: 4 }}
                split={false}
                dataSource={installedAppsList.data}
                pagination={pagination}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className="list-item-card"
                    >
                      <RowAction onDelete={() => this.handleDeleteApp(item.uuid)} row={item} />
                      <Card.Meta
                        avatar={<Avatar size="large" shape="square" style={{ backgroundColor: '#fff' }} src={INTEGRATION_APPS.find(app => app.app_type === item.app_type).logo} />}
                        title={item.name}
                        description={<Ellipsis lines={1}>{item.desc || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                        onClick={() => this.handleAppConfig(item)}
                      />
                      <div style={{ marginTop: 8 }}>
                        {item.enabled === 1 ?
                          <Badge status="success" text={this.msg('appEnabled')} /> :
                          <Badge status="default" text={this.msg('appDisabled')} />}
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Content>
          <InstallAppModal />
        </Layout>
      </Layout>
    );
  }
}
