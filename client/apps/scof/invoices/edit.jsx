import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, Layout, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import ToolbarAction from 'client/components/ToolbarAction';
import { UpdateSofInvoice, getInvoice, clearInvoice } from 'common/reducers/sofInvoice';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.invoice_date = msg('invoiceDate');
  fieldLabelMap.owner_partner_id = msg('owner');
  fieldLabelMap.supplier_partner_id = msg('supplier');
  fieldLabelMap.bl_awb_no = msg('blNo');
  fieldLabelMap.invoice_category = msg('category');
  fieldLabelMap.package_number = msg('packageNumber');
  fieldLabelMap.package_type = msg('packageType');
  fieldLabelMap.trade_mode = msg('tradeMode');
  fieldLabelMap.total_grosswt = msg('grossWeight');
  fieldLabelMap.payment_date = msg('invoicePayDate');
  fieldLabelMap.inv_attr1_str = `${msg('invAttr')}1`;
  fieldLabelMap.inv_attr2_str = `${msg('invAttr')}2`;
  fieldLabelMap.inv_attr3_str = `${msg('invAttr')}3`;
}

@injectIntl
@connect(
  state => ({
    invoiceDetails: state.sofInvoice.invoiceDetails,
    invoiceHead: state.sofInvoice.invoiceHead,
    owners: state.sofInvoice.buyers,
    suppliers: state.sofInvoice.sellers,
    tenantId: state.account.tenantId,
  }),
  {
    getInvoice,
    UpdateSofInvoice,
    clearInvoice,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'scof',
  title: 'featSofInvoice',
})
@Form.create()
export default class EditInvoice extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    packageType: '',
  }
  componentDidMount() {
    this.props.getInvoice(this.props.params.invoiceNo).then((result) => {
      if (!result.error) {
        this.setState({
          packageType: result.data.head.package_type,
        });
      }
    });
    createFieldLabelMap(this.msg);
  }
  componentWillUnmount() {
    this.props.clearInvoice();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const { invoiceHead, owners, suppliers } = this.props;
    const { packageType } = this.state;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = { ...values, package_type: packageType };
        ['total_grosswt'].forEach((field) => {
          const fieldNumVal = Number(data[field]);
          if (!Number.isNaN(fieldNumVal)) {
            data[field] = fieldNumVal;
          } else {
            data[field] = '';
          }
        });
        ['invoice_date', 'payment_date'].forEach((field) => {
          if (data[field]) {
            data[field] = moment(data[field]).format('YYYY-MM-DD');
          }
          if (invoiceHead[field]) {
            invoiceHead[field] = moment(invoiceHead[field]).format('YYYY-MM-DD');
          }
        });
        const contentLog = [];
        const headFields = Object.keys(data);
        const owner = owners.find(item => item.id === data.owner_partner_id);
        const supplier = suppliers.find(item => item.id === data.supplier_partner_id);
        for (let i = 0; i < headFields.length; i++) {
          const field = headFields[i];
          if (invoiceHead[field] !== data[field] &&
            !(!invoiceHead[field] && !data[field])) {
            if (field === 'owner_partner_id') {
              const oldValue = owners.find(item => item.id === invoiceHead[field]) &&
                owners.find(item => item.id === invoiceHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${(owner && owner.name) || ''}]`);
            } else if (field === 'supplier_partner_id') {
              const oldValue = suppliers.find(item => item.id === invoiceHead[field]) &&
                suppliers.find(item => item.id === invoiceHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${(supplier && supplier.name) || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${invoiceHead[field] || ''}] 改为 [${data[field] || ''}]`);
            }
          }
        }
        if (owner) {
          data.owner_name = owner.name;
          data.owner_tenant_id = owner.tid;
        }
        if (supplier) {
          data.supplier_name = supplier.name;
          data.supplier_tenant_id = supplier.tid;
        }
        this.props.UpdateSofInvoice(
          data,
          this.props.params.invoiceNo,
          invoiceHead.id,
          contentLog.length > 0 ? `修改发票表头 ${contentLog.join(';')}` : '',
        ).then((result) => {
          if (!result.error) {
            this.context.router.goBack();
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }
  handlePackageSelect = (value) => {
    this.setState({
      packageType: value,
    });
  }
  render() {
    const {
      form, params: { invoiceNo }, tenantId, invoiceHead,
    } = this.props;
    const type = invoiceHead.tenant_id !== tenantId ? 'view' : 'edit';
    return (
      <div>
        <PageHeader breadcrumb={[invoiceNo]}>
          <PageHeader.Actions>
            <PrivilegeCover module="scof" feature="invoice" action="edit">
              <ToolbarAction disabled={type === 'view'} primary icon="save" label={this.msg('save')} onClick={this.handleSave} />
            </PrivilegeCover>
            <ToolbarAction label={this.msg('cancel')} onClick={this.handleCancel} />
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Form>
            <MagicCard bodyStyle={{ padding: 0 }} >
              <Tabs defaultActiveKey="invoiceDetails" onChange={this.handleTabChange}>
                <TabPane tab="发票表头" key="invoiceHead">
                  <HeadPane
                    editable={false}
                    form={form}
                    packageType={this.state.packageType}
                    handlePackageSelect={this.handlePackageSelect}
                    type={type}
                  />
                </TabPane>
                <TabPane tab="发票明细" key="invoiceDetails">
                  <DetailsPane form={form} invoiceNo={invoiceNo} type={type} />
                </TabPane>
              </Tabs>
            </MagicCard>
          </Form>
        </Content>
      </div>
    );
  }
}
