import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Layout, Tabs, message, Button, Menu, Dropdown, Icon } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { createFilename } from 'client/util/dataTransform';
import {
  loadQuoteParams, reviseQuoteSetting, showPublishQuoteModal,
  openPublishModal, reloadQuoteFees, toggleQuoteCreateModal, publishQuote,
} from 'common/reducers/cmsQuote';
import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import ImportDataPanel from 'client/components/ImportDataPanel';
import LogsPane from 'client/components/Dock/common/logsPane';
import { SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import TariffPane from './tabpane/tariffPane';
import SettingPane from './tabpane/settingPane';
import CreateQuoteModal from '../modals/createQuoteModal';
import PublishQuoteModal from '../modals/publishQuoteModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.quote_name = msg('quoteName');
  fieldLabelMap.invoicing_code = msg('advanceTaxType');
  fieldLabelMap.cus_item_per_sheet = msg('cusItemPerSheet');
  fieldLabelMap.ciq_item_per_sheet = msg('ciqItemPerSheet');
  fieldLabelMap.special_fee_allowed = msg('specialFeeAllowed');
}

@injectIntl
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@connect(
  state => ({
    quoteData: state.cmsQuote.quoteData,
    saving: state.cmsQuote.quoteSaving,
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    loginName: state.account.username,
    listFilter: state.cmsQuote.listFilter,
    invoicingKinds: state.saasInvoicingKind.allInvoicingKinds,
    privileges: state.account.privileges,
  }),
  {
    reviseQuoteSetting,
    openPublishModal,
    reloadQuoteFees,
    toggleQuoteCreateModal,
    loadQuoteParams,
    publishQuote,
    showPublishQuoteModal,
  }
)
@Form.create()
@withPrivilege({ module: 'clearance', feature: 'billing', action: 'edit' })
export default class QuotingEdit extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    tabKey: 'tariff',
    importPanelVisible: false,
  }
  componentDidMount() {
    const { params, quoteData } = this.props;
    if (params.quoteNo !== quoteData.quote_no) {
      this.props.loadQuoteParams(params.quoteNo);
    }
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    const prevQuoteNo = this.props.params.quoteNo;
    const nextQuoteNo = nextProps.params.quoteNo;
    if (prevQuoteNo !== nextQuoteNo) {
      this.props.loadQuoteParams(nextQuoteNo);
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'billing', action: 'edit',
  });
  handleFormError = () => {
    this.setState({
      tabKey: 'setting',
    });
  }
  handleTabChange = (key) => {
    this.setState({ tabKey: key });
  }
  handleSave = () => {
    this.props.form.validateFields((errors, formData) => {
      if (!errors) {
        if (Object.keys(formData).length === 0) {
          message.info('保存成功', 1);
          return;
        }
        const { quoteData, invoicingKinds } = this.props;
        const newQuoteData = {
          ...formData,
          id: quoteData.id,
          buyer_name: undefined,
          seller_name: undefined,
          special_fee_allowed: formData.special_fee_allowed ? 1 : 0,
        };
        const contentLog = [];
        ['ciq_item_per_sheet', 'cus_item_per_sheet', 'invoicing_code', 'quote_name', 'special_fee_allowed'].forEach((field) => {
          if (formData[field] !== undefined && quoteData[field] !== formData[field]) {
            if (field === 'invoicing_code') {
              const value = invoicingKinds.find(item => item[field] === formData[field]) &&
                invoicingKinds.find(item => item[field] === formData[field]).invoicing_type;
              const oldValue = invoicingKinds.find(item => item[field] === quoteData[field]) &&
                invoicingKinds.find(item => item[field] === quoteData[field]).invoicing_type;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'special_fee_allowed') {
              const value = formData[field] ? '是' : '否';
              const oldValue = quoteData[field] ? '是' : '否';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue}] 改为 [${value}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${quoteData[field] || ''}] 改为 [${formData[field] || ''}]`);
            }
          }
        });
        if (contentLog.length > 0) {
          this.props.reviseQuoteSetting(newQuoteData, `修改基础信息${contentLog.join(';')}`).then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.info('保存成功', 5);
            }
          });
        } else {
          message.info('保存成功', 1);
        }
      } else {
        this.handleFormError();
      }
    });
  }
  handlePublishModalShow = () => {
    this.props.showPublishQuoteModal(true);
  }
  handleCancel = () => {
    this.context.router.push('/clearance/billing/quote');
  }
  handleFeesUpload = () => {
    this.setState({ importPanelVisible: false });
    this.props.reloadQuoteFees();
  }
  handleMoreMenuClick = (e) => {
    if (e.key === 'import') {
      this.setState({
        importPanelVisible: true,
      });
    } else if (e.key === 'export') {
      const { quoteData } = this.props;
      window.open(`${API_ROOTS.default}v1/cms/billing/quote/tariff/export/${createFilename(quoteData.quote_name)}.xlsx?quoteNo=${quoteData.quote_no}`);
    } else if (e.key === 'clone') {
      const { quoteData } = this.props;
      const originQuoteData = {
        origin_quote_no: quoteData.quote_no,
        buyer_partner_id: quoteData.buyer_partner_id,
        seller_partner_id: quoteData.seller_partner_id,
        quote_name: quoteData.quote_name,
        quote_type: this.props.listFilter.viewStatus === 'clientQuote' ? 'sales' : 'cost',
      };
      this.props.toggleQuoteCreateModal(true, originQuoteData);
    } else if (e.key === 'publish') {
      this.handlePublishModalShow();
    } else {
      // TODO
    }
  }
  render() {
    const {
      form, saving, quoteData, tenantId,
    } = this.props;
    let readOnly = false;
    if (tenantId !== quoteData.tenant_id) {
      readOnly = true;
    }
    const moreMenu = (
      <Menu onClick={this.handleMoreMenuClick}>
        {this.editPermission && [
          <Menu.Item key="clone"><Icon type="copy" /> 复制</Menu.Item>,
          <Menu.Divider />,
          <Menu.Item key="import"><Icon type="upload" /> 导入报价费率</Menu.Item>,
        ]};
        <Menu.Item key="export"><Icon type="download" /> 导出报价费率</Menu.Item>
        {this.editPermission && [
          <Menu.Divider />,
          <Menu.Item key="calculate"><Icon type="calculator" /> 手动触发计费</Menu.Item>,
          <Menu.Item key="publish"><Icon type="sync" /> 发布费率</Menu.Item>,
        ]}
      </Menu>
    );
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('quote'), this.props.params.quoteNo]}>
          <PageHeader.Actions>
            {/* <Button icon="copy">{this.msg('clone')}</Button> */}
            <PrivilegeCover module="clearance" feature="billing" action="create">
              <Button type="primary" icon="save" onClick={this.handleSave} loading={saving}>{this.msg('save')}</Button>
            </PrivilegeCover>
            <Dropdown overlay={moreMenu}><Button>{this.msg('more')}<Icon type="caret-down" /></Button></Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={this.state.tabKey} onChange={this.handleTabChange}>
              <TabPane tab="基础信息" key="setting">
                <SettingPane form={form} formData={quoteData} readOnly={readOnly} />
              </TabPane>
              <TabPane tab="合同费率" key="tariff">
                <TariffPane readOnly={readOnly} />
              </TabPane>
              <TabPane tab={this.msg('logs')} key="logs">
                <LogsPane
                  billNo={this.props.params.quoteNo}
                  bizObject={SCOF_BIZ_OBJECT_KEY.CMS_QUOTE.key}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
        <ImportDataPanel
          adaptors={null}
          title="报价费率导入"
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cms/billing/quote/tariff/import`}
          formData={{ quoteNo: quoteData.quote_no }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleFeesUpload}
          template={`${XLSX_CDN}/报价费率导入模板.xlsx`}
        />
        <CreateQuoteModal />
        <PublishQuoteModal />
      </Layout>
    );
  }
}
