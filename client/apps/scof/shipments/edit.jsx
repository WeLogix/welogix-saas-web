import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import { Button, Layout, message, notification } from 'antd';
import PageHeader from 'client/components/PageHeader';
import { loadFormRequires, loadOrder, editOrder, validateOrder } from 'common/reducers/sofOrders';
import { loadRequireOrderTypes } from 'common/reducers/sofOrderPref';
import { GOODSTYPES, WRAP_TYPE, EXPEDITED_TYPES, SCOF_ORDER_TRANSFER, TRANS_MODES } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import OrderForm from './shipment';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

const VALIDATE_MSG = {
  no_customer: '请选择客户',
  no_goods_type: '请选择货物类型',
  no_order_type: '请选择货运类型',
  no_order_type_attr: '请填写货运类型扩展属性',
  no_flowid: '请选择流程',
  cust_order_no_exist: '客户订单号已存在',
};

const fieldLabelMap = {};
const basicInfoFields = ['customer_name', 'cust_order_no', 'cust_shipmt_expedited', 'exec_login_id', 'cust_shipmt_transfer',
  'cust_shipmt_trans_mode', 'cust_shipmt_orig_dest_country', 'cust_shipmt_dept_port', 'cust_shipmt_dest_port',
  'cust_shipmt_bill_lading', 'cust_shipmt_mawb', 'cust_shipmt_bill_lading_no', 'cust_shipmt_vessel', 'cust_shipmt_voy',
  'cust_shipmt_forwarder', 'cust_shipmt_freight', 'cust_shipmt_freight_currency', 'cust_shipmt_insur_fee',
  'cust_shipmt_insur_currency', 'cust_shipmt_misc_fee', 'cust_shipmt_misc_currency', 'cust_shipmt_goods_type',
  'cust_shipmt_pieces', 'cust_shipmt_wrap_type', 'cust_shipmt_weight', 'cust_shipmt_volume', 'ext_attr_1',
  'ext_attr_2', 'ext_attr_3', 'ext_attr_4', 'cust_remark', 'flow_id'];

function createFieldLabelMap(msg, transfer, transMode) {
  fieldLabelMap.customer_name = msg('customer');
  fieldLabelMap.cust_order_no = msg('custOrderNo');
  fieldLabelMap.cust_shipmt_expedited = msg('expedited');
  fieldLabelMap.exec_login_id = msg('personResponsible');
  fieldLabelMap.cust_shipmt_transfer = msg('transfer');
  fieldLabelMap.cust_shipmt_trans_mode = msg('transMode');
  fieldLabelMap.cust_shipmt_orig_dest_country = transfer === 'EXP' ? msg('destCountry') : msg('originCountry');
  fieldLabelMap.cust_shipmt_dept_port = msg('deptPort');
  fieldLabelMap.cust_shipmt_dest_port = msg('destPort');
  fieldLabelMap.cust_shipmt_bill_lading = msg('billLading');
  fieldLabelMap.cust_shipmt_mawb = msg('mawb');
  fieldLabelMap.cust_shipmt_bill_lading_no = msg('billLadingNo');
  if (transfer !== 'DOM') {
    if (transMode === '5') {
      fieldLabelMap.cust_shipmt_vessel = msg('flightNo');
    } else if (transMode === '2') {
      fieldLabelMap.cust_shipmt_vessel = msg('shipNameVoyage');
    }
  }
  fieldLabelMap.cust_shipmt_voy = msg('voyage');
  fieldLabelMap.cust_shipmt_forwarder = msg('forwarder');
  fieldLabelMap.cust_shipmt_freight = msg('freight');
  fieldLabelMap.cust_shipmt_freight_currency = msg('freightCurrency');
  fieldLabelMap.cust_shipmt_insur_fee = msg('insurFee');
  fieldLabelMap.cust_shipmt_insur_currency = msg('insurCurrency');
  fieldLabelMap.cust_shipmt_misc_fee = msg('miscFee');
  fieldLabelMap.cust_shipmt_misc_currency = msg('miscCurrency');
  fieldLabelMap.cust_shipmt_goods_type = msg('goodsType');
  fieldLabelMap.cust_shipmt_pieces = msg('pieces');
  fieldLabelMap.cust_shipmt_wrap_type = msg('wrapType');
  fieldLabelMap.cust_shipmt_weight = msg('totalGrossWt');
  fieldLabelMap.cust_shipmt_volume = msg('CBM');
  fieldLabelMap.ext_attr_1 = `${msg('extAttr')}1`;
  fieldLabelMap.ext_attr_2 = `${msg('extAttr')}2`;
  fieldLabelMap.ext_attr_3 = `${msg('extAttr')}3`;
  fieldLabelMap.ext_attr_4 = `${msg('extAttr')}4`;
  fieldLabelMap.cust_remark = msg('custRemark');
  fieldLabelMap.flow_id = msg('flowId');
}
function fetchData({ state, params, dispatch }) {
  const proms = [
    dispatch(loadFormRequires({ tenantId: state.account.tenantId })),
    dispatch(loadRequireOrderTypes()),
    dispatch(loadOrder(params.orderNo)),
  ];
  return Promise.all(proms);
}

