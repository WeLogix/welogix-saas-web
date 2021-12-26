import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Icon, Layout, Tabs, Steps, Button, Tooltip, Radio, Tag, Dropdown, Menu, notification } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import { LogixIcon } from 'client/components/FontIcon';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { CWM_SO_TYPES, CWM_OUTBOUND_STATUS, CWM_SHFTZ_OUT_REGTYPES, CWM_SHFTZ_REG_STATUS_INDICATOR, CWM_SHFTZ_TRANSFER_OUT_STATUS_INDICATOR, SASBL_REG_STATUS } from 'common/constants';
import { loadOutboundHead, updateOutboundMode, toggleSFExpressModal, loadSFExpressConfig } from 'common/reducers/cwmOutbound';
import { getSasblCopNo } from 'common/reducers/cwmSasblReg';
import OrderHeadPane from './tabpane/orderHeadPane';
import OrderDetailsPane from './tabpane/orderDetailsPane';
import PickingDetailsPane from './tabpane/pickingDetailsPane';
import PackingDetailsPane from './tabpane/packingDetailsPane';
import ShippingDetailsPane from './tabpane/shippingDetailsPane';
import XLSPickingList from './print/xlsPickingList';
import PDFPickingList from './print/pdfPickingList';
import PDFShippingList from './print/pdfShippingList';
import PDFShippingConfirm from './print/pdfShippingConfirm';
import SFExpressModal from './modal/SFExpressModal';
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
    outboundHead: state.cwmOutbound.outboundFormHead,
    reload: state.cwmOutbound.outboundReload,
    waybill: state.cwmOutbound.waybill,
    outboundProducts: state.cwmOutbound.wholeOutboundProducts,
  }),
  {
    loadOutboundHead,
    updateOutboundMode,
    toggleSFExpressModal,
    loadSFExpressConfig,
    getSasblCopNo,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShipping',
  jumpOut: true,
})
export default class OutboundDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    updateOutboundMode: PropTypes.func.isRequired,
    toggleSFExpressModal: PropTypes.func.isRequired,
    outboundProducts: PropTypes.arrayOf(PropTypes.shape({ seq_no: PropTypes.number.isRequired })),
    loadSFExpressConfig: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    tabKey: 'orderDetails',
    sasblEntryRegs: [],
  }
  componentDidMount() {
    this.props.loadOutboundHead(this.props.params.outboundNo).then((result) => {
      if (!result.error && result.data) {
        this.props.getSasblCopNo(result.data.so_no, 'so', result.data.bonded_outtype).then((soRegRes) => {
          if (!soRegRes.error) {
            this.setState({ sasblEntryRegs: soRegRes.data });
          }
        });
      }
    });
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
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.props.loadOutboundHead(this.props.params.outboundNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleShippingModeChange = (ev) => {
    this.props.updateOutboundMode(this.props.params.outboundNo, ev.target.value);
  }
  handleTabChange = (tabKey) => {
    this.setState({
      tabKey,
    });
  }
  handleRegPage = (type, number) => {
    let link;
    if (CWM_SHFTZ_OUT_REGTYPES.find(tp => tp.value === type)) {
      const regSoNo = number || this.props.outboundHead.so_no;
      link = type === 'transfer' ? `/cwm/supervision/shftz/transfer/out/${regSoNo}`
        : `/cwm/supervision/shftz/release/${type}/${regSoNo}`;
    } else if (type === 'cosmtn' || type === 'disbat') {
      link = `/cwm/sasbl/stockio/${type}/e/${number}`;
    } else {
      link = `/cwm/sasbl/invtreg/${type}/e/${number}`;
    }

    this.context.router.push(link);
  }
  showExpressModal = () => {
    this.props.loadSFExpressConfig().then((result) => {
      if (result.error) {
        const key = `open${Date.now()}`;
        const btnClick = () => {
          this.context.router.push('/paas/integration/apps');
          notification.close(key);
        };
        const btn = (
          <Button type="primary" size="small" onClick={btnClick}>
            去配置
          </Button>
        );
        notification.open({
          message: '顺丰快递接口',
          description: result.error.message,
          btn,
          key,
          onClose: () => notification.close(key),
        });
      } else {
        const { defaultWhse, outboundHead, outboundProducts } = this.props;
        const withNameProduct = outboundProducts.filter(outPrd => outPrd.name)[0];
        this.props.toggleSFExpressModal(true, {
          ...result.data,
          order_no: outboundHead.outbound_no,
          sender_phone: defaultWhse.whse_tel,
          sender_address: defaultWhse.whse_address,
          sender_contact: defaultWhse.name,
          sender_province: defaultWhse.whse_province,
          sender_city: defaultWhse.whse_city,
          sender_district: defaultWhse.whse_district,
          sender_street: defaultWhse.whse_street,
          sender_region_code: defaultWhse.whse_region_code,

          receiver_phone: outboundHead.receiver_phone || outboundHead.receiver_number,
          receiver_address: outboundHead.receiver_address,
          receiver_contact: outboundHead.receiver_contact,
          receiver_province: outboundHead.receiver_province,
          receiver_city: outboundHead.receiver_city,
          receiver_district: outboundHead.receiver_district,
          receiver_street: outboundHead.receiver_street,
          receiver_region_code: outboundHead.receiver_region_code,

          product_name: withNameProduct ? withNameProduct.name : '',
        });
      }
    });
  }
  render() {
    const { outboundHead, outboundProducts, defaultWhse } = this.props;
    const { outboundNo } = this.props.params;
    const { sasblEntryRegs } = this.state;
    const outbStatus = Object.keys(CWM_OUTBOUND_STATUS).filter(cis =>
      CWM_OUTBOUND_STATUS[cis].value === outboundHead.status)[0];
    const outbNoTitle = outboundHead.cust_order_no ?
      <Tooltip title={outboundNo}>{outboundHead.cust_order_no}</Tooltip> : outboundNo;
    let regTag;
    let regTypes = [];
    // TODO merge to regs
    if (outboundHead.regs) {
      regTypes = outboundHead.regs.map((reg) => {
        const sreg = CWM_SHFTZ_OUT_REGTYPES.filter(sbr => sbr.value === reg.bonded_outtype)[0];
        return {
          tooltip: sreg && sreg.ftztext,
          type: reg.bonded_outtype,
          status: reg.reg_status,
          so_no: reg.so_no,
        };
      });
    } else if (outboundHead.bonded === 1) {
      [regTag] = CWM_SHFTZ_OUT_REGTYPES.filter(sbr =>
        sbr.value === outboundHead.bonded_outtype && sbr.tagcolor);
      if (regTag) {
        regTypes = [{
          tooltip: '关联监管备案',
          type: outboundHead.bonded_outtype,
          status: outboundHead.reg_status,
        }];
      } else if (sasblEntryRegs[0]) {
        if (outboundHead.bonded_outtype === 'cosmtn' || outboundHead.bonded_outtype === 'disbat') { // 寄售维修 || 分送集报
          regTypes = [{
            tooltip: '关联出库单',
            type: outboundHead.bonded_outtype,
            sasbl_status: sasblEntryRegs[0].stock_status,
            copNo: sasblEntryRegs[0].cop_stock_no,
          }];
        } else {
          regTypes = [{
            tooltip: '关联核注清单',
            type: outboundHead.bonded_outtype,
            sasbl_status: sasblEntryRegs[0].invt_status,
            copNo: sasblEntryRegs[0].cop_invt_no,
          }];
        }
      }
    } else if (outboundHead.bonded === -1 && outboundHead.bonded_outtype.length > 0) {
      regTypes = outboundHead.bonded_outtype.map((type, index) => {
        const sreg = CWM_SHFTZ_OUT_REGTYPES.filter(sbr => sbr.value === type)[0];
        return { type, tooltip: sreg && sreg.ftztext, status: outboundHead.reg_status[index] };
      });
    }
    const outboundStep = outbStatus ? CWM_OUTBOUND_STATUS[outbStatus].step : 0;
    const printMenu = (
      <Menu>
        <Menu.Item>
          <XLSPickingList outboundNo={outboundNo} />
        </Menu.Item>
        <Menu.Item>
          <PDFPickingList outboundNo={outboundNo} />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <PDFShippingList outboundNo={outboundNo} />
        </Menu.Item>
        <Menu.Item>
          <PDFShippingConfirm outboundNo={outboundNo} />
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            defaultWhse.name,
            outbNoTitle,
            regTag && <Tag color={regTag.tagcolor}>{regTag.ftztext}</Tag>,
          ]}
          extra={<Steps
            size="small"
            current={outboundStep}
            className="progress-tracker"
            status={outboundHead.status === 5 ? 'finish' : 'process'}
          >
            <Step title="预分配" />
            <Step title="分配" />
            <Step title="拣货" />
            <Step title="装箱" />
            <Step title="发货" />
          </Steps>}
        >
          <PageHeader.Nav>
            {regTypes.map((reg) => {
              const regStatus = reg.type === 'transfer' ?
                CWM_SHFTZ_TRANSFER_OUT_STATUS_INDICATOR.filter(status =>
                  status.value === reg.status)[0] :
                CWM_SHFTZ_REG_STATUS_INDICATOR.filter(status =>
                  status.value === reg.status)[0];
              const sasblRegStatus = SASBL_REG_STATUS.filter(status =>
                status.value === reg.sasbl_status)[0];
              if (regStatus) {
                return (<Tooltip title={reg.tooltip} placement="bottom" key={reg.type}>
                  <Button icon="link" onClick={() => this.handleRegPage(reg.type, reg.so_no)} style={{ marginLeft: 8 }}>
                    <Badge status={regStatus.badge} text={regStatus.text} />
                  </Button>
                </Tooltip>);
              }
              if (sasblRegStatus) {
                return (<Tooltip title={reg.tooltip} placement="bottom" key={reg.type}>
                  <Button icon="link" onClick={() => this.handleRegPage(reg.type, reg.copNo)} style={{ marginLeft: 8 }}>{reg.copNo}
                    <Badge status={sasblRegStatus.badge} text={sasblRegStatus.text} />
                  </Button>
                </Tooltip>);
              }
              return null;
            })
            }
          </PageHeader.Nav>
          <PageHeader.Actions>
            <Dropdown overlay={printMenu}>
              <Button icon="printer">{this.msg('print')} <Icon type="down" /></Button>
            </Dropdown>
            {/*
              this.state.tabKey === 'pickingDetails' &&
                outboundHead.status >= CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value &&
                <Tooltip title="导出拣货单Excel" placement="bottom">
                  <Button icon="export" onClick={this.handleExportPickingListXLS}
                  loading={this.state.expLoad} />
                </Tooltip>
              */
            }
            <Tooltip title="打印顺丰速运面单" placement="bottom">
              <Button onClick={this.showExpressModal} disabled={outboundProducts.length === 0}>
                <LogixIcon type="icon-sf-express" />{outboundHead.real_express_no}
              </Button>
            </Tooltip>
            <RadioGroup
              value={outboundHead.shipping_mode}
              onChange={this.handleShippingModeChange}
              disabled={outboundStep === 5}
            >
              <Tooltip title="无线端出库操作" placement="bottom">
                <RadioButton value="scan"><Icon type="wifi" /></RadioButton>
              </Tooltip>
              <Tooltip title="PC端出库操作" placement="bottomLeft">
                <RadioButton value="manual"><Icon type="desktop" /></RadioButton>
              </Tooltip>
            </RadioGroup>
          </PageHeader.Actions>
        </PageHeader>

        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={this.state.tabKey} onChange={this.handleTabChange}>
              <TabPane tab="订单表头" key="orderHead">
                <OrderHeadPane outboundNo={outboundNo} />
              </TabPane>
              <TabPane tab="订单明细" key="orderDetails">
                <OrderDetailsPane outboundNo={outboundNo} />
              </TabPane>
              <TabPane tab="拣货明细" key="pickingDetails">
                <PickingDetailsPane outboundNo={outboundNo} />
              </TabPane>
              <TabPane tab="装箱明细" key="packingDetails" disabled={outboundHead.so_type === CWM_SO_TYPES[3].value}>
                <PackingDetailsPane outboundNo={outboundNo} />
              </TabPane>
              <TabPane tab="发货明细" key="shippingDetails" disabled={outboundHead.so_type === CWM_SO_TYPES[3].value}>
                <ShippingDetailsPane outboundNo={outboundNo} />
              </TabPane>
            </Tabs>
          </MagicCard>
          <SFExpressModal />
        </Content>
      </Layout>
    );
  }
}
