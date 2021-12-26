import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Form, Layout, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import FeeMappingPane from './tabpane/feeMappingPane';
import BillTermPane from './tabpane/billTermPane';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    templateFeelist: state.bssBillTemplate.currentTemplate.templateFeelist,
    loading: state.bssBillTemplate.templateFeeListLoading,
    listFilter: state.bssBillTemplate.templateFeeListFilter,
    billTemplatelist: state.bssBillTemplate.billTemplatelist,
    allFeeElements: state.bssSetting.allFeeElements,
    billProps: state.bssBillTemplate.currentTemplate.templateProps,
    templateName: state.bssBillTemplate.currentTemplate.templateName,
  }),
  {
  }
)
@connectNav({
  depth: 3,
  moduleName: 'bss',
})
@Form.create()
export default class TemplateFees extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      templateName,
    } = this.props;
    return (
      <Layout>
        <PageHeader title={templateName} />
        <PageContent>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="feeMapping">
              <TabPane tab={this.msg('feeMapping')} key="feeMapping">
                <FeeMappingPane templateId={this.props.params.templateId} />
              </TabPane>
              <TabPane tab={this.msg('billTerm')} key="billTerm">
                <BillTermPane form={this.props.form} />
              </TabPane>
            </Tabs>
          </Card>
        </PageContent>
      </Layout>
    );
  }
}
