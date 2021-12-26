import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Row, Col, Input, Select, message } from 'antd';
import { updateBookGoods, createBookGoods } from 'common/reducers/ptsBook';
import { CUSTOMS_EXEC_MARK, PRODUCT_ATTR, MODIFY_MARK, PTS_BOOK_TYPE } from 'common/constants';
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
  fieldLabelMap.decl_g_qty = msg('declGQty');
  fieldLabelMap.duty_mode = msg('dutyMode');
  fieldLabelMap.decl_total_amount = msg('declTotalAmount');
  fieldLabelMap.product_attr = msg('productAttr');
  fieldLabelMap.modify_mark = msg('modifyMark');
  fieldLabelMap.customs_exec_mark = msg('customsExecMark');
  fieldLabelMap.uconsum_doubt = msg('uconsumDoubt');
  fieldLabelMap.consult_flag = msg('consultFlag');
  fieldLabelMap.qty_control_mark = msg('qtyControlMark');
  fieldLabelMap.writtenoff_cycle_init_qty = msg('writtenoffCycleInitQty');
  fieldLabelMap.approve_max_qty = msg('approveMaxQty');
  fieldLabelMap.main_aux_mark = msg('mainAuxMark');
  fieldLabelMap.remark = msg('remark');
}

@injectIntl
@connect(
  state => ({
    bookHead: state.ptsBook.bookData,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(curr => ({
      value: curr.curr_code,
      text: curr.curr_name,
    })),
    country: state.saasParams.latest.country,
    exemptions: state.saasParams.latest.exemptionWay,
  }),
  {
    updateBookGoods, createBookGoods,
  }
)
@Form.create()
export default class PTBookGoodsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  state = {
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
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
          mode, bookHead, editInfo, activeKey, units, country, currencies, exemptions,
        } = this.props;
        const editForm = this.props.form.getFieldsValue();
        const data = {
          blbook_no: bookHead.blbook_no,
          pre_blbook_no: bookHead.pre_blbook_no,
          prdgoods_mark: activeKey === 'endProduct' ? 'E' : 'I',
          prdt_item_no: editForm.prdt_item_no,
          product_no: editForm.product_no,
          hscode: editForm.hscode,
          g_name: editForm.g_name,
          g_model: editForm.g_model,
          g_unit: editForm.g_unit,
          unit_1: editForm.unit_1,
          unit_2: editForm.unit_2,
          dec_price: editForm.dec_price,
          currency: editForm.currency,
          decl_g_qty: editForm.decl_g_qty,
          duty_mode: editForm.duty_mode,
          decl_total_amount: editForm.decl_total_amount,
          product_attr: editForm.product_attr,
          country: editForm.country,
          modify_mark: editForm.modify_mark,
          customs_exec_mark: editForm.customs_exec_mark,
          uconsum_doubt: editForm.uconsum_doubt,
          consult_flag: editForm.consult_flag,
          qty_control_mark: editForm.qty_control_mark,
          etps_exec_flag: editForm.etps_exec_flag,
          writtenoff_cycle_init_qty: editForm.writtenoff_cycle_init_qty,
          approve_max_qty: editForm.approve_max_qty,
          main_aux_mark: editForm.main_aux_mark,
          remark: editForm.remark,
        };
        if (mode === 'create') {
          this.props.createBookGoods(data).then((result) => { // 新建
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
            }
          });
        } else {
          const fields = Object.keys(editForm);
          ['dec_price', 'decl_total_amount'].forEach((field) => {
            const fieldNumVal = Number(editForm[field]);
            if (!Number.isNaN(fieldNumVal)) {
              editForm[field] = fieldNumVal;
            } else {
              editForm[field] = '';
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
                const oldValue = currencies.find(curr => curr.value === editInfo[field]) &&
                  currencies.find(curr => curr.value === editInfo[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'duty_mode') {
                const value = exemptions.find(pt => pt.value === editForm[field]);
                const oldValue = exemptions.find(pt => pt.value === editInfo[field]);
                contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
              } else if (field === 'product_attr') {
                const value = PRODUCT_ATTR.find(pt => pt.value === editForm[field]);
                const oldValue = PRODUCT_ATTR.find(pt => pt.value === editInfo[field]);
                contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${editInfo[field] || ''}] 改为 [${editForm[field] || ''}]`);
              }
            }
          }
          data.id = editInfo.id;
          this.props.updateBookGoods(data, contentLog).then((result) => { // 修改
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
            }
          });
        }
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, mode, editInfo, country, activeKey,
      units, currencies, exemptions, bookHead,
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
    const goodsInfo = isNew ? {} : editInfo;
    const isManualBook = bookHead.blbook_type === PTS_BOOK_TYPE.MBOOK;
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
        <Form hideRequiredMark>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('goodsSeqno')} {...formItemLayout}>
                {getFieldDecorator('prdt_item_no', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.prdt_item_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('productNo')} {...formItemLayout}>
                {getFieldDecorator('product_no', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.product_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('hscode')} {...formItemLayout}>
                {getFieldDecorator('hscode', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.hscode,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('gName')} {...formItemLayout}>
                {getFieldDecorator('g_name', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.g_name,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('gModel')} {...formItemLayout}>
                {getFieldDecorator('g_model', {
                  rules: [{ required: isManualBook && activeKey === 'materails' }],
                  initialValue: goodsInfo && goodsInfo.g_model,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('gUnit')} {...formItemLayout}>
                {getFieldDecorator('g_unit', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.g_unit,
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
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('unit1')} {...formItemLayout}>
                {getFieldDecorator('unit_1', {
                  rules: [{ required: !(isManualBook && activeKey === 'endProduct') }],
                  initialValue: goodsInfo && goodsInfo.unit_1,
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
              <FormItem label={this.msg('unit2')} {...formItemLayout}>
                {getFieldDecorator('unit_2', {
                  rules: [{ required: isManualBook && activeKey === 'materails' }],
                  initialValue: goodsInfo && goodsInfo.unit_2,
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
              <FormItem label={this.msg('decPrice')} {...formItemLayout}>
                {getFieldDecorator('dec_price', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.dec_price,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('currency')} {...formItemLayout}>
                {getFieldDecorator('currency', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.currency,
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
            <Col span={8}>
              <FormItem label={this.msg('declGQty')} {...formItemLayout}>
                {getFieldDecorator('decl_g_qty', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.decl_g_qty,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('dutyMode')} {...formItemLayout}>
                {getFieldDecorator('duty_mode', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.duty_mode,
                  })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                    {exemptions.map(ep => (
                      <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          {isManualBook ? <div>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('declTotalAmount')} {...formItemLayout}>
                  {getFieldDecorator('decl_total_amount', { // 手册独有项
                    rules: [{ required: true }],
                    initialValue: goodsInfo && goodsInfo.decl_total_amount,
                    })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('productAttr')} {...formItemLayout}>
                  {getFieldDecorator('product_attr', { // 手册独有项
                    rules: [{ required: false }],
                    initialValue: goodsInfo && goodsInfo.product_attr,
                    })(<Select
                      showSearch
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      {
                        PRODUCT_ATTR.map(mk =>
                          <Option value={mk.value} key={mk.value}>{mk.text}</Option>)
                        }
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('country')} {...formItemLayout}>
                  {getFieldDecorator('country', { // 手册独有项
                    rules: [{ required: true }],
                    initialValue: goodsInfo && goodsInfo.country,
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
            </Row></div> :
          <div>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('qtyControlMark')} {...formItemLayout}>
                  {getFieldDecorator('qty_control_mark', { // 账册独有项
                      rules: [{ required: false }],
                      initialValue: goodsInfo && goodsInfo.qty_control_mark,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      <Option value="1" key="1">1-数量控制</Option>
                      <Option value="2" key="2">2-不控制数量</Option>
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('uconsumExecFlag')} {...formItemLayout}>
                  {getFieldDecorator('etps_exec_flag', { // 账册独有项
                      rules: [{ required: false }],
                      initialValue: goodsInfo && goodsInfo.etps_exec_flag,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      <Option value="1" key="1">1-运行</Option>
                      <Option value="2" key="2">2-停用</Option>
                    </Select>)}
                </FormItem>
              </Col>
            </Row>
          </div>}
          {!isManualBook && activeKey === 'materails' && <div>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('writtenoffCycleInitQty')} {...formItemLayout}>
                  {getFieldDecorator('writtenoff_cycle_init_qty', { // 账册料件独有项
                      rules: [{ required: activeKey === 'endProduct' }],
                      initialValue: goodsInfo && goodsInfo.writtenoff_cycle_init_qty,
                    })(<Input type="number" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('approveMaxQty')} {...formItemLayout}>
                  {getFieldDecorator('approve_max_qty', { // 账册料件独有项
                      rules: [{ required: false }],
                      initialValue: goodsInfo && goodsInfo.approve_max_qty,
                    })(<Input type="number" />)}
                </FormItem>
              </Col>
            </Row>
          </div>}
          {activeKey === 'endProduct' && <div>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('uconsumDoubt')} {...formItemLayout}>
                  {getFieldDecorator('uconsum_doubt', { // 成品独有
                      rules: [{ required: true }],
                      initialValue: goodsInfo && goodsInfo.uconsum_doubt,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      <Option value="0" key="0">0-不质疑</Option>
                      <Option value="1" key="1">1-质疑</Option>
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('consultFlag')} {...formItemLayout}>
                  {getFieldDecorator('consult_flag', { // 成品独有
                      rules: [{ required: true }],
                      initialValue: goodsInfo && goodsInfo.consult_flag,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      <Option value="0" key="0">0-未磋商</Option>
                      <Option value="1" key="1">1-磋商中</Option>
                    </Select>)}
                </FormItem>
              </Col>
            </Row>
          </div>}
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('modifyMark')} {...formItemLayout}>
                {getFieldDecorator('modify_mark', {
                    rules: [{ required: !(isManualBook && activeKey === 'endProduct') }],
                    initialValue: goodsInfo && goodsInfo.modify_mark,
                })(<Select
                  showSearch
                  showArrow
                  optionFilterProp="children"
                  allowClear
                >
                  {
                    MODIFY_MARK.map(mk =>
                      <Option value={mk.value} key={mk.value}>{mk.text}</Option>)
                    }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('customsExecMark')} {...formItemLayout}>
                {getFieldDecorator('customs_exec_mark', {
                    rules: [{ required: false }],
                    initialValue: goodsInfo && goodsInfo.customs_exec_mark,
                })(<Select
                  showSearch
                  showArrow
                  optionFilterProp="children"
                  allowClear
                >
                  {
                    CUSTOMS_EXEC_MARK.map(mk =>
                      <Option value={mk.value} key={mk.value}>{mk.text}</Option>)
                    }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('remark')} {...formItemLayout}>
                {getFieldDecorator('remark', {
                    rules: [{ required: false }],
                    initialValue: goodsInfo && goodsInfo.remark,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('mainAuxMark')} {...formItemLayout}>
                {getFieldDecorator('main_aux_mark', {
                    rules: [{ required: (isManualBook && activeKey === 'materails') || (!isManualBook && activeKey === 'endProduct') }],
                    initialValue: goodsInfo && goodsInfo.main_aux_mark,
                })(<Select
                  showSearch
                  showArrow
                  optionFilterProp="children"
                  allowClear
                >
                  <Option value="1" key="1">1-主料</Option>
                  <Option value="2" key="2">2-辅料</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
