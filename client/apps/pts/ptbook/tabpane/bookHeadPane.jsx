import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { DECLARER_COMPANY_TYPE, PTS_E_BOOK_TYPE, PTS_MANUAL_BOOK_TYPE, STAND_BANK, PAUSE_I_E_MARK, BLBOOK_USAGE, PTS_BOOK_TYPE, PARTNER_ROLES } from 'common/constants';
import FormPane from 'client/components/FormPane';
import BlCusSccAutoComplete from '../../../cwm/sasbl/common/blCusSccAutoComplete';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const formItemSpan2Layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  colon: false,
};

@injectIntl
@connect(state => ({
  formData: state.ptsBook.bookData,
  tenantName: state.account.tenantName,
  customsCode: state.account.customsCode,
  tenantCode: state.account.code,
  customs: state.saasParams.latest.customs.map(f => ({
    value: f.customs_code,
    text: f.customs_name,
  })),
  partners: state.partner.partners,
  currencies: state.saasParams.latest.currency.map(curr => ({
    value: curr.curr_code,
    text: curr.curr_name,
  })),
  tradeMode: state.saasParams.latest.tradeMode.map(trd => ({
    value: trd.trade_mode,
    text: trd.trade_abbr,
  })),
  exemptions: state.saasParams.latest.exemptionWay,
}))
export default class PTBookHeadPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
    tenantName: PropTypes.string.isRequired,
    formData: PropTypes.shape({
      cop_manual_no: PropTypes.string,
    }),
  }
  msg = formatMsg(this.props.intl);

  render() {
    const {
      form: { getFieldDecorator }, customsCode,
      customs, partners, currencies, exemptions,
      formData, tenantName, tenantCode, tradeMode,
    } = this.props;
    const isManualBook = !!(formData.blbook_type === PTS_BOOK_TYPE.MBOOK);
    const tenant = {
      customs_code: customsCode,
      name: tenantName,
      uscc_code: tenantCode,
    };
    const amendPartners = partners.map(pt => ({
      customs_code: pt.customs_code,
      name: pt.name,
      uscc_code: pt.partner_unique_code,
    })).concat([tenant]);
    const cusPartners = partners.filter(pt => pt.role === PARTNER_ROLES.CUS).map(pt => ({
      customs_code: pt.customs_code,
      name: pt.name,
      uscc_code: pt.partner_unique_code,
    })).concat([tenant]);
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('preBlbookNo')} {...formItemLayout}>
                {getFieldDecorator('pre_blbook_no', {
                    rules: [{ required: false }],
                    initialValue: formData.pre_blbook_no,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('bookNo')} {...formItemLayout}>
                {getFieldDecorator('blbook_no', {
                    rules: [{ required: !isManualBook }],
                    initialValue: formData.blbook_no,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('copManualNo')} {...formItemLayout}>
                {getFieldDecorator('cop_manual_no', {
                    rules: [{ required: true }],
                    initialValue: formData.cop_manual_no,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={isManualBook ? this.msg('手册类型') : this.msg('账册类型')} {...formItemLayout}>
                {getFieldDecorator('pts_book_type', {
                    rules: [{ required: true }],
                    initialValue: formData.pts_book_type,
                  })(<Select allowClear showSearch optionFilterProp="children">
                    {isManualBook ? PTS_MANUAL_BOOK_TYPE.map(tp =>
                      <Option value={tp.value} key={tp.value}>{tp.text}</Option>) :
                      PTS_E_BOOK_TYPE.map(tp =>
                        <Option value={tp.value} key={tp.value}>{tp.text}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('ownerName')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  formData={formData}
                  rules={[{ required: true }]}
                  cusCodeField="owner_cus_code"
                  sccCodeField="owner_scc_code"
                  nameField="owner_name"
                  dataList={cusPartners}
                  readonly
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('manufcr')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  formData={formData}
                  rules={[{ required: true }]}
                  cusCodeField="manufcr_cus_code"
                  sccCodeField="manufcr_scc_code"
                  nameField="manufcr_name"
                  dataList={cusPartners}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('declarer')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  formData={formData}
                  rules={[{ required: true }]}
                  cusCodeField="declarer_cus_code"
                  sccCodeField="declarer_scc_code"
                  nameField="declarer_name"
                  dataList={amendPartners}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('typing')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  formData={formData}
                  rules={[{ required: true }]}
                  cusCodeField="typing_cus_code"
                  sccCodeField="typing_scc_code"
                  nameField="typing_name"
                  dataList={amendPartners}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('declarerCompanyType')} {...formItemLayout}>
                {getFieldDecorator('declarer_company_type', {
                    rules: [{ required: isManualBook }],
                    initialValue: formData.declarer_company_type,
                  })(<Select
                    optionFilterProp="children"
                    allowClear
                    showSearch
                  >
                    {
                      DECLARER_COMPANY_TYPE.map(tp =>
                        <Option value={tp.value} key={tp.value}>{tp.value} | {tp.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declarerType')} {...formItemLayout}>
                {getFieldDecorator('declarer_type', {
                    rules: [{ required: false }],
                    initialValue: formData.declarer_type,
                  })(<Select
                    allowClear
                    disabled
                  >
                    <Option value="1" key="1">1-备案申请</Option>
                    <Option value="2" key="2">2-变更申请</Option>
                    <Option value="3" key="3">3-注销申请</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('InputDate')} {...formItemLayout}>
                {getFieldDecorator('book_input_date', {
                    rules: [{ required: true }],
                    initialValue: formData.book_input_date && moment(formData.book_input_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={this.msg('approvalno')}>
                {getFieldDecorator('book_approvalno', {
                      rules: [{ required: false }],
                      initialValue: formData.book_approvalno,
                    })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('masterCustoms')} {...formItemLayout}>
                {getFieldDecorator('master_customs', {
                    rules: [{ required: true }],
                    initialValue: formData.master_customs,
                  })(<Select
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {customs.map(cus =>
                      <Option key={cus.value} value={cus.value} >{cus.value} | {cus.text}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_decl_date', {
                    rules: [{ required: false }],
                    initialValue: formData.blbook_decl_date && moment(formData.blbook_decl_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('expirayDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_expiray_date', {
                      rules: [{ required: true }],
                    initialValue: formData.blbook_expiray_date && moment(formData.blbook_expiray_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('uconsumptionDeclCode')} {...formItemLayout}>
                {getFieldDecorator('uconsumption_decl_code', {
                    rules: [{ required: true }],
                    initialValue: formData.uconsumption_decl_code,
                  })(<Select
                    allowClear
                  >
                    <Option value="1" key="1">1-出口前</Option>
                    <Option value="2" key="2">2-核报前</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          {isManualBook ?
            <div>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('manufcrAreaCode')}>
                    {getFieldDecorator('manufcr_area_code', {
                          rules: [{ required: true }], // 手册独有项
                          initialValue: formData.manufcr_area_code,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('impContractNo')}>
                    {getFieldDecorator('imp_contract_no', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.imp_contract_no,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('expContractNo')}>
                    {getFieldDecorator('exp_contract_no', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.exp_contract_no,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('bookTradeMode')}>
                    {getFieldDecorator('book_trade_mode', {
                          rules: [{ required: true }], // 手册独有项
                          initialValue: formData.book_trade_mode,
                        })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                          {tradeMode.map(ep => (
                            <Option
                              key={ep.value}
                              value={ep.value}
                            >{ep.value} | {ep.text}</Option>))}
                        </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('impCurrency')}>
                    {getFieldDecorator('imp_currency', {
                        rules: [{ required: true }], // 手册独有项
                        initialValue: formData.imp_currency,
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
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('expCurrency')}>
                    {getFieldDecorator('exp_currency', {
                        rules: [{ required: true }], // 手册独有项
                        initialValue: formData.exp_currency,
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
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('remissionMode')}>
                    {getFieldDecorator('remission_mode', {
                          rules: [{ required: true }], // 手册独有项
                          initialValue: formData.remission_mode,
                        })(<Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                          {exemptions.map(ep => (
                            <Option
                              key={ep.value}
                              value={ep.value}
                            >{ep.value} | {ep.text}</Option>))}
                        </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('processType')}>
                    {getFieldDecorator('process_type', {
                          rules: [{ required: true }], // 手册独有项
                          initialValue: formData.process_type,
                        })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('iEPort')}>
                    {getFieldDecorator('i_e_port', {
                        rules: [{ required: true }], // 手册独有项
                        initialValue: formData.i_e_port,
                    })(<Select
                      showSearch
                      showArrow
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      {customs.map(cr => (
                        <Option key={cr.value} value={cr.value} >{cr.value} | {cr.text}</Option>))}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('standBank')}>
                    {getFieldDecorator('stand_bank', {
                        rules: [{ required: true }], // 手册独有项
                        initialValue: formData.stand_bank,
                    })(<Select
                      showArrow
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      {STAND_BANK.map(cr => (
                        <Option key={cr.value} value={cr.value} >{cr.value} | {cr.text}</Option>))}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('declSource')}>
                    {getFieldDecorator('decl_source', {
                          rules: [{ required: true }], // 手册独有项
                          initialValue: formData.decl_source,
                        })(<Select
                          showArrow
                          optionFilterProp="children"
                          style={{ width: '100%' }}
                        >
                          <Option key="1" value="1" >1-电子口岸申报</Option>
                        </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('processRatio')}>
                    {getFieldDecorator('process_ratio', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.process_ratio,
                        })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('pauseIEMark')}>
                    {getFieldDecorator('pause_i_e_mark', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.pause_i_e_mark,
                        })(<Select
                          showArrow
                          optionFilterProp="children"
                          style={{ width: '100%' }}
                        >
                          {PAUSE_I_E_MARK.map(cr => (
                            <Option
                              key={cr.value}
                              value={cr.value}
                            >{cr.value} | {cr.text}</Option>))}
                        </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('blbookContact')}>
                    {getFieldDecorator('blbook_contact', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.blbook_contact,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('blbookTel')}>
                    {getFieldDecorator('blbook_tel', {
                          rules: [{ required: false }], // 手册独有项
                          initialValue: formData.blbook_tel,
                        })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </div> :
            <div>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('netwkArchivesNo')}>
                    {getFieldDecorator('netwk_archives_no', {
                          rules: [{ required: !isManualBook }], // 账册独有项
                          initialValue: formData.netwk_archives_no,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('impTotalAmount')}>
                    {getFieldDecorator('imp_total_amount', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.imp_total_amount,
                        })(<Input type="number" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('expTotalAmount')}>
                    {getFieldDecorator('exp_total_amount', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.exp_total_amount,
                        })(<Input type="number" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('maxTurnoverAmount')}>
                    {getFieldDecorator('max_turnover_amount', {
                          rules: [{ required: true }], // 账册独有项
                          initialValue: formData.max_turnover_amount,
                        })(<Input addonAfter="万美元" type="number" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('materialsCount')}>
                    {getFieldDecorator('materials_count', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.materials_count,
                        })(<Input type="number" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('endproductCount')}>
                    {getFieldDecorator('endproduct_count', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.endproduct_count,
                        })(<Input type="number" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={this.msg('lastWrittenoffDate')} {...formItemLayout}>
                    {getFieldDecorator('last_writtenoff_date', {
                        rules: [{ required: false }], // 账册独有项
                        initialValue: formData.last_writtenoff_date && moment(formData.last_writtenoff_date, 'YYYY/MM/DD'),
                      })(<DatePicker style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={this.msg('ucnsVersionMark')} {...formItemLayout}>
                    {getFieldDecorator('ucns_version_mark', {
                        rules: [{ required: false }], // 账册独有项
                        initialValue: formData.ucns_version_mark,
                      })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('maxImpAmount')}>
                    {getFieldDecorator('max_imp_amount', {
                          rules: [{ required: true }], // 账册独有项
                          initialValue: formData.max_imp_amount,
                        })(<Input addonAfter="美元" type="number" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={this.msg('writtenoffCycle')} {...formItemLayout}>
                    {getFieldDecorator('writtenoff_cycle', {
                        rules: [{ required: true }], // 账册独有项
                        initialValue: formData.writtenoff_cycle,
                      })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={this.msg('writtenoffType')} {...formItemLayout}>
                    {getFieldDecorator('writtenoff_type', {
                        rules: [{ required: false }], // 账册独有项
                        initialValue: formData.writtenoff_type,
                      })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('modifyTimes')}>
                    {getFieldDecorator('modify_times', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.modify_times,
                        })(<Input type="number" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem label={this.msg('approvedDate')} {...formItemLayout}>
                    {getFieldDecorator('blbook_approved_date', {
                          rules: [{ required: false }], // 账册独有项
                        initialValue: formData.blbook_approved_date && moment(formData.blbook_approved_date, 'YYYY/MM/DD'),
                      })(<DatePicker style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={this.msg('alterDate')} {...formItemLayout}>
                    {getFieldDecorator('blbook_alter_date', {
                          rules: [{ required: false }], // 账册独有项
                        initialValue: formData.blbook_alter_date && moment(formData.blbook_alter_date, 'YYYY/MM/DD'),
                      })(<DatePicker style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('bookExecFlag')}>
                    {getFieldDecorator('book_exec_flag', {
                          rules: [{ required: false }], // 账册独有项
                          initialValue: formData.book_exec_flag,
                        })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('bookUsage')}>
                    {getFieldDecorator('blbook_usage', {
                          rules: [{ required: !isManualBook }], // 账册独有项
                          initialValue: formData.blbook_usage,
                        })(<Select
                          allowClear
                        >
                          {BLBOOK_USAGE.map(cr => (
                            <Option
                              key={cr.value}
                              value={cr.value}
                            >{cr.value} | {cr.text}</Option>))}
                        </Select>)}
                  </FormItem>
                </Col>
              </Row>
            </div>}
          <Row>
            <Col span={6}>
              <FormItem {...formItemLayout} label={this.msg('remark')}>
                {getFieldDecorator('blbook_note', {
                      rules: [{ required: false }],
                      initialValue: formData.blbook_note,
                    })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
