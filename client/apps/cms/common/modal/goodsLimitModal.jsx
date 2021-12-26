import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Row, Input, Select, Modal, Table, Button, Switch } from 'antd';
import { CIQ_GOODS_LIMITS_TYPE_I, CIQ_GOODS_LIMITS_TYPE_E } from 'common/constants';
import RowAction from 'client/components/RowAction';
import GoodsLimitVinModal from './goodsLimitVinModal';

const FormItem = Form.Item;
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
      : <Input size="small" placeholder={placeholder} value={record[field] || ''} onChange={handleChange} />;
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
      <Select size="small" showSearch optionFilterProp="children" value={record[field] || ''} onChange={handleChange} style={{ width: '100%' }}>
        {
          options.map(opt => opt &&
            <Option value={opt.value} key={opt.value}>{`${opt.value}|${opt.text}`}</Option>)
        }
      </Select>
    );
  }
  const existOpt = options.find(opt => opt.value === record[field]);
  return <span>{existOpt && existOpt.text}</span>;
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

@Form.create()
export default class GoodsLimitModal extends Component {
  static propTypes = {
    msg: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    goodsLimitModalvisible: PropTypes.bool.isRequired,
    goodsLimitsInfo: PropTypes.arrayOf(PropTypes.shape({
      limit_no: PropTypes.number,
      vins: PropTypes.arrayOf(PropTypes.shape({
        goods_limit_uid: PropTypes.string,
        vin_no: PropTypes.string,
        bill_lad_date: PropTypes.string,
        quality_gurantee_period: PropTypes.string,
        motor_no: PropTypes.string,
        vin_code: PropTypes.string,
        chassis_no: PropTypes.string,
        invoice_no: PropTypes.string,
        invoice_num: PropTypes.number,
        product_name_cn: PropTypes.string,
        product_name_en: PropTypes.string,
        product_no: PropTypes.string,
        price_per_unit: PropTypes.number,
      })),
      lic_type_code: PropTypes.string,
      lic_writeoff_detailno: PropTypes.string,
      lic_writeoff_qty: PropTypes.string,
      licence_no: PropTypes.string,
    })),
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    onGoodsLimitModalChange: PropTypes.func.isRequired,
    onGoodsLimitModalClose: PropTypes.func.isRequired,
  }
  state = {
    goodsLimits: [],
    vinModalVisible: false,
    goodsLimit: {},
    activeIndex: null,
    activeRecord: null,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goodsLimitModalvisible !== this.props.goodsLimitModalvisible
      && nextProps.goodsLimitModalvisible) {
      this.setState({
        goodsLimits: [...nextProps.goodsLimitsInfo],
      });
    }
  }
  msg = this.props.msg
  handleCancel = () => {
    this.setState({
      goodsLimits: [],
      goodsLimit: {},
      activeIndex: null,
    });
    this.props.onGoodsLimitModalClose();
  }
  handleVinModalClose = () => {
    this.setState({
      vinModalVisible: false,
    });
  }
  handleOk = () => {
    this.props.onGoodsLimitModalChange(this.state.goodsLimits);
    this.props.onGoodsLimitModalClose();
  }
  handleSave = () => {
    this.props.form.validateFields((errors, formValues) => {
      if (!errors) {
        const goodslimits = [...this.state.goodsLimits];
        const goodsLimit = {
          lic_type_code: formValues.lic_type_code,
          lic_writeoff_detailno: formValues.lic_writeoff_detailno,
          lic_writeoff_qty: formValues.lic_writeoff_qty,
          licence_no: formValues.licence_no,
          limit_no: goodslimits.length + 1,
          if_need_pdf: formValues.if_need_pdf,
        };
        goodslimits.push(goodsLimit);
        this.setState({
          goodsLimits: goodslimits,
          activeIndex: null,
        });
        this.props.form.resetFields();
      }
    });
  }
  handleVinModalOpen = (row) => {
    const goodslimits = this.state.goodsLimits;
    const gls = goodslimits.find(gl => gl.limit_no === row.limit_no);
    this.setState({
      vinModalVisible: true,
      goodsLimit: {
        lic_type: this.renderLicenceType(row.lic_type_code),
        licence_no: row.licence_no,
        limit_no: row.limit_no,
        vins: gls && gls.vins ? gls.vins : [],
      },
    });
  }
  handleVinModalChange = (vins) => {
    const goodslimits = this.state.goodsLimits.map((gl) => {
      if (gl.limit_no === this.state.goodsLimit.limit_no) {
        return { ...gl, vins };
      }
      return gl;
    });
    this.setState({
      goodsLimits: goodslimits,
    });
  }
  handleDelete = (row) => {
    const goodsLimits = this.state.goodsLimits.filter(gl => gl.limit_no !== row.limit_no)
      .map((gl, index) => ({ ...gl, limit_no: index + 1 }));
    this.setState({
      goodsLimits,
    });
  }
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'limit_no',
    width: 45,
  }, {
    title: this.msg('licenceType'),
    dataIndex: 'lic_type_code',
    width: 200,
    render: (o, record, index) => (<ColumnSelect
      field="lic_type_code"
      inEdit={this.state.activeIndex === index}
      record={(this.state.activeIndex === index && this.state.activeRecord) || record}
      onChange={this.handleEditChange}
      options={this.props.ietype === 'import' ? CIQ_GOODS_LIMITS_TYPE_I : CIQ_GOODS_LIMITS_TYPE_E}
    />),
  }, {
    title: this.msg('licenceNo'),
    dataIndex: 'licence_no',
    width: 200,
    render: (o, record, index) =>
      (<ColumnInput
        field="licence_no"
        inEdit={this.state.activeIndex === index}
        record={(this.state.activeIndex === index && this.state.activeRecord) || record}
        onChange={this.handleEditChange}
      />),
  }, {
    title: this.msg('wrtofDetailNo'),
    dataIndex: 'lic_writeoff_detailno',
    width: 100,
    render: (o, record, index) =>
      (<ColumnInput
        field="lic_writeoff_detailno"
        inEdit={this.state.activeIndex === index}
        record={(this.state.activeIndex === index && this.state.activeRecord) || record}
        onChange={this.handleEditChange}
      />),
  }, {
    title: this.msg('wrtofQty'),
    dataIndex: 'lic_writeoff_qty',
    width: 100,
    render: (o, record, index) =>
      (<ColumnInput
        field="lic_writeoff_qty"
        inEdit={this.state.activeIndex === index}
        record={(this.state.activeIndex === index && this.state.activeRecord) || record}
        onChange={this.handleEditChange}
      />),
  }, {
    title: this.msg('whetherNeedPdf'),
    dataIndex: 'if_need_pdf',
    render: o => (o ? '是' : '否'),
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 130,
    render: (o, record, index) => {
      if (this.state.activeIndex !== index) {
        return (<span>
          <RowAction onClick={this.handleEdit} icon="edit" tooltip={this.msg('modify')} row={record} index={index} />
          <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" row={record} />
          <RowAction icon="file-text" key="vin" tooltip={this.msg('vinInfo')} row={record} onClick={this.handleVinModalOpen} />
        </span>);
      }
      return (<span>
        <RowAction onClick={this.handleEditSave} icon="save" tooltip={this.msg('save')} row={record} index={index} />
        <RowAction onClick={this.handleEditCancel} icon="close" tooltip={this.msg('cancel')} row={record} index={index} />
        <RowAction icon="file-text" key="vin" tooltip={this.msg('vinInfo')} row={record} onClick={this.handleVinModalOpen} />
      </span>);
    },
  }];
  handleEdit = (record, index) => {
    this.setState({
      activeIndex: index,
      activeRecord: { ...record },
    });
  }
  handleEditChange = (record, field, value) => {
    const activeRecord = { ...this.state.activeRecord };
    activeRecord[field] = value;
    this.setState({ activeRecord });
  }
  handleEditSave = (record, index) => {
    const goodsLimits = [...this.state.goodsLimits];
    goodsLimits[index] = { ...this.state.activeRecord };
    this.setState({
      goodsLimits,
      activeIndex: null,
      activeRecord: null,
    });
  }
  handleEditCancel = () => {
    this.setState({ activeIndex: null, activeRecord: null });
  }
  renderLicenceType = (typeCode) => {
    const CIQ_GOODS_LIMITS = this.props.ietype === 'import' ? CIQ_GOODS_LIMITS_TYPE_I : CIQ_GOODS_LIMITS_TYPE_E;
    const licence = CIQ_GOODS_LIMITS.find(type => type.value === typeCode);
    if (licence) {
      return `${typeCode} | ${licence.text}`;
    }
    return typeCode;
  }
  render() {
    const {
      declBody, disabled, goodsLimitModalvisible, form: { getFieldDecorator }, ietype,
    } = this.props;
    const { goodsLimits } = this.state;
    const CIQ_GOODS_LIMITS = ietype === 'import' ? CIQ_GOODS_LIMITS_TYPE_I : CIQ_GOODS_LIMITS_TYPE_E;
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
      <Modal width={1000} title={this.msg('goodsLicence')} visible={goodsLimitModalvisible} maskClosable={false} onCancel={this.handleCancel} onOk={this.handleOk} destroyOnClose>
        <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col">
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('codeT')} >
                <Input value={declBody.hscode} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('gName')} >
                <Input value={declBody.g_name} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('ciqCode')} >
                <Input value={declBody.ciqcode && `${declBody.ciqcode}|${declBody.ciqname}`} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('seqNo')} >
                {getFieldDecorator('limit_no', {
                initialValue: goodsLimits.length + 1,
                  })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('licenceType')} >
                {getFieldDecorator('lic_type_code', {
                  rules: [{ required: true }],
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  onChange={this.handleLicTypeChange}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 460 }}
                >
                  {CIQ_GOODS_LIMITS.map(type =>
                        (<Option key={type.value} value={type.value}>
                          {type.value}|{type.text}
                        </Option>))
                    }
                </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('licenceNo')} >
                {getFieldDecorator('licence_no', { rules: [{ required: true }] })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('wrtofDetailNo')} >
                {getFieldDecorator('lic_writeoff_detailno', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('wrtofQty')} >
                {getFieldDecorator('lic_writeoff_qty', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('whetherNeedPdf')} >
                {getFieldDecorator('if_need_pdf', {
                  valuePropName: 'checked',
                })(<Switch />)}
                <Button type="primary" icon="plus-circle-o" onClick={this.handleSave} disabled={disabled} style={{ marginLeft: 20 }}>
                  {this.msg('add')}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table size="small" columns={this.columns} dataSource={goodsLimits} pagination={false} rowKey="id" />
        <GoodsLimitVinModal
          vinModalVisible={this.state.vinModalVisible}
          goodsLimit={this.state.goodsLimit}
          msg={this.props.msg}
          onVinModalClose={this.handleVinModalClose}
          onVinModalChange={this.handleVinModalChange}
        />
      </Modal>
    );
  }
}
