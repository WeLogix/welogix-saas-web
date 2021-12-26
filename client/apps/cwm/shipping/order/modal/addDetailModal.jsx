import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideDetailModal, getSuppliers, loadSkuStockSum } from 'common/reducers/cwmReceive';
import { loadProducts, clearProductNos } from 'common/reducers/cwmSku';
import { addSoDetails, setSoDetails, editSoDetail } from 'common/reducers/cwmShippingOrder';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.product_no = msg('productNo');
  fieldLabelMap.product_sku = msg('SKU');
  fieldLabelMap.name = msg('descCN');
  fieldLabelMap.order_qty = msg('orderQty');
  fieldLabelMap.virtual_whse = msg('virtualWhse');
  fieldLabelMap.asn_cust_order_no = msg('asnCustOrderNo');
  fieldLabelMap.unit_price = msg('unitPrice');
  fieldLabelMap.currency = msg('currency');
  fieldLabelMap.unit = msg('unit');
  fieldLabelMap.amount = msg('totalAmount');
  fieldLabelMap.external_lot_no = msg('externalLotNo');
  fieldLabelMap.serial_no = msg('serialNo');
  fieldLabelMap.supplier = msg('supplier');
}

@injectIntl
@connect(
  state => ({
    visible: state.cwmReceive.detailModal.visible,
    soDetails: state.cwmShippingOrder.soDetails,
    productNos: state.cwmSku.productNos,
    products: state.cwmSku.products,
    units: state.saasParams.latest.unit.map(un => ({
      code: un.unit_code,
      name: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      code: curr.curr_code,
      name: curr.curr_name,
    })),
    suppliers: state.cwmReceive.suppliers,
    defaultWhse: state.cwmContext.defaultWhse,
    soHead: state.cwmShippingOrder.soHead,
  }),
  {
    hideDetailModal,
    loadProducts,
    clearProductNos,
    getSuppliers,
    loadSkuStockSum,
    addSoDetails,
    setSoDetails,
    editSoDetail,
  }
)
@Form.create()
export default class AddDetailModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    selectedOwner: PropTypes.number,
    units: PropTypes.arrayOf(PropTypes.shape({
      unit_code: PropTypes.string,
      unit_name: PropTypes.string,
    })),
  }
  state = {
    amount: 0,
    skus: [],
    unit: '',
    currency: '',
    stock: '',
    avail: '',
    frozen: '',
    country: '',
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
    this.props.getSuppliers(this.props.defaultWhse.code, this.props.soHead.owner_partner_id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible && nextProps.edit) {
      const { product } = nextProps;
      this.setState({
        unit: product.unit,
        currency: product.currency,
        amount: product.amount,
      });
      this.props.form.setFieldsValue({
        unit_price: product.unit_price,
        product_no: product.product_no,
        product_sku: product.product_sku,
        name: product.name,
        order_qty: product.order_qty,
        virtual_whse: product.virtual_whse,
        asn_cust_order_no: product.asn_cust_order_no,
        external_lot_no: product.external_lot_no,
        serial_no: product.serial_no,
        supplier: product.supplier,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideDetailModal();
    this.setState({
      amount: 0,
      skus: [],
      unit: '',
      currency: '',
      stock: '',
      avail: '',
      frozen: '',
    });
    this.props.form.setFieldsValue({
      unit_price: '',
      product_no: '',
      product_sku: '',
      name: '',
      order_qty: '',
      virtual_whse: '',
      asn_cust_order_no: '',
      external_lot_no: '',
      serial_no: '',
      supplier: '',
    });
    this.props.clearProductNos();
  }
  handleSearch = (value) => {
    if (value.length >= 3) {
      const { selectedOwner, soHead } = this.props;
      this.props.loadProducts(value, selectedOwner || soHead.owner_partner_id);
    }
  }
  submit = () => {
    const {
      edit, product, soHead, defaultWhse, units, currencies,
    } = this.props;
    const {
      amount, currency, unit, country,
    } = this.state;
    const soDetails = [...this.props.soDetails];
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (soHead.so_no) {
          if (edit) {
            const detail = {
              ...values,
              product_sku: values.product_sku || '',
              unit,
              currency,
              amount: amount || product.amount,
              country,
            };
            if (!detail.unsaved) {
              const fields = Object.keys(detail);
              const contentLog = [];
              ['unit_price', 'order_qty', 'amount'].forEach((field) => {
                const fieldNumVal = Number(detail[field]);
                if (!Number.isNaN(fieldNumVal)) {
                  detail[field] = fieldNumVal;
                } else {
                  detail[field] = '';
                }
              });
              for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (product[field] !== detail[field] &&
                  !(!product[field] && !detail[field])) {
                  if (field === 'unit') {
                    const value = units.find(item => item.code === detail[field]) &&
                      units.find(item => item.code === detail[field]).name;
                    const oldValue = units.find(item => item.code === product[field]) &&
                      units.find(item => item.code === product[field]).name;
                    contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
                  } else if (field === 'currency') {
                    const value = currencies.find(item => item.code === detail[field]) &&
                      currencies.find(item => item.code === detail[field]).name;
                    const oldValue = currencies.find(item => item.code === product[field]) &&
                      currencies.find(item => item.code === product[field]).name;
                    contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
                  } else {
                    contentLog.push(`"${fieldLabelMap[field]}"由 [${product[field] || ''}] 改为 [${detail[field] || ''}]`);
                  }
                }
              }
              this.props.editSoDetail({
                detail,
                soNo: soHead.so_no,
                custOrderNo: soHead.cust_order_no,
                seqNo: product.so_seq_no,
                contentLog: contentLog.length > 0 ? `修改SO明细${product.so_seq_no}, ${contentLog.join(';')}` : '',
              }).then((result) => {
                if (!result.error) {
                  soDetails.splice(product.index, 1, { ...detail, so_seq_no: product.so_seq_no });
                  this.props.setSoDetails(soDetails);
                  message.success(this.msg('savedSucceed'));
                }
              });
            }
          } else {
            const detail = {
              ...values,
              amount,
              currency,
              unit,
              country,
            };
            detail.so_seq_no = soDetails.length + 1;
            this.props.addSoDetails({
              details: [detail],
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
        } else { // change local data
          const detail = {
            ...values,
            country,
            product_sku: values.product_sku || '',
            unit,
            currency,
            amount: amount || product.amount,
          };
          soDetails.splice(product.index, 1, { ...detail, so_seq_no: product.so_seq_no });
          this.props.setSoDetails(soDetails);
        }
        this.handleCancel();
      }
      this.props.clearProductNos();
    });
  }
  handleQtyChange = (e) => {
    const unitPrice = this.props.form.getFieldValue('unit_price');
    const { amount } = this.state;
    if (!unitPrice && !amount) { return; }
    if (!unitPrice && amount) {
      this.props.form.setFieldsValue({ unit_price: (amount / e.target.value).toFixed(2) });
    }
    if (unitPrice) {
      this.setState({ amount: e.target.value * unitPrice });
    }
  }
  handlePriceChange = (e) => {
    const orderQty = this.props.form.getFieldValue('order_qty');
    if (orderQty) {
      this.setState({ amount: orderQty * e.target.value });
    }
  }
  handleAmountChange = (e) => {
    const orderQty = this.props.form.getFieldValue('order_qty');
    this.setState({
      amount: e.target.value,
    });
    if (orderQty) {
      this.props.form.setFieldsValue({ unit_price: (e.target.value / orderQty).toFixed(2) });
    }
  }
  handleSelect = (value) => {
    const { products, selectedOwner, soHead } = this.props;
    const filterProducts = products.filter(item => item.product_no === value);
    const skus = filterProducts.map(fp => fp.product_sku);
    const product = filterProducts[0];
    this.setState({
      unit: product.unit,
      currency: product.currency,
      country: product.country,
      skus,
    });
    this.props.form.setFieldsValue({
      unit_price: product.unit_price,
      product_no: product.product_no,
      product_sku: product.product_sku,
      name: product.desc_cn,
    });
    this.props.loadSkuStockSum(selectedOwner || soHead.owner_partner_id, value).then((result) => {
      if (!result.error) {
        this.setState({
          avail: result.data[0].avail_qty,
          stock: result.data[0].stock_qty,
          alloc: result.data[0].alloc_qty,
          frozen: result.data[0].frozen_qty,
        });
      }
    });
  }
  handleUnitChange = (value) => {
    const unit = this.props.units.filter(un => un.code === value)[0];
    if (unit) {
      this.setState({ unit: unit.code });
    } else {
      this.setState({ unit: '' });
    }
  }
  handleCurrChange = (value) => {
    const curr = this.props.currencies.filter(cu => cu.code === value)[0];
    if (curr) {
      this.setState({ currency: curr.code });
    } else {
      this.setState({ currency: '' });
    }
  }
  handleSelectSku = (value) => {
    const { products } = this.props;
    const product = products.find(p => p.product_sku === value);
    this.setState({
      unit: product.unit,
      currency: product.currency,
    });
    this.props.form.setFieldsValue({
      unit_price: product.unit_price,
      product_no: product.product_no,
      product_sku: product.product_sku,
      name: product.desc_cn,
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, productNos, units, currencies, product,
    } = this.props;
    const {
      skus, avail, stock, alloc, frozen, unit, currency,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal width={800} maskClosable={false} onCancel={this.handleCancel} visible={visible} title="货品明细" onOk={this.submit}>
        <Form layout="horizontal" className="form-layout-compact">
          <FormItem label={fieldLabelMap.product_no} {...formItemLayout}>
            {getFieldDecorator('product_no', {
              rules: [{ required: true, message: '请输入货号' }],
            })(<Select
              mode="combobox"
              placeholder="请至少输入三位货号"
              onChange={this.handleSearch}
              style={{ width: '100%' }}
              onSelect={this.handleSelect}
            >
              {productNos.map(productNo => (<Option value={productNo} key={productNo}>
                {productNo}</Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={fieldLabelMap.product_sku} {...formItemLayout}>
            {getFieldDecorator('product_sku', {
              initialValue: product.product_sku,
            })(<Select onSelect={this.handleSelectSku} allowClear>
              {skus.map(sku => (<Option value={sku} key={sku}>{sku}</Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={fieldLabelMap.name} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: product.name,
            })(<Input />)}
          </FormItem>
          <FormItem label="库存/可用/分配/冻结数量" {...formItemLayout}>
            <InputGroup compact>
              <Input style={{ width: '25%' }} value={stock} disabled />
              <Input style={{ width: '25%' }} value={avail} disabled />
              <Input style={{ width: '25%' }} value={alloc} disabled />
              <Input style={{ width: '25%' }} value={frozen} disabled />
            </InputGroup>
          </FormItem>
          <FormItem label={fieldLabelMap.order_qty} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('order_qty', {
                rules: [{ required: true, message: '请输入订单数量' }],
              })(<Input type="number" style={{ width: '70%' }} onChange={this.handleQtyChange} />)}
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.unit}
                value={unit}
                style={{ width: '30%' }}
                onChange={this.handleUnitChange}
              >
                {units.map(item =>
                  (<Option value={item.code} key={item.code}>
                    {item.code} | {item.name}</Option>))}
              </Select>
            </InputGroup>
          </FormItem>
          <FormItem label={fieldLabelMap.virtual_whse} {...formItemLayout}>
            {getFieldDecorator('virtual_whse', {
              initialValue: product.virtual_whse,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.asn_cust_order_no} {...formItemLayout}>
            {getFieldDecorator('asn_cust_order_no', {
              initialValue: product.asn_cust_order_no,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.external_lot_no} {...formItemLayout}>
            {getFieldDecorator('external_lot_no', {
              initialValue: product.external_lot_no,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.serial_no} {...formItemLayout}>
            {getFieldDecorator('serial_no', {
              initialValue: product.serial_no,
            })(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.supplier} {...formItemLayout}>
            {getFieldDecorator('supplier', {
              initialValue: product.supplier,
            })(<Select showSearch allowClear optionFilterProp="searchText">
              {this.props.suppliers.map(supplier => <Option searchText={`${supplier.name}${supplier.code}`} value={supplier.name} key={supplier.name}>{supplier.name}</Option>)}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('amount')} {...formItemLayout}>
            <InputGroup compact>
              {getFieldDecorator('unit_price', {
                initialValue: product.unit_price,
              })(<Input type="number" placeholder={fieldLabelMap.unit_price} onChange={this.handlePriceChange} style={{ width: '30%' }} />)}
              <Input type="number" placeholder={this.msg('totalAmount')} value={this.state.amount || product.amount} onChange={this.handleAmountChange} style={{ width: '30%' }} />
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder={fieldLabelMap.currency}
                value={currency}
                style={{ width: '40%' }}
                onChange={this.handleCurrChange}
              >
                {currencies.map(curr => (<Option value={curr.code} key={curr.code}>
                  {curr.code} | {curr.name}</Option>))}
              </Select>
            </InputGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
