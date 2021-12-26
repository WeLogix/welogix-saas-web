import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import FormPane from 'client/components/FormPane';
import { BAPPL_DECTYPE, BAPPL_BIZTYPE } from 'common/constants';
import { searchDeclareCodeList, loadRegisteredBlBooks } from 'common/reducers/cwmBlBook';
import BlCusSccAutoComplete from '../../common/blCusSccAutoComplete';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const autoCompItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
@injectIntl
@connect(
  state => ({
    loginName: state.account.username,
    tenantName: state.account.tenantName,
    owners: state.cwmContext.whseAttrs.owners,
    customsCode: state.account.customsCode,
    tenantCode: state.account.code,
    whseCode: state.cwmContext.defaultWhse.code,
    brokers: state.cwmContext.whseAttrs.brokers,
    formParams: state.saasParams.latest,
    blBookList: state.cwmBlBook.registeredBlBookList,
    bizApplHeadData: state.cwmSasblReg.bizApplHeadData,
  }),
  { searchDeclareCodeList, loadRegisteredBlBooks }
)

export default class BizApplHeadPane extends React.Component {
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
  msg = formatMsg(this.props.intl);
  render() {
    const {
      form: { getFieldDecorator }, customsCode, tenantCode, tenantName, loginName,
      owners, formParams: { customs }, readonly, brokers, blBookList,
    } = this.props;
    const formData = this.props.bizApplHeadData || {};
    const ownerCompList = owners
      .map(own => ({
        customs_code: own.customs_code,
        name: own.name,
        uscc_code: own.scc_code,
      }));
    if (!ownerCompList.find(owner => owner.customs_code === customsCode)) {
      ownerCompList.push({
        customs_code: customsCode,
        uscc_code: tenantCode,
        name: tenantName,
      });
    }
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
              <FormItem label={this.msg('sasblApplyNo')} {...formItemLayout}>
                {getFieldDecorator('bappl_no', {
                    rules: [{ required: false }],
                    initialValue: formData.bappl_no,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('copNo')} {...formItemLayout}>
                {getFieldDecorator('cop_bappl_no', {
                    rules: [{ required: false }],
                    initialValue: formData.cop_bappl_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sasblDectype')} {...formItemLayout}>
                {getFieldDecorator('bappl_dectype', {
                    rules: [{ required: true }],
                    initialValue: formData.bappl_dectype === '0' ? null : formData.bappl_dectype,
                  })(<Select
                    allowClear
                    showSearch
                  >
                    {BAPPL_DECTYPE.map(obj => (
                      <Option value={obj.value} key={obj.value}>{obj.value} | {obj.text}</Option>
                    ))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('areaOwner')}
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  cusCodeField="owner_cus_code"
                  sccCodeField="owner_scc_code"
                  nameField="owner_name"
                  formData={formData}
                  dataList={ownerCompList}
                  readonly
                />
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
                  disabled
                >
                  {
                    blBookList.map(bk =>
                      <Option value={bk.blbook_no} key={bk.blbook_no}>{bk.blbook_no}</Option>)
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
                  allowClear
                  showSearch
                  disabled
                >
                  {customs.map(custom => (
                    <Option value={custom.customs_code} key={custom.customs_code}>
                      {custom.customs_name}
                    </Option>
                  ))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('outAreaOwner')}
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  cusCodeField="areaout_owner_cus_code"
                  sccCodeField="areaout_owner_scc_code"
                  nameField="areaout_owner_name"
                  formData={formData}
                  dataList={ownerCompList}
                  readonly={readonly}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('outAreaBlBookNo')} {...formItemLayout}>
                {getFieldDecorator('areaout_blbook_no', {
                    initialValue: formData.areaout_blbook_no,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('cashDepositNo')} {...formItemLayout}>
                {getFieldDecorator('deposit_levy_no', {
                    initialValue: formData.deposit_levy_no,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('declarer')}
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  readonly={readonly}
                  cusCodeField="declarer_cus_code"
                  sccCodeField="declarer_scc_code"
                  nameField="declarer_name"
                  formData={formData}
                  dataList={brokers}
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
                  readonly={readonly}
                  cusCodeField="typing_cus_code"
                  sccCodeField="typing_scc_code"
                  nameField="typing_name"
                  formData={formData}
                  dataList={brokers}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('stockBiztype')} {...formItemLayout}>
                {getFieldDecorator('bappl_biztype', {
                    rules: [{ required: true }],
                    initialValue: formData.bappl_biztype === '0' ? null : formData.bappl_biztype,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                  >
                    {BAPPL_BIZTYPE.map(obj => (
                      <Option value={obj.value} key={obj.value}>{obj.text}</Option>
                    ))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('ioflag')} {...formItemLayout}>
                {getFieldDecorator('bappl_ioflag', {
                    rules: [{ required: true }],
                    initialValue: formData.bappl_ioflag,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                  >
                    <Option value={1} key={1}>{this.msg('sasIn')}</Option>
                    <Option value={2} key={2}>{this.msg('sasOut')}</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('exhibitionPlace')} {...formItemLayout}>
                {getFieldDecorator('exhibition_place', {
                    initialValue: formData.exhibition_place,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('prdgoodsMark')} {...formItemLayout}>
                {getFieldDecorator('prdgoods_mark', {
                    initialValue: formData.prdgoods_mark || 'I',
                  })(<Select disabled={readonly}>
                    <Option value="I" key="I">I-料件</Option>
                    <Option value="E" key="E">E-成品</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('bapplValidDate')} {...formItemLayout}>
                {getFieldDecorator('bappl_valid_date', {
                    rules: [{ required: true }],
                    initialValue: formData.bappl_valid_date ?
                      moment(formData.bappl_valid_date) : moment(new Date()),
                  })(<DatePicker disabled={readonly} format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('bapplApprovedDate')} {...formItemLayout}>
                {getFieldDecorator('bappl_approved_date', {
                    initialValue: formData.bappl_approved_date && moment(formData.bappl_approved_date).format('YYYY-MM-DD'),
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('bapplRevisedDate')} {...formItemLayout}>
                {getFieldDecorator('bappl_revised_date', {
                    initialValue: formData.bappl_revised_date && moment(formData.bappl_revised_date).format('YYYY-MM-DD'),
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('bapplClosedDate')} {...formItemLayout}>
                {getFieldDecorator('bappl_closed_date', {
                    initialValue: formData.bappl_closed_date && moment(formData.bappl_closed_date).format('YYYY-MM-DD'),
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('bapplStatus')} {...formItemLayout}>
                {getFieldDecorator('bappl_status', {
                    initialValue: formData.bappl_status,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declDate')} {...formItemLayout}>
                {getFieldDecorator('bappl_decl_date', {
                    initialValue: formData.bappl_decl_date && moment(formData.bappl_decl_date).format('YYYY-MM-DD'),
                  })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('typingDate')} {...formItemLayout}>
                {getFieldDecorator('created_date', {
                    initialValue: formData.created_date && moment(formData.created_date).format('YYYY-MM-DD'),
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declarerPerson')} {...formItemLayout}>
                {getFieldDecorator('declarer_person', {
                    rules: [{ required: true }],
                    initialValue: formData.declarer_person || loginName,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.msg('remark')} {...autoCompItemLayout}>
                {getFieldDecorator('bappl_remark', {
                    initialValue: formData.bappl_remark,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </FormPane>
    );
  }
}
