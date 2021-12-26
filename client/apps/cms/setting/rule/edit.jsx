import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import { Form, Layout, Button, message, Mention, Collapse, Tabs } from 'antd';
import { saveTemplateData, countFieldsChange, changeTempInfo, loadTemplateFormVals } from 'common/reducers/cmsManifest';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import InfoItem from 'client/components/InfoItem';
import ButtonToggle from 'client/components/ButtonToggle';
import MagicCard from 'client/components/MagicCard';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import HeadRulesPane from './tabpane/headRulesPane';
import ImportRulesPane from './tabpane/importRulesPane';
import MergeSplitRulesPane from './tabpane/mergeSplitRulesPane';
import TemplateUsersPane from './tabpane/templateUsersPane';
import { formatMsg } from '../../message.i18n';

const { Content, Sider } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

function fetchData({ dispatch, params }) {
  return dispatch(loadTemplateFormVals(params.id));
}
function getFieldInits(formData) {
  const init = {
    mergeOpt_arr: [],
    specialHsSortArr: [],
    splHsMergeArr: [],
    splNoMergeArr: [],
    rule_goods_attr: [],
  };
  if (formData) {
    ['rule_currency', 'rule_orig_country', 'rule_net_wt',
    ].forEach((fd) => {
      init[fd] = formData[fd] ? formData[fd] : '1';
    });
    ['rule_g_name', 'rule_g_unit'].forEach((fd) => {
      init[fd] = formData[fd] ? formData[fd] : '0';
    });
    ['rule_dest_country', 'rule_duty_mode', 'rule_district_code',
      'rule_district_region', 'rule_purpose'].forEach((fd) => {
      init[fd] = formData[fd] ? formData[fd] : '';
    });
    if (formData.rule_goods_attr) {
      init.rule_goods_attr = formData.rule_goods_attr.split(',');
    }
    init.rule_gunit_num = formData.rule_gunit_num ? formData.rule_gunit_num : 'g_unit_1';
    init.rule_element = formData.rule_element ? formData.rule_element : '$g_model';
    if (formData.merge_byhscode) {
      init.mergeOpt_arr.push('byHsCode');
    }
    if (formData.merge_bygname) {
      init.mergeOpt_arr.push('byGName');
    }
    if (formData.merge_bycurr) {
      init.mergeOpt_arr.push('byCurr');
    }
    if (formData.merge_bycountry) {
      init.mergeOpt_arr.push('byCountry');
    }
    if (formData.merge_bycopgno) {
      init.mergeOpt_arr.push('byCopGNo');
    }
    if (formData.merge_bygunit) {
      init.mergeOpt_arr.push('byGUnit');
    }
    if (formData.merge_byengno) {
      init.mergeOpt_arr.push('byEmGNo');
    }
    if (formData.merge_byentryno) {
      init.mergeOpt_arr.push('byEntryNo');
    }
    if (formData.merge_bydistrict) {
      init.mergeOpt_arr.push('byDistrict');
    }
    if (formData.split_spl_category) {
      const splArr = formData.split_spl_category.split(',');
      splArr.forEach((data) => {
        const numData = Number(data);
        init.specialHsSortArr.push(numData);
      });
    }
    if (formData.merge_spl_hs) {
      const splArr = formData.merge_spl_hs.split(',');
      splArr.forEach((data) => {
        const numData = Number(data);
        init.splHsMergeArr.push(numData);
      });
    }
    if (formData.merge_spl_no) {
      init.splNoMergeArr = formData.merge_spl_no.split(',');
    }
    init.sort_dectotal = formData.sort_dectotal ? String(formData.sort_dectotal) : '0';
    ['merge_checked', 'sort_hscode', 'sort_customs', 'split_splcopgno', 'split_hscode', 'split_ciqdecl', 'split_applcert',
      'split_curr', 'split_dutymode', 'split_containerno', 'split_exportprefer',
      'set_special_code', 'set_merge_split', 'merge_multi_prdcount_mark', 'merge_bysplhs', 'merge_bysplno',
      'gen_invoice', 'gen_packing_list', 'gen_contract'].forEach((fd) => {
      init[fd] = !!formData[fd];
    });
    ['invoice_template_id', 'packing_list_template_id', 'contract_template_id'].forEach((fd) => {
      init[fd] = formData[fd];
    });
    init.split_percount = formData.split_percount ? formData.split_percount.toString() : '20';
  }
  return init;
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    template: state.cmsManifest.template,
    ietype: state.cmsManifest.template.ietype,
    templateName: state.cmsManifest.template.template_name,
    formData: state.cmsManifest.formData,
    fieldInits: getFieldInits(state.cmsManifest.formData),
    changeTimes: state.cmsManifest.changeTimes,
  }),
  {
    saveTemplateData, countFieldsChange, changeTempInfo, getBlBookNosByType,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@Form.create({ onFieldsChange: (props, values) => props.countFieldsChange(values) })
export default class ManifestTemplate extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']),
    form: PropTypes.shape({ getFieldValue: PropTypes.func }).isRequired,
    template: PropTypes.shape({
      id: PropTypes.number.isRequired,
      template_name: PropTypes.string,
    }).isRequired,
    operation: PropTypes.string.isRequired,
    changeTimes: PropTypes.number,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    rightSidercollapsed: true,
    changed: false,
  }

  componentDidMount() {
    this.props.getBlBookNosByType();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.changeTimes !== nextProps.changeTimes) {
      this.setState({ changed: true });
    }
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const { template, fieldInits, formData } = this.props;
    let element = this.props.form.getFieldValue('rule_element') || fieldInits.rule_element;
    if (typeof element !== 'string') {
      element = Mention.toString(element);
    }
    const mergeOptArr = this.props.form.getFieldValue('mergeOpt_arr') || fieldInits.mergeOpt_arr;
    const specialHsSortArr = this.props.form.getFieldValue('split_spl_category') || fieldInits.specialHsSortArr;
    const splHsMergeArr = this.props.form.getFieldValue('merge_spl_hs') || fieldInits.splHsMergeArr;
    const splNoMergeArr = this.props.form.getFieldValue('merge_spl_no') || fieldInits.splNoMergeArr;
    const mergeObj = {
      merge_byhscode: 0,
      merge_bygname: 0,
      merge_bycurr: 0,
      merge_bycountry: 0,
      merge_bycopgno: 0,
      merge_bygunit: 0,
      merge_byengno: 0,
      merge_byentryno: 0,
      merge_bydistrict: 0,
    };
    mergeOptArr.forEach((mergeOpt) => {
      if (mergeOpt === 'byHsCode') {
        mergeObj.merge_byhscode = 1;
      } else if (mergeOpt === 'byGName') {
        mergeObj.merge_bygname = 1;
      } else if (mergeOpt === 'byCurr') {
        mergeObj.merge_bycurr = 1;
      } else if (mergeOpt === 'byCountry') {
        mergeObj.merge_bycountry = 1;
      } else if (mergeOpt === 'byCopGNo') {
        mergeObj.merge_bycopgno = 1;
      } else if (mergeOpt === 'byGUnit') {
        mergeObj.merge_bygunit = 1;
      } else if (mergeOpt === 'byEmGNo') {
        mergeObj.merge_byengno = 1;
      } else if (mergeOpt === 'byEntryNo') {
        mergeObj.merge_byentryno = 1;
      } else if (mergeOpt === 'byDistrict') {
        mergeObj.merge_bydistrict = 1;
      }
    });
    if (this.props.form.getFieldValue('merge_check_radio')) {
      mergeObj.merge_checked = true;
    } else if (this.props.form.getFieldValue('merge_uncheck_radio')) {
      mergeObj.merge_checked = false;
    } else {
      mergeObj.merge_checked = fieldInits.merge_checked;
    }
    let specialHsSorts = '';
    if (specialHsSortArr) {
      specialHsSorts = specialHsSortArr.join(',');
    }
    let splHsMergeSorts = '';
    if (splHsMergeArr) {
      splHsMergeSorts = splHsMergeArr.join(',');
    }
    let splNoMergeSorts = '';
    if (splNoMergeArr) {
      splNoMergeSorts = splNoMergeArr.join(',');
    }
    const head = {
      ...formData,
      ...mergeObj,
    };
    const newFormValues = this.props.form.getFieldsValue();
    Object.keys(newFormValues).forEach((fk) => {
      if (newFormValues[fk] || newFormValues[fk] === 0 || newFormValues[fk] === false) {
        head[fk] = newFormValues[fk];
      } else {
        head[fk] = null;
      }
    });
    head.rule_element = element;
    head.split_spl_category = specialHsSorts;
    head.merge_spl_hs = splHsMergeSorts;
    head.merge_spl_no = splNoMergeSorts;
    head.spec_decl_flag = newFormValues.spec_decl_flag && newFormValues.spec_decl_flag.join(',');
    head.decl_matters = newFormValues.decl_matters && newFormValues.decl_matters.join(',');
    head.rule_goods_attr = newFormValues.rule_goods_attr && newFormValues.rule_goods_attr.join(',');
    this.props.saveTemplateData({ head, templateId: template.id }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.setState({ changed: false });
        message.info('保存成功');
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }
  handleTempInfoChange = (val, field) => {
    const change = {};
    change[field] = val;
    this.props.changeTempInfo({ change, templateId: this.props.template.id });
  }
  toggleRightSider = () => {
    this.setState({
      rightSidercollapsed: !this.state.rightSidercollapsed,
    });
  }
  render() {
    const {
      form, ietype, templateName, formData, template, operation, fieldInits,
    } = this.props;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('制单规则'),
            templateName,
          ]}
        >
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <Button type="primary" icon="save" onClick={this.handleSave} disabled={!this.state.changed}>
              {this.msg('save')}
            </Button>
            <ButtonToggle
              iconOn="setting"
              iconOff="setting"
              onClick={this.toggleRightSider}
            />
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <Content className="page-content">
            <MagicCard
              bodyStyle={{ padding: 0 }}
              loading={this.props.manifestSpinning}

            >
              <Tabs>
                <TabPane tab="清单表头规则" key="head">
                  <HeadRulesPane ietype={ietype} form={form} formData={formData} />
                </TabPane>
                <TabPane tab="特殊字段规则" key="importRules">
                  <ImportRulesPane ietype={ietype} form={form} formData={fieldInits} />
                </TabPane>
                <TabPane tab="单据生成规则" key="mergeSplitRules">
                  <MergeSplitRulesPane form={form} formData={fieldInits} />
                </TabPane>
              </Tabs>
            </MagicCard>
          </Content>
          <Sider
            trigger={null}
            defaultCollapsed
            collapsible
            collapsed={this.state.rightSidercollapsed}
            width={380}
            collapsedWidth={0}
            className="right-sider"
          >
            <div className="right-sider-panel">
              <Collapse accordion defaultActiveKey="properties">
                <Panel header="模板属性" key="properties">
                  <InfoItem label="模板名称" field={templateName} dataIndex="template_name" placeholder="模板名称" editable onEdit={this.handleTempInfoChange} />
                </Panel>
                <Panel header="授权使用单位" key="user">
                  <TemplateUsersPane template={template} operation={operation} />
                </Panel>
              </Collapse>
            </div>
          </Sider>
        </Layout>
      </Layout>
    );
  }
}
