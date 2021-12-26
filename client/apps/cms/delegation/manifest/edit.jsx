import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Button, Dropdown, Layout, Menu, Icon, Form, message, notification, Switch, Tooltip, Tabs, Select, Spin, Modal } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import {
  saveBillHead, lockManifest, openMergeSplitModal, resetBill,
  saveBillRules, setStepVisible, billHeadChange, redoManifest, loadTemplateFormVals,
  showSendDeclsModal, validateBillDatas, loadBillMeta, resetBillHead, loadManifestHead,
  loadManifestTemplates, saveBillHeadLocal, loadBillOrDeclStat, toggleReviewDeclsModal,
} from 'common/reducers/cmsManifest';
import { paasCollabTaskParam } from 'common/reducers/notification';
import { paasBizRiskAlarmParam } from 'common/reducers/saasInfra';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { loadInvTemplates } from 'common/reducers/cmsInvoice';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import { CMS_DECL_STATUS, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import { createDelgHeadChangeLog } from '../../common/manifestChangeLog';
import ManifestHeadPane from './tabpane/manifestHeadPane';
import ManifestBodyPane from './tabpane/manifestBodyPane';
import ContainersPane from './tabpane/manifestContainersPane';
import GenerateDeclModal from './modals/generateDeclModal';
import SaveAsTemplateModal from './modals/saveAsTemplateModal';
import SendDeclsModal from './modals/sendDeclsModal';
import DeclTreePopover from '../../common/popover/declTreePopover';
import ReviewDeclsModal from '../../common/modal/reviewDeclsModal';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
const { Option } = Select;
const { OptGroup } = Select;

@injectIntl
@connect(
  state => ({
    billMeta: state.cmsManifest.billMeta,
    billHead: state.cmsManifest.billHead,
    billDeclStat: state.cmsManifest.billDeclStat,
    templates: state.cmsManifest.templates,
    loginId: state.account.loginId,
    loginName: state.account.username,
    templateValLoading: state.cmsManifest.templateValLoading,
    billHeadFieldsChangeTimes: state.cmsManifest.billHeadFieldsChangeTimes,
    manifestSpinning: state.cmsManifest.manifestLoading,
    cdfGenerating: state.cmsManifest.cdfGenerating,
    billRule: state.cmsManifest.billRule,
    formParams: state.saasParams.latest,
    privileges: state.account.privileges,
  }),
  {
    loadManifestHead,
    loadBillOrDeclStat,
    loadManifestTemplates,
    saveBillHead,
    openMergeSplitModal,
    resetBill,
    loadTemplateFormVals,
    saveBillRules,
    setStepVisible,
    billHeadChange,
    lockManifest,
    redoManifest,
    showSendDeclsModal,
    validateBillDatas,
    loadBillMeta,
    showPreviewer,
    loadInvTemplates,
    resetBillHead,
    saveBillHeadLocal,
    toggleReviewDeclsModal,
    getBlBookNosByType,
    paasCollabTaskParam,
    paasBizRiskAlarmParam,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
  title: 'featCdmDelegation',
  jumpOut: true,
})
@Form.create({ onValuesChange: (props, values) => props.billHeadChange(values) })
export default class ManifestEdit extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loginId: PropTypes.number.isRequired,
    billMeta: PropTypes.shape({
      entries: PropTypes.arrayOf(PropTypes.shape({ pre_entry_seq_no: PropTypes.string })),
      manifestPermit: PropTypes.bool,
    }),
    templates: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })).isRequired,
    templateValLoading: PropTypes.bool.isRequired,
    manifestSpinning: PropTypes.bool.isRequired,
    billHeadFieldsChangeTimes: PropTypes.number.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    templateRuleId: null,
    locked: false,
    lockedByOthers: false,
  }
  componentDidMount() {
    this.props.loadManifestHead(this.props.params.billno);
    this.props.loadBillOrDeclStat(this.props.params.billno);
    this.setState({
      templateRuleId: this.props.billHead.template_id,
      locked: this.props.billHead.locking_login_id,
      lockedByOthers: this.props.billHead.locking_login_id !== this.props.loginId,
    });
    this.props.getBlBookNosByType();
    this.props.paasCollabTaskParam({
      bizNo: this.props.params.billno,
      bizObject: [
        SCOF_BIZ_OBJECT_KEY.CMS_DELEGATION.key,
        SCOF_BIZ_OBJECT_KEY.CMS_MANIFEST.key,
      ],
    });
    this.props.paasBizRiskAlarmParam({
      bizNo: this.props.params.billno,
      bizObject: SCOF_BIZ_OBJECT_KEY.CMS_MANIFEST.key,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billHead !== this.props.billHead) {
      this.setState({
        templateRuleId: nextProps.billHead.template_id,
        locked: nextProps.billHead.locking_login_id,
        lockedByOthers: nextProps.billHead.locking_login_id !== nextProps.loginId,
      });
    }
    const nextHead = nextProps.billHead;
    const thisHead = this.props.billHead;
    if (nextHead.owner_cuspartner_id !== thisHead.owner_cuspartner_id
      || nextHead.i_e_type !== thisHead.i_e_type) {
      this.props.loadManifestTemplates(nextHead.owner_cuspartner_id, nextHead.i_e_type);
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'delegation', action: 'edit',
  });
  handleGenerateEntry = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        if (errors.oversea_entity_name) {
          message.error('请填写境外发货人名称');
        } else {
          message.error('清单表头尚未填写完整', 3);
        }
      } else {
        this.generateEntry();
      }
    });
  }
  generateEntry = () => {
    const { billHead, billMeta } = this.props;
    this.props.validateBillDatas({
      billSeqNo: billHead.bill_seq_no,
    }).then((result) => {
      if (result.error) {
        if (result.error.message.key === 'body-error') {
          const incompGnos = result.error.message.incompleteGnos;
          const uqGnos = result.error.message.unitqtyGnos;
          const { containerNoExist } = result.error.message;
          if (incompGnos.length > 0) {
            const msg = `序号为 ${incompGnos.join(',')} 的表体数据申报品名单位数量或国别或单价币制为空`;
            notification.error({
              message: '表体数据不完整',
              duration: 0,
              description: msg,
              placement: 'bottomRight',
            });
          }
          if (uqGnos.length > 0) {
            const msg = `序号为 ${uqGnos.join(',')} 的法一法二以及申报单位类型一致,数量不一致`;
            notification.error({
              message: '表体单位数量错误',
              duration: 0,
              description: msg,
              placement: 'bottomRight',
            });
          }
          if (containerNoExist) {
            notification.error({
              message: '清单关联集装箱信息缺失',
              duration: 0,
              placement: 'bottomRight',
            });
          }
        } else {
          message.error(result.error.message, 10);
        }
      } else {
        this.props.loadInvTemplates({
          docuType: [0, 1, 2],
          partnerId: billMeta.customerId,
        });
        this.props.openMergeSplitModal();
      }
    });
  }
  validateCode = (code) => {
    let info = null;
    if (!code) {
      info = '请填写社会信用代码, 无此代码请填:NO';
    } else if (code !== 'NO' && code.length !== 18) {
      info = `社会信用代码填写NO或者必须为18位, 当前${code.length}位`;
    }
    return info;
  }
  handleSaveManifest = () => {
    const { billHead, formParams } = this.props;
    const { templateRuleId } = this.state;
    const ietype = billHead.i_e_type === 0 ? 'import' : 'export';
    const formValues = this.props.form.getFieldsValue();
    const tradeInfo = this.validateCode(formValues.trade_co);
    if (tradeInfo) {
      message.error(tradeInfo);
      return;
    }
    const ownInfo = this.validateCode(formValues.owner_code);
    if (ownInfo) {
      message.error(ownInfo);
      return;
    }
    const agentInfo = this.validateCode(formValues.agent_code);
    if (agentInfo) {
      message.error(agentInfo);
      return;
    }
    if (!formValues.oversea_entity_name) {
      message.error('请填写境外发货人名称');
      return;
    }
    const {
      updateValue, opContent,
    } = createDelgHeadChangeLog(billHead, formValues, formParams, this.msg, ietype);
    const head = { ...billHead, ...updateValue, template_id: templateRuleId };
    // saveBillHeadLocal 导致billHead已更新数据与formValues不相关, update时需要传billHead
    delete head.id;
    this.props.saveBillHead({ head, headId: billHead.id, opContent }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info('保存成功');
      }
    });
  }
  handleRuleChange = (value) => {
    if (value === undefined) {
      // TODO
      message.info('制单规则已清除');
      this.setState({ templateRuleId: null });
    }
  }
  handleRuleSelect = (value) => {
    if (value) {
      this.props.loadTemplateFormVals(value).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          const { formData } = result.data;
          const rules = {};
          ['template_id', 'rule_g_name', 'rule_currency', 'rule_orig_country', 'rule_net_wt', 'rule_g_unit', 'rule_gunit_num',
            'rule_duty_mode', 'rule_dest_country', 'rule_element', 'rule_district_code', 'rule_district_region',
            'rule_goods_attr', 'rule_purpose',
            'set_merge_split', 'merge_checked', 'merge_byhscode', 'merge_bygname', 'merge_byentryno', 'merge_bydistrict',
            'merge_bycurr', 'merge_bycountry', 'merge_bycopgno', 'merge_bygunit', 'merge_byengno', 'merge_bysplhs',
            'merge_bysplno', 'merge_spl_hs', 'merge_spl_no', 'merge_multi_prdcount_mark',
            'split_splcopgno', 'split_hscode', 'split_spl_category', 'split_curr', 'split_dutymode', 'split_percount',
            'split_ciqdecl', 'split_applcert', 'split_containerno', 'split_exportprefer',
            'sort_customs', 'sort_dectotal', 'sort_hscode', 'gen_invoice', 'invoice_template_id', 'gen_packing_list',
            'packing_list_template_id', 'gen_contract', 'contract_template_id'].forEach((rkey) => {
            if (formData[rkey] !== null && formData[rkey] !== undefined &&
                (rules[rkey] === null || rules[rkey] === undefined)) {
              rules[rkey] = formData[rkey];
            }
          });
          this.props.saveBillRules({ rules, ruleId: this.props.billRule.id });

          const headFormValues = this.props.form.getFieldsValue();
          const headValuesFromTmpl = {};
          ['template_id', 'trade_co', 'trade_custco', 'trade_name', 'owner_code', 'owner_custco', 'owner_name',
            'oversea_entity_aeocode', 'oversea_entity_name', 'oversea_entity_cname', 'oversea_entity_addr', 'trader_name_en',
            'bl_wb_no', 'voyage_no',
            'trader_ciqcode', 'owner_ciqcode', 'agent_ciqcode',
            'agent_code', 'agent_custco', 'agent_name', 'i_e_port', 'i_e_date', 'd_date', 'traf_mode', 'traf_name', 'trade_mode',
            'cut_mode', 'manual_no', 'trade_country', 'dept_dest_country', 'origin_port', 'dept_dest_port', 'entry_exit_zone',
            'district_code', 'license_no', 'storage_place', 'contr_no', 'trxn_mode', 'fee_curr', 'fee_mark', 'fee_rate',
            'insur_curr', 'insur_rate', 'insur_mark', 'other_curr', 'other_rate', 'other_mark', 'note', 'mark_note',
            'decl_matters', 'special_relation', 'price_effect', 'payment_royalty', 'ciq_orgcode', 'vsa_orgcode', 'insp_orgcode', 'purp_orgcode',
            'spec_decl_flag', 'correl_reason_flag'].forEach((key) => {
            if ((headFormValues[key] === null || headFormValues[key] === undefined) &&
                formData[key] !== null && formData[key] !== undefined
            ) {
              headValuesFromTmpl[key] = formData[key];
            }
          });
          // TODO Load billTemplate entQualif/ ciqUser
          this.props.saveBillHeadLocal(headValuesFromTmpl);
          this.setState({ templateRuleId: value });
          message.success('制单规则加载成功');
        }
      });
    }
  }
  handleSaveAsTemplate = () => {
    if (!this.editPermission) {
      message.warn(this.msg('noEitpermission'), 5);
      return;
    }
    this.props.setStepVisible(true);
  }
  handleOverlayMenu = (ev) => {
    if (ev.key === 'template') {
      this.handleSaveAsTemplate();
    } else if (ev.key === 'lock') {
      this.handleLock(true);
    } else if (ev.key === 'unlock') {
      this.handleLock(false);
    } else if (ev.key === 'redo') {
      Modal.confirm({
        title: '重新制单',
        content: '确定删除已生成的报关建议书?',
        onOk: () => {
          this.handleManifestRedo();
        },
      });
    }
  }
  handleLock = (lock) => {
    if (lock) {
      const { loginId, loginName, billHead } = this.props;
      this.props.lockManifest({
        loginId, loginName, billSeqNo: billHead.bill_seq_no, delgNo: billHead.delg_no,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message);
        } else {
          message.warning('锁定成功');
        }
      });
    } else {
      const { billHead } = this.props;
      this.props.lockManifest({
        loginId: null, loginName: null, billSeqNo: billHead.bill_seq_no, delgNo: billHead.delg_no,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message);
        } else {
          message.success('解锁成功');
        }
      });
    }
  }
  handleReviewDecls = () => {
    this.props.toggleReviewDeclsModal(true, { delg_no: this.props.billHead.delg_no });
  }
  handleSendDecls = () => {
    const head = this.props.billHead;
    this.props.showSendDeclsModal({
      visible: true,
      delgNo: head.delg_no,
      agentCode: head.agent_code,
      agentCustCo: head.agent_custco,
    });
  }
  handleManifestRedo = () => {
    const head = this.props.billHead;
    this.props.redoManifest(head.delg_no, head.bill_seq_no).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        const link = '/clearance/delegation/manifest/';
        this.context.router.push(`${link}${head.bill_seq_no}`);
      }
    });
  }
  handleMetaLoad = () => {
    this.props.loadBillMeta(this.props.billHead.bill_seq_no);
  }
  handlePreview = () => {
    const delgNo = this.props.billHead.delg_no;
    this.props.showPreviewer(delgNo, 'shipment');
  }
  handleDoctsDownload = () => {
    const billSeqNo = this.props.billHead.bill_seq_no;
    window.open(`${API_ROOTS.default}v1/cms/manifest/docts/download/doctsDatas_${billSeqNo}.xlsm?billSeqNo=${billSeqNo}`);
  }
  renderOverlayMenu(editable, revertable) {
    let lockMenuItem = null;
    if (editable) {
      if (this.props.billHead.locking_login_id === this.props.loginId) {
        lockMenuItem = <Menu.Item key="unlock"><Icon type="unlock" /> 解锁清单</Menu.Item>;
      } else if (!this.props.billHead.locking_login_id) {
        lockMenuItem = <Menu.Item key="lock"><Icon type="lock" /> 锁定清单</Menu.Item>;
      }
    }
    return (
      <Menu onClick={this.handleOverlayMenu}>
        {revertable &&
          <Menu.Item key="redo">
            <Icon type="rollback" /> 重新制单
          </Menu.Item>
        }
        <Menu.Item key="template"><Icon type="book" /> {this.msg('saveAsTemplate')}</Menu.Item>
        {editable && lockMenuItem}
      </Menu>);
  }
  render() {
    const {
      billHeadFieldsChangeTimes, loginId, billDeclStat,
      form, billHead, billMeta, templates, cdfGenerating,
      billMeta: { reviewPermit, declPermit },
    } = this.props;
    const { locked, lockedByOthers, templateRuleId } = this.state;
    const ietype = billHead.i_e_type === 0 ? 'import' : 'export';
    let reviewable = billMeta.entries.length > 0;
    let sendable = billMeta.entries.length > 0;
    let revertable = billMeta.entries.length > 0;
    billMeta.entries.forEach((entry) => {
      reviewable = reviewable && (entry.status === CMS_DECL_STATUS.proposed.value);
      sendable = sendable && (entry.status === CMS_DECL_STATUS.reviewed.value);
      revertable = revertable && (entry.status < CMS_DECL_STATUS.entered.value);
    });
    let editable = billMeta.entries.length === 0;
    if (editable && billHead.locking_login_id && billHead.locking_login_id !== loginId) {
      editable = false;
    }
    editable = editable && billMeta.manifestPermit;
    editable = editable && this.editPermission;
    const modelProps = {};
    if (billHead.template_id) {
      modelProps.initialValue = billHead.template_id;
    }
    const tabs = [];
    tabs.push(<TabPane tab={this.msg('manifestHeader')} key="header">
      <Spin spinning={this.props.templateValLoading}>
        <ManifestHeadPane
          ietype={ietype}
          readonly={!editable}
          form={form}
          formData={billHead}
        />
      </Spin>
    </TabPane>);
    tabs.push(<TabPane
      tab={<span>{this.msg('manifestDetails')} <Badge showZero overflowCount={99999} count={billDeclStat.bodyCount} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>}
      key="body"
    >
      <ManifestBodyPane
        ietype={ietype}
        readonly={!editable}
        headForm={form}
        billSeqNo={billHead.bill_seq_no}
      />
    </TabPane>);
    tabs.push(<TabPane
      tab={<span>{this.msg('containers')} <Badge showZero count={billDeclStat.containerCount} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>}
      key="containers"
    >
      <ContainersPane />
    </TabPane>);
    return (
      <Layout>
        <Layout>
          <PageHeader breadcrumb={[
            <a onClick={this.handlePreview}>{billHead.bill_seq_no}</a>,
            billMeta.entries.length > 0 && <DeclTreePopover
              entries={billMeta.entries}
              billSeqNo={billHead.bill_seq_no}
              ietype={ietype}
              currentKey="manifest"
            />,
          ]}
          >
            <PageHeader.Actions>
              {locked &&
              <Tooltip title={`清单已锁定，仅限${billHead.locking_name}可进行编辑`} placement="bottom">
                <Switch
                  className="switch-lock"
                  checked={locked}
                  checkedChildren={<Icon type="lock" />}
                  unCheckedChildren={<Icon type="unlock" />}
                  disabled={lockedByOthers}
                  onChange={this.handleLock}
                  style={{ marginTop: 4 }}
                />
              </Tooltip>}
              {editable && <Select
                value={templateRuleId}
                placeholder="选择制单规则"
                optionFilterProp="children"
                onSelect={this.handleRuleSelect}
                onChange={this.handleRuleChange}
                style={{ width: 200 }}
                allowClear
                suffixIcon={<Icon type="snippets" />}
              >
                <OptGroup label="可用制单规则">
                  {templates.map(data => (<Option
                    key={data.id}
                    value={data.id}
                  > {data.name}
                  </Option>))}
                </OptGroup>
              </Select>}
              {reviewable && reviewPermit &&
                <PrivilegeCover module="clearance" feature="delegation" action="audit">
                  <Button type="primary" icon="audit" onClick={this.handleReviewDecls}>{this.msg('reviewDecls')}</Button>
                </PrivilegeCover>
              }
              {sendable && declPermit &&
                <PrivilegeCover module="clearance" feature="delegation" action="edit">
                  <Button type="primary" icon="mail" onClick={this.handleSendDecls}>{this.msg('sendMultiDecls')}</Button>
                </PrivilegeCover>
              }
              {editable &&
                (<Button
                  type="primary"
                  icon="file-add"
                  disabled={billHeadFieldsChangeTimes > 0}
                  loading={cdfGenerating}
                  onClick={this.handleGenerateEntry}
                >{this.msg('generateCDP')}
                </Button>)}
              {editable &&
                <Button type="primary" icon="save" onClick={this.handleSaveManifest} disabled={billHeadFieldsChangeTimes === 0}>{this.msg('save')}</Button>}
              {billMeta.docts && !editable &&
                <Button icon="file-excel" onClick={this.handleDoctsDownload}>{this.msg('download')}</Button>
              }
              <Dropdown overlay={this.renderOverlayMenu(editable, revertable)}><Button>{this.msg('more')}<Icon type="caret-down" /></Button></Dropdown>
            </PageHeader.Actions>
          </PageHeader>
          <PageContent readonly={!editable} className="layout-min-width layout-min-width-large">
            <MagicCard
              bodyStyle={{ padding: 0 }}
              loading={this.props.manifestSpinning}
            >
              <Tabs defaultActiveKey="header">
                {tabs}
              </Tabs>
            </MagicCard>
          </PageContent>
        </Layout>
        <GenerateDeclModal />
        <SaveAsTemplateModal ietype={ietype} />
        <ReviewDeclsModal reload={this.handleMetaLoad} />
        <SendDeclsModal
          ietype={ietype}
          entries={billMeta.entries}
          reload={this.handleMetaLoad}
        />
      </Layout>
    );
  }
}
