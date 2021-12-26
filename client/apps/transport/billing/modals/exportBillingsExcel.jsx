import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, DatePicker, Modal, Select, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';
import moment from 'moment';
import { createFilename } from 'client/util/dataTransform';

const formatMsg = format(messages);
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const startDate = new Date();
startDate.setDate(1);

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
  }),
  { }
)
export default class ExportBillingExcel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['receivable', 'payable']),
    style: PropTypes.object.isRequired,
  }
  state = {
    visible: false,
    startDate: `${moment(startDate).format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment(new Date()).format('YYYY-MM-DD')} 23:59:59`,
    dateType: '',
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    const { dateType, endDate } = this.state;
    const { tenantId, type } = this.props;
    if (dateType !== '') {
      window.open(`${API_ROOTS.default}v1/transport/billing/exportBillingsExcel/${createFilename('billings')}.xlsx?tenantId=${tenantId}&type=${type}&startDate=${this.state.startDate}&endDate=${endDate}&dateType=${dateType}`);
      this.handleClose();
    } else {
      message.error('请选择参照时间类型');
    }
  }
  handleClose = () => {
    this.setState({
      visible: false,
    });
  }
  handleRangeChange = (value, dateString) => {
    this.setState({
      startDate: `${dateString[0]} 00:00:00`,
      endDate: `${dateString[1]} 23:59:59`,
    });
  }
  handleDateTypeChange = (value) => {
    this.setState({ dateType: value });
  }
  msg = descriptor => formatMsg(this.props.intl, descriptor)

  render() {
    return (
      <span style={this.props.style || {}}>
        <Button icon="export" onClick={this.showModal}>{this.msg('export')}</Button>
        <Modal maskClosable={false} title={this.msg('exportExcel')}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleClose}
        >
          <Form layout="horizontal">
            <FormItem label="参照时间" labelCol={{ span: 6 }}
              wrapperCol={{ span: 13 }}
            >
              <Select onChange={this.handleDateTypeChange}>
                <Option value="begin_date">账单开始时间</Option>
                <Option value="end_date">账单结束时间</Option>
              </Select>
            </FormItem>
            <FormItem
              label="时间范围"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <RangePicker value={
                [moment(this.state.startDate), moment(this.state.endDate)]
              } onChange={this.handleRangeChange}
              />
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
