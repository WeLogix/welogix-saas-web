import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Tabs, Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import PageHeader from 'client/components/PageHeader';
import { PAAS_DW_OBJECT_MSG } from 'common/constants';
import FieldsTable from './fieldsTable';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@connectFetch()()
@injectIntl
export default class BizObjectMeta extends React.Component {
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
  render() {
    const { obj } = this.context.router.params;
    if (!PAAS_DW_OBJECT_MSG[obj]) {
      return null;
    }
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('objectMeta'),
            <span>{this.msg(PAAS_DW_OBJECT_MSG[obj].title)}</span>,
          ]}
        >
          <PageHeader.Actions>
            <Button icon="close" onClick={this.handleClose}>
              {this.msg('close')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs>
              <TabPane tab="主数据字段" key="mainFields">
                <FieldsTable objName={obj} tab="main" />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    );
  }
}
