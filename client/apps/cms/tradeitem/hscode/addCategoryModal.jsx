import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Select, Row, Col, Input, Card } from 'antd';
import { addHsCodeCategory, updateHsCodeCategory, loadCategoryHsCode, toggleCategoryModal } from 'common/reducers/cmsHsCode';
import { INSPECTIONS, DECL_TYPE } from 'common/constants';
import { formatMsg } from '../message.i18n';
import './style.less';

const { Option } = Select;
const InputGroup = Input.Group;
const FormItem = Form.Item;

@injectIntl
@connect(state => ({
  categoryModal: state.cmsHsCode.categoryModal,
  categoryHscodes: state.cmsHsCode.categoryHscodes,
  certMark: state.saasParams.latest.certMark.map(f => ({ value: f.cert_code, text: f.cert_spec })),
  listFilter: state.cmsHsCode.categoryHsListFilter,
  tradeMode: state.saasParams.latest.tradeMode.map(f => ({
    value: f.trade_mode,
    text: f.trade_abbr,
  })),
}), {
  addHsCodeCategory,
  updateHsCodeCategory,
  loadCategoryHsCode,
  toggleCategoryModal,
})

@Form.create()
export default class AddCategoryModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    categoryModal: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
    }).isRequired,
  }
  state = {
    categoryList: [],
  }
  componentWillReceiveProps(nextProps) {
    const nextRule = nextProps.categoryModal.hscodeCategory.judgment_rule;
    if (nextRule && nextRule !== this.props.categoryModal.hscodeCategory.judgment_rule) {
      this.handleSetCategoryList(nextRule);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleCategoryModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const fieldArr = [];
        ['ent_qualif', 'ciq_user', 'ciq_element', 'applcert', 'g_ciq_model',
          'certmark', 'goods_limit', 'danger_flag', 'goods_attr'].forEach(f => values[f] && fieldArr.push(f));
        const hscodeCategory = {
          name: values.name,
          type: 'ciq',
          judgment_rule: values.judgment_rule,
          required_fields: fieldArr.join(','),
          match_rule_type: values.match_rule_type ? values.match_rule_type.join(',') : null,
          scope_decl_way: values.scope_decl_way.join(','),
          scope_trade_mode: values.scope_trade_mode.join(','),
          sub_ciqmodel: values.sub_ciqmodel.join(','),
        };
        const categoryId = this.props.categoryModal.hscodeCategory.id;
        let prom;
        if (categoryId) {
          prom = this.props.updateHsCodeCategory(categoryId, hscodeCategory);
        } else {
          prom = this.props.addHsCodeCategory(hscodeCategory);
        }
        prom.then((result) => {
          if (!result.error) {
            const { categoryHscodes: { current, pageSize }, listFilter } = this.props;
            this.props.loadCategoryHsCode({ current, pageSize, listFilter: { ...listFilter, search: '' } });
            this.handleCancel();
          }
        });
      }
    });
  }
  handleSetCategoryList = (value) => {
    let categoryList;
    switch (value) {
      case 'inspection':
        categoryList = INSPECTIONS;
        break;
      case 'customs':
        categoryList = this.props.certMark;
        break;
      default:
        categoryList = [];
        break;
    }
    this.setState({ categoryList });
  }
  handleJudgmentRuleChange = (value) => {
    this.props.form.setFieldsValue({ match_rule_type: [] });
    this.handleSetCategoryList(value);
  }
  handleRequiredFieldsChange = (value, changeField) => {
    if (!value) {
      this.props.form.setFieldsValue({ [changeField]: [] });
    }
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, categoryModal: { visible, hscodeCategory },
      tradeMode,
    } = this.props;
    if (!visible) return null;
    const { categoryList } = this.state;
    const requiredFields = hscodeCategory.required_fields;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const formItemLayout2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Modal
        maskClosable={false}
        title={this.msg('addCategory')}
        visible={visible}
        width={700}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('categoryName')}>
                {getFieldDecorator('name', {
                  initialValue: hscodeCategory.name,
                  rules: [{ required: true, message: '分类名称必填' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('judgmentRule')}>
                {getFieldDecorator('judgment_rule', {
                  initialValue: hscodeCategory.judgment_rule,
                  rules: [{ required: true, message: '判断规则必选' }],
                  onChange: this.handleJudgmentRuleChange,
                })(<Select allowClear>
                  <Option key="inspection" value="inspection">{this.msg('inspection')}</Option>
                  <Option key="customs" value="customs">{this.msg('customsControl')}</Option>
                  <Option key="hscode" value="hscode">{this.msg('hscodeRange')}</Option>
                </Select>)}
              </FormItem>
            </Col>
            {!!categoryList.length &&
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('selectRuleType')}>
                {getFieldDecorator('match_rule_type', {
                  rules: [{ required: !!categoryList.length, message: '请选择类别' }],
                  initialValue: hscodeCategory.match_rule_type ? hscodeCategory.match_rule_type.split(',') : [],
                })(<Select
                  allowClear
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                >
                  {categoryList.map(f => (<Option key={f.value} value={f.value}>{`${f.value}|${f.text}`}</Option>))}
                </Select>)}
              </FormItem>
            </Col>}
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('declWay')}>
                {getFieldDecorator('scope_decl_way', {
                  initialValue: hscodeCategory.scope_decl_way ? hscodeCategory.scope_decl_way.split(',') : [],
                  rules: [{ required: true, message: '请选择报关类型判断范围' }],
                })(<Select allowClear mode="multiple">{/* 必填校验暂不考虑出口和出境的情况 */}
                  <Option key={DECL_TYPE[0].key} value={DECL_TYPE[0].key}>
                    {DECL_TYPE[0].value}
                  </Option>
                  <Option key={DECL_TYPE[1].key} value={DECL_TYPE[1].key}>
                    {DECL_TYPE[1].value}
                  </Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={this.msg('tradeMode')}>
                {getFieldDecorator('scope_trade_mode', {
                  initialValue: hscodeCategory.scope_trade_mode ? hscodeCategory.scope_trade_mode.split(',') : [],
                  rules: [{ required: true, message: '请选择监管方式判断范围' }],
                })(<Select
                  allowClear
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                >
                  {tradeMode.map(f =>
                    (<Option key={f.value} value={f.value}>{f.value}|{f.text}</Option>))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Card
            title={this.msg('requiredFieldsConfig')}
            bordered={false}
            headStyle={{ fontWeight: 600, padding: 0 }}
            bodyStyle={{ padding: '16px 0 0' }}
            className="customs-label-break"
          >
            <FormItem {...formItemLayout2} label={this.msg('entQualif')}>
              <InputGroup compact>
                {getFieldDecorator('ent_qualif', {
                  initialValue: requiredFields && requiredFields.includes('ent_qualif') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('declUser')}>
              <InputGroup compact>
                {getFieldDecorator('ciq_user', {
                  initialValue: requiredFields && requiredFields.includes('ciq_user') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('certNeeded')}>
              <InputGroup compact>
                {getFieldDecorator('ciq_element', {
                  initialValue: requiredFields && requiredFields.includes('ciq_element') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('applCert')}>
              <InputGroup compact>
                {getFieldDecorator('applcert', {
                  initialValue: requiredFields && requiredFields.includes('applcert') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('goodsSpecHint')}>
              <InputGroup compact>
                {getFieldDecorator('g_ciq_model', {
                  initialValue: requiredFields && requiredFields.includes('g_ciq_model') ? 1 : 0,
                  onChange: value => this.handleRequiredFieldsChange(value, 'sub_ciqmodel'),
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                {getFieldDecorator('sub_ciqmodel', {
                  rules: [{ required: !!getFieldValue('g_ciq_model'), message: '货物规格子项至少选择一项' }],
                  initialValue: hscodeCategory.sub_ciqmodel ? hscodeCategory.sub_ciqmodel.split(',') : [],
                })(<Select
                  allowClear
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择需要校验的货物规格子项信息"
                  style={{ width: '75%' }}
                  disabled={!getFieldValue('g_ciq_model')}
                >
                  <Option key="stuff" value="stuff">{this.msg('stuff')}</Option>
                  <Option key="expiry_date" value="expiry_date">{this.msg('expiryDate')}</Option>
                  <Option key="warranty_days" value="warranty_days">{this.msg('prodQgp')}</Option>
                  <Option key="oversea_manufcr_name" value="oversea_manufcr_name">{this.msg('overseaManufacture')}</Option>
                  <Option key="product_spec" value="product_spec">{this.msg('goodsSpec')}</Option>
                  <Option key="product_model" value="product_model">{this.msg('ciqProductNo')}</Option>
                  <Option key="brand" value="brand">{this.msg('goodsBrand')}</Option>
                  <Option key="produce_date" value="produce_date">{this.msg('produceDate')}</Option>
                  <Option key="external_lot_no" value="external_lot_no">{this.msg('productBatchLot')}</Option>
                  <Option key="manufcr_regno" value="manufcr_regno">{this.msg('manufcrRegNo')}</Option>
                  <Option key="manufcr_regname" value="manufcr_regname">{this.msg('manufcrRegName')}</Option>
                </Select>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('attachedCerts')}>
              <InputGroup compact>
                {getFieldDecorator('certmark', {
                  initialValue: requiredFields && requiredFields.includes('certmark') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('goodsLicence')}>
              <InputGroup compact>
                {getFieldDecorator('goods_limit', {
                  initialValue: requiredFields && requiredFields.includes('goods_limit') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('dangerFlag')}>
              <InputGroup compact>
                {getFieldDecorator('danger_flag', {
                  initialValue: requiredFields && requiredFields.includes('danger_flag') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout2} label={this.msg('goodsAttr')}>
              <InputGroup compact>
                {getFieldDecorator('goods_attr', {
                  initialValue: requiredFields && requiredFields.includes('goods_attr') ? 1 : 0,
                })(<Select style={{ width: '20%' }}>
                  <Option value={0}>不必填</Option>
                  <Option value={1}>必填</Option>
                </Select>)}
                <Input style={{ width: '75%' }} disabled value="暂未开放配置" />
              </InputGroup>
            </FormItem>
          </Card>
        </Form>
      </Modal>
    );
  }
}

