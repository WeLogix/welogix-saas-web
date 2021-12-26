import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Select, Input, message } from 'antd';
import { loadCertMarks, saveCertMark, updateCertMark, delCertMark } from 'common/reducers/cmsManifest';
import { CMS_DECL_STATUS } from 'common/constants';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';

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
    head: state.cmsManifest.entryHead,
    certMarks: state.cmsManifest.certMarks,
    certMark: state.saasParams.latest.certMark,
  }),
  {
    loadCertMarks, saveCertMark, updateCertMark, delCertMark,
  }
)
export default class CDFAttachedCertsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    certMarks: PropTypes.arrayOf(PropTypes.shape({
      cert_code: PropTypes.string,
      cert_num: PropTypes.string,
    })),
    certMark: PropTypes.arrayOf(PropTypes.shape({
      cert_code: PropTypes.string,
      cert_spec: PropTypes.string,
    })),
  }
  state = {
    certList: [],
    activeIndex: '',
  };
  componentDidMount() {
    this.props.loadCertMarks(this.props.head.pre_entry_seq_no);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.head !== nextProps.head) {
      this.props.loadCertMarks(nextProps.head.pre_entry_seq_no);
    }
    if (this.props.certMarks !== nextProps.certMarks) {
      this.setState({ certList: nextProps.certMarks.map((f, i) => ({ ...f, cert_seq: i + 1 })) });
    }
  }
  getColumns = () => {
    const { certMark } = this.props;
    const { activeIndex } = this.state;
    const option = certMark.map(cert => ({
      value: cert.cert_code,
      text: `${cert.cert_code}|${cert.cert_spec}`,
      key: cert.cert_code,
    }));
    return [{
      title: this.msg('seqNo'),
      dataIndex: 'cert_seq',
      width: 45,
      align: 'center',
      className: 'table-col-seq',
      render: (o, record, index) => o || index + 1,
    }, {
      title: this.msg('certSpec'),
      dataIndex: 'cert_code',
      width: 300,
      render: (o, record, index) =>
        (<ColumnSelect
          field="cert_code"
          inEdit={!record.id || activeIndex === index}
          record={record}
          onChange={this.handleEditChange}
          options={option}
        />),
    }, {
      title: this.msg('certNum'),
      dataIndex: 'cert_num',
      width: 300,
      render: (o, record, index) =>
        (<ColumnInput
          field="cert_num"
          inEdit={!record.id || activeIndex === index}
          record={record}
          onChange={this.handleEditChange}
        />),
    }, {
      dataIndex: 'coo_rel',
      render: (o, record) => {
        if (record.cert_code === 'Y' || record.cert_code === 'E' || record.cert_code === 'R' || record.cert_code === 'F' || record.cert_code === 'J') {
          return <Button>{this.msg('cooRel')}</Button>;
        }
        return null;
      },
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      width: 100,
      render: (o, record, index) => {
        if (this.props.head.status < CMS_DECL_STATUS.sent.value) {
          if (record.id && activeIndex !== index) {
            return (<span>
              <PrivilegeCover module="clearance" feature="customs" action="edit">
                <RowAction onClick={() => this.handleEdit(record, index)} icon="edit" tooltip={this.msg('modify')} row={record} />
              </PrivilegeCover>
              <PrivilegeCover module="clearance" feature="customs" action="delete">
                <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={() => this.handleDelete(record, index)} icon="delete" row={record} />
              </PrivilegeCover>
            </span>);
          }
          return (<PrivilegeCover module="clearance" feature="customs" action="edit">
            <RowAction onClick={this.handleSave} icon="save" tooltip={this.msg('save')} row={record} />
            <RowAction onClick={() => this.handleCancel(record, index)} icon="close" tooltip={this.msg('cancel')} row={record} />
          </PrivilegeCover>);
        }
        return null;
      },
    }];
  }
  msg = formatMsg(this.props.intl)
  handleEditChange = (record, field, value) => {
    const certList = [...this.state.certList];
    const certEntry = certList.find(f => f.cert_seq === record.cert_seq);
    if (field === 'cert_code') {
      const cert = this.props.certMark.find(param => param.cert_code === value);
      certEntry.cert_spec = cert && cert.cert_spec;
    }
    certEntry[field] = value;
    this.setState({ certList });
  }
  handleEdit = (record, index) => {
    this.setState({
      activeIndex: index,
    });
  }
  handleAdd = () => {
    const data = this.state.certList;
    if (data.find(f => !f.id)) return; // 如果已存在新建的编辑框，再次点击新增则不再增加编辑框
    const { head } = this.props;
    const addOne = {
      delg_no: head.delg_no,
      entry_id: head.entry_id,
      pre_entry_seq_no: head.pre_entry_seq_no,
      cert_code: '',
      cert_spec: '',
      cert_num: '',
      cert_seq: data.length + 1,
    };
    data.push(addOne);
    this.setState({ certList: data });
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
    if (!record.id) {
      const opContent = `添加随附单证类型${record.cert_code}(${record.cert_num})`;
      this.props.saveCertMark({
        ...record,
        permit_category: 'customs',
        owner_partner_id: this.props.head.owner_cuspartner_id,
        permit_code: record.cert_code,
        permit_no: record.cert_num,
      }, opContent).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          const arr = [...this.state.certList];
          const newCert = arr[arr.length - 1];
          newCert.id = result.data.id;
          newCert.cert_seq = result.data.cert_seq;
          this.setState({
            certList: arr,
          });
          message.info('保存成功', 5);
        }
      });
    } else {
      const opContent = `修改随附单证类型${record.cert_code}(${record.cert_num})`;
      this.props.updateCertMark(record, opContent).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.info('修改成功', 5);
        }
      });
    }
    this.setState({
      activeIndex: '',
    });
  }
  handleDelete = (record, index) => {
    const opContent = `删除随附单证类型${record.cert_code}(${record.cert_num})`;
    this.props.delCertMark({ id: record.id }, opContent).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        const certList = [...this.state.certList];
        certList.splice(index, 1);
        const newDatas = certList.map((item, ind) => ({
          ...item,
          cert_seq: ind + 1,
        }));
        this.setState({ certList: newDatas, activeIndex: '' });
      }
    });
  }
  handleCancel = (record, index) => {
    if (record.id) {
      this.setState({ activeIndex: '' });
    } else {
      const certList = [...this.state.certList];
      certList.splice(index, 1);
      this.setState({ certList, activeIndex: '' });
    }
  }
  render() {
    const columns = this.getColumns();
    return (
      <DataPane
        columns={columns}
        bordered
        dataSource={this.state.certList}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="clearance" feature="customs" action="create">
            <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd} disabled={this.props.head.status >= CMS_DECL_STATUS.sent.value}>{this.msg('add')}</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
