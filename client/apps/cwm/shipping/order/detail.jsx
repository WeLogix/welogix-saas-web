import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, Layout, Tabs, Button, message } from 'antd';
import { getSo, updateSoHead, clearSO, addSoDetails } from 'common/reducers/cwmShippingOrder';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { CWM_SO_TYPES, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES, DELIVER_TYPES, COURIERS } from 'common/constants';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
import ReceiverPane from './tabpane/receiverPane';
import CarrierPane from './tabpane/carrierPane';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.owner_partner_id = msg('ownerPartner');
  fieldLabelMap.expect_shipping_date = msg('expectShippingDate');
  fieldLabelMap.cust_order_no = msg('custOrderNo');
  fieldLabelMap.so_type = msg('soType');
  fieldLabelMap.bonded = msg('bonded');
  fieldLabelMap.reg_type = msg('regType');
  fieldLabelMap.delivery_type = msg('deliveryType');
  fieldLabelMap.receiver_name = msg('receiverName');
  fieldLabelMap.receiver_code = msg('receiverCode');
  fieldLabelMap.receiver_contact = msg('receiverContact');
  fieldLabelMap.receiver_phone = msg('phone');
  fieldLabelMap.receiver_number = msg('number');
  fieldLabelMap.region = msg('region');
  fieldLabelMap.receiver_address = msg('address');
  fieldLabelMap.receiver_post_code = msg('postCode');
  fieldLabelMap.carrier_code = msg('carrier');
}

