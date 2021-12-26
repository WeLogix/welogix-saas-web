import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Form, Col, Row, Select, Switch } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { TRANS_MODE, DECL_I_TYPE, DECL_E_TYPE } from 'common/constants';
import { loadCmsQuotes } from 'common/reducers/scofFlow';
import { loadAllSingleWindowApps, getEasipassList } from 'common/reducers/hubIntegration';
import FlowTriggerTable from '../compose/flowTriggerTable';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Panel } = Collapse;
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
  colon: false,
};

@injectIntl
@connect(
  (state) => {
    const { bizDelegation } = state.scofFlow.cmsParams;
    return {
      tenantSccCode: state.account.code,
      tenantId: state.account.tenantId,
      bizDelegation,
      cusPartners: bizDelegation.partners.filter(f => f.role === 'CUS' || f.role === 'OWN'),
      venPartners: bizDelegation.partners.filter(f => f.role === 'VEN' || f.role === 'OWN'),
      cmsDelgIdentity: state.scofFlow.cmsDelgIdentity,
      notSharedFlow: !state.scofFlow.currentFlow.main_flow_id,
    };
  },
  {
    getEasipassList, loadCmsQuotes, loadAllSingleWindowApps,
  }
)
export default class CMSDelegationPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func }).isRequired,
  }
  state = {
    ownerBrokerQuotes: [],
    ownerFwdQuotes: [],
    fwdBrokerQuotes: [],
  }
  componentWillReceiveProps(nextProps) {
    // componentDidMount时partners为空
    const nextPartners = nextProps.bizDelegation.partners;
    if ((nextProps.model && nextProps.model !== this.props.model) ||
      (nextPartners.length && nextPartners !== this.props.bizDelegation.partners)) {
      const {
        model, tenantId, cusPartners, venPartners, form: { setFieldsValue },
      } = nextProps;
      const ownerSccCode = model.owner_scc_code;
      let fwdSccCode = model.fwd_scc_code;
      const brokerSccCode = model.broker_scc_code;
      // if (!ownerSccCode && model.demander_tenant_id && model.demander_tenant_id !== -1 &&
      //   model.demander_tenant_id === model.provider_tenant_id) {
      //   const owner = cusPartners.find(f => f.tid === model.demander_tenant_id);
      //   ownerSccCode = owner && owner.partner_unique_code;
      // }
      if (!fwdSccCode && model.provider_tenant_id === tenantId) {
        const fwd = venPartners.find(f => f.tid === model.provider_tenant_id);
        fwdSccCode = fwd && fwd.partner_unique_code;
      }
      const identity = {
        owner_scc_code: ownerSccCode,
        fwd_scc_code: fwdSccCode,
        broker_scc_code: brokerSccCode,
      };
      this.handleLoadCmsQuotes(ownerSccCode, fwdSccCode, identity, cusPartners, venPartners);
      this.handleLoadCmsQuotes(ownerSccCode, brokerSccCode, identity, cusPartners, venPartners);
      this.handleLoadCmsQuotes(fwdSccCode, brokerSccCode, identity, cusPartners, venPartners);
      // TODO fix it
      setFieldsValue({
        ...identity,
        owner_fwd_quote: model.owner_fwd_quote,
        owner_broker_quote: model.owner_broker_quote,
        fwd_broker_quote: model.fwd_broker_quote,
      });
      if (brokerSccCode) {
        this.queryEPAndSWList(brokerSccCode, venPartners);
      }
    }
  }
  msg = formatMsg(this.props.intl)
  handleLoadCmsQuotes = (buyerCode, sellerCode, identity, cusPartners, venPartners) => {
    const { form: { setFieldsValue }, tenantSccCode } = this.props;
    const cusPartnerList = cusPartners || this.props.cusPartners;
    const venPartnerList = venPartners || this.props.venPartners;
    let buyerPartner;
    let sellerPartner;
    let quoteType;
    if (identity.owner_scc_code === tenantSccCode) {
      if (buyerCode === identity.owner_scc_code && sellerCode === identity.fwd_scc_code) {
        buyerPartner = cusPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ owner_fwd_quote: '' });
        quoteType = 'ownerFwdQuotes';
      } else if (buyerCode === identity.owner_scc_code && sellerCode === identity.broker_scc_code) {
        buyerPartner = cusPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ owner_broker_quote: '' });
        quoteType = 'ownerBrokerQuotes';
      }
    } else if (identity.fwd_scc_code === tenantSccCode) {
      if (buyerCode === identity.owner_scc_code && sellerCode === identity.fwd_scc_code) {
        buyerPartner = cusPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ owner_fwd_quote: '' });
        quoteType = 'ownerFwdQuotes';
      } else if (buyerCode === identity.fwd_scc_code && sellerCode === identity.broker_scc_code) {
        buyerPartner = venPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ fwd_broker_quote: '' });
        quoteType = 'fwdBrokerQuotes';
      }
    } else if (identity.broker_scc_code === tenantSccCode) {
      if (buyerCode === identity.owner_scc_code && sellerCode === identity.broker_scc_code) {
        buyerPartner = cusPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ owner_broker_quote: '' });
        quoteType = 'ownerBrokerQuotes';
      } else if (buyerCode === identity.fwd_scc_code && sellerCode === identity.broker_scc_code) {
        buyerPartner = cusPartnerList.find(f => f.partner_unique_code === buyerCode);
        sellerPartner = venPartnerList.find(f => f.partner_unique_code === sellerCode);
        setFieldsValue({ fwd_broker_quote: '' });
        quoteType = 'fwdBrokerQuotes';
      }
    }
    if (!buyerPartner || !sellerPartner || buyerCode === sellerCode) {
      if (quoteType) this.setState({ [quoteType]: [] });
      return;
    }
    this.props.loadCmsQuotes(
      { tenant_id: buyerPartner.tid, partner_id: buyerPartner.partner_id },
      { tenant_id: sellerPartner.tid, partner_id: sellerPartner.partner_id }
    ).then((result) => {
      if (!result.error) {
        this.setState({ [quoteType]: result.data });
      }
    });
  }
  handleOwnerChange = (ownerCode) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const fwdSccCode = getFieldValue('fwd_scc_code');
    const brokerSccCode = getFieldValue('broker_scc_code');
    const identity = {
      owner_scc_code: ownerCode,
      fwd_scc_code: fwdSccCode,
      broker_scc_code: brokerSccCode,
    };
    this.handleLoadCmsQuotes(ownerCode, fwdSccCode, identity);
    this.handleLoadCmsQuotes(ownerCode, brokerSccCode, identity);
    const { cusPartners, tenantId } = this.props;
    const ownerPartner = cusPartners.filter(cusp => cusp.partner_unique_code === ownerCode)[0];
    if (ownerPartner && ownerPartner.tid === tenantId) {
      setFieldsValue({ owner_self_dispatch: true });
    } else {
      setFieldsValue({ owner_self_dispatch: false });
    }
  }
  handleFwdChange = (fwdCode) => {
    const { getFieldValue } = this.props.form;
    const ownerSccCode = getFieldValue('owner_scc_code');
    const brokerSccCode = getFieldValue('broker_scc_code');
    const identity = {
      owner_scc_code: ownerSccCode,
      fwd_scc_code: fwdCode,
      broker_scc_code: brokerSccCode,
    };
    this.handleLoadCmsQuotes(ownerSccCode, fwdCode, identity);
    this.handleLoadCmsQuotes(fwdCode, brokerSccCode, identity);
  }
  handleBrokerChange = (brokerCode) => {
    const { getFieldValue } = this.props.form;
    const ownerSccCode = getFieldValue('owner_scc_code');
    const fwdSccCode = getFieldValue('fwd_scc_code');
    const identity = {
      owner_scc_code: ownerSccCode,
      fwd_scc_code: fwdSccCode,
      broker_scc_code: brokerCode,
    };
    this.handleLoadCmsQuotes(ownerSccCode, brokerCode, identity);
    this.handleLoadCmsQuotes(fwdSccCode, brokerCode, identity);
    this.queryEPAndSWList(brokerCode);
    // if (this.props.cmsDelgIdentity.fwdSccCode === brokerCode) { // 若已选报关行与货代一致，则清空货代选项
    //   this.props.setCmsDelgIdentity({ fwdSccCode: '' });
    // }
  }
  queryEPAndSWList = (brokerSccCode, nextVenPartners) => { // 加载单一窗口EP和SW列表
    const partners = nextVenPartners || this.props.venPartners;
    const customs = partners.find(f => f.partner_unique_code === brokerSccCode);
    if (!customs) return;
    this.props.getEasipassList(customs.customs_code);
    this.props.loadAllSingleWindowApps(customs.partner_unique_code);
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, model, tenantSccCode,
      bizDelegation: { declPorts }, cusPartners, venPartners, notSharedFlow,
    } = this.props;
    const declWays = model.kind === 'export' ? DECL_E_TYPE : DECL_I_TYPE;
    const {
      ownerBrokerQuotes, ownerFwdQuotes, fwdBrokerQuotes,
    } = this.state;
    const ownerSccCode = getFieldValue('owner_scc_code');
    const ownerPartner = cusPartners.filter(cusp => cusp.partner_unique_code === ownerSccCode)[0];
    const renderOwnerBrokerQuote = (
      <Col sm={24} lg={12} key="ownerBrokerQuoteNo">
        <FormItem label={this.msg('ownerBrokerQuoteNo')} {...formItemLayout}>
          {getFieldDecorator('owner_broker_quote', {
            // initialValue: model.owner_broker_quote,
          })(<Select allowClear showSearch optionFilterProp="children">
            {ownerBrokerQuotes.map(cq =>
              <Option value={cq.quote_no} key={cq.quote_no}>{cq.quote_name}</Option>)}
          </Select>)}
        </FormItem>
      </Col>);
    const renderOwnerFwdQuote = (
      <Col sm={24} lg={12} key="ownerFwdQuoteNo">
        <FormItem label={this.msg('ownerFwdQuoteNo')} {...formItemLayout}>
          {getFieldDecorator('owner_fwd_quote', {
            // initialValue: model.owner_fwd_quote,
          })(<Select allowClear showSearch optionFilterProp="children">
            {ownerFwdQuotes.map(cq =>
              <Option value={cq.quote_no} key={cq.quote_no}>{cq.quote_name}</Option>)}
          </Select>)}
        </FormItem>
      </Col>
    );
    const renderFwdBrokerQuote = (
      <Col sm={24} lg={12} key="fwdBrokerQuoteNo">
        <FormItem label={this.msg('fwdBrokerQuoteNo')} {...formItemLayout}>
          {getFieldDecorator('fwd_broker_quote', {
            // initialValue: model.fwd_broker_quote,
          })(<Select allowClear showSearch optionFilterProp="children">
            {fwdBrokerQuotes.map(cq =>
              <Option value={cq.quote_no} key={cq.quote_no}>{cq.quote_name}</Option>)}
          </Select>)}
        </FormItem>
      </Col>
    );
    /*
    const renderDisabledInput = (
      <Col sm={24} lg={12}>
        <FormItem {...formItemLayout}>
          <Input disabled />
        </FormItem>
      </Col>
    );
    */
    let renderQuote = null;
    if (getFieldValue('owner_scc_code') === tenantSccCode) {
      renderQuote = [/* renderDisabledInput, */renderOwnerFwdQuote, renderOwnerBrokerQuote];
    } else if (getFieldValue('fwd_scc_code') === tenantSccCode) {
      renderQuote = [renderOwnerFwdQuote, /* renderDisabledInput, */renderFwdBrokerQuote];
    } else if (getFieldValue('broker_scc_code') === tenantSccCode) {
      renderQuote = [renderOwnerBrokerQuote, renderFwdBrokerQuote/* ,renderDisabledInput */];
    }
    // else if (brokerSccCode === fwdSccCode === tenantSccCode) {
    //   renderQuote = [renderOwnerFwdQuote, renderDisabledInput, renderDisabledInput];
    // }
    return (
      <Collapse bordered={false} defaultActiveKey={['properties', 'events']}>
        <Panel header={this.msg('bizProperties')} key="properties">
          <Row gutter={16}>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('declWay')} {...formItemLayout}>
                {getFieldDecorator('decl_way', {
                  initialValue: model.decl_way,
                  rules: [{ required: true }],
                })(<Select allowClear showSearch optionFilterProp="children">
                  {
                    declWays.map(dw =>
                      <Option value={dw.key} key={dw.key}>{dw.value}</Option>)
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('transMode')} {...formItemLayout}>
                {getFieldDecorator('trans_mode', {
                  initialValue: model.trans_mode,
                })(<Select allowClear showSearch optionFilterProp="children">
                  {
                    TRANS_MODE.map(tr =>
                      <Option value={tr.value} key={tr.value}>{tr.text}</Option>)
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('declCustoms')} {...formItemLayout}>
                {getFieldDecorator('decl_port', {
                  initialValue: model.decl_port,
                })(<Select allowClear showSearch optionFilterProp="children">
                  {
                    declPorts.map(dp =>
                      <Option value={dp.code} key={dp.code}>{dp.code}|{dp.name}</Option>)
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('owner')} {...formItemLayout}>
                {getFieldDecorator('owner_scc_code', {
                  onChange: this.handleOwnerChange,
                })(<Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                  disabled={!notSharedFlow && getFieldValue('owner_scc_code')}
                >
                  {
                    cusPartners.map(cb =>
                      (<Option value={cb.partner_unique_code} key={cb.partner_unique_code}>
                        {[cb.partner_code, cb.name].filter(f => f).join('|')}
                      </Option>))
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('forwarder')} {...formItemLayout}>
                {getFieldDecorator('fwd_scc_code', {
                  onChange: this.handleFwdChange,
                })(<Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                >
                  {
                    venPartners.map(cb =>
                      (<Option value={cb.partner_unique_code} key={cb.partner_unique_code}>
                        {[cb.partner_code || cb.customs_code, cb.name].filter(f => f).join('|')}
                      </Option>))
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('broker')} {...formItemLayout}>
                {getFieldDecorator('broker_scc_code', {
                  onChange: this.handleBrokerChange,
                })(<Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 360 }}
                >
                  {
                    venPartners.map(cb =>
                      (<Option value={cb.partner_unique_code} key={cb.partner_unique_code}>
                        {[cb.customs_code, cb.name].filter(f => f).join('|')}
                      </Option>))
                  }
                </Select>)}
              </FormItem>
            </Col>
            {renderQuote}
            <Col sm={24} lg={12}>
              <FormItem label={this.msg('ownerDispVisible')} {...formItemLayout}>
                {getFieldDecorator('owner_self_dispatch', {
                  valuePropName: 'checked',
                  initialValue: !!model.owner_self_dispatch,
                })(<Switch disabled={!(notSharedFlow && ownerPartner
                  && ownerPartner.tid !== -1)}
                />)}
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel header={this.msg('bizEvents')} key="events">
          <FlowTriggerTable kind={model.kind} bizObj="cmsDelegation" />
        </Panel>
      </Collapse>
    );
  }
}
