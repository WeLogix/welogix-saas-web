import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Layout, Form, Select, Input, DatePicker, notification } from 'antd';
import { BSS_VENDOR_BILL_STATUS, PARTNER_ROLES, TENANT_ASPECT } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { toggleNewBillModal, reloadBillList } from 'common/reducers/bssBill';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import ImportDataPanel from 'client/components/ImportDataPanel';
import VendorBillTable from './vendorBillTable';
import CreateBillModal from '../modals/createBillModal';
import AddToDraft from '../modals/addToDraftModal';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    aspect: state.account.aspect,
    listFilter: state.bssBill.listFilter,
    partners: state.partner.partners,
    allBillTemplates: state.bssBillTemplate.billTemplates,
    importPanelVisible: false,
  }),
  {
    toggleNewBillModal, loadPartners, reloadBillList,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssVendorBill',
})
@Form.create()
export default class BillList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    extraVisible: false,
    beginDate: new Date(),
    endDate: new Date(),
    templateTitle: '',
  }
  componentDidMount() {
    if (this.props.aspect === TENANT_ASPECT.ENT) {
      this.handleTabChange('sellerBill');
      this.props.loadPartners({ role: [PARTNER_ROLES.VEN] });
    } else {
      this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.VEN] });
    }
    const firstDay = new Date();
    const month = firstDay.getMonth();
    firstDay.setMonth(month - 1, 1);
    firstDay.setHours(0, 0, 0, 0);
    const endDay = new Date();
    endDay.setDate(0);
    endDay.setHours(0, 0, 0, 0);
    this.setState({ beginDate: firstDay, endDate: endDay });
  }
  msg = formatMsg(this.props.intl)
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.props.reloadBillList(filter);
  }
  handleTabChange = (key) => {
    const filter = {
      ...this.props.listFilter, bill_type: key, clientPid: 'all', searchText: '',
    };
    this.props.reloadBillList(filter);
  }
  toggleExtra = () => {
    this.setState({ extraVisible: !this.state.extraVisible });
  }
  handdleTemplates = () => {
    const link = '/bss/bill/template';
    this.context.router.push(link);
  }
  handleCreate = () => {
    this.props.toggleNewBillModal(true, { byStatements: false });
  }
  handleImport = () => {
    this.setState({
      importPanelVisible: true,
    });
  }
  handleSellerBillUploaded = () => {
    notification.success({
      message: '导入成功',
      description: '请在待对账的账单中查看',
    });
    this.props.reloadBillList(this.props.listFilter);
  }
  handleTemplSelect = (value, option) => {
    this.setState({ templateTitle: option.props.title });
  }
  handleMonthChange = (date, dateString) => {
    const { setFieldsValue } = this.props.form;
    const firstDay = date.toDate();
    const month = firstDay.getMonth();
    firstDay.setMonth(month, 1);
    firstDay.setHours(0, 0, 1);
    const endDay = date.toDate();
    endDay.setMonth(month + 1);
    endDay.setDate(0);
    endDay.setHours(23, 59, 59);
    this.setState({ beginDate: firstDay, endDate: endDay });
    setFieldsValue({ bill_title: `${this.state.templateTitle}-${dateString}` });
  }
  handleResetImportForm = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ template_id: null, bill_duration: null, bill_title: null });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, partners, allBillTemplates, listFilter,
    } = this.props;
    const { beginDate, endDate } = this.state;
    const partnerId = getFieldValue('partnerId');
    let billTemplates = [];
    if (partnerId) {
      billTemplates = allBillTemplates.filter(temp =>
        (temp.settle_partner_id === Number(partnerId) || temp.settle_partner_id === null));
    }
    const dropdownMenu = {
      selectedMenuKey: listFilter.status || 'all',
      onMenuClick: this.handleFilterMenuClick,
      dropdownMenuItems: Object.keys(BSS_VENDOR_BILL_STATUS).map(st => ({
        elementKey: BSS_VENDOR_BILL_STATUS[st].key,
        icon: BSS_VENDOR_BILL_STATUS[st].icon,
        name: BSS_VENDOR_BILL_STATUS[st].text,
      })),
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showCollab={false}>
          <PageHeader.Actions>
            <Button icon="import" onClick={this.handleImport}>{this.msg('importSellerBill')}</Button>
            <Button icon="setting" onClick={this.handdleTemplates}>{this.msg('templateSetting')}</Button>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <VendorBillTable />
        </PageContent>
        <CreateBillModal />
        <AddToDraft />
        <ImportDataPanel
          title={this.msg('importSellerBill')}
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/bss/sellerbill/import`}
          formData={{
            templateId: getFieldValue('template_id'),
            billName: getFieldValue('bill_title'),
            partnerId,
            beginDate,
            endDate,
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleSellerBillUploaded}
        >
          <FormItem label={this.msg('vendor')}>
            {getFieldDecorator('partnerId', {
              rules: [{ required: true, message: '服务商必选' }],
            })(<Select
              placeholder="请选择服务商"
              showSearch
              allowClear
              optionFilterProp="children"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 360 }}
              style={{ width: '100%' }}
              onChange={this.handleResetImportForm}
            >
              {partners.filter(pt => pt.role === PARTNER_ROLES.VEN).map(pt => (
                <Option value={String(pt.id)} key={String(pt.id)}>
                  {[pt.partner_code, pt.name].filter(item => item).join('|')}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('billTemplates')} >
            {getFieldDecorator('template_id', {
              rules: [{ required: true, message: this.msg('pleaseSelectBillTemplate') }],
            })(<Select
              showSearch
              optionFilterProp="children"
              onSelect={this.handleTemplSelect}
            >
              {billTemplates.map(data => (
                <Option key={String(data.id)} value={String(data.id)} title={data.name}>
                  {data.name}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('billDuration')}>
            {getFieldDecorator('bill_duration', {
              rules: [{ required: true }],
            })(<MonthPicker
              onChange={this.handleMonthChange}
            />)}
          </FormItem>
          <FormItem label={this.msg('billName')}>
            {getFieldDecorator('bill_title', {
              rules: [{ required: true, message: '账单名称必填' }],
            })(<Input />)}
          </FormItem>
        </ImportDataPanel>
      </Layout>
    );
  }
}
