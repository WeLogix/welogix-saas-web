import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Col, DatePicker, Form, Modal, Row, Select, Input, Tabs } from 'antd';
import { toggleVoucherModal } from 'common/reducers/bssVoucher';
import VoucherEntryPane from '../../common/voucherEntryPane';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssVoucher.voucherModal.visible,
    record: state.bssVoucher.voucherModal.record,
  }),
  { toggleVoucherModal },
)
@Form.create()
export default class VoucherModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.toggleVoucherModal(false);
  };
  handleOk = () => {};
  render() {
    const {
      visible,
      form: { getFieldDecorator },
      record,
    } = this.props;
    return (
      <Modal
        width={1000}
        maskClosable={false}
        title={this.msg('voucher')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        style={{ top: 64 }}
      >
        <Form layout="horizontal" className="grid-form">
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('凭证号')} {...formItemLayout}>
                <Col span={6}>
                  {getFieldDecorator('voucher_mark', {
                    initialValue: record.voucher_mark,
                  })(<Select showSearch optionFilterProp="children">
                    <Option key="01">记</Option>
                    <Option key="02">收</Option>
                    <Option key="03">付</Option>
                    <Option key="10">转</Option>
                  </Select>)}
                </Col>
                <Col span={4}>字第</Col>
                <Col span={12}>
                  {getFieldDecorator('voucher_no', {
                    initialValue: record.voucher_no,
                  })(<Input />)}
                </Col>
                号
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('日期')} {...formItemLayout}>
                {getFieldDecorator('invoice_date', {
                  initialValue: record.invoice_date,
                  rules: [{ required: true, message: this.msg('pleaseInputInvoiceAmount') }],
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label={this.msg('制单人')} {...formItemLayout}>
                {getFieldDecorator('invoice_code', {
                  initialValue: record.invoice_code,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Card bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="voucherEntries">
              <TabPane tab="凭证分录" key="voucherEntries">
                <VoucherEntryPane form={this.props.form} />
              </TabPane>
            </Tabs>
          </Card>
        </Form>
      </Modal>
    );
  }
}
