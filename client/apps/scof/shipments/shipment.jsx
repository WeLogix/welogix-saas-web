import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Divider, Form, Row, Col, Card, Input, Select, Spin, Steps, Tag, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { GOODSTYPES, WRAP_TYPE, EXPEDITED_TYPES, SCOF_ORDER_TRANSFER, TRANS_MODES } from 'common/constants';
import { setClientForm } from 'common/reducers/sofOrders';
import { loadPartnerFlowList, loadFlowGraph, loadCwmBizParams } from 'common/reducers/scofFlow';
import { loadServiceTeamList } from 'common/reducers/saasCollab';
import { renderV1V2Options } from 'client/common/transformer';
import FormPane from 'client/components/FormPane';
import UserAvatar from 'client/components/UserAvatar';
import CountryFlag from 'client/components/CountryFlag';
import { LogixIcon } from 'client/components/FontIcon';
import CMSDelegateForm from './forms/cmsDelegateForm';
import TMSConsignForm from './forms/tmsConsignForm';
import CwmReceivingForm from './forms/cwmReceivingForm';
import CwmShippingForm from './forms/cwmShippingForm';
import PtsImpExpForm from './forms/ptsImpExpForm';
// import ContainerPane from './tabpane/containerPane';
import InvoicePane from './tabpane/invoicePane';
import ShipmentDetailsPane from './tabpane/shipmentDetailsPane';
import { formatMsg } from './message.i18n';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const InputGroup = Input.Group;
const { Step } = Steps;

