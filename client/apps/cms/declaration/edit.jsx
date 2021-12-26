import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Badge, Form, Button, Icon, Layout, Tabs, Dropdown, Menu, Modal, Tag, message, notification } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DECL_STATUS, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { setNavTitle } from 'common/reducers/navbar';
import { loadEntry, billHeadChange, saveEntryHead, loadBillOrDeclStat, rollbackSendDecl, toggleReviewDeclsModal } from 'common/reducers/cmsManifest';
import {
  toggleDeclMsgModal, deleteDecl, setDeclReviewed, openDeclReleasedModal, showSendDeclModal,
  showDeclLog, confirmRevise, rollbackRevisedRevokedDecl, validateReviewedDecl,
} from 'common/reducers/cmsCustomsDeclare';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import { paasCollabTaskParam } from 'common/reducers/notification';
import { createDelgHeadChangeLog } from '../common/manifestChangeLog';
import DeclTreePopover from '../common/popover/declTreePopover';
import CDFHeadPaneV201603 from './cdf/v201603/cdfHeadPane';
import CDFHeadPaneV201807 from './cdf/v201807/cdfHeadPane';
import CusDeclBodyPane from './tabpane/cusDeclBodyPane';
import ContainersPane from './tabpane/cdfContainersPane';
import AttachedDocsPane from './tabpane/attachedDocsPane';
import AttachedCertsPane from './tabpane/attachedCertsPane';
import DutyTaxPane from './tabpane/dutyTaxPane';
import RevisePane from './tabpane/revisedPane';
import DeclReleasedModal from './modals/declReleasedModal';
import SendDeclMsgModal from './modals/sendDeclMsgModal';
import CusDeclLogsPanel from './panel/cusDeclLogsPanel';
import { StandardDocDef } from './print/docDef';
import DeclMsgModal from './modals/declMsgModal';
import ReviewDeclsModal from '../common/modal/reviewDeclsModal';
import DeclStatusPopover from '../common/popover/declStatusPopover';
import { DECL_LABEL_KEYS_BY_IEVERSION } from '../common/form/declFormItems';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(ietype, msg) {
  const version = 'v201807';
  fieldLabelMap.decl_port = msg('declPort');
  fieldLabelMap.cdf_flag = msg('entryType');
  fieldLabelMap.ftz_flag = msg('billType');
  fieldLabelMap.trade_co = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].trade_co[ietype]);
  fieldLabelMap.trade_name = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].trade_co[ietype]);
  fieldLabelMap.trade_custco = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].trade_co[ietype]);
  fieldLabelMap.trader_ciqcode = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].trade_co[ietype]);
  fieldLabelMap.d_date = msg('ddate');
  fieldLabelMap.i_e_port = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].ieport[ietype]);
  fieldLabelMap.owner_code = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].owner_code[ietype]);
  fieldLabelMap.owner_custco = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].owner_code[ietype]);
  fieldLabelMap.owner_ciqcode = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].owner_code[ietype]);
  fieldLabelMap.owner_name = msg(DECL_LABEL_KEYS_BY_IEVERSION[version].owner_code[ietype]);
  fieldLabelMap.trade_mode = msg('tradeMode');
  fieldLabelMap.cut_mode = msg('rmModeName');
  fieldLabelMap.agent_code = msg('agnetName');
  fieldLabelMap.agent_custco = msg('agnetName');
  fieldLabelMap.agent_ciqcode = msg('agnetName');
  fieldLabelMap.agent_name = msg('agnetName');
  fieldLabelMap.license_no = msg('licenseNo');
  fieldLabelMap.storage_place = msg('storagePlace');
  fieldLabelMap.traf_mode = msg('transMode');
  fieldLabelMap.traf_name = msg('transModeName');
  fieldLabelMap.voyage_no = msg('voyageNo');
  fieldLabelMap.bl_wb_no = msg('ladingWayBill');
  fieldLabelMap.trxn_mode = msg('trxMode');
  fieldLabelMap.manual_no = msg('emsNo');
  fieldLabelMap.contr_no = msg('contractNo');
  fieldLabelMap.trade_country = msg('tradeCountry');
  fieldLabelMap.origin_port = msg('originPort');
  fieldLabelMap.wrap_type = msg('packType');
  fieldLabelMap.gross_wt = msg('grossWeight');
  fieldLabelMap.net_wt = msg('netWeight');
  fieldLabelMap.pack_count = msg('packCount');
  fieldLabelMap.fee_rate = msg('freightCharge');
  fieldLabelMap.fee_curr = msg('freightCharge');
  fieldLabelMap.fee_mark = msg('freightCharge');
  fieldLabelMap.insur_rate = msg('insurance');
  fieldLabelMap.insur_curr = msg('insurance');
  fieldLabelMap.insur_mark = msg('insurance');
  fieldLabelMap.other_rate = msg('sundry');
  fieldLabelMap.other_curr = msg('sundry');
  fieldLabelMap.other_mark = msg('sundry');
  fieldLabelMap.mark_note = msg('markNo');
  fieldLabelMap.note = msg('remark');
  fieldLabelMap.decl_matters = msg('cusRemark');
  fieldLabelMap.special_relation = msg('specialRelation');
  fieldLabelMap.price_effect = msg('priceEffect');
  fieldLabelMap.payment_royalty = msg('paymentRoyalty');
  fieldLabelMap.ciq_orgcode = msg('orgCode');
  fieldLabelMap.vsa_orgcode = msg('vsaOrgCode');
  fieldLabelMap.insp_orgcode = msg('inspOrgCode');
  fieldLabelMap.purp_orgcode = msg('purpOrgCode');
  fieldLabelMap.ent_qualif_type = msg('entQualif');
  fieldLabelMap.spec_decl_flag = msg('specDeclFlag');
  fieldLabelMap.correl_no = msg('correlNo');
  fieldLabelMap.correl_reason_flag = msg('correlReasonFlag');
  fieldLabelMap.appl_cert = msg('applCert');
  fieldLabelMap.depart_date = msg('departDate');
  fieldLabelMap.swb_no = msg('BLno');
  fieldLabelMap.orig_box_flag = msg('originBox');
  fieldLabelMap.ra_decl_no = msg('raDeclNo');
  fieldLabelMap.ra_manual_no = msg('raManualNo');
  fieldLabelMap.store_no = msg('storeNo');
  fieldLabelMap.yard_code = msg('yardCode');
  fieldLabelMap.oversea_entity_aeocode =
    msg(DECL_LABEL_KEYS_BY_IEVERSION[version].oversea_entity[ietype]);
  fieldLabelMap.oversea_entity_name =
    msg(DECL_LABEL_KEYS_BY_IEVERSION[version].oversea_entity[ietype]);
  fieldLabelMap.dept_dest_port =
    msg(DECL_LABEL_KEYS_BY_IEVERSION[version].dept_dest_port[ietype]);
  fieldLabelMap.entry_exit_zone =
    msg(DECL_LABEL_KEYS_BY_IEVERSION[version].entry_exit_zone[ietype]);
  fieldLabelMap.dept_dest_country =
    msg(DECL_LABEL_KEYS_BY_IEVERSION[version].dept_dest_country[ietype]);
  fieldLabelMap.i_e_date = msg(DECL_LABEL_KEYS_BY_IEVERSION.i_e_date[ietype]);
}

