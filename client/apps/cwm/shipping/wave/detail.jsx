import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Tabs, Button, Menu, Icon, Dropdown, Steps } from 'antd';
import { loadReceiveModal } from 'common/reducers/cwmReceive';
import { loadOutboundHead } from 'common/reducers/cwmOutbound';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import { CWM_OUTBOUND_STATUS, CWM_SO_TYPES } from 'common/constants';
import MagicCard from 'client/components/MagicCard';
import XLSPickingList from '../outbound/print/xlsPickingList';
import PDFPickingList from '../outbound/print/pdfPickingList';
import PickingDetailsPane from '../outbound/tabpane/pickingDetailsPane';
import PackingDetailsPane from '../outbound/tabpane/packingDetailsPane';
import OrderDetailsPane from '../outbound/tabpane/orderDetailsPane';
import WaveSoListPane from './tabpane/waveSoListPane';
import { formatMsg } from '../message.i18n';


const { Content } = Layout;
const { TabPane } = Tabs;
const { Step } = Steps;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    defaultWhse: state.cwmContext.defaultWhse,
    waveHead: state.cwmOutbound.outboundFormHead,
    reload: state.cwmShippingOrder.waveReload,
    outboundReload: state.cwmOutbound.outboundReload,
  }),
  { loadReceiveModal, loadOutboundHead }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShipping',
})
export default class WaveDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    tabKey: 'waveList',
  }
  componentWillMount() {
    this.props.loadOutboundHead(null, this.props.params.waveNo);
    let script;
    if (!document.getElementById('pdfmake-min')) {
      script = document.createElement('script');
      script.id = 'pdfmake-min';
      script.src = `${__CDN__}/assets/pdfmake/pdfmake.min.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById('pdfmake-vfsfont')) {
      script = document.createElement('script');
      script.id = 'pdfmake-vfsfont';
      script.src = `${__CDN__}/assets/pdfmake/vfs_fonts.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.outboundReload && nextProps.outboundReload !== this.props.outboundReload) {
      this.props.loadOutboundHead(null, this.props.params.waveNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (tabKey) => {
    this.setState({
      tabKey,
    });
  }
  render() {
    const { defaultWhse, waveHead } = this.props;
    const outbStatus = Object.keys(CWM_OUTBOUND_STATUS).filter(cis =>
      CWM_OUTBOUND_STATUS[cis].value === waveHead.status)[0];
    const waveStep = outbStatus ?
      CWM_OUTBOUND_STATUS[outbStatus].step : 0;
    const printMenu = (
      <Menu>
        <Menu.Item>
          <XLSPickingList waveNo={waveHead.wave_no} />
        </Menu.Item>
        <Menu.Item>
          <PDFPickingList waveNo={waveHead.wave_no} />
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            this.props.params.waveNo,
          ]}
          extra={<Steps
            size="small"
            current={waveStep}
            className="progress-tracker"
            status={waveHead.status === 5 ? 'finish' : 'process'}
          >
            <Step title="预分配" />
            <Step title="分配中" />
            <Step title="待拣货" />
          </Steps>}
        >
          <PageHeader.Actions>
            {this.state.tabKey === 'pickingDetails' && <Dropdown overlay={printMenu}>
              <Button icon="printer">{this.msg('print')} <Icon type="down" /></Button>
            </Dropdown>}
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={this.state.tabKey} onChange={this.handleTabChange}>
              <TabPane tab="波次订单列表" key="waveList">
                <WaveSoListPane
                  waveNo={this.props.params.waveNo}
                />
              </TabPane>
              <TabPane tab="波次订单明细" key="waveDetails">
                <OrderDetailsPane
                  waveNo={this.props.params.waveNo}
                />
              </TabPane>
              <TabPane tab="波次拣货明细" key="pickingDetails">
                <PickingDetailsPane waveNo={this.props.params.waveNo} />
              </TabPane>
              <TabPane tab="装箱明细" key="packingDetails" disabled={CWM_SO_TYPES[3].value}>
                <PackingDetailsPane outboundNo="2" />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
