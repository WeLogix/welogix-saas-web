import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Row, Col, Select, message } from 'antd';
import { DECL_I_TYPE, DECL_E_TYPE } from 'common/constants';
import { setClientForm, loadFlowNodeData } from 'common/reducers/sofOrders';
import { intlShape, injectIntl } from 'react-intl';
import { uuidWithoutDash } from 'client/common/uuid';
import FormPane from 'client/components/FormPane';
import UserAvatar from 'client/components/UserAvatar';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    formRequires: state.sofOrders.formRequires,
    // cmsQuotes: state.scofFlow.cmsQuotes,
    serviceTeam: state.saasCollab.operators,
    tenantId: state.account.tenantId,
  }),
  { setClientForm, loadFlowNodeData }
)
export default class CMSDelegateForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    index: PropTypes.number.isRequired,
    operation: PropTypes.oneOf(['view', 'edit', 'create']),
    formData: PropTypes.shape({
      node: PropTypes.shape({ node_uuid: PropTypes.string }),
    }).isRequired,
    formRequires: PropTypes.shape({
      declPorts: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
    }).isRequired,
    serviceTeam: PropTypes.arrayOf(PropTypes.shape({
      lid: PropTypes.number.isRequired, name: PropTypes.string.isRequired,
    })),
    shipment: PropTypes.shape({
      cust_shipmt_trans_mode: PropTypes.string.isRequired,
      cust_shipmt_mawb: PropTypes.string,
      cust_shipmt_hawb: PropTypes.string,
      cust_shipmt_bill_lading: PropTypes.string,
    }),
    setClientForm: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  componentDidMount() {
    const { formData: { node } } = this.props;
    if (!node.uuid && node.node_uuid) {
      this.props.loadFlowNodeData(node.node_uuid, node.kind).then((result) => {
        if (!result.error) {
          this.handleSetClientForm({
            ...result.data,
            uuid: uuidWithoutDash(),
            bizObjNeedLoad: false,
          });
        } else {
          message.error(result.error.message);
        }
      });
    }
  }
  msg = key => formatMsg(this.props.intl, key)
  handleSetClientForm = (data) => {
    const { index, formData } = this.props;
    const newData = { ...formData, node: { ...formData.node, ...data } };
    this.props.setClientForm(index, newData);
  }
  handleUploadFiles = (fileList) => {
    const { index, formData } = this.props;
    this.props.setClientForm(index, { ...formData, files: fileList });
  }
  handleChange = (key, value) => {
    this.handleSetClientForm({ [key]: value });
  }
  handlePersonChange = (value) => {
    const person = this.props.serviceTeam.filter(st => st.lid === value)[0];
    if (person) {
      this.handleSetClientForm({ person_id: value, person: person.name });
    }
  }
  handleShipmentRelate = () => {
    const { shipment, formData } = this.props;
    const related = {
      gross_wt: shipment.cust_shipmt_weight,
      wrap_type: shipment.cust_shipmt_wrap_type,
      pack_count: shipment.cust_shipmt_pieces,
      traf_name: shipment.cust_shipmt_vessel || formData.node.traf_name,
      voyage_no: shipment.cust_shipmt_voy,
    };
    if (shipment.cust_shipmt_trans_mode) {
      related.trans_mode = shipment.cust_shipmt_trans_mode;
      if (related.trans_mode === '2') {
        related.bl_wb_no = shipment.cust_shipmt_bill_lading;
      } else if (related.trans_mode === '5') {
        related.bl_wb_no = [shipment.cust_shipmt_mawb, shipment.cust_shipmt_hawb].filter(awb => awb).join('_');
      }
    }
    this.handleSetClientForm(related);
  }
  render() {
    const {
      formData, formRequires, serviceTeam, tenantId, disabled,
    } = this.props;
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
    const { node } = formData;
    const declWays = node.kind === 'export' ? DECL_E_TYPE : DECL_I_TYPE;
    const provider = node.provider_tenant_id === tenantId;
    return (
      <FormPane descendant>
        <Row>
          <Col span={6}>
            <FormItem label={this.msg('declareWay')} {...formItemLayout}>
              <Select disabled={disabled} value={node.decl_way_code} onChange={value => this.handleChange('decl_way_code', value)}>
                { declWays.map(dw => <Option value={dw.key} key={dw.key}>{dw.value}</Option>) }
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={this.msg('declCustoms')} {...formItemLayout}>
              <Select disabled={disabled} showSearch value={node.decl_port} onChange={value => this.handleChange('decl_port', value)}>
                {
                    formRequires.declPorts.map(dp =>
                      <Option value={dp.code} key={dp.code}>{dp.code}|{dp.name}</Option>)
                  }
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={this.msg('操作人员')} {...formItemLayout}>
              <Select
                value={provider ? node.person_id : null}
                disabled={disabled || !provider}
                onChange={value => this.handlePersonChange(value)}
              >
                {serviceTeam.map(st => <Option value={st.lid} key={st.lid}><UserAvatar size="small" loginId={st.lid} showName /></Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={this.msg('customsBroker')} {...formItemLayout}>
              <Select allowClear showSearch value={provider ? node.broker_scc_code : null} disabled={disabled || !provider} onChange={value => this.handleChange('broker_scc_code', value)}>
                {
                    formRequires.customsBrokers.map(cb =>
                      (<Option value={cb.partner_unique_code} key={cb.partner_unique_code}>
                        {cb.partner_code}|{cb.name}</Option>))
                  }
              </Select>
            </FormItem>
          </Col>
        </Row>
      </FormPane>
    );
  }
}
