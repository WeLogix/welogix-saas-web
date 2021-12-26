import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Modal, Form, Row, Col, Input, Select, DatePicker, message } from 'antd';
import { updateBlBookGoods, createBlBookGoods } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.prdt_item_no = msg('prdtItemNo');
  fieldLabelMap.product_no = msg('productNo');
  fieldLabelMap.hscode = msg('hscode');
  fieldLabelMap.g_name = msg('gName');
  fieldLabelMap.g_model = msg('gModel');
  fieldLabelMap.country = msg('country');
  fieldLabelMap.g_unit = msg('gUnit');
  fieldLabelMap.unit_1 = msg('unit1');
  fieldLabelMap.unit_2 = msg('unit2');
  fieldLabelMap.dec_price = msg('decPrice');
  fieldLabelMap.currency = msg('currency');
  fieldLabelMap.blbg_invalid = msg('blbgInvalid');
  fieldLabelMap.blbg_freeup_date = msg('blbgFreeupDate');
  fieldLabelMap.blbg_expiray_date = msg('blbgExpirayDate');
  fieldLabelMap.remark = msg('remark');
  fieldLabelMap.ciqcode = msg('ciqcode');
  fieldLabelMap.invtNo = msg('invtNo');
  fieldLabelMap.invtSeqNo = msg('invtSeqNo');
}

