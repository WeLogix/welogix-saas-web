import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, message, Input, Modal } from 'antd';
import { updateZone, loadZones, hideZoneModal } from 'common/reducers/cwmWhseLocation';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const fieldLabelMap = {};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function createFieldLabelMap(msg) {
  fieldLabelMap.zone_code = msg('zoneCode');
  fieldLabelMap.zone_name = msg('zoneName');
}

@injectIntl
@connect(
  state => ({
    visible: state.cwmWhseLocation.zoneModal.visible,
  }),
  {
    updateZone, loadZones, hideZoneModal,
  }
)
@Form.create()
export default class ZoneEditModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    zone: PropTypes.shape({ zone_code: PropTypes.string }).isRequired,
  }
  componentDidMount() {
    createFieldLabelMap(this.msg);
  }
  msg = formatMsg(this.props.intl)
  editZone = (e) => {
    e.preventDefault();
    const { zone, whseCode } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { zone_code: zoneCode, zone_name: zoneName } = values;
        const contentLog = [];
        ['zone_code', 'zone_name'].forEach((field) => {
          if (zone[field] !== values[field] &&
          !(!zone[field] && !values[field])) {
            contentLog.push(`"${fieldLabelMap[field]}"由 [${zone[field] || ''}] 改为 [${values[field] || ''}]`);
          }
        });
        this.props.updateZone(whseCode, zoneCode, zone.id, zoneName, contentLog.length > 0 ? `编辑库区[${zone.zone_code}], ${contentLog.join(';')}` : '').then((result) => {
          if (!result.error) {
            message.info('保存成功');
            this.handleCancel();
          }
        });
      }
    });
  }

  handleCancel = () => {
    this.props.hideZoneModal();
    this.props.form.resetFields();
  }
  render() {
    const { form: { getFieldDecorator }, zone } = this.props;

    return (
      <Modal maskClosable={false} visible={this.props.visible} title="编辑库区" onCancel={this.handleCancel} onOk={this.editZone}>
        <Form>
          <FormItem label={fieldLabelMap.zone_code} {...formItemLayout}>
            {
              getFieldDecorator('zone_code', {
                rules: [{ required: true, message: 'please input zoneCode' }],
                initialValue: zone.zone_code,
              })(<Input placeholder="库区编号" />)
            }
          </FormItem>
          <FormItem label={fieldLabelMap.zone_name} {...formItemLayout}>
            {
              getFieldDecorator('zone_name', {
                rules: [{ required: true, message: 'please input zoneName' }],
                initialValue: zone.zone_name,
              })(<Input placeholder="库区描述" />)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
