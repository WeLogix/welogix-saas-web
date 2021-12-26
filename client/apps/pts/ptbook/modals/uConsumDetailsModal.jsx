import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Modal, Form, Row, Col, Input, Select, DatePicker, message } from 'antd';
import { updateBookUConsum, createBookUConsum } from 'common/reducers/ptsBook';
import { PTS_BOOK_TYPE, MODIFY_MARK } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};
function createFieldLabelMap(msg) {
  fieldLabelMap.uconsumption_qty = msg('uconsumptionQty');
  fieldLabelMap.uconsumption_no = msg('uconsumptionNo');
  fieldLabelMap.net_use_qty = msg('netUseQty');
  fieldLabelMap.tangible_loss_rate = msg('tangibleLossRate');
  fieldLabelMap.intangible_loss_rate = msg('intangibleLossRate');
  fieldLabelMap.uconsum_decl_status = msg('uconsumDeclStatus');
  fieldLabelMap.uconsum_expiry_date = msg('uconsumExpiryDate');
  fieldLabelMap.modify_mark = msg('modifyMark');
  fieldLabelMap.uconsum_remark = msg('remark');
  fieldLabelMap.uconsum_exec_flag = msg('uconsumExecFlag');
  fieldLabelMap.bond_materials_rate = msg('bondMaterialsRate');
}

