import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Layout, Button, Tabs, message } from 'antd';
import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { addPermit, updateLocalPermit } from 'common/reducers/cmsPermit';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PermitHeadPane from './tabpane/permitHeadPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    currentPermit: state.cmsPermit.currentPermit,
  }),
  { addPermit, updateLocalPermit }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@Form.create()
export default class PermitAdd extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.updateLocalPermit();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        if (values.start_date) values.start_date.set({ hour: 0, minute: 0, second: 0 });
        if (values.stop_date) values.stop_date.set({ hour: 0, minute: 0, second: 0 });
        const newPermit = {
          ...values,
          permit_file: this.props.currentPermit.permit_file,
        };
        const opContent = ['添加证件'];
        this.props.addPermit(newPermit, opContent).then((result) => {
          if (!result.error) {
            this.context.router.push(`/clearance/permit/${result.data}`);
          } else {
            message.error(result.error.message, 10);
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }
  render() {
    const { form } = this.props;
    const tabs = [];
    tabs.push(<TabPane tab={this.msg('infoTab')} key="head">
      <PermitHeadPane action="create" form={form} />
    </TabPane>);
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('permit'), this.msg('addPermit')]}>
          <PageHeader.Actions>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Button type="primary" icon="save" onClick={this.handleSave}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="head">
              {tabs}
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
