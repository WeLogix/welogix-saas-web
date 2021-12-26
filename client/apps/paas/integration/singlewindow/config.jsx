import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message, Button, Card, Icon, Collapse, Layout, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import { loadSingleWindowApp, updateSingleWindowApp, toggleClientLogPanel } from 'common/reducers/hubIntegration';
import PageHeader from 'client/components/PageHeader';
import ClientLogsPanel from './panel/clientLogsPanel';
import ProfileForm from '../common/profileForm';
import ParamsForm from './forms/paramsForm';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Panel } = Collapse;

function fetchData({ dispatch, params }) {
  return dispatch(loadSingleWindowApp(params.uuid));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    app: state.hubIntegration.currentApp,
    singlewindow: state.hubIntegration.singlewindowApp,
  }),
  { loadSingleWindowApp, updateSingleWindowApp, toggleClientLogPanel }
)
export default class ConfigSingleWindow extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl);
  handleClose = () => {
    this.context.router.goBack();
  }
  handleClientLogView = () => {
    this.props.toggleClientLogPanel(true);
  }
  handleDownload = () => {
    const { uuid } = this.props.app;
    window.open(`${API_ROOTS.default}v1/platform/integration/download/swclientInstall.bat?uuid=${uuid}`);
  }
  handleSwAppSave = (swApp) => {
    this.props.updateSingleWindowApp(swApp).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.success(this.msg('savedSucceed'));
        // this.context.router.goBack();
      }
    });
  }
  renderStatusTag(enabled) {
    return enabled === 1 ? <Tag color="green">{this.msg('appEnabled')}</Tag> : <Tag>{this.msg('appDisabled')}</Tag>;
  }
  render() {
    const { singlewindow, app } = this.props;
    const clientStatus = app.clientStatus ? <Icon type="link" style={{ color: '#76EE00' }} /> : <Icon type="disconnect" style={{ color: '#EE0000' }} />;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('integration'),
            this.msg('appSingleWindow'),
            <span>{singlewindow.name} {this.renderStatusTag(app.enabled)}</span>,
          ]}
        >
          <PageHeader.Actions>
            <Button type="default" icon="download" onClick={this.handleDownload}>{this.msg('downloadSwclientInstall')}</Button>
            <Button onClick={this.handleClientLogView}>
              {clientStatus}
              {this.msg('viewClientLogs')}
            </Button>
            <Button icon="close" onClick={this.handleClose}>
              {this.msg('close')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content layout-fixed-width">
          <Card bodyStyle={{ padding: 0 }}>
            <Collapse accordion bordered={false} defaultActiveKey={['params']}>
              <Panel header="基本信息" key="profile">
                <ProfileForm app={singlewindow} />
              </Panel>
              <Panel header="参数配置" key="params">
                <ParamsForm app={singlewindow} onSave={this.handleSwAppSave} />
              </Panel>
            </Collapse>
          </Card>
        </Content>
        <ClientLogsPanel />
      </Layout>
    );
  }
}
