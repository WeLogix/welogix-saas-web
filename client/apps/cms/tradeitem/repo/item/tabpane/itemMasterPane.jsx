import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button, Card, Collapse, DatePicker, Form, Icon, Input, Select, Rate, Row, Col } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import FormPane from 'client/components/FormPane';
import { loadLimitFuzzyHscodes, loadHscodeCiqList, getElementByHscode } from 'common/reducers/cmsHsCode';
import { showDeclElementsModal } from 'common/reducers/cmsManifest';
import { toggleApplyCertsModal } from 'common/reducers/cmsTradeitem';
import { validateDbcsLength } from 'common/validater';
import { SPECIAL_COPNO_TERM, CMS_TRADE_ITEM_TYPE, TRADE_ITEM_APPLY_CERTS, CIQ_DANGER_PACK_TYPE, CIQ_GOODS_ATTRS, CMS_HS_EFFICIENCY } from 'common/constants';
import DeclElementsModal from '../../../../common/modal/declElementsModal';
import ApplyCertsModal from '../modal/applyCertsModal';
import { formatMsg } from '../../../message.i18n';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;

function getFieldInits(formData) {
  const init = { specialMark: [], appl_cert_name: '' };
  if (formData) {
    Object.keys(formData).forEach((fd) => {
      if (['unit_net_wt', 'unit_price', 'fixed_qty'].indexOf(fd) >= 0) {
        init[fd] = formData[fd] === undefined ? null : formData[fd];
      } else if (fd === 'special_mark' && formData.special_mark) {
        init.specialMark = formData.special_mark.split('/');
      } else if (fd === 'appl_cert_code' && formData.appl_cert_code) {
        const applCodes = formData.appl_cert_code.split(',');
        let names = '';
        applCodes.forEach((code) => {
          const cert = TRADE_ITEM_APPLY_CERTS.find(ce => ce.app_cert_code === code);
          if (!names) {
            names += cert.app_cert_name;
          } else {
            names += `,${cert.app_cert_name}`;
          }
        });
        init.appl_cert_name = names;
      } else if (['pre_classify_start_date', 'pre_classify_end_date'].indexOf(fd) >= 0) {
        init[fd] = !formData[fd] ? null : moment(formData[fd]);
      } else if (fd === 'goods_attr') {
        init[fd] = formData[fd] ? formData[fd].split(',') : [];
      } else {
        init[fd] = formData[fd] === undefined ? '' : formData[fd];
      }
    });
  }
  return init;
}

