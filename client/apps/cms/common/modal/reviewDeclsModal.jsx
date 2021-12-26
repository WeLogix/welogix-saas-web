import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Col, Checkbox, Divider, Form, Row, Input, Modal, Table, message, Button } from 'antd';
import { toggleReviewDeclsModal, loadReviewInfo, onReviewFormChange } from 'common/reducers/cmsManifest';
import { setDeclReviewed, rejectManifestReview } from 'common/reducers/cmsCustomsDeclare';
import { CMS_DECL_STATUS, CMS_CONFIRM } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};

const transformCombineData = (fieldVal, options) => {
  const opt = options.find(f => f.value === fieldVal);
  return (opt && opt.text) || fieldVal;
};

@injectIntl
@connect(state => ({
  customs: state.saasParams.latest.customs.map(f => ({
    value: f.customs_code,
    text: f.customs_name,
  })),
  countries: state.saasParams.latest.country.map(f => ({
    value: f.cntry_co,
    text: f.cntry_name_cn,
  })),
  ports: state.saasParams.latest.port.map(f => ({
    value: f.port_code,
    text: f.port_c_cod,
  })),
  cnports: state.saasParams.latest.cnport.map(f => ({
    value: f.port_code,
    text: f.port_name,
  })),
  trxnModes: state.saasParams.latest.trxnMode.map(f => ({
    value: f.trx_mode,
    text: f.trx_spec,
  })),
  currencies: state.saasParams.latest.currency.map(cr => ({
    value: cr.curr_code,
    text: cr.curr_name,
  })),
  wrapTypes: state.saasParams.latest.wrapType,
  reviewDeclsModal: state.cmsManifest.reviewDeclsModal,
  reviewInfo: state.cmsManifest.reviewInfo,
  manifestInfo: state.cmsManifest.reviewInfo.manifestInfo,
  declInfo: state.cmsManifest.reviewInfo.declInfo,
  whetherSubmitReviewForm: state.cmsManifest.whetherSubmitReviewForm,
}), {
  toggleReviewDeclsModal,
  setDeclReviewed,
  loadReviewInfo,
  onReviewFormChange,
  rejectManifestReview,
})
@Form.create({ onValuesChange: (props, values, allValues) => props.onReviewFormChange(allValues) })
export default class ReviewDeclsModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reviewDeclsModal: PropTypes.shape({
      visible: PropTypes.bool,
    }),
    reload: PropTypes.func,
  }
  state = {
    reason: '',
  }
  componentDidMount() {
    const delgNo = this.props.reviewDeclsModal.reviewInfo.delg_no;
    if (delgNo) this.props.loadReviewInfo(delgNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reviewDeclsModal.visible &&
      nextProps.reviewDeclsModal.visible !== this.props.reviewDeclsModal.visible) {
      document.addEventListener('keydown', this.handleKeydown);
      const delgNo = this.props.reviewDeclsModal.reviewInfo.delg_no;
      const nextNo = nextProps.reviewDeclsModal.reviewInfo.delg_no;
      if (nextNo && nextNo !== delgNo) {
        this.props.loadReviewInfo(nextNo);
      }
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('内部编号'),
    dataIndex: 'pre_entry_seq_no',
  }, {
    title: this.msg('contractNo'),
    dataIndex: 'contr_no',
  }, {
    title: this.msg('emsNo'),
    dataIndex: 'manual_no',
  }, {
    title: this.msg('packCount'),
    dataIndex: 'pack_count',
    render: (packCount, row, index) => {
      if ((this.props.declInfo.length === 1 || index === this.props.declInfo.length)
        && this.props.manifestInfo.pack_count > packCount) {
        return <span style={{ color: 'red' }}>{packCount}</span>;
      }
      return packCount;
    },
  }, {
    title: this.msg('grossWeight'),
    dataIndex: 'gross_wt',
    render: (grossWeight, row, index) => {
      if ((this.props.declInfo.length === 1 || index === this.props.declInfo.length)
        && parseFloat(this.props.manifestInfo.gross_wt.toFixed(5))
        > parseFloat(grossWeight.toFixed(5))) {
        return <span style={{ color: 'red' }}>{grossWeight && grossWeight.toFixed(3)}</span>;
      }
      return grossWeight && grossWeight.toFixed(3);
    },
  }, {
    title: this.msg('netWeight'),
    dataIndex: 'net_wt',
    render: (netWeight, row, index) => {
      if ((this.props.declInfo.length === 1 || index === this.props.declInfo.length)
        && parseFloat(this.props.manifestInfo.net_wt.toFixed(5))
        > parseFloat(netWeight.toFixed(5))) {
        return <span style={{ color: 'red' }}>{netWeight && netWeight.toFixed(3)}</span>;
      }
      return netWeight && netWeight.toFixed(3);
    },
  }, {
    title: this.msg('paymentRoyalty'),
    dataIndex: 'payment_royalty',
    render: o => transformCombineData(o, CMS_CONFIRM),
  }];
  handleCancel = () => {
    this.props.toggleReviewDeclsModal(false);
    this.setState({ reason: '' });
  }
  handleOk = () => {
    const values = this.props.form.getFieldsValue();
    const { manifestInfo } = this.props;
    const mapValues = {
      check_decl_port: this.msg('declPort'),
      check_i_e_port: manifestInfo.i_e_type === 0 ? this.msg('entryCustoms') : this.msg('exitCustoms'),
      check_entry_exit_zone: manifestInfo.i_e_type === 0 ? this.msg('entryPort') : this.msg('exitPort'),
      check_bl_wb_no: this.msg('ladingWayBill'),
      check_traf_name: this.msg('transModeName'),
      check_voyage_no: this.msg('voyageNo'),
      check_trade_country: this.msg('tradeCountry'),
      check_dept_dest_country: manifestInfo.i_e_type === 0 ? this.msg('departCountry') : this.msg('destinateCountry'),
      check_origin_port: this.msg('originPort'),
      check_dept_dest_port: manifestInfo.i_e_type === 0 ? this.msg('callingPort') : this.msg('eDestinatePort'),
      check_trxn_mode: this.msg('trxMode'),
      check_freight: this.msg('freightFee'),
      check_wrap_type: this.msg('packType'),
      check_pack_count: this.msg('packCount'),
      check_gross_wt: this.msg('grossWeight'),
      check_net_wt: this.msg('netWeight'),
      check_oversea_entity_name: manifestInfo.i_e_type === 0 ? this.msg('overseaSender') : this.msg('overseaReceiver'),
      check_special_relation: this.msg('priceEffect'),
      check_price_effect: this.msg('priceEffect'),
    };
    let checkAll = true;
    const logSet = new Set();
    Object.keys(values).forEach((f) => {
      if (values[f]) {
        let field = mapValues[f];
        if (new RegExp('check_trade_total').test(f)) {
          field = '汇总申报总价';
        }
        if (field) logSet.add(field);
      } else {
        checkAll = false;
      }
    });
    const opContent = checkAll ? '已复核全部栏位' : `已复核${Array.from(logSet).join(',')}等栏位`;
    const declIds = this.props.declInfo.map(decl => decl.id);
    this.props.setDeclReviewed(declIds, CMS_DECL_STATUS.reviewed.value, opContent)
      .then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.success(this.msg('reviewed'));
          this.props.toggleReviewDeclsModal(false);
          if (this.props.reload) this.props.reload();
        }
      });
  }
  handleKeydown = (ev) => {
    if (ev.keyCode === 65 && ev.shiftKey) {
      const values = this.props.form.getFieldsValue();
      const newData = {};
      Object.keys(values).forEach((f) => {
        newData[f] = true;
      });
      this.props.form.setFieldsValue(newData);
    }
  }
  handleInputChange = (ev) => {
    this.setState({ reason: ev.target.value });
  }
  handleRejectReview = () => {
    const { reason } = this.state;
    if (!reason) {
      message.error('请填写退回原因');
      return;
    }
    const declIds = this.props.declInfo.map(decl => decl.id);
    this.props.rejectManifestReview(declIds, reason).then((result) => {
      if (!result.error) this.handleCancel();
    });
  }

  render() {
    const {
      manifestInfo, declInfo, reviewDeclsModal, form: { getFieldDecorator },
      customs, countries, currencies, cnports, ports, trxnModes, wrapTypes, whetherSubmitReviewForm,
    } = this.props;
    if (!Object.keys(manifestInfo).length || !declInfo.length) return null;
    const newColumns = [...this.columns];
    const declInfoSum = {
      pack_count: 0,
      gross_wt: 0,
      net_wt: 0,
    };
    for (let i = 0, len = declInfo.length; i < len; i++) {
      const currDecl = declInfo[i];
      if (len > 1) {
        declInfoSum.pack_count += (currDecl.pack_count || 0);
        declInfoSum.gross_wt += (currDecl.gross_wt || 0);
        declInfoSum.net_wt += (currDecl.net_wt || 0);
      }
      currDecl.tradeInfoList.forEach((f) => {
        const tradeCurr = f.trade_curr;
        currDecl[tradeCurr] = f.trade_total;
        if (declInfoSum[tradeCurr] === undefined) {
          newColumns.push({
            title: `${this.msg('declTotal')}(${transformCombineData(tradeCurr, currencies)})`,
            dataIndex: tradeCurr,
            key: tradeCurr,
            render: (tradeTotal, row, index) => {
              const delgTrade = manifestInfo.tradeInfoList.find(g => g.trade_curr === tradeCurr);
              const delgTotal = delgTrade && delgTrade.trade_total;
              if ((declInfo.length === 1 || index === declInfo.length) &&
                parseFloat(delgTotal.toFixed(5)) !== parseFloat(tradeTotal.toFixed(5))) {
                return <span style={{ color: 'red' }}>{tradeTotal && tradeTotal.toFixed(5)}</span>;
              }
              return tradeTotal && tradeTotal.toFixed(5);
            },
          });
          declInfoSum[tradeCurr] = f.trade_total;
        } else if (len > 1) {
          declInfoSum[tradeCurr] += f.trade_total || 0;
        }
      });
    }
    const declData = declInfo.length > 1 ? declInfo.concat(declInfoSum) : declInfo;
    return (
      <Modal
        width={1024}
        style={{ top: 24 }}
        title={this.msg('reviewDecls')}
        visible={reviewDeclsModal.visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        okText={this.msg('approve')}
        okButtonProps={{ disabled: !whetherSubmitReviewForm }}
        // onKeyDown={this.handleKeydown}
        destroyOnClose
      >
        <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col readonly">
          <Row gutter={16}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('declPort')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.decl_port, customs)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_decl_port', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={manifestInfo.i_e_type === 0 ? this.msg('entryCustoms') : this.msg('exitCustoms')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.i_e_port, customs)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_i_e_port', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={manifestInfo.i_e_type === 0 ? this.msg('entryPort') : this.msg('exitPort')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.entry_exit_zone, cnports)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_entry_exit_zone', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('ladingWayBill')} >
                <Col span={21}><Input disabled value={manifestInfo.bl_wb_no} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_bl_wb_no', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('transModeName')} >
                <Col span={21}><Input disabled value={manifestInfo.traf_name} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_traf_name', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('voyageNo')} >
                <Col span={21}><Input disabled value={manifestInfo.voyage_no} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_voyage_no', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('tradeCountry')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.trade_country, countries)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_trade_country', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={manifestInfo.i_e_type === 0 ? this.msg('departCountry') : this.msg('destinateCountry')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.dept_dest_country, countries)}
                  />
                </Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_dept_dest_country', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            {manifestInfo.i_e_type === 0 && <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('originPort')} >
                <Col span={21}>
                  <Input disabled value={transformCombineData(manifestInfo.origin_port, ports)} />
                </Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_origin_port', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>}
            <Col span={8}>
              <FormItem {...formItemLayout} label={manifestInfo.i_e_type === 0 ? this.msg('callingPort') : this.msg('eDestinatePort')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.dept_dest_port, ports)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_dept_dest_port', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('trxMode')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.trxn_mode, trxnModes)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_trxn_mode', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('freightFee')} >
                <Col span={21}><Input disabled value={manifestInfo.fee_rate} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_freight', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('packType')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.wrap_type, wrapTypes)}
                  /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_wrap_type', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('packCount')} >
                <Col span={21}><Input disabled value={manifestInfo.pack_count} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_pack_count', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('grossWeight')} >
                <Col span={21}><Input disabled value={manifestInfo.gross_wt} addonAfter="KG" /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_gross_wt', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('netWeight')} >
                <Col span={21}><Input disabled value={manifestInfo.net_wt} addonAfter="KG" /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_net_wt', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={manifestInfo.i_e_type === 0 ? this.msg('overseaSender') : this.msg('overseaReceiver')} >
                <Col span={21}><Input disabled value={manifestInfo.oversea_entity_name} /></Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_oversea_entity_name', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('specialRelation')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.special_relation, CMS_CONFIRM)}
                  />
                </Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_special_relation', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('priceEffect')} >
                <Col span={21}>
                  <Input
                    disabled
                    value={transformCombineData(manifestInfo.price_effect, CMS_CONFIRM)}
                  />
                </Col>
                <Col span={2} offset={1}>
                  {getFieldDecorator('check_price_effect', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Col>
              </FormItem>
            </Col>
            {manifestInfo.tradeInfoList && manifestInfo.tradeInfoList.map((f, i) => (
              <Col span={8} key={f.trade_curr}>
                <FormItem {...formItemLayout} label={this.msg('declAmount')} >
                  <Col span={21}>
                    <InputGroup compact>
                      <Input disabled placeholder={this.msg('currency')} value={transformCombineData(f.trade_curr, currencies)} style={{ width: '40%' }} />
                      <Input disabled style={{ width: '60%' }} value={f.trade_total && f.trade_total.toFixed(5)} />
                    </InputGroup>
                  </Col>
                  <Col span={2} offset={1}>
                    {getFieldDecorator(`check_trade_total${i + 1}`, {
                      valuePropName: 'checked',
                    })(<Checkbox />)}
                  </Col>
                </FormItem>
              </Col>))
            }
          </Row>
        </Form>
        <Divider dashed>{this.msg('已生成报关建议书')}</Divider>
        <Table size="small" columns={newColumns} dataSource={declData} pagination={false} rowKey="id" />
        <Divider />
        <Input.Group compact style={{ textAlign: 'right' }}>
          <Input
            value={this.state.reason}
            onChange={this.handleInputChange}
            placeholder="请填写退回原因"
            style={{ width: '50%' }}
          />
          <Button type="danger" ghost onClick={this.handleRejectReview}>{this.msg('return')}</Button>
        </Input.Group>
      </Modal>
    );
  }
}
