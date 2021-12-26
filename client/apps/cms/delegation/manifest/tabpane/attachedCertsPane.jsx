import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Select, Input, message } from 'antd';
import { loadCertMarks, saveCertMark, delCertMark } from 'common/reducers/cmsManifest';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;

function ColumnInput(props) {
  const {
    inEdit, record, field, onChange, placeholder, type,
  } = props;
  function handleChange(ev) {
    if (onChange) {
      onChange(record, field, ev.target.value);
    }
  }
  if (inEdit) {
    return type === 'textArea' ? <Input.TextArea value={record[field] || ''} onChange={handleChange} autosize />
      : <Input placeholder={placeholder} value={record[field] || ''} onChange={handleChange} />;
  }
  return <span>{record[field] || ''}</span>;
}
ColumnInput.propTypes = {
  inEdit: PropTypes.bool,
  record: PropTypes.shape({
    cert_code: PropTypes.string,
    cert_num: PropTypes.string,
  }).isRequired,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

function ColumnSelect(props) {
  const {
    inEdit, record, field, options, onChange,
  } = props;
  function handleChange(value) {
    if (onChange) {
      onChange(record, field, value);
    }
  }
  if (inEdit) {
    return (
      <Select showSearch optionFilterProp="children" value={record[field] || ''} onChange={handleChange} style={{ width: '100%' }}>
        {
          options.map(opt => opt &&
            <Option value={opt.value} key={opt.key || opt.value}>{opt.text || opt.value}</Option>)
        }
      </Select>
    );
  }
  const existOpt = options.filter(opt => opt.key === record[field])[0];
  return <span>{existOpt ? existOpt.text : ''}</span>;
}

ColumnSelect.propTypes = {
  inEdit: PropTypes.bool,
  record: PropTypes.shape({
    cert_code: PropTypes.string,
    cert_num: PropTypes.string,
  }).isRequired,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
    key: PropTypes.string,
  })).isRequired,
};

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    head: state.cmsManifest.entryHead,
    certMarks: state.cmsManifest.certMarks,
    certParams: state.cmsManifest.certParams,
  }),
  {
    loadCertMarks, saveCertMark, delCertMark,
  }
)
export default class ManifestAttachedCertsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    readonly: PropTypes.bool,
    certMarks: PropTypes.arrayOf(PropTypes.shape({
      cert_code: PropTypes.string,
      cert_num: PropTypes.string,
    })),
    certParams: PropTypes.arrayOf(PropTypes.shape({
      cert_code: PropTypes.string,
      cert_spec: PropTypes.string,
    })),
  }
  state = {
    datas: [],
  };
  componentDidMount() {
    this.props.loadCertMarks(this.props.head.pre_entry_seq_no);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.head !== nextProps.head) {
      this.props.loadCertMarks(nextProps.head.pre_entry_seq_no);
    }
    if (this.props.certMarks !== nextProps.certMarks) {
      this.setState({ datas: nextProps.certMarks });
    }
  }
  msg = formatMsg(this.props.intl)
  handleEditChange = (record, field, value) => {
    if (field === 'cert_code') {
      const cert = this.props.certParams.filter(param => param.cert_code === value)[0];
      record.cert_spec = cert.cert_spec; // eslint-disable-line no-param-reassign
    }
    record[field] = value; // eslint-disable-line no-param-reassign
    this.forceUpdate();
  }
  handleAdd = () => {
    const { head } = this.props;
    const addOne = {
      delg_no: head.delg_no,
      entry_id: head.entry_id,
      pre_entry_seq_no: head.pre_entry_seq_no,
      creater_login_id: this.props.loginId,
      cert_code: '',
      cert_spec: '',
      cert_num: '',
    };
    const data = this.state.datas;
    data.push(addOne);
    this.setState({ datas: data });
  }
  handleSave = (record) => {
    if (!record.cert_code) {
      message.info('单证代码及名称为必填项');
      return;
    }
    if (!record.cert_num) {
      message.info('单证编号为必填项');
      return;
    }
    this.props.saveCertMark(record).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('保存成功', 5);
      }
    });
  }
  handleDelete = (record, index) => {
    this.props.delCertMark({ id: record.id }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        const datas = [...this.state.datas];
        datas.splice(index, 1);
        this.setState({ datas });
      }
    });
  }
  handleCancel = (record, index) => {
    const datas = [...this.state.datas];
    datas.splice(index, 1);
    this.setState({ datas });
  }
  render() {
    const { certParams } = this.props;
    const option = certParams.map(cert => ({
      value: cert.cert_code,
      text: `${cert.cert_code}|${cert.cert_spec}`,
      key: cert.cert_code,
    }));
    const columns = [{
      title: this.msg('certSpec'),
      dataIndex: 'cert_code',
      width: 300,
      render: (o, record) =>
        (<ColumnSelect
          field="cert_code"
          inEdit={!record.id}
          record={record}
          onChange={this.handleEditChange}
          options={option}
        />),
    }, {
      title: this.msg('certNum'),
      dataIndex: 'cert_num',
      width: 300,
      render: (o, record) =>
        (<ColumnInput
          field="cert_num"
          inEdit={!record.id}
          record={record}
          onChange={this.handleEditChange}
        />),
    }, {
      title: this.msg('copDelgGNo'),
      dataIndex: 'cop_goods_no',
      width: 500,
      render: (o, record) =>
        (<ColumnSelect
          mode="tags"
          field="cop_goods_no"
          inEdit={!record.id}
          record={record}
          onChange={this.handleEditChange}
          options={[]} // TODO
        />),
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      width: 100,
      render: (o, record, index) => {
        if (record.id) {
          return (<span>
            <RowAction onClick={this.handleEdit} icon="edit" tooltip="修改" row={record} />
            <RowAction danger confirm="确定删除?" onConfirm={() => this.handleDelete(record, index)} icon="delete" row={record} />
          </span>);
        }
        return (<span>
          <RowAction onClick={this.handleSave} icon="save" tooltip="保存" row={record} />
          <RowAction onClick={() => this.handleCancel(record, index)} icon="close" tooltip="取消" row={record} />
        </span>);
      },
    }];
    return (
      <DataPane
        columns={columns}
        bordered
        dataSource={this.state.datas}
        rowKey="id"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd} disabled={this.props.readonly}>{this.msg('添加')}</Button>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
