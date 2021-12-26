import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Layout, message, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { loadPassHead, notifyFormChanged, updatePasstHead, showSendSwJG2File } from 'common/reducers/cwmSasblReg';
import { PASSPORT_BIZTYPE, CMS_CNTNR_SPEC_CUS, SCOF_BIZ_OBJECT_KEY, SW_JG2_SENDTYPE } from 'common/constants';
import LogsPane from 'client/components/Dock/common/logsPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SasblBodyDetailPane from '../common/sasblBodyDetailPane';
import PassportHeadPane from './tabpane/passportHeadPane';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.pass_biztype = msg('passportBiztype');
  fieldLabelMap.pass_ioflag = msg('ioflag');
  fieldLabelMap.pass_bindtype = msg('bindType');
  fieldLabelMap.pass_rlt_regno = msg('rltRegNo');
  fieldLabelMap.owner_name = msg('areaOwner');
  fieldLabelMap.blbook_no = msg('blbookNo');
  fieldLabelMap.master_customs = msg('masterCustoms');
  fieldLabelMap.pp_vehicle_no = msg('carNo');
  fieldLabelMap.pp_vehicle_wt = msg('carWeight');
  fieldLabelMap.pp_vehicle_frameno = msg('carFrameNo');
  fieldLabelMap.pp_vehicle_framewt = msg('carFrameWeight');
  fieldLabelMap.pp_container_no = msg('containerNo');
  fieldLabelMap.pp_container_model = msg('containerType');
  fieldLabelMap.pp_container_wt = msg('containerWeight');
  fieldLabelMap.pp_remark = msg('remark');
}

