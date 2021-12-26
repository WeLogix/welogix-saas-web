import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Layout, Tabs, Button, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { createSO, clearSO } from 'common/reducers/cwmShippingOrder';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
import ReceiverPane from './tabpane/receiverPane';
import CarrierPane from './tabpane/carrierPane';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    tenantName: state.account.tenantName,
    submitting: state.cwmShippingOrder.submitting,
    defaultWhse: state.cwmContext.defaultWhse,
    soDetails: state.cwmShippingOrder.soDetails,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  { clearSO, createSO }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShipping',
})
@Form.create()
export default class CreateShippingOrder extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    tenantName: PropTypes.string.isRequired,
    submitting: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    editable: true,
    region: {
      receiver_province: '',
      receiver_city: '',
      receiver_district: '',
      receiver_street: '',
      receiver_region_code: null,
    },
    carrier_name: '',
  }
  componentWillUnmount() {
    this.props.clearSO();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const {
      soDetails, defaultWhse, owners, loginId, tenantName,
    } = this.props;
    if (soDetails.length === 0) {
      message.info('明细不能为空');
      return;
    }
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = { ...values, ...this.state.region, carrier_name: this.state.carrier_name };
        const owner = owners.find(item => item.id === values.owner_partner_id);
        data.ownerName = owner.name;
        data.ownerTenantId = owner.partner_tenant_id;
        data.soDetails = soDetails;
        data.whseCode = defaultWhse.code;
        data.loginId = loginId;
        data.tenantName = tenantName;
        this.props.createSO(data).then((result) => {
          if (!result.error) {
            message.success('出库订单已创建成功');
            this.context.router.push('/cwm/shipping/order');
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
  handleRegionChange = (region) => {
    this.setState({ region });
  }
  handleCarrierChange = (value) => {
    this.setState({ carrier_name: value });
  }
  render() {
    const {
      form, submitting, soDetails, defaultWhse,
    } = this.props;
    const { region } = this.state;
    const ownerPartnerId = form.getFieldValue('owner_partner_id');
    const disable = !(!!ownerPartnerId && soDetails.length !== 0);
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
              <Tabs defaultActiveKey="orderHead" onChange={this.handleTabChange}>
                <TabPane tab="SO表头" key="orderHead">
                  <HeadPane form={form} />
                </TabPane>
                <TabPane tab="SO明细" key="orderDetails">
                  <DetailsPane
                    editable={this.state.editable}
                    form={form}
                    detailEnable={!!ownerPartnerId}
                    selectedOwner={ownerPartnerId || ''}
                  />
                </TabPane>
                <TabPane tab="收货人" key="receiver">
                  <ReceiverPane
                    form={form}
                    selectedOwner={ownerPartnerId}
                    region={region}
                    onRegionChange={this.handleRegionChange}
                  />
                </TabPane>
                <TabPane tab="承运人" key="carrier">
                  <CarrierPane
                    form={form}
                    selectedOwner={ownerPartnerId}
                    onCarrierChange={this.handleCarrierChange}
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