@injectIntl
@connect(
  state => ({
    blBookData: state.cwmBlBook.blBookData,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      value: curr.curr_code,
      text: curr.curr_name,
    })),
    country: state.saasParams.latest.country,
  }),
  {
    updateBlBookGoods, createBlBookGoods,
  }
)
@Form.create()
export default class BLBookGoodsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  state = {
  }
  componentDidMount() {
    if (this.props.mode === 'edit') {
      // this.props;
    }
    createFieldLabelMap(this.msg);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  //   if ((nextProps.declInfo.delg_no !== this.props.declInfo.delg_no ||
  //     nextProps.declInfo.pre_entry_seq_no !== this.props.declInfo.pre_entry_seq_no)) {
  //     this.handleUserListLoad(nextProps.declInfo.delg_no, nextProps.declInfo.pre_entry_seq_no);
  //   }
  // }
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
          mode, blBookData, editInfo, country, units, currencies,
        } = this.props;
        const editForm = this.props.form.getFieldsValue();
        const data = {
          blbg_status: editInfo.blbg_status, // 是否备案
          blbook_no: blBookData.blbook_no,
          blbg_expiray_date: editForm.blbg_expiray_date,
          blbg_freeup_date: editForm.blbg_freeup_date,
          blbg_invalid: editForm.blbg_invalid,
          country: editForm.country,
          currency: editForm.currency,
          dec_price: editForm.dec_price,
          g_model: editForm.g_model,
          g_name: editForm.g_name,
          g_unit: editForm.g_unit,
          ciqcode: editForm.ciqcode,
          prdt_item_no: editForm.prdt_item_no,
          product_no: editForm.product_no,
          remark: editForm.remark,
          unit_1: editForm.unit_1,
          unit_2: editForm.unit_2,
        };
        if (mode === 'create') {
          this.props.createBlBookGoods(data).then((result) => { // 新建
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success('保存成功');
              this.handleCancel();
            }
          });
        } else {
          const fields = Object.keys(editForm);
          ['dec_price'].forEach((field) => {
            const fieldNumVal = Number(editForm[field]);
            if (!Number.isNaN(fieldNumVal)) {
              editForm[field] = fieldNumVal;
            } else {
              editForm[field] = '';
            }
          });
          ['blbg_freeup_date', 'blbg_expiray_date'].forEach((field) => {
            if (editInfo[field]) {
              editInfo[field] = moment(editInfo[field]).format('YYYY-MM-DD');
            }
            if (editForm[field]) {
              editForm[field] = moment(editForm[field]).format('YYYY-MM-DD');
            }
          });
          const contentLog = [];
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (editInfo[field] !== editForm[field] &&
              !(!editInfo[field] && !editForm[field])) {
              if (field === 'country') {
                const value = country.find(cntry => cntry.cntry_co === editForm[field]) &&
                  country.find(cntry => cntry.cntry_co === editForm[field]).cntry_name_cn;
                const oldValue = country.find(cntry => cntry.cntry_co === editInfo[field]) &&
                  country.find(cntry => cntry.cntry_co === editInfo[field]).cntry_name_cn;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'g_unit' || field === 'unit_1' || field === 'unit_2') {
                const value = units.find(unit => unit.value === editForm[field]) &&
                  units.find(unit => unit.value === editForm[field]).text;
                const oldValue = units.find(unit => unit.value === editInfo[field]) &&
                  units.find(unit => unit.value === editInfo[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'currency') {
                const value = currencies.find(curr => curr.value === editForm[field]) &&
                  currencies.find(curr => curr.value === editForm[field]).text;
                const oldValue = currencies.find(curr => curr.value === editForm[field]) &&
                  currencies.find(curr => curr.value === editForm[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'blbg_invalid') {
                const value = editForm[field] === '1' ? '是' : '否';
                const oldValue = editInfo[field] === '1' ? '是' : '否';
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${editInfo[field] || ''}] 改为 [${editForm[field] || ''}]`);
              }
            }
          }
          data.id = editInfo.id;
          this.props.updateBlBookGoods(data, contentLog.length > 0 ? `修改表体数据, 备案序号${editInfo.prdt_item_no}, ${contentLog.join(';')}` : '').then((result) => { // 修改
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success('修改成功');
              this.handleCancel();
            }
          });
        }
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, mode, editInfo, country,
      units, currencies,
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
    const isNew = (mode === 'create');
    const blBookGoods = isNew ? {} : editInfo;
    return (
      <Modal
        width={960}
        title={isNew ? '新建表体数据' : '修改表体数据'}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText={isNew ? '保存' : '确认修改'}
        onOk={this.handleSaveGoods}
      >
        <Form>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.prdt_item_no} {...formItemLayout}>
                {getFieldDecorator('prdt_item_no', {
                    initialValue: blBookGoods && blBookGoods.prdt_item_no,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.product_no} {...formItemLayout}>
                {getFieldDecorator('product_no', {
                    initialValue: blBookGoods && blBookGoods.product_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.hscode} {...formItemLayout}>
                {getFieldDecorator('hscode', {
                    initialValue: blBookGoods && blBookGoods.hscode,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ciqcode} {...formItemLayout}>
                {getFieldDecorator('ciqcode', {
                    initialValue: blBookGoods && blBookGoods.ciqcode,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.g_name} {...formItemLayout}>
                {getFieldDecorator('g_name', {
                    initialValue: blBookGoods && blBookGoods.g_name,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.g_model} {...formItemLayout}>
                {getFieldDecorator('g_model', {
                    initialValue: blBookGoods && blBookGoods.g_model,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.g_unit} {...formItemLayout}>
                {getFieldDecorator('g_unit', {
                    initialValue: blBookGoods && blBookGoods.g_unit,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                  >
                    {units.map(ut =>
                      <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.unit_1} {...formItemLayout}>
                {getFieldDecorator('unit_1', {
                    initialValue: blBookGoods && blBookGoods.unit_1,
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
            <Col span={8}>
              <FormItem label={fieldLabelMap.unit_2} {...formItemLayout}>
                {getFieldDecorator('unit_2', {
                    initialValue: blBookGoods && blBookGoods.unit_2,
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
            <Col span={8}>
              <FormItem label={fieldLabelMap.country} {...formItemLayout}>
                {getFieldDecorator('country', {
                    initialValue: blBookGoods && blBookGoods.country,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {country.map(cus =>
                      (<Option
                        value={cus.cntry_co}
                        key={cus.cntry_co}
                      >
                        {cus.cntry_co}|{cus.cntry_name_cn}
                      </Option>))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.dec_price} {...formItemLayout}>
                {getFieldDecorator('dec_price', {
                    initialValue: blBookGoods && blBookGoods.dec_price,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.currency} {...formItemLayout}>
                {getFieldDecorator('currency', {
                    initialValue: blBookGoods && blBookGoods.currency,
                })(<Select
                  showSearch
                  showArrow
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {currencies.map(cr => (
                    <Option key={cr.value} value={cr.value} >{cr.value} | {cr.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.blbg_freeup_date} {...formItemLayout}>
                {getFieldDecorator('blbg_freeup_date', {
                  initialValue: blBookGoods && blBookGoods.blbg_freeup_date && moment(blBookGoods.blbg_freeup_date, 'YYYY/MM/DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.blbg_expiray_date} {...formItemLayout}>
                {getFieldDecorator('blbg_expiray_date', {
                  initialValue: blBookGoods && blBookGoods.blbg_expiray_date && moment(blBookGoods.blbg_expiray_date, 'YYYY/MM/DD'),
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.blbg_invalid} {...formItemLayout}>
                {getFieldDecorator('blbg_invalid', {
                    rules: [{ required: false }],
                    initialValue: (blBookGoods && blBookGoods.blbg_invalid) || 0,
                  })(<Select >
                    <Option value={0} key={0}>0-否</Option>
                    <Option value={1} key={1}>1-是</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.invtNo} {...formItemLayout}>
                {getFieldDecorator('invt_no', {
                    initialValue: blBookGoods && blBookGoods.invt_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.invtSeqNo} {...formItemLayout}>
                {getFieldDecorator('invt_seq_no', {
                    initialValue: blBookGoods && blBookGoods.invt_seq_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.remark} {...formItemLayout}>
                {getFieldDecorator('remark', {
                    initialValue: blBookGoods && blBookGoods.remark,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
