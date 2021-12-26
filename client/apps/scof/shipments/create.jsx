import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { loadPartners } from 'common/reducers/partner';
import { loadFormRequires, setClientForm, submitOrder, validateOrder } from 'common/reducers/sofOrders';
import { loadRequireOrderTypes } from 'common/reducers/sofOrderPref';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import { Button, Layout, notification, message } from 'antd';
import PageHeader from 'client/components/PageHeader';
import { TENANT_ASPECT, PARTNER_ROLES } from 'common/constants';
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


function fetchData({ state, dispatch }) {
  const proms = [
    dispatch(loadFormRequires({
      tenantId: state.account.tenantId,
    })),
    dispatch(loadRequireOrderTypes()),
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
    aspect: state.account.aspect,
    loginId: state.account.loginId,
    tenantName: state.account.tenantName,
    formData: state.sofOrders.formData,
    saving: state.sofOrders.orderSaving,
    graphLoading: state.scofFlow.graphLoading,
  }),
  {
    submitOrder, validateOrder, setClientForm, loadPartners,
  }
)
export default class CreateOrder extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantName: PropTypes.string.isRequired,
    formData: PropTypes.shape({
      cust_shipmt_transfer: PropTypes.string,
    }).isRequired,
    submitOrder: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    let role = PARTNER_ROLES.CUS;
    if (this.props.aspect === TENANT_ASPECT.ENT) {
      role = [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP];
    }
    this.props.loadPartners({ role }).then((result) => {
      if (!result.error) {
        const own = result.data.find(rd => rd.role === PARTNER_ROLES.OWN);
        if (own) {
          /*
          if (role === PARTNER_ROLES.CUS) {
            this.props.setClientForm(-1, {
              provider_name: own.name,
              provider_tenant_id: own.partner_tenant_id,
              provider_partner_id: own.id,
              exec_login_id: this.props.loginId,
            });
          } else {
            */
          this.props.setClientForm(-1, {
            customer_name: own.name,
            customer_tenant_id: own.partner_tenant_id,
            customer_partner_id: own.id,
            customer_partner_code: own.partner_code,
            exec_login_id: this.props.loginId,
          });
          // }
        }
      }
    });
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const { formData } = this.props;
    const valitFormData = {};
    ['customer_name', 'cust_shipmt_goods_type', 'cust_shipmt_transfer', 'flow_id',
      'ext_attr_1', 'ext_attr_2', 'ext_attr_3', 'ext_attr_4', 'cust_order_no', 'customer_partner_id'].forEach((vaKey) => {
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
        notification.warn({
          message: '警告信息',
          description: VALIDATE_MSG[result.data.msgkey],
          btn: (<div>
            <a role="presentation" onClick={() => this.handleSubmit(true)}>继续创建</a>
            <span className="ant-divider" />
            <a role="presentation" onClick={() => notification.close('confirm-submit')}>取消</a>
          </div>),
          key: 'confirm-submit',
          duration: 0,
        });
      } else {
        this.handleSubmit();
      }
    });
  }
  handleSubmit = (close) => {
    if (close) {
      notification.close('confirm-submit');
    }
    const { formData, tenantName } = this.props;
    this.props.submitOrder({ formData, tenantName }).then((result) => {
      if (result.error) {
        notification.error({
          message: '错误信息',
          description: result.error.message,
        });
      } else {
        message.success(this.msg('savedSucceed'));
        this.context.router.replace(`/scof/shipments/edit/${result.data.shipmt_order_no}`);
        // this.handleCancel();
        /* TODO flow invoice detail setting
        notification.success({
          message: '保存成功',
          description: '订单已经创建,是否继续编辑发票货物明细',
          btn: (<div>
            <a
              role="presentation"
              onClick={() => {
                notification.close('continue-edit');
                this.context.router.replace(`/scof/shipments/edit/${result.data.shipmt_order_no}`);
            }}
            >继续编辑</a>
            <span className="ant-divider" />
            <a
              role="presentation"
              onClick={() => {
                notification.close('continue-edit');
                this.handleCancel();
            }}
            >直接返回</a>
          </div>),
          key: 'continue-edit',
          duration: 0,
          onClose: this.handleCancel,
        });
        */
      }
    });
  }
  handleCancel = () => {
    this.context.router.push('/scof/shipments');
  }
  render() {
    // 确保节点信息都加载完成才能保存
    const { formData, graphLoading } = this.props;
    const flowBizLoading = graphLoading ||
      formData.subOrders.filter(f => f.node.bizObjNeedLoad === true).length > 0;
    const invalidOrder = !formData.cust_shipmt_transfer || !formData.flow_id || flowBizLoading;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('create')]}>
          <PageHeader.Actions>
            <Button type="primary" icon="save" onClick={this.handleSave} loading={this.props.saving} disabled={invalidOrder}>
              {this.msg('save')}
            </Button>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <OrderForm operation="create" />
        </Content>
      </Layout>
    );
  }
}
