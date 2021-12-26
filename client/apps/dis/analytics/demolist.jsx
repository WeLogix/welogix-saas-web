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
        title: <span>当月通关时效 <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '平均时效',
        total: '1.86天',
        hasLegend: true,
        chartData: [
          {
            x: '达标',
            y: 4544,
          },
          {
            x: '超时1天',
            y: 332,
          },
          {
            x: '超时2天',
            y: 57,
          },
          {
            x: '超时3天',
            y: 24,
          },
          {
            x: '超时3天以上',
            y: 37,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c53402',
        title: <span>当月海关查验率 <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '查验率',
        percent: 2.24,
        total: '1.24%',
      },
      {
        id: '5a3098a5466d746064c534da',
        title: <span>当月删改单率 <Tag>2018/12</Tag></span>,
        chartType: 'pie',
        subTitle: '删改单率',
        percent: 0.71,
        total: '0.71%',
      },
      {
        id: '5a3098a3366d746064c5340p',
        title: '不同运输方式统计',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '航空运输',
            y: 4544,
          },
          {
            x: '水路运输',
            y: 3321,
          },
          {
            x: '保税区',
            y: 3113,
          },
          {
            x: '铁路运输',
            y: 2341,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5c934',
        title: '进出口岸分布统计',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '浦东机场',
            y: 4544,
          },
          {
            x: '洋山海关',
            y: 3321,
          },
          {
            x: '上海快件',
            y: 3113,
          },
          {
            x: '外高桥关',
            y: 2341,
          },
          {
            x: '南京海关',
            y: 1231,
          },
          {
            x: '浦江海关',
            y: 1231,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5er60',
        title: '不同监管方式统计',
        chartType: 'pie',
        hasLegend: true,
        chartData: [
          {
            x: '一般贸易',
            y: 4544,
          },
          {
            x: '保税区仓储转口',
            y: 3321,
          },
        ],
      },
      /*
      {
        id: '5a3098a3366d746064c5cd0c',
        title: '报关代理TOP 5',
        chartType: 'bar',
        hasLegend: true,
        chartData: [
          {
            x: '上海外高桥保税物流园区恩诺物流',
            y: 449,
          },
          {
            x: '上海恩诺茂鸿国际物流',
            y: 272,
          },
          {
            x: '上海茂鸿国际货运',
            y: 239,
          },
          {
            x: '上海宏域国际货运代理',
            y: 33,
          },
        ],
      },
      {
        id: '5a3098a3366d746064c5cd0f',
        title: '进出口单量趋势',
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
          {// <Alert message="下列图表非真实数据，仅用于功能演示及需求收集，欢迎向我们反馈您的建议或意见" type="info" closable />
          }
          <Collapse bordered={false} defaultActiveKey={['tradeAnalytics', 'cusDeclAnalytics']}>
            <Panel header={this.msg('tradeAnalytics')} key="tradeAnalytics" style={customPanelStyle}>
              <List
                grid={{ gutter: 16, column: 2 }}
              >
                <List.Item>
                  <Card
                    title="进出口单量"
                    hoverable
                      // onClick={() => this.handleChart(item.id)}
                    bodyStyle={{ padding: 8 }}
                  >
                    <DeclChart />
                  </Card>
                </List.Item>
                <List.Item>
                  <Card
                    title="进口税金"
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
