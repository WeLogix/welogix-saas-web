import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Form, Row, Col, DatePicker, Input, Select, Tag } from 'antd';
import { setClientForm, loadFlowNodeData } from 'common/reducers/sofOrders';
import { uuidWithoutDash } from 'client/common/uuid';
import { CWM_SO_TYPES, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
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
    recParams: state.scofFlow.cwmParams,
    serviceTeam: state.saasCollab.operators,
  }),
  { setClientForm, loadFlowNodeData }
)
export default class CwmSoForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    index: PropTypes.number.isRequired,
    operation: PropTypes.oneOf(['view', 'edit', 'create']),
    formData: PropTypes.shape({
      node: PropTypes.shape({ node_uuid: PropTypes.string }),
    }).isRequired,
    setClientForm: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  componentDidMount() {
    const { formData } = this.props;
    const { node } = formData;
    if (!node.uuid && node.node_uuid) {
      this.props.loadFlowNodeData(node.node_uuid, node.kind).then((result) => {
        if (!result.error) {
          this.handleSetClientForm({
            ...result.data,
            uuid: uuidWithoutDash(),
            bizObjNeedLoad: false,
          });
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
  handleCommonFieldChange = (filed, value) => {
    this.handleSetClientForm({ [filed]: value });
  }
  handleBondedChange = (value) => {
    if (value) {
      this.handleSetClientForm({ bonded: value });
    } else {
      this.handleSetClientForm({
        bonded: value,
        bonded_reg_type: null,
        ship_after_decl_days: null,
        expected_shipping_date: null,
      });
    }
  }

  render() {
    const {
      recParams, formData, serviceTeam, disabled,
    } = this.props;
    const { node } = formData;
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
    const whseCode = node.t_whse_code || (node.whse_code ? `${node.wh_ent_tenant_id}-${node.whse_code}` : '');
    const selWhse = recParams.whses.filter(whse => `${whse.wh_ent_tenant_id}-${whse.code}` === whseCode)[0];
    return (
      <FormPane descendant>
        <Row>
          <Col span={6}>
            <FormItem label="仓库" {...formItemLayout} required>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                value={whseCode}
                onChange={value => this.handleCommonFieldChange('t_whse_code', value)}
                disabled={disabled}
              >
                {recParams.whses.map(wh =>
                  <Option key={`${wh.wh_ent_tenant_id}-${wh.code}`} value={`${wh.wh_ent_tenant_id}-${wh.code}`}>{wh.code}|{wh.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="SO类型" {...formItemLayout}>
              <Select disabled={disabled} placeholder="SO类型" value={node.so_type} onChange={value => this.handleCommonFieldChange('so_type', value)}>
                {CWM_SO_TYPES.map(cat =>
                  <Option value={cat.value} key={cat.value}>{cat.text}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={this.msg('操作人员')} {...formItemLayout}>
              <Select disabled={disabled} value={node.person_id} onChange={value => this.handleCommonFieldChange('person_id', value)}>
                {serviceTeam.map(st => <Option value={st.lid} key={st.lid}><UserAvatar size="small" loginId={st.lid} showName /></Option>)}
              </Select>
            </FormItem>
          </Col>
          {node.bonded_reg_type !== CWM_SHFTZ_OUT_REGTYPES[0].value &&
          <Col span={6}>
            <FormItem label="预期出货日期" {...formItemLayout}>
              <DatePicker
                format="YYYY/MM/DD"
                style={{ width: '100%' }}
                value={node.expect_shipping_date && moment(node.expect_shipping_date)}
                onChange={expectDate => this.handleCommonFieldChange('expect_shipping_date', expectDate && expectDate.valueOf())}
                disabled={disabled}
              />
            </FormItem>
          </Col>
              }
        </Row>
        <Row>
          <Col span={6}>
            <FormItem label="保税类型" {...formItemLayout}>
              <Select disabled={disabled} onChange={this.handleBondedChange} value={node.bonded}>
                <Option value={0}><Tag>非保税</Tag></Option>
                <Option value={1}><Tag color="blue">保税</Tag></Option>
                <Option value={-1}><Tag color="blue">不限</Tag></Option>
              </Select>
            </FormItem>
          </Col>
          {node.bonded === 1 ?
            <Col span={8}>
              <FormItem label="保税备案类型" {...formItemLayout}>
                <Select
                  value={node.bonded_reg_type}
                  onChange={value => this.handleCommonFieldChange('bonded_reg_type', value)}
                  disabled={disabled}
                >
                  {(selWhse && selWhse.ftz_type === 'SHFTZ') && CWM_SHFTZ_OUT_REGTYPES.map(cabr =>
                    (<Option value={cabr.value} key={cabr.value}>
                      {cabr.ftztext || cabr.text}</Option>))}
                  {(selWhse && selWhse.ftz_type === 'SASBL') && SASBL_REG_TYPES.map(cabr =>
                    <Option value={cabr.value} key={cabr.value}>{cabr.ftztext}</Option>)}
                </Select>
              </FormItem>
            </Col> : null}
          {node.bonded === 1 && node.bonded_reg_type === CWM_SHFTZ_OUT_REGTYPES[0].value &&
            <Col span={6}>
              <FormItem label="预期出货日期" {...formItemLayout}>
                <Input
                  addonBefore="晚于申报日期"
                  addonAfter="天"
                  value={node.ship_after_decl_days}
                  onChange={ev => this.handleCommonFieldChange('ship_after_decl_days', ev.target.value)}
                  disabled={disabled}
                />
              </FormItem>
            </Col>}
        </Row>
      </FormPane>
    );
  }
}

