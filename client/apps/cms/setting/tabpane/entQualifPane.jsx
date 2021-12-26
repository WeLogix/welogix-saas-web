import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'react-redux';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { addEntQualif, loadEntQualifList, updateEntQualif, deleteEntQualif } from 'common/reducers/cmsManifestTemplate';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { CIQ_ENT_QUALIF_TYPE_I, CIQ_ENT_QUALIF_TYPE_E } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(state => ({
  billtemplates: state.cmsManifest.billtemplates,
  customer: state.cmsResources.customer,
  templateEntQualifs: state.cmsManifestTemplate.templateEntQualifs,
}), {
  addEntQualif, loadEntQualifList, updateEntQualif, deleteEntQualif,
})

@Form.create()
export default class EntQualifPane extends Component {
  static propTyps = {
    intl: intlShape.isRequired,
  }
  state = {
    editOne: {},
    billTemplateMap: new Map(),
  }
  componentDidMount() {
    this.handleLoad();
    const billTemplateMap = new Map();
    for (let i = 0; i < this.props.billtemplates.length; i++) {
      const temp = this.props.billtemplates[i];
      billTemplateMap.set(temp.id, { template_name: temp.template_name, ietype: temp.i_e_type });
    }
    this.setState({
      billTemplateMap,
    });
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
          ent_qualif_type_code: values.ent_qualif_type_code,
          ent_qualif_no: values.ent_qualif_no,
          template_id: values.template_id,
        };
        this.props.addEntQualif(data).then((result) => {
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
    this.props.loadEntQualifList(templateIds);
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
    this.props.updateEntQualif({
      ent_qualif_type_code: this.state.editOne.ent_qualif_type_code,
      ent_qualif_no: this.state.editOne.ent_qualif_no,
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
    this.props.deleteEntQualif(row.id).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, templateEntQualifs, billtemplates: templates,
    } = this.props;
    const { billTemplateMap } = this.state;
    const formTemplateId = getFieldValue('template_id');
    let entQualifTypeByTemp = [];
    if (formTemplateId) {
      const temp = billTemplateMap.get(formTemplateId);
      if (temp.ietype === 0) {
        entQualifTypeByTemp = CIQ_ENT_QUALIF_TYPE_I;
      } else {
        entQualifTypeByTemp = CIQ_ENT_QUALIF_TYPE_E;
      }
    }
    const columns = [{
      title: this.msg('entQualifTypeCode'),
      dataIndex: 'ent_qualif_type_code',
      key: 'ent_qualif_type_code',
      width: 200,
      render: (o, record) => {
        let templateId;
        if (this.state.editOne.id === record.id) {
          templateId = this.state.editOne.template_id;
        } else {
          templateId = record.template_id;
        }
        const temp = billTemplateMap.get(templateId);
        let rowEntQualifType = [];
        if (temp.ietype === 0) {
          rowEntQualifType = CIQ_ENT_QUALIF_TYPE_I;
        } else {
          rowEntQualifType = CIQ_ENT_QUALIF_TYPE_E;
        }
        if (this.state.editOne.id === record.id) {
          return (<Select
            showSearch
            optionFilterProp="children"
            allowClear
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 460 }}
            value={this.state.editOne.ent_qualif_type_code}
            onChange={value => this.handleEditRecode('ent_qualif_type_code', value)}
            style={{ width: '100%' }}
          >
            {rowEntQualifType.map(type =>
              (<Option key={type.value} value={type.value}>
                {type.value} | {type.text}</Option>))}
          </Select>);
        }
        const qualif = rowEntQualifType.find(type => type.value === o);
        if (qualif) {
          return `${qualif.value}|${qualif.text}`;
        }
        return '';
      },
    }, {
      title: this.msg('entQualifNo'),
      dataIndex: 'ent_qualif_no',
      key: 'ent_qualif_no',
      width: 200,
      render: (o, record) => {
        if (this.state.editOne.id === record.id) {
          return (
            <Input
              value={this.state.editOne.ent_qualif_no}
              onChange={e => this.handleEditRecode('ent_qualif_no', e.target.value)}
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
        const template = billTemplateMap.get(record.template_id);
        return template && template.template_name;
      },
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
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
            <RowAction danger confirm={this.msg('ensureDelete')} onConfirm={this.handleDelete} icon="delete" tooltip={this.msg('delete')} row={record} />
          </PrivilegeCover>
        </span>
      ),
    }];
    const form = (<Form layout="inline">
      <FormItem>
        {getFieldDecorator('template_id', {
              rules: [
                { required: true, message: this.msg('mustHaveBillTemplates') },
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
        {getFieldDecorator('ent_qualif_type_code', {
              rules: [
                { required: true, message: this.msg('mustHaveEntQualifTypeCode') },
              ],
            })(<Select
              showSearch
              optionFilterProp="children"
              allowClear
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 460 }}
              placeholder={this.msg('entQualifTypeCode')}
              style={{ width: 200 }}
            >
              {entQualifTypeByTemp.map(type =>
                (<Option key={type.value} value={type.value}>
                  {type.value} | {type.text}</Option>))}
            </Select>)}
      </FormItem>
      <FormItem>
        {getFieldDecorator('ent_qualif_no')(<Input placeholder={this.msg('entQualifNo')} style={{ width: 200 }} />)}
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
        dataSource={templateEntQualifs}
        columns={columns}
        rowKey="id"
        scrollOffset={340}
      />
    );
  }
}