@injectIntl
@connect(
  state => ({
    username: state.account.username,
    tenantName: state.account.tenantName,
    submitting: state.cwmShippingOrder.submitting,
    owners: state.cwmContext.whseAttrs.owners,
    defaultWhse: state.cwmContext.defaultWhse,
    soHead: state.cwmShippingOrder.soHead,
    soDetails: state.cwmShippingOrder.soDetails,
    carriers: state.cwmWarehouse.carriers,
  }),
  {
    getSo, updateSoHead, clearSO, addSoDetails,
  }
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
  componentDidMount() {
    this.props.getSo(this.props.params.soNo).then((result) => {
      if (!result.error) {
        this.setState({
          region: {
            receiver_province: result.data.soHead.receiver_province,
            receiver_city: result.data.soHead.receiver_city,
            receiver_district: result.data.soHead.receiver_district,
            receiver_street: result.data.soHead.receiver_street,
            receiver_region_code: result.data.soHead.receiver_region_code,
          },
          carrier_name: result.data.soHead.carrier_name,
        });
      }
    });
    createFieldLabelMap(this.msg);
  }
  componentWillUnmount() {
    this.props.clearSO();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const {
      soDetails, owners, tenantName, soHead, carriers, defaultWhse,
    } = this.props;
    if (soDetails.length === 0) {
      message.info('明细不能为空');
      return;
    }
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = { ...values };
        ['expect_shipping_date'].forEach((field) => {
          if (soHead[field]) {
            soHead[field] = moment(soHead[field]).format('YYYY-MM-DD');
          }
          if (data[field]) {
            data[field] = moment(data[field]).format('YYYY-MM-DD');
          }
        });
        const fields = Object.keys(values);
        const contentLog = [];
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          if (soHead[field] !== data[field] &&
            !(!soHead[field] && !data[field])) {
            if (field === 'owner_partner_id') {
              const value = owners.find(item => item.id === data[field]) &&
                owners.find(item => item.id === data[field]).name;
              const oldValue = owners.find(item => item.id === soHead[field]) &&
                owners.find(item => item.id === soHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === '') {
              const value = CWM_SO_TYPES.find(type => type.value === data[field]) &&
                CWM_SO_TYPES.find(type => type.value === data[field]).text;
              const oldValue = CWM_SO_TYPES.find(type => type.value === soHead[field]) &&
                CWM_SO_TYPES.find(type => type.value === soHead[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bonded') {
              let value = '';
              let oldValue = '';
              if (data[field] === 0) {
                value = '非保税';
              } else if (data[field] === 1) {
                value = '保税';
              } else if (data[field] === -1) {
                value = '不限';
              }
              if (soHead[field] === 0) {
                oldValue = '非保税';
              } else if (soHead[field] === 1) {
                oldValue = '保税';
              } else if (soHead[field] === -1) {
                oldValue = '不限';
              }
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue}] 改为 [${value}]`);
            } else if (field === 'reg_type') {
              if (data[field] !== soHead.bonded_outtype) {
                const regTypes = CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES);
                const value = regTypes.find(type => type.value === data[field]) &&
                  regTypes.find(type => type.value === data[field]).ftztext;
                const oldValue = regTypes.find(type => type.value === soHead.bonded_outtype) &&
                  regTypes.find(type => type.value === soHead.bonded_outtype).ftztext;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              }
            } else if (field === 'delivery_type') {
              const value = DELIVER_TYPES.find(type => type.value === data[field]) &&
                DELIVER_TYPES.find(type => type.value === data[field]).name;
              const oldValue = DELIVER_TYPES.find(type => type.value === soHead[field]) &&
                DELIVER_TYPES.find(type => type.value === soHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'carrier_code') {
              const totalCarriers = COURIERS.concat(carriers);
              const value = totalCarriers.find(item => item.code === data[field]) &&
                totalCarriers.find(item => item.code === data[field]).name;
              const oldValue = totalCarriers.find(item => item.code === soHead[field]) &&
                totalCarriers.find(item => item.code === soHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${soHead[field] || ''}] 改为 [${data[field] || ''}]`);
            }
          }
        }
        if (this.state.region.receiver_region_code !== soHead.receiver_region_code) {
          contentLog.push(`"${fieldLabelMap.region}"由 [${soHead.receiver_province || ''}${soHead.receiver_city || ''}${soHead.receiver_district || ''}${soHead.receiver_street || ''}] 改为
          [${this.state.region.receiver_province || ''}${this.state.region.receiver_city || ''}${this.state.region.receiver_district || ''}${this.state.region.receiver_street || ''}]`);
        }
        const ownerPartnerId = values.owner_partner_id || (soHead && soHead.owner_partner_id);
        const owner = owners.find(item => item.id === ownerPartnerId);
        data.soNo = this.props.params.soNo;
        data.ownerName = owner.name;
        data.ownerTenantId = owner.partner_tenant_id;
        data.tenantName = tenantName;
        data.contentLog = contentLog.length > 0 ? `修改SO表头, ${contentLog.join(';')}` : '';
        this.props.updateSoHead({
          ...data, ...this.state.region, carrier_name: this.state.carrier_name,
        }).then((result) => {
          if (!result.error) {
            message.success('出库订单已保存成功');
            this.context.router.push('/cwm/shipping/order');
          } else {
            message.error('操作失败');
          }
        });
        // 创建选择ASN后新加入的soDetail
        const newData = soDetails.filter(f => f.unsaved);
        if (newData.length > 0) {
          const oldLen = soDetails.length - newData.length;
          const details = newData.map((item, index) =>
            ({ ...item, so_seq_no: (oldLen + 1 + index) }));
          this.props.addSoDetails({
            details,
            whseCode: defaultWhse.code,
            soNo: soHead.so_no,
            bonded: soHead.bonded,
            custOrderNo: soHead.cust_order_no,
          }).then((result) => {
            if (!result.error) {
              message.success(this.msg('savedSucceed'));
            }
          });
        }
      }
    });
  };
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
      form, submitting, soHead, defaultWhse, /* soDetails, */
    } = this.props;
    const { region } = this.state;
    const ownerPartnerId = form.getFieldValue('owner_partner_id') || soHead.owner_partner_id;
    return (
      <div>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            this.props.params.soNo,
          ]}
        >
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <Button type="primary" icon="save" loading={submitting} onClick={this.handleSave}>
              {this.msg('save')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Form>
            <MagicCard bodyStyle={{ padding: 0 }} >
              <Tabs defaultActiveKey="orderDetails" onChange={this.handleTabChange}>
                <TabPane tab="SO表头" key="orderHead" forceRender>
                  <HeadPane
                    form={form}
                    editable={this.state.editable}
                  />
                </TabPane>
                <TabPane tab="SO明细" key="orderDetails">
                  <DetailsPane
                    // soBody={soDetails}
                    detailEnable
                    selectedOwner={ownerPartnerId}
                    form={form}
                    editable={this.state.editable}

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
