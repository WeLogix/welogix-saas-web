import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Form, Layout, Button, Tabs, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';

import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import { loadTradeItem, saveRepoForkItem, toggleConfirmForkModal, changeItemMaster, notifyFormChanged } from 'common/reducers/cmsTradeitem';
import { intlShape, injectIntl } from 'react-intl';
import ItemMasterPane from './tabpane/itemMasterPane';
import ConfirmForkModal from './modal/confirmForkModal';
import { formatMsg } from '../../message.i18n';


const { Content } = Layout;
const { TabPane } = Tabs;

function fetchData({ dispatch, params }) {
  const promises = [];
  const itemId = parseInt(params.id, 10);
  promises.push(dispatch(loadTradeItem(itemId, 'newSrc')));
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    submitting: state.cmsTradeitem.submitting,
    itemData: state.cmsTradeitem.itemData,
    formChanged: state.cmsTradeitem.formChanged,
    repo: state.cmsTradeitem.repo,
  }),
  {
    saveRepoForkItem,
    toggleConfirmForkModal,
    changeItemMaster,
    notifyFormChanged,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class TradeItemFork extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ validateFields: PropTypes.func.isRequired }).isRequired,
    itemData: PropTypes.shape({ cop_product_no: PropTypes.string }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleConfirm = () => {
    const { itemData, form } = this.props;
    const values = form.getFieldsValue();
    const changes = [];
    if (itemData.hscode !== values.hscode) {
      changes.push({
        field: this.msg('hscode'),
        before: itemData.hscode,
        after: values.hscode,
      });
    }
    if (itemData.g_name !== values.g_name) {
      changes.push({
        field: this.msg('gName'),
        before: itemData.g_name,
        after: values.g_name,
      });
    }
    if (changes.length === 0) {
      message.info('HS编码及中文品名未改变，无法建立分支');
    } else {
      this.props.changeItemMaster(changes);
      this.props.toggleConfirmForkModal(true);
    }
  }
  acceptItemMasterMethods = (itemMasterMethods) => {
    [this.getFormValues] = itemMasterMethods;
  }
  handleSave = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const item = this.getFormValues();
        if (item.hscode === this.props.itemData.hscode &&
          item.g_name === this.props.itemData.g_name) {
          message.error('请修改商品编号或中文品名', 5);
          return;
        }
        this.props.saveRepoForkItem({ item }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('保存成功');
            this.props.notifyFormChanged(false);
            this.context.router.goBack();
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.props.notifyFormChanged(false);
    this.context.router.goBack();
  }

  render() {
    const {
      form, submitting, itemData, repo, formChanged,
    } = this.props;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            repo.owner_name,
            this.msg('tradeItemMaster'),
            this.msg('forkItem'),
          ]}
        >
          <PageHeader.Actions>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <Button type="primary" icon="save" onClick={this.handleConfirm} loading={submitting} disabled={!formChanged}>
              {this.msg('save')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="master">
              <TabPane tab={this.msg('tabClassification')} key="master">
                <ItemMasterPane
                  action="fork"
                  form={form}
                  itemData={itemData}
                  shareMethods={this.acceptItemMasterMethods}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
        <ConfirmForkModal form={form} itemData={itemData} onSave={this.handleSave} />
      </Layout>
    );
  }
}
