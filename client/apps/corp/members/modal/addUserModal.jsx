import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Select, message, Modal, TreeSelect } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { assignForm, clearForm, editTenantUser, createTenantUser, loadRoles, toggleUserModal } from 'common/reducers/personnel';
import { loadDeptAndMembers } from 'common/reducers/account';
import { isLoginNameExist, checkLoginName } from 'common/reducers/checker-reducer';
import { validatePhone } from 'common/validater';
import { PRESET_TENANT_ROLE } from 'common/constants';
import { format } from 'client/common/i18n/helpers';
import { formatMsg } from '../message.i18n';
import { getDeptTreeData } from '../memberDeptUtil';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

@injectIntl
@connect(
  state => ({
    selectedIndex: state.personnel.selectedIndex,
    formData: state.personnel.formData,
    submitting: state.personnel.submitting,
    code: state.account.code,
    tenantId: state.account.tenantId,
    roles: state.personnel.roles, // .filter(rol => rol.name !== PRESET_TENANT_ROLE.owner.name),
    visible: state.personnel.userModal.visible,
    pid: state.personnel.userModal.pid,
    personnel: state.personnel,
    departments: state.personnel.departments,
  }),
  {
    editTenantUser,
    createTenantUser,
    checkLoginName,
    toggleUserModal,
    loadRoles,
    assignForm,
    clearForm,
    loadDeptAndMembers,
  }
)
@Form.create()
export default class CorpEdit extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    code: PropTypes.string.isRequired,
    tenantId: PropTypes.number.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      position: PropTypes.string,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,
    editTenantUser: PropTypes.func.isRequired,
    createTenantUser: PropTypes.func.isRequired,
    checkLoginName: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    confirmLoading: false,
  }
  componentDidMount() {
    this.props.loadRoles();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      const { pid } = nextProps;
      if (pid) {
        this.props.assignForm(this.props.personnel, pid);
      } else {
        this.props.clearForm();
      }
    }
  }
  getRoleData = () => {
    const systemRoles = [];
    const customRoles = [];
    this.props.roles.forEach((role) => {
      if (role.name !== PRESET_TENANT_ROLE.owner.name) {
        const entry = {
          value: role.id,
          label: role.name,
          ...role,
        };
        if (role.tenant_id === -1) {
          systemRoles.push(entry);
        } else {
          customRoles.push(entry);
        }
      }
    });
    return { systemRoles, customRoles };
  }
  msg = formatMsg(this.props.intl)
  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({ confirmLoading: true });
        const {
          roles, formData, code,
        } = this.props;
        const role = roles.find(f => f.id === values.role_id);
        const roleName = role ? role.name : formData.role_name;
        const personnel = {
          ...this.props.formData,
          ...values,
          main_dept: values.main_dept || 0, // 单选清空后值为undefined
          sub_dept: values.sub_dept.map(f => f.value).join(','),
          role: roleName,
        };
        let prom;
        if (this.props.pid) {
          prom = this.props.editTenantUser(personnel, code);
        } else {
          prom = this.props.createTenantUser(personnel, code);
        }
        prom.then((result) => {
          if (!result.error) {
            this.props.loadDeptAndMembers();
            this.handleCancel();
          } else {
            message.error(result.error, 5);
          }
          this.setState({ confirmLoading: false });
        });
      } else {
        this.forceUpdate();
      }
    });
  }
  handleCancel = () => {
    this.props.clearForm();
    this.props.form.resetFields();
    this.props.toggleUserModal(false);
  }
  /* // 确保所选节点均无上下层级关系
  handleLimitSelect = (value, label, extra) => {
    const { preValue, triggerValue } = extra;
    // 仅在新增选中项时校验处理，取消选中项时不做处理
    if (preValue.length > 0 && preValue.length < value.length) {
      const { departments } = this.props;
      const selectedNode = departments.find(f => f.id === triggerValue);
      let newValue = value;
      let loopEntry = selectedNode;
      while (loopEntry.parent_dept_id) { // 向上遍历查找父节点
        const loopId = loopEntry.parent_dept_id;
        if (newValue.includes(loopId)) { // 新增选中项为value中某项的子节点,去除value中的父节点
          newValue = newValue.filter(f => f !== loopId);
        }
        loopEntry = departments.find(f => f.id === loopId);
      }
      let children = departments.filter(f => f.parent_dept_id === triggerValue);
      while (children.length > 0) { // 向下遍历查找子节点
        const dp = children.shift();
        if (newValue.includes(dp.id)) { // 新增选中项为value中某项的父节点,去除value中子节点
          newValue = newValue.filter(f => f !== dp.id);
        }
        const subList = departments.filter(f => f.parent_dept_id === dp.id);
        if (subList.length > 0) {
          children = children.concat(subList);
        }
      }
      return newValue;
    }
    return value;
  } */
  renderTextInput(labelName, placeholder, field, required, rules, fieldProps, type = 'text') {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <FormItem
        label={labelName}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        hasFeedback
        required={required}
      >
        {getFieldDecorator(field, {
          rules, ...fieldProps,
        })(<Input type={type} placeholder={placeholder} autocomplete="off" />)}
      </FormItem>
    );
  }
  render() {
    const {
      formData, formData: {
        name, username, phone, email,
      },
      pid, intl, form: { getFieldDecorator, getFieldValue }, code, visible, departments,
    } = this.props;
    // 编辑时确保已将personnel放入formData中再行渲染(props变化触发更新)
    if (!visible || (pid && pid !== -1 && formData.key !== pid)) {
      return null;
    }
    const mainDeptVal = getFieldValue('main_dept') || formData.main_dept;
    const initSubDept = formData.sub_dept ? formData.sub_dept.split(',').map(f => Number(f)) : [];
    const subDeptArr = initSubDept.map(f => ({ value: f }));
    const subDeptVal = getFieldValue('sub_dept') ? getFieldValue('sub_dept').map(f => f.value) : initSubDept;
    const mainDepts = getDeptTreeData(departments, subDeptVal);
    const subDeptDisabledKeys = mainDeptVal ? [mainDeptVal] : [];
    const subDepts = getDeptTreeData(departments, subDeptDisabledKeys);
    const isCreating = visible && !pid && pid !== 0;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { systemRoles, customRoles } = this.getRoleData();
    return (
      <Modal
        title={this.props.pid ? this.msg('editMember') : this.msg('createMember')}
        maskClosable={false}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        confirmLoading={this.state.confirmLoading}
        destroyOnClose
      >
        <Form layout="horizontal">
          <FormItem
            label={this.msg('fullName')}
            {...formItemLayout}
            hasFeedback
            required
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, min: 2, message: this.msg('fullNameMessage') }],
              initialValue: name,
            })(<Input placeholder={this.msg('fullNamePlaceholder')} />)}
          </FormItem>
          <FormItem
            label={this.msg('username')}
            {...formItemLayout}
            required
          >
            {getFieldDecorator('username', {
                rules: [{
                  validator: (rule, value, callback) => isLoginNameExist(
                    getFieldValue('username'), code, this.props.formData.login_id,
                      this.props.tenantId, callback, message, this.props.checkLoginName,
                      (msgs, descriptor) => format(msgs)(intl, descriptor)
                    ),
                }],
                initialValue: isCreating ? '' : username && username.split('@')[0],
              })(<Input autocomplete="off" />)}
          </FormItem>
          {
              isCreating && this.renderTextInput(
                this.msg('password'), this.msg('passwordPlaceholder'), 'password', true,
                [{ required: true, min: 6, message: this.msg('passwordMessage') }],
                { initialValue: '' }, 'password'
              )
            }
          {this.renderTextInput(
              this.msg('phone'), this.msg('phonePlaceholder'), 'phone', false,
              [{
                validator: (rule, value, callback) =>
                validatePhone(value, callback, intl, false),
              }],
              { initialValue: phone }
            )}
          {this.renderTextInput(
              this.msg('email'), this.msg('emailPlaceholder'), 'email', false,
              [{ type: 'email', message: this.msg('emailError') }],
              { initialValue: email }
            )}
          <FormItem
            label={this.msg('mainDepartment')}
            {...formItemLayout}
          >
            {getFieldDecorator('main_dept', {
              initialValue: formData.main_dept || null, // 为0转为null
              rules: [{ required: subDeptVal.length > 0, message: '存在附属部门时，主属部门必填' }],
            })(<TreeSelect
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={mainDepts}
              treeDefaultExpandAll
            />)}
          </FormItem>
          <FormItem
            label={this.msg('subDepartment')}
            {...formItemLayout}
          >
            {getFieldDecorator('sub_dept', {
              initialValue: subDeptArr,
              // getValueFromEvent: this.handleLimitSelect,

            })(<TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={subDepts}
              treeDefaultExpandAll
              treeCheckable
              treeCheckStrictly // 强制labelInValue=true
            />)}
          </FormItem>
          {formData.role_name !== PRESET_TENANT_ROLE.owner.name &&
          <FormItem label={this.msg('role')} {...formItemLayout}>
            {getFieldDecorator('role_id', {
              initialValue: formData.role_id,
              rules: [{ required: true }],
            })(<Select>
              <OptGroup label={this.msg('systemRole')}>
                {systemRoles.map(f => (<Option value={f.id}>{f.name}</Option>))}
              </OptGroup>
              <OptGroup label={this.msg('customRole')}>
                {customRoles.map(f => (<Option value={f.id}>{f.name}</Option>))}
              </OptGroup>
            </Select>)}
          </FormItem>}
        </Form>
      </Modal>);
  }
}
