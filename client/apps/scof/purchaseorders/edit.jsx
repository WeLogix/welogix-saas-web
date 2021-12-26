import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Layout, Button, Menu, Icon, Dropdown, Drawer } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import { getPurchaseOrder, updatePurchaseOrder } from 'common/reducers/sofPurchaseOrders';
import { toggleBizObjLogsPanel } from 'common/reducers/operationLog';
import LogsPane from 'client/components/Dock/common/logsPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import HeadCard from './card/headCard';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.po_no = msg('poNo');
  fieldLabelMap.inv_no = msg('invoiceNo');
  fieldLabelMap.gt_product_no = msg('productNo');
  fieldLabelMap.gt_qty_pcs = msg('orderQty');
  fieldLabelMap.gt_owner = msg('customer');
  fieldLabelMap.gt_owner_country = msg('customerCntry');
  fieldLabelMap.gt_supplier = msg('supplier');
  fieldLabelMap.gt_supplier_country = msg('supplierCntry');
  fieldLabelMap.gt_trxn_mode = msg('trxnMode');
  fieldLabelMap.intl_traf_mode = msg('transMode');
  fieldLabelMap.gt_name_cn = msg('gName');
  fieldLabelMap.cop_brand = msg('brand');
  fieldLabelMap.gt_unit_price = msg('unitPrice');
  fieldLabelMap.gt_amount = msg('totalAmount');
  fieldLabelMap.gt_currency = msg('currency');
  fieldLabelMap.gt_netwt = msg('netWeight');
  fieldLabelMap.gt_virtual_whse = msg('virtualWhse');
}

@injectIntl
@connect(
  state => ({
    purchaseOrder: state.sofPurchaseOrders.purchaseOrder,
    visible: state.operationLog.bizObjLogPanel.visible,
  }),
  { getPurchaseOrder, updatePurchaseOrder, toggleBizObjLogsPanel }
)
@connectNav({
  depth: 3,
  moduleName: 'scof',
})
@Form.create()
export default class EditPurchaseOrder extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.getPurchaseOrder(this.props.params.poNo);
    createFieldLabelMap(this.msg);
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    this.props.form.validateFields((errors, values) => {
      const formData = { ...values };
      ['gt_amount', 'gt_netwt', 'gt_qty_pcs', 'gt_unit_price'].forEach((field) => {
        const fieldNumVal = Number(formData[field]);
        if (!Number.isNaN(fieldNumVal)) {
          formData[field] = fieldNumVal;
        } else {
          formData[field] = '';
        }
      });
      const contentLog = [];
      const poFields = Object.keys(values);
      for (let i = 0; i < poFields.length; i++) {
        const field = poFields[i];
        if (this.props.purchaseOrder[field] !== formData[field] &&
          !(!this.props.purchaseOrder[field] && !formData[field])) {
          contentLog.push(`"${fieldLabelMap[field]}"由 [${this.props.purchaseOrder[field] || ''}] 改为 [${formData[field] || ''}]`);
        }
      }
      if (!errors) {
        this.props.updatePurchaseOrder(
          this.props.purchaseOrder.id,
          values,
          contentLog.length > 0 ? `编辑采购订单 ${contentLog.join(';')}` : '',
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
  handleMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.toggleBizObjLogsPanel(true, this.props.params.poNo, 'sofPO');
    }
  }
  handleClosePane = () => {
    this.props.toggleBizObjLogsPanel(false);
  }
  render() {
    const { form, visible } = this.props;
    const menu = (<Menu onClick={this.handleMenuClick}>
      <Menu.Item key="logs"><Icon type="profile" /> {this.msg('logs')}</Menu.Item>
    </Menu>);
    return (
      <div>
        <PageHeader breadcrumb={[this.msg('purchaseOrders'), this.props.params.poNo]}>
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <PrivilegeCover module="scof" feature="purchaseOrder" action="edit">
              <Button type="primary" icon="save" onClick={this.handleSave}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8, padding: '0 10px' }}>
                ...
              </Button>
            </Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Form>
            <HeadCard form={form} />
          </Form>
          <Drawer
            visible={visible}
            onClose={this.handleClosePane}
            title={<span>{this.msg('logs')}</span>}
            width={900}
          >
            <LogsPane />
          </Drawer>
        </Content>
      </div>
    );
  }
}
