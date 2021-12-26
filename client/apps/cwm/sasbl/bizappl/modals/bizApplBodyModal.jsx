import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, DatePicker, Form, Row, Col, Input, message, Select } from 'antd';
import { updateBizApplDetail, addBizApplDetail } from 'common/reducers/cwmSasblReg';
import { getBookGoodsByPrdtItemNo } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../../message.i18n';

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
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.pre_sasbl_seqno = msg('bizApplPrenoList');
  fieldLabelMap.bappl_no = msg('sasblApplyNo');
  fieldLabelMap.ba_seqno = msg('applySeqNo');
  fieldLabelMap.prdgoods_mark = msg('baPrdgoodsMark');
  fieldLabelMap.prdt_item_no = msg('prdItemNo');
  fieldLabelMap.ba_product_no = msg('sgdProductNo');
  fieldLabelMap.ba_hscode = msg('sgdHscode');
  fieldLabelMap.ba_name = msg('sgdName');
  fieldLabelMap.ba_model = msg('sgdModel');
  fieldLabelMap.ba_qty = msg('count');
  fieldLabelMap.ba_g_unit = msg('sgdGUnit');
  fieldLabelMap.ba_unit_1 = msg('sgdUnit1');
  fieldLabelMap.ba_unit_2 = msg('sgdUnit2');
  fieldLabelMap.ba_dec_price = msg('sgdDecPrice');
  fieldLabelMap.ba_amount = msg('sgdAmount');
  fieldLabelMap.ba_currency = msg('sgdCurrency');
  fieldLabelMap.licence_no = msg('licenceNo');
  fieldLabelMap.licence_valid_time = msg('licenceDate');
  fieldLabelMap.gds_markcd = msg('goodsMark');
  fieldLabelMap.gds_remark = msg('goodsRemark');
  fieldLabelMap.mod_markcd = msg('modifyMarkcd');
  fieldLabelMap.remark = msg('remark');
}

