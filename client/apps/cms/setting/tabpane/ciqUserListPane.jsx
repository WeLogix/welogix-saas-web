import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';
import { loadCiqUserList, addCiqUser, updateCiqUser, deleteCiqUser } from 'common/reducers/cmsManifestTemplate';
import RowAction from 'client/components/RowAction';
import DataTable from 'client/components/DataTable';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    billtemplates: state.cmsManifest.billtemplates,
    customer: state.cmsResources.customer,
    templateUserList: state.cmsManifestTemplate.templateUserList,
  }),
  {
    loadCiqUserList, addCiqUser, updateCiqUser, deleteCiqUser,
  }
)
@Form.create()
export default class CiqUserListPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    editOne: {},
  }
  componentDidMount() {
    this.handleLoad();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billtemplates.length && nextProps.billtemplates !== this.props.billtemplates) {
      this.handleLoad(nextProps.billtemplates);
    }
    if (nextProps.customer !== this.props.customer) {
      this.props.form.resetFields();
    }
  }
  msg = formatMsg(this.props.intl)
  handleAdd = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const data = {
          user_org_person: values.user_org_person,
          user_org_tel: values.user_org_tel,
          template_id: values.template_id,
        };
        this.props.addCiqUser(data).then((result) => {
          if (!result.error) {
            form.resetFields();
          }
        });
      }
    });
  }
  handleLoad = (bl) => {
    const billtemplates = bl || this.props.billtemplates;
    const templateIds = billtemplates.map(temp => temp.id);
    this.props.loadCiqUserList(templateIds);
  }
  handleEdit = (editOne) => {
    this.setState({
      editOne,
    });
  }
  handleEditRecode = (field, value) => {
    const editOne = { ...this.state.editOne };
    editOne[field] = value;
    this.setState({
      editOne,
    });
  }
  handleSave = () => {
    this.props.updateCiqUser({
      user_org_person: this.state.editOne.user_org_person,
      user_org_tel: this.state.editOne.user_org_tel,
      template_id: this.state.editOne.template_id,
    }, this.state.editOne.id).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  handleCancel = () => {
    this.setState({
      editOne: {},
    });
  }
  handleDelete = (row) => {
    this.props.deleteCiqUser(row.id).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  render() {
    const { form: { getFieldDecorator }, templateUserList, billtemplates: templates } = this.props;
    const columns = [{
      title: this.msg('userOrgPerson'),
      dataIndex: 'user_org_person',
      key: 'user_org_person',
      width: 200,
      render: (o, record) => {
        if (this.state.editOne.id === record.id) {
          return (<Input
            value={this.state.editOne.user_org_person}
            onChange={e => this.handleEditRecode('user_org_person', e.target.value)}
          />);
        }
        return o;
      },
    }, {
      title: this.msg('userOrgTel'),
      dataIndex: 'user_org_tel',
      key: 'user_org_tel',
      width: 200,
      render: (o, record) => {
        if (this.state.editOne.id === record.id) {
          return (
            <Input
              value={this.state.editOne.user_org_tel}
              onChange={e => this.handleEditRecode('user_org_tel', e.target.value)}
            />
          );
        }
        return o;
      },
    }, {
      title: this.msg('relManifestRule'),
      dataIndex: 'template_id',
      key: 'template_id',
      width: 200,
      render: (o, record) => {
        if (this.state.editOne.id === record.id) {
          return (<Select
            showSearch
            optionFilterProp="children"
            value={this.state.editOne.template_id}
            onChange={value => this.handleEditRecode('template_id', value)}
            style={{ width: '100%' }}
          >
            {templates.map(template =>
              (<Option key={template.id} value={template.id}>
                {template.template_name}</Option>))}
          </Select>
          );
        }
        const template = templates.find(temp => temp.id === o);
        return template && template.template_name;
      },
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: '操作',
      dataIndex: 'OPS_COL',
      width: 130,
      className: 'table-col-ops',
      fixed: 'right',
      render: (_, record) => (
        <span>
          <PrivilegeCover module="clearance" feature="delegation" action="edit">
            {this.state.editOne.id === record.id ?
              <RowAction onClick={this.handleSave} icon="save" tooltip={this.msg('save')} row={record} /> :
              <RowAction onClick={this.handleEdit} icon="edit" tooltip={this.msg('modify')} row={record} />}
            {this.state.editOne.id === record.id &&
              <RowAction onClick={this.handleCancel} icon="close" tooltip={this.msg('cancel')} row={record} />}
          </PrivilegeCover>
          <PrivilegeCover module="clearance" feature="delegation" action="delete">
            <RowAction danger confirm="确定删除？" onConfirm={this.handleDelete} icon="delete" tooltip={this.msg('delete')} row={record} />
          </PrivilegeCover>
        </span>
      ),
    }];
    const form = (<Form layout="inline">
      <FormItem>
        {getFieldDecorator('template_id', {
              rules: [
                { required: true, message: '制单规则不能为空' },
              ],
            })(<Select
              showSearch
              optionFilterProp="children"
              allowClear
              placeholder={this.msg('relManifestRule')}
              style={{ width: 200 }}
            >
              {templates.map(template =>
                (<Option key={template.id} value={template.id}>
                  {template.template_name}</Option>))}
            </Select>)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('user_org_person', {
              rules: [
                { required: true, message: '使用单位联系人不能为空' },
              ],
            })(<Input placeholder={this.msg('userOrgPerson')} style={{ width: 200 }} />)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('user_org_tel', {
              rules: [
                { required: true, message: '联系电话不能为空' },
              ],
            })(<Input placeholder={this.msg('userOrgTel')} style={{ width: 200 }} />)}
      </FormItem>
      <FormItem>
        <PrivilegeCover module="clearance" feature="delegation" action="create">
          <Button type="primary" icon="save" onClick={this.handleAdd} >{this.msg('save')}</Button>
        </PrivilegeCover>
      </FormItem>
    </Form>);
    return (
      <DataTable
        cardView={false}
        toolbarActions={form}
        dataSource={templateUserList}
        columns={columns}
        rowKey="id"
        scrollOffset={340}
      />
    );
  }
}
