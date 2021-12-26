import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Input, Form, Select } from 'antd';
import { loadReceivers, addReceiver, toggleReceiverModal, updateReceiver } from 'common/reducers/cwmWarehouse';
import Cascader from 'client/components/RegionCascader';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.name = msg('name');
  fieldLabelMap.code = msg('code');
  fieldLabelMap.customs_code = msg('customs');
  fieldLabelMap.ftz_whse_code = msg('ftzWhseCodeCustomCode');
  fieldLabelMap.owner_partner_id = msg('relatedOwner');
  fieldLabelMap.region = msg('region');
  fieldLabelMap.address = msg('address');
  fieldLabelMap.post_code = msg('postCode');
  fieldLabelMap.contact = msg('contact');
  fieldLabelMap.phone = msg('phone');
  fieldLabelMap.number = msg('number');
}

@injectIntl
@connect(
  state => ({
    visible: state.cwmWarehouse.receiverModal.visible,
    receiver: state.cwmWarehouse.receiverModal.receiver,
    loginId: state.account.loginId,
  }),
  {
    loadReceivers, addReceiver, toggleReceiverModal, updateReceiver,
  }
)
@Form.create()
export default class WhseReceiversModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    whseTenantId: PropTypes.number.isRequired,
    whseOwners: PropTypes.arrayOf({ owner_partner_id: PropTypes.number }),
  }
  state = {
    region: {
      province: '',
      city: '',
      district: '',
      street: '',
      region_code: null,
    },
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      if (nextProps.receiver.id) {
        const {
          receiver: {
            province,
            city,
            district,
            street,
            region_code: regionCode,
          },
        } = nextProps;
        this.setState({
          region: {
            province,
            city,
            district,
            street,
            region_code: regionCode,
          },
        });
        this.props.form.setFieldsValue(nextProps.receiver);
      } else {
        this.setState({
          region: {
            province: '',
            city: '',
            district: '',
            street: '',
            region_code: null,
          },
        });
        this.props.form.setFieldsValue({});
      }
    }
  }

  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleReceiverModal(false);
  }
  handleOk = () => {
    const {
      form, whseCode, whseOwners, whseTenantId, receiver,
    } = this.props;
    const { region } = this.state;
    let ownerTenantId = null;
    const recv = form.getFieldsValue();
    const owner = whseOwners.find(item => item.owner_partner_id === receiver.owner_partner_id);
    if (owner) {
      ownerTenantId = owner.owner_tenant_id;
    }
    const data = Object.assign({}, recv, {
      ...region,
      whse_code: whseCode,
      owner_tenant_id: ownerTenantId,
    });
    if (receiver.id) {
      const fields = Object.keys(recv);
      const contentLog = [];
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (receiver[field] !== recv[field] &&
          !(!receiver[field] && !recv[field])) {
          if (field === 'owner_partner_id') {
            const value = whseOwners.find(item => item.owner_partner_id === recv[field]) &&
              whseOwners.find(item => item.owner_partner_id === recv[field]).owner_name;
            const oldValue =
              whseOwners.find(item => item.owner_partner_id === receiver[field]) &&
              whseOwners.find(item => item.owner_partner_id === receiver[field]).owner_name;
            contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
          } else {
            contentLog.push(`"${fieldLabelMap[field]}"由 [${receiver[field] || ''}] 改为 [${recv[field] || ''}]`);
          }
        }
      }
      if (region.province !== receiver.province || region.city !== receiver.city
        || region.district !== receiver.district || region.street !== receiver.street) {
        contentLog.push(`"${fieldLabelMap.region}"由 [${receiver.province || ''}${receiver.city || ''}${receiver.district || ''}${receiver.street || ''}]
        改为 [${region.province || ''}${region.city || ''}${region.district || ''}${region.street || ''}]`);
      }
      this.props.updateReceiver({ changedReceiver: data, receiverId: receiver.id }, contentLog.length > 0 ? `修改收货人[${receiver.code}]信息, ${contentLog.join(';')}` : '').then(() => {
        this.props.loadReceivers(whseCode, whseTenantId);
        this.props.toggleReceiverModal(false);
      });
    } else {
      this.props.addReceiver(data).then(() => {
        this.props.loadReceivers(whseCode, whseTenantId);
        this.props.toggleReceiverModal(false);
      });
    }
  }
  handleRegionChange = (value) => {
    const [code, province, city, district, street] = value;
    const region = {
      region_code: code, province, city, district, street,
    };
    this.setState({ region });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, whseOwners, receiver,
    } = this.props;
    const { region } = this.state;
    const regionValues = [region.province, region.city, region.district, region.street];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal maskClosable={false} title={`${receiver && receiver.id ? '编辑' : '添加'}收货人`} visible={visible} onCancel={this.handleCancel} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={fieldLabelMap.code} required {...formItemLayout}>
            {getFieldDecorator('code')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.name} required {...formItemLayout}>
            {getFieldDecorator('name')(<Input required />)}
          </FormItem>
          <FormItem label={fieldLabelMap.customs_code} {...formItemLayout}>
            {getFieldDecorator('customs_code')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.ftz_whse_code} {...formItemLayout}>
            {getFieldDecorator('ftz_whse_code')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.owner_partner_id} required {...formItemLayout}>
            {getFieldDecorator('owner_partner_id')(<Select
              id="select"
              showSearch
              placeholder=""
              optionFilterProp="children"
              notFoundContent=""
            >
              {
                  whseOwners.map(pt => (
                    <Option
                      searched={`${pt.owner_code}${pt.owner_name}`}
                      value={pt.owner_partner_id}
                      key={pt.owner_partner_id}
                    >
                      {pt.owner_code ? `${pt.owner_code} | ${pt.owner_name}` : pt.owner_name}
                    </Option>))
                }
            </Select>)}
          </FormItem>

          <FormItem label={fieldLabelMap.region} required {...formItemLayout}>
            <Cascader defaultRegion={regionValues} onChange={this.handleRegionChange} />
          </FormItem>
          <FormItem label={fieldLabelMap.address} {...formItemLayout}>
            {getFieldDecorator('address')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.post_code} {...formItemLayout}>
            {getFieldDecorator('post_code')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.contact} {...formItemLayout} >
            {getFieldDecorator('contact')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.phone} {...formItemLayout} >
            {getFieldDecorator('phone')(<Input />)}
          </FormItem>
          <FormItem label={fieldLabelMap.number} {...formItemLayout} >
            {getFieldDecorator('number')(<Input />)}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
