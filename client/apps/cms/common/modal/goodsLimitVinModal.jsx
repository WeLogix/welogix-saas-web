import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Row, Input, Modal, Button, DatePicker, Table } from 'antd';
import RowAction from 'client/components/RowAction';

const FormItem = Form.Item;
@Form.create()
export default class GoodsLimitVinModal extends Component {
  static propTypes = {
    msg: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    goodsLimit: PropTypes.shape({
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
      lic_type: PropTypes.string,
      licence_no: PropTypes.string,
      limit_no: PropTypes.number,
    }).isRequired,
    vinModalVisible: PropTypes.bool.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    onVinModalClose: PropTypes.func.isRequired,
    onVinModalChange: PropTypes.func.isRequired,
  }
  state = {
    vins: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goodsLimit !== this.props.goodsLimit) {
      const vins = nextProps.goodsLimit.vins.map((glv, index) => ({ ...glv, seq_no: index }));
      this.setState({
        vins,
      });
    }
  }

  msg = this.props.msg
  handleCancel = () => {
    this.setState({
      vins: [],
    });
    this.props.onVinModalClose();
  }
  handleOk = () => {
    this.props.onVinModalChange(this.state.vins);
    this.props.onVinModalClose();
  }
  handleSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const newVins = [...this.state.vins];
        const vin = {
          vin_no: values.vin_no,
          bill_lad_date: values.bill_lad_date && values.bill_lad_date.format('YYYY-MM-DD'),
          chassis_no: values.chassis_no,
          invoice_no: values.invoice_no,
          invoice_num: values.invoice_num,
          motor_no: values.motor_no,
          price_per_unit: values.price_per_unit,
          product_name_cn: values.product_name_cn,
          product_name_en: values.product_name_en,
          product_no: values.product_no,
          quality_gurantee_period: values.quality_gurantee_period,
          vin_code: values.vin_code,
          seq_no: this.state.vins.length + 1,
        };
        newVins.push(vin);
        this.setState({
          vins: newVins,
        });
        this.props.form.resetFields();
      }
    });
  }
  handleDelete = (row) => {
    const vins = this.state.vins.filter(v => v.seq_no !== row.seq_no);
    this.setState({
      vins,
    });
  }
  columns = [{
    title: this.msg('vinNo'),
    dataIndex: 'vin_no',
    width: 120,
  }, {
    title: this.msg('billLadDate'),
    dataIndex: 'bill_lad_date',
    width: 150,
  }, {
    title: this.msg('qualityGuranteePeriod'),
    dataIndex: 'quality_gurantee_period',
    width: 150,
  }, {
    title: this.msg('motorNo'),
    dataIndex: 'motor_no',
    align: 'center',
    width: 170,
  }, {
    title: this.msg('vinCode'),
    dataIndex: 'vin_code',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('chassisNo'),
    dataIndex: 'chassis_no',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('invoiceNo'),
    dataIndex: 'invoice_no',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('invoiceNum'),
    dataIndex: 'invoice_num',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('productName'),
    dataIndex: 'product_name_cn',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('productNameEn'),
    dataIndex: 'product_name_en',
    align: 'center',
    width: 150,
  }, {
    title: this.msg('proNo'),
    dataIndex: 'product_no',
    align: 'center',
    width: 160,
  }, {
    title: this.msg('pricePerUnit'),
    dataIndex: 'price_per_unit',
    align: 'center',
    width: 100,
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 50,
    render: (o, record) => [
      <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" key="delete" tooltip={this.msg('delete')} row={record} />,
    ],
  }];
  render() {
    const {
      disabled, vinModalVisible, goodsLimit, form: { getFieldDecorator },
    } = this.props;
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
      <Modal width={1000} title={this.msg('VIN')} visible={vinModalVisible} maskClosable={false} onCancel={this.handleCancel} onOk={this.handleOk} destroyOnClose>
        <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col">
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('licenceType')} >
                <Input value={goodsLimit.lic_tlicenceVINype} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('licenceNo')} >
                <Input value={goodsLimit.licence_no} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('vinNo')} >
                {getFieldDecorator('vin_no', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('billLadDate')} >
                {getFieldDecorator('bill_lad_date', {
})(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('qualityGuranteePeriod')} >
                {getFieldDecorator('quality_gurantee_period', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('vinCode')} >
                {getFieldDecorator('vin_code', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('motorNo')} >
                {getFieldDecorator('motor_no', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('invoiceNo')} >
                {getFieldDecorator('invoice_no', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('invoiceNum')} >
                {getFieldDecorator('invoice_num', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('productName')} >
                {getFieldDecorator('product_name_cn', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('productNameEn')} >
                {getFieldDecorator('product_name_en', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('proNo')} >
                {getFieldDecorator('product_no', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('chassisNo')} >
                {getFieldDecorator('chassis_no', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} colon={false} label={this.msg('pricePerUnit')} >
                {getFieldDecorator('price_per_unit', {
                  })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="plus-circle-o" onClick={this.handleSave} disabled={disabled}>{this.msg('add')}</Button>
            </Col>
          </Row>
        </Form>
        <Table size="small" columns={this.columns} scroll={{ x: 1500 }} dataSource={this.state.vins} pagination={false} rowKey="id" />
      </Modal>
    );
  }
}

