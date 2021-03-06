import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Collapse, Layout, List, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleReportSettingDock } from 'common/reducers/cmsAnalytics';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege from 'client/common/decorators/withPrivilege';
import { Charts } from 'ant-design-pro';
import PageHeader from 'client/components/PageHeader';
import DeclChart from './chart/declChart';
import ValueTaxChart from './chart/valueTaxChart';
import { formatMsg } from './message.i18n';
import './style.less';

const { Content } = Layout;
const { Panel } = Collapse;
const { MiniArea, Bar, Pie } = Charts;

function Chart(props) {
  const {
    item,
  } = props;

  if (item.chartType === 'pie') {
    return (<Pie
      hasLegend={item.hasLegend}
      title={item.title}
      subTitle={item.subTitle}
      data={item.chartData}
      height={180}
      total={item.total}
      percent={item.percent}
    />);
  } else if (item.chartType === 'bar') {
    return (<Bar
      height={200}
      data={item.chartData}
    />);
  } else if (item.chartType === 'area') {
    return (<MiniArea
      line
      color="#cceafe"
      height={180}
      data={item.chartData}
    />);
  }
}
Chart.propTypes = {
  item: PropTypes.shape({
    chartType: PropTypes.string,
    chartData: PropTypes.array,
  }).isRequired,
};

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    loginName: state.account.username,
    invTemplates: state.cmsInvoice.invTemplates,
    docuType: state.cmsInvoice.docuType,
  }),
  { toggleReportSettingDock }
)
@connectNav({
  depth: 2,
  moduleName: 'dis',
})
@withPrivilege({ module: 'dis', feature: 'analytics', action: 'view' })
export default class AnalyticsList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
  }
  msg = formatMsg(this.props.intl)
  handleChart = () => {
    // const link = `/dis/analytics/chart/${id}`;
    // this.context.router.push(link);
  }
  showReportSettingDock = () => {
    this.props.toggleReportSettingDock(true);
  }
  render() {
    const visitData = [];
    const beginDay = new Date(new Date().setMonth(0)).getTime();
    for (let i = 0; i < 12; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * 31 * i))).format('YYYY-MM'),
        y: Math.floor(Math.random() * 1000) + 100,
      });
    }
    const cusDeclAnalytics = [
      {
        id: '5a3098a3366d746064c5qw12',
        title: <span>?????????????????? <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '????????????',
        total: '1.86???',
        hasLegend: true,
        chartData: [
          {
            x: '??????',
            y: 4544,
          },
          {
            x: '??????1???',
            y: 332,
          },
          {
            x: '??????2???',
            y: 57,
          },
          {
            x: '??????3???',
            y: 24,
          },
          {
            x: '??????3?????????',
            y: 37,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c53402',
        title: <span>????????????????????? <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '?????????',
        percent: 2.24,
        total: '1.24%',
      },
      {
        id: '5a3098a5466d746064c534da',
        title: <span>?????????????????? <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '????????????',
        percent: 0.71,
        total: '0.71%',
      },
      {
        id: '5a3098a3366d746064c5340p',
        title: '????????????????????????',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '????????????',
            y: 4544,
          },
          {
            x: '????????????',
            y: 3321,
          },
          {
            x: '?????????',
            y: 3113,
          },
          {
            x: '????????????',
            y: 2341,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5c934',
        title: '????????????????????????',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '????????????',
            y: 4544,
          },
          {
            x: '????????????',
            y: 3321,
          },
          {
            x: '????????????',
            y: 3113,
          },
          {
            x: '????????????',
            y: 2341,
          },
          {
            x: '????????????',
            y: 1231,
          },
          {
            x: '????????????',
            y: 1231,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5er60',
        title: '????????????????????????',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '????????????',
            y: 4544,
          },
          {
            x: '?????????????????????',
            y: 3321,
          },
        ],
      },
      /*
      {
        id: '5a3098a3366d746064c5cd0c',
        title: '????????????TOP 5',
        chartType: 'bar',
        hasLegend: true,
        chartData: [
          {
            x: '?????????????????????????????????????????????',
            y: 449,
          },
          {
            x: '??????????????????????????????',
            y: 272,
          },
          {
            x: '????????????????????????',
            y: 239,
          },
          {
            x: '??????????????????????????????',
            y: 33,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5cd0f',
        title: '?????????????????????',
        chartType: 'bar',
        chartData: visitData,
      },
      */
    ];
    const customPanelStyle = {
      background: 'transparent',
      border: 0,
    };
    return (
      <Layout>
        <PageHeader title={this.msg('analytics')} />
        <Content className="page-content">
          {// <Alert message="???????????????????????????????????????????????????????????????????????????????????????????????????????????????" type="info" closable />
          }
          <Collapse bordered={false} defaultActiveKey={['tradeAnalytics', 'cusDeclAnalytics']}>
            <Panel header={this.msg('tradeAnalytics')} key="tradeAnalytics" style={customPanelStyle}>
              <List
                grid={{ gutter: 16, column: 2 }}
              >
                <List.Item>
                  <Card
                    title="???????????????"
                    hoverable
                      // onClick={() => this.handleChart(item.id)}
                    bodyStyle={{ padding: 8 }}
                  >
                    <DeclChart />
                  </Card>
                </List.Item>
                <List.Item>
                  <Card
                    title="????????????"
                    hoverable
                      // onClick={() => this.handleChart(item.id)}
                    bodyStyle={{ padding: 8 }}
                  >
                    <ValueTaxChart />
                  </Card>
                </List.Item>
              </List>
            </Panel>
            <Panel header={this.msg('cusDeclAnalytics')} key="cusDeclAnalytics" style={customPanelStyle} id="analytics-list">
              <List
                grid={{
                  gutter: 16, xl: 2, xxl: 3,
                }}
                dataSource={cusDeclAnalytics}
                renderItem={item => (
                  <List.Item>
                    <Card
                      title={item.title}
                      hoverable
                      onClick={() => this.handleChart(item.id)}
                      bodyStyle={{ padding: 8 }}
                    >
                      <Chart item={item} />
                    </Card>
                  </List.Item>)}
              />
            </Panel>
          </Collapse>
        </Content>
      </Layout>
    );
  }
}
