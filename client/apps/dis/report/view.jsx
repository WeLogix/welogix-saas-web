import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Collapse, Layout, Button, Dropdown, Menu, Icon, Drawer, Row, Col } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { TRANS_MODES, INV_SHIPRECV_STATUS, CMS_DECL_STATUS, DECL_TYPE, CMS_DECL_CHANNEL, CMS_FEE_UNIT, CMS_DECL_TYPE, CMS_ENTRY_TYPE, CMS_BILL_TYPE, PARTNER_ROLES } from 'common/constants';
import LogsPane from 'client/components/Dock/common/logsPane';
import { toggleBizObjLogsPanel } from 'common/reducers/operationLog';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { toggleSidePanelState } from 'common/reducers/navbar';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import RptBoxDropTarget from './dragComponents/rptBoxDropTarget';
import ReportTable from '../common/reportTable';
import FilterBox from '../common/filterBox';
import ExportButton from '../common/reportExportButton';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { Panel } = Collapse;

@WithDragDropContext
@injectIntl
@connect(
  state => ({
    visible: state.operationLog.bizObjLogPanel.visible,
    currentReport: state.disReport.currentReport,
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
    },
    reportObjectMeta: state.disReport.reportObjectMeta,
  }),
  {
    loadPartnerFlowList,
    loadPartners,
    toggleBizObjLogsPanel,
    toggleSidePanelState,
  },
)
@connectNav({
  depth: 3,
  moduleName: 'dis',
  title: 'featDisReport',
})
export default class ReportView extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    whereClauseFieldsLists: [],
    whereClauseEdited: false,
  }
  componentDidMount() {
    this.props.loadPartners();
    this.props.loadPartnerFlowList({ simple: true });
    this.props.toggleSidePanelState(true);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentReport !== this.props.currentReport) {
      this.setState({
        whereClauseFieldsLists: nextProps.currentReport.whereClauses,
      });
    }
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'log') {
      this.props.toggleBizObjLogsPanel(true, this.props.params.reportId, 'disReport');
    }
  }
  handleClosePane = () => {
    this.props.toggleBizObjLogsPanel(false);
  }
  msg = formatMsg(this.props.intl);
  genWhereClausesParams = () => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    const reportConfigWhereClause = [];
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
    return reportConfigWhereClause;
  }
  createViewExportParams= () => {
    const viewParam = {};
    if (this.state.whereClauseEdited) {
      viewParam.reportConfigWhereClause = this.genWhereClausesParams();
    }
    return viewParam;
  }
  handleFilterChange = (filterList, index) => {
    const whereClauseFieldsLists = [...this.state.whereClauseFieldsLists];
    whereClauseFieldsLists[index] = filterList;
    this.setState({
      whereClauseFieldsLists,
      whereClauseEdited: true,
    });
  }
  recvChildHandler = (loadHandler) => {
    this.childLoadHandler = loadHandler;
  }
  handleReportView = () => {
    this.childLoadHandler(1);
  }
  handleReportConfig = () => {
    this.context.router.push(`/dis/report/edit/${this.props.params.reportId}`);
  }
  render() {
    const {
      visible, currentReport, reportObjectMeta, rptParams,
    } = this.props;
    const { whereClauseFieldsLists } = this.state;
    return (
      <Layout>
        <PageHeader breadcrumb={[currentReport.rpt_name]}>
          <PageHeader.Actions>
            <PrivilegeCover module="dis" feature="report" action="edit">
              <Button type="primary" icon="read" onClick={this.handleSubscribe} disabled>{this.msg('subscribe')}</Button>
            </PrivilegeCover>
            <ExportButton
              passRptExportParam={this.createViewExportParams}
              rptName={currentReport.rpt_name}
              rptId={this.props.params.reportId}
            />
            <Dropdown overlay={<Menu onClick={this.handleMenuClick}><Menu.Item key="log"><Icon type="bars" /> 操作记录</Menu.Item></Menu>}>
              <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
            </Dropdown>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <Card bodyStyle={{ padding: 0 }}>
            <Collapse bordered={false}>
              <Panel header={this.msg('dataRange')} key="dataRange">
                <div className="report-view-filter">
                  <Row type="flex" justify="start">
                    {whereClauseFieldsLists.map((whereClauseFieldsList, index) =>
                  (<Col span={12} key={`filtercol${whereClauseFieldsList[0] ? whereClauseFieldsList[0].rpt_wherecls_seq : ''}`}>
                    <div className="filter-box">
                      <FilterBox
                        whereClauseFieldsList={whereClauseFieldsList}
                        index={index}
                        handleFilterChange={this.handleFilterChange}
                        editable
                        deletable={false}
                        rptParams={rptParams}
                        DropTarget={RptBoxDropTarget}
                        reportObjectMeta={reportObjectMeta}
                        oldWhereClauses={currentReport.whereClauses}
                      />
                    </div>
                  </Col>
                  ))}
                  </Row>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      onClick={this.handleReportView}
                    >{this.msg('query')}</Button>
                    <PrivilegeCover module="dis" feature="report" action="edit">
                      <Button onClick={this.handleReportConfig}>{this.msg('config')}</Button>
                    </PrivilegeCover>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </Card>
          <ReportTable
            reportId={Number(this.props.params.reportId)}
            rptParams={rptParams}
            setLoadHandler={this.recvChildHandler}
            passRptDataParams={this.createViewExportParams}
          />
          <Drawer
            visible={visible}
            onClose={this.handleClosePane}
            title={<span>操作记录</span>}
            width={500}
          >
            <LogsPane />
          </Drawer>
        </Content>
      </Layout>
    );
  }
}
