import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Input, Select, Tag, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { updateFlowInfo, loadFlowList } from 'common/reducers/scofFlow';
import { loadServiceTeamList } from 'common/reducers/saasCollab';
import UserAvatar from 'client/components/UserAvatar';
import { SCOF_ORDER_TRANSFER, TRANS_MODES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@Form.create()
@connect(
  state => ({
    customerPartners: state.partner.partners,
    currentFlow: state.scofFlow.currentFlow,
    listFilter: state.scofFlow.listFilter,
    flowList: state.scofFlow.flowList,
    teamUsers: state.saasCollab.operators,
    userMembers: state.account.userMembers,
    serviceTeams: state.saasCollab.serviceTeams,
  }),
  {
    updateFlowInfo,
    loadFlowList,
    loadServiceTeamList,
  }
)
export default class InfoPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (this.props.currentFlow) {
      const partnerId = this.props.form.getFieldValue('customer');
      if (partnerId) {
        this.props.loadServiceTeamList({ partnerId });
      }
    }
  }
  msg = formatMsg(this.props.intl)

  handleSave = () => {
    const data = this.props.form.getFieldsValue();
    const { customerPartners, currentFlow } = this.props;
    const partner = customerPartners.find(cp => cp.id === data.customer);
    const thisFlow = currentFlow;
    const flowData = partner ? {
      name: data.name,
      customer_tenant_id: partner.partner_tenant_id,
      customer_partner_id: partner.id,
      customer_partner_name: partner.name,
      flow_transfer_ieflag: data.flow_transfer_ieflag,
      flow_trans_mode: data.flow_trans_mode,
      flow_exec_logins: data.flow_exec_logins,
      service_team_id: data.service_team_id || partner.id,
    } : { name: data.name };
    this.props.updateFlowInfo(thisFlow.id, flowData).then((result) => {
      if (!result.error) {
        message.success('保存成功');
        this.props.loadFlowList({
          filter: JSON.stringify(this.props.listFilter),
          pageSize: this.props.flowList.pageSize,
          current: this.props.flowList.current,
        });
      }
    });
  }
  handleCustomerChange = (partnerId) => {
    if (partnerId) {
      this.props.loadServiceTeamList({ partnerId });
    }
    this.props.form.setFieldsValue({ service_team_id: '' });
  }
  render() {
    const {
      form: { getFieldDecorator },
      currentFlow,
      customerPartners,
      userMembers,
      teamUsers,
      serviceTeams,
    } = this.props;
    const validCustomer = this.props.form.getFieldValue('customer');
    return (
      <Form layout="vertical">
        <FormItem label={this.msg('flowName')}>
          {
       getFieldDecorator('name', {
        initialValue: currentFlow.name,
         rules: [{ required: true, message: '流程名称必填' }],
       })(<Input />)
     }
        </FormItem>
        <FormItem label={this.msg('flowCustomer')}>
          {
      getFieldDecorator('customer', {
      initialValue: currentFlow.customer_partner_id,
      })(<Select
        showSearch
        allowClear
        optionFilterProp="children"
        onChange={this.handleCustomerChange}
      >
        {customerPartners.map(data => (
            (<Option key={data.id} value={data.id}>
              <Tag>{this.msg(data.role)}</Tag>{data.partner_code ? `${data.partner_code} | ${data.name}` : data.name}
            </Option>)))}
      </Select>)
      }
        </FormItem>
        <FormItem label={this.msg('flowServiceTeam')}>
          {
            getFieldDecorator('service_team_id', {
              initialValue: currentFlow.service_team_id,
            })(<Select
              showSearch
              optionFilterProp="children"
              disabled={!validCustomer}
            >
              {serviceTeams.map(data => (
                <Option key={data.team_id} value={data.team_id}>{data.team_name}</Option>))}
            </Select>)
            }
        </FormItem>
        <FormItem label={this.msg('负责人')}>
          {
          getFieldDecorator('flow_exec_logins', {
            initialValue: Number(currentFlow.flow_exec_logins) || null,
            rules: [{ required: true, message: '负责人必填' }],
          })(<Select
            allowClear
            showSearch
          >
            {validCustomer ?
              teamUsers.map(st => <Option value={st.lid} key={st.lid}><UserAvatar size="small" loginId={st.lid} showName /></Option>) :
              userMembers.map(st => <Option value={st.login_id} key={st.login_id}><UserAvatar size="small" loginId={st.login_id} showName /></Option>)}
          </Select>)
          }
        </FormItem>
        <FormItem label={this.msg('进出口标志')}>
          {
          getFieldDecorator('flow_transfer_ieflag', {
            initialValue: currentFlow.flow_transfer_ieflag,
          })(<Select allowClear>
            {SCOF_ORDER_TRANSFER.map(sot =>
          (<Option value={sot.value} key={sot.value}>
            {sot.text}</Option>))}
          </Select>)
          }
        </FormItem>
        <FormItem label={this.msg('运输方式')}>
          {
          getFieldDecorator('flow_trans_mode', {
            initialValue: currentFlow.flow_trans_mode,
          })(<Select allowClear>
            <Option value={TRANS_MODES[0].value}><i className={TRANS_MODES[0].icon} />
              {TRANS_MODES[0].text}</Option>
            <Option value={TRANS_MODES[1].value}><i className={TRANS_MODES[1].icon} />
              {TRANS_MODES[1].text}</Option>
            <Option value={TRANS_MODES[3].value}><i className={TRANS_MODES[3].icon} />
              {TRANS_MODES[3].text}</Option>
          </Select>)
          }
        </FormItem>
        <FormItem>
          <Button type="primary" icon="save" onClick={this.handleSave}>{this.msg('save')}</Button>
        </FormItem>
      </Form>
    );
  }
}
