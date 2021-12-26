import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, Tag } from 'antd';
import { closeCreateFlowModal, saveFlow, toggleReload } from 'common/reducers/scofFlow';
import { loadServiceTeamList } from 'common/reducers/saasCollab';
import UserAvatar from 'client/components/UserAvatar';
import { loadPartners } from 'common/reducers/partner';
import { PARTNER_ROLES, SCOF_ORDER_TRANSFER, TRANS_MODES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.scofFlow.visibleFlowModal,
    customerPartners: state.partner.partners,
    teamUsers: state.saasCollab.operators,
    userMembers: state.account.userMembers,
    serviceTeams: state.saasCollab.serviceTeams,
  }),
  {
    closeCreateFlowModal, loadPartners, saveFlow, toggleReload, loadServiceTeamList,
  }
)
@Form.create()
export default class CreateFlowModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    closeCreateFlowModal: PropTypes.func.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.loadPartners({
        role: [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP],
      });
    }
  }
  handleOk = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        const customer = this.props.customerPartners.filter(pt => pt.id === fields.customer)[0];
        this.props.saveFlow({
          name: fields.name,
          tracking_id: fields.tracking,
          partner_tenant_id: customer && customer.partner_tenant_id,
          partner_id: customer && customer.id,
          partner_name: customer && customer.name,
          flow_trans_mode: fields.flow_trans_mode,
          flow_transfer_ieflag: fields.flow_transfer_ieflag,
          flow_exec_logins: fields.flow_exec_logins,
          service_team_id: fields.service_team_id,
        }).then((result) => {
          if (!result.error) {
            this.handleCancel();
            this.props.toggleReload();
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.closeCreateFlowModal();
  }
  handleCustomerChange = (partnerId) => {
    if (partnerId) {
      this.props.loadServiceTeamList({ partnerId });
    }
    this.props.form.setFieldsValue({ service_team_id: '' });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      visible, customerPartners, userMembers, teamUsers, serviceTeams,
      form: { getFieldDecorator },
    } = this.props;
    const validCustomer = this.props.form.getFieldValue('customer');
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createFlow')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="horizontal">
          <FormItem label={this.msg('flowName')} {...formItemLayout}>
            {
             getFieldDecorator('name', {
               rules: [{ required: true, message: '流程名称必填' }],
             })(<Input />)
           }
          </FormItem>
          <FormItem label={this.msg('flowCustomer')} {...formItemLayout}>
            {
            getFieldDecorator('customer')(<Select
              showSearch
              optionFilterProp="children"
              onChange={this.handleCustomerChange}
            >
              {customerPartners.map(data => (
                <Option key={data.id} value={data.id}><Tag>{this.msg(data.role)}</Tag>
                  {[data.partner_code, data.name].filter(f => f).join('|')}
                </Option>))}
            </Select>)
            }
          </FormItem>
          <FormItem label={this.msg('flowServiceTeam')} {...formItemLayout}>
            {
            getFieldDecorator('service_team_id')(<Select
              showSearch
              optionFilterProp="children"
              disabled={!validCustomer}
            >
              {serviceTeams.map(data => (
                <Option key={data.team_id} value={data.team_id}>{data.team_name}</Option>))}
            </Select>)
            }
          </FormItem>
          <FormItem label={this.msg('负责人')} {...formItemLayout}>
            {
            getFieldDecorator('flow_exec_logins', {
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
          <FormItem label={this.msg('进出口标志')} {...formItemLayout}>
            {
            getFieldDecorator('flow_transfer_ieflag')(<Select>
              {SCOF_ORDER_TRANSFER.map(sot =>
            (<Option value={sot.value} key={sot.value}>
              {sot.text}</Option>))}
            </Select>)
            }
          </FormItem>
          <FormItem label={this.msg('运输方式')} {...formItemLayout}>
            {
            getFieldDecorator('flow_trans_mode')(<Select>
              <Option value={TRANS_MODES[0].value}><i className={TRANS_MODES[0].icon} />
                {TRANS_MODES[0].text}</Option>
              <Option value={TRANS_MODES[1].value}><i className={TRANS_MODES[1].icon} />
                {TRANS_MODES[1].text}</Option>
              <Option value={TRANS_MODES[3].value}><i className={TRANS_MODES[3].icon} />
                {TRANS_MODES[3].text}</Option>
            </Select>)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