@injectIntl
@connect(
  state => ({
    currencies: state.saasParams.latest.currency,
    units: state.saasParams.latest.unit,
    tradeCountries: state.saasParams.latest.country,
    hscodeDataList: state.cmsHsCode.fuzzyHscodes,
    ciqList: state.cmsHsCode.hsCiqList,
  }),
  {
    loadLimitFuzzyHscodes,
    loadHscodeCiqList,
    getElementByHscode,
    showDeclElementsModal,
    toggleApplyCertsModal,
  }
)
export default class ItemMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ validateFields: PropTypes.func.isRequired }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.shape({ curr_code: PropTypes.string })),
    units: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    tradeCountries: PropTypes.arrayOf(PropTypes.shape({ cntry_co: PropTypes.string })),
    hscodeDataList: PropTypes.arrayOf(PropTypes.shape({ hscode: PropTypes.string.isRequired })),
    action: PropTypes.string.isRequired,
    itemData: PropTypes.shape({ cop_product_no: PropTypes.string }).isRequired,
    shareMethods: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = { fieldInits: {} }
  componentDidMount() {
    if (this.props.itemData.hscode) {
      this.props.loadHscodeCiqList(this.props.itemData.hscode);
    }
    this.props.shareMethods([this.transferFormValue]);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.itemData !== this.props.itemData && nextProps.itemData) {
      const fieldInits = getFieldInits(nextProps.itemData);
      this.setState({ fieldInits });
      const formInit = {};
      const formFieldKeys = Object.keys(this.props.form.getFieldsValue());
      Object.keys(fieldInits).forEach((fdi) => {
        if (formFieldKeys.indexOf(fdi) >= 0) {
          formInit[fdi] = fieldInits[fdi];
        }
      });
      this.props.form.setFieldsValue(formInit);
      if (nextProps.itemData.hscode) {
        this.props.loadLimitFuzzyHscodes(nextProps.itemData.hscode).then((result) => {
          if (!result.error) {
            const hscodeInst = result.data[0];
            this.handleHscodeFormField(hscodeInst, this.props.itemData.g_name, {
              unit_1: formInit.unit_1,
              unit_2: formInit.unit_2,
            });
          }
        });
        this.props.loadHscodeCiqList(nextProps.itemData.hscode);
      }
    }
    if (nextProps.ciqList !== this.props.ciqList) {
      const formCiqCode = this.props.form.getFieldValue('ciqcode');
      if (nextProps.ciqList.length === 1) {
        if (formCiqCode !== nextProps.ciqList[0].ciqcode) {
          this.props.form.setFieldsValue({ ciqcode: nextProps.ciqList[0].ciqcode });
        }
      }
    }
  }
  msg = formatMsg(this.props.intl)
  transferFormValue = () => {
    const fieldsValue = this.props.form.getFieldsValue();
    const specialMark = (fieldsValue.specialMark || []).join('/');
    const goodsAttr = (fieldsValue.goods_attr || []).join(',');
    const item = {
      ...this.props.itemData, ...fieldsValue, special_mark: specialMark, goods_attr: goodsAttr,
    };
    const ciqInfo = this.props.ciqList.find(cl => cl.ciqcode === item.ciqcode);
    if (ciqInfo) {
      item.ciqname = ciqInfo.ciqname;
    }
    return item;
  }
  handleHscodeFormField = (hscodeInst, itemGname, itemUnit) => {
    if (hscodeInst) {
      const hsField = {
        customs_control: hscodeInst.customs,
        inspection_quarantine: hscodeInst.inspection,
        mfn_rates: hscodeInst.mfn_rates,
        general_rates: hscodeInst.general_rates,
        provisional_rates: hscodeInst.provisional_rates,
        vat_rates: hscodeInst.vat_rates,
        gst_rates: hscodeInst.gst_rates,
        export_rates: hscodeInst.export_rates,
        export_rebate_rates: hscodeInst.export_rebate_rates,
      };
      if (!itemUnit || !itemUnit.unit_1) {
        const firstUnit = this.props.units.filter(unit => unit.unit_name === hscodeInst.first_unit
    || unit.unit_code === hscodeInst.first_unit)[0];
        hsField.unit_1 = firstUnit ? firstUnit.unit_code : '';
      }
      if (!itemUnit || !itemUnit.unit_2) {
        const secondUnit = this.props.units.filter(unit => unit.unit_name === hscodeInst.second_unit
|| unit.unit_code === hscodeInst.second_unit)[0];
        hsField.unit_2 = secondUnit ? secondUnit.unit_code : '';
      }
      if (!itemGname) {
        hsField.g_name = hscodeInst.product_name;
      }
      // if (newGmodel !== undefined && newGmodel !== null) {
      //  hsField.g_model = '';
      // }
      this.props.form.setFieldsValue(hsField);
    }
  }
  handleHscodeChange = (hscodeInput) => {
    if (hscodeInput && hscodeInput.length > 3) {
      const { form } = this.props;
      this.props.loadLimitFuzzyHscodes(hscodeInput).then((result) => {
        if (!result.error) {
          const hscodeInst = result.data.filter(hs => hs.hscode === hscodeInput)[0];
          const gname = form.getFieldValue('g_name');
          this.handleHscodeFormField(hscodeInst, gname);
        }
      });
      form.setFieldsValue({ ciqcode: '' });
      if (hscodeInput.length === 10) {
        this.props.loadHscodeCiqList(hscodeInput);
      }
    }
  }
  handleCopNoChange = (e) => {
    this.props.form.setFieldsValue({ src_product_no: e.target.value });
  }
  handleShowDeclElementModal = () => {
    const { form } = this.props;
    const { fieldInits } = this.state;
    this.props.getElementByHscode(form.getFieldValue('hscode')).then((result) => {
      if (!result.error) {
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          fieldInits.id,
          form.getFieldValue('g_model'),
          false,
          form.getFieldValue('g_name')
        );
      }
    });
  }
  handleShowApplyCertsModal = () => {
    this.props.toggleApplyCertsModal(true);
  }
  handleModalChange = (model) => {
    this.props.form.setFieldsValue({ g_model: model });
  }
  handleApplCertChange = (cert) => {
    this.props.form.setFieldsValue({ appl_cert_name: cert });
  }
  render() {
    const {
      form: { getFieldDecorator }, currencies, units, tradeCountries,
      hscodeDataList, action, ciqList,
    } = this.props;
    const { fieldInits } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      colon: false,
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
      colon: false,
    };
    /*
    const formItemSpan4Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
      colon: false,
    };
    */

    return (
      <FormPane>
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} defaultActiveKey={['itemProperties', 'itemClassification', 'itemTaxes', 'danger']}>
            <Panel header={this.msg('itemProperties')} key="itemProperties">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copProductNo')}>
                    {getFieldDecorator('cop_product_no', {
                  rules: [{ required: true, message: '商品货号必填' }],
                  initialValue: fieldInits.cop_product_no,
                })(<Input disabled={action !== 'create'} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('enName')}>
                    {getFieldDecorator('en_name', {
                  initialValue: fieldInits.en_name,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copCode')}>
                    {getFieldDecorator('cop_code', {
                  initialValue: fieldInits.cop_code,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('itemType')}>
                    {getFieldDecorator('item_type', {
                  initialValue: fieldInits.item_type,
                })(<Select mode="combobox" onChange={this.handleItemTypeChange}>
                  {CMS_TRADE_ITEM_TYPE.map(it =>
                    <Option key={it.value}>{it.text}</Option>)}
                </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copItemGroup')}>
                    {getFieldDecorator('cop_item_group', {
                  initialValue: fieldInits.cop_item_group,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copBrand')}>
                    {getFieldDecorator('cop_brand', {
                  initialValue: fieldInits.cop_brand,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copBU')}>
                    {getFieldDecorator('cop_bu', {
                  initialValue: fieldInits.cop_bu,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('copController')}>
                    {getFieldDecorator('cop_controller', {
                  initialValue: fieldInits.cop_controller,
                })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('processingMethod')}>
                    {getFieldDecorator('proc_method', {
                  initialValue: fieldInits.proc_method,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('materialIngredient')}>
                    {getFieldDecorator('material_ingred', {
                  initialValue: fieldInits.material_ingred,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('functionality')}>
                    {getFieldDecorator('functionality', {
                  initialValue: fieldInits.functionality,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('usage')}>
                    {getFieldDecorator('usage', {
                  initialValue: fieldInits.usage,
                })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemSpan2Layout} colon={false} label={this.msg('goodsAttr')}>
                    {getFieldDecorator('goods_attr', {
                  })(<Select showSearch showArrow optionFilterProp="children" mode="multiple" style={{ width: '100%' }}>
                    {CIQ_GOODS_ATTRS.map(ep => (
                      <Option key={ep.value} value={ep.value} >{ep.value} | {ep.text}</Option>))}
                  </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('efficiency')}>
                    {getFieldDecorator('efficiency', {
                  initialValue: fieldInits.efficiency,
                })(<Select
                  showSearch
                  optionFilterProp="children"
                >
                  {CMS_HS_EFFICIENCY.map(ef =>
                    <Option key={ef.value} value={ef.value}>{ef.text}</Option>)}
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('gDesc')}>
                    {getFieldDecorator('g_desc', {
                  initialValue: fieldInits.g_desc,
                })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('goodsSpec')}>
                    {getFieldDecorator('product_spec', { // 规格
                      initialValue: fieldInits.product_spec,
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('goodsSpec')}>
                    {getFieldDecorator('product_spec', { // 规格
                      initialValue: fieldInits.product_spec,
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header={this.msg('itemClassification')} key="itemClassification">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('hscode')}>
                    {getFieldDecorator('hscode', {
                  rules: [{ required: true, message: '商品编码必填' }, { max: 10 }],
                  initialValue: fieldInits.hscode,
                })(<Select allowClear mode="combobox" onChange={this.handleHscodeChange} >
                  { hscodeDataList.map(data => (<Option
                    value={data.hscode}
                    key={data.hscode}
                  >{data.hscode}
                  </Option>))}
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemSpan2Layout} label={this.msg('ciqCode')}>
                    {getFieldDecorator('ciqcode', {
                  initialValue: fieldInits.ciqcode,
                    })(<Select allowClear showSearch optionFilterProp="children">
                      {ciqList.map(item =>
                      (<Option key={item.ciqcode} value={item.ciqcode}>
                        {item.ciqcode} | {item.ciqname}
                      </Option>))}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('confidence')}>
                    {getFieldDecorator('confidence', {
                  initialValue: fieldInits.confidence,
                })(<Rate allowHalf />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemSpan2Layout} label={this.msg('gName')}>
                    {getFieldDecorator('g_name', {
                  initialValue: fieldInits.g_name,
                  rules: [{ required: true, message: '中文品名必填' }],
                })(<Input onChange={this.handleGNameChange} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemSpan2Layout} label={this.msg('gModel')}>
                    {getFieldDecorator('g_model', {
                  initialValue: fieldInits.g_model,
                      rules: [{ required: true, message: '规格型号必填' }, { validator: (rule, gmodel, cb) => validateDbcsLength(gmodel, 255, cb, '规范申报最多255字节') }],
                })(<Input addonAfter={<Button type="primary" ghost size="small" onClick={this.handleShowDeclElementModal}><Icon type="ellipsis" /></Button>} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('unit1')}>
                    {getFieldDecorator('unit_1', {
                  initialValue: fieldInits.unit_1,
                })(<Select showSearch disabled optionFilterProp="children">
                  {
                    units.map(gt =>
                      <Option key={gt.unit_code}>{gt.unit_code} | {gt.unit_name}</Option>)
                  }
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('unit2')}>
                    {getFieldDecorator('unit_2', {
                  initialValue: fieldInits.unit_2,
                })(<Select optionFilterProp="children"disabled showSearch>
                  {
                    units.map(gt =>
                      <Option key={gt.unit_code}>{gt.unit_code} | {gt.unit_name}</Option>)
                  }
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('gUnit1')}>
                    {getFieldDecorator('g_unit_1', {
                  initialValue: fieldInits.g_unit_1,
                })(<Select showSearch showArrow optionFilterProp="children">
                  {
                  units.map(gt =>
                    <Option key={gt.unit_code}>{gt.unit_code} | {gt.unit_name}</Option>)
                }
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('gUnit2')}>
                    {getFieldDecorator('g_unit_2', {
                  initialValue: fieldInits.g_unit_2,
                })(<Select showSearch showArrow optionFilterProp="children">
                  {
                  units.map(gt =>
                    <Option key={gt.unit_code}>{gt.unit_code} | {gt.unit_name}</Option>)
                }
                </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('unitNetWt')}>
                    {getFieldDecorator('unit_net_wt', {
                  initialValue: fieldInits.unit_net_wt,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('fixedQty')}>
                    {getFieldDecorator('fixed_qty', {
                  initialValue: fieldInits.fixed_qty,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('fixedUnit')}>
                    {getFieldDecorator('fixed_unit', {
                  initialValue: fieldInits.fixed_unit,
                })(<Select showSearch showArrow optionFilterProp="children">
                  {
                    units.map(gt => (<Option key={gt.unit_code} value={gt.unit_code}>
                      {gt.unit_code} | {gt.unit_name}</Option>))
              }
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('gUnit3')}>
                    {getFieldDecorator('g_unit_3', {
                  initialValue: fieldInits.g_unit_3,
                })(<Select showSearch showArrow allowClear optionFilterProp="children">
                  {
                  units.map(gt =>
                    <Option key={gt.unit_code}>{gt.unit_code} | {gt.unit_name}</Option>)
                }
                </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('unitPrice')}>
                    {getFieldDecorator('unit_price', {
                  initialValue: fieldInits.unit_price,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('currency')}>
                    {getFieldDecorator('currency', {
                  initialValue: fieldInits.currency,
                })(<Select showSearch showArrow allowClear optionFilterProp="children">
                  {
                  currencies.map(data => (
                    <Option key={data.curr_code}>{data.curr_code}|{data.curr_name}</Option>))}
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('origCountry')}>
                    {getFieldDecorator('origin_country', {
                  initialValue: fieldInits.origin_country,
                })(<Select showSearch showArrow allowClear optionFilterProp="children">
                  {
                  tradeCountries.map(data => (
                    <Option key={data.cntry_co} >{data.cntry_co}|{data.cntry_name_cn}</Option>))}
                </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('specialNo')}>
                    {getFieldDecorator('specialMark', {
                  initialValue: fieldInits.specialMark,
                })(<Select mode="multiple" style={{ width: '100%' }} >
                  { SPECIAL_COPNO_TERM.map(data => (<Option value={data.value} key={data.value}>
                    {data.text}</Option>))}
                </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('customsPermit')}>
                    {getFieldDecorator('customs_control', {
                  initialValue: fieldInits.customs_control,
                })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('ciqPermit')}>
                    {getFieldDecorator('inspection_quarantine', {
                  initialValue: fieldInits.inspection_quarantine,
                })(<Input disabled />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemSpan2Layout} label={this.msg('applCertCode')}>
                    {getFieldDecorator('appl_cert_name', {
                  initialValue: fieldInits.appl_cert_name,
                })(<Input addonAfter={<Button type="primary" ghost size="small" onClick={this.handleShowApplyCertsModal}><Icon type="ellipsis" /></Button>} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('preClassifyNo')}>
                    {getFieldDecorator('pre_classify_no', {
                  initialValue: fieldInits.pre_classify_no,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('preClassifyStartDate')}>
                    {getFieldDecorator('pre_classify_start_date', {
                  initialValue: fieldInits.pre_classify_start_date,
                })(<DatePicker style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('preClassifyEndDate')}>
                    {getFieldDecorator('pre_classify_end_date', {
                  initialValue: fieldInits.pre_classify_end_date,
                })(<DatePicker style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('remark')}>
                    {getFieldDecorator('remark', {
                  initialValue: fieldInits.remark,
                })(<Input.TextArea autosize={{ minRows: 1, maxRows: 16 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header={this.msg('extendAttrib')} key="extendAttrib">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib1')}>
                    {getFieldDecorator('attrib1', {
                  initialValue: fieldInits.attrib1,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib2')}>
                    {getFieldDecorator('attrib2', {
                  initialValue: fieldInits.attrib2,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib3')}>
                    {getFieldDecorator('attrib3', {
                  initialValue: fieldInits.attrib3,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib4')}>
                    {getFieldDecorator('attrib4', {
                  initialValue: fieldInits.attrib4,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib5')}>
                    {getFieldDecorator('attrib5', {
                  initialValue: fieldInits.attrib5,
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('attrib6')}>
                    {getFieldDecorator('attrib6', {
                  initialValue: fieldInits.attrib6,
                })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header={this.msg('itemTaxes')} key="itemTaxes">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('mfnRates')}>
                    {getFieldDecorator('mfn_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('generalRates')}>
                    {getFieldDecorator('general_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('provisionalRates')}>
                    {getFieldDecorator('provisional_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('vatRates')}>
                    {getFieldDecorator('vat_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('gstRates')}>
                    {getFieldDecorator('gst_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('exportRates')}>
                    {getFieldDecorator('export_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('exportRebateRates')}>
                    {getFieldDecorator('export_rebate_rates', {
                })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header={this.msg('dangerInfo')} key="danger">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label={this.msg('nonDangerChemical')}>
                    {getFieldDecorator('danger_flag', {
                    })(<Select style={{ width: '100%' }} allowClear>
                      <Option key="1" value="1">非危险化学品</Option>
                      <Option key="0" value="0">危险化学品</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} colon={false} label={this.msg('dangUnCode')}>
                    {getFieldDecorator('danger_uncode', {
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} colon={false} label={this.msg('dangName')}>
                    {getFieldDecorator('danger_name', {
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} colon={false} label={this.msg('dangPackType')}>
                    {getFieldDecorator('danger_pack_type', {
                    })(<Select style={{ width: '100%' }} allowClear>
                      {CIQ_DANGER_PACK_TYPE.map(type =>
                        <Option key={type.value} value={type.value}>{type.text}</Option>)}
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} colon={false} label={this.msg('dangPackSpec')}>
                    {getFieldDecorator('danger_pack_spec', {
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Card>
        <DeclElementsModal onOk={this.handleModalChange} />
        <ApplyCertsModal
          itemId={this.props.itemData.id}
          selectedRowKeys={fieldInits.appl_cert_code}
          onOk={this.handleApplCertChange}
        />
      </FormPane>
    );
  }
}
