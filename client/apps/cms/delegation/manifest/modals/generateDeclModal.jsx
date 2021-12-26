import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Modal, Collapse, Radio, Checkbox, Select, message, notification, Row, Col, Form } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { closeMergeSplitModal, submitBillMegeSplit } from 'common/reducers/cmsManifest';
import { loadHsCodeCategories } from 'common/reducers/cmsHsCode';
import { CMS_SPLIT_COUNT, SPECIAL_COPNO_TERM } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { Panel } = Collapse;

function MSCheckbox(props) {
  const {
    state, fieldOpt, field, text, onChange, disabled,
  } = props;
  function handleChange(ev) {
    onChange(fieldOpt, field, ev.target.checked);
  }
  return (
    <Checkbox onChange={handleChange} checked={state[fieldOpt][field]} disabled={disabled}>
      {text}
    </Checkbox>
  );
}

MSCheckbox.propTypes = {
  fieldOpt: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  state: PropTypes.shape({ mergeOpt: PropTypes.shape({ checked: PropTypes.bool }) }).isRequired,
  onChange: PropTypes.func.isRequired,
};

@injectIntl
@connect(
  state => ({
    visible: state.cmsManifest.visibleMSModal,
    manualDecl: !!state.cmsManifest.billHead.manual_no,
    ebound: state.cmsManifest.billHead.decl_way_code === 'EBND',
    ieType: state.cmsManifest.billHead.i_e_type,
    billSeqNo: state.cmsManifest.billHead.bill_seq_no,
    hscodeCategories: state.cmsHsCode.hscodeCategories,
    billRule: state.cmsManifest.billRule,
    billMeta: state.cmsManifest.billMeta,
    invTemplates: state.cmsInvoice.invTemplates,
    cdfGenerating: state.cmsManifest.cdfGenerating,
  }),
  { loadHsCodeCategories, closeMergeSplitModal, submitBillMegeSplit }
)
@Form.create()
export default class MergeSplitModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    manualDecl: PropTypes.bool.isRequired,
    billSeqNo: PropTypes.string,
    hscodeCategories: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.oneOf(['split', 'merge']) })).isRequired,
    invTemplates: PropTypes.arrayOf(PropTypes.shape({ docu_type: PropTypes.string })).isRequired,
  }
  state = {
    mergeOpt: {
      checked: false,
      byHsCode: true,
      byGName: false,
      byCurr: false,
      byCountry: false,
      byCopGNo: false,
      byGUnit: false,
      byEmGNo: false,
      byEntryNo: false,
      byDistrict: false,
      bySplHscode: false,
      bySplCopNo: false,
      multiProductCountMark: false,
      splHsSorts: [],
      splNoSorts: [],
    },
    splitOpt: {
      bySplCopGNo: false,
      byHsCode: false,
      tradeCurr: false,
      byDutyMode: false,
      hsCategory: [],
      perCount: '20',
      byContainerNo: false,
      byExportPrefer: false,
    },
    sortOpt: {
      customControl: true,
      inspectQuarantine: false,
      decTotal: '0',
      decPriceDesc: false,
      hsCodeAsc: false,
    },
    ciqOpt: {
      lawCiq: 'MUST',
    },
    invGen: {
      gen_invoice: false,
      invoice_template_id: null,
      gen_contract: false,
      contract_template_id: null,
      gen_packing_list: false,
      packing_list_template_id: null,
    },
    mergeOptArr: [],
    splitCategories: [],
    mergeCategories: [],
    alertTitle: '',
    alertMsg: '',
    invoiceTemplates: [],
    packingListTemplates: [],
    contractTemplates: [],
  }
  componentDidMount() {
    this.props.loadHsCodeCategories();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.invTemplates !== this.props.invTemplates) {
      const invoiceTemplates = nextProps.invTemplates.filter(tp => tp.docu_type === 0);
      const contractTemplates = nextProps.invTemplates.filter(tp => tp.docu_type === 1);
      const packingListTemplates = nextProps.invTemplates.filter(tp => tp.docu_type === 2);
      this.setState({ invoiceTemplates, contractTemplates, packingListTemplates });
    }
    if (nextProps.billRule !== this.props.billRule) {
      const rule = nextProps.billRule;
      const mergeOptArr = [];
      if (rule.merge_byhscode) {
        mergeOptArr.push('byHsCode');
      }
      if (rule.merge_bygname) {
        mergeOptArr.push('byGName');
      }
      if (rule.merge_bycurr) {
        mergeOptArr.push('byCurr');
      }
      if (rule.merge_bycountry) {
        mergeOptArr.push('byCountry');
      }
      if (rule.merge_bygunit) {
        mergeOptArr.push('byGUnit');
      }
      if (rule.merge_bycopgno) {
        mergeOptArr.push('byCopGNo');
      }
      if (rule.merge_byengno) {
        mergeOptArr.push('byEmGNo');
      }
      if (rule.merge_byentryno) {
        mergeOptArr.push('byEntryNo');
      }
      if (rule.merge_bydistrict) {
        mergeOptArr.push('byDistrict');
      }
      const specialHsSortArr = [];
      if (rule.split_spl_category) {
        const splArr = rule.split_spl_category.split(',');
        splArr.forEach((data) => {
          const numData = Number(data);
          specialHsSortArr.push(numData);
        });
      }
      const splHsMergeArr = [];
      if (rule.merge_spl_hs) {
        const splArr = rule.merge_spl_hs.split(',');
        splArr.forEach((data) => {
          const numData = Number(data);
          splHsMergeArr.push(numData);
        });
      }
      const splNoMergeArr = rule.merge_spl_no ? rule.merge_spl_no.split(',') : [];
      this.setState({
        mergeOpt: {
          checked: rule.merge_checked,
          byHsCode: rule.merge_byhscode,
          byGName: rule.merge_bygname,
          byCurr: rule.merge_bycurr,
          byCountry: rule.merge_bycountry,
          byCopGNo: rule.merge_bycopgno,
          byGUnit: rule.merge_bygunit,
          byEmGNo: rule.merge_byengno,
          byEntryNo: rule.merge_byentryno,
          byDistrict: rule.merge_bydistrict,
          bySplHscode: rule.merge_bysplhs,
          bySplCopNo: rule.merge_bysplno,
          splHsSorts: splHsMergeArr,
          splNoSorts: splNoMergeArr,
          multiProductCountMark: rule.merge_multi_prdcount_mark,
        },
        splitOpt: {
          bySplCopGNo: rule.split_splcopgno,
          byHsCode: rule.split_hscode,
          tradeCurr: rule.split_curr,
          byDutyMode: !!rule.split_dutymode,
          byCiqDecl: !!rule.split_ciqdecl,
          byApplCert: !!rule.split_applcert,
          hsCategory: specialHsSortArr,
          perCount: rule.split_percount ? rule.split_percount.toString() : '20',
          byContainerNo: !!rule.split_containerno,
          byExportPrefer: !!rule.split_exportprefer,
        },
        ciqOpt: {
          lawCiq: rule.split_ciqdecl ? 'AUTO' : 'MUST',
        },
        sortOpt: {
          customControl: rule.sort_customs,
          decTotal: String(rule.sort_dectotal),
          hsCodeAsc: rule.sort_hscode,
        },
        invGen: {
          gen_invoice: rule.gen_invoice,
          invoice_template_id: rule.invoice_template_id,
          gen_contract: rule.gen_contract,
          contract_template_id: rule.contract_template_id,
          gen_packing_list: rule.gen_packing_list,
          packing_list_template_id: rule.packing_list_template_id,
        },
        mergeOptArr,
      });
    }
    if (nextProps.hscodeCategories !== this.props.hscodeCategories &&
       nextProps.hscodeCategories.length > 0) {
      const splitCategories = nextProps.hscodeCategories.filter(ct => ct.type === 'split');
      const mergeCategories = nextProps.hscodeCategories.filter(ct => ct.type === 'merge');
      this.setState({ splitCategories, mergeCategories });
    }
  }
  msg = formatMsg(this.props.intl)
  mergeConditions = [{
    label: this.msg('codeT'),
    value: 'byHsCode',
  }, {
    label: this.msg('productName'),
    value: 'byGName',
  }, {
    label: this.msg('currency'),
    value: 'byCurr',
  }, {
    label: this.msg('origCountry'),
    value: 'byCountry',
  }, {
    label: this.msg('unit'),
    value: 'byGUnit',
  }, {
    label: this.msg('productCode'),
    value: 'byCopGNo',
  }]
  handleCancel = () => {
    this.props.closeMergeSplitModal();
    this.setState({ alertMsg: '', alertTitle: '' });
  }
  handleMergeRadioChange = () => {
    this.setState({
      mergeOpt: { checked: !this.state.mergeOpt.checked },
    });
  }
  handleMergeCheck = (checkeds) => {
    const opt = {
      ...this.state.mergeOpt,
      byHsCode: false,
      byGName: false,
      byCurr: false,
      byCountry: false,
      byCopGNo: false,
      byGUnit: false,
      byEmGNo: false,
      byEntryNo: false,
      byDistrict: false,
    };
    checkeds.forEach((chk) => {
      opt[chk] = true;
    });
    this.setState({
      mergeOpt: opt,
      mergeOptArr: checkeds,
    });
  }
  handleSplitSelectChange = (value) => {
    const splitOpt = { ...this.state.splitOpt, perCount: value };
    this.setState({ splitOpt });
  }
  handleCheckChange = (fieldOpt, field, value) => {
    const opt = { ...this.state[fieldOpt] };
    opt[field] = value;
    const checkState = {};
    if (field === 'byCiqDecl') {
      if (value === true) {
        opt.perCount = CMS_SPLIT_COUNT[0].value;
        const ciqOpt = { ...this.state.ciqOpt };
        ciqOpt.lawCiq = 'AUTO';
        checkState.ciqOpt = ciqOpt;
      }
      if (value === false) {
        opt.byApplCert = false;
      }
    }
    checkState[fieldOpt] = opt;
    this.setState(checkState);
  }
  handleDecTotalSort = (value) => {
    const opt = { ...this.state.sortOpt };
    opt.decTotal = value;
    this.setState({ sortOpt: opt });
  }
  handleLawCiqChange = (value) => {
    const opt = { ...this.state.ciqOpt };
    opt.lawCiq = value;
    this.setState({ ciqOpt: opt });
  }
  handleOk = () => {
    const { billSeqNo } = this.props;
    const {
      splitOpt, mergeOpt, sortOpt, ciqOpt, invGen,
    } = this.state;
    const splHsSorts = this.props.form.getFieldValue('mergeHsSort');
    const splNoSorts = this.props.form.getFieldValue('mergeNoSort');
    if (mergeOpt.checked) {
      if (!(mergeOpt.byHsCode || mergeOpt.byGName || mergeOpt.byCurr ||
        mergeOpt.byCountry || mergeOpt.byCopGNo || mergeOpt.byEmGNo || mergeOpt.byGUnit ||
        mergeOpt.byEntryNo || (mergeOpt.bySplCopNo && splNoSorts.length > 0) ||
        (mergeOpt.bySplHscode && splHsSorts.length > 0))) {
        message.error('请选择归并项');
        return;
      }
    }
    if (mergeOpt.bySplHscode) {
      mergeOpt.splHsSorts = splHsSorts;
    }
    if (mergeOpt.bySplCopNo) {
      mergeOpt.splNoSorts = splNoSorts;
    }
    if (splitOpt.byHsCode) {
      splitOpt.hsCategory = this.props.form.getFieldValue('specialSort');
    }
    if (invGen.gen_invoice) {
      invGen.invoice_template_id = this.props.form.getFieldValue('invoice_template_id');
    }
    if (invGen.gen_packing_list) {
      invGen.packing_list_template_id = this.props.form.getFieldValue('packing_list_template_id');
    }
    if (invGen.gen_contract) {
      invGen.contract_template_id = this.props.form.getFieldValue('contract_template_id');
    }
    this.props.submitBillMegeSplit({
      billSeqNo, splitOpt, mergeOpt, sortOpt, ciqOpt, invGen,
    }).then((result) => {
      if (result.error) {
        if (result.error.message.key === 'ftz-detail-splited') {
          const ids = result.error.message.details;
          const title = '以下相同分拨出库明细会被拆分至不同报关单,将导致报关单与集中申报单内容不一致:';
          const alertMsg = <span>{ids.join(',')} <br />请考虑去掉货号归并或者重新选择分拨出库项</span>;
          this.setState({ alertMsg, alertTitle: title });
        } else if (result.error.message.key === 'gross-less-netwt') {
          const title = '净重毛重拆分失败';
          const alertMsg = '拆分生成的报关单存在毛重小于净重情况,请手工调整清单表体净毛重';
          this.setState({ alertMsg, alertTitle: title });
        } else if (result.error.message.key === 'ciq-props-missing') {
          const title = '检务必填项缺失';
          const { missingHeadFields, missingBodyFields, missingOtherFields } = result.error.message;
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
            product_model: 'ciqProductNo',
            brand: 'goodsBrand',
            produce_date: 'produceDate',
            external_lot_no: 'productBatchLot',
            manufcr_regno: 'manufcrRegNo',
            manufcr_regname: 'manufcrRegName',
          };
          let headMissingMsg = null;
          if (missingHeadFields.length > 0) {
            headMissingMsg = <span>清单表头以下栏位缺失或未填写完整:<br /> {missingHeadFields.map(f => msg(fieldMsg[f])).join(', ')}</span>;
          }
          const bodyMissingMsg = [];
          Object.keys(missingBodyFields).forEach((key) => {
            const currValue = missingBodyFields[key];
            if (currValue && currValue.length) {
              bodyMissingMsg.push(<span>清单明细第{currValue.join(',')}行{msg(fieldMsg[key])}未完整或不符合要求</span>);
              bodyMissingMsg.push(<br />);
            }
          });
          const otherMissingMsg = [];
          const missingCerMark = missingOtherFields.certmark;
          if (missingCerMark && missingCerMark.length) {
            otherMissingMsg.push(<span>清单明细第{missingCerMark.join(',')}行关联证书不能生成随附单证,原因:缺少可用的海关证件</span>);
            otherMissingMsg.push(<br />);
          }
          const alertMsg = (<span>{headMissingMsg}{!!headMissingMsg && <span><br /><br /></span>}
            <span>{otherMissingMsg}</span>{otherMissingMsg.length > 0 && <br />}
            {bodyMissingMsg}</span>);
          this.setState({ alertMsg, alertTitle: title });
        } else if (result.error.message.key !== 'decl-gened') {
          message.error(result.error.message, 10);
        }
      } else {
        notification.success({
          message: '操作成功',
          description: '已生成报关建议书.',
          placement: 'bottomRight',
        });
        const zeroPacks = result.data.filter(head => head.pack_count === 0);
        if (zeroPacks.length > 0) {
          notification.warn({
            message: '件数为0',
            description: `${zeroPacks.map(zp => zp.pre_entry_seq_no).join(',')}拆分生成表头件数为0`,
            duration: 0,
            placement: 'bottomRight',
          });
        }
        const weightLt1Entries = result.data.filter(head => head.gross_wt < 1 || head.net_wt < 1);
        if (weightLt1Entries.length > 0) {
          notification.warn({
            message: '净毛重小于1',
            description: `${weightLt1Entries.map(zp => zp.pre_entry_seq_no).join(',')}拆单表头净毛重小于1`,
            duration: 0,
            placement: 'bottomRight',
          });
        }
        this.props.closeMergeSplitModal();
      }
    });
  }
  render() {
    const {
      alertMsg, alertTitle, mergeOpt, splitOpt, sortOpt, invGen, splitCategories, mergeCategories,
      invoiceTemplates, packingListTemplates, contractTemplates,
    } = this.state;
    const { form: { getFieldDecorator }, ieType, cdfGenerating } = this.props;
    let { mergeConditions } = this;
    if (this.props.manualDecl) {
      mergeConditions = [...mergeConditions, { label: this.msg('emGNo'), value: 'byEmGNo' }];
      if (this.props.ebound) {
        mergeConditions = [...mergeConditions, { label: this.msg('entryInNo'), value: 'byEntryNo' }];
      }
    }
    if (ieType === 1) {
      mergeConditions = [...mergeConditions, { label: this.msg('eDistrict'), value: 'byDistrict' }];
    }
    return (
      <Modal
        maskClosable={false}
        title="生成报关建议书"
        width={960}
        style={{ top: 24 }}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={this.props.visible}
        confirmLoading={cdfGenerating}
        okButtonProps={{ loading: cdfGenerating }}
        cancelButtonProps={{ loading: cdfGenerating }}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <Form className="form-layout-compact">
          {alertMsg && <Alert message={alertTitle} description={alertMsg} type="error" showIcon />}
          <Collapse bordered={false} defaultActiveKey={['merge', 'split', 'ciq', 'sort']}>
            <Panel key="merge" header={this.msg('mergePrinciple')} >
              <FormItem>
                <Col span={3}>
                  <Radio checked={mergeOpt.checked} onChange={this.handleMergeRadioChange}>
                    {this.msg('conditionalMerge')}
                  </Radio>
                </Col>
                <Col span={21}>
                  <CheckboxGroup
                    options={mergeConditions}
                    disabled={!mergeOpt.checked}
                    onChange={this.handleMergeCheck}
                    value={this.state.mergeOptArr}
                  />
                </Col>
              </FormItem>
              {mergeOpt.checked && !mergeOpt.byCopGNo ? <Col offset={3}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem>
                      <MSCheckbox
                        fieldOpt="mergeOpt"
                        field="bySplHscode"
                        text={this.msg('mergeSpecialHscode')}
                        onChange={this.handleCheckChange}
                        state={this.state}
                      />
                      { mergeOpt.bySplHscode ?
                        <div>
                          {getFieldDecorator('mergeHsSort', {
                rules: [{ type: 'array' }],
                initialValue: mergeOpt.splHsSorts,
              })(<Select
                mode="multiple"
                placeholder={this.msg('specialHscodeSort')}
                disabled={mergeCategories.length === 0}
              >
                { mergeCategories.map(ct =>
                  <Option value={ct.id} key={ct.id}>{ct.name}</Option>) }
              </Select>)}
                        </div> : null}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem>
                      <MSCheckbox
                        fieldOpt="mergeOpt"
                        field="bySplCopNo"
                        text={this.msg('mergeSpecialNo')}
                        onChange={this.handleCheckChange}
                        state={this.state}
                      />
                      { mergeOpt.bySplCopNo ?
                        <div>
                          {getFieldDecorator('mergeNoSort', {
                  rules: [{ type: 'array' }],
                  initialValue: mergeOpt.splNoSorts,
                })(<Select mode="multiple">
                  { SPECIAL_COPNO_TERM.map(data =>
                     (<Option value={data.value} key={data.value}>{data.text}</Option>))}
                </Select>)}
                        </div> : null}
                    </FormItem>
                  </Col>

                </Row>
                <FormItem>
                  <MSCheckbox
                    fieldOpt="mergeOpt"
                    field="multiProductCountMark"
                    text={this.msg('mergeWithMultiProductCount')}
                    onChange={this.handleCheckChange}
                    state={this.state}
                  />
                </FormItem>
              </Col> : null}
              <FormItem>
                <Col span={3}>
                  <Radio checked={!mergeOpt.checked} onChange={this.handleMergeRadioChange}>
                    {this.msg('nonMerge')}
                  </Radio>
                </Col>
                <Col span={21}>
            按清单数据直接生成报关建议书
                </Col>
              </FormItem>
            </Panel>
            <Panel key="split" header={this.msg('splitPrinciple')} >
              <Row>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="bySplCopGNo"
                      text={this.msg('splitSplCopGNo')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
                <Col span={16}>
                  <FormItem label={this.msg('splitPerCount')} colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Select
                      onChange={this.handleSplitSelectChange}
                      value={this.state.splitOpt.perCount}
                    >
                      {
                    CMS_SPLIT_COUNT.map(sc =>
                      <Option key={sc.value} value={sc.value}>{sc.text}</Option>)
                  }
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <FormItem>
                <MSCheckbox
                  fieldOpt="splitOpt"
                  field="byHsCode"
                  text={this.msg('specialHscodeDeclare')}
                  onChange={this.handleCheckChange}
                  state={this.state}
                />
                { splitOpt.byHsCode ?
                  <div>
                    {getFieldDecorator('specialSort', {
                        rules: [{ type: 'array' }],
                        initialValue: splitOpt.hsCategory,
                      })(<Select mode="multiple" placeholder={this.msg('specialHscodeSort')} disabled={splitCategories.length === 0}>
                        {
                          splitCategories.map(ct =>
                            <Option value={ct.id} key={ct.id}>{ct.name}</Option>)
                        }
                      </Select>)}
                  </div> : null}
              </FormItem>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="byCiqDecl"
                      text={this.msg('byCiqDeclSplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="byApplCert"
                      text={this.msg('byApplCertSplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                      disabled={!splitOpt.byCiqDecl}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="tradeCurr"
                      text={this.msg('currencySplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="byDutyMode"
                      text={this.msg('dutyModeSplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="byContainerNo"
                      text={this.msg('containerNoSplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="splitOpt"
                      field="byExportPrefer"
                      text={this.msg('exportPreferSplit')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel key="ciq" header={this.msg('ciqPrinciple')} >
              <Col span={16}>
                <FormItem label="检务项报文" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                  <Select value={this.state.ciqOpt.lawCiq} onChange={this.handleLawCiqChange}>
                    <Option value="NONE">不发送</Option>
                    <Option value="MUST">全部发送</Option>
                    <Option value="AUTO">监管条件和检验检疫类别判定发送</Option>
                  </Select>
                </FormItem>
              </Col>
            </Panel>
            <Panel key="sort" header={this.msg('sortPrinciple')} >
              <Col span={8}>
                <FormItem label="申报金额" colon={false} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                  <Select value={sortOpt.decTotal} onChange={this.handleDecTotalSort}>
                    <Option value="0">不排序</Option>
                    <Option value="1">降序</Option>
                    <Option value="2">升序</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <MSCheckbox
                    fieldOpt="sortOpt"
                    field="customControl"
                    text={this.msg('customOnTop')}
                    onChange={this.handleCheckChange}
                    state={this.state}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <MSCheckbox
                    fieldOpt="sortOpt"
                    field="hsCodeAsc"
                    text={this.msg('hsCodeAscSort')}
                    onChange={this.handleCheckChange}
                    state={this.state}
                  />
                </FormItem>
              </Col>
            </Panel>
            <Panel key="docu" header={this.msg('docuTemplate')} >
              <Row gutter={8}>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="invGen"
                      field="gen_invoice"
                      text={this.msg('生成发票')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                    {invGen.gen_invoice ?
                      <div>
                        {getFieldDecorator('invoice_template_id', { initialValue: invGen.invoice_template_id })(<Select placeholder={this.msg('选择发票模板')}>
                          {invoiceTemplates && invoiceTemplates.map(ct =>
                            <Option value={ct.id} key={ct.id}>{ct.template_name}</Option>)}
                        </Select>)}
                      </div> : null}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="invGen"
                      field="gen_packing_list"
                      text={this.msg('生成箱单')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                    {invGen.gen_packing_list ?
                      <div>
                        {getFieldDecorator('packing_list_template_id', { initialValue: invGen.packing_list_template_id })(<Select placeholder={this.msg('选择箱单模板')}>
                          {packingListTemplates && packingListTemplates.map(ct =>
                            <Option value={ct.id} key={ct.id}>{ct.template_name}</Option>)}
                        </Select>)}
                      </div> : null}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <MSCheckbox
                      fieldOpt="invGen"
                      field="gen_contract"
                      text={this.msg('生成合同')}
                      onChange={this.handleCheckChange}
                      state={this.state}
                    />
                    {invGen.gen_contract ?
                      <div>
                        {getFieldDecorator('contract_template_id', { initialValue: invGen.contract_template_id })(<Select placeholder={this.msg('选择合同模板')}>
                          {contractTemplates && contractTemplates.map(ct =>
                            <Option value={ct.id} key={ct.id}>{ct.template_name}</Option>)}
                        </Select>)}
                      </div> : null}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
    );
  }
}
