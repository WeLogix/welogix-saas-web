import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Row, Col, Input, message, Select } from 'antd';
import { updateInvtBody } from 'common/reducers/ptsImpExp';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.invt_goods_seqno = msg('goodsSeqno');
  fieldLabelMap.prdt_item_no = msg('prdtItemNo');
  fieldLabelMap.entry_seqno = msg('entryGoodsSeqno');
  fieldLabelMap.stock_no = msg('stockNo');
  fieldLabelMap.sgd_product_no = msg('sgdProductNo');
  fieldLabelMap.sgd_hscode = msg('sgdHscode');
  fieldLabelMap.sgd_name = msg('sgdName');
  fieldLabelMap.sgd_model = msg('sgdModel');
  fieldLabelMap.sgd_g_qty = msg('sgdGGty');
  fieldLabelMap.sgd_g_unit = msg('sgdGUnit');
  fieldLabelMap.sgd_unit_1 = msg('sgdUnit1');
  fieldLabelMap.sgd_unit_2 = msg('sgdUnit2');
  fieldLabelMap.sgd_dec_price = msg('sgdDecPrice');
  fieldLabelMap.sgd_amount = msg('sgdAmount');
  fieldLabelMap.sgd_currency = msg('sgdCurrency');
  fieldLabelMap.sgd_qty_1 = msg('sgdQty1');
  fieldLabelMap.sgd_qty_2 = msg('sgdQty2');
  fieldLabelMap.sgd_grosswt = msg('sgdGrosswt');
  fieldLabelMap.sgd_netwt = msg('sgdNetwt');
  fieldLabelMap.sgd_orig_country = msg('sgdOrigCountry');
  fieldLabelMap.sgd_use_to = msg('sgdUseTo');
  fieldLabelMap.stockio_rlt_goods_seqno = msg('rltGoodsSeqno');
  fieldLabelMap.sgd_remark = msg('remark');
  fieldLabelMap.sgd_dest_country = msg('sgdDestCountry');
}

