import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Icon, Input, Select, Tooltip } from 'antd';
import FormPane from 'client/components/FormPane';
import { CMS_CNTNR_SPEC_CUS, PASSPORT_BIZTYPE } from 'common/constants';
import { searchDeclareCodeList, loadRegisteredBlBooks } from 'common/reducers/cwmBlBook';
import { toggleFillPreSasblNoModal } from 'common/reducers/cwmSasblReg';
import BlCusSccAutoComplete from '../../common/blCusSccAutoComplete';
import PreSasblNoFillModal from '../../common/modals/preSasblNoFillModal';
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
    passHeadData: state.cwmSasblReg.passHeadData,
    partners: state.partner.partners,
    blBooks: state.cwmBlBook.registeredBlBookList,
  }),
  { searchDeclareCodeList, loadRegisteredBlBooks, toggleFillPreSasblNoModal }
)

export default class PassportHeadPane extends React.Component {
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
    this.props.loadRegisteredBlBooks(this.props.whseCode);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.whseCode && this.props.whseCode !== nextProps.whseCode) {
      this.props.loadRegisteredBlBooks(nextProps.whseCode);
    }
  }
  handleCarWtCacl = (e) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const value = Number(e.target.value);
    const carFrameWt = getFieldValue('pp_vehicle_framewt');
    const goodsWt = getFieldValue('pp_goods_grosswt');
    if (!Number.isNaN(Number(value))) {
      setFieldsValue({
        pp_total_weight: value + Number(carFrameWt) + Number(goodsWt),
      });
    } else {
      setFieldsValue({
        pp_vehicle_wt: 0,
      });
    }
  }
  handleCarFrameWtCacl = (e) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const value = Number(e.target.value);
    const carWt = getFieldValue('pp_vehicle_wt');
    const goodsWt = getFieldValue('pp_goods_grosswt');
    if (!Number.isNaN(Number(value))) {
      setFieldsValue({
        pp_total_weight: value + Number(carWt) + Number(goodsWt),
      });
    } else {
      setFieldsValue({
        pp_vehicle_framewt: 0,
      });
    }
  }
  handleTotalWtOnClick = () => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const carFrameWt = getFieldValue('pp_vehicle_framewt');
    const carWt = getFieldValue('pp_vehicle_wt');
    const goodsWt = getFieldValue('pp_goods_grosswt');
    setFieldsValue({
      pp_total_weight: Number(carFrameWt) + Number(carWt) + Number(goodsWt),
    });
  }
  handleGoodsWtCacl = (e) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const value = Number(e.target.value);
    const carWt = getFieldValue('pp_vehicle_wt');
    const carFrameWt = getFieldValue('pp_vehicle_framewt');
    if (!Number.isNaN(Number(value))) {
      setFieldsValue({
        pp_total_weight: value + Number(carWt) + Number(carFrameWt),
      });
    } else {
      setFieldsValue({
        pp_goods_grosswt: 0,
      });
    }
  }
  handlePassNoClick = () => {
    const { passHeadData } = this.props;
    this.props.toggleFillPreSasblNoModal(true, { copNo: passHeadData.cop_pass_no, sasRegType: 'pass' });
  }
  handlePreSeqNoClick = () => {
    const { passHeadData } = this.props;
    this.props.toggleFillPreSasblNoModal(true, { copNo: passHeadData.cop_pass_no, sasRegType: 'pass' });
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      form: { getFieldDecorator }, customsCode, tenantCode, tenantName, loginName,
      owners, partners, formParams: { customs }, readonly, brokers, blBooks,
    } = this.props;
    const formData = this.props.passHeadData || {};
    const ownerCompList = owners.map((own) => {
      const ownerObj = {
        customs_code: own.customs_code,
        name: own.name,
      };
      const partner = partners.find(ptner => ptner.customs_code === own.customs_code);
      if (partner) {
        ownerObj.uscc_code = partner.partner_unique_code;
      }
      return ownerObj;
    });
    if (!ownerCompList.find(owner => owner.customs_code === customsCode)) {
      ownerCompList.push({
        customs_code: customsCode,
        uscc_code: tenantCode,
        name: tenantName,
      });
    }
    const blBook = blBooks.find(bk => bk.blbook_no === formData.blbook_no);
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
                  })(<Input
                    disabled={readonly || formData.pre_sasbl_seqno}
                    onClick={this.handlePreSeqNoClick}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('passportNo')} {...formItemLayout}>
                {getFieldDecorator('pass_no', {
                    rules: [{ required: false }],
                    initialValue: formData.pass_no,
                  })(<Input
                    disabled={readonly || formData.pass_no}
                    onClick={this.handlePassNoClick}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('copNo')} {...formItemLayout}>
                {getFieldDecorator('cop_pass_no', {
                    rules: [{ required: false }],
                    initialValue: formData.cop_pass_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('passportBiztype')} {...formItemLayout}>
                {getFieldDecorator('pass_biztype', {
                    rules: [{ required: true }],
                    initialValue: formData.pass_biztype,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                  >
                    {PASSPORT_BIZTYPE.map(obj => (
                      <Option value={obj.value} key={obj.value}>{obj.value} | {obj.text}</Option>
                    ))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('ioflag')} {...formItemLayout}>
                {getFieldDecorator('pass_ioflag', {
                    rules: [{ required: true }],
                    initialValue: formData.pass_ioflag,
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
              <FormItem label={this.msg('bindType')} {...formItemLayout}>
                {getFieldDecorator('pass_bindtype', {
                    rules: [{ required: true }],
                    initialValue: formData.pass_bindtype,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                  >
                    <Option value={1} key={1}>{this.msg('oneCarManyOrders')}</Option>
                    <Option value={2} key={2}>{this.msg('oneCarOneOrders')}</Option>
                    <Option value={3} key={3}>{this.msg('manyCarsOneOrders')}</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('关联单证类型')} {...formItemLayout}>
                {getFieldDecorator('pass_rlt_reg', {
                    rules: [{ required: true }],
                    initialValue: formData.pass_rlt_reg,
                  })(<Select
                    allowClear
                    showSearch
                    disabled
                  >
                    <Option value="1" key="1">核注清单</Option>
                    <Option value="2" key="2">出入库单</Option>
                    <Option value="3" key="3">提运单</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('rltRegNo')} {...formItemLayout}>
                {getFieldDecorator('pass_rlt_regno', {
                    rules: [{ required: true }],
                    initialValue: formData.pass_rlt_regno,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...autoCompItemLayout}
                label={this.msg('areaOwner')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  rules={[{ required: true }]}
                  cusCodeField="owner_cus_code"
                  sccCodeField="owner_scc_code"
                  nameField="owner_name"
                  formData={formData}
                  dataList={ownerCompList}
                  readonly={readonly}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('blbookNo')} {...formItemLayout}>
                {getFieldDecorator('blbook_no', {
                    rules: [{ required: true }],
                    initialValue: formData.blbook_no,
                })(<Input disabled={readonly} />)}
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
                  disabled={readonly}
                >
                  {customs.map(cus => (<Option value={cus.customs_code} key={cus.customs_code}>
                    {cus.customs_code}|{cus.customs_name}</Option>))}
                </Select>)}
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
                  rules={[{ required: false }]}
                  readonly={readonly}
                  cusCodeField="declarer_cus_code"
                  sccCodeField="declarer_scc_code"
                  nameField="declarer_name"
                  formData={formData}
                  dataList={agentCompList}
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
                  rules={[{ required: false }]}
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
              <FormItem label={this.msg('carNo')} {...formItemLayout}>
                {getFieldDecorator('pp_vehicle_no', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_vehicle_no,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('carWeight')} {...formItemLayout}>
                {getFieldDecorator('pp_vehicle_wt', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_vehicle_wt || 4480,
                })(<Input
                  disabled={readonly}
                  type="number"
                  onChange={this.handleCarWtCacl}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('carFrameWeight')} {...formItemLayout}>
                {getFieldDecorator('pp_vehicle_framewt', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_vehicle_framewt || 2800,
                })(<Input
                  disabled={readonly}
                  type="number"
                  onChange={this.handleCarFrameWtCacl}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('carFrameNo')} {...formItemLayout}>
                {getFieldDecorator('pp_vehicle_frameno', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_vehicle_frameno,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('containerNo')} {...formItemLayout}>
                {getFieldDecorator('pp_container_no', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_container_no,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('containerType')} {...formItemLayout}>
                {getFieldDecorator('pp_container_model', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_container_model,
                })(<Select
                  allowClear
                  showSearch
                  disabled={readonly}
                >
                  {CMS_CNTNR_SPEC_CUS.map(con => (
                    <Option value={con.value} key={con.value}>{con.text}</Option>
                  ))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('containerWeight')} {...formItemLayout}>
                {getFieldDecorator('pp_container_wt', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_container_wt,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('货物总毛重')} {...formItemLayout}>
                {getFieldDecorator('pp_goods_grosswt', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_goods_grosswt,
                })(<Input
                  disabled={readonly}
                  type="number"
                  onChange={this.handleGoodsWtCacl}
                />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('货物总净重')} {...formItemLayout}>
                {getFieldDecorator('pp_goods_netwt', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_goods_netwt,
                })(<Input disabled={readonly} type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('总重量')} {...formItemLayout}>
                {getFieldDecorator('pp_total_weight', {
                    rules: [{ required: true }],
                    initialValue: formData.pp_total_weight,
                })(<Input disabled={readonly} type="number" onClick={this.handleTotalWtOnClick} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem
                label={<span>{this.msg('到货确认')}
                  <Tooltip title="适用于没有物理卡口的L区外物流账册，审批通过后即做过卡处理">
                    <Icon type="question-circle-o" />
                  </Tooltip></span>}
                {...formItemLayout}
              >
                {getFieldDecorator('pp_virtual_type', {
                    initialValue: formData.pp_virtual_type,
                    rules: [{ required: (blBook && blBook.blbook_type === 'L') }],
                })(<Select
                  allowClear
                  disabled={readonly}
                >
                  <Option value={1} key={1}>是</Option>
                  <Option value={2} key={2}>否</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('checkPointPassed')} {...formItemLayout}>
                {getFieldDecorator('placeholder', {
                    rules: [{ required: false }],
                    initialValue: formData.placeholder,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('过卡时间1')} {...formItemLayout}>
                {getFieldDecorator('placeholder', {
                    rules: [{ required: false }],
                    initialValue: formData.placeholder,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('过卡时间2')} {...formItemLayout}>
                {getFieldDecorator('placeholder', {
                    rules: [{ required: false }],
                    initialValue: formData.placeholder,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('declarerPerson')} {...formItemLayout}>
                {getFieldDecorator('declarer_person', {
                    rules: [{ required: true }],
                    initialValue: formData.declarer_person || loginName,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declDate')} {...formItemLayout}>
                {getFieldDecorator('pp_decl_date', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_decl_date,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('typingDate')} {...formItemLayout}>
                {getFieldDecorator('placeholder', {
                    rules: [{ required: false }],
                    initialValue: formData.placeholder,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('remark')} {...formItemLayout}>
                {getFieldDecorator('pp_remark', {
                    rules: [{ required: false }],
                    initialValue: formData.pp_remark,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <PreSasblNoFillModal
          reload={this.props.reload}
          preSasblSeqno={formData.pre_sasbl_seqno}
        />
      </FormPane>
    );
  }
}
