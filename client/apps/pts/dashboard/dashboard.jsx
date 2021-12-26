import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Row, Col, Layout } from 'antd';
import QueueAnim from 'rc-queue-anim';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { format } from 'client/common/i18n/helpers';
import { connect } from 'react-redux';
import messages from './message.i18n';

const formatMsg = format(messages);
const { Content } = Layout;

@injectIntl
@connectNav({
  depth: 2,
  moduleName: 'pts',
  title: 'featPtsDashboard',
})
@connect(
  () => ({
  }),
  { }
)
export default class PTSDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }

  msg = key => formatMsg(this.props.intl, key);
  render() {
    return (
      <QueueAnim type={['bottom', 'up']}>
        <PageHeader>
          <PageHeader.Actions>

          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <Row gutter={16}>
            <Col sm={24} />
          </Row>
        </Content>
      </QueueAnim>
    );
  }
}