const navObj = {
  depth: 3,
  moduleName: 'clearance',
  title: 'featCdmCustoms',
  jumpOut: true,
};

function fetchData({ dispatch, params }) {
  const promises = [];
  promises.push(dispatch(loadEntry(params.preEntrySeqNo)));
  return Promise.all(promises);
}

@injectIntl
@connect(
  state => ({
    billMeta: state.cmsManifest.billMeta,
    billDeclStat: state.cmsManifest.billDeclStat,
    head: state.cmsManifest.entryHead,
    bodies: state.cmsManifest.entryBodies,
    formRequire: state.saasParams.latest,
    declSpinning: state.cmsManifest.customsDeclLoading,
    billHeadFieldsChangeTimes: state.cmsManifest.billHeadFieldsChangeTimes,
    originDeclBodyList: state.cmsManifest.originDeclBodyList,
    revisedDeclBodyList: state.cmsManifest.revisedDeclBodyList,
    formParams: state.saasParams.latest,
    privileges: state.account.privileges,
  }),
  {
    saveEntryHead,
    loadEntry,
    loadBillOrDeclStat,
    deleteDecl,
    setDeclReviewed,
    openDeclReleasedModal,
    showSendDeclModal,
    setNavTitle,
    showPreviewer,
    toggleDeclMsgModal,
    showDeclLog,
    billHeadChange,
    rollbackSendDecl,
    confirmRevise,
    rollbackRevisedRevokedDecl,
    toggleReviewDeclsModal,
    validateReviewedDecl,
    getBlBookNosByType,
    toggleBizDock,
    paasCollabTaskParam,
  }
)
@connectFetch()(fetchData)
@connectNav(navObj)
@Form.create({ onValuesChange: (props, values) => props.billHeadChange(values) })
export default class CustomsDeclEditor extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    billMeta: PropTypes.shape({
      entries: PropTypes.arrayOf(PropTypes.shape({ pre_entry_seq_no: PropTypes.string })),
    }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    collapsed: true,
  }
  componentDidMount() {
    let script;
    if (!document.getElementById('pdfmake-min')) {
      script = document.createElement('script');
      script.id = 'pdfmake-min';
      script.src = `${__CDN__}/assets/pdfmake/pdfmake.min.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById('pdfmake-vfsfont')) {
      script = document.createElement('script');
      script.id = 'pdfmake-vfsfont';
      script.src = `${__CDN__}/assets/pdfmake/vfs_fonts.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    if (this.props.head.pre_entry_seq_no) {
      this.props.loadBillOrDeclStat(null, this.props.head.pre_entry_seq_no);
    }
    this.props.getBlBookNosByType();
    this.props.paasCollabTaskParam({
      bizNo: this.props.params.preEntrySeqNo,
      bizObject: SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.preEntrySeqNo !== this.props.params.preEntrySeqNo) {
      this.props.loadEntry(nextProps.params.preEntrySeqNo);
      this.props.setNavTitle(navObj);
    }
    if (nextProps.head && this.props.head &&
      nextProps.head.pre_entry_seq_no !== this.props.head.pre_entry_seq_no) {
      const ietype = nextProps.head.i_e_type === 0 ? 'import' : 'export';
      createFieldLabelMap(ietype, this.msg);
      this.props.loadBillOrDeclStat(null, nextProps.head.pre_entry_seq_no);
      this.props.paasCollabTaskParam({
        bizNo: nextProps.head.pre_entry_seq_no,
        bizObject: SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'customs', action: 'edit',
  });
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  handleDelete = () => {
    const { head } = this.props;
    this.props.deleteDecl(head.id, head.bill_seq_no).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.context.router.push(`/clearance/delegation/manifest/${head.delg_no}`);
      }
    });
  }
  /*
  handleReview = () => {
    const { head } = this.props;
    this.props.setDeclReviewed(
      [this.props.head.id],
      CMS_DECL_STATUS.reviewed.value,
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.props.loadEntry( head.pre_entry_seq_no );
      }
    });
  }
  */
  handleRecall = () => {
    const { head } = this.props;
    this.props.setDeclReviewed([head.id], CMS_DECL_STATUS.proposed.value).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.props.loadEntry(head.pre_entry_seq_no);
      }
    });
  }
  handleReviewDecls = () => {
    this.props.toggleReviewDeclsModal(true, { delg_no: this.props.head.delg_no });
  }
  handleShowSendDeclModal = () => {
    const { head } = this.props;
    const ietype = head.i_e_type === 0 ? 'import' : 'export';
    this.props.showSendDeclModal({
      visible: true,
      defaultDecl: {
        channel: head.dec_channel,
        dectype: head.pre_entry_dec_type,
        appuuid: head.ep_app_uuid,
      },
      ietype,
      preEntrySeqNo: head.pre_entry_seq_no,
      delgNo: head.delg_no,
      agentCustCo: head.agent_custco,
      agentCode: head.agent_code,
      ieDate: head.i_e_date,
    });
  }
  handleMarkReleasedModal = () => {
    const { head } = this.props;
    this.props.openDeclReleasedModal(
      head.entry_id,
      head.pre_entry_seq_no, head.delg_no, head.i_e_type
    );
  }
  reloadEntry = () => {
    this.props.loadEntry(this.props.head.pre_entry_seq_no);
  }
  handleMoreMenuClick = (ev) => {
    if (ev.key === 'release') {
      this.handleMarkReleasedModal();
    } else if (ev.key === 'recall') {
      Modal.confirm({
        title: this.msg('确定退回重新复核？'),
        onOk: () => {
          this.handleRecall();
        },
      });
    } else if (ev.key === 'resend') {
      this.handleShowSendDeclModal();
    } else if (ev.key === 'declMsg') {
      this.handleEpSendXmlView(this.props.head.ep_send_filename);
    } else if (ev.key === 'resultMsg') {
      this.handleEpRecvXmlView(this.props.head.ep_receipt_filename);
    } else if (ev.keyPath[1] === 'resultMsg') {
      this.handleEpRecvXmlView(ev.key);
    } else if (ev.key === 'log') {
      this.props.showDeclLog();
    } else if (ev.key === 'file') {
      window.open(this.props.head.ccd_file);
    } else if (ev.key === 'sendrollback') {
      this.handleSendRollback();
    } else if (ev.key === 'revised' || ev.key === 'revoked') {
      this.props.rollbackRevisedRevokedDecl(this.props.head.pre_entry_seq_no).then((result) => {
        if (!result.error) {
          this.context.router.push('/clearance/declaration');
        }
      });
    } else if (ev.key === 'export') {
      window.open(`${API_ROOTS.default}v1/cms/customs/declexport/${this.props.head.pre_entry_seq_no}.xlsx?preEntrySeqNo=${this.props.head.pre_entry_seq_no}`);
    }
  }
  handleSendRollback = () => {
    this.props.rollbackSendDecl(this.props.head.pre_entry_seq_no, this.props.head.cust_order_no);
  }
  handleEpSendXmlView = (filename) => {
    this.props.toggleDeclMsgModal(true, filename, 'sent');
  }
  handleEpRecvXmlView = (filename) => {
    this.props.toggleDeclMsgModal(true, filename, 'return');
  }
  handlePrintMenuClick = (ev) => {
    const {
      head, bodies, formRequire,
    } = this.props;
    if (ev.key === 'pdf') {
      window.pdfMake.fonts = {
        yahei: {
          normal: 'msyh.ttf',
          bold: 'msyh.ttf',
        },
      };
      const docDef = StandardDocDef(
        head,
        bodies,
        head.decl_way_code,
        head.cust_order_no,
        formRequire
      );
      window.pdfMake.createPdf(docDef).open();
    } else if (ev.key === 'excel') {
      window.open(`${API_ROOTS.default}v1/cms/customs/declexport/${head.pre_entry_seq_no}.xlsx?preEntrySeqNo=${head.pre_entry_seq_no}`);
    }
  }
  handlePreview = (delgNo) => {
    this.props.showPreviewer(delgNo, 'shipment');
  }
  handleHeadSave = () => {
    const { head, formParams } = this.props;

    const ietype = head.i_e_type === 0 ? 'import' : 'export';
    const headForm = this.props.form.getFieldsValue();
    const {
      updateValue, opContent,
    } = createDelgHeadChangeLog(head, headForm, formParams, this.msg, ietype);
    this.props.saveEntryHead(updateValue, head.id, opContent)
      .then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.info('保存成功');
        }
      });
  }
  handleConfirm = (headChangeInfo) => {
    const {
      revisedDeclBodyList, head, bodies, form: { getFieldsValue },
    } = this.props;
    let totalBodyNetwt = 0;
    let totalBodyGrossWt = 0;
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      totalBodyNetwt += Number(body.wet_wt) || 0;
      totalBodyGrossWt += Number(body.gross_wt) || 0;
    }
    const headWt = getFieldsValue(['gross_wt', 'net_wt']);
    if (headWt.net_wt && Number(totalBodyNetwt.toFixed(5)) !==
      Number(parseFloat(headWt.net_wt).toFixed(5))) {
      message.info('表体项净重总和与表头不同，无法保存');
      return;
    }
    if (headWt.gross_wt && Number(totalBodyGrossWt.toFixed(2))
      !== Number(parseFloat(headWt.gross_wt).toFixed(2))) {
      message.info('表体项毛重总和与表头不同，无法保存');
      return;
    }
    this.props.confirmRevise({
      head: headChangeInfo,
      bodies: revisedDeclBodyList,
      originDeclId: head.id,
    }).then((result) => {
      if (!result.error) {
        if (result.data.conflict) {
          message.warn('商品已加入归类冲突库,请及时处理', 6);
        }
        this.context.router.push('/clearance/declaration');
      }
    });
  }
  handleReviseSave = () => {
    const {
      head, form: { getFieldsValue },
    } = this.props;
    const formData = getFieldsValue();
    ['spec_decl_flag', 'decl_matters'].forEach((field) => {
      formData[field] = formData[field] && formData[field].join(',');
    });
    ['fee_rate', 'gross_wt', 'insur_rate', 'net_wt', 'other_rate', 'pack_count'].forEach((field) => {
      const fieldNumVal = Number(formData[field]);
      if (!Number.isNaN(fieldNumVal)) {
        formData[field] = fieldNumVal;
      } else {
        formData[field] = '';
      }
    });
    const changeFieldsName = new Set();
    const headChangeInfo = {};
    const headFields = Object.keys(formData);
    for (let i = 0; i < headFields.length; i++) {
      const field = headFields[i];
      if (head[field] !== formData[field] &&
        !(!head[field] && !formData[field])) {
        headChangeInfo[field] = formData[field];
      }
    }
    const changeFields = Object.keys(headChangeInfo);
    for (let i = 0; i < changeFields.length; i++) {
      const field = changeFields[i];
      changeFieldsName.add(this.msg(fieldLabelMap[field]));
    }
    Modal.confirm({
      title: '是否确认表头修改项?',
      content: Array.from(changeFieldsName).join(','),
      okText: '确认',
      cancelText: '继续编辑',
      onOk: () => {
        this.handleConfirm(headChangeInfo);
      },
    });
  }
  handleValidateReviewedDecl = () => {
    const { preEntrySeqNo } = this.props.params;
    this.props.validateReviewedDecl(preEntrySeqNo).then((res) => {
      if (!res.error) {
        const { missingHeadFields, missingBodyFields, missingOtherFields } = res.data;
        const { msg } = this;
        const fieldMsg = {
          trader_ciqcode: '境内收发货人检验检疫编码',
          // owner_ciqcode: '消费使用单位检验检疫编码',
          agent_ciqcode: '申报单位检验检疫编码',
          ciq_orgcode: 'orgCode',
          insp_orgcode: 'inspOrgCode',
          vsa_orgcode: 'vsaOrgCode',
          purp_orgcode: 'purpOrgCode',
          depart_date: 'departDate',
          mark_note: 'markNo',
          ent_qualif: 'entQualif',
          ciq_user: 'declUser',
          ciq_element: 'certNeeded',
          applcert: 'applCert',
          goods_limit: 'goodsLicence',
          danger_flag: 'nonDangerChemical',
          goods_attr: 'goodsAttr',
          ciqcode: 'ciqCode',
          purpose: 'goodsPurpose',
          g_ciq_model: 'goodsSpecHint',
          stuff: 'stuff',
          expiry_date: 'expiryDate',
          warranty_days: 'prodQgp',
          oversea_manufcr_name: 'overseaManufacture',
          product_spec: 'goodsSpec',
          product_models: 'ciqProductNo',
          brand: 'goodsBrand',
          produce_date: 'produceDate',
          external_lot_no: 'productBatchLot',
          manufcr_regno: 'manufcrRegNo',
          manufcr_regname: 'manufcrRegName',
        };
        let headMissingMsg = '';
        if (missingHeadFields.length > 0) {
          headMissingMsg = <span>报关单表头以下栏位缺失或未填写完整:<br /> {missingHeadFields.map(f => msg(fieldMsg[f])).join(', ')}</span>;
        }
        const bodyMissingMsg = [];
        Object.keys(missingBodyFields).forEach((key) => {
          const currValue = missingBodyFields[key];
          if (currValue && currValue.length) {
            bodyMissingMsg.push(<span>报关单明细第{currValue.join(',')}行{msg(fieldMsg[key])}未完整或不符合要求</span>);
            bodyMissingMsg.push(<br />);
          }
        });
        const otherMissingMsg = [];
        if (missingOtherFields.certmark) {
          otherMissingMsg.push(<span>报关单关联随附单证缺失</span>);
          otherMissingMsg.push(<br />);
        }
        if (missingOtherFields.container) {
          otherMissingMsg.push(<span>报关单关联集装箱信息缺失</span>);
          otherMissingMsg.push(<br />);
        }
        if (!headMissingMsg && bodyMissingMsg.length === 0 && otherMissingMsg.length === 0) {
          notification.success({
            message: '校验成功',
            description: '已通过所有必填项校验.',
            placement: 'bottomRight',
          });
        } else {
          Modal.warning({
            title: '必填项缺失',
            content: (
              <span>
                {headMissingMsg}{!!headMissingMsg && <span><br /><br /></span>}
                <span>{otherMissingMsg}</span>{otherMissingMsg.length > 0 && <br />}
                {bodyMissingMsg}
              </span>
            ),
          });
        }
      }
    });
  }
  render() {
    const {
      billDeclStat, form, bodies, billMeta, billHeadFieldsChangeTimes,
      head, head: { review_permit: reviewPermit, decl_permit: declPermit },
    } = this.props;

    const ietype = head.i_e_type === 0 ? 'import' : 'export';
    const revised = head.revise_type === '1' || head.revise_type === '3';
    const revoked = head.revise_type === '2' || head.revise_type === '4';
    const printMenu = (
      <Menu onClick={this.handlePrintMenuClick}>
        <Menu.Item key="excel"><Icon type="file-excel" theme="outlined" /> Excel格式</Menu.Item>
        <Menu.Item key="pdf" disabled><Icon type="file-pdf" theme="outlined" /> PDF格式</Menu.Item>
      </Menu>
    );
    const moreMenuItems = [];
    if (head.status === CMS_DECL_STATUS.reviewed.value && reviewPermit && this.editPermission) {
      moreMenuItems.push(<Menu.Item key="recall"><Icon type="rollback" /> 回退复核</Menu.Item>);
    }
    if (head.status === CMS_DECL_STATUS.sent.value && declPermit &&
      (head.sent_status === 2 || head.sent_status === 4) && this.editPermission) {
      moreMenuItems.push(<Menu.Item key="resend"><Icon type="mail" /> 重新发送</Menu.Item>);
    }
    if ((head.status === CMS_DECL_STATUS.sent.value &&
      (head.sent_status === 3 || head.sent_status === 1)) && declPermit && this.editPermission) {
      moreMenuItems.push(<Menu.Item key="sendrollback"><Icon type="rollback" /> rollbackSent</Menu.Item>);
    }
    if ((head.status === CMS_DECL_STATUS.reviewed.value ||
      head.status === CMS_DECL_STATUS.sent.value) && this.editPermission) {
      moreMenuItems.push(<Menu.Item key="release"><Icon type="flag" /> 放行确认</Menu.Item>);
    }
    if (head.ep_send_filename) moreMenuItems.push(<Menu.Item key="declMsg"><Icon type="eye-o" /> 查看申报报文</Menu.Item>);
    if (head.ep_receipt_filename) {
      const recpFiles = head.ep_receipt_filename.split(';');
      if (recpFiles.length === 1) {
        moreMenuItems.push(<Menu.Item key="resultMsg"><Icon type="eye-o" /> 查看回执报文</Menu.Item>);
      } else if (recpFiles.length > 1) {
        moreMenuItems.push(<Menu.SubMenu key="resultMsg" title={<span><Icon type="eye-o" /> 查看回执报文</span>}>
          {recpFiles.map(rpfname => <Menu.Item key={rpfname}>{rpfname}</Menu.Item>)}
        </Menu.SubMenu>);
      }
    }
    if (revised && this.editPermission) {
      moreMenuItems.push([<Menu.Divider />, <Menu.Item key="revised"><Icon type="rollback" />取消修改单</Menu.Item>]);
    }
    if (revoked && this.editPermission) {
      moreMenuItems.push([<Menu.Divider />, <Menu.Item key="revoked"><Icon type="rollback" />取消撤销单</Menu.Item>]);
    }
    moreMenuItems.push(<Menu.Item key="log"><Icon type="bars" /> 操作记录</Menu.Item>);
    const headSavable = !!billMeta.permitHeadEdit && this.editPermission;
    const tabs = [];
    if (head.cdf_version === 'v201603') {
      tabs.push(<TabPane tab={this.msg('declHead')} key="header">
        <CDFHeadPaneV201603
          ietype={ietype}
          form={form}
          formData={head}
          headSave={headSavable}
        />
      </TabPane>);
    } else {
      tabs.push(<TabPane tab={this.msg('declHead')} key="header">
        <CDFHeadPaneV201807
          ietype={ietype}
          form={form}
          formData={head}
          headSave={headSavable}
        />
      </TabPane>);
    }
    tabs.push(<TabPane tab={<span>{this.msg('declBody')} <Badge count={billDeclStat.bodyCount} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>} key="body">
      <CusDeclBodyPane
        ietype={ietype}
        ftz={head.sheet_type === 'FTZ'}
        data={bodies}
        headNo={head.id}
      />
    </TabPane>);
    tabs.push(<TabPane
      tab={<span>{this.msg('containers')} <Badge showZero count={billDeclStat.containerCount} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>}
      key="containers"
    >
      <ContainersPane />
    </TabPane>);
    tabs.push(<TabPane
      tab={<span>{this.msg('attachedCerts')} <Badge count={billDeclStat.certCount} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>}
      key="attachedCerts"
    >
      <AttachedCertsPane />
    </TabPane>);
    tabs.push(<TabPane
      tab={<span>{this.msg('attachedDocs')} <Badge count={0} style={{ backgroundColor: '#eee', color: '#707070' }} /></span>}
      key="attachedDocs"
    >
      <AttachedDocsPane />
    </TabPane>);
    tabs.push(<TabPane tab={this.msg('dutyTax')} key="dutyTax">
      <DutyTaxPane head={head} />
    </TabPane>);
    if (revised && !billMeta.permitHeadEdit) {
      tabs.push(<TabPane tab={this.msg('revisedDeclList')} key="revise">
        <RevisePane
          ietype={ietype}
          ftz={head.sheet_type === 'FTZ'}
        />
      </TabPane>);
    }
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            <a onClick={() => this.handlePreview(head.delg_no)}>{head.bill_seq_no}</a>,
            <a onClick={() => this.props.toggleBizDock('cmsDeclaration', {
              preEntrySeqNo: head.pre_entry_seq_no,
            })}
            >
              {head.entry_id || head.pre_entry_seq_no}
            </a>,
            <DeclTreePopover
              entries={billMeta.entries}
              ietype={ietype}
              billSeqNo={head.bill_seq_no}
              currentKey={`cus-decl-${head.pre_entry_seq_no}`}
            />,
            revised && <Tag color="orange">{this.msg('revisedDecl')}</Tag>,
            revoked && <Tag color="gray">{this.msg('revokedDecl')}</Tag>,
          ]}
        >
          <PageHeader.Nav>
            <DeclStatusPopover
              entryId={head.entry_id}
              declStatus={head.status}
              declSent={{
                sent_status: head.sent_status,
                sent_fail_msg: head.sent_fail_msg,
                          // send_date: head.epsend_date,
              }}
              returnFile={head.return_file}
            />
          </PageHeader.Nav>
          <PageHeader.Actions>
            {headSavable && head.revise_type !== '1' && head.revise_type !== '3' &&
              <Button type="primary" icon="save" onClick={this.handleHeadSave} disabled={billHeadFieldsChangeTimes === 0}>{this.msg('save')}</Button>}
            { head.status === CMS_DECL_STATUS.proposed.value && reviewPermit &&
            <PrivilegeCover module="clearance" feature="delegation" action="audit">
              <Button type="primary" icon="audit" onClick={this.handleReviewDecls}>{this.msg('review')}</Button>
            </PrivilegeCover>
              }
            { head.status === CMS_DECL_STATUS.reviewed.value && declPermit &&
            <PrivilegeCover module="clearance" feature="customs" action="edit">
              <Button type="primary" icon="mail" onClick={this.handleShowSendDeclModal}>{this.msg('sendDeclMsg')}</Button>
              <Button icon="safety-certificate" onClick={this.handleValidateReviewedDecl}>{this.msg('validateCiq')}</Button>
            </PrivilegeCover>
              }
            { head.status === CMS_DECL_STATUS.entered.value && !billMeta.permitHeadEdit &&
            <Button type="primary" icon="flag" onClick={this.handleMarkReleasedModal} disabled={revoked}>{this.msg('markReleased')}</Button>
              }
            { revised && !!billMeta.permitHeadEdit &&
              <Button
                type="primary"
                disabled={!(this.props.revisedDeclBodyList.length > 0 || form.isFieldsTouched())}
                onClick={this.handleReviseSave}
              >{this.msg('reviseSave')}</Button>}
            <Dropdown overlay={printMenu}>
              <Button icon="printer">{this.msg('print')}</Button>
            </Dropdown>
            <Dropdown overlay={<Menu onClick={this.handleMoreMenuClick}>{moreMenuItems}</Menu>}><Button>{this.msg('more')}<Icon type="caret-down" /></Button></Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent readonly={!revoked} deleted={revoked} className="layout-min-width layout-min-width-large">
          <MagicCard
            bodyStyle={{ padding: 0 }}
            loading={this.props.declSpinning}
          >
            <Tabs defaultActiveKey="header">
              {tabs}
            </Tabs>
          </MagicCard>
        </PageContent>
        <ReviewDeclsModal reload={this.reloadEntry} />
        <SendDeclMsgModal reload={this.reloadEntry} />
        <DeclReleasedModal reload={this.reloadEntry} />
        <DeclMsgModal />
        <CusDeclLogsPanel preEntrySeqNo={head.pre_entry_seq_no} />
      </Layout>
    );
  }
}
