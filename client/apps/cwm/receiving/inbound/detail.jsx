import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import moment from 'moment';
import { Alert, Icon, Dropdown, Radio, Layout, Menu, Steps, Button, Tabs, Tooltip } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { loadInboundHead, updateInboundMode } from 'common/reducers/cwmReceive';
import { getSasblCopNo } from 'common/reducers/cwmSasblReg';
import { loadAsnEntries } from 'common/reducers/cwmShFtz';
import { CWM_INBOUND_STATUS, CWM_SHFTZ_IN_REGTYPES } from 'common/constants';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import PutawayDetailsPane from './tabpane/putawayDetailsPane';
import ReceiveDetailsPane from './tabpane/receiveDetailsPane';
import InboundTreePopover from '../../common/popover/inboundTreePopover';
import PDFInboundList from './print/pdfInboundList';
import { formatMsg } from '../message.i18n';


const { Content } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Step } = Steps;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    username: state.account.username,
    defaultWhse: state.cwmContext.defaultWhse,
    inboundHead: state.cwmReceive.inboundFormHead,
    reload: state.cwmReceive.inboundReload,
    privileges: state.account.privileges,
  }),
  {
    loadAsnEntries,
    loadInboundHead,
    updateInboundMode,
    getSasblCopNo,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmReceiving',
  jumpOut: true,
})
export default class ReceiveInbound extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    activeTab: '',
    entryRegs: [],
  }
  componentDidMount() {
    this.props.loadInboundHead(this.props.params.inboundNo).then((result) => {
      if (!result.error) {
        const activeTab = result.data.status === CWM_INBOUND_STATUS.COMPLETED.value ? 'putawayDetails' : 'receiveDetails';
        this.setState({
          activeTab,
        });
        if (CWM_SHFTZ_IN_REGTYPES.find(tp => tp.value === result.data.bonded_intype)) {
          this.props.loadAsnEntries(result.data.asn_no).then((asnRegRes) => {
            if (!asnRegRes.error) {
              this.setState({ entryRegs: asnRegRes.data });
            }
          });
        } else {
          this.props.getSasblCopNo(result.data.asn_no, 'asn').then((asnRegRes) => {
            if (!asnRegRes.error) {
              this.setState({ entryRegs: asnRegRes.data });
            }
          });
        }
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.props.loadInboundHead(nextProps.params.inboundNo).then((result) => {
        if (!result.error) {
          const activeTab = result.data.status >= CWM_INBOUND_STATUS.PARTIAL_PUTAWAY.value ? 'putawayDetails' : 'receiveDetails';
          this.setState({
            activeTab,
          });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'receiving', action: 'edit',
  })
  handleReceivingModeChange = (ev) => {
    this.props.updateInboundMode(this.props.params.inboundNo, { rec_mode: ev.target.value });
  }
  handleTotalRecVolChange = (value) => {
    this.props.updateInboundMode(
      this.props.params.inboundNo,
      { total_received_vol: Number(value) }
    );
  }
  handleTabChange = (activeTab) => {
    this.setState({ activeTab });
  }
  render() {
    const {
      inboundHead, defaultWhse,
    } = this.props;
    const { inboundNo } = this.props.params;
    inboundHead.inbound_no = inboundNo;
    const { entryRegs } = this.state;
    const printMenu = (
      <Menu>
        <Menu.Item>
          <PDFInboundList inboundNo={this.props.params.inboundNo} entryRegs={entryRegs} />
        </Menu.Item>
      </Menu>
    );
    const inbStatus = Object.keys(CWM_INBOUND_STATUS).filter(cis =>
      CWM_INBOUND_STATUS[cis].value === inboundHead.status)[0];
    const currentStatus = inbStatus ? CWM_INBOUND_STATUS[inbStatus].step : 0;
    const inbNoTitle = inboundHead.cust_order_no ?
      <Tooltip title={inboundNo}>{inboundHead.cust_order_no}</Tooltip> : inboundNo;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            inbNoTitle,
            !!inboundHead.bonded && entryRegs &&
            <InboundTreePopover
              inbound={inboundHead}
              regType={inboundHead.bonded_intype}
              bondRegs={entryRegs}
              currentKey={`inbound-${inboundNo}`}
            />,
          ]}
          extra={<Steps
            size="small"
            current={currentStatus}
            className="progress-tracker"
            status={currentStatus === 3 ? 'finish' : 'process'}
          >
            <Step title="待入库" />
            <Step title="收货" />
            <Step title="上架" />
          </Steps>}
        >
          <PageHeader.Actions>
            <Dropdown overlay={printMenu}>
              <Button icon="printer">{this.msg('print')} <Icon type="down" /></Button>
            </Dropdown>
            <RadioGroup
              value={inboundHead.rec_mode}
              onChange={this.handleReceivingModeChange}
              disabled={currentStatus === CWM_INBOUND_STATUS.COMPLETED.step || !this.editPermission}
            >
              <Tooltip title="无线端入库操作" placement="bottom" mouseEnterDelay={1}><RadioButton value="scan"><Icon type="wifi" /></RadioButton></Tooltip>
              <Tooltip title="PC端入库操作" placement="bottomLeft" mouseEnterDelay={1}><RadioButton value="manual"><Icon type="desktop" /></RadioButton></Tooltip>
            </RadioGroup>
          </PageHeader.Actions>
        </PageHeader>
        {/*
            <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <DescriptionList col={4}>
              <Description term="货主">{inboundHead.owner_name}</Description>
              <Description term="订单追踪号">{inboundHead.cust_order_no}</Description>
              <Description term="总立方数">
                <EditableCell
                  value={inboundHead.total_received_vol}
                  editable={currentStatus < CWM_INBOUND_STATUS.COMPLETED.value}
                  onSave={this.handleTotalRecVolChange}
                />
              </Description>
              <Description term="创建时间">{inboundHead.created_date
                && moment(inboundHead.created_date).format('YYYY.MM.DD HH:mm')}</Description>
              <Description term="入库时间">{inboundHead.completed_date &&
                moment(inboundHead.completed_date).format('YYYY.MM.DD HH:mm')}</Description>
            </DescriptionList>
          </SidePanel>
          */}
        <Content className="page-content">
          {currentStatus >= CWM_INBOUND_STATUS.ALL_RECEIVED.value &&
            currentStatus < CWM_INBOUND_STATUS.COMPLETED.value &&
            inboundHead.total_received_qty < inboundHead.total_expect_qty &&
            <Alert message="实收数量少于预期数量，全部上架确认后必须手动关闭" type="info" showIcon closable />
          }
          {inboundHead.total_received_qty > inboundHead.total_expect_qty &&
            currentStatus < CWM_INBOUND_STATUS.COMPLETED.value &&
            <Alert message="实收数量超过预期数量，全部上架确认后必须手动关闭" type="warning" showIcon closable />
          }
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={this.state.activeTab} onChange={this.handleTabChange}>
              <TabPane tab="收货明细" key="receiveDetails">
                <ReceiveDetailsPane
                  inboundNo={this.props.params.inboundNo}
                  onVolChange={this.handleTotalRecVolChange}
                />
              </TabPane>
              <TabPane tab="上架明细" key="putawayDetails" disabled={inboundHead.status === CWM_INBOUND_STATUS.CREATED.value}>
                <PutawayDetailsPane inboundNo={this.props.params.inboundNo} />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
