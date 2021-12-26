import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Divider, DatePicker, Form, Icon, Input, Select, Switch, Radio, Row, Upload, Col, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import FormPane from 'client/components/FormPane';
import { loadPartners } from 'common/reducers/partner';
import { updateLocalPermit } from 'common/reducers/cmsPermit';
import { CIQ_GOODS_LIMITS_TYPE, ARCHIVE_TYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';


const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { Dragger } = Upload;
const { Option } = Select;

@injectIntl
@connect(state => ({
  clients: state.partner.partners,
  certParams: state.saasParams.latest.certMark,
  currentPermit: state.cmsPermit.currentPermit,
}), {
  loadPartners, updateLocalPermit,
})
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})

export default class PermitHeadPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    updateLocalPermit: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
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
  handleView = () => {
    const file = this.props.currentPermit.permit_file;
    if (file) window.open(file);
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
  handlePermitFileUploaded = (info) => {
    if (info.file.response && info.file.response.status === 200) {
      message.success(this.msg('updateSuccess'));
      const { cdnUrl, attachId } = info.file.response.data;
      this.props.updateLocalPermit({
        permit_file: cdnUrl,
        attach_id: attachId,
      });
    }
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, action, clients,
      certParams, currentPermit, readonly,
    } = this.props;
    const colSpan = {
      span: 12,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const formItemSpan2Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const ownerPartnerId = currentPermit.owner_partner_id;
    const owner = clients.find(f => f.id === ownerPartnerId);
    const ownerTenantId = owner && owner.partner_tenant_id;
    const uploadFormData = JSON.stringify({
      docType: ARCHIVE_TYPE[3].value, // ARCHIVE_TYPE
      ownerPartnerId,
      ownerTenantId,
    });
    return (
      <FormPane descendant hideRequiredMark>
        <Row gutter={16}>
          {currentPermit.owner_partner_id &&
          <Col span={8}>
            <Card size="small" title={this.msg('permitFile')} extra={<Button icon="scan" onClick={() => message.info(this.msg('comingSoon'))}>{this.msg('ocr')}</Button>} style={{ paddingBottom: 16 }}>
              <PrivilegeCover module="clearance" feature="compliance" action="edit">
                <Dragger
                  accept=".pdf"
                  action={`${API_ROOTS.default}v1/saas/biz/attachment/attfileupload`}
                  data={{ data: uploadFormData }}
                  multiple={false}
                  showUploadList={false}
                  withCredentials
                  onChange={this.handlePermitFileUploaded}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">上传文件为PDF格式,且每页大小不超过200K</p>
                </Dragger>
              </PrivilegeCover>
              {currentPermit.permit_file &&
                <Button style={{ border: 'none' }} icon="eye-o" onClick={this.handleView}>
                  {this.msg('check')}
                </Button>}
            </Card>
          </Col>}
          <Col span={currentPermit.owner_partner_id ? 16 : 24}>
            <Card>
              <Row>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('permitNo')}>
                    {getFieldDecorator('permit_no', {
              initialValue: action === 'edit' ? currentPermit.permit_no : '',
              rules: [{ required: true, message: '证书编号必填' }],
              })(<Input disabled={readonly} />)}
                  </FormItem>
                </Col>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('permitOwner')}>
                    {getFieldDecorator('owner_partner_id', {
                    rules: [{ required: true, message: '所属企业必选' }],
                    initialValue: action === 'edit' && currentPermit.owner_partner_id,
                  })(<Select
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    placeholder={this.msg('relPartner')}
                    optionFilterProp="children"
                    disabled={action !== 'create' || readonly}
                  >
                    {clients.map(data => (<Option key={data.id} value={data.id}>
                      {[data.partner_code, data.name].filter(f => f).join('|')}
                    </Option>))}
                  </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('permitCategory')}>
                    {getFieldDecorator('permit_category', {
                    rules: [{ required: true, message: '证书标准必选' }],
                    initialValue: action === 'edit' ? currentPermit.permit_category : '',
                    })(<RadioGroup disabled={readonly}>
                      <RadioButton value="customs">{this.msg('customsPermit')}</RadioButton>
                      <RadioButton value="ciq">{this.msg('ciqPermit')}</RadioButton>
                    </RadioGroup>)}
                  </FormItem>
                </Col>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('permitType')}>
                    {getFieldDecorator('permit_code', {
                  initialValue: action === 'edit' ? currentPermit.permit_code : '',
                  })(<Select
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    disabled={readonly}
                  >
                    {getFieldValue('permit_category') === 'customs' ?
                    certParams.map(cert => (<Option value={cert.cert_code} key={cert.cert_code}>
                      {`${cert.cert_code} | ${cert.cert_spec}`}
                    </Option>)) :
                    CIQ_GOODS_LIMITS_TYPE.map(type => (<Option value={type.value} key={type.value}>
                      {`${type.value} | ${type.text}`}
                    </Option>))}
                  </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Divider dashed />
              <Row>
                <FormItem {...formItemSpan2Layout} label={this.msg('usageControl')}>
                  {getFieldDecorator('usage_control', {
                  valuePropName: 'checked',
                  initialValue: action === 'edit' ? !!currentPermit.usage_control : true,
                })(<Switch disabled={readonly} onChange={this.handleUsageChange} checkedChildren={this.msg('turnOn')} unCheckedChildren={this.msg('close')} />)}
                </FormItem>
              </Row>
              <Row>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('maxUsage')}>
                    {getFieldDecorator('max_usage', {
                  initialValue: action === 'edit' ? currentPermit.max_usage : '',
                  })(<Input disabled={!getFieldValue('usage_control') || readonly} type="number" />)}
                  </FormItem>
                </Col>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('availUsage')}>
                    {getFieldDecorator('ava_usage', {
                  initialValue: action === 'edit' ? currentPermit.ava_usage : '',
                  })(<Input disabled={!getFieldValue('usage_control') || readonly} onChange={this.handleAva} type="number" />)}
                  </FormItem>
                </Col>
              </Row>
              <Divider dashed />
              <Row>
                <FormItem {...formItemSpan2Layout} label={this.msg('expiryControl')}>
                  {getFieldDecorator('expiry_control', {
                  valuePropName: 'checked',
                  initialValue: action === 'edit' ? !!currentPermit.expiry_control : true,
                  })(<Switch disabled={readonly} onChange={this.handleExpiryChange} checkedChildren={this.msg('turnOn')} unCheckedChildren={this.msg('close')} />)}
                </FormItem>
              </Row>
              <Row>
                <Col {...colSpan}>
                  <FormItem {...formItemLayout} label={this.msg('startDate')}>
                    {getFieldDecorator('start_date', {
                  initialValue: action === 'edit' && currentPermit.start_date ? moment(currentPermit.start_date) : null,
                  })(<DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} disabled={!getFieldValue('expiry_control') || readonly} />)}
                  </FormItem>
                </Col>
                <Col {...colSpan}>
                  {/* 时分秒默认设为00:00:00,保存时+1天,显示时-1天 */}
                  <FormItem {...formItemLayout} label={this.msg('stopDate')}>
                    {getFieldDecorator('stop_date', {
                  initialValue: action === 'edit' && currentPermit.stop_date ? moment(currentPermit.stop_date).subtract(1, 'days') : null,
                  })(<DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} disabled={!getFieldValue('expiry_control') || readonly} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

      </FormPane>
    );
  }
}
