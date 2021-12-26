import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Modal, TreeSelect } from 'antd';
import { injectIntl } from 'react-intl';
import { toggleDepartmentModal, createDepartment, updateDepartment } from 'common/reducers/personnel';
import { loadDeptAndMembers } from 'common/reducers/account';
import { formatMsg } from '../message.i18n';
import { getDeptTreeData } from '../memberDeptUtil';

const FormItem = Form.Item;

@injectIntl
@connect(
  (state) => {
    const deptModal = state.personnel.departmentModal;
    const deptInfo = deptModal.data;
    return {
      visible: deptModal.visible,
      deptId: deptInfo.id,
      deptName: deptInfo.name,
      deptParentId: deptInfo.parent_id,
      departments: state.personnel.departments,
    };
  },
  {
    toggleDepartmentModal, createDepartment, updateDepartment, loadDeptAndMembers,
  }
)
@Form.create()
export default class EditDepartmentModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleOk = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        let prom;
        if (this.props.deptId) {
          prom = this.props.updateDepartment(values.name, values.parent_id, this.props.deptId);
        } else {
          prom = this.props.createDepartment(values.name, values.parent_id);
        }
        prom.then((res) => {
          if (!res.error) {
            this.props.loadDeptAndMembers();
            this.handleCancel();
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleDepartmentModal(false);
  }
  render() {
    const {
      form: { getFieldDecorator }, departments, visible, deptId, deptName, deptParentId,
    } = this.props;
    const deptTreeData = getDeptTreeData(departments);
    const treeData = [{
      title: '无上级部门',
      value: -1,
      key: -1,
    }].concat(deptTreeData);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        title={deptId ? this.msg('editDept') : this.msg('createDept')}
        maskClosable={false}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label={this.msg('parentDept')} >
            {getFieldDecorator('parent_id', {
              rules: [{ required: true }],
              initialValue: deptParentId,
            })(<TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              treeDefaultExpandAll
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label={this.msg('deptName')} >
            {getFieldDecorator('name', {
              rules: [{ required: true }],
              initialValue: deptName,
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>);
  }
}
