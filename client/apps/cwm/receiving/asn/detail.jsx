import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, Layout, Tabs, Button, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { loadAsn, updateASNHead, clearAsn } from 'common/reducers/cwmReceive';
import { CWM_ASN_TYPES, CWM_SHFTZ_IN_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import HeadPane from './tabpane/headPane';
import DetailsPane from './tabpane/detailsPane';
// import LottingPane from './tabpane/lottingPane';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.owner_partner_id = msg('ownerPartner');
  fieldLabelMap.expect_receive_date = msg('expectReceiveDate');
  fieldLabelMap.supplier_name = msg('vendor');
  fieldLabelMap.cust_order_no = msg('custOrderNo');
  fieldLabelMap.asn_type = msg('asnType');
  fieldLabelMap.bonded = msg('bonded');
  fieldLabelMap.reg_type = msg('regType');
  fieldLabelMap.transfer_in_bills = msg('transferInBills');
}

@injectIntl
@connect(
  state => ({
    username: state.account.username,
    tenantName: state.account.tenantName,
    submitting: state.cwmReceive.submitting,
    owners: state.cwmContext.whseAttrs.owners,
    defaultWhse: state.cwmContext.defaultWhse,
    suppliers: state.cwmReceive.suppliers,
    asnHead: state.cwmReceive.asnHead,
  }),
  { loadAsn, updateASNHead, clearAsn }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmReceiving',
})
@Form.create()
export default class ReceivingASNDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    tenantName: PropTypes.string.isRequired,
    submitting: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadAsn(this.props.params.asnNo);
    createFieldLabelMap(this.msg);
  }
  componentWillUnmount() {
    this.props.clearAsn();
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const {
      owners, tenantName, suppliers,
    } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = values;
        const { asnHead } = this.props;
        const ownerPartnerId = values.owner_partner_id || (asnHead && asnHead.owner_partner_id);
        const owner = owners.find(item => item.id === ownerPartnerId);
        const supplier = suppliers.find(sl => sl.name === values.supplier_name);
        data.asnNo = this.props.params.asnNo;
        data.ownerName = owner.name;
        data.ownerTenantId = owner.partner_tenant_id;
        data.originBonded = asnHead.bonded;
        data.tenantName = tenantName;
        data.supplierCode = supplier && supplier.code;
        const contentLog = [];
        ['expect_receive_date'].forEach((field) => {
          if (data[field]) {
            data[field] = moment(data[field]).format('YYYY-MM-DD');
          }
          if (asnHead[field]) {
            asnHead[field] = moment(asnHead[field]).format('YYYY-MM-DD');
          }
        });
        ['owner_partner_id', 'expect_receive_date', 'supplier_name', 'cust_order_no', 'asn_type', 'bonded',
          'reg_type', 'transfer_in_bills'].forEach((field) => {
          if (asnHead[field] !== data[field] &&
            !(!asnHead[field] && !data[field])) {
            if (field === 'owner_partner_id') {
              const value = owners.find(item => item.id === data[field]) &&
                owners.find(item => item.id === data[field]).name;
              const oldValue = owners.find(item => item.id === asnHead[field]) &&
                owners.find(item => item.id === asnHead[field]).name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'asn_type') {
              const value = CWM_ASN_TYPES.find(type => type.value === data[field]) &&
                CWM_ASN_TYPES.find(type => type.value === data[field]).text;
              const oldValue = CWM_ASN_TYPES.find(type => type.value === asnHead[field]) &&
                CWM_ASN_TYPES.find(type => type.value === asnHead[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bonded') {
              const value = data[field] === 1 ? '保税' : '非保税';
              const oldValue = asnHead[field] === 1 ? '保税' : '非保税';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'reg_type') {
              if (data[field] !== asnHead.bonded_intype) {
                const regTypes = CWM_SHFTZ_IN_REGTYPES.concat(SASBL_REG_TYPES);
                const value = regTypes.find(type => type.value === data[field]) &&
                  regTypes.find(type => type.value === data[field]).ftztext;
                const oldValue = regTypes.find(type => type.value === asnHead[field]) &&
                  regTypes.find(type => type.value === asnHead[field]).ftztext;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              }
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${asnHead[field] || ''}] 改为 [${data[field] || ''}]`);
            }
          }
        });
        data.contentLog = contentLog.length > 0 ? `修改ASN表头, ${contentLog.join(';')}` : '';
        this.props.updateASNHead(data).then((result) => {
          if (!result.error) {
            message.success('收货通知已保存成功');
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
      form, submitting, defaultWhse, asnHead,
    } = this.props;
    const ownerPartnerId = form.getFieldValue('owner_partner_id') || asnHead.owner_partner_id;
    return (
      <div>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            this.props.params.asnNo,
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
              <Tabs defaultActiveKey="asnDetails" onChange={this.handleTabChange}>
                <TabPane tab="ASN表头" key="asnHead" forceRender>
                  <HeadPane form={form} />
                </TabPane>
                <TabPane tab="ASN明细" key="asnDetails">
                  <DetailsPane
                    detailEnable
                    selectedOwner={ownerPartnerId}
                    form={form}
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
