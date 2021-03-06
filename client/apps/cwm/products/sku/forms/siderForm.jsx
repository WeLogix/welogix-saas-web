import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Card, Checkbox, Input, Select, Radio, Icon, Tooltip } from 'antd';
import { setSkuForm } from 'common/reducers/cwmSku';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
@connect(
  state => ({
    packings: state.cwmSku.params.packings,
    skuForm: state.cwmSku.skuForm,
    owner: state.cwmSku.owner,
  }),
  { setSkuForm }
)
export default class SiderForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    packings: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      desc: PropTypes.string,
      convey_inner_qty: PropTypes.number,
      inbound_convey: PropTypes.string,
    })),
  }
  msg = formatMsg(this.props.intl)
  handleInnerChange = (ev) => {
    const packQty = parseFloat(ev.target.value);
    if (!Number.isNaN(packQty)) {
      this.props.setSkuForm({
        inner_pack_qty: packQty,
        convey_inner_qty: this.props.skuForm.sku_pack_qty &&
        Number((packQty * this.props.skuForm.sku_pack_qty).toFixed(3)),
      });
    } else {
      this.props.setSkuForm({
        inner_pack_qty: null,
        convey_inner_qty: null,
      });
    }
  }
  handleBoxChange = (ev) => {
    const packQty = parseFloat(ev.target.value);
    if (!Number.isNaN(packQty)) {
      this.props.setSkuForm({
        box_pack_qty: packQty,
        convey_box_qty: this.props.skuForm.sku_pack_qty &&
        Number((packQty * this.props.skuForm.sku_pack_qty).toFixed(3)),
      });
    } else {
      this.props.setSkuForm({
        box_pack_qty: null,
        convey_box_qty: null,
      });
    }
  }

  handlePalleteChange = (ev) => {
    const boxQty = parseFloat(ev.target.value);
    if (!Number.isNaN(boxQty)) {
      const palletPackQty = this.props.skuForm.box_pack_qty &&
      Number((boxQty * this.props.skuForm.box_pack_qty).toFixed(3));
      this.props.setSkuForm({
        pallet_box_qty: boxQty,
        pallet_pack_qty: palletPackQty,
        convey_pallet_qty: this.props.skuForm.sku_pack_qty &&
        Number((palletPackQty * this.props.skuForm.sku_pack_qty).toFixed(3)),
      });
    } else {
      this.props.setSkuForm({
        pallet_box_qty: null,
        pallet_pack_qty: null,
        convey_pallet_qty: null,
      });
    }
  }
  handlePackingSelect = (value) => {
    const { packings } = this.props;
    const packing = packings.find(item => item.code === value);
    this.props.setSkuForm(packing);
  }
  handleTraceCheck = (ev) => {
    this.props.form.setFieldsValue({ trace_convey: ev.target.checked ? 'PCS' : null });
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, packings, skuForm } = this.props;
    return (
      <div>
        <Card title="??????????????????">
          <FormItem label={this.msg('packingCode')}>
            <Select
              showSearch
              placeholder="??????????????????"
              value={skuForm.code}
              onSelect={this.handlePackingSelect}
            >
              {packings.map(pack => <Option value={pack.code}>{pack.code} | {pack.desc}</Option>)}
            </Select>
          </FormItem>
          <FormItem label={(
            <span>
              {this.msg('innerPackQty')}&nbsp;
              <Tooltip title="????????????????????????SKU?????????????????????????????????">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                )}
          >
            <InputGroup compact>
              <Input
                style={{ width: '50%' }}
                placeholder="SKU??????"
                value={skuForm.inner_pack_qty}
                onChange={this.handleInnerChange}
              />
              <Input style={{ width: '50%' }} placeholder="??????????????????" value={skuForm.convey_inner_qty} disabled />
            </InputGroup>
          </FormItem>
          <FormItem label={(
            <span>
              {this.msg('boxPackQty')}&nbsp;
              <Tooltip title="???????????????SKU?????????????????????????????????">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                )}
          >
            <InputGroup compact>
              <Input
                style={{ width: '50%' }}
                placeholder="SKU??????"
                value={skuForm.box_pack_qty}
                onChange={this.handleBoxChange}
              />
              <Input style={{ width: '50%' }} placeholder="??????????????????" value={skuForm.convey_box_qty} disabled />
            </InputGroup>
          </FormItem>
          <FormItem label={(
            <span>
              {this.msg('palletBoxQty')}&nbsp;
              <Tooltip title="??????????????????????????????SKU?????????????????????????????????">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                )}
          >
            <InputGroup compact>
              <Input
                style={{ width: '34%' }}
                placeholder="??????"
                value={skuForm.pallet_box_qty}
                onChange={this.handlePalleteChange}
              />
              <Input style={{ width: '33%' }} placeholder="SKU??????" value={skuForm.pallet_pack_qty} disabled />
              <Input style={{ width: '33%' }} placeholder="??????????????????" value={skuForm.convey_pallet_qty} disabled />
            </InputGroup>
          </FormItem>
          <FormItem label={<Checkbox checked={getFieldValue('trace_convey')} onChange={this.handleTraceCheck}>{this.msg('traceConvey')}</Checkbox>}>
            {getFieldDecorator('trace_convey', {
              initialValue: skuForm.trace_convey,
            })(<RadioGroup disabled={!getFieldValue('trace_convey')}>
              <RadioButton value="PCS">??????</RadioButton>
              <RadioButton value="INP">?????????</RadioButton>
              <RadioButton value="BOX">???</RadioButton>
              <RadioButton value="PLT">??????</RadioButton>
            </RadioGroup>)}
          </FormItem>
          <FormItem label={this.msg('defaultInboundConvey')} required>
            {getFieldDecorator('inbound_convey', {
              initialValue: skuForm.inbound_convey,
            })(<RadioGroup >
              <RadioButton value="PCS">??????</RadioButton>
              <RadioButton value="INP">?????????</RadioButton>
              <RadioButton value="BOX">???</RadioButton>
              <RadioButton value="PLT">??????</RadioButton>
            </RadioGroup>)}
          </FormItem>
          <FormItem label={this.msg('defaultReplenishConvey')}>
            {getFieldDecorator('replenish_convey', {
              initialValue: skuForm.replenish_convey,
            })(<RadioGroup >
              <RadioButton value="BOX">???</RadioButton>
              <RadioButton value="PLT">??????</RadioButton>
            </RadioGroup>)}
          </FormItem>

          <FormItem label={this.msg('defaultOutboundConvey')} required>
            {getFieldDecorator('outbound_convey', {
              initialValue: skuForm.outbound_convey,
            })(<RadioGroup >
              <RadioButton value="PCS">??????</RadioButton>
              <RadioButton value="INP">?????????</RadioButton>
              <RadioButton value="BOX">???</RadioButton>
              <RadioButton value="PLT">??????</RadioButton>
            </RadioGroup>)}
          </FormItem>
          <FormItem label={this.msg('defaultAsnTagUnit')}>
            {getFieldDecorator('asn_tag_unit', {
              initialValue: skuForm.asn_tag_unit,
            })(<RadioGroup >
              <RadioButton value="primary">????????????</RadioButton>
              <RadioButton value="sku">SKU????????????</RadioButton>
            </RadioGroup>)}
          </FormItem>
          <FormItem label={this.msg('defaultSoTagUnit')}>
            {getFieldDecorator('so_tag_unit', {
              initialValue: skuForm.so_tag_unit,
            })(<RadioGroup >
              <RadioButton value="primary">????????????</RadioButton>
              <RadioButton value="sku">SKU????????????</RadioButton>
            </RadioGroup>)}
          </FormItem>
        </Card>
      </div>
    );
  }
}
