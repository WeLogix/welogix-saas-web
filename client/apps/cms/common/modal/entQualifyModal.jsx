import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Row, Col, Input, Button, Table } from 'antd';
import { saveEntQualif, loadEntQualifs, deleteEntQualif } from 'common/reducers/cmsCiqInDecl';
import { CIQ_ENT_QUALIF_TYPE_I, CIQ_ENT_QUALIF_TYPE_E } from 'common/constants';
import RowAction from 'client/components/RowAction';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
  (state, props) => ({
    CIQ_ENT_QUALIF_TYPE: props.ietype === 'import' ? CIQ_ENT_QUALIF_TYPE_I : CIQ_ENT_QUALIF_TYPE_E,
  }),
  {
    saveEntQualif, loadEntQualifs, deleteEntQualif,
  }
)
@Form.create()
export default class EntQualifyModal extends Component {
  static propTypes = {
    msg: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    declInfo: PropTypes.shape({
      delg_no: PropTypes.string,
      pre_entry_seq_no: PropTypes.string,
    }).isRequired,
    onModalClose: PropTypes.func.isRequired,
    onModalChanged: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  state = {
    entQualifs: [],
  }
  componentDidMount() {
    if (this.props.declInfo.delg_no) {
      this.handleEntQualifLoad(this.props.declInfo.delg_no, this.props.declInfo.pre_entry_seq_no);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.declInfo.delg_no !== this.props.declInfo.delg_no ||
      nextProps.declInfo.pre_entry_seq_no !== this.props.declInfo.pre_entry_seq_no)) {
      this.handleEntQualifLoad(nextProps.declInfo.delg_no, nextProps.declInfo.pre_entry_seq_no);
    }
  }
  handleEntQualifLoad = (delgNo, preEntrySeqNo) => {
    this.props.loadEntQualifs(delgNo, preEntrySeqNo).then((result) => {
      if (!result.error) {
        const fetchData = result.data;
        const entQualifs = fetchData ? fetchData.map((fd, ind) => ({ ...fd, g_no: ind + 1 })) : [];
        this.props.onModalChanged(entQualifs);
        this.setState({ entQualifs });
      }
    });
  }
  handleCancel = () => {
    this.props.onModalClose(this.state.entQualifs);
  }
  handleSave = () => {
    const { form, declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const opContent = `新增企业资质类别${values.ent_qualif_type_code}(${values.ent_qualif_no})`;
        const data = {
          ent_qualif_type_code: values.ent_qualif_type_code,
          ent_qualif_no: values.ent_qualif_no,
          delg_no: delgNo,
          pre_entry_seq_no: preEntrySeqNo,
          opContent,
        };
        this.props.saveEntQualif(data).then((result) => {
          if (!result.error) {
            const entQualifs = [...this.state.entQualifs];
            data.g_no = entQualifs.length + 1;
            data.id = result.data;
            entQualifs.push(data);
            this.setState({
              entQualifs,
            });
            // this.handleEntQualifLoad(delgNo, preEntrySeqNo);
            form.resetFields();
          }
        });
      }
    });
  }
  handleDelete = (row) => {
    const { declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    const opContent = `删除企业资质${row.ent_qualif_type_code}(${row.ent_qualif_no})`;
    this.props.deleteEntQualif({
      ids: [row.id], delgNo, preEntrySeqNo, opContent,
    }).then((result) => {
      if (!result.error) {
        const entQualifs = [...this.state.entQualifs].filter(eq => eq.id !== row.id)
          .map((fd, ind) => ({ ...fd, g_no: ind + 1 }));
        this.setState({ entQualifs });
      }
    });
  }
  columns = [{
    title: this.props.msg('seqNo'),
    dataIndex: 'g_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: this.props.msg('entQualifTypeCode'),
    dataIndex: 'ent_qualif_type_code',
    width: 150,
  }, {
    title: this.props.msg('entQualifName'),
    render: (_, record) => {
      const qualif = this.props.CIQ_ENT_QUALIF_TYPE.find(type =>
        type.value === record.ent_qualif_type_code);
      return qualif ? qualif.text : null;
    },
  }, {
    title: this.props.msg('entQualifNo'),
    dataIndex: 'ent_qualif_no',
    with: 200,
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 90,
    render: (o, record) => (<span>
      <RowAction danger confirm={this.props.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" tooltip={this.props.msg('delete')} row={record} disabled={this.props.disabled} />
    </span>),
  }];
  render() {
    const {
      visible, msg, CIQ_ENT_QUALIF_TYPE, form: { getFieldDecorator }, disabled,
    } = this.props;
    const { entQualifs } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal width={960} title={msg('entQualif')} visible={visible} onCancel={this.handleCancel} footer={null}>
        <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col">
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label={msg('entQualifTypeCode')}>
                {getFieldDecorator('ent_qualif_type_code', {
                  rules: [
                    { required: true, message: '企业资质类别不能为空' },
                  ],
                })(<Select showSearch optionFilterProp="children" allowClear dropdownMatchSelectWidth={false} dropdownStyle={{ width: 460 }}>
                  {CIQ_ENT_QUALIF_TYPE.map(type =>
                    (<Option key={type.value} value={type.value}>
                      {type.value} | {type.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label={msg('entQualifNo')}>
                {getFieldDecorator('ent_qualif_no')(<Input />)}
              </FormItem>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="save" onClick={this.handleSave} disabled={disabled}>{msg('save')}</Button>
            </Col>
          </Row>
        </Form>
        <Table size="small" columns={this.columns} dataSource={entQualifs} pagination={false} rowKey="id" />
      </Modal>
    );
  }
}
