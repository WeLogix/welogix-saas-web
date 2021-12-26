import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { BOND_INVT_TYPE, LIST_TYPE, SASBL_DECL_TYPE } from 'common/constants';
import FormPane from 'client/components/FormPane';
import { searchDeclareCodeList, loadRegisteredBlBooks } from 'common/reducers/cwmBlBook';
import BlCusSccAutoComplete from '../../common/blCusSccAutoComplete';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const autoCompItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  colon: false,
};
@injectIntl
@connect(
  state => ({
    tenantName: state.account.tenantName,
    customsCode: state.account.customsCode,
    tenantCode: state.account.code,
    whseCode: state.cwmContext.defaultWhse.code,
    brokers: state.cwmContext.whseAttrs.brokers,
    formParams: state.saasParams.latest,
    blBookList: state.cwmBlBook.registeredBlBookList,
    invtData: state.cwmSasblReg.invtData,
  }),
  { searchDeclareCodeList, loadRegisteredBlBooks }
)

export default class InventoryRegHeadPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
    tenantName: PropTypes.string.isRequired,
    formData: PropTypes.shape({
      cop_invt_no: PropTypes.string,
    }),
  }
  componentDidMount() {
    const { whseCode } = this.props;
    if (whseCode) {
      this.props.loadRegisteredBlBooks(whseCode);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whseCode && this.props.whseCode !== nextProps.whseCode) {
      this.props.loadRegisteredBlBooks(nextProps.whseCode);
    }
  }
  handleBlbookSelect = (value) => {
    const { form: { setFieldsValue }, blBookList } = this.props;
    const blbook = blBookList.find(bk => bk.blbook_no === value);
    if (blbook) {
      setFieldsValue({
        manufcr_cus_code: blbook.ftz_whse_code,
        manufcr_name: blbook.whse_name,
        owner_cus_code: blbook.owner_cus_code,
        owner_scc_code: blbook.owner_scc_code,
        owner_name: blbook.owner_name,
      });
    }
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, customsCode, tenantCode, tenantName,
      brokers, blBookList, readonly,
      formParams: {
        tradeMode, customs, transMode, country,
      },
    } = this.props;
    const isdeclare = Number(getFieldValue('cusdecl_flag')) === 1;// 报关类型是“报关”
    const isRelEntry = Number(getFieldValue('cusdecl_type')) === 1; // 报关单类型是“关联报关”
    const formData = this.props.invtData || {};
    const invtTradeMode = [{
      trade_mode: 'AAAA',
      trade_abbr: 'AAAA',
    }, {
      trade_mode: 'BBBB',
      trade_abbr: 'BBBB',
    }];
    const agentCompList = brokers.concat({
      customs_code: customsCode,
      uscc_code: tenantCode,
      name: tenantName,
    });
    return (
      <FormPane hideRequiredMark>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('preSasblSeqno')} {...formItemLayout}>
                {getFieldDecorator('pre_sasbl_seqno', {
                    rules: [{ required: false }],
                    initialValue: formData.pre_sasbl_seqno,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('invtNo')} {...formItemLayout}>
                {getFieldDecorator('invt_no', {
                    rules: [{ required: false }],
                    initialValue: formData.invt_no,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('copNo')} {...formItemLayout}>
                {getFieldDecorator('cop_invt_no', {
                    rules: [{ required: true }],
                    initialValue: formData.cop_invt_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookNo')} {...formItemLayout}>
                {getFieldDecorator('blbook_no', {
                    rules: [{ required: true }],
                    initialValue: formData.blbook_no,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                    onSelect={this.handleBlbookSelect}
                  >
                    {
                      blBookList.map(bk =>
                        <Option value={bk.blbook_no} key={bk.blbook_no}>{bk.blbook_no}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('owner')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: true }]}
                  readonly
                  cusCodeField="owner_cus_code"
                  sccCodeField="owner_scc_code"
                  nameField="owner_name"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('manufcr')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  readonly
                  cusCodeField="manufcr_cus_code"
                  sccCodeField="manufcr_scc_code"
                  nameField="manufcr_name"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('declarer')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: true }]}
                  readonly={readonly}
                  cusCodeField="declarer_cus_code"
                  sccCodeField="declarer_scc_code"
                  nameField="declarer_name"
                  dataList={agentCompList}
                  formData={formData}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('typing')}
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: true }]}
                  readonly={readonly}
                  cusCodeField="typing_cus_code"
                  sccCodeField="typing_scc_code"
                  nameField="typing_name"
                  formData={formData}
                  dataList={agentCompList}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('invtBiztype')} {...formItemLayout}>
                {getFieldDecorator('invt_biztype', {
                    rules: [{ required: true }],
                    initialValue: formData.invt_biztype,
                  })(<Select
                    disabled={readonly}
                    allowClear
                  >
                    {BOND_INVT_TYPE.map(invt =>
                      <Option value={invt.value} key={invt.value}>{invt.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('prdgoodsMark')} {...formItemLayout}>
                {getFieldDecorator('prdgoods_mark', {
                    rules: [{ required: true }],
                    initialValue: formData.prdgoods_mark,
                  })(<Select
                    disabled={readonly}
                    allowClear
                  >
                    <Option value="I" key="I">I|料件</Option>
                    <Option value="E" key="E">E|成品</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('typingDate')} {...formItemLayout}>
                {getFieldDecorator('created_date', {
                    rules: [{ required: true }],
                    initialValue: formData.created_date && moment(formData.created_date, 'YYYY/MM/DD'),
                })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('invtDeclDate')} {...formItemLayout}>
                {getFieldDecorator('invt_decl_date', {
                    rules: [{ required: false }],
                    initialValue: formData.invt_decl_date && moment(formData.invt_decl_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('tradeMode')} {...formItemLayout}>
                {getFieldDecorator('trade_mode', {
                    rules: [{ required: true }],
                    initialValue: formData.trade_mode,
                  })(<Select
                    disabled={readonly}
                    showSearch
                    showArrow
                    allowClear
                  >
                    {
                      tradeMode.concat(invtTradeMode).map(opt => (
                        <Option key={opt.trade_mode} value={opt.trade_mode}>
                          {opt.trade_mode}|{opt.trade_abbr}
                        </Option>))
                  }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('trafMode')} {...formItemLayout}>
                {getFieldDecorator('traf_mode', {
                    rules: [{ required: true }],
                    initialValue: formData.traf_mode,
                  })(<Select
                    disabled={readonly}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {
                      transMode.map(tsm => (
                        <Option key={tsm.trans_code} value={tsm.trans_code}>
                          {tsm.trans_code}|{tsm.trans_spec}
                        </Option>))
                  }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('iEPort')} {...formItemLayout}>
                {getFieldDecorator('i_e_port', {
                    rules: [{ required: true }],
                    initialValue: formData.i_e_port,
                })(<Select
                  disabled={readonly}
                  showSearch
                  optionFilterProp="children"
                  showArrow
                  allowClear
                >
                  {
                    customs.map(opt => (
                      <Option key={opt.customs_code} value={opt.customs_code}>
                        {opt.customs_code}|{opt.customs_name}
                      </Option>))
                }
                </Select>)}
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
                    {customs.map(cus => (<Option value={cus.customs_code} key={cus.customs_code}>
                      {cus.customs_code}|{cus.customs_name}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('deptDestCountry')} {...formItemLayout}>
                {getFieldDecorator('dept_dest_country', {
                    rules: [{ required: true }],
                    initialValue: formData.dept_dest_country,
                  })(<Select
                    disabled={readonly}
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
              <FormItem label={this.msg('listType')} {...formItemLayout}>
                {getFieldDecorator('list_type', {
                    rules: [{ required: false }],
                    initialValue: formData.list_type,
                  })(<Select
                    disabled={readonly}
                    allowClear
                  >
                    {
                    LIST_TYPE.map(type => (
                      <Option key={type.value} value={type.value}>
                        {type.value}|{type.text}
                      </Option>))
                }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('invtIochkptStucd')} {...formItemLayout}>
                {getFieldDecorator('invt_iochkpt_stucd', { // 预留字段（数据库不存在）
                    rules: [{ required: false }],
                    initialValue: formData.invt_iochkpt_stucd,
                })(<Select
                  disabled
                  allowClear
                >
                  <Option value="1" key="1">1-已过卡</Option>
                  <Option value="1" key="1">1-未过卡</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('verifyFlag')} {...formItemLayout}>
                {getFieldDecorator('verify_flag', {
                    rules: [{ required: false }],
                    initialValue: formData.verify_flag,
                  })(<Select
                    disabled
                    allowClear
                  >
                    <Option value={1} key={1}>1|未核扣</Option>
                    <Option value={2} key={2}>2|预核扣</Option>
                    <Option value={3} key={3}>3|已核扣</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('cusdeclFlag')} {...formItemLayout}>
                {getFieldDecorator('cusdecl_flag', {
                    rules: [{ required: true }],
                    initialValue: formData.cusdecl_flag,
                  })(<Select
                    disabled={readonly}
                    allowClear
                  >
                    <Option value={1} key={1}>1|报关</Option>
                    <Option value={2} key={2}>2|非报关</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('cusdeclType')} {...formItemLayout}>
                {getFieldDecorator('cusdecl_type', {
                    rules: [{ required: false }],
                    initialValue: formData.cusdecl_type,
                  })(<Select
                    disabled={readonly || (!isdeclare)}
                    allowClear
                  >
                    <Option value="1" key="1">1|关联报关</Option>
                    <Option value="2" key="2">2|对应报关</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('entryType')} {...formItemLayout}>
                {getFieldDecorator('entry_type', {
                    rules: [{ required: true }],
                    initialValue: formData.entry_type,
                })(<Select
                  disabled={readonly || (!isdeclare)}
                  showSearch
                  showArrow
                  optionFilterProp="children"
                  allowClear
                >
                  {
                  SASBL_DECL_TYPE.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.value}|{type.text}
                    </Option>))
              }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sasblApplyNo')} {...formItemLayout}>
                {getFieldDecorator('sasbl_apply_no', {
                    rules: [{ required: false }],
                    initialValue: formData.sasbl_apply_no,
                  })(<Select
                    disabled={readonly}
                    allowClear
                  >
                    <Option value="1" key="1">1|暂留</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('entryStatus')} {...formItemLayout}>
                {getFieldDecorator('entry_status', {
                    rules: [{ required: false }],
                    initialValue: formData.entry_status,
                  })(<Select
                    disabled
                    allowClear
                  >
                    <Option value={0} key={0}>0|未放行</Option>
                    <Option value={1} key={1}>1|已放行</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('entryNo')} {...formItemLayout}>
                {getFieldDecorator('entry_no', {
                    rules: [{ required: false }],
                    initialValue: formData.entry_no,
                  })(<Input disabled={readonly || (!isdeclare || isRelEntry)} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('corrEntryDeclarer')} // 预留字段（核注清单表中不存在）
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: false }]}
                  readonly={readonly || (!isdeclare || isRelEntry)}
                  cusCodeField="corr_entry_dcl_etpsno"
                  sccCodeField="corr_entry_dcl_etps_sccd"
                  nameField="corr_entry_dcl_etpsnm"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('entryDeclDate')} {...formItemLayout}>
                {getFieldDecorator('entry_decl_date', {
                    rules: [{ required: false }],
                    initialValue: formData.entry_decl_date && moment(formData.entry_decl_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('rltEntryNo')} {...formItemLayout}>
                {getFieldDecorator('rlt_entry_no', {
                    rules: [{ required: false }],
                    initialValue: formData.rlt_entry_no,
                  })(<Input disabled={readonly || (!isdeclare || !isRelEntry)} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('rltEntryDeclarer')} // 预留字段（核注清单表中不存在）
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: false }]}
                  readonly={readonly || (!isdeclare || !isRelEntry)}
                  cusCodeField="rlt_entry_dcl_etpsno"
                  sccCodeField="rlt_entry_dcl_etps_sccd"
                  nameField="rlt_entry_dcl_etpsnm"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('rltEntryReceive')} // 预留字段（核注清单表中不存在）
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: false }]}
                  readonly={readonly || (!isdeclare || !isRelEntry)}
                  cusCodeField="rlt_entry_rcvgd_etpsno"
                  sccCodeField="rlt_entry_rcvgd_etps_sccd"
                  nameField="rlt_entry_rcvgd_etps_nm"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={formData.invt_ioflag === 1 ? this.msg('rltEntryBizopEtpsConsum') : this.msg('rltEntryBizopEtpsProd')} // 预留字段（核注清单表中不存在）
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: false }]}
                  readonly={readonly || (!isdeclare || !isRelEntry)}
                  cusCodeField="rlt_entry_bizop_etpsno"
                  sccCodeField="rlt_entry_bizop_etps_sccd"
                  nameField="rlt_entry_bizop_etpsnm"
                  formData={formData}
                  dataList={[]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('rltInvtNo')} {...formItemLayout}>
                {getFieldDecorator('rlt_invt_no', { // 预留字段（核注清单表中不存在）
                    rules: [{ required: false }],
                    initialValue: formData.rlt_invt_no,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('rltPutrecNo')} {...formItemLayout}>
                {getFieldDecorator('rlt_putrec_no', { // 预留字段（核注清单表中不存在）
                    rules: [{ required: false }],
                    initialValue: formData.rlt_putrec_no,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.msg('remark')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('invt_remark', {
                    rules: [{ required: false }],
                    initialValue: formData.invt_remark,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