@injectIntl
@connect(
  state => ({
    sasblBodyList: state.cwmSasblReg.sasblBodyList,
    invtData: state.ptsImpExp.invtData,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      value: curr.curr_code,
      text: curr.curr_name,
    })),
    exemptions: state.saasParams.latest.exemptionWay,
    country: state.saasParams.latest.country,
  }),
  {
    updateInvtBody,
  }
)
@Form.create()
export default class blRegBodyModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    msg: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    copInvtNo: PropTypes.string,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      createFieldLabelMap(this.msg);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onModalClose();
  }
  handleSaveGoods = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('表单信息错误');
      } else {
        const {
          editInfo, country, currencies, copInvtNo,
        } = this.props;
        const editForm = this.props.form.getFieldsValue();
        const data = {
          id: editInfo.id,
          prdt_item_no: editForm.prdt_item_no,
          sgd_product_no: editForm.sgd_product_no,
          sgd_hscode: editForm.sgd_hscode,
          sgd_orig_country: editForm.sgd_orig_country,
          sgd_dest_country: editForm.sgd_dest_country,
          sgd_dec_price: editForm.sgd_dec_price,
          sgd_amount: editForm.sgd_amount,
          sgd_currency: editForm.sgd_currency,
          sgd_qty_1: editForm.sgd_qty_1,
          sgd_qty_2: editForm.sgd_qty_2,
          sgd_g_qty: editForm.sgd_g_qty,
          sgd_grosswt: editForm.sgd_grosswt,
          sgd_netwt: editForm.sgd_netwt,
          sgd_use_to: editForm.sgd_use_to,
          invt_goods_seqno: editForm.invt_goods_seqno,
          entry_seqno: editForm.entry_seqno,
          sgd_remark: editForm.sgd_remark,
          sgd_duty_mode: editForm.sgd_duty_mode,
          uconsumption_no: editForm.uconsumption_no,
          apply_seq_no: editForm.apply_seq_no,
        };
        ['invt_goods_seqno', 'prdt_item_no', 'sgd_amount', 'sgd_dec_price', 'sgd_g_qty', 'sgd_grosswt', 'sgd_netwt',
          'sgd_qty_1', 'sgd_qty_2'].forEach((field) => {
          const fieldNumVal = Number(editForm[field]);
          if (!Number.isNaN(fieldNumVal)) {
            editForm[field] = fieldNumVal;
          } else {
            editForm[field] = '';
          }
        });
        const contentLog = [];
        ['invt_goods_seqno', 'prdt_item_no', 'entry_seqno', 'sgd_product_no', 'sgd_hscode', 'sgd_g_qty',
          'sgd_dec_price', 'sgd_amount', 'sgd_currency', 'sgd_qty_1', 'sgd_qty_2', 'sgd_grosswt', 'sgd_netwt',
          'sgd_country', 'sgd_use_to', 'stockio_rlt_goods_seqno', 'sgd_remark'].forEach((field) => {
          if (editInfo[field] !== editForm[field] &&
            !(!editInfo[field] && !editForm[field])) {
            if (field === 'sgd_country') {
              const value = country.find(cntry => cntry.cntry_co === editForm[field]) &&
                country.find(cntry => cntry.cntry_co === editForm[field]).cntry_name_cn;
              const oldValue = country.find(cntry => cntry.cntry_co === editInfo[field]) &&
                country.find(cntry => cntry.cntry_co === editInfo[field]).cntry_name_cn;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'sgd_currency') {
              const value = currencies.find(curr => curr.value === editForm[field]) &&
                currencies.find(curr => curr.value === editForm[field]).text;
              const oldValue = currencies.find(curr => curr.value === editInfo[field]) &&
                currencies.find(curr => curr.value === editInfo[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${editInfo[field] || ''}] 改为 [${editForm[field] || ''}]`);
            }
          }
        });
        this.props.updateInvtBody(data, contentLog.length > 0 ? `修改核放单表体备案序号${editInfo.prdt_item_no}, ${contentLog.join(';')}` : '', copInvtNo).then((result) => { // 修改
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('修改成功');
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, editInfo, invtData, units,
      currencies, exemptions, country,
    } = this.props;
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
    return (
      <Modal
        width={1400}
        title={this.msg('editBodyGoodsDetail')}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText={this.msg('confirm')}
        onOk={this.handleSaveGoods}
      >
        <Form hideRequiredMark>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('preSasblSeqno')} {...formItemLayout}>
                <Input disabled value={invtData.pre_sasbl_seqno} />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.invt_goods_seqno} {...formItemLayout}>
                {getFieldDecorator('invt_goods_seqno', {
                  rules: [{ required: true }],
                  initialValue: editInfo && editInfo.invt_goods_seqno,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.prdt_item_no} {...formItemLayout}>
                {getFieldDecorator('prdt_item_no', {
                    initialValue: editInfo && editInfo.prdt_item_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.entry_seqno} {...formItemLayout}>
                {getFieldDecorator('entry_seqno', {
                    initialValue: editInfo && editInfo.entry_seqno,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('applySeqNo')} {...formItemLayout}>
                {getFieldDecorator('apply_seq_no', {
                    initialValue: editInfo && editInfo.apply_seq_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_product_no} {...formItemLayout}>
                {getFieldDecorator('sgd_product_no', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_product_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_hscode} {...formItemLayout}>
                {getFieldDecorator('sgd_hscode', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_hscode,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_name} {...formItemLayout}>
                {getFieldDecorator('sgd_name', {
                    initialValue: editInfo && editInfo.sgd_name,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_model} {...formItemLayout}>
                {getFieldDecorator('sgd_model', {
                    initialValue: editInfo && editInfo.sgd_model,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_g_qty} {...formItemLayout}>
                {getFieldDecorator('sgd_g_qty', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_g_qty,
                })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_g_unit} {...formItemLayout}>
                {getFieldDecorator('sgd_g_unit', {
                    initialValue: editInfo && editInfo.sgd_g_unit,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    disabled
                  >
                    {units.map(ut =>
                      <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_unit_1} {...formItemLayout}>
                {getFieldDecorator('sgd_unit_1', {
                    initialValue: editInfo && editInfo.sgd_unit_1,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    disabled
                  >
                    {units.map(ut =>
                      <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_unit_2} {...formItemLayout}>
                {getFieldDecorator('sgd_unit_2', {
                    rules: [{ required: false }],
                    initialValue: editInfo && editInfo.sgd_unit_2,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    disabled
                  >
                    {units.map(ut =>
                      <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_dec_price} {...formItemLayout}>
                {getFieldDecorator('sgd_dec_price', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_dec_price,
                })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_amount} {...formItemLayout}>
                {getFieldDecorator('sgd_amount', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_amount,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_currency} {...formItemLayout}>
                {getFieldDecorator('sgd_currency', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_currency,
                  })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                    {currencies.map(cr => (
                      <Option key={cr.value} value={cr.value} >{cr.value} | {cr.text}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_qty_1} {...formItemLayout}>
                {getFieldDecorator('sgd_qty_1', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_qty_1,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_qty_2} {...formItemLayout}>
                {getFieldDecorator('sgd_qty_2', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_qty_2,
                })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sgdWtFactor')} {...formItemLayout}>
                {getFieldDecorator('sgd_wt_factor', {
                    initialValue: editInfo && editInfo.sgd_wt_factor,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sgdFactor1')} {...formItemLayout}>
                {getFieldDecorator('sgd_factor1', {
                    initialValue: editInfo && editInfo.sgd_factor1,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('sgdFactor2')} {...formItemLayout}>
                {getFieldDecorator('sgd_factor2', {
                    initialValue: editInfo && editInfo.sgd_factor2,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_grosswt} {...formItemLayout}>
                {getFieldDecorator('sgd_grosswt', {
                    initialValue: editInfo && editInfo.sgd_grosswt,
                })(<Input type="number" addonAfter="KG" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={fieldLabelMap.sgd_netwt} {...formItemLayout}>
                {getFieldDecorator('sgd_netwt', {
                    initialValue: editInfo && editInfo.sgd_netwt,
                  })(<Input type="number" addonAfter="KG" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('modifyMarkcd')} {...formItemLayout}>
                {getFieldDecorator('modify_flag', {
                    initialValue: editInfo && editInfo.modify_flag,
                  })(<Select
                    allowClear
                    disabled
                  >
                    <Option value="0" key="0">0-未修改</Option>
                    <Option value="1" key="1">1-修改</Option>
                    <Option value="2" key="2">2-删除</Option>
                    <Option value="3" key="3">3-增加</Option>
                  </Select>)}
              </FormItem>
            </Col>
            {/* <Col span={6}>
              <FormItem label={this.msg('sgdUseTo')} {...formItemLayout}>
                {getFieldDecorator('sgd_use_to', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_use_to,
                  })(<Input />)}
              </FormItem>
            </Col> */}
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('sgdOrigCountry')} {...formItemLayout}>
                {getFieldDecorator('sgd_orig_country', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_orig_country,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {country.map(cus => <Option value={cus.cntry_co} key={cus.cntry_co}>{`${cus.cntry_co}|${cus.cntry_name_cn}`}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sgdDestCountry')} {...formItemLayout}>
                {getFieldDecorator('sgd_dest_country', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_dest_country,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {country.map(cus => <Option value={cus.cntry_co} key={cus.cntry_co}>{`${cus.cntry_co}|${cus.cntry_name_cn}`}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('dutyMode')} {...formItemLayout}>
                {getFieldDecorator('sgd_duty_mode', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.sgd_duty_mode,
                  })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                    {exemptions.map(ep => (
                      <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('uconsumptionNo')} {...formItemLayout}>
                {getFieldDecorator('uconsumption_no', {
                    initialValue: editInfo && editInfo.uconsumption_no,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label={fieldLabelMap.sgd_remark}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
              >
                {getFieldDecorator('sgd_remark', {
                    initialValue: editInfo && editInfo.sgd_remark,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
