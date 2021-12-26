import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Layout, Button, Tabs, message } from 'antd';
import { loadWorkspaceItem, saveWorkspaceItem, notifyFormChanged } from 'common/reducers/cmsTradeitem';
import connectNav from 'client/common/decorators/connect-nav';
import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import ItemMasterPane from '../repo/item/tabpane/itemMasterPane';
import ItemSuggestPane from '../repo/item/tabpane/itemSuggestPane';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    itemData: state.cmsTradeitem.workspaceItem,
    submitting: state.cmsTradeitem.submitting,
    formChanged: state.cmsTradeitem.formChanged,
  }),
  { saveWorkspaceItem, loadWorkspaceItem, notifyFormChanged }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class WorkItemPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ validateFields: PropTypes.func }).isRequired,
    itemData: PropTypes.shape({ id: PropTypes.number }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const itemId = parseInt(this.props.params.id, 10);
    this.props.loadWorkspaceItem(itemId);
  }
  msg = formatMsg(this.props.intl)
  acceptItemMasterMethods = (itemMasterMethods) => {
    [this.getFormValues] = itemMasterMethods;
  }
  handleSave = () => {
    // work item donot validate
    const item = this.getFormValues();
    this.props.saveWorkspaceItem(item).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.success('保存成功');
        this.props.notifyFormChanged(false);
      }
    });
  }
  handleCancel = () => {
    this.props.notifyFormChanged(false);
    this.context.router.goBack();
  }

  render() {
    const {
      form, submitting, itemData, formChanged,
    } = this.props;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('workspace'), itemData.repo_owner_name, this.msg('modify')]}>
          <PageHeader.Actions>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Button type="primary" icon="save" onClick={this.handleSave} loading={submitting} disabled={!formChanged}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="master">
              <TabPane tab="归类信息" key="master">
                <ItemMasterPane action="edit" form={form} itemData={itemData} shareMethods={this.acceptItemMasterMethods} />
              </TabPane>
              {itemData.suggest_status !== 0 &&
              <TabPane tab={itemData.suggest_status === 1 ? '生成归类建议中' : '相似商品归类建议'} key="suggest" disabled={itemData.suggest_status === 1}>
                <ItemSuggestPane workItem={itemData} />
              </TabPane>}
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}