@injectIntl
@connect(
  state => ({
    bizApplDetailList: state.cwmSasblReg.bizApplDetailList,
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
    bizApplHeadData: state.cwmSasblReg.bizApplHeadData,
  }),
  {
    updateBizApplDetail, addBizApplDetail, getBookGoodsByPrdtItemNo,
  }
)
@Form.create()
export default class BizApplBodyModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      // const updFormObj = { prdgoods_mark: nextProps.editInfo.prdgoods_mark };
      const updFormObj = {};
      const { bizApplDetailList } = this.props;
      if (nextProps.modalStatus === 'add') {
        const seqNos = bizApplDetailList.data.map(dt => dt.ba_seqno);
        let newDetailSeqNo = 1;
        if (seqNos.length > 0) {
          newDetailSeqNo = Math.max(...seqNos) + 1;
        }
        updFormObj.ba_seqno = newDetailSeqNo;
      }
      this.props.form.setFieldsValue(updFormObj);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onModalClose();
  }
  handleSaveGoods = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        message.error('表单信息错误');
      } else {
        const {
          editInfo, bizApplHeadData, modalStatus, bizApplDetailList,
          units, currencies,
        } = this.props;
        const data = {
          id: editInfo.id,
          ba_seqno: values.ba_seqno,
          prdt_item_no: values.prdt_item_no && parseInt(values.prdt_item_no, 10),
          prdgoods_mark: values.prdgoods_mark,
          ba_qty: values.ba_qty,
          ba_dec_price: values.ba_dec_price,
          ba_amount: values.ba_amount,
          ba_currency: values.ba_currency,
          licence_no: values.licence_no,
          licence_valid_time: values.licence_valid_time,
          gds_markcd: values.gds_markcd,
          gds_remark: values.gds_remark,
          mod_markcd: values.mod_markcd,
          prdgoods_type: values.prdgoods_type,
          ba_product_no: values.ba_product_no,
          ba_hscode: values.ba_hscode,
          ba_name: values.ba_name,
          ba_model: values.ba_model,
          ba_g_unit: values.ba_g_unit,
          ba_unit_1: values.ba_unit_1,
          ba_unit_2: values.ba_unit_2,
          remark: values.remark,
        };
        let operating;
        if (modalStatus === 'edit') {
          const originData = bizApplDetailList.data.find(item => item.id === data.id);
          const fields = Object.keys(data);
          ['licence_valid_time'].forEach((field) => {
            if (data[field]) {
              data[field] = moment(data[field]).format('YYYY-MM-DD');
            }
            if (originData[field]) {
              originData[field] = moment(originData[field]).format('YYYY-MM-DD');
            }
          });
          ['ba_amount', 'ba_dec_price', 'ba_qty', 'ba_seqno'].forEach((field) => {
            const fieldNumVal = Number(data[field]);
            if (!Number.isNaN(fieldNumVal)) {
              data[field] = fieldNumVal;
            } else {
              data[field] = '';
            }
          });
          delete fields.id;
          const contentLog = [];
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (originData[field] !== data[field] &&
              !(!originData[field] && !data[field])) {
              if (field === 'prdgoods_mark') {
                let value;
                let oldValue;
                if (data[field] === 'I') {
                  value = '料件/半成品';
                } else if (data[field] === 'E') {
                  value = '成品/残次品';
                }
                if (originData[field] === 'I') {
                  oldValue = '料件/半成品';
                } else if (originData[field] === 'E') {
                  oldValue = '成品/残次品';
                }
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'ba_g_unit' || field === 'ba_unit_1' || field === 'ba_unit_2') {
                const value = units.find(unit => unit.value === data[field]) &&
                  units.find(unit => unit.value === data[field]).text;
                const oldValue = units.find(unit => unit.value === originData[field]) &&
                  units.find(unit => unit.value === originData[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else if (field === 'ba_currency') {
                const value = currencies.find(curr => curr.value === data[field]) &&
                  currencies.find(curr => curr.value === data[field]).text;
                const oldValue = currencies.find(curr => curr.value === originData[field]) &&
                  currencies.find(curr => curr.value === originData[field]).text;
                contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${originData[field] || ''}] 改为 [${data[field] || ''}]`);
              }
            }
          }
          operating = this.props.updateBizApplDetail(data, contentLog.length > 0 ? `修改业务申报表表体, 序号${data.ba_seqno}, ${contentLog.join(';')}` : '', bizApplHeadData.cop_bappl_no);
        } else if (modalStatus === 'add') {
          data.cop_bappl_no = bizApplHeadData.cop_bappl_no;
          operating = this.props.addBizApplDetail(data);
        }
        operating.then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('保存成功');
            this.handleCancel();
          }
        });
      }
    });
  }
  handlePrdtItemNoChange = (value) => {
    const { bizApplHeadData } = this.props;
    if (bizApplHeadData.blbook_no) {
      this.props.getBookGoodsByPrdtItemNo(bizApplHeadData.blbook_no, value)
        .then((result) => {
          if (!result.error) {
            const item = result.data || {};
            item.ba_product_no = item.product_no;
            item.ba_hscode = item.hscode;
            item.ba_name = item.g_name;
            item.ba_model = item.g_model;
            item.ba_qty = item.decl_g_qty;
            item.ba_g_unit = item.g_unit;
            item.ba_unit_1 = item.unit_1;
            item.ba_unit_2 = item.unit_2;
            item.ba_dec_price = item.dec_price;
            item.ba_amount = item.decl_total_amount;
            item.ba_currency = item.currency;
            const itemKeyArray = [
              'ba_product_no', 'ba_hscode', 'ba_name', 'ba_model', 'ba_qty', 'ba_g_unit', 'ba_unit_1',
              'ba_unit_2', 'ba_dec_price', 'ba_amount', 'ba_currency',
            ];
            const itemObj = {};
            itemKeyArray.forEach((itemkey) => {
              if (item[itemkey] !== null && item[itemkey] !== undefined) {
                itemObj[itemkey] = item[itemkey];
              } else {
                itemObj[itemkey] = '';
              }
            });
            this.props.form.setFieldsValue(itemObj);
          }
        });
    }
  }
  handleAmountCalc = (qty, decPrice) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const calcQty = qty || getFieldValue('ba_qty');
    const calcPrice = decPrice || getFieldValue('ba_dec_price');
    const amount = calcQty * calcPrice;
    if (amount) {
      setFieldsValue({
        ba_amount: amount,
      });
    }
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, editInfo, units, currencies, bizApplHeadData,
    } = this.props;
    return (
      <Modal
        width={1200}
        title={this.msg('editBodyGoodsDetail')}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText={this.msg('confirm')}
        onOk={this.handleSaveGoods}
      >
        <Form hideRequiredMark>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.prdt_item_no} {...formItemLayout}>
                {getFieldDecorator('prdt_item_no', {
                  rules: [{ required: true }],
                    initialValue: editInfo && editInfo.prdt_item_no,
                  })(<Input
                    onChange={e => this.handlePrdtItemNoChange(e.target.value)}
                  />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.prdgoods_mark} {...formItemLayout}>
                {getFieldDecorator('prdgoods_mark', {
                    rules: [{ required: true }],
                    initialValue: bizApplHeadData.prdgoods_mark || 'I',
                  })(<Select>
                    <Option value="I" key="I">I-料件/半成品</Option>
                    <Option value="E" key="E">E-成品/残次品</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_seqno} {...formItemLayout}>
                {getFieldDecorator('ba_seqno', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.ba_seqno,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_product_no} {...formItemLayout}>
                {getFieldDecorator('ba_product_no', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.ba_product_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_hscode} {...formItemLayout}>
                {getFieldDecorator('ba_hscode', {
                    initialValue: editInfo && editInfo.ba_hscode,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_name} {...formItemLayout}>
                {getFieldDecorator('ba_name', {
                    initialValue: editInfo && editInfo.ba_name,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_model} {...formItemLayout}>
                {getFieldDecorator('ba_model', {
                    initialValue: editInfo && editInfo.ba_model,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_qty} {...formItemLayout}>
                {getFieldDecorator('ba_qty', {
                    initialValue: editInfo && editInfo.ba_qty,
                  })(<Input type="number" onChange={e => this.handleAmountCalc(e.target.value)} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_g_unit} {...formItemLayout}>
                {getFieldDecorator('ba_g_unit', {
                    initialValue: editInfo && editInfo.ba_g_unit,
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
              <FormItem label={fieldLabelMap.ba_unit_1} {...formItemLayout}>
                {getFieldDecorator('ba_unit_1', {
                    initialValue: editInfo && editInfo.ba_unit_1,
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
              <FormItem label={fieldLabelMap.ba_unit_2} {...formItemLayout}>
                {getFieldDecorator('ba_unit_2', {
                    initialValue: editInfo && editInfo.ba_unit_2,
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
              <FormItem label={this.msg('成品类型')} {...formItemLayout}>
                {getFieldDecorator('prdgoods_type', {
                    initialValue: editInfo && editInfo.prdgoods_type,
                  })(<Select
                    allowClear
                    showSearch
                  >
                    <Option value="1" key="1">1-成品</Option>
                    <Option value="2" key="2">2-残次品</Option>
                    <Option value="3" key="3">3-边角料</Option>
                    <Option value="4" key="4">4-副产品-外发加工专用</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_dec_price} {...formItemLayout}>
                {getFieldDecorator('ba_dec_price', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.ba_dec_price,
                  })(<Input type="number" onChange={e => this.handleAmountCalc(null, e.target.value)} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_amount} {...formItemLayout}>
                {getFieldDecorator('ba_amount', {
                    rules: [{ required: true }],
                    initialValue: editInfo && editInfo.ba_amount,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.ba_currency} {...formItemLayout}>
                {getFieldDecorator('ba_currency', {
                    initialValue: editInfo && editInfo.ba_currency,
                  })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                    {currencies.map(cr => (
                      <Option key={cr.value} value={cr.value} >{cr.value} | {cr.text}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.licence_no} {...formItemLayout}>
                {getFieldDecorator('licence_no', {
                    initialValue: editInfo && editInfo.licence_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.licence_valid_time} {...formItemLayout}>
                {getFieldDecorator('licence_valid_time', {
                    initialValue: editInfo && editInfo.licence_valid_time ?
                      moment(editInfo.licence_valid_time) : null,
                  })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.mod_markcd} {...formItemLayout}>
                {getFieldDecorator('mod_markcd', {
                    rules: [{ required: true }],
                    initialValue: (editInfo && editInfo.mod_markcd) || '3',
                  })(<Select
                    allowClear
                    showSearch
                  >
                    <Option value="3" key="3">增加</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={fieldLabelMap.gds_markcd} {...formItemLayout}>
                {getFieldDecorator('gds_markcd', {
                    initialValue: editInfo && editInfo.gds_markcd,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.gds_remark} {...formItemLayout}>
                {getFieldDecorator('gds_remark', {
                    initialValue: editInfo && editInfo.gds_remark,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={fieldLabelMap.remark} {...formItemLayout}>
                {getFieldDecorator('remark', {
                    initialValue: editInfo && editInfo.remark,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
