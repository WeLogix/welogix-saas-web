import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input } from 'antd';
import { toggleCreateTeamModal, createServiceTeam } from 'common/reducers/saasCollab';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    currentPartner: state.saasCollab.currentPartner,
    visible: state.saasCollab.createModalVisible,
  }),
  { toggleCreateTeamModal, createServiceTeam }
)

@Form.create()
export default class CreateTeamModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleCreateTeamModal();
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { id, partner_tenant_id: partnerTenantId } = this.props.currentPartner;
        this.props.createServiceTeam(id, partnerTenantId, values.team_name).then((result) => {
          if (!result.error) this.handleCancel();
        });
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('addTeam')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="团队名称" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} >
            {getFieldDecorator('team_name', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入团队名称" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