@connectFetch()(fetchData)
@injectIntl
@connectNav({
  depth: 3,
  moduleName: 'scof',
  title: 'featSofShipments',
})
@connect(
  state => ({
    tenantName: state.account.tenantName,
    tenantId: state.account.tenantId,
    formData: state.sofOrders.formData,
    saving: state.sofOrders.orderSaving,
    originFormData: state.sofOrders.originFormData,
    serviceTeam: state.saasCollab.operators,
    countries: state.saasParams.latest.country,
    ports: state.saasParams.latest.port,
    formRequires: state.sofOrders.formRequires,
    flows: state.scofFlow.partnerFlows,
    currency: state.saasParams.latest.currency,
  }),
  { editOrder, validateOrder }
)
export default class EditOrder extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantName: PropTypes.string.isRequired,
    formData: PropTypes.shape({ shipmt_order_no: PropTypes.string }).isRequired,
    editOrder: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { originFormData } = this.props;
    createFieldLabelMap(
      this.msg,
      originFormData.cust_shipmt_transfer,
      originFormData.cust_shipmt_trans_mode,
    );
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const { formData } = this.props;
    const valitFormData = {};
    ['customer_name', 'cust_shipmt_goods_type', 'cust_shipmt_transfer', 'flow_id',
      'ext_attr_1', 'ext_attr_2', 'ext_attr_3', 'ext_attr_4', 'cust_order_no', 'id',
      'customer_partner_id'].forEach((vaKey) => {
      valitFormData[vaKey] = formData[vaKey];
    });
    this.props.validateOrder(valitFormData).then((result) => {
      if (result.error) {
        notification.error({
          message: '错误信息',
          description: result.error.message,
          duration: 15,
        });
      } else if (result.data.level === 'error') {
        notification.error({
          message: '错误信息',
          description: VALIDATE_MSG[result.data.msgkey],
          duration: 15,
        });
      } else if (result.data.level === 'warn') {
        notification.info({
          message: '提示信息',
          description: VALIDATE_MSG[result.data.msgkey],
          btn: (<div>
            <a role="presentation" onClick={() => this.handleUpdateShipment(true)}>继续保存</a>
            <span className="ant-divider" />
            <a role="presentation" onClick={() => notification.close('confirm-submit')}>取消</a>
          </div>),
          key: 'confirm-submit',
          duration: 0,
        });
      } else {
        this.handleUpdateShipment();
      }
    });
  }
  handleUpdateShipment = (close) => {
    if (close) {
      notification.close('confirm-submit');
    }
    const {
      formData, tenantName, originFormData, serviceTeam, countries, ports, flows,
      formRequires: { customsBrokers }, currency,
    } = this.props;
    const opLogs = [];
    ['cust_shipmt_freight', 'cust_shipmt_insur_fee', 'cust_shipmt_misc_fee', 'cust_shipmt_pieces'].forEach((field) => {
      if (formData[field]) {
        const fieldNumVal = parseFloat(formData[field]);
        if (!Number.isNaN(fieldNumVal) && fieldNumVal === Number(formData[field])) {
          formData[field] = fieldNumVal;
        } else {
          formData[field] = undefined;
        }
      }
    });
    basicInfoFields.forEach((field) => {
      if (formData[field] !== originFormData[field] &&
        !(!formData[field] && !originFormData[field])) {
        const oplog = {
          label: fieldLabelMap[field],
          value: formData[field],
          oldValue: originFormData[field],
        };
        if (field === 'cust_shipmt_expedited') {
          oplog.value = EXPEDITED_TYPES[formData[field]].text;
          oplog.oldValue = EXPEDITED_TYPES[originFormData[field]].text;
        } else if (field === 'exec_login_id') {
          oplog.value = serviceTeam.find(item => item.lid === formData[field]) &&
            serviceTeam.find(item => item.lid === formData[field]).name;
          oplog.oldValue = serviceTeam.find(item => item.lid === originFormData[field]) &&
            serviceTeam.find(item => item.lid === originFormData[field]).name;
        } else if (field === 'cust_shipmt_transfer') {
          oplog.value = SCOF_ORDER_TRANSFER.find(item => item.IMP === formData[field]) &&
            SCOF_ORDER_TRANSFER.find(item => item.IMP === formData[field]).text;
          oplog.oldValue = SCOF_ORDER_TRANSFER.find(item => item.IMP === originFormData[field]) &&
            SCOF_ORDER_TRANSFER.find(item => item.IMP === originFormData[field]).text;
        } else if (field === 'cust_shipmt_trans_mode') {
          oplog.value = TRANS_MODES.find(item => item.value === formData[field]) &&
            TRANS_MODES.find(item => item.value === formData[field]).text;
          oplog.oldValue = TRANS_MODES.find(item => item.value === originFormData[field]) &&
            TRANS_MODES.find(item => item.value === originFormData[field]).text;
        } else if (field === 'cust_shipmt_orig_dest_country') {
          oplog.value = countries.find(item => item.cntry_co === formData[field]) &&
            countries.find(item => item.cntry_co === formData[field]).cntry_name_cn;
          oplog.oldValue = countries.find(item => item.cntry_co === originFormData[field]) &&
            countries.find(item => item.cntry_co === originFormData[field]).cntry_name_cn;
        } else if (field === 'cust_shipmt_dept_port' || field === 'cust_shipmt_dest_port') {
          oplog.value = ports.find(item => item.port_code === formData[field]) &&
            ports.find(item => item.port_code === formData[field]).port_c_cod;
          oplog.oldValue = ports.find(item => item.port_code === originFormData[field]) &&
            ports.find(item => item.port_code === originFormData[field]).port_c_cod;
        } else if (field === 'cust_shipmt_forwarder') {
          oplog.value = customsBrokers.find(item => String(item.partner_id) === formData[field]) &&
            customsBrokers.find(item => String(item.partner_id) === formData[field]).name;
          oplog.oldValue = customsBrokers.find(item =>
            String(item.partner_id) === originFormData[field]) &&
            customsBrokers.find(item => String(item.partner_id) === originFormData[field]).name;
        } else if (field === 'cust_shipmt_freight_currency' || field === 'cust_shipmt_insur_currency' ||
          field === 'cust_shipmt_misc_currency') {
          const nowCurrency = currency.find(item => item.curr_code === formData[field]) || { name: '' };
          oplog.value = nowCurrency.name;
          const oldCurrency = currency.find(item => item.curr_code === originFormData[field]) || { name: '' };
          oplog.oldValue = oldCurrency.name;
        } else if (field === 'flow_id') {
          oplog.value = flows.find(item => item.id === formData[field]) &&
            flows.find(item => item.id === formData[field]).name;
          oplog.oldValue = flows.find(item => item.id === originFormData[field]) &&
            flows.find(item => item.id === originFormData[field]).name;
        } else if (field === 'cust_shipmt_goods_type') {
          oplog.value = GOODSTYPES[formData[field]].text;
          oplog.oldValue = GOODSTYPES[originFormData[field]].text;
        } else if (field === 'cust_shipmt_wrap_type') {
          oplog.value = WRAP_TYPE.find(item => item.value === formData[field]) &&
            WRAP_TYPE.find(item => item.value === formData[field]).text;
          oplog.oldValue = WRAP_TYPE.find(item => item.value === originFormData[field]) &&
            WRAP_TYPE.find(item => item.value === originFormData[field]).text;
        }
        opLogs.push(oplog);
      }
    });
    this.props.editOrder({
      formData,
      tenantName,
      contentLog: opLogs.length > 0 ?
        `编辑基本信息${opLogs.map(item => ` ${item.label}由 [${item.oldValue || ''}] 改为 [${item.value || ''}] `).join(';')}` : '',
    }).then((result) => {
      if (result.error) {
        notification.error({
          message: '错误信息',
          description: result.error.message,
        });
      } else {
        message.success('保存成功');
        this.handleCancel();
      }
    });
  }
  handleCancel = () => {
    this.context.router.push('/scof/shipments');
  }
  render() {
    const { formData, graphLoading, tenantId } = this.props;
    const disabled = tenantId !== formData.tenant_id;
    const flowBizLoading = graphLoading ||
      formData.subOrders.filter(f => f.node.bizObjNeedLoad === true).length > 0;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('editOrder')]}>
          <PageHeader.Actions>
            <PrivilegeCover module="scof" feature="shipments" action="edit">
              <Button icon="save" type="primary" onClick={this.handleSave} loading={this.props.saving} disabled={disabled || flowBizLoading}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <OrderForm operation="edit" disabled={disabled} />
        </Content>
      </Layout>
    );
  }
}
