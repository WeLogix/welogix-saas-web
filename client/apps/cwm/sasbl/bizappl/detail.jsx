import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Layout, message, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { loadBizApplHead, notifyFormChanged, updatebizApplHead, showSendSwJG2File } from 'common/reducers/cwmSasblReg';
import LogsPane from 'client/components/Dock/common/logsPane';
import { SCOF_BIZ_OBJECT_KEY, BAPPL_DECTYPE, BAPPL_BIZTYPE, SW_JG2_SENDTYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import SasblApplDetailPane from './tabpane/sasblApplDetailPane';
import BizApplHeadPane from './tabpane/bizApplHeadPane';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.cop_bappl_no = msg('copNo');
  fieldLabelMap.bappl_dectype = msg('bapplDectype');
  fieldLabelMap.blbook_no = msg('blbookNo');
  fieldLabelMap.areaout_owner_name = msg('outAreaOwner');
  fieldLabelMap.areaout_blbook_no = msg('outAreaBlBookNo');
  fieldLabelMap.deposit_levy_no = msg('cashDepositNo');
  fieldLabelMap.declarer_name = msg('declarer');
  fieldLabelMap.bappl_biztype = msg('stockBiztype');
  fieldLabelMap.bappl_ioflag = msg('ioflag');
  fieldLabelMap.exhibition_place = msg('exhibitionPlace');
  fieldLabelMap.bappl_valid_date = msg('bapplValidDate');
  fieldLabelMap.bappl_remark = msg('remark');
}

