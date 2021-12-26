import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Tabs, Icon, Layout, Menu, Button, Modal, message, Popover, Form } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import SidePanel from 'client/components/SidePanel';
import RowAction from 'client/components/RowAction';
import {
  TRANS_MODES, INV_SHIPRECV_STATUS, CMS_DECL_STATUS, DECL_TYPE, CMS_DECL_CHANNEL, CMS_FEE_UNIT,
  CMS_DECL_TYPE, CMS_ENTRY_TYPE, CMS_BILL_TYPE, PARTNER_ROLES, INSPECT_STATUS, CMS_DECL_MOD_TYPE,
} from 'common/constants';
import {
  loadDimensionMeasureFields, getChart, saveAnalyticsConfig, setAnalyticsEdited,
  loadChartWhereClause, removeRefReport,
  getCountFields, deleteCountFields,
} from 'common/reducers/disAnalytics';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import MetaFieldDragSource from './dragComponents/metaFieldDragSource';
import QuoteReportModal from './modal/quoteReportModal';
import EditCountFieldsCard from './tabPanes/editCountFieldsCard';
import AxisPane from './tabPanes/axisPane';
import DataRangePane from './tabPanes/dataRangePane';
import ChartViewPane from './tabPanes/chartViewPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    dwSubjectField: state.disAnalytics.dwSubjectField,
    currentChart: state.disAnalytics.currentChart,
    chartAxisXs: state.disAnalytics.chartAxisXs,
    chartAxisYs: state.disAnalytics.chartAxisYs,
    whereClauses: state.disAnalytics.whereClauses,
    edited: state.disAnalytics.edited,
    countFields: state.disAnalytics.countFields,
    chartParams: {
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
      declWay: DECL_TYPE.map(dt => ({
        value: dt.key,
        text: dt.value,
      })),
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
    loadDimensionMeasureFields,
    getChart,
    saveAnalyticsConfig,
    setAnalyticsEdited,
    loadChartWhereClause,
    removeRefReport,
    getCountFields,
    deleteCountFields,
    loadPartners,
    loadPartnerFlowList,
  },
)
@WithDragDropContext
@connectNav({
  depth: 3,
  moduleName: 'dis',
  title: 'featDisAnalytics',
})
@Form.create()
export default class AnalyticsConfig extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    labelSearch: '',
    axisy: [],
    axisx: [],
    subAxisy: [],
    subYaxisEnable: false,
    whereClauses: [],
    addCountFieldsVisible: false,
    countFieldInfo: null,
  }
  componentDidMount() {
    this.props.getCountFields(this.props.params.chartUid);
    this.props.getChart(this.props.params.chartUid);
    this.props.loadPartners();
    this.props.loadPartnerFlowList({ simple: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whereClauses !== this.props.whereClauses) {
      this.setState({
        whereClauses: nextProps.whereClauses.map(wcs =>
          wcs.map(wclist => ({ ...wclist, effective: true }))),
      });
    }
    if (nextProps.currentChart && nextProps.currentChart !== this.props.currentChart) {
      if (!nextProps.dwSubjectField[nextProps.currentChart.dana_chart_subject]) {
        this.props.loadDimensionMeasureFields(nextProps.currentChart.dana_chart_subject);
      }
      if (nextProps.currentChart.dana_chart_report_ref) {
        this.props.loadChartWhereClause({
          reportId: nextProps.currentChart.dana_chart_report_ref,
        });
      } else {
        this.props.loadChartWhereClause({
          chartUid: this.props.params.chartUid,
          metricUid: '',
        });
      }
    }
    if (nextProps.chartAxisYs !== this.props.chartAxisYs) {
      const subAxisy = nextProps.chartAxisYs.filter(axis => axis.dana_axisy_secondary);
      const axisy = nextProps.chartAxisYs.filter(axis => !axis.dana_axisy_secondary);
      if (axisy.length < 5) {
        axisy.push({});
      }
      if (subAxisy.length < 5) {
        subAxisy.push({});
      }
      this.setState({
        axisy,
        subAxisy,
        subYaxisEnable: subAxisy.length > 1,
      });
    }
    if (nextProps.chartAxisXs !== this.props.chartAxisXs) {
      const axisx = [...nextProps.chartAxisXs];
      if (nextProps.chartAxisXs.length < 5) {
        axisx.push({});
      }
      this.setState({
        axisx,
      });
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    if (this.props.edited) {
      Modal.confirm({
        title: this.msg('返回后不会保存此前所更改的内容, 请确认!'),
        onOk: () => {
          this.context.router.goBack();
        },
      });
    } else {
      this.context.router.goBack();
    }
  }
  handleSave = () => {
    const {
      whereClauses, axisx, axisy, subAxisy,
    } = this.state;
    const { currentChart, form: { getFieldsValue } } = this.props;
    const chartViewData = getFieldsValue();
    const config = {
      chartUid: this.props.params.chartUid,
      axisx: axisx.filter(axis => axis.field).map((axis, index) =>
        ({
          dana_axisx_dimension_seq: index,
          dana_axisx_time_level: axis.dana_axisx_time_level,
          dana_axisx_dimension: axis.field,
          id: axis.id,
          dana_axisx_name: axis.name,
        })),
      axisy: axisy.concat(subAxisy).filter(axis => axis.name).map(axis => ({
        dana_axisy_metricuid: axis.dana_axisy_metricuid,
        dana_axisy_secondary: axis.dana_axisy_secondary,
        dana_axisy_num_precision: axis.dana_axisy_num_precision,
        dana_axisy_num_percent: axis.dana_axisy_num_percent,
        dana_metric_field: axis.field,
        id: axis.id,
        dana_metric_name: axis.name,
        dana_metric_formula: axis.dana_metric_formula && JSON.stringify(axis.dana_metric_formula),
        dana_metric_aggreate: axis.dana_metric_aggreate,
      })),
      chartView: {
        dana_chart_graph: chartViewData.dana_chart_graph,
        dana_chart_barchart: JSON.stringify({ view: chartViewData.dana_chart_barchart }),
        dana_chart_limit: chartViewData.dana_chart_limit === 'all' ? '' : chartViewData.dana_chart_limit,
        dana_chart_sortorder: chartViewData.dana_chart_sortorder === 'default' ? '' : chartViewData.dana_chart_sortorder,
      },
    };
    if (currentChart.dana_chart_report_ref) {
      config.reportRef = currentChart.dana_chart_report_ref;
    } else {
      config.dataRange = whereClauses.map(list => list.filter(field => field.effective));
    }
    this.props.saveAnalyticsConfig(config).then((result) => {
      if (!result.error) {
        message.success(this.msg('savedSucceed'));
      }
    });
  }
  handleSearch = (labelSearch) => {
    this.setState({
      labelSearch,
    });
  }
  handleAxisChange = (axisType, axis) => {
    const state = {};
    if (axisType === 'axisx') {
      state.axisx = axis;
    } else if (axisType === 'axisy') {
      state.axisy = axis;
    } else if (axisType === 'subAxisy') {
      state.subAxisy = axis;
    }
    this.setState(state);
    this.props.setAnalyticsEdited(true);
  }
  handleToggleSubYaxis = () => {
    const { subYaxisEnable } = this.state;
    const state = {
      subYaxisEnable: !subYaxisEnable,
      subAxisy: [{}],
    };
    this.setState(state);
    this.props.setAnalyticsEdited(true);
  }
  handleRangeAdd = () => {
    const whereClauses = [...this.state.whereClauses];
    whereClauses.push([]);
    this.setState({
      whereClauses,
    });
    this.props.setAnalyticsEdited(true);
  }
  handleDataRangeFilterChange = (filterList, index) => {
    const whereClauses = [...this.state.whereClauses];
    whereClauses[index] = filterList;
    this.setState({
      whereClauses,
    });
    this.props.setAnalyticsEdited(true);
  }
  handleDataRangeFilterDelete = (index) => {
    const { currentChart } = this.props;
    if (!currentChart.dana_chart_report_ref) {
      const whereClauses = [...this.state.whereClauses];
      whereClauses.splice(index, 1);
      this.setState({
        whereClauses: whereClauses.map((list, listIndex) =>
          list.map(item => ({ ...item, rpt_wherecls_seq: listIndex }))),
      });
    } else {
      this.props.removeRefReport();
      this.setState({
        whereClauses: [],
      });
    }
    this.props.setAnalyticsEdited(true);
  }
  handleSetFilter = (whereClauses) => {
    this.setState({
      whereClauses: whereClauses.map(wcs =>
        wcs.map(wclist => ({ ...wclist, effective: true }))),
    });
    this.props.setAnalyticsEdited(true);
  }
  handleCountFieldsViewToggle= (updateCountField) => {
    const { axisy, subAxisy, addCountFieldsVisible } = this.state;
    let newYAxisList = axisy;
    let newSubYAxisList = subAxisy;
    if (updateCountField) {
      newYAxisList = axisy.map((ay) => {
        if (ay.dana_axisy_metricuid === updateCountField.dana_metric_uid) {
          return { ...ay, name: updateCountField.dana_metric_name };
        }
        return ay;
      });
      newSubYAxisList = subAxisy.map((suay) => {
        if (suay.dana_axisy_metricuid === updateCountField.dana_metric_uid) {
          return { ...suay, name: updateCountField.dana_metric_name };
        }
        return suay;
      });
    }
    this.setState({
      axisy: newYAxisList,
      subAxisy: newSubYAxisList,
      addCountFieldsVisible: !addCountFieldsVisible,
      countFieldInfo: null,
    });
  }
  handleEditCountFields = (countFieldInfo) => {
    this.setState({
      addCountFieldsVisible: true,
      countFieldInfo,
    });
  }
  handleDeleteCountFields = (metricUid) => {
    if (metricUid) {
      this.props.deleteCountFields(metricUid).then((result) => {
        if (!result.error) {
          const { currentChart } = this.props;
          message.success('删除成功');
          this.props.getCountFields(currentChart.dana_chart_uid);
        } else {
          message.error(result.error);
        }
      });
    }
  }
  render() {
    const {
      currentChart, edited, countFields, form, dwSubjectField,
    } = this.props;
    if (!dwSubjectField[currentChart.dana_chart_subject]) {
      return null;
    }
    const {
      labelSearch, axisy, axisx, subAxisy, subYaxisEnable, whereClauses,
      addCountFieldsVisible, countFieldInfo,
    } = this.state;
    const { dimensionFields, measureFields, dwObjectMeta } =
      dwSubjectField[currentChart.dana_chart_subject];
    const fieldCategoryList = (
      <Menu
        mode="inline"
        className="report-side-list"
        selectable={false}
        inlineIndent={16}
      >
        <SubMenu key="dimension" title={<span>{this.msg('dimensionFields')}</span>}>
          {dimensionFields.filter(fd =>
            fd.bmf_label_name.indexOf(labelSearch) !== -1).map(fd => (<Menu.Item key={fd.bm_field}>
              <MetaFieldDragSource
                field={fd}
                axisType="axisx"
              />
            </Menu.Item>))}
        </SubMenu>
        <SubMenu key="measure" title={<span>{this.msg('measureFields')}</span>}>
          {measureFields.filter(fd =>
            fd.bmf_label_name.indexOf(labelSearch) !== -1).map(fd => (<Menu.Item key={fd.bm_field}>
              <MetaFieldDragSource
                field={fd}
                axisType="axisy"
              />
            </Menu.Item>))}
        </SubMenu>
        <SubMenu
          key="count"
          title={<span>{this.msg('计数字段')} <RowAction
            shape="circle"
            label={addCountFieldsVisible ? <Icon type="close-circle" /> :
            <Icon type="plus-circle" />}
            onClick={() => this.handleCountFieldsViewToggle()}
          /></span>}
        >
          {countFields.filter(fd =>
            fd.dana_metric_name.indexOf(labelSearch) !== -1).map(fd => (<Menu.Item>
              <MetaFieldDragSource
                field={{
                  bmf_label_name: fd.dana_metric_name,
                  bm_field: fd.dana_metric_field,
                  metric_uid: fd.dana_metric_uid,
                }}
                axisType="axisy"
                operationPopover={(<Popover
                  content={<span>
                    <RowAction
                      onClick={() => this.handleEditCountFields({
                        dana_metric_name: fd.dana_metric_name,
                        dana_metric_field: fd.dana_metric_field,
                        metric_uid: fd.dana_metric_uid,
                      })}
                      icon="edit"
                      tooltip="编辑"
                    />
                    <RowAction confirm="确认删除" onConfirm={() => this.handleDeleteCountFields(fd.dana_metric_uid)} icon="delete" tooltip="删除" />
                  </span>}
                  trigger="hover"
                  placement="right"
                >
                  <Icon type="ellipsis" className="editable-cell-icon" />
                </Popover>)}
              />
            </Menu.Item>))}
        </SubMenu>
      </Menu>);
    const cardContent = addCountFieldsVisible ?
      (<EditCountFieldsCard
        onCountFieldEdit={this.handleCountFieldsViewToggle}
        chartParams={this.props.chartParams}
        countFieldInfo={countFieldInfo}
      />) : (
        <Card size="small" bodyStyle={{ padding: 0 }}>
          <Tabs
            defaultActiveKey="axis"
          >
            <TabPane tab={this.msg('axis')} key="axis">
              <AxisPane
                axisy={axisy}
                axisx={axisx}
                subAxisy={subAxisy}
                onAxisChange={this.handleAxisChange}
                subYaxisEnable={subYaxisEnable}
                onSubYAxisToggle={this.handleToggleSubYaxis}
              />
            </TabPane>
            <TabPane tab={this.msg('dataRange')} key="dataRange">
              <DataRangePane
                whereClauses={whereClauses}
                handleFilterChange={this.handleDataRangeFilterChange}
                handleFilterDelete={this.handleDataRangeFilterDelete}
                handleFilterAdd={this.handleRangeAdd}
                chartParams={this.props.chartParams}
                dwObjectMeta={dwObjectMeta}
              />
            </TabPane>
          </Tabs>
        </Card>);
    return (
      <Layout>
        <PageHeader breadcrumb={[currentChart.dana_chart_name]}>
          <PageHeader.Actions>
            <PrivilegeCover module="dis" feature="analytics" action="edit">
              <Button type="primary" onClick={this.handleSave} disabled={!edited}>
                <Icon type="save" />{this.msg('save')}
              </Button>
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
            {cardContent}
            <ChartViewPane
              form={form}
              axisyList={axisy}
              axissubyList={subAxisy}
              axisxList={axisx}
              whereClauses={whereClauses}
              chartParams={this.props.chartParams}
              chartUid={this.props.params.chartUid}
            />
            <QuoteReportModal
              handleReportRef={this.handleSetFilter}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
