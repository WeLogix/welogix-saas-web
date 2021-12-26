
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Modal, Form, Row, Col, Input, Select, message, Radio, Upload, Button, Icon, Switch, DatePicker } from 'antd';
import { loadDocuMarks, saveDocuMark, updateDocuMark, toggleCmsPermitModal } from 'common/reducers/cmsManifest';
import { loadPartners } from 'common/reducers/partner';
import { addPermit } from 'common/reducers/cmsPermit';
import { LogixIcon } from 'client/components/FontIcon';
import { PARTNER_ROLES, PARTNER_BUSINESSE_TYPES, CIQ_GOODS_LIMITS_TYPE, ARCHIVE_TYPE } from 'common/constants';
import { formatMsg } from '../../permit/message.i18n';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const { Option } = Select;

@injectIntl
@connect(state => ({
  cmsPermitModal: state.cmsManifest.cmsPermitModal,
  clients: state.partner.partners,
  head: state.cmsManifest.entryHead,
}), {
  saveDocuMark,
  toggleCmsPermitModal,
  updateDocuMark,
  loadPartners,
  loadDocuMarks,
  addPermit,
})

@Form.create()
export default class AddAttDocPermitModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    cmsPermitModal: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
    }).isRequired,
  }
  state = {
    permit_file: this.props.cmsPermitModal.permitRecord.permit_file,
  }
  componentDidMount() {
    this.props.loadPartners({
      role: PARTNER_ROLES.CUS,
      businessTypes: PARTNER_BUSINESSE_TYPES.clearance,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cmsPermitModal.permitRecord !== this.props.cmsPermitModal.permitRecord) {
      this.setState({ permit_file: nextProps.cmsPermitModal.permitRecord.permit_file });
    }
  }
  msg = formatMsg(this.props.intl)
  handleUsageChange = (checked) => {
    if (!checked) {
      this.props.form.setFieldsValue({
        max_usage: null,
        ava_usage: null,
      });
    }
  }
  handleExpiryChange = (checked) => {
    if (!checked) {
      this.props.form.setFieldsValue({
        start_date: null,
        stop_date: null,
      });
    }
  }
  handleAvaUsageChange = (e) => {
    const maxUsage = this.props.form.getFieldValue('max_usage');
    if (!maxUsage) {
      message.info('请先填写总次数');
      return false;
    }
    if (Number(e.target.value) > Number(maxUsage)) {
      message.info('剩余次数不能大于总次数');
      return false;
    }
    return true;
  }
  handleAva = (e) => {
    new Promise((resolve) => {
      if (!this.handleAvaUsageChange(e)) {
        resolve(false);
      }
    }).then((result) => {
      if (!result) {
        this.props.form.setFieldsValue({
          ava_usage: null,
        });
      }
    });
  }
  handleCancel = () => {
    this.props.loadDocuMarks(this.props.head.pre_entry_seq_no);
    this.props.toggleCmsPermitModal(false);
    this.props.form.resetFields();
  }
  handleOk = () => {
    const { form, head } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const newPermit = {
          ...values,
          permit_file: this.state.permit_file,
          pre_entry_seq_no: head.pre_entry_seq_no || '',
          entry_id: head.entry_id || '',
          delg_no: head.delg_no,
        };
        if ((values.usage_control && (!values.max_usage || !values.ava_usage)) ||
          (values.expiry_control && (!values.start_date || !values.stop_date))) {
          message.info('证书信息未填写完整，请在资质证书库中补充完整');
        }
        const opContent = `将随附单证${values.permit_no}回写至证件库`;
        this.props.addPermit(newPermit, opContent).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.handleCancel();
          }
        });
      }
    });
  }
  render() {
    const {
      cmsPermitModal: { visible, permitRecord, uploadedFn }, clients,
      form: { getFieldDecorator, getFieldValue },
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formData = {
      docType: ARCHIVE_TYPE[3].value,
      ownerPartnerId: this.props.head.owner_cuspartner_id,
      ownerTenantId: this.props.head.owner_custenant_id,
    };
    const props = {
      action: `${API_ROOTS.default}v1/saas/biz/attachment/attfileupload`,
      data: { data: JSON.stringify(formData) },
      multiple: false,
      showUploadList: false,
      withCredentials: true,
      onChange: (info) => {
        if (info.file.response && info.file.response.status === 200) {
          message.success(this.msg('updateSuccess'));
          const { cdnUrl, attachId } = info.file.response.data;
          this.setState({ permit_file: cdnUrl });
          uploadedFn(cdnUrl, attachId);
        }
      },
    };

    return (
      <Modal width={960} title={this.msg('addPermit')} visible={visible} maskClosable={false} onCancel={this.handleCancel} onOk={this.handleOk}>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('permitCategory')}>
                {getFieldDecorator('permit_category', {
                    initialValue: permitRecord.permit_category,
                    })(<RadioButton value="ciq" style={{ padding: '0 2px' }} disabled><LogixIcon type="icon-ciq" />
                      {this.msg('ciqPermit')}
                    </RadioButton>)}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem {...formItemLayout2} label={this.msg('permitOwner')}>
                {getFieldDecorator('owner_partner_id', {
                  initialValue: permitRecord.owner_partner_id,
                })(<Select
                  style={{ width: '100%' }}
                  placeholder={this.msg('relPartner')}
                  disabled
                >
                  {clients.map(data => (<Option key={data.id} value={data.id}>
                    {[data.partner_code, data.name].filter(f => f).join('|')}
                  </Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('permitFile')}>
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> {this.msg('update')}
                  </Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('permitType')}>
                {getFieldDecorator('permit_code', {
                  initialValue: permitRecord.permit_code,
                  })(<Select
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                  >
                    {CIQ_GOODS_LIMITS_TYPE.map(type => (<Option value={type.value} key={type.value}>
                      {`${type.value} | ${type.text}`}
                    </Option>))}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('permitNo')}>
                {getFieldDecorator('permit_no', {
                  initialValue: permitRecord.permit_no,
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('usageControl')}>
                {getFieldDecorator('usage_control', {
                  valuePropName: 'checked',
                  initialValue: !!permitRecord.usage_control,
                })(<Switch onChange={this.handleUsageChange} checkedChildren={this.msg('turnOn')} unCheckedChildren={this.msg('close')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('maxUsage')}>
                {getFieldDecorator('max_usage', {
                  initialValue: permitRecord.max_usage,
                  })(<Input disabled={!getFieldValue('usage_control')} type="number" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('availUsage')}>
                {getFieldDecorator('ava_usage', {
                  initialValue: permitRecord.ava_usage,
                  })(<Input disabled={!getFieldValue('usage_control')} onChange={this.handleAva} type="number" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('expiryControl')}>
                {getFieldDecorator('expiry_control', {
                  valuePropName: 'checked',
                  initialValue: !!permitRecord.expiry_control,
                  })(<Switch onChange={this.handleExpiryChange} checkedChildren={this.msg('turnOn')} unCheckedChildren={this.msg('close')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('startDate')}>
                {getFieldDecorator('start_date', {
                  initialValue: permitRecord.start_date ? moment(permitRecord.start_date) : null,
                  })(<DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} disabled={!getFieldValue('expiry_control')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('stopDate')}>
                {getFieldDecorator('stop_date', {
                  initialValue: permitRecord.stop_date ? moment(permitRecord.stop_date) : null,
                  })(<DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} disabled={!getFieldValue('expiry_control')} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
