import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Col, Icon, Layout, Row } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadPaasIndexStat } from 'common/reducers/saasBase';
import PageHeader from 'client/components/PageHeader';
import CircleCard from 'client/components/CircleCard';
import { LogixIcon } from 'client/components/FontIcon';
import NavLink from 'client/components/NavLink';
import PaaSMenu from './menu';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

@injectIntl
@connect(
  state => ({
    paasStat: state.saasBase.paasStat,
  }),
  { loadPaasIndexStat }
)
export default class Index extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadPaasIndexStat();
  }
  msg = formatMsg(this.props.intl)
  handleLinkClick = (link) => {
    this.context.router.push(link);
  }
  render() {
    const { paasStat } = this.props;
    return (
      <Layout>
        <PaaSMenu currentKey="home" />
        <Layout>
          <PageHeader title={this.msg('paasOverview')} />
          <Content className="page-content layout-fixed-width layout-fixed-width-lg" key="main">
            <Row gutter={24} style={{ padding: 24 }}>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.dataAdapters || '-'}
                    description={this.msg('dataAdapters')}
                  />
                </CircleCard>
              </Col>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.flows || '-'}
                    description={this.msg('bizFlow')}
                  />
                </CircleCard>
              </Col>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.rules || '-'}
                    description={this.msg('alertRule')}
                  />
                </CircleCard>
              </Col>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.plugins || '-'}
                    description={this.msg('sysIntegrated')}
                  />
                </CircleCard>
              </Col>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.devapps || '-'}
                    description={this.msg('appsDeveloped')}
                  />
                </CircleCard>
              </Col>
              <Col span={4}>
                <CircleCard hoverable>
                  <Card.Meta
                    title={paasStat.exporters || '-'}
                    description={this.msg('templates')}
                  />
                </CircleCard>
              </Col>
            </Row>
            <Card size="small" title={this.msg('bizDomain')} className="launch-panel">
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/adapter">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-adapter" />}
                    title={this.msg('dataAdapters')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/flow">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-biz-flow" />}
                    title={this.msg('bizFlow')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/risk">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-biz-rule" />}
                    title={this.msg('alertRule')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/approval" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-approval" />}
                    title={this.msg('approvalFlow')}
                  />
                </NavLink>
              </Card.Grid>
            </Card>
            <Card size="small" title={this.msg('dataPlatform')} className="launch-panel">
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/data/hub" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-hub" />}
                    title={this.msg('dataHub')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/data/qc" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-qc" />}
                    title={this.msg('dataQC')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/data/dw">
                  <Card.Meta
                    avatar={<LogixIcon type="icon-dw" />}
                    title={this.msg('dataSubject')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/data/v" disabled>
                  <Card.Meta
                    avatar={<LogixIcon type="icon-datav" />}
                    title={this.msg('dataV')}
                  />
                </NavLink>
              </Card.Grid>
            </Card>
            <Card size="small" title={this.msg('openPlatform')} className="launch-panel">
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/integration">
                  <Card.Meta
                    avatar={<Icon type="api" />}
                    title={this.msg('integration')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/dev">
                  <Card.Meta
                    avatar={<Icon type="code" />}
                    title={this.msg('openDev')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="/paas/ops" disabled>
                  <Card.Meta
                    avatar={<Icon type="experiment" />}
                    title={this.msg('openOps')}
                  />
                </NavLink>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <NavLink to="https://docs.welogix.cn">
                  <Card.Meta
                    avatar={<Icon type="read" />}
                    title={this.msg('openApiDocs')}
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
