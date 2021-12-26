import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import FormPane from 'client/components/FormPane';
import { BAPPL_BIZTYPE } from 'common/constants';
import { searchDeclareCodeList, loadRegisteredBlBooks } from 'common/reducers/cwmBlBook';
import { loadBizApplyInfos, toggleFillPreSasblNoModal } from 'common/reducers/cwmSasblReg';
import BlCusSccAutoComplete from '../../common/blCusSccAutoComplete';
import PreSasblNoFillModal from '../../common/modals/preSasblNoFillModal';
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
    loginName: state.account.username,
    tenantName: state.account.tenantName,
    owners: state.cwmContext.whseAttrs.owners,
    customsCode: state.account.customsCode,
    tenantCode: state.account.code,
    whseCode: state.cwmContext.defaultWhse.code,
    brokers: state.cwmContext.whseAttrs.brokers,
    formParams: state.saasParams.latest,
    blBookList: state.cwmBlBook.registeredBlBookList,
    stockData: state.cwmSasblReg.stockData,
    bizApplyInfoList: state.cwmSasblReg.bizApplyInfoList,
  }),
  {
    searchDeclareCodeList,
    loadRegisteredBlBooks,
    loadBizApplyInfos,
    toggleFillPreSasblNoModal,
  }
)

export default class StockIoHeadPane extends React.Component {
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
      this.props.loadBizApplyInfos(whseCode);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.whseCode !== nextProps.whseCode && nextProps.whseCode) {
      this.props.loadRegisteredBlBooks(nextProps.whseCode);
      this.props.loadBizApplyInfos(nextProps.whseCode);
    }
  }
  handlerApplyNoSelect = (value) => {
    const { bizApplyInfoList } = this.props;
    const bizApply = bizApplyInfoList.find(ap => ap.bappl_no === value);
    const itemKeyArray = [
      'blbook_no', 'owner_cus_code', 'owner_scc_code', 'owner_name', 'master_customs',
    ];
    const itemObj = {};
    itemKeyArray.forEach((itemkey) => {
      if (bizApply[itemkey] !== null && bizApply[itemkey] !== undefined) {
        itemObj[itemkey] = bizApply[itemkey];
      } else {
        itemObj[itemkey] = '';
      }
    });
    itemObj.stock_biztype = bizApply.bappl_biztype || '';
    this.props.form.setFieldsValue(itemObj);
  }
  handleStockNoClick = () => {
    const { stockData } = this.props;
    this.props.toggleFillPreSasblNoModal(true, { copNo: stockData.cop_stock_no, sasRegType: 'stock' });
  }
  handlePreSeqNoClick = () => {
    const { stockData } = this.props;
    this.props.toggleFillPreSasblNoModal(true, { copNo: stockData.cop_stock_no, sasRegType: 'stock' });
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      form: { getFieldDecorator }, customsCode, tenantCode, tenantName, loginName,
      brokers, owners, blBookList, readonly, bizApplyInfoList,
      formParams: {
        customs, wrapType,
      },
    } = this.props;
    const formData = this.props.stockData || {};
    const isCosmtn = formData && formData.sasbl_biztype === 'COSMTN';
    const isbatched = formData && formData.stock_status === 6;
    const ownerCompList = owners.map(own => ({
      customs_code: own.customs_code,
      uscc_code: own.scc_code,
      name: own.name,
    })).concat({
      customs_code: customsCode,
      uscc_code: tenantCode,
      name: tenantName,
    });
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
                    initialValue: formData.pre_sasbl_seqno,
                  })(<Input
                    disabled={readonly || formData.pre_sasbl_seqno}
                    onClick={this.handlePreSeqNoClick}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('stockNo')} {...formItemLayout}>
                {getFieldDecorator('stock_no', {
                    initialValue: formData.stock_no,
                  })(<Input
                    disabled={readonly || formData.stock_no}
                    onClick={this.handleStockNoClick}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('copNo')} {...formItemLayout}>
                {getFieldDecorator('cop_stock_no', {
                    initialValue: formData.cop_stock_no,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sasblApplyNo')} {...formItemLayout}>
                {getFieldDecorator('sasbl_apply_no', {
                    rules: [{ required: !isCosmtn }],
                    initialValue: formData.sasbl_apply_no,
                  })(<Select
                    allowClear
                    showSearch
                    disabled={readonly}
                    onSelect={this.handlerApplyNoSelect}
                  >
                    {bizApplyInfoList.map(bk =>
                      (<Option value={bk.bappl_no} key={bk.bappl_no}>{bk.bappl_no}
                      </Option>))
                    }
                  </Select>)}
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
                  readonly={readonly}
                  cusCodeField="owner_cus_code"
                  sccCodeField="owner_scc_code"
                  nameField="owner_name"
                  formData={formData}
                  dataList={ownerCompList}
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
                    disabled={readonly}
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
                    showSearch
                    showArrow
                    optionFilterProp="children"
                    allowClear
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
              <FormItem label={this.msg('stockIoflag')} {...formItemLayout}>
                {getFieldDecorator('stock_ioflag', {
                    rules: [{ required: true }],
                    initialValue: formData.stock_ioflag,
                  })(<Select
                    allowClear
                    disabled={readonly}
                  >
                    <Option value={1} key={1}>1 | {this.msg('sasIn')}</Option>
                    <Option value={2} key={2}>2 | {this.msg('sasOut')}</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('stockBiztype')} {...formItemLayout}>
                {getFieldDecorator('stock_biztype', {
                    rules: [{ required: true }],
                    initialValue: formData.stock_biztype,
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
              <FormItem label={this.msg('rltInvtregNo')} {...formItemLayout}>
                {getFieldDecorator('rlt_invtreg_no', {
                    initialValue: formData.rlt_invtreg_no,
                })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('rltStockioNo')} {...formItemLayout}>
                {getFieldDecorator('rlt_stockio_no', {
                    initialValue: formData.rlt_stockio_no,
                  })(<Input disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('sioPieces')} {...formItemLayout}>
                {getFieldDecorator('sio_pieces', {
                    rules: [{ required: false }],
                    initialValue: formData.sio_pieces,
                  })(<Input disabled={readonly} type="number" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sioWrapType')} {...formItemLayout}>
                {getFieldDecorator('sio_wrap_type', {
                    rules: [{ required: false }],
                    initialValue: formData.sio_wrap_type,
                  })(<Select
                    disabled={readonly}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {
                      wrapType.map(tsm => (
                        <Option key={tsm.value} value={tsm.value}>
                          {tsm.value}|{tsm.text}
                        </Option>))
                  }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sioNetwt')} {...formItemLayout}>
                {getFieldDecorator('sio_netwt', {
                    rules: [{ required: false }],
                    initialValue: formData.sio_netwt,
                })(<Input type="number" addonAfter="KG" disabled={readonly} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sioGrosswt')} {...formItemLayout}>
                {getFieldDecorator('sio_grosswt', {
                    rules: [{ required: false }],
                    initialValue: formData.sio_grosswt,
                  })(<Input type="number" addonAfter="KG" disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('prdgoodsMark')} {...formItemLayout}>
                {getFieldDecorator('prdgoods_mark', {
                    initialValue: formData.prdgoods_mark || 'I',
                  })(<Select
                    disabled={readonly}
                  >
                    <Option value="I" key="I">I-料件</Option>
                    <Option value="E" key="E">E-成品</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('sioReplaceMark')} {...formItemLayout}>
                {getFieldDecorator('sio_replace_mark', {
                    initialValue: formData.sio_replace_mark,
                })(<Select
                  allowClear
                  disabled={readonly}
                >
                  <Option value="1" key="0">0-退货单</Option>
                  <Option value="1" key="1">1-非退货单</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('centerDeclarerFlag')} {...formItemLayout}>
                {getFieldDecorator('stock_status', {
                    initialValue: formData.stock_status,
                  })(<Input
                    disabled
                    value={isbatched ? '已生成' : '未生成'}
                  />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={this.msg('declDate')} {...formItemLayout}>
                {getFieldDecorator('stock_decl_date', {
                    initialValue: formData.stock_decl_date && moment(formData.stock_decl_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label={this.msg('typingDate')} {...formItemLayout}>
                {getFieldDecorator('created_date', {
                    initialValue: formData.created_date && moment(formData.created_date, 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} disabled />)}
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
              <FormItem label={this.msg('remark')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('sio_remark', {
                    initialValue: formData.sio_remark,
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