const SeletableKeyNameMap = {};
GOODSTYPES.forEach((gt) => { SeletableKeyNameMap[`goods-${gt.value}`] = gt.text; });
WRAP_TYPE.forEach((wt) => { SeletableKeyNameMap[`wrap-${wt.value}`] = wt.text; });
SCOF_ORDER_TRANSFER.forEach((ot) => { SeletableKeyNameMap[`transfer-${ot.value}`] = ot.text; });
TRANS_MODES.forEach((ot) => { SeletableKeyNameMap[`transmode-${ot.value}`] = ot.text; });

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    formData: state.sofOrders.formData,
    formRequires: state.sofOrders.formRequires,
    flows: state.scofFlow.partnerFlows,
    graphLoading: state.scofFlow.graphLoading,
    serviceTeam: state.saasCollab.operators,
    orderTypes: state.sofOrderPref.requireOrderTypes,
    partners: state.partner.partners,
    countries: state.saasParams.latest.country,
    ports: state.saasParams.latest.port,
    currency: state.saasParams.latest.currency,
  }),
  {
    setClientForm,
    loadPartnerFlowList,
    loadFlowGraph,
    loadServiceTeamList,
    loadCwmBizParams,
  }
)
export default class ShipmentForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    operation: PropTypes.oneOf(['view', 'edit', 'create']),
    formData: PropTypes.shape({ shipmt_order_no: PropTypes.string }).isRequired,
    formRequires: PropTypes.shape({
      clients: PropTypes.arrayOf(PropTypes.shape({ partner_id: PropTypes.number })),
    }).isRequired,
    setClientForm: PropTypes.func.isRequired,
    graphLoading: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  state = {
    selPorts: [],
    matchingFlows: [], // 条件匹配的流程
    unMatchingFlows: [], // 条件未匹配的流程
  }
  componentDidMount() {
    const { formData } = this.props;
    this.handleOrderParamsLoad(formData);
    let selPorts = this.props.ports;
    if (formData.cust_shipmt_dept_port) {
      const deptPort = this.props.ports.filter(pot => pot.port_code
          === formData.cust_shipmt_dept_port)[0];
      if (deptPort) {
        selPorts = [deptPort].concat(selPorts.filter(pot =>
          pot.port_code !== formData.cust_shipmt_dept_port));
      }
    }
    if (formData.cust_shipmt_dest_port) {
      const destPort = this.props.ports.filter(pot => pot.port_code
          === formData.cust_shipmt_dest_port)[0];
      if (destPort) {
        selPorts = [destPort].concat(selPorts.filter(pot =>
          pot.port_code !== formData.cust_shipmt_dest_port));
      }
    }
    this.setState({ selPorts: selPorts.slice(0, 20) });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData.customer_partner_id !== this.props.formData.customer_partner_id) {
      this.handleOrderParamsLoad(nextProps.formData);
    }
  }
  handleOrderParamsLoad = (formData) => {
    if (formData.customer_partner_id) {
      this.props.loadPartnerFlowList({ partnerId: formData.customer_partner_id }).then((result) => {
        if (!result.error) {
          this.handleMatchingFlows();
        }
      });
      this.props.loadCwmBizParams(formData.customer_partner_id);
      this.props.loadServiceTeamList({ partnerId: formData.customer_partner_id });
    }
  }
  msg = formatMsg(this.props.intl)
  handleClientChange = (value) => {
    const selPartnerId = Number(value);
    const client = this.props.partners.find(cl => cl.id === selPartnerId) || {
      name: '',
      partner_tenant_id: null,
      id: null,
      partner_code: null,
    };
    this.props.setClientForm(-1, {
      flow_id: null,
      customer_name: client.name,
      customer_tenant_id: client.partner_tenant_id,
      customer_partner_id: client.id,
      customer_partner_code: client.partner_code,
      subOrders: [],
    });
  }
  handleFlowChange = (value) => {
    if (value === this.props.formData.flow_id) {
      return;
    }
    if (!value) {
      this.props.setClientForm(-1, {
        flow_id: null,
        subOrders: [],
      });
    } else {
      const flow = this.props.flows.filter(flw => flw.id === value)[0];
      this.props.loadFlowGraph(value, flow.main_flow_id).then((result) => {
        if (!result.error) {
          const subOrders = [];
          let { nodes } = result.data;
          if (flow.main_flow_id) {
            nodes = nodes.filter(nd => nd.provider_tenant_id === this.props.tenantId);
          }
          const { edges } = result.data;
          const nodeEndMap = {};
          for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const targetNode = nodes.filter(node => node.id === edge.target)[0];
            if (targetNode) {
              if (nodeEndMap[edge.source]) {
                nodeEndMap[edge.source].push(targetNode);
              } else {
                nodeEndMap[edge.source] = [targetNode];
              }
            }
          }
          const levelNodes = [nodes.filter(node => node.in_degree === 0)];
          let nlevel = 0;
          const visitedMap = {};
          while (levelNodes.length > 0 && Object.keys(visitedMap).length < nodes.length) {
            const visitNodes = [];
            levelNodes[nlevel].forEach((node) => {
              visitNodes.push(node);
              visitedMap[node.id] = true;
            });
            nlevel += 1;
            levelNodes.push([]);
            while (visitNodes.length) {
              const vn = visitNodes.shift();
              const vnEnds = nodeEndMap[vn.id];
              if (Array.isArray(vnEnds)) {
                for (let j = 0; j < vnEnds.length; j++) {
                  const vne = vnEnds[j];
                  if (!visitedMap[vne.id]) {
                    levelNodes[nlevel].push(vne);
                    visitedMap[vne.id] = true;
                  }
                }
              }
            }
          }
          levelNodes.forEach((lnodes, level) => {
            lnodes.sort((na, nb) => (na.id < nb.id ? -1 : 1));
            lnodes.forEach((node) => {
              const nodeAttr = {
                node_uuid: node.id,
                kind: node.kind,
                name: node.name,
                in_degree: node.in_degree,
                out_degree: node.out_degree,
                multi_bizobj: node.multi_bizobj,
                // demander_tenant_id: node.demander_tenant_id,
                // demander_partner_id: node.demander_partner_id,
                provider_tenant_id: node.provider_tenant_id,
                person_id: node.person_id,
                bizObjNeedLoad: true,
              };
              if (node.kind === 'tms') {
                subOrders.push({
                  node: {
                    ...nodeAttr,
                    level,
                    consigner_id: null,
                    consignee_id: null,
                    pack_count: null,
                    gross_wt: null,
                    trs_mode_id: null,
                    trs_mode_code: null,
                    trs_mode: '',
                    remark: '',
                    package: '',
                  },
                });
              } else if (node.kind === 'import' || node.kind === 'export') {
                subOrders.push({
                  node: {
                    ...nodeAttr,
                    level,
                    pack_count: null,
                    gross_wt: null,
                    remark: '',
                    package: '',
                  },
                  files: [],
                });
              } else if (node.kind === 'cwmrec' || node.kind === 'cwmship') {
                subOrders.push({
                  node: {
                    ...nodeAttr,
                    level,
                  },
                });
              } else if (node.kind === 'ptsimp' || node.kind === 'ptsexp') {
                subOrders.push({
                  node: {
                    ...nodeAttr,
                    level,
                  },
                });
              } else if (node.kind === 'terminal') {
                subOrders.push({
                  node: {
                    node_uuid: node.id,
                    kind: node.kind,
                    in_degree: node.in_degree,
                    out_degree: node.out_degree,
                    level,
                  },
                });
              }
            });
          });
          this.props.setClientForm(-1, { flow_id: value, subOrders });
        }
      });
    }
  }
  handlePortChange = (portSearch) => {
    const { formData } = this.props;
    const selPorts = this.props.ports.filter((pot) => {
      const filtered = pot.port_code.indexOf(portSearch.toUpperCase()) >= 0 ||
          pot.port_c_cod.indexOf(portSearch) >= 0;
      return filtered;
    }).slice(0, 20);
    if (formData.cust_shipmt_dept_port &&
      !selPorts.find(pot => pot.port_code === formData.cust_shipmt_dept_port)) {
      const deptPort = this.props.ports.find(pot => pot.port_code
        === formData.cust_shipmt_dept_port);
      if (deptPort) {
        selPorts.push(deptPort);
      }
    }
    if (formData.cust_shipmt_dest_port &&
      !selPorts.find(pot => pot.port_code === formData.cust_shipmt_dest_port)) {
      const destPort = this.props.ports.find(pot => pot.port_code
        === formData.cust_shipmt_dest_port);
      if (destPort) {
        selPorts.push(destPort);
      }
    }
    this.setState({ selPorts });
  }
  handleChange = (key, value) => {
    let formVal = value;
    if (formVal === '' || formVal === undefined || formVal === null) {
      formVal = null;
    }
    this.props.setClientForm(-1, { [key]: formVal });
  }
  handleKvChange = (key, value, prefix) => {
    this.props.setClientForm(-1, { [key]: value, [`${key}_name`]: SeletableKeyNameMap[`${prefix}-${value}`] });
  }
  handleOrderTypeChange = (value) => {
    const orderType = this.props.orderTypes.filter(ort => ort.id === Number(value))[0];
    if (orderType) {
      this.props.setClientForm(-1, {
        cust_shipmt_order_type: Number(value),
        cust_shipmt_transfer: orderType.transfer,
      });
    }
  }
  handleMatchingFlows = (type, value) => {
    const { flows, formData } = this.props;
    const unMatchingFlows = [];
    const matchingFlows = [];
    const transMode = type === 'transmode' ? value : formData.cust_shipmt_trans_mode;
    const transfer = type === 'transfer' ? value : formData.cust_shipmt_transfer;
    const person = type === 'person' ? value : formData.exec_login_id;
    flows.forEach((fl) => {
      if (transMode && fl.flow_trans_mode !== transMode) {
        unMatchingFlows.push(fl);
        return;
      }
      if (transfer && fl.flow_transfer_ieflag !== transfer) {
        unMatchingFlows.push(fl);
        return;
      }
      if (person) {
        if (!fl.flow_exec_logins || !fl.flow_exec_logins.split(',').find(lg => Number(lg) === person)) {
          unMatchingFlows.push(fl);
          return;
        }
      }
      if (transMode || transfer || person) {
        matchingFlows.push(fl);
      } else {
        unMatchingFlows.push(fl);
      }
    });
    this.setState({ matchingFlows, unMatchingFlows });
    if (matchingFlows.length === 1) {
      this.handleFlowChange(matchingFlows[0].id);
    }
  }
  handlePersonChange = (value) => {
    this.handleChange('exec_login_id', value);
    this.handleMatchingFlows('person', value);
  }
  handleTransferChange = (value) => {
    this.handleKvChange('cust_shipmt_transfer', value, 'transfer');
    this.handleMatchingFlows('transfer', value);
  }
  handleModeChange = (value) => {
    this.handleKvChange('cust_shipmt_trans_mode', value, 'transmode');
    this.handleMatchingFlows('transmode', value);
  }
  renderSteps = (subOrders, shipment) => {
    const { operation, disabled } = this.props;
    const steps = [];
    for (let i = 0; i < subOrders.length; i++) {
      const order = subOrders[i];
      const { node } = order;
      if (node.kind === 'import' || node.kind === 'export') {
        steps.push(<Step key={node.node_uuid} title={node.name} status="process" description={<CMSDelegateForm disabled={disabled} formData={order} shipment={shipment} index={i} operation={operation} />} />);
      } else if (node.kind === 'tms') {
        steps.push(<Step key={node.node_uuid} title={node.name} status="process" description={<TMSConsignForm disabled={disabled} formData={order} shipment={shipment} index={i} operation={operation} />} />);
      } else if (node.kind === 'cwmrec') {
        steps.push(<Step key={node.node_uuid} title={node.name} status="process" description={<CwmReceivingForm disabled={disabled} formData={order} index={i} operation={operation} />} />);
      } else if (node.kind === 'cwmship') {
        steps.push(<Step key={node.node_uuid} title={node.name} status="process" description={<CwmShippingForm disabled={disabled} formData={order} index={i} operation={operation} />} />);
      } else if (node.kind === 'ptsimp' || node.kind === 'ptsexp') {
        steps.push(<Step key={node.node_uuid} title={node.name} status="process" description={<PtsImpExpForm disabled={disabled} formData={order} index={i} operation={operation} />} />);
      }
    }
    return steps;
  }
  renderPartnerSelect = (selItemProps) => {
    const { partners, disabled } = this.props;
    return (
      <Select
        showSearch
        allowClear
        optionFilterProp="children"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        {...selItemProps}
        disabled={disabled}
      >
        {partners.map(data => (
          <Option key={String(data.id)} value={String(data.id)}><Tag>{this.msg(data.role)}</Tag>{
            data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}</Option>))}
      </Select>
    );
  }
  render() {
    const {
      formRequires, formData, serviceTeam, orderTypes, disabled,
    } = this.props;
    const { unMatchingFlows, matchingFlows } = this.state;
    const { selPorts } = this.state;
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
    const formItemSpan2Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      colon: false,
    };
    const orderShipment = {
      cust_shipmt_trans_mode: formData.cust_shipmt_trans_mode,
      cust_shipmt_mawb: formData.cust_shipmt_mawb,
      cust_shipmt_hawb: formData.cust_shipmt_hawb,
      cust_shipmt_bill_lading: formData.cust_shipmt_bill_lading,
      cust_shipmt_bill_lading_no: formData.cust_shipmt_bill_lading_no,
      cust_shipmt_vessel: formData.cust_shipmt_vessel,
      cust_shipmt_voy: formData.cust_shipmt_voy,
      cust_shipmt_pieces: formData.cust_shipmt_pieces,
      cust_shipmt_weight: formData.cust_shipmt_weight,
      cust_shipmt_volume: formData.cust_shipmt_volume,
      cust_shipmt_expedited: formData.cust_shipmt_expedited,
      cust_shipmt_goods_type: formData.cust_shipmt_goods_type,
      cust_shipmt_wrap_type: formData.cust_shipmt_wrap_type,
    };
    const current = formData.subOrders.length || 0;
    /*
    const cargoTransferHint = (
      <ul>
        根据货物是否有实际国际运输区分
        <li>货物进口: 有实际进境运输</li>
        <li>货物出口: 有实际出境运输</li>
        <li>国内流转: 无实际进出境运输</li>
      </ul>
    );
    */
    // const shipmentDisabled = !formData.cust_shipmt_transfer
    // || formData.cust_shipmt_transfer === 'DOM';
    // const shipmentActiveKey = shipmentDisabled ? [] : ['shipment'];
    let ext1Label = { label: '扩展字段1' };
    let ext2Label = { label: '扩展字段2' };
    let ext3Label = { label: '扩展字段3' };
    let ext4Label = { label: '扩展字段4' };
    if (formData.cust_shipmt_order_type) {
      const orderType = orderTypes.filter(ort =>
        ort.id === Number(formData.cust_shipmt_order_type))[0];
      const ext1 = orderType.ext1_params ? JSON.parse(orderType.ext1_params) : {};
      if (ext1.enabled) {
        ext1Label = {
          label: ext1.title || ext1Label.label,
          required: ext1.required,
        };
      } else {
        ext1Label = null;
      }
      const ext2 = orderType.ext2_params ? JSON.parse(orderType.ext2_params) : {};
      if (ext2.enabled) {
        ext2Label = {
          label: ext2.title || ext2Label.label,
          required: ext2.required,
        };
      } else {
        ext2Label = null;
      }
      const ext3 = orderType.ext3_params ? JSON.parse(orderType.ext3_params) : {};
      if (ext3.enabled) {
        ext3Label = {
          label: ext3.title || ext3Label.label,
          required: ext3.required,
        };
      } else {
        ext3Label = null;
      }
      const ext4 = orderType.ext4_params ? JSON.parse(orderType.ext4_params) : {};
      if (ext4.enabled) {
        ext4Label = {
          label: ext4.title || ext4Label.label,
          required: ext4.required,
        };
      } else {
        ext4Label = null;
      }
    }
    let labelCountry = this.msg('originCountry');
    // let labelIEPort = this.msg('importPort');
    if (formData.cust_shipmt_transfer === 'EXP') {
      labelCountry = this.msg('destCountry');
      // labelIEPort = this.msg('exportPort');
    }
    return (
      <div>
        <Card bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey="main">
            <TabPane tab="基本信息" key="main">
              <FormPane>
                <Card>
                  <Row>
                    <Col span={6}>
                      <FormItem label={this.msg('customer')} {...formItemLayout} required>
                        {this.renderPartnerSelect({
                          placeholder: '请选择客户',
                          onChange: this.handleClientChange,
                          value: String(formData.customer_partner_id || ''),
                        })}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('custOrderNo')} {...formItemLayout}>
                        <Input disabled={disabled} value={formData.cust_order_no} onChange={e => this.handleChange('cust_order_no', e.target.value)} />
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('expedited')} {...formItemLayout}>
                        <Select disabled={disabled} value={formData.cust_shipmt_expedited} onChange={value => this.handleChange('cust_shipmt_expedited', value)}>
                          <Option value={EXPEDITED_TYPES[0].value}>
                            <Tag>{EXPEDITED_TYPES[0].text}</Tag></Option>
                          <Option value={EXPEDITED_TYPES[1].value}>
                            <Tag color="#ffbf00">{EXPEDITED_TYPES[1].text}</Tag></Option>
                          <Option value={EXPEDITED_TYPES[2].value}>
                            <Tag color="#f04134">{EXPEDITED_TYPES[2].text}</Tag></Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('personResponsible')} {...formItemLayout}>
                        <Select
                          allowClear
                          value={formData.exec_login_id}
                          onChange={this.handlePersonChange}
                          disabled={disabled}
                        >
                          {serviceTeam.map(st => <Option value={st.lid} key={st.lid}><UserAvatar size="small" loginId={st.lid} showName /></Option>)}
                          <Option value={this.props.loginId} key={this.props.loginId}><UserAvatar size="small" loginId={this.props.loginId} showName /></Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                  <Divider dashed />
                  <Row>
                    <Col span={12}>
                      <FormItem label={this.msg('transfer')} {...formItemSpan2Layout} required>
                        {orderTypes.length === 0 ?
                          <Select
                            value={formData.cust_shipmt_transfer}
                            onChange={this.handleTransferChange}
                            disabled={disabled}
                          >
                            {SCOF_ORDER_TRANSFER.map(sot =>
                          (<Option value={sot.value} key={sot.value}>
                            {sot.text}</Option>))}
                          </Select> :
                          <Select
                            value={formData.cust_shipmt_order_type &&
                              String(formData.cust_shipmt_order_type)}
                            onChange={this.handleOrderTypeChange}
                            disabled={disabled}
                          >
                            {orderTypes.map(ort =>
                          (<Option value={String(ort.id)} key={ort.id}>
                            {ort.name}</Option>))}
                          </Select>
                      }
                      </FormItem>
                    </Col>
                  </Row>
                  {formData.cust_shipmt_transfer !== 'DOM' &&
                  <Row>
                    <Col span={6}>
                      <FormItem label={this.msg('transMode')} {...formItemLayout} required={formData.cust_shipmt_transfer !== 'DOM'}>
                        <Select
                          value={formData.cust_shipmt_trans_mode}
                          onChange={this.handleModeChange}
                          disabled={disabled || !formData.cust_shipmt_transfer || formData.cust_shipmt_transfer === 'DOM'}
                        >
                          <Option value={TRANS_MODES[0].value}>
                            <LogixIcon type={TRANS_MODES[0].icon} /> {TRANS_MODES[0].text}
                          </Option>
                          <Option value={TRANS_MODES[1].value}>
                            <LogixIcon type={TRANS_MODES[1].icon} /> {TRANS_MODES[1].text}</Option>
                          <Option value={TRANS_MODES[3].value}>
                            <LogixIcon type={TRANS_MODES[3].icon} /> {TRANS_MODES[3].text}
                          </Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={labelCountry} {...formItemLayout}>
                        <Select
                          showSearch
                          allowClear
                          optionFilterProp="search"
                          optionLabelProp="title"
                          value={formData.cust_shipmt_orig_dest_country}
                          onChange={value =>
                                this.handleChange('cust_shipmt_orig_dest_country', value)}
                          disabled={disabled}
                        >
                          {renderV1V2Options(this.props.countries.map(cntry => ({
                              code: cntry.cntry_co,
                              code_v1: cntry.cntry_co_v1,
                              text: cntry.cntry_name_cn,
                            }))).map(cntry => (
                              <Option
                                key={cntry.value}
                                value={cntry.value}
                                search={cntry.search}
                                title={cntry.title}
                              >
                                <CountryFlag code={cntry.value} />
                                {cntry.text}
                              </Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    {/* <Col span={6}>
                          <FormItem label={labelIEPort} {...formItemLayout}>
                            <Select
                              showSearch
                              allowClear
                              optionFilterProp="children"
                              value={formData.cust_shipmt_i_e_port}
                              onChange={value =>
                                this.handleChange('cust_shipmt_i_e_port', value)}
                            >
                              {this.props.formRequires.declPorts.map(custport => (
                                <Option key={custport.code} value={custport.code}>
                                  {custport.code} | {custport.name}
                                </Option>))}
                            </Select>
                          </FormItem>
                              </Col> */}
                    <Col span={6}>
                      <FormItem label={this.msg('deptPort')} {...formItemLayout}>
                        <Select
                          filterOption={false}
                          showSearch
                          allowClear
                          value={formData.cust_shipmt_dept_port}
                          onSearch={this.handlePortChange}
                          onChange={value => this.handleChange('cust_shipmt_dept_port', value)}
                          disabled={disabled}
                        >
                          {selPorts.map(pot => (
                            <Option key={pot.port_code} value={pot.port_code}>
                              {pot.port_code } | {pot.port_c_cod}
                            </Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('destPort')} {...formItemLayout}>
                        <Select
                          filterOption={false}
                          showSearch
                          allowClear
                          value={formData.cust_shipmt_dest_port}
                          onSearch={this.handlePortChange}
                          onChange={value => this.handleChange('cust_shipmt_dest_port', value)}
                          disabled={disabled}
                        >
                          {selPorts.map(pot => (
                            <Option key={pot.port_code} value={pot.port_code}>
                              {pot.port_code } | {pot.port_c_cod}
                            </Option>))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '2') &&
                      <FormItem label={this.msg('billLading')} {...formItemLayout}>
                        <Input
                          placeholder="提单号*分提单号"
                          value={formData.cust_shipmt_bill_lading}
                          onChange={e => this.handleChange('cust_shipmt_bill_lading', e.target.value)}
                          disabled={disabled}
                        />
                      </FormItem>}
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '5') &&
                      <FormItem label={this.msg('mawb')} {...formItemLayout}>
                        <Input disabled={disabled} value={formData.cust_shipmt_mawb} onChange={e => this.handleChange('cust_shipmt_mawb', e.target.value)} />
                      </FormItem>}
                    </Col>
                    <Col span={6}>
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '2') &&
                      <FormItem label={this.msg('billLadingNo')} {...formItemLayout}>
                        <Input disabled={disabled} value={formData.cust_shipmt_bill_lading_no} onChange={e => this.handleChange('cust_shipmt_bill_lading_no', e.target.value)} />
                      </FormItem>}
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '5') &&
                      <FormItem label={this.msg('custShipmtHawb')} {...formItemLayout}>
                        <Input disabled={disabled} value={formData.cust_shipmt_hawb} onChange={e => this.handleChange('cust_shipmt_hawb', e.target.value)} />
                      </FormItem>}
                    </Col>
                    <Col span={6}>
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '5') &&
                      <FormItem label={this.msg('flightNo')} {...formItemLayout}>
                        <Input disabled={disabled} value={formData.cust_shipmt_vessel} onChange={e => this.handleChange('cust_shipmt_vessel', e.target.value)} />
                      </FormItem>}
                      { (formData.cust_shipmt_transfer !== 'DOM' && formData.cust_shipmt_trans_mode === '2') &&
                      <FormItem label={this.msg('shipNameVoyage')} {...formItemLayout}>
                        <InputGroup compact>
                          <Input
                            style={{ width: '60%' }}
                            placeholder="船舶英文名称"
                            value={formData.cust_shipmt_vessel}
                            onChange={e => this.handleChange('cust_shipmt_vessel', e.target.value)}
                            disabled={disabled}
                          />
                          <Input
                            style={{ width: '40%' }}
                            placeholder="航次号"
                            value={formData.cust_shipmt_voy}
                            onChange={e => this.handleChange('cust_shipmt_voy', e.target.value)}
                            disabled={disabled}
                          />
                        </InputGroup>
                      </FormItem>}
                    </Col>
                  </Row>}
                  {formData.cust_shipmt_transfer !== 'DOM' &&
                  <Row>
                    <Col span={6}>
                      <FormItem label={this.msg('forwarder')} {...formItemLayout}>
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          value={formData.cust_shipmt_forwarder}
                          onChange={value => this.handleChange('cust_shipmt_forwarder', value)}
                          disabled={disabled}
                        >
                          {formRequires.customsBrokers.map(cb =>
                      (<Option value={String(cb.partner_id)} key={String(cb.partner_id)}>
                        {cb.partner_code}|{cb.name}</Option>)) }
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('freight')} {...formItemLayout}>
                        <InputGroup compact>
                          <Input
                            type="number"
                            placeholder="单价/总价"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_freight}
                            onChange={e => this.handleChange('cust_shipmt_freight', e.target.value)}
                            disabled={disabled}
                          />
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="search"
                            optionLabelProp="title"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_freight_currency}
                            onChange={value => this.handleChange('cust_shipmt_freight_currency', value)}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: 220 }}
                            disabled={disabled}
                          >
                            {renderV1V2Options(this.props.currency.map(curr => ({
                                code: curr.curr_code,
                                code_v1: curr.curr_code_v1,
                                text: curr.curr_name,
                              }))).map(data => (
                                <Option
                                  key={data.value}
                                  value={data.value}
                                  title={data.title}
                                  search={data.search}
                                >
                                  {data.text}</Option>))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('insurFee')} {...formItemLayout}>
                        <InputGroup compact>
                          <Input
                            type="number"
                            placeholder="总价"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_insur_fee}
                            onChange={e => this.handleChange('cust_shipmt_insur_fee', e.target.value)}
                            disabled={disabled}
                          />
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="search"
                            optionLabelProp="title"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_insur_currency}
                            onChange={value => this.handleChange('cust_shipmt_insur_currency', value)}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: 220 }}
                            disabled={disabled}
                          >
                            {renderV1V2Options(this.props.currency.map(curr => ({
                                code: curr.curr_code,
                                code_v1: curr.curr_code_v1,
                                text: curr.curr_name,
                              }))).map(data => (
                                <Option
                                  key={data.value}
                                  value={data.value}
                                  title={data.title}
                                  search={data.search}
                                >
                                  {data.text}</Option>))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('miscFee')} {...formItemLayout}>
                        <InputGroup compact>
                          <Input
                            type="number"
                            placeholder="总价"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_misc_fee}
                            onChange={e => this.handleChange('cust_shipmt_misc_fee', e.target.value)}
                            disabled={disabled}
                          />
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="search"
                            optionLabelProp="title"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_misc_currency}
                            onChange={value => this.handleChange('cust_shipmt_misc_currency', value)}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: 220 }}
                            disabled={disabled}
                          >
                            {renderV1V2Options(this.props.currency.map(curr => ({
                                code: curr.curr_code,
                                code_v1: curr.curr_code_v1,
                                text: curr.curr_name,
                              }))).map(data => (
                                <Option
                                  key={data.value}
                                  value={data.value}
                                  title={data.title}
                                  search={data.search}
                                >
                                  {data.text}</Option>))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>
                  </Row>}
                  <Row>
                    <Col span={6}>
                      <FormItem label={this.msg('goodsType')} {...formItemLayout}>
                        <Select disabled={disabled} value={formData.cust_shipmt_goods_type} onChange={value => this.handleKvChange('cust_shipmt_goods_type', value, 'goods')}>
                          <Option value={GOODSTYPES[0].value}>
                            <Tag>GN</Tag>{GOODSTYPES[0].text}</Option>
                          <Option value={GOODSTYPES[1].value}>
                            <Tag color="#2db7f5">FR</Tag>{GOODSTYPES[1].text}</Option>
                          <Option value={GOODSTYPES[2].value}>
                            <Tag color="#f50">DG</Tag>{GOODSTYPES[2].text}</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={`${this.msg('pieces')}/${this.msg('wrapType')}`} {...formItemLayout}>
                        <InputGroup compact>
                          <Input
                            type="number"
                            style={{ width: '50%' }}
                            value={formData.cust_shipmt_pieces}
                            onChange={(ev) => {
                              const pieces = parseFloat(ev.target.value);
                              if (!Number.isNaN(pieces)) {
                                this.handleChange('cust_shipmt_pieces', ev.target.value);
                              } else {
                                this.handleChange('cust_shipmt_pieces', null);
                              }
                            }}
                            disabled={disabled}
                          />
                          <Select
                            style={{ width: '50%' }}
                            placeholder="选择包装方式"
                            onChange={value => this.handleKvChange('cust_shipmt_wrap_type', value, 'wrap')}
                            value={formData.cust_shipmt_wrap_type}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: 240 }}
                            disabled={disabled}
                          >
                            {WRAP_TYPE.map(wt => (<Option value={wt.value} key={wt.value}>
                              {wt.text}</Option>))}
                          </Select>
                        </InputGroup>
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('totalGrossWt')} {...formItemLayout}>
                        <Input
                          type="number"
                          addonAfter="KG"
                          value={formData.cust_shipmt_weight}
                          onChange={(ev) => {
                            let weight = parseFloat(ev.target.value);
                            if (Number.isNaN(weight)) {
                              weight = null;
                            }
                              this.handleChange('cust_shipmt_weight', weight);
                          }}
                          disabled={disabled}
                        />
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label={this.msg('CBM')} {...formItemLayout}>
                        <Input
                          type="number"
                          addonAfter={this.msg('立方米')}
                          value={formData.cust_shipmt_volume}
                          onChange={(ev) => {
                            const volume = parseFloat(ev.target.value);
                            if (!Number.isNaN(volume)) {
                              this.handleChange('cust_shipmt_volume', volume);
                            } else {
                              this.handleChange('cust_shipmt_volume', null);
                            }
                          }}
                          disabled={disabled}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Collapse bordered={false} defaultActiveKey="shipment">
                    <Panel header="扩展属性" key="ext" style={{ borderBottom: 'none' }} >
                      <Row>
                        {ext1Label &&
                        <Col span={6}>
                          <FormItem {...ext1Label} {...formItemLayout}>
                            <Input disabled={disabled} value={formData.ext_attr_1} onChange={e => this.handleChange('ext_attr_1', e.target.value)} />
                          </FormItem>
                        </Col>}
                        {ext2Label &&
                        <Col span={6}>
                          <FormItem {...ext2Label} {...formItemLayout}>
                            <Input disabled={disabled} value={formData.ext_attr_2} onChange={e => this.handleChange('ext_attr_2', e.target.value)} />
                          </FormItem>
                        </Col>}
                        {ext3Label &&
                        <Col span={6}>
                          <FormItem {...ext3Label} {...formItemLayout}>
                            <Input disabled={disabled} value={formData.ext_attr_3} onChange={e => this.handleChange('ext_attr_3', e.target.value)} />
                          </FormItem>
                        </Col>}
                        {ext4Label &&
                        <Col span={6}>
                          <FormItem {...ext4Label} {...formItemLayout}>
                            <Input disabled={disabled} value={formData.ext_attr_4} onChange={e => this.handleChange('ext_attr_4', e.target.value)} />
                          </FormItem>
                        </Col>}
                        <Col span={12}>
                          <FormItem label={this.msg('custRemark')} {...formItemSpan2Layout}>
                            <Input disabled={disabled} value={formData.cust_remark} onChange={e => this.handleChange('cust_remark', e.target.value)} />
                          </FormItem>
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                  <Divider dashed />
                  <Row><Col span={12}>
                    <FormItem label={this.msg('flowId')} {...formItemSpan2Layout} required>
                      <Select
                        placeholder="请选择流程规则"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        value={formData.flow_id}
                        onChange={this.handleFlowChange}
                        disabled={disabled}
                      >
                        <OptGroup label="匹配流程" >
                          {matchingFlows.map(data =>
                            <Option key={data.id} value={data.id}>{data.name}</Option>)}
                        </OptGroup>
                        <OptGroup label="其他流程" >
                          {unMatchingFlows.map(data =>
                            <Option key={data.id} value={data.id}>{data.name}</Option>)}
                        </OptGroup>
                      </Select>
                    </FormItem>
                  </Col></Row>
                  <Spin spinning={this.props.graphLoading}>
                    <Steps direction="vertical" current={current}>
                      {this.renderSteps(formData.subOrders, orderShipment)}
                    </Steps>
                  </Spin>
                </Card>
              </FormPane>
            </TabPane>
            <TabPane tab={this.msg('commInvoices')} key="invoice" disabled={!formData.shipmt_order_no}>
              <InvoicePane disabled={disabled} />
            </TabPane>
            {/*
              <TabPane
              tab="集装箱"
              key="container"
              disabled={
              !formData.shipmt_order_no || formData.cust_shipmt_transfer === 'DOM'
              || formData.cust_shipmt_trans_mode === '5'
            }
            >
              <ContainerPane />
            </TabPane>
          */}
            <TabPane tab={this.msg('shipmentDetails')} key="details" disabled={!formData.shipmt_order_no}>
              <ShipmentDetailsPane orderNo={formData.shipmt_order_no} />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