@injectIntl
@connect(state => ({
  whseCode: state.cwmContext.defaultWhse.code,
  brokers: state.cwmContext.whseAttrs.brokers,
  formChanged: state.cwmBlBook.formChanged,
  passHeadData: state.cwmSasblReg.passHeadData,
  partners: state.partner.partners,
  formParams: state.saasParams.latest,
}), {
  loadPassHead, notifyFormChanged, updatePasstHead, showSendSwJG2File,
})
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
  jumpOut: true,
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class PassportDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.func.isRequired,
    formChanged: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedKey: 'passtHead',
  }
  componentDidMount() {
    this.handleLoadHead();
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    const { params, whseCode } = nextProps;
    const copPassNo = this.props.passHeadData && this.props.passHeadData.cop_pass_no;
    if (copPassNo !== params.copPassNo || whseCode !== this.props.whseCode) {
      this.props.loadPassHead(params.copPassNo, whseCode);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.notifyFormChanged(false);
    this.context.router.goBack();
  }
  handleLoadHead = () => {
    const { params, whseCode } = this.props;
    if (params.copPassNo && whseCode) {
      const { copPassNo } = params;
      this.props.loadPassHead(copPassNo, whseCode);
    }
  }
  handleSendMsg = (decType) => {
    const { passHeadData } = this.props;
    this.props.showSendSwJG2File({
      visible: true,
      copNo: passHeadData.cop_pass_no,
      agentCode: passHeadData.declarer_scc_code,
      regType: 'pass',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: decType || passHeadData.pass_dectype,
    });
  }
  handleMenuItemClick = (key) => {
    this.setState({ selectedKey: key });
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        message.error('数据校验失败');
      } else {
        const { partners, passHeadData, formParams: { customs } } = this.props;
        const partner = partners.find(ptner => ptner.customs_code === values.owner_cus_code);
        const { whseCode, params } = this.props;
        const data = {
          pre_sasbl_seqno: values.pre_sasbl_seqno,
          pass_no: values.pass_no,
          cop_pass_no: values.cop_pass_no,
          pass_biztype: values.pass_biztype,
          pass_ioflag: values.pass_ioflag,
          pass_bindtype: values.pass_bindtype,
          pass_rlt_reg: values.pass_rlt_reg,
          pass_rlt_regno: values.pass_rlt_regno,
          blbook_no: values.blbook_no,
          master_customs: values.master_customs,
          pp_vehicle_no: values.pp_vehicle_no,
          pp_vehicle_wt: values.pp_vehicle_wt,
          pp_vehicle_frameno: values.pp_vehicle_frameno,
          pp_vehicle_framewt: values.pp_vehicle_framewt,
          pp_container_no: values.pp_container_no,
          pp_container_model: values.pp_container_model,
          pp_container_wt: values.pp_container_wt,
          pp_goods_grosswt: values.pp_goods_grosswt,
          pp_goods_netwt: values.pp_goods_netwt,
          pp_total_weight: values.pp_total_weight,
          pp_decl_date: values.pp_decl_date,
          declarer_person: values.declarer_person,
          pp_remark: values.pp_remark,
          owner_scc_code: values.owner_scc_code,
          owner_cus_code: values.owner_cus_code,
          owner_name: values.owner_name,
          owner_tenant_id: partner && partner.partner_tenant_id,
          owner_partner_id: partner && partner.id,
          pp_virtual_type: values.pp_virtual_type,
        };
        const formData = { ...values };
        ['pp_goods_grosswt', 'pp_goods_netwt', 'pp_vehicle_framewt', 'pp_vehicle_wt'].forEach((field) => {
          const fieldNumVal = Number(formData[field]);
          if (!Number.isNaN(fieldNumVal)) {
            formData[field] = fieldNumVal;
          } else {
            formData[field] = '';
          }
        });
        const contentLog = [];
        ['pass_biztype', 'pass_ioflag', 'pass_bindtype', 'pass_rlt_regno', 'owner_name', 'blbook_no',
          'master_customs', 'pp_vehicle_no', 'pp_vehicle_wt', 'pp_vehicle_frameno', 'pp_vehicle_framewt',
          'pp_container_no', 'pp_container_model', 'pp_container_wt', 'pp_remark'].forEach((field) => {
          if (passHeadData[field] !== formData[field] &&
            !(!passHeadData[field] && !formData[field])) {
            if (field === 'pass_biztype') {
              const value = PASSPORT_BIZTYPE.find(type => type.value === formData[field]) &&
                PASSPORT_BIZTYPE.find(type => type.value === formData[field]).text;
              const oldValue = PASSPORT_BIZTYPE.find(type => type.value === passHeadData[field]) &&
              PASSPORT_BIZTYPE.find(type => type.value === passHeadData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'pass_ioflag') {
              const value = formData[field] === 1 ? '进' : '出';
              const oldValue = passHeadData[field] === 1 ? '进' : '出';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'pass_bindtype') {
              let value = '';
              let oldValue = '';
              if (formData[field] === 1) {
                value = this.msg('oneCarManyOrders');
              } else if (formData[field] === 2) {
                value = this.msg('oneCarOneOrders');
              } else if (formData[field] === 3) {
                value = this.msg('manyCarsOneOrders');
              }
              if (passHeadData[field] === 1) {
                oldValue = this.msg('oneCarManyOrders');
              } else if (passHeadData[field] === 2) {
                oldValue = this.msg('oneCarOneOrders');
              } else if (passHeadData[field] === 3) {
                oldValue = this.msg('manyCarsOneOrders');
              }
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'master_customs') {
              const value = customs.find(custom => custom.customs_code === formData[field]) &&
                customs.find(custom => custom.customs_code === formData[field]).customs_name;
              const oldValue =
                customs.find(custom => custom.customs_code === passHeadData[field]) &&
                customs.find(custom => custom.customs_code === passHeadData[field]).customs_name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'pp_container_model') {
              const value = CMS_CNTNR_SPEC_CUS.find(cntnr => cntnr.value === formData[field]) &&
              CMS_CNTNR_SPEC_CUS.find(cntnr => cntnr.value === formData[field]).text;
              const oldValue =
              CMS_CNTNR_SPEC_CUS.find(cntnr => cntnr.value === passHeadData[field]) &&
              CMS_CNTNR_SPEC_CUS.find(cntnr => cntnr.value === passHeadData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${passHeadData[field] || ''}] 改为 [${values[field] || ''}]`);
            }
          }
        });
        this.props.updatePasstHead(data, contentLog.length > 0 ? `修改进区核放单表头, ${contentLog.join(';')}` : '').then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            this.props.loadPassHead(params.copPassNo, whseCode);
            message.success(this.msg('savedSucceed'));
          }
        });
      }
    });
  }
  render() {
    const {
      formChanged, passHeadData,
    } = this.props;
    const readonly = Boolean(passHeadData.sent_status !== 0 || passHeadData.pass_status === -1);
    const { selectedKey } = this.state;
    return (
      <Layout>
        <PageHeader title={this.msg('passportDetails')}>
          <PageHeader.Actions>
            {(passHeadData.pass_status === 4 && passHeadData.pass_dectype !== '3') &&
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              <Button
                type="primary"
                icon="mail"
                onClick={() => this.handleSendMsg('3')}
                loading={passHeadData.sent_status === 1}
              >
                {this.msg('delDecl')}
              </Button>
            </PrivilegeCover>}
            {(passHeadData.pass_dectype === '1' && !readonly) && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={() => this.handleSendMsg('1')}
                  loading={passHeadData.sent_status === 1}
                  disabled={formChanged}
                >
                  {this.msg('regDecl')}
                </Button>
              </PrivilegeCover>
            )}
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              <Button type="primary" onClick={this.handleSubmit} disabled={!formChanged}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            {formChanged ? (
              <Popconfirm title={this.msg('confirmCancel')} onConfirm={this.handleCancel}>
                <Button>{this.msg('cancel')}</Button>
              </Popconfirm>
            ) : (
              <Button onClick={this.handleCancel}>{this.msg('cancel')}</Button>
            )}
          </PageHeader.Actions>
        </PageHeader>
        <PageContent readonly={readonly}>
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={selectedKey} onChange={this.handleMenuItemClick}>
              <TabPane tab={this.msg('passportHead')} key="passtHead">
                <PassportHeadPane
                  form={this.props.form}
                  readonly={readonly}
                  reload={this.handleLoadHead}
                />
              </TabPane>
              <TabPane tab={this.msg('passportBody')} key="passBody">
                <SasblBodyDetailPane
                  readonly={readonly}
                  form={this.props.form}
                  copSasblNo={this.props.params.copPassNo}
                  blType="pass"
                  preSasblNo={passHeadData && passHeadData.pre_sasbl_seqno}
                />
              </TabPane>
              <TabPane tab={this.msg('logs')} key="logs">
                <LogsPane
                  billNo={this.props.params.copPassNo}
                  bizObject={SCOF_BIZ_OBJECT_KEY.CWM_SASBL.key}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </PageContent>
        <SendSwJG2FileModal reload={this.handleLoadHead} />
      </Layout>
    );
  }
}
