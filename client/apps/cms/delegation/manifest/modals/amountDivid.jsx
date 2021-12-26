import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Form, Modal, InputNumber, notification, Select, Row, Col, message } from 'antd';
import { closeAmountModal, dividTotalAmount } from 'common/reducers/cmsManifest';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visibleAmtModal: state.cmsManifest.visibleAmtModal,
    currencies: state.saasParams.latest.currency,
  }),
  {
    closeAmountModal, dividTotalAmount,
  }
)
@Form.create()
export default class AmountModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visibleAmtModal: PropTypes.bool.isRequired,
    billSeqNo: PropTypes.string,
    currencies: PropTypes.arrayOf(PropTypes.shape({ curr_code: PropTypes.string })).isRequired,
  }
  state = {
    amount: null,
    currency: null,
  }
  handleAmountChange = (value) => {
    this.setState({ amount: value });
  }
  handleSelect = (val) => {
    this.setState({ currency: val });
  }
  handleCancel = () => {
    this.props.closeAmountModal();
  }
  handleOk = () => {
    const { amount, currency } = this.state;
    if (amount === 0) {
      return;
    }
    if (currency === null) {
      message.warning('请选择币制');
      return;
    }
    const amtCurr = this.props.currencies.find(cr => cr.curr_code === currency);
    this.props.dividTotalAmount(this.props.billSeqNo, amount, currency).then((result) => {
      this.props.closeAmountModal();
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        notification.success({
          message: '操作成功',
          description: `总金额: ${amount} ${amtCurr.curr_name} 已平摊`,
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visibleAmtModal, currencies } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="金额平摊"
        visible={visibleAmtModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Alert message="将按每项申报总价的占比重新分摊输入的总金额" type="info" showIcon />
        <Row>
          <Col sm={24} lg={16}>
            <FormItem label="待分摊总金额" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <InputNumber min={0} onChange={this.handleAmountChange} value={this.state.amount} style={{ width: '80%' }} />
            </FormItem>
          </Col>
          <Col sm={24} lg={8}>
            <FormItem>
              <Select showSearch showArrow optionFilterProp="children" style={{ width: '100%' }} placeholder="币制必填" onChange={this.handleSelect} >
                {currencies.map(data => (
                  <Option key={data.curr_code} value={data.curr_code} >
                    {data.curr_code} | {data.curr_name}</Option>))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}
