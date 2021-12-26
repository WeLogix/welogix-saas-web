import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popover, DatePicker, Button, Form, Input, InputNumber, Row, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadCiqModelFields, formatCiqModelString } from './ciqModelFunction';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
export default class CiqModelPopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ciqModelSource: PropTypes.shape({
      g_ciq_model: PropTypes.string,
      product_no: PropTypes.string,
      manufcr_regno: PropTypes.string,
      manufcr_regname: PropTypes.string,
    }).isRequired,
    isCDF: PropTypes.bool,
  }
  state = {
    visible: false,
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.controlVisible && nextProps.controlVisible !== this.props.controlVisible) {
      this.setState({ visible: false });
    }
  }
  msg = formatMsg(this.props.intl)
  handleVisibleToggle= () => {
    this.setState({
      visible: !this.state.visible,
    });
  }
  handleOk = () => {
    const ciqModelFields = loadCiqModelFields(this.props.isCDF);
    const ciqModelValues = this.props.form.getFieldsValue(ciqModelFields.map(cmf => cmf.key));
    const gCiqModel = formatCiqModelString(ciqModelValues, this.props.isCDF);
    this.props.form.setFieldsValue({
      g_ciq_model: gCiqModel,
    });
    this.setState({
      visible: false,
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, ciqModelSource, ietype, isCDF,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const content = (
      <Form className="form-layout-compact">
        <FormItem {...formItemLayout} colon={false} label={this.msg('stuff')} >
          {getFieldDecorator('stuff', {
            initialValue: ciqModelSource.stuff,
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('expiryDate')} >
          {getFieldDecorator('expiry_date', {
            initialValue: ciqModelSource.expiry_date && moment(ciqModelSource.expiry_date),
          })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('prodQgp')} >
          {getFieldDecorator('warranty_days', {
            initialValue: ciqModelSource.warranty_days,
          })(<InputNumber min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('overseaManufacture')} >
          {getFieldDecorator('oversea_manufcr_name', {
            initialValue: ciqModelSource.oversea_manufcr_name,
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('goodsSpec')}>
          {getFieldDecorator('product_spec', { // 规格
            initialValue: ciqModelSource.product_spec,
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('ciqProductNo')}>
          {getFieldDecorator(isCDF ? 'product_models' : 'product_model', { // 型号
            initialValue: isCDF ? ciqModelSource.product_models : ciqModelSource.product_model,
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('goodsBrand')} >
          {getFieldDecorator('brand', {
                    initialValue: ciqModelSource.brand,
                  })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('produceDate')} >
          {isCDF ? getFieldDecorator('produce_date_str', {
            initialValue: ciqModelSource.produce_date_str,
          })(<Input placeholder="YYYY-MM-DD 多个时;分隔" />) :
          getFieldDecorator('produce_date', {
            initialValue: ciqModelSource.produce_date && moment(ciqModelSource.produce_date),
          })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label={this.msg('productBatchLot')} >
          {getFieldDecorator('external_lot_no', {
                    initialValue: ciqModelSource.external_lot_no,
                  })(<Input />)}
        </FormItem>
        {ietype === 'export' &&
        <FormItem {...formItemLayout} colon={false} label={this.msg('manufcrRegNo')}>
          {getFieldDecorator('manufcr_regno', {
            initialValue: ciqModelSource.manufcr_regno,
          })(<Input />)}
        </FormItem>}
        {ietype === 'export' &&
        <FormItem {...formItemLayout} colon={false} label={this.msg('manufcrRegName')}>
          {getFieldDecorator('manufcr_regname', {
            initialValue: ciqModelSource.manufcr_regname,
          })(<Input />)}
        </FormItem>}
        <Row style={{ textAlign: 'right' }}>
          <Button onClick={this.handleVisibleToggle} style={{ marginRight: 8 }}>{this.msg('cancel')}</Button>
          <Button type="primary" onClick={this.handleOk}>{this.msg('ok')}</Button>
        </Row>
      </Form>
    );
    return (
      <Popover
        title={this.msg('goodsSpec')}
        content={content}
        trigger="click"
        visible={this.state.visible}
        placement="leftBottom"
        overlayStyle={{ width: 480 }}
      >
        <Button size="small" onClick={this.handleVisibleToggle}>
          <Icon type="ellipsis" />
        </Button>
      </Popover>
    );
  }
}
