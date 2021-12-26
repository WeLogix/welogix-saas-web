import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege from 'client/common/decorators/withPrivilege';
import PageHeader from 'client/components/PageHeader';
import { TRANS_MODES, INV_SHIPRECV_STATUS, CMS_DECL_STATUS, DECL_TYPE, CMS_DECL_CHANNEL, CMS_FEE_UNIT, CMS_DECL_TYPE, CMS_ENTRY_TYPE, CMS_BILL_TYPE, PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import ChartContainer from '../common/chartContainer';
import ReportTable from '../common/reportTable';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
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
  }),
  {
    loadPartners,
    loadPartnerFlowList,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'dis',
  title: 'featDisAnalytics',
})
@withPrivilege({ module: 'dis', feature: 'setting', action: 'edit' })
export default class AnalyticsChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadPartners();
    this.props.loadPartnerFlowList({ simple: true });
  }
  msg = formatMsg(this.props.intl)
  chartConfig = {}
  recvChartInfo = (chart) => {
    this.chartConfig = chart;
  }
  render() {
    const { currentReport, rptParams } = this.props;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.chartConfig.dana_chart_name]} />
        <Content className="page-content layout-fixed-width">
          <Card>
            <ChartContainer
              chartUid={this.props.params.chartUid}
              onChartConfigLoad={this.recvChartInfo}
              chartParams={rptParams}
            />
          </Card>
          {this.chartConfig.dana_chart_report_ref ?
            <Card title={currentReport.rpt_name} bodyStyle={{ padding: 0 }}>
              <ReportTable
                reportId={this.chartConfig.dana_chart_report_ref}
                rptParams={rptParams}
              />
            </Card> : null}
        </Content>
      </Layout>
    );
  }
}
