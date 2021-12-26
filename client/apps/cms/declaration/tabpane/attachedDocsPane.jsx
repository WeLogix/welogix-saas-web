import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, message, Upload, Input, Select, Popover } from 'antd';
import { loadDocuMarks, saveDocuMark, delDocumark, toggleCmsPermitModal, updateDocuMark } from 'common/reducers/cmsManifest';
import { CMS_DECL_DOCU, CMS_DECL_STATUS, ARCHIVE_TYPE, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import AddAttDocPermitModal from '../../common/modal/addAttDocPermitModal';
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
            <Option value={opt.value} key={opt.value}>{opt.text || opt.value}</Option>)
        }
      </Select>
    );
  }
  const existOpt = options.filter(opt => opt.value === record[field])[0];
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
    docuMarks: state.cmsManifest.docuMarks,
  }),
  {
    loadDocuMarks, saveDocuMark, delDocumark, toggleCmsPermitModal, updateDocuMark,
  }
)
export default class AttachedDocsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    head: PropTypes.shape({
      bill_seq_no: PropTypes.string,
      ccd_file: PropTypes.string,
      delg_no: PropTypes.string,
      id: PropTypes.number,
    }),
    docuMarks: PropTypes.arrayOf(PropTypes.shape({
      pre_entry_seq_no: PropTypes.string,
      id: PropTypes.number,
      docu_spec: PropTypes.string,
      docu_file: PropTypes.string,
      docu_code: PropTypes.string,
      delg_no: PropTypes.string,
    })),
  }
  state = {
    docList: [],
    activeIndex: '',
    docType: null,
  };
  componentDidMount() {
    this.props.loadDocuMarks(this.props.head.pre_entry_seq_no);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.head !== nextProps.head) {
      this.props.loadDocuMarks(nextProps.head.pre_entry_seq_no);
    }
    if (this.props.docuMarks !== nextProps.docuMarks) {
      this.setState({ docList: nextProps.docuMarks.map((f, i) => ({ ...f, seq_no: i + 1 })) });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (col, row, index) => index + 1,
  }, {
    title: this.msg('docuSpec'),
    dataIndex: 'docu_spec',
    width: 300,
    render: (o, record, index) =>
      (<ColumnSelect
        field="docu_spec"
        inEdit={!record.id || this.state.activeIndex === index}
        record={record}
        onChange={this.handleEditChange}
        options={CMS_DECL_DOCU}
      />),
  }, {
    title: this.msg('docuCode'),
    dataIndex: 'docu_code',
    width: 300,
    render: (o, record, index) =>
      (<ColumnInput
        field="docu_code"
        inEdit={!record.id || this.state.activeIndex === index}
        record={record}
        onChange={this.handleEditChange}
      />),
  // }, {
  //   title: this.msg('fileName'),
  //   width: 150,
  //   dataIndex: 'docu_name',
  }, {
    title: this.msg('relFile'),
    width: 150,
    render: (o, record) => {
      if (record.docu_file) {
        return (<div>
          <RowAction onClick={this.handleView} icon="eye-o" tooltip="查看文件" row={record} />
          <PrivilegeCover module="clearance" feature="customs" action="edit">
            <RowAction onClick={this.handleCreatePermit} icon="plus" tooltip="将证书加入证件库" row={record} />
          </PrivilegeCover>
        </div>);
      }
      return (<PrivilegeCover module="clearance" feature="customs" action="edit">
        {this.renderUpload(record.id)}
      </PrivilegeCover>);
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    width: 100,
    render: (o, record, index) => {
      if (this.props.head.status < CMS_DECL_STATUS.sent.value) {
        if (record.id && this.state.activeIndex !== index) {
          return (<PrivilegeCover module="clearance" feature="customs" action="delete">
            <RowAction onClick={this.handleEdit} icon="edit" tooltip={this.msg('edit')} row={record} index={index} />
            <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" row={record} index={index} />
          </PrivilegeCover>);
        }
      }
      return (<PrivilegeCover module="clearance" feature="customs" action="edit">
        <RowAction onClick={this.handleSave} icon="save" tooltip={this.msg('save')} row={record} />
        <RowAction onClick={this.handleDropData} icon="close" tooltip={this.msg('cancel')} row={record} index={index} />
      </PrivilegeCover>);
    },
  }];
  handleTypeChange = (value) => {
    this.setState({ docType: value });
  }
  handleEdit = (record, index) => {
    this.setState({ activeIndex: index });
  }
  handleEditChange = (record, field, value) => {
    const docList = [...this.state.docList];
    const docEntry = docList.find(f => f.seq_no === record.seq_no);
    docEntry[field] = value;
    this.setState({ docList });
  }
  handleCreatePermit = (record) => {
    const uploadedFn = (cdnUrl, attachId) => this.handleUploaded(cdnUrl, attachId, record.id);
    this.props.toggleCmsPermitModal(true, {
      permit_category: 'ciq',
      owner_partner_id: this.props.head.owner_cuspartner_id,
      // permit_code: record.docu_spec,
      permit_no: record.docu_code,
    }, uploadedFn);
  }
  handleDelete = (record, index) => {
    const opContent = `删除随附单据编号${record.docu_code}`;
    this.props.delDocumark(
      record.id, this.props.head.pre_entry_seq_no,
      opContent,
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDropData(record, index);
      }
    });
  }
  handleDropData = (record, index) => {
    if (!record.id) {
      const docList = [...this.state.docList];
      docList.splice(index, 1);
      const newData = docList.map((f, i) => ({ ...f, seq_no: i + 1 }));
      this.setState({ docList: newData });
    }
    this.setState({ activeIndex: '' });
  }
  handleAdd = () => {
    const data = this.state.docList;
    if (data.find(f => !f.id)) return; // 如果已存在新建的编辑框，再次点击新增则不再增加编辑框
    const { head } = this.props;
    const addOne = {
      delg_no: head.delg_no,
      entry_id: head.entry_id,
      pre_entry_seq_no: head.pre_entry_seq_no,
      docu_spec: '',
      docu_code: '',
      seq_no: data.length + 1,
    };
    data.push(addOne);
    this.setState({ docList: data });
  }
  handleUploaded = (cdnUrl, attachId, rowId) => {
    this.props.updateDocuMark(
      { docu_file: cdnUrl, attach_id: attachId },
      rowId, this.props.head.pre_entry_seq_no,
    ).then((result) => {
      if (!result.error) {
        this.setState({ docType: '' });
        this.props.loadDocuMarks(this.props.head.pre_entry_seq_no);
      }
    });
  }
  handleView = (row) => {
    window.open(row.docu_file);
  }
  handleDownloadAll = () => {
    const { docList } = this.state;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('download', '');
    for (let i = 0; i < docList.length; i++) {
      const docEntry = docList[i];
      if (docEntry.docu_file) {
        const filename = docEntry.docu_file.split('/').pop().split('?')[0];
        link.setAttribute('download', filename);
        link.setAttribute('href', docEntry.docu_file);
        link.click();
      }
    }
  }
  handleSave = (record) => {
    if (!record.docu_code && !record.docu_spec) {
      message.info('单证类型和编号不能都为空');
      return;
    }
    const { head } = this.props;
    if (!record.id) {
      const opContent = `添加随附单据${record.docu_spec}(${record.docu_code})`;
      this.props.saveDocuMark({
        delg_no: head.delg_no,
        pre_entry_seq_no: head.pre_entry_seq_no,
        docu_code: record.docu_code,
        docu_spec: record.docu_spec,
      }, opContent).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          this.props.loadDocuMarks(this.props.head.pre_entry_seq_no);
          message.info('保存成功', 5);
        }
      });
    } else {
      const opContent = `修改随附单据${record.docu_spec}(${record.docu_code}})`;
      this.props.updateDocuMark(
        { docu_code: record.docu_code, docu_spec: record.docu_spec },
        record.id, head.pre_entry_seq_no, opContent,
      ).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.info('修改成功', 5);
        }
      });
    }
    this.setState({ activeIndex: '' });
  }
  renderUpload = (rowId) => {
    const { docType } = this.state;
    const { head } = this.props;
    const formData = {
      docType, // ARCHIVE_TYPE
      bizObject: SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key,
      billNo: head.pre_entry_seq_no,
      ownerPartnerId: head.owner_cuspartner_id,
      ownerTenantId: head.owner_custenant_id,
    };
    const props = {
      action: `${API_ROOTS.default}v1/saas/biz/attachment/attfileupload`,
      data: { data: JSON.stringify(formData) },
      multiple: false,
      showUploadList: false,
      withCredentials: true,
      onChange: (info) => {
        if (info.file.response && info.file.response.status === 200) {
          // 上传成功后更新随附单据的docu_file
          const { cdnUrl, attachId } = info.file.response.data;
          this.handleUploaded(cdnUrl, attachId, rowId);
          message.success('上传成功');
        }
      },
    };
    const popoverContent = (<Input.Group compact>
      <Select placeholder={this.msg('选择存档类型')} onChange={this.handleTypeChange} value={docType} style={{ width: 200 }}>
        {ARCHIVE_TYPE.map(opt => <Option value={opt.value} key={opt.value}>{opt.text}</Option>)}
      </Select>
      <Upload {...props}>
        <Button type="primary">上传</Button>
      </Upload>
    </Input.Group>);
    return (<Popover content={popoverContent} placement="bottom" trigger="click">
      <Button icon="upload" size="small" />
    </Popover>);
  }

  render() {
    const { head } = this.props;
    return (
      <DataPane
        columns={this.columns}
        bordered
        dataSource={this.state.docList}
        rowKey="id"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="clearance" feature="customs" action="create">
            <Button type="primary" onClick={this.handleAdd} icon="plus-circle-o" disabled={head.status >= CMS_DECL_STATUS.sent.value}>{this.msg('add')}</Button>
          </PrivilegeCover>
          <Button onClick={this.handleGeneratePack} icon="file-pdf" disabled={head.status >= CMS_DECL_STATUS.sent.value || this.state.docList.length !== 0}>{this.msg('生成发票/箱单/合同')}</Button>
          {this.state.docList.length > 0 && // TODO: 判断是否存在可供下载的文件
          <Button icon="download" onClick={this.handleDownloadAll}>全部下载</Button>}
        </DataPane.Toolbar>
        <AddAttDocPermitModal />
      </DataPane>
    );
  }
}
