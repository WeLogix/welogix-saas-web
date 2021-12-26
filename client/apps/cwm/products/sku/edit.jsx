import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { message, Form, Layout, Row, Col, Button, Drawer, Dropdown, Menu, Icon } from 'antd';
import { loadSkuParams, loadSku, saveSku } from 'common/reducers/cwmSku';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import { toggleBizObjLogsPanel } from 'common/reducers/operationLog';
import LogsPane from 'client/components/Dock/common/logsPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import MainForm from './forms/mainForm';
import SiderForm from './forms/siderForm';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.product_no = msg('productNo');
  fieldLabelMap.category = msg('category');
  fieldLabelMap.desc_cn = msg('descCN');
  fieldLabelMap.desc_en = msg('descEN');
  fieldLabelMap.unit_name = msg('measureUnit');
  fieldLabelMap.currency_name = msg('currency');
  fieldLabelMap.unit_price = msg('unitPrice');
  fieldLabelMap.alias1 = msg('alias1');
  fieldLabelMap.alias2 = msg('alias2');
  fieldLabelMap.alias3 = msg('alias3');
  fieldLabelMap.product_sku = msg('SKU');
  fieldLabelMap.sku_pack_unit_name = msg('skuPack');
  fieldLabelMap.sku_pack_qty = msg('perSKUQty');
  fieldLabelMap.length = msg('length');
  fieldLabelMap.width = msg('width');
  fieldLabelMap.height = msg('height');
  fieldLabelMap.cbm = msg('unitCBM');
  fieldLabelMap.gross_wt = msg('grossWeight');
  fieldLabelMap.net_wt = msg('netWeight');
  fieldLabelMap.tare_wt = msg('tareWeight');
  fieldLabelMap.inner_pack_qty = msg('innerPackQty');
  fieldLabelMap.box_pack_qty = msg('boxPackQty');
  fieldLabelMap.pallet_box_qty = msg('palletBoxQty');
  fieldLabelMap.trace_convey = msg('traceConvey');
  fieldLabelMap.inbound_convey = msg('defaultInboundConvey');
  fieldLabelMap.replenish_convey = msg('defaultReplenishConvey');
  fieldLabelMap.outbound_convey = msg('defaultOutboundConvey');
  fieldLabelMap.asn_tag_unit = msg('defaultAsnTagUnit');
  fieldLabelMap.so_tag_unit = msg('defaultSoTagUnit');
  fieldLabelMap.lot_rule = msg('lottingRule');
}

@injectIntl
@connect(
  state => ({
    owner: state.cwmSku.owner,
    skuForm: state.cwmSku.skuForm,
    originSku: state.cwmSku.originSku,
    submitting: state.cwmSku.skuSubmitting,
    visible: state.operationLog.bizObjLogPanel.visible,
  }),
  {
    loadSkuParams, loadSku, saveSku, toggleBizObjLogsPanel,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSKU',
})
@Form.create()
export default class EditProductSku extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (this.props.owner.id) {
      this.props.loadSkuParams(this.props.owner.id);
    }
    this.props.loadSku(this.props.params.sku);
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.owner.id !== this.props.owner.id) {
      nextProps.loadSkuParams(nextProps.owner.id);
    }
  }

  msg = formatMsg(this.props.intl)
  handleSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const formData = { ...this.props.skuForm };
        Object.keys(values).forEach((skukey) => {
          if (values[skukey] === formData[skukey]) {
            delete formData[skukey];
          } else if (!values[skukey]) {
            formData[skukey] = null;
          } else {
            formData[skukey] = values[skukey];
          }
        });
        ['length', 'height', 'width', 'gross_wt', 'net_wt', 'tare_wt'].forEach((field) => {
          if (formData[field]) {
            const fieldNumVal = Number(formData[field]);
            if (!Number.isNaN(fieldNumVal)) {
              formData[field] = fieldNumVal;
            } else {
              formData[field] = '';
            }
          }
        });
        const contentLog = [];
        ['product_no', 'category', 'desc_cn', 'desc_en', 'unit_name', 'currency_name', 'unit_price',
          'alias1', 'alias2', 'alias3', 'product_sku', 'sku_pack_unit_name', 'sku_pack_qty', 'length',
          'height', 'width', 'gross_wt', 'net_wt', 'tare_wt', 'inner_pack_qty', 'box_pack_qty', 'pallet_box_qty',
          'trace_convey', 'inbound_convey', 'replenish_convey', 'outbound_convey', 'asn_tag_unit', 'so_tag_unit',
          'lot_rule'].forEach((field) => {
          if (formData[field] && this.props.originSku[field] !== formData[field] &&
            !(!this.props.originSku[field] && !formData[field])) {
            if (field === 'so_tag_unit' || field === 'asn_tag_unit') {
              const value = formData[field] === 'primary' ? '计量单位' : 'SKU包装单位';
              const oldValue = this.props.originSku[field] === 'primary' ? '计量单位' : 'SKU包装单位';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'trace_convey' || field === 'inbound_convey' || field === 'replenish_convey'
            || field === 'outbound_convey') {
              let value = '';
              let oldValue = '';
              if (formData[field] === 'PCS') {
                value = '单件';
              } else if (formData[field] === 'INP') {
                value = '内包装';
              } else if (formData[field] === 'BOX') {
                value = '箱';
              } else if (formData[field] === 'PLT') {
                value = '托盘';
              }
              if (this.props.originSku[field] === 'PCS') {
                oldValue = '单件';
              } else if (this.props.originSku[field] === 'INP') {
                oldValue = '内包装';
              } else if (this.props.originSku[field] === 'BOX') {
                oldValue = '箱';
              } else if (this.props.originSku[field] === 'PLT') {
                oldValue = '托盘';
              }
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue}] 改为 [${value}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${this.props.originSku[field] || ''}] 改为 [${formData[field] || ''}]`);
            }
          }
        });
        this.props.saveSku(formData, contentLog.length > 0 ? `SKU管理, ${contentLog.join(';')}` : '').then((result) => {
          if (!result.error) {
            this.context.router.push('/cwm/products/sku');
          } else {
            message.error(result.error.message);
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'log') {
      this.props.toggleBizObjLogsPanel(true, this.props.params.sku, 'cwmSku');
    }
  }
  handleClosePane = () => {
    this.props.toggleBizObjLogsPanel(false);
  }
  render() {
    const { form, submitting, visible } = this.props;
    return (
      <div>
        <PageHeader
          breadcrumb={[
            this.props.skuForm.product_sku,
          ]}
        >
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <PrivilegeCover module="cwm" feature="products" action="edit">
              <Button type="primary" icon="save" loading={submitting} onClick={this.handleSave}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            <Dropdown overlay={<Menu onClick={this.handleMenuClick}><Menu.Item key="log"><Icon type="bars" /> 操作记录</Menu.Item></Menu>}>
              <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
            </Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content layout-fixed-width layout-fixed-width-lg">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col sm={24} md={16}>
                <MainForm form={form} mode="edit" />
              </Col>
              <Col sm={24} md={8}>
                <SiderForm form={form} />
              </Col>
            </Row>
          </Form>
          <Drawer
            visible={visible}
            onClose={this.handleClosePane}
            title={<span>操作记录</span>}
            width={900}
          >
            <LogsPane />
          </Drawer>
        </Content>
      </div>
    );
  }
}
