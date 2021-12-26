import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Input, Select, Radio, Checkbox } from 'antd';
import { changeTariff } from 'common/reducers/transportTariff';
import { loadAllInvoicingKinds } from 'common/reducers/saasInvoicingKind';
import {
  TARIFF_KINDS, GOODS_TYPES,
  PRESET_TRANSMODES, TARIFF_PARTNER_PERMISSION,
} from 'common/constants';
import FormPane from 'client/components/FormPane';
import PricingLTL from './pricingLTL';
import PricingFTL from './pricingFTL';
import PricingCTN from './pricingCTN';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const subFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@connect(
  state => ({
    tenantId: state.account.tenantId,
    tenantName: state.account.tenantName,
    loginId: state.account.loginId,
    loginName: state.account.username,
    tariffId: state.transportTariff.tariffId,
    formData: state.transportTariff.agreement,
    formParams: state.transportTariff.formParams,
    invoicingKinds: state.saasInvoicingKind.allInvoicingKinds,
  }),
  { changeTariff, loadAllInvoicingKinds }
)

export default class AgreementForm extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['create', 'edit', 'view']),
    // form: PropTypes.object.isRequired,
    // formData: PropTypes.object.isRequired,
    // formParams: PropTypes.object.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
    readonly: PropTypes.bool,
    tenantId: PropTypes.number.isRequired,
    tenantName: PropTypes.string.isRequired,
    loginId: PropTypes.number.isRequired,
    loginName: PropTypes.string.isRequired,
    tariffId: PropTypes.string,
    formData: PropTypes.shape({
      quoteNo: PropTypes.string,
      kind: PropTypes.number.isRequired,
    }),

    changeTariff: PropTypes.func.isRequired,
  }
  state = {
    partnerVisible: true,
    transMode: '',
    readonly: false,
  }
  componentWillMount() {
    this.modeSelect(this.props.formData.transModeCode);
    this.handleKindChange(this.props.formData.kind);
    this.props.loadAllInvoicingKinds();
    if (this.props.readonly) {
      this.setState({ readonly: true });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData !== this.props.formData) {
      this.handleKindChange(nextProps.formData.kind);
    }
    if (nextProps.formData.transModeCode !== this.props.formData.transModeCode) {
      this.modeSelect(nextProps.formData.transModeCode);
    }
    if (nextProps.readonly && !this.props.readonly) {
      this.setState({ readonly: true });
    }
  }
  handleKindChange = (kindIdx) => {
    if (kindIdx >= 0) {
      const kind = TARIFF_KINDS[kindIdx];
      if (kind.isBase) {
        this.setState({ partnerVisible: false });
      }
    }
  }
  handlePriceChange = (intervals, vehicleTypes) => {
    this.props.changeTariff({
      intervals: intervals || [],
      vehicleTypes: vehicleTypes || [],
      priceChanged: true,
    });
  }
  modeSelect = (value) => {
    const tms = this.props.formParams.transModes.filter(tm => tm.mode_code === value);
    if (tms.length !== 1) {
      return;
    }
    const code = tms[0].mode_code;
    if (code === PRESET_TRANSMODES.ftl) {
      this.setState({ transMode: 'ftl' });
    } else if (code === PRESET_TRANSMODES.ctn) {
      this.setState({ transMode: 'ctn' });
    } else {
      this.setState({ transMode: 'ltl' });
    }
  }
  handleModeSelect = (value) => {
    this.modeSelect(value);
    this.props.changeTariff({ priceChanged: true });
  }
  render() {
    const {
      form, formData, formParams,
      form: { getFieldDecorator },
      invoicingKinds,
    } = this.props;
    const {
      partnerVisible, readonly, transMode,
    } = this.state;
    return (
      <FormPane>
        <Card>
          <Row>
            <Col span={6}>
              <FormItem label="价格类型" {...formItemLayout}>
                <Input disabled value={TARIFF_KINDS[formData.kind] ? TARIFF_KINDS[formData.kind].text : ''} />
              </FormItem>
            </Col>
            <Col span={6}>
              {
                  partnerVisible &&
                  <FormItem label="合作伙伴" {...formItemLayout}>
                    <Input disabled value={formData.partnerName} />
                  </FormItem>
                }
            </Col>
            <Col span={6}>
              <FormItem label="对方权限" {...formItemLayout}>
                {getFieldDecorator('partnerPermission', {
                    initialValue: formData.partnerPermission || TARIFF_PARTNER_PERMISSION.viewable,
                    rules: [{ required: true, type: 'number' }],
                  })(<RadioGroup disabled={readonly}>
                    <Radio value={TARIFF_PARTNER_PERMISSION.viewable}>查看</Radio>
                    <Radio value={TARIFF_PARTNER_PERMISSION.editable}>修改</Radio>
                  </RadioGroup>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="允许特殊费用" {...formItemLayout}>
                {getFieldDecorator('special_fee_allowed', {
                  valuePropName: 'checked',
                  initialValue: formData.special_fee_allowed || false,
                  })(<Checkbox disabled={readonly} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="运输模式" {...formItemLayout}>
                {getFieldDecorator('transModeCode', {
                    initialValue: formData.transModeCode,
                    rules: [{ required: true, type: 'string', message: '运输模式必选' }],
                  })(<Select onSelect={this.handleModeSelect} disabled={readonly}>
                    {
                      formParams.transModes.map(tm =>
                        <Option value={tm.mode_code} key={tm.mode_code}>{tm.mode_name}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="货物类型" {...formItemLayout}>
                {getFieldDecorator('goodsType', {
                    initialValue: formData.goodsType,
                    rules: [{ required: true, message: '货物类型必选', type: 'number' }],
                  })(<Select disabled={readonly}>
                    {
                      GOODS_TYPES.map(gt =>
                        <Option value={gt.value} key={gt.value}>{gt.text}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="价格调整系数" {...formItemLayout}>
                {getFieldDecorator('adjustCoefficient', {
                    rules: [{ required: false, type: 'number', transform: v => Number(v) }],
                    initialValue: formData.adjustCoefficient,
                  })(<Input disabled={readonly} placeholder="不输入默认为1" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="开票类型" {...formItemLayout}>
                {getFieldDecorator('invoicing_code', {
                    initialValue: formData.invoicing_code,
                    rules: [{ required: true, message: '开票类型必选' }],
                  })(<Select style={{ width: '100%' }} disabled={readonly}>
                    {invoicingKinds.map(kind =>
                  (<Option key={kind.invoicing_code} value={kind.invoicing_code}>
                    {kind.invoicing_type}</Option>))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          {transMode === 'ltl' &&
            <PricingLTL
              form={form}
              formItemLayout={subFormLayout}
              onChange={this.handlePriceChange}
              readonly={readonly}
            />
              }
          {transMode === 'ftl' &&
            <PricingFTL
              formItemLayout={subFormLayout}
              onChange={this.handlePriceChange}
              readonly={readonly}
            />
              }
          {transMode === 'ctn' &&
            <PricingCTN
              formItemLayout={subFormLayout}
              onChange={this.handlePriceChange}
              readonly={readonly}
            />
              }
        </Card>
      </FormPane>
    );
  }
}
