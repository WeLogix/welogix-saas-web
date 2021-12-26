import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Input, Select, Card, Col, Row } from 'antd';
import FormPane from 'client/components/FormPane';
import { loadInvoiceBuyerSellers } from 'common/reducers/sofInvoice';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@injectIntl
@connect(
  state => ({
    purchaseOrder: state.sofPurchaseOrders.purchaseOrder,
    buyers: state.sofInvoice.buyers,
    sellers: state.sofInvoice.sellers,
    currencies: state.saasParams.latest.currency.map(currency => ({
      value: currency.curr_code,
      text: currency.curr_name,
    })),
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    trxnModes: state.saasParams.latest.trxnMode.map(trxn => ({
      value: trxn.trx_mode,
      text: trxn.trx_spec,
    })),
    transModes: state.saasParams.latest.transMode.map(trans => ({
      value: trans.trans_code,
      text: trans.trans_spec,
    })),
  }),
  {
    loadInvoiceBuyerSellers,
  }
)
export default class HeadCard extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  componentDidMount() {
    this.props.loadInvoiceBuyerSellers();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      form: { getFieldDecorator }, purchaseOrder, buyers, sellers, countries, trxnModes,
      transModes, currencies,
    } = this.props;

    return (
      <Card bodyStyle={{ padding: 16 }} >
        <FormPane descendant>
          <Row>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('poNo')} {...formItemLayout}>
                {getFieldDecorator('po_no', {
                rules: [{ type: 'string', required: true, message: this.msg('poNoIsRequired') }],
                initialValue: purchaseOrder && purchaseOrder.po_no,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('invoiceNo')} {...formItemLayout}>
                {getFieldDecorator('inv_no', {
                initialValue: purchaseOrder && purchaseOrder.inv_no,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('productNo')} {...formItemLayout}>
                {getFieldDecorator('gt_product_no', {
                 rules: [{ required: true, message: this.msg('productNoIsRequired') }],
                initialValue: purchaseOrder && purchaseOrder.gt_product_no,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('orderQty')} {...formItemLayout}>
                {getFieldDecorator('gt_qty_pcs', {
                  rules: [{ required: true, message: this.msg('qtyIsRequired') }],
                initialValue: purchaseOrder && purchaseOrder.gt_qty_pcs,
              })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('customer')} {...formItemLayout}>
                {getFieldDecorator('gt_owner', {
                initialValue: (purchaseOrder && purchaseOrder.gt_owner),
              })(<Select allowClear showSearch optionFilterProp="children">
                {buyers.map(buyer =>
                  (<Option key={String(buyer.id)} value={String(buyer.id)}>
                    {[buyer.partner_code, buyer.name].filter(byer => byer).join('|')}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('customerCntry')} {...formItemLayout}>
                {getFieldDecorator('gt_owner_country', {
                initialValue: purchaseOrder && purchaseOrder.gt_owner_country,
              })(<Select allowClear showSearch optionFilterProp="children">
                {countries.map(cntry =>
                  (<Option key={cntry.value} value={cntry.value}>
                    {cntry.text}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('supplier')} {...formItemLayout}>
                {getFieldDecorator('gt_supplier', {
                initialValue: purchaseOrder && purchaseOrder.gt_supplier,
              })(<Select allowClear showSearch optionFilterProp="children">
                {sellers.map(seller =>
                  (<Option key={String(seller.id)} value={String(seller.id)}>
                    {[seller.partner_code, seller.name].filter(sel => sel).join('|')}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('supplierCntry')} {...formItemLayout}>
                {getFieldDecorator('gt_supplier_country', {
                initialValue: purchaseOrder && purchaseOrder.gt_supplier_country,
              })(<Select allowClear showSearch optionFilterProp="children">
                {countries.map(cntry =>
                  (<Option key={cntry.value} value={cntry.value}>
                    {cntry.value}|{cntry.text}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>


          </Row>
          <Row>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('trxnMode')} {...formItemLayout}>
                {getFieldDecorator('gt_trxn_mode', {
                  initialValue: purchaseOrder && purchaseOrder.gt_trxn_mode,
                })(<Select allowClear showSearch optionFilterProp="children">
                  {trxnModes.map(trxn =>
                    (<Option key={trxn.value} value={trxn.value}>
                      {trxn.value}|{trxn.text}
                    </Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('transMode')} {...formItemLayout}>
                {getFieldDecorator('intl_traf_mode', {
                initialValue: purchaseOrder && purchaseOrder.intl_traf_mode,
              })(<Select allowClear showSearch optionFilterProp="children">
                {transModes.map(trans =>
                  (<Option key={trans.value} value={trans.value}>
                    {trans.value}|{trans.text}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('gName')} {...formItemLayout}>
                {getFieldDecorator('gt_name_cn', {
                initialValue: purchaseOrder && purchaseOrder.gt_name_cn,
              })(<Input />)}
              </FormItem>
            </Col>

            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('brand')} {...formItemLayout}>
                {getFieldDecorator('cop_brand', {
                initialValue: purchaseOrder && purchaseOrder.cop_brand,
              })(<Input />)}
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('unitPrice')} {...formItemLayout}>
                {getFieldDecorator('gt_unit_price', {
                initialValue: purchaseOrder && purchaseOrder.gt_unit_price,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('totalAmount')} {...formItemLayout}>
                {getFieldDecorator('gt_amount', {
                initialValue: purchaseOrder && purchaseOrder.gt_amount,
              })(<Input />)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('currency')} {...formItemLayout}>
                {getFieldDecorator('gt_currency', {
                initialValue: purchaseOrder && purchaseOrder.gt_currency,
              })(<Select allowClear showSearch optionFilterProp="children">
                {currencies.map(currency =>
                  (<Option value={currency.value} key={currency.value}>
                    {currency.value}|{currency.text}
                  </Option>))}
              </Select>)}
              </FormItem>
            </Col>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('netWeight')} {...formItemLayout}>
                {getFieldDecorator('gt_netwt', {
                initialValue: purchaseOrder && purchaseOrder.gt_netwt,
              })(<Input addonAfter={purchaseOrder && purchaseOrder.cop_weight_unit ? purchaseOrder.cop_weight_unit : 'KG'} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={12} sm={24}>
              <FormItem label={this.msg('virtualWhse')} {...formItemLayout}>
                {getFieldDecorator('gt_virtual_whse', {
                initialValue: purchaseOrder && purchaseOrder.gt_virtual_whse,
              })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </FormPane>
      </Card>
    );
  }
}
