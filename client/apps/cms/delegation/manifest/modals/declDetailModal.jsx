import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Icon, Form, Modal, Select, Input, Col, Row, Card, message } from 'antd';
import { showEditBodyModal, editBillBody, addNewBillBody, showDeclElementsModal, loadDeclBodyGoodsLimits, saveDecBody, saveReviseDeclBody } from 'common/reducers/cmsManifest';
import { loadLimitFuzzyHscodes, loadHscodeCiqList, getElementByHscode } from 'common/reducers/cmsHsCode';
import { getItemForBody } from 'common/reducers/cmsTradeitem';
import { getBookGoodsByPrdtItemNo } from 'common/reducers/cwmBlBook';
import { CIQ_GOODS_ATTRS, CIQ_GOODS_USETO } from 'common/constants';
import { validateDbcsLength } from 'common/validater';
import DataTable from 'client/components/DataTable';
import FullscreenModal from 'client/components/FullscreenModal';
import FormControlSearchSelect from 'client/apps/cms/common/form/formLimitSelect';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { renderV1V2Options } from 'client/common/transformer';
import { createDelgBodyChangeLog } from '../../../common/manifestChangeLog';
import CiqModelPopover from '../../../common/popover/ciqModelPopover';
import { formatCiqModelString } from '../../../common/popover/ciqModelFunction';
import DangerGoodsPopover from '../../../common/popover/dangerGoodsPopover';
import GoodsLimitModal from '../../../common/modal/goodsLimitModal';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    currencies: state.saasParams.latest.currency.map(curr => ({
      code: curr.curr_code,
      code_v1: curr.curr_code_v1,
      text: curr.curr_name,
    })),
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    countries: state.saasParams.latest.country.map(tc => ({
      code: tc.cntry_co,
      code_v1: tc.cntry_co_v1,
      text: tc.cntry_name_cn,
    })),
    districts: state.saasParams.latest.district.map(dt => ({
      value: dt.district_code,
      text: dt.district_name,
    })),
    regions: state.saasParams.latest.cnregion.map(re => ({
      value: re.region_code,
      text: re.region_name,
    })),
    exemptions: state.saasParams.latest.exemptionWay,
    origPlace: state.saasParams.latest.origPlace,
    fuzzyHscodes: state.cmsHsCode.fuzzyHscodes,
    ciqList: state.cmsHsCode.hsCiqList,
    bodyItem: state.cmsTradeitem.bodyItem,
    billRule: state.cmsManifest.billRule,
    editBodyVisible: state.cmsManifest.editBodyVisible,
    declBodyInfo: state.cmsManifest.declBodyModal,
    declBodyGoodsLimits: state.cmsManifest.declBodyGoodsLimits,
    originDeclBodyList: state.cmsManifest.originDeclBodyList,
    formParams: state.saasParams.latest,
    privileges: state.account.privileges,
  }),
  {
    showEditBodyModal,
    editBillBody,
    addNewBillBody,
    loadLimitFuzzyHscodes,
    loadHscodeCiqList,
    getItemForBody,
    getElementByHscode,
    showDeclElementsModal,
    loadDeclBodyGoodsLimits,
    saveDecBody,
    saveReviseDeclBody,
    getBookGoodsByPrdtItemNo,
  }
)
@Form.create()
export default class DeclDetailModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    editBodyVisible: PropTypes.bool.isRequired,
    declBodyInfo: PropTypes.shape({
      delg_no: PropTypes.string,
      declBody: PropTypes.shape({
        hscode: PropTypes.string,
        g_name: PropTypes.string,
      }),
      isCDF: PropTypes.bool,
    }),
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      setFieldsValue: PropTypes.func,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    units: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      text: PropTypes.string,
    })),
    countries: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    districts: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      text: PropTypes.string,
    })),
    regions: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      text: PropTypes.string,
    })),
    disabled: PropTypes.bool.isRequired,
  }
  state = {
    goodsLimitModalVisible: false,
    goodsLimits: [],
    originGoodsLimits: [],
    fieldLabelMap: {},
  }
  componentDidMount() {
    const { declBodyInfo: { declBody: editBody, delg_no: delgNo }, ietype } = this.props;
    if (editBody.hscode) {
      this.props.loadHscodeCiqList(editBody.hscode);
    }
    if (delgNo && editBody.cop_g_no) {
      this.props.getItemForBody({
        delgNo,
        copProdNo: editBody.cop_g_no,
      });
    }
    const fieldLabelMap = {
      g_no: this.msg('itemNo'),
      cop_g_no: this.msg('copGNo'),
      em_g_no: this.msg('emGNo'),
      hscode: this.msg('codeT'),
      ciqcode: this.msg('ciqCode'),
      g_name: this.msg('gName'),
      en_name: this.msg('enName'),
      g_model: this.msg('gModel'),
      g_qty: this.msg('quantity'),
      g_unit: this.msg('unit'),
      dec_price: this.msg('decPrice'),
      trade_total: this.msg('decPrice'),
      trade_curr: this.msg('currency'),
      qty_pcs: this.msg('qtyPcs'),
      unit_pcs: this.msg('unitPcs'),
      wet_wt: this.msg('netWeight'),
      gross_wt: this.msg('grossWeight'),
      qty_1: this.msg('qty1'),
      qty_2: this.msg('qty2'),
      orig_country: this.msg('origCountry'),
      dest_country: this.msg('destCountry'),
      version_no: this.msg('versionNo'),
      processing_fees: this.msg('processingFees'),
      duty_mode: this.msg('exemptionWay'),
      orig_place_code: this.msg('origPlaceCode'),
      g_ciq_model: this.msg('goodsSpec'),
      goods_attr: this.msg('goodsAttr'),
      purpose: this.msg('goodsPurpose'),
      danger_flag: this.msg('nonDangerChemical'),
      danger_uncode: this.msg('dangUnCode'),
      danger_name: this.msg('dangName'),
      danger_pack_type: this.msg('dangPackType'),
      danger_pack_spec: this.msg('dangPackSpec'),
      stuff: this.msg('stuff'),
      expiry_date: this.msg('expiryDate'),
      warranty_days: this.msg('prodQgp'),
      oversea_manufcr_name: this.msg('overseaManufacture'),
      ciqmodel_spec: this.msg('goodsSpec'),
      ciqmodel_productno: this.msg('ciqProductNo'),
      brand: this.msg('goodsBrand'),
      produce_date: this.msg('produceDate'),
      external_lot_no: this.msg('productBatchLot'),
      manufcr_regno: this.msg('manufcrRegNo'),
      manufcr_regname: this.msg('manufcrRegName'),
    };
    if (ietype === 'import') {
      fieldLabelMap.district_code = this.msg('domesticDest');
      fieldLabelMap.district_region = this.msg('regionDest');
    } else {
      fieldLabelMap.district_code = this.msg('domesticOrig');
      fieldLabelMap.district_region = this.msg('regionOrig');
    }
    this.setState({
      fieldLabelMap,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.fuzzyHscodes !== nextProps.fuzzyHscodes) {
      if (nextProps.fuzzyHscodes.length === 1) {
        const hscode = nextProps.fuzzyHscodes[0];
        const ruleGunit = this.props.billRule.rule_gunit_num;
        const firstUnit = this.props.units.filter(unit => unit.value === hscode.first_unit
          || unit.text === hscode.first_unit)[0];
        const unit1 = firstUnit ? firstUnit.value : '';
        const secondUnit = this.props.units.filter(unit => unit.value === hscode.second_unit
          || unit.text === hscode.second_unit)[0];
        const unit2 = secondUnit ? secondUnit.value : '';
        const hsGunit = this.props.units.filter(unit => unit.value === hscode[ruleGunit]
          || unit.text === hscode[ruleGunit])[0];
        const gunit = hsGunit ? hsGunit.value : '';
        const gname = this.props.form.getFieldValue('g_name');
        this.props.form.setFieldsValue({
          g_name: gname || hscode.product_name,
          element: hscode.declared_elements,
          unit_1: unit1,
          unit_2: unit2,
          g_unit: gunit,
        });
      }
    }
    if (nextProps.ciqList !== this.props.ciqList) {
      this.resetCiqcodeField(nextProps.ciqList);
    }
    if (nextProps.editBodyVisible && !this.props.editBodyVisible) {
      if (nextProps.declBodyInfo.isCDF) {
        this.props.loadDeclBodyGoodsLimits({
          delgNo: null,
          gNo: null,
          declBodyId: nextProps.declBodyInfo.declBody.id,
        });
      } else {
        this.props.loadDeclBodyGoodsLimits({
          delgNo: nextProps.declBodyInfo.delg_no,
          gNo: nextProps.declBodyInfo.declBody.g_no,
        });
      }
      if (nextProps.declBodyInfo.delg_no && nextProps.declBodyInfo.declBody.cop_g_no) {
        this.props.getItemForBody({
          delgNo: nextProps.declBodyInfo.delg_no,
          copProdNo: nextProps.declBodyInfo.declBody.cop_g_no,
        });
      }
      if (nextProps.declBodyInfo.declBody.hscode) {
        if (nextProps.declBodyInfo.declBody.hscode !== this.props.declBodyInfo.declBody.hscode) {
          this.props.loadHscodeCiqList(nextProps.declBodyInfo.declBody.hscode);
        } else {
          this.resetCiqcodeField(nextProps.ciqList);
        }
      }
    }
    if (nextProps.declBodyGoodsLimits !== this.props.declBodyGoodsLimits) {
      this.setState({
        goodsLimits: nextProps.declBodyGoodsLimits,
        originGoodsLimits: nextProps.declBodyGoodsLimits,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  resetCiqcodeField = (ciqList) => {
    const formCiqCode = this.props.form.getFieldValue('ciqcode');
    if (ciqList.length === 1) {
      if (formCiqCode !== ciqList[0].ciqcode) {
        this.props.form.setFieldsValue({ ciqcode: ciqList[0].ciqcode });
      }
    } else if (ciqList.filter(ciq => ciq.ciqcode === formCiqCode).length === 0) {
      this.props.form.setFieldsValue({ ciqcode: '' });
    }
  }
  handleGoodsLimitModalClose = () => {
    this.setState({
      goodsLimitModalVisible: false,
    });
  }
  handleHsSearch = (value) => {
    if (value) {
      if (value.length >= 3 && value.length <= 10) {
        this.props.loadLimitFuzzyHscodes(value);
        this.props.form.setFieldsValue({ ciqcode: '' });
        if (value.length === 10) {
          this.props.loadHscodeCiqList(value);
        }
      }
    }
  }
  handleCopGNoChange = (ev) => {
    const { declBodyInfo: { delg_no: delgNo } } = this.props;
    this.props.getItemForBody({
      delgNo,
      copProdNo: ev.target.value,
    }).then((result) => {
      if (!result.error) {
        const item = result.data || {};
        const itemKeyArray = [
          'hscode', 'ciqcode', 'g_name', 'g_model', 'element', 'g_unit', 'unit_1',
          'unit_2', 'trade_curr', 'orig_country', 'dest_country', 'duty_mode',
          // 'brand', 'stuff',
        ];
        const unitg = this.props.units.filter(unit =>
          unit.value === item.g_unit || unit.text === item.g_unit)[0];
        item.g_unit = unitg ? unitg.value : '';
        const itemObj = {};
        itemKeyArray.forEach((itemkey) => {
          if (item[itemkey] !== null && item[itemkey] !== undefined) {
            itemObj[itemkey] = item[itemkey];
          } else {
            itemObj[itemkey] = '';
          }
        });
        this.props.form.setFieldsValue(itemObj);
        if (item.hscode) {
          this.props.loadHscodeCiqList(item.hscode);
        }
      }
    });
  }
  handleEmGNoChange = (ev) => {
    const { manualNo, ietype, tradeMode } = this.props;
    if (manualNo && (tradeMode || ietype === 'import')) {
      this.props.getBookGoodsByPrdtItemNo(manualNo, ev.target.value, ietype, tradeMode)
        .then((result) => {
          if (!result.error) {
            const item = result.data || {};
            item.cop_g_no = item.product_no;
            item.trade_curr = item.currency;
            item.trade_total = item.decl_total_amount;
            item.g_qty = item.decl_g_qty;
            item.orig_country = item.country;
            const itemKeyArray = [
              'cop_g_no', 'hscode', 'ciqcode', 'g_name', 'g_model', 'g_unit', 'unit_1',
              'unit_2', 'trade_curr', 'duty_mode', 'dec_price', 'trade_total', 'g_qty', 'orig_country',
            ];
            const unitg = this.props.units.filter(unit =>
              unit.value === item.g_unit || unit.text === item.g_unit)[0];
            item.g_unit = unitg ? unitg.value : '';
            const itemObj = {};
            itemKeyArray.forEach((itemkey) => {
              if (item[itemkey] !== null && item[itemkey] !== undefined) {
                itemObj[itemkey] = item[itemkey];
              } else {
                itemObj[itemkey] = '';
              }
            });
            this.props.form.setFieldsValue(itemObj);
          }
        });
    }
  }
  handleDecQtyChange = (ev) => {
    const tradeTot = parseFloat(this.props.form.getFieldValue('trade_total'));
    const qty = parseFloat(ev.target.value);
    if (!Number.isNaN(qty)) {
      if (!Number.isNaN(tradeTot) && qty > 0) {
        const decPrice = parseFloat((tradeTot / qty).toFixed(3));
        this.props.form.setFieldsValue({ dec_price: decPrice });
      }
    }
  }
  handleTradeTotChange = (ev) => {
    const qty = parseFloat(this.props.form.getFieldValue('g_qty'));
    const tradeTot = parseFloat(ev.target.value);
    if (!Number.isNaN(qty) && qty > 0) {
      const decPrice = Number((tradeTot / qty).toFixed(3));
      this.props.form.setFieldsValue({ dec_price: decPrice });
    }
  }
  handleDecPriceChange = (ev) => {
    const qty = parseFloat(this.props.form.getFieldValue('g_qty'));
    const decPrice = parseFloat(ev.target.value);
    if (!Number.isNaN(qty)) {
      const digits = decPrice.toString().split('.')[1];
      const decimal = digits ? digits.length : 0;
      const tradeTot = Number(decPrice * qty).toFixed(decimal);
      this.props.form.setFieldsValue({ trade_total: tradeTot });
    }
  }
  handleModelSave = (newGModel) => {
    this.props.form.setFieldsValue({ g_model: newGModel });
  }
  handleShowDeclElementModal = () => {
    const { declBodyInfo: { declBody: editBody, isCDF }, disabled } = this.props;
    const declElem = this.props.form.getFieldsValue(['hscode', 'g_model', 'g_name']);
    this.props.getElementByHscode(declElem.hscode || editBody.hscode).then((result) => {
      if (!result.error) {
        const cdfDisable = isCDF ? false : disabled;
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          editBody.id,
          declElem.g_model,
          cdfDisable,
          declElem.g_name,
          this.handleModelSave
        );
      } else {
        message.error(result.error.message);
      }
    });
  }
  showGoodsLimitModal= () => {
    this.setState({
      goodsLimitModalVisible: true,
    });
    /*
    const { data } = this.props;
    this.props.toggleGoodsLicenceModal(true, {
      hscode: data.hscode,
      gName: data.g_name,
      ciqCode: data.ciqcode,
      gNo: data.g_no,
      id: data.id,
      preEntrySeqNo: data.pre_entry_seq_no,
    });
    */
  }
  handleCancel = () => {
    this.props.showEditBodyModal(false);
    this.props.form.resetFields();
  }

  isBodyClassifyChanged(bodyItem, newBody, changes) {
    const fieldMsg = {
      hscode: 'codeT',
      ciqcode: 'ciqCode',
      g_name: 'gName',
      g_model: 'gModel',
    };
    ['hscode', 'ciqcode', 'g_name', 'g_model'].forEach((field) => {
      if (!bodyItem[field] || bodyItem[field] !== newBody[field]) {
        changes.push({
          field: this.msg(fieldMsg[field]),
          repo: bodyItem[field],
          current: newBody[field],
        });
      }
    });
    return changes.length > 0;
  }
  handleBillBodySave = (newBody, newClassifyToAudit, glOpContent) => {
    const {
      declBodyInfo: { delg_no: delgNo, declBody: editBody }, ciqList, bodyItem, formParams,
    } = this.props;
    const {
      updateValue, opContent,
    } = createDelgBodyChangeLog(this.state.fieldLabelMap, editBody, newBody, formParams, ciqList);
    let prom;
    if (editBody.id) {
      prom = this.props.editBillBody({
        goodsLimits: this.state.goodsLimits,
        body: updateValue,
        bodyId: editBody.id,
        repoItemId: newClassifyToAudit ? bodyItem.id : undefined,
        opContent,
        glOpContent,
      });
    } else {
      prom = this.props.addNewBillBody({
        goodsLimits: this.state.goodsLimits,
        billSeqNo: delgNo,
        body: updateValue,
        repoItemId: newClassifyToAudit ? bodyItem.id : undefined,
        opContent,
        glOpContent,
      });
    }
    prom.then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleCancel();
      }
    });
  }
  handleGoodsLimitsChange = (goodsLimits) => {
    this.setState({
      goodsLimits,
    });
  }
  handleConfirm = (changeData) => {
    this.props.saveReviseDeclBody(changeData);
    this.handleCancel();
  }
  handleOk = () => {
    const {
      declBodyInfo: { declBody: editBody, isCDF, reviseEdit }, formParams, ciqList,
    } = this.props;
    const { originGoodsLimits, goodsLimits } = this.state;
    const oldGl = originGoodsLimits.map(f => (`类型${f.lic_type_code}(${f.licence_no})`)).join(',');
    const newGl = goodsLimits.map(f => (`类型${f.lic_type_code}(${f.licence_no})`)).join(',');
    let glOpContent;
    if ((oldGl || newGl) && (oldGl !== newGl)) {
      glOpContent = `产品资质由${oldGl || '空'}变为${newGl || '空'}`;
    }
    this.props.form.validateFields((errors, newBody) => {
      if (!errors) {
        // 校验数量和单位，确保成对出现
        if ((newBody.g_qty && !newBody.g_unit) || (!newBody.g_qty && newBody.g_unit) ||
        (newBody.qty_pcs && !newBody.unit_pcs) || (!newBody.qty_pcs && newBody.unit_pcs) ||
        (newBody.qty_1 && !newBody.unit_1) || (!newBody.qty_1 && newBody.unit_1) ||
        (newBody.qty_2 && !newBody.unit_2) || (!newBody.qty_2 && newBody.unit_2)) {
          message.error('请确保成交/法一/法二/个数单位和数量成对出现', 3);
          return;
        }
        const { bodyItem } = this.props;
        const classifyChanges = [];
        const isFullClassified = newBody.hscode && newBody.ciqcode
          && newBody.g_name && newBody.g_model;
        if (reviseEdit) { // 改单
          const newDeclBody = newBody;
          const originBody = this.props.originDeclBodyList.find(body => body.id === editBody.id);
          ['dec_price', 'g_qty', 'gross_wt', 'qty_1', 'qty_2', 'qty_pcs', 'wet_wt'].forEach((field) => {
            const fieldNumVal = Number(newDeclBody[field]);
            if (!Number.isNaN(fieldNumVal)) {
              newDeclBody[field] = fieldNumVal;
            } else {
              newDeclBody[field] = '';
            }
          });
          newDeclBody.goods_attr = newDeclBody.goods_attr.join(',');
          const bodyFields = Object.keys(newDeclBody);
          const changeData = {};
          const changeFieldsName = [];
          for (let i = 0; i < bodyFields.length; i++) {
            const field = bodyFields[i];
            if (newDeclBody[field] !== originBody[field] &&
              !(!newDeclBody[field] && !originBody[field])) {
              changeData[field] = newDeclBody[field];
            }
          }
          const changeFields = Object.keys(changeData);
          if (changeFields.length > 0) {
            changeData.id = originBody.id;
            changeData.g_no = originBody.g_no;
          }
          for (let i = 0; i < changeFields.length; i++) {
            const field = changeFields[i];
            changeFieldsName.push(this.state.fieldLabelMap[field]);
          }
          if (originGoodsLimits.length !== goodsLimits.length) {
            changeFieldsName.push(this.msg('goodsLicence'));
            changeData.goodsLimits = goodsLimits;
          } else {
            for (let i = 0; i < originGoodsLimits.length; i++) {
              const origGoodsLimit = originGoodsLimits[i];
              const current = goodsLimits[i];
              const limitKeys = Object.keys(origGoodsLimit);
              for (let j = 0; j < limitKeys.length; j++) {
                const key = limitKeys[j];
                if (origGoodsLimit[key] !== current[key]) {
                  changeFieldsName.push(this.msg('goodsLicence'));
                  changeData.goodsLimits = goodsLimits;
                  if (!changeData.id) {
                    changeData.id = originBody.id;
                    changeData.g_no = originBody.g_no;
                  }
                  break;
                }
              }
            }
          }
          Modal.confirm({
            title: '是否确认表体修改项?',
            content: changeFieldsName.join(','),
            okText: '确认',
            cancelText: '继续编辑',
            onOk: () => {
              this.handleConfirm(changeData);
            },
          });
        } else if (isCDF) { // 报关单表体变更
          const changeData = {
            danger_flag: newBody.danger_flag,
            danger_name: newBody.danger_name,
            danger_pack_spec: newBody.danger_pack_spec,
            danger_pack_type: newBody.danger_pack_type,
            danger_uncode: newBody.danger_uncode,
            g_ciq_model: newBody.g_ciq_model,
            stuff: newBody.stuff,
            expiry_date: (newBody.expiry_date === '' || newBody.expiry_date === undefined) ? null : newBody.expiry_date,
            warranty_days: (newBody.warranty_days === '' || newBody.warranty_days === undefined) ? null : newBody.warranty_days,
            oversea_manufcr_name: newBody.oversea_manufcr_name,
            brand: newBody.brand,
            produce_date_str: (newBody.produce_date === '' || newBody.produce_date === undefined) ? null : newBody.produce_date,
            manufcr_regno: newBody.manufcr_regno,
            manufcr_regname: newBody.manufcr_regname,
            product_models: newBody.product_model,
            product_spec: newBody.product_spec,
            external_lot_no: newBody.external_lot_no,
            goods_attr: newBody.goods_attr.join(','),
            g_model: newBody.g_model,
          };
          const { opContent } = createDelgBodyChangeLog(
            this.state.fieldLabelMap, editBody,
            newBody, formParams, ciqList,
          );
          this.props.saveDecBody({
            goodsLimits: this.state.goodsLimits,
            body: changeData,
            bodyId: editBody.id,
            opContent,
            glOpContent,
          }).then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              this.handleCancel();
            }
          });
          // 清单表体变更，且有新物料产生
        } else if (isFullClassified && bodyItem.id &&
          this.isBodyClassifyChanged(bodyItem, newBody, classifyChanges)) {
          Modal.confirm({
            width: 960,
            title: '是否提交归类修改至物料库审核?',
            content: (<DataTable
              columns={[{
            dataIndex: 'field',
            width: 100,
          }, {
            title: '物料库值',
            dataIndex: 'repo',
            width: 150,
          }, {
            title: '修改值',
            dataIndex: 'current',
            width: 150,
          }]}
              dataSource={classifyChanges}
              showToolbar={false}
              pagination={false}
              noSetting
            />),
            okText: '是',
            cancelText: '否',
            onOk: () => {
              this.handleBillBodySave(newBody, true, glOpContent);
            },
            onCancel: () => {
              this.handleBillBodySave(newBody, false, glOpContent);
            },
          });
        } else { // 常规清单表体变更
          this.handleBillBodySave(newBody, false, glOpContent);
        }
      }
    });
  }
  render() {
    const {
      editBodyVisible, declBodyInfo: { declBody: editBody, isCDF, reviseEdit },
      form: { getFieldDecorator },
      currencies,
      units,
      countries,
      fuzzyHscodes,
      exemptions,
      districts,
      regions,
      origPlace,
      ietype,
      ciqList,
    } = this.props;
    let { disabled } = this.props;
    const { fieldLabelMap } = this.state;
    if (reviseEdit) {
      disabled = false;
    }
    if (!editBodyVisible) {
      return null;
    }
    const cdfDisable = isCDF ? false : disabled;
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
    const formItemSpan2Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemSpan4Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const editPermission = hasPermission(this.props.privileges, {
      module: 'clearance', feature: isCDF ? 'customs' : 'delegation', action: 'edit',
    });
    return (
      <FullscreenModal
        title={this.msg('itemDeclDetail')}
        onSave={(cdfDisable || !editPermission) ? null : this.handleOk}
        onCancel={this.handleCancel}
        visible={editBodyVisible}
      >
        <Card>
          <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col">
            <Row>
              {isCDF && <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.g_no}>
                  <Input value={editBody.g_no} disabled={disabled} />
                </FormItem>
              </Col>}
              {!isCDF && <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.cop_g_no}
                >
                  {getFieldDecorator('cop_g_no', {
                rules: [{ required: cdfDisable, message: '商品货号必填' }],
                initialValue: editBody.cop_g_no,
              })(<Input onChange={this.handleCopGNoChange} disabled={disabled} />)}
                </FormItem>
              </Col>}
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.em_g_no}>
                  {getFieldDecorator('em_g_no', {
                initialValue: editBody.em_g_no,
                // rules: [{ max: 19 }],
              })(<Input onChange={this.handleEmGNoChange} disabled={isCDF || reviseEdit} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.hscode}>
                  {disabled ? <Input value={editBody.hscode} disabled /> :
                  getFieldDecorator('hscode', {
                initialValue: editBody.hscode,
                rules: [{ max: 10 }],
              })(<Select mode="combobox" disabled={disabled} onChange={this.handleHsSearch} style={{ width: '100%' }}>
                {
                  fuzzyHscodes.map(data => (<Option value={data.hscode} key={data.hscode}>
                    {data.hscode}</Option>))}
              </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.ciqcode}>
                  {getFieldDecorator('ciqcode', {
                    initialValue: editBody.ciqcode,
                  })(<Select showSearch disabled={disabled} optionFilterProp="children">
                    {ciqList.map(item =>
                      (<Option key={item.ciqcode} value={item.ciqcode}>
                        {item.ciqcode} | {item.ciqname}
                      </Option>))}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemSpan2Layout}
                  colon={false}
                  label={fieldLabelMap.g_name}
                >
                  {getFieldDecorator('g_name', {
                initialValue: editBody.g_name,
                rules: [{ max: 255 }],
              })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemSpan2Layout}
                  colon={false}
                  label={fieldLabelMap.en_name}
                >
                  {getFieldDecorator('en_name', {
                initialValue: editBody.en_name,
              })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  {...formItemSpan4Layout}
                  colon={false}
                  label={fieldLabelMap.g_model}
                >
                  {getFieldDecorator('g_model', {
                initialValue: editBody.g_model,
                rules: [{ validator: (rule, gmodel, cb) => validateDbcsLength(gmodel, 255, cb, '规范申报最多255字节') }],
              })(<Input
                disabled={cdfDisable}
                addonAfter={
                  <Button
                    size="small"
                    onClick={this.handleShowDeclElementModal}
                  ><Icon type="ellipsis" /></Button>}
              />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.g_qty}>
                  {getFieldDecorator('g_qty', {
                initialValue: editBody.g_qty,
                onChange: this.handleDecQtyChange,
              })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.g_unit}>
                  {getFieldDecorator('g_unit', {
                initialValue: editBody.g_unit,
              })(<Select disabled={disabled} showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {units.map(ut =>
                  <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                }
              </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.dec_price}
                >
                  <Col span={12}>
                    {getFieldDecorator('dec_price', {
                  initialValue: editBody.dec_price,
                })(<Input disabled={disabled} placeholder={this.msg('unitPrice')} onChange={this.handleDecPriceChange} />)}
                  </Col>
                  <Col span={12} style={{ paddingLeft: 4 }}>
                    {getFieldDecorator('trade_total', {
                      // rules: [{ required: true, message: '申报总价必填' }],
                  initialValue: editBody.trade_total,
                })(<Input disabled={disabled} type="number" placeholder={this.msg('totalPrice')} onChange={this.handleTradeTotChange} />)}
                  </Col>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.trade_curr}
                >
                  {getFieldDecorator('trade_curr', {
                initialValue: editBody.trade_curr,
              })(<Select disabled={disabled} showSearch showArrow optionFilterProp="search" optionLabelProp="title" style={{ width: '100%' }}>
                {renderV1V2Options(currencies).map(cr => (
                  <Option key={cr.value} value={cr.value} search={cr.search} title={cr.title}>
                    {cr.text}</Option>))}
              </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.qty_pcs}>
                  {getFieldDecorator('qty_pcs', {
                initialValue: editBody.qty_pcs,
              })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.unit_pcs}
                >
                  {getFieldDecorator('unit_pcs', {
                initialValue: editBody.unit_pcs,
              })(<Select disabled={disabled} showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {
                  units.map(ut =>
                    <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                }
              </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.wet_wt}>
                  {getFieldDecorator('wet_wt', {
                initialValue: editBody.wet_wt,
              })(<Input disabled={disabled} type="number" addonAfter="KG" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.gross_wt}
                >
                  {getFieldDecorator('gross_wt', {
                initialValue: editBody.gross_wt,
              })(<Input disabled={disabled} type="number" addonAfter="KG" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.qty_1}>
                  {getFieldDecorator('qty_1', {
                initialValue: editBody.qty_1,
              })(<Input disabled={disabled} type="number" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={this.msg('unit1')}>
                  {getFieldDecorator('unit_1', {
                initialValue: editBody.unit_1,
              })(<Select disabled showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {
                  units.map(ut =>
                    <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                }
              </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.qty_2}>
                  {getFieldDecorator('qty_2', {
                initialValue: editBody.qty_2,
              })(<Input disabled={disabled} type="number" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={this.msg('unit2')}>
                  {getFieldDecorator('unit_2', {
                initialValue: editBody.unit_2,
              })(<Select disabled showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {
                  units.map(ut =>
                    <Option key={ut.value} value={ut.value}>{ut.value} | {ut.text}</Option>)
                }
              </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormControlSearchSelect
                  col={8}
                  field="orig_country"
                  label={fieldLabelMap.orig_country}
                  rules={[{ required: true, message: '原产国必填' }]}
                  formData={editBody}
                  getFieldDecorator={getFieldDecorator}
                  disabled={disabled}
                  options={renderV1V2Options(countries)}
                />
              </Col>
              <Col span={6}>
                <FormControlSearchSelect
                  disabled={disabled}
                  col={8}
                  field="dest_country"
                  label={fieldLabelMap.dest_country}
                  rules={[{ required: true, message: '目的国必填' }]}
                  formData={editBody}
                  getFieldDecorator={getFieldDecorator}
                  options={renderV1V2Options(countries)}
                />
              </Col>
              <Col span={6}>
                <FormControlSearchSelect
                  disabled={disabled}
                  col={8}
                  field="district_code"
                  label={fieldLabelMap.district_code}
                  formData={editBody}
                  getFieldDecorator={getFieldDecorator}
                  options={districts.map(dt => ({
                value: dt.value,
                text: `${dt.value} | ${dt.text}`,
              }))}
                />
              </Col>
              <Col span={6}>
                <FormControlSearchSelect
                  disabled={disabled}
                  col={8}
                  field="district_region"
                  label={fieldLabelMap.district_region}
                  formData={editBody}
                  getFieldDecorator={getFieldDecorator}
                  options={regions.map(dt => ({
                value: dt.value,
                text: `${dt.value} | ${dt.text}`,
              }))}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.version_no}
                >
                  {getFieldDecorator('version_no', {
                initialValue: editBody.version_no,
                rules: [{ len: 8 }],
              })(<Input disabled={disabled} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.processing_fees}
                >
                  {getFieldDecorator('processing_fees', {
                initialValue: editBody.processing_fees,
              })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={fieldLabelMap.duty_mode}
                >
                  {getFieldDecorator('duty_mode', {
                rules: [{ required: true, message: '征免方式必填' }],
                initialValue: editBody.duty_mode,
              })(<Select disabled={disabled} showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {exemptions.map(ep => (
                  <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
              </Select>)}
                </FormItem>
              </Col>
              {ietype === 'import' &&
              <Col span={6}>
                <FormControlSearchSelect
                  disabled={disabled}
                  col={8}
                  field="orig_place_code"
                  label={fieldLabelMap.orig_place_code}
                  formData={editBody}
                  getFieldDecorator={getFieldDecorator}
                  options={origPlace.map(dt => ({
                value: dt.place_code,
                text: `${dt.place_code} | ${dt.place_name}`,
              }))}
                />
              </Col>}
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  {...formItemSpan4Layout}
                  colon={false}
                  label={fieldLabelMap.g_ciq_model}
                >
                  {getFieldDecorator('g_ciq_model', {
                initialValue: editBody.g_ciq_model || formatCiqModelString(editBody, isCDF),
              })(<Input
                disabled={cdfDisable}
                placeholder={!cdfDisable ? this.msg('goodsSpecHint') : null}
                addonAfter={cdfDisable ? null : (<CiqModelPopover
                  form={this.props.form}
                  ciqModelSource={editBody}
                  controlVisible={editBodyVisible}
                  ietype={ietype}
                  isCDF={isCDF}
                />)
                  }
              />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemSpan2Layout}
                  colon={false}
                  label={fieldLabelMap.goods_attr}
                >
                  {getFieldDecorator('goods_attr', {
                initialValue: editBody.goods_attr ? editBody.goods_attr.split(',') : [],
              })(<Select disabled={cdfDisable} showSearch showArrow optionFilterProp="children" mode="multiple" style={{ width: '100%' }}>
                {CIQ_GOODS_ATTRS.map(ep => (
                  <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
              </Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} colon={false} label={fieldLabelMap.purpose}>
                  {getFieldDecorator('purpose', {
                initialValue: editBody.purpose,
              })(<Select disabled={disabled} showSearch showArrow optionFilterProp="children" style={{ width: '100%' }}>
                {CIQ_GOODS_USETO.map(ep => (
                  <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
              </Select>)}
                </FormItem>
              </Col>
              <Col span={3} style={{ paddingLeft: 16 }}>
                <Button disabled={cdfDisable} onClick={this.showGoodsLimitModal} style={{ width: '100%' }}>
                  {this.msg('goodsLicence')}<Icon type="ellipsis" />
                </Button>
                <GoodsLimitModal
                  declBody={{
                    hscode: editBody.hscode,
                    g_name: editBody.g_name,
                    ciqcode: editBody.ciqcode,
                    ciqname: editBody.ciqname,
                  }}
                  msg={this.msg}
                  ietype={this.props.ietype}
                  onGoodsLimitModalClose={this.handleGoodsLimitModalClose}
                  goodsLimitModalvisible={this.state.goodsLimitModalVisible}
                  onGoodsLimitModalChange={this.handleGoodsLimitsChange}
                  goodsLimitsInfo={this.state.goodsLimits}
                />
              </Col>
              <Col span={3} style={{ paddingLeft: 16 }}>
                <DangerGoodsPopover
                  disabled={cdfDisable}
                  controlVisible={editBodyVisible}
                  form={this.props.form}
                  goodsDanger={{
                  danger_flag: editBody.danger_flag, // '1 是危险品 0 否'
                  danger_uncode: editBody.danger_uncode,
                  danger_name: editBody.danger_name,
                  danger_pack_type: editBody.danger_pack_type,
                  danger_pack_spec: editBody.danger_pack_spec,
                  }}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </FullscreenModal>
    );
  }
}

