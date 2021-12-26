import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Card, Collapse, Form, Layout, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import { loadSFExpressApp, updateSFExpressApp } from 'common/reducers/hubIntegration';
import PageHeader from 'client/components/PageHeader';
import ProfileForm from '../common/profileForm';
import ParamsForm from './forms/paramsForm';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Panel } = Collapse;

function fetchData({ dispatch, params }) {
  return dispatch(loadSFExpressApp(params.uuid));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    app: state.hubIntegration.currentApp,
    sfexpress: state.hubIntegration.sfexpress,
  }),
  { updateSFExpressApp }
)
@Form.create()
export default class ConfigSFExpress extends React.Component {
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
  renderStatusTag(enabled) {
    return enabled ? <Tag color="green">{this.msg('appEnabled')}</Tag> : <Tag>{this.msg('appDisabled')}</Tag>;
  }
  render() {
    const { sfexpress, app } = this.props;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('integration'),
            this.msg('appSFExpress'),
            <span>{sfexpress.name} {this.renderStatusTag(app.enabled)}</span>,
          ]}
        >
          <PageHeader.Actions>
            <Button icon="close" onClick={this.handleClose}>
              {this.msg('close')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content layout-fixed-width">
          <Card bodyStyle={{ padding: 0 }}>
            <Collapse accordion bordered={false} defaultActiveKey={['params']}>
              <Panel header="基本信息" key="profile">
                <ProfileForm app={sfexpress} />
              </Panel>
              <Panel header="参数配置" key="params">
                <ParamsForm config={sfexpress} />
              </Panel>
            </Collapse>
          </Card>
        </Content>
      </Layout>
    );
  }
}
