import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, DatePicker, Dropdown, Row, Menu, Tooltip, Icon, Col, Layout } from 'antd';
import { Charts, Trend } from 'ant-design-pro';
import moment from 'moment';
import numeral from 'numeral';
import StatsCard from 'client/components/StatsCard';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { MonthPicker } = DatePicker;
const {
  MiniArea, MiniBar, MiniProgress, yuan, Field,
} = Charts;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  { switchDefaultWhse }
)
@connectNav({
  depth: 2,
  moduleName: 'dis',
  title: 'featDisDashboard',
})
export default class DISDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
    };
    const visitData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    const dropdownMenu = (<Menu>
      <Menu.Item key="edit">
        <Icon type="edit" /> 重命名
      </Menu.Item>
      <Menu.Item key="share">
        <Icon type="share-alt" /> 共享
      </Menu.Item>
      <Menu.Item key="delete">
        <Icon type="delete" /> 删除
      </Menu.Item>
    </Menu>);
    return (
      <Layout>
        <PageHeader extra={<Menu
          mode="horizontal"
          defaultSelectedKeys={['setting:1']}
        >
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </Menu>}
        >
          <PageHeader.Actions>
            <Button type="primary" icon="plus">{this.msg('create')}</Button>
          </PageHeader.Actions>

        </PageHeader>
        <Content className="page-content" key="main">
          <Card
            size="small"
            title={<span><MonthPicker /></span>}
            extra={<span><Button type="primary" ghost icon="plus-circle">添加图表</Button><Dropdown overlay={dropdownMenu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon type="ellipsis" />
              </Button>
            </Dropdown></span>}
            bodyStyle={{ padding: 24 }}
          >
            <Row gutter={24}>
              <Col {...topColResponsiveProps}>
                <StatsCard
                  title="总销售额"
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  total={yuan(126560)}
                  footer={<Field label="日均销售额" value={`￥${numeral(12423).format('0,0')}`} />}
                  contentHeight={46}
                >
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <span>
            周同比
                      <Trend flag="up" >12%</Trend>
                    </span>
                    <span style={{ marginLeft: 16 }}>
            日环比
                      <Trend flag="down" >11%</Trend>
                    </span>
                  </div>
                </StatsCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <StatsCard
                  title="开票金额"
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  total={yuan(8846)}
                  footer={<Field label="支付税金" value={`￥${numeral(12423).format('0,0')}`} />}
                  contentHeight={46}
                  canvas
                >
                  <MiniArea
                    color="#975FE4"
                    height={46}
                    data={visitData}
                  />
                </StatsCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <StatsCard
                  title="收款总金额"
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  total={yuan(6560)}
                  footer={<Field label="回款比例" value="60%" />}
                  contentHeight={46}
                >
                  <MiniBar
                    height={46}
                    data={visitData}
                  />
                </StatsCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <StatsCard
                  title="毛利率"
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  total="23%"
                  footer={
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      <span>
              周同比
                        <Trend flag="up" >12%</Trend>
                      </span>
                      <span style={{ marginLeft: 16 }}>
              日环比
                        <Trend flag="down" >11%</Trend>
                      </span>
                    </div>
        }
                  contentHeight={46}
                >
                  <MiniProgress percent={23} strokeWidth={8} target={25} color="#13C2C2" />
                </StatsCard>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    );
  }
}
