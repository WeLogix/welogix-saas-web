import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { BLBOOK_TYPE, BLBOOK_PAUSE_MARK, SASBL_BWL_TYPE, DECLARER_COMPANY_TYPE } from 'common/constants';
import FormPane from 'client/components/FormPane';
import BlCusSccAutoComplete from '../../common/blCusSccAutoComplete';
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
  formData: state.cwmBlBook.blBookData,
  tenantName: state.account.tenantName,
  customsCode: state.account.customsCode,
  tenantCode: state.account.code,
  customs: state.saasParams.latest.customs,
  brokers: state.cwmContext.whseAttrs.brokers,
  ikBlBooks: state.cwmBlBook.blBooksByType,
}))
export default class BLBookHeadPane extends React.Component {
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
      form: { getFieldDecorator, getFieldValue }, customsCode,
      customs, brokers, formData, readonly, tenantName, tenantCode,
    } = this.props;
    const isTwLBook = formData.blbook_type === 'TW' || formData.blbook_type === 'L';
    const isLiquidWhse = (getFieldValue('bwl_type') || formData.bwl_type) === 'E'; // 液体仓库
    const isChangeType = getFieldValue('declarer_type') === '2'; // 变更申请
    const amendbrokers = brokers.concat({
      customs_code: customsCode,
      name: tenantName,
      uscc_code: tenantCode,
    });
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('preBlbookNo')} {...formItemLayout}>
                {getFieldDecorator('pre_blbook_no', {
                    rules: [{ required: false }],
                    initialValue: formData.pre_blbook_no,
                  })(<Input disabled={!isChangeType} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookNo')} {...formItemLayout}>
                {getFieldDecorator('blbook_no', {
                    rules: [{ required: false }],
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
              <FormItem label={this.msg('declarerType')} {...formItemLayout}>
                {getFieldDecorator('declarer_type', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.declarer_type || (isTwLBook ? 1 : null),
                  })(<Select
                    disabled={!isTwLBook || readonly}
                    allowClear
                  >
                    <Option value="1" key="1">1|备案申请</Option>
                    <Option value="2" key="2">2|变更申请</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('owner')}
                required
              >
                <Row gutter={2}>
                  <Col span={6}>
                    {getFieldDecorator('owner_cus_code', {
                      rules: [{ required: true }],
                      initialValue: formData.owner_cus_code,
                    })(<Input disabled placeholder={this.msg('cusCode')} />)}
                  </Col>
                  <Col span={8}>
                    {getFieldDecorator('owner_scc_code', {
                      rules: [{ required: true }],
                      initialValue: formData.owner_scc_code,
                    })(<Input disabled placeholder={this.msg('sccCode')} />)}
                  </Col>
                  <Col span={10}>
                    {getFieldDecorator('owner_name', {
                      rules: [{ required: true }],
                      initialValue: formData.owner_name,
                    })(<Input disabled placeholder={this.msg('ownerName')} />)}
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('masterCustoms')} {...formItemLayout}>
                {getFieldDecorator('master_customs', {
                    rules: [{ required: true }],
                    initialValue: formData.master_customs,
                  })(<Select
                    disabled={readonly}
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
                  >
                    {customs.map(cus => <Option value={cus.customs_code} key={cus.customs_code}>{`${cus.customs_code}|${cus.customs_name}`}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookType')} {...formItemLayout}>
                {getFieldDecorator('blbook_type', {
                    rules: [{ required: true }],
                    initialValue: formData.blbook_type,
                  })(<Select allowClear showSearch disabled optionFilterProp="children">
                    {
                      BLBOOK_TYPE.map(bk =>
                        <Option value={bk.value} key={bk.value}>{bk.text}</Option>)
                    }
                  </Select>)}
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
                  readonly={readonly}
                  cusCodeField="declarer_cus_code"
                  sccCodeField="declarer_scc_code"
                  nameField="declarer_name"
                  dataList={amendbrokers}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declarerCompanyType')} {...formItemLayout}>
                {getFieldDecorator('declarer_company_type', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.declarer_company_type,
                  })(<Select
                    disabled={readonly}
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
              <FormItem label={this.msg('账册执行标志')} {...formItemLayout}>
                {getFieldDecorator('pause_chg_mark', {
                    initialValue: formData.pause_chg_mark,
                  })(<Select
                    disabled
                    optionFilterProp="children"
                    allowClear
                    showSearch
                  >
                    {
                      BLBOOK_PAUSE_MARK.map(mark =>
                        (<Option
                          value={mark.value}
                          key={mark.value}
                        >
                          {mark.value} | {mark.text}
                        </Option>))
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('bwlType')} {...formItemLayout}>
                {getFieldDecorator('bwl_type', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.bwl_type,
                  })(<Select
                    disabled={readonly}
                    optionFilterProp="children"
                    allowClear
                    showSearch
                  >
                    {
                      SASBL_BWL_TYPE.map(st =>
                        <Option value={st.value} key={st.value}>{st.value} | {st.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label={this.msg('ftzWhseCode')}
                required
              >
                {getFieldDecorator('ftz_whse_code', {
                      rules: [{ required: true }],
                      initialValue: formData.ftz_whse_code,
                    })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label={this.msg('warehouseName')}
                required
              >

                {getFieldDecorator('whse_name', {
                      rules: [{ required: true }],
                      initialValue: formData.whse_name,
                    })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label={this.msg('businessType')} {...formItemLayout}>
                {getFieldDecorator('business_type', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.business_type,
                  })(<Select
                    disabled={readonly}
                    optionFilterProp="children"
                    allowClear
                    showSearch
                  >
                    {
                      SASBL_BWL_TYPE.map(st =>
                        <Option value={st.value} key={st.value}>{st.value} | {st.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('warehouseAddress')}
                required
              >
                {getFieldDecorator('warehouse_address', {
                  rules: [{ required: true }],
                  initialValue: formData.whse_address,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('warehouseArea')} {...formItemLayout}>
                {getFieldDecorator('whse_area', {
                    rules: [{ required: !isLiquidWhse }],
                    initialValue: formData.whse_area,
                  })(<Input disabled={readonly} addonAfter="平方米" type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('warehouseVol')} {...formItemLayout}>
                {getFieldDecorator('whse_vol', {
                    rules: [{ required: isLiquidWhse }],
                    initialValue: formData.whse_vol,
                  })(<Input disabled={readonly} addonAfter="立方米" type="number" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('contact')} {...formItemLayout}>
                {getFieldDecorator('blbook_contact', {
                    rules: [{ required: true }],
                    initialValue: formData.blbook_contact,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('userOrgTel')} {...formItemLayout}>
                {getFieldDecorator('blbook_tel', {
                    rules: [{ required: true }],
                    initialValue: formData.blbook_tel,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookAccounting')} {...formItemLayout}>
                {getFieldDecorator('blbook_accounting', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.blbook_accounting,
                  })(<Select
                    disabled={readonly}
                    allowClear
                    showSearch
                  >
                    <Option value="1" key="1">1 | 可累计</Option>
                    <Option value="2" key="2">2 | 不累计</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookTaxRebate')} {...formItemLayout}>
                {getFieldDecorator('blbook_tax_rebate', {
                    initialValue: formData.blbook_tax_rebate,
                  })(<Select
                    disabled={readonly}
                    allowClear
                    showSearch
                  >
                    <Option value="1" key="1" >1 | 是</Option>
                    <Option value="2" key="2" >2 | 否</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('blbookDeclDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_decl_date', {
                    initialValue: formData.blbook_decl_date && moment(formData.blbook_decl_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookApprovedDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_approved_date', {
                    initialValue: formData.blbook_approved_date && moment(formData.blbook_approved_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookAlterDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_alter_date', {
                    initialValue: formData.blbook_alter_date && moment(formData.blbook_alter_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookExpirayDate')} {...formItemLayout}>
                {getFieldDecorator('blbook_expiray_date', {
                    rules: [{ required: isTwLBook }],
                    initialValue: formData.blbook_expiray_date && moment(formData.blbook_expiray_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('inputter')}
              >
                <Row gutter={8}>
                  <Col span={6}>
                    {getFieldDecorator('inputter_cus_code', {
                      initialValue: formData.inputter_cus_code,
                    })(<Input placeholder={this.msg('inputterCusCode')} disabled />)}
                  </Col>
                  <Col span={8}>
                    {getFieldDecorator('inputter_scc_code', {
                      initialValue: formData.inputter_scc_code,
                    })(<Input placeholder={this.msg('inputterSccCode')} disabled />)}
                  </Col>
                  <Col span={10}>
                    {getFieldDecorator('inputter_name', {
                      initialValue: formData.inputter_name,
                    })(<Input placeholder={this.msg('inputterName')} disabled />)}
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookUsage')} {...formItemLayout}>
                {getFieldDecorator('blbook_usage', {
                    rules: [{ required: false }],
                    initialValue: formData.blbook_usage,
                  })(<Select
                    disabled={readonly}
                    optionFilterProp="children"
                    allowClear
                    showSearch
                  >
                    <Option value="1" key="1">1 | 一般纳税人</Option>
                    <Option value="2" key="2">2 | 特殊行业</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('remark')} {...formItemLayout}>
                {getFieldDecorator('blbook_note', {
                    initialValue: formData.blbook_note,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