@injectIntl
@connect(state => ({
  whseCode: state.cwmContext.defaultWhse.code,
  formChanged: state.cwmBlBook.formChanged,
  bizApplHeadData: state.cwmSasblReg.bizApplHeadData,
}), {
  loadBizApplHead, notifyFormChanged, updatebizApplHead, showSendSwJG2File,
})
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
  jumpOut: true,
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class BizApplDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    }),
    formChanged: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedKey: 'bizApplHead',
  }
  componentDidMount() {
    this.handleLoadHead();
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    const { params, whseCode } = nextProps;
    if (whseCode !== this.props.whseCode) {
      this.props.loadBizApplHead(params.copBizApplNo, whseCode);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.notifyFormChanged(false);
    const { ieType, supType } = this.props.params;
    this.context.router.push(`/cwm/sasbl/bizappl/${supType}/${ieType}`);
  }
  handleLoadHead = () => {
    const { params, whseCode } = this.props;
    if (params.copBizApplNo && whseCode) {
      const { copBizApplNo } = params;
      this.props.loadBizApplHead(copBizApplNo, whseCode);
    }
  }
  handleSendMsg = () => {
    const { bizApplHeadData } = this.props;
    this.props.showSendSwJG2File({
      visible: true,
      copNo: bizApplHeadData.cop_bappl_no,
      agentCode: bizApplHeadData.declarer_scc_code,
      regType: 'bappl',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: bizApplHeadData.bappl_dectype,
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
        const { whseCode, params, bizApplHeadData } = this.props;
        const data = {
          cop_bappl_no: values.cop_bappl_no,
          bappl_dectype: values.bappl_dectype,
          bappl_no: values.bappl_no,
          blbook_no: values.blbook_no,
          areaout_owner_cus_code: values.areaout_owner_cus_code,
          areaout_owner_scc_code: values.areaout_owner_scc_code,
          areaout_owner_name: values.areaout_owner_name,
          areaout_blbook_no: values.areaout_blbook_no,
          deposit_levy_no: values.deposit_levy_no,
          declarer_cus_code: values.declarer_cus_code,
          declarer_scc_code: values.declarer_scc_code,
          declarer_name: values.declarer_name,
          typing_cus_code: values.typing_cus_code,
          typing_scc_code: values.typing_scc_code,
          typing_name: values.typing_name,
          bappl_biztype: values.bappl_biztype,
          bappl_ioflag: values.bappl_ioflag,
          exhibition_place: values.exhibition_place,
          bappl_valid_date: values.bappl_valid_date,
          bappl_remark: values.bappl_remark,
          prdgoods_mark: values.prdgoods_mark,
          master_customs: values.master_customs,
          declarer_person: values.declarer_person,
        };
        ['bappl_valid_date'].forEach((field) => {
          if (data[field]) {
            data[field] = moment(data[field]).format('YYYY-MM-DD');
          }
          if (bizApplHeadData[field]) {
            bizApplHeadData[field] = moment(bizApplHeadData[field]).format('YYYY-MM-DD');
          }
        });
        const contentLog = [];
        ['bappl_dectype', 'blbook_no', 'areaout_owner_name', 'areaout_blbook_no', 'deposit_levy_no',
          'declarer_name', 'bappl_biztype', 'bappl_ioflag', 'exhibition_place', 'bappl_valid_date', 'bappl_remark'].forEach((field) => {
          if (bizApplHeadData[field] !== data[field] &&
            !(!bizApplHeadData[field] && !data[field])) {
            if (field === 'bappl_dectype') {
              const value = BAPPL_DECTYPE.find(type => type.value === data[field]) &&
                BAPPL_DECTYPE.find(type => type.value === data[field]).text;
              const oldValue = BAPPL_DECTYPE.find(type => type.value === bizApplHeadData[field]) &&
                BAPPL_DECTYPE.find(type => type.value === bizApplHeadData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bappl_biztype') {
              const value = BAPPL_BIZTYPE.find(type => type.value === data[field]) &&
                BAPPL_BIZTYPE.find(type => type.value === data[field]).text;
              const oldValue = BAPPL_BIZTYPE.find(type => type.value === bizApplHeadData[field]) &&
                BAPPL_BIZTYPE.find(type => type.value === bizApplHeadData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bappl_ioflag') {
              const value = data[field] === 1 ? '进' : '出';
              const oldValue = bizApplHeadData[field] === 1 ? '进' : '出';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${bizApplHeadData[field] || ''}] 改为 [${data[field] || ''}]`);
            }
          }
        });
        this.props.updatebizApplHead(data, contentLog.length > 0 ? `修改业务申报表表头, ${contentLog.join(';')}` : '').then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            this.props.loadBizApplHead(params.copBizApplNo, whseCode);
            message.success(this.msg('savedSucceed'));
          }
        });
      }
    });
  }
  render() {
    const {
      formChanged, bizApplHeadData,
    } = this.props;
    const readonly = Boolean(bizApplHeadData.sent_status !== 0 ||
      bizApplHeadData.bappl_status === -1);
    const { selectedKey } = this.state;
    return (
      <Layout>
        <PageHeader title={this.msg('bizApplDetails')}>
          <PageHeader.Actions>
            {(bizApplHeadData.bappl_status === 4 && bizApplHeadData.bappl_dectype === '2') && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={this.handleSendMsg}
                  loading={bizApplHeadData.sent_status === 1}
                  disabled
                >
                  {this.msg('chgDecl')}
                </Button>
              </PrivilegeCover>
            )}
            {(bizApplHeadData.bappl_status === 4 && bizApplHeadData.bappl_dectype === '3') && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={this.handleSendMsg}
                  loading={bizApplHeadData.sent_status === 1}
                  disabled
                >
                  {this.msg('clsDecl')}
                </Button>
              </PrivilegeCover>
            )}
            {(bizApplHeadData.bappl_dectype === '1' && !readonly) && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={this.handleSendMsg}
                  loading={bizApplHeadData.sent_status === 1}
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
              <TabPane tab={this.msg('bizApplHead')} key="bizApplHead">
                <BizApplHeadPane form={this.props.form} readonly={readonly} />
              </TabPane>
              <TabPane tab={this.msg('bizApplBody')} key="bizApplBody">
                <SasblApplDetailPane
                  readonly={readonly}
                  form={this.props.form}
                  copSasblNo={this.props.params.copBizApplNo}
                  blType="bizAppl"
                />
              </TabPane>
              <TabPane tab={this.msg('logs')} key="logs">
                <LogsPane
                  billNo={this.props.params.copBizApplNo}
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
