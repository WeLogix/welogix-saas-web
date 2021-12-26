import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Icon, Layout, Menu, Dropdown, Button, Row, Col, message, Modal, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import SidePanel from 'client/components/SidePanel';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { getReportConfig, saveReportConfig, setRptEdited, previewReport } from 'common/reducers/disReport';
import {
  TRANS_MODES, INV_SHIPRECV_STATUS, CMS_DECL_STATUS, DECL_TYPE, CMS_DECL_CHANNEL, CMS_FEE_UNIT,
  CMS_DECL_TYPE, CMS_ENTRY_TYPE, CMS_BILL_TYPE, PARTNER_ROLES, PAAS_DW_OBJECT_MSG, INSPECT_STATUS,
  CMS_DECL_MOD_TYPE,
} from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import MetaFieldDragSource from './dragComponents/metaFieldDragSource';
import RptBoxDropTarget from './dragComponents/rptBoxDropTarget';
import FilterBox from '../common/filterBox';
import ExportButton from '../common/reportExportButton';
import GroupBox from './editor/groupBox';
import ColumnConfigPane from './editor/columnConfigPane';
import ReportColumnPane from './editor/reportColumnPane';
import './index.less';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    currentReport: state.disReport.currentReport,
    whereClauses: state.disReport.currentReport.whereClauses,
    configs: state.disReport.currentReport.configs,
    reportObjectMeta: state.disReport.reportObjectMeta,
    loading: state.disReport.reportListLoading,
    deleteSqlAttrIds: state.disReport.deleteSqlAttrIds,
    edited: state.disReport.edited,
    previewed: state.disReport.previewed,
    rptParams: {
      certMark: state.saasParams.latest.certMark.map(item =>
        ({ value: item.cert_code, text: item.cert_spec })),
      ciqOrganization: state.saasParams.latest.ciqOrganization.map(item =>
        ({ value: item.org_code, text: item.org_name })),
      cnport: state.saasParams.latest.cnport.map(item =>
        ({ value: item.port_code, text: item.port_name })),
      cnregion: state.saasParams.latest.cnregion.map(item =>
        ({ value: item.region_code, text: item.region_name })),
      country: state.saasParams.latest.country.map(item =>
        ({ value: item.cntry_co, text: item.cntry_name_cn })),
      currency: state.saasParams.latest.currency.map(item =>
        ({ value: item.curr_code, text: item.curr_name })),
      customs: state.saasParams.latest.customs.map(item =>
        ({ value: item.customs_code, text: item.customs_name })),
      district: state.saasParams.latest.district.map(item =>
        ({ value: item.district_code, text: item.district_name })),
      origPlace: state.saasParams.latest.origPlace.map(item =>
        ({ value: item.place_code, text: item.place_name })),
      port: state.saasParams.latest.port.map(item =>
        ({ value: item.port_code, text: item.port_c_cod })),
      remissionMode: state.saasParams.latest.remissionMode.map(item =>
        ({ value: item.rm_mode, text: item.rm_abbr })),
      tradeMode: state.saasParams.latest.tradeMode.map(item =>
        ({ value: item.trade_mode, text: item.trade_abbr })),
      transMode: state.saasParams.latest.transMode.map(item =>
        ({ value: item.trans_code, text: item.trans_spec })),
      trxnMode: state.saasParams.latest.trxnMode.map(item =>
        ({ value: item.trx_mode, text: item.trx_spec })),
      unit: state.saasParams.latest.unit.map(item =>
        ({ value: item.unit_code, text: item.unit_name })),
      exemptionWay: state.saasParams.latest.exemptionWay.map(item =>
        ({ value: item.value, text: item.text })),
      wrapType: state.saasParams.latest.wrapType.map(item =>
        ({ value: item.value, text: item.text })),
      intlTransMode: TRANS_MODES,
      invShipRecv: INV_SHIPRECV_STATUS,
      ieflag: [{
        value: 1,
        text: '进口',
      }, {
        value: 2,
        text: '出口',
      }],
      inspectResultKind: [{
        value: 'released',
        text: '放行',
      }, {
        value: 'caught',
        text: '待处理',
      }],
      declStatus: Object.keys(CMS_DECL_STATUS).map(dsk => ({
        value: CMS_DECL_STATUS[dsk].value,
        text: CMS_DECL_STATUS[dsk].text,
      })),
      declWay: DECL_TYPE,
      declChannel: Object.keys(CMS_DECL_CHANNEL).map(dck => ({
        value: CMS_DECL_CHANNEL[dck].value,
        text: CMS_DECL_CHANNEL[dck].text,
      })),
      ediDeclType: CMS_DECL_TYPE,
      cdfFlag: CMS_ENTRY_TYPE,
      ftzFlag: CMS_BILL_TYPE,
      cmsIEFlag: [{
        value: 0,
        text: '进口',
      }, {
        value: 1,
        text: '出口',
      }],
      declFeeMark: CMS_FEE_UNIT,
      paasFlow: state.scofFlow.partnerFlows.map(fl => ({
        value: String(fl.id),
        text: fl.name,
      })),
      userMember: state.account.userMembers.map(member =>
        ({ value: member.login_id, text: member.name })),
      customer: state.partner.partners.filter(p => p.role === PARTNER_ROLES.CUS).map(p =>
        ({ value: p.id, text: [p.partner_code, p.name].filter(pt => pt).join('|') })),
      vendor: state.partner.partners.filter(p => p.role === PARTNER_ROLES.VEN).map(p =>
        ({ value: p.id, text: [p.partner_code, p.name].filter(pt => pt).join('|') })),
      supplier: state.partner.partners.filter(p => p.role === PARTNER_ROLES.SUP).map(p =>
        ({ value: p.id, text: p.partner_code || p.name })),
      inspectStatus: Object.keys(INSPECT_STATUS).map(key => ({
        value: INSPECT_STATUS[key].value,
        text: INSPECT_STATUS[key].text,
      })),
      declModStatus: CMS_DECL_MOD_TYPE.map(type => ({
        value: type.value,
        text: type.text,
      })),
    },
  }),
  {
    getReportConfig,
    saveReportConfig,
    loadPartners,
    setRptEdited,
    loadPartnerFlowList,
    previewReport,
  },
)
@WithDragDropContext
@connectNav({
  depth: 3,
  moduleName: 'dis',
  title: 'featDisReport',
})
export default class ReportConfig extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    whereClauseFieldsLists: [[
    ]], // [{ field: string, compareCondition: string, value: [string, number] }]
    groupByFields: [],
    sqlAttributes: [], //  {bizObject: string, field:string}[]
    labelSearch: '',
    exportDisable: true,
    tabKey: 'dataRange',
  }
  componentDidMount() {
    this.handleReportConfigLoad();
    this.props.loadPartners();
    this.props.loadPartnerFlowList({ simple: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentReport !== this.props.currentReport) {
      const report = nextProps.currentReport;
      let groupByFields = [];
      let sqlAttributes = [];
      for (let i = 0, len = report.configs.length; i < len; i++) {
        const { attrs, groupBys, objName } = report.configs[i];
        if (groupBys) {
          groupByFields = groupByFields.concat(groupBys.map(groupByStr => ({
            field: groupByStr, bizObject: objName,
          })));
        }
        if (attrs) {
          sqlAttributes = sqlAttributes.concat(attrs.map(attrStr => ({
            field: attrStr.sql_field,
            bizObject: objName,
            id: attrStr.id,
            sub_query_field: attrStr.sub_query_field,
            order_by: attrStr.order_by,
            column_seq: attrStr.column_seq,
            column_name: attrStr.column_name,
          })));
        }
      }
      sqlAttributes.sort((a, b) => a.column_seq - b.column_seq);
      sqlAttributes.push({});
      const rptState = {
        groupByFields,
        sqlAttributes,
      };
      if (report.whereClauses.length > 0) {
        rptState.whereClauseFieldsLists = report.whereClauses.map(whereClausesList =>
          whereClausesList.map(list => ({ ...list, effective: true })));
      }
      this.setState(rptState);
    }
  }
  handleReportConfigLoad = () => {
    this.props.getReportConfig(this.props.params.id);
  }
  msg = formatMsg(this.props.intl);
  dataTypeToWords = {
    TEXT: this.msg('textFields'),
    DATE: this.msg('dateFields'),
    NUMBER: this.msg('numberFields'),
    PARAM: this.msg('paramFields'),
  }
  handleAdd = () => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists.push([]);
    this.setState({
      whereClauseFieldsLists,
    });
  }
  handleFilterChange = (filterList, index) => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists[index] = filterList;
    this.setState({
      whereClauseFieldsLists,
    });
    this.props.setRptEdited(true);
  }
  handleFilterDelete = (index) => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists.splice(index, 1);
    this.setState({
      whereClauseFieldsLists: whereClauseFieldsLists.map((list, listIndex) =>
        list.map(item => ({ ...item, rpt_wherecls_seq: listIndex }))),
    });
    this.props.setRptEdited(true);
  }
  handleGroupFieldsChange = (groupByFields) => {
    this.setState({
      groupByFields,
    });
    this.props.setRptEdited(true);
  }
  handleReportFieldChange = (sqlAttributes) => {
    this.setState({
      sqlAttributes,
    });
    this.props.setRptEdited(true);
  }
  handleConfirmSave = () => {
    Modal.confirm({
      title: this.msg('报表内容已修改,保存后将更新数据,请确认!'),
      onOk: () => {
        this.handleSave();
      },
    });
  }
  handleSave = () => {
    const {
      whereClauseFieldsLists, groupByFields, sqlAttributes,
    } = this.state;
    const { reportObjectMeta, deleteSqlAttrIds, currentReport } = this.props;
    const contentLog = [];
    const originGroupBys = [];
    const originAttrs = [];
    for (let i = 0; i < currentReport.configs.length; i++) {
      const config = currentReport.configs[i];
      if (config.groupBys) {
        config.groupBys.forEach((field) => {
          originGroupBys.push({ bizObject: config.objName, field });
        });
      }
      if (config.attrs.length > 0) {
        config.attrs.forEach((attr) => {
          originAttrs.push(attr);
        });
      }
    }
    const newAttrs = sqlAttributes.filter(attr => !(originAttrs.find(item =>
      (item.sql_field === attr.field) && (item.rpt_object === attr.bizObject))));
    const delelteAttrs = originAttrs.filter(item =>
      deleteSqlAttrIds.find(id => id === item.id));
    const modifiedAttrs = sqlAttributes.filter(attr => attr.id && attr.update);
    if (newAttrs.length > 0) {
      contentLog.push(`添加报表数据列, [${newAttrs.map(attr => `${attr.column_name || attr.label}`).join(',')}]`);
    }
    if (delelteAttrs.length > 0) {
      contentLog.push(`删除报表数据列, [${delelteAttrs.map(attr => `${attr.column_name ||
        reportObjectMeta[attr.rpt_object].find(item =>
          item.bm_field === attr.sql_field).bmf_label_name}`).join(',')}]`);
    }
    for (let i = 0; i < modifiedAttrs.length; i++) {
      const log = [];
      const attr = modifiedAttrs[i];
      const originAttr = originAttrs.find(oa => oa.id === attr.id);
      const originAttrName = originAttr.column_name ||
      reportObjectMeta[originAttr.rpt_object].find(item =>
        item.bm_field === originAttr.sql_field).bmf_label_name;
      if (attr.column_name !== originAttrName && attr.column_name) {
        log.push(`列名由 [${originAttrName}]改为[${attr.column_name}]`);
      }
      if (attr.order_by !== originAttr.order_by) {
        let value = '';
        let oldValue = '';
        if (attr.order_by === 'desc') {
          value = '倒序';
        } else if (attr.order_by === 'asc') {
          value = '正序';
        }
        if (originAttr.order_by === 'desc') {
          oldValue = '倒序';
        } else if (originAttr.order_by === 'asc') {
          oldValue = '正序';
        }
        log.push(`排序由 [${oldValue}]改为[${value}]`);
      }
      if (attr.sub_query_field !== originAttr.sub_query_field) {
        const attrStartParen = attr.sub_query_field.indexOf('(');
        const originStartParen = originAttr.sub_query_field.indexOf('(');
        const attrCountType = attrStartParen !== -1 ? attr.sub_query_field.slice(0, attrStartParen) : '';
        const originCountType = originStartParen !== -1 ? originAttr.sub_query_field.slice(0, originStartParen) : '';
        let value = '';
        let oldValue = '';
        if (attrCountType === 'sum') {
          value = '合计值';
        } else if (attrCountType === 'avg') {
          value = '平均值';
        } else if (attrCountType === 'COUNT') {
          value = '计数';
        }
        if (originCountType === 'sum') {
          oldValue = '合计值';
        } else if (originCountType === 'avg') {
          oldValue = '平均值';
        } else if (originCountType === 'COUNT') {
          oldValue = '计数';
        }
        log.push(`统计由 [${oldValue}]改为[${value}]`);
      }
      if (log.length > 0) {
        contentLog.push(`修改报表列${originAttrName}, ${log.join(';')}`);
      }
    }
    const newGroupBys = groupByFields.filter(field =>
      !originGroupBys.find(gb => (gb.bizObject === field.bizObject) && (gb.field === field.field)));
    const deleteGroupBys = originGroupBys.filter(gb => !groupByFields.find(field =>
      (field.bizObject === gb.bizObject) && (field.field === gb.field)));
    if (newGroupBys.length > 0) {
      contentLog.push(`添加分组, [${newGroupBys.map(gb => gb.label).join(',')}]`);
    }
    if (deleteGroupBys.length > 0) {
      contentLog.push(`删除分组, [${deleteGroupBys.map(gb => reportObjectMeta[gb.bizObject].find(item =>
        item.bm_field === gb.field).bmf_label_name).join(',')}]`);
    }
    if (whereClauseFieldsLists.length !== currentReport.whereClauses.length) {
      contentLog.push('编辑筛选器');
    } else {
      for (let i = 0; i < currentReport.whereClauses.length; i++) {
        const whereClauses = currentReport.whereClauses[i];
        const newWhereClauses = whereClauseFieldsLists[i];
        if (whereClauses.length !== newWhereClauses.length) {
          contentLog.push('编辑筛选器');
          break;
        } else {
          for (let j = 0; j < whereClauses.length; j++) {
            const whereClause = whereClauses[j];
            const newWhereClause = newWhereClauses[j];
            if (whereClause.rpt_field_cmpop !== newWhereClause.rpt_field_cmpop ||
              whereClause.rpt_field_cmpvalue !== newWhereClause.rpt_field_cmpvalue ||
              whereClause.rpt_obj_field !== newWhereClause.rpt_obj_field ||
              whereClause.rpt_object !== newWhereClause.rpt_object ||
              whereClause.rpt_wherecls_seq !== newWhereClause.rpt_wherecls_seq) {
              contentLog.push('编辑筛选器');
              break;
            }
          }
        }
      }
    }
    const bizObjectConfig = {};
    for (let i = 0; i < groupByFields.length; i++) {
      const groupByField = groupByFields[i];
      if (groupByField.field) {
        if (!bizObjectConfig[groupByField.bizObject]) {
          bizObjectConfig[groupByField.bizObject] =
          { groupByFields: [groupByField.field], sqlAttributes: [] };
        } else {
          bizObjectConfig[groupByField.bizObject].groupByFields.push(groupByField.field);
        }
      }
    }
    for (let i = 0; i < sqlAttributes.length; i++) {
      const attr = sqlAttributes[i];
      if (attr.field && attr.update) {
        const sqlAttr = {
          field: attr.field,
          id: attr.id,
          sub_query_field: attr.sub_query_field,
          order_by: attr.order_by,
          column_seq: attr.column_seq,
          column_name: attr.column_name,
        };
        if (!bizObjectConfig[attr.bizObject]) {
          bizObjectConfig[attr.bizObject] =
          {
            sqlAttributes: [sqlAttr],
            groupByFields: [],
          };
        } else {
          bizObjectConfig[attr.bizObject].sqlAttributes.push(sqlAttr);
        }
      }
    }
    // 没有config的bizObj发空信息,使最后一个field能被删除
    const bizObjects = Object.keys(reportObjectMeta);
    for (let i = 0, len = bizObjects.length; i < len; i++) {
      const bizObject = bizObjects[i];
      if (!bizObjectConfig[bizObject]) {
        bizObjectConfig[bizObject] = { groupByFields: [], sqlAttributes: [] };
      }
    }
    this.props.saveReportConfig(
      this.props.params.id,
      bizObjectConfig,
      whereClauseFieldsLists.map(list => list.filter(field => field.effective)),
      deleteSqlAttrIds,
      contentLog.length > 0 ? contentLog : '',
    ).then((result) => {
      if (!result.error) {
        this.handleReportConfigLoad();
        message.success(this.msg('savedSucceed'));
        this.setState({
          exportDisable: false,
        });
      }
    });
  }

  handleCancel = () => {
    if (this.props.edited) {
      Modal.confirm({
        title: this.msg('取消会丢失尚未保存的修改，确定放弃吗?'),
        onOk: () => {
          this.context.router.goBack();
        },
      });
    } else {
      this.context.router.goBack();
    }
  }
  handleSearch = (labelSearch) => {
    this.setState({
      labelSearch,
    });
  }
  handleTabChange = (tabKey) => {
    this.setState({
      tabKey,
    });
    const { previewed } = this.props;
    if (!previewed && tabKey === 'preview') {
      const { reportConfig, reportConfigWhereClause, objAttrs } = this.genReportParams();
      if (objAttrs.length > 0) {
        this.props.previewReport({ reportConfig, reportConfigWhereClause, objAttrs });
      }
    }
  }
  genReportParams = () => {
    const { configs } = this.props;
    const { whereClauseFieldsLists, groupByFields, sqlAttributes } = this.state;
    const bizObjects = configs.map(config => config.objName);
    const reportConfig = [];
    const reportConfigWhereClause = [];
    for (let i = 0; i < bizObjects.length; i++) {
      const bizObject = bizObjects[i];
      const config = { rpt_object: bizObject };
      config.rpt_groupby_fields = groupByFields.filter(field => field.bizObject === bizObject).map(item => item.field).join(',');
      reportConfig.push(config);
    }
    const objAttrs = sqlAttributes.filter(attr => attr.field).map(attr => ({
      rpt_object: attr.bizObject,
      sql_field: attr.field,
      sub_query_field: attr.sub_query_field,
      order_by: attr.order_by,
      column_name: attr.column_name,
    }));
    for (let i = 0; i < whereClauseFieldsLists.length; i++) {
      const lists = whereClauseFieldsLists[i];
      for (let j = 0; j < lists.length; j++) {
        const field = lists[j];
        reportConfigWhereClause.push({
          rpt_object: field.rpt_object,
          rpt_wherecls_seq: i,
          rpt_obj_field: field.rpt_obj_field,
          rpt_field_cmpop: field.rpt_field_cmpop,
          rpt_field_cmpvalue: Array.isArray(field.rpt_field_cmpvalue) ? field.rpt_field_cmpvalue.join(',') : field.rpt_field_cmpvalue,
          rpt_cmpvalue_source: field.rpt_cmpvalue_source,
        });
      }
    }
    return { reportConfig, reportConfigWhereClause, objAttrs };
  }
  render() {
    const {
      whereClauseFieldsLists, groupByFields, sqlAttributes, exportDisable, labelSearch, tabKey,
    } = this.state;
    const {
      currentReport, reportObjectMeta, edited, whereClauses,
    } = this.props;
    const dropdown = (
      <Menu>
        <Menu.Item disabled key="saveAs">{this.msg('saveAs')}</Menu.Item>
      </Menu>
    );
    const fieldCategoryList = (
      <Menu
        mode="inline"
        className="report-side-list"
        selectable={false}
        inlineIndent={8}
      >
        {Object.keys(reportObjectMeta).filter(objn => PAAS_DW_OBJECT_MSG[objn]).map(objName => (
          <SubMenu title={this.msg(PAAS_DW_OBJECT_MSG[objName].title)} key={objName}>
            {reportObjectMeta[objName].filter(item =>
              (item.bmf_label_name || item.bmf_default_name).indexOf(labelSearch) !== -1)
              .map(field => (
                <Menu.Item>
                  <MetaFieldDragSource
                    field={field}
                    bizObject={objName}
                  />
                </Menu.Item>))}
          </SubMenu>
        ))}
      </Menu>);
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('reportConfig'), currentReport.rpt_name]}>
          <PageHeader.Actions>
            <ExportButton
              disabled={exportDisable}
              tooltip="改动配置且保存之后才可导出"
              rptName={currentReport.rpt_name}
              rptId={this.props.params.id}
            />
            <PrivilegeCover module="dis" feature="report" action="edit">
              <Dropdown.Button type="primary" overlay={dropdown} onClick={this.handleSave} disabled={!edited}>
                <Icon type="save" />{this.msg('save')}
              </Dropdown.Button>
            </PrivilegeCover>
            <Button onClick={this.handleCancel} >{this.msg('cancel')}</Button>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel width={240}>
            <SearchBox
              placeholder={this.msg('searchFields')}
              size="large"
              borderless
              onSearch={this.handleSearch}
              value={labelSearch}
            />
            {fieldCategoryList}
          </SidePanel>
          <Content className="page-content">
            <Card size="small" bodyStyle={{ padding: 0 }}>
              <Tabs onChange={this.handleTabChange} activeKey={tabKey} style={{ backgroundColor: '#FFF' }}>
                <TabPane tab={this.msg('dataRange')} key="dataRange">
                  <Row className="pane-content-padding">
                    <Col span={16}>
                      {whereClauseFieldsLists.map((whereClauseFieldsList, index) =>
                          (<div className="filter-box">
                            <FilterBox
                              whereClauseFieldsList={whereClauseFieldsList}
                              index={index}
                              handleFilterChange={this.handleFilterChange}
                              handleFilterDelete={this.handleFilterDelete}
                              editable
                              deletable
                              rptParams={this.props.rptParams}
                              DropTarget={RptBoxDropTarget}
                              reportObjectMeta={reportObjectMeta}
                              oldWhereClauses={whereClauses}
                            />
                            {(index !== whereClauseFieldsLists.length - 1) &&
                              (<div className="divide-line">
                                <span className="divide-text">或(OR)</span>
                              </div>)}
                          </div>))}
                      <Button type="dashed" icon="plus-circle" onClick={this.handleAdd} style={{ marginTop: 16 }}>{this.msg('addCondition')}</Button>
                    </Col>
                    <Col span={8}>
                      <GroupBox
                        groupByFields={groupByFields}
                        handleGroupFieldsChange={this.handleGroupFieldsChange}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab={this.msg('dataCols')} key="dataCols">
                  <ColumnConfigPane
                    sqlAttributes={sqlAttributes}
                    groupByFields={groupByFields}
                    handleReportFieldChange={this.handleReportFieldChange}
                  />
                </TabPane>
                <TabPane tab={this.msg('previewReport')} key="preview">
                  <ReportColumnPane
                    sqlAttributes={sqlAttributes}
                    groupByFields={groupByFields}
                    whereClauseFieldsLists={whereClauseFieldsLists}
                    handleReportFieldChange={this.handleReportFieldChange}
                    rptParams={this.props.rptParams}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
