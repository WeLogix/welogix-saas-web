import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Radio, Form, Modal, Input, Row, Col } from 'antd';
import { format } from 'client/common/i18n/helpers';
import { closePackingRuleModal, saveSkuTemplate, loadSkuParams } from 'common/reducers/cwmSku';
import messages from '../../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
@connect(
  state => ({
    visible: state.cwmSku.packingRuleModal.visible,
    loginId: state.account.loginId,
    owner: state.cwmSku.owner,
  }),
  { closePackingRuleModal, saveSkuTemplate, loadSkuParams }
)
@Form.create()
export default class PackingRuleModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    conveyBoxQty: '',
    conveyPalletQty: '',
  }
  msg = key => formatMsg(this.props.intl, key);
  handleCancel = () => {
    this.props.closePackingRuleModal();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { loginId, owner } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        data.convey_pallet_qty = data.convey_box_qty * data.pallet_pack_qty;
        this.props.saveSkuTemplate(data, loginId, owner.id).then((result) => {
          if (!result.error) {
            this.props.loadSkuParams(this.props.owner.id);
            this.props.closePackingRuleModal();
            this.props.form.setFieldsValue({
              code: '',
              desc: '',
              convey_inner_qty: '',
              convey_box_qty: '',
              convey_pallet_qty: '',
            });
          }
        });
      }
    });
  }
  handleBoxChange = (e) => {
    this.setState({ conveyBoxQty: e.target.value });
  }
  handlePalleteChange = (e) => {
    this.setState({ conveyPalletQty: e.target.value });
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { conveyBoxQty, conveyPalletQty } = this.state;
    return (
      <Modal maskClosable={false} title="????????????" width={800} onCancel={this.handleCancel} onOk={this.handleSubmit} visible={this.props.visible}>
        <Form>
          <Row gutter={16}>
            <Col sm={12}>
              <FormItem label={this.msg('packingCode')}>
                {getFieldDecorator('code', {
                  rules: [{
                    required: true, message: 'Please input code!',
                  }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('desc')}>
                {getFieldDecorator('desc', {
                })(<Input />)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('????????????')}>
                <InputGroup compact>
                  {getFieldDecorator('convey_inner_qty', {
                    rules: [{
                      required: true, message: 'Please input convey_inner_qty!',
                    }],
                  })(<Input style={{ width: '100%' }} placeholder="SKU??????" />)}
                </InputGroup>
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('?????????')}>
                <InputGroup compact>
                  {getFieldDecorator('convey_box_qty', {
                    rules: [{
                      required: true, message: 'Please input convey_box_qty!',
                    }],
                    initialValue: conveyBoxQty,
                  })(<Input style={{ width: '100%' }} placeholder="SKU??????" onChange={this.handleBoxChange} />)}
                </InputGroup>
              </FormItem>
            </Col>
            <Col sm={24}>
              <FormItem label={this.msg('?????????')}>
                <InputGroup compact>
                  {getFieldDecorator('pallet_pack_qty', {
                    rules: [{
                      required: true, message: 'Please input pallet_pack_qty!',
                    }],
                    initialValue: conveyPalletQty,
                  })(<Input style={{ width: '50%' }} placeholder="??????" onChange={this.handlePalleteChange} />)}
                  <Input value={conveyPalletQty * conveyBoxQty ? conveyPalletQty * conveyBoxQty : ''} style={{ width: '50%' }} placeholder="SKU??????" disabled />
                </InputGroup>
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????????????????')}>
                {getFieldDecorator('inbound_convey', {
                  initialValue: 'PCS',
                })(<RadioGroup >
                  <RadioButton value="PCS">??????</RadioButton>
                  <RadioButton value="INP">?????????</RadioButton>
                  <RadioButton value="BOX">???</RadioButton>
                  <RadioButton value="PLT">??????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????????????????')}>
                {getFieldDecorator('outbound_convey', {
                  initialValue: 'PCS',
                })(<RadioGroup >
                  <RadioButton value="PCS">??????</RadioButton>
                  <RadioButton value="INP">?????????</RadioButton>
                  <RadioButton value="BOX">???</RadioButton>
                  <RadioButton value="PLT">??????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????????????????')}>
                {getFieldDecorator('tracing_convey', {
                  initialValue: 'PCS',
                })(<RadioGroup >
                  <RadioButton value="PCS">??????</RadioButton>
                  <RadioButton value="INP">?????????</RadioButton>
                  <RadioButton value="BOX">???</RadioButton>
                  <RadioButton value="PLT">??????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????????????????')}>
                {getFieldDecorator('replenish_convey', {
                  initialValue: 'BOX',
                })(<RadioGroup >
                  <RadioButton value="BOX">???</RadioButton>
                  <RadioButton value="PLT">??????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????ASN????????????')}>
                {getFieldDecorator('asn_tag_unit', {
                  initialValue: 'primary',
                })(<RadioGroup >
                  <RadioButton value="primary">????????????</RadioButton>
                  <RadioButton value="sku">SKU????????????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label={this.msg('??????SO????????????')}>
                {getFieldDecorator('so_tag_unit', {
                  initialValue: 'primary',
                })(<RadioGroup >
                  <RadioButton value="primary">????????????</RadioButton>
                  <RadioButton value="sku">SKU????????????</RadioButton>
                </RadioGroup>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
