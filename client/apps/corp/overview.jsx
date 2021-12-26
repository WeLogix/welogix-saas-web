import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Col, Card, DatePicker, Form, Layout, Row, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import withPrivilege from 'client/common/decorators/withPrivilege';
import PageHeader from 'client/components/PageHeader';
import CircleCard from 'client/components/CircleCard';
import { LogixIcon } from 'client/components/FontIcon';
import NavLink from 'client/components/NavLink';
import { loadTenantUsageStatis } from 'common/reducers/saasBase';
import CorpSiderMenu from './menu';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { MonthPicker } = DatePicker;
const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

@injectIntl
@connect(
  state => ({
    tenantStat: state.saasBase.tenantStat,
  }),
  { loadTenantUsageStatis },
)
@withPrivilege({ module: 'corp', feature: 'info' })
@Form.create()
export default class CorpOverview extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    monthDate: new Date(),
  }
  componentDidMount() {
    this.props.loadTenantUsageStatis();
  }
  msg = formatMsg(this.props.intl);
  handleDateChange = (date, dateString) => {
    this.props.loadTenantUsageStatis(dateString);
    this.setState({ monthDate: dateString });
  }
  render() {
    const { tenantStat } = this.props;
    const { monthDate } = this.state;
    return (
      <Layout>
        <CorpSiderMenu currentKey="overview" />
        <Layout>
          <PageHeader title={this.msg('overview')} />
          <Content className="page-content layout-fixed-width layout-fixed-width-lg" key="main">
            <Card
              size="small"
              title={<span><Tag color="#2db7f5">{this.msg('企业版')}</Tag> {this.msg('usageMeter')}</span>}
              extra={<MonthPicker format="YYYY-MM" onChange={this.handleDateChange} value={moment(monthDate)} />}
            >
              <Row gutter={24}>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.invoices || '-'}
                      description="商业发票数"
                    />
                  </CircleCard>
                </Col>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.shipmts || '-'}
                      description="货运订单数"
                    />
                  </CircleCard>
                </Col>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.decls || '-'}
                      description="报关单数"
                    />
                  </CircleCard>
                </Col>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.inbounds || '-'}
                      description="入库单数"
                    />
                  </CircleCard>
                </Col>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.outbounds || '-'}
                      description="出库单数"
                    />
                  </CircleCard>
                </Col>
                <Col span={4}>
                  <CircleCard hoverable>
                    <Card.Meta
                      title={tenantStat.transports || '-'}
                      description="运输单数"
                    />
                  </CircleCard>
                </Col>
              </Row>
            </Card>
            <Card
              size="small"
              title={this.msg('controlPanel')}
              className="launch-panel"
            >
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/subscription" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-subscription" />}
                    title={this.msg('corpSubscription')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/info">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-corp" />}
                    title={this.msg('corpInfo')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/members">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-org" />}
                    title={this.msg('corpDeptMember')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/role">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-privilege" />}
                    title={this.msg('corpRole')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/affiliate">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-affiliate" />}
                    title={this.msg('affiliate')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/collab">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-collab" />}
                    title={this.msg('collab')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/trial">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-trial" />}
                    title={this.msg('auditTrial')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/corp/recycle" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-recycle" />}
                    title={this.msg('recycle')}
                  />
                </NavLink>
              </Card.Grid>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
