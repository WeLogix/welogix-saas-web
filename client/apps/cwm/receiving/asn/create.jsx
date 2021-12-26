import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Layout, Tabs, Button, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { addASN, clearAsn } from 'common/reducers/cwmReceive';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
// import LottingPane from './tabpane/lottingPane';
import { formatMsg } from '../../message.i18n';


const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    tenantName: state.account.tenantName,
    submitting: state.cwmReceive.submitting,
    defaultWhse: state.cwmContext.defaultWhse,
    asnDetails: state.cwmReceive.asnDetails,
    owners: state.cwmContext.whseAttrs.owners,
    suppliers: state.cwmReceive.suppliers,
  }),
  { addASN, clearAsn }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmReceiving',
})
@Form.create()
export default class CreateReceivingASN extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    tenantName: PropTypes.string.isRequired,
    submitting: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentWillUnmount() {
    this.props.clearAsn();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const {
      asnDetails, defaultWhse, owners, loginId, tenantName, suppliers,
    } = this.props;
    if (asnDetails.length === 0) {
      message.info('明细不能为空');
      return;
    }
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = values;
        const owner = owners.find(item => item.id === values.owner_partner_id);
        const supplier = suppliers.find(sl => sl.name === values.supplier_name);
        data.ownerName = owner.name;
        data.ownerTenantId = owner.partner_tenant_id;
        data.asnDetails = asnDetails;
        data.whseCode = defaultWhse.code;
        data.whseName = defaultWhse.name;
        data.loginId = loginId;
        data.tenantName = tenantName;
        data.supplier_code = supplier && supplier.code;
        this.props.addASN(data).then((result) => {
          if (!result.error) {
            message.success('收货通知已创建成功');
            this.context.router.push('/cwm/receiving/asn');
          } else {
            message.error('操作失败');
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
      form, submitting, asnDetails, defaultWhse,
    } = this.props;
    const ownerPartnerId = form.getFieldValue('owner_partner_id');
    const disable = !(!!ownerPartnerId && asnDetails.length !== 0);
    return (
      <div>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            this.msg('create'),
          ]}
        >
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <Button type="primary" disabled={disable} icon="save" loading={submitting} onClick={this.handleSave}>
              {this.msg('save')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Form>
            <MagicCard bodyStyle={{ padding: 0 }} >
              <Tabs defaultActiveKey="asnHead" onChange={this.handleTabChange}>
                <TabPane tab="ASN表头" key="asnHead">
                  <HeadPane form={form} />
                </TabPane>
                <TabPane tab="ASN明细" key="asnDetails">
                  <DetailsPane
                    form={form}
                    detailEnable={!!ownerPartnerId}
                    selectedOwner={ownerPartnerId}
                  />
                </TabPane>
              </Tabs>
            </MagicCard>
          </Form>
        </Content>
      </div>
    );
  }
}