@injectIntl
@connect(
  state => ({
    bookHead: state.ptsBook.bookData,
  }),
  {
    updateBookUConsum, createBookUConsum,
  }
)
@Form.create()
export default class UConsumDetailsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
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
          mode, editInfo, bookHead,
        } = this.props;
        const editForm = this.props.form.getFieldsValue();
        const data = {
          book_no: bookHead.blbook_no,
          pre_blbook_no: bookHead.pre_blbook_no,
          goods_seqno: editForm.goods_seqno,
          end_product_seq_no: editForm.end_product_seq_no,
          end_product_no: editForm.end_product_no,
          end_product_hscode: editForm.end_product_hscode,
          end_product_name: editForm.end_product_name,
          materials_seq_no: editForm.materials_seq_no,
          materials_product_no: editForm.materials_product_no,
          materials_hscode: editForm.materials_hscode,
          materials_name: editForm.materials_name,
          uconsumption_no: editForm.uconsumption_no,
          uconsumption_qty: editForm.uconsumption_qty,
          net_use_qty: editForm.net_use_qty,
          tangible_loss_rate: editForm.tangible_loss_rate,
          intangible_loss_rate: editForm.intangible_loss_rate,
          uconsum_decl_status: editForm.uconsum_decl_status,
          uconsum_expiry_date: editForm.uconsum_expiry_date,
          modify_mark: editForm.modify_mark,
          bond_materials_rate: editForm.bond_materials_rate,
          uconsum_exec_flag: editForm.uconsum_exec_flag,
          uconsum_remark: editForm.uconsum_remark,
        };
        if (mode === 'create') {
          this.props.createBookUConsum(data).then((result) => { // 新建
            if (result.error) {
              let errorInfo = result.error.message;
              if (result.error.message === 'repeat') {
                errorInfo = '该序号已存在';
              } else if (result.error.message === 'none') {
                errorInfo = '该料件与成品不存在';
              } else if (result.error.message === 'noMaterails') {
                errorInfo = '该料件不存在';
              } else if (result.error.message === 'noEndProduct') {
                errorInfo = '该成品不存在';
              }
              message.error(errorInfo, 10);
            } else {
              message.success(this.msg('savedSucceed'));
              this.handleCancel();
            }
          });
        } else {
          const fields = Object.keys(editForm);
          ['tangible_loss_rate', 'intangible_loss_rate', 'bond_materials_rate'].forEach((field) => {
            const fieldNumVal = Number(editForm[field]);
            if (!Number.isNaN(fieldNumVal)) {
              editForm[field] = fieldNumVal;
            } else {
              editForm[field] = '';
            }
          });
          ['uconsum_expiry_date'].forEach((field) => {
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
              if (field === 'uconsum_exec_flag') {
                if (editForm[field] === '1') {
                  contentLog.push(`"${fieldLabelMap[field]}"由 停用 改为 运行}]`);
                } else {
                  contentLog.push(`"${fieldLabelMap[field]}"由 运行 改为 停用}]`);
                }
              } else {
                contentLog.push(`"${fieldLabelMap[field]}"由 [${editInfo[field] || ''}] 改为 [${editForm[field] || ''}]`);
              }
            }
          }
          data.id = editInfo.id;
          this.props.updateBookUConsum(data, contentLog).then((result) => { // 修改
            if (result.error) {
              let errorInfo = result.error.message;
              if (result.error.message === 'repeat') {
                errorInfo = '该序号已存在';
              } else if (result.error.message === 'none') {
                errorInfo = '该料件与成品不存在';
              } else if (result.error.message === 'noMaterails') {
                errorInfo = '该料件不存在';
              } else if (result.error.message === 'noEndProduct') {
                errorInfo = '该成品不存在';
              }
              message.error(errorInfo, 10);
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
      visible, form: { getFieldDecorator }, mode, editInfo, bookHead,
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
        title={isNew ? '新建单耗' : '修改单耗'}
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
                {getFieldDecorator('goods_seqno', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.goods_seqno,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('endProductSeqNo')} {...formItemLayout}>
                {getFieldDecorator('end_product_seq_no', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.end_product_seq_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('endProductNo')} {...formItemLayout}>
                {getFieldDecorator('end_product_no', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.end_product_no,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('endProductHscode')} {...formItemLayout}>
                {getFieldDecorator('end_product_hscode', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.end_product_hscode,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('endProductName')} {...formItemLayout}>
                {getFieldDecorator('end_product_name', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.end_product_name,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('materialsSeqNo')} {...formItemLayout}>
                {getFieldDecorator('materials_seq_no', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.materials_seq_no,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('materialsProductNo')} {...formItemLayout}>
                {getFieldDecorator('materials_product_no', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.materials_product_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('materialsHscode')} {...formItemLayout}>
                {getFieldDecorator('materials_hscode', {
                  rules: [{ required: false }],
                  initialValue: goodsInfo && goodsInfo.materials_hscode,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('materialsName')} {...formItemLayout}>
                {getFieldDecorator('materials_name', {
                  rules: [{ required: !isManualBook }],
                  initialValue: goodsInfo && goodsInfo.materials_name,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('uconsumptionNo')} {...formItemLayout}>
                {getFieldDecorator('uconsumption_no', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.uconsumption_no,
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('uconsumptionQty')} {...formItemLayout}>
                {getFieldDecorator('uconsumption_qty', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.uconsumption_qty,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('netUseQty')} {...formItemLayout}>
                {getFieldDecorator('net_use_qty', {
                  rules: [{ required: isManualBook }],
                  initialValue: goodsInfo && goodsInfo.net_use_qty,
                  })(<Input type="number" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('tangibleLossRate')} {...formItemLayout}>
                {getFieldDecorator('tangible_loss_rate', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.tangible_loss_rate,
                  })(<Input addonAfter="%" type="number" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('intangibleLossRate')} {...formItemLayout}>
                {getFieldDecorator('intangible_loss_rate', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.intangible_loss_rate,
                  })(<Input addonAfter="%" type="number" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('uconsumDeclStatus')} {...formItemLayout}>
                {getFieldDecorator('uconsum_decl_status', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.uconsum_decl_status,
                  })(<Select
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    <Option value="1" key="1">1-未申报</Option>
                    <Option value="2" key="2">2-已申报</Option>
                    <Option value="3" key="3">3-已确定</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {isManualBook ?
              <Col span={8}>
                <FormItem label={this.msg('uconsumExecFlag')} {...formItemLayout}>
                  {getFieldDecorator('uconsum_exec_flag', {
                    rules: [{ required: true }],
                    initialValue: goodsInfo && goodsInfo.uconsum_exec_flag,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      allowClear
                    >
                      <Option value="1" key="1">1-运行</Option>
                      <Option value="2" key="2">2-停用</Option>
                    </Select>)}
                </FormItem>
              </Col> :
              <Col span={8}>
                <FormItem label={this.msg('uconsumExpiryDate')} {...formItemLayout}>
                  {getFieldDecorator('uconsum_expiry_date', {
                    rules: [{ required: false }],
                    initialValue: goodsInfo && goodsInfo.uconsum_expiry_date && moment(goodsInfo.uconsum_expiry_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>}
            <Col span={8}>
              <FormItem label={this.msg('modifyMark')} {...formItemLayout}>
                {getFieldDecorator('modify_mark', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.modify_mark,
                  })(<Select
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {MODIFY_MARK.map(mk =>
                      (<Option value={mk.value} key={mk.value}>{mk.text}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('bondMaterialsRate')} {...formItemLayout}>
                {getFieldDecorator('bond_materials_rate', {
                  rules: [{ required: true }],
                  initialValue: goodsInfo && goodsInfo.bond_materials_rate,
                  })(<Input addonAfter="%" type="number" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {!isManualBook &&
              <Col span={8}>
                <FormItem label={this.msg('modifyTimes')} {...formItemLayout}>
                  {getFieldDecorator('modify_times', {
                      rules: [{ required: false }],
                      initialValue: goodsInfo && goodsInfo.modify_times,
                    })(<Input />)}
                </FormItem>
              </Col>
            }
            <Col span={8}>
              <FormItem label={this.msg('remark')} {...formItemLayout}>
                {getFieldDecorator('uconsum_remark', {
                    rules: [{ required: false }],
                    initialValue: goodsInfo && goodsInfo.uconsum_remark,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
