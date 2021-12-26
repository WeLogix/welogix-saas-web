import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Layout, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import ToolbarAction from 'client/components/ToolbarAction';
import { addSofInvoice } from 'common/reducers/sofInvoice';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    submitting: state.cwmReceive.submitting,
    invoiceDetails: state.sofInvoice.invoiceDetails,
    owners: state.sofInvoice.buyers,
    suppliers: state.sofInvoice.sellers,
  }),
  { addSofInvoice }
)
@connectNav({
  depth: 3,
  moduleName: 'scof',
  title: 'featSofInvoice',
})
@Form.create()
export default class CreateInvoice extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    submitting: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    packageType: '',
  }
  msg = formatMsg(this.props.intl)
  handlePackageSelect = (value) => {
    this.setState({
      packageType: value,
    });
  }
  handleSave = () => {
    const { invoiceDetails, owners, suppliers } = this.props;
    const { packageType } = this.state;
    this.props.form.validateFields((errors, values) => {
      const owner = owners.find(item => item.id === values.owner_partner_id);
      const supplier = suppliers.find(item => item.id === values.supplier_partner_id);
      const formData = { ...values };
      formData.packageType = packageType;
      if (owner) {
        formData.owner_name = owner.name;
        formData.owner_tenant_id = owner.partner_tenant_id;
      }
      if (supplier) {
        formData.supplier_name = supplier.name;
        formData.supplier_tenant_id = supplier.partner_tenant_id;
      }
      if (!errors) {
        this.props.addSofInvoice(formData, invoiceDetails).then((result) => {
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
  render() {
    const {
      form, submitting, invoiceDetails,
    } = this.props;
    const disable = !(invoiceDetails.length !== 0);
    return (
      <div>
        <PageHeader breadcrumb={[this.msg('createInvoice')]}>
          <PageHeader.Actions>
            <ToolbarAction primary icon="save" label={this.msg('save')} loading={submitting} onClick={this.handleSave} disabled={disable} />
            <ToolbarAction label={this.msg('cancel')} onClick={this.handleCancel} />
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Form>
            <MagicCard bodyStyle={{ padding: 0 }} >
              <Tabs defaultActiveKey="invoiceHead" onChange={this.handleTabChange}>
                <TabPane tab="发票表头" key="invoiceHead">
                  <HeadPane
                    form={form}
                    editable
                    packageType={this.state.packageType}
                    handlePackageSelect={this.handlePackageSelect}
                  />
                </TabPane>
                <TabPane tab="发票明细" key="invoiceDetails">
                  <DetailsPane editable form={form} type="create" />
                </TabPane>
              </Tabs>
            </MagicCard>
          </Form>
        </Content>
      </div>
    );
  }
}
